/**
 * CT Work — CTW Diagram (10/10/2026): phần THUẦN của Diagram Studio (không DB, test ở diagrams.test.ts).
 *
 *   - Hằng số: định dạng (MERMAID | EXCALIDRAW), loại sơ đồ, trạng thái.
 *   - Đọc Mermaid: dò loại theo dòng đầu, KIỂM CÚ PHÁP (một bộ kiểm có cấu trúc cho đúng phần ngữ pháp CT Work sinh ra:
 *     sequence / flowchart / er / class / state + kiểm khối mở-đóng cho mọi loại) — máy chủ không chạy được mermaid thật
 *     (cần DOM), nên trình duyệt chạy `mermaid.parse` thật lần nữa trước khi người duyệt bấm Approve.
 *   - Rút tên thực thể (participant / entity / class / state / nút) để KIỂM "mọi thực thể có nguồn" và đánh dấu "giả định".
 *   - Khối nhúng trong Docs: dòng đầu `%% ctw-diagram:<id>@latest|@<v>` — mermaid coi `%%` là chú thích nên trang vẫn vẽ
 *     được, bản xuất Word/PDF (vẽ PNG ở trình duyệt) vẫn chạy y như khối Mermaid thường.
 */

export const DIAGRAM_FORMATS = ['MERMAID', 'EXCALIDRAW'] as const;
export type DiagramFormat = (typeof DIAGRAM_FORMATS)[number];

export const DIAGRAM_TYPES = [
  'SEQUENCE', 'USE_CASE', 'ERD', 'CLASS', 'ACTIVITY', 'STATE', 'DEPLOYMENT', 'ARCHITECTURE', 'DATA_FLOW', 'SWIMLANE',
  'GANTT', 'JOURNEY', 'TIMELINE', 'MINDMAP', 'SCREEN_FLOW', 'FLOWCHART', 'WHITEBOARD', 'OTHER',
] as const;
export type DiagramType = (typeof DIAGRAM_TYPES)[number];

export const DIAGRAM_TYPE_LABEL: Record<DiagramType, string> = {
  SEQUENCE: 'Sequence', USE_CASE: 'Use case', ERD: 'Entity relationship (ERD)', CLASS: 'Class', ACTIVITY: 'Activity',
  STATE: 'State machine', DEPLOYMENT: 'Deployment', ARCHITECTURE: 'Architecture', DATA_FLOW: 'Data flow', SWIMLANE: 'Swimlane',
  GANTT: 'Gantt', JOURNEY: 'User journey', TIMELINE: 'Timeline', MINDMAP: 'Mind map', SCREEN_FLOW: 'Screen flow',
  FLOWCHART: 'Flowchart', WHITEBOARD: 'Whiteboard', OTHER: 'Other',
};

export const DIAGRAM_STATUSES = ['PROPOSED', 'DRAFT', 'APPROVED'] as const;
export type DiagramStatus = (typeof DIAGRAM_STATUSES)[number];

/** Loại AI vẽ được từ dữ liệu dự án (lệnh diagram_generate). */
export const GENERATABLE = ['SEQUENCE', 'USE_CASE', 'ERD', 'CLASS', 'ACTIVITY', 'STATE', 'SCREEN_FLOW', 'DEPLOYMENT', 'ARCHITECTURE', 'DATA_FLOW'] as const;
export type GeneratableType = (typeof GENERATABLE)[number];

export const MAX_SOURCE = 200_000;
export const MAX_MERMAID = 60_000;

export const diagramKey = (n: number) => `D-${n}`;

// ─── Dò loại ─────────────────────────────────────────────────────

/** Bỏ front-matter `---…---`, dòng chú thích `%%`, chỉ thị `%%{…}%%` ⇒ các dòng có nghĩa (giữ số dòng gốc). */
export function meaningfulLines(src: string): Array<{ n: number; text: string }> {
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out: Array<{ n: number; text: string }> = [];
  let i = 0;
  // front-matter chỉ ở ĐẦU (sau dòng trống/chú thích)
  while (i < lines.length && (!lines[i].trim() || /^\s*%%/.test(lines[i]))) i++;
  if (lines[i]?.trim() === '---') {
    let j = i + 1;
    while (j < lines.length && lines[j].trim() !== '---') j++;
    if (j < lines.length) i = j + 1;
  }
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith('%%')) continue;
    out.push({ n: i + 1, text: t });
  }
  return out;
}

