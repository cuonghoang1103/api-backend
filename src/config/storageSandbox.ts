/**
 * Đợt 6 (10/10/2026) — CÔ LẬP R2 KHI TEST / CHẠY LOCAL.
 *
 * Vì sao có tệp này: backend local và bộ test DB dùng chung `.env` với khoá R2 THẬT ⇒ mỗi lượt test tải ảnh/âm thanh
 * lên bucket production (10/10 phải dọn tay 98 tệp rác `work/<id≥2400>/*`). Từ nay:
 *
 *   - Chạy test (`WORK_DB_TEST=1`, `NODE_ENV=test`, hoặc tiến trình con của `node --test` — biến `NODE_TEST_CONTEXT`)
 *     ⇒ BẮT BUỘC sandbox: mọi lệnh R2 (ghi/đọc/xoá/liệt kê) đi vào kho giả trong RAM; KHÔNG một gói tin nào tới
 *     endpoint thật. Muốn tắt sandbox trong lúc test (`STORAGE_SANDBOX=0`) ⇒ NÉM LỖI ngay lúc nạp cấu hình.
 *   - Chạy local an toàn: `STORAGE_SANDBOX=1 npm run dev` ⇒ kho giả trong thư mục tạm (giữ qua lần khởi động lại;
 *     đổi chỗ bằng `STORAGE_SANDBOX_DIR`), tệp phục vụ ở `http://localhost:<PORT>/__r2-sandbox/<key>`.
 *   - Muốn S3 thật nhưng cục bộ (MinIO): `STORAGE_SANDBOX=1 STORAGE_SANDBOX_ENDPOINT=http://localhost:9000`
 *     (+ `STORAGE_SANDBOX_BUCKET/ACCESS_KEY/SECRET_KEY`). Host không phải localhost/127.0.0.1/minio ⇒ ném lỗi.
 *   - Production (`NODE_ENV=production`): sandbox KHÔNG BAO GIỜ bật; đặt `STORAGE_SANDBOX=1` ở production ⇒ ném lỗi.
 *
 * Kho giả cắm vào `S3Client` ở tầng `requestHandler` (thay cho HTTP): SDK vẫn dựng + ký request S3 thật, chỉ là
 * request đó được trả lời bởi bộ mô phỏng dưới đây thay vì đi ra mạng. Nhờ vậy MỌI đường gọi `getR2Client().send(…)`
 * trong repo (projectExport, commentFiles, sachRieng, systemStats, hub…) đều tự đi vào sandbox, không cần sửa từng chỗ.
 *
 * Tệp này KHÔNG import config/env.ts (env.ts import tệp này) — chỉ đọc process.env.
 */

import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';

export type SandboxMode = 'memory' | 'dir' | 'endpoint';

const OFF = new Set(['0', 'off', 'false', 'no']);
const ON = new Set(['1', 'on', 'true', 'yes', 'memory', 'dir']);
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'minio', 'host.docker.internal']);

/** Host của endpoint R2 THẬT — mọi kết nối tới đây trong lúc test là lỗi. */
export const REAL_R2_HOST_RE = /(^|\.)r2\.cloudflarestorage\.com$/i;
export const SANDBOX_ENDPOINT = 'https://r2-sandbox.invalid';
export const SANDBOX_BUCKET = 'ctw-sandbox';

/** Tiến trình đang chạy TEST? (bộ test DB, NODE_ENV=test, hoặc con của node --test). */
export function isTestRun(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.WORK_DB_TEST === '1' || env.NODE_ENV === 'test' || !!env.NODE_TEST_CONTEXT;
}

export class StorageSandboxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageSandboxError';
  }
}

