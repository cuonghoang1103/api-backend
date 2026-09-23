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
  constructor(message: string, public pos: number) {
    super(message);
    this.name = 'JqlError';
  }
}

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

export type JqlValue = { kind: 'literal'; value: string; quoted: boolean } | { kind: 'fn'; name: string; args: string[] };
export type Operator = '=' | '!=' | '>' | '>=' | '<' | '<=' | '~' | '!~' | 'in' | 'not in' | 'is empty' | 'is not empty';

export type JqlNode =
  | { kind: 'and' | 'or'; children: JqlNode[] }
  | { kind: 'not'; child: JqlNode }
  | { kind: 'clause'; field: string; op: Operator; values: JqlValue[]; pos: number };

export interface JqlQuery { where: JqlNode | null; orderBy: Array<{ field: string; dir: 'asc' | 'desc' }> }

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
    if (t.kind === 'string') return { kind: 'literal', value: t.value, quoted: true };
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
      return { kind: 'fn', name: t.value.toLowerCase(), args };
    }
    return { kind: 'literal', value: t.value, quoted: false };
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
    } while (peek().kind === 'comma' && next());
  }
  if (peek().kind !== 'eof') throw new JqlError(`Unexpected "${peek().value}"`, peek().pos);
  return { where, orderBy };
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
}

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
};

export const JQL_FIELDS = [
  'key', 'summary', 'description', 'text', 'status', 'statusCategory', 'type', 'priority', 'assignee', 'reporter',
  'labels', 'component', 'sprint', 'parent', 'points', 'created', 'updated', 'due', 'resolved', 'watcher',
];
export const JQL_FUNCTIONS = ['currentUser()', 'openSprints()', 'closedSprints()', 'futureSprints()', 'now()', 'startOfDay()', 'startOfWeek()', 'startOfMonth()', 'endOfDay()', 'endOfWeek()', 'endOfMonth()'];

export function compileJql(q: JqlQuery, ctx: JqlContext): { where: W; orderBy: Prisma.WorkIssueOrderByWithRelationInput[] } {
  const lc = (s: string) => s.toLowerCase();
  const now = ctx.now ?? new Date();

  const fail = (msg: string, pos: number): never => { throw new JqlError(msg, pos); };
  const lit = (v: JqlValue, pos: number): string => (v.kind === 'literal' ? v.value : fail(`${v.name}() is not allowed here`, pos));

  const userIds = (vals: JqlValue[], pos: number): Array<number | null> => vals.map((v) => {
    if (v.kind === 'fn') return v.name === 'currentuser' ? ctx.userId : fail(`Unknown function ${v.name}()`, pos);
    if (['empty', 'null', 'unassigned'].includes(lc(v.value))) return null;
    const u = ctx.members.find((m) => lc(m.username) === lc(v.value.replace(/^@/, '')));
    return u ? u.id : fail(`No member "${v.value}"`, pos);
  });

  const nameIds = <T extends { id: number; name: string }>(list: T[], vals: JqlValue[], what: string, pos: number, extra?: (t: T) => string[]) =>
    vals.flatMap((v) => {
      const s = lc(lit(v, pos));
      const hits = list.filter((x) => lc(x.name) === s || (extra?.(x) ?? []).some((e) => lc(e) === s));
      return hits.length ? hits.map((h) => h.id) : fail(`No ${what} "${lit(v, pos)}"`, pos);
    });

  const issueNumber = (v: JqlValue, pos: number) => {
    const s = lit(v, pos);
    const m = /^(?:([A-Za-z][A-Za-z0-9]*)-)?(\d+)$/.exec(s);
    if (!m || (m[1] && upper(m[1]) !== upper(ctx.projectKey))) fail(`"${s}" is not an issue key of ${ctx.projectKey}`, pos);
    return Number(m![2]);
  };

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
      if (!cf) return fail(`Unknown field "${c.field}"`, pos);
      if (empty) return { customValues: { none: { fieldId: cf.id } } };
      if (notEmpty) return { customValues: { some: { fieldId: cf.id } } };
      const texts = values.map((v) => lit(v, pos));
      if (cf.kind === 'NUMBER') {
        const n = Number(texts[0]);
        if (!Number.isFinite(n)) return fail(`"${texts[0]}" is not a number`, pos);
        const pathFilter: Prisma.JsonFilter<'WorkCustomValue'> = op === '=' ? { equals: n } : op === '>' ? { gt: n } : op === '>=' ? { gte: n } : op === '<' ? { lt: n } : op === '<=' ? { lte: n } : fail(`Operator ${op} is not supported for numbers`, pos);
        return { customValues: { some: { fieldId: cf.id, value: pathFilter } } };
      }
      if (cf.kind === 'SELECT' || cf.kind === 'MULTISELECT') {
        const optIds = texts.map((t) => cf.options.find((o) => lc(o.label) === lc(t))?.id ?? fail(`"${t}" is not an option of ${cf.name}`, pos));
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
        if (['>', '>=', '<', '<='].includes(op)) return { number: cmp(op, issueNumber(values[0], pos)) as Prisma.IntFilter };
        const nums = values.map((v) => issueNumber(v, pos));
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
          return cat ?? fail(`statusCategory is "To Do", "In Progress" or "Done"`, pos);
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
          return n >= 1 && n <= 5 ? n : fail(`Priority is Highest, High, Medium, Low, Lowest or 1–5`, pos);
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
            const state = v.name === 'opensprints' ? 'ACTIVE' : v.name === 'closedsprints' ? 'CLOSED' : v.name === 'futuresprints' ? 'PLANNED' : fail(`Unknown function ${v.name}()`, pos);
            return ctx.sprints.filter((s) => s.state === state).map((s) => s.id);
          }
          return nameIds(ctx.sprints, [v], 'sprint', pos);
        });
        return inOrNot(op, pos) ? { OR: [{ sprintId: null }, { sprintId: { notIn: ids } }] } : { sprintId: { in: ids } };
      }
      case 'parent': {
        if (empty) return { parentId: null };
        if (notEmpty) return { parentId: { not: null } };
        const nums = values.map((v) => issueNumber(v, pos));
        const m: W = { parent: { number: { in: nums } } };
        return inOrNot(op, pos) ? { NOT: m } : m;
      }
      case 'points': {
        if (empty) return { storyPoints: null };
        if (notEmpty) return { storyPoints: { not: null } };
        const n = Number(lit(values[0], pos));
        if (!Number.isFinite(n)) return fail('Points must be a number', pos);
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
        try { d = resolveDate(values[0], now); } catch (e) { return fail((e as Error).message, pos); }
        if (op === '=') {
          // "= 2026-09-01" nghĩa là cả ngày đó.
          const end = new Date(d.getTime() + 86_400_000);
          return { [col]: { gte: d, lt: end } };
        }
        return { [col]: cmp(op, d) };
      }
      case 'watcher': {
        const ids = userIds(values, pos).filter((x): x is number => x !== null);
        const m: W = { watchers: { some: { userId: { in: ids } } } };
        return inOrNot(op, pos) ? { NOT: m } : m;
      }
      default:
        return fail(`Unknown field "${c.field}"`, pos);
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
  };
  const orderBy = q.orderBy.map((o) => {
    const f = FIELD_ALIASES[lc(o.field)] ?? lc(o.field);
    const fn = ORDERABLE[f];
    return fn ? fn(o.dir) : fail(`Cannot order by "${o.field}"`, 0);
  });

  return { where: q.where ? walk(q.where) : {}, orderBy: [...orderBy, { rank: 'asc' }, { id: 'asc' }] };
}
