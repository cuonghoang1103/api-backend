/**
 * Node.js · Chương 6–8 (REST · PostgreSQL + Prisma · xác thực) — BỘ DỰNG ĐỀ dùng chung (tệp "_" ⇒ bộ xuất bỏ qua).
 * Tự chứa (không phụ thuộc _node.mjs của Chương 0–2, để hai agent soạn song song không giẫm nhau).
 *
 *  - Chữ + trắc nghiệm / bảng / sắp thứ tự: cs() của ../../api-design-practice/nguon/_api.mjs (xáo theo NỘI DUNG bằng
 *    _chung/tracNghiem.mjs — không bao giờ viết tay chữ a/b/c/d), thẻ đổi sang 'nodejs'.
 *  - Bài viết hàm `jsBai()`: LỜI GIẢI chạy qua ĐÚNG HARNESS của máy chấm (scripts/codelab-cham-js.mjs — đồng hồ ảo, hẹn giờ
 *    giả, fetch giả) trong node:vm ⇒ `mongDoi` không thể lệch máy chấm, kể cả hàm async + Date.now() ảo. Bộ dựng tự kiểm bằng
 *    chamKiemJs thật: lời giải đạt MỌI kiểm, code khởi đầu trượt ≥ 1, MỖI `saiMau` (lỗi hay gặp viết thành code) trượt ≥ 1.
 *  - Bộ GIẢ (req/res, kho kiểu Prisma, đồng hồ…) nằm trong `chung` = chuanBi của MỌI kiểm ⇒ người học không sửa được bộ giả.
 *    Hàm trợ giúp người học ĐƯỢC dùng (b64url, sha256, hmac…) nằm ở tệp `helpers.js` nạp TRƯỚC answer.js.
 *  - SQL Chương 7: sqlPg() của ../../postgresql-practice/nguon/_chung.mjs (loại 'sql-pg' = PostgreSQL 18 nguyên bản, PGlite)
 *    trên CSDL Notes kiểu Prisma ("User", "Note", "Tag", "NoteTag" — tên cột camelCase phải đặt trong ngoặc kép như lesson 7.2).
 */
import vm from 'node:vm';
import { HARNESS, chamKiemJs } from '../../../../scripts/codelab-cham-js.mjs';
import { bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt, cs as csApi } from '../../api-design-practice/nguon/_api.mjs';
import { sqlPg, kq, kqAn, sau, chan, duoc, ma as maSql, PLAN_ALL } from '../../postgresql-practice/nguon/_chung.mjs';
export { bi, hai, giai, lc, esc, pre, c, tab, tn, q, qn, ord, bang1, mt };
export { kq, kqAn, sau, chan, duoc, maSql, PLAN_ALL };
export { TRO_GIUP, TRO_GIUP_HMAC } from '../../authentication-practice/nguon/_auth.mjs';

export const KHOA = 'nodejs';
const THE = ['nodejs'];
const hv = (x) => (Array.isArray(x) ? bi(x[0], x[1]) : x);

/** Bộ tĩnh (choice / order / table) — cs() của _api.mjs: { ten, kho, phut, en, vi, cau | bang, loai?, goiY, loi, tns?, kn?, dangBai? } */
export function cs(o) {
  const r = csApi(o);
  return { ...r, the: THE, ...(o.dangBai ? { dangBai: o.dangBai } : {}) };
}

/** Một module = một bài học (slug = slug bài) hoặc một Lab chương (baiHoc = bài video cuối chương). */
export const modul = (slug, ten, de, baiHoc = slug) => ({ slug, ten, khoa: KHOA, baiHoc, de });

/** Nối mã nguồn hàm tham chiếu (giữ chú thích) thành tệp lời giải. */
export const nguon = (...fns) => fns.map((f) => (typeof f === 'string' ? f.trim() : f.toString())).join('\n\n') + '\n';
/** goi('f', a, b) ⇒ 'f(<json a>, <json b>)' */
export const goi = (fn, ...args) => `${fn}(${args.map((a) => JSON.stringify(a)).join(', ')})`;

