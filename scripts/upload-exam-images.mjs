/**
 * upload-exam-images.mjs — upload a folder of question-image PNGs to R2
 * under images/exam-questions/<prefix>/q<N>.png, print a JSON map
 * { "<N>": "<publicUrl>" } to stdout AND write it to --out.
 *
 *   node scripts/upload-exam-images.mjs \
 *     --dir /path/to/pngs --prefix PRO192/FE1 \
 *     --out /path/to/image-urls.json
 *
 * Requires R2_BUCKET_NAME, R2_ENDPOINT_URL, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL in the environment (.env).
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DIR = val('--dir');
const PREFIX = val('--prefix');
const OUT = val('--out');
if (!DIR || !PREFIX || !OUT) {
  console.error('cần --dir <thư mục ảnh> --prefix <images/exam-questions/... prefix> --out <file json>');
  process.exit(1);
}

const required = ['R2_BUCKET_NAME', 'R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`✗ thiếu env: ${missing.join(', ')} — thêm vào .env rồi thử lại`);
  process.exit(1);
}

const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png'));
const numOf = (f) => parseInt(f.match(/q(\d+)\.png$/)?.[1] || '0', 10);
files.sort((a, b) => numOf(a) - numOf(b));

if (!files.length) { console.error(`✗ không có .png nào trong ${DIR}`); process.exit(1); }

const map = {};
let done = 0;
for (const f of files) {
  const n = numOf(f);
  if (!n) { console.warn(`⚠ bỏ qua tên không khớp qN.png: ${f}`); continue; }
  const key = `images/exam-questions/${PREFIX}/q${n}.png`;
  const body = fs.readFileSync(path.join(DIR, f));
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  const publicUrl = `${(process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${key}`;
  map[String(n)] = publicUrl;
  done++;
  process.stdout.write(`\r✓ ${done}/${files.length} uploaded`);
}
console.log('');

fs.writeFileSync(OUT, JSON.stringify(map, null, 2));
console.log(`✓ wrote ${Object.keys(map).length} URLs to ${OUT}`);
