/**
 * codelab-mermaid-fix.mjs — one-off: repair broken AI-generated mermaid in
 * Code Lab exercise diagrams (CodeExercise.diagramMermaid) and lesson blocks
 * (CodeModule.lessonBlocks[].code where type='mermaid').
 *
 * Applies the SAFE sanitizeMermaid (src/utils/mermaid.ts): strip fences, split
 * concatenated diagrams, drop stray trailing `end`, drop caption junk — never
 * alters a valid diagram. Plus a hand-verified override map for diagrams the
 * safe pass can't repair (malformed classDiagrams + labels with array/quote
 * literals). Idempotent.
 *
 *   node scripts/codelab-mermaid-fix.mjs            # apply
 *   node scripts/codelab-mermaid-fix.mjs --dry      # preview only
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry');

const DIAGRAM_HEADERS = ['graph','flowchart','sequenceDiagram','classDiagram','stateDiagram-v2','stateDiagram','erDiagram','gantt','pie','journey','gitGraph','mindmap','timeline','quadrantChart','requirementDiagram','C4Context','sankey-beta','xychart-beta','block-beta'];

// SAFE-ONLY sanitize (mirrors src/utils/mermaid.ts) — no label quoting.
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
  return s.trim();
}

// hand-verified corrections (parser-checked) for diagrams the safe pass can't fix
const exerciseOverrides = {
  312: `classDiagram\n    class AnagramGrouper {\n        +dict anagram_dict\n        +group_anagrams(words) list\n    }\n    note for AnagramGrouper "group_anagrams(words): use sorted(word) as a tuple key;\\nwords sharing the same key are anagrams and grouped together"`,
  319: `classDiagram\n    class Record {\n        +str name\n        +list scores\n        +float attendance\n    }\n    class GradeReport {\n        +list students\n        +float class_average\n        +list top_performers\n        +dict subject_averages\n        +list unique_scores\n        +generate_grade_report(records) Report\n    }\n    GradeReport --> Record : processes`,
  346: `classDiagram\n    class utils {\n        +get_extension(filename) str\n        +ensure_directory(path)\n        +format_report(stats) str\n    }\n    class core {\n        +scan_directory(path) dict\n        +organize(path, dry_run) dict\n        -EXTENSION_CATEGORIES dict\n    }\n    class cli {\n        +main()\n    }\n    class pkg_init["__init__"]\n    core --> utils : uses\n    cli --> core : uses\n    pkg_init ..> core : exports\n    pkg_init ..> utils : exports`,
  356: `classDiagram\n    class CacheInfo {\n        +int hits\n        +int misses\n        +int cached\n    }\n    class RateLimitExceeded {\n        +float retry_after\n    }\n    class Memoize["memoize decorator"] {\n        +ttl\n        +func\n        -cache dict\n        -hits int\n        -misses int\n    }\n    Memoize o-- CacheInfo\n    Memoize o-- RateLimitExceeded`,
  375: `flowchart TD\n    A[Input String] --> B[Split into words by delimiters]\n    B --> C[Array of words]\n    C --> D{Which format?}\n    D -->|camelCase| E[Lowercase first word]\n    E --> F[Capitalize remaining words]\n    D -->|snake_case| G[Lowercase all, join with underscore]\n    D -->|kebab-case| I[Lowercase all, join with hyphen]\n    D -->|Title Case| K[Capitalize each word, join with space]\n    F --> M[Result String]\n    G --> M\n    I --> M\n    K --> M`,
  380: `flowchart TD\n    A[Input String] --> B{Which Operation?}\n    B -->|Reverse| C[split, reverse, join]\n    B -->|Count Vowels| D[Match vowels with regex]\n    B -->|Title Case| E[split, capitalize each, join]\n    B -->|Palindrome| F[normalize, compare to reverse]\n    B -->|Word Frequency| G[split, iterate, count]\n    C --> H[Output]\n    D --> H\n    E --> H\n    F --> H\n    G --> H`,
  387: `flowchart TD\n    A[Income Input] --> B{Income at most 10000?}\n    B -->|Yes| C[Tax equals 0]\n    B -->|No| D[Compute taxable in Bracket 2]\n    D --> E{Taxable positive?}\n    E -->|Yes| F[Add tax at 10 percent]\n    E -->|No| G[Compute taxable in Bracket 3]\n    F --> G\n    G --> H{Taxable positive?}\n    H -->|Yes| I[Add tax at 22 percent]\n    H -->|No| J[Compute taxable in Bracket 4]\n    I --> J\n    J --> K{Income over 85000?}\n    K -->|Yes| L[Add tax at 32 percent]\n    K -->|No| M[Sum all bracket taxes]\n    L --> M\n    M --> N[Round to 2 decimals]\n    N --> O[Return Total Tax]`,
  378: `flowchart TD\n    A[Input: pipe-delimited contact string] --> B[Split by pipe character]\n    B --> C[Array: name, email, phone, city]\n    C --> D[Process Name: title case]\n    C --> E[Process Email: lowercase]\n    C --> F[Process Phone: remove dashes]\n    C --> G[Process City: uppercase]\n    D --> L[Build template literal]\n    E --> L\n    F --> L\n    G --> L\n    L --> M[Output Contact Card]`,
  388: `flowchart TD\n    A[Start] --> B[generateFibonacci called]\n    B --> C{count at least 1?}\n    C -->|No| D[Return empty array]\n    C -->|Yes| E[Push 0 then 1]\n    E --> F[Push sum of previous two until count reached]\n    F --> I[Return array]\n    J[findInSequence called] --> K{Loop through array}\n    K --> L{current equals target?}\n    L -->|Yes| M[Return found true with index]\n    L -->|No| N[Continue loop]\n    N --> K`,
  390: `flowchart TD\n    A[Start] --> B[Init factors list, divisor equals 3]\n    B --> C{n divisible by 2?}\n    C -->|Yes| D[Push 2, halve n]\n    D --> C\n    C -->|No| F{n greater than 1?}\n    F -->|Yes| G{n divisible by divisor?}\n    G -->|Yes| H[Push divisor, divide n]\n    H --> G\n    G -->|No| J[Increase divisor by 2]\n    J --> F\n    F -->|No| K[Return factors]\n    K --> L[End]`,
};
const lessonOverrides = {
  '256:25': `flowchart LR\n    subgraph Math[Math Students]\n        M1[Alice]\n        M2[Bob]\n        M3[Charlie]\n        M4[David]\n    end\n    subgraph Physics[Physics Students]\n        P1[Charlie]\n        P2[David]\n        P3[Eve]\n        P4[Frank]\n    end\n    M3 --- P1\n    M4 --- P2\n    style M3 fill:#bbf,color:#000\n    style M4 fill:#bbf,color:#000\n    style P1 fill:#ffe0a0,color:#000\n    style P2 fill:#ffe0a0,color:#000\n    linkStyle 0,1 stroke:#f00,stroke-width:3px`,
  '256:31': `flowchart LR\n    A["Input: range(10)"] --> B{For each x}\n    B --> C{"x**2"}\n    C --> D{"Filter: if x % 2 == 0"}\n    D --> E["x**2 for evens"]\n    F["Input: ['apple', 'banana', ...]"] --> G{For each word}\n    G --> H{"len(word)"}\n    H --> I[Collect to set]\n    style B fill:#bbf,color:#000\n    style G fill:#ffe0a0,color:#000\n    style E fill:#9f9,color:#000\n    style I fill:#9f9,color:#000`,
  '264:9': `graph LR\n    subgraph Array\n        A["Index 0: apple"]\n        B["Index 1: banana"]\n        C["Index 2: cherry"]\n    end\n    D["length = 3"]\n    A -->|access index 0| E[apple]\n    B -->|access index 1| F[banana]\n    C -->|access index 2| G[cherry]\n    style A fill:#dfd,stroke:#333\n    style B fill:#dfd,stroke:#333\n    style C fill:#dfd,stroke:#333`,
  '264:22': `flowchart LR\n    A["Array: 1, 2, 3, 4, 5"] --> B["map: x times 2"]\n    B --> C["Result: 2, 4, 6, 8, 10"]\n    style A fill:#bbf,stroke:#333\n    style B fill:#ff9,stroke:#333\n    style C fill:#bbf,stroke:#333`,
  '264:29': `flowchart LR\n    A["Array: 100, -50, 200"] --> B[reduce]\n    B --> C["sum: 0"]\n    C -->|add 100| D["sum: 100"]\n    D -->|subtract 50| E["sum: 50"]\n    E -->|add 200| F["sum: 250"]\n    style B fill:#ff9,stroke:#333\n    style F fill:#bbf,stroke:#333`,
  '264:37': `graph LR\n    subgraph Object_user\n        A["name maps to Alice"]\n        B["age maps to 30"]\n        C["isAdmin maps to false"]\n    end\n    style A fill:#dfd,stroke:#333\n    style B fill:#dfd,stroke:#333\n    style C fill:#dfd,stroke:#333`,
  '264:49': `graph TD\n    A["posts (array)"] --> B["posts index 0 (object)"]\n    A --> C["posts index 1 (object)"]\n    B --> D["id: 1"]\n    B --> E["author (nested object)"]\n    B --> F["tags (array)"]\n    E --> G["name: Alice"]\n    E --> H["followers: 150"]\n    F --> I[introduction]\n    F --> J[welcome]\n    style A fill:#bbf,stroke:#333\n    style B fill:#bbf,stroke:#333\n    style E fill:#dfd,stroke:#333`,
};

let exFixed = 0, exOvr = 0, lsFixed = 0, lsOvr = 0;

const exercises = await prisma.codeExercise.findMany({
  where: { diagramMermaid: { not: null } },
  select: { id: true, diagramMermaid: true },
});
for (const ex of exercises) {
  const orig = ex.diagramMermaid || '';
  const isOverride = exerciseOverrides[ex.id] != null;
  const next = isOverride ? exerciseOverrides[ex.id] : sanitizeMermaid(orig);
  if (next !== orig) {
    if (isOverride) exOvr++; else exFixed++;
    if (!DRY) await prisma.codeExercise.update({ where: { id: ex.id }, data: { diagramMermaid: next } });
  }
}

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
    const isOverride = lessonOverrides[key] != null;
    const fixed = isOverride ? lessonOverrides[key] : sanitizeMermaid(b.code);
    if (fixed !== b.code) {
      changed = true;
      if (isOverride) lsOvr++; else lsFixed++;
      return { ...b, code: fixed };
    }
    return b;
  });
  if (changed && !DRY) await prisma.codeModule.update({ where: { id: mod.id }, data: { lessonBlocks: next } });
}

console.log(`[mermaid-fix] exercises: ${exFixed} sanitized + ${exOvr} override | lesson blocks: ${lsFixed} sanitized + ${lsOvr} override ${DRY ? '(DRY)' : ''}`);
await prisma.$disconnect();
