/**
 * upload-academy-slides.mjs — upload the rendered slide images of one Academy
 * course to R2, one folder per deck:
 *   <dir>/<deck>/<NNN>.webp  →  images/academy/<prefix>/<deck>/<NNN>.webp
 *
 *   node --env-file=.env scripts/upload-academy-slides.mjs \
 *     --dir /path/to/webp --prefix SWT301/v1 [--decks swt1,swt2] \
 *     [--skip addl:3,4,6-17] [--out map.json]
 *
 * The prefix carries a version (v1, v2…) on purpose: Cloudflare keeps serving
 * the OLD bytes for an overwritten key, so a re-render must go to a new prefix
 * instead of overwriting (feedback_bay_cdn_va_cache). Idempotent within a
 * prefix: objects that already exist with the same size are skipped.
 *
 * --skip excludes slides that must not be published (e.g. a third party's
 * personal contact details) — those are never uploaded at all.
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DIR = val('--dir');
const PREFIX = val('--prefix');
const OUT = val('--out');
const DECKS = val('--decks')?.split(',').filter(Boolean);
if (!DIR || !PREFIX) {
  console.error('cần --dir <thư mục webp theo deck> --prefix <MÃ/vN>');
  process.exit(1);
}
const required = ['R2_BUCKET_NAME', 'R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) { console.error(`✗ thiếu env: ${missing.join(', ')}`); process.exit(1); }

// --skip deck:1,3,5-9 (repeatable)
const skip = {};
args.forEach((a, i) => {
  if (a !== '--skip') return;
  const [deck, list] = String(args[i + 1] || '').split(':');
  const set = (skip[deck] ||= new Set());
  for (const part of (list || '').split(',')) {
    const [a1, b1] = part.split('-').map(Number);
    for (let n = a1; n <= (b1 || a1); n++) set.add(n);
  }
});

const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const base = process.env.R2_PUBLIC_URL.replace(/\/$/, '');
const decks = (DECKS || fs.readdirSync(DIR).filter((d) => fs.statSync(path.join(DIR, d)).isDirectory())).sort();

const map = {};
let up = 0, same = 0, skipped = 0;
for (const deck of decks) {
  const files = fs.readdirSync(path.join(DIR, deck)).filter((f) => /^\d+\.webp$/.test(f)).sort();
  map[deck] = {};
  for (const f of files) {
    const n = parseInt(f, 10);
    if (skip[deck]?.has(n)) { skipped++; continue; }
    const key = `images/academy/${PREFIX}/${deck}/${f}`;
    const body = fs.readFileSync(path.join(DIR, deck, f));
    let exists = false;
    try {
      const h = await s3.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
      exists = h.ContentLength === body.length;
    } catch { /* not found → upload */ }
    if (exists) same++;
    else {
      await s3.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: body,
        ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable',
      }));
      up++;
    }
    map[deck][n] = `${base}/${key}`;
    process.stdout.write(`\r${deck} ${n}/${files.length} · uploaded ${up} · unchanged ${same} · skipped ${skipped}   `);
  }
}
console.log(`\n✓ uploaded ${up}, unchanged ${same}, skipped ${skipped}`);
if (OUT) { fs.writeFileSync(OUT, JSON.stringify(map, null, 2)); console.log(`✓ map → ${OUT}`); }
