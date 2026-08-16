import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { ApiResponse, AuthResponse, NoteFull } from '@/types';
import type { ReactionType, ReactionBreakdown } from '@/types/social';

const DEFAULT_UPLOAD_CATEGORY = 'images';

export type ApiError = AxiosError<ApiResponse<unknown>> & {
  userFriendlyMessage?: string;
};

export function getFriendlyErrorMessage(error: ApiError): string {
  if (error.response) {
    const status = error.response.status;
    const rawMsg = error.response.data?.message?.toLowerCase() ?? '';

    if (status === 401) {
      if (rawMsg.includes('bad') || rawMsg.includes('invalid') || rawMsg.includes('credentials')) {
        return 'Incorrect username or password. Please try again.';
      }
      if (rawMsg.includes('not found') || rawMsg.includes('user not found')) {
        return 'Account not found. Please check your username.';
      }
      if (rawMsg.includes('locked') || rawMsg.includes('disabled') || rawMsg.includes('banned')) {
        return 'Your account has been locked. Please contact support.';
      }
      return 'Authentication failed. Please log in again.';
    }

    if (status === 400) {
      if (rawMsg.includes('bad') || rawMsg.includes('invalid') || rawMsg.includes('credentials')) {
        return 'Incorrect username or password. Please try again.';
      }
      if (rawMsg.includes('not found') || rawMsg.includes('user not found')) {
        return 'Account not found. Please check your username.';
      }
      if (rawMsg.includes('locked') || rawMsg.includes('disabled')) {
        return 'Your account has been locked. Please contact support.';
      }
      if (rawMsg.includes('exists') || rawMsg.includes('already')) {
        return 'This record already exists. Please use a different value.';
      }
      const msg = error.response.data?.message;
      if (msg) return msg;
    }

    if (status === 403) return 'Access denied. You do not have permission.';
    if (status === 404) return 'Resource not found.';
    if (status === 409 || rawMsg.includes('already') || rawMsg.includes('exists')) {
      return 'This record already exists. Please use a different value.';
    }
    if (status === 422) return 'Invalid data. Please check your input.';
    if (status === 429) return 'Too many requests. Please wait a moment.';
    if (status >= 500) return 'Server error. Please try again later.';
  }

  // Backend-specific error codes
  if (error.response?.data?.code) {
    const code = error.response.data.code;
    if (code === 'ACCOUNT_LOCKED') {
      return 'Tài khoản bị tạm khoá do nhập sai mật khẩu nhiều lần. Vui lòng đợi 15 phút hoặc đặt lại mật khẩu.';
    }
    if (code === 'EMAIL_NOT_VERIFIED') {
      return 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư và click link xác thực.';
    }
    if (code === 'WEAK_PASSWORD') {
      return 'Mật khẩu chưa đủ mạnh. Yêu cầu: tối thiểu 12 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.';
    }
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please check your connection.';
  }
  return 'Something went wrong. Please try again.';
}

/**
 * All API calls go through the /api/v1 proxy route which:
 * 1. Reads the backend_token cookie server-side
 * 2. Forwards the request to the backend with Bearer auth when available
 * This avoids CORS issues and keeps auth secure.
 */
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * ⚠️⚠️ FORMDATA PHẢI ĐƯỢC GỠ `Content-Type`, NẾU KHÔNG FILE BIẾN MẤT.
 *
 * Instance ở trên đặt cứng `Content-Type: application/json`. Với axios
 * 1.x, khi Content-Type là JSON **và** dữ liệu là `FormData`, hàm
 * `transformRequest` làm đúng một việc chết người:
 *
 *     return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
 *                                              ^^^^^^^^^^^^^^^^^^^^^
 *
 * File nhị phân bị serialize thành `{}` — nó biến mất TRƯỚC KHI rời trình
 * duyệt. Server nhận một thân JSON không có file, multer bóc ra rỗng, và
 * lỗi báo về là "không có dữ liệu" — nghe như người dùng chưa chọn file,
 * trong khi họ chọn rồi. Không có dòng log nào ở giữa để lần ra.
 *
 * Dự án này đã bị đúng bẫy đó BA LẦN: nhân bản giọng ở `voice-mini-api`
 * (có ghi chú tại chỗ), nút tải firmware OTA ở `maker-lab-api`, và xưởng
 * giọng 14/08/2026. Cách chữa cũ là mỗi chỗ tự nhớ ghi đè
 * `'Content-Type': 'multipart/form-data'` — mà "mỗi chỗ tự nhớ" chính là
 * thứ đã hỏng ba lần.
 *
 * Nên chữa ở ĐÂY, một lần: hễ thân là FormData thì gỡ hẳn Content-Type.
 * Bộ chuyển tiếp thấy không phải JSON nên để nguyên FormData, rồi trình
 * duyệt tự đặt `multipart/form-data; boundary=…` — thứ chỉ nó mới sinh
 * đúng được, vì `boundary` phải khớp với thân nó vừa dựng.
 *
 * Interceptor chạy TRƯỚC `transformRequest`, nên gỡ ở đây là kịp.
 */
api.interceptors.request.use((config) => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    // `config.headers` là AxiosHeaders ở axios 1.x, nhưng có thể là object
    // thuần nếu chỗ gọi tự dựng — xử lý cả hai, vì đoán sai kiểu ở đây là
    // im lặng không gỡ được gì.
    const h = config.headers as unknown as {
      delete?: (k: string) => void;
      setContentType?: (v: unknown) => void;
    } & Record<string, unknown>;
    if (typeof h?.delete === 'function') h.delete('Content-Type');
    else if (h) {
      delete h['Content-Type'];
      delete h['content-type'];
    }
  }
  return config;
});

// ─── Silent session refresh ──────────────────────────────────
// The backend_token cookie lives 7 days but each JWT only lasts ~24h.
// Without a refresh, every authenticated call started 401-ing after a
// day even though the cookie was present — the session "died silently"
// and GIF/messenger/etc. broke until a manual re-login. Here, the first
// 401 on a normal request triggers ONE refresh (POST /api/auth/refresh,
// a Next.js route that re-issues + re-sets the cookie) and then retries
// the original request. Concurrent 401s share a single in-flight
// refresh. Auth endpoints are skipped so we never loop on a real logout.
let refreshInFlight: Promise<boolean> | null = null;
function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

api.interceptors.response.use(
  (response) => response,
  async (error: ApiError) => {
    error.userFriendlyMessage = getFriendlyErrorMessage(error);

    const original = error.config as (typeof error.config & { _retried?: boolean }) | undefined;
    const url = String(original?.url ?? '');
    // Auto-heal an expired session ONCE, then replay the request. Skip
    // /auth/* so a genuinely-invalid login/refresh doesn't loop.
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !url.includes('/auth/')
    ) {
      original._retried = true;
      const ok = await refreshSession();
      if (ok) return api(original);
    }
    return Promise.reject(error);
  }
);

export { api };

// Auth API
export const authApi = {
  /**
   * Fetch the public CAPTCHA configuration. Returns:
   *   { enabled: boolean, siteKey: string | null, provider: string }
   *
   * Frontend uses this to decide whether to render the Turnstile widget
   * and which site key to pass it. The secret key never leaves the
   * backend. The endpoint is cheap and cached by the client.
   */
  getCaptchaConfig: () =>
    api
      .get<ApiResponse<{ enabled: boolean; siteKey: string | null; provider: string }>>(
        '/auth/captcha-config',
      )
      .then((res) => res.data.data),

  /**
   * Login. Sends the Turnstile token in the body as `cf-turnstile-response`,
   * which is the convention the backend's captchaMiddleware reads.
   */
  login: (data: { username: string; password: string; captchaToken?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', {
      username: data.username,
      password: data.password,
      'cf-turnstile-response': data.captchaToken,
    }),

  /**
   * Register a new user. Sends the Turnstile token alongside credentials.
   */
  register: (data: {
    username: string;
    password: string;
    email: string;
    fullName?: string;
    captchaToken?: string;
  }) =>
    api.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      'cf-turnstile-response': data.captchaToken,
    }),

  getProfile: () => api.get('/profile'),

  // Extended profile update — accepts all Phase 1 fields. The
  // backend's authService.updateProfile validates each field and
  // throws AppError(400) with a code (e.g. INVALID_GENDER) so the
  // frontend can render a field-level error.
  updateProfile: (data: {
    fullName?: string;
    email?: string;
    bio?: string;
    avatarUrl?: string;
    displayName?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
    birthYear?: number | null;
    phone?: string | null;
    socialLinks?: Record<string, string> | null;
    /** Privacy switch enforced in messages.service.ts. The backend has
     *  always accepted it on PUT /profile; it was just missing from this
     *  type, so nothing could set it without a cast. */
    allowMessagesFromStrangers?: boolean;
  }) => api.put('/profile', data),

  // Data-subject rights (Nghị định 13/2023).
  exportData: () => api.get('/profile/export-data'),

  // ─── Account erasure — admin-reviewed since 2026-08-08 ───
  // These do NOT delete anything. They file / read / withdraw a request;
  // an admin approving it in /admin/deletion-requests is what actually
  // anonymises the account.
  getDeletionRequest: () =>
    api.get<{ success: true; data: { request: AccountDeletionRequest | null } }>(
      '/profile/deletion-request',
    ),
  requestDeletion: (reason?: string) =>
    api.post<{ success: true; data: { request: AccountDeletionRequest; created: boolean } }>(
      '/profile/deletion-request',
      { reason },
    ),
  cancelDeletionRequest: () =>
    api.delete<{ success: true; data: { request: AccountDeletionRequest } }>(
      '/profile/deletion-request',
    ),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post('/auth/change-password', data),

  // ─── Forgot password — OTP flow ───
  forgotPassword: (email: string, captchaToken?: string) =>
    api.post('/auth/forgot-password', { email, 'cf-turnstile-response': captchaToken }),

  resetPasswordOtp: (data: {
    email: string;
    code: string;
    newPassword: string;
  }) => api.post('/auth/reset-password-otp', data),

  // Legacy token-link (kept for backward compat)
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),

  // ─── Verify email — OTP flow (preferred) ───
  verifyEmailOtp: (email: string, code: string) =>
    api.post('/auth/verify-email-otp', { email, code }),

  resendOtp: (email: string) =>
    api.post('/auth/resend-otp', { email }),

  // Legacy token-link
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),

  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
};

// File Upload API
export const fileApi = {
  upload: (file: File, category: string = DEFAULT_UPLOAD_CATEGORY) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/files/${id}`),

  /**
   * Large-video path: PUT the file DIRECTLY to R2 via a presigned URL, then
   * confirm with the API (which verifies the object + extracts the poster).
   * Bypasses the Cloudflare proxy's 100MB request-body cap. Resolves to the
   * same `{ data: { data: { url, thumbnail, ... } } }` shape as `upload`.
   * Throws with code PRESIGN_UNAVAILABLE on non-R2 backends — callers should
   * fall back to `upload`.
   */
  uploadVideoDirect: async (file: File, onProgress?: (pct: number) => void) => {
    const presign = await api.post('/files/upload/presign-r2', {
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });
    const { uploadUrl, key } = presign.data?.data ?? {};
    if (!uploadUrl || !key) throw new Error('Presign response missing uploadUrl/key');

    // Raw PUT to R2 — NOT through the api axios instance (no auth header,
    // different origin). XHR for upload progress.
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 90));
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`R2 PUT failed (${xhr.status})`));
      xhr.onerror = () => reject(new Error('R2 PUT network error (check bucket CORS)'));
      xhr.send(file);
    });

    onProgress?.(95);
    return api.post('/files/upload/presign-r2/complete', { key, originalName: file.name });
  },
};

// Notes API — personal study notebooks (per-user, authenticated).
// Mirrors the envelope convention: every call resolves to
// `{ data: <payload> }`; callers read `res.data.data`.
// ─── RoadMap (Role/Skill learning paths) ────────────────────────────
export interface ResourceItemT { type: string; title: string; url: string; premium?: boolean }
export interface RoadmapNodeT {
  id: number; stage: number; stageLabel: string; order: number; side: string; kind: string;
  title: string; subtitle: string | null; icon: string | null; description: string | null;
  linkType: string | null; linkRef: string | null; resources: ResourceItemT[] | null;
}
export interface RoadmapStageT { stage: number; stageLabel: string; nodes: RoadmapNodeT[]; }
export interface RoadmapListItemT {
  slug: string; title: string; type: string; description: string | null;
  icon: string | null; color: string | null; nodeCount: number;
}
export interface RoadmapDetailT {
  slug: string; title: string; type: string; description: string | null; icon: string | null; color: string | null;
  stages: RoadmapStageT[]; doneNodeIds: number[]; total: number;
}

export const roadmapApi = {
  list: () => api.get<{ data: { role: RoadmapListItemT[]; skill: RoadmapListItemT[] } }>('/roadmaps'),
  get: (slug: string) => api.get<{ data: RoadmapDetailT }>(`/roadmaps/${slug}`),
  toggleDone: (nodeId: number) => api.post<{ data: { nodeId: number; done: boolean } }>(`/roadmaps/nodes/${nodeId}/done`),
};

export const notesApi = {
  // Tree (sidebar) + recent rail
  getTree: () =>
    api.get<{ data: import('@/types').NotesTreeResponse }>('/notes/tree'),

  // Subjects
  createSubject: (data: { name: string; color?: string | null; emoji?: string | null; description?: string | null; sortOrder?: number }) =>
    api.post<{ data: import('@/types').NoteSubjectTree }>('/notes/subjects', data),
  updateSubject: (id: number, data: Partial<{ name: string; color: string | null; emoji: string | null; description: string | null; sortOrder: number; isPinned: boolean }>) =>
    api.patch<{ data: import('@/types').NoteSubjectTree }>(`/notes/subjects/${id}`, data),
  deleteSubject: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/subjects/${id}`),
  reorderSubjects: (orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>('/notes/subjects/reorder', { orderedIds }),

  // Chapters
  createChapter: (data: { subjectId: number; title: string; sortOrder?: number }) =>
    api.post<{ data: import('@/types').NoteChapterTree }>('/notes/chapters', data),
  updateChapter: (id: number, data: Partial<{ title: string; sortOrder: number; isPinned: boolean }>) =>
    api.patch<{ data: import('@/types').NoteChapterTree }>(`/notes/chapters/${id}`, data),
  deleteChapter: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/chapters/${id}`),
  reorderChapters: (subjectId: number, orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>('/notes/chapters/reorder', { subjectId, orderedIds }),

  // Notes
  createNote: (data: { subjectId: number; chapterId?: number | null; title?: string }) =>
    api.post<{ data: import('@/types').NoteFull }>('/notes/notes', data),
  duplicateNote: (id: number) =>
    api.post<{ data: import('@/types').NoteFull }>(`/notes/notes/${id}/duplicate`),
  getNote: (id: number) =>
    api.get<{ data: import('@/types').NoteFull }>(`/notes/notes/${id}`),
  updateNote: (id: number, data: Partial<{
    title: string;
    contentJson: Record<string, unknown> | null;
    contentHtml: string | null;
    tags: string[];
    isPinned: boolean;
    isFavorite: boolean;
    isArchived: boolean;
    needsReview: boolean;
    reviewDate: string | null;
    sortOrder: number;
    subjectId: number;
    chapterId: number | null;
  }>) =>
    api.patch<{ data: import('@/types').NoteFull }>(`/notes/notes/${id}`, data),
  deleteNote: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean; permanent: false } }>(`/notes/notes/${id}`),
  restoreNote: (id: number) =>
    api.post<{ data: import('@/types').NoteFull }>(`/notes/notes/${id}/restore`),
  permanentlyDeleteNote: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean; permanent: true } }>(`/notes/notes/${id}/permanent`),
  reorderNotes: (orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>('/notes/notes/reorder', { orderedIds }),

  // ── Phase 3d: flag-filtered views for the sidebar pills ──
  // ?f=all (default) | favorites | archive | needs-review
  getFilteredNotes: (filter: 'all' | 'favorites' | 'archive' | 'needs-review' | 'trash') =>
    api.get<{ data: { filter: string; notes: import('@/types').NoteSummary[] } }>('/notes/notes/filter', { params: { f: filter } }),

  // Immutable page history. Autosave snapshots are coalesced server-side.
  getVersions: (id: number) =>
    api.get<{ data: import('@/types').NoteVersionSummary[] }>(`/notes/notes/${id}/versions`),
  getVersion: (id: number, version: number) =>
    api.get<{ data: import('@/types').NoteVersionFull }>(`/notes/notes/${id}/versions/${version}`),
  createVersion: (id: number) =>
    api.post<{ data: import('@/types').NoteVersionFull }>(`/notes/notes/${id}/versions`),
  restoreVersion: (id: number, version: number) =>
    api.post<{ data: import('@/types').NoteFull }>(`/notes/notes/${id}/versions/${version}/restore`),

  // ── Phase 6: sub-pages, backlinks and the reference graph ──
  setParent: (id: number, parentNoteId: number | null) =>
    api.patch<{ data: import('@/types').NoteFull }>(`/notes/notes/${id}/parent`, { parentNoteId }),
  getChildren: (id: number) =>
    api.get<{ data: NoteChildSummary[] }>(`/notes/notes/${id}/children`),
  getBacklinks: (id: number) =>
    api.get<{ data: NoteBacklinkBundle }>(`/notes/notes/${id}/backlinks`),
  getGraph: () =>
    api.get<{ data: NoteReferenceGraph }>('/notes/graph'),

  // ── Phase 3d: PDF export of a single note ──
  // Returns the rendered HTML so the client can convert it to a
  // PDF (jspdf + html2canvas). Server is the source of truth for
  // the body — this prevents the editor's in-flight edits from
  // appearing in the export.
  exportNoteHtml: (id: number) =>
    api.get<{ data: { id: number; title: string; contentHtml: string; updatedAt: string } }>(`/notes/notes/${id}/export`),

  // ── Phase 2: subject detail, attachments, links, search ──
  getSubject: (id: number) =>
    api.get<{ data: import('@/types').NoteSubjectFull }>(`/notes/subjects/${id}`),

  addAttachment: (data: { noteId?: number | null; subjectId?: number | null; fileName: string; fileUrl: string; fileType?: string | null; fileSizeBytes?: number | null }) =>
    api.post<{ data: import('@/types').NoteAttachment }>('/notes/attachments', data),
  deleteAttachment: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/attachments/${id}`),

  addLink: (data: { noteId?: number | null; subjectId?: number | null; label?: string; url: string; type?: string | null; thumbnailUrl?: string | null }) =>
    api.post<{ data: import('@/types').NoteLink }>('/notes/links', data),
  updateLink: (id: number, data: Partial<{ label: string; url: string; type: string }>) =>
    api.patch<{ data: import('@/types').NoteLink }>(`/notes/links/${id}`, data),
  deleteLink: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/links/${id}`),

  search: (params: { q?: string; subjectId?: number; tag?: string }) =>
    api.get<{ data: import('@/types').NoteSearchResult[] }>('/notes/search', { params }),
  getTags: () =>
    api.get<{ data: string[] }>('/notes/tags'),

  // ── Phase 3a: vocabulary (per note) ──
  listVocab: (noteId: number) =>
    api.get<{ data: import('@/types').NoteVocabEntry[] }>('/notes/vocab', { params: { noteId } }),
  addVocab: (data: { noteId: number; term: string; reading?: string | null; meaning?: string | null; example?: string | null }) =>
    api.post<{ data: import('@/types').NoteVocabEntry }>('/notes/vocab', data),
  updateVocab: (id: number, data: Partial<{ term: string; reading: string | null; meaning: string | null; example: string | null }>) =>
    api.patch<{ data: import('@/types').NoteVocabEntry }>(`/notes/vocab/${id}`, data),
  deleteVocab: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/vocab/${id}`),
  reorderVocab: (noteId: number, orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>('/notes/vocab/reorder', { noteId, orderedIds }),

  // ── Phase 3b: flashcards (per note) ──
  listFlashcards: (noteId: number) =>
    api.get<{ data: import('@/types').FlashcardDeck }>('/notes/flashcards', { params: { noteId } }),
  gradeFlashcard: (vocabId: number, known: boolean) =>
    api.post<{ data: import('@/types').Flashcard }>('/notes/flashcards/grade', { vocabId, known }),
  resetFlashcard: (vocabId: number) =>
    api.post<{ data: { id: number; reset: boolean } }>('/notes/flashcards/reset', { vocabId }),
};

// Notes Share API — Phase 4
export interface NoteShare {
  id: number;
  subjectId: number;
  ownerId: number;
  recipientId: number;
  permission: NoteSharePermission;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  subject?: { id: number; name: string; emoji: string | null; color: string | null };
  recipient?: { id: number; username: string; email: string; avatarUrl: string | null; displayName: string | null };
  owner?: { id: number; username: string; avatarUrl: string | null; displayName: string | null };
}

export type NoteSharePermission = 'viewer' | 'commenter' | 'editor';
export type NoteAccessRole = 'owner' | NoteSharePermission;

export interface NoteShareRecipientMini {
  id: number;
  username: string;
  email?: string; // no longer returned by search-users (PII); kept optional for recipient payloads
  avatarUrl: string | null;
  displayName: string | null;
}

