/**
 * CT Work — tiện ích JQL phía giao diện: gợi ý khi gõ, đổi bộ lọc cơ bản
 * sang JQL, đọc lỗi cú pháp (kèm vị trí) từ backend.
 *
 * Danh sách trường/hàm phải khớp src/services/work/jql.ts (FIELD_ALIASES,
 * JQL_FUNCTIONS, ORDERABLE) — đổi bên kia thì đổi ở đây.
 */

import type { ProjectConfig } from '@/lib/work-api';
import { wt } from '@/components/work/i18n';

export const JQL_FIELDS: Array<{ name: string; readonly hint: string }> = [
  { name: 'project', get hint() { return wt('jql.h1'); } },
  { name: 'status', get hint() { return wt('jql.h2'); } },
  { name: 'statusCategory', get hint() { return wt('jql.h3'); } },
  { name: 'assignee', get hint() { return wt('jql.h4'); } },
  { name: 'reporter', get hint() { return wt('jql.h5'); } },
  { name: 'type', get hint() { return wt('jql.h6'); } },
  { name: 'priority', get hint() { return wt('jql.h7'); } },
  { name: 'labels', get hint() { return wt('jql.h8'); } },
  { name: 'component', get hint() { return wt('jql.h9'); } },
  { name: 'sprint', get hint() { return wt('jql.h10'); } },
  { name: 'parent', get hint() { return wt('jql.h11'); } },
  { name: 'points', get hint() { return wt('jql.h12'); } },
  { name: 'summary', get hint() { return wt('jql.h13'); } },
  { name: 'description', get hint() { return wt('jql.h14'); } },
  { name: 'text', get hint() { return wt('jql.h15'); } },
  { name: 'comment', get hint() { return wt('jql.h16'); } },
  { name: 'key', get hint() { return wt('jql.h17'); } },
  { name: 'created', get hint() { return wt('jql.h18'); } },
  { name: 'updated', get hint() { return wt('jql.h18'); } },
  { name: 'due', get hint() { return wt('jql.h18'); } },
  { name: 'resolved', get hint() { return wt('jql.h18'); } },
  { name: 'watcher', get hint() { return wt('jql.h5'); } },
  // CTW-5 / CTW-11.
  { name: 'fixVersion', get hint() { return wt('jql.h19'); } },
  { name: 'flagged', get hint() { return wt('jql.h20'); } },
  // CTW-28: người hay AI agent.
  { name: 'assigneeKind', get hint() { return wt('jql.h21'); } },
];

export const JQL_OPERATORS: Array<{ op: string; hint: string }> = [
  { op: '=', get hint() { return wt('jql.h22'); } },
  { op: '!=', get hint() { return wt('jql.h23'); } },
  { op: 'IN ()', get hint() { return wt('jql.h24'); } },
  { op: 'NOT IN ()', get hint() { return wt('jql.h25'); } },
  { op: '~', get hint() { return wt('jql.h26'); } },
  { op: '!~', get hint() { return wt('jql.h27'); } },
  { op: '>  >=  <  <=', get hint() { return wt('jql.h28'); } },
  { op: 'IS EMPTY', get hint() { return wt('jql.h29'); } },
  { op: 'IS NOT EMPTY', get hint() { return wt('jql.h30'); } },
];

export const JQL_FUNCTIONS = ['currentUser()', 'agents()', 'people()', 'openSprints()', 'closedSprints()', 'futureSprints()', 'releasedVersions()', 'unreleasedVersions()', 'now()', 'startOfDay()', 'startOfWeek()', 'startOfMonth()', 'endOfDay()', 'endOfWeek()', 'endOfMonth()'];

