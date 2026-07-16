/**
 * My Language — Practice (Duolingo-style) service.
 *
 * Server-authoritative GAME STATE (XP / streak / daily + weekly goal / hearts /
 * per-lesson crowns + reminder pref). Exercises are generated client-side from
 * the existing vocab content, so there is no new content engine here. A "lesson"
 * maps 1:1 to a vocab category (`lessonKey` = "vocab:<id>").
 *
 * Lessons are grouped into UNITS that follow the Roadmap: a roadmap node with
 * linkType 'vocab' and linkRef = a category id binds that category to the node's
 * stage. Unbound categories fall into a trailing unit; if nothing is bound the
 * path is a single unit (graceful fallback). Fully additive.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { recordProgress } from './myLanguage.service.js';

const MAX_HEARTS = 5;
const HEART_REGEN_MS = 60 * 60 * 1000; // 1 heart / hour
const TZ_OFFSET_MS = 7 * 60 * 60 * 1000; // Asia/Ho_Chi_Minh — day/week boundary
const MIN_WORDS_PER_LESSON = 4;

function dayStr(d: Date): string {
  return new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10);
}
/** Monday-based week key (the local Monday's date) for the weekly leaderboard. */
function weekStr(d: Date): string {
  const local = new Date(d.getTime() + TZ_OFFSET_MS);
  const dow = (local.getUTCDay() + 6) % 7; // 0 = Monday
  local.setUTCDate(local.getUTCDate() - dow);
  return local.toISOString().slice(0, 10);
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// ─── XP → level curve ────────────────────────────────────────────
// Cumulative XP to *reach* level L is 50·(L-1)·L, so advancing FROM level L
// costs 100·L XP (L1→L2 = 100, L2→L3 = 200, …). Gentle early, steady later.
function xpToReachLevel(level: number): number {
  return 50 * (level - 1) * level;
}
export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForLevel: number; // XP needed to finish the current level
}
export function levelFromXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.trunc(xp));
  let level = 1;
  while (xpToReachLevel(level + 1) <= safe) level++;
  return {
    level,
    xpIntoLevel: safe - xpToReachLevel(level),
    xpForLevel: xpToReachLevel(level + 1) - xpToReachLevel(level), // = 100·level
  };
}

export interface PracticeLesson {
  lessonKey: string;
  categoryId: number;
  name: string;
  icon: string | null;
  wordCount: number;
  crown: number;
  bestScore: number;
  locked: boolean;
}
export interface PracticeUnit {
  key: string;
  label: string;
  lessons: PracticeLesson[];
}
export interface PracticeState {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForLevel: number;
  streak: number;
  longestStreak: number;
  dailyGoalXp: number;
  dailyXp: number;
  weeklyXp: number;
  hearts: number;
  maxHearts: number;
  heartsFullInMin: number;
  reminderEnabled: boolean;
  reminderHour: number;
}
export interface PracticeOverview {
  language: { id: number; code: string; name: string; nameEn: string; flagEmoji: string };
  state: PracticeState;
  units: PracticeUnit[];
}

type GameStateRow = {
  hearts: number; heartsUpdatedAt: Date; dailyXp: number; dailyXpDate: string | null;
  weeklyXp: number; weekKey: string | null;
  xp: number; streak: number; longestStreak: number; dailyGoalXp: number;
  lastPracticeDate: Date | null; reminderEnabled: boolean; reminderHour: number;
};

function regen(hearts: number, updatedAt: Date, now: Date): { hearts: number; heartsUpdatedAt: Date } {
  if (hearts >= MAX_HEARTS) return { hearts: MAX_HEARTS, heartsUpdatedAt: now };
  const gained = Math.floor((now.getTime() - updatedAt.getTime()) / HEART_REGEN_MS);
  if (gained <= 0) return { hearts, heartsUpdatedAt: updatedAt };
  const next = Math.min(MAX_HEARTS, hearts + gained);
  const heartsUpdatedAt = next >= MAX_HEARTS ? now : new Date(updatedAt.getTime() + gained * HEART_REGEN_MS);
  return { hearts: next, heartsUpdatedAt };
}
function heartsFullInMin(hearts: number, updatedAt: Date, now: Date): number {
  if (hearts >= MAX_HEARTS) return 0;
  const remaining = HEART_REGEN_MS - ((now.getTime() - updatedAt.getTime()) % HEART_REGEN_MS);
  return Math.max(0, Math.ceil(remaining / 60000));
}

