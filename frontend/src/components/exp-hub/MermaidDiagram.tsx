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

/**
 * Repair the most common ways AI-generated mermaid arrives broken:
 *  - wrapped in ```mermaid fences / stray backticks
 *  - TWO diagrams concatenated into one block (e.g. a classDiagram immediately
 *    followed by "graph LR …") — keep only the first, which is what the parser
 *    was choking on ("…atesgraph LR"). We cut at the 2nd diagram header.
 */
function cleanMermaid(raw: string): string {
  let s = (raw || '').trim();
  // strip a ```mermaid … ``` fence or plain triple backticks
  s = s.replace(/^```(?:mermaid)?\s*/i, '').replace(/```$/i, '').trim();
  if (!s) return s;

  // find where the SECOND diagram header starts and truncate there. The first
  // header is the diagram's own type; a later one means two diagrams got glued.
  const headerRe = new RegExp(`(^|[^A-Za-z])(${DIAGRAM_HEADERS.join('|')})\\b`, 'g');
  const positions: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRe.exec(s)) !== null) {
    // position of the keyword itself (skip the leading boundary char, if any)
    positions.push(m.index + (m[1] ? m[1].length : 0));
    if (positions.length >= 2) break;
  }
  if (positions.length >= 2) s = s.slice(0, positions[1]).trim();
  return s;
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
        // mermaid.render throws on invalid syntax — caught below.
        const { svg: out } = await mermaid.render(renderId.current, cleanMermaid(chart));
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
