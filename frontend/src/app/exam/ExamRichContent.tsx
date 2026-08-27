'use client';

/**
 * Rich renderer for exam prompts / options / explanations. Renders sanitized
 * bilingual HTML, then post-processes the mounted DOM for the things an FPTU
 * paper needs to look "exactly like the exam":
 *   • Math — KaTeX auto-render of $…$, $$…$$, \(…\), \[…\] (lib loaded lazily,
 *     only when a delimiter is actually present).
 *   • Diagrams — <pre class="mermaid">…</pre> blocks rendered to SVG (mermaid
 *     loaded lazily, only when a diagram block exists; broken source degrades
 *     to a muted note instead of throwing).
 *   • Tables / figures — plain HTML <table> / <img> (already pass sanitize).
 *
 * IMPORTANT: this component is wrapped in React.memo. The exam room re-renders
 * every second (countdown timer). Without memo, React would re-apply
 * dangerouslySetInnerHTML on every tick and wipe the KaTeX/mermaid nodes we
 * injected imperatively — the classic "formula renders then reverts to raw
 * $...$ after 1–2s" bug. memo skips the re-render entirely while props are
 * unchanged, so the rendered math survives. It re-renders (and re-runs KaTeX)
 * only when html/L actually change (e.g. the EN/VI toggle).
 */
import { memo, useEffect, useId, useRef } from 'react';
import { pickLang, sanitizeHtml, stripInlineColors } from '@/lib/utils';
// Static top-level import (not a dynamic import() inside the effect below) —
// Next's webpack CSS handling only reliably extracts/injects node_modules
// stylesheets from a top-level import. A dynamic import() of this same path
// still let KaTeX's JS render fine (auto-render doesn't need the CSS to run),
// but WITHOUT `.katex-mathml { clip: ... }` the invisible accessibility
// MathML text stayed visible right next to the styled HTML rendering — every
// $x$ showed twice ("x x"). Matches the working pattern in ChatMarkdown.tsx.
import 'katex/dist/katex.min.css';

const MATH_RE = /\$|\\\(|\\\[/;

// Roman-numeral list markers "(i) (ii) (iii) …". FPTU papers list the choices
// for a question inline ("(i) … (ii) … (iii) …"), which is cramped and hard to
// read. Put each marker on its own line by inserting a <br> before it. Applied
// to the PROMPT only (not inline option chips), so it works for every subject
// and every question without touching the content. Longest alternatives first
// so "(iv)"/"(vii)" aren't partial-matched by "(i)"/"(v)".
const ROMAN_ITEM = /\s*(?:<br\s*\/?>)?\s*\((viii|vii|iii|ii|iv|ix|vi|xi|x|v|i)\)/gi;
// Math segments must be skipped so "(x)" in $f(x)$ or "(i)" as an imaginary
// unit is never split (which would inject a <br> INSIDE $…$ and break KaTeX).
const MATH_SEG = /(\$\$[\s\S]*?\$\$|\$[^$]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g;
function breakRomanList(html: string): string {
  // split() with a capturing group keeps the math chunks at odd indices; only
  // the even (non-math) text is eligible for reflow.
  const parts = html.split(MATH_SEG);
  let count = 0;
  for (let i = 0; i < parts.length; i += 2) {
    const m = parts[i].match(ROMAN_ITEM);
    if (m) count += m.length;
  }
  if (count < 2) return html; // a lone "(i)" in prose → leave alone
  for (let i = 0; i < parts.length; i += 2) parts[i] = parts[i].replace(ROMAN_ITEM, '<br>($1)');
  return parts.join('').replace(/^(?:\s*<br\s*\/?>)+/, '');
}

function ExamRichContent({ html, L, className = '', inline = false }: {
  html: string; L: 'en' | 'vi'; className?: string; inline?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const idBase = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clean = sanitizeHtml(stripInlineColors(pickLang(html, L)));
  const content = inline ? clean : breakRomanList(clean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    // ── Math (KaTeX) — only when a delimiter is present ──
    if (MATH_RE.test(el.textContent || '')) {
      (async () => {
        try {
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

  const cls = `rich-content max-w-none ${className}`;
  if (inline) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>} className={cls} data-ml={L} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <div ref={ref as React.RefObject<HTMLDivElement>} className={cls} data-ml={L} dangerouslySetInnerHTML={{ __html: content }} />;
}

export default memo(ExamRichContent);
