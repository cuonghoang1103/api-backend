/**
 * Shared SM-2 spaced-repetition scheduler — PURE, no DB.
 *
 * Extracted so the Interview drill (`InterviewReviewCard`) and any future
 * consumer use ONE implementation instead of a second copy. The formula
 * mirrors the existing /language SRS (`myLanguage.service.ts` recordProgress)
 * exactly: quality 0-5, ease floored at 1.3, interval steps 1 → 6 →
 * round(interval * ease). Persistence and per-feature gating stay in callers.
 *
 * NOTE: /language keeps its own inline copy for now (not refactored, to avoid
 * touching a working module). This helper is the canonical version going
 * forward; /language can adopt it later.
 */

export interface Sm2State {
  easeFactor: number;
  repetitions: number;
  intervalDays: number;
  lapses?: number;
}

export interface Sm2Result {
  easeFactor: number;
  repetitions: number;
  intervalDays: number;
  lapses: number;
  dueAt: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Advance an SM-2 card given a recall `quality` (0-5).
 * `resetOnRedFlag`: when true (a repeat factual error on the concept), the
 * interval is *reset* rather than merely shortened — a wrong belief must be
 * uprooted, not just delayed.
 */
export function scheduleSm2(
  state: Sm2State,
  quality: number,
  opts: { resetOnRedFlag?: boolean; now?: Date } = {},
): Sm2Result {
  const now = opts.now ?? new Date();
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let easeFactor = state.easeFactor ?? 2.5;
  let repetitions = state.repetitions ?? 0;
  let intervalDays = state.intervalDays ?? 0;
  let lapses = state.lapses ?? 0;

  if (q < 3 || opts.resetOnRedFlag) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
    repetitions += 1;
  }
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const dueAt = new Date(now.getTime() + intervalDays * DAY_MS);
  return { easeFactor, repetitions, intervalDays, lapses, dueAt };
}

export type MasteryLevel = 'UNSEEN' | 'SHAKY' | 'LEARNING' | 'SOLID' | 'MASTERED';

/** Derive a coarse mastery bucket from an SM-2 card's state. */
export function masteryFromState(state: {
  repetitions: number;
  intervalDays: number;
  lapses: number;
}): MasteryLevel {
  if (state.repetitions === 0 && state.intervalDays === 0) return 'UNSEEN';
  if (state.lapses >= 2 && state.intervalDays <= 1) return 'SHAKY';
  if (state.intervalDays >= 30) return 'MASTERED';
  if (state.intervalDays >= 7) return 'SOLID';
  return 'LEARNING';
}

/**
 * Map a hybrid answer grade (0-100) + red-flag presence to an SM-2 quality 0-5.
 * Red flags weigh heavily: a factual error caps quality low regardless of score.
 */
export function qualityFromGrade(score: number, redFlagHit: boolean): number {
  if (redFlagHit) return score >= 85 ? 2 : 1; // a wrong belief never fully "passes"
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}
