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
  CodeBlock,
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
  ProjectCheck,
  SkillCoverageResponse,
  LabRoom,
  LabRoomSummary,
  LabRoomIntro,
  LabRoomReview,
  LabRoomGuide,
  LabRoomChatTurn,
} from '@/types/code-lab';
import type { DocBlock } from '@/types/exp-hub';

const BASE = '/code-lab';

/**
 * Số dòng code của một bài, đọc từ chính tiêu đề.
 *
 * LAB211 nhét LOC vào tiêu đề đúng dạng `... (37 LOC)` — đo thật trên cả 54
 * bài. Track khác không có, và hàm trả 0 để giao diện tự biết đường ẩn phần
 * LOC đi thay vì bày ra một con số 0 vô nghĩa. Backend có bản sao của phép
 * đọc này (`locCuaBai` trong phongLab.service.ts) và nó mới là bản CHỐT SỐ:
 * phía này chỉ để cộng dồn lúc người dùng đang chọn.
 */
export function locFromTitle(title: string | null | undefined): number {
  const m = /\((\d{1,4})\s*LOC\)/i.exec(title || '');
  return m ? Number(m[1]) : 0;
}

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
  // A full bilingual walkthrough of a whole assignment takes MINUTES on the
  // strongest model, not seconds. The shared client aborts at 30s, so this call
  // carried its own deadline or the browser gave up on work the server went on
  // to finish and cache — an error message on top of a perfectly good answer.
  generateAiExplanation: (exerciseId: number, force = false) =>
    api.post<Ok<{ blocks: DocBlock[]; cached: boolean; generatedAt: string | null }>>(
      `${BASE}/exercises/${exerciseId}/ai/explain`, { force }, { timeout: 900_000 }),
  getSkillCoverage: (trackSlug: string) =>
    api.get<Ok<SkillCoverageResponse>>(`${BASE}/tracks/${trackSlug}/skills`),

  // Practice coach — oral defence and brief compliance. All Pro-gated server side.
  askViva: (exerciseId: number, mode: 'explain' | 'change', asked: string[]) =>
    api.post<Ok<VivaQuestion>>(`${BASE}/exercises/${exerciseId}/coach/viva`,
      { mode, asked }, { timeout: 240_000 }),
  gradeViva: (exerciseId: number, question: string, answer: string, mode: 'explain' | 'change') =>
    api.post<Ok<VivaGrade>>(`${BASE}/exercises/${exerciseId}/coach/grade`,
      { question, answer, mode }, { timeout: 240_000 }),
  checkAgainstBrief: (exerciseId: number, code: string) =>
    api.post<Ok<SpecCheck>>(`${BASE}/exercises/${exerciseId}/coach/check`,
      { code }, { timeout: 300_000 }),
  /** Whole-project review — the zip never lands on disk, server-side or here. */
  checkProjectZip: (exerciseId: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post<Ok<ProjectCheck>>(`${BASE}/exercises/${exerciseId}/coach/check-zip`, fd, { timeout: 420_000 });
  },

  // ─── Workspace ↔ IDE ──────────────────────────────────────────
  exportWorkspace: (exerciseId: number, files: CodeBlock[], name: string) =>
    api.post(`${BASE}/exercises/${exerciseId}/workspace/export`, { files, name }, { responseType: 'blob' }),
  importWorkspace: (exerciseId: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post<Ok<{ files: CodeBlock[]; skipped: number }>>(
      `${BASE}/exercises/${exerciseId}/workspace/import`, fd, { timeout: 120_000 });
  },

  // ─── Phòng Lab ────────────────────────────────────────────────
  // Mọi lời gọi AI ở đây chạy Opus 4.8 qua cổng riêng, nên timeout rộng: một
  // lượt chấm .zip đọc cả project rồi soạn 6-10 câu hỏi vặn, và 30s mặc định
  // của client dùng chung sẽ bỏ dở đúng lúc server đang làm việc có ích.
  labRooms: () => api.get<Ok<LabRoomSummary[]>>(`${BASE}/lab-rooms`),
  createLabRoom: (body: { trackSlug?: string; trackId?: number; exerciseIds: number[]; name?: string; locGoal?: number }) =>
    api.post<Ok<LabRoom>>(`${BASE}/lab-rooms`, body),
  getLabRoom: (id: number) => api.get<Ok<LabRoom>>(`${BASE}/lab-rooms/${id}`),
  updateLabRoom: (id: number, body: { name?: string; locGoal?: number }) =>
    api.patch<Ok<LabRoom>>(`${BASE}/lab-rooms/${id}`, body),
  deleteLabRoom: (id: number) => api.delete(`${BASE}/lab-rooms/${id}`),
  addLabRoomItems: (id: number, exerciseIds: number[]) =>
    api.post<Ok<LabRoom>>(`${BASE}/lab-rooms/${id}/items`, { exerciseIds }),
  removeLabRoomItem: (id: number, itemId: number) =>
    api.delete<Ok<LabRoom>>(`${BASE}/lab-rooms/${id}/items/${itemId}`),
  selectLabRoomItem: (id: number, itemId: number) =>
    api.post<Ok<LabRoom>>(`${BASE}/lab-rooms/${id}/items/${itemId}/select`),

  labRoomIntro: (id: number, itemId: number) =>
    api.get<Ok<LabRoomIntro>>(`${BASE}/lab-rooms/${id}/items/${itemId}/intro`, { timeout: 600_000 }),
  regenLabRoomIntro: (id: number, itemId: number) =>
    api.post<Ok<LabRoomIntro>>(`${BASE}/lab-rooms/${id}/items/${itemId}/intro`, {}, { timeout: 600_000 }),

  labRoomChatHistory: (id: number, itemId: number) =>
    api.get<Ok<LabRoomChatTurn[]>>(`${BASE}/lab-rooms/${id}/items/${itemId}/chat`),
  labRoomAsk: (id: number, itemId: number, question: string) =>
    api.post<Ok<{ answer: string }>>(`${BASE}/lab-rooms/${id}/items/${itemId}/chat`, { question }, { timeout: 600_000 }),
  clearLabRoomChat: (id: number, itemId: number) =>
    api.delete(`${BASE}/lab-rooms/${id}/items/${itemId}/chat`),

  /** Nộp .zip project — file chỉ nằm trong RAM cả hai đầu, không lưu đâu cả. */
  submitLabRoomZip: (id: number, itemId: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post<Ok<{ ketQua: LabRoomReview; phong: LabRoom }>>(
      `${BASE}/lab-rooms/${id}/items/${itemId}/submit`, fd, { timeout: 900_000 });
  },

  /** Kết quả chấm đã lưu — đọc lại thì KHÔNG gọi AI, nên không có timeout rộng. */
  labRoomLastReview: (id: number, itemId: number) =>
    api.get<Ok<LabRoomReview | null>>(`${BASE}/lab-rooms/${id}/items/${itemId}/review`),

  labRoomGuide: (id: number, itemId: number) =>
    api.get<Ok<LabRoomGuide>>(`${BASE}/lab-rooms/${id}/items/${itemId}/guide`, { timeout: 600_000 }),
  regenLabRoomGuide: (id: number, itemId: number) =>
    api.post<Ok<LabRoomGuide>>(`${BASE}/lab-rooms/${id}/items/${itemId}/guide`, {}, { timeout: 600_000 }),

  askAiFollowUp: (exerciseId: number, question: string,
                  history: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    api.post<Ok<{ answer: string }>>(`${BASE}/exercises/${exerciseId}/ai/ask`,
      { question, history }, { timeout: 240_000 }),

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
