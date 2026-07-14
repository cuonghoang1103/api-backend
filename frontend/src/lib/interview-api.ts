/**
 * Interview Simulator — API client.
 * Axios groups over /api/v1/interview (user) and /api/v1/admin/interview (admin).
 * Callers unwrap `res.data.data`. Phase 2 is STATIC — no streaming yet.
 */
import { api } from './api';
import type { ApiResponse } from '@/types';
import type {
  TaxonomyResponse,
  SessionCreateResponse,
  SessionState,
  SubmitAnswerResponse,
  SelfAssessResponse,
  InterviewReport,
  ReportResponse,
  HistoryItem,
  CreateSessionBody,
  IntegritySignals,
  InterviewLevel,
  DrillResponse,
  GradeCardResponse,
  MasteryResponse,
} from '@/types/interview';

type Res<T> = Promise<{ data: ApiResponse<T> }>;

export const interviewApi = {
  // ── User flow ──────────────────────────────────────────────
  tracks: (): Res<TaxonomyResponse> => api.get('/interview/tracks'),
  // CV/JD & project (.md) modes generate questions synchronously via Opus, which
  // can take a couple of minutes — long client timeout (under the nginx 300s cap).
  createSession: (body: CreateSessionBody): Res<SessionCreateResponse> => api.post('/interview/sessions', body, { timeout: 290_000 }),
  getSession: (id: number): Res<SessionState> => api.get(`/interview/sessions/${id}`),
  answer: (
    id: number,
    order: number,
    body: { answer?: string; selectedOptionId?: string; timeSpentMs?: number; integritySignals?: IntegritySignals; inputMode?: 'TYPED' | 'SPOKEN'; sttProvider?: string },
    // AI grading (HYBRID/FULL_AI) runs server-side on this call and can take
    // ~10-25s via the LLM gateway — override the default 30s axios timeout so a
    // long/detailed answer doesn't spuriously fail before the grade returns.
  ): Res<SubmitAnswerResponse> => api.post(`/interview/sessions/${id}/turns/${order}/answer`, body, { timeout: 90_000 }),
  // Phase 9 — server speech-to-text (Groq Whisper). Audio is not stored server-side.
  transcribe: (id: number, order: number, audio: Blob, language: 'vi' | 'en'): Res<{ text: string; provider: string }> => {
    const fd = new FormData();
    fd.append('audio', audio, 'answer.webm');
    fd.append('sessionId', String(id));
    fd.append('order', String(order));
    fd.append('language', language);
    // Override the axios instance's default application/json Content-Type —
    // without this the multipart body isn't sent as multipart and multer sees
    // no file ("Thiếu audio" → 400). Matches every other upload in api.ts.
    return api.post('/interview/stt', fd, { timeout: 60_000, headers: { 'Content-Type': 'multipart/form-data' } });
  },

  // Phase 2 — follow-up (probing) questions. Stateless AI coaching, not scored.
  generateFollowup: (id: number, order: number, previous?: string[]): Res<{ question: string }> =>
    api.post(`/interview/sessions/${id}/turns/${order}/followup`, { previous }, { timeout: 40_000 }),
  answerFollowup: (id: number, order: number, question: string, answer: string): Res<{ feedback: string }> =>
    api.post(`/interview/sessions/${id}/turns/${order}/followup/answer`, { question, answer }, { timeout: 40_000 }),
  selfAssess: (id: number, order: number, ratings: Record<string, number>): Res<SelfAssessResponse> =>
    api.post(`/interview/sessions/${id}/turns/${order}/self-assess`, { ratings }),
  // Report synthesis (Opus, up to ~120s) runs synchronously here — needs a long
  // client timeout or the report silently fails to reach the user.
  finish: (id: number): Res<InterviewReport> => api.post(`/interview/sessions/${id}/finish`, {}, { timeout: 180_000 }),
  report: (id: number): Res<ReportResponse> => api.get(`/interview/sessions/${id}/report`),
  history: (): Res<HistoryItem[]> => api.get('/interview/history'),
  // Phase 3 — spaced-repetition drill
  drill: (lang: 'VI' | 'EN' = 'VI'): Res<DrillResponse> => api.get('/interview/drill', { params: { lang } }),
  gradeCard: (cardId: number, body: { quality?: number; answer?: string }): Res<GradeCardResponse> =>
    api.post(`/interview/drill/${cardId}/grade`, body),
  mastery: (): Res<MasteryResponse> => api.get('/interview/mastery'),
  // Phase 5 — flag a turn's score as wrong
  flagTurn: (id: number, order: number, reason: string): Res<{ flagged: boolean }> =>
    api.post(`/interview/sessions/${id}/turns/${order}/flag`, { reason }),
};