/** Từ khoá đầu ⇒ loại ngữ pháp Mermaid. */
export type MermaidKind = 'sequence' | 'flowchart' | 'class' | 'er' | 'state' | 'gantt' | 'journey' | 'timeline' | 'mindmap' | 'c4' | 'architecture' | 'block' | 'pie' | 'quadrant' | 'gitgraph' | 'requirement' | 'sankey' | 'xychart' | 'kanban' | 'packet';

const HEADERS: Array<[RegExp, MermaidKind]> = [
  [/^sequenceDiagram\b/, 'sequence'], [/^(flowchart|graph)(\s+(TB|TD|BT|RL|LR))?\s*;?$/, 'flowchart'], [/^classDiagram(-v2)?\b/, 'class'],
  [/^erDiagram\b/, 'er'], [/^stateDiagram(-v2)?\b/, 'state'], [/^gantt\b/, 'gantt'], [/^journey\b/, 'journey'], [/^timeline\b/, 'timeline'],
  [/^mindmap\b/, 'mindmap'], [/^C4(Context|Container|Component|Dynamic|Deployment)\b/, 'c4'], [/^architecture-beta\b/, 'architecture'],
  [/^block-beta\b/, 'block'], [/^pie\b/, 'pie'], [/^quadrantChart\b/, 'quadrant'], [/^gitGraph\b/, 'gitgraph'],
  [/^requirementDiagram\b/, 'requirement'], [/^sankey-beta\b/, 'sankey'], [/^xychart-beta\b/, 'xychart'], [/^kanban\b/, 'kanban'], [/^packet-beta\b/, 'packet'],
];

export function mermaidKind(src: string): MermaidKind | null {
  const first = meaningfulLines(src)[0]?.text ?? '';
  for (const [re, k] of HEADERS) if (re.test(first)) return k;
  return null;
}

/** Loại sơ đồ CT Work hợp với nguồn Mermaid (khi nhập tệp / người dán mã). */
export function typeFromMermaid(src: string): DiagramType {
  const k = mermaidKind(src);
  const map: Partial<Record<MermaidKind, DiagramType>> = {
    sequence: 'SEQUENCE', class: 'CLASS', er: 'ERD', state: 'STATE', gantt: 'GANTT', journey: 'JOURNEY', timeline: 'TIMELINE',
    mindmap: 'MINDMAP', c4: 'ARCHITECTURE', architecture: 'ARCHITECTURE', block: 'ARCHITECTURE', flowchart: 'FLOWCHART',
  };
  return (k && map[k]) || 'OTHER';
}

/** Loại ngữ pháp mà mỗi loại CT Work dùng (để kiểm "sequence phải là sequenceDiagram"…). */
export const EXPECTED_KIND: Partial<Record<DiagramType, MermaidKind[]>> = {
  SEQUENCE: ['sequence'], USE_CASE: ['flowchart'], ERD: ['er'], CLASS: ['class'], ACTIVITY: ['flowchart', 'state'],
  STATE: ['state'], DEPLOYMENT: ['flowchart', 'c4', 'architecture', 'block'], ARCHITECTURE: ['flowchart', 'c4', 'architecture', 'block'],
  DATA_FLOW: ['flowchart'], SWIMLANE: ['flowchart'], GANTT: ['gantt'], JOURNEY: ['journey'], TIMELINE: ['timeline'], MINDMAP: ['mindmap'],
  SCREEN_FLOW: ['flowchart'], FLOWCHART: ['flowchart'],
};

// ─── Kiểm cú pháp ────────────────────────────────────────────────

export interface LintIssue { line: number; message: string }
export interface LintResult { ok: boolean; kind: MermaidKind | null; errors: LintIssue[] }

const SEQ_ARROW = '(?:-{1,2}>>|-{1,2}>|-{1,2}x|-{1,2}\\)|<<-{1,2}>>)';
const SEQ_MSG = new RegExp(`^([^\\s:;][^:;]*?)\\s*${SEQ_ARROW}\\s*[+-]?\\s*([^:;]+?)\\s*:(.*)$`);
const SEQ_OPEN = /^(alt|opt|loop|par|critical|break|rect|box)\b/;
const SEQ_MID = /^(else|and|option)\b/;

function bracketBalanced(s: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const st: string[] = [];
  let quote = false;
  for (const ch of s) {
    if (ch === '"') { quote = !quote; continue; }
    if (quote) continue;
    if (ch === '(' || ch === '[' || ch === '{') st.push(ch);
    else if (ch in pairs) { if (st.pop() !== pairs[ch]) return false; }
  }
  return !st.length && !quote;
}

