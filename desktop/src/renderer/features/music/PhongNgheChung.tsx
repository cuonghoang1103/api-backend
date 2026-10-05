/**
 * PHÒNG NGHE CHUNG (05/10/2026) — người dùng: "room nghe nhạc realtime chung không độ chễ,
 * như discord".
 *
 * Dùng lại máy chủ `src/socket/listen-together.ts` (web cũng dùng) qua socket sẵn có của app.
 *
 * ─── Vì sao nghe "cùng một nhịp" ───
 *  1. ĐỒNG BỘ ĐỒNG HỒ kiểu NTP: hỏi `listen:time` 6 lần, lấy mẫu khứ hồi NGẮN NHẤT ⇒ biết giờ
 *     máy chủ sai lệch vài ms. Mọi mốc thời gian trong phòng tính bằng GIỜ MÁY CHỦ.
 *  2. Chủ phòng gửi vị trí kèm `at` (giờ máy chủ lúc chụp) ⇒ bù luôn độ trễ mạng chặng gửi.
 *  3. Khách tính "đáng lẽ đang ở giây nào" = vị trí + (giờ máy chủ bây giờ − at), rồi mỗi 400ms:
 *       lệch > 250ms  → tua thẳng tới đó
 *       lệch 40–250ms → chỉnh tốc độ 0,97×/1,03× cho tự đuổi kịp — KHÔNG nghe thấy tiếng giật
 *       lệch < 40ms   → tốc độ 1×
 *
 * Phòng sống khi trang Nhạc còn mở (component luôn gắn, chỉ ẩn khi xem mục khác). Trình phát
 * cá nhân được tạm dừng khi vào phòng — hai tiếng nhạc chồng nhau là thứ không ai muốn.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Crown, DoorOpen, Headphones, ListPlus, Loader2, LogOut, Pause, Play, Plus, Radio, Search, Send, SkipForward, Users, X } from 'lucide-react';
import type { Socket } from 'socket.io-client';
import type { ApiClient } from '../../api/client';
import { laySocket } from '../../realtime/socket';
import { useDich } from '../../i18n';
import { AnhBia } from './dungChung';
import { clock, fold, type Track } from './player';

type TrackPhong = { id: string; title: string; artist: string; audioUrl: string | null; coverImage: string | null; durationSeconds: number | null };
type TrangThai = { track: TrackPhong | null; isPlaying: boolean; positionSec: number; updatedAt: number };
type ThanhVien = { userId: number; username: string };
type TinChat = { userId: number; username: string; text: string; at: number };
type PhongMo = { roomId: string; name: string; hostName: string; members: number; isPlaying: boolean; track: { title: string; artist: string; coverImage: string | null } | null };
type Phong = { roomId: string; name: string; hostId: number; members: ThanhVien[]; state: TrangThai; chat: TinChat[]; queue: TrackPhong[] };

const CAM_XUC = ['❤️', '🔥', '😂', '👏', '🎶', '😍'];
const LECH_TUA = 0.25;
const LECH_EM = 0.04;

function emitAck<T>(s: Socket, ev: string, data: unknown, ms = 5000): Promise<T> {
  return new Promise((ok, loi) => {
    const t = window.setTimeout(() => loi(new Error('Máy chủ không trả lời')), ms);
    s.emit(ev, data, (res: T) => { window.clearTimeout(t); ok(res); });
  });
}

const veTrackPhong = (t: Track): TrackPhong => ({
  id: String(t.id), title: t.title, artist: t.artist ?? '', audioUrl: t.audioUrl ?? null,
  coverImage: t.coverImage ?? null, durationSeconds: t.durationSeconds ?? null,
});

export function PhongNgheChung({ api, hien, tracks, userId, dungNhacRieng }: {
  api: ApiClient | null;
  hien: boolean;
  tracks: Track[];
  userId: number | null;
  dungNhacRieng: () => void;
}) {
  const { dich, dichP } = useDich();
  const [socket, setSocket] = useState<Socket | null>(() => laySocket());
  const [noi, setNoi] = useState(() => !!laySocket()?.connected);
  const [phong, setPhong] = useState<Phong | null>(null);
  const [dsPhong, setDsPhong] = useState<PhongMo[]>([]);
  const [ma, setMa] = useState('');
  const [tenMoi, setTenMoi] = useState('');
  const [congKhai, setCongKhai] = useState(true);
  const [dang, setDang] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [chu, setChu] = useState('');
  const [timBai, setTimBai] = useState('');
  const [lech, setLech] = useState<number | null>(null);
  const [viTri, setViTri] = useState(0);
  const [bay, setBay] = useState<{ id: number; e: string; x: number }[]>([]);
  const [daChep, setDaChep] = useState(false);

  const audio = useRef<HTMLAudioElement | null>(null);
  const lechDongHo = useRef(0); // giờ máy chủ ≈ Date.now() + lechDongHo
  const phongRef = useRef<Phong | null>(null);
  phongRef.current = phong;
  const chatCuoi = useRef<HTMLDivElement>(null);
  const laChu = !!phong && phong.hostId === userId;
  const laChuRef = useRef(laChu);
  laChuRef.current = laChu;
  const gioMayChu = () => Date.now() + lechDongHo.current;

  // Socket có thể nối SAU khi trang mở — dò lại cho tới khi có.
  useEffect(() => {
    const t = window.setInterval(() => {
      const s = laySocket();
      setSocket((cu) => (cu === s ? cu : s));
      setNoi(!!s?.connected);
    }, 1500);
    return () => window.clearInterval(t);
  }, []);

  // ─── 1. Đồng bộ đồng hồ ───
  const dongBoDongHo = useCallback(async (s: Socket) => {
    let tot: { rtt: number; lech: number } | null = null;
    for (let i = 0; i < 6; i++) {
      const t0 = Date.now();
      try {
        const r = await emitAck<{ serverNow: number }>(s, 'listen:time', {}, 2000);
        const t1 = Date.now();
        const rtt = t1 - t0;
        const l = r.serverNow + rtt / 2 - t1;
        if (!tot || rtt < tot.rtt) tot = { rtt, lech: l };
      } catch { /* bỏ mẫu này */ }
    }
    if (tot) { lechDongHo.current = tot.lech; setLech(Math.round(tot.rtt / 2)); }
  }, []);
  useEffect(() => {
    if (!socket || !noi) return;
    void dongBoDongHo(socket);
    const t = window.setInterval(() => void dongBoDongHo(socket), 60_000);
    return () => window.clearInterval(t);
  }, [socket, noi, dongBoDongHo]);

  // ─── Danh sách phòng đang mở ───
  useEffect(() => {
    if (!socket || !noi || phong || !hien) return;
    const nap = () => void emitAck<{ rooms?: PhongMo[] }>(socket, 'listen:list', {}).then((r) => setDsPhong(r.rooms ?? [])).catch(() => undefined);
    nap();
    const t = window.setInterval(nap, 8000);
    return () => window.clearInterval(t);
  }, [socket, noi, phong, hien]);

  // ─── Sự kiện trong phòng ───
  useEffect(() => {
    if (!socket) return;
    const cung = (p: { roomId?: string }) => !!phongRef.current && p.roomId === phongRef.current.roomId;
    const onState = (p: TrangThai & { roomId: string }) => { if (cung(p)) setPhong((ph) => ph && { ...ph, state: { track: p.track, isPlaying: p.isPlaying, positionSec: p.positionSec, updatedAt: p.updatedAt } }); };
    const onMembers = (p: { roomId: string; members: ThanhVien[]; hostId: number }) => { if (cung(p)) setPhong((ph) => ph && { ...ph, members: p.members, hostId: p.hostId }); };
    const onChat = (p: TinChat & { roomId: string }) => { if (cung(p)) setPhong((ph) => ph && { ...ph, chat: [...ph.chat, p].slice(-50) }); };
    const onQueue = (p: { roomId: string; queue: TrackPhong[] }) => { if (cung(p)) setPhong((ph) => ph && { ...ph, queue: p.queue }); };
    const onReact = (p: { roomId: string; emoji: string }) => {
      if (!cung(p)) return;
      const id = Date.now() + Math.random();
      setBay((b) => [...b.slice(-20), { id, e: p.emoji, x: 10 + Math.random() * 80 }]);
      window.setTimeout(() => setBay((b) => b.filter((x) => x.id !== id)), 2600);
    };
    const onClosed = (p: { roomId: string }) => {
      if (!cung(p)) return;
      audio.current?.pause();
      setPhong(null);
      setLoi(dich('Chủ phòng đã rời đi — phòng đã đóng.'));
    };
    socket.on('listen:state', onState);
    socket.on('listen:members', onMembers);
    socket.on('listen:chat', onChat);
    socket.on('listen:queue', onQueue);
    socket.on('listen:react', onReact);
    socket.on('listen:closed', onClosed);
    // Mất mạng rồi nối lại: vào lại phòng (máy chủ giữ phòng khi chủ còn kết nối).
    const onConnect = () => {
      const ph = phongRef.current;
      if (ph && !laChuRef.current) void emitAck<{ ok: boolean }>(socket, 'listen:join', { roomId: ph.roomId }).then((r) => { if (!r.ok) setPhong(null); }).catch(() => undefined);
    };
    socket.on('connect', onConnect);
    return () => {
      socket.off('listen:state', onState); socket.off('listen:members', onMembers); socket.off('listen:chat', onChat);
      socket.off('listen:queue', onQueue); socket.off('listen:react', onReact); socket.off('listen:closed', onClosed);
      socket.off('connect', onConnect);
    };
  }, [socket, dich]);

  useEffect(() => { chatCuoi.current?.scrollTo({ top: chatCuoi.current.scrollHeight, behavior: 'smooth' }); }, [phong?.chat.length]);

  // Rời trang Nhạc = rời phòng (chủ rời thì phòng đóng cho mọi người).
  useEffect(() => () => {
    const ph = phongRef.current;
    if (ph) laySocket()?.emit('listen:leave', { roomId: ph.roomId });
    audio.current?.pause();
  }, []);

  const nguon = useCallback((t: TrackPhong | null): string | null => {
    if (!t) return null;
    if (/^\d+$/.test(t.id) && api) return `${api.baseUrlForForms()}/api/v1/music/stream/${t.id}`;
    return t.audioUrl && /^https?:\/\//.test(t.audioUrl) ? t.audioUrl : null;
  }, [api]);

  // ─── 3. Vòng bám nhịp (khách) + cập nhật thanh thời gian (cả hai) ───
  useEffect(() => {
    if (!phong) return;
    const t = window.setInterval(() => {
      const el = audio.current;
      const ph = phongRef.current;
      if (!el || !ph) return;
      setViTri(el.currentTime || 0);
      if (laChuRef.current) return;
      const st = ph.state;
      const src = nguon(st.track);
      if (!src) { el.pause(); return; }
      if (el.dataset.src !== src) { el.dataset.src = src; el.src = src; el.playbackRate = 1; }
      const dich2 = st.isPlaying ? st.positionSec + (gioMayChu() - st.updatedAt) / 1000 : st.positionSec;
      if (!st.isPlaying) {
        if (!el.paused) el.pause();
        if (Math.abs(el.currentTime - dich2) > LECH_TUA && el.readyState > 0) el.currentTime = dich2;
        return;
      }
      if (el.readyState < 2) { if (el.readyState > 0 && Math.abs(el.currentTime - dich2) > LECH_TUA) el.currentTime = dich2; void el.play().catch(() => undefined); return; }
      const l = el.currentTime - dich2;
      if (Math.abs(l) > LECH_TUA) { el.currentTime = dich2 + 0.05; el.playbackRate = 1; }
      else if (Math.abs(l) > LECH_EM) el.playbackRate = l > 0 ? 0.97 : 1.03;
      else el.playbackRate = 1;
      if (el.paused) void el.play().catch(() => undefined);
    }, 400);
    return () => window.clearInterval(t);
  }, [phong?.roomId, nguon]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Chủ phòng: phát + báo vị trí ───
  const baoTrangThai = useCallback((track?: TrackPhong | null) => {
    const ph = phongRef.current;
    const el = audio.current;
    if (!socket || !ph || !el || !laChuRef.current) return;
    const tr = track !== undefined ? track : ph.state.track;
    const st: TrangThai = { track: tr, isPlaying: !el.paused, positionSec: el.currentTime || 0, updatedAt: gioMayChu() };
    setPhong((p) => p && { ...p, state: st });
    socket.emit('listen:control', { roomId: ph.roomId, track: tr, isPlaying: st.isPlaying, positionSec: st.positionSec, at: st.updatedAt });
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  const chuPhat = useCallback((t: TrackPhong) => {
    const el = audio.current;
    const src = nguon(t);
    if (!el || !src) { setLoi(dich('Bài này chưa phát được trong phòng (chưa có bản âm thanh).')); return; }
    el.dataset.src = src; el.src = src; el.playbackRate = 1;
    void el.play().then(() => baoTrangThai(t), () => setLoi(dich('Không phát được bài này.')));
    const ph = phongRef.current;
    if (ph?.queue.some((q) => q.id === t.id)) socket?.emit('listen:queue-remove', { roomId: ph.roomId, trackId: t.id });
  }, [nguon, baoTrangThai, socket, dich]);

  useEffect(() => {
    const el = audio.current;
    if (!el || !laChu) return;
    const tuan = () => baoTrangThai();
    const het = () => {
      const ph = phongRef.current;
      const tiep = ph?.queue[0];
      if (tiep) chuPhat(tiep); else baoTrangThai();
    };
    el.addEventListener('play', tuan); el.addEventListener('pause', tuan); el.addEventListener('seeked', tuan); el.addEventListener('ended', het);
    // Nhịp tim 4 giây: bộ đệm của chủ có khựng thì khách vẫn bám theo vị trí THẬT.
    const t = window.setInterval(() => { if (!el.paused) baoTrangThai(); }, 4000);
    return () => { el.removeEventListener('play', tuan); el.removeEventListener('pause', tuan); el.removeEventListener('seeked', tuan); el.removeEventListener('ended', het); window.clearInterval(t); };
  }, [laChu, baoTrangThai, chuPhat]);

  // ─── Vào / tạo / rời ───
  const vaoPhong = useCallback((r: { ok?: boolean; roomId?: string; hostId?: number; members?: ThanhVien[]; state?: TrangThai; name?: string; chat?: TinChat[]; queue?: TrackPhong[]; error?: string }) => {
    if (!r.ok || !r.roomId || !r.state) { setLoi(r.error === 'not_found' ? dich('Không tìm thấy phòng — kiểm tra lại mã.') : dich('Không vào được phòng.')); return; }
    dungNhacRieng();
    setLoi(null);
    setPhong({ roomId: r.roomId, name: r.name ?? r.roomId, hostId: r.hostId ?? 0, members: r.members ?? [], state: r.state, chat: r.chat ?? [], queue: r.queue ?? [] });
  }, [dungNhacRieng, dich]);

  const taoPhong = async () => {
    if (!socket) return;
    setDang(true);
    try { vaoPhong(await emitAck(socket, 'listen:create', { name: tenMoi.trim(), isPublic: congKhai })); }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setDang(false); }
  };
  const thamGia = async (id: string) => {
    if (!socket || !id.trim()) return;
    setDang(true);
    try { vaoPhong(await emitAck(socket, 'listen:join', { roomId: id.trim().toUpperCase() })); }
    catch (e) { setLoi(e instanceof Error ? e.message : String(e)); }
    finally { setDang(false); }
  };
  const roiPhong = () => {
    if (phong) socket?.emit('listen:leave', { roomId: phong.roomId });
    const el = audio.current;
    if (el) { el.pause(); el.removeAttribute('src'); delete el.dataset.src; }
    setPhong(null);
  };

  const guiChat = () => {
    const t = chu.trim();
    if (!t || !phong) return;
    socket?.emit('listen:chat', { roomId: phong.roomId, text: t });
    setChu('');
  };
  const thaCamXuc = (e: string) => { if (phong) socket?.emit('listen:react', { roomId: phong.roomId, emoji: e }); };

  const baiLoc = useMemo(() => {
    const q = fold(timBai.trim());
    const ds = q ? tracks.filter((t) => fold(`${t.title} ${t.artist ?? ''}`).includes(q)) : tracks;
    return ds.slice(0, 40);
  }, [tracks, timBai]);

  const st = phong?.state;
  const tr = st?.track ?? null;
  const tong = tr?.durationSeconds || audio.current?.duration || 0;

  return (
    <section className="lt" hidden={!hien} aria-label={dich('Phòng nghe chung')}>
      <audio ref={audio} preload="auto" />
      {!phong ? (
        <>
          <div className="lt-dau">
            <div className="lt-dau-nen" aria-hidden><i /><i /><i /></div>
            <span className="lt-dau-icon"><Radio size={22} aria-hidden /></span>
            <div>
              <h1>{dich('Phòng nghe chung')}</h1>
              <p>{dich('Nghe cùng bạn bè theo thời gian thực — cùng một bài, cùng một giây, trò chuyện và thả cảm xúc.')}</p>
            </div>
          </div>
          {!noi && <div className="ct-notice" data-tone="warn"><Loader2 size={14} className="ct-spin" aria-hidden /><span>{dich('Đang kết nối máy chủ thời gian thực…')}</span></div>}
          {loi && <div className="ct-notice" data-tone="err" role="alert"><span>{loi}</span><button type="button" className="ct-linklike" onClick={() => setLoi(null)}>{dich('Đóng')}</button></div>}
          <div className="lt-hai">
            <form className="lt-the" onSubmit={(e) => { e.preventDefault(); void taoPhong(); }}>
              <h2><Plus size={16} aria-hidden /> {dich('Tạo phòng mới')}</h2>
              <input value={tenMoi} onChange={(e) => setTenMoi(e.target.value)} placeholder={dich('Tên phòng (tuỳ chọn)')} maxLength={60} />
              <label className="lt-chon"><input type="checkbox" checked={congKhai} onChange={(e) => setCongKhai(e.target.checked)} /> {dich('Hiện trong danh sách phòng đang mở')}</label>
              <button type="submit" className="mz-nut mz-nut-chinh" disabled={!noi || dang}>{dang ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Radio size={14} aria-hidden />} {dich('Tạo phòng')}</button>
            </form>
            <form className="lt-the" onSubmit={(e) => { e.preventDefault(); void thamGia(ma); }}>
              <h2><DoorOpen size={16} aria-hidden /> {dich('Vào bằng mã')}</h2>
              <input value={ma} onChange={(e) => setMa(e.target.value.toUpperCase())} placeholder="VD: K7Q2XD" maxLength={12} className="lt-ma-o" />
              <p className="lt-goi-y">{dich('Hỏi chủ phòng mã 6 ký tự rồi dán vào đây.')}</p>
              <button type="submit" className="mz-nut" disabled={!noi || dang || !ma.trim()}>{dich('Vào phòng')}</button>
            </form>
          </div>
          <h2 className="mz-h2">{dich('Phòng đang mở')}</h2>
          {dsPhong.length === 0 ? <p className="mz-trong-nho">{dich('Chưa có phòng công khai nào — tạo một phòng và rủ bạn bè vào nhé.')}</p> : (
            <div className="lt-ds">
              {dsPhong.map((r) => (
                <button key={r.roomId} type="button" className="lt-phong" onClick={() => void thamGia(r.roomId)} disabled={dang}>
                  <AnhBia src={r.track?.coverImage ?? null} ten={r.track?.title ?? r.name} co={52} />
                  <span className="lt-phong-chu">
                    <b>{r.name}</b>
                    <small>{r.track ? `${r.isPlaying ? '▶ ' : '❚❚ '}${r.track.title} — ${r.track.artist}` : dich('Chưa phát bài nào')}</small>
                  </span>
                  <span className="lt-phong-nguoi"><Users size={13} aria-hidden /> {r.members}</span>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="lt-trong">
          <div className="lt-san">
            <div className="lt-san-nen" style={{ backgroundImage: tr?.coverImage ? `url("${tr.coverImage}")` : undefined }} aria-hidden />
            <div className="lt-san-dau">
              <span className="lt-song" data-on={st?.isPlaying || undefined}><i /><i /><i /></span>
              <b>{phong.name}</b>
              <button type="button" className="lt-ma" title={dich('Chép mã phòng')} onClick={() => { void navigator.clipboard?.writeText(phong.roomId); setDaChep(true); window.setTimeout(() => setDaChep(false), 1500); }}>
                {phong.roomId} <Copy size={12} aria-hidden /> {daChep && <em>{dich('Đã chép')}</em>}
              </button>
              {lech !== null && <span className="lt-tre" title={dich('Độ trễ một chiều tới máy chủ — đã được bù khi đồng bộ')}>~{lech} ms</span>}
              <button type="button" className="mz-nut mz-nut-trong" onClick={roiPhong}><LogOut size={14} aria-hidden /> {laChu ? dich('Đóng phòng') : dich('Rời phòng')}</button>
            </div>
            <div className="lt-dia">
              <div className="lt-dia-bia" data-quay={st?.isPlaying || undefined}>
                <AnhBia src={tr?.coverImage ?? null} ten={tr?.title ?? phong.name} co={176} />
              </div>
              <div className="lt-dia-chu">
                <h2>{tr?.title ?? (laChu ? dich('Chọn một bài bên dưới để bắt đầu') : dich('Đang chờ chủ phòng chọn bài…'))}</h2>
                {tr && <p>{tr.artist}</p>}
                <div className="lt-thanh" aria-hidden><i style={{ width: tong ? `${Math.min(100, (viTri / tong) * 100)}%` : '0%' }} /></div>
                <div className="lt-gio"><span>{clock(viTri)}</span><span>{tong ? clock(tong) : '--:--'}</span></div>
                {laChu ? (
                  <div className="lt-dk">
                    <button type="button" className="lt-nut-to" disabled={!tr} onClick={() => { const el = audio.current; if (!el) return; if (el.paused) void el.play(); else el.pause(); }} aria-label={st?.isPlaying ? dich('Tạm dừng') : dich('Phát')}>
                      {st?.isPlaying ? <Pause size={22} aria-hidden /> : <Play size={22} aria-hidden />}
                    </button>
                    <button type="button" className="mz-nut mz-nut-trong" disabled={!phong.queue.length} onClick={() => phong.queue[0] && chuPhat(phong.queue[0])}><SkipForward size={15} aria-hidden /> {dich('Bài tiếp')}</button>
                    <input type="range" className="lt-tua" min={0} max={Math.max(1, Math.floor(tong))} value={Math.floor(viTri)} disabled={!tr}
                      onChange={(e) => { const el = audio.current; if (el) el.currentTime = Number(e.target.value); }} aria-label={dich('Tua')} />
                  </div>
                ) : (
                  <p className="lt-goi-y"><Headphones size={13} aria-hidden /> {dich('Chủ phòng điều khiển — bạn tự động nghe cùng nhịp.')}</p>
                )}
              </div>
            </div>
            <div className="lt-cam-xuc">
              {CAM_XUC.map((e) => <button key={e} type="button" onClick={() => thaCamXuc(e)} aria-label={e}>{e}</button>)}
            </div>
            <div className="lt-bay" aria-hidden>{bay.map((b) => <span key={b.id} style={{ left: `${b.x}%` }}>{b.e}</span>)}</div>
          </div>

          <aside className="lt-ben">
            <div className="lt-khoi">
              <h3><Users size={14} aria-hidden /> {dichP('{n} người đang nghe', { n: phong.members.length })}</h3>
              <ul className="lt-nguoi">
                {phong.members.map((m) => (
                  <li key={m.userId}><span className="lt-av">{m.username.charAt(0).toUpperCase()}</span>{m.username}{m.userId === phong.hostId && <Crown size={12} aria-label={dich('Chủ phòng')} />}</li>
                ))}
              </ul>
            </div>
            <div className="lt-khoi lt-khoi-chat">
              <h3>{dich('Trò chuyện')}</h3>
              <div className="lt-chat" ref={chatCuoi}>
                {phong.chat.length === 0 && <p className="lt-goi-y">{dich('Chào mọi người một câu đi!')}</p>}
                {phong.chat.map((m, i) => (
                  <p key={`${m.at}-${i}`} data-toi={m.userId === userId || undefined}><b>{m.username}</b>{m.text}</p>
                ))}
              </div>
              <form className="lt-gui" onSubmit={(e) => { e.preventDefault(); guiChat(); }}>
                <input value={chu} onChange={(e) => setChu(e.target.value)} placeholder={dich('Nhắn vào phòng…')} maxLength={300} />
                <button type="submit" aria-label={dich('Gửi')} disabled={!chu.trim()}><Send size={14} aria-hidden /></button>
              </form>
            </div>
            <div className="lt-khoi">
              <h3><ListPlus size={14} aria-hidden /> {dichP('Hàng chờ chung · {n}', { n: phong.queue.length })}</h3>
              {phong.queue.length === 0 ? <p className="lt-goi-y">{dich('Ai cũng đề xuất được bài — chủ phòng phát lần lượt.')}</p> : (
                <ol className="lt-hang">
                  {phong.queue.map((q) => (
                    <li key={q.id}>
                      <AnhBia src={q.coverImage} ten={q.title} co={30} />
                      <span><b>{q.title}</b><small>{q.artist}</small></span>
                      {laChu && <>
                        <button type="button" onClick={() => chuPhat(q)} aria-label={dich('Phát')}><Play size={12} aria-hidden /></button>
                        <button type="button" onClick={() => socket?.emit('listen:queue-remove', { roomId: phong.roomId, trackId: q.id })} aria-label={dich('Bỏ')}><X size={12} aria-hidden /></button>
                      </>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="lt-khoi">
              <h3>{laChu ? dich('Chọn bài để phát') : dich('Đề xuất bài')}</h3>
              <label className="lt-tim"><Search size={13} aria-hidden /><input value={timBai} onChange={(e) => setTimBai(e.target.value)} placeholder={dich('Tìm trong thư viện…')} /></label>
              <ul className="lt-bai">
                {baiLoc.map((t) => (
                  <li key={t.id}>
                    <AnhBia src={t.coverImage ?? null} ten={t.title} co={30} />
                    <span><b>{t.title}</b><small>{t.artist}</small></span>
                    {laChu && <button type="button" onClick={() => chuPhat(veTrackPhong(t))} aria-label={dich('Phát ngay')} title={dich('Phát ngay')}><Play size={12} aria-hidden /></button>}
                    <button type="button" onClick={() => socket?.emit('listen:queue-add', { roomId: phong.roomId, track: veTrackPhong(t) })} aria-label={dich('Thêm vào hàng chờ')} title={dich('Thêm vào hàng chờ')}><ListPlus size={12} aria-hidden /></button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
