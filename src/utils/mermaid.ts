/**
 * sanitizeMermaid — repair the common ways AI-generated mermaid arrives broken,
 * so a diagram renders instead of showing a parse error. Deterministic and
 * conservative (proven zero-regression on the live Code Lab dataset).
 *
 * Fixes: ```fences, two diagrams concatenated into one block, stray trailing
 * `end` lines, risky flowchart labels (parens/quotes/%/newlines → quoted), and
 * escaped \n / \" inside labels. Mirrored in the frontend MermaidDiagram.
 */
const DIAGRAM_HEADERS = [
  'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2',
  'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey', 'gitGraph', 'mindmap',
  'timeline', 'quadrantChart', 'requirementDiagram', 'C4Context', 'sankey-beta',
  'xychart-beta', 'block-beta',
];

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
      const trimmed = text.trim();
      const isQuoted = trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2;
      const needs = /[()"'%<>=×÷#&\n[\]{}]/.test(text) || text.includes(':') || text.includes('\\n');
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
  out = out.replace(/\|([^|]*)\|/g, (m, t: string) => {
    const tr = t.trim();
    if (tr.startsWith('"')) return m;
    if (/[()"']/.test(t)) return '|"' + t.replace(/"/g, '&quot;') + '"|';
    return m;
  });
  return out;
}

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
  // quote risky labels in flowchart/graph diagrams
  const head = s.split(/\s|\n/)[0];
  if (head === 'graph' || head === 'flowchart') {
    const nl = s.indexOf('\n');
    if (nl > 0) s = s.slice(0, nl) + '\n' + quoteLabels(s.slice(nl + 1));
  }
  return s.trim();
}
