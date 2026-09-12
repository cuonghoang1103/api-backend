'use client';

/**
 * AcademyOnboarding — con robot bay xuống khi mở /academy.
 *
 * LUỒNG (4 màn, nhưng người dùng chỉ thấy tối đa 3 bước)
 *   1. 'ask'   — "Bạn có phải sinh viên FPT University không?"
 *                · Không  → lưu {isStudent:false} rồi đẩy sang /courses.
 *                · Đúng   → bước 2.
 *   2. 'major' — chọn 1 trong 8 ngành của FPTU (FPTU_MAJORS).
 *                Ngành CÓ combo (hôm nay chỉ SE) → bước 3.
 *                Ngành KHÔNG có combo → nhảy thẳng sang màn xong
 *                ("ngành nào không có ngành hẹp thì chuyển thẳng vào").
 *   3. 'combo' — 9 combo của SE, kèm môn cổng kỳ 5 và số môn Academy ĐANG CÓ
 *                thật. Luôn có lựa chọn "Chưa chọn / để sau" vì sinh viên năm
 *                nhất chưa chọn combo — ép chọn là bịa hộ họ.
 *   4. 'done'  — nhắc lại lựa chọn rồi đóng vào Academy.
 *
 * "LƯU GHI NHỚ LỰA CHỌN" (bật sẵn)
 *   · Tick   → gọi `save()` của useAcademyProfile: ghi localStorage, và nếu
 *              đã đăng nhập thì đồng bộ lên server (theo máy khác).
 *   · BỎ tick → KHÔNG gọi `save()` một lần nào. Lựa chọn chỉ nằm trong state
 *              của component và được trả về cho trang cha qua `onClose()`
 *              (hợp đồng props không nhận tham số, nên trang cha đọc lại
 *              `profile` như cũ — profile chưa đổi, tức là không có gì được
 *              ghi). Hệ quả TRUNG THỰC và đã nói thẳng trong UI: lần sau vào
 *              Academy robot sẽ hỏi lại. Đó đúng là điều người bỏ tick muốn.
 *
 * ĐÓNG MÀ KHÔNG TRẢ LỜI (Esc / bấm nền / nút ✕) KHÔNG lưu gì cả — chỉ
 * `onClose()` — để lần sau robot còn hỏi lại được.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check, GraduationCap, Hammer, Sparkles, X } from 'lucide-react';

import { FPTU_MAJORS, getCombo, getMajor, type FptuCombo, type FptuMajor } from '@/data/fptuCurriculum';
import { useAcademyProfile } from '@/hooks/useAcademyProfile';
import { cn } from '@/lib/utils';

type Step = 'ask' | 'major' | 'combo' | 'done';
type Mood = 'curious' | 'happy' | 'celebrate';

/* ------------------------------------------------------------------ robot */

/**
 * Robot vẽ tay bằng SVG nội tuyến — CỐ Ý không dùng con robot Lottie của
 * trợ lý chat (đó là danh tính của khung chat), và cố ý không thêm thư viện.
 * Ba biểu cảm: tò mò → vui khi người dùng chọn → ăn mừng lúc xong.
 */
