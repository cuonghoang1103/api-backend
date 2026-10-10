/**
 * CT Work đợt 7a (11/10/2026) — RETRO BOARD (C24).
 *
 * Bảng retro theo mẫu (Start/Stop/Continue · Mad/Sad/Glad · 4L) gắn sprint (tuỳ chọn). Thẻ ghi chú có thể ẨN DANH THẬT:
 * khi `anonymous`, mọi đường đọc trả thẻ KHÔNG có tác giả (kể cả với ADMIN — cardView ở agileRules là chốt duy nhất),
 * nhật ký kiểm toán không ghi tác giả thẻ, socket chỉ mang id; đã bật ẩn danh thì không tắt được (tắt = lộ ai viết gì).
 * Dot vote (mỗi người ≤ votesPerPerson chấm), gom nhóm (thẻ con trỏ về thẻ đầu nhóm), hành động ⇒ thẻ công việc.
 * Khoá: quá hạn `lockAt` hoặc người điều phối khoá tay ⇒ không viết/sửa/vote/gom nữa; hành động + tóm tắt AI + xuất vẫn được.
 * Tóm tắt AI: dùng lại `ai.retro` có sẵn (số liệu sprint + ghi chú nhóm) — ghi chú = nội dung thẻ, KHÔNG kèm tên người.
 * Xuất .docx qua docExport.renderDocx.
 */

import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { emitAgile, requireWrite, teamAccess, usersById, type TeamAccess } from './agileCommon.js';
import {
  cardView, RETRO_COLUMN_LABEL, RETRO_TEMPLATE_KEYS, RETRO_TEMPLATES, retroLocked, validColumn, votesLeft, type RetroTemplate,
} from './agileRules.js';
import { auditProject } from './audit.js';
import type { PublicUser } from './common.js';

export const retroInput = z.object({
  title: z.string().trim().min(1).max(120),
  template: z.enum(RETRO_TEMPLATE_KEYS as [RetroTemplate, ...RetroTemplate[]]).default('SSC'),
  sprintId: z.number().int().positive().nullable().optional(),
  anonymous: z.boolean().default(false),
  votesPerPerson: z.number().int().min(1).max(20).default(5),
  lockAt: z.string().datetime({ offset: true }).nullable().optional(),
});
export const retroPatch = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  sprintId: z.number().int().positive().nullable().optional(),
  anonymous: z.boolean().optional(),
  votesPerPerson: z.number().int().min(1).max(20).optional(),
  lockAt: z.string().datetime({ offset: true }).nullable().optional(),
  locked: z.boolean().optional(),
});
export const cardInput = z.object({ column: z.string().min(1).max(16), body: z.string().trim().min(1).max(1000) });
export const cardPatch = z.object({ body: z.string().trim().min(1).max(1000).optional(), column: z.string().min(1).max(16).optional(), groupId: z.number().int().positive().nullable().optional() });
export const voteInput = z.object({ delta: z.union([z.literal(1), z.literal(-1)]) });
export const actionInput = z.object({
  title: z.string().trim().min(1).max(255),
  cardId: z.number().int().positive().nullable().optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  createIssue: z.boolean().default(true),
  typeId: z.number().int().positive().optional(),
});

const RETRO_SELECT = {
  id: true, projectId: true, title: true, template: true, sprintId: true, anonymous: true, votesPerPerson: true, lockAt: true, lockedAt: true,
  summary: true, summaryAt: true, createdById: true, createdAt: true, updatedAt: true,
} as const;

function isFacilitator(a: TeamAccess, r: { createdById: number | null }, userId: number) {
  return a.principal === 'HUMAN' && (a.role === 'ADMIN' || r.createdById === userId);
}

async function retroFor(userId: number, projectId: number, retroId: number) {
  const a = await teamAccess(userId, projectId);
  const r = await prisma.workRetro.findFirst({ where: { id: retroId, projectId }, select: RETRO_SELECT });
  if (!r) throw new NotFoundError('Retro not found');
  return { a, r };
}

function assertUnlocked(r: { lockAt: Date | null; lockedAt: Date | null }) {
  if (retroLocked(r, new Date())) throw new AppError('This retro is locked — the deadline has passed or the facilitator locked it', 423, 'WORK_RETRO_LOCKED');
}

