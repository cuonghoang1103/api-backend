/**
 * CT Work — ngôn ngữ truy vấn kiểu JQL.
 *
 *   assignee = currentUser() AND status != Done ORDER BY priority ASC
 *   type IN (Bug, Story) AND labels = payment AND created >= -7d
 *   summary ~ "login" OR (priority <= High AND sprint IN openSprints())
 *   "Browser" = Chrome            ← trường tuỳ chỉnh theo tên
 *
 * Hai lớp:
 *   parseJql()   — HÀM THUẦN: chuỗi ⇒ cây cú pháp. Lỗi báo kèm vị trí.
 *   compileJql() — cây ⇒ Prisma.WorkIssueWhereInput, dùng bảng tra của dự án
 *                  (tên trạng thái/người/loại/nhãn/sprint/trường tuỳ chỉnh).
 * Không bao giờ ghép chuỗi SQL: mọi giá trị đi qua Prisma.
 */

import type { Prisma } from '@prisma/client';

// ─── Tách từ ─────────────────────────────────────────────────────

type TokKind = 'word' | 'string' | 'op' | 'lparen' | 'rparen' | 'comma' | 'eof';
interface Tok { kind: TokKind; value: string; pos: number }

export class JqlError extends Error {
  /** `suggestion`: giá trị/trường gần đúng nhất ("did you mean") — client tự thay vào. */
  constructor(message: string, public pos: number, public suggestion?: string) {
    super(message);
    this.name = 'JqlError';
  }
}

// ─── Gợi ý "did you mean" ────────────────────────────────────────

/** Khoảng cách Levenshtein có tính đảo hai ký tự kề nhau = 1 ("Bgu" → "Bug"). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/**
 * Ứng viên gần nhất: trùng tiền tố (gõ dở "In Prog") thắng trước, rồi
 * Levenshtein ≤ 2 (≤ 1 với từ ngắn ≤ 3 ký tự để "QA" không gợi ý "API").
 */
export function suggest(input: string, candidates: string[]): string | undefined {
  const q = input.trim().toLowerCase().replace(/^@/, '');
  if (!q) return undefined;
  const uniq = [...new Set(candidates.filter(Boolean))];
  const prefix = uniq.filter((c) => c.toLowerCase().startsWith(q) || (q.length >= 3 && q.startsWith(c.toLowerCase()) && c.length >= 3));
  if (prefix.length) return prefix.sort((a, b) => a.length - b.length)[0];
  let best: string | undefined;
  let bestD = Infinity;
  for (const c of uniq) {
    const d = levenshtein(q, c.toLowerCase());
    const limit = Math.min(q.length, c.length) <= 3 ? 1 : 2;
    if (d <= limit && d < bestD) { best = c; bestD = d; }
  }
  return best;
}

/** Giá trị có dấu cách/ký tự lạ thì trả kèm dấu nháy để thay thẳng vào truy vấn. */
export const quoteIfNeeded = (v: string) => (/^[\p{L}\p{N}_\-.:/+@]+(\(\))?$/u.test(v) ? v : `"${v.replace(/"/g, '\\"')}"`);
const didYouMean = (msg: string, hit: string | undefined) => (hit ? `${msg}. Did you mean ${quoteIfNeeded(hit)}?` : msg);

const OPS = ['!~', '!=', '>=', '<=', '=', '>', '<', '~'];

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '(') { out.push({ kind: 'lparen', value: c, pos: i++ }); continue; }
    if (c === ')') { out.push({ kind: 'rparen', value: c, pos: i++ }); continue; }
    if (c === ',') { out.push({ kind: 'comma', value: c, pos: i++ }); continue; }
    if (c === '"' || c === "'") {
      const start = i++;
      let v = '';
      while (i < src.length && src[i] !== c) {
        if (src[i] === '\\' && i + 1 < src.length) { v += src[i + 1]; i += 2; continue; }
        v += src[i++];
      }
      if (i >= src.length) throw new JqlError('Unclosed quote', start);
      i++;
      out.push({ kind: 'string', value: v, pos: start });
      continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (op) { out.push({ kind: 'op', value: op, pos: i }); i += op.length; continue; }
    const start = i;
    // Từ: chữ, số, và - . _ : / (ngày 2026-09-01, -7d, SWP-12, cf[…] không cần).
    while (i < src.length && /[\p{L}\p{N}_\-.:/+@]/u.test(src[i])) i++;
    if (i === start) throw new JqlError(`Unexpected character "${c}"`, i);
    out.push({ kind: 'word', value: src.slice(start, i), pos: start });
  }
  out.push({ kind: 'eof', value: '', pos: src.length });
  return out;
}