// Shared subject received from another user
export interface NoteSharedSubject {
  id: number;
  shareId: number;
  subjectId: number;
  permission: NoteSharePermission;
  sharedAt: string;
  owner: {
    id: number;
    username: string;
    avatarUrl: string | null;
    displayName: string | null;
  };
  subject: {
    id: number;
    name: string;
    emoji: string | null;
    color: string | null;
    chapters: Array<{ id: number; title: string }>;
    notes: Array<{ id: number; title: string; updatedAt: string }>;
  };
}

// Full shared subject with notes content
export interface NoteSharedSubjectFull {
  id: number;
  name: string;
  emoji: string | null;
  color: string | null;
  userId: number;
  myPermission: NoteAccessRole;
  isOwner: boolean;
  chapters: Array<{
    id: number;
    title: string;
    sortOrder: number;
    notes: Array<{
      id: number;
      title: string;
      contentJson: any;
      contentHtml: string | null;
      isPinned: boolean;
      isFavorite: boolean;
      isArchived: boolean;
      sortOrder: number;
    }>;
  }>;
  notes: Array<{
    id: number;
    title: string;
    contentJson: any;
    contentHtml: string | null;
    isPinned: boolean;
    isFavorite: boolean;
    isArchived: boolean;
    sortOrder: number;
  }>;
}

// Summary for sidebar - matches backend listSharedWithMe response
export interface NoteSharedSummary {
  id: number;
  subjectId: number;
  ownerId: number;
  recipientId: number;
  permission: string;
  createdAt: string;
  owner: {
    id: number;
    username: string;
    avatarUrl: string | null;
    displayName: string | null;
  };
  subject: {
    id: number;
    name: string;
    emoji: string | null;
    color: string | null;
    chapters: Array<{ id: number; title: string }>;
    notes: Array<{ id: number; title: string; updatedAt: string }>;
  };
}

export interface NoteSharedFull extends NoteFull {
  myPermission: NoteAccessRole;
  isOwner: boolean;
}

