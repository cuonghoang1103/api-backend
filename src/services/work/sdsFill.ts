/**
 * CT Work — dm5 G2 (27/11/2026): phần THUẦN của Report 4 (SDS) — test ở sdsFill.test.ts.
 *
 *   B16  "1.3 Database Design": từ mô hình SQL (sơ đồ SQL của Database designer hoặc Flyway V*__*.sql của repo) sinh MỖI BẢNG
 *        một mục "1.3.k <table>" + dòng chú giải của mẫu + bảng 7 cột đúng mẫu (No · Field · PK · FK · UN · NN · Description)
 *        + khối "Constraints" (khoá chính/ngoại nhiều cột, UNIQUE nhiều cột, CHECK, chỉ mục UNIQUE/partial, ON DELETE…).
 *        Tên cột lấy NGUYÊN VĂN từ SQL (không đổi hoa/thường) ⇒ khớp 100% migration.
 *        Điền lại: mục của bảng (theo tên) + mục mẫu "TABLE_NAME" được thay; Description người đã gõ (cột không có COMMENT) giữ lại;
 *        mục con tự viết khác tên bảng giữ nguyên.
 *   B17  "3. Class Specifications": khung theo package Spring Boot đọc từ đường dẫn `src/main/java/<pkg>/<Class>.java` —
 *        "3.k <package>" ⇒ "3.k.m <Class>" + bảng mẫu (Attributes / Methods) có thuộc tính + phương thức public đọc từ mã.
 */

import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import { tableRowsText } from './docFill.js';
import type { DbModel, Table } from './sqlDesign/model.js';
import { findHeading, sectionEnd } from './srs.js';

const t = (text: string): PmNode => ({ type: 'text', text });
const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level: Math.min(Math.max(level, 1), 6) }, content: [t(text)] });
const para = (text: string, italic = false): PmNode => ({ type: 'paragraph', content: [italic ? { type: 'text', text, marks: [{ type: 'italic' }] } : t(text)] });
const cellP = (text: string, bold = false): PmNode => (text ? { type: 'paragraph', content: [bold ? { type: 'text', text, marks: [{ type: 'bold' }] } : t(text)] } : { type: 'paragraph' });
const cell = (type: 'tableHeader' | 'tableCell', text: string, colspan = 1, bold = false): PmNode => ({ type, attrs: { colspan, rowspan: 1, colwidth: null }, content: [cellP(text, bold)] });
const stripNum = (s: string) => s.replace(/^(?:[IVX]+\.|\d+(?:\.\d+)*\.?)\s+/, '').trim();
const levelOf = (n: PmNode) => Number(n.attrs?.level ?? 1);
const numOf = (n: PmNode) => /^(\d+(?:\.\d+)*)\.?\s/.exec(plainText(n).trim())?.[1] ?? null;
const isGuide = (n: PmNode) => n.type === 'blockquote' && /^\s*(Guide|Purpose|Hướng dẫn|Mục đích)\s*:/i.test(plainText(n));

export const DB_LEGEND = '* PK~Primary Key; FK~Foreign Key; UN~Unique; NN ~ not null';
export const DB_HEADERS = ['No', 'Field', 'PK', 'FK', 'UN', 'NN', 'Description'] as const;

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
const cols = (xs: string[]) => xs.join(', ');

export interface DbFieldRow { no: number; field: string; pk: boolean; fk: boolean; un: boolean; nn: boolean; description: string; comment: string | null; typeInfo: string }
export interface DbTableDesign { name: string; comment: string | null; fields: DbFieldRow[]; constraints: string[] }

