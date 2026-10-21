/**
 * CT Work — MÁY CHỤP / DỰNG LẠI dữ liệu cho thùng rác (22/10/2026).
 *
 * Sự cố gốc: "Nhập Excel → Thay thế" chạy `deleteMany` TOÀN BỘ hàm 5.1 của dự án (xoá CỨNG, cascade xuống dòng/UTCID/dấu
 * O) ⇒ mất cả tối làm việc. Thay vì viết tay "hàm này có những bảng con nào" cho từng loại (quên một bảng là khôi phục
 * thiếu mà không ai biết), máy này ĐỌC CATALOG của Postgres:
 *
 *   chụp   — từ dòng gốc, đi theo MỌI khoá ngoại ON DELETE CASCADE trỏ vào nó (đệ quy) ⇒ đúng tập dòng mà lệnh DELETE sẽ
 *            cuốn theo; khoá ngoại ON DELETE SET NULL ⇒ ghi lại "dòng ngoài nào đang trỏ vào" để nối lại khi khôi phục.
 *            Mỗi dòng lưu nguyên bản `row_to_json` (tên cột DB) ⇒ payload JSONB của work_trash.
 *   dựng   — chèn lại theo thứ tự cha → con bằng `jsonb_populate_recordset` (Postgres tự đổi kiểu: timestamp, jsonb, enum,
 *            mảng, bytea…). GIỮ id gốc nếu còn trống; id đã có người dùng ⇒ cấp id mới từ sequence và sửa mọi khoá ngoại
 *            trong ảnh chụp trỏ tới nó. Khoá ngoại trỏ RA NGOÀI ảnh chụp mà dòng đích đã mất ⇒ cột cho phép NULL thì để
 *            NULL, không thì báo lỗi rõ (không chèn dở — chạy trong transaction của người gọi).
 *
 * Chỉ dùng tên bảng/cột lấy từ catalog hoặc hằng trong mã — KHÔNG BAO GIỜ từ đầu vào người dùng (SQL động an toàn).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

type Db = Prisma.TransactionClient | typeof prisma;
type Row = Record<string, unknown>;

interface Fk { child: string; childCol: string; parent: string; parentCol: string; onDelete: string }
interface Col { name: string; type: string; nullable: boolean; generated: boolean }
interface Catalog {
  byParent: Map<string, Fk[]>;
  byChild: Map<string, Fk[]>;
  pk: Map<string, string[]>;
  cols: Map<string, Col[]>;
  serial: Map<string, string | null>;
}

/** Trần số dòng một ảnh chụp — lớn hơn ⇒ từ chối xoá (không xoá thứ không cất được). */
export const MAX_SNAPSHOT_ROWS = 60_000;

let catalogP: Promise<Catalog> | null = null;

async function loadCatalog(): Promise<Catalog> {
  const fks = await prisma.$queryRawUnsafe<Array<{ child: string; child_col: string; parent: string; parent_col: string; del: string }>>(`
    SELECT cl.relname AS child, ca.attname AS child_col, pcl.relname AS parent, pa.attname AS parent_col, con.confdeltype::text AS del
    FROM pg_constraint con
    JOIN pg_class cl ON cl.oid = con.conrelid
    JOIN pg_class pcl ON pcl.oid = con.confrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    JOIN pg_attribute ca ON ca.attrelid = con.conrelid AND ca.attnum = con.conkey[1]
    JOIN pg_attribute pa ON pa.attrelid = con.confrelid AND pa.attnum = con.confkey[1]
    WHERE con.contype = 'f' AND n.nspname = current_schema() AND array_length(con.conkey, 1) = 1`);
  const pks = await prisma.$queryRawUnsafe<Array<{ tbl: string; cols: string[] }>>(`
    SELECT cl.relname AS tbl, array_agg(a.attname::text ORDER BY array_position(i.indkey::int2[], a.attnum)) AS cols
    FROM pg_index i
    JOIN pg_class cl ON cl.oid = i.indrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indisprimary AND n.nspname = current_schema()
    GROUP BY cl.relname`);
  const cols = await prisma.$queryRawUnsafe<Array<{ tbl: string; name: string; type: string; nullable: boolean; generated: boolean }>>(`
    SELECT cl.relname AS tbl, a.attname AS name, format_type(a.atttypid, NULL) AS type, NOT a.attnotnull AS nullable, a.attgenerated <> '' AS generated
    FROM pg_attribute a
    JOIN pg_class cl ON cl.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    WHERE cl.relkind = 'r' AND n.nspname = current_schema() AND a.attnum > 0 AND NOT a.attisdropped`);
  const c: Catalog = { byParent: new Map(), byChild: new Map(), pk: new Map(), cols: new Map(), serial: new Map() };
  for (const f of fks) {
    const fk: Fk = { child: f.child, childCol: f.child_col, parent: f.parent, parentCol: f.parent_col, onDelete: f.del };
    (c.byParent.get(fk.parent) ?? c.byParent.set(fk.parent, []).get(fk.parent)!).push(fk);
    (c.byChild.get(fk.child) ?? c.byChild.set(fk.child, []).get(fk.child)!).push(fk);
  }
  for (const p of pks) c.pk.set(p.tbl, p.cols);
  for (const x of cols) (c.cols.get(x.tbl) ?? c.cols.set(x.tbl, []).get(x.tbl)!).push({ name: x.name, type: x.type, nullable: x.nullable, generated: x.generated });
  return c;
}

