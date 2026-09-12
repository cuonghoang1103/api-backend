/**
 * academy-cover-gen.mjs — sinh ảnh bìa môn Academy theo ĐÚNG phong cách bộ ảnh
 * đã có của các môn combo Node.JS (FER202, SDN302, MMA301, WDP301, SWT301…).
 *
 * Vì sao phải bám mẫu cũ: 50 môn đầu có ảnh bìa làm tay, cùng một phong cách —
 * nền tím đậm, hạt bokeh vàng, khung viền mảnh, mã môn chữ serif ánh kim, tên
 * môn căn phải dưới khung. Ảnh mới lạc phong cách thì lưới môn học nhìn chắp vá,
 * mà người học lại đọc lưới đó như một khối.
 *
 * Đo từ ảnh gốc: 1024×574 (16:9), mã môn ~150px serif, tên môn ~26px căn phải.
 * Vẽ bằng SVG + sharp: không phụ thuộc mạng, không phụ thuộc font hệ thống
 * ngoài Georgia/Helvetica có sẵn trên macOS.
 *
 *   node scripts/academy-cover-gen.mjs --out /tmp/bia --code FER202 \
 *        --title "Front-End web development with React" --major se
 *   node scripts/academy-cover-gen.mjs --out /tmp/bia --from danh-sach.tsv
 *
 * TSV: <mã>\t<tên>\t<ngành>
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const OUT = val('--out', '/tmp/bia');
const W = 1024, H = 574;

/** Tông nền theo ngành. Ảnh gốc dùng tím; các ngành khác lệch tông nhẹ để phân
 *  biệt được mà vẫn cùng một họ màu — không đổi hẳn sang màu khác. */
const TONG = {
  se: ['#2a1650', '#140a2e', '#efc975'], ia: ['#122a50', '#0a142e', '#e8d29a'],
  gd: ['#45123a', '#2a0a24', '#f0c7a0'], is: ['#0f3a3a', '#08201f', '#dfd39a'],
  ic: ['#402a10', '#241708', '#f0cf8a'], as: ['#45161a', '#280c0f', '#eec39a'],
  ra: ['#123a20', '#081f11', '#d8dc9a'], dx: ['#361452', '#1d0a2e', '#e6c5f0'],
  chung: ['#241d44', '#120e26', '#d9d3ea'],
  // Các khối ngành ngoài CNTT — vẫn cùng họ màu tối + serif ánh kim, lệch tông
  // để phân biệt khối: bba (kinh doanh) navy-vàng · mc (truyền thông) mận-hồng ·
  // lang (ngôn ngữ) lam ngọc · law (luật) đồng tối · cs (khoa học máy tính) tím.
  bba: ['#1c2b52', '#0d1730', '#e6cf92'], mc: ['#4a1530', '#2a0c1c', '#f0c0a8'],
  lang: ['#123a44', '#08202a', '#cfe0d8'], law: ['#2a2418', '#160f08', '#e0c78a'],
  cs: ['#241452', '#120a2e', '#c9b8f0'],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tên môn xuống tối đa 2 dòng, căn phải như ảnh gốc. */
function xuongDong(ten, max = 40) {
  const tu = String(ten).split(/\s+/); const dong = []; let cur = '';
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

/** Hạt bokeh: vị trí cố định theo mã môn (hash) nên mỗi môn một bố cục riêng
 *  mà chạy lại vẫn ra đúng ảnh cũ — ảnh bìa phải ổn định giữa các lần sinh. */
function hat(code, mau) {
  let h = 0; for (const c of code) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
  let s = '';
  for (let i = 0; i < 26; i++) {
    const x = rnd() * W, y = rnd() * H, r = 4 + rnd() * 26, o = 0.08 + rnd() * 0.42;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${mau}" opacity="${o.toFixed(2)}"/>`;
  }
  return s;
}

export async function veBia({ code, title, major = 'chung', outDir = OUT }) {
  const [n1, n2, vang] = TONG[major] || TONG.chung;
  const dong = xuongDong(title);
  const cỡ = code.length > 7 ? 108 : code.length > 6 ? 122 : 140;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="nen" cx="38%" cy="35%" r="85%">
      <stop offset="0%" stop-color="${n1}"/><stop offset="100%" stop-color="${n2}"/>
    </radialGradient>
    <linearGradient id="kim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff6dd"/><stop offset="42%" stop-color="${vang}"/>
      <stop offset="60%" stop-color="#a9854a"/><stop offset="100%" stop-color="#f3e2b4"/>
    </linearGradient>
    <filter id="bong" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.55"/>
    </filter>
    <filter id="mo"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#nen)"/>
  <g filter="url(#mo)">${hat(code, vang)}</g>
  <rect x="86" y="86" width="${W - 172}" height="${H - 232}" fill="none" stroke="url(#kim)" stroke-width="3" opacity="0.85"/>
  <text x="${W / 2}" y="${H / 2 - 18}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Times New Roman', Charter, Georgia, serif" font-size="${cỡ}" font-weight="700"
        font-variant-numeric="lining-nums tabular-nums"
        fill="url(#kim)" filter="url(#bong)" letter-spacing="3">${esc(code)}</text>
  ${dong.map((d, i) => `<text x="${W - 96}" y="${H - 118 + i * 34}" text-anchor="end"
        font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#e9e4f5" opacity="0.92">${esc(d)}</text>`).join('\n  ')}
  <text x="${W - 62}" y="${H - 118 + (dong.length - 1) * 34}" text-anchor="middle"
        font-family="Georgia, serif" font-size="26" fill="${vang}" opacity="0.9">✦</text>
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
