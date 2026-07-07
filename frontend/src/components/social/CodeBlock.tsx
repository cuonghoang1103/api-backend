'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Check, Copy } from 'lucide-react';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { linkifyToNodes } from '@/lib/linkify';

// react-syntax-highlighter's Prism build ships every grammar — load it on
// demand so it stays out of page-initial JS chunks.
const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((m) => m.Prism),
  { ssr: false, loading: () => null },
);

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background: '#282c34',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.8rem',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          </div>
          {filename && (
            <span className="ml-2 text-xs font-medium" style={{ color: '#abb2bf' }}>
              {filename}
            </span>
          )}
          {!filename && language && (
            <span className="ml-2 text-xs font-medium uppercase" style={{ color: '#61afef' }}>
              {language}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all"
          style={{
            color: copied ? '#28c840' : '#abb2bf',
            background: copied ? 'rgba(40,200,64,0.1)' : 'rgba(255,255,255,0.05)',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem',
            background: 'transparent',
            fontSize: '0.8rem',
            lineHeight: '1.6',
          }}
          lineNumberStyle={{
            color: '#4b5263',
            minWidth: '2.5em',
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

/**
 * Utility to extract code blocks from markdown-like text.
 * Handles ```language\ncode\n``` patterns.
 */
export function extractCodeBlocks(text: string): Array<{
  code: string;
  language: string;
  fullMatch: string;
}> {
  const blocks: Array<{ code: string; language: string; fullMatch: string }> = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
      fullMatch: match[0],
    });
  }
  return blocks;
}

/**
 * Renders text with code blocks highlighted using CodeBlock component.
 * Parts that are NOT code blocks are rendered as styled paragraphs.
 */
export function RenderContentWithCode({ content }: { content: string }) {
  const codeBlocks = extractCodeBlocks(content);

  if (codeBlocks.length === 0) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {linkifyToNodes(content)}
      </p>
    );
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  codeBlocks.forEach((block, i) => {
    // Text before code block
    const beforeText = content.slice(lastIndex, content.indexOf(block.fullMatch, lastIndex));
    if (beforeText.trim()) {
      parts.push(
        <p key={`text-${i}`} className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {linkifyToNodes(beforeText)}
        </p>
      );
    }

    // Code block
    parts.push(
      <div key={`code-${i}`} className="my-3">
        <CodeBlock code={block.code} language={block.language} />
      </div>
    );

    lastIndex = content.indexOf(block.fullMatch, lastIndex) + block.fullMatch.length;
  });

  // Remaining text
  const afterText = content.slice(lastIndex);
  if (afterText.trim()) {
    parts.push(
      <p key="text-end" className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {linkifyToNodes(afterText)}
      </p>
    );
  }

  return <div className="space-y-1">{parts}</div>;
}