/** Một bảng SQL ⇒ các dòng 7 cột + danh sách ràng buộc (để test so thẳng, và để dựng nút TipTap). */
export function tableDesign(tb: Table): DbTableDesign {
  const pk = tb.primaryKey?.columns ?? [];
  const singleUnique = new Set([
    ...tb.uniques.filter((u) => u.columns.length === 1).map((u) => u.columns[0].toLowerCase()),
    ...tb.indexes.filter((i) => i.unique && i.columns.length === 1 && !i.where && !i.columns[0].expr).map((i) => i.columns[0].name.toLowerCase()),
  ]);
  const fields = tb.columns.map((c, i) => {
    const fks = tb.foreignKeys.filter((f) => f.columns.some((x) => same(x, c.name)));
    const isPk = pk.some((x) => same(x, c.name));
    const bits = [c.type.raw || c.type.name];
    if (c.identity) bits.push('auto-increment');
    if (c.computed) bits.push(`computed: ${c.computed.expr.text}`);
    if (c.default) bits.push(`default ${c.default.text}`);
    for (const f of fks) {
      const k = f.columns.findIndex((x) => same(x, c.name));
      const ref = f.refColumns[k] ?? f.refColumns[0];
      bits.push(`→ ${f.refTable}${ref ? `(${ref})` : ''}${f.onDelete ? ` ON DELETE ${f.onDelete}` : ''}`);
    }
    const typeInfo = bits.join(' · ');
    return {
      no: i + 1, field: c.name, pk: isPk, fk: fks.length > 0, un: !isPk && singleUnique.has(c.name.toLowerCase()), nn: isPk || !c.nullable,
      description: c.comment?.trim() ? `${c.comment.trim()} (${typeInfo})` : typeInfo, comment: c.comment?.trim() || null, typeInfo,
    };
  });
  const constraints: string[] = [];
  if (pk.length > 1) constraints.push(`PRIMARY KEY (${cols(pk)})${tb.primaryKey?.name ? ` — ${tb.primaryKey.name}` : ''}`);
  for (const u of tb.uniques.filter((x) => x.columns.length > 1)) constraints.push(`UNIQUE (${cols(u.columns)})${u.name ? ` — ${u.name}` : ''}`);
  for (const f of tb.foreignKeys.filter((x) => x.columns.length > 1)) constraints.push(`FOREIGN KEY (${cols(f.columns)}) → ${f.refTable}(${cols(f.refColumns)})${f.onDelete ? ` ON DELETE ${f.onDelete}` : ''}${f.name ? ` — ${f.name}` : ''}`);
  for (const c of tb.checks) constraints.push(`CHECK (${c.expr.text})${c.name ? ` — ${c.name}` : ''}${c.column ? ` on ${c.column}` : ''}`);
  for (const ix of tb.indexes.filter((x) => x.unique && (x.columns.length > 1 || x.where || x.columns.some((c) => c.expr)))) {
    constraints.push(`UNIQUE INDEX ${ix.name ?? ''} (${ix.columns.map((c) => c.expr?.text ?? c.name).join(', ')})${ix.where ? ` WHERE ${ix.where.text}` : ''}`.replace(/\s+\(/, ' ('));
  }
  return { name: tb.name, comment: tb.comment?.trim() || null, fields, constraints };
}

export function dbDesigns(model: DbModel): DbTableDesign[] {
  return model.tables.map(tableDesign);
}

/** Bảng 7 cột; `keepDesc` = mô tả người đã gõ ở bản trước (Field ⇒ Description) — dùng khi cột không có COMMENT trong SQL. */
export function dbTableNode(d: DbTableDesign, keepDesc?: Map<string, string>): PmNode {
  const X = (b: boolean) => (b ? 'X' : '');
  return {
    type: 'table',
    content: [
      { type: 'tableRow', content: DB_HEADERS.map((h) => cell('tableHeader', h)) },
      ...d.fields.map((f) => {
        // Cột không có COMMENT trong SQL mà người đã gõ mô tả ở lần điền trước ⇒ giữ chữ đó, cập nhật phần kiểu trong ngoặc.
        const typed = f.comment ? '' : stripTypeSuffix(keepDesc?.get(f.field.toLowerCase()) ?? '', f.typeInfo);
        const desc = typed ? `${typed} (${f.typeInfo})` : f.description;
        return { type: 'tableRow', content: [String(f.no), f.field, X(f.pk), X(f.fk), X(f.un), X(f.nn), desc].map((v) => cell('tableCell', v)) };
      }),
    ],
  };
}

/** "Mã người dùng (BIGINT · → users(id))" ⇒ "Mã người dùng"; chỉ có phần kiểu ⇒ "". Bỏ nhóm ngoặc cân bằng cuối chuỗi. */
export function stripTypeSuffix(s: string, typeInfo: string): string {
  const v = s.trim();
  if (!v || v === typeInfo) return '';
  if (v.endsWith(` (${typeInfo})`)) return v.slice(0, -(typeInfo.length + 3)).trim();
  if (v.endsWith(')')) {
    let depth = 0;
    for (let i = v.length - 1; i >= 0; i--) {
      if (v[i] === ')') depth++;
      else if (v[i] === '(' && --depth === 0) return i > 0 && v[i - 1] === ' ' ? v.slice(0, i).trim() : v;
    }
  }
  return v;
}

/** Khối một bảng: đề mục "1.3.k name" + chú giải + (mô tả bảng) + bảng 7 cột + Constraints. */
export function dbTableBlocks(d: DbTableDesign, level: number, num: string | null, keepDesc?: Map<string, string>): PmNode[] {
  const out: PmNode[] = [heading(level, `${num ? `${num} ` : ''}${d.name}`)];
  if (d.comment) out.push(para(d.comment));
  out.push(para(DB_LEGEND), dbTableNode(d, keepDesc));
  if (d.constraints.length) {
    out.push({ type: 'paragraph', content: [{ type: 'text', text: 'Constraints', marks: [{ type: 'bold' }] }] });
    out.push({ type: 'bulletList', content: d.constraints.map((c) => ({ type: 'listItem', content: [para(c)] })) });
  }
  return out;
}

/** Field ⇒ Description của bảng 7 cột đang có trong một mục (để giữ chữ người đã gõ). */
function descriptionsIn(blocks: PmNode[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const b of blocks) {
    if (b.type !== 'table') continue;
    const rows = tableRowsText(b);
    const head = rows[0]?.map((h) => h.toLowerCase()) ?? [];
    const fi = head.indexOf('field');
    const di = head.indexOf('description');
    if (fi < 0 || di < 0) continue;
    for (const r of rows.slice(1)) if (r[fi] && r[di]) out.set(r[fi].toLowerCase(), r[di]);
  }
  return out;
}

/**
 * Đặt các bảng thiết kế vào mục "Database Design" (Report 4 §1.3). Trả số bảng đã đặt, 0 nếu không có đề mục (trang không theo
 * mẫu ⇒ không đụng gì). Thân trực tiếp của §1.3 (ghi chú, ERD) giữ nguyên.
 */
export function fillDbDesign(doc: PmNode, designs: DbTableDesign[]): number {
  if (!designs.length) return 0;
  const blocks = doc.content ?? [];
  const p = findHeading(blocks, /^Database Design$/i);
  if (p < 0) return 0;
  const lv = levelOf(blocks[p]);
  const pNum = numOf(blocks[p]);
  const names = new Set(designs.map((d) => d.name.toLowerCase()));
  const end = sectionEnd(blocks, p);
  // Mục con hiện có.
  const kids: Array<{ start: number; end: number; title: string }> = [];
  for (let k = p + 1; k < end; k++) {
    if (blocks[k].type === 'heading' && levelOf(blocks[k]) === lv + 1) {
      let e = k + 1;
      while (e < end && !(blocks[e].type === 'heading' && levelOf(blocks[e]) <= lv + 1)) e++;
      kids.push({ start: k, end: e, title: stripNum(plainText(blocks[k])) });
    }
  }
  const replaced = kids.filter((c) => names.has(c.title.toLowerCase()) || /^TABLE[_ ]NAME$/i.test(c.title));
  const keep = new Map<string, Map<string, string>>();
  for (const c of replaced) keep.set(c.title.toLowerCase(), descriptionsIn(blocks.slice(c.start, c.end)));
  // Vị trí chèn: chỗ mục bị thay đầu tiên; không có ⇒ cuối §1.3.
  const at0 = replaced.length ? replaced[0].start : end;
  for (const c of [...replaced].sort((a, b) => b.start - a.start)) blocks.splice(c.start, c.end - c.start);
  const removedBefore = replaced.filter((c) => c.start < at0).reduce((a, c) => a + (c.end - c.start), 0);
  const at = at0 - removedBefore;
  const others = kids.length - replaced.length;
  const nodes = designs.flatMap((d, i) => dbTableBlocks(d, lv + 1, pNum ? `${pNum}.${others + i + 1}` : null, keep.get(d.name.toLowerCase())));
  blocks.splice(at, 0, ...nodes);
  doc.content = blocks;
  return designs.length;
}

// ─── B17: khung "3. Class Specifications" theo package Spring Boot ─

export interface JavaClassLite { pkg: string; name: string; kind: string; attributes: Array<{ name: string; type: string; visibility: string }>; methods: Array<{ name: string; params: string; returns: string; visibility: string }> }

const VIS: Record<string, string> = { public: 'public', protected: 'protected', private: 'private', '': 'package' };

/** Đọc thô một tệp .java: package, tên lớp, thuộc tính + phương thức (không phải bộ phân tích Java đầy đủ — đủ cho khung SDS). */
export function parseJavaClass(path: string, text: string): JavaClassLite | null {
  const src = String(text ?? '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const pkg = /^\s*package\s+([\w.]+)\s*;/m.exec(src)?.[1]
    ?? (/src\/main\/(?:java|kotlin)\/(.+)\/[^/]+\.(?:java|kt)$/.exec(path)?.[1] ?? '').replace(/\//g, '.');
  const head = /\b(?:public\s+|abstract\s+|final\s+)*(class|interface|enum|record)\s+([A-Z]\w*)/.exec(src);
  if (!head) return null;
  const name = head[2];
  const kind = head[1];
  // Thân lớp: từ { đầu tiên sau tên lớp — chỉ đọc cấp 1 (bỏ thân phương thức).
  const open = src.indexOf('{', head.index);
  if (open < 0) return { pkg, name, kind, attributes: [], methods: [] };
  let depth = 0;
  let top = '';
  for (let i = open + 1; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') { if (depth === 0) top += '{}'; depth++; continue; }
    if (ch === '}') { if (depth === 0) break; depth--; continue; }
    if (depth === 0) top += ch;
  }
  const attributes: JavaClassLite['attributes'] = [];
  const methods: JavaClassLite['methods'] = [];
  const noAnn = top.replace(/@\w+(?:\([^)]*\))?/g, ' ');
  // Lookbehind (không nuốt ký tự ngăn) ⇒ hai khai báo liền nhau "…{} public X y()" đều bắt được.
  for (const m of noAnn.matchAll(/(?<=^|[;{}])\s*((?:public|protected|private)?)\s*((?:static\s+|final\s+|transient\s+|volatile\s+)*)([\w<>[\],.? ]+?)\s+(\w+)\s*(?:=[^;]*)?;/g)) {
    if (/\b(return|throw|import|package|public|protected|private)\b/.test(m[3])) continue;
    attributes.push({ name: m[4], type: m[3].trim().replace(/\s+/g, ' '), visibility: VIS[m[1]] ?? m[1] });
  }
  for (const m of noAnn.matchAll(/(?<=^|[;{}])\s*((?:public|protected|private)?)\s*((?:static\s+|final\s+|abstract\s+|synchronized\s+|default\s+)*)(?:<[^>]+>\s*)?([\w<>[\],.? ]+?)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w., ]+)?\s*(?:\{\}|;)/g)) {
    if (['if', 'for', 'while', 'switch', 'catch', 'return', 'new'].includes(m[4]) || /^(public|protected|private)$/.test(m[3].trim()) || m[4] === name) continue;
    methods.push({ name: m[4], params: m[5].trim().replace(/\s+/g, ' '), returns: m[3].trim().replace(/\s+/g, ' '), visibility: VIS[m[1]] ?? m[1] });
  }
  // Hàm dựng: Tên(…) {…}
  for (const m of noAnn.matchAll(new RegExp(`(?<=^|[;{}])\\s*((?:public|protected|private)?)\\s*${name}\\s*\\(([^)]*)\\)\\s*(?:throws\\s+[\\w., ]+)?\\s*\\{\\}`, 'g'))) {
    methods.unshift({ name, params: m[2].trim().replace(/\s+/g, ' '), returns: '(constructor)', visibility: VIS[m[1]] ?? m[1] });
  }
  return { pkg, name, kind, attributes, methods };
}

