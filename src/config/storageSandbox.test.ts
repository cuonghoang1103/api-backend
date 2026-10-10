/**
 * Đợt 6 — chứng minh: chạy test thì KHÔNG một kết nối nào tới R2 thật, kể cả khi .env mang khoá R2 thật.
 * Đặt cấu hình "trông như thật" TRƯỚC khi nạp config/env.ts, đếm mọi `net.Socket.connect`, rồi chạy đủ các lệnh R2
 * mà repo dùng (putObject, headObject, getObjectText, listObjects, deleteObject(s), URL ký, StorageProvider đọc Range,
 * và `getR2Client().send` trực tiếp như projectExport/commentFiles).
 */
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';

process.env.R2_BUCKET_NAME = 'cuongthai-media-storage';
process.env.R2_ENDPOINT_URL = 'https://e8105049f41b90209104afb5911d84b2.r2.cloudflarestorage.com';
process.env.R2_ACCESS_KEY_ID = 'AKIA_REAL_LOOKING';
process.env.R2_SECRET_ACCESS_KEY = 'real-looking-secret';
process.env.R2_PUBLIC_URL = 'https://media.cuongthai.com';
delete process.env.STORAGE_SANDBOX;
delete process.env.STORAGE_SANDBOX_DIR;
delete process.env.STORAGE_SANDBOX_ENDPOINT;

const sockets: string[] = [];
const origConnect = net.Socket.prototype.connect;

