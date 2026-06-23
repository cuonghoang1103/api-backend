'use client';

import { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'isomorphic-dompurify';

interface MarkdownRendererProps {
 /** Server-rendered HTML (preferred fast path). */
 html?: string;
 /** Raw MDX — used when html is not available (legacy projects, preview). */
 mdx?: string;
 /** Open external links in new tab. */
 openLinksInNewTab?: boolean;
}

/**
 * MarkdownRenderer — renders project case-study content.
 *
 * Two paths:
 * 1. If `html` is provided, render directly via
 * dangerouslySetInnerHTML (after DOMPurify sanitization).
 * This is the preferred path: backend already rendered
 * once on save and cached the result.
 * 2. Otherwise, render `mdx` client-side with the same
 * plugin chain (gfm, highlight, raw) so unsaved drafts
 * and legacy projects still display correctly.
 *
 * Note: hljs CSS classes are emitted by rehype-highlight
 * and styled globally in globals.css under .case-study-body
 * (because they're not in the React tree).
 */
export default function MarkdownRenderer({
 html,
 mdx,
 openLinksInNewTab = true,
}: MarkdownRendererProps) {
 // Sanitize the server-rendered HTML once. DOMPurify on
 // the server already ran sanitize via rehype-sanitize;
 // this second pass is belt-and-suspenders in case a
 // future pipeline change introduces an injection.
 const safeHtml = useMemo(() => {
 if (!html) return '';
 return DOMPurify.sanitize(html, {
 ALLOWED_TAGS: [
 'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark',
 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
 'ul', 'ol', 'li',
 'blockquote', 'q', 'cite',
 'code', 'pre', 'kbd', 'samp', 'var',
 'a', 'img', 'figure', 'figcaption',
 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
 'hr', 'details', 'summary', 'aside',
 ],
 ALLOWED_ATTR: [
 'href', 'title', 'target', 'rel',
 'src', 'alt', 'width', 'height',
 'class', 'id',
 ],
 });
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
 remarkPlugins={[remarkGfm]}
 rehypePlugins={[rehypeRaw, rehypeHighlight]}
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
 code: ({ className, children, ...props }) => {
 const isBlock = /language-/.test(className ?? '');
 if (isBlock) {
 return (
 <code className={className} {...props}>
 {children}
 </code>
 );
 }
 return (
 <code className="px-1.5 py-0.5 rounded text-[0.9em] bg-neon-violet/10 text-neon-violet border border-neon-violet/20 font-mono" {...props}>
 {children}
 </code>
 );
 },
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