/**
 * Prerequisite gating (MVP, frontend-only — no DB/schema change).
 *
 * A SOFT, self-assessed gate: when a learner opens a course that assumes prior
 * knowledge, we show a modal ("Do you already have the foundation?"). They can
 * proceed (we remember the choice per-course in localStorage and never ask
 * again) or jump to the foundation course first. This is deliberately not a
 * hard, completion-based lock — that can come later, DB-backed.
 *
 * To gate a course: add its slug here with the foundation course(s) it needs.
 * Extend freely as more advanced courses are added.
 */
export interface PrereqCourse {
  slug: string;
  /** Bilingual "en|||vi" title, shown via pickLang. */
  title: string;
}

/** courseSlug → the foundation course(s) it assumes you already know. */
export const PREREQUISITES: Record<string, PrereqCourse[]> = {
  nodejs: [{ slug: 'web-foundations', title: 'Web Foundations|||Nền tảng Lập trình Web' }],
  nextjs: [{ slug: 'web-foundations', title: 'Web Foundations|||Nền tảng Lập trình Web' }],
};

export function getPrerequisites(courseSlug: string | undefined | null): PrereqCourse[] {
  if (!courseSlug) return [];
  return PREREQUISITES[courseSlug] ?? [];
}

const ackKey = (slug: string) => `prereq-ack:${slug}`;

/**
 * Has the learner already acknowledged this course's prerequisites?
 * Reads localStorage directly (call only after the component is mounted —
 * do NOT rely on an auth-store hydration flag, which can stay false).
 */
export function hasAcknowledgedPrereq(courseSlug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(ackKey(courseSlug)) === '1';
  } catch {
    return false;
  }
}

export function acknowledgePrereq(courseSlug: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ackKey(courseSlug), '1');
  } catch {
    /* localStorage unavailable (private mode) — fail open, just re-ask next time */
  }
}
