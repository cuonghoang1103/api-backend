'use client';

/**
 * Màn hình gọi thoại — phủ toàn trang khi đang gọi hoặc có người gọi tới.
 *
 * Tất cả logic WebRTC nằm ở `@/lib/webrtc/cuocGoi`; chỗ này chỉ vẽ và nối dây
 * socket. Tách vậy để phần khó (thương lượng kết nối, ICE, dọn tài nguyên)
 * kiểm được riêng mà không phải dựng cả một cây component.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Volume2 } from 'lucide-react';
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
  /** Bộ đếm riêng cho nút gọi VIDEO. Tách khỏi `goiDi` vì hai nút khác nhau. */
  goiVideo?: number;
}

export default function CuocGoiOverlay({ threadId, peerId, peerName, peerAvatar, goiDi, goiVideo = 0 }: Props) {
  const [trangThai, setTrangThai] = useState<TrangThaiGoi>('roi');
  const [loi, setLoi] = useState<string | null>(null);
  const [tatMic, setTatMic] = useState(false);
  const [giay, setGiay] = useState(0);
  /** Tên hiển thị của người BÊN KIA — khi họ gọi tới thì không lấy từ props
   *  được, vì người dùng có thể đang mở hội thoại khác. */
  const [tenHienThi, setTenHienThi] = useState<string>('');

  /** Cuộc này có hình không. Đặt lúc bấm gọi, hoặc lúc nhận `call:incoming`. */
  const [laVideo, setLaVideo] = useState(false);
  const [tatCam, setTatCam] = useState(false);

  const goiRef = useRef<CuocGoi | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoXaRef = useRef<HTMLVideoElement | null>(null);
  const videoToiRef = useRef<HTMLVideoElement | null>(null);
  /** Giữ luồng lại: thẻ <video> chỉ tồn tại KHI đang gọi video, mà luồng có
   *  thể tới trước lúc React kịp gắn thẻ đó vào DOM. */
  const luongXaRef = useRef<MediaStream | null>(null);
  const luongToiRef = useRef<MediaStream | null>(null);

  // ── Dựng đối tượng cuộc gọi MỘT lần ─────────────────────────
  if (!goiRef.current) {
    goiRef.current = new CuocGoi({
      doiTrangThai: setTrangThai,
      coTiengNoi: (luong) => {
        luongXaRef.current = luong;
        if (audioRef.current) {
          audioRef.current.srcObject = luong;
          // Trình duyệt chặn tự phát nếu chưa có tương tác — nhưng người dùng
          // vừa bấm "gọi" hoặc "nhận", nên tương tác đã có.
          void audioRef.current.play().catch(() => {});
        }
        if (videoXaRef.current) {
          videoXaRef.current.srcObject = luong;
          void videoXaRef.current.play().catch(() => {});
        }
      },
      luongCuaToi: (luong) => {
        luongToiRef.current = luong;
        if (videoToiRef.current) {
          videoToiRef.current.srcObject = luong;
          void videoToiRef.current.play().catch(() => {});
        }
      },
      doiCamera: (bat) => setTatCam(!bat),
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
    setLaVideo(false);
    void goi.goi(threadId, peerId, false);
    // `goiDi` là một bộ đếm tăng dần, không phải cờ bật/tắt: bấm gọi lần thứ
    // hai sau khi cúp máy vẫn phải kích hoạt lại.
  }, [goiDi]);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nút gọi VIDEO ───────────────────────────────────────────
  useEffect(() => {
    if (goiVideo <= 0 || !threadId || !peerId) return;
    setLoi(null);
    setTatCam(false);
    setTenHienThi(peerName ?? 'Người dùng');
    setLaVideo(true);
    void goi.goi(threadId, peerId, true);
  }, [goiVideo]);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Nối dây socket ──────────────────────────────────────────
  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const coNguoiGoi = (p: { callId: string; threadId: number; fromUserId: number; sdp: RTCSessionDescriptionInit; tenNguoiGoi?: string; coVideo?: boolean }) => {
      /* `coVideo` do MÁY CHỦ chuyển từ bên gọi. Biết trước khi bắt máy là điều
         kiện để xin camera ngay lượt `getUserMedia` đầu tiên — xem `cuocGoi.ts`. */
      goi.chuanBiNhan(p.callId, p.threadId, p.fromUserId, p.sdp, p.coVideo === true);
      setLaVideo(p.coVideo === true);
      setTatCam(false);
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

  const doiCam = useCallback(() => { goi.doiCamera(); }, [goi]);

  /* Gắn luồng vào thẻ <video> khi thẻ vừa xuất hiện.
     ⚠️ Cần vì thẻ chỉ được dựng KHI `laVideo` bật, mà luồng có thể tới TRƯỚC
     lúc đó — gán trong callback thôi là không đủ, và người dùng nhìn một ô
     đen trong khi tiếng vẫn chạy. */
  useEffect(() => {
    if (!laVideo) return;
    if (videoXaRef.current && luongXaRef.current) {
      videoXaRef.current.srcObject = luongXaRef.current;
      void videoXaRef.current.play().catch(() => {});
    }
    if (videoToiRef.current && luongToiRef.current) {
      videoToiRef.current.srcObject = luongToiRef.current;
      void videoToiRef.current.play().catch(() => {});
    }
  }, [laVideo, trangThai]);

  if (trangThai === 'roi' && !loi) return null;

  const dinhDangGiay = (g: number) =>
    `${Math.floor(g / 60)}:${String(g % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/95 backdrop-blur-sm">
      <audio ref={audioRef} autoPlay playsInline className="hidden" />

      {laVideo && trangThai === 'dang-noi' ? (
        <>
          {/* Hình người kia — phủ kín nền. `object-cover` chứ không `contain`:
              khung hình webcam và khung cửa sổ hiếm khi cùng tỉ lệ, và hai dải
              đen hai bên trông như app hỏng. */}
          <video
            ref={videoXaRef}
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Hình của mình — ô nhỏ góc dưới phải.
              `muted` là BẮT BUỘC: không có nó người dùng nghe lại tiếng chính
              mình vọng về, trễ vài phần giây, và không nói nổi một câu.
              `scale-x-[-1]` cho giống gương — người ta quen thấy mình lật. */}
          <video
            ref={videoToiRef}
            autoPlay
            playsInline
            muted
            className={`absolute bottom-28 right-5 h-40 w-28 scale-x-[-1] rounded-xl object-cover
              shadow-lg ring-1 ring-white/20 sm:h-48 sm:w-32 ${tatCam ? 'hidden' : ''}`}
          />
          {tatCam && (
            <div className="absolute bottom-28 right-5 flex h-40 w-28 items-center justify-center
              rounded-xl bg-neutral-800 ring-1 ring-white/20 sm:h-48 sm:w-32">
              <VideoOff className="h-6 w-6 text-white/50" />
            </div>
          )}
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {peerAvatar
            ? <img src={peerAvatar} alt="" className="h-28 w-28 rounded-full object-cover ring-4 ring-white/10" />
            : <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-4xl">
                {(tenHienThi || '?').charAt(0).toUpperCase()}
              </div>}
        </>
      )}

      {/* ⚠️ `relative z-10` là BẮT BUỘC khi có video. Thẻ <video> ở trên định vị
          TUYỆT ĐỐI, mà phần tử được định vị luôn vẽ đè lên phần tử tĩnh bất kể
          thứ tự trong DOM — thiếu dòng này thì tên, đồng hồ và cả cụm nút cúp
          máy biến mất dưới khung hình, và người dùng không có cách nào tắt. */}
      <p className={`relative z-10 mt-5 text-xl font-semibold text-white ${laVideo && trangThai === 'dang-noi' ? 'absolute left-0 right-0 top-6 text-center drop-shadow' : ''}`}>
        {tenHienThi || 'Người dùng'}
      </p>

      <p className={`relative z-10 mt-1 text-sm text-white/60 ${laVideo && trangThai === 'dang-noi' ? 'absolute left-0 right-0 top-14 text-center drop-shadow' : ''}`}>
        {loi
          ? loi
          : trangThai === 'dang-goi' ? 'Đang gọi…'
          : trangThai === 'do-chuong' ? (laVideo ? 'Cuộc gọi video đến' : 'Cuộc gọi thoại đến')
          : trangThai === 'dang-noi' ? dinhDangGiay(giay)
          : ''}
      </p>

      <div className={`relative z-10 flex items-center gap-5 ${laVideo && trangThai === 'dang-noi' ? 'absolute bottom-8 left-0 right-0 justify-center' : 'mt-10'}`}>
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
            {laVideo ? (
              <button
                type="button"
                onClick={doiCam}
                aria-label={tatCam ? 'Bật camera' : 'Tắt camera'}
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  tatCam ? 'bg-white text-neutral-900' : 'bg-white/10 text-white'
                }`}
              >
                {tatCam ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
              </button>
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white/50">
                <Volume2 className="h-6 w-6" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
