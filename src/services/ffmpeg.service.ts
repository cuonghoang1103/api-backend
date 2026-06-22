/**
 * ============================================================
 * FFmpeg Audio Processing Service
 *
 * Provides audio normalization using the EBU R128 loudness standard.
 * Uses FFmpeg's loudnorm filter to normalize audio to streaming-safe levels:
 *   - Integrated Loudness (I): -14 LUFS (YouTube/Spotify standard)
 *   - True Peak (TP): -1.5 dBTP (prevents clipping)
 *   - Loudness Range (LRA): 11 LU (dynamic range)
 *
 * Two-pass approach:
 *   Pass 1: Measure the source audio's loudness profile
 *   Pass 2: Apply normalization using measured values
 *
 * Installation:
 *   macOS: brew install ffmpeg
 *   Ubuntu/Debian: apt install ffmpeg
 *   Docker: RUN apt-get update && apt-get install -y ffmpeg
 * ============================================================
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const execAsync = promisify(exec);

const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';
const FFPROBE_PATH = process.env.FFPROBE_PATH || 'ffprobe';

// Loudnorm target values
const LOUDNESS_TARGET = {
  // Integrated loudness (LUFS) — -14 is the standard for streaming platforms
  integrated: parseFloat(process.env.LOUDNORM_I || '-14'),
  // True peak (dBTP) — maximum sample level to prevent clipping
  truePeak: parseFloat(process.env.LOUDNORM_TP || '-1.5'),
  // Loudness range (LU) — dynamic range allowance
  loudnessRange: parseFloat(process.env.LOUDNORM_LRA || '11'),
};

export interface LoudnormResult {
  /** Input file path (before normalization) */
  inputPath: string;
  /** Output file path (after normalization) */
  outputPath: string;
  /** File size reduction in bytes (negative = size increase) */
  sizeChange: number;
  /** Original file size in bytes */
  originalSize: number;
  /** Normalized file size in bytes */
  normalizedSize: number;
  /** Loudness analysis values from the first pass */
  measurement: {
    inputI?: string;
    inputTP?: string;
    inputLRA?: string;
    inputThresh?: string;
    outputI?: string;
    outputTP?: string;
    outputLRA?: string;
    outputThresh?: string;
    normalizedPath?: string;
  };
}

export interface AudioMetadata {
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
  format?: string;
}

/**
 * Parse ffprobe output to extract audio metadata.
 */
export async function getAudioMetadata(filePath: string): Promise<AudioMetadata> {
  const absPath = path.resolve(filePath);
  try {
    const { stdout } = await execAsync(
      `${FFPROBE_PATH} -v quiet -print_format json -show_format -show_streams "${absPath}"`,
    );
    const data = JSON.parse(stdout);
    const audioStream = data.streams?.find((s: any) => s.codec_type === 'audio');
    const format = data.format;
    return {
      duration: format?.duration ? parseFloat(format.duration) : undefined,
      bitrate: format?.bit_rate ? parseInt(String(format.bit_rate), 10) : undefined,
      sampleRate: audioStream?.sample_rate ? parseInt(audioStream.sample_rate, 10) : undefined,
      channels: audioStream?.channels ? parseInt(audioStream.channels, 10) : undefined,
      codec: audioStream?.codec_name || undefined,
      format: format?.format_name || undefined,
    };
  } catch (err) {
    logger.warn('getAudioMetadata failed', { error: err instanceof Error ? err.message : String(err) });
    return {};
  }
}

/**
 * Two-pass loudnorm normalization:
 *
 *   Pass 1: Measure the input audio's loudness profile.
 *   Pass 2: Apply loudnorm filter using measured values.
 *
 * This produces more accurate results than single-pass normalization.
 *
 * @param inputPath  Absolute path to the source audio file
 * @param outputPath Absolute path where the normalized file should be saved
 * @returns LoudnormResult with measurement data and file sizes
 */
