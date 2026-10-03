/** Chặng 3 — một chunk riêng: loadStage.ts nạp nó bằng import() khi người học mở chặng này. */
import type { StageBundle } from './bundleTypes';
import { UNITS3, VOCAB3_TOPICS, ALL_WORDS3, READINGS3, LISTENINGS3, LISTENING_SOURCES3, WRITINGS3, SPEAKINGS3, SPEAKING_RULES3, EXERCISES3_BY_LESSON, ALL_EXERCISES3, STAGE3_STATS } from './stage3';

export const STAGE3: StageBundle = {
  id: 'stage3',
  label: 'Chặng 3',
  band: 'Band 5.5 → 6.5',
  focus: 'Chặng kẹt lâu nhất, gần như luôn vì Writing không ai sửa. Trọng tâm: tự chấm và tự sửa bài.',
  units: UNITS3,
  vocabTopics: VOCAB3_TOPICS,
  allWords: ALL_WORDS3,
  readings: READINGS3,
  listenings: LISTENINGS3,
  sources: LISTENING_SOURCES3,
  writings: WRITINGS3,
  speakings: SPEAKINGS3,
  speakingRules: SPEAKING_RULES3,
  exercisesByLesson: EXERCISES3_BY_LESSON,
  allExercises: ALL_EXERCISES3,
  stats: STAGE3_STATS,
  keys: { lessonDone: 'ielts:s3:lessons:v1', vocabKnown: 'ielts:s3:vocab-known:v1' },
};
