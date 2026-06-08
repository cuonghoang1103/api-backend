import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import type { FileCategory } from '../types/index.js';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
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

export class UploadService {
  // ─── Upload Single File ────────────────────────────────
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

    // Generate unique stored name
    const baseSlug = slugify(path.parse(file.originalname).name);
    const timestamp = Date.now();
    const randomStr = uuidv4().split('-')[0];
    const ext = path.extname(file.originalname).toLowerCase();
    const storedName = `${baseSlug}-${timestamp}-${randomStr}${ext}`;

    // Subdirectory based on category
    const subDir = finalCategory;
    const relativePath = path.join(subDir, storedName);
    const fullPath = path.join(config.uploadDir, relativePath);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Move file to storage
    await fs.writeFile(fullPath, file.buffer);

    // Determine public URL
    const url = `/uploads/${relativePath.replace(/\\/g, '/')}`;

    // Save to database
    const attachment = await prisma.fileAttachment.create({
      data: {
        originalName: file.originalname,
        storedName,
        filePath: relativePath,
        contentType: file.mimetype,
        fileSize: file.size,
        uploadedBy,
        fileCategory: finalCategory,
      },
    });

    return {
      id: attachment.id,
      originalName: attachment.originalName,
      storedName: attachment.storedName,
      filePath: attachment.filePath,
      url,
      contentType: attachment.contentType,
      fileSize: Number(attachment.fileSize),
      fileCategory: attachment.fileCategory || finalCategory,
    };
  }

  // ─── Upload Multiple Files ─────────────────────────────
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
        console.error(`Failed to upload ${file.originalname}:`, error);
      }
    }
    return results;
  }

  // ─── Delete File ──────────────────────────────────────
  async deleteFile(id: number): Promise<void> {
    const attachment = await prisma.fileAttachment.findUnique({ where: { id } });
    if (!attachment) return;

    const fullPath = path.join(config.uploadDir, attachment.filePath);
    try {
      await fs.unlink(fullPath);
    } catch {
      // File might already be deleted
    }

    await prisma.fileAttachment.delete({ where: { id } });
  }

  // ─── Get File Info ────────────────────────────────────
  async getFile(id: number) {
    return prisma.fileAttachment.findUnique({ where: { id } });
  }

  // ─── Delete Physical File ─────────────────────────────
  async deletePhysicalFile(filePath: string): Promise<void> {
    const fullPath = path.join(config.uploadDir, filePath);
    try {
      await fs.unlink(fullPath);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

export const uploadService = new UploadService();