/** Catalog đọc một lần mỗi tiến trình (schema chỉ đổi khi deploy ⇒ tiến trình mới). Lỗi ⇒ lần sau đọc lại. */
export function catalog(): Promise<Catalog> {
  if (!catalogP) catalogP = loadCatalog().catch((e) => { catalogP = null; throw e; });
  return catalogP;
}

const q = (ident: string) => `"${ident.replace(/"/g, '""')}"`;

function colOf(c: Catalog, table: string, col: string): Col {
  const x = c.cols.get(table)?.find((k) => k.name === col);
  if (!x) throw new Error(`dataTrash: ${table}.${col} không có trong catalog`);
  return x;
}

function pkKey(c: Catalog, table: string, row: Row): string {
  const pk = c.pk.get(table);
  if (!pk?.length) return JSON.stringify(row);
  return pk.map((k) => String(row[k])).join('|');
}

async function selectWhereIn(db: Db, c: Catalog, table: string, col: string, values: unknown[]): Promise<Row[]> {
  if (!values.length) return [];
  const t = colOf(c, table, col).type;
  const out: Row[] = [];
  for (let i = 0; i < values.length; i += 5000) {
    const chunk = values.slice(i, i + 5000);
    const rows = await db.$queryRawUnsafe<Array<{ r: Row }>>(
      `SELECT row_to_json(t)::jsonb AS r FROM ${q(table)} t WHERE t.${q(col)} = ANY($1::${t}[])`,
      chunk.map((v) => (typeof v === 'bigint' ? v.toString() : v)),
    );
    for (const x of rows) out.push(x.r);
  }
  return out;
}

// ─── Ảnh chụp ────────────────────────────────────────────────────

export interface Relink { table: string; column: string; pk: Row; value: unknown }
export interface GraphSnapshot {
  v: 1;
  /** Bảng của dòng gốc (để biết "cái gì đã bị xoá"). */
  roots: Array<{ table: string; ids: unknown[] }>;
  /** Dòng nguyên bản theo bảng (tên cột DB). */
  rows: Record<string, Row[]>;
  /** Thứ tự chèn: cha trước con. */
  order: string[];
  /** Dòng NGOÀI ảnh chụp có cột bị SET NULL khi xoá ⇒ nối lại khi khôi phục. */
  relinks: Relink[];
}

/**
 * Chụp dòng gốc `table.id ∈ ids` + mọi dòng mà DELETE sẽ cuốn theo (CASCADE, đệ quy) + liên kết SET NULL.
 * Gọi TRONG transaction của lệnh xoá, NGAY TRƯỚC khi xoá.
 */
