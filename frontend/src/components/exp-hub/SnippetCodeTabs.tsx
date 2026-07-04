'use client';

// SnippetCodeTabs — renders a snippet's named code blocks as tabs on the
// public EXP_Hub detail panel. One CodeViewer + CopyButton per active block.
// Falls back to the legacy single { code, language } for old snippets.

import { useState, useEffect } from 'react';
import { CodeViewer } from './CodeViewer';
import { CopyButton } from './CopyButton';
import type { Snippet } from '@/types/exp-hub';

export function SnippetCodeTabs({ snippet }: { snippet: Snippet }) {
  const blocks = (snippet.codeBlocks && snippet.codeBlocks.length > 0)
    ? snippet.codeBlocks
    : [{ name: 'Code', language: snippet.language, code: snippet.code }];

  const [active, setActive] = useState(0);
  // Reset to the first tab whenever a different snippet is shown.
  useEffect(() => { setActive(0); }, [snippet.id]);

  const idx = Math.min(active, blocks.length - 1);
  const blk = blocks[idx] ?? blocks[0];
  if (!blk || !blk.code?.trim()) return null;

  return (
    <div className="mb-6">
      {blocks.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {blocks.map((b, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                i === idx
                  ? 'bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/40'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {b.name || `Code ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <CodeViewer code={blk.code} language={blk.language} />

      <div className="mt-3">
        <CopyButton
          key={`${snippet.id}-${idx}`}
          snippetId={snippet.id}
          code={blk.code}
          language={blk.language}
          variables={snippet.variables}
          variant="button"
        />
      </div>
    </div>
  );
}
