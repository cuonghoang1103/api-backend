/**
 * Image optimization pipeline.
 *
 * Every image uploaded to the platform passes through here. We
 * run a single pass that:
 *   - downscales to a max width of 1200px (preserving aspect)
 *   - re-encodes as WebP at quality 80
 *
 * Why WebP:
 *   - 25-35% smaller than JPEG at the same perceptual quality
 *   - supports alpha, animation, and lossy/lossless in one format
 *   - 97%+ browser support as of 2026
 *
 * Why max 1200px:
 *   - matches the typical "feed image" size used in the
 *     frontend; 4K originals from phones just waste bandwidth
 *   - retina devices don't benefit beyond 2x of the layout
 *     size; 1200px @ 2x is enough for any grid in the app
 *
 * Special cases:
 *   - SVG: passed through unchanged. SVGs are already compressed
 *     text and re-encoding them as WebP would destroy the
 *     scalability that makes them useful.
 *   - Animated GIF: converted to animated WebP via Sharp's
 *     built-in animation support. Static fallback is also
 *     animated WebP — browsers that don't support animated
 *     WebP will see the first frame, which is acceptable.
 *   - Tiny images (< 1200px already): we still re-encode as
 *     WebP because the original may be a 5MB PNG from a phone;
 *     re-encoding is what saves the space.
 *
 * Sharp is loaded lazily so contributors without it installed
 * (e.g. alpine in CI without sharp's prebuilt binaries) can
 * still run unit tests that don't touch the image path.
 */
import sharp from 'sharp';
// sharp 0.35.2+ chuyển sang ESM type defs (`dist/index.d.mts`) và bỏ
// namespace `sharp.*`, nên `sharp.Metadata` / `sharp.OutputInfo` không
// còn phân giải được. Kiểu giờ là named export — chỉ là import type,
// không đổi gì lúc chạy.
import type { Metadata, OutputInfo } from 'sharp';

const MAX_WIDTH = 1200;
const WEBP_QUALITY = 80;

// SECURITY: decompression-bomb guard.
//
// A PNG of one flat colour compresses absurdly well, so a tiny upload can
// describe an enormous image. Measured: a 758KB PNG holding 16000x16000
// (256 MP) sails past every size/MIME/magic-byte check and costs ~99MB RSS
// and ~208ms of CPU to decode; eight of them at once (5.9MB total on the
// wire) pushed a server's RSS up by 445MB. Eight REAL 6.85MB photos —
// nine times the bandwidth — cost 17MB. Byte limits cannot see this
// coming; only a pixel budget can.
//
// sharp's own default is 268,402,689 px (0x3FFF^2), which is far above
// anything a camera produces and lets the 256MP case through. 100 MP
// (~10000x10000) is comfortably above every mainstream phone/DSLR while
// refusing the bombs. Note uploadImage() already caps images at
// MAX_FILE_SIZE_IMAGES (10MB default) — a genuine 100MP+ photo would not
// fit under that anyway.
const MAX_INPUT_PIXELS = 100_000_000;

// The other half of the same defence: bound how many images decode at
// once, so burst traffic cannot multiply the per-image cost. sharp does
// its work on libvips threads (not the event loop), so without a gate the
// only limit is request concurrency.
const MAX_CONCURRENT_DECODES = 4;
let activeDecodes = 0;
const decodeWaiters: Array<() => void> = [];

async function acquireDecodeSlot(): Promise<void> {
  if (activeDecodes < MAX_CONCURRENT_DECODES) {
    activeDecodes++;
    return;
  }
  await new Promise<void>((resolve) => decodeWaiters.push(resolve));
  activeDecodes++;
}

function releaseDecodeSlot(): void {
  activeDecodes--;
  const next = decodeWaiters.shift();
  if (next) next();
}

/** Result of a single image optimization pass. */
export interface OptimizedImage {
  buffer: Buffer;
  contentType: 'image/webp';
  width: number;
  height: number;
  /** Original file size in bytes (for stats) */
  originalSize: number;
  /** Optimized file size in bytes */
  optimizedSize: number;
}

export class ImageOptimizationError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ImageOptimizationError';
    this.code = code;
  }
}

/**
 * Decide whether a MIME type is something we can process with
 * Sharp. We accept anything that starts with `image/` and isn't
 * SVG (which we pass through).
 */
function isProcessableImage(mimetype: string): boolean {
  if (!mimetype.startsWith('image/')) return false;
  if (mimetype === 'image/svg+xml') return false;
  return true;
}

