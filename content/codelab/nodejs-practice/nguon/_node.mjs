/**
 * Node.js · Mục 0 + Chương 1–2 — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua). Các chương khác có tệp `_node-<chương>.mjs` riêng.
 *
 *  - Chữ + trắc nghiệm / sắp thứ tự / bảng: dùng lại ../../api-design-practice/nguon/_api.mjs (xáo theo NỘI DUNG bằng
 *    _chung/tracNghiem.mjs — không bao giờ viết tay chữ a/b/c/d), chỉ đổi thẻ sang 'nodejs'.
 *  - Bài viết hàm: `jsBai()` ở đây chạy LỜI GIẢI qua ĐÚNG HARNESS của máy chấm (scripts/codelab-cham-js.mjs: console giả,
 *    hẹn giờ GIẢ + đồng hồ ảo, fetch giả) trong node:vm ⇒ `mongDoi` không thể lệch máy chấm, kể cả hàm async, setTimeout,
 *    Date.now() ảo ("tuần tự 900 ms / song song 300 ms" đo được). Bộ dựng tự kiểm: lời giải không ném ngoài ý muốn,
 *    code khởi đầu trượt ≥ 1 kiểm (chạy bằng chamKiemJs thật), có kiểm ẩn + kiểm hiện.
 *  - Máy chấm KHÔNG phải event loop của Node: không có setImmediate / process.nextTick ⇒ thứ tự các hàng đợi của Node chỉ
 *    hỏi bằng choice/order, mọi đáp án đã chạy bằng Node 22 thật (scratchpad n02/kiem-node/*.cjs|mjs).
 *  - Middleware / handler viết dạng (req, res, next); req/res GIẢ nằm trong `chuanBi` của từng kiểm (RES_GIA) — người học
 *    không sửa được bộ giả của kiểm.
 */
import vm from 'node:vm';
import { HARNESS, chamKiemJs } from '../../../../scripts/codelab-cham-js.mjs';
import { doiDau, bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt, cs as csApi } from '../../api-design-practice/nguon/_api.mjs';
export { doiDau, bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt };

export const KHOA = 'nodejs';
const THE = ['nodejs'];
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/** Bộ tĩnh (choice / order / table) — cs() của _api.mjs, thẻ 'nodejs', dangBai tuỳ chọn. */
export function cs(o) {
  const r = csApi(o);
  return { ...r, the: THE, ...(o.dangBai ? { dangBai: o.dangBai } : {}) };
}

/** Một module = một bài học (slug = slug bài) hoặc một Lab chương (baiHoc = bài video gần nhất). */
const BAC = { EASY: 0, MEDIUM: 1, HARD: 2 };
/** Đề xếp ổn định EASY → MEDIUM → HARD (giữ thứ tự viết trong cùng bậc). */
export const modul = (slug, ten, de, baiHoc = slug) => doiDau({ slug, ten, khoa: KHOA, baiHoc, de: [...de].sort((a, b) => BAC[a.doKho] - BAC[b.doKho]) });

/** res GIẢ kiểu Express — chép vào chuanBi. Ghi lại status/json/send/header + thứ tự gọi. */
export const RES_GIA = `const mkRes = () => { const r = { statusCode: 200, headers: {}, body: undefined, sent: 0 };
  r.status = (s) => { r.statusCode = s; return r; };
  r.set = (k, v) => { r.headers[String(k).toLowerCase()] = v; return r; };
  r.json = (b) => { r.body = b; r.sent++; return r; };
  r.send = (b) => { r.body = b; r.sent++; return r; };
  return r; };
const mkNext = () => { const n = (err) => { n.calls.push(err === undefined ? 'next()' : 'next(' + (err && err.message ? err.message : String(err)) + ')'); }; n.calls = []; return n; };`;

