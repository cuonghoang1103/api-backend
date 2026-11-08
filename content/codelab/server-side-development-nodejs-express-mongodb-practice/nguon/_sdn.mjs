/**
 * SDN302 — Luyện tập · BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua). Track
 * `server-side-development-nodejs-express-mongodb-practice`, mỗi module = một bài học của content/academy/SDN302.mjs.
 *
 *  - Trình duyệt không chạy được Node/Express/MongoDB thật ⇒ thư viện GIẢ trong `_lib/*.js` (core · mongoose · mongo-agg ·
 *    mongosh · express · http · auth · web · views): cùng API + cùng thông báo lỗi với Mongoose 8 / Express 4 / jsonwebtoken /
 *    bcryptjs / cors / ejs / handlebars (đối chiếu bản thật — scratchpad sdn/real, 08/11/2026). Mỗi đề mang theo đúng các tệp
 *    `lib/<tên>.js` nó cần (thu gọn bằng esbuild), nạp TRƯỚC `answer.js` như script cổ điển (máy chấm `js`).
 *  - `bai()`: lời giải là MÃ THẬT; `mongDoi` của mọi kiểm tính bằng cách CHẠY lời giải qua đúng HARNESS của máy chấm
 *    (scripts/codelab-cham-js.mjs — đồng hồ ảo, hẹn giờ giả, async được). Bộ dựng tự kiểm: lời giải đạt hết bằng
 *    chamKiemJs, code khởi đầu trượt ≥ 1, có kiểm ẩn, lời giải không ném lỗi ngoài ý muốn.
 *  - Trắc nghiệm / sắp thứ tự / bảng xáo theo NỘI DUNG (../../_chung/tracNghiem.mjs) — không viết tay chữ a/b/c/d.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';
import { xaoCauHoi, xaoThuTu, loiGiaiTracNghiem } from '../../_chung/tracNghiem.mjs';
import { HARNESS, chamKiemJs } from '../../../../scripts/codelab-cham-js.mjs';
export { doiDau };

export const KHOA = 'server-side-development-nodejs-express-mongodb';
const THE = ['sdn302'];
const DIR = path.dirname(fileURLToPath(import.meta.url));

/* ═══════════════════ chữ ═══════════════════ */
export const bi = (en, vi) => ({ en, vi });
export const hai = (en, vi) => `<p>${en}</p>${vi ? `<p style="opacity:.75;font-size:.92em"><i>${vi}</i></p>` : ''}`;
export const giai = (en, vi) => `<p>${en}</p>${vi ? `<p><i>VI: ${vi}</i></p>` : ''}`;
export const lc = (...ds) => ds.map(([ma, noiDung]) => ({ ma, noiDung }));
const chu = (h) => String(h || '').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const pre = (s) => `<pre>${esc(Array.isArray(s) ? s.join('\n') : s)}</pre>`;
export const c = (s) => `<code>${esc(s)}</code>`;
export function tab(heads, rows) {
  return `<table><thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
export const tn = (en, vi, giaiThich) => ({ en, vi, ...(giaiThich ? { giaiThich } : {}) });
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/* ═══════════════════ bài tĩnh: choice / order / table ═══════════════════ */
const MAC_DINH_YC = [
  bi('Answer every question in the answer panel, then press <b>Submit</b>.', 'Trả lời mọi câu trong khung trả lời rồi bấm <b>Nộp</b>.'),
  bi('All answers must be correct to get <b>Accepted</b>; the explanation of every question appears after you submit.', 'Đúng hết mới được <b>Accepted</b>; giải thích từng câu hiện sau khi nộp.'),
];
const MAC_DINH_VIDU = [{ input: 'Question → choose / fill', output: 'Correct / Incorrect + explanation after Submit|||Đúng / Sai + giải thích sau khi Nộp', explanation: 'Each question (or table cell) is one check.|||Mỗi câu (hoặc ô) là một kiểm.' }];

export function tinh(q0) {
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
    en: `<p><i>This set has ${dem} ${loai === 'table' ? (dem > 1 ? 'tables' : 'table') : (dem > 1 ? 'questions' : 'question')}. There is nothing to run: answer in the panel on the right and press Submit. Work each one out yourself first (on paper, or by running the snippet on your own machine), then check — every explanation after Submit says why the tempting wrong answer is wrong.</i></p>`,
    vi: `<p><i>Bộ này có ${dem} ${loai === 'table' ? 'bảng' : 'câu'}. Không có gì để chạy: trả lời trong khung bên phải rồi bấm Nộp. Hãy tự giải trước (ra giấy, hoặc chạy đoạn mã trên máy bạn) rồi mới kiểm — giải thích sau khi Nộp nói rõ vì sao phương án "trông đúng" lại sai.</i></p>`,
  };
  const moTa = q.moTa && typeof q.moTa === 'object' ? { en: q.moTa.en + them.en, vi: (q.moTa.vi || q.moTa.en) + them.vi } : q.moTa;
  return {
    ngonNgu: 'text', the: THE, dangBai: 'practice', yeuCau: MAC_DINH_YC, viDu: MAC_DINH_VIDU, thuatNgu: [],
    ...rest, moTa, tests,
    khoiDau: { 'answers.md': `# ${tieu}\n\nAnswer in the answer panel (no code needed).\n\n${de}\n` },
    loiGiai: { 'answers.md': `# ${tieu} — answer key\n\n${dap}\n` },
  };
}
/** Trắc nghiệm một đáp án: đáp án đúng là phương án ĐẦU trong `opts`. */
export function q(ma, de, opts, gt) {
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: ['a'], giaiThich: giai(gt[0], gt[1]) };
}
/** Trắc nghiệm nhiều đáp án: `dung` = các chỉ số (0-based) của phương án đúng. */
export function qn(ma, de, opts, dung, gt) {
  return { ma, de: hai(de[0], de[1]), luaChon: lc(...opts.map((t, i) => ['abcdef'[i], t])), dapAn: [dung.map((i) => 'abcdef'[i]).sort()], nhieu: true, giaiThich: giai(gt[0], gt[1]) };
}
/** Sắp thứ tự: các bước viết ĐÚNG thứ tự. */
export function ord(ma, de, steps, gt) {
  return { ma, de: hai(de[0], de[1]), muc: steps.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), dapAn: steps.map((_, i) => `s${i + 1}`), giaiThich: giai(gt[0], gt[1]) };
}
/** Một bảng: bang1(ma, [en,vi], cot, hang:[{o:{cột:'cho sẵn'}, a:{cột:'đáp án'}}], [giải en, vi]) */
export function bang1(ma, de, cot, hang, gt) {
  const dapAn = {};
  hang.forEach((h, i) => { for (const [k, v] of Object.entries(h.a)) dapAn[`r${i + 1}.${k}`] = v; });
  return { ma, de: hai(de[0], de[1]), cot, hang: hang.map((h, i) => ({ ma: `r${i + 1}`, o: h.o })), dapAn, giaiThich: giai(gt[0], gt[1]) };
}
export const mt = (en, vi) => bi(`<p>${en}</p>`, `<p>${vi}</p>`);
/** Bộ tĩnh nhanh. goiY/loi là [en, vi]. */
export function cs({ ten, kho, phut, en, vi, cau, goiY, loi, tns = [], kn = [], loai = 'choice', bang, dangBai }) {
  return tinh({ tieuDe: ten, doKho: kho, phut, moTa: mt(en, vi), loai, ...(loai === 'table' ? { bang } : { cauHoi: cau }), goiY: goiY.map(hv), loiHayGap: loi.map(hv), thuatNgu: tns, khaiNiem: kn, ...(dangBai ? { dangBai } : {}) });
}

