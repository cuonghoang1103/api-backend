/**
 * academy-cover-upload.mjs — đẩy ảnh bìa môn Academy lên R2.
 *
 * Tách khỏi course-cover-upload.mjs vì hai bộ ảnh khác nhau ở ba chỗ: định dạng
 * (webp thay vì png), khoá (images/academy-covers/… thay vì images/course-covers/…)
 * và số lượng (hàng trăm môn thay vì 19 khoá).
 *
 * ⚠️ Đặt CacheControl immutable một năm như bộ cũ, nên THAY ảnh của một mã đã
 * đăng thì phải đổi prefix phiên bản (v1 → v2), đừng ghi đè — Cloudflare giữ
 * bản cũ, kể cả khi R2 đã có bản mới (feedback_bay_cdn_va_cache).
 *
 *   node --env-file=.env scripts/academy-cover-upload.mjs --dir <thư mục> [--prefix v1] [--dry]
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const DIR = val('--dir', null);
const PREFIX = val('--prefix', 'v1');
const DRY = args.includes('--dry');
if (!DIR) { console.error('thiếu --dir'); process.exit(1); }

for (const k of ['R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']) {
  if (!process.env[k]) { console.error(`thiếu biến ${k}`); process.exit(1); }
}
const s3 = new S3Client({
  region: 'auto', endpoint: process.env.R2_ENDPOINT_URL,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

const files = readdirSync(DIR).filter((f) => f.endsWith('.webp') && !f.startsWith('._')).sort();
let ok = 0, bo = 0, loi = 0;
for (const f of files) {
  const key = `images/academy-covers/${PREFIX}/${f}`;
  const body = readFileSync(path.join(DIR, f));
  if (DRY) { console.log(`DRY ${f.padEnd(14)} ${(body.length / 1024).toFixed(1)} KB → ${key}`); ok++; continue; }
  try {
    // đã có đúng kích thước thì bỏ qua, để chạy lại không tốn băng thông
    try {
      const h = await s3.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
      if (h.ContentLength === body.length) { bo++; continue; }
    } catch { /* chưa có, đẩy tiếp */ }
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: body,
      ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable',
    }));
    ok++;
    if (ok % 25 === 0) process.stdout.write(`  …${ok}\n`);
  } catch (e) { console.error(`✗ ${f}: ${e.name} — ${e.message}`); loi++; }
}
console.log(`✓ đẩy ${ok} · bỏ qua ${bo} (đã có) · lỗi ${loi}`);
