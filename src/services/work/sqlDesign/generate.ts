/**
 * Database designer — SINH SCRIPT CHẠY ĐƯỢC cho SQL Server, PostgreSQL, MySQL 8, SQLite từ mô hình đã đọc.
 *
 *   - Thứ tự: bảng CHA trước bảng CON; vòng tham chiếu ⇒ FK thêm sau bằng ALTER TABLE.
 *   - Chạy lại được: xoá bảng cũ trước (ghi rõ "MẤT DỮ LIỆU") theo đúng cách của từng hệ.
 *   - Kiểu dữ liệu, IDENTITY ⇄ GENERATED AS IDENTITY ⇄ AUTO_INCREMENT, DEFAULT, CHECK, chỉ mục lọc (WHERE) được dịch;
 *     chỗ không dịch được ⇒ CHÚ Ý trong script + danh sách ghi chú, không âm thầm bỏ.
 *   - Tiếng Việt: SQL Server dùng NVARCHAR + N'…' và tệp có BOM; PostgreSQL client_encoding UTF8; MySQL utf8mb4.
 */

import { isSimpleLiteral, sqlString, translateExpr, type ExprEnv, type SqlTarget } from './expr.js';
import {
  bi, creationOrder, DIALECT_LABEL, findColumn, findTable, resolvedRefColumns, sameName,
  type Bi, type Column, type DbModel, type ExportTarget, type ForeignKey, type Index, type Table,
} from './model.js';
import { RESERVED } from './reserved.js';
import { canonOf, renderType, type Canon } from './types.js';

export type Naming = 'keep' | 'snake' | 'lower';

export interface ExportOptions {
  target: ExportTarget;
  naming?: Naming;
  /** Xoá bảng cũ trước khi tạo (chạy lại được — MẤT dữ liệu trong các bảng này). Mặc định: có. */
  drop?: boolean;
  /** Tạo / chọn CSDL trước (tên). */
  database?: string | null;
  /** Mang chú thích cột/bảng sang (COMMENT ON, COMMENT '…', -- …). Mặc định: có. */
  comments?: boolean;
  lang?: 'vi' | 'en';
  /** Tên sơ đồ — dòng đầu tệp. */
  title?: string;
  /** PostgreSQL: GENERATED ALWAYS (mặc định) hay BY DEFAULT AS IDENTITY. */
  pgIdentity?: 'always' | 'by_default';
  /** Thêm chỉ mục cho cột khoá ngoại chưa có chỉ mục. */
  indexForeignKeys?: boolean;
  now?: Date;
}

export interface ExportResult { text: string; fileName: string; mime: string; ext: string; notes: Bi[]; bom: boolean }

const L = (lang: 'vi' | 'en', b: Bi) => (lang === 'vi' ? b.vi : b.en);

export function snakeCase(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

export function namer(naming: Naming = 'keep'): (s: string) => string {
  if (naming === 'snake') return snakeCase;
  if (naming === 'lower') return (s) => s.toLowerCase();
  return (s) => s;
}

export function quoteIdent(name: string, to: SqlTarget, force = false): string {
  const up = name.toUpperCase();
  switch (to) {
    case 'sqlserver': return !force && /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && !RESERVED.sqlserver.has(up) ? name : `[${name.replace(/]/g, ']]')}]`;
    case 'postgres': return !force && /^[a-z_][a-z0-9_]*$/.test(name) && !RESERVED.postgres.has(up) ? name : `"${name.replace(/"/g, '""')}"`;
    case 'mysql': return `\`${name.replace(/`/g, '``')}\``;
    case 'sqlite': return !force && /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && !RESERVED.sqlite.has(up) ? name : `"${name.replace(/"/g, '""')}"`;
  }
}

const FILE_EXT: Record<ExportTarget, [string, string]> = {
  sqlserver: ['sqlserver.sql', 'application/sql'], postgres: ['postgres.sql', 'application/sql'], mysql: ['mysql.sql', 'application/sql'], sqlite: ['sqlite.sql', 'application/sql'],
  mongodb: ['mongodb.js', 'text/javascript'], mermaid: ['mmd', 'text/plain'], dbml: ['dbml', 'text/plain'], json: ['model.json', 'application/json'],
};

export function fileBase(title?: string): string {
  return (title ?? 'database').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 60) || 'database';
}

export function fileNameFor(target: ExportTarget, title?: string) { return `${fileBase(title)}.${FILE_EXT[target][0]}`; }
export function mimeFor(target: ExportTarget) { return FILE_EXT[target][1]; }

/** Tên tiếng Việt / tiêu đề có ký tự lạ ⇒ chuỗi trong chú thích một dòng. */
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();

interface Gen {
  m: DbModel; to: SqlTarget; lang: 'vi' | 'en'; o: ExportOptions; notes: Bi[]; n: (s: string) => string;
  q: (s: string) => string; tq: (t: Table | string) => string; out: string[];
  typeNotes: Map<string, { text: Bi; cols: string[] }>;
}

function note(g: Gen, b: Bi) { if (!g.notes.some((x) => x.en === b.en)) g.notes.push(b); }

