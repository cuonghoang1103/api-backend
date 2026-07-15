/**
 * CV Builder — rules-engine lexicons (Phase 3, STATIC mode).
 * ─────────────────────────────────────────────────────────────────────────
 * Curated word/phrase lists that power the deterministic bullet linter. These
 * are the product's opinion about what strong engineering writing looks like.
 * Kept in one place so they can later be made admin-editable without a deploy
 * (spec: /api/admin/cv/rules). Everything here is lowercase; callers normalize.
 *
 * The BANNED list is the highest-signal check: these phrases describe presence,
 * not contribution. "Responsible for the payment module" tells a recruiter you
 * were near the work, not that you did it.
 */

// Strong engineering action verbs (base forms; the matcher also accepts the
// past-tense "-ed"/"-d" form). Not exhaustive — high-precision, low-noise.
export const STRONG_VERBS: string[] = [
  'architected', 'built', 'designed', 'developed', 'implemented', 'engineered',
  'migrated', 'refactored', 'rearchitected', 'optimized', 'reduced', 'improved',
  'automated', 'instrumented', 'debugged', 'owned', 'led', 'shipped', 'launched',
  'scaled', 'deployed', 'integrated', 'streamlined', 'accelerated', 'eliminated',
  'resolved', 'increased', 'decreased', 'cut', 'saved', 'delivered', 'created',
  'established', 'drove', 'spearheaded', 'orchestrated', 'containerized',
  'parallelized', 'modernized', 'hardened', 'benchmarked', 'profiled',
  'redesigned', 'rebuilt', 'rewrote', 'consolidated', 'standardized', 'mentored',
  'championed', 'pioneered', 'devised', 'formulated', 'diagnosed', 'remediated',
  'boosted', 'slashed', 'doubled', 'tripled', 'halved', 'introduced', 'enabled',
  'unblocked', 'decoupled', 'decomposed', 'productionized', 'operationalized',
  'wrote', 'configured', 'provisioned', 'coded', 'released', 'published',
  'negotiated', 'reviewed', 'analyzed', 'researched', 'prototyped', 'validated',
].map((v) => v.toLowerCase());

// Verbs that are technically actions but read as weak / low-ownership. Not
// banned, but a bullet starting with one is nudged down.
export const WEAK_VERBS: string[] = [
  'helped', 'assisted', 'participated', 'worked', 'involved', 'handled',
  'dealt', 'supported', 'contributed', 'aided', 'collaborated', 'coordinated',
  'used', 'utilized', 'managed', 'maintained',
].map((v) => v.toLowerCase());

// Phrases that, at the START of a bullet, describe a position rather than a
// contribution. This is the highest-signal weakness check.
export const BANNED_OPENERS: string[] = [
  'responsible for', 'responsible of', 'was responsible', 'in charge of',
  'worked on', 'worked with', 'helped with', 'helped to', 'help to',
  'participated in', 'assisted with', 'assisted in', 'was tasked with',
  'tasked with', 'duties included', 'duty included', 'involved in',
  'part of a team', 'member of a team', 'role included', 'responsibilities included',
].map((v) => v.toLowerCase());

// Empty self-description. These consume the scarcest resource on the page and
// say nothing measurable.
export const BUZZWORDS: string[] = [
  'synergy', 'synergies', 'passionate', 'hard-working', 'hardworking',
  'team player', 'detail-oriented', 'detail oriented', 'fast learner',
  'quick learner', 'self-starter', 'self starter', 'go-getter', 'results-driven',
  'results driven', 'results-oriented', 'dynamic', 'motivated', 'proactive',
  'think outside the box', 'outside the box', 'go-to person', 'guru', 'ninja',
  'rockstar', 'wizard', 'excellent communication skills', 'strong work ethic',
  'highly motivated', 'goal-oriented', 'people person', 'multitasker',
].map((v) => v.toLowerCase());

// First-person pronouns — a CV convention violation (bullets are implicitly "I").
export const FIRST_PERSON = /\b(i|i'm|i've|my|me|myself|we|we've|our|us)\b/i;

// Words that signal a RESULT/outcome clause (as opposed to a pure task).
export const OUTCOME_HINTS: RegExp[] = [
  /\b(reduc|improv|increas|decreas|cut|sav(ed|ing)|boost|accelerat|elimin|enabl|result|achiev|grew|grow|drove|driving|deliver|lower|rais|shorten|speed(ed)? up|scal)/i,
  /\bfrom\s+[\w$%.]+\s+to\s+[\w$%.]+/i, // "from 4s to 900ms"
  /\bby\s+\d/i, // "by 40%", "by 3x"
];

// Quantification: any number, percentage, multiplier, or common unit.
export const METRIC_RE = /(\d[\d,.]*\s*(%|percent|x|k|m|b|ms|s\b|sec|seconds|mins?|minutes|hours?|days?|rps|qps|req|users?|customers?|records?|rows?|gb|mb|tb|k\/day|\/day|\/s|\+))|(\$\s?\d)|\b\d{2,}\b|\b\d+x\b/i;

// Passive-voice heuristic: a "to be" verb followed by a past participle.
export const PASSIVE_RE = /\b(was|were|been|being|is|are|be)\s+(\w+ed|built|written|made|done|given|taken|shown|kept|held|found|led|run)\b/i;
