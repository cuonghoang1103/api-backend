// ⛔ BẢN CHÉP — sửa ở src/services/work/sqlDesign/ rồi chạy scripts/dong-bo-sql-design.mjs
/**
 * Database designer — xuất dạng VĂN BẢN của sơ đồ: Mermaid erDiagram (nhúng Docs / Report 3-4, ảnh cho MCP) và DBML
 * (dbdiagram.io). Mermaid sinh ra phải qua cả mermaid.parse thật lẫn lintMermaid của máy chủ (chỉ chữ ASCII trong tên).
 */

import { fileNameFor, mimeFor } from './generate';
import { findColumn, relationships, sameName, type Column, type DbModel, type Table } from './model';
import type { ExportOptions, ExportResult } from './generate';

const ascii = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
/** Tên an toàn cho Mermaid: chữ/số/_/- (khớp lintMermaid của máy chủ). */
export const mermaidName = (s: string) => ascii(s).replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'x';
const mermaidType = (s: string) => ascii(s).replace(/\s+/g, '_').replace(/[^\w()[\],-]+/g, '') || 'type';
const mermaidComment = (s: string) => s.replace(/["\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);

function keysOf(t: Table, c: Column): string[] {
  const k: string[] = [];
  if (t.primaryKey?.columns.some((x) => sameName(x, c.name))) k.push('PK');
  if (t.foreignKeys.some((f) => f.columns.some((x) => sameName(x, c.name)))) k.push('FK');
  if (t.uniques.some((u) => u.columns.length === 1 && sameName(u.columns[0], c.name)) || t.indexes.some((i) => i.unique && !i.where && i.columns.length === 1 && sameName(i.columns[0].name, c.name))) k.push('UK');
  return k;
}

export function toMermaid(model: DbModel, opts: { comments?: boolean } = {}): string {
  const lines = ['erDiagram'];
  const used = new Map<string, string>();
  const nameOf = (t: string) => {
    const k = t.toLowerCase();
    if (!used.has(k)) {
      let n = mermaidName(t); let i = 2;
      while ([...used.values()].includes(n)) n = `${mermaidName(t)}_${i++}`;
      used.set(k, n);
    }
    return used.get(k)!;
  };
  for (const t of model.tables) {
    lines.push(`  ${nameOf(t.name)} {`);
    for (const c of t.columns) {
      const k = keysOf(t, c);
      const note = [c.nullable ? 'NULL' : '', c.identity ? 'auto' : '', opts.comments !== false && c.comment ? mermaidComment(c.comment) : ''].filter(Boolean).join(' · ');
      lines.push(`    ${mermaidType(c.type.raw || c.type.name || 'any')} ${mermaidName(c.name)}${k.length ? ` ${k.join(', ')}` : ''}${note ? ` "${mermaidComment(note)}"` : ''}`);
    }
    lines.push('  }');
  }
  for (const r of relationships(model)) {
    if (!model.tables.some((t) => sameName(t.name, r.parent))) continue;
    const left = r.parentCard === 'one' ? '||' : '|o';
    const right = r.childCard === 'many' ? 'o{' : 'o|';
    const label = mermaidComment(r.childColumns.join(', ')) || 'has';
    lines.push(`  ${nameOf(r.parent)} ${left}${r.identifying ? '--' : '..'}${right} ${nameOf(r.child)} : "${label}"`);
  }
  return lines.join('\n');
}

export function generateMermaid(model: DbModel, opts: ExportOptions): ExportResult {
  return { text: `${toMermaid(model, opts)}\n`, fileName: fileNameFor('mermaid', opts.title ?? model.database), mime: mimeFor('mermaid'), ext: 'mmd', notes: [], bom: false };
}

// ─── DBML (dbdiagram.io) ───

const dq = (s: string) => (/^[A-Za-z_][\w]*$/.test(s) ? s : `"${s.replace(/"/g, '\\"')}"`);
const sq = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

export function toDbml(model: DbModel): string {
  const out: string[] = [];
  out.push(`Project ${dq(model.database ?? 'database')} {`, `  database_type: '${model.dialect === 'sqlserver' ? 'SQL Server' : model.dialect === 'postgres' ? 'PostgreSQL' : model.dialect === 'mysql' ? 'MySQL' : 'SQLite'}'`, '}', '');
  for (const e of model.enums) { out.push(`Enum ${dq(e.name)} {`); for (const v of e.values) out.push(`  ${dq(v)}`); out.push('}', ''); }
  const rels = relationships(model);
  for (const t of model.tables) {
    out.push(`Table ${t.schema ? `${dq(t.schema)}.` : ''}${dq(t.name)} {`);
    const pkCols = t.primaryKey?.columns ?? [];
    for (const c of t.columns) {
      const s: string[] = [];
      if (pkCols.length === 1 && sameName(pkCols[0], c.name)) s.push('pk');
      if (c.identity) s.push('increment');
      if (!c.nullable && !(pkCols.length === 1 && sameName(pkCols[0], c.name))) s.push('not null');
      if (t.uniques.some((u) => u.columns.length === 1 && sameName(u.columns[0], c.name))) s.push('unique');
      if (c.default) {
        const d = c.default.text;
        s.push(`default: ${/^-?\d+(\.\d+)?$/.test(d) ? d : /^N?'.*'$/.test(d) ? sq(d.replace(/^N?'|'$/g, '').replace(/''/g, "'")) : /^(TRUE|FALSE|NULL)$/i.test(d) ? d.toLowerCase() : `\`${d.replace(/`/g, '')}\``}`);
      }
      if (c.comment) s.push(`note: ${sq(c.comment)}`);
      const ty = (c.type.raw || 'any').replace(/\s+/g, ' ');
      out.push(`  ${dq(c.name)} ${/^[\w]+(\([\w, ]*\))?$/.test(ty) ? ty : `"${ty}"`}${s.length ? ` [${s.join(', ')}]` : ''}`);
    }
    const idx: string[] = [];
    if (pkCols.length > 1) idx.push(`    (${pkCols.map(dq).join(', ')}) [pk${t.primaryKey?.name ? `, name: ${sq(t.primaryKey.name)}` : ''}]`);
    for (const u of t.uniques) if (u.columns.length > 1) idx.push(`    (${u.columns.map(dq).join(', ')}) [unique${u.name ? `, name: ${sq(u.name)}` : ''}]`);
    for (const ix of t.indexes) {
      const cols = ix.columns.map((c) => (c.expr ? `\`${c.expr.text}\`` : dq(c.name)));
      const set = [ix.unique ? 'unique' : '', ix.name ? `name: ${sq(ix.name)}` : '', ix.where ? `note: ${sq(`WHERE ${ix.where.text}`)}` : ''].filter(Boolean);
      idx.push(`    ${cols.length > 1 ? `(${cols.join(', ')})` : cols[0]}${set.length ? ` [${set.join(', ')}]` : ''}`);
    }
    if (idx.length) out.push('', '  indexes {', ...idx, '  }');
    if (t.comment) out.push('', `  Note: ${sq(t.comment)}`);
    out.push('}', '');
  }
  for (const r of rels) {
    const parent = model.tables.find((x) => sameName(x.name, r.parent));
    if (!parent) continue;
    const child = model.tables.find((x) => sameName(x.name, r.child))!;
    const fk = child.foreignKeys.find((f) => f.columns.join(',') === r.childColumns.join(','));
    const op = r.childCard === 'many' ? '>' : '-';
    const cols = (t: Table, cs: string[]) => (cs.length > 1 ? `${dq(t.name)}.(${cs.map(dq).join(', ')})` : `${dq(t.name)}.${dq(findColumn(t, cs[0])?.name ?? cs[0])}`);
    const acts = [fk?.onDelete ? `delete: ${fk.onDelete.toLowerCase()}` : '', fk?.onUpdate ? `update: ${fk.onUpdate.toLowerCase()}` : ''].filter(Boolean);
    out.push(`Ref${r.name ? ` ${dq(r.name)}` : ''}: ${cols(child, r.childColumns)} ${op} ${cols(parent, r.parentColumns)}${acts.length ? ` [${acts.join(', ')}]` : ''}`);
  }
  return out.join('\n');
}

export function generateDbml(model: DbModel, opts: ExportOptions): ExportResult {
  return { text: `${toDbml(model)}\n`, fileName: fileNameFor('dbml', opts.title ?? model.database), mime: mimeFor('dbml'), ext: 'dbml', notes: [], bom: false };
}
