// ⛔ BẢN CHÉP — sửa ở src/services/work/sqlDesign/ rồi chạy scripts/dong-bo-sql-design.mjs
/**
 * Database designer — ĐỌC SQL THẬT thành mô hình CSDL (bảng, cột, kiểu, NULL, DEFAULT, IDENTITY/SERIAL/AUTO_INCREMENT,
 * PK/FK/UNIQUE/CHECK đặt tên hay không, ALTER TABLE … ADD CONSTRAINT, CREATE [UNIQUE] INDEX … [WHERE …], CREATE TYPE … AS
 * ENUM, COMMENT ON, chú thích -- của người viết).
 *
 * Cách đọc: quét token tìm CREATE / ALTER / COMMENT; mọi thứ khác (IF … BEGIN, DROP, SET, USE, INSERT, SELECT, PRINT,
 * GO…) chỉ được ĐẾM rồi bỏ qua ⇒ một tệp setup.sql thật (xoá CSDL cũ, tạo lại, chèn dữ liệu mẫu, truy vấn kiểm tra) vẫn
 * đọc được trọn. Thân thủ tục / hàm / trigger / view được nhảy qua nguyên khối (tới GO với T-SQL).
 *
 * Đang gõ dở: một bảng hỏng không kéo theo các bảng sau — đọc lại từ câu CREATE/ALTER kế tiếp. Bảng hỏng vẫn trả về với
 * `incomplete: true` (cột đọc được tới chỗ lỗi) để ERD vẽ tiếp được.
 */

import { lex, spanOf, type Comment, type Token } from './lexer';
import { BUILTIN_TYPES } from './types';
import {
  bi, findColumn, findTable, sameName,
  type Check, type Column, type DataType, type DbModel, type Dialect, type EnumType, type Expr, type ExprTok, type ForeignKey,
  type Identity, type Index, type IndexCol, type KeyRef, type ParseResult, type Problem, type RefAction, type Span, type Table,
} from './model';

export interface ParseOptions { dialect?: Dialect | 'auto' }

/** Từ mở đầu một câu lệnh — dùng để nhận ra câu mới khi người viết bỏ dấu `;` (T-SQL cho phép). */
const STMT_START = new Set([
  'CREATE', 'ALTER', 'DROP', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'SET', 'USE', 'IF', 'BEGIN', 'END', 'PRINT', 'EXEC', 'EXECUTE',
  'DECLARE', 'GRANT', 'REVOKE', 'DENY', 'TRUNCATE', 'MERGE', 'RAISERROR', 'THROW', 'COMMIT', 'ROLLBACK', 'START', 'LOCK', 'UNLOCK',
  'PRAGMA', 'VACUUM', 'ANALYZE', 'REINDEX', 'CALL', 'DO', 'RETURN', 'WHILE', 'ELSE', 'BACKUP', 'RESTORE', 'COPY', 'SHOW', 'DESCRIBE', 'REPLACE',
]);

/** Câu được đếm vào "đã bỏ qua" (thông tin cho người dùng: "bỏ qua 11 INSERT, 9 SELECT…"). */
const COUNTED = new Set(['INSERT', 'UPDATE', 'DELETE', 'SELECT', 'DROP', 'SET', 'USE', 'EXEC', 'EXECUTE', 'IF', 'PRINT', 'DECLARE', 'GRANT', 'REVOKE', 'TRUNCATE', 'MERGE', 'PRAGMA', 'CALL', 'COPY', 'ALTER']);

const REF_ACTIONS: Record<string, RefAction> = { CASCADE: 'CASCADE', RESTRICT: 'RESTRICT' };

/** Kiểu nhiều chữ (đọc tham lam). */
const MULTI_WORD_TYPES: string[][] = [
  ['DOUBLE', 'PRECISION'], ['CHARACTER', 'VARYING'], ['CHAR', 'VARYING'], ['NATIONAL', 'CHARACTER', 'VARYING'], ['NATIONAL', 'CHAR', 'VARYING'],
  ['NATIONAL', 'CHARACTER'], ['NATIONAL', 'CHAR'], ['NCHAR', 'VARYING'], ['BIT', 'VARYING'], ['LONG', 'VARCHAR'], ['LONG', 'VARBINARY'], ['BINARY', 'VARYING'],
];

interface Ctx { model: DbModel; errors: Problem[]; warnings: Problem[]; skipped: Record<string, number>; dialect: Dialect; comments: Comment[]; commentsByLine: Map<number, Comment[]>; lineStarts: number[]; src: string }

/** Dò hệ quản trị theo dấu hiệu cú pháp. null ⇒ không đủ dấu hiệu. */
export function detectDialect(src: string): Dialect | null {
  const { tokens, hasGo } = lex(src);
  const score: Record<Dialect, number> = { sqlserver: hasGo ? 6 : 0, postgres: 0, mysql: 0, sqlite: 0 };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.t === 'qident') { if (t.raw.startsWith('[')) score.sqlserver += 2; else if (t.raw.startsWith('`')) score.mysql += 3; }
    if (t.t === 'string' && t.prefix === 'N') score.sqlserver += 1;
    if (t.t === 'string' && t.prefix === '$') score.postgres += 3;
    if (t.t === 'op' && t.v === '::') score.postgres += 2;
    if (t.t !== 'word') continue;
    switch (t.u) {
      case 'IDENTITY': if (tokens[i + 1]?.v === '(' || tokens[i - 1]?.t === 'word') score.sqlserver += tokens[i - 1]?.u === 'AS' ? 0 : 3; break;
      case 'NVARCHAR': case 'NCHAR': case 'NTEXT': case 'DATETIME2': case 'UNIQUEIDENTIFIER': case 'SYSDATETIME': case 'GETDATE': case 'NEWID': case 'DATETIMEOFFSET': case 'SMALLDATETIME': case 'NONCLUSTERED': case 'CLUSTERED': score.sqlserver += 3; break;
      case 'AUTO_INCREMENT': case 'ENGINE': case 'UNSIGNED': case 'CHARSET': case 'ZEROFILL': case 'MEDIUMTEXT': case 'LONGTEXT': case 'TINYTEXT': case 'MEDIUMINT': case 'MEDIUMBLOB': case 'LONGBLOB': score.mysql += 3; break;
      case 'SERIAL': case 'BIGSERIAL': case 'SMALLSERIAL': case 'JSONB': case 'TIMESTAMPTZ': case 'BYTEA': case 'PLPGSQL': case 'INET': case 'CITEXT': score.postgres += 3; break;
      case 'AUTOINCREMENT': case 'PRAGMA': score.sqlite += 4; break;
      case 'ROWID': if (tokens[i - 1]?.u === 'WITHOUT') score.sqlite += 4; break;
      case 'GENERATED': if (tokens[i + 2]?.u === 'AS' && tokens[i + 3]?.u === 'IDENTITY') score.postgres += 2; break;
      default: break;
    }
  }
  const best = (Object.entries(score) as Array<[Dialect, number]>).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] >= 2 ? best[0] : null;
}

export function parseSql(src: string, opts: ParseOptions = {}): ParseResult {
  const lx = lex(src);
  const detected = detectDialect(src);
  const dialect: Dialect = opts.dialect && opts.dialect !== 'auto' ? opts.dialect : detected ?? 'sqlserver';
  const commentsByLine = new Map<number, Comment[]>();
  for (const c of lx.comments) {
    const arr = commentsByLine.get(c.line) ?? [];
    arr.push(c);
    commentsByLine.set(c.line, arr);
  }
  const ctx: Ctx = { model: { dialect, tables: [], enums: [] }, errors: [...lx.problems], warnings: [], skipped: {}, dialect, comments: lx.comments, commentsByLine, lineStarts: lx.lineStarts, src };
  new Parser(lx.tokens, ctx).run();
  finalize(ctx);
  return { model: ctx.model, dialect, detected, errors: ctx.errors, warnings: ctx.warnings, skipped: ctx.skipped };
}

class Stop extends Error {}

class Parser {
  private i = 0;
  constructor(private readonly toks: Token[], private readonly c: Ctx) {}

