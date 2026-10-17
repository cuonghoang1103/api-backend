/**
 * CT Work — Database designer (17/10/2026): MÔ HÌNH CSDL dùng chung cho bộ đọc SQL, bộ sinh script, bộ kiểm thiết kế và
 * ERD. THUẦN (không DB, không DOM) — nguồn duy nhất ở src/services/work/sqlDesign/, frontend dùng BẢN CHÉP ở
 * frontend/src/lib/sqlDesign/ (scripts/dong-bo-sql-design.mjs). Sửa ở đây rồi chạy script, đừng sửa bản chép.
 */

/** Hệ quản trị đọc vào (nguồn sơ đồ). */
export const SOURCE_DIALECTS = ['sqlserver', 'postgres', 'mysql', 'sqlite'] as const;
export type Dialect = (typeof SOURCE_DIALECTS)[number];

/** Đích xuất. */
export const EXPORT_TARGETS = ['sqlserver', 'postgres', 'mysql', 'sqlite', 'mongodb', 'mermaid', 'dbml', 'json'] as const;
export type ExportTarget = (typeof EXPORT_TARGETS)[number];

export const DIALECT_LABEL: Record<ExportTarget, string> = {
  sqlserver: 'SQL Server', postgres: 'PostgreSQL', mysql: 'MySQL 8', sqlite: 'SQLite', mongodb: 'MongoDB', mermaid: 'Mermaid ERD', dbml: 'DBML (dbdiagram.io)', json: 'JSON model',
};

/** Vị trí trong mã nguồn (offset tính theo ký tự UTF-16, dòng/cột từ 1). */
export interface Span { start: number; end: number; line: number; col: number; endLine: number; endCol: number }

/** Một token của biểu thức (DEFAULT / CHECK / WHERE) — giữ lại để dịch sang hệ khác. */
export interface ExprTok { t: TokKind; v: string; raw: string; prefix?: string }
export type TokKind = 'word' | 'qident' | 'string' | 'number' | 'op' | 'var' | 'blob';
export interface Expr { text: string; toks: ExprTok[] }

export interface DataType {
  /** Tên chuẩn hoá chữ HOA, gộp khoảng trắng: "NVARCHAR", "DOUBLE PRECISION", "TIMESTAMP WITH TIME ZONE". */
  name: string;
  /** Tham số: số, 'MAX', hoặc chuỗi (ENUM/SET của MySQL). */
  args: Array<number | string>;
  unsigned?: boolean;
  array?: boolean;
  /** Đúng như viết trong nguồn (để hiện trên ERD). */
  raw: string;
}

export interface Identity { start: number; increment: number; mode: 'identity' | 'serial' | 'auto_increment' | 'autoincrement' | 'always' | 'by_default' | 'sequence' | 'rowid' }

export interface Column {
  name: string;
  type: DataType;
  /** true ⇒ cho NULL. Không ghi gì ⇒ cho NULL (trừ khi là khoá chính / IDENTITY). */
  nullable: boolean;
  /** Người viết ghi rõ NULL / NOT NULL. */
  nullExplicit: boolean;
  default?: Expr;
  defaultName?: string;
  identity?: Identity;
  /** Cột tính toán (T-SQL `AS expr`, `GENERATED ALWAYS AS (expr)`). */
  computed?: { expr: Expr; stored: boolean };
  collate?: string;
  comment?: string;
  span: Span;
  nameSpan: Span;
}

export interface KeyRef { name?: string; columns: string[]; span?: Span; clustered?: boolean }
export type RefAction = 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
export interface ForeignKey { name?: string; columns: string[]; refTable: string; refSchema?: string; refColumns: string[]; onDelete?: RefAction; onUpdate?: RefAction; span?: Span; inline?: boolean }
export interface Check { name?: string; expr: Expr; column?: string; span?: Span }
export interface IndexCol { name: string; desc?: boolean; length?: number; expr?: Expr }
export interface Index { name?: string; table: string; columns: IndexCol[]; unique: boolean; where?: Expr; include?: string[]; method?: string; clustered?: boolean; span?: Span }

export interface Table {
  name: string;
  schema?: string;
  columns: Column[];
  primaryKey?: KeyRef;
  uniques: KeyRef[];
  foreignKeys: ForeignKey[];
  checks: Check[];
  indexes: Index[];
  comment?: string;
  /** Cả câu CREATE TABLE (để nhảy tới / tô sáng trong trình soạn). */
  span: Span;
  nameSpan: Span;
  /** Đọc dở (đang gõ): có lỗi giữa chừng — cột đọc được tới chỗ lỗi. */
  incomplete?: boolean;
}

