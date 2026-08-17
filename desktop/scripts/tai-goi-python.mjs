/**
 * Tải các gói khoa học của Pyodide về `public/pyodide/`.
 *
 * Chạy khi nâng cấp Pyodide, hoặc khi muốn thêm gói mới vào hộp cát:
 *   node scripts/tai-goi-python.mjs            (numpy · pandas · matplotlib)
 *   node scripts/tai-goi-python.mjs scipy      (thêm gói khác)
 *
 * Vì sao tải VỀ ĐĨA chứ không lấy từ CDN lúc chạy: cả điểm của hộp cát là chạy
 * được KHÔNG cần mạng, và CSP của app chỉ cho tải tài nguyên từ chính origin
 * `app://`. Lấy từ CDN nghĩa là phải nới `connect-src` cho một tên miền ngoài
 * và mỗi lần bấm Chạy lại phụ thuộc vào đường truyền.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src/renderer/public/pyodide');
const khoa = JSON.parse(fs.readFileSync(path.join(goc, 'pyodide-lock.json'), 'utf8'));
const goi = khoa.packages;
const PHIEN_BAN = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  .devDependencies?.pyodide?.replace(/^[^0-9]*/, '')
  ?? JSON.parse(fs.readFileSync(new URL('../node_modules/pyodide/package.json', import.meta.url), 'utf8')).version;

const muon = process.argv.slice(2).length ? process.argv.slice(2) : ['numpy', 'pandas', 'matplotlib'];

/** Đóng bao phụ thuộc — thiếu một gói con là `loadPackage` chết giữa chừng. */
function dongBao(ten, thay = new Set()) {
  if (thay.has(ten) || !goi[ten]) return thay;
  thay.add(ten);
  for (const x of goi[ten].depends ?? []) dongBao(x, thay);
  return thay;
}

const canCo = new Set();
for (const g of muon) {
  if (!goi[g]) { console.error(`✗ không có gói "${g}" trong pyodide-lock.json`); process.exit(1); }
  dongBao(g, canCo);
}

console.log(`Pyodide v${PHIEN_BAN} · ${muon.join(', ')} ⇒ ${canCo.size} gói`);
let tai = 0;
for (const ten of [...canCo].sort()) {
  const file = goi[ten].file_name;
  const dich = path.join(goc, file);
  if (fs.existsSync(dich)) { console.log(`  = ${file}`); continue; }
  const url = `https://cdn.jsdelivr.net/pyodide/v${PHIEN_BAN}/full/${file}`;
  const res = await fetch(url);
  if (!res.ok) { console.error(`  ✗ ${file} — HTTP ${res.status}`); process.exit(1); }
  fs.writeFileSync(dich, Buffer.from(await res.arrayBuffer()));
  console.log(`  ↓ ${file}`);
  tai++;
}
console.log(`Xong — tải mới ${tai} file.`);
