/**
 * Node.js · Chương 9–11 (bảo mật ứng dụng · upload & object storage · realtime) — BỘ DỰNG ĐỀ dùng chung
 * (tệp "_" ⇒ bộ xuất bỏ qua).
 *
 *  - Chữ + trắc nghiệm/sắp thứ tự/bảng: dùng lại ../../api-design-practice/nguon/_api.mjs (xáo theo NỘI DUNG,
 *    không bao giờ viết tay chữ a/b/c/d), chỉ đổi thẻ sang 'nodejs'.
 *  - Bài viết hàm (js) dựng bằng `jsBai()` ở đây. Khác bản của _api.mjs: lời giải chạy qua ĐÚNG HARNESS của máy chấm
 *    (scripts/codelab-cham-js.mjs — đồng hồ ẢO, setTimeout giả, fetch giả, Date.now() ảo) ⇒ hàm async, TTL, thử lại,
 *    hàng đợi đều chấm được và `mongDoi` không thể lệch với máy chấm. Sau khi dựng, bộ dựng CHẤM LẠI bằng
 *    `chamKiemJs` của máy chấm Node: lời giải phải đạt mọi kiểm, code khởi đầu phải trượt ≥ 1.
 *  - Không có fs/http/process/Buffer/crypto trong Worker ⇒ middleware viết dạng (req, res, next) với req/res GIẢ
 *    (`GIA` dưới đây, chép vào chuanBi của mọi kiểm), dịch vụ nhận phụ thuộc tiêm vào (kho Map, S3 giả, ws giả…).
 */
import vm from 'node:vm';
import { HARNESS, chamKiemJs } from '../../../../scripts/codelab-cham-js.mjs';
import { doiDau, bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt, soNhan, nguon, goi, cs as csApi } from '../../api-design-practice/nguon/_api.mjs';
export { doiDau, bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt, soNhan, nguon, goi };

export const KHOA = 'nodejs';
const THE = ['nodejs'];

/** Bộ tĩnh (choice / order / table) — như cs() của _api.mjs, thẻ 'nodejs', dangBai tuỳ chọn. */
export function cs(o) {
  const r = csApi(o);
  return { ...r, the: THE, ...(o.dangBai ? { dangBai: o.dangBai } : {}) };
}

/** Một module = một bài học (slug = slug bài) hoặc một Lab chương. */
export const modul = (slug, ten, de) => doiDau({ slug, ten, khoa: KHOA, baiHoc: slug, de });

/**
 * req/res GIẢ — chép vào chuanBi của mọi kiểm (máy chấm trình duyệt và vm của Node đều chạy được).
 *   makeRes()             res kiểu Express: status/set/setHeader/getHeader/removeHeader/append/vary/json/send/end/sendStatus/redirect
 *   runMw(mw, req, res?)  gọi mw(req, res, next), chờ nó (kể cả async) ⇒ { status, headers, body, ended, next: [...] }
 *                         next: mỗi lần gọi next() ghi 'next', next(err) ghi 'next:' + err.message
 *   bytes(s)              chuỗi ⇒ mảng mã byte (chỉ ASCII/latin1) — để dựng "file" trong đề
 */