export interface EnumType { name: string; values: string[]; span?: Span }

export type Severity = 'error' | 'warning' | 'info';
export interface Bi { vi: string; en: string }
export interface Problem {
  code: string;
  severity: Severity;
  message: Bi;
  /** Vì sao đây là vấn đề (bộ kiểm thiết kế — để học). */
  why?: Bi;
  /** Sửa thế nào. */
  fix?: Bi;
  span?: Span;
  table?: string;
  column?: string;
  /** Lỗi tách từ (chuỗi/chú thích chưa đóng) — trình soạn giữ bản vẽ tốt gần nhất. */
  fatal?: boolean;
}

export interface DbModel {
  dialect: Dialect;
  tables: Table[];
  enums: EnumType[];
  /** Tên CSDL đọc được từ CREATE DATABASE / USE (gợi ý cho bản xuất). */
  database?: string;
}

export interface ParseResult {
  model: DbModel;
  /** Hệ quản trị dùng để đọc (người chọn, hoặc dò từ cú pháp). */
  dialect: Dialect;
  detected: Dialect | null;
  errors: Problem[];
  warnings: Problem[];
  /** Số câu không phải thiết kế bảng đã bỏ qua (INSERT, SELECT, SET, USE…). */
  skipped: Record<string, number>;
}

export type Cardinality = 'one' | 'zeroOrOne' | 'many' | 'oneOrMany';
export interface Relationship {
  id: string;
  child: string; childColumns: string[];
  parent: string; parentColumns: string[];
  /** Phía cha: 'one' khi cột FK NOT NULL, 'zeroOrOne' khi cho NULL. */
  parentCard: 'one' | 'zeroOrOne';
  /** Phía con: 'zeroOrOne' khi cột FK cũng là PK/UNIQUE (1–1), không thì 'many'. */
  childCard: 'zeroOrOne' | 'many';
  /** Cột FK nằm trong khoá chính của bảng con (quan hệ xác định — vẽ nét liền). */
  identifying: boolean;
  name?: string;
  self: boolean;
}

export const bi = (vi: string, en: string): Bi => ({ vi, en });

/** So khớp tên không phân biệt hoa/thường (SQL Server CI, PostgreSQL gấp chữ thường). */
export const sameName = (a: string | undefined, b: string | undefined) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

export function findTable(model: DbModel, name: string): Table | undefined {
  const n = name.toLowerCase();
  return model.tables.find((t) => t.name.toLowerCase() === n);
}

export function findColumn(t: Table | undefined, name: string): Column | undefined {
  if (!t) return undefined;
  const n = name.toLowerCase();
  return t.columns.find((c) => c.name.toLowerCase() === n);
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.some((y) => sameName(x, y)));

/** Bộ cột này có phải khoá ứng viên (PK / UNIQUE / UNIQUE INDEX không lọc) của bảng không. */
export function isCandidateKey(t: Table, cols: string[]): boolean {
  if (t.primaryKey && sameSet(t.primaryKey.columns, cols)) return true;
  if (t.uniques.some((u) => sameSet(u.columns, cols))) return true;
  return t.indexes.some((i) => i.unique && !i.where && i.columns.every((c) => !c.expr) && sameSet(i.columns.map((c) => c.name), cols));
}

/** Cột FK trỏ về đâu: refColumns rỗng ⇒ khoá chính của bảng cha. */
export function resolvedRefColumns(model: DbModel, fk: ForeignKey): string[] {
  if (fk.refColumns.length) return fk.refColumns;
  return findTable(model, fk.refTable)?.primaryKey?.columns ?? [];
}

export function relationships(model: DbModel): Relationship[] {
  const out: Relationship[] = [];
  for (const t of model.tables) {
    t.foreignKeys.forEach((fk, i) => {
      const cols = fk.columns.map((c) => findColumn(t, c));
      const allNotNull = cols.length > 0 && cols.every((c) => c && !c.nullable);
      const parent = findTable(model, fk.refTable);
      out.push({
        id: `${t.name}.${fk.name ?? i}`,
        child: t.name, childColumns: fk.columns,
        parent: parent?.name ?? fk.refTable, parentColumns: resolvedRefColumns(model, fk),
        parentCard: allNotNull ? 'one' : 'zeroOrOne',
        childCard: isCandidateKey(t, fk.columns) ? 'zeroOrOne' : 'many',
        identifying: !!t.primaryKey && fk.columns.every((c) => t.primaryKey!.columns.some((p) => sameName(p, c))),
        name: fk.name, self: sameName(t.name, fk.refTable),
      });
    });
  }
  return out;
}

