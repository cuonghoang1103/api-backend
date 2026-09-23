/**
 * CT Work — tuỳ biến dự án: quy trình (trạng thái + luồng chuyển), loại thẻ,
 * trường tuỳ chỉnh, cột board. Chỉ ADMIN dự án (project.settings); riêng
 * GIÁ TRỊ trường tuỳ chỉnh trên một thẻ thì ai sửa được thẻ là đặt được.
 */

import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { STATUS_CATEGORIES, type StatusCategory } from './constants.js';
import { emitWorkEvent } from './events.js';
import { requireProject } from './permissions.js';

const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });

async function findWorkflow(projectId: number, workflowId: number) {
  const wf = await prisma.workWorkflow.findFirst({ where: { id: workflowId, projectId }, select: { id: true } });
  if (!wf) throw new NotFoundError('Workflow not found');
  return wf;
}

async function findStatus(projectId: number, statusId: number) {
  const s = await prisma.workStatus.findFirst({ where: { id: statusId, workflow: { projectId } }, select: { id: true, workflowId: true, category: true, name: true } });
  if (!s) throw new NotFoundError('Status not found');
  return s;
}

/** Quy trình phải còn ít nhất một trạng thái "chưa làm" và một trạng thái "xong". */
async function assertWorkflowShape(tx: Prisma.TransactionClient, workflowId: number) {
  const cats = await tx.workStatus.findMany({ where: { workflowId }, select: { category: true } });
  if (!cats.some((c) => c.category === 'TODO')) throw new BadRequestError('A workflow needs at least one "To do" status', 'WORK_WORKFLOW_SHAPE');
  if (!cats.some((c) => c.category === 'DONE')) throw new BadRequestError('A workflow needs at least one "Done" status', 'WORK_WORKFLOW_SHAPE');
}

// ─── Trạng thái ──────────────────────────────────────────────────

export async function addStatus(userId: number, projectId: number, workflowId: number, input: { name: string; category: StatusCategory; color?: string }) {
  await requireProject(userId, projectId, 'project.settings');
  await findWorkflow(projectId, workflowId);
  const name = input.name.trim().slice(0, 60);
  if (!name) throw new BadRequestError('Status name is required', 'WORK_NAME_REQUIRED');
  const dup = await prisma.workStatus.findFirst({ where: { workflowId, name: { equals: name, mode: 'insensitive' } } });
  if (dup) throw new ConflictError(`"${name}" already exists in this workflow`);
  const last = await prisma.workStatus.findFirst({ where: { workflowId, category: { in: input.category === 'DONE' ? ['DONE'] : ['TODO', 'IN_PROGRESS', 'DONE'] } }, orderBy: { position: 'desc' }, select: { position: true } });
  // Trạng thái mới đứng TRƯỚC nhóm Done (trừ khi chính nó là Done).
  const firstDone = await prisma.workStatus.findFirst({ where: { workflowId, category: 'DONE' }, orderBy: { position: 'asc' }, select: { position: true } });
  const position = input.category === 'DONE' || !firstDone ? (last?.position ?? 0) + 1 : firstDone.position;
  const s = await prisma.$transaction(async (tx) => {
    if (input.category !== 'DONE' && firstDone) {
      await tx.workStatus.updateMany({ where: { workflowId, position: { gte: position } }, data: { position: { increment: 1 } } });
    }
    return tx.workStatus.create({
      data: { workflowId, name, category: input.category, color: input.color ?? (input.category === 'DONE' ? '#16a34a' : input.category === 'IN_PROGRESS' ? '#2563eb' : '#64748b'), position },
    });
  });
  touch(projectId, userId);
  return s;
}

