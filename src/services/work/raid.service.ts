/**
 * CT Work — SỔ RAID (đợt S3b, mô-đun `raid`): Risks · Assumptions · Issues · Dependencies.
 *
 * Chuẩn tham chiếu: PMBOK® 7 (miền Uncertainty — risk register), PRINCE2 (Risk Register +
 * Issue Register), ISO 31000. Thang điểm + chiến lược theo content/quy-trinh/mau/so-dang-ky-rui-ro.md:
 * xác suất (L) 1–5 × ảnh hưởng (I) 1–5 = điểm; ≥ 15 cao · 8–14 trung bình · ≤ 7 thấp;
 * phản ứng Avoid / Mitigate / Transfer / Accept.
 *
 * Quyền (permissions.governanceAccess): MEMBER+ tạo/sửa, VIEWER/TEACHER xem, khách KHÔNG thấy
 * (không có tuyến nào trong danh sách trắng của cổng khách — chốt ở work.routes.ts trả
 * CLIENT_PORTAL_ONLY; dự án không bật cổng thì govCtx trả WORK_INTERNAL_ONLY).
 *
 * Nhắc "review due": cron 08:10 giờ VN (cron.service.ts) gọi `runRaidReviewReminders` — mỗi
 * dòng chưa đóng có ngày xem lại ≤ hôm nay được nhắc ĐÚNG MỘT LẦN cho mỗi ngày xem lại
 * (`reviewNotifiedFor`). Không dùng LLM ⇒ không bị LLM_BACKGROUND_ENABLED chặn.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import type { RaidResponse, RaidType } from './constants.js';
import { getTemplate } from './docTemplates.js';
import { emitWorkEvent } from './events.js';
import {
  RAID_PREFIX, RAID_THRESHOLDS, raidClosed, raidDefaultStatus, raidStatusesFor, reviewDue, riskLevel, riskMatrix, riskScore, starterRisksFromTemplate,
} from './governance.js';
import { dayOf, govCtx, nextNumber } from './governanceDb.js';
import { canDeleteGovernance, governanceAccess, loadProjectAccess } from './permissions.js';
import { vnDay } from './sprints.service.js';
import { modulesOf } from './studio.js';

const RAID_SELECT = {
  id: true, number: true, type: true, title: true, description: true, category: true, status: true, probability: true, impact: true, clientVisible: true,
  response: true, mitigation: true, trigger: true, reviewDate: true, closedAt: true, createdAt: true, updatedAt: true, version: true, createdById: true,
  owner: { select: PUBLIC_USER },
  _count: { select: { links: true } },
} satisfies Prisma.WorkRaidItemSelect;

type RaidRow = Prisma.WorkRaidItemGetPayload<{ select: typeof RAID_SELECT }>;

function present(r: RaidRow, today: string) {
  const score = riskScore(r.probability, r.impact);
  const reviewDate = dayOf(r.reviewDate);
  const { _count, ...rest } = r;
  return {
    ...rest,
    reviewDate,
    key: `${RAID_PREFIX[r.type as RaidType] ?? 'R'}-${r.number}`,
    score,
    level: riskLevel(score),
    closed: raidClosed(r.status),
    reviewDue: reviewDue({ status: r.status, reviewDate }, today),
    linkCount: _count.links,
  };
}

export async function listRaid(userId: number, projectId: number, q: { type?: RaidType; status?: string; probability?: number; impact?: number } = {}) {
  const ctx = await govCtx(userId, projectId, 'raid');
  const rows = await prisma.workRaidItem.findMany({ where: { projectId, deletedAt: null }, orderBy: { number: 'desc' }, take: 2000, select: RAID_SELECT });
  const today = vnDay();
  const all = rows.map((r) => present(r, today));
  const items = all.filter((r) => (!q.type || r.type === q.type) && (!q.status || r.status === q.status)
    && (!q.probability || r.probability === q.probability) && (!q.impact || r.impact === q.impact));
  const counts = Object.fromEntries((['RISK', 'ASSUMPTION', 'ISSUE', 'DEPENDENCY'] as const).map((t) => [t, {
    total: all.filter((r) => r.type === t).length,
    open: all.filter((r) => r.type === t && !r.closed).length,
  }]));
  return {
    today,
    items,
    matrix: riskMatrix(rows),
    counts,
    reviewDue: all.filter((r) => r.reviewDue).length,
    highRisks: all.filter((r) => r.type === 'RISK' && !r.closed && (r.score ?? 0) >= RAID_THRESHOLDS.HIGH).length,
    thresholds: RAID_THRESHOLDS,
    canEdit: ctx.canEdit,
  };
}

/** Top rủi ro đang mở theo điểm (widget dashboard "Top risks"). Mô-đun tắt / không xem được ⇒ null. */
export async function topRisks(userId: number, projectId: number, limit = 5) {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  if (!access.modules.raid || !governanceAccess(access.role, access.workspaceRole).view) return { enabled: false, items: [] };
  const rows = await prisma.workRaidItem.findMany({
    where: { projectId, deletedAt: null, type: 'RISK', status: { in: ['OPEN', 'MONITORING'] }, probability: { not: null }, impact: { not: null } },
    select: RAID_SELECT,
    take: 500,
  });
  const today = vnDay();
  const items = rows.map((r) => present(r, today)).sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.number - b.number).slice(0, Math.min(Math.max(limit, 1), 20));
  return { enabled: true, items };
}

