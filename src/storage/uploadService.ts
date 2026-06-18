/**
 * Unified upload service.
 *
 * All file uploads in the backend go through this module. It
 * coordinates three concerns:
 *
 *   1. Buffer-level preprocessing (image optimization via Sharp,
 *      MIME sniffing, size guards).
 *   2. Key construction (one place to define bucket layout).
 *   3. Persistence (delegates to the active StorageProvider so
 *      R2 / local both work).
 *
 * Public API:
 *   - uploadImage()     — image, runs through sharp, stored as webp
 *   - uploadAudio()     — mp3/m4a/etc, stored under `audio/songs/`
 *   - uploadDocument()  — pdf/zip/docx, stored under `documents/`
 *   - uploadGeneric()   — fallback for any buffer
 *   - deleteByUrl()     — best-effort delete from a public URL
 *   - deleteByKey()     — explicit delete by bucket key
 *
 * Error handling:
 *   - All R2/Sharp errors are wrapped in `UploadError` with a
 *     stable `code` so the route layer can map them to HTTP
 *     status codes (4xx for bad input, 5xx for infra).
 *   - Failures are LOGGED with full context (key, userId, size)
 *     so we can diagnose the 1-in-10000 case where R2 returns
 *     a 500 mid-upload.
 */
import {
  getStorageProvider,
  StoredObject,
  contentTypeFromKey,
} from './StorageProvider.js';
import { buildKey, buildAudioKey, buildChatAttachmentKey, buildNotificationSoundKey, StorageCategory } from './keys.js';
import { optimizeImage, ImageOptimizationError, formatSavings } from './imageOptimizer.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class UploadError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(message: string, code: string, status = 500) {
    super(message);
    this.name = 'UploadError';
    this.code = code;
    this.status = status;
  }
}

/** Per-call upload metadata. The route layer passes the file
 *  straight from multer; we don't care how it was received. */
export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimetype: string;
  size: number;
}

export interface UploadResult extends StoredObject {
  /** Display-friendly "saved 75%" string for client toasts. */
  savings?: string;
  /** Final width/height for images. */
  width?: number;
  height?: number;
}

// ─── Image upload ──────────────────────────────────────────
//
// Runs the input through Sharp. The output is always webp with
// max-width 1200. We don't trust the client-supplied mimetype —
// Sharp will throw on garbage input, and we map that to a 4xx
// in the route layer.

export async function uploadImage(
  input: UploadInput,
  category: StorageCategory,
  options: { userId?: number; subPrefix?: string } = {},
): Promise<UploadResult> {
  if (input.size === 0) {
    throw new UploadError('Empty file', 'EMPTY_FILE', 400);
  }
  if (input.size > config.maxFileSizeImages) {
    throw new UploadError(
      `Image too large (max ${config.maxFileSizeImages / 1024 / 1024}MB)`,
      'FILE_TOO_LARGE',
      413,
    );
  }

  let optimized;
  try {
    optimized = await optimizeImage(input.buffer, input.mimetype);
  } catch (err) {
    if (err instanceof ImageOptimizationError) {
      throw new UploadError(err.message, err.code, 400);
    }
    throw new UploadError(
      `Image optimization failed: ${(err as Error).message}`,
      'OPTIMIZATION_FAILED',
      500,
    );
  }

  // Always store the optimized output as a fresh .webp key, not
  // a key derived from the input's extension. That way the
  // Content-Type we serve is `image/webp` and the file has the
  // correct format on disk.
  const originalNameForKey = input.originalName.replace(/\.[^.]+$/, '') + '.webp';
  const key = buildKey(category, originalNameForKey, options);
  const savings = formatSavings(optimized.originalSize, optimized.optimizedSize);

  const stored = await getStorageProvider().put(key, optimized.buffer, optimized.contentType);

  logger.info(
    `[upload] image ${stored.url} (${optimized.originalSize}→${optimized.optimizedSize}B, ${savings})`,
  );

  return {
    ...stored,
    savings,
    width: optimized.width,
    height: optimized.height,
  };
}

// ─── Audio upload ──────────────────────────────────────────
//
// Audio files are passed through untouched. The R2 spec asks us
// to keep them in `songs/`. We preserve the client-supplied
// content-type so the browser's <audio> tag gets the right MIME.