/**
 * Kiểm cú pháp có cấu trúc. Chặt với ngữ pháp CT Work tự sinh (sequence/er/flowchart/class/state), lỏng với loại khác
 * (chỉ dòng đầu + khối/ngoặc cân). Không thay mermaid.parse — trình duyệt chạy thêm parse thật.
 */
export function lintMermaid(src: string): LintResult {
  const errors: LintIssue[] = [];
  const raw = String(src ?? '');
  if (!raw.trim()) return { ok: false, kind: null, errors: [{ line: 1, message: 'The diagram is empty' }] };
  if (raw.length > MAX_MERMAID) errors.push({ line: 1, message: `The diagram is too long (${raw.length} characters, max ${MAX_MERMAID})` });
  if (/<\s*script|javascript:/i.test(raw)) errors.push({ line: 1, message: 'Scripts are not allowed in diagrams' });
  const lines = meaningfulLines(raw);
  const kind = mermaidKind(raw);
  if (!kind) {
    errors.push({ line: lines[0]?.n ?? 1, message: `Unknown diagram type "${(lines[0]?.text ?? '').slice(0, 40)}" — start with sequenceDiagram, flowchart LR, erDiagram, classDiagram, stateDiagram-v2, gantt…` });
    return { ok: false, kind, errors };
  }
  const body = lines.slice(1);
  for (const l of body) if (/^click\s/.test(l.text)) errors.push({ line: l.n, message: '"click" handlers are not allowed' });

  if (kind === 'sequence') {
    const stack: Array<{ kw: string; line: number }> = [];
    for (const { n, text } of body) {
      if (/^(participant|actor)\s+\S/.test(text) || /^(autonumber|activate|deactivate|title|accTitle|accDescr|create|destroy|links?|properties|details)\b/.test(text)) continue;
      if (/^Note\s+(left of|right of|over)\s+[^:]+:/i.test(text)) continue;
      if (SEQ_OPEN.test(text)) { stack.push({ kw: SEQ_OPEN.exec(text)![1], line: n }); continue; }
      if (SEQ_MID.test(text)) {
        const top = stack[stack.length - 1];
        const kw = SEQ_MID.exec(text)![1];
        const ok = top && ((kw === 'else' && (top.kw === 'alt' || top.kw === 'critical')) || (kw === 'and' && top.kw === 'par') || (kw === 'option' && top.kw === 'critical'));
        if (!ok) errors.push({ line: n, message: `"${kw}" outside a matching block` });
        continue;
      }
      if (text === 'end') { if (!stack.pop()) errors.push({ line: n, message: '"end" without an open block (alt/opt/loop/par/critical/break)' }); continue; }
      const m = SEQ_MSG.exec(text);
      if (m) {
        if (!m[1].trim() || !m[2].trim()) errors.push({ line: n, message: 'A message needs a sender and a receiver' });
        continue;
      }
      errors.push({ line: n, message: `Cannot read "${text.slice(0, 60)}" — a message looks like "A->>B: text"` });
    }
    for (const s of stack) errors.push({ line: s.line, message: `"${s.kw}" is never closed with "end"` });
  } else if (kind === 'er') {
    let inEntity: number | null = null;
    for (const { n, text } of body) {
      if (inEntity !== null) {
        if (text === '}') { inEntity = null; continue; }
        if (!/^[\w()[\],-]+(?:\[\])?\s+[\w*-]+(\s+(PK|FK|UK)(\s*,\s*(PK|FK|UK))*)?(\s+"[^"]*")?$/.test(text)) errors.push({ line: n, message: `Attribute "${text.slice(0, 60)}" should look like "string name PK"` });
        continue;
      }
      if (/^(title|direction|accTitle|accDescr|style|classDef|class)\b/.test(text)) continue;
      if (/^[\w-]+(\["[^"]*"\])?\s*\{$/.test(text)) { inEntity = n; continue; }
      if (/^[\w-]+(\["[^"]*"\])?\s*\{\s*\}$/.test(text)) continue;
      if (/^[\w-]+(\["[^"]*"\])?\s*$/.test(text)) continue;
      if (/^[\w-]+\s+(\|o|\|\||\}o|\}\||o\||o\{|\|\{)?(--|\.\.)(o\||\|\||o\{|\|\{|\|o|\}o|\}\|)?\s+[\w-]+\s*:\s*.+$/.test(text) && /(--|\.\.)/.test(text)) {
        if (!/^[\w-]+\s+(\|o|\|\||\}o|\}\|)(--|\.\.)(o\||\|\||o\{|\|\{)\s+[\w-]+\s*:/.test(text)) errors.push({ line: n, message: `Relationship "${text.slice(0, 60)}" needs cardinality on both ends, e.g. "A ||--o{ B : has"` });
        continue;
      }
      errors.push({ line: n, message: `Cannot read "${text.slice(0, 60)}" in an ER diagram` });
    }
    if (inEntity !== null) errors.push({ line: inEntity, message: 'An entity block is never closed with "}"' });
  } else if (kind === 'flowchart') {
    const stack: number[] = [];
    for (const { n, text } of body) {
      if (/^subgraph\b/.test(text)) { stack.push(n); continue; }
      if (text === 'end') { if (stack.pop() === undefined) errors.push({ line: n, message: '"end" without "subgraph"' }); continue; }
      if (/^(classDef|class|style|linkStyle|direction|accTitle|accDescr)\b/.test(text)) continue;
      if (!bracketBalanced(text.replace(/\|[^|]*\|/g, ''))) errors.push({ line: n, message: `Unbalanced brackets or quotes in "${text.slice(0, 60)}"` });
    }
    for (const s of stack) errors.push({ line: s, message: '"subgraph" is never closed with "end"' });
  } else if (kind === 'class' || kind === 'state') {
    let depth = 0;
    for (const { n, text } of body) {
      const opens = (text.match(/\{/g) ?? []).length;
      const closes = (text.match(/\}/g) ?? []).length;
      depth += opens - closes;
      if (depth < 0) { errors.push({ line: n, message: 'Closing "}" without an opening "{"' }); depth = 0; }
      if (kind === 'state' && /-->/.test(text) && !/^(\[\*\]|[\w.-]+)\s*-->\s*(\[\*\]|[\w.-]+)\s*(:.*)?$/.test(text)) errors.push({ line: n, message: `Transition "${text.slice(0, 60)}" should look like "A --> B : event"` });
    }
    if (depth > 0) errors.push({ line: lines[lines.length - 1]?.n ?? 1, message: 'A "{" block is never closed' });
  } else {
    for (const { n, text } of body) if (!bracketBalanced(text)) errors.push({ line: n, message: `Unbalanced brackets or quotes in "${text.slice(0, 60)}"` });
  }
  return { ok: !errors.length, kind, errors: errors.slice(0, 30) };
}

// ─── Rút tên thực thể ────────────────────────────────────────────

const unq = (s: string) => s.trim().replace(/^"(.*)"$/, '$1').trim();

/** sequence: id ⇒ nhãn (khai báo participant/actor + mọi đầu mũi tên). */
export function sequenceParticipants(src: string): Map<string, { label: string; actor: boolean; declared: boolean }> {
  const out = new Map<string, { label: string; actor: boolean; declared: boolean }>();
  for (const { text } of meaningfulLines(src).slice(1)) {
    const d = /^(participant|actor)\s+(.+?)(?:\s+as\s+(.+))?$/.exec(text);
    if (d) {
      const id = unq(d[2]);
      out.set(id, { label: unq(d[3] ?? d[2]), actor: d[1] === 'actor', declared: true });
      continue;
    }
    const m = SEQ_MSG.exec(text);
    if (m) for (const p of [m[1], m[2]].map((x) => unq(x.replace(/^[+-]/, '')))) if (!out.has(p)) out.set(p, { label: p, actor: false, declared: false });
  }
  return out;
}

export function sequenceMessages(src: string): Array<{ from: string; to: string; text: string; line: number }> {
  const out: Array<{ from: string; to: string; text: string; line: number }> = [];
  for (const { n, text } of meaningfulLines(src).slice(1)) {
    const m = SEQ_MSG.exec(text);
    if (m) out.push({ from: unq(m[1]), to: unq(m[2].replace(/^[+-]/, '')), text: m[3].trim(), line: n });
  }
  return out;
}

/** Số khối alt/opt/break (để kiểm luồng thay thế/ngoại lệ có mặt). */
export function sequenceBlocks(src: string): Array<{ kw: string; label: string }> {
  return meaningfulLines(src).slice(1).filter((l) => /^(alt|opt|break|else|critical|loop)\b/.test(l.text))
    .map((l) => { const m = /^(\w+)\s*(.*)$/.exec(l.text)!; return { kw: m[1], label: m[2] }; });
}

/** er: tên thực thể (kể cả nhãn alias `X["Nhãn"]`). */
export function erEntities(src: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const { text } of meaningfulLines(src).slice(1)) {
    const e = /^([\w-]+)(?:\["([^"]*)"\])?\s*\{/.exec(text) ?? /^([\w-]+)\["([^"]*)"\]\s*$/.exec(text);
    if (e) { out.set(e[1], e[2] ?? out.get(e[1]) ?? e[1]); continue; }
    const r = /^([\w-]+)\s+\S*(?:--|\.\.)\S*\s+([\w-]+)\s*:/.exec(text);
    if (r) for (const x of [r[1], r[2]]) if (!out.has(x)) out.set(x, x);
  }
  return out;
}

export function classNames(src: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const { text } of meaningfulLines(src).slice(1)) {
    const c = /^class\s+([\w~<>]+)(?:\["([^"]*)"\])?/.exec(text);
    if (c) { out.set(c[1].replace(/~.*$/, ''), c[2] ?? c[1].replace(/~.*$/, '')); continue; }
    const r = /^([\w]+)\s*(?:"[^"]*"\s*)?(<\|--|--\|>|\*--|--\*|o--|--o|-->|<--|\.\.>|<\.\.|\.\.\|>|<\|\.\.|--|\.\.)\s*(?:"[^"]*"\s*)?([\w]+)/.exec(text);
    if (r) for (const x of [r[1], r[3]]) if (!out.has(x)) out.set(x, x);
  }
  return out;
}

export function stateNames(src: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const { text } of meaningfulLines(src).slice(1)) {
    const a = /^state\s+"([^"]+)"\s+as\s+([\w.-]+)/.exec(text);
    if (a) { out.set(a[2], a[1]); continue; }
    const s = /^state\s+([\w.-]+)/.exec(text);
    if (s) { if (!out.has(s[1])) out.set(s[1], s[1]); continue; }
    const t = /^(\[\*\]|[\w.-]+)\s*-->\s*(\[\*\]|[\w.-]+)/.exec(text);
    if (t) for (const x of [t[1], t[2]]) if (x !== '[*]' && !out.has(x)) out.set(x, x);
    const d = /^([\w.-]+)\s*:\s*(.+)$/.exec(text);
    if (d && !/-->/.test(text) && !out.has(d[1])) out.set(d[1], d[2]);
  }
  return out;
}

/** flowchart: id ⇒ nhãn của mọi nút có khai nhãn (`A["…"]`, `A(…)`, `A{…}`, `A[(…)]`…). */
export function flowNodes(src: string): Map<string, string> {
  const out = new Map<string, string>();
  const re = /(?:^|[\s;&>-])([A-Za-z_][\w-]*)\s*(\(\[|\[\(|\[\[|\(\(\(|\(\(|\{\{|\[\/|\[\\|>|\[|\(|\{)\s*("?)(.*?)\3\s*(\]\)|\)\]|\]\]|\)\)\)|\)\)|\}\}|\/\]|\\\]|\]|\)|\})/g;
  for (const { text } of meaningfulLines(src).slice(1)) {
    if (/^(classDef|class|style|linkStyle|direction)\b/.test(text)) continue;
    const sub = /^subgraph\s+([\w-]+)\s*\["?([^"\]]*)"?\]/.exec(text);
    if (sub) continue;
    const clean = text.replace(/\|"[^"]*"\||\|[^|]*\|/g, ' ');
    for (const m of clean.matchAll(re)) if (!out.has(m[1]) && !['subgraph', 'end'].includes(m[1])) out.set(m[1], (m[4].split(/<br\s*\/?>/i).map((x) => x.replace(/«[^»]*»/g, '').trim()).find(Boolean) ?? '').trim());
  }
  return out;
}

/** Tên hiển thị của mọi thực thể chính theo ngữ pháp (để so với nguồn). */
export function entityLabels(src: string): Array<{ id: string; label: string }> {
  const k = mermaidKind(src);
  const pick = (m: Map<string, string | { label: string }>) => [...m].map(([id, v]) => ({ id, label: typeof v === 'string' ? v : v.label }));
  if (k === 'sequence') return pick(sequenceParticipants(src));
  if (k === 'er') return pick(erEntities(src));
  if (k === 'class') return pick(classNames(src));
  if (k === 'state') return pick(stateNames(src));
  if (k === 'flowchart') return pick(flowNodes(src));
  return [];
}

// ─── So khớp tên với nguồn ───────────────────────────────────────

/** Chuẩn hoá để so tên: thường, bỏ dấu, bỏ ký tự ngoài chữ/số, bỏ đuôi số nhiều đơn giản. */
export function normName(s: string): string {
  const base = String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()
    .replace(/\(assumed\)|\(giả định\)|«[^»]*»/g, '').replace(/[^a-z0-9]+/g, '');
  return base.length > 3 ? base.replace(/(ies)$/, 'y').replace(/(sses|xes|ches|shes)$/, (m) => m.slice(0, -2)).replace(/([^s])s$/, '$1') : base;
}

export const ASSUMED = '(assumed)';
export const isAssumedLabel = (s: string) => /\(assumed\)|\(giả định\)/i.test(s);

/** Tên có trong tập nguồn không (khớp sau chuẩn hoá, hoặc chuẩn hoá của tên nằm gọn trong một tên nguồn dài hơn / ngược lại khi ≥ 4 ký tự). */
export function inSource(name: string, allowed: Iterable<string>): boolean {
  const n = normName(name);
  if (!n) return true;
  for (const a of allowed) {
    const m = normName(a);
    if (!m) continue;
    if (m === n) return true;
    if (n.length >= 4 && m.length >= 4 && (m.includes(n) || n.includes(m))) return true;
  }
  return false;
}

// ─── Nhãn an toàn + đánh dấu "giả định" ─────────────────────────

/** Nhãn an toàn cho Mermaid trong ngoặc kép (bỏ ngoặc kép/xuống dòng/ký tự cú pháp). */
export const mmLabel = (s: string, max = 80) => String(s ?? '').replace(/["\n\r[\]{}|<>#;`]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) || '…';
/** Định danh an toàn (chữ/số/_). */
export const mmId = (s: string, fallback = 'N') => {
  const v = String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').replace(/[^A-Za-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
  return /^[A-Za-z]/.test(v) ? v.slice(0, 40) : `${fallback}${v}`.slice(0, 40);
};
/** Chữ của thông điệp sequence (sau dấu ":") — bỏ ";" và "#" (ký tự đặc biệt của mermaid). */
export const mmText = (s: string, max = 120) => String(s ?? '').replace(/[\n\r;#]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) || '…';

/**
 * Đánh dấu thực thể KHÔNG có nguồn ngay TRÊN sơ đồ: nhãn thêm " (assumed)". Trả nguồn mới (giữ nguyên những gì khác).
 *   sequence  `participant X as "X (assumed)"` (thêm dòng khai báo nếu chưa có)
 *   flowchart nhãn nút `X["… (assumed)"]` + lớp `assumed` (viền đứt)
 *   er        alias `X["X (assumed)"]`        class `class X["X (assumed)"]`        state `state "X (assumed)" as X`
 */
export function markAssumed(src: string, ids: string[]): string {
  if (!ids.length) return src;
  const k = mermaidKind(src);
  const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
  const headerAt = lines.findIndex((l) => l.trim() && !l.trim().startsWith('%%') && l.trim() !== '---' && HEADERS.some(([re]) => re.test(l.trim())));
  const want = new Set(ids);
  const done = new Set<string>();
  const tag = (label: string) => (isAssumedLabel(label) ? label : `${label} ${ASSUMED}`);
  if (k === 'sequence') {
    const parts = sequenceParticipants(src);
    for (let i = 0; i < lines.length; i++) {
      const d = /^(\s*)(participant|actor)\s+(.+?)(?:\s+as\s+(.+))?\s*$/.exec(lines[i]);
      if (!d) continue;
      const id = unq(d[3]);
      if (!want.has(id)) continue;
      lines[i] = `${d[1]}${d[2]} ${d[3]} as ${tag(unq(d[4] ?? d[3]))}`;
      done.add(id);
    }
    const add = ids.filter((id) => !done.has(id)).map((id) => `  participant ${id} as ${tag(parts.get(id)?.label ?? id)}`);
    lines.splice(headerAt + 1, 0, ...add);
    return lines.join('\n');
  }
  if (k === 'flowchart') {
    const nodes = flowNodes(src);
    const add = ids.map((id) => `  ${id}["${mmLabel(tag(nodes.get(id) || id), 120)}"]`);
    add.push('  classDef assumed stroke-dasharray:5 4,stroke-width:1.5px');
    add.push(`  class ${ids.join(',')} assumed`);
    return [...lines, ...add].join('\n');
  }
  if (k === 'er') {
    const ents = erEntities(src);
    for (let i = 0; i < lines.length; i++) {
      const e = /^(\s*)([\w-]+)(?:\["([^"]*)"\])?(\s*\{.*)$/.exec(lines[i]);
      if (e && want.has(e[2])) { lines[i] = `${e[1]}${e[2]}["${mmLabel(tag(e[3] ?? e[2]), 120)}"]${e[4]}`; done.add(e[2]); }
    }
    const add = ids.filter((id) => !done.has(id)).map((id) => `  ${id}["${mmLabel(tag(ents.get(id) ?? id), 120)}"]`);
    return [...lines, ...add].join('\n');
  }
  if (k === 'class') {
    const cls = classNames(src);
    for (let i = 0; i < lines.length; i++) {
      const c = /^(\s*)class\s+([\w]+)(?:\["([^"]*)"\])?(.*)$/.exec(lines[i]);
      if (c && want.has(c[2])) { lines[i] = `${c[1]}class ${c[2]}["${mmLabel(tag(c[3] ?? c[2]), 120)}"]${c[4]}`; done.add(c[2]); }
    }
    const add = ids.filter((id) => !done.has(id)).map((id) => `  class ${id}["${mmLabel(tag(cls.get(id) ?? id), 120)}"]`);
    return [...lines, ...add].join('\n');
  }
  if (k === 'state') {
    const st = stateNames(src);
    const add = ids.map((id) => `  state "${mmLabel(tag(st.get(id) ?? id), 120)}" as ${id}`);
    lines.splice(headerAt + 1, 0, ...add);
    return lines.join('\n');
  }
  return src;
}

// ─── Kiểm "mọi thực thể có nguồn" ────────────────────────────────

export interface SourceRef { kind: string; label: string; ref?: string | null }
export interface CheckResult {
  ok: boolean;
  /** Lỗi chặn (cú pháp, sai loại, thiếu khối alt/opt cho luồng thay thế…). */
  errors: string[];
  /** Thực thể không thấy trong nguồn (id, nhãn) — đã/ sẽ được đánh dấu "(assumed)". */
  unknown: Array<{ id: string; label: string }>;
  /** Mã UC-xx / BR-xx nhắc trong sơ đồ mà dự án không có. */
  badRefs: string[];
  checked: number;
}

export interface CheckInput {
  type: DiagramType;
  mermaid: string;
  /** Tên được phép (actor, UC, entity, class, state, màn, dịch vụ…). */
  allowed: string[];
  /** Id không cần đối chiếu (nút cấu trúc: start/end/decision/hệ thống…). */
  structural?: Array<string | RegExp>;
  ucNumbers?: number[];
  brNumbers?: number[];
  /** Số khối alt/opt/break tối thiểu phải có (sequence: = số luồng thay thế + ngoại lệ). */
  minBranches?: number;
}

export function checkDiagram(c: CheckInput): CheckResult {
  const errors: string[] = [];
  const lint = lintMermaid(c.mermaid);
  for (const e of lint.errors) errors.push(`Line ${e.line}: ${e.message}`);
  const want = EXPECTED_KIND[c.type];
  if (lint.kind && want && !want.includes(lint.kind)) errors.push(`A ${DIAGRAM_TYPE_LABEL[c.type].toLowerCase()} diagram must be written as ${want.join(' or ')}, not ${lint.kind}`);
  if (c.minBranches && lint.kind === 'sequence') {
    const n = sequenceBlocks(c.mermaid).filter((b) => b.kw === 'alt' || b.kw === 'opt' || b.kw === 'break' || b.kw === 'else').length;
    if (n < c.minBranches) errors.push(`The use case has ${c.minBranches} alternative/exception flow(s) but the diagram shows only ${n} alt/opt/break block(s)`);
  }
  const structural = (id: string, label: string) => (c.structural ?? []).some((s) => (typeof s === 'string' ? s === id : s.test(id) || s.test(label)));
  const ents = entityLabels(c.mermaid);
  const unknown = ents.filter((e) => !structural(e.id, e.label) && !isAssumedLabel(e.label) && !inSource(e.label, c.allowed) && !inSource(e.id, c.allowed));
  const text = c.mermaid;
  const badRefs: string[] = [];
  if (c.ucNumbers) for (const m of text.matchAll(/(?<![A-Za-z0-9])UC-?(\d{1,4})(?!\d)/gi)) if (!c.ucNumbers.includes(Number(m[1]))) badRefs.push(`UC-${m[1].padStart(2, '0')}`);
  if (c.brNumbers) for (const m of text.matchAll(/(?<![A-Za-z0-9])BR-?(\d{1,4})(?!\d)/gi)) if (!c.brNumbers.includes(Number(m[1]))) badRefs.push(`BR-${m[1].padStart(2, '0')}`);
  if (badRefs.length) errors.push(`The diagram mentions ${[...new Set(badRefs)].join(', ')} which do not exist in this project`);
  return { ok: !errors.length, errors, unknown, badRefs: [...new Set(badRefs)], checked: ents.length };
}

// ─── Khối nhúng trong Docs ───────────────────────────────────────

export const EMBED_RE = /^\s*%%\s*ctw-diagram:(\d+)@(latest|\d+)\b/;
/** Dòng nhúng ở BẤT KỲ dòng nào (nó đứng SAU front-matter nếu sơ đồ có `---title---`). */
export const EMBED_LINE_RE = /^\s*%%\s*ctw-diagram:(\d+)@(latest|\d+)\b/m;

/** Dòng nhúng: `%% ctw-diagram:<id>@latest D-3 v4 — <title>` (chú thích — mermaid bỏ qua). */
export function embedHeader(d: { id: number; number: number; title: string }, version: number, mode: 'latest' | 'pinned'): string {
  return `%% ctw-diagram:${d.id}@${mode === 'pinned' ? version : 'latest'} ${diagramKey(d.number)} v${version} — ${mmText(d.title, 120)}`;
}

/**
 * Nguồn đặt vào khối code Mermaid của trang: dòng nhúng + nguồn sơ đồ (bỏ dòng nhúng cũ nếu có). Front-matter `---…---`
 * PHẢI là dòng đầu tiên của sơ đồ (mermaid chỉ nhận nó ở đầu) ⇒ dòng nhúng đứng NGAY SAU front-matter, không phải trước.
 */
export function embedSource(d: { id: number; number: number; title: string }, version: number, source: string, mode: 'latest' | 'pinned'): string {
  const lines = String(source).replace(/\r\n?/g, '\n').split('\n').filter((l) => !EMBED_RE.test(l));
  while (lines.length && !lines[0].trim()) lines.shift();
  let at = 0;
  if (lines[0]?.trim() === '---') {
    const close = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
    if (close > 0) at = close + 1;
  }
  lines.splice(at, 0, embedHeader(d, version, mode));
  return lines.join('\n').trim();
}

export function parseEmbed(text: string): { id: number; mode: 'latest' | 'pinned'; version: number | null } | null {
  const m = EMBED_LINE_RE.exec(String(text ?? '').split('\n').slice(0, 40).join('\n'));
  if (!m) return null;
  return { id: Number(m[1]), mode: m[2] === 'latest' ? 'latest' : 'pinned', version: m[2] === 'latest' ? null : Number(m[2]) };
}

/** Alt của ảnh nhúng (Excalidraw). */
export const embedAlt = (d: { id: number; number: number; title: string }, version: number, mode: 'latest' | 'pinned') =>
  `ctw-diagram:${d.id}@${mode === 'pinned' ? version : 'latest'} ${diagramKey(d.number)} — ${String(d.title).slice(0, 120)}`;

// ─── Excalidraw JSON ─────────────────────────────────────────────

/** Kiểm JSON Excalidraw tối thiểu: {type:"excalidraw", elements:[…]} — trả bản gọn để lưu (bỏ appState thừa, giữ files). */
export function normalizeExcalidraw(raw: unknown): { ok: true; json: string; elements: number } | { ok: false; error: string } {
  let v: unknown = raw;
  if (typeof raw === 'string') {
    try { v = JSON.parse(raw); } catch { return { ok: false, error: 'This is not valid Excalidraw JSON' }; }
  }
  const o = v as { type?: unknown; elements?: unknown; appState?: Record<string, unknown>; files?: unknown };
  if (!o || typeof o !== 'object' || !Array.isArray(o.elements)) return { ok: false, error: 'Excalidraw JSON needs an "elements" array' };
  if (o.type !== undefined && o.type !== 'excalidraw') return { ok: false, error: `Unexpected type "${String(o.type)}" — expected an .excalidraw file` };
  if (o.elements.length > 5000) return { ok: false, error: 'Too many elements (max 5000)' };
  const appState = o.appState && typeof o.appState === 'object'
    ? Object.fromEntries(Object.entries(o.appState).filter(([k]) => ['viewBackgroundColor', 'gridSize', 'currentItemFontFamily', 'theme'].includes(k)))
    : {};
  const json = JSON.stringify({ type: 'excalidraw', version: 2, source: 'ct-work', elements: o.elements, appState, files: o.files && typeof o.files === 'object' ? o.files : {} });
  if (json.length > MAX_SOURCE * 20) return { ok: false, error: 'The drawing is too large (embedded images over ~4 MB)' };
  return { ok: true, json, elements: o.elements.length };
}
