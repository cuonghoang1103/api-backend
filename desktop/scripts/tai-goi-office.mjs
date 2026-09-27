/**
 * Tải các gói Python TẠO FILE VĂN PHÒNG cho hộp cát chat (27/09/2026):
 * Excel (.xlsx) · Word (.docx) · PowerPoint (.pptx) · PDF có tiếng Việt.
 *
 *   node scripts/tai-goi-office.mjs
 *
 * Bản Pyodide đầy đủ KHÔNG có các gói này (đo: `import openpyxl` ⇒
 * ModuleNotFoundError), nhưng chúng là wheel thuần Python ⇒ `micropip`
 * cài được từ file. Tải về ĐĨA rồi phục vụ từ CHÍNH MÌNH vì:
 *   • app desktop: CSP chỉ cho `app://`, và hộp cát phải chạy khi mất mạng;
 *   • web: CSP không cho PyPI, và phụ thuộc PyPI lúc chạy là thêm một chỗ hỏng.
 * Ghi vào CẢ HAI nơi: `desktop/src/renderer/public/pyodide/` và
 * `frontend/public/pyodide-them/`, kèm `office.json` liệt kê tên file để
 * worker biết phải cài gì (tên file có số phiên bản).
 *
 * Phụ thuộc có sẵn trong Pyodide (lxml, typing-extensions, pillow, fonttools,
 * micropip) được nạp bằng `loadPackage`, không tải ở đây — trừ bản desktop
 * cần có file của chúng: chạy thêm `node scripts/tai-goi-python.mjs lxml micropip typing-extensions`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DICH = [
  path.join(goc, 'src/renderer/public/pyodide'),
  path.join(goc, '..', 'frontend/public/pyodide-them'),
];
/** Tên trên PyPI — chỉ wheel THUẦN PYTHON (py3-none-any). */
const GOI = ['openpyxl', 'et-xmlfile', 'xlsxwriter', 'python-docx', 'python-pptx', 'fpdf2', 'defusedxml'];

for (const d of DICH) fs.mkdirSync(d, { recursive: true });
const ds = [];
for (const ten of GOI) {
  const j = await (await fetch(`https://pypi.org/pypi/${ten}/json`)).json();
  const whl = j.urls.find((u) => u.packagetype === 'bdist_wheel' && /-py3-none-any\.whl$|-py2\.py3-none-any\.whl$/.test(u.filename));
  if (!whl) { console.error(`✗ ${ten}: không có wheel thuần Python`); process.exit(1); }
  const buf = Buffer.from(await (await fetch(whl.url)).arrayBuffer());
  for (const d of DICH) fs.writeFileSync(path.join(d, whl.filename), buf);
  ds.push(whl.filename);
  console.log(`  ↓ ${whl.filename} (${Math.round(buf.length / 1024)} KB)`);
}
for (const d of DICH) fs.writeFileSync(path.join(d, 'office.json'), JSON.stringify({ wheels: ds }, null, 2) + '\n');
console.log('Xong —', ds.length, 'wheel, ghi vào', DICH.length, 'nơi.');
