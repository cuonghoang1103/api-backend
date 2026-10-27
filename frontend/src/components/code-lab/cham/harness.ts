/**
 * HARNESS của máy chấm JS — BẢN SAO NGUYÊN VĂN của `HARNESS` trong scripts/codelab-cham-js.mjs
 * (máy chấm Node dùng để kiểm đề). Chạy BÊN TRONG Worker của người học: console giả, đồng hồ +
 * hẹn giờ GIẢ, fetch GIẢ, structuredClone tối giản, chuẩn hoá giá trị để so sâu.
 * Hai bản phải giống từng byte — test: frontend/src/components/code-lab/cham/cham.test.ts.
 * Sửa ở scripts/codelab-cham-js.mjs rồi chép nguyên văn sang đây (test sẽ đỏ nếu lệch).
 */
export const HARNESS = String.raw`
(function (G) {
  'use strict';
  // ── console giả: mọi console.log/info/warn/error/debug ghi vào MỘT dãy dòng, theo thứ tự gọi ──
  const fmt = (v) => {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
    if (typeof v === 'function') return '[Function]';
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (v instanceof Promise) return 'Promise {…}';
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  };
  G.__log = [];
  const ghi = (...a) => { G.__log.push(a.map(fmt).join(' ')); };
  G.console = { log: ghi, info: ghi, warn: ghi, error: ghi, debug: ghi };

  // ── đồng hồ + hẹn giờ GIẢ ──
  let gio = 0, soHen = 0;
  const hen = [];
  const MOC = 1767225600000; // 2026-01-01T00:00:00Z — Date.now() = MOC + đồng hồ ảo
  G.setTimeout = (fn, ms, ...args) => { const t = { id: ++soHen, khi: gio + Math.max(0, +ms || 0), fn, args, lap: 0 }; hen.push(t); return t.id; };
  G.setInterval = (fn, ms, ...args) => { const d = Math.max(1, +ms || 0); const t = { id: ++soHen, khi: gio + d, fn, args, lap: d }; hen.push(t); return t.id; };
  G.clearTimeout = G.clearInterval = (id) => { const i = hen.findIndex((t) => t.id === id); if (i >= 0) hen.splice(i, 1); };
  G.queueMicrotask = (fn) => { Promise.resolve().then(fn); };
  Date.now = () => MOC + gio;
  G.performance = { now: () => gio };
  const sap = () => hen.sort((a, b) => a.khi - b.khi || a.id - b.id);
  G.__gio = () => gio;
  G.__henKeTiep = () => (hen.length ? sap()[0].khi : null);
  G.__chayHen = () => {
    const t = sap().shift();
    gio = Math.max(gio, t.khi);
    if (t.lap) { t.khi = gio + t.lap; hen.push(t); }
    if (typeof t.fn === 'function') t.fn(...t.args);
  };

  // ── fetch GIẢ ──
  G.__fetchGia = {};
  G.__fetchDaGoi = [];
  const daDung = {};
  class PhanHoiGia {
    constructor(status, body, url, headers) {
      this.status = status; this.ok = status >= 200 && status < 300; this.url = url;
      this.statusText = ({ 200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 500: 'Internal Server Error', 503: 'Service Unavailable' })[status] || '';
      const h = {}; for (const k of Object.keys(headers || {})) h[k.toLowerCase()] = String(headers[k]);
      this.headers = { get: (k) => h[String(k).toLowerCase()] ?? null, has: (k) => String(k).toLowerCase() in h };
      this._body = body; this.bodyUsed = false;
    }
    _doc() {
      if (this.bodyUsed) return Promise.reject(new TypeError('Body has already been consumed.'));
      this.bodyUsed = true; return Promise.resolve(this._body);
    }
    text() { return this._doc(); }
    json() { return this._doc().then((s) => JSON.parse(s)); }
  }
  G.Response = PhanHoiGia;
  G.fetch = (url, init) => {
    init = init || {};
    url = String(url);
    const method = String(init.method || 'GET').toUpperCase();
    const headers = {}; const ih = init.headers || {};
    for (const k of Object.keys(ih)) headers[k] = ih[k];
    G.__fetchDaGoi.push({ url, method, headers, body: init.body === undefined ? null : init.body });
    const khoa = (method + ' ' + url) in G.__fetchGia ? method + ' ' + url : url;
    let m = G.__fetchGia[khoa];
    if (Array.isArray(m)) { const i = daDung[khoa] = (daDung[khoa] ?? -1) + 1; m = m[Math.min(i, m.length - 1)]; }
    return new Promise((res, rej) => {
      G.setTimeout(() => {
        if (!m) return res(new PhanHoiGia(404, 'Not Found', url, { 'content-type': 'text/plain' }));
        if (m.loiMang) return rej(new TypeError('Failed to fetch'));
        const laJson = 'json' in m;
        res(new PhanHoiGia(m.status ?? 200, laJson ? JSON.stringify(m.json) : (m.text ?? ''), url,
          Object.assign({ 'content-type': laJson ? 'application/json' : 'text/plain' }, m.headers || {})));
      }, m && m.treMs != null ? m.treMs : 50);
    });
  };

  // ── structuredClone tối giản (object/mảng/Date/Map/Set) ──
  G.structuredClone = function sc(v, seen = new Map()) {
    if (v === null || typeof v !== 'object') {
      if (typeof v === 'function') throw new TypeError('function could not be cloned');
      return v;
    }
    if (seen.has(v)) return seen.get(v);
    if (v instanceof Date) return new Date(v.getTime());
    if (v instanceof Map) { const m = new Map(); seen.set(v, m); v.forEach((x, k) => m.set(sc(k, seen), sc(x, seen))); return m; }
    if (v instanceof Set) { const s = new Set(); seen.set(v, s); v.forEach((x) => s.add(sc(x, seen))); return s; }
    const o = Array.isArray(v) ? [] : {}; seen.set(v, o);
    for (const k of Object.keys(v)) o[k] = sc(v[k], seen);
    return o;
  };

  // ── chuẩn hoá giá trị để so sâu với mongDoi (JSON) ──
  G.__chuanHoa = function ch(v, dangDi = []) {
    if (v === undefined) return { $js: 'undefined' };
    if (typeof v === 'number') {
      if (Number.isNaN(v)) return { $js: 'NaN' };
      if (!Number.isFinite(v)) return { $js: v > 0 ? 'Infinity' : '-Infinity' };
      return Object.is(v, -0) ? 0 : v;
    }
    if (v === null || typeof v === 'string' || typeof v === 'boolean') return v;
    if (typeof v === 'bigint') return { $js: 'bigint', giaTri: String(v) };
    if (typeof v === 'function') return { $js: 'function' };
    if (typeof v === 'symbol') return { $js: 'symbol' };
    if (v instanceof Promise) return { $js: 'Promise' };
    if (dangDi.includes(v)) return { $js: 'vong-lap' };
    const di = dangDi.concat([v]);
    if (Array.isArray(v)) { const a = []; for (let i = 0; i < v.length; i++) a.push(ch(v[i], di)); return a; }
    if (v instanceof Error) return { $js: 'Error', name: v.name, message: v.message };
    if (v instanceof Date) return { $js: 'Date', iso: isNaN(v) ? 'Invalid Date' : v.toISOString() };
    if (v instanceof Map) return { $js: 'Map', muc: [...v].map(([k, x]) => [ch(k, di), ch(x, di)]) };
    if (v instanceof Set) return { $js: 'Set', muc: [...v].map((x) => ch(x, di)) };
    const o = {}; for (const k of Object.keys(v)) o[k] = ch(v[k], di);
    return o;
  };

  // ── chạy một lời gọi kiểm ──
  G.__trangThai = 'chua';
  G.__batDau = (fn) => {
    G.__trangThai = 'cho';
    let p;
    try { p = fn(); } catch (e) { G.__trangThai = 'loi'; G.__kq = e; return; }
    p.then((r) => { G.__trangThai = 'xong'; G.__kq = r.v; }, (e) => { G.__trangThai = 'loi'; G.__kq = e; });
  };
})(globalThis);
`;
