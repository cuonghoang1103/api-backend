/**
 * CV Builder — API client.
 * Axios group over /api/v1/cv (user) and /api/v1/admin/cv (admin). Auth is the
 * shared cookie + 401-refresh interceptor in ./api. Callers unwrap res.data.data.
 */
import { api } from './api';
import type { ApiResponse } from '@/types';
import type {
  CvProfile, CvProfilePatch, CvCompleteness,
  CvItem, CvItemInput, CvBullet, CvBulletInput,
  CvSkill, CvSkillInput, CvCertification, CvCertInput,
  CvLanguageSkill, CvLangInput,
  CvImportJob, CvImportCommitBody, CvLintResult, CvCritiqueResult,
  CvJobSummary, CvCoverage, CvTailor, GhCandidate,
  CvDocumentSummary, CvDocumentDetail, CvDocumentPatch,
} from '@/types/cv';

type Res<T> = Promise<{ data: ApiResponse<T> }>;

export const cvApi = {
  // ── Master profile ──────────────────────────────────────────
  getProfile: (): Res<CvProfile> => api.get('/cv/profile'),
  updateProfile: (body: CvProfilePatch): Res<CvProfile> => api.put('/cv/profile', body),
  completeness: (): Res<CvCompleteness> => api.get('/cv/profile/completeness'),
  uploadPhoto: (file: File): Res<{ photoUrl: string }> => {
    const fd = new FormData();
    fd.append('photo', file);
    return api.post('/cv/profile/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 });
  },
  removePhoto: (): Res<{ photoUrl: null }> => api.delete('/cv/profile/photo'),

  // ── Items (experience / project / education / …) ────────────
  createItem: (body: CvItemInput): Res<CvItem> => api.post('/cv/items', body),
  updateItem: (id: number, body: CvItemInput): Res<CvItem> => api.put(`/cv/items/${id}`, body),
  deleteItem: (id: number): Res<{ id: number }> => api.delete(`/cv/items/${id}`),

  // ── Bullets ─────────────────────────────────────────────────
  createBullet: (itemId: number, body: CvBulletInput): Res<CvBullet> => api.post(`/cv/items/${itemId}/bullets`, body),
  updateBullet: (id: number, body: CvBulletInput): Res<CvBullet> => api.put(`/cv/bullets/${id}`, body),
  verifyBullet: (id: number, verified: boolean): Res<CvBullet> => api.post(`/cv/bullets/${id}/verify`, { verified }),
  deleteBullet: (id: number): Res<{ id: number }> => api.delete(`/cv/bullets/${id}`),

  // ── Skills ──────────────────────────────────────────────────
  createSkill: (body: CvSkillInput): Res<CvSkill> => api.post('/cv/skills', body),
  updateSkill: (id: number, body: CvSkillInput): Res<CvSkill> => api.put(`/cv/skills/${id}`, body),
  deleteSkill: (id: number): Res<{ id: number }> => api.delete(`/cv/skills/${id}`),

  // ── Certifications ──────────────────────────────────────────
  createCert: (body: CvCertInput): Res<CvCertification> => api.post('/cv/certifications', body),
  updateCert: (id: number, body: CvCertInput): Res<CvCertification> => api.put(`/cv/certifications/${id}`, body),
  deleteCert: (id: number): Res<{ id: number }> => api.delete(`/cv/certifications/${id}`),

  // ── Language skills ─────────────────────────────────────────
  createLang: (body: CvLangInput): Res<CvLanguageSkill> => api.post('/cv/languages', body),
  updateLang: (id: number, body: CvLangInput): Res<CvLanguageSkill> => api.put(`/cv/languages/${id}`, body),
  deleteLang: (id: number): Res<{ id: number }> => api.delete(`/cv/languages/${id}`),

  // ── Import (Phase 2a: paste + JSON Resume) ──────────────────
  listImports: (): Res<CvImportJob[]> => api.get('/cv/import'),
  importPaste: (text: string): Res<CvImportJob> => api.post('/cv/import/paste', { text }),
  importUpload: (file: File): Res<CvImportJob> => {
    const fd = new FormData();
    fd.append('file', file);
    // PDF text extraction can take a few seconds on big/complex files.
    return api.post('/cv/import/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60_000 });
  },
  importJsonResume: (resume: unknown): Res<CvImportJob> => api.post('/cv/import/json-resume', { resume }),

  // ── GitHub import (Phase 2c) — public repos by username ─────
  githubGet: (): Res<{ username: string; candidates: GhCandidate[]; languageProfile: Record<string, number>; lastSyncedAt: string } | null> => api.get('/cv/import/github'),
  githubSync: (username: string): Res<{ username: string; candidates: GhCandidate[]; languageProfile: Record<string, number> }> =>
    api.post('/cv/import/github/sync', { username }, { timeout: 40_000 }),
  githubAdd: (repo: GhCandidate): Res<{ id: number }> => api.post('/cv/import/github/add', repo),
  getImport: (id: number): Res<CvImportJob> => api.get(`/cv/import/${id}`),
  commitImport: (id: number, body: CvImportCommitBody): Res<{ committed: boolean; counts: Record<string, number> }> =>
    api.post(`/cv/import/${id}/commit`, body),

  // ── Tailored documents (Phase 11.2) ────────────────────────
  listDocs: (): Res<CvDocumentSummary[]> => api.get('/cv/documents'),
  createDoc: (body: CvDocumentPatch): Res<CvDocumentDetail> => api.post('/cv/documents', body),
  getDoc: (id: number): Res<CvDocumentDetail> => api.get(`/cv/documents/${id}`),
  updateDoc: (id: number, body: CvDocumentPatch): Res<CvDocumentDetail> => api.put(`/cv/documents/${id}`, body),
  deleteDoc: (id: number): Res<{ id: number }> => api.delete(`/cv/documents/${id}`),
  duplicateDoc: (id: number): Res<CvDocumentDetail> => api.post(`/cv/documents/${id}/duplicate`, {}),
  lintDoc: (id: number): Res<CvLintResult & { documentId: number }> => api.post(`/cv/documents/${id}/lint`, {}),
  exportDoc: (id: number, format: 'pdf' | 'docx' | 'txt' | 'md' | 'json') =>
    api.get(`/cv/documents/${id}/export/${format}`, { responseType: 'blob', timeout: 120_000 }),

  // ── AI rewrite per bullet (W2) — one proposal, accept/reject ──
  rewriteStatus: (): Res<{ available: boolean; needPro?: boolean }> => api.get('/cv/rewrite/status'),
  rewriteBullet: (bulletId: number): Res<{ suggestionId: number; bulletId: number; original: string; proposed: string; rationale: string; needsUserInput: boolean; clarifyingQuestion: string | null }> =>
    api.post(`/cv/bullets/${bulletId}/rewrite`, {}, { timeout: 60_000 }),
  decideSuggestion: (suggestionId: number, accepted: boolean, editedText?: string): Res<{ suggestionId: number; accepted: boolean }> =>
    api.post(`/cv/suggestions/${suggestionId}/decide`, { accepted, editedText }),

  // ── Analysis (Phase 3: STATIC rules engine — free) ──────────
  lint: (body?: { market?: string; level?: string }): Res<CvLintResult> => api.post('/cv/lint', body ?? {}),

  // ── AI Critique (Phase 7) — quota-gated, may take ~15–30s ───
  critiqueStatus: (): Res<{ available: boolean; needPro?: boolean }> => api.get('/cv/critique/status'),
  critique: (): Res<CvCritiqueResult> => api.post('/cv/critique', {}, { timeout: 90_000 }),

  // ── Job targeting (Phase 8a) — deterministic, free ──────────
  listJobs: (): Res<CvJobSummary[]> => api.get('/cv/jobs'),
  createJob: (body: { title: string; company?: string | null; sourceUrl?: string | null; rawJobDescription: string }): Res<{ id: number }> => api.post('/cv/jobs', body),
  jobCoverage: (id: number): Res<CvCoverage> => api.get(`/cv/jobs/${id}/coverage`),
  jobTailor: (id: number): Res<CvTailor> => api.get(`/cv/jobs/${id}/tailor`),
  deleteJob: (id: number): Res<{ id: number }> => api.delete(`/cv/jobs/${id}`),

  // ── Intake Mode (Phase 8c) — AI debrief conversation ────────
  intakeStatus: (): Res<{ available: boolean; needPro?: boolean }> => api.get('/cv/intake/status'),
  intakeTurn: (messages: { role: 'user' | 'assistant'; content: string }[]): Res<{ reply: string; draftBullets: { text: string; userStatedFacts: string }[]; done: boolean }> =>
    api.post('/cv/intake', { messages }, { timeout: 90_000 }),

  // ── Cover letter (Phase 8b) — AI ────────────────────────────
  coverLetterStatus: (): Res<{ available: boolean; needPro?: boolean }> => api.get('/cv/cover-letter/status'),
  coverLetter: (jobId: number, tone: string): Res<{ body: string; tone: string; wordCount: number }> =>
    api.post(`/cv/jobs/${jobId}/cover-letter`, { tone }, { timeout: 90_000 }),

  // ── Export (Phase 4/11) — binary download with template/lang/market opts. ──
  cvTemplates: (): Res<{ id: string; name: string; description: string; bestFor: string }[]> => api.get('/cv/templates'),
  exportCv: (format: 'pdf' | 'docx' | 'txt' | 'md' | 'json', opts?: { template?: string; language?: string; market?: string }) => {
    const q = new URLSearchParams();
    if (opts?.template) q.set('template', opts.template);
    if (opts?.language) q.set('language', opts.language);
    if (opts?.market) q.set('market', opts.market);
    const qs = q.toString();
    // Translation adds an LLM round-trip → allow more time.
    return api.get(`/cv/export/${format}${qs ? '?' + qs : ''}`, { responseType: 'blob', timeout: opts?.language ? 120_000 : 60_000 });
  },
};

// ── Admin (Phase 10) — anonymized aggregates + LLM cost dashboard ──────────
export interface CvAdminUsage {
  forceStatic: boolean;
  providers: { name: string; hasKey: boolean; trainsOnInput: boolean; circuitOpen: boolean }[];
  totalCalls: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  byTask: { task: string; provider: string; model: string; success: boolean; calls: number; inputTokens: number; outputTokens: number; costUsd: number }[];
}
export interface CvRuleOverrides { strongVerbs: string[]; weakVerbs: string[]; bannedOpeners: string[]; buzzwords: string[] }
export const cvAdminApi = {
  overview: (): Res<Record<string, number>> => api.get('/admin/cv/overview'),
  usage: (): Res<CvAdminUsage> => api.get('/admin/cv/usage'),
  getRules: (): Res<CvRuleOverrides> => api.get('/admin/cv/rules'),
  setRules: (body: CvRuleOverrides): Res<CvRuleOverrides> => api.put('/admin/cv/rules', body),
  analytics: (): Res<{
    importsBySource: { source: string; status: string; count: number }[];
    bulletStrength: { strength: string; count: number }[];
    injectionAttempts: number;
    verifiedBullets: number;
    aiBullets: number;
  }> => api.get('/admin/cv/analytics'),
};

