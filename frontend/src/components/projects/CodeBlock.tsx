'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
 code: string;
 language?: string;
 fileName?: string;
 /** Compact mode strips padding/font-size for use in sidebars. */
 compact?: boolean;
}

/**
 * CodeBlock — full-width syntax-highlighted block with a
 * copy button. Uses hljs via dynamic import to keep the
 * initial bundle small; each language is loaded on demand
 * the first time it's requested, then cached in module
 * scope for the rest of the session.
 */
export default function CodeBlock({ code, language = 'plaintext', fileName, compact }: CodeBlockProps) {
 const [highlighted, setHighlighted] = useState<string>(escapeHtml(code));
 const [copied, setCopied] = useState(false);

 useEffect(() => {
 let cancelled = false;
 (async () => {
 const html = await highlightCode(code, language);
 if (!cancelled) setHighlighted(html);
 })();
 return () => { cancelled = true; };
 }, [code, language]);

 const onCopy = useCallback(async () => {
 try {
 await navigator.clipboard.writeText(code);
 setCopied(true);
 setTimeout(() => setCopied(false), 1800);
 } catch { /* clipboard API unavailable; silently fail */ }
 }, [code]);

 return (
 <div
 className={`relative group rounded-xl overflow-hidden border ${
 compact ? 'my-3' : 'my-4'
 }`}
 style={{
 background: '#1e2530',
 borderColor: 'rgba(34,211,238,0.12)',
 }}
 >
 {(fileName || language !== 'plaintext') && (
 <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-darkborder text-xs">
 <span className="text-text-muted font-mono">
 {fileName ?? language.toUpperCase()}
 </span>
 <span className="text-text-muted text-[10px] uppercase">{language}</span>
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
 className={`overflow-x-auto ${compact ? 'p-3 text-xs' : 'p-4 text-sm'} leading-relaxed`}
 >
 <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
 </pre>
 </div>
 );
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
 return s
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#39;');
}

const SUPPORTED_LANGS = new Set([
 'javascript', 'typescript', 'jsx', 'tsx', 'python', 'bash', 'shell',
 'sql', 'json', 'css', 'scss', 'html', 'xml', 'yaml', 'markdown',
 'go', 'rust', 'java', 'kotlin', 'swift', 'ruby', 'php', 'c', 'cpp',
 'csharp', 'dockerfile', 'nginx', 'prisma', 'graphql', 'plaintext',
]);

const loadedLangs = new Set<string>();

/**
 * Highlight code with hljs. Each language is loaded once
 * per session (module-scope cache) and then applied. We
 * fall back to escaped plain text for unknown languages
 * so a typo never crashes the page.
 */
async function highlightCode(code: string, language: string): Promise<string> {
 const lang = (language || 'plaintext').toLowerCase();

 if (typeof window === 'undefined') return escapeHtml(code);

 if (!SUPPORTED_LANGS.has(lang)) {
 // unknown language — escape and wrap, no highlighting
 return escapeHtml(code);
 }

 try {
 const hljs = (await import('highlight.js/lib/core')).default;

 if (!loadedLangs.has(lang)) {
 try {
 const mod = await import(
 /* webpackIgnore: true */ `highlight.js/lib/languages/${lang}`
 );
 hljs.registerLanguage(lang, mod.default);
 loadedLangs.add(lang);
 } catch {
 loadedLangs.add('plaintext'); // don't retry
 }
 }

 if (loadedLangs.has(lang)) {
 const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
 return result.value;
 }
 return escapeHtml(code);
 } catch {
 return escapeHtml(code);
 }
}