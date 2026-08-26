/**
 * course-cover-upload.mjs — đẩy ảnh bìa ĐÃ DỰNG SẴN lên R2.
 * ─────────────────────────────────────────────────────────────────────────────
 * VÌ SAO CÓ FILE NÀY. `course-cover.mjs` làm ba việc trong container: kéo logo
 * từ cdn.simpleicons.org → vẽ SVG bằng sharp (cần font DejaVu Sans) → đẩy R2.
 * Ba việc, ba chỗ có thể chết, và nó đã chết câm nhiều lần: script chạy đủ,
 * deploy xanh, smoke-test sạch, mà redis.png vẫn 404 trên R2. Ảnh bìa của
 * postgresql/typescript/nextjs làm được là vì HỒI ĐÓ container còn ra được
 * CDN kia; các khoá làm sau thì không.
 *
 * File này giữ lại đúng MỘT việc: đọc PNG trên đĩa rồi PUT lên R2. Không mạng
 * ngoài, không sharp, không font, không SVG. Ảnh đã dựng sẵn ở scripts/covers/
 * bằng `course-cover-offline.mjs` — cùng bố cục, cùng bộ với ảnh cũ.
 *
 * PHẢI chạy trong container backend (cần biến R2_*):
 *   docker exec cuonghoangdev_backend node scripts/course-cover-upload.mjs
 *   docker exec cuonghoangdev_backend node scripts/course-cover-upload.mjs --slug redis
 *   docker exec cuonghoangdev_backend node scripts/course-cover-upload.mjs --dry
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const has = (f) => args.includes(f);
const ONLY = val('--slug', null);
const DRY = has('--dry');
const DIR = val('--dir', fileURLToPath(new URL('./covers', import.meta.url)));

if (!existsSync(DIR)) {
  console.error(`✗ không thấy thư mục ảnh: ${DIR}`);
  console.error('  Ảnh nằm ở scripts/covers/ — thư mục scripts/ CÓ được tầng runner của');
  console.error('  Dockerfile.backend chép vào ảnh chạy (assets/ thì KHÔNG).');
  process.exit(1);
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.png'))
  .filter((f) => !ONLY || f === `${ONLY}.png`);
if (!files.length) { console.error(`✗ không có PNG nào trong ${DIR}`); process.exit(1); }

// Thiếu biến thì nói ngay tên biến thiếu, đừng để AWS SDK ném lỗi khó đọc.
const CAN = ['R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
const thieu = CAN.filter((k) => !process.env[k]);
if (thieu.length && !DRY) {
  console.error(`✗ thiếu biến môi trường: ${thieu.join(', ')}`);
  console.error('  Script này phải chạy TRONG container backend, không phải trên máy trần.');
  process.exit(1);
}

const s3 = DRY ? null : new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

let ok = 0, loi = 0;
for (const f of files.sort()) {
  const slug = f.replace(/\.png$/, '');
  const key = `images/course-covers/${f}`;
  const body = readFileSync(path.join(DIR, f));
  if (DRY) { console.log(`DRY ${slug.padEnd(26)} ${(body.length / 1024).toFixed(1)} KB → ${key}`); ok++; continue; }
  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    console.log(`✓ ${slug.padEnd(26)} ${(body.length / 1024).toFixed(1).padStart(6)} KB → ${key}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${slug}: ${e.name} — ${e.message}`);
    loi++;
  }
}

const base = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
console.log(`\n${ok} ảnh đã đẩy · ${loi} lỗi`);
if (ok && base) console.log(`Kiểm: ${base}/images/course-covers/redis.png`);
process.exit(loi > 0 ? 1 : 0);
