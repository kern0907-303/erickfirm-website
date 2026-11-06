import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const tracker = fs.readFileSync(new URL('../public/track.js', import.meta.url), 'utf8');

function runTracker({ hostname = 'erickfirm.com', search = '', initialCookies = [] } = {}) {
  const cookies = new Map(initialCookies);
  const writes = [];
  const document = {
    visibilityState: 'visible',
    documentElement: { scrollHeight: 0, scrollTop: 0 },
    head: { append() {} },
    createElement: () => ({}),
    getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
    addEventListener() {},
    removeEventListener() {},
    set cookie(value) {
      writes.push(value);
      const pair = value.split(';', 1)[0];
      const index = pair.indexOf('=');
      if (index > 0) cookies.set(pair.slice(0, index), pair.slice(index + 1));
    },
    get cookie() {
      return [...cookies].map(([name, value]) => `${name}=${value}`).join('; ');
    }
  };
  const context = {
    document,
    location: { hostname, search, pathname: '/nas/quiz/' },
    history: { pushState() {}, replaceState() {} },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    URLSearchParams,
    Date,
    Math,
    setInterval() {},
    setTimeout() {},
    addEventListener() {},
    pageYOffset: 0,
    innerHeight: 0,
    console
  };
  context.window = context;
  vm.runInNewContext(tracker, context);
  return { context, cookies, writes };
}

test('同一追蹤程式在官網讀取 90 天來源 cookie 並用 Pixel fbc 格式保存 fbclid', () => {
  const { context, cookies, writes } = runTracker({
    search: '?utm_source=meta&utm_campaign=TEST&utm_content=TEST_AD&fbclid=TESTCLICK123'
  });
  assert.equal(decodeURIComponent(cookies.get('nas_utm_source')), 'meta');
  assert.equal(decodeURIComponent(cookies.get('nas_utm_campaign')), 'TEST');
  assert.equal(decodeURIComponent(cookies.get('nas_utm_content')), 'TEST_AD');
  assert.equal(decodeURIComponent(cookies.get('nas_fbclid')), 'TESTCLICK123');
  assert.match(decodeURIComponent(cookies.get('_fbc')), /^fb\.1\.\d{13}\.TESTCLICK123$/);
  assert.ok(writes.every((value) => value.includes('Max-Age=7776000') && value.includes('Domain=.erickfirm.com') && value.includes('SameSite=Lax; Secure')));
  context.efMetaEvent('InitiateCheckout', { value: 1280 }, 'NAS27ABCDEF012345678');
  const checkoutEvent = context.fbq.queue.map((args) => [...args]).find((args) => args[1] === 'InitiateCheckout');
  assert.equal(checkoutEvent[3].eventID, 'NAS27ABCDEF012345678');
});

test('付款子網域沿用既有 Pixel fbc，空白 UTM 不會清除已保存來源', () => {
  const pixelFbc = 'fb.1.1730000000000.pixel-click';
  const { cookies } = runTracker({
    hostname: 'pay.erickfirm.com',
    search: '?utm_campaign=NEW',
    initialCookies: [['nas_utm_source', 'meta'], ['_fbc', pixelFbc]]
  });
  assert.equal(cookies.get('nas_utm_source'), 'meta');
  assert.equal(decodeURIComponent(cookies.get('nas_utm_campaign')), 'NEW');
  assert.equal(decodeURIComponent(cookies.get('_fbc')), pixelFbc);
});
