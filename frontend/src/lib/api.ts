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
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  register: (data: {
    username: string;
    password: string;
    email: string;
    fullName?: string;
  }) => api.post('/auth/register', data),

  getProfile: () => api.get('/profile'),

  updateProfile: (data: {
    fullName?: string;
    email?: string;
    bio?: string;
    avatarUrl?: string;
  }) => api.put('/profile', data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => api.post('/auth/change-password', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
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
  getCoursesBySemester: (semesterId: number) => api.get(`/courses/semester/${semesterId}`),
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
    api.get(`/academy/courses/${courseId}`),
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
