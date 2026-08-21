/**
 * Màn hình gọi thoại của app desktop.
 *
 * Logic WebRTC nằm ở `realtime/cuocGoi`; chỗ này chỉ vẽ và nối dây socket —
 * cùng cách chia như bản web.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { CuocGoi, type IceServer, type TrangThaiGoi } from '../../realtime/cuocGoi';
import { laySocket } from '../../realtime/socket';
import { useSession } from '../../auth/session';

interface Props {
  threadId: number | null;
  peerId: number | null;
  peerTen: string;
  /** Bộ ĐẾM tăng dần, không phải cờ: bấm gọi lần hai sau khi cúp vẫn phải
   *  kích hoạt lại, mà cờ `true` thì lần hai không đổi giá trị. */
  lanBamGoi: number;
}

export default function KhungGoi({ threadId, peerId, peerTen, lanBamGoi }: Props) {
  const { api } = useSession();
  const [trangThai, datTrangThai] = useState<TrangThaiGoi>('roi');
  const [loi, datLoi] = useState<string | null>(null);
  const [tatMic, datTatMic] = useState(false);
  const [giay, datGiay] = useState(0);
  const [ten, datTen] = useState('');

  const goiRef = useRef<CuocGoi | null>(null);
  const tiengRef = useRef<HTMLAudioElement | null>(null);

  // ── Dựng đối tượng cuộc gọi khi đã có socket ────────────────
  useEffect(() => {
    const s = laySocket();
    // `api` là `null` cho tới khi phiên khôi phục xong — chưa có thì thôi,
    // effect chạy lại khi nó có.
    if (!s || !api || goiRef.current) return;
    goiRef.current = new CuocGoi(
      s,
      async (): Promise<IceServer[]> => {
        try {
          const r = await api.request<{ iceServers: IceServer[]; turn: boolean }>(
            '/api/v1/messages/ice-servers',
          );
          if (!r?.turn) console.warn('[gọi] TURN chưa cấu hình — gọi qua mạng chặt sẽ hỏng');
          return r?.iceServers ?? [];
        } catch {
          return [{ urls: 'stun:stun.l.google.com:19302' }];
        }
      },
      {
        doiTrangThai: datTrangThai,
        coTiengNoi: (luong) => {
          if (!tiengRef.current) return;
          tiengRef.current.srcObject = luong;
          void tiengRef.current.play().catch(() => {});
        },
        loi: datLoi,
      },
    );
  }, [api]);

  // ── Đồng hồ ─────────────────────────────────────────────────
  useEffect(() => {
    if (trangThai !== 'dang-noi') { datGiay(0); return; }
    const t = setInterval(() => datGiay((g) => g + 1), 1000);
    return () => clearInterval(t);
  }, [trangThai]);

  // ── Bấm nút gọi ─────────────────────────────────────────────
  useEffect(() => {
    if (lanBamGoi <= 0 || !threadId || !peerId || !goiRef.current) return;
    datLoi(null);
    datTen(peerTen);
    void goiRef.current.goi(threadId, peerId);
  }, [lanBamGoi]);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nối dây socket ──────────────────────────────────────────
  useEffect(() => {
    const s = laySocket();
    const g = goiRef.current;
    if (!s || !g) return;

    const den = (p: { callId: string; sdp: RTCSessionDescriptionInit; tenNguoiGoi?: string }) => {
      g.chuanBiNhan(p.callId, p.sdp);
      datTen(p.tenNguoiGoi ?? 'Người dùng');
      datLoi(null);
    };
    const daNhan = (p: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      g.datCallId(p.callId);
      void g.benKiaDaNhan(p.sdp);
    };
    const ice = (p: { candidate: RTCIceCandidateInit }) => { void g.themIce(p.candidate); };
    const ketThuc = (p: { lyDo: string }) => {
      const chu: Record<string, string> = {
        'tu-choi': 'Cuộc gọi bị từ chối',
        'khong-tra-loi': 'Không có ai trả lời',
        'mat-ket-noi': 'Mất kết nối',
        'cup-may': '',
      };
      const c = chu[p.lyDo];
      if (c) datLoi(c);
      g.don();
    };
    const ban = (p: { ai: 'toi' | 'ho' }) => {
      datLoi(p.ai === 'ho' ? 'Người này đang bận một cuộc gọi khác.' : 'Bạn đang trong một cuộc gọi.');
      g.don();
    };

    s.on('call:incoming', den);
    // Máy chủ báo mã cuộc gọi NGAY khi bắt đầu đổ chuông — người gọi cần nó
    // để gửi ứng viên ICE, vốn bay ra trước lúc bên kia bắt máy nhiều giây.
    const coMa = (p: { callId: string }) => g.datCallId(p.callId);
    s.on('call:ringing', coMa);
    s.on('call:answered', daNhan);
    s.on('call:ice', ice);
    s.on('call:end', ketThuc);
    s.on('call:busy', ban);
    return () => {
      s.off('call:incoming', den);
      s.off('call:ringing', coMa);
      s.off('call:answered', daNhan);
      s.off('call:ice', ice);
      s.off('call:end', ketThuc);
      s.off('call:busy', ban);
    };
  }, [trangThai === 'roi']);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Đóng app khi đang gọi ───────────────────────────────────
  useEffect(() => {
    // Không có dòng này thì đóng cửa sổ giữa cuộc gọi khiến bên kia nghe im
    // lặng tới khi họ tự cúp. Máy chủ cũng bắt `disconnect`, nhưng gửi thẳng
    // thì bên kia biết ngay.
    const truoc = () => { if (trangThai !== 'roi') goiRef.current?.cupMay(); };
    window.addEventListener('beforeunload', truoc);
    return () => window.removeEventListener('beforeunload', truoc);
  }, [trangThai]);

  const doiMic = useCallback(() => {
    datTatMic((t) => { goiRef.current?.tatMicro(!t); return !t; });
  }, []);

  if (trangThai === 'roi' && !loi) return null;

  const dinhDang = (g: number) => `${Math.floor(g / 60)}:${String(g % 60).padStart(2, '0')}`;

  return (
    <div className="ct-goi-phu">
      <audio ref={tiengRef} autoPlay className="ct-an" />
      <div className="ct-goi-anh">{(ten || '?').charAt(0).toUpperCase()}</div>
      <p className="ct-goi-ten">{ten || 'Người dùng'}</p>
      <p className="ct-goi-trangthai">
        {loi ? loi
          : trangThai === 'dang-goi' ? 'Đang gọi…'
          : trangThai === 'do-chuong' ? 'Cuộc gọi thoại đến'
          : trangThai === 'dang-noi' ? dinhDang(giay)
          : ''}
      </p>

      <div className="ct-goi-nut">
        {trangThai === 'do-chuong' ? (
          <>
            <button type="button" className="ct-goi-tron ct-goi-do"
                    onClick={() => goiRef.current?.tuChoi()} aria-label="Từ chối">
              <PhoneOff size={26} aria-hidden />
            </button>
            <button type="button" className="ct-goi-tron ct-goi-xanh"
                    onClick={() => void goiRef.current?.nhan()} aria-label="Nhận cuộc gọi">
              <Phone size={26} aria-hidden />
            </button>
          </>
        ) : loi && trangThai === 'roi' ? (
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => datLoi(null)}>Đóng</button>
        ) : (
          <>
            <button type="button" className={`ct-goi-tron ${tatMic ? 'ct-goi-tat' : 'ct-goi-mo'}`}
                    onClick={doiMic} aria-label={tatMic ? 'Bật micro' : 'Tắt micro'}>
              {tatMic ? <MicOff size={22} aria-hidden /> : <Mic size={22} aria-hidden />}
            </button>
            <button type="button" className="ct-goi-tron ct-goi-do"
                    onClick={() => goiRef.current?.cupMay()} aria-label="Cúp máy">
              <PhoneOff size={26} aria-hidden />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
