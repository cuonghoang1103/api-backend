/**
 * Nhạc — trình phát đầy đủ, nghe online hoặc tải về nghe offline.
 *
 * Đường dẫn đối chiếu `src/routes/music.routes.ts` (mount `/api/v1/music`):
 *   GET /api/v1/music/tracks      danh sách  → { success, data: Track[], pagination }
 *   GET /api/v1/music/stream/:id  luồng nhạc (302 sang URL R2 đã ký)
 *
 * ─── Hai nguồn phát, chọn theo thứ tự ───
 *  1. Đã tải  → `app://cuongthai/media/<id>` (đọc từ đĩa, tua được, không tốn mạng)
 *  2. Chưa tải → `/api/v1/music/stream/<id>` (cần mạng)
 *
 * ⚠️ TÊN TRƯỜNG. Máy chủ trả thẳng hình dạng model Prisma: `coverImage`,
 * `durationSeconds` — KHÔNG phải `coverUrl`/`duration`. Bản trước khai sai cả
 * hai nên ảnh bìa không bao giờ vẽ được và thời lượng luôn rỗng, mà không có
 * lỗi nào để thấy: `undefined` đi qua hàm định dạng rồi ra chuỗi rỗng.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  CloudOff,
  Download,
  HardDrive,
  Loader2,
  Music2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  RefreshCw,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

interface Track {
  id: number;
  title: string;
  artist?: string | null;
  durationSeconds?: number | null;
  coverImage?: string | null;
}

type RepeatMode = 'off' | 'all' | 'one';

const VOLUME_KEY = 'ct-music-volume';

/** Backend có thể trả mảng trần hoặc bọc trong `{ tracks }` / `{ items }` / `{ data }`. */
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

