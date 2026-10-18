/**
 * CuongMini — LỊCH đăng (phần THUẦN, không phụ thuộc DB/LLM/ảnh).
 * ─────────────────────────────────────────────────────────────────────────
 * Tách riêng để kiểm thử được mà không kéo theo cả đồ thị phụ thuộc của
 * `cuongMiniFeed.ts` (prisma, social.service, storage…). Mọi quyết định "theo
 * ngày" đều XÁC ĐỊNH (seed từ khoá ngày) nên tái lập được và kiểm thử được.
 *
 * Năm khung giờ VN (UTC+7): 07:00 · 10:00 · 15:00 · 18:00 · 22:00.
 * Mỗi ngày đăng 2–3 bài: đúng MỘT bài tổng hợp tin (digest) + phần còn lại là
 * bài so sánh (chủ đề khác nhau trong ngày, xoay vòng theo ngày).
 */

export const SLOTS = ['07:00', '10:00', '15:00', '18:00', '22:00'] as const;
export type Slot = (typeof SLOTS)[number];

/** Giờ UTC tương ứng mỗi khung (VN = UTC+7) — để đặt cron. */
export const SLOT_CRON_UTC: Record<Slot, string> = {
  '07:00': '0 0 * * *',
  '10:00': '0 3 * * *',
  '15:00': '0 8 * * *',
  '18:00': '0 11 * * *',
  '22:00': '0 15 * * *',
};

export interface ComparisonTopic {
  slug: string;
  title: string;
  topic: string; // khớp palette ảnh bìa
  a: { name: string; url: string };
  b: { name: string; url: string };
  angle: string;
}