// ─── Ghi ─────────────────────────────────────────────────────────

export interface RaidInput {
  type?: RaidType;
  title?: string;
  description?: string | null;
  category?: string | null;
  ownerId?: number | null;
  status?: string;
  probability?: number | null;
  impact?: number | null;
  response?: RaidResponse | null;
  mitigation?: string | null;
  trigger?: string | null;
  reviewDate?: Date | null;
  /** Đợt S4: được nêu trong báo cáo tuần cho khách (chỉ RISK; chỉ khi lịch báo cáo bật include risks). */
  clientVisible?: boolean;
}

async function assertOwner(projectId: number, uid: number | null | undefined) {
  if (!uid) return;
  const a = await loadProjectAccess(uid, projectId);
  if (!a || !governanceAccess(a.role, a.workspaceRole).view) throw new BadRequestError('The owner must be a member of the project team', 'WORK_BAD_USER');
}

function assertScale(v: number | null | undefined, what: string) {
  if (v === null || v === undefined) return;
  if (!Number.isInteger(v) || v < 1 || v > 5) throw new BadRequestError(`${what} must be 1–5`, 'VALIDATION_ERROR');
}

/** Giá trị cho dòng lịch sử. */
const hv = (v: unknown): string | null => (v === null || v === undefined ? null : v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 2000));

export async function createRaid(userId: number, projectId: number, input: RaidInput & { type: RaidType; title: string }) {
  await govCtx(userId, projectId, 'raid', { edit: true });
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  const status = input.status ?? raidDefaultStatus(input.type);
  if (!raidStatusesFor(input.type).includes(status)) throw new BadRequestError(`Status ${status} is not valid for ${input.type.toLowerCase()}`, 'VALIDATION_ERROR');
  assertScale(input.probability, 'Probability');
  assertScale(input.impact, 'Impact');
  await assertOwner(projectId, input.ownerId);
  const created = await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, 'raid', projectId);
    const r = await tx.workRaidItem.create({
      data: {
        projectId, number, type: input.type, title: title.slice(0, 255), description: input.description?.trim() || null,
        category: input.category?.trim().slice(0, 60) || null, ownerId: input.ownerId ?? userId, status,
        probability: input.probability ?? null, impact: input.impact ?? null, response: input.response ?? null,
        mitigation: input.mitigation?.trim() || null, trigger: input.trigger?.trim() || null, reviewDate: input.reviewDate ?? null,
        createdById: userId, closedAt: raidClosed(status) ? new Date() : null, clientVisible: input.clientVisible === true && input.type === 'RISK',
      },
      select: { id: true, number: true },
    });
    await tx.workRaidHistory.create({ data: { raidId: r.id, actorId: userId, field: 'created', toValue: `${input.type} · ${status}` } });
    return r;
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number: created.number, action: 'created', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'raid.create', targetType: 'raid', targetId: created.id, summary: `Added ${input.type.toLowerCase()} ${RAID_PREFIX[input.type]}-${created.number}: ${title}`.slice(0, 300) });
  return getRaid(userId, projectId, created.number);
}

async function findRaid(projectId: number, number: number) {
  const r = await prisma.workRaidItem.findFirst({ where: { projectId, number, deletedAt: null } });
  if (!r) throw new NotFoundError('RAID item not found');
  return r;
}

