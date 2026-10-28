/* global fbq */
(function () {
  'use strict';
  var PIXEL_ID = '2190696845179895';
  var host = location.hostname;
  if (host !== 'erickfirm.com' && host !== 'www.erickfirm.com') return;
  try {
    if (location.search.indexOf('notrack=1') !== -1) localStorage.setItem('ek_notrack', '1');
    if (location.search.indexOf('notrack=0') !== -1) localStorage.removeItem('ek_notrack');
    if (localStorage.getItem('ek_notrack') === '1') return;
  } catch (e) {}

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);

  var state = { path: '', seconds: 0, fired: {} };

  function normPath() {
    var p = location.pathname || '/';
    return p.length > 1 && p.charAt(p.length - 1) === '/' ? p.slice(0, -1) : p;
  }

  function pageStart() {
    state.path = normPath();
    state.seconds = 0;
    state.fired = {};
    fbq('track', 'PageView');
    if (state.path === '/abl/2027') {
      fbq('track', 'ViewContent', { content_name: 'abl_2027', content_category: 'abl' });
    }
  }

  function fireOnce(name) {
    if (state.fired[name]) return;
    state.fired[name] = true;
    fbq('trackCustom', name, { path: state.path });
  }

  setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    state.seconds += 1;
    if (state.seconds === 15) fireOnce('Stay15s');
    if (state.seconds === 30) fireOnce('Stay30s');
    if (state.seconds === 60) fireOnce('Stay60s');
  }, 1000);

  function onScroll() {
    var doc = document.documentElement;
    var total = doc.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    var pct = ((window.pageYOffset || doc.scrollTop) / total) * 100;
    if (pct >= 50) fireOnce('Scroll50');
    if (pct >= 90) fireOnce('Scroll90');
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // 給頁面元件呼叫的關鍵事件（例如計算器看完結果）。同一頁只送一次。
  // 不在正式網域或設了 notrack 時，這個函式不存在，頁面呼叫 window.efTrack?.() 會自動略過。
  window.efTrack = function (name, params) {
    if (typeof name !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(name)) return;
    var key = 'ef:' + name;
    if (state.fired[key]) return;
    state.fired[key] = true;
    var data = { path: state.path };
    if (params && typeof params === 'object') {
      for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) data[k] = params[k];
    }
    fbq('trackCustom', name, data);
  };

  function routeChanged() {
    if (normPath() !== state.path) pageStart();
  }
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () {
      var r = orig.apply(this, arguments);
      setTimeout(routeChanged, 0);
      return r;
    };
  });
  window.addEventListener('popstate', function () { setTimeout(routeChanged, 0); });

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('pay.erickfirm.com') !== -1) {
      fbq('track', 'InitiateCheckout', { content_name: state.path });
    } else if (href.indexOf('lin.ee') !== -1 || href.indexOf('line.me') !== -1) {
      fbq('trackCustom', 'ClickLine', { path: state.path });
    }
  }, true);

  pageStart();
})();
