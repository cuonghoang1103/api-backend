'use client';
/**
 * My Language — the mascot itself: one PNG, animated by mood.
 *
 * The art is flat 2D (Level 1 — no rigging), so all the life comes from
 * transforms on the whole image: a breathing idle, a bouncy cheer, a droop when
 * sad. Transform-only animation stays on the compositor and never reflows the
 * page around it.
 *
 * The cast, the dialogue and the casting rules live in lib/mascotData.ts. Sound
 * lives HERE because it is a browser side-effect, not data: a tiny WebAudio
 * synth, since the CSP blocks external hosts and shipping audio files for a
 * chirp is not worth the bytes.
 *
 * NOTE the filename is lowercase `mascot.tsx`, not `Mascot.tsx`: macOS is
 * case-insensitive but the Linux Docker build is not, so a rename that looks
 * like a no-op locally breaks the image.
 */
import { motion, useReducedMotion, AnimatePresence, type TargetAndTransition } from 'framer-motion';
import { getMascotImage, mascotName, type Emotion, type MascotId } from '@/lib/mascotData';

export type { Emotion, MascotId };
export { mascotName };

// ─── Cute synth voice ────────────────────────────────────────────
let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function mascotMuted(): boolean {
  return typeof window !== 'undefined' && window.localStorage.getItem('langMascotMute') === '1';
}
export function setMascotMuted(m: boolean): void {
  window.localStorage.setItem('langMascotMute', m ? '1' : '0');
}

/** One soft chirp: quick attack, exponential decay — reads as "cute", not "alarm". */
function note(ac: AudioContext, freq: number, at: number, dur: number, type: OscillatorType, gain: number): void {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + at);
  g.gain.setValueAtTime(0, ac.currentTime + at);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + at + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

/** Sounds only ever play right after a user gesture, which is also what iOS
 *  requires before it lets a page make noise. */
export function playMascotSound(kind: 'praise' | 'cheer' | 'sad' | 'wow' | 'hello'): void {
  if (mascotMuted()) return;
  const ac = audio();
  if (!ac) return;
  // Pitch contour carries the emotion the way it does in Animal Crossing babble.
  if (kind === 'praise') {
    note(ac, 988, 0, 0.12, 'triangle', 0.12);
    note(ac, 1319, 0.1, 0.16, 'triangle', 0.12);
  } else if (kind === 'cheer') {
    note(ac, 784, 0, 0.1, 'triangle', 0.12);
    note(ac, 988, 0.09, 0.1, 'triangle', 0.12);
    note(ac, 1175, 0.18, 0.1, 'triangle', 0.12);
    note(ac, 1568, 0.27, 0.22, 'triangle', 0.13);
  } else if (kind === 'sad') {
    note(ac, 523, 0, 0.18, 'sine', 0.1);
    note(ac, 392, 0.16, 0.3, 'sine', 0.09);
  } else if (kind === 'wow') {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, ac.currentTime + 0.28);
    g.gain.setValueAtTime(0.11, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
    osc.connect(g).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.45);
  } else {
    note(ac, 880, 0, 0.1, 'triangle', 0.09);
    note(ac, 1047, 0.09, 0.12, 'triangle', 0.09);
  }
}

// ─── Free-text praise (separate from mascotData's per-mascot lines) ──
const PRAISES = [
  'Tuyệt vời! 🎉', 'Giỏi quá đi!', 'Chuẩn không cần chỉnh!', 'Đỉnh thật đấy!',
  'Yeahhh, đúng rồi!', 'Xuất sắc luôn!', 'Bạn học nhanh ghê!', 'Quá là siêu!',
];
const COMFORTS = [
  'Không sao, thử lại nhé!', 'Suýt đúng rồi, tiếc ghê!', 'Sai một lần, nhớ mười lần!',
  'Câu này khó mà — cố lên!', 'Đừng buồn, mình học tiếp nha!', 'Hít thở sâu… làm lại nào! 💪',
];
const COMBOS = ['Chuỗi %d câu đúng! 🔥', 'Combo x%d! Không cản nổi!', '%d câu liên tiếp — quá đỉnh! ⚡'];

export function praisePhrase(streak: number): string {
  if (streak >= 3) return COMBOS[streak % COMBOS.length].replace('%d', String(streak));
  return PRAISES[Math.floor(Math.random() * PRAISES.length)];
}
export function comfortPhrase(): string {
  return COMFORTS[Math.floor(Math.random() * COMFORTS.length)];
}

// ─── Motion ──────────────────────────────────────────────────────
const MOTION: Record<Emotion, TargetAndTransition> = {
  // Breathing. Never settles, so a page with a mascot on it never looks frozen.
  happy: {
    y: [0, -4, 0],
    scale: [1, 1.03, 1],
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
  // Bounces a few times then holds — an endless jump is exhausting to sit next to.
  cheer: {
    y: [0, -14, 0, -9, 0],
    rotate: [0, -4, 4, -2, 0],
    transition: { duration: 0.9, repeat: 2, ease: 'easeOut' },
  },
  think: {
    y: [0, -3, 0],
    rotate: [0, -2, 0, 2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  // Heavier easing and a tilt: it reads as deflating, not bouncing down.
  sad: {
    y: [0, 4],
    rotate: [0, -5],
    transition: { duration: 0.8, ease: 'easeIn' },
  },
  wow: {
    scale: [1, 1.16, 0.98, 1.06, 1],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function Mascot({
  character,
  emotion = 'happy',
  size = 160,
  className = '',
}: {
  character: MascotId;
  emotion?: Emotion;
  size?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <motion.img
        // Remount on a new emotion so a one-shot (cheer, wow) replays instead of
        // being skipped because framer sees the same element mid-animation.
        key={`${character}-${emotion}`}
        src={getMascotImage(character, emotion)}
        alt=""
        aria-hidden
        draggable={false}
        width={size}
        height={size}
        animate={reduce ? undefined : MOTION[emotion]}
        // width/height are set above so the box is reserved before the PNG
        // loads — an animated transform on an unsized img shifts the layout.
        className="h-full w-full select-none object-contain"
        style={{ transformOrigin: 'center bottom' }}
      />

      {/* Sparkles on a big cheer. Deliberately NO "Zzz" overlay for grumpy:
          grumpy.png already has them drawn in, and a second set would double up. */}
      <AnimatePresence>
        {emotion === 'cheer' && !reduce &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 text-sm"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: Math.cos((i / 5) * Math.PI * 2) * size * 0.55,
                y: Math.sin((i / 5) * Math.PI * 2) * size * 0.5 - 8,
                opacity: 0,
                scale: 1.15,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {['✨', '⭐', '🎉', '💫', '⚡'][i]}
            </motion.span>
          ))}
      </AnimatePresence>
    </div>
  );
}