async function findLanguage(code: string) {
  const language = await prisma.language.findUnique({
    where: { code: String(code || '').trim() },
    select: { id: true, code: true, name: true, nameEn: true, flagEmoji: true },
  });
  if (!language) throw new NotFoundError('Không tìm thấy ngôn ngữ.');
  return language;
}

/** Get (or lazily create) the user's game state, applying heart regen + daily/weekly reset. */
async function loadState(userId: number, languageId: number, now: Date): Promise<GameStateRow> {
  const existing = await prisma.langGameState.findUnique({ where: { userId_languageId: { userId, languageId } } });
  const base = existing ?? await prisma.langGameState.create({ data: { userId, languageId } });

  const r = regen(base.hearts, base.heartsUpdatedAt, now);
  const today = dayStr(now);
  const week = weekStr(now);
  const dailyXp = base.dailyXpDate === today ? base.dailyXp : 0;
  const weeklyXp = base.weekKey === week ? base.weeklyXp : 0;

  const changed =
    r.hearts !== base.hearts ||
    r.heartsUpdatedAt.getTime() !== base.heartsUpdatedAt.getTime() ||
    base.dailyXpDate !== today ||
    base.weekKey !== week;
  if (changed) {
    return prisma.langGameState.update({
      where: { id: base.id },
      data: { hearts: r.hearts, heartsUpdatedAt: r.heartsUpdatedAt, dailyXp, dailyXpDate: today, weeklyXp, weekKey: week },
    });
  }
  return base;
}

function toState(s: GameStateRow, now: Date): PracticeState {
  const lvl = levelFromXp(s.xp);
  return {
    xp: s.xp,
    level: lvl.level,
    xpIntoLevel: lvl.xpIntoLevel,
    xpForLevel: lvl.xpForLevel,
    streak: s.streak,
    longestStreak: s.longestStreak,
    dailyGoalXp: s.dailyGoalXp,
    dailyXp: s.dailyXpDate === dayStr(now) ? s.dailyXp : 0,
    weeklyXp: s.weekKey === weekStr(now) ? s.weeklyXp : 0,
    hearts: s.hearts,
    maxHearts: MAX_HEARTS,
    heartsFullInMin: heartsFullInMin(s.hearts, s.heartsUpdatedAt, now),
    reminderEnabled: s.reminderEnabled,
    reminderHour: s.reminderHour,
  };
}

type Cat = { id: number; name: string; icon: string | null; _count: { words: number } };

/** The practice path: game state + lessons grouped into roadmap-aligned units. */
export async function getOverview(userId: number, code: string): Promise<PracticeOverview> {
  const now = new Date();
  const language = await findLanguage(code);
  const state = await loadState(userId, language.id, now);

  const cats = await prisma.langVocabCategory.findMany({
    where: { languageId: language.id },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { words: true } } },
  });
  const eligible: Cat[] = cats.filter((c) => c._count.words >= MIN_WORDS_PER_LESSON);

  const progress = await prisma.langLessonProgress.findMany({
    where: { userId, languageId: language.id },
    select: { lessonKey: true, crown: true, bestScore: true },
  });
  const byKey = new Map(progress.map((p) => [p.lessonKey, p]));

  const makeLesson = (c: Cat): PracticeLesson => {
    const lessonKey = `vocab:${c.id}`;
    const p = byKey.get(lessonKey);
    return {
      lessonKey, categoryId: c.id, name: c.name, icon: c.icon, wordCount: c._count.words,
      crown: p?.crown ?? 0, bestScore: p?.bestScore ?? 0, locked: false,
    };
  };

  // Roadmap binding: vocab nodes whose linkRef is a category id bind that
  // category to the node's stage (first node wins).
  const nodes = await prisma.langRoadmapNode.findMany({
    where: { languageId: language.id, linkType: 'vocab' },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    select: { stage: true, stageLabel: true, order: true, linkRef: true },
  });
  const catStage = new Map<number, { stage: number; nodeOrder: number }>();
  const stageOrder: Array<{ stage: number; label: string }> = [];
  for (const n of nodes) {
    const cid = Number(n.linkRef);
    if (!Number.isInteger(cid) || cid <= 0) continue;
    if (!catStage.has(cid)) catStage.set(cid, { stage: n.stage, nodeOrder: n.order });
    if (!stageOrder.some((s) => s.stage === n.stage)) stageOrder.push({ stage: n.stage, label: n.stageLabel });
  }

  const units: PracticeUnit[] = [];
  if (catStage.size > 0) {
    for (const s of stageOrder) {
      const lessons = eligible
        .filter((c) => catStage.get(c.id)?.stage === s.stage)
        .sort((a, b) => (catStage.get(a.id)!.nodeOrder - catStage.get(b.id)!.nodeOrder))
        .map(makeLesson);
      if (lessons.length) units.push({ key: `stage-${s.stage}`, label: s.label, lessons });
    }
    const leftover = eligible.filter((c) => !catStage.has(c.id)).map(makeLesson);
    if (leftover.length) units.push({ key: 'other', label: 'Từ vựng khác', lessons: leftover });
  } else {
    units.push({ key: 'all', label: 'Bài học', lessons: eligible.map(makeLesson) });
  }

  // Linear unlock across the flattened lesson order (crown ≥ 1 opens the next).
  let prevCrown = 1;
  for (const u of units) {
    for (const l of u.lessons) {
      l.locked = prevCrown < 1;
      prevCrown = l.crown;
    }
  }

  return { language, state: toState(state, now), units };
}

