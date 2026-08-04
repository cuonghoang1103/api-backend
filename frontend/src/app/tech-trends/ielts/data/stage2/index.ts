/**
 * Gom nội dung chặng 2 (band 4.0 → 5.5) và tính sẵn các con số.
 *
 * Cùng hình dạng với `stage1/index.ts` để `bundles.ts` ghép được hai chặng vào
 * một kiểu chung. Chặng 3 và 4 sau này chỉ cần lặp lại đúng khuôn này.
 */
export { VOCAB2_A } from './vocab-a';
export { VOCAB2_B } from './vocab-b';
export { UNITS2 } from './lessons';
export { EXERCISES2 } from './exercises';
export { READINGS2 } from './reading';
export { LISTENINGS2, LISTENING_SOURCES2 } from './listening';
export { WRITINGS2 } from './writing';
export { SPEAKINGS2, SPEAKING_RULES2 } from './speaking';
export { QUESTION_TYPES, STRATEGY_NOTES } from './question-types';

import type { Exercise as ExerciseType } from '../types';
import { VOCAB2_A } from './vocab-a';
import { VOCAB2_B } from './vocab-b';
import { UNITS2 } from './lessons';
import { EXERCISES2 } from './exercises';
import { READINGS2 } from './reading';
import { LISTENINGS2, LISTENING_SOURCES2 } from './listening';
import { WRITINGS2 } from './writing';
import { SPEAKINGS2 } from './speaking';
import { QUESTION_TYPES } from './question-types';

export const VOCAB2_TOPICS = [...VOCAB2_A, ...VOCAB2_B];
export const ALL_WORDS2 = VOCAB2_TOPICS.flatMap((t) => t.words);

export const ALL_LESSONS2 = UNITS2.flatMap((u) => u.lessons);

export const EXERCISES2_BY_LESSON: Record<string, ExerciseType[]> = Object.fromEntries(
  EXERCISES2.map((s) => [s.lessonId, s.items]),
);

export const ALL_EXERCISES2 = EXERCISES2.flatMap((s) => s.items);

export const STAGE2_STATS = {
  lessons: ALL_LESSONS2.length,
  units: UNITS2.length,
  words: ALL_WORDS2.length,
  topics: VOCAB2_TOPICS.length,
  readings: READINGS2.length,
  readingQuestions: READINGS2.reduce((s, r) => s + r.questions.length, 0),
  listenings: LISTENINGS2.length,
  listeningQuestions: LISTENINGS2.reduce((s, l) => s + l.questions.length, 0),
  sources: LISTENING_SOURCES2.length,
  writings: WRITINGS2.length,
  speakingTopics: SPEAKINGS2.length,
  speakingQuestions: SPEAKINGS2.reduce((s, t) => s + t.questions.length, 0),
  grammarPoints: ALL_LESSONS2.reduce((s, l) => s + l.blocks.length, 0),
  exercises: ALL_EXERCISES2.length,
  questionTypes: QUESTION_TYPES.length,
  gradedTotal:
    READINGS2.reduce((s, r) => s + r.questions.length, 0)
    + LISTENINGS2.reduce((s, l) => s + l.questions.length, 0)
    + ALL_EXERCISES2.length,
};
