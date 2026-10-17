/**
 * Database designer — XUẤT MongoDB (mongosh): mỗi bảng ⇒ một collection có $jsonSchema validator (kiểu BSON, bắt buộc,
 * maxLength, enum/min/max dịch từ CHECK), chỉ mục (PK/UNIQUE/INDEX, chỉ mục lọc ⇒ partialFilterExpression), và ghi
 * chú rõ khoá ngoại ánh xạ thành THAM CHIẾU (MongoDB không kiểm khoá ngoại).
 */

import { likeToRegex } from './expr.js';
import { fileNameFor, mimeFor, pickLang } from './generate.js';
import { bi, creationOrder, findColumn, resolvedRefColumns, sameName, type Bi, type Column, type DbModel, type Expr, type ExprTok, type Table } from './model.js';
import { bsonType, canonOf } from './types.js';
import type { ExportOptions, ExportResult } from './generate.js';

type Json = Record<string, unknown>;

function stripParens(t: ExprTok[]): ExprTok[] {
  while (t.length >= 2 && t[0].v === '(' && t[t.length - 1].v === ')') {
    let d = 0; let ok = true;
    for (let i = 0; i < t.length; i++) { if (t[i].v === '(') d++; if (t[i].v === ')') { d--; if (d === 0 && i < t.length - 1) { ok = false; break; } } }
    if (!ok) break;
    t = t.slice(1, -1);
  }
  return t;
}

function splitTop(t: ExprTok[], word: string): ExprTok[][] {
  const out: ExprTok[][] = []; let cur: ExprTok[] = []; let d = 0;
  for (let i = 0; i < t.length; i++) {
    const x = t[i];
    if (x.v === '(') d++;
    if (x.v === ')') d--;
    // BETWEEN a AND b — chữ AND đó không tách điều kiện
    if (d === 0 && x.t === 'word' && x.v.toUpperCase() === word && !(word === 'AND' && cur.some((y, j) => y.t === 'word' && y.v.toUpperCase() === 'BETWEEN' && !cur.slice(j + 1).some((z) => z.t === 'word' && z.v.toUpperCase() === 'AND')))) { out.push(cur); cur = []; continue; }
    cur.push(x);
  }
  out.push(cur);
  return out.filter((x) => x.length);
}

const isW = (x: ExprTok | undefined, w: string) => !!x && x.t === 'word' && x.v.toUpperCase() === w;
const isCol = (x: ExprTok | undefined) => !!x && (x.t === 'word' || x.t === 'qident');
const numOf = (x: ExprTok[] | undefined): number | null => {
  if (!x?.length) return null;
  const s = x.map((y) => y.v).join('');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
};