// ── Admin ────────────────────────────────────────────────────
export interface AdminQuestion {
  id: number;
  topicId: number;
  conceptId: number | null;
  level: InterviewLevel;
  type: string;
  difficulty: number;
  body: string;
  bodyVi: string | null;
  bodyEn: string | null;
  referenceAnswer: string | null;
  rubric: unknown;
  mustMention: string[];
  shouldMention: string[];
  redFlags: string[];
  synonyms: unknown;
  tags: string[];
  status: string;
  rubricReviewed: boolean;
  topic?: { id: number; name: string; trackId: number };
  concept?: { id: number; name: string } | null;
  updatedAt?: string;
}

export interface BankHealthRow {
  topicId: number;
  level: string;
  status: string;
  count: number;
}

export interface FlaggedTurn {
  id: number;
  sessionId: number;
  order: number;
  topic: string | null;
  questionText: string;
  userAnswer: string | null;
  referenceAnswer: string | null;
  deterministicScore: { score?: number; grade?: string } | null;
  turnScore: { final?: number; self?: number } | null;
  injectionAttempted: boolean;
  userFlag: { reason: string; at: string } | null;
  level: string | null;
  engineMode: string | null;
  userId: number | null;
  createdAt: string;
}

// ── Phase 6: Knowledge base ──
export interface KnowledgeDocInput {
  title: string;
  content: string;
  sourceType?: string;
  topicIds?: number[];
  trackIds?: number[];
  level?: string | null;
  language?: 'VI' | 'EN';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sourceUrl?: string | null;
}
export interface KnowledgeDocListItem {
  id: number;
  title: string;
  sourceType: string;
  topicIds: number[];
  trackIds: number[];
  level: string | null;
  language: 'VI' | 'EN';
  version: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sourceUrl: string | null;
  chunkCount: number;
  updatedAt: string;
}
export interface KnowledgeChunk {
  id: number;
  chunkIndex: number;
  headingPath: string | null;
  content: string;
  tokenCount: number;
}
export interface KnowledgeDocDetail extends KnowledgeDocListItem {
  content: string;
  chunks: KnowledgeChunk[];
}
export interface KnowledgeCoverageRow {
  topicId: number;
  topic: string;
  trackId: number;
  track: string;
  chunkCount: number;
}

export interface LlmUsage {
  aiAvailable: boolean;
  forceStatic: boolean;
  hasKey: boolean;
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  byModel: Array<{ model: string; success: boolean; calls: number; inputTokens: number; outputTokens: number; costUsd: number }>;
}