/** Kho GIẢ dạng Map với hàm async, mỗi lần gọi chờ `ms` ms ẢO — chép vào chuanBi. */
export const KHO_GIA = `const mkRepo = (rows, ms = 50) => { const m = new Map(rows.map((r) => [r.id, structuredClone(r)])); const log = [];
  const wait = (v) => new Promise((ok) => setTimeout(() => ok(v), ms));
  return { log,
    findById: (id) => { log.push('findById ' + id); return wait(m.has(id) ? structuredClone(m.get(id)) : null); },
    findAll: () => { log.push('findAll'); return wait([...m.values()].map((x) => structuredClone(x))); },
    save: (row) => { log.push('save ' + row.id); m.set(row.id, structuredClone(row)); return wait(structuredClone(row)); },
    _peek: (id) => m.get(id) }; };`;

/* ═══════════════════ chạy LỜI GIẢI qua đúng HARNESS của máy chấm ═══════════════════ */
function taoRealm(tj, k) {
  const ctx = vm.createContext({ URL, URLSearchParams }, { microtaskMode: 'afterEvaluate', codeGeneration: { strings: true, wasm: false } });
  const chay = (code, filename = 'cham.js') => new vm.Script(code, { filename }).runInContext(ctx, { timeout: 1000 });
  chay(HARNESS, 'harness.js');
  chay(`__fetchGia = ${JSON.stringify({ ...(tj.fetchGia || {}), ...(k.fetchGia || {}) })};`);
  return { ctx, chay };
}
function vongLap(r, xongKhi, timeoutMs) {
  const g0 = r.ctx.__gio();
  for (let buoc = 0; buoc < 20000; buoc++) {
    r.chay('0');
    if (xongKhi()) return;
    const ke = r.ctx.__henKeTiep();
    if (ke == null || ke - g0 > timeoutMs) return;
    try { r.chay('__chayHen()'); } catch (e) { if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw e; }
  }
}
/** ⇒ { v } | { loi, thongDiep } | { log } */
function chayGiai(tj, k, files) {
  const r = taoRealm(tj, k);
  for (const t of tj.tepNap) r.chay(files[t], t);
  const coGoi = !!(k.goi || k.chuanBi);
  if (coGoi) r.chay(`__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi || 'undefined'}) };\n});`);
  const laConsole = (k.so || (tj.loai === 'console' ? 'console' : 'giaTri')) === 'console';
  vongLap(r, () => (laConsole ? false : (!coGoi || r.ctx.__trangThai !== 'cho')), k.timeoutMs || tj.timeoutMs || 10000);
  if (laConsole) return { log: JSON.parse(JSON.stringify(r.ctx.__log)) };
  const tt = r.ctx.__trangThai;
  if (tt === 'cho') return { loi: '__ChuaXong', thongDiep: 'Promise chưa xong' };
  if (tt === 'loi') { const e = r.ctx.__kq; return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) }; }
  return { v: JSON.parse(JSON.stringify(r.ctx.__chuanHoa(r.ctx.__kq))) };
}

/**
 * Bài viết hàm / chương trình. spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML), yc: [[en,vi]…], dauVao?, dauRa?, rangBuoc?: [[en,vi]…],
 *   goiY: [[en,vi]…] (≥2), loi: [[en,vi]…] (≥2), gt: [en, vi], kn: [], tns: [tn()…],
 *   tep?: 'notes.js', dau, giai, loai?: 'js'|'console', chung?: 'chuanBi dùng chung mọi kiểm',
 *   cases: [{ goi?, chuanBi?, an?, nem?: 'TypeError', thongDiep?, so?: 'console', moTa?: [en,vi], timeoutMs? }],
 *   kiemThem?: [{ kiem:'ma-nguon', … }], viDu?: [{input, output, explanation}]
 * }
 */
