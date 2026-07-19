/**
 * codelab-mermaid-fix.mjs — one-off: repair broken AI-generated mermaid in
 * Code Lab exercise diagrams (CodeExercise.diagramMermaid) and lesson blocks
 * (CodeModule.lessonBlocks[].code where type='mermaid').
 *
 * Applies the SAME sanitizeMermaid the frontend uses (strip fences, split
 * concatenated diagrams, drop stray trailing `end`, quote risky flowchart
 * labels, normalize \n / escaped quotes) plus a hand-verified override map for
 * the few malformed classDiagrams the sanitizer can't repair.
 *
 *   node scripts/codelab-mermaid-fix.mjs            # apply
 *   node scripts/codelab-mermaid-fix.mjs --dry      # preview only
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry');

const DIAGRAM_HEADERS = ['graph','flowchart','sequenceDiagram','classDiagram','stateDiagram-v2','stateDiagram','erDiagram','gantt','pie','journey','gitGraph','mindmap','timeline','quadrantChart','requirementDiagram','C4Context','sankey-beta','xychart-beta','block-beta'];

function quoteLabels(body) {
  const shapes = [['[(',')]'],['((','))'],['{{','}}'],['[[',']]'],['[/','/]'],['[\\','\\]'],['(',')'],['[',']'],['{','}']];
  let out = '', i = 0; const n = body.length;
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
      const needs = /[()"'%<>=×÷#&\n\[\]{}]/.test(text) || text.includes(':') || text.includes('\\n');
      if (isQuoted) {
        const inner = trimmed.slice(1, -1).replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\\"/g, '&quot;').replace(/"/g, '&quot;');
        out += openStr + '"' + inner + '"' + closeStr;
      } else if (needs) {
        text = text.replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\\"/g, '&quot;').replace(/"/g, '&quot;');
        out += openStr + '"' + text + '"' + closeStr;
      } else {
        out += openStr + text + closeStr;
      }
      i = end + closeStr.length; matched = true; break;
    }
    if (!matched) { out += body[i]; i++; }
  }
  out = out.replace(/\|([^|]*)\|/g, (m, t) => {
    const tr = t.trim();
    if (tr.startsWith('"')) return m;
    if (/[()"']/.test(t)) return '|"' + t.replace(/"/g, '&quot;') + '"|';
    return m;
  });
  return out;
}

function sanitizeMermaid(raw) {
  let s = (raw || '').trim();
  if (!s) return s;
  s = s.replace(/^```(?:mermaid)?\s*/i, '').replace(/\s*```$/i, '').trim();
  s = s.split('\n').filter((line) => !/^(caption|note|description|explanation)\s*:/i.test(line.trim())).join('\n');
  const re = new RegExp(`(^|[^A-Za-z])(${DIAGRAM_HEADERS.join('|')})\\b`, 'g');
  const pos = []; let m;
  while ((m = re.exec(s)) !== null) { pos.push(m.index + (m[1] ? m[1].length : 0)); if (pos.length >= 2) break; }
  if (pos.length >= 2) s = s.slice(0, pos[1]).trim();
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

// hand-verified corrections (parser-checked) for diagrams sanitize can't fix
const exerciseOverrides = {
  312: `classDiagram\n    class AnagramGrouper {\n        +dict anagram_dict\n        +group_anagrams(words) list\n    }\n    note for AnagramGrouper "group_anagrams(words): use sorted(word) as a tuple key;\\nwords sharing the same key are anagrams and grouped together"`,
  319: `classDiagram\n    class Record {\n        +str name\n        +list scores\n        +float attendance\n    }\n    class GradeReport {\n        +list students\n        +float class_average\n        +list top_performers\n        +dict subject_averages\n        +list unique_scores\n        +generate_grade_report(records) Report\n    }\n    GradeReport --> Record : processes`,
  346: `classDiagram\n    class utils {\n        +get_extension(filename) str\n        +ensure_directory(path)\n        +format_report(stats) str\n    }\n    class core {\n        +scan_directory(path) dict\n        +organize(path, dry_run) dict\n        -EXTENSION_CATEGORIES dict\n    }\n    class cli {\n        +main()\n    }\n    class pkg_init["__init__"]\n    core --> utils : uses\n    cli --> core : uses\n    pkg_init ..> core : exports\n    pkg_init ..> utils : exports`,
  356: `classDiagram\n    class CacheInfo {\n        +int hits\n        +int misses\n        +int cached\n    }\n    class RateLimitExceeded {\n        +float retry_after\n    }\n    class Memoize["memoize decorator"] {\n        +ttl\n        +func\n        -cache dict\n        -hits int\n        -misses int\n    }\n    Memoize o-- CacheInfo\n    Memoize o-- RateLimitExceeded`,
};
const lessonOverrides = {
  '256:25': `flowchart LR\n    subgraph Math[Math Students]\n        M1[Alice]\n        M2[Bob]\n        M3[Charlie]\n        M4[David]\n    end\n    subgraph Physics[Physics Students]\n        P1[Charlie]\n        P2[David]\n        P3[Eve]\n        P4[Frank]\n    end\n    M3 --- P1\n    M4 --- P2\n    style M3 fill:#bbf,color:#000\n    style M4 fill:#bbf,color:#000\n    style P1 fill:#ffe0a0,color:#000\n    style P2 fill:#ffe0a0,color:#000\n    linkStyle 0,1 stroke:#f00,stroke-width:3px`,
  '256:31': `flowchart LR\n    A["Input: range(10)"] --> B{For each x}\n    B --> C{"x**2"}\n    C --> D{"Filter: if x % 2 == 0"}\n    D --> E["x**2 for evens"]\n    F["Input: ['apple', 'banana', ...]"] --> G{For each word}\n    G --> H{"len(word)"}\n    H --> I[Collect to set]\n    style B fill:#bbf,color:#000\n    style G fill:#ffe0a0,color:#000\n    style E fill:#9f9,color:#000\n    style I fill:#9f9,color:#000`,
};

