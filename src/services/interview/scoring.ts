/**
 * Deterministic coverage scoring (Pass A) — PURE, no LLM, free, instant.
 *
 * Checks an answer against a question's `mustMention` / `shouldMention` /
 * `redFlags` using SYNONYM + light FUZZY matching, not naive `includes()`.
 * Naive substring matching punishes correct answers that use different words —
 * that is a bug, not a feature (see the prompt's Pass A spec). This is the
 * objective signal shown next to the user's self-assessment in STATIC mode,
 * and it is Pass A of the future hybrid pipeline.
 */

export interface RubricCriterion {
  id: string;
  criterion: string;
  weight: number;
}

/** synonyms map: { canonicalTerm(lowercased): [alias, ...] } */
export type SynonymMap = Record<string, string[]>;

export interface DeterministicResult {
  mustHit: string[];
  mustMiss: string[];
  shouldHit: string[];
  shouldMiss: string[];
  redFlagsHit: string[];
  mustCoverage: number; // 0-1
  shouldCoverage: number; // 0-1
  score: number; // 0-100
  grade: LetterGrade;
  injectionAttempted: boolean;
}

export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/** Default points removed per factual red flag (env-overridable at the caller). */
export const DEFAULT_REDFLAG_PENALTY = 15;

/** Lowercase, strip punctuation to spaces, collapse whitespace. */
export function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/[`*_>#~]/g, ' ') // strip common markdown noise
    .replace(/[^\p{L}\p{N}\s+.-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const collapse = (s: string) => s.replace(/[\s.-]/g, '');

/**
 * Does `answer` mention `term` (or a synonym)? Matches on the normalized
 * answer both space-preserving (substring) and space-stripped (so "micro task"
 * ≈ "microtask" ≈ "micro-task"). Multi-word candidates match if the whole
 * phrase appears, OR every word appears somewhere (covers reordering).
 */
export function mentions(answerNorm: string, term: string, synonyms: SynonymMap): boolean {
  const answerFlat = collapse(answerNorm);
  const candidates = [term, ...(synonyms[term.toLowerCase()] ?? [])];
  for (const cand of candidates) {
    const c = normalizeText(cand);
    if (!c) continue;
    if (answerNorm.includes(c)) return true;
    if (answerFlat.includes(collapse(c))) return true;
    const words = c.split(' ').filter((w) => w.length > 2);
    if (words.length > 1 && words.every((w) => answerNorm.includes(w))) return true;
  }
  return false;
}

/**
 * Heuristic prompt-injection detection over a candidate answer. Weak signal —
 * surfaced to admin, never used to silently zero a score. The grader still
 * grades on technical merit; this only flags.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /\bignore (all |the )?(previous|above|prior) (instructions|rubric)/i,
  /\b(give|award|assign) (me )?(a )?(full|maximum|perfect|high(est)?) (score|grade|marks)/i,
  /\byou (are|must|should) (now )?(act as|grade|score)/i,
  /\bas an? (ai|assistant|grader)\b.*\b(instruct|must)/i,
  /\bsystem\s*[:>]/i,
  /\bthis candidate is (exceptional|outstanding).*(grade|score) generously/i,
  /\bdisregard the (rubric|criteria|answer key)/i,
];

export function detectInjection(rawAnswer: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(rawAnswer || ''));
}

export function letterGrade(score: number): LetterGrade {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export interface DeterministicInput {
  mustMention: string[];
  shouldMention: string[];
  redFlags: string[];
  synonyms: SynonymMap;
}

/**
 * Run Pass A. Returns coverage vectors, red flags hit, a 0-100 score and a
 * letter grade. Scoring: 70% weight on must-mention coverage, 30% on
 * should-mention depth, minus a hard penalty per red flag. If a question has no
 * must-mention list, coverage falls back to should-mention (or neutral 0.5).
 */
export function deterministicScore(
  rawAnswer: string,
  q: DeterministicInput,
  opts: { redFlagPenalty?: number } = {},
): DeterministicResult {
  const penalty = opts.redFlagPenalty ?? DEFAULT_REDFLAG_PENALTY;
  const answerNorm = normalizeText(rawAnswer);
  const synonyms = q.synonyms || {};

  const mustHit: string[] = [];
  const mustMiss: string[] = [];
  for (const term of q.mustMention || []) {
    (mentions(answerNorm, term, synonyms) ? mustHit : mustMiss).push(term);
  }
  const shouldHit: string[] = [];
  const shouldMiss: string[] = [];
  for (const term of q.shouldMention || []) {
    (mentions(answerNorm, term, synonyms) ? shouldHit : shouldMiss).push(term);
  }
  const redFlagsHit = (q.redFlags || []).filter((f) => mentions(answerNorm, f, synonyms));

  const mustTotal = (q.mustMention || []).length;
  const shouldTotal = (q.shouldMention || []).length;
  const mustCoverage = mustTotal ? mustHit.length / mustTotal : shouldTotal ? shouldHit.length / shouldTotal : answerNorm.length > 40 ? 0.5 : 0;
  const shouldCoverage = shouldTotal ? shouldHit.length / shouldTotal : mustCoverage;

  let score = (mustCoverage * 0.7 + shouldCoverage * 0.3) * 100 - redFlagsHit.length * penalty;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    mustHit,
    mustMiss,
    shouldHit,
    shouldMiss,
    redFlagsHit,
    mustCoverage,
    shouldCoverage,
    score,
    grade: letterGrade(score),
    injectionAttempted: detectInjection(rawAnswer),
  };
}

/**
 * Self-assessment score: user rates each rubric criterion 0-4. Weighted to a
 * 0-100 scale. `weights` come from the question's rubric.
 */
export function selfAssessmentScore(
  ratings: Record<string, number>,
  rubric: RubricCriterion[],
): { score: number; grade: LetterGrade } {
  if (!rubric.length) return { score: 0, grade: 'F' };
  const totalWeight = rubric.reduce((s, c) => s + (c.weight || 0), 0) || 1;
  let acc = 0;
  for (const c of rubric) {
    const r = Math.max(0, Math.min(4, ratings[c.id] ?? 0));
    acc += (r / 4) * (c.weight || 0);
  }
  const score = Math.round((acc / totalWeight) * 100);
  return { score, grade: letterGrade(score) };
}