  // ─── con trỏ ───
  private peek(k = 0): Token { return this.toks[Math.min(this.i + k, this.toks.length - 1)]; }
  private next(): Token { const t = this.toks[this.i]; if (this.i < this.toks.length - 1) this.i++; return t; }
  private prev(): Token { return this.toks[Math.max(0, this.i - 1)]; }
  private is(u: string, k = 0): boolean { const t = this.peek(k); return t.t === 'word' && t.u === u; }
  private isOp(v: string, k = 0): boolean { const t = this.peek(k); return t.t === 'op' && t.v === v; }
  private eat(...us: string[]): boolean {
    for (let k = 0; k < us.length; k++) if (!this.is(us[k], k)) return false;
    this.i += us.length;
    return true;
  }
  private eatOp(v: string): boolean { if (this.isOp(v)) { this.next(); return true; } return false; }
  private atEnd(): boolean { const t = this.peek(); return t.t === 'eof' || t.t === 'sep'; }
  /** Câu mới bắt đầu (đầu dòng + từ mở câu) — chỉ dùng khi đang ở mức ngoặc 0. */
  private atNewStatement(k = 0): boolean {
    const t = this.peek(k);
    if (t.t === 'eof' || t.t === 'sep') return true;
    if (t.t !== 'word' || !t.bol) return false;
    if (t.u === 'COMMENT') return this.is('ON', k + 1);
    if (t.u === 'SET' && this.toks[this.i + k - 1]?.u === 'CHARACTER') return false;
    if (t.u === 'WITH' || t.u === 'ON') return false;
    return STMT_START.has(t.u);
  }

  private span(a: Token, b: Token = a): Span { return spanOf(this.c.lineStarts, a.start, b.end); }
  private err(code: string, tok: Token, vi: string, en: string, extra: Partial<Problem> = {}): Problem {
    const p: Problem = { code, severity: 'error', message: bi(vi, en), span: this.span(tok), ...extra };
    this.c.errors.push(p);
    return p;
  }
  private warn(code: string, tok: Token, vi: string, en: string, extra: Partial<Problem> = {}) {
    this.c.warnings.push({ code, severity: 'warning', message: bi(vi, en), span: this.span(tok), ...extra });
  }
  private shown(t: Token) { return t.t === 'eof' ? 'end of file' : t.t === 'sep' ? (t.v === 'GO' ? 'GO' : `"${t.v}"`) : `"${t.raw.slice(0, 40)}"`; }
  private shownVi(t: Token) { return t.t === 'eof' ? 'hết tệp' : t.t === 'sep' ? (t.v === 'GO' ? 'GO' : `"${t.v}"`) : `"${t.raw.slice(0, 40)}"`; }

  /** Nhảy tới hết câu: dấu kết câu, hoặc câu mới ở mức ngoặc 0. */
  private skipStatement(untilGo = false) {
    let depth = 0;
    while (this.peek().t !== 'eof') {
      const t = this.peek();
      if (t.t === 'sep') { if (!untilGo || t.v !== ';') return; this.next(); continue; }
      if (!untilGo && depth === 0 && this.i > 0 && this.atNewStatement() && t !== this.toks[this.i - 1]) {
        if (t.bol) return;
      }
      if (t.t === 'op' && t.v === '(') depth++;
      if (t.t === 'op' && t.v === ')') depth = Math.max(0, depth - 1);
      this.next();
    }
  }

  /** Phục hồi sau lỗi trong một câu: tới dấu kết câu hoặc câu CREATE/ALTER kế tiếp ở đầu dòng (bất kể ngoặc). */
  private recover() {
    while (this.peek().t !== 'eof') {
      const t = this.peek();
      if (t.t === 'sep') return;
      if (t.t === 'word' && t.bol && (t.u === 'CREATE' || t.u === 'ALTER' || (t.u === 'COMMENT' && this.is('ON', 1)))) return;
      this.next();
    }
  }

  private count(kind: string) { this.c.skipped[kind] = (this.c.skipped[kind] ?? 0) + 1; }

  run() {
    let stmtStart = true;
    while (this.peek().t !== 'eof') {
      const t = this.peek();
      if (t.t === 'sep') { this.next(); stmtStart = true; continue; }
      if (t.t === 'word') {
        const at = this.i;
        try {
          if (t.u === 'CREATE') { this.create(); stmtStart = true; continue; }
          if (t.u === 'ALTER' && this.is('TABLE', 1)) { this.alterTable(); stmtStart = true; continue; }
          if (t.u === 'COMMENT' && this.is('ON', 1)) { this.commentOn(); stmtStart = true; continue; }
          if ((t.u === 'EXEC' || t.u === 'EXECUTE') && /sp_addextendedproperty$/i.test(this.peek(1).v + (this.isOp('.', 2) ? this.peek(3).v : ''))) { this.extendedProperty(); stmtStart = true; continue; }
          if (t.u === 'USE' && (this.peek(1).t === 'word' || this.peek(1).t === 'qident')) {
            const db = this.peek(1).v;
            if (!/^master$/i.test(db)) this.c.model.database = db;
          }
        } catch (e) {
          if (!(e instanceof Stop)) throw e;
          if (this.i === at) this.next();
          this.recover();
          stmtStart = true;
          continue;
        }
        if ((stmtStart || t.bol) && COUNTED.has(t.u)) this.count(t.u === 'EXECUTE' ? 'EXEC' : t.u);
      }
      stmtStart = false;
      this.next();
    }
  }

  // ─── tên ───
  private isIdent(t: Token) { return t.t === 'word' || t.t === 'qident'; }
  /** a.b.c ⇒ { name: c, schema: b }. */
  private qname(): { name: string; schema?: string; first: Token; last: Token } | null {
    const first = this.peek();
    if (!this.isIdent(first)) return null;
    const parts: Token[] = [this.next()];
    while (this.isOp('.') && this.isIdent(this.peek(1))) { this.next(); parts.push(this.next()); }
    const last = parts[parts.length - 1];
    const schema = parts.length > 1 ? parts[parts.length - 2].v : undefined;
    return { name: last.v, schema: schema && !/^(dbo|public|main)$/i.test(schema) ? schema : undefined, first, last };
  }
  private ident(): Token | null { const t = this.peek(); if (!this.isIdent(t)) return null; return this.next(); }

  private expectOp(v: string, vi: string, en: string): Token {
    if (this.isOp(v)) return this.next();
    const t = this.peek();
    this.err('SQL_EXPECTED', t, `${vi} — gặp ${this.shownVi(t)}`, `${en} — found ${this.shown(t)}`);
    throw new Stop();
  }

  /** ( a [ASC|DESC], b(10), (expr) ) */
  private columnList(allowExpr = false): IndexCol[] {
    this.expectOp('(', 'Cần dấu ( mở danh sách cột', 'Expected ( to start the column list');
    const cols: IndexCol[] = [];
    while (!this.isOp(')')) {
      if (this.atEnd()) { this.err('SQL_UNCLOSED', this.peek(), 'Danh sách cột chưa đóng bằng )', 'The column list is never closed with )'); throw new Stop(); }
      if (allowExpr && this.isOp('(')) {
        const e = this.parenExpr();
        cols.push({ name: e.text, expr: e });
      } else {
        const id = this.ident();
        if (!id) { const t = this.peek(); this.err('SQL_EXPECTED_COLUMN', t, `Cần tên cột — gặp ${this.shownVi(t)}`, `Expected a column name — found ${this.shown(t)}`); throw new Stop(); }
        const col: IndexCol = { name: id.v };
        if (this.isOp('(') && this.peek(1).t === 'number') { this.next(); col.length = Number(this.next().v); this.expectOp(')', 'Cần )', 'Expected )'); }
        if (this.eat('COLLATE')) this.ident();
        if (this.eat('ASC')) col.desc = false; else if (this.eat('DESC')) col.desc = true;
        if (this.eat('NULLS', 'FIRST') || this.eat('NULLS', 'LAST')) { /* bỏ qua */ }
        cols.push(col);
      }
      if (!this.eatOp(',')) break;
    }
    this.expectOp(')', 'Cần dấu ) đóng danh sách cột', 'Expected ) to close the column list');
    return cols;
  }

  /** Biểu thức trong ngoặc ( … ) — trả biểu thức BÊN TRONG. */
  private parenExpr(): Expr {
    const open = this.expectOp('(', 'Cần dấu (', 'Expected (');
    const start = this.i;
    let depth = 1;
    while (depth > 0) {
      const t = this.peek();
      if (t.t === 'eof' || t.t === 'sep') { this.err('SQL_UNCLOSED', open, 'Dấu ( này chưa được đóng', 'This ( is never closed'); throw new Stop(); }
      if (t.t === 'op' && t.v === '(') depth++;
      if (t.t === 'op' && t.v === ')') { depth--; if (depth === 0) break; }
      this.next();
    }
    const e = this.exprOf(start, this.i);
    this.next(); // )
    return e;
  }

  private exprOf(from: number, to: number): Expr {
    const toks = this.toks.slice(from, to);
    const et: ExprTok[] = toks.map((t) => ({ t: t.t as ExprTok['t'], v: t.v, raw: t.raw, ...(t.prefix ? { prefix: t.prefix } : {}) }));
    const text = toks.length ? this.c.src.slice(toks[0].start, toks[toks.length - 1].end).replace(/\s+/g, ' ').trim() : '';
    return { text, toks: et };
  }

