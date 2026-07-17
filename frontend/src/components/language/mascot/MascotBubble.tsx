'use client';
/**
 * A speech bubble that types its line out, character by character.
 *
 * The typewriter is the whole point: an instantly-swapped string reads as a
 * label, but text that appears at reading speed reads as someone talking. It is
 * also why the effect restarts on a new emotion/seed rather than just replacing
 * the text.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { getLine, MASCOTS, type Emotion, type MascotId } from '@/lib/mascotData';

const MS_PER_CHAR = 26;

export function MascotBubble({
  character,
  emotion = 'happy',
  seed,
  text,
  className = '',
}: {
  character: MascotId;
  emotion?: Emotion;
  /** Change it to retype — a new question number, a new attempt. */
  seed?: number;
  /** Overrides the dialogue bank when the caller has something specific to say. */
  text?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState('');
  // The line is chosen in an effect, not during render: getLine() without a seed
  // is random, and a random call during render picks a new line on every
  // re-render — the bubble would flicker between lines mid-type.
  const [line, setLine] = useState('');
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLine(text ?? getLine(character, emotion, seed));
  }, [character, emotion, seed, text]);

  useEffect(() => {
    if (!line) { setShown(''); return; }
    if (reduce) { setShown(line); return; }

    setShown('');
    let i = 0;
    // Walk by code point: a line ending in 🎉 must not be torn in half.
    const chars = [...line];
    timer.current = setInterval(() => {
      i++;
      setShown(chars.slice(0, i).join(''));
      if (i >= chars.length && timer.current) clearInterval(timer.current);
    }, MS_PER_CHAR);

    return () => { if (timer.current) clearInterval(timer.current); };
  }, [line, reduce]);

  if (!line) return null;
  const color = MASCOTS[character]?.color ?? MASCOTS.bip.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`relative max-w-[260px] rounded-2xl bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm font-medium text-text-primary shadow-sm ring-1 ${className}`}
      style={{ ['--tw-ring-color' as string]: `${color}55` }}
    >
      {/* Reserve the full line's height from the start so the bubble does not
          grow line-by-line and shove the layout around while typing. */}
      <span className="invisible block h-0 overflow-hidden" aria-hidden>{line}</span>
      <span>{shown}</span>
      {/* Tail, pointing left at the mascot. Built from the bubble's own ring
          colour so it stays attached across all three themes. */}
      <span
        className="absolute -left-1.5 bottom-3 h-3 w-3 rotate-45 rounded-[2px] bg-[var(--bg-surface)]"
        style={{ boxShadow: `-1px 1px 0 0 ${color}55` }}
        aria-hidden
      />
    </motion.div>
  );
}
