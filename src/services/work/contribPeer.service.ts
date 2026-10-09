/**
 * CT Work — ĐÁNH GIÁ CHÉO (peer evaluation, A27) theo sprint / giai đoạn / khoảng tuỳ chọn.
 *
 * Luật ẩn danh (bất biến, có test):
 *   - `reviewerId` KHÔNG BAO GIỜ ra khỏi máy chủ — kể cả với trưởng nhóm (ADMIN cũng là sinh viên trong nhóm) và
 *     giảng viên. Họ thấy: điểm trung bình từng tiêu chí của mỗi người, số phiếu, nhận xét KHÔNG tên (xếp chữ cái),
 *     và AI ĐÃ NỘP / CHƯA NỘP (để nhắc) — không bao giờ ai chấm ai bao nhiêu.
 *   - Thành viên: thấy và sửa phiếu CỦA MÌNH khi đợt còn mở; sau khi đóng thấy điểm trung bình VỀ MÌNH nếu có ≥ 2
 *     người chấm, không thấy nhận xét (văn phong lộ người viết).
 *   - Không tự chấm mình. Agent không chấm, không bị chấm. Khách/GUEST không thấy gì (contribGate).
 * Mở / đóng / xoá đợt: ADMIN dự án + TEACHER.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import type { PublicUser } from './common.js';
import { contribGate } from './contrib.service.js';
import {
  aggregatePeer, DEFAULT_CRITERIA, normalizeCriteria, PEER_MIN_REVIEWERS_FOR_SELF, validateScores, type Criterion,
} from './contribRules.js';
import { projectMembers } from './projects.service.js';

async function participants(projectId: number): Promise<PublicUser[]> {
  const all = await projectMembers(projectId);
  return all.filter((m) => (m.role === 'ADMIN' || m.role === 'MEMBER') && m.kind !== 'AGENT')
    .map((m) => ({ id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, avatarUrl: m.avatarUrl, kind: m.kind }));
}

const criteriaOf = (raw: unknown): Criterion[] => {
  try { return normalizeCriteria(raw); } catch { return DEFAULT_CRITERIA; }
};

/** Đợt quá hạn đóng ⇒ coi như đã đóng (ghi lại lười, không cần cron). */
async function effectiveStatus(r: { id: number; status: string; closesAt: Date | null }): Promise<'OPEN' | 'CLOSED'> {
  if (r.status === 'OPEN' && r.closesAt && r.closesAt < new Date()) {
    await prisma.workPeerRound.update({ where: { id: r.id }, data: { status: 'CLOSED', closedAt: r.closesAt } }).catch(() => undefined);
    return 'CLOSED';
  }
  return r.status === 'OPEN' ? 'OPEN' : 'CLOSED';
}

export async function listRounds(userId: number, projectId: number) {
  const g = await contribGate(userId, projectId);
  const [rounds, people] = await Promise.all([
    prisma.workPeerRound.findMany({
      where: { projectId }, orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, scope: true, sprintId: true, stageId: true, status: true, closesAt: true, closedAt: true, createdAt: true, criteria: true, reviews: { select: { reviewerId: true, revieweeId: true } } },
    }),
    participants(projectId),
  ]);
  const ids = new Set(people.map((p) => p.id));
  const isParticipant = ids.has(userId) && g.ca.peerParticipant;
  const expectedPer = Math.max(0, people.length - 1);
  const out = [];
  for (const r of rounds) {
    const valid = r.reviews.filter((x) => ids.has(x.reviewerId) && ids.has(x.revieweeId));
    out.push({
      id: r.id, title: r.title, scope: r.scope, sprintId: r.sprintId, stageId: r.stageId, status: await effectiveStatus(r), closesAt: r.closesAt, closedAt: r.closedAt, createdAt: r.createdAt,
      criteria: criteriaOf(r.criteria).length,
      participants: people.length,
      submitted: valid.length,
      expected: people.length * expectedPer,
      mine: isParticipant ? { done: valid.filter((x) => x.reviewerId === userId).length, total: expectedPer } : null,
    });
  }
  return { rounds: out, canManage: g.ca.peerAdmin, canParticipate: isParticipant, defaultCriteria: DEFAULT_CRITERIA };
}