/* ═══════════════════ bộ giả dùng lại (chép vào `chung`) ═══════════════════ */
/** res GIẢ kiểu Express: ghi status/headers/body, số lần gửi, và có gọi end() không. */
export const RES = `const mkRes = () => { const r = { statusCode: 200, headers: {}, body: undefined, sent: 0, ended: false };
  r.status = (s) => { r.statusCode = s; return r; };
  r.set = (k, v) => { r.headers[String(k).toLowerCase()] = String(v); return r; };
  r.setHeader = r.set;
  r.get = (k) => r.headers[String(k).toLowerCase()];
  r.location = (u) => { r.headers.location = u; return r; };
  r.json = (b) => { r.body = b; r.sent++; r.headers['content-type'] = 'application/json'; return r; };
  r.send = (b) => { r.body = b; r.sent++; return r; };
  r.end = () => { r.ended = true; r.sent++; return r; };
  return r; };
const mkNext = () => { const n = (err) => { n.calls.push(err); }; n.calls = []; return n; };
const mkReq = (o = {}) => { const h = {}; for (const k of Object.keys(o.headers || {})) h[k.toLowerCase()] = o.headers[k];
  return { method: 'GET', path: '/', params: {}, query: {}, body: undefined, cookies: {}, ...o, headers: h, get: (k) => h[String(k).toLowerCase()] }; };
const view = (res) => ({ status: res.statusCode, headers: res.headers, body: res.body === undefined ? null : res.body, sent: res.sent, ended: res.ended });
const errView = (e) => (e ? { status: e.status, code: e.code } : null);`;

/** AppError mà mọi bài chương 6–8 dùng (giống lesson 5.4): status + code + message. Người học dùng được (nạp ở helpers). */
export const APP_ERROR = `class AppError extends Error {
  constructor(status, code, message) { super(message || code); this.name = 'AppError'; this.status = status; this.code = code; }
}`;

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
/** ⇒ { v } | { loi, thongDiep } */
function chayGiai(tj, k, files) {
  const r = taoRealm(tj, k);
  for (const t of tj.tepNap) r.chay(files[t], t);
  r.chay(`__batDau(async () => {\n${k.chuanBi || ''}\nreturn { v: (${k.goi || 'undefined'}) };\n});`);
  vongLap(r, () => r.ctx.__trangThai !== 'cho', k.timeoutMs || tj.timeoutMs || 10000);
  const tt = r.ctx.__trangThai;
  if (tt === 'cho') return { loi: '__ChuaXong', thongDiep: 'Promise chưa xong' };
  if (tt === 'loi') { const e = r.ctx.__kq; return { loi: e && e.name ? e.name : 'Error', thongDiep: String(e && e.message) }; }
  return { v: JSON.parse(JSON.stringify(r.ctx.__chuanHoa(r.ctx.__kq))) };
}

/**
 * Bài viết hàm. spec = {
 *   ten, kho, phut, diem?, dangBai?, en, vi (HTML), yc: [[en,vi]…], dauVao?, dauRa?,
 *   goiY: [[en,vi]…] (≥2), loi: [[en,vi]…] (≥2), gt: [en, vi] (HTML), kn: [], tns: [tn()…],
 *   dau: 'mã khởi đầu', giai: 'mã lời giải' | hàm | [hàm…], tro?: 'mã helpers.js' (người học dùng được, nạp trước),
 *   chung?: 'chuanBi dùng chung mọi kiểm (bộ giả)', fetchGia?, timeoutMs?,
 *   cases: [{ goi, chuanBi?, an?, nem?: 'AppError', thongDiep?, moTa?: [en,vi], fetchGia? }],
 *   saiMau?: ['mã SAI (lỗi hay gặp)…'] — mỗi cái phải trượt ≥ 1 kiểm (không ghi vào JSON),
 *   kiemThem?: [{ kiem:'ma-nguon', khop, phuDinh?, moTa }], viDu?: [{input, output, explanation}]
 * }
 */
