/**
 * Sửa hàng loạt dùng chung cho Backlog và danh sách Issues.
 *
 * Đổi trạng thái THEO TÊN: mỗi quy trình có statusId riêng (Bug "Done" ≠ Story
 * "Done"), nên chia thẻ theo quy trình của loại thẻ rồi gọi bulkUpdate một lần
 * cho mỗi quy trình với đúng id trạng thái cùng tên trong quy trình đó.
 */

import { workApi, type BulkPatch, type StatusCategory } from '@/lib/work-api';
import type { Lookups } from '../hooks';

export interface BulkResult { updated: number[]; failed: Array<{ number: number; error: string }> }

/** Các tên trạng thái (gộp mọi quy trình), theo thứ tự To do → In progress → Done. */
export function statusNameOptions(lk: Lookups): Array<{ name: string; color: string; category: StatusCategory }> {
  const order: Record<StatusCategory, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
  const m = new Map<string, { name: string; color: string; category: StatusCategory; o: number }>();
  for (const s of lk.statuses.values()) {
    if (!m.has(s.name)) m.set(s.name, { name: s.name, color: s.color, category: s.category, o: order[s.category] * 1000 + s.position });
  }
  return [...m.values()].sort((a, b) => a.o - b.o);
}

export async function bulkSetStatusByName(
  pid: number,
  lk: Lookups,
  issues: Array<{ number: number; typeId: number }>,
  name: string,
): Promise<BulkResult> {
  const groups = new Map<number, number[]>();
  const failed: BulkResult['failed'] = [];
  for (const i of issues) {
    const st = lk.workflowOfType(i.typeId)?.statuses.find((s) => s.name === name);
    if (!st) { failed.push({ number: i.number, error: `"${name}" is not in this issue type's workflow` }); continue; }
    groups.set(st.id, [...(groups.get(st.id) ?? []), i.number]);
  }
  const updated: number[] = [];
  for (const [statusId, numbers] of groups) {
    const r = await workApi.bulkUpdate(pid, numbers, { statusId });
    updated.push(...r.updated);
    failed.push(...r.failed);
  }
  return { updated, failed };
}

export async function bulkApply(pid: number, numbers: number[], patch: BulkPatch): Promise<BulkResult> {
  return workApi.bulkUpdate(pid, numbers, patch);
}