/* ═══════════════════ thư viện giả ═══════════════════ */
const THU_TU_LIB = ['core', 'mongoose', 'mongo-agg', 'mongosh', 'express', 'http', 'auth', 'web', 'views', 'hono'];
const CAN = { 'mongo-agg': ['mongoose'], mongosh: ['mongoose'], web: ['auth', 'express'] };
const LIB_CACHE = {};
function libSrc(ten) {
  if (LIB_CACHE[ten]) return LIB_CACHE[ten];
  const raw = fs.readFileSync(path.join(DIR, '_lib', `${ten}.js`), 'utf8');
  const head = raw.split('\n').filter((l, i, a) => l.startsWith('//') && a.slice(0, i).every((x) => x.startsWith('//'))).join('\n');
  const min = transformSync(raw, { minify: true, loader: 'js', target: 'es2019' }).code;
  LIB_CACHE[ten] = `${head}\n// (minified — read the lesson, not this file. The grader loads it before answer.js.)\n${min}`;
  return LIB_CACHE[ten];
}
/** ['mongoose','express'] ⇒ danh sách tên đầy đủ đúng thứ tự nạp (luôn có core + phụ thuộc). */
export function dsLib(ds = []) {
  const set = new Set(['core', ...ds]);
  let doi = true;
  while (doi) { doi = false; for (const t of [...set]) for (const p of CAN[t] || []) if (!set.has(p)) { set.add(p); doi = true; } }
  return THU_TU_LIB.filter((t) => set.has(t));
}
export function tepLib(ds) { return Object.fromEntries(dsLib(ds).map((t) => [`lib/${t}.js`, libSrc(t)])); }

