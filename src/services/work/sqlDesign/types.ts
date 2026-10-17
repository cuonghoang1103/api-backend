/**
 * Database designer — KIỂU DỮ LIỆU: đọc kiểu của bất kỳ hệ nào về một dạng CHUẨN, rồi viết lại đúng cho hệ đích.
 *
 *   NVARCHAR(n)    → VARCHAR(n) (PostgreSQL/MySQL đều lưu UTF-8) · TEXT (SQLite)
 *   NVARCHAR(MAX)  → TEXT · LONGTEXT
 *   BIT            → BOOLEAN
 *   DATETIME2(p)   → TIMESTAMP(p) · DATETIME(p)
 *   DECIMAL(p,s)   giữ nguyên (KHÔNG BAO GIỜ đổi tiền sang FLOAT)
 *   UNIQUEIDENTIFIER ↔ UUID ↔ CHAR(36)
 */

import type { Bi, DataType, Dialect, EnumType, ExportTarget } from './model.js';
import { bi } from './model.js';

export type Canon =
  | { k: 'int'; bytes: 1 | 2 | 3 | 4 | 8; unsigned?: boolean }
  | { k: 'decimal'; p?: number; s?: number }
  | { k: 'money'; small?: boolean }
  | { k: 'float'; bits: 24 | 53 }
  | { k: 'bool' }
  | { k: 'char'; n?: number; max?: boolean; unicode: boolean; fixed: boolean }
  | { k: 'text'; unicode: boolean; size?: 'tiny' | 'medium' | 'long' }
  | { k: 'date' }
  | { k: 'time'; p?: number }
  | { k: 'datetime'; p?: number; tz: boolean; legacy?: 'datetime' | 'smalldatetime' }
  | { k: 'uuid' }
  | { k: 'json'; binary?: boolean }
  | { k: 'binary'; n?: number; max?: boolean; fixed?: boolean }
  | { k: 'enum'; values: string[]; name?: string }
  | { k: 'xml' }
  | { k: 'interval' }
  | { k: 'year' }
  | { k: 'computed' }
  | { k: 'other'; raw: string };

/** Tên kiểu dựng sẵn (để chuẩn hoá `[int]` của SSMS thành INT). */
export const BUILTIN_TYPES = new Set([
  'BIT', 'TINYINT', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER', 'BIGINT', 'INT2', 'INT4', 'INT8', 'SERIAL', 'SERIAL2', 'SERIAL4', 'SERIAL8', 'SMALLSERIAL', 'BIGSERIAL',
  'DECIMAL', 'DEC', 'NUMERIC', 'NUMBER', 'MONEY', 'SMALLMONEY', 'FLOAT', 'FLOAT4', 'FLOAT8', 'REAL', 'DOUBLE', 'DOUBLE PRECISION',
  'BOOLEAN', 'BOOL', 'CHAR', 'CHARACTER', 'NCHAR', 'VARCHAR', 'NVARCHAR', 'VARCHAR2', 'NVARCHAR2', 'CHARACTER VARYING', 'CHAR VARYING', 'NATIONAL CHARACTER VARYING',
  'NATIONAL CHAR VARYING', 'NATIONAL CHARACTER', 'NATIONAL CHAR', 'NCHAR VARYING', 'TEXT', 'NTEXT', 'TINYTEXT', 'MEDIUMTEXT', 'LONGTEXT', 'CLOB', 'NCLOB', 'CITEXT', 'STRING',
  'DATE', 'TIME', 'DATETIME', 'DATETIME2', 'SMALLDATETIME', 'DATETIMEOFFSET', 'TIMESTAMP', 'TIMESTAMPTZ', 'TIMETZ', 'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITHOUT TIME ZONE',
  'TIME WITH TIME ZONE', 'TIME WITHOUT TIME ZONE', 'YEAR', 'INTERVAL', 'UNIQUEIDENTIFIER', 'UUID', 'JSON', 'JSONB', 'XML', 'BINARY', 'VARBINARY', 'IMAGE', 'BYTEA',
  'BLOB', 'TINYBLOB', 'MEDIUMBLOB', 'LONGBLOB', 'ROWVERSION', 'ENUM', 'SET', 'INET', 'CIDR', 'MACADDR', 'GEOGRAPHY', 'GEOMETRY', 'HIERARCHYID', 'SQL_VARIANT', 'BINARY VARYING', 'BIT VARYING',
  'LONG VARCHAR', 'LONG VARBINARY', 'ANY',
]);

