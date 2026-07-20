/**
 * Minimal RSS 2.0 / Atom reader.
 *
 * Deliberately dependency-free: the Docker build has bitten this project before
 * when a new package needed system libs, and what we need here is small and
 * well-specified — pull <item>/<entry> nodes out of a feed and read a handful of
 * fields. Anything we cannot parse is skipped rather than guessed at, because a
 * malformed entry must never become a published news claim.
 */

export interface FeedEntry {
  title: string;
  url: string;
  summary: string | null;
  author: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ldquo: '"', rdquo: '"', lsquo: '‘', rsquo: '’',
  mdash: '—', ndash: '–', hellip: '…', trade: '™',
};

export function decodeEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

function safeCodePoint(n: number): string {
  return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
}

/** Strip tags and collapse whitespace — feed summaries arrive as escaped HTML. */
export function stripHtml(input: string, maxLen = 1200): string {
  const text = decodeEntities(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

function unwrap(raw: string): string {
  const cdata = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return decodeEntities((cdata ? cdata[1] : raw).trim());
}

/** First matching child tag's inner text, namespace-tolerant (`dc:creator`). */
function tagText(xml: string, ...names: string[]): string | null {
  for (const name of names) {
    const re = new RegExp(`<(?:[a-z0-9]+:)?${name}(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[a-z0-9]+:)?${name}>`, 'i');
    const m = xml.match(re);
    if (m) {
      const v = unwrap(m[1]).trim();
      if (v) return v;
    }
    // Self-closing with the value in an attribute, e.g. <media:content url="...">
    const selfRe = new RegExp(`<(?:[a-z0-9]+:)?${name}(\\s[^>]*)/?>`, 'i');
    const sm = xml.match(selfRe);
    if (sm) {
      const url = attr(sm[1], 'url') || attr(sm[1], 'href');
      if (url) return url;
    }
  }
  return null;
}

function attr(fragment: string, name: string): string | null {
  const m = fragment.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'))
    || fragment.match(new RegExp(`${name}\\s*=\\s*'([^']*)'`, 'i'));
  return m ? decodeEntities(m[1]).trim() : null;
}

/**
 * Atom links are `<link rel="alternate" href="…"/>`; RSS links are plain text.
 * Prefer the alternate/self HTML link and ignore `rel="replies"` and friends.
 */
function extractLink(block: string): string | null {
  const plain = block.match(/<link(?:\s[^>]*)?>([^<]+)<\/link>/i);
  if (plain && plain[1].trim()) return decodeEntities(plain[1].trim());

  const linkTags = block.match(/<link\s[^>]*\/?>/gi) ?? [];
  let fallback: string | null = null;
  for (const tag of linkTags) {
    const href = attr(tag, 'href');
    if (!href) continue;
    const rel = (attr(tag, 'rel') || 'alternate').toLowerCase();
    const type = (attr(tag, 'type') || 'text/html').toLowerCase();
    if (rel === 'alternate' && type.includes('html')) return href;
    if (!fallback) fallback = href;
  }
  return fallback;
}

function extractImage(block: string): string | null {
  const enclosure = block.match(/<enclosure\s[^>]*>/i);
  if (enclosure) {
    const type = (attr(enclosure[0], 'type') || '').toLowerCase();
    const url = attr(enclosure[0], 'url');
    if (url && type.startsWith('image/')) return url;
  }
  const media = tagText(block, 'thumbnail', 'content');
  if (media && /^https?:\/\//i.test(media) && /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(media)) return media;

  // Last resort: the first <img> inside the HTML description.
  const desc = block.match(/<(?:description|summary|content)(?:\s[^>]*)?>([\s\S]*?)<\/(?:description|summary|content)>/i);
  if (desc) {
    const img = unwrap(desc[1]).match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
    if (img && /^https?:\/\//i.test(img[1])) return img[1];
  }
  return null;
}

function parseDate(raw: string | null): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  // A feed dated in the future is a clock/timezone bug somewhere upstream;
  // treating it as "now" would let it outrank genuinely fresh items forever.
  return d.getTime() > Date.now() + 24 * 60 * 60 * 1000 ? null : d;
}

/** Parse a feed document into entries. Never throws on malformed input. */
export function parseFeed(xml: string): FeedEntry[] {
  const blocks = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi) ?? [];
  const out: FeedEntry[] = [];

  for (const block of blocks) {
    const title = tagText(block, 'title');
    const url = extractLink(block);
    if (!title || !url || !/^https?:\/\//i.test(url)) continue;   // unusable without both

    const rawSummary = tagText(block, 'description', 'summary', 'content');
    out.push({
      title: stripHtml(title, 300),
      url,
      summary: rawSummary ? stripHtml(rawSummary) : null,
      author: tagText(block, 'creator', 'author', 'name'),
      imageUrl: extractImage(block),
      publishedAt: parseDate(tagText(block, 'pubDate', 'published', 'updated', 'date')),
    });
  }
  return out;
}

/**
 * Normalise a URL for dedupe: drop the fragment and the tracking query params
 * that make one announcement look like five different links.
 */
export function normaliseUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|ref$|ref_|source$|fbclid$|gclid$|mc_cid$|mc_eid$)/i.test(key)) u.searchParams.delete(key);
    }
    u.hostname = u.hostname.replace(/^www\./i, '').toLowerCase();
    if (u.pathname.length > 1 && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch {
    return raw.trim();
  }
}
