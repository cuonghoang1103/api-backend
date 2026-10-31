#!/usr/bin/env node
/**
 * codelab-kiem-cham-trinh-duyet.mjs — chạy MÁY CHẤM TRÌNH DUYỆT thật (frontend/src/components/code-lab/cham)
 * trên mọi đề có bộ kiểm trong content/codelab/<track>/<track>__*.json, bằng Chromium (Playwright), DƯỚI
 * ĐÚNG CSP của web (đọc từ frontend/next.config.js).
 *
 * Mỗi đề: LỜI GIẢI phải ĐẠT mọi kiểm (kể cả kiểm ẩn); CODE KHỞI ĐẦU phải TRƯỢT ít nhất một.
 * Bổ sung cho scripts/codelab-kiem-de-web.mjs (jsdom/Node): đây là máy chấm người học dùng thật.
 *
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs                       # mọi track
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track fer202-practice
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --chi wf-3-3-flexbox  # một module
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --chi-tiet            # in từng kiểm trượt
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --xem                 # mở cửa sổ trình duyệt
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --app                 # GIẢ LẬP APP DESKTOP: trang mẹ dưới
 *       CSP của app (cấm script nội tuyến + eval), worker/khung HỘP CÁT với CSP riêng đọc từ
 *       desktop/src/main/security.ts — kiểm đường __CT_HOP_CAT_WORKER__ / __CT_HOP_CAT_KHUNG__.
 *       (ES modules: app chưa chấm được — kiểm đó báo "bỏ qua", không tính hỏng.)
 *   npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track postgresql-practice --do-sql
 *       SQL (31/10/2026): có đề 'sql'/'sql-pg' ⇒ TỰ KIỂM thêm đường QUÁ GIỜ (CTE đệ quy vô hạn phải bị dừng sau
 *       timeoutMs, worker dựng lại, kiểm sau vẫn chạy). `--do-sql` ⇒ ĐO PGlite: dung lượng tải (nén, qua mạng) +
 *       thời gian khởi động lần đầu (bộ đệm trống) và lần sau (bộ đệm HTTP ấm, worker mới) cho từng chế độ.
 *
 * Cần mạng tới cdn.jsdelivr.net cho đề React (React UMD + sucrase). Thoát 1 nếu có đề hỏng.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(GOC, 'package.json'));
const { chromium } = require('playwright');
const esbuild = require('esbuild');
const { testsDayDu } = await import(path.join(GOC, 'src/services/codeLab.cham.ts'));

const args = process.argv.slice(2);
const lay = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const TRACK = lay('--track');
const CHI = lay('--chi');
const CHI_TIET = args.includes('--chi-tiet');
const APP = args.includes('--app');
const DO_SQL = args.includes('--do-sql');

// ─── đề ───
const thuMuc = path.join(GOC, 'content/codelab');
const tepDe = [];
for (const t of fs.readdirSync(thuMuc)) {
  const d = path.join(thuMuc, t);
  if (!fs.statSync(d).isDirectory() || (TRACK && t !== TRACK)) continue;
  for (const f of fs.readdirSync(d)) if (f.startsWith(`${t}__`) && f.endsWith('.json')) tepDe.push(path.join(d, f));
}
/**
 * Câu trả lời ĐÚNG dựng từ đáp án tác giả (choice/order/table) khi JSON không có `dapAnMau` — để kiểm
 * "đáp án đạt 100%" (code khởi đầu = không trả lời gì ⇒ trượt). Lấy đáp án chấp nhận ĐẦU TIÊN.
 */
function dapAnTuDe(tj) {
  if (!tj || !['choice', 'order', 'table'].includes(tj.loai)) return null;
  const out = {};
  if (tj.loai === 'table') {
    for (const b of tj.bang || []) for (const [o, v] of Object.entries(b.dapAn || {})) out[`${b.ma}.${o}`] = Array.isArray(v) ? v[0] : v;
    return out;
  }
  for (const c of tj.cauHoi || []) {
    const d = c.dapAn;
    if (tj.loai === 'choice') out[c.ma] = Array.isArray(d) ? (Array.isArray(d[0]) ? d[0] : d) : [d];
    else out[c.ma] = Array.isArray(d[0]) ? d[0] : d;
  }
  return out;
}

