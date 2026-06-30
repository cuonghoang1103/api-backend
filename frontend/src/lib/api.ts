import axios, { AxiosError, AxiosInstance } from 'axios';
import type { ApiResponse, AuthResponse } from '@/types';
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

api.interceptors.request.use((config) => config);

api.interceptors.response.use(
  (response) => response,
  (error: ApiError) => {
    const friendlyMsg = getFriendlyErrorMessage(error);
    error.userFriendlyMessage = friendlyMsg;

    if (error.response?.status === 401) {
      // Auth errors are handled by Next.js middleware on the server side.
      // Client-side redirect here causes a race condition with admin layout checks.
      // We only clear the toast/error state, not navigate.
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
  }) => api.put('/profile', data),

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
};

// Notes API — personal study notebooks (per-user, authenticated).
// Mirrors the envelope convention: every call resolves to
// `{ data: <payload> }`; callers read `res.data.data`.
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
  updateChapter: (id: number, data: Partial<{ title: string; sortOrder: number }>) =>
    api.patch<{ data: import('@/types').NoteChapterTree }>(`/notes/chapters/${id}`, data),
  deleteChapter: (id: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/chapters/${id}`),
  reorderChapters: (subjectId: number, orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>('/notes/chapters/reorder', { subjectId, orderedIds }),

  // Notes
  createNote: (data: { subjectId: number; chapterId?: number | null; title?: string }) =>
    api.post<{ data: import('@/types').NoteFull }>('/notes/notes', data),
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
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes/notes/${id}`),
  reorderNotes: (orderedIds: number[]) =>
    api.patch<{ data: { reordered: number } }>('/notes/notes/reorder', { orderedIds }),

  // ── Phase 3d: flag-filtered views for the sidebar pills ──
  // ?f=all (default) | favorites | archive | needs-review
  getFilteredNotes: (filter: 'all' | 'favorites' | 'archive' | 'needs-review') =>
    api.get<{ data: { filter: string; notes: import('@/types').NoteSummary[] } }>('/notes/notes/filter', { params: { f: filter } }),

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
  permission: 'view' | 'edit';
  note: string | null;
  createdAt: string;
  updatedAt: string;
  subject?: { id: number; name: string; emoji: string | null; color: string | null };
  recipient?: { id: number; username: string; email: string; avatarUrl: string | null; displayName: string | null };
  owner?: { id: number; username: string; avatarUrl: string | null; displayName: string | null };
}

export interface NoteShareRecipientMini {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  displayName: string | null;
}

// Shared subject received from another user
export interface NoteSharedSubject {
  id: number;
  shareId: number;
  subjectId: number;
  permission: 'view' | 'edit';
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
  myPermission: 'view' | 'edit';
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

export const noteShareApi = {
  // Share a subject with another user
  create: (data: { subjectId: number; recipientId: number; permission?: 'view' | 'edit'; note?: string }) =>
    api.post<{ data: NoteShare }>('/notes-shares', data),

  // List all shares I own (outbox)
  list: () =>
    api.get<{ data: NoteShare[] }>('/notes-shares'),

  // Revoke a share
  delete: (shareId: number) =>
    api.delete<{ data: { id: number; deleted: boolean } }>(`/notes-shares/${shareId}`),

  // Update share permission or note
  update: (shareId: number, data: { permission?: 'view' | 'edit'; note?: string | null }) =>
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

  // Search users to share with
  searchUsers: (q: string, limit = 8) =>
    api.get<{ data: NoteShareRecipientMini[] }>('/notes-shares/search-users', { params: { q, limit } }),
};

// Music API
export const musicApi = {
  getTracks: (params?: { page?: number; size?: number; keyword?: string }) =>
    api.get('/music/tracks', { params }),
  getTrack: (id: number) => api.get(`/music/tracks/${id}`),
  getStreamUrl: (id: number) => `/api/v1/music/stream/${id}`,
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
  }) => api.get('/courses', { params }),

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
  }) => api.get('/social/posts', { params }),

  /** Per-content-type counts for the feed tab badges. */
  getFeedCounts: () => api.get('/social/posts/counts'),

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
  listThreads: () =>
    api.get<ApiResponse<MessagingThread[]>>('/messages/threads'),
  getThread: (threadId: number) =>
    api.get<ApiResponse<MessagingThread>>(`/messages/threads/${threadId}`),

  // Messages
  listMessages: (threadId: number, params?: { cursor?: number; limit?: number }) =>
    api.get<ApiResponse<MessagingMessage[]>>(`/messages/threads/${threadId}/messages`, { params }),
  // Phase 6: postShare param for sharing social posts into chat
  sendMessage: (threadId: number, data: { content?: string; fileIds?: number[]; parentMessageId?: number | null; postShare?: { postId: number } }) =>
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
    tagSlug?: string;
    language?: string;
    keyword?: string;
    includeDrafts?: boolean;
    sort?: 'newest' | 'oldest' | 'most-stars' | 'least-stars' | 'name-asc' | 'name-desc';
  }) {
    return api.get<GithubRepoListResponse>('/repos', { params });
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

export interface PublicTechTrendArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
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
  category: 'TechNews' | 'FixBug' | 'Experience' | 'Interviews';
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

// Admin-side view of an article — same shape as the public
// one but includes the canonical `bodyMdx` (markdown source)
// so the TipTap editor can hydrate. Legacy `body` JsonB is
// still accepted on the wire for back-compat with articles
// written before the Tier 1A migration.
export interface AdminTechTrendArticle extends Omit<PublicTechTrendArticle, 'body'> {
  bodyMdx?: string | null;
  body?: unknown; // legacy JsonB column, kept for back-compat
}

export const techTrendsApi = {
  // Public: list published articles. Supports filtering
  // by category, keyword, and the `featured` flag. The
  // frontend uses a large `size` (default 100) so it can
  // do its own bento-grid ordering and client-side
  // search without paging the server.
  list(params?: {
    category?: 'TechNews' | 'FixBug' | 'Experience' | 'Interviews' | 'All';
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

  // Public: get category counts for the tab bar.
  getCategories() {
    return api.get<{
      data: { id: string; label: string; count: number }[];
    }>('/tech-trends/categories');
  },
};

export const adminTechTrendsApi = {
  // Admin: list ALL articles (including DRAFT). Same shape
  // as public but no status filter.
  list(params?: {
    status?: 'DRAFT' | 'PUBLISHED';
    category?: 'TechNews' | 'FixBug' | 'Experience' | 'Interviews';
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
    category: 'TechNews' | 'FixBug' | 'Experience' | 'Interviews';
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
      category: 'TechNews' | 'FixBug' | 'Experience' | 'Interviews';
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
 ContentIdea,
 ContentIdeaCreate,
 ContentIdeaUpdate,
 ContentProject,
 ContentProjectCreate,
 ContentProjectSummary,
 ContentProjectUpdate,
 ContentStatus,
 ContentType,
 IdeaListParams,
 IdeaStatus,
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
};