export interface RoundInput { title: string; scope?: 'SPRINT' | 'STAGE' | 'CUSTOM'; sprintId?: number | null; stageId?: number | null; criteria?: unknown; closesAt?: Date | null }

export async function createRound(userId: number, projectId: number, input: RoundInput) {
  const g = await contribGate(userId, projectId);
  if (!g.ca.peerAdmin) throw new AppError('Only project admins and teachers can open a peer review', 403, 'FORBIDDEN');
  let criteria: Criterion[];
  try { criteria = input.criteria === undefined ? DEFAULT_CRITERIA : normalizeCriteria(input.criteria); } catch (e) { throw new BadRequestError((e as Error).message, 'VALIDATION_ERROR'); }
  if (input.sprintId && !(await prisma.workSprint.count({ where: { id: input.sprintId, projectId } }))) throw new NotFoundError('Sprint not found');
  if (input.stageId && !(await prisma.workStage.count({ where: { id: input.stageId, projectId } }))) throw new NotFoundError('Stage not found');
  if (input.closesAt && input.closesAt < new Date()) throw new BadRequestError('The closing time is in the past', 'VALIDATION_ERROR');
  const r = await prisma.workPeerRound.create({
    data: {
      projectId, title: input.title.trim().slice(0, 160), scope: input.scope ?? (input.sprintId ? 'SPRINT' : input.stageId ? 'STAGE' : 'CUSTOM'),
      sprintId: input.sprintId ?? null, stageId: input.stageId ?? null, criteria: criteria as unknown as Prisma.InputJsonValue,
      closesAt: input.closesAt ?? null, createdById: userId,
    },
    select: { id: true },
  });
  return getRound(userId, projectId, r.id);
}

export async function updateRound(userId: number, projectId: number, roundId: number, patch: { title?: string; status?: 'OPEN' | 'CLOSED'; closesAt?: Date | null }) {
  const g = await contribGate(userId, projectId);
  if (!g.ca.peerAdmin) throw new AppError('Only project admins and teachers can change a peer review', 403, 'FORBIDDEN');
  const r = await prisma.workPeerRound.findFirst({ where: { id: roundId, projectId }, select: { id: true } });
  if (!r) throw new NotFoundError('Peer review not found');
  if (patch.closesAt && patch.closesAt < new Date() && patch.status !== 'CLOSED') throw new BadRequestError('The closing time is in the past', 'VALIDATION_ERROR');
  await prisma.workPeerRound.update({
    where: { id: roundId },
    data: {
      ...(patch.title ? { title: patch.title.trim().slice(0, 160) } : {}),
      ...(patch.closesAt !== undefined ? { closesAt: patch.closesAt } : {}),
      ...(patch.status === 'CLOSED' ? { status: 'CLOSED', closedAt: new Date() } : {}),
      // Mở lại: bỏ hạn cũ đã qua, nếu không lần đọc sau sẽ tự đóng ngay.
      ...(patch.status === 'OPEN' ? { status: 'OPEN', closedAt: null, ...(patch.closesAt === undefined ? { closesAt: null } : {}) } : {}),
    },
  });
  return getRound(userId, projectId, roundId);
}

export async function deleteRound(userId: number, projectId: number, roundId: number) {
  const g = await contribGate(userId, projectId);
  if (!g.ca.peerAdmin) throw new AppError('Only project admins and teachers can delete a peer review', 403, 'FORBIDDEN');
  const r = await prisma.workPeerRound.findFirst({ where: { id: roundId, projectId }, select: { id: true, _count: { select: { reviews: true } } } });
  if (!r) throw new NotFoundError('Peer review not found');
  // Phiếu đã nộp là bằng chứng của nhóm — có phiếu thì chỉ ĐÓNG được, không xoá.
  if (r._count.reviews > 0 && !g.ca.manage) throw new AppError('This peer review already has answers — close it instead of deleting it', 409, 'WORK_PEER_HAS_REVIEWS');
  await prisma.workPeerRound.delete({ where: { id: roundId } });
  return { ok: true };
}

