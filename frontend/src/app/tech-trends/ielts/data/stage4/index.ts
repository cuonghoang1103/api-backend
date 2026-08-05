/**
 * Gom nội dung chặng 4 (band 6.5 → 7.5), cùng hình dạng với ba chặng trước.
 *
 * Như chặng 3, nội dung nằm ở hai file: `content.ts` (đợt đầu, gồm cả từ vựng
 * và bài tập) và `content-b.ts` (đợt bổ sung: đọc, nghe, viết, nói). File này
 * gộp lại để bundle chỉ thấy một mảng cho mỗi kỹ năng.
 */
export { UNITS4 } from './lessons';
export {
  VOCAB4, EXERCISES4, LISTENING_SOURCES4, SPEAKING_RULES4,
} from './content';

import type { Exercise as ExerciseType } from '../types';
import { UNITS4 } from './lessons';
import {
  VOCAB4, EXERCISES4, LISTENING_SOURCES4,
  READINGS4 as READINGS4_A, LISTENINGS4 as LISTENINGS4_A,
  WRITINGS4 as WRITINGS4_A, SPEAKINGS4 as SPEAKINGS4_A,
} from './content';
import {
  READINGS4B, LISTENINGS4B, WRITINGS4B, SPEAKINGS4B,
} from './content-b';

export const READINGS4 = [...READINGS4_A, ...READINGS4B];
export const LISTENINGS4 = [...LISTENINGS4_A, ...LISTENINGS4B];
export const WRITINGS4 = [...WRITINGS4_A, ...WRITINGS4B];
export const SPEAKINGS4 = [...SPEAKINGS4_A, ...SPEAKINGS4B];

export const ALL_WORDS4 = VOCAB4.flatMap((t) => t.words);
export const ALL_LESSONS4 = UNITS4.flatMap((u) => u.lessons);

export const EXERCISES4_BY_LESSON: Record<string, ExerciseType[]> = Object.fromEntries(
  EXERCISES4.map((s) => [s.lessonId, s.items]),
);
export const ALL_EXERCISES4 = EXERCISES4.flatMap((s) => s.items);

export const STAGE4_STATS = {
  lessons: ALL_LESSONS4.length,
  units: UNITS4.length,
  words: ALL_WORDS4.length,
  topics: VOCAB4.length,
  readings: READINGS4.length,
  readingQuestions: READINGS4.reduce((s, r) => s + r.questions.length, 0),
  listenings: LISTENINGS4.length,
  listeningQuestions: LISTENINGS4.reduce((s, l) => s + l.questions.length, 0),
  sources: LISTENING_SOURCES4.length,
  writings: WRITINGS4.length,
  speakingTopics: SPEAKINGS4.length,
  speakingQuestions: SPEAKINGS4.reduce((s, t) => s + t.questions.length, 0),
  grammarPoints: ALL_LESSONS4.reduce((s, l) => s + l.blocks.length, 0),
  exercises: ALL_EXERCISES4.length,
  gradedTotal:
    READINGS4.reduce((s, r) => s + r.questions.length, 0)
    + LISTENINGS4.reduce((s, l) => s + l.questions.length, 0)
    + ALL_EXERCISES4.length,
};
