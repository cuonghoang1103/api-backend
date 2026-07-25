'use client';

/**
 * Rich renderer for exam prompts / explanations. Renders sanitized bilingual
 * HTML, then post-processes the mounted DOM for the things an FPTU paper needs
 * to look "exactly like the exam":
 *   • Math — KaTeX auto-render of $…$, $$…$$, \(…\), \[…\] (lib loaded lazily,
 *     only when a delimiter is actually present).
 *   • Diagrams — <pre class="mermaid">…</pre> blocks rendered to SVG (mermaid
 *     loaded lazily, only when a diagram block exists; broken source degrades
 *     to a muted note instead of throwing).
 *   • Tables — plain HTML <table>, styled via exam.css.
 *   • Figures — <img> (scanned crop from the paper) already pass sanitize.
 * All post-processing happens AFTER DOMPurify, so KaTeX/mermaid output is never
 * stripped, and it re-runs whenever the language toggles (content changes).
 */
import { useEffect, useId, useRef } from 'react';
import { pickLang, sanitizeHtml, stripInlineColors } from '@/lib/utils';

const MATH_RE = /\$|\\\(|\\\[/;

export default function ExamRichContent({ html, L, className = '' }: { html: string; L: 'en' | 'vi'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const idBase = useId().replace(/[^a-zA-Z0-9]/g, '');
  const content = sanitizeHtml(stripInlineColors(pickLang(html, L)));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    // ── Math (KaTeX) — only when a delimiter is present ──
    if (MATH_RE.test(el.textContent || '')) {
      (async () => {
        try {
          await import('katex/dist/katex.min.css' as unknown as string);
          const mod = await import('katex/dist/contrib/auto-render.mjs' as unknown as string);
          const renderMathInElement = (mod.default || mod) as (
            e: HTMLElement, o: Record<string, unknown>,
          ) => void;
          if (cancelled || !ref.current) return;
          renderMathInElement(ref.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false },
              { left: '$', right: '$', display: false },
            ],
            throwOnError: false,
            ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
          });
        } catch { /* leave the raw LaTeX text as-is */ }
      })();
    }

    // ── Diagrams (mermaid) — only when a diagram block exists ──
    const blocks = Array.from(el.querySelectorAll('pre.mermaid, code.language-mermaid, .language-mermaid'));
    if (blocks.length) {
      (async () => {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false, theme: 'dark', securityLevel: 'strict',
            suppressErrorRendering: true, fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          });
          let i = 0;
          for (const b of blocks) {
            if (cancelled) return;
            const src = (b.textContent || '').trim();
            if (!src) continue;
            const target = (b.closest('pre') as Element) || b;
            try {
              const { svg } = await mermaid.render(`exam-mmd-${idBase}-${i++}`, src);
              if (cancelled) return;
              const wrap = document.createElement('div');
              wrap.className = 'exam-mermaid';
              wrap.innerHTML = svg;
              target.replaceWith(wrap);
            } catch {
              document.getElementById(`dexam-mmd-${idBase}-${i - 1}`)?.remove();
              const note = document.createElement('div');
              note.className = 'exam-mermaid-fail';
              note.textContent = L === 'vi' ? 'Sơ đồ tạm thời không hiển thị được.' : 'Diagram could not be rendered.';
              target.replaceWith(note);
            }
          }
        } catch { /* mermaid failed to load — leave source text */ }
      })();
    }

    return () => { cancelled = true; };
  }, [content, idBase, L]);

  return <div ref={ref} className={`rich-content max-w-none ${className}`} data-ml={L} dangerouslySetInnerHTML={{ __html: content }} />;
}
