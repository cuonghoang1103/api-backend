/**
 * Code Lab — đọc đề "văn xuôi" thành phần có cấu trúc cho thẻ đề (ProblemCard).
 *
 * Hàm THUẦN (không DOM, không React) để chạy được bằng `npx tsx --test`:
 *   npx tsx --test frontend/src/components/code-lab/problemParse.test.ts
 *
 * Đề trong CSDL có hai đời:
 *   - đời mới: `examplesJson` / `constraints` có cấu trúc ⇒ thẻ đề dùng thẳng;
 *   - đời cũ / soạn tay: ví dụ nằm lẫn trong thân đề (HTML hoặc markdown) dạng
 *     "Example 1: / Input: … / Output: … / Explanation: …".
 * `extractExamples` chỉ bóc ví dụ khi CẢ KHỐI khớp mẫu đó — một đoạn văn có
 * chữ "Input:" ở giữa câu, hay một gạch đầu dòng "Input:" để trống (đặc tả
 * LAB211 J1.S.P0059) KHÔNG bị bóc. Không chắc thì để nguyên trong thân đề:
 * hiện trùng còn hơn mất chữ của đề.
 */

export interface ParsedExample {
  input: string;
  output: string;
  explanation?: string;
}

/** Thân đề có phải HTML không (có thẻ khối/thẻ chữ quen thuộc). Không ⇒ coi là markdown. */
export function looksLikeHtml(s: string | null | undefined): boolean {
  return /<\/?(p|div|ul|ol|li|h[1-6]|pre|code|br|table|strong|em|b|i|a|span|blockquote)\b[^>]*>/i.test(s || '');
}

const ENTITIES: Record<string, string> = {
  '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&apos;': "'", '&nbsp;': ' ',
};

/** HTML của MỘT khối → chữ thuần, giữ xuống dòng (`<br>`, cuối đoạn/mục). */
export function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|pre|blockquote|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(lt|gt|amp|quot|#39|#x27|apos|nbsp);/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCharCode(Number(d)));
}

type LineKind =
  | { k: 'header' }
  | { k: 'input' | 'output' | 'explanation'; v: string }
  | { k: 'text'; v: string };