export const GIA = String.raw`
function makeRes() {
  const r = { statusCode: 200, headers: {}, body: undefined, ended: false };
  const k = (x) => String(x).toLowerCase();
  r.status = (s) => { r.statusCode = s; return r; };
  r.setHeader = (n, v) => { r.headers[k(n)] = Array.isArray(v) ? v.join(', ') : String(v); return r; };
  r.set = (n, v) => { if (typeof n === 'object') { for (const x of Object.keys(n)) r.setHeader(x, n[x]); return r; } return r.setHeader(n, v); };
  r.header = r.set;
  r.getHeader = (n) => r.headers[k(n)];
  r.get = r.getHeader;
  r.removeHeader = (n) => { delete r.headers[k(n)]; };
  r.append = (n, v) => { const o = r.headers[k(n)]; r.headers[k(n)] = o ? o + ', ' + v : String(v); return r; };
  r.vary = (f) => { const o = r.headers.vary; if (!o) r.headers.vary = f; else if (!o.split(/\s*,\s*/).map(k).includes(k(f))) r.headers.vary = o + ', ' + f; return r; };
  r.json = (b) => { if (r.ended) throw new Error('Cannot set headers after they are sent to the client'); r.body = b; r.ended = true; if (!r.headers['content-type']) r.headers['content-type'] = 'application/json; charset=utf-8'; return r; };
  r.send = (b) => { if (r.ended) throw new Error('Cannot set headers after they are sent to the client'); r.body = b; r.ended = true; return r; };
  r.end = (b) => { if (r.ended) throw new Error('Cannot set headers after they are sent to the client'); r.body = b === undefined ? null : b; r.ended = true; return r; };
  r.sendStatus = (s) => { r.statusCode = s; return r.end(); };
  r.redirect = (a, b) => { if (b === undefined) { b = a; a = 302; } r.statusCode = a; r.headers.location = String(b); return r.end(); };
  return r;
}
async function runMw(mw, req, res) {
  res = res || makeRes();
  req = req || {};
  if (!req.headers) req.headers = {};
  const next = [];
  await mw(req, res, (err) => { next.push(err === undefined ? 'next' : 'next:' + (err && err.message !== undefined ? err.message : String(err))); });
  return { status: res.statusCode, headers: res.headers, body: res.body === undefined ? null : res.body, ended: res.ended, next };
}
function bytes(s) { const a = []; for (let i = 0; i < s.length; i++) a.push(s.charCodeAt(i) & 255); return a; }
`;

/* ═══════════════════ chạy thật qua HARNESS của máy chấm ═══════════════════ */
function chayLoiGiai(files, tepNap, k) {
  const ctx = vm.createContext({ URL, URLSearchParams }, { microtaskMode: 'afterEvaluate', codeGeneration: { strings: true, wasm: false } });
  const chay = (code, filename = 'cham.js') => new vm.Script(code, { filename }).runInContext(ctx, { timeout: 2000 });
  chay(HARNESS, 'harness.js');
  chay(`__fetchGia = ${JSON.stringify(k.fetchGia || {})};`);
  for (const t of tepNap) chay(files[t], t);
  chay(`__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi}) };\n});`);
  const g0 = ctx.__gio();
  for (let i = 0; i < 20000; i++) {
    chay('0');
    if (ctx.__trangThai !== 'cho') break;
    const ke = ctx.__henKeTiep();
    if (ke == null || ke - g0 > (k.timeoutMs || 10000)) break;
    chay('__chayHen()');
  }
  if (ctx.__trangThai === 'loi') { const e = ctx.__kq; return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) }; }
  if (ctx.__trangThai !== 'xong') return { loi: '__ChuaXong', thongDiep: 'Promise chưa settle' };
  return { v: JSON.parse(JSON.stringify(ctx.__chuanHoa(ctx.__kq))) };
}

const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/**
 * Bài viết hàm (js). spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML mô tả), yc?: [[en,vi]…], dauVao?, dauRa?, rangBuoc?: [[en,vi]…],
 *   goiY: [[en,vi]…] (≥2), loi: [[en,vi]…] (≥2), gt: [en, vi] (VÌ SAO đúng), kn, tns,
 *   dau: 'mã khởi đầu', giai: 'mã lời giải', fakes?: 'mã giả thêm (chép vào chuanBi)',
 *   cases: [{ goi, chuanBi?, an?, nem?: 'TypeError', moTa?: [en,vi], fetchGia?, timeoutMs? }], kiemThem?: [kiểm ma-nguon…],
 *   viDu?: [{ input, output, explanation }] (mặc định: ca đầu), vdGt?: [en, vi]
 * }
 */