/** Ghi chú về kiểu gộp theo nội dung: "… (cột: A.x, B.y)" thay vì một dòng cho mỗi cột. */
function typeNote(g: Gen, text: Bi, where: string) {
  const cur = g.typeNotes.get(text.en);
  if (cur) cur.cols.push(where); else g.typeNotes.set(text.en, { text, cols: [where] });
}

function flushTypeNotes(g: Gen) {
  for (const { text, cols } of g.typeNotes.values()) {
    const list = cols.length > 6 ? `${cols.slice(0, 6).join(', ')} … (+${cols.length - 6})` : cols.join(', ');
    note(g, bi(`${text.vi} — cột: ${list}`, `${text.en} — columns: ${list}`));
  }
  g.typeNotes.clear();
}

export function generateSql(model: DbModel, opts: ExportOptions & { target: SqlTarget }): ExportResult {
  const to = opts.target;
  const lang = opts.lang ?? 'vi';
  const n = namer(opts.naming ?? 'keep');
  const g: Gen = {
    m: model, to, lang, o: opts, notes: [], n, out: [], typeNotes: new Map(),
    q: (s) => quoteIdent(n(s), to),
    tq: (t) => {
      const tb = typeof t === 'string' ? findTable(model, t) : t;
      const name = typeof t === 'string' ? t : t.name;
      const schema = tb?.schema;
      const qn = quoteIdent(n(tb?.name ?? name), to);
      if (to === 'sqlserver') return `${schema ? quoteIdent(schema, to) : 'dbo'}.${qn}`;
      if (to === 'postgres' && schema) return `${quoteIdent(n(schema), to)}.${qn}`;
      return qn;
    },
  };
  const { order, deferred } = creationOrder(model);
  const deferredSet = new Set(deferred.map((d) => d.fk));
  const W = (s = '') => g.out.push(s);
  const C = (b: Bi) => W(`-- ${L(lang, b)}`);
  const title = opts.title ?? model.database ?? 'Database';
  const date = (opts.now ?? new Date()).toISOString().slice(0, 10);

  // ── Đầu tệp ──
  W('-- =====================================================================');
  W(`-- ${oneLine(title)} — ${DIALECT_LABEL[to]}`);
  C(bi(`Sinh bởi CT Work · Database designer · từ sơ đồ viết bằng ${DIALECT_LABEL[model.dialect]} · ${model.tables.length} bảng · ${date}`, `Generated by CT Work · Database designer · from a ${DIALECT_LABEL[model.dialect]} design · ${model.tables.length} tables · ${date}`));
  if (opts.drop !== false) C(bi('CHẠY LẠI ĐƯỢC: xoá các bảng dưới đây trước rồi tạo lại ⇒ MẤT HẾT dữ liệu trong chúng.', 'RE-RUNNABLE: drops the tables below first, then recreates them ⇒ ALL DATA IN THEM IS LOST.'));
  if (to === 'sqlserver') C(bi('Tiếng Việt: chữ có dấu dùng NVARCHAR + N\'…\'. Lưu tệp UTF-8 có BOM (tệp tải về đã có) để SSMS đọc đúng.', 'Vietnamese text: accented text uses NVARCHAR + N\'…\'. Keep the file as UTF-8 with BOM (the download has it) so SSMS reads it correctly.'));
  if (to === 'postgres') C(bi('Chạy: psql -d <tên_csdl> -f tệp.sql  ·  CSDL nên tạo với ENCODING \'UTF8\'.', 'Run: psql -d <database> -f file.sql  ·  create the database with ENCODING \'UTF8\'.'));
  if (to === 'mysql') C(bi('Chạy: mysql -u root -p <tên_csdl> < tệp.sql  ·  utf8mb4 lưu đủ tiếng Việt (và emoji).', 'Run: mysql -u root -p <database> < file.sql  ·  utf8mb4 stores Vietnamese (and emoji) correctly.'));
  if (to === 'sqlite') C(bi('Chạy: sqlite3 du_lieu.db < tệp.sql  ·  nhớ PRAGMA foreign_keys = ON ở MỖI kết nối.', 'Run: sqlite3 data.db < file.sql  ·  remember PRAGMA foreign_keys = ON on EVERY connection.'));
  W('-- =====================================================================');
  W();

  // ── Mở đầu theo hệ ──
  const db = opts.database?.trim() || null;
  if (to === 'sqlserver') {
    W('SET ANSI_NULLS ON;');
    W('SET QUOTED_IDENTIFIER ON;   -- ' + L(lang, bi('bắt buộc cho chỉ mục có lọc (WHERE)', 'required by filtered indexes (WHERE)')));
    W('GO');
    if (db) {
      W('USE master;');
      W('GO');
      W(`IF DB_ID(N'${db.replace(/'/g, "''")}') IS NULL CREATE DATABASE ${quoteIdent(db, to)};`);
      W('GO');
      W(`USE ${quoteIdent(db, to)};`);
      W('GO');
    }
  } else if (to === 'postgres') {
    W("SET client_encoding = 'UTF8';");
    if (db) {
      C(bi('Tạo CSDL (chạy riêng một lần, ngoài giao dịch), rồi kết nối vào nó:', 'Create the database (once, outside a transaction), then connect to it:'));
      W(`--   CREATE DATABASE ${quoteIdent(n(db), to)} ENCODING 'UTF8' TEMPLATE template0;`);
      W(`--   \\connect ${n(db)}`);
    }
  } else if (to === 'mysql') {
    W('SET NAMES utf8mb4;');
    if (db) {
      W(`CREATE DATABASE IF NOT EXISTS ${quoteIdent(db, to)} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;`);
      W(`USE ${quoteIdent(db, to)};`);
    }
  } else {
    W('PRAGMA foreign_keys = ON;');
  }
  W();

  // ── Xoá bảng cũ ──
  if (opts.drop !== false && order.length) {
    C(bi('── 0. Xoá bảng cũ (con trước, cha sau) ──', '── 0. Drop old tables (children first, then parents) ──'));
    const rev = [...order].reverse();
    if (to === 'sqlserver') {
      for (const d of deferred) W(`IF OBJECT_ID(N'${g.tq(d.table).replace(/'/g, "''")}', N'U') IS NOT NULL ALTER TABLE ${g.tq(d.table)} DROP CONSTRAINT IF EXISTS ${g.q(fkName(d.table, d.fk))};`);
      for (const t of rev) W(`DROP TABLE IF EXISTS ${g.tq(t)};`);
      W('GO');
    } else if (to === 'postgres') {
      W(`DROP TABLE IF EXISTS ${rev.map((t) => g.tq(t)).join(', ')} CASCADE;`);
    } else if (to === 'mysql') {
      W('SET FOREIGN_KEY_CHECKS = 0;');
      W(`DROP TABLE IF EXISTS ${rev.map((t) => g.tq(t)).join(', ')};`);
      W('SET FOREIGN_KEY_CHECKS = 1;');
    } else {
      W('PRAGMA foreign_keys = OFF;');
      for (const t of rev) W(`DROP TABLE IF EXISTS ${g.tq(t)};`);
      W('PRAGMA foreign_keys = ON;');
    }
    W();
  }

  if (to === 'postgres') {
    const schemas = [...new Set(model.tables.map((t) => t.schema).filter((s): s is string => !!s))];
    for (const s of schemas) W(`CREATE SCHEMA IF NOT EXISTS ${quoteIdent(n(s), to)};`);
    if (schemas.length) W();
  }

  // ── Bảng ──
  C(bi('── 1. Bảng (cha trước, con sau) ──', '── 1. Tables (parents first, then children) ──'));
  W();
  const placed = new Set<string>();
  const extraIndexes: string[] = [];
  for (const t of order) {
    tableSql(g, t, (fk) => !deferredSet.has(fk) && (sameName(fk.refTable, t.name) || placed.has(fk.refTable.toLowerCase()) || !findTable(model, fk.refTable)), extraIndexes);
    placed.add(t.name.toLowerCase());
    if (to === 'sqlserver') W('GO');
    W();
  }

  // ── Khoá ngoại hoãn (vòng tham chiếu) ──
  if (deferred.length && to !== 'sqlite') {
    C(bi('── 2. Khoá ngoại thêm sau (hai bảng trỏ vòng vào nhau) ──', '── 2. Foreign keys added afterwards (tables that reference each other in a cycle) ──'));
    for (const d of deferred) W(`ALTER TABLE ${g.tq(d.table)} ADD ${fkSql(g, d.table, d.fk)};`);
    if (to === 'sqlserver') W('GO');
    W();
  }

  // ── Chỉ mục ──
  const idxLines = [...extraIndexes];
  const usedNames = new Set<string>();
  for (const t of order) for (const ix of t.indexes) idxLines.push(...indexSql(g, t, ix, usedNames));
  if (opts.indexForeignKeys) for (const t of order) for (const fk of t.foreignKeys) if (!fkIndexed(t, fk)) idxLines.push(`CREATE INDEX ${g.q(uniqueName(usedNames, `IX_${t.name}_${fk.columns.join('_')}`, g.to))} ON ${g.tq(t)} (${fk.columns.map(g.q).join(', ')});`);
  if (idxLines.length) {
    C(bi('── 3. Chỉ mục ──', '── 3. Indexes ──'));
    for (const l of idxLines) W(l);
    if (to === 'sqlserver') W('GO');
    W();
  }

  // ── Chú thích (PostgreSQL) ──
  if (to === 'postgres' && opts.comments !== false) {
    const cl: string[] = [];
    for (const t of order) {
      if (t.comment) cl.push(`COMMENT ON TABLE ${g.tq(t)} IS ${sqlString(t.comment, to)};`);
      for (const c of t.columns) if (c.comment) cl.push(`COMMENT ON COLUMN ${g.tq(t)}.${g.q(c.name)} IS ${sqlString(c.comment, to)};`);
    }
    if (cl.length) { C(bi('── 4. Chú thích (xem được trong pgAdmin / DBeaver / \\d+) ──', '── 4. Comments (visible in pgAdmin / DBeaver / \\d+) ──')); for (const l of cl) W(l); W(); }
  }

  // PostgreSQL: chèn dữ liệu có sẵn id (chép từ SQL Server…) xong thì bộ đếm IDENTITY vẫn ở 1 ⇒ lần INSERT tự sinh kế tiếp trùng khoá.
  if (to === 'postgres') {
    const ids = order.flatMap((t) => t.columns.filter((c) => c.identity && canonOf(c.type, model.enums, model.dialect).k === 'int').map((c) => ({ t, c })));
    if (ids.length) {
      C(bi('── Nạp dữ liệu có sẵn id (INSERT … OVERRIDING SYSTEM VALUE) xong thì chạy các dòng dưới để bộ đếm IDENTITY chạy tiếp từ số lớn nhất ──', '── After loading rows WITH their ids (INSERT … OVERRIDING SYSTEM VALUE), run these so IDENTITY continues after the largest id ──'));
      for (const { t, c } of ids) W(`-- SELECT setval(pg_get_serial_sequence('${g.tq(t).replace(/'/g, "''")}', '${n(c.name).replace(/'/g, "''")}'), COALESCE((SELECT max(${g.q(c.name)}) FROM ${g.tq(t)}), 1));`);
      W();
    }
  }
  flushTypeNotes(g);
  if (g.notes.length) {
    C(bi(`── Ghi chú chuyển đổi (${g.notes.length}) — đọc trước khi dùng ──`, `── Conversion notes (${g.notes.length}) — read before using ──`));
    for (const b of g.notes) W(`--  • ${oneLine(L(lang, b))}`);
    W();
  }
  if (to === 'sqlserver') W(`PRINT N'${L(lang, bi(`✔ Đã tạo ${model.tables.length} bảng.`, `✔ Created ${model.tables.length} tables.`))}';`);
  else if (to !== 'sqlite') W(`SELECT '${L(lang, bi(`Đã tạo ${model.tables.length} bảng`, `Created ${model.tables.length} tables`)).replace(/'/g, "''")}' AS ${to === 'postgres' ? 'ket_qua' : 'result'};`);
  W(`-- ${L(lang, bi('Hết.', 'End.'))}`);
  return { text: g.out.join('\n') + '\n', fileName: fileNameFor(to, opts.title ?? model.database), mime: mimeFor(to), ext: FILE_EXT[to][0], notes: g.notes, bom: to === 'sqlserver' };
}