export interface CompleteResult {
  xpGained: number;
  crown: number;
  leveledUp: boolean;
  state: PracticeState;
}

/** Record a finished lesson: award XP, update streak/daily+weekly goal, hearts, crown. */
/** Feed the lesson's per-word outcomes into the shared SRS review queue so a
 *  "Review mistakes" flow can resurface them. Best-effort — never blocks the
 *  completion if the SRS write fails. Wrong items get a low SM-2 quality (due
 *  soon), correct items a high one (pushed further out). */
async function recordSrsOutcomes(userId: number, categoryId: number, wrongIds: number[], rightIds: number[]): Promise<void> {
  const ids = [...new Set([...wrongIds, ...rightIds])].filter((n) => Number.isInteger(n) && n > 0).slice(0, 60);
  if (!ids.length) return;
  // Only accept ids that actually belong to this lesson's category (trust guard).
  const owned = await prisma.langVocabWord.findMany({ where: { id: { in: ids }, categoryId }, select: { id: true } });
  const validWrong = new Set(wrongIds);
  for (const w of owned) {
    const quality = validWrong.has(w.id) ? 2 : 4;
    try {
      await recordProgress(userId, { itemType: 'VOCAB', itemId: w.id, quality });
    } catch { /* one bad SRS write must not fail the lesson */ }
  }
}

export async function completeLesson(
  userId: number,
  code: string,
  body: {
    lessonKey?: string; correct?: number | string; total?: number | string; mistakes?: number | string;
    wrongIds?: unknown; rightIds?: unknown;
  },
): Promise<CompleteResult> {
  const now = new Date();
  const language = await findLanguage(code);

  const lessonKey = String(body?.lessonKey ?? '').trim();
  const m = lessonKey.match(/^vocab:(\d+)$/);
  if (!m) throw new BadRequestError('lessonKey không hợp lệ.');
  const categoryId = Number(m[1]);
  const category = await prisma.langVocabCategory.findFirst({ where: { id: categoryId, languageId: language.id }, select: { id: true } });
  if (!category) throw new NotFoundError('Không tìm thấy bài học.');

  const total = clamp(Math.trunc(Number(body?.total) || 0), 0, 100);
  const correct = clamp(Math.trunc(Number(body?.correct) || 0), 0, total);
  const mistakes = clamp(Math.trunc(Number(body?.mistakes) || 0), 0, 100);
  if (total <= 0) throw new BadRequestError('Bài học rỗng.');

  const scorePct = Math.round((correct / total) * 100);
  const xpGained = correct * 10 + (mistakes === 0 ? 5 : 0);
  const today = dayStr(now);
  const week = weekStr(now);

  const s = await loadState(userId, language.id, now);

  // Streak.
  const lastS = s.lastPracticeDate ? dayStr(s.lastPracticeDate) : null;
  let streak = s.streak;
  if (lastS !== today) {
    const yesterday = dayStr(new Date(now.getTime() - 86_400_000));
    streak = lastS === yesterday ? s.streak + 1 : 1;
  }
  const longestStreak = Math.max(s.longestStreak, streak);

  // Daily + weekly XP (already reset in loadState on rollover).
  const dailyXp = (s.dailyXpDate === today ? s.dailyXp : 0) + xpGained;
  const weeklyXp = (s.weekKey === week ? s.weeklyXp : 0) + xpGained;

  // Hearts: lose one per mistake; restart the regen clock only if we dropped.
  const heartsAfter = clamp(s.hearts - mistakes, 0, MAX_HEARTS);
  const heartsUpdatedAt = mistakes > 0 ? now : undefined;

  const updated = await prisma.langGameState.update({
    where: { userId_languageId: { userId, languageId: language.id } },
    data: {
      xp: s.xp + xpGained,
      streak,
      longestStreak,
      lastPracticeDate: now,
      dailyXp,
      dailyXpDate: today,
      weeklyXp,
      weekKey: week,
      hearts: heartsAfter,
      ...(heartsUpdatedAt ? { heartsUpdatedAt } : {}),
    },
  });

  // Crown: passing (≥60%) raises the crown by one, up to 5.
  const existingLesson = await prisma.langLessonProgress.findUnique({ where: { userId_lessonKey: { userId, lessonKey } } });
  const pass = scorePct >= 60;
  const prevCrown = existingLesson?.crown ?? 0;
  const crown = pass && prevCrown < 5 ? prevCrown + 1 : prevCrown;
  const leveledUp = crown > prevCrown;
  const bestScore = Math.max(existingLesson?.bestScore ?? 0, scorePct);

  if (existingLesson) {
    await prisma.langLessonProgress.update({
      where: { id: existingLesson.id },
      data: { crown, bestScore, timesCompleted: { increment: 1 }, lastCompletedAt: now },
    });
  } else {
    await prisma.langLessonProgress.create({
      data: { userId, languageId: language.id, lessonKey, crown, bestScore, timesCompleted: 1, lastCompletedAt: now },
    });
  }

  // Feed per-word outcomes into the SRS review queue (best-effort, additive).
  const toIdArray = (v: unknown): number[] =>
    Array.isArray(v) ? v.map((x) => Math.trunc(Number(x))).filter((n) => Number.isInteger(n) && n > 0) : [];
  await recordSrsOutcomes(userId, categoryId, toIdArray(body?.wrongIds), toIdArray(body?.rightIds));

  return { xpGained, crown, leveledUp, state: toState(updated, now) };
}