describe('storage sandbox (đợt 6)', () => {
  before(() => {
    net.Socket.prototype.connect = function spy(this: net.Socket, ...args: unknown[]) {
      const o = (Array.isArray(args[0]) ? args[0][0] : args[0]) as { host?: string } | number;
      sockets.push(typeof o === 'object' && o ? String(o.host) : String(args[1] ?? o));
      return (origConnect as (...a: unknown[]) => net.Socket).apply(this, args);
    } as typeof net.Socket.prototype.connect;
  });
  after(() => { net.Socket.prototype.connect = origConnect; });

  it('sandboxMode: test run ⇒ memory; STORAGE_SANDBOX=0 trong test ⇒ ném lỗi; production ⇒ không bao giờ', async () => {
    const { sandboxMode, StorageSandboxError } = await import('./storageSandbox.js');
    assert.equal(sandboxMode({ WORK_DB_TEST: '1' } as NodeJS.ProcessEnv), 'memory');
    assert.equal(sandboxMode({ NODE_ENV: 'test' } as NodeJS.ProcessEnv), 'memory');
    assert.equal(sandboxMode({ NODE_TEST_CONTEXT: 'child-v8' } as NodeJS.ProcessEnv), 'memory');
    assert.equal(sandboxMode({ NODE_ENV: 'development' } as NodeJS.ProcessEnv), null);
    assert.equal(sandboxMode({ NODE_ENV: 'development', STORAGE_SANDBOX: '1' } as NodeJS.ProcessEnv), 'dir');
    assert.equal(sandboxMode({ NODE_ENV: 'development', STORAGE_SANDBOX: 'memory' } as NodeJS.ProcessEnv), 'memory');
    assert.equal(sandboxMode({ STORAGE_SANDBOX: '1', STORAGE_SANDBOX_ENDPOINT: 'http://localhost:9000' } as NodeJS.ProcessEnv), 'endpoint');
    assert.throws(() => sandboxMode({ WORK_DB_TEST: '1', STORAGE_SANDBOX: '0' } as NodeJS.ProcessEnv), StorageSandboxError);
    assert.throws(() => sandboxMode({ NODE_ENV: 'production', STORAGE_SANDBOX: '1' } as NodeJS.ProcessEnv), /production/);
    assert.equal(sandboxMode({ NODE_ENV: 'production', WORK_DB_TEST: '1' } as NodeJS.ProcessEnv), null);
    assert.throws(() => sandboxMode({ STORAGE_SANDBOX: '1', STORAGE_SANDBOX_ENDPOINT: 'https://x.r2.cloudflarestorage.com' } as NodeJS.ProcessEnv), /local S3/);
  });

  it('chốt chặn: mở client R2 thật trong lúc test ⇒ ném lỗi rõ ràng', async () => {
    const { assertNotRealEndpointInTests } = await import('./storageSandbox.js');
    assert.throws(() => assertNotRealEndpointInTests('https://abc.r2.cloudflarestorage.com', { WORK_DB_TEST: '1' } as NodeJS.ProcessEnv), /Cloudflare R2 bucket/);
    assert.doesNotThrow(() => assertNotRealEndpointInTests('https://abc.r2.cloudflarestorage.com', { NODE_ENV: 'development' } as NodeJS.ProcessEnv));
  });

  it('cấu hình hiệu lực trỏ vào sandbox dù .env mang khoá thật', async () => {
    const { config } = await import('./env.js');
    assert.equal(config.r2.sandbox, 'memory');
    assert.equal(config.r2.enabled, true);
    assert.equal(config.r2.endpoint, 'https://r2-sandbox.invalid');
    assert.notEqual(config.r2.accessKeyId, 'AKIA_REAL_LOOKING');
    assert.ok(!config.r2.publicUrl.includes('media.cuongthai.com'));
  });

  it('mọi lệnh R2 đi vào kho giả, 0 socket mở ra', async () => {
    const r2 = await import('./r2.js');
    const { sandboxStats, sandboxStore } = await import('./storageSandbox.js');
    const { GetObjectCommand, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const { config } = await import('./env.js');
    const before = sockets.length;

    const put = await r2.putObject('work/9999/test/a.txt', Buffer.from('xin chào R2 giả'), 'text/plain');
    assert.equal(put.url, `${config.r2.publicUrl}/work/9999/test/a.txt`);
    assert.deepEqual(await r2.headObject('work/9999/test/a.txt'), { size: Buffer.byteLength('xin chào R2 giả'), contentType: 'text/plain' });
    assert.equal(await r2.getObjectText('work/9999/test/a.txt'), 'xin chào R2 giả');
    assert.equal(await r2.objectExists('work/9999/test/nope.txt'), false);

    // Gọi thẳng client như projectExport/commentFiles (luồng đọc tệp → PutObject với ContentLength).
    const { Readable } = await import('node:stream');
    await r2.getR2Client().send(new PutObjectCommand({ Bucket: config.r2.bucketName, Key: 'work/9999/test/b.bin', Body: Readable.from([Buffer.from([1, 2, 3, 4, 5])]), ContentLength: 5 }));
    const got = await r2.getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: 'work/9999/test/b.bin', Range: 'bytes=1-3' }));
    assert.deepEqual([...(await got.Body!.transformToByteArray())], [2, 3, 4]);

    for (let i = 0; i < 3; i++) await r2.putObject(`work/9999/list/${i}.txt`, Buffer.from(String(i)), 'text/plain');
    assert.deepEqual((await r2.listObjects('work/9999/list/')).map((o) => o.key), ['work/9999/list/0.txt', 'work/9999/list/1.txt', 'work/9999/list/2.txt']);
    await r2.deleteObjects(['work/9999/list/0.txt', 'work/9999/list/1.txt']);
    await r2.deleteObject('work/9999/list/2.txt');
    assert.deepEqual(await r2.listObjects('work/9999/list/'), []);

    const signed = await r2.getSignedDownloadUrl('work/9999/test/a.txt', 120, 'a.txt');
    assert.match(signed, /^https:\/\/r2-sandbox\.invalid\/__r2-sandbox\/work\/9999\/test\/a\.txt\?/);
    assert.match(await r2.getSignedDownloadUrl('work/9999/có dấu cách.txt', 60), /__r2-sandbox\/work\/9999\/c%C3%B3%20d%E1%BA%A5u%20c%C3%A1ch\.txt\?/, 'khoá có dấu/cách được mã hoá');
    assert.match(signed, /X-Amz-Expires=120\b/);
    assert.match(await r2.getSignedUploadUrl('work/9999/up.png', 'image/png'), /__r2-sandbox\/work\/9999\/up\.png\?/);

    const { getStorageProvider, _resetStorageProviderForTests } = await import('../storage/StorageProvider.js');
    _resetStorageProviderForTests();
    const sp = getStorageProvider();
    assert.equal(sp.kind, 'r2');

    assert.equal(sockets.length - before, 0, `mở ${sockets.length - before} socket: ${sockets.slice(before).join(', ')}`);
    assert.ok(sandboxStats.put >= 5 && sandboxStats.get >= 2 && sandboxStats.list >= 2 && sandboxStats.delete >= 3);
    assert.ok(sandboxStore().keys().includes('work/9999/test/a.txt'));
  });

  it('pagination ListObjectsV2 qua trang (MaxKeys)', async () => {
    const { handleSandboxRequest, sandboxStore } = await import('./storageSandbox.js');
    const s = sandboxStore();
    for (let i = 0; i < 5; i++) s.put(`pg/${i}`, { body: Buffer.from('x'), contentType: 'text/plain', etag: '"e"', lastModified: new Date() });
    const read = async (r: Awaited<ReturnType<typeof handleSandboxRequest>>) => { let t = ''; for await (const c of r.body) t += c; return t; };
    const p1 = await read(await handleSandboxRequest({ method: 'GET', path: '/b', query: { 'list-type': '2', prefix: 'pg/', 'max-keys': '2' }, headers: {} }));
    assert.match(p1, /<IsTruncated>true<\/IsTruncated>/);
    const token = /<NextContinuationToken>(.*?)<\/NextContinuationToken>/.exec(p1)![1];
    const p2 = await read(await handleSandboxRequest({ method: 'GET', path: '/b', query: { 'list-type': '2', prefix: 'pg/', 'max-keys': '10', 'continuation-token': token }, headers: {} }));
    assert.equal([...p2.matchAll(/<Key>/g)].length, 3);
  });
});
