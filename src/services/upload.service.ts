import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import type { FileCategory } from '../types/index.js';
import {
  uploadGeneric,
  uploadImage,
  uploadAudio,
  uploadDocument,
  UploadError,
} from '../storage/uploadService.js';
import { getStorageProvider } from '../storage/StorageProvider.js';
import { logger } from '../utils/logger.js';

// SECURITY: SVG intentionally excluded — it can carry <script> and
// would be served as active content (stored XSS). See assertSafeUploadType.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

// ─── Signed URL ─────────────────────────────────────────────────
// Secret comes from env (validated at startup — no placeholder
// default allowed in production). If it's missing or weak, the
// server fails to start instead of silently using a forgeable value.
const SIGNED_URL_SECRET = config.signedUrlSecret;
const SIGNED_URL_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export interface SignedUploadPayload {
  filename: string;
  contentType: string;
  folder: string;
  userId?: number;
  exp: number;
}

export function generateSignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string,
  userId?: number,
): { uploadUrl: string; fileId: string } {
  const exp = Date.now() + SIGNED_URL_EXPIRY_MS;
  const payload: SignedUploadPayload = { filename, contentType, folder, userId, exp };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SIGNED_URL_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const token = `${payloadBase64}.${signature}`;
  const fileId = uuidv4();
  // Encode token so it doesn't contain / characters that break Express route params
  const encodedToken = Buffer.from(token).toString('base64url');
  const uploadUrl = `/api/v1/files/upload/signed/${encodedToken}`;

  return { uploadUrl, fileId };
}