function fkName(t: Table, fk: ForeignKey): string { return fk.name ?? `FK_${t.name}_${fk.refTable}`; }

function fkIndexed(t: Table, fk: ForeignKey): boolean {
  const lead = (cols: string[]) => fk.columns.every((c, i) => cols[i] !== undefined && sameName(cols[i], c));
  if (t.primaryKey && lead(t.primaryKey.columns)) return true;
  if (t.uniques.some((u) => lead(u.columns))) return true;
  return t.indexes.some((ix) => !ix.where && lead(ix.columns.map((c) => c.name)));
}

function uniqueName(used: Set<string>, base: string, to: SqlTarget): string {
  const max = to === 'postgres' ? 63 : to === 'mysql' ? 64 : 128;
  let name = base.slice(0, max);
  let i = 2;
  while (used.has(name.toLowerCase())) name = `${base.slice(0, max - 3)}_${i++}`;
  used.add(name.toLowerCase());
  return name;
}

function refAction(g: Gen, a: ForeignKey['onDelete'], where: string): string | null {
  if (!a) return null;
  if (a === 'RESTRICT' && g.to === 'sqlserver') { note(g, bi(`${where}: SQL Server không có RESTRICT ⇒ dùng NO ACTION (cũng chặn xoá cha khi còn con)`, `${where}: SQL Server has no RESTRICT ⇒ NO ACTION (it also blocks deleting a parent that still has children)`)); return 'NO ACTION'; }
  if (a === 'SET DEFAULT' && g.to === 'mysql') { note(g, bi(`${where}: InnoDB của MySQL không nhận SET DEFAULT ⇒ đổi thành NO ACTION`, `${where}: MySQL InnoDB rejects SET DEFAULT ⇒ NO ACTION`)); return 'NO ACTION'; }
  return a;
}