// ── Phase 7: Prompt templates (versioned) ──
export interface PromptVar {
  name: string;
  desc: string;
}
export interface PromptSummary {
  key: string;
  name: string;
  description: string;
  variables: PromptVar[];
  defaultContent: string;
  activeVersion: number | null;
  activeContent: string;
  usingDefault: boolean;
  updatedAt: string | null;
  versionCount: number;
}
export interface PromptVersion {
  id: number;
  version: number;
  name: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface PromptVersionsResponse {
  key: string;
  name: string;
  description: string;
  variables: PromptVar[];
  defaultContent: string;
  versions: PromptVersion[];
}

// ── Phase 8: AI question generation ──
export interface GeneratedRubricItem {
  id: string;
  criterion: string;
  weight: number;
}
export interface GeneratedQuestion {
  body: string;
  referenceAnswer: string;
  rubric: GeneratedRubricItem[];
  mustMention: string[];
  shouldMention: string[];
  redFlags: string[];
  difficulty: number;
  type: string;
  tags: string[];
}
export interface GeneratePreview {
  questions: GeneratedQuestion[];
  grounded: boolean;
  chunksUsed: number;
  sources: { documentId: number; title: string; headingPath: string | null }[];
  model: string;
  topic: { id: number; name: string; trackId: number };
  warning?: string;
}

export const interviewAdminApi = {
  taxonomy: (): Res<unknown> => api.get('/admin/interview/taxonomy'),
  bankHealth: (): Res<BankHealthRow[]> => api.get('/admin/interview/bank-health'),
  llmUsage: (): Res<LlmUsage> => api.get('/admin/interview/llm-usage'),
  flagged: (): Res<FlaggedTurn[]> => api.get('/admin/interview/flagged'),
  resolveFlag: (turnId: number): Res<{ resolved: boolean }> => api.post(`/admin/interview/flagged/${turnId}/resolve`, {}),
  listQuestions: (params: {
    topicId?: number;
    trackId?: number;
    level?: string;
    status?: string;
    rubricReviewed?: boolean;
    page?: number;
    pageSize?: number;
  } = {}): Res<{ items: AdminQuestion[]; total: number; page: number; pageSize: number }> =>
    api.get('/admin/interview/questions', { params }),
  getQuestion: (id: number): Res<AdminQuestion> => api.get(`/admin/interview/questions/${id}`),
  createQuestion: (body: Partial<AdminQuestion>): Res<AdminQuestion> => api.post('/admin/interview/questions', body),
  updateQuestion: (id: number, body: Partial<AdminQuestion>): Res<AdminQuestion> => api.put(`/admin/interview/questions/${id}`, body),
  deleteQuestion: (id: number): Res<{ deleted: boolean }> => api.delete(`/admin/interview/questions/${id}`),
  createDomain: (body: Record<string, unknown>): Res<unknown> => api.post('/admin/interview/domains', body),
  createTrack: (body: Record<string, unknown>): Res<unknown> => api.post('/admin/interview/tracks', body),
  createTopic: (body: Record<string, unknown>): Res<unknown> => api.post('/admin/interview/topics', body),
  createConcept: (body: Record<string, unknown>): Res<unknown> => api.post('/admin/interview/concepts', body),
  createCompanyProfile: (body: Record<string, unknown>): Res<unknown> => api.post('/admin/interview/company-profiles', body),
  // ── Phase 6: Knowledge base (RAG) ──
  listKnowledge: (params: { topicId?: number; trackId?: number; status?: string; q?: string } = {}): Res<KnowledgeDocListItem[]> =>
    api.get('/admin/interview/knowledge', { params }),
  getKnowledge: (id: number): Res<KnowledgeDocDetail> => api.get(`/admin/interview/knowledge/${id}`),
  createKnowledge: (body: Partial<KnowledgeDocInput>): Res<KnowledgeDocListItem> => api.post('/admin/interview/knowledge', body),
  updateKnowledge: (id: number, body: Partial<KnowledgeDocInput>): Res<KnowledgeDocListItem> => api.put(`/admin/interview/knowledge/${id}`, body),
  deleteKnowledge: (id: number): Res<{ deleted: boolean }> => api.delete(`/admin/interview/knowledge/${id}`),
  knowledgeCoverage: (): Res<KnowledgeCoverageRow[]> => api.get('/admin/interview/knowledge/coverage'),
  knowledgeGaps: (): Res<KnowledgeCoverageRow[]> => api.get('/admin/interview/knowledge/gaps'),
  // ── Phase 7: Prompt templates ──
  listPrompts: (): Res<PromptSummary[]> => api.get('/admin/interview/prompts'),
  promptVersions: (key: string): Res<PromptVersionsResponse> => api.get(`/admin/interview/prompts/${key}/versions`),
  savePrompt: (key: string, content: string, name?: string): Res<PromptVersion> =>
    api.post(`/admin/interview/prompts/${key}`, { content, name }),
  activatePrompt: (key: string, version: number): Res<{ key: string; activeVersion: number }> =>
    api.post(`/admin/interview/prompts/${key}/activate`, { version }),
  resetPrompt: (key: string): Res<{ key: string; usingDefault: boolean }> =>
    api.post(`/admin/interview/prompts/${key}/reset`, {}),
  // ── Phase 8: AI question generation (preview → commit) ──
  generateQuestions: (body: {
    topicId: number;
    level: string;
    count?: number;
    type?: string;
    language?: 'VI' | 'EN';
    useKnowledge?: boolean;
  }): Res<GeneratePreview> => api.post('/admin/interview/generate', body, { timeout: 295_000 }),
  commitQuestions: (body: { topicId: number; level: string; questions: GeneratedQuestion[] }): Res<{ created: number; ids: number[] }> =>
    api.post('/admin/interview/generate/commit', body),
};
