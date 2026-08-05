/** Gom nội dung chặng 3 (band 5.5 → 6.5), cùng hình dạng với stage1 và stage2. */
export { UNITS3 } from './lessons';
export { VOCAB3 } from './vocab';
export { EXERCISES3 } from './exercises';
export {
  READINGS3, LISTENINGS3, LISTENING_SOURCES3, WRITINGS3, SPEAKINGS3, SPEAKING_RULES3,
} from './content';

import type { Exercise as ExerciseType } from '../types';
import { UNITS3 } from './lessons';
import { VOCAB3 } from './vocab';
import { EXERCISES3 } from './exercises';
import { READINGS3, LISTENINGS3, LISTENING_SOURCES3, WRITINGS3, SPEAKINGS3 } from './content';

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