export async function updateStatus(userId: number, projectId: number, statusId: number, input: { name?: string; category?: StatusCategory; color?: string; wipLimit?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const s = await findStatus(projectId, statusId);
  const data: Prisma.WorkStatusUpdateInput = {};
  if (input.name !== undefined) {
    const n = input.name.trim().slice(0, 60);
    if (!n) throw new BadRequestError('Status name is required', 'WORK_NAME_REQUIRED');
    const dup = await prisma.workStatus.findFirst({ where: { workflowId: s.workflowId, id: { not: statusId }, name: { equals: n, mode: 'insensitive' } } });
    if (dup) throw new ConflictError(`"${n}" already exists in this workflow`);
    data.name = n;
  }
  if (input.category !== undefined) data.category = input.category;
  if (input.color !== undefined) data.color = input.color;
  if (input.wipLimit !== undefined) data.wipLimit = input.wipLimit;
  await prisma.$transaction(async (tx) => {
    await tx.workStatus.update({ where: { id: statusId }, data });
    if (input.category !== undefined && input.category !== s.category) {
      await assertWorkflowShape(tx, s.workflowId);
      // Đổi nhóm sang/khỏi DONE ⇒ cập nhật resolvedAt của các thẻ đang đứng ở đó,
      // để báo cáo (đọc resolvedAt) không lệch với trạng thái.
      if (input.category === 'DONE') await tx.workIssue.updateMany({ where: { statusId, resolvedAt: null }, data: { resolvedAt: new Date(), resolution: 'DONE' } });
      else if (s.category === 'DONE') await tx.workIssue.updateMany({ where: { statusId }, data: { resolvedAt: null, resolution: null } });
    }
  });
  touch(projectId, userId);
}

export async function reorderStatuses(userId: number, projectId: number, workflowId: number, statusIds: number[]) {
  await requireProject(userId, projectId, 'project.settings');
  await findWorkflow(projectId, workflowId);
  const current = await prisma.workStatus.findMany({ where: { workflowId }, select: { id: true } });
  if (current.length !== statusIds.length || !current.every((c) => statusIds.includes(c.id))) {
    throw new BadRequestError('Send every status of the workflow exactly once', 'WORK_BAD_ORDER');
  }
  await prisma.$transaction(statusIds.map((id, i) => prisma.workStatus.update({ where: { id }, data: { position: i } })));
  touch(projectId, userId);
}

/** Xoá trạng thái: thẻ đang ở đó chuyển sang `moveTo` (cùng quy trình). */
export async function deleteStatus(userId: number, projectId: number, statusId: number, moveTo?: number) {
  await requireProject(userId, projectId, 'project.settings');
  const s = await findStatus(projectId, statusId);
  const count = await prisma.workIssue.count({ where: { statusId } });
  let target: { id: number; category: string } | null = null;
  if (count) {
    if (!moveTo) throw new BadRequestError(`${count} issue(s) use this status — choose where to move them`, 'WORK_STATUS_IN_USE');
    const t = await prisma.workStatus.findFirst({ where: { id: moveTo, workflowId: s.workflowId }, select: { id: true, category: true } });
    if (!t || t.id === statusId) throw new BadRequestError('Choose another status of the same workflow', 'WORK_BAD_STATUS');
    target = t;
  }
  await prisma.$transaction(async (tx) => {
    if (target) {
      const moved = await tx.workIssue.findMany({ where: { statusId }, select: { id: true } });
      await tx.workIssue.updateMany({
        where: { statusId },
        data: {
          statusId: target.id, version: { increment: 1 },
          ...(target.category === 'DONE' ? {} : { resolvedAt: null, resolution: null }),
        },
      });
      if (target.category === 'DONE') await tx.workIssue.updateMany({ where: { id: { in: moved.map((m) => m.id) }, resolvedAt: null }, data: { resolvedAt: new Date(), resolution: 'DONE' } });
      await tx.workHistory.createMany({
        data: moved.map((m) => ({ issueId: m.id, actorId: userId, actorKind: 'USER', field: 'statusId', fromValue: String(statusId), toValue: String(target!.id) })),
      });
    }
    await tx.workTransition.deleteMany({ where: { OR: [{ fromStatusId: statusId }, { toStatusId: statusId }] } });
    await tx.workStatus.delete({ where: { id: statusId } });
    await assertWorkflowShape(tx, s.workflowId);
  });
  touch(projectId, userId);
}

/**
 * Đặt lại toàn bộ luồng chuyển. `mode: 'free'` = mọi trạng thái sang mọi
 * trạng thái (không lưu dòng nào). `restricted` = chỉ các cặp được liệt kê;
 * from null = "từ bất kỳ đâu".
 */
export async function setTransitions(
  userId: number,
  projectId: number,
  workflowId: number,
  input: { mode: 'free' | 'restricted'; transitions?: Array<{ from: number | null; to: number }> },
) {
  await requireProject(userId, projectId, 'project.settings');
  await findWorkflow(projectId, workflowId);
  const ids = new Set((await prisma.workStatus.findMany({ where: { workflowId }, select: { id: true } })).map((s) => s.id));
  const list = input.mode === 'free' ? [] : (input.transitions ?? []);
  for (const t of list) {
    if (!ids.has(t.to) || (t.from !== null && !ids.has(t.from))) throw new BadRequestError('A transition uses a status from another workflow', 'WORK_BAD_STATUS');
  }
  if (input.mode === 'restricted' && !list.length) throw new BadRequestError('Add at least one transition, or allow all', 'WORK_NO_TRANSITIONS');
  const uniq = [...new Map(list.map((t) => [`${t.from}-${t.to}`, t])).values()].filter((t) => t.from !== t.to);
  await prisma.$transaction([
    prisma.workTransition.deleteMany({ where: { workflowId } }),
    prisma.workTransition.createMany({ data: uniq.map((t) => ({ workflowId, fromStatusId: t.from, toStatusId: t.to })) }),
  ]);
  touch(projectId, userId);
}

/** Cột board tuỳ chỉnh (null = mặc định: mỗi trạng thái một cột). */
export async function setBoardColumns(userId: number, projectId: number, columns: Array<{ name: string; statusIds: number[]; wipLimit?: number | null }> | null) {
  await requireProject(userId, projectId, 'project.settings');
  if (columns) {
    const all = await prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true } });
    const allIds = new Set(all.map((s) => s.id));
    const used = new Set<number>();
    for (const c of columns) {
      if (!c.name.trim()) throw new BadRequestError('Every column needs a name', 'WORK_NAME_REQUIRED');
      for (const id of c.statusIds) {
        if (!allIds.has(id)) throw new BadRequestError('A column uses an unknown status', 'WORK_BAD_STATUS');
        if (used.has(id)) throw new BadRequestError('A status can only be in one column', 'WORK_BAD_STATUS');
        used.add(id);
      }
    }
    const missing = all.filter((s) => !used.has(s.id)).length;
    if (missing) throw new BadRequestError(`${missing} status(es) are not on any column — issues in them would disappear from the board`, 'WORK_UNMAPPED_STATUS');
  }
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const settings = { ...((cur.settings as object) ?? {}), boardColumns: columns?.map((c) => ({ name: c.name.trim().slice(0, 40), statusIds: c.statusIds, wipLimit: c.wipLimit ?? null })) ?? null };
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: settings as Prisma.InputJsonValue } });
  touch(projectId, userId);
}

