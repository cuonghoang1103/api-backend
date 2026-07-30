/**
 * Số liệu thật cho trang chủ.
 *
 * ⚠️ VÌ SAO CÓ FILE NÀY: trang chủ trước đây gõ CỨNG bốn con số ("8k+" câu hỏi
 * phỏng vấn, "4k+" chữ Hán, "12+" module…). Gõ cứng nghĩa là chúng SAI ÂM THẦM
 * ngay khi nội dung tăng — mà nội dung site này tăng liên tục. Đếm thật thì
 * không bao giờ lệch, và cũng không phải nhớ sửa.
 *
 * Đừng thêm số nào vào đây mà không đếm được từ DB. Con số bịa trên trang chủ
 * là thứ người đọc bắt được nhanh nhất.
 */
import { prisma } from '../config/database.js';

/**
 * `null` = KHÔNG đếm được (bảng thiếu, DB lệch schema, truy vấn lỗi).
 * Client phải BỎ QUA ô đó, tuyệt đối không thay bằng 0 — "0 bài tập" là một
 * lời nói dối, còn không hiện gì thì chỉ là thiếu.
 */
export interface LandingStats {
  exercises: number | null;
  tracks: number | null;
  modules: number | null;
  subjects: number | null;
  roadmapNodes: number | null;
  examQuestions: number | null;
  vocabWords: number | null;
  hanziChars: number | null;
  /** Mốc thời gian tính, để client biết số cũ tới đâu. */
  computedAt: string;
}

// Đếm 8 bảng là 8 lần quét chỉ mục — rẻ, nhưng trang chủ là trang bị gọi nhiều
// nhất nên vẫn không đáng làm mỗi lượt. Số này đổi theo ngày chứ không theo
// giây, nên nhớ tạm 10 phút là quá đủ.
const TTL_MS = 10 * 60 * 1000;
let cache: { at: number; data: LandingStats } | null = null;

export async function getLandingStats(): Promise<LandingStats> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  // allSettled chứ KHÔNG all: một phép đếm hỏng (bảng thiếu do DB lệch schema,
  // đúng tình trạng máy dev hiện tại) mà làm sập cả endpoint thì trang chủ mất
  // trắng phần số liệu. Hỏng cái nào trả null cái đó, client bỏ qua ô đó.
  const results = await Promise.allSettled([
    prisma.codeExercise.count(),
    prisma.codeTrack.count(),
    prisma.codeModule.count(),
    prisma.course.count(),
    prisma.roadmapNode.count(),
    prisma.examQuestion.count(),
    prisma.langVocabWord.count(),
    prisma.langHanziChar.count(),
  ]);

  const n = (i: number): number | null =>
    results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<number>).value : null;

  const data: LandingStats = {
    exercises: n(0),
    tracks: n(1),
    modules: n(2),
    subjects: n(3),
    roadmapNodes: n(4),
    examQuestions: n(5),
    vocabWords: n(6),
    hanziChars: n(7),
    computedAt: new Date().toISOString(),
  };

  // Đếm hỏng thì KHÔNG nhớ tạm 10 phút — nếu không, một trục trặc thoáng qua
  // của DB sẽ đóng băng trang chủ ở trạng thái thiếu số suốt 10 phút.
  if (results.some((r) => r.status === 'rejected')) return data;

  cache = { at: Date.now(), data };
  return data;
}