export const COMPARISONS: ComparisonTopic[] = [
  { slug: 'claude-code-vs-antigravity', title: 'Claude Code vs Antigravity: chọn agent coding nào?', topic: 'ai',
    a: { name: 'Claude Code', url: 'https://www.anthropic.com/claude-code' }, b: { name: 'Antigravity', url: 'https://antigravity.google' },
    angle: 'IDE/CLI agent coding: mô hình agentic loop, hệ sinh thái, phù hợp ai' },
  { slug: 'spring-boot-vs-nodejs', title: 'Spring Boot vs Node.js: chọn nền backend nào?', topic: 'backend',
    a: { name: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' }, b: { name: 'Node.js', url: 'https://nodejs.org' },
    angle: 'hiệu năng, hệ sinh thái, kiểu đồng thời, phù hợp quy mô dự án nào' },
  { slug: 'nextjs-vs-astro', title: 'Next.js vs Astro: chọn framework web nào?', topic: 'web',
    a: { name: 'Next.js', url: 'https://nextjs.org' }, b: { name: 'Astro', url: 'https://astro.build' },
    angle: 'SSR/SSG, islands, phù hợp web app vs web nội dung' },
  { slug: 'postgresql-vs-mongodb', title: 'PostgreSQL vs MongoDB: quan hệ hay tài liệu?', topic: 'database',
    a: { name: 'PostgreSQL', url: 'https://www.postgresql.org' }, b: { name: 'MongoDB', url: 'https://www.mongodb.com' },
    angle: 'mô hình dữ liệu, giao dịch, truy vấn, khi nào chọn gì' },
  { slug: 'react-vs-vue', title: 'React vs Vue: chọn thư viện UI nào?', topic: 'web',
    a: { name: 'React', url: 'https://react.dev' }, b: { name: 'Vue', url: 'https://vuejs.org' },
    angle: 'mô hình tư duy, hệ sinh thái, độ dốc học, phù hợp đội nào' },
  { slug: 'rust-vs-go', title: 'Rust vs Go: chọn ngôn ngữ hệ thống nào?', topic: 'backend',
    a: { name: 'Rust', url: 'https://www.rust-lang.org' }, b: { name: 'Go', url: 'https://go.dev' },
    angle: 'an toàn bộ nhớ, đồng thời, tốc độ phát triển, lĩnh vực phù hợp' },
  { slug: 'docker-vs-podman', title: 'Docker vs Podman: chạy container kiểu nào?', topic: 'devops',
    a: { name: 'Docker', url: 'https://www.docker.com' }, b: { name: 'Podman', url: 'https://podman.io' },
    angle: 'daemon vs rootless, tương thích, bảo mật, hệ sinh thái' },
  { slug: 'rest-vs-graphql', title: 'REST vs GraphQL: thiết kế API kiểu nào?', topic: 'backend',
    a: { name: 'REST', url: 'https://restfulapi.net' }, b: { name: 'GraphQL', url: 'https://graphql.org' },
    angle: 'over/under-fetching, caching, độ phức tạp, phù hợp loại client nào' },
  { slug: 'rag-vs-fine-tuning', title: 'RAG vs fine-tuning: dạy kiến thức cho LLM kiểu nào?', topic: 'ai',
    a: { name: 'RAG', url: 'https://www.anthropic.com/engineering' }, b: { name: 'Fine-tuning', url: 'https://platform.openai.com/docs/guides/fine-tuning' },
    angle: 'cập nhật kiến thức, chi phí, độ trễ, khi nào dùng cái nào' },
  { slug: 'llm-agents-vs-workflows', title: 'Agent vs workflow: xây hệ AI kiểu nào?', topic: 'ai',
    a: { name: 'Agent', url: 'https://www.anthropic.com/engineering/building-effective-agents' }, b: { name: 'Workflow', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
    angle: 'tự quyết vs luồng cố định, độ tin cậy, chi phí, khi nào cần agent thật' },
  { slug: 'kubernetes-vs-docker-compose', title: 'Kubernetes vs Docker Compose: điều phối kiểu nào?', topic: 'devops',
    a: { name: 'Kubernetes', url: 'https://kubernetes.io' }, b: { name: 'Docker Compose', url: 'https://docs.docker.com/compose' },
    angle: 'quy mô, độ phức tạp vận hành, khi nào cần k8s' },
  { slug: 'typescript-vs-javascript', title: 'TypeScript vs JavaScript: có nên gõ kiểu?', topic: 'web',
    a: { name: 'TypeScript', url: 'https://www.typescriptlang.org' }, b: { name: 'JavaScript', url: 'https://developer.mozilla.org/docs/Web/JavaScript' },
    angle: 'an toàn kiểu, chi phí build, năng suất đội, dự án nào nên dùng' },
  { slug: 'bun-vs-nodejs', title: 'Bun vs Node.js: runtime JavaScript nào?', topic: 'backend',
    a: { name: 'Bun', url: 'https://bun.sh' }, b: { name: 'Node.js', url: 'https://nodejs.org' },
    angle: 'tốc độ, tương thích npm, độ trưởng thành, khi nào đổi' },
  { slug: 'redis-vs-postgres-cache', title: 'Redis vs PostgreSQL: cache ở đâu?', topic: 'database',
    a: { name: 'Redis', url: 'https://redis.io' }, b: { name: 'PostgreSQL', url: 'https://www.postgresql.org' },
    angle: 'bộ nhớ vs bền vững, mẫu dùng, khi nào cần một tầng cache riêng' },
];

/** Hash xác định (FNV-1a 32-bit). */
export function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const a = [...arr];
  const rand = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Số ngày kể từ epoch, từ khoá ngày 'YYYY-MM-DD'. */
export function dayNumber(dateKey: string): number {
  const ms = Date.parse(`${dateKey}T00:00:00Z`);
  return Number.isFinite(ms) ? Math.floor(ms / 86_400_000) : 0;
}

/** Mỗi ngày đăng 2 hay 3 bài — xác định theo ngày. */
export function postsPerDay(dateKey: string): 2 | 3 {
  return hashStr(`${dateKey}|count`) % 2 === 0 ? 2 : 3;
}

export interface PlannedPost {
  slot: Slot;
  slotIndex: number;
  mode: 'digest' | 'comparison';
  comparison?: ComparisonTopic;
}

/**
 * Kế hoạch đăng của một ngày: 2–3 khung giờ, đúng MỘT bài tổng hợp (digest),
 * còn lại là bài so sánh (chủ đề KHÁC NHAU trong ngày, xoay vòng theo ngày).
 */
export function planDay(dateKey: string): PlannedPost[] {
  const n = postsPerDay(dateKey);
  const chosen = seededShuffle([0, 1, 2, 3, 4], hashStr(`${dateKey}|slots`))
    .slice(0, n)
    .sort((x, y) => x - y);
  const digestPos = hashStr(`${dateKey}|digest`) % n;

  return chosen.map((slotIndex, pos) => {
    if (pos === digestPos) {
      return { slot: SLOTS[slotIndex], slotIndex, mode: 'digest' as const };
    }
    const idx = (dayNumber(dateKey) * SLOTS.length + pos) % COMPARISONS.length;
    return { slot: SLOTS[slotIndex], slotIndex, mode: 'comparison' as const, comparison: COMPARISONS[idx] };
  });
}

/** Khung giờ này hôm nay có đăng không — trả kế hoạch của nó hoặc null. */
export function shouldPostAtSlot(dateKey: string, slot: Slot): PlannedPost | null {
  return planDay(dateKey).find((p) => p.slot === slot) ?? null;
}

/** Khoá ngày theo giờ VN: 'YYYY-MM-DD'. */
export function vnDateKey(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(d);
}

// ═══════════════════════════════════════════════════════════════════════════
// MẠNG BẢN TIN AI NHIỀU BOT — kế hoạch chia khung giờ với TRẦN CHUNG mỗi ngày.
// ─────────────────────────────────────────────────────────────────────────
// Thay "mỗi bot 2–3 bài" bằng MỘT ngân sách chung 6–8 bài/ngày cho TẤT CẢ bot.
// Phần này THUẦN (không DB/LLM) nên kiểm thử được: cùng ngày + cùng trần ⇒ cùng
// kế hoạch. Thứ tự ưu tiên chia suất: claude-mini TRƯỚC, antigravity-mini SAU
// CÙNG — nên claude-mini luôn có số bài ≥ mọi bot khác ("Claude favored").
// ═══════════════════════════════════════════════════════════════════════════

/** Thứ tự ưu tiên chia khung giờ (KHÁC thứ tự hiển thị): Claude trước nhất. */
export const NEWS_BOTS_PRIORITY = ['claude-mini', 'codex-x', 'gemini-mini', 'cuongmini', 'antigravity-mini'] as const;
export type NewsBotKey = (typeof NEWS_BOTS_PRIORITY)[number];

/** Trần số bài mỗi bot/ngày — tránh một bot chiếm hết ngân sách chung. */
export const NEWS_BOT_DAILY_MAX: Record<NewsBotKey, number> = {
  'claude-mini': 3,
  'codex-x': 2,
  'gemini-mini': 2,
  'cuongmini': 2,
  'antigravity-mini': 1,
};

export const NEWS_BOTS_CAP_MIN = 6;
export const NEWS_BOTS_CAP_MAX = 8;
export const NEWS_BOTS_CAP_DEFAULT = 7;

/** Ép trần ngày về [6, 8]; giá trị lạ ⇒ mặc định 7. */
export function clampDailyCap(n: number): number {
  if (!Number.isFinite(n)) return NEWS_BOTS_CAP_DEFAULT;
  return Math.max(NEWS_BOTS_CAP_MIN, Math.min(NEWS_BOTS_CAP_MAX, Math.round(n)));
}

/** Các kiểu bài của bot SẢN PHẨM claude-mini — xoay vòng theo ngày + seq. */
export const CLAUDE_POST_TYPES = ['upgrade', 'fix', 'promo', 'tips'] as const;
export type ClaudePostType = (typeof CLAUDE_POST_TYPES)[number];
/** Kiểu bài claude-mini cho bài thứ `seq` của ngày — quét đủ 4 kiểu theo thời gian. */
export function claudePostTypeFor(dateKey: string, seq: number): ClaudePostType {
  const base = dayNumber(dateKey) + seq;
  return CLAUDE_POST_TYPES[((base % CLAUDE_POST_TYPES.length) + CLAUDE_POST_TYPES.length) % CLAUDE_POST_TYPES.length];
}

/** Chủ đề so sánh (ai-compare) cho bài thứ `seq` của ngày — xoay vòng. */
export function comparisonForDay(dateKey: string, seq: number): ComparisonTopic {
  const idx = (((dayNumber(dateKey) * SLOTS.length + seq) % COMPARISONS.length) + COMPARISONS.length) % COMPARISONS.length;
  return COMPARISONS[idx];
}

export interface BotPlannedPost {
  slot: Slot;
  slotIndex: number;
  botKey: NewsBotKey;
  /** Thứ tự bài trong ngày của RIÊNG bot này (0-based) — để xoay kiểu bài/chủ đề. */
  seq: number;
}

/**
 * Kế hoạch đăng của NGÀY cho toàn mạng bot, với trần chung `cap` (6–8).
 *   • Chia `cap` suất theo vòng ưu tiên (claude-mini bốc trước mỗi vòng), tôn
 *     trọng trần mỗi-bot ⇒ claude-mini luôn có số bài ≥ mọi bot khác.
 *   • Dàn các bài vào 5 khung giờ: tham lam chọn khung ÍT bài nhất & sớm nhất,
 *     không để MỘT bot xuất hiện hai lần trong cùng khung.
 * XÁC ĐỊNH: cùng (ngày, cap) ⇒ cùng kết quả.
 */
export function planNewsBotsDay(dateKey: string, cap: number = NEWS_BOTS_CAP_DEFAULT): BotPlannedPost[] {
  const total = clampDailyCap(cap);

  // 1) Chia suất theo vòng ưu tiên.
  const counts: Record<string, number> = {};
  for (const k of NEWS_BOTS_PRIORITY) counts[k] = 0;
  let remaining = total;
  let guard = 0;
  const guardMax = total * NEWS_BOTS_PRIORITY.length + 10;
  while (remaining > 0 && guard++ < guardMax) {
    let gave = false;
    for (const k of NEWS_BOTS_PRIORITY) {
      if (remaining <= 0) break;
      if (counts[k] < NEWS_BOT_DAILY_MAX[k]) { counts[k]++; remaining--; gave = true; }
    }
    if (!gave) break; // mọi bot đã chạm trần
  }

  // 2) Dàn vào khung giờ.
  const queue: Array<{ botKey: NewsBotKey; seq: number }> = [];
  for (const k of NEWS_BOTS_PRIORITY) {
    for (let s = 0; s < counts[k]; s++) queue.push({ botKey: k, seq: s });
  }
  const slotCount = SLOTS.map(() => 0);
  const slotBots = SLOTS.map(() => new Set<string>());
  const planned: BotPlannedPost[] = [];
  for (const item of queue) {
    let best = -1;
    for (let i = 0; i < SLOTS.length; i++) {
      if (slotBots[i].has(item.botKey)) continue;        // không trùng bot trong khung
      if (best === -1 || slotCount[i] < slotCount[best]) best = i; // ít nhất, sớm nhất
    }
    if (best === -1) best = 0; // an toàn (không xảy ra khi mỗi bot ≤ 5 bài)
    slotCount[best]++;
    slotBots[best].add(item.botKey);
    planned.push({ slot: SLOTS[best], slotIndex: best, botKey: item.botKey, seq: item.seq });
  }

  // Sắp theo khung giờ rồi theo ưu tiên để caller chạy tuần tự, Claude trước.
  planned.sort((a, b) =>
    a.slotIndex - b.slotIndex ||
    NEWS_BOTS_PRIORITY.indexOf(a.botKey) - NEWS_BOTS_PRIORITY.indexOf(b.botKey));
  return planned;
}

/** Danh sách bài đã lên kế hoạch cho MỘT khung giờ (đã sắp theo ưu tiên). */
export function newsBotsAtSlot(dateKey: string, slot: Slot, cap: number = NEWS_BOTS_CAP_DEFAULT): BotPlannedPost[] {
  return planNewsBotsDay(dateKey, cap).filter((p) => p.slot === slot);
}