/** Bảng mẫu §3.x.y: No · Name · Description, hai nhóm Attributes / Methods. */
export function classSpecTable(c: JavaClassLite): PmNode {
  const row = (a: string, b: string, d: string, bold = false): PmNode => ({ type: 'tableRow', content: [cell('tableCell', a), cell('tableCell', b, 1, bold), cell('tableCell', d)] });
  const rows: PmNode[] = [{ type: 'tableRow', content: ['No', 'Name', 'Description'].map((h) => cell('tableHeader', h)) }];
  rows.push(row('', 'Attributes', '', true));
  if (!c.attributes.length) rows.push(row('1', '', 'Visibility: · Type: '));
  c.attributes.forEach((a, i) => rows.push(row(String(i + 1), a.name, `Visibility: ${a.visibility} · Type: ${a.type}`)));
  rows.push(row('', 'Methods', '', true));
  if (!c.methods.length) rows.push(row('1', '', 'Visibility: · Parameters: · Return: '));
  c.methods.forEach((m, i) => rows.push(row(String(i + 1), m.name, `Visibility: ${m.visibility} · Parameters: ${m.params || 'none'} · Return: ${m.returns}`)));
  return { type: 'table', content: rows };
}

/** Thứ tự package Spring Boot quen thuộc: controller → service → repository → entity/model → dto → config → còn lại. */
const PKG_ORDER = ['controller', 'web', 'api', 'service', 'repository', 'repo', 'entity', 'model', 'domain', 'dto', 'mapper', 'config', 'security', 'exception', 'util'];
const pkgRank = (p: string) => { const last = p.split('.').pop()!.toLowerCase(); const i = PKG_ORDER.indexOf(last); return i >= 0 ? i : 100; };

