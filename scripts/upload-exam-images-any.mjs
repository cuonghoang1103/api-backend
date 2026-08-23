/**
 * upload-exam-images-any.mjs — upload a folder of question images (jpg/jpeg/png/
 * webp) to R2 under images/exam-questions/<prefix>/q<N>.<ext>, and write a JSON
 * map { "<N>": "<publicUrl>" } to --out. Generalization of upload-exam-images.mjs
 * that (a) accepts any raster ext and (b) parses the leading question number from
 * FUOverflow-style names "01 [263756].jpg" (falls back to q<N>.<ext>).
 *
 *   node scripts/upload-exam-images-any.mjs \
 *     --dir "/path/to/Đề 1 …" --prefix FER202/FE1 \
 *     --out scratch/fer202-fe1-image-urls.json
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
  console.error('cần --dir <thư mục ảnh> --prefix <FER202/FE1> --out <file json>');
  process.exit(1);
}

const required = ['R2_BUCKET_NAME', 'R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) { console.error(`✗ thiếu env: ${missing.join(', ')}`); process.exit(1); }

const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

const CT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const RASTER = new Set(Object.keys(CT));

const numOf = (f) => {
  const m = f.match(/^\s*(\d{1,3})\b/) || f.match(/q(\d+)\./i);
  return m ? parseInt(m[1], 10) : 0;
};

const files = fs.readdirSync(DIR)
  .filter((f) => RASTER.has(path.extname(f).toLowerCase()))
  .sort((a, b) => numOf(a) - numOf(b));
if (!files.length) { console.error(`✗ không có ảnh raster trong ${DIR}`); process.exit(1); }

const map = {};
let done = 0;
for (const f of files) {
  const n = numOf(f);
  if (!n) { console.warn(`⚠ bỏ qua tên không có số câu: ${f}`); continue; }
  const ext = path.extname(f).toLowerCase();
  const key = `images/exam-questions/${PREFIX}/q${n}${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fs.readFileSync(path.join(DIR, f)),
    ContentType: CT[ext],
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  map[String(n)] = `${(process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${key}`;
  done++;
  process.stdout.write(`\r✓ ${done}/${files.length} uploaded`);
}
console.log('');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(map, null, 2));
console.log(`✓ wrote ${Object.keys(map).length} URLs to ${OUT}`);
