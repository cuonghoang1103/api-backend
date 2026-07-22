'use client';

import { useRef } from 'react';

/**
 * Self-contained code editor: a transparent <textarea> over a syntax-highlighted
 * <pre>. No CDN / web-worker dependency (Monaco was blocked by the site CSP and
 * hung on "Loading…"). Highlighting is a tiny JS tokenizer — good enough for the
 * short algorithm snippets shown here.
 */
const FONT =
  "13px/1.55 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const PAD = 12;

const KEYWORDS =
  'const|let|var|function|return|if|else|for|while|do|break|continue|new|of|in|typeof|instanceof|this|null|true|false|undefined|class|extends|super|try|catch|finally|throw|switch|case|default|yield|await|async|delete|void';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function kw(escaped: string): string {
  return escaped.replace(new RegExp(`\\b(${KEYWORDS})\\b`, 'g'), '<span style="color:#569cd6">$1</span>');
}

function highlight(code: string): string {
  // Match comments, strings, and numbers as whole tokens; keyword-highlight the gaps.
  const re = /(\/\/[^\n]*)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)/g;
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    out += kw(escapeHtml(code.slice(last, m.index)));
    if (m[1]) out += `<span style="color:#6a9955">${escapeHtml(m[1])}</span>`;
    else if (m[2]) out += `<span style="color:#ce9178">${escapeHtml(m[2])}</span>`;
    else if (m[3]) out += `<span style="color:#b5cea8">${escapeHtml(m[3])}</span>`;
    last = m.index + m[0].length;
  }
  out += kw(escapeHtml(code.slice(last)));
  return out;
}

export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
  language?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const sync = () => {
    if (taRef.current && preRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart, end = el.selectionEnd;
      const next = value.slice(0, s) + '  ' + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };

  const shared: React.CSSProperties = {
    margin: 0,
    border: 0,
    padding: PAD,
    font: FONT,
    tabSize: 2,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#1e1e1e' }}>
      <pre
        ref={preRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-auto"
        style={{ ...shared, color: '#d4d4d4' }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(value) + '\n' }} />
      </pre>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={sync}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent outline-none"
        style={{ ...shared, color: 'transparent', caretColor: '#fff' }}
      />
    </div>
  );
}