/**
 * Thay thân "3. Class Specifications" bằng khung theo package. Mục con tự viết (tên không phải package nào và không phải mẫu
 * "Package name") giữ nguyên ở cuối. Trả số lớp đã đặt.
 */
export function fillClassSpecs(doc: PmNode, classes: JavaClassLite[]): number {
  if (!classes.length) return 0;
  const blocks = doc.content ?? [];
  const p = findHeading(blocks, /^Class Specifications?$/i);
  if (p < 0) return 0;
  const lv = levelOf(blocks[p]);
  const pNum = numOf(blocks[p]);
  const end = sectionEnd(blocks, p);
  const pkgs = [...new Set(classes.map((c) => c.pkg || '(default package)'))].sort((a, b) => pkgRank(a) - pkgRank(b) || a.localeCompare(b));
  const pkgSet = new Set(pkgs.map((x) => x.toLowerCase()));
  // Giữ: thân trực tiếp (ghi chú) + mục con tự viết.
  let bodyEnd = p + 1;
  while (bodyEnd < end && blocks[bodyEnd].type !== 'heading') bodyEnd++;
  const direct = blocks.slice(p + 1, bodyEnd).filter(isGuide);
  const custom: PmNode[] = [];
  for (let k = bodyEnd; k < end;) {
    let e = k + 1;
    while (e < end && !(blocks[e].type === 'heading' && levelOf(blocks[e]) <= lv + 1)) e++;
    const title = stripNum(plainText(blocks[k]));
    if (!(levelOf(blocks[k]) === lv + 1 && (pkgSet.has(title.toLowerCase()) || /^Package name$/i.test(title)))) custom.push(...blocks.slice(k, e));
    k = e;
  }
  const nodes: PmNode[] = [];
  pkgs.forEach((pkg, i) => {
    const pn = pNum ? `${pNum}.${i + 1}` : null;
    nodes.push(heading(lv + 1, `${pn ? `${pn} ` : ''}${pkg}`));
    classes.filter((c) => (c.pkg || '(default package)') === pkg).sort((a, b) => a.name.localeCompare(b.name)).forEach((c, j) => {
      nodes.push(heading(lv + 2, `${pn ? `${pn}.${j + 1} ` : ''}${c.name}`), classSpecTable(c));
    });
  });
  blocks.splice(p + 1, end - (p + 1), ...direct, ...nodes, ...custom);
  doc.content = blocks;
  return classes.length;
}
