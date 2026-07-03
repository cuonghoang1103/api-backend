'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// react-syntax-highlighter's Prism build ships every grammar — load it on
// demand so it stays out of page-initial JS chunks.
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);
import { toast } from 'sonner';
import { MermaidDiagram } from './MermaidDiagram';

interface CodeViewerProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

// Normalise the stored language name to a Prism grammar id so the
// highlighter picks the right tokens (and falls back gracefully).
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  vue: 'markup',
  cs: 'csharp',
  'c++': 'cpp',
  cc: 'cpp',
  golang: 'go',
  rs: 'rust',
  kt: 'kotlin',
  md: 'markdown',
  dockerfile: 'docker',
  tf: 'hcl',
  terraform: 'hcl',
};

function normalizeLanguage(language: string): string {
  const l = (language || '').toLowerCase().trim();
  return LANGUAGE_ALIASES[l] || l || 'text';
}

export function CodeViewer({
  code,
  language,
  filename,
  showLineNumbers = true,
  maxHeight = '600px',
  className = '',
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  }, [code]);

  const lang = normalizeLanguage(language);

  // Mermaid: render the source as a diagram instead of highlighted code.
  if (lang === 'mermaid') {
    return <MermaidDiagram chart={code} className={className} />;
  }

  return (
    <div className={`rounded-lg overflow-hidden border border-white/10 ${className}`}>
      {/* Header: VSCode-style title bar with traffic lights + filename/lang */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/[0.06]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <span className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="ml-2 truncate text-xs font-medium text-slate-400">
            {filename || language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {filename && (
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </a>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code body — VSCode Dark+ theme, real Prism tokenisation */}
      <div className="overflow-auto bg-[#1e1e1e]" style={{ maxHeight }}>
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem',
            background: 'transparent',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
          }}
          codeTagProps={{ style: { fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)' } }}
          lineNumberStyle={{
            color: '#4b5263',
            minWidth: '2.75em',
            paddingRight: '1em',
            userSelect: 'none',
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
