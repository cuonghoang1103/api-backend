/**
 * EXP_Hub — TypeScript Types
 */

export interface SnippetCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  sortOrder: number;
  // Rich metadata (P2 upgrade — all optional/additive)
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  coverImageUrl?: string | null;
  docsUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { snippets: number; children: number };
  children?: SnippetCategory[];
}

export interface SnippetTag {
  id: number;
  name: string;
  slug: string;
  _count?: { snippets: number };
}

export interface SnippetAuthor {
  id: number;
  username: string;
  avatarUrl: string | null;
}

export interface Snippet {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  // A snippet can carry several named code blocks AND an optional rich-text
  // note section. PROJECT-kind entries also carry a `repoUrl` (GitHub repo)
  // and typically use codeBlocks as named files + downloadable attachments.
  kind?: 'CODE' | 'NOTE' | 'PROJECT';
  language: string;
  code: string;
  // Named, ordered code blocks. Falls back to a single { code, language }
  // block for legacy snippets (the backend synthesises it).
  codeBlocks?: Array<{ name: string; language: string; code: string }> | null;
  // Optional rich-text (HTML) note section shown alongside the code.
  noteContent: string | null;
  explanation: string | null;
  youtubeUrl: string | null;
  referenceUrl: string | null;
  // GitHub repo URL for PROJECT-kind entries (rendered as a repo card).
  repoUrl: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  copyCount: number;
  upvoteCount: number;
  previewUrl: string | null;
  categoryId: number | null;
  authorId: number | null;
  createdAt: string;
  updatedAt: string;
  category?: SnippetCategory | null;
  author?: SnippetAuthor | null;
  tags: SnippetTag[];
  tagNames?: string[];
  variables?: SnippetVariable[];
  attachments?: SnippetAttachment[];
  commentCount?: number;
  upvoteCount_total?: number;
  hasUpvoted?: boolean;
  hasBookmarked?: boolean;
}

export interface SnippetVariable {
  id: number;
  snippetId: number;
  key: string;
  label: string;
  defaultValue: string | null;
  sortOrder: number;
}

export interface SnippetAttachment {
  id: number;
  snippetId: number;
  fileUrl: string;
  originalName: string;
  fileType: string | null;
  fileSize: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface SnippetVersion {
  id: number;
  snippetId: number;
  code: string;
  editedById: number | null;
  editedAt: string;
  editedBy?: { id: number; username: string } | null;
}

export interface SnippetFilters {
  categoryId?: number;
  tagIds?: number[];
  language?: string;
  status?: string;
  search?: string;
  sort?: 'popular' | 'newest' | 'upvotes';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalSnippets: number;
  totalCategories: number;
  totalTags: number;
  mostCopied: Array<{
    id: number;
    title: string;
    slug: string;
    language: string;
    copyCount: number;
    viewCount: number;
    upvoteCount: number;
  }>;
  recentActivity: Array<{
    id: number;
    title: string;
    slug: string;
    language: string;
    updatedAt: string;
    author?: { username: string };
  }>;
  categoryStats: Array<{
    categoryId: number;
    _count: { categoryId: number };
    category?: { id: number; name: string; slug: string };
  }>;
}

export interface BulkImportResult {
  title: string;
  status: 'success' | 'error';
  message?: string;
  id?: number;
}
