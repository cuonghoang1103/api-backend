/**
 * Bảng bài hát — dùng chung cho Thư viện, Đã thích, Nghe gần đây, Đã tải và
 * từng playlist. Một chỗ duy nhất định nghĩa "một dòng bài hát" làm được gì.
 *
 * ⚠️ Menu "⋯" dùng `position: fixed` tính theo nút bấm, KHÔNG `absolute`: bảng
 * nằm trong vùng cuộn có `overflow`, menu tuyệt đối ở dòng cuối sẽ bị cắt mất
 * nửa dưới — đúng kiểu hỏng "dropdown bị overflow nuốt" đã gặp ở trang khác.
 */
import { useEffect, useRef, useState } from 'react';
import {
  Check, CheckCircle2, Download, Heart, ListEnd, ListPlus, ListStart, Loader2, MoreHorizontal,
  Pause, Play, Tags, Trash2, X, Youtube,
} from 'lucide-react';
import { useAppState } from '../../app-state';
import { useDich } from '../../i18n';
import { AnhBia, RaNgoai } from './dungChung';
import { clock, laBaiYouTube, loaiNhac, useMusicPlayer, type LoaiNhac, type Track } from './player';

export const TEN_LOAI: Record<LoaiNhac | 'khac', string> = { vi: '🇻🇳 Nhạc Việt', en: '🇬🇧 Nhạc Anh', zh: '🇨🇳 Nhạc Trung', khac: 'Chưa rõ' };
import type { Playlist } from './playlists';

export interface HanhDongBai {
  /** Phát bài, lấy danh sách đang xem làm hàng phát. */
  onPhat: (track: Track) => void;
  /** Bài YouTube chưa rút âm thanh: rút rồi phát. */
  onRut?: ((track: Track) => void) | undefined;
  dangRut?: number | null | undefined;
  playlists: Playlist[];
  onThemVaoPlaylist: (playlist: Playlist, track: Track) => void;
  /** Có ⇒ hiện mục "Bỏ khỏi playlist này". */
  onBoKhoiPlaylist?: ((track: Track) => void) | undefined;
  /** Bài YouTube chưa rút: nút ⬇ rút lên R2 rồi tải luôn về máy (một lần bấm). */
  onRutVaTai?: ((track: Track) => void) | undefined;
  /** Nút 🗑: xoá bản trên máy VÀ bản trên R2 (nếu mình là người rút). Không có ⇒ chỉ xoá trên máy. */
  onXoaBanTai?: ((track: Track) => void) | undefined;
  /** Có ⇒ hiện mục "Loại nhạc" (Việt / Anh / Trung) trong menu ⋯ — null = trả về tự đoán. */
  onDoiLoai?: ((track: Track, loai: LoaiNhac | null) => void) | undefined;
  /** Có ⇒ hiện mục xoá hẳn (chỉ admin). */
  onXoaHan?: ((track: Track) => void) | undefined;
}

export function BangBai({ tracks, hanhDong, coSo = true, phu }: {
  tracks: Track[];
  hanhDong: HanhDongBai;
  coSo?: boolean;
  /** Chữ phụ ở cột cuối thay cho thời lượng (ví dụ "12 lần"). */
  phu?: ((track: Track) => string) | undefined;
}) {
  const { dich } = useDich();
  const [menu, setMenu] = useState<{ track: Track; x: number; y: number } | null>(null);

  return (
    <>
      <div className="mz-bang" role="table" aria-label={dich('Danh sách bài hát')}>
        <div className="mz-bang-dau" role="row">
          <span>{coSo ? '#' : ''}</span>
          <span>{dich('Tiêu đề')}</span>
          <span />
          <span className="mz-bang-phai">{phu ? '' : dich('Thời lượng')}</span>
          <span />
        </div>
        {tracks.map((t, i) => (
          <DongBai
            key={`${t.id}-${i}`}
            track={t}
            so={i + 1}
            coSo={coSo}
            hanhDong={hanhDong}
            phu={phu?.(t)}
            onMenu={(x, y) => setMenu({ track: t, x, y })}
          />
        ))}
      </div>
      {menu && <RaNgoai><MenuBai {...menu} hanhDong={hanhDong} onDong={() => setMenu(null)} /></RaNgoai>}
    </>
  );
}

