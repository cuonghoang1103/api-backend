/**
 * Trang Nhạc — chỉ là phần NHÌN.
 *
 * Mọi thứ liên quan tới phát nhạc (thẻ <audio>, hàng phát, âm lượng, phím media)
 * nằm ở `player.tsx`, gắn một lần ở gốc app. Trang này rời màn hình lúc nào cũng
 * được mà bài đang nghe không hề hấn — xem đầu `player.tsx` để biết vì sao.
 *
 * ─── Hai nguồn phát, chọn theo thứ tự ───
 *  1. Đã tải  → `app://cuongthai/media/<id>` (đọc từ đĩa, tua được, không tốn mạng)
 *  2. Chưa tải → `/api/v1/music/stream/<id>` (cần mạng)
 *
 * ⚠️ TÊN TRƯỜNG. Máy chủ trả thẳng hình dạng model Prisma: `coverImage`,
 * `durationSeconds` — KHÔNG phải `coverUrl`/`duration`.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, CloudOff, Disc3, Download, HardDrive, ListMusic, Loader2, Maximize2,
  Music2, Pause, Play, Plus, RefreshCw, Search, Shuffle, Youtube,
  Trash2,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { NowPlaying } from './NowPlaying';
import { PlaylistBar } from './PlaylistBar';
import { RemixDeck } from './RemixDeck';
import { clock, fold, formatBytes, laBaiYouTube, shuffled, useMusicPlayer, type Track } from './player';

/** Một kết quả tìm trên YouTube — hình dạng của `GET /music/youtube-search`. */
interface KetQuaYouTube {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
}