export async function snapshotGraph(db: Db, roots: Array<{ table: string; ids: unknown[]; col?: string }>): Promise<GraphSnapshot> {
  const c = await catalog();
  const rows = new Map<string, Map<string, Row>>();
  const relinks: Relink[] = [];
  let total = 0;
  const add = (table: string, list: Row[]): Row[] => {
    const m = rows.get(table) ?? rows.set(table, new Map()).get(table)!;
    const fresh: Row[] = [];
    for (const r of list) {
      const k = pkKey(c, table, r);
      if (m.has(k)) continue;
      m.set(k, r);
      fresh.push(r);
    }
    total += fresh.length;
    if (total > MAX_SNAPSHOT_ROWS) {
      throw new AppError('This is too much data to keep in the trash in one go. Delete it in smaller parts.', 413, 'WORK_TRASH_TOO_LARGE');
    }
    return fresh;
  };
  const queue: Array<{ table: string; rows: Row[] }> = [];
  for (const r of roots) {
    const got = await selectWhereIn(db, c, r.table, r.col ?? 'id', r.ids);
    queue.push({ table: r.table, rows: add(r.table, got) });
  }
  while (queue.length) {
    const { table, rows: fresh } = queue.shift()!;
    if (!fresh.length) continue;
    for (const fk of c.byParent.get(table) ?? []) {
      const vals = [...new Set(fresh.map((r) => r[fk.parentCol]).filter((v) => v !== null && v !== undefined))];
      if (!vals.length) continue;
      if (fk.onDelete === 'c') {
        const kids = await selectWhereIn(db, c, fk.child, fk.childCol, vals);
        queue.push({ table: fk.child, rows: add(fk.child, kids) });
      } else if (fk.onDelete === 'n') {
        const refs = await selectWhereIn(db, c, fk.child, fk.childCol, vals);
        const pk = c.pk.get(fk.child) ?? [];
        if (!pk.length) continue;
        for (const r of refs) relinks.push({ table: fk.child, column: fk.childCol, pk: Object.fromEntries(pk.map((k) => [k, r[k]])), value: r[fk.childCol] });
      }
    }
  }
  const out: Record<string, Row[]> = {};
  for (const [t, m] of rows) if (m.size) out[t] = [...m.values()];
  // Dòng trong ảnh chụp tự mang giá trị cột của nó ⇒ không cần nối lại.
  const inGraph = (t: string, pk: Row) => !!rows.get(t)?.has((c.pk.get(t) ?? []).map((k) => String(pk[k])).join('|'));
  return {
    v: 1,
    roots: roots.map((r) => ({ table: r.table, ids: r.ids })),
    rows: out,
    order: insertOrder(c, Object.keys(out)),
    relinks: relinks.filter((l) => !inGraph(l.table, l.pk)),
  };
}

/** Sắp bảng cha trước con (chỉ xét khoá ngoại giữa các bảng trong ảnh chụp; bỏ tự trỏ). */
function insertOrder(c: Catalog, tables: string[]): string[] {
  const set = new Set(tables);
  const deps = new Map<string, Set<string>>(tables.map((t) => [t, new Set<string>()]));
  for (const t of tables) for (const fk of c.byChild.get(t) ?? []) if (set.has(fk.parent) && fk.parent !== t) deps.get(t)!.add(fk.parent);
  const out: string[] = [];
  const seen = new Set<string>();
  const visit = (t: string, stack: Set<string>) => {
    if (seen.has(t)) return;
    if (stack.has(t)) return; // vòng (hiếm) — thứ tự còn lại do Postgres báo nếu sai
    stack.add(t);
    for (const p of deps.get(t) ?? []) visit(p, stack);
    stack.delete(t);
    seen.add(t);
    out.push(t);
  };
  for (const t of tables) visit(t, new Set());
  return out;
}

export function snapshotCount(s: GraphSnapshot, table?: string): number {
  if (table) return s.rows[table]?.length ?? 0;
  return Object.values(s.rows).reduce((n, r) => n + r.length, 0);
}

// ─── Dựng lại ────────────────────────────────────────────────────

export interface RestoreOptions {
  /** Sửa dòng trước khi chèn (vd đổi tên khi trùng). Trả về chuỗi mô tả nếu đã đổi gì. */
  mutate?: (table: string, row: Row, db: Db) => Promise<string | null | void>;
}
export interface RestoreResult {
  /** id cũ ⇒ id mới, theo bảng (chỉ những dòng phải đổi id). */
  remapped: Record<string, Array<[unknown, unknown]>>;
  rows: number;
  notes: string[];
}