const de = [];
let soId = 1;
for (const f of tepDe.sort()) {
  const p = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (CHI && p.moduleSlug !== CHI) continue;
  for (const ex of p.exercises) {
    if (!ex.testsJson) continue;
    const id = soId++;
    const tj = testsDayDu(ex.testsJson, id);
    const tep = (b) => Object.fromEntries((b || []).map((x) => [x.name, x.code]));
    de.push({ id, module: p.moduleSlug, title: ex.title, tj, giai: tep(ex.solutionCodeJson), dau: tep(ex.starterCodeJson), traLoi: ex.dapAnMau ?? dapAnTuDe(ex.testsJson) });
  }
}
if (!de.length) { console.log('Không có đề nào có bộ kiểm.'); process.exit(0); }

// ─── gói máy chấm ───
const goi = await esbuild.build({
  entryPoints: [path.join(GOC, 'frontend/src/components/code-lab/cham/index.ts')],
  bundle: true, format: 'iife', globalName: 'ClCham', write: false, target: 'es2020', platform: 'browser',
});
const maGoi = goi.outputFiles[0].text;

// ─── CSP thật của web ───
const cfg = require(path.join(GOC, 'frontend/next.config.js'));
const headers = await (cfg.headers ? cfg.headers() : cfg.default.headers());
const csp = headers.find((h) => h.source.startsWith('/:path')).headers.find((h) => h.key === 'Content-Security-Policy').value
  // trang thử phục vụ qua http://127.0.0.1 — bỏ chỉ thị nâng https (không đổi gì cho iframe/worker)
  .replace(/;\s*upgrade-insecure-requests/, '');

const trang = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>${maGoi.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;

// ─── giả lập app desktop: CSP đọc từ desktop/src/main/security.ts ───
function cspTuTep(ten) {
  const src = fs.readFileSync(path.join(GOC, 'desktop/src/main/security.ts'), 'utf8');
  const m = new RegExp(`const ${ten} = \\[([\\s\\S]*?)\\]\\.join`).exec(src);
  if (!m) throw new Error(`không đọc được ${ten} trong security.ts`);
  // eslint-disable-next-line no-new-func
  return new Function(`return [${m[1]}].join('; ')`)();
}
let sv;
if (APP) {
  const cspWorker = cspTuTep('CSP_HOP_CAT_WORKER');
  const cspKhung = cspTuTep('CSP_HOP_CAT_KHUNG');
  const tepPub = (t) => fs.readFileSync(path.join(GOC, 'desktop/src/renderer/public', t), 'utf8');
  sv = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const goc = `http://${req.headers.host}`;
    if (u.pathname === '/goi.js') { res.writeHead(200, { 'content-type': 'text/javascript' }); return res.end(maGoi); }
    if (u.pathname === '/hop-cat-worker.js') { res.writeHead(200, { 'content-type': 'text/javascript', 'content-security-policy': cspWorker }); return res.end(tepPub('hop-cat-worker.js')); }
    if (u.pathname === '/hop-cat-khung.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': cspKhung }); return res.end(tepPub('hop-cat-khung.html')); }
    // CSP renderer của app bản đóng gói (rút gọn đúng các chỉ thị liên quan): KHÔNG inline, KHÔNG eval
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-src ${goc}/hop-cat-khung.html; object-src 'none'; base-uri 'none'` });
    res.end(`<!doctype html><html><head><meta charset="utf-8"></head><body><script src="/goi.js"></script></body></html>`);
  });
} else {
  sv = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': csp });
    res.end(trang);
  });
}
await new Promise((r) => sv.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${sv.address().port}/`;

const trinhDuyet = await chromium.launch({ headless: !args.includes('--xem') });
const page = await trinhDuyet.newPage({ viewport: { width: 1400, height: 900 } });
const cspLoi = [];
page.on('console', (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) cspLoi.push(m.text()); if (process.env.GO_LOI) console.log('[console]', m.text().slice(0, 300)); });
await page.goto(url);
if (APP) {
  await page.evaluate((goc) => {
    globalThis.__CT_HOP_CAT_WORKER__ = `${goc}hop-cat-worker.js`;
    globalThis.__CT_HOP_CAT_KHUNG__ = `${goc}hop-cat-khung.html`;
  }, url);
  console.log('Chế độ APP: trang mẹ cấm inline/eval · worker + khung hộp cát CSP riêng');
}

