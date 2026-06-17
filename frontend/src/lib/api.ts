import axios, { AxiosError, AxiosInstance } from 'axios';
import type { ApiResponse, AuthResponse } from '@/types';

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
  }) => api.get('/projects', { params }),

  getFeatured: (params?: { page?: number; size?: number }) =>
    api.get('/projects/featured', { params }),

  getBySlug: (slug: string) => api.get(`/projects/${slug}`),

  create: (data: Record<string, unknown>) => api.post('/projects', data),

  update: (id: number, data: Record<string, unknown>) => api.put(`/projects/${id}`, data),

  delete: (id: number) => api.delete(`/projects/${id}`),

  toggleFeatured: (id: number) => api.patch(`/projects/${id}/toggle-featured`),
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
  }) => api.get('/social/posts', { params }),

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
  }) => api.post('/social/posts', data),

  updatePost: (id: number, data: { content?: string; visibility?: string }) =>
    api.patch(`/social/posts/${id}`, data),

  deletePost: (id: number) => api.delete(`/social/posts/${id}`),

  // Like
  likePost: (id: number) => api.post(`/social/posts/${id}/like`),
  unlikePost: (id: number) => api.delete(`/social/posts/${id}/like`),

  // Comments
  getComments: (postId: number, params?: { cursor?: number; limit?: number }) =>
    api.get(`/social/posts/${postId}/comments`, { params }),

  createComment: (data: {
    postId: number;
    parentId?: number;
    content: string;
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

  // Share
  sharePost: (id: number, platform?: string) =>
    api.post(`/social/posts/${id}/share`, { platform }),

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
  sendMessage: (threadId: number, data: { content?: string; fileIds?: number[] }) =>
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
};

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
}

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
    return api.post('/api/v1/payments/course', {
      courseId,
      idempotencyKey,
      ...(discountCode ? { discountCode } : {}),
    });
  },
  // Poll order status after redirect from VNPay
  getOrderStatus(orderCode: string) {
    return api.get(`/api/v1/payments/order/${encodeURIComponent(orderCode)}`);
  },
  // Admin: paginated list of all course orders
  adminListOrders(params?: {
    status?: string;
    courseId?: number;
    page?: number;
    pageSize?: number;
  }) {
    return api.get('/api/v1/payments/admin/orders', { params });
  },
  // Admin: audit trail of IPN callbacks for a given order
  adminListTransactions(orderCode: string) {
    return api.get(
      `/api/v1/payments/admin/transactions/${encodeURIComponent(orderCode)}`,
    );
  },
  // Admin: update enrollment (set/clear expiresAt, change status)
  adminUpdateEnrollment(data: {
    userId: number;
    courseId: number;
    expiresAt?: string | null;
    status?: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
  }) {
    return api.patch('/api/v1/payments/admin/enrollment', data);
  },
  // Admin: revoke enrollment
  adminRevokeEnrollment(userId: number, courseId: number) {
    return api.delete('/api/v1/payments/admin/enrollment', {
      data: { userId, courseId },
    });
  },
  // Admin: issue refund (full or partial)
  adminRefundOrder(data: {
    orderCode: string;
    refundAmount?: number;
    reason: string;
  }) {
    return api.post('/api/v1/payments/admin/refund', data);
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

  // Soft-delete: the row stays in the DB (archivedAt set) so
  // the user can re-import from an export. The cron hard-deletes
  // after the retention window expires.
  removeTask(id: number) {
    return api.delete<{ data: { id: number; archived: true } }>(`/dashboard/tasks/${id}`);
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
export interface PublicTechTrendArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  body: string[];
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
// one but with the raw DB fields (body is whatever was sent,
// usually string[]). We keep the type loose on body so the
// admin form can round-trip the JSONB as-is.
export interface AdminTechTrendArticle extends Omit<PublicTechTrendArticle, 'body'> {
  body: string[];
  // Admin gets access to the raw category/author field that
  // some server queries emit. We add it as optional so the
  // type stays compatible with the public response too.
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