export async function restoreGraph(db: Db, snap: GraphSnapshot, opts: RestoreOptions = {}): Promise<RestoreResult> {
  if (!snap || snap.v !== 1) throw new AppError('This trash item cannot be restored (unknown format)', 400, 'WORK_TRASH_BAD_PAYLOAD');
  const c = await catalog();
  const idMap = new Map<string, Map<string, unknown>>(); // bảng ⇒ (id cũ dạng chuỗi ⇒ id mới)
  const notes: string[] = [];
  let count = 0;
  const graphIds = new Map<string, Set<string>>();
  for (const [t, list] of Object.entries(snap.rows)) {
    const pk = c.pk.get(t);
    if (pk?.length === 1) graphIds.set(t, new Set(list.map((r) => String(r[pk[0]]))));
  }

  for (const table of snap.order) {
    let list = (snap.rows[table] ?? []).map((r) => ({ ...r }));
    if (!list.length) continue;
    if (!c.cols.has(table)) throw new AppError(`Cannot restore: table ${table} no longer exists`, 409, 'WORK_TRASH_SCHEMA_CHANGED');
    const pk = c.pk.get(table) ?? [];
    const single = pk.length === 1 ? pk[0] : null;

    // 1) Khoá ngoại trong ảnh chụp trỏ tới dòng đã đổi id ⇒ đổi theo.
    for (const fk of c.byChild.get(table) ?? []) {
      const m = idMap.get(fk.parent);
      if (!m?.size) continue;
      for (const r of list) {
        const v = r[fk.childCol];
        if (v !== null && v !== undefined && m.has(String(v))) r[fk.childCol] = m.get(String(v));
      }
    }

    // 2) Khoá ngoại trỏ RA NGOÀI ảnh chụp: dòng đích còn không?
    for (const fk of c.byChild.get(table) ?? []) {
      const inSnap = graphIds.get(fk.parent);
      const remapped = idMap.get(fk.parent);
      const outside = [...new Set(list.map((r) => r[fk.childCol]).filter((v) => v !== null && v !== undefined && !(inSnap?.has(String(v)) && fk.parentCol === (c.pk.get(fk.parent) ?? [])[0]) && !(remapped && [...remapped.values()].some((x) => String(x) === String(v)))))];
      if (!outside.length) continue;
      const alive = new Set((await selectWhereIn(db, c, fk.parent, fk.parentCol, outside)).map((r) => String(r[fk.parentCol])));
      const dead = outside.filter((v) => !alive.has(String(v)));
      if (!dead.length) continue;
      const col = colOf(c, table, fk.childCol);
      if (!col.nullable) {
        throw new AppError(`Cannot restore: it points to ${fk.parent} #${String(dead[0])}, which no longer exists. Restore that first.`, 409, 'WORK_TRASH_MISSING_PARENT', { table: fk.parent, id: dead[0] });
      }
      for (const r of list) if (dead.some((d) => String(d) === String(r[fk.childCol]))) r[fk.childCol] = null;
    }

    // 3) Dòng tự trỏ (cha/con cùng bảng): cha chèn trước.
    const self = (c.byChild.get(table) ?? []).find((fk) => fk.parent === table && single && fk.parentCol === single);
    if (self && single) list = sortSelf(list, single, self.childCol);

    // 4) Id còn trống không? Đã có ⇒ cấp id mới (chỉ khoá chính MỘT cột kiểu số có sequence).
    if (single) {
      const taken = new Set((await selectWhereIn(db, c, table, single, list.map((r) => r[single]))).map((r) => String(r[single])));
      if (taken.size) {
        const seq = await serialOf(db, c, table, single);
        if (!seq) throw new AppError(`Cannot restore: ${table} already has the same record`, 409, 'WORK_TRASH_CONFLICT');
        const m = idMap.get(table) ?? idMap.set(table, new Map()).get(table)!;
        for (const r of list) {
          if (!taken.has(String(r[single]))) continue;
          const [{ id }] = await db.$queryRawUnsafe<Array<{ id: number }>>(`SELECT nextval($1::regclass)::int AS id`, seq);
          m.set(String(r[single]), id);
          r[single] = id;
        }
        // Dòng tự trỏ trong cùng bảng: cập nhật theo id mới.
        if (self) for (const r of list) { const v = r[self.childCol]; if (v !== null && v !== undefined && m.has(String(v))) r[self.childCol] = m.get(String(v)); }
      }
    }

    // 5) Người gọi sửa thêm (đổi tên khi trùng…).
    if (opts.mutate) for (const r of list) { const n = await opts.mutate(table, r, db); if (n) notes.push(n); }

    // 6) Chèn theo lô. Chỉ cột có trong ảnh chụp VÀ còn trong bảng (cột mới sau này ⇒ giá trị mặc định).
    const cols = (c.cols.get(table) ?? []).filter((k) => !k.generated && list.some((r) => k.name in r)).map((k) => k.name);
    if (!cols.length) continue;
    const colSql = cols.map(q).join(', ');
    for (let i = 0; i < list.length; i += 500) {
      const chunk = list.slice(i, i + 500);
      await db.$executeRawUnsafe(
        `INSERT INTO ${q(table)} (${colSql}) SELECT ${colSql} FROM jsonb_populate_recordset(NULL::${q(table)}, $1::jsonb)`,
        JSON.stringify(chunk),
      );
    }
    count += list.length;
  }

  // 7) Nối lại dòng ngoài từng bị SET NULL (chỉ khi cột vẫn đang NULL — không ghi đè thứ người khác đã đặt sau đó).
  for (const l of snap.relinks ?? []) {
    if (!c.cols.has(l.table)) continue;
    const parentFk = (c.byChild.get(l.table) ?? []).find((fk) => fk.childCol === l.column);
    const m = parentFk ? idMap.get(parentFk.parent) : undefined;
    const value = m?.get(String(l.value)) ?? l.value;
    const keys = Object.keys(l.pk);
    if (!keys.length) continue;
    const where = keys.map((k, i) => `${q(k)}::text = $${i + 2}`).join(' AND ');
    await db.$executeRawUnsafe(
      `UPDATE ${q(l.table)} SET ${q(l.column)} = $1::${colOf(c, l.table, l.column).type} WHERE ${where} AND ${q(l.column)} IS NULL`,
      value, ...keys.map((k) => String(l.pk[k])),
    ).catch(() => undefined); // dòng ngoài đã mất / đổi ⇒ bỏ qua (không chặn khôi phục)
  }

  const remapped: Record<string, Array<[unknown, unknown]>> = {};
  for (const [t, m] of idMap) remapped[t] = [...m.entries()];
  return { remapped, rows: count, notes };
}