let hong = 0, tongKiem = 0, datKiem = 0;
const theoLoai = {};
const t0 = Date.now();
for (const d of de) {
  const chay = (files, traLoi) => page.evaluate(async ({ tj, files, id, traLoi }) => {
    const r = await window.ClCham.chamBai({ exerciseId: id, tj, files, traLoi: traLoi || {} });
    return { dat: r.dat, tong: r.tong, ketQua: r.ketQua.map((k) => ({ i: k.i, dat: k.dat, moTa: k.moTa, thay: k.thay, boQua: k.boQua })) };
  }, { tj: d.tj, files, id: d.id, traLoi });
  let g, s;
  try {
    g = await chay(d.giai, d.traLoi);
    s = await chay(d.dau, {});
  } catch (e) {
    hong++; console.log(`  ✗ [${d.module}] "${d.title}" — lỗi chạy: ${e.message.split('\n')[0]}`); continue;
  }
  const loai = d.tj.loai;
  theoLoai[loai] = theoLoai[loai] || { de: 0, hong: 0 };
  theoLoai[loai].de++;
  tongKiem += g.tong; datKiem += g.dat;
  const truotGiai = g.ketQua.filter((k) => !k.dat && !k.boQua);
  if (g.ketQua.length && g.ketQua.every((k) => k.boQua || k.dat) && g.ketQua.some((k) => k.boQua) && s.ketQua.filter((k) => !k.boQua).every((k) => k.dat)) {
    console.log(`  ~ [${d.module}] ${d.tj.loai} "${d.title}" — bỏ qua ở chế độ này (${g.ketQua.find((k) => k.boQua)?.boQua})`);
    continue;
  }
  const truotDau = s.ketQua.filter((k) => !k.dat && !k.boQua).length;
  const loi = [];
  if (truotGiai.length) loi.push(`lời giải TRƯỢT ${truotGiai.length}/${g.tong}`);
  if (truotDau === 0) loi.push('code khởi đầu ĐẠT hết — bộ kiểm không phân biệt được');
  if (loi.length) {
    hong++; theoLoai[loai].hong++;
    console.log(`  ✗ [${d.module}] ${loai} "${d.title}" — ${loi.join(' · ')}`);
    for (const k of truotGiai.slice(0, CHI_TIET ? 99 : 3)) console.log(`      #${k.i + 1} ${k.moTa} — thấy: ${k.thay ?? '—'}`);
  } else if (CHI_TIET) console.log(`  ✓ [${d.module}] ${loai} "${d.title}" ${g.dat}/${g.tong} · khởi đầu trượt ${truotDau}`);
}
// ─── SQL: tự kiểm đường QUÁ GIỜ (truy vấn chạy mãi ⇒ huỷ worker, kiểm sau dựng lại máy) ───
const coLoaiSql = [...new Set(de.map((d) => d.tj.loai).filter((l) => l === 'sql' || l === 'sql-pg'))];
for (const loai of coLoaiSql) {
  // sql-pg: CTE đệ quy vô hạn · sql (chế độ SQL Server chặn WITH RECURSIVE trước khi chạy): tích Descartes khổng lồ
  const vo = loai === 'sql-pg'
    ? 'WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r) SELECT count(*) AS n FROM r'
    : 'SELECT COUNT(*) AS n FROM pg_class a, pg_class b, pg_class c, pg_class d, pg_class e';
  const tj = { loai, csdl: '', timeoutMs: 3000, kiem: [
    { i: 0, kiem: 'ket-qua', moTa: 'CTE đệ quy vô hạn', mongDoi: { cot: ['n'], hang: [[1]] } },
    { i: 1, kiem: 'ket-qua', moTa: 'kiểm sau (cùng mã) báo ngay, không đợi thêm', mongDoi: { cot: ['n'], hang: [[1]] } },
  ] };
  const tj2 = { loai, csdl: '', kiem: [{ i: 0, kiem: 'ket-qua', moTa: 'máy dựng lại', mongDoi: { cot: ['n'], hang: [[1]] } }] };
  const r = await page.evaluate(async ({ tj, tj2, vo }) => {
    const t0 = performance.now();
    const a = await window.ClCham.chamBai({ exerciseId: 0, tj, files: { 'query.sql': vo } });
    const t1 = performance.now();
    const b = await window.ClCham.chamBai({ exerciseId: 0, tj: tj2, files: { 'query.sql': 'SELECT 1 AS n' } });
    return { a: a.ketQua.map((k) => ({ dat: k.dat, thay: k.thay, ms: k.ms })), msA: Math.round(t1 - t0), b: b.ketQua.map((k) => ({ dat: k.dat, thay: k.thay })) };
  }, { tj, tj2, vo });
  const ok = r.a.length === 2 && r.a.every((k) => !k.dat && /Quá 3 giây/.test(k.thay ?? '')) && r.msA < 3000 + 2500 && r.b[0]?.dat === true;
  console.log(`${ok ? '  ✓' : '  ✗'} [tự kiểm ${loai}] truy vấn vô hạn bị dừng sau ~${r.a[0]?.ms ?? '?'} ms (cả 2 kiểm: ${r.msA} ms) · máy dựng lại chấm tiếp: ${r.b[0]?.dat ? 'đạt' : `TRƯỢT — ${r.b[0]?.thay}`}`);
  if (!ok) { hong++; console.log(`      ${JSON.stringify(r).slice(0, 400)}`); }
}

