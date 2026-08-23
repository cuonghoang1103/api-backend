'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LottieClient from '@/components/ui/LottieClient';
import type { LottieRefCurrentProps } from 'lottie-react';
import { useChatStore } from '@/store/chatStore';
import { useMusicStore } from '@/store/musicStore';
import { useReduceAnimations } from '@/hooks/useIsTouch';
import ChatModal from './ChatModal';

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
 // On MOBILE, show the AI bubble only on the home feed ('/') — on every other
 // page it covered content/action buttons (user request 2026-07-09). Desktop
 // is unaffected. Uses matchMedia (a plain call, not a hook) so the value is
 // available synchronously during render.
 const hiddenOnMobile =
   pathname !== '/' &&
   typeof window !== 'undefined' &&
   window.matchMedia?.('(pointer: coarse)')?.matches;
 // Whether to hide the bubble on this route. We must NOT `return null` here:
 // this component is mounted in the root layout and persists across
 // client-side navigation, so an early return BEFORE the hooks below would
 // change the hook count between renders (e.g. '/' → '/admin') and throw
 // React error #310 "rendered fewer hooks than expected". Compute the flag
 // now, call every hook unconditionally, then bail out just before the JSX.
 const hidden = Boolean(
   pathname?.startsWith('/creator') || pathname?.startsWith('/admin') || hiddenOnMobile,
 );

 const { isStreaming, robotEmotion } = useChatStore();
 // When a track is loaded the mobile music bar sits above the bottom nav;
 // lift the robot above the bar too so it never overlaps it (mobile only —
 // see `.ai-robot-fab` in globals.css). 84px ≈ the mini-bar's height.
 const musicActive = useMusicStore((s) => !!s.currentTrack);
 // On touch / reduced-motion devices, render the idle bubble WITHOUT the
 // always-looping framer animations (this component is mounted on every page,
 // so those infinite loops run globally). Desktop/fine-pointer is unaffected.
 const reduceAnim = useReduceAnimations();
 const lottieRef = useRef<LottieRefCurrentProps>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [robotData, setRobotData] = useState<object | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const robotState: RobotState = isStreaming
    ? 'thinking'
    : robotEmotion === 'typing'
    ? 'typing'
    : 'idle';

  // ─── Nạp hoạt hình robot: MUỘN, và chỉ khi thật sự cần ────────────────────
  //
  // Con robot này là TRANG TRÍ. Nhưng nó được gắn trong layout gốc, nên trước
  // 23/08/2026 nó kéo theo chuỗi sau ngay khi component mount, trên MỌI trang:
  //
  //   fetch('/animations/robot.json')  → 60KB
  //   → setRobotData → LottieClient render → import('lottie-react')
  //   → chunk lottie-web              → 300KB   (đo thật: dc112a36….js)
  //
  //  360KB tranh băng thông với chính nội dung trang, ngay lúc trang đang cố
  //  vẽ màn hình đầu tiên.
  //
  // Ba lớp hoãn, theo thứ tự đắt dần:
  //
  // 1. `hidden` → KHÔNG tải gì cả. Trên /admin, /creator, và trên điện thoại ở
  //    mọi trang không phải '/', con robot còn không được vẽ ra. Tải hoạt hình
  //    cho một thứ `return null` là lãng phí thuần tuý.
  //
  // 2. `reduceAnim` → KHÔNG tải gì cả. Máy cảm ứng và người bật
  //    prefers-reduced-motion vốn đã không được xem hoạt hình lặp (xem các
  //    `animate={reduceAnim ? undefined : …}` ở dưới). Với họ Lottie chỉ vẽ ra
  //    một khung hình đứng yên — đúng bằng thứ mà `/robot-avatar.png` (16KB)
  //    làm được. Đây là nhóm hưởng lợi nhiều nhất: máy yếu, mạng chậm.
  //
  // 3. Còn lại → tải khi trình duyệt RẢNH (`requestIdleCallback`). Vẫn là con
  //    robot động y như cũ, chỉ khác là nó xếp hàng SAU nội dung trang chứ
  //    không giành chỗ. `timeout: 4000` là chốt chặn: trang bận liên tục thì
  //    sau 4 giây cứ nạp, đừng để robot không bao giờ động.
  //
  // ⚠️ ĐỪNG gỡ điều kiện `hidden`/`reduceAnim` rồi để lại mỗi fetch. Chuỗi
  // `robotData → LottieClient → import()` mới là chỗ tốn 300KB; cái fetch 60KB
  // chỉ là ngòi nổ.
  useEffect(() => {
    if (hidden || reduceAnim || robotData) return;

    let alive = true;
    const load = () => {
      fetch('/animations/robot.json')
        .then((res) => res.json())
        .then((data) => {
          if (alive) setRobotData(data);
        })
        // Im lặng: robot là trang trí, hỏng nó không đáng bẩn console của
        // người dùng. Không có robotData thì LottieClient vẽ ô trong suốt và
        // nút vẫn bấm được — xem lớp dự phòng <img> ở dưới.
        .catch(() => {});
    };

    // `typeof … === 'function'` chứ không phải `if (window.requestIdleCallback)`:
    // lib.dom khai nó là LUÔN có, nên dạng kiểm tra tính đúng-sai bị tsc chặn
    // bằng TS2774. Guard vẫn cần thật — Safari mới hỗ trợ requestIdleCallback
    // từ 16.4, và ở đó nhánh setTimeout là thứ giữ cho robot vẫn động.
    const supportsIdle = typeof window.requestIdleCallback === 'function';
    const handle: number = supportsIdle
      ? window.requestIdleCallback(load, { timeout: 4000 })
      : window.setTimeout(load, 1500);

    return () => {
      alive = false;
      if (supportsIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [hidden, reduceAnim, robotData]);

  // Control Lottie playback based on state
  useEffect(() => {
    const lottie = lottieRef.current;
    if (!lottie || !robotData) return;

    if (robotState === 'thinking') {
      lottie.pause();
    } else if (robotState === 'typing') {
      lottie.setSpeed(1.5);
      lottie.play();
    } else {
      lottie.setSpeed(1);
      lottie.play();
    }
  }, [robotState, robotData]);

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
    if (hidden || isOpen) {
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
  }, [hidden, isOpen, scheduleTooltip]);

  const handleMouseEnter = () => {
    if (!isOpen) {
      setShowTooltip(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) scheduleTooltip();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  // Note: the messaging widget sits above the AI robot (bottom-24 vs
  // bottom-6), so they don't overlap and the AI robot stays put.

  const handleClose = () => {
    setIsOpen(false);
    scheduleTooltip();
  };

  // Route-based hide happens HERE — after every hook has run — so the hook
  // order stays identical whether or not the bubble is shown (see `hidden`).
  if (hidden) return null;

  return (
    <>
      {/* Floating Robot */}
      <motion.div
        className="ai-robot-fab fixed bottom-6 right-6 z-[100]"
        style={{ ['--music-offset' as string]: musicActive ? '84px' : '0px' } as React.CSSProperties}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
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

        {/* Robot container */}
        <div className="relative flex flex-col items-end">
          {/* Thinking bubble */}
          <AnimatePresence>
            {robotState === 'thinking' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 8 }}
                className="absolute -top-14 right-0 mb-2"
              >
                <div className="bg-darkcard border border-neon-violet/30 rounded-2xl px-3 py-2 shadow-xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-neon-violet"
                        animate={reduceAnim ? undefined : { y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
                        transition={reduceAnim ? undefined : { duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lottie Robot Button */}
          <motion.button
            onClick={handleOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            animate={
              reduceAnim
                ? undefined
                : robotState === 'thinking'
                ? { rotate: [-3, 3, -3], transition: { duration: 0.5, repeat: Infinity } }
                : { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
            }
            className="relative w-20 h-20 cursor-pointer focus:outline-none"
            style={{ filter: 'drop-shadow(0 8px 32px rgba(139, 92, 246, 0.4))' }}
            aria-label="Open Ai CuongMini"
          >
            {/* Glow ring */}
            <motion.div
              animate={reduceAnim ? undefined : { scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
              transition={reduceAnim ? undefined : { duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-indigo via-neon-violet to-neon-fuchsia"
            />

            {/* Robot: ảnh tĩnh trước, hoạt hình sau (hoặc không bao giờ).
                `robot-avatar.png` nặng 16KB và nằm sẵn trong `public/`, nên
                nút có mặt mũi NGAY khung hình đầu — không còn khoảng trống
                trong suốt trong lúc chờ 360KB Lottie như trước.
                Với `reduceAnim` thì ảnh này là bản cuối cùng, đúng chủ ý:
                người đã xin bớt chuyển động thì không nhận hoạt hình lặp vô
                hạn, và cũng không phải tải nó về. */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              {robotData ? (
                <LottieClient
                  lottieRef={lottieRef}
                  animationData={robotData}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/robot-avatar.png"
                  alt=""
                  aria-hidden
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </motion.button>

          {/* Streaming dot */}
          {isStreaming && (
            <motion.div
              animate={reduceAnim ? undefined : { scale: [1, 1.3, 1] }}
              transition={reduceAnim ? undefined : { duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-darkbg flex items-center justify-center"
            >
              <motion.div
                animate={reduceAnim ? undefined : { opacity: [0.4, 1] }}
                transition={reduceAnim ? undefined : { duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && <ChatModal onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}
