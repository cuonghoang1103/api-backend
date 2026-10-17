// ⛔ BẢN CHÉP — sửa ở src/services/work/sqlDesign/ rồi chạy scripts/dong-bo-sql-design.mjs
/**
 * Database designer — DỊCH BIỂU THỨC (DEFAULT / CHECK / WHERE của chỉ mục lọc) sang hệ khác.
 *
 *   LEN(x)                 → LENGTH(x) (PostgreSQL, SQLite) · CHAR_LENGTH(x) (MySQL)
 *   SYSDATETIME()/GETDATE()→ CURRENT_TIMESTAMP
 *   NEWID()                → gen_random_uuid() · (UUID())
 *   ISNULL(a,b)            → COALESCE(a,b)
 *   x NOT LIKE '%[^0-9]%'  → x !~ '[^0-9]' (PostgreSQL) · x NOT REGEXP '[^0-9]' (MySQL) · x NOT GLOB '*[^0-9]*' (SQLite)
 *   [year] / `year` / "year" → tên bọc theo hệ đích (và đổi tên nếu người chọn snake_case)
 *   active = 1 (cột BIT)   → active = TRUE (PostgreSQL)
 *   x::int                 → CAST(x AS INT)
 * Hàm không biết ⇒ giữ nguyên tên và ghi CHÚ Ý để người kiểm lại — không bao giờ âm thầm bỏ.
 */

import type { Bi, DataType, Dialect, Expr, ExprTok } from './model';
import { bi } from './model';
import { canonOf, renderType, type Canon } from './types';

export type SqlTarget = 'sqlserver' | 'postgres' | 'mysql' | 'sqlite';

export interface ExprEnv {
  from: Dialect;
  to: SqlTarget;
  /** Đổi tên + bọc tên cột cho hệ đích. */
  ident: (name: string) => string;
  /** Kiểu của cột (để đổi 0/1 ⇄ TRUE/FALSE). */
  colCanon?: (name: string) => Canon | undefined;
  note: (n: Bi) => void;
  /** "CHECK CK_Account_phone" — để ghi chú rõ chỗ. */
  where: string;
  /** Độ chính xác giây của cột (MySQL: DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)). */
  fsp?: number;
}

interface Atom { s: string; kind: 'ident' | 'kw' | 'op' | 'lit' | 'group' | 'fn'; name?: string }

const KEYWORDS = new Set([
  'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'BETWEEN', 'LIKE', 'ILIKE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'TRUE', 'FALSE', 'AS', 'ESCAPE', 'EXISTS',
  'SELECT', 'FROM', 'WHERE', 'DISTINCT', 'CURRENT_TIMESTAMP', 'CURRENT_DATE', 'CURRENT_TIME', 'LOCALTIMESTAMP', 'LOCALTIME', 'CURRENT_USER',
  'SESSION_USER', 'SYSTEM_USER', 'INTERVAL', 'COLLATE', 'ANY', 'ALL', 'SOME', 'UNKNOWN', 'SIMILAR', 'TO', 'REGEXP', 'RLIKE', 'GLOB', 'DIV', 'MOD', 'XOR',
]);

/** Hàm cùng tên ở mọi hệ (không cần ghi chú). */
const PORTABLE = new Set(['UPPER', 'LOWER', 'TRIM', 'LTRIM', 'RTRIM', 'ABS', 'ROUND', 'FLOOR', 'COALESCE', 'NULLIF', 'REPLACE', 'SUBSTRING', 'POWER', 'SQRT', 'SIGN', 'MOD', 'CEILING', 'CEIL', 'CONCAT', 'SUBSTR', 'LEFT', 'RIGHT', 'CHAR', 'ASCII', 'MIN', 'MAX', 'COUNT', 'SUM', 'AVG']);

function matchParen(toks: ExprTok[], open: number): number {
  let d = 0;
  for (let j = open; j < toks.length; j++) {
    if (toks[j].t === 'op' && toks[j].v === '(') d++;
    else if (toks[j].t === 'op' && toks[j].v === ')') { d--; if (d === 0) return j; }
  }
  return toks.length - 1;
}

