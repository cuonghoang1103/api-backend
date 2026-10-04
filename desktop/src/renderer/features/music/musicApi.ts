/**
 * Những endpoint nhạc NGOÀI thư viện/playlist: thích, lịch sử, nghe nhiều, lời.
 *
 * Hình dạng đọc từ mã máy chủ (04/10/2026), không suy đoán:
 *   GET /music/likes          → [{ trackId, likedAt, title, artist, coverImage, audioUrl, durationSeconds }]
 *   GET /music/history        → [{ id, title, artist, coverImage, durationSeconds, audioUrl, playedAt }]
 *   GET /music/play-counts    → [{ trackId, count, lastPlayedAt, title, … }]
 *   GET /music/tracks/:id/lyrics → { format: 'synced'|'plain', synced: [{t,text}], plain } | null
 *
 * ⚠️ Hai danh sách đầu dùng `trackId`, không phải `id` — đúng kiểu bẫy
 * `coverImage`/`coverUrl` đã ghi ở `playlists.ts`. Đổi về `Track` ngay ở đây để
 * phần còn lại của trang chỉ biết MỘT hình dạng.
 */
import type { Track } from './player';

interface Api {
  request<T>(path: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown }): Promise<T>;
}

type DongCoTrackId = Omit<Track, 'id'> & { trackId: number; count?: number };

function veTrack(ds: unknown): Track[] {
  if (!Array.isArray(ds)) return [];
  return (ds as DongCoTrackId[]).map((d) => ({
    id: Number(d.trackId),
    title: d.title,
    artist: d.artist ?? null,
    coverImage: d.coverImage ?? null,
    durationSeconds: d.durationSeconds ?? null,
    audioUrl: d.audioUrl ?? null,
  }));
}

export async function layBaiDaThich(api: Api): Promise<Track[]> {
  return veTrack(await api.request<unknown>('/api/v1/music/likes?limit=500'));
}

export async function layLichSu(api: Api): Promise<Track[]> {
  const ds = await api.request<unknown>('/api/v1/music/history');
  return Array.isArray(ds) ? (ds as Track[]).map((t) => ({ ...t, id: Number(t.id) })) : [];
}

export async function xoaLichSu(api: Api): Promise<void> {
  await api.request('/api/v1/music/history', { method: 'DELETE' });
}

export interface BaiNgheNhieu extends Track { soLan: number }

export async function layNgheNhieu(api: Api): Promise<BaiNgheNhieu[]> {
  const ds = await api.request<unknown>('/api/v1/music/play-counts?limit=20');
  if (!Array.isArray(ds)) return [];
  return (ds as DongCoTrackId[]).map((d) => ({ ...veTrack([d])[0]!, soLan: Number(d.count ?? 0) }));
}

export interface DongLoi { t: number; text: string }
export interface LoiBai {
  dong: DongLoi[];      // rỗng khi chỉ có lời thường
  thuong: string | null;
}

export async function layLoi(api: Api, trackId: number): Promise<LoiBai | null> {
  const r = await api.request<unknown>(`/api/v1/music/tracks/${trackId}/lyrics`);
  if (!r || typeof r !== 'object') return null;
  const o = r as { synced?: unknown; plain?: unknown };
  const dong = Array.isArray(o.synced)
    ? (o.synced as DongLoi[]).filter((d) => Number.isFinite(d?.t) && typeof d?.text === 'string')
    : [];
  const thuong = typeof o.plain === 'string' && o.plain.trim() ? o.plain : null;
  if (dong.length === 0 && !thuong) return null;
  return { dong, thuong };
}
