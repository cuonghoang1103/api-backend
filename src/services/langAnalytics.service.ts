/**
 * My Language — ADMIN learning analytics (read-only).
 *
 * Per-user aggregation across LangUserProgress (SRS status), LangQuizResult,
 * and LangNotebookEntry so an admin can see each account's learning activity.
 * ADMIN-gated at the route layer. Modeled on the AI-chat usage analytics.
 */
import { prisma } from '../config/database.js';

const ITEM_TYPES = ['VOCAB', 'ALPHABET', 'GRAMMAR', 'LISTENING', 'CONVERSATION', 'READING', 'QNA'] as const;

export async function overview() {
  const now = new Date();
  const [progUsers, quizUsers, nbUsers, mastered, quizzes, notebookEntries, dueCards] = await Promise.all([
    prisma.langUserProgress.findMany({ distinct: ['userId'], select: { userId: true } }),
    prisma.langQuizResult.findMany({ distinct: ['userId'], select: { userId: true } }),
    prisma.langNotebookEntry.findMany({ distinct: ['userId'], select: { userId: true } }),
    prisma.langUserProgress.count({ where: { status: 'MASTERED' } }),
    prisma.langQuizResult.count(),
    prisma.langNotebookEntry.count(),
    prisma.langNotebookEntry.count({ where: { OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: now } }] } }),
  ]);
  const learners = new Set([...progUsers, ...quizUsers, ...nbUsers].map((u) => u.userId));
  return { learners: learners.size, mastered, quizzes, notebookEntries, dueCards };
}

interface Row {
  userId: number;
  mastered: number; reviewing: number; learning: number; newCount: number;
  quizzes: number; quizScore: number; quizTotal: number;
  notebook: number; due: number;
  lastActive: Date | null;
}

export async function perUser(opts: { limit?: number; keyword?: string }) {
  const now = new Date();
  const [progAgg, quizAgg, nbAgg, dueAgg, lastProg, lastQuiz] = await Promise.all([
    prisma.langUserProgress.groupBy({ by: ['userId', 'status'], _count: { _all: true } }),
    prisma.langQuizResult.groupBy({ by: ['userId'], _count: { _all: true }, _sum: { score: true, total: true } }),
    prisma.langNotebookEntry.groupBy({ by: ['userId'], _count: { _all: true } }),
    prisma.langNotebookEntry.groupBy({ by: ['userId'], where: { OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: now } }] }, _count: { _all: true } }),
    prisma.langUserProgress.groupBy({ by: ['userId'], _max: { lastReviewedAt: true } }),
    prisma.langQuizResult.groupBy({ by: ['userId'], _max: { createdAt: true } }),
  ]);

  const m = new Map<number, Row>();
  const ensure = (id: number): Row => {
    let r = m.get(id);
    if (!r) { r = { userId: id, mastered: 0, reviewing: 0, learning: 0, newCount: 0, quizzes: 0, quizScore: 0, quizTotal: 0, notebook: 0, due: 0, lastActive: null }; m.set(id, r); }
    return r;
  };
  const bumpActive = (r: Row, t: Date | null) => { if (t && (!r.lastActive || t > r.lastActive)) r.lastActive = t; };

  for (const g of progAgg) {
    const r = ensure(g.userId);
    if (g.status === 'MASTERED') r.mastered += g._count._all;
    else if (g.status === 'REVIEWING') r.reviewing += g._count._all;
    else if (g.status === 'LEARNING') r.learning += g._count._all;
    else r.newCount += g._count._all;
  }
  for (const g of quizAgg) { const r = ensure(g.userId); r.quizzes = g._count._all; r.quizScore = g._sum.score ?? 0; r.quizTotal = g._sum.total ?? 0; }
  for (const g of nbAgg) ensure(g.userId).notebook = g._count._all;
  for (const g of dueAgg) ensure(g.userId).due = g._count._all;
  for (const g of lastProg) bumpActive(ensure(g.userId), g._max.lastReviewedAt);
  for (const g of lastQuiz) bumpActive(ensure(g.userId), g._max.createdAt);

  const ids = [...m.keys()];
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, username: true, email: true, fullName: true, avatarUrl: true, roles: { include: { role: true } } },
  });
  const uMap = new Map(users.map((u) => [u.id, u]));

  const kw = (opts.keyword ?? '').trim().toLowerCase();
  let rows = ids.map((id) => {
    const r = m.get(id)!;
    const u = uMap.get(id);
    return {
      userId: id,
      username: u?.username ?? `#${id}`,
      email: u?.email ?? '',
      fullName: u?.fullName ?? null,
      avatarUrl: u?.avatarUrl ?? null,
      isAdmin: (u?.roles ?? []).some((ur) => /admin/i.test(ur.role.name)),
      mastered: r.mastered,
      reviewing: r.reviewing,
      learning: r.learning,
      quizzes: r.quizzes,
      quizAvg: r.quizTotal > 0 ? Math.round((r.quizScore / r.quizTotal) * 100) : 0,
      notebook: r.notebook,
      due: r.due,
      lastActive: r.lastActive,
    };
  });
  if (kw) rows = rows.filter((r) => r.username.toLowerCase().includes(kw) || r.email.toLowerCase().includes(kw) || (r.fullName ?? '').toLowerCase().includes(kw));
  rows.sort((a, b) => (b.lastActive?.getTime() ?? 0) - (a.lastActive?.getTime() ?? 0));
  const limit = Math.max(10, Math.min(200, Number(opts.limit) || 100));
  return rows.slice(0, limit);
}

export async function userDetail(userId: number) {
  const [progAgg, quizzes, nbByKind, user] = await Promise.all([
    prisma.langUserProgress.groupBy({ by: ['itemType', 'status'], where: { userId }, _count: { _all: true } }),
    prisma.langQuizResult.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, score: true, total: true, createdAt: true, languageId: true } }),
    prisma.langNotebookEntry.groupBy({ by: ['kind'], where: { userId }, _count: { _all: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, email: true, fullName: true, avatarUrl: true } }),
  ]);
  const perSection: Record<string, { learning: number; reviewing: number; mastered: number; total: number }> = {};
  for (const t of ITEM_TYPES) perSection[t] = { learning: 0, reviewing: 0, mastered: 0, total: 0 };
  for (const g of progAgg) {
    const s = perSection[g.itemType];
    if (!s) continue;
    s.total += g._count._all;
    if (g.status === 'LEARNING') s.learning += g._count._all;
    else if (g.status === 'REVIEWING') s.reviewing += g._count._all;
    else if (g.status === 'MASTERED') s.mastered += g._count._all;
  }
  return { user, perSection, quizzes, notebookByKind: nbByKind.map((g) => ({ kind: g.kind, count: g._count._all })) };
}