  // ─── CREATE ───
  private create() {
    const start = this.next(); // CREATE
    this.eat('OR', 'REPLACE');
    this.eat('OR', 'ALTER');
    let temp = false;
    while (this.is('TEMP') || this.is('TEMPORARY') || this.is('GLOBAL') || this.is('LOCAL') || this.is('UNLOGGED') || this.is('VIRTUAL')) { const w = this.next(); if (w.u !== 'UNLOGGED') temp = w.u === 'VIRTUAL' ? temp : true; }
    if (this.is('TABLE')) { this.next(); this.createTable(start, temp); return; }
    if (this.is('UNIQUE') || this.is('INDEX') || this.is('CLUSTERED') || this.is('NONCLUSTERED') || this.is('FULLTEXT') || this.is('SPATIAL') || this.is('COLUMNSTORE') || this.is('BITMAP')) { this.createIndex(start); return; }
    if (this.is('TYPE')) { this.createType(); return; }
    if (this.is('DATABASE') || this.is('SCHEMA')) {
      const kind = this.next().u;
      this.eat('IF', 'NOT', 'EXISTS');
      const n = this.ident();
      if (kind === 'DATABASE' && n) this.c.model.database = n.v;
      this.count(`CREATE ${kind}`);
      this.skipStatement();
      return;
    }
    const kind = this.peek().u || 'CREATE';
    if (['PROCEDURE', 'PROC', 'FUNCTION', 'TRIGGER', 'VIEW', 'EVENT', 'RULE', 'MATERIALIZED', 'DEFINER', 'AGGREGATE'].includes(kind) || this.is('ALGORITHM')) {
      this.count(`CREATE ${kind === 'PROC' ? 'PROCEDURE' : kind}`);
      // T-SQL: thủ tục/hàm/trigger/view chiếm TRỌN một lô ⇒ tới GO.
      this.skipStatement(this.c.dialect === 'sqlserver');
      return;
    }
    this.count(`CREATE ${kind}`);
    this.skipStatement();
  }

  private createType() {
    this.next(); // TYPE
    const q = this.qname();
    if (!q) { this.skipStatement(); return; }
    if (this.eat('AS', 'ENUM')) {
      this.expectOp('(', 'Cần ( sau AS ENUM', 'Expected ( after AS ENUM');
      const values: string[] = [];
      while (this.peek().t === 'string') { values.push(this.next().v); if (!this.eatOp(',')) break; }
      this.expectOp(')', 'Cần ) đóng danh sách ENUM', 'Expected ) to close the ENUM list');
      const e: EnumType = { name: q.name, values, span: this.span(q.first, this.prev()) };
      this.c.model.enums = this.c.model.enums.filter((x) => !sameName(x.name, e.name)).concat(e);
      return;
    }
    this.count('CREATE TYPE');
    this.skipStatement();
  }

  private createTable(start: Token, temp: boolean) {
    this.eat('IF', 'NOT', 'EXISTS');
    const q = this.qname();
    if (!q) { const t = this.peek(); this.err('SQL_TABLE_NAME', t, `Thiếu tên bảng sau CREATE TABLE — gặp ${this.shownVi(t)}`, `Missing table name after CREATE TABLE — found ${this.shown(t)}`); throw new Stop(); }
    if (temp || q.name.startsWith('#')) { this.count('CREATE TEMP TABLE'); this.skipStatement(); return; }
    if (this.is('AS') || this.is('LIKE') || this.is('OF') || this.is('PARTITION')) { this.count('CREATE TABLE AS'); this.skipStatement(); return; }
    const table: Table = { name: q.name, ...(q.schema ? { schema: q.schema } : {}), columns: [], uniques: [], foreignKeys: [], checks: [], indexes: [], span: this.span(start, q.last), nameSpan: this.span(q.first, q.last) };
    const dup = findTable(this.c.model, q.name);
    if (dup) this.err('SQL_DUP_TABLE', q.last, `Bảng "${q.name}" đã được tạo ở dòng ${dup.nameSpan.line}`, `Table "${q.name}" is already created on line ${dup.nameSpan.line}`, { table: q.name });
    else this.c.model.tables.push(table);
    const finish = () => { table.span = this.span(start, this.prev()); };
    try {
      if (!this.isOp('(')) {
        const t = this.peek();
        this.err('SQL_EXPECTED', t, `Cần dấu ( sau tên bảng ${q.name} — gặp ${this.shownVi(t)}`, `Expected ( after the table name ${q.name} — found ${this.shown(t)}`, { table: q.name });
        table.incomplete = true;
        throw new Stop();
      }
      const open = this.next();
      for (;;) {
        if (this.isOp(')')) { this.next(); break; }
        const t = this.peek();
        if (t.t === 'eof' || t.t === 'sep' || (t.t === 'word' && t.bol && (t.u === 'CREATE' || t.u === 'ALTER'))) {
          this.err('SQL_UNCLOSED', open, `Bảng ${q.name}: dấu ( chưa được đóng bằng )`, `Table ${q.name}: the ( is never closed with )`, { table: q.name });
          table.incomplete = true;
          finish();
          return;
        }
        this.tableElement(table);
        if (this.eatOp(',')) continue;
        if (this.isOp(')')) { this.next(); break; }
        const bad = this.peek();
        if (bad.t === 'eof' || bad.t === 'sep' || (bad.t === 'word' && bad.bol && (bad.u === 'CREATE' || bad.u === 'ALTER'))) continue; // vòng sau báo "chưa đóng"
        // Thiếu dấu phẩy: phần tử mới bắt đầu ở đầu dòng ⇒ báo lỗi rồi đọc tiếp như có phẩy.
        if (bad.bol && this.isIdent(bad)) {
          this.err('SQL_MISSING_COMMA', this.prev(), `Thiếu dấu phẩy sau "${this.prev().raw}" (trước ${bad.raw})`, `Missing comma after "${this.prev().raw}" (before ${bad.raw})`, { table: q.name });
          table.incomplete = true;
          continue;
        }
        this.err('SQL_EXPECTED', bad, `Cần dấu , hoặc ) — gặp ${this.shownVi(bad)}`, `Expected , or ) — found ${this.shown(bad)}`, { table: q.name });
        table.incomplete = true;
        // bỏ qua tới phẩy / ngoặc đóng ở mức này
        let depth = 0;
        while (!this.atEnd()) {
          if (this.isOp('(')) depth++;
          else if (this.isOp(')')) { if (depth === 0) break; depth--; } else if (this.isOp(',') && depth === 0) break;
          else if (this.peek().bol && (this.is('CREATE') || this.is('ALTER'))) break;
          this.next();
        }
        if (this.eatOp(',')) continue;
        if (this.isOp(')')) { this.next(); break; }
      }
      this.tableOptions(table);
      finish();
    } catch (e) {
      if (e instanceof Stop) { table.incomplete = true; finish(); }
      throw e;
    }
  }

  private tableOptions(table: Table) {
    while (!this.atEnd() && !this.atNewStatement()) {
      if (this.is('COMMENT')) {
        this.next(); this.eatOp('=');
        if (this.peek().t === 'string') table.comment = this.next().v;
        continue;
      }
      if (this.isOp('(')) { this.parenExpr(); continue; }
      this.next();
    }
  }

  private isConstraintStart(): boolean {
    return this.is('CONSTRAINT') || this.is('PRIMARY') || this.is('FOREIGN') || this.is('CHECK') || this.is('EXCLUDE') || this.is('PERIOD')
      || this.is('UNIQUE')
      || ((this.is('KEY') || this.is('INDEX')) && (this.isIdent(this.peek(1)) || this.isOp('(', 1)) && !this.isTypeWord(1))
      || this.is('FULLTEXT') || this.is('SPATIAL') || (this.is('LIKE') && this.c.dialect !== 'sqlserver');
  }
  /** "index INT" — cột tên index (hiếm) chứ không phải INDEX name (…). */
  private isTypeWord(k: number) { const t = this.peek(k); return t.t === 'word' && /^(INT|INTEGER|BIGINT|VARCHAR|NVARCHAR|TEXT|CHAR|SMALLINT|TINYINT|DECIMAL|NUMERIC|BIT|BOOLEAN|DATE|DATETIME|DATETIME2|TIMESTAMP|FLOAT|REAL)$/.test(t.u) && !this.isOp('(', k + 1); }

  private tableElement(table: Table) {
    if (this.isConstraintStart()) { this.tableConstraint(table); return; }
    this.columnDef(table);
  }

