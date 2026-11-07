// 平衡空間廣告歸因：落地保存 utm／fbclid、跨 *.erickfirm.com 連結自動補參數、打 NAS API 自動帶齊歸因與 event_id。
// 主站 erickfirm.com 與 pay.erickfirm.com 共用同一份（/shared/nas-track.js）。
// cookie 名稱需符合 public/shared/nas-attribution.mjs 的合約。
(function () {
  "use strict";
  if (window.NasTrack) return;

  var PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"];
  var COOKIE = {
    utm_source: "nas_utm_source",
    utm_medium: "nas_utm_medium",
    utm_campaign: "nas_utm_campaign",
    utm_content: "nas_utm_content",
    fbclid: "nas_fbclid"
  };
  var STORE_KEY = "nas_track_attribution";
  var TTL_DAYS = 7;
  var TTL_MS = TTL_DAYS * 86400000;
  var VALUE_PATTERN = /^[^\u0000-\u001f<>"';]{1,500}$/;
  var FBCLID_PATTERN = /^[A-Za-z0-9._-]{1,250}$/;
  var FBC_PATTERN = /^fb\.1\.\d{10,13}\.[A-Za-z0-9._-]{1,250}$/;

  function onErickfirm(host) {
    return host === "erickfirm.com" || /\.erickfirm\.com$/.test(host);
  }

  function cookieDomain() {
    return onErickfirm(location.hostname) ? "; Domain=.erickfirm.com" : "";
  }

  function readCookie(name) {
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (part.indexOf(name + "=") !== 0) continue;
      try { return decodeURIComponent(part.slice(name.length + 1)); } catch (e) { return ""; }
    }
    return "";
  }

  function writeCookie(name, value) {
    try {
      document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=" + (TTL_DAYS * 86400) +
        "; Path=/" + cookieDomain() + "; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    } catch (e) { /* 存不了就算了 */ }
  }

  function clean(source) {
    var out = {};
    for (var i = 0; i < PARAMS.length; i++) {
      var name = PARAMS[i];
      var value = source && typeof source[name] === "string" ? source[name].trim() : "";
      if (!value || !VALUE_PATTERN.test(value)) continue;
      if (name === "fbclid" && !FBCLID_PATTERN.test(value)) continue;
      out[name] = value.slice(0, 500);
    }
    return out;
  }

  function fromUrl() {
    var query = new URLSearchParams(location.search);
    var raw = {};
    for (var i = 0; i < PARAMS.length; i++) {
      var value = query.get(PARAMS[i]);
      if (value) raw[PARAMS[i]] = value;
    }
    return clean(raw);
  }

  function fromCookies() {
    var raw = {};
    for (var i = 0; i < PARAMS.length; i++) raw[PARAMS[i]] = readCookie(COOKIE[PARAMS[i]]);
    return clean(raw);
  }

  function fromStorage() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (parsed && Date.now() - Number(parsed.captured_at) <= TTL_MS) return clean(parsed);
    } catch (e) { /* localStorage 可能不能用 */ }
    return {};
  }

  function merge() {
    var out = {};
    for (var s = 0; s < arguments.length; s++) {
      var source = arguments[s];
      for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) out[key] = source[key];
    }
    return out;
  }

  function hasAny(value) {
    for (var i = 0; i < PARAMS.length; i++) if (value[PARAMS[i]]) return true;
    return false;
  }

  // 落地：網址上有 utm 就整組換新；只有 fbclid 時保留舊的 utm、只換 fbclid。
  function capture() {
    var current = fromUrl();
    if (!hasAny(current)) return;
    var hasUtm = current.utm_source || current.utm_medium || current.utm_campaign || current.utm_content;
    var next = hasUtm ? current : merge(fromStorage(), fromCookies(), current);
    for (var i = 0; i < PARAMS.length; i++) {
      var name = PARAMS[i];
      if (next[name]) writeCookie(COOKIE[name], next[name]);
    }
    try { localStorage.setItem(STORE_KEY, JSON.stringify(merge(next, { captured_at: Date.now() }))); } catch (e) { /* 可略過 */ }
    if (current.fbclid) {
      var existing = readCookie("_fbc");
      var existingClick = FBC_PATTERN.test(existing) ? existing.split(".").slice(3).join(".") : "";
      if (existingClick !== current.fbclid) writeCookie("_fbc", "fb.1." + Date.now() + "." + current.fbclid);
    }
  }

  function attribution() {
    return merge(fromStorage(), fromCookies(), fromUrl());
  }

  function fbc() {
    var cookie = readCookie("_fbc");
    if (FBC_PATTERN.test(cookie)) return cookie;
    var click = attribution().fbclid;
    return click ? "fb.1." + Date.now() + "." + click : "";
  }

  function eventId(prefix) {
    var random = "";
    try {
      var bytes = crypto.getRandomValues(new Uint8Array(12));
      for (var i = 0; i < bytes.length; i++) random += ("0" + bytes[i].toString(16)).slice(-2);
    } catch (e) {
      random = Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
    return ((prefix ? String(prefix).replace(/[^A-Za-z0-9_-]/g, "") + "_" : "") + random).slice(0, 100);
  }

  // 替跨到 *.erickfirm.com 其他網域的網址補上歸因（已經帶的參數不覆蓋）。
  function decorate(href) {
    var url;
    try { url = new URL(href, location.href); } catch (e) { return href; }
    if (!/^https?:$/.test(url.protocol) || !onErickfirm(url.hostname) || url.hostname === location.hostname) return href;
    var values = attribution();
    var changed = false;
    for (var i = 0; i < PARAMS.length; i++) {
      var name = PARAMS[i];
      if (values[name] && !url.searchParams.has(name)) { url.searchParams.set(name, values[name]); changed = true; }
    }
    return changed ? url.toString() : href;
  }

  function decorateLink(link) {
    if (!link || !link.getAttribute) return;
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto|tel|javascript):/i.test(href)) return;
    var next = decorate(href);
    if (next !== href) link.setAttribute("href", next);
  }

  function decorateAll() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) decorateLink(links[i]);
  }

  function onPointer(event) {
    var node = event.target;
    while (node && node !== document) {
      if (node.tagName === "A") { decorateLink(node); return; }
      node = node.parentNode;
    }
  }

  // 打 NAS API：body 自動帶 utm_*、fbclid、fbc、event_id（呼叫端給的值優先），並帶 cookie。
  function post(url, body, options) {
    var payload = merge(attribution(), { fbc: fbc() });
    var extra = body || {};
    for (var key in extra) {
      if (!Object.prototype.hasOwnProperty.call(extra, key)) continue;
      // 呼叫端給空字串的歸因欄位不覆蓋已保存的值
      if ((key === "fbc" || PARAMS.indexOf(key) !== -1) && !extra[key]) continue;
      payload[key] = extra[key];
    }
    if (!payload.event_id) payload.event_id = eventId((options && options.eventPrefix) || "nas");
    var init = merge({
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    }, (options && options.fetch) || {});
    var request = fetch(url, init);
    request.eventId = payload.event_id;
    return request;
  }

  capture();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decorateAll);
  else decorateAll();
  document.addEventListener("pointerdown", onPointer, true);
  document.addEventListener("click", onPointer, true);

  window.NasTrack = {
    attribution: attribution,
    fbc: fbc,
    eventId: eventId,
    decorate: decorate,
    post: post
  };
})();