export const JQL_EXAMPLES: Array<{ q: string; hint: string }> = [
  { q: 'assignee = currentUser() AND statusCategory != Done', get hint() { return wt('jql.h31'); } },
  { q: 'sprint IN openSprints() ORDER BY priority', get hint() { return wt('jql.h32'); } },
  { q: 'created >= -7d ORDER BY created DESC', get hint() { return wt('jql.h33'); } },
  { q: 'due < now() AND statusCategory != Done', get hint() { return wt('jql.h34'); } },
  { q: 'summary ~ "login" OR description ~ "login"', get hint() { return wt('jql.h35'); } },
  { q: 'assignee IS EMPTY AND priority >= High', get hint() { return wt('jql.h36'); } },
  { q: 'assigneeKind = AGENT AND statusCategory != Done', get hint() { return wt('jql.h37'); } },
];

const ORDERABLE = ['key', 'rank', 'priority', 'created', 'updated', 'due', 'resolved', 'points', 'summary', 'status', 'assignee'];

/** Tên có khoảng trắng/ký tự lạ thì phải bọc nháy. */
export function quote(v: string): string {
  return /^[\p{L}\p{N}_\-.:/@]+$/u.test(v) ? v : `"${v.replace(/(["\\])/g, '\\$1')}"`;
}

/** Lỗi JQL từ backend: 400 + code WORK_JQL_ERROR + data.position. */
export function jqlErrorOf(err: unknown): { message: string; position: number } | null {
  const r = (err as { response?: { status?: number; data?: { code?: string; message?: string; data?: { position?: number } } } })?.response;
  if (r?.status !== 400 || r.data?.code !== 'WORK_JQL_ERROR') return null;
  return { message: r.data.message ?? wt('jql.invalid'), position: Number(r.data.data?.position ?? 0) };
}


/** Link tới danh sách thẻ ở chế độ JQL. */
export function jqlListUrl(slug: string, key: string, jql: string): string {
  return `/work/${slug}/${key}/list?${new URLSearchParams({ mode: 'jql', jql })}`;
}

// ─── Gợi ý khi gõ ────────────────────────────────────────────────

export interface Suggestion { label: string; insert: string; hint?: string }

type Tok = { kind: 'word' | 'string' | 'op' | 'lparen' | 'rparen' | 'comma'; value: string };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  const re = /\s*(?:("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(!~|!=|>=|<=|=|>|<|~)|(\()|(\))|(,)|([\p{L}\p{N}_\-.:/+@]+))/uy;
  let m: RegExpExecArray | null;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1] !== undefined) out.push({ kind: 'string', value: m[1].slice(1, -1) });
    else if (m[2]) out.push({ kind: 'op', value: m[2] });
    else if (m[3]) out.push({ kind: 'lparen', value: '(' });
    else if (m[4]) out.push({ kind: 'rparen', value: ')' });
    else if (m[5]) out.push({ kind: 'comma', value: ',' });
    else if (m[6]) out.push({ kind: 'word', value: m[6] });
    else break;
  }
  return out;
}

const up = (s: string) => s.toUpperCase();

/** Cấu hình cho gợi ý: tìm toàn cục thêm danh sách mã dự án. */
export type JqlSuggestConfig = ProjectConfig & { projectKeys?: string[] };