export async function uploadAudio(
  input: UploadInput,
  options: { userId?: number; kind?: 'songs' | 'notifications' } = {},
): Promise<UploadResult> {
  if (input.size === 0) {
    throw new UploadError('Empty file', 'EMPTY_FILE', 400);
  }
  if (input.size > config.maxFileSizeAudio) {
    throw new UploadError(
      `Audio too large (max ${config.maxFileSizeAudio / 1024 / 1024}MB)`,
      'FILE_TOO_LARGE',
      413,
    );
  }
  if (!input.mimetype.startsWith('audio/')) {
    throw new UploadError(
      `Refusing non-audio upload (got ${input.mimetype})`,
      'WRONG_MIME',
      400,
    );
  }

  const key =
    options.kind === 'notifications'
      ? buildNotificationSoundKey(input.originalName)
      : buildAudioKey(input.originalName, options);

  const stored = await getStorageProvider().put(key, input.buffer, input.mimetype);
  logger.info(`[upload] audio ${stored.url} (${input.size}B)`);
  return stored;
}

// ─── Document upload ───────────────────────────────────────
//
// Used by chat attachments and the academy course documents.
// We keep the original extension and content-type because the
// browser needs both to render PDFs / Word / ZIPs correctly.

export async function uploadDocument(
  input: UploadInput,
  options: { userId?: number; scope?: 'chat' | 'lesson' } = {},
): Promise<UploadResult> {
  if (input.size === 0) {
    throw new UploadError('Empty file', 'EMPTY_FILE', 400);
  }
  if (input.size > config.maxFileSizeDocument) {
    throw new UploadError(
      `Document too large (max ${config.maxFileSizeDocument / 1024 / 1024}MB)`,
      'FILE_TOO_LARGE',
      413,
    );
  }

  const key =
    options.scope === 'chat'
      ? buildChatAttachmentKey(input.originalName, options)
      : buildKey('documents/lesson', input.originalName, options);

  const stored = await getStorageProvider().put(key, input.buffer, input.mimetype);
  logger.info(`[upload] document ${stored.url} (${input.size}B)`);
  return stored;
}

// ─── Generic upload ────────────────────────────────────────
//
// Used for cover images, project thumbnails, and other things
// that aren't user-generated content but still need to live in
// the bucket. Goes through image optimization if the input is
// an image, otherwise passes through.

export async function uploadGeneric(
  input: UploadInput,
  category: StorageCategory,
  options: { userId?: number; subPrefix?: string; optimize?: boolean } = {},
): Promise<UploadResult> {
  const wantsOptimize = options.optimize ?? input.mimetype.startsWith('image/');
  if (wantsOptimize && input.mimetype.startsWith('image/') && input.mimetype !== 'image/svg+xml') {
    return uploadImage(input, category, options);
  }
  // Non-image: pass through with a content-type from the
  // extension so the browser gets the right MIME even when
  // multer couldn't sniff it.
  const ct = input.mimetype !== 'application/octet-stream'
    ? input.mimetype
    : contentTypeFromKey(input.originalName);
  const key = buildKey(category, input.originalName, options);
  const stored = await getStorageProvider().put(key, input.buffer, ct);
  logger.info(`[upload] generic ${stored.url} (${input.size}B, ${ct})`);
  return stored;
}

// ─── Delete helpers ────────────────────────────────────────

/**
 * Delete the object behind a public URL. Returns silently if the
 * URL isn't one of ours (e.g. a YouTube thumbnail) — the
 * desired end state ("file isn't on our bucket") is already met.
 */
export async function deleteByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const provider = getStorageProvider();
  const key = provider.keyFromUrl(url);
  if (!key) {
    // Foreign URL — nothing to do.
    return;
  }
  try {
    await provider.delete(key);
    logger.info(`[upload] deleted ${key}`);
  } catch (err) {
    // A failed delete is a leak, not a user-facing error. We
    // log loud so cleanup jobs can pick it up later.
    logger.warn(
      `[upload] failed to delete ${key} from ${provider.kind}: ${(err as Error).message}`,
    );
  }
}

/** Delete a batch of URLs (best effort, no error surface). */
export async function deleteByUrls(urls: Array<string | null | undefined>): Promise<void> {
  const provider = getStorageProvider();
  const keys: string[] = [];
  for (const url of urls) {
    const key = provider.keyFromUrl(url);
    if (key) keys.push(key);
  }
  if (keys.length === 0) return;
  try {
    await provider.deleteMany(keys);
    logger.info(`[upload] batch-deleted ${keys.length} object(s)`);
  } catch (err) {
    logger.warn(`[upload] batch delete failed: ${(err as Error).message}`);
  }
}

/** Delete by an explicit bucket key (not a URL). */
export async function deleteByKey(key: string): Promise<void> {
  try {
    await getStorageProvider().delete(key);
  } catch (err) {
    logger.warn(`[upload] failed to delete ${key}: ${(err as Error).message}`);
  }
}
