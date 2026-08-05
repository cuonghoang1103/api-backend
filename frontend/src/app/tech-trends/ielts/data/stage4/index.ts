/** Gom nội dung chặng 4 (band 6.5 → 7.5), cùng hình dạng với ba chặng trước. */
export { UNITS4 } from './lessons';
export {
  VOCAB4, EXERCISES4, READINGS4, LISTENINGS4, LISTENING_SOURCES4,
  WRITINGS4, SPEAKINGS4, SPEAKING_RULES4,
} from './content';

import type { Exercise as ExerciseType } from '../types';
import { UNITS4 } from './lessons';
import {
  VOCAB4, EXERCISES4, READINGS4, LISTENINGS4, LISTENING_SOURCES4, WRITINGS4, SPEAKINGS4,
} from './content';

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