/** Dịch một CHECK về các ràng buộc $jsonSchema theo cột; không dịch được ⇒ null. */
function checkToSchema(e: Expr, t: Table): Array<{ col: string; rule: Json }> | null {
  const out: Array<{ col: string; rule: Json }> = [];
  for (let part of splitTop(stripParens(e.toks), 'AND')) {
    part = stripParens(part);
    // col IS NULL OR (…) ⇒ điều kiện phía sau (cột đã cho null)
    const ors = splitTop(part, 'OR');
    if (ors.length === 2 && isCol(ors[0][0]) && isW(ors[0][1], 'IS') && isW(ors[0][2], 'NULL') && ors[0].length === 3) {
      const inner = checkToSchema({ text: '', toks: ors[1] }, t);
      if (!inner) return null;
      out.push(...inner);
      continue;
    }
    if (ors.length > 1) return null;
    const p = part;
    // LEN(col) … / LENGTH(col) …
    if (p[0]?.t === 'word' && /^(LEN|LENGTH|CHAR_LENGTH)$/i.test(p[0].v) && p[1]?.v === '(' && isCol(p[2]) && p[3]?.v === ')') {
      const col = p[2].v; const rest = p.slice(4);
      if (isW(rest[0], 'BETWEEN')) {
        const k = rest.findIndex((x) => isW(x, 'AND'));
        const a = numOf(rest.slice(1, k)); const b = numOf(rest.slice(k + 1));
        if (a === null || b === null) return null;
        out.push({ col, rule: { minLength: a, maxLength: b } });
        continue;
      }
      const n = numOf(rest.slice(1));
      if (n === null) return null;
      const op = rest[0]?.v;
      if (op === '=') out.push({ col, rule: { minLength: n, maxLength: n } });
      else if (op === '>=') out.push({ col, rule: { minLength: n } });
      else if (op === '>') out.push({ col, rule: { minLength: n + 1 } });
      else if (op === '<=') out.push({ col, rule: { maxLength: n } });
      else if (op === '<') out.push({ col, rule: { maxLength: n - 1 } });
      else return null;
      continue;
    }
    if (!isCol(p[0]) || !findColumn(t, p[0].v)) return null;
    const col = findColumn(t, p[0].v)!.name;
    const rest = p.slice(1);
    if (isW(rest[0], 'IN') && rest[1]?.v === '(') {
      const vals = rest.slice(2, -1).filter((x) => x.v !== ',');
      if (!vals.every((x) => x.t === 'string' || x.t === 'number')) return null;
      out.push({ col, rule: { enum: vals.map((x) => (x.t === 'number' ? Number(x.v) : x.v)) } });
      continue;
    }
    if (isW(rest[0], 'BETWEEN')) {
      const k = rest.findIndex((x) => isW(x, 'AND'));
      const a = numOf(rest.slice(1, k)); const b = numOf(rest.slice(k + 1));
      if (a === null || b === null) return null;
      out.push({ col, rule: { minimum: a, maximum: b } });
      continue;
    }
    const neg = isW(rest[0], 'NOT');
    const like = neg ? rest.slice(1) : rest;
    if (isW(like[0], 'LIKE') && like[1]?.t === 'string' && like.length === 2) {
      // `pattern` của JSON Schema tìm ở BẤT KỲ đâu trong chuỗi — đúng nghĩa LIKE '%…%' sau khi bỏ neo.
      const re = likeToRegex(like[1].v);
      out.push({ col, rule: neg ? { not: { pattern: re } } : { pattern: re } });
      continue;
    }
    const n = numOf(rest.slice(1));
    if (n !== null) {
      const op = rest[0]?.v;
      if (op === '>=') out.push({ col, rule: { minimum: n } });
      // $jsonSchema của MongoDB theo draft 4: exclusiveMinimum là CỜ đi kèm minimum.
      else if (op === '>') out.push({ col, rule: { minimum: n, exclusiveMinimum: true } });
      else if (op === '<=') out.push({ col, rule: { maximum: n } });
      else if (op === '<') out.push({ col, rule: { maximum: n, exclusiveMaximum: true } });
      else return null;
      continue;
    }
    return null;
  }
  return out;
}

/** WHERE của chỉ mục lọc ⇒ partialFilterExpression (chỉ phép bằng / so sánh / AND). */
function whereToFilter(e: Expr, t: Table): Json | null {
  const out: Json = {};
  for (let p of splitTop(stripParens(e.toks), 'AND')) {
    p = stripParens(p);
    if (!isCol(p[0]) || !findColumn(t, p[0].v)) return null;
    const col = findColumn(t, p[0].v)!.name;
    if (isW(p[1], 'IS') && isW(p[2], 'NOT') && isW(p[3], 'NULL')) { out[col] = { $exists: true }; continue; }
    const op = p[1]?.v;
    const v = p.slice(2);
    if (v.length !== 1) return null;
    const val = v[0].t === 'number' ? Number(v[0].v) : v[0].t === 'string' ? v[0].v : isW(v[0], 'TRUE') ? true : isW(v[0], 'FALSE') ? false : undefined;
    if (val === undefined) return null;
    const m: Record<string, string> = { '=': '$eq', '>': '$gt', '>=': '$gte', '<': '$lt', '<=': '$lte' };
    if (!op || !m[op]) return null;
    out[col] = m[op] === '$eq' ? val : { [m[op]]: val };
  }
  return out;
}

