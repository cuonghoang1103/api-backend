/**
 * Code Lab — API client. Thin wrapper over the shared axios `api` instance.
 * Mirrors exp-hub-api.ts. Base path: /api/v1/code-lab.
 */
import { api } from './api';
import type {
  CodeGroup,
  CodeTrack,
  CodeExercise,
  CodeExerciseListItem,
  CodeProgress,
  MyProgressItem,
  CodeStats,
  CodeLevel,
  CodeDifficulty,
  CodeStatus,
  RoadmapModuleProposal,
  ExerciseProposal,
  CodeLesson,
  VivaQuestion,
  VivaGrade,
  SpecCheck,
  SkillCoverageResponse,
} from '@/types/code-lab';
import type { DocBlock } from '@/types/exp-hub';

const BASE = '/code-lab';

interface Ok<T> { success: boolean; data: T }
interface Paginated<T> { exercises: T[]; total: number; page: number; limit: number; totalPages: number }

// ─── Public reads ───────────────────────────────────────────────
export const codeLabApi = {
  getGroups: () => api.get<Ok<CodeGroup[]>>(`${BASE}/groups`),
  getTrack: (slug: string) => api.get<Ok<CodeTrack>>(`${BASE}/tracks/${slug}`),
  getExercise: (slug: string) => api.get<Ok<CodeExercise>>(`${BASE}/exercises/${slug}`),
  // NTU-style module lesson (fetched on demand; empty blocks when none).
  getLesson: (moduleId: number) => api.get<Ok<CodeLesson>>(`${BASE}/modules/${moduleId}/lesson`),
  getStats: () => api.get<Ok<CodeStats>>(`${BASE}/stats`),

  // AI explanation of one exercise. Reading a cached one is free; generating it
  // and asking follow-ups is Pro-gated on the server.
  readAiExplanation: (exerciseId: number) =>
    api.get<Ok<{ blocks: DocBlock[]; cached: boolean; generatedAt: string | null }>>(
      `${BASE}/exercises/${exerciseId}/ai/explain`),
  generateAiExplanation: (exerciseId: number, force = false) =>
    api.post<Ok<{ blocks: DocBlock[]; cached: boolean; generatedAt: string | null }>>(
      `${BASE}/exercises/${exerciseId}/ai/explain`, { force }),
  getSkillCoverage: (trackSlug: string) =>
    api.get<Ok<SkillCoverageResponse>>(`${BASE}/tracks/${trackSlug}/skills`),

  // Practice coach — oral defence and brief compliance. All Pro-gated server side.
  askViva: (exerciseId: number, mode: 'explain' | 'change', asked: string[]) =>
    api.post<Ok<VivaQuestion>>(`${BASE}/exercises/${exerciseId}/coach/viva`, { mode, asked }),
  gradeViva: (exerciseId: number, question: string, answer: string, mode: 'explain' | 'change') =>
    api.post<Ok<VivaGrade>>(`${BASE}/exercises/${exerciseId}/coach/grade`, { question, answer, mode }),
  checkAgainstBrief: (exerciseId: number, code: string) =>
    api.post<Ok<SpecCheck>>(`${BASE}/exercises/${exerciseId}/coach/check`, { code }),

  askAiFollowUp: (exerciseId: number, question: string,
                  history: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    api.post<Ok<{ answer: string }>>(`${BASE}/exercises/${exerciseId}/ai/ask`, { question, history }),

  listExercises: (params: {
    trackId?: number; moduleId?: number; groupId?: number; language?: string;
    difficulty?: CodeDifficulty; q?: string; sort?: string; page?: number; limit?: number;
  }) => api.get<Ok<Paginated<CodeExerciseListItem>>>(`${BASE}/exercises`, { params }),

  search: (params: { q: string; trackId?: number; groupId?: number; language?: string; difficulty?: CodeDifficulty; page?: number; limit?: number }) =>
    api.get<Ok<Paginated<CodeExercise>>>(`${BASE}/search`, { params }),

  autocomplete: (q: string, limit = 8) =>
    api.get<Ok<{ tracks: Array<Pick<CodeTrack, 'id' | 'name' | 'slug' | 'language' | 'color'>>; exercises: Array<Pick<CodeExercise, 'id' | 'title' | 'slug' | 'difficulty' | 'language'> & { track?: { slug: string } }> }>>(
      `${BASE}/autocomplete`, { params: { q, limit } }),

  // ─── Progress (auth) ──────────────────────────────────────────
  saveProgress: (exerciseId: number, body: { status?: 'IN_PROGRESS' | 'SOLVED'; savedCode?: unknown }) =>
    api.post<Ok<CodeProgress>>(`${BASE}/exercises/${exerciseId}/progress`, body),
  myProgress: (trackId?: number) =>
    api.get<Ok<MyProgressItem[]>>(`${BASE}/progress/mine`, { params: trackId ? { trackId } : {} }),
};

// ─── Admin / editor ─────────────────────────────────────────────
export const codeLabAdminApi = {
  // Groups
  createGroup: (data: Partial<CodeGroup>) => api.post<Ok<CodeGroup>>(`${BASE}/groups`, data),
  updateGroup: (id: number, data: Partial<CodeGroup>) => api.put<Ok<CodeGroup>>(`${BASE}/groups/${id}`, data),
  deleteGroup: (id: number) => api.delete(`${BASE}/groups/${id}`),
  // Tracks
  createTrack: (data: Partial<CodeTrack> & { groupId: number; name: string; language: string }) =>
    api.post<Ok<CodeTrack>>(`${BASE}/tracks`, data),
  updateTrack: (id: number, data: Partial<CodeTrack>) => api.put<Ok<CodeTrack>>(`${BASE}/tracks/${id}`, data),
  deleteTrack: (id: number) => api.delete(`${BASE}/tracks/${id}`),
  // Modules
  createModule: (data: { trackId: number; name: string; description?: string | null; level?: CodeLevel; sortOrder?: number }) =>
    api.post(`${BASE}/modules`, data),
  updateModule: (id: number, data: { name?: string; description?: string | null; level?: CodeLevel; sortOrder?: number }) =>
    api.put(`${BASE}/modules/${id}`, data),
  deleteModule: (id: number) => api.delete(`${BASE}/modules/${id}`),
  // Exercises
  getExerciseAdmin: (id: number) => api.get<Ok<CodeExercise>>(`${BASE}/admin/exercises/${id}`),
  createExercise: (data: Record<string, unknown>) => api.post<Ok<CodeExercise>>(`${BASE}/exercises`, data),
  updateExercise: (id: number, data: Record<string, unknown>) => api.put<Ok<CodeExercise>>(`${BASE}/exercises/${id}`, data),
  deleteExercise: (id: number) => api.delete(`${BASE}/exercises/${id}`),
  bulkImport: (exercises: unknown[], defaultModuleId?: number) =>
    api.post(`${BASE}/bulk-import`, { exercises, defaultModuleId }),
  // AI
  aiRoadmap: (body: { trackId: number; moduleCount?: number; titlesPerModule?: number }) =>
    api.post<Ok<{ trackId: number; trackName: string; modules: RoadmapModuleProposal[]; model: string }>>(`${BASE}/admin/ai/roadmap`, body),
  aiGenerateExercises: (body: { moduleId: number; count?: number; difficulty?: CodeDifficulty; topic?: string; titles?: string[] }) =>
    api.post<Ok<{ moduleId: number; moduleName: string; trackName: string; language: string; exercises: ExerciseProposal[]; model: string }>>(`${BASE}/admin/ai/exercises/generate`, body),
  aiCommitExercises: (body: { moduleId: number; exercises: ExerciseProposal[] }) =>
    api.post<Ok<{ moduleId: number; created: number; ids: number[] }>>(`${BASE}/admin/ai/exercises/commit`, body),
  // NTU-style module lesson
  aiGenerateLesson: (body: { moduleId: number }) =>
    api.post<Ok<{ moduleId: number; moduleName: string; blocks: DocBlock[]; model: string }>>(`${BASE}/admin/ai/lesson/generate`, body),
  aiCommitLesson: (body: { moduleId: number; blocks: DocBlock[]; model?: string }) =>
    api.post<Ok<{ moduleId: number; blocks: number }>>(`${BASE}/admin/ai/lesson/commit`, body),
  clearLesson: (moduleId: number) => api.delete(`${BASE}/modules/${moduleId}/lesson`),
};

// ─── Shared UI constants ────────────────────────────────────────
export const DIFFICULTY_META: Record<CodeDifficulty, { label: string; color: string; bg: string }> = {
  EASY: { label: 'Easy', color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
  MEDIUM: { label: 'Medium', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
  HARD: { label: 'Hard', color: '#dc2626', bg: 'rgba(220,38,38,0.12)' },
  EXPERT: { label: 'Expert', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
};

export const LEVEL_META: Record<CodeLevel, { label: string; order: number }> = {
  BEGINNER: { label: 'Beginner', order: 0 },
  INTERMEDIATE: { label: 'Intermediate', order: 1 },
  ADVANCED: { label: 'Advanced', order: 2 },
};

export type { CodeStatus };
