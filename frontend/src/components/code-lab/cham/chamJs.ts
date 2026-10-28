/**
 * Máy chấm JS trong trình duyệt — loại 'js' · 'console' · 'module' (đợt Academy 28/10/2026).
 *
 * BẢN TRÌNH DUYỆT của scripts/codelab-cham-js.mjs (máy chấm Node dùng để kiểm đề) — cùng luật:
 *   - mỗi KIỂM chạy trong một Worker MỚI (realm mới) ⇒ trạng thái toàn cục không rò giữa các kiểm;
 *   - nạp HARNESS (harness.ts — bản sao nguyên văn) trước: console/hẹn giờ/fetch GIẢ;
 *   - tệp `tepNap` nạp như script CỔ ĐIỂN dùng chung realm (`importScripts(blob:)` ⇒ `const f` cấp
 *     cao nhất gọi được từ `goi`); `goi` chạy trong `async () => { chuanBi; return { v: (goi) } }`;
 *   - vòng sự kiện GIẢ: nhường một macrotask (xả microtask) → chạy hẹn giờ sớm nhất → lặp;
 *   - trần thời gian THẬT do trang giữ: quá ⇒ `terminate()` ⇒ "vòng lặp vô hạn?" (không treo tab).
 *   - 'module': mỗi tệp → blob: URL, viết lại specifier tương đối sang blob của tệp đích; `__module(p)`.
 *
 * App desktop: CSP cấm eval trên trang; worker `blob:` thừa kế CSP đó ⇒ dùng worker HỘP CÁT
 * (`__CT_HOP_CAT_WORKER__`, CSP riêng: được eval, KHÔNG ra mạng — desktop/src/main/security.ts).
 * Ở đó `importScripts(blob:)` bị chặn ⇒ ghép mọi tệp + lời gọi vào MỘT lần eval gián tiếp (khác
 * Node ở một chỗ nhỏ: lỗi chạy ở tệp đầu làm các tệp sau không nạp). 'module' cần import(blob:) ⇒
 * trong app báo "chấm trên web".
 */
import { HARNESS } from './harness';
import type { Kiem, KetQuaKiem, TepMap, TestsJson } from './kieu';

