'use client';

/**
 * Dải thông báo đầu dự án (26/11/2026) — settings.banner { text, tone } do ADMIN đặt ở Cài đặt › Chi tiết.
 * Dùng cho dự án một người đóng nhiều vai ("Solo · 1 người đóng 5 vai") để ai xem bảng (giảng viên, người review)
 * đều thấy ngay, hoặc thông báo chung của dự án. Không có ⇒ không vẽ gì.
 */
import { Info, TriangleAlert, Users } from 'lucide-react';
import type { ProjectConfig } from '@/lib/work-api';

export type BannerTone = 'info' | 'solo' | 'warn';

export function readBanner(settings: Record<string, unknown>): { text: string; tone: BannerTone } | null {
  const b = settings?.banner as { text?: unknown; tone?: unknown } | null | undefined;
  if (!b || typeof b.text !== 'string' || !b.text.trim()) return null;
  const tone: BannerTone = b.tone === 'solo' || b.tone === 'warn' ? b.tone : 'info';
  return { text: b.text, tone };
}

const MAU: Record<BannerTone, string> = { info: 'var(--w-accent)', solo: 'var(--w-purple, #7c3aed)', warn: 'var(--w-orange)' };

export function ProjectBanner({ config }: { config: ProjectConfig }) {
  const b = readBanner(config.settings);
  if (!b) return null;
  const c = MAU[b.tone];
  const Icon = b.tone === 'solo' ? Users : b.tone === 'warn' ? TriangleAlert : Info;
  return (
    <div
      role="note"
      className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5 text-[12.5px] text-[var(--w-text)] md:px-5"
      style={{ borderColor: `color-mix(in srgb, ${c} 40%, transparent)`, background: `color-mix(in srgb, ${c} 10%, transparent)` }}
    >
      <Icon size={13} className="shrink-0" style={{ color: c }} />
      <span className="min-w-0 flex-1 break-words">{b.text}</span>
    </div>
  );
}
