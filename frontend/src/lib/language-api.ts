/**
 * My Language — API client.
 * Axios groups over /api/v1/my-language (public + authed SRS) and
 * /api/v1/admin/my-language (ADMIN CRUD). Callers unwrap `res.data.data`.
 */
import { api } from './api';
import type {
  ApiResponse,
} from '@/types';
import type {
  LanguageCard,
  LanguageOverview,
  AlphabetGroup,
  VocabCategory,
  VocabCollection,
  VocabWord,
  GrammarPoint,
  ListeningItem,
  ConversationItem,
  ReadingArticle,
  QnaItem,
  UserProgress,
  DictionaryEntry,
  LearningStats,
  CsvRowResult,
  LangItemType,
  LangLearnStatus,
} from '@/types/language';

type Res<T> = Promise<{ data: ApiResponse<T> & { pagination?: PaginationMeta } }>;
export interface PaginationMeta { page: number; limit: number; total: number; totalPages: number }

// ─── Public reads ────────────────────────────────────────────────
export const languageApi = {
  list: (): Res<LanguageCard[]> => api.get('/my-language'),
  overview: (code: string): Res<LanguageOverview> => api.get(`/my-language/${code}`),
  alphabet: (code: string): Res<AlphabetGroup[]> => api.get(`/my-language/${code}/alphabet`),
  vocabCategories: (code: string): Res<VocabCategory[]> => api.get(`/my-language/${code}/vocab/categories`),
  vocab: (code: string, params: { categoryId?: number; search?: string; page?: number; limit?: number } = {}): Res<VocabWord[]> =>
    api.get(`/my-language/${code}/vocab`, { params }),
  vocabSearch: (code: string, q: string): Res<VocabWord[]> => api.get(`/my-language/${code}/vocab/search`, { params: { q } }),
  dictionary: (code: string): Res<DictionaryEntry[]> => api.get(`/my-language/${code}/dictionary`),
  grammar: (code: string, params: { level?: string; page?: number; limit?: number } = {}): Res<{ items: GrammarPoint[]; levels: string[] }> =>
    api.get(`/my-language/${code}/grammar`, { params }),
  listening: (code: string, params: { level?: string; page?: number; limit?: number } = {}): Res<ListeningItem[]> =>
    api.get(`/my-language/${code}/listening`, { params }),
  conversation: (code: string, params: { level?: string; page?: number; limit?: number } = {}): Res<ConversationItem[]> =>
    api.get(`/my-language/${code}/conversation`, { params }),
  reading: (code: string, params: { level?: string; page?: number; limit?: number } = {}): Res<ReadingArticle[]> =>
    api.get(`/my-language/${code}/reading`, { params }),
  qna: (code: string, params: { level?: string; page?: number; limit?: number } = {}): Res<QnaItem[]> =>
    api.get(`/my-language/${code}/qna`, { params }),

  // ─── Authed learning engine ──────────────────────────────────
  recordProgress: (body: { itemType: LangItemType; itemId: number; quality?: number; status?: LangLearnStatus }): Res<UserProgress> =>
    api.post('/my-language/progress', body),
  reviewQueue: (languageCode?: string): Res<{ count: number; items: Array<{ progress: UserProgress; word: VocabWord | null }> }> =>
    api.get('/my-language/review-queue', { params: { languageCode } }),
  quizResult: (body: { languageId: number; categoryId?: number | null; score: number; total: number }): Res<unknown> =>
    api.post('/my-language/quiz-result', body),
  stats: (languageCode?: string): Res<LearningStats> => api.get('/my-language/stats', { params: { languageCode } }),

  // ─── Favorites & collections (per-user vocab playlists) ──────
  favoriteToggle: (wordId: number): Res<{ wordId: number; favorited: boolean }> =>
    api.post('/my-language/favorites/toggle', { wordId }),
  favorites: (code: string): Res<{ count: number; items: VocabWord[] }> =>
    api.get(`/my-language/favorites/${code}`),
  favoriteIds: (code: string): Res<number[]> => api.get(`/my-language/favorites/${code}/ids`),
  collections: (code: string): Res<VocabCollection[]> =>
    api.get('/my-language/collections', { params: { code } }),
  createCollection: (body: { code: string; name: string; icon?: string | null }): Res<VocabCollection> =>
    api.post('/my-language/collections', body),
  updateCollection: (id: number, body: { name?: string; icon?: string | null }): Res<VocabCollection> =>
    api.put(`/my-language/collections/${id}`, body),
  deleteCollection: (id: number): Res<{ deleted: boolean }> => api.delete(`/my-language/collections/${id}`),
  collectionWords: (id: number): Res<{ collection: { id: number; name: string; icon?: string | null }; count: number; items: VocabWord[] }> =>
    api.get(`/my-language/collections/${id}/words`),
  addToCollection: (id: number, body: { wordIds?: number[]; categoryId?: number }): Res<{ added: number; requested: number }> =>
    api.post(`/my-language/collections/${id}/words`, body),
  removeFromCollection: (id: number, wordId: number): Res<{ removed: boolean }> =>
    api.delete(`/my-language/collections/${id}/words/${wordId}`),

  // ─── AI tutor (Pro/Max) ──────────────────────────────────────
  explain: (body: { languageCode: string; kind: 'grammar' | 'vocab'; itemId: number }): Res<AiExplanation> =>
    api.post('/my-language/ai/explain', body),
  aiStatus: (): Res<{ available: boolean; isPro: boolean }> => api.get('/my-language/ai/status'),
  pronounce: (body: { audio: Blob; languageCode: string; target: string; reading?: string }): Res<PronunciationResult> => {
    const fd = new FormData();
    fd.append('audio', body.audio, 'clip.webm');
    fd.append('languageCode', body.languageCode);
    fd.append('target', body.target);
    if (body.reading) fd.append('reading', body.reading);
    // Override the axios default application/json or multer sees no file.
    return api.post('/my-language/ai/pronounce', fd, { timeout: 60_000, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  generateQuiz: (body: { languageCode: string; categoryId?: number; count?: number }): Res<AiQuiz> =>
    api.post('/my-language/ai/quiz', body),
  gradeAnswer: (body: { languageCode: string; prompt: string; answer: string; sampleAnswer?: string }): Res<AiGradeResult> =>
    api.post('/my-language/ai/grade', body),
  gradeWriting: (body: { languageCode: string; text: string; prompt?: string }): Res<WritingFeedback> =>
    api.post('/my-language/ai/writing', body),
  rolePlayTurn: (body: { languageCode: string; scenario: string; history: { role: 'user' | 'assistant'; content: string }[]; message: string }): Res<RolePlayReply> =>
    api.post('/my-language/ai/roleplay', body),
  transcribe: (body: { audio: Blob; languageCode: string }): Res<{ text: string }> => {
    const fd = new FormData();
    fd.append('audio', body.audio, 'clip.webm');
    fd.append('languageCode', body.languageCode);
    return api.post('/my-language/ai/stt', fd, { timeout: 60_000, headers: { 'Content-Type': 'multipart/form-data' } });
  },
  // ─── Hán tự (kanji / hanzi) ──────────────────────────────────
  hanziList: (code: string, level?: string): Res<{ levels: string[]; chars: HanziChar[] }> =>
    api.get(`/my-language/${code}/hanzi`, { params: level ? { level } : undefined }),
  hanziChar: (id: number): Res<HanziChar> => api.get(`/my-language/hanzi/${id}`),
  hanziAttempt: (body: { charId: number; mistakes: number; fromMemory?: boolean }): Res<{ attempts: number; mistakes: number; bestMistakes: number | null; learned: boolean }> =>
    api.post('/my-language/hanzi/attempt', body),
  hanziStats: (code: string): Res<{ total: number; learned: number; attempted: number }> =>
    api.get(`/my-language/${code}/hanzi/stats`),
  hanziReview: (code: string): Res<{ count: number; chars: HanziChar[] }> =>
    api.get(`/my-language/${code}/hanzi/review`),
  kanaTip: (body: { char: string; romaji?: string }): Res<KanaTip> =>
    api.post('/my-language/ai/kana-tip', body),
  kanaConfusable: (char: string): Res<{ items: KanaConfusable[] }> =>
    api.get(`/my-language/kana/${encodeURIComponent(char)}/confusable`),

  translate: (body: { languageCode: string; text: string; direction: 'to' | 'from'; tone?: string }): Res<TranslateResult> =>
    api.post('/my-language/ai/translate', body),
  grammarCheck: (body: { languageCode: string; text: string }): Res<GrammarCheckResult> =>
    api.post('/my-language/ai/grammar-check', body),

  // ─── Roadmap (lộ trình học) ──────────────────────────────────
  roadmap: (code: string): Res<Roadmap> => api.get(`/my-language/${code}/roadmap`),
  roadmapToggleDone: (nodeId: number): Res<{ nodeId: number; done: boolean }> =>
    api.post(`/my-language/roadmap/${nodeId}/done`, {}),

  // ─── Practice (Duolingo-style) ───────────────────────────────
  practice: (code: string): Res<PracticeOverview> => api.get(`/my-language/${code}/practice`),
  practiceComplete: (body: { languageCode: string; lessonKey: string; correct: number; total: number; mistakes: number; wrongIds?: number[]; rightIds?: number[] }): Res<PracticeCompleteResult> =>
    api.post('/my-language/practice/complete', body),
  practiceReminder: (body: { languageCode: string; enabled: boolean; hour?: number }): Res<PracticeStateDto> =>
    api.post('/my-language/practice/reminder', body),
  practiceLeaderboard: (code: string): Res<Leaderboard> => api.get(`/my-language/${code}/practice/leaderboard`),
  practiceAchievements: (code: string): Res<AchievementsResult> => api.get(`/my-language/${code}/practice/achievements`),
};

export interface PracticeStateDto {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForLevel: number;
  streak: number;
  longestStreak: number;
  dailyGoalXp: number;
  dailyXp: number;
  weeklyXp: number;
  hearts: number;
  maxHearts: number;
  heartsFullInMin: number;
  reminderEnabled: boolean;
  reminderHour: number;
}
export interface AchievementBadge {
  id: string;
  label: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  goal: number;
  current: number;
}
export interface AchievementsResult {
  level: { level: number; xpIntoLevel: number; xpForLevel: number; xp: number };
  totals: { lessonsPlayed: number; lessonsPassed: number; goldCrowns: number; longestStreak: number; xp: number };
  badges: AchievementBadge[];
  earnedCount: number;
}
export interface PracticeLesson {
  lessonKey: string;
  categoryId: number;
  name: string;
  icon: string | null;
  wordCount: number;
  crown: number;
  bestScore: number;
  locked: boolean;
}
export interface PracticeUnit {
  key: string;
  label: string;
  lessons: PracticeLesson[];
}
export interface PracticeOverview {
  language: { id: number; code: string; name: string; nameEn: string; flagEmoji: string };
  state: PracticeStateDto;
  units: PracticeUnit[];
}
export interface PracticeCompleteResult {
  xpGained: number;
  crown: number;
  leveledUp: boolean;
  state: PracticeStateDto;
}
export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  avatarUrl: string | null;
  weeklyXp: number;
  isMe: boolean;
}
export interface Leaderboard {
  week: string;
  entries: LeaderboardEntry[];
  me: LeaderboardEntry | null;
}

export interface RoadmapNode {
  id: number;
  stage: number;
  stageLabel: string;
  order: number;
  side: 'center' | 'left' | 'right' | string;
  kind: 'primary' | 'alternative' | 'info' | string;
  title: string;
  subtitle: string | null;
  level: string | null;
  icon: string | null;
  description: string | null;
  linkType: string | null;
  linkRef: string | null;
}
export interface RoadmapStage {
  stage: number;
  stageLabel: string;
  nodes: RoadmapNode[];
}
export interface Roadmap {
  language: { id: number; code: string; name: string; nameEn: string; flagEmoji: string };
  stages: RoadmapStage[];
  doneNodeIds: number[];
  total: number;
}

export interface AiExplanationExample {
  text: string;
  reading?: string;
  translation?: string;
}
export interface AiExplanation {
  kind: 'grammar' | 'vocab';
  title: string;
  summary: string;
  explanation: string; // markdown
  examples: AiExplanationExample[];
  tips: string[];
}

export type PronounceVerdict = 'good' | 'ok' | 'poor';
export interface PronunciationResult {
  target: string;
  heard: string;
  score: number; // 0–100
  verdict: PronounceVerdict;
  feedback: string;
  tips: string[];
}

export interface AiQuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
export interface AiQuiz {
  questions: AiQuizQuestion[];
}
export interface AiGradeResult {
  score: number; // 0–100
  verdict: PronounceVerdict;
  feedback: string;
  corrected: string;
}

export interface WritingCorrection {
  original: string;
  suggestion: string;
  note: string;
}
export interface WritingFeedback {
  score: number; // 0–100
  level: string;
  verdict: PronounceVerdict;
  feedback: string;
  corrected: string;
  corrections: WritingCorrection[];
}
export interface RolePlayReply {
  reply: string;
  translation: string;
  correction: string;
}
export interface HanziExample { word: string; reading?: string; meaningVi: string }
export interface HanziImage { url: string; caption?: string }
export interface KanaConfusable { char: string; romaji: string; how: string }
export interface KanaTip {
  char: string;
  romaji: string;
  mnemonic: string;
  strokeTip: string;
  confusable: KanaConfusable[];
  examples: Array<{ word: string; reading: string; meaningVi: string }>;
}

export interface HanziChar {
  id: number;
  char: string;
  level: string | null;
  strokeCount: number | null;
  onyomi: string | null;
  kunyomi: string | null;
  pinyin: string | null;
  meaningVi: string;
  mnemonic: string | null;
  radical: string | null;
  breakdown: string | null;
  examples: HanziExample[];
  images: HanziImage[];
  note: string | null;
  order: number;
  progress?: { attempts: number; mistakes: number; bestMistakes: number | null; learned: boolean } | null;
}

export interface TranslateAlternative {
  text: string;
  note: string;
}
export interface TranslateResult {
  translation: string;
  reading: string; // romaji/pinyin when translating INTO a CJK language
  literal: string;
  notes: string;
  alternatives: TranslateAlternative[];
}
export interface GrammarIssue {
  original: string;
  suggestion: string;
  type: string;
  severity: 'error' | 'warning' | 'style';
  explanation: string;
}
export interface GrammarCheckResult {
  score: number; // 0–100
  verdict: PronounceVerdict;
  corrected: string;
  summary: string;
  issues: GrammarIssue[];
}

/**
 * Drain a paginated list endpoint (backend caps limit at 100, default 20).
 * Section pages (grammar/conversation/qna/reading/listening) show the whole
 * catalogue at once, so they loop pages until a short batch signals the end.
 */
export async function fetchAllPages<T>(
  fetchPage: (params: { page: number; limit: number }) => Promise<T[]>,
): Promise<T[]> {
  const limit = 100;
  const all: T[] = [];
  for (let page = 1; page <= 30; page++) {
    const batch = await fetchPage({ page, limit });
    all.push(...batch);
    if (batch.length < limit) break;
  }
  return all;
}

// ─── Admin CRUD ──────────────────────────────────────────────────
type AnyRecord = Record<string, unknown>;

export const languageAdminApi = {
  // languages
  listLanguages: (): Res<Array<LanguageOverview & { counts: AnyRecord }>> => api.get('/admin/my-language/languages'),
  createLanguage: (body: AnyRecord): Res<unknown> => api.post('/admin/my-language/languages', body),
  updateLanguage: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/languages/${id}`, body),
  deleteLanguage: (id: number): Res<unknown> => api.delete(`/admin/my-language/languages/${id}`),

  // uploads
  uploadImage: (file: File): Res<{ url: string; key: string }> => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/admin/my-language/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadAudio: (file: File | Blob, filename = 'recording.webm'): Res<{ key: string; url: string }> => {
    const fd = new FormData();
    fd.append('audio', file, filename);
    return api.post('/admin/my-language/upload/audio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  // generic reorder
  reorder: (model: string, items: Array<{ id: number; order: number }>): Res<unknown> =>
    api.patch('/admin/my-language/reorder', { model, items }),

  // content fetch
  content: (code: string, section: string): Res<unknown> => api.get(`/admin/my-language/${code}/content/${section}`),
  vocabWords: (categoryId: number, params: { page?: number; search?: string; limit?: number } = {}): Res<VocabWord[]> =>
    api.get(`/admin/my-language/vocab/categories/${categoryId}/words`, { params }),

  // alphabet
  createAlphabetGroup: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/alphabet-groups`, body),
  updateAlphabetGroup: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/alphabet-groups/${id}`, body),
  deleteAlphabetGroup: (id: number): Res<unknown> => api.delete(`/admin/my-language/alphabet-groups/${id}`),
  createAlphabetItem: (groupId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/alphabet-groups/${groupId}/items`, body),
  bulkAlphabet: (groupId: number, text: string): Res<unknown> => api.post(`/admin/my-language/alphabet-groups/${groupId}/bulk`, { text }),
  updateAlphabetItem: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/alphabet-items/${id}`, body),
  deleteAlphabetItem: (id: number): Res<unknown> => api.delete(`/admin/my-language/alphabet-items/${id}`),

  // vocab
  hanziList: (code: string): Res<HanziChar[]> => api.get(`/admin/my-language/${code}/hanzi`),
  hanziCreate: (code: string, body: AnyRecord): Res<HanziChar> => api.post(`/admin/my-language/${code}/hanzi`, body),
  hanziUpdate: (id: number, body: AnyRecord): Res<HanziChar> => api.put(`/admin/my-language/hanzi/${id}`, body),
  hanziDelete: (id: number): Res<unknown> => api.delete(`/admin/my-language/hanzi/${id}`),
  hanziAi: (id: number, overwrite = false): Res<{ id: number; meaningVi: string; mnemonic: string | null; breakdown: string | null; examples: HanziExample[] }> =>
    api.post(`/admin/my-language/hanzi/${id}/ai`, { overwrite }),

  createVocabCategory: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/vocab-categories`, body),
  updateVocabCategory: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/vocab-categories/${id}`, body),
  deleteVocabCategory: (id: number): Res<unknown> => api.delete(`/admin/my-language/vocab-categories/${id}`),
  createVocabWord: (categoryId: number, body: AnyRecord): Res<VocabWord> => api.post(`/admin/my-language/vocab-categories/${categoryId}/words`, body),
  updateVocabWord: (id: number, body: AnyRecord): Res<VocabWord> => api.put(`/admin/my-language/vocab-words/${id}`, body),
  deleteVocabWord: (id: number): Res<unknown> => api.delete(`/admin/my-language/vocab-words/${id}`),
  csvPreview: (categoryId: number, csv: string): Res<CsvRowResult[]> => api.post(`/admin/my-language/vocab-categories/${categoryId}/csv/preview`, { csv }),
  csvImport: (categoryId: number, csv: string): Res<{ created: number; skipped: number; results: CsvRowResult[] }> =>
    api.post(`/admin/my-language/vocab-categories/${categoryId}/csv/import`, { csv }),

  // grammar / listening / conversation / reading / qna
  createGrammar: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/grammar`, body),
  updateGrammar: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/grammar/${id}`, body),
  deleteGrammar: (id: number): Res<unknown> => api.delete(`/admin/my-language/grammar/${id}`),
  createListening: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/listening`, body),
  updateListening: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/listening/${id}`, body),
  deleteListening: (id: number): Res<unknown> => api.delete(`/admin/my-language/listening/${id}`),
  createConversation: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/conversation`, body),
  updateConversation: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/conversation/${id}`, body),
  deleteConversation: (id: number): Res<unknown> => api.delete(`/admin/my-language/conversation/${id}`),
  createReading: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/reading`, body),
  updateReading: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/reading/${id}`, body),
  deleteReading: (id: number): Res<unknown> => api.delete(`/admin/my-language/reading/${id}`),
  createQna: (languageId: number, body: AnyRecord): Res<unknown> => api.post(`/admin/my-language/languages/${languageId}/qna`, body),
  updateQna: (id: number, body: AnyRecord): Res<unknown> => api.put(`/admin/my-language/qna/${id}`, body),
  deleteQna: (id: number): Res<unknown> => api.delete(`/admin/my-language/qna/${id}`),

  // AI content generation (preview → commit)
  aiGenerate: (body: { languageCode: string; section: string; categoryId?: number; articleId?: number; level?: string; topic?: string; count?: number }): Res<AiGenResult> =>
    api.post('/admin/my-language/ai/generate', body),
  aiCommit: (body: { languageCode: string; section: string; categoryId?: number; articleId?: number; items: AnyRecord[] }): Res<{ created: number; skipped: number }> =>
    api.post('/admin/my-language/ai/commit', body),

  // Learning analytics (per-user)
  analyticsOverview: (): Res<LangAnalyticsOverview> => api.get('/admin/my-language/analytics/overview'),
  analyticsUsers: (keyword?: string): Res<LangAnalyticsUser[]> => api.get('/admin/my-language/analytics/users', { params: { keyword } }),
  analyticsUser: (id: number): Res<LangAnalyticsUserDetail> => api.get(`/admin/my-language/analytics/users/${id}`),

  // Roadmap (lộ trình) — CRUD + seed
  roadmapNodes: (code: string): Res<RoadmapNode[]> => api.get(`/admin/my-language/${code}/roadmap/nodes`),
  createRoadmapNode: (languageId: number, body: AnyRecord): Res<RoadmapNode> =>
    api.post(`/admin/my-language/languages/${languageId}/roadmap/nodes`, body),
  updateRoadmapNode: (id: number, body: AnyRecord): Res<RoadmapNode> =>
    api.put(`/admin/my-language/roadmap/nodes/${id}`, body),
  deleteRoadmapNode: (id: number): Res<{ id: number }> => api.delete(`/admin/my-language/roadmap/nodes/${id}`),
  reorderRoadmap: (items: Array<{ id: number; stage?: number; order?: number; side?: string }>): Res<{ updated: number }> =>
    api.patch('/admin/my-language/roadmap/reorder', { items }),
  seedRoadmap: (body: { code?: string; all?: boolean; force?: boolean }): Res<unknown> =>
    api.post('/admin/my-language/roadmap/seed', body),
  autoAssignRoadmap: (code: string, force = false): Res<{ code: string; boundNodes: number; assignedCategories: number; vocabNodes: number; eligibleCategories: number }> =>
    api.post(`/admin/my-language/${code}/roadmap/auto-assign`, { force }),
};

export interface LangAnalyticsOverview { learners: number; mastered: number; quizzes: number; notebookEntries: number; dueCards: number }
export interface LangAnalyticsUser {
  userId: number; username: string; email: string; fullName: string | null; avatarUrl: string | null; isAdmin: boolean;
  mastered: number; reviewing: number; learning: number; quizzes: number; quizAvg: number; notebook: number; due: number; lastActive: string | null;
}
export interface LangAnalyticsUserDetail {
  user: { id: number; username: string; email: string; fullName: string | null; avatarUrl: string | null } | null;
  perSection: Record<string, { learning: number; reviewing: number; mastered: number; total: number }>;
  quizzes: { id: number; score: number; total: number; createdAt: string; languageId: number }[];
  notebookByKind: { kind: string; count: number }[];
}

export interface AiGenProposal {
  key: string;
  summary: string;
  data: Record<string, unknown>;
}
export interface AiGenResult {
  section: string;
  items: AiGenProposal[];
}

// ─── Notebook (per-user, per-language, nested folders) ───────────
export interface NotebookFolder { id: number; parentId: number | null; name: string; icon?: string | null; sortOrder: number }
export interface NotebookEntrySummary { id: number; folderId: number | null; kind: string; title: string; reading?: string | null; updatedAt: string; nextReviewAt?: string | null }
export interface NotebookEntry extends NotebookEntrySummary { body: string; meaning?: string | null; languageId: number }
export interface NotebookLanguageMeta { id: number; code: string; name: string; flagEmoji: string }
export interface NotebookTree { language: NotebookLanguageMeta; folders: NotebookFolder[]; entries: NotebookEntrySummary[] }
export interface NotebookLanguage extends NotebookLanguageMeta { entryCount: number; dueCount: number }

export const notebookApi = {
  languages: (): Res<NotebookLanguage[]> => api.get('/my-language/notebook/languages'),
  tree: (code: string): Res<NotebookTree> => api.get(`/my-language/notebook/${code}`),
  entry: (id: number): Res<NotebookEntry> => api.get(`/my-language/notebook/entry/${id}`),
  createFolder: (body: { code: string; name: string; icon?: string | null; parentId?: number | null }): Res<NotebookFolder> =>
    api.post('/my-language/notebook/folders', body),
  renameFolder: (id: number, body: { name?: string; icon?: string | null }): Res<NotebookFolder> =>
    api.put(`/my-language/notebook/folders/${id}`, body),
  moveFolder: (id: number, parentId: number | null): Res<NotebookFolder> =>
    api.patch(`/my-language/notebook/folders/${id}/move`, { parentId }),
  deleteFolder: (id: number): Res<{ id: number }> => api.delete(`/my-language/notebook/folders/${id}`),
  createEntry: (body: { code: string; folderId?: number | null; kind?: string; title: string; body: string; reading?: string | null; meaning?: string | null }): Res<NotebookEntry> =>
    api.post('/my-language/notebook/entries', body),
  updateEntry: (id: number, body: { title?: string; body?: string; reading?: string | null; meaning?: string | null; kind?: string }): Res<NotebookEntry> =>
    api.put(`/my-language/notebook/entries/${id}`, body),
  moveEntry: (id: number, folderId: number | null): Res<NotebookEntry> =>
    api.patch(`/my-language/notebook/entries/${id}/move`, { folderId }),
  reviewEntry: (id: number, quality: number): Res<{ id: number; nextReviewAt: string | null }> =>
    api.patch(`/my-language/notebook/entries/${id}/review`, { quality }),
  reorderEntries: (ids: number[]): Res<{ updated: number }> =>
    api.patch('/my-language/notebook/entries/reorder', { ids }),
  deleteEntry: (id: number): Res<{ id: number }> => api.delete(`/my-language/notebook/entries/${id}`),
  save: (body: { code: string; title: string; body: string; kind?: string; reading?: string | null; meaning?: string | null; folderId?: number | null }): Res<{ id: number; languageId: number }> =>
    api.post('/my-language/notebook/save', body),
};