let exFixed = 0, exOvr = 0, lsFixed = 0, lsOvr = 0;

// ---- exercises ----
const exercises = await prisma.codeExercise.findMany({
  where: { diagramMermaid: { not: null } },
  select: { id: true, diagramMermaid: true },
});
for (const ex of exercises) {
  const orig = ex.diagramMermaid || '';
  let next = exerciseOverrides[ex.id] ?? sanitizeMermaid(orig);
  const isOverride = exerciseOverrides[ex.id] != null;
  if (next !== orig) {
    if (isOverride) exOvr++; else exFixed++;
    if (!DRY) await prisma.codeExercise.update({ where: { id: ex.id }, data: { diagramMermaid: next } });
  }
}

// ---- lesson blocks ----
const modules = await prisma.codeModule.findMany({
  where: { lessonBlocks: { not: null } },
  select: { id: true, lessonBlocks: true },
});
for (const mod of modules) {
  const blocks = Array.isArray(mod.lessonBlocks) ? mod.lessonBlocks : null;
  if (!blocks) continue;
  let changed = false;
  const next = blocks.map((b, idx) => {
    if (!b || b.type !== 'mermaid' || typeof b.code !== 'string') return b;
    const key = `${mod.id}:${idx}`;
    const fixed = lessonOverrides[key] ?? sanitizeMermaid(b.code);
    if (fixed !== b.code) {
      changed = true;
      if (lessonOverrides[key]) lsOvr++; else lsFixed++;
      return { ...b, code: fixed };
    }
    return b;
  });
  if (changed && !DRY) await prisma.codeModule.update({ where: { id: mod.id }, data: { lessonBlocks: next } });
}

console.log(`[mermaid-fix] exercises: ${exFixed} sanitized + ${exOvr} override | lesson blocks: ${lsFixed} sanitized + ${lsOvr} override ${DRY ? '(DRY)' : ''}`);
await prisma.$disconnect();
