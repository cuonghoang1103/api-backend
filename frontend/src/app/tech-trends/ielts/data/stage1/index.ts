/**
 * Gom nội dung chặng 1 (band 0 → 4.0) và tính sẵn các con số hiện trên trang.
 *
 * Con số ĐỀU tính từ dữ liệu, không gõ tay. Gõ tay thì thêm bài mới xong quên
 * sửa số, trang hiện sai mà không ai biết.
 */
import type { Exercise as ExerciseType } from '../types';

export { VOCAB_A } from './vocab-a';
export { VOCAB_B } from './vocab-b';
export { UNITS_A } from './lessons-a';
export { UNITS_B } from './lessons-b';
export { READINGS } from './reading';
export { LISTENINGS, LISTENING_SOURCES } from './listening';
export { WRITINGS } from './writing';
export { SPEAKINGS, SPEAKING_RULES } from './speaking';
export { EXERCISES_A } from './exercises-a';
export { EXERCISES_B } from './exercises-b';
export { LIFE } from './life';
export { EXAM } from './exam';

import { VOCAB_A } from './vocab-a';
import { VOCAB_B } from './vocab-b';
import { UNITS_A } from './lessons-a';
import { UNITS_B } from './lessons-b';
import { READINGS } from './reading';
import { LISTENINGS, LISTENING_SOURCES } from './listening';
import { WRITINGS } from './writing';
import { SPEAKINGS } from './speaking';
import { EXERCISES_A } from './exercises-a';
import { EXERCISES_B } from './exercises-b';
import { LIFE } from './life';
import { EXAM } from './exam';

/** 10 chủ đề từ vựng nền của chặng 1. */
export const VOCAB_TOPICS = [...VOCAB_A, ...VOCAB_B];

/** Toàn bộ từ, dùng cho chế độ lật thẻ / kiểm tra / tra cứu. */
export const ALL_WORDS = VOCAB_TOPICS.flatMap((t) => t.words);

/** 8 chủ điểm bài học, 40 bài. */
export const UNITS = [...UNITS_A, ...UNITS_B];

export const ALL_LESSONS = UNITS.flatMap((u) => u.lessons);

/** Bài tập của cả 40 bài học. */
export const EXERCISE_SETS = [...EXERCISES_A, ...EXERCISES_B];

/** Tra nhanh bộ bài tập theo id bài học — dùng trong LessonsView. */
export const EXERCISES_BY_LESSON: Record<string, ExerciseType[]> = Object.fromEntries(
  EXERCISE_SETS.map((s) => [s.lessonId, s.items]),
);

/** Mọi câu bài tập gộp lại, dùng cho phần Luyện mỗi ngày. */
export const ALL_EXERCISES = EXERCISE_SETS.flatMap((s) => s.items);

/** Bài tập trong các tình huống Đời sống — cũng đưa vào Luyện mỗi ngày. */
export const LIFE_EXERCISES = LIFE.flatMap((l) => l.items);

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
  /** Bài tập ngữ pháp gắn theo bài học. */
  exercises: ALL_EXERCISES.length,
  /** Tình huống Đời sống & Việc làm. */
  situations: LIFE.length,
  /** Bài tập trong phần Đời sống. */
  lifeExercises: LIFE_EXERCISES.length,
  /** Số câu chấm điểm được trên toàn khoá — con số người học quan tâm nhất. */
  gradedTotal:
    READINGS.reduce((s, r) => s + r.questions.length, 0)
    + LISTENINGS.reduce((s, l) => s + l.questions.length, 0)
    + ALL_EXERCISES.length
    + LIFE_EXERCISES.length,
  examBlocks: EXAM.length,
};

/** Khoá localStorage — tách theo từng loại tiến độ để xoá cái này không mất cái kia. */
export const KEYS = {
  checkpoints: 'ielts:checkpoints:v1',
  lessonDone: 'ielts:s1:lessons:v1',
  vocabKnown: 'ielts:s1:vocab-known:v1',
};
