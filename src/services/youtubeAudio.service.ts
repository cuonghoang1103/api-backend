/**
 * ============================================================
 * YouTube → R2 audio extraction
 *
 * Downloads the best audio stream of a YouTube video with
 * `yt-dlp`, transcodes it to mp3 with ffmpeg, and uploads the
 * result to Cloudflare R2 via the shared uploadAudio() pipeline.
 *
 * Why: tracks played through the YouTube IFrame cannot play in the
 * background / with the screen locked on mobile (browser suspends
 * the iframe). Once a track is stored on R2 as a real mp3 it plays
 * through the <audio> element (MediaSession + background), like
 * Spotify. See `MusicAudioController` + `getMediaUrl`.
 *
 * Runtime deps (Dockerfile.backend runner stage):
 *   - `yt-dlp`  (self-contained linux binary, no python needed)
 *   - `ffmpeg`  (already installed for loudnorm)
 *
 * NOTE: downloading YouTube audio is against YouTube's ToS — this
 * is an admin-only, personal-use feature (see requireRole on the route).
 * ============================================================
 */

import { execFile } from 'child_process';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { uploadAudio, uploadImage } from '../storage/uploadService.js';
import { assertPublicHost } from './hub.service.js';

const execFileAsync = promisify(execFile);

const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';

// Only ONE extraction runs at a time. yt-dlp + ffmpeg together are
// memory/CPU heavy and the backend container is capped at 1GB — two
// parallel runs can OOM it. A second concurrent request fails fast
// with 409 instead of racing.
let extractionInProgress = false;

export class YoutubeAudioError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(message: string, code: string, status = 502) {
    super(message);
    this.name = 'YoutubeAudioError';
    this.code = code;
    this.status = status;
  }
}

export interface ExtractResult {
  key: string;
  url: string;
  size: number;
}

/**
 * Fetch a remote image (e.g. the YouTube thumbnail stored as the track's
 * coverImage) and copy it to R2 via the shared image pipeline, so the
 * downloaded track is fully self-contained (its cover no longer depends
 * on YouTube's CDN). Best-effort: returns the R2 CDN url, or null on any
 * failure — the caller keeps the original cover url in that case.
 */
export async function downloadImageToR2(
  imageUrl: string,
  options: { userId?: number } = {},
): Promise<string | null> {
  if (!imageUrl || !/^https?:\/\//.test(imageUrl)) return null;
  try {
    // SSRF guard: block internal hostnames / private-IP targets before
    // fetching an admin-supplied cover url (mirrors hub.service's importer).
    // Without it, a cover like http://169.254.169.254/... would hit internal
    // metadata endpoints from the server.
    let parsedHost: string;
    try {
      parsedHost = new URL(imageUrl).hostname;
    } catch {
      return null;
    }
    await assertPublicHost(parsedHost);
    const resp = await fetch(imageUrl, { redirect: 'error', signal: AbortSignal.timeout(15_000) });
    if (!resp.ok) return null;
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length === 0) return null;
    const mimetype = resp.headers.get('content-type') || 'image/jpeg';
    const stored = await uploadImage(
      { buffer, originalName: 'cover.jpg', mimetype, size: buffer.length },
      'images/playlist-covers',
      { userId: options.userId },
    );
    return stored.url;
  } catch (e) {
    logger.warn(`[ytdl] cover copy failed for ${imageUrl}: ${(e as Error).message}`);
    return null;
  }
}

/**
 * Extract a YouTube video's audio to R2 as mp3.
 * Throws YoutubeAudioError (with an HTTP status) on any failure.
 */
