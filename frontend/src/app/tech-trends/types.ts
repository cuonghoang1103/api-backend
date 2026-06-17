// Shared types for the Tech Trends & Insights page.
//
// These mirror the backend response shape (see
// `frontend/src/lib/api.ts` PublicTechTrendArticle). The
// admin form types are defined alongside the admin page
// since they're an admin-only concern.

export type Category = 'TechNews' | 'FixBug' | 'Experience' | 'Interviews';

export type CodeBlock = {
  lang: 'tsx' | 'ts' | 'js' | 'java' | 'bash' | 'json' | 'css' | 'html' | 'sql' | string;
  lines: string[];
};

export type ArticleCodeBlock = {
  before: CodeBlock;
  after: CodeBlock;
  takeaway: string;
};

export type ArticleAuthor = {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
} | null;

export type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string[];
  category: Category;
  coverEmoji: string | null;
  coverImageUrl: string | null;
  codeBlock: ArticleCodeBlock | null;
  tags: string[];
  trendingScore: number;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  readTimeMin: number;
  author: ArticleAuthor;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Sidebar widget data — computed from the article list on
// the client (small dataset, no need to round-trip the
// server for the right column).
export type TrendingTag = { tag: string; score: number };
export type QuickTip = { title: string; body: string };
export type TopAuthor = { author: Required<NonNullable<ArticleAuthor>>; score: number };

export const CATEGORY_TABS: { id: 'All' | Category; label: string; emoji: string; accent: string }[] = [
  { id: 'All',         label: 'All',         emoji: '✨', accent: 'from-neon-indigo to-neon-violet' },
  { id: 'TechNews',    label: '#TechNews',   emoji: '📰', accent: 'from-neon-emerald to-neon-green'  },
  { id: 'FixBug',      label: '#FixBug',     emoji: '🐛', accent: 'from-neon-red to-neon-pink'       },
  { id: 'Experience',  label: '#Experience', emoji: '💼', accent: 'from-neon-cyan to-neon-blue'      },
  { id: 'Interviews',  label: '#Interviews', emoji: '🎯', accent: 'from-neon-fuchsia to-neon-violet' },
];

// Default cover emoji per category — used when an article
// has neither a `coverImageUrl` nor a `coverEmoji`. Keeps
// the bento grid visually consistent even for unstyled
// content.
export const CATEGORY_DEFAULT_EMOJI: Record<Category, string> = {
  TechNews: '📰',
  FixBug: '🐛',
  Experience: '💼',
  Interviews: '🎯',
};

// Sidebar "Quick Coding Tips" — these are editorial, not
// data-driven, so we keep them as a static array here. The
// blog/admin pages use the same pattern.
export const QUICK_TIPS: QuickTip[] = [
  {
    title: 'Use `useTransition` for any state change that touches a server action',
    body: 'It marks the update as non-urgent, so the user can keep typing while the request is in flight.',
  },
  {
    title: 'Profile before you optimise — `performance.now()` is your friend',
    body: '90% of the time the bottleneck is not where you think it is. Measure twice, optimise once.',
  },
  {
    title: 'When in doubt, return the cleanup function',
    body: 'Even if the effect is "obviously safe". Future-you will not remember why the cleanup was there.',
  },
  {
    title: 'Schema migrations are forever — never drop a column in the same deploy',
    body: 'Add the new column, dual-write, backfill, then drop in a follow-up deploy once the read traffic has moved.',
  },
];