export function jsBai(s) {
  const { ten, kho, phut, diem, dangBai, en, vi, yc, dauVao, dauRa, goiY, loi, gt, kn = [], tns = [], dau, cases, kiemThem = [], viDu, chung = '', tro, saiMau = [] } = s;
  const giaiMa = typeof s.giai === 'string' ? s.giai : nguon(...[].concat(s.giai));
  const tep = 'answer.js';
  if (!cases.some((x) => x.an)) throw new Error(`${ten}: thiếu kiểm ẩn`);
  if (!cases.some((x) => !x.an)) throw new Error(`${ten}: thiếu kiểm hiện`);
  if (cases.length + kiemThem.length < 3) throw new Error(`${ten}: cần ≥ 3 kiểm`);
  if (goiY.length < 2 || loi.length < 2) throw new Error(`${ten}: cần ≥ 2 gợi ý và ≥ 2 lỗi hay gặp`);
  if (giaiMa.length < 200) throw new Error(`${ten}: lời giải < 200 ký tự`);
  const tepNap = tro ? ['helpers.js', tep] : [tep];
  const tj = { loai: 'js', phienBan: 1, tepChinh: tep, tepNap, ...(s.fetchGia ? { fetchGia: s.fetchGia } : {}), ...(s.timeoutMs ? { timeoutMs: s.timeoutMs } : {}) };
  const voiTro = (m) => ({ [tep]: m, ...(tro ? { 'helpers.js': tro } : {}) });
  const giaiF = voiTro(giaiMa);
  const dauF = voiTro(dau);
  const kiem = cases.map((x, i) => {
    const cb = [chung, x.chuanBi].filter(Boolean).join('\n');
    const k = { goi: x.goi, ...(cb ? { chuanBi: cb } : {}), ...(x.fetchGia ? { fetchGia: x.fetchGia } : {}), ...(x.timeoutMs ? { timeoutMs: x.timeoutMs } : {}) };
    const r = chayGiai(tj, k, giaiF);
    if (x.nem) {
      if (r.loi !== x.nem) throw new Error(`${ten}: ca ${i + 1} phải ném ${x.nem}, lời giải cho ${JSON.stringify(r)}`);
      k.mongDoi = { loi: x.nem, ...(x.thongDiep ? { thongDiep: x.thongDiep } : {}) };
    } else {
      if (r.loi) throw new Error(`${ten}: lời giải ném ${r.loi} ở ca ${i + 1}: ${r.thongDiep}`);
      k.mongDoi = r.v;
    }
    const nhan = x.moTa ? bi(x.moTa[0], x.moTa[1]) : (x.an ? bi(`Hidden case ${i + 1}`, `Ca ẩn ${i + 1}`) : bi(`Case ${i + 1}: ${x.goi.length > 80 ? `${x.goi.slice(0, 77)}...` : x.goi}`, `Ca ${i + 1}`));
    return { moTa: nhan, ...k, ...(x.an ? { an: true } : {}), ...(x.nhom ? { nhom: x.nhom } : {}) };
  });
  const bo = (m) => m.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
  const datMa = (k, m) => { const re = new RegExp(k.khop, 'i'); return k.phuDinh ? !re.test(bo(m)) : re.test(bo(m)); };
  const soTruot = (files, ma) => kiem.filter((k) => !chamKiemJs(tj, k, files).dat).length + kiemThem.filter((k) => !datMa(k, ma)).length;
  for (const k of kiem) {
    const g = chamKiemJs(tj, k, giaiF);
    if (!g.dat) throw new Error(`${ten}: lời giải trượt "${k.moTa.en}": ${g.thay}`);
  }
  for (const k of kiemThem) if (!datMa(k, giaiMa)) throw new Error(`${ten}: lời giải trượt kiểm mã nguồn ${k.khop}`);
  if (!soTruot(dauF, dau)) throw new Error(`${ten}: code khởi đầu đạt mọi kiểm — phải trượt ít nhất một`);
  saiMau.forEach((m, i) => { if (!soTruot(voiTro(m), m)) throw new Error(`${ten}: sai mẫu #${i + 1} lọt qua mọi kiểm`); });
  const vd0 = kiem.find((x) => !x.an);
  return {
    tieuDe: ten, doKho: kho, phut, ...(diem ? { diem } : {}), dangBai: dangBai || 'practice',
    the: THE, ngonNgu: 'javascript', loaiKiem: 'js',
    moTa: bi(en, vi),
    yeuCau: yc.map(hv),
    ...(dauVao ? { dauVao: hv(dauVao) } : {}),
    ...(dauRa ? { dauRa: hv(dauRa) } : {}),
    viDu: viDu || [{ input: vd0.goi, output: JSON.stringify(vd0.mongDoi), explanation: 'The first visible case (Run shows every visible case; hidden ones only run on Submit).|||Ca hiện đầu tiên (Chạy thử chạy mọi ca hiện; ca ẩn chỉ chạy khi Nộp).' }],
    goiY: goiY.map(hv), loiHayGap: loi.map(hv),
    giaiThich: bi(`<p>${gt[0]}</p>`, `<p>${gt[1]}</p>`),
    khaiNiem: kn, thuatNgu: tns,
    tests: { ...tj, kiem: [...kiem, ...kiemThem.map((k) => ({ kiem: 'ma-nguon', tep, moTa: hv(k.moTa), khop: k.khop, ...(k.phuDinh ? { phuDinh: true } : {}) }))] },
    khoiDau: dauF,
    loiGiai: giaiF,
  };
}

