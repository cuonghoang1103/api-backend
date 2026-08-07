/**
 * Số liệu THẬT cho trang /about.
 *
 * ⚠️ VÌ SAO CÓ FILE NÀY: trang /about là bản sao trang chủ CŨ bị bỏ quên, và mọi
 * con số trên đó đều gõ cứng — "Supabase DB 14ms" (dự án không dùng Supabase),
 * "AI Tokens Today 4.2M", "Uptime 99.97%", "SonarQube A+ / Maintainability 99%"
 * (không có SonarQube nào trong repo), "50+ khách hàng". Một trang giới thiệu
 * bản thân mà số liệu bịa thì hỏng đúng thứ nó định xây: lòng tin.
 *
 * Cùng luật với `landingStats.service.ts` — xem file đó trước khi sửa file này:
 * đừng thêm số nào không đếm được từ DB.
 */
import { prisma } from '../config/database.js';

/**
 * `null` = KHÔNG đếm được (bảng thiếu, DB lệch schema, truy vấn lỗi).
 * Client phải BỎ QUA ô đó, tuyệt đối không thay bằng 0 — "0 bài tập" là một lời
 * nói dối, còn không hiện gì thì chỉ là thiếu.
 */
export interface AboutStats {
  /** Nội dung học đã soạn. */
  exercises: number | null;
  examQuestions: number | null;
  lessons: number | null;
  courses: number | null;
  roadmapNodes: number | null;
  vocabWords: number | null;
  hanziChars: number | null;
  interviewQuestions: number | null;
  /** Những thứ khác đã dựng trên nền tảng. */
  curatedRepos: number | null;
  publishedPosts: number | null;
  games: number | null;
  makerProjects: number | null;
  /** Mốc thời gian tính, để client biết số cũ tới đâu. */
  computedAt: string;
}

// 12 phép đếm là 12 lần quét chỉ mục — rẻ, nhưng vẫn không đáng chạy mỗi lượt
// xem trang. Số này đổi theo ngày chứ không theo giây.
const TTL_MS = 10 * 60 * 1000;
let cache: { at: number; data: AboutStats } | null = null;

export async function getAboutStats(): Promise<AboutStats> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  // allSettled chứ KHÔNG all: một phép đếm hỏng (bảng thiếu do DB lệch schema —
  // đúng tình trạng máy dev hiện tại) mà làm sập cả endpoint thì trang about
  // mất trắng phần số liệu. Hỏng cái nào trả null cái đó.
  const results = await Promise.allSettled([
    prisma.codeExercise.count(),
    prisma.examQuestion.count(),
    prisma.lesson.count(),
    prisma.course.count(),
    prisma.roadmapNode.count(),
    prisma.langVocabWord.count(),
    prisma.langHanziChar.count(),
    prisma.interviewQuestion.count(),
    prisma.githubRepo.count(),
    // Chỉ bài ĐÃ ĐĂNG. Đếm cả bản nháp là thổi phồng.
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.game.count(),
    prisma.makerProject.count(),
  ]);

  const n = (i: number): number | null =>
    results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<number>).value : null;

  const data: AboutStats = {
    exercises: n(0),
    examQuestions: n(1),
    lessons: n(2),
    courses: n(3),
    roadmapNodes: n(4),
    vocabWords: n(5),
    hanziChars: n(6),
    interviewQuestions: n(7),
    curatedRepos: n(8),
    publishedPosts: n(9),
    games: n(10),
    makerProjects: n(11),
    computedAt: new Date().toISOString(),
  };

  // Đếm hỏng thì KHÔNG nhớ tạm 10 phút — nếu không, một trục trặc thoáng qua của
  // DB sẽ đóng băng trang ở trạng thái thiếu số suốt 10 phút.
  if (results.some((r) => r.status === 'rejected')) return data;

  cache = { at: Date.now(), data };
  return data;
}
