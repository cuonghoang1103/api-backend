/**
 * Dựng payload lời giải MỚI cho Code Lab từ 54 project trong
 * Source_Lab211_ForCuongThai (kiến trúc Guide.xlsx của thầy).
 *
 * Chỉ ghi 2 trường: solutionCodeJson và solutionExplanationHtmlVi.
 * Các trường khác bỏ trống -> Prisma coi là undefined -> GIỮ NGUYÊN bản cũ.
 *
 * Từ 21/09/2026 chỉ lấy các bài đã sửa theo tờ checklist giấy của thầy và qua đủ
 * 3 phép kiểm — danh sách ở `_tools/theo-checklist.txt` của kho. Bài chưa có tên
 * trong đó đang là kiến trúc cũ (hoặc đang sửa dở): nạp lên là AI dạy sai.
 * `ALL=1` để bỏ lọc (chỉ khi cả 54 bài đã nằm trong danh sách).
 */
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const ROOT = '/Users/admin/Documents/Source_Lab211_ForCuongThai';
const GH = 'https://github.com/cuonghoang1103/Lab211_For_CuongHoang';
const RA = process.env.RA || '/tmp/lab211-solutions.json';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Mọi tệp nguồn trong src/: .java và cả .properties (P0070 đọc câu chữ từ
// constants/Language_xx.properties — thiếu chúng thì AI dạy một bài chạy không được).
function javaFiles(dir, base = 'src') {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...javaFiles(p, `${base}/${name}`));
    else if (name.endsWith('.java')) out.push({ name: `${base}/${name}`, language: 'java', code: fs.readFileSync(p, 'utf8') });
    else if (name.endsWith('.properties')) out.push({ name: `${base}/${name}`, language: 'properties', code: fs.readFileSync(p, 'utf8') });
  }
  return out;
}

const DAT = new Set(
  fs.readFileSync(path.join(ROOT, '_tools', 'theo-checklist.txt'), 'utf8')
    .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')),
);

const items = [];
for (const folder of fs.readdirSync(ROOT).sort()) {
  const m = folder.match(/^HE176322_(J1([SL])P(\d{4}))_/);
  if (!m) continue;
  if (!process.env.ALL && !DAT.has(folder)) continue;
  const lab = `J1.${m[2]}.P${m[3]}`;
  const dir = path.join(ROOT, folder);
  const files = javaFiles(path.join(dir, 'src'));
  // man-hinh-chay.* là ảnh/bản ghi màn hình của kho, KHÔNG phải dữ liệu chương trình đọc
  const datFiles = fs.readdirSync(dir)
    .filter((f) => /\.(txt|dat|csv|properties)$/.test(f) && !f.startsWith('man-hinh-chay'));

  const huongDan = fs.readFileSync(path.join(dir, 'HUONG-DAN.md'), 'utf8');
  const than = marked.parse(huongDan);

  const hop = `<div class="callout"><span class="badge">Source đầy đủ</span>
 Project NetBeans của bài này (mở bằng <b>File ▸ Open Project</b>, chạy <b>F6</b>) nằm trên GitHub:
 <a href="${GH}/tree/main/${folder}" target="_blank" rel="noopener"><b>${folder}</b></a>.
 Trong thư mục có <code>src/</code>, <code>HUONG-DAN.md</code>, <code>nbproject/</code>,
 <code>man-hinh-chay.png</code> (ảnh màn hình chạy thật)${datFiles.length ? ` và ${datFiles.length} file dữ liệu (<code>${datFiles.map(esc).join('</code>, <code>')}</code>) — <b>phải có file này chương trình mới chạy đúng</b>` : ''}.
 Tải riêng một bài: dán link thư mục vào <a href="https://download-directory.github.io/" target="_blank" rel="noopener">download-directory.github.io</a>.
 <br><br>Bộ 54 bài: <a href="${GH}" target="_blank" rel="noopener">${GH.replace('https://', '')}</a>
 — mỗi bài đã qua <code>javac --release 8 -Werror</code>, chạy kịch bản gõ phím dưới 2 locale, và soát đủ
 <b>25 mục tờ checklist giấy</b> của thầy (0 vi phạm). Tự soát bài em gõ: <code>python3 _tools/soat_checklist.py &lt;thư mục&gt;</code>.</div>`;

  items.push({
    lab,
    solutionCodeJson: files,
    solutionExplanationHtmlVi: hop + '\n' + than,
  });
}

fs.writeFileSync(RA, JSON.stringify(items, null, 1));
const kb = (fs.statSync(RA).size / 1024).toFixed(0);
console.log(`đã dựng ${items.length} bài -> ${RA} (${kb} KB)`);
console.log('ví dụ:', items[0].lab, items[0].solutionCodeJson.length, 'file java');