function valuesFor(field: string, cfg: JqlSuggestConfig): Suggestion[] {
  const f = field.toLowerCase();
  const uniq = (xs: string[]) => [...new Set(xs)];
  const lit = (xs: string[], hint?: string) => xs.map((x) => ({ label: x, insert: quote(x), hint }));
  const fn = (xs: string[]) => xs.map((x) => ({ label: x, insert: x, hint: wt('jql.function') }));
  switch (f) {
    case 'project': return lit(uniq(cfg.projectKeys ?? (cfg.key ? [cfg.key] : [])), wt('common.project'));
    case 'status': return lit(uniq(cfg.workflows.flatMap((w) => w.statuses.map((s) => s.name))));
    case 'statuscategory': case 'category': return lit(['To Do', 'In Progress', 'Done']);
    case 'type': case 'issuetype': return lit(cfg.issueTypes.map((t) => t.name));
    case 'priority': return lit(['Highest', 'High', 'Medium', 'Low', 'Lowest']);
    case 'assignee': case 'reporter': case 'watcher': case 'watchers':
      return [...fn(['currentUser()', ...(f === 'assignee' || f === 'reporter' ? ['agents()', 'people()'] : [])]), ...(f === 'assignee' ? [{ label: 'EMPTY', insert: 'EMPTY' }] : []),
        ...cfg.members.map((m) => ({ label: m.username, insert: quote(m.username), hint: m.kind === 'AGENT' ? `🤖 ${m.displayName || m.fullName || wt('jql.aiAgent')}` : m.displayName || m.fullName || undefined }))];
    case 'assigneekind': case 'assignee kind': case 'assigneetype': return [...lit(['AGENT', 'HUMAN']), { label: 'EMPTY', insert: 'EMPTY' }];
    case 'labels': case 'label': return lit(cfg.labels.map((l) => l.name));
    case 'component': case 'components': return lit(cfg.components.map((c) => c.name));
    case 'sprint': return [...fn(['openSprints()', 'closedSprints()', 'futureSprints()']), ...lit(cfg.sprints.map((s) => s.name))];
    case 'fixversion': case 'fixversions': case 'version': case 'release':
      return [...fn(['unreleasedVersions()', 'releasedVersions()']), { label: 'EMPTY', insert: 'EMPTY' }, ...lit(uniq((cfg.versions ?? []).map((v) => v.name)), wt('jql.version'))];
    case 'flagged': case 'flag': case 'blocked': return lit(['true', 'false']);
    case 'created': case 'updated': case 'due': case 'duedate': case 'resolved':
      return [...lit(['-1d', '-7d', '-30d']), ...fn(['now()', 'startOfDay()', 'startOfWeek()', 'startOfMonth()', 'endOfWeek()', 'endOfMonth()'])];
    default: {
      const cf = cfg.customFields.find((x) => x.name.toLowerCase() === f);
      if (cf && (cf.kind === 'SELECT' || cf.kind === 'MULTISELECT')) return lit(cf.options.map((o) => o.label));
      if (cf?.kind === 'CHECKBOX') return lit(['true', 'false']);
      return [];
    }
  }
}

/**
 * Gợi ý cho vị trí con trỏ. `from` = chỗ bắt đầu từ đang gõ (thay thế
 * đoạn [from, caret) bằng `insert`).
 */
