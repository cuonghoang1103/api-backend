/**
 * Database designer — Mermaid erDiagram ⇒ mô hình CSDL (rồi sinh SQL bằng generateSql). Dùng cho nút "Chuyển thành thiết
 * kế SQL" trên các ERD vẽ bằng Mermaid (AI vẽ, mẫu, nhập draw.io…).
 *
 *   - Thực thể ⇒ bảng; thuộc tính `kiểu tên PK|FK|UK "chú thích"` ⇒ cột (kiểu chung chung string/int/datetime… ⇒ kiểu thật
 *     của hệ đích; kiểu đã là SQL thì giữ).
 *   - Quan hệ `A ||--o{ B` ⇒ khoá ngoại ở phía "nhiều" (B) trỏ về khoá chính của A; tìm cột FK có sẵn hợp tên, không có thì
 *     THÊM cột (ghi chú rõ). 1–1 ⇒ khoá ngoại ở bên phải + UNIQUE. Nhiều–nhiều ⇒ tạo BẢNG NỐI.
 */

import { bi, findColumn, findTable, type Bi, type Column, type DataType, type DbModel, type Dialect, type Span, type Table } from './model.js';

const NOSPAN: Span = { start: 0, end: 0, line: 1, col: 1, endLine: 1, endCol: 1 };

function sqlType(raw: string, d: Dialect): DataType {
  const t = raw.trim();
  const u = t.toUpperCase().replace(/_/g, ' ');
  const mk = (name: string, args: Array<number | string> = []): DataType => ({ name, args, raw: args.length ? `${name}(${args.join(',')})` : name });
  const uni = d === 'sqlserver';
  switch (u) {
    case 'STRING': case 'STR': case 'VARCHAR': case 'NAME': return mk(uni ? 'NVARCHAR' : 'VARCHAR', [255]);
    case 'TEXT': case 'LONGTEXT': return d === 'sqlserver' ? mk('NVARCHAR', ['MAX']) : mk('TEXT');
    case 'INT': case 'INTEGER': case 'NUMBER INT': return mk(d === 'postgres' || d === 'sqlite' ? 'INTEGER' : 'INT');
    case 'BIGINT': case 'LONG': return mk(d === 'sqlite' ? 'INTEGER' : 'BIGINT');
    case 'FLOAT': case 'DOUBLE': return mk(d === 'postgres' ? 'DOUBLE PRECISION' : d === 'sqlite' ? 'REAL' : d === 'mysql' ? 'DOUBLE' : 'FLOAT');
    case 'DECIMAL': case 'NUMBER': case 'NUMERIC': case 'MONEY': case 'CURRENCY': return mk(d === 'postgres' ? 'NUMERIC' : 'DECIMAL', [12, 2]);
    case 'BOOL': case 'BOOLEAN': case 'BIT': return mk(d === 'sqlserver' ? 'BIT' : 'BOOLEAN');
    case 'DATE': return mk('DATE');
    case 'TIME': return mk('TIME');
    case 'DATETIME': case 'TIMESTAMP': case 'INSTANT': return d === 'sqlserver' ? mk('DATETIME2', [0]) : d === 'mysql' ? mk('DATETIME') : d === 'sqlite' ? mk('DATETIME') : mk('TIMESTAMP');
    case 'UUID': case 'GUID': return mk(d === 'sqlserver' ? 'UNIQUEIDENTIFIER' : d === 'postgres' ? 'UUID' : d === 'mysql' ? 'CHAR' : 'TEXT', d === 'mysql' ? [36] : []);
    case 'JSON': case 'OBJECT': return d === 'postgres' ? mk('JSONB') : d === 'sqlserver' ? mk('NVARCHAR', ['MAX']) : mk(d === 'mysql' ? 'JSON' : 'TEXT');
    case 'ENUM': return mk('VARCHAR', [30]);
    default: {
      // Đã là kiểu SQL: VARCHAR(100), decimal(12,0), nvarchar(max)…
      const m = /^([A-Za-z][A-Za-z0-9 ]*?)\s*(?:\(([^)]*)\))?$/.exec(t.replace(/-/g, ','));
      if (m) {
        const args = (m[2] ?? '').split(',').map((x) => x.trim()).filter(Boolean).map((x) => (/^\d+$/.test(x) ? Number(x) : x.toUpperCase()));
        return mk(m[1].toUpperCase(), args);
      }
      return mk(uni ? 'NVARCHAR' : 'VARCHAR', [255]);
    }
  }
}