function RobotMascot({ mood, reduced, compact }: { mood: Mood; reduced: boolean; compact?: boolean }) {
  const eyeGlow = mood === 'celebrate' ? '#facc15' : '#22d3ee';
  const waveArm = reduced ? {} : { animate: { rotate: [0, -22, 0, -14, 0] }, transition: { duration: 1.8, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' as const } };

  return (
    <svg
      viewBox="0 0 108 124"
      /* Từ bước 2 trở đi robot nhỏ lại: danh sách ngành/combo dài, giữ nguyên
         cỡ robot thì hộp thoại chạm trần màn hình và người dùng phải cuộn mới
         thấy nút "Quay lại". */
      className={cn(
        'drop-shadow-[0_8px_24px_rgba(139,92,246,0.45)] transition-all duration-300',
        compact ? 'w-16 h-[4.7rem] sm:w-[4.5rem] sm:h-[5.2rem]' : 'w-24 h-28 sm:w-28 sm:h-32',
      )}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="acoBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="acoVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>

      {/* bóng đổ */}
      <ellipse cx="54" cy="116" rx="24" ry="4.5" fill="#000" opacity="0.35" />

      {/* ăng-ten */}
      <line x1="54" y1="26" x2="54" y2="13" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
      <motion.circle
        cx="54" cy="9" r="5" fill={mood === 'celebrate' ? '#facc15' : '#22d3ee'}
        {...(reduced ? {} : { animate: { opacity: [1, 0.45, 1] }, transition: { duration: 1.4, repeat: Infinity } })}
      />

      {/* tay trái + tay phải vẫy */}
      <rect x="14" y="78" width="10" height="22" rx="5" fill="#6366f1" />
      <motion.g style={{ transformOrigin: '86px 92px' }} {...waveArm}>
        <rect x="84" y="70" width="10" height="24" rx="5" fill="#6366f1" transform="rotate(18 89 82)" />
        <circle cx="95" cy="68" r="5.5" fill="#a5b4fc" />
      </motion.g>

      {/* thân */}
      <rect x="30" y="74" width="48" height="32" rx="13" fill="url(#acoBody)" />
      <circle cx="54" cy="90" r="6" fill="#0f172a" opacity="0.55" />
      <circle cx="54" cy="90" r="3" fill={eyeGlow} />
      <rect x="38" y="104" width="12" height="8" rx="4" fill="#4f46e5" />
      <rect x="58" y="104" width="12" height="8" rx="4" fill="#4f46e5" />

      {/* đầu + kính che */}
      <rect x="22" y="26" width="64" height="46" rx="17" fill="url(#acoBody)" />
      <rect x="30" y="36" width="48" height="26" rx="13" fill="url(#acoVisor)" />
      <rect x="16" y="42" width="7" height="14" rx="3.5" fill="#6366f1" />
      <rect x="85" y="42" width="7" height="14" rx="3.5" fill="#6366f1" />

      {/* mắt theo biểu cảm */}
      {mood === 'curious' && (
        <>
          <circle cx="43" cy="48" r="5.5" fill={eyeGlow} />
          <circle cx="65" cy="48" r="5.5" fill={eyeGlow} />
          <circle cx="44.8" cy="46" r="1.9" fill="#fff" />
          <circle cx="66.8" cy="46" r="1.9" fill="#fff" />
          <path d="M49 57 q5 4 10 0" stroke="#a5b4fc" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'happy' && (
        <>
          <path d="M37 50 q6 -9 12 0" stroke={eyeGlow} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M59 50 q6 -9 12 0" stroke={eyeGlow} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M47 56 q7 6 14 0" stroke="#a5b4fc" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'celebrate' && (
        <>
          <path d="M43 41 l1.9 4.6 4.6 1.9 -4.6 1.9 -1.9 4.6 -1.9 -4.6 -4.6 -1.9 4.6 -1.9z" fill={eyeGlow} />
          <path d="M65 41 l1.9 4.6 4.6 1.9 -4.6 1.9 -1.9 4.6 -1.9 -4.6 -4.6 -1.9 4.6 -1.9z" fill={eyeGlow} />
          <ellipse cx="54" cy="57" rx="6" ry="4" fill="#a5b4fc" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------- component */

export interface AcademyOnboardingProps {
  open: boolean;
  onClose: () => void;
  /** 'ask' = bắt đầu từ câu "bạn có phải sinh viên FPTU?"; 'major' = vào
   *  thẳng màn chọn ngành (nút "Đổi ngành" dùng cái này, vì nó đã biết
   *  người đang xem là sinh viên). */
  initialStep?: 'ask' | 'major';
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default function AcademyOnboarding({ open, onClose, initialStep = 'ask' }: AcademyOnboardingProps): JSX.Element | null {
  const router = useRouter();
  const { save } = useAcademyProfile();
  const reduced = !!useReducedMotion();

  const [step, setStep] = useState<Step>(initialStep);
  const [majorId, setMajorId] = useState<string | null>(null);
  const [comboId, setComboId] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Mở lại là bắt đầu lại từ đầu — không giữ lựa chọn dở của lần trước.
  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setMajorId(null);
    setComboId(null);
    setRemember(true);
  }, [open, initialStep]);

  const major: FptuMajor | undefined = getMajor(majorId);
  const combo: FptuCombo | undefined = getCombo(majorId, comboId);
  const hasComboStep = (major?.combos.length ?? 0) > 0;

  const totalSteps = majorId ? (hasComboStep ? 3 : 2) : 3;
  const currentStep = step === 'ask' ? 1 : step === 'major' ? 2 : step === 'combo' ? 3 : totalSteps;

  const mood: Mood = step === 'done' ? 'celebrate' : step === 'combo' ? 'happy' : 'curious';

  /** Chỉ ghi khi hộp "lưu ghi nhớ" còn tick. Bỏ tick = không gọi save() lần nào. */
  const persist = useCallback(
    (next: { isStudent: boolean; major: string | null; combo: string | null }) => {
      if (remember) save(next);
    },
    [remember, save],
  );

  const handleNotStudent = useCallback(() => {
    persist({ isStudent: false, major: null, combo: null });
    onClose();
    router.push('/courses');
  }, [persist, onClose, router]);

  const handlePickMajor = useCallback(
    (m: FptuMajor) => {
      setMajorId(m.id);
      if (m.combos.length > 0) {
        setComboId(null);
        setStep('combo');
        return;
      }
      // Ngành không có ngành hẹp → vào thẳng.
      setComboId(null);
      persist({ isStudent: true, major: m.id, combo: null });
      setStep('done');
    },
    [persist],
  );

  const handlePickCombo = useCallback(
    (id: string | null) => {
      setComboId(id);
      persist({ isStudent: true, major: majorId, combo: id });
      setStep('done');
    },
    [persist, majorId],
  );

  /** Esc / nền / ✕ — đóng mà KHÔNG lưu gì. */
  const dismiss = useCallback(() => onClose(), [onClose]);

  // Esc để đóng + bẫy Tab trong hộp thoại.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        dismiss();
        return;
      }
      if (e.key !== 'Tab') return;
      const node = panelRef.current;
      if (!node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, dismiss]);

  // Khoá cuộn nền + trả tiêu điểm về chỗ cũ khi đóng.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // Mỗi bước: đưa tiêu điểm vào trong hộp thoại.
  useEffect(() => {
    if (!open) return;
    const node = panelRef.current;
    if (!node) return;
    const t = window.setTimeout(() => {
      const target = node.querySelector<HTMLElement>('[data-autofocus="true"]') ?? node.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    }, 20);
    return () => window.clearTimeout(t);
  }, [open, step]);

  const headings: Record<Step, string> = useMemo(
    () => ({
      ask: 'Bạn có phải sinh viên FPT University không?',
      major: 'Bạn học ngành nào?',
      combo: 'Chọn ngành hẹp (combo)',
      done: 'Xong rồi!',
    }),
    [],
  );

  if (!open) return null;

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.18 } }
    : {
        initial: { opacity: 0, y: -48, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.97 },
        transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
      };

  const robotMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.25 } }
    : {
        initial: { y: -180, opacity: 0, rotate: -12 },
        animate: { y: 0, opacity: 1, rotate: 0 },
        transition: { type: 'spring' as const, stiffness: 180, damping: 14, delay: 0.05 },
      };

  return (
    <div className="fixed inset-0 z-[120]">
      {/* Nền — bấm vào để đóng (không lưu gì) */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.25 }}
        onClick={dismiss}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="aco-title"
          className="relative w-full max-w-2xl my-auto max-h-[92dvh] flex flex-col bg-darkcard border border-darkborder rounded-3xl shadow-2xl shadow-neon-violet/10 overflow-hidden"
          {...panelMotion}
        >
          {/* viền sáng trên đầu */}
          <div className="h-1 w-full shrink-0 bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-cyan" />

          <button
            type="button"
            onClick={dismiss}
            aria-label="Đóng, hỏi lại lần sau"
            className="absolute top-3 right-3 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full bg-darkcard/85 backdrop-blur-sm text-text-muted hover:text-text-primary hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-4 sm:px-8 pt-5 pb-6 flex-1 min-h-0 overflow-y-auto">
            {/* Robot + tiêu đề */}
            <div className="flex flex-col items-center text-center">
              <motion.div {...robotMotion}>
                <RobotMascot mood={mood} reduced={reduced} compact={step === 'major' || step === 'combo'} />
              </motion.div>

              {/* Chỉ báo bước */}
              <div
                className="mt-3 flex items-center gap-2"
                role="status"
                aria-label={`Bước ${currentStep} trên ${totalSteps}`}
              >
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i + 1 < currentStep ? 'w-6 bg-neon-cyan' : i + 1 === currentStep ? 'w-8 bg-neon-violet' : 'w-6 bg-darkborder',
                    )}
                  />
                ))}
                <span className="ml-1 text-xs text-text-muted tabular-nums">
                  {currentStep}/{totalSteps}
                </span>
              </div>

              <h2 id="aco-title" className="mt-3 text-xl sm:text-2xl font-bold text-text-primary">
                {headings[step]}
              </h2>
            </div>

            {/* Nội dung từng bước.
                KHÔNG dùng <AnimatePresence mode="wait"> ở đây: nó chỉ mount bước
                mới SAU KHI bước cũ chạy xong hoạt ảnh exit, nên nếu tab bị ẩn
                hoặc trình duyệt bóp requestAnimationFrame thì exit không bao giờ
                kết thúc — tiêu đề đã nhảy sang "2/3" mà thân vẫn là bước 1, kẹt
                vĩnh viễn. Đổi key là đủ: React tháo bước cũ và gắn bước mới ngay,
                hoạt ảnh chỉ còn ở chiều vào nên hỏng hoạt ảnh cũng không kẹt UI. */}
            <div>
              <motion.div
                key={step}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: 16 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-5"
              >
                {step === 'ask' && (
                  <div className="space-y-3">
                    <p className="text-sm text-text-secondary text-center">
                      Trả lời để Academy xếp đúng môn của bạn lên trước. Không phải sinh viên FPTU thì mình đưa bạn sang
                      khu khoá học tự do.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        data-autofocus="true"
                        onClick={() => setStep('major')}
                        className="min-h-[56px] rounded-2xl px-4 py-3 font-semibold text-white bg-gradient-to-r from-neon-indigo to-neon-violet hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-darkcard transition"
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          <GraduationCap className="w-5 h-5 shrink-0" />
                          Đúng, mình là sinh viên FPTU
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNotStudent}
                        className="min-h-[56px] rounded-2xl px-4 py-3 font-semibold text-text-primary bg-darksurface border border-darkborder hover:border-neon-cyan/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-darkcard transition"
                      >
                        Không, mình học tự do
                      </button>
                    </div>
                  </div>
                )}

                {step === 'major' && (
                  <div>
                    <p className="text-sm text-text-secondary text-center">
                      FPTU có 8 ngành trong khối Công nghệ thông tin. Chọn ngành của bạn:
                    </p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {FPTU_MAJORS.map((m, i) => (
                        <button
                          key={m.id}
                          type="button"
                          data-autofocus={i === 0 ? 'true' : undefined}
                          onClick={() => handlePickMajor(m)}
                          className="min-h-[64px] text-left rounded-2xl p-3 bg-darksurface border border-darkborder hover:border-neon-violet/60 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan transition flex gap-3 items-start"
                        >
                          <span aria-hidden="true" className="text-2xl leading-none mt-0.5">{m.icon}</span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-text-primary">{m.nameVi}</span>
                            <span className="block text-xs text-text-muted">{m.name}</span>
                            <span className={cn('block mt-1 text-[11px]', m.combos.length > 0 ? 'text-neon-cyan' : 'text-text-muted')}>
                              {m.combos.length > 0
                                ? `${m.combos.length} combo · đủ lộ trình 9 kỳ`
                                : 'Đủ lộ trình 9 kỳ · trường chưa công bố combo'}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setStep('ask')}
                        className="min-h-[44px] inline-flex items-center gap-2 px-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan transition"
                      >
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                      </button>
                    </div>
                  </div>
                )}

                {step === 'combo' && major && (
                  <div>
                    <p className="text-sm text-text-secondary text-center">
                      Ngành <span className="text-text-primary font-semibold">{major.nameVi}</span> có{' '}
                      {major.combos.length} combo theo khung {major.curriculumCode}. Chưa chọn cũng không sao.
                    </p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {major.combos.map((c, i) => (
                        <button
                          key={c.id}
                          type="button"
                          data-autofocus={i === 0 ? 'true' : undefined}
                          onClick={() => handlePickCombo(c.id)}
                          className="min-h-[76px] text-left rounded-2xl p-3 bg-darksurface border border-darkborder hover:border-neon-violet/60 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan transition flex gap-3 items-start"
                        >
                          <span aria-hidden="true" className="text-2xl leading-none mt-0.5">{c.icon}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-text-primary">{c.nameVi}</span>
                            <span className="block text-[11px] text-text-secondary mt-1 space-y-0.5">
                              {Object.keys(c.bySemester)
                                .map(Number)
                                .sort((x, y) => x - y)
                                .map((sem) => (
                                  <span key={sem} className="block">
                                    <span className="text-text-muted">Kỳ {sem}:</span>{' '}
                                    <span className="font-mono text-neon-cyan">{c.bySemester[sem].join(', ')}</span>
                                  </span>
                                ))}
                            </span>
                            {c.note && <span className="block text-[11px] text-text-muted mt-0.5">{c.note}</span>}
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] border',
                                c.academyCourses.length > 0
                                  ? 'bg-neon-green/10 text-neon-green border-neon-green/30'
                                  : 'bg-white/5 text-text-muted border-darkborder',
                              )}
                            >
                              {c.academyCourses.length > 0 ? (
                                <>
                                  <Check className="w-3 h-3" /> Đã có {c.academyCourses.length} môn trong Academy
                                </>
                              ) : (
                                <>
                                  <Hammer className="w-3 h-3" /> Đang xây dựng
                                </>
                              )}
                            </span>
                          </span>
                        </button>
                      ))}

                      {/* Sinh viên năm nhất chưa chọn combo — ép chọn là bịa hộ họ. */}
                      <button
                        type="button"
                        onClick={() => handlePickCombo(null)}
                        className="min-h-[76px] text-left rounded-2xl p-3 bg-transparent border border-dashed border-darkborder hover:border-neon-cyan/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan transition flex gap-3 items-start"
                      >
                        <span aria-hidden="true" className="text-2xl leading-none mt-0.5">🕓</span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-text-primary">Chưa chọn / để sau</span>
                          <span className="block text-[11px] text-text-muted mt-0.5">
                            Chưa tới kỳ 5 thì chọn cái này. Bạn vẫn thấy đủ môn chung, đổi lại lúc nào cũng được.
                          </span>
                        </span>
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => setStep('major')}
                        className="min-h-[44px] inline-flex items-center gap-2 px-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan transition"
                      >
                        <ArrowLeft className="w-4 h-4" /> Chọn ngành khác
                      </button>
                    </div>
                  </div>
                )}

                {step === 'done' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-neon-violet/30 bg-neon-violet/10 p-4 text-center">
                      <p className="text-sm text-text-secondary">
                        <Sparkles className="w-4 h-4 inline-block mr-1 text-neon-violet" aria-hidden="true" />
                        Mình sẽ xếp môn của{' '}
                        <span className="font-semibold text-text-primary">{major?.nameVi ?? 'ngành bạn chọn'}</span>
                        {combo ? (
                          <>
                            {' '}— combo <span className="font-semibold text-text-primary">{combo.nameVi}</span>
                          </>
                        ) : major && major.combos.length > 0 ? (
                          <> — chưa chọn combo</>
                        ) : null}{' '}
                        lên đầu Academy.
                      </p>
                      <p className="mt-2 text-xs text-text-muted">
                        Muốn đổi thì vào mục “Đổi ngành” ngay trong Academy, bất cứ lúc nào.
                      </p>
                    </div>
                    <button
                      type="button"
                      data-autofocus="true"
                      onClick={onClose}
                      className="w-full min-h-[52px] rounded-2xl px-4 font-semibold text-white bg-gradient-to-r from-neon-indigo to-neon-violet hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-darkcard transition"
                    >
                      Vào Academy
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Lưu ghi nhớ — ẩn ở màn cuối vì lúc đó đã ghi (hoặc cố ý không ghi) xong */}
            {step !== 'done' && (
              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-darkborder bg-darkbg/40 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mt-0.5 w-5 h-5 shrink-0 accent-[#8b5cf6] rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                />
                <span className="text-xs text-text-secondary leading-relaxed">
                  <span className="block font-semibold text-text-primary text-sm">Lưu ghi nhớ lựa chọn</span>
                  {remember ? (
                    <>
                      Đang đăng nhập thì lựa chọn theo bạn sang máy khác; chưa đăng nhập thì chỉ nằm trong trình duyệt
                      này.
                    </>
                  ) : (
                    <>
                      Không lưu: lựa chọn chỉ áp dụng cho lần vào này, lần sau mình sẽ hỏi lại.
                    </>
                  )}
                </span>
              </label>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