// ─── Loại thẻ ────────────────────────────────────────────────────

export async function addIssueType(userId: number, projectId: number, input: { name: string; level: 0 | -1 | 1; color?: string; icon?: string; workflowId?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 40);
  if (!name) throw new BadRequestError('Type name is required', 'WORK_NAME_REQUIRED');
  const baseKey = name.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 14) || 'TYPE';
  let key = baseKey;
  for (let i = 2; await prisma.workIssueType.findFirst({ where: { projectId, key } }); i++) key = `${baseKey.slice(0, 12)}_${i}`;
  if (input.workflowId) await findWorkflow(projectId, input.workflowId);
  const pos = await prisma.workIssueType.count({ where: { projectId } });
  const t = await prisma.workIssueType.create({
    data: { projectId, key, name, level: input.level, color: input.color ?? '#0ea5e9', icon: input.icon ?? 'task', workflowId: input.workflowId ?? null, position: pos },
  });
  touch(projectId, userId);
  return t;
}

export async function updateIssueType(userId: number, projectId: number, typeId: number, input: { name?: string; color?: string; icon?: string; archived?: boolean; workflowId?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const t = await prisma.workIssueType.findFirst({ where: { id: typeId, projectId } });
  if (!t) throw new NotFoundError('Issue type not found');
  if (input.workflowId !== undefined && input.workflowId !== t.workflowId) {
    // Đổi quy trình của một loại đang có thẻ thì trạng thái của các thẻ đó sẽ không
    // còn thuộc quy trình mới — chặn thay vì để thẻ "mồ côi" trạng thái.
    const used = await prisma.workIssue.count({ where: { typeId, deletedAt: null } });
    if (used) throw new BadRequestError('Move or delete the issues of this type before changing its workflow', 'WORK_TYPE_IN_USE');
    if (input.workflowId) await findWorkflow(projectId, input.workflowId);
  }
  if (input.archived) {
    const others = await prisma.workIssueType.count({ where: { projectId, archived: false, level: 0, id: { not: typeId } } });
    if (t.level === 0 && !others) throw new BadRequestError('Keep at least one standard issue type', 'WORK_TYPE_LAST');
  }
  await prisma.workIssueType.update({
    where: { id: typeId },
    data: {
      ...(input.name?.trim() ? { name: input.name.trim().slice(0, 40) } : {}),
      ...(input.color ? { color: input.color } : {}),
      ...(input.icon ? { icon: input.icon } : {}),
      ...(input.archived !== undefined ? { archived: input.archived } : {}),
      ...(input.workflowId !== undefined ? { workflowId: input.workflowId } : {}),
    },
  });
  touch(projectId, userId);
}

/** Tạo quy trình mới (sao chép từ quy trình có sẵn nếu chỉ định). */
export async function createWorkflow(userId: number, projectId: number, input: { name: string; copyFrom?: number | null }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 80);
  if (!name) throw new BadRequestError('Workflow name is required', 'WORK_NAME_REQUIRED');
  const src = input.copyFrom
    ? await prisma.workWorkflow.findFirst({ where: { id: input.copyFrom, projectId }, include: { statuses: { orderBy: { position: 'asc' } }, transitions: true } })
    : null;
  const wf = await prisma.$transaction(async (tx) => {
    const created = await tx.workWorkflow.create({ data: { projectId, name } });
    const statuses = src?.statuses.length
      ? src.statuses
      : [{ id: 0, name: 'To Do', category: 'TODO', color: '#64748b', position: 0, wipLimit: null }, { id: -1, name: 'In Progress', category: 'IN_PROGRESS', color: '#2563eb', position: 1, wipLimit: null }, { id: -2, name: 'Done', category: 'DONE', color: '#16a34a', position: 2, wipLimit: null }];
    const map = new Map<number, number>();
    for (const s of statuses) {
      const n = await tx.workStatus.create({ data: { workflowId: created.id, name: s.name, category: s.category, color: s.color, position: s.position, wipLimit: s.wipLimit } });
      map.set(s.id, n.id);
    }
    if (src?.transitions.length) {
      await tx.workTransition.createMany({
        data: src.transitions.map((t) => ({ workflowId: created.id, fromStatusId: t.fromStatusId ? map.get(t.fromStatusId)! : null, toStatusId: map.get(t.toStatusId)!, name: t.name })),
      });
    }
    return created;
  });
  touch(projectId, userId);
  return wf;
}