export async function getRound(userId: number, projectId: number, roundId: number) {
  const g = await contribGate(userId, projectId);
  const r = await prisma.workPeerRound.findFirst({
    where: { id: roundId, projectId },
    select: { id: true, title: true, scope: true, sprintId: true, stageId: true, status: true, criteria: true, closesAt: true, closedAt: true, createdAt: true },
  });
  if (!r) throw new NotFoundError('Peer review not found');
  const status = await effectiveStatus(r);
  const criteria = criteriaOf(r.criteria);
  const people = await participants(projectId);
  const ids = new Set(people.map((p) => p.id));
  // Chỉ phiếu giữa những người còn trong nhóm (người đã rời: phiếu của/về họ không tính).
  const reviews = (await prisma.workPeerReview.findMany({ where: { roundId }, select: { reviewerId: true, revieweeId: true, scores: true, comment: true, updatedAt: true } }))
    .filter((x) => ids.has(x.reviewerId) && ids.has(x.revieweeId));
  const isParticipant = g.ca.peerParticipant && ids.has(userId);
  const mine = isParticipant
    ? reviews.filter((x) => x.reviewerId === userId).map((x) => ({ revieweeId: x.revieweeId, scores: x.scores as Record<string, number>, comment: x.comment, updatedAt: x.updatedAt }))
    : [];
  const agg = aggregatePeer(reviews, criteria);
  const base = {
    id: r.id, title: r.title, scope: r.scope, sprintId: r.sprintId, stageId: r.stageId, status, criteria, closesAt: r.closesAt, closedAt: r.closedAt, createdAt: r.createdAt,
    canManage: g.ca.peerAdmin, canParticipate: isParticipant && status === 'OPEN',
    // Người cần chấm: mọi người tham gia trừ chính mình.
    toReview: isParticipant ? people.filter((p) => p.id !== userId) : [],
    mine,
  };
  if (g.ca.peerAdmin) {
    const expected = Math.max(0, people.length - 1);
    // Chống suy ra người chấm: khi đợt còn MỞ, "ai đã nộp" + điểm thay đổi sau mỗi lần nộp = lộ ai chấm gì ⇒ chỉ trả tiến độ.
    // Sau khi ĐÓNG, người có < 2 phiếu cũng ẩn điểm (một phiếu = biết ngay là ai chấm nếu chỉ một người chưa nộp…).
    const closed = status === 'CLOSED';
    const visible = (a: { count: number } | undefined) => closed && (a?.count ?? 0) >= PEER_MIN_REVIEWERS_FOR_SELF;
    const shown = [...agg.values()].filter((a) => visible(a));
    return {
      ...base,
      results: people.map((p) => {
        const a = agg.get(p.id);
        const ok = visible(a);
        return { user: p, count: a?.count ?? 0, byCriterion: ok ? a!.byCriterion : {}, overall: ok ? a!.overall : null, comments: ok ? a!.comments : [] };
      }),
      resultsHiddenReason: closed ? `Scores show for people rated by at least ${PEER_MIN_REVIEWERS_FOR_SELF} teammates.` : 'Scores appear when the review is closed, so nobody can work out who gave which score while people are still submitting.',
      // AI ĐÃ NỘP (để nhắc) — không kèm nội dung, không kèm người được chấm.
      completion: people.map((p) => ({ user: p, submitted: reviews.filter((x) => x.reviewerId === p.id).length, expected })),
      teamAverage: shown.length ? Math.round((shown.reduce((s, a) => s + (a.overall ?? 0), 0) / shown.length) * 10) / 10 : null,
      myResult: null,
    };
  }
  const meAgg = agg.get(userId);
  const showSelf = isParticipant && status === 'CLOSED' && (meAgg?.count ?? 0) >= PEER_MIN_REVIEWERS_FOR_SELF;
  return {
    ...base,
    results: null,
    resultsHiddenReason: null,
    completion: null,
    teamAverage: null,
    myResult: isParticipant && status === 'CLOSED'
      ? (showSelf ? { count: meAgg!.count, byCriterion: meAgg!.byCriterion, overall: meAgg!.overall } : { count: meAgg?.count ?? 0, byCriterion: null, overall: null, hiddenReason: `Shown when at least ${PEER_MIN_REVIEWERS_FOR_SELF} teammates have rated you` })
      : null,
  };
}

