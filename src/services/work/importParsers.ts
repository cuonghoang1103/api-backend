/**
 * CT Work — CTW đợt 7b (C15 Import): bộ ĐỌC tệp xuất của công cụ khác ⇒ một dạng chung `ImportItem` (hàm thuần, không DB).
 *
 *   Trello  — JSON "Export as JSON" của bảng: thẻ (bỏ thẻ đã lưu trữ), cột ⇒ trạng thái, nhãn, thành viên (Trello KHÔNG
 *             xuất email ⇒ khớp theo tên ở bước "người"), bình luận (actions commentCard), checklist ⇒ việc con, hạn/bắt đầu,
 *             ngày tạo đọc từ 8 ký tự đầu của id (giây Unix).
 *   Asana   — CSV "Export → CSV" (Task ID, Name, Section/Column, Assignee, Assignee Email, Due Date, Tags, Notes, Parent task,
 *             Completed At…) hoặc JSON của API ({ data: [task] }, subtasks lồng, stories = bình luận).
 *   Jira    — CSV "Export → CSV (all fields)": cột lặp (Labels, Comment, Sprint) gộp; bình luận Jira dạng
 *             "23/Sep/26 10:00 AM;<accountId>;<chữ>"; Sub-task + Parent id ⇒ việc con.
 *   CSV/Excel chung — hàng đầu là tiêu đề; người dùng ghép cột ⇒ trường (gợi ý tự động theo tên cột, Anh + Việt).
 *
 * Mỗi mục có `externalId` ổn định để nhập lại KHÔNG tạo trùng (bảng work_import_records). CSV chung không có cột mã ⇒ mã =
 * băm (tiêu đề + mô tả) — cùng tệp nhập hai lần vẫn ra cùng mã.
 */

import crypto from 'node:crypto';
import { parseCsv, parseDay } from './exchange.service.js';

export const IMPORT_SOURCES = ['TRELLO', 'ASANA', 'JIRA', 'CSV'] as const;
export type ImportSource = (typeof IMPORT_SOURCES)[number];
export type StatusCat = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface ImportPerson { key: string; name: string | null; email: string | null }
export interface ImportComment { author: ImportPerson | null; text: string; at: string | null }
export interface ImportChecklistItem { title: string; done: boolean }

export interface ImportItem {
  /** Dòng/vị trí trong tệp (1-based, dòng 1 của CSV là tiêu đề ⇒ mục đầu là 2). */
  row: number;
  externalId: string;
  title: string;
  description: string;
  /** Tên loại bên nguồn (Bug, Story, Sub-task…) — null ⇒ Task. */
  typeName: string | null;
  statusName: string | null;
  statusCategory: StatusCat | null;
  priority: number | null;
  labels: string[];
  assignee: ImportPerson | null;
  reporter: ImportPerson | null;
  due: string | null;
  start: string | null;
  created: string | null;
  storyPoints: number | null;
  /** Mã ngoài của cha (Jira Parent id, Asana parent). */
  parentExternalId: string | null;
  comments: ImportComment[];
  checklist: ImportChecklistItem[];
  errors: string[];
  warnings: string[];
}

export interface ParsedImport {
  source: ImportSource;
  items: ImportItem[];
  /** Cột của tệp (chỉ CSV chung / Excel) + gợi ý ghép. */
  columns?: string[];
  mapping?: ColumnMapping;
  /** Cảnh báo cấp tệp (bỏ thẻ lưu trữ, cột lạ…). */
  notes: string[];
}

const MAX_ITEMS = 2000;
const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.trim().slice(0, n) : '');
const isoDay = (v: unknown): string | null => {
  if (typeof v !== 'string' || !v.trim()) return null;
  const d = parseDay(v);
  if (d) return d;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
};
const hash = (s: string) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 24);

