import { cleanMermaid } from '@/components/exp-hub/MermaidDiagram';

/**
 * Turn ```mermaid fences inside a server-rendered HTML blob into real SVG.
 *
 * The case-study body arrives as one pre-rendered HTML string and is mounted
 * with `dangerouslySetInnerHTML`. React does not reconcile the children of
 * such a node — it only rewrites the whole subtree when the `__html` string
 * changes — so we are free to mutate those nodes in place. That matters:
 * swapping the fences for React portals would put two owners on the same DOM
 * nodes, and wrapping the chunks in extra elements would break the
 * `.case-study-body > * + *` vertical-rhythm rule that styles the article.
 *
 * The diagram source is read with `textContent`, which decodes the entities
 * remark introduced (`--&gt;` → `-->`). Handing mermaid the raw innerHTML
 * instead breaks every arrow in the diagram.
 *
 * Failures degrade to the original code block: an unparseable diagram is
 * still readable as text, which beats a red error box mid-article.
 */
export async function renderMermaidBlocks(root: HTMLElement): Promise<void> {
  const blocks = Array.from(
    root.querySelectorAll<HTMLElement>('code.language-mermaid')
  );
  if (blocks.length === 0) return;

  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict', // no raw HTML / click handlers from source
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    // Without this mermaid injects its own "Syntax error in text" SVG
    // straight into <body> on failure.
    suppressErrorRendering: true,
  });

  for (const [i, code] of blocks.entries()) {
    // Guard against a re-entrant call (React re-mounted the same HTML while a
    // previous pass was still awaiting the mermaid import).
    if (!code.isConnected) continue;
    const block = code.parentElement?.tagName === 'PRE' ? code.parentElement : code;
    const source = code.textContent ?? '';
    if (!source.trim()) continue;

    // Unique per element so two diagrams never collide on mermaid's <svg id>.
    const id = `mmd-body-${i}-${Math.random().toString(36).slice(2, 8)}`;
    let svg: string;
    try {
      // Render as authored FIRST so a valid diagram is never altered; only
      // then fall back to the best-effort repair.
      try {
        ({ svg } = await mermaid.render(id, source.trim()));
      } catch {
        document.getElementById(`d${id}`)?.remove();
        ({ svg } = await mermaid.render(id, cleanMermaid(source)));
      }
    } catch {
      document.getElementById(`d${id}`)?.remove();
      continue; // leave the code block in place
    }

    if (!code.isConnected) continue;
    const wrap = document.createElement('div');
    wrap.className =
      'my-6 flex justify-center overflow-x-auto rounded-lg border border-white/10 bg-[#0d1117] p-4 [&_svg]:max-w-full [&_svg]:h-auto';
    wrap.innerHTML = svg;
    block.replaceWith(wrap);
  }
}
