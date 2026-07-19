'use client';

// MiniCode — a compact, syntax-highlighted code block (no title bar / copy
// chrome) for small snippets like exercise example inputs. Reuses the same
// Prism highlighter + VSCode Dark+ theme as CodeViewer so example code is
// readable and colored instead of flat monospace.

import dynamic from 'next/dynamic';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

const ALIASES: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', rb: 'ruby', sh: 'bash',
  shell: 'bash', yml: 'yaml', html: 'markup', xml: 'markup', vue: 'markup',
  cs: 'csharp', 'c++': 'cpp', cc: 'cpp', golang: 'go', rs: 'rust', kt: 'kotlin',
  md: 'markdown', dockerfile: 'docker',
};
function normalize(language?: string): string {
  const l = (language || '').toLowerCase().trim();
  return ALIASES[l] || l || 'text';
}

export function MiniCode({ code, language, plain = false }: { code: string; language?: string; plain?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-md border border-white/10 bg-[#1e1e1e]">
      <SyntaxHighlighter
        language={plain ? 'text' : normalize(language)}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '0.6rem 0.8rem', background: 'transparent', fontSize: '0.78rem', lineHeight: 1.55 }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' } }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