export function personKey(p: { name?: string | null; email?: string | null; id?: string | null }): string {
  if (p.email) return `email:${p.email.trim().toLowerCase()}`;
  if (p.id) return `id:${p.id}`;
  return `name:${(p.name ?? '').trim().toLowerCase()}`;
}
function person(name: unknown, email?: unknown, id?: string | null): ImportPerson | null {
  const n = clip(name, 160) || null;
  const e = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? email.trim().toLowerCase().slice(0, 200) : null;
  if (!n && !e) return null;
  return { key: personKey({ name: n, email: e, id }), name: n, email: e };
}

/** Tên cột/trạng thái ⇒ nhóm trạng thái (Trello "Doing", Asana "In progress", "Đang làm"…). */
export function statusCategoryOf(name: string | null | undefined): StatusCat | null {
  const s = (name ?? '').trim().toLowerCase();
  if (!s) return null;
  if (/\b(done|complete[d]?|closed|resolved|finished|shipped|released)\b|xong|hoàn thành|đã đóng/.test(s)) return 'DONE';
  if (/\b(doing|in progress|progress|wip|review|testing|qa|in review|started|active)\b|đang/.test(s)) return 'IN_PROGRESS';
  return 'TODO';
}

const PRIORITY_WORDS: Record<string, number> = { highest: 1, blocker: 1, critical: 1, urgent: 1, high: 2, major: 2, medium: 3, normal: 3, low: 4, minor: 4, lowest: 5, trivial: 5, 'cao': 2, 'trung bình': 3, 'thấp': 4, 'khẩn cấp': 1 };
export function priorityOf(v: unknown): number | null {
  const s = String(v ?? '').trim().toLowerCase();
  if (!s) return null;
  if (/^[1-5]$/.test(s)) return Number(s);
  return PRIORITY_WORDS[s] ?? null;
}

function blank(row: number, externalId: string, title: string): ImportItem {
  return {
    row, externalId, title: title.slice(0, 255), description: '', typeName: null, statusName: null, statusCategory: null, priority: null,
    labels: [], assignee: null, reporter: null, due: null, start: null, created: null, storyPoints: null, parentExternalId: null,
    comments: [], checklist: [], errors: title ? [] : ['Title is empty'], warnings: [],
  };
}

function capItems(items: ImportItem[], notes: string[]): ImportItem[] {
  if (items.length > MAX_ITEMS) { notes.push(`Only the first ${MAX_ITEMS} items are imported at a time`); return items.slice(0, MAX_ITEMS); }
  return items;
}

// ═══ Trello ══════════════════════════════════════════════════════

interface TrelloBoard {
  name?: string;
  cards?: Array<Record<string, any>>;
  lists?: Array<{ id: string; name: string; closed?: boolean }>;
  labels?: Array<{ id: string; name?: string; color?: string }>;
  members?: Array<{ id: string; fullName?: string; username?: string; email?: string }>;
  checklists?: Array<{ id: string; idCard: string; name?: string; checkItems?: Array<{ name?: string; state?: string; pos?: number }> }>;
  actions?: Array<{ id: string; type: string; date?: string; data?: { text?: string; card?: { id?: string } }; memberCreator?: { id?: string; fullName?: string; username?: string } }>;
}

