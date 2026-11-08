/**
 * Node.js · Chương 15–18 — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua).
 *
 *  - Chữ + trắc nghiệm/sắp thứ tự/bảng: dùng lại ../../api-design-practice/nguon/_api.mjs (xáo theo NỘI DUNG,
 *    không viết tay chữ a/b/c/d), chỉ đổi thẻ sang 'nodejs'.
 *  - Bài viết hàm (js) dựng bằng `jsBai()` ở đây — bản ASYNC của jsBai trong _api.mjs: lời giải là MÃ NGUỒN THẬT,
 *    `mongDoi` của mọi kiểm tính bằng cách CHẠY lời giải trong node:vm (realm mới như Worker của máy chấm), kể cả
 *    hàm trả Promise (goi viết `await …`). Bộ dựng tự kiểm: lời giải không ném ngoài ý muốn, code khởi đầu trượt ≥ 1,
 *    có kiểm ẩn. Hẹn giờ trong vm là hẹn giờ THẬT của Node (máy chấm dùng giờ ảo) ⇒ đề chỉ dùng setTimeout ngắn,
 *    không đọc Date.now() (đồng hồ được tiêm qua tham số `now`).
 *  - Không có fs/http/process trong máy chấm ⇒ middleware viết dạng (req, res, next) với req/res GIẢ (`resGia()`
 *    chép vào chuanBi của kiểm), dịch vụ nhận phụ thuộc tiêm vào (ping DB giả, đồng hồ giả…) — đúng cách Chương 14 dạy.
 */
import vm from 'node:vm';
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

/** res giả cho middleware/handler — chép NGUYÊN VĂN vào chuanBi (máy chấm và vm đều chạy được). */
export const RES_GIA = `const mkRes = () => { const r = { statusCode: 200, headers: {}, body: undefined, ended: false };
  r.status = (s) => { r.statusCode = s; return r; };
  r.setHeader = (k, v) => { r.headers[String(k).toLowerCase()] = v; return r; };
  r.set = (k, v) => r.setHeader(k, v);
  r.json = (b) => { r.body = b; r.ended = true; return r; };
  r.send = (b) => { r.body = b; r.ended = true; return r; };
  return r; };`;

const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/* ═══════════════════ chạy thật trong vm ═══════════════════ */
function hetGio(p, ms) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error(`quá ${ms} ms`), { name: '__HetGio' })), ms))]);
}
function maHoa(v, sau = 0) {
  if (v === undefined) return { $js: 'undefined' };
  if (sau > 50) return v;
  if (typeof v === 'number' && !Number.isFinite(v)) return { $js: Number.isNaN(v) ? 'NaN' : v > 0 ? 'Infinity' : '-Infinity' };
  if (typeof v === 'function') return { $js: 'function' };
  if (v && typeof v.then === 'function') return { $js: 'Promise' };
  if (Array.isArray(v)) return v.map((x) => maHoa(x, sau + 1));
  if (v && typeof v === 'object') {
    const ten = Object.prototype.toString.call(v);
    if (ten === '[object Map]') return { $js: 'Map', muc: [...v].map(([k, x]) => [maHoa(k, sau + 1), maHoa(x, sau + 1)]) };
    if (ten === '[object Set]') return { $js: 'Set', muc: [...v].map((x) => maHoa(x, sau + 1)) };
    if (ten === '[object Error]') return { $js: 'Error', name: v.name, message: v.message };
    const o = {};
    for (const k of Object.keys(v)) o[k] = maHoa(v[k], sau + 1);
    return o;
  }
  return v;
}
async function chay(ma, bieuThuc, chuanBi = '') {
  const im = () => {};
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask, URL, URLSearchParams, console: { log: im, info: im, warn: im, error: im, debug: im } });
  try {
    vm.runInContext(ma, ctx, { timeout: 2000 });
    const p = vm.runInContext(`(async () => { ${chuanBi}\n; return { v: (${bieuThuc}) }; })()`, ctx, { timeout: 2000 });
    const r = await hetGio(p, 6000);
    return { v: JSON.parse(JSON.stringify(maHoa(r.v))) };
  } catch (e) {
    if (e && e.name === '__HetGio') return { loi: '__HetGio', thongDiep: e.message };
    return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) };
  }
}
function bang(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => bang(x, b[i]));
  const ka = Object.keys(a); const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && bang(a[k], b[k]));
}

/**
 * Bài viết hàm (async được). spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML), yc?: [[en,vi]…], dauVao?, dauRa?, rangBuoc?: [[en,vi]…],
 *   goiY: [[en,vi]…] (≥2), loi: [[en,vi]…] (≥2), gt: [en, vi], kn, tns, viDu?: [{input,output,explanation}],
 *   dau: 'mã khởi đầu', giai: 'mã lời giải',
 *   cases: [{ goi, chuanBi?, an?, nem?: 'TypeError', thongDiep?: 'regex', moTa?: [en,vi], nhom? }], kiemThem?: [ma-nguon…]
 * }
 */
export async function jsBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], dau, giai: giaiMa, cases, kiemThem = [], viDu, vdGt } = s;
  const tieu = typeof ten === 'string' ? ten : ten.en;
  if (!cases.some((x) => x.an)) throw new Error(`${tieu}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${tieu}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${tieu}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  let truotKhoiDau = 0;
  const kiem = [];
  for (let i = 0; i < cases.length; i++) {
    const x = cases[i];
    const r = await chay(giaiMa, x.goi, x.chuanBi);
    let mongDoi;
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${tieu}: ca ${x.goi} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      if (x.thongDiep && !new RegExp(x.thongDiep, 'i').test(r.thongDiep)) throw new Error(`${tieu}: ca ${x.goi}: thông điệp "${r.thongDiep}" không khớp /${x.thongDiep}/`);
      mongDoi = x.thongDiep ? { loi: x.nem, thongDiep: x.thongDiep } : { loi: x.nem };
    } else {
      if (r.loi) throw new Error(`${tieu}: lời giải ném ${r.loi} ở ${x.goi}: ${r.thongDiep}`);
      mongDoi = r.v;
    }
    const k = await chay(dau, x.goi, x.chuanBi);
    const dat = x.nem ? (k.loi === x.nem && (!x.thongDiep || new RegExp(x.thongDiep, 'i').test(k.thongDiep))) : (!k.loi && bang(k.v, mongDoi));
    if (!dat) truotKhoiDau++;
    const ngan = x.goi.length > 90 ? `${x.goi.slice(0, 87)}...` : x.goi;
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}: ${ngan}`, `Ca ${i + 1}: ${ngan}`));
    kiem.push({ moTa: nhan, goi: x.goi, ...(x.chuanBi ? { chuanBi: x.chuanBi } : {}), mongDoi, ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}) });
  }
  if (!truotKhoiDau) throw new Error(`${tieu}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const dau0 = kiem.find((k) => !k.an);
  const viDuMd = viDu || [{
    input: dau0.goi.replace(/^await /, ''),
    output: JSON.stringify(dau0.mongDoi),
    explanation: vdGt ? `${vdGt[0]}|||${vdGt[1]}` : 'The first sample case (Run executes the visible cases; hidden ones run only on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy các ca hiện; ca ẩn chỉ chạy khi Nộp).',
  }];
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
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
    tests: { loai: 'js', phienBan: 1, tepChinh: 'answer.js', tepNap: ['answer.js'], kiem: [...kiem, ...kiemThem] },
    khoiDau: { 'answer.js': dau },
    loiGiai: { 'answer.js': giaiMa },
  };
}