const num = (x: number | string | undefined) => (typeof x === 'number' ? x : undefined);
const isMax = (x: number | string | undefined) => typeof x === 'string' && x.toUpperCase() === 'MAX';

export function canonOf(t: DataType, enums: EnumType[] = [], dialect?: Dialect): Canon {
  const a0 = t.args[0];
  const a1 = t.args[1];
  const name = t.name.toUpperCase();
  switch (name) {
    case 'COMPUTED': return { k: 'computed' };
    case 'BIT': return a0 !== undefined && num(a0) !== 1 ? { k: 'binary', n: num(a0), fixed: true } : { k: 'bool' };
    case 'BOOLEAN': case 'BOOL': return { k: 'bool' };
    // TINYINT của SQL Server là 0–255 (không âm); của MySQL là -128–127 (trừ khi UNSIGNED). TINYINT(1) của MySQL = BOOLEAN.
    case 'TINYINT': return num(a0) === 1 && dialect !== 'sqlserver' ? { k: 'bool' } : { k: 'int', bytes: 1, unsigned: dialect === 'sqlserver' || t.unsigned };
    case 'SMALLINT': case 'INT2': case 'SMALLSERIAL': case 'SERIAL2': return { k: 'int', bytes: 2, unsigned: t.unsigned };
    case 'MEDIUMINT': return { k: 'int', bytes: 3, unsigned: t.unsigned };
    case 'INT': case 'INTEGER': case 'INT4': case 'SERIAL': case 'SERIAL4': return { k: 'int', bytes: 4, unsigned: t.unsigned };
    case 'BIGINT': case 'INT8': case 'BIGSERIAL': case 'SERIAL8': return { k: 'int', bytes: 8, unsigned: t.unsigned };
    case 'DECIMAL': case 'DEC': case 'NUMERIC': case 'NUMBER': return { k: 'decimal', p: num(a0), s: num(a1) };
    case 'MONEY': return { k: 'money' };
    case 'SMALLMONEY': return { k: 'money', small: true };
    case 'FLOAT': return num(a0) !== undefined && num(a0)! <= 24 ? { k: 'float', bits: 24 } : { k: 'float', bits: 53 };
    case 'FLOAT8': case 'DOUBLE': case 'DOUBLE PRECISION': return { k: 'float', bits: 53 };
    case 'REAL': case 'FLOAT4': return { k: 'float', bits: 24 };
    case 'CHAR': case 'CHARACTER': return { k: 'char', n: num(a0) ?? 1, unicode: false, fixed: true };
    case 'NCHAR': case 'NATIONAL CHARACTER': case 'NATIONAL CHAR': return { k: 'char', n: num(a0) ?? 1, unicode: true, fixed: true };
    case 'VARCHAR': case 'CHARACTER VARYING': case 'CHAR VARYING': case 'VARCHAR2': case 'STRING':
      return isMax(a0) ? { k: 'char', max: true, unicode: false, fixed: false } : a0 === undefined ? { k: 'char', unicode: false, fixed: false } : { k: 'char', n: num(a0), unicode: false, fixed: false };
    case 'NVARCHAR': case 'NATIONAL CHARACTER VARYING': case 'NATIONAL CHAR VARYING': case 'NCHAR VARYING': case 'NVARCHAR2':
      return isMax(a0) ? { k: 'char', max: true, unicode: true, fixed: false } : a0 === undefined ? { k: 'char', unicode: true, fixed: false } : { k: 'char', n: num(a0), unicode: true, fixed: false };
    case 'TEXT': case 'CLOB': case 'CITEXT': case 'LONG VARCHAR': return { k: 'text', unicode: false };
    case 'NTEXT': case 'NCLOB': return { k: 'text', unicode: true };
    case 'TINYTEXT': return { k: 'text', unicode: false, size: 'tiny' };
    case 'MEDIUMTEXT': return { k: 'text', unicode: false, size: 'medium' };
    case 'LONGTEXT': return { k: 'text', unicode: false, size: 'long' };
    case 'DATE': return { k: 'date' };
    case 'TIME': case 'TIME WITHOUT TIME ZONE': case 'TIME WITH TIME ZONE': case 'TIMETZ': return { k: 'time', p: num(a0) };
    case 'DATETIME': return { k: 'datetime', p: num(a0), tz: false, legacy: 'datetime' };
    case 'SMALLDATETIME': return { k: 'datetime', p: 0, tz: false, legacy: 'smalldatetime' };
    case 'DATETIME2': case 'TIMESTAMP WITHOUT TIME ZONE': return { k: 'datetime', p: num(a0), tz: false };
    case 'TIMESTAMP': return { k: 'datetime', p: num(a0), tz: false };
    case 'DATETIMEOFFSET': case 'TIMESTAMPTZ': case 'TIMESTAMP WITH TIME ZONE': return { k: 'datetime', p: num(a0), tz: true };
    case 'YEAR': return { k: 'year' };
    case 'INTERVAL': return { k: 'interval' };
    case 'UNIQUEIDENTIFIER': case 'UUID': return { k: 'uuid' };
    case 'JSON': return { k: 'json' };
    case 'JSONB': return { k: 'json', binary: true };
    case 'XML': return { k: 'xml' };
    case 'BINARY': return { k: 'binary', n: num(a0) ?? 1, fixed: true };
    case 'VARBINARY': case 'BINARY VARYING': case 'LONG VARBINARY': return isMax(a0) ? { k: 'binary', max: true } : { k: 'binary', n: num(a0) };
    case 'IMAGE': case 'BYTEA': case 'BLOB': case 'LONGBLOB': case 'MEDIUMBLOB': return { k: 'binary', max: true };
    case 'TINYBLOB': return { k: 'binary', n: 255 };
    case 'ENUM': return { k: 'enum', values: t.args.map(String) };
    default: {
      const e = enums.find((x) => x.name.toUpperCase() === name || x.name.toUpperCase() === name.split('.').pop());
      if (e) return { k: 'enum', values: e.values, name: e.name };
      return { k: 'other', raw: t.raw || t.name };
    }
  }
}