export function parseTrello(text: string): ParsedImport {
  let b: TrelloBoard;
  try { b = JSON.parse(text.replace(/^\uFEFF/, '')); } catch { throw new Error('This is not a Trello JSON export (the file is not valid JSON)'); }
  if (!b || typeof b !== 'object' || !Array.isArray(b.cards) || !Array.isArray(b.lists)) throw new Error('This is not a Trello board export (no "cards" / "lists")');
  const notes: string[] = [];
  const lists = new Map(b.lists.map((l) => [l.id, l]));
  const labels = new Map((b.labels ?? []).map((l) => [l.id, l.name?.trim() || l.color || '']));
  const members = new Map((b.members ?? []).map((m) => [m.id, m]));
  const memberPerson = (id: string) => { const m = members.get(id); return m ? person(m.fullName || m.username, m.email, `trello:${m.id}`) : null; };
  const archived = b.cards.filter((c) => c.closed).length;
  if (archived) notes.push(`${archived} archived card(s) skipped`);
  const comments = new Map<string, ImportComment[]>();
  for (const a of b.actions ?? []) {
    if (a.type !== 'commentCard' || !a.data?.card?.id || !a.data.text?.trim()) continue;
    const list = comments.get(a.data.card.id) ?? [];
    list.push({ author: a.memberCreator ? person(a.memberCreator.fullName || a.memberCreator.username, null, a.memberCreator.id ? `trello:${a.memberCreator.id}` : null) : null, text: a.data.text.slice(0, 20_000), at: a.date ?? null });
    comments.set(a.data.card.id, list);
  }
  const checklists = new Map<string, ImportChecklistItem[]>();
  for (const cl of b.checklists ?? []) {
    const items = [...(cl.checkItems ?? [])].sort((x, y) => (x.pos ?? 0) - (y.pos ?? 0)).map((i) => ({ title: clip(i.name, 255), done: i.state === 'complete' })).filter((i) => i.title);
    checklists.set(cl.idCard, [...(checklists.get(cl.idCard) ?? []), ...items]);
  }
  let row = 0;
  const items = b.cards.filter((c) => !c.closed).map((c) => {
    row += 1;
    const it = blank(row, String(c.id ?? `row${row}`), clip(c.name, 255));
    it.description = typeof c.desc === 'string' ? c.desc.slice(0, 50_000) : '';
    const list = lists.get(c.idList);
    it.statusName = list?.name ?? null;
    it.statusCategory = statusCategoryOf(list?.name);
    if (c.dueComplete === true && it.statusCategory !== 'DONE') it.warnings.push('Due date marked complete — kept in its list');
    it.labels = [...new Set([
      ...(Array.isArray(c.labels) ? c.labels.map((l: { name?: string; color?: string }) => l.name?.trim() || l.color || '') : []),
      ...(Array.isArray(c.idLabels) ? c.idLabels.map((id: string) => labels.get(id) ?? '') : []),
    ].filter(Boolean))].slice(0, 20);
    const mem = (Array.isArray(c.idMembers) ? c.idMembers : []) as string[];
    it.assignee = mem.length ? memberPerson(mem[0]) : null;
    if (mem.length > 1) it.warnings.push(`Also on the card: ${mem.slice(1).map((m) => members.get(m)?.fullName ?? m).join(', ')} — only the first member becomes the assignee`);
    it.due = isoDay(c.due);
    it.start = isoDay(c.start);
    if (typeof c.id === 'string' && /^[0-9a-f]{24}$/.test(c.id)) it.created = new Date(parseInt(c.id.slice(0, 8), 16) * 1000).toISOString().slice(0, 10);
    it.comments = (comments.get(c.id) ?? []).sort((x, y) => String(x.at).localeCompare(String(y.at)));
    it.checklist = checklists.get(c.id) ?? [];
    return it;
  });
  return { source: 'TRELLO', items: capItems(items, notes), notes };
}

// ═══ Asana ═══════════════════════════════════════════════════════

export function parseAsana(text: string): ParsedImport {
  const t = text.replace(/^\uFEFF/, '').trim();
  if (t.startsWith('{') || t.startsWith('[')) return parseAsanaJson(t);
  return parseAsanaCsv(t);
}

