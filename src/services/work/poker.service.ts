/**
 * CT Work đợt 7a (11/10/2026) — PLANNING POKER (C23).
 *
 * Phòng ước lượng theo sprint/backlog: người điều phối (người tạo phòng hoặc ADMIN dự án) chọn thẻ ⇒ cả nhóm bỏ phiếu
 * KÍN ⇒ lật bài cùng lúc (bấm "Reveal" hoặc HẾT GIỜ — máy chủ tự lật ở lần đọc kế tiếp) ⇒ xem phân bố, người thấp/cao
 * nhất nói trước ⇒ bỏ phiếu lại (vòng mới) hoặc chốt ⇒ ghi `story_points` vào thẻ (qua updateIssueAs — có lịch sử,
 * kiểm phiên bản, khoá baseline). Lịch sử: mọi vòng + lá bài sau khi lật.
 *
 * Bí mật lá bài: trước khi lật, API chỉ trả "đã bỏ phiếu" cho người khác — giá trị chỉ trả cho CHÍNH người bỏ. Socket
 * (`work:agile`) chỉ mang id. Người bỏ phiếu: ADMIN/MEMBER là NGƯỜI. Giảng viên/viewer xem. AI agent: chỉ đọc + gợi ý
 * (suggest — thẻ tương tự đã ước lượng; KHÔNG ghi, KHÔNG bỏ phiếu).
 */

import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { emitAgile, requireWrite, teamAccess, usersById, type TeamAccess } from './agileCommon.js';
import {
  cardPoints, pokerDistribution, POKER_DECK_KEYS, POKER_TIMERS, suggestFromPeers, validCard, type PokerDeck,
} from './agileRules.js';
import { auditProject } from './audit.js';
import { effectiveProjectRole, effectiveWorkspaceRole, portalOnlyUserIds } from './permissions.js';
import type { ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';
import { PUBLIC_USER } from './common.js';

export const sessionInput = z.object({
  title: z.string().trim().min(1).max(120),
  deck: z.enum(POKER_DECK_KEYS as [PokerDeck, ...PokerDeck[]]).default('FIBONACCI'),
  sprintId: z.number().int().positive().nullable().optional(),
  /** Thẻ đưa vào phòng: số thẻ; bỏ trống + sprintId ⇒ mọi thẻ chưa xong của sprint. */
  issues: z.array(z.number().int().positive()).max(100).optional(),
});
export const itemsInput = z.object({ issues: z.array(z.number().int().positive()).min(1).max(100) });
export const timerInput = z.object({ seconds: z.number().int().refine((n) => (POKER_TIMERS as readonly number[]).includes(n), 'Unsupported timer') });
export const finalizeInput = z.object({ value: z.string().min(1).max(8) });

const SESSION_SELECT = {
  id: true, projectId: true, title: true, deck: true, sprintId: true, status: true, currentItemId: true, timerEndsAt: true, createdById: true, createdAt: true, closedAt: true,
} as const;

function isFacilitator(a: TeamAccess, s: { createdById: number | null }, userId: number) {
  return a.principal === 'HUMAN' && (a.role === 'ADMIN' || s.createdById === userId);
}

async function sessionFor(userId: number, projectId: number, sessionId: number) {
  const a = await teamAccess(userId, projectId);
  const s = await prisma.workPokerSession.findFirst({ where: { id: sessionId, projectId }, select: SESSION_SELECT });
  if (!s) throw new NotFoundError('Estimation session not found');
  return { a, s };
}

async function facilitatorFor(userId: number, projectId: number, sessionId: number) {
  const r = await sessionFor(userId, projectId, sessionId);
  if (r.a.principal === 'AGENT') throw new ForbiddenError('AI agents can read estimation sessions but cannot run them');
  if (!isFacilitator(r.a, r.s, userId)) throw new ForbiddenError('Only the facilitator (who created the session) or a project admin can do this');
  if (r.s.status === 'CLOSED') throw new BadRequestError('This session is closed', 'WORK_POKER_CLOSED');
  return r;
}

/** Người bỏ phiếu được: ADMIN/MEMBER là người (một lượt truy vấn — cùng luật effectiveProjectRole). */
async function voters(projectId: number) {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true, visibility: true } });
  if (!p) return [];
  const [ws, pm, portalOnly] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: p.workspaceId }, select: { role: true, user: { select: PUBLIC_USER } } }),
    prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true, role: true } }),
    portalOnlyUserIds(p.workspaceId),
  ]);
  const explicit = new Map(pm.map((m) => [m.userId, m.role as ProjectRole]));
  return ws.filter((m) => {
    if (m.user.kind === 'AGENT') return false;
    const role = effectiveProjectRole({ workspaceRole: effectiveWorkspaceRole(m.role as WorkspaceRole, portalOnly.has(m.user.id)), projectRole: explicit.get(m.user.id) ?? null, visibility: p.visibility as ProjectVisibility });
    return role === 'ADMIN' || role === 'MEMBER';
  }).map((m) => m.user);
}

