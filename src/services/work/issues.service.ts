/**
 * CT Work — thẻ việc theo góc nhìn NGƯỜI DÙNG: mỗi hàm kiểm quyền rồi mới
 * gọi xuống issueChange.ts. Route và trợ lý AI (đợt 4) đều gọi các hàm này
 * với đúng userId của người đang thao tác, nên AI không thể làm được điều gì
 * mà người hỏi không làm được.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import {
  getSignedDownloadUrl, getSignedUploadUrl, headObject, deleteObject,
} from '../../config/r2.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { displayName, PUBLIC_USER } from './common.js';
import type { CommentVisibility, IssueTypeKey, LinkType } from './constants.js';
export { commentVisibilityFor } from './permissions.js';
import { emitWorkEvent, projectRoom, type WorkActor } from './events.js';
import { getIO } from '../../socket/messaging.socket.js';
import { DEFAULT_TEMPLATE_NAMES, defaultIssueTemplate, type IssueTemplateDoc } from './templates.js';
import { applyIssueChange, createIssue, moveIssue, type IssuePatch, type MoveInput } from './issueChange.js';
import { clientPeopleIds, maskUser, peopleFilterFor, TEAM_USER, type PeopleFilter } from './clientPeople.js';
import { canDeleteIssue, canModifyComment, commentVisibilityFor, isClientScoped, loadProjectAccess, requireProject, type ProjectAccess } from './permissions.js';
import { assertModule } from './studio.js';
import { tiptapToText } from './tiptapText.js';
import { logger } from '../../utils/logger.js';

const userActor = (userId: number): WorkActor => ({ kind: 'USER', userId });
/**
 * Thao tác do trợ lý AI đề xuất và người dùng bấm "Apply": vẫn chạy dưới quyền
 * của CHÍNH người đó, nhưng lịch sử ghi actorKind AI ⇒ báo cáo đóng góp không
 * cộng công cho ai (đúng luật "AI không làm hộ điểm").
 */
export type Via = 'USER' | 'AI';
const actorOf = (userId: number, via: Via = 'USER', model?: string | null): WorkActor => ({ kind: via, userId, ...(via === 'AI' && model ? { model } : {}) });

/** Trường của một thẻ trên board/danh sách — gọn, không mô tả. */
export const CARD_SELECT = {
  id: true, number: true, title: true, typeId: true, statusId: true, parentId: true, sprintId: true, fixVersionId: true,
  teamId: true, stageId: true, clientVisible: true,
  // Đợt S6: nhãn "AI-assisted" (nguồn gốc AI) hiện trên thẻ/danh sách.
  aiAssisted: true,
  priority: true, assigneeId: true, reporterId: true, storyPoints: true, dueDate: true, rank: true, version: true,
  resolvedAt: true, createdAt: true, updatedAt: true,
  labels: { select: { labelId: true } },
  parent: { select: { number: true } },
  _count: { select: { children: { where: { deletedAt: null } }, comments: { where: { deletedAt: null } }, attachments: true } },
} satisfies Prisma.WorkIssueSelect;

type CardRow = Prisma.WorkIssueGetPayload<{ select: typeof CARD_SELECT }>;

export function toCard(r: CardRow) {
  const { labels, _count, parent, ...rest } = r;
  return {
    ...rest,
    parentNumber: parent?.number ?? null,
    labelIds: labels.map((l) => l.labelId),
    subtaskCount: _count.children,
    commentCount: _count.comments,
    attachmentCount: _count.attachments,
  };
}

async function findIssue(projectId: number, number: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, reporterId: true, clientVisible: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

// ─── Cổng khách (đợt S2b): lọc cho khách bị cách ly ───────────────

/**
 * Điều kiện thêm vào MỌI truy vấn thẻ đọc cho người xem này: khách bị cách ly
 * (vai CLIENT + clientPortal) chỉ thấy thẻ ĐÃ CHIA SẺ; người khác không thêm gì.
 */
export function clientIssueWhere(access: Pick<ProjectAccess, 'role' | 'modules'>): Prisma.WorkIssueWhereInput {
  return isClientScoped(access) ? { clientVisible: true } : {};
}

/**
 * Thẻ gọn cho khách bị cách ly: bỏ số đếm gồm cả phần CHƯA chia sẻ (bình luận nội
 * bộ, tệp nội bộ, việc con nội bộ) và điểm ước lượng (số liệu nội bộ).
 */
export function scrubCardForClient<T extends Record<string, unknown>>(card: T, scoped: boolean): T {
  if (!scoped) return card;
  return { ...card, commentCount: null, attachmentCount: null, subtaskCount: null, storyPoints: null, teamId: null, version: 0 };
}

/** Như findIssue, nhưng thẻ chưa chia sẻ ⇒ 404 với khách bị cách ly (không lộ là thẻ tồn tại). */
async function findVisibleIssue(access: ProjectAccess, number: number) {
  const i = await findIssue(access.projectId, number);
  if (isClientScoped(access) && !i.clientVisible) throw new NotFoundError('Issue not found');
  return i;
}

// ─── Đọc ─────────────────────────────────────────────────────────

export interface IssueFilters {
  statusIds?: number[];
  typeIds?: number[];
  /** 0 = chưa giao cho ai. */
  assigneeIds?: number[];
  labelIds?: number[];
  /** Bộ phận (lớp studio). 0 = chưa có bộ phận. */
  teamIds?: number[];
  /** Giai đoạn (lớp studio). */
  stageId?: number;
  /** số = một sprint · 'backlog' = chưa vào sprint · 'open' = mọi sprint chưa đóng. */
  sprint?: number | 'backlog' | 'open';
  parentId?: number;
  q?: string;
  /** false = bỏ thẻ đã xong. */
  includeDone?: boolean;
  /** Bỏ epic (board không vẽ epic thành thẻ). */
  excludeEpics?: boolean;
  limit?: number;
  cursor?: string; // rank của thẻ cuối trang trước
}

export async function listIssues(userId: number, projectId: number, f: IssueFilters) {
  const access = await requireProject(userId, projectId, 'project.view');
  const and: Prisma.WorkIssueWhereInput[] = [{ projectId, deletedAt: null }, clientIssueWhere(access)];
  if (f.statusIds?.length) and.push({ statusId: { in: f.statusIds } });
  if (f.typeIds?.length) and.push({ typeId: { in: f.typeIds } });
  if (f.assigneeIds?.length) {
    const ids = f.assigneeIds.filter((x) => x > 0);
    and.push({ OR: [...(ids.length ? [{ assigneeId: { in: ids } }] : []), ...(f.assigneeIds.includes(0) ? [{ assigneeId: null }] : [])] });
  }
  if (f.labelIds?.length) and.push({ labels: { some: { labelId: { in: f.labelIds } } } });
  if (f.teamIds?.length) {
    const ids = f.teamIds.filter((x) => x > 0);
    and.push({ OR: [...(ids.length ? [{ teamId: { in: ids } }] : []), ...(f.teamIds.includes(0) ? [{ teamId: null }] : [])] });
  }
  if (f.stageId) and.push({ stageId: f.stageId });
  if (f.sprint === 'backlog') and.push({ sprintId: null });
  else if (f.sprint === 'open') and.push({ sprint: { state: { not: 'CLOSED' } } });
  else if (typeof f.sprint === 'number') and.push({ sprintId: f.sprint });
  if (f.parentId) and.push({ parentId: f.parentId });
  if (f.includeDone === false) and.push({ resolvedAt: null });
  if (f.excludeEpics) and.push({ type: { level: { not: 1 } } });
  const q = f.q?.trim();
  if (q) {
    // "SWP-12" hoặc "12" ⇒ tìm theo số; còn lại tìm trong tiêu đề + mô tả.
    const num = Number(q.replace(/^[A-Za-z][A-Za-z0-9]*-/, ''));
    and.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { descriptionText: { contains: q, mode: 'insensitive' } },
        ...(Number.isInteger(num) && num > 0 ? [{ number: num }] : []),
      ],
    });
  }
  // Tổng số khớp bộ lọc (không tính con trỏ trang) — cho dòng "42 issues".
  const total = await prisma.workIssue.count({ where: { AND: and } });
  if (f.cursor) and.push({ rank: { gt: f.cursor } });
  const limit = Math.min(Math.max(f.limit ?? 200, 1), 1000);
  const rows = await prisma.workIssue.findMany({
    where: { AND: and },
    // Hai thẻ trùng rank (kéo đồng thời) vẫn có thứ tự ổn định nhờ id.
    orderBy: [{ rank: 'asc' }, { id: 'asc' }],
    take: limit + 1,
    select: CARD_SELECT,
  });
  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((r) => scrubCardForClient(toCard(r), isClientScoped(access)));
  return { items, total, nextCursor: hasMore ? items[items.length - 1].rank : null };
}

