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
  PaginatedResponse,
  DashboardStats,
  BulkImportResult,
} from '@/types/exp-hub';

const BASE = '/snippets';

// ─── Categories ────────────────────────────────────────────────────────────────

export const snippetCategoriesApi = {
  getAll: () =>
    api.get<{ success: boolean; data: SnippetCategory[] }>(`${BASE}/categories`),

  create: (data: { name: string; parentId?: number | null; sortOrder?: number }) =>
    api.post<{ success: boolean; data: SnippetCategory }>(`${BASE}/categories`, data),

  update: (id: number, data: { name?: string; parentId?: number | null; sortOrder?: number }) =>
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
    language: string;
    code: string;
    explanation?: string;
    youtubeUrl?: string;
    referenceUrl?: string;
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
    explanation?: string;
    youtubeUrl?: string;
    referenceUrl?: string;
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