// ─── Trường tuỳ chỉnh ────────────────────────────────────────────

export const CUSTOM_KINDS = ['TEXT', 'NUMBER', 'DATE', 'SELECT', 'MULTISELECT', 'USER', 'URL', 'CHECKBOX'] as const;
export type CustomKind = (typeof CUSTOM_KINDS)[number];

export async function listCustomFields(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  return prisma.workCustomField.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }] });
}

function cleanOptions(kind: CustomKind, options: Array<{ id?: string; label: string; color?: string }> | undefined, existing: Array<{ id: string }> = []) {
  if (kind !== 'SELECT' && kind !== 'MULTISELECT') return [];
  const out = (options ?? []).map((o) => ({ id: o.id && existing.some((e) => e.id === o.id) ? o.id : randomUUID().slice(0, 8), label: o.label.trim().slice(0, 60), color: o.color ?? '#64748b' })).filter((o) => o.label);
  if (!out.length) throw new BadRequestError('Add at least one option', 'WORK_NO_OPTIONS');
  if (new Set(out.map((o) => o.label.toLowerCase())).size !== out.length) throw new BadRequestError('Option labels must be unique', 'WORK_DUP_OPTION');
  return out;
}

export async function createCustomField(userId: number, projectId: number, input: { name: string; kind: CustomKind; options?: Array<{ label: string; color?: string }>; typeKeys?: string[] | null; required?: boolean }) {
  await requireProject(userId, projectId, 'project.settings');
  const name = input.name.trim().slice(0, 60);
  if (!name) throw new BadRequestError('Field name is required', 'WORK_NAME_REQUIRED');
  const reserved = ['status', 'type', 'priority', 'assignee', 'reporter', 'labels', 'sprint', 'summary', 'key', 'created', 'updated', 'due', 'resolved', 'parent', 'points', 'component'];
  if (reserved.includes(name.toLowerCase())) throw new BadRequestError(`"${name}" is a built-in field name`, 'WORK_RESERVED_NAME');
  const pos = await prisma.workCustomField.count({ where: { projectId } });
  try {
    const f = await prisma.workCustomField.create({
      data: {
        projectId, name, kind: input.kind, options: cleanOptions(input.kind, input.options) as Prisma.InputJsonValue,
        typeKeys: input.typeKeys?.length ? (input.typeKeys as Prisma.InputJsonValue) : Prisma.DbNull, required: input.required ?? false, position: pos,
      },
    });
    touch(projectId, userId);
    return f;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError(`A field named "${name}" already exists`);
    throw err;
  }
}