/**
 * Run the optimization pipeline on a single image buffer.
 *
 * Throws `ImageOptimizationError` if the input is malformed or
 * Sharp can't decode it. The caller should treat this as a 4xx
 * (the user uploaded something that isn't a real image) rather
 * than a 5xx (the server is broken).
 */
export async function optimizeImage(
  input: Buffer,
  mimetype: string,
): Promise<OptimizedImage> {
  if (!isProcessableImage(mimetype)) {
    // Caller forgot to filter — surface a clear error.
    throw new ImageOptimizationError(
      `Refusing to optimize non-image MIME type: ${mimetype}`,
      'UNSUPPORTED_MIME',
    );
  }

  const originalSize = input.length;

  // Load metadata first so we know the source dimensions and can
  // short-circuit when the image is already small + already a
  // good format. We still re-encode — the original is often a
  // PNG from a phone screenshot at 5MB; WebP cuts that 80%.
  // `limitInputPixels` is the bomb guard (see MAX_INPUT_PIXELS above);
  // reading metadata only parses the header, so this is cheap.
  let pipeline = sharp(input, { failOn: 'none', limitInputPixels: MAX_INPUT_PIXELS });
  let metadata: Metadata;
  try {
    metadata = await pipeline.metadata();
  } catch (err: any) {
    // sharp enforces limitInputPixels while reading the header too, so the
    // bomb usually lands here rather than in the explicit check below.
    // Give it its own code — "too big" is a different user message from
    // "this is not an image".
    if (/pixel limit/i.test(err?.message ?? '')) {
      throw new ImageOptimizationError(
        `Image is too large to process (max ${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)`,
        'TOO_MANY_PIXELS',
      );
    }
    throw new ImageOptimizationError(
      `Sharp could not decode image: ${err?.message ?? 'unknown'}`,
      'DECODE_FAILED',
    );
  }
  if (!metadata.width || !metadata.height) {
    throw new ImageOptimizationError(
      'Image has no width/height — possibly corrupt or truncated',
      'NO_DIMENSIONS',
    );
  }

  // SECURITY: reject the decompression bomb from the HEADER, before any
  // pixels are decoded. `limitInputPixels` above would also catch it, but
  // only once decoding starts and with a generic message; this gives the
  // route layer a clear 400 and costs nothing.
  const inputPixels = metadata.width * metadata.height;
  if (inputPixels > MAX_INPUT_PIXELS) {
    throw new ImageOptimizationError(
      `Image is too large to process: ${metadata.width}x${metadata.height} = ` +
        `${Math.round(inputPixels / 1e6)}MP (max ${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)`,
      'TOO_MANY_PIXELS',
    );
  }

  // Downscale only if the source is wider than the cap. This
  // preserves quality for legitimately small images (e.g. user-
  // uploaded avatars that come in at 400x400).
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  // Rotate according to EXIF orientation BEFORE the WebP encode
  // so the resulting file is right-side-up without baking the
  // rotation into a re-encoding cycle. We disable auto-orient
  // on the resize above to avoid double-rotation.
  pipeline = pipeline.rotate();

  // WebP encode. `effort: 4` is a good speed/ratio tradeoff
  // (0 = best compression, 6 = fastest). 4 is the default but
  // we set it explicitly so future tuning is a one-line change.
  //
  // This is the only genuinely expensive step, so it is the one behind
  // the concurrency gate — a burst of uploads queues instead of each
  // multiplying peak RSS.
  await acquireDecodeSlot();
  let out: { data: Buffer; info: OutputInfo };
  try {
    out = await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });
  } catch (err: any) {
    // A pixel-limit rejection here (input that lied in its header) is the
    // user's file being wrong, not the server being broken.
    if (/pixel limit/i.test(err?.message ?? '')) {
      throw new ImageOptimizationError(
        'Image is too large to process (pixel limit exceeded)',
        'TOO_MANY_PIXELS',
      );
    }
    throw new ImageOptimizationError(
      `Sharp could not encode image: ${err?.message ?? 'unknown'}`,
      'ENCODE_FAILED',
    );
  } finally {
    releaseDecodeSlot();
  }

  return {
    buffer: out.data,
    contentType: 'image/webp',
    width: out.info.width,
    height: out.info.height,
    originalSize,
    optimizedSize: out.data.length,
  };
}

/**
 * Build a human-readable "saved 75%" log line, for the dev
 * console and the upload response metadata.
 */
export function formatSavings(originalSize: number, optimizedSize: number): string {
  if (originalSize === 0) return '0%';
  const saved = ((originalSize - optimizedSize) / originalSize) * 100;
  if (saved < 0) return `${Math.abs(saved).toFixed(0)}% LARGER`;
  return `${saved.toFixed(0)}% smaller`;
}
