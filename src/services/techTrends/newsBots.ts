/**
 * Mạng bản tin AI NHIỀU BOT — sổ đăng ký (registry) + tài khoản bot.
 * ─────────────────────────────────────────────────────────────────────────
 * Mở rộng hệ "một bot CuongMini" thành NĂM bot, mỗi bot là một CẤU HÌNH chứ
 * không còn hard-code. Mỗi bot là một tài khoản `User` không đăng nhập được
 * (password null, email @…invalid, `getBotUser` find-or-create) — y hệt cách
 * `cuongMiniBot.ts` dựng tài khoản CuongMini, nay tổng quát hoá cho mọi bot.
 *
 * Mỗi bot gắn MỘT kênh tin (`category`, khớp cột `social_posts.news_category`
 * — xem NEWS_CATEGORIES trong social.service): claude · codex · gemini ·
 * antigravity · tech · ai-compare. Bảng tin lọc theo kênh này; không lọc =
 * "Tất cả" = mọi bài (bot + người).
 *
 * CHỐNG BỊA: mọi bài đều phải "bắt rễ" (grounded) vào tin THẬT hút từ RSS
 * (`newsIngest.service.ts`) — model chỉ viết lời, CODE cấp link. Bot sản phẩm
 * (claude-mini) chỉ đăng Nâng cấp/Fix/Khuyến mãi khi CÓ mục chính thức thật;
 * không có thì im lặng khung giờ đó (xem `newsBotsFeed.ts`).
 */
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { COMPARISONS, type ComparisonTopic } from './cuongMiniSchedule.js';

/** Kiểu bài một bot sinh ra. */
export type BotKind =
  | 'digest-sources' // tổng hợp tin từ nguồn RSS của bot (lọc theo publisher)
  | 'product'        // bot sản phẩm: Nâng cấp / Fix / Khuyến mãi / Mẹo (claude-mini)
  | 'general';       // CuongMini: tổng hợp tin chung + bài so sánh (ai-compare)

/** Kiểu bài con của bot SẢN PHẨM (claude-mini). */
export type ProductPostType = 'upgrade' | 'fix' | 'promo' | 'tips';

export interface BotFeedSource {
  name: string;
  url: string;
  publisher: string; // nhãn dùng để LỌC ứng viên cho đúng bot
  homepage: string;
  topic: string;
  weight: number;
  /** true = URL RSS CHƯA kiểm chắc (có thể 404) — ingest tự bỏ qua êm, không chết. */
  unverified?: boolean;
}

export interface BotConfig {
  key: string;                 // định danh ổn định (dùng cho #tag, ưu tiên lịch)
  username: string;            // username tài khoản bot (ổn định, dùng cho huy hiệu AI)
  displayName: string;
  avatar: string;              // đường dẫn SVG trong frontend/public
  bio: string;
  category: string;            // kênh tin mặc định (news_category)
  kind: BotKind;
  /** Nhãn publisher dùng để lọc ứng viên RSS cho bot này. Rỗng = dùng MỌI nguồn. */
  groundingPublishers: string[];
  /** Nguồn RSS chính thức của bot (seed vào bảng news_feeds khi chạy). */
  feeds: BotFeedSource[];
  /** URL chính thức để gắn link "tìm hiểu thêm" (CODE cấp, model không tự viết). */
  officialLinks: string[];
  /** Bot sản phẩm: các kiểu bài xoay vòng. */
  postTypes?: ProductPostType[];
  /** Chủ đề so sánh ưu tiên (ai-compare) khi bot lùi sang bài so sánh. */
  comparisonSlugs?: string[];
}