/** Chế độ sandbox đang hiệu lực (null = dùng cấu hình R2 thật). Ném lỗi khi cấu hình nguy hiểm. */
export function sandboxMode(env: NodeJS.ProcessEnv = process.env): SandboxMode | null {
  const flag = (env.STORAGE_SANDBOX ?? '').trim().toLowerCase();
  const test = isTestRun(env);
  if (env.NODE_ENV === 'production') {
    if (ON.has(flag)) throw new StorageSandboxError('STORAGE_SANDBOX is set in production — refusing to start with a fake object store. Remove STORAGE_SANDBOX from the production environment.');
    return null;
  }
  if (OFF.has(flag)) {
    if (test) {
      throw new StorageSandboxError(
        'Refusing to run tests against the real R2 bucket: STORAGE_SANDBOX=0 was set while WORK_DB_TEST/NODE_ENV=test is active. '
        + 'Tests must use the storage sandbox (unset STORAGE_SANDBOX), or point STORAGE_SANDBOX_ENDPOINT at a local MinIO.',
      );
    }
    return null;
  }
  if (!test && !ON.has(flag)) return null;
  if (env.STORAGE_SANDBOX_ENDPOINT) {
    let host = '';
    try { host = new URL(env.STORAGE_SANDBOX_ENDPOINT).hostname.toLowerCase(); } catch { /* xuống dưới */ }
    if (!LOCAL_HOSTS.has(host)) {
      throw new StorageSandboxError(`STORAGE_SANDBOX_ENDPOINT must be a local S3 server (localhost/127.0.0.1/minio), got "${host || env.STORAGE_SANDBOX_ENDPOINT}".`);
    }
    return 'endpoint';
  }
  if (env.STORAGE_SANDBOX_DIR || (!test && flag !== 'memory')) return 'dir';
  return 'memory';
}

/** Ném lỗi nếu một endpoint thật sắp được dùng trong lúc test (chốt chặn cuối ở getR2Client). */
export function assertNotRealEndpointInTests(endpoint: string, env: NodeJS.ProcessEnv = process.env): void {
  if (!isTestRun(env)) return;
  let host = '';
  try { host = new URL(endpoint).hostname; } catch { host = endpoint; }
  throw new StorageSandboxError(
    `Refusing to open a real R2 client during tests (endpoint host "${host}"${REAL_R2_HOST_RE.test(host) ? ' is a Cloudflare R2 bucket' : ''}). `
    + 'Test runs always use the in-memory storage sandbox — see "Chạy local an toàn với R2" in CLAUDE.md.',
  );
}

export interface R2ConfigShape {
  bucketName: string; publicUrl: string; endpoint: string; accessKeyId: string; secretAccessKey: string; region: string; enabled: boolean;
}

/** Cấu hình R2 hiệu lực: sandbox ⇒ thay toàn bộ bằng giá trị giả (không còn khoá thật nào trong bộ nhớ của client). */
export function applyStorageSandbox<T extends R2ConfigShape>(real: T, env: NodeJS.ProcessEnv = process.env): T & { sandbox: SandboxMode | null } {
  const mode = sandboxMode(env);
  if (!mode) return { ...real, sandbox: null };
  const port = env.PORT || '3001';
  // Test trong tiến trình (test DB / node --test): không có trình duyệt mở URL ⇒ gốc https giả (đúng dạng URL R2 thật mà
  // test kiểm). Backend chạy thật ở chế độ sandbox (dev, E2E với NODE_ENV=test) ⇒ tuyến /__r2-sandbox của chính nó.
  const inProcessTest = env.WORK_DB_TEST === '1' || !!env.NODE_TEST_CONTEXT;
  const publicUrl = (env.STORAGE_SANDBOX_PUBLIC_URL || (inProcessTest ? 'https://r2-sandbox.invalid/__r2-sandbox' : `http://localhost:${port}/__r2-sandbox`)).replace(/\/$/, '');
  if (mode === 'endpoint') {
    return {
      ...real, sandbox: mode, enabled: true, publicUrl,
      endpoint: env.STORAGE_SANDBOX_ENDPOINT!, bucketName: env.STORAGE_SANDBOX_BUCKET || SANDBOX_BUCKET,
      accessKeyId: env.STORAGE_SANDBOX_ACCESS_KEY || 'minioadmin', secretAccessKey: env.STORAGE_SANDBOX_SECRET_KEY || 'minioadmin', region: 'us-east-1',
    };
  }
  return {
    ...real, sandbox: mode, enabled: true, publicUrl,
    endpoint: SANDBOX_ENDPOINT, bucketName: SANDBOX_BUCKET, accessKeyId: 'sandbox', secretAccessKey: 'sandbox', region: 'auto',
  };
}