export const BOARD_LIMIT = 2000;

/**
 * Board: Scrum lấy sprint đang chạy (hoặc sprint chỉ định); Kanban lấy mọi
 * thẻ chưa xong + thẻ xong trong 14 ngày gần nhất (cột Done không phình vô hạn).
 * Scrum mà CHƯA có sprint nào chạy ⇒ lùi về cách của Kanban và trả
 * `fallback: true` — board trống trơn cho tới khi biết lập sprint thì dự án
 * mới tạo trông như hỏng.
 */
export async function getBoard(userId: number, projectId: number, sprintId?: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { type: true } });
  const where: Prisma.WorkIssueWhereInput = { projectId, deletedAt: null, type: { level: { not: 1 } }, ...clientIssueWhere(access) };
  const recentOrOpen: Prisma.WorkIssueWhereInput[] = [{ resolvedAt: null }, { resolvedAt: { gte: new Date(Date.now() - 14 * 86_400_000) } }];
  let sprint = null;
  let fallback = false;
  if (project.type !== 'KANBAN') {
    sprint = await prisma.workSprint.findFirst({
      where: sprintId ? { id: sprintId, projectId } : { projectId, state: 'ACTIVE' },
      select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true },
    });
    if (sprintId && !sprint) throw new NotFoundError('Sprint not found');
  }
  if (sprint) where.sprintId = sprint.id;
  else {
    where.OR = recentOrOpen;
    fallback = project.type !== 'KANBAN';
  }
  // Trần 2000 thẻ (board vẽ hết trong một lượt). Vượt trần thì KHÔNG im lặng nữa:
  // trả `truncated` + `total` để giao diện báo "đang hiện 2000/N, lọc bớt".
  const rows = await prisma.workIssue.findMany({ where, orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: BOARD_LIMIT + 1, select: CARD_SELECT });
  const truncated = rows.length > BOARD_LIMIT;
  const total = truncated ? await prisma.workIssue.count({ where }) : rows.length;
  return { mode: project.type, sprint, fallback, issues: rows.slice(0, BOARD_LIMIT).map((r) => scrubCardForClient(toCard(r), isClientScoped(access))), truncated, total, limit: BOARD_LIMIT };
}

export async function getIssueDetail(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const scoped = isClientScoped(access);
  const issue = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null, ...clientIssueWhere(access) },
    select: {
      ...CARD_SELECT,
      clientSharedAt: true,
      descriptionJson: true,
      originalEstimateMin: true, remainingEstimateMin: true, timeSpentMin: true, startDate: true, resolution: true,
      aiModel: true, aiAssistedAt: true, aiAppliedById: true,
      assignee: { select: PUBLIC_USER },
      reporter: { select: PUBLIC_USER },
      parent: { select: { id: true, number: true, title: true, typeId: true, statusId: true } },
      children: {
        where: { deletedAt: null, ...(scoped ? { clientVisible: true } : {}) },
        orderBy: [{ rank: 'asc' }, { id: 'asc' }],
        select: { id: true, number: true, title: true, typeId: true, statusId: true, assigneeId: true, priority: true },
      },
      components: { select: { componentId: true } },
      linksOut: { select: { id: true, type: true, toIssue: { select: { id: true, number: true, title: true, statusId: true, typeId: true, deletedAt: true, projectId: true, clientVisible: true, project: { select: { key: true } } } } } },
      linksIn: { select: { id: true, type: true, fromIssue: { select: { id: true, number: true, title: true, statusId: true, typeId: true, deletedAt: true, projectId: true, clientVisible: true, project: { select: { key: true } } } } } },
      attachments: {
        where: scoped ? { clientVisible: true } : {},
        orderBy: { createdAt: 'asc' },
        select: { id: true, fileName: true, mime: true, size: true, createdAt: true, clientVisible: true, deliverable: true, uploader: { select: PUBLIC_USER } },
      },
      watchers: { select: { userId: true } },
    },
  });
  if (!issue) return scoped ? Promise.reject(new NotFoundError('Issue not found')) : throwIfMoved(userId, projectId, number);
  const { linksOut, linksIn, watchers, components, ...rest } = issue;
  const brief = (i: { id: number; number: number; title: string; statusId: number; typeId: number; project: { key: string } }) => ({
    id: i.id, key: `${i.project.key}-${i.number}`, number: i.number, title: i.title, statusId: i.statusId, typeId: i.typeId,
  });
  // Khách bị cách ly: chỉ liên kết tới thẻ ĐÃ CHIA SẺ của CHÍNH dự án này (không lộ dự án khác).
  const linkOk = (i: { deletedAt: Date | null; projectId: number; clientVisible: boolean }) => !i.deletedAt && (!scoped || (i.projectId === projectId && i.clientVisible));
  const detail = pickDetail(rest);
  if (scoped) {
    // Ước lượng/giờ làm là số liệu nội bộ (worklog) — khách không thấy.
    Object.assign(detail, { originalEstimateMin: null, remainingEstimateMin: null, timeSpentMin: null, aiAppliedById: null });
    // Người: chỉ người khách được thấy (clientPeople.ts) — còn lại "Project team".
    const f = await clientPeopleIds(projectId, userId);
    Object.assign(detail, {
      assignee: maskUser(issue.assignee, f),
      reporter: maskUser(issue.reporter, f),
      attachments: issue.attachments.map((a) => ({ ...a, uploader: maskUser(a.uploader, f) })),
    });
  }
  return {
    ...scrubCardForClient(toCard(rest as unknown as CardRow), scoped),
    ...detail,
    clientSharedAt: issue.clientSharedAt,
    componentIds: scoped ? [] : components.map((c) => c.componentId),
    // Lưu một chiều, đọc hai chiều: "A blocks B" hiện ở B thành "is blocked by A".
    links: [
      ...linksOut.filter((l) => linkOk(l.toIssue)).map((l) => ({ id: l.id, type: l.type as LinkType, direction: 'outward' as const, issue: brief(l.toIssue) })),
      ...linksIn.filter((l) => linkOk(l.fromIssue)).map((l) => ({ id: l.id, type: l.type as LinkType, direction: 'inward' as const, issue: brief(l.fromIssue) })),
    ],
    watcherCount: watchers.length,
    isWatching: watchers.some((w) => w.userId === userId),
    canDelete: !scoped && canDeleteIssue(access.role, userId, issue.reporterId),
  };
}