export interface TypeOut { sql: string; note?: Bi; /** Kiểu đích cần thêm CHECK (ENUM trên hệ không có ENUM). */ enumCheck?: string[] }

const p0 = (p?: number) => (p === undefined ? '' : `(${p})`);

/** Viết kiểu chuẩn cho hệ đích. `unicodeHint` = cột này cần lưu tiếng Việt (SQL Server ⇒ N…). */
export function renderType(c: Canon, target: Exclude<ExportTarget, 'mongodb' | 'mermaid' | 'json' | 'dbml'>, o: { unicodeHint?: boolean } = {}): TypeOut {
  switch (target) {
    case 'sqlserver': return renderMssql(c, o);
    case 'postgres': return renderPg(c);
    case 'mysql': return renderMysql(c);
    case 'sqlite': return renderSqlite(c);
  }
}

function renderMssql(c: Canon, o: { unicodeHint?: boolean }): TypeOut {
  switch (c.k) {
    case 'int': return c.bytes === 1 ? (c.unsigned ? { sql: 'TINYINT' } : { sql: 'SMALLINT', note: bi('TINYINT của SQL Server chỉ 0–255 (không âm) ⇒ dùng SMALLINT', 'SQL Server TINYINT is 0–255 (unsigned) ⇒ SMALLINT') }) : c.bytes === 2 ? { sql: c.unsigned ? 'INT' : 'SMALLINT' } : c.bytes === 8 ? { sql: 'BIGINT' } : { sql: c.unsigned && c.bytes === 4 ? 'BIGINT' : 'INT' };
    case 'decimal': return { sql: c.p !== undefined ? `DECIMAL(${c.p}${c.s !== undefined ? `,${c.s}` : ''})` : 'DECIMAL(18,0)' };
    case 'money': return { sql: c.small ? 'SMALLMONEY' : 'MONEY' };
    case 'float': return { sql: c.bits === 24 ? 'REAL' : 'FLOAT' };
    case 'bool': return { sql: 'BIT' };
    case 'char': {
      const uni = c.unicode || !!o.unicodeHint;
      if (c.max || (c.n !== undefined && c.n > (uni ? 4000 : 8000))) return { sql: uni ? 'NVARCHAR(MAX)' : 'VARCHAR(MAX)' };
      if (c.n === undefined) return { sql: `${uni ? 'N' : ''}VARCHAR(255)`, note: bi('VARCHAR không ghi độ dài trong SQL Server nghĩa là VARCHAR(1) ⇒ ghi rõ (255)', 'VARCHAR without a length means VARCHAR(1) in SQL Server ⇒ written as (255)') };
      return { sql: `${uni ? 'N' : ''}${c.fixed ? 'CHAR' : 'VARCHAR'}(${c.n})` };
    }
    case 'text': return { sql: c.unicode || o.unicodeHint ? 'NVARCHAR(MAX)' : 'VARCHAR(MAX)' };
    case 'date': return { sql: 'DATE' };
    case 'time': return { sql: `TIME${p0(c.p)}` };
    case 'datetime': return c.tz ? { sql: `DATETIMEOFFSET${p0(c.p)}` } : c.legacy === 'datetime' && c.p === undefined ? { sql: 'DATETIME2(3)' } : c.legacy === 'smalldatetime' ? { sql: 'DATETIME2(0)' } : { sql: `DATETIME2${p0(c.p)}` };
    case 'uuid': return { sql: 'UNIQUEIDENTIFIER' };
    case 'json': return { sql: 'NVARCHAR(MAX)', note: bi('SQL Server lưu JSON trong NVARCHAR(MAX); thêm CHECK (ISJSON(cột) = 1) nếu muốn chặn chuỗi hỏng', 'SQL Server stores JSON in NVARCHAR(MAX); add CHECK (ISJSON(col) = 1) to reject broken JSON') };
    case 'binary': return { sql: c.max ? 'VARBINARY(MAX)' : c.fixed ? `BINARY(${c.n ?? 1})` : `VARBINARY(${c.n ?? 'MAX'})` };
    case 'enum': return { sql: `${o.unicodeHint ? 'N' : ''}VARCHAR(${Math.max(1, ...c.values.map((v) => v.length))})`, enumCheck: c.values };
    case 'xml': return { sql: 'XML' };
    case 'interval': return { sql: 'BIGINT', note: bi('SQL Server không có INTERVAL ⇒ lưu số giây/phút (ghi đơn vị vào tên cột)', 'SQL Server has no INTERVAL ⇒ store seconds/minutes (put the unit in the column name)') };
    case 'year': return { sql: 'SMALLINT' };
    case 'computed': return { sql: '' };
    case 'other': return { sql: c.raw, note: bi(`Kiểu "${c.raw}" không chuyển tự động được — kiểm tra lại`, `Type "${c.raw}" cannot be converted automatically — review it`) };
  }
}

