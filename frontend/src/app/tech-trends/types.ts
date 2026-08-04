// Shared types for the Tech Trends & Insights page.
//
// These mirror the backend response shape (see
// `frontend/src/lib/api.ts` PublicTechTrendArticle). The
// admin form types are defined alongside the admin page
// since they're an admin-only concern.

// 'DeepDive' = the long-form guides linked from the home page's Deep Dives
// strip (see components/home/landing/deepDivesData.ts). They live in the same
// table as everything else so they inherit SSR, JSON-LD, RSS and comments.
export type Category = 'TechNews' | 'FixBug' | 'Experience' | 'Interviews' | 'DeepDive';

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

// Tier 1A — sidebar TOC entries extracted server-side from
// bodyMdx so the public page doesn't re-parse HTML on every read.
export type TocItem = { id: string; text: string; level: 1 | 2 | 3 };


// ─── News bulletin ──────────────────────────────────────────────
// `kind` splits the AI-assembled daily bulletin from hand-written
// long-form articles. `sources` is the grounding set every claim in
// a bulletin links back to — it is what makes the page checkable,
// so it is part of the public read surface, not an internal detail.
export type ArticleKind = 'ARTICLE' | 'NEWS';

export type NewsSource = {
  title: string;
  url: string;
  publisher: string;
  publishedAt: string | null;
  imageUrl: string | null;
};

export type Article = {
  id: number;
  kind?: ArticleKind;
  sources?: NewsSource[];
  aiGenerated?: boolean;
  title: string;
  slug: string;
  summary: string;
  // Tier 1A — prefer rich bodyHtml; fall back to legacy
  // body[] for articles written before the migration.
  bodyHtml: string;
  body: string[];
  toc: TocItem[];
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

// ─── Resources (merged in from the old /blog) ───────────────────
// The legacy blog `Post` rows are source-code drops and course
// announcements, not essays: the payload is the GitHub link, not the
// body. They get their own card shape rather than being crammed into
// `Article`, but they share the feed so the reader sees one blog.
export type Resource = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string | null;
  sourceUrl: string | null;
  downloadCount: number;
  commentCount: number;
  viewCount: number;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
};

// One list, two sources. Sorted by date so the merged feed reads
// chronologically no matter which table a card came from.
export type FeedItem =
  | { type: 'article'; date: string; article: Article }
  | { type: 'resource'; date: string; resource: Resource };

// Sidebar widget data — computed from the article list on
// the client (small dataset, no need to round-trip the
// server for the right column).
export type TrendingTag = { tag: string; score: number };
export type QuickTip = { title: string; body: string };
export type TopAuthor = { author: Required<NonNullable<ArticleAuthor>>; score: number };

// 'Resources' is a UI-only pseudo-category. It is NOT a valid `Category` on the
// backend — it surfaces the legacy blog `Post` table (source-code drops and
// course announcements) inside the same page, so the site has one blog instead
// of two half-empty ones. Keeping it out of `Category` is deliberate: the admin
// editor builds its dropdown from `Category`, and offering a value the backend
// rejects would break publishing.
export type TabId = 'All' | Category | 'Resources';

// Vietnamese labels. The audience is Vietnamese, and `#DeepDive` told a reader
// nothing about what was inside. Used by BOTH the tab bar and the pill on each
// card so a card and its filter always read the same.
export const CATEGORY_LABEL_VI: Record<Category | 'Resources', string> = {
  Experience: 'Kinh nghiệm',
  FixBug: 'Sửa lỗi',
  DeepDive: 'Chuyên sâu',
  Interviews: 'Phỏng vấn',
  TechNews: 'Bản tin',
  Resources: 'Source & Thông báo',
};

// Order is editorial, not alphabetical: what Cuong writes himself comes first,
// the auto-assembled bulletin last.
export const CATEGORY_TABS: { id: TabId; label: string; emoji: string; accent: string }[] = [
  { id: 'All',         label: 'Tất cả',              emoji: '✨', accent: 'from-neon-indigo to-neon-violet' },
  { id: 'Experience',  label: 'Kinh nghiệm',         emoji: '💼', accent: 'from-neon-cyan to-neon-blue'      },
  { id: 'FixBug',      label: 'Sửa lỗi',             emoji: '🐛', accent: 'from-neon-red to-neon-pink'       },
  { id: 'DeepDive',    label: 'Chuyên sâu',          emoji: '📖', accent: 'from-neon-orange to-neon-red'     },
  { id: 'Interviews',  label: 'Phỏng vấn',           emoji: '🎯', accent: 'from-neon-fuchsia to-neon-violet' },
  { id: 'Resources',   label: 'Source & Thông báo',  emoji: '📦', accent: 'from-neon-violet to-neon-fuchsia' },
  { id: 'TechNews',    label: 'Bản tin',             emoji: '📰', accent: 'from-neon-emerald to-neon-green'  },
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
  DeepDive: '📖',
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
