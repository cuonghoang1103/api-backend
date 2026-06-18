/**
 * End-to-end R2 client test.
 * Exercises the full happy path:
 *   1. pingR2()                — can we reach the bucket?
 *   2. putObject()             — upload a 1KB test buffer
 *   3. objectExists()          — verify it's there
 *   4. getSignedDownloadUrl()  — get a 60s signed URL
 *   5. HEAD via fetch          — verify the signed URL resolves
 *   6. buildPublicUrl()        — CDN URL is well-formed
 *   7. deleteObject()          — clean up
 *
 * The test uses a unique key (`test-${Date.now()}-...`) so
 * concurrent runs don't collide. Run with:
 *   env $(cat .env.test | xargs) npx tsx scripts/test-r2.ts
 */
import {
  pingR2,
  putObject,
  objectExists,
  getSignedDownloadUrl,
  buildPublicUrl,
  deleteObject,
} from '../src/config/r2.js';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('  ✓', msg);
  }
}

async function main(): Promise<void> {
  const key = `test/smoke-test-${Date.now()}.txt`;
  const body = Buffer.from(`Hello from R2 smoke test at ${new Date().toISOString()}\n`);

  console.log(`[test] using key: ${key}`);

  // 1. Ping
  console.log('\n[test] pingR2 — can we reach the bucket?');
  const reachable = await pingR2();
  assert(reachable, 'R2 bucket is reachable');
  if (!reachable) {
    console.log('  (skipping remaining tests — R2 unreachable from this network)');
    return;
  }

  // 2. Put
  console.log('\n[test] putObject — upload buffer');
  const put = await putObject(key, body, 'text/plain');
  assert(put.key === key, 'returned key matches');
  assert(put.url.startsWith('https://media.cuongthai.com/'), 'URL uses CDN domain');
  assert(put.url.endsWith(key), 'URL ends with the key');
  assert(typeof put.etag === 'string' && put.etag.length > 0, 'etag returned');
  console.log(`  → ${put.url}`);

  // 3. Exists
  console.log('\n[test] objectExists — verify upload');
  const exists = await objectExists(key);
  assert(exists, 'object exists after upload');

  // 4. Signed URL
  console.log('\n[test] getSignedDownloadUrl — short-lived signed URL');
  const signed = await getSignedDownloadUrl(key, 60, 'smoke-test.txt');
  assert(signed.startsWith('https://') && signed.includes('X-Amz-Signature='), 'signed URL has AWS sig v4');
  assert(signed.includes('X-Amz-Expires=60'), 'expires = 60s');
  console.log(`  → ${signed.slice(0, 100)}...`);

  // 5. Fetch the signed URL
  console.log('\n[test] fetch — does the signed URL resolve?');
  try {
    const res = await fetch(signed, { method: 'GET' });
    assert(res.status === 200, `HTTP 200 (got ${res.status})`);
    const text = await res.text();
    assert(text === body.toString(), 'body matches what we uploaded');
  } catch (e) {
    assert(false, `fetch failed: ${(e as Error).message}`);
  }

  // 6. buildPublicUrl
  console.log('\n[test] buildPublicUrl — CDN URL helper');
  const pub = buildPublicUrl(key);
  assert(pub === put.url, 'buildPublicUrl returns the same URL we got from putObject');

  // 7. Cleanup
  console.log('\n[test] deleteObject — clean up');
  await deleteObject(key);
  const stillThere = await objectExists(key);
  assert(!stillThere, 'object is gone after delete');

  if (process.exitCode === 1) {
    console.log('\n❌ Some R2 tests failed');
  } else {
    console.log('\n✅ All R2 client tests passed');
  }
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