/* ═══════════════════ SQL (Chương 7) — CSDL Notes kiểu Prisma ═══════════════════ */
const DDL_USER = `CREATE TABLE "User" (
  id          serial PRIMARY KEY,
  email       text NOT NULL UNIQUE,
  name        varchar(80) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT now()
);`;
const DDL_NOTE = (slug, version = true) => `CREATE TABLE "Note" (
  id          serial PRIMARY KEY,
  title       varchar(200) NOT NULL,${slug ? '\n  slug        text NOT NULL UNIQUE,' : ''}
  body        text NOT NULL DEFAULT '',
  pinned      boolean NOT NULL DEFAULT false,
  "authorId"  integer NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" timestamp(3) NOT NULL,
  "updatedAt" timestamp(3) NOT NULL${version ? ',\n  version     integer NOT NULL DEFAULT 1' : ''}
);`;
const DDL_TAG = `CREATE TABLE "Tag" (
  id   serial PRIMARY KEY,
  name varchar(40) NOT NULL UNIQUE
);
CREATE TABLE "NoteTag" (
  "noteId" integer NOT NULL REFERENCES "Note"(id) ON DELETE CASCADE,
  "tagId"  integer NOT NULL REFERENCES "Tag"(id) ON DELETE CASCADE,
  PRIMARY KEY ("noteId", "tagId")
);`;
const DATA_USER = `INSERT INTO "User" (email, name, "createdAt") VALUES
  ('an@vd.com', 'An', '2026-07-01 08:00'), ('binh@vd.com', 'Binh', '2026-07-02 08:00'),
  ('chi@vd.com', 'Chi', '2026-07-03 08:00'), ('dung@vd.com', 'Dung', '2026-07-04 08:00');`;
const NOTES = [
  // [title, authorId, createdAt, pinned]
  ['Learning Express', 1, '2026-07-27 09:00', false], ['Learning Prisma', 1, '2026-07-27 10:00', true],
  ['Shopping list', 2, '2026-07-27 10:00', false], ['Chapter 7 notes', 1, '2026-07-28 08:30', false],
  ['Gym plan', 2, '2026-07-28 09:00', true], ['Read EXPLAIN', 3, '2026-07-28 09:00', false],
  ['Indexes', 1, '2026-07-29 07:00', false], ['Weekend', 2, '2026-07-29 07:00', false],
  ['Migrations', 3, '2026-07-29 07:00', true], ['Pool sizing', 1, '2026-07-30 12:00', false],
];
const DATA_NOTE = (slug) => `INSERT INTO "Note" (title,${slug ? ' slug,' : ''} body, pinned, "authorId", "createdAt", "updatedAt") VALUES
${NOTES.map(([t, a, d, p], i) => `  ('${t}',${slug ? ` 'note-${i + 1}',` : ''} 'body of note ${i + 1}', ${p}, ${a}, '${d}', '${d}')`).join(',\n')};`;
const DATA_TAG = `INSERT INTO "Tag" (name) VALUES ('work'), ('prisma'), ('health'), ('db');
INSERT INTO "NoteTag" ("noteId", "tagId") VALUES (1, 1), (2, 1), (2, 2), (4, 4), (5, 3), (6, 4), (9, 4), (9, 2);`;

