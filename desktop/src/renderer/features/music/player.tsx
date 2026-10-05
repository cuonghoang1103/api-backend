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
import { doNhip, type DoNhip } from './nhipNhac';

export interface Track {
  id: number;
  title: string;
  artist?: string | null;
  durationSeconds?: number | null;
  coverImage?: string | null;
  /** Với bài lấy từ YouTube, đây là link `watch?v=…` chứ không phải file nhạc. */
  audioUrl?: string | null;
  /** Loại Nhạc Việt / Anh / Trung do người dùng gán (05/10/2026). Trống ⇒ `loaiNhac()` tự đoán. */
  language?: LoaiNhac | null;
}

export type LoaiNhac = 'vi' | 'en' | 'zh';
const CO_DAU_VIET = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
/**
 * Loại của một bài: nhãn người dùng gán thắng; chưa gán thì đoán theo tên bài + nghệ sĩ —
 * có chữ Hán (không kèm kana Nhật) ⇒ Trung, có dấu tiếng Việt ⇒ Việt, chỉ chữ Latin ⇒ Anh.
 * Đoán sai thì người dùng sửa ở menu ⋯ của bài ("Loại nhạc").
 */
export function loaiNhac(t: Track): LoaiNhac | null {
  if (t.language === 'vi' || t.language === 'en' || t.language === 'zh') return t.language;
  const chu = `${t.title} ${t.artist ?? ''}`;
  if (/[\u4e00-\u9fff]/.test(chu) && !/[\u3040-\u30ff]/.test(chu)) return 'zh';
  if (CO_DAU_VIET.test(chu)) return 'vi';
  if (/^[\x20-\x7e\u2018-\u201d\u00c0-\u00ff]+$/.test(chu) && /[a-z]/i.test(chu)) return 'en';
  return null;
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

/**
 * Bộ chỉnh âm — năm kiểu dựng sẵn, không cho kéo từng dải.
 * Người nghe nhạc để thư giãn không muốn làm kỹ sư âm thanh; họ muốn chọn
 * "dịu tai" và xong. Ba con số là dB cho trầm · giữa · bổng (xem `nhipNhac.ts`).
 */
export type MaEq = 'phang' | 'tram' | 'giong' | 'dem' | 'sang';
export const EQ_SAN: Record<MaEq, readonly [number, number, number]> = {
  phang: [0, 0, 0],
  tram: [6, 0, -1],
  giong: [-2, 4, 1.5],
  dem: [3, -1, -7],
  sang: [-1, 1, 5],
};
const EQ_KEY = 'ct-music-eq';

/** Hẹn giờ tắt: mốc thời gian (ms) hoặc "hết bài này". */
export type HenGio = number | 'het-bai' | null;
/** Nhỏ dần trong bấy nhiêu giây cuối rồi mới dừng — tắt phụt là giật mình tỉnh. */
export const GIAY_NHO_DAN = 8;

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
  loadTracks: (epMoi?: boolean) => Promise<void>;
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
  /** Mức năng lượng âm thanh 0..1 để cảnh nền nhảy theo. 0 = không đọc được. */
  mucNhip: () => number;
  muted: boolean;
  setMuted: (value: boolean | ((previous: boolean) => boolean)) => void;
  shuffle: boolean;
  setShuffle: (value: boolean | ((previous: boolean) => boolean)) => void;
  repeat: RepeatMode;
  setRepeat: (value: RepeatMode | ((previous: RepeatMode) => RepeatMode)) => void;
  // Hàng chờ
  /** Các bài SẮP phát, theo đúng thứ tự (đã tính trộn bài). */
  tiepTheo: Track[];
  /** Chèn ngay sau bài đang phát. */
  phatTiep: (track: Track) => void;
  /** Thêm vào cuối hàng chờ. */
  themVaoHang: (track: Track) => void;
  boKhoiHang: (trackId: number) => void;
  /** Kéo-thả trong "Tiếp theo": đưa `trackId` lên đứng ngay TRƯỚC `truocId`. */
  doiChoHang: (trackId: number, truocId: number) => void;
  // Thích
  daThich: Set<number>;
  doiThich: (track: Track) => Promise<void>;
  /** Tăng mỗi lần ghi lịch sử nghe — để trang biết nạp lại "Nghe gần đây". */
  nhipLichSu: number;
  // Bộ chỉnh âm
  eq: MaEq;
  datEq: (ma: MaEq) => void;
  /** `false` khi nguồn thiếu CORS buộc bỏ Web Audio — EQ không áp được. */
  eqDuoc: boolean;
  // Hẹn giờ tắt
  henGio: HenGio;
  /** Số giây còn lại (0 khi không hẹn hoặc hẹn "hết bài"). */
  henGioConLai: number;
  datHenGio: (phut: number | 'het-bai' | null) => void;
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
  const currentIdRef = useRef<number | null>(null);
  currentIdRef.current = currentId;
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
  const [daThich, setDaThich] = useState<Set<number>>(new Set());
  const [nhipLichSu, setNhipLichSu] = useState(0);
  const [eq, setEqState] = useState<MaEq>(() => {
    try {
      const v = localStorage.getItem(EQ_KEY);
      return v && v in EQ_SAN ? (v as MaEq) : 'phang';
    } catch { return 'phang'; }
  });
  const [eqDuoc, setEqDuoc] = useState(true);
  const [henGio, setHenGioState] = useState<HenGio>(null);
  const [henGioConLai, setHenGioConLai] = useState(0);

  /* MỘT thẻ audio cho cả vòng đời app.
   *
   * Provider này gắn một lần ở gốc nên thẻ không bao giờ bị tháo giữa chừng —
   * đó chính là điều làm nhạc không đứt khi chuyển trang. */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
    /*
     * `crossOrigin` PHẢI đặt trước khi nạp — nó là điều kiện để `AnalyserNode`
     * đọc được sóng âm (thiếu thì trình duyệt trả dải toàn 0, im lặng, không
     * lỗi). Đo thật 05/09/2026: `api.cuongthai.com` trả
     * `access-control-allow-origin: app://cuongthai`, R2 được PROXY qua chính
     * API đó, và URL ngoài bị máy chủ từ chối thẳng — nên mọi đường phát đều
     * qua host có CORS.
     *
     * Vẫn có chốt canh ở dưới (`canhCam`): nếu gặp một nguồn thiếu CORS thì
     * Web Audio làm CÂM HẲN bài đó, và không gỡ nối lại được trên cùng một
     * phần tử. Chốt sẽ dựng thẻ mới không `crossOrigin` và phát tiếp.
     */
    audioRef.current.crossOrigin = 'anonymous';
  }

  /** Bộ đọc nhịp, tạo LƯỜI ở lần phát đầu (cần một cú bấm của người dùng). */
  const nhipRef = useRef<DoNhip | null>(null);
  const nhipHong = useRef(false);
  const mucNhip = useCallback(() => nhipRef.current?.muc() ?? 0, []);
  const eqRef = useRef<MaEq>(eq);
  eqRef.current = eq;
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

  /** `epMoi` = bỏ qua đệm. Dùng sau khi XOÁ/THÊM — xem chú thích ở `swr`. */
  const loadTracks = useCallback(async (epMoi = false) => {
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
        epMoi,
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

  /*
   * CHỐT CANH CÂM.
   *
   * Nếu một nguồn thiếu CORS lọt qua, Web Audio KHÔNG báo lỗi — nó chỉ trả về
   * im lặng, trong khi thanh tiến độ vẫn chạy. Người dùng thấy "bài này bị lỗi
   * âm", không có cách nào đoán ra nguyên nhân.
   *
   * Cách nhận ra: đang phát, `currentTime` VẪN TIẾN, mà biên độ đứng đúng 0
   * suốt 3 giây. Nhạc thật gần như không bao giờ im tuyệt đối lâu vậy.
   *
   * Cách chữa: `createMediaElementSource` gắn vĩnh viễn vào phần tử, không gỡ
   * được — nên phải DỰNG THẺ MỚI, lần này không `crossOrigin`, rồi phát tiếp
   * từ đúng giây đang dở. Mất hiệu ứng nhịp, giữ được tiếng.
   */
  useEffect(() => {
    if (!playing || !nhipRef.current || nhipHong.current) return;
    let im = 0;
    let mocTruoc = audioRef.current?.currentTime ?? 0;
    const nhip = setInterval(() => {
      const el = audioRef.current;
      if (!el) return;
      const tien = el.currentTime > mocTruoc + 0.2;
      mocTruoc = el.currentTime;
      im = tien && mucNhip() === 0 ? im + 1 : 0;
      if (im < 6) return; // 6 × 500ms = 3 giây

      clearInterval(nhip);
      nhipHong.current = true;
      nhipRef.current?.dong();
      nhipRef.current = null;
      setEqDuoc(false);

      const moi = new Audio();          // KHÔNG đặt crossOrigin
      const mocDangDo = el.currentTime;
      moi.src = el.src;
      moi.volume = el.volume;
      /* ⚠️ ĐẶT `currentTime` SAU khi có metadata, không phải ngay.
       * Thẻ vừa tạo chưa biết bài dài bao nhiêu, nên gán `currentTime` lúc này
       * bị BỎ QUA IM LẶNG và bài phát lại từ giây 0 — người dùng đang nghe dở
       * bỗng về đầu, không có lỗi nào. */
      moi.addEventListener('loadedmetadata', () => {
        try { moi.currentTime = mocDangDo; } catch { /* chịu */ }
      }, { once: true });
      el.pause();
      audioRef.current = moi;
      void moi.play();
      console.warn('[nhạc] nguồn không có CORS — bỏ hiệu ứng nhịp để giữ tiếng');
    }, 500);
    return () => clearInterval(nhip);
  }, [playing, mucNhip]);


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
      // Bài vừa bấm đứng ĐẦU thứ tự trộn — để "Tiếp theo" là phần còn lại.
      shuffleOrder.current = [track.id, ...shuffled(danhSach.map((t) => t.id).filter((id) => id !== track.id))];
    }
    element.src = src;
    element.volume = muted ? 0 : volume;
    setCurrentId(track.id);
    setPosition(0);
    setLength(track.durationSeconds ?? 0);
    /* Tạo bộ đọc nhịp ở đây, không phải lúc dựng provider: `AudioContext` tạo
       trước cú bấm đầu tiên sẽ ở trạng thái `suspended` và im lặng mãi. */
    if (!nhipRef.current && !nhipHong.current) {
      nhipRef.current = doNhip(element);
      if (!nhipRef.current) { nhipHong.current = true; setEqDuoc(false); }
      else { const [t, g, b] = EQ_SAN[eqRef.current]; nhipRef.current.datEq(t, g, b); }
    }

    void element.play().then(
      () => setPlaying(true),
      () => { setError(`Không phát được "${track.title}".`); setPlaying(false); },
    );
    void window.cuongthai?.robot.baoNhac(`${track.title}${track.artist ? ` — ${track.artist}` : ''}`);
  }, [playableSrc, muted, volume, online]);

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
    /* BỎ QUA bài không phát được (YouTube chưa rút âm thanh, hoặc chưa tải khi
       mất mạng). Không bỏ qua thì "bài sau" dừng chết ở dòng đó với một câu
       báo lỗi, giữa lúc người ta đang nghe liền mạch. */
    const huong = delta < 0 ? -1 : 1;
    for (let buoc = 0; buoc < list.length; buoc++) {
      // Chưa phát gì thì "bài sau" là bài đầu tiên, không phải bài thứ hai.
      const nextIndex = at === -1
        ? (buoc % list.length)
        : (((at + delta + huong * buoc) % list.length) + list.length) % list.length;
      const track = hang.find((t) => t.id === list[nextIndex]);
      if (track && playableSrc(track)) { playTrack(track); return; }
    }
  }, [queue, tracks, shuffle, currentId, playTrack, playableSrc]);

  /*
   * PHÍM MEDIA của bàn phím (kể cả khi app không ở trước) — main gửi xuống qua
   * `nhac:phim`. Đặt ở provider chứ không ở trang Nhạc: người ta bấm Play khi
   * đang ở trang khác, hoặc khi app đang chạy nền, và đó chính là lúc phím này
   * đáng giá nhất.
   */
  useEffect(() => {
    const bo = window.cuongthai?.on('nhac:phim', (p) => {
      const viec = (p as { viec?: string } | null)?.viec;
      if (viec === 'toggle') toggle();
      else if (viec === 'sau') step(1);
      else if (viec === 'truoc') step(-1);
    });
    return () => { bo?.(); };
  }, [toggle, step]);

  // Dựng lại thứ tự xáo trộn mỗi khi BẬT xáo trộn.
  /* Chỉ khi BẬT trộn (hoặc thư viện đổi cỡ), KHÔNG mỗi lần `queue` đổi: chèn
     "phát tiếp theo" cũng đổi `queue`, và trộn lại lúc đó là vứt đi đúng chỗ
     người dùng vừa chèn. Bài đang phát được đưa lên đầu thứ tự mới, để "bài
     sau" là bài trộn đầu tiên chứ không phải nhảy lung tung về trước. */
  const hangDai = (queue.length > 0 ? queue : tracks).length;
  const [phienTron, setPhienTron] = useState(0);
  const tronTruoc = useRef(false);
  useEffect(() => {
    const vuaBat = shuffle && !tronTruoc.current;
    tronTruoc.current = shuffle;
    if (!shuffle) return;
    const hang = queue.length > 0 ? queue : tracks;
    /* Thứ tự hiện có đã khớp đúng hàng (vừa bấm phát / vừa chèn bài) thì GIỮ —
       chỉ trộn mới khi người dùng vừa bật trộn hoặc hàng đổi mà thứ tự lệch. */
    const ids = new Set(hang.map((t) => t.id));
    const khop = shuffleOrder.current.length === ids.size && shuffleOrder.current.every((id) => ids.has(id));
    if (!vuaBat && khop) { setPhienTron((n) => n + 1); return; }
    const tron = shuffled(hang.map((t) => t.id).filter((id) => id !== currentIdRef.current));
    shuffleOrder.current = currentIdRef.current !== null ? [currentIdRef.current, ...tron] : tron;
    setPhienTron((n) => n + 1); // để "Tiếp theo" đọc lại thứ tự vừa trộn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle, hangDai]);

  // ─── Nối sự kiện của thẻ audio ──────────────────────────
  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;

    const onTime = () => setPosition(element.currentTime);
    const onMeta = () => { if (Number.isFinite(element.duration)) setLength(element.duration); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      // Hẹn "hết bài này" ⇒ dừng đúng ở đây, không sang bài kế.
      if (henGioRef.current === 'het-bai') { setPlaying(false); setHenGioState(null); return; }
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
    if (element) element.volume = (muted ? 0 : volume) * heSoNhoDan.current;
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

  // ─── Thích ──────────────────────────────────────────────
  useEffect(() => {
    if (!api || userId === null || !online) return;
    let con = true;
    void api.request<unknown>('/api/v1/music/likes/ids')
      .then((ids) => { if (con && Array.isArray(ids)) setDaThich(new Set(ids.map(Number))); })
      .catch(() => { /* chưa đọc được thì trái tim để trống — không chặn việc nghe */ });
    return () => { con = false; };
  }, [api, userId, online]);

  const doiThich = useCallback(async (track: Track) => {
    if (!api) return;
    const dangThich = daThich.has(track.id);
    // Lạc quan: đổi ngay trên màn hình, hỏng thì trả lại và báo.
    setDaThich((cu) => { const m = new Set(cu); if (dangThich) m.delete(track.id); else m.add(track.id); return m; });
    try {
      await api.request(`/api/v1/music/likes/${track.id}`, { method: dangThich ? 'DELETE' : 'POST' });
    } catch (e) {
      setDaThich((cu) => { const m = new Set(cu); if (dangThich) m.add(track.id); else m.delete(track.id); return m; });
      setError(`Không lưu được lượt thích: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [api, daThich]);

  /*
   * LỊCH SỬ NGHE — ghi khi bài đã chạy thật 10 giây, không ghi lúc bấm.
   * Bấm lướt qua năm bài để tìm bài mình muốn mà cả năm vào "Nghe gần đây" (và
   * cộng lượt nghe) là làm hỏng chính danh sách ấy. Mỗi lần phát một bài chỉ
   * ghi MỘT lần — `daGhi` gỡ khi đổi bài.
   */
  const daGhi = useRef<number | null>(null);
  useEffect(() => { daGhi.current = null; }, [currentId]);
  useEffect(() => {
    if (!api || !online || currentId === null || position < 10 || daGhi.current === currentId) return;
    daGhi.current = currentId;
    void api.request('/api/v1/music/history', { method: 'POST', body: { trackId: currentId } })
      .then(() => setNhipLichSu((n) => n + 1))
      .catch(() => { /* ghi hỏng không đáng làm phiền người đang nghe */ });
  }, [api, online, currentId, position]);

  // ─── Bộ chỉnh âm ────────────────────────────────────────
  const datEq = useCallback((ma: MaEq) => {
    setEqState(ma);
    try { localStorage.setItem(EQ_KEY, ma); } catch { /* thôi */ }
    const [t, g, b] = EQ_SAN[ma];
    nhipRef.current?.datEq(t, g, b);
  }, []);

  // ─── Hẹn giờ tắt ────────────────────────────────────────
  /*
   * Sống ở PROVIDER, không ở trang Nhạc. Bản trước nằm trong trang: hẹn 30
   * phút rồi chuyển sang Ghi chú là React tháo bộ đếm, nhạc phát mãi — đúng
   * lúc người ta tin là nó sẽ tự tắt khi mình ngủ.
   *
   * Nhỏ dần bằng một HỆ SỐ nhân vào âm lượng, không ghi đè `volume`: người
   * dùng huỷ giữa chừng thì âm lượng về đúng chỗ cũ, và mức đã lưu không bị
   * kéo về 0 cho lần mở app sau.
   */
  const heSoNhoDan = useRef(1);
  const henGioRef = useRef<HenGio>(null);
  henGioRef.current = henGio;
  const apAmLuong = useCallback(() => {
    const el = audioRef.current;
    if (el) el.volume = (muted ? 0 : volume) * heSoNhoDan.current;
  }, [muted, volume]);

  const datHenGio = useCallback((phut: number | 'het-bai' | null) => {
    heSoNhoDan.current = 1;
    apAmLuong();
    setHenGioConLai(0);
    setHenGioState(phut === null ? null : phut === 'het-bai' ? 'het-bai' : Date.now() + phut * 60_000);
  }, [apAmLuong]);

  useEffect(() => {
    if (typeof henGio !== 'number') return;
    const nhip = setInterval(() => {
      const con = Math.max(0, Math.round((henGio - Date.now()) / 1000));
      setHenGioConLai(con);
      if (con <= GIAY_NHO_DAN) {
        heSoNhoDan.current = Math.max(0, con / GIAY_NHO_DAN);
        apAmLuong();
      }
      if (con <= 0) {
        audioRef.current?.pause();
        setPlaying(false);
        heSoNhoDan.current = 1;
        apAmLuong();
        setHenGioState(null);
      }
    }, 1000);
    return () => clearInterval(nhip);
  }, [henGio, apAmLuong]);

  // ─── Hàng chờ ───────────────────────────────────────────
  const tiepTheo = useMemo(() => {
    const hang = queue.length > 0 ? queue : tracks;
    const ids = shuffle && shuffleOrder.current.length === hang.length ? shuffleOrder.current : hang.map((t) => t.id);
    const at = currentId === null ? -1 : ids.indexOf(currentId);
    const sau = ids.slice(at + 1);
    if (repeat === 'all') sau.push(...ids.slice(0, Math.max(0, at)));
    const theoId = new Map(hang.map((t) => [t.id, t]));
    return sau.map((id) => theoId.get(id)).filter((t): t is Track => Boolean(t));
    // shuffleOrder là ref — `phienTron` tăng mỗi lần nó được trộn lại.
  }, [queue, tracks, shuffle, currentId, repeat, phienTron]);

  /** Chèn `track` vào hàng (bỏ bản cũ nếu đã có) ngay sau bài đang phát hoặc ở cuối. */
  const chenVaoHang = useCallback((track: Track, ngaySau: boolean) => {
    const goc = (queue.length > 0 ? queue : tracks).filter((t) => t.id !== track.id);
    const at = currentId === null ? -1 : goc.findIndex((t) => t.id === currentId);
    const moi = [...goc];
    moi.splice(ngaySau ? at + 1 : moi.length, 0, track);
    const thuTu = shuffleOrder.current.filter((id) => id !== track.id);
    const atTron = currentId === null ? -1 : thuTu.indexOf(currentId);
    thuTu.splice(ngaySau ? atTron + 1 : thuTu.length, 0, track.id);
    shuffleOrder.current = thuTu;
    setQueue(moi);
  }, [queue, tracks, currentId]);

  const phatTiep = useCallback((track: Track) => chenVaoHang(track, true), [chenVaoHang]);
  const themVaoHang = useCallback((track: Track) => chenVaoHang(track, false), [chenVaoHang]);
  const boKhoiHang = useCallback((trackId: number) => {
    if (trackId === currentId) return;
    shuffleOrder.current = shuffleOrder.current.filter((id) => id !== trackId);
    setQueue((cu) => (cu.length > 0 ? cu : tracks).filter((t) => t.id !== trackId));
  }, [currentId, tracks]);

  const doiChoHang = useCallback((trackId: number, truocId: number) => {
    if (trackId === truocId || trackId === currentId) return;
    const chen = <T,>(ds: T[], laMinh: (x: T) => boolean, laDich: (x: T) => boolean) => {
      const minh = ds.find(laMinh);
      if (minh === undefined) return ds;
      const con = ds.filter((x) => !laMinh(x));
      const at = con.findIndex(laDich);
      con.splice(at < 0 ? con.length : at, 0, minh);
      return con;
    };
    shuffleOrder.current = chen(shuffleOrder.current, (id) => id === trackId, (id) => id === truocId);
    setQueue((cu) => chen(cu.length > 0 ? cu : tracks, (t) => t.id === trackId, (t) => t.id === truocId));
    setPhienTron((n) => n + 1);
  }, [currentId, tracks]);

  // ─── Tua ────────────────────────────────────────────────
  const batDauTua = useCallback((giay: number) => {
    seekingRef.current = giay;
    setSeeking(giay);
    /* ÁP NGAY, không đợi thả tay.
     *
     * Bản cũ chỉ ghi nhớ rồi để `chotTua` áp khi nghe `pointerup` — mà cái
     * nghe đó được gắn trong một `useEffect` chạy SAU khi React vẽ lại. Một cú
     * BẤM (không kéo) thì `pointerdown → change → pointerup` xong trong cùng
     * một nhịp, tức `pointerup` có thể đã bay qua trước khi có ai nghe. Khi đó
     * lần tua không bao giờ được áp: thanh trượt nhảy tới chỗ bấm rồi tụt về
     * đúng chỗ tiếng đang chạy — nhìn như "bấm đâu cũng về đầu".
     *
     * Áp ngay ở đây thì bấm và kéo đều đúng; `chotTua` chỉ còn việc xoá trạng
     * thái hiển thị. Thẻ <audio> chịu được nhiều lần đặt `currentTime` liên
     * tiếp lúc kéo — đó là cách mọi trình phát vẫn làm. */
    const el = audioRef.current;
    if (el && Number.isFinite(giay)) {
      try { el.currentTime = giay; } catch { /* chưa nạp xong thì bỏ qua */ }
    }
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
    mucNhip,
    tiepTheo, phatTiep, themVaoHang, boKhoiHang, doiChoHang,
    daThich, doiThich, nhipLichSu,
    eq, datEq, eqDuoc,
    henGio, henGioConLai, datHenGio,
  }), [
    tiepTheo, phatTiep, themVaoHang, boKhoiHang, doiChoHang, daThich, doiThich, nhipLichSu,
    eq, datEq, eqDuoc, henGio, henGioConLai, datHenGio,
    tracks, loading, error, loadTracks, downloaded, downloading, usage, download, remove, clearAll,
    current, currentId, playing, position, length, seeking,
    playTrack, toggle, step, batDauTua, chotTua, tuaToi, volume, muted, shuffle, repeat,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