/**
 * Thẻ không có ở (dự án, số) này: nếu nó đã CHUYỂN sang dự án khác (bảng mã cũ)
 * và người xem vào được dự án mới ⇒ 404 WORK_ISSUE_MOVED kèm mã mới để giao
 * diện tự chuyển hướng. Không vào được dự án mới ⇒ 404 thường (không lộ gì).
 */
async function throwIfMoved(userId: number, projectId: number, number: number): Promise<never> {
  const alias = await prisma.workIssueAlias.findUnique({
    where: { uk_work_issue_alias: { projectId, number } },
    select: { issue: { select: { projectId: true, number: true, deletedAt: true, project: { select: { key: true, deletedAt: true } } } } },
  });
  const to = alias?.issue;
  if (to && !to.deletedAt && !to.project.deletedAt && (await loadProjectAccess(userId, to.projectId))) {
    throw new AppError(`This issue moved to ${to.project.key}-${to.number}`, 404, 'WORK_ISSUE_MOVED', {
      projectId: to.projectId, key: `${to.project.key}-${to.number}`, number: to.number,
    });
  }
  throw new NotFoundError('Issue not found');
}

function pickDetail(r: Record<string, unknown>) {
  const keys = [
    'descriptionJson', 'originalEstimateMin', 'remainingEstimateMin', 'timeSpentMin', 'startDate', 'resolution',
    'aiModel', 'aiAssistedAt', 'aiAppliedById',
    'assignee', 'reporter', 'parent', 'children', 'attachments',
  ];
  return Object.fromEntries(keys.map((k) => [k, r[k]]));
}

// ─── Ghi ─────────────────────────────────────────────────────────

export interface CreateIssueBody extends Omit<IssuePatch, 'statusId'> {
  typeId: number;
  title: string;
  statusId?: number;
  labelIds?: number[];
  componentIds?: number[];
}

export async function createIssueAs(userId: number, projectId: number, body: CreateIssueBody, via: Via = 'USER') {
  const access = await requireProject(userId, projectId, 'issue.create');
  // Khách hàng tạo thẻ (báo lỗi, gửi yêu cầu) nhưng không tự giao việc hay xếp sprint.
  if (access.role === 'CLIENT' && (body.assigneeId || body.sprintId || body.storyPoints !== undefined || body.teamId || body.stageId)) {
    throw new ForbiddenError('Clients can report issues but cannot assign or plan them');
  }
  const { labelIds, componentIds, ...rest } = body;
  const issue = await createIssue({ ...rest, projectId }, actorOf(userId, via));
  if (labelIds?.length || componentIds?.length) {
    await setIssueTags(access, issue.id, { labelIds, componentIds }, userId, false, via);
  }
  return issue;
}

export async function updateIssueAs(
  userId: number,
  projectId: number,
  number: number,
  body: IssuePatch & { labelIds?: number[]; componentIds?: number[] },
  expectedVersion?: number,
  via: Via = 'USER',
  /** Đợt S6: tên model của đề xuất AI (nguồn gốc). */
  model?: string | null,
) {
  const onlyStatus = Object.keys(body).every((k) => k === 'statusId');
  const access = await requireProject(userId, projectId, onlyStatus ? 'issue.transition' : 'issue.edit');
  const { id } = await findIssue(projectId, number);
  const { labelIds, componentIds, ...patch } = body;
  const res = await applyIssueChange(id, patch, actorOf(userId, via, model), { expectedVersion });
  if (labelIds !== undefined || componentIds !== undefined) {
    await setIssueTags(access, id, { labelIds, componentIds }, userId, true, via);
  }
  return res.issue;
}

export async function moveIssueAs(userId: number, projectId: number, number: number, input: MoveInput) {
  await requireProject(userId, projectId, 'issue.transition');
  const { id } = await findIssue(projectId, number);
  return (await moveIssue(id, input, userActor(userId))).issue;
}

/**
 * Đặt lại nhãn/component của thẻ (thay cả tập). Ghi lịch sử bằng TÊN — id
 * nhãn đổi nghĩa khi nhãn bị đổi tên, còn lịch sử phải đọc được về sau.
 */
