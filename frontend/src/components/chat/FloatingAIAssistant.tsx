'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import LottieClient from '@/components/ui/LottieClient';
import type { LottieRefCurrentProps } from 'lottie-react';
import { useChatStore } from '@/store/chatStore';
import { useMusicStore } from '@/store/musicStore';
import { useReduceAnimations } from '@/hooks/useIsTouch';
import { useTranslation } from '@/hooks/useTranslation';
import { getLandingCopy } from '@/components/home/landing/landingCopy';
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
 const isLanding = pathname === '/';
 const { locale } = useTranslation();
 const landingCopy = getLandingCopy(locale);
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
  // "Người dùng đã tỏ ý quan tâm tới con robot chưa?" — cờ mở cửa cho 360KB
  // Lottie. Bật bởi: rê chuột vào, focus bàn phím, bấm mở chat, hoặc AI bắt
  // đầu trả lời. Xem khối useEffect nạp hoạt hình để biết vì sao.
  const [wantsAnim, setWantsAnim] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const robotState: RobotState = isStreaming
    ? 'thinking'
    : robotEmotion === 'typing'
    ? 'typing'
    : 'idle';

  // ─── Nạp hoạt hình robot: CHỈ KHI NGƯỜI DÙNG CHẠM TỚI NÓ ──────────────────
  //
  // Con robot là TRANG TRÍ, nhưng nó gắn trong layout gốc, nên trước
  // 23/08/2026 nó kéo nguyên chuỗi này ngay khi mount, trên MỌI trang:
  //
  //   fetch('/animations/robot.json')  → 60KB
  //   → setRobotData → LottieClient render → import('lottie-react')
  //   → chunk lottie-web              → 300KB   (đo thật: dc112a36….js)
  //
  // Bước đầu (cùng ngày) là hoãn tới `requestIdleCallback`. Đo lại bằng
  // Chromium thật cho thấy hoãn KHÔNG ĐỦ: máy để không thì trình duyệt rảnh
  // gần như tức thì, chunk vẫn về ở mốc +740ms. Ra khỏi đường găng, nhưng
  // 360KB vẫn đi — mà đại đa số khách chẳng bao giờ đụng vào con robot.
  //
  // Nay nó đợi một TÍN HIỆU QUAN TÂM. Bốn cửa mở, phủ hết các lối vào thật:
  //
  //   · rê chuột vào nút   → `onMouseEnter`
  //   · đi bằng bàn phím   → `onFocus`   (không có cái này thì người dùng
  //                          bàn phím vĩnh viễn thấy ảnh tĩnh)
  //   · bấm mở chat        → `handleOpen`
  //   · AI bắt đầu trả lời → `robotState !== 'idle'` ở effect ngay dưới; lúc
  //                          này con robot đang DIỄN ĐẠT trạng thái (nghĩ /
  //                          gõ), nên hoạt hình mới có nghĩa
  //
  // Rê chuột tới lúc bấm thường cách nhau vài trăm ms, đủ để chunk về kịp —
  // và trong lúc chờ thì `/robot-avatar.png` (16KB) vẫn đang hiển thị, nên
  // không có khoảng trống nào.
  //
  // Hai cửa chặn TUYỆT ĐỐI, đặt trước cả `wantsAnim`:
  //
  // 1. `hidden` → trên /admin, /creator, và trên điện thoại ở mọi trang không
  //    phải '/', con robot còn không được vẽ. Tải hoạt hình cho một thứ
  //    `return null` là lãng phí thuần tuý.
  //
  // 2. `reduceAnim` → máy cảm ứng và người bật prefers-reduced-motion vốn đã
  //    không được xem hoạt hình lặp (xem các `animate={reduceAnim ? undefined
  //    : …}` ở dưới). Với họ Lottie chỉ vẽ ra một khung hình đứng yên — đúng
  //    bằng thứ ảnh PNG đang làm. Đây là nhóm hưởng lợi nhiều nhất: máy yếu,
  //    mạng chậm, và trên cảm ứng thì "rê chuột" cũng không tồn tại.
  //
  // ⚠️ ĐỪNG gỡ mấy điều kiện này rồi để lại mỗi cái fetch. Chuỗi
  // `robotData → LottieClient → import()` mới là chỗ tốn 300KB; fetch 60KB
  // chỉ là ngòi nổ.
  useEffect(() => {
    if (hidden || isLanding || reduceAnim || robotData || !wantsAnim) return;

    let alive = true;
    fetch('/animations/robot.json')
      .then((res) => res.json())
      .then((data) => {
        if (alive) setRobotData(data);
      })
      // Im lặng: robot là trang trí, hỏng nó không đáng bẩn console của người
      // dùng. Không có robotData thì ảnh PNG ở dưới vẫn hiển thị và nút vẫn
      // bấm được — mất hoạt hình, không mất chức năng.
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [hidden, isLanding, reduceAnim, robotData, wantsAnim]);

  // AI đang nghĩ / đang gõ ⇒ mở cửa cho hoạt hình dù người dùng chưa rê chuột.
  // Đây là lúc DUY NHẤT con robot mang thông tin chứ không chỉ trang trí:
  // `robotState` điều khiển pause/tốc độ ở effect ngay dưới, và một ảnh tĩnh
  // thì không nói được "đang xử lý".
  useEffect(() => {
    if (robotState !== 'idle') setWantsAnim(true);
  }, [robotState]);

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
    if (hidden || isLanding || isOpen) {
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
  }, [hidden, isLanding, isOpen, scheduleTooltip]);

  const handleMouseEnter = () => {
    // Tín hiệu quan tâm đầu tiên và phổ biến nhất — bắt đầu kéo Lottie về.
    setWantsAnim(true);
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
    // Bấm thẳng mà không rê (bàn phím, hoặc chuột đi rất nhanh) vẫn phải mở
    // cửa cho hoạt hình.
    setWantsAnim(true);
    setIsOpen(true);
    setShowTooltip(false);
  };

  // Note: the messaging widget sits above the AI robot (bottom-24 vs
  // bottom-6), so they don't overlap and the AI robot stays put.

  const handleClose = () => {
    setIsOpen(false);
    if (!isLanding) scheduleTooltip();
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
            // Người đi bằng Tab không bao giờ bắn `mouseenter`. Thiếu dòng này
            // thì họ vĩnh viễn chỉ thấy ảnh tĩnh.
            onFocus={() => setWantsAnim(true)}
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

            {/* Ảnh tĩnh là TRẠNG THÁI MẶC ĐỊNH, không phải khung chờ.
                `robot-avatar.png` (16KB, có sẵn trong `public/`) là thứ khách
                thấy cho tới khi họ rê chuột / focus / mở chat — xem effect nạp
                hoạt hình ở trên. Với `reduceAnim` (cảm ứng, hoặc đã xin bớt
                chuyển động) thì đây là bản CUỐI CÙNG: không hoạt hình, và cũng
                không tải 360KB về. */}
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
