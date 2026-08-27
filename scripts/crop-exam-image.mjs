/**
 * crop-exam-image.mjs — clean up a raw FUOVERFLOW question screenshot before
 * uploading to R2:
 *   1. paint over the "FUOVERFLOW.COM" watermark (bottom-left corner, fixed
 *      position across the whole batch)
 *   2. trim the huge white margin down to a tight box around the real
 *      content
 *
 * Two known source layouts, auto-detected per image (sampling a pixel just
 * below the top edge, away from the left accent bar):
 *   - "banner" layout (blue "MULTIPLE CHOICE" bar spans the full width) —
 *     trimming the whole image in one pass would keep the full width
 *     because of that bar, so the banner strip is trimmed separately from
 *     the body below it, then the two are re-stacked at the body's width.
 *   - "plain" layout (e.g. two-column "Question: N" sidebar, no banner) —
 *     trimmed directly as a single region.
 * Auto-detection matters: hard-coding the banner-layout logic for every
 * image previously truncated the RIGHT edge of "plain" layout questions
 * (their content isn't bounded by a full-width bar, so the banner-split
 * math silently cut into real text — caught 07/08 on Đề 5 FA25-RE).
 *
 * Also fixed: the body crop now uses the TRIMMED buffer directly instead of
 * re-extracting from the original at left:0 — re-extracting assumed trim()
 * never shifts the left edge, which cut off the right edge by however much
 * got trimmed on the left whenever that assumption was wrong.
 *
 *   node scripts/crop-exam-image.mjs --dir <thư mục qN.png> [--out <thư mục ra, mặc định ghi đè>]
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const DIR = val('--dir');
const OUT_DIR = val('--out') || DIR;
if (!DIR) { console.error('cần --dir <thư mục chứa qN.png>'); process.exit(1); }
fs.mkdirSync(OUT_DIR, { recursive: true });

const WATERMARK_W = 200;
const WATERMARK_H = 100;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function whiteOutWatermark(img, height) {
  const rect = await sharp({ create: { width: WATERMARK_W, height: WATERMARK_H, channels: 4, background: WHITE } }).png().toBuffer();
  return img.composite([{ input: rect, left: 0, top: Math.max(0, height - WATERMARK_H) }]).png().toBuffer();
}

async function whiteOutGhostWatermark(buf, width, height) {
  // Đề 6-10 use a different source (the "Kizspy | Question: N" / plain
  // "fuoverflow" header style) whose watermark is a big faint gray shield
  // logo + "FUOVERFLOW.COM" text placed centrally in the left column —
  // NOT confined to the fixed bottom-left rectangle whiteOutWatermark()
  // targets, so that rectangle alone misses it entirely. It renders at a
  // narrow, distinctly light gray band (empirically 196-254 — its faintest
  // strokes sit just ONE unit below pure white and were still invisible to
  // a naive raw-value skim but clearly visible when rendered/zoomed, since
  // it's a large contiguous shape rather than isolated noise; real text's
  // solid core is 0-10 and true background is exactly 255), so any near-gray
  // pixel short of pure white is safe to whiten: real glyph anti-aliasing
  // only contributes ~0.5% of pixels in this band and just gets a touch
  // crisper, not erased (checked against a known-good Đề 1 sample).
  //
  // Grayness threshold must be TIGHT (<=3, not <10): the ghost watermark's
  // pixels are true achromatic gray (r≈g≈b, max-min diff 0-2 — e.g.
  // 252,251,252). A threshold of 10 also matched Đề 1's banner background
  // tint (238,246,255 — pairwise diffs 8/9/17), which erased the ENTIRE
  // banner and broke bannerHeight detection (caught 07/08: banner branch
  // stopped triggering, image came out ~4x too wide). 3 excludes any real
  // tinted UI background while still catching genuine grayscale ghosting.
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    if (r > 180 && r < 255 && Math.abs(r - g) <= 3 && Math.abs(g - b) <= 3 && Math.abs(r - b) <= 3) {
      out[i] = 255; out[i + 1] = 255; out[i + 2] = 255;
    }
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

async function maskAccentLine(buf, width, height) {
  // Some "plain" layouts (e.g. Đề 5 FA25-RE) have thin decorative divider/
  // border lines (a colored accent bar, a gray margin rule, ...) running the
  // FULL height of the source image. sharp's trim() finds the bounding box
  // of all non-background pixels, so a line alone forces the box to span
  // the entire height even when real content ends far sooner — leaving a
  // huge dead white area below the question. Detect any column that is
  // almost entirely non-white top-to-bottom (a solid rule) — real text/
  // content columns never come close to that, since most rows in a column
  // of text are blank space between glyphs/lines — and paint those columns
  // white before computing the trim box (the box is then re-applied to the
  // ORIGINAL unmasked buffer so the lines still render, just within the
  // tight crop).
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const isWhiteish = (i) => data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245;
  const lineCols = [];
  for (let x = 0; x < width; x++) {
    let nonWhite = 0;
    for (let y = 0; y < height; y++) {
      if (!isWhiteish((y * width + x) * channels)) nonWhite++;
    }
    if (nonWhite / height > 0.9) lineCols.push(x);
  }
  if (!lineCols.length) return buf;
  const out = Buffer.from(data);
  for (const x of lineCols) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * channels;
      out[i] = 255; out[i + 1] = 255; out[i + 2] = 255;
    }
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

async function detectBannerHeight(buf, width) {
  // Some "plain" layouts have a thin (~1-2px) full-width top border rule
  // that isn't a banner at all — sampling a single pixel at y=10 (too close
  // to that border) misread it as a tiny banner, which then routed the
  // image through the banner-split branch instead of plain-trim (caught
  // 07/08 on Đề 5 FA25-RE q26: false bannerHeight=11 left the image
  // essentially uncropped). Use ROW COVERAGE instead of a single pixel, and
  // sample at y=15 to sit past that thin border: a genuine full-width
  // colored banner is still >50% covered well past y=10, while a plain
  // layout's border has already ended by y=15.
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const rowCoverage = (y) => {
    let nonWhite = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (!(data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245)) nonWhite++;
    }
    return nonWhite / width;
  };
  if (rowCoverage(15) < 0.5) return 0; // no banner — plain layout
  // banner present: walk down until the row is no longer mostly-covered
  for (let y = 15; y < 60; y++) {
    if (rowCoverage(y) < 0.5) return y;
  }
  return 34; // fallback to the known constant if detection is inconclusive
}

// Third known source layout ("red-divider"): a fixed left sidebar (site
// wordmark + progress bar + an "Answer" checkbox panel + Back/Next buttons)
// separated from the real question+options panel by a solid RED vertical
// rule, plus a yellow circular page-number badge fixed in the bottom-right
// corner. None of trim()'s existing branches handle this — the checkbox
// panel and badge sit far from the real content, so a plain bounding-box
// trim() stays close to full-canvas size (caught 24/08/2026 on SWR302
// Đề 7-26: ~12/20 decks used this layout and shipped essentially uncropped).
//
// Fix: detect the red rule (a column that's >40% strongly-red down its
// height — distinct enough that no other known layout's black/gray accent
// bars false-positive), slice everything to its right, white out the
// badge's fixed corner rectangle, then trim with a LOOSENED threshold (30,
// not the usual 10) because this template's empty panel area is filled
// light gray (~240,240,240) rather than pure white — default threshold
// treats that as real content. Finally cap the height: a stray horizontal
// footer rule sits ~500px below the real content and pins trim()'s box to
// it even at high threshold (the rule itself is dark enough to stay
// "non-white" at any reasonable threshold), so anything past a generous
// MAX_CONTENT_H is guaranteed template chrome, not text.
async function findRedDivider(buf, width, height) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  // Loosened from (r>180,g<90,b<90): some decks (SWT301 PT3 SPRING23, a
  // green-themed variant) draw a LIGHTER/pinker divider ~ (160,110,110) that the
  // strict red missed, leaving the page essentially uncropped (logo + checkbox
  // panel kept — caught 25/08/2026 on PT3-1 q16). The >40% full-height coverage
  // requirement below still rejects stray reddish text/glyphs, so this only adds
  // genuine full-height rules.
  const isRed = (i) => data[i] > 150 && data[i + 1] < 120 && data[i + 2] < 120;
  let best = { x: -1, count: 0 };
  for (let x = 0; x < width; x++) {
    let redCount = 0;
    for (let y = 0; y < height; y += 2) {
      if (isRed((y * width + x) * channels)) redCount++;
    }
    if (redCount > best.count) best = { x, count: redCount };
  }
  if (best.count / (height / 2) <= 0.4) return { x: -1, yTop: 0, yBottom: height };
  // vertical extent of the red rule → the question band top/bottom
  let yTop = height, yBottom = 0;
  for (let y = 0; y < height; y++) {
    if (isRed((y * width + best.x) * channels)) { if (y < yTop) yTop = y; if (y > yBottom) yBottom = y; }
  }
  return { x: best.x, yTop, yBottom };
}

const RED_DIVIDER_MAX_CONTENT_H = 460;

// Some red-divider scans (SWT301 SU2024/SP2025 variants) run the top progress
// bar ("There are 60 questions, and your progress of answering is …") and the
// blue site wordmark FULL-WIDTH, so they bleed into the right panel too — a
// plain right-slice keeps that strip on top of the real question (caught
// 25/08/2026 on SWT301 Đề 6/7/9/21/22: logo + "…swering is" fragment survived
// and pinned the box height to the cap). That chrome is BLUE (b clearly the
// dominant channel); the question text is near-black. Find the first row that
// carries a real run of near-black text and white out everything above it —
// on a scan with no such top strip the first dark row is already at the top,
// so nothing is removed (safe for the original SWR302 red-divider decks).
async function firstDarkTextTop(buf, width, height) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  for (let y = 0; y < Math.min(height, 300); y++) {
    let dark = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // near-black glyph pixel, and NOT blue-dominant chrome
      if (r < 110 && g < 110 && b < 110 && !(b > r + 25 && b > g + 25)) dark++;
    }
    if (dark >= 6) return y;
  }
  return 0;
}

async function cropRedDividerLayout(whited, meta) {
  const { x: redX, yTop, yBottom } = await findRedDivider(whited, meta.width, meta.height);
  if (redX < 0) return null;

  const badgeRect = await sharp({ create: { width: 220, height: 130, channels: 4, background: WHITE } }).png().toBuffer();
  const badgeWhited = await sharp(whited).composite([{ input: badgeRect, left: meta.width - 220, top: meta.height - 130 }]).png().toBuffer();

  // SPLIT variant (SWT301 FA2022 / older): the option list (A–D) sits to the
  // LEFT of the red rule and only the short stem sits to its right, so slicing
  // right-of-rule drops every option (caught 25/08/2026 on Đề 23 — 48 crops
  // showed just the stem over empty space). Distinguish it from the all-right
  // variant by the RIGHT panel: all-right holds stem+4 options (tall), split
  // holds only the stem (short). Left-panel chrome ("(Choose 1 answer)", Back/
  // Next) can be wide/tall too, so the left box alone false-positived Đề 7/21 —
  // require the right box to be SHORT as well. When split, crop the whole
  // content band [x≥105, red-rule's y-span] which holds stem + options together.
  // Discriminator: an OPTION sentence to the left of the rule spans a wide,
  // continuous run of text on a single row (≥300px); the left-panel UI chrome
  // ("(Choose 1 answer)", Back, Next) never exceeds ~150px on any row. So the
  // presence of a wide text row in x[105..redX] is a robust "split" signal that
  // doesn't false-positive on short all-right questions (which the box-size
  // heuristic did on Đề 9/21/4).
  // Skip the ~12px just inside the rule's top/bottom: a solid horizontal box
  // border there is a lone wide row that would otherwise read as an option and
  // false-split the all-right variant (its only wide left row was that border).
  const wideLeftRows = await countWideTextRows(badgeWhited, meta.width, meta.height, { x0: 105, x1: redX - 5, y0: yTop + 12, y1: yBottom - 8 }, 250);
  // "Kizspy"-style variant (MAE101 gap-fill, 27/08/2026): the left panel below
  // the 3-line boilerplate ("Kizspy | Question: N" / "(Choose 1 answer)" /
  // "(See picture)") sometimes holds the REAL lettered options (A./B./C. …)
  // in short lines, with only the bare stem/expression on the right — same
  // shape as the SPLIT variant above but with much SHORTER option text, so
  // the ≥250px-wide-row test above never fires and the right-only crop
  // silently drops every option (caught 27/08/2026: ~half of every MAE101
  // deck's questions came back "no options visible" to the transcribing
  // agent — verified against the raw source, the options were real and just
  // getting cropped away, not missing from the original paper). Any dark
  // text at all below the boilerplate (y>140) is enough signal — false
  // positives just fall back to a full-width crop (safe, only costs some
  // blank margin); false negatives silently destroy real answer content, so
  // this errs toward the former.
  const hasShortLeftOptions = await countWideTextRows(badgeWhited, meta.width, meta.height, { x0: 15, x1: redX - 5, y0: 140, y1: yBottom - 8 }, 15) >= 1;
  const isSplit = wideLeftRows >= 3 || hasShortLeftOptions;
  if (isSplit) {
    // Always start the band at x=15 (not x=105), regardless of which detector
    // fired. Using bandLeft=105 whenever wideLeftRows>=3 assumed real option
    // text always starts past x=105 — false when a question ALSO has a long
    // wrapped stem line in the left panel (e.g. "If input = ... find the order
    // ... (i=2)."), which trips wideLeftRows on its own and forces bandLeft=105
    // even though the actual "A./B./C./D." option letters start at x≈20 (caught
    // 27/08/2026, MAD101 Đề 18 q14 — options rendered as bare ", 7" fragments,
    // every leading digit/letter sliced off). x=15 is safe for every variant:
    // darkTextBBox below already bounds the real content tightly, so a wider
    // starting band only costs a little extra left margin, never lost text.
    const bandLeft = 15;
    const band = await sharp(badgeWhited)
      .extract({ left: bandLeft, top: Math.max(0, yTop - 4), width: meta.width - bandLeft, height: Math.min(meta.height - yTop, yBottom - yTop + 8) })
      .png().toBuffer();
    const bmeta = await sharp(band).metadata();
    // Exclude the bottom ~35px of the band: the "< >" page-nav arrows and the
    // panel's bottom border sit there and would otherwise stretch the box down
    // with empty space (seen on Đề 23 q26). A mid-band table/diagram (mixed
    // questions) ends well above this and is unaffected.
    const bb = await darkTextBBox(band, bmeta.width, bmeta.height, { y1: bmeta.height - 35 }, true);
    if (bb) {
      const M = 12;
      const left = Math.max(0, bb.minX - M), top = Math.max(0, bb.minY - M);
      return sharp(band).extract({
        left, top,
        width: Math.min(bmeta.width - left, bb.maxX - bb.minX + 2 * M),
        height: Math.min(bmeta.height - top, bb.maxY - bb.minY + 2 * M),
      }).png().toBuffer();
    }
  }

  const rightLeft = redX + 8;
  const rightW = meta.width - rightLeft;
  let rightBuf = await sharp(badgeWhited).extract({ left: rightLeft, top: 0, width: rightW, height: meta.height }).png().toBuffer();

  // Erase the top progress/logo strip (if any) above the first real text row,
  // keeping an ~8px margin so the question box's own top border survives.
  const darkTop = await firstDarkTextTop(rightBuf, rightW, meta.height);
  if (darkTop > 8) {
    const cover = await sharp({ create: { width: rightW, height: darkTop - 8, channels: 4, background: WHITE } }).png().toBuffer();
    rightBuf = await sharp(rightBuf).composite([{ input: cover, left: 0, top: 0 }]).png().toBuffer();
  }

  // Bound the crop to the tight bounding box of near-BLACK text, NOT to the
  // question box's own gray border/filler. trim() latches onto that border and
  // the light-gray box interior, so on the SWT301 SU2024 variant (Đề 21) whose
  // box is much TALLER than its text it left ~250px of empty box below the
  // options (all 60 pinned at the cap). A dark-text bbox ignores the gray box
  // chrome entirely and stays tight on both variants (caught 25/08/2026).
  const bbox = await darkTextBBox(rightBuf, rightW, meta.height);
  if (bbox) {
    const M = 10;
    const left = Math.max(0, bbox.minX - M);
    const top = Math.max(0, bbox.minY - M);
    const width = Math.min(rightW - left, bbox.maxX - bbox.minX + 2 * M);
    const height = Math.min(meta.height - top, bbox.maxY - bbox.minY + 2 * M, RED_DIVIDER_MAX_CONTENT_H);
    return sharp(rightBuf).extract({ left, top, width, height }).png().toBuffer();
  }
  // fallback: original trim path (shouldn't happen for a real question)
  const { info: tinfo } = await sharp(rightBuf).trim({ background: '#ffffff', threshold: 30 }).toBuffer({ resolveWithObject: true });
  const left = Math.abs(tinfo.trimOffsetLeft);
  const top = Math.abs(tinfo.trimOffsetTop);
  const cappedHeight = Math.min(tinfo.height, RED_DIVIDER_MAX_CONTENT_H, meta.height - top);
  return sharp(rightBuf).extract({ left, top, width: Math.min(tinfo.width, rightW - left), height: cappedHeight }).png().toBuffer();
}

// Count rows in the region carrying a run of near-black text at least
// `minWidth` px wide (min→max dark-text x on that row). Long option sentences
// produce MANY such rows; a lone wide row is just a horizontal box border (seen
// at y=yTop on the all-right variant), so callers threshold on the count.
async function countWideTextRows(buf, width, height, region, minWidth) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const x0 = Math.max(0, region.x0), y0 = Math.max(0, region.y0);
  const x1 = Math.min(width, region.x1), y1 = Math.min(height, region.y1);
  let count = 0;
  for (let y = y0; y < y1; y++) {
    let lo = -1, hi = -1;
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 120 && g < 120 && b < 120 && !(b > r + 25 && b > g + 25)) {
        if (lo < 0) lo = x;
        hi = x;
      }
    }
    if (hi - lo >= minWidth) count++;
  }
  return count;
}

// Tight bounding box of near-black text pixels (by default also ignores blue
// site chrome — progress bar / wordmark). Optional region {x0,y0,x1,y1}
// restricts the scan. Pass includeBlue:true when the scanned region is known
// to hold real content that may itself be blue-colored syntax-highlighted
// pseudocode (e.g. MAD101's Bubblesort procedure block, all in blue) rather
// than page chrome — the blue-exclusion test can't tell the two apart, and
// excluding real blue text from the bbox silently crops the whole code block
// out of the final image (caught 27/08/2026, MAD101 Đề 18 q14 — the right
// panel's pseudocode vanished from every split-layout crop that had colored
// code on it, even after the x=15 bandLeft fix restored the left-panel
// options). Only isSplit's band scan (already narrowed to a single page's
// real content, past any global top-chrome strip) is safe to relax this way.
// Returns null if no text found.
async function darkTextBBox(buf, width, height, region, includeBlue = false) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const x0 = Math.max(0, region?.x0 ?? 0), y0 = Math.max(0, region?.y0 ?? 0);
  const x1 = Math.min(width, region?.x1 ?? width), y1 = Math.min(height, region?.y1 ?? height);
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const isDark = includeBlue
        ? (r < 160 && g < 160 && b < 200)
        : (r < 120 && g < 120 && b < 120 && !(b > r + 25 && b > g + 25));
      if (isDark) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { minX, minY, maxX, maxY };
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.png'));
let done = 0;
for (const f of files) {
  const src = path.join(DIR, f);
  const img = sharp(src);
  const meta = await img.metadata();

  const whitedRect = await whiteOutWatermark(sharp(src), meta.height);
  const whited = await whiteOutGhostWatermark(whitedRect, meta.width, meta.height);

  const redDividerBuf = await cropRedDividerLayout(whited, meta);
  const bannerHeight = redDividerBuf ? 0 : await detectBannerHeight(whited, meta.width);

  let finalBuf;
  if (redDividerBuf) {
    finalBuf = redDividerBuf;
  } else if (bannerHeight > 0) {
    // banner layout: trim banner strip and body separately, re-stack at
    // the body's trimmed width so the banner doesn't force full width.
    const bannerBuf = await sharp(whited).extract({ left: 0, top: 0, width: meta.width, height: bannerHeight }).png().toBuffer();
    const bodyRegion = await sharp(whited).extract({ left: 0, top: bannerHeight, width: meta.width, height: meta.height - bannerHeight }).png().toBuffer();
    const bodyHeight = meta.height - bannerHeight;
    // Mask any full-height accent/divider line in the body before computing
    // the trim box (same reasoning as the plain-layout branch below), then
    // apply the box to the ORIGINAL unmasked body so the line still renders.
    const bodyMasked = await maskAccentLine(bodyRegion, meta.width, bodyHeight);
    const { info: bodyTinfo } = await sharp(bodyMasked)
      .trim({ background: '#ffffff', threshold: 10 })
      .toBuffer({ resolveWithObject: true });
    // sharp reports trimOffsetLeft/Top as <= 0 (the negative of the actual
    // offset removed) — Math.abs, NOT Math.max(0, ...), or every extract
    // silently starts at 0 regardless of the real trim box (verified
    // against a synthetic image: a 40x40 square placed at left:20,top:30
    // trims to trimOffsetLeft:-20, trimOffsetTop:-30).
    const bodyLeft = Math.abs(bodyTinfo.trimOffsetLeft);
    const bodyTop = Math.abs(bodyTinfo.trimOffsetTop);
    const trimmedBodyData = await sharp(bodyRegion)
      .extract({ left: bodyLeft, top: bodyTop, width: Math.min(bodyTinfo.width, meta.width - bodyLeft), height: Math.min(bodyTinfo.height, bodyHeight - bodyTop) })
      .toBuffer();
    const bodyInfo = { width: Math.min(bodyTinfo.width, meta.width - bodyLeft), height: Math.min(bodyTinfo.height, bodyHeight - bodyTop) };
    const contentWidth = Math.min(meta.width, bodyInfo.width + 20);
    const bannerFinal = await sharp(bannerBuf).extract({ left: 0, top: 0, width: contentWidth, height: bannerHeight }).png().toBuffer();
    // pad the already-trimmed body buffer up to contentWidth on the right
    // instead of re-extracting from the pre-trim image (that re-extraction
    // is exactly what caused the right-edge truncation bug).
    const bodyFinal = await sharp(trimmedBodyData)
      .extend({ top: 0, bottom: 0, left: 0, right: Math.max(0, contentWidth - bodyInfo.width), background: WHITE })
      .png()
      .toBuffer();
    finalBuf = await sharp({
      create: { width: contentWidth, height: bannerHeight + bodyInfo.height, channels: 4, background: WHITE },
    }).composite([
      { input: bannerFinal, left: 0, top: 0 },
      { input: bodyFinal, left: 0, top: bannerHeight },
    ]).png().toBuffer();
  } else {
    // plain layout: compute the trim box on a copy with any full-height
    // accent line masked out (see maskAccentLine), then apply that same
    // box to the real (unmasked) image so decorative lines don't block
    // vertical trimming but still render in the final crop.
    const masked = await maskAccentLine(whited, meta.width, meta.height);
    const { info: tinfo } = await sharp(masked)
      .trim({ background: '#ffffff', threshold: 10 })
      .toBuffer({ resolveWithObject: true });
    // see the trimOffset note in the banner branch above — must be Math.abs
    const left = Math.abs(tinfo.trimOffsetLeft);
    const top = Math.abs(tinfo.trimOffsetTop);
    finalBuf = await sharp(whited)
      .extract({ left, top, width: Math.min(tinfo.width, meta.width - left), height: Math.min(tinfo.height, meta.height - top) })
      .png()
      .toBuffer();
  }

  await sharp(finalBuf)
    .extend({ top: 10, bottom: 14, left: 10, right: 14, background: WHITE })
    .png()
    .toFile(path.join(OUT_DIR, f));

  done++;
  process.stdout.write(`\r✓ ${done}/${files.length} cropped`);
}
console.log('');
