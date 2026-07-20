/**
 * Cover-image generator for AI news bulletins.
 *
 * We deliberately do NOT copy the source publication's artwork onto our own
 * storage — that is someone else's image. Instead each bulletin gets a card we
 * draw ourselves: the headline, the date, and the publishers it cites. The
 * source's own OG image is still shown next to each item on the page, hotlinked
 * and credited, which is the normal way to reference an article.
 *
 * SVG is composed by hand and rasterised with sharp (already a dependency, used
 * by the image optimiser), then stored through the ordinary upload path so the
 * result lands in R2 with the same lifecycle as any other image.
 */
import sharp from 'sharp';
import { uploadImage } from '../../storage/uploadService.js';
import { logger } from '../../utils/logger.js';

const WIDTH = 1200;
const HEIGHT = 630;   // OG card ratio

/** Palettes keyed by topic so the feed does not look monotonous. */
const PALETTES: Record<string, { from: string; to: string; accent: string }> = {
  ai:       { from: '#1e1b4b', to: '#4c1d95', accent: '#c4b5fd' },
  web:      { from: '#0c4a6e', to: '#0e7490', accent: '#7dd3fc' },
  backend:  { from: '#064e3b', to: '#047857', accent: '#6ee7b7' },
  devops:   { from: '#7c2d12', to: '#b45309', accent: '#fcd34d' },
  devtools: { from: '#1e293b', to: '#334155', accent: '#94a3b8' },
  cloud:    { from: '#312e81', to: '#1d4ed8', accent: '#93c5fd' },
  database: { from: '#3b0764', to: '#7e22ce', accent: '#e9d5ff' },
  general:  { from: '#111827', to: '#374151', accent: '#d1d5db' },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Greedy wrap by estimated width. sharp renders SVG through librsvg with no way
 * to measure text first, so we approximate: at ~0.52em average glyph width the
 * estimate is close enough for a 3-line headline and always errs toward
 * breaking early rather than overflowing the card.
 */
function wrapLines(text: string, fontSize: number, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const perChar = fontSize * 0.52;
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length * perChar <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);

  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    const limit = Math.floor(maxWidth / perChar);
    if (last.length > limit) lines[maxLines - 1] = `${last.slice(0, limit - 1)}…`;
  }
  return lines;
}

export interface CoverInput {
  title: string;
  dateLabel: string;
  publishers: string[];
  topic?: string | null;
}

export function buildCoverSvg({ title, dateLabel, publishers, topic }: CoverInput): string {
  const palette = PALETTES[(topic || 'general').toLowerCase()] ?? PALETTES.general;
  const lines = wrapLines(title, 62, WIDTH - 160, 3);
  const startY = 300 - (lines.length - 1) * 38;

  const headline = lines
    .map((line, i) => `<text x="80" y="${startY + i * 76}" class="h">${escapeXml(line)}</text>`)
    .join('');

  const chips = publishers.slice(0, 4).map((p, i) => {
    const label = escapeXml(p);
    const w = Math.max(90, label.length * 12 + 32);
    const x = 80 + i * 0; // placed sequentially below via translate
    return { label, w, x };
  });

  let chipX = 80;
  const chipSvg = chips
    .map((c) => {
      const g = `<g transform="translate(${chipX},520)">
      <rect width="${c.w}" height="44" rx="22" fill="rgba(255,255,255,0.12)" stroke="${palette.accent}" stroke-opacity="0.45"/>
      <text x="${c.w / 2}" y="29" class="chip">${c.label}</text>
    </g>`;
      chipX += c.w + 14;
      return g;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.from}"/>
      <stop offset="100%" stop-color="${palette.to}"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${palette.accent}"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
    </linearGradient>
    <style>
      .h    { font-family: Georgia, 'Times New Roman', serif; font-size: 62px; font-weight: 700; fill: #ffffff; }
      .kick { font-family: Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; fill: ${palette.accent}; letter-spacing: 6px; }
      .date { font-family: Helvetica, Arial, sans-serif; font-size: 22px; fill: rgba(255,255,255,0.75); }
      .chip { font-family: Helvetica, Arial, sans-serif; font-size: 20px; fill: #ffffff; text-anchor: middle; }
      .brand{ font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; fill: rgba(255,255,255,0.85); }
    </style>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="1080" cy="120" r="220" fill="${palette.accent}" fill-opacity="0.10"/>
  <circle cx="1180" cy="560" r="160" fill="${palette.accent}" fill-opacity="0.07"/>
  <text x="80" y="120" class="kick">BẢN TIN CÔNG NGHỆ</text>
  <rect x="80" y="140" width="420" height="4" fill="url(#rule)"/>
  ${headline}
  <text x="80" y="470" class="date">${escapeXml(dateLabel)}</text>
  ${chipSvg}
  <text x="${WIDTH - 80}" y="${HEIGHT - 40}" class="brand" text-anchor="end">cuongthai.com</text>
</svg>`;
}

/**
 * Render the card and store it. Returns null on failure — a bulletin without a
 * cover is fine, a bulletin that fails to publish because of a cover is not.
 */
export async function generateCoverImage(input: CoverInput, userId?: number): Promise<string | null> {
  try {
    const svg = buildCoverSvg(input);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const result = await uploadImage(
      {
        buffer: png,
        size: png.length,
        mimetype: 'image/png',
        originalName: 'news-cover.png',
      },
      'images/cover',
      { userId, subPrefix: 'news' },
    );
    return result.url;
  } catch (err) {
    logger.warn('news cover generation failed', { error: (err as Error).message });
    return null;
  }
}
