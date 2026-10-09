#!/usr/bin/env node
/**
 * CT Work UX-D — bản RASTER cho nơi không vẽ được SVG (email: Gmail/Outlook chặn SVG; favicon PNG; apple-touch-icon):
 *   public/images/work-covers/email/<id>.jpg  1200×480 (hiện 600×240 trong thư, nét trên màn Retina)
 *   public/images/ct-work/ct-work-{32,96,180,512}.png  logo CT Work
 * Chạy sau gen-work-covers.mjs:  node frontend/scripts/work-covers/gen-work-raster.mjs  (dùng sharp của frontend).
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const fe = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const coverDir = path.join(fe, 'public/images/work-covers');
const emailDir = path.join(coverDir, 'email');
mkdirSync(emailDir, { recursive: true });
for (const f of readdirSync(coverDir).filter((x) => x.endsWith('.svg'))) {
  const out = await sharp(readFileSync(path.join(coverDir, f)), { density: 110 }).resize(1200, 480, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  writeFileSync(path.join(emailDir, f.replace(/\.svg$/, '.jpg')), out);
}
const logo = readFileSync(path.join(fe, 'public/images/ct-work/ct-work.svg'));
for (const s of [32, 96, 180, 512]) {
  // apple-touch-icon (180) cần nền đặc, không bo — iOS tự bo góc; ảnh SVG đã kín nền nên chỉ cần resize.
  writeFileSync(path.join(fe, `public/images/ct-work/ct-work-${s}.png`), await sharp(logo, { density: 72 * s / 64 * 2 }).resize(s, s).png().toBuffer());
}
console.log('xong');
