/**
 * Node.js · Chương 3–5 — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua). Phần chữ CHÉP từ ../../api-design-practice/nguon/_api.mjs.
 *
 *  - KHOA = 'nodejs', thẻ 'nodejs'. Ví dụ trong đề = output THẬT của bài học (Notes API, 348 MB, express 4.18.0 → 4.22.2…).
 *  - Bài viết code (`nodeBai`): lời giải là MÃ NGUỒN THẬT; `mongDoi` của mọi kiểm tính bằng cách CHẠY lời giải trong đúng
 *    HARNESS của máy chấm (scripts/codelab-cham-js.mjs — console giả, đồng hồ/hẹn giờ ẢO, fetch giả) ⇒ có `await`, hẹn giờ ảo,
 *    Promise như máy chấm trình duyệt. Sau đó chấm LẠI bằng `chamKiemJs` (máy chấm Node tham chiếu): lời giải phải đạt hết,
 *    code khởi đầu phải trượt ≥ 1, phải có kiểm ẩn.
 *  - Không có fs/http/Buffer/Express trong Worker ⇒ đề viết dạng hàm thuần với đồ GIẢ tiêm vào (req/res/fs/emitter giả trong
 *    `chuanBi`), đúng cách Chương 14 dạy kiểm thử. Chương 5 dùng `mini-express.js` (./_node-c3-5-mini-express.js): tập con
 *    Express 5 đã đối chiếu với express@5.3.0 thật trên 50 request (status, Content-Type, Content-Length, thân, thứ tự log) —
 *    chỉ khác: trang lỗi mặc định không in stack.
 *  - Trắc nghiệm / sắp thứ tự xáo theo NỘI DUNG bằng ../../_chung/tracNghiem.mjs — không bao giờ viết tay chữ a/b/c/d.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';
import { HARNESS, chamKiemJs } from '../../../../scripts/codelab-cham-js.mjs';
export { doiDau };

export const KHOA = 'nodejs';
const THE = ['nodejs'];
export const MINI_EXPRESS = fs.readFileSync(new URL('./_node-c3-5-mini-express.js', import.meta.url), 'utf8');

/* ═══════════════════ chữ ═══════════════════ */
export const bi = (en, vi) => ({ en, vi });
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));
const chu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const pre = (s) => `<pre>${esc(Array.isArray(s) ? s.join('\n') : s)}</pre>`;
export const c = (s) => `<code>${esc(s)}</code>`;
export const tn = (en, vi, giaiThich) => ({ en, vi, ...(giaiThich ? { giaiThich } : {}) });
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/* ═══════════════════ bài tĩnh: choice / order / table ═══════════════════ */
const MAC_DINH_YC = [
  bi('Answer every question in the answer panel, then press <b>Submit</b>.', 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.'),
  bi('All answers must be correct to get <b>Accepted</b>; the explanation of every question appears after you submit.', 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.'),
];
const MAC_DINH_VIDU = [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }];

function tinh(q0) {
  const q = { ...q0 };
  const loai = q.loai || 'choice';
  if (loai === 'choice') { q.cauHoi = xaoCauHoi(q.cauHoi); q.giaiThich = loiGiaiTracNghiem(q.cauHoi, q.giaiThich); }
  if (loai === 'order') { q.cauHoi = q.cauHoi.map(xaoThuTu); if (!q.giaiThich) q.giaiThich = q.cauHoi.map((x) => x.giaiThich).join(''); }
  if (loai === 'table' && !q.giaiThich) q.giaiThich = q.bang.map((b) => b.giaiThich).join('');
  const ds = loai === 'table' ? q.bang : q.cauHoi;
  const de = ds.map((x, i) => `${i + 1}. ${chu(x.de)}`).join('\n');
  let dap;
  if (loai === 'table') {
    dap = ds.map((b, i) => `${i + 1}. ${chu(b.de)}\n${Object.entries(b.dapAn).map(([o, v]) => `   - ${o}: ${Array.isArray(v) ? v.join(' / ') : v}`).join('\n')}\n   ${chu(b.giaiThich)}`).join('\n\n');
  } else {
    dap = ds.map((x, i) => {
      const d = Array.isArray(x.dapAn) ? (Array.isArray(x.dapAn[0]) ? x.dapAn[0] : x.dapAn) : [x.dapAn];
      const muc = x.luaChon || x.muc || [];
      const ten = d.map((m) => `${m}) ${chu(muc.find((y) => y.ma === m)?.noiDung)}`).join(loai === 'order' ? '  →  ' : ' + ');
      return `${i + 1}. ${chu(x.de)}\n   Answer: ${ten}\n   ${chu(x.giaiThich)}`;
    }).join('\n\n');
  }
  const tests = loai === 'table' ? { loai, bang: q.bang } : { loai, cauHoi: q.cauHoi };
  const { cauHoi: _c, bang: _b, loai: _l, ...rest } = q;
  void _c; void _b; void _l;
  const tieu = typeof q.tieuDe === 'string' ? q.tieuDe : q.tieuDe.en;
  const dem = ds.length;
  const them = {
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. Work each one out yourself first (on paper, or by running the lesson's code with Node 22), then check — every explanation after Submit says why the tempting wrong answer is wrong.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Hãy tự giải trước (ra giấy, hoặc chạy code của bài bằng Node 22) rồi mới kiểm — giải thích sau khi Nộp nói rõ vì sao phương án "trông đúng" lại sai.</i></p>`,
  };
  const moTa = q.moTa && typeof q.moTa === 'object' ? { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi } : q.moTa;
  return {
    ngonNgu: 'text', the: THE, dangBai: 'practice', yeuCau: MAC_DINH_YC, viDu: MAC_DINH_VIDU, thuatNgu: [],
    ...rest,
    moTa, tests,
    khoiDau: { 'answers.md': `# ${tieu}\n\nAnswer in the answer panel (no code needed).\n\n${de}\n` },
    loiGiai: { 'answers.md': `# ${tieu} — answer key\n\n${dap}\n` },
  };
}
/** Trắc nghiệm một đáp án: đáp án đúng là phương án ĐẦU trong `opts` (tinh() xáo theo nội dung). */
export function q(ma, de, opts, gt) {
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: ['a'], giaiThich: giai(gt[0], gt[1]) };
}
/** Trắc nghiệm nhiều đáp án: `dung` = các chỉ số (0-based) của phương án đúng. */
export function qn(ma, de, opts, dung, gt) {
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: [dung.map((i) => 'abcdef'[i]).sort()], nhieu: true, giaiThich: giai(gt[0], gt[1]) };
}
/** Sắp thứ tự: các bước viết ĐÚNG thứ tự; tinh() xáo và đổi mã. */
export function ord(ma, de, steps, gt) {
  return { ma, de: hai(de[0], de[1]), muc: steps.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), dapAn: steps.map((_, i) => `s${i + 1}`), giaiThich: giai(gt[0], gt[1]) };
}
/** Một bảng: bang1(ma, [en,vi], cot, hang:[{o:{cột:'cho sẵn'}, a:{cột:'đáp án'|[các dạng]}}], [giải en, vi]) */
export function bang1(ma, de, cot, hang, gt) {
  const dapAn = {};
  hang.forEach((h, i) => { for (const [k, v] of Object.entries(h.a)) dapAn[`r${i + 1}.${k}`] = v; });
  return { ma, de: hai(de[0], de[1]), cot, hang: hang.map((h, i) => ({ ma: `r${i + 1}`, o: h.o })), dapAn, giaiThich: giai(gt[0], gt[1]) };
}
export const mt = (en, vi) => bi(`<p>${en}</p>`, `<p>${vi}</p>`);
/** Bộ tĩnh nhanh: cs({ten,kho,phut,en,vi,cau|bang,loai,goiY,loi,tns,kn,dangBai}) — goiY/loi là [en, vi]. */
export function cs({ ten, kho, phut, en, vi, cau, goiY, loi, tns = [], kn = [], loai = 'choice', bang, dangBai }) {
  return tinh({ tieuDe: ten, doKho: kho, phut, moTa: mt(en, vi), loai, ...(loai === 'table' ? { bang } : { cauHoi: cau }), goiY: goiY.map(hv), loiHayGap: loi.map(hv), thuatNgu: tns, khaiNiem: kn, ...(dangBai ? { dangBai } : {}) });
}

