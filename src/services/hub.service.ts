// ─── Hub — Personal Bookmark Manager (service layer) ──────────────
//
// All Hub endpoints follow the same pattern: userId is taken from
// req.userId (set by the authenticate middleware), and every query
// includes `userId` in its WHERE clause. The frontend never needs
// to send userId — that's the only way to guarantee a hostile
// client can't read or mutate another user's data.
//
// Scrape uses Node 20's built-in `fetch` (no extra dependency) and
// regex-based meta parsing. The regex approach is "good enough" for
// 95% of sites because Open Graph markup is repetitive; we only fall
// back to <title>/<meta name=description> when og:* tags are absent.

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { nanoid } from 'nanoid';

// ─── Folder CRUD ────────────────────────────────────────────

export async function listFolders(userId: number) {
  return prisma.hubFolder.findMany({
    where: { userId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { links: true } } },
  });
}

export async function createFolder(
  userId: number,
  data: { name: string; icon?: string | null; sortOrder?: number },
) {
  const name = data.name.trim();
  if (name.length === 0 || name.length > 100) {
    throw new AppError('Ten thu muc 1-100 ky tu', 400, 'INVALID_NAME');
  }
  if (data.icon != null && data.icon.length > 500) {
    throw new AppError('Icon qua dai (max 500 ky tu)', 400, 'INVALID_ICON');
  }
  return prisma.hubFolder.create({
    data: {
      userId,
      name,
      icon: data.icon ?? null,
      sortOrder: typeof data.sortOrder === 'number' ? Math.floor(data.sortOrder) : 0,
    },
    include: { _count: { select: { links: true } } },
  });
}

export async function updateFolder(
  userId: number,
  id: number,
  data: { name?: string; icon?: string | null; sortOrder?: number },
) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) {
    const name = String(data.name).trim();
    if (name.length === 0 || name.length > 100) {
      throw new AppError('Ten thu muc 1-100 ky tu', 400, 'INVALID_NAME');
    }
    updateData.name = name;
  }
  if (data.icon !== undefined) {
    if (data.icon != null && String(data.icon).length > 500) {
      throw new AppError('Icon qua dai (max 500 ky tu)', 400, 'INVALID_ICON');
    }
    updateData.icon = data.icon;
  }
  if (data.sortOrder !== undefined) {
    if (typeof data.sortOrder !== 'number') {
      throw new AppError('sortOrder phai la so', 400, 'INVALID_SORT');
    }
    updateData.sortOrder = Math.floor(data.sortOrder);
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Khong co truong hop le de cap nhat', 400, 'EMPTY_UPDATE');
  }
  // updateMany + userId in WHERE → can't touch someone else's folder
  const result = await prisma.hubFolder.updateMany({
    where: { id, userId },
    data: updateData,
  });
  if (result.count === 0) {
    throw new AppError('Folder khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return prisma.hubFolder.findUnique({
    where: { id },
    include: { _count: { select: { links: true } } },
  });
}

