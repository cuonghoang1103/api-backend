/**
 * My Language — shared frontend types (mirror the backend Prisma models).
 */

export type LangItemType = 'VOCAB' | 'ALPHABET' | 'GRAMMAR' | 'LISTENING' | 'CONVERSATION' | 'READING' | 'QNA';
export type LangLearnStatus = 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED';
export type ListeningSource = 'UPLOAD' | 'YOUTUBE';
export type ReadingType = 'IMAGE_LIST' | 'TEXT';

export interface Language {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  flagEmoji: string;
  coverUrl?: string | null;
  order: number;
  isActive: boolean;
}

export interface LanguageProgressSummary {
  learned: number;
  mastered: number;
  total: number;
  due: number;
}

export interface LanguageCard extends Language {
  counts: {
    words: number;
    grammar: number;
    listening: number;
    conversation: number;
    reading: number;
    qna: number;
    alphabet: number;
    lessons: number;
  };
  progress: LanguageProgressSummary | null;
}

export interface LanguageOverview extends Language {
  counts: {
    alphabet: number;
    vocab: number;
    grammar: number;
    listening: number;
    conversation: number;
    reading: number;
    qna: number;
  };
}

export interface AlphabetItem {
  id: number;
  groupId: number;
  character: string;
  romanization?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  note?: string | null;
  order: number;
}
export interface AlphabetGroup {
  id: number;
  languageId: number;
  name: string;
  description?: string | null;
  order: number;
  items: AlphabetItem[];
}

export interface VocabPronunciation {
  id?: number;
  wordId?: number;
  type: string;
  value: string;
  order?: number;
}
export interface VocabWord {
  id: number;
  categoryId: number;
  word: string;
  meaningVi: string;
  exampleSentence?: string | null;
  exampleMeaning?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  note?: string | null;
  order: number;
  pronunciations: VocabPronunciation[];
  category?: { id: number; name: string };
}
export interface VocabCategory {
  id: number;
  languageId: number;
  name: string;
  icon?: string | null;
  order: number;
  wordCount?: number;
  _count?: { words: number };
}

export interface GrammarExample {
  sentence: string;
  pronunciation?: string;
  meaningVi?: string;
}
export interface GrammarPoint {
  id: number;
  languageId: number;
  level?: string | null;
  title: string;
  structure: string;
  explanation?: string | null; // HTML string
  examples?: GrammarExample[] | null;
  commonMistakes?: string | null;
  comparedWith?: string | null;
  order: number;
}

export interface ListeningQuestion {
  question: string;
  answer: string;
}
export interface ListeningItem {
  id: number;
  languageId: number;
  title: string;
  sourceType: ListeningSource;
  audioUrl?: string | null;
  youtubeUrl?: string | null;
  transcript?: string | null;
  translation?: string | null;
  questions?: ListeningQuestion[] | null;
  order: number;
}

export interface ConversationItem {
  id: number;
  languageId: number;
  question: string;
  answer: string;
  questionPronunciation?: string | null;
  answerPronunciation?: string | null;
  meaningVi?: string | null;
  voiceUrl?: string | null;
  imageUrl?: string | null;
  note?: string | null;
  order: number;
}

export interface ReadingArticle {
  id: number;
  languageId: number;
  title: string;
  type: ReadingType;
  images?: string[] | null;
  content?: string | null; // HTML string
  translation?: string | null; // HTML string
  order: number;
}

export interface QnaItem {
  id: number;
  languageId: number;
  question: string;
  answer: string;
  pronunciation?: string | null;
  meaningVi?: string | null;
  audioUrl?: string | null;
  order: number;
}

export interface UserProgress {
  id: number;
  userId: number;
  itemType: LangItemType;
  itemId: number;
  status: LangLearnStatus;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt?: string | null;
  lastReviewedAt?: string | null;
}

export interface DictionaryEntry {
  id: number;
  word: string;
  meaningVi: string;
  pronunciations: { type: string; value: string }[];
}

export interface QuizResult {
  id: number;
  userId: number;
  languageId: number;
  categoryId?: number | null;
  score: number;
  total: number;
  createdAt: string;
}

export interface LearningStats {
  streak: number;
  perSection: Record<LangItemType, { learning: number; reviewing: number; mastered: number; total: number }>;
  quizHistory: QuizResult[];
}

export interface CsvRowResult {
  row: number;
  word: string;
  meaningVi: string;
  valid: boolean;
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
