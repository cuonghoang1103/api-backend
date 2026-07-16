import { getServerApiBaseUrl } from '@/lib/server-api';

/**
 * RSS 2.0 feed for /tech-trends. Served at /tech-trends/rss.xml.
 *
 * Runs at request time against the INTERNAL backend (like sitemap.ts) so it's
 * always current and never fails the build. Fail-open: if the API is down we
 * still return a valid (empty-item) feed rather than a 500.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface FeedArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string | null;
  createdAt: string;
  author?: { displayName?: string | null; fullName?: string | null; username?: string | null } | null;
}

function xmlEscape(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchArticles(): Promise<FeedArticle[]> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/tech-trends/articles?size=50`, {
      headers: { accept: 'application/json', 'User-Agent': 'cuongthai-rss/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? (json.data as FeedArticle[]) : [];
  } catch {
    return [];
  }
}

export async function GET(): Promise<Response> {
  const articles = await fetchArticles();

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/tech-trends/${a.slug}`;
      const date = new Date(a.publishedAt || a.createdAt || Date.now()).toUTCString();
      const author = a.author?.displayName || a.author?.fullName || a.author?.username || 'CuongThai';
      return [
        '    <item>',
        `      <title>${xmlEscape(a.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <description>${xmlEscape(a.summary)}</description>`,
        `      <category>${xmlEscape(a.category)}</category>`,
        `      <dc:creator>${xmlEscape(author)}</dc:creator>`,
        `      <pubDate>${date}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tech Trends &amp; Insights | CuongThai</title>
    <link>${SITE_URL}/tech-trends</link>
    <atom:link href="${SITE_URL}/tech-trends/rss.xml" rel="self" type="application/rss+xml" />
    <description>Tech news, bug-fix post-mortems, interview experiences, and architecture deep-dives.</description>
    <language>vi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