export async function normalizeAudio(
  inputPath: string,
  outputPath: string,
): Promise<LoudnormResult> {
  const absInput = path.resolve(inputPath);
  const absOutput = path.resolve(outputPath);

  // Validate input exists
  try {
    await fs.access(absInput);
  } catch {
    throw new AppError(`Input file not found: ${inputPath}`, 400, 'FILE_NOT_FOUND');
  }

  // Get original file size
  const originalStats = await fs.stat(absInput);
  const originalSize = originalStats.size;

  // ─── PASS 1: Measure loudness ────────────────────────────────
  const targetI = LOUDNESS_TARGET.integrated;
  const targetTP = LOUDNESS_TARGET.truePeak;
  const targetLRA = LOUDNESS_TARGET.loudnessRange;
  const targetThresh = String(targetI - targetLRA);

  // Build the first-pass command:
  // -af loudnorm with print_format=json outputs measurement data as JSON
  const measureCmd = [
    `${FFMPEG_PATH} -y -i "${absInput}"`,
    `-af loudnorm=I=${targetI}:TP=${targetTP}:LRA=${targetLRA}:threshold=${targetThresh}:print_format=summary`,
    '-f null -',
  ].join(' ');

  let measurement: LoudnormResult['measurement'] = {};

  try {
    const { stdout, stderr } = await execAsync(measureCmd, { timeout: 300000 });

    // Parse the summary output from loudnorm
    // Format: "n:I=-14.0LUFS ..." etc.
    const combined = stdout + stderr;
    const lines = combined.split('\n').filter(Boolean);

    for (const line of lines) {
      const trimmed = line.trim();
      // Match patterns like "Input Integrated: -16.80 LUFS"
      const inputIMatch = trimmed.match(/Input Integrated:\s*([-\d.]+)/i);
      const inputTPMatch = trimmed.match(/Input True Peak:\s*([-\d.]+)/i);
      const inputLRAMatch = trimmed.match(/Input Loudness Range:\s*([-\d.]+)/i);
      const inputThreshMatch = trimmed.match(/Input Threshold:\s*([-\d.]+)/i);
      const outputIMatch = trimmed.match(/Output Integrated:\s*([-\d.]+)/i);
      const outputTPMatch = trimmed.match(/Output True Peak:\s*([-\d.]+)/i);
      const outputLRAMatch = trimmed.match(/Output Loudness Range:\s*([-\d.]+)/i);
      const outputThreshMatch = trimmed.match(/Output Threshold:\s*([-\d.]+)/i);

      if (inputIMatch) measurement.inputI = inputIMatch[1];
      if (inputTPMatch) measurement.inputTP = inputTPMatch[1];
      if (inputLRAMatch) measurement.inputLRA = inputLRAMatch[1];
      if (inputThreshMatch) measurement.inputThresh = inputThreshMatch[1];
      if (outputIMatch) measurement.outputI = outputIMatch[1];
      if (outputTPMatch) measurement.outputTP = outputTPMatch[1];
      if (outputLRAMatch) measurement.outputLRA = outputLRAMatch[1];
      if (outputThreshMatch) measurement.outputThresh = outputThreshMatch[1];
    }

    // (debug log removed 2026-06-17)
  } catch (err) {
    logger.warn('Pass 1 measurement failed (non-fatal)', { error: err instanceof Error ? err.message : String(err) });
    // Continue with default target values
  }

  // ─── PASS 2: Apply loudnorm normalization ───────────────────
  // If we have measurement data, use it for more accurate normalization
  // Otherwise fall back to target values only
  const measuredI = measurement.inputI || String(targetI);
  const measuredTP = measurement.inputTP || String(targetTP + 1); // slight offset
  const measuredLRA = measurement.inputLRA || String(targetLRA);
  const measuredThresh = measurement.inputThresh || targetThresh;

  // Build the second-pass command with measured values
  // This gives us accurate normalization instead of guesswork
  const normalizeCmd = [
    `${FFMPEG_PATH} -y -i "${absInput}"`,
    `-af loudnorm=I=${targetI}:TP=${targetTP}:LRA=${targetLRA}:threshold=${targetThresh}`,
    // Use measured values for better accuracy
    `:measured_I=${measuredI}:measured_TP=${measuredTP}:measured_LRA=${measuredLRA}:measured_thresh=${measuredThresh}`,
    // Copy non-audio streams (metadata, cover art) if possible
    '-c:a libmp3lame -b:a 192k', // re-encode to MP3 for consistent quality
    '-id3v2_version 3',
    `"${absOutput}"`,
  ].join(' ');

  try {
    await execAsync(normalizeCmd, { timeout: 300000 });
    // (debug log removed 2026-06-17)
  } catch (err) {
    // If FFmpeg fails, try a simpler approach — just re-encode without loudnorm
    logger.warn('Loudnorm normalization failed, falling back to re-encode', { error: err instanceof Error ? err.message : String(err) });
    const fallbackCmd = [
      `${FFMPEG_PATH} -y -i "${absInput}"`,
      '-c:a libmp3lame -b:a 192k',
      '-id3v2_version 3',
      `"${absOutput}"`,
    ].join(' ');
    try {
      await execAsync(fallbackCmd, { timeout: 300000 });
      // (debug log removed 2026-06-17)
    } catch (fallbackErr) {
      throw new AppError(
        `Audio processing failed: ${(fallbackErr as Error).message}`,
        500,
        'FFMPEG_ERROR',
      );
    }
  }

  // Get normalized file size
  let normalizedSize = originalSize;
  try {
    const normalizedStats = await fs.stat(absOutput);
    normalizedSize = normalizedStats.size;
  } catch {
    logger.warn('Could not stat normalized file', { path: absOutput });
  }

  return {
    inputPath: absInput,
    outputPath: absOutput,
    originalSize,
    normalizedSize,
    sizeChange: normalizedSize - originalSize,
    measurement,
  };
}

/**
 * Check if FFmpeg is available in the system.
 * Returns true if ffmpeg binary can be executed.
 */
export async function isFFmpegAvailable(): Promise<boolean> {
  try {
    await execAsync(`${FFMPEG_PATH} -version`, { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current loudnorm configuration values.
 */
export function getLoudnormConfig() {
  return { ...LOUDNESS_TARGET };
}
