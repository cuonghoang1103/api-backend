'use client';
/**
 * My Language — mascot coaches (Duolingo-style).
 *
 * Three cute characters take turns cheering the learner on: Mochi the violet
 * cat, Bíp the orange chick and Susu the cyan octopus. Every one is pure inline
 * SVG + framer-motion — no image assets — and the "voice" is a tiny WebAudio
 * synth (no audio files; the CSP blocks external hosts anyway).
 *
 * Moods: idle (bobbing, blinking) · happy (smile + hop) · cheer (arms up, big
 * jump, sparkles) · sad (droop + tear) · wow (bounce + o-mouth).
 *
 * Sounds only ever play right after a user gesture (answering, opening a
 * lesson), which is also what iOS requires before it lets a page make noise.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'cheer' | 'sad' | 'wow';
export type MascotId = 0 | 1 | 2;

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

export function playMascotSound(kind: 'praise' | 'cheer' | 'sad' | 'wow' | 'hello'): void {
  if (mascotMuted()) return;
  const ac = audio();
  if (!ac) return;
  // Each mascot "speaks" in short triangle-wave chirps; pitch contour carries
  // the emotion the way it does in Animal Crossing-style babble.
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

// ─── Phrase banks ────────────────────────────────────────────────
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

/** Deterministic pick so the same lesson keeps the same coach, but day to day
 *  (and lesson to lesson) the three of them take turns. */
export function pickMascot(seed?: string): MascotId {
  if (!seed) {
    const day = Math.floor(Date.now() / 86_400_000);
    return (day % 3) as MascotId;
  }
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return (Math.abs(h) % 3) as MascotId;
}