async function issueIds(projectId: number, numbers: number[]) {
  const rows = await prisma.workIssue.findMany({ where: { projectId, number: { in: numbers }, deletedAt: null }, select: { id: true, number: true } });
  if (rows.length !== new Set(numbers).size) throw new BadRequestError('Some issues were not found in this project', 'WORK_POKER_BAD_ISSUE');
  const byNum = new Map(rows.map((r) => [r.number, r.id]));
  return [...new Set(numbers)].map((n) => byNum.get(n)!);
}

/** Hết giờ ⇒ lật bài (điều kiện trên state ⇒ hai lần đọc cùng lúc chỉ một lần đổi). */
async function autoReveal(s: { id: number; projectId: number; currentItemId: number | null; timerEndsAt: Date | null }) {
  if (!s.currentItemId || !s.timerEndsAt || s.timerEndsAt.getTime() > Date.now()) return false;
  const r = await prisma.workPokerItem.updateMany({ where: { id: s.currentItemId, sessionId: s.id, state: 'VOTING' }, data: { state: 'REVEALED', revealedAt: new Date() } });
  await prisma.workPokerSession.update({ where: { id: s.id }, data: { timerEndsAt: null } });
  if (r.count) emitAgile(s.projectId, 'poker', s.id, 'revealed');
  return r.count > 0;
}

// ─── Danh sách / tạo ─────────────────────────────────────────────

export async function listSessions(userId: number, projectId: number) {
  const a = await teamAccess(userId, projectId);
  const rows = await prisma.workPokerSession.findMany({
    where: { projectId }, orderBy: [{ status: 'desc' }, { createdAt: 'desc' }], take: 100,
    select: { ...SESSION_SELECT, items: { select: { state: true, finalPoints: true } } },
  });
  const sprintIds = [...new Set(rows.map((r) => r.sprintId).filter((x): x is number => !!x))];
  const sprints = new Map((await prisma.workSprint.findMany({ where: { id: { in: sprintIds } }, select: { id: true, name: true } })).map((s) => [s.id, s.name]));
  const users = await usersById(rows.map((r) => r.createdById));
  return {
    canCreate: a.canWrite,
    sessions: rows.map((r) => ({
      id: r.id, title: r.title, deck: r.deck, status: r.status, sprint: r.sprintId ? { id: r.sprintId, name: sprints.get(r.sprintId) ?? null } : null,
      createdBy: r.createdById ? users.get(r.createdById) ?? null : null, createdAt: r.createdAt, closedAt: r.closedAt,
      items: r.items.length, estimated: r.items.filter((i) => i.state === 'ESTIMATED').length,
      points: r.items.reduce((s, i) => s + (i.finalPoints ?? 0), 0),
    })),
  };
}

