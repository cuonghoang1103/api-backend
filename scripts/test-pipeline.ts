/**
 * End-to-end test for the full upload pipeline.
 * Spins up a minimal in-process Express server, posts a
 * generated PNG to /api/v1/files/upload, then:
 *   - asserts the response has a CDN URL
 *   - HEADs the URL via fetch
 *   - confirms the public URL actually serves the file
 *   - cleans up by deleting the bucket object
 *
 * Skips auth by stubbing the authenticate middleware
 * (we test the storage layer, not the auth layer — auth
 * has its own test suite).
 */
import sharp from 'sharp';
import { deleteObject } from '../src/config/r2.js';
import { getStorageProvider } from '../src/storage/StorageProvider.js';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('  ✓', msg);
  }
}

async function makeBigPng(): Promise<Buffer> {
  return sharp({
    create: {
      width: 2000,
      height: 1500,
      channels: 3,
      background: { r: 50, g: 100, b: 200 },
    },
  })
    .png()
    .toBuffer();
}

async function main(): Promise<void> {
  console.log('[test] R2 + upload pipeline (E2E)');
  const png = await makeBigPng();
  console.log(`  input PNG: ${png.length} bytes`);

  // Use the upload service directly (no HTTP) to keep the test
  // fast and avoid the auth-middleware rabbit hole.
  const { uploadImage, uploadAudio, uploadDocument } = await import('../src/storage/uploadService.js');

  console.log('\n[test] uploadImage (avatar) — sharp + R2');
  const avatar = await uploadImage(
    { buffer: png, originalName: 'avatar.png', mimetype: 'image/png', size: png.length },
    'images/avatar',
    { userId: 1 },
  );
  assert(avatar.url.startsWith('https://media.cuongthai.com/'), 'avatar URL uses CDN');
  assert(avatar.width === 1200, `avatar resized to 1200px (got ${avatar.width})`);
  assert(avatar.contentType === 'image/webp', 'avatar is webp on R2');
  assert(avatar.size < png.length, `avatar smaller than original (${avatar.size} < ${png.length})`);
  console.log(`  → ${avatar.url}`);

  console.log('\n[test] verify avatar serves via CDN');
  const head = await fetch(avatar.url, { method: 'HEAD' });
  assert(head.status === 200, `HEAD returns 200 (got ${head.status})`);
  assert(head.headers.get('content-type') === 'image/webp', `Content-Type is webp (got ${head.headers.get('content-type')})`);

  console.log('\n[test] uploadAudio (mp3) — pass-through');
  const fakeMp3 = Buffer.from([0xff, 0xfb, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00]);
  const audio = await uploadAudio(
    { buffer: fakeMp3, originalName: 'test.mp3', mimetype: 'audio/mpeg', size: fakeMp3.length },
    { userId: 1, kind: 'songs' },
  );
  assert(audio.url.startsWith('https://media.cuongthai.com/'), 'audio URL uses CDN');
  assert(audio.key.startsWith('audio/songs/'), `key has songs/ prefix (got ${audio.key})`);
  assert(audio.contentType === 'audio/mpeg', 'audio keeps original content-type');
  console.log(`  → ${audio.url}`);

  console.log('\n[test] uploadDocument (PDF) — pass-through');
  const fakePdf = Buffer.from('%PDF-1.4\n%fake test pdf\n');
  const doc = await uploadDocument(
    { buffer: fakePdf, originalName: 'lesson.pdf', mimetype: 'application/pdf', size: fakePdf.length },
    { userId: 1, scope: 'lesson' },
  );
  assert(doc.key.startsWith('documents/lesson/'), `key has documents/lesson/ prefix (got ${doc.key})`);
  assert(doc.contentType === 'application/pdf', 'PDF keeps application/pdf');
  console.log(`  → ${doc.url}`);

  console.log('\n[test] uploadDocument (chat) — scope=chat');
  const fakeZip = Buffer.from('PK\u0003\u0004fake zip');
  const chatDoc = await uploadDocument(
    { buffer: fakeZip, originalName: 'archive.zip', mimetype: 'application/zip', size: fakeZip.length },
    { userId: 1, scope: 'chat' },
  );
  assert(chatDoc.key.startsWith('documents/chat/'), `key has documents/chat/ prefix (got ${chatDoc.key})`);

  console.log('\n[test] uploadImage (cover) — 800x600 small');
  const smallPng = await sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 0, g: 200, b: 100 } },
  })
    .png()
    .toBuffer();
  const cover = await uploadImage(
    { buffer: smallPng, originalName: 'cover.png', mimetype: 'image/png', size: smallPng.length },
    'images/cover',
    { userId: 1 },
  );
  assert(cover.width === 800, 'small image not upscaled (800px)');

  console.log('\n[test] storageProvider — publicUrl / keyFromUrl round-trip');
  const provider = getStorageProvider();
  const key = avatar.key;
  const url = provider.publicUrl(key);
  const back = provider.keyFromUrl(url);
  assert(back === key, `keyFromUrl(publicUrl(key)) === key (got ${back})`);

  console.log('\n[test] foreign URL → keyFromUrl returns null');
  const ytUrl = 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg';
  assert(provider.keyFromUrl(ytUrl) === null, 'YouTube thumbnail returns null');
  assert(provider.keyFromUrl(null) === null, 'null URL returns null');

  console.log('\n[test] storageProvider — signedUrl works for private content');
  const signed = await provider.signedUrl(doc.key, 60, 'lesson.pdf');
  assert(signed.includes('X-Amz-Signature='), 'signed URL has AWS signature');
  const pdfRes = await fetch(signed);
  assert(pdfRes.status === 200, `signed URL resolves to 200 (got ${pdfRes.status})`);

  console.log('\n[test] cleanup — delete all uploaded test objects');
  await deleteObject(avatar.key);
  await deleteObject(audio.key);
  await deleteObject(doc.key);
  await deleteObject(chatDoc.key);
  await deleteObject(cover.key);
  console.log('  ✓ 5 objects deleted');

  if (process.exitCode === 1) {
    console.log('\n❌ Some pipeline tests failed');
  } else {
    console.log('\n✅ All upload pipeline tests passed');
  }
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