export async function deleteFolder(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  // Links keep existing with folderId = NULL (ON DELETE SET NULL).
  // The deleteMany + userId in WHERE is the cross-tenant guard.
  const result = await prisma.hubFolder.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    throw new AppError('Folder khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return { id, deleted: true };
}

// ─── Link CRUD ──────────────────────────────────────────────

export type ListLinksOpts = {
  folderId?: number | null | 'all';
  keyword?: string;
  page?: number;
  pageSize?: number;
};

export async function listLinks(userId: number, opts: ListLinksOpts) {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(opts.pageSize ?? 50)));

  // folderId semantics:
  //   - undefined / 'all'  → all links
  //   - null               → links with NO folder (unsorted)
  //   - number             → links in that folder
  const folderFilter = (() => {
    if (opts.folderId === undefined || opts.folderId === 'all') return {};
    if (opts.folderId === null) return { folderId: null };
    return { folderId: opts.folderId };
  })();

  const keyword = opts.keyword?.trim();
  const keywordFilter = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' as const } },
          { notes: { contains: keyword, mode: 'insensitive' as const } },
          { tags: { has: keyword } },
          { url: { contains: keyword, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const where = {
    userId,
    ...folderFilter,
    ...keywordFilter,
  };

  const [items, total] = await Promise.all([
    prisma.hubLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.hubLink.count({ where }),
  ]);

  return {
    items: items.map(serializeLink),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createLink(
  userId: number,
  data: {
    folderId?: number | null;
    url: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
  },
) {
  const url = String(data.url ?? '').trim();
  if (!url) throw new AppError('url la bat buoc', 400, 'MISSING_URL');
  if (url.length > 2000) throw new AppError('url qua dai (max 2000 ky tu)', 400, 'URL_TOO_LONG');
  try {
    new URL(url);
  } catch {
    throw new AppError('url khong hop le (phai la http/https)', 400, 'INVALID_URL');
  }

  const title = String(data.title ?? '').trim();
  if (!title) throw new AppError('title la bat buoc', 400, 'MISSING_TITLE');
  if (title.length > 500) throw new AppError('title qua dai (max 500 ky tu)', 400, 'TITLE_TOO_LONG');

  if (data.folderId != null) {
    await assertFolderOwnership(userId, data.folderId);
  }

  const tags = normalizeTags(data.tags);

  // isPublic = true → generate a unique publicSlug.
  // isPublic = false → keep slug null (saves a UNIQUE constraint slot).
  const wantsPublic = data.isPublic === true;

  return prisma.hubLink.create({
    data: {
      userId,
      folderId: data.folderId ?? null,
      url,
      title,
      description: data.description?.trim() || null,
      thumbnailUrl: data.thumbnailUrl?.trim() || null,
      faviconUrl: data.faviconUrl?.trim() || null,
      notes: data.notes?.trim() || null,
      tags,
      isPublic: wantsPublic,
      publicSlug: wantsPublic ? await uniquePublicSlug() : null,
    },
  });
}

export async function updateLink(
  userId: number,
  id: number,
  data: {
    folderId?: number | null;
    url?: string;
    title?: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
  },
) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const updateData: Record<string, unknown> = {};
  if (data.url !== undefined) {
    const url = String(data.url).trim();
    if (!url) throw new AppError('url khong duoc rong', 400, 'INVALID_URL');
    if (url.length > 2000) throw new AppError('url qua dai', 400, 'URL_TOO_LONG');
    try {
      new URL(url);
    } catch {
      throw new AppError('url khong hop le', 400, 'INVALID_URL');
    }
    updateData.url = url;
  }
  if (data.title !== undefined) {
    const title = String(data.title).trim();
    if (!title) throw new AppError('title khong duoc rong', 400, 'MISSING_TITLE');
    if (title.length > 500) throw new AppError('title qua dai', 400, 'TITLE_TOO_LONG');
    updateData.title = title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description == null ? null : String(data.description).trim() || null;
  }
  if (data.thumbnailUrl !== undefined) {
    updateData.thumbnailUrl = data.thumbnailUrl == null
      ? null
      : String(data.thumbnailUrl).trim() || null;
  }
  if (data.faviconUrl !== undefined) {
    updateData.faviconUrl = data.faviconUrl == null
      ? null
      : String(data.faviconUrl).trim() || null;
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes == null ? null : String(data.notes).trim() || null;
  }
  if (data.tags !== undefined) {
    updateData.tags = normalizeTags(data.tags);
  }
  if (data.folderId !== undefined) {
    if (data.folderId == null) {
      updateData.folderId = null;
    } else {
      await assertFolderOwnership(userId, data.folderId);
      updateData.folderId = data.folderId;
    }
  }
  if (data.isPublic !== undefined) {
    const wantsPublic = data.isPublic === true;
    updateData.isPublic = wantsPublic;
    // Regenerate slug when transitioning to public; clear when going private.
    if (wantsPublic) {
      const existing = await prisma.hubLink.findFirst({
        where: { id, userId },
        select: { publicSlug: true },
      });
      if (!existing) {
        throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
      }
      updateData.publicSlug = existing.publicSlug ?? (await uniquePublicSlug());
    } else {
      updateData.publicSlug = null;
    }
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Khong co truong hop le de cap nhat', 400, 'EMPTY_UPDATE');
  }

  const result = await prisma.hubLink.updateMany({
    where: { id, userId },
    data: updateData,
  });
  if (result.count === 0) {
    throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return prisma.hubLink.findUnique({ where: { id } });
}

export async function deleteLink(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const result = await prisma.hubLink.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return { id, deleted: true };
}

// ─── Scrape ─────────────────────────────────────────────────

export type ScrapeResult = {
  url: string;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  faviconUrl: string | null;
  siteName: string | null;
};

const SCRAPE_TIMEOUT_MS = 8000;
const SCRAPE_MAX_BYTES = 2 * 1024 * 1024; // 2MB cap — we only need the head of the HTML
const MAX_REDIRECTS = 5;

/**
 * Fetch a URL and extract Open Graph / Twitter card metadata.
 *
 * Safety: only http(s) URLs are accepted and the redirect chain
 * is bounded so a malicious host can't make us follow infinite
 * redirects. We also enforce a 2MB cap on the response body via
 * a manual byte counter — a streaming fetch() would not respect
 * this on its own. The final URL is returned so the client can
 * see what we actually scraped (after redirects).
 */
export async function scrapeUrl(_userId: number, rawUrl: string): Promise<ScrapeResult> {
  const url = rawUrl.trim();
  if (!url) throw new AppError('url la bat buoc', 400, 'MISSING_URL');

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AppError('url khong hop le', 400, 'INVALID_URL');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new AppError('url phai la http hoac https', 400, 'INVALID_PROTOCOL');
  }
  // Basic SSRF block — keep it short, the goal is just to refuse
  // loopback / private addresses. A real production system would
  // also resolve DNS and re-check at the end of each redirect.
  if (isPrivateHost(parsed.hostname)) {
    throw new AppError('url khong duoc tro vao mang noi bo', 400, 'PRIVATE_HOST');
  }

  let html: string;
  let finalUrl: string;
  try {
    ({ html, finalUrl } = await fetchWithCap(url, SCRAPE_TIMEOUT_MS, SCRAPE_MAX_BYTES, MAX_REDIRECTS));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'fetch failed';
    throw new AppError(`Khong the doc noi dung trang: ${message}`, 502, 'SCRAPE_FAILED');
  }

  const baseUrl = new URL(finalUrl);
  return {
    url: finalUrl,
    title: pickMeta(html, ['og:title', 'twitter:title']) ?? pickTagTitle(html),
    description: pickMeta(html, [
      'og:description',
      'twitter:description',
      'description',
    ]),
    thumbnailUrl: absolutize(pickMeta(html, ['og:image', 'twitter:image']), baseUrl),
    faviconUrl: pickFavicon(html, baseUrl),
    siteName: pickMeta(html, ['og:site_name']),
  };
}

// ─── Public lookup (no auth) ────────────────────────────────

/**
 * Returns a sanitized public view of a link. Only links with
 * isPublic=true are returned. We intentionally omit userId,
 * notes, and personal tags — the public endpoint must not leak
 * anything the owner didn't explicitly share.
 */
export async function getPublicLink(slug: string) {
  const cleanSlug = String(slug ?? '').trim();
  if (!cleanSlug) return null;
  const link = await prisma.hubLink.findFirst({
    where: { publicSlug: cleanSlug, isPublic: true },
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      faviconUrl: true,
      publicSlug: true,
      createdAt: true,
    },
  });
  return link;
}

// ─── helpers ────────────────────────────────────────────────

function serializeLink(l: {
  id: number; folderId: number | null; url: string; title: string;
  description: string | null; thumbnailUrl: string | null;
  faviconUrl: string | null; notes: string | null; tags: string[];
  isPublic: boolean; publicSlug: string | null;
  createdAt: Date; updatedAt: Date;
}) {
  return {
    id: l.id,
    folderId: l.folderId,
    url: l.url,
    title: l.title,
    description: l.description,
    thumbnailUrl: l.thumbnailUrl,
    faviconUrl: l.faviconUrl,
    notes: l.notes,
    tags: l.tags,
    isPublic: l.isPublic,
    publicSlug: l.publicSlug,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

async function assertFolderOwnership(userId: number, folderId: number) {
  if (!Number.isInteger(folderId) || folderId <= 0) {
    throw new AppError('folderId khong hop le', 400, 'INVALID_FOLDER_ID');
  }
  const folder = await prisma.hubFolder.findFirst({
    where: { id: folderId, userId },
    select: { id: true },
  });
  if (!folder) {
    throw new AppError('Folder khong ton tai hoac khong thuoc ve ban', 404, 'FOLDER_NOT_FOUND');
  }
}

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    if (typeof t !== 'string') continue;
    const clean = t.trim().toLowerCase().replace(/^#+/, '');
    if (!clean) continue;
    if (clean.length > 50) continue;
    if (seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
    if (out.length >= 30) break;
  }
  return out;
}

async function uniquePublicSlug(): Promise<string> {
  // nanoid(10) → ~62^10 = 8.4e17 combinations. Plenty for a personal
  // bookmark manager. We retry on the (extremely unlikely) collision.
  for (let i = 0; i < 5; i++) {
    const slug = nanoid(10);
    const exists = await prisma.hubLink.findFirst({
      where: { publicSlug: slug },
      select: { id: true },
    });
    if (!exists) return slug;
  }
  // Fallback: timestamp-suffixed. Should be unreachable in practice.
  return `${nanoid(8)}${Date.now().toString(36)}`;
}

function pickMeta(html: string, names: string[]): string | null {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `<meta[^>]+(?:property|name)\\s*=\\s*["']${escaped}["'][^>]*content\\s*=\\s*["']([^"']+)["']`,
      'i',
    );
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1].trim());
    // Try the alternative order: content= before property= (rare but valid HTML).
    const re2 = new RegExp(
      `<meta[^>]+content\\s*=\\s*["']([^"']+)["'][^>]+(?:property|name)\\s*=\\s*["']${escaped}["']`,
      'i',
    );
    const m2 = html.match(re2);
    if (m2?.[1]) return decodeHtmlEntities(m2[1].trim());
  }
  return null;
}

function pickTagTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m?.[1]) return null;
  return decodeHtmlEntities(m[1].trim()).slice(0, 500);
}

function pickFavicon(html: string, baseUrl: URL): string | null {
  // Look for <link rel="icon" ...> or rel="shortcut icon"
  const linkRe = /<link[^>]+rel\s*=\s*["'](?:shortcut\s+icon|icon|apple-touch-icon)["'][^>]+href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  let best: string | null = null;
  while ((m = linkRe.exec(html)) !== null) {
    if (!m[1]) continue;
    if (!best) best = m[1];
    // Prefer 32x32+ sizes if specified
    if (/sizes\s*=\s*["'][^"']*\b(?:32|48|64|96|128|192|256)\b/i.test(m.input.slice(Math.max(0, m.index - 200), m.index + 200))) {
      best = m[1];
      break;
    }
  }
  return absolutize(best, baseUrl);
}

function absolutize(maybe: string | null, baseUrl: URL): string | null {
  if (!maybe) return null;
  try {
    return new URL(maybe, baseUrl).toString();
  } catch {
    return null;
  }
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => {
      const n = Number(code);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : _m;
    });
}

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '::1' || h === '0.0.0.0') return true;
  // IPv4
  const ipv4 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(h);
  if (ipv4) {
    const [, a, b] = ipv4.map(Number) as unknown as [string, number, number, number, number];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
  }
  // IPv6 (very rough)
  if (h.startsWith('fc') || h.startsWith('fd')) return true;
  if (h.startsWith('fe80:')) return true;
  return false;
}