export interface NoteCommentAuthor {
  id: number;
  username: string;
  displayName: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface NoteCommentMention {
  user: NoteCommentAuthor;
}

export interface NoteComment {
  id: number;
  noteId: number;
  authorId: number;
  parentId: number | null;
  content: string;
  resolvedAt: string | null;
  resolvedById: number | null;
  createdAt: string;
  updatedAt: string;
  author: NoteCommentAuthor;
  resolvedBy: NoteCommentAuthor | null;
  mentions: NoteCommentMention[];
  replies?: NoteComment[];
}

export interface NoteRealtimeSession {
  token: string;
  expiresIn: number;
  documentName: string;
  websocketPath: string;
  permission: NoteAccessRole;
  canEdit: boolean;
  /** Someone else can open this page, so REST fallback would diverge. */
  isShared: boolean;
  user: { id: number; name: string; avatarUrl: string | null };
}

export const noteShareApi = {
  getCollaborationToken: (noteId: number) =>
    api.post<{ data: NoteRealtimeSession }>(`/notes-shares/notes/${noteId}/collaboration-token`),

  // Share a subject with another user
  create: (data: { subjectId: number; recipientId: number; permission?: NoteSharePermission; note?: string }) =>
    api.post<{ data: NoteShare }>('/notes-shares', data),

  // List all shares I own (outbox)
  list: () =>
    api.get<{ data: NoteShare[] }>('/notes-shares'),

  // Revoke a share
  delete: (shareId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-shares/${shareId}`),

  // Update share permission or note
  update: (shareId: number, data: { permission?: NoteSharePermission; note?: string | null }) =>
    api.patch<{ data: NoteShare }>(`/notes-shares/${shareId}`, data),

  // List shares for a specific subject (owner only)
  listBySubject: (subjectId: number) =>
    api.get<{ data: NoteShare[] }>(`/notes-shares/subject/${subjectId}`),

  // List subjects shared with me (inbox)
  listReceived: () =>
    api.get<{ data: NoteSharedSummary[] }>('/notes-shares/received'),

  // Get a shared subject with full tree
  getReceivedSubject: (subjectId: number) =>
    api.get<{ data: NoteSharedSubjectFull }>(`/notes-shares/received/${subjectId}`),

  // Get full content of a shared note
  getSharedNote: (subjectId: number, noteId: number) =>
    api.get<{ data: NoteSharedFull }>(`/notes-shares/received/${subjectId}/notes/${noteId}`),

  updateSharedNote: (subjectId: number, noteId: number, data: Partial<Pick<import('@/types').NoteFull, 'title' | 'contentJson' | 'contentHtml' | 'tags'>>) =>
    api.patch<{ data: NoteSharedFull }>(`/notes-shares/received/${subjectId}/notes/${noteId}`, data),

  listComments: (noteId: number, includeResolved = true) =>
    api.get<{ data: { permission: NoteAccessRole; threads: NoteComment[] } }>(`/notes-shares/notes/${noteId}/comments`, { params: { resolved: includeResolved } }),
  createComment: (noteId: number, data: { content: string; parentId?: number; mentions?: number[] }) =>
    api.post<{ data: NoteComment }>(`/notes-shares/notes/${noteId}/comments`, data),
  updateComment: (commentId: number, content: string) =>
    api.patch<{ data: NoteComment }>(`/notes-shares/comments/${commentId}`, { content }),
  resolveComment: (commentId: number) =>
    api.post<{ data: NoteComment }>(`/notes-shares/comments/${commentId}/resolve`),
  reopenComment: (commentId: number) =>
    api.post<{ data: NoteComment }>(`/notes-shares/comments/${commentId}/reopen`),
  deleteComment: (commentId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-shares/comments/${commentId}`),

  // Search users to share with
  searchUsers: (q: string, limit = 8) =>
    api.get<{ data: NoteShareRecipientMini[] }>('/notes-shares/search-users', { params: { q, limit } }),
};

// ─── Notes sub-pages + backlinks (Phase 6) ────────────────────

export interface NoteChildSummary {
  id: number;
  title: string;
  sortOrder: number;
  updatedAt: string;
  isPinned: boolean;
  isFavorite: boolean;
}

export interface NoteLinkRef {
  id: number;
  title: string;
  subjectId: number;
  /** The text the author actually typed inside [[ ]]. */
  label: string;
  updatedAt?: string;
}

export interface NoteBacklinkBundle {
  breadcrumb: Array<{ id: number; title: string }>;
  backlinks: NoteLinkRef[];
  outgoing: NoteLinkRef[];
}

export interface NoteReferenceGraph {
  nodes: Array<{ id: number; title: string; subjectId: number }>;
  edges: Array<{ sourceNoteId: number; targetNoteId: number }>;
}

// ─── Notes Databases (Phase 5) ────────────────────────────────
// Typed tables living inside a NoteSubject. Access is inherited from the
// subject's share, so there is no separate permission call.

export type NoteDatabasePropertyType =
  | 'TITLE' | 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT' | 'DATE' | 'CHECKBOX' | 'URL'
  // 17/08/2026. Phải khớp `DATABASE_PROPERTY_TYPES` trong
  // src/services/notesDatabase.service.ts — union này chép tay nên `tsc`
  // KHÔNG bắt được lúc hai bên lệch nhau; dự án đã vỡ seed trên production
  // vì đúng kiểu chép tay này (08/08/2026, xem CLAUDE.md).
  | 'STATUS' | 'PERSON' | 'EMAIL' | 'FILE' | 'CREATED_TIME' | 'LAST_EDITED_TIME';

export type NoteDatabaseViewType = 'TABLE' | 'BOARD' | 'CALENDAR' | 'GALLERY' | 'TIMELINE';

export interface NoteDatabaseProperty {
  id: number;
  databaseId: number;
  name: string;
  type: NoteDatabasePropertyType;
  /**
   * `options` nhận CẢ hai dạng: mảng chuỗi (SELECT / MULTI_SELECT, dạng cũ)
   * và mảng `{ name, group, color }` (STATUS, cần nhóm để Board xếp cột).
   * Backend `configOptions()` đã đọc được cả hai từ trước.
   */
  config: { options?: (string | { name: string; group?: string; color?: string })[] } | null;
  isTitle: boolean;
  sortOrder: number;
}

export interface NoteDatabaseView {
  id: number;
  databaseId: number;
  name: string;
  type: NoteDatabaseViewType;
  config: Record<string, unknown>;
  isDefault: boolean;
  sortOrder: number;
}

/** Cell values keyed by property id. A missing key means an empty cell. */
export type NoteDatabaseRowValues = Record<number, unknown>;

export interface NoteDatabaseRow {
  id: number;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  values: NoteDatabaseRowValues;
}

export interface NoteDatabaseSummary {
  id: number;
  subjectId: number;
  title: string;
  description: string | null;
  icon: string | null;
  updatedAt: string;
  properties: NoteDatabaseProperty[];
  views: NoteDatabaseView[];
  _count?: { rows: number };
}

export interface NoteDatabaseFull extends NoteDatabaseSummary {
  rows: NoteDatabaseRow[];
}

export interface NoteSyncedBlockDto {
  id: number;
  contentJson: unknown;
  updatedAt: string;
}

/**
 * Khối nội dung DÙNG CHUNG giữa nhiều trang ghi chú.
 *
 * Không có `list` và không có `remove` — xem noteSyncedBlock.service.ts ở
 * backend để biết vì sao xoá là thao tác nguy hiểm ở đây.
 */
export const noteSyncedBlockApi = {
  create: (contentJson?: unknown) =>
    api.post<{ data: NoteSyncedBlockDto }>('/notes-synced-blocks', { contentJson }),
  get: (blockId: number) =>
    api.get<{ data: NoteSyncedBlockDto }>(`/notes-synced-blocks/${blockId}`),
  update: (blockId: number, contentJson: unknown) =>
    api.patch<{ data: NoteSyncedBlockDto }>(`/notes-synced-blocks/${blockId}`, { contentJson }),
};

export interface DatabasePerson {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export const noteDatabaseApi = {
  listBySubject: (subjectId: number) =>
    api.get<{ data: NoteDatabaseSummary[] }>(`/notes-databases/subject/${subjectId}`),
  create: (data: { subjectId: number; title?: string; description?: string; icon?: string }) =>
    api.post<{ data: NoteDatabaseSummary }>('/notes-databases', data),
  get: (databaseId: number) =>
    api.get<{ data: NoteDatabaseFull }>(`/notes-databases/${databaseId}`),
  update: (databaseId: number, data: { title?: string; description?: string | null; icon?: string | null }) =>
    api.patch<{ data: NoteDatabaseSummary }>(`/notes-databases/${databaseId}`, data),
  remove: (databaseId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-databases/${databaseId}`),

  /** Người có thể gán vào cột PERSON: chủ môn + những người được chia sẻ môn. */
  listPeople: (databaseId: number) =>
    api.get<{ data: DatabasePerson[] }>(`/notes-databases/${databaseId}/people`),

  createProperty: (databaseId: number, data: { name: string; type: NoteDatabasePropertyType; config?: unknown }) =>
    api.post<{ data: NoteDatabaseProperty }>(`/notes-databases/${databaseId}/properties`, data),
  updateProperty: (propertyId: number, data: { name?: string; type?: NoteDatabasePropertyType; config?: unknown }) =>
    api.patch<{ data: NoteDatabaseProperty }>(`/notes-databases/properties/${propertyId}`, data),
  deleteProperty: (propertyId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-databases/properties/${propertyId}`),
  reorderProperties: (databaseId: number, orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>(`/notes-databases/${databaseId}/properties/reorder`, { orderedIds }),

  createRow: (databaseId: number, values?: NoteDatabaseRowValues) =>
    api.post<{ data: NoteDatabaseRow }>(`/notes-databases/${databaseId}/rows`, { values: values ?? {} }),
  updateRow: (rowId: number, values: NoteDatabaseRowValues) =>
    api.patch<{ data: NoteDatabaseRow }>(`/notes-databases/rows/${rowId}`, { values }),
  deleteRow: (rowId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-databases/rows/${rowId}`),
  reorderRows: (databaseId: number, orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>(`/notes-databases/${databaseId}/rows/reorder`, { orderedIds }),

  createView: (databaseId: number, data: { name?: string; type?: NoteDatabaseViewType; config?: unknown }) =>
    api.post<{ data: NoteDatabaseView }>(`/notes-databases/${databaseId}/views`, data),
  updateView: (viewId: number, data: { name?: string; type?: NoteDatabaseViewType; config?: unknown }) =>
    api.patch<{ data: NoteDatabaseView }>(`/notes-databases/views/${viewId}`, data),
  deleteView: (viewId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-databases/views/${viewId}`),
};

// Music API
// Music-page access control (3-tier: ADMIN_ONLY | SPECIFIC | EVERYONE).
export type MusicAccessMode = 'ADMIN_ONLY' | 'SPECIFIC' | 'EVERYONE';
export const musicAccessApi = {
  // Public (optionalAuth): does the current viewer get the /music page?
  check: () =>
    api.get<{ success: boolean; data: { hasAccess: boolean; mode: MusicAccessMode } }>('/music/access'),
  // Admin: read + set the global mode.
  getMode: () =>
    api.get<{ success: boolean; data: { mode: MusicAccessMode } }>('/admin/music-access'),
  setMode: (mode: MusicAccessMode) =>
    api.put<{ success: boolean; data: { mode: MusicAccessMode } }>('/admin/music-access', { mode }),
  // Admin: grant/revoke a specific user (used in SPECIFIC mode).
  toggleUser: (userId: number, allowed: boolean) =>
    api.patch<{ success: boolean; data: { id: number; username: string; musicAccess: boolean } }>(
      `/admin/users/${userId}/toggle-music-access`, { allowed },
    ),
};

export const musicApi = {
  getTracks: (params?: { page?: number; size?: number; keyword?: string; category?: 'NORMAL' | 'REMIX' }) =>
    api.get('/music/tracks', { params }),
  getTrack: (id: number) => api.get(`/music/tracks/${id}`),
  getStreamUrl: (id: number) => `/api/v1/music/stream/${id}`,
  // Admin: extract a YouTube track's audio to R2 so it plays via <audio>
  // (background + lock-screen). Long timeout — server-side yt-dlp+ffmpeg
  // extraction can take 10-60s.
  downloadToSite: (trackId: number) =>
    api.post(`/music/tracks/${trackId}/download-audio`, {}, { timeout: 180000 }),
  getHistory: () => api.get('/music/history'),
  recordPlay: (trackId: number) =>
    api.post('/music/history', { trackId }),
  clearHistory: () => api.delete('/music/history'),
};

// User API
export const userApi = {
  getAll: (params?: {
    page?: number;
    size?: number;
    keyword?: string;
    sortBy?: string;
    sortDir?: string;
  }) => api.get('/admin/users', { params }),

  getById: (id: number) => api.get(`/admin/users/${id}`),

  create: (data: {
    username: string;
    password: string;
    email: string;
    fullName?: string;
    roleName: string;
  }) => api.post('/admin/users', data),

  update: (
    id: number,
    data: {
      username?: string;
      email?: string;
      fullName?: string;
      password?: string;
      enabled?: boolean;
      accountNonLocked?: boolean;
      roleName?: string;
    }
  ) => api.put(`/admin/users/${id}`, data),

  delete: (id: number) => api.delete(`/admin/users/${id}`),

  toggleEnabled: (id: number) => api.patch(`/admin/users/${id}/toggle-enabled`),

  toggleLocked: (id: number) => api.patch(`/admin/users/${id}/toggle-locked`),

  count: () => api.get('/admin/users/count'),
};

// Social user API — public profiles, follow, presence
export const socialUserApi = {
  getProfile: (id: number) => api.get(`/users/${id}`),
  // Phase 4 add — getUserPosts / getUserMedia for the profile
  // page tabs. Cursor-paginated. Returns the same shape as the
  // feed (items + nextCursor + hasMore + limit) so the
  // infinite-scroll handler in ProfileDetail is shared with
  // the feed's hook.
  getUserPosts: (
    id: number,
    params: { cursor?: number; limit?: number; type?: 'POST' | 'VIDEO' | 'FILE' } = {},
  ) => api.get<{ data: { items: unknown[]; nextCursor: number | null; hasMore: boolean; limit: number } }>(`/users/${id}/posts`, { params }),
  getUserMedia: (
    id: number,
    params: { cursor?: number; limit?: number; type?: 'IMAGE' | 'VIDEO' } = {},
  ) => api.get<{ data: { items: unknown[]; nextCursor: number | null; hasMore: boolean; limit: number } }>(`/users/${id}/media`, { params }),
  // Phase 8 add — list posts the user has LIKED. Cursor-paginated,
  // returns the same `{ items, nextCursor, hasMore, limit }` shape
  // as getUserPosts/getUserMedia so the profile page can reuse
  // its infinite-scroll handler. Privacy: the backend only allows
  // the owner to fetch this (404 for anyone else).
  getUserLiked: (
    id: number,
    params: { cursor?: number; limit?: number } = {},
  ) => api.get<{ data: { items: unknown[]; nextCursor: number | null; hasMore: boolean; limit: number } }>(`/users/${id}/liked`, { params }),
  // Phase 4 add — own profile (incl. lazy-create) and update.
  getOwnProfile: () => api.get('/users/me/profile'),
  updateOwnProfile: (data: {
    bio?: string; coverPhoto?: string; location?: string; websiteUrl?: string; work?: string; education?: string;
    // Extended FB-style "About" fields
    hometown?: string; jobTitle?: string; workplace?: string; school?: string; college?: string;
    relationshipStatus?: string; hobbies?: string; languages?: string;
  }) =>
    api.patch('/users/me/profile', data),
  toggleFollow: (targetId: number) => api.post('/users/follow', { targetId }),
  getFollowers: (id: number, cursor?: number, limit = 20) =>
    api.get(`/users/${id}/followers`, { params: { cursor, limit } }),
  getFollowing: (id: number, cursor?: number, limit = 20) =>
    api.get(`/users/${id}/following`, { params: { cursor, limit } }),
  getSuggestions: (limit = 10) => api.get('/users/suggestions', { params: { limit } }),
  // "My network": accepted friends ∪ people I follow (online first). Backs the
  // home "Bạn bè" sidebar — real connections only, not who-to-follow.
  getNetwork: (limit = 30) => api.get('/users/network', { params: { limit } }),
  // Phase 5 home upgrade: @mention autocomplete. Drives the dropdown
  // in the post + comment composer. Followed users ranked first.
  searchMentions: (q: string, limit = 8) =>
    api.get<{ data: Array<{ id: number; username: string; displayName: string | null; avatarUrl: string | null; isFollowing: boolean }> }>(
      '/users/search',
      { params: { q, limit } },
    ),
  updateStatus: () => api.post('/users/status'),
  updateCoverPhoto: (coverPhotoUrl: string) => api.post('/users/cover-photo', { coverPhotoUrl }),
  // People search / discovery — drives the global Navbar search box
  // and the /friends page. Returns richer cards than searchMentions:
  // includes fullName, isOnline, isFollowing and friendStatus so each
  // result can render the correct action button. Empty q → "people
  // you may know". Cursor-paginated.
  discover: (q: string, limit = 12, cursor?: number) =>
    api.get<{ data: { users: DiscoverUser[]; nextCursor?: number } }>(
      '/users/discover',
      { params: { q, limit, cursor } },
    ),
};

// ─── Friend graph (two-way, Facebook-style) ──────────────────────
// Independent of the follow graph above. A request must be confirmed
// by the addressee. Backend: src/routes/friend.routes.ts (/api/v1/friends).
export type FriendStatus =
  | 'none'
  | 'pending_outgoing'
  | 'pending_incoming'
  | 'friends';

export interface DiscoverUser {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  isFollowing: boolean;
  friendStatus: FriendStatus;
}

export interface FriendUser {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  since: string;
}

export interface FriendRequest {
  friendshipId: number;
  user: FriendUser;
  createdAt: string;
}

export const friendApi = {
  /** List my accepted friends (cursor-paginated). */
  listFriends: (cursor?: number, limit = 20) =>
    api.get<{ data: { users: FriendUser[]; nextCursor?: number } }>(
      '/friends',
      { params: { cursor, limit } },
    ),
  /** Pending requests sent TO me (Confirm / Delete). */
  incoming: (limit = 30) =>
    api.get<{ data: FriendRequest[] }>('/friends/requests/incoming', { params: { limit } }),
  /** Pending requests I sent (can Cancel). */
  outgoing: (limit = 30) =>
    api.get<{ data: FriendRequest[] }>('/friends/requests/outgoing', { params: { limit } }),
  /** Incoming count for the sidebar badge. */
  requestCount: () =>
    api.get<{ data: { count: number } }>('/friends/requests/count'),
  /** Relationship between me and another user. */
  getStatus: (id: number) =>
    api.get<{ data: { status: FriendStatus } }>(`/friends/status/${id}`),
  /** Send a friend request. Auto-accepts if they already invited me. */
  sendRequest: (targetId: number) =>
    api.post<{ data: { status: FriendStatus; autoAccepted: boolean } }>('/friends/request', { targetId }),
  /** Accept / decline an incoming request. */
  respond: (requesterId: number, accept: boolean) =>
    api.post<{ data: { status: FriendStatus; requesterId: number } }>('/friends/respond', { requesterId, accept }),
  /** Cancel a request I sent. */
  cancel: (targetId: number) =>
    api.post<{ data: { status: FriendStatus } }>('/friends/cancel', { targetId }),
  /** Remove an existing friend. */
  unfriend: (id: number) =>
    api.delete<{ data: { status: FriendStatus } }>(`/friends/${id}`),
};

// Blog API
export const blogApi = {
  getPosts: (params?: {
    page?: number;
    size?: number;
    category?: string;
  }) => api.get('/blog/posts', { params }),

  // Get full post by id (for modal/detail — includes comments)
  getPostById: (id: number) => api.get(`/blog/posts/${id}`),

  // Get post by slug (for SEO / full page view)
  getPostBySlug: (slug: string) => api.get(`/blog/posts/by-slug/${slug}`),

  getFeatured: () => api.get('/blog/posts/featured'),

  getPopular: (limit?: number) =>
    api.get('/blog/posts/popular', { params: { limit } }),

  search: (params: {
    keyword?: string;
    category?: string;
    page?: number;
    size?: number;
  }) => api.get('/blog/posts/search', { params }),

  getCategories: () => api.get('/blog/categories'),

  // Download source code — increments counter then returns URL
  recordDownload: (postId: number) =>
    api.post(`/blog/posts/${postId}/download`),

  // Add a comment
  addComment: (postId: number, payload: {
    userName?: string;
    userAvatar?: string;
    commentText: string;
  }) => api.post(`/blog/posts/${postId}/comments`, payload),
};

// AI Chat API
export const aiApi = {
  chat: (data: {
    message: string;
    sessionId?: string;
    documentType?: string;
    topK?: number;
  }) => api.post('/ai/chat', data),

  getChatHistory: (sessionId: string) =>
    api.get(`/ai/chat/history/${sessionId}`),

  getSessions: () => api.get('/ai/chat/sessions'),

  deleteSession: (sessionId: string) =>
    api.delete(`/ai/chat/sessions/${sessionId}`),

  submitFeedback: (data: {
    messageId: number;
    rating: number;
    feedbackType: string;
    comment?: string;
  }) => api.post('/ai/feedback', data),

  getFeedbackStats: () => api.get('/ai/feedback/stats'),

  getAnalyticsOverview: () => api.get('/ai/analytics/overview'),
};

// AI Admin API
export const aiAdminApi = {
  indexAll: () => api.post('/ai/admin/knowledge/index-all'),

  reindexAll: () => api.post('/ai/admin/knowledge/reindex-all'),

  clearAll: () => api.delete('/ai/admin/knowledge/clear-all'),

  indexPosts: () => api.post('/ai/admin/knowledge/index-posts'),

  indexProfiles: () => api.post('/ai/admin/knowledge/index-profiles'),

  indexDocument: (data: {
    documentId: string;
    documentType: string;
    content: string;
    metadata?: Record<string, unknown>;
  }) => api.post('/ai/admin/documents', data),

  deleteDocument: (documentId: string) =>
    api.delete(`/ai/admin/documents/${documentId}`),

  getAllChunks: (documentType?: string) =>
    api.get('/ai/admin/documents', { params: { documentType } }),

  getStats: () => api.get('/ai/admin/stats'),

  getConfig: () => api.get('/ai/admin/config'),

  updateConfig: (key: string, data: { value?: string; description?: string }) =>
    api.put(`/ai/admin/config/${key}`, data),
};

// System API
export const systemApi = {
  health: () => api.get('/system/health'),
};

// Skills API
export const skillsApi = {
  getAll: () => api.get('/skills'),
  getFeatured: () => api.get('/skills/featured'),
  getByCategory: (category: string) => api.get(`/skills/category/${category}`),
};

// Projects API
export const projectsApi = {
 getAll: (params?: {
 page?: number;
 size?: number;
 keyword?: string;
 status?: string;
 category?: string;
 difficulty?: string;
 }) => api.get('/projects', { params }),

 getFeatured: (params?: { page?: number; size?: number }) =>
 api.get('/projects/featured', { params }),

 getBySlug: (slug: string) => api.get(`/projects/${slug}`),

 create: (data: Record<string, unknown>) => api.post('/projects', data),

 update: (id: number, data: Record<string, unknown>) => api.put(`/projects/${id}`, data),

 delete: (id: number) => api.delete(`/projects/${id}`),

 toggleFeatured: (id: number) => api.patch(`/projects/${id}/toggle-featured`),

 // ─── Case study additions ────────────────────────────────
 // Anonymous like (idempotent by IP). Server returns the
 // authoritative count + the project's likeCount field.
 like: (slug: string) => api.post(`/projects/${slug}/like`),

 // Force a re-render of bodyHtml from bodyMdx (admin).
 render: (slug: string) => api.post(`/projects/${slug}/render`),

 // Full-text search powered by Postgres tsvector. Returns
 // ranked results with a highlighted snippet (already
 // includes <mark> tags around the match). Filters by
 // category and difficulty; capped at 50 results.
 search: (params: {
 q: string;
 category?: string;
 difficulty?: string;
 size?: number;
 }) => api.get('/projects/search', { params }),

 // Child entities — milestones
 listMilestones: (projectId: number) => api.get(`/admin/projects/${projectId}/milestones`),
 createMilestone: (projectId: number, data: Record<string, unknown>) =>
 api.post(`/admin/projects/${projectId}/milestones`, data),
 updateMilestone: (projectId: number, id: number, data: Record<string, unknown>) =>
 api.put(`/admin/projects/${projectId}/milestones/${id}`, data),
 deleteMilestone: (projectId: number, id: number) =>
 api.delete(`/admin/projects/${projectId}/milestones/${id}`),

 // Child entities — features
 listFeatures: (projectId: number) => api.get(`/admin/projects/${projectId}/features`),
 createFeature: (projectId: number, data: Record<string, unknown>) =>
 api.post(`/admin/projects/${projectId}/features`, data),
 updateFeature: (projectId: number, id: number, data: Record<string, unknown>) =>
 api.put(`/admin/projects/${projectId}/features/${id}`, data),
 deleteFeature: (projectId: number, id: number) =>
 api.delete(`/admin/projects/${projectId}/features/${id}`),

 // Child entities — resources
 listResources: (projectId: number) => api.get(`/admin/projects/${projectId}/resources`),
 createResource: (projectId: number, data: Record<string, unknown>) =>
 api.post(`/admin/projects/${projectId}/resources`, data),
 updateResource: (projectId: number, id: number, data: Record<string, unknown>) =>
 api.put(`/admin/projects/${projectId}/resources/${id}`, data),
 deleteResource: (projectId: number, id: number) =>
 api.delete(`/admin/projects/${projectId}/resources/${id}`),

 // Child entities — list items (Core Knowledge / Portfolio Bonus /
 // Outcomes). All three kinds share one CRUD pair — `kind` is a
 // query param for GET and a body field for POST. The editor
 // always knows which kind it's editing, so the URLs are stable.
 listListItems: (projectId: number, kind: 'CORE_KNOWLEDGE' | 'PORTFOLIO_BONUS' | 'COMPLETION_OUTCOME') =>
 api.get(`/admin/projects/${projectId}/list-items`, { params: { kind } }),
 createListItem: (projectId: number, data: Record<string, unknown>) =>
 api.post(`/admin/projects/${projectId}/list-items`, data),
 updateListItem: (projectId: number, id: number, data: Record<string, unknown>) =>
 api.put(`/admin/projects/${projectId}/list-items/${id}`, data),
 deleteListItem: (projectId: number, id: number) =>
 api.delete(`/admin/projects/${projectId}/list-items/${id}`),
};

// Contact API
export const contactApi = {
  submit: (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => api.post('/contact', data),
};

// Course Categories API
export const academyApi = {
  getSemesters: () => api.get('/academy/semesters'),
  // When called from the admin panel we want to see DRAFT courses too
  // (the user is editing). The public /academy page never sets this
  // flag, so it still only ever sees PUBLISHED courses.
  getCoursesBySemester: (semesterId: number, opts?: { includeDraft?: boolean }) =>
    api.get(`/courses/semester/${semesterId}`, { params: opts?.includeDraft ? { includeDraft: 'true' } : {} }),
  getLessonAssignments: (lessonId: number) => api.get(`/courses/lessons/${lessonId}/assignments`),
  submitAssignment: (data: { assignmentId: number; submissionUrl: string; notes?: string }) =>
    api.post('/courses/assignments/submit', data),
  createSemester: (data: {
    name: string;
    code: string;
    ordinal: number;
    description?: string;
    isActive?: boolean;
  }) => api.post('/academy/semesters', data),
  updateSemester: (id: number, data: {
    name: string;
    code: string;
    ordinal?: number;
    description?: string;
    isActive?: boolean;
  }) => api.put(`/academy/semesters/${id}`, data),
  deleteSemester: (id: number) => api.delete(`/academy/semesters/${id}`),
  getSubmissionsByAssignment: (assignmentId: number) =>
    api.get(`/academy/assignments/${assignmentId}/submissions`),
  gradeSubmission: (data: { submissionId: number; grade?: number; feedback?: string; status?: string }) =>
    api.post('/academy/assignments/grade', data),
  getCourseWithSections: (courseId: number) =>
    api.get(`/courses/admin/${courseId}`),
};

export const academyCodesApi = {
  getAll: (courseId?: number) =>
    api.get('/academy/codes', { params: courseId ? { courseId } : {} }),
  create: (data: {
    courseId: number;
    code: string;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: string;
  }) => api.post('/academy/codes', data),
  update: (id: number, data: {
    code?: string;
    maxUses?: number;
    isActive?: boolean;
    expiresAt?: string;
  }) => api.put(`/academy/codes/${id}`, data),
  delete: (id: number) => api.delete(`/academy/codes/${id}`),
};

// ─────────────────────────────────────────────────────────────
// Exam Room (Phòng thi) API
// ─────────────────────────────────────────────────────────────
export type ExamKind = 'FE' | 'PE';
export type PeType = 'CODE' | 'WRITE' | 'SPEAK';
export type ExamQuestionKind = 'MCQ' | 'CODE' | 'WRITE' | 'SPEAK';

export interface ExamMy {
  attempts: number;
  bestScore: number | null;
  lastScore: number | null;
  passed: boolean;
  lastAttemptId: number | null;
  inProgressId: number | null;
}
export interface ExamHeader {
  id: number;
  courseId: number;
  kind: ExamKind;
  peType: PeType | null;
  title: string;
  description: string | null;
  code: string | null;
  durationMinutes: number;
  totalPoints: number;
  passMark: number;
  source: string;
  instructions: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  isPublished: boolean;
  sortOrder: number;
  questionCount?: number;
  my?: ExamMy | null;
}
export interface ExamOption { text: string }
export interface ExamTakingQuestion {
  id: number;
  kind: ExamQuestionKind;
  sortOrder: number;
  points: number;
  prompt: string;
  imageUrl: string | null;
  options: ExamOption[] | null;
  selectCount: number;
  multiSelect: boolean;
  language: string | null;
  starterCode: string | null;
  expectedOutput: string | null;
  speakingPrompts: { text: string; imageUrl?: string }[] | null;
}

export interface ExamPortalItem {
  id: number;
  courseId: number;
  kind: ExamKind;
  peType: PeType | null;
  title: string;
  code: string | null;
  durationMinutes: number;
  totalPoints: number;
  passMark: number;
  questionCount: number;
  course: { title: string; slug: string; courseCode: string | null } | null;
  semester: { name: string; ordinal: number; code: string } | null;
}

export const examApi = {
  // Public
  listAll: () => api.get<{ data: ExamPortalItem[] }>('/exams'),
  listForCourse: (courseIdOrSlug: string | number) =>
    api.get<{ data: ExamHeader[] }>(`/exams/course/${courseIdOrSlug}`),
  // Taking
  getForTaking: (examId: number) =>
    api.get<{ data: ExamHeader & { questions: ExamTakingQuestion[] } }>(`/exams/${examId}/take`),
  start: (examId: number) =>
    api.post<{ data: { attemptId: number; startedAt: string; expiresAt: string | null; resumed: boolean } }>(`/exams/${examId}/attempts`),
  myAttempts: (examId?: number) =>
    api.get(`/exams/attempts/mine`, { params: examId ? { examId } : {} }),
  getAttempt: (attemptId: number) => api.get(`/exams/attempts/${attemptId}`),
  // codeAnswers: for mixed papers (Progress Test = MCQ + 1–2 coding questions).
  // Those are AI-graded server-side, so allow well over the default timeout.
  submitFe: (attemptId: number, data: { answers: Record<string, number[]>; codeAnswers?: Record<string, string>; timeSpentSeconds?: number; integritySignals?: unknown }) =>
    api.post(`/exams/attempts/${attemptId}/submit-fe`, data, { timeout: 180000 }),
  submitCode: (attemptId: number, file: File, timeSpentSeconds?: number) => {
    const fd = new FormData();
    fd.append('file', file);
    if (timeSpentSeconds != null) fd.append('timeSpentSeconds', String(timeSpentSeconds));
    return api.post(`/exams/attempts/${attemptId}/submit-code`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000,
    });
  },
  submitWrite: (attemptId: number, data: { essays: Record<string, string>; timeSpentSeconds?: number }) =>
    api.post(`/exams/attempts/${attemptId}/submit-write`, data, { timeout: 120000 }),
  submitSpeak: (attemptId: number, questionId: number, audios: Blob[], timeSpentSeconds?: number) => {
    const fd = new FormData();
    audios.forEach((b, i) => fd.append('audio', b, `answer-${i + 1}.webm`));
    fd.append('questionId', String(questionId));
    if (timeSpentSeconds != null) fd.append('timeSpentSeconds', String(timeSpentSeconds));
    return api.post(`/exams/attempts/${attemptId}/submit-speak`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000,
    });
  },
  genSpeakingQuestions: (questionId: number, count = 4) =>
    api.post<{ data: { text: string }[] }>(`/exams/questions/${questionId}/speaking-questions`, { count }),
  // History & bookmarks (Sổ tay ôn tập)
  deleteAttempt: (attemptId: number) => api.delete(`/exams/attempts/${attemptId}`),
  toggleExamBookmark: (examId: number) =>
    api.post<{ data: { bookmarked: boolean } }>(`/exams/${examId}/bookmark`),
  myExamBookmarks: () => api.get(`/exams/bookmarks/exams`),
  toggleQuestionBookmark: (questionId: number, note?: string) =>
    api.post<{ data: { bookmarked: boolean } }>(`/exams/questions/${questionId}/bookmark`, note != null ? { note } : {}),
  updateQuestionBookmarkNote: (questionId: number, note: string) =>
    api.put(`/exams/questions/${questionId}/bookmark-note`, { note }),
  myQuestionBookmarks: () => api.get(`/exams/bookmarks/questions`),
  // Admin
  adminList: (courseId?: number) => api.get(`/exams/admin/list`, { params: courseId ? { courseId } : {} }),
  adminGet: (examId: number) => api.get(`/exams/admin/${examId}`),
  adminCreate: (data: Partial<ExamHeader>) => api.post(`/exams/admin`, data),
  adminUpdate: (examId: number, data: Partial<ExamHeader>) => api.put(`/exams/admin/${examId}`, data),
  adminDelete: (examId: number) => api.delete(`/exams/admin/${examId}`),
  adminUpsertQuestion: (examId: number, data: Record<string, unknown>, questionId?: number) =>
    questionId
      ? api.put(`/exams/admin/${examId}/questions/${questionId}`, data)
      : api.post(`/exams/admin/${examId}/questions`, data),
  adminDeleteQuestion: (examId: number, questionId: number) =>
    api.delete(`/exams/admin/${examId}/questions/${questionId}`),
};

// Course Categories API
export const courseCategoryApi = {
  getAll: () => api.get('/course-categories'),
  getAdminAll: () => api.get('/course-categories/admin/all'),
  create: (data: {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
  }) => api.post('/course-categories', data),
  update: (id: number, data: {
    name?: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => api.put(`/course-categories/${id}`, data),
  delete: (id: number) => api.delete(`/course-categories/${id}`),
};

// Courses API
export const coursesApi = {
  getAll: (params?: {
    page?: number;
    size?: number;
    keyword?: string;
    category?: string;
    level?: string;
    academy?: string; // 'fpt' → only FPTU Academy courses; omit → only GENERAL
  }) => api.get('/courses', { params }),

  // Report a lesson's measured video duration (0-fill only, server-side).
  reportLessonDuration: (lessonId: number, seconds: number) =>
    api.post(`/courses/lessons/${lessonId}/duration`, { seconds }),

  getFeatured: (limit = 6) =>
    api.get('/courses/featured', { params: { limit } }),

  getBySlug: (slug: string) => api.get(`/courses/${slug}`),

  getReviews: (courseId: number) =>
    api.get(`/courses/${courseId}/reviews`),

  enroll: (courseId: number) =>
    api.post(`/courses/${courseId}/enroll`),

  cancelEnrollment: (courseId: number) =>
    api.delete(`/courses/${courseId}/enroll`),

  getCurriculum: (courseId: number) =>
    api.get(`/courses/${courseId}/curriculum`),

  getLesson: (courseId: number, lessonId: number) =>
    api.get(`/courses/${courseId}/lessons/${lessonId}`),

  getProgress: (courseId: number) =>
    api.get(`/courses/${courseId}/progress`),

  updateProgress: (courseId: number, data: {
    lessonId: number;
    isCompleted?: boolean;
    watchTimeSeconds?: number;
    lastPositionSeconds?: number;
  }) => api.post(`/courses/${courseId}/progress`, data),

  // Lesson documents — admin uploads, students download
  uploadDocument: (lessonId: number, file: File, title?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (title) fd.append('title', title);
    return api.post(`/courses/lessons/${lessonId}/documents`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteDocument: (documentId: number) =>
    api.delete(`/courses/documents/${documentId}`),
  downloadDocumentUrl: (documentId: number) =>
    `/api/v1/courses/documents/${documentId}/download`,
  // Resolves a document to a short-lived, publicly-fetchable signed URL
  // (JSON, not a redirect) — used to hand off to an external viewer
  // (Google Docs Viewer) that can't carry our auth cookie.
  resolveDocumentUrl: (documentId: number) =>
    api.get<{ data: { url: string; fileType: string | null; title: string } }>(
      `/courses/documents/${documentId}/download?resolve=1`,
    ),

  // Add an external-link document (e.g. a Google Drive folder).
  addDocumentLink: (lessonId: number, title: string, url: string) =>
    api.post(`/courses/lessons/${lessonId}/documents/link`, { title, url }),

  // Direct-to-R2 upload for large files (up to 150MB, any type):
  // presign → PUT straight to R2 → register. `onProgress` (0..1) is driven
  // by the R2 PUT via XHR. Needs an R2 CORS rule allowing PUT from the origin.
  uploadDocumentDirect: async (
    lessonId: number,
    file: File,
    title?: string,
    onProgress?: (fraction: number) => void,
  ) => {
    const presign = await api.post(`/courses/lessons/${lessonId}/documents/presign`, {
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    });
    const { uploadUrl, key, headers } = presign.data.data as {
      uploadUrl: string;
      key: string;
      headers?: Record<string, string>;
    };
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      Object.entries(headers ?? { 'Content-Type': file.type || 'application/octet-stream' }).forEach(
        ([k, v]) => xhr.setRequestHeader(k, v),
      );
      xhr.upload.onprogress = (e) => {
        if (onProgress && e.lengthComputable) onProgress(e.loaded / e.total);
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`R2 PUT failed (${xhr.status})`)));
      xhr.onerror = () => reject(new Error('R2 PUT network error (kiểm tra CORS bucket)'));
      xhr.send(file);
    });
    return api.post(`/courses/lessons/${lessonId}/documents/register`, {
      key,
      title: title || file.name,
      originalName: file.name,
    });
  },

  // Direct-to-R2 video upload for a lesson (up to 2GB): presign → PUT to R2 →
  // register. The object is PRIVATE; students receive a signed URL at play
  // time. `durationSeconds` (probed client-side) keeps course totals accurate.
  // `track` ('VI' | 'EN') files the upload under one of the lesson's parallel
  // recordings; omit it for the legacy single-video slot.
  uploadLessonVideoDirect: async (
    lessonId: number,
    file: File,
    onProgress?: (fraction: number) => void,
    durationSeconds?: number,
    track?: 'VI' | 'EN',
  ) => {
    const presign = await api.post(`/courses/lessons/${lessonId}/video/presign`, {
      filename: file.name,
      contentType: file.type || 'video/mp4',
      size: file.size,
    });
    const { uploadUrl, key, headers } = presign.data.data as {
      uploadUrl: string;
      key: string;
      headers?: Record<string, string>;
    };
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      Object.entries(headers ?? { 'Content-Type': file.type || 'video/mp4' }).forEach(
        ([k, v]) => xhr.setRequestHeader(k, v),
      );
      xhr.upload.onprogress = (e) => {
        if (onProgress && e.lengthComputable) onProgress(e.loaded / e.total);
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`R2 PUT failed (${xhr.status})`)));
      xhr.onerror = () => reject(new Error('R2 PUT network error (kiểm tra CORS bucket)'));
      xhr.send(file);
    });
    return api.post(`/courses/lessons/${lessonId}/video/register`, {
      key,
      ...(durationSeconds && durationSeconds > 0 ? { durationSeconds: Math.round(durationSeconds) } : {}),
      ...(track ? { track } : {}),
    });
  },

  // Admin: short signed URL to preview a lesson's saved DIRECT video.
  getLessonVideoPreview: (lessonId: number, track?: 'VI' | 'EN' | 'YT') =>
    api.get<{ data: { videoPlatform: string; videoUrl: string | null } }>(
      `/courses/lessons/${lessonId}/video-preview${track ? `?track=${track}` : ''}`,
    ),

  // Admin: remove a lesson's video (clears lesson + deletes the R2 object).
  deleteLessonVideo: (lessonId: number, track?: 'VI' | 'EN' | 'YT') =>
    api.delete(`/courses/lessons/${lessonId}/video${track ? `?track=${track}` : ''}`),

  // ── Course-LEVEL documents (the fixed "Tài liệu" area) ──
  getCourseDocuments: (courseId: number) => api.get(`/courses/${courseId}/documents`),
  addCourseDocumentLink: (courseId: number, title: string, url: string) =>
    api.post(`/courses/${courseId}/documents/link`, { title, url }),
  uploadCourseDocumentDirect: async (
    courseId: number,
    file: File,
    title?: string,
    onProgress?: (fraction: number) => void,
  ) => {
    const presign = await api.post(`/courses/${courseId}/documents/presign`, {
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    });
    const { uploadUrl, key, headers } = presign.data.data as {
      uploadUrl: string;
      key: string;
      headers?: Record<string, string>;
    };
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      Object.entries(headers ?? { 'Content-Type': file.type || 'application/octet-stream' }).forEach(
        ([k, v]) => xhr.setRequestHeader(k, v),
      );
      xhr.upload.onprogress = (e) => {
        if (onProgress && e.lengthComputable) onProgress(e.loaded / e.total);
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`R2 PUT failed (${xhr.status})`)));
      xhr.onerror = () => reject(new Error('R2 PUT network error (kiểm tra CORS bucket)'));
      xhr.send(file);
    });
    return api.post(`/courses/${courseId}/documents/register`, {
      key,
      title: title || file.name,
      originalName: file.name,
    });
  },

  getMyCourses: (params?: {
    page?: number;
    size?: number;
    status?: string;
  }) => api.get('/courses/my', { params }),

  getAllMyCourses: () => api.get('/courses/my'),

  createReview: (data: {
    courseId: number;
    rating: number;
    title?: string;
    content?: string;
  }) => api.post('/courses/reviews', data),

  activateCode: (courseId: number, code: string) =>
    api.post('/courses/activate-code', { courseId, code }),
};