/* ═══════════════════ bài viết code — lời giải chạy thật trong HARNESS của máy chấm ═══════════════════ */
/** Nối mã nguồn các hàm/lớp tham chiếu (giữ chú thích) thành tệp. */
export const nguon = (...fns) => fns.map((f) => (typeof f === 'string' ? f.trim() : f.toString())).join('\n\n') + '\n';
/** goi('fn', a, b) ⇒ 'fn(<json a>, <json b>)' */
export const goi = (fn, ...args) => `${fn}(${args.map((a) => JSON.stringify(a)).join(', ')})`;

/** Chạy một kiểm trong realm mới + HARNESS ⇒ { tt, v, loi, log } (giá trị đã chuẩn hoá như máy chấm). */
function chayLay(tj, k, files) {
  const ctx = vm.createContext({ URL, URLSearchParams }, { microtaskMode: 'afterEvaluate', codeGeneration: { strings: true, wasm: false } });
  const chay = (code, filename = 'cham.js') => new vm.Script(code, { filename }).runInContext(ctx, { timeout: 2000 });
  chay(HARNESS, 'harness.js');
  chay(`__fetchGia = ${JSON.stringify({ ...(tj.fetchGia || {}), ...(k.fetchGia || {}) })};`);
  for (const t of tj.tepNap) chay(files[t], t);
  chay(`__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi || 'undefined'}) };\n});`);
  const g0 = ctx.__gio();
  const han = k.timeoutMs || tj.timeoutMs || 10000;
  for (let buoc = 0; buoc < 20000; buoc++) {
    chay('0');
    if (k.so !== 'console' && ctx.__trangThai !== 'cho') break;
    const ke = ctx.__henKeTiep();
    if (ke == null || ke - g0 > han) break;
    try { chay('__chayHen()'); } catch (e) { if (e && e.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') throw e; }
  }
  const tt = ctx.__trangThai;
  const out = { tt, log: JSON.parse(JSON.stringify(ctx.__log)) };
  if (tt === 'xong') out.v = JSON.parse(JSON.stringify(ctx.__chuanHoa(ctx.__kq)));
  if (tt === 'loi') out.loi = { name: ctx.__kq && ctx.__kq.name, message: String(ctx.__kq && ctx.__kq.message) };
  return out;
}
const ngan = (s, n = 90) => (s.length > n ? `${s.slice(0, n - 3)}...` : s);

/**
 * spec = { ten, kho, phut, diem?, dangBai?, en, vi, yc?, dauVao?, dauRa?, rangBuoc?, goiY, loi, gt, kn, tns,
 *   tep: 'answer.js', kit?: true (nạp mini-express.js trước), dau: 'mã' | {tệp: mã}, giai: 'mã' | {tệp: mã},
 *   chung?: 'chuẩn bị dùng chung cho mọi kiểm', cases: [{ goi, chuanBi?, an?, nem?: 'TypeError', thongDiep?, so?: 'console', moTa?: [en,vi], timeoutMs? }],
 *   kiemThem?: [kiểm ma-nguon], viDu?, vdGt? }
 */
export function nodeBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], kit, chung = '', cases, kiemThem = [], viDu, vdGt } = s;
  const tep = s.tep || 'answer.js';
  const tenDe = typeof ten === 'string' ? ten : ten.en;
  if (!cases.some((x) => x.an)) throw new Error(`${tenDe}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${tenDe}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${tenDe}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  const tepMa = (m) => (typeof m === 'string' ? { [tep]: m } : m);
  const giaiF = { ...tepMa(s.giai), ...(kit ? { 'mini-express.js': MINI_EXPRESS } : {}) };
  const dauF = { ...tepMa(s.dau), ...(kit ? { 'mini-express.js': MINI_EXPRESS } : {}) };
  const tepNap = [...(kit ? ['mini-express.js'] : []), ...Object.keys(tepMa(s.giai))];
  const tj = { loai: 'js', phienBan: 1, tepChinh: tep, tepNap, kiem: [] };
  let truot = 0;
  const kiem = cases.map((x, i) => {
    const k0 = { goi: x.goi, ...(x.so ? { so: x.so } : {}), ...(chung || x.chuanBi ? { chuanBi: `${chung}\n${x.chuanBi || ''}`.trim() } : {}), ...(x.timeoutMs ? { timeoutMs: x.timeoutMs } : {}) };
    const r = chayLay(tj, k0, giaiF);
    let mongDoi;
    if (x.nem) {
      if (r.tt !== 'loi' || r.loi.name !== x.nem) throw new Error(`${tenDe}: ca ${x.goi} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      mongDoi = { loi: x.nem, ...(x.thongDiep ? { thongDiep: x.thongDiep } : {}) };
    } else if (x.so === 'console') {
      mongDoi = r.log;
    } else {
      if (r.tt !== 'xong') throw new Error(`${tenDe}: lời giải ${r.tt === 'loi' ? `ném ${r.loi.name}: ${r.loi.message}` : 'không settle'} ở ${x.goi}`);
      mongDoi = r.v;
      if (mongDoi && mongDoi.$js === 'Promise') throw new Error(`${tenDe}: ca ${x.goi} trả về một Promise chưa await — thêm await`);
    }
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}: ${ngan(x.goi)}`, `Ca ${i + 1}: ${ngan(x.goi)}`));
    const k = { moTa: nhan, ...k0, mongDoi, ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}) };
    const kq = chamKiemJs(tj, k, giaiF);
    if (!kq.dat) throw new Error(`${tenDe}: máy chấm tham chiếu ĐÁNH TRƯỢT lời giải ở "${nhan.en}": ${kq.thay}`);
    if (!chamKiemJs(tj, k, dauF).dat) truot++;
    return k;
  });
  if (!truot) throw new Error(`${tenDe}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const dau0 = kiem.find((k) => !k.an);
  const viDuMd = viDu || [{
    input: dau0.goi,
    output: JSON.stringify(dau0.mongDoi),
    explanation: vdGt ? `${vdGt[0]}|||${vdGt[1]}` : 'The first sample case (Run runs the visible cases; hidden ones run only on Submit).|||Ca mẫu đầu tiên (Chạy thử chạy các ca hiện; ca ẩn chỉ chạy khi Nộp).',
  }];
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
  const kitEn = kit ? `<p><i>The editor also has <code>mini-express.js</code>: a small subset of Express 5 checked against the real express@5 (routing, <code>Router</code>, <code>express.json()</code>, <code>res.json/status/send/sendStatus/end</code>, error handlers). The tests call <code>request(app, method, url, { body, headers })</code> — a tiny supertest that resolves to <code>{ status, headers, text, body }</code>. Leave that file alone and write your code exactly as you would in a real project.</i></p>` : '';
  const kitVi = kit ? `<p><i>Trình soạn thảo có thêm <code>mini-express.js</code>: một tập con của Express 5 đã đối chiếu với express@5 thật (định tuyến, <code>Router</code>, <code>express.json()</code>, <code>res.json/status/send/sendStatus/end</code>, error handler). Máy chấm gọi <code>request(app, method, url, { body, headers })</code> — một supertest tí hon trả về <code>{ status, headers, text, body }</code>. Đừng sửa tệp đó; viết code y như trong dự án thật.</i></p>` : '';
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en + kitEn, vi + kitVi),
    yeuCau: (yc || [['Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'], ['Do not modify the arguments.', 'Không sửa các đối số.']]).map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDuMd,
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { ...tj, kiem: [...kiem, ...kiemThem] },
    khoiDau: dauF,
    loiGiai: giaiF,
  };
}