function splitArgs(toks: ExprTok[]): ExprTok[][] {
  const out: ExprTok[][] = [];
  let cur: ExprTok[] = [];
  let d = 0;
  for (const t of toks) {
    if (t.t === 'op' && t.v === '(') d++;
    if (t.t === 'op' && t.v === ')') d--;
    if (t.t === 'op' && t.v === ',' && d === 0) { out.push(cur); cur = []; continue; }
    cur.push(t);
  }
  if (cur.length || out.length) out.push(cur);
  return out;
}

/** LIKE của T-SQL (% _ [..] [^..]) ⇒ biểu thức chính quy (PostgreSQL ~, MySQL REGEXP). */
export function likeToRegex(p: string): string {
  let out = '^';
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '%') out += '.*';
    else if (c === '_') out += '.';
    else if (c === '[') {
      const j = p.indexOf(']', i + 1);
      if (j < 0) { out += '\\['; continue; }
      let cls = p.slice(i + 1, j);
      if (cls.startsWith('^')) cls = `^${cls.slice(1).replace(/\\/g, '\\\\')}`; else cls = cls.replace(/\\/g, '\\\\');
      out += `[${cls}]`;
      i = j;
    } else if (/[.*+?^${}()|\\/]/.test(c)) out += `\\${c}`;
    else out += c;
  }
  out += '$';
  return out.replace(/^\^\.\*/, '').replace(/\.\*\$$/, '') || '.*';
}

/** LIKE ⇒ GLOB của SQLite (* ? [..] [^..]). */
export function likeToGlob(p: string): string {
  let out = '';
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '%') out += '*';
    else if (c === '_') out += '?';
    else if (c === '[') { const j = p.indexOf(']', i + 1); if (j < 0) { out += '[[]'; continue; } out += p.slice(i, j + 1); i = j; } else if (c === '*' || c === '?') out += `[${c}]`;
    else out += c;
  }
  return out;
}