function parseAsanaJson(text: string): ParsedImport {
  let j: any;
  try { j = JSON.parse(text); } catch { throw new Error('This is not a valid Asana JSON export'); }
  const tasks: any[] = Array.isArray(j) ? j : Array.isArray(j?.data) ? j.data : null;
  if (!tasks) throw new Error('This is not an Asana export (expected { "data": [tasks] })');
  const notes: string[] = [];
  const items: ImportItem[] = [];
  let row = 0;
  const walk = (task: any, parent: string | null) => {
    if (!task || typeof task !== 'object') return;
    row += 1;
    const id = String(task.gid ?? task.id ?? `row${row}`);
    const it = blank(row, id, clip(task.name, 255));
    it.description = typeof task.notes === 'string' ? task.notes.slice(0, 50_000) : '';
    const section = Array.isArray(task.memberships) ? task.memberships.map((m: any) => m?.section?.name).find(Boolean) : null;
    it.statusName = task.completed ? 'Done' : section ?? null;
    it.statusCategory = task.completed ? 'DONE' : statusCategoryOf(section);
    it.assignee = task.assignee ? person(task.assignee.name, task.assignee.email, task.assignee.gid ? `asana:${task.assignee.gid}` : null) : null;
    it.due = isoDay(task.due_on ?? task.due_at);
    it.start = isoDay(task.start_on);
    it.created = isoDay(task.created_at);
    it.labels = (Array.isArray(task.tags) ? task.tags.map((x: any) => clip(x?.name, 40)) : []).filter(Boolean).slice(0, 20);
    const pr = Array.isArray(task.custom_fields) ? task.custom_fields.find((f: any) => /priority/i.test(f?.name ?? '')) : null;
    it.priority = priorityOf(pr?.display_value ?? pr?.enum_value?.name);
    const parentId = parent ?? (task.parent?.gid ? String(task.parent.gid) : null);
    it.parentExternalId = parentId;
    if (parentId) it.typeName = 'Sub-task';
    it.comments = (Array.isArray(task.stories) ? task.stories : [])
      .filter((s: any) => (s?.resource_subtype === 'comment_added' || s?.type === 'comment') && typeof s.text === 'string' && s.text.trim())
      .map((s: any) => ({ author: s.created_by ? person(s.created_by.name, s.created_by.email, s.created_by.gid ? `asana:${s.created_by.gid}` : null) : null, text: s.text.slice(0, 20_000), at: s.created_at ?? null }));
    items.push(it);
    for (const st of Array.isArray(task.subtasks) ? task.subtasks : []) walk(st, id);
  };
  for (const task of tasks) walk(task, null);
  return { source: 'ASANA', items: capItems(items, notes), notes };
}

function parseAsanaCsv(text: string): ParsedImport {
  const table = parseCsv(text);
  if (table.length < 2) throw new Error('The file has no data rows');
  const header = table[0].map((h) => h.trim().toLowerCase());
  const col = (...names: string[]) => header.findIndex((h) => names.includes(h));
  const iName = col('name', 'task name');
  if (iName < 0) throw new Error('This is not an Asana CSV export (no "Name" column)');
  const iId = col('task id'), iNotes = col('notes', 'description'), iSection = col('section/column', 'section'), iAssignee = col('assignee'), iEmail = col('assignee email');
  const iDue = col('due date'), iStart = col('start date'), iCreated = col('created at'), iCompleted = col('completed at'), iTags = col('tags'), iParent = col('parent task', 'parent');
  const iPriority = col('priority');
  const notes: string[] = [];
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? '').trim() : '');
  const items = table.slice(1).map((r, k) => {
    const name = get(r, iName);
    const id = get(r, iId) || `h:${hash(`${name}|${get(r, iNotes)}`)}`;
    const it = blank(k + 2, id, name);
    it.description = get(r, iNotes);
    const done = !!get(r, iCompleted);
    it.statusName = done ? 'Done' : get(r, iSection) || null;
    it.statusCategory = done ? 'DONE' : statusCategoryOf(get(r, iSection));
    it.assignee = person(get(r, iAssignee), get(r, iEmail));
    it.due = isoDay(get(r, iDue));
    it.start = isoDay(get(r, iStart));
    it.created = isoDay(get(r, iCreated));
    it.labels = get(r, iTags).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 20);
    it.priority = priorityOf(get(r, iPriority));
    const parent = get(r, iParent);
    if (parent) { it.parentExternalId = `name:${parent.toLowerCase()}`; it.typeName = 'Sub-task'; }
    return it;
  });
  // Asana CSV ghi TÊN task cha (không phải id) ⇒ đổi "name:<tên>" sang id của task mang tên đó (tên trùng ⇒ lấy cái đầu).
  const byName = new Map<string, string>();
  for (const it of items) if (!byName.has(it.title.toLowerCase())) byName.set(it.title.toLowerCase(), it.externalId);
  for (const it of items) {
    if (!it.parentExternalId?.startsWith('name:')) continue;
    const pid = byName.get(it.parentExternalId.slice(5));
    if (pid && pid !== it.externalId) it.parentExternalId = pid;
    else { it.warnings.push(`Parent task "${it.parentExternalId.slice(5)}" is not in this file — imported as a normal task`); it.parentExternalId = null; it.typeName = null; }
  }
  return { source: 'ASANA', items: capItems(items, notes), notes };
}

