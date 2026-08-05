/**
 * Gom mỗi chặng thành MỘT bundle cùng hình dạng, để các view dùng chung.
 *
 * Trước khi có file này, mọi view import thẳng từ `./data/stage1` nên không
 * thể hiện được chặng 2 mà không nhân đôi component. Nay view nhận `d:
 * StageBundle` qua prop và không cần biết mình đang hiện chặng nào.
 *
 * Hai điểm cần giữ khi thêm chặng 3 và 4:
 *
 *  - **Khoá localStorage phải KHÁC nhau giữa các chặng.** Tiến độ bài học và
 *    từ vựng của chặng 1 không được đè lên chặng 2 — người học có thể quay lại
 *    ôn chặng cũ bất cứ lúc nào và tiến độ hai chặng là hai chuyện riêng.
 *  - **Trường chỉ có ở một chặng thì để optional** (`questionTypes` chỉ có ở
 *    chặng 2 trở đi, `life`/`exam` là nội dung dùng chung cho cả khoá nên
 *    không nằm trong bundle).
 */
import type {
  LessonUnit, VocabTopic, VocabWord, ReadingPassage, ListeningExercise,
  ListeningSource, WritingTask, SpeakingTopic, Exercise, QuestionTypeGuide,
} from './types';
import {
  UNITS, VOCAB_TOPICS, ALL_WORDS, READINGS, LISTENINGS, LISTENING_SOURCES,
  WRITINGS, SPEAKINGS, SPEAKING_RULES, EXERCISES_BY_LESSON, ALL_EXERCISES,
  STAGE1_STATS,
} from './stage1';
import {
  UNITS2, VOCAB2_TOPICS, ALL_WORDS2, READINGS2, LISTENINGS2, LISTENING_SOURCES2,
  WRITINGS2, SPEAKINGS2, SPEAKING_RULES2, EXERCISES2_BY_LESSON, ALL_EXERCISES2,
  STAGE2_STATS, QUESTION_TYPES, STRATEGY_NOTES,
} from './stage2';
import {
  UNITS3, VOCAB3_TOPICS, ALL_WORDS3, READINGS3, LISTENINGS3, LISTENING_SOURCES3,
  WRITINGS3, SPEAKINGS3, SPEAKING_RULES3, EXERCISES3_BY_LESSON, ALL_EXERCISES3,
  STAGE3_STATS,
} from './stage3';
import {
  UNITS4, VOCAB4, ALL_WORDS4, READINGS4, LISTENINGS4, LISTENING_SOURCES4,
  WRITINGS4, SPEAKINGS4, SPEAKING_RULES4, EXERCISES4_BY_LESSON, ALL_EXERCISES4,
  STAGE4_STATS,
} from './stage4';

export interface StageStats {
  lessons: number;
  units: number;
  words: number;
  topics: number;
  readings: number;
  readingQuestions: number;
  listenings: number;
  listeningQuestions: number;
  sources: number;
  writings: number;
  speakingTopics: number;
  speakingQuestions: number;
  grammarPoints: number;
  exercises: number;
  gradedTotal: number;
}

export interface StageBundle {
  id: 'stage1' | 'stage2' | 'stage3' | 'stage4';
  /** Nhãn ngắn hiện trên nút chuyển chặng. */
  label: string;
  band: string;
  /** Một dòng nói chặng này dạy gì — hiện dưới bộ chuyển chặng. */
  focus: string;
  units: LessonUnit[];
  vocabTopics: VocabTopic[];
  allWords: VocabWord[];
  readings: ReadingPassage[];
  listenings: ListeningExercise[];
  sources: ListeningSource[];
  writings: WritingTask[];
  speakings: SpeakingTopic[];
  speakingRules: { title: string; body: string }[];
  exercisesByLesson: Record<string, Exercise[]>;
  allExercises: Exercise[];
  /** Chỉ có từ chặng 2 — cẩm nang dạng câu hỏi. */
  questionTypes?: QuestionTypeGuide[];
  strategyNotes?: { title: string; body: string }[];
  stats: StageStats;
  /** Khoá localStorage riêng cho từng chặng. */
  keys: { lessonDone: string; vocabKnown: string };
}

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

export const STAGES: StageBundle[] = [STAGE1, STAGE2, STAGE3, STAGE4];

/** Số gộp cả hai chặng — dùng cho phần đầu trang. */
const sum = (pick: (s: StageBundle) => number): number => STAGES.reduce((n, s) => n + pick(s), 0);

export const TOTAL_STATS = {
  lessons: sum((s) => s.stats.lessons),
  words: sum((s) => s.stats.words),
  readings: sum((s) => s.stats.readings),
  listenings: sum((s) => s.stats.listenings),
  writings: sum((s) => s.stats.writings),
  graded: sum((s) => s.stats.gradedTotal),
  exercises: sum((s) => s.stats.exercises),
  /** Cẩm nang dạng câu hỏi mới có từ chặng 2 — đếm qua bundle, không qua stats. */
  questionTypes: STAGE2.questionTypes?.length ?? 0,
};