  private refActions(fk: ForeignKey) {
    for (;;) {
      if (this.eat('ON', 'DELETE')) { fk.onDelete = this.refAction(); continue; }
      if (this.eat('ON', 'UPDATE')) { fk.onUpdate = this.refAction(); continue; }
      if (this.eat('MATCH')) { this.next(); continue; }
      if (this.eat('NOT', 'FOR', 'REPLICATION')) continue;
      if (this.eat('NOT', 'DEFERRABLE') || this.eat('DEFERRABLE')) { if (this.eat('INITIALLY')) this.next(); continue; }
      if (this.eat('NOT', 'VALID')) continue;
      break;
    }
  }
  private refAction(): RefAction | undefined {
    if (this.eat('SET', 'NULL')) return 'SET NULL';
    if (this.eat('SET', 'DEFAULT')) return 'SET DEFAULT';
    if (this.eat('NO', 'ACTION')) return 'NO ACTION';
    const t = this.peek();
    if (t.t === 'word' && REF_ACTIONS[t.u]) { this.next(); return REF_ACTIONS[t.u]; }
    this.err('SQL_REF_ACTION', t, `Hành động ON DELETE/UPDATE không hợp lệ: ${this.shownVi(t)} (CASCADE, SET NULL, SET DEFAULT, NO ACTION, RESTRICT)`, `Unknown ON DELETE/UPDATE action ${this.shown(t)} (CASCADE, SET NULL, SET DEFAULT, NO ACTION, RESTRICT)`);
    return undefined;
  }

  private references(fk: Omit<ForeignKey, 'refTable' | 'refColumns'> & Partial<ForeignKey>): ForeignKey {
    this.next(); // REFERENCES
    const q = this.qname();
    if (!q) { const t = this.peek(); this.err('SQL_REF_TABLE', t, `Cần tên bảng sau REFERENCES — gặp ${this.shownVi(t)}`, `Expected a table name after REFERENCES — found ${this.shown(t)}`); throw new Stop(); }
    const refColumns = this.isOp('(') ? this.columnList().map((c) => c.name) : [];
    const out: ForeignKey = { ...fk, refTable: q.name, ...(q.schema ? { refSchema: q.schema } : {}), refColumns } as ForeignKey;
    this.refActions(out);
    return out;
  }

  private skipIndexOptions() {
    for (;;) {
      if (this.is('WITH') && this.isOp('(', 1)) { this.next(); this.parenExpr(); continue; }
      if (this.is('USING') && this.is('INDEX', 1)) { this.next(); this.next(); if (this.eat('TABLESPACE')) this.ident(); continue; }
      if (this.is('USING')) { this.next(); this.next(); continue; }
      if (this.is('ON') && !this.is('DELETE', 1) && !this.is('UPDATE', 1) && !this.is('CONFLICT', 1)) { this.next(); if (this.isIdent(this.peek())) this.next(); if (this.isOp('(')) this.parenExpr(); continue; }
      if (this.is('ON', 0) && this.is('CONFLICT', 1)) { this.next(); this.next(); this.next(); continue; }
      if (this.eat('NOT', 'ENFORCED') || this.eat('ENFORCED') || this.eat('NOT', 'VALID') || this.eat('NO', 'INHERIT')) continue;
      if (this.eat('DEFERRABLE') || this.eat('NOT', 'DEFERRABLE')) { if (this.eat('INITIALLY')) this.next(); continue; }
      if (this.is('COMMENT') && this.peek(1).t === 'string') { this.next(); this.next(); continue; }
      if (this.eat('KEY_BLOCK_SIZE')) { this.eatOp('='); this.next(); continue; }
      if (this.eat('INCLUDE')) { this.columnList(); continue; }
      break;
    }
  }

  private tableConstraint(table: Table) {
    const first = this.peek();
    let name: string | undefined;
    if (this.eat('CONSTRAINT')) {
      const n = this.ident();
      if (!n) { const t = this.peek(); this.err('SQL_CONSTRAINT_NAME', t, 'Cần tên ràng buộc sau CONSTRAINT', 'Expected a constraint name after CONSTRAINT'); throw new Stop(); }
      name = n.v;
    }
    if (this.eat('PRIMARY', 'KEY')) {
      let clustered: boolean | undefined;
      if (this.eat('CLUSTERED')) clustered = true; else if (this.eat('NONCLUSTERED')) clustered = false;
      if (this.is('USING')) { this.next(); this.next(); }
      if (this.isIdent(this.peek()) && this.c.dialect === 'mysql' && this.isOp('(', 1)) this.next();
      const cols = this.columnList().map((c) => c.name);
      this.skipIndexOptions();
      const pk: KeyRef = { name, columns: cols, span: this.span(first, this.prev()), ...(clustered !== undefined ? { clustered } : {}) };
      if (table.primaryKey) this.err('SQL_DUP_PK', first, `Bảng ${table.name} đã có khoá chính — mỗi bảng chỉ có MỘT PRIMARY KEY (gộp các cột vào một khoá nếu muốn khoá ghép)`, `Table ${table.name} already has a primary key — a table has only ONE PRIMARY KEY (list several columns in one key for a composite key)`, { table: table.name });
      else table.primaryKey = pk;
      return;
    }
    if (this.is('UNIQUE')) {
      this.next();
      if (this.is('KEY') || this.is('INDEX')) this.next();
      let clustered: boolean | undefined;
      if (this.eat('CLUSTERED')) clustered = true; else if (this.eat('NONCLUSTERED')) clustered = false;
      if (this.isIdent(this.peek()) && !this.isOp('(')) { const n = this.next(); name = name ?? n.v; }
      if (this.is('USING')) { this.next(); this.next(); }
      const cols = this.columnList().map((c) => c.name);
      this.skipIndexOptions();
      table.uniques.push({ name, columns: cols, span: this.span(first, this.prev()), ...(clustered !== undefined ? { clustered } : {}) });
      return;
    }
    if (this.eat('FOREIGN', 'KEY')) {
      if (this.isIdent(this.peek()) && !this.isOp('(')) { const n = this.next(); name = name ?? n.v; }
      const cols = this.columnList().map((c) => c.name);
      if (!this.is('REFERENCES')) { const t = this.peek(); this.err('SQL_EXPECTED', t, `Cần REFERENCES <bảng>(<cột>) sau FOREIGN KEY (…) — gặp ${this.shownVi(t)}`, `Expected REFERENCES <table>(<column>) after FOREIGN KEY (…) — found ${this.shown(t)}`, { table: table.name }); throw new Stop(); }
      const fk = this.references({ name, columns: cols });
      fk.span = this.span(first, this.prev());
      table.foreignKeys.push(fk);
      return;
    }
    if (this.is('CHECK')) {
      this.next();
      const expr = this.parenExpr();
      this.skipIndexOptions();
      table.checks.push({ name, expr, span: this.span(first, this.prev()) });
      return;
    }
    if (this.is('KEY') || this.is('INDEX') || this.is('FULLTEXT') || this.is('SPATIAL')) {
      let method: string | undefined;
      if (this.is('FULLTEXT') || this.is('SPATIAL')) method = this.next().u;
      if (this.is('KEY') || this.is('INDEX')) this.next();
      let iname = name;
      if (this.isIdent(this.peek()) && !this.isOp('(')) iname = this.next().v;
      let clustered: boolean | undefined;
      if (this.eat('CLUSTERED')) clustered = true; else if (this.eat('NONCLUSTERED')) clustered = false;
      if (this.is('USING')) { this.next(); method = this.next().u; }
      const cols = this.columnList(true);
      this.skipIndexOptions();
      table.indexes.push({ name: iname, table: table.name, columns: cols, unique: false, ...(method ? { method } : {}), ...(clustered !== undefined ? { clustered } : {}), span: this.span(first, this.prev()) });
      return;
    }
    // EXCLUDE / PERIOD FOR SYSTEM_TIME / LIKE … — không vẽ được, bỏ qua phần tử.
    this.warn('SQL_SKIPPED_ELEMENT', first, `Bỏ qua "${first.raw}" — phần này không ảnh hưởng sơ đồ`, `Skipped "${first.raw}" — it does not affect the diagram`, { table: table.name });
    this.skipElement();
  }

  /** Tới dấu phẩy/ngoặc đóng của phần tử hiện tại (mức ngoặc 0). */
  private skipElement() {
    let depth = 0;
    while (!this.atEnd()) {
      if (this.isOp('(')) depth++;
      else if (this.isOp(')')) { if (depth === 0) return; depth--; } else if (this.isOp(',') && depth === 0) return;
      this.next();
    }
  }

