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
  listening: (code: string, params: { page?: number; limit?: number } = {}): Res<ListeningItem[]> =>
    api.get(`/my-language/${code}/listening`, { params }),
  conversation: (code: string, params: { page?: number; limit?: number } = {}): Res<ConversationItem[]> =>
    api.get(`/my-language/${code}/conversation`, { params }),
  reading: (code: string, params: { page?: number; limit?: number } = {}): Res<ReadingArticle[]> =>
    api.get(`/my-language/${code}/reading`, { params }),
  qna: (code: string, params: { page?: number; limit?: number } = {}): Res<QnaItem[]> =>
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
};

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
};
