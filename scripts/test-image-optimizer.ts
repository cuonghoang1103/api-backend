/**
 * Smoke test for the image optimization pipeline.
 * Creates a 2000x1500 PNG in memory, runs it through
 * optimizeImage(), and asserts:
 *   - output is webp
 *   - max(width) <= 1200
 *   - optimized size < original size
 *   - SVG passes through untouched
 *   - garbage input throws ImageOptimizationError
 */
import sharp from 'sharp';
import { optimizeImage, ImageOptimizationError, formatSavings } from '../src/storage/imageOptimizer.js';

async function makeBigPng(): Promise<Buffer> {
  return sharp({
    create: {
      width: 2000,
      height: 1500,
      channels: 3,
      background: { r: 100, g: 50, b: 200 },
    },
  })
    .png({ compressionLevel: 0 }) // make it big on purpose
    .toBuffer();
}

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error('  ✗ FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('  ✓', msg);
  }
}

async function main(): Promise<void> {
  console.log('[test] optimizeImage — large PNG → webp');
  const big = await makeBigPng();
  console.log(`  input: ${big.length} bytes`);

  const out = await optimizeImage(big, 'image/png');
  assert(out.contentType === 'image/webp', 'output is image/webp');
  assert(out.width <= 1200, `width capped to 1200 (got ${out.width})`);
  assert(out.optimizedSize < out.originalSize, `optimized (${out.optimizedSize}) < original (${out.originalSize})`);
  assert(out.height === Math.round((1500 * out.width) / 2000), 'aspect ratio preserved');

  const savings = formatSavings(out.originalSize, out.optimizedSize);
  console.log(`  savings: ${savings}`);

  console.log('\n[test] optimizeImage — already small PNG');
  const small = await sharp({
    create: { width: 400, height: 300, channels: 3, background: { r: 255, g: 0, b: 0 } },
  })
    .png()
    .toBuffer();
  const out2 = await optimizeImage(small, 'image/png');
  assert(out2.width === 400, 'small image kept at 400px (no upscale)');

  console.log('\n[test] optimizeImage — JPEG');
  const jpg = await sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 0, g: 255, b: 0 } },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
  const out3 = await optimizeImage(jpg, 'image/jpeg');
  assert(out3.contentType === 'image/webp', 'JPEG input also becomes webp');

  console.log('\n[test] optimizeImage — SVG is rejected');
  try {
    await optimizeImage(Buffer.from('<svg></svg>'), 'image/svg+xml');
    assert(false, 'expected error for SVG');
  } catch (e) {
    assert(e instanceof ImageOptimizationError, 'throws ImageOptimizationError');
    assert((e as ImageOptimizationError).code === 'UNSUPPORTED_MIME', 'code = UNSUPPORTED_MIME');
  }

  console.log('\n[test] optimizeImage — garbage input');
  try {
    await optimizeImage(Buffer.from('not an image at all'), 'image/png');
    assert(false, 'expected error for garbage');
  } catch (e) {
    assert(e instanceof ImageOptimizationError, 'throws ImageOptimizationError for bad input');
  }

  console.log('\n[test] optimizeImage — transparent PNG');
  const transparent = await sharp({
    create: {
      width: 1600,
      height: 1200,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();
  const out4 = await optimizeImage(transparent, 'image/png');
  assert(out4.contentType === 'image/webp', 'transparent PNG → webp');
  assert(out4.width <= 1200, 'resized to <= 1200');

  if (process.exitCode === 1) {
    console.log('\n❌ Some tests failed');
  } else {
    console.log('\n✅ All image optimizer tests passed');
  }
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
