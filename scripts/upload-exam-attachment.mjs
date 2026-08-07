/**
 * upload-exam-attachment.mjs — upload a single file (e.g. a PE "given
 * materials" zip) to R2 under files/exam-attachments/<key>, print the
 * public URL.
 *
 *   node --env-file=.env scripts/upload-exam-attachment.mjs \
 *     --file /path/to/PRO192-PE11-Given.zip --key PRO192/PE11-Given.zip
 *
 * Requires R2_BUCKET_NAME, R2_ENDPOINT_URL, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL in the environment (.env).
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
const KEY = val('--key');
if (!FILE || !KEY) {
  console.error('cần --file <đường dẫn file> --key <files/exam-attachments/... key>');
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

const key = `files/exam-attachments/${KEY}`;
const body = fs.readFileSync(FILE);
await s3.send(new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: key,
  Body: body,
  ContentType: 'application/zip',
  CacheControl: 'public, max-age=31536000, immutable',
}));

const url = `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
console.log(url);