/** `m:ss`. Trả `--:--` khi chưa biết, để thanh tua không nhảy số lung tung. */
function clock(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Bỏ dấu để tìm "duong" ra "Đường" — cùng luật với phần Ghi chú. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/** Xáo trộn Fisher–Yates, trả mảng MỚI. */
function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function MusicPage() {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [downloaded, setDownloaded] = useState<Map<number, number>>(new Map());
  const [downloading, setDownloading] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ count: 0, totalBytes: 0 });
  const [query, setQuery] = useState('');

  // ─── Trạng thái trình phát ───────────────────────────────
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [length, setLength] = useState(0);
  const [seeking, setSeeking] = useState<number | null>(null);
  /** Bản sao của `seeking` cho hàm chốt tua đọc — nghe sự kiện ở cửa sổ nên
   *  không thể phụ thuộc vào giá trị đóng gói trong closure lúc gắn. */
  const seekingRef = useRef<number | null>(null);
  const [volume, setVolume] = useState(() => {
    const saved = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.9;
  });
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');

  /* MỘT thẻ audio dùng lại cho mọi bài.
   *
   * Bản trước tạo `new Audio()` mỗi lần bấm phát rồi vứt đi. Như vậy thì không
   * bao giờ tua, chỉnh âm lượng hay chuyển bài được — mọi thứ đó cần một đối
   * tượng sống lâu hơn một lượt bấm. */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
  }
  /** Thứ tự phát khi bật xáo trộn. Giữ trong ref để đổi bài không dựng lại. */
  const shuffleOrder = useRef<number[]>([]);

  const refreshDownloaded = useCallback(async () => {
    const list = (await window.cuongthai?.music.listDownloaded()) ?? [];
    setDownloaded(new Map(list.map((t) => [t.trackId, t.size])));
    const u = await window.cuongthai?.music.usage();
    if (u) setUsage(u);
  }, []);

  useEffect(() => { void refreshDownloaded(); }, [refreshDownloaded]);

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
          : caught instanceof Error ? caught.message : String(caught),
      );
    } finally {
      setLoading(false);
    }
  }, [api, userId, online]);

  useEffect(() => { void loadTracks(); }, [loadTracks]);

  // ─── Hàng phát ───────────────────────────────────────────
  const visible = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return tracks;
    return tracks.filter((t) => fold(`${t.title} ${t.artist ?? ''}`).includes(needle));
  }, [tracks, query]);

  const current = useMemo(
    () => tracks.find((t) => t.id === currentId) ?? null,
    [tracks, currentId],
  );

  /* Hàng phát là DANH SÁCH ĐANG NHÌN THẤY, không phải toàn thư viện. Lọc còn
   * 5 bài rồi bấm "bài sau" mà nhảy sang một bài không có trên màn hình thì
   * người dùng không hiểu nó ở đâu ra. */
  const queue = visible.length > 0 ? visible : tracks;

  const playableSrc = useCallback((track: Track): string | null => {
    const isLocal = downloaded.has(track.id);
    if (isLocal) return `app://cuongthai/media/${track.id}`;
    if (!online) return null;
    return `${api?.baseUrlForForms() ?? ''}/api/v1/music/stream/${track.id}`;
  }, [downloaded, online, api]);

  const playTrack = useCallback((track: Track) => {
    const element = audioRef.current;
    if (!element) return;
    const src = playableSrc(track);
    if (!src) {
      setError(`"${track.title}" chưa tải về máy nên không nghe được khi ngoại tuyến.`);
      return;
    }
    setError(null);
    element.src = src;
    element.volume = muted ? 0 : volume;
    setCurrentId(track.id);
    setPosition(0);
    setLength(track.durationSeconds ?? 0);
    void element.play().then(
      () => setPlaying(true),
      () => { setError(`Không phát được "${track.title}".`); setPlaying(false); },
    );
    void window.cuongthai?.robot.baoNhac(`${track.title}${track.artist ? ` — ${track.artist}` : ''}`);
  }, [playableSrc, muted, volume]);

  const toggle = useCallback(() => {
    const element = audioRef.current;
    if (!element) return;
    if (!currentId) {
      const first = queue[0];
      if (first) playTrack(first);
      return;
    }
    if (element.paused) void element.play().then(() => setPlaying(true), () => undefined);
    else { element.pause(); setPlaying(false); }
  }, [currentId, queue, playTrack]);

  /** Bước tới bài kế trong hàng phát. `delta` âm là lùi. */
  const step = useCallback((delta: number) => {
    if (queue.length === 0) return;
    const ids = shuffle ? shuffleOrder.current : queue.map((t) => t.id);
    const order = ids.filter((id) => queue.some((t) => t.id === id));
    const list = order.length === queue.length ? order : queue.map((t) => t.id);
    const at = currentId === null ? -1 : list.indexOf(currentId);
    // Chưa phát gì thì "bài sau" là bài đầu tiên, không phải bài thứ hai.
    const nextIndex = at === -1 ? 0 : (at + delta + list.length) % list.length;
    const nextId = list[nextIndex];
    const track = queue.find((t) => t.id === nextId);
    if (track) playTrack(track);
  }, [queue, shuffle, currentId, playTrack]);

  // Dựng lại thứ tự xáo trộn mỗi khi bật, hoặc khi hàng phát đổi.
  useEffect(() => {
    if (shuffle) shuffleOrder.current = shuffled(queue.map((t) => t.id));
  }, [shuffle, queue]);

  // ─── Nối sự kiện của thẻ audio ──────────────────────────
  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;

    const onTime = () => setPosition(element.currentTime);
    const onMeta = () => { if (Number.isFinite(element.duration)) setLength(element.duration); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (repeat === 'one') { element.currentTime = 0; void element.play(); return; }
      // Hết danh sách mà không lặp thì DỪNG, không quay về đầu. Tự phát lại từ
      // đầu là thứ người dùng không yêu cầu và rất khó hiểu khi đang làm việc khác.
      const list = queue.map((t) => t.id);
      const at = currentId === null ? -1 : list.indexOf(currentId);
      const isLast = at === list.length - 1;
      if (isLast && repeat === 'off' && !shuffle) { setPlaying(false); return; }
      step(1);
    };
    const onError = () => { setError('Không phát được bài này.'); setPlaying(false); };

    element.addEventListener('timeupdate', onTime);
    element.addEventListener('loadedmetadata', onMeta);
    element.addEventListener('play', onPlay);
    element.addEventListener('pause', onPause);
    element.addEventListener('ended', onEnded);
    element.addEventListener('error', onError);
    return () => {
      element.removeEventListener('timeupdate', onTime);
      element.removeEventListener('loadedmetadata', onMeta);
      element.removeEventListener('play', onPlay);
      element.removeEventListener('pause', onPause);
      element.removeEventListener('ended', onEnded);
      element.removeEventListener('error', onError);
    };
  }, [repeat, queue, currentId, shuffle, step]);

  // Âm lượng: nhớ lại giữa các lần mở app.
  useEffect(() => {
    const element = audioRef.current;
    if (element) element.volume = muted ? 0 : volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume, muted]);

  /* Phím media của hệ điều hành + ô "đang phát" của macOS.
   *
   * Đây là thứ phân biệt một app desktop với một tab trình duyệt: bấm nút phát
   * trên bàn phím hay tai nghe phải có tác dụng kể cả khi app đang ẩn. */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist ?? '',
      artwork: current.coverImage ? [{ src: current.coverImage, sizes: '512x512' }] : [],
    });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    const set = (action: MediaSessionAction, handler: () => void) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* trình duyệt không hỗ trợ */ }
    };
    set('play', toggle);
    set('pause', toggle);
    set('previoustrack', () => step(-1));
    set('nexttrack', () => step(1));
  }, [current, playing, toggle, step]);

  /* Dừng nhạc khi rời trang — không dừng thì bài vẫn phát mà không còn nút tắt.
   *
   * ⚠️ Dọn thì chỉ DỪNG, TUYỆT ĐỐI không gán `audioRef.current = null`. Thẻ
   * audio được dựng một lần duy nhất trong thân hàm render (ở trên), nên hễ ref
   * bị xoá là không có gì dựng lại nó. Mà `<React.StrictMode>` (main.tsx) chạy
   * mỗi effect theo trình tự dựng → dọn → dựng lại NGAY trong một lần gắn, KHÔNG
   * render lại ở giữa: xoá ref ở bước dọn là toàn bộ trình phát chết câm khi
   * `npm run dev` — mọi nút đều thoát sớm ở `if (!element) return`, không lỗi
   * nào để thấy. Bản đóng gói không dính, tức là chỗ duy nhất hỏng lại đúng là
   * chỗ mình ngồi thử. */
  useEffect(() => {
    const element = audioRef.current;
    return () => {
      element?.pause();
      // Bỏ nguồn để buông kết nối đang tải dở; thẻ vẫn còn để dùng lại.
      if (element) element.removeAttribute('src');
    };
  }, []);

  /* Chốt lần tua khi người dùng thả tay.
   *
   * Nghe ở CỬA SỔ chứ không ở riêng thanh tua: kéo con trượt rồi thả tay ở ngoài
   * nó là chuyện thường (kéo vượt quá mép phải để nhảy tới cuối bài). Bắt
   * `onMouseUp` trên chính thẻ input thì lần thả đó rơi ra ngoài, `seeking` kẹt
   * lại mãi — số giờ phát đứng im ở chỗ vừa kéo trong khi bài vẫn chạy, và lần
   * tua ấy không bao giờ được áp. */
  useEffect(() => {
    if (seeking === null) return;
    const commit = () => {
      const value = seekingRef.current;
      seekingRef.current = null;
      if (value !== null && audioRef.current) audioRef.current.currentTime = value;
      setSeeking(null);
    };
    window.addEventListener('pointerup', commit);
    window.addEventListener('pointercancel', commit);
    window.addEventListener('keyup', commit);
    return () => {
      window.removeEventListener('pointerup', commit);
      window.removeEventListener('pointercancel', commit);
      window.removeEventListener('keyup', commit);
    };
  }, [seeking]);

  // Phím tắt. KHÔNG cướp phím khi con trỏ đang ở ô nhập, nếu không thì gõ tìm
  // kiếm một dấu cách là nhạc dừng.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      const element = audioRef.current;
      if (event.code === 'Space') { event.preventDefault(); toggle(); }
      else if (event.code === 'ArrowRight' && element) element.currentTime = Math.min(element.currentTime + 5, length || element.duration || 0);
      else if (event.code === 'ArrowLeft' && element) element.currentTime = Math.max(element.currentTime - 5, 0);
      else if (event.code === 'ArrowUp') { event.preventDefault(); setVolume((v) => Math.min(1, v + 0.05)); }
      else if (event.code === 'ArrowDown') { event.preventDefault(); setVolume((v) => Math.max(0, v - 0.05)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, length]);

  // ─── Tải về / xoá ───────────────────────────────────────
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
      setError(`Không tải được "${track.title}": ${caught instanceof Error ? caught.message : String(caught)}`);
    } finally {
      setDownloading((previous) => { const next = new Set(previous); next.delete(track.id); return next; });
    }
  };

  const remove = async (trackId: number) => {
    await window.cuongthai?.music.deleteAudio(trackId);
    if (currentId === trackId) { audioRef.current?.pause(); setPlaying(false); }
    await refreshDownloaded();
  };

  const offlineCount = downloaded.size;
  const shownPosition = seeking ?? position;
  const progress = length > 0 ? Math.min(100, (shownPosition / length) * 100) : 0;

  return (
    <div className="ct-music">
        <div className="ct-page-head" style={{ marginBottom: 14 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 19 }}>Nhạc</h1>
            <p className="ct-muted" style={{ margin: 0 }}>
              Nghe trực tuyến, hoặc tải về máy để nghe khi mất mạng.
            </p>
          </div>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void loadTracks()} disabled={!online}>
            <RefreshCw size={14} aria-hidden />
            Làm mới
          </button>
        </div>

        {/* ─── Đang phát ─── */}
        {current && (
          <section className="ct-np" aria-label="Đang phát">
            {/* Nền mờ lấy chính ảnh bìa: mỗi bài một sắc riêng mà không cần
                bảng màu gõ tay cho từng bài. */}
            {current.coverImage && (
              <div className="ct-np-wash" style={{ backgroundImage: `url(${current.coverImage})` }} aria-hidden />
            )}
            <div className="ct-np-body">
              <div className={`ct-vinyl${playing ? ' is-spinning' : ''}`} aria-hidden>
                <div className="ct-vinyl-disc">
                  {current.coverImage
                    ? <img src={current.coverImage} alt="" className="ct-vinyl-art" />
                    : <div className="ct-vinyl-art ct-vinyl-art-blank"><Music2 size={26} /></div>}
                  <span className="ct-vinyl-hole" />
                </div>
              </div>

              <div className="ct-np-meta">
                <p className="ct-np-eyebrow">Đang phát</p>
                <h2 className="ct-np-title" title={current.title}>{current.title}</h2>
                <p className="ct-np-artist">{current.artist || 'Không rõ nghệ sĩ'}</p>

                {/* Dải nhịp trang trí, KHÔNG phải phổ tần thật.
                    Phân tích phổ thật cần đưa audio qua Web Audio, mà luồng
                    nhạc là khác nguồn gốc với `app://` — làm vậy có thể khiến
                    cả bài phát ra IM LẶNG. Không đáng đánh đổi để lấy mấy cái
                    cột nhấp nháy. */}
                <div className={`ct-eq${playing ? ' is-live' : ''}`} aria-hidden>
                  {Array.from({ length: 28 }, (_, i) => (
                    <span key={i} style={{ animationDelay: `${(i % 7) * 90}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Thanh công cụ danh sách ─── */}
        <div className="ct-music-toolbar">
          <label className="ct-music-search">
            <Search size={14} aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm bài hát hoặc nghệ sĩ…"
              aria-label="Tìm bài hát"
            />
          </label>
          {offlineCount > 0 && (
            <span className="ct-music-usage">
              <HardDrive size={13} aria-hidden />
              {usage.count} bài · {formatBytes(usage.totalBytes)}
              <button
                type="button"
                className="ct-linklike"
                onClick={() => {
                  if (window.confirm(`Xoá toàn bộ ${usage.count} bài đã tải? Tải lại được khi có mạng.`)) {
                    audioRef.current?.pause();
                    void window.cuongthai?.music.clearAll().then(refreshDownloaded);
                  }
                }}
              >
                Xoá hết
              </button>
            </span>
          )}
        </div>

        {!online && (
          <div className="ct-notice" data-tone="warn">
            <CloudOff size={15} aria-hidden />
            <span>Đang ngoại tuyến — chỉ nghe được {offlineCount} bài đã tải về máy.</span>
          </div>
        )}

        {error && (
          <div className="ct-notice" data-tone="err" role="alert">
            <span>{error}</span>
            <button type="button" className="ct-linklike" onClick={() => setError(null)}>Đóng</button>
          </div>
        )}

        {loading && tracks.length === 0 && <p>Đang tải…</p>}

        {visible.length > 0 && (
          <ol className="ct-tracks">
            {visible.map((track, index) => {
              const isDownloaded = downloaded.has(track.id);
              const isDownloading = downloading.has(track.id);
              const isCurrent = currentId === track.id;
              const playable = isDownloaded || online;

              return (
                <li
                  key={track.id}
                  className="ct-trk"
                  data-current={isCurrent}
                  onDoubleClick={() => playable && playTrack(track)}
                >
                  <span className="ct-trk-index">
                    {isCurrent && playing
                      ? <span className="ct-trk-bars" aria-label="đang phát"><i /><i /><i /></span>
                      : index + 1}
                  </span>

                  <button
                    type="button"
                    className="ct-trk-art"
                    onClick={() => (isCurrent ? toggle() : playTrack(track))}
                    disabled={!playable}
                    aria-label={isCurrent && playing ? `Tạm dừng ${track.title}` : `Phát ${track.title}`}
                    title={!playable ? 'Chưa tải về máy — cần mạng để nghe' : undefined}
                  >
                    {track.coverImage
                      ? <img src={track.coverImage} alt="" loading="lazy" />
                      : <span className="ct-trk-art-blank"><Music2 size={15} aria-hidden /></span>}
                    <span className="ct-trk-art-veil">
                      {isCurrent && playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
                    </span>
                  </button>

                  <span className="ct-trk-main">
                    <span className="ct-trk-title" title={track.title}>{track.title}</span>
                    <span className="ct-trk-artist">{track.artist || 'Không rõ nghệ sĩ'}</span>
                  </span>

                  {isDownloaded && (
                    <span className="ct-offline-tag" title="Đã có trên máy">
                      <CheckCircle2 size={11} aria-hidden /> đã tải
                    </span>
                  )}

                  <span className="ct-trk-time">{clock(track.durationSeconds)}</span>

                  {isDownloaded ? (
                    <button
                      type="button"
                      className="ct-trk-action"
                      onClick={() => void remove(track.id)}
                      aria-label={`Xoá bản tải về của ${track.title}`}
                      title="Xoá bản đã tải"
                    >
                      <Trash2 size={14} aria-hidden />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="ct-trk-action"
                      onClick={() => void download(track)}
                      disabled={!online || isDownloading}
                      aria-label={`Tải ${track.title} về máy`}
                      title={online ? 'Tải về nghe offline' : 'Cần mạng để tải'}
                    >
                      {isDownloading ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Download size={14} aria-hidden />}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {!loading && tracks.length > 0 && visible.length === 0 && (
          <div className="ct-empty">
            <Search size={26} aria-hidden className="ct-empty-icon" />
            <p>Không có bài nào khớp “{query}”.</p>
          </div>
        )}

        {!loading && tracks.length === 0 && !error && (
          <div className="ct-empty">
            <Music2 size={28} aria-hidden className="ct-empty-icon" />
            <p>Chưa có bài hát nào.</p>
          </div>
        )}

      {/* ─── Thanh phát, luôn ở đáy ─── */}
      {current && (
        <div className="ct-player" role="group" aria-label="Điều khiển phát nhạc">
          <div className="ct-player-now">
            {current.coverImage
              ? <img src={current.coverImage} alt="" className="ct-player-art" />
              : <span className="ct-player-art ct-trk-art-blank"><Music2 size={16} aria-hidden /></span>}
            <span className="ct-player-text">
              <span className="ct-player-title" title={current.title}>{current.title}</span>
              <span className="ct-player-artist">{current.artist || 'Không rõ nghệ sĩ'}</span>
            </span>
          </div>

          <div className="ct-player-mid">
            <div className="ct-player-buttons">
              <button
                type="button"
                className={`ct-pbtn${shuffle ? ' is-on' : ''}`}
                onClick={() => setShuffle((s) => !s)}
                aria-pressed={shuffle}
                aria-label="Phát ngẫu nhiên"
                title="Phát ngẫu nhiên"
              >
                <Shuffle size={15} aria-hidden />
              </button>
              <button type="button" className="ct-pbtn" onClick={() => step(-1)} aria-label="Bài trước" title="Bài trước">
                <SkipBack size={17} aria-hidden />
              </button>
              <button
                type="button"
                className="ct-pbtn ct-pbtn-main"
                onClick={toggle}
                aria-label={playing ? 'Tạm dừng' : 'Phát'}
                title={playing ? 'Tạm dừng (Space)' : 'Phát (Space)'}
              >
                {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
              </button>
              <button type="button" className="ct-pbtn" onClick={() => step(1)} aria-label="Bài sau" title="Bài sau">
                <SkipForward size={17} aria-hidden />
              </button>
              <button
                type="button"
                className={`ct-pbtn${repeat !== 'off' ? ' is-on' : ''}`}
                onClick={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))}
                aria-label={repeat === 'one' ? 'Lặp một bài' : repeat === 'all' ? 'Lặp danh sách' : 'Không lặp'}
                title={repeat === 'one' ? 'Lặp một bài' : repeat === 'all' ? 'Lặp danh sách' : 'Không lặp'}
              >
                {repeat === 'one' ? <Repeat1 size={15} aria-hidden /> : <Repeat size={15} aria-hidden />}
              </button>
            </div>

            <div className="ct-seek">
              <span className="ct-seek-time">{clock(shownPosition)}</span>
              {/* `range` thật chứ không phải div tự vẽ: kéo được bằng bàn phím,
                  trình đọc màn hình đọc được, và không phải tự xử lý chuột. */}
              <input
                type="range"
                className="ct-seek-bar"
                min={0}
                max={Math.max(1, Math.floor(length))}
                value={Math.floor(shownPosition)}
                style={{ ['--ct-progress' as string]: `${progress}%` }}
                onChange={(event) => {
                  seekingRef.current = Number(event.target.value);
                  setSeeking(seekingRef.current);
                }}
                aria-label="Tua bài hát"
              />
              <span className="ct-seek-time">{clock(length)}</span>
            </div>
          </div>

          <div className="ct-player-right">
            <button
              type="button"
              className="ct-pbtn"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
              title={muted ? 'Bật tiếng' : 'Tắt tiếng'}
            >
              {muted || volume === 0 ? <VolumeX size={16} aria-hidden />
                : volume < 0.5 ? <Volume1 size={16} aria-hidden />
                  : <Volume2 size={16} aria-hidden />}
            </button>
            <input
              type="range"
              className="ct-vol"
              min={0}
              max={100}
              value={Math.round((muted ? 0 : volume) * 100)}
              style={{ ['--ct-progress' as string]: `${Math.round((muted ? 0 : volume) * 100)}%` }}
              onChange={(event) => { setMuted(false); setVolume(Number(event.target.value) / 100); }}
              aria-label="Âm lượng"
            />
          </div>
        </div>
      )}
    </div>
  );
}