/**
 * Fetch a URL with:
 *  - AbortController-based timeout
 *  - Manual byte cap (we read chunks and abort once we exceed SCRAPE_MAX_BYTES)
 *  - Bounded manual redirect chain (we re-validate the host on each hop)
 */
async function fetchWithCap(
  startUrl: string,
  timeoutMs: number,
  maxBytes: number,
  maxRedirects: number,
): Promise<{ html: string; finalUrl: string }> {
  let currentUrl = startUrl;
  for (let i = 0; i <= maxRedirects; i++) {
    if (isPrivateHost(new URL(currentUrl).hostname)) {
      throw new Error('redirect went to a private host');
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw new Error('redirect without Location');
      const next = new URL(location, currentUrl).toString();
      // Consume body to free the connection before following.
      try { await res.arrayBuffer(); } catch { /* ignore */ }
      currentUrl = next;
      continue;
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (!/text\/html|application\/xhtml/i.test(contentType)) {
      throw new Error('not an HTML page');
    }
    if (!res.body) {
      throw new Error('no response body');
    }

    // Read up to maxBytes, then stop.
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    let truncated = false;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        truncated = true;
        break;
      }
      chunks.push(value);
    }
    try { await reader.cancel(); } catch { /* ignore */ }
    const combined = new Uint8Array(total > maxBytes ? maxBytes : total);
    let offset = 0;
    for (const chunk of chunks) {
      if (offset + chunk.byteLength > combined.byteLength) {
        const slice = chunk.subarray(0, combined.byteLength - offset);
        combined.set(slice, offset);
        offset = combined.byteLength;
        break;
      }
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const html = new TextDecoder('utf-8', { fatal: false }).decode(combined);
    if (truncated) {
      // We still return what we have — the meta tags almost always
      // appear in the first 100KB of an HTML page.
    }
    return { html, finalUrl: currentUrl };
  }
  throw new Error('too many redirects');
}
