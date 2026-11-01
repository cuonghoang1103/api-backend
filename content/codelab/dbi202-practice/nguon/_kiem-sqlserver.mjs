/**
 * ĐỐI CHIẾU đề SQL chấm trong trình duyệt với SQL SERVER THẬT: với mỗi kiểm của mỗi đề `sql` (JSON đã xuất), dựng CSDL sạch
 * trên SQL Server (cùng `csdl` cú pháp T-SQL của đề + `themCsdl`), chạy LỜI GIẢI, rồi
 *   ket-qua / sau-lenh ⇒ so bảng kết quả với `mongDoi` (bảng mà máy chấm PGlite dựng) — không thứ tự, số so theo giá trị
 *   bi-chan            ⇒ câu thử phải LỖI trên SQL Server
 *   chay-duoc          ⇒ câu thử phải CHẠY trên SQL Server
 * Mục đích: lời giải "chạy giống nhau trên SQL Server và PostgreSQL" là lời hứa của bộ đề — kiểm nó bằng máy thật.
 * Kiểm đọc information_schema (tên kiểu khác nhau giữa hai hệ) chỉ kiểm "chạy không lỗi", không so bảng; kiểm đọc pg_* bỏ qua
 * (lời giải vẫn được chạy — lỗi cú pháp T-SQL vẫn bị bắt).
 *
 *   node content/codelab/dbi202-practice/nguon/_kiem-sqlserver.mjs --tedious <nháp>/node_modules/tedious [--chi <module>] [--cong 14339]
 * (container SQL Server riêng — xem đầu _kiem-tay.mjs)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const TRACK = path.join(NGUON, '..');
const arg = (ten, md) => { const i = process.argv.indexOf(ten); return i > 0 ? process.argv[i + 1] : md; };
const TEDIOUS = arg('--tedious', process.env.TEDIOUS_DIR);
const CHI = arg('--chi', null);
const CONG = Number(arg('--cong', '14339'));
const MAT_KHAU = process.env.DBICL_SA_PASSWORD || 'CtLab#2026x';
if (!TEDIOUS) { console.error('Thiếu --tedious <đường dẫn tới node_modules/tedious>'); process.exit(2); }
const td = await import(pathToFileURL(path.join(TEDIOUS, 'lib', 'tedious.js')).href);
const { Connection, Request } = td.default ?? td;

const cn = await new Promise((ok, loi) => {
  const c = new Connection({ server: '127.0.0.1', authentication: { type: 'default', options: { userName: 'sa', password: MAT_KHAU } }, options: { port: CONG, trustServerCertificate: true, encrypt: false, database: 'master', requestTimeout: 60000 } });
  c.on('connect', (e) => (e ? loi(e) : ok(c))); c.connect();
});

/** Tách câu lệnh theo ';' ngoài chuỗi/chú thích (đủ cho SQL của đề). */
function tachCau(sql) {
  const out = []; let cur = ''; let i = 0; const s = String(sql || '');
  while (i < s.length) {
    const c = s[i];
    if (c === '-' && s[i + 1] === '-') { const j = s.indexOf('\n', i); const h = j < 0 ? s.length : j; cur += s.slice(i, h); i = h; continue; }
    if (c === '/' && s[i + 1] === '*') { const j = s.indexOf('*/', i + 2); const h = j < 0 ? s.length : j + 2; cur += s.slice(i, h); i = h; continue; }
    if (c === "'") { let j = i + 1; while (j < s.length) { if (s[j] === "'" && s[j + 1] === "'") { j += 2; continue; } if (s[j] === "'") break; j++; } cur += s.slice(i, j + 1); i = j + 1; continue; }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  if (cur.replace(/--[^\n]*/g, '').trim()) out.push(cur.trim());
  return out.filter((x) => x.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim());
}
/** Chạy một câu; trả { loi, bang } — bang = bảng kết quả cuối cùng (cot, hang). */
function chay(cau) {
  return new Promise((ok) => {
    let bang = null; let cot = null; let loi = null;
    const rq = new Request(cau, (e) => { if (e) loi = e.message; ok({ loi, bang }); });
    rq.on('columnMetadata', (m) => { cot = m.map((x) => x.colName); bang = { cot, hang: [] }; });
    rq.on('row', (cols) => { if (bang) bang.hang.push(cols.map((x) => x.value)); });
    cn.execSqlBatch(rq);
  });
}
async function chayNhieu(sql) {
  let cuoi = null;
  for (const c of tachCau(sql)) { const r = await chay(c); if (r.loi) return { loi: `${r.loi} ⟵ ${c.replace(/\s+/g, ' ').slice(0, 90)}` }; if (r.bang) cuoi = r.bang; }
  return { bang: cuoi };
}
const chuan = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (v instanceof Date) { const iso = v.toISOString(); return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : iso.replace('T', ' ').replace(/\.000Z$/, '').replace(/Z$/, ''); }
  if (typeof v === 'boolean') return v ? '1' : '0';
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return String(Math.round(Number(s) * 10000) / 10000);
  return s.toLowerCase();
};
const tui = (hang) => hang.map((r) => r.map(chuan).join(' | ')).sort();
function soBang(bang, mong) {
  if (!bang) return 'không có bảng kết quả';
  if (bang.hang.length !== mong.hang.length) return `số dòng ${bang.hang.length} ≠ ${mong.hang.length}`;
  const a = tui(bang.hang), b = tui(mong.hang);
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return `khác dòng: SQL Server «${a[i]}» vs mong đợi «${b[i]}»`;
  return null;
}
async function dbMoi() {
  await chay(`USE master; IF DB_ID(N'DBI202_SQ') IS NOT NULL BEGIN ALTER DATABASE DBI202_SQ SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE DBI202_SQ; END; CREATE DATABASE DBI202_SQ;`);
  await chay('USE DBI202_SQ;');
}

