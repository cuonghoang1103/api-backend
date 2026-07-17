/**
 * EXP_Hub — API Client
 */

import { api } from './api';
import type {
  Snippet,
  SnippetCategory,
  SnippetTag,
  SnippetFilters,
  SnippetVariable,
  SnippetVersion,
  SnippetAttachment,
  SnippetComment,
  ReactionSummary,
  PaginatedResponse,
  DashboardStats,
  BulkImportResult,
} from '@/types/exp-hub';

const BASE = '/snippets';

// ─── Categories ────────────────────────────────────────────────────────────────

// Rich category metadata shared by create/update payloads.
export interface CategoryMetaPayload {
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  coverImageUrl?: string | null;
  docsUrl?: string | null;
}

export const snippetCategoriesApi = {
  getAll: () =>
    api.get<{ success: boolean; data: SnippetCategory[] }>(`${BASE}/categories`),

  create: (data: { name: string; parentId?: number | null; sortOrder?: number } & CategoryMetaPayload) =>
    api.post<{ success: boolean; data: SnippetCategory }>(`${BASE}/categories`, data),

  update: (id: number, data: { name?: string; parentId?: number | null; sortOrder?: number } & CategoryMetaPayload) =>
    api.put<{ success: boolean; data: SnippetCategory }>(`${BASE}/categories/${id}`, data),

  delete: (id: number, moveChildrenTo?: number | null) =>
    api.delete<{ success: boolean; message: string }>(`${BASE}/categories/${id}`, {
      data: { moveChildrenTo },
    }),
};

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const snippetTagsApi = {
  getAll: () =>
    api.get<{ success: boolean; data: SnippetTag[] }>(`${BASE}/tags`),

  create: (data: { name: string }) =>
    api.post<{ success: boolean; data: SnippetTag }>(`${BASE}/tags`, data),

  update: (id: number, data: { name: string }) =>
    api.put<{ success: boolean; data: SnippetTag }>(`${BASE}/tags/${id}`, data),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`${BASE}/tags/${id}`),
};

// ─── Snippets ─────────────────────────────────────────────────────────────────