export async function updateCustomField(userId: number, projectId: number, fieldId: number, input: { name?: string; options?: Array<{ id?: string; label: string; color?: string }>; typeKeys?: string[] | null; required?: boolean; position?: number }) {
  await requireProject(userId, projectId, 'project.settings');
  const f = await prisma.workCustomField.findFirst({ where: { id: fieldId, projectId } });
  if (!f) throw new NotFoundError('Field not found');
  const data: Prisma.WorkCustomFieldUpdateInput = {};
  if (input.name !== undefined) {
    if (!input.name.trim()) throw new BadRequestError('Field name is required', 'WORK_NAME_REQUIRED');
    data.name = input.name.trim().slice(0, 60);
  }
  if (input.options !== undefined) {
    const next = cleanOptions(f.kind as CustomKind, input.options, f.options as Array<{ id: string }>);
    data.options = next as Prisma.InputJsonValue;
    // Lựa chọn bị bỏ ⇒ xoá giá trị đang trỏ vào nó (không để thẻ giữ id "ma").
    const keep = new Set(next.map((o) => o.id));
    const removed = (f.options as Array<{ id: string }>).filter((o) => !keep.has(o.id)).map((o) => o.id);
    if (removed.length && f.kind === 'SELECT') {
      await prisma.workCustomValue.deleteMany({ where: { fieldId, OR: removed.map((id) => ({ value: { equals: id } })) } });
    }
  }
  if (input.typeKeys !== undefined) data.typeKeys = input.typeKeys?.length ? (input.typeKeys as Prisma.InputJsonValue) : Prisma.DbNull;
  if (input.required !== undefined) data.required = input.required;
  if (input.position !== undefined) data.position = input.position;
  try {
    await prisma.workCustomField.update({ where: { id: fieldId }, data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A field with that name already exists');
    throw err;
  }
  touch(projectId, userId);
}

export async function deleteCustomField(userId: number, projectId: number, fieldId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const r = await prisma.workCustomField.deleteMany({ where: { id: fieldId, projectId } });
  if (!r.count) throw new NotFoundError('Field not found');
  touch(projectId, userId);
}

/** Kiểm + chuẩn hoá giá trị theo kiểu trường. null = xoá giá trị. */
function normalizeValue(f: { kind: string; options: unknown; name: string }, value: unknown): Prisma.InputJsonValue | null {
  if (value === null || value === undefined || value === '') return null;
  const bad = (): never => { throw new BadRequestError(`Invalid value for ${f.name}`, 'WORK_BAD_FIELD_VALUE'); };
  const opts = (f.options as Array<{ id: string }>) ?? [];
  switch (f.kind) {
    case 'TEXT': return typeof value === 'string' ? value.slice(0, 5000) : bad();
    case 'URL': return typeof value === 'string' && /^https?:\/\/\S+$/i.test(value) ? value.slice(0, 1000) : bad();
    case 'NUMBER': return typeof value === 'number' && Number.isFinite(value) ? value : bad();
    case 'DATE': return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : bad();
    case 'CHECKBOX': return typeof value === 'boolean' ? value : bad();
    case 'USER': return typeof value === 'number' && Number.isInteger(value) ? value : bad();
    case 'SELECT': return typeof value === 'string' && opts.some((o) => o.id === value) ? value : bad();
    case 'MULTISELECT': {
      if (!Array.isArray(value) || !value.every((v) => typeof v === 'string' && opts.some((o) => o.id === v))) return bad();
      return value.length ? [...new Set(value as string[])] : null;
    }
    default: return bad();
  }
}

export async function getCustomValues(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { customValues: { select: { fieldId: true, value: true } } } });
  if (!issue) throw new NotFoundError('Issue not found');
  return Object.fromEntries(issue.customValues.map((v) => [v.fieldId, v.value]));
}