export function sqlString(v: string, to: SqlTarget, opts: { nPrefix?: boolean } = {}): string {
  let body = v.replace(/'/g, "''");
  if (to === 'mysql') body = body.replace(/\\/g, '\\\\');
  const n = to === 'sqlserver' && (opts.nPrefix || /[^\x00-\x7F]/.test(v)) ? 'N' : '';
  return `${n}'${body}'`;
}

function typeFromToks(toks: ExprTok[]): DataType | null {
  const words: string[] = [];
  let i = 0;
  while (i < toks.length && (toks[i].t === 'word' || toks[i].t === 'qident')) { words.push(toks[i].v.toUpperCase()); i++; }
  if (!words.length) return null;
  const args: Array<number | string> = [];
  if (toks[i]?.v === '(') {
    i++;
    while (i < toks.length && toks[i].v !== ')') { if (toks[i].t === 'number') args.push(Number(toks[i].v)); else if (toks[i].t === 'word') args.push(toks[i].v.toUpperCase()); i++; }
  }
  return { name: words.join(' '), args, raw: toks.map((t) => t.raw).join('') };
}

function nowFor(env: ExprEnv, utc: boolean): string {
  switch (env.to) {
    case 'sqlserver': return utc ? 'SYSUTCDATETIME()' : 'SYSDATETIME()';
    case 'postgres': return utc ? "(CURRENT_TIMESTAMP AT TIME ZONE 'UTC')" : 'CURRENT_TIMESTAMP';
    case 'mysql': return utc ? `UTC_TIMESTAMP(${env.fsp ? env.fsp : ''})` : env.fsp ? `CURRENT_TIMESTAMP(${env.fsp})` : 'CURRENT_TIMESTAMP';
    case 'sqlite': return 'CURRENT_TIMESTAMP';
  }
}

function join(atoms: Atom[]): string {
  let s = '';
  atoms.forEach((a, i) => {
    const prev = atoms[i - 1];
    const tight = !prev || a.s === ',' || a.s === '.' || prev.s === '.' || (prev.kind === 'op' && (prev.s === '-' || prev.s === '+') && (!atoms[i - 2] || atoms[i - 2].kind === 'op' || atoms[i - 2].kind === 'kw'));
    s += (tight ? '' : ' ') + a.s;
  });
  return s.replace(/ ,/g, ',');
}

export function translateExpr(e: Expr, env: ExprEnv): string {
  return join(tr(e.toks, env));
}

function tr(toks: ExprTok[], env: ExprEnv): Atom[] {
  const out: Atom[] = [];
  const same = env.from === env.to;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    const nx = toks[i + 1];
    if (t.t === 'op' && t.v === '(') {
      const j = matchParen(toks, i);
      out.push({ s: `(${join(tr(toks.slice(i + 1, j), env))})`, kind: 'group' });
      i = j;
      continue;
    }
    if (t.t === 'word' && nx && nx.t === 'op' && nx.v === '(' && !KEYWORDS.has(t.v.toUpperCase())) {
      const j = matchParen(toks, i + 1);
      out.push({ s: fn(t.v, splitArgs(toks.slice(i + 2, j)), env), kind: 'fn' });
      i = j;
      continue;
    }
    if (t.t === 'word') {
      const U = t.v.toUpperCase();
      if (KEYWORDS.has(U)) {
        if (U === 'TRUE' || U === 'FALSE') { out.push({ s: env.to === 'sqlserver' || env.to === 'sqlite' ? (U === 'TRUE' ? '1' : '0') : U, kind: 'lit' }); continue; }
        if (U === 'CURRENT_TIMESTAMP' || U === 'LOCALTIMESTAMP') { out.push({ s: nowFor(env, false), kind: 'fn' }); continue; }
        if (U === 'CURRENT_DATE') { out.push({ s: env.to === 'sqlserver' ? 'CAST(SYSDATETIME() AS DATE)' : 'CURRENT_DATE', kind: 'fn' }); continue; }
        if ((U === 'LIKE' || U === 'ILIKE') && nx?.t === 'string') {
          const p = nx.v;
          const neg = out[out.length - 1]?.kind === 'kw' && out[out.length - 1].s === 'NOT';
          if (env.from === 'sqlserver' && env.to !== 'sqlserver' && /\[/.test(p)) {
            if (neg) out.pop();
            // Chữ cái trong mẫu ⇒ so không phân biệt hoa/thường như collation _CI của SQL Server.
            const ci = /[A-Za-z]/.test(p.replace(/\[\^?0-9\]/g, ''));
            if (env.to === 'postgres') out.push({ s: `${neg ? '!~' : '~'}${ci ? '*' : ''}`, kind: 'op' }, { s: sqlString(likeToRegex(p), env.to), kind: 'lit' });
            else if (env.to === 'mysql') out.push({ s: neg ? 'NOT REGEXP' : 'REGEXP', kind: 'kw' }, { s: sqlString(likeToRegex(p), env.to), kind: 'lit' });
            else out.push({ s: neg ? 'NOT GLOB' : 'GLOB', kind: 'kw' }, { s: sqlString(likeToGlob(p), env.to), kind: 'lit' });
            env.note(bi(`${env.where}: mẫu LIKE '${p}' dùng [ ] của T-SQL ⇒ đã đổi sang ${env.to === 'sqlite' ? 'GLOB' : 'biểu thức chính quy'}`, `${env.where}: LIKE '${p}' uses T-SQL [ ] classes ⇒ rewritten as ${env.to === 'sqlite' ? 'GLOB' : 'a regular expression'}`));
            i++;
            continue;
          }
          out.push({ s: U === 'ILIKE' && env.to !== 'postgres' ? 'LIKE' : U, kind: 'kw' });
          continue;
        }
        out.push({ s: U, kind: 'kw' });
        continue;
      }
      out.push({ s: env.ident(t.v), kind: 'ident', name: t.v });
      continue;
    }
    if (t.t === 'qident') { out.push({ s: env.ident(t.v), kind: 'ident', name: t.v }); continue; }
    if (t.t === 'string') {
      if (same && t.prefix !== '$') { out.push({ s: t.raw, kind: 'lit' }); continue; }
      out.push({ s: sqlString(t.v, env.to, { nPrefix: t.prefix === 'N' }), kind: 'lit' });
      continue;
    }
    if (t.t === 'number') {
      // cột BIT so với 0/1 ⇒ TRUE/FALSE ở PostgreSQL (BOOLEAN không so được với số)
      const op = out[out.length - 1]; const col = out[out.length - 2];
      if (env.to === 'postgres' && (t.v === '0' || t.v === '1') && op?.kind === 'op' && ['=', '<>', '!='].includes(op.s) && col?.kind === 'ident' && col.name && env.colCanon?.(col.name)?.k === 'bool') {
        out.push({ s: t.v === '1' ? 'TRUE' : 'FALSE', kind: 'lit' });
        continue;
      }
      out.push({ s: t.v, kind: 'lit' });
      continue;
    }
    if (t.t === 'op') {
      if (t.v === '!=') { out.push({ s: '<>', kind: 'op' }); continue; }
      if (t.v === '::') {
        // x::type ⇒ CAST(x AS type)
        let j = i + 1;
        const tt: ExprTok[] = [];
        while (j < toks.length && (toks[j].t === 'word' || toks[j].t === 'qident')) tt.push(toks[j++]);
        if (toks[j]?.v === '(') { const k = matchParen(toks, j); tt.push(...toks.slice(j, k + 1)); j = k + 1; }
        const ty = typeFromToks(tt);
        const x = out.pop();
        if (env.to === 'postgres') { out.push({ s: `${x?.s ?? ''}::${tt.map((z) => z.raw).join('')}`, kind: 'group' }); i = j - 1; continue; }
        const r = ty ? renderType(canonOf(ty), env.to).sql : tt.map((z) => z.raw).join('');
        out.push({ s: /^(REGCLASS|TEXT)$/i.test(ty?.name ?? '') && x ? x.s : `CAST(${x?.s ?? ''} AS ${r})`, kind: 'fn' });
        i = j - 1;
        continue;
      }
      if (t.v === '||' && env.to === 'sqlserver') { out.push({ s: '+', kind: 'op' }); continue; }
      if (t.v === '||' && env.to === 'mysql') env.note(bi(`${env.where}: "||" của MySQL là OR, không phải nối chuỗi ⇒ đổi sang CONCAT(…)`, `${env.where}: in MySQL "||" means OR, not string concatenation ⇒ use CONCAT(…)`));
      if (['~', '~*', '!~', '!~*'].includes(t.v) && env.to !== 'postgres') env.note(bi(`${env.where}: toán tử ${t.v} (regex của PostgreSQL) không có ở hệ đích — kiểm tra lại`, `${env.where}: operator ${t.v} (PostgreSQL regex) does not exist in the target — review it`));
      out.push({ s: t.v, kind: 'op' });
      continue;
    }
    if (t.t === 'var') { env.note(bi(`${env.where}: biến ${t.v} giữ nguyên — kiểm tra lại`, `${env.where}: variable ${t.v} kept as is — review it`)); out.push({ s: t.raw, kind: 'lit' }); continue; }
    out.push({ s: t.raw, kind: 'lit' });
  }
  return out;
}

function fn(name: string, args: ExprTok[][], env: ExprEnv): string {
  const U = name.toUpperCase();
  const A = args.map((a) => join(tr(a, env)));
  const to = env.to;
  const call = (n: string) => `${n}(${A.join(', ')})`;
  if (env.from === to) return call(U === name ? name : name);
  switch (U) {
    case 'LEN': case 'LENGTH': case 'CHAR_LENGTH': case 'CHARACTER_LENGTH':
      return `${to === 'sqlserver' ? 'LEN' : to === 'mysql' ? 'CHAR_LENGTH' : 'LENGTH'}(${A.join(', ')})`;
    case 'DATALENGTH': case 'OCTET_LENGTH':
      return `${to === 'sqlserver' ? 'DATALENGTH' : to === 'postgres' ? 'OCTET_LENGTH' : 'LENGTH'}(${A.join(', ')})`;
    case 'GETDATE': case 'SYSDATETIME': case 'NOW': case 'SYSDATE': case 'CURRENT_TIMESTAMP': case 'LOCALTIMESTAMP': case 'SYSDATETIMEOFFSET': case 'STATEMENT_TIMESTAMP': case 'TRANSACTION_TIMESTAMP':
      return nowFor(env, false);
    case 'GETUTCDATE': case 'SYSUTCDATETIME': case 'UTC_TIMESTAMP':
      return nowFor(env, true);
    case 'CURDATE': case 'CURRENT_DATE':
      return to === 'sqlserver' ? 'CAST(SYSDATETIME() AS DATE)' : 'CURRENT_DATE';
    case 'NEWID': case 'NEWSEQUENTIALID': case 'GEN_RANDOM_UUID': case 'UUID': case 'UUID_GENERATE_V4':
      return to === 'sqlserver' ? 'NEWID()' : to === 'postgres' ? 'gen_random_uuid()' : to === 'mysql' ? 'UUID()' : 'lower(hex(randomblob(16)))';
    case 'ISNULL': case 'IFNULL': case 'NVL':
      if (A.length === 2) return `COALESCE(${A.join(', ')})`;
      break;
    case 'CONVERT':
      if (env.from === 'sqlserver' && args.length >= 2) {
        const ty = typeFromToks(args[0]);
        const r = ty ? renderType(canonOf(ty, [], 'sqlserver'), to).sql : A[0];
        return `CAST(${A[1]} AS ${r})`;
      }
      break;
    case 'CAST': {
      const inner = args[0] ?? [];
      const k = inner.findIndex((x, ix) => x.t === 'word' && x.v.toUpperCase() === 'AS' && depthAt(inner, ix) === 0);
      if (k > 0) {
        const ty = typeFromToks(inner.slice(k + 1));
        const r = ty ? renderType(canonOf(ty, [], env.from), to).sql : join(tr(inner.slice(k + 1), env));
        return `CAST(${join(tr(inner.slice(0, k), env))} AS ${r})`;
      }
      return call('CAST');
    }
    case 'YEAR': case 'MONTH': case 'DAY':
      if (A.length === 1) {
        if (to === 'postgres') return `EXTRACT(${U} FROM ${A[0]})`;
        if (to === 'sqlite') return `CAST(strftime('${U === 'YEAR' ? '%Y' : U === 'MONTH' ? '%m' : '%d'}', ${A[0]}) AS INTEGER)`;
        return `${U}(${A[0]})`;
      }
      break;
    case 'ISJSON': case 'JSON_VALID':
      if (A.length >= 1) return to === 'sqlserver' ? `ISJSON(${A[0]})` : to === 'postgres' ? `(${A[0]} IS JSON)` : to === 'mysql' ? `JSON_VALID(${A[0]})` : `json_valid(${A[0]})`;
      break;
    case 'CEILING': case 'CEIL':
      return `${to === 'postgres' || to === 'sqlite' ? 'CEIL' : 'CEILING'}(${A.join(', ')})`;
    case 'SUBSTRING': case 'SUBSTR':
      return `${to === 'sqlite' ? 'SUBSTR' : 'SUBSTRING'}(${A.join(', ')})`;
    default:
      break;
  }
  if (!PORTABLE.has(U)) env.note(bi(`${env.where}: hàm ${U}() có thể không có ở ${to} — kiểm tra lại`, `${env.where}: function ${U}() may not exist in ${to} — review it`));
  return call(name);
}

function depthAt(toks: ExprTok[], idx: number): number {
  let d = 0;
  for (let i = 0; i < idx; i++) { if (toks[i].v === '(' && toks[i].t === 'op') d++; if (toks[i].v === ')' && toks[i].t === 'op') d--; }
  return d;
}

/** Biểu thức có phải hằng đơn giản (MySQL/SQLite cho phép DEFAULT không cần ngoặc). */
export function isSimpleLiteral(s: string): boolean {
  return /^(N?'(?:[^']|'')*'|-?\d+(\.\d+)?|NULL|TRUE|FALSE|CURRENT_TIMESTAMP(\(\d\))?|CURRENT_DATE|CURRENT_TIME)$/i.test(s.trim());
}