async function writableRetro(userId: number, projectId: number, retroId: number) {
  const x = await retroFor(userId, projectId, retroId);
  requireWrite(x.a, 'this retro');
  assertUnlocked(x.r);
  return x;
}

async function facilitatorFor(userId: number, projectId: number, retroId: number) {
  const x = await retroFor(userId, projectId, retroId);
  if (x.a.principal === 'AGENT') throw new ForbiddenError('AI agents can read retros but cannot change them');
  if (!isFacilitator(x.a, x.r, userId)) throw new ForbiddenError('Only the facilitator (who created the retro) or a project admin can do this');
  return x;
}

// ─── Danh sách / tạo / cấu hình ──────────────────────────────────

export async function listRetros(userId: number, projectId: number) {
  const a = await teamAccess(userId, projectId);
  const rows = await prisma.workRetro.findMany({
    where: { projectId }, orderBy: { createdAt: 'desc' }, take: 100,
    select: { ...RETRO_SELECT, _count: { select: { cards: true, actions: true } } },
  });
  const sprints = new Map((await prisma.workSprint.findMany({ where: { id: { in: rows.map((r) => r.sprintId).filter((x): x is number => !!x) } }, select: { id: true, name: true } })).map((s) => [s.id, s.name]));
  const users = await usersById(rows.map((r) => r.createdById));
  const now = new Date();
  return {
    canCreate: a.canWrite,
    retros: rows.map((r) => ({
      id: r.id, title: r.title, template: r.template, anonymous: r.anonymous, sprint: r.sprintId ? { id: r.sprintId, name: sprints.get(r.sprintId) ?? null } : null,
      locked: retroLocked(r, now), lockAt: r.lockAt, cards: r._count.cards, actions: r._count.actions, hasSummary: !!r.summary,
      createdBy: r.createdById ? users.get(r.createdById) ?? null : null, createdAt: r.createdAt,
    })),
  };
}

export async function createRetro(userId: number, projectId: number, input: z.infer<typeof retroInput>) {
  const a = await teamAccess(userId, projectId);
  requireWrite(a, 'retros');
  if (input.sprintId && !(await prisma.workSprint.findFirst({ where: { id: input.sprintId, projectId }, select: { id: true } }))) {
    throw new BadRequestError('Sprint not found in this project', 'WORK_RETRO_BAD_SPRINT');
  }
  const r = await prisma.workRetro.create({
    data: {
      projectId, title: input.title, template: input.template, sprintId: input.sprintId ?? null, anonymous: input.anonymous,
      votesPerPerson: input.votesPerPerson, lockAt: input.lockAt ? new Date(input.lockAt) : null, createdById: userId,
    },
  });
  await auditProject(projectId, { actorId: userId, action: 'retro.create', targetType: 'retro', targetId: r.id, summary: `Opened retro "${r.title}"${r.anonymous ? ' (anonymous notes)' : ''}` });
  emitAgile(projectId, 'retro', r.id, 'created');
  return { id: r.id };
}

export async function updateRetro(userId: number, projectId: number, retroId: number, input: z.infer<typeof retroPatch>) {
  const { r } = await facilitatorFor(userId, projectId, retroId);
  // Ẩn danh là một chiều: tắt đi = người khác thấy ai viết gì sau khi đã hứa ẩn danh.
  if (input.anonymous === false && r.anonymous) throw new BadRequestError('Anonymous notes cannot be made public again', 'WORK_RETRO_ANON_ONEWAY');
  if (input.sprintId && !(await prisma.workSprint.findFirst({ where: { id: input.sprintId, projectId }, select: { id: true } }))) {
    throw new BadRequestError('Sprint not found in this project', 'WORK_RETRO_BAD_SPRINT');
  }
  await prisma.workRetro.update({
    where: { id: r.id },
    data: {
      title: input.title, sprintId: input.sprintId, anonymous: input.anonymous, votesPerPerson: input.votesPerPerson,
      lockAt: input.lockAt === undefined ? undefined : input.lockAt ? new Date(input.lockAt) : null,
      lockedAt: input.locked === undefined ? undefined : input.locked ? new Date() : null,
    },
  });
  if (input.locked !== undefined) {
    await auditProject(projectId, { actorId: userId, action: input.locked ? 'retro.lock' : 'retro.unlock', targetType: 'retro', targetId: r.id, summary: `${input.locked ? 'Locked' : 'Unlocked'} retro "${r.title}"` });
  }
  emitAgile(projectId, 'retro', r.id, 'updated');
  return { ok: true };
}

