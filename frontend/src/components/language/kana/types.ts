/**
 * Kana practice — shared types & pure helpers (no JSX, framework-agnostic).
 * The practice engine turns AlphabetGroups into a shuffled queue of questions,
 * each bound to one of the 9 stage types over the selected kana pool.
 */
import type { AlphabetGroup } from '@/types/language';

// ─── Domain ──────────────────────────────────────────────────────
export interface KanaItem {
  id: number;
  kana: string;
  romaji: string;
  note?: string | null;
}
export interface KanaGroup {
  id: number;
  name: string;
  items: KanaItem[];
}

export const STAGE_TYPES = [
  'choice',
  'reverse',
  'pair',
  'write',
  'writeWord',
  'writeText',
  'listen',
  'stroke',
  'draw',
] as const;
export type StageType = (typeof STAGE_TYPES)[number];

export interface PracticeSettings {
  groupIds: number[];
  stages: StageType[];
  /** Number of questions; `0` means "all" (one per pool item, min 10). */
  count: number;
}

export interface Question {
  id: string;
  stage: StageType;
  /** Primary target item. For word stages this is `word[0]`. */
  target: KanaItem;
  /** Item sequence — length 1 for single-target stages, 2–6 for word/text. */
  word: KanaItem[];
}

export interface QuestionResult {
  stage: StageType;
  correct: boolean;
}

/** Props every stage component receives. */
export interface StageProps {
  target: KanaItem;
  word: KanaItem[];
  /** Flat pool of all selected items — used for distractors / pair sets. */
  pool: KanaItem[];
  onResult: (correct: boolean) => void;
  onNext: () => void;
  reduced: boolean;
}

export const COUNT_OPTIONS: { value: number; label: string }[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 40, label: '40' },
  { value: 0, label: 'Tất cả' },
];

// ─── Pure helpers ────────────────────────────────────────────────
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: readonly T[]): T | undefined {
  return arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

/** Case/space-insensitive romaji comparison key. */
export function normalizeRomaji(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '').trim();
}

/** Map API groups → practice groups, dropping items without a romanization. */
export function toKanaGroups(groups: AlphabetGroup[]): KanaGroup[] {
  return groups
    .map((g) => ({
      id: g.id,
      name: g.name,
      items: g.items
        .filter((it) => (it.romanization ?? '').trim().length > 0 && it.character.trim().length > 0)
        .map<KanaItem>((it) => ({
          id: it.id,
          kana: it.character,
          romaji: (it.romanization ?? '').trim(),
          note: it.note,
        })),
    }))
    .filter((g) => g.items.length > 0);
}

/** Distinct romaji options from the pool excluding the correct one. */
export function distractorRomaji(pool: readonly KanaItem[], correct: string, n: number): string[] {
  const seen = new Set([normalizeRomaji(correct)]);
  const out: string[] = [];
  for (const it of shuffle(pool)) {
    const key = normalizeRomaji(it.romaji);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it.romaji);
    if (out.length >= n) break;
  }
  return out;
}

/** Distinct kana options from the pool excluding the correct one. */
export function distractorKana(pool: readonly KanaItem[], correct: string, n: number): string[] {
  const seen = new Set([correct]);
  const out: string[] = [];
  for (const it of shuffle(pool)) {
    if (seen.has(it.kana)) continue;
    seen.add(it.kana);
    out.push(it.kana);
    if (out.length >= n) break;
  }
  return out;
}

/** Build the shuffled question queue, cycling through the enabled stages. */
export function buildQuestions(
  groups: readonly KanaGroup[],
  stages: readonly StageType[],
  count: number,
): Question[] {
  const pool = groups.flatMap((g) => g.items);
  if (!pool.length || !stages.length) return [];

  const total = count > 0 ? count : Math.max(pool.length, 10);
  const eligibleForWords = groups.filter((g) => g.items.length > 0);

  const pickWord = (min: number, max: number): KanaItem[] => {
    const g = sample(eligibleForWords) ?? groups[0];
    const k = Math.min(g.items.length, min + Math.floor(Math.random() * (max - min + 1)));
    const start = Math.floor(Math.random() * (g.items.length - k + 1));
    return g.items.slice(start, start + k);
  };

  let seq = shuffle(stages);
  const questions: Question[] = [];
  for (let i = 0; i < total; i++) {
    if (i > 0 && i % seq.length === 0) seq = shuffle(stages);
    const stage = seq[i % seq.length];
    let word: KanaItem[];
    if (stage === 'writeWord') word = pickWord(2, 3);
    else if (stage === 'writeText') word = pickWord(4, 6);
    else {
      const it = sample(pool);
      word = it ? [it] : [];
    }
    if (!word.length) continue;
    questions.push({ id: `q${i}`, stage, target: word[0], word });
  }
  return questions;
}
