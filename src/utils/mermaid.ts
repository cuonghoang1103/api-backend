/**
 * sanitizeMermaid — SAFE, deterministic repairs for AI-generated mermaid that
 * NEVER change an already-valid diagram. Applied at write time (lesson blocks +
 * exercise diagrams) so obvious junk is cleaned at rest.
 *
 * Only structural fixes that can't break a valid diagram:
 *   - strip ```mermaid fences / stray backticks
 *   - drop non-diagram trailing junk lines (caption:/note:/…)
 *   - split two diagrams glued into one block (keep the first)
 *   - remove stray trailing `end` lines that close no block
 *
 * NOTE: risky label-quoting (parens/quotes/newlines) is intentionally NOT done
 * here — it can mangle valid labels that legitimately contain brackets. The
 * viewer (frontend MermaidDiagram) applies that repair ONLY as a fallback, after
 * trying to render the diagram as-authored first.
 */
const DIAGRAM_HEADERS = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2',
  'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey', 'gitGraph', 'mindmap',
  'timeline', 'quadrantChart', 'requirementDiagram', 'C4Context', 'sankey-beta',
  'xychart-beta', 'block-beta',
];

export function sanitizeMermaid(raw: string | null | undefined): string {
  let s = (raw || '').trim();
  if (!s) return s;
  // strip a ```mermaid … ``` fence
  s = s.replace(/^```(?:mermaid)?\s*/i, '').replace(/\s*```$/i, '').trim();
  // drop non-diagram trailing junk lines the model sometimes appends
  s = s.split('\n')
    .filter((line) => !/^(caption|note|description|explanation)\s*:/i.test(line.trim()))
    .join('\n');
  // two diagrams glued together → keep the first
  const re = new RegExp(`(^|[^A-Za-z])(${DIAGRAM_HEADERS.join('|')})\\b`, 'g');
  const pos: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    pos.push(m.index + (m[1] ? m[1].length : 0));
    if (pos.length >= 2) break;
  }
  if (pos.length >= 2) s = s.slice(0, pos[1]).trim();
  // remove stray trailing `end` lines that close no block
  {
    const lines = s.split('\n');
    const openers = lines.filter((l) => /^\s*(subgraph|loop|alt|opt|par|critical|rect|break|box)\b/.test(l)).length;
    let endCount = lines.filter((l) => /^\s*end\s*$/.test(l)).length;
    for (let k = lines.length - 1; k >= 0 && endCount > openers; k--) {
      if (/^\s*end\s*$/.test(lines[k])) { lines.splice(k, 1); endCount--; }
    }
    s = lines.join('\n');
  }
  return s.trim();
}
