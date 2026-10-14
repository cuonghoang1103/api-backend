/**
 * codelab-cham-js.mjs — máy chấm JS phía Node cho bộ đề Code Lab (loại 'js' · 'console' · 'module').
 * ─────────────────────────────────────────────────────────────────────────────
 * Dùng bởi scripts/codelab-kiem-de-web.mjs để CHẠY bộ kiểm trên lời giải/code khởi đầu.
 * Lược đồ bộ kiểm: content/codelab/web-foundations-practice/nguon/_luoc-do.mjs (mục "LOẠI js / console / module").
 *
 * Cách chạy (máy chấm trình duyệt ở đợt 2 PHẢI cho cùng kết quả):
 *   - Mỗi KIỂM chạy trong một realm MỚI (node:vm context; trình duyệt: một Worker mới), nạp
 *     `HARNESS` trước (console giả, đồng hồ/hẹn giờ GIẢ, fetch GIẢ), rồi mới nạp code người học.
 *     ⇒ trạng thái toàn cục của kiểm trước không rò sang kiểm sau.
 *   - Hẹn giờ là GIẢ: không ngủ thật. Vòng chạy: xả microtask → nếu còn hẹn giờ thì nhảy đồng hồ
 *     tới hẹn sớm nhất, chạy nó → lặp. Date.now()/performance.now() đọc đồng hồ giả.
 *   - Trần CPU thật mỗi lần chạy mã (`cpuMs`, mặc định 1000ms; vòng lặp vô hạn ⇒ trượt, không treo).
 *     Trần thời gian ẢO `timeoutMs` (mặc định 10000ms ảo).
 *   - fetch là GIẢ, không bao giờ mở mạng: bảng `fetchGia` (lược đồ) ⇒ Response tối giản.
 *   - module: vm.SourceTextModule (cần `node --experimental-vm-modules`; script kiểm tự chạy lại
 *     chính nó với cờ đó khi có đề loại module).
 */
import vm from 'node:vm';

// Code người học (hoặc code khởi đầu cố ý sai) hay để Promise reject mà không ai bắt — trong trình
// duyệt đó chỉ là một cảnh báo console. Node mặc định lại GIẾT tiến trình. Rejection đến từ realm của
// người học (lỗi không phải Error của realm chính) ⇒ bỏ qua; lỗi của chính máy chấm vẫn làm sập như cũ.
process.on('unhandledRejection', (lyDo) => {
  if (lyDo instanceof Error) throw lyDo;
});

/* ═══ HARNESS — chạy BÊN TRONG realm của người học. Nguồn sự thật cho máy chấm trình duyệt. ═══ */
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

/* ═══ so sâu ═══ */
export function laMongDoiLoi(m) {
  return !!m && typeof m === 'object' && !Array.isArray(m) && typeof m.loi === 'string'
    && Object.keys(m).every((k) => k === 'loi' || k === 'thongDiep');
}

function bangSau(a, b, saiSo) {
  if (typeof a === 'number' && typeof b === 'number') return saiSo ? Math.abs(a - b) <= saiSo : a === b;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => bangSau(x, b[i], saiSo));
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && bangSau(a[k], b[k], saiSo));
}

const ngan = (v) => { const s = JSON.stringify(v); return s && s.length > 160 ? `${s.slice(0, 157)}...` : s; };
const tenLoi = (e) => (e && typeof e === 'object' && 'name' in e ? `${e.name}: ${e.message}` : String(e));

/* ═══ realm mới cho mỗi kiểm ═══ */
function taoRealm(tj, k) {
  const ctx = vm.createContext({ URL, URLSearchParams }, { microtaskMode: 'afterEvaluate', codeGeneration: { strings: true, wasm: false } });
  const cpu = k.cpuMs || tj.cpuMs || 1000;
  const chay = (code, filename = 'cham.js') => new vm.Script(code, { filename }).runInContext(ctx, { timeout: cpu });
  chay(HARNESS, 'harness.js');
  const gia = { ...(tj.fetchGia || {}), ...(k.fetchGia || {}) };
  chay(`__fetchGia = ${JSON.stringify(gia)};`);
  return { ctx, chay, cpu };
}

