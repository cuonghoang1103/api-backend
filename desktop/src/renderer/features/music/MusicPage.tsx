/**
 * Music — nghe online, và tải bài về nghe khi mất mạng.
 *
 * Đường dẫn đối chiếu `src/routes/music.routes.ts` (mount `/api/v1/music`,
 * src/index.ts:497) ngày 16/08/2026:
 *   GET /api/v1/music/tracks      danh sách
 *   GET /api/v1/music/stream/:id  luồng nhạc (302 sang URL R2 đã ký)
 *
 * ─── Hai nguồn phát, chọn theo thứ tự ───
 *  1. Đã tải  → `app://cuongthai/media/<id>` (đọc từ đĩa, tua được, không tốn mạng)
 *  2. Chưa tải → `/api/v1/music/stream/<id>` (cần mạng)
 *
 * Ưu tiên bản trên đĩa kể cả khi ĐANG có mạng: đã tải về rồi thì không có lý do
 * gì tải lại lần nữa mỗi lần nghe.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  CloudOff,
  Download,
  HardDrive,
  Loader2,
  Music2,
  Pause,
  Play,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface Track {
  id: number;
  title: string;
  artist?: string | null;
  duration?: number | null;
  coverUrl?: string | null;
}

/** Backend có thể trả mảng trần hoặc bọc trong `{ tracks }` / `{ items }`. */
function asTracks(payload: unknown): Track[] {
  if (Array.isArray(payload)) return payload as Track[];
  const wrapped = payload as { tracks?: unknown; items?: unknown; data?: unknown };
  for (const candidate of [wrapped.tracks, wrapped.items, wrapped.data]) {
    if (Array.isArray(candidate)) return candidate as Track[];
  }
  return [];
}

/**
 * Đoán đuôi file từ Content-Type.
 *
 * Cần đuôi ĐÚNG vì thẻ <audio> chọn bộ giải mã theo kiểu MIME mà protocol trả
 * về, và protocol suy kiểu MIME từ đuôi file. Đoán sai thì file tải về đủ byte
 * nhưng phát ra im lặng — lỗi trông như file hỏng.
 */
