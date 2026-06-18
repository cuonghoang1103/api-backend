/**
 * Smoke test for the migration script.
 * Spins up a fake upload dir, writes a few files, runs the
 * migration, and asserts the R2 bucket now has those keys.
 * Cleans up afterwards.
 */
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import sharp from 'sharp';
import { objectExists, deleteObject } from '../src/config/r2.js';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('  ✓', msg);
  }
}

async function main(): Promise<void> {
  // 1. Make a fake upload dir
  const fakeDir = path.join(os.tmpdir(), `upload-test-${Date.now()}`);
  await fs.mkdir(fakeDir, { recursive: true });
  console.log(`[test] fake upload dir: ${fakeDir}`);

  // 2. Make 3 fake files: image, audio, doc
  await fs.mkdir(path.join(fakeDir, 'images', 'avatar'), { recursive: true });
  const img = await sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 255, g: 0, b: 0 } } })
    .png()
    .toBuffer();
  await fs.writeFile(path.join(fakeDir, 'images', 'avatar', 'test-1.png'), img);
  await fs.mkdir(path.join(fakeDir, 'audio', 'songs'), { recursive: true });
  await fs.writeFile(path.join(fakeDir, 'audio', 'songs', 'test-song.mp3'), Buffer.from([0xff, 0xfb, 0x90]));
  await fs.mkdir(path.join(fakeDir, 'documents', 'lesson'), { recursive: true });
  await fs.writeFile(path.join(fakeDir, 'documents', 'lesson', 'test-doc.pdf'), '%PDF-1.4\nfake');
  console.log('  ✓ 3 fake files written');

  // 3. Run dry-run via tsx with UPLOAD_DIR override
  console.log('\n[test] dry-run — count files that would be uploaded');
  const env: NodeJS.ProcessEnv = { ...process.env, UPLOAD_DIR: fakeDir };
  const dryResult = spawnSync('npx', ['tsx', 'scripts/migrate-to-r2.ts', '--dry-run'], {
    env,
    encoding: 'utf-8',
    cwd: process.cwd(),
  });
  console.log(dryResult.stdout);
  if (dryResult.status !== 0) {
    console.error(dryResult.stderr);
    assert(false, 'dry-run exited non-zero');
    return;
  }
  assert(/found 3 file/.test(dryResult.stdout), 'dry-run found 3 files');

  // 4. Run real migration
  console.log('\n[test] real migration — upload 3 files to R2');
  const realResult = spawnSync('npx', ['tsx', 'scripts/migrate-to-r2.ts', '--concurrency=2'], {
    env,
    encoding: 'utf-8',
    cwd: process.cwd(),
  });
  console.log(realResult.stdout);
  if (realResult.status !== 0) {
    console.error(realResult.stderr);
    assert(false, 'migration exited non-zero');
    return;
  }
  assert(/ok=3/.test(realResult.stdout), 'migration uploaded 3 files (ok=3)');
  assert(/skip=0/.test(realResult.stdout), 'no skipped (skip=0)');
  assert(/fail=0/.test(realResult.stdout), 'no failures (fail=0)');

  // 5. Verify on R2
  console.log('\n[test] verify — files exist on R2');
  const keys = [
    'images/avatar/test-1.png',
    'audio/songs/test-song.mp3',
    'documents/lesson/test-doc.pdf',
  ];
  for (const k of keys) {
    const ex = await objectExists(k);
    assert(ex, `${k} exists on R2`);
  }

  // 6. Idempotency — run again, should all skip
  console.log('\n[test] idempotency — re-run, should skip all');
  const reResult = spawnSync('npx', ['tsx', 'scripts/migrate-to-r2.ts', '--concurrency=2'], {
    env,
    encoding: 'utf-8',
    cwd: process.cwd(),
  });
  console.log(reResult.stdout);
  assert(/skip=3/.test(reResult.stdout), 'second run skipped all 3 (skip=3)');

  // 7. Cleanup
  console.log('\n[test] cleanup — delete test objects from R2 + fake dir');
  for (const k of keys) {
    await deleteObject(k);
  }
  await fs.rm(fakeDir, { recursive: true, force: true });
  console.log('  ✓ cleaned up');

  if (process.exitCode === 1) {
    console.log('\n❌ Some migration tests failed');
  } else {
    console.log('\n✅ All migration tests passed');
  }
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
