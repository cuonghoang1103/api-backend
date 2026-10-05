/**
 * Quyền riêng tư của playlist (05/10/2026) — người dùng: "nhiều người dùng nghe nhạc riêng tư,
 * cá nhân… playlist có thể để riêng tư, hay chỉ user nào được chỉ định, hoặc công khai".
 *
 * Ba chế độ, suy từ dữ liệu máy chủ (xem MusicPlaylistShare trong schema):
 *   🌐 Công khai  — isPublic = true
 *   🔒 Riêng tư   — isPublic = false, không chia sẻ ai
 *   👥 Chia sẻ    — isPublic = false + danh sách người được chỉ định (PUT /playlists/:id/chia-se)
 * Chỉ CHỦ playlist thấy nút này (người được chia sẻ chỉ nghe).
 */
import { useEffect, useRef, useState } from 'react';
import { Globe2, Lock, Users, X, Search, Loader2, Check } from 'lucide-react';
import type { ApiClient } from '../../api/client';

type NguoiDung = { id: number; username: string; fullName?: string | null; displayName?: string | null; avatarUrl?: string | null };
const tenCua = (u: NguoiDung) => u.fullName || u.displayName || u.username;
export type CheDoPl = 'cong-khai' | 'rieng-tu' | 'chia-se';
export const cheDoCua = (p: { isPublic?: boolean; shareCount?: number }): CheDoPl => (p.isPublic ? 'cong-khai' : (p.shareCount ?? 0) > 0 ? 'chia-se' : 'rieng-tu');
export const NHAN_CHE_DO: Record<CheDoPl, string> = { 'cong-khai': 'Công khai', 'rieng-tu': 'Riêng tư', 'chia-se': 'Chia sẻ' };

export function BieuTuongCheDo({ cheDo, size = 13 }: { cheDo: CheDoPl; size?: number }) {
  return cheDo === 'cong-khai' ? <Globe2 size={size} aria-hidden /> : cheDo === 'chia-se' ? <Users size={size} aria-hidden /> : <Lock size={size} aria-hidden />;
}