function extFromContentType(contentType: string | null): 'mp3' | 'm4a' | 'webm' | 'ogg' | 'wav' | 'flac' {
  const type = (contentType ?? '').toLowerCase();
  if (type.includes('mp4') || type.includes('m4a') || type.includes('aac')) return 'm4a';
  if (type.includes('webm')) return 'webm';
  if (type.includes('ogg')) return 'ogg';
  if (type.includes('wav')) return 'wav';
  if (type.includes('flac')) return 'flac';
  return 'mp3';
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function MusicPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [downloaded, setDownloaded] = useState<Map<number, number>>(new Map());
  const [downloading, setDownloading] = useState<Set<number>>(new Set());
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ count: 0, totalBytes: 0 });

  const audio = useRef<HTMLAudioElement | null>(null);

  const refreshDownloaded = useCallback(async () => {
    const list = (await window.cuongthai?.music.listDownloaded()) ?? [];
    setDownloaded(new Map(list.map((t) => [t.trackId, t.size])));
    const u = await window.cuongthai?.music.usage();
    if (u) setUsage(u);
  }, []);

  useEffect(() => {
    void refreshDownloaded();
  }, [refreshDownloaded]);

  const loadTracks = useCallback(async () => {
    if (userId === null || !api) return;
    setLoading(true);
    setError(null);
    try {
      const result = await swr<unknown>({
        userId,
        key: 'music:tracks',
        fetcher: () => api.request('/api/v1/music/tracks'),
        online,
        ttlMs: 10 * 60 * 1000,
        onRefreshed: (fresh) => setTracks(asTracks(fresh)),
      });
      setTracks(asTracks(result.value));
    } catch (caught) {
      setError(
        caught instanceof OfflineUnavailableError
          ? 'Chưa từng tải danh sách bài hát nên không xem được khi ngoại tuyến. Những bài đã tải về máy vẫn nghe được.'
          : caught instanceof Error
            ? caught.message
            : String(caught),
      );
    } finally {
      setLoading(false);
    }
  }, [api, userId, online]);

  useEffect(() => {
    void loadTracks();
  }, [loadTracks]);

  const download = async (track: Track) => {
    if (!api || downloading.has(track.id)) return;
    setDownloading((previous) => new Set(previous).add(track.id));
    try {
      // Tải bằng renderer vì token sống ở đây. `redirect: 'follow'` để đi theo
      // 302 sang URL R2 đã ký — không theo thì nhận về một thân rỗng.
      const response = await fetch(
        `${api.baseUrlForForms()}/api/v1/music/stream/${track.id}`,
        { headers: api.authHeaders(), credentials: 'omit', redirect: 'follow' },
      );
      if (!response.ok) throw new Error(`Máy chủ trả về ${response.status}`);

      const buffer = await response.arrayBuffer();
      const ext = extFromContentType(response.headers.get('content-type'));
      await window.cuongthai?.music.saveAudio(track.id, new Uint8Array(buffer), ext);
      await refreshDownloaded();
    } catch (caught) {
      setError(
        `Không tải được "${track.title}": ${caught instanceof Error ? caught.message : String(caught)}`,
      );
    } finally {
      setDownloading((previous) => {
        const next = new Set(previous);
        next.delete(track.id);
        return next;
      });
    }
  };

  const remove = async (trackId: number) => {
    await window.cuongthai?.music.deleteAudio(trackId);
    if (playingId === trackId) stop();
    await refreshDownloaded();
  };

  const stop = () => {
    audio.current?.pause();
    audio.current = null;
    setPlayingId(null);
  };

  const play = (track: Track) => {
    if (playingId === track.id) {
      stop();
      return;
    }
    stop();

    const isLocal = downloaded.has(track.id);
    // Ưu tiên bản trên đĩa kể cả khi có mạng — đã tải rồi thì tải lại làm gì.
    const src = isLocal
      ? `app://cuongthai/media/${track.id}`
      : `${api?.baseUrlForForms() ?? ''}/api/v1/music/stream/${track.id}`;

    if (!isLocal && !online) {
      setError(`"${track.title}" chưa tải về máy nên không nghe được khi ngoại tuyến.`);
      return;
    }

    const element = new Audio(src);
    element.addEventListener('ended', () => setPlayingId(null));
    element.addEventListener('error', () => {
      setError(`Không phát được "${track.title}".`);
      setPlayingId(null);
    });
    audio.current = element;
    setPlayingId(track.id);
    // Cho robot nổi biết đang nghe gì. Main tự bỏ qua nếu người dùng đang nhìn
    // app — báo tên bài ngay trong trang nhạc là nói lại điều đã thấy.
    void window.cuongthai?.robot.baoNhac(`${track.title}${track.artist ? ` — ${track.artist}` : ''}`);
    void element.play().catch(() => {
      setError(`Không phát được "${track.title}".`);
      setPlayingId(null);
    });
  };

  // Dừng nhạc khi rời trang: không dừng thì bài hát vẫn phát trong khi người
  // dùng đã sang màn hình khác và không còn nút nào để tắt.
  useEffect(() => {
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  const offlineCount = downloaded.size;

  return (
    <div className="ct-page" style={{ maxWidth: 880 }}>
      <div className="ct-page-head" style={{ marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 19 }}>Nhạc</h1>
          <p className="ct-muted" style={{ margin: 0 }}>
            Tải bài về máy để nghe khi không có mạng.
          </p>
        </div>
        <button
          type="button"
          className="ct-btn ct-btn-ghost"
          onClick={() => void loadTracks()}
          disabled={!online}
        >
          <RefreshCw size={14} aria-hidden />
          Làm mới
        </button>
      </div>

      {offlineCount > 0 && (
        <p className="ct-field-help" style={{ marginBottom: 12 }}>
          <HardDrive size={13} aria-hidden style={{ verticalAlign: -2, marginRight: 5 }} />
          {usage.count} bài đã tải · {formatBytes(usage.totalBytes)}
          <button
            type="button"
            className="ct-linklike"
            onClick={() => {
              if (window.confirm(`Xoá toàn bộ ${usage.count} bài đã tải? Tải lại được khi có mạng.`)) {
                stop();
                void window.cuongthai?.music.clearAll().then(refreshDownloaded);
              }
            }}
          >
            Xoá hết
          </button>
        </p>
      )}

      {!online && (
        <div className="ct-notice" data-tone="warn">
          <CloudOff size={15} aria-hidden />
          <span>
            Đang ngoại tuyến — chỉ nghe được {offlineCount} bài đã tải về máy.
          </span>
        </div>
      )}

      {error && (
        <div className="ct-notice" data-tone="err" role="alert">
          <span>{error}</span>
          <button type="button" className="ct-linklike" onClick={() => setError(null)}>
            Đóng
          </button>
        </div>
      )}

      {loading && tracks.length === 0 && <p>Đang tải…</p>}

      {tracks.length > 0 && (
        <ul className="ct-track-list">
          {tracks.map((track) => {
            const isDownloaded = downloaded.has(track.id);
            const isDownloading = downloading.has(track.id);
            const isPlaying = playingId === track.id;
            const playable = isDownloaded || online;

            return (
              <li key={track.id} className="ct-track" data-playing={isPlaying}>
                <button
                  type="button"
                  className="ct-track-play"
                  onClick={() => play(track)}
                  disabled={!playable}
                  aria-label={isPlaying ? `Dừng ${track.title}` : `Phát ${track.title}`}
                  title={!playable ? 'Chưa tải về máy — cần mạng để nghe' : undefined}
                >
                  {isPlaying ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
                </button>

                <div className="ct-track-main">
                  <div className="ct-track-title">{track.title}</div>
                  <div className="ct-track-meta">
                    {track.artist && <span>{track.artist}</span>}
                    {formatDuration(track.duration) && <span>{formatDuration(track.duration)}</span>}
                    {isDownloaded && (
                      <span className="ct-offline-tag">
                        <CheckCircle2 size={11} aria-hidden /> đã tải
                      </span>
                    )}
                  </div>
                </div>

                {isDownloaded ? (
                  <button
                    type="button"
                    className="ct-track-action"
                    onClick={() => void remove(track.id)}
                    aria-label={`Xoá bản tải về của ${track.title}`}
                    title="Xoá bản đã tải"
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="ct-track-action"
                    onClick={() => void download(track)}
                    disabled={!online || isDownloading}
                    aria-label={`Tải ${track.title} về máy`}
                    title={online ? 'Tải về nghe offline' : 'Cần mạng để tải'}
                  >
                    {isDownloading ? (
                      <Loader2 size={14} className="ct-spin" aria-hidden />
                    ) : (
                      <Download size={14} aria-hidden />
                    )}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!loading && tracks.length === 0 && !error && (
        <div className="ct-empty">
          <Music2 size={28} aria-hidden className="ct-empty-icon" />
          <p>Chưa có bài hát nào.</p>
        </div>
      )}
    </div>
  );
}
