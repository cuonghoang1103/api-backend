/**
 * CT Work — dựng chữ "CT Work" thành ĐƯỜNG VIỀN (path) từ phông Inter có sẵn trong public/og-fonts.
 *
 * Vì sao không để <text>: SVG/PNG của logo phải giống hệt nhau ở mọi nơi (trình duyệt, sharp/librsvg khi xuất PNG,
 * Satori khi vẽ ảnh OG, ứng dụng thư). <text> phụ thuộc phông có trên máy đang vẽ ⇒ máy chủ không có Inter thì chữ đổi
 * dáng. Chữ đã thành path thì không phụ thuộc gì.
 *
 * Chạy lại khi đổi phông/độ đậm/khoảng chữ (cần `fontkit` — có trong node_modules ở gốc repo):
 *   node frontend/scripts/ct-work-brand/wordmark.mjs
 * ⇒ ghi đè frontend/src/components/work/brand/wordmark.ts (tệp sinh ra, đừng sửa tay).
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const FE = path.resolve(here, '../..');
const require = createRequire(path.join(FE, '../package.json'));
const fontkit = require('fontkit');

const font = (w) => fontkit.openSync(path.join(FE, `public/og-fonts/inter-latin-${w}-normal.woff`));
const bold = font(800);
const semi = font(600);
const UPM = bold.unitsPerEm; // 2048
const TRACK = -0.012 * UPM; // khoảng chữ hơi khít, kiểu chữ hiển thị

/** Ghép các đoạn (chữ + phông) thành một danh sách path trong hệ toạ độ y hướng XUỐNG, gốc = đường cơ sở. */
function run(segments) {
  const out = [];
  let x = 0;
  for (const [text, f] of segments) {
    const r = f.layout(text);
    r.glyphs.forEach((g, i) => {
      if (g.path.commands.length) {
        // Lật trục y (phông y hướng lên) và dời theo x hiện tại, làm tròn 1 chữ số thập phân.
        const d = g.path
          .scale(1, -1)
          .translate(x + r.positions[i].xOffset, 0)
          .toSVG()
          .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));
        out.push(d);
      }
      x += r.positions[i].xAdvance + TRACK;
    });
  }
  return { d: out.join(''), width: Math.round(x - TRACK) };
}

const wm = run([['CT', bold], [' ', semi], ['Work', semi]]);
const file = `/* eslint-disable */
// TỆP SINH RA bởi frontend/scripts/ct-work-brand/wordmark.mjs — đừng sửa tay.
// Chữ "CT Work" (Inter ExtraBold "CT" + SemiBold "Work", khoảng chữ ${TRACK / UPM}em) dạng đường viền,
// đơn vị phông (unitsPerEm ${UPM}), y hướng xuống, gốc toạ độ = đường cơ sở của chữ.
export const WORDMARK = {
  unitsPerEm: ${UPM},
  capHeight: ${bold.capHeight},
  width: ${wm.width},
  d: ${JSON.stringify(wm.d)},
} as const;
`;
writeFileSync(path.join(FE, 'src/components/work/brand/wordmark.ts'), file);
console.log('wordmark.ts', wm.width, 'units,', wm.d.length, 'ký tự path');