async function setIssueTags(
  access: ProjectAccess,
  issueId: number,
  input: { labelIds?: number[]; componentIds?: number[] },
  userId: number,
  emit: boolean,
  via: Via = 'USER',
) {
  const changes: Array<{ field: string; from: string | null; to: string | null }> = [];
  await prisma.$transaction(async (tx) => {
    if (input.labelIds !== undefined) {
      const wanted = [...new Set(input.labelIds)];
      const valid = await tx.workLabel.findMany({ where: { projectId: access.projectId, id: { in: wanted } }, select: { id: true, name: true } });
      if (valid.length !== wanted.length) throw new BadRequestError('Some labels do not belong to this project', 'WORK_BAD_LABEL');
      const cur = await tx.workIssueLabel.findMany({ where: { issueId }, select: { label: { select: { id: true, name: true } } } });
      const before = cur.map((c) => c.label.name).sort().join(', ');
      const after = valid.map((v) => v.name).sort().join(', ');
      if (before !== after) {
        await tx.workIssueLabel.deleteMany({ where: { issueId } });
        if (wanted.length) await tx.workIssueLabel.createMany({ data: wanted.map((labelId) => ({ issueId, labelId })) });
        changes.push({ field: 'labels', from: before || null, to: after || null });
      }
    }
    if (input.componentIds !== undefined) {
      const wanted = [...new Set(input.componentIds)];
      const valid = await tx.workComponent.findMany({ where: { projectId: access.projectId, id: { in: wanted } }, select: { id: true, name: true } });
      if (valid.length !== wanted.length) throw new BadRequestError('Some components do not belong to this project', 'WORK_BAD_COMPONENT');
      const cur = await tx.workIssueComponent.findMany({ where: { issueId }, select: { component: { select: { name: true } } } });
      const before = cur.map((c) => c.component.name).sort().join(', ');
      const after = valid.map((v) => v.name).sort().join(', ');
      if (before !== after) {
        await tx.workIssueComponent.deleteMany({ where: { issueId } });
        if (wanted.length) await tx.workIssueComponent.createMany({ data: wanted.map((componentId) => ({ issueId, componentId })) });
        changes.push({ field: 'components', from: before || null, to: after || null });
      }
    }
    if (changes.length) {
      await tx.workHistory.createMany({
        data: changes.map((c) => ({ issueId, actorId: userId, actorKind: via, field: c.field, fromValue: c.from, toValue: c.to })),
      });
      await tx.workIssue.update({ where: { id: issueId }, data: { version: { increment: 1 } } });
    }
  });
  if (emit && changes.length) {
    emitWorkEvent({ type: 'issue.updated', projectId: access.projectId, issueId, actor: actorOf(userId, via), changes });
  }
}

/**
 * Nhân bản một thẻ (như "Clone" của Jira): chép tiêu đề ("Copy of …"), mô tả,
 * loại, ưu tiên, người giao, ước lượng, ngày, cha, sprint, version, nhãn,
 * component; trạng thái về đầu quy trình. Thẻ mới được nối CLONES → thẻ gốc.
 * Việc con, bình luận, đính kèm KHÔNG chép.
 */
export async function cloneIssueAs(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'issue.create');
  const src = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      id: true, typeId: true, title: true, descriptionJson: true, priority: true, assigneeId: true, storyPoints: true,
      originalEstimateMin: true, startDate: true, dueDate: true, parentId: true, sprintId: true, fixVersionId: true,
      type: { select: { level: true } },
      sprint: { select: { state: true } },
      labels: { select: { labelId: true } },
      components: { select: { componentId: true } },
    },
  });
  if (!src) throw new NotFoundError('Issue not found');
  const client = access.role === 'CLIENT';
  const title = `Copy of ${src.title}`.slice(0, 255);
  const created = await createIssueAs(userId, projectId, {
    typeId: src.typeId,
    title,
    descriptionJson: (src.descriptionJson ?? undefined) as Prisma.InputJsonValue | undefined,
    priority: src.priority,
    startDate: src.startDate,
    dueDate: src.dueDate,
    parentId: src.parentId,
    fixVersionId: src.fixVersionId,
    // Khách hàng không được giao việc / xếp sprint / ước lượng (luật của createIssueAs).
    ...(client ? {} : {
      assigneeId: src.assigneeId,
      storyPoints: src.storyPoints ?? undefined,
      originalEstimateMin: src.originalEstimateMin,
      // Sprint đã đóng thì không thả bản sao vào đó; việc con tự theo sprint của cha.
      sprintId: src.type.level === 0 && src.sprint && src.sprint.state !== 'CLOSED' ? src.sprintId : null,
    }),
    labelIds: src.labels.map((l) => l.labelId),
    componentIds: src.components.map((c) => c.componentId),
  });
  await prisma.workIssueLink.create({ data: { fromIssueId: created.id, toIssueId: src.id, type: 'CLONES', createdById: userId } });
  await prisma.workHistory.create({
    data: { issueId: created.id, actorId: userId, actorKind: 'USER', field: 'link', toValue: `CLONES ${access.key}-${number}` },
  });
  return created;
}

/** Xoá mềm thẻ và việc con của nó. Khôi phục được (đợt 7: thùng rác). */
export async function deleteIssueAs(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await findIssue(projectId, number);
  if (!canDeleteIssue(access.role, userId, issue.reporterId)) {
    throw new ForbiddenError('Only the reporter or a project admin can delete this issue');
  }
  const now = new Date();
  await prisma.$transaction([
    prisma.workIssue.updateMany({ where: { parentId: issue.id, deletedAt: null, type: { level: -1 } }, data: { deletedAt: now } }),
    // Story của epic bị xoá thì mất cha, không bị xoá theo.
    prisma.workIssue.updateMany({ where: { parentId: issue.id, deletedAt: null }, data: { parentId: null } }),
    prisma.workIssue.update({ where: { id: issue.id }, data: { deletedAt: now } }),
    prisma.workHistory.create({ data: { issueId: issue.id, actorId: userId, actorKind: 'USER', field: 'deleted', toValue: now.toISOString() } }),
  ]);
  emitWorkEvent({ type: 'issue.deleted', projectId, issueId: issue.id, actor: userActor(userId) });
}

// ─── Liên kết, theo dõi, lịch sử ─────────────────────────────────

export async function addLink(userId: number, projectId: number, number: number, input: { type: LinkType; targetKey: string }) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const from = await findIssue(projectId, number);
  const m = /^([A-Za-z][A-Za-z0-9]{1,9})-(\d+)$/.exec(input.targetKey.trim());
  if (!m) throw new BadRequestError('Enter an issue key like SWP-12', 'WORK_BAD_KEY');
  // Liên kết được sang dự án khác CÙNG không gian, nếu người gọi xem được dự án đó.
  const target = await prisma.workIssue.findFirst({
    where: { number: Number(m[2]), deletedAt: null, project: { key: m[1].toUpperCase(), workspaceId: access.workspaceId, deletedAt: null } },
    select: { id: true, projectId: true },
  });
  if (!target) throw new NotFoundError(`Issue ${input.targetKey.toUpperCase()} not found`);
  if (target.projectId !== projectId) await requireProject(userId, target.projectId, 'project.view');
  if (target.id === from.id) throw new BadRequestError('An issue cannot link to itself', 'WORK_BAD_LINK');
  const link = await prisma.workIssueLink.upsert({
    where: { uk_work_issue_link: { fromIssueId: from.id, toIssueId: target.id, type: input.type } },
    create: { fromIssueId: from.id, toIssueId: target.id, type: input.type, createdById: userId },
    update: {},
  });
  await prisma.workHistory.create({
    data: { issueId: from.id, actorId: userId, actorKind: 'USER', field: 'link', toValue: `${input.type} ${input.targetKey.toUpperCase()}` },
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: from.id, actor: userActor(userId), changes: [] });
  return link;
}