/** vòng sự kiện giả: xả microtask, chạy hẹn giờ tới khi `xongKhi()` đúng hoặc hết hẹn/hết giờ ảo */
function chayVongLap(r, { xongKhi, timeoutMs }) {
  const loiKhongBat = [];
  let buoc = 0, quaHan = false;
  const g0 = r.ctx.__gio();
  for (;;) {
    r.chay('0'); // afterEvaluate ⇒ microtask của realm được xả ngay sau lần chạy này
    if (xongKhi()) break;
    const ke = r.ctx.__henKeTiep();
    if (ke == null) break;
    if (ke - g0 > timeoutMs) { quaHan = true; break; }
    if (++buoc > 20000) { quaHan = true; break; }
    try { r.chay('__chayHen()'); } catch (e) {
      if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw e;
      loiKhongBat.push(tenLoi(e));
    }
  }
  return { loiKhongBat, quaHan };
}

function soKetQua(k, r, { loiKhongBat, quaHan }, timeoutMs) {
  const so = k.so || 'giaTri';
  if (so === 'console') {
    const log = [...r.ctx.__log];
    if (k.goi && r.ctx.__trangThai === 'loi' && !laMongDoiLoi(k.mongDoi)) return { dat: false, thay: `ném ${tenLoi(r.ctx.__kq)} · console: ${ngan(log)}` };
    const dat = bangSau(log, k.mongDoi);
    return { dat, thay: `${ngan(log)}${loiKhongBat.length ? ` · lỗi không bắt: ${loiKhongBat[0]}` : ''}${quaHan ? ' · hết giờ ảo' : ''}` };
  }
  const tt = r.ctx.__trangThai;
  if (tt === 'cho') return { dat: false, thay: quaHan ? `Promise chưa xong sau ${timeoutMs}ms ảo` : 'Promise không bao giờ settle (không còn hẹn giờ nào)' };
  if (laMongDoiLoi(k.mongDoi)) {
    if (tt !== 'loi') return { dat: false, thay: `không ném lỗi — trả về ${ngan(r.ctx.__chuanHoa(r.ctx.__kq))}` };
    const e = r.ctx.__kq;
    const tenDung = e && e.name === k.mongDoi.loi;
    const tdDung = !k.mongDoi.thongDiep || new RegExp(k.mongDoi.thongDiep, 'i').test(String(e && e.message));
    return { dat: tenDung && tdDung, thay: tenLoi(e) };
  }
  if (tt === 'loi') return { dat: false, thay: `ném ${tenLoi(r.ctx.__kq)}` };
  const got = r.ctx.__chuanHoa(r.ctx.__kq);
  return { dat: bangSau(got, k.mongDoi, k.saiSo), thay: ngan(got) };
}

function thanGoi(k) {
  return `__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi || 'undefined'}) };\n});`;
}

/** loại 'js' và 'console': nạp tệp (script cổ điển, chung một realm), rồi gọi `goi` */
export function chamKiemJs(tj, k, files) {
  const timeoutMs = k.timeoutMs || tj.timeoutMs || 10000;
  const mac = tj.loai === 'console' ? 'console' : 'giaTri';
  k = { so: mac, ...k };
  let r;
  try {
    r = taoRealm(tj, k);
    for (const t of tj.tepNap || [tj.tepChinh]) {
      if (files[t] == null) return { dat: false, thay: `thiếu tệp ${t}` };
      try { r.chay(files[t], t); } catch (e) {
        if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') return { dat: false, thay: `${t} chạy quá ${r.cpu}ms (vòng lặp vô hạn?)` };
        if (k.so === 'console' && !k.goi) { /* lỗi lúc nạp: vẫn so console đã in */ r.loiNap = tenLoi(e); }
        else return { dat: false, thay: `lỗi khi nạp ${t}: ${tenLoi(e)}` };
      }
    }
    if (k.goi || k.chuanBi) r.chay(thanGoi(k));
    const coGoi = !!(k.goi || k.chuanBi);
    const vl = chayVongLap(r, {
      timeoutMs,
      xongKhi: () => (k.so === 'console' ? false : (!coGoi || r.ctx.__trangThai !== 'cho')),
    });
    if (r.loiNap) vl.loiKhongBat.unshift(r.loiNap);
    return soKetQua(k, r, vl, timeoutMs);
  } catch (e) {
    if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') return { dat: false, thay: `quá ${r?.cpu ?? 1000}ms CPU (vòng lặp vô hạn?)` };
    return { dat: false, thay: `lỗi máy chấm: ${tenLoi(e)}` };
  }
}