export async function submitReview(userId: number, projectId: number, roundId: number, revieweeId: number, input: { scores: unknown; comment?: string | null }) {
  const g = await contribGate(userId, projectId);
  const r = await prisma.workPeerRound.findFirst({ where: { id: roundId, projectId }, select: { id: true, status: true, closesAt: true, criteria: true } });
  if (!r) throw new NotFoundError('Peer review not found');
  if ((await effectiveStatus(r)) !== 'OPEN') throw new AppError('This peer review is closed', 409, 'WORK_PEER_CLOSED');
  if (!g.ca.peerParticipant) throw new AppError('Only team members can rate teammates', 403, 'FORBIDDEN');
  if (revieweeId === userId) throw new BadRequestError('You cannot rate yourself', 'WORK_PEER_SELF');
  const people = await participants(projectId);
  if (!people.some((p) => p.id === userId)) throw new AppError('Only team members can rate teammates', 403, 'FORBIDDEN');
  if (!people.some((p) => p.id === revieweeId)) throw new BadRequestError('Pick a teammate in this project', 'WORK_BAD_MEMBER');
  let scores: Record<string, number>;
  try { scores = validateScores(criteriaOf(r.criteria), input.scores); } catch (e) { throw new BadRequestError((e as Error).message, 'VALIDATION_ERROR'); }
  const comment = input.comment?.trim() ? input.comment.trim().slice(0, 2000) : null;
  await prisma.workPeerReview.upsert({
    where: { roundId_reviewerId_revieweeId: { roundId, reviewerId: userId, revieweeId } },
    create: { roundId, reviewerId: userId, revieweeId, scores, comment },
    update: { scores, comment },
  });
  return { ok: true, revieweeId, scores, comment };
}

/** Tổng hợp mọi đợt cho xuất tệp (chỉ người được thấy tổng hợp). */
export async function peerSummaryForExport(projectId: number) {
  const [rounds, people] = await Promise.all([
    prisma.workPeerRound.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' }, select: { id: true, title: true, status: true, criteria: true, reviews: { select: { reviewerId: true, revieweeId: true, scores: true, comment: true } } } }),
    participants(projectId),
  ]);
  const ids = new Set(people.map((p) => p.id));
  return rounds.map((r) => {
    const criteria = criteriaOf(r.criteria);
    const valid = r.reviews.filter((x) => ids.has(x.reviewerId) && ids.has(x.revieweeId));
    const agg = aggregatePeer(valid, criteria);
    const closed = r.status === 'CLOSED';
    return {
      title: r.title, status: r.status, criteria,
      rows: people.map((p) => {
        const a = agg.get(p.id);
        const ok = closed && (a?.count ?? 0) >= PEER_MIN_REVIEWERS_FOR_SELF;
        return { user: p, count: a?.count ?? 0, byCriterion: ok ? a!.byCriterion : {}, overall: ok ? a!.overall : null, comments: ok ? a!.comments : [], submitted: valid.filter((x) => x.reviewerId === p.id).length, expected: Math.max(0, people.length - 1) };
      }),
    };
  });
}