const WORKER_SRC = String.raw`
var __HARNESS__ = null;
self.onmessage = function (ev) {
  var d = ev.data || {};
  if (d.harness) { __HARNESS__ = d.harness; return; }
  chay(d).then(function (kq) { self.postMessage(kq); }, function (e) {
    self.postMessage({ dat: false, thay: 'lỗi máy chấm: ' + (e && e.message ? e.message : String(e)) });
  });
};

var __stThat = self.setTimeout.bind(self); // giữ bản THẬT trước khi HARNESS thay bằng hẹn giờ giả
function nguThat(ms) { return new Promise(function (r) { __stThat(r, ms); }); }
var MC = new MessageChannel();
var choMacro = [];
MC.port1.onmessage = function () { var f = choMacro.shift(); if (f) f(); };
function nghi() { return new Promise(function (r) { choMacro.push(r); MC.port2.postMessage(0); }); }

function tenLoi(e) { return e && typeof e === 'object' && 'name' in e ? e.name + ': ' + e.message : String(e); }
function ngan(v) { var s = JSON.stringify(v); return s && s.length > 160 ? s.slice(0, 157) + '...' : s; }
function laMongDoiLoi(m) {
  return !!m && typeof m === 'object' && !Array.isArray(m) && typeof m.loi === 'string'
    && Object.keys(m).every(function (k) { return k === 'loi' || k === 'thongDiep'; });
}
function bangSau(a, b, saiSo) {
  if (typeof a === 'number' && typeof b === 'number') return saiSo ? Math.abs(a - b) <= saiSo : a === b;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every(function (x, i) { return bangSau(x, b[i], saiSo); });
  var ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every(function (k) { return Object.prototype.hasOwnProperty.call(b, k) && bangSau(a[k], b[k], saiSo); });
}

// importScripts(blob:) — chuẩn trên web. Bị CSP chặn (app desktop) ⇒ ghép rồi eval một lần.
var coImportScripts = (function () {
  try {
    var u = URL.createObjectURL(new Blob(['self.__thuNap = 1;'], { type: 'text/javascript' }));
    importScripts(u); URL.revokeObjectURL(u);
    return self.__thuNap === 1;
  } catch (e) { return false; }
})();
function napScript(code, ten) {
  if (coImportScripts) {
    var u = URL.createObjectURL(new Blob([code + '\n//# sourceURL=' + ten], { type: 'text/javascript' }));
    try { importScripts(u); } finally { URL.revokeObjectURL(u); }
  } else {
    (0, eval)(code + '\n//# sourceURL=' + ten);
  }
}

function thanGoi(k) {
  return '__batDau(async () => {\n' + (k.chuanBi || '') + '\nreturn { v: (' + (k.goi || 'undefined') + ') };\n});';
}

async function chayVongLap(xongKhi, timeoutMs) {
  var loiKhongBat = [], buoc = 0, quaHan = false;
  var g0 = self.__gio();
  for (;;) {
    await nghi();
    if (xongKhi()) break;
    var ke = self.__henKeTiep();
    if (ke == null) break;
    if (ke - g0 > timeoutMs) { quaHan = true; break; }
    if (++buoc > 20000) { quaHan = true; break; }
    try { self.__chayHen(); } catch (e) { loiKhongBat.push(tenLoi(e)); }
  }
  return { loiKhongBat: loiKhongBat, quaHan: quaHan };
}

function soKetQua(k, vl, timeoutMs, loiNap) {
  var so = k.so || 'giaTri';
  if (so === 'console') {
    var log = self.__log.slice();
    if (k.goi && self.__trangThai === 'loi' && !laMongDoiLoi(k.mongDoi)) return { dat: false, thay: 'ném ' + tenLoi(self.__kq) + ' · console: ' + ngan(log) };
    var loi = (loiNap ? [loiNap] : []).concat(vl.loiKhongBat);
    return { dat: bangSau(log, k.mongDoi), thay: ngan(log) + (loi.length ? ' · lỗi không bắt: ' + loi[0] : '') + (vl.quaHan ? ' · hết giờ ảo' : '') };
  }
  var tt = self.__trangThai;
  if (tt === 'cho') return { dat: false, thay: vl.quaHan ? 'Promise chưa xong sau ' + timeoutMs + 'ms ảo' : 'Promise không bao giờ settle (không còn hẹn giờ nào)' };
  if (laMongDoiLoi(k.mongDoi)) {
    if (tt !== 'loi') return { dat: false, thay: 'không ném lỗi — trả về ' + ngan(self.__chuanHoa(self.__kq)) };
    var e = self.__kq;
    var tenDung = e && e.name === k.mongDoi.loi;
    var tdDung = !k.mongDoi.thongDiep || new RegExp(k.mongDoi.thongDiep, 'i').test(String(e && e.message));
    return { dat: !!(tenDung && tdDung), thay: tenLoi(e) };
  }
  if (tt === 'loi') return { dat: false, thay: 'ném ' + tenLoi(self.__kq) };
  var got = self.__chuanHoa(self.__kq);
  return { dat: bangSau(got, k.mongDoi, k.saiSo), thay: ngan(got) };
}

function giaiDuongDan(spec, tu) {
  if (!/^\.{1,2}\//.test(spec)) return null;
  var phan = tu.split('/').slice(0, -1);
  spec.split('/').forEach(function (p) {
    if (p === '.' || p === '') return;
    if (p === '..') phan.pop(); else phan.push(p);
  });
  return phan.join('/');
}

async function chayModule(tj, k, files, timeoutMs) {
  var chinh = tj.tepChinh || 'main.js';
  var tep = Object.keys(files).filter(function (t) { return /\.m?js$/.test(t); });
  var url = {}, dang = {}, loiTep = {};
  function dung(ten) {
    if (url[ten]) return url[ten];
    if (dang[ten]) throw new Error('vòng import qua ' + ten + ' — máy chấm trình duyệt chưa hỗ trợ import vòng');
    dang[ten] = 1;
    var code = files[ten].replace(/(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]+)\2/g, function (m, dau, q, spec) {
      var p = giaiDuongDan(spec, ten);
      if (p != null && files[p] != null && /\.m?js$/.test(p)) return dau + q + dung(p) + q;
      return m;
    });
    url[ten] = URL.createObjectURL(new Blob([code + '\n//# sourceURL=' + ten], { type: 'text/javascript' }));
    return url[ten];
  }
  async function nap(ten) {
    if (files[ten] == null) { loiTep[ten] = 'không có tệp ' + ten; return null; }
    var p;
    try { p = import(dung(ten)); } catch (e) { loiTep[ten] = tenLoi(e); return null; }
    var xong = false, ns = null;
    p.then(function (m) { xong = true; ns = m; }, function (e) { xong = true; loiTep[ten] = tenLoi(e); });
    // nạp đồ thị module (blob:) là việc THẬT của trình duyệt (vài tác vụ) — chờ bằng giờ thật; hẹn giờ GIẢ
    // (top-level await chờ delay/fetch giả) thì chạy ngay như vòng sự kiện giả.
    var batDauCho = Date.now();
    for (var i = 0; i < 20000 && !xong; i++) {
      await nghi();
      if (xong) break;
      if (self.__henKeTiep() == null) {
        await Promise.race([p.then(function () {}, function () {}), nguThat(25)]);
        if (Date.now() - batDauCho > 3000) break;
        continue;
      }
      self.__chayHen();
    }
    if (!xong) { loiTep[ten] = 'top-level await không bao giờ xong'; return null; }
    if (loiTep[ten] && /Failed to resolve module specifier|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(loiTep[ten])) {
      loiTep[ten] = 'TypeError: Failed to resolve module specifier — import phải là đường tương đối có đuôi (./x.js) tới một tệp trong bài';
    }
    return ns;
  }
  var nsChinh = await nap(chinh);
  if (k.kiem === 'nap-duoc') {
    var t = k.tep || chinh;
    var ok = t === chinh ? !!nsChinh : !!(await nap(t));
    return { dat: ok, thay: ok ? 'nạp được' : loiTep[t] };
  }
  if ((k.so || 'giaTri') === 'console') {
    var vl = await chayVongLap(function () { return false; }, timeoutMs);
    return soKetQua(k, vl, timeoutMs, nsChinh ? null : loiTep[chinh]);
  }
  var nsMap = {};
  if (nsChinh) nsMap[chinh] = nsChinh;
  for (var x = 0; x < tep.length; x++) if (!nsMap[tep[x]]) { var n = await nap(tep[x]); if (n) nsMap[tep[x]] = n; }
  self.__module = function (p) {
    var t2 = giaiDuongDan(p.charAt(0) === '.' ? p : './' + p, chinh);
    if (loiTep[t2]) throw new Error('module ' + t2 + ' không nạp được: ' + loiTep[t2]);
    if (!nsMap[t2]) throw new Error('không có tệp ' + t2);
    return nsMap[t2];
  };
  napScript(thanGoi(k), 'cham.js');
  var vl2 = await chayVongLap(function () { return self.__trangThai !== 'cho'; }, timeoutMs);
  return soKetQua(k, vl2, timeoutMs, null);
}

async function chay(d) {
  var tj = d.tj, k = d.k, files = d.files;
  (0, eval)(__HARNESS__);
  var gia = Object.assign({}, tj.fetchGia || {}, k.fetchGia || {});
  self.__fetchGia = gia;
  var timeoutMs = k.timeoutMs || tj.timeoutMs || 10000;
  if (tj.loai === 'module') {
    if (!coImportScripts) return { boQua: 'ES modules chỉ chấm được trên web (app chưa hỗ trợ import trong hộp cát)' };
    return chayModule(tj, k, files, timeoutMs);
  }
  if (!k.so) k.so = tj.loai === 'console' ? 'console' : 'giaTri';
  var nap = tj.tepNap || [tj.tepChinh || 'main.js'];
  var loiNap = null;
  if (coImportScripts) {
    for (var i = 0; i < nap.length; i++) {
      var t = nap[i];
      if (files[t] == null) return { dat: false, thay: 'thiếu tệp ' + t };
      try { napScript(files[t], t); } catch (e) {
        if (k.so === 'console' && !k.goi) { loiNap = tenLoi(e); }
        else return { dat: false, thay: 'lỗi khi nạp ' + t + ': ' + tenLoi(e) };
      }
    }
    if (k.goi || k.chuanBi) napScript(thanGoi(k), 'cham.js');
  } else {
    for (var j = 0; j < nap.length; j++) {
      if (files[nap[j]] == null) return { dat: false, thay: 'thiếu tệp ' + nap[j] };
      try { new Function(files[nap[j]]); } catch (e2) {
        if (!(k.so === 'console' && !k.goi)) return { dat: false, thay: 'lỗi khi nạp ' + nap[j] + ': ' + tenLoi(e2) };
      }
    }
    var ghep = nap.map(function (t) { return files[t]; }).join('\n;\n') + '\n;\n' + ((k.goi || k.chuanBi) ? thanGoi(k) : '');
    try { (0, eval)(ghep); } catch (e3) {
      if (k.so === 'console' && !k.goi) loiNap = tenLoi(e3);
      else return { dat: false, thay: 'lỗi khi nạp: ' + tenLoi(e3) };
    }
  }
  var coGoi = !!(k.goi || k.chuanBi);
  var vl = await chayVongLap(function () { return k.so === 'console' ? false : (!coGoi || self.__trangThai !== 'cho'); }, timeoutMs);
  return soKetQua(k, vl, timeoutMs, loiNap);
}
`;