export async function removeLink(userId: number, projectId: number, number: number, linkId: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const issue = await findIssue(projectId, number);
  const r = await prisma.workIssueLink.deleteMany({ where: { id: linkId, OR: [{ fromIssueId: issue.id }, { toIssueId: issue.id }] } });
  if (!r.count) throw new NotFoundError('Link not found');
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: issue.id, actor: userActor(userId), changes: [] });
}

export async function setWatching(userId: number, projectId: number, number: number, watching: boolean) {
  await requireProject(userId, projectId, 'project.view');
  const { id } = await findIssue(projectId, number);
  if (watching) await prisma.workWatcher.createMany({ data: [{ issueId: id, userId }], skipDuplicates: true });
  else await prisma.workWatcher.deleteMany({ where: { issueId: id, userId } });
}

export async function listHistory(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const { id } = await findIssue(projectId, number);
  return prisma.workHistory.findMany({
    where: { issueId: id },
    orderBy: { createdAt: 'desc' },
    take: 300,
    select: { id: true, field: true, fromValue: true, toValue: true, actorKind: true, createdAt: true, actor: { select: PUBLIC_USER } },
  });
}

// ─── Bình luận ───────────────────────────────────────────────────

const MAX_COMMENT_TEXT = 20_000;

function commentBody(bodyJson: unknown) {
  const text = tiptapToText(bodyJson);
  if (!text.trim()) throw new BadRequestError('Comment is empty', 'WORK_EMPTY_COMMENT');
  if (text.length > MAX_COMMENT_TEXT) throw new BadRequestError('Comment is too long', 'WORK_COMMENT_TOO_LONG');
  return text;
}

const COMMENT_SELECT = {
  id: true, bodyJson: true, isAi: true, visibility: true, createdAt: true, editedAt: true, author: { select: PUBLIC_USER },
} satisfies Prisma.WorkCommentSelect;

export async function listComments(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { id } = await findVisibleIssue(access, number);
  // Khách bị cách ly chỉ đọc "Reply to client" (PUBLIC) — ghi chú nội bộ không bao giờ rời server.
  const comments = await prisma.workComment.findMany({
    where: { issueId: id, deletedAt: null, ...(isClientScoped(access) ? { visibility: 'PUBLIC' } : {}) },
    orderBy: { createdAt: 'asc' }, take: 500, select: COMMENT_SELECT,
  });
  // Một lượt đọc cảm xúc cho MỌI bình luận của thẻ (không N+1).
  const byComment = await reactionSummaries(comments.map((c) => c.id), userId);
  // Khách: người thả cảm xúc ngoài phạm vi ⇒ "Project team" (vẫn đếm, không lộ tên).
  const f = await peopleFilterFor(access, userId);
  return comments.map((c) => ({ ...c, author: maskUser(c.author, f), reactions: maskReactions(byComment.get(c.id) ?? [], f) }));
}

export async function addComment(
  userId: number, projectId: number, number: number, bodyJson: Prisma.InputJsonValue, via: Via = 'USER', visibility?: CommentVisibility,
) {
  const access = await requireProject(userId, projectId, 'comment.create');
  const issue = await findVisibleIssue(access, number);
  const { id } = issue;
  // Trợ lý AI luôn soạn ghi chú NỘI BỘ — không bao giờ tự trả lời khách.
  const vis = commentVisibilityFor(access, issue.clientVisible, via === 'AI' ? 'INTERNAL' : visibility);
  const bodyText = commentBody(bodyJson);
  const comment = await prisma.$transaction(async (tx) => {
    // Bình luận AI soạn: vẫn ghi người đã duyệt (authorId) nhưng đánh dấu isAi —
    // hiện là "CT Work AI" và không tính vào số bình luận của ai.
    const c = await tx.workComment.create({ data: { issueId: id, authorId: userId, isAi: via === 'AI', bodyJson, bodyText, visibility: vis }, select: COMMENT_SELECT });
    // Bình luận vào thẻ nào thì tự theo dõi thẻ đó (như Jira).
    await tx.workWatcher.createMany({ data: [{ issueId: id, userId }], skipDuplicates: true });
    return c;
  });
  emitWorkEvent({ type: 'comment.created', projectId, issueId: id, commentId: comment.id, actor: actorOf(userId, via) });
  // Đợt S5a: trả lời PUBLIC đầu tiên của đội ⇒ first response; khách trả lời ⇒ hết "chờ khách". Lỗi chỉ ghi log.
  if (access.modules.serviceDesk) {
    await import('./serviceDesk.service.js')
      .then((m) => m.onComment(id, { authorId: userId, visibility: vis, isAi: via === 'AI', createdAt: comment.createdAt }))
      .catch((err) => logger.warn('[work] desk: cập nhật SLA sau bình luận lỗi', { issueId: id, err: (err as Error).message }));
  }
  return comment;
}

export async function editComment(userId: number, projectId: number, number: number, commentId: number, bodyJson: Prisma.InputJsonValue) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { id } = await findVisibleIssue(access, number);
  const c = await prisma.workComment.findFirst({ where: { id: commentId, issueId: id, deletedAt: null, ...(isClientScoped(access) ? { visibility: 'PUBLIC' } : {}) }, select: { authorId: true } });
  if (!c) throw new NotFoundError('Comment not found');
  // Sửa lời người khác là giả mạo — ADMIN chỉ được XOÁ, không được sửa.
  if (c.authorId !== userId || !canModifyComment(access.role, userId, c.authorId)) {
    throw new ForbiddenError('You can only edit your own comments');
  }
  const updated = await prisma.workComment.update({
    where: { id: commentId }, data: { bodyJson, bodyText: commentBody(bodyJson), editedAt: new Date() }, select: COMMENT_SELECT,
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: id, actor: userActor(userId), changes: [] });
  return updated;
}

export async function deleteComment(userId: number, projectId: number, number: number, commentId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { id } = await findVisibleIssue(access, number);
  const c = await prisma.workComment.findFirst({ where: { id: commentId, issueId: id, deletedAt: null, ...(isClientScoped(access) ? { visibility: 'PUBLIC' } : {}) }, select: { authorId: true } });
  if (!c) throw new NotFoundError('Comment not found');
  if (!canModifyComment(access.role, userId, c.authorId)) throw new ForbiddenError('You cannot delete this comment');
  await prisma.workComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: id, actor: userActor(userId), changes: [] });
}

// ─── Cảm xúc trên bình luận ──────────────────────────────────────
// Bật/tắt kiểu GitHub. KHÔNG sinh thông báo và KHÔNG đi qua emitWorkEvent
// (không đánh thức luật tự động/notify) — chỉ báo socket riêng để màn hình
// người khác tải lại bình luận.

