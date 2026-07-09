#!/usr/bin/env node
/**
 * Off-site DB backup uploader → Cloudflare R2 (P0-6).
 *
 * Uploads a local gzip'd pg_dump to a PRIVATE R2 bucket so a VPS/disk
 * failure doesn't take the database AND its only backup at once.
 *
 * SAFETY: this MUST target a bucket that is NOT the public media bucket
 * (`R2_BUCKET_NAME`, served at media.cuongthai.com/<key>). Putting DB
 * dumps in the public bucket would expose the whole database. This
 * script REFUSES to run if the backup bucket equals the media bucket.
 *
 * Activation: set `R2_BACKUP_BUCKET` (a new PRIVATE bucket) in the VPS
 * env. If it's unset the script no-ops (exit 0) — so shipping it changes
 * nothing until you provision the bucket. Credentials reuse the existing
 * R2_* vars unless R2_BACKUP_* overrides are provided.
 *
 * Run (inside the backend container, which has @aws-sdk + R2 env):
 *   node backup-r2-upload.mjs <local-file> <object-key>
 */
import { readFile } from 'node:fs/promises';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const [, , localPath, objectKey] = process.argv;

const bucket = process.env.R2_BACKUP_BUCKET;
if (!bucket) {
  console.log('[backup-r2] R2_BACKUP_BUCKET not set — skipping off-site upload (no-op).');
  process.exit(0);
}
if (!localPath || !objectKey) {
  console.error('[backup-r2] usage: node backup-r2-upload.mjs <local-file> <object-key>');
  process.exit(2);
}

const mediaBucket = process.env.R2_BUCKET_NAME;
if (mediaBucket && bucket === mediaBucket) {
  console.error(
    `[backup-r2] REFUSING: R2_BACKUP_BUCKET (${bucket}) is the public media bucket. ` +
      'Use a SEPARATE PRIVATE bucket for DB backups.',
  );
  process.exit(1);
}

const endpoint = process.env.R2_BACKUP_ENDPOINT_URL || process.env.R2_ENDPOINT_URL;
const accessKeyId = process.env.R2_BACKUP_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_BACKUP_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.error('[backup-r2] missing R2 credentials/endpoint in env.');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

const body = await readFile(localPath);
await s3.send(
  new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    Body: body,
    ContentType: 'application/gzip',
  }),
);
console.log(`[backup-r2] uploaded ${localPath} → r2://${bucket}/${objectKey} (${body.length} bytes)`);