const RE_HEADER = /^(?:examples?|ví\s*dụ|vd)\s*(?:#?\s*\d+)?\s*[:.]?$/i;
const RE_INPUT = /^(?:input|đầu\s*vào)\s*:\s*(.*)$/i;
const RE_OUTPUT = /^(?:output|đầu\s*ra|kết\s*quả)\s*:\s*(.*)$/i;
const RE_EXPLAIN = /^(?:explanation|giải\s*thích)\s*:\s*(.*)$/i;

/** Gỡ nhấn markdown quanh nhãn/giá trị: `**Input:**` → `Input:`, `` `x` `` → `x`. */
function cleanMdLine(line: string): string {
  let s = line.trim().replace(/^>\s*/, '').replace(/^[-*]\s+(?=\*{0,2}(?:input|output|explanation|đầu|kết|giải)\b)/i, '');
  s = s.replace(/^\*\*([^*]+?)\*\*/, '$1').replace(/^__([^_]+?)__/, '$1');
  // "**Input:** x" đã thành "Input: x"; "**Input**: x" cũng vậy.
  const m = /^([^:`]{1,24}:)\s*`([^`]*)`\s*$/.exec(s);
  if (m) s = `${m[1]} ${m[2]}`;
  return s;
}

function classify(line: string): LineKind {
  const s = line.trim();
  if (RE_HEADER.test(s)) return { k: 'header' };
  let m = RE_INPUT.exec(s);
  if (m) return { k: 'input', v: m[1].trim() };
  m = RE_OUTPUT.exec(s);
  if (m) return { k: 'output', v: m[1].trim() };
  m = RE_EXPLAIN.exec(s);
  if (m) return { k: 'explanation', v: m[1].trim() };
  return { k: 'text', v: s };
}

/** Một khối đã tách: chữ từng dòng + có cho phép dòng nối tiếp (chỉ khối code/pre). */
export interface TextBlock {
  lines: string[];
  /** `<pre>` / khối code ``` — giá trị nhiều dòng (mảng, output console) là hợp lệ. */
  multiline: boolean;
}

/**
 * Đọc MỘT dãy khối liền nhau thành ví dụ. Trả `null` nếu có dòng nào không
 * thuộc mẫu, hoặc ví dụ cuối còn dở (thiếu Output) — tức là "không chắc".
 */
export function parseExampleBlocks(blocks: TextBlock[]): ParsedExample[] | null {
  const out: ParsedExample[] = [];
  let cur: { input?: string; output?: string; explanation?: string } | null = null;
  let field: 'input' | 'output' | 'explanation' | null = null;

  const close = (): boolean => {
    if (!cur) return true;
    if (!cur.input?.trim() || !cur.output?.trim()) return false;
    // Giá trị kết bằng ":" ⇒ nó còn tiếp ở danh sách/khối bên dưới (đặc tả), không phải ví dụ trọn.
    if (/:\s*$/.test(cur.input) || /:\s*$/.test(cur.output)) return false;
    out.push({ input: cur.input.trim(), output: cur.output.trim(), ...(cur.explanation?.trim() ? { explanation: cur.explanation.trim() } : {}) });
    cur = null; field = null;
    return true;
  };

  for (const b of blocks) {
    const lines = b.lines.map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim() !== '');
    if (!lines.length) continue;
    // Khối phải MỞ bằng nhãn — đoạn văn thường đứng sau Output không bị nuốt.
    if (classify(lines[0]).k === 'text') return null;
    for (let i = 0; i < lines.length; i++) {
      const c = classify(lines[i]);
      if (c.k === 'header') {
        if (!close()) return null;
        continue;
      }
      if (c.k === 'input') {
        if (cur && (cur.input !== undefined)) { if (!close()) return null; }
        cur = { input: c.v };
        field = 'input';
        continue;
      }
      if (c.k === 'output') {
        if (!cur || cur.input === undefined || cur.output !== undefined) return null;
        cur.output = c.v;
        field = 'output';
        continue;
      }
      if (c.k === 'explanation') {
        if (!cur || cur.output === undefined || cur.explanation !== undefined) return null;
        cur.explanation = c.v;
        field = 'explanation';
        continue;
      }
      // Dòng nối tiếp: chỉ trong khối code/pre, và phải có trường đang mở.
      if (!b.multiline || !cur || !field || i === 0) return null;
      const prev = cur[field] ?? '';
      cur[field] = prev ? `${prev}\n${lines[i]}` : lines[i];
    }
  }
  if (!close()) return null;
  return out.length ? out : null;
}

interface Located { start: number; end: number; block: TextBlock }

/** Các khối cấp đỉnh ứng viên trong HTML: <p>, <pre>, <h1-6>, <blockquote>, <div> không lồng div. */
function htmlBlocks(html: string): Located[] {
  const re = /<(p|pre|h[1-6]|blockquote|div)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
  const res: Located[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const tag = m[1].toLowerCase();
    if (tag === 'div' && /<div\b/i.test(m[2])) continue; // div lồng: không chắc ranh giới
    const text = htmlToText(m[2]);
    res.push({
      start: m.index,
      end: m.index + m[0].length,
      block: { lines: text.split('\n').map((l) => l.trim()), multiline: tag === 'pre' },
    });
  }
  return res;
}

/** Khối markdown: tách theo dòng trống, khối ``` giữ nguyên (và là multiline). */
function mdBlocks(md: string): Located[] {
  const res: Located[] = [];
  const lines = md.split('\n');
  let pos = 0;
  let i = 0;
  const offsets: number[] = [];
  for (const l of lines) { offsets.push(pos); pos += l.length + 1; }
  while (i < lines.length) {
    if (!lines[i].trim()) { i++; continue; }
    const start = offsets[i];
    if (/^\s*```/.test(lines[i])) {
      let j = i + 1;
      while (j < lines.length && !/^\s*```/.test(lines[j])) j++;
      const body = lines.slice(i + 1, j);
      const endLine = Math.min(j, lines.length - 1);
      res.push({ start, end: offsets[endLine] + lines[endLine].length, block: { lines: body.map((l) => cleanMdLine(l)), multiline: true } });
      i = j + 1;
      continue;
    }
    let j = i;
    while (j < lines.length && lines[j].trim() && !/^\s*```/.test(lines[j])) j++;
    const body = lines.slice(i, j);
    res.push({ start, end: offsets[j - 1] + lines[j - 1].length, block: { lines: body.map((l) => cleanMdLine(l)), multiline: false } });
    i = j;
  }
  return res;
}

/**
 * Bóc ví dụ "Input:/Output:" ra khỏi thân đề.
 * Trả `body` đã gỡ các khối ví dụ + danh sách ví dụ. Không nhận ra ⇒ body nguyên vẹn, examples rỗng.
 */
export function extractExamples(source: string | null | undefined, kind: 'html' | 'md'): { body: string; examples: ParsedExample[] } {
  const src = source || '';
  if (!/(?:input|đầu\s*vào)(?:\*\*|__)?\s*:/i.test(src)) return { body: src, examples: [] };
  const blocks = kind === 'html' ? htmlBlocks(src) : mdBlocks(src);
  const examples: ParsedExample[] = [];
  const cuts: Array<[number, number]> = [];
  const contiguous = (a: Located, b: Located) => src.slice(a.end, b.start).trim() === '';

  let i = 0;
  while (i < blocks.length) {
    const first = blocks[i].block.lines.find((l) => l.trim());
    const k = first ? classify(first).k : 'text';
    if (k !== 'header' && k !== 'input') { i++; continue; }
    let best = -1;
    let bestEx: ParsedExample[] | null = null;
    for (let j = i; j < blocks.length; j++) {
      if (j > i && !contiguous(blocks[j - 1], blocks[j])) break;
      const fj = blocks[j].block.lines.find((l) => l.trim());
      if (!fj || classify(fj).k === 'text') break;
      const run = blocks.slice(i, j + 1).map((x) => x.block);
      // "Input: … / Output: …" trong đoạn văn thường KHÔNG có tiêu đề "Example"
      // thường là ĐẶC TẢ (vào gì, ra gì), không phải ví dụ — chỉ nhận khi có
      // tiêu đề Example/Ví dụ đứng đầu, hoặc cả dãy nằm trong khối code/pre.
      if (k !== 'header' && !run.every((b) => b.multiline)) continue;
      const got = parseExampleBlocks(run);
      if (got) { best = j; bestEx = got; }
    }
    if (best >= 0 && bestEx) {
      examples.push(...bestEx);
      cuts.push([blocks[i].start, blocks[best].end]);
      i = best + 1;
    } else {
      i++;
    }
  }
  if (!examples.length) return { body: src, examples: [] };
  let body = '';
  let at = 0;
  for (const [s, e] of cuts) { body += src.slice(at, s); at = e; }
  body += src.slice(at);
  body = kind === 'md' ? body.replace(/\n{3,}/g, '\n\n').trim() : body.trim();
  return { body, examples };
}

/**
 * Ràng buộc → danh sách. Mỗi dòng một mục (gỡ "-", "*", "•", "1."); một dòng
 * duy nhất nhiều câu thì tách theo câu — trừ chỗ viết tắt (e.g., i.e., vs.) và số thập phân.
 */
export function splitConstraints(text: string | null | undefined): string[] {
  const t = (text || '').trim();
  if (!t) return [];
  const strip = (s: string) => s.replace(/^\s*(?:[-*•·]|\d+[.)])\s+/, '').trim();
  const lines = t.split(/\r?\n/).map(strip).filter(Boolean);
  if (lines.length > 1) return lines;
  const one = lines[0] ?? '';
  const protectedText = one.replace(/\b(e\.g|i\.e|etc|vs|approx|ex|cf|no)\./gi, (m) => m.replace(/\./g, '\u0000'));
  const parts = protectedText
    .replace(/([.;!?])\s+(?=[A-ZÀ-Ỹ0-9`"'(Đ])/g, '$1\u0001')
    .split('\u0001')
    .map((s) => s.replace(/\u0000/g, '.').trim())
    .filter(Boolean);
  return parts.length ? parts : [one];
}
