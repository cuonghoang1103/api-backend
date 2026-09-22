/**
 * upload-academy-file.mjs — upload ONE downloadable file of an Academy lesson
 * (a sample .pptx, a .pdf handout, a .zip of starter code…) to R2 and print
 * its public URL:
 *   <file>  →  files/academy/<key>
 *
 *   node --env-file=.env scripts/upload-academy-file.mjs \
 *     --file ./SWT301-Lab2.5-Sample-Slides.pptx --key SWT301/v1/SWT301-Lab2.5-Sample-Slides.pptx
 *
 * Put a version (v1, v2…) in the key: Cloudflare keeps serving the OLD bytes
 * of an overwritten key, so a new edition of the file needs a NEW key
 * (feedback_bay_cdn_va_cache). Same idea as upload-academy-slides.mjs.
 * Idempotent: an object that already exists with the same size is skipped.
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
const KEY = val('--key');
if (!FILE || !KEY) {
  console.error('cần --file <đường dẫn file> --key <MÃ/vN/tên-file>');
  process.exit(1);
}
const required = ['R2_BUCKET_NAME', 'R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) { console.error(`✗ thiếu env: ${missing.join(', ')}`); process.exit(1); }

const TYPES = {
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};
const type = TYPES[path.extname(FILE).toLowerCase()];
if (!type) { console.error(`✗ chưa hỗ trợ đuôi ${path.extname(FILE)} — thêm vào TYPES`); process.exit(1); }

const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const key = `files/academy/${KEY}`;
const body = fs.readFileSync(FILE);
let exists = false;
try {
  const h = await s3.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
  exists = h.ContentLength === body.length;
} catch { /* not found → upload */ }
if (!exists) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: body, ContentType: type,
    ContentDisposition: `inline; filename="${path.basename(KEY)}"`,
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}
console.log(`${exists ? '= unchanged' : '✓ uploaded'} ${(body.length / 1024).toFixed(0)} KB`);
console.log(`${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`);