/** Update the daily-reminder preference. */
export async function updateReminder(
  userId: number,
  code: string,
  body: { enabled?: boolean; hour?: number | string },
): Promise<PracticeState> {
  const now = new Date();
  const language = await findLanguage(code);
  await loadState(userId, language.id, now); // ensure a row exists
  const hour = clamp(Math.trunc(Number(body?.hour)), 0, 23);
  const updated = await prisma.langGameState.update({
    where: { userId_languageId: { userId, languageId: language.id } },
    data: {
      reminderEnabled: !!body?.enabled,
      ...(Number.isFinite(Number(body?.hour)) ? { reminderHour: hour } : {}),
    },
  });
  return toState(updated, now);
}

// ─── Weekly leaderboard ──────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  avatarUrl: string | null;
  weeklyXp: number;
  isMe: boolean;
}
export interface Leaderboard {
  week: string;
  entries: LeaderboardEntry[];
  me: LeaderboardEntry | null;
}

/** Top learners by XP earned this week for a language, plus the viewer's rank. */
export async function getLeaderboard(userId: number, code: string): Promise<Leaderboard> {
  const now = new Date();
  const week = weekStr(now);
  const language = await findLanguage(code);

  const rows = await prisma.langGameState.findMany({
    where: { languageId: language.id, weekKey: week, weeklyXp: { gt: 0 } },
    orderBy: [{ weeklyXp: 'desc' }, { updatedAt: 'asc' }],
    take: 50,
    select: {
      userId: true, weeklyXp: true,
      user: { select: { username: true, fullName: true, displayName: true, avatarUrl: true } },
    },
  });

  const entries: LeaderboardEntry[] = rows.map((r, i) => ({
    rank: i + 1,
    userId: r.userId,
    name: r.user.displayName || r.user.fullName || r.user.username,
    avatarUrl: r.user.avatarUrl,
    weeklyXp: r.weeklyXp,
    isMe: r.userId === userId,
  }));

  let me = entries.find((e) => e.isMe) ?? null;
  if (!me) {
    const mine = await prisma.langGameState.findUnique({
      where: { userId_languageId: { userId, languageId: language.id } },
      select: { weeklyXp: true, weekKey: true, user: { select: { username: true, fullName: true, displayName: true, avatarUrl: true } } },
    });
    const myXp = mine && mine.weekKey === week ? mine.weeklyXp : 0;
    const rank = myXp > 0
      ? (await prisma.langGameState.count({ where: { languageId: language.id, weekKey: week, weeklyXp: { gt: myXp } } })) + 1
      : 0;
    me = {
      rank,
      userId,
      name: mine ? mine.user.displayName || mine.user.fullName || mine.user.username : 'Bạn',
      avatarUrl: mine?.user.avatarUrl ?? null,
      weeklyXp: myXp,
      isMe: true,
    };
  }

  return { week, entries, me };
}