// ─── Cây cú pháp ─────────────────────────────────────────────────

/** `pos`: vị trí của CHÍNH giá trị trong chuỗi (để tô đỏ đúng chỗ sai). */
export type JqlValue = { kind: 'literal'; value: string; quoted: boolean; pos?: number } | { kind: 'fn'; name: string; args: string[]; pos?: number };
export type Operator = '=' | '!=' | '>' | '>=' | '<' | '<=' | '~' | '!~' | 'in' | 'not in' | 'is empty' | 'is not empty';

export type JqlNode =
  | { kind: 'and' | 'or'; children: JqlNode[] }
  | { kind: 'not'; child: JqlNode }
  | { kind: 'clause'; field: string; op: Operator; values: JqlValue[]; pos: number };

export interface JqlQuery {
  where: JqlNode | null;
  orderBy: Array<{ field: string; dir: 'asc' | 'desc' }>;
  /** Vị trí từng trường trong ORDER BY (song song với orderBy). */
  orderPos?: number[];
}

const upper = (s: string) => s.toUpperCase();

export function parseJql(src: string): JqlQuery {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const next = () => toks[p++];
  const isWord = (w: string) => peek().kind === 'word' && upper(peek().value) === w;
  const expect = (kind: TokKind, what: string) => {
    const t = next();
    if (t.kind !== kind) throw new JqlError(`Expected ${what}`, t.pos);
    return t;
  };

  function value(): JqlValue {
    const t = next();
    if (t.kind === 'string') return { kind: 'literal', value: t.value, quoted: true, pos: t.pos };
    if (t.kind !== 'word') throw new JqlError('Expected a value', t.pos);
    if (peek().kind === 'lparen') {
      next();
      const args: string[] = [];
      while (peek().kind !== 'rparen') {
        const a = next();
        if (a.kind !== 'word' && a.kind !== 'string') throw new JqlError('Expected a function argument', a.pos);
        args.push(a.value);
        if (peek().kind === 'comma') next();
      }
      next();
      return { kind: 'fn', name: t.value.toLowerCase(), args, pos: t.pos };
    }
    return { kind: 'literal', value: t.value, quoted: false, pos: t.pos };
  }

  function clause(): JqlNode {
    const f = next();
    if (f.kind !== 'word' && f.kind !== 'string') throw new JqlError('Expected a field name', f.pos);
    let op: Operator;
    if (isWord('IS')) {
      next();
      const negate = isWord('NOT') ? (next(), true) : false;
      const e = next();
      if (!(e.kind === 'word' && ['EMPTY', 'NULL'].includes(upper(e.value)))) throw new JqlError('Expected EMPTY', e.pos);
      return { kind: 'clause', field: f.value, op: negate ? 'is not empty' : 'is empty', values: [], pos: f.pos };
    }
    if (isWord('NOT')) {
      next();
      if (!isWord('IN')) throw new JqlError('Expected IN after NOT', peek().pos);
      next();
      op = 'not in';
    } else if (isWord('IN')) {
      next();
      op = 'in';
    } else {
      const o = next();
      if (o.kind !== 'op') throw new JqlError(`Expected an operator after "${f.value}"`, o.pos);
      op = o.value as Operator;
    }
    if (op === 'in' || op === 'not in') {
      expect('lparen', '"(" after IN');
      const values: JqlValue[] = [];
      while (peek().kind !== 'rparen') {
        values.push(value());
        if (peek().kind === 'comma') next();
        else if (peek().kind !== 'rparen') throw new JqlError('Expected "," or ")"', peek().pos);
      }
      next();
      if (!values.length) throw new JqlError('IN needs at least one value', f.pos);
      return { kind: 'clause', field: f.value, op, values, pos: f.pos };
    }
    return { kind: 'clause', field: f.value, op, values: [value()], pos: f.pos };
  }

  function atom(): JqlNode {
    if (isWord('NOT')) { next(); return { kind: 'not', child: atom() }; }
    if (peek().kind === 'lparen') {
      next();
      const n = orExpr();
      expect('rparen', '")"');
      return n;
    }
    return clause();
  }
  function andExpr(): JqlNode {
    const parts = [atom()];
    while (isWord('AND')) { next(); parts.push(atom()); }
    return parts.length === 1 ? parts[0] : { kind: 'and', children: parts };
  }
  function orExpr(): JqlNode {
    const parts = [andExpr()];
    while (isWord('OR')) { next(); parts.push(andExpr()); }
    return parts.length === 1 ? parts[0] : { kind: 'or', children: parts };
  }

  let where: JqlNode | null = null;
  if (peek().kind !== 'eof' && !isWord('ORDER')) where = orExpr();
  const orderBy: JqlQuery['orderBy'] = [];
  const orderPos: number[] = [];
  if (isWord('ORDER')) {
    next();
    if (!isWord('BY')) throw new JqlError('Expected BY after ORDER', peek().pos);
    next();
    do {
      const f = next();
      if (f.kind !== 'word' && f.kind !== 'string') throw new JqlError('Expected a field to order by', f.pos);
      let dir: 'asc' | 'desc' = 'asc';
      if (isWord('ASC')) next();
      else if (isWord('DESC')) { next(); dir = 'desc'; }
      orderBy.push({ field: f.value, dir });
      orderPos.push(f.pos);
    } while (peek().kind === 'comma' && next());
  }
  if (peek().kind !== 'eof') throw new JqlError(`Unexpected "${peek().value}"`, peek().pos);
  return { where, orderBy, orderPos };
}

