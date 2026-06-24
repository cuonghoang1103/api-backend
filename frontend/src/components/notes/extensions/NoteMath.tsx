'use client';

// NoteMath — custom Tiptap node for KaTeX math.
// Two flavours:
//   inline  : parses `$...$` and renders inline math (e.g. in a sentence).
//   block   : parses `$$...$$` on its own line and renders centred math.
//
// Lazy-loading: katex is ~250KB and only relevant if a user actually
// writes math. We import it dynamically on first render so the bundle
// stays small for everyone else. The CSS is loaded only after the
// katex JS resolves so we don't pay the cost until needed.

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';
import { Sigma } from 'lucide-react';
import { useEffect, useState } from 'react';

type Mode = 'inline' | 'block';

interface KatexModules {
  katex: typeof import('katex').default;
  cssHref: string;
}

let katexCache: KatexModules | null = null;
let katexLoading: Promise<KatexModules | null> | null = null;

async function loadKatex(): Promise<KatexModules | null> {
  if (katexCache) return katexCache;
  if (katexLoading) return katexLoading;
  katexLoading = (async () => {
    try {
      const katexMod = await import('katex');
      // KaTeX ships its own CSS — we side-effect import it once so
      // Next.js injects it into the document. The static `any` keeps
      // TypeScript happy without a global declaration.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await import('katex/dist/katex.min.css' as any);
      katexCache = { katex: katexMod.default, cssHref: '' };
      return katexCache;
    } catch {
      // KaTeX failed to load — fall back to plain text in the editor.
      return null;
    }
  })();
  return katexLoading;
}

export const NoteMath = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true, // treated as a single unit (no cursor splits inside)
  selectable: true,
  content: 'text*',

  addAttributes() {
    return {
      mode: { default: 'inline' as Mode },
    };
  },

  parseHTML() {
    return [
      { tag: 'span[data-type="math-inline"]' },
      { tag: 'div[data-type="math-block"]' },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const mode = (node.attrs as { mode?: Mode }).mode ?? 'inline';
    return [(mode === 'block' ? 'div' : 'span'),
      mergeAttributes(HTMLAttributes, { 'data-type': mode === 'block' ? 'math-block' : 'math-inline' }),
      0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathView);
  },
});

export default NoteMath;

// Module augmentation omitted — Tiptap auto-infers from addCommands().

function MathView({ node }: NodeViewProps) {
  const tex: string = node.textContent;
  const mode: Mode = ((node.attrs as { mode?: Mode }).mode ?? 'inline') as Mode;
  const [html, setHtml] = useState<string>(escape(tex));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await loadKatex();
      if (!mod) return;
      if (cancelled) return;
      try {
        const out = mod.katex.renderToString(tex, {
          displayMode: mode === 'block',
          throwOnError: false,
          output: 'html',
          strict: 'ignore',
        });
        setHtml(out);
        setReady(true);
      } catch {
        setHtml(escape(tex));
      }
    })();
    return () => { cancelled = true; };
  }, [tex, mode]);

  return (
    <NodeViewWrapper
      as={mode === 'block' ? 'div' : 'span'}
      data-type={mode === 'block' ? 'math-block' : 'math-inline'}
      className={mode === 'block'
        ? 'my-3 block overflow-x-auto rounded-md border border-white/[0.06] bg-slate-900/40 p-3 text-center'
        : 'inline-block max-w-full align-baseline rounded bg-white/[0.04] px-1'}
    >
      {ready ? (
        <span dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <span className="inline-flex items-center gap-1 font-mono text-[12px] text-slate-500">
          <Sigma className="h-3 w-3" />
          {tex || '...'}
        </span>
      )}
      <NodeViewContent className="hidden" />
    </NodeViewWrapper>
  );
}

function escape(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] ?? c));
}
