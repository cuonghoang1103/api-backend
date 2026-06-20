/**
 * Storage abstraction layer.
 *
 * Why this exists:
 *   The codebase has many call sites that need to read/write/
 *   delete files (post images, course docs, chat attachments,
 *   audio files, avatars). We want every call site to go through
 *   ONE interface so we can swap backends (R2, local disk, an
 *   S3-compatible alternative) without touching business code.
 *
 * Two implementations live in this folder:
 *   - `R2StorageProvider`  — production backend. Uses Cloudflare
 *     R2 via the AWS SDK. No local disk I/O for stored data;
 *     small `/tmp` is used only for FFmpeg transients.
 *   - `LocalStorageProvider` — fallback for local development
 *     when R2 credentials aren't set. Same interface, same
 *     return shape, so business code is identical.
 *
 * The `getStorageProvider()` factory picks one at startup based
 * on env configuration. It's a singleton; the SDK clients inside
 * (S3, multer) keep their own connection pools.
 *
 * All operations are async and return promises. Failures throw
 * `StorageError` with a stable `code` so callers can decide
 * whether to retry, surface a 5xx, or fall back.
 */
import { config } from '../config/env.js';
import {
  putObject as r2Put,
  deleteObject as r2Delete,
  deleteObjects as r2DeleteMany,
  getSignedDownloadUrl as r2Signed,
  buildPublicUrl as r2PublicUrl,
  keyFromUrl as r2KeyFromUrl,
} from '../config/r2.js';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, createReadStream, statSync } from 'fs';
import { Readable } from 'stream';

export type StorageKind = 'r2' | 'local';

/**
 * A stored object reference. Every upload returns one of these
 * and the caller persists the public URL into the database. We
 * also keep the `key` (the relative path inside the bucket) so
 * a future delete can map the URL back to an object key without
 * having to query the DB.
 */
export interface StoredObject {
  /** Bucket-relative key, e.g. "images/avatar/abc-123.webp" */
  key: string;
  /** Absolute public URL the browser can fetch */
  url: string;
  /** Size in bytes (after any optimization) */
  size: number;
  /** Final content type stored on R2 / mimetype on local */
  contentType: string;
  /** etag from R2, or sha256 hex on local */
  etag?: string;
}

/**
 * Options for {@link StorageProvider.readStream}.
 *
 * `range` follows the HTTP Range header format (`bytes=START-END`).
 * Both bounds are inclusive. `END` is optional for open-ended
 * ranges. The provider must return a stream that contains
 * exactly those bytes (or, for open-ended, from START to EOF) so
 * that the byte stream the caller pipes to the client lines up
 * with the `Content-Length` / `Content-Range` headers the music
 * streaming endpoint already sets.
 */
export interface ReadStreamOptions {
  /** Optional HTTP Range header value, e.g. "bytes=0-102400". */
  range?: string;
}

export interface StorageProvider {
  readonly kind: StorageKind;
  /** Upload a buffer to the given key */
  put(key: string, body: Buffer, contentType: string): Promise<StoredObject>;
  /** Delete a single object by key. No-op if missing. */
  delete(key: string): Promise<void>;
  /** Delete a batch of objects by key. No-op if missing. */
  deleteMany(keys: string[]): Promise<void>;
  /** Generate a short-lived signed URL for private content */
  signedUrl(key: string, expiresInSeconds?: number, filename?: string): Promise<string>;
  /** Build the public URL for a key. */
  publicUrl(key: string): string;
  /** Reverse-lookup: extract the key from a public URL. */
  keyFromUrl(url: string | null | undefined): string | null;
  /**
   * Open a readable stream for a key. Used by the music stream endpoint.
   * The `options.range` parameter is forwarded to the storage backend so
   * the returned stream contains exactly the requested bytes (or all
   * bytes from START to EOF for open-ended ranges like "bytes=2000000-").
   * Without this, R2 always returns the full object and the response
   * body doesn't match the `Content-Range` header — which makes the
   * browser play only the first chunk of the file after every seek.
   */
  readStream(
    key: string,
    options?: ReadStreamOptions,
  ): Promise<{ stream: Readable; size: number; contentType: string }>;
}

// ─── Local implementation ──────────────────────────────────
//
// Kept for contributors running the app without R2 credentials.
// Behaviour intentionally matches R2StorageProvider so the rest
// of the app is identical. The directory layout mirrors what we
// use on R2: `<UPLOAD_DIR>/<key>`.

class LocalStorageProvider implements StorageProvider {
  readonly kind = 'local' as const;

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    const fullPath = path.join(config.uploadDir, key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true, mode: 0o777 });
    await fs.writeFile(fullPath, body);
    return {
      key,
      url: this.publicUrl(key),
      size: body.length,
      contentType,
    };
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(config.uploadDir, key);
    try {
      await fs.unlink(fullPath);
    } catch {
      /* already gone */
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    await Promise.allSettled(keys.map((k) => this.delete(k)));
  }

  async signedUrl(key: string): Promise<string> {
    // Local has no signing — return the public URL. In dev this
    // is fine; in prod the local provider is never selected.
    return this.publicUrl(key);
  }

  publicUrl(key: string): string {
    return `${config.publicBaseUrl}/uploads/${key.replace(/^\/+/, '')}`;
  }

  keyFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    const prefix = `${config.publicBaseUrl}/uploads/`;
    if (!url.startsWith(prefix)) return null;
    return url.slice(prefix.length);
  }

  async readStream(
    key: string,
    options?: ReadStreamOptions,
  ): Promise<{ stream: Readable; size: number; contentType: string }> {
    const fullPath = path.join(config.uploadDir, key);
    if (!existsSync(fullPath)) {
      throw new Error(`Local file not found: ${key}`);
    }
    const size = statSync(fullPath).size;
    const ext = path.extname(key).toLowerCase();
    const mime = MIME_BY_EXT[ext] ?? 'application/octet-stream';

    // If a range is requested, slice the file at the OS level so we
    // never load the whole track into RAM. Falls back to the full
    // file when the range is missing or unparseable (the streaming
    // endpoint will serve it as HTTP 200 with full Content-Length).
    if (options?.range) {
      const parsed = parseRangeHeader(options.range, size);
      if (parsed) {
        const { start, end } = parsed;
        return {
          stream: createReadStream(fullPath, { start, end, autoClose: true }),
          size,
          contentType: mime,
        };
      }
    }
    return { stream: createReadStream(fullPath), size, contentType: mime };
  }
}

