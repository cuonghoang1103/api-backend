/**
 * My Language — Achievements (compute-only, no new table).
 *
 * Derives an XP level and a set of milestone badges PURELY from data already
 * stored by the Practice engine (LangGameState + LangLessonProgress). Nothing is
 * persisted here — badges are recomputed on read, so this is fully additive and
 * needs no migration.
 */
import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { levelFromXp, type LevelInfo } from './myLanguage.practice.service.js';

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;       // lucide icon name (frontend maps it)
  earned: boolean;
  progress: number;   // 0..1 toward earning (1 when earned)
  goal: number;       // human-readable target (for "x / goal")
  current: number;    // current value toward the goal
}
export interface AchievementsResult {
  level: LevelInfo & { xp: number };
  totals: { lessonsPlayed: number; lessonsPassed: number; goldCrowns: number; longestStreak: number; xp: number };
  badges: Badge[];
  earnedCount: number;
}

function badge(
  id: string, label: string, description: string, icon: string,
  current: number, goal: number,
): Badge {
  const earned = current >= goal;
  return { id, label, description, icon, earned, current, goal, progress: goal > 0 ? Math.min(1, current / goal) : (earned ? 1 : 0) };
}

async function findLanguage(code: string) {
  const language = await prisma.language.findUnique({ where: { code: String(code || '').trim() }, select: { id: true } });
  if (!language) throw new NotFoundError('Không tìm thấy ngôn ngữ.');
  return language;
}

/** Level + milestone badges for one user in one language. */
export async function getAchievements(userId: number, code: string): Promise<AchievementsResult> {
  const language = await findLanguage(code);

  const state = await prisma.langGameState.findUnique({
    where: { userId_languageId: { userId, languageId: language.id } },
    select: { xp: true, longestStreak: true },
  });
  const xp = state?.xp ?? 0;
  const longestStreak = state?.longestStreak ?? 0;

  const lessons = await prisma.langLessonProgress.findMany({
    where: { userId, languageId: language.id },
    select: { crown: true, timesCompleted: true },
  });
  const lessonsPlayed = lessons.reduce((s, l) => s + (l.timesCompleted ?? 0), 0);
  const lessonsPassed = lessons.filter((l) => l.crown > 0).length;
  const goldCrowns = lessons.filter((l) => l.crown >= 5).length;

  const badges: Badge[] = [
    badge('first-lesson', 'Bước đầu tiên', 'Hoàn thành bài học đầu tiên', 'Sparkles', lessonsPlayed, 1),
    badge('ten-lessons', 'Chăm chỉ', 'Vượt qua 10 bài học', 'BookOpenCheck', lessonsPassed, 10),
    badge('streak-3', 'Nhen nhóm', 'Chuỗi 3 ngày liên tiếp', 'Flame', longestStreak, 3),
    badge('streak-7', 'Bền bỉ', 'Chuỗi 7 ngày liên tiếp', 'Flame', longestStreak, 7),
    badge('streak-30', 'Kiên định', 'Chuỗi 30 ngày liên tiếp', 'Flame', longestStreak, 30),
    badge('xp-1000', 'Nghìn XP', 'Tích lũy 1.000 XP', 'Zap', xp, 1000),
    badge('xp-5000', 'Năm nghìn XP', 'Tích lũy 5.000 XP', 'Zap', xp, 5000),
    badge('xp-10000', 'Vạn XP', 'Tích lũy 10.000 XP', 'Zap', xp, 10000),
    badge('gold-1', 'Vương miện vàng', 'Đạt vương miện vàng (cấp 5) đầu tiên', 'Crown', goldCrowns, 1),
    badge('gold-5', 'Nhà sưu tầm', 'Sở hữu 5 vương miện vàng', 'Crown', goldCrowns, 5),
  ];

  return {
    level: { ...levelFromXp(xp), xp },
    totals: { lessonsPlayed, lessonsPassed, goldCrowns, longestStreak, xp },
    badges,
    earnedCount: badges.filter((b) => b.earned).length,
  };
}
