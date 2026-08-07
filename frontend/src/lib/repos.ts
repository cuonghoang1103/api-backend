// ─── Shared language colors for GitHub repos ──────────────────────
//
// This map mirrors the official GitHub linguist palette but uses
// Tailwind utility classes (consistent with the rest of the app)
// instead of literal hex codes. Used by both the public feed and
// the detail page so the badge style is always identical.

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  JavaScript: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
  Python: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Go: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Rust: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Java: 'bg-red-500/20 text-red-300 border-red-500/30',
  Kotlin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Swift: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'C++': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  C: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'C#': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  PHP: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Ruby: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  HTML: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  CSS: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Dart: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Vue: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Svelte: 'bg-red-500/20 text-red-300 border-red-500/30',
  Lua: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Scala: 'bg-red-500/20 text-red-300 border-red-500/30',
  Elixir: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Haskell: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const DEFAULT_LANG_BADGE = 'bg-neon-violet/15 text-neon-violet border-neon-violet/30';

export function languageBadgeClasses(lang: string | null | undefined): string {
  if (!lang) return 'bg-darkcard text-text-muted border-darkborder';
  return LANGUAGE_COLORS[lang] || DEFAULT_LANG_BADGE;
}

// ─── Repo activity ("is this still maintained?") ──────────────────
//
// A star count says how popular a repo WAS; the last commit says whether
// anyone is still home. That matters more when you're deciding whether to
// depend on something — which is exactly what /repos is for.

/** Months elapsed since `iso`, or null when the timestamp is missing/bad. */
function monthsSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return (Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44);
}

/** Short Vietnamese phrase for how recently the repo was committed to. */
export function describeActivity(iso: string | null | undefined): string {
  const months = monthsSince(iso);
  if (months === null) return '';
  const days = months * 30.44;
  if (days < 1) return 'Commit hom nay';
  if (days < 7) return `Commit ${Math.round(days)} ngay truoc`;
  if (days < 30) return `Commit ${Math.max(1, Math.round(days / 7))} tuan truoc`;
  if (months < 12) return `Commit ${Math.max(1, Math.round(months))} thang truoc`;
  const years = months / 12;
  return `Commit ${years < 2 ? 'hon 1' : Math.floor(years)} nam truoc`;
}

/**
 * Colour the activity badge by staleness. The thresholds are deliberately
 * generous: a stable, finished library legitimately sits untouched for a
 * year, so only 24+ months reads as a warning colour.
 */
export function activityBadgeClasses(iso: string | null | undefined): string {
  const months = monthsSince(iso);
  if (months === null) return 'border-darkborder bg-darkbg/60 text-text-muted';
  if (months < 3) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  if (months < 12) return 'border-darkborder bg-darkbg/60 text-text-secondary';
  if (months < 24) return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
}

// Compact star count formatter. 1234 → "1.2k", 1500000 → "1.5M".
export function formatStars(n: number | null | undefined): string {
  if (n == null) return '0';
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}
