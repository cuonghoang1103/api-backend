/**
 * UX-D (09/10/2026) — nền chung cho ảnh Open Graph động (next/og · Satori), CHỈ chạy ở máy chủ (runtime nodejs).
 *
 *   - Phông: Inter (latin + vietnamese, 400/600/800) đọc từ public/og-fonts/*.woff — Satori không có phông tiếng Việt
 *     sẵn (dấu thành ô trống, xem repos/[id]/opengraph-image.tsx). Đặt trong public/ vì bản standalone (Dockerfile)
 *     chỉ chép public/ + những tệp được trace; readFile theo đường động thì không được trace.
 *   - Ảnh nhúng (logo, bìa preset SVG, bìa/ảnh đại diện JPEG/PNG) đều chuyển thành data URI ở đây, có trần thời gian
 *     và cỡ; ảnh lỗi/WebP ⇒ bỏ (Satori không đọc WebP) — ảnh OG không bao giờ được chết vì một ảnh phụ.
 *   - fetchCard: gọi tuyến công khai rút gọn của backend (/api/v1/work/public/*), chuyển tiếp IP khách cho rate-limit.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { headers } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server-api';

export const OG_SIZE = { width: 1200, height: 630 };
const PUB = path.join(process.cwd(), 'public');

let fontsP: Promise<Array<{ name: string; data: ArrayBuffer; weight: 400 | 600 | 800; style: 'normal' }>> | null = null;
export function ogFonts() {
  fontsP ??= Promise.all(
    (['latin', 'vietnamese'] as const).flatMap((sub) => ([400, 600, 800] as const).map(async (weight) => {
      const buf = await readFile(path.join(PUB, 'og-fonts', `inter-${sub}-${weight}-normal.woff`));
      return { name: sub === 'latin' ? 'Inter' : 'InterVN', data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, weight, style: 'normal' as const };
    })),
  ).catch((err) => { fontsP = null; throw err; });
  return fontsP;
}
export const OG_FONT = 'Inter, InterVN';

async function publicDataUri(rel: string, mime: string): Promise<string | null> {
  try {
    const buf = await readFile(path.join(PUB, rel));
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch { return null; }
}

// PNG (không phải SVG): mark có bóng đổ bằng filter SVG mà Satori không vẽ. 112 px = 2× ô 56 px của <Brand>.
export const ctWorkLogo = () => publicDataUri('images/ct-work/ct-work-mark-112.png', 'image/png');

/** Ảnh từ mạng ⇒ data URI (≤ 3 MB, ≤ 3 s; chỉ PNG/JPEG). Lỗi ⇒ null. */
export async function remoteImage(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  const abs = url.startsWith('/') ? null : url;
  if (!abs || !/^https?:\/\//.test(abs)) return url.startsWith('/') ? publicDataUri(url.slice(1), /\.png$/i.test(url) ? 'image/png' : 'image/jpeg') : null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(abs, { signal: ctrl.signal, next: { revalidate: 3600 } });
    clearTimeout(t);
    const type = (res.headers.get('content-type') || '').split(';')[0];
    if (!res.ok || !['image/png', 'image/jpeg', 'image/jpg'].includes(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 3 * 1024 * 1024) return null;
    return `data:${type};base64,${buf.toString('base64')}`;
  } catch { return null; }
}

/** Bìa dự án ⇒ data URI: preset SVG trong public/, ảnh tải lên (JPEG) qua mạng. */
export async function coverImage(coverUrl: string | null | undefined): Promise<string | null> {
  if (!coverUrl) return null;
  if (coverUrl.startsWith('preset:')) {
    const id = coverUrl.slice(7);
    if (!/^[a-z0-9-]{1,40}$/.test(id)) return null;
    // Bản JPEG raster (dựng sẵn cho email) — Satori vẽ JPEG chắc chắn hơn SVG có gradient/pattern.
    return publicDataUri(`images/work-covers/email/${id}.jpg`, 'image/jpeg');
  }
  return remoteImage(coverUrl);
}

/** IP khách (mục phải nhất của X-Forwarded-For mà nginx ghi) — chuyển tiếp để rate-limit của backend tính đúng người. */
function clientIp(): string | null {
  try {
    const xff = headers().get('x-forwarded-for');
    return xff?.split(',').map((s) => s.trim()).filter(Boolean).pop() ?? headers().get('x-real-ip');
  } catch { return null; }
}

export async function fetchCard<T>(pathName: string, revalidate = 120): Promise<T | null> {
  try {
    const ip = clientIp();
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/work/public/${pathName}`, {
      headers: { accept: 'application/json', ...(ip ? { 'x-forwarded-for': ip } : {}) },
      next: { revalidate },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as T) ?? null;
  } catch { return null; }
}

export const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]!.toUpperCase()).join('') || '?';
}
