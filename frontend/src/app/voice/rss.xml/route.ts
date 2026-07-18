import { getServerApiBaseUrl } from '@/lib/server-api';

/**
 * RSS 2.0 feed for /voice. Served at /voice/rss.xml.
 *
 * Runs at request time against the INTERNAL backend so it's always current and
 * never fails the build. Fail-open: if the API is down we still return a valid
 * (empty-item) feed rather than a 500.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface FeedPost {
  slug: string;
  title: string;
  summary: string | null;
  type: string;
  publishedAt: string | null;
  author?: { displayName?: string | null; fullName?: string | null; username?: string | null } | null;
}

const TYPE_LABEL: Record<string, string> = {
  VLOG: 'Vlog', REACTION: 'Reaction', CODE_EXP: 'Kinh nghiệm code', PODCAST: 'Podcast', TUTORIAL: 'Tutorial',
};

function xmlEscape(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchPosts(): Promise<FeedPost[]> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/voice?size=50`, {
      headers: { accept: 'application/json', 'User-Agent': 'cuongthai-rss/1.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data?.posts) ? (json.data.posts as FeedPost[]) : [];
  } catch {
    return [];
  }
}

export async function GET(): Promise<Response> {
  const posts = await fetchPosts();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/voice/${p.slug}`;
      const date = new Date(p.publishedAt || Date.now()).toUTCString();
      const author = p.author?.displayName || p.author?.fullName || p.author?.username || 'CuongThai';
      return [
        '    <item>',
        `      <title>${xmlEscape(p.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <description>${xmlEscape(p.summary || '')}</description>`,
        `      <category>${xmlEscape(TYPE_LABEL[p.type] || p.type)}</category>`,
        `      <dc:creator>${xmlEscape(author)}</dc:creator>`,
        `      <pubDate>${date}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Voice — Vlog, Reaction &amp; Kinh nghiệm code | CuongThai</title>
    <link>${SITE_URL}/voice</link>
    <atom:link href="${SITE_URL}/voice/rss.xml" rel="self" type="application/rss+xml" />
    <description>Vlog, reaction, kinh nghiệm lập trình và podcast từ Cuong Hoang.</description>
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