  private parseType(): DataType | null {
    const first = this.peek();
    if (!this.isIdent(first)) return null;
    let name: string;
    let consumed = false;
    for (const mw of MULTI_WORD_TYPES) if (first.t === 'word' && this.eat(...mw)) { name = mw.join(' '); consumed = true; break; }
    if (!consumed) {
      const q = this.qname();
      if (!q) return null;
      // `[int]` / `[nvarchar]` (SSMS) ⇒ INT / NVARCHAR; tên kiểu tự định nghĩa giữ nguyên.
      const single = q.first === q.last;
      name = single ? (q.first.t === 'word' || BUILTIN_TYPES.has(q.first.v.toUpperCase()) ? q.first.v.toUpperCase() : q.first.v) : (q.schema ? `${q.schema}.${q.name}` : BUILTIN_TYPES.has(q.name.toUpperCase()) ? q.name.toUpperCase() : q.name);
    }
    const args: Array<number | string> = [];
    if (this.isOp('(')) {
      this.next();
      while (!this.isOp(')')) {
        const t = this.peek();
        if (t.t === 'number') { args.push(Number(t.v)); this.next(); } else if (t.t === 'word' && (t.u === 'MAX')) { args.push('MAX'); this.next(); } else if (t.t === 'string') { args.push(t.v); this.next(); } else if (t.t === 'word' && /^(BYTE|CHAR|CHARACTERS|OCTETS)$/.test(t.u)) { this.next(); } else if (t.t === 'op' && (t.v === '-' || t.v === '+') && this.peek(1).t === 'number') { this.next(); args.push(Number(t.v + this.next().v)); } else {
          this.err('SQL_TYPE_ARG', t, `Tham số kiểu dữ liệu không hợp lệ: ${this.shownVi(t)}`, `Invalid data type argument ${this.shown(t)}`);
          throw new Stop();
        }
        if (!this.eatOp(',')) break;
      }
      this.expectOp(')', `Cần ) đóng tham số của kiểu ${name!}`, `Expected ) to close the arguments of ${name!}`);
    }
    // TIMESTAMP(3) WITH TIME ZONE · TIME WITHOUT TIME ZONE
    if ((name! === 'TIMESTAMP' || name! === 'TIME') && (this.is('WITH') || this.is('WITHOUT')) && this.is('TIME', 1) && this.is('ZONE', 2)) {
      const w = this.next().u; this.next(); this.next();
      name = `${name!} ${w} TIME ZONE`;
    }
    let unsigned = false;
    for (;;) {
      if (this.eat('UNSIGNED')) { unsigned = true; continue; }
      if (this.eat('SIGNED') || this.eat('ZEROFILL')) continue;
      break;
    }
    let array = false;
    while (this.isOp('[')) { this.next(); if (this.peek().t === 'number') this.next(); if (this.isOp(']')) this.next(); array = true; }
    if (this.eat('ARRAY')) array = true;
    const raw = this.c.src.slice(first.start, this.prev().end).replace(/\s+/g, ' ');
    return { name: name!, args, raw, ...(unsigned ? { unsigned } : {}), ...(array ? { array } : {}) };
  }

  /** Dừng biểu thức DEFAULT ở mức ngoặc 0. */
  private atDefaultStop(first: boolean): boolean {
    const t = this.peek();
    if (t.t === 'eof' || t.t === 'sep') return true;
    if (t.t === 'op' && (t.v === ',' || t.v === ')')) return true;
    if (t.t !== 'word') return false;
    if (first) return false;
    if (t.u === 'NOT' && (this.is('NULL', 1) || this.is('FOR', 1))) return true;
    if (t.u === 'ON' && this.is('UPDATE', 1)) return true;
    return ['NULL', 'CONSTRAINT', 'PRIMARY', 'UNIQUE', 'CHECK', 'REFERENCES', 'COLLATE', 'COMMENT', 'AUTO_INCREMENT', 'IDENTITY', 'GENERATED', 'FOREIGN', 'DEFAULT', 'WITH', 'ROWGUIDCOL', 'SPARSE', 'PERSISTED', 'FOR'].includes(t.u)
      || (!!t.bol && STMT_START.has(t.u) && t.u !== 'SET');
  }

  private defaultExpr(): Expr {
    const start = this.i;
    let depth = 0;
    let first = true;
    while (true) {
      if (depth === 0 && this.atDefaultStop(first)) break;
      const t = this.peek();
      if (t.t === 'eof' || t.t === 'sep') break;
      if (t.t === 'op' && t.v === '(') depth++;
      if (t.t === 'op' && t.v === ')') depth--;
      this.next();
      first = false;
    }
    if (this.i === start) { const t = this.peek(); this.err('SQL_DEFAULT_EMPTY', t, 'DEFAULT cần một giá trị (ví dụ DEFAULT 0, DEFAULT N\'…\', DEFAULT SYSDATETIME())', 'DEFAULT needs a value (e.g. DEFAULT 0, DEFAULT \'…\', DEFAULT CURRENT_TIMESTAMP)'); }
    let e = this.exprOf(start, this.i);
    // ((0)) kiểu SSMS ⇒ 0
    while (e.toks.length >= 2 && e.toks[0].v === '(' && e.toks[e.toks.length - 1].v === ')' && balancedInner(e.toks)) e = { text: e.text.replace(/^\(\s*/, '').replace(/\s*\)$/, ''), toks: e.toks.slice(1, -1) };
    return e;
  }