const lc1 = (s: string) => (/^[A-Z0-9_]+$/.test(s) ? s.toLowerCase() : s.charAt(0).toLowerCase() + s.slice(1));
const pascal = (s: string) => s.toLowerCase().split(/[_\s-]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');

export interface MermaidErdResult { model: DbModel; notes: Bi[] }

export function mermaidErdToModel(src: string, dialect: Dialect = 'sqlserver', opts: { pascalTables?: boolean } = {}): MermaidErdResult {
  const notes: Bi[] = [];
  const tables: Table[] = [];
  const name = (raw: string) => (opts.pascalTables && /^[A-Z0-9_]+$/.test(raw) ? pascal(raw) : raw);
  const ensure = (raw: string): Table => {
    const n = name(raw);
    let t = tables.find((x) => x.name.toLowerCase() === n.toLowerCase());
    if (!t) { t = { name: n, columns: [], uniques: [], foreignKeys: [], checks: [], indexes: [], span: NOSPAN, nameSpan: NOSPAN }; tables.push(t); }
    return t;
  };
  const rels: Array<{ a: string; b: string; left: string; right: string; label: string }> = [];
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.trim());
  let cur: Table | null = null;
  const fkMarked = new Map<Table, Set<string>>();
  for (const l of lines) {
    if (!l || l.startsWith('%%') || /^erDiagram\b/.test(l) || /^(title|direction|accTitle|accDescr|style|classDef|class)\b/.test(l)) continue;
    if (cur) {
      if (l === '}') { cur = null; continue; }
      const m = /^([^\s]+)\s+([^\s"]+)(?:\s+((?:PK|FK|UK)(?:\s*,\s*(?:PK|FK|UK))*))?(?:\s+"([^"]*)")?$/.exec(l);
      if (!m) continue;
      const keys = (m[3] ?? '').split(',').map((x) => x.trim()).filter(Boolean);
      const col: Column = { name: m[2], type: sqlType(m[1], dialect), nullable: !keys.includes('PK'), nullExplicit: false, span: NOSPAN, nameSpan: NOSPAN, ...(m[4] ? { comment: m[4] } : {}) };
      if (/^NULL\b/i.test(m[4] ?? '')) col.nullable = true;
      cur.columns.push(col);
      if (keys.includes('PK')) cur.primaryKey = { columns: [...(cur.primaryKey?.columns ?? []), col.name] };
      if (keys.includes('UK')) cur.uniques.push({ name: `UQ_${cur.name}_${col.name}`, columns: [col.name] });
      if (keys.includes('FK')) { const s = fkMarked.get(cur) ?? new Set<string>(); s.add(col.name.toLowerCase()); fkMarked.set(cur, s); }
      continue;
    }
    const ent = /^([\w-]+)(?:\["[^"]*"\])?\s*\{\s*(\})?$/.exec(l);
    if (ent) { const t = ensure(ent[1]); cur = ent[2] ? null : t; continue; }
    const rel = /^([\w-]+)\s+(\|o|\|\||\}o|\}\|)(?:--|\.\.)(o\||\|\||o\{|\|\{)\s+([\w-]+)\s*:\s*"?([^"]*)"?$/.exec(l);
    if (rel) { ensure(rel[1]); ensure(rel[4]); rels.push({ a: rel[1], left: rel[2], right: rel[3], b: rel[4], label: rel[5].trim() }); continue; }
    const bare = /^([\w-]+)$/.exec(l);
    if (bare) ensure(bare[1]);
  }
  // Khoá chính còn thiếu ⇒ thêm cột id tự tăng
  for (const t of tables) {
    for (const c of t.primaryKey?.columns ?? []) { const col = findColumn(t, c); if (col) col.nullable = false; }
    if (!t.primaryKey) {
      const id: Column = { name: `${lc1(t.name)}Id`, type: sqlType('int', dialect), nullable: false, nullExplicit: true, identity: { start: 1, increment: 1, mode: 'identity' }, span: NOSPAN, nameSpan: NOSPAN };
      if (!findColumn(t, id.name)) t.columns.unshift(id);
      t.primaryKey = { columns: [id.name] };
      notes.push(bi(`${t.name}: không có PK trong Mermaid ⇒ thêm ${id.name} tự tăng`, `${t.name}: no PK in the Mermaid ERD ⇒ added an auto-increment ${id.name}`));
    }
    t.primaryKey.name = `PK_${t.name}`;
    if (t.primaryKey.columns.length === 1) {
      const c = findColumn(t, t.primaryKey.columns[0]);
      if (c && /^(INT|INTEGER|BIGINT)$/.test(c.type.name) && !fkMarked.get(t)?.has(c.name.toLowerCase())) c.identity = c.identity ?? { start: 1, increment: 1, mode: 'identity' };
    }
  }
  const model: DbModel = { dialect, tables, enums: [] };
  const many = (m: string) => /[{}]/.test(m);
  const used = new Map<Table, Set<string>>();
  const addFk = (child: Table, parent: Table, mandatory: boolean, oneToOne: boolean, label: string) => {
    const pk = parent.primaryKey!.columns;
    const fkCols: string[] = [];
    for (const p of pk) {
      const pcol = findColumn(parent, p)!;
      const cands = [p, `${lc1(parent.name)}Id`, `${parent.name.toLowerCase()}_id`, `${lc1(parent.name)}_id`, label.replace(/\W+/g, '')];
      const marked = fkMarked.get(child) ?? new Set<string>();
      const taken = used.get(child) ?? new Set<string>();
      let col = cands.map((c) => findColumn(child, c)).find((c) => c && !taken.has(c.name.toLowerCase()) && (marked.has(c.name.toLowerCase()) || c.name.toLowerCase() !== (child.primaryKey?.columns[0] ?? '').toLowerCase() || pk.length > 1 || oneToOne));
      if (!col) col = child.columns.find((c) => marked.has(c.name.toLowerCase()) && !taken.has(c.name.toLowerCase()) && c.name.toLowerCase().includes(parent.name.toLowerCase().slice(0, 4)));
      if (!col) {
        let n = pk.length === 1 ? `${lc1(parent.name)}Id` : `${lc1(parent.name)}${p[0].toUpperCase()}${p.slice(1)}`;
        if (findColumn(child, n)) n = `${n}${child.columns.length}`;
        col = { name: n, type: { ...pcol.type }, nullable: !mandatory, nullExplicit: true, span: NOSPAN, nameSpan: NOSPAN };
        child.columns.push(col);
        notes.push(bi(`${child.name}: thêm cột khoá ngoại ${n} → ${parent.name}`, `${child.name}: added foreign key column ${n} → ${parent.name}`));
      } else if (mandatory) col.nullable = false;
      taken.add(col.name.toLowerCase()); used.set(child, taken);
      fkCols.push(col.name);
    }
    child.foreignKeys.push({ name: `FK_${child.name}_${parent.name}`, columns: fkCols, refTable: parent.name, refColumns: [...pk] });
    if (oneToOne && !(child.primaryKey && child.primaryKey.columns.join(',').toLowerCase() === fkCols.join(',').toLowerCase())) child.uniques.push({ name: `UQ_${child.name}_${fkCols.join('_')}`, columns: fkCols });
  };
  for (const r of rels) {
    const A = findTable(model, name(r.a))!; const B = findTable(model, name(r.b))!;
    if (many(r.left) && many(r.right)) {
      const j = ensure(/^[A-Z0-9_]+$/.test(A.name) || A.name.includes('_') ? `${A.name}_${B.name}` : `${A.name}${B.name}`);
      j.primaryKey = undefined;
      addFk(j, A, true, false, '');
      addFk(j, B, true, false, '');
      j.primaryKey = { name: `PK_${j.name}`, columns: j.foreignKeys.flatMap((f) => f.columns) };
      notes.push(bi(`${A.name} ↔ ${B.name} là nhiều–nhiều ⇒ tạo bảng nối ${j.name}`, `${A.name} ↔ ${B.name} is many-to-many ⇒ created the junction table ${j.name}`));
      continue;
    }
    // phía "nhiều" là bảng con; 1–1 ⇒ bảng bên phải là con
    const childIsA = many(r.left) && !many(r.right);
    const parent = childIsA ? B : A; const child = childIsA ? A : B;
    const parentMarker = childIsA ? r.right : r.left;
    addFk(child, parent, parentMarker.includes('||') || parentMarker === '|{' || parentMarker === '}|', !many(r.left) && !many(r.right), r.label);
  }
  return { model, notes };
}