export async function getRaid(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'raid');
  const r = await prisma.workRaidItem.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      ...RAID_SELECT,
      createdBy: { select: PUBLIC_USER },
      links: {
        orderBy: { id: 'asc' },
        select: {
          id: true,
          issue: { select: { number: true, title: true, deletedAt: true, resolvedAt: true, status: { select: { name: true, category: true } } } },
          stage: { select: { id: true, n: true, name: true, status: true } },
          changeRequest: { select: { number: true, title: true, status: true, deletedAt: true } },
        },
      },
      history: { orderBy: { id: 'desc' }, take: 100, select: { id: true, field: true, fromValue: true, toValue: true, createdAt: true, actor: { select: PUBLIC_USER } } },
    },
  });
  if (!r) throw new NotFoundError('RAID item not found');
  const { links, history, createdBy, ...row } = r;
  return {
    ...present(row, vnDay()),
    createdBy,
    links: links
      .filter((l) => !(l.issue?.deletedAt) && !(l.changeRequest?.deletedAt))
      .map((l) => ({
        id: l.id,
        issue: l.issue ? { number: l.issue.number, key: `${ctx.access.key}-${l.issue.number}`, title: l.issue.title, done: !!l.issue.resolvedAt, status: l.issue.status } : null,
        stage: l.stage,
        changeRequest: l.changeRequest ? { number: l.changeRequest.number, key: `CR-${l.changeRequest.number}`, title: l.changeRequest.title, status: l.changeRequest.status } : null,
      })),
    history,
    statuses: raidStatusesFor(r.type as RaidType),
    canEdit: ctx.canEdit,
    canDelete: canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, r.createdById),
  };
}

export async function updateRaid(userId: number, projectId: number, number: number, input: RaidInput, expectedVersion?: number) {
  await govCtx(userId, projectId, 'raid', { edit: true });
  const cur = await findRaid(projectId, number);
  const type = (input.type ?? cur.type) as RaidType;
  let status = input.status ?? cur.status;
  // Đổi loại Assumption ⇄ khác: trạng thái cũ không hợp lệ nữa ⇒ về mặc định của loại mới.
  if (input.type && input.status === undefined && !raidStatusesFor(type).includes(status)) status = raidDefaultStatus(type);
  if (!raidStatusesFor(type).includes(status)) throw new BadRequestError(`Status ${status} is not valid for ${type.toLowerCase()}`, 'VALIDATION_ERROR');
  if (input.title !== undefined && !input.title.trim()) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  assertScale(input.probability, 'Probability');
  assertScale(input.impact, 'Impact');
  if (input.ownerId !== undefined) await assertOwner(projectId, input.ownerId);

  const next: Record<string, unknown> = {
    type, status,
    ...(input.title !== undefined ? { title: input.title.trim().slice(0, 255) } : {}),
    ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
    ...(input.category !== undefined ? { category: input.category?.trim().slice(0, 60) || null } : {}),
    ...(input.ownerId !== undefined ? { ownerId: input.ownerId } : {}),
    ...(input.probability !== undefined ? { probability: input.probability } : {}),
    ...(input.impact !== undefined ? { impact: input.impact } : {}),
    ...(input.response !== undefined ? { response: input.response } : {}),
    ...(input.mitigation !== undefined ? { mitigation: input.mitigation?.trim() || null } : {}),
    ...(input.trigger !== undefined ? { trigger: input.trigger?.trim() || null } : {}),
    ...(input.reviewDate !== undefined ? { reviewDate: input.reviewDate } : {}),
    // Đợt S4: chỉ rủi ro (RISK) mới được nêu trong báo cáo khách; đổi loại khác RISK ⇒ tự bỏ cờ.
    ...(input.clientVisible !== undefined || type !== 'RISK' ? { clientVisible: type === 'RISK' && (input.clientVisible ?? cur.clientVisible) } : {}),
  };
  const changes = Object.entries(next)
    .filter(([k, v]) => hv((cur as Record<string, unknown>)[k]) !== hv(v))
    .map(([field, v]) => ({ field, fromValue: hv((cur as Record<string, unknown>)[field]), toValue: hv(v) }));
  if (!changes.length) return getRaid(userId, projectId, number);
  const becameClosed = !raidClosed(cur.status) && raidClosed(status);
  const reopened = raidClosed(cur.status) && !raidClosed(status);

  await prisma.$transaction(async (tx) => {
    const res = await tx.workRaidItem.updateMany({
      where: { id: cur.id, ...(expectedVersion !== undefined ? { version: expectedVersion } : {}) },
      data: {
        ...(next as Prisma.WorkRaidItemUncheckedUpdateManyInput),
        version: { increment: 1 },
        ...(becameClosed ? { closedAt: new Date() } : reopened ? { closedAt: null } : {}),
        // Đổi ngày xem lại ⇒ được nhắc lại cho ngày mới.
        ...(input.reviewDate !== undefined && hv(input.reviewDate) !== hv(cur.reviewDate) ? { reviewNotifiedFor: null } : {}),
      },
    });
    if (!res.count) throw new ConflictError('Someone else changed this item — reload to see their version');
    await tx.workRaidHistory.createMany({ data: changes.map((c) => ({ raidId: cur.id, actorId: userId, ...c })) });
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'updated', actor: { kind: 'USER', userId } });
  return getRaid(userId, projectId, number);
}