// ═══ Jira CSV ════════════════════════════════════════════════════

/** "23/Sep/26 10:00 AM;5b10a2844c20165700ede21g;Looks good" ⇒ { at, author, text }. Không đúng dạng ⇒ cả ô là chữ. */
export function parseJiraComment(cell: string): ImportComment | null {
  const s = cell.trim();
  if (!s) return null;
  const m = /^([^;]{6,40});([^;]{0,128});([\s\S]*)$/.exec(s);
  if (m && parseDay(m[1])) return { at: parseDay(m[1]), author: m[2].trim() ? person(m[2].includes('@') ? null : m[2], m[2].includes('@') ? m[2] : null, m[2].includes('@') ? null : `jira:${m[2].trim()}`) : null, text: m[3].trim().slice(0, 20_000) };
  return { at: null, author: null, text: s.slice(0, 20_000) };
}

export function parseJiraCsv(text: string): ParsedImport {
  const table = parseCsv(text);
  if (table.length < 2) throw new Error('The file has no data rows');
  const header = table[0].map((h) => h.trim().toLowerCase());
  const idx = (...names: string[]) => header.flatMap((h, i) => (names.includes(h) ? [i] : []));
  const sum = idx('summary');
  if (!sum.length) throw new Error('This is not a Jira CSV export (no "Summary" column)');
  const c = {
    key: idx('issue key'), id: idx('issue id'), type: idx('issue type'), status: idx('status'), priority: idx('priority'),
    assignee: idx('assignee'), assigneeEmail: idx('assignee email', 'assignee e-mail'), reporter: idx('reporter'), reporterEmail: idx('reporter email'),
    desc: idx('description'), labels: idx('labels'), due: idx('due date'), start: idx('start date', 'custom field (start date)'), created: idx('created'),
    points: idx('story points', 'custom field (story points)', 'custom field (story point estimate)'), parent: idx('parent id', 'parent', 'custom field (epic link)'),
    comment: idx('comment', 'comments'),
  };
  const one = (r: string[], is: number[]) => is.map((i) => (r[i] ?? '').trim()).find(Boolean) ?? '';
  const all = (r: string[], is: number[]) => is.map((i) => (r[i] ?? '').trim()).filter(Boolean);
  const notes: string[] = [];
  const items = table.slice(1).map((r, k) => {
    const id = one(r, c.id) || one(r, c.key) || `h:${hash(`${one(r, sum)}|${one(r, c.desc)}`)}`;
    const it = blank(k + 2, id, one(r, sum));
    it.description = one(r, c.desc);
    it.typeName = one(r, c.type) || null;
    it.statusName = one(r, c.status) || null;
    it.statusCategory = statusCategoryOf(it.statusName);
    const pr = one(r, c.priority);
    it.priority = priorityOf(pr);
    if (pr && it.priority === null) it.warnings.push(`Unknown priority "${pr}" — using Medium`);
    it.assignee = person(one(r, c.assignee), one(r, c.assigneeEmail));
    it.reporter = person(one(r, c.reporter), one(r, c.reporterEmail));
    it.labels = [...new Set(all(r, c.labels).flatMap((x) => x.split(/[,;]/)).map((x) => x.trim()).filter(Boolean))].slice(0, 20);
    it.due = isoDay(one(r, c.due));
    it.start = isoDay(one(r, c.start));
    it.created = isoDay(one(r, c.created));
    const sp = Number(one(r, c.points));
    it.storyPoints = one(r, c.points) && Number.isFinite(sp) ? sp : null;
    it.parentExternalId = one(r, c.parent) || null;
    it.comments = all(r, c.comment).map(parseJiraComment).filter((x): x is ImportComment => !!x);
    return it;
  });
  // "Parent" có thể là KHOÁ (ABC-12) thay vì id ⇒ đổi sang id của dòng mang khoá đó.
  const keyToId = new Map<string, string>();
  table.slice(1).forEach((r, k) => { const key = one(r, c.key); if (key) keyToId.set(key.toLowerCase(), items[k].externalId); });
  for (const it of items) if (it.parentExternalId && keyToId.has(it.parentExternalId.toLowerCase())) it.parentExternalId = keyToId.get(it.parentExternalId.toLowerCase())!;
  return { source: 'JIRA', items: capItems(items, notes), notes };
}

