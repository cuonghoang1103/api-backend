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
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER } from './common.js';
import type { LinkType } from './constants.js';
import { emitWorkEvent, type WorkActor } from './events.js';
import { applyIssueChange, createIssue, moveIssue, type IssuePatch, type MoveInput } from './issueChange.js';
import { canDeleteIssue, canModifyComment, requireProject, type ProjectAccess } from './permissions.js';
import { tiptapToText } from './tiptapText.js';

const userActor = (userId: number): WorkActor => ({ kind: 'USER', userId });
/**
 * Thao tác do trợ lý AI đề xuất và người dùng bấm "Apply": vẫn chạy dưới quyền
 * của CHÍNH người đó, nhưng lịch sử ghi actorKind AI ⇒ báo cáo đóng góp không
 * cộng công cho ai (đúng luật "AI không làm hộ điểm").
 */
export type Via = 'USER' | 'AI';
const actorOf = (userId: number, via: Via = 'USER'): WorkActor => ({ kind: via, userId });

/** Trường của một thẻ trên board/danh sách — gọn, không mô tả. */
export const CARD_SELECT = {
  id: true, number: true, title: true, typeId: true, statusId: true, parentId: true, sprintId: true, fixVersionId: true,
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
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, reporterId: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

// ─── Đọc ─────────────────────────────────────────────────────────

export interface IssueFilters {
  statusIds?: number[];
  typeIds?: number[];
  /** 0 = chưa giao cho ai. */
  assigneeIds?: number[];
  labelIds?: number[];
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
  await requireProject(userId, projectId, 'project.view');
  const and: Prisma.WorkIssueWhereInput[] = [{ projectId, deletedAt: null }];
  if (f.statusIds?.length) and.push({ statusId: { in: f.statusIds } });
  if (f.typeIds?.length) and.push({ typeId: { in: f.typeIds } });
  if (f.assigneeIds?.length) {
    const ids = f.assigneeIds.filter((x) => x > 0);
    and.push({ OR: [...(ids.length ? [{ assigneeId: { in: ids } }] : []), ...(f.assigneeIds.includes(0) ? [{ assigneeId: null }] : [])] });
  }
  if (f.labelIds?.length) and.push({ labels: { some: { labelId: { in: f.labelIds } } } });
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
  const items = rows.slice(0, limit).map(toCard);
  return { items, total, nextCursor: hasMore ? items[items.length - 1].rank : null };
}

/**
 * Board: Scrum lấy sprint đang chạy (hoặc sprint chỉ định); Kanban lấy mọi
 * thẻ chưa xong + thẻ xong trong 14 ngày gần nhất (cột Done không phình vô hạn).
 * Scrum mà CHƯA có sprint nào chạy ⇒ lùi về cách của Kanban và trả
 * `fallback: true` — board trống trơn cho tới khi biết lập sprint thì dự án
 * mới tạo trông như hỏng.
 */
export async function getBoard(userId: number, projectId: number, sprintId?: number) {
  await requireProject(userId, projectId, 'project.view');
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { type: true } });
  const where: Prisma.WorkIssueWhereInput = { projectId, deletedAt: null, type: { level: { not: 1 } } };
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
  const rows = await prisma.workIssue.findMany({ where, orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 2000, select: CARD_SELECT });
  return { mode: project.type, sprint, fallback, issues: rows.map(toCard) };
}

export async function getIssueDetail(userId: number, projectId: number, number: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const issue = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      ...CARD_SELECT,
      descriptionJson: true,
      originalEstimateMin: true, remainingEstimateMin: true, timeSpentMin: true, startDate: true, resolution: true,
      assignee: { select: PUBLIC_USER },
      reporter: { select: PUBLIC_USER },
      parent: { select: { id: true, number: true, title: true, typeId: true, statusId: true } },
      children: {
        where: { deletedAt: null },
        orderBy: [{ rank: 'asc' }, { id: 'asc' }],
        select: { id: true, number: true, title: true, typeId: true, statusId: true, assigneeId: true, priority: true },
      },
      components: { select: { componentId: true } },
      linksOut: { select: { id: true, type: true, toIssue: { select: { id: true, number: true, title: true, statusId: true, typeId: true, deletedAt: true, project: { select: { key: true } } } } } },
      linksIn: { select: { id: true, type: true, fromIssue: { select: { id: true, number: true, title: true, statusId: true, typeId: true, deletedAt: true, project: { select: { key: true } } } } } },
      attachments: { orderBy: { createdAt: 'asc' }, select: { id: true, fileName: true, mime: true, size: true, createdAt: true, uploader: { select: PUBLIC_USER } } },
      watchers: { select: { userId: true } },
    },
  });
  if (!issue) throw new NotFoundError('Issue not found');
  const { linksOut, linksIn, watchers, components, ...rest } = issue;
  const brief = (i: { id: number; number: number; title: string; statusId: number; typeId: number; project: { key: string } }) => ({
    id: i.id, key: `${i.project.key}-${i.number}`, number: i.number, title: i.title, statusId: i.statusId, typeId: i.typeId,
  });
  return {
    ...toCard(rest as unknown as CardRow),
    ...pickDetail(rest),
    componentIds: components.map((c) => c.componentId),
    // Lưu một chiều, đọc hai chiều: "A blocks B" hiện ở B thành "is blocked by A".
    links: [
      ...linksOut.filter((l) => !l.toIssue.deletedAt).map((l) => ({ id: l.id, type: l.type as LinkType, direction: 'outward' as const, issue: brief(l.toIssue) })),
      ...linksIn.filter((l) => !l.fromIssue.deletedAt).map((l) => ({ id: l.id, type: l.type as LinkType, direction: 'inward' as const, issue: brief(l.fromIssue) })),
    ],
    watcherCount: watchers.length,
    isWatching: watchers.some((w) => w.userId === userId),
    canDelete: canDeleteIssue(access.role, userId, issue.reporterId),
  };
}