function renderPg(c: Canon): TypeOut {
  switch (c.k) {
    case 'int': return { sql: c.bytes <= 2 ? (c.unsigned && c.bytes === 2 ? 'INTEGER' : 'SMALLINT') : c.bytes === 8 || (c.unsigned && c.bytes === 4) ? 'BIGINT' : 'INTEGER' };
    case 'decimal': return { sql: c.p !== undefined ? `NUMERIC(${c.p}${c.s !== undefined ? `,${c.s}` : ''})` : 'NUMERIC' };
    case 'money': return { sql: c.small ? 'NUMERIC(10,4)' : 'NUMERIC(19,4)', note: bi('Kiểu MONEY của PostgreSQL phụ thuộc lc_monetary ⇒ dùng NUMERIC', 'PostgreSQL MONEY depends on lc_monetary ⇒ NUMERIC') };
    case 'float': return { sql: c.bits === 24 ? 'REAL' : 'DOUBLE PRECISION' };
    case 'bool': return { sql: 'BOOLEAN' };
    case 'char': return c.max || c.n === undefined ? { sql: 'TEXT' } : { sql: `${c.fixed ? 'CHAR' : 'VARCHAR'}(${c.n})` };
    case 'text': return { sql: 'TEXT' };
    case 'date': return { sql: 'DATE' };
    case 'time': return { sql: `TIME${p0(c.p)}` };
    case 'datetime': return { sql: c.tz ? `TIMESTAMPTZ${p0(c.p)}` : `TIMESTAMP${p0(c.legacy === 'datetime' && c.p === undefined ? 3 : c.p)}` };
    case 'uuid': return { sql: 'UUID' };
    case 'json': return { sql: 'JSONB' };
    case 'binary': return { sql: 'BYTEA' };
    case 'enum': return { sql: `VARCHAR(${Math.max(1, ...c.values.map((v) => v.length))})`, enumCheck: c.values };
    case 'xml': return { sql: 'XML' };
    case 'interval': return { sql: 'INTERVAL' };
    case 'year': return { sql: 'SMALLINT' };
    case 'computed': return { sql: '' };
    case 'other': return { sql: c.raw, note: bi(`Kiểu "${c.raw}" không chuyển tự động được — kiểm tra lại`, `Type "${c.raw}" cannot be converted automatically — review it`) };
  }
}

