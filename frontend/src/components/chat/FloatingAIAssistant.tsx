'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePreferencesStore } from '@/store/preferencesStore';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { CuongMiniRobot, type CamXucCuongMini } from '@/components/cuongmini/CuongMiniRobot';
import { useChatStore } from '@/store/chatStore';
import { useMusicStore } from '@/store/musicStore';
import { useReduceAnimations } from '@/hooks/useIsTouch';
import { useTranslation } from '@/hooks/useTranslation';
import { getLandingCopy } from '@/components/home/landing/landingCopy';
import ChatModal from './ChatModal';
import { useGiaSuBaiStore } from '@/store/giaSuBaiStore';

type RobotState = 'idle' | 'thinking' | 'typing';

const IDLE_MESSAGES = [
  'Bạn cần hỗ trợ gì không?',
  'Mình có thể giúp gì cho bạn?',
  'Chào bạn! Hỏi mình nhé',
  'Có gì mình có thể giúp?',
];

export default function FloatingAIAssistant() {
 // /creator is a full-screen workspace with its own topbar
 // and editor chrome. The floating AI bubble would cover
 // bottom-right of the editor's autosave indicator and
 // the platform-post publish toggles, so hide it there.
 // /admin: the customer-facing AI bubble has no business on admin
 // surfaces, and at z-100 it floated over admin modals' bottom-right
 // action buttons (blocked snippet creation in /admin/exp-hub,
 // 2026-07-06) — hide it there too.
 const pathname = usePathname();
 const isLanding = pathname === '/';
 const { locale } = useTranslation();
 const landingCopy = getLandingCopy(locale);
 // On MOBILE, show the AI bubble only on the home feed ('/') — on every other
 // page it covered content/action buttons (user request 2026-07-09). Desktop
 // is unaffected. Uses matchMedia (a plain call, not a hook) so the value is
 // available synchronously during render.
 // ⚠️ NGOẠI LỆ: trang BÀI HỌC vẫn hiện trên điện thoại (15/09/2026). Robot ở
 // đó là lối tắt tới gia sư của chính bài đang học, và màn hình càng nhỏ thì
 // quãng cuộn xuống mục gia sư cuối bài càng dài — tức chỗ nó CẦN nhất lại
 // đang là chỗ duy nhất nó bị ẩn. `dangHocBai` do `CourseTutor` ghi vào kho
 // khi bài được mở, nên ngoại lệ này chỉ mở đúng lúc đang học.
 //
 // ⚠️ 17/11/2026: nhận trang học theo ĐƯỜNG DẪN trước, kho `bai` chỉ là đường phụ. `bai` do `CourseTutor` ghi SAU khi
 // khoá + bài tải xong, nên chỉ dựa vào nó thì trên máy cảm ứng nút bị ẩn suốt lúc tải rồi mới bật ra — một phần của
 // lỗi "icon hiện rồi biến" (docs/so-loi.md).
 const laTrangHoc = /^\/courses\/[^/]+\/learn(?:\/|$)/.test(pathname ?? '');
 const dangHocBai = !!useGiaSuBaiStore((st) => st.bai) || laTrangHoc;
 const hiddenOnMobile =
   pathname !== '/' &&
   !dangHocBai &&
   typeof window !== 'undefined' &&
   window.matchMedia?.('(pointer: coarse)')?.matches;
 // Whether to hide the bubble on this route. We must NOT `return null` here:
 // this component is mounted in the root layout and persists across
 // client-side navigation, so an early return BEFORE the hooks below would
 // change the hook count between renders (e.g. '/' → '/admin') and throw
 // React error #310 "rendered fewer hooks than expected". Compute the flag
 // now, call every hook unconditionally, then bail out just before the JSX.
 // `/nhung-video`: khung nhung TRAN cho lop phu cua app desktop, chi co dung
 // mot iframe lap kin man hinh. Bong bong tro ly ve de len giua video.
 // Công tắc của người dùng (Cài đặt → Giao diện), đồng bộ theo tài khoản.
 // `!== false` chứ không `!!`: người dùng cũ chưa có khoá này, coi "thiếu" là
 // tắt thì bản cập nhật làm trợ lý biến mất với tất cả họ.
 const nguoiDungBat = usePreferencesStore((st) => st.hienTroLy) !== false;
 const setHienTroLy = usePreferencesStore((st) => st.setHienTroLy);
 const hidden = Boolean(
   !nguoiDungBat
   || pathname?.startsWith('/creator') || pathname?.startsWith('/admin')
   || pathname?.startsWith('/nhung-video')
   // Studio has its own project CTA; the floating tutor obscures the exhibit.
   || pathname === '/about/studio' || pathname?.startsWith('/about/studio/case/') || pathname?.startsWith('/about/quy-trinh') || pathname?.startsWith('/about/nhan-du-an') || pathname === '/about/bao-mat'
   // CT Work có trợ lý AI riêng trong dự án (đợt 4); robot nổi đè lên board.
   || pathname === '/work' || pathname?.startsWith('/work/')
   // Sổ tay có nút "Hỏi ghi chú" riêng ở đúng góc này; robot đè lên nó (26/09).
   || pathname === '/notes' || pathname?.startsWith('/notes/')
   // IELTS có gia sư riêng neo đúng góc phải; robot nổi che nút Gửi của nó.
   || pathname?.endsWith('/ielts') || pathname?.endsWith('/dekiru')
   // Phòng thi máy tính / Flashcards / Sổ lỗi IELTS (07/10/2026): robot che nút ◀ ▶ và ô số câu ở thanh dưới.
   || /\/ielts\/(thi-may|the-tu|so-loi)$/.test(pathname ?? '')
   // 📷 Sách gốc có khung gia sư theo trang ở cột phải — robot che ô gõ câu hỏi.
   || pathname?.endsWith('/dekiru/sach-goc')
   // Chính trang /chat (giao diện kiểu Claude 09/11/2026): robot nổi đè lên nút Gửi/chọn model ở góc phải ô soạn.
   || pathname === '/chat'
   || hiddenOnMobile,
 );

 // Selector RIÊNG từng trường: `useChatStore()` trần đăng ký cả kho chat, nên MỖI mẩu chữ AI chảy về ở bất kỳ đâu
 // cũng vẽ lại nút này (và trước 17/11 còn khởi động lại vòng nhún framer của nó — robot giật).
 const isStreaming = useChatStore((s) => s.isStreaming);
 const robotEmotion = useChatStore((s) => s.robotEmotion);
 // When a track is loaded the mobile music bar sits above the bottom nav;
 // lift the robot above the bar too so it never overlaps it (mobile only —
 // see `.ai-robot-fab` in globals.css). 84px ≈ the mini-bar's height.
 const musicActive = useMusicStore((s) => !!s.currentTrack);
 // Máy cảm ứng / giảm chuyển động: CuongMini đứng yên (CSS `prefers-reduced-motion` lo phần còn lại).
 const reduceAnim = useReduceAnimations();

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [hover, setHover] = useState(false);
  /** Vừa bấm ⇒ CuongMini nhảy tưng một nhịp. */
  const [vuaBam, setVuaBam] = useState(false);
  /** Mờ dần khi xuất hiện — CHỈ lần đầu trong một lần tải trang (xem chú thích ở JSX). */
  const [lanDau, setLanDau] = useState(() => { const l = !daHienLanDau; daHienLanDau = true; return l; });
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const robotState: RobotState = isStreaming
    ? 'thinking'
    : robotEmotion === 'typing'
    ? 'typing'
    : 'idle';
  const mood: CamXucCuongMini = robotState === 'thinking' ? 'nghi' : robotState === 'typing' ? 'noi' : vuaBam ? 'vui' : 'thuong';

  /*
   * ── Nút nổi CÓ MẶT hay không: báo cho kho gia sư ──
   * "Hỏi phần này" ở mục lục video mở KHUNG ROBOT khi nút này đang hiện; người dùng đã ẩn trợ lý (hoặc trang ẩn nó)
   * thì mục gia sư cuối bài tự cuộn tới thay. Thiếu cờ này thì bấm "Hỏi phần này" lúc trợ lý bị ẩn là không có gì xảy ra.
   */
  const datRobotSan = useGiaSuBaiStore((s) => s.datRobotSan);
  const sanSang = !hidden && !isLanding;
  useEffect(() => {
    datRobotSan(sanSang);
    return () => datRobotSan(false);
  }, [sanSang, datRobotSan]);

  const scheduleTooltip = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setShowTooltip(false);

    idleTimerRef.current = setTimeout(() => {
      const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
      setTooltipMessage(msg);
      setShowTooltip(true);
      tooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 5000);
    }, 6000 + Math.random() * 2000);
  }, []);

  useEffect(() => {
    // On routes where the bubble is hidden, don't schedule idle tooltips —
    // otherwise a pending tooltip could flash the instant we navigate back to
    // a visible route. (The hook itself still runs; only its body is gated.)
    // Trang học: KHÔNG hiện câu mời ngẫu nhiên — người học đang xem video, một bong bóng bật lên mỗi 6–8 s là đúng thứ
    // "hiện rồi biến" làm phiền nhất.
    if (hidden || isLanding || isOpen || laTrangHoc) {
      setShowTooltip(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      return;
    }
    scheduleTooltip();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [hidden, isLanding, isOpen, laTrangHoc, scheduleTooltip]);

  const handleMouseEnter = () => {
    setHover(true);
    if (!isOpen) {
      setShowTooltip(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setHover(false);
    if (!isOpen && !laTrangHoc) scheduleTooltip();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setVuaBam(true);
    window.setTimeout(() => setVuaBam(false), 950);
  };

  /* "Hỏi phần này" / "Hỏi slide này" / phím tắt ⇒ mở khung (ChatModal tự chuyển về chế độ gia sư). */
  const moYeuCau = useGiaSuBaiStore((s) => s.moYeuCau);
  const daThayYeuCau = useRef(moYeuCau);
  useEffect(() => {
    if (moYeuCau === daThayYeuCau.current) return;
    daThayYeuCau.current = moYeuCau;
    if (sanSang) { setIsOpen(true); setShowTooltip(false); }
  }, [moYeuCau, sanSang]);

  // Note: the messaging widget sits above the AI robot (bottom-24 vs
  // bottom-6), so they don't overlap and the AI robot stays put.

  const handleClose = () => {
    setIsOpen(false);
    if (!isLanding && !laTrangHoc) scheduleTooltip();
  };

  // Route-based hide happens HERE — after every hook has run — so the hook
  // order stays identical whether or not the bubble is shown (see `hidden`).
  if (hidden) return null;

  if (isLanding) {
    return (
      <>
        <div
          className="ai-robot-fab landing-ai-fab fixed bottom-6 right-6 z-[100]"
          style={{ ['--music-offset' as string]: musicActive ? '84px' : '0px' } as React.CSSProperties}
        >
          <button
            type="button"
            className="landing-ai-fab-button"
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            aria-label={landingCopy.assistant.label}
          >
            <MessageCircle aria-hidden size={18} />
            <span>{landingCopy.assistant.label}</span>
          </button>
        </div>
        <AnimatePresence>
          {isOpen && <ChatModal onClose={handleClose} />}
        </AnimatePresence>
      </>
    );
  }

  /*
   * ⚠️⚠️ NÚT NỔI PHẢI ĐỨNG YÊN MỘT CHỖ, MỘT HÌNH (17/11/2026 — "icon hiện rồi biến").
   *
   * Ba thứ từng làm nó chớp tắt, đều đã gỡ:
   *   1. Đổi ẢNH: `robot-avatar.png` → Lottie khi rê chuột / khi AI trả lời. `LottieClient` vẽ một ô `visibility:hidden`
   *      ở lần vẽ đầu rồi `next/dynamic` trả `null` tới khi chunk lottie-web (~300 KB) về ⇒ con robot BIẾN MẤT một
   *      nhịp rồi hiện lại thành hình khác. Nay là SVG CuongMini nội tuyến — không có gì phải tải.
   *   2. Bật vào từ 0: `motion.div initial={{ scale: 0, opacity: 0 }}` + trễ 0,5 s chạy lại MỖI LẦN nút gắn lại
   *      (ẩn/hiện theo trang, máy cảm ứng chờ kho `bai`). Nay chỉ mờ dần MỘT lần mỗi lần tải trang (`daHienLanDau`).
   *   3. Máy cảm ứng: nút trên trang học chỉ hiện SAU khi `CourseTutor` gắn xong và ghi `bai` vào kho — tức là ẩn suốt
   *      lúc tải khoá rồi mới bật ra. Nay nhận trang học theo ĐƯỜNG DẪN (`laTrangHoc`), biết ngay từ lần vẽ đầu.
   */
  return (
    <>
      <div
        className={`ai-robot-fab fixed bottom-6 right-6 z-[100] ${lanDau && !reduceAnim ? 'cmr-fab-vao' : ''}`}
        onAnimationEnd={(e) => { if (e.target === e.currentTarget) setLanDau(false); }}
        style={{ ['--music-offset' as string]: musicActive ? '84px' : '0px' } as React.CSSProperties}
      >
        {/* Tooltip bubble */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              // pointer-events-none: the bubble is purely decorative — with
              // default pointer events it silently swallowed clicks meant
              // for UI underneath (e.g. the admin exp-hub modal's Tạo/Lưu
              // buttons, 2026-07-06).
              className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap"
            >
              <div className="relative bg-darkcard border border-neon-violet/30 rounded-2xl px-4 py-2.5 shadow-2xl shadow-neon-violet/10">
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-darkcard border-r border-b border-neon-violet/30 transform rotate-45" />
                <p className="text-sm text-text-secondary relative z-10">{tooltipMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="group/rb relative flex flex-col items-end">
          {/* Nút ẩn NGAY TẠI ĐÂY — hiện khi rê chuột (người dùng: "muốn tắt không được"). */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHienTroLy(false);
              toast.success('Đã ẩn trợ lý. Bật lại ở Cài đặt → Giao diện.', { duration: 5000 });
            }}
            aria-label="Ẩn trợ lý"
            title="Ẩn trợ lý"
            className="absolute -top-1 -right-1 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-darkcard text-text-secondary shadow-lg transition-colors hover:text-white group-hover/rb:flex focus:flex"
          >
            <X aria-hidden className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className="cmr-fab relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet"
            aria-label={laTrangHoc ? 'Mở CuongMini — gia sư bài học (phím A)' : 'Mở trợ lý CuongMini'}
            title={laTrangHoc ? 'Hỏi CuongMini về bài này (phím A)' : 'Trợ lý CuongMini'}
          >
            <span className="cmr-fab-nen" aria-hidden />
            <CuongMiniRobot mood={mood} size={66} hover={hover && !reduceAnim} chopMat={!reduceAnim} />
          </button>

          {/* Chấm "đang trả lời" — CSS thuần, không vòng lặp framer. */}
          {isStreaming && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-darkbg bg-red-500" aria-hidden>
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            </span>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && <ChatModal onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}

/** Nút nổi đã hiện ít nhất một lần trong lần tải trang này ⇒ những lần gắn lại sau không mờ dần nữa. */
let daHienLanDau = false;