function pickDetail(r: Record<string, unknown>) {
  const keys = [
    'descriptionJson', 'originalEstimateMin', 'remainingEstimateMin', 'timeSpentMin', 'startDate', 'resolution',
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
  if (access.role === 'CLIENT' && (body.assigneeId || body.sprintId || body.storyPoints !== undefined)) {
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
) {
  const onlyStatus = Object.keys(body).every((k) => k === 'statusId');
  const access = await requireProject(userId, projectId, onlyStatus ? 'issue.transition' : 'issue.edit');
  const { id } = await findIssue(projectId, number);
  const { labelIds, componentIds, ...patch } = body;
  const res = await applyIssueChange(id, patch, actorOf(userId, via), { expectedVersion });
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
  id: true, bodyJson: true, isAi: true, createdAt: true, editedAt: true, author: { select: PUBLIC_USER },
} satisfies Prisma.WorkCommentSelect;

export async function listComments(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const { id } = await findIssue(projectId, number);
  return prisma.workComment.findMany({ where: { issueId: id, deletedAt: null }, orderBy: { createdAt: 'asc' }, take: 500, select: COMMENT_SELECT });
}

export async function addComment(userId: number, projectId: number, number: number, bodyJson: Prisma.InputJsonValue, via: Via = 'USER') {
  await requireProject(userId, projectId, 'comment.create');
  const { id } = await findIssue(projectId, number);
  const bodyText = commentBody(bodyJson);
  const comment = await prisma.$transaction(async (tx) => {
    // Bình luận AI soạn: vẫn ghi người đã duyệt (authorId) nhưng đánh dấu isAi —
    // hiện là "CT Work AI" và không tính vào số bình luận của ai.
    const c = await tx.workComment.create({ data: { issueId: id, authorId: userId, isAi: via === 'AI', bodyJson, bodyText }, select: COMMENT_SELECT });
    // Bình luận vào thẻ nào thì tự theo dõi thẻ đó (như Jira).
    await tx.workWatcher.createMany({ data: [{ issueId: id, userId }], skipDuplicates: true });
    return c;
  });
  emitWorkEvent({ type: 'comment.created', projectId, issueId: id, commentId: comment.id, actor: actorOf(userId, via) });
  return comment;
}

export async function editComment(userId: number, projectId: number, number: number, commentId: number, bodyJson: Prisma.InputJsonValue) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { id } = await findIssue(projectId, number);
  const c = await prisma.workComment.findFirst({ where: { id: commentId, issueId: id, deletedAt: null }, select: { authorId: true } });
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
  const { id } = await findIssue(projectId, number);
  const c = await prisma.workComment.findFirst({ where: { id: commentId, issueId: id, deletedAt: null }, select: { authorId: true } });
  if (!c) throw new NotFoundError('Comment not found');
  if (!canModifyComment(access.role, userId, c.authorId)) throw new ForbiddenError('You cannot delete this comment');
  await prisma.workComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: id, actor: userActor(userId), changes: [] });
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
  await requireProject(userId, projectId, 'attachment.add');
  assertR2();
  const { id } = await findIssue(projectId, number);
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
  await requireProject(userId, projectId, 'attachment.add');
  assertR2();
  const { id } = await findIssue(projectId, number);
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
    data: { issueId: id, runId: input.runId ?? null, uploaderId: userId, r2Key: input.key, fileName: input.fileName.slice(0, 255) || 'file', mime: head.contentType.slice(0, 100), size: head.size },
    select: { id: true, fileName: true, mime: true, size: true, createdAt: true, uploader: { select: PUBLIC_USER } },
  });
  await prisma.workHistory.create({ data: { issueId: id, actorId: userId, actorKind: 'USER', field: 'attachment', toValue: att.fileName } });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: id, actor: userActor(userId), changes: [] });
  return att;
}

/** inline = xem ngay trong trang (ảnh); không thì trình duyệt tải về với đúng tên file. */
export async function attachmentDownloadUrl(userId: number, projectId: number, attachmentId: number, inline = false) {
  await requireProject(userId, projectId, 'project.view');
  const att = await prisma.workAttachment.findFirst({
    where: { id: attachmentId, issue: { projectId, deletedAt: null } },
    select: { r2Key: true, fileName: true },
  });
  if (!att) throw new NotFoundError('Attachment not found');
  return getSignedDownloadUrl(att.r2Key, 600, inline ? undefined : att.fileName);
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