// ═══ CSV / Excel chung — ghép cột ⇒ trường ════════════════════════

export const MAP_FIELDS = ['title', 'description', 'type', 'status', 'priority', 'assignee', 'assigneeEmail', 'reporter', 'labels', 'due', 'start', 'created', 'storyPoints', 'externalId', 'parent', 'comment'] as const;
export type MapField = (typeof MAP_FIELDS)[number];
/** trường ⇒ chỉ số cột (0-based) hoặc null. */
export type ColumnMapping = Partial<Record<MapField, number | null>>;

const COLUMN_ALIASES: Record<MapField, string[]> = {
  title: ['title', 'summary', 'name', 'task', 'task name', 'subject', 'tiêu đề', 'tên', 'tên công việc', 'công việc', 'việc'],
  description: ['description', 'notes', 'details', 'desc', 'mô tả', 'ghi chú', 'chi tiết', 'nội dung'],
  type: ['type', 'issue type', 'kind', 'loại'],
  status: ['status', 'state', 'stage', 'list', 'column', 'section', 'trạng thái', 'tình trạng'],
  priority: ['priority', 'ưu tiên', 'mức ưu tiên'],
  assignee: ['assignee', 'owner', 'assigned to', 'responsible', 'người làm', 'người phụ trách', 'phụ trách', 'người thực hiện'],
  assigneeEmail: ['assignee email', 'email', 'owner email', 'email người làm'],
  reporter: ['reporter', 'created by', 'author', 'người tạo', 'người báo'],
  labels: ['labels', 'label', 'tags', 'tag', 'nhãn'],
  due: ['due', 'due date', 'deadline', 'end date', 'hạn', 'hạn chót', 'ngày kết thúc', 'deadline date'],
  start: ['start', 'start date', 'ngày bắt đầu', 'bắt đầu'],
  created: ['created', 'created at', 'created date', 'ngày tạo'],
  storyPoints: ['story points', 'points', 'estimate', 'điểm', 'story point'],
  externalId: ['id', 'key', 'issue key', 'task id', 'mã', 'mã việc', 'external id'],
  parent: ['parent', 'parent id', 'parent key', 'epic', 'cha', 'việc cha'],
  comment: ['comment', 'comments', 'bình luận'],
};

export function suggestMapping(header: string[]): ColumnMapping {
  const h = header.map((x) => x.trim().toLowerCase());
  const used = new Set<number>();
  const out: ColumnMapping = {};
  for (const f of MAP_FIELDS) {
    const i = h.findIndex((x, k) => !used.has(k) && COLUMN_ALIASES[f].includes(x));
    if (i >= 0) { out[f] = i; used.add(i); } else out[f] = null;
  }
  return out;
}

/** Bảng (hàng đầu = tiêu đề) + ghép cột ⇒ mục. `mapping` thiếu ⇒ dùng gợi ý. */
export function parseTable(table: string[][], mapping?: ColumnMapping | null): ParsedImport {
  if (table.length < 2) throw new Error('The file has no data rows');
  const header = table[0].map((x) => String(x ?? '').trim());
  const m: ColumnMapping = { ...suggestMapping(header), ...(mapping ?? {}) };
  for (const [k, v] of Object.entries(m)) if (v !== null && v !== undefined && (!Number.isInteger(v) || v < 0 || v >= header.length)) m[k as MapField] = null;
  const notes: string[] = [];
  if (m.title === null || m.title === undefined) notes.push('Pick the column that holds the title');
  const get = (r: string[], f: MapField) => { const i = m[f]; return i === null || i === undefined ? '' : String(r[i] ?? '').trim(); };
  const items = table.slice(1).filter((r) => r.some((x) => String(x ?? '').trim())).map((r, k) => {
    const title = get(r, 'title');
    const ext = get(r, 'externalId') || `h:${hash(`${title}|${get(r, 'description')}`)}`;
    const it = blank(k + 2, ext, title);
    it.description = get(r, 'description');
    it.typeName = get(r, 'type') || null;
    it.statusName = get(r, 'status') || null;
    it.statusCategory = statusCategoryOf(it.statusName);
    const pr = get(r, 'priority');
    it.priority = priorityOf(pr);
    if (pr && it.priority === null) it.warnings.push(`Unknown priority "${pr}" — using Medium`);
    it.assignee = person(get(r, 'assignee'), get(r, 'assigneeEmail') || (get(r, 'assignee').includes('@') ? get(r, 'assignee') : ''));
    it.reporter = person(get(r, 'reporter'), get(r, 'reporter').includes('@') ? get(r, 'reporter') : '');
    it.labels = get(r, 'labels').split(/[,;]/).map((x) => x.trim()).filter(Boolean).slice(0, 20);
    for (const [f, key] of [['due', 'due'], ['start', 'start'], ['created', 'created']] as const) {
      const raw = get(r, f);
      it[key] = isoDay(raw);
      if (raw && !it[key]) it.warnings.push(`Could not read the ${f} date "${raw}" — left empty`);
    }
    const sp = get(r, 'storyPoints');
    if (sp) { const n = Number(sp.replace(',', '.')); if (Number.isFinite(n)) it.storyPoints = n; else it.warnings.push(`Story points "${sp}" is not a number`); }
    it.parentExternalId = get(r, 'parent') || null;
    const cm = get(r, 'comment');
    if (cm) it.comments = [{ author: null, text: cm.slice(0, 20_000), at: null }];
    return it;
  });
  return { source: 'CSV', items: capItems(items, notes), columns: header, mapping: m, notes };
}

/** Bảng từ sheet Excel đầu tiên có dữ liệu (ô ngày ⇒ YYYY-MM-DD). */
export function tableFromSheet(sheet: { maxRow: number; maxCol: number; text(row: number, col: number): string }): string[][] {
  const out: string[][] = [];
  const cols = Math.min(sheet.maxCol, 60);
  for (let r = 1; r <= Math.min(sheet.maxRow, MAX_ITEMS + 1); r++) {
    const row: string[] = [];
    for (let c = 1; c <= cols; c++) row.push(sheet.text(r, c) ?? '');
    out.push(row);
  }
  // Bỏ hàng trống ở đầu (tiêu đề bảng thường nằm dưới vài dòng trống/tiêu đề lớn ⇒ hàng có ≥2 ô là tiêu đề).
  const start = out.findIndex((r) => r.filter((x) => x.trim()).length >= 2);
  return start > 0 ? out.slice(start) : out;
}

/** Kiểm tra chung sau khi đọc: cha không tồn tại trong tệp ⇒ cảnh báo (ImportService còn thử thẻ đã nhập trước). */
export function crossCheck(items: ImportItem[]): void {
  const ids = new Set(items.map((i) => i.externalId));
  const seen = new Set<string>();
  for (const it of items) {
    if (seen.has(it.externalId)) it.errors.push(`Duplicate id "${it.externalId}" in the file — only the first row is imported`);
    seen.add(it.externalId);
    if (it.parentExternalId && it.parentExternalId === it.externalId) { it.warnings.push('An item cannot be its own parent'); it.parentExternalId = null; }
    if (it.parentExternalId && !ids.has(it.parentExternalId)) it.warnings.push(`Parent "${it.parentExternalId}" is not in this file — looking for it among issues imported before`);
  }
}
