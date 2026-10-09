import { anhTuyetDoi } from '@/lib/anhTuyetDoi';
/**
 * CT Work UX-D (09/10/2026) — thư viện ảnh bìa dự án (danh mục sinh bởi scripts/work-covers/gen-work-covers.mjs).
 * `coverUrl` của dự án: "preset:<id>" | URL ảnh tải lên | null. Danh sách id khớp src/services/work/covers.ts (backend).
 */
import catalog from './work-covers.json';
import { translate as wtr, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => wtr(currentWorkLocale(), k, v);

export type CoverGroup = 'professional' | 'theme' | 'cute' | 'school';
export interface CoverPreset { id: string; group: CoverGroup; label: string; colors: [string, string]; tone: 'light' | 'dark' }

export const COVERS = catalog as CoverPreset[];
export const COVER_GROUPS: Array<{ key: CoverGroup; label: string }> = [
  { key: 'professional', get label() { return wt('cover.gPro'); } },
  { key: 'theme', get label() { return wt('cover.gTheme'); } },
  { key: 'cute', get label() { return wt('cover.gCute'); } },
  { key: 'school', get label() { return wt('cover.gSchool'); } },
];

export const presetOf = (coverUrl?: string | null): CoverPreset | null =>
  coverUrl?.startsWith('preset:') ? COVERS.find((c) => c.id === coverUrl.slice(7)) ?? null : null;

/** Đường ảnh hiển thị (SVG cho preset, URL gốc cho ảnh tải lên). */
export function coverSrc(coverUrl?: string | null): string | null {
  if (!coverUrl) return null;
  const p = presetOf(coverUrl);
  // anhTuyetDoi: app desktop chạy ở origin app:// ⇒ đường tương đối `/images/…` trỏ vào bundle app (404, ảnh vỡ).
  if (p) return anhTuyetDoi(`/images/work-covers/${p.id}.svg`);
  return /^https?:\/\//.test(coverUrl) || coverUrl.startsWith('/') ? anhTuyetDoi(coverUrl) : null;
}

/** Ảnh hiện là ảnh tối hay sáng — để chọn màu chữ đè lên (ảnh tải lên coi như tối, luôn có lớp phủ). */
export const coverTone = (coverUrl?: string | null): 'light' | 'dark' => presetOf(coverUrl)?.tone ?? 'dark';
