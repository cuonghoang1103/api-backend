/** Chặng 1 — một chunk riêng: loadStage.ts nạp nó bằng import() khi người học mở chặng này. */
import type { StageBundle } from './bundleTypes';
import { UNITS, VOCAB_TOPICS, ALL_WORDS, READINGS, LISTENINGS, LISTENING_SOURCES, WRITINGS, SPEAKINGS, SPEAKING_RULES, EXERCISES_BY_LESSON, ALL_EXERCISES, STAGE1_STATS } from './stage1';

export const STAGE1: StageBundle = {
  id: 'stage1',
  label: 'Chặng 1',
  band: 'Band 0 → 4.0',
  focus: 'Xây nền: âm, câu cơ bản, 1.500 từ nền. Chưa đụng đề thi thật.',
  units: UNITS,
  vocabTopics: VOCAB_TOPICS,
  allWords: ALL_WORDS,
  readings: READINGS,
  listenings: LISTENINGS,
  sources: LISTENING_SOURCES,
  writings: WRITINGS,
  speakings: SPEAKINGS,
  speakingRules: SPEAKING_RULES,
  exercisesByLesson: EXERCISES_BY_LESSON,
  allExercises: ALL_EXERCISES,
  stats: STAGE1_STATS,
  keys: { lessonDone: 'ielts:s1:lessons:v1', vocabKnown: 'ielts:s1:vocab-known:v1' },
};