function DongBai({ track, so, coSo, hanhDong, phu, onMenu }: {
  track: Track; so: number; coSo: boolean; hanhDong: HanhDongBai; phu?: string | undefined;
  onMenu: (x: number, y: number) => void;
}) {
  const { dich, dichP } = useDich();
  const { online } = useAppState();
  const {
    currentId, playing, toggle, downloaded, downloading, download, remove, daThich, doiThich,
  } = useMusicPlayer();
  const laDangPhat = currentId === track.id;
  const daTai = downloaded.has(track.id);
  const chuaRut = laBaiYouTube(track);
  const phatDuoc = daTai || (online && !chuaRut);
  const rutDuoc = chuaRut && online && Boolean(hanhDong.onRut);
  const bam = () => {
    if (laDangPhat) toggle();
    else if (chuaRut && rutDuoc) hanhDong.onRut?.(track);
    else hanhDong.onPhat(track);
  };
  const thich = daThich.has(track.id);

  return (
    <div
      className="mz-dong"
      role="row"
      data-dang={laDangPhat}
      data-tat={!phatDuoc && !rutDuoc}
      onDoubleClick={() => { if (phatDuoc || rutDuoc) bam(); }}
      onContextMenu={(e) => { e.preventDefault(); onMenu(e.clientX, e.clientY); }}
    >
      <span className="mz-dong-so">
        {laDangPhat && playing
          ? <span className="mz-song" aria-label={dich('đang phát')}><i /><i /><i /><i /></span>
          : coSo ? so : null}
      </span>

      <span className="mz-dong-chinh">
        <button
          type="button"
          className="mz-dong-bia"
          onClick={bam}
          disabled={(!phatDuoc && !rutDuoc) || hanhDong.dangRut === track.id}
          aria-label={laDangPhat && playing ? dichP('Tạm dừng {ten}', { ten: track.title }) : dichP('Phát {ten}', { ten: track.title })}
          title={chuaRut
            ? dich('Bài lấy từ YouTube — bấm để rút âm thanh về máy chủ rồi phát (10-60 giây)')
            : !phatDuoc ? dich('Chưa tải về máy — cần mạng để nghe') : undefined}
        >
          <AnhBia src={track.coverImage} co={40} />
          <span className="mz-dong-bia-phu">
            {hanhDong.dangRut === track.id
              ? <Loader2 size={16} className="ct-spin" aria-hidden />
              : laDangPhat && playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
          </span>
        </button>
        <span className="mz-dong-chu">
          <span className="mz-dong-ten" title={track.title}>{track.title}</span>
          <span className="mz-dong-nghesi">
            {daTai && <CheckCircle2 size={11} className="mz-dong-tai" aria-label={dich('Đã có trên máy')} />}
            {chuaRut && <Youtube size={12} className="mz-dong-yt" aria-label="YouTube" />}
            {track.artist || dich('Không rõ nghệ sĩ')}
          </span>
        </span>
      </span>

      <button
        type="button"
        className="mz-tim"
        data-on={thich}
        onClick={() => void doiThich(track)}
        aria-pressed={thich}
        aria-label={thich ? dich('Bỏ thích') : dich('Thích')}
        title={thich ? dich('Bỏ thích') : dich('Thích')}
      >
        <Heart size={15} aria-hidden fill={thich ? 'currentColor' : 'none'} />
      </button>

      <span className="mz-dong-tg">{phu ?? clock(track.durationSeconds)}</span>

      <span className="mz-dong-nut">
        {daTai ? (
          <button type="button" className="mz-nut-nho" onClick={() => (hanhDong.onXoaBanTai ? hanhDong.onXoaBanTai(track) : void remove(track.id))} title={dich('Xoá trên máy và trên máy chủ')} aria-label={dich('Xoá trên máy và trên máy chủ')}>
            <Trash2 size={14} aria-hidden />
          </button>
        ) : !chuaRut ? (
          <button
            type="button"
            className="mz-nut-nho"
            onClick={() => void download(track)}
            disabled={!online || downloading.has(track.id)}
            title={online ? dich('Tải về nghe offline') : dich('Cần mạng để tải')}
            aria-label={dich('Tải về nghe offline')}
          >
            {downloading.has(track.id) ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Download size={14} aria-hidden />}
          </button>
        ) : rutDuoc && hanhDong.onRutVaTai ? (
          <button
            type="button"
            className="mz-nut-nho"
            onClick={() => hanhDong.onRutVaTai?.(track)}
            disabled={hanhDong.dangRut === track.id || downloading.has(track.id)}
            title={dich('Lưu lên máy chủ (R2) và tải về máy')}
            aria-label={dich('Lưu lên máy chủ (R2) và tải về máy')}
          >
            {hanhDong.dangRut === track.id || downloading.has(track.id) ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Download size={14} aria-hidden />}
          </button>
        ) : <span />}
        <button
          type="button"
          className="mz-nut-nho"
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); onMenu(r.right, r.bottom + 4); }}
          aria-label={dich('Thêm thao tác')}
          title={dich('Thêm thao tác')}
        >
          <MoreHorizontal size={16} aria-hidden />
        </button>
      </span>
    </div>
  );
}