// Admin Courses API
export const adminCoursesApi = {
  getAll: (params?: {
    page?: number;
    size?: number;
    keyword?: string;
    status?: string;
    categoryId?: number;
  }) => api.get('/courses/admin/all', { params }),

  getById: (id: number) => api.get(`/courses/admin/${id}`),

  create: (data: {
    title: string;
    categoryId?: number;
    instructorId?: number;
    semesterId?: number;
    courseCode?: string;
    academyType?: string;
    shortDescription?: string;
    description?: string;
    thumbnailUrl?: string;
    previewVideoUrl?: string;
    price?: number;
    discountPrice?: number;
    discountExpiresAt?: string;
    level?: string;
    language?: string;
    isFree?: boolean;
    isFeatured?: boolean;
    accessType?: string;
    requirements?: string;
    whatYouLearn?: string;
    documentsNote?: string;
    status?: string;
    tags?: string[];
  }) => api.post('/courses', data),

  update: (id: number, data: Partial<{
    title: string;
    categoryId: number;
    instructorId: number;
    semesterId: number;
    courseCode: string;
    academyType: string;
    shortDescription: string;
    description: string;
    thumbnailUrl: string;
    previewVideoUrl: string;
    price: number;
    discountPrice: number;
    discountExpiresAt: string;
    level: string;
    language: string;
    isFree: boolean;
    isFeatured: boolean;
    accessType: string;
    isPublished: boolean;
    requirements: string;
    whatYouLearn: string;
    documentsNote: string;
    status: string;
    tags: string[];
  }>) => api.put(`/courses/${id}`, data),

  delete: (id: number) => api.delete(`/courses/${id}`),

  createSection: (data: {
    courseId: number;
    title: string;
    description?: string;
    sortOrder?: number;
    isLocked?: boolean;
  }) => api.post('/courses/sections', data),

  updateSection: (id: number, data: {
    courseId?: number;
    title?: string;
    description?: string;
    sortOrder?: number;
    isLocked?: boolean;
  }) => api.put(`/courses/sections/${id}`, data),

  deleteSection: (id: number) => api.delete(`/courses/sections/${id}`),

  createLesson: (data: {
    sectionId: number;
    title: string;
    slug?: string;
    description?: string;
    content?: string;
    lessonType?: string;
    videoUrl?: string;
    videoDurationSeconds?: number;
    thumbnailUrl?: string;
    isFreePreview?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
    videoPlatform?: 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT' | string;
    sourceCodeUrl?: string;
    teachingNotes?: string;
    quizData?: unknown;
  }) => api.post('/courses/lessons', data),

  updateLesson: (id: number, data: Partial<{
    sectionId: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    lessonType: string;
    videoUrl: string;
    videoDurationSeconds: number;
    thumbnailUrl: string;
    isFreePreview: boolean;
    isPublished: boolean;
    sortOrder: number;
    videoPlatform: 'EMBED' | 'YOUTUBE_TAB' | 'DIRECT' | string;
    sourceCodeUrl: string;
    teachingNotes: string;
    quizData: unknown;
  }>) => api.put(`/courses/lessons/${id}`, data),

  deleteLesson: (id: number) => api.delete(`/courses/lessons/${id}`),

  createDocument: (data: {
    lessonId: number;
    title: string;
    fileUrl: string;
    fileSizeBytes?: number;
    fileType?: string;
  }) => api.post('/courses/documents', data),

  deleteDocument: (id: number) => api.delete(`/courses/documents/${id}`),

  createAssignment: (data: {
    lessonId: number;
    title: string;
    instructions?: string;
    deadline?: string;
    sortOrder?: number;
    isPublished?: boolean;
    maxScore?: number;
  }) => api.post('/courses/assignments', data),

  updateAssignment: (id: number, data: Partial<{
    lessonId: number;
    title: string;
    instructions: string;
    deadline: string;
    sortOrder: number;
    isPublished: boolean;
  }>) => api.put(`/courses/assignments/${id}`, data),

  deleteAssignment: (id: number) => api.delete(`/courses/assignments/${id}`),

  updateLessonDetail: (lessonId: number, data: {
    videoPlatform?: string;
    videoUrl?: string;
    // VN / EN / YT tracks. Sent only when the caller edits them — the backend
    // patches whatever is present and leaves the rest alone.
    videoUrlVi?: string;
    videoPlatformVi?: string;
    videoUrlEn?: string;
    videoPlatformEn?: string;
    videoUrlYt?: string;
    videoYtCredit?: string;
    defaultVideoTrack?: 'VI' | 'EN' | 'YT';
    sourceCodeUrl?: string;
    teachingNotes?: string;
  }) => api.put(`/courses/lessons/${lessonId}/detail`, data),
};

// Certificates API
export const certificatesApi = {
  getMyCertificates: () => api.get('/certificates/my'),
  verifyCertificate: (certificateNumber: string) =>
    api.get(`/certificates/verify/${certificateNumber}`),
  getByEnrollment: (enrollmentId: number) =>
    api.get(`/certificates/enrollment/${enrollmentId}`),
  // The signed-in user's certificate for a course (404 if not earned yet).
  getForCourse: (courseId: number) =>
    api.get(`/certificates/course/${courseId}`),
  // Redeem a certificate for a one-time 10% discount code (idempotent).
  redeem: (certificateId: number) =>
    api.post<{ data: { code: string; discountValue: number; expiresAt: string | null; alreadyRedeemed: boolean } }>(
      `/certificates/${certificateId}/redeem`,
    ),
};

export interface SavedCode {
  id: number;
  label: string;
  code: string;
  codeType: 'DISCOUNT' | 'COURSE' | 'OTHER';
  note?: string;
  expiresAt?: string | null;
  source: 'MANUAL' | 'AUTO';
  createdAt: string;
}

// "My Code" — the user's personal code wallet (discount + course codes).
export const myCodesApi = {
  getAll: () => api.get<{ data: SavedCode[] }>('/my-codes'),
  add: (data: { label: string; code: string; codeType?: string; note?: string; expiresAt?: string }) =>
    api.post<{ data: SavedCode }>('/my-codes', data),
  remove: (id: number) => api.delete(`/my-codes/${id}`),
  // Admin: grant a code directly into a user's wallet.
  adminGrant: (data: { userId: number; label: string; code: string; codeType?: string; note?: string; expiresAt?: string }) =>
    api.post('/my-codes/admin/grant', data),
};

export interface AdminReview {
  id: number;
  courseId?: number;
  userId?: number;
  userFullName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content?: string;
  createdAt: string;
  isApproved: boolean;
  course?: { id: number; title: string; slug: string };
}

// Admin: course-review moderation (approve/hide/delete).
export const adminReviewsApi = {
  list: (courseId?: number) => api.get<{ data: AdminReview[] }>('/courses/reviews/moderation', { params: courseId ? { courseId } : undefined }),
  moderate: (id: number, isApproved: boolean) => api.patch(`/courses/reviews/${id}/moderate`, { isApproved }),
  remove: (id: number) => api.delete(`/courses/reviews/${id}`),
};

export interface MyCourseOrder {
  id: number;
  orderCode: string;
  status: string;
  amount: number;
  originalAmount?: number;
  discountCode?: string;
  paymentMethod: string;
  paymentTxnNo?: string;
  paymentBankCode?: string;
  paymentPayDate?: string | null;
  createdAt: string;
  course: { id: number; slug: string; title: string; thumbnailUrl?: string | null } | null;
}

// The user's course-purchase history (VNPay), for the Lịch sử mua hàng page.
export const courseOrdersApi = {
  getMine: () => api.get<{ data: MyCourseOrder[] }>('/payments/orders/my'),
};

export default api;

// ─── Social Feed API ──────────────────────────────────────────────────────────

export const socialApi = {
  // Feed
  getFeed: (params?: {
    cursor?: number;
    limit?: number;
    authorId?: number;
    visibility?: string;
    /** Filter to posts containing this hashtag (backend handles # prefix). */
    hashtag?: string;
    // Phase 5 home upgrade: filter tabs.
    // • sort: 'recent' (default) | 'popular' (last 7 days, ranked
    //   by likes+comments+saves).
    // • following: when true, restrict to authors the viewer follows.
    sort?: 'recent' | 'popular';
    following?: boolean;
    // Content-type tab filter (Bài viết / Video / File). Omitted = all.
    type?: 'POST' | 'VIDEO' | 'FILE';
    // Video-category filter (home feed video pills). Omitted = all.
    videoCategoryId?: number;
  }) => api.get('/social/posts', { params }),

  /** Per-content-type counts for the feed tab badges. */
  getFeedCounts: () => api.get('/social/posts/counts'),

  /**
   * Mục lục một loạt bài nhiều kỳ (vd. `100-ngay-java`): [{day, postId,
   * title}]. Nhẹ có chủ đích — server chỉ trả tiêu đề, không trả thân bài
   * — để thanh nhảy-theo-ngày không phải tải cả trăm bài về.
   */
  getSeriesIndex: (slug: string) => api.get(`/social/series/${slug}`),

  getPost: (id: number) => api.get(`/social/posts/${id}`),
  createPost: (data: {
    content: string;
    visibility?: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
    // Optional YouTube URL attached to the post (rendered as embed
    // on the post card). When provided, the user can paste a link
    // instead of uploading a video file.
    youtubeUrl?: string;
    // Content-type bucket for the feed tabs. Optional — the server
    // derives it from media/youtubeUrl when omitted.
    type?: 'POST' | 'VIDEO' | 'FILE';
    // Optional video category (only meaningful for VIDEO posts).
    videoCategoryId?: number | null;
    // "Hiện ở mục Tất cả" checkbox. Only honoured for VIDEO posts with a
    // category; false = the post only surfaces under its category pill.
    showInAll?: boolean;
    media?: Array<{
      type: string;
      url: string;
      thumbnail?: string;
      width?: number;
      height?: number;
      duration?: number;
      fileSize?: number;
      mimeType?: string;
      // For FILE attachments (zip, md, …) the original file
      // name. Drives the suggested filename on download.
      fileName?: string;
      alt?: string;
      sortOrder?: number;
    }>;
    // Phase 2 — optional poll attached to the post.
    poll?: {
      question: string;
      options: string[];
      multiChoice?: boolean;
      closesAt?: string;
    };
    // Phase 3 add — Instagram-style music sticker. The composer
    // searches the music library, picks a track, and sends the
    // track id (plus optional start-seconds offset). The server
    // validates the track exists and is active before persisting.
    //
    // Phase 5: also send `musicEndSec` and the canonical
    // `postMusic` block so the trimmed snippet the user picked
    // in MusicPickerModal actually makes it through to the
    // published post. Backend's createPost prefers `postMusic`
    // when present (and falls back to legacy `musicTrackId`
    // for backward compatibility with older composer flows).
    musicTrackId?: number;
    musicStartSec?: number;
    musicEndSec?: number;
    postMusic?: {
      songId: number;
      startSec?: number;
      endSec?: number;
    };
  }) => api.post('/social/posts', data),

  updatePost: (id: number, data: { content?: string; visibility?: string }) =>
    api.patch(`/social/posts/${id}`, data),

  deletePost: (id: number) => api.delete(`/social/posts/${id}`),

  // Like — legacy endpoints kept for any caller that still uses
  // them. The new reaction picker UI calls `reactPost` instead.
  likePost: (id: number) => api.post(`/social/posts/${id}/like`),
  unlikePost: (id: number) => api.delete(`/social/posts/${id}/like`),

// ─── Post actions (Phase 3: FB-style menu) ─────────────────
feedbackPost: (id: number, type: 'INTERESTED' | 'NOT_INTERESTED') =>
  api.post(`/social/posts/${id}/feedback`, { type }),
removeFeedback: (id: number) =>
  api.delete(`/social/posts/${id}/feedback`),
subscribePost: (id: number) =>
  api.post(`/social/posts/${id}/subscribe`),
unsubscribePost: (id: number) =>
  api.delete(`/social/posts/${id}/subscribe`),
hidePost: (id: number) =>
  api.post(`/social/posts/${id}/hide`),
reportPost: (id: number, reason: string, details?: string) =>
  api.post(`/social/posts/${id}/report`, { reason, details }),
archivePost: (id: number) =>
  api.post(`/social/posts/${id}/archive`),
unarchivePost: (id: number) =>
  api.delete(`/social/posts/${id}/archive`),
pinPost: (id: number) =>
  api.post(`/social/posts/${id}/pin`),
snoozeUser: (userId: number) =>
  api.post(`/users/${userId}/snooze`),
unsnoozeUser: (userId: number) =>
  api.delete(`/users/${userId}/snooze`),
followUser: (targetId: number) =>
  api.post('/users/follow', { targetId }),
unfollowUser: (targetId: number) =>
  api.post('/users/follow', { targetId }),

  // ─── Multi-emoji reactions (added 2026-06-20) ──────────────────
  // Toggle semantics:
  //   first click T    → insert T
  //   click T again    → remove T
  //   click T' (≠ T)   → swap to T'
  // Response carries the per-type breakdown so the card can
  // update the emoji stack without an extra round-trip.
  reactPost: (id: number, type: ReactionType) =>
    api.post<{
      success: true;
      data: {
        reacted: boolean;
        myType: ReactionType | null;
        likesCount: number;
        breakdown: ReactionBreakdown;
      };
    }>(`/social/posts/${id}/react`, { type }),

  // Comments
  getComments: (postId: number, params?: { cursor?: number; limit?: number }) =>
    api.get(`/social/posts/${postId}/comments`, { params }),

  // Phase 5 home upgrade: lazy-load more replies for a thread.
  // Called when the user clicks "Xem thêm N phản hồi" on a
  // top-level comment whose `hasMoreReplies` flag is true.
  getCommentReplies: (rootId: number, params?: { cursor?: number; limit?: number }) =>
    api.get(`/social/comments/by-root/${rootId}`, { params }),

  createComment: (data: {
    postId: number;
    parentId?: number;
    content: string;
    // @mention ids (added 2026-06-20). The backend de-dupes and
    // strips self-mentions, so the client can pass anything it
    // likes. The CommentSection builds this list from the
    // @-picker UI it owns.
    mentions?: number[];
    // Rich media (GIF / sticker / uploaded image). content may be empty.
    mediaUrl?: string;
    mediaKind?: 'gif' | 'sticker' | 'image';
  }) => api.post('/social/comments', data),

  updateComment: (id: number, content: string) =>
    api.patch(`/social/comments/${id}`, { content }),

  deleteComment: (id: number) => api.delete(`/social/comments/${id}`),
  likeComment: (id: number) => api.post(`/social/comments/${id}/like`),

  // Save
  savePost: (id: number, folder?: string) =>
    api.post(`/social/posts/${id}/save`, { folder }),
  unsavePost: (id: number) => api.delete(`/social/posts/${id}/save`),
  getSaved: (params?: { cursor?: number; limit?: number; folder?: string }) =>
    api.get('/social/saves', { params }),
  getSaveFolders: () => api.get('/social/saves/folders'),

  // ── Saved Collections (added 2026-06-20) ─────────────────────
  // Legacy methods below — kept for callers that still use
  // the old string-based folder API. The legacy popover in
  // SocialSavePopover.tsx calls `createCollection`.
  listCollections: () =>
    api.get<{
      success: true;
      data: {
        collections: Array<{ name: string | null; count: number }>;
        uncategorized: number;
        total: number;
      };
    }>('/feed/collections'),
  createCollection: (name: string) =>
    api.post<{
      success: true;
      data: { name: string; count: number; newlyCreated: boolean };
    }>('/feed/collections', { name }),
  savePostToCollection: (postId: number, collection: string | null, remove = false) =>
    api.post<{ success: true; data: { saved: boolean; folder?: string | null } }>(
      '/feed/save-post',
      { postId, collection, remove },
    ),

  // ── Saved Collections v2 (2026-06-20) ────────────────────────
  // Multi-folder bookmark backed by the `FeedCollection` +
  // `FeedSavedPost` tables. Each post can be saved into
  // MULTIPLE collections (unlike the legacy single-folder
  // model). The contract is ID-based, not name-based.
  listCollectionsV2: () =>
    api.get<{
      success: true;
      data: import('@/types/social').FeedCollectionsResponse;
    }>('/feed/collections'),
  createCollectionV2: (name: string, icon?: string) =>
    api.post<{
      success: true;
      data: import('@/types/social').FeedCollectionCreated;
    }>('/feed/collections', { name, icon }),
  deleteCollectionV2: (id: number) =>
    api.delete<{ success: true; data: { deletedCollectionId: number; affectedPosts: number } }>(
      `/feed/collections/${id}`,
    ),
  renameCollectionV2: (id: number, name: string) =>
    api.patch<{ success: true; data: { id: number; name: string } }>(
      `/feed/collections/${id}`,
      { name },
    ),
  savePostToCollections: (postId: number, collectionIds: number[]) =>
    api.post<{
      success: true;
      data: import('@/types/social').FeedSaveResult;
    }>('/feed/save-post-v2', { postId, collectionIds }),
  getPostSaveContext: (postId: number) =>
    api.get<{
      success: true;
      data: import('@/types/social').FeedPostSaveContext;
    }>(`/feed/save-context`, { params: { postId } }),
  listSavedPostsInCollection: (
    collectionId: number | null,
    params: { cursor?: number; limit?: number } = {},
  ) =>
    api.get<{
      success: true;
      data: import('@/types/social').FeedSavedPostsResponse;
    }>(
      `/feed/collections/${collectionId === null ? 'uncategorized' : collectionId}/posts`,
      { params },
    ),

  // Share / Repost — toggle endpoint (Phase 6)
  // Returns { shared: boolean } — true = now shared, false = now unshared
  sharePost: (id: number, platform?: string) =>
    api.post<{ success: true; data: { shared: boolean } }>(`/social/posts/${id}/share`, { platform }),

  // Get share status for a post
  getShareStatus: (id: number) =>
    api.get<{ success: true; data: { isShared: boolean } }>(`/social/posts/${id}/share-status`),

  // Polls
  votePoll: (pollId: number, optionIds: number[]) =>
    api.post(`/social/polls/${pollId}/vote`, { optionIds }),

  getPoll: (pollId: number) => api.get(`/social/polls/${pollId}`),

  // Media upload via signed URL
  // Note: Uses /files/upload endpoint directly since Nginx routes /api/v1 to backend
  getSignedUploadUrl: (filename: string, type: 'IMAGE' | 'VIDEO' | 'CODE_FILE') => {
    const folder = type === 'VIDEO' ? 'social/videos' : type === 'CODE_FILE' ? 'social/files' : 'social/images';
    const mimeType = type === 'VIDEO' ? 'video/mp4' : type === 'CODE_FILE' ? 'application/zip' : 'image/jpeg';
    return api.get('/files/upload/signed-url', {
      params: { filename, folder, contentType: mimeType },
    });
  },
};

// ─── Video categories (home-feed video classification) ──────────
export const videoCategoriesApi = {
  /** Public: active categories for the feed filter pills. */
  list: () => api.get('/video-categories'),
  /** Admin: every category (active + hidden) with post counts. */
  listAll: () => api.get('/video-categories/all'),
  create: (data: { name: string; sortOrder?: number; isActive?: boolean }) =>
    api.post('/video-categories', data),
  update: (id: number, data: { name?: string; sortOrder?: number; isActive?: boolean }) =>
    api.put(`/video-categories/${id}`, data),
  remove: (id: number) => api.delete(`/video-categories/${id}`),
};

