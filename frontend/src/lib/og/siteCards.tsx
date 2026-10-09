/**
 * UX-D — mẫu ảnh OG cho phần còn lại của web (khoá học, bài học, blog/tech-trends, dự án, nhạc, hồ sơ).
 * Cùng hệ màu với ảnh gốc của site (app/opengraph-image.tsx: nền tím đậm, vạch tím–xanh–hồng) để nhận ra là
 * cuongthai.com, nhưng có TIÊU ĐỀ THẬT của trang + nhãn loại trang. Chữ theo ngôn ngữ trang (tiếng Việt có dấu
 * nhờ phông Inter vietnamese — xem og.tsx). Trang chủ vẫn giữ ảnh cũ.
 */
import { ImageResponse } from 'next/og';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { OG_FONT, OG_SIZE, ogFonts, remoteImage, truncate } from './og';

export interface SiteCardInput {
  kind: string;            // "Khoá học", "Blog", "Dự án", "Code Lab", "Âm nhạc", "Hồ sơ"…
  title: string;
  subtitle?: string | null;
  meta?: string[];         // chip nhỏ (cấp độ, số bài, thời lượng…)
  image?: string | null;   // ảnh minh hoạ (thumbnail) — chỉ PNG/JPEG qua mạng; lỗi ⇒ bỏ
  accent?: [string, string];
}

const DEFAULT_ACCENT: [string, string] = ['#8b5cf6', '#06b6d4'];

export async function siteImage(c: SiteCardInput) {
  const [a, b] = c.accent ?? DEFAULT_ACCENT;
  const thumb = await remoteImage(c.image);
  const title = truncate(c.title.replace(/\s+/g, ' ').trim() || 'CuongThai', 110);
  const titleSize = title.length > 70 ? 50 : title.length > 42 ? 60 : 74;
  const textW = thumb ? 660 : 1040;
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', fontFamily: OG_FONT, color: '#fff', background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 55%, #0a0a14 100%)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex', backgroundImage: `linear-gradient(135deg, ${a}33 0%, transparent 45%, ${b}26 100%)` }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 8, display: 'flex', background: `linear-gradient(90deg, ${a} 0%, ${b} 60%, #ec4899 100%)` }} />
      {thumb && (
        <div style={{ position: 'absolute', top: 96, right: 64, width: 420, height: 420, display: 'flex', borderRadius: 28, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.18)' }}>
          <img src={thumb} width={420} height={420} style={{ width: 420, height: 420, objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)` }}>C</div>
          <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: 3, color: b }}>CUONGTHAI.COM</span>
          <div style={{ display: 'flex', padding: '8px 20px', borderRadius: 999, fontSize: 24, fontWeight: 600, background: 'rgba(255,255,255,0.1)', border: `1px solid ${a}88`, color: '#e9e4ff' }}>{c.kind}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: textW }}>
          <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.2 }}>{title}</div>
          {c.subtitle && <div style={{ display: 'flex', fontSize: 28, lineHeight: 1.4, color: 'rgba(255,255,255,0.74)' }}>{truncate(c.subtitle.replace(/\s+/g, ' '), thumb ? 110 : 150)}</div>}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: textW }}>
          {(c.meta ?? []).filter(Boolean).slice(0, 4).map((m) => (
            <div key={m} style={{ display: 'flex', padding: '8px 18px', borderRadius: 999, fontSize: 22, background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>{truncate(m, 32)}</div>
          ))}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: await ogFonts() }, // Cache-Control đặt ở nginx (location opengraph-image)
  );
}

/** GET JSON công khai của backend (data | null), cache 10 phút — dùng trong opengraph-image của từng trang. */
export async function apiData<T = Record<string, unknown>>(p: string): Promise<T | null> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/${p}`, { headers: { accept: 'application/json' }, next: { revalidate: 600 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as T) ?? null;
  } catch { return null; }
}

/** Chuỗi song ngữ "EN|||VI" ⇒ một nửa; bỏ HTML/markdown. */
export function plain(s: unknown, lang: 'en' | 'vi' = 'vi'): string {
  if (typeof s !== 'string') return '';
  const parts = s.split('|||');
  const pick = parts.length > 1 ? (lang === 'en' ? parts[0] : parts[1]) : s;
  return (pick ?? '').replace(/<[^>]*>/g, ' ').replace(/[#*`>_~]+/g, '').replace(/\s+/g, ' ').trim();
}

/** Ảnh thumbnail tương đối (khoá R2 trần / "/uploads/…") ⇒ URL tuyệt đối mà máy chủ Next tải được. */
export function absMedia(u: unknown): string | null {
  if (typeof u !== 'string' || !u) return null;
  if (/^https?:\/\//.test(u)) return u;
  const media = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.NEXT_PUBLIC_MEDIA_URL || 'https://media.cuongthai.com';
  return u.startsWith('/') ? null : `${media.replace(/\/$/, '')}/${u}`;
}