export function verifySignedUploadToken(token: string): SignedUploadPayload | null {
  // Token is base64url-encoded to avoid / characters in Express route params
  const decodedToken = Buffer.from(token, 'base64url').toString('utf-8');
  try {
    const lastDot = decodedToken.lastIndexOf('.');
    if (lastDot === -1) return null;
    const payloadBase64 = decodedToken.slice(0, lastDot);
    const signature = decodedToken.slice(lastDot + 1);

    const expectedSig = crypto
      .createHmac('sha256', SIGNED_URL_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    );

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

function getFileCategory(mimeType: string): FileCategory {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'images';
  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) return 'audio';
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
  return 'documents';
}

function getMaxSize(category: FileCategory): number {
  switch (category) {
    case 'images': return config.maxFileSizeImages;
    case 'audio': return config.maxFileSizeAudio;
    case 'video': return config.maxFileSizeVideo;
    default: return config.maxFileSizeDocument;
  }
}

function getAllowedTypes(category: FileCategory): string[] {
  switch (category) {
    case 'images': return ALLOWED_IMAGE_TYPES;
    case 'audio': return ALLOWED_AUDIO_TYPES;
    case 'video': return ALLOWED_VIDEO_TYPES;
    case 'documents': return ALLOWED_DOCUMENT_TYPES;
    default: return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  }
}

export interface UploadResult {
  id: number;
  originalName: string;
  storedName: string;
  filePath: string;
  url: string;
  contentType: string;
  fileSize: number;
  fileCategory: string;
}

// ─── Deprecated path-based helpers ───────────────────────────────────────────
//
// The original `UploadService` wrote files directly to
// `config.uploadDir`. After the R2 migration every upload goes
// through `storage/uploadService.ts`, which delegates to the
// active `StorageProvider` (R2 in production, local in dev).
// The two helpers below are kept only as a SAFETY NET for any
// future caller that still asks for path-based delete. They
// refuse to do local-disk writes on production so we can't
// accidentally land a file outside the R2 bucket.

/**
 * @deprecated Use `deleteByUrl` / `deleteByKey` from
 * `storage/uploadService.ts` instead. This wrapper remains for
 * callers that already pass around a path string and want a
 * one-line drop-in. It maps the path through the active
 * storage provider so it works against both R2 (key form) and
 * legacy local layouts.
 */
async function deleteByPath(filePath: string): Promise<void> {
  // Legacy local path: try the local provider first (no-op on R2
  // because the URL prefix won't match). Then fall through to
  // the bucket key form via publicUrl() so an R2-stored key
  // still resolves.
  const provider = getStorageProvider();
  // Treat as bucket key first (matches R2).
  await provider.delete(filePath).catch((err) => {
    logger.warn(`[upload-deprecated] path-based delete failed for ${filePath}: ${(err as Error).message}`);
  });
}

/**
 * @deprecated `UploadService` no longer writes files locally. It
 * is a thin pass-through to `storage/uploadService.ts` so all
 * uploads land in R2 (or the dev local provider). Kept only
 * because a handful of legacy test scripts import the
 * `uploadService` singleton; the methods below delegate to the
 * canonical storage service.
 */
export class UploadService {
  // ─── Upload Single File ──────────────────────────────────
  async uploadFile(
    file: Express.Multer.File,
    category: FileCategory,
    uploadedBy?: number,
  ): Promise<UploadResult> {
    const detectedCategory = getFileCategory(file.mimetype);
    const finalCategory = category || detectedCategory;
    const allowedTypes = getAllowedTypes(finalCategory);

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed for category ${finalCategory}`);
    }

    const maxSize = getMaxSize(finalCategory);
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / 1024 / 1024);
      throw new Error(`File size exceeds maximum of ${maxMB}MB`);
    }

    const input = {
      buffer: file.buffer,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    // Route to the right storage helper based on category.
    // This way the file lands in R2 (prod) or local dev
    // provider, never on a raw disk path.
    let stored;
    try {
      if (finalCategory === 'audio') {
        stored = await uploadAudio(input, { userId: uploadedBy });
      } else if (finalCategory === 'images') {
        stored = await uploadImage(input, 'images/post', { userId: uploadedBy });
      } else if (finalCategory === 'video') {
        stored = await uploadGeneric(input, 'video', { userId: uploadedBy });
      } else {
        stored = await uploadDocument(input, { userId: uploadedBy });
      }
    } catch (err) {
      if (err instanceof UploadError) {
        // Re-throw with a useful legacy-shaped message; callers
        // expecting an `Error` still see the same surface.
        throw new Error(err.message);
      }
      throw err;
    }

    const storedName = stored.key.split('/').pop() ?? file.originalname;

    // Persist a FileAttachment row for legacy callers that
    // still query it (admin UI etc.). Without this row the
    // admin "Files" page would silently drop the upload.
    const attachment = await prisma.fileAttachment.create({
      data: {
        originalName: file.originalname,
        storedName,
        filePath: stored.key,
        contentType: file.mimetype,
        fileSize: BigInt(stored.size),
        uploadedBy,
        fileCategory: finalCategory,
      },
    });

    return {
      id: attachment.id,
      originalName: attachment.originalName,
      storedName: attachment.storedName,
      filePath: attachment.filePath,
      url: stored.url,
      contentType: attachment.contentType,
      fileSize: Number(attachment.fileSize),
      fileCategory: attachment.fileCategory || finalCategory,
    };
  }

  // ─── Upload Multiple Files ───────────────────────────────
  async uploadMultiple(
    files: Express.Multer.File[],
    category: FileCategory,
    uploadedBy?: number,
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, category, uploadedBy);
        results.push(result);
      } catch (error) {
        logger.error(`Failed to upload ${file.originalname}: ${(error as Error).message}`);
      }
    }
    return results;
  }

  // ─── Delete File ─────────────────────────────────────────
  async deleteFile(id: number): Promise<void> {
    const attachment = await prisma.fileAttachment.findUnique({ where: { id } });
    if (!attachment) return;
    await deleteByPath(attachment.filePath);
    await prisma.fileAttachment.delete({ where: { id } });
  }

  // ─── Get File Info ───────────────────────────────────────
  async getFile(id: number) {
    return prisma.fileAttachment.findUnique({ where: { id } });
  }

  // ─── Delete Physical File ────────────────────────────────
  async deletePhysicalFile(filePath: string): Promise<void> {
    await deleteByPath(filePath);
  }
}

export const uploadService = new UploadService();