export function MusicPage() {
  const { online } = useAppState();
  const { api } = useSession();
  const {
    tracks, loading, error, setError, loadTracks,
    downloaded, downloading, usage, download, remove, clearAll,
    current, currentId, playing, playTrack, toggle, tuaToi,
    setVolume, setShuffle, position,
  } = useMusicPlayer();

  const [query, setQuery] = useState('');
  /** 'thuong' = thư viện thường · 'remix' = bàn DJ. Giống hai thẻ trên web. */
  const [khu, setKhu] = useState<'thuong' | 'remix'>('thuong');
  const [moToanManh, setMoToanManh] = useState(false);
  /** Tăng lên là buộc dãy playlist nạp lại (vừa thêm bài vào một playlist). */
  const [nhipPlaylist, setNhipPlaylist] = useState(0);
  const [baiRemix, setBaiRemix] = useState<Track[]>([]);

  // ─── Tìm trực tuyến (YouTube) ────────────────────────────────
  const [ketQuaYT, setKetQuaYT] = useState<KetQuaYouTube[]>([]);
  const [dangTimYT, setDangTimYT] = useState(false);
  /** videoId đang được đưa vào thư viện — để hiện vòng quay đúng dòng đó. */
  const [dangThem, setDangThem] = useState<string | null>(null);
  const [tienTrinhThem, setTienTrinhThem] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return tracks;
    return tracks.filter((t) => fold(`${t.title} ${t.artist ?? ''}`).includes(needle));
  }, [tracks, query]);

  /* Gõ vào ô tìm là tìm LUÔN trên YouTube, song song với lọc thư viện.
   *
   * Trước đây ô này chỉ lọc mấy bài đã có sẵn, nên gõ tên một bài chưa có là ra
   * màn hình trống — trông y như hỏng, dù chẳng có lỗi nào.
   *
   * Hoãn 350 ms: gõ "sơn tùng" là tám lần đổi chữ, gọi thẳng thì thành tám lần
   * hỏi YouTube cho một lần tìm. */
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
        if (conSong) setKetQuaYT([]);   // tìm hỏng thì im lặng, thư viện vẫn dùng được
      } finally {
        if (conSong) setDangTimYT(false);
      }
    }, 350);
    return () => { conSong = false; clearTimeout(bo); };
  }, [query, api, online]);

  /* Bài REMIX là một KHO KHÁC, không phải bộ lọc của thư viện thường:
     `GET /music/tracks` mặc định trả `category=NORMAL`, phải hỏi riêng
     `category=REMIX`. Chỉ hỏi khi người dùng mở thẻ đó. */
  const napRemix = useCallback(async () => {
    if (!api) return;
    try {
      const ket = await api.request<unknown>('/api/v1/music/tracks?page=1&size=100&category=REMIX');
      setBaiRemix(Array.isArray(ket) ? (ket as Track[]) : []);
    } catch { setBaiRemix([]); }
  }, [api]);
  useEffect(() => { if (khu === 'remix') void napRemix(); }, [khu, napRemix]);

  // Phím tắt — CHỈ ở trang này. Đưa lên cấp app thì bấm dấu cách trong Ghi chú
  // sẽ dừng nhạc thay vì gõ khoảng trắng.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      if (event.code === 'Space') { event.preventDefault(); toggle(); }
      else if (event.code === 'ArrowRight') tuaToi(position + 5);
      else if (event.code === 'ArrowLeft') tuaToi(position - 5);
      else if (event.code === 'ArrowUp') { event.preventDefault(); setVolume((v) => Math.min(1, v + 0.05)); }
      else if (event.code === 'ArrowDown') { event.preventDefault(); setVolume((v) => Math.max(0, v - 0.05)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, tuaToi, position, setVolume]);

  /**
   * Bảo máy chủ rút âm thanh của một dòng YouTube về R2.
   *
   * Gọi bằng `fetch` trần chứ không `api.request`: `request()` chặn cứng 30
   * giây, mà yt-dlp + ffmpeg trên máy chủ mất 10-60 giây — hết giờ ở phía app
   * trong khi máy chủ vẫn đang làm là kiểu hỏng khó hiểu nhất.
   */
  const rutAmThanh = async (trackId: number) => {
    if (!api) return;
    setTienTrinhThem('Đang rút âm thanh về máy chủ… (10-60 giây)');
    const phanHoi = await fetch(
      `${api.baseUrlForForms()}/api/v1/music/tracks/${trackId}/download-audio`,
      { method: 'POST', headers: { ...api.authHeaders(), 'Content-Type': 'application/json' }, body: '{}' },
    );
    if (!phanHoi.ok) {
      const chiTiet = await phanHoi.json().catch(() => null) as { message?: string } | null;
      throw new Error(
        phanHoi.status === 403
          ? 'Chỉ tài khoản quản trị mới rút được âm thanh về máy chủ.'
          : chiTiet?.message ?? `Máy chủ trả về ${phanHoi.status}`,
      );
    }
  };

  /** Dòng cũ trong thư viện còn trỏ vào YouTube — rút âm thanh rồi phát. */
  const rutRoiPhat = async (track: Track) => {
    if (!api || dangThem) return;
    setDangThem(String(track.id));
    setError(null);
    try {
      await rutAmThanh(track.id);
      setTienTrinhThem('Đang làm mới danh sách…');
      await loadTracks();
      playTrack({ ...track, audioUrl: null });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setDangThem(null);
      setTienTrinhThem(null);
    }
  };

  /**
   * Đưa một bài từ YouTube vào thư viện rồi phát. HAI bước:
   *  1. `POST /music/tracks/remote` — tạo dòng trong CSDL. `audioUrl` là **bắt
   *     buộc**, và `download-audio` sau đó đọc đúng trường này làm địa chỉ
   *     YouTube, nên phải gửi link `watch?v=…`.
   *  2. `rutAmThanh` — máy chủ rút âm thanh về R2.
   *
   * ⚠️ Bước 2 bắt buộc VỚI APP, không bắt buộc với web. Web phát bài YouTube
   * bằng khung nhúng nên một dòng trỏ vào `youtube.com` là đủ dùng; app phát
   * bằng thẻ <audio>, mà `GET /stream/:id` của dòng như vậy trả **400**.
   */
  const themTuYouTube = async (r: KetQuaYouTube) => {
    if (!api || dangThem) return;
    setDangThem(r.videoId);
    setError(null);
    try {
      setTienTrinhThem('Đang thêm vào thư viện…');
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

      setTienTrinhThem('Đang làm mới danh sách…');
      await loadTracks();
      setQuery('');
      // Phát theo dữ liệu vừa nhận, không đi tìm trong `tracks` của lần render
      // này — nó vẫn là bản cũ, danh sách mới chỉ có ở lần render sau.
      playTrack({
        id: tao.id,
        title: r.title,
        artist: r.artist,
        coverImage: r.thumbnail,
        durationSeconds: r.durationSeconds ?? null,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setDangThem(null);
      setTienTrinhThem(null);
    }
  };

  // ─── Số liệu cho tấm bìa thư viện (lúc chưa phát gì) ─────
  const tongGiay = useMemo(
    () => tracks.reduce((tong, t) => tong + (t.durationSeconds ?? 0), 0),
    [tracks],
  );
  const anhBia = useMemo(
    () => tracks.map((t) => t.coverImage).filter((u): u is string => Boolean(u)).slice(0, 4),
    [tracks],
  );
  /** "1 giờ 23 phút" — dễ đọc hơn "83 phút" khi thư viện đã lớn. */
  const doDaiThuVien = (() => {
    const phut = Math.round(tongGiay / 60);
    if (phut < 60) return `${phut} phút`;
    return `${Math.floor(phut / 60)} giờ ${phut % 60} phút`;
  })();
  const phatTatCa = () => { const dau = visible[0]; if (dau) playTrack(dau, visible); };
  const tronVaPhat = () => {
    if (visible.length === 0) return;
    setShuffle(true);
    const tron = shuffled(visible);
    const dau = tron[0];
    if (dau) playTrack(dau, tron);
  };

  const offlineCount = downloaded.size;

  return (
    <div className="ct-music">
      <div className="ct-page-head" style={{ marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 19 }}>Nhạc</h1>
          <p className="ct-muted" style={{ margin: 0 }}>
            Nghe trực tuyến, tìm thêm trên YouTube, hoặc tải về máy để nghe khi mất mạng.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="ct-segmented" role="tablist" aria-label="Khu vực nhạc">
            <button
              type="button" role="tab" aria-selected={khu === 'thuong'}
              data-active={khu === 'thuong'}
              onClick={() => setKhu('thuong')}
            >
              NHẠC THƯỜNG
            </button>
            <button
              type="button" role="tab" aria-selected={khu === 'remix'}
              data-active={khu === 'remix'}
              onClick={() => setKhu('remix')}
            >
              <Disc3 size={13} aria-hidden /> REMIX
            </button>
          </div>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void loadTracks()} disabled={!online}>
            <RefreshCw size={14} aria-hidden />
            Làm mới
          </button>
        </div>
      </div>

      {/* ─── Bàn DJ ─── */}
      {khu === 'remix' && (
        <>
          {/* Đưa CẢ HAI kho vào bàn DJ. Kho Remix của web toàn là link YouTube
              (chưa có file nhạc), nên nếu chỉ đưa mỗi nó thì mở bàn DJ ra là
              không có gì phát được ngay. */}
          <RemixDeck baiRemix={baiRemix} baiThuong={tracks} />
        </>
      )}

      {/* ─── Playlist ─── */}
      {khu === 'thuong' && (
        <PlaylistBar
          onPhat={(bai, danhSach) => playTrack(bai, danhSach)}
          baiDangPhat={currentId}
          moiThem={nhipPlaylist}
        />
      )}

      {/* ─── Đang phát ─── */}
      {khu === 'thuong' && current && (
        <section className="ct-np" aria-label="Đang phát">
          {/* Nền mờ lấy chính ảnh bìa: mỗi bài một sắc riêng mà không cần bảng
              màu gõ tay cho từng bài. */}
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
              <button type="button" className="ct-btn ct-btn-ghost ct-np-mo" onClick={() => setMoToanManh(true)}>
                <Maximize2 size={13} aria-hidden /> Xem toàn màn hình
              </button>

              {/* Dải nhịp trang trí, KHÔNG phải phổ tần thật. Phân tích phổ thật
                  cần đưa audio qua Web Audio, mà luồng nhạc là khác nguồn gốc
                  với `app://` — làm vậy có thể khiến cả bài phát ra IM LẶNG.
                  Không đáng đánh đổi để lấy mấy cái cột nhấp nháy. */}
              <div className={`ct-eq${playing ? ' is-live' : ''}`} aria-hidden>
                {Array.from({ length: 28 }, (_, i) => (
                  <span key={i} style={{ animationDelay: `${(i % 7) * 90}ms` }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Tấm bìa thư viện — thay chỗ trống lúc chưa nghe gì ─── */}
      {khu === 'thuong' && !current && tracks.length > 0 && (
        <section className="ct-lib" aria-label="Thư viện">
          <div className="ct-lib-collage" aria-hidden>
            {anhBia.length > 0
              ? anhBia.map((u, i) => <img key={i} src={u} alt="" loading="lazy" />)
              : <span className="ct-lib-collage-blank"><ListMusic size={30} /></span>}
          </div>
          <div className="ct-lib-meta">
            <p className="ct-np-eyebrow">Thư viện của bạn</p>
            <h2 className="ct-lib-title">{tracks.length} bài hát</h2>
            <p className="ct-np-artist">
              {doDaiThuVien}
              {offlineCount > 0 && ` · ${offlineCount} bài nghe được khi mất mạng`}
            </p>
            <div className="ct-lib-actions">
              <button type="button" className="ct-btn" onClick={phatTatCa}>
                <Play size={15} aria-hidden /> Phát tất cả
              </button>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={tronVaPhat}>
                <Shuffle size={15} aria-hidden /> Trộn bài
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─── Thanh công cụ danh sách ─── */}
      {khu === 'thuong' && (<>
      <div className="ct-music-toolbar">
        <label className="ct-music-search">
          <Search size={14} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm trong thư viện hoặc trên YouTube…"
            aria-label="Tìm bài hát"
          />
          {dangTimYT && <Loader2 size={14} className="ct-spin" aria-hidden />}
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
                  void clearAll();
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

      {tienTrinhThem && (
        <div className="ct-notice" data-tone="info">
          <Loader2 size={15} className="ct-spin" aria-hidden />
          <span>{tienTrinhThem}</span>
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
          {visible.map((track, index) => (
            <DongBai
              key={track.id}
              track={track}
              index={index}
              isCurrent={currentId === track.id}
              playing={playing}
              isDownloaded={downloaded.has(track.id)}
              isDownloading={downloading.has(track.id)}
              chuaRutAmThanh={laBaiYouTube(track) && !downloaded.has(track.id)}
              dangRut={dangThem === String(track.id)}
              online={online}
              onPlay={() => (currentId === track.id ? toggle() : playTrack(track, visible))}
              onExtract={() => void rutRoiPhat(track)}
              onDownload={() => void download(track)}
              onRemove={() => void remove(track.id)}
            />
          ))}
        </ol>
      )}

      {/* ─── Kết quả YouTube ─── */}
      {ketQuaYT.length > 0 && (
        <section className="ct-yt" aria-label="Kết quả trên YouTube">
          <h3 className="ct-yt-head">
            <Youtube size={15} aria-hidden />
            Trên YouTube
            <span className="ct-muted" style={{ fontWeight: 400, fontSize: 12 }}>
              — thêm vào thư viện là nghe được như mọi bài khác
            </span>
          </h3>
          <ol className="ct-tracks">
            {ketQuaYT.map((r) => {
              const dangLam = dangThem === r.videoId;
              return (
                <li key={r.videoId} className="ct-trk ct-trk-yt">
                  <span className="ct-trk-index"><Youtube size={14} aria-hidden /></span>
                  <span className="ct-trk-art">
                    {r.thumbnail
                      ? <img src={r.thumbnail} alt="" loading="lazy" />
                      : <span className="ct-trk-art-blank"><Music2 size={15} aria-hidden /></span>}
                  </span>
                  <span className="ct-trk-main">
                    <span className="ct-trk-title" title={r.title}>{r.title}</span>
                    <span className="ct-trk-artist">{r.artist}</span>
                  </span>
                  <span />
                  <span className="ct-trk-time">{r.duration ?? clock(r.durationSeconds)}</span>
                  <button
                    type="button"
                    className="ct-trk-action"
                    onClick={() => void themTuYouTube(r)}
                    disabled={dangThem !== null || !online}
                    aria-label={`Thêm ${r.title} vào thư viện`}
                    title="Thêm vào thư viện và phát"
                  >
                    {dangLam ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Plus size={15} aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {!loading && tracks.length > 0 && visible.length === 0 && ketQuaYT.length === 0 && !dangTimYT && (
        <div className="ct-empty">
          <Search size={26} aria-hidden className="ct-empty-icon" />
          <p>Không có bài nào khớp “{query}”{online ? ', kể cả trên YouTube.' : '.'}</p>
        </div>
      )}

      {!loading && tracks.length === 0 && !error && (
        <div className="ct-empty">
          <Music2 size={28} aria-hidden className="ct-empty-icon" />
          <p>Chưa có bài hát nào. Gõ tên bài vào ô tìm để lấy từ YouTube.</p>
        </div>
      )}

      {/* Thanh phát KHÔNG nằm ở đây nữa — nó ở `App.tsx`, sống qua mọi lần
          chuyển trang. Xem `PlayerBar.tsx`. Chừa chỗ để dòng cuối không bị nó
          che khi đang nghe. */}
      </>)}

      {current && <div style={{ height: 8 }} aria-hidden />}

      {/* ─── Màn ĐANG PHÁT toàn cảnh ─── */}
      {moToanManh && current && (
        <NowPlaying
          onDong={() => setMoToanManh(false)}
          onDaThemVaoPlaylist={() => setNhipPlaylist((n) => n + 1)}
        />
      )}
    </div>
  );
}

/** Một dòng trong danh sách thư viện. Tách riêng cho dễ đọc, không có trạng thái. */
function DongBai({
  track, index, isCurrent, playing, isDownloaded, isDownloading, chuaRutAmThanh, dangRut, online,
  onPlay, onExtract, onDownload, onRemove,
}: {
  track: Track;
  index: number;
  isCurrent: boolean;
  playing: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  /** Dòng còn trỏ vào YouTube: app chưa phát được cho tới khi rút âm thanh. */
  chuaRutAmThanh: boolean;
  dangRut: boolean;
  online: boolean;
  onPlay: () => void;
  onExtract: () => void;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const playable = isDownloaded || (online && !chuaRutAmThanh);
  // Bấm phát một dòng YouTube = rút âm thanh rồi phát, chứ không phải báo lỗi.
  const bam = chuaRutAmThanh && online ? onExtract : onPlay;
  const bamDuoc = playable || (chuaRutAmThanh && online);
  return (
    <li className="ct-trk" data-current={isCurrent} onDoubleClick={() => bamDuoc && bam()}>
      <span className="ct-trk-index">
        {isCurrent && playing
          ? <span className="ct-trk-bars" aria-label="đang phát"><i /><i /><i /></span>
          : index + 1}
      </span>

      <button
        type="button"
        className="ct-trk-art"
        onClick={bam}
        disabled={!bamDuoc || dangRut}
        aria-label={isCurrent && playing ? `Tạm dừng ${track.title}` : `Phát ${track.title}`}
        title={
          chuaRutAmThanh
            ? 'Bài lấy từ YouTube — bấm để rút âm thanh về máy chủ rồi phát (10-60 giây)'
            : !playable ? 'Chưa tải về máy — cần mạng để nghe' : undefined
        }
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

      {isDownloaded
        ? <span className="ct-offline-tag" title="Đã có trên máy"><CheckCircle2 size={11} aria-hidden /> đã tải</span>
        : <span />}

      <span className="ct-trk-time">{clock(track.durationSeconds)}</span>

      {chuaRutAmThanh ? (
        <button
          type="button"
          className="ct-trk-action"
          onClick={onExtract}
          disabled={!online || dangRut}
          aria-label={`Rút âm thanh cho ${track.title}`}
          title="Bài lấy từ YouTube — rút âm thanh về máy chủ để nghe được trong app"
        >
          {dangRut ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Youtube size={15} aria-hidden />}
        </button>
      ) : isDownloaded ? (
        <button
          type="button"
          className="ct-trk-action"
          onClick={onRemove}
          aria-label={`Xoá bản tải về của ${track.title}`}
          title="Xoá bản đã tải"
        >
          <Trash2 size={14} aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          className="ct-trk-action"
          onClick={onDownload}
          disabled={!online || isDownloading}
          aria-label={`Tải ${track.title} về máy`}
          title={online ? 'Tải về nghe offline' : 'Cần mạng để tải'}
        >
          {isDownloading ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Download size={14} aria-hidden />}
        </button>
      )}
    </li>
  );
}