  private columnDef(table: Table) {
    const nameTok = this.ident();
    if (!nameTok) { const t = this.peek(); this.err('SQL_EXPECTED_COLUMN', t, `Cần tên cột — gặp ${this.shownVi(t)}`, `Expected a column name — found ${this.shown(t)}`, { table: table.name }); throw new Stop(); }
    const col: Column = { name: nameTok.v, type: { name: '', args: [], raw: '' }, nullable: true, nullExplicit: false, span: this.span(nameTok), nameSpan: this.span(nameTok) };
    if (findColumn(table, col.name)) this.err('SQL_DUP_COLUMN', nameTok, `Cột "${col.name}" bị khai báo hai lần trong bảng ${table.name}`, `Column "${col.name}" is declared twice in table ${table.name}`, { table: table.name, column: col.name });
    table.columns.push(col);
    // T-SQL cột tính toán: name AS (expr) [PERSISTED]
    if (this.is('AS')) {
      this.next();
      const st = this.i;
      let expr: Expr;
      if (this.isOp('(')) expr = this.parenExpr(); else { while (!this.atEnd() && !this.isOp(',') && !this.isOp(')') && !this.is('PERSISTED')) this.next(); expr = this.exprOf(st, this.i); }
      col.computed = { expr, stored: false };
      col.type = { name: 'COMPUTED', args: [], raw: 'computed' };
      if (this.eat('PERSISTED')) col.computed.stored = true;
    } else {
      const startT = this.peek();
      const looksLikeConstraint = startT.t === 'word' && ['NOT', 'NULL', 'PRIMARY', 'UNIQUE', 'REFERENCES', 'DEFAULT', 'CHECK', 'CONSTRAINT'].includes(startT.u);
      const ty = looksLikeConstraint || this.isOp(',') || this.isOp(')') ? null : this.parseType();
      if (!ty) {
        if (this.c.dialect === 'sqlite') col.type = { name: 'ANY', args: [], raw: '' };
        else {
          const t = this.peek();
          this.err('SQL_COLUMN_TYPE', nameTok, `Cột "${col.name}" cần kiểu dữ liệu (ví dụ INT, NVARCHAR(100), DECIMAL(12,0), DATE)${t.t === 'eof' ? '' : ` — gặp ${this.shownVi(t)}`}`, `Column "${col.name}" needs a data type (e.g. INT, VARCHAR(100), DECIMAL(12,0), DATE)${t.t === 'eof' ? '' : ` — found ${this.shown(t)}`}`, { table: table.name, column: col.name });
          table.incomplete = true;
          if (this.atEnd() || (t.bol && this.atNewStatement())) throw new Stop();
        }
      } else col.type = ty;
      const tn = col.type.name;
      if (tn === 'SERIAL' || tn === 'SERIAL4' || tn === 'BIGSERIAL' || tn === 'SERIAL8' || tn === 'SMALLSERIAL' || tn === 'SERIAL2') {
        col.identity = { start: 1, increment: 1, mode: 'serial' };
        col.nullable = false;
      }
    }
    // Ràng buộc cột
    let constraintName: string | undefined;
    for (;;) {
      const t = this.peek();
      if (t.t !== 'word') break;
      if (this.atNewStatement() && t.u !== 'SET' && t.u !== 'DEFAULT') break;
      if (this.eat('CONSTRAINT')) { const n = this.ident(); constraintName = n?.v; continue; }
      if (this.eat('NOT', 'NULL')) { col.nullable = false; col.nullExplicit = true; constraintName = undefined; continue; }
      if (this.eat('NULL')) { col.nullable = true; col.nullExplicit = true; constraintName = undefined; continue; }
      if (this.eat('PRIMARY', 'KEY')) {
        let clustered: boolean | undefined;
        if (this.eat('CLUSTERED')) clustered = true; else if (this.eat('NONCLUSTERED')) clustered = false;
        if (this.eat('ASC') || this.eat('DESC')) { /* */ }
        if (this.is('ON') && this.is('CONFLICT', 1)) { this.next(); this.next(); this.next(); }
        if (table.primaryKey) this.err('SQL_DUP_PK', t, `Bảng ${table.name} đã có khoá chính — muốn khoá ghép thì viết một dòng PRIMARY KEY (cột1, cột2)`, `Table ${table.name} already has a primary key — for a composite key write one PRIMARY KEY (col1, col2)`, { table: table.name, column: col.name });
        else table.primaryKey = { name: constraintName, columns: [col.name], span: this.span(t, this.prev()), ...(clustered !== undefined ? { clustered } : {}) };
        if (this.eat('AUTOINCREMENT')) col.identity = { start: 1, increment: 1, mode: 'autoincrement' };
        constraintName = undefined;
        continue;
      }
      if (this.is('UNIQUE')) {
        this.next();
        if (this.is('KEY')) this.next();
        if (this.eat('CLUSTERED') || this.eat('NONCLUSTERED')) { /* */ }
        table.uniques.push({ name: constraintName, columns: [col.name], span: this.span(t, this.prev()) });
        constraintName = undefined;
        continue;
      }
      if (this.is('CHECK')) {
        this.next();
        const expr = this.parenExpr();
        table.checks.push({ name: constraintName, expr, column: col.name, span: this.span(t, this.prev()) });
        constraintName = undefined;
        continue;
      }
      if (this.is('DEFAULT')) {
        this.next();
        col.default = this.defaultExpr();
        if (constraintName) col.defaultName = constraintName;
        constraintName = undefined;
        continue;
      }
      if (this.is('REFERENCES') || (this.is('FOREIGN') && this.is('KEY', 1))) {
        if (this.is('FOREIGN')) { this.next(); this.next(); }
        const fk = this.references({ name: constraintName, columns: [col.name], inline: true });
        fk.span = this.span(t, this.prev());
        table.foreignKeys.push(fk);
        constraintName = undefined;
        continue;
      }
      if (this.is('IDENTITY')) {
        this.next();
        let start = 1; let inc = 1;
        if (this.isOp('(')) {
          this.next();
          const a = this.signedNumber(); this.eatOp(',');
          const b = this.isOp(')') ? 1 : this.signedNumber();
          this.expectOp(')', 'Cần ) sau IDENTITY(seed, increment)', 'Expected ) after IDENTITY(seed, increment)');
          start = a; inc = b;
        }
        this.eat('NOT', 'FOR', 'REPLICATION');
        col.identity = { start, increment: inc, mode: 'identity' };
        if (!col.nullExplicit) col.nullable = false;
        continue;
      }
      if (this.eat('AUTO_INCREMENT')) { col.identity = { start: 1, increment: 1, mode: 'auto_increment' }; if (!col.nullExplicit) col.nullable = false; continue; }
      if (this.eat('AUTOINCREMENT')) { col.identity = { start: 1, increment: 1, mode: 'autoincrement' }; continue; }
      if (this.is('GENERATED') || (this.is('AS') && this.isOp('(', 1))) {
        if (this.is('GENERATED')) {
          this.next();
          let mode: Identity['mode'] = 'always';
          if (this.eat('ALWAYS')) mode = 'always'; else if (this.eat('BY', 'DEFAULT')) { mode = 'by_default'; this.eat('ON', 'NULL'); }
          if (!this.is('AS')) { const x = this.peek(); this.err('SQL_EXPECTED', x, 'Cần AS IDENTITY hoặc AS (biểu thức) sau GENERATED', 'Expected AS IDENTITY or AS (expression) after GENERATED'); throw new Stop(); }
          this.next();
          if (this.eat('IDENTITY')) {
            const id: Identity = { start: 1, increment: 1, mode };
            if (this.isOp('(')) {
              const e = this.parenExpr();
              const s = /START\s+(?:WITH\s+)?(-?\d+)/i.exec(e.text); const n = /INCREMENT\s+(?:BY\s+)?(-?\d+)/i.exec(e.text);
              if (s) id.start = Number(s[1]); if (n) id.increment = Number(n[1]);
            }
            col.identity = id;
            if (!col.nullExplicit) col.nullable = false;
            continue;
          }
        } else this.next(); // AS
        const expr = this.parenExpr();
        let stored = false;
        if (this.eat('STORED') || this.eat('PERSISTED')) stored = true; else this.eat('VIRTUAL');
        col.computed = { expr, stored };
        continue;
      }
      if (this.eat('COLLATE')) { const n = this.ident(); if (n) col.collate = n.v; continue; }
      if (this.is('COMMENT') && this.peek(1).t === 'string') { this.next(); col.comment = this.next().v; continue; }
      if (this.is('ON') && this.is('UPDATE', 1)) { this.next(); this.next(); this.next(); if (this.isOp('(')) this.parenExpr(); continue; }
      if (this.eat('CHARACTER', 'SET') || this.eat('CHARSET')) { this.ident(); continue; }
      if (this.is('MASKED') || this.is('ENCRYPTED')) { this.next(); this.eat('WITH'); if (this.isOp('(')) this.parenExpr(); continue; }
      if (['ROWGUIDCOL', 'SPARSE', 'FILESTREAM', 'PERSISTED', 'UNSIGNED', 'ZEROFILL', 'SIGNED', 'VISIBLE', 'INVISIBLE', 'BINARY', 'HIDDEN', 'STORAGE', 'DISK', 'MEMORY', 'COLUMN_FORMAT', 'FIXED', 'DYNAMIC'].includes(t.u)) { this.next(); continue; }
      if (this.is('NOT') && this.is('FOR', 1)) { this.eat('NOT', 'FOR', 'REPLICATION'); continue; }
      // Từ lạ trong định nghĩa cột
      if (t.bol && this.isIdent(t) && this.isTypeLike(1)) break; // thiếu phẩy — để vòng ngoài báo
      this.warn('SQL_UNKNOWN_OPTION', t, `Không hiểu "${t.raw}" trong cột ${col.name} — đã bỏ qua`, `Did not understand "${t.raw}" in column ${col.name} — skipped`, { table: table.name, column: col.name });
      this.next();
      if (this.isOp('(')) this.parenExpr();
    }
    col.span = this.span(nameTok, this.prev());
  }
  private isTypeLike(k: number) { const t = this.peek(k); return t.t === 'word' || t.t === 'qident'; }
  private signedNumber(): number {
    let sign = 1;
    if (this.isOp('-')) { this.next(); sign = -1; } else if (this.isOp('+')) this.next();
    const t = this.peek();
    if (t.t !== 'number') { this.err('SQL_EXPECTED_NUMBER', t, `Cần một số — gặp ${this.shownVi(t)}`, `Expected a number — found ${this.shown(t)}`); throw new Stop(); }
    this.next();
    return sign * Number(t.v);
  }

  // ─── CREATE INDEX ───
  private createIndex(start: Token) {
    let unique = false; let clustered: boolean | undefined; let method: string | undefined;
    for (;;) {
      if (this.eat('UNIQUE')) { unique = true; continue; }
      if (this.eat('CLUSTERED')) { clustered = true; continue; }
      if (this.eat('NONCLUSTERED')) { clustered = false; continue; }
      if (this.is('FULLTEXT') || this.is('SPATIAL') || this.is('COLUMNSTORE') || this.is('BITMAP')) { method = this.next().u; continue; }
      break;
    }
    if (!this.eat('INDEX')) { const t = this.peek(); this.err('SQL_EXPECTED', t, `Cần INDEX — gặp ${this.shownVi(t)}`, `Expected INDEX — found ${this.shown(t)}`); throw new Stop(); }
    if (method === 'COLUMNSTORE') { this.count('CREATE COLUMNSTORE INDEX'); this.skipStatement(); return; }
    this.eat('CONCURRENTLY');
    this.eat('IF', 'NOT', 'EXISTS');
    let name: string | undefined;
    if (!this.is('ON')) { const n = this.ident(); name = n?.v; }
    if (this.is('USING')) { this.next(); method = this.next().u; }
    if (!this.eat('ON')) { const t = this.peek(); this.err('SQL_EXPECTED', t, `Cần ON <bảng>(<cột>) — gặp ${this.shownVi(t)}`, `Expected ON <table>(<columns>) — found ${this.shown(t)}`); throw new Stop(); }
    this.eat('ONLY');
    const q = this.qname();
    if (!q) { const t = this.peek(); this.err('SQL_EXPECTED', t, `Cần tên bảng sau ON — gặp ${this.shownVi(t)}`, `Expected a table name after ON — found ${this.shown(t)}`); throw new Stop(); }
    if (this.is('USING')) { this.next(); method = this.next().u; }
    const cols = this.columnList(true);
    const idx: Index = { name, table: q.name, columns: cols, unique, ...(method ? { method } : {}), ...(clustered !== undefined ? { clustered } : {}) };
    for (;;) {
      if (this.eat('INCLUDE')) { idx.include = this.columnList().map((c) => c.name); continue; }
      if (this.eat('NULLS', 'NOT', 'DISTINCT') || this.eat('NULLS', 'DISTINCT')) continue;
      if (this.is('WITH') && this.isOp('(', 1)) { this.next(); this.parenExpr(); continue; }
      if (this.is('USING')) { this.next(); this.next(); continue; }
      if (this.eat('TABLESPACE')) { this.ident(); continue; }
      if (this.is('ALGORITHM') || this.is('LOCK')) { this.next(); this.eatOp('='); this.next(); continue; }
      if (this.is('WHERE')) {
        this.next();
        const st = this.i;
        let depth = 0;
        while (!this.atEnd()) {
          // T-SQL: … WHERE <điều kiện> WITH (…) ON [PRIMARY] — ON/WITH không bao giờ nằm trong điều kiện lọc.
          if (depth === 0 && ((this.is('WITH') && this.isOp('(', 1)) || this.is('ON'))) break;
          if (depth === 0 && this.atNewStatement()) break;
          if (this.isOp('(')) depth++;
          if (this.isOp(')')) depth--;
          this.next();
        }
        idx.where = this.exprOf(st, this.i);
        continue;
      }
      if (this.is('ON') && !this.atNewStatement()) { this.next(); if (this.isIdent(this.peek())) this.next(); if (this.isOp('(')) this.parenExpr(); continue; }
      break;
    }
    idx.span = this.span(start, this.prev());
    const table = findTable(this.c.model, q.name);
    if (!table) { this.err('SQL_INDEX_TABLE', q.last, `CREATE INDEX trên bảng "${q.name}" chưa được tạo (tạo bảng TRƯỚC rồi mới tạo chỉ mục)`, `CREATE INDEX on table "${q.name}", which is not created (create the table BEFORE its index)`, { table: q.name }); return; }
    idx.table = table.name;
    table.indexes.push(idx);
  }

