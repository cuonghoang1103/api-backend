/**
 * Kiểm các đề T-SQL chạy TRÊN MÁY (`tsql()` trong _chung.mjs) bằng một SQL Server THẬT — như người học chạy
 * setup.sql → solution.sql → check.sql. Với mỗi đề:
 *   LỜI GIẢI   ⇒ check.sql in đủ PASS, không FAIL ("ALL n CHECKS PASSED")
 *   KHỞI ĐẦU   ⇒ ≥ 1 FAIL
 *   mỗi SAI MẪU (saiTay) ⇒ ≥ 1 FAIL  — in các kiểm đã bắt nó (để viết "Lỗi hay gặp" cho đúng)
 *
 * Cần: một SQL Server/Azure SQL Edge riêng (ĐỪNG dùng container của phiên khác) + gói `tedious` (không có trong repo):
 *   docker run -d --name dbicl-sqledge -e ACCEPT_EULA=1 -e 'MSSQL_SA_PASSWORD=CtLab#2026x' -p 127.0.0.1:14339:1433 mcr.microsoft.com/azure-sql-edge
 *   (cd <thư mục nháp> && npm i tedious@18)
 *   node content/codelab/dbi202-practice/nguon/_kiem-tay.mjs --tedious <thư mục nháp>/node_modules/tedious [--chi <module>] [--cong 14339] [--chi-tiet]
 * Azure SQL Edge = lõi SQL Server 2019 ⇒ lời giải nào chạy ở đây cũng chạy trên SQL Server 2019/2022 của phòng thi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const NGUON = path.dirname(fileURLToPath(import.meta.url));
const arg = (ten, md) => { const i = process.argv.indexOf(ten); return i > 0 ? process.argv[i + 1] : md; };
const TEDIOUS = arg('--tedious', process.env.TEDIOUS_DIR);
const CHI = arg('--chi', null);
const CONG = Number(arg('--cong', '14339'));
const MAT_KHAU = process.env.DBICL_SA_PASSWORD || 'CtLab#2026x';
const CHI_TIET = process.argv.includes('--chi-tiet');
if (!TEDIOUS) { console.error('Thiếu --tedious <đường dẫn tới node_modules/tedious> (xem đầu tệp).'); process.exit(2); }
const { Connection, Request } = (await import(pathToFileURL(path.join(TEDIOUS, 'lib', 'tedious.js')).href)).default ?? (await import(pathToFileURL(path.join(TEDIOUS, 'lib', 'tedious.js')).href));

function moKetNoi() {
  return new Promise((ok, loi) => {
    const cn = new Connection({
      server: '127.0.0.1',
      authentication: { type: 'default', options: { userName: 'sa', password: MAT_KHAU } },
      options: { port: CONG, trustServerCertificate: true, encrypt: false, database: 'master', requestTimeout: 60000, rowCollectionOnRequestCompletion: true },
    });
    cn.on('connect', (e) => (e ? loi(e) : ok(cn)));
    cn.connect();
  });
}
const tachGo = (s) => String(s).split(/^\s*GO\s*$/im).map((x) => x.trim()).filter(Boolean);
function chayLo(cn, lo, tin) {
  return new Promise((ok) => {
    const rq = new Request(lo, (e) => { if (e) tin.push(`ERR ${e.message}`); ok(); });
    cn.execSqlBatch(rq);
  });
}
/** Chạy cả chuỗi tệp như sqlcmd (không -b): lỗi một lô không dừng các lô sau. Trả danh sách dòng PRINT + lỗi. */
async function chayTep(cn, ...teps) {
  const tin = [];
  const nghe = (m) => tin.push(m.message);
  const nghe2 = (m) => tin.push(`ERR ${m.message}`);
  cn.on('infoMessage', nghe);
  cn.on('errorMessage', nghe2);
  for (const t of teps) for (const lo of tachGo(t)) await chayLo(cn, lo, tin);
  cn.off('infoMessage', nghe);
  cn.off('errorMessage', nghe2);
  return tin;
}
const dem = (tin) => ({ pass: tin.filter((x) => /^PASS /.test(x)).length, fail: tin.filter((x) => /^FAIL /.test(x)) });

const cn = await moKetNoi();
const tepNguon = fs.readdirSync(NGUON).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort();
let soDe = 0, soLoi = 0;
for (const f of tepNguon) {
  const m = (await import(pathToFileURL(path.join(NGUON, f)).href)).default;
  if (CHI && m.slug !== CHI) continue;
  for (const d of m.de) {
    if (!d.__tay) continue;
    soDe++;
    const T = d.__tay;
    const tong = (T.check.match(/^-- CHECK \d+:/gm) || []).length;
    const ten = `[${m.slug}] ${typeof d.tieuDe === 'string' ? d.tieuDe : d.tieuDe.en}`;
    const loi = [];
    const g = await chayTep(cn, T.setup, T.giai, T.check);
    const kg = dem(g);
    if (kg.pass !== tong || kg.fail.length) loi.push(`lời giải ${kg.pass}/${tong}: ${kg.fail.join(' | ') || g.filter((x) => /^ERR/.test(x)).join(' | ')}`);
    const kh = dem(await chayTep(cn, T.setup, T.khoi, T.check));
    if (!kh.fail.length) loi.push('KHỞI ĐẦU không trượt kiểm nào');
    const bat = [];
    for (const [i, s] of T.sai.entries()) {
      const ks = dem(await chayTep(cn, T.setup, s, T.check));
      if (!ks.fail.length) loi.push(`sai mẫu #${i + 1} không bị bắt`);
      else bat.push(`#${i + 1}: ${ks.fail.map((x) => x.replace(/^FAIL (\d+)\..*$/s, '$1')).join(',')}`);
    }
    if (loi.length) { soLoi++; console.log(`✗ ${ten}\n    ${loi.join('\n    ')}`); }
    else console.log(`✓ ${ten} — lời giải ${kg.pass}/${tong} · khởi đầu trượt ${kh.fail.length}${bat.length ? ` · sai mẫu bị bắt ở kiểm ${bat.join(' ')}` : ''}`);
    if (CHI_TIET) for (const x of g) console.log(`      ${x}`);
  }
}
cn.close();
console.log(`\n${soLoi ? '✗' : '✓'} ${soDe} đề T-SQL chạy trên máy — ${soLoi} lỗi`);
process.exit(soLoi ? 1 : 0);
