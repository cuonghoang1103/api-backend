/**
 * Board — logic thuần (không React): bộ lọc nhanh, lồng việc con vào thẻ cha,
 * chia làn (swimlane) theo người / epic / thẻ cha.
 *
 * Luật lồng: việc con mà thẻ cha CŨNG đang trên board thì không thành thẻ rời
 * — nó nằm trong thẻ cha (hàng "3 sub-tasks"). Cha không có trên board (khác
 * sprint, đã lọc mất…) thì việc con vẫn hiện thành thẻ riêng, kèm mã của cha.
 */

import type { IssueCard } from '@/lib/work-api';
import type { Lookups } from '../hooks';

export type GroupBy = 'none' | 'assignee' | 'epic' | 'subtasks';

export const GROUP_OPTIONS: Array<{ value: GroupBy; label: string; hint: string }> = [
  { value: 'none', label: 'None', hint: 'Sub-tasks nested inside their parent card' },
  { value: 'assignee', label: 'Assignee', hint: 'One swimlane per person' },
  { value: 'epic', label: 'Epic', hint: 'One swimlane per epic' },
  { value: 'subtasks', label: 'Sub-tasks', hint: 'One swimlane per parent issue, sub-tasks as cards' },
];

export interface QuickFilters {
  recent: boolean;
  dueWeek: boolean;
  unassigned: boolean;
  labels: number[];
}

export const EMPTY_QUICK: QuickFilters = { recent: false, dueWeek: false, unassigned: false, labels: [] };

export const quickActive = (q: QuickFilters) => q.recent || q.dueWeek || q.unassigned || q.labels.length > 0;

