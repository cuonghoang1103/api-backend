'use client';

import { useEffect, useRef } from 'react';

/**
 * Self-contained code editor: a transparent <textarea> over a syntax-highlighted
 * <pre>. No CDN / web-worker dependency (Monaco was blocked by the site CSP and
 * hung on "Loading…"). Highlighting is a tiny JS tokenizer.
 *
 * `highlightLine` (1-indexed) paints the currently-executing line and auto-scrolls
 * it into view — driven by the playback step. Lines are fixed-height (no wrap) so
 * the band lines up exactly.
 */
const FONT =
  "13px/20px 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const PAD = 12;
const LINE_H = 20; // must match the line-height in FONT

const KEYWORDS =
  'const|let|var|function|return|if|else|for|while|do|break|continue|new|of|in|typeof|instanceof|this|null|true|false|undefined|class|extends|super|try|catch|finally|throw|switch|case|default|yield|await|async|delete|void';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function kw(escaped: string): string {
  return escaped.replace(new RegExp(`\\b(${KEYWORDS})\\b`, 'g'), '<span style="color:#569cd6">$1</span>');
}

function highlight(code: string): string {
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
  highlightLine,
}: {
  value: string;
  onChange: (v: string) => void;
  language?: string;
  highlightLine?: number | null;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  const positionBand = () => {
    const ta = taRef.current, band = bandRef.current;
    if (!ta || !band) return;
    if (!highlightLine || highlightLine < 1) { band.style.opacity = '0'; return; }
    const top = PAD + (highlightLine - 1) * LINE_H - ta.scrollTop;
    band.style.transform = `translateY(${top}px)`;
    band.style.opacity = '1';
  };

  const sync = () => {
    if (taRef.current && preRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
    positionBand();
  };

  // When the executing line changes, scroll it into view and reposition the band.
  useEffect(() => {
    const ta = taRef.current;
    if (ta && highlightLine && highlightLine >= 1) {
      const y = PAD + (highlightLine - 1) * LINE_H;
      const view = ta.clientHeight;
      if (y < ta.scrollTop + LINE_H || y > ta.scrollTop + view - LINE_H) {
        ta.scrollTop = Math.max(0, y - view / 2);
        if (preRef.current) preRef.current.scrollTop = ta.scrollTop;
      }
    }
    positionBand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightLine, value]);

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
    whiteSpace: 'pre',
  };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#1e1e1e' }}>
      {/* current-line band (behind the text, moves with scroll) */}
      <div
        ref={bandRef}
        className="pointer-events-none absolute left-0 right-0 top-0 transition-opacity"
        style={{ height: LINE_H, background: 'rgba(99,102,241,0.20)', borderLeft: '2px solid var(--accent-color, #6366f1)', opacity: 0 }}
      />
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