function fkSql(g: Gen, t: Table, fk: ForeignKey): string {
  const ref = resolvedRefColumns(g.m, fk);
  const where = `FK ${fkName(t, fk)}`;
  const parts = [`CONSTRAINT ${g.q(fkName(t, fk))} FOREIGN KEY (${fk.columns.map(g.q).join(', ')}) REFERENCES ${g.tq(fk.refTable)} (${ref.map(g.q).join(', ')})`];
  const d = refAction(g, fk.onDelete, where); if (d && d !== 'NO ACTION') parts.push(`ON DELETE ${d}`);
  const u = refAction(g, fk.onUpdate, where); if (u && u !== 'NO ACTION') parts.push(`ON UPDATE ${u}`);
  return parts.join(' ');
}

function envFor(g: Gen, t: Table, where: string, fsp?: number): ExprEnv {
  return {
    from: g.m.dialect, to: g.to, where, fsp,
    ident: (name) => { const c = findColumn(t, name); return g.q(c?.name ?? name); },
    colCanon: (name) => { const c = findColumn(t, name); return c ? canonOf(c.type, g.m.enums, g.m.dialect) : undefined; },
    note: (b) => note(g, b),
  };
}

/** Tên cột người dùng cần chữ có dấu (SQL Server ⇒ N…) — chỉ dùng khi nguồn không phải SQL Server. */
const VI_TEXT = /(name|title|description|desc|address|note|comment|content|fullname|ten|hoten|diachi|mota|ghichu|noidung|tieude)$/i;

