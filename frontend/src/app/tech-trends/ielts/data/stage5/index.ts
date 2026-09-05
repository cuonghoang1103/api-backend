/**
 * Gom nội dung chặng 5 (band 7.5 → 8.0), cùng hình dạng với bốn chặng trước.
 *
 * Khác với stage3/stage4, ở đây nội dung được tách theo KỸ NĂNG chứ không theo
 * "đợt soạn": `content.ts` giữ Đọc và Nghe, `content-b.ts` giữ Viết và Nói.
 * Lý do rất thực dụng — hai nửa đó được sửa vì những lý do khác nhau (bài đọc
 * đổi khi muốn nâng độ khó; bài mẫu viết đổi khi descriptor được diễn giải lại)
 * nên tách theo kỹ năng thì mỗi lần sửa chỉ đụng một file.
 *
 * `bundles.ts` và mọi view chỉ thấy một mảng cho mỗi kỹ năng, không cần biết
 * nội dung nằm ở file nào.
 */
export { UNITS5 } from './lessons';
export { VOCAB5 } from './vocab';
export { EXERCISES5 } from './exercises';
export { LISTENING_SOURCES5 } from './content';
export { SPEAKING_RULES5 } from './content-b';

import type { Exercise as ExerciseType } from '../types';
import { UNITS5 } from './lessons';
import { VOCAB5 } from './vocab';
import { EXERCISES5 } from './exercises';
import { READINGS5, LISTENINGS5, LISTENING_SOURCES5 } from './content';
import { WRITINGS5, SPEAKINGS5 } from './content-b';

export { READINGS5, LISTENINGS5, WRITINGS5, SPEAKINGS5 };

export const VOCAB5_TOPICS = VOCAB5;
export const ALL_WORDS5 = VOCAB5.flatMap((t) => t.words);
export const ALL_LESSONS5 = UNITS5.flatMap((u) => u.lessons);

export const EXERCISES5_BY_LESSON: Record<string, ExerciseType[]> = Object.fromEntries(
  EXERCISES5.map((s) => [s.lessonId, s.items]),
);
export const ALL_EXERCISES5 = EXERCISES5.flatMap((s) => s.items);

export const STAGE5_STATS = {
  lessons: ALL_LESSONS5.length,
  units: UNITS5.length,
  words: ALL_WORDS5.length,
  topics: VOCAB5.length,
  readings: READINGS5.length,
  readingQuestions: READINGS5.reduce((s, r) => s + r.questions.length, 0),
  listenings: LISTENINGS5.length,
  listeningQuestions: LISTENINGS5.reduce((s, l) => s + l.questions.length, 0),
  sources: LISTENING_SOURCES5.length,
  writings: WRITINGS5.length,
  speakingTopics: SPEAKINGS5.length,
  speakingQuestions: SPEAKINGS5.reduce((s, t) => s + t.questions.length, 0),
  grammarPoints: ALL_LESSONS5.reduce((s, l) => s + l.blocks.length, 0),
  exercises: ALL_EXERCISES5.length,
  gradedTotal:
    READINGS5.reduce((s, r) => s + r.questions.length, 0)
    + LISTENINGS5.reduce((s, l) => s + l.questions.length, 0)
    + ALL_EXERCISES5.length,
};