/** Thứ tự cố định (chip không nhảy chỗ khi số đổi) — giống GitHub. */
export const REACTION_EMOJIS = ['👍', '👎', '😄', '🎉', '😕', '❤️', '🚀', '👀'] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

/** Tên kiểu GitHub API cũng nhận được (+1, heart…) — tiện cho token API. */
const REACTION_ALIASES: Record<string, ReactionEmoji> = {
  '+1': '👍', thumbs_up: '👍', '-1': '👎', thumbs_down: '👎', laugh: '😄', hooray: '🎉', tada: '🎉',
  confused: '😕', heart: '❤️', '❤': '❤️', rocket: '🚀', eyes: '👀',
};

/** Chuẩn hoá emoji từ URL; không hợp lệ ⇒ null. */
export function normalizeReaction(raw: string): ReactionEmoji | null {
  const v = raw.trim();
  if ((REACTION_EMOJIS as readonly string[]).includes(v)) return v as ReactionEmoji;
  return REACTION_ALIASES[v.toLowerCase()] ?? null;
}

const MAX_REACTION_USERS = 10;

export interface ReactionSummary {
  emoji: ReactionEmoji;
  count: number;
  mine: boolean;
  users: Array<{ id: number; name: string }>;
}

async function reactionSummaries(commentIds: number[], viewerId: number): Promise<Map<number, ReactionSummary[]>> {
  const out = new Map<number, ReactionSummary[]>();
  if (!commentIds.length) return out;
  const rows = await prisma.workCommentReaction.findMany({
    where: { commentId: { in: commentIds } },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    select: { commentId: true, emoji: true, userId: true, user: { select: PUBLIC_USER } },
  });
  const acc = new Map<number, Map<string, ReactionSummary>>();
  for (const r of rows) {
    if (!(REACTION_EMOJIS as readonly string[]).includes(r.emoji)) continue;
    let m = acc.get(r.commentId);
    if (!m) acc.set(r.commentId, (m = new Map()));
    let e = m.get(r.emoji);
    if (!e) m.set(r.emoji, (e = { emoji: r.emoji as ReactionEmoji, count: 0, mine: false, users: [] }));
    e.count++;
    if (r.userId === viewerId) e.mine = true;
    if (e.users.length < MAX_REACTION_USERS) e.users.push({ id: r.user.id, name: displayName(r.user) });
  }
  for (const [cid, m] of acc) {
    out.set(cid, REACTION_EMOJIS.map((x) => m.get(x)).filter((x): x is ReactionSummary => !!x));
  }
  return out;
}

/** Khách: người thả cảm xúc ngoài phạm vi (clientPeople.ts) ⇒ "Project team" — vẫn đếm, không lộ tên. */
function maskReactions(list: ReactionSummary[], f: PeopleFilter): ReactionSummary[] {
  if (!f) return list;
  return list.map((r) => ({ ...r, users: r.users.map((u) => (f.has(u.id) ? u : { id: 0, name: TEAM_USER.displayName })) }));
}

/**
 * Bật/tắt một cảm xúc. `active` bỏ trống = đảo trạng thái; true/false = đặt
 * thẳng (idempotent — bấm đúp hay mạng gửi lại không làm lệch).
 */
export async function toggleReaction(
  userId: number, projectId: number, number: number, commentId: number, rawEmoji: string, active?: boolean,
) {
  const emoji = normalizeReaction(rawEmoji);
  if (!emoji) throw new BadRequestError(`Unsupported reaction. Use one of ${REACTION_EMOJIS.join(' ')}`, 'WORK_BAD_REACTION');
  const access = await requireProject(userId, projectId, 'comment.create');
  const { id } = await findVisibleIssue(access, number);
  const c = await prisma.workComment.findFirst({ where: { id: commentId, issueId: id, deletedAt: null, ...(isClientScoped(access) ? { visibility: 'PUBLIC' } : {}) }, select: { id: true } });
  if (!c) throw new NotFoundError('Comment not found');

  const where = { commentId, userId, emoji };
  let reacted: boolean;
  if (active === false) {
    await prisma.workCommentReaction.deleteMany({ where });
    reacted = false;
  } else if (active === true) {
    await prisma.workCommentReaction.createMany({ data: [where], skipDuplicates: true });
    reacted = true;
  } else {
    const removed = await prisma.workCommentReaction.deleteMany({ where });
    if (removed.count) reacted = false;
    else {
      await prisma.workCommentReaction.createMany({ data: [where], skipDuplicates: true });
      reacted = true;
    }
  }

  const reactions = maskReactions((await reactionSummaries([commentId], userId)).get(commentId) ?? [], await peopleFilterFor(access, userId));
  getIO()?.to(projectRoom(projectId)).emit('work:comment-reaction', { projectId, issueId: id, number, commentId, userId });
  return { commentId, emoji, reacted, reactions };
}

// ─── Mẫu mô tả theo loại thẻ ─────────────────────────────────────

export interface EffectiveIssueTemplate {
  typeId: number;
  typeKey: string;
  typeName: string;
  /** Tên mẫu để hiện "Template: Bug report". */
  name: string;
  /** null = loại này không có mẫu (hoặc admin đã xoá trắng). */
  doc: IssueTemplateDoc | null;
  /** true = đang dùng mẫu mặc định của CT Work (chưa tự đặt). */
  isDefault: boolean;
  hasDefault: boolean;
}

/** Mẫu mô tả đang hiệu lực cho mọi loại thẻ của dự án — ai xem được dự án là đọc được. */
export async function listIssueTemplates(userId: number, projectId: number): Promise<EffectiveIssueTemplate[]> {
  await requireProject(userId, projectId, 'project.view');
  const [project, types] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } }),
    prisma.workIssueType.findMany({ where: { projectId, archived: false }, orderBy: { position: 'asc' }, select: { id: true, key: true, name: true } }),
  ]);
  const settings = (project.settings ?? {}) as Record<string, unknown>;
  const custom = (settings.issueTemplates && typeof settings.issueTemplates === 'object' ? settings.issueTemplates : {}) as Record<string, unknown>;
  const dod = Array.isArray(settings.definitionOfDone) ? settings.definitionOfDone.filter((x): x is string => typeof x === 'string' && !!x.trim()) : undefined;
  return types.map((t) => {
    const def = defaultIssueTemplate(t.key, dod);
    const own = custom[t.key];
    const hasOwn = !!own && typeof own === 'object' && (own as { type?: unknown }).type === 'doc';
    const doc = hasOwn ? (own as IssueTemplateDoc) : def;
    const empty = !doc || !Array.isArray(doc.content) || !doc.content.length;
    return {
      typeId: t.id,
      typeKey: t.key,
      typeName: t.name,
      name: DEFAULT_TEMPLATE_NAMES[t.key as IssueTypeKey] ?? t.name,
      doc: empty ? null : doc,
      isDefault: !hasOwn,
      hasDefault: !!def,
    };
  });
}

