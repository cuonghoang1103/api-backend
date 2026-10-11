/**
 * Frontend mirror of the backend news-bot registry.
 *
 * The multi-bot AI news network is driven by `post.newsCategory` (a string
 * key, or null for a normal human post). Five automated accounts each own a
 * category — CuongMini owns two ("tech" + "ai-compare"). This module is the
 * ONE place the frontend knows about them so the feed filter, the PostCard
 * "🤖 AI" badge, and the bot profile page all agree.
 *
 * Keep in sync with the backend registry (usernames / categories / avatars).
 */

/** Every valid `newsCategory` value the backend may stamp on a post. */
export type NewsCategory =
  | 'claude'
  | 'codex'
  | 'gemini'
  | 'antigravity'
  | 'tech'
  | 'ai-compare';

export interface NewsCategoryMeta {
  /** The `newsCategory` value sent to the API as `?newsCategory=<key>`. */
  key: NewsCategory;
  /** Friendly label shown on the filter chip. */
  label: string;
  /** Shorter label for the inline post badge chip. */
  short: string;
  /** Username of the bot whose avatar represents this category. */
  botUsername: string;
  /** Path to the small avatar/icon shown on the chip. */
  avatar: string;
  /** Accent colour (brand / per-bot) used to tint the active chip + chips. */
  accent: string;
}

/**
 * Ordered list driving the horizontal filter chip row. "Tất cả / All" is
 * rendered separately by the component (it carries no `newsCategory` param).
 */
export const NEWS_CATEGORIES: NewsCategoryMeta[] = [
  {
    key: 'claude',
    label: 'Claude',
    short: 'Claude',
    botUsername: 'claudemini',
    avatar: '/images/bots/claude-mini.svg',
    accent: '#D97757',
  },
  {
    key: 'codex',
    label: 'Codex',
    short: 'Codex',
    botUsername: 'codexx',
    avatar: '/images/bots/codex-x.svg',
    accent: '#10b981',
  },
  {
    key: 'gemini',
    label: 'Gemini',
    short: 'Gemini',
    botUsername: 'geminimini',
    avatar: '/images/bots/gemini-mini.svg',
    accent: '#6d7cf6',
  },
  {
    key: 'antigravity',
    label: 'Antigravity',
    short: 'Antigravity',
    botUsername: 'antigravitymini',
    avatar: '/images/bots/antigravity-mini.svg',
    accent: '#6366f1',
  },
  {
    key: 'tech',
    label: 'Tin công nghệ',
    short: 'Tin công nghệ',
    botUsername: 'cuongmini',
    avatar: '/images/cuongmini-avatar.svg',
    accent: '#4f5bd5',
  },
  {
    key: 'ai-compare',
    label: 'So sánh AI',
    short: 'So sánh AI',
    botUsername: 'cuongmini',
    avatar: '/images/cuongmini-avatar.svg',
    accent: '#4f5bd5',
  },
];

const CATEGORY_BY_KEY: Record<string, NewsCategoryMeta> = Object.fromEntries(
  NEWS_CATEGORIES.map((c) => [c.key, c]),
);

/** Map a `newsCategory` value → friendly short label (e.g. "So sánh AI"). */
export function categoryLabel(cat?: string | null): string | null {
  if (!cat) return null;
  return CATEGORY_BY_KEY[cat]?.short ?? cat;
}

/** Map a `newsCategory` value → its accent colour, falling back to brand purple. */
export function categoryAccent(cat?: string | null): string {
  if (!cat) return '#4f5bd5';
  return CATEGORY_BY_KEY[cat]?.accent ?? '#4f5bd5';
}

/** Full metadata for a `newsCategory` value, or null if unknown. */
export function categoryMeta(cat?: string | null): NewsCategoryMeta | null {
  if (!cat) return null;
  return CATEGORY_BY_KEY[cat] ?? null;
}

export interface BotMeta {
  username: string;
  /** The primary category this bot owns (CuongMini owns tech + ai-compare). */
  category: NewsCategory;
  /** Display name shown on the badge / profile. */
  name: string;
  /** Path to the (animated) avatar SVG. */
  avatar: string;
  /** Short description used in the profile tagline. */
  tagline: string;
  /** Per-bot accent colour. */
  accent: string;
}

/**
 * The five automated news accounts, keyed by username. Mirrors the backend
 * bot registry. Used to detect a bot profile and to render its polished
 * profile banner.
 */
export const BOTS: Record<string, BotMeta> = {
  claudemini: {
    username: 'claudemini',
    category: 'claude',
    name: 'Claude Mini',
    avatar: '/images/bots/claude-mini.svg',
    tagline: 'Tin tức, nâng cấp & mẹo dùng Claude',
    accent: '#D97757',
  },
  codexx: {
    username: 'codexx',
    category: 'codex',
    name: 'Codex X',
    avatar: '/images/bots/codex-x.svg',
    tagline: 'Tin tức, bản cập nhật & mẹo dùng Codex',
    accent: '#10b981',
  },
  geminimini: {
    username: 'geminimini',
    category: 'gemini',
    name: 'Gemini Mini',
    avatar: '/images/bots/gemini-mini.svg',
    tagline: 'Tin tức & cập nhật mới nhất về Google Gemini',
    accent: '#6d7cf6',
  },
  antigravitymini: {
    username: 'antigravitymini',
    category: 'antigravity',
    name: 'Antigravity Mini',
    avatar: '/images/bots/antigravity-mini.svg',
    tagline: 'Tin tức & khám phá về Antigravity',
    accent: '#6366f1',
  },
  cuongmini: {
    username: 'cuongmini',
    category: 'tech',
    name: 'CuongMini',
    avatar: '/images/cuongmini-avatar.svg',
    tagline: 'Tin công nghệ & so sánh các AI mỗi ngày',
    accent: '#4f5bd5',
  },
};

/** True when the username belongs to one of the automated news bots. */
export function isBotUsername(username?: string | null): boolean {
  if (!username) return false;
  return Object.prototype.hasOwnProperty.call(BOTS, username);
}

/** Bot metadata for a username, or null for a normal human account. */
export function getBot(username?: string | null): BotMeta | null {
  if (!username) return null;
  return BOTS[username] ?? null;
}