function sortSelf(list: Row[], pk: string, col: string): Row[] {
  const ids = new Set(list.map((r) => String(r[pk])));
  const done = new Set<string>();
  const out: Row[] = [];
  let rest = list;
  for (let guard = 0; rest.length && guard < 1000; guard++) {
    const next: Row[] = [];
    for (const r of rest) {
      const p = r[col];
      if (p === null || p === undefined || !ids.has(String(p)) || done.has(String(p))) { out.push(r); done.add(String(r[pk])); } else next.push(r);
    }
    if (next.length === rest.length) { out.push(...next); break; }
    rest = next;
  }
  return out;
}

async function serialOf(db: Db, c: Catalog, table: string, col: string): Promise<string | null> {
  const k = `${table}.${col}`;
  if (c.serial.has(k)) return c.serial.get(k) ?? null;
  const [r] = await db.$queryRawUnsafe<Array<{ s: string | null }>>(`SELECT pg_get_serial_sequence($1, $2) AS s`, q(table), col);
  c.serial.set(k, r?.s ?? null);
  return r?.s ?? null;
}

// ─── Xoá mềm (bảng có deleted_at) ────────────────────────────────

/** Bảng xoá MỀM được thùng rác quản lý (khôi phục = đặt lại deleted_at NULL). */
export const SOFT_TABLES = ['work_meetings', 'work_raid_items', 'work_diagrams', 'work_change_requests', 'work_review_sessions'] as const;
export type SoftTable = (typeof SOFT_TABLES)[number];
export const isSoftTable = (t: string): t is SoftTable => (SOFT_TABLES as readonly string[]).includes(t);

export async function restoreSoft(db: Db, table: SoftTable, id: number): Promise<boolean> {
  const n = await db.$executeRawUnsafe(`UPDATE ${q(table)} SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL`, id);
  return n > 0;
}

export async function purgeSoft(db: Db, table: SoftTable, id: number): Promise<boolean> {
  const n = await db.$executeRawUnsafe(`DELETE FROM ${q(table)} WHERE id = $1 AND deleted_at IS NOT NULL`, id);
  return n > 0;
}

/** CHỈ cho test: đọc lại catalog (sau khi test tự tạo bảng). */
export function _resetCatalogForTests(): void { catalogP = null; }