function MenuBai({ track, x, y, hanhDong, onDong }: {
  track: Track; x: number; y: number; hanhDong: HanhDongBai; onDong: () => void;
}) {
  const { dich } = useDich();
  const { phatTiep, themVaoHang } = useMusicPlayer();
  const khung = useRef<HTMLDivElement>(null);
  const [moPl, setMoPl] = useState(false);
  const [moLoai, setMoLoai] = useState(false);
  const [viTri, setViTri] = useState({ left: x, top: y });

  /* Lật vào trong khi sát mép cửa sổ — menu mọc ra ngoài màn hình thì nửa số
     mục không bấm được. Đo SAU khi vẽ vì chưa vẽ thì chưa biết cao bao nhiêu. */
  useEffect(() => {
    const r = khung.current?.getBoundingClientRect();
    if (!r) return;
    const left = Math.max(8, Math.min(x - r.width, window.innerWidth - r.width - 8));
    const top = y + r.height > window.innerHeight - 8 ? Math.max(8, y - r.height - 8) : y;
    setViTri({ left, top });
  }, [x, y, moPl, moLoai]);

  useEffect(() => {
    const ngoai = (e: PointerEvent) => { if (!khung.current?.contains(e.target as Node)) onDong(); };
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    const cuon = () => onDong();
    document.addEventListener('pointerdown', ngoai);
    document.addEventListener('keydown', phim);
    window.addEventListener('wheel', cuon, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', ngoai);
      document.removeEventListener('keydown', phim);
      window.removeEventListener('wheel', cuon);
    };
  }, [onDong]);

  const lam = (f: () => void) => () => { f(); onDong(); };

  return (
    <div className="mz-menu" ref={khung} style={viTri} role="menu">
      <p className="mz-menu-dau" title={track.title}>{track.title}</p>
      <button type="button" role="menuitem" onClick={lam(() => phatTiep(track))}>
        <ListStart size={14} aria-hidden /> {dich('Phát tiếp theo')}
      </button>
      <button type="button" role="menuitem" onClick={lam(() => themVaoHang(track))}>
        <ListEnd size={14} aria-hidden /> {dich('Thêm vào cuối hàng chờ')}
      </button>
      <button type="button" role="menuitem" onClick={() => setMoPl((v) => !v)} aria-expanded={moPl}>
        <ListPlus size={14} aria-hidden /> {dich('Thêm vào playlist')}
      </button>
      {moPl && (
        <div className="mz-menu-con">
          {hanhDong.playlists.length === 0
            ? <span className="mz-menu-trong">{dich('Chưa có playlist nào — tạo ở cột bên trái.')}</span>
            : hanhDong.playlists.map((p) => (
              <button key={p.id} type="button" role="menuitem" onClick={lam(() => hanhDong.onThemVaoPlaylist(p, track))}>
                {p.name}
              </button>
            ))}
        </div>
      )}
      {hanhDong.onDoiLoai && (
        <button type="button" role="menuitem" onClick={() => setMoLoai((v) => !v)} aria-expanded={moLoai}>
          <Tags size={14} aria-hidden /> {dich('Loại nhạc')}
          <span className="mz-menu-phu">{dich(TEN_LOAI[loaiNhac(track) ?? 'khac'])}{track.language ? '' : ` · ${dich('tự đoán')}`}</span>
        </button>
      )}
      {moLoai && hanhDong.onDoiLoai && (
        <div className="mz-menu-con">
          {(['vi', 'en', 'zh'] as const).map((l) => (
            <button key={l} type="button" role="menuitemradio" aria-checked={track.language === l} onClick={lam(() => hanhDong.onDoiLoai?.(track, l))}>
              {track.language === l ? <Check size={13} aria-hidden /> : <span style={{ width: 13 }} />} {dich(TEN_LOAI[l])}
            </button>
          ))}
          {track.language && (
            <button type="button" role="menuitem" onClick={lam(() => hanhDong.onDoiLoai?.(track, null))}>
              <span style={{ width: 13 }} /> {dich('Bỏ nhãn (để app tự đoán)')}
            </button>
          )}
        </div>
      )}
      {hanhDong.onBoKhoiPlaylist && (
        <button type="button" role="menuitem" onClick={lam(() => hanhDong.onBoKhoiPlaylist?.(track))}>
          <X size={14} aria-hidden /> {dich('Bỏ khỏi playlist này')}
        </button>
      )}
      {hanhDong.onXoaHan && (
        <button type="button" role="menuitem" className="mz-menu-nguy" onClick={lam(() => hanhDong.onXoaHan?.(track))}>
          <Trash2 size={14} aria-hidden /> {dich('Xoá hẳn khỏi thư viện (chỉ admin)')}
        </button>
      )}
    </div>
  );
}