// ─── Kho giả ─────────────────────────────────────────────────────

export interface SandboxObject { body: Buffer; contentType: string; cacheControl?: string; etag: string; lastModified: Date }

export interface SandboxStore {
  put(key: string, o: SandboxObject): void;
  get(key: string): SandboxObject | undefined;
  delete(key: string): void;
  keys(): string[];
  clear(): void;
}

class MemoryStore implements SandboxStore {
  private m = new Map<string, SandboxObject>();
  put(k: string, o: SandboxObject) { this.m.set(k, o); }
  get(k: string) { return this.m.get(k); }
  delete(k: string) { this.m.delete(k); }
  keys() { return [...this.m.keys()].sort(); }
  clear() { this.m.clear(); }
}

/** Thư mục: mỗi object một tệp `<key mã hoá>` + một tệp `.meta.json` bên cạnh. Đủ cho dev, không dành cho tải lớn. */
class DirStore implements SandboxStore {
  constructor(private dir: string) { mkdirSync(dir, { recursive: true }); }
  private p(k: string) { return path.join(this.dir, encodeURIComponent(k)); }
  put(k: string, o: SandboxObject) {
    writeFileSync(this.p(k), o.body);
    writeFileSync(`${this.p(k)}.meta.json`, JSON.stringify({ contentType: o.contentType, cacheControl: o.cacheControl, etag: o.etag, lastModified: o.lastModified.toISOString() }));
  }
  get(k: string): SandboxObject | undefined {
    if (!existsSync(this.p(k))) return undefined;
    let meta: { contentType?: string; cacheControl?: string; etag?: string; lastModified?: string } = {};
    try { meta = JSON.parse(readFileSync(`${this.p(k)}.meta.json`, 'utf8')); } catch { /* thiếu meta ⇒ mặc định */ }
    const body = readFileSync(this.p(k));
    return { body, contentType: meta.contentType || 'application/octet-stream', cacheControl: meta.cacheControl, etag: meta.etag || etagOf(body), lastModified: meta.lastModified ? new Date(meta.lastModified) : new Date() };
  }
  delete(k: string) { rmSync(this.p(k), { force: true }); rmSync(`${this.p(k)}.meta.json`, { force: true }); }
  keys() { return readdirSync(this.dir).filter((n) => !n.endsWith('.meta.json')).map((n) => decodeURIComponent(n)).sort(); }
  clear() { for (const k of this.keys()) this.delete(k); }
}

let store: SandboxStore | null = null;
/** Bộ đếm thao tác — test dùng để chứng minh lệnh ĐÃ đi vào sandbox. */
export const sandboxStats = { put: 0, get: 0, head: 0, delete: 0, list: 0 };

export function sandboxStore(env: NodeJS.ProcessEnv = process.env): SandboxStore {
  if (store) return store;
  const mode = sandboxMode(env);
  store = mode === 'dir' ? new DirStore(env.STORAGE_SANDBOX_DIR || path.join(os.tmpdir(), 'ctw-r2-sandbox')) : new MemoryStore();
  return store;
}

export function _resetSandboxForTests(): void {
  store?.clear();
  store = null;
  for (const k of Object.keys(sandboxStats) as Array<keyof typeof sandboxStats>) sandboxStats[k] = 0;
}

const etagOf = (b: Buffer) => `"${crypto.createHash('md5').update(b).digest('hex')}"`;

// ─── Bộ trả lời S3 (requestHandler giả) ──────────────────────────

interface HttpReq { method: string; path: string; query?: Record<string, string | string[] | null>; headers: Record<string, string>; body?: unknown }
interface HttpRes { statusCode: number; headers: Record<string, string>; body: Readable }

const xmlEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const xmlUnesc = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&amp;/g, '&');

function header(h: Record<string, string>, name: string): string | undefined {
  const k = Object.keys(h).find((x) => x.toLowerCase() === name);
  return k ? h[k] : undefined;
}
function q1(q: HttpReq['query'], name: string): string | undefined {
  const v = q?.[name];
  return Array.isArray(v) ? v[0] : v ?? undefined;
}

async function bodyBuffer(body: unknown): Promise<Buffer> {
  if (body == null) return Buffer.alloc(0);
  if (Buffer.isBuffer(body)) return body;
  if (typeof body === 'string') return Buffer.from(body);
  if (body instanceof Uint8Array) return Buffer.from(body);
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (typeof (body as Readable).pipe === 'function' || typeof (body as AsyncIterable<unknown>)[Symbol.asyncIterator] === 'function') {
    const parts: Buffer[] = [];
    for await (const c of body as AsyncIterable<Buffer | string>) parts.push(typeof c === 'string' ? Buffer.from(c) : Buffer.from(c));
    return Buffer.concat(parts);
  }
  return Buffer.from(String(body));
}

/** Gỡ khung `aws-chunked` (SDK dùng khi tính checksum luồng): `<hex>[;ext]\r\n<data>\r\n … 0\r\n<trailers>\r\n\r\n`. */
export function decodeAwsChunked(buf: Buffer): Buffer {
  const out: Buffer[] = [];
  let i = 0;
  while (i < buf.length) {
    const eol = buf.indexOf('\r\n', i);
    if (eol < 0) break;
    const size = parseInt(buf.subarray(i, eol).toString('latin1').split(';')[0], 16);
    if (!Number.isFinite(size) || size <= 0) break;
    out.push(buf.subarray(eol + 2, eol + 2 + size));
    i = eol + 2 + size + 2;
  }
  return Buffer.concat(out);
}

const res = (statusCode: number, body: Buffer | string = '', headers: Record<string, string> = {}): HttpRes => {
  const b = typeof body === 'string' ? Buffer.from(body) : body;
  return { statusCode, headers: { 'content-length': String(b.length), ...headers }, body: Readable.from(b.length ? [b] : []) };
};
const xml = (statusCode: number, s: string) => res(statusCode, `<?xml version="1.0" encoding="UTF-8"?>${s}`, { 'content-type': 'application/xml' });
const notFound = (key: string, head: boolean) => (head ? res(404) : xml(404, `<Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message><Key>${xmlEsc(key)}</Key></Error>`));