export async function deleteRaid(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'raid');
  const r = await findRaid(projectId, number);
  if (!canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, r.createdById)) throw new ForbiddenError('Only the author or a project admin can delete this item');
  await prisma.workRaidItem.update({ where: { id: r.id }, data: { deletedAt: new Date() } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'deleted', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'raid.delete', targetType: 'raid', targetId: r.id, summary: `Deleted RAID item ${RAID_PREFIX[r.type as RaidType] ?? 'R'}-${number}: ${r.title}`.slice(0, 300) });
  return { deleted: true };
}

// ─── Liên kết ────────────────────────────────────────────────────

export async function addRaidLink(userId: number, projectId: number, number: number, input: { issueNumber?: number; stageId?: number; crNumber?: number }) {
  await govCtx(userId, projectId, 'raid', { edit: true });
  const r = await findRaid(projectId, number);
  const given = [input.issueNumber, input.stageId, input.crNumber].filter((x) => x !== undefined && x !== null).length;
  if (given !== 1) throw new BadRequestError('Link exactly one issue, stage or change request', 'VALIDATION_ERROR');
  const data: Prisma.WorkRaidLinkUncheckedCreateInput = { raidId: r.id, createdById: userId };
  if (input.issueNumber) {
    const i = await prisma.workIssue.findFirst({ where: { projectId, number: input.issueNumber, deletedAt: null }, select: { id: true } });
    if (!i) throw new BadRequestError('Issue not found in this project', 'WORK_BAD_ISSUE');
    data.issueId = i.id;
  } else if (input.stageId) {
    const st = await prisma.workStage.findFirst({ where: { id: input.stageId, projectId }, select: { id: true } });
    if (!st) throw new BadRequestError('Stage not found in this project', 'WORK_BAD_STAGE');
    data.stageId = st.id;
  } else if (input.crNumber) {
    const c = await prisma.workChangeRequest.findFirst({ where: { projectId, number: input.crNumber, deletedAt: null }, select: { id: true } });
    if (!c) throw new BadRequestError('Change request not found in this project', 'WORK_BAD_CR');
    data.changeRequestId = c.id;
  }
  const dup = await prisma.workRaidLink.findFirst({ where: { raidId: r.id, issueId: data.issueId ?? null, stageId: data.stageId ?? null, changeRequestId: data.changeRequestId ?? null }, select: { id: true } });
  if (dup) throw new ConflictError('Already linked');
  await prisma.$transaction([
    prisma.workRaidLink.create({ data }),
    prisma.workRaidHistory.create({ data: { raidId: r.id, actorId: userId, field: 'link', toValue: input.issueNumber ? `issue #${input.issueNumber}` : input.crNumber ? `CR-${input.crNumber}` : `stage ${input.stageId}` } }),
  ]);
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'links', actor: { kind: 'USER', userId } });
  return getRaid(userId, projectId, number);
}

export async function removeRaidLink(userId: number, projectId: number, number: number, linkId: number) {
  await govCtx(userId, projectId, 'raid', { edit: true });
  const r = await findRaid(projectId, number);
  const res = await prisma.workRaidLink.deleteMany({ where: { id: linkId, raidId: r.id } });
  if (!res.count) throw new NotFoundError('Link not found');
  await prisma.workRaidHistory.create({ data: { raidId: r.id, actorId: userId, field: 'unlink', fromValue: `link #${linkId}` } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'raid', number, action: 'links', actor: { kind: 'USER', userId } });
  return getRaid(userId, projectId, number);
}

/**
 * "Start from the template": thêm các rủi ro mẫu của so-dang-ky-rui-ro.md (R01…) chưa có
 * (so theo tiêu đề) — chưa chấm điểm, để đội tự chấm L × I.
 */
