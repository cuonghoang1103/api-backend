/**
 * Trang Nhạc — chỉ là phần NHÌN.
 *
 * Mọi thứ liên quan tới phát nhạc (thẻ <audio>, hàng phát, âm lượng, phím media,
 * thích, lịch sử, chỉnh âm, hẹn giờ) nằm ở `player.tsx`, gắn một lần ở gốc app.
 * Âm thanh nền nằm ở `khongGian.ts`. Trang này rời màn hình lúc nào cũng được mà
 * bài đang nghe, tiếng mưa hay hẹn giờ không hề hấn.
 *
 * ─── Bố cục (04/10/2026) ───
 *   [ cột trái: Dành cho bạn · Thư viện · Đã thích · Gần đây · Đã tải · Remix · playlist ]
 *   [ giữa: nội dung theo mục, ô tìm luôn ở trên ]
 *   [ cột phải: đang phát + Tiếp theo · Lời · Không gian ]
 * Ba cột tự cuộn riêng, như mọi app nghe nhạc trên máy tính — cuộn thư viện 70
 * bài không đẩy mất hàng chờ.
 *
 * ─── Hai nguồn phát, chọn theo thứ tự ───
 *  1. Đã tải  → `app://cuongthai/media/<id>` (đọc từ đĩa, tua được, không tốn mạng)
 *  2. Chưa tải → `/api/v1/music/stream/<id>` (cần mạng)
 *
 * ⚠️ TÊN TRƯỜNG. Máy chủ trả thẳng hình dạng model Prisma: `coverImage`,
 * `durationSeconds` — KHÔNG phải `coverUrl`/`duration`.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Clock3, CloudOff, Disc3, HardDrive, Headphones, Heart, Home, Keyboard, Library,
  ListMusic, Loader2, Radio, Maximize2, Moon, PanelRightClose, PanelRightOpen, Play, Plus, RefreshCw, Search,
  Shuffle, Sunset, Trash2, Trophy, X, Youtube, Zap,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { useDich } from '../../i18n';
import { BangBai, TEN_LOAI, type HanhDongBai } from './BangBai';
import { QuyenPlaylist, BieuTuongCheDo, cheDoCua } from './QuyenPlaylist';
import { BangXepHang } from './BangXepHang';
import { BenPhai, type TheBenPhai } from './BenPhai';
import { AnhBia, BiaGhep, doDaiDanhSach, RaNgoai } from './dungChung';
import { datMucKhongGian, tatKhongGian } from './khongGian';
import { layBaiDaThich, layLichSu, layNgheNhieu, xoaLichSu, type BaiNgheNhieu } from './musicApi';
import { NowPlaying } from './NowPlaying';
import { clock, fold, formatBytes, laBaiYouTube, loaiNhac, shuffled, useMusicPlayer, type LoaiNhac, type Track } from './player';
import {
  boBaiKhoiPlaylist, layDanhSachPlaylist, layPlaylist, taoPlaylist, themBaiVaoPlaylist,
  xoaPlaylist, type Playlist,
} from './playlists';
import { RemixDeck } from './RemixDeck';
import { PhongNgheChung } from './PhongNgheChung';
import { goi as goiAdmin, LoiAdmin } from '../admin/adminApi';
import { XacMinhMfa } from '../admin/XacMinhMfa';
import { TaiNhacLen } from './TaiNhacLen';
import './music2.css';

/** Một kết quả tìm trên YouTube — hình dạng của `GET /music/youtube-search`. */
export interface KetQuaYouTube {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
}

type Muc = 'chu' | 'bxh' | 'phong' | 'thu-vien' | 'thich' | 'gan-day' | 'da-tai' | 'remix' | `pl:${number}`;
type SapXep = 'macdinh' | 'ten' | 'nghesi' | 'dai';

const KHOA_BEN = 'ct-music-ben-an';