/** Hết Chủ nhật tuần này (giờ máy) — "Due this week" tính tới đó, gồm cả thẻ đã quá hạn. */
function endOfWeek(now = new Date()): number {
  const d = new Date(now);
  const day = d.getDay(); // 0 = CN
  d.setDate(d.getDate() + (day === 0 ? 0 : 7 - day));
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function makeQuickTest(q: QuickFilters, lk: Lookups): (i: IssueCard) => boolean {
  const now = Date.now();
  const weekEnd = endOfWeek();
  return (i) => {
    if (q.unassigned && i.assigneeId) return false;
    if (q.recent && now - new Date(i.updatedAt).getTime() > 2 * 86_400_000) return false;
    if (q.dueWeek) {
      if (!i.dueDate || lk.statuses.get(i.statusId)?.category === 'DONE') return false;
      if (new Date(`${i.dueDate.slice(0, 10)}T00:00:00`).getTime() > weekEnd) return false;
    }
    if (q.labels.length && !i.labelIds.some((l) => q.labels.includes(l))) return false;
    return true;
  };
}

export const isSubtask = (i: IssueCard, lk: Lookups) => lk.types.get(i.typeId)?.level === -1;

export interface SubtaskInfo {
  /** Việc con đang có trên board (đã tải). */
  kids: IssueCard[];
  total: number;
  done: number;
  /** Việc con chưa xong — cha đã ở cột Done mà còn thứ này thì cảnh báo. */
  open: number;
}

/** Việc con theo id thẻ cha (chỉ những cha đang có trên board). */
export function subtasksByParent(issues: IssueCard[], lk: Lookups): Map<number, SubtaskInfo> {
  const onBoard = new Set(issues.map((i) => i.id));
  const m = new Map<number, IssueCard[]>();
  for (const i of issues) {
    if (!i.parentId || !onBoard.has(i.parentId) || !isSubtask(i, lk)) continue;
    const list = m.get(i.parentId) ?? [];
    list.push(i);
    m.set(i.parentId, list);
  }
  const out = new Map<number, SubtaskInfo>();
  const parents = new Map(issues.map((i) => [i.id, i]));
  for (const [pid, kids] of m) {
    const done = kids.filter((k) => lk.statuses.get(k.statusId)?.category === 'DONE').length;
    // Việc con không có trên board (Kanban chỉ giữ thẻ xong 14 ngày) coi như đã xong.
    const total = Math.max(parents.get(pid)?.subtaskCount ?? 0, kids.length);
    const missing = total - kids.length;
    out.set(pid, { kids, total, done: done + missing, open: kids.length - done });
  }
  return out;
}

export interface Lane {
  key: string;
  title: string;
  /** Thẻ cha của làn (chế độ Sub-tasks) — vẽ header như một thẻ. */
  parent?: IssueCard;
  /** Người của làn (chế độ Assignee). */
  userId?: number | null;
  /** Epic của làn. */
  epic?: { id: number; number: number } | null;
  cards: IssueCard[];
}

/**
 * Chia thẻ thành các làn. `none` ⇒ một làn duy nhất. Việc con đã lồng vào cha
 * thì đi theo cha (trừ chế độ `subtasks`, nơi việc con là thẻ trong làn của cha).
 */
export function buildLanes(
  mode: GroupBy,
  issues: IssueCard[],
  lk: Lookups,
  nested: Map<number, SubtaskInfo>,
  epics: Map<number, { number: number; title: string }>,
): Lane[] {
  const nestedIds = new Set<number>();
  for (const s of nested.values()) s.kids.forEach((k) => nestedIds.add(k.id));

  if (mode === 'subtasks') {
    const lanes: Lane[] = [];
    const other: IssueCard[] = [];
    const byId = new Map(issues.map((i) => [i.id, i]));
    for (const [pid, info] of nested) {
      const parent = byId.get(pid);
      if (!parent) continue;
      lanes.push({ key: `p:${pid}`, title: parent.title, parent, cards: info.kids });
    }
    // Giữ thứ tự rank của thẻ cha.
    lanes.sort((a, b) => (a.parent!.rank < b.parent!.rank ? -1 : a.parent!.rank > b.parent!.rank ? 1 : 0));
    for (const i of issues) if (!nestedIds.has(i.id) && !nested.has(i.id)) other.push(i);
    lanes.push({ key: 'other', title: 'Other issues', cards: other });
    return lanes;
  }

  const top = issues.filter((i) => !nestedIds.has(i.id));
  if (mode === 'none') return [{ key: 'all', title: 'All issues', cards: top }];

  const map = new Map<string, Lane>();
  const get = (key: string, make: () => Lane) => {
    let l = map.get(key);
    if (!l) { l = make(); map.set(key, l); }
    return l;
  };
  for (const i of top) {
    if (mode === 'assignee') {
      const uid = i.assigneeId;
      const m = uid ? lk.members.get(uid) : null;
      const title = uid ? (m ? m.displayName || m.fullName || m.username : 'Former member') : 'Unassigned';
      get(`u:${uid ?? 0}`, () => ({ key: `u:${uid ?? 0}`, title, userId: uid, cards: [] })).cards.push(i);
    } else {
      // Việc con lẻ (cha không trên board) không có epic trực tiếp ⇒ "No epic".
      const epicId = i.parentId && epics.has(i.parentId) ? i.parentId : null;
      const e = epicId ? epics.get(epicId)! : null;
      get(`e:${epicId ?? 0}`, () => ({
        key: `e:${epicId ?? 0}`, title: e ? e.title : 'No epic', epic: e && epicId ? { id: epicId, number: e.number } : null, cards: [],
      })).cards.push(i);
    }
  }
  const lanes = [...map.values()];
  // Làn "Unassigned" / "No epic" luôn ở cuối; còn lại theo tên (người) hoặc số epic.
  lanes.sort((a, b) => {
    const ea = a.key.endsWith(':0') ? 1 : 0;
    const eb = b.key.endsWith(':0') ? 1 : 0;
    if (ea !== eb) return ea - eb;
    if (mode === 'epic') return (a.epic?.number ?? 0) - (b.epic?.number ?? 0);
    return a.title.localeCompare(b.title);
  });
  return lanes;
}
