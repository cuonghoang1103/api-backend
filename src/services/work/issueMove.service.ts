/**
 * CT Work — CHUYỂN THẺ SANG DỰ ÁN KHÁC trong cùng không gian (lớp studio S1).
 *
 * Thẻ GIỮ NGUYÊN id ⇒ bình luận, tệp, lịch sử, người theo dõi, worklog, liên
 * kết (hai chiều), hoạt động GitHub đều đi theo mà không phải chép. Đổi:
 *   - mã: số mới cấp từ bộ đếm của dự án đích (khoá dòng như createIssue); mã
 *     cũ ghi vào work_issue_aliases ⇒ link cũ trả 404 WORK_ISSUE_MOVED kèm mã mới;
 *   - loại thẻ: theo `key` (STORY → STORY); dự án đích thiếu loại ⇒ từ chối;
 *   - trạng thái: trùng tên ⇒ giữ; không thì trạng thái đầu tiên cùng nhóm
 *     (TODO/IN_PROGRESS/DONE) của quy trình đích;
 *   - nhãn/component/trường tuỳ chỉnh: ghép theo TÊN (trường: tên + kiểu; lựa
 *     chọn theo id), không có bên đích thì bỏ;
 *   - sprint, version, epic cha, giai đoạn: về trống (thuộc dự án cũ);
 *   - bộ phận: giữ (cấp không gian) nếu dự án đích bật mô-đun teams.
 * Việc con đi cùng thẻ cha (số mới, cùng quy tắc).
 *
 * TỪ CHỐI (rõ lý do, không làm dở): epic (kéo theo cả cây), việc con (chuyển
 * thẻ cha), thẻ Test (gắn kế hoạch/chu kỳ kiểm thử của dự án cũ), thẻ còn phê
 * duyệt hoặc bàn giao đang chờ.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { emitWorkEvent } from './events.js';
import { can, canDeleteIssue, requireProject } from './permissions.js';
import { rankAfter, rankInitial } from './rank.js';
import { modulesOf } from './studio.js';

type Tx = Prisma.TransactionClient;

interface StatusRow { id: number; name: string; category: string; position: number }

/** Trạng thái đích: trùng tên trước, rồi trạng thái đầu tiên cùng nhóm, rồi trạng thái đầu tiên. */
export function mapStatus(from: { name: string; category: string }, target: StatusRow[]): StatusRow | null {
  const sorted = [...target].sort((a, b) => a.position - b.position);
  return sorted.find((s) => s.name.toLowerCase() === from.name.toLowerCase())
    ?? sorted.find((s) => s.category === from.category)
    ?? sorted[0] ?? null;
}

async function targetStatuses(tx: Tx, projectId: number, typeWorkflowId: number | null) {
  const wfId = typeWorkflowId ?? (await tx.workWorkflow.findFirst({ where: { projectId, isDefault: true }, select: { id: true } }))?.id;
  if (!wfId) throw new BadRequestError('The target project has no default workflow', 'WORK_NO_WORKFLOW');
  return tx.workStatus.findMany({ where: { workflowId: wfId }, select: { id: true, name: true, category: true, position: true } });
}