// ─── Shared face parts (mood-driven) ─────────────────────────────
function Eyes({ mood, y = 34 }: { mood: MascotMood; y?: number }) {
  if (mood === 'happy' || mood === 'cheer') {
    // ^ ^ arcs
    return (
      <g stroke="#1a1330" strokeWidth={3} strokeLinecap="round" fill="none">
        <path d={`M24 ${y + 2} q5 -7 10 0`} />
        <path d={`M46 ${y + 2} q5 -7 10 0`} />
      </g>
    );
  }
  if (mood === 'sad') {
    return (
      <g>
        <g stroke="#1a1330" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d={`M24 ${y} q5 5 10 1`} />
          <path d={`M46 ${y + 1} q5 4 10 -1`} />
        </g>
        {/* tear */}
        <motion.path
          d={`M56 ${y + 5} q3 6 0 8 q-3 -2 0 -8`}
          fill="#7dd3fc"
          animate={{ y: [0, 6], opacity: [1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeIn' }}
        />
      </g>
    );
  }
  const r = mood === 'wow' ? 5.5 : 4.5;
  return (
    <motion.g animate={mood === 'idle' ? { scaleY: [1, 1, 0.1, 1] } : undefined} transition={{ duration: 3.6, times: [0, 0.92, 0.96, 1], repeat: Infinity }} style={{ originY: '0.45' }}>
      <circle cx={29} cy={y} r={r} fill="#1a1330" />
      <circle cx={51} cy={y} r={r} fill="#1a1330" />
      <circle cx={30.6} cy={y - 1.6} r={1.6} fill="#fff" />
      <circle cx={52.6} cy={y - 1.6} r={1.6} fill="#fff" />
    </motion.g>
  );
}

function Mouth({ mood, y = 46 }: { mood: MascotMood; y?: number }) {
  if (mood === 'cheer') return <path d={`M32 ${y} q8 10 16 0 z`} fill="#1a1330" />;
  if (mood === 'happy') return <path d={`M33 ${y} q7 6 14 0`} stroke="#1a1330" strokeWidth={3} strokeLinecap="round" fill="none" />;
  if (mood === 'sad') return <path d={`M34 ${y + 3} q6 -5 12 0`} stroke="#1a1330" strokeWidth={3} strokeLinecap="round" fill="none" />;
  if (mood === 'wow') return <ellipse cx={40} cy={y + 1} rx={5} ry={6.5} fill="#1a1330" />;
  return <path d={`M35 ${y} q5 4 10 0`} stroke="#1a1330" strokeWidth={2.5} strokeLinecap="round" fill="none" />;
}

function Blush({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <g fill="#ff8fab" opacity={0.55}>
      <ellipse cx={20} cy={43} rx={4.5} ry={2.8} />
      <ellipse cx={60} cy={43} rx={4.5} ry={2.8} />
    </g>
  );
}

/** Arms — up and waving when cheering. */
function Arms({ mood, color }: { mood: MascotMood; color: string }) {
  if (mood !== 'cheer') return null;
  return (
    <motion.g
      stroke={color}
      strokeWidth={7}
      strokeLinecap="round"
      animate={{ rotate: [0, -8, 8, 0] }}
      transition={{ duration: 0.6, repeat: Infinity }}
      style={{ originX: '0.5', originY: '0.7' }}
    >
      <path d="M12 44 Q4 32 8 24" fill="none" />
      <path d="M68 44 Q76 32 72 24" fill="none" />
    </motion.g>
  );
}

// ─── The three characters ────────────────────────────────────────
const BODY: Record<MascotId, { name: string; color: string; dark: string }> = {
  0: { name: 'Mochi', color: '#a78bfa', dark: '#8b5cf6' },
  1: { name: 'Bíp', color: '#fbbf24', dark: '#f59e0b' },
  2: { name: 'Susu', color: '#67e8f9', dark: '#22d3ee' },
};
export function mascotName(id: MascotId): string {
  return BODY[id].name;
}

function Character({ id, mood }: { id: MascotId; mood: MascotMood }) {
  const { color, dark } = BODY[id];
  return (
    <svg viewBox="0 0 80 76" width="100%" height="100%" aria-hidden>
      <Arms mood={mood} color={dark} />
      {id === 0 && (
        // Mochi — violet cat: pointed ears + whiskers
        <g>
          <path d="M16 22 L20 6 L32 16 Z" fill={color} />
          <path d="M64 22 L60 6 L48 16 Z" fill={color} />
          <path d="M19 19 L21.5 10 L28 15.5 Z" fill="#ffd6e8" />
          <path d="M61 19 L58.5 10 L52 15.5 Z" fill="#ffd6e8" />
          <ellipse cx={40} cy={42} rx={28} ry={26} fill={color} />
          <g stroke={dark} strokeWidth={1.8} strokeLinecap="round" opacity={0.9}>
            <path d="M8 40 L18 41" /><path d="M8 46 L18 45" />
            <path d="M72 40 L62 41" /><path d="M72 46 L62 45" />
          </g>
        </g>
      )}
      {id === 1 && (
        // Bíp — orange chick: feather tuft + tiny beak under the eyes
        <g>
          <g stroke={dark} strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M40 12 Q38 4 33 3" /><path d="M40 12 Q40 2 40 2" /><path d="M40 12 Q42 4 47 3" />
          </g>
          <ellipse cx={40} cy={42} rx={27} ry={26} fill={color} />
          <path d="M36 44 L44 44 L40 50 Z" fill="#fb923c" />
          <ellipse cx={17} cy={48} rx={6} ry={9} fill={dark} opacity={0.6} transform="rotate(20 17 48)" />
          <ellipse cx={63} cy={48} rx={6} ry={9} fill={dark} opacity={0.6} transform="rotate(-20 63 48)" />
        </g>
      )}
      {id === 2 && (
        // Susu — cyan octopus: dome + leg bumps
        <g>
          <path d="M13 46 a27 27 0 0 1 54 0 v10 q-4.5 6 -9 0 q-4.5 6 -9 0 q-4.5 6 -9 0 q-4.5 6 -9 0 q-4.5 6 -9 0 q-4.5 6 -9 0 Z" fill={color} />
          <circle cx={26} cy={22} r={3} fill="#fff" opacity={0.6} />
          <circle cx={33} cy={17} r={2} fill="#fff" opacity={0.5} />
        </g>
      )}
      {/* face — beak of Bíp sits at mouth height, so its mouth goes a bit lower */}
      <Eyes mood={mood} y={id === 1 ? 36 : 34} />
      {id !== 1 && <Mouth mood={mood} y={46} />}
      {id === 1 && mood !== 'idle' && mood !== 'wow' && <Mouth mood={mood} y={53} />}
      <Blush show={mood === 'happy' || mood === 'cheer'} />
    </svg>
  );
}

// ─── Motion wrapper ──────────────────────────────────────────────
const MOTION: Record<MascotMood, TargetAndTransition> = {
  idle: { y: [0, -3, 0], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
  happy: { y: [0, -8, 0], transition: { duration: 0.45, ease: 'easeOut' } },
  cheer: { y: [0, -14, 0, -8, 0], rotate: [0, -5, 5, 0], transition: { duration: 0.9, ease: 'easeOut' } },
  sad: { y: 3, rotate: -4, transition: { duration: 0.4 } },
  wow: { scale: [1, 1.12, 1], transition: { duration: 0.5 } },
};

export function Mascot({ id, mood, size = 72 }: { id: MascotId; mood: MascotMood; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div key={mood} animate={MOTION[mood]} style={{ width: size, height: size }}>
        <Character id={id} mood={mood} />
      </motion.div>
      {/* sparkles on a big cheer */}
      <AnimatePresence>
        {mood === 'cheer' &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-1/2 text-sm"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: Math.cos((i / 5) * Math.PI * 2) * size * 0.8,
                y: Math.sin((i / 5) * Math.PI * 2) * size * 0.7 - 8,
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

/** Mascot + speech bubble, side by side. */
export function MascotCoach({
  id,
  mood,
  text,
  size = 64,
  className = '',
}: {
  id: MascotId;
  mood: MascotMood;
  text: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <Mascot id={id} mood={mood} size={size} />
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="relative mb-2 max-w-[240px] rounded-2xl rounded-bl-sm bg-[var(--bg-surface)] px-3 py-2 text-sm font-medium text-text-primary shadow-sm ring-1 ring-[var(--border-color)]"
        >
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Small hook: greeting mascot for a page (rotates by day). */
export function useDailyMascot(): { id: MascotId; name: string } {
  const [id, setId] = useState<MascotId>(0);
  useEffect(() => {
    setId(pickMascot());
  }, []);
  return useMemo(() => ({ id, name: mascotName(id) }), [id]);
}