// ─── Đính kèm ────────────────────────────────────────────────────
// Tải thẳng lên R2 bằng URL ký sẵn (không qua backend), rồi báo "complete"
// để backend kiểm file đã tới và ghi dòng. File KHÔNG công khai: tải về qua
// URL ký sẵn 10 phút sau khi kiểm quyền xem dự án — tài liệu của khách hàng
// không được nằm ở một link ai có cũng mở được.

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const MAX_ATTACHMENTS_PER_ISSUE = 50;

function assertR2() {
  if (getStorageProvider().kind !== 'r2') {
    throw new BadRequestError('Attachments need cloud storage (R2), which is not configured here', 'WORK_NO_STORAGE');
  }
}

function attachmentPrefix(projectId: number, issueId: number) {
  return `work/${projectId}/${issueId}/`;
}

export async function presignAttachment(userId: number, projectId: number, number: number, input: { fileName: string; contentType: string; size: number }) {
  const access = await requireProject(userId, projectId, 'attachment.add');
  assertR2();
  const { id } = await findVisibleIssue(access, number);
  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > MAX_ATTACHMENT_BYTES) {
    throw new BadRequestError('Files must be 25 MB or smaller', 'WORK_FILE_TOO_LARGE');
  }
  const count = await prisma.workAttachment.count({ where: { issueId: id } });
  if (count >= MAX_ATTACHMENTS_PER_ISSUE) throw new BadRequestError('This issue has too many attachments', 'WORK_LIMIT');
  const safeName = input.fileName.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';
  const key = `${attachmentPrefix(projectId, id)}${crypto.randomUUID()}/${safeName}`;
  const contentType = input.contentType || 'application/octet-stream';
  const uploadUrl = await getSignedUploadUrl(key, contentType, 900);
  return { uploadUrl, key, headers: { 'Content-Type': contentType } };
}

export async function completeAttachment(userId: number, projectId: number, number: number, input: { key: string; fileName: string; runId?: number | null }) {
  const access = await requireProject(userId, projectId, 'attachment.add');
  assertR2();
  const { id } = await findVisibleIssue(access, number);
  // Tệp khách tải lên luôn hiện với khách (chính họ gửi).
  const fromClient = isClientScoped(access);
  // Bằng chứng của lần chạy test: lần chạy phải là của CHÍNH test case này.
  if (input.runId) {
    const run = await prisma.workTestRun.findFirst({ where: { id: input.runId, testCase: { issueId: id }, cycle: { projectId } }, select: { id: true } });
    if (!run) throw new BadRequestError('Test run not found for this test', 'WORK_BAD_RUN');
  }
  // Key phải nằm dưới đúng thư mục của thẻ này — không cho "nhận" file của thẻ khác.
  if (!input.key.startsWith(attachmentPrefix(projectId, id)) || input.key.includes('..')) {
    throw new BadRequestError('Invalid attachment key', 'WORK_BAD_KEY');
  }
  const head = await headObject(input.key);
  if (!head) throw new BadRequestError('Upload not found. Please try again.', 'WORK_UPLOAD_MISSING');
  if (head.size > MAX_ATTACHMENT_BYTES) {
    await deleteObject(input.key);
    throw new BadRequestError('Files must be 25 MB or smaller', 'WORK_FILE_TOO_LARGE');
  }
  const att = await prisma.workAttachment.create({
    data: { issueId: id, runId: fromClient ? null : input.runId ?? null, uploaderId: userId, r2Key: input.key, fileName: input.fileName.slice(0, 255) || 'file', mime: head.contentType.slice(0, 100), size: head.size, clientVisible: fromClient },
    select: { id: true, fileName: true, mime: true, size: true, createdAt: true, clientVisible: true, deliverable: true, uploader: { select: PUBLIC_USER } },
  });
  await prisma.workHistory.create({ data: { issueId: id, actorId: userId, actorKind: 'USER', field: 'attachment', toValue: att.fileName } });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: id, actor: userActor(userId), changes: [] });
  return att;
}

/** inline = xem ngay trong trang (ảnh); không thì trình duyệt tải về với đúng tên file. */
/** Hạn URL tải tệp cấp cho khách bị cách ly (giây) — xem attachmentDownloadUrl. */
export const CLIENT_URL_TTL_S = 120;

export async function attachmentDownloadUrl(userId: number, projectId: number, attachmentId: number, inline = false) {
  const access = await requireProject(userId, projectId, 'project.view');
  // Khách bị cách ly: chỉ tệp đã chia sẻ, trên thẻ đã chia sẻ.
  const scoped = isClientScoped(access);
  const att = await prisma.workAttachment.findFirst({
    where: { id: attachmentId, issue: { projectId, deletedAt: null, ...(scoped ? { clientVisible: true } : {}) }, ...(scoped ? { clientVisible: true } : {}) },
    select: { r2Key: true, fileName: true },
  });
  if (!att) throw new NotFoundError('Attachment not found');
  // Khách bị cách ly: URL ký sẵn chỉ sống CLIENT_URL_TTL_S. Bỏ chia sẻ tệp/thẻ chặn ngay
  // việc XIN URL mới (truy vấn trên), nhưng URL đã cấp thì R2 không thu hồi được — hạn
  // ngắn là thứ giới hạn cửa sổ đó (≤ 2 phút thay vì 10). Client xin URL ngay trước khi
  // mở/tải nên hạn ngắn không làm hỏng việc tải tệp lớn (R2 kiểm hạn lúc BẮT ĐẦU tải).
  return getSignedDownloadUrl(att.r2Key, scoped ? CLIENT_URL_TTL_S : 600, inline ? undefined : att.fileName);
}

export async function deleteAttachment(userId: number, projectId: number, attachmentId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const att = await prisma.workAttachment.findFirst({
    where: { id: attachmentId, issue: { projectId } },
    select: { id: true, r2Key: true, uploaderId: true, issueId: true, fileName: true },
  });
  if (!att) throw new NotFoundError('Attachment not found');
  if (att.uploaderId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the uploader or a project admin can remove this file');
  await prisma.workAttachment.delete({ where: { id: att.id } });
  await prisma.workHistory.create({ data: { issueId: att.issueId, actorId: userId, actorKind: 'USER', field: 'attachment', fromValue: att.fileName } });
  void deleteObject(att.r2Key).catch(() => {});
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: att.issueId, actor: userActor(userId), changes: [] });
}

// ─── Báo cáo bình luận (App Store 1.2 — nội dung do người dùng tạo) ──

export const COMMENT_REPORT_REASONS = ['spam', 'harassment', 'hate', 'sexual', 'violence', 'other'] as const;

