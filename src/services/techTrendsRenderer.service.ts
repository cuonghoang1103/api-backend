/**
 * techTrendsRenderer — render Markdown → HTML + extract TOC.
 *
 * Server-side rendering for tech-trend articles. We render the
 * canonical `bodyMdx` source into:
 *   - bodyHtml  : sanitized HTML ready to render in the browser
 *   - toc       : heading list for the sidebar navigation
 *
 * Why server-side? Public reads dominate traffic (~100:1 over
 * admin writes). Caching the rendered HTML in the same row as
 * `bodyMdx` makes the read path O(1) — no parser, no markdown
 * library on the hot path. Writes pay the render cost once,
 * typically when the admin clicks Save.
 *
 * Sanitization: marked's output goes through a strict allowlist
 * via the `sanitize` dep we don't have, so we instead lean on
 * `marked`'s built-in escape rules + a manual pass that strips
 * dangerous schemes (javascript:, data:, vbscript:) from href /
 * src attributes. This is the same approach Project's bodyHtml
 * cache uses (see src/services/projectMarkdown.service.ts) —
 * keeping them aligned means we share one mental model.
 *
 * TOC: we walk the rendered HTML with a regex (cheaper than
 * parsing) and extract <h1>–<h3> with stable slugs so the
 * sidebar can render anchor links. Slugs are deterministic —
 * derived from the heading text + its index in the document
 * — so saving the article doesn't change the URL unless the
 * heading text changes.
 */

import { marked } from 'marked';

export interface TocItem {
  /** Anchor id, stable across renders. */
  id: string;
  /** Heading text, lowercased + trimmed for display. */
  text: string;
  /** 1, 2, or 3 — we only render h1-h3 in the sidebar. */
  level: 1 | 2 | 3;
}

/**
 * Strip dangerous URL schemes from href / src. This is a
 * defense-in-depth pass — marked already escapes raw HTML
 * inside attribute values, but we want to be sure a user
 * pasting `[click](javascript:alert(1))` doesn't sneak through.
 *
 * Match schemes that browsers will execute when followed. We
 * allow http(s), mailto, tel, and relative URLs (no scheme).
 */
function sanitizeHref(href: string): string {
  const trimmed = href.trim();
  // Allow scheme-relative and root-relative URLs.
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return trimmed;
  }
  // Allow http(s), mailto, tel.
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  // Allow hash-only or relative paths.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return trimmed;
  }
  // Otherwise drop — javascript:, data:, vbscript:, file:, etc.
  return '#';
}

const ALLOWED_TAGS = new Set([
  'a', 'b', 'blockquote', 'br', 'code', 'del', 'div', 'em',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img',
  'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 's', 'span',
  'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'th', 'thead',
  'tr', 'u', 'ul',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'rel', 'target']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  code: new Set(['class']),
  span: new Set(['class']),
  div: new Set(['class']),
  // Heading anchor IDs are injected by injectHeadingIds() and
  // are the single source of truth for the sidebar TOC links.
  // We MUST preserve them through the sanitiser or the public
  // reader has no way to deep-link into a specific section.
  h1: new Set(['id']),
  h2: new Set(['id']),
  h3: new Set(['id']),
  h4: new Set(['id']),
  h5: new Set(['id']),
  h6: new Set(['id']),
  th: new Set(['align']),
  td: new Set(['align']),
};

/**
 * Walk a rendered HTML string and:
 *   - strip any tag/attribute not in the allowlist
 *   - rewrite unsafe href / src via sanitizeHref
 *   - add rel="noopener noreferrer" target="_blank" to <a>
 *     links that open a different origin
 *
 * We use a deliberately tiny regex-based parser instead of
 * pulling in a DOM library — the rendered output is bounded
 * (admin-authored content), we only need to enforce an
 * allowlist, and we'd rather avoid an extra dep that can ship
 * a known sanitizer-bypass bug.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*\/?\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (full, tag: string, attrs: string) => {
      const lower = tag.toLowerCase();
      // Closing tag: just check the tag is allowed.
      if (full.startsWith('</')) {
        return ALLOWED_TAGS.has(lower) ? full : '';
      }
      // Self-closing / void: same rule.
      if (!ALLOWED_TAGS.has(lower)) return '';
      // Filter attributes.
      const allowed = ALLOWED_ATTRS[lower] ?? new Set<string>();
      const filteredAttrs = (attrs.match(/[a-zA-Z][a-zA-Z0-9-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/g) ?? [])
        .map((a: string) => {
          const m = a.match(/^([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(.*)$/);
          if (!m) return null;
          const [, name, rawVal] = m;
          const val = rawVal.replace(/^["'](.*)["']$/s, '$1');
          if (!allowed.has(name.toLowerCase())) return null;
          // Rewrite href / src through the scheme allowlist.
          if (name.toLowerCase() === 'href' || name.toLowerCase() === 'src') {
            return `${name}="${sanitizeHref(val).replace(/"/g, '&quot;')}"`;
          }
          return `${name}="${val.replace(/"/g, '&quot;')}"`;
        })
        .filter((x): x is string => x !== null)
        .join(' ');
      // For <a>, inject rel + target on external links.
      const isAnchor = lower === 'a';
      let extra = '';
      if (isAnchor) {
        const hrefMatch = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
        const href = hrefMatch ? (hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '') : '';
        if (/^https?:/i.test(href)) {
          extra = ' rel="noopener noreferrer" target="_blank"';
        }
      }
      return filteredAttrs || extra
        ? `<${lower}${filteredAttrs ? ' ' + filteredAttrs : ''}${extra}>`
        : `<${lower}>`;
    });
}

/**
 * Build a slug from a heading text + a disambiguator. We avoid
 * pulling in a slug lib — the markdown output is bounded so a
 * simple lowercase + diacritics-stripping rule is enough.
 */
function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'section';
}

/**
 * Extract a TOC from rendered HTML. We only consider h1–h3
 * because the sidebar doesn't render deeper levels — articles
 * rarely need more depth and anything deeper becomes visually
 * noisy.
 */
function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const re = /<h([1-3])(?:\s+id="([^"]+)")?[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const level = Math.min(3, Math.max(1, Number(m[1]))) as 1 | 2 | 3;
    const existingId = m[2];
    // Strip any inner tags — `<h2><strong>X</strong></h2>` is common.
    const rawText = m[3].replace(/<[^>]+>/g, '').trim();
    if (!rawText) continue;
    // Trust the id injected by injectHeadingIds() — that's
    // the single source of truth for ids. If somehow the
    // heading didn't get an id (e.g. came from raw HTML),
    // fall back to the deterministic slug.
    const id = existingId || slugifyHeading(rawText);
    items.push({ id, text: rawText, level });
  }
  return items;
}

/**
 * Render markdown to sanitized HTML and extract the TOC in one
 * pass. Used by the route layer on every write so the cached
 * HTML stays in sync with bodyMdx.
 *
 * The returned HTML has `<h2 id="...">` etc. so the sidebar
 * TOC anchors just work.
 */
export function renderArticle(mdx: string): { html: string; toc: TocItem[] } {
  if (!mdx || !mdx.trim()) {
    return { html: '', toc: [] };
  }
  // marked v14 has a finicky renderer override API; the
  // simplest reliable path is to let marked emit plain HTML
  // then post-process to add anchor IDs via a regex that
  // mirrors extractToc() below. Two passes is cheap (O(n)
  // over a few KB of markdown) and keeps the renderer
  // interface minimal.
  _seenIdsInCall.clear();
  const rawHtml = marked.parse(mdx, { async: false }) as string;
  const withIds = injectHeadingIds(rawHtml);
  const html = sanitizeHtml(withIds);
  const toc = extractToc(html);
  return { html, toc };
}

/**
 * Walk the rendered HTML, add a stable `id` to every h1–h3.
 * Idempotent — if a heading already has an id we keep it.
 * Slug algorithm matches extractToc() so anchors line up.
 */
function injectHeadingIds(html: string): string {
  return html.replace(/<h([1-3])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, inner) => {
    if (/\bid\s*=/.test(attrs)) return full;
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (!text) return full;
    const id = makeUniqueId(text);
    return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
  });
}

const _seenIdsInCall = new Map<string, number>();
function makeUniqueId(text: string): string {
  const base = slugifyHeading(text);
  const seen = _seenIdsInCall.get(base) ?? 0;
  _seenIdsInCall.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen}`;
}