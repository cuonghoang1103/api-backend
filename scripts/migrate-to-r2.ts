/**
 * One-shot migration: copy every file under `UPLOAD_DIR` to
 * Cloudflare R2, preserving the directory layout as the bucket
 * key. The script is idempotent — files that already exist on
 * R2 (verified by HEAD) are skipped so a re-run after a crash
 * is safe.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-r2.ts [--dry-run] [--concurrency=8]
 *
 * Verification:
 *   The script prints a summary at the end: total files,
 *   succeeded, failed, skipped. We recommend doing a sanity
 *   check by spot-loading a few `R2_PUBLIC_URL/<key>` URLs in
 *   a browser before flipping the app over.
 *
 * Safety:
 *   The script does NOT touch the local files. We keep them
 *   on disk for the rollback window (default 30 days) so a
 *   bad R2 upload can be recovered by re-pointing nginx.
 */
import fs from 'fs/promises';
import path from 'path';
import { config } from '../src/config/env.js';
import {
  putObject,
  pingR2,
  objectExists,
} from '../src/config/r2.js';
import { contentTypeFromKey } from '../src/storage/StorageProvider.js';

interface CliOptions {
  dryRun: boolean;
  concurrency: number;
  skipLarger: number; // skip files bigger than N bytes (0 = no limit)
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const out: CliOptions = { dryRun: false, concurrency: 8, skipLarger: 0 };
  for (const a of args) {
    if (a === '--dry-run') out.dryRun = true;
    else if (a.startsWith('--concurrency=')) {
      out.concurrency = Math.max(1, parseInt(a.split('=')[1], 10) || 8);
    } else if (a.startsWith('--skip-larger=')) {
      out.skipLarger = parseInt(a.split('=')[1], 10) || 0;
    } else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: npx tsx scripts/migrate-to-r2.ts [--dry-run] [--concurrency=8] [--skip-larger=0]',
      );
      process.exit(0);
    }
  }
  return out;
}

/** Walk the upload dir, yielding relative bucket keys. */
async function* walk(dir: string, base: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err: any) {
    if (err.code === 'ENOENT') return;
    throw err;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(abs, base);
    } else if (entry.isFile()) {
      yield path.relative(base, abs).split(path.sep).join('/');
    }
  }
}

async function migrateOne(
  key: string,
  uploadDir: string,
  opts: CliOptions,
): Promise<{ status: 'ok' | 'skip' | 'fail' | 'skip-size'; key: string; size: number; error?: string }> {
  const fullPath = path.join(uploadDir, key);
  let buf: Buffer;
  try {
    const stat = await fs.stat(fullPath);
    if (opts.skipLarger > 0 && stat.size > opts.skipLarger) {
      return { status: 'skip-size', key, size: stat.size };
    }
    buf = await fs.readFile(fullPath);
  } catch (err: any) {
    return { status: 'fail', key, size: 0, error: `read: ${err.message}` };
  }

  if (opts.dryRun) {
    return { status: 'ok', key, size: buf.length };
  }

  // Skip if already on R2 (idempotent re-runs after a crash).
  try {
    if (await objectExists(key)) {
      return { status: 'skip', key, size: buf.length };
    }
  } catch {
    // If HEAD fails for any reason, just try the upload — the
    // R2 SDK is idempotent at the storage layer.
  }

  try {
    const ct = contentTypeFromKey(key);
    await putObject(key, buf, ct);
    return { status: 'ok', key, size: buf.length };
  } catch (err: any) {
    return { status: 'fail', key, size: buf.length, error: err.message };
  }
}

async function main(): Promise<void> {
  const opts = parseArgs();
  const uploadDir = path.resolve(config.uploadDir);

  console.log(`[migrate] source dir: ${uploadDir}`);
  console.log(`[migrate] R2 bucket:  ${config.r2.bucketName}`);
  console.log(`[migrate] R2 public:  ${config.r2.publicUrl}`);
  console.log(`[migrate] dry-run:    ${opts.dryRun}`);
  console.log(`[migrate] concurrency: ${opts.concurrency}`);

  if (!config.r2.enabled) {
    console.error('R2 is not configured. Set R2_* env vars first.');
    process.exit(1);
  }
  if (!opts.dryRun) {
    const reachable = await pingR2();
    if (!reachable) {
      console.error('Cannot reach R2. Aborting.');
      process.exit(1);
    }
  }

  // First pass: count files so the progress bar is accurate.
  let total = 0;
  for await (const _ of walk(uploadDir, uploadDir)) total++;
  console.log(`[migrate] found ${total} file(s)`);
  if (total === 0) {
    console.log('[migrate] nothing to do');
    return;
  }

  let done = 0;
  let ok = 0, skip = 0, skipSize = 0, fail = 0;
  const failedKeys: string[] = [];
  const startMs = Date.now();

  // Bounded-concurrency runner. We use a simple worker pool
  // instead of pulling in p-limit to keep the dep surface small.
  const queue: string[] = [];
  for await (const key of walk(uploadDir, uploadDir)) queue.push(key);

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const key = queue.shift();
      if (key === undefined) return;
      const r = await migrateOne(key, uploadDir, opts);
      done++;
      if (r.status === 'ok') ok++;
      else if (r.status === 'skip') skip++;
      else if (r.status === 'skip-size') skipSize++;
      else {
        fail++;
        failedKeys.push(`${key} (${r.error ?? '?'})`);
      }
      if (done % 25 === 0 || done === total) {
        const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
        const rate = (done / Math.max(1, parseFloat(elapsed))).toFixed(1);
        process.stdout.write(
          `\r[migrate] ${done}/${total} ok=${ok} skip=${skip} skip-size=${skipSize} fail=${fail} (${rate} files/s)`,
        );
      }
    }
  }

  const workers = Array.from({ length: opts.concurrency }, () => worker());
  await Promise.all(workers);

  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`\n[migrate] done in ${elapsed}s`);
  console.log(`[migrate] total=${total} ok=${ok} skip=${skip} skip-size=${skipSize} fail=${fail}`);

  if (failedKeys.length > 0) {
    console.log(`[migrate] failures (${failedKeys.length}):`);
    for (const k of failedKeys.slice(0, 50)) console.log(`  - ${k}`);
    if (failedKeys.length > 50) console.log(`  ... and ${failedKeys.length - 50} more`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[migrate] fatal:', err);
  process.exit(1);
});
