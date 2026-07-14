export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  roleVersion: number;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  roles: string[];
  role: string;
  roleVersion: number;
  token: string;
  refreshToken: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  fullName?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChatMessageDto {
  message: string;
  sessionId?: string;
  documentType?: string;
  topK?: number;
  /** Selected chat model id (see CHAT_MODELS). */
  model?: string;
  /** Prior conversation turns for multi-turn memory (most recent last). */
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  /** Attached images as data URLs (data:image/...;base64,...) — Pro/Max only. */
  images?: string[];
  /** Attached PDFs as data URLs (data:application/pdf;base64,...) — Pro/Max only. */
  documents?: string[];
}

export interface UploadResult {
  id: number;
  originalName: string;
  storedName: string;
  url: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  fileCategory: string;
}

export type FileCategory = 'images' | 'audio' | 'video' | 'documents' | 'thumbnails' | 'avatars' | 'covers' | 'posts' | 'courses' | 'products';

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type DiscountType = 'PERCENT' | 'FIXED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