function renderMysql(c: Canon): TypeOut {
  switch (c.k) {
    case 'int': return { sql: `${c.bytes === 1 ? 'TINYINT' : c.bytes === 2 ? 'SMALLINT' : c.bytes === 3 ? 'MEDIUMINT' : c.bytes === 8 ? 'BIGINT' : 'INT'}${c.unsigned ? ' UNSIGNED' : ''}` };
    case 'decimal': return { sql: c.p !== undefined ? `DECIMAL(${Math.min(65, c.p)}${c.s !== undefined ? `,${c.s}` : ''})` : 'DECIMAL(18,0)' };
    case 'money': return { sql: c.small ? 'DECIMAL(10,4)' : 'DECIMAL(19,4)' };
    case 'float': return { sql: c.bits === 24 ? 'FLOAT' : 'DOUBLE' };
    case 'bool': return { sql: 'BOOLEAN' };
    case 'char':
      if (c.max || c.n === undefined || c.n > 16383) return { sql: c.max ? 'LONGTEXT' : c.n === undefined ? 'VARCHAR(255)' : 'MEDIUMTEXT' };
      return { sql: `${c.fixed && c.n <= 255 ? 'CHAR' : 'VARCHAR'}(${c.n})` };
    case 'text': return { sql: c.size === 'tiny' ? 'TINYTEXT' : c.size === 'medium' ? 'MEDIUMTEXT' : c.size === 'long' || c.unicode ? 'LONGTEXT' : 'TEXT' };
    case 'date': return { sql: 'DATE' };
    case 'time': return { sql: `TIME${p0(c.p !== undefined ? Math.min(6, c.p) : undefined)}` };
    case 'datetime': {
      const p = c.legacy === 'datetime' && c.p === undefined ? 3 : c.p !== undefined ? Math.min(6, c.p) : undefined;
      return c.tz ? { sql: `DATETIME${p0(p)}`, note: bi('MySQL không lưu múi giờ trong DATETIME ⇒ quy ước lưu giờ UTC', 'MySQL DATETIME has no time zone ⇒ store UTC by convention') } : { sql: `DATETIME${p0(p)}` };
    }
    case 'uuid': return { sql: 'CHAR(36)', note: bi('MySQL không có kiểu UUID ⇒ CHAR(36) (hoặc BINARY(16) + UUID_TO_BIN để gọn)', 'MySQL has no UUID type ⇒ CHAR(36) (or BINARY(16) + UUID_TO_BIN to save space)') };
    case 'json': return { sql: 'JSON' };
    case 'binary': return c.max ? { sql: 'LONGBLOB' } : c.fixed ? { sql: `BINARY(${c.n ?? 1})` } : { sql: c.n !== undefined && c.n <= 65535 ? `VARBINARY(${c.n})` : 'LONGBLOB' };
    case 'enum': return { sql: `ENUM(${c.values.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ')})` };
    case 'xml': return { sql: 'LONGTEXT' };
    case 'interval': return { sql: 'BIGINT', note: bi('MySQL không có INTERVAL ⇒ lưu số giây/phút', 'MySQL has no INTERVAL ⇒ store seconds/minutes') };
    case 'year': return { sql: 'YEAR' };
    case 'computed': return { sql: '' };
    case 'other': return { sql: c.raw, note: bi(`Kiểu "${c.raw}" không chuyển tự động được — kiểm tra lại`, `Type "${c.raw}" cannot be converted automatically — review it`) };
  }
}

