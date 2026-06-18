/**
 * Final CDN smoke test: upload a real file to R2, hit it via
 * the public CDN URL, confirm Cloudflare is serving it.
 */
import { putObject, buildPublicUrl, deleteObject, objectExists } from '../src/config/r2.js';

async function main(): Promise<void> {
  const key = `cdn-final-test-${Date.now()}.txt`;
  const body = `CDN end-to-end test at ${new Date().toISOString()}\n`;

  console.log(`[test] uploading to R2 with key: ${key}`);
  const put = await putObject(key, Buffer.from(body), 'text/plain');
  console.log(`  → public URL: ${put.url}`);

  // Wait 500ms for CDN cache to populate on first hit
  await new Promise((r) => setTimeout(r, 500));

  console.log('\n[test] fetching via public CDN URL');
  const res = await fetch(put.url);
  console.log(`  HTTP ${res.status}`);
  console.log(`  Content-Type: ${res.headers.get('content-type')}`);
  console.log(`  cf-cache-status: ${res.headers.get('cf-cache-status')}`);
  console.log(`  cf-ray: ${res.headers.get('cf-ray')}`);

  const text = await res.text();
  console.log(`  body: ${JSON.stringify(text)}`);

  if (res.status !== 200) {
    console.error('  ✗ FAIL: HTTP not 200');
    process.exit(1);
  }
  if (text !== body) {
    console.error('  ✗ FAIL: body mismatch');
    process.exit(1);
  }
  console.log('  ✓ CDN serves the file correctly');

  // Cleanup
  await deleteObject(key);
  const stillThere = await objectExists(key);
  if (stillThere) {
    console.error('  ✗ FAIL: file still exists after delete');
    process.exit(1);
  }
  console.log('  ✓ cleanup successful');
  console.log('\n✅ CDN end-to-end OK');
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