export function QuyenPlaylist({ api, playlist, onDoi }: {
  api: ApiClient;
  playlist: { id: number; name: string; isPublic?: boolean; shareCount?: number };
  onDoi: () => void;
}) {
  const [mo, setMo] = useState(false);
  const [cheDo, setCheDo] = useState<CheDoPl>(cheDoCua(playlist));
  const [nguoi, setNguoi] = useState<NguoiDung[]>([]);
  const [tim, setTim] = useState('');
  const [ketQua, setKetQua] = useState<NguoiDung[]>([]);
  const [dang, setDang] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const khung = useRef<HTMLDivElement>(null);

  useEffect(() => { setCheDo(cheDoCua(playlist)); }, [playlist]);
  useEffect(() => {
    if (!mo) return;
    void api.request<NguoiDung[]>(`/api/v1/music/playlists/${playlist.id}/chia-se`).then((d) => setNguoi(Array.isArray(d) ? d : [])).catch(() => undefined);
    const ngoai = (e: PointerEvent) => { if (!khung.current?.contains(e.target as Node)) setMo(false); };
    document.addEventListener('pointerdown', ngoai);
    return () => document.removeEventListener('pointerdown', ngoai);
  }, [mo, api, playlist.id]);
  useEffect(() => {
    const q = tim.trim();
    if (!q) { setKetQua([]); return; }
    const t = setTimeout(() => {
      void api.request<NguoiDung[]>(`/api/v1/users/search?q=${encodeURIComponent(q)}`).then((d) => setKetQua((Array.isArray(d) ? d : []).filter((u) => !nguoi.some((n) => n.id === u.id)))).catch(() => setKetQua([]));
    }, 250);
    return () => clearTimeout(t);
  }, [tim, api, nguoi]);

  const luu = async (moi: CheDoPl, ds: NguoiDung[]) => {
    setDang(true); setLoi(null);
    try {
      if (moi === 'cong-khai') {
        if (ds.length) await api.request(`/api/v1/music/playlists/${playlist.id}/chia-se`, { method: 'PUT', body: { userIds: [] } });
        await api.request(`/api/v1/music/playlists/${playlist.id}`, { method: 'PUT', body: { isPublic: true } });
      } else {
        await api.request(`/api/v1/music/playlists/${playlist.id}`, { method: 'PUT', body: { isPublic: false } });
        await api.request(`/api/v1/music/playlists/${playlist.id}/chia-se`, { method: 'PUT', body: { userIds: moi === 'chia-se' ? ds.map((u) => u.id) : [] } });
      }
      setCheDo(moi === 'chia-se' && !ds.length ? 'rieng-tu' : moi);
      setNguoi(moi === 'chia-se' ? ds : []);
      onDoi();
    } catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setDang(false); }
  };

  return (
    <div className="mz-quyen" ref={khung}>
      <button type="button" className="mz-nut mz-nut-trong" data-che-do={cheDo} onClick={() => setMo((v) => !v)} title="Ai được xem playlist này">
        <BieuTuongCheDo cheDo={cheDo} size={14} /> {NHAN_CHE_DO[cheDo]}{cheDo === 'chia-se' && nguoi.length ? ` · ${nguoi.length}` : ''}
      </button>
      {mo && (
        <div className="mz-quyen-bang" role="dialog" aria-label="Quyền riêng tư playlist">
          <p className="mz-quyen-dau">Ai được xem “{playlist.name}”?</p>
          {([
            ['cong-khai', 'Công khai', 'Mọi người dùng đều thấy và nghe được.'],
            ['rieng-tu', 'Riêng tư', 'Chỉ mình bạn thấy.'],
            ['chia-se', 'Chia sẻ với người cụ thể', 'Chỉ những người bạn chọn bên dưới.'],
          ] as [CheDoPl, string, string][]).map(([k, ten, mo2]) => (
            <button key={k} type="button" className="mz-quyen-chon" data-chon={cheDo === k || undefined} disabled={dang}
              onClick={() => { if (k === 'chia-se') setCheDo('chia-se'); else void luu(k, nguoi); }}>
              <span className="mz-quyen-icon" data-che-do={k}><BieuTuongCheDo cheDo={k} size={15} /></span>
              <span><b>{ten}</b><small>{mo2}</small></span>
              {cheDo === k && <Check size={15} aria-hidden />}
            </button>
          ))}
          {cheDo === 'chia-se' && (
            <div className="mz-quyen-ng">
              <div className="mz-quyen-tim"><Search size={14} aria-hidden /><input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm người theo tên, username…" autoFocus /></div>
              {ketQua.length > 0 && (
                <div className="mz-quyen-kq">
                  {ketQua.slice(0, 6).map((u) => (
                    <button key={u.id} type="button" onClick={() => { const ds = [...nguoi, u]; setTim(''); void luu('chia-se', ds); }}>
                      {u.avatarUrl ? <img src={u.avatarUrl} alt="" /> : <span className="mz-quyen-chu">{tenCua(u).charAt(0).toUpperCase()}</span>}
                      <span>{tenCua(u)}<small>@{u.username}</small></span>
                    </button>
                  ))}
                </div>
              )}
              {nguoi.length === 0 ? <p className="mz-quyen-trong">Chưa chia sẻ cho ai — tìm và chọn người ở trên.</p> : (
                <ul className="mz-quyen-ds">
                  {nguoi.map((u) => (
                    <li key={u.id}>
                      {u.avatarUrl ? <img src={u.avatarUrl} alt="" /> : <span className="mz-quyen-chu">{tenCua(u).charAt(0).toUpperCase()}</span>}
                      <span>{tenCua(u)}<small>@{u.username}</small></span>
                      <button type="button" aria-label={`Bỏ ${u.username}`} disabled={dang} onClick={() => void luu('chia-se', nguoi.filter((x) => x.id !== u.id))}><X size={13} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {dang && <p className="mz-quyen-trong"><Loader2 size={13} className="ct-spin" /> Đang lưu…</p>}
          {loi && <p className="mz-quyen-loi">{loi}</p>}
        </div>
      )}
    </div>
  );
}