/** Trả lời một request S3 (path-style: /<bucket>/<key>). Chỉ những lệnh repo dùng; lệnh lạ ⇒ 501 rõ ràng. */
export async function handleSandboxRequest(req: HttpReq, s: SandboxStore = sandboxStore()): Promise<HttpRes> {
  const segs = req.path.replace(/^\/+/, '').split('/');
  const bucket = decodeURIComponent(segs.shift() ?? '');
  const key = segs.map((x) => decodeURIComponent(x)).join('/');
  const method = req.method.toUpperCase();
  const q = req.query ?? {};

  if (!key) {
    if (method === 'HEAD') return res(200);
    if (method === 'POST' && 'delete' in q) {
      const text = (await bodyBuffer(req.body)).toString('utf8');
      const keys = [...text.matchAll(/<Key>([\s\S]*?)<\/Key>/g)].map((m) => xmlUnesc(m[1]));
      for (const k of keys) { s.delete(k); sandboxStats.delete++; }
      return xml(200, '<DeleteResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"></DeleteResult>');
    }
    if (method === 'GET' && q1(q, 'list-type') === '2') {
      sandboxStats.list++;
      const prefix = q1(q, 'prefix') ?? '';
      const max = Math.max(1, Math.min(1000, Number(q1(q, 'max-keys') ?? 1000) || 1000));
      const after = q1(q, 'continuation-token') ? Buffer.from(q1(q, 'continuation-token')!, 'base64url').toString('utf8') : q1(q, 'start-after') ?? '';
      const all = s.keys().filter((k) => k.startsWith(prefix) && (!after || k > after));
      const page = all.slice(0, max);
      const truncated = all.length > page.length;
      const contents = page.map((k) => {
        const o = s.get(k)!;
        return `<Contents><Key>${xmlEsc(k)}</Key><LastModified>${o.lastModified.toISOString()}</LastModified><ETag>${xmlEsc(o.etag)}</ETag><Size>${o.body.length}</Size><StorageClass>STANDARD</StorageClass></Contents>`;
      }).join('');
      return xml(200, `<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>${xmlEsc(bucket)}</Name><Prefix>${xmlEsc(prefix)}</Prefix><KeyCount>${page.length}</KeyCount><MaxKeys>${max}</MaxKeys><IsTruncated>${truncated}</IsTruncated>${contents}${truncated ? `<NextContinuationToken>${Buffer.from(page[page.length - 1]).toString('base64url')}</NextContinuationToken>` : ''}</ListBucketResult>`);
    }
    return xml(501, `<Error><Code>NotImplemented</Code><Message>Storage sandbox: bucket-level ${method} is not emulated</Message></Error>`);
  }

  if (method === 'PUT') {
    if (header(req.headers, 'x-amz-copy-source')) {
      const src = decodeURIComponent(header(req.headers, 'x-amz-copy-source')!.replace(/^\/?[^/]+\//, ''));
      const o = s.get(src);
      if (!o) return notFound(src, false);
      s.put(key, { ...o, lastModified: new Date() });
      sandboxStats.put++;
      return xml(200, `<CopyObjectResult><ETag>${xmlEsc(o.etag)}</ETag><LastModified>${new Date().toISOString()}</LastModified></CopyObjectResult>`);
    }
    let body = await bodyBuffer(req.body);
    if ((header(req.headers, 'content-encoding') ?? '').includes('aws-chunked')) body = decodeAwsChunked(body);
    const etag = etagOf(body);
    s.put(key, { body, contentType: header(req.headers, 'content-type') || 'application/octet-stream', cacheControl: header(req.headers, 'cache-control'), etag, lastModified: new Date() });
    sandboxStats.put++;
    return res(200, '', { etag });
  }
  if (method === 'DELETE') { s.delete(key); sandboxStats.delete++; return res(204); }
  if (method === 'GET' || method === 'HEAD') {
    const head = method === 'HEAD';
    head ? sandboxStats.head++ : sandboxStats.get++;
    const o = s.get(key);
    if (!o) return notFound(key, head);
    const base: Record<string, string> = {
      'content-type': o.contentType, etag: o.etag, 'last-modified': o.lastModified.toUTCString(), 'accept-ranges': 'bytes',
      ...(o.cacheControl ? { 'cache-control': o.cacheControl } : {}),
    };
    const range = /^bytes=(\d*)-(\d*)$/.exec(header(req.headers, 'range') ?? '');
    if (range && !head) {
      const size = o.body.length;
      let start = range[1] ? Number(range[1]) : size - Number(range[2]);
      let end = range[1] && range[2] ? Number(range[2]) : size - 1;
      start = Math.max(0, start); end = Math.min(size - 1, end);
      if (start > end) return xml(416, '<Error><Code>InvalidRange</Code></Error>');
      return res(206, o.body.subarray(start, end + 1), { ...base, 'content-range': `bytes ${start}-${end}/${size}` });
    }
    if (head) return { statusCode: 200, headers: { ...base, 'content-length': String(o.body.length) }, body: Readable.from([]) };
    return res(200, o.body, base);
  }
  return xml(501, `<Error><Code>NotImplemented</Code><Message>Storage sandbox: ${method} on an object is not emulated</Message></Error>`);
}

/** requestHandler cho S3Client: thay HTTP bằng bộ trả lời ở trên. KHÔNG mở socket nào. */
export function sandboxRequestHandler() {
  return {
    metadata: { handlerProtocol: 'http/1.1' },
    async handle(request: HttpReq & { hostname?: string }) {
      const response = await handleSandboxRequest(request);
      return { response };
    },
    updateHttpClientConfig() { /* không có cấu hình HTTP để đổi */ },
    httpHandlerConfigs() { return {}; },
    destroy() { /* không có kết nối để đóng */ },
  };
}