export const snippetsApi = {
  getList: (filters?: SnippetFilters) =>
    api.get<PaginatedResponse<Snippet>>(`${BASE}`, { params: filters }),

  search: (query: string, page = 1, limit = 20) =>
    api.get<PaginatedResponse<Snippet>>(`${BASE}/search`, {
      params: { q: query, page, limit },
    }),

  getById: (id: number) =>
    api.get<{ success: boolean; data: Snippet }>(`${BASE}/${id}`),

  getBySlug: (slug: string) =>
    api.get<{ success: boolean; data: Snippet }>(`${BASE}/slug/${slug}`),

  create: (data: {
    title: string;
    description?: string;
    language?: string;
    code?: string;
    codeBlocks?: Array<{ name: string; language: string; code: string }>;
    noteContent?: string;
    explanation?: string;
    youtubeUrl?: string;
    referenceUrl?: string;
    repoUrl?: string;
    kind?: 'CODE' | 'NOTE' | 'PROJECT';
    categoryId?: number | null;
    tagIds?: number[];
    variables?: Array<{ key: string; label: string; defaultValue?: string }>;
    previewUrl?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  }) =>
    api.post<{ success: boolean; data: Snippet }>(`${BASE}`, data),

  update: (id: number, data: Partial<{
    title: string;
    description?: string;
    language: string;
    code: string;
    codeBlocks: Array<{ name: string; language: string; code: string }>;
    noteContent: string;
    explanation?: string;
    youtubeUrl?: string;
    referenceUrl?: string;
    repoUrl?: string;
    kind?: 'CODE' | 'NOTE' | 'PROJECT';
    categoryId?: number | null;
    tagIds?: number[];
    variables?: Array<{ key: string; label: string; defaultValue?: string }>;
    previewUrl?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  }>) =>
    api.put<{ success: boolean; data: Snippet }>(`${BASE}/${id}`, data),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`${BASE}/${id}`),

  copy: (id: number, variables?: Record<string, string>) =>
    api.post<{ success: boolean; data: { code: string; language: string } }>(
      `${BASE}/${id}/copy`,
      variables ? { variables } : undefined
    ),

  toggleUpvote: (id: number) =>
    api.post<{ success: boolean; data: { upvoted: boolean } }>(`${BASE}/${id}/upvote`),

  toggleBookmark: (id: number) =>
    api.post<{ success: boolean; data: { bookmarked: boolean } }>(`${BASE}/${id}/bookmark`),

  getVersions: (id: number) =>
    api.get<{ success: boolean; data: SnippetVersion[] }>(`${BASE}/${id}/versions`),

  getRelated: (id: number, limit = 6) =>
    api.get<{ success: boolean; data: Snippet[] }>(`${BASE}/${id}/related`, { params: { limit } }),

  // AI assist for code — explain / optimize / install. Sends the code in the
  // request (works on any snippet); the backend bounds it by per-user quota.
  aiAssist: (payload: { mode: 'explain' | 'install' | 'optimize'; code?: string; language?: string; title?: string }) =>
    api.post<{ success: boolean; data: { text: string } }>(`${BASE}/ai/assist`, payload),

  // Attachments — register an already-uploaded R2 file against the snippet,
  // or remove one. The file bytes go through fileApi.upload first.
  addAttachment: (
    snippetId: number,
    data: { fileUrl: string; originalName: string; fileType?: string | null; fileSize?: number | null },
  ) =>
    api.post<{ success: boolean; data: SnippetAttachment }>(`${BASE}/${snippetId}/attachments`, data),

  deleteAttachment: (snippetId: number, attachmentId: number) =>
    api.delete<{ success: boolean; message: string }>(`${BASE}/${snippetId}/attachments/${attachmentId}`),

  bulkImport: (files: Array<{
    title: string;
    description?: string;
    language?: string;
    filename?: string;
    code: string;
    categoryId?: number;
    tags?: string[];
  }>, categoryId?: number) =>
    api.post<{ success: boolean; data: BulkImportResult[] }>(`${BASE}/bulk-import`, {
      files,
      categoryId,
    }),
};

// ─── Comments + Reactions ───────────────────────────────────────────────────────

export const snippetCommentsApi = {
  list: (snippetId: number) =>
    api.get<{ success: boolean; data: { comments: SnippetComment[]; total: number } }>(`${BASE}/${snippetId}/comments`),

  add: (snippetId: number, content: string, parentId?: number | null) =>
    api.post<{ success: boolean; data: SnippetComment }>(`${BASE}/${snippetId}/comments`, { content, parentId }),

  edit: (commentId: number, content: string) =>
    api.patch<{ success: boolean; message: string }>(`${BASE}/comments/${commentId}`, { content }),

  remove: (commentId: number) =>
    api.delete<{ success: boolean; message: string }>(`${BASE}/comments/${commentId}`),

  react: (commentId: number, emoji: string) =>
    api.post<{ success: boolean; data: { reactions: ReactionSummary[] } }>(`${BASE}/comments/${commentId}/reactions`, { emoji }),
};

export const snippetReactionsApi = {
  getForSnippet: (snippetId: number) =>
    api.get<{ success: boolean; data: { reactions: ReactionSummary[] } }>(`${BASE}/${snippetId}/reactions`),

  toggle: (snippetId: number, emoji: string) =>
    api.post<{ success: boolean; data: { reactions: ReactionSummary[] } }>(`${BASE}/${snippetId}/reactions`, { emoji }),
};

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export const snippetBookmarksApi = {
  getAll: () =>
    api.get<{ success: boolean; data: { bookmarks: Snippet[]; total: number } }>(
      `${BASE}/bookmarks/list`
    ),
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const snippetStatsApi = {
  getPublic: () =>
    api.get<{ success: boolean; data: DashboardStats }>(`${BASE}/stats`),

  getAdmin: () =>
    api.get<{ success: boolean; data: DashboardStats }>(`${BASE}/admin/dashboard`),
};