// ── Nguồn chính thức, nhãn publisher riêng để lọc đúng bot ──────────────────
// OpenAI News đã có sẵn trong DEFAULT_FEEDS (publisher 'OpenAI'), nên codex-x
// KHÔNG cần seed thêm. Các bot còn lại seed nguồn riêng ở đây.
const ANTHROPIC_FEEDS: BotFeedSource[] = [
  // Statuspage của Anthropic có RSS THẬT, ổn định (sự cố & khắc phục) — nền
  // tảng Atlassian Statuspage luôn phát /history.rss.
  { name: 'Anthropic Status', url: 'https://status.anthropic.com/history.rss', publisher: 'Anthropic', homepage: 'https://status.anthropic.com', topic: 'ai', weight: 88 },
  // Trang tin Anthropic — CHƯA chắc có RSS công khai (mọi path tài liệu từng
  // 404, xem chú thích trong newsIngest.service.ts). Để best-effort: nếu một
  // ngày họ mở RSS thì bài Nâng cấp/Khuyến mãi tự có chỗ bắt rễ; còn 404 thì
  // ingest bỏ qua êm và claude-mini chỉ còn Fix (status) + Mẹo (hạt giống).
  { name: 'Anthropic News (best-effort)', url: 'https://www.anthropic.com/news/rss.xml', publisher: 'Anthropic', homepage: 'https://www.anthropic.com/news', topic: 'ai', weight: 92, unverified: true },
];
const GEMINI_FEEDS: BotFeedSource[] = [
  // Blog Google có RSS theo chuyên mục (giống technology/developers/rss đã
  // dùng). Mục AI: /technology/ai/rss/.
  { name: 'Google — The Keyword (AI)', url: 'https://blog.google/technology/ai/rss/', publisher: 'Google Gemini', homepage: 'https://blog.google/technology/ai', topic: 'ai', weight: 86 },
];
const ANTIGRAVITY_FEEDS: BotFeedSource[] = [
  // Antigravity (IDE agentic của Google) rất mới — CHƯA có RSS đáng tin. Để
  // best-effort; thường rỗng ⇒ antigravity-mini lùi sang bài so sánh ai-compare.
  { name: 'Antigravity (best-effort)', url: 'https://antigravity.google/rss.xml', publisher: 'Antigravity', homepage: 'https://antigravity.google', topic: 'ai', weight: 70, unverified: true },
];

/** Mẹo dùng Claude/Claude Code — HẠT GIỐNG tuyển sẵn, ĐÚNG & an toàn (không
 *  phải model tự nghĩ): model chỉ diễn giải MỘT hạt mỗi bài, không nêu số
 *  liệu/phiên bản/khuyến mãi. Xoay vòng theo ngày. */
export const CLAUDE_TIP_SEEDS: string[] = [
  'Ghi quy ước dự án vào CLAUDE.md để Claude Code tự đọc mỗi phiên, đỡ nhắc lại',
  'Chia nhiệm vụ lớn thành các bước nhỏ, rõ ràng — agent bám sát hơn và dễ kiểm',
  'Dùng /clear giữa hai nhiệm vụ không liên quan để ngữ cảnh gọn và câu trả lời sắc',
  'Cấp quyền công cụ HẸP (chỉ thứ cần) — vừa an toàn vừa tránh thao tác ngoài ý',
  'Yêu cầu Claude lập kế hoạch trước khi sửa mã, rồi mới cho chạy từng bước',
  'Nhờ Claude tự chạy test/kiểm kiểu sau khi sửa, thay vì tự mắt dò',
  'Đính kèm thông báo lỗi đầy đủ (stack trace) để Claude khoanh đúng chỗ hỏng',
  'Tách phiên theo đầu việc; mỗi phiên một mục tiêu giúp lịch sử dễ lần lại',
];

