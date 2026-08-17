/**
 * Trình phát nhạc CỦA CẢ APP — không thuộc trang nào.
 *
 * ⛔ Vì sao phải nằm ở đây chứ không nằm trong `MusicPage`:
 *
 * Thẻ <audio> trước đây do `MusicPage` giữ. Rời khỏi mục Nhạc là React tháo
 * trang đó, hàm dọn dừng nhạc, và toàn bộ trạng thái (đang phát bài nào, tới
 * giây thứ mấy) biến mất — quay lại thì phải dò tìm bài cũ rồi nghe lại từ
 * đầu. Bấm vào con robot ở góc màn hình cũng vậy, vì nó đổi trang.
 *
 * Không app nghe nhạc nào làm thế. Nhạc phải sống ngoài trang: provider này
 * gắn MỘT lần ở `App.tsx`, cao hơn vùng nội dung, nên chuyển trang không
 * đụng tới nó. Trang Nhạc chỉ còn là phần NHÌN.
 *
 * ⚠️ Hàng phát ĐÓNG BĂNG lúc bấm phát (`playTrack(bai, danhSach)`), không bám
 * theo ô tìm kiếm. Bám theo ô tìm thì đang nghe mà gõ một chữ là "bài sau" đổi
 * nghĩa ngay dưới tay người dùng.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OfflineUnavailableError, swr } from '../../offline/cache';

export interface Track {
  id: number;
  title: string;
  artist?: string | null;
  durationSeconds?: number | null;
  coverImage?: string | null;
  /** Với bài lấy từ YouTube, đây là link `watch?v=…` chứ không phải file nhạc. */
  audioUrl?: string | null;
}

/**
 * Bài này còn trỏ vào YouTube, chưa có file nhạc trên máy chủ?
 *
 * Trang WEB phát được những bài đó bằng khung nhúng YouTube
 * (`isYouTubeUrl` trong `MusicAudioController`). App thì không: nó phát bằng
 * thẻ <audio>, mà `GET /music/stream/:id` với một dòng như vậy trả **400**
 * (đo thật trên prod: bài id 51 → 400, bài thường → 200). Không nhận ra thì
 * người dùng chỉ thấy "Không phát được bài này" mà không hiểu vì sao — trong
 * khi cùng bài ấy nghe được trên web.
 */
export function laBaiYouTube(track: Track): boolean {
  return /youtube\.com|youtu\.be/.test(track.audioUrl ?? '');
}

export type RepeatMode = 'off' | 'all' | 'one';

const VOLUME_KEY = 'ct-music-volume';

/** Backend có thể trả mảng trần hoặc bọc trong `{ tracks }` / `{ items }` / `{ data }`. */
export function asTracks(payload: unknown): Track[] {
  if (Array.isArray(payload)) return payload as Track[];
  const wrapped = payload as { tracks?: unknown; items?: unknown; data?: unknown };
  for (const candidate of [wrapped.tracks, wrapped.items, wrapped.data]) {
    if (Array.isArray(candidate)) return candidate as Track[];
  }
  return [];
}

/**
 * Lấy TOÀN BỘ thư viện, không phải trang đầu.
 *
 * ⚠️ `GET /music/tracks` mặc định `size = 20` (`music.service.ts`). Bản trước gọi
 * trần không tham số nên app chỉ bao giờ thấy 20 bài trong khi web — vốn gọi
 * `size: 100` — thấy đủ cả 66. Nhìn màn hình thì tưởng mất bài, thật ra là hụt
 * trang.
 *
 * Đi tiếp khi trang vừa rồi ĐẦY, dừng khi hụt: không cần đọc `pagination` (mà
 * `request()` cũng nuốt mất, nó chỉ trả `envelope.data`). Trần 5 trang = 500
 * bài, đủ xa để không chạm mà vẫn không thành vòng lặp vô tận nếu máy chủ trả sai.
 */
