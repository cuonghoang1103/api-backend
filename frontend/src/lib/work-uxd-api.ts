/**
 * CT Work UX-D (09/10/2026) — ảnh bìa dự án + thẻ xem trước công khai (backend: src/routes/work.uxd.routes.ts).
 */
import { api } from './api';
import { translate as wtr, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => wtr(currentWorkLocale(), k, v);

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export const MAX_COVER_BYTES = 8 * 1024 * 1024;
export const COVER_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export interface CoverState { coverUrl: string | null; coverPositionY: number | null }
export interface CardBrand { key: string; name: string; coverUrl: string | null; coverPositionY: number; color: string | null; iconEmoji: string | null; avatarUrl: string | null }
export type InviteCard =
  | { status: 'UNAVAILABLE' }
  | { status: 'VALID'; workspace: { name: string; logoUrl: string | null }; project: CardBrand | null; inviter: { name: string; avatarUrl: string | null } | null; memberCount: number };

export const workCoverApi = {
  setCover: (pid: number, body: { preset?: string | null; positionY?: number }) => d<CoverState>(api.put(`${B}/projects/${pid}/cover`, body)),
  /** Gửi BYTE ảnh làm thân request (không FormData — instance axios đặt cứng JSON sẽ biến FormData thành `{}`). */
  uploadCover: async (pid: number, file: Blob, positionY = 50): Promise<CoverState> => {
    if (!COVER_IMAGE_TYPES.includes(file.type)) throw new Error(wt('detail.imgTypes3'));
    if (file.size > MAX_COVER_BYTES) throw new Error(wt('detail.cover8mb'));
    const buf = await file.arrayBuffer();
    return d<CoverState>(api.post(`${B}/projects/${pid}/cover/upload?positionY=${Math.round(positionY)}`, buf, {
      headers: { 'Content-Type': file.type }, timeout: 120_000, transformRequest: [(x) => x],
    }));
  },
};
