'use client';

import { useEffect, useRef, useState, useId } from 'react';

interface MermaidDiagramProps {
  /** Mermaid source (flowchart / sequence / class / … diagram text). */
  chart: string;
  className?: string;
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
        });
        // mermaid.render throws on invalid syntax — caught below.
        const { svg: out } = await mermaid.render(renderId.current, chart.trim());
        if (!cancelled) setSvg(out);
      } catch (e) {
        if (!cancelled) {
          setSvg('');
          setError(e instanceof Error ? e.message : 'Không vẽ được sơ đồ');
        }
      }
    })();

    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className={`rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 ${className}`}>
        <p className="font-medium mb-1">Lỗi cú pháp Mermaid</p>
        <pre className="whitespace-pre-wrap text-xs text-rose-200/80">{error}</pre>
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