/* ═══════════════════ chạy thật (như máy chấm) ═══════════════════ */
function taoRealm(cpu = 2000, fetchGia = {}) {
  const ctx = vm.createContext({ URL, URLSearchParams }, { microtaskMode: 'afterEvaluate', codeGeneration: { strings: true, wasm: false } });
  const chay = (code, filename = 'cham.js') => new vm.Script(code, { filename }).runInContext(ctx, { timeout: cpu });
  chay(HARNESS, 'harness.js');
  chay(`__fetchGia = ${JSON.stringify(fetchGia)};`);
  return { ctx, chay };
}
/** Chạy tệp + một kiểm ⇒ { v } | { loi, thongDiep } | { cho } — giá trị đã chuẩn hoá như máy chấm (JSON). */
export function chayKiem(files, tepNap, k, timeoutMs = 10000) {
  const r = taoRealm(2000, k.fetchGia || {});
  for (const t of tepNap) {
    try { r.chay(files[t], t); } catch (e) { return { loiNap: `${t}: ${e && e.name}: ${e && e.message}` }; }
  }
  r.chay(`__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi || 'undefined'}) };\n});`);
  const g0 = r.ctx.__gio();
  for (let i = 0; i < 20000; i++) {
    r.chay('0');
    if (r.ctx.__trangThai !== 'cho') break;
    const ke = r.ctx.__henKeTiep();
    if (ke == null || ke - g0 > timeoutMs) break;
    try { r.chay('__chayHen()'); } catch (e) { /* lỗi không bắt trong hẹn giờ: như máy chấm, bỏ qua */ }
  }
  const tt = r.ctx.__trangThai;
  if (tt === 'cho') return { cho: true };
  if (tt === 'loi') { const e = r.ctx.__kq; return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) }; }
  return { v: JSON.parse(JSON.stringify(r.ctx.__chuanHoa(r.ctx.__kq))) };
}
function boChuThich(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1'); }

/**
 * Bài viết mã (máy chấm `js`). spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML), yc: [[en,vi]…], dauVao?, dauRa?, rangBuoc?, goiY (≥2), loi (≥2), gt: [en, vi],
 *   kn, tns, lib: ['mongoose','express',…], dau: 'answer.js khởi đầu', giai: 'answer.js lời giải', them?: { '.env': '…' },
 *   chuanBi?: 'mã chạy trước mọi kiểm', cases: [{ goi, chuanBi?, an?, nem?, moTa: [en, vi], nhom? }], kiemThem?: [ma-nguon…],
 *   viDu: [[input, output, giải en, giải vi]…], banIn?, timeoutMs?
 * }
 */
export function bai(s0) {
  const s = doiDau(s0);
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, rangBuoc, goiY, loi, gt, kn = [], tns = [], lib = [], dau, giai: giaiMa, them = {}, chuanBi = '', cases, kiemThem = [], viDu, banIn, timeoutMs, env } = s;
  const tenEn = typeof ten === 'string' ? ten : ten.en;
  if (!cases.some((x) => x.an)) throw new Error(`${tenEn}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${tenEn}: thiếu kiểm hiện`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${tenEn}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  if (!viDu || !viDu.length) throw new Error(`${tenEn}: cần ≥ 1 ví dụ`);
  if (String(giaiMa).length < 200) throw new Error(`${tenEn}: lời giải < 200 ký tự`);
  if (/TODO|…/.test(giaiMa)) throw new Error(`${tenEn}: lời giải còn TODO/…`);
  const libs = tepLib(lib);
  if (env) libs['lib/env.js'] = `// lib/env.js — PROVIDED: what dotenv would load from .env into process.env before your code runs.\n${Object.entries(env).map(([k, v]) => `process.env.${k} = ${JSON.stringify(v)};`).join('\n')}\n`;
  const tepNap = [...Object.keys(libs), 'answer.js'];
  const filesGiai = { 'answer.js': giaiMa, ...them, ...libs };
  const filesDau = { 'answer.js': dau, ...them, ...libs };
  const tj = { loai: 'js', phienBan: 1, tepChinh: 'answer.js', tepNap, ...(timeoutMs ? { timeoutMs } : {}) };
  let truot = 0;
  const kiem = cases.map((x, i) => {
    const k0 = { goi: x.goi, ...(chuanBi || x.chuanBi ? { chuanBi: `${chuanBi}\n${x.chuanBi || ''}`.trim() } : {}), ...(x.fetchGia ? { fetchGia: x.fetchGia } : {}) };
    const r = chayKiem(filesGiai, tepNap, k0, timeoutMs);
    if (r.loiNap) throw new Error(`${tenEn}: lời giải không nạp được — ${r.loiNap}`);
    if (r.cho) throw new Error(`${tenEn}: ca ${i + 1} — Promise của lời giải không bao giờ xong`);
    let mongDoi;
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${tenEn}: ca ${i + 1} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      mongDoi = { loi: x.nem, ...(x.thongDiep ? { thongDiep: x.thongDiep } : {}) };
    } else {
      if (r.loi) throw new Error(`${tenEn}: lời giải ném ${r.loi} ở ca ${i + 1} (${x.goi}): ${r.thongDiep}`);
      mongDoi = r.v;
    }
    if (JSON.stringify(mongDoi).includes('"$js":"Promise"') && !x.choPhepPromise) throw new Error(`${tenEn}: ca ${i + 1} trả về một Promise chưa await — thêm await vào goi`);
    if (x.mong !== undefined && JSON.stringify(x.mong) !== JSON.stringify(mongDoi)) throw new Error(`${tenEn}: ca ${i + 1} lời giải cho ${JSON.stringify(mongDoi)} ≠ mong ${JSON.stringify(x.mong)}`);
    const k = { moTa: x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden check ${i + 1}`, `Kiểm ẩn ${i + 1}`) : bi(`Check ${i + 1}`, `Kiểm ${i + 1}`)), ...k0, mongDoi, ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}) };
    const kg = chamKiemJs(tj, k, filesGiai);
    if (!kg.dat) throw new Error(`${tenEn}: máy chấm Node chấm TRƯỢT lời giải ở ca ${i + 1}: ${kg.thay}`);
    const kd = chamKiemJs(tj, k, filesDau);
    if (!kd.dat) truot++;
    return k;
  });
  for (const m of kiemThem) {
    if (m.kiem !== 'ma-nguon') continue;
    const tep = m.tep || 'answer.js';
    const ok = new RegExp(m.khop, 'm').test(m.giuChuThich ? filesGiai[tep] : boChuThich(filesGiai[tep] || ''));
    if (ok === !!m.phuDinh) throw new Error(`${tenEn}: lời giải trượt kiểm mã nguồn "${JSON.stringify(m.moTa)}"`);
    const okD = new RegExp(m.khop, 'm').test(m.giuChuThich ? filesDau[tep] : boChuThich(filesDau[tep] || ''));
    if (okD === !!m.phuDinh) truot++;
  }
  if (!truot) throw new Error(`${tenEn}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  const gop = (ds) => (ds && ds.length ? [bi(ds.map((x) => x[0]).join('\n'), ds.map((x) => x[1]).join('\n'))] : undefined);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en, vi),
    yeuCau: (yc || []).map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    ...(rangBuoc ? { rangBuoc: gop(rangBuoc) } : {}),
    viDu: viDu.map(([input, output, e1, e2]) => ({ input, output, explanation: e2 ? `${e1}|||${e2}` : e1 })),
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    ...(banIn ? { banIn } : {}),
    tests: { ...tj, kiem: [...kiem, ...kiemThem] },
    khoiDau: filesDau,
    loiGiai: filesGiai,
  };
}

/** Kiểm "mã nguồn" (regex trên answer.js đã bỏ chú thích). */
export const maNguon = (moTa, khop, o = {}) => ({ kiem: 'ma-nguon', moTa: bi(moTa[0], moTa[1]), khop, tep: o.tep || 'answer.js', ...(o.phuDinh ? { phuDinh: true } : {}), ...(o.an ? { an: true } : {}), ...(o.nhom ? { nhom: o.nhom } : {}) });

/** Đoạn khởi đầu chung: chú thích ngắn về thư viện giả cho người học. */
export const GHI_CHU_LIB = `// The files in lib/ are PROVIDED (an in-memory Node / Express / Mongoose for the browser).
// Write your code in this file only. require('express'), require('mongoose')… work as in the lesson.`;