export async function createSession(userId: number, projectId: number, input: z.infer<typeof sessionInput>) {
  const a = await teamAccess(userId, projectId);
  requireWrite(a, 'estimation sessions');
  if (input.sprintId && !(await prisma.workSprint.findFirst({ where: { id: input.sprintId, projectId }, select: { id: true } }))) {
    throw new BadRequestError('Sprint not found in this project', 'WORK_POKER_BAD_SPRINT');
  }
  let ids: number[] = [];
  if (input.issues?.length) ids = await issueIds(projectId, input.issues);
  else if (input.sprintId) {
    ids = (await prisma.workIssue.findMany({
      where: { projectId, sprintId: input.sprintId, deletedAt: null, status: { category: { not: 'DONE' } }, type: { level: 0 } },
      orderBy: { rank: 'asc' }, take: 100, select: { id: true },
    })).map((r) => r.id);
  }
  const s = await prisma.workPokerSession.create({
    data: { projectId, title: input.title, deck: input.deck, sprintId: input.sprintId ?? null, createdById: userId, items: { create: ids.map((issueId, position) => ({ issueId, position })) } },
  });
  await auditProject(projectId, { actorId: userId, action: 'poker.session.create', targetType: 'poker_session', targetId: s.id, summary: `Started estimation session "${s.title}" (${ids.length} issues)` });
  emitAgile(projectId, 'poker', s.id, 'created');
  return { id: s.id, items: ids.length };
}

export async function addItems(userId: number, projectId: number, sessionId: number, input: z.infer<typeof itemsInput>) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const ids = await issueIds(projectId, input.issues);
  const have = new Set((await prisma.workPokerItem.findMany({ where: { sessionId: s.id }, select: { issueId: true } })).map((r) => r.issueId));
  const base = await prisma.workPokerItem.count({ where: { sessionId: s.id } });
  const add = ids.filter((id) => !have.has(id));
  if (base + add.length > 200) throw new BadRequestError('A session can hold at most 200 issues', 'WORK_POKER_TOO_MANY');
  await prisma.workPokerItem.createMany({ data: add.map((issueId, i) => ({ sessionId: s.id, issueId, position: base + i })) });
  emitAgile(projectId, 'poker', s.id, 'items');
  return { added: add.length };
}

export async function removeItem(userId: number, projectId: number, sessionId: number, itemId: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const it = await prisma.workPokerItem.findFirst({ where: { id: itemId, sessionId: s.id } });
  if (!it) throw new NotFoundError('Item not found');
  await prisma.$transaction([
    prisma.workPokerItem.delete({ where: { id: it.id } }),
    ...(s.currentItemId === it.id ? [prisma.workPokerSession.update({ where: { id: s.id }, data: { currentItemId: null, timerEndsAt: null } })] : []),
  ]);
  emitAgile(projectId, 'poker', s.id, 'items');
  return { ok: true };
}

// ─── Chi tiết phòng (che lá bài) ─────────────────────────────────

