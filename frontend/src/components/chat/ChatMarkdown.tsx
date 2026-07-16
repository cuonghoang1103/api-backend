'use client';

/**
 * ChatMarkdown — the ONE renderer for CuongMini assistant replies, shared by
 * the /chat page and the floating ChatModal.
 *
 * Fixes the "chưa xuống dòng / ký tự lạ / code không đẹp" complaints:
 *  - remark-breaks: single newlines from the model become real line breaks
 *    (standard markdown collapses them — the main "no line break" cause).
 *  - remark-gfm + STYLED tables/hr/task-lists (previously unstyled → looked
 *    like garbled text).
 *  - Code blocks get a header (language + copy button) and Prism syntax
 *    highlighting, lazy-loaded so it stays out of initial JS (same pattern as
 *    social/CodeBlock).
 */
import { useState } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Check, Copy } from 'lucide-react';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — ignore */ }
  };
  return (
    <div className="my-2 overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0f]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">{language || 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[#94a3b8] transition-colors hover:text-[#22d3ee]"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} className="text-[#4ade80]" /> : <Copy size={12} />}
          {copied ? 'Đã chép' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto text-xs leading-relaxed">
        <SyntaxHighlighter
          language={language || 'text'}
          style={oneDark}
          customStyle={{ margin: 0, background: 'transparent', padding: '0.75rem', fontSize: '0.75rem' }}
          codeTagProps={{ style: { fontFamily: 'var(--font-mono, ui-monospace, monospace)' } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="chat-markdown break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const text = String(children ?? '').replace(/\n$/, '');
            // Inline code (no language class AND single-line) → chip.
            if (!className && !text.includes('\n')) {
              return (
                <code className="rounded border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-1.5 py-0.5 font-mono text-xs text-[#22d3ee]" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match?.[1] ?? ''} code={text} />;
          },
          // Block code wrapper — CodeBlock already renders its own container.
          pre({ children }) {
            return <>{children}</>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#22d3ee] underline underline-offset-2 transition-colors hover:text-[#8b5cf6]">
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="mb-2 mt-3 text-base font-bold text-[#f1f5f9] first:mt-0">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-1.5 mt-3 text-[0.95rem] font-bold text-[#f1f5f9] first:mt-0">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-1 mt-2.5 text-sm font-semibold text-[#f1f5f9] first:mt-0">{children}</h3>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-[#f1f5f9]">{children}</strong>;
          },
          blockquote({ children }) {
            return <blockquote className="my-2 border-l-2 border-[#22d3ee]/40 pl-3 text-[#94a3b8]">{children}</blockquote>;
          },
          hr() {
            return <hr className="my-3 border-white/10" />;
          },
          // GFM tables — previously completely unstyled ("ký tự lạ khó nhìn").
          table({ children }) {
            return (
              <div className="my-2 overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full border-collapse text-xs">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-white/[0.04]">{children}</thead>;
          },
          th({ children }) {
            return <th className="border-b border-white/10 px-3 py-1.5 text-left font-semibold text-[#f1f5f9]">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-white/[0.05] px-3 py-1.5 align-top">{children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
