/**
 * Database designer — cửa vào. Sơ đồ định dạng SQL lưu NGUỒN SQL thật; thông tin phụ (hệ quản trị đang viết, vị trí bảng
 * người tự kéo) nằm ở MỘT dòng chú thích cuối nguồn `-- ctw:meta {…}` ⇒ không cần cột mới trong CSDL, đi cùng phiên bản,
 * và tệp tải về vẫn là SQL hợp lệ. Trình soạn ẩn dòng đó (người chỉ thấy SQL của mình).
 */

import { generateMongo } from './mongo.js';
import { generateDbml, generateMermaid, toMermaid } from './diagramText.js';
import { fileNameFor, generateSql, mimeFor, type ExportOptions, type ExportResult } from './generate.js';
import { lintModel, type LintOptions } from './lint.js';
import { plainModel, SOURCE_DIALECTS, type DbModel, type Dialect, type ParseResult, type Problem } from './model.js';
import { parseSql } from './parser.js';

export * from './model.js';
export { parseSql, detectDialect } from './parser.js';
export { generateSql, quoteIdent, snakeCase, namer, fileNameFor, mimeFor, fileBase, type ExportOptions, type ExportResult, type Naming } from './generate.js';
export { generateMongo } from './mongo.js';
export { toMermaid, toDbml, mermaidName } from './diagramText.js';
export { lintModel, LINT_RULES, type LintOptions } from './lint.js';
export { canonOf, renderType, bsonType, type Canon } from './types.js';
export { translateExpr, likeToRegex } from './expr.js';
export { reservedIn } from './reserved.js';

export interface SqlMeta { dialect?: Dialect; layout?: Record<string, [number, number]>; direction?: 'LR' | 'TB' }

const META_RE = /\n?[ \t]*--[ \t]*ctw:meta[ \t]+(\{[^\n]*\})[ \t]*\s*$/;

/** Tách dòng `-- ctw:meta {…}` ở cuối nguồn. */
export function splitMeta(source: string): { sql: string; meta: SqlMeta } {
  const s = String(source ?? '');
  const m = META_RE.exec(s);
  if (!m) return { sql: s, meta: {} };
  try {
    const raw = JSON.parse(m[1]) as Record<string, unknown>;
    const meta: SqlMeta = {};
    if (typeof raw.dialect === 'string' && (SOURCE_DIALECTS as readonly string[]).includes(raw.dialect)) meta.dialect = raw.dialect as Dialect;
    if (raw.direction === 'LR' || raw.direction === 'TB') meta.direction = raw.direction;
    if (raw.layout && typeof raw.layout === 'object') {
      const out: Record<string, [number, number]> = {};
      for (const [k, v] of Object.entries(raw.layout as Record<string, unknown>).slice(0, 2000)) {
        if (Array.isArray(v) && v.length === 2 && v.every((x) => typeof x === 'number' && Number.isFinite(x) && Math.abs(x) < 1e6)) out[k.slice(0, 128)] = [Math.round(v[0]), Math.round(v[1])];
      }
      if (Object.keys(out).length) meta.layout = out;
    }
    return { sql: s.slice(0, m.index).replace(/\s+$/, '\n'), meta };
  } catch {
    return { sql: s, meta: {} };
  }
}

/** Ghép SQL + meta (bỏ dòng meta nếu rỗng). */
export function joinMeta(sql: string, meta: SqlMeta): string {
  const body = splitMeta(sql).sql.replace(/\s+$/, '');
  const clean: SqlMeta = {};
  if (meta.dialect) clean.dialect = meta.dialect;
  if (meta.direction) clean.direction = meta.direction;
  if (meta.layout && Object.keys(meta.layout).length) clean.layout = meta.layout;
  return Object.keys(clean).length ? `${body}\n\n-- ctw:meta ${JSON.stringify(clean)}\n` : `${body}\n`;
}

export interface Analysis { parse: ParseResult; lint: Problem[]; meta: SqlMeta }

/** Đọc + kiểm thiết kế một nguồn sơ đồ SQL (có hoặc không có dòng meta). */
export function analyzeSql(source: string, opts: { dialect?: Dialect; lint?: LintOptions } = {}): Analysis {
  const { sql, meta } = splitMeta(source);
  const parse = parseSql(sql, { dialect: opts.dialect ?? meta.dialect ?? 'auto' });
  return { parse, lint: lintModel(parse.model, opts.lint), meta };
}

export function exportModel(model: DbModel, opts: ExportOptions): ExportResult {
  switch (opts.target) {
    case 'sqlserver': case 'postgres': case 'mysql': case 'sqlite': return generateSql(model, { ...opts, target: opts.target });
    case 'mongodb': return generateMongo(model, opts);
    case 'mermaid': return generateMermaid(model, opts);
    case 'dbml': return generateDbml(model, opts);
    case 'json': return { text: `${JSON.stringify(plainModel(model), null, 2)}\n`, fileName: fileNameFor('json', opts.title ?? model.database), mime: mimeFor('json'), ext: 'model.json', notes: [], bom: false };
  }
}

/** Mermaid erDiagram của một nguồn SQL (Docs, Report 3/4, ảnh cho MCP). Rỗng ⇒ null. */
export function sqlToMermaid(source: string): string | null {
  const { parse } = analyzeSql(source);
  if (!parse.model.tables.length) return null;
  return toMermaid(parse.model);
}

export { layoutErd, overlaps, type LayoutNode, type LayoutEdge, type Positions } from './layout.js';
export { mermaidErdToModel, type MermaidErdResult } from './mermaidErd.js';