  // ─── ALTER TABLE ───
  private alterTable() {
    this.next(); this.next(); // ALTER TABLE
    this.eat('IF', 'EXISTS');
    this.eat('ONLY');
    const q = this.qname();
    if (!q) { const t = this.peek(); this.err('SQL_TABLE_NAME', t, 'Thiếu tên bảng sau ALTER TABLE', 'Missing table name after ALTER TABLE'); throw new Stop(); }
    const table = findTable(this.c.model, q.name);
    if (!table) {
      // Cảnh báo (không phải lỗi): script chạy lại thường có "IF OBJECT_ID(…) … ALTER TABLE … DROP CONSTRAINT" trước CREATE.
      this.warn('SQL_ALTER_TABLE', q.last, `ALTER TABLE "${q.name}": bảng này chưa được tạo ở trên — câu này bị bỏ qua`, `ALTER TABLE "${q.name}": that table is not created above — statement ignored`, { table: q.name });
      this.skipStatement();
      return;
    }
    for (;;) {
      if (this.atEnd() || this.atNewStatement()) break;
      if (this.eat('WITH', 'CHECK') || this.eat('WITH', 'NOCHECK')) continue;
      if (this.is('ADD')) {
        this.next();
        this.eat('COLUMN');
        this.eat('IF', 'NOT', 'EXISTS');
        if (this.isConstraintStart()) {
          const t0 = this.peek();
          // T-SQL: ADD CONSTRAINT DF_x DEFAULT (0) FOR col
          if (this.is('CONSTRAINT') && this.is('DEFAULT', 2)) {
            this.next(); const n = this.ident(); this.next();
            const e = this.defaultExpr();
            if (!this.eat('FOR')) { const x = this.peek(); this.err('SQL_EXPECTED', x, 'Cần FOR <cột> sau DEFAULT …', 'Expected FOR <column> after DEFAULT …'); throw new Stop(); }
            const cn = this.ident();
            const col = cn ? findColumn(table, cn.v) : undefined;
            if (!col) { this.err('SQL_UNKNOWN_COLUMN', cn ?? t0, `Bảng ${table.name} không có cột "${cn?.v ?? ''}"`, `Table ${table.name} has no column "${cn?.v ?? ''}"`, { table: table.name }); } else { col.default = e; if (n) col.defaultName = n.v; }
          } else this.tableConstraint(table);
        } else if (this.is('DEFAULT')) {
          this.next(); const e = this.defaultExpr(); this.eat('FOR'); const cn = this.ident(); const col = cn ? findColumn(table, cn.v) : undefined; if (col) col.default = e;
        } else {
          if (this.isOp('(')) { this.next(); while (!this.isOp(')') && !this.atEnd()) { this.columnDef(table); if (!this.eatOp(',')) break; } this.eatOp(')'); } else {
            this.columnDef(table);
            // T-SQL: ADD a INT, b INT (một ADD cho nhiều cột)
            while (this.isOp(',') && this.isIdent(this.peek(1)) && !['ADD', 'DROP', 'ALTER', 'MODIFY', 'CHANGE', 'RENAME', 'CONSTRAINT', 'PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK'].includes(this.peek(1).u)) { this.next(); this.columnDef(table); }
          }
        }
      } else if (this.is('DROP')) {
        this.next();
        if (this.eat('CONSTRAINT')) {
          this.eat('IF', 'EXISTS'); const n = this.ident();
          if (n) {
            const m = (x: { name?: string }) => !sameName(x.name, n.v);
            if (table.primaryKey && sameName(table.primaryKey.name, n.v)) table.primaryKey = undefined;
            table.uniques = table.uniques.filter(m); table.foreignKeys = table.foreignKeys.filter(m); table.checks = table.checks.filter(m);
            for (const c of table.columns) if (sameName(c.defaultName, n.v)) { c.default = undefined; c.defaultName = undefined; }
          }
        } else if (this.eat('PRIMARY', 'KEY')) table.primaryKey = undefined;
        else if (this.eat('FOREIGN', 'KEY')) { const n = this.ident(); if (n) table.foreignKeys = table.foreignKeys.filter((f) => !sameName(f.name, n.v)); } else if (this.eat('INDEX') || this.eat('KEY')) { const n = this.ident(); if (n) table.indexes = table.indexes.filter((x) => !sameName(x.name, n.v)); } else {
          this.eat('COLUMN'); this.eat('IF', 'EXISTS');
          const n = this.ident();
          if (n) table.columns = table.columns.filter((c) => !sameName(c.name, n.v));
        }
        this.eat('CASCADE'); this.eat('RESTRICT');
      } else if (this.is('ALTER') || this.is('MODIFY') || this.is('CHANGE')) {
        const verb = this.next().u;
        this.eat('COLUMN');
        if (verb === 'CHANGE') { const old = this.ident(); const tmp: Table = { ...table, columns: [] }; this.columnDef(tmp); const nc = tmp.columns[0]; if (old && nc) this.replaceColumn(table, old.v, nc, tmp); } else if (verb === 'MODIFY') { const tmp: Table = { ...table, columns: [] }; this.columnDef(tmp); const nc = tmp.columns[0]; if (nc) this.replaceColumn(table, nc.name, nc, tmp); } else {
          const cn = this.ident();
          const col = cn ? findColumn(table, cn.v) : undefined;
          if (!col) { this.err('SQL_UNKNOWN_COLUMN', cn ?? this.peek(), `Bảng ${table.name} không có cột "${cn?.v ?? ''}"`, `Table ${table.name} has no column "${cn?.v ?? ''}"`, { table: table.name }); this.skipElementAlter(); } else if (this.eat('SET', 'NOT', 'NULL')) { col.nullable = false; col.nullExplicit = true; } else if (this.eat('DROP', 'NOT', 'NULL')) { col.nullable = true; } else if (this.eat('SET', 'DEFAULT')) { col.default = this.defaultExpr(); } else if (this.eat('DROP', 'DEFAULT')) { col.default = undefined; } else if (this.eat('SET', 'DATA', 'TYPE') || this.eat('TYPE')) { const ty = this.parseType(); if (ty) col.type = ty; if (this.eat('USING')) this.skipElementAlter(); } else if (this.is('ADD') && this.is('GENERATED', 1)) { this.next(); this.next(); this.eat('ALWAYS'); this.eat('BY', 'DEFAULT'); this.eat('AS', 'IDENTITY'); col.identity = { start: 1, increment: 1, mode: 'always' }; if (this.isOp('(')) this.parenExpr(); } else {
            const ty = this.parseType();
            if (ty) col.type = ty;
            if (this.eat('NOT', 'NULL')) { col.nullable = false; col.nullExplicit = true; } else if (this.eat('NULL')) { col.nullable = true; col.nullExplicit = true; }
            this.skipElementAlter();
          }
        }
      } else if (this.is('RENAME')) {
        this.next();
        if (this.eat('COLUMN') || this.isIdent(this.peek()) && this.is('TO', 1)) {
          const a = this.ident(); this.eat('TO'); const b = this.ident();
          const col = a ? findColumn(table, a.v) : undefined;
          if (col && b) this.renameColumn(table, col.name, b.v);
        } else if (this.eat('TO') || this.eat('AS')) { const b = this.ident(); if (b) table.name = b.v; } else this.skipElementAlter();
      } else {
        this.skipElementAlter();
      }
      if (!this.eatOp(',')) break;
    }
    this.skipStatement();
  }
  private skipElementAlter() {
    let depth = 0;
    while (!this.atEnd()) {
      if (depth === 0 && (this.isOp(',') || this.atNewStatement())) return;
      if (this.isOp('(')) depth++;
      if (this.isOp(')')) depth--;
      this.next();
    }
  }
  private replaceColumn(table: Table, oldName: string, nc: Column, tmp: Table) {
    const i = table.columns.findIndex((c) => sameName(c.name, oldName));
    if (i < 0) return;
    if (!sameName(oldName, nc.name)) this.renameColumn(table, oldName, nc.name);
    table.columns[i] = { ...nc, nameSpan: table.columns[i].nameSpan, span: table.columns[i].span };
    if (tmp.primaryKey && !table.primaryKey) table.primaryKey = tmp.primaryKey;
  }
  private renameColumn(table: Table, from: string, to: string) {
    const ren = (xs: string[]) => xs.map((x) => (sameName(x, from) ? to : x));
    const col = findColumn(table, from);
    if (col) col.name = to;
    if (table.primaryKey) table.primaryKey.columns = ren(table.primaryKey.columns);
    for (const u of table.uniques) u.columns = ren(u.columns);
    for (const f of table.foreignKeys) f.columns = ren(f.columns);
    for (const ix of table.indexes) for (const c of ix.columns) if (sameName(c.name, from)) c.name = to;
  }