export async function getSession(userId: number, projectId: number, sessionId: number) {
  const { a, s: s0 } = await sessionFor(userId, projectId, sessionId);
  if (s0.status === 'OPEN') await autoReveal(s0);
  const s = (await prisma.workPokerSession.findUnique({ where: { id: s0.id }, select: SESSION_SELECT }))!;
  const items = await prisma.workPokerItem.findMany({
    where: { sessionId: s.id }, orderBy: [{ position: 'asc' }, { id: 'asc' }],
    select: {
      id: true, issueId: true, position: true, state: true, round: true, finalValue: true, finalPoints: true, previousPoints: true, estimatedById: true, estimatedAt: true, revealedAt: true,
      issue: { select: { number: true, title: true, storyPoints: true, descriptionText: true, deletedAt: true, type: { select: { key: true, name: true, color: true } }, status: { select: { name: true, category: true } } } },
      votes: { orderBy: [{ round: 'asc' }, { id: 'asc' }], select: { round: true, userId: true, value: true, updatedAt: true } },
    },
  });
  const deck = s.deck as PokerDeck;
  const team = await voters(projectId);
  const users = await usersById([...items.flatMap((i) => [i.estimatedById, ...i.votes.map((v) => v.userId)]), s.createdById]);
  const pub = (id: number) => users.get(id) ?? team.find((t) => t.id === id) ?? null;
  const sprint = s.sprintId ? await prisma.workSprint.findUnique({ where: { id: s.sprintId }, select: { id: true, name: true } }) : null;
  const facilitator = isFacilitator(a, s, userId);

  const shaped = items.filter((i) => !i.issue.deletedAt).map((i) => {
    const current = i.votes.filter((v) => v.round === i.round);
    const open = i.state === 'VOTING' || i.state === 'PENDING';
    // Lịch sử các vòng ĐÃ lật (vòng trước vòng hiện tại luôn đã lật; vòng hiện tại chỉ khi REVEALED/ESTIMATED).
    const rounds: Array<{ round: number; votes: Array<{ user: unknown; value: string }>; distribution: ReturnType<typeof pokerDistribution> }> = [];
    for (let r = 1; r <= i.round; r++) {
      if (r === i.round && open) break;
      const vs = i.votes.filter((v) => v.round === r);
      if (!vs.length) continue;
      rounds.push({ round: r, votes: vs.map((v) => ({ user: pub(v.userId), value: v.value })), distribution: pokerDistribution(deck, vs.map((v) => v.value)) });
    }
    return {
      id: i.id, position: i.position, state: i.state, round: i.round,
      issue: { number: i.issue.number, title: i.issue.title, storyPoints: i.issue.storyPoints, type: i.issue.type, status: i.issue.status, description: i.issue.descriptionText?.slice(0, 600) ?? null },
      finalValue: i.finalValue, finalPoints: i.finalPoints, previousPoints: i.previousPoints,
      estimatedBy: i.estimatedById ? pub(i.estimatedById) : null, estimatedAt: i.estimatedAt, revealedAt: i.revealedAt,
      // Trước khi lật: chỉ biết AI đã bỏ — không biết bỏ GÌ. Lá của chính mình thì trả.
      voted: current.map((v) => v.userId),
      myVote: current.find((v) => v.userId === userId)?.value ?? null,
      votes: open ? null : current.map((v) => ({ user: pub(v.userId), value: v.value })),
      distribution: open ? null : pokerDistribution(deck, current.map((v) => v.value)),
      rounds,
    };
  });
  return {
    id: s.id, projectId, title: s.title, deck, cards: deckCards(deck), status: s.status, sprint, currentItemId: s.currentItemId,
    timerEndsAt: s.timerEndsAt, serverNow: new Date(), createdAt: s.createdAt, closedAt: s.closedAt,
    facilitator: s.createdById ? pub(s.createdById) : null,
    me: { canVote: a.canWrite && s.status === 'OPEN', canFacilitate: facilitator && s.status === 'OPEN' },
    voters: team,
    items: shaped,
  };
}

function deckCards(deck: PokerDeck) {
  return (deck === 'TSHIRT' ? ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'] : ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'])
    .map((value) => ({ value, points: cardPoints(deck, value) }));
}

// ─── Điều phối ───────────────────────────────────────────────────

/** Bắt đầu bỏ phiếu cho một thẻ (thẻ đang dở được trả về PENDING nếu chưa lật). */
export async function startItem(userId: number, projectId: number, sessionId: number, itemId: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const it = await prisma.workPokerItem.findFirst({ where: { id: itemId, sessionId: s.id } });
  if (!it) throw new NotFoundError('Item not found');
  await prisma.$transaction(async (tx) => {
    if (s.currentItemId && s.currentItemId !== it.id) {
      await tx.workPokerItem.updateMany({ where: { id: s.currentItemId, state: 'VOTING' }, data: { state: 'PENDING' } });
    }
    // Thẻ đã chốt/đã lật mở lại ⇒ vòng MỚI (lịch sử vòng cũ giữ nguyên).
    const again = it.state === 'REVEALED' || it.state === 'ESTIMATED' || it.state === 'SKIPPED';
    await tx.workPokerItem.update({ where: { id: it.id }, data: { state: 'VOTING', round: again ? it.round + 1 : it.round, revealedAt: null } });
    await tx.workPokerSession.update({ where: { id: s.id }, data: { currentItemId: it.id, timerEndsAt: null } });
  });
  emitAgile(projectId, 'poker', s.id, 'started');
  return { ok: true };
}

