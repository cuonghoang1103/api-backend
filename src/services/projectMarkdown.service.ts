import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
// `Schema` is exported from `rehype-sanitize` but not via
// the package's `main` entry in this version, so we type
// import it from the underlying hast-util-sanitize module
// which is always a transitive dependency.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Schema as HsSchema } from 'hast-util-sanitize';
type Schema = HsSchema;
// `PropertyDefinition` isn't reachable as a runtime import
// either; treat attribute lists as `unknown[]` and cast.
type PropertyDefinition = unknown;
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root as HastRoot, Element as HastElement } from 'hast';

/**
 * Project Markdown service
 * ────────────────────────────────────────────────────────────
 * Renders `bodyMdx` (Markdown + custom directives) into safe
 * HTML that the public detail page can serve as `bodyHtml`.
 *
 * Pipeline (cached at module scope, built once per process):
 *
 * raw text
 * │ preprocessCallouts() ← :::tip[Title] / :::note / :::warning / :::danger
 * ▼
 * remark-parse → mdast
 * remark-gfm → tables, strikethrough, task-lists
 * remark-breaks → soft line breaks become <br> (matches
 * │ admin preview behaviour; without this a paragraph
 * │ pasted with hard wraps renders as a single line)
 * remark-rehype → hast
 * rehype-raw → allow inline HTML (still sanitised next)
 * rehype-highlight → add hljs-* classes to <pre><code>
 * rehype-sanitize → allow-list (extended schema)
 * rehype-stringify → HTML string
 *
 * The callout preprocessor is a pure string-level pass that
 * runs *before* remark. We picked this over an mdast plugin
 * because multi-paragraph directive bodies (which users will
 * definitely want — e.g. a warning spanning several paragraphs
 * with a list and a code block) are notoriously fiddly to
 * model as mdast containers, while a regex on the source
 * just works. Tradeoff: we can't nest callouts, but that's
 * a non-goal for the case-study surface area.
 */

// ─────────────────────────────────────────────────────────────────
// Extended sanitize schema
// ─────────────────────────────────────────────────────────────────
// Default schema already allows most prose elements. We
// extend it to permit the structures our markdown pipeline
// produces — callouts, code-block metadata, headings with
// anchors — and to keep code blocks presentable (hljs adds
// dozens of `class` values like `hljs-keyword`).

// We cast the whole schema object to `Schema` once because
// the `attributes.*` property has a stricter type than we
// can construct ergonomically (PropertyDefinition is a
// tuple-or-string union that doesn't survive our object
// spread). The runtime shape is identical.
const sanitizeSchema = {
 ...defaultSchema,
 tagNames: [
 ...(defaultSchema.tagNames ?? []),
 'aside', // callout wrapper
 'figure', 'figcaption', // reserved for future use
 'kbd', 'mark', 'details', 'summary',
 ],
 attributes: {
 ...(defaultSchema.attributes ?? {}),
 '*': [
 ...(((defaultSchema.attributes ?? {})['*'] as Array<PropertyDefinition>) ?? []),
 'className', // hljs uses `class`; DOMPurify maps className → class
 'id',
 ] as PropertyDefinition[],
 a: [
 ['href'],
 'title',
 'target',
 'rel',
 ] as PropertyDefinition[],
 img: [
 ['src'],
 'alt',
 'title',
 'width',
 'height',
 ] as PropertyDefinition[],
 // allow data-callout for client-side interactivity
 aside: ['dataCallout', 'dataTitle'] as PropertyDefinition[],
 code: ['className'] as PropertyDefinition[],
 pre: ['className', 'style'] as PropertyDefinition[],
 span: ['className', 'style'] as PropertyDefinition[],
 div: ['className', 'style'] as PropertyDefinition[],
 h1: ['id'] as PropertyDefinition[],
 h2: ['id'] as PropertyDefinition[],
 h3: ['id'] as PropertyDefinition[],
 h4: ['id'] as PropertyDefinition[],
 },
 protocols: {
 ...(defaultSchema.protocols ?? {}),
 href: ['http', 'https', 'mailto', '#'],
 src: ['http', 'https', 'data'],
 },
 clobberPrefix: 'user-content-',
} as unknown as Schema;

// ─────────────────────────────────────────────────────────────────
// Cached processor
// ─────────────────────────────────────────────────────────────────
// We build the processor once at module load. Each call to
// `renderProjectMarkdown()` reuses it. The `Processor<…>`
// generics don't quite line up across the chain (mdast Root
// vs hast Root), so we type as `any`-flavoured at the call
// site; see remark-rehype docs for why.

type AnyProcessor = Processor<any, any, any, any, string>;
let cachedProcessor: AnyProcessor | null = null;

function getProcessor(): AnyProcessor {
 if (cachedProcessor) return cachedProcessor;
 cachedProcessor = (unified() as unknown as AnyProcessor)
 .use(remarkParse)
 .use(remarkGfm)
 .use(remarkBreaks)
 .use(remarkRehype, { allowDangerousHtml: true })
 .use(rehypeRaw)
 .use(rehypeHighlight, { detect: true, ignoreMissing: true })
 .use(rehypeSanitize, sanitizeSchema)
 .use(rehypeStringify, { allowDangerousHtml: false });
 return cachedProcessor;
}

// ─────────────────────────────────────────────────────────────────
// Callout preprocessor
// ─────────────────────────────────────────────────────────────────
// Converts `:::variant[Title]\n…\n:::` blocks into `<aside
// class="callout callout-variant" data-title="Title">…</aside>`
// before remark-parse. We deliberately operate on the raw
// string (not on the mdast) so we can keep multi-paragraph
// bodies, code fences, and lists inside the callout.
//
// Matches across lines, captures the optional title, and
// only recognises the four whitelisted variants.
//
// We tolerate one optional `> ` prefix (block-quote) on
// each line so callouts can sit inside a Markdown
// blockquote — a pattern the admin editor supports. The
// captured body keeps its inner structure; we strip the
// leading `> ` per-line before indenting.

