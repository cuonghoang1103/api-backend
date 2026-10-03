/** Chặng 2 — một chunk riêng: loadStage.ts nạp nó bằng import() khi người học mở chặng này. */
import type { StageBundle } from './bundleTypes';
import { UNITS2, VOCAB2_TOPICS, ALL_WORDS2, READINGS2, LISTENINGS2, LISTENING_SOURCES2, WRITINGS2, SPEAKINGS2, SPEAKING_RULES2, EXERCISES2_BY_LESSON, ALL_EXERCISES2, STAGE2_STATS, QUESTION_TYPES, STRATEGY_NOTES } from './stage2';

export const STAGE2: StageBundle = {
  id: 'stage2',
  label: 'Chặng 2',
  band: 'Band 4.0 → 5.5',
  focus: 'Vào đề thi thật: học DẠNG câu hỏi, paraphrase, và khung viết/nói đủ 5.5.',
  units: UNITS2,
  vocabTopics: VOCAB2_TOPICS,
  allWords: ALL_WORDS2,
  readings: READINGS2,
  listenings: LISTENINGS2,
  sources: LISTENING_SOURCES2,
  writings: WRITINGS2,
  speakings: SPEAKINGS2,
  speakingRules: SPEAKING_RULES2,
  exercisesByLesson: EXERCISES2_BY_LESSON,
  allExercises: ALL_EXERCISES2,
  questionTypes: QUESTION_TYPES,
  strategyNotes: STRATEGY_NOTES,
  stats: STAGE2_STATS,
  keys: { lessonDone: 'ielts:s2:lessons:v1', vocabKnown: 'ielts:s2:vocab-known:v1' },
};