// ─── --do-sql: đo PGlite (tải nén + khởi động lần đầu / lần sau) cho từng chế độ ───
if (DO_SQL) {
  console.log('\nĐo PGlite (mỗi chế độ: ngữ cảnh trình duyệt MỚI = bộ đệm trống, rồi trang mới cùng ngữ cảnh = bộ đệm HTTP ấm):');
  for (const loai of ['sql-pg', 'sql']) {
    const ctx = await trinhDuyet.newContext();
    const do1 = async () => {
      const p = await ctx.newPage();
      let byteNen = 0, byteGoc = 0, soTep = 0, tuBoDem = 0;
      p.on('requestfinished', async (req) => {
        if (!/pglite/i.test(req.url())) return;
        const res = await req.response();
        const sz = await req.sizes().catch(() => null);
        soTep++;
        if (res && res.fromServiceWorker()) return;
        // responseBodySize = byte NÉN nhận qua mạng; -1/0 ⇒ lấy từ bộ đệm HTTP
        if (sz && sz.responseBodySize > 0) byteNen += sz.responseBodySize; else tuBoDem++;
        try { byteGoc += (await res.body()).length; } catch { /* worker: không lấy được thân */ }
      });
      await p.goto(url);
      const ms = await p.evaluate(async (loai) => {
        const t0 = performance.now();
        const r = await window.ClCham.chamBai({ exerciseId: 0, tj: { loai, csdl: 'CREATE TABLE t (a int); INSERT INTO t VALUES (1)', kiem: [{ i: 0, kiem: 'ket-qua', moTa: 'đo', mongDoi: { cot: ['a'], hang: [[1]] } }] }, files: { 'query.sql': 'SELECT a FROM t' } });
        const t1 = performance.now();
        const r2 = await window.ClCham.chamBai({ exerciseId: 0, tj: { loai, csdl: 'CREATE TABLE t (a int); INSERT INTO t VALUES (1)', kiem: [{ i: 0, kiem: 'ket-qua', moTa: 'đo', mongDoi: { cot: ['a'], hang: [[1]] } }] }, files: { 'query.sql': 'SELECT a FROM t' } });
        return { mo: Math.round(t1 - t0), kiem: Math.round(performance.now() - t1), dat: r.dat === 1 && r2.dat === 1 };
      }, loai);
      await p.waitForTimeout(300);
      await p.close();
      return { ...ms, byteNen, byteGoc, soTep, tuBoDem };
    };
    const lan1 = await do1();
    const lan2 = await do1();
    const mb = (b) => `${(b / 1048576).toFixed(2)} MB`;
    console.log(`  ${loai.padEnd(7)} lần đầu: ${lan1.mo} ms tới kiểm đầu tiên xong · tải ${lan1.soTep} tệp ${mb(lan1.byteNen)} qua mạng${lan1.byteGoc ? ` (${mb(lan1.byteGoc)} giải nén)` : ''}`);
    console.log(`  ${''.padEnd(7)} lần sau: ${lan2.mo} ms · qua mạng ${mb(lan2.byteNen)} (${lan2.tuBoDem}/${lan2.soTep} tệp từ bộ đệm) · một kiểm khi máy đã mở: ${lan2.kiem} ms · đúng: ${lan1.dat && lan2.dat}`);
    await ctx.close();
  }
}

await trinhDuyet.close();
sv.close();

console.log('\n loại       đề  hỏng');
for (const [k, v] of Object.entries(theoLoai)) console.log(` ${k.padEnd(9)} ${String(v.de).padStart(4)} ${String(v.hong).padStart(5)}`);
console.log(`\nLời giải: ${datKiem}/${tongKiem} kiểm đạt · ${de.length} đề · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
if (cspLoi.length) { console.log(`⚠ ${cspLoi.length} cảnh báo CSP, vd: ${cspLoi[0].slice(0, 200)}`); }
console.log(hong ? `\n✗ ${hong} đề hỏng` : '\n✓ máy chấm trình duyệt: mọi lời giải đạt, mọi code khởi đầu trượt');
process.exit(hong ? 1 : 0);
