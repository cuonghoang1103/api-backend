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
  createSession: (body: CreateSessionBody): Res<SessionCreateResponse> => api.post('/interview/sessions', body),
  getSession: (id: number): Res<SessionState> => api.get(`/interview/sessions/${id}`),
  answer: (
    id: number,
    order: number,
    body: { answer?: string; selectedOptionId?: string; timeSpentMs?: number; integritySignals?: IntegritySignals },
    // AI grading (HYBRID/FULL_AI) runs server-side on this call and can take
    // ~10-25s via the LLM gateway — override the default 30s axios timeout so a
    // long/detailed answer doesn't spuriously fail before the grade returns.
  ): Res<SubmitAnswerResponse> => api.post(`/interview/sessions/${id}/turns/${order}/answer`, body, { timeout: 90_000 }),
  selfAssess: (id: number, order: number, ratings: Record<string, number>): Res<SelfAssessResponse> =>
    api.post(`/interview/sessions/${id}/turns/${order}/self-assess`, { ratings }),
  finish: (id: number): Res<InterviewReport> => api.post(`/interview/sessions/${id}/finish`, {}),
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
};
