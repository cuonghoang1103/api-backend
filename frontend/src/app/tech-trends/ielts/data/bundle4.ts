/** Chặng 4 — một chunk riêng: loadStage.ts nạp nó bằng import() khi người học mở chặng này. */
import type { StageBundle } from './bundleTypes';
import { UNITS4, VOCAB4, ALL_WORDS4, READINGS4, LISTENINGS4, LISTENING_SOURCES4, WRITINGS4, SPEAKINGS4, SPEAKING_RULES4, EXERCISES4_BY_LESSON, ALL_EXERCISES4, STAGE4_STATS } from './stage4';

export const STAGE4: StageBundle = {
  id: 'stage4',
  label: 'Chặng 4',
  band: 'Band 6.5 → 7.5',
  focus: 'Không học kiến thức mới nữa — chặng này ăn nhau ở việc GIẢM LỖI và dùng từ chính xác.',
  units: UNITS4,
  vocabTopics: VOCAB4,
  allWords: ALL_WORDS4,
  readings: READINGS4,
  listenings: LISTENINGS4,
  sources: LISTENING_SOURCES4,
  writings: WRITINGS4,
  speakings: SPEAKINGS4,
  speakingRules: SPEAKING_RULES4,
  exercisesByLesson: EXERCISES4_BY_LESSON,
  allExercises: ALL_EXERCISES4,
  stats: STAGE4_STATS,
  keys: { lessonDone: 'ielts:s4:lessons:v1', vocabKnown: 'ielts:s4:vocab-known:v1' },
};