function schemaFor(t: Table, model: DbModel, notes: Bi[], lang: 'vi' | 'en'): { schema: Json; unchecked: string[] } {
  const props: Record<string, Json> = { _id: { bsonType: 'objectId' } };
  const required: string[] = [];
  const L = (b: Bi) => pickLang(lang, b);
  for (const c of t.columns) {
    const canon = canonOf(c.type, model.enums, model.dialect);
    const b = bsonType(canon);
    const prop: Json = { bsonType: c.nullable ? [b.bsonType, 'null'] : b.bsonType };
    if (b.maxLength) prop.maxLength = b.maxLength;
    if (b.enum) prop.enum = c.nullable ? [...b.enum, null] : b.enum;
    const desc: string[] = [];
    if (c.comment) desc.push(c.comment);
    desc.push(`SQL: ${c.type.raw}${c.nullable ? '' : ' NOT NULL'}`);
    if (t.primaryKey?.columns.some((k) => sameName(k, c.name))) desc.push('PK');
    const fk = t.foreignKeys.find((f) => f.columns.some((x) => sameName(x, c.name)));
    if (fk) desc.push(`→ ${fk.refTable}.${resolvedRefColumns(model, fk).join(',')}`);
    if (c.identity) desc.push(L(bi('tự tăng ở SQL — MongoDB không có, ứng dụng tự cấp số (hoặc dùng _id)', 'auto-increment in SQL — MongoDB has none; the app assigns it (or use _id)')));
    if (c.default) desc.push(`${L(bi('mặc định', 'default'))}: ${c.default.text} (${L(bi('ứng dụng tự gán', 'set by the application'))})`);
    if (b.note) desc.push(b.note);
    prop.description = desc.join(' · ');
    props[c.name] = prop;
    if (!c.nullable) required.push(c.name);
  }
  const unchecked: string[] = [];
  for (const ck of t.checks) {
    const rules = checkToSchema(ck.expr, t);
    if (!rules) { unchecked.push(`${ck.name ? `${ck.name}: ` : ''}${ck.expr.text}`); continue; }
    for (const r of rules) {
      const prop = props[findColumn(t, r.col)?.name ?? r.col];
      if (!prop) { unchecked.push(ck.expr.text); continue; }
      for (const [k, v] of Object.entries(r.rule)) {
        if (k === 'enum' && Array.isArray(v) && Array.isArray(prop.bsonType)) prop[k] = [...v, null];
        else prop[k] = v;
      }
    }
  }
  if (unchecked.length) notes.push(bi(`${t.name}: ${unchecked.length} CHECK không dịch được sang $jsonSchema ⇒ kiểm trong ứng dụng (đã ghi trong script)`, `${t.name}: ${unchecked.length} CHECK constraint(s) could not be expressed in $jsonSchema ⇒ enforce them in the application (listed in the script)`));
  return { schema: { bsonType: 'object', title: t.name, ...(t.comment ? { description: t.comment } : {}), required, properties: props }, unchecked };
}

const js = (v: unknown, indent = 2) => (indent === 0 ? inline(v) : pretty(v, ''));

