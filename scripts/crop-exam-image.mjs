/**
 * crop-exam-image.mjs — clean up a raw FUOVERFLOW question screenshot before
 * uploading to R2:
 *   1. paint over the "FUOVERFLOW.COM" watermark (bottom-left corner, fixed
 *      position across the whole batch)
 *   2. trim the huge white margin down to a tight box around the real
 *      content — done in TWO passes (banner strip, then body) because the
 *      "MULTIPLE CHOICE" banner spans the full 1920px width and would
 *      otherwise stop the trim algorithm from cropping the width at all
 *   3. re-stack a width-matched banner + trimmed body
 *
 *   node scripts/crop-exam-image.mjs --dir <thư mục qN.png> [--out <thư mục ra, mặc định ghi đè>]
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DIR = val('--dir');
const OUT_DIR = val('--out') || DIR;
if (!DIR) { console.error('cần --dir <thư mục chứa qN.png>'); process.exit(1); }
fs.mkdirSync(OUT_DIR, { recursive: true });

const BANNER_HEIGHT = 34;
const WATERMARK_W = 200;
const WATERMARK_H = 100;

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png'));
let done = 0;
for (const f of files) {
  const src = path.join(DIR, f);
  const img = sharp(src);
  const meta = await img.metadata();

  // 1. paint white over the watermark box (bottom-left)
  const whiteRect = await sharp({
    create: { width: WATERMARK_W, height: WATERMARK_H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  }).png().toBuffer();
  const whited = sharp(await img
    .composite([{ input: whiteRect, left: 0, top: Math.max(0, meta.height - WATERMARK_H) }])
    .png()
    .toBuffer());

  // 2a. trim the BODY (below the banner) to get the real content width/height
  const bodyBuf = await whited.clone().extract({ left: 0, top: BANNER_HEIGHT, width: meta.width, height: meta.height - BANNER_HEIGHT }).png().toBuffer();
  const trimmedBody = sharp(bodyBuf).trim({ background: '#ffffff', threshold: 10 });
  const trimmedBodyBuf = await trimmedBody.png().toBuffer();
  const bodyMeta = await sharp(trimmedBodyBuf).metadata();
  const contentWidth = Math.min(meta.width, bodyMeta.width + 20); // a little breathing room

  // 2b. crop the banner strip to the same content width
  const bannerBuf = await whited.clone().extract({ left: 0, top: 0, width: contentWidth, height: BANNER_HEIGHT }).png().toBuffer();

  // 2c. re-crop the body at the final content width (trim's left offset may differ from 0)
  const bodyFinalBuf = await sharp(bodyBuf).extract({ left: 0, top: 0, width: contentWidth, height: bodyMeta.height }).png().toBuffer();

  // 3. stack banner + body, then pad
  const combined = sharp({
    create: { width: contentWidth, height: BANNER_HEIGHT + bodyMeta.height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  }).composite([
    { input: bannerBuf, left: 0, top: 0 },
    { input: bodyFinalBuf, left: 0, top: BANNER_HEIGHT },
  ]);

  await combined
    .extend({ top: 0, bottom: 14, left: 10, right: 14, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(OUT_DIR, f));

  done++;
  process.stdout.write(`\r✓ ${done}/${files.length} cropped`);
}
console.log('');
