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
} from '@/types/code-lab';

const BASE = '/code-lab';

interface Ok<T> { success: boolean; data: T }
interface Paginated<T> { exercises: T[]; total: number; page: number; limit: number; totalPages: number }

// ─── Public reads ───────────────────────────────────────────────
export const codeLabApi = {
  getGroups: () => api.get<Ok<CodeGroup[]>>(`${BASE}/groups`),
  getTrack: (slug: string) => api.get<Ok<CodeTrack>>(`${BASE}/tracks/${slug}`),
  getExercise: (slug: string) => api.get<Ok<CodeExercise>>(`${BASE}/exercises/${slug}`),
  getStats: () => api.get<Ok<CodeStats>>(`${BASE}/stats`),

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