/** Năm bot, theo THỨ TỰ ƯU TIÊN khi chia khung giờ (claude-mini trước nhất). */
export const BOTS: BotConfig[] = [
  {
    key: 'claude-mini',
    username: 'claudemini',
    displayName: 'Claude Mini',
    avatar: '/images/bots/claude-mini.svg',
    bio: 'Bản tin AI về Claude của cuongthai.com — nâng cấp, sửa lỗi, khuyến mãi & mẹo dùng Claude Code. Bài do AI tạo, bám nguồn chính thức Anthropic.',
    category: 'claude',
    kind: 'product',
    groundingPublishers: ['Anthropic'],
    feeds: ANTHROPIC_FEEDS,
    officialLinks: [
      'https://www.anthropic.com/news',
      'https://docs.anthropic.com/en/release-notes/overview',
      'https://status.anthropic.com',
    ],
    postTypes: ['upgrade', 'fix', 'promo', 'tips'],
    comparisonSlugs: ['claude-code-vs-antigravity'],
  },
  {
    key: 'codex-x',
    username: 'codexx',
    displayName: 'Codex X',
    avatar: '/images/bots/codex-x.svg',
    bio: 'Bản tin AI về ChatGPT / Codex / OpenAI của cuongthai.com. Bài do AI tạo, bám nguồn chính thức OpenAI.',
    category: 'codex',
    kind: 'digest-sources',
    groundingPublishers: ['OpenAI'], // 'OpenAI News' đã có sẵn trong DEFAULT_FEEDS
    feeds: [],
    officialLinks: ['https://openai.com/news', 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes'],
  },
  {
    key: 'gemini-mini',
    username: 'geminimini',
    displayName: 'Gemini Mini',
    avatar: '/images/bots/gemini-mini.svg',
    bio: 'Bản tin AI về Google Gemini của cuongthai.com. Bài do AI tạo, bám nguồn chính thức Google.',
    category: 'gemini',
    kind: 'digest-sources',
    groundingPublishers: ['Google Gemini'],
    feeds: GEMINI_FEEDS,
    officialLinks: ['https://blog.google/technology/ai/', 'https://ai.google.dev'],
  },
  {
    key: 'antigravity-mini',
    username: 'antigravitymini',
    displayName: 'Antigravity Mini',
    avatar: '/images/bots/antigravity-mini.svg',
    bio: 'Bản tin AI về Antigravity (IDE agentic của Google) của cuongthai.com. Nguồn còn hiếm nên chủ yếu góp bài so sánh. Bài do AI tạo.',
    category: 'antigravity',
    kind: 'digest-sources',
    groundingPublishers: ['Antigravity'],
    feeds: ANTIGRAVITY_FEEDS,
    officialLinks: ['https://antigravity.google'],
    comparisonSlugs: ['claude-code-vs-antigravity'],
  },
  {
    key: 'cuongmini',
    username: 'cuongmini', // GIỮ nguyên — khớp huy hiệu AI ở PostCard + tài khoản cũ
    displayName: 'CuongMini',
    avatar: '/images/cuongmini-avatar.svg',
    bio: 'Trợ lý AI của cuongthai.com — tổng hợp tin công nghệ & các bài so sánh. Bài viết do AI tạo tự động.',
    category: 'tech',
    kind: 'general',
    groundingPublishers: [], // dùng MỌI nguồn (giữ hành vi cũ)
    feeds: [],
    officialLinks: [],
  },
];

export const BOT_BY_KEY: Record<string, BotConfig> = Object.fromEntries(BOTS.map((b) => [b.key, b]));
/** Thứ tự ưu tiên chia khung giờ — claude-mini trước, antigravity-mini sau cùng. */
export const BOT_PRIORITY: string[] = BOTS.map((b) => b.key);
/** Username của MỌI bot — để đếm "hôm nay các bot đã đăng mấy bài" (trần chung). */
export const BOT_USERNAMES: string[] = BOTS.map((b) => b.username);

/** Lấy chủ đề so sánh theo slug (từ bảng COMPARISONS tuyển sẵn). */
export function comparisonBySlug(slug: string): ComparisonTopic | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

// ── Tài khoản bot (find-or-create, idempotent) ──────────────────────────────
export interface BotUser {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

/**
 * Lấy (hoặc tạo) tài khoản `User` cho một bot. Tổng quát hoá
 * `getCuongMiniBotUser`: không đăng nhập được (password null), tự chữa
 * displayName/avatar nếu lệch. `kind` giữ mặc định 'HUMAN' (xem cuongMiniBot.ts
 * vì sao KHÔNG dùng 'AGENT').
 */
export async function getBotUser(botKey: string): Promise<BotUser> {
  const cfg = BOT_BY_KEY[botKey];
  if (!cfg) throw new Error(`[newsBots] bot không tồn tại: ${botKey}`);

  const existing = await prisma.user.findUnique({
    where: { username: cfg.username },
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  });
  if (existing) {
    if (existing.displayName !== cfg.displayName || existing.avatarUrl !== cfg.avatar) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { displayName: cfg.displayName, avatarUrl: cfg.avatar },
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      });
    }
    return existing;
  }

  const created = await prisma.user.create({
    data: {
      username: cfg.username,
      email: `${cfg.username}-bot@agents.invalid`,
      password: null, // ⇒ không đăng nhập được
      fullName: cfg.displayName,
      displayName: cfg.displayName,
      avatarUrl: cfg.avatar,
      bio: cfg.bio,
      emailVerified: true,
      showActiveStatus: false,
      enabled: true,
    },
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  });
  logger.info('[newsBots] đã tạo tài khoản bot', { id: created.id, username: created.username });
  return created;
}

/**
 * Seed nguồn RSS của các bot vào bảng `news_feeds` (idempotent — hàng có sẵn
 * để nguyên). Nguồn best-effort (có thể 404) vẫn seed: ingest tự bỏ qua êm.
 */
export async function seedBotFeeds(): Promise<{ created: number; existing: number }> {
  let created = 0, existing = 0;
  for (const bot of BOTS) {
    for (const f of bot.feeds) {
      const found = await prisma.newsFeed.findUnique({ where: { url: f.url }, select: { id: true } });
      if (found) { existing++; continue; }
      await prisma.newsFeed.create({
        data: { name: f.name, url: f.url, publisher: f.publisher, homepage: f.homepage, topic: f.topic, weight: f.weight },
      });
      created++;
    }
  }
  if (created) logger.info('[newsBots] seed nguồn RSS của bot', { created, existing });
  return { created, existing };
}
