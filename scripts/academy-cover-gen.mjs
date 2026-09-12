/**
 * academy-cover-gen.mjs — sinh ảnh bìa cho môn học Academy.
 *
 * Vì sao cần: ảnh bìa của 50 môn đang có là ảnh tải tay từng cái
 * (images/cea201-<timestamp>.jfif). Khung chương trình FPTU có ~200 mã môn,
 * và các khối ngành ngoài CNTT còn nhiều hơn — tải tay từng ảnh là không khả thi.
 *
 * Ảnh 1200×675 (đúng tỉ lệ thẻ khoá học), nền tối theo tông Academy, mã môn cỡ
 * lớn ở giữa, tên môn bên dưới, dải màu theo NGÀNH để nhìn là biết môn thuộc
 * khối nào. Chữ vẽ bằng SVG rồi hợp thành bằng sharp — không phụ thuộc mạng,
 * không phụ thuộc font hệ thống ngoài bộ có sẵn của macOS.
 *
 *   node scripts/academy-cover-gen.mjs --out /tmp/bia --code CEA201 \
 *        --title "Computer Organization and Architecture" --major se
 *   node scripts/academy-cover-gen.mjs --out /tmp/bia --from danh-sach.tsv
 *
 * File TSV: <mã>\t<tên>\t<ngành>  (một dòng một môn)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const OUT = val('--out', '/tmp/bia');
const W = 1200, H = 675;

/** Mỗi ngành một cặp màu. Không phải trang trí: người học nhìn dải màu là biết
 *  môn thuộc khối nào mà không cần đọc chữ. */
const MAU = {
  se: ['#6366f1', '#8b5cf6'],   ia: ['#0ea5e9', '#2563eb'],
  gd: ['#ec4899', '#f43f5e'],   is: ['#14b8a6', '#0d9488'],
  ic: ['#f59e0b', '#d97706'],   as: ['#ef4444', '#b91c1c'],
  ra: ['#22c55e', '#15803d'],   dx: ['#a855f7', '#7c3aed'],
  chung: ['#64748b', '#475569'],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Cắt tên môn thành tối đa 2 dòng cho vừa khung. */
function xuongDong(ten, max = 42) {
  const tu = String(ten).split(/\s+/);
  const dong = []; let cur = '';
  for (const t of tu) {
    if ((cur + ' ' + t).trim().length > max) { dong.push(cur.trim()); cur = t; }
    else cur = (cur + ' ' + t).trim();
    if (dong.length === 2) break;
  }
  if (dong.length < 2 && cur) dong.push(cur.trim());
  if (dong.length === 2 && tu.join(' ').length > dong.join(' ').length + 1) {
    dong[1] = dong[1].replace(/\s+\S*$/, '') + '…';
  }
  return dong.filter(Boolean);
}

export async function veBia({ code, title, major = 'chung', outDir = OUT }) {
  const [c1, c2] = MAU[major] || MAU.chung;
  const dong = xuongDong(title);
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0a1f"/><stop offset="55%" stop-color="#141033"/><stop offset="100%" stop-color="#0b0a1f"/>
    </linearGradient>
    <linearGradient id="dai" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="quang" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.28"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#nen)"/>
  <rect width="${W}" height="${H}" fill="url(#quang)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#dai)"/>
  <text x="${W / 2}" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="150" font-weight="700" fill="#ffffff" letter-spacing="6">${esc(code)}</text>
  <rect x="${W / 2 - 70}" y="340" width="140" height="5" rx="2.5" fill="url(#dai)"/>
  ${dong.map((d, i) => `<text x="${W / 2}" y="${418 + i * 52}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="40" fill="#c9c7e8">${esc(d)}</text>`).join('\n  ')}
  <text x="${W / 2}" y="${H - 46}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="22" fill="#6f6b9e" letter-spacing="5">FPT UNIVERSITY ACADEMY · cuongthai.com</text>
</svg>`;
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${code}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const from = val('--from', null);
  const rows = from
    ? fs.readFileSync(from, 'utf8').split('\n').filter(Boolean).map((l) => {
        const [code, title, major] = l.split('\t');
        return { code: code.trim(), title: (title || code).trim(), major: (major || 'chung').trim() };
      })
    : [{ code: val('--code', 'XXX000'), title: val('--title', 'Course title'), major: val('--major', 'chung') }];
  let n = 0;
  for (const r of rows) { await veBia({ ...r, outDir: OUT }); n++; }
  console.log(`đã vẽ ${n} ảnh bìa → ${OUT}`);
}
