/**
 * ============================================================
 * Simulation studio — WebM → MP4 conversion
 * ============================================================
 *
 * Endpoints:
 *   POST /api/v1/simulation/convert-mp4   — upload .webm, get .mp4 back
 *
 * Why this exists:
 *   The record button on /simulation uses MediaRecorder, and Chrome can
 *   only emit WebM (VP8/VP9 + Opus). That file is awkward everywhere the
 *   recording is actually wanted: QuickTime won't open it, iOS Safari
 *   often won't play it, and most editors and upload targets expect H.264.
 *   Users kept ending up with a file they could not use.
 *
 *   The browser cannot fix this itself. ffmpeg.wasm would have to come
 *   from a CDN, which the site's `default-src 'self'` CSP blocks, and
 *   self-hosting a ~30MB wasm build to transcode on the client is a bad
 *   trade. The backend container already ships /usr/bin/ffmpeg for the
 *   music pipeline, so a small transcode route is the cheap answer.
 *
 * Cost control — transcoding is the most CPU-hungry thing this API does,
 * and the VPS has 4 cores shared with everything else:
 *   - authenticated users only, so it is never an open transcoding farm;
 *   - one conversion at a time process-wide (a second caller gets 429);
 *   - hard caps on upload size and on ffmpeg wall-clock time;
 *   - `-preset veryfast`: this is an interactive request, not a batch job.
 *     Batch lesson videos are rendered frame-by-frame by
 *     `scripts/sim-render.mjs`, which encodes at a much better preset
 *     because nobody is waiting on it.
 */

import { Router, type Response } from 'express';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import os from 'os';
import path from 'path';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';

/** A 1080p screen recording of the studio runs ~18 MB/minute; 300 MB is ~15 minutes. */
const MAX_UPLOAD_BYTES = 300 * 1024 * 1024;
/** Wall-clock ceiling. veryfast on 1080p runs far faster than realtime. */
const FFMPEG_TIMEOUT_MS = 8 * 60 * 1000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
});

/**
 * Exactly one transcode at a time, process-wide.
 *
 * Two concurrent 1080p transcodes on a 4-core VPS make every other request
 * slow, which is worse than telling the second caller to wait a moment.
 */
let busy = false;

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_PATH, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new AppError('Conversion timed out', 504, 'FFMPEG_TIMEOUT'));
    }, FFMPEG_TIMEOUT_MS);

    proc.stderr.on('data', (d) => {
      // Keep only the tail: ffmpeg is chatty and the useful error is last.
      stderr = (stderr + d.toString()).slice(-4000);
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(new AppError(`ffmpeg unavailable: ${err.message}`, 500, 'FFMPEG_MISSING'));
    });
    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve();
      logger.error('simulation convert-mp4 ffmpeg failed', { code, stderr });
      reject(new AppError('Conversion failed', 422, 'FFMPEG_FAILED'));
    });
  });
}

router.post(
  '/convert-mp4',
  authenticate,
  upload.single('file'),
  async (req, res: Response<ApiResponse | Buffer>, next) => {
    const work = path.join(os.tmpdir(), `sim-convert-${randomUUID()}`);
    let acquired = false;

    try {
      if (!req.file?.buffer?.length) {
        throw new AppError('No file uploaded', 400, 'NO_FILE');
      }
      // Trust the bytes, not the name: MediaRecorder always produces a
      // Matroska/WebM container, whose EBML magic is 1A 45 DF A3.
      const magic = req.file.buffer.subarray(0, 4);
      const isMatroska = magic[0] === 0x1a && magic[1] === 0x45 && magic[2] === 0xdf && magic[3] === 0xa3;
      if (!isMatroska) {
        throw new AppError('Only WebM/Matroska recordings can be converted', 400, 'INVALID_CONTAINER');
      }
      if (busy) {
        throw new AppError('Another conversion is running — try again in a moment', 429, 'CONVERT_BUSY');
      }
      busy = true;
      acquired = true;

      await fs.mkdir(work, { recursive: true });
      const inPath = path.join(work, 'in.webm');
      const outPath = path.join(work, 'out.mp4');
      await fs.writeFile(inPath, req.file.buffer);

      // Frame rate of the source recording, sent by the client (it knows its
      // own quality preset). Clamped, because it arrives from the browser.
      const rawFps = Number(req.body?.fps);
      const fps = Number.isFinite(rawFps) && rawFps >= 1 && rawFps <= 60 ? Math.round(rawFps) : 30;

      await runFfmpeg([
        '-y', '-loglevel', 'error',
        '-i', inPath,
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
        // yuv420p is what makes the file playable in QuickTime and on iOS;
        // MediaRecorder's VP9 output is often yuv420p already, but a
        // recording made on another device may not be.
        '-pix_fmt', 'yuv420p',
        // MediaRecorder writes a variable frame rate stream with no duration
        // in the header. Forcing CFR keeps players from showing a wrong
        // length or refusing to seek — at the recording's OWN rate, so a
        // 60fps capture does not get halved on the way out.
        '-vsync', 'cfr', '-r', String(fps),
        // Fill gaps in the audio timeline with silence.
        //
        // A Web Audio capture can arrive with holes in it (the studio had
        // exactly that bug: the destination node stopped emitting while the
        // graph was idle). Without this filter ffmpeg simply CONCATENATES the
        // surviving packets, so every sound after the first hole plays early
        // and the tail runs out before the picture does — measured on a real
        // 20s recording: 9.7s of audio stretched over a 20s video, drifting
        // further out of sync with every gap. `min_hard_comp=0.100` makes it
        // insert real silence once drift passes 100ms instead of resampling.
        // The source bug is fixed, but old recordings and any future hiccup
        // must not silently produce a desynced download.
        '-af', 'aresample=async=1:min_hard_comp=0.100:first_pts=0',
        '-c:a', 'aac', '-b:a', '160k',
        '-movflags', '+faststart',
        outPath,
      ]);

      const stat = await fs.stat(outPath);
      const base = String(req.body?.name || 'simulation')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'simulation';

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Length', String(stat.size));
      res.setHeader('Content-Disposition', `attachment; filename="${base}.mp4"`);

      // Stream it out, then clean up once the response is finished either
      // way — a client that closes the tab mid-download must not leak the
      // temp directory.
      const stream = createReadStream(outPath);
      const cleanup = () => {
        busy = false;
        void fs.rm(work, { recursive: true, force: true });
      };
      res.on('close', cleanup);
      res.on('finish', cleanup);
      acquired = false; // ownership handed to the cleanup handler
      stream.pipe(res);
    } catch (error) {
      if (acquired) busy = false;
      await fs.rm(work, { recursive: true, force: true }).catch(() => {});
      next(error);
    }
  },
);

export default router;