function columnLine(g: Gen, t: Table, c: Column, inlinePk: boolean): { line: string; comment?: string } {
  const canon: Canon = canonOf(c.type, g.m.enums, g.m.dialect);
  const where = `${t.name}.${c.name}`;
  const to = g.to;
  const name = g.q(c.name);
  if (c.computed && to === 'sqlserver') return { line: `${name} AS (${translateExpr(c.computed.expr, envFor(g, t, where))})${c.computed.stored ? ' PERSISTED' : ''}` };
  if (canon.k === 'computed') {
    if (to === 'sqlserver' && c.computed) return { line: `${name} AS (${translateExpr(c.computed.expr, envFor(g, t, where))})${c.computed.stored ? ' PERSISTED' : ''}` };
    note(g, bi(`${where}: cột tính toán không ghi kiểu ⇒ ${to} cần kiểu — đã để dạng chú thích, hãy thêm kiểu rồi bỏ "--"`, `${where}: computed column without a type ⇒ ${to} needs one — left commented out; add a type and uncomment it`));
    return { line: `-- ${name} <type> GENERATED ALWAYS AS (${c.computed ? translateExpr(c.computed.expr, envFor(g, t, where)) : ''}) STORED` };
  }
  const unicodeHint = to === 'sqlserver' && g.m.dialect !== 'sqlserver' && (canon.k === 'char' || canon.k === 'text') && VI_TEXT.test(c.name);
  let ty = renderType(canon, to, { unicodeHint });
  if (ty.note) typeNote(g, ty.note, where);
  const parts: string[] = [name];
  const id = c.identity;
  let typeSql = ty.sql;
  if (id && canon.k !== 'int') {
    if (to === 'postgres' || to === 'mysql' || to === 'sqlite') {
      note(g, bi(`${where}: tự tăng trên kiểu ${c.type.raw} ⇒ đổi sang ${to === 'sqlite' ? 'INTEGER' : 'BIGINT'}`, `${where}: auto-increment on ${c.type.raw} ⇒ changed to ${to === 'sqlite' ? 'INTEGER' : 'BIGINT'}`));
      typeSql = to === 'sqlite' ? 'INTEGER' : 'BIGINT';
      ty = { sql: typeSql };
    }
  }
  if (to === 'sqlite' && id && inlinePk) {
    parts.push('INTEGER');
    const pkn = t.primaryKey?.name;
    parts.push(`${pkn ? `CONSTRAINT ${g.q(pkn)} ` : ''}PRIMARY KEY AUTOINCREMENT`);
  } else {
    parts.push(typeSql);
    // Cột sinh tự động: MySQL bắt buộc GENERATED … đứng NGAY sau kiểu (PostgreSQL thì chỗ nào cũng được).
    if (c.computed && to !== 'sqlserver') parts.push(`GENERATED ALWAYS AS (${translateExpr(c.computed.expr, envFor(g, t, where))}) ${c.computed.stored || to === 'postgres' ? 'STORED' : 'VIRTUAL'}`);
    if (id) {
      if (to === 'sqlserver') parts.push(`IDENTITY(${id.start},${id.increment})`);
      else if (to === 'postgres') {
        const mode = g.o.pgIdentity === 'by_default' || id.mode === 'by_default' || id.mode === 'serial' || id.mode === 'sequence' ? 'BY DEFAULT' : 'ALWAYS';
        parts.push(`GENERATED ${mode} AS IDENTITY${id.start !== 1 || id.increment !== 1 ? ` (START WITH ${id.start} INCREMENT BY ${id.increment})` : ''}`);
      } else if (to === 'sqlite') {
        note(g, bi(`${where}: SQLite chỉ tự tăng được cột INTEGER PRIMARY KEY một cột ⇒ bỏ tự tăng ở cột này`, `${where}: SQLite only auto-increments a single-column INTEGER PRIMARY KEY ⇒ auto-increment dropped here`));
      }
    }
  }
  if (!(to === 'sqlite' && id && inlinePk)) {
    if (!c.nullable) parts.push('NOT NULL');
    else if (to === 'sqlserver' || c.nullExplicit) parts.push('NULL');
  }
  if (to === 'mysql' && id) parts.push('AUTO_INCREMENT');
  if (c.default && !id) {
    const fsp = canon.k === 'datetime' ? canon.p ?? (canon.legacy === 'datetime' ? 3 : undefined) : undefined;
    let d = translateExpr(c.default, envFor(g, t, `DEFAULT ${where}`, to === 'mysql' ? (fsp && fsp > 0 ? Math.min(6, fsp) : undefined) : undefined));
    if (canon.k === 'bool' && to === 'postgres' && /^'?[01]'?$/.test(d)) d = /1/.test(d) ? 'TRUE' : 'FALSE';
    if (canon.k === 'bool' && (to === 'sqlserver' || to === 'sqlite') && /^(TRUE|FALSE)$/i.test(d)) d = /TRUE/i.test(d) ? '1' : '0';
    if ((to === 'mysql' || to === 'sqlite') && !isSimpleLiteral(d)) d = `(${d})`;
    else if (to === 'mysql' && (canon.k === 'text' || canon.k === 'json' || canon.k === 'binary' || (canon.k === 'char' && /TEXT$/.test(ty.sql)))) d = `(${d})`;
    if (to === 'sqlserver' && c.defaultName) parts.push(`CONSTRAINT ${g.q(c.defaultName)} DEFAULT ${d}`);
    else parts.push(`DEFAULT ${d}`);
  }
  if (to === 'mysql' && c.comment && g.o.comments !== false) parts.push(`COMMENT ${sqlString(c.comment.slice(0, 1000), to)}`);
  if (ty.enumCheck) {
    // ENUM ⇒ VARCHAR + CHECK (IN …) trên hệ không có ENUM — đặt cạnh cột.
    parts.push(`CHECK (${name} IN (${ty.enumCheck.map((v) => sqlString(v, to)).join(', ')}))`);
  }
  const comment = c.comment && g.o.comments !== false && (to === 'sqlserver' || to === 'sqlite') ? oneLine(c.comment) : undefined;
  return { line: parts.join(' '), comment };
}

