'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
 code: string;
 language?: string;
 fileName?: string;
 /** Compact mode strips padding/font-size for use in sidebars. */
 compact?: boolean;
 /** Show line numbers in the gutter. Default: false. */
 showLineNumbers?: boolean;
 /**
 * Cap rendered height with a fade-out and "Show all" button.
 * Useful for very long snippets inside narrow containers.
 */
 maxHeight?: number;
}

/**
 * CodeBlock — VSCode-grade syntax highlighting via Shiki.
 *
 * Reused by:
 * • Public project detail page (Database Schema section)
 * • Public project detail page (Milestone "Code review")
 * • Admin project editor (Database Schema preview)
 * • Admin MarkdownEditor's fenced code via the shared
 * <Markdown /> component.
 *
 * Why Shiki (over hljs):
 * • Same grammar that powers VSCode — exact same colors
 * the user sees in their editor.
 * • Server-renderable, so the admin preview and the public
 * page look identical (no FOUC, no client-only colors).
 * • First-class support for `prisma`, `sql`, `tsx`, `tsx`
 * and the rest of the languages we ship in the editor.
 *
 * Implementation note: Shiki ships its own languages/themes as
 * async-loaded JSON. We register the languages the editor's
 * SCHEMA_LANGS dropdown exposes, plus a couple of common
 * ones, then cache the highlighter at module scope. Unknown
 * languages fall back to escaped plain text inside a styled
 * <pre> so a typo never crashes the page.
 */

// Languages we eagerly register. Matches the union of the
// 7 languages in `SCHEMA_LANGS` (admin editor dropdown) +
// common cases the case-study may use.
const SUPPORTED_LANGS = [
 'plaintext',
 'prisma',
 'sql',
 'typescript',
 'tsx',
 'javascript',
 'jsx',
 'json',
 'yaml',
 'bash',
 'shell',
 'python',
 'css',
 'html',
 'markdown',
 'md',
 'dockerfile',
 'go',
 'rust',
] as const;

type SupportedLang = typeof SUPPORTED_LANGS[number];

const THEME = 'github-dark';

// Module-scope cache so the highlighter is built once per
// browser session. The promise is shared by every CodeBlock
// instance on the page.
let highlighterPromise: Promise<import('shiki').Highlighter> | null = null;

async function getHighlighter(): Promise<import('shiki').Highlighter> {
 if (highlighterPromise) return highlighterPromise;
 highlighterPromise = (async () => {
 // Dynamic import keeps the (large) Shiki bundle out of
 // the initial chunk. Next will split this into a separate
 // webp-equivalent client bundle.
 const shiki = await import('shiki');
 const hl = await shiki.createHighlighter({
 themes: [THEME],
 langs: SUPPORTED_LANGS as unknown as string[],
 });
 return hl;
 })();
 return highlighterPromise;
}

function escapeHtml(s: string): string {
 return s
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#39;');
}

function normaliseLang(lang: string | undefined): string {
 const l = (lang ?? 'plaintext').toLowerCase();
 // Accept a few aliases so the editor's dropdown values
 // (which include "markdown" and "shell") all map cleanly.
 if (l === 'md') return 'markdown';
 if (l === 'sh' || l === 'zsh') return 'bash';
 if (l === 'ts') return 'typescript';
 if (l === 'js') return 'javascript';
 if (l === 'py') return 'python';
 if ((SUPPORTED_LANGS as readonly string[]).includes(l)) return l;
 return 'plaintext';
}

