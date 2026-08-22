'use client';

/**
 * Màn hình gọi thoại — phủ toàn trang khi đang gọi hoặc có người gọi tới.
 *
 * Tất cả logic WebRTC nằm ở `@/lib/webrtc/cuocGoi`; chỗ này chỉ vẽ và nối dây
 * socket. Tách vậy để phần khó (thương lượng kết nối, ICE, dọn tài nguyên)
 * kiểm được riêng mà không phải dựng cả một cây component.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { CuocGoi, type TrangThaiGoi } from '@/lib/webrtc/cuocGoi';
import { getSocket } from '@/lib/socket';

interface Props {
  /** Người đang mở khung chat — để biết gọi cho ai khi bấm nút. */
  threadId?: number;
  peerId?: number;
  peerName?: string;
  peerAvatar?: string | null;
  /** Bật lên khi người dùng bấm nút gọi ở thanh tiêu đề. */
  goiDi: number;
}

export default function CuocGoiOverlay({ threadId, peerId, peerName, peerAvatar, goiDi }: Props) {
  const [trangThai, setTrangThai] = useState<TrangThaiGoi>('roi');
  const [loi, setLoi] = useState<string | null>(null);
  const [tatMic, setTatMic] = useState(false);
  const [giay, setGiay] = useState(0);
  /** Tên hiển thị của người BÊN KIA — khi họ gọi tới thì không lấy từ props
   *  được, vì người dùng có thể đang mở hội thoại khác. */
  const [tenHienThi, setTenHienThi] = useState<string>('');

  const goiRef = useRef<CuocGoi | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Dựng đối tượng cuộc gọi MỘT lần ─────────────────────────
  if (!goiRef.current) {
    goiRef.current = new CuocGoi({
      doiTrangThai: setTrangThai,
      coTiengNoi: (luong) => {
        if (audioRef.current) {
          audioRef.current.srcObject = luong;
          // Trình duyệt chặn tự phát nếu chưa có tương tác — nhưng người dùng
          // vừa bấm "gọi" hoặc "nhận", nên tương tác đã có.
          void audioRef.current.play().catch(() => {});
        }
      },
      ketThuc: () => {},
      loi: setLoi,
    });
  }
  const goi = goiRef.current;

  // ── Đồng hồ đếm thời lượng ──────────────────────────────────
  useEffect(() => {
    if (trangThai !== 'dang-noi') { setGiay(0); return; }
    const t = setInterval(() => setGiay((g) => g + 1), 1000);
    return () => clearInterval(t);
  }, [trangThai]);

  // ── Nút gọi ở thanh tiêu đề bấm ─────────────────────────────
  useEffect(() => {
    if (goiDi <= 0 || !threadId || !peerId) return;
    setLoi(null);
    setTenHienThi(peerName ?? 'Người dùng');
    void goi.goi(threadId, peerId);
    // `goiDi` là một bộ đếm tăng dần, không phải cờ bật/tắt: bấm gọi lần thứ
    // hai sau khi cúp máy vẫn phải kích hoạt lại.
  }, [goiDi]);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nối dây socket ──────────────────────────────────────────
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const coNguoiGoi = (p: { callId: string; threadId: number; fromUserId: number; sdp: RTCSessionDescriptionInit; tenNguoiGoi?: string }) => {
      goi.chuanBiNhan(p.callId, p.threadId, p.fromUserId, p.sdp);
      setTenHienThi(p.tenNguoiGoi ?? peerName ?? 'Người dùng');
      setLoi(null);
    };
    const daNhan = (p: { callId: string; sdp: RTCSessionDescriptionInit }) => {
      goi.datCallId(p.callId);
      void goi.benKiaDaNhan(p.sdp);
    };
    const themIce = (p: { candidate: RTCIceCandidateInit }) => { void goi.themIce(p.candidate); };
    const ketThuc = (p: { lyDo: string }) => {
      const chu: Record<string, string> = {
        'tu-choi': 'Cuộc gọi bị từ chối',
        'khong-tra-loi': 'Không có ai trả lời',
        // Cuộc gọi chỉ reo khi app/tab bên kia ĐANG MỞ — chưa có CallKit
        // (iOS) hay thông báo đẩy đánh thức. Nói thẳng ra, đừng để người
        // dùng nhìn "Đang gọi…" 45 giây rồi tưởng app hỏng.
        'khong-truc-tuyen': 'Người này hiện không online',
        'mat-ket-noi': 'Mất kết nối',
        'cup-may': '',
      };
      const c = chu[p.lyDo];
      if (c) setLoi(c);
      goi.don();
    };
    const ban = (p: { ai: 'toi' | 'ho' }) => {
      setLoi(p.ai === 'ho' ? 'Người này đang bận một cuộc gọi khác.' : 'Bạn đang trong một cuộc gọi.');
      goi.don();
    };

    s.on('call:incoming', coNguoiGoi);
    // Máy chủ báo mã cuộc gọi NGAY khi bắt đầu đổ chuông — người gọi cần nó
    // để gửi ứng viên ICE, vốn bay ra trước lúc bên kia bắt máy nhiều giây.
    const coMa = (p: { callId: string }) => goi.datCallId(p.callId);
    s.on('call:ringing', coMa);
    s.on('call:answered', daNhan);
    s.on('call:ice', themIce);
    s.on('call:end', ketThuc);
    s.on('call:busy', ban);
    return () => {
      s.off('call:incoming', coNguoiGoi);
      s.off('call:ringing', coMa);
      s.off('call:answered', daNhan);
      s.off('call:ice', themIce);
      s.off('call:end', ketThuc);
      s.off('call:busy', ban);
    };
  }, [goi, peerName]);

  // ── Đóng tab khi đang gọi ───────────────────────────────────
  useEffect(() => {
    // Không có dòng này thì đóng tab giữa cuộc gọi khiến bên kia nghe im lặng
    // cho tới khi họ tự cúp. Máy chủ cũng bắt `disconnect`, nhưng gửi thẳng
    // `call:end` thì bên kia biết ngay thay vì đợi socket rớt.
    const truocKhiDong = () => { if (trangThai !== 'roi') goi.cupMay(); };
    window.addEventListener('beforeunload', truocKhiDong);
    return () => window.removeEventListener('beforeunload', truocKhiDong);
  }, [goi, trangThai]);

  const doiMic = useCallback(() => {
    setTatMic((t) => { goi.tatMicro(!t); return !t; });
  }, [goi]);

  if (trangThai === 'roi' && !loi) return null;

  const dinhDangGiay = (g: number) =>
    `${Math.floor(g / 60)}:${String(g % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/95 backdrop-blur-sm">
      <audio ref={audioRef} autoPlay playsInline className="hidden" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {peerAvatar
        ? <img src={peerAvatar} alt="" className="h-28 w-28 rounded-full object-cover ring-4 ring-white/10" />
        : <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-4xl">
            {(tenHienThi || '?').charAt(0).toUpperCase()}
          </div>}

      <p className="mt-5 text-xl font-semibold text-white">{tenHienThi || 'Người dùng'}</p>

      <p className="mt-1 text-sm text-white/60">
        {loi
          ? loi
          : trangThai === 'dang-goi' ? 'Đang gọi…'
          : trangThai === 'do-chuong' ? 'Cuộc gọi thoại đến'
          : trangThai === 'dang-noi' ? dinhDangGiay(giay)
          : ''}
      </p>

      <div className="mt-10 flex items-center gap-5">
        {trangThai === 'do-chuong' ? (
          <>
            <button
              type="button"
              onClick={() => goi.tuChoi()}
              aria-label="Từ chối"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white transition-transform active:scale-95"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={() => void goi.nhan()}
              aria-label="Nhận cuộc gọi"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white transition-transform active:scale-95"
            >
              <Phone className="h-7 w-7" />
            </button>
          </>
        ) : loi && trangThai === 'roi' ? (
          <button
            type="button"
            onClick={() => setLoi(null)}
            className="rounded-full bg-white/10 px-6 py-3 text-sm text-white"
          >
            Đóng
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={doiMic}
              aria-label={tatMic ? 'Bật micro' : 'Tắt micro'}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                tatMic ? 'bg-white text-neutral-900' : 'bg-white/10 text-white'
              }`}
            >
              {tatMic ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <button
              type="button"
              onClick={() => goi.cupMay()}
              aria-label="Cúp máy"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white transition-transform active:scale-95"
            >
              <PhoneOff className="h-7 w-7" />
            </button>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white/50">
              <Volume2 className="h-6 w-6" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
