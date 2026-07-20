/**
 * Web analytics — recording page views and aggregating them for the admin.
 *
 * Two decisions worth stating, because both are easy to get wrong in a way
 * that produces confident but false numbers:
 *
 * 1. **Bots are recorded, then excluded.** Crawlers are a large share of any
 *    public site's traffic. Dropping them at write time makes a spike
 *    unexplainable later; counting them makes every number a lie. So the row is
 *    kept with `isBot`, and every aggregate filters on it by default.
 *
 * 2. **A "visitor" is a session, not a request.** Counting rows would report a
 *    single person reading five pages as five visitors. Uniques are computed
 *    over distinct `sessionId`, which is the closest honest approximation
 *    available without tracking people across visits.
 */
import { prisma } from '../config/database.js';

/** Substrings that appear in crawler user-agents. Deliberately broad. */
const BOT_UA = /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|curl|wget|python-requests|axios|go-http|java\/|okhttp|scrapy|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|perplexity/i;

export function isBotUserAgent(ua: string | undefined): boolean {
  if (!ua || ua.trim().length < 8) return true;   // no/─short UA is almost always automation
  return BOT_UA.test(ua);
}

export function deviceFromUserAgent(ua: string | undefined): 'mobile' | 'tablet' | 'desktop' {
  if (!ua) return 'desktop';
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile';
  return 'desktop';
}

/** Strip query strings and ids so `/profile/12` and `/profile/34` aggregate together. */
export function normalisePath(raw: string): string {
  let p = String(raw || '/').split('?')[0].split('#')[0].trim() || '/';
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  // Collapse numeric segments — otherwise the "top pages" table is a list of
  // one-hit article ids instead of the pages that actually matter.
  p = p.replace(/\/\d+(?=\/|$)/g, '/:id');
  return p.slice(0, 500);
}

export interface RecordInput {
  path: string;
  title?: string | null;
  referrer?: string | null;
  sessionId: string;
  userId?: number | null;
  userAgent?: string;
}

export async function recordPageView(input: RecordInput): Promise<void> {
  const sessionId = String(input.sessionId || '').slice(0, 64);
  if (!sessionId) return;                    // nothing useful to record
  await prisma.pageView.create({
    data: {
      path: normalisePath(input.path),
      title: input.title ? String(input.title).slice(0, 300) : null,
      referrer: input.referrer ? String(input.referrer).slice(0, 500) : null,
      sessionId,
      userId: input.userId ?? null,
      device: deviceFromUserAgent(input.userAgent),
      isBot: isBotUserAgent(input.userAgent),
    },
  });
}

function since(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export interface Overview {
  today: { views: number; visitors: number };
  yesterday: { views: number; visitors: number };
  last7d: { views: number; visitors: number };
  last30d: { views: number; visitors: number };
  /** Distinct sessions seen in the last 5 minutes — the "online now" number. */
  online: number;
  botShare: number;
}

async function countPair(from: Date, to?: Date) {
  const where = { isBot: false, createdAt: to ? { gte: from, lt: to } : { gte: from } };
  const [views, sessions] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.findMany({ where, select: { sessionId: true }, distinct: ['sessionId'] }),
  ]);
  return { views, visitors: sessions.length };
}

export async function getOverview(): Promise<Overview> {
  const startToday = since(0);
  const startYesterday = since(1);
  const fiveMinAgo = new Date(Date.now() - 5 * 60_000);

  const [today, yesterday, last7d, last30d, onlineRows, botCount, allCount] = await Promise.all([
    countPair(startToday),
    countPair(startYesterday, startToday),
    countPair(since(6)),
    countPair(since(29)),
    prisma.pageView.findMany({
      where: { isBot: false, createdAt: { gte: fiveMinAgo } },
      select: { sessionId: true }, distinct: ['sessionId'],
    }),
    prisma.pageView.count({ where: { isBot: true, createdAt: { gte: since(6) } } }),
    prisma.pageView.count({ where: { createdAt: { gte: since(6) } } }),
  ]);

  return {
    today, yesterday, last7d, last30d,
    online: onlineRows.length,
    botShare: allCount ? Math.round((botCount / allCount) * 100) : 0,
  };
}

/** Views + unique sessions per day, oldest first — drives the chart. */
export async function getDailySeries(days = 30) {
  const rows = await prisma.$queryRaw<Array<{ day: Date; views: bigint; visitors: bigint }>>`
    SELECT date_trunc('day', "created_at") AS day,
           count(*)                        AS views,
           count(DISTINCT "session_id")    AS visitors
    FROM "page_views"
    WHERE "is_bot" = false AND "created_at" >= ${since(days - 1)}
    GROUP BY 1 ORDER BY 1 ASC`;
  return rows.map((r) => ({
    day: r.day.toISOString().slice(0, 10),
    views: Number(r.views),
    visitors: Number(r.visitors),
  }));
}

export async function getTopPages(days = 7, limit = 20) {
  const rows = await prisma.$queryRaw<Array<{ path: string; views: bigint; visitors: bigint }>>`
    SELECT "path",
           count(*)                     AS views,
           count(DISTINCT "session_id") AS visitors
    FROM "page_views"
    WHERE "is_bot" = false AND "created_at" >= ${since(days - 1)}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`;
  return rows.map((r) => ({ path: r.path, views: Number(r.views), visitors: Number(r.visitors) }));
}

export async function getBreakdown(days = 7) {
  const [devices, referrers] = await Promise.all([
    prisma.$queryRaw<Array<{ device: string | null; n: bigint }>>`
      SELECT "device", count(*) AS n FROM "page_views"
      WHERE "is_bot" = false AND "created_at" >= ${since(days - 1)}
      GROUP BY 1 ORDER BY 2 DESC`,
    prisma.$queryRaw<Array<{ host: string | null; n: bigint }>>`
      SELECT CASE
               WHEN "referrer" IS NULL OR "referrer" = '' THEN 'direct'
               ELSE split_part(split_part("referrer", '://', 2), '/', 1)
             END AS host,
             count(*) AS n
      FROM "page_views"
      WHERE "is_bot" = false AND "created_at" >= ${since(days - 1)}
      GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
  ]);
  return {
    devices: devices.map((d) => ({ device: d.device ?? 'unknown', views: Number(d.n) })),
    referrers: referrers.map((r) => ({ host: r.host || 'direct', views: Number(r.n) })),
  };
}

/** The last N views, newest first — the live ticker. */
export async function getRecent(limit = 30) {
  return prisma.pageView.findMany({
    where: { isBot: false },
    orderBy: { createdAt: 'desc' },
    take: Math.min(100, limit),
    select: { path: true, title: true, device: true, createdAt: true, userId: true },
  });
}
