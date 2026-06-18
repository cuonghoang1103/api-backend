/**
 * Error-handling tests.
 * We exercise the unhappy paths of the upload pipeline to make
 * sure errors are surfaced as typed exceptions (not crashes),
 * and that the route layer can map them to proper HTTP status
 * codes.
 */
import sharp from 'sharp';
import { uploadImage, uploadAudio, uploadDocument, UploadError } from '../src/storage/uploadService.js';
import { deleteByUrl, deleteByUrls } from '../src/storage/uploadService.js';
import { getStorageProvider } from '../src/storage/StorageProvider.js';

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('  ✓', msg);
  }
}

async function main(): Promise<void> {
  console.log('[test] uploadImage — empty file');
  try {
    await uploadImage(
      { buffer: Buffer.alloc(0), originalName: 'empty.png', mimetype: 'image/png', size: 0 },
      'images/avatar',
    );
    assert(false, 'expected throw');
  } catch (e) {
    const err = e as UploadError;
    assert(err instanceof UploadError, 'throws UploadError');
    assert(err.code === 'EMPTY_FILE', `code = ${err.code}`);
    assert(err.status === 400, `status = ${err.status}`);
  }

  console.log('\n[test] uploadImage — too large');
  try {
    // 11MB exceeds the default 10MB cap
    const big = Buffer.alloc(11 * 1024 * 1024);
    await uploadImage(
      { buffer: big, originalName: 'big.png', mimetype: 'image/png', size: big.length },
      'images/avatar',
    );
    assert(false, 'expected throw');
  } catch (e) {
    const err = e as UploadError;
    assert(err.code === 'FILE_TOO_LARGE', `code = ${err.code}`);
    assert(err.status === 413, `status = ${err.status}`);
  }

  console.log('\n[test] uploadImage — non-image MIME');
  try {
    await uploadImage(
      { buffer: Buffer.from('hello'), originalName: 'fake.png', mimetype: 'text/plain', size: 5 },
      'images/avatar',
    );
    assert(false, 'expected throw');
  } catch (e) {
    const err = e as UploadError;
    assert(err instanceof UploadError, 'throws UploadError');
    assert(err.status === 400, `status = ${err.status}`);
  }

  console.log('\n[test] uploadAudio — wrong MIME');
  try {
    await uploadAudio(
      { buffer: Buffer.from('x'), originalName: 'fake.mp3', mimetype: 'image/png', size: 1 },
    );
    assert(false, 'expected throw');
  } catch (e) {
    const err = e as UploadError;
    assert(err.code === 'WRONG_MIME', `code = ${err.code}`);
    assert(err.status === 400, `status = ${err.status}`);
  }

  console.log('\n[test] uploadDocument — empty file');
  try {
    await uploadDocument(
      { buffer: Buffer.alloc(0), originalName: 'empty.pdf', mimetype: 'application/pdf', size: 0 },
    );
    assert(false, 'expected throw');
  } catch (e) {
    const err = e as UploadError;
    assert(err.code === 'EMPTY_FILE', `code = ${err.code}`);
  }

  console.log('\n[test] uploadImage — corrupted image bytes');
  try {
    await uploadImage(
      { buffer: Buffer.from('garbage not an image'), originalName: 'corrupt.png', mimetype: 'image/png', size: 22 },
      'images/avatar',
    );
    assert(false, 'expected throw');
  } catch (e) {
    const err = e as UploadError;
    assert(err instanceof UploadError, 'throws UploadError');
    assert([400, 500].includes(err.status), `status in {400,500} (got ${err.status})`);
  }

  console.log('\n[test] deleteByUrl — foreign URLs are no-ops');
  await deleteByUrl('https://i.ytimg.com/vi/abc/maxres.jpg');
  await deleteByUrl('https://avatars.githubusercontent.com/u/123');
  await deleteByUrl(null);
  await deleteByUrl(undefined);
  await deleteByUrl('');
  assert(true, 'no throws on foreign URLs');

  console.log('\n[test] deleteByUrl — non-existent R2 key');
  const provider = getStorageProvider();
  const fakeUrl = provider.publicUrl('this-key-does-not-exist.png');
  await deleteByUrl(fakeUrl); // should not throw
  assert(true, 'no throw on non-existent R2 object');

  console.log('\n[test] deleteByUrls — empty + mixed');
  await deleteByUrls([]);
  await deleteByUrls([null, undefined, '']);
  await deleteByUrls(['https://youtube.com/abc']);
  assert(true, 'no throws on empty/foreign batches');

  console.log('\n[test] successful upload → cleanup works');
  const png = await sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 0, g: 0, b: 255 } } })
    .png()
    .toBuffer();
  const result = await uploadImage(
    { buffer: png, originalName: 'test.png', mimetype: 'image/png', size: png.length },
    'images/post',
  );
  // Delete by URL
  await deleteByUrl(result.url);
  assert(true, `uploaded + deleted: ${result.key}`);

  if (process.exitCode === 1) {
    console.log('\n❌ Some error-handling tests failed');
  } else {
    console.log('\n✅ All error-handling tests passed');
  }
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
