// ⛔ BẢN CHÉP — sửa ở src/services/work/sqlDesign/ rồi chạy scripts/dong-bo-sql-design.mjs
/**
 * Database designer — TÁCH TỪ (lexer) SQL cho cả bốn hệ: SQL Server (`[x]`, N'…', GO), PostgreSQL ("x", E'…', $$…$$, ::),
 * MySQL (`x`, # chú thích, DELIMITER), SQLite. Giữ vị trí từng token (dòng/cột) để báo lỗi ĐÚNG DÒNG và nhảy tới bảng.
 *
 * Chuỗi/chú thích chưa đóng KHÔNG nuốt cả phần còn lại một cách im lặng: chuỗi chưa đóng dừng ở cuối dòng (DDL hầu như
 * không có chuỗi nhiều dòng), chú thích khối chưa đóng tới hết tệp — cả hai đều kèm lỗi `fatal` để trình soạn giữ bản vẽ
 * tốt gần nhất thay vì xoá sạch ERD lúc người đang gõ dở.
 */

import type { Problem, Span, TokKind } from './model';
import { bi } from './model';

export interface Token {
  t: TokKind | 'sep' | 'eof';
  /** Giá trị: word ⇒ nguyên văn; qident ⇒ tên đã bỏ dấu bọc; string ⇒ nội dung đã bỏ nháy; op ⇒ ký hiệu. */
  v: string;
  /** Chữ HOA của word (so từ khoá nhanh). */
  u: string;
  raw: string;
  start: number;
  end: number;
  line: number;
  col: number;
  /** Tiền tố chuỗi: N (Unicode của T-SQL), E (PostgreSQL), X/B (nhị phân). */
  prefix?: string;
  /** Token đầu tiên trên dòng của nó (để nhận diện câu mới khi thiếu dấu chấm phẩy). */
  bol?: boolean;
}

export interface Comment { text: string; start: number; end: number; line: number; col: number; endLine: number; block: boolean; ownLine: boolean }

export interface LexResult { tokens: Token[]; comments: Comment[]; problems: Problem[]; hasGo: boolean; lineStarts: number[] }

const OPS3 = ['<=>', '!~*', '->>', '#>>', '...'];
const OPS2 = ['<=', '>=', '<>', '!=', '::', '||', '->', '!~', '~*', '#>', '==', ':=', '+=', '-=', '*=', '/=', '&&', '<<', '>>', '!<', '!>'];

const isIdStart = (c: string) => /[A-Za-z_À-￿#@$]/.test(c);
const isIdPart = (c: string) => /[A-Za-z0-9_À-￿$#@]/.test(c);

export function lineStartsOf(src: string): number[] {
  const out = [0];
  for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) out.push(i + 1);
  return out;
}

/** offset ⇒ { line, col } (1-based) bằng tìm nhị phân. */
export function posAt(lineStarts: number[], offset: number): { line: number; col: number } {
  let lo = 0; let hi = lineStarts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lineStarts[mid] <= offset) lo = mid; else hi = mid - 1;
  }
  return { line: lo + 1, col: offset - lineStarts[lo] + 1 };
}

export function spanOf(lineStarts: number[], start: number, end: number): Span {
  const a = posAt(lineStarts, start);
  const b = posAt(lineStarts, Math.max(start, end));
  return { start, end, line: a.line, col: a.col, endLine: b.line, endCol: b.col };
}