// ─── Ngày tương đối ──────────────────────────────────────────────

/** "2026-09-01" · "-7d" · "2w" · startOfDay() · startOfWeek(-1) · now() … ⇒ Date. */
export function resolveDate(v: JqlValue, now = new Date()): Date {
  const day = 86_400_000;
  if (v.kind === 'fn') {
    const off = Number(v.args[0] ?? 0) || 0;
    const d = new Date(now);
    switch (v.name) {
      case 'now': return d;
      case 'startofday': d.setUTCHours(0, 0, 0, 0); return new Date(d.getTime() + off * day);
      case 'endofday': d.setUTCHours(23, 59, 59, 999); return new Date(d.getTime() + off * day);
      case 'startofweek': { d.setUTCHours(0, 0, 0, 0); const dow = (d.getUTCDay() + 6) % 7; return new Date(d.getTime() - dow * day + off * 7 * day); }
      case 'endofweek': { d.setUTCHours(23, 59, 59, 999); const dow = (d.getUTCDay() + 6) % 7; return new Date(d.getTime() + (6 - dow) * day + off * 7 * day); }
      case 'startofmonth': return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + off, 1));
      case 'endofmonth': return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + off + 1, 0, 23, 59, 59, 999));
      default: throw new JqlError(`Unknown date function ${v.name}()`, 0);
    }
  }
  const s = v.value.trim();
  const rel = /^([+-]?\d+)([dwhm])$/i.exec(s);
  if (rel) {
    const n = Number(rel[1]);
    const unit = rel[2].toLowerCase();
    const ms = unit === 'd' ? day : unit === 'w' ? 7 * day : unit === 'h' ? 3_600_000 : 60_000;
    return new Date(now.getTime() + n * ms);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00:00.000Z`);
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/.test(s)) return new Date(s.replace(' ', 'T') + (s.length === 16 ? ':00Z' : ''));
  throw new JqlError(`"${s}" is not a date (use 2026-09-01, -7d or startOfWeek())`, 0);
}

// ─── Dịch sang Prisma ────────────────────────────────────────────

export interface JqlContext {
  projectKey: string;
  userId: number;
  statuses: Array<{ id: number; name: string; category: string }>;
  types: Array<{ id: number; key: string; name: string }>;
  labels: Array<{ id: number; name: string }>;
  components: Array<{ id: number; name: string }>;
  members: Array<{ id: number; username: string }>;
  sprints: Array<{ id: number; name: string; state: string }>;
  customFields: Array<{ id: number; name: string; kind: string; options: Array<{ id: string; label: string }> }>;
  now?: Date;
  /** Tên dự án — `project = "Tên dự án"` cũng khớp. */
  projectName?: string;
  /**
   * Chế độ NHIỀU dự án: mọi khoá/tên dự án người gọi thấy được. Có mảng này
   * thì `project = X` mà X không nằm trong đó ⇒ lỗi kèm "did you mean".
   * Không có (chế độ một dự án) ⇒ `project = OTHER` chỉ khớp rỗng.
   */
  knownProjects?: string[];
  /**
   * Chế độ NHIỀU dự án: tên (trạng thái, loại, nhãn, người, sprint, trường…)
   * không có trong dự án NÀY thì khớp rỗng thay vì ném lỗi, và báo lại qua
   * đây — nơi gọi chỉ báo lỗi khi tên đó vắng mặt ở MỌI dự án.
   */
  onMissing?: (m: JqlMiss) => void;
}

/** Một tên không tra được trong dự án đang dịch (xem JqlContext.onMissing). */
export interface JqlMiss { pos: number; message: string; value: string; candidates: string[] }

/** Điều kiện không khớp thẻ nào (Prisma dịch `in: []` thành FALSE). */
const NONE: Prisma.WorkIssueWhereInput = { id: { in: [] } };

const PRIORITY_NAMES: Record<string, number> = { highest: 1, high: 2, medium: 3, low: 4, lowest: 5 };

type W = Prisma.WorkIssueWhereInput;

const FIELD_ALIASES: Record<string, string> = {
  issue: 'key', issuekey: 'key', key: 'key', id: 'key',
  summary: 'summary', title: 'summary',
  description: 'description', text: 'text',
  status: 'status', statuscategory: 'statuscategory', category: 'statuscategory',
  type: 'type', issuetype: 'type',
  priority: 'priority',
  assignee: 'assignee', reporter: 'reporter',
  label: 'labels', labels: 'labels',
  component: 'component', components: 'component',
  sprint: 'sprint',
  parent: 'parent', epic: 'parent', 'epic link': 'parent',
  points: 'points', storypoints: 'points', 'story points': 'points', estimate: 'points',
  created: 'created', createddate: 'created',
  updated: 'updated', updateddate: 'updated',
  due: 'due', duedate: 'due',
  resolved: 'resolved', resolutiondate: 'resolved',
  watcher: 'watcher', watchers: 'watcher',
  project: 'project',
};

/** Tên trường người dùng gõ ⇒ tên chuẩn (hoặc undefined nếu không phải trường có sẵn). */
export const normalizeField = (name: string): string | undefined => FIELD_ALIASES[name.trim().toLowerCase()];

/** Trường sắp xếp được (ORDER BY) — chung cho một dự án và nhiều dự án. */
export const ORDERABLE_FIELDS = ['key', 'rank', 'priority', 'created', 'updated', 'due', 'resolved', 'points', 'summary', 'status', 'assignee', 'project'] as const;

/**
 * Phạm vi dự án đọc được từ các mệnh đề `project` ở TẦNG NGOÀI CÙNG (nối bằng
 * AND). Dùng để bớt dự án phải quét và để biết dự án lưu trữ có được gọi tên
 * rõ không. OR/NOT thì không suy ra được gì ⇒ include = null (mọi dự án).
 */
export function projectScope(q: JqlQuery): { include: string[] | null; exclude: string[] } {
  const clauses = !q.where ? [] : q.where.kind === 'clause' ? [q.where] : q.where.kind === 'and' ? q.where.children : [];
  let include: string[] | null = null;
  const exclude: string[] = [];
  for (const c of clauses) {
    if (c.kind !== 'clause' || normalizeField(c.field) !== 'project') continue;
    const vals = c.values.filter((v) => v.kind === 'literal').map((v) => (v as { value: string }).value.toLowerCase());
    if (c.op === '=' || c.op === 'in') include = include === null ? vals : include.filter((x) => vals.includes(x));
    else if (c.op === '!=' || c.op === 'not in') exclude.push(...vals);
  }
  return { include, exclude };
}

export const JQL_FIELDS = [
  'key', 'summary', 'description', 'text', 'status', 'statusCategory', 'type', 'priority', 'assignee', 'reporter',
  'labels', 'component', 'sprint', 'parent', 'points', 'created', 'updated', 'due', 'resolved', 'watcher', 'project',
];
export const JQL_FUNCTIONS = ['currentUser()', 'openSprints()', 'closedSprints()', 'futureSprints()', 'now()', 'startOfDay()', 'startOfWeek()', 'startOfMonth()', 'endOfDay()', 'endOfWeek()', 'endOfMonth()'];

export function compileJql(q: JqlQuery, ctx: JqlContext): { where: W; orderBy: Prisma.WorkIssueOrderByWithRelationInput[] } {
  const lc = (s: string) => s.toLowerCase();
  const now = ctx.now ?? new Date();

  // suggestion gửi cho client ở dạng thay-thẳng-vào-truy-vấn (có nháy nếu cần).
  const fail = (msg: string, pos: number, suggestion?: string): never => { throw new JqlError(msg, pos, suggestion ? quoteIfNeeded(suggestion) : undefined); };
  // Lỗi về GIÁ TRỊ trỏ vào chính giá trị đó, không phải tên trường.
  const at = (v: JqlValue | undefined, pos: number) => v?.pos ?? pos;
  const lit = (v: JqlValue, pos: number): string => (v.kind === 'literal' ? v.value : fail(`${v.name}() is not allowed here`, at(v, pos)));
  const miss = (msg: string, v: JqlValue, pos: number, candidates: string[]): never => {
    const hit = v.kind === 'literal' ? suggest(v.value, candidates) : undefined;
    return fail(didYouMean(msg, hit), at(v, pos), hit);
  };
  // Chế độ nhiều dự án: ghi lại tên vắng mặt rồi cho khớp rỗng (true = đã ghi).
  const soft = (msg: string, v: JqlValue, pos: number, candidates: string[]): boolean => {
    if (!ctx.onMissing) return false;
    ctx.onMissing({ pos: at(v, pos), message: msg, value: v.kind === 'literal' ? v.value : v.name, candidates });
    return true;
  };

  const userIds = (vals: JqlValue[], pos: number): Array<number | null> => vals.map((v) => {
    if (v.kind === 'fn') return v.name === 'currentuser' ? ctx.userId : fail(`Unknown function ${v.name}()`, at(v, pos), suggest(v.name, ['currentUser']) && 'currentUser()');
    if (['empty', 'null', 'unassigned'].includes(lc(v.value))) return null;
    const u = ctx.members.find((m) => lc(m.username) === lc(v.value.replace(/^@/, '')));
    if (u) return u.id;
    // "me"/"myself" = currentUser() — sau khi đã thử tên thật (lỡ có người tên "me").
    if (!v.quoted && ['me', 'myself'].includes(lc(v.value))) return ctx.userId;
    if (soft(`No member "${v.value}"`, v, pos, ctx.members.map((m) => m.username))) return -1; // không ai có id -1
    return miss(`No member "${v.value}"`, v, pos, ctx.members.map((m) => m.username));
  });

  const nameIds = <T extends { id: number; name: string }>(list: T[], vals: JqlValue[], what: string, pos: number, extra?: (t: T) => string[]) =>
    vals.flatMap((v) => {
      const s = lc(lit(v, pos));
      const hits = list.filter((x) => lc(x.name) === s || (extra?.(x) ?? []).some((e) => lc(e) === s));
      if (hits.length) return hits.map((h) => h.id);
      if (soft(`No ${what} "${lit(v, pos)}"`, v, pos, list.map((x) => x.name))) return [];
      return miss(`No ${what} "${lit(v, pos)}"`, v, pos, list.map((x) => x.name));
    });

  /** Số thẻ; null = khoá của dự án KHÁC (chỉ ở chế độ nhiều dự án) ⇒ không khớp ở đây. */
  const issueNumber = (v: JqlValue, pos: number): number | null => {
    const s = lit(v, pos);
    const m = /^(?:([A-Za-z][A-Za-z0-9]*)-)?(\d+)$/.exec(s);
    if (m && m[1] && upper(m[1]) !== upper(ctx.projectKey) && soft(`"${s}" is not an issue key in any project you can see`, v, pos, ctx.knownProjects ?? [])) return null;
    if (!m || (m[1] && upper(m[1]) !== upper(ctx.projectKey))) fail(`"${s}" is not an issue key of ${ctx.projectKey}`, at(v, pos));
    return Number(m![2]);
  };
  const numbers = (vals: JqlValue[], pos: number) => vals.map((v) => issueNumber(v, pos)).filter((n): n is number => n !== null);

  const cmp = (op: Operator, v: number | Date): Prisma.IntFilter | Prisma.FloatFilter | Prisma.DateTimeFilter | number | Date => {
    switch (op) {
      case '=': return v as never;
      case '!=': return { not: v } as never;
      case '>': return { gt: v } as never;
      case '>=': return { gte: v } as never;
      case '<': return { lt: v } as never;
      case '<=': return { lte: v } as never;
      default: return v as never;
    }
  };

  const inOrNot = (op: Operator, pos: number) => {
    if (op === '=' || op === 'in') return false;
    if (op === '!=' || op === 'not in') return true;
    return fail(`Operator ${op} is not supported for this field`, pos);
  };

  function clause(c: Extract<JqlNode, { kind: 'clause' }>): W {
    const raw = lc(c.field.trim());
    const field = FIELD_ALIASES[raw];
    const { op, values, pos } = c;
    const empty = op === 'is empty';
    const notEmpty = op === 'is not empty';

    if (!field) {
      const cf = ctx.customFields.find((f) => lc(f.name) === raw || `cf[${f.id}]` === raw);
      if (!cf) {
        // Nhiều dự án: có thể là trường tuỳ chỉnh của dự án khác.
        if (soft(`Unknown field "${c.field}"`, { kind: 'literal', value: c.field, quoted: false, pos }, pos, [...JQL_FIELDS, ...ctx.customFields.map((f) => f.name)])) return NONE;
        const hit = suggest(c.field, [...JQL_FIELDS, ...Object.keys(FIELD_ALIASES).filter((k) => !k.includes(' ')), ...ctx.customFields.map((f) => f.name)]);
        return fail(didYouMean(`Unknown field "${c.field}"`, hit), pos, hit);
      }
      if (empty) return { customValues: { none: { fieldId: cf.id } } };
      if (notEmpty) return { customValues: { some: { fieldId: cf.id } } };
      const texts = values.map((v) => lit(v, pos));
      if (cf.kind === 'NUMBER') {
        const n = Number(texts[0]);
        if (!Number.isFinite(n)) return fail(`"${texts[0]}" is not a number`, at(values[0], pos));
        const pathFilter: Prisma.JsonFilter<'WorkCustomValue'> = op === '=' ? { equals: n } : op === '>' ? { gt: n } : op === '>=' ? { gte: n } : op === '<' ? { lt: n } : op === '<=' ? { lte: n } : fail(`Operator ${op} is not supported for numbers`, pos);
        return { customValues: { some: { fieldId: cf.id, value: pathFilter } } };
      }
      if (cf.kind === 'SELECT' || cf.kind === 'MULTISELECT') {
        const optIds = texts.map((t, i) => cf.options.find((o) => lc(o.label) === lc(t))?.id
          ?? (soft(`"${t}" is not an option of ${cf.name}`, values[i], pos, cf.options.map((o) => o.label)) ? '\u0000none' : undefined)
          ?? miss(`"${t}" is not an option of ${cf.name}`, values[i], pos, cf.options.map((o) => o.label)));
        const matches: W = cf.kind === 'SELECT'
          ? { customValues: { some: { fieldId: cf.id, OR: optIds.map((id) => ({ value: { equals: id } })) } } }
          : { customValues: { some: { fieldId: cf.id, OR: optIds.map((id) => ({ value: { array_contains: [id] } })) } } };
        return inOrNot(op, pos) ? { NOT: matches } : matches;
      }
      if (op === '~' || op === '!~') {
        const m: W = { customValues: { some: { fieldId: cf.id, value: { string_contains: texts[0] } } } };
        return op === '!~' ? { NOT: m } : m;
      }
      const m: W = { customValues: { some: { fieldId: cf.id, OR: texts.map((t) => ({ value: { equals: cf.kind === 'CHECKBOX' ? ['true', 'yes', '1'].includes(lc(t)) : t } })) } } };
      return inOrNot(op, pos) ? { NOT: m } : m;
    }

    switch (field) {
      case 'key': {
        if (['>', '>=', '<', '<='].includes(op)) {
          const n = issueNumber(values[0], pos);
          return n === null ? NONE : { number: cmp(op, n) as Prisma.IntFilter };
        }
        const nums = numbers(values, pos);
        return inOrNot(op, pos) ? { number: { notIn: nums } } : { number: { in: nums } };
      }
      case 'summary':
      case 'description':
      case 'text': {
        if (op !== '~' && op !== '!~' && op !== '=' && op !== '!=') return fail(`Use ~ to search text`, pos);
        const t = lit(values[0], pos);
        const contains = { contains: t, mode: 'insensitive' as const };
        const m: W = field === 'summary' ? { title: op === '=' || op === '!=' ? { equals: t, mode: 'insensitive' } : contains }
          : field === 'description' ? { descriptionText: contains }
            : { OR: [{ title: contains }, { descriptionText: contains }] };
        return op.startsWith('!') ? { NOT: m } : m;
      }
      case 'status': {
        const ids = nameIds(ctx.statuses, values, 'status', pos);
        return inOrNot(op, pos) ? { statusId: { notIn: ids } } : { statusId: { in: ids } };
      }
      case 'statuscategory': {
        const cats = values.map((v) => {
          const s = lc(lit(v, pos)).replace(/[\s_-]/g, '');
          const cat = s === 'todo' || s === 'new' ? 'TODO' : s === 'inprogress' ? 'IN_PROGRESS' : s === 'done' || s === 'complete' ? 'DONE' : null;
          return cat ?? fail(`statusCategory is "To Do", "In Progress" or "Done"`, at(v, pos), suggest(lit(v, pos), ['To Do', 'In Progress', 'Done']));
        });
        const ids = ctx.statuses.filter((s) => (cats as string[]).includes(s.category)).map((s) => s.id);
        return inOrNot(op, pos) ? { statusId: { notIn: ids } } : { statusId: { in: ids } };
      }
      case 'type': {
        const ids = nameIds(ctx.types, values, 'issue type', pos, (t) => [t.key]);
        return inOrNot(op, pos) ? { typeId: { notIn: ids } } : { typeId: { in: ids } };
      }
      case 'priority': {
        const toN = (v: JqlValue) => {
          const s = lc(lit(v, pos));
          const n = PRIORITY_NAMES[s] ?? Number(s);
          return n >= 1 && n <= 5 ? n : miss(`Priority is Highest, High, Medium, Low, Lowest or 1–5`, v, pos, ['Highest', 'High', 'Medium', 'Low', 'Lowest']);
        };
        // Jira: "priority > High" nghĩa là QUAN TRỌNG hơn High ⇒ số NHỎ hơn.
        if (['>', '>=', '<', '<='].includes(op)) {
          const flip: Record<string, Operator> = { '>': '<', '>=': '<=', '<': '>', '<=': '>=' };
          return { priority: cmp(flip[op], toN(values[0])) as Prisma.IntFilter };
        }
        const ns = values.map(toN);
        return inOrNot(op, pos) ? { priority: { notIn: ns } } : { priority: { in: ns } };
      }
      case 'assignee':
      case 'reporter': {
        const col = field === 'assignee' ? 'assigneeId' : 'reporterId';
        if (empty) return { [col]: null };
        if (notEmpty) return { [col]: { not: null } };
        const ids = userIds(values, pos);
        const real = ids.filter((x): x is number => x !== null);
        const withNull = ids.includes(null);
        const m: W = { OR: [...(real.length ? [{ [col]: { in: real } }] : []), ...(withNull ? [{ [col]: null }] : [])] };
        return inOrNot(op, pos) ? { NOT: m } : m;
      }
      case 'labels': {
        if (empty) return { labels: { none: {} } };
        if (notEmpty) return { labels: { some: {} } };
        const ids = nameIds(ctx.labels, values, 'label', pos);
        return inOrNot(op, pos) ? { labels: { none: { labelId: { in: ids } } } } : { labels: { some: { labelId: { in: ids } } } };
      }
      case 'component': {
        if (empty) return { components: { none: {} } };
        if (notEmpty) return { components: { some: {} } };
        const ids = nameIds(ctx.components, values, 'component', pos);
        return inOrNot(op, pos) ? { components: { none: { componentId: { in: ids } } } } : { components: { some: { componentId: { in: ids } } } };
      }
      case 'sprint': {
        if (empty) return { sprintId: null };
        if (notEmpty) return { sprintId: { not: null } };
        const ids = values.flatMap((v) => {
          if (v.kind === 'fn') {
            const state = v.name === 'opensprints' ? 'ACTIVE' : v.name === 'closedsprints' ? 'CLOSED' : v.name === 'futuresprints' ? 'PLANNED' : fail(`Unknown function ${v.name}()`, at(v, pos));
            return ctx.sprints.filter((s) => s.state === state).map((s) => s.id);
          }
          return nameIds(ctx.sprints, [v], 'sprint', pos);
        });
        return inOrNot(op, pos) ? { OR: [{ sprintId: null }, { sprintId: { notIn: ids } }] } : { sprintId: { in: ids } };
      }
      case 'parent': {
        if (empty) return { parentId: null };
        if (notEmpty) return { parentId: { not: null } };
        const nums = numbers(values, pos);
        const m: W = { parent: { number: { in: nums } } };
        return inOrNot(op, pos) ? { NOT: m } : m;
      }
      case 'points': {
        if (empty) return { storyPoints: null };
        if (notEmpty) return { storyPoints: { not: null } };
        const n = Number(lit(values[0], pos));
        if (!Number.isFinite(n)) return fail('Points must be a number', at(values[0], pos));
        if (op === 'in' || op === 'not in') {
          const ns = values.map((v) => Number(lit(v, pos)));
          return op === 'in' ? { storyPoints: { in: ns } } : { storyPoints: { notIn: ns } };
        }
        return { storyPoints: cmp(op, n) as Prisma.FloatFilter };
      }
      case 'created':
      case 'updated':
      case 'due':
      case 'resolved': {
        const col = field === 'created' ? 'createdAt' : field === 'updated' ? 'updatedAt' : field === 'due' ? 'dueDate' : 'resolvedAt';
        if (empty) return { [col]: null };
        if (notEmpty) return { [col]: { not: null } };
        if (!['=', '!=', '>', '>=', '<', '<='].includes(op)) return fail(`Use =, <, <=, >, >= with dates`, pos);
        let d: Date;
        try { d = resolveDate(values[0], now); } catch (e) { return fail((e as Error).message, at(values[0], pos)); }
        if (op === '=') {
          // "= 2026-09-01" nghĩa là cả ngày đó.
          const end = new Date(d.getTime() + 86_400_000);
          return { [col]: { gte: d, lt: end } };
        }
        return { [col]: cmp(op, d) };
      }
      case 'project': {
        // Một lần dịch = một dự án ⇒ mệnh đề này hoặc khớp hết, hoặc không khớp gì.
        if (empty) return NONE;
        if (notEmpty) return {};
        const mine = [ctx.projectKey, ctx.projectName ?? ''].filter(Boolean).map(lc);
        const hits = values.map((v) => {
          const s = lc(lit(v, pos));
          if (ctx.knownProjects && !ctx.knownProjects.some((k) => lc(k) === s)) miss(`No project "${lit(v, pos)}"`, v, pos, ctx.knownProjects);
          return mine.includes(s);
        });
        return hits.some(Boolean) !== inOrNot(op, pos) ? {} : NONE;
      }
      case 'watcher': {
        const ids = userIds(values, pos).filter((x): x is number => x !== null);
        const m: W = { watchers: { some: { userId: { in: ids } } } };
        return inOrNot(op, pos) ? { NOT: m } : m;
      }
      default:
        return fail(`Unknown field "${c.field}"`, pos, suggest(c.field, JQL_FIELDS));
    }
  }

  function walk(n: JqlNode): W {
    switch (n.kind) {
      case 'and': return { AND: n.children.map(walk) };
      case 'or': return { OR: n.children.map(walk) };
      case 'not': return { NOT: walk(n.child) };
      case 'clause': return clause(n);
    }
  }

  const ORDERABLE: Record<string, (dir: 'asc' | 'desc') => Prisma.WorkIssueOrderByWithRelationInput> = {
    key: (dir) => ({ number: dir }),
    rank: (dir) => ({ rank: dir }),
    priority: (dir) => ({ priority: dir }),
    created: (dir) => ({ createdAt: dir }),
    updated: (dir) => ({ updatedAt: dir }),
    due: (dir) => ({ dueDate: { sort: dir, nulls: 'last' } }),
    resolved: (dir) => ({ resolvedAt: { sort: dir, nulls: 'last' } }),
    points: (dir) => ({ storyPoints: { sort: dir, nulls: 'last' } }),
    summary: (dir) => ({ title: dir }),
    status: (dir) => ({ statusId: dir }),
    assignee: (dir) => ({ assignee: { username: dir } }),
    project: (dir) => ({ projectId: dir }),
  };
  const orderBy = q.orderBy.map((o, i) => {
    const f = FIELD_ALIASES[lc(o.field)] ?? lc(o.field);
    const fn = ORDERABLE[f];
    if (fn) return fn(o.dir);
    const hit = suggest(o.field, Object.keys(ORDERABLE));
    return fail(didYouMean(`Cannot order by "${o.field}"`, hit), q.orderPos?.[i] ?? 0, hit);
  });

  return { where: q.where ? walk(q.where) : {}, orderBy: [...orderBy, { rank: 'asc' }, { id: 'asc' }] };
}