export async function deleteRetro(userId: number, projectId: number, retroId: number) {
  const { r } = await facilitatorFor(userId, projectId, retroId);
  await prisma.workRetro.delete({ where: { id: r.id } });
  await auditProject(projectId, { actorId: userId, action: 'retro.delete', targetType: 'retro', targetId: r.id, summary: `Deleted retro "${r.title}"` });
  emitAgile(projectId, 'retro', r.id, 'deleted');
  return { ok: true };
}

// ─── Chi tiết (che tác giả khi ẩn danh) ──────────────────────────

export async function getRetro(userId: number, projectId: number, retroId: number) {
  const { a, r } = await retroFor(userId, projectId, retroId);
  const [cards, votes, actions] = await Promise.all([
    prisma.workRetroCard.findMany({ where: { retroId: r.id }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, column: true, body: true, authorId: true, groupId: true, position: true, createdAt: true } }),
    prisma.workRetroVote.findMany({ where: { card: { retroId: r.id } }, select: { cardId: true, userId: true, count: true } }),
    prisma.workRetroAction.findMany({ where: { retroId: r.id }, orderBy: { id: 'asc' }, select: { id: true, cardId: true, title: true, assigneeId: true, issueId: true, createdAt: true } }),
  ]);
  const total = new Map<number, number>();
  const mine = new Map<number, number>();
  let used = 0;
  for (const v of votes) {
    total.set(v.cardId, (total.get(v.cardId) ?? 0) + v.count);
    if (v.userId === userId) { mine.set(v.cardId, v.count); used += v.count; }
  }
  // Ẩn danh ⇒ KHÔNG nạp người viết (không có gì để lộ, kể cả vô tình).
  const users = await usersById([...(r.anonymous ? [] : cards.map((c) => c.authorId)), ...actions.map((x) => x.assigneeId), r.createdById]);
  const issues = new Map((await prisma.workIssue.findMany({
    where: { id: { in: actions.map((x) => x.issueId).filter((x): x is number => !!x) }, deletedAt: null },
    select: { id: true, number: true, title: true, status: { select: { name: true, category: true } } },
  })).map((i) => [i.id, i]));
  const sprint = r.sprintId ? await prisma.workSprint.findUnique({ where: { id: r.sprintId }, select: { id: true, name: true, state: true } }) : null;
  const locked = retroLocked(r, new Date());
  const facilitator = isFacilitator(a, r, userId);
  return {
    id: r.id, projectId, title: r.title, template: r.template, columns: RETRO_TEMPLATES[r.template as RetroTemplate] ?? RETRO_TEMPLATES.SSC,
    sprint, anonymous: r.anonymous, votesPerPerson: r.votesPerPerson, lockAt: r.lockAt, locked, lockedManually: !!r.lockedAt,
    summary: r.summary, summaryAt: r.summaryAt, createdAt: r.createdAt,
    facilitator: r.createdById ? users.get(r.createdById) ?? null : null,
    me: { canWrite: a.canWrite && !locked, canFacilitate: facilitator, canUseAi: a.canWrite, votesLeft: votesLeft(r.votesPerPerson, used), votesUsed: used },
    cards: cards.map((c) => cardView(c, { viewerId: userId, anonymous: r.anonymous, author: (users.get(c.authorId) ?? null) as PublicUser | null, votes: total.get(c.id) ?? 0, myVotes: mine.get(c.id) ?? 0 })),
    actions: actions.map((x) => ({ id: x.id, cardId: x.cardId, title: x.title, assignee: x.assigneeId ? users.get(x.assigneeId) ?? null : null, issue: x.issueId ? issues.get(x.issueId) ?? null : null, createdAt: x.createdAt })),
  };
}

// ─── Thẻ ghi chú ─────────────────────────────────────────────────

export async function addCard(userId: number, projectId: number, retroId: number, input: z.infer<typeof cardInput>) {
  const { r } = await writableRetro(userId, projectId, retroId);
  if (!validColumn(r.template as RetroTemplate, input.column)) throw new BadRequestError('That column is not in this retro', 'WORK_RETRO_BAD_COLUMN');
  const n = await prisma.workRetroCard.count({ where: { retroId: r.id } });
  if (n >= 500) throw new BadRequestError('This retro already has 500 notes', 'WORK_RETRO_FULL');
  const c = await prisma.workRetroCard.create({ data: { retroId: r.id, column: input.column, body: input.body, authorId: userId, position: n } });
  emitAgile(projectId, 'retro', r.id, 'card');
  return { id: c.id };
}