/* ═══ loại 'module' ═══ */
function giaiDuongDan(spec, tu) {
  if (!/^\.{1,2}\//.test(spec)) return null; // tên gói (express, react…) — không có trong bài
  const phan = tu.split('/').slice(0, -1);
  for (const p of spec.split('/')) {
    if (p === '.' || p === '') continue;
    if (p === '..') phan.pop(); else phan.push(p);
  }
  return phan.join('/');
}

export async function chamKiemModule(tj, k, files) {
  if (!vm.SourceTextModule) return { boQua: 'cần node --experimental-vm-modules' };
  const timeoutMs = k.timeoutMs || tj.timeoutMs || 10000;
  k = { so: 'giaTri', ...k };
  let r;
  try {
    r = taoRealm(tj, k);
    const mods = {}, loiTep = {};
    for (const [ten, code] of Object.entries(files)) {
      if (!ten.endsWith('.js') && !ten.endsWith('.mjs')) continue;
      try { mods[ten] = new vm.SourceTextModule(code, { context: r.ctx, identifier: ten }); }
      catch (e) { loiTep[ten] = tenLoi(e); }
    }
    const linker = (spec, ref) => {
      const p = giaiDuongDan(spec, ref.identifier);
      if (p == null || !mods[p]) {
        throw new (vm.runInContext('TypeError', r.ctx))(`Failed to resolve module specifier "${spec}" (từ ${ref.identifier})${p && !/\.m?js$/.test(p) && mods[`${p}.js`] ? ' — thiếu đuôi .js' : ''}`);
      }
      return mods[p];
    };
    const nap = async (ten) => {
      if (loiTep[ten]) return false;
      const m = mods[ten];
      if (!m) { loiTep[ten] = `không có tệp ${ten}`; return false; }
      try {
        if (m.status === 'unlinked') await m.link(linker);
        if (m.status === 'linked') {
          // top-level await có thể chờ hẹn giờ/fetch GIẢ ⇒ phải tự quay vòng sự kiện trong lúc chờ
          const p = m.evaluate({ timeout: r.cpu });
          let xong = false;
          p.then(() => { xong = true; }, () => { xong = true; });
          for (let i = 0; i < 20000 && !xong; i++) {
            r.chay('0');
            await new Promise((ok) => setImmediate(ok));
            if (xong) break;
            if (r.ctx.__henKeTiep() == null) break;
            r.chay('__chayHen()');
          }
          if (!xong) { loiTep[ten] = 'top-level await không bao giờ xong'; return false; }
          await p;
        }
        if (m.status === 'errored') { loiTep[ten] = tenLoi(m.error); return false; }
        return true;
      } catch (e) {
        if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') loiTep[ten] = `quá ${r.cpu}ms CPU`;
        else loiTep[ten] = tenLoi(e);
        return false;
      }
    };
    const chinh = tj.tepChinh || 'main.js';
    const okChinh = await nap(chinh);
    if (k.kiem === 'nap-duoc') {
      const t = k.tep || chinh;
      const ok = t === chinh ? okChinh : await nap(t);
      return { dat: ok, thay: ok ? 'nạp được' : loiTep[t] };
    }
    if (k.so === 'console') {
      const vl = chayVongLap(r, { timeoutMs, xongKhi: () => false });
      if (!okChinh) vl.loiKhongBat.unshift(loiTep[chinh]);
      return soKetQua(k, r, vl, timeoutMs);
    }
    // giá trị: nạp nốt mọi tệp để __module() dùng được
    for (const t of Object.keys(mods)) if (t !== chinh) await nap(t);
    r.ctx.__module = (p) => {
      const t = giaiDuongDan(p.startsWith('.') ? p : `./${p}`, chinh);
      if (loiTep[t]) throw new (vm.runInContext('Error', r.ctx))(`module ${t} không nạp được: ${loiTep[t]}`);
      if (!mods[t]) throw new (vm.runInContext('Error', r.ctx))(`không có tệp ${t}`);
      return mods[t].namespace;
    };
    r.chay(thanGoi(k));
    const vl = chayVongLap(r, { timeoutMs, xongKhi: () => r.ctx.__trangThai !== 'cho' });
    return soKetQua(k, r, vl, timeoutMs);
  } catch (e) {
    if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') return { dat: false, thay: 'quá thời gian CPU (vòng lặp vô hạn?)' };
    return { dat: false, thay: `lỗi máy chấm: ${tenLoi(e)}` };
  }
}