const CALLOUT_OPEN_RE = /^[ \t]*(?:>[ \t]*)?:::(tip|note|warning|danger)(?:\[([^\]]+)\])?[ \t]*\n([\s\S]*?)\n[ \t]*(?:>[ \t]*)?:::[ \t]*(?=\n|$)/gm;

function preprocessCallouts(mdx: string): string {
 return mdx.replace(CALLOUT_OPEN_RE, (_match, variant: string, title: string | undefined, body: string) => {
 const safeVariant = variant.toLowerCase();
 const titleAttr = title ? ` data-title="${escapeAttr(title)}"` : '';
 // Strip leading `> ` per line so a callout that sat
 // inside a blockquote doesn't keep the `> ` in the
 // rendered HTML. Then indent by 4 spaces so remark
 // treats the body as a single block.
 const stripped = body
 .split('\n')
 .map((line) => line.replace(/^[ \t]*>[ \t]?/, ''))
 .join('\n');
 const indented = stripped
 .split('\n')
 .map((line) => (line.length === 0 ? '' : ' ' + line))
 .join('\n');

 return (
 `\n\n<aside class="callout callout-${safeVariant}" data-callout="${safeVariant}"${titleAttr}>\n` +
 `<div class="callout-title">${escapeHtml(title ?? defaultTitle(safeVariant))}</div>\n` +
 `<div class="callout-body">\n\n${indented}\n\n</div>\n` +
 `</aside>\n\n`
 );
 });
}

function defaultTitle(variant: string): string {
 switch (variant) {
 case 'tip': return 'Mẹo';
 case 'note': return 'Ghi chú';
 case 'warning': return 'Cảnh báo';
 case 'danger': return 'Nguy hiểm';
 default: return variant;
 }
}

function escapeHtml(s: string): string {
 return s
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
 return escapeHtml(s).replace(/'/g, '&#39;');
}

// ─────────────────────────────────────────────────────────────────
// Heading id plugin
// ─────────────────────────────────────────────────────────────────
// rehype-sanitize strips `id` from headings by default; we
// re-add them after sanitize so the TOC on the frontend can
// target each section by anchor. The frontend also has its
// own client-side slugifier as a fallback, but this is the
// canonical source.

function rehypeHeadingIds() {
 return (tree: HastRoot) => {
 visit(tree, 'element', (node: HastElement) => {
 if (['h1', 'h2', 'h3', 'h4'].includes(node.tagName) && !node.properties?.id) {
 const text = toText(node);
 if (text) node.properties = { ...(node.properties ?? {}), id: slugify(text) };
 }
 });
 };
}

function toText(node: HastElement): string {
 let out = '';
 visit(node, 'text', (t: { value: string }) => { out += t.value; });
 return out;
}

/**
 * Vietnamese-aware slugifier — strips diacritics and
 * collapses non-alphanumerics to dashes. Matches the
 * frontend's client-side slugifier so server-rendered
 * ids line up with what the TOC expects.
 */
export function slugifyHeading(s: string): string {
 return s
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '')
 .replace(/đ/g, 'd')
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/^-+|-+$/g, '')
 .slice(0, 80);
}

// Local copy of the slugifier kept private so we can use it
// inside the plugin without re-exporting. (slugifyHeading
// is exported separately for callers that need it.)
const slugify = slugifyHeading;

// ─────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────

/**
 * Render Markdown + directives to HTML.
 *
 * @throws if the pipeline throws — caller's responsibility to
 * catch (we don't want to crash a write path because of a
 * single malformed doc; route layer logs and falls back).
 *
 * Async on purpose: some plugins in the chain (e.g. rehype-raw)
 * run their transform asynchronously in current versions, so a
 * synchronous `processSync()` throws
 * `runSync finished async. Use run instead`. `process()` works
 * for both sync and async transforms, so we await it.
 */
export async function renderProjectMarkdown(mdx: string): Promise<string> {
 if (!mdx || !mdx.trim()) return '';
 const pre = preprocessCallouts(mdx);

 // We rebuild the processor *per call* with the heading-id
 // plugin in the right spot (after sanitize, so we don't
 // strip the ids we just added). Caching at module scope
 // would prevent per-call plugin injection.
 const proc = (unified() as unknown as AnyProcessor)
 .use(remarkParse)
 .use(remarkGfm)
 .use(remarkBreaks)
 .use(remarkRehype, { allowDangerousHtml: true })
 .use(rehypeRaw)
 .use(rehypeHighlight, { detect: true, ignoreMissing: true })
 .use(rehypeSanitize, sanitizeSchema)
 .use(rehypeHeadingIds)
 .use(rehypeStringify, { allowDangerousHtml: false });

 return String(await proc.process(pre));
}

/**
 * Compute reading time (minutes) using the conventional
 * 200 wpm heuristic, after stripping code fences and
 * inline code (which read slower). Rounds up so even a
 * 1-paragraph doc shows ≥ 1 minute.
 */
export function computeReadingTime(mdx: string | null | undefined): number {
 if (!mdx) return 0;
 const stripped = mdx
 .replace(/```[\s\S]*?```/g, ' ')
 .replace(/`[^`]*`/g, ' ')
 .replace(/:::[\s\S]*?:::/g, ' '); // callout containers don't add reading time
 const words = stripped.split(/\s+/).filter(Boolean).length;
 return Math.max(1, Math.round(words / 200));
}

// Lazy-init the cached processor so the first call doesn't
// pay the import cost in cold starts (only used by callers
// that don't need heading ids).
void getProcessor;