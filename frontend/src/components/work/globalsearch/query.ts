/**
 * Tìm thẻ mọi dự án — trạng thái trên URL ⇄ bộ lọc ⇄ JQL.
 *
 * URL (chia sẻ được):
 *   Basic: ?q=<chữ>&project=SHOP,QA&type=Bug&cat=TODO,IN_PROGRESS&assignee=me,none,<username>&sort=updated.desc&group=project
 *   JQL:   ?mode=jql&jql=<câu truy vấn>   (tham số Basic vẫn giữ để quay lại Basic không mất)
 * `?jql=` không kèm mode cũng tính là JQL (link từ nơi khác).
 */

import type { GlobalSearchFacets, ProjectConfig, StatusCategory } from '@/lib/work-api';
import type { JqlSuggestConfig } from '../search/jql';
import { quote } from '../search/jql';
import { jqlOrder, withOrder } from '../search/columns';

export type SortCol = 'key' | 'project' | 'title' | 'status' | 'priority' | 'assignee' | 'updated';
export interface SortState { col: SortCol; dir: 'asc' | 'desc' }

/** Cột ⇒ tên trường trong ORDER BY. */
export const SORT_FIELD: Record<SortCol, string> = {
  key: 'key', project: 'project', title: 'summary', status: 'status', priority: 'priority', assignee: 'assignee', updated: 'updated',
};
const FIELD_TO_COL: Record<string, SortCol> = {
  key: 'key', issue: 'key', issuekey: 'key', project: 'project', summary: 'title', title: 'title', status: 'status',
  priority: 'priority', assignee: 'assignee', updated: 'updated', updateddate: 'updated',
};
/** Bấm lần đầu vào cột: mới nhất / quan trọng nhất lên đầu. */
export const FIRST_DIR: Record<SortCol, 'asc' | 'desc'> = {
  key: 'asc', project: 'asc', title: 'asc', status: 'asc', priority: 'asc', assignee: 'asc', updated: 'desc',
};

export const CATEGORY_LABEL: Record<StatusCategory, string> = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };

export interface BasicState {
  text: string;
  projects: string[];
  types: string[];
  cats: StatusCategory[];
  /** 'me' · 'none' · username */
  assignees: string[];
}

const list = (v: string | null) => (v ? v.split(',').map((x) => x.trim()).filter(Boolean) : []);

export function readBasic(sp: URLSearchParams): BasicState {
  return {
    text: sp.get('q') ?? '',
    projects: list(sp.get('project')),
    types: list(sp.get('type')),
    cats: list(sp.get('cat')).filter((c): c is StatusCategory => c === 'TODO' || c === 'IN_PROGRESS' || c === 'DONE'),
    assignees: list(sp.get('assignee')),
  };
}

export function readSort(sp: URLSearchParams): SortState | null {
  const [col, dir] = (sp.get('sort') ?? '').split('.');
  if (!(col in SORT_FIELD)) return null;
  return { col: col as SortCol, dir: dir === 'desc' ? 'desc' : 'asc' };
}

export const hasBasicFilters = (b: BasicState) => !!(b.text || b.projects.length || b.types.length || b.cats.length || b.assignees.length);

/**
 * Bộ lọc Basic ⇒ JQL (không gồm chữ tự do — chữ đi riêng bằng `q` để được
 * xếp theo độ khớp). `withText` = gộp luôn chữ vào (khi chuyển sang JQL).
 */
export function basicToJql(b: BasicState, sort: SortState | null, withText = false): string {
  const parts: string[] = [];
  const clause = (field: string, xs: string[]) => {
    if (!xs.length) return;
    parts.push(xs.length === 1 ? `${field} = ${xs[0]}` : `${field} IN (${xs.join(', ')})`);
  };
  clause('project', b.projects.map(quote));
  clause('type', b.types.map(quote));
  clause('statusCategory', b.cats.map((c) => quote(CATEGORY_LABEL[c])));
  clause('assignee', b.assignees.map((a) => (a === 'me' ? 'currentUser()' : a === 'none' ? 'EMPTY' : quote(a))));
  if (withText && b.text.trim()) parts.push(`text ~ "${b.text.trim().replace(/(["\\])/g, '\\$1')}"`);
  const where = parts.join(' AND ');
  return sort ? withOrder(where, SORT_FIELD[sort.col], sort.dir) : where;
}

/** Sắp xếp đang hiệu lực của một câu JQL (để tô đầu cột). */
export function sortOfJql(jql: string): SortState | null {
  const o = jqlOrder(jql);
  const col = o.field ? FIELD_TO_COL[o.field] : undefined;
  return col ? { col, dir: o.dir } : null;
}

/** Viết lại ORDER BY theo cột vừa bấm. */
export function jqlWithSort(jql: string, s: SortState): string {
  return withOrder(jql, SORT_FIELD[s.col], s.dir);
}

export function nextSort(cur: SortState | null, col: SortCol): SortState {
  if (cur?.col === col) return { col, dir: cur.dir === 'asc' ? 'desc' : 'asc' };
  return { col, dir: FIRST_DIR[col] };
}

/** Thay từ tại `position` bằng gợi ý "did you mean" của backend. */
export function applySuggestion(jql: string, position: number, suggestion: string): string {
  const rest = jql.slice(position);
  const m = /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\p{L}\p{N}_\-.:/+@]+(?:\(\))?)/u.exec(rest);
  const len = m ? m[0].length : 0;
  return jql.slice(0, position) + suggestion + jql.slice(position + len);
}

/** Lỗi JQL kèm gợi ý (JqlInput chỉ đọc message + position). */
export function jqlSuggestionOf(err: unknown): string | null {
  const r = (err as { response?: { data?: { code?: string; data?: { suggestion?: string } } } })?.response;
  return r?.data?.code === 'WORK_JQL_ERROR' ? r.data.data?.suggestion ?? null : null;
}

/**
 * JqlInput cần một ProjectConfig để gợi ý tên. Ghép một cấu hình "ảo" từ
 * facets của mọi dự án. Trường `project` chưa có trong danh sách trường của
 * JqlInput (search/jql.ts) ⇒ khai tạm như một trường chọn để có gợi ý khoá dự án.
 */
export function facetsConfig(f: GlobalSearchFacets | undefined): JqlSuggestConfig {
  const statuses = (f?.statuses ?? []).map((s, i) => ({ id: -(i + 1), name: s.name, category: s.category, color: s.color, position: i, wipLimit: null }));
  return {
    id: 0, key: '', name: 'All projects', description: null, type: 'SCRUM', template: 'BLANK', visibility: 'WORKSPACE',
    settings: {}, archivedAt: null, createdAt: '', leadId: null,
    workspace: { id: 0, name: '', slug: '' },
    workflows: [{ id: 0, name: 'All', isDefault: true, statuses, transitions: [] }],
    issueTypes: (f?.types ?? []).map((t, i) => ({ id: -(i + 1), key: t.key, name: t.name, icon: t.icon, color: t.color, level: 0, workflowId: null })),
    labels: [], components: [], sprints: [],
    role: 'VIEWER', workspaceRole: 'MEMBER',
    permissions: {
      editIssues: false, createIssues: false, transition: false, deleteIssues: false, comment: false, attach: false,
      manageSprints: false, settings: false, manageMembers: false, useAi: false,
    },
    boardColumns: [],
    members: (f?.assignees ?? []).map((u) => ({ ...u, role: 'MEMBER' as const, explicit: false })),
    customFields: [],
    // Gợi ý JQL đọc `projectKeys` cho trường `project` (search/jql.ts).
    projectKeys: [...new Set((f?.projects ?? []).map((p) => p.key))],
  };
}