function tableSql(g: Gen, t: Table, inlineFk: (fk: ForeignKey) => boolean, extraIndexes: string[]) {
  const to = g.to;
  const W = (s = '') => g.out.push(s);
  if (t.comment && g.o.comments !== false && to !== 'postgres' && to !== 'mysql') W(`-- ${oneLine(t.comment)}`);
  const single = t.primaryKey?.columns.length === 1 ? findColumn(t, t.primaryKey.columns[0]) : undefined;
  const sqliteInlinePk = to === 'sqlite' && !!single?.identity && canonOf(single.type, g.m.enums, g.m.dialect).k === 'int';
  const lines: Array<{ line: string; comment?: string }> = [];
  for (const c of t.columns) lines.push(columnLine(g, t, c, sqliteInlinePk && c === single));
  // Ràng buộc
  if (t.primaryKey && !sqliteInlinePk) {
    const pk = t.primaryKey;
    lines.push({ line: `${pk.name && to !== 'mysql' ? `CONSTRAINT ${g.q(pk.name)} ` : ''}PRIMARY KEY${to === 'sqlserver' && pk.clustered === false ? ' NONCLUSTERED' : ''} (${pk.columns.map(g.q).join(', ')})` });
  }
  for (const u of t.uniques) {
    const nullable = u.columns.filter((c) => findColumn(t, c)?.nullable);
    if (to === 'sqlserver' && g.m.dialect !== 'sqlserver' && nullable.length) {
      const nm = u.name ?? `UQ_${t.name}_${u.columns.join('_')}`;
      extraIndexes.push(`CREATE UNIQUE INDEX ${g.q(nm)} ON ${g.tq(t)} (${u.columns.map(g.q).join(', ')}) WHERE ${nullable.map((c) => `${g.q(c)} IS NOT NULL`).join(' AND ')};`);
      note(g, bi(`${t.name}: UNIQUE (${u.columns.join(', ')}) trên cột cho NULL — SQL Server chỉ cho MỘT dòng NULL ⇒ đổi thành chỉ mục UNIQUE có lọc WHERE … IS NOT NULL (giữ đúng luật của ${DIALECT_LABEL[g.m.dialect]})`, `${t.name}: UNIQUE (${u.columns.join(', ')}) on nullable columns — SQL Server allows only ONE NULL ⇒ rewritten as a filtered UNIQUE index WHERE … IS NOT NULL (same rule as ${DIALECT_LABEL[g.m.dialect]})`));
      continue;
    }
    if (g.m.dialect === 'sqlserver' && to !== 'sqlserver' && nullable.length) note(g, bi(`${t.name}: UNIQUE (${u.columns.join(', ')}) cho NULL — SQL Server chỉ cho một dòng NULL, ${DIALECT_LABEL[to]} cho NHIỀU dòng NULL${to === 'postgres' ? ' (muốn y hệt: UNIQUE NULLS NOT DISTINCT, PostgreSQL 15+)' : ''}`, `${t.name}: UNIQUE (${u.columns.join(', ')}) allows NULL — SQL Server allows one NULL row, ${DIALECT_LABEL[to]} allows MANY${to === 'postgres' ? ' (for the exact rule: UNIQUE NULLS NOT DISTINCT, PostgreSQL 15+)' : ''}`));
    lines.push({ line: `${u.name ? `CONSTRAINT ${g.q(u.name)} ` : ''}UNIQUE (${u.columns.map(g.q).join(', ')})` });
  }
  const actionCols = new Set(t.foreignKeys.filter((f) => (f.onDelete && f.onDelete !== 'NO ACTION' && f.onDelete !== 'RESTRICT') || (f.onUpdate && f.onUpdate !== 'NO ACTION' && f.onUpdate !== 'RESTRICT')).flatMap((f) => f.columns.map((c) => c.toLowerCase())));
  const autoCols = new Set(t.columns.filter((c) => c.identity).map((c) => c.name.toLowerCase()));
  for (const ck of t.checks) {
    const where = `CHECK ${ck.name ?? t.name}`;
    const text = translateExpr(ck.expr, envFor(g, t, where));
    const refs = ck.expr.toks.filter((x) => x.t === 'word' || x.t === 'qident').map((x) => x.v.toLowerCase());
    if (to === 'mysql' && refs.some((r) => actionCols.has(r) || autoCols.has(r))) {
      note(g, bi(`${where}: MySQL không cho CHECK dùng cột tự tăng hoặc cột khoá ngoại có ON DELETE/UPDATE ⇒ đã để dạng chú thích — kiểm luật này trong ứng dụng`, `${where}: MySQL does not allow a CHECK on an AUTO_INCREMENT column or a foreign-key column with ON DELETE/UPDATE ⇒ left commented out — enforce it in the application`));
      lines.push({ line: `-- ${ck.name ? `CONSTRAINT ${g.q(ck.name)} ` : ''}CHECK (${text})` });
      continue;
    }
    lines.push({ line: `${ck.name ? `CONSTRAINT ${g.q(ck.name)} ` : ''}CHECK (${text})` });
  }
  for (const fk of t.foreignKeys) if (inlineFk(fk) || to === 'sqlite') lines.push({ line: fkSql(g, t, fk) });
  // Ghép dòng: căn cột tên/kiểu cho dễ đọc
  const real = lines.map((l, i) => ({ ...l, i, sep: i < lines.length - 1 && !lines.slice(i + 1).every((x) => x.line.startsWith('--')) ? ',' : '' }));
  // dòng chú thích (-- …) không có dấu phẩy, dòng trước nó vẫn cần phẩy nếu sau còn dòng thật
  W(`CREATE TABLE ${g.tq(t)} (`);
  const nameW = Math.min(28, Math.max(...t.columns.map((c) => g.q(c.name).length)));
  real.forEach((l) => {
    let s = l.line;
    const isCol = l.i < t.columns.length && !s.startsWith('--');
    if (isCol) {
      const nm = g.q(t.columns[l.i].name);
      s = nm.padEnd(nameW) + s.slice(nm.length);
    }
    const body = `    ${s}${s.startsWith('--') ? '' : l.sep}`;
    W(l.comment ? `${body.padEnd(64)} -- ${l.comment}` : body);
  });
  const opts: string[] = [];
  if (to === 'mysql') {
    opts.push('ENGINE=InnoDB', 'DEFAULT CHARSET=utf8mb4', 'COLLATE=utf8mb4_0900_as_ci');
    const id = t.columns.find((c) => c.identity && c.identity.start !== 1);
    if (id) opts.push(`AUTO_INCREMENT=${id.identity!.start}`);
    if (t.comment && g.o.comments !== false) opts.push(`COMMENT=${sqlString(t.comment.slice(0, 2000), to)}`);
  }
  W(`)${opts.length ? ` ${opts.join(' ')}` : ''};`);
  if (to === 'mysql' && t.columns.some((c) => c.identity && !(t.primaryKey?.columns[0] && sameName(t.primaryKey.columns[0], c.name)))) note(g, bi(`${t.name}: AUTO_INCREMENT phải là cột đầu của một khoá (PRIMARY KEY/UNIQUE) trong MySQL — kiểm tra lại`, `${t.name}: in MySQL an AUTO_INCREMENT column must be the first column of a key (PRIMARY KEY/UNIQUE) — review it`));
}