const tep = fs.readdirSync(TRACK).filter((f) => /^dbi202-practice__.*\.json$/.test(f)).sort();
let soKiem = 0; const loiDs = [];
for (const f of tep) {
  const m = JSON.parse(fs.readFileSync(path.join(TRACK, f), 'utf8'));
  if (CHI && m.moduleSlug !== CHI) continue;
  for (const ex of m.exercises) {
    const t = ex.testsJson; if (t?.loai !== 'sql') continue;
    const giai = Object.fromEntries(ex.solutionCodeJson.map((x) => [x.name, x.code]));
    for (const [i, k] of t.kiem.entries()) {
      if (k.kiem === 'ma-nguon') continue;
      soKiem++;
      const nhan = `[${m.moduleSlug}] ${ex.title} · kiểm ${i + 1} (${String(k.moTa).split('|||')[0]})`;
      await dbMoi();
      const csdl = k.csdl ?? t.csdl;
      let r = await chayNhieu(csdl); if (r.loi) { loiDs.push(`${nhan}: CSDL lỗi — ${r.loi}`); continue; }
      if (k.themCsdl) { r = await chayNhieu(k.themCsdl); if (r.loi) { loiDs.push(`${nhan}: themCsdl lỗi — ${r.loi}`); continue; } }
      const ma = giai[k.tep ?? t.tepChinh] ?? '';
      const rg = await chayNhieu(ma);
      if (rg.loi) { loiDs.push(`${nhan}: LỜI GIẢI lỗi trên SQL Server — ${rg.loi}`); continue; }
      if (k.kiem === 'ket-qua') { const d = soBang(rg.bang, k.mongDoi); if (d) loiDs.push(`${nhan}: ${d}`); }
      else if (k.kiem === 'sau-lenh') {
        if (/\bpg_[a-z_]+/i.test(k.kiemTra)) continue;            // kiểm đọc danh mục PostgreSQL (pg_indexes…) — không có trên SQL Server
        const rk = await chayNhieu(k.kiemTra);
        if (rk.loi) loiDs.push(`${nhan}: kiemTra lỗi — ${rk.loi}`);
        else if (!/information_schema/i.test(k.kiemTra)) { const d = soBang(rk.bang, k.mongDoi); if (d) loiDs.push(`${nhan}: ${d}`); }
      } else if (k.kiem === 'bi-chan') { const rt = await chayNhieu(k.thu); if (!rt.loi) loiDs.push(`${nhan}: câu thử KHÔNG bị chặn trên SQL Server`); }
      else if (k.kiem === 'chay-duoc') { const rt = await chayNhieu(k.thu); if (rt.loi) loiDs.push(`${nhan}: câu thử lỗi trên SQL Server — ${rt.loi}`); }
    }
  }
}
await chay(`USE master; IF DB_ID(N'DBI202_SQ') IS NOT NULL BEGIN ALTER DATABASE DBI202_SQ SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE DBI202_SQ; END;`);
cn.close();
for (const l of loiDs) console.log(`✗ ${l}`);
console.log(`\n${loiDs.length ? '✗' : '✓'} ${soKiem} kiểm đối chiếu trên SQL Server — ${loiDs.length} lệch`);
process.exit(loiDs.length ? 1 : 0);