export async function vote(userId: number, projectId: number, sessionId: number, itemId: number, value: string | null) {
  const { a, s } = await sessionFor(userId, projectId, sessionId);
  if (a.principal === 'AGENT') throw new ForbiddenError('AI agents cannot vote — they can only read and suggest');
  if (!a.canWrite) throw new ForbiddenError('Only project admins and members can vote');
  if (s.status !== 'OPEN') throw new BadRequestError('This session is closed', 'WORK_POKER_CLOSED');
  await autoReveal(s);
  const it = await prisma.workPokerItem.findFirst({ where: { id: itemId, sessionId: s.id }, select: { id: true, state: true, round: true } });
  if (!it) throw new NotFoundError('Item not found');
  if (it.state !== 'VOTING') throw new ConflictError('Voting is not open for this issue');
  if (value === null) {
    await prisma.workPokerVote.deleteMany({ where: { itemId: it.id, round: it.round, userId } });
  } else {
    if (!validCard(s.deck as PokerDeck, value)) throw new BadRequestError('That card is not in this deck', 'WORK_POKER_BAD_CARD');
    await prisma.workPokerVote.upsert({
      where: { itemId_round_userId: { itemId: it.id, round: it.round, userId } },
      create: { itemId: it.id, round: it.round, userId, value },
      update: { value },
    });
  }
  emitAgile(projectId, 'poker', s.id, 'voted');
  return { ok: true };
}

export async function reveal(userId: number, projectId: number, sessionId: number, itemId: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const r = await prisma.workPokerItem.updateMany({ where: { id: itemId, sessionId: s.id, state: 'VOTING' }, data: { state: 'REVEALED', revealedAt: new Date() } });
  if (!r.count) throw new ConflictError('This issue is not being voted on');
  await prisma.workPokerSession.update({ where: { id: s.id }, data: { timerEndsAt: null } });
  emitAgile(projectId, 'poker', s.id, 'revealed');
  return { ok: true };
}

/** Bỏ phiếu lại: vòng mới, lá cũ giữ trong lịch sử. */
export async function revote(userId: number, projectId: number, sessionId: number, itemId: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const it = await prisma.workPokerItem.findFirst({ where: { id: itemId, sessionId: s.id } });
  if (!it) throw new NotFoundError('Item not found');
  if (it.state !== 'REVEALED' && it.state !== 'ESTIMATED') throw new ConflictError('Reveal the cards before voting again');
  await prisma.$transaction([
    prisma.workPokerItem.update({ where: { id: it.id }, data: { state: 'VOTING', round: it.round + 1, revealedAt: null } }),
    prisma.workPokerSession.update({ where: { id: s.id }, data: { currentItemId: it.id, timerEndsAt: null } }),
  ]);
  emitAgile(projectId, 'poker', s.id, 'started');
  return { ok: true, round: it.round + 1 };
}

export async function setTimer(userId: number, projectId: number, sessionId: number, seconds: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  if (seconds && !s.currentItemId) throw new BadRequestError('Start voting on an issue first', 'WORK_POKER_NO_ITEM');
  const ends = seconds ? new Date(Date.now() + seconds * 1000) : null;
  await prisma.workPokerSession.update({ where: { id: s.id }, data: { timerEndsAt: ends } });
  emitAgile(projectId, 'poker', s.id, 'timer');
  return { timerEndsAt: ends };
}

/**
 * Chốt điểm ⇒ ghi story_points của thẻ (updateIssueAs: lịch sử, quyền issue.edit, khoá baseline, sự kiện board).
 * '?'/'☕' không chốt được. Thẻ phải đã lật (không chốt khi bài còn úp).
 */
export async function finalize(userId: number, projectId: number, sessionId: number, itemId: number, value: string) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const deck = s.deck as PokerDeck;
  if (!validCard(deck, value)) throw new BadRequestError('That card is not in this deck', 'WORK_POKER_BAD_CARD');
  const points = cardPoints(deck, value);
  if (points === null) throw new BadRequestError('Pick a card with a value to finalize', 'WORK_POKER_BAD_CARD');
  const it = await prisma.workPokerItem.findFirst({ where: { id: itemId, sessionId: s.id }, select: { id: true, state: true, issue: { select: { number: true, storyPoints: true } } } });
  if (!it) throw new NotFoundError('Item not found');
  if (it.state !== 'REVEALED' && it.state !== 'ESTIMATED') throw new ConflictError('Reveal the cards before finalizing');
  const { updateIssueAs } = await import('./issues.service.js');
  await updateIssueAs(userId, projectId, it.issue.number, { storyPoints: points });
  await prisma.$transaction([
    prisma.workPokerItem.update({ where: { id: it.id }, data: { state: 'ESTIMATED', finalValue: value, finalPoints: points, previousPoints: it.issue.storyPoints, estimatedById: userId, estimatedAt: new Date() } }),
    prisma.workPokerSession.update({ where: { id: s.id }, data: { currentItemId: s.currentItemId === it.id ? null : s.currentItemId, timerEndsAt: s.currentItemId === it.id ? null : undefined } }),
  ]);
  emitAgile(projectId, 'poker', s.id, 'estimated');
  return { ok: true, storyPoints: points };
}