export async function extractYoutubeAudioToR2(
  youtubeUrl: string,
  options: { userId?: number } = {},
): Promise<ExtractResult> {
  if (!youtubeUrl || !/^https?:\/\//.test(youtubeUrl)) {
    throw new YoutubeAudioError('Track không có URL YouTube hợp lệ.', 'BAD_URL', 400);
  }
  if (extractionInProgress) {
    throw new YoutubeAudioError(
      'Đang tải một bài khác về, vui lòng đợi xong rồi thử lại.',
      'BUSY',
      409,
    );
  }
  extractionInProgress = true;

  const tmpBase = path.join(os.tmpdir(), `ytdl-${Date.now()}-${randomBytes(4).toString('hex')}`);
  const outTemplate = `${tmpBase}.%(ext)s`;
  const expectedMp3 = `${tmpBase}.mp3`;

  try {
    // Only pass --ffmpeg-location when it's a real absolute path. yt-dlp
    // treats a bare name like "ffmpeg" as a filesystem path, warns
    // "ffmpeg-location ffmpeg does not exist" and then runs WITHOUT ffmpeg
    // (so the mp3 transcode silently never happens). When FFMPEG_PATH is
    // empty/relative we omit the flag and let yt-dlp auto-detect ffmpeg
    // from PATH (/usr/bin/ffmpeg in the container).
    const ffmpegArgs = FFMPEG_PATH.startsWith('/') ? ['--ffmpeg-location', FFMPEG_PATH] : [];

    // bestaudio → mp3. yt-dlp shells out to ffmpeg for the transcode.
    // --js-runtimes node: YouTube now requires an external JS runtime to
    // solve the player signature; without one yt-dlp falls back to a
    // limited client and many videos 403. The backend image is node-based,
    // so we point yt-dlp at the node binary already in PATH.
    await execFileAsync(
      YT_DLP_PATH,
      [
        '--js-runtimes', 'node',
        '-f', 'bestaudio/best',
        '-x', '--audio-format', 'mp3', '--audio-quality', '0',
        '--no-playlist',
        '--no-progress',
        ...ffmpegArgs,
        '-o', outTemplate,
        youtubeUrl,
      ],
      { timeout: 150_000, maxBuffer: 16 * 1024 * 1024 },
    );

    let buffer: Buffer;
    try {
      buffer = await fs.readFile(expectedMp3);
    } catch {
      throw new YoutubeAudioError(
        'Không trích xuất được audio (yt-dlp không tạo ra file).',
        'NO_OUTPUT',
        502,
      );
    }
    if (buffer.length === 0) {
      throw new YoutubeAudioError('File audio trích xuất bị rỗng.', 'EMPTY', 502);
    }
    if (buffer.length > config.maxFileSizeAudio) {
      throw new YoutubeAudioError(
        `Audio quá lớn để lưu (giới hạn ${Math.round(config.maxFileSizeAudio / 1024 / 1024)}MB).`,
        'TOO_LARGE',
        413,
      );
    }

    const stored = await uploadAudio(
      {
        buffer,
        originalName: `${path.basename(tmpBase)}.mp3`,
        mimetype: 'audio/mpeg',
        size: buffer.length,
      },
      { userId: options.userId, kind: 'songs' },
    );

    logger.info(`[ytdl] extracted ${youtubeUrl} → R2 ${stored.key} (${buffer.length}B)`);
    return { key: stored.key, url: stored.url, size: stored.size };
  } catch (err) {
    if (err instanceof YoutubeAudioError) throw err;
    const msg = (err as Error)?.message || String(err);
    logger.warn(`[ytdl] extraction failed for ${youtubeUrl}: ${msg}`);
    // yt-dlp exits non-zero on age-gate / bot-check / removed video /
    // outdated extractor. Surface a friendly, non-destructive error.
    throw new YoutubeAudioError(
      'Tải audio từ YouTube thất bại (video có thể bị chặn/riêng tư, hoặc yt-dlp cần cập nhật).',
      'EXTRACT_FAILED',
      502,
    );
  } finally {
    extractionInProgress = false;
    // Best-effort temp cleanup (mp3 + any pre-transcode leftovers).
    const junk = [expectedMp3, ...['webm', 'm4a', 'opus', 'part', 'mp3.part'].map((e) => `${tmpBase}.${e}`)];
    await Promise.allSettled(junk.map((f) => fs.unlink(f)));
  }
}
