/**
 * Gom nội dung chặng 1 (band 0 → 4.0) và tính sẵn các con số hiện trên trang.
 *
 * Con số ĐỀU tính từ dữ liệu, không gõ tay. Gõ tay thì thêm bài mới xong quên
 * sửa số, trang hiện sai mà không ai biết.
 */
export { VOCAB_A } from './vocab-a';
export { VOCAB_B } from './vocab-b';
export { UNITS_A } from './lessons-a';
export { UNITS_B } from './lessons-b';
export { READINGS } from './reading';
export { LISTENINGS, LISTENING_SOURCES } from './listening';
export { WRITINGS } from './writing';
export { SPEAKINGS, SPEAKING_RULES } from './speaking';

import { VOCAB_A } from './vocab-a';
import { VOCAB_B } from './vocab-b';
import { UNITS_A } from './lessons-a';
import { UNITS_B } from './lessons-b';
import { READINGS } from './reading';
import { LISTENINGS, LISTENING_SOURCES } from './listening';
import { WRITINGS } from './writing';
import { SPEAKINGS } from './speaking';

/** 10 chủ đề từ vựng nền của chặng 1. */
export const VOCAB_TOPICS = [...VOCAB_A, ...VOCAB_B];

/** Toàn bộ từ, dùng cho chế độ lật thẻ / kiểm tra / tra cứu. */
export const ALL_WORDS = VOCAB_TOPICS.flatMap((t) => t.words);

/** 8 chủ điểm bài học, 40 bài. */
export const UNITS = [...UNITS_A, ...UNITS_B];

export const ALL_LESSONS = UNITS.flatMap((u) => u.lessons);

export const STAGE1_STATS = {
  lessons: ALL_LESSONS.length,
  units: UNITS.length,
  words: ALL_WORDS.length,
  topics: VOCAB_TOPICS.length,
  readings: READINGS.length,
  readingQuestions: READINGS.reduce((s, r) => s + r.questions.length, 0),
  listenings: LISTENINGS.length,
  listeningQuestions: LISTENINGS.reduce((s, l) => s + l.questions.length, 0),
  sources: LISTENING_SOURCES.length,
  writings: WRITINGS.length,
  speakingTopics: SPEAKINGS.length,
  speakingQuestions: SPEAKINGS.reduce((s, t) => s + t.questions.length, 0),
  /** Số điểm ngữ pháp rải trong 40 bài. */
  grammarPoints: ALL_LESSONS.reduce((s, l) => s + l.blocks.length, 0),
};

/** Khoá localStorage — tách theo từng loại tiến độ để xoá cái này không mất cái kia. */
export const KEYS = {
  checkpoints: 'ielts:checkpoints:v1',
  lessonDone: 'ielts:s1:lessons:v1',
  vocabKnown: 'ielts:s1:vocab-known:v1',
};