/** Thứ tự tạo bảng: cha trước con (Kahn). Vòng tham chiếu ⇒ `deferred` = FK phải thêm SAU bằng ALTER TABLE. */
export function creationOrder(model: DbModel): { order: Table[]; deferred: Array<{ table: Table; fk: ForeignKey }> } {
  const tables = model.tables;
  const idx = new Map(tables.map((t, i) => [t.name.toLowerCase(), i]));
  const placed = new Set<number>();
  const order: Table[] = [];
  const deferred: Array<{ table: Table; fk: ForeignKey }> = [];
  const parentsOf = (t: Table) => t.foreignKeys.map((f) => idx.get(f.refTable.toLowerCase())).filter((x): x is number => x !== undefined && tables[x] !== t);
  while (placed.size < tables.length) {
    let progressed = false;
    for (let i = 0; i < tables.length; i++) {
      if (placed.has(i)) continue;
      if (parentsOf(tables[i]).every((p) => placed.has(p))) { placed.add(i); order.push(tables[i]); progressed = true; }
    }
    if (!progressed) {
      // Vòng: lấy bảng (theo thứ tự viết) có ít cha chưa đặt nhất, hoãn các FK của nó tới bảng chưa có.
      let best = -1; let bestMissing = Infinity;
      for (let i = 0; i < tables.length; i++) {
        if (placed.has(i)) continue;
        const missing = parentsOf(tables[i]).filter((p) => !placed.has(p)).length;
        if (missing < bestMissing) { best = i; bestMissing = missing; }
      }
      const t = tables[best];
      for (const fk of t.foreignKeys) {
        const p = idx.get(fk.refTable.toLowerCase());
        if (p !== undefined && tables[p] !== t && !placed.has(p)) deferred.push({ table: t, fk });
      }
      placed.add(best); order.push(t);
    }
  }
  return { order, deferred };
}

/** Mô hình gọn để xuất JSON / gửi agent — bỏ vị trí trong nguồn. */
export function plainModel(model: DbModel) {
  const ex = (e?: Expr) => (e ? e.text : undefined);
  return {
    format: 'ctw-db-model', version: 1, dialect: model.dialect, database: model.database,
    enums: model.enums.map((e) => ({ name: e.name, values: e.values })),
    tables: model.tables.map((t) => ({
      name: t.name, schema: t.schema, comment: t.comment,
      columns: t.columns.map((c) => ({
        name: c.name, type: c.type.raw, nullable: c.nullable, default: ex(c.default),
        identity: c.identity ? { start: c.identity.start, increment: c.identity.increment } : undefined,
        computed: c.computed ? { expr: c.computed.expr.text, stored: c.computed.stored } : undefined, comment: c.comment,
      })),
      primaryKey: t.primaryKey ? { name: t.primaryKey.name, columns: t.primaryKey.columns } : undefined,
      uniques: t.uniques.map((u) => ({ name: u.name, columns: u.columns })),
      foreignKeys: t.foreignKeys.map((f) => ({ name: f.name, columns: f.columns, references: { table: f.refTable, columns: f.refColumns }, onDelete: f.onDelete, onUpdate: f.onUpdate })),
      checks: t.checks.map((c) => ({ name: c.name, expr: c.expr.text })),
      indexes: t.indexes.map((i) => ({ name: i.name, unique: i.unique, columns: i.columns.map((c) => (c.expr ? `(${c.expr.text})` : c.desc ? `${c.name} DESC` : c.name)), where: ex(i.where), include: i.include })),
    })),
    relationships: relationships(model).map((r) => ({ from: `${r.child}(${r.childColumns.join(', ')})`, to: `${r.parent}(${r.parentColumns.join(', ')})`, cardinality: `${r.parentCard === 'one' ? '1' : '0..1'} : ${r.childCard === 'many' ? '0..*' : '0..1'}`, name: r.name })),
  };
}