async function layTatCaBai(api: { request<T>(path: string): Promise<T> }): Promise<Track[]> {
  const SIZE = 100;
  const tatCa: Track[] = [];
  for (let trang = 1; trang <= 5; trang++) {
    const lo = asTracks(await api.request<unknown>(`/api/v1/music/tracks?page=${trang}&size=${SIZE}&category=NORMAL`));
    tatCa.push(...lo);
    if (lo.length < SIZE) break;
  }
  return tatCa;
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

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/** `m:ss`. Trả `--:--` khi chưa biết, để thanh tua không nhảy số lung tung. */
export function clock(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Bỏ dấu để tìm "duong" ra "Đường" — cùng luật với phần Ghi chú. */
export function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

/** Xáo trộn Fisher–Yates, trả mảng MỚI. */
export function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

interface MusicPlayerValue {
  // Thư viện
  tracks: Track[];
  loading: boolean;
  error: string | null;
  setError: (message: string | null) => void;
  loadTracks: () => Promise<void>;
  downloaded: Map<number, number>;
  downloading: Set<number>;
  usage: { count: number; totalBytes: number };
  download: (track: Track) => Promise<void>;
  remove: (trackId: number) => Promise<void>;
  clearAll: () => Promise<void>;
  // Phát
  current: Track | null;
  currentId: number | null;
  playing: boolean;
  position: number;
  length: number;
  shownPosition: number;
  playTrack: (track: Track, danhSach?: Track[]) => void;
  toggle: () => void;
  step: (delta: number) => void;
  batDauTua: (giay: number) => void;
  chotTua: () => void;
  /** Nhảy thẳng tới giây thứ N (phím mũi tên). Kẹp trong [0, độ dài]. */
  tuaToi: (giay: number) => void;
  volume: number;
  setVolume: (value: number | ((previous: number) => number)) => void;
  muted: boolean;
  setMuted: (value: boolean | ((previous: boolean) => boolean)) => void;
  shuffle: boolean;
  setShuffle: (value: boolean | ((previous: boolean) => boolean)) => void;
  repeat: RepeatMode;
  setRepeat: (value: RepeatMode | ((previous: RepeatMode) => RepeatMode)) => void;
}

const Ctx = createContext<MusicPlayerValue | null>(null);

export function useMusicPlayer(): MusicPlayerValue {
  const value = useContext(Ctx);
  if (!value) throw new Error('useMusicPlayer phải nằm trong <MusicPlayerProvider>');
  return value;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const { online } = useAppState();
  const { api, userId } = useSession();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [downloaded, setDownloaded] = useState<Map<number, number>>(new Map());
  const [downloading, setDownloading] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ count: 0, totalBytes: 0 });

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [length, setLength] = useState(0);
  const [seeking, setSeeking] = useState<number | null>(null);
  const seekingRef = useRef<number | null>(null);
  const [volume, setVolume] = useState(() => {
    const saved = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(saved) && saved > 0 && saved <= 1 ? saved : 0.9;
  });
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');

  /* MỘT thẻ audio cho cả vòng đời app.
   *
   * Provider này gắn một lần ở gốc nên thẻ không bao giờ bị tháo giữa chừng —
   * đó chính là điều làm nhạc không đứt khi chuyển trang. */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
  }
  /** Hàng phát: chốt lúc bấm phát, KHÔNG bám theo ô tìm kiếm. */
  const [queue, setQueue] = useState<Track[]>([]);
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
        fetcher: () => layTatCaBai(api),
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

  const current = useMemo(
    () => tracks.find((t) => t.id === currentId) ?? queue.find((t) => t.id === currentId) ?? null,
    [tracks, queue, currentId],
  );

  const playableSrc = useCallback((track: Track): string | null => {
    if (downloaded.has(track.id)) return `app://cuongthai/media/${track.id}`;
    if (!online) return null;
    // Bài còn trỏ vào YouTube thì `/stream/:id` trả 400 — chặn ở đây để báo cho
    // ra lý do, thay vì để thẻ <audio> ném ra "Không phát được bài này".
    if (laBaiYouTube(track)) return null;
    return `${api?.baseUrlForForms() ?? ''}/api/v1/music/stream/${track.id}`;
  }, [downloaded, online, api]);

  const playTrack = useCallback((track: Track, danhSach?: Track[]) => {
    const element = audioRef.current;
    if (!element) return;
    const src = playableSrc(track);
    if (!src) {
      setError(
        laBaiYouTube(track) && online
          ? `"${track.title}" lấy từ YouTube và chưa được rút âm thanh về máy chủ. Bấm nút bên phải dòng đó để rút (10-60 giây), sau đó nghe được như mọi bài khác.`
          : `"${track.title}" chưa tải về máy nên không nghe được khi ngoại tuyến.`,
      );
      return;
    }
    setError(null);
    if (danhSach && danhSach.length > 0) {
      setQueue(danhSach);
      shuffleOrder.current = shuffled(danhSach.map((t) => t.id));
    }
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
      const first = queue[0] ?? tracks[0];
      if (first) playTrack(first, queue.length > 0 ? queue : tracks);
      return;
    }
    if (element.paused) void element.play().then(() => setPlaying(true), () => undefined);
    else { element.pause(); setPlaying(false); }
  }, [currentId, queue, tracks, playTrack]);

  /** Bước tới bài kế trong hàng phát. `delta` âm là lùi. */
  const step = useCallback((delta: number) => {
    const hang = queue.length > 0 ? queue : tracks;
    if (hang.length === 0) return;
    const ids = shuffle ? shuffleOrder.current : hang.map((t) => t.id);
    const order = ids.filter((id) => hang.some((t) => t.id === id));
    const list = order.length === hang.length ? order : hang.map((t) => t.id);
    const at = currentId === null ? -1 : list.indexOf(currentId);
    // Chưa phát gì thì "bài sau" là bài đầu tiên, không phải bài thứ hai.
    const nextIndex = at === -1 ? 0 : (at + delta + list.length) % list.length;
    const track = hang.find((t) => t.id === list[nextIndex]);
    if (track) playTrack(track);
  }, [queue, tracks, shuffle, currentId, playTrack]);

  // Dựng lại thứ tự xáo trộn mỗi khi BẬT xáo trộn.
  useEffect(() => {
    if (shuffle) shuffleOrder.current = shuffled((queue.length > 0 ? queue : tracks).map((t) => t.id));
  }, [shuffle, queue, tracks]);

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
      const hang = queue.length > 0 ? queue : tracks;
      const list = hang.map((t) => t.id);
      const at = currentId === null ? -1 : list.indexOf(currentId);
      if (at === list.length - 1 && repeat === 'off' && !shuffle) { setPlaying(false); return; }
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
  }, [repeat, queue, tracks, currentId, shuffle, step]);

  // Âm lượng: nhớ lại giữa các lần mở app.
  useEffect(() => {
    const element = audioRef.current;
    if (element) element.volume = muted ? 0 : volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume, muted]);

  /* Phím media của hệ điều hành + ô "đang phát" của macOS. Đây là thứ phân biệt
   * một app desktop với một tab trình duyệt: nút phát trên bàn phím hay tai
   * nghe phải có tác dụng kể cả khi app đang ẩn. */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist ?? '',
      artwork: current.coverImage ? [{ src: current.coverImage, sizes: '512x512' }] : [],
    });
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    const set = (action: MediaSessionAction, handler: () => void) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* không hỗ trợ */ }
    };
    set('play', toggle);
    set('pause', toggle);
    set('previoustrack', () => step(-1));
    set('nexttrack', () => step(1));
  }, [current, playing, toggle, step]);

  // ─── Tua ────────────────────────────────────────────────
  const batDauTua = useCallback((giay: number) => {
    seekingRef.current = giay;
    setSeeking(giay);
  }, []);
  const chotTua = useCallback(() => {
    const giaTri = seekingRef.current;
    seekingRef.current = null;
    if (giaTri !== null && audioRef.current) audioRef.current.currentTime = giaTri;
    setSeeking(null);
  }, []);
  /* Chốt lần tua khi người dùng thả tay — nghe ở CỬA SỔ, không ở riêng thanh tua.
   * Kéo con trượt vượt quá mép rồi thả tay ở ngoài nó là chuyện thường; bắt
   * `onMouseUp` trên chính thẻ input thì lần thả đó rơi mất, `seeking` kẹt lại
   * mãi và lần tua ấy không bao giờ được áp. */
  useEffect(() => {
    if (seeking === null) return;
    window.addEventListener('pointerup', chotTua);
    window.addEventListener('pointercancel', chotTua);
    window.addEventListener('keyup', chotTua);
    return () => {
      window.removeEventListener('pointerup', chotTua);
      window.removeEventListener('pointercancel', chotTua);
      window.removeEventListener('keyup', chotTua);
    };
  }, [seeking, chotTua]);

  const tuaToi = useCallback((giay: number) => {
    const element = audioRef.current;
    if (!element) return;
    const tran = Number.isFinite(element.duration) ? element.duration : (length || 0);
    element.currentTime = Math.max(0, tran > 0 ? Math.min(giay, tran) : giay);
  }, [length]);

  // ─── Tải về / xoá ───────────────────────────────────────
  const download = useCallback(async (track: Track) => {
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
  }, [api, downloading, refreshDownloaded]);

  const remove = useCallback(async (trackId: number) => {
    await window.cuongthai?.music.deleteAudio(trackId);
    if (currentId === trackId) { audioRef.current?.pause(); setPlaying(false); }
    await refreshDownloaded();
  }, [currentId, refreshDownloaded]);

  const clearAll = useCallback(async () => {
    audioRef.current?.pause();
    await window.cuongthai?.music.clearAll();
    await refreshDownloaded();
  }, [refreshDownloaded]);

  const value = useMemo<MusicPlayerValue>(() => ({
    tracks, loading, error, setError, loadTracks,
    downloaded, downloading, usage, download, remove, clearAll,
    current, currentId, playing, position, length,
    shownPosition: seeking ?? position,
    playTrack, toggle, step, batDauTua, chotTua, tuaToi,
    volume, setVolume, muted, setMuted, shuffle, setShuffle, repeat, setRepeat,
  }), [
    tracks, loading, error, loadTracks, downloaded, downloading, usage, download, remove, clearAll,
    current, currentId, playing, position, length, seeking,
    playTrack, toggle, step, batDauTua, chotTua, tuaToi, volume, muted, shuffle, repeat,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