export function suggest(text: string, caret: number, cfg: JqlSuggestConfig): { from: number; items: Suggestion[] } {
  const pre = text.slice(0, caret);
  // Đang trong chuỗi nháy thì không gợi ý.
  if (((pre.match(/"/g) ?? []).length % 2) === 1) return { from: caret, items: [] };
  const partial = /[\p{L}\p{N}_\-.:/+@]*$/u.exec(pre)?.[0] ?? '';
  const from = caret - partial.length;
  const toks = tokenize(pre.slice(0, from));
  const last = toks[toks.length - 1];
  const prev = toks[toks.length - 2];
  const isKw = (t: Tok | undefined, ...kw: string[]) => !!t && t.kind === 'word' && kw.includes(up(t.value));

  const fields = (): Suggestion[] => [
    ...JQL_FIELDS.map((x) => ({ label: x.name, insert: x.name, hint: x.hint })),
    ...cfg.customFields.map((c) => ({ label: c.name, insert: quote(c.name), hint: wt('jql.custom', { k: c.kind.toLowerCase() }) })),
    { label: 'ORDER BY', insert: 'ORDER BY', hint: wt('jql.sortResults') },
    { label: 'NOT', insert: 'NOT', hint: wt('jql.negate') },
  ];

  let items: Suggestion[] = [];
  let fieldStart = !last || isKw(last, 'AND', 'OR', 'NOT') || last.kind === 'lparen';
  // "(" ngay sau IN là mở danh sách giá trị, không phải nhóm điều kiện.
  if (last?.kind === 'lparen' && isKw(prev, 'IN')) fieldStart = false;

  if (isKw(last, 'ORDER')) items = [{ label: 'BY', insert: 'BY' }];
  else if (isKw(last, 'BY') || (last?.kind === 'comma' && toks.some((t) => isKw(t, 'BY')))) {
    items = ORDERABLE.map((f) => ({ label: f, insert: f }));
  } else if (toks.some((t) => isKw(t, 'BY')) && last?.kind === 'word' && !isKw(last, 'ASC', 'DESC')) {
    items = [{ label: 'ASC', insert: 'ASC' }, { label: 'DESC', insert: 'DESC' }];
  } else if (fieldStart) {
    items = fields();
  } else if (isKw(last, 'IS')) {
    items = [{ label: 'EMPTY', insert: 'EMPTY' }, { label: 'NOT EMPTY', insert: 'NOT EMPTY' }];
  } else if (last?.kind === 'op' || (last?.kind === 'lparen' && isKw(prev, 'IN')) || last?.kind === 'comma') {
    // Tìm tên trường: lùi về trước toán tử / IN / NOT IN.
    let i = toks.length - 1;
    if (last.kind !== 'op') {
      while (i >= 0 && !isKw(toks[i], 'IN')) i--;
      i -= 1;
      if (isKw(toks[i], 'NOT')) i -= 1;
    } else i -= 1;
    const f = toks[i];
    if (f && (f.kind === 'word' || f.kind === 'string')) items = valuesFor(f.value, cfg);
  } else if (last && (last.kind === 'word' || last.kind === 'string') && (!prev || isKw(prev, 'AND', 'OR', 'NOT') || prev.kind === 'lparen')) {
    // Vừa gõ xong tên trường ⇒ gợi ý toán tử.
    items = ['=', '!=', 'IN', 'NOT IN', '~', 'IS EMPTY', 'IS NOT EMPTY', '>=', '<=', '>', '<', '!~'].map((o) => ({ label: o, insert: o }));
  } else if (last && (last.kind === 'word' || last.kind === 'string' || last.kind === 'rparen')) {
    items = [{ label: 'AND', insert: 'AND' }, { label: 'OR', insert: 'OR' }, { label: 'ORDER BY', insert: 'ORDER BY' }];
  }

  const p = partial.toLowerCase().replace(/^"/, '');
  if (p) {
    items = items
      .filter((s) => s.label.toLowerCase().includes(p))
      .sort((a, b) => Number(!a.label.toLowerCase().startsWith(p)) - Number(!b.label.toLowerCase().startsWith(p)));
    // Gõ đúng hết rồi thì thôi không gợi ý nữa.
    if (items.length === 1 && items[0].label.toLowerCase() === p) items = [];
  }
  return { from, items: items.slice(0, 10) };
}

// ─── Bộ lọc cơ bản ⇒ JQL ─────────────────────────────────────────

export function basicToJql(input: {
  q: string; typeNames: string[]; statusNames: string[]; assignees: Array<'me' | 'none' | string>; labelNames: string[]; includeDone: boolean;
}): string {
  const parts: string[] = [];
  const list = (field: string, xs: string[]) => {
    if (!xs.length) return;
    parts.push(xs.length === 1 ? `${field} = ${xs[0]}` : `${field} IN (${xs.join(', ')})`);
  };
  list('type', input.typeNames.map(quote));
  list('status', input.statusNames.map(quote));
  if (!input.statusNames.length && !input.includeDone) parts.push('statusCategory != Done');
  list('assignee', input.assignees.map((a) => (a === 'me' ? 'currentUser()' : a === 'none' ? 'EMPTY' : quote(a))));
  list('labels', input.labelNames.map(quote));
  if (input.q) parts.push(`summary ~ "${input.q.replace(/(["\\])/g, '\\$1')}"`);
  return parts.join(' AND ');
}