/* ═══════════════════ đồ GIẢ dùng trong `chuanBi` (đặt tên ngắn — mỗi kiểm mang theo) ═══════════════════ */
/** Emitter tối giản (on/once/off/emit) — dùng làm req giả, đích ghi giả, store giả. */
export const FAKE_EMITTER = `function __em(o) { var L = {}; o = o || {};
o.on = function (e, f) { (L[e] = L[e] || []).push(f); return o; };
o.once = function (e, f) { function w() { o.off(e, w); return f.apply(o, arguments); } w.listener = f; return o.on(e, w); };
o.off = o.removeListener = function (e, f) { L[e] = (L[e] || []).filter(function (x) { return x !== f && x.listener !== f; }); return o; };
o.emit = function (e) { var a = [].slice.call(arguments, 1); var ls = (L[e] || []).slice(); ls.forEach(function (f) { f.apply(o, a); }); return ls.length > 0; };
o.listenerCount = function (e) { return (L[e] || []).length; };
return o; }`;
/** req GIẢ của node:http: phát các mẩu `chunks` qua sự kiện 'data' (mỗi mẩu cách 1 ms ảo) rồi 'end'. */
export const FAKE_REQ = `${FAKE_EMITTER}
function mkReq(method, url, chunks, headers) { var r = __em({ method: method, url: url, headers: headers || { host: 'localhost:3123' }, destroyed: false });
r.destroy = function () { r.destroyed = true; };
var i = 0; (function tick() { setTimeout(function () { if (r.destroyed) return; if (i < (chunks || []).length) { r.emit('data', chunks[i++]); tick(); } else r.emit('end'); }, 1); })();
return r; }`;
/** res GIẢ của node:http: writeHead/setHeader/end; ném lỗi như Node khi gửi hai lần; `rec` = những gì đã lên dây. */
export const FAKE_RAW_RES = `function mkRes() { var rec = { status: null, headers: {}, body: null, ends: 0, errors: [] };
var res = { headersSent: false, writableEnded: false, statusCode: 200, rec: rec };
function sent(w) { var e = new Error('Cannot ' + w + ' headers after they are sent to the client'); e.code = 'ERR_HTTP_HEADERS_SENT'; rec.errors.push(e.code); throw e; }
res.setHeader = function (k, v) { if (res.headersSent) sent('set'); rec.headers[String(k).toLowerCase()] = v; return res; };
res.writeHead = function (s, h) { if (res.headersSent) sent('write'); res.statusCode = s; Object.keys(h || {}).forEach(function (k) { rec.headers[k.toLowerCase()] = h[k]; }); res.headersSent = true; rec.status = s; return res; };
res.end = function (b) { if (res.writableEnded) { if (b !== undefined) rec.errors.push('ERR_STREAM_WRITE_AFTER_END'); return res; } if (!res.headersSent) { res.headersSent = true; rec.status = res.statusCode; } res.writableEnded = true; rec.ends++; rec.body = b === undefined ? null : String(b); return res; };
return res; }`;