export function jsBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], dau, giai: giaiMa, cases, kiemThem = [], viDu, chung = '' } = s;
  const tep = s.tep || 'answer.js';
  const loai = s.loai || 'js';
  if (!cases.some((x) => x.an)) throw new Error(`${ten}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${ten}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  const tj = { loai, phienBan: 1, tepChinh: tep, tepNap: [tep] };
  const giaiF = { [tep]: giaiMa };
  const dauF = { [tep]: dau };
  const kiem = cases.map((x, i) => {
    const k = { ...(x.goi ? { goi: x.goi } : {}), ...(chung || x.chuanBi ? { chuanBi: [chung, x.chuanBi].filter(Boolean).join('\n') } : {}), ...(x.so ? { so: x.so } : {}), ...(x.timeoutMs ? { timeoutMs: x.timeoutMs } : {}) };
    const r = chayGiai(tj, k, giaiF);
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${ten}: ca ${i + 1} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      k.mongDoi = { loi: x.nem, ...(x.thongDiep ? { thongDiep: x.thongDiep } : {}) };
    } else if ('log' in r) {
      k.mongDoi = r.log;
    } else {
      if (r.loi) throw new Error(`${ten}: lời giải ném ${r.loi} ở ca ${i + 1}: ${r.thongDiep}`);
      k.mongDoi = r.v;
    }
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}`, `Ca ${i + 1}`));
    return { moTa: nhan, ...k, ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}) };
  });
  // lời giải phải ĐẠT, code khởi đầu phải TRƯỢT ≥ 1 — chấm bằng chamKiemJs thật
  let truot = 0;
  for (const k of kiem) {
    const g = chamKiemJs(tj, k, giaiF);
    if (!g.dat) throw new Error(`${ten}: lời giải trượt "${k.moTa.en}": ${g.thay}`);
    if (!chamKiemJs(tj, k, dauF).dat) truot++;
  }
  for (const k of kiemThem) {
    const re = new RegExp(k.khop, k.co || '');
    const bo = (m) => m.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
    const dat = (m) => (k.phuDinh ? !re.test(bo(m)) : re.test(bo(m)));
    if (!dat(giaiMa)) throw new Error(`${ten}: lời giải trượt kiểm mã nguồn ${k.khop}`);
    if (!dat(dau)) truot++;
  }
  if (!truot) throw new Error(`${ten}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: loai,
    moTa: bi(en, vi),
    yeuCau: yc.map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDu || [(() => {
      const k = kiem.find((x) => !x.an);
      return { input: `${k.chuanBi ? `${k.chuanBi.split('\n').filter((l) => !/^(const mk|  r\.|  return r|const mkNext|  const wait|  return \{ log|    \w+: \(|    _peek)/.test(l)).join('\n')}\n` : ''}${k.goi || ''}`.trim(), output: JSON.stringify(k.mongDoi), explanation: 'The first sample case (Run shows every visible case; hidden ones only run on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy mọi ca hiện; ca ẩn chỉ chạy khi Nộp).' };
    })()],
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { ...tj, kiem: [...kiem, ...kiemThem] },
    khoiDau: dauF,
    loiGiai: giaiF,
  };
}

/**
 * Bài ES modules (loai 'module'): nhiều tệp, `mongDoi` viết tay (vm.SourceTextModule cần cờ thử nghiệm) —
 * máy chấm trình duyệt là nơi kiểm thật (lời giải 100 %, khởi đầu trượt ≥ 1).
 * spec = { …như jsBai, tepChinh, dau: {tệp: mã}, giai: {tệp: mã}, kiem: [kiểm module đầy đủ] }
 */
export function modBai(s) {
  const { ten, kho, phut, diem, en, vi, yc, goiY, loi, gt, kn = [], tns = [], dau, giai: giaiMa, kiem, viDu, tepChinh } = s;
  if (!kiem.some((x) => x.an) || !kiem.some((x) => !x.an)) throw new Error(`${ten}: cần kiểm ẩn + hiện`);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: s.dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'module',
    moTa: bi(en, vi), yeuCau: yc.map(hv), viDu,
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { loai: 'module', phienBan: 1, tepChinh, kiem },
    khoiDau: dau, loiGiai: giaiMa,
  };
}