/** JSON một dòng có khoảng trắng dễ đọc: { a: 1, b: "x" }. Khoá là tên hợp lệ ⇒ không cần nháy (JS hợp lệ). */
function inline(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(inline).join(', ')}]`;
  if (v && typeof v === 'object') return `{ ${Object.entries(v as Json).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${inline(x)}`).join(', ')} }`;
  return JSON.stringify(v);
}

/** Nhiều dòng, nhưng mảng/đối tượng ngắn giữ trên một dòng. */
function pretty(v: unknown, ind: string): string {
  const one = inline(v);
  if (one.length + ind.length <= 96 || v === null || typeof v !== 'object') return one;
  const next = `${ind}  `;
  if (Array.isArray(v)) return `[\n${v.map((x) => `${next}${pretty(x, next)}`).join(',\n')}\n${ind}]`;
  return `{\n${Object.entries(v as Json).map(([k, x]) => `${next}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${pretty(x, next)}`).join(',\n')}\n${ind}}`;
}

export function generateMongo(model: DbModel, opts: ExportOptions): ExportResult {
  const lang = opts.lang ?? 'vi';
  const L = (b: Bi) => pickLang(lang, b);
  const notes: Bi[] = [];
  const out: string[] = [];
  const W = (s = '') => out.push(s);
  const { order } = creationOrder(model);
  const title = opts.title ?? model.database ?? 'Database';
  const db = (opts.database ?? model.database ?? title).trim().replace(/[^\w-]+/g, '_').slice(0, 60) || 'app';
  W('// =====================================================================');
  W(`// ${title} — MongoDB (mongosh)`);
  W(`// ${L(bi(`Sinh bởi CT Work · Database designer · ${model.tables.length} collection · ${(opts.now ?? new Date()).toISOString().slice(0, 10)}`, `Generated by CT Work · Database designer · ${model.tables.length} collections · ${(opts.now ?? new Date()).toISOString().slice(0, 10)}`))}`);
  W(`// ${L(bi('Chạy: mongosh "mongodb://localhost:27017" --file tệp.mongodb.js', 'Run: mongosh "mongodb://localhost:27017" --file file.mongodb.js'))}`);
  W('//');
  W(`// ${L(bi('ÁNH XẠ QUAN HỆ:', 'HOW RELATIONSHIPS MAP:'))}`);
  W(`//   ${L(bi('• Mỗi bảng ⇒ một collection; mỗi dòng ⇒ một document. Cột giữ nguyên tên.', '• Each table ⇒ a collection; each row ⇒ a document. Column names are kept.'))}`);
  W(`//   ${L(bi('• Khoá ngoại ⇒ THAM CHIẾU: document con lưu giá trị khoá của cha (vd Room.roomTypeId). MongoDB KHÔNG kiểm', '• Foreign keys ⇒ REFERENCES: the child document stores the parent key (e.g. Room.roomTypeId). MongoDB does NOT check'))}`);
  W(`//     ${L(bi('khoá ngoại — ứng dụng phải kiểm cha tồn tại và tự xử lý khi xoá cha; nối dữ liệu bằng $lookup.', 'foreign keys — the app must check that the parent exists and handle parent deletes; join with $lookup.'))}`);
  W(`//   ${L(bi('• Quan hệ 1–1 hoặc con luôn đọc cùng cha và ít (≤ vài trăm) ⇒ cân nhắc NHÚNG (embed) con vào cha.', '• 1–1, or children always read with their parent and few (≤ a few hundred) ⇒ consider EMBEDDING them in the parent.'))}`);
  W(`//   ${L(bi('• PRIMARY KEY ⇒ chỉ mục unique trên cột khoá (_id vẫn là ObjectId tự sinh). Không có tự tăng.', '• PRIMARY KEY ⇒ a unique index on the key column (_id stays an auto ObjectId). There is no auto-increment.'))}`);
  W(`//   ${L(bi('• Tiền: Decimal128 (NumberDecimal("1800000")) — đừng dùng double.', '• Money: Decimal128 (NumberDecimal("1800000")) — never double.'))}`);
  W('// =====================================================================');
  W();
  W(`db = db.getSiblingDB(${js(db)});`);
  W();
  if (opts.drop !== false) {
    W(`// 0. ${L(bi('Xoá collection cũ (chạy lại được — MẤT dữ liệu trong chúng)', 'Drop old collections (re-runnable — their data is LOST)'))}`);
    W(`for (const name of ${js([...order].reverse().map((t) => t.name), 0).replace(/,/g, ', ')}) db.getCollection(name).drop();`);
    W();
  }
  order.forEach((t, i) => {
    const { schema, unchecked } = schemaFor(t, model, notes, lang);
    W(`// ${i + 1}. ${t.name}${t.comment ? ` — ${t.comment.replace(/\s+/g, ' ').slice(0, 160)}` : ''}`);
    for (const fk of t.foreignKeys) W(`//    ${L(bi('tham chiếu', 'references'))}: ${fk.columns.join(', ')} → ${fk.refTable}.${resolvedRefColumns(model, fk).join(', ')}${fk.onDelete ? ` (ON DELETE ${fk.onDelete} — ${L(bi('ứng dụng tự làm', 'do it in the app'))})` : ''}`);
    for (const u of unchecked) W(`//    ${L(bi('CHECK cần kiểm trong ứng dụng', 'CHECK to enforce in the app'))}: ${u.replace(/\s+/g, ' ')}`);
    W(`db.createCollection(${js(t.name)}, {`);
    W(`  validator: { $jsonSchema: ${pretty(schema, '  ')} },`);
    W("  validationLevel: 'strict',");
    W("  validationAction: 'error',");
    W('});');
    const idx: Json[] = [];
    const nullablePartial = (cols: string[]): Json | undefined => {
      const nul = cols.map((c) => findColumn(t, c)).filter((c): c is Column => !!c && c.nullable);
      if (!nul.length) return undefined;
      return Object.fromEntries(nul.map((c) => [c.name, { $type: bsonType(canonOf(c.type, model.enums, model.dialect)).bsonType }]));
    };
    if (t.primaryKey) idx.push({ key: Object.fromEntries(t.primaryKey.columns.map((c) => [c, 1])), name: t.primaryKey.name ?? `PK_${t.name}`, unique: true });
    for (const u of t.uniques) {
      const pf = nullablePartial(u.columns);
      idx.push({ key: Object.fromEntries(u.columns.map((c) => [c, 1])), name: u.name ?? `UQ_${t.name}_${u.columns.join('_')}`, unique: true, ...(pf ? { partialFilterExpression: pf } : {}) });
      if (pf) notes.push(bi(`${t.name}: UNIQUE (${u.columns.join(', ')}) cho NULL ⇒ partialFilterExpression theo $type để nhiều document thiếu giá trị không bị coi là trùng`, `${t.name}: UNIQUE (${u.columns.join(', ')}) allows NULL ⇒ partialFilterExpression on $type so documents without a value do not collide`));
    }
    for (const ix of t.indexes) {
      if (ix.columns.some((c) => c.expr)) { notes.push(bi(`${t.name}: chỉ mục trên biểu thức ${ix.name ?? ''} không có ở MongoDB ⇒ bỏ`, `${t.name}: expression index ${ix.name ?? ''} has no MongoDB equivalent ⇒ skipped`)); continue; }
      const spec: Json = { key: Object.fromEntries(ix.columns.map((c) => [c.name, c.desc ? -1 : 1])), name: ix.name ?? `IX_${t.name}_${ix.columns.map((c) => c.name).join('_')}` };
      if (ix.unique) spec.unique = true;
      if (ix.where) {
        const f = whereToFilter(ix.where, t);
        if (f) spec.partialFilterExpression = f;
        else { notes.push(bi(`${t.name}: điều kiện lọc của ${spec.name as string} (WHERE ${ix.where.text}) không dịch được ⇒ chỉ mục không lọc`, `${t.name}: the filter of ${spec.name as string} (WHERE ${ix.where.text}) could not be translated ⇒ unfiltered index`)); if (ix.unique) { delete spec.unique; notes.push(bi(`${t.name}: ${spec.name as string} mất UNIQUE vì không lọc được — kiểm luật này trong ứng dụng`, `${t.name}: ${spec.name as string} loses UNIQUE because it cannot be filtered — enforce the rule in the app`)); } }
      }
      idx.push(spec);
    }
    // Cột khoá ngoại chưa có chỉ mục ⇒ thêm (cho $lookup)
    for (const fk of t.foreignKeys) {
      const covered = idx.some((s) => { const k = Object.keys(s.key as Json); return fk.columns.every((c, j) => sameName(k[j], c)) && !(s as Json).partialFilterExpression; });
      if (!covered) idx.push({ key: Object.fromEntries(fk.columns.map((c) => [c, 1])), name: `IX_${t.name}_${fk.columns.join('_')}` });
    }
    for (const spec of idx) {
      const { key, ...o } = spec;
      W(`db.getCollection(${js(t.name)}).createIndex(${js(key, 0)}, ${js(o, 0)});`);
    }
    W();
  });
  if (notes.length) {
    W(`// ${L(bi(`Ghi chú chuyển đổi (${notes.length})`, `Conversion notes (${notes.length})`))}:`);
    for (const n of notes) W(`//  • ${L(n)}`);
    W();
  }
  W(`print(${js(L(bi(`✔ Đã tạo ${order.length} collection trong ${db}`, `✔ Created ${order.length} collections in ${db}`)))});`);
  return { text: out.join('\n') + '\n', fileName: fileNameFor('mongodb', opts.title ?? model.database), mime: mimeFor('mongodb'), ext: 'mongodb.js', notes, bom: false };
}