function indexSql(g: Gen, t: Table, ix: Index, used: Set<string>): string[] {
  const to = g.to;
  const base = ix.name ?? `${ix.unique ? 'UX' : 'IX'}_${t.name}_${ix.columns.map((c) => c.name.replace(/\W+/g, '')).join('_')}`.slice(0, 60);
  const nm = uniqueName(used, base, to);
  if (nm !== base && (to === 'postgres' || to === 'sqlite')) note(g, bi(`Chỉ mục ${base}: ${DIALECT_LABEL[to]} cần tên chỉ mục KHÔNG trùng trong cả CSDL ⇒ đổi thành ${nm}`, `Index ${base}: ${DIALECT_LABEL[to]} needs index names unique in the whole database ⇒ renamed to ${nm}`));
  const where = `INDEX ${nm}`;
  const env = envFor(g, t, where);
  const col = (c: Index['columns'][number]) => {
    if (c.expr) {
      const e = translateExpr(c.expr, env);
      if (to === 'mysql') return `((${e}))`;
      if (to === 'sqlserver') { note(g, bi(`${where}: SQL Server không đánh chỉ mục trên biểu thức ⇒ tạo cột tính toán (computed column) rồi đánh chỉ mục cột đó`, `${where}: SQL Server cannot index an expression ⇒ add a computed column and index that`)); return `/* (${e}) */`; }
      return `(${e})`;
    }
    let s = g.q(c.name);
    if (c.length && to === 'mysql') s += `(${c.length})`;
    else if (c.length) note(g, bi(`${where}: độ dài tiền tố (${c.name}(${c.length})) chỉ có ở MySQL ⇒ bỏ`, `${where}: prefix length (${c.name}(${c.length})) exists only in MySQL ⇒ dropped`));
    if (c.desc) s += ' DESC';
    return s;
  };
  const cols = ix.columns.map(col).join(', ');
  const tq = g.tq(t);
  const qn = g.q(nm);
  const method = ix.method?.toUpperCase();
  if (method === 'FULLTEXT' || method === 'SPATIAL') {
    if (to === 'mysql') return [`CREATE ${method} INDEX ${qn} ON ${tq} (${cols});`];
    note(g, bi(`${where}: chỉ mục ${method} của MySQL không chuyển được sang ${DIALECT_LABEL[to]} ⇒ ${to === 'postgres' ? 'dùng GIN + to_tsvector' : to === 'sqlserver' ? 'dùng FULLTEXT CATALOG' : 'dùng FTS5'}`, `${where}: a MySQL ${method} index has no direct equivalent in ${DIALECT_LABEL[to]} ⇒ ${to === 'postgres' ? 'use GIN + to_tsvector' : to === 'sqlserver' ? 'use a FULLTEXT CATALOG' : 'use FTS5'}`));
    return [`-- ${method} INDEX ${nm} ON ${t.name} (${ix.columns.map((c) => c.name).join(', ')})`];
  }
  const include = ix.include?.length ? ix.include : undefined;
  if (include && (to === 'mysql' || to === 'sqlite')) note(g, bi(`${where}: INCLUDE (${include.join(', ')}) không có ở ${DIALECT_LABEL[to]} ⇒ bỏ (chỉ mục vẫn đúng, chỉ bớt "phủ")`, `${where}: INCLUDE (${include.join(', ')}) does not exist in ${DIALECT_LABEL[to]} ⇒ dropped (still correct, just not covering)`));
  const inc = include && (to === 'sqlserver' || to === 'postgres') ? ` INCLUDE (${include.map(g.q).join(', ')})` : '';
  const using = to === 'postgres' && method && ['GIN', 'GIST', 'BRIN', 'HASH', 'SPGIST'].includes(method) ? ` USING ${method}` : '';
  const wh = ix.where ? translateExpr(ix.where, env) : null;
  if (wh && to === 'mysql') {
    if (ix.unique) {
      // MySQL không có chỉ mục lọc ⇒ chỉ mục UNIQUE trên biểu thức: dòng ngoài điều kiện cho NULL, mà NULL thì không bao giờ trùng.
      const parts = ix.columns.map((c) => `CASE WHEN ${wh} THEN ${c.expr ? translateExpr(c.expr, env) : g.q(c.name)} END`);
      note(g, bi(`${where}: MySQL không có chỉ mục lọc (WHERE ${ix.where!.text}) ⇒ dùng chỉ mục UNIQUE trên biểu thức CASE WHEN … THEN cột END (MySQL 8.0.13+): dòng không thoả điều kiện cho NULL, mà NULL không bao giờ bị coi là trùng ⇒ đúng luật cũ`, `${where}: MySQL has no filtered indexes (WHERE ${ix.where!.text}) ⇒ a UNIQUE index on CASE WHEN … THEN column END (MySQL 8.0.13+): rows outside the condition give NULL, and NULLs never collide ⇒ same rule`));
      return [`-- ${L(g.lang, bi(`Thay cho: chỉ mục UNIQUE có lọc WHERE ${ix.where!.text}`, `Replaces: filtered UNIQUE index WHERE ${ix.where!.text}`))}`, `CREATE UNIQUE INDEX ${qn} ON ${tq} (${parts.map((p) => `(${p})`).join(', ')});`];
    }
    note(g, bi(`${where}: MySQL không có chỉ mục lọc ⇒ đánh chỉ mục cả bảng (bỏ WHERE ${ix.where!.text}) — vẫn đúng, chỉ to hơn`, `${where}: MySQL has no filtered indexes ⇒ indexes the whole table (WHERE ${ix.where!.text} dropped) — still correct, just bigger`));
  }
  const kw = `CREATE ${ix.unique ? 'UNIQUE ' : ''}${to === 'sqlserver' && ix.clustered !== undefined ? (ix.clustered ? 'CLUSTERED ' : 'NONCLUSTERED ') : ''}INDEX`;
  return [`${kw} ${qn} ON ${tq}${using} (${cols})${inc}${wh && to !== 'mysql' ? ` WHERE ${wh}` : ''};`];
}

export { L as pickLang };