export async function moveIssueToProject(
  userId: number, projectId: number, number: number,
  input: { targetProjectId: number; version?: number },
) {
  if (input.targetProjectId === projectId) throw new BadRequestError('The issue is already in this project', 'WORK_MOVE_SAME');
  const src = await requireProject(userId, projectId, 'issue.edit');
  const dst = await requireProject(userId, input.targetProjectId, 'issue.edit');
  if (src.workspaceId !== dst.workspaceId) throw new BadRequestError('Issues can only move between projects of the same workspace', 'WORK_MOVE_WORKSPACE');

  const issue = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      id: true, number: true, reporterId: true, version: true, teamId: true,
      type: { select: { key: true, level: true, name: true } },
      _count: { select: { approvals: { where: { status: 'PENDING' } }, handoffs: { where: { status: 'PENDING' } } } },
    },
  });
  if (!issue) throw new NotFoundError('Issue not found');
  // Chuyển = rút thẻ khỏi dự án cũ ⇒ cần quyền như xoá (ADMIN, hoặc người báo còn quyền sửa).
  if (!canDeleteIssue(src.role, userId, issue.reporterId)) throw new ForbiddenError('Only a project admin or the reporter can move this issue to another project');
  if (issue.type.level === 1) throw new BadRequestError('Epics cannot be moved — move their issues instead', 'WORK_MOVE_EPIC');
  if (issue.type.level === -1) throw new BadRequestError('Move the parent issue instead of a sub-task', 'WORK_MOVE_SUBTASK');
  if (issue.type.key === 'TEST') throw new BadRequestError('Test issues belong to this project\'s test plans and cannot be moved', 'WORK_MOVE_TEST');
  if (issue._count.approvals || issue._count.handoffs) throw new ConflictError('Finish or cancel the pending approval/handoff on this issue first');
  if (input.version !== undefined && input.version !== issue.version) throw new ConflictError('Someone else just changed this issue. Reload to see the latest version.');

  const result = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_issues WHERE id = ${issue.id} FOR UPDATE`;
    const fresh = await tx.workIssue.findFirst({ where: { id: issue.id, projectId, deletedAt: null }, select: { version: true } });
    if (!fresh || (input.version !== undefined && fresh.version !== input.version)) throw new ConflictError('Someone else just changed this issue. Reload to see the latest version.');

    const children = await tx.workIssue.findMany({
      where: { parentId: issue.id, deletedAt: null },
      orderBy: [{ rank: 'asc' }, { id: 'asc' }],
      select: { id: true, number: true },
    });
    const movingIds = [issue.id, ...children.map((c) => c.id)];
    const rows = await tx.workIssue.findMany({
      where: { id: { in: movingIds } },
      select: {
        id: true, number: true, parentId: true, resolvedAt: true, resolution: true,
        type: { select: { key: true } }, status: { select: { name: true, category: true } },
        labels: { select: { label: { select: { name: true } } } },
        components: { select: { component: { select: { name: true } } } },
        customValues: { select: { fieldId: true, value: true, field: { select: { name: true, kind: true } } } },
      },
    });

    // Bộ tra của dự án đích.
    const [types, labels, comps, fields, dstProject] = await Promise.all([
      tx.workIssueType.findMany({ where: { projectId: dst.projectId, archived: false }, select: { id: true, key: true, workflowId: true } }),
      tx.workLabel.findMany({ where: { projectId: dst.projectId }, select: { id: true, name: true } }),
      tx.workComponent.findMany({ where: { projectId: dst.projectId }, select: { id: true, name: true } }),
      tx.workCustomField.findMany({ where: { projectId: dst.projectId }, select: { id: true, name: true, kind: true, options: true } }),
      tx.workProject.findUniqueOrThrow({ where: { id: dst.projectId }, select: { settings: true } }),
    ]);
    const keepTeam = modulesOf(dstProject.settings).teams;

    // Cấp số: khoá dòng dự án đích, xin một lượt đủ cho cả thẻ cha + việc con.
    const counter = await tx.$queryRaw<Array<{ issue_counter: number }>>`
      UPDATE work_projects SET issue_counter = issue_counter + ${movingIds.length}
      WHERE id = ${dst.projectId} AND deleted_at IS NULL RETURNING issue_counter`;
    if (!counter.length) throw new NotFoundError('Target project not found');
    let nextNumber = counter[0].issue_counter - movingIds.length + 1;
    const last = await tx.workIssue.findFirst({ where: { projectId: dst.projectId }, orderBy: { rank: 'desc' }, select: { rank: true } });
    let rank = last ? rankAfter(last.rank) : rankInitial();

    const dropped: string[] = [];
    const moved: Array<{ id: number; from: number; to: number }> = [];
    // Thẻ cha trước, việc con sau (đúng thứ tự số).
    const ordered = [rows.find((r) => r.id === issue.id)!, ...children.map((c) => rows.find((r) => r.id === c.id)!)];
    for (const r of ordered) {
      const type = types.find((t) => t.key === r.type.key);
      if (!type) throw new BadRequestError(`The target project has no "${r.type.key}" issue type`, 'WORK_MOVE_TYPE');
      const status = mapStatus(r.status, await targetStatuses(tx, dst.projectId, type.workflowId));
      if (!status) throw new BadRequestError('The target workflow has no statuses', 'WORK_NO_STATUS');
      const done = status.category === 'DONE';
      const newNumber = nextNumber++;
      await tx.workIssue.update({
        where: { id: r.id },
        data: {
          projectId: dst.projectId, number: newNumber, typeId: type.id, statusId: status.id,
          sprintId: null, fixVersionId: null, stageId: null,
          ...(r.id === issue.id ? { parentId: null } : {}),
          ...(keepTeam ? {} : { teamId: null }),
          rank,
          resolvedAt: done ? (r.resolvedAt ?? new Date()) : null,
          resolution: done ? (r.resolution ?? 'DONE') : null,
          version: { increment: 1 },
        },
      });
      rank = rankAfter(rank);

      // Nhãn / component theo tên.
      const lblIds = r.labels.map((l) => labels.find((x) => x.name.toLowerCase() === l.label.name.toLowerCase())?.id).filter((x): x is number => !!x);
      const cmpIds = r.components.map((c) => comps.find((x) => x.name.toLowerCase() === c.component.name.toLowerCase())?.id).filter((x): x is number => !!x);
      if (lblIds.length < r.labels.length) dropped.push(`${r.labels.length - lblIds.length} label(s)`);
      if (cmpIds.length < r.components.length) dropped.push(`${r.components.length - cmpIds.length} component(s)`);
      await tx.workIssueLabel.deleteMany({ where: { issueId: r.id } });
      if (lblIds.length) await tx.workIssueLabel.createMany({ data: [...new Set(lblIds)].map((labelId) => ({ issueId: r.id, labelId })) });
      await tx.workIssueComponent.deleteMany({ where: { issueId: r.id } });
      if (cmpIds.length) await tx.workIssueComponent.createMany({ data: [...new Set(cmpIds)].map((componentId) => ({ issueId: r.id, componentId })) });

      // Trường tuỳ chỉnh: tên + kiểu; SELECT/MULTISELECT chỉ giữ lựa chọn có ở trường đích.
      const values: Array<{ fieldId: number; value: Prisma.InputJsonValue }> = [];
      for (const v of r.customValues) {
        const f = fields.find((x) => x.name.toLowerCase() === v.field.name.toLowerCase() && x.kind === v.field.kind);
        if (!f) { dropped.push(`field ${v.field.name}`); continue; }
        const opts = new Set(((f.options as Array<{ id: string }>) ?? []).map((o) => o.id));
        if (f.kind === 'SELECT') {
          if (typeof v.value === 'string' && opts.has(v.value)) values.push({ fieldId: f.id, value: v.value });
          else dropped.push(`field ${v.field.name}`);
        } else if (f.kind === 'MULTISELECT') {
          const kept = Array.isArray(v.value) ? (v.value as unknown[]).filter((x): x is string => typeof x === 'string' && opts.has(x)) : [];
          if (kept.length) values.push({ fieldId: f.id, value: kept });
        } else {
          values.push({ fieldId: f.id, value: v.value as Prisma.InputJsonValue });
        }
      }
      await tx.workCustomValue.deleteMany({ where: { issueId: r.id } });
      // Liên kết tài liệu (S2a) thuộc dự án CŨ — trang không đi theo thẻ ⇒ gỡ.
      await tx.workPageIssueLink.deleteMany({ where: { issueId: r.id } });
      if (values.length) await tx.workCustomValue.createMany({ data: values.map((x) => ({ issueId: r.id, ...x })) });

      // Mã cũ ⇒ thẻ (link cũ vẫn tìm ra). Mã cũ chưa từng là bí danh của thẻ khác vì số chỉ tăng.
      await tx.workIssueAlias.create({ data: { projectId: src.projectId, number: r.number, issueId: r.id } });
      await tx.workHistory.create({
        data: { issueId: r.id, actorId: userId, actorKind: 'USER', field: 'project', fromValue: `${src.key}-${r.number}`, toValue: `${dst.key}-${newNumber}` },
      });
      moved.push({ id: r.id, from: r.number, to: newNumber });
    }

    // Bản ghi phụ có projectId riêng đi theo thẻ; cổng giai đoạn cũ thôi trỏ vào thẻ.
    await tx.workDevActivity.updateMany({ where: { issueId: { in: movingIds } }, data: { projectId: dst.projectId } });
    await tx.workApproval.updateMany({ where: { issueId: { in: movingIds } }, data: { projectId: dst.projectId } });
    await tx.workHandoff.updateMany({ where: { issueId: { in: movingIds } }, data: { projectId: dst.projectId } });
    await tx.workStage.updateMany({ where: { projectId: src.projectId, gateIssueId: { in: movingIds } }, data: { gateIssueId: null } });
    return { moved, dropped: [...new Set(dropped)] };
  });

  for (const m of result.moved) {
    emitWorkEvent({ type: 'issue.deleted', projectId: src.projectId, issueId: m.id, actor: { kind: 'USER', userId } });
    emitWorkEvent({
      type: 'issue.updated', projectId: dst.projectId, issueId: m.id, actor: { kind: 'USER', userId },
      changes: [{ field: 'project', from: `${src.key}-${m.from}`, to: `${dst.key}-${m.to}` }],
    });
  }
  const head = result.moved[0];
  await auditProject(src.projectId, {
    actorId: userId, action: 'issue.move', targetType: 'issue', targetId: head.id,
    summary: `Moved ${src.key}-${head.from} to ${dst.key}-${head.to}${result.moved.length > 1 ? ` with ${result.moved.length - 1} sub-task(s)` : ''}`,
    detail: { dropped: result.dropped, targetProjectId: dst.projectId },
  });
  return {
    issueId: head.id, projectId: dst.projectId, key: `${dst.key}-${head.to}`, number: head.to,
    subtasks: result.moved.slice(1).map((m) => ({ from: `${src.key}-${m.from}`, to: `${dst.key}-${m.to}` })),
    dropped: result.dropped,
    canEditTarget: can(dst.role, 'issue.edit'),
  };
}