/**
 * Báo cáo một bình luận vi phạm. Không cần bảng mới: ghi vào audit log của
 * không gian (quản trị xem ở Settings → Audit log) và báo ngay cho ADMIN dự
 * án — chính họ có quyền xoá bình luận (comment.moderate). Mỗi người chỉ
 * báo một bình luận một lần; tự báo bình luận của mình vô nghĩa ⇒ 400.
 */
export async function reportComment(
  userId: number, projectId: number, number: number, commentId: number,
  input: { reason: (typeof COMMENT_REPORT_REASONS)[number]; details?: string | null },
) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { id } = await findIssue(projectId, number);
  const c = await prisma.workComment.findFirst({ where: { id: commentId, issueId: id, deletedAt: null }, select: { authorId: true, bodyText: true } });
  if (!c) throw new NotFoundError('Comment not found');
  if (c.authorId === userId) throw new BadRequestError('You cannot report your own comment', 'WORK_REPORT_SELF');
  const dup = await prisma.workAuditLog.findFirst({ where: { workspaceId: access.workspaceId, actorId: userId, action: 'comment.report', targetId: commentId } });
  if (dup) return { reported: true, duplicate: true };
  const { auditProject } = await import('./audit.js');
  await auditProject(projectId, {
    actorId: userId, action: 'comment.report', targetType: 'comment', targetId: commentId,
    summary: `Reported a comment on ${access.key}-${number} (${input.reason})`,
    detail: { reason: input.reason, details: input.details?.slice(0, 1000) ?? null, authorId: c.authorId, excerpt: c.bodyText.slice(0, 300) },
  });
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { workspace: { select: { slug: true } } } });
  const { projectMembers } = await import('./projects.service.js');
  const { notifyWork } = await import('./notify.js');
  const admins = (await projectMembers(projectId)).filter((m) => m.role === 'ADMIN' && m.id !== userId);
  for (const a of admins) {
    await notifyWork({
      receiverId: a.id, senderId: userId, type: 'WORK_ALERT', entityId: id, secondaryEntityId: commentId,
      payload: {
        issueKey: `${access.key}-${number}`, title: '', message: `A comment was reported (${input.reason}). Review and remove it if needed.`,
        url: `/work/${project.workspace.slug}/${access.key}/issue/${number}?comment=${commentId}`,
      },
    });
  }
  return { reported: true, duplicate: false };
}

// ─── Cổng khách (đợt S2b): chia sẻ thẻ / tệp với khách ────────────

/**
 * "Share with client" trên một thẻ. Cần quyền sửa thẻ + mô-đun clientPortal.
 * Bỏ chia sẻ: thẻ biến mất khỏi cổng khách (bình luận PUBLIC cũ vẫn còn, ẩn theo thẻ).
 * Ghi lịch sử (`clientVisible`) + sự kiện để board/cổng khách tự làm tươi.
 */
export async function setIssueClientVisible(userId: number, projectId: number, number: number, visible: boolean) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  assertModule(access, 'clientPortal');
  const i = await findIssue(projectId, number);
  if (i.clientVisible === visible) return { number, clientVisible: visible };
  await prisma.$transaction([
    prisma.workIssue.update({ where: { id: i.id }, data: { clientVisible: visible, clientSharedAt: visible ? new Date() : null, version: { increment: 1 } } }),
    prisma.workHistory.create({ data: { issueId: i.id, actorId: userId, actorKind: 'USER', field: 'clientVisible', fromValue: String(!visible), toValue: String(visible) } }),
  ]);
  const { auditProject } = await import('./audit.js');
  await auditProject(projectId, {
    actorId: userId, action: visible ? 'portal.share_issue' : 'portal.unshare_issue', targetType: 'issue', targetId: i.id,
    summary: `${visible ? 'Shared' : 'Stopped sharing'} ${access.key}-${number} ${visible ? 'with' : 'from'} the client`,
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: i.id, actor: userActor(userId), changes: [{ field: 'clientVisible', from: String(!visible), to: String(visible) }] });
  return { number, clientVisible: visible };
}

/**
 * Chia sẻ một TỆP với khách và/hoặc đánh dấu là BÀN GIAO (Deliverables). Thẻ phải
 * đã được chia sẻ — tệp chia sẻ trên thẻ nội bộ thì khách không bao giờ mở được.
 * Bàn giao ⇒ luôn kèm chia sẻ.
 */
export async function setAttachmentClient(
  userId: number, projectId: number, attachmentId: number, input: { clientVisible?: boolean; deliverable?: boolean },
) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  assertModule(access, 'clientPortal');
  const att = await prisma.workAttachment.findFirst({
    where: { id: attachmentId, issue: { projectId, deletedAt: null } },
    select: { id: true, issueId: true, fileName: true, clientVisible: true, deliverable: true, issue: { select: { clientVisible: true, number: true } } },
  });
  if (!att) throw new NotFoundError('Attachment not found');
  const deliverable = input.deliverable ?? att.deliverable;
  const clientVisible = deliverable ? true : (input.clientVisible ?? att.clientVisible);
  if (clientVisible && !att.issue.clientVisible) {
    throw new BadRequestError('Share the issue with the client before sharing its files', 'WORK_ISSUE_NOT_SHARED');
  }
  const updated = await prisma.workAttachment.update({
    where: { id: att.id },
    data: { clientVisible, deliverable, deliveredAt: deliverable && !att.deliverable ? new Date() : deliverable ? undefined : null },
    select: { id: true, fileName: true, clientVisible: true, deliverable: true, deliveredAt: true },
  });
  if (clientVisible !== att.clientVisible || deliverable !== att.deliverable) {
    await prisma.workHistory.create({ data: { issueId: att.issueId, actorId: userId, actorKind: 'USER', field: deliverable !== att.deliverable ? 'deliverable' : 'attachmentShared', fromValue: null, toValue: `${att.fileName}: ${deliverable ? 'deliverable' : clientVisible ? 'shared' : 'internal'}` } });
    const { auditProject } = await import('./audit.js');
    await auditProject(projectId, {
      actorId: userId, action: deliverable && !att.deliverable ? 'portal.deliver' : 'portal.share_file', targetType: 'attachment', targetId: att.id,
      summary: deliverable && !att.deliverable ? `Delivered ${att.fileName} to the client` : `${clientVisible ? 'Shared' : 'Stopped sharing'} file ${att.fileName}`,
    });
    emitWorkEvent({ type: 'issue.updated', projectId, issueId: att.issueId, actor: userActor(userId), changes: [] });
    if (deliverable && !att.deliverable) {
      const { notifyClientsOfProject } = await import('./portalNotify.js');
      await notifyClientsOfProject(projectId, userId, { kind: 'deliverable', title: att.fileName, section: 'deliverables' });
    }
  }
  return updated;
}