  // ─── COMMENT ON (PostgreSQL) · sp_addextendedproperty (SQL Server) ───
  private commentOn() {
    this.next(); this.next(); // COMMENT ON
    const kind = this.next().u;
    const q = this.qname();
    if (!this.eat('IS') || this.peek().t !== 'string' || !q) { this.skipStatement(); return; }
    const text = this.next().v;
    if (kind === 'TABLE') { const t = findTable(this.c.model, q.name); if (t) t.comment = text; } else if (kind === 'COLUMN' && q.schema) {
      // a.b ⇒ bảng a, cột b (schema giữ chỗ bảng)
      const t = findTable(this.c.model, q.schema);
      const c = findColumn(t, q.name);
      if (c) c.comment = text;
    }
    this.skipStatement();
  }

  private extendedProperty() {
    this.next();
    const args: Record<string, string> = {};
    const positional: string[] = [];
    while (!this.atEnd() && !this.atNewStatement()) {
      const t = this.peek();
      if (t.t === 'var' && this.isOp('=', 1)) { this.next(); this.next(); const v = this.next(); args[t.v.slice(1).toLowerCase()] = v.v; continue; }
      if (t.t === 'string') positional.push(t.v);
      this.next();
    }
    const name = args.name ?? positional[0];
    if (!name || !/^MS_Description$/i.test(name)) { this.count('EXEC'); return; }
    const value = args.value ?? positional[1] ?? '';
    const tname = args.level1name ?? positional[5];
    const cname = args.level2name ?? positional[7];
    const t = tname ? findTable(this.c.model, tname) : undefined;
    if (!t) return;
    if (cname) { const c = findColumn(t, cname); if (c) c.comment = value; } else t.comment = value;
  }
}

function balancedInner(toks: ExprTok[]): boolean {
  let d = 0;
  for (let i = 0; i < toks.length; i++) {
    if (toks[i].v === '(' && toks[i].t === 'op') d++;
    if (toks[i].v === ')' && toks[i].t === 'op') { d--; if (d === 0 && i < toks.length - 1) return false; }
  }
  return d === 0;
}

// ─── Hoàn tất: chú thích, NOT NULL ngầm định, kiểm tham chiếu cột ───

function finalize(ctx: Ctx) {
  const { model } = ctx;
  for (const t of model.tables) {
    // Chú thích ngay trên CREATE TABLE ⇒ mô tả bảng (nếu chưa có COMMENT)
    if (!t.comment) {
      const lines: string[] = [];
      let line = t.span.line - 1;
      for (;;) {
        const cs = (ctx.commentsByLine.get(line) ?? []).filter((c) => c.ownLine);
        const blockEnding = ctx.comments.find((c) => c.block && c.endLine === line && c.ownLine && c.line !== line);
        if (cs.length) { lines.unshift(...cs.map((c) => c.text)); line--; continue; }
        if (blockEnding) { lines.unshift(blockEnding.text); line = blockEnding.line - 1; continue; }
        break;
      }
      const text = lines.filter((l) => !/^\**\s*Object:\s/i.test(l)).join(' ').replace(/\s+/g, ' ').replace(/^[-=*\s]+|[-=*\s]+$/g, '').trim();
      // "1.1 Account — mô tả" ⇒ "mô tả" (số mục và tên bảng lặp lại không cần trong mô tả)
      const esc = t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const clean = text.replace(/^\d+(\.\d+)*\.?\s+/, '').replace(new RegExp(`^${esc}\\s*[—–:-]+\\s*`, 'i'), '').trim();
      if (clean && !/^-+$/.test(clean)) t.comment = (clean[0].toUpperCase() + clean.slice(1)).slice(0, 400);
    }
    for (const c of t.columns) {
      if (!c.comment) {
        const same = (ctx.commentsByLine.get(c.span.endLine) ?? []).find((x) => !x.ownLine && x.start >= c.span.end);
        if (same && same.text) c.comment = same.text.slice(0, 300);
      }
    }
    // Khoá chính ⇒ NOT NULL
    for (const k of t.primaryKey?.columns ?? []) {
      const c = findColumn(t, k);
      if (c) c.nullable = false;
    }
    // SQLite: INTEGER PRIMARY KEY = bí danh rowid (tự tăng)
    if (model.dialect === 'sqlite' && t.primaryKey?.columns.length === 1) {
      const c = findColumn(t, t.primaryKey.columns[0]);
      if (c && c.type.name === 'INTEGER' && !c.identity) c.identity = { start: 1, increment: 1, mode: 'rowid' };
    }
    // DEFAULT nextval('…') (pg_dump) ⇒ tự tăng bằng sequence
    for (const c of t.columns) if (!c.identity && c.default && /^nextval\s*\(/i.test(c.default.text)) { c.identity = { start: 1, increment: 1, mode: 'sequence' }; c.default = undefined; }
    // Cột trong PK/UNIQUE/INDEX phải tồn tại (DB thật sẽ từ chối)
    const check = (cols: string[], what: string, span?: Span) => {
      for (const k of cols) if (!findColumn(t, k)) ctx.errors.push({ code: 'SQL_UNKNOWN_COLUMN', severity: 'error', table: t.name, column: k, span: span ?? t.nameSpan, message: bi(`${what} của bảng ${t.name} nhắc tới cột "${k}" không có trong bảng`, `${what} of table ${t.name} refers to column "${k}", which the table does not have`) });
    };
    if (t.primaryKey) check(t.primaryKey.columns, 'PRIMARY KEY', t.primaryKey.span);
    for (const u of t.uniques) check(u.columns, `UNIQUE${u.name ? ` ${u.name}` : ''}`, u.span);
    for (const f of t.foreignKeys) check(f.columns, `FOREIGN KEY${f.name ? ` ${f.name}` : ''}`, f.span);
    for (const ix of t.indexes) check(ix.columns.filter((c) => !c.expr).map((c) => c.name), `INDEX${ix.name ? ` ${ix.name}` : ''}`, ix.span);
    // Gán lại tên chuẩn cho cột tham chiếu (giữ đúng hoa/thường như khai báo)
    const canon = (x: string) => findColumn(t, x)?.name ?? x;
    if (t.primaryKey) t.primaryKey.columns = t.primaryKey.columns.map(canon);
    for (const u of t.uniques) u.columns = u.columns.map(canon);
    for (const f of t.foreignKeys) f.columns = f.columns.map(canon);
    for (const ix of t.indexes) for (const c of ix.columns) if (!c.expr) c.name = canon(c.name);
  }
  // FK trỏ tới tên bảng đúng hoa/thường như khai báo
  for (const t of model.tables) for (const f of t.foreignKeys) {
    const p = findTable(model, f.refTable);
    if (p) { f.refTable = p.name; f.refColumns = f.refColumns.map((x) => findColumn(p, x)?.name ?? x); }
  }
}

export type { Check, ForeignKey, Index, KeyRef };