export default function CodeBlock({
 code,
 language = 'plaintext',
 fileName,
 compact,
 showLineNumbers = false,
 maxHeight,
}: CodeBlockProps) {
 const [html, setHtml] = useState<string>('');
 const [expanded, setExpanded] = useState(false);
 const [copied, setCopied] = useState(false);
 const [needsTruncation, setNeedsTruncation] = useState(false);
 const preRef = useRef<HTMLPreElement>(null);
 const lang = useMemo(() => normaliseLang(language), [language]);

 // Render highlighted HTML on mount + whenever inputs change.
 // Plaintext is rendered synchronously (no Shiki round-trip
 // needed) so first paint is never blocked on a fetch.
 useEffect(() => {
 let cancelled = false;
 if (lang === 'plaintext') {
 setHtml(escapeHtml(code));
 return () => { cancelled = true; };
 }
 (async () => {
 try {
 const hl = await getHighlighter();
 const out = hl.codeToHtml(code, { lang, theme: THEME });
 if (!cancelled) setHtml(out);
 } catch {
 if (!cancelled) setHtml(escapeHtml(code));
 }
 })();
 return () => { cancelled = true; };
 }, [code, lang]);

 // Detect whether the rendered block overflows the cap so we
 // can show the "Show all" affordance.
 useEffect(() => {
 if (!maxHeight || !preRef.current) return;
 setNeedsTruncation(preRef.current.scrollHeight > maxHeight + 4);
 }, [html, maxHeight, expanded]);

 const onCopy = useCallback(async () => {
 try {
 await navigator.clipboard.writeText(code);
 setCopied(true);
 setTimeout(() => setCopied(false), 1800);
 } catch { /* clipboard API unavailable; silently fail */ }
 }, [code]);

 // Pull out the inner <code>…</code> from Shiki's output so we
 // can layer our own copy button + (optional) line-numbers
 // overlay on top of the rendered Shiki DOM.
 const innerCodeHtml = useMemo(() => {
 if (!html) return '';
 // Shiki emits: <pre ... tabindex="0"><code>…</code></pre>
 // We grab everything between <code…> and the matching </code>
 // by simple index-based extraction — Shiki's output is
 // deterministic and contains no nested </code>.
 const codeOpen = html.match(/<code[^>]*>/);
 if (!codeOpen) return html;
 const start = (codeOpen.index ?? 0) + codeOpen[0].length;
 const end = html.lastIndexOf('</code>');
 if (end < start) return html;
 return html.slice(start, end);
 }, [html]);

 const isClipped = Boolean(maxHeight) && needsTruncation && !expanded;
 const maxHeightStyle = isClipped
 ? { maxHeight: maxHeight, overflow: 'hidden' as const }
 : undefined;

 return (
 <div
 className={`relative group rounded-xl overflow-hidden border ${
 compact ? 'my-3' : 'my-4'
 }`}
 style={{
 background: '#0d1117', // github-dark base
 borderColor: 'rgba(34,211,238,0.12)',
 }}
 >
 {(fileName || lang !== 'plaintext') && (
 <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[rgba(255,255,255,0.08)] text-xs">
 <span className="text-text-muted font-mono">
 {fileName ?? lang.toUpperCase()}
 </span>
 <span className="text-text-muted text-[10px] uppercase tracking-wider">{lang}</span>
 </div>
 )}
 <button
 onClick={onCopy}
 aria-label="Copy code"
 className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-darkbg/80 border border-darkborder text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
 >
 {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
 </button>
 <pre
 ref={preRef}
 className={`overflow-x-auto ${compact ? 'p-3 text-xs' : 'p-4 text-sm'} leading-relaxed font-mono`}
 style={{
 ...maxHeightStyle,
 // Shiki already sets background per <pre>; we let it win.
 background: 'transparent',
 position: 'relative',
 }}
 >
 {showLineNumbers ? (
 <code className="grid grid-cols-[auto_1fr] gap-x-4">
 <span aria-hidden="true" className="text-right text-text-muted/40 select-none">
 {Array.from({ length: code.split('\n').length }, (_, i) => (
 <span key={i} className="block">
 {i + 1}
 </span>
 ))}
 </span>
 <span
 // Shiki produces inline-styled spans; this just hosts them
 dangerouslySetInnerHTML={{ __html: innerCodeHtml }}
 />
 </code>
 ) : (
 <code dangerouslySetInnerHTML={{ __html: innerCodeHtml }} />
 )}
 </pre>
 {needsTruncation && (
 <button
 type="button"
 onClick={() => setExpanded((v) => !v)}
 className="block w-full text-center py-1.5 text-[10px] uppercase tracking-wider text-text-muted hover:text-text-primary bg-[#161b22] border-t border-[rgba(255,255,255,0.08)]"
 >
 {expanded ? '↑ Thu gọn' : '↓ Xem toàn bộ'}
 </button>
 )}
 </div>
 );
}
