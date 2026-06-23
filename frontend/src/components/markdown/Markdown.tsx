'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import CodeBlock from './CodeBlock';

interface MarkdownProps {
 /** Server-rendered HTML (preferred fast path on the public page). */
 html?: string;
 /** Raw MDX — used when html is not available (legacy projects, admin preview). */
 mdx?: string;
 /** Open external links in new tab. */
 openLinksInNewTab?: boolean;
}

/**
 * Markdown — shared renderer for project case-study content.
 *
 * Used by BOTH the admin live preview AND the public detail
 * page, so what the admin sees is exactly what the visitor
 * gets. The plugin chain is identical to the backend's
 * `renderProjectMarkdown()` pipeline:
 *
 * remark-gfm + remark-breaks + rehype-raw + rehype-pretty-code
 *
 * • remark-gfm: tables, strikethrough, task-lists
 * • remark-breaks: hard wraps become <br> (matches
 * admin-side expectation; without this, paragraphs pasted
 * with manual line breaks collapse to one line)
 * • rehype-raw: allow the callout preprocessor's <aside>
 * blocks to pass through
 *
 * Fenced code blocks are NOT highlighted by a rehype plugin.
 * react-markdown runs its rehype chain via `runSync()`, which
 * throws "runSync finished async. Use run instead" the moment a
 * plugin transforms asynchronously — and Shiki (rehype-pretty-code)
 * is async. So instead we render each ```fence``` through the
 * <CodeBlock /> component, which performs the Shiki highlight in a
 * React effect (async-safe) and gives us the exact same theme.
 *
 * Two render paths:
 * 1. If `html` is provided, render directly via
 * dangerouslySetInnerHTML (after DOMPurify sanitization).
 * This is the preferred path: backend already rendered
 * once on save and cached the result.
 * 2. Otherwise, render `mdx` client-side with the same
 * plugin chain so unsaved drafts and legacy projects
 * still display correctly.
 *
 * NOTE: The HTML path relies on the backend to have run
 * `rehype-pretty-code` (or equivalent) for fenced code.
 * Currently the backend uses `rehype-highlight` (hljs), so
 * the public page's HTML path will use hljs classes — the
 * admin preview uses Shiki instead. To unify, we could
 * upgrade the backend to rehype-pretty-code in a follow-up.
 * The CRITICAL shared surface (the <CodeBlock /> component
 * for standalone schema + milestone code review) already
 * uses Shiki on both paths.
 */
export default function Markdown({
 html,
 mdx,
 openLinksInNewTab = true,
}: MarkdownProps) {
 const [safeHtml, setSafeHtml] = useState<string>('');

 // Sanitize the server-rendered HTML once on the client.
 // The backend already ran rehype-sanitize, but defence in
 // depth is cheap and protects against any future pipeline
 // change that drops sanitisation.
 useEffect(() => {
 let cancelled = false;
 if (!html) { setSafeHtml(''); return; }
 (async () => {
 const mod = await import('isomorphic-dompurify');
 const DOMPurify = mod.default;
 const cleaned = DOMPurify.sanitize(html, {
 ALLOWED_TAGS: [
 'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark',
 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
 'ul', 'ol', 'li',
 'blockquote', 'q', 'cite',
 'code', 'pre', 'kbd', 'samp', 'var',
 'a', 'img', 'figure', 'figcaption',
 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
 'hr', 'details', 'summary', 'aside',
 'span', 'div', 'figure',
 ],
 ALLOWED_ATTR: [
 'href', 'title', 'target', 'rel',
 'src', 'alt', 'width', 'height',
 'class', 'id', 'className',
 'style', 'data-callout', 'data-title', 'data-language',
 'data-theme', 'data-line', 'data-highlighted-line',
 'tabindex', 'role', 'aria-hidden',
 ],
 });
 if (!cancelled) setSafeHtml(cleaned);
 })();
 return () => { cancelled = true; };
 }, [html]);

 if (html && safeHtml) {
 return (
 <div
 className="case-study-body"
 dangerouslySetInnerHTML={{ __html: safeHtml }}
 />
 );
 }

 if (!mdx) return null;

 return (
 <div className="case-study-body">
 <ReactMarkdown
 remarkPlugins={[remarkGfm, remarkBreaks]}
 rehypePlugins={[
 rehypeRaw,
 rehypeSanitize,
 ]}
 components={{
 // External links open in new tab with noopener.
 a: ({ node, ...props }) => {
 const href = (props.href ?? '') as string;
 const isExternal = /^https?:\/\//i.test(href);
 if (isExternal && openLinksInNewTab) {
 return <a {...props} target="_blank" rel="noopener noreferrer" />;
 }
 return <a {...props} />;
 },
 // Inline code in our design system — neon-violet pill.
 // Fenced code blocks (className `language-xxx`) are
 // rendered by <CodeBlock />, which highlights with Shiki
 // asynchronously inside a React effect — safe under
 // react-markdown's synchronous rehype runner.
 code: ({ className, children, ...props }) => {
 const match = /language-(\w+)/.exec(className ?? '');
 if (match) {
 const code = String(children ?? '').replace(/\n$/, '');
 return <CodeBlock code={code} language={match[1]} />;
 }
 return (
 <code className="px-1.5 py-0.5 rounded text-[0.9em] bg-neon-violet/10 text-neon-violet border border-neon-violet/20 font-mono" {...props}>
 {children}
 </code>
 );
 },
 // <CodeBlock /> renders its own <pre> chrome, so unwrap
 // react-markdown's surrounding <pre> to avoid invalid
 // <pre><div> nesting. Inline code never reaches here.
 pre: ({ children }) => <>{children}</>,
 h1: ({ id, children, ...props }) => <h1 id={id} {...props}>{children}</h1>,
 h2: ({ id, children, ...props }) => <h2 id={id} {...props}>{children}</h2>,
 h3: ({ id, children, ...props }) => <h3 id={id} {...props}>{children}</h3>,
 h4: ({ id, children, ...props }) => <h4 id={id} {...props}>{children}</h4>,
 }}
 >
 {mdx}
 </ReactMarkdown>
 </div>
 );
}
