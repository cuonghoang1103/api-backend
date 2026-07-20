/**
 * News ingestion — pull official RSS/Atom feeds into `news_items`.
 *
 * This is the grounding layer for the AI bulletin. The model is never asked
 * "what happened in tech today"; it is handed a list of real entries with real
 * URLs and real timestamps and told to work only from those. Everything that
 * makes a bulletin trustworthy — the link out, the publisher name, the "3 hours
 * ago" — comes from this table, not from the model.
 */
import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { parseFeed, normaliseUrl, type FeedEntry } from './rss.js';

const FETCH_TIMEOUT_MS = 12_000;
const MAX_ENTRIES_PER_FEED = 40;
const MAX_PER_PUBLISHER = 2;
const MIN_VIABLE_ITEMS = 5;
const USER_AGENT = 'cuongthai.com news reader (+https://cuongthai.com/tech-trends/news)';

/**
 * First-party feeds only. A bulletin's value is that it links the announcement
 * itself, so aggregators and opinion blogs are deliberately absent — with one
 * exception, Hacker News' front page, which is used purely as a signal of what
 * developers are reading (its entries link out to the original source anyway).
 */
// Note: Anthropic publishes no public RSS endpoint (every documented path 404s
// as of 2026-07), so it is intentionally absent rather than failing daily.
export const DEFAULT_FEEDS: Array<{
  name: string; url: string; publisher: string; homepage: string; topic: string; weight: number;
}> = [
  { name: 'GitHub Blog',            url: 'https://github.blog/feed/',                                    publisher: 'GitHub',        homepage: 'https://github.blog',            topic: 'devtools', weight: 80 },
  { name: 'GitHub Changelog',       url: 'https://github.blog/changelog/feed/',                          publisher: 'GitHub',        homepage: 'https://github.blog/changelog',  topic: 'devtools', weight: 75 },
  { name: 'Node.js Blog',           url: 'https://nodejs.org/en/feed/blog.xml',                          publisher: 'Node.js',       homepage: 'https://nodejs.org/en/blog',     topic: 'backend',  weight: 85 },
  { name: 'Vercel Changelog',       url: 'https://vercel.com/atom',                                      publisher: 'Vercel',        homepage: 'https://vercel.com/changelog',   topic: 'web',      weight: 70 },
  { name: 'Chrome for Developers',  url: 'https://developer.chrome.com/static/blog/feed.xml',            publisher: 'Google',        homepage: 'https://developer.chrome.com',   topic: 'web',      weight: 80 },
  { name: 'Google Developers',      url: 'https://blog.google/technology/developers/rss/',                publisher: 'Google',        homepage: 'https://blog.google/technology/developers', topic: 'ai', weight: 80 },
  { name: 'AWS News Blog',          url: 'https://aws.amazon.com/blogs/aws/feed/',                       publisher: 'AWS',           homepage: 'https://aws.amazon.com/blogs/aws', topic: 'cloud',  weight: 75 },
  { name: 'Microsoft DevBlogs',     url: 'https://devblogs.microsoft.com/feed/',                         publisher: 'Microsoft',     homepage: 'https://devblogs.microsoft.com', topic: 'devtools', weight: 70 },
  { name: 'OpenAI News',            url: 'https://openai.com/news/rss.xml',                              publisher: 'OpenAI',        homepage: 'https://openai.com/news',        topic: 'ai',       weight: 90 },
  { name: 'Rust Blog',              url: 'https://blog.rust-lang.org/feed.xml',                          publisher: 'Rust',          homepage: 'https://blog.rust-lang.org',     topic: 'backend',  weight: 75 },
  { name: 'Go Blog',                url: 'https://go.dev/blog/feed.atom',                                publisher: 'Go',            homepage: 'https://go.dev/blog',            topic: 'backend',  weight: 75 },
  { name: 'Cloudflare Blog',        url: 'https://blog.cloudflare.com/rss/',                             publisher: 'Cloudflare',    homepage: 'https://blog.cloudflare.com',    topic: 'cloud',    weight: 70 },
  { name: 'Deno Blog',              url: 'https://deno.com/feed',                                        publisher: 'Deno',          homepage: 'https://deno.com/blog',          topic: 'backend',  weight: 60 },
  { name: 'Docker Blog',            url: 'https://www.docker.com/blog/feed/',                            publisher: 'Docker',        homepage: 'https://www.docker.com/blog',    topic: 'devops',   weight: 65 },
  { name: 'Kubernetes Blog',        url: 'https://kubernetes.io/feed.xml',                               publisher: 'Kubernetes',    homepage: 'https://kubernetes.io/blog',     topic: 'devops',   weight: 70 },
  { name: 'PostgreSQL News',        url: 'https://www.postgresql.org/news.rss',                          publisher: 'PostgreSQL',    homepage: 'https://www.postgresql.org/about/newsarchive', topic: 'database', weight: 70 },
  { name: 'React Blog',             url: 'https://react.dev/rss.xml',                                    publisher: 'React',         homepage: 'https://react.dev/blog',         topic: 'web',      weight: 85 },
  { name: 'TypeScript DevBlog',     url: 'https://devblogs.microsoft.com/typescript/feed/',              publisher: 'Microsoft',     homepage: 'https://devblogs.microsoft.com/typescript', topic: 'web', weight: 80 },
  { name: 'Hacker News Front Page', url: 'https://hnrss.org/frontpage?points=200',                       publisher: 'Hacker News',   homepage: 'https://news.ycombinator.com',   topic: 'general',  weight: 25 },
];

export function hashUrl(url: string): string {
  return crypto.createHash('sha256').update(normaliseUrl(url)).digest('hex');
}

/** Insert the default feed registry. Idempotent — existing rows are left alone. */
export async function seedDefaultFeeds(): Promise<{ created: number; existing: number }> {
  let created = 0, existing = 0;
  for (const f of DEFAULT_FEEDS) {
    const found = await prisma.newsFeed.findUnique({ where: { url: f.url }, select: { id: true } });
    if (found) { existing++; continue; }
    await prisma.newsFeed.create({ data: f });
    created++;
  }
  return { created, existing };
}

async function fetchFeed(url: string): Promise<FeedEntry[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.text();
    return parseFeed(body).slice(0, MAX_ENTRIES_PER_FEED);
  } finally {
    clearTimeout(timer);
  }
}

export interface IngestResult {
  feeds: number;
  ok: number;
  failed: number;
  itemsNew: number;
  itemsSeen: number;
  errors: Array<{ feed: string; error: string }>;
}

/**
 * Fetch every active feed and store entries we have not seen before.
 * One broken feed must not stop the run — a source that changed its URL should
 * degrade the bulletin, not cancel it.
 */
export async function ingestAllFeeds(opts: { maxAgeHours?: number } = {}): Promise<IngestResult> {
  const maxAgeHours = opts.maxAgeHours ?? 168;   // 7 days: official blogs post weekly
  const cutoff = new Date(Date.now() - maxAgeHours * 3600_000);
  const feeds = await prisma.newsFeed.findMany({ where: { isActive: true } });
  const result: IngestResult = { feeds: feeds.length, ok: 0, failed: 0, itemsNew: 0, itemsSeen: 0, errors: [] };

  for (const feed of feeds) {
    try {
      const entries = await fetchFeed(feed.url);
      for (const e of entries) {
        result.itemsSeen++;
        // Undated entries are common in changelog feeds; treat them as "now"
        // for freshness but never let them crowd out a dated item (see scoring).
        if (e.publishedAt && e.publishedAt < cutoff) continue;
        const urlHash = hashUrl(e.url);
        const existing = await prisma.newsItem.findUnique({ where: { urlHash }, select: { id: true } });
        if (existing) continue;
        await prisma.newsItem.create({
          data: {
            feedId: feed.id,
            title: e.title.slice(0, 500),
            url: e.url.slice(0, 1000),
            urlHash,
            summary: e.summary,
            author: e.author?.slice(0, 200) ?? null,
            imageUrl: e.imageUrl?.slice(0, 1000) ?? null,
            publishedAt: e.publishedAt,
          },
        });
        result.itemsNew++;
      }
      await prisma.newsFeed.update({ where: { id: feed.id }, data: { lastFetchAt: new Date(), lastError: null } });
      result.ok++;
    } catch (err) {
      const msg = (err as Error).message?.slice(0, 500) ?? 'unknown error';
      result.failed++;
      result.errors.push({ feed: feed.name, error: msg });
      await prisma.newsFeed.update({ where: { id: feed.id }, data: { lastFetchAt: new Date(), lastError: msg } })
        .catch(() => undefined);
      logger.warn('news feed fetch failed', { feed: feed.name, error: msg });
    }
  }
  logger.info('news ingest complete', { ...result });
  return result;
}

export interface CandidateItem {
  id: number;
  title: string;
  url: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
  publisher: string;
  topic: string | null;
  score: number;
}

/**
 * Pick the freshest unused items, best first.
 *
 * Score = source weight + a recency bonus that decays over the window. Items
 * without a date sit below dated ones of the same source, because "we don't
 * know when this happened" is a real quality difference for a news bulletin.
 */
export async function selectCandidates(opts: { limit?: number; windowHours?: number } = {}): Promise<CandidateItem[]> {
  const limit = opts.limit ?? 12;
  const windowHours = opts.windowHours ?? 96;    // 4 days of candidates to choose from
  const since = new Date(Date.now() - windowHours * 3600_000);

  const rows = await prisma.newsItem.findMany({
    where: {
      usedInArticleId: null,
      OR: [{ publishedAt: { gte: since } }, { publishedAt: null, fetchedAt: { gte: since } }],
    },
    include: { feed: { select: { publisher: true, topic: true, weight: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 200,
  });

  const now = Date.now();
  const seenTitles = new Set<string>();
  const scored: CandidateItem[] = [];

  for (const r of rows) {
    // The same release gets announced by several publishers; keep the first
    // (highest-scoring) wording and drop near-identical repeats.
    const key = r.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').slice(0, 8).join(' ');
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);

    const ts = r.publishedAt?.getTime() ?? null;
    const ageHours = ts === null ? windowHours : Math.max(0, (now - ts) / 3600_000);
    const recency = Math.max(0, 40 * (1 - ageHours / windowHours));
    const undatedPenalty = ts === null ? 15 : 0;

    scored.push({
      id: r.id,
      title: r.title,
      url: r.url,
      summary: r.summary,
      imageUrl: r.imageUrl,
      publishedAt: r.publishedAt,
      publisher: r.feed.publisher,
      topic: r.feed.topic,
      score: Math.round(r.feed.weight + recency - undatedPenalty),
    });
  }

  scored.sort((a, b) => b.score - a.score);

  // Cap how much of a bulletin any one publisher can occupy. Without this a
  // single high-volume feed on a busy day (Hacker News, a changelog that ships
  // ten entries at once) crowds out every other source and the "bản tin" stops
  // being a survey of the day. Anything trimmed still stays in the pool for
  // tomorrow — nothing is discarded, only deferred.
  const perPublisher = new Map<string, number>();
  const balanced: CandidateItem[] = [];
  const overflow: CandidateItem[] = [];
  for (const item of scored) {
    const used = perPublisher.get(item.publisher) ?? 0;
    if (used < MAX_PER_PUBLISHER) {
      perPublisher.set(item.publisher, used + 1);
      balanced.push(item);
    } else {
      overflow.push(item);
    }
    if (balanced.length >= limit) break;
  }
  // On a quiet day, top up past the cap only far enough to make a bulletin
  // viable. Filling all the way to `limit` would undo the cap completely —
  // that is how a run ended up as eight consecutive Hacker News links.
  const floor = Math.min(limit, MIN_VIABLE_ITEMS);
  if (balanced.length < floor) balanced.push(...overflow.slice(0, floor - balanced.length));
  return balanced;
}

/** Mark the items a bulletin consumed so tomorrow's run does not repeat them. */
export async function markItemsUsed(itemIds: number[], articleId: number): Promise<void> {
  if (!itemIds.length) return;
  await prisma.newsItem.updateMany({
    where: { id: { in: itemIds } },
    data: { usedInArticleId: articleId, usedAt: new Date() },
  });
}
