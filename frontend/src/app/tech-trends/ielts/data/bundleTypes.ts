/** Kiểu của một bundle chặng — tách riêng để bundle1..4 và bundles.ts cùng dùng mà không vòng import. */
import type {
  LessonUnit, VocabTopic, VocabWord, ReadingPassage, ListeningExercise,
  ListeningSource, WritingTask, SpeakingTopic, Exercise, QuestionTypeGuide,
} from './types';

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