// ─── Music Post admin (Phase 4 add) ─────────────────────────────

export interface AdminSong {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  coverImage: string | null;
  durationSec: number;
  fileSize: number | null;
  isActive: boolean;
  uploadedById: number;
  createdAt: string;
  updatedAt: string;
  _count?: { postMusic: number };
}

export const adminSongsApi = {
  list: (params?: { cursor?: number; limit?: number }) =>
    api.get<{
      data: { items: AdminSong[]; nextCursor: number | null };
    }>('/admin/songs', { params }),
  get: (id: number) => api.get<{ data: AdminSong }>(`/admin/songs/${id}`),
  create: (data: {
    title: string;
    artist: string;
    audioUrl: string;
    coverImage?: string;
    durationSec?: number;
    fileSize?: number;
  }) => api.post<{ data: AdminSong }>('/admin/songs', data),
  update: (id: number, data: Partial<Omit<AdminSong, 'id' | 'createdAt' | 'updatedAt' | 'uploadedById'>>) =>
    api.patch<{ data: AdminSong }>(`/admin/songs/${id}`, data),
  setActive: (id: number, isActive: boolean) =>
    api.patch<{ data: AdminSong }>(`/admin/songs/${id}/active`, { isActive }),
  remove: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/admin/songs/${id}`),
};

// Phase 4 add — public-facing read of the curated Song pool.
// The composer uses this to populate MusicPickerModal. We
// expose a generous limit (30) so the picker can show the
// newest tracks first without paging.
export const publicSongsApi = {
  list: (params?: { q?: string; cursor?: number; limit?: number }) =>
    api.get<{
      data: { items: AdminSong[]; nextCursor: number | null };
    }>('/songs', { params }),
  get: (id: number) => api.get<{ data: AdminSong }>(`/songs/${id}`),
  getFeed: (params?: { q?: string; cursor?: number; limit?: number }) =>
    publicSongsApi.list(params),
  // Bridge a public music-page track (MusicTrack) into the Song
  // pool so the composer can attach it like a normal "Nhạc nền".
  // Backend find-or-creates a Song and returns it.
  fromMusicTrack: (musicTrackId: number) =>
    api.post<{ data: AdminSong }>('/songs/from-music-track', { musicTrackId }),
};

// ─── In-app social notifications (added 2026-06-20) ──────────────────
// Wraps /social/notifications (cursor-paginated list, PATCH to
// mark read, GET /unread-count for the bell badge). All three
// endpoints require an authenticated user.
export const notificationApi = {
  list: (params?: { cursor?: number; limit?: number }) =>
    api.get<{
      success: true;
      data: {
        items: import('@/types/social').SocialNotification[];
        pagination: { nextCursor: number | null; hasNextPage: boolean; limit: number };
        unreadCount: number;
      };
    }>('/social/notifications', { params }),

  unreadCount: () =>
    api.get<{ success: true; data: { unreadCount: number } }>(
      '/social/notifications/unread-count',
    ),

  markRead: (body: { all?: boolean; ids?: number[] } = { all: true }) =>
    api.patch<{ success: true; data: { updated: number } }>(
      '/social/notifications',
      body,
    ),
};

// ─── Settings: cross-device preferences (added 2026-08-08) ──────────────────

/** Sound slots. Mirrors SoundKind in lib/soundStorage.ts and
 *  SOUND_KINDS in the backend's userPreferences.service.ts. */
export type PrefSoundKind =
  | 'message' | 'notification' | 'admin-notification' | 'login' | 'post' | 'like';

/** Bell categories the user can mute individually. */
export type PrefNotifyType =
  | 'NEW_POST' | 'NEW_REACTION' | 'NEW_COMMENT' | 'NEW_REPLY' | 'NEW_MENTION'
  | 'NEW_MESSAGE' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT' | 'NEW_FOLLOW'
  | 'NOTE_SHARE' | 'NOTE_COMMENT' | 'NOTE_REPLY' | 'NOTE_MENTION' | 'HUB_SHARE' | 'ADMIN_ANNOUNCEMENT';

export interface ServerPreferences {
  sound: {
    masterEnabled: boolean;
    volume: number;
    enabled: Record<PrefSoundKind, boolean>;
    customFileName: Record<PrefSoundKind, string>;
  };
  notify: {
    types: Record<PrefNotifyType, boolean>;
    browserPush: boolean;
  };
  ui: {
    locale: 'vi' | 'en';
    reduceMotion: boolean;
  };
  updatedAt: string | null;
}

/** Deep-partial: every section of a PATCH is optional, and the server
 *  merges per section rather than replacing the whole blob. */
export type ServerPreferencesPatch = {
  sound?: Partial<Omit<ServerPreferences['sound'], 'enabled' | 'customFileName'>> & {
    enabled?: Partial<Record<PrefSoundKind, boolean>>;
    customFileName?: Partial<Record<PrefSoundKind, string>>;
  };
  notify?: {
    types?: Partial<Record<PrefNotifyType, boolean>>;
    browserPush?: boolean;
  };
  ui?: Partial<ServerPreferences['ui']>;
};

export const preferencesApi = {
  get: () =>
    api.get<{ success: true; data: { theme: 'dark' | 'light'; preferences: ServerPreferences } }>(
      '/users/me/preferences',
    ),
  update: (body: { theme?: 'dark' | 'light'; preferences?: ServerPreferencesPatch }) =>
    api.patch<{ success: true; data: { theme: 'dark' | 'light'; preferences: ServerPreferences } }>(
      '/users/me/preferences',
      body,
    ),
};

// ─── Settings: account erasure requests (added 2026-08-08) ──────────────────

export type DeletionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface AccountDeletionRequest {
  id: number;
  userId: number;
  reason: string | null;
  status: DeletionRequestStatus;
  usernameAtRequest: string | null;
  emailAtRequest: string | null;
  reviewedById: number | null;
  reviewedAt: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDeletionRequest extends AccountDeletionRequest {
  user: {
    id: number; username: string; email: string; fullName: string | null;
    displayName: string | null; avatarUrl: string | null;
    createdAt: string; enabled: boolean;
  } | null;
  reviewedBy: { id: number; username: string; displayName: string | null } | null;
}

export const adminDeletionRequestsApi = {
  list: (params?: { status?: DeletionRequestStatus; cursor?: number; take?: number }) =>
    api.get<{
      success: true;
      data: {
        items: AdminDeletionRequest[];
        pagination: { nextCursor: number | null; hasNextPage: boolean; limit: number };
      };
    }>('/admin/deletion-requests', { params }),

  stats: () =>
    api.get<{
      success: true;
      data: { pending: number; approved: number; rejected: number; cancelled: number };
    }>('/admin/deletion-requests/stats'),

  approve: (id: number, note?: string) =>
    api.post<{ success: true; data: { request: AccountDeletionRequest } }>(
      `/admin/deletion-requests/${id}/approve`, { note },
    ),

  reject: (id: number, note?: string) =>
    api.post<{ success: true; data: { request: AccountDeletionRequest } }>(
      `/admin/deletion-requests/${id}/reject`, { note },
    ),
};

// ─── Stories / Tin API (Phase 6) ────────────────────────────────────────────────

export interface Story {
  id: number;
  userId: number;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  caption: string | null;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO';
  duration: number | null;
  thumbnail: string | null;
  backgroundColor: string | null;
  expiresAt: string;
  createdAt: string;
  isOwn: boolean;
  hasViewed: boolean;
  viewsCount: number;
  user: {
    id: number;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

export interface StoryHighlight {
  id: number;
  name: string;
  sortOrder: number;
  stories: Array<{
    id: number;
    thumbnail: string | null;
    mediaUrl: string | null;
    createdAt: string;
  }>;
}

export const storiesApi = {
  // Create story
  create: (data: {
    visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
    caption?: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    duration?: number;
    thumbnail?: string;
    backgroundColor?: string;
  }) =>
    api.post<{ success: true; data: Story }>('/stories', data),

  // Get stories for home feed bar
  getFeedStories: () =>
    api.get<{ success: true; data: Story[] }>('/stories/feed'),

  // Get user's stories (for profile)
  getUserStories: (userId: number) =>
    api.get<{ success: true; data: Story[] }>(`/stories/user/${userId}`),

  // Get all stories for viewer (ring)
  getRingStories: () =>
    api.get<{ success: true; data: Story[] }>('/stories/ring'),

  // Get single story
  getStory: (storyId: number) =>
    api.get<{ success: true; data: Story }>(`/stories/${storyId}`),

  // View a story
  viewStory: (storyId: number) =>
    api.post<{ success: true; data: { viewed: boolean } }>(`/stories/${storyId}/view`),

  // Delete story
  deleteStory: (storyId: number) =>
    api.delete<{ success: true; data: { deleted: boolean } }>(`/stories/${storyId}`),

  // Hide story
  hideStory: (storyId: number) =>
    api.post<{ success: true; data: { hidden: boolean } }>(`/stories/${storyId}/hide`),

  // Add to highlight
  addToHighlight: (storyId: number, name: string) =>
    api.post<{ success: true; data: { added: boolean; highlightId: number } }>(
      `/stories/${storyId}/highlight`,
      { name },
    ),

  // Get user's highlights
  getHighlights: (userId: number) =>
    api.get<{ success: true; data: StoryHighlight[] }>(`/stories/highlights/${userId}`),

  // Delete highlight
  deleteHighlight: (name: string) =>
    api.delete<{ success: true; data: { deleted: boolean } }>('/stories/highlights', {
      data: { name },
    }),

  // Update privacy
  updatePrivacy: (storyId: number, visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE') =>
    api.patch<{ success: true; data: { updated: boolean } }>(
      `/stories/${storyId}/privacy`,
      { visibility },
    ),
};

// ─── Cyber Gamification API ─────────────────────────────────────────────────────

export type CyberTaskType = 'TASK' | 'STUDY' | 'ROUTINE';

export interface CyberTask {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  type: CyberTaskType;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  expReward: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CyberProfile {
  id: number;
  userId: number;
  level: number;
  currentExp: number;
  totalPoints: number;
  requiredExp: number;
  updatedAt: string;
  createdAt: string;
}

export interface CyberInventory {
  id: number;
  userId: number;
  pointBalance: number;
  updatedAt: string;
  createdAt: string;
  coupons: DiscountCode[];
}

export interface DiscountCode {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  description: string | null;
  createdAt: string;
}

export interface CyberAnalytics {
  labels: string[];
  cpuLoad: number[];
  ramUsage: number[];
  netLoad: number[];
  totalTasks: number;
  completedTasks: number;
  totalExpEarned: number;
  level: number;
  currentExp: number;
}

export interface ToggleResult {
  task: CyberTask;
  profile: CyberProfile;
  leveledUp: boolean;
  expGranted: number;
  dailyCapHit: boolean;
}

export const cyberApi = {
  getTasks: (date: string) =>
    api.get<ApiResponse<CyberTask[]>>(`/cyber/tasks?date=${date}`),

  createTask: (data: {
    title: string;
    description?: string;
    type: CyberTaskType;
    startTime: string;
    endTime: string;
    expReward: number;
    date: string;
  }) => api.post<ApiResponse<CyberTask>>('/cyber/tasks', data),

  toggleTask: (id: number) =>
    api.patch<ApiResponse<ToggleResult>>(`/cyber/tasks/${id}/toggle`),

  deleteTask: (id: number) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/cyber/tasks/${id}`),

  getProfile: () =>
    api.get<ApiResponse<CyberProfile>>('/cyber/profile'),

  getInventory: () =>
    api.get<ApiResponse<CyberInventory>>('/cyber/inventory'),

  mintCoupon: (discountAmount: number) =>
    api.post<ApiResponse<DiscountCode>>('/cyber/inventory/mint-coupon', { discountAmount }),

  getAnalytics: (period: 'day' | 'month' | 'year') =>
    api.get<ApiResponse<CyberAnalytics>>(`/cyber/analytics?period=${period}`),
};

