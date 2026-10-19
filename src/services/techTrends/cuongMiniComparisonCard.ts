/**
 * Ảnh bìa "A vs B" cho bài SO SÁNH của CuongMini.
 *
 * Đây là phần "sơ đồ" của bài so sánh — vẽ TẠI CHỖ bằng SVG rồi rasterise bằng
 * sharp (giống hệt `newsCover.service.ts`), KHÔNG dùng bộ vẽ Mermaid của CT
 * Work (`diagramRender.service.ts`): bộ đó phụ thuộc vào ảnh trình duyệt vẽ sẵn
 * lưu theo từng dự án, hoặc một máy chủ Kroki tự dựng (mặc định TẮT) — không có
 * đường vẽ Mermaid → ảnh độc lập ở backend. Một tấm thẻ "A │ VS │ B" phục vụ
 * đúng mục đích "sơ đồ so sánh" mà không kéo theo phụ thuộc ấy.
 */
import sharp from 'sharp';
import { uploadImage } from '../../storage/uploadService.js';
import { logger } from '../../utils/logger.js';

const WIDTH = 1200;
const HEIGHT = 630;

const PALETTES: Record<string, { from: string; to: string; accent: string }> = {
  ai: { from: '#1e1b4b', to: '#4c1d95', accent: '#c4b5fd' },
  web: { from: '#0c4a6e', to: '#0e7490', accent: '#7dd3fc' },
  backend: { from: '#064e3b', to: '#047857', accent: '#6ee7b7' },
  devops: { from: '#7c2d12', to: '#b45309', accent: '#fcd34d' },
  database: { from: '#3b0764', to: '#7e22ce', accent: '#e9d5ff' },
  general: { from: '#111827', to: '#374151', accent: '#d1d5db' },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Co chữ cho vừa một bề ngang (ước lượng bề rộng glyph ~0.6em). */
function fit(label: string, fontSize: number, maxWidth: number): string {
  const perChar = fontSize * 0.6;
  const limit = Math.max(4, Math.floor(maxWidth / perChar));
  const t = label.trim();
  return t.length > limit ? `${t.slice(0, limit - 1)}…` : t;
}

export interface ComparisonCardInput {
  title: string;
  a: string;
  b: string;
  topic?: string | null;
}

export function buildComparisonSvg({ title, a, b, topic }: ComparisonCardInput): string {
  const p = PALETTES[(topic || 'general').toLowerCase()] ?? PALETTES.general;
  const half = WIDTH / 2;
  const nameA = escapeXml(fit(a, 54, half - 120));
  const nameB = escapeXml(fit(b, 54, half - 120));
  const titleText = escapeXml(fit(title, 30, WIDTH - 200));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bgA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.from}"/>
      <stop offset="100%" stop-color="${p.to}"/>
    </linearGradient>
    <linearGradient id="bgB" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.to}"/>
      <stop offset="100%" stop-color="${p.from}"/>
    </linearGradient>
    <style>
      .kick { font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; fill: ${p.accent}; letter-spacing: 5px; }
      .name { font-family: Georgia, 'Times New Roman', serif; font-size: 54px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
      .title{ font-family: Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 700; fill: rgba(255,255,255,0.92); text-anchor: middle; }
      .vs   { font-family: Helvetica, Arial, sans-serif; font-size: 46px; font-weight: 800; fill: #0b1020; text-anchor: middle; }
      .brand{ font-family: Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 700; fill: rgba(255,255,255,0.85); text-anchor: middle; }
    </style>
  </defs>
  <rect x="0" y="0" width="${half}" height="${HEIGHT}" fill="url(#bgA)"/>
  <rect x="${half}" y="0" width="${half}" height="${HEIGHT}" fill="url(#bgB)"/>
  <text x="${WIDTH / 2}" y="80" class="kick" text-anchor="middle">SO SÁNH CÔNG NGHỆ</text>
  <text x="${half / 2}" y="320" class="name">${nameA}</text>
  <text x="${half + half / 2}" y="320" class="name">${nameB}</text>
  <circle cx="${WIDTH / 2}" cy="305" r="52" fill="${p.accent}"/>
  <text x="${WIDTH / 2}" y="320" class="vs">VS</text>
  <text x="${WIDTH / 2}" y="460" class="title">${titleText}</text>
  <text x="${WIDTH / 2}" y="${HEIGHT - 40}" class="brand">cuongthai.com · CuongMini AI</text>
</svg>`;
}

/** Vẽ thẻ so sánh và lưu R2. Trả null nếu lỗi — bài không có bìa vẫn đăng được. */
export async function generateComparisonCard(input: ComparisonCardInput, userId?: number): Promise<string | null> {
  try {
    const svg = buildComparisonSvg(input);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const result = await uploadImage(
      { buffer: png, size: png.length, mimetype: 'image/png', originalName: 'cuongmini-vs.png' },
      'images/cover',
      { userId, subPrefix: 'cuongmini' },
    );
    return result.url;
  } catch (err) {
    logger.warn('[cuongmini] vẽ thẻ so sánh lỗi', { error: (err as Error).message });
    return null;
  }
}
