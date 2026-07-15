/**
 * ============================================================
 * Video Processing Service
 *
 * Provides video thumbnail extraction using FFmpeg.
 * Generates a poster/thumbnail frame from uploaded videos.
 * ============================================================
 */

import { exec, execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger.js';
import { uploadImage, type UploadInput } from '../storage/uploadService.js';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';

/**
 * Extract a thumbnail frame from a video file at the 1-second mark.
 *
 * Uses FFmpeg to extract a single frame: `ffmpeg -i input -ss 00:00:01 -vframes 1 -q:v 2 output.jpg`
 *
 * The extracted JPEG is then uploaded to the `images/thumbnails` bucket
 * via the existing uploadImage() function so it goes through Sharp
 * optimization (converted to WebP, resized if needed).
 *
 * @param videoBuffer  The raw video file as a Buffer
 * @param originalName Original filename (used to derive the thumbnail key)
 * @param userId       Optional user ID for the upload service
 * @returns The public URL of the uploaded thumbnail, or null if extraction failed
 */
export async function extractVideoThumbnail(
  videoBuffer: Buffer,
  originalName: string,
  userId?: number,
): Promise<string | null> {
  // Create temp files for FFmpeg processing
  const tempDir = process.env.TEMP_DIR || '/tmp';
  const inputExt = path.extname(originalName) || '.mp4';
  const inputPath = path.join(tempDir, `video-thumb-input-${Date.now()}${inputExt}`);
  const outputPath = path.join(tempDir, `video-thumb-output-${Date.now()}.jpg`);

  let inputWritten = false;
  let outputExists = false;

  try {
    // Write video buffer to temp input file
    await fs.writeFile(inputPath, videoBuffer);
    inputWritten = true;

    // Extract frame at 1 second mark
    // -y: overwrite output without asking
    // -ss: seek to position (before input for faster seeking)
    // -i: input file
    // -vframes 1: extract only one frame
    // -q:v 2: quality (2 = high quality JPEG)
    const cmd = [
      `${FFMPEG_PATH} -y`,
      '-ss 00:00:01',
      `-i "${inputPath}"`,
      '-vframes 1',
      '-q:v 2',
      `"${outputPath}"`,
    ].join(' ');

    await execAsync(cmd, { timeout: 60000 }); // 60s timeout for thumbnail extraction
    outputExists = true;

    // Read the extracted thumbnail
    const thumbnailBuffer = await fs.readFile(outputPath);

    // Upload via Sharp optimization (converts to WebP)
    const input: UploadInput = {
      buffer: thumbnailBuffer,
      originalName: `${path.basename(originalName, inputExt)}-thumbnail.jpg`,
      mimetype: 'image/jpeg',
      size: thumbnailBuffer.length,
    };

    const result = await uploadImage(input, 'images/thumbnails', { userId });
    logger.info(`[video] thumbnail extracted: ${result.url}`);

    return result.url;
  } catch (err) {
    // FFmpeg extraction failed — this is non-fatal for the upload.
    // The video still uploads successfully, just without a thumbnail.
    logger.warn('[video] thumbnail extraction failed (non-fatal)', {
      error: err instanceof Error ? err.message : String(err),
      originalName,
    });
    return null;
  } finally {
    // Clean up temp files
    try {
      if (inputWritten) await fs.unlink(inputPath);
    } catch { /* ignore cleanup errors */ }
    try {
      if (outputExists) await fs.unlink(outputPath);
    } catch { /* ignore cleanup errors */ }
  }
}

/**
 * Extract a thumbnail from a video that is NOT in memory — used by the
 * presigned direct-to-R2 upload path, where the server never sees the file
 * body. FFmpeg reads the (signed) HTTP URL directly and, thanks to Range
 * requests, only fetches the bytes it needs for the first frame.
 *
 * Runs via execFile (no shell) so signed-URL query strings can't be
 * interpreted by a shell. Same non-fatal semantics as extractVideoThumbnail.
 */
export async function extractVideoThumbnailFromUrl(
  videoUrl: string,
  originalName: string,
  userId?: number,
): Promise<string | null> {
  const tempDir = process.env.TEMP_DIR || '/tmp';
  const outputPath = path.join(
    tempDir,
    `video-thumb-output-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`,
  );
  let outputExists = false;

  try {
    await execFileAsync(
      FFMPEG_PATH,
      ['-y', '-ss', '00:00:01', '-i', videoUrl, '-vframes', '1', '-q:v', '2', outputPath],
      { timeout: 60000 },
    );
    outputExists = true;

    const thumbnailBuffer = await fs.readFile(outputPath);
    const inputExt = path.extname(originalName) || '.mp4';
    const input: UploadInput = {
      buffer: thumbnailBuffer,
      originalName: `${path.basename(originalName, inputExt)}-thumbnail.jpg`,
      mimetype: 'image/jpeg',
      size: thumbnailBuffer.length,
    };
    const result = await uploadImage(input, 'images/thumbnails', { userId });
    logger.info(`[video] thumbnail extracted from URL: ${result.url}`);
    return result.url;
  } catch (err) {
    logger.warn('[video] URL thumbnail extraction failed (non-fatal)', {
      error: err instanceof Error ? err.message : String(err),
      originalName,
    });
    return null;
  } finally {
    try {
      if (outputExists) await fs.unlink(outputPath);
    } catch { /* ignore cleanup errors */ }
  }
}

/**
 * Check if FFmpeg is available and can extract thumbnails.
 * Returns true if the ffmpeg binary is functional.
 */
export async function isVideoThumbnailingAvailable(): Promise<boolean> {
  try {
    await execAsync(`${FFMPEG_PATH} -version`, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