// ─── Direct Messaging API ─────────────────────────────
// Wraps the messaging REST endpoints behind a single object
// so the messaging store and components can talk to the
// backend without sprinkling `api.get('/messages/...')` calls
// throughout the UI code.
export const messagingApi = {
  // Threads
  getOrCreateAdminThread: () =>
    api.post<ApiResponse<MessagingThread>>('/messages/threads/admin'),
  getOrCreateUserThread: (peerId: number) =>
    api.post<ApiResponse<MessagingThread>>(`/messages/threads/user/${peerId}`),
  listThreads: (scope?: 'personal' | 'support') =>
    api.get<ApiResponse<MessagingThread[]>>('/messages/threads', {
      params: scope === 'support' ? { scope } : undefined,
    }),
  // The "Đã xoá" recovery tab — threads the viewer soft-deleted.
  listDeletedThreads: () =>
    api.get<ApiResponse<MessagingThread[]>>('/messages/threads', {
      params: { view: 'deleted' },
    }),
  getThread: (threadId: number) =>
    api.get<ApiResponse<MessagingThread>>(`/messages/threads/${threadId}`),

  // Messages
  listMessages: (threadId: number, params?: { cursor?: number; limit?: number }) =>
    api.get<ApiResponse<MessagingMessage[]>>(`/messages/threads/${threadId}/messages`, { params }),
  // Phase 6: postShare param for sharing social posts into chat
  sendMessage: (threadId: number, data: { content?: string; fileIds?: number[]; parentMessageId?: number | null; postShare?: { postId: number }; media?: { url: string; kind: 'gif' | 'sticker' } }) =>
    api.post<ApiResponse<MessagingMessage>>(`/messages/threads/${threadId}/messages`, data),
  markRead: (threadId: number) =>
    api.patch<ApiResponse<{ success: boolean }>>(`/messages/threads/${threadId}/read`),
  deleteMessage: (messageId: number) =>
    api.delete<ApiResponse<{ success: boolean }>>(`/messages/messages/${messageId}`),
  recallMessage: (messageId: number) =>
    api.post<ApiResponse<{ success: boolean }>>(`/messages/messages/${messageId}/recall`),
  toggleReaction: (messageId: number, emoji: string) =>
    api.post<ApiResponse<{ action: 'added' | 'removed'; summary: MessagingReaction[] }>>(
      `/messages/messages/${messageId}/reactions`,
      { emoji },
    ),
  setNickname: (threadId: number, targetId: number, alias: string) =>
    api.put<ApiResponse<unknown>>(`/messages/threads/${threadId}/nickname`, { targetId, alias }),
  listNicknames: () =>
    api.get<ApiResponse<Array<{ threadId: number; targetId: number; alias: string }>>>(
      '/messages/nicknames',
    ),
  getOnlineUsers: () =>
    api.get<ApiResponse<{ userIds: number[] }>>('/messages/online'),
  uploadAttachment: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post<ApiResponse<MessagingUploadedFile>>('/messages/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Unread badge
  getUnreadCount: () =>
    api.get<ApiResponse<{ count: number }>>('/messages/unread-count'),

  // Per-user thread preferences (Pin / Mute / Archive / Mark unread).
  // Body shape: { slot, value: ISOString | null }
  updatePreference: (
    threadId: number,
    payload: { slot: 'pinnedAt' | 'mutedUntil' | 'archivedAt' | 'markedUnreadAt'; value: string | null },
  ) =>
    api.patch<ApiResponse<{ preferences: MessagingThreadPreference | null }>>(
      `/messages/threads/${threadId}/preference`,
      payload,
    ),
  archiveThread: (threadId: number) =>
    api.delete<ApiResponse<{ preferences: MessagingThreadPreference | null }>>(
      `/messages/threads/${threadId}`,
    ),
  unarchiveThread: (threadId: number) =>
    api.post<ApiResponse<{ preferences: MessagingThreadPreference | null }>>(
      `/messages/threads/${threadId}/unarchive`,
    ),
  markThreadUnread: (threadId: number) =>
    api.post<ApiResponse<{ preferences: MessagingThreadPreference | null }>>(
      `/messages/threads/${threadId}/mark-unread`,
    ),

  // Hard-delete the chat from THIS viewer's inbox. Soft delete
  // server-side (preferences.archivedAt + deletedAt); the other
  // participant still keeps their copy. The row is filtered out
  // of every sidebar tab for the deleter.
  deleteChat: (threadId: number) =>
    api.delete<ApiResponse<{ preferences: MessagingThreadPreference | null; deleted: boolean }>>(
      `/messages/threads/${threadId}/hard`,
    ),

  // Undo a "Delete chat" — restores the thread (and its history) to
  // the inbox. Backs the "Đã xoá" recovery tab.
  restoreChat: (threadId: number) =>
    api.post<ApiResponse<{ preferences: MessagingThreadPreference | null; restored: boolean }>>(
      `/messages/threads/${threadId}/restore`,
    ),

  // Mute with a duration. Body: { durationMinutes: number | null }
  //   0      → unmute
  //   15     → 15 minutes
  //   60     → 1 hour
  //   480    → 8 hours
  //   1440   → 24 hours
  //   null   → mute until further notice (year 9999 on the server)
  muteFor: (threadId: number, durationMinutes: number | null) =>
    api.post<ApiResponse<{ preferences: MessagingThreadPreference | null }>>(
      `/messages/threads/${threadId}/mute-for`,
      { durationMinutes },
    ),

  // Report a thread to moderators. Body: { reason, category? }.
  reportThread: (threadId: number, payload: { reason: string; category?: 'spam' | 'harassment' | 'hate' | 'impersonation' | 'other' | null }) =>
    api.post<ApiResponse<{ id: number; createdAt: string }>>(
      `/messages/threads/${threadId}/report`,
      payload,
    ),

  // Per-viewer blocklist (Messenger-style "blocked users" sheet).
  listBlocked: () =>
    api.get<ApiResponse<Array<MessagingBlockedUser>>>('/messages/blocks'),
  blockUser: (userId: number, reason?: string) =>
    api.post<ApiResponse<{ ok: boolean; blockedId: number }>>(
      `/messages/blocks/${userId}`,
      reason ? { reason } : {},
    ),
  unblockUser: (userId: number) =>
    api.delete<ApiResponse<{ ok: boolean; blockedId: number }>>(
      `/messages/blocks/${userId}`,
    ),
};

// ─── Stickers ───────────────────────────────────────────────
export interface StickerPack {
  id: number;
  slug: string;
  name: string;
  coverUrl: string | null;
  stickerCount?: number;
  isActive?: boolean;
}
export interface Sticker {
  id: number;
  packId: number;
  url: string;
  label: string | null;
}

export const stickerApi = {
  // Public (chat picker)
  listPacks: () => api.get<ApiResponse<StickerPack[]>>('/stickers/packs'),
  listStickers: (packId: number) =>
    api.get<ApiResponse<Sticker[]>>(`/stickers/packs/${packId}/stickers`),
  // Admin
  adminListPacks: () => api.get<ApiResponse<StickerPack[]>>('/stickers/admin/packs'),
  adminCreatePack: (name: string, slug?: string) =>
    api.post<ApiResponse<StickerPack>>('/stickers/admin/packs', { name, slug }),
  adminUpdatePack: (id: number, data: { name?: string; isActive?: boolean; coverUrl?: string }) =>
    api.patch<ApiResponse<unknown>>(`/stickers/admin/packs/${id}`, data),
  adminDeletePack: (id: number) =>
    api.delete<ApiResponse<unknown>>(`/stickers/admin/packs/${id}`),
  adminDeleteSticker: (id: number) =>
    api.delete<ApiResponse<unknown>>(`/stickers/admin/stickers/${id}`),
  adminAddSticker: (packId: number, file: File, label?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (label) fd.append('label', label);
    return api.post<ApiResponse<Sticker>>(`/stickers/admin/packs/${packId}/stickers`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export interface MessagingBlockedUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  reason: string | null;
  blockedAt: string;
}

// ─── Messaging types (mirror the backend serialiser) ────
export interface MessagingPeer {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

/**
 * Per-viewer preference set stored in the MessageThread JSONB
 * `preferences` column under the viewer's userId. Each slot is
 * optional — its presence means "yes" (e.g. pinnedAt is set = pinned)
 * and `null` means "not set".
 */
export interface MessagingThreadPreference {
  pinnedAt?: string;
  mutedUntil?: string;
  archivedAt?: string;
  markedUnreadAt?: string;
  deletedAt?: string;
}

// ─── Admin moderation queue (thread reports) ──────────
// Used by /admin/reports page. The shape mirrors the backend
// `listReports` response in src/services/messaging-safety.service.ts.
export interface MessagingThreadReport {
  id: number;
  reason: string;
  category: 'spam' | 'harassment' | 'hate' | 'impersonation' | 'other' | null;
  createdAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  reporter: {
    id: number;
    username: string;
    displayName: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  resolver: {
    id: number;
    username: string;
    displayName: string | null;
  } | null;
  thread: {
    id: number;
    type: 'ADMIN' | 'USER';
    userA: {
      id: number;
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
    userB: {
      id: number;
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
    lastMessage: {
      id: number;
      content: string;
      senderId: number;
      createdAt: string;
    } | null;
  } | null;
}

export interface MessagingThreadReportStats {
  open: number;
  resolved24h: number;
  total: number;
}

export interface MessagingThreadReportList {
  rows: MessagingThreadReport[];
  nextCursor: number | null;
}

// Admin reports API — mounted under /api/v1/admin/reports
// by src/routes/admin.reports.routes.ts.
export const adminReportsApi = {
  list: (params?: { status?: 'open' | 'resolved'; cursor?: number; take?: number }) =>
    api.get<ApiResponse<MessagingThreadReportList>>('/admin/reports', { params }),
  stats: () =>
    api.get<ApiResponse<MessagingThreadReportStats>>('/admin/reports/stats'),
  resolve: (reportId: number, resolution?: string) =>
    api.post<ApiResponse<{ id: number; resolvedAt: string }>>(
      `/admin/reports/${reportId}/resolve`,
      resolution ? { resolution } : {},
    ),
};

export interface MessagingThread {
  id: number;
  type: 'ADMIN' | 'USER';
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  peer: (MessagingPeer & { alias?: string | null }) | null;
  lastMessage?: {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
    hasAttachment: boolean;
    attachmentMime?: string | null;
    attachmentName?: string | null;
  } | null;
  unreadCount?: number;
  /** Per-viewer preferences. Backend omits this for non-participants. */
  preferences?: MessagingThreadPreference | null;
}

export interface MessagingAttachment {
  id: number;
  fileId: number;
  mimeType: string;
  fileName: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string | null;
}

export interface MessagingReadReceipt {
  userId: number;
  readAt: string;
}

export interface MessagingReaction {
  emoji: string;
  count: number;
  userIds: number[];
}

export interface MessagingMessage {
  id: number;
  threadId: number;
  senderId: number;
  content: string;
  // Rich media (GIF / sticker). Both null for plain messages.
  mediaUrl?: string | null;
  mediaKind?: 'gif' | 'sticker' | 'image' | null;
  deleted: boolean;
  recalled?: boolean;
  recalledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender: MessagingPeer;
  attachments: MessagingAttachment[];
  readBy?: MessagingReadReceipt[];
  reactions?: MessagingReaction[];
  parentMessageId?: number | null;
  parentMessage?: {
    id: number;
    senderId: number;
    senderName: string;
    content: string;
  } | null;
  // Phase 6: Shared post preview in chat
  postShare?: {
    id: number;
    postId: number;
    authorUsername: string;
    authorDisplay?: string | null;
    authorAvatar?: string | null;
    contentPreview: string;
    mediaThumbnail?: string | null;
  } | null;
}

export interface MessagingUploadedFile {
  fileId: number;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// ─── Payment API (VNPay) ───────────────────────────────────
export const paymentApi = {
  // Create a course order, return VNPay paymentUrl to redirect to.
  // We generate a fresh idempotencyKey here (UUIDv4) so the same
  // client retrying — e.g. because the network dropped before the
  // redirect — gets the same order back instead of two.
  createCourseOrder(courseId: number, discountCode?: string) {
    const idempotencyKey =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return api.post('/payments/course', {
      courseId,
      idempotencyKey,
      ...(discountCode ? { discountCode } : {}),
    });
  },
  // Unified VNPAY-QR entry point for an EXISTING order (course or
  // product). Returns { paymentUrl, txnRef, amount, orderType }. The
  // caller renders paymentUrl as a QR code. Used by the Shop flow (whose
  // order-create endpoint doesn't return a paymentUrl) and available to
  // Academy as well.
  createPaymentQr(orderId: number, orderType: 'COURSE' | 'PRODUCT') {
    return api.post('/payments/create-qr', { orderId, orderType });
  },
  // PayOS (primary). Creates a checkout link for an existing course order
  // → { checkoutUrl }. Returns 503 if PayOS isn't configured yet.
  createPayos(orderCode: string) {
    return api.post<{ data: { checkoutUrl: string; qrCode: string; orderCode: string } }>('/payments/payos/create', { orderCode });
  },
  // Poll order status after redirect from VNPay
  getOrderStatus(orderCode: string) {
    return api.get(`/payments/order/${encodeURIComponent(orderCode)}`);
  },
  // Admin: paginated list of all course orders
  adminListOrders(params?: {
    status?: string;
    courseId?: number;
    page?: number;
    pageSize?: number;
  }) {
    return api.get('/payments/admin/orders', { params });
  },
  // Admin: audit trail of IPN callbacks for a given order
  adminListTransactions(orderCode: string) {
    return api.get(
      `/payments/admin/transactions/${encodeURIComponent(orderCode)}`,
    );
  },
  // Admin: update enrollment (set/clear expiresAt, change status)
  adminUpdateEnrollment(data: {
    userId: number;
    courseId: number;
    expiresAt?: string | null;
    status?: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
  }) {
    return api.patch('/payments/admin/enrollment', data);
  },
  // Admin: revoke enrollment
  adminRevokeEnrollment(userId: number, courseId: number) {
    return api.delete('/payments/admin/enrollment', {
      data: { userId, courseId },
    });
  },
  // Admin: list all enrollments with source detection
  adminListEnrollments(params?: {
    keyword?: string;
    page?: number;
    pageSize?: number;
  }) {
    return api.get('/payments/admin/enrollments', { params });
  },
  // Admin: issue refund (full or partial)
  adminRefundOrder(data: {
    orderCode: string;
    refundAmount?: number;
    reason: string;
  }) {
    return api.post('/payments/admin/refund', data);
  },
};

// ─── GitHub Repo Hub API ─────────────────────────────────────────────────────
// Public + admin endpoints for the curated GitHub repo feed.
// Public methods hit /api/v1/repos/* and work without a session;
// admin methods require ROLE_ADMIN (the backend enforces this).

export interface GithubRepoTag {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface GithubRepo {
  id: string;
  repoName: string;
  owner: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  /** ISO timestamp of the newest commit; null until the repo has been synced. */
  pushedAt: string | null;
  language: string | null;
  description: string | null;
  myReview: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
  tags: GithubRepoTag[];
}

export interface GithubRepoListResponse {
  items: GithubRepo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort?: string;
}

export const githubApi = {
  // ─── Public feed ─────────────────────────────────────────────────────
  list(params?: {
    page?: number;
    pageSize?: number;
    tagId?: number;
    /** Multi-tag filter — ANDed server-side. Serialised as `?tagIds=1,2`. */
    tagIds?: number[];
    tagSlug?: string;
    language?: string;
    keyword?: string;
    includeDrafts?: boolean;
    sort?: 'newest' | 'oldest' | 'most-stars' | 'least-stars' | 'name-asc' | 'name-desc';
  }) {
    // axios mặc định tuần tự hoá mảng thành `tagIds[]=1&tagIds[]=2`; backend
    // đọc `tagIds` (lặp hoặc CSV), nên gộp thành CSV cho khỏi lệch tên tham số.
    const { tagIds, ...rest } = params ?? {};
    return api.get<GithubRepoListResponse>('/repos', {
      params: { ...rest, ...(tagIds?.length ? { tagIds: tagIds.join(',') } : {}) },
    });
  },

  detail(id: string) {
    return api.get<{ data: GithubRepo }>(`/repos/${id}`);
  },

  // Aggregations for the sidebar filter chips.
  tags() {
    return api.get<{ data: GithubRepoTag[] }>('/repos/tags');
  },

  languages() {
    return api.get<{ data: { name: string; count: number }[] }>('/repos/languages');
  },

  // ─── Admin ───────────────────────────────────────────────────────────
  create(data: {
    githubUrl: string;
    myReview: string;
    status?: 'DRAFT' | 'PUBLISHED';
    tagIds?: number[];
    tagNames?: string[];
  }) {
    return api.post<{ data: GithubRepo }>('/repos', data);
  },

  update(id: string, data: {
    myReview: string;
    tagIds?: number[];
    tagNames?: string[];
  }) {
    return api.put<{ data: GithubRepo }>(`/repos/${id}`, data);
  },

  setStatus(id: string, status: 'DRAFT' | 'PUBLISHED') {
    return api.patch<{ data: GithubRepo }>(`/repos/${id}/status`, { status });
  },

  remove(id: string) {
    return api.delete<{ success: boolean; message: string }>(`/repos/${id}`);
  },

  syncAll() {
    return api.post<{
      data: {
        total: number;
        updated: number;
        failed: Array<{ id: string; url: string; error: string }>;
      };
    }>('/repos/sync');
  },

  fetchStarred(username: string, limit?: number) {
    return api.post<{
      data: {
        inserted: number;
        skipped: number;
        items: GithubRepo[];
      };
    }>('/repos/fetch-starred', { username, limit });
  },
};

// ══════════════════════════════════════════════════════════════════
// Personal Dashboard API
// ══════════════════════════════════════════════════════════════════
//
// All endpoints require auth (the route file mounts an
// `authenticate` middleware). The dashboard is the user's private
// data — there's no admin view, no shared view, no public view.
// Server is the source of truth; the localStorage mirror exists
// only for offline-first behavior and is rebuilt from the server
// snapshot on every auth-ready event.

export type DashboardActivityType =
  | 'study' | 'work' | 'exercise' | 'cook'
  | 'sleep' | 'rest' | 'leisure' | 'social';

export interface DashboardTask {
  id: number;
  scope: 'today' | 'week' | 'month';
  date: string; // YYYY-MM-DD
  title: string;
  done: boolean;
  exp: number;
  activityType: DashboardActivityType | null;
  createdAt: string;
  completedAt: string | null;
}

export interface DashboardSnapshot {
  level: number;
  exp: number;
  totalExp: number;
  timeline: Array<{ hour: number; activity?: { type: DashboardActivityType; label: string } }>;
  lastCelebratedAt: string | null;
  tomorrowPlanLockedDate: string | null;
  celebratedToday: boolean;
  todayStats: { expAwarded: number; tasksDone: number; tasksTotal: number } | null;
  tasks: DashboardTask[];
}

export interface DashboardExport {
  exportedAt: string;
  version: 1;
  state: {
    level: number;
    exp: number;
    totalExp: number;
    timeline: string; // raw JSON from DB
  } | null;
  tasks: Array<DashboardTask & { archivedAt: string | null }>;
  celebrations: Array<{
    celebratedDate: string;
    expAwarded: number;
    tasksDone: number;
    tasksTotal: number;
    createdAt: string;
  }>;
}

export const dashboardApi = {
  // Returns the full snapshot: state + active tasks + today's
  // celebration marker. Called once on dashboard mount; the
  // local store patches from this and from there does
  // optimistic local updates with background sync.
  get() {
    return api.get<{ data: DashboardSnapshot }>('/dashboard');
  },

  // Patch the state row (level, exp, totalExp, timeline, plan lock).
  // lastCelebratedAt is server-controlled — don't send it here.
  updateState(data: Partial<{
    level: number;
    exp: number;
    totalExp: number;
    timeline: DashboardSnapshot['timeline'];
    tomorrowPlanLockedDate: string | null;
  }>) {
    return api.put<{ data: any }>('/dashboard/state', data);
  },

  // Add a single task. Returns the persisted row (server is the
  // one who assigned the id).
  addTask(data: {
    scope: 'today' | 'week' | 'month';
    title: string;
    exp?: number;
    activityType?: DashboardActivityType | null;
    date?: string;
  }) {
    return api.post<{ data: DashboardTask }>('/dashboard/tasks', data);
  },

  // Bulk-seed a list of titles for a (scope, date) bucket. The
  // server is idempotent — a second call for the same bucket
  // returns `{ skipped: true }` and the existing tasks. Use
  // `replace: true` to wipe-and-reseed (the manual-reset path).
  bulkSeedTasks(data: {
    scope: 'today' | 'week' | 'month';
    titles: string[];
    activityType?: DashboardActivityType | null;
    date?: string;
    replace?: boolean;
  }) {
    return api.post<{
      data: {
        skipped: boolean;
        tasks: DashboardTask[];
      };
    }>('/dashboard/tasks/bulk', data);
  },

  // Toggle done / edit title / change scope / change date. Any
  // combination of the supported fields works.
  patchTask(id: number, data: Partial<{
    title: string;
    done: boolean;
    exp: number;
    activityType: DashboardActivityType | null;
    scope: 'today' | 'week' | 'month';
    date: string;
  }>) {
    return api.patch<{ data: DashboardTask }>(`/dashboard/tasks/${id}`, data);
  },

  // Hard-delete: a manual delete removes the task immediately and
  // permanently (no archive limbo). Auto-expiry of completed tasks
  // is a separate, server-driven path (see the dashboard cron).
  removeTask(id: number) {
    return api.delete<{ data: { id: number; deleted: true } }>(`/dashboard/tasks/${id}`);
  },

  // "End of day" celebration. Idempotent: a repeat call returns
  // 409 ALREADY_CELEBRATED with the original record. The client
  // should treat 409 as a no-op (re-render the locked state).
  celebrate() {
    return api.post<{
      data: {
        celebration: { celebratedDate: string; expAwarded: number; tasksDone: number; tasksTotal: number; createdAt: string };
        state: { level: number; exp: number; totalExp: number; lastCelebratedAt: string | null };
        todayStats: { expGained: number; done: number; total: number };
      };
    }>('/dashboard/celebrate');
  },

  // Pre-create tomorrow's tasks. The server archives any
  // existing tomorrow tasks for the same user, so this is a
  // clean replace — the user's new plan supersedes any
  // auto-generated defaults from earlier in the day.
  planTomorrow(data: { titles: string[]; activityType?: DashboardActivityType | null }) {
    return api.post<{
      data: { tomorrowDate: string; tasks: DashboardTask[] };
    }>('/dashboard/plan-tomorrow', data);
  },

  // Full export — used by the "Export to JSON" backup button.
  // Includes both active and archived tasks + celebration log
  // for the most recent N entries (capped server-side).
  export() {
    return api.get<{ data: DashboardExport }>('/dashboard/export');
  },

  // Restore from a previous export. Wipes current active tasks
  // (archives them, doesn't hard-delete) and replays the
  // export. Use the DELETE endpoint for a true factory reset.
  import(data: DashboardExport) {
    return api.post<{ data: { imported: true } }>('/dashboard/import', data);
  },

  // "Reset to factory defaults" — requires ?confirm=YES in
  // the body to protect against accidental clicks.
  reset() {
    return api.delete<{ data: { reset: true } }>('/dashboard?confirm=YES');
  },
};

// ───────────────────────────────────────────────────────────────────
// Tech Trends & Insights API (public + admin)
//
// Public endpoints (no auth) read published articles from
// `/tech-trends/*`. Admin endpoints live under
// `/admin/tech-trends` and require ROLE_ADMIN — the auth
// cookie is sent automatically with `withCredentials: true`
// (which is the default in the shared `api` instance).
// ───────────────────────────────────────────────────────────────────

// Shape of a single article in the public response. Mirrors
// the backend `serializeForPublic()` output: body is a
// `string[]` (paragraphs), codeBlock is a typed object, and
// `author` is the joined user record (or null).
// Tier 1A — sidebar table of contents. Server pre-extracts
// these from bodyMdx so the public page can render a sticky
// TOC without re-parsing HTML on every read.
export interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

/**
 * Article categories, mirroring the backend allowlist in
 * `src/routes/techTrends.routes.ts`. This used to be spelled out inline at
 * eight separate places in this file, which is why adding 'DeepDive'
 * (2026-07-30) meant touching all eight. One alias now, so the next category
 * is one edit. Keep it in sync with `app/tech-trends/types.ts` — that copy is
 * the one the page components import.
 */
export type TechTrendCategoryName =
  | 'TechNews'
  | 'FixBug'
  | 'Experience'
  | 'Interviews'
  | 'DeepDive';

export interface PublicTechTrendArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  // News bulletin fields. `kind` separates the daily AI bulletin from
  // hand-written articles; `sources` is the grounding set it was built from and
  // is public on purpose — it is what lets a reader check the claims.
  kind?: 'ARTICLE' | 'NEWS';
  sources?: Array<{
    title: string;
    url: string;
    publisher: string;
    publishedAt: string | null;
    imageUrl: string | null;
  }>;
  aiGenerated?: boolean;
  // Tier 1A — rich body. Server-side rendered from bodyMdx
  // and sanitised at write time, so the public page can
  // dangerouslySetInnerHTML without an extra sanitiser. Legacy
  // articles (pre-Tier 1A) get a fallback paragraph list
  // synthesised on the server.
  bodyHtml: string;
  // Only present in admin responses — the canonical source
  // for the editor.
  bodyMdx?: string | null;
  toc: TocItem[];
  category: TechTrendCategoryName;
  coverEmoji: string | null;
  coverImageUrl: string | null;
  codeBlock: {
    before: { lang: string; lines: string[] };
    after: { lang: string; lines: string[] };
    takeaway: string;
  } | null;
  tags: string[];
  trendingScore: number;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  readTimeMin: number;
  author: {
    id: number;
    username: string;
    fullName: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
  } | null;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Reader comment (+ nested 1-level replies) on a tech-trend article.
export interface TechTrendComment {
  id: number;
  parentId: number | null;
  content: string;
  likesCount: number;
  likedByMe: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null };
  replies: TechTrendComment[];
}

// Light shape for the "Related" cards on the detail page.
export interface RelatedTechTrendArticle {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: TechTrendCategoryName;
  coverEmoji: string | null;
  coverImageUrl: string | null;
  readTimeMin: number;
  publishedAt: string | null;
}

// Admin-side view of an article — same shape as the public
// one but includes the canonical `bodyMdx` (markdown source)
// so the TipTap editor can hydrate. Legacy `body` JsonB is
// still accepted on the wire for back-compat with articles
// written before the Tier 1A migration.
export interface AdminTechTrendArticle extends Omit<PublicTechTrendArticle, 'body'> {
  bodyMdx?: string | null;
  body?: unknown; // legacy JsonB column, kept for back-compat
}

// ── Announcements ("Diễn đàn / Tin tức") ──────────────────────
// Admin-authored announcements shown on /forum. Public list/detail;
// create/update/delete are admin-only (enforced server-side). Mirrors
// the shared envelope: every call resolves to `{ data: <payload> }`.
export type AnnouncementCategory = 'maintenance' | 'update' | 'docs' | 'general';

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: AnnouncementCategory;
  coverImageUrl: string | null;
  isPinned: boolean;
  author: {
    id: number;
    username: string;
    displayName: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementListResponse {
  items: Announcement[];
  nextCursor: number | null;
}

export interface AnnouncementCreateInput {
  title: string;
  body: string;
  category: AnnouncementCategory;
  coverImageUrl?: string | null;
  isPinned?: boolean;
}

export const announcementApi = {
  // Public: cursor-paginated list (pinned first is decided server-side).
  list(cursor?: number | null, limit = 20) {
    return api.get<{ success: boolean; data: AnnouncementListResponse }>('/announcements', {
      params: { cursor: cursor ?? undefined, limit },
    });
  },

  // Public: single announcement by id.
  get(id: number) {
    return api.get<{ success: boolean; data: Announcement }>(`/announcements/${id}`);
  },

  // Admin: create.
  create(data: AnnouncementCreateInput) {
    return api.post<{ success: boolean; data: Announcement }>('/announcements', data);
  },

  // Admin: update.
  update(id: number, data: Partial<AnnouncementCreateInput>) {
    return api.patch<{ success: boolean; data: Announcement }>(`/announcements/${id}`, data);
  },

  // Admin: delete.
  remove(id: number) {
    return api.delete<{ success: boolean; data: { id: number } }>(`/announcements/${id}`);
  },
};

export const techTrendsApi = {
  // Public: list published articles. Supports filtering
  // by category, keyword, and the `featured` flag. The
  // frontend uses a large `size` (default 100) so it can
  // do its own bento-grid ordering and client-side
  // search without paging the server.
  list(params?: {
    category?: TechTrendCategoryName | 'All';
    q?: string;
    featured?: boolean;
    page?: number;
    size?: number;
  }) {
    // The 'All' tab is a client-side filter — the server
    // doesn't need to know about it. Strip it before
    // sending.
    const { category, ...rest } = params ?? {};
    return api.get<{
      data: PublicTechTrendArticle[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/tech-trends/articles', {
      params: category && category !== 'All' ? { category, ...rest } : rest,
    });
  },

  // Public: get a single article. Increments viewCount.
  getById(id: number) {
    return api.get<{ data: PublicTechTrendArticle }>(`/tech-trends/articles/${id}`);
  },

  // Public: get a single article by slug. Increments viewCount.
  // Canonical read surface for the /tech-trends/[slug] detail page.
  getBySlug(slug: string) {
    return api.get<{ data: PublicTechTrendArticle }>(
      `/tech-trends/articles/by-slug/${encodeURIComponent(slug)}`,
    );
  },

  // Public: up to 4 related articles (shared tag or same category).
  getRelated(id: number) {
    return api.get<{ data: RelatedTechTrendArticle[] }>(`/tech-trends/articles/${id}/related`);
  },

  // ── Reader comments (+ likes). Read is public; write needs auth. ──
  listComments(id: number) {
    return api.get<{ data: { comments: TechTrendComment[]; total: number } }>(`/tech-trends/articles/${id}/comments`);
  },
  addComment(id: number, content: string, parentId?: number | null) {
    return api.post<{ data: TechTrendComment }>(`/tech-trends/articles/${id}/comments`, { content, parentId: parentId ?? undefined });
  },
  editComment(commentId: number, content: string) {
    return api.patch<{ data: TechTrendComment }>(`/tech-trends/comments/${commentId}`, { content });
  },
  deleteComment(commentId: number) {
    return api.delete<{ data: { id: number } }>(`/tech-trends/comments/${commentId}`);
  },
  likeComment(commentId: number) {
    return api.post<{ data: { liked: boolean; likesCount: number } }>(`/tech-trends/comments/${commentId}/like`);
  },

  // Public: get category counts for the tab bar.
  getCategories() {
    return api.get<{
      data: { id: string; label: string; count: number }[];
    }>('/tech-trends/categories');
  },

  // ── Reader AI (PRO-gated, auth required). available = server has a
  //    key; isPro = this user is entitled. 403 PRO_REQUIRED otherwise. ──
  readerAiStatus() {
    return api.get<{ data: { available: boolean; isPro: boolean } }>('/tech-trends/ai/status');
  },
  tldr(id: number) {
    return api.post<{ data: { tldr: string[] } }>(`/tech-trends/articles/${id}/tldr`);
  },
  explainArticleCode(id: number) {
    return api.post<{ data: { explanation: string } }>(`/tech-trends/articles/${id}/explain-code`);
  },
  ask(question: string) {
    return api.post<{
      data: { answer: string; grounded: boolean; sources: { id: number; slug: string; title: string }[] };
    }>('/tech-trends/ask', { question });
  },
};


// ─── Tech Trends: news bulletin ─────────────────────────────────────
export interface NewsFeedDto {
  id: number;
  name: string;
  url: string;
  publisher: string;
  homepage: string | null;
  topic: string | null;
  weight: number;
  isActive: boolean;
  lastFetchAt: string | null;
  lastError: string | null;
  _count?: { items: number };
}

export interface NewsIngestResult {
  feeds: number;
  ok: number;
  failed: number;
  itemsNew: number;
  itemsSeen: number;
  errors: Array<{ feed: string; error: string }>;
}

export interface NewsCandidateDto {
  id: number;
  title: string;
  url: string;
  summary: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  publisher: string;
  topic: string | null;
  score: number;
}

export interface NewsBulletinSource {
  title: string;
  url: string;
  publisher: string;
  publishedAt: string | null;
  imageUrl: string | null;
}

export interface NewsBulletinDraft {
  title: string;
  summary: string;
  bodyMdx: string;
  tags: string[];
  coverEmoji: string;
  readTimeMin: number;
  sources: NewsBulletinSource[];
  itemIds: number[];
  topic: string | null;
}

export const adminTechTrendsApi = {
  // Admin: list ALL articles (including DRAFT). Same shape
  // as public but no status filter.
  list(params?: {
    status?: 'DRAFT' | 'PUBLISHED';
    category?: TechTrendCategoryName;
    q?: string;
    page?: number;
    size?: number;
  }) {
    return api.get<{
      data: AdminTechTrendArticle[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/admin/tech-trends', { params });
  },

  // Admin: create. The server auto-slugifies the title and
  // dedupes the slug with a numeric suffix.
  create(payload: {
    title: string;
    summary: string;
    body: string[];
    category: TechTrendCategoryName;
    coverEmoji?: string;
    coverImageUrl?: string;
    codeBlock?: AdminTechTrendArticle['codeBlock'];
    tags: string[];
    trendingScore?: number;
    isFeatured?: boolean;
    status?: 'DRAFT' | 'PUBLISHED';
    readTimeMin?: number;
    publishedAt?: string;
  }) {
    return api.post<{ data: AdminTechTrendArticle }>('/admin/tech-trends', payload);
  },

  // Admin: update. The server re-derives the slug only if
  // the title actually changed, so existing links stay
  // stable across edits.
  update(
    id: number,
    payload: Partial<{
      title: string;
      summary: string;
      body: string[];
      category: TechTrendCategoryName;
      coverEmoji: string;
      coverImageUrl: string;
      codeBlock: AdminTechTrendArticle['codeBlock'];
      tags: string[];
      trendingScore: number;
      isFeatured: boolean;
      status: 'DRAFT' | 'PUBLISHED';
      readTimeMin: number;
      publishedAt: string;
    }>,
  ) {
    return api.put<{ data: AdminTechTrendArticle }>(`/admin/tech-trends/${id}`, payload);
  },

  // Admin: delete.
  remove(id: number) {
    return api.delete<{ data: { id: number } }>(`/admin/tech-trends/${id}`);
  },

  // Admin: one-click publish / unpublish.
  publish(id: number) {
    return api.post<{ data: AdminTechTrendArticle }>(`/admin/tech-trends/${id}/publish`);
  },
  unpublish(id: number) {
    return api.post<{ data: AdminTechTrendArticle }>(`/admin/tech-trends/${id}/unpublish`);
  },

  // Upload a cover image to the existing /files/upload
  // endpoint and return the URL. We use the public
  // `fileApi.upload()` under the hood — declared here so
  // the admin page has a single import surface.
  uploadCover(file: File) {
    const form = new FormData();
    form.append('file', file);
    form.append('category', 'images');
    return api.post<{ data: { url: string; id: number } }>('/files/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ── AI authoring (admin-only). Reuses the interview LLM
  //    gateway server-side — no new env/dep. Each call degrades
  //    to a 503 (AI_UNAVAILABLE) when no key / kill switch. ──
  aiStatus() {
    return api.get<{ data: { available: boolean } }>('/admin/tech-trends/ai/status');
  },
  aiDraft(payload: { topic: string; category: TechTrendCategoryName; notes?: string }) {
    return api.post<{ data: AiGeneratedArticle }>('/admin/tech-trends/ai/draft', payload, { timeout: 300_000 });
  },
  aiFixBug(payload: { errorText: string; context?: string }) {
    return api.post<{ data: AiGeneratedArticle }>('/admin/tech-trends/ai/fixbug', payload, { timeout: 300_000 });
  },
  aiEnrich(payload: { title: string; bodyMdx: string; category?: string }) {
    return api.post<{
      data: { summary: string; tags: string[]; metaDescription: string; readTimeMin: number; coverEmoji: string };
    }>('/admin/tech-trends/ai/enrich', payload, { timeout: 180_000 });
  },
  aiRewrite(payload: { bodyMdx: string; instruction: string }) {
    return api.post<{ data: { bodyMdx: string } }>('/admin/tech-trends/ai/rewrite', payload, { timeout: 300_000 });
  },

  // ─── News bulletin ────────────────────────────────────────────────
  // Ingest and generate are separate calls: ingesting is cheap and safe to
  // repeat, generating spends tokens and publishes a public article.
  newsFeeds() {
    return api.get<{ data: NewsFeedDto[] }>('/admin/tech-trends/news/feeds');
  },
  newsSeedFeeds() {
    return api.post<{ data: { created: number; existing: number } }>('/admin/tech-trends/news/feeds/seed');
  },
  newsAddFeed(payload: { name: string; url: string; publisher: string; homepage?: string; topic?: string; weight?: number }) {
    return api.post<{ data: NewsFeedDto }>('/admin/tech-trends/news/feeds', payload);
  },
  newsUpdateFeed(id: number, payload: Partial<{ isActive: boolean; weight: number; topic: string }>) {
    return api.patch<{ data: NewsFeedDto }>(`/admin/tech-trends/news/feeds/${id}`, payload);
  },
  newsRemoveFeed(id: number) {
    return api.delete<{ success: boolean }>(`/admin/tech-trends/news/feeds/${id}`);
  },
  newsIngest() {
    // Fetching ~19 RSS feeds over the network, sequentially.
    return api.post<{ data: NewsIngestResult }>('/admin/tech-trends/news/ingest', undefined, { timeout: 300_000 });
  },
  newsCandidates(limit = 12) {
    return api.get<{ data: NewsCandidateDto[] }>('/admin/tech-trends/news/candidates', { params: { limit } });
  },
  newsDraft() {
    return api.post<{ data: NewsBulletinDraft }>('/admin/tech-trends/news/draft', undefined, { timeout: 420_000 });
  },
  /** publishAt omitted = publish immediately; ISO string = schedule it. */
  newsGenerate(payload: { publishAt?: string; ingestFirst?: boolean } = {}) {
    return api.post<{ data: { id: number; slug: string; status: string; sources: number } }>(
      '/admin/tech-trends/news/generate',
      payload,
      // Writing a whole bulletin from ~10 sources on the strongest model takes
      // MINUTES. On the 30s default the browser aborted while the server went
      // on to finish and PUBLISH the article — so a press that looked like a
      // failure really posted, and pressing again posted another one. That is
      // how 03:02:24, 03:02:43, 03:03:36, 03:04:31 and 03:05:37 happened.
      { timeout: 600_000 },
    );
  },
};

// Shape returned by the AI draft / fixbug endpoints. `codeBlock`
// is only present for FixBug output.
export interface AiGeneratedArticle {
  title: string;
  summary: string;
  bodyMdx: string;
  tags: string[];
  readTimeMin: number;
  coverEmoji: string;
  category?: TechTrendCategoryName;
  codeBlock?: {
    before: { lang: string; lines: string[] };
    after: { lang: string; lines: string[] };
    takeaway: string;
  } | null;
}

// ─── Game Library ("Playground") ───────────────────────────────────
//
// Public reads are unauthenticated; /admin/* requires ROLE_ADMIN
// (enforced server-side, not just by middleware). Cover uploads reuse
// the shared fileApi.upload endpoint — there is no games-specific
// upload route and no R2 credential ever reaches the client.

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type GameStatus = 'DRAFT' | 'PUBLISHED' | 'COMING_SOON';
export type GameKind = 'REACT' | 'IFRAME';

export interface GameCategoryDto {
  id: number;
  slug: string;
  name: string;
  nameVi: string | null;
  icon: string | null;
  color: string | null;
  sortOrder?: number;
  gameCount?: number;
  _count?: { games: number };
}

export interface GameDto {
  id: number;
  slug: string;
  title: string;
  titleVi: string | null;
  description: string;
  descriptionVi: string | null;
  longDescription?: string | null;
  coverImage: string | null;
  screenshots?: string[];
  difficulty: GameDifficulty;
  status: GameStatus;
  featured: boolean;
  sortOrder: number;
  playCount: number;
  kind: GameKind;
  componentKey: string | null;
  iframeSrc?: string | null;
  estimatedTime: string | null;
  techStack: string[];
  tags: string[];
  controls?: string | null;
  controlsVi?: string | null;
  categoryId?: number;
  category: GameCategoryDto;
  createdAt: string;
  updatedAt?: string;
  /** Only present on the by-slug detail response. */
  bestScore?: number | null;
}

export interface GameLeaderEntry {
  rank: number;
  id: number;
  score: number;
  playedAt: string;
  userId: number | null;
  /** null → render as "Anonymous". */
  player: { id: number; name: string; avatarUrl: string | null } | null;
  game?: { id: number; slug: string; title: string; titleVi: string | null };
}

export interface GameStats {
  games: number;
  categories: number;
  totalPlays: number;
}

export interface GameAdminStats {
  total: number;
  published: number;
  drafts: number;
  comingSoon: number;
  playsAll: number;
  plays7: number;
  daily: { date: string; plays: number }[];
}

export interface GameInput {
  title: string;
  titleVi?: string | null;
  slug?: string | null;
  description: string;
  descriptionVi?: string | null;
  longDescription?: string | null;
  coverImage?: string | null;
  screenshots?: string[];
  difficulty?: GameDifficulty;
  status?: GameStatus;
  kind?: GameKind;
  componentKey?: string | null;
  iframeSrc?: string | null;
  featured?: boolean;
  sortOrder?: number;
  estimatedTime?: string | null;
  techStack?: string[];
  tags?: string[];
  controls?: string | null;
  controlsVi?: string | null;
  categoryId: number;
}

export const gamesApi = {
  list(params?: { category?: string; q?: string; featured?: boolean }) {
    return api.get<{ data: GameDto[] }>('/games', { params });
  },
  categories() {
    return api.get<{ data: GameCategoryDto[] }>('/games/categories');
  },
  stats() {
    return api.get<{ data: GameStats }>('/games/stats');
  },
  getBySlug(slug: string) {
    return api.get<{ data: GameDto }>(`/games/by-slug/${encodeURIComponent(slug)}`);
  },
  related(id: number) {
    return api.get<{ data: GameDto[] }>(`/games/${id}/related`);
  },
  leaderboard(limit = 5) {
    return api.get<{ data: GameLeaderEntry[] }>('/games/leaderboard', { params: { limit } });
  },
  gameLeaderboard(id: number, limit = 20) {
    return api.get<{ data: GameLeaderEntry[] }>(`/games/${id}/leaderboard`, { params: { limit } });
  },
  /** Count one play — client guards to once per session per game. */
  recordPlay(id: number) {
    return api.post<{ data: { playCount: number } }>(`/games/${id}/play`);
  },
  /** Submit a run's score. Server clamps to the per-game cap. */
  submitScore(id: number, score: number, duration?: number) {
    return api.post<{ data: { play: { id: number; score: number }; capped: boolean; cap: number } }>(
      `/games/${id}/score`,
      { score, duration },
    );
  },
};

export const adminGamesApi = {
  list(params?: { page?: number; size?: number; status?: GameStatus | ''; categoryId?: number; q?: string }) {
    return api.get<{
      data: GameDto[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>('/admin/games', { params });
  },
  stats() {
    return api.get<{ data: GameAdminStats }>('/admin/games/stats');
  },
  get(id: number) {
    return api.get<{ data: GameDto }>(`/admin/games/${id}`);
  },
  create(payload: GameInput) {
    return api.post<{ data: GameDto }>('/admin/games', payload);
  },
  update(id: number, payload: Partial<GameInput>) {
    return api.patch<{ data: GameDto }>(`/admin/games/${id}`, payload);
  },
  remove(id: number) {
    return api.delete<{ data: { id: number } }>(`/admin/games/${id}`);
  },
  reorder(items: { id: number; sortOrder: number }[]) {
    return api.post<{ data: { updated: number } }>('/admin/games/reorder', { items });
  },
  /** Cover/screenshot upload — reuses the shared files endpoint. */
  uploadImage(file: File) {
    const form = new FormData();
    form.append('file', file);
    form.append('category', 'cover');
    return api.post<{ data: { url: string; id: number } }>('/files/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const adminGameCategoriesApi = {
  list() {
    return api.get<{ data: GameCategoryDto[] }>('/admin/game-categories');
  },
  create(payload: { name: string; nameVi?: string | null; slug?: string | null; icon?: string | null; color?: string | null; sortOrder?: number }) {
    return api.post<{ data: GameCategoryDto }>('/admin/game-categories', payload);
  },
  update(id: number, payload: Partial<{ name: string; nameVi: string | null; slug: string; icon: string | null; color: string | null; sortOrder: number }>) {
    return api.patch<{ data: GameCategoryDto }>(`/admin/game-categories/${id}`, payload);
  },
  remove(id: number) {
    return api.delete<{ data: { id: number } }>(`/admin/game-categories/${id}`);
  },
};

// ─── Hub — Personal Bookmark Manager ───────────────────────────────
//
// All Hub endpoints are auth-gated. The response shape mirrors
// what the backend sends from src/services/hub.service.ts.

export interface HubFolder {
  id: number;
  name: string;
  icon: string | null;
  // Phase 3 — owner-uploaded cover image (R2). Used as the
  // folder's header/banner when set; falls back to the gradient
  // palette when null.
  coverImageUrl: string | null;
  sortOrder: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  _count: { links: number; files: number };
}

export interface HubLink {
  id: number;
  folderId: number | null;
  url: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  faviconUrl: string | null;
  // Phase 3 — owner-uploaded cover image (R2). Overrides the
  // auto-scraped `thumbnailUrl` for card display when set.
  coverImageUrl: string | null;
  notes: string | null;
  tags: string[];
  isPublic: boolean;
  publicSlug: string | null;
  status: 'unread' | 'learning' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface HubScrapeResult {
  url: string;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  faviconUrl: string | null;
  siteName: string | null;
}

export interface HubFile {
  id: number;
  folderId: number | null;
  name: string;
  key: string;
  size: number;
  mimeType: string;
  // Phase 3 — owner-uploaded cover image (R2). For images this
  // is often the file's own bytes; for non-image files (pdf,
  // docx…) the owner can pick a separate thumbnail.
  coverImageUrl: string | null;
  status: 'unread' | 'learning' | 'done';
  tags: string[];
  notes: string | null;
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HubLinkListResponse {
  data: {
    items: HubLink[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const hubApi = {
  // Folders ──────────────────────────────────────────────────────
  listFolders: () => api.get<{ data: HubFolder[] }>('/hub/folders'),

  createFolder: (data: { name: string; icon?: string | null; coverImageUrl?: string | null; sortOrder?: number; parentId?: number | null }) =>
    api.post<{ data: HubFolder }>('/hub/folders', data),

  updateFolder: (id: number, data: { name?: string; icon?: string | null; coverImageUrl?: string | null; sortOrder?: number; parentId?: number | null }) =>
    api.patch<{ data: HubFolder }>(`/hub/folders/${id}`, data),

  deleteFolder: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/hub/folders/${id}`),

  // Links ────────────────────────────────────────────────────────
  listLinks: (params?: {
    folderId?: number | 'null' | 'all';
    q?: string;
    page?: number;
    pageSize?: number;
  }) => api.get<HubLinkListResponse>('/hub/links', { params }),

  createLink: (data: {
    folderId?: number | null;
    url: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    coverImageUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
  }) => api.post<{ data: HubLink }>('/hub/links', data),

  updateLink: (
    id: number,
    data: Partial<{
      folderId: number | null;
      url: string;
      title: string;
      description: string | null;
      thumbnailUrl: string | null;
      faviconUrl: string | null;
      coverImageUrl: string | null;
      notes: string | null;
      tags: string[];
      isPublic: boolean;
      status: 'unread' | 'learning' | 'done';
    }>,
  ) => api.patch<{ data: HubLink }>(`/hub/links/${id}`, data),

  deleteLink: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/hub/links/${id}`),

  // Scrape — auto-fill metadata for a new link. Used by the
  // AddLinkModal on URL paste.
  scrape: (url: string) =>
    api.post<{ data: HubScrapeResult }>('/hub/scrape', { url }),

  // Public lookup — no auth needed.
  getPublic: (slug: string) =>
    api.get<{
      data: {
        id: number;
        url: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        faviconUrl: string | null;
        publicSlug: string;
        createdAt: string;
      };
    }>(`/hub/public/${slug}`),
};

export const hubFileApi = {
  // Get presigned R2 PUT URL for direct upload from browser
  presign: (data: { name: string; mimeType: string }) =>
    api.post<{ data: { uploadUrl: string; key: string } }>('/hub/files/presign', data),

  // Register a file after successful upload
  create: (data: {
    key: string;
    name: string;
    mimeType: string;
    size: number;
    folderId?: number | null;
    coverImageUrl?: string | null;
    tags?: string[];
    notes?: string | null;
    isPublic?: boolean;
  }) => api.post<{ data: HubFile }>('/hub/files', data),

  list: (params?: {
    folderId?: number | 'null' | 'all';
    status?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  }) =>
    api.get<{
      data: {
        items: HubFile[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }>('/hub/files', { params }),

  getSignedUrl: (id: number) =>
    api.get<{ data: { url: string; mimeType: string } }>(`/hub/files/${id}/url`),

  update: (
    id: number,
    data: Partial<{
      folderId: number | null;
      name: string;
      coverImageUrl: string | null;
      tags: string[];
      notes: string | null;
      status: 'unread' | 'learning' | 'done';
      isPublic: boolean;
    }>,
  ) => api.patch<{ data: HubFile }>(`/hub/files/${id}`, data),

  delete: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/hub/files/${id}`),

  aiSuggestTags: (id: number) =>
    api.post<{ data: { tags: string[] } }>(`/hub/files/${id}/ai-tags`, {}),

 getPublic: (slug: string) =>
 api.get<{
 data: {
 id: number;
 name: string;
 mimeType: string;
 size: number;
 publicSlug: string;
 createdAt: string;
 };
  }>(`/hub/files/public/${slug}`),
};

// ─── Hub User-Sharing (Phase 2) ───────────────────────────────
//
// Lets the owner of a folder/link/file share it with a specific
// recipient at view-only (or view+download) granularity. The
// recipient is identified by username/email/id; the frontend
// passes whatever the user typed and the service resolves it.
//
// `permission = 'view_download'` (default) means the recipient
// can stream the file bytes via the signed URL endpoint. For
// `permission = 'view'`, the recipient can see the file card
// (name, size, mime) but cannot download. Links always allow
// "download" in the sense that clicking the URL IS the
// interaction — there's no separate download step.
export interface HubShareOwnerMini {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}
export interface HubShareFolderMini {
  id: number;
  name: string;
  icon: string | null;
}
export interface HubShareLinkMini {
  id: number;
  url: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  faviconUrl: string | null;
}
export interface HubShareFileMini {
  id: number;
  name: string;
  mimeType: string;
  size: number;
}
export type SharePermission = 'view' | 'view_download';

export interface HubShare {
  id: number;
  ownerId: number;
  recipientId: number;
  folderId: number | null;
  linkId: number | null;
  fileId: number | null;
  permission: SharePermission;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  owner: HubShareOwnerMini;
  recipient: HubShareOwnerMini;
  folder: HubShareFolderMini | null;
  link: HubShareLinkMini | null;
  file: HubShareFileMini | null;
}

export interface HubShareUserSummary {
  user: HubShareOwnerMini;
  shareCount: number;
  latestSharedAt: string;
}

export interface HubSharedItemResponse {
  share: HubShare;
  folder?: (HubFolder & {
    links?: HubLink[];
    files?: HubFile[];
  }) | null;
  link?: HubLink | null;
  file?: HubFile | null;
}

export const hubShareApi = {
  // Owner-side: create or update a share.
  // Idempotent on (ownerId, recipientId, itemId) — re-sharing
  // the same item updates the existing row's permission/note.
  create: (data: {
    recipientId: string | number;
    folderId?: number | null;
    linkId?: number | null;
    fileId?: number | null;
    permission?: SharePermission;
    note?: string | null;
  }) => api.post<{ data: HubShare }>('/hub/shares', data),

  listOutbox: () =>
    api.get<{ data: HubShare[] }>('/hub/shares/outbox'),

  listInbox: () =>
    api.get<{ data: HubShare[] }>('/hub/shares/inbox'),

  // List distinct users who shared something with me, sorted by
  // most-recent share date. Drives the sidebar "Đang share với
  // bạn" widget.
  listUsersSharingWithMe: () =>
    api.get<{ data: HubShareUserSummary[] }>(
      '/hub/shares/users-sharing-with-me',
    ),

  // Typeahead search for the "share with user" modal. Excludes
  // the caller themselves.
  searchUsers: (q: string, limit = 10) =>
    api.get<{
      data: HubShareOwnerMini[];
    }>('/hub/shares/users-search', { params: { q, limit } }),

  get: (id: number) =>
    api.get<{ data: HubShare }>(`/hub/shares/${id}`),

  // Recipient-side: get the actual item through the share gate.
  // Returns the share row + the underlying folder/link/file.
  getSharedItem: (id: number) =>
    api.get<{ data: HubSharedItemResponse }>(`/hub/shares/${id}/item`),

  // Owner-side: flip permission / update note.
  update: (
    id: number,
    data: { permission?: SharePermission; note?: string | null },
  ) => api.patch<{ data: HubShare }>(`/hub/shares/${id}`, data),

  // Owner-side: revoke.
  delete: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(
      `/hub/shares/${id}`,
    ),

  // Recipient-side: get a short-lived signed URL to download
  // a shared file. Returns 403 if the share's permission is
  // "view" (no downloads). Mirrors hubFileApi.getSignedUrl for
  // owner-side access.
  getSharedFileUrl: (fileId: number) =>
    api.get<{ data: { url: string; mimeType: string } }>(
      `/hub/shared-files/${fileId}/url`,
    ),
};

// === CONTENT CREATOR ===
// Phase 2 — admin API mounted at /api/v1/admin/content. All
// routes require ROLE_ADMIN (handled by the server) and the
// shared admin cookie auth (axios sends `withCredentials`,
// see the instance config above).
import type {
 AcademyRefs,
 BulkCreateResult,
 Outline,
 ScriptLang,
 ContentIdea,
 ContentIdeaCreate,
 ContentIdeaUpdate,
 ContentProject,
 ContentProjectCreate,
 ContentProjectSummary,
 ContentProjectUpdate,
 ContentScriptVersion,
 ContentStatus,
 ContentType,
 IdeaListParams,
 ScriptTemplate,
 ScriptVersionOrigin,
} from '@/types';

export interface ContentListParams {
 status?: ContentStatus;
 type?: ContentType;
 /** ISO date string (YYYY-MM-DD). Used by the
 * calendar view to fetch only projects whose
 * filmDate/publishDate fall in this window. */
 from?: string;
 /** ISO date string (YYYY-MM-DD). Inclusive — the
 * server extends to end-of-day. */
 to?: string;
 /** Which date field the range applies to.
 * `film` (default if not used with `any`) or
 * `publish` or `any` (OR across both). */
 field?: 'film' | 'publish' | 'any';
 q?: string;
}

export const contentApi = {
 /** GET /admin/content/projects — list (filterable). */
 list: (params?: ContentListParams) =>
 api.get<{ data: ContentProjectSummary[] }>('/admin/content/projects', { params }),

 /** GET /admin/content/projects/:id — full nested read. */
 get: (id: number) =>
 api.get<{ data: ContentProject }>(`/admin/content/projects/${id}`),

 /** POST /admin/content/projects — create new project. */
 create: (payload: ContentProjectCreate) =>
 api.post<{ data: ContentProject }>('/admin/content/projects', payload),

 /** PUT /admin/content/projects/:id — full upsert incl. children. */
 update: (id: number, payload: ContentProjectUpdate) =>
 api.put<{ data: ContentProject }>(`/admin/content/projects/${id}`, payload),

 /** PATCH /admin/content/projects/:id/status — kanban drag-drop. */
 updateStatus: (id: number, status: ContentStatus) =>
 api.patch<{ data: ContentProjectSummary }>(
 `/admin/content/projects/${id}/status`,
 { status },
 ),

 /** DELETE /admin/content/projects/:id. */
 remove: (id: number) =>
 api.delete<{ success: boolean; message: string }>(
 `/admin/content/projects/${id}`,
 ),

 // ── Phase 5: Idea Bank ─────────────────────────────────
 ideas: {
 /** GET /admin/content/ideas — list with filter/search/tag. */
 list: (params?: IdeaListParams) =>
 api.get<{
 data: { items: ContentIdea[]; total: number };
 }>('/admin/content/ideas', { params }),

 /** GET /admin/content/ideas/:id — single. */
 get: (id: number) =>
 api.get<{ data: ContentIdea }>(`/admin/content/ideas/${id}`),

 /** POST /admin/content/ideas — create. */
 create: (payload: ContentIdeaCreate) =>
 api.post<{ data: ContentIdea }>('/admin/content/ideas', payload),

 /** PATCH /admin/content/ideas/:id — partial update. */
 update: (id: number, payload: ContentIdeaUpdate) =>
 api.patch<{ data: ContentIdea }>(
 `/admin/content/ideas/${id}`,
 payload,
 ),

 /** DELETE /admin/content/ideas/:id. */
 remove: (id: number) =>
 api.delete<{ success: boolean; message: string }>(
 `/admin/content/ideas/${id}`,
 ),

 /** POST /admin/content/ideas/:id/promote — create a
 * ContentProject from this idea, flip the idea to
 * PROMOTED, all in one transaction. The response
 * `message` field carries `redirectTo=/creator/projects/N`. */
 promote: (id: number) =>
 api.post<{
 data: { idea: ContentIdea; project: ContentProjectSummary };
 message: string;
 }>(`/admin/content/ideas/${id}/promote`),
 },

 // ── Script history ──────────────────────────────────────────
 // Explicit snapshots of `project.script`. The editor's autosave
 // never touches these — see content.script.service.ts.
 scriptVersions: {
 /** List, newest first. Bodies are omitted from this payload. */
 list: (projectId: number) =>
 api.get<{ data: ContentScriptVersion[] }>(
 `/admin/content/projects/${projectId}/script-versions`,
 ),

 /** Snapshot now. `script` lets the editor capture what is on
  * screen even if the debounce has not flushed yet; `data` comes
  * back null when the script is empty (nothing worth saving). */
 create: (
 projectId: number,
 payload: { label?: string | null; origin?: ScriptVersionOrigin; script?: string | null },
 ) =>
 api.post<{ data: ContentScriptVersion | null; message?: string }>(
 `/admin/content/projects/${projectId}/script-versions`,
 payload,
 ),

 /** Fetch one version WITH its body — used by preview + restore. */
 get: (projectId: number, versionId: number) =>
 api.get<{ data: Required<ContentScriptVersion> }>(
 `/admin/content/projects/${projectId}/script-versions/${versionId}`,
 ),

 /** Overwrite the live script. The server snapshots the current
  * text first, so this is itself undoable. */
 restore: (projectId: number, versionId: number) =>
 api.post<{
 data: { project: { id: number; script: string | null; updatedAt: string }; restoredFrom: number };
 }>(`/admin/content/projects/${projectId}/script-versions/${versionId}/restore`),

 remove: (projectId: number, versionId: number) =>
 api.delete<{ message: string }>(
 `/admin/content/projects/${projectId}/script-versions/${versionId}`,
 ),
 },

 // ── User-saved script templates ─────────────────────────────
 // Built-in templates ship in lib/studio-templates.ts and are
 // merged client-side; this endpoint only returns the user's own.
 scriptTemplates: {
 list: (type?: ContentType) =>
 api.get<{ data: ScriptTemplate[] }>('/admin/content/script-templates', {
 params: type ? { type } : undefined,
 }),

 create: (payload: {
 name: string;
 nameEn?: string | null;
 description?: string | null;
 descriptionEn?: string | null;
 body: string;
 bodyEn?: string | null;
 contentType?: ContentType | null;
 tags?: string[];
 }) => api.post<{ data: ScriptTemplate }>('/admin/content/script-templates', payload),

 update: (id: number, payload: Partial<ScriptTemplate>) =>
 api.patch<{ data: ScriptTemplate }>(`/admin/content/script-templates/${id}`, payload),

 remove: (id: number) =>
 api.delete<{ message: string }>(`/admin/content/script-templates/${id}`),

 /** Bump the use counter so the picker can sort by what the user
  * actually reaches for. Best-effort — callers ignore failures. */
 markUsed: (id: number) =>
 api.post<{ data: { id: number; useCount: number } }>(
 `/admin/content/script-templates/${id}/use`,
 ),
 },

 /** GET /admin/content/academy-refs — published courses + their
  * exams, for the "what is this video about?" pickers. */
 academyRefs: () => api.get<{ data: AcademyRefs }>('/admin/content/academy-refs'),

 // ── Series generator ────────────────────────────────────────
 /** Read an outline that already exists — a course's
  *  sections→lessons, or a project's milestones — to generate one
  *  project per item from. */
 outline: (params: { courseSlug?: string; projectSlug?: string }) =>
 api.get<{ data: Outline }>('/admin/content/outline', { params }),

 /** Create one project per selected outline item. Items whose title
  *  already exists in the series are skipped, not duplicated, so
  *  re-running to pick up newly added lessons is safe. */
 bulkCreate: (payload: {
 items: Array<{ title: string; lessonRef?: string | null; episodeNumber?: number | null }>;
 type?: ContentType;
 status?: ContentStatus;
 seriesName?: string | null;
 courseSlug?: string | null;
 courseTitle?: string | null;
 projectSlug?: string | null;
 targetDurationSec?: number | null;
 scriptLang?: ScriptLang;
 scriptTemplate?: string | null;
 }) => api.post<{ data: BulkCreateResult }>('/admin/content/projects/bulk', payload),
};



// ─── Pro membership ──────────────────────────────────────────
export interface ProStatus {
  isAdmin: boolean;
  isPro: boolean;
  effective: boolean;
  lifetime: boolean;
  expiresAt: string | null;
  source: string | null;
}
export interface ProCode {
  id: number;
  code: string;
  label: string | null;
  durationDays: number | null;
  lifetime: boolean;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  note: string | null;
  redemptions: number;
  createdAt: string;
}
export interface ProUser {
  id: number;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  proSince: string | null;
  expiresAt: string | null;
  lifetime: boolean;
  expired: boolean;
  source: string | null;
}

export const proApi = {
  status: () => api.get<{ data: ProStatus }>('/pro/status'),
  redeem: (code: string) => api.post<{ data: ProStatus }>('/pro/redeem', { code }),
};

export const proAdminApi = {
  listCodes: () => api.get<{ data: ProCode[] }>('/admin/pro/codes'),
  createCode: (data: { code?: string; label?: string; durationDays?: number | null; maxUses?: number; expiresAt?: string | null; note?: string | null }) =>
    api.post<{ data: ProCode }>('/admin/pro/codes', data),
  updateCode: (id: number, data: Partial<{ label: string; durationDays: number | null; maxUses: number; isActive: boolean; expiresAt: string | null; note: string | null }>) =>
    api.put<{ data: ProCode }>(`/admin/pro/codes/${id}`, data),
  deleteCode: (id: number) => api.delete(`/admin/pro/codes/${id}`),
  listUsers: () => api.get<{ data: ProUser[] }>('/admin/pro/users'),
  grant: (userId: number, durationDays: number | null) => api.post<{ data: ProStatus }>('/admin/pro/grant', { userId, durationDays }),
  revoke: (userId: number) => api.post<{ data: ProStatus }>('/admin/pro/revoke', { userId }),
};

// ─────────────────────────────────────────────────────────────────────────
// Voice Hub — admin creator channel (Vlog / Reaction / Kinh nghiệm code /
// Podcast-voice / Tutorial). Public read + auth comments/likes; admin CRUD.
// ─────────────────────────────────────────────────────────────────────────

export type VoiceType = 'VLOG' | 'REACTION' | 'CODE_EXP' | 'PODCAST' | 'TUTORIAL';
export type VoiceMediaKind = 'YOUTUBE' | 'R2_VIDEO' | 'AUDIO';
export type VoiceStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface VoiceAuthor {
  id: number;
  username: string;
  fullName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface VoiceSeriesRef {
  id: number;
  title: string;
  slug: string;
}

export interface VoicePostCard {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  type: VoiceType;
  mediaKind: VoiceMediaKind;
  youtubeId: string | null;
  thumbnailUrl: string | null;
  durationSec: number | null;
  tags: string[];
  isFeatured: boolean;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
  series: VoiceSeriesRef | null;
  author: VoiceAuthor | null;
  commentCount: number;
}

export interface VoiceChapter {
  t: number;
  label: string;
}

export interface PublicVoicePost extends VoicePostCard {
  description: string | null;
  descriptionHtml: string | null;
  chapters: VoiceChapter[];
  videoUrl: string | null;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
  likedByMe: boolean;
}

export interface VoiceComment {
  id: number;
  parentId: number | null;
  content: string;
  likesCount: number;
  likedByMe: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: number; username: string; displayName: string | null; fullName: string | null; avatarUrl: string | null };
  replies: VoiceComment[];
}

export interface VoiceSeries {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { posts: number };
}

export interface AdminVoicePost extends Omit<PublicVoicePost, 'likedByMe' | 'commentCount' | 'series' | 'author'> {
  status: VoiceStatus;
  seriesId: number | null;
  authorId: number | null;
  series?: VoiceSeriesRef | null;
  author?: VoiceAuthor | null;
}

export interface VoiceUpsertPayload {
  title: string;
  summary?: string | null;
  description?: string | null;
  type: VoiceType;
  mediaKind: VoiceMediaKind;
  youtubeInput?: string;
  videoUrl?: string | null;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  durationSec?: number | null;
  chapters?: VoiceChapter[];
  tags?: string[];
  seriesId?: number | null;
  isFeatured?: boolean;
  isPinned?: boolean;
  status?: VoiceStatus;
  publishedAt?: string | null;
}

// ─── Công cụ tài liệu: ảnh → chữ + công thức → Word ──────────────────────
// Một ảnh mỗi lời gọi (xem `src/services/docTools/transcribe.service.ts`):
// mỗi lượt 15–80 giây, nên gộp 10 ảnh vào một request sẽ đụng trần 300 giây
// của nginx và mất luôn cả tập. Gọi lẻ thì hỏng trang nào biết trang đó.

export type CheDoHinh = 'cat-anh' | 'bo-qua' | 'mo-ta' | 've-lai';

export interface HinhVeLai {
  pngBase64: string;
  rong: number;
  cao: number;
}

export interface TrangChep {
  chiSo: number;
  ten?: string;
  vanBan: string;
  hinhVeLai: HinhVeLai[];
  soChoNgo: number;
  loi?: string;
  model?: string;
  tokenVao?: number;
  tokenRa?: number;
  costUsd?: number;
}

export const docToolsApi = {
  presets() {
    return api.get<{
      data: {
        toiDaAnh: number;
        toiDaMoiAnhMb: number;
        presets: { id: string; label: string; hint: string }[];
        cheDoHinh: { id: CheDoHinh; label: string; hint: string }[];
      };
    }>('/doc-tools/presets');
  },

  /** Chép MỘT ảnh. `timeout` rộng: chế độ vẽ lại hình đo được tới ~80 giây. */
  transcribe(file: File, opts: { presets?: string[]; note?: string; cheDoHinh?: CheDoHinh }) {
    const fd = new FormData();
    fd.append('images', file);
    if (opts.presets?.length) fd.append('presets', JSON.stringify(opts.presets));
    if (opts.note) fd.append('note', opts.note);
    if (opts.cheDoHinh) fd.append('cheDoHinh', opts.cheDoHinh);
    return api.post<{ data: { trang: TrangChep[]; tong: { soTrang: number; soTrangHong: number; soChoNgo: number; costUsd: number } } }>(
      '/doc-tools/transcribe',
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 180000 },
    );
  },

  /** Bản chép đã sửa → file .docx (bytes, không phải JSON). */
  exportDocx(data: { tieuDe?: string; vanBan: string; hinh?: { pngBase64: string; chuThich?: string }[] }) {
    return api.post('/doc-tools/export/docx', data, { responseType: 'blob', timeout: 120000 });
  },

  /** Ảnh gốc → PDF "y hệt": mỗi ảnh một trang, đã nắn thẳng + làm sạch nền.
   *  Khác PDF in từ bản chép — cái này KHÔNG sửa được chữ nhưng giống bản gốc
   *  từng nét, kể cả chữ viết tay ở lề. */
  exportPdfAnh(files: File[], opts: { tieuDe?: string; lamSach?: boolean } = {}) {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    if (opts.tieuDe) fd.append('tieuDe', opts.tieuDe);
    if (opts.lamSach === false) fd.append('lamSach', 'false');
    return api.post('/doc-tools/export/pdf-anh', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
      timeout: 180000,
    });
  },
};

export const voiceApi = {
  list(params?: { type?: VoiceType; series?: string; tag?: string; q?: string; featured?: boolean; page?: number; size?: number }) {
    return api.get<{
      data: { posts: VoicePostCard[]; pagination: { page: number; size: number; total: number; totalPages: number } };
    }>('/voice', { params });
  },
  series() {
    return api.get<{ data: VoiceSeries[] }>('/voice/series');
  },
  getBySlug(slug: string, opts?: { view?: boolean }) {
    return api.get<{ data: { post: PublicVoicePost; related: VoicePostCard[] } }>(
      `/voice/posts/${encodeURIComponent(slug)}`,
      { params: opts?.view ? { view: 1 } : undefined },
    );
  },
  likePost(id: number) {
    return api.post<{ data: { liked: boolean; likeCount: number } }>(`/voice/posts/${id}/like`);
  },
  // ── Comments ──
  listComments(id: number) {
    return api.get<{ data: { comments: VoiceComment[]; total: number } }>(`/voice/posts/${id}/comments`);
  },
  addComment(id: number, content: string, parentId?: number | null) {
    return api.post<{ data: VoiceComment }>(`/voice/posts/${id}/comments`, { content, parentId: parentId ?? undefined });
  },
  editComment(commentId: number, content: string) {
    return api.patch<{ data: VoiceComment }>(`/voice/comments/${commentId}`, { content });
  },
  deleteComment(commentId: number) {
    return api.delete<{ data: { id: number } }>(`/voice/comments/${commentId}`);
  },
  likeComment(commentId: number) {
    return api.post<{ data: { liked: boolean; likesCount: number } }>(`/voice/comments/${commentId}/like`);
  },
  // ── Reader AI (PRO) ──
  readerAiStatus() {
    return api.get<{ data: { available: boolean; isPro: boolean } }>('/voice/ai/status');
  },
  tldr(slug: string) {
    return api.post<{ data: { tldr: string[] } }>(`/voice/posts/${encodeURIComponent(slug)}/tldr`);
  },
};

export const adminVoiceApi = {
  list(params?: { status?: VoiceStatus; type?: VoiceType; q?: string; page?: number; size?: number }) {
    return api.get<{
      data: { posts: AdminVoicePost[]; pagination: { page: number; size: number; total: number; totalPages: number } };
    }>('/admin/voice', { params });
  },
  get(id: number) {
    return api.get<{ data: AdminVoicePost }>(`/admin/voice/${id}`);
  },
  create(payload: VoiceUpsertPayload) {
    return api.post<{ data: AdminVoicePost }>('/admin/voice', payload);
  },
  update(id: number, payload: Partial<VoiceUpsertPayload>) {
    return api.put<{ data: AdminVoicePost }>(`/admin/voice/${id}`, payload);
  },
  remove(id: number) {
    return api.delete<{ data: { id: number } }>(`/admin/voice/${id}`);
  },
  publish(id: number) {
    return api.post<{ data: AdminVoicePost }>(`/admin/voice/${id}/publish`);
  },
  unpublish(id: number) {
    return api.post<{ data: AdminVoicePost }>(`/admin/voice/${id}/unpublish`);
  },
  // ── Series ──
  listSeries() {
    return api.get<{ data: VoiceSeries[] }>('/admin/voice/series/all');
  },
  createSeries(data: { title: string; description?: string | null; coverImageUrl?: string | null }) {
    return api.post<{ data: VoiceSeries }>('/admin/voice/series', data);
  },
  updateSeries(id: number, data: { title?: string; description?: string | null; coverImageUrl?: string | null }) {
    return api.put<{ data: VoiceSeries }>(`/admin/voice/series/${id}`, data);
  },
  deleteSeries(id: number) {
    return api.delete<{ data: { id: number } }>(`/admin/voice/series/${id}`);
  },
  // ── Admin AI ──
  aiStatus() {
    return api.get<{ data: { available: boolean } }>('/admin/voice/ai/status');
  },
  generateMeta(data: { title: string; notes?: string; type?: VoiceType }) {
    return api.post<{ data: { summary: string; description: string; tags: string[]; chapters: VoiceChapter[] } }>(
      '/admin/voice/ai/generate-meta',
      data,
    );
  },
};
