/**
 * Playlist — dãy thẻ ở đầu trang Nhạc, và màn xem một playlist.
 *
 * Giống thẻ trên web (ảnh bìa vuông, tên, số bài, tổng thời lượng, người tạo),
 * nhưng thêm hai thứ web không có: bấm là PHÁT ngay cả playlist, và xoá được
 * từng bài khỏi playlist mà không rời màn hình.
 */
import { useCallback, useEffect, useState } from 'react';
import { ListMusic, Loader2, Play, Plus, Trash2, X } from 'lucide-react';
import { useSession } from '../../auth/session';
import { clock, type Track } from './player';
import {
  boBaiKhoiPlaylist, layDanhSachPlaylist, layPlaylist, taoPlaylist, tongThoiLuong,
  xoaPlaylist, type Playlist,
} from './playlists';

export function PlaylistBar({
  onPhat,
  baiDangPhat,
  moiThem,
}: {
  /** Phát một bài, lấy chính playlist đó làm hàng phát. */
  onPhat: (bai: Track, danhSach: Track[]) => void;
  baiDangPhat: number | null;
  /** Đổi giá trị này là buộc nạp lại (ví dụ vừa thêm bài vào playlist). */
  moiThem: number;
}) {
  const { api } = useSession();
  const [danhSach, setDanhSach] = useState<Playlist[]>([]);
  const [dangMo, setDangMo] = useState<Playlist | null>(null);
  const [dangTao, setDangTao] = useState(false);
  const [ten, setTen] = useState('');
  const [ban, setBan] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  const nap = useCallback(async () => {
    if (!api) return;
    try { setDanhSach(await layDanhSachPlaylist(api)); }
    catch { /* không có playlist cũng không sao — đừng chắn cả trang vì việc này */ }
  }, [api]);

  useEffect(() => { void nap(); }, [nap, moiThem]);

  const mo = async (p: Playlist) => {
    if (!api) return;
    setBan(true);
    try { setDangMo(await layPlaylist(api, p.id)); }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setBan(false); }
  };

  const tao = async () => {
    if (!api || !ten.trim()) return;
    setBan(true);
    setLoi(null);
    try {
      await taoPlaylist(api, ten.trim());
      setTen('');
      setDangTao(false);
      await nap();
    } catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setBan(false); }
  };

  const xoa = async (p: Playlist) => {
    if (!api) return;
    if (!window.confirm(`Xoá playlist “${p.name}”? Các bài hát vẫn còn trong thư viện.`)) return;
    setBan(true);
    try {
      await xoaPlaylist(api, p.id);
      if (dangMo?.id === p.id) setDangMo(null);
      await nap();
    } catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setBan(false); }
  };

  const boBai = async (trackId: number) => {
    if (!api || !dangMo) return;
    setBan(true);
    try {
      await boBaiKhoiPlaylist(api, dangMo.id, trackId);
      setDangMo(await layPlaylist(api, dangMo.id));
      await nap();
    } catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setBan(false); }
  };

  // ─── Màn xem một playlist ───────────────────────────────
  if (dangMo) {
    const bai = dangMo.tracks ?? [];
    return (
      <section className="ct-pl-view" aria-label={`Playlist ${dangMo.name}`}>
        <div className="ct-pl-view-head">
          {dangMo.coverUrl
            ? <img src={dangMo.coverUrl} alt="" className="ct-pl-view-art" />
            : <span className="ct-pl-view-art ct-pl-blank"><ListMusic size={28} /></span>}
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="ct-np-eyebrow">Playlist</p>
            <h2 className="ct-lib-title">{dangMo.name}</h2>
            <p className="ct-np-artist">
              {bai.length} bài · {tongThoiLuong(bai)}
              {dangMo.createdByName ? ` · ${dangMo.createdByName}` : ''}
            </p>
            <div className="ct-lib-actions">
              <button
                type="button"
                className="ct-btn"
                disabled={bai.length === 0}
                onClick={() => { const d = bai[0]; if (d) onPhat(d, bai); }}
              >
                <Play size={15} aria-hidden /> Phát playlist
              </button>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => setDangMo(null)}>
                <X size={15} aria-hidden /> Đóng
              </button>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => void xoa(dangMo)}>
                <Trash2 size={15} aria-hidden /> Xoá playlist
              </button>
            </div>
          </div>
        </div>

        {bai.length === 0 ? (
          <p className="ct-muted" style={{ padding: '10px 4px' }}>
            Playlist này chưa có bài nào. Mở một bài rồi bấm “Thêm vào playlist” ở màn hình đang phát.
          </p>
        ) : (
          <ol className="ct-tracks">
            {bai.map((t, i) => (
              <li key={t.id} className="ct-trk" data-current={baiDangPhat === t.id}>
                <span className="ct-trk-index">{i + 1}</span>
                <button type="button" className="ct-trk-art" onClick={() => onPhat(t, bai)} aria-label={`Phát ${t.title}`}>
                  {t.coverImage
                    ? <img src={t.coverImage} alt="" loading="lazy" />
                    : <span className="ct-trk-art-blank"><ListMusic size={15} aria-hidden /></span>}
                  <span className="ct-trk-art-veil"><Play size={15} aria-hidden /></span>
                </button>
                <span className="ct-trk-main">
                  <span className="ct-trk-title">{t.title}</span>
                  <span className="ct-trk-artist">{t.artist || 'Không rõ nghệ sĩ'}</span>
                </span>
                <span />
                <span className="ct-trk-time">{clock(t.durationSeconds)}</span>
                <button
                  type="button"
                  className="ct-trk-action"
                  onClick={() => void boBai(t.id)}
                  disabled={ban}
                  aria-label={`Bỏ ${t.title} khỏi playlist`}
                  title="Bỏ khỏi playlist"
                >
                  <X size={15} aria-hidden />
                </button>
              </li>
            ))}
          </ol>
        )}
        {loi && <div className="ct-notice" data-tone="err"><span>{loi}</span></div>}
      </section>
    );
  }

  // ─── Dãy thẻ ────────────────────────────────────────────
  return (
    <section className="ct-pl" aria-label="Playlist">
      <h3 className="ct-yt-head" style={{ padding: 0, marginBottom: 10 }}>
        <ListMusic size={15} aria-hidden />
        Playlist
        <span className="ct-muted" style={{ fontWeight: 400, fontSize: 12 }}>— {danhSach.length}</span>
      </h3>

      <div className="ct-pl-row">
        {danhSach.map((p) => (
          <button key={p.id} type="button" className="ct-pl-card" onClick={() => void mo(p)} title={p.name}>
            <span className="ct-pl-card-art">
              {p.coverUrl
                ? <img src={p.coverUrl} alt="" loading="lazy" />
                : <span className="ct-pl-blank"><ListMusic size={26} /></span>}
              <span className="ct-pl-card-play"><Play size={18} aria-hidden /></span>
            </span>
            <span className="ct-pl-card-name">{p.name}</span>
            <span className="ct-pl-card-sub">{p.trackCount ?? 0} bài</span>
          </button>
        ))}

        {dangTao ? (
          <div className="ct-pl-card ct-pl-card-form">
            <input
              autoFocus
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              onKeyDown={(e) => {
                // Enter tạo, Escape huỷ — nhưng nhường IME: gõ tiếng Việt/Trung
                // bằng bộ gõ thì Enter đầu tiên là để CHỐT chữ, không phải để
                // gửi. Xem [[feedback_ime_composing_guard]].
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') void tao();
                if (e.key === 'Escape') { setDangTao(false); setTen(''); }
              }}
              placeholder="Tên playlist…"
              aria-label="Tên playlist mới"
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="ct-btn" onClick={() => void tao()} disabled={ban || !ten.trim()}>
                {ban ? <Loader2 size={14} className="ct-spin" aria-hidden /> : 'Tạo'}
              </button>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => { setDangTao(false); setTen(''); }}>
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="ct-pl-card ct-pl-card-them" onClick={() => setDangTao(true)}>
            <span className="ct-pl-card-art ct-pl-blank"><Plus size={26} /></span>
            <span className="ct-pl-card-name">Tạo playlist</span>
            <span className="ct-pl-card-sub">danh sách của riêng bạn</span>
          </button>
        )}
      </div>
      {loi && <div className="ct-notice" data-tone="err"><span>{loi}</span></div>}
    </section>
  );
}