const SQLITE_DATE = bi('SQLite không có kiểu ngày giờ thật — lưu chuỗi ISO-8601 (YYYY-MM-DD HH:MM:SS)', 'SQLite has no real date type — store ISO-8601 strings (YYYY-MM-DD HH:MM:SS)');

function renderSqlite(c: Canon): TypeOut {
  switch (c.k) {
    case 'int': return { sql: 'INTEGER' };
    case 'decimal': case 'money': return { sql: c.k === 'decimal' && c.p !== undefined ? `NUMERIC(${c.p}${c.s !== undefined ? `,${c.s}` : ''})` : 'NUMERIC', note: bi('SQLite không có số thập phân chính xác (NUMERIC có thể thành số thực) — tiền VND nên lưu INTEGER', 'SQLite has no exact decimals (NUMERIC may become a float) — store money as INTEGER (smallest unit)') };
    case 'float': return { sql: 'REAL' };
    case 'bool': return { sql: 'BOOLEAN', note: bi('SQLite lưu BOOLEAN thành 0/1', 'SQLite stores BOOLEAN as 0/1') };
    case 'char': return { sql: c.max || c.n === undefined ? 'TEXT' : `${c.fixed ? 'CHAR' : 'VARCHAR'}(${c.n})` };
    case 'text': case 'xml': case 'json': case 'uuid': return { sql: 'TEXT' };
    case 'date': return { sql: 'DATE', note: SQLITE_DATE };
    case 'time': return { sql: 'TIME', note: SQLITE_DATE };
    case 'datetime': return { sql: 'DATETIME', note: SQLITE_DATE };
    case 'binary': return { sql: 'BLOB' };
    case 'enum': return { sql: 'TEXT', enumCheck: c.values };
    case 'interval': case 'year': return { sql: 'INTEGER' };
    case 'computed': return { sql: '' };
    case 'other': return { sql: c.raw };
  }
}

/** Kiểu BSON cho $jsonSchema của MongoDB. */
export function bsonType(c: Canon): { bsonType: string; maxLength?: number; enum?: string[]; note?: string } {
  switch (c.k) {
    case 'int': return { bsonType: c.bytes === 8 || (c.unsigned && c.bytes === 4) ? 'long' : 'int' };
    case 'decimal': case 'money': return { bsonType: 'decimal' };
    case 'float': return { bsonType: 'double' };
    case 'bool': return { bsonType: 'bool' };
    case 'char': return { bsonType: 'string', ...(c.n !== undefined && !c.max ? { maxLength: c.n } : {}) };
    case 'text': case 'xml': return { bsonType: 'string' };
    case 'date': case 'datetime': return { bsonType: 'date' };
    case 'time': case 'interval': return { bsonType: 'string' };
    case 'uuid': return { bsonType: 'string', note: 'UUID (or binData subtype 4)' };
    case 'json': return { bsonType: 'object' };
    case 'binary': return { bsonType: 'binData' };
    case 'enum': return { bsonType: 'string', enum: c.values };
    case 'year': return { bsonType: 'int' };
    case 'computed': return { bsonType: 'string', note: 'computed column — calculate in the application or an aggregation' };
    case 'other': return { bsonType: 'string', note: `was ${c.raw}` };
  }
}

/** Nhóm kiểu để hiện trên ERD / kiểm thiết kế. */
export const isTextual = (c: Canon) => c.k === 'char' || c.k === 'text';
export const isFloat = (c: Canon) => c.k === 'float';
export const isIntegral = (c: Canon) => c.k === 'int';

/** Hai kiểu có "khớp" để làm FK không (INT↔INT, BIGINT↔BIGINT; khác độ rộng ⇒ cảnh báo). */
export function typesCompatible(a: Canon, b: Canon): boolean {
  if (a.k !== b.k) return false;
  if (a.k === 'int' && b.k === 'int') return a.bytes === b.bytes;
  if (a.k === 'char' && b.k === 'char') return a.n === b.n && !!a.max === !!b.max && a.unicode === b.unicode;
  if (a.k === 'decimal' && b.k === 'decimal') return a.p === b.p && a.s === b.s;
  return true;
}
