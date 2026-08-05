/**
 * Gom nội dung chặng 3 (band 5.5 → 6.5), cùng hình dạng với stage1 và stage2.
 *
 * Nội dung nằm ở HAI file: `content.ts` (đợt đầu) và `content-b.ts` (đợt bổ
 * sung). File này gộp chúng lại nên `bundles.ts` và mọi view không cần biết
 * có bao nhiêu file — chúng chỉ thấy một mảng `READINGS3` duy nhất.
 * Thứ tự gộp là đợt đầu trước, bổ sung sau, để id bài cũ giữ nguyên vị trí
 * (người học đang làm dở bài nào thì vẫn thấy nó ở đúng chỗ đó).
 */
export { UNITS3 } from './lessons';
export { VOCAB3 } from './vocab';
export { EXERCISES3 } from './exercises';
export { LISTENING_SOURCES3, SPEAKING_RULES3 } from './content';

import type { Exercise as ExerciseType } from '../types';
import { UNITS3 } from './lessons';
import { VOCAB3 } from './vocab';
import { EXERCISES3 } from './exercises';
import {
  READINGS3 as READINGS3_A, LISTENINGS3 as LISTENINGS3_A, LISTENING_SOURCES3,
  WRITINGS3 as WRITINGS3_A, SPEAKINGS3 as SPEAKINGS3_A,
} from './content';
import {
  READINGS3B, LISTENINGS3B, WRITINGS3B, SPEAKINGS3B,
} from './content-b';

export const READINGS3 = [...READINGS3_A, ...READINGS3B];
export const LISTENINGS3 = [...LISTENINGS3_A, ...LISTENINGS3B];
export const WRITINGS3 = [...WRITINGS3_A, ...WRITINGS3B];
export const SPEAKINGS3 = [...SPEAKINGS3_A, ...SPEAKINGS3B];

export const VOCAB3_TOPICS = VOCAB3;
export const ALL_WORDS3 = VOCAB3.flatMap((t) => t.words);
export const ALL_LESSONS3 = UNITS3.flatMap((u) => u.lessons);

export const EXERCISES3_BY_LESSON: Record<string, ExerciseType[]> = Object.fromEntries(
  EXERCISES3.map((s) => [s.lessonId, s.items]),
);
export const ALL_EXERCISES3 = EXERCISES3.flatMap((s) => s.items);

export const STAGE3_STATS = {
  lessons: ALL_LESSONS3.length,
  units: UNITS3.length,
  words: ALL_WORDS3.length,
  topics: VOCAB3.length,
  readings: READINGS3.length,
  readingQuestions: READINGS3.reduce((s, r) => s + r.questions.length, 0),
  listenings: LISTENINGS3.length,
  listeningQuestions: LISTENINGS3.reduce((s, l) => s + l.questions.length, 0),
  sources: LISTENING_SOURCES3.length,
  writings: WRITINGS3.length,
  speakingTopics: SPEAKINGS3.length,
  speakingQuestions: SPEAKINGS3.reduce((s, t) => s + t.questions.length, 0),
  grammarPoints: ALL_LESSONS3.reduce((s, l) => s + l.blocks.length, 0),
  exercises: ALL_EXERCISES3.length,
  gradedTotal:
    READINGS3.reduce((s, r) => s + r.questions.length, 0)
    + LISTENINGS3.reduce((s, l) => s + l.questions.length, 0)
    + ALL_EXERCISES3.length,
};