export function jsBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], dau, giai: giaiMa, fakes = '', cases, kiemThem = [], viDu, vdGt } = s;
  if (!cases.some((x) => x.an)) throw new Error(`${ten}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${ten}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  if (giaiMa.length < 200) throw new Error(`${ten}: lời giải < 200 ký tự`);
  const TEP = 'answer.js';
  const nen = GIA + fakes;
  const kiem = cases.map((x, i) => {
    const k0 = { goi: x.goi, chuanBi: nen + (x.chuanBi || ''), fetchGia: x.fetchGia, timeoutMs: x.timeoutMs };
    const r = chayLoiGiai({ [TEP]: giaiMa }, [TEP], k0);
    let mongDoi;
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${ten}: ca ${x.goi} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      mongDoi = { loi: x.nem, ...(x.thongDiep ? { thongDiep: x.thongDiep } : {}) };
    } else {
      if (r.loi) throw new Error(`${ten}: lời giải ném ${r.loi} ở ${x.goi}: ${r.thongDiep}`);
      mongDoi = r.v;
      if (JSON.stringify(mongDoi).includes('"$js":"Promise"') && !x.choPromise) throw new Error(`${ten}: ca ${x.goi.slice(0, 60)} trả Promise — thiếu await?`);
    }
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}: ${x.goi.length > 90 ? `${x.goi.slice(0, 87)}...` : x.goi}`, `Ca ${i + 1}`));
    return {
      moTa: nhan, goi: x.goi, chuanBi: k0.chuanBi, mongDoi,
      ...(x.fetchGia ? { fetchGia: x.fetchGia } : {}), ...(x.timeoutMs ? { timeoutMs: x.timeoutMs } : {}),
      ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}),
    };
  });
  // chấm lại bằng máy chấm Node thật (cùng HARNESS): lời giải đạt hết, khởi đầu trượt ≥ 1
  const tj = { loai: 'js', phienBan: 1, tepChinh: TEP, tepNap: [TEP] };
  kiem.forEach((k) => {
    const r = chamKiemJs(tj, k, { [TEP]: giaiMa });
    if (!r.dat) throw new Error(`${ten}: lời giải TRƯỢT kiểm "${k.moTa.en}": ${r.thay}`);
  });
  const truot = kiem.filter((k) => !chamKiemJs(tj, k, { [TEP]: dau }).dat).length;
  if (!truot) throw new Error(`${ten}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const dau0 = kiem.find((k) => !k.an);
  const viDuMd = viDu || [{
    input: dau0.goi,
    output: JSON.stringify(dau0.mongDoi),
    explanation: vdGt ? `${vdGt[0]}|||${vdGt[1]}` : 'The first sample case (more cases run when you press Run; hidden ones only on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy thêm các ca hiện; ca ẩn chỉ chạy khi Nộp).',
  }];
  const gop = (ds) => (ds && ds.length ? ds.map(hv) : undefined);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en, vi),
    yeuCau: (yc || [['Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'], ['Do not modify the arguments.', 'Không sửa các đối số.']]).map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDuMd,
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { loai: 'js', phienBan: 1, tepChinh: TEP, tepNap: [TEP], kiem: [...kiem, ...kiemThem] },
    khoiDau: { [TEP]: dau },
    loiGiai: { [TEP]: giaiMa },
  };
}

/** Ghi chú cố định cho mọi đề viết hàm: máy chấm chạy gì, và những gì KHÔNG có trong trình duyệt. */
export const MOI_TRUONG = bi(
  '<p><i>Graded in your browser: there is no real Express, network, Buffer or <code>crypto</code> here. The tests call your function with small fake objects (a fake <code>res</code> that records <code>status()</code>, headers and <code>json()</code>; fake stores with async methods), exactly the way Chapter 14 tests a handler without a server. <code>Date.now()</code> and timers run on a virtual clock, so waiting costs no real time.</i></p>',
  '<p><i>Chấm ngay trong trình duyệt: ở đây không có Express thật, mạng, Buffer hay <code>crypto</code>. Bộ kiểm gọi hàm của bạn với các object GIẢ nhỏ (một <code>res</code> giả ghi lại <code>status()</code>, header và <code>json()</code>; kho giả có hàm async), đúng cách Chương 14 kiểm một handler mà không cần máy chủ. <code>Date.now()</code> và hẹn giờ chạy trên đồng hồ ẢO nên chờ không tốn thời gian thật.</i></p>',
);
