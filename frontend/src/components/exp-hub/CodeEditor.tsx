'use client';

// CodeEditor — a lightweight syntax-highlighted code input for the admin.
// Technique: a transparent <textarea> sits exactly on top of a highlighted
// <pre> (highlight.js output). The caret + typing come from the textarea;
// the colors come from the <pre> underneath. No CDN, no heavy editor engine
// (Monaco) — highlight.js is already a project dependency.
//
// The two layers MUST share identical font metrics/padding or the colored
// text drifts from the caret; the shared `layerStyle` guarantees that.

import { useCallback, useRef } from 'react';
import hljs from './hljsCore';

// Map our stored language ids to highlight.js language names (mostly 1:1).
const HLJS_ALIASES: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', shell: 'bash',
  zsh: 'bash', yml: 'yaml', 'c++': 'cpp', cs: 'csharp', golang: 'go',
  rs: 'rust', kt: 'kotlin', md: 'markdown', tf: 'terraform', text: 'plaintext',
  plaintext: 'plaintext', mermaid: 'plaintext',
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code: string, language: string): string {
  const lang = HLJS_ALIASES[language?.toLowerCase()] ?? language?.toLowerCase();
  try {
    if (lang && lang !== 'plaintext' && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    }
  } catch { /* fall through to escaped plain text */ }
  return escapeHtml(code);
}

const FONT = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)';

const layerStyle: React.CSSProperties = {
  margin: 0,
  padding: '12px 14px',
  fontFamily: FONT,
  fontSize: '13px',
  lineHeight: '1.6',
  letterSpacing: 'normal',
  tabSize: 2,
  whiteSpace: 'pre',
  wordWrap: 'normal',
  wordBreak: 'normal',
  overflowWrap: 'normal',
  border: 0,
  boxSizing: 'border-box',
};

export function CodeEditor({
  value,
  language,
  onChange,
  placeholder,
  height = 200,
}: {
  value: string;
  language: string;
  onChange: (code: string) => void;
  placeholder?: string;
  height?: number;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Keep the highlighted layer scrolled in lock-step with the textarea.
  const syncScroll = useCallback(() => {
    const ta = taRef.current, pre = preRef.current;
    if (ta && pre) { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; }
  }, []);

  // Tab inserts two spaces instead of moving focus.
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart, en = ta.selectionEnd;
      const next = value.slice(0, s) + '  ' + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
    }
  }, [value, onChange]);

  // Trailing newline so the last line of the <pre> keeps its box (matches how
  // a textarea reserves the final empty line).
  const html = highlight(value, language) + '\n';

  return (
    <div
      className="exphub-code-editor relative overflow-hidden rounded border border-white/10 bg-[#1e1e1e]"
      style={{ height }}
    >
      <pre
        ref={preRef}
        aria-hidden
        className="hljs pointer-events-none absolute inset-0 overflow-hidden text-slate-200"
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent text-transparent caret-white placeholder:text-slate-600 focus:outline-none"
        style={{ ...layerStyle, color: 'transparent', WebkitTextFillColor: 'transparent' }}
      />
    </div>
  );
}