export async function setCustomValues(userId: number, projectId: number, number: number, values: Record<string, unknown>) {
  await requireProject(userId, projectId, 'issue.edit');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, type: { select: { key: true } } } });
  if (!issue) throw new NotFoundError('Issue not found');
  const fields = await prisma.workCustomField.findMany({ where: { projectId } });
  const current = await prisma.workCustomValue.findMany({ where: { issueId: issue.id } });
  await prisma.$transaction(async (tx) => {
    for (const [idStr, raw] of Object.entries(values)) {
      const f = fields.find((x) => x.id === Number(idStr));
      if (!f) throw new BadRequestError('Unknown field', 'WORK_BAD_FIELD');
      const keys = f.typeKeys as string[] | null;
      if (keys?.length && !keys.includes(issue.type.key)) throw new BadRequestError(`${f.name} does not apply to this issue type`, 'WORK_BAD_FIELD');
      const v = normalizeValue(f, raw);
      if (v === null && f.required) throw new BadRequestError(`${f.name} is required`, 'WORK_FIELD_REQUIRED');
      const before = current.find((c) => c.fieldId === f.id)?.value ?? null;
      if (JSON.stringify(before) === JSON.stringify(v)) continue;
      if (v === null) await tx.workCustomValue.deleteMany({ where: { issueId: issue.id, fieldId: f.id } });
      else await tx.workCustomValue.upsert({ where: { issueId_fieldId: { issueId: issue.id, fieldId: f.id } }, create: { issueId: issue.id, fieldId: f.id, value: v }, update: { value: v } });
      await tx.workHistory.create({
        data: {
          issueId: issue.id, actorId: userId, actorKind: 'USER', field: `cf:${f.name}`.slice(0, 40),
          fromValue: before === null ? null : JSON.stringify(before).slice(0, 500), toValue: v === null ? null : JSON.stringify(v).slice(0, 500),
        },
      });
    }
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: issue.id, actor: { kind: 'USER', userId }, changes: [] });
  return getCustomValues(userId, projectId, number);
}

export { STATUS_CATEGORIES };