/** CSDL Notes: { slug?: true, tag?: true } ⇒ DDL + dữ liệu (4 user, 10 note, 4 tag). */
export function notesDb({ slug = true, tag = true, version = true, them = '' } = {}) {
  return [DDL_USER, DDL_NOTE(slug, version), tag ? DDL_TAG : '', DATA_USER, DATA_NOTE(slug), tag ? DATA_TAG : '', them].filter(Boolean).join('\n');
}
/** Lược đồ in trong đề. */
export function luocDoNotes({ slug = true, tag = true, version = true } = {}) {
  const cot = `<b>"Note"</b>(id serial PK, title varchar(200), ${slug ? 'slug text UNIQUE, ' : ''}body text, pinned boolean, "authorId" int → "User".id ON DELETE CASCADE, "createdAt" timestamp, "updatedAt" timestamp${version ? ', version int DEFAULT 1' : ''})`;
  const en = `<p><b>Sample database</b> (the Notes schema of lesson 7.2, as Prisma creates it — camelCase names must be written in double quotes):</p><ul><li><b>"User"</b>(id serial PK, email text UNIQUE, name varchar(80), "createdAt" timestamp) — 4 users: An (1), Binh (2), Chi (3), Dung (4, no notes)</li><li>${cot} — 10 notes</li>${tag ? '<li><b>"Tag"</b>(id, name varchar(40) UNIQUE) and <b>"NoteTag"</b>("noteId", "tagId", PK on both)</li>' : ''}</ul>`;
  const vi = `<p><b>CSDL mẫu</b> (lược đồ Notes của bài 7.2, đúng như Prisma tạo — tên camelCase phải đặt trong ngoặc kép):</p><ul><li><b>"User"</b>(id serial PK, email text UNIQUE, name varchar(80), "createdAt" timestamp) — 4 người: An (1), Binh (2), Chi (3), Dung (4, chưa có ghi chú)</li><li>${cot} — 10 ghi chú</li>${tag ? '<li><b>"Tag"</b>(id, name varchar(40) UNIQUE) và <b>"NoteTag"</b>("noteId", "tagId", khoá chính gồm cả hai)</li>' : ''}</ul>`;
  return { en, vi };
}

/**
 * Đề SQL PostgreSQL nguyên bản (loại 'sql-pg'). o = { ten, kho, phut, en, vi, yc:[[en,vi]], giai, khoi?, kiem, sai?,
 *   goiY, loi, gt:[en,vi], tns?, kn?, csdl?, ld? ({en,vi} | null), tuy?, dangBai? }
 */
export function sqlBai(o) {
  return sqlPg({
    tieuDe: o.ten, doKho: o.kho, phut: o.phut, khaiNiem: o.kn || [], the: ['nodejs', 'postgresql'],
    ...(o.dangBai ? { dangBai: o.dangBai } : {}),
    moTa: { en: o.en, vi: o.vi },
    yeuCau: { en: o.yc.map((x) => x[0]), vi: o.yc.map((x) => x[1]) },
    giai: o.giai, ...(o.khoi ? { khoiDau: o.khoi } : {}),
    csdl: o.csdl ?? notesDb(), tenCsdl: 'notes',
    luocDo: o.ld === undefined ? luocDoNotes() : o.ld,
    kiem: o.kiem, ...(o.sai ? { saiMau: o.sai } : {}), ...(o.tuy ? { tuy: o.tuy } : {}),
    goiY: o.goiY.map(hv), loiHayGap: o.loi.map(hv),
    giaiThich: { en: `<p>${o.gt[0]}</p>`, vi: `<p>${o.gt[1]}</p>` }, thuatNgu: o.tns || [],
  });
}