export function MusicPage() {
  const { dich, dichP } = useDich();
  const { online } = useAppState();
  const { api, user } = useSession();
  const userId = user?.userId ?? null;

  /*
   * Chỉ ADMIN mới thấy nút xoá hẳn — khớp đúng quyền máy chủ đòi
   * (`requireRole('ADMIN')` ở `DELETE /music/tracks/:id`). Hiện nút cho mọi
   * người rồi để máy chủ từ chối là bày ra một nút luôn báo lỗi.
   */
  const laAdmin = (user?.roles ?? []).some((r) => r.replace(/^ROLE_/, '').toUpperCase() === 'ADMIN');

  const player = useMusicPlayer();
  const {
    tracks, loading, error, setError, loadTracks, downloaded, usage, clearAll,
    current, playing, playTrack, toggle, tuaToi, position, setVolume, setMuted,
    setShuffle, setRepeat, step, daThich, doiThich, nhipLichSu, datEq, datHenGio, download, remove,
  } = player;

  const [muc, setMuc] = useState<Muc>('chu');
  const [query, setQuery] = useState('');
  const [sapXep, setSapXep] = useState<SapXep>('macdinh');
  /** Lọc Thư viện theo loại Nhạc Việt / Anh / Trung (05/10/2026). Mỗi lần mở trang về "Tất cả". */
  const [loaiLoc, setLoaiLoc] = useState<LoaiNhac | 'all'>('all');
  /** Nhãn vừa gán trong phiên — hiện NGAY, không chờ danh sách bài (máy chủ cache 60 giây) tải lại. */
  const [ganTay, setGanTay] = useState<Record<number, LoaiNhac | null>>({});
  const [benThe, setBenThe] = useState<TheBenPhai>('hang');
  const [benAn, setBenAn] = useState(() => { try { return localStorage.getItem(KHOA_BEN) === '1'; } catch { return false; } });
  const [thuGian, setThuGian] = useState(false);
  const [phimTat, setPhimTat] = useState(false);
  const oTim = useRef<HTMLInputElement>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [plMo, setPlMo] = useState<Playlist | null>(null);
  const [plDangTai, setPlDangTai] = useState(false);
  const [taoPl, setTaoPl] = useState(false);
  const [tenPl, setTenPl] = useState('');
  const [thongBao, setThongBao] = useState<string | null>(null);

  const [baiThich, setBaiThich] = useState<Track[] | null>(null);
  const [lichSu, setLichSu] = useState<Track[] | null>(null);
  const [ngheNhieu, setNgheNhieu] = useState<BaiNgheNhieu[]>([]);
  const [baiRemix, setBaiRemix] = useState<Track[]>([]);

  // ─── Tìm trực tuyến (YouTube) ────────────────────────────────
  const [ketQuaYT, setKetQuaYT] = useState<KetQuaYouTube[]>([]);
  const [dangTimYT, setDangTimYT] = useState(false);
  /** id (bài) hoặc videoId đang được rút/thêm — để hiện vòng quay đúng dòng đó. */
  const [dangThem, setDangThem] = useState<string | null>(null);
  const [tienTrinhThem, setTienTrinhThem] = useState<string | null>(null);

  const bao = useCallback((chu: string) => {
    setThongBao(chu);
    window.setTimeout(() => setThongBao((cu) => (cu === chu ? null : cu)), 2600);
  }, []);

  // ─── Nạp dữ liệu ────────────────────────────────────────────
  const napPlaylists = useCallback(async () => {
    if (!api) return;
    try { setPlaylists(await layDanhSachPlaylist(api)); } catch { /* không có playlist cũng không sao */ }
  }, [api]);
  useEffect(() => { void napPlaylists(); }, [napPlaylists]);

  const plId = muc.startsWith('pl:') ? Number(muc.slice(3)) : null;
  const napPlMo = useCallback(async (id: number) => {
    if (!api) return;
    setPlDangTai(true);
    try { setPlMo(await layPlaylist(api, id)); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setPlDangTai(false); }
  }, [api, setError]);
  useEffect(() => { if (plId !== null) void napPlMo(plId); else setPlMo(null); }, [plId, napPlMo]);

  useEffect(() => {
    if (!api || !online || (muc !== 'thich' && muc !== 'chu')) return;
    let con = true;
    void layBaiDaThich(api).then((r) => { if (con) setBaiThich(r); }).catch(() => { if (con) setBaiThich([]); });
    return () => { con = false; };
    // Nạp lại khi số bài thích đổi — bấm tim ở đâu thì danh sách cũng đúng.
  }, [api, online, muc, daThich.size]);

  useEffect(() => {
    if (!api || !online || (muc !== 'gan-day' && muc !== 'chu')) return;
    let con = true;
    void layLichSu(api).then((r) => { if (con) setLichSu(r); }).catch(() => { if (con) setLichSu([]); });
    if (muc === 'chu') void layNgheNhieu(api).then((r) => { if (con) setNgheNhieu(r); }).catch(() => undefined);
    return () => { con = false; };
  }, [api, online, muc, nhipLichSu]);

  /* Bài REMIX là một KHO KHÁC, không phải bộ lọc của thư viện thường:
     `GET /music/tracks` mặc định trả `category=NORMAL`, phải hỏi riêng
     `category=REMIX`. Chỉ hỏi khi người dùng mở mục đó. */
  const napRemix = useCallback(async () => {
    if (!api) return;
    try {
      const ket = await api.request<unknown>('/api/v1/music/tracks?page=1&size=100&category=REMIX');
      setBaiRemix(Array.isArray(ket) ? (ket as Track[]) : []);
    } catch { setBaiRemix([]); }
  }, [api]);
  useEffect(() => { if (muc === 'remix') void napRemix(); }, [muc, napRemix]);

  /* Gõ vào ô tìm là tìm LUÔN trên YouTube, song song với lọc thư viện.
     Hoãn 350 ms: gõ "sơn tùng" là tám lần đổi chữ. */
  useEffect(() => {
    const tuKhoa = query.trim();
    if (!api || !online || tuKhoa.length < 2) { setKetQuaYT([]); setDangTimYT(false); return; }
    let conSong = true;
    const bo = setTimeout(async () => {
      setDangTimYT(true);
      try {
        const ket = await api.request<unknown>(`/api/v1/music/youtube-search?q=${encodeURIComponent(tuKhoa)}`);
        if (conSong) setKetQuaYT(Array.isArray(ket) ? (ket as KetQuaYouTube[]) : []);
      } catch {
        if (conSong) setKetQuaYT([]);
      } finally {
        if (conSong) setDangTimYT(false);
      }
    }, 350);
    return () => { conSong = false; clearTimeout(bo); };
  }, [query, api, online]);

  // ─── Thao tác ───────────────────────────────────────────────
  /** Xoá HẲN một bài khỏi thư viện dùng chung (máy chủ xoá mềm). */
  const xoaHan = useCallback(async (track: Track) => {
    if (!api) return;
    if (!window.confirm(dichP('Xoá "{ten}" khỏi thư viện nhạc của cả hệ thống?', { ten: track.title }))) return;
    try {
      await api.request(`/api/v1/music/tracks/${track.id}`, { method: 'DELETE' });
      await loadTracks(true);
    } catch (e) {
      window.alert(`${dich('Không xoá được')}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [api, loadTracks, dich, dichP]);

  /**
   * Bảo máy chủ rút âm thanh của một dòng YouTube về R2.
   * `fetch` trần chứ không `api.request`: `request()` chặn cứng 30 giây, mà
   * yt-dlp + ffmpeg trên máy chủ mất 10-60 giây.
   */
  const rutAmThanh = async (trackId: number) => {
    if (!api) return;
    setTienTrinhThem(dich('Đang rút âm thanh về máy chủ… (10-60 giây)'));
    const phanHoi = await fetch(
      `${api.baseUrlForForms()}/api/v1/music/tracks/${trackId}/download-audio`,
      { method: 'POST', headers: { ...api.authHeaders(), 'Content-Type': 'application/json' }, body: '{}' },
    );
    if (!phanHoi.ok) {
      const chiTiet = await phanHoi.json().catch(() => null) as { message?: string } | null;
      // Hiện ĐÚNG lý do máy chủ trả về (quá 30 MB, quá 20 phút, hết lượt ngày, YouTube chặn…).
      // Trước 05/10/2026 mọi 403 bị dịch thành "Chỉ tài khoản quản trị…" — kể cả khi chính
      // admin bị chặn vì thiếu bước xác minh MFA, nên thông báo nói sai sự thật.
      throw new Error(
        chiTiet?.message ?? (phanHoi.status >= 500
          ? dich('Máy chủ chưa tải được bài này từ YouTube. Thử lại sau ít phút.')
          : `HTTP ${phanHoi.status}`),
      );
    }
  };

  /** Nút ⬇ của bài YouTube: rút lên R2 rồi tải luôn về máy. */
  const rutVaTai = async (track: Track) => {
    if (!api || dangThem) return;
    setDangThem(String(track.id));
    setError(null);
    try {
      await rutAmThanh(track.id);
      setTienTrinhThem(dich('Đã lưu lên máy chủ — đang tải về máy…'));
      await loadTracks(true);
      await download({ ...track, audioUrl: null });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setDangThem(null);
      setTienTrinhThem(null);
    }
  };

  /**
   * Nút 🗑 (05/10/2026): xoá bản trên máy RỒI gỡ bản trên R2. Thư viện là dùng chung:
   * máy chủ chỉ cho người đã rút bài (hoặc admin) gỡ bản R2 — bản người khác rút thì
   * chỉ xoá trên máy và nói rõ. Bài rút trước 05/10 không còn link YouTube gốc nên
   * gỡ R2 là bài biến khỏi thư viện — hỏi trước.
   */
  const xoaBanTai = async (track: Track) => {
    if (!api) return;
    if (!window.confirm(dichP('Xoá "{ten}" khỏi máy bạn và khỏi máy chủ (R2)?', { ten: track.title }))) return;
    await remove(track.id);
    try {
      // Qua goi() của trang Quản trị: admin gỡ bản người khác rút cần step-up MFA ⇒
      // goi() bật hộp nhập mã 6 số (XacMinhMfa gắn ở cuối trang) rồi tự gọi lại.
      await goiAdmin(api, `/music/tracks/${track.id}/audio`, { method: 'DELETE' });
      await loadTracks(true);
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      setError(e instanceof LoiAdmin && e.code === 'NOT_OWNER' ? `${dich('Đã xoá trên máy.')} ${m}` : `${dich('Đã xoá trên máy, nhưng chưa gỡ được bản trên máy chủ')}: ${m}`);
    }
  };

  const rutRoiPhat = async (track: Track) => {
    if (!api || dangThem) return;
    setDangThem(String(track.id));
    setError(null);
    try {
      await rutAmThanh(track.id);
      setTienTrinhThem(dich('Đang làm mới danh sách…'));
      await loadTracks(true);
      playTrack({ ...track, audioUrl: null });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setDangThem(null);
      setTienTrinhThem(null);
    }
  };

  /**
   * Đưa một bài từ YouTube vào thư viện rồi phát. HAI bước: tạo dòng
   * (`POST /tracks/remote`, `audioUrl` là link watch?v=…), rồi rút âm thanh —
   * app phát bằng <audio>, mà `/stream/:id` của dòng còn trỏ YouTube trả 400.
   */
  /**
   * `tuy` (05/10/2026, Bảng xếp hạng): `phat` = phát ngay sau khi lưu (mặc định có),
   * `taiVe` = tải luôn file về máy (nút ⬇). Bài đã có trong thư viện thì máy chủ trả
   * đúng dòng cũ (so theo id video) — không thêm trùng, không rút lại.
   */
  const themTuYouTube = async (r: KetQuaYouTube, tuy: { phat?: boolean; taiVe?: boolean } = {}) => {
    if (!api || dangThem) return;
    setDangThem(r.videoId);
    setError(null);
    try {
      setTienTrinhThem(dich('Đang thêm vào thư viện…'));
      const tao = await api.request<{ id: number }>('/api/v1/music/tracks/remote', {
        method: 'POST',
        body: {
          title: r.title,
          artist: r.artist || 'YouTube',
          audioUrl: `https://www.youtube.com/watch?v=${r.videoId}`,
          coverImage: r.thumbnail,
          durationSeconds: r.durationSeconds,
          source: 'youtube',
          videoId: r.videoId,
        },
      });
      await rutAmThanh(tao.id);
      setTienTrinhThem(dich('Đang làm mới danh sách…'));
      await loadTracks(true);
      setQuery('');
      const bai = { id: tao.id, title: r.title, artist: r.artist, coverImage: r.thumbnail, durationSeconds: r.durationSeconds ?? null };
      if (tuy.taiVe) {
        setTienTrinhThem(dich('Đã lưu lên máy chủ — đang tải về máy…'));
        await download({ ...bai, audioUrl: null });
        bao(dichP('Đã thêm “{ten}” vào thư viện và tải về máy.', { ten: r.title }));
      }
      if (tuy.phat ?? !tuy.taiVe) playTrack(bai);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setDangThem(null);
      setTienTrinhThem(null);
    }
  };

  const themVaoPl = useCallback(async (p: Playlist, t: Track) => {
    if (!api) return;
    try {
      await themBaiVaoPlaylist(api, p.id, t.id);
      bao(dichP('Đã thêm vào “{ten}”.', { ten: p.name }));
      void napPlaylists();
      if (plId === p.id) void napPlMo(p.id);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }, [api, bao, dichP, napPlaylists, plId, napPlMo, setError]);

  const taoPlMoi = async () => {
    if (!api || !tenPl.trim()) return;
    try {
      const p = await taoPlaylist(api, tenPl.trim());
      setTenPl('');
      setTaoPl(false);
      await napPlaylists();
      if (p?.id) setMuc(`pl:${p.id}`);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };

  const xoaPlMo = async () => {
    if (!api || !plMo) return;
    if (!window.confirm(dichP('Xoá playlist “{ten}”? Các bài hát vẫn còn trong thư viện.', { ten: plMo.name }))) return;
    try {
      await xoaPlaylist(api, plMo.id);
      setMuc('chu');
      await napPlaylists();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };

  // ─── Danh sách theo mục ─────────────────────────────────────
  const tracksL = useMemo(() => (Object.keys(ganTay).length ? tracks.map((t) => (t.id in ganTay ? { ...t, language: ganTay[t.id] ?? null } : t)) : tracks), [tracks, ganTay]);
  const demLoai = useMemo(() => {
    const d: Record<LoaiNhac, number> = { vi: 0, en: 0, zh: 0 };
    for (const t of tracksL) { const l = loaiNhac(t); if (l) d[l]++; }
    return d;
  }, [tracksL]);
  const thuVien = useMemo(() => {
    const ds = loaiLoc === 'all' ? [...tracksL] : tracksL.filter((t) => loaiNhac(t) === loaiLoc);
    const so = (a: string, b: string) => a.localeCompare(b, 'vi', { sensitivity: 'base' });
    if (sapXep === 'ten') ds.sort((a, b) => so(a.title, b.title));
    else if (sapXep === 'nghesi') ds.sort((a, b) => so(a.artist ?? '', b.artist ?? ''));
    else if (sapXep === 'dai') ds.sort((a, b) => (b.durationSeconds ?? 0) - (a.durationSeconds ?? 0));
    return ds;
  }, [tracksL, sapXep, loaiLoc]);

  /** Gán loại cho một bài — máy chủ lưu nhãn cho thư viện chung; null = trả về tự đoán. */
  const doiLoai = useCallback(async (t: Track, loai: LoaiNhac | null) => {
    if (!api) return;
    try {
      await api.request(`/api/v1/music/tracks/${t.id}/language`, { method: 'PATCH', body: { language: loai } });
      setGanTay((g) => ({ ...g, [t.id]: loai }));
      void loadTracks(true);
      bao(loai ? dichP('Đã chuyển “{ten}” sang {loai}.', { ten: t.title, loai: dich(TEN_LOAI[loai]) }) : dich('Đã bỏ nhãn — app tự đoán loại theo tên bài.'));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }, [api, loadTracks, bao, dich, dichP, setError]);

  /** Dán link YouTube vào ô tìm (04/10) — máy chủ trả đúng video đó; ở đây chỉ để đổi nhãn
   *  và tìm xem bài ấy đã nằm trong thư viện chưa (dòng chưa rút còn giữ link gốc). */
  const idLinkYT = useMemo(
    () => /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(query.trim())?.[1] ?? null,
    [query],
  );
  const ketQuaTim = useMemo(() => {
    if (idLinkYT) return tracks.filter((t) => (t.audioUrl ?? '').includes(idLinkYT));
    const needle = fold(query.trim());
    if (!needle) return [];
    return tracks.filter((t) => fold(`${t.title} ${t.artist ?? ''}`).includes(needle));
  }, [tracks, query, idLinkYT]);

  const daTaiDs = useMemo(() => tracks.filter((t) => downloaded.has(t.id)), [tracks, downloaded]);

  /** Danh sách đang hiện ở vùng giữa — cũng là hàng phát khi bấm một bài. */
  const dsDangXem: Track[] = query.trim()
    ? ketQuaTim
    : muc === 'thu-vien' ? thuVien
      : muc === 'thich' ? (baiThich ?? [])
        : muc === 'gan-day' ? (lichSu ?? [])
          : muc === 'da-tai' ? daTaiDs
            : plId !== null ? (plMo?.tracks ?? [])
              : thuVien;

  /** Bài phát được NGAY: đã tải, hoặc có mạng và không phải dòng YouTube chưa rút. */
  const phatDuoc = useCallback(
    (t: Track) => downloaded.has(t.id) || (online && !laBaiYouTube(t)),
    [downloaded, online],
  );

  /** Mix mỗi ngày theo loại nhạc (05/10/2026): trộn CỐ ĐỊNH theo ngày (cùng ngày mở lại vẫn là
   *  mix đó — như Daily Mix), bài đã thích xếp trước, tối đa 30 bài. Sang ngày mới tự đổi. */
  const mixNgay = useMemo(() => {
    const ngay = new Date().toISOString().slice(0, 10);
    const bam = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
    return (['vi', 'en', 'zh'] as LoaiNhac[]).map((l) => {
      const ds = tracksL.filter((t) => loaiNhac(t) === l && phatDuoc(t));
      ds.sort((a, b) => (Number(daThich.has(b.id)) - Number(daThich.has(a.id))) || (bam(`${ngay}:${a.id}`) - bam(`${ngay}:${b.id}`)));
      const dau = ds.slice(0, 30);
      return { loai: l, ds: dau.sort((a, b) => bam(`${ngay}~${a.id}`) - bam(`${ngay}~${b.id}`)) };
    }).filter((m) => m.ds.length >= 3);
  }, [tracksL, daThich, phatDuoc]);

  const phatDs = useCallback((tatCa: Track[], tron = false) => {
    /* Lọc trước: "Phát tất cả" mà bài đầu là dòng YouTube chưa rút thì bấm xong
       chỉ ra một câu lỗi — đo thật 04/10 với thư viện 70 bài. */
    const ds = tatCa.filter(phatDuoc);
    if (ds.length === 0) {
      if (tatCa.length > 0) setError(online ? dich('Chưa có bài nào trong danh sách này phát được ngay — các bài YouTube cần rút âm thanh trước.') : dich('Không có bài nào đã tải về máy để nghe khi mất mạng.'));
      return;
    }
    const hang = tron ? shuffled(ds) : ds;
    setShuffle(tron);
    playTrack(hang[0]!, hang);
  }, [playTrack, setShuffle, phatDuoc, online, setError, dich]);

  const hanhDong: HanhDongBai = {
    onPhat: (t) => playTrack(t, dsDangXem),
    onRut: (t) => void rutRoiPhat(t),
    onRutVaTai: (t) => void rutVaTai(t),
    onDoiLoai: (t, l) => void doiLoai(t, l),
    onXoaBanTai: (t) => void xoaBanTai(t),
    dangRut: dangThem !== null ? Number(dangThem) : null,
    playlists,
    onThemVaoPlaylist: (p, t) => void themVaoPl(p, t),
    onBoKhoiPlaylist: plMo && api
      ? (t) => {
        void boBaiKhoiPlaylist(api, plMo.id, t.id)
          .then(() => { void napPlMo(plMo.id); void napPlaylists(); })
          .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
      }
      : undefined,
    onXoaHan: laAdmin ? (t) => void xoaHan(t) : undefined,
  };

  /** Ba "tâm trạng" — mỗi cái chỉ là tổ hợp của những tính năng THẬT ở trên. */
  const batTamTrang = (kieu: 'thu-gian' | 'tap-trung' | 'ngu') => {
    const nguon = (baiThich?.filter(phatDuoc).length ?? 0) >= 5 ? baiThich! : tracks;
    tatKhongGian();
    if (kieu === 'thu-gian') { datEq('dem'); datMucKhongGian('mua', 0.3); }
    if (kieu === 'tap-trung') { datEq('phang'); datMucKhongGian('nau', 0.3); }
    if (kieu === 'ngu') { datEq('dem'); datMucKhongGian('song', 0.35); datHenGio(30); }
    phatDs(nguon, true);
    setBenThe('kg');
    setBenAn(false);
  };

  // ─── Phím tắt — CHỈ ở trang này (đưa lên cấp app thì dấu cách trong Ghi chú dừng nhạc) ───
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
        if (event.key === 'Escape' && target === oTim.current) { setQuery(''); oTim.current?.blur(); }
        return;
      }
      if (target?.isContentEditable) return;
      const k = event.key.toLowerCase();
      if (event.code === 'Space') { event.preventDefault(); toggle(); }
      else if (event.code === 'ArrowRight') tuaToi(position + 5);
      else if (event.code === 'ArrowLeft') tuaToi(position - 5);
      else if (event.code === 'ArrowUp') { event.preventDefault(); setVolume((v) => Math.min(1, v + 0.05)); }
      else if (event.code === 'ArrowDown') { event.preventDefault(); setVolume((v) => Math.max(0, v - 0.05)); }
      else if (k === 'n') step(1);
      else if (k === 'p') step(-1);
      else if (k === 's') setShuffle((s) => !s);
      else if (k === 'r') setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
      else if (k === 'm') setMuted((m) => !m);
      else if (k === 'l' && current) void doiThich(current);
      else if (k === 'f' && current) setThuGian((v) => !v);
      else if (k === '/') { event.preventDefault(); oTim.current?.focus(); }
      else if (event.key === '?') setPhimTat((v) => !v);
      else if (event.key === 'Escape') { setThuGian(false); setPhimTat(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, tuaToi, position, setVolume, step, setShuffle, setRepeat, setMuted, current, doiThich]);

  useEffect(() => { try { localStorage.setItem(KHOA_BEN, benAn ? '1' : '0'); } catch { /* thôi */ } }, [benAn]);

  const offlineCount = downloaded.size;
  const gio = new Date().getHours();
  const loiChao = gio < 11 ? dich('Chào buổi sáng') : gio < 14 ? dich('Buổi trưa thong thả') : gio < 18 ? dich('Chào buổi chiều') : dich('Chào buổi tối');

  const MUC_CHINH: [Muc, string, JSX.Element, number | null][] = [
    ['chu', dich('Dành cho bạn'), <Home size={16} aria-hidden key="i" />, null],
    ['bxh', dich('Bảng xếp hạng'), <Trophy size={16} aria-hidden key="i" />, null],
    ['phong', dich('Phòng nghe chung'), <Radio size={16} aria-hidden key="i" />, null],
    ['thu-vien', dich('Thư viện'), <Library size={16} aria-hidden key="i" />, tracks.length],
    ['thich', dich('Đã thích'), <Heart size={16} aria-hidden key="i" />, daThich.size],
    ['gan-day', dich('Nghe gần đây'), <Clock3 size={16} aria-hidden key="i" />, null],
    ['da-tai', dich('Đã tải về máy'), <HardDrive size={16} aria-hidden key="i" />, offlineCount],
    ['remix', dich('Bàn DJ · Remix'), <Disc3 size={16} aria-hidden key="i" />, null],
  ];

  const tim = query.trim();
  const dungNhacRieng = useCallback(() => { if (playing) toggle(); }, [playing, toggle]);

  return (
    /* `.mz-boc` là CONTAINER: bố cục co theo bề rộng THẬT của vùng nội dung
       (cửa sổ trừ thanh bên), không theo bề rộng cửa sổ — thu thanh bên lại
       là trang tự nới ra, không cần đoán. */
    <div className="mz-boc">
    <div className="mz" data-ben={benAn ? 'an' : 'hien'} data-phat={playing}>
      {/* ─── Cột trái ─── */}
      <nav className="mz-nav" aria-label={dich('Mục nhạc')}>
        <div className="mz-nav-dau">
          <span className="mz-logo"><Headphones size={17} aria-hidden /></span>
          <div>
            <strong>{dich('Nhạc')}</strong>
            <small>{dichP('{n} bài · {d}', { n: tracks.length, d: doDaiDanhSach(tracks) })}</small>
          </div>
        </div>
        {MUC_CHINH.map(([ma, nhan, icon, dem]) => (
          <button key={ma} type="button" className="mz-nav-muc" data-on={muc === ma && !tim} onClick={() => { setMuc(ma); setQuery(''); }}>
            {icon}<span>{nhan}</span>{dem ? <em>{dem}</em> : null}
          </button>
        ))}

        <div className="mz-nav-nhom">
          <span>Playlist</span>
          <button type="button" className="mz-nut-nho" onClick={() => setTaoPl((v) => !v)} aria-label={dich('Tạo playlist')} title={dich('Tạo playlist')}>
            <Plus size={14} aria-hidden />
          </button>
        </div>
        {taoPl && (
          <form className="mz-nav-tao" onSubmit={(e) => { e.preventDefault(); void taoPlMoi(); }}>
            <input autoFocus value={tenPl} onChange={(e) => setTenPl(e.target.value)} placeholder={dich('Tên playlist…')} maxLength={80} />
            <button type="submit" className="mz-nut mz-nut-chinh" disabled={!tenPl.trim()}>{dich('Tạo')}</button>
          </form>
        )}
        <div className="mz-nav-pl">
          {playlists.length === 0 && !taoPl && <p className="mz-nav-trong">{dich('Chưa có playlist. Bấm + để tạo.')}</p>}
          {playlists.map((p) => (
            <button key={p.id} type="button" className="mz-nav-muc mz-nav-plmuc" data-on={muc === `pl:${p.id}` && !tim} onClick={() => { setMuc(`pl:${p.id}`); setQuery(''); }}>
              <AnhBia src={p.coverUrl} co={26} ten={p.name} />
              <span>{p.name}</span>
              {!p.isPublic && <i className="mz-nav-khoa" title={cheDoCua(p) === 'chia-se' ? 'Chia sẻ với người cụ thể' : 'Riêng tư'}><BieuTuongCheDo cheDo={cheDoCua(p)} size={11} /></i>}
              {p.trackCount ? <em>{p.trackCount}</em> : null}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── Giữa ─── */}
      <main className="mz-giua">
        <div className="mz-thanh">
          <label className="mz-tim-o">
            <Search size={15} aria-hidden />
            <input
              ref={oTim}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dich('Tìm bài trong thư viện, trên YouTube — hoặc dán link YouTube…')}
              aria-label={dich('Tìm bài hát')}
            />
            {dangTimYT ? <Loader2 size={14} className="ct-spin" aria-hidden />
              : query ? <button type="button" className="mz-nut-nho" onClick={() => setQuery('')} aria-label={dich('Xoá tìm kiếm')}><X size={13} aria-hidden /></button>
                : <kbd>/</kbd>}
          </label>
          <TaiNhacLen category={muc === 'remix' ? 'REMIX' : 'NORMAL'} onXong={() => { void loadTracks(true); void napRemix(); }} />
          <button type="button" className="mz-nut mz-nut-trong" onClick={() => void loadTracks(true)} disabled={!online} title={dich('Làm mới')} aria-label={dich('Làm mới')}>
            <RefreshCw size={14} aria-hidden />
          </button>
          {current && (
            <button type="button" className="mz-nut mz-nut-trong" onClick={() => setThuGian(true)} title={dich('Chế độ thư giãn')} aria-label={dich('Chế độ thư giãn')}>
              <Maximize2 size={14} aria-hidden />
            </button>
          )}
          <button type="button" className="mz-nut mz-nut-trong" onClick={() => setPhimTat(true)} title={dich('Phím tắt')} aria-label={dich('Phím tắt')}>
            <Keyboard size={14} aria-hidden />
          </button>
          <button type="button" className="mz-nut mz-nut-trong mz-nut-ben" onClick={() => setBenAn((v) => !v)} title={benAn ? dich('Hiện cột đang phát') : dich('Ẩn cột đang phát')} aria-label={benAn ? dich('Hiện cột đang phát') : dich('Ẩn cột đang phát')}>
            {benAn ? <PanelRightOpen size={15} aria-hidden /> : <PanelRightClose size={15} aria-hidden />}
          </button>
        </div>

        {!online && (
          <div className="ct-notice" data-tone="warn">
            <CloudOff size={15} aria-hidden />
            <span>{dichP('Đang ngoại tuyến — chỉ nghe được {n} bài đã tải về máy.', { n: offlineCount })}</span>
          </div>
        )}
        {tienTrinhThem && (
          <div className="ct-notice" data-tone="info"><Loader2 size={15} className="ct-spin" aria-hidden /><span>{tienTrinhThem}</span></div>
        )}
        {error && (
          <div className="ct-notice" data-tone="err" role="alert">
            <span>{error}</span>
            <button type="button" className="ct-linklike" onClick={() => setError(null)}>{dich('Đóng')}</button>
          </div>
        )}
        {thongBao && <div className="mz-bao" role="status">{thongBao}</div>}

        {/* ─── Kết quả tìm ─── */}
        {tim && (
          <section className="mz-khoi">
            <h2 className="mz-h2">{idLinkYT ? dich('Bài từ link YouTube bạn dán') : dichP('Kết quả cho “{q}”', { q: tim })}</h2>
            {ketQuaTim.length > 0
              ? <BangBai tracks={ketQuaTim} hanhDong={hanhDong} />
              : !dangTimYT && !idLinkYT && <p className="mz-trong-nho">{dich('Không có bài nào trong thư viện khớp.')}</p>}
            {idLinkYT && !dangTimYT && ketQuaYT.length === 0 && ketQuaTim.length === 0 && (
              <p className="mz-trong-nho">{online ? dich('Không mở được video này — có thể link sai, video riêng tư hoặc đã bị xoá.') : dich('Cần có mạng để mở link YouTube.')}</p>
            )}
            {ketQuaYT.length > 0 && (
              <>
                <h3 className="mz-h3"><Youtube size={15} aria-hidden /> {idLinkYT ? dich('Video trong link') : dich('Trên YouTube')} <small>{dich('— thêm vào thư viện là nghe được như mọi bài khác')}</small></h3>
                <div className="mz-bang">
                  {ketQuaYT.map((r) => (
                    <div key={r.videoId} className="mz-dong mz-dong-yt">
                      <span className="mz-dong-so"><Youtube size={14} aria-hidden /></span>
                      <span className="mz-dong-chinh">
                        <AnhBia src={r.thumbnail} co={40} />
                        <span className="mz-dong-chu">
                          <span className="mz-dong-ten" title={r.title}>{r.title}</span>
                          <span className="mz-dong-nghesi">{r.artist}</span>
                        </span>
                      </span>
                      <span />
                      <span className="mz-dong-tg">{r.duration ?? clock(r.durationSeconds)}</span>
                      <span className="mz-dong-nut">
                        <button
                          type="button"
                          className="mz-nut mz-nut-chinh mz-nut-gon"
                          onClick={() => void themTuYouTube(r)}
                          disabled={dangThem !== null || !online}
                          title={dich('Thêm vào thư viện và phát')}
                        >
                          {dangThem === r.videoId ? <Loader2 size={13} className="ct-spin" aria-hidden /> : <Plus size={13} aria-hidden />}
                          {dich('Thêm & phát')}
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* ─── Phòng nghe chung — LUÔN gắn (chỉ ẩn) để đổi mục khác không làm rời phòng ─── */}
        <PhongNgheChung api={api} hien={!tim && muc === 'phong'} tracks={tracks} userId={userId} dungNhacRieng={dungNhacRieng} />

        {/* ─── Dành cho bạn ─── */}
        {!tim && muc === 'chu' && (
          <>
            <section className="mz-chao">
              <div className="mz-chao-nen" aria-hidden><i /><i /><i /></div>
              <p className="mz-eyebrow">{loiChao}</p>
              <h1>{dich('Một ngày dài rồi — để nhạc lo phần còn lại.')}</h1>
              <p className="mz-chao-phu">
                {dichP('{n} bài trong thư viện', { n: tracks.length })}
                {daThich.size > 0 && ` · ${dichP('{n} bài đã thích', { n: daThich.size })}`}
                {offlineCount > 0 && ` · ${dichP('{n} bài nghe được khi mất mạng', { n: offlineCount })}`}
              </p>
              <div className="mz-chao-nut">
                <button type="button" className="mz-nut mz-nut-chinh mz-nut-to" onClick={() => phatDs(thuVien)} disabled={tracks.length === 0}>
                  <Play size={16} aria-hidden /> {dich('Phát tất cả')}
                </button>
                <button type="button" className="mz-nut mz-nut-to" onClick={() => phatDs(thuVien, true)} disabled={tracks.length === 0}>
                  <Shuffle size={16} aria-hidden /> {dich('Trộn bài')}
                </button>
                <button type="button" className="mz-nut mz-nut-to mz-nut-vang" onClick={() => setMuc('bxh')}>
                  <Trophy size={16} aria-hidden /> {dich('Top 100 hôm nay')}
                </button>
              </div>
            </section>

            <section className="mz-khoi">
              <h2 className="mz-h2">{dich('Bạn muốn nghe thế nào?')}</h2>
              <div className="mz-tam">
                <button type="button" className="mz-tam-the" data-mau="tim" onClick={() => batTamTrang('thu-gian')}>
                  <Sunset size={22} aria-hidden />
                  <strong>{dich('Thư giãn sau giờ làm')}</strong>
                  <span>{dich('Trộn bài bạn thích · tiếng mưa nhẹ · chỉnh âm dịu tai')}</span>
                </button>
                <button type="button" className="mz-tam-the" data-mau="xanh" onClick={() => batTamTrang('tap-trung')}>
                  <Zap size={22} aria-hidden />
                  <strong>{dich('Tập trung sâu')}</strong>
                  <span>{dich('Trộn cả thư viện · ồn nâu che tiếng ồn · âm nguyên bản')}</span>
                </button>
                <button type="button" className="mz-tam-the" data-mau="dem" onClick={() => batTamTrang('ngu')}>
                  <Moon size={22} aria-hidden />
                  <strong>{dich('Ngủ ngon')}</strong>
                  <span>{dich('Sóng biển · dịu tai · tự nhỏ dần và tắt sau 30 phút')}</span>
                </button>
              </div>
            </section>

            {mixNgay.length > 0 && (
              <section className="mz-khoi">
                <h2 className="mz-h2">{dich('Mix mỗi ngày')} <small className="mz-h2-phu">{dich('đổi mới mỗi sáng')}</small></h2>
                <div className="mz-luoi">
                  {mixNgay.map((m) => (
                    <button key={m.loai} type="button" className="mz-the mz-the-mix" data-loai={m.loai} onClick={() => phatDs(m.ds)}>
                      <span className="mz-the-bia"><BiaGhep tracks={m.ds} co={150} /><span className="mz-mix-nhan">Mix {dich(TEN_LOAI[m.loai])}</span><Play size={18} className="mz-the-dau" aria-hidden /></span>
                      <strong>{dichP('Mix {loai}', { loai: dich(TEN_LOAI[m.loai]) })}</strong>
                      <small>{m.ds.slice(0, 3).map((t) => t.artist).filter(Boolean).join(', ')} · {dichP('{n} bài', { n: m.ds.length })}</small>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {lichSu && lichSu.length > 0 && (
              <HangThe tieuDe={dich('Nghe gần đây')} ds={lichSu.slice(0, 12)} onTatCa={() => setMuc('gan-day')} onPhat={(t) => playTrack(t, lichSu)} />
            )}
            {ngheNhieu.length > 0 && (
              <HangThe tieuDe={dich('Bạn hay nghe')} ds={ngheNhieu.slice(0, 12)} phu={(t) => dichP('{n} lần', { n: (t as BaiNgheNhieu).soLan })} onPhat={(t) => playTrack(t, ngheNhieu)} />
            )}
            {playlists.length > 0 && (
              <section className="mz-khoi">
                <h2 className="mz-h2">{dich('Playlist của bạn')}</h2>
                <div className="mz-luoi">
                  {playlists.map((p) => (
                    <button key={p.id} type="button" className="mz-the" onClick={() => setMuc(`pl:${p.id}`)}>
                      <span className="mz-the-bia"><AnhBia src={p.coverUrl} co={150} ten={p.name} /><ListMusic size={18} className="mz-the-dau" aria-hidden /></span>
                      <strong>{p.name}</strong>
                      <small>{dichP('{n} bài', { n: p.trackCount ?? 0 })}</small>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {tracks.length > 0 && (
              <HangThe tieuDe={dich('Mới thêm vào thư viện')} ds={tracks.slice(0, 12)} onTatCa={() => setMuc('thu-vien')} onPhat={(t) => playTrack(t, tracks)} />
            )}
            {loading && tracks.length === 0 && <p className="mz-trong-nho">{dich('Đang tải…')}</p>}
            {!loading && tracks.length === 0 && !error && (
              <p className="mz-trong-nho">{dich('Chưa có bài hát nào. Gõ tên bài vào ô tìm để lấy từ YouTube.')}</p>
            )}
          </>
        )}

        {/* ─── Thư viện ─── */}
        {!tim && muc === 'thu-vien' && (
          <>
            <DauMuc
              bia={<BiaGhep tracks={thuVien.length ? thuVien : tracks} />}
              nhan={loaiLoc === 'all' ? dich('Thư viện của bạn') : dich(TEN_LOAI[loaiLoc])}
              ten={dichP('{n} bài hát', { n: thuVien.length })}
              phu={doDaiDanhSach(thuVien)}
              onPhat={() => phatDs(thuVien)}
              onTron={() => phatDs(thuVien, true)}
              coBai={thuVien.length > 0}
            >
              <div className="mz-ben-the mz-loai-loc" role="tablist" aria-label={dich('Loại nhạc')}>
                <button type="button" role="tab" data-on={loaiLoc === 'all'} aria-selected={loaiLoc === 'all'} onClick={() => setLoaiLoc('all')}>{dich('Tất cả')} <small>{tracks.length}</small></button>
                {(['vi', 'en', 'zh'] as const).map((l) => (
                  <button key={l} type="button" role="tab" data-on={loaiLoc === l} aria-selected={loaiLoc === l} onClick={() => setLoaiLoc(l)}>
                    {dich(TEN_LOAI[l])} <small>{demLoai[l]}</small>
                  </button>
                ))}
              </div>
              <label className="mz-chon">
                {dich('Sắp xếp')}
                <select value={sapXep} onChange={(e) => setSapXep(e.target.value as SapXep)}>
                  <option value="macdinh">{dich('Mới thêm')}</option>
                  <option value="ten">{dich('Tên A → Z')}</option>
                  <option value="nghesi">{dich('Nghệ sĩ')}</option>
                  <option value="dai">{dich('Dài nhất')}</option>
                </select>
              </label>
            </DauMuc>
            {loading && tracks.length === 0 ? <p className="mz-trong-nho">{dich('Đang tải…')}</p> : <BangBai tracks={thuVien} hanhDong={hanhDong} />}
          </>
        )}

        {/* ─── Đã thích ─── */}
        {!tim && muc === 'thich' && (
          <>
            <DauMuc
              bia={<span className="mz-bia-mau" data-mau="tim"><Heart size={52} fill="currentColor" aria-hidden /></span>}
              nhan={dich('Danh sách tự động')}
              ten={dich('Bài bạn đã thích')}
              phu={baiThich ? `${dichP('{n} bài', { n: baiThich.length })} · ${doDaiDanhSach(baiThich)}` : dich('Đang tải…')}
              onPhat={() => phatDs(baiThich ?? [])}
              onTron={() => phatDs(baiThich ?? [], true)}
              coBai={(baiThich?.length ?? 0) > 0}
            />
            {baiThich && baiThich.length === 0
              ? <p className="mz-trong-nho">{dich('Chưa thích bài nào. Bấm hình trái tim cạnh một bài (hoặc phím L khi đang nghe) để lưu nó vào đây.')}</p>
              : <BangBai tracks={baiThich ?? []} hanhDong={hanhDong} />}
          </>
        )}

        {/* ─── Nghe gần đây ─── */}
        {!tim && muc === 'gan-day' && (
          <>
            <DauMuc
              bia={<span className="mz-bia-mau" data-mau="xanh"><Clock3 size={52} aria-hidden /></span>}
              nhan={dich('Lịch sử nghe')}
              ten={dich('Nghe gần đây')}
              phu={dich('Bài được ghi sau khi đã nghe 10 giây — bấm lướt không tính.')}
              onPhat={() => phatDs(lichSu ?? [])}
              onTron={() => phatDs(lichSu ?? [], true)}
              coBai={(lichSu?.length ?? 0) > 0}
            >
              {(lichSu?.length ?? 0) > 0 && api && (
                <button
                  type="button"
                  className="mz-nut mz-nut-trong"
                  onClick={() => {
                    if (!window.confirm(dich('Xoá toàn bộ lịch sử nghe?'))) return;
                    void xoaLichSu(api).then(() => setLichSu([])).catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
                  }}
                >
                  <Trash2 size={14} aria-hidden /> {dich('Xoá lịch sử')}
                </button>
              )}
            </DauMuc>
            {lichSu && lichSu.length === 0
              ? <p className="mz-trong-nho">{dich('Chưa có gì. Nghe một bài quá 10 giây là nó vào đây.')}</p>
              : <BangBai tracks={lichSu ?? []} hanhDong={hanhDong} />}
          </>
        )}

        {/* ─── Đã tải ─── */}
        {!tim && muc === 'da-tai' && (
          <>
            <DauMuc
              bia={<span className="mz-bia-mau" data-mau="la"><HardDrive size={52} aria-hidden /></span>}
              nhan={dich('Nghe khi mất mạng')}
              ten={dich('Đã tải về máy')}
              phu={dichP('{n} bài · {b} trên ổ đĩa', { n: usage.count, b: formatBytes(usage.totalBytes) })}
              onPhat={() => phatDs(daTaiDs)}
              onTron={() => phatDs(daTaiDs, true)}
              coBai={daTaiDs.length > 0}
            >
              {usage.count > 0 && (
                <button
                  type="button"
                  className="mz-nut mz-nut-trong"
                  onClick={() => { if (window.confirm(dichP('Xoá toàn bộ {n} bài đã tải? Tải lại được khi có mạng.', { n: usage.count }))) void clearAll(); }}
                >
                  <Trash2 size={14} aria-hidden /> {dich('Xoá hết')}
                </button>
              )}
            </DauMuc>
            {daTaiDs.length === 0
              ? <p className="mz-trong-nho">{dich('Chưa tải bài nào. Bấm nút tải cạnh một bài để nghe được cả khi mất mạng.')}</p>
              : <BangBai tracks={daTaiDs} hanhDong={hanhDong} />}
          </>
        )}

        {/* ─── Playlist ─── */}
        {!tim && plId !== null && (
          plMo && plMo.id === plId ? (
            <>
              <DauMuc
                bia={plMo.coverUrl ? <AnhBia src={plMo.coverUrl} co={132} /> : <BiaGhep tracks={plMo.tracks ?? []} />}
                nhan="Playlist"
                ten={plMo.name}
                phu={`${dichP('{n} bài', { n: plMo.tracks?.length ?? 0 })} · ${doDaiDanhSach(plMo.tracks ?? [])}${plMo.description ? ` · ${plMo.description}` : ''}`}
                onPhat={() => phatDs(plMo.tracks ?? [])}
                onTron={() => phatDs(plMo.tracks ?? [], true)}
                coBai={(plMo.tracks?.length ?? 0) > 0}
              >
                {api && plMo.userId === userId && <QuyenPlaylist api={api} playlist={plMo} onDoi={() => { void napPlMo(plMo.id); void napPlaylists(); }} />}
                {plMo.userId !== userId && plMo.createdByName && <span className="mz-pl-cua"><BieuTuongCheDo cheDo={cheDoCua(plMo)} /> {dichP('của @{ten}', { ten: plMo.createdByName })}</span>}
                {plMo.userId === userId && (
                  <button type="button" className="mz-nut mz-nut-trong" onClick={() => void xoaPlMo()}>
                    <Trash2 size={14} aria-hidden /> {dich('Xoá playlist')}
                  </button>
                )}
              </DauMuc>
              {(plMo.tracks?.length ?? 0) === 0
                ? <p className="mz-trong-nho">{dich('Playlist trống. Bấm “⋯” cạnh một bài → Thêm vào playlist.')}</p>
                : <BangBai tracks={plMo.tracks ?? []} hanhDong={hanhDong} />}
            </>
          ) : plDangTai ? <p className="mz-trong-nho">{dich('Đang tải…')}</p> : null
        )}

        {/* ─── Bảng xếp hạng ─── */}
        {!tim && muc === 'bxh' && <BangXepHang themYT={themTuYouTube} dangThem={dangThem} tienTrinh={tienTrinhThem} />}

        {/* ─── Remix ─── */}
        {!tim && muc === 'remix' && (
          <section className="mz-khoi">
            <h2 className="mz-h2"><Disc3 size={17} aria-hidden /> {dich('Bàn DJ · Remix')}</h2>
            <RemixDeck baiRemix={baiRemix} baiThuong={tracks} />
          </section>
        )}
      </main>

      {/* ─── Cột phải ─── */}
      {!benAn && <BenPhai the={benThe} setThe={setBenThe} onMoThuGian={() => setThuGian(true)} />}

      {thuGian && current && <RaNgoai><NowPlaying onDong={() => setThuGian(false)} /></RaNgoai>}
      {phimTat && <RaNgoai><BangPhimTat onDong={() => setPhimTat(false)} /></RaNgoai>}
      <RaNgoai><XacMinhMfa /></RaNgoai>
    </div>
    </div>
  );
}

/** Đầu một mục: bìa lớn, tên, số liệu, Phát / Trộn + chỗ cho nút riêng. */
function DauMuc({ bia, nhan, ten, phu, onPhat, onTron, coBai, children }: {
  bia: JSX.Element; nhan: string; ten: string; phu: string;
  onPhat: () => void; onTron: () => void; coBai: boolean; children?: ReactNode;
}) {
  const { dich } = useDich();
  return (
    <header className="mz-dau">
      <div className="mz-dau-bia">{bia}</div>
      <div className="mz-dau-chu">
        <p className="mz-eyebrow">{nhan}</p>
        <h1>{ten}</h1>
        <p className="mz-dau-phu">{phu}</p>
        <div className="mz-dau-nut">
          <button type="button" className="mz-nut mz-nut-chinh mz-nut-to" onClick={onPhat} disabled={!coBai}>
            <Play size={16} aria-hidden /> {dich('Phát')}
          </button>
          <button type="button" className="mz-nut mz-nut-to" onClick={onTron} disabled={!coBai}>
            <Shuffle size={16} aria-hidden /> {dich('Trộn bài')}
          </button>
          {children}
        </div>
      </div>
    </header>
  );
}

/** Một hàng thẻ bài cuộn ngang — cho trang Dành cho bạn. */
function HangThe({ tieuDe, ds, onPhat, onTatCa, phu }: {
  tieuDe: string; ds: Track[]; onPhat: (t: Track) => void; onTatCa?: () => void; phu?: (t: Track) => string;
}) {
  const { dich } = useDich();
  const { currentId, playing } = useMusicPlayer();
  return (
    <section className="mz-khoi">
      <div className="mz-khoi-dau">
        <h2 className="mz-h2">{tieuDe}</h2>
        {onTatCa && <button type="button" className="mz-linklike" onClick={onTatCa}>{dich('Xem tất cả')}</button>}
      </div>
      <div className="mz-luoi">
        {ds.map((t) => (
          <button key={t.id} type="button" className="mz-the" data-dang={currentId === t.id && playing} onClick={() => onPhat(t)} title={t.title}>
            <span className="mz-the-bia">
              <AnhBia src={t.coverImage} co={150} ten={t.title} />
              <span className="mz-the-phat"><Play size={18} fill="currentColor" aria-hidden /></span>
            </span>
            <strong>{t.title}</strong>
            <small>{phu ? phu(t) : (t.artist || dich('Không rõ nghệ sĩ'))}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function BangPhimTat({ onDong }: { onDong: () => void }) {
  const { dich } = useDich();
  const DS: [string, string][] = [
    ['Space', dich('Phát / tạm dừng')],
    ['← →', dich('Tua 5 giây')],
    ['↑ ↓', dich('Âm lượng')],
    ['N / P', dich('Bài sau / bài trước')],
    ['S', dich('Trộn bài')],
    ['R', dich('Lặp: tắt → danh sách → một bài')],
    ['M', dich('Tắt / bật tiếng')],
    ['L', dich('Thích bài đang phát')],
    ['F', dich('Chế độ thư giãn')],
    ['/', dich('Tìm bài')],
    ['?', dich('Bảng phím tắt này')],
  ];
  return (
    <div className="mz-phu" role="dialog" aria-label={dich('Phím tắt')} onClick={onDong}>
      <div className="mz-phu-hop" onClick={(e) => e.stopPropagation()}>
        <div className="mz-phu-dau">
          <h3><Keyboard size={16} aria-hidden /> {dich('Phím tắt trang Nhạc')}</h3>
          <button type="button" className="mz-nut-nho" onClick={onDong} aria-label={dich('Đóng')}><X size={15} aria-hidden /></button>
        </div>
        <dl className="mz-phim">
          {DS.map(([k, v]) => (<div key={k}><dt><kbd>{k}</kbd></dt><dd>{v}</dd></div>))}
        </dl>
        <p className="mz-kg-giai">{dich('Phím phát/dừng, bài sau, bài trước trên bàn phím và tai nghe chạy ở mọi trang, kể cả khi app đang ẩn.')}</p>
      </div>
    </div>
  );
}
