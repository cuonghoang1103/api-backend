/**
 * CV Builder — single-bullet linter (Phase 3, STATIC mode).
 * ─────────────────────────────────────────────────────────────────────────
 * Deterministic analysis of one achievement bullet. Returns a strength verdict
 * and a list of concrete issues. The design bias is HIGH PRECISION on strong
 * bullets: telling a user their genuinely good bullet is weak destroys trust in
 * everything else the product says, so a bullet with a strong verb + a real
 * outcome must never be marked WEAK (the eval harness gates this).
 */
import {
  STRONG_VERBS, WEAK_VERBS, BANNED_OPENERS, BUZZWORDS,
  FIRST_PERSON, OUTCOME_HINTS, METRIC_RE, PASSIVE_RE, PRESENCE_PHRASES,
} from './lexicon.js';

export type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR';
export type BulletStrength = 'WEAK' | 'OK' | 'STRONG';

export interface BulletIssue {
  code: string;
  severity: Severity;
  message: string;
}

export interface BulletVerdict {
  strength: BulletStrength;
  issues: BulletIssue[];
  hasMetric: boolean;
  hasOutcome: boolean;
  startsStrong: boolean;
}

const STRONG_SET = new Set(STRONG_VERBS);
const WEAK_SET = new Set(WEAK_VERBS);

/** First real word, lowercased, stripped of leading punctuation/bullets. */
function firstWord(text: string): string {
  const m = text.trim().replace(/^[\s\-•·*▪◦‣–—]+/, '').match(/^([a-zA-ZÀ-ỹ']+)/);
  return (m?.[1] ?? '').toLowerCase();
}

/** Membership with light stemming so "build"/"builds"/"building" match "built". */
function isStrongVerb(w: string): boolean {
  if (STRONG_SET.has(w)) return true;
  // present → past guesses
  const guesses = [w + 'ed', w + 'd', w.replace(/e$/, '') + 'ed', w.replace(/y$/, 'ied'), w.replace(/ing$/, ''), w.replace(/ing$/, 'ed'), w.replace(/s$/, '')];
  return guesses.some((g) => STRONG_SET.has(g));
}
function isWeakVerb(w: string): boolean {
  if (WEAK_SET.has(w)) return true;
  return [w + 'ed', w.replace(/ing$/, ''), w.replace(/s$/, '')].some((g) => WEAK_SET.has(g));
}

export function lintBullet(raw: string): BulletVerdict {
  const text = raw.trim();
  const lower = text.toLowerCase();
  const issues: BulletIssue[] = [];

  const hasMetric = METRIC_RE.test(text);
  const hasOutcome = hasMetric || OUTCOME_HINTS.some((re) => re.test(text));
  const fw = firstWord(text);
  const startsBanned = BANNED_OPENERS.find((p) => lower.startsWith(p));
  const startsStrong = !startsBanned && isStrongVerb(fw);
  const startsWeak = !startsBanned && isWeakVerb(fw);
  // A "verb start" we recognize as neither strong nor weak, nor a banned phrase,
  // is treated as "no clear action verb" only if the first word isn't a known
  // verb form. We can't POS-tag deterministically, so we only flag the clear
  // cases (banned opener / weak verb) and the absence of any recognized verb.
  const startsNoVerb = !startsBanned && !startsStrong && !startsWeak;

  if (startsBanned) {
    issues.push({
      code: 'banned-opener',
      severity: 'MAJOR',
      message: `Mở đầu bằng "${startsBanned}" mô tả vị trí, không phải việc bạn làm. Bắt đầu bằng động từ mạnh + kết quả.`,
    });
  } else if (startsWeak) {
    issues.push({
      code: 'weak-verb',
      severity: 'MINOR',
      message: `Động từ mở đầu yếu ("${fw}"). Nếu bạn là người làm chính, dùng động từ mạnh hơn (built, led, owned…).`,
    });
  } else if (startsNoVerb) {
    issues.push({
      code: 'no-action-verb',
      severity: 'MINOR',
      message: 'Không mở đầu bằng động từ hành động — nhà tuyển dụng đọc lướt phần đầu mỗi dòng.',
    });
  }

  if (!hasOutcome) {
    issues.push({
      code: 'no-outcome',
      severity: 'MAJOR',
      message: 'Chỉ mô tả công việc, chưa có kết quả. "Xây REST API" là nhiệm vụ; "…giảm thời gian tải từ 4s xuống 900ms" là thành tích.',
    });
  } else if (!hasMetric) {
    issues.push({
      code: 'no-metric',
      severity: 'MINOR',
      message: 'Có kết quả nhưng chưa có con số. Nếu đo được (thời gian, tỉ lệ lỗi, số user…), thêm vào sẽ mạnh hơn nhiều.',
    });
  }

  if (FIRST_PERSON.test(text)) {
    issues.push({ code: 'first-person', severity: 'MINOR', message: 'Tránh "I/my/we" — CV ngầm hiểu chủ ngữ là bạn.' });
  }
  if (PASSIVE_RE.test(text)) {
    issues.push({ code: 'passive-voice', severity: 'MINOR', message: 'Câu bị động — chuyển sang chủ động (bạn là người hành động).' });
  }
  const buzz = BUZZWORDS.find((b) => lower.includes(b));
  if (buzz) {
    issues.push({ code: 'buzzword', severity: 'MINOR', message: `Từ sáo rỗng ("${buzz}") không nói lên điều gì — bỏ đi, thay bằng bằng chứng cụ thể.` });
  }
  const presence = PRESENCE_PHRASES.test(text);
  if (presence) {
    issues.push({ code: 'presence-phrase', severity: 'MAJOR', message: 'Mô tả sự "có mặt" trong nhóm chứ không phải đóng góp của bạn — nói rõ BẠN đã làm gì và kết quả.' });
  }
  if (text.length > 240) {
    issues.push({ code: 'too-long', severity: 'MINOR', message: 'Bullet quá dài (>2 dòng khi render) — nhà tuyển dụng lướt, hãy cô đọng.' });
  }
  if (text.length < 12) {
    issues.push({ code: 'too-short', severity: 'MINOR', message: 'Bullet quá ngắn — chưa đủ để chứng minh điều gì.' });
  }

  // ── Strength verdict (scoring model, precision-first) ──
  // A deterministic linter can't POS-tag, so we never force WEAK on "no
  // recognized verb" alone (many valid verbs aren't in our list). Instead we
  // score signals additively. The invariant that matters most: a strong verb +
  // a real outcome is always STRONG, never WEAK (the eval harness gates the
  // false-positive rate on strong bullets).
  let score = 0;
  if (startsStrong) score += 2;
  else if (startsBanned) score -= 3;
  else if (startsWeak) score -= 1;
  else score -= 0.5; // unrecognized opener — mild, not decisive

  if (hasMetric) score += 2;
  else if (hasOutcome) score += 1;
  else score -= 2;

  if (FIRST_PERSON.test(text)) score -= 2;
  if (PASSIVE_RE.test(text)) score -= 1;
  if (buzz) score -= 1;
  if (text.length > 240) score -= 1;

  if (presence) score -= 2.5; // being "part of a team" is presence, not contribution

  const strength: BulletStrength = score >= 3 ? 'STRONG' : score <= -1.5 ? 'WEAK' : 'OK';
  return { strength, issues, hasMetric, hasOutcome, startsStrong };
}