export async function skipItem(userId: number, projectId: number, sessionId: number, itemId: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  const r = await prisma.workPokerItem.updateMany({ where: { id: itemId, sessionId: s.id }, data: { state: 'SKIPPED' } });
  if (!r.count) throw new NotFoundError('Item not found');
  if (s.currentItemId === itemId) await prisma.workPokerSession.update({ where: { id: s.id }, data: { currentItemId: null, timerEndsAt: null } });
  emitAgile(projectId, 'poker', s.id, 'skipped');
  return { ok: true };
}

export async function closeSession(userId: number, projectId: number, sessionId: number) {
  const { s } = await facilitatorFor(userId, projectId, sessionId);
  await prisma.$transaction([
    prisma.workPokerItem.updateMany({ where: { sessionId: s.id, state: 'VOTING' }, data: { state: 'PENDING' } }),
    prisma.workPokerSession.update({ where: { id: s.id }, data: { status: 'CLOSED', closedAt: new Date(), currentItemId: null, timerEndsAt: null } }),
  ]);
  await auditProject(projectId, { actorId: userId, action: 'poker.session.close', targetType: 'poker_session', targetId: s.id, summary: `Closed estimation session "${s.title}"` });
  emitAgile(projectId, 'poker', s.id, 'closed');
  return { ok: true };
}

export async function deleteSession(userId: number, projectId: number, sessionId: number) {
  const { a, s } = await sessionFor(userId, projectId, sessionId);
  if (!isFacilitator(a, s, userId)) throw new ForbiddenError('Only the facilitator or a project admin can delete this session');
  await prisma.workPokerSession.delete({ where: { id: s.id } });
  emitAgile(projectId, 'poker', s.id, 'deleted');
  return { ok: true };
}

// ─── Gợi ý (chỉ đọc) + lịch sử ước lượng của thẻ ─────────────────

/** GỢI Ý điểm từ thẻ tương tự đã có điểm trong dự án — không ghi gì; agent AI gọi được (chỉ đọc). */
export async function suggest(userId: number, projectId: number, sessionId: number, itemId: number) {
  const { s } = await sessionFor(userId, projectId, sessionId);
  const it = await prisma.workPokerItem.findFirst({ where: { id: itemId, sessionId: s.id }, select: { issueId: true, issue: { select: { title: true, type: { select: { key: true } } } } } });
  if (!it) throw new NotFoundError('Item not found');
  const a = await teamAccess(userId, projectId);
  const peers = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, storyPoints: { not: null }, id: { not: it.issueId } },
    orderBy: { updatedAt: 'desc' }, take: 500,
    select: { number: true, title: true, storyPoints: true, type: { select: { key: true } } },
  });
  const r = suggestFromPeers(s.deck as PokerDeck, { title: it.issue.title, typeKey: it.issue.type.key },
    peers.map((p) => ({ key: `${a.key}-${p.number}`, title: p.title, points: p.storyPoints!, typeKey: p.type.key })));
  return { ...r, kind: 'suggestion' as const, note: 'Suggestion based on similar estimated issues — the team decides.' };
}

export async function issueEstimates(userId: number, projectId: number, number: number) {
  await teamAccess(userId, projectId);
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const rows = await prisma.workPokerItem.findMany({
    where: { issueId: issue.id, state: 'ESTIMATED' }, orderBy: { estimatedAt: 'desc' },
    select: { finalValue: true, finalPoints: true, previousPoints: true, estimatedAt: true, estimatedById: true, round: true, session: { select: { id: true, title: true, deck: true } } },
  });
  const users = await usersById(rows.map((r) => r.estimatedById));
  return rows.map((r) => ({ ...r, estimatedBy: r.estimatedById ? users.get(r.estimatedById) ?? null : null }));
}