/** Thời gian THẬT tối đa cho một kiểm (CPU + nạp). Node dùng 1000ms CPU cho mỗi lần chạy mã. */
const TRAN_THAT_MS = 4000;

function taoWorker(): { w: Worker; don: () => void } {
  const hopCat = (globalThis as { __CT_HOP_CAT_WORKER__?: string }).__CT_HOP_CAT_WORKER__;
  if (hopCat) {
    const w = new Worker(hopCat);
    w.postMessage({ __napMa: WORKER_SRC });
    return { w, don: () => w.terminate() };
  }
  const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'application/javascript' }));
  const w = new Worker(url);
  return { w, don: () => { w.terminate(); URL.revokeObjectURL(url); } };
}

export function chamMotKiemJs(tj: TestsJson, k: Kiem, files: TepMap): Promise<Omit<KetQuaKiem, 'i'>> {
  const t0 = performance.now();
  return new Promise((resolve) => {
    let xong = false;
    let don = () => {};
    const ket = (r: Omit<KetQuaKiem, 'i'>) => {
      if (xong) return;
      xong = true;
      clearTimeout(hen);
      don();
      resolve({ ...r, ms: Math.round(performance.now() - t0) });
    };
    const hen = setTimeout(() => ket({ dat: false, thay: `quá ${TRAN_THAT_MS / 1000}s — vòng lặp vô hạn?` }), TRAN_THAT_MS);
    try {
      const tw = taoWorker();
      don = tw.don;
      tw.w.onmessage = (ev: MessageEvent) => ket(ev.data as Omit<KetQuaKiem, 'i'>);
      tw.w.onerror = (ev: ErrorEvent) => { ev.preventDefault?.(); ket({ dat: false, thay: `lỗi: ${ev.message || 'worker hỏng'}` }); };
      tw.w.postMessage({ harness: HARNESS });
      tw.w.postMessage({ tj: { ...tj, kiem: undefined }, k: { ...k }, files });
    } catch (e) {
      ket({ dat: false, thay: `không mở được worker: ${e instanceof Error ? e.message : String(e)}` });
    }
  });
}

