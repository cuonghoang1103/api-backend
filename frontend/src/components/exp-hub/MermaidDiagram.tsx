'use client';

import { useEffect, useRef, useState, useId } from 'react';

interface MermaidDiagramProps {
  /** Mermaid source (flowchart / sequence / class / … diagram text). */
  chart: string;
  className?: string;
}

// The diagram-type keywords mermaid recognizes at the start of a diagram.
const DIAGRAM_HEADERS = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2',
  'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey', 'gitGraph', 'mindmap',
  'timeline', 'quadrantChart', 'requirementDiagram', 'C4Context', 'sankey-beta',
  'xychart-beta', 'block-beta',
];

// Quote flowchart node/edge labels whose bare text (parens, quotes, %, newlines)
// would break the parser. Mirrors src/utils/mermaid.ts on the backend.
function quoteLabels(body: string): string {
  const shapes: Array<[string, string]> = [
    ['[(', ')]'], ['((', '))'], ['{{', '}}'], ['[[', ']]'],
    ['[/', '/]'], ['[\\', '\\]'],
    ['(', ')'], ['[', ']'], ['{', '}'],
  ];
  let out = '';
  let i = 0;
  const n = body.length;
  while (i < n) {
    let matched = false;
    for (const [openStr, closeStr] of shapes) {
      if (!body.startsWith(openStr, i)) continue;
      const start = i + openStr.length;
      const end = body.indexOf(closeStr, start);
      if (end < 0) continue;
      let text = body.slice(start, end);
      // SAFETY: stray inner bracket/pipe → the first-close heuristic mis-fired;
      // leave it untouched rather than mangle it.
      if (/[[\]{}|]/.test(text)) { out += body[i]; i++; matched = true; break; }
      const trimmed = text.trim();
      const isQuoted = trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2;
      const needs = /[()"'%<>=×÷#&\n]/.test(text) || text.includes(':') || text.includes('\\n');
      if (isQuoted) {
        const inner = trimmed.slice(1, -1)
          .replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>')
          .replace(/\\"/g, '&quot;').replace(/"/g, '&quot;');
        out += openStr + '"' + inner + '"' + closeStr;
      } else if (needs) {
        text = text
          .replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>')
          .replace(/\\"/g, '&quot;').replace(/"/g, '&quot;');
        out += openStr + '"' + text + '"' + closeStr;
      } else {
        out += openStr + text + closeStr;
      }
      i = end + closeStr.length;
      matched = true;
      break;
    }
    if (!matched) { out += body[i]; i++; }
  }
  return out.replace(/\|([^|]*)\|/g, (m, t: string) => {
    const tr = t.trim();
    if (tr.startsWith('"')) return m;
    if (/[()"']/.test(t)) return '|"' + t.replace(/"/g, '&quot;') + '"|';
    return m;
  });
}

/**
 * Repair the common ways AI-generated mermaid arrives broken so it renders
 * instead of erroring: ```fences, two diagrams glued into one ("…atesgraph LR"),
 * stray trailing `end`, and unquoted flowchart labels. Kept in sync with the
 * backend sanitizeMermaid (src/utils/mermaid.ts) — the backend now sanitizes at
 * write time; this is the client-side backstop.
 */
function cleanMermaid(raw: string): string {
  let s = (raw || '').trim();
  s = s.replace(/^```(?:mermaid)?\s*/i, '').replace(/\s*```$/i, '').trim();
  if (!s) return s;
  s = s.split('\n').filter((line) => !/^(caption|note|description|explanation)\s*:/i.test(line.trim())).join('\n');
  const headerRe = new RegExp(`(^|[^A-Za-z])(${DIAGRAM_HEADERS.join('|')})\\b`, 'g');
  const positions: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRe.exec(s)) !== null) {
    positions.push(m.index + (m[1] ? m[1].length : 0));
    if (positions.length >= 2) break;
  }
  if (positions.length >= 2) s = s.slice(0, positions[1]).trim();
  {
    const lines = s.split('\n');
    const openers = lines.filter((l) => /^\s*(subgraph|loop|alt|opt|par|critical|rect|break|box)\b/.test(l)).length;
    let endCount = lines.filter((l) => /^\s*end\s*$/.test(l)).length;
    for (let k = lines.length - 1; k >= 0 && endCount > openers; k--) {
      if (/^\s*end\s*$/.test(lines[k])) { lines.splice(k, 1); endCount--; }
    }
    s = lines.join('\n');
  }
  const head = s.split(/\s|\n/)[0];
  if (head === 'graph' || head === 'flowchart') {
    const nl = s.indexOf('\n');
    if (nl > 0) s = s.slice(0, nl) + '\n' + quoteLabels(s.slice(nl + 1));
  }
  return s.trim();
}

/**
 * Renders a Mermaid diagram from text. Mermaid is imported lazily inside the
 * effect (never at module scope) so it stays out of the SSR bundle and only
 * loads when a diagram is actually shown. Renders into an SVG string, so a
 * syntax error is caught and shown as a readable message instead of throwing.
 */
export function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // useId gives a stable, collision-free id for mermaid.render's <svg id>.
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const renderId = useRef(`mmd-${rawId}`);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'strict', // no raw HTML / click handlers from source
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          // On a syntax error mermaid otherwise injects its OWN "Syntax error
          // in text — mermaid version …" SVG straight into the DOM (it leaked
          // to the bottom of the page). Suppress it and handle errors ourselves.
          suppressErrorRendering: true,
        });
        // Render as-authored FIRST so valid diagrams are never altered; only if
        // that fails do we attempt the best-effort repair (cleanMermaid). This
        // prevents the repair heuristics from mangling a valid diagram.
        let out: string;
        try {
          ({ svg: out } = await mermaid.render(renderId.current, chart.trim()));
        } catch {
          document.getElementById(`d${renderId.current}`)?.remove();
          ({ svg: out } = await mermaid.render(renderId.current, cleanMermaid(chart)));
        }
        if (!cancelled) setSvg(out);
      } catch (e) {
        // Defence-in-depth: remove any orphan node mermaid may have appended to
        // the DOM for this render id (older builds leave a stray #d<id> element
        // even when the promise rejects).
        if (typeof document !== 'undefined') {
          document.getElementById(`d${renderId.current}`)?.remove();
        }
        if (!cancelled) {
          setSvg('');
          setError(e instanceof Error ? e.message : 'Không vẽ được sơ đồ');
        }
      }
    })();

    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    // A broken AI-generated diagram shouldn't dominate a lesson with a big red
    // parse dump. Degrade to a small muted note (the surrounding text still
    // explains the concept). Details stay in the title for anyone inspecting.
    return (
      <div
        className={`rounded-lg border border-dashed p-3 text-center text-xs text-[var(--text-muted)] ${className}`}
        style={{ borderColor: 'var(--border-color)' }}
        title={error}
      >
        Sơ đồ minh hoạ tạm thời không hiển thị được.
      </div>
    );
  }

  const wrapCls = `flex justify-center overflow-x-auto rounded-lg border border-white/10 bg-[#0d1117] p-4 [&_svg]:max-w-full [&_svg]:h-auto ${className}`;

  if (!svg) {
    return (
      <div className={wrapCls}>
        <span className="py-8 text-sm text-slate-500">Đang vẽ sơ đồ…</span>
      </div>
    );
  }

  return (
    // mermaid output is a self-generated SVG (securityLevel: strict).
    <div className={wrapCls} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