export function lex(src: string): LexResult {
  const tokens: Token[] = [];
  const comments: Comment[] = [];
  const problems: Problem[] = [];
  const lineStarts = lineStartsOf(src);
  const n = src.length;
  let i = 0;
  let hasGo = false;
  let delimiter = ';';
  let lineHasToken = false;
  let lastLine = 1;
  /** Từ đầu dòng tới đây chỉ có khoảng trắng (GO / DELIMITER chỉ có nghĩa khi đứng riêng ở đầu dòng). */
  let bareLine = true;
  const pos = (o: number) => posAt(lineStarts, o);
  const push = (t: Token['t'], v: string, start: number, end: number, extra: Partial<Token> = {}) => {
    const p = pos(start);
    if (p.line !== lastLine) { lastLine = p.line; lineHasToken = false; }
    bareLine = false;
    tokens.push({ t, v, u: t === 'word' ? v.toUpperCase() : v, raw: src.slice(start, end), start, end, line: p.line, col: p.col, bol: !lineHasToken, ...extra });
    lineHasToken = true;
  };
  const fatal = (code: string, start: number, end: number, vi: string, en: string) => {
    problems.push({ code, severity: 'error', fatal: true, message: bi(vi, en), span: spanOf(lineStarts, start, end) });
  };

  while (i < n) {
    const c = src[i];
    // Đầu dòng: GO (T-SQL) hoặc DELIMITER (MySQL client) — chỉ có nghĩa khi đứng riêng ở đầu dòng.
    if (bareLine && (c === 'G' || c === 'g')) {
      const m = /^go(?:[ \t]+\d+)?[ \t]*(?:--[^\n]*)?(?=\r?\n|$)/i.exec(src.slice(i, i + 40));
      if (m) { push('sep', 'GO', i, i + 2); hasGo = true; i += m[0].length; continue; }
    }
    if (bareLine && (c === 'D' || c === 'd')) {
      const m = /^delimiter[ \t]+(\S+)[ \t]*(?=\r?\n|$)/i.exec(src.slice(i, i + 60));
      if (m) { delimiter = m[1]; i += m[0].length; continue; }
    }
    if (c === '\n') { bareLine = true; i++; continue; }
    if (c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v' || c === '\u00a0' || c === '\ufeff') { i++; continue; }
    // Dấu kết câu tuỳ chỉnh (DELIMITER $$)
    if (delimiter !== ';' && src.startsWith(delimiter, i)) { push('sep', delimiter, i, i + delimiter.length); i += delimiter.length; continue; }
    // Chú thích
    // `#` của MySQL là chú thích khi theo sau là khoảng trắng/hết dòng; `#temp` của T-SQL là tên bảng tạm.
    if ((c === '-' && src[i + 1] === '-') || (c === '#' && /^[ \t\r\n#!-]?$/.test(src[i + 1] ?? ''))) {
      const e = src.indexOf('\n', i);
      const end = e < 0 ? n : e;
      const p = pos(i);
      comments.push({ text: src.slice(i + (c === '#' ? 1 : 2), end).replace(/\r$/, '').trim(), start: i, end, line: p.line, col: p.col, endLine: p.line, block: false, ownLine: !lineHasToken || p.line !== lastLine });
      i = end;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      let depth = 1; let j = i + 2;
      while (j < n && depth > 0) {
        if (src[j] === '/' && src[j + 1] === '*') { depth++; j += 2; continue; }
        if (src[j] === '*' && src[j + 1] === '/') { depth--; j += 2; continue; }
        j++;
      }
      const p = pos(i);
      if (depth > 0) fatal('LEX_COMMENT_OPEN', i, i + 2, 'Chú thích /* … chưa được đóng bằng */', 'A /* … comment is never closed with */');
      comments.push({ text: src.slice(i + 2, depth > 0 ? n : j - 2).trim(), start: i, end: j, line: p.line, col: p.col, endLine: pos(Math.max(i, j - 1)).line, block: true, ownLine: !lineHasToken || p.line !== lastLine });
      i = j;
      continue;
    }
    // Chuỗi: '…' với tiền tố N / E / X / B; '' là nháy đơn trong chuỗi; E'…' cho phép \'.
    const pre = /[NnEeXxBb]/.test(c) && src[i + 1] === "'" && !isIdPart(src[i - 1] ?? '') ? c.toUpperCase() : '';
    if (c === "'" || pre) {
      const s = i;
      let j = i + (pre ? 2 : 1);
      let val = '';
      let closed = false;
      while (j < n) {
        const ch = src[j];
        if (pre === 'E' && ch === '\\' && j + 1 < n) { val += src[j + 1]; j += 2; continue; }
        if (ch === "'") { if (src[j + 1] === "'") { val += "'"; j += 2; continue; } closed = true; j++; break; }
        if (ch === '\n') break;
        val += ch; j++;
      }
      if (!closed) fatal('LEX_STRING_OPEN', s, j, 'Chuỗi \'… chưa có dấu nháy đóng', 'A string \'… is missing its closing quote');
      push('string', val, s, j, pre ? { prefix: pre } : {});
      i = j;
      continue;
    }
    // Chuỗi đô-la của PostgreSQL: $$…$$ hoặc $tag$…$tag$
    if (c === '$') {
      const m = /^\$([A-Za-z_]\w*)?\$/.exec(src.slice(i, i + 64));
      if (m) {
        const tag = m[0];
        const e = src.indexOf(tag, i + tag.length);
        if (e < 0) { fatal('LEX_DOLLAR_OPEN', i, i + tag.length, `Khối ${tag}…${tag} chưa được đóng`, `A ${tag}…${tag} block is never closed`); push('string', src.slice(i + tag.length), i, n); i = n; continue; }
        push('string', src.slice(i + tag.length, e), i, e + tag.length, { prefix: '$' });
        i = e + tag.length;
        continue;
      }
      if (/\d/.test(src[i + 1] ?? '')) { let j = i + 1; while (j < n && /\d/.test(src[j])) j++; push('var', src.slice(i, j), i, j); i = j; continue; }
    }
    // Tên bọc: [x] (T-SQL), "x" (chuẩn), `x` (MySQL)
    if (c === '[' || c === '"' || c === '`') {
      const close = c === '[' ? ']' : c;
      let j = i + 1; let val = ''; let closed = false;
      while (j < n) {
        if (src[j] === close) { if (src[j + 1] === close) { val += close; j += 2; continue; } closed = true; j++; break; }
        if (src[j] === '\n') break;
        val += src[j]; j++;
      }
      if (!closed) {
        // `[` mở mảng kiểu PostgreSQL (int[]) — không phải tên.
        if (c === '[') { push('op', '[', i, i + 1); i++; continue; }
        fatal('LEX_IDENT_OPEN', i, j, `Tên bọc ${c}… chưa được đóng`, `A quoted name ${c}… is never closed`);
      }
      if (c === '[' && /^\s*\d*\s*$/.test(val)) { push('op', '[', i, i + 1); i++; continue; } // int[] / int[3]
      push('qident', val, i, j);
      i = j;
      continue;
    }
    // Số
    if (/\d/.test(c) || (c === '.' && /\d/.test(src[i + 1] ?? ''))) {
      const m = /^(?:0x[0-9a-f]+|\d*\.?\d+(?:e[+-]?\d+)?)/i.exec(src.slice(i, i + 80));
      const len = m ? m[0].length : 1;
      if (/^0x/i.test(m?.[0] ?? '')) push('blob', src.slice(i, i + len), i, i + len); else push('number', src.slice(i, i + len), i, i + len);
      i += len;
      continue;
    }
    // Biến T-SQL @x / @@x, tham số :x của client
    if (c === '@') {
      let j = i + 1;
      if (src[j] === '@') j++;
      while (j < n && isIdPart(src[j])) j++;
      push('var', src.slice(i, j), i, j);
      i = j;
      continue;
    }
    if (isIdStart(c)) {
      let j = i + 1;
      while (j < n && isIdPart(src[j])) j++;
      push('word', src.slice(i, j), i, j);
      i = j;
      continue;
    }
    if (c === ';' && delimiter === ';') { push('sep', ';', i, i + 1); i++; continue; }
    const three = src.slice(i, i + 3);
    const two = src.slice(i, i + 2);
    if (OPS3.includes(three)) { push('op', three, i, i + 3); i += 3; continue; }
    if (OPS2.includes(two)) { push('op', two, i, i + 2); i += 2; continue; }
    push('op', c, i, i + 1);
    i++;
  }
  const p = pos(n);
  tokens.push({ t: 'eof', v: '', u: '', raw: '', start: n, end: n, line: p.line, col: p.col, bol: true });
  return { tokens, comments, problems, hasGo, lineStarts };
}