/** Lọc tệp: chỉ cần tệp văn bản JS/JSON — tệp khác vẫn gửi (module có thể import JSON? không — chỉ .js/.mjs). */
export async function chamJs(tj: TestsJson, kiem: Kiem[], files: TepMap, onTung?: (r: KetQuaKiem) => void): Promise<KetQuaKiem[]> {
  const out: KetQuaKiem[] = [];
  for (const [idx, k] of kiem.entries()) {
    const i = typeof k.i === 'number' ? k.i : idx;
    let r: Omit<KetQuaKiem, 'i'>;
    if (k.kiem === 'ma-nguon') r = kiemMaNguon(k, files);
    else r = await chamMotKiemJs(tj, k, files);
    const kq: KetQuaKiem = {
      ...r, i, an: !!k.an, nhom: (k.nhom as string) ?? null, moTa: k.moTa,
      ...(!k.an && k.mongDoi !== undefined && k.kiem !== 'ma-nguon' ? { mong: ngan(k.mongDoi) } : {}),
    };
    out.push(kq);
    onTung?.(kq);
  }
  return out;
}

function ngan(v: unknown): string {
  const s = JSON.stringify(v);
  return s && s.length > 160 ? `${s.slice(0, 157)}...` : (s ?? String(v));
}

/** Bỏ chú thích như máy chấm Node (`boChuThich` trong codelab-kiem-de-web.mjs). */
export function boChuThich(s: string, ten = ''): string {
  let r = s.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  if (/\.(m?js|jsx|tsx?)$/.test(ten)) r = r.replace(/(^|[ \t;{}(),])\/\/[^\n]*/gm, '$1');
  if (/\.sql$/i.test(ten)) r = r.replace(/--[^\n]*/g, ''); // SQL (29/10/2026): chú thích -- …
  return r;
}

/** Kiểm 'ma-nguon': regex trên mã nguồn đã bỏ chú thích (hoặc mã gốc nếu giuChuThich). */
export function kiemMaNguon(k: Kiem, files: TepMap): Omit<KetQuaKiem, 'i'> {
  const ten = typeof k.tep === 'string' ? [k.tep] : Object.keys(files);
  let re: RegExp;
  try { re = new RegExp(String(k.khop), 'i'); } catch { return { dat: false, thay: 'regex hỏng trong đề' }; }
  const khop = ten.some((t) => re.test(k.giuChuThich ? (files[t] ?? '') : boChuThich(files[t] ?? '', t)));
  return { dat: k.phuDinh ? !khop : khop };
}