// ─── Range header parser (used by the local provider) ─────────────
// Minimal port of the parser in services/music.service.ts so the
// storage layer doesn't have to import a service module (and create
// a cycle). Accepts the standard HTTP Range header format:
//   bytes=START-END  (both inclusive)
//   bytes=START-     (from START to EOF)
//   bytes=-N         (the last N bytes)
// Returns null when the input is malformed; the caller should then
// fall back to streaming the whole file.
function parseRangeHeader(
  range: string,
  total: number,
): { start: number; end: number } | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m) return null;
  const rs = m[1];
  const re = m[2];
  let start: number;
  let end: number;
  if (rs === '' && re !== '') {
    const n = parseInt(re, 10);
    if (!Number.isFinite(n) || n <= 0) return null;
    start = Math.max(0, total - n);
    end = total - 1;
  } else {
    start = parseInt(rs || '0', 10);
    end = re === '' ? total - 1 : Math.min(parseInt(re, 10), total - 1);
  }
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || end < start) return null;
  if (start >= total) return null;
  return { start, end };
}

// ─── R2 implementation ─────────────────────────────────────

class R2StorageProvider implements StorageProvider {
  readonly kind = 'r2' as const;

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    const res = await r2Put(key, body, contentType);
    return {
      key,
      url: res.url,
      size: body.length,
      contentType,
      etag: res.etag,
    };
  }

  async delete(key: string): Promise<void> {
    await r2Delete(key);
  }

  async deleteMany(keys: string[]): Promise<void> {
    await r2DeleteMany(keys);
  }

  async signedUrl(key: string, expiresInSeconds = 300, filename?: string): Promise<string> {
    return r2Signed(key, expiresInSeconds, filename);
  }

  publicUrl(key: string): string {
    return r2PublicUrl(key);
  }

  keyFromUrl(url: string | null | undefined): string | null {
    return r2KeyFromUrl(url);
  }

  async readStream(
    key: string,
    options?: ReadStreamOptions,
  ): Promise<{ stream: Readable; size: number; contentType: string }> {
    // For R2 we don't have a "size" without a HEAD call. The
    // music stream endpoint only uses the stream itself, so we
    // return -1 and let the HTTP layer figure out Content-Length
    // from the streamed response. (Browsers handle missing
    // Content-Length fine for audio — they use Range requests.)
    void existsSync; // keep import happy in case future use
    // We use the AWS SDK to fetch a body stream; for the music
    // path the caller should prefer `signedUrl()` + 302 redirect.
    const { getR2Client } = await import('../config/r2.js');
    const { GetObjectCommand } = await import('@aws-sdk/client-s3');
    const client = getR2Client();
    const res = await client.send(
      new GetObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
        // CRITICAL: forward the HTTP Range header to R2. Without
        // this, the SDK always returns the full object regardless
        // of the byte slice the browser asked for. The streaming
        // endpoint then sends a `Content-Range: bytes N-M/TOTAL`
        // header alongside the full 8MB body, and the browser
        // only reads up to Content-Length (N-M+1 bytes) — meaning
        // every seek silently rewinds playback to byte 0, which
        // is what causes "the disc shows the song near the end
        // but only the beginning is audible". R2/S3 supports the
        // same `bytes=START-END` format as HTTP, so we just pass
        // the value through.
        ...(options?.range ? { Range: options.range } : {}),
      }),
    );
    if (!res.Body) throw new Error(`R2 object has no body: ${key}`);
    // The SDK returns a Web ReadableStream; convert to Node Readable.
    const stream = res.Body as unknown as Readable;
    const size = typeof res.ContentLength === 'number' ? res.ContentLength : -1;
    const contentType = res.ContentType ?? 'application/octet-stream';
    return { stream, size, contentType };
  }
}

// ─── Provider selection ────────────────────────────────────

let cached: StorageProvider | null = null;

/**
 * Pick the active storage provider. We always prefer R2 if it's
 * configured; only fall back to local when the env doesn't have
 * the four required R2 variables.
 */
export function getStorageProvider(): StorageProvider {
  if (cached) return cached;
  cached = config.r2.enabled ? new R2StorageProvider() : new LocalStorageProvider();
  if (config.nodeEnv === 'production' && cached.kind !== 'r2') {
    // Refuse to start in production without R2. Local disk in
    // prod was the bug we just spent a week migrating away from.
    throw new Error(
      'Cloudflare R2 is not configured. Production requires R2_BUCKET_NAME, ' +
        'R2_ENDPOINT_URL, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.',
    );
  }
  return cached;
}

/** Reset cached provider — used in tests. */
export function _resetStorageProviderForTests(): void {
  cached = null;
}

// ─── MIME helpers ──────────────────────────────────────────

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.opus': 'audio/opus',
  '.webm': 'audio/webm',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/** Look up a content-type by file extension. Defaults to octet-stream. */
export function contentTypeFromKey(key: string): string {
  const ext = path.extname(key).toLowerCase();
  return MIME_BY_EXT[ext] ?? 'application/octet-stream';
}