/**
 * Sửa thẻ: NỘI DUNG chỉ tác giả sửa; CỘT + NHÓM thì cả nhóm (ADMIN/MEMBER) sắp được — gom nhóm là việc chung.
 * Gom: groupId = thẻ đầu nhóm (cùng retro, không phải thẻ đang là con của nhóm khác — một cấp).
 */
export async function updateCard(userId: number, projectId: number, retroId: number, cardId: number, input: z.infer<typeof cardPatch>) {
  const { r } = await writableRetro(userId, projectId, retroId);
  const c = await prisma.workRetroCard.findFirst({ where: { id: cardId, retroId: r.id } });
  if (!c) throw new NotFoundError('Note not found');
  if (input.body !== undefined && c.authorId !== userId) throw new ForbiddenError('Only the author can edit the text of a note');
  if (input.column !== undefined && !validColumn(r.template as RetroTemplate, input.column)) throw new BadRequestError('That column is not in this retro', 'WORK_RETRO_BAD_COLUMN');
  if (input.groupId) {
    if (input.groupId === c.id) throw new BadRequestError('A note cannot be grouped under itself', 'WORK_RETRO_BAD_GROUP');
    const head = await prisma.workRetroCard.findFirst({ where: { id: input.groupId, retroId: r.id }, select: { id: true, groupId: true, column: true } });
    if (!head || head.groupId) throw new BadRequestError('Group notes under a note that is not itself in a group', 'WORK_RETRO_BAD_GROUP');
    // Thẻ đang là đầu nhóm ⇒ cả nhóm của nó dời về nhóm mới (vẫn một cấp).
    await prisma.$transaction([
      prisma.workRetroCard.updateMany({ where: { retroId: r.id, groupId: c.id }, data: { groupId: head.id, column: head.column } }),
      prisma.workRetroCard.update({ where: { id: c.id }, data: { groupId: head.id, column: head.column, body: input.body } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.workRetroCard.update({ where: { id: c.id }, data: { body: input.body, column: input.column, groupId: input.groupId === null ? null : undefined } }),
      ...(input.column ? [prisma.workRetroCard.updateMany({ where: { retroId: r.id, groupId: c.id }, data: { column: input.column } })] : []),
    ]);
  }
  emitAgile(projectId, 'retro', r.id, 'card');
  return { ok: true };
}

export async function deleteCard(userId: number, projectId: number, retroId: number, cardId: number) {
  const { a, r } = await writableRetro(userId, projectId, retroId);
  const c = await prisma.workRetroCard.findFirst({ where: { id: cardId, retroId: r.id }, select: { id: true, authorId: true } });
  if (!c) throw new NotFoundError('Note not found');
  if (c.authorId !== userId && !isFacilitator(a, r, userId)) throw new ForbiddenError('Only the author or the facilitator can delete a note');
  await prisma.workRetroCard.delete({ where: { id: c.id } });
  emitAgile(projectId, 'retro', r.id, 'card');
  return { ok: true };
}

/** Dot vote +1 / −1. Tổng chấm của một người trên cả retro ≤ votesPerPerson (kiểm trong transaction có khoá dòng retro). */
export async function voteCard(userId: number, projectId: number, retroId: number, cardId: number, delta: 1 | -1) {
  const { r } = await writableRetro(userId, projectId, retroId);
  const c = await prisma.workRetroCard.findFirst({ where: { id: cardId, retroId: r.id }, select: { id: true } });
  if (!c) throw new NotFoundError('Note not found');
  const out = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_retros WHERE id = ${r.id} FOR UPDATE`;
    const mineAll = await tx.workRetroVote.findMany({ where: { userId, card: { retroId: r.id } }, select: { cardId: true, count: true } });
    const used = mineAll.reduce((s, v) => s + v.count, 0);
    const cur = mineAll.find((v) => v.cardId === c.id)?.count ?? 0;
    if (delta === 1) {
      if (used >= r.votesPerPerson) throw new BadRequestError(`You have used all ${r.votesPerPerson} votes`, 'WORK_RETRO_NO_VOTES');
      await tx.workRetroVote.upsert({ where: { cardId_userId: { cardId: c.id, userId } }, create: { cardId: c.id, userId, count: 1 }, update: { count: cur + 1 } });
      return { votesLeft: votesLeft(r.votesPerPerson, used + 1), mine: cur + 1 };
    }
    if (cur <= 1) await tx.workRetroVote.deleteMany({ where: { cardId: c.id, userId } });
    else await tx.workRetroVote.update({ where: { cardId_userId: { cardId: c.id, userId } }, data: { count: cur - 1 } });
    return { votesLeft: votesLeft(r.votesPerPerson, Math.max(0, used - (cur ? 1 : 0))), mine: Math.max(0, cur - 1) };
  });
  emitAgile(projectId, 'retro', r.id, 'vote');
  return out;
}

// ─── Hành động ⇒ thẻ ─────────────────────────────────────────────

export async function addAction(userId: number, projectId: number, retroId: number, input: z.infer<typeof actionInput>) {
  const { a, r } = await retroFor(userId, projectId, retroId);
  requireWrite(a, 'this retro');
  if (input.cardId && !(await prisma.workRetroCard.findFirst({ where: { id: input.cardId, retroId: r.id }, select: { id: true } }))) {
    throw new BadRequestError('Note not found in this retro', 'WORK_RETRO_BAD_CARD');
  }
  let issueId: number | null = null;
  let issueNumber: number | null = null;
  if (input.createIssue) {
    const type = input.typeId
      ? await prisma.workIssueType.findFirst({ where: { id: input.typeId, projectId, archived: false }, select: { id: true } })
      : (await prisma.workIssueType.findFirst({ where: { projectId, key: 'TASK', archived: false }, select: { id: true } }))
        ?? (await prisma.workIssueType.findFirst({ where: { projectId, level: 0, archived: false }, orderBy: { position: 'asc' }, select: { id: true } }));
    if (!type) throw new BadRequestError('This project has no issue type for action items', 'WORK_RETRO_NO_TYPE');
    const { createIssueAs } = await import('./issues.service.js');
    const desc = `Action item from retro "${r.title}".`;
    const issue = await createIssueAs(userId, projectId, {
      typeId: type.id, title: input.title, assigneeId: input.assigneeId ?? undefined,
      descriptionJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: desc }] }] },
    });
    issueId = issue.id;
    issueNumber = issue.number;
  }
  const act = await prisma.workRetroAction.create({ data: { retroId: r.id, cardId: input.cardId ?? null, title: input.title, assigneeId: input.assigneeId ?? null, issueId, createdById: userId } });
  emitAgile(projectId, 'retro', r.id, 'action');
  return { id: act.id, issueNumber };
}

export async function deleteAction(userId: number, projectId: number, retroId: number, actionId: number) {
  const { a, r } = await retroFor(userId, projectId, retroId);
  requireWrite(a, 'this retro');
  const x = await prisma.workRetroAction.findFirst({ where: { id: actionId, retroId: r.id } });
  if (!x) throw new NotFoundError('Action not found');
  await prisma.workRetroAction.delete({ where: { id: x.id } });
  emitAgile(projectId, 'retro', r.id, 'action');
  return { ok: true };
}

// ─── Tóm tắt AI + xuất ───────────────────────────────────────────

/** Ghi chú cho AI: thẻ theo cột, có số vote, gom nhóm — KHÔNG có tên người (kể cả retro không ẩn danh). */
export function retroNotes(columns: readonly string[], cards: Array<{ id: number; column: string; body: string; groupId: number | null; votes: number }>, actions: Array<{ title: string }>): string {
  const lines: string[] = [];
  for (const col of columns) {
    const heads = cards.filter((c) => c.column === col && !c.groupId).sort((a, b) => b.votes - a.votes);
    if (!heads.length) continue;
    lines.push(`## ${RETRO_COLUMN_LABEL[col] ?? col}`);
    for (const h of heads) {
      const kids = cards.filter((c) => c.groupId === h.id);
      const v = h.votes + kids.reduce((s, k) => s + k.votes, 0);
      lines.push(`- ${h.body}${v ? ` (${v} vote${v === 1 ? '' : 's'})` : ''}`);
      for (const k of kids) lines.push(`  - ${k.body}`);
    }
  }
  if (actions.length) { lines.push('## Action items already agreed'); for (const a of actions) lines.push(`- ${a.title}`); }
  return lines.join('\n');
}

export async function summarize(userId: number, projectId: number, retroId: number, language: 'en' | 'vi' = 'en') {
  const { a, r } = await retroFor(userId, projectId, retroId);
  requireWrite(a, 'this retro');
  const view = await getRetro(userId, projectId, retroId);
  if (!view.cards.length) throw new BadRequestError('Add some notes before summarizing', 'WORK_RETRO_EMPTY');
  let sprintId = r.sprintId;
  if (!sprintId) {
    const s = await prisma.workSprint.findFirst({ where: { projectId, state: { in: ['ACTIVE', 'CLOSED'] } }, orderBy: [{ startAt: 'desc' }, { id: 'desc' }], select: { id: true } })
      ?? await prisma.workSprint.findFirst({ where: { projectId }, orderBy: { id: 'desc' }, select: { id: true } });
    if (!s) throw new BadRequestError('Link this retro to a sprint to get an AI summary', 'WORK_RETRO_NEED_SPRINT');
    sprintId = s.id;
  }
  const notes = retroNotes(view.columns, view.cards, view.actions);
  const ai = await import('./ai.service.js');
  const out = await ai.retro(userId, projectId, { sprintId, notes, language });
  await prisma.workRetro.update({ where: { id: r.id }, data: { summary: out.summary.slice(0, 20_000), summaryAt: new Date() } });
  emitAgile(projectId, 'retro', r.id, 'summary');
  return { summary: out.summary, actions: out.actions, quota: out.quota };
}

/** Markdown của retro (bản xuất) — tên người viết KHÔNG có mặt khi ẩn danh (lấy từ getRetro đã che). */
export function retroMarkdown(v: Awaited<ReturnType<typeof getRetro>>, projectKey: string): string {
  const out: string[] = [`# ${v.title}`, ''];
  out.push(`Project ${projectKey}${v.sprint ? ` · Sprint: ${v.sprint.name}` : ''} · ${v.anonymous ? 'Anonymous notes' : 'Named notes'} · ${new Date(v.createdAt).toISOString().slice(0, 10)}`, '');
  for (const col of v.columns) {
    out.push(`## ${RETRO_COLUMN_LABEL[col] ?? col}`, '');
    const heads = v.cards.filter((c) => c.column === col && !c.groupId).sort((a, b) => b.votes - a.votes);
    if (!heads.length) out.push('_No notes._', '');
    for (const h of heads) {
      const kids = v.cards.filter((c) => c.groupId === h.id);
      const votes = h.votes + kids.reduce((s, k) => s + k.votes, 0);
      const by = !v.anonymous && h.author ? ` — ${(h.author as PublicUser).displayName || (h.author as PublicUser).fullName || (h.author as PublicUser).username}` : '';
      out.push(`- ${h.body}${votes ? ` **(${votes} vote${votes === 1 ? '' : 's'})**` : ''}${by}`);
      for (const k of kids) out.push(`  - ${k.body}`);
    }
    out.push('');
  }
  out.push('## Action items', '');
  if (!v.actions.length) out.push('_None._');
  for (const a of v.actions) out.push(`- ${a.title}${a.issue ? ` (${projectKey}-${a.issue.number})` : ''}${a.assignee ? ` — @${a.assignee.username}` : ''}`);
  if (v.summary) out.push('', '## AI summary', '', v.summary);
  return out.join('\n');
}

export async function exportDocx(userId: number, projectId: number, retroId: number) {
  const v = await getRetro(userId, projectId, retroId);
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true } });
  const { markdownToTiptap } = await import('./docMarkdown.js');
  const { renderDocx } = await import('./docExport.js');
  const doc = markdownToTiptap(retroMarkdown(v, p.key)).doc;
  const buffer = await renderDocx(doc, { title: v.title, projectName: p.name, projectKey: p.key, docLabel: `RETRO-${v.id}`, version: null, date: new Date(), capstone: false }, { cover: false, toc: false, stripGuides: false, resolveImage: async () => null });
  const safe = v.title.replace(/[^\p{L}\p{N} _-]+/gu, '').trim().slice(0, 60) || `retro-${v.id}`;
  return { buffer, fileName: `${p.key} ${safe}.docx` };
}
