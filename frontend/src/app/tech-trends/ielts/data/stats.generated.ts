/**
 * SINH TỰ ĐỘNG — ĐỪNG SỬA TAY.
 *
 * Dựng lại bằng:  npm run ielts:stats
 * Nguồn:          scripts/gen-ielts-stats.mts
 *
 * File này tồn tại để `IeltsClient` và `RoadmapTab` hiện được số đếm ngay khi
 * trang mở mà không phải nạp 1,23 MB nội dung năm chặng. Nguồn sự thật vẫn là
 * dữ liệu trong `data/stageN/`; đây chỉ là ảnh chụp của nó.
 *
 * Sửa nội dung một chặng mà quên chạy lại script: `loadStage()` sẽ so số sinh
 * với số thật lúc nạp chặng đó và kêu `console.error` ở dev.
 */
import type { StageId, StageStats } from './stage-meta';

export const STAGE_STATS: Record<StageId, StageStats> = {
  "stage1": {
    "lessons": 40,
    "units": 8,
    "words": 300,
    "topics": 10,
    "readings": 5,
    "readingQuestions": 50,
    "listenings": 6,
    "listeningQuestions": 48,
    "sources": 8,
    "writings": 6,
    "speakingTopics": 5,
    "speakingQuestions": 15,
    "grammarPoints": 46,
    "exercises": 200,
    "gradedTotal": 342
  },
  "stage2": {
    "lessons": 20,
    "units": 4,
    "words": 300,
    "topics": 6,
    "readings": 3,
    "readingQuestions": 30,
    "listenings": 4,
    "listeningQuestions": 32,
    "sources": 4,
    "writings": 4,
    "speakingTopics": 4,
    "speakingQuestions": 8,
    "grammarPoints": 22,
    "exercises": 100,
    "gradedTotal": 162
  },
  "stage3": {
    "lessons": 20,
    "units": 4,
    "words": 80,
    "topics": 4,
    "readings": 3,
    "readingQuestions": 30,
    "listenings": 4,
    "listeningQuestions": 35,
    "sources": 3,
    "writings": 4,
    "speakingTopics": 3,
    "speakingQuestions": 6,
    "grammarPoints": 20,
    "exercises": 100,
    "gradedTotal": 165
  },
  "stage4": {
    "lessons": 15,
    "units": 3,
    "words": 30,
    "topics": 3,
    "readings": 3,
    "readingQuestions": 30,
    "listenings": 4,
    "listeningQuestions": 36,
    "sources": 2,
    "writings": 4,
    "speakingTopics": 3,
    "speakingQuestions": 6,
    "grammarPoints": 15,
    "exercises": 75,
    "gradedTotal": 141
  },
  "stage5": {
    "lessons": 12,
    "units": 3,
    "words": 30,
    "topics": 3,
    "readings": 1,
    "readingQuestions": 10,
    "listenings": 1,
    "listeningQuestions": 9,
    "sources": 2,
    "writings": 2,
    "speakingTopics": 1,
    "speakingQuestions": 3,
    "grammarPoints": 16,
    "exercises": 60,
    "gradedTotal": 79
  }
};

/** Số dạng câu hỏi của từng chặng (chỉ chặng 2 có cẩm nang này). */
export const STAGE_QUESTION_TYPES: Record<StageId, number> = {
  "stage1": 0,
  "stage2": 15,
  "stage3": 0,
  "stage4": 0,
  "stage5": 0
};

/** Số đoạn luyện gõ của từng chặng (chặng chưa có đoạn riêng thì lấy tổng). */
export const TYPING_COUNTS: Record<StageId, number> = {
  "stage1": 4,
  "stage2": 4,
  "stage3": 4,
  "stage4": 4,
  "stage5": 4
};

/** Số gộp cả năm chặng — hiện ở đầu trang. */
export const TOTAL_STATS = {
  "lessons": 107,
  "words": 740,
  "readings": 15,
  "listenings": 19,
  "writings": 20,
  "graded": 889,
  "exercises": 535,
  "questionTypes": 15
};
