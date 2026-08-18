/**
 * Playlist — gọi đúng những endpoint mà web đang dùng.
 *
 * Hình dạng lấy từ `src/routes/music.routes.ts` (đo thật bằng curl trên prod
 * 18/08/2026, không suy từ mã):
 *   GET    /music/playlists            → Playlist[] (kèm `user`, `trackCount`)
 *   GET    /music/playlists/:id        → Playlist + `tracks: Track[]` đã làm phẳng
 *   POST   /music/playlists            { name, description?, isPublic? }
 *   DELETE /music/playlists/:id
 *   POST   /music/playlists/:id/tracks { trackId }
 *   DELETE /music/playlists/:id/tracks/:trackId
 *
 * ⚠️ Trường ảnh bìa của PLAYLIST là `coverUrl`, còn của BÀI HÁT là `coverImage`.
 * Hai tên khác nhau cho cùng một khái niệm, và dùng nhầm thì không có lỗi nào —
 * chỉ là ảnh không bao giờ hiện. Đã dính đúng bẫy này với `coverImage` hôm nay.
 */
import type { Track } from './player';

export interface Playlist {
  id: number;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  isPublic?: boolean;
  trackCount?: number;
  createdByName?: string;
  tracks?: Track[];
}

interface Api {
  request<T>(path: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; body?: unknown }): Promise<T>;
}

export async function layDanhSachPlaylist(api: Api): Promise<Playlist[]> {
  const ket = await api.request<unknown>('/api/v1/music/playlists');
  return Array.isArray(ket) ? (ket as Playlist[]) : [];
}

export async function layPlaylist(api: Api, id: number): Promise<Playlist> {
  return api.request<Playlist>(`/api/v1/music/playlists/${id}`);
}

export async function taoPlaylist(api: Api, name: string, description?: string): Promise<Playlist> {
  return api.request<Playlist>('/api/v1/music/playlists', {
    method: 'POST',
    body: { name, description: description || undefined, isPublic: true },
  });
}

export async function xoaPlaylist(api: Api, id: number): Promise<void> {
  await api.request(`/api/v1/music/playlists/${id}`, { method: 'DELETE' });
}

export async function themBaiVaoPlaylist(api: Api, playlistId: number, trackId: number): Promise<void> {
  await api.request(`/api/v1/music/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: { trackId },
  });
}

export async function boBaiKhoiPlaylist(api: Api, playlistId: number, trackId: number): Promise<void> {
  await api.request(`/api/v1/music/playlists/${playlistId}/tracks/${trackId}`, { method: 'DELETE' });
}

/** `13:51` — tổng thời lượng một playlist, giống thẻ trên web. */
export function tongThoiLuong(tracks: Track[] | undefined): string {
  const giay = (tracks ?? []).reduce((t, b) => t + (b.durationSeconds ?? 0), 0);
  const phut = Math.floor(giay / 60);
  return `${phut}:${String(Math.floor(giay % 60)).padStart(2, '0')}`;
}