export async function importStarterRisks(userId: number, projectId: number) {
  await govCtx(userId, projectId, 'raid', { edit: true });
  const t = await getTemplate('so-dang-ky-rui-ro');
  const starters = starterRisksFromTemplate(t.markdown);
  const have = new Set((await prisma.workRaidItem.findMany({ where: { projectId, deletedAt: null }, select: { title: true } })).map((r) => r.title));
  let added = 0;
  for (const s of starters) {
    if (have.has(s.title)) continue;
    await createRaid(userId, projectId, { type: 'RISK', title: s.title, category: s.category, response: (s.response as RaidResponse | null) ?? null, mitigation: s.mitigation, trigger: s.trigger });
    added += 1;
  }
  return { added, total: starters.length };
}

// ─── Nhắc xem lại (cron) ─────────────────────────────────────────

/** Nhắc người phụ trách mọi dòng RAID tới hạn xem lại. Trả số lời nhắc đã gửi. */
export async function runRaidReviewReminders(now = new Date()): Promise<number> {
  const today = vnDay(now);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const rows = await prisma.workRaidItem.findMany({
    where: {
      deletedAt: null, reviewDate: { lte: todayDate }, status: { notIn: ['CLOSED', 'VALIDATED', 'INVALID'] },
      project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } },
    },
    take: 2000,
    select: {
      id: true, number: true, type: true, title: true, reviewDate: true, reviewNotifiedFor: true, ownerId: true, createdById: true,
      project: { select: { id: true, key: true, settings: true, workspace: { select: { slug: true } } } },
    },
  });
  const { notifyWork } = await import('./notify.js');
  let sent = 0;
  for (const r of rows) {
    // Đã nhắc cho đúng ngày xem lại này ⇒ thôi (đổi ngày xem lại ⇒ reviewNotifiedFor bị xoá).
    if (r.reviewNotifiedFor && r.reviewDate && r.reviewNotifiedFor.getTime() >= r.reviewDate.getTime()) continue;
    if (!modulesOf(r.project.settings).raid) continue;
    const receiver = r.ownerId ?? r.createdById;
    try {
      if (receiver) {
        const key = `${RAID_PREFIX[r.type as RaidType] ?? 'R'}-${r.number}`;
        const sender = await reminderSender(r.project.id, receiver, r.createdById);
        const payload = { issueKey: `${r.project.key} · ${key}`, title: r.title, message: `Review due: ${key} ${r.title}`.slice(0, 200), url: `/work/${r.project.workspace.slug}/${r.project.key}/raid?item=${r.number}` };
        if (sender) {
          await notifyWork({ receiverId: receiver, senderId: sender, type: 'WORK_ALERT', entityId: r.id, payload });
        } else {
          // Dự án một người: chuông cần người gửi khác người nhận (tự báo cho mình bị bỏ qua) ⇒ chỉ email.
          await emailOnly(receiver, `Review due: ${key} ${r.title}`, payload.url);
        }
        sent += 1;
      }
      await prisma.workRaidItem.update({ where: { id: r.id }, data: { reviewNotifiedFor: r.reviewDate } });
    } catch (err) {
      logger.warn('[work] nhắc xem lại RAID lỗi', { raidId: r.id, err: (err as Error).message });
    }
  }
  return sent;
}

/**
 * Người "gửi" lời nhắc: chuông bỏ qua thông báo tự gửi cho mình (notification.service), nên
 * chọn một người KHÁC người nhận — lead dự án, người tạo dòng, rồi ADMIN dự án, rồi chủ không gian.
 */
async function reminderSender(projectId: number, receiver: number, createdById: number | null): Promise<number | null> {
  const p = await prisma.workProject.findUnique({
    where: { id: projectId },
    select: {
      leadId: true,
      members: { where: { role: 'ADMIN' }, select: { userId: true } },
      workspace: { select: { members: { where: { role: { in: ['OWNER', 'ADMIN'] } }, select: { userId: true } } } },
    },
  });
  const cands = [p?.leadId ?? null, createdById, ...(p?.members.map((m) => m.userId) ?? []), ...(p?.workspace.members.map((m) => m.userId) ?? [])];
  return cands.find((u): u is number => !!u && u !== receiver) ?? null;
}

async function emailOnly(userId: number, subject: string, url: string) {
  if (process.env.WORK_EMAIL_NOTIFICATIONS === 'false') return;
  const { getNotifySettings } = await import('./notify.js');
  if ((await getNotifySettings(userId)).emailMode === 'OFF') return;
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, enabled: true } });
  if (!u?.enabled || !u.email) return;
  const { frontendUrl, sendWorkEmail } = await import('./common.js');
  await sendWorkEmail({ to: u.email, subject: `CT Work: ${subject}`.slice(0, 240), heading: subject, lines: ['A RAID item you own is due for review.'], cta: { label: 'Open the RAID log', url: frontendUrl(url) } });
}
