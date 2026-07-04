/**
 * EXP_Hub — Snippets Service
 */

import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import type { Prisma } from '@prisma/client';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getIpHash(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// ─── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
  const categories = await prisma.snippetCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { snippets: true, children: true } } },
  });

  const map = new Map<number | null, typeof categories>();
  for (const cat of categories) {
    const parentId = cat.parentId;
    if (!map.has(parentId)) map.set(parentId, []);
    map.get(parentId)!.push(cat);
  }

  function buildTree(parentId: number | null): Array<typeof categories[0] & { children: typeof categories }> {
    const children = map.get(parentId) ?? [];
    return children.map(cat => ({ ...cat, children: buildTree(cat.id) }));
  }

  return buildTree(null);
}

export async function createCategory(data: { name: string; parentId?: number | null; sortOrder?: number }) {
  const generatedSlug = slugify(data.name);
  const existing = await prisma.snippetCategory.findUnique({ where: { slug: generatedSlug } });
  if (existing) throw new BadRequestError('A category with this name already exists');

  return prisma.snippetCategory.create({
    data: { name: data.name, slug: generatedSlug, parentId: data.parentId, sortOrder: data.sortOrder ?? 0 },
  });
}

export async function updateCategory(id: number, data: { name?: string; parentId?: number | null; sortOrder?: number }) {
  const updateData: { name?: string; slug?: string; parentId?: number | null; sortOrder?: number } = {};

  if (data.name) {
    updateData.name = data.name;
    updateData.slug = slugify(data.name);
    const existing = await prisma.snippetCategory.findFirst({ where: { slug: updateData.slug, NOT: { id } } });
    if (existing) throw new BadRequestError('A category with this name already exists');
  }
  if (data.parentId !== undefined) updateData.parentId = data.parentId;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  return prisma.snippetCategory.update({ where: { id }, data: updateData });
}

export async function deleteCategory(id: number, moveChildrenTo?: number | null) {
  const children = await prisma.snippetCategory.findMany({ where: { parentId: id } });

  await prisma.snippet.updateMany({ where: { categoryId: id }, data: { categoryId: moveChildrenTo ?? null } });

  if (moveChildrenTo !== undefined) {
    await prisma.snippetCategory.updateMany({ where: { parentId: id }, data: { parentId: moveChildrenTo } });
  } else {
    for (const child of children) await deleteCategory(child.id);
  }

  return prisma.snippetCategory.delete({ where: { id } });
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getTags() {
  const tags = await prisma.snippetTag.findMany({
    orderBy: { name: 'asc' },
    // Snippet count goes through the M:N join table.
    include: { _count: { select: { snippetToTags: true } } },
  });
  // Frontend expects `_count.snippets` — flatten the join-table count.
  return tags.map(({ _count, ...tag }) => ({ ...tag, _count: { snippets: _count.snippetToTags } }));
}

export async function createTag(data: { name: string }) {
  const slug = slugify(data.name);
  const existing = await prisma.snippetTag.findFirst({ where: { slug } });
  if (existing) throw new BadRequestError('A tag with this name already exists');
  return prisma.snippetTag.create({ data: { name: data.name, slug } });
}

export async function updateTag(id: number, data: { name: string }) {
  const slug = slugify(data.name);
  const existing = await prisma.snippetTag.findFirst({ where: { slug, NOT: { id } } });
  if (existing) throw new BadRequestError('A tag with this name already exists');
  return prisma.snippetTag.update({ where: { id }, data: { name: data.name, slug } });
}

export async function deleteTag(id: number) {
  return prisma.snippetTag.delete({ where: { id } });
}

// Collect a category id plus ALL of its descendant ids (recursive tree walk).
// Used so that selecting a PARENT folder in the sidebar shows every snippet/note
// nested underneath it — a folder-explorer expectation — instead of only the
// items assigned directly to that exact category.
async function getCategoryAndDescendantIds(rootId: number): Promise<number[]> {
  const all = await prisma.snippetCategory.findMany({ select: { id: true, parentId: true } });
  const childrenOf = new Map<number, number[]>();
  for (const c of all) {
    if (c.parentId == null) continue;
    if (!childrenOf.has(c.parentId)) childrenOf.set(c.parentId, []);
    childrenOf.get(c.parentId)!.push(c.id);
  }
  const ids: number[] = [];
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop()!;
    ids.push(id);
    const kids = childrenOf.get(id);
    if (kids) stack.push(...kids);
  }
  return ids;
}

// ─── Snippets ────────────────────────────────────────────────────────────────

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

export async function getSnippets(filters: SnippetFilters = {}) {
  const { categoryId, tagIds, language, status = 'PUBLISHED', search, sort = 'newest', page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.SnippetWhereInput = {};
  if (status) where.status = status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  if (categoryId) {
    // Include the folder itself AND all nested sub-folders so a parent
    // selection surfaces everything underneath it.
    const categoryIds = await getCategoryAndDescendantIds(categoryId);
    where.categoryId = { in: categoryIds };
  }
  if (language) where.language = language;
  if (tagIds?.length) where.snippetToTags = { some: { tagId: { in: tagIds } } };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = sort === 'popular' ? { copyCount: 'desc' as const } : sort === 'upvotes' ? { upvoteCount: 'desc' as const } : { createdAt: 'desc' as const };

  const [snippets, total] = await Promise.all([
    prisma.snippet.findMany({
      where, skip, take: limit, orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, username: true, avatarUrl: true } },
        snippetToTags: { include: { tag: true } },
        _count: { select: { comments: true, upvotes: true } },
      },
    }),
    prisma.snippet.count({ where }),
  ]);

  return { snippets: snippets.map(normalizeSnippet), total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getSnippetById(id: number, ip?: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      category: true,
      author: { select: { id: true, username: true, avatarUrl: true } },
      snippetToTags: { include: { tag: true } },
      variables: { orderBy: { sortOrder: 'asc' } },
      attachments: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { comments: true, upvotes: true, bookmarks: true } },
    },
  });

  if (!snippet) throw new NotFoundError('Snippet not found');

  await prisma.snippet.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  const normalized = normalizeSnippet(snippet);
  if (ip) {
    const ipHash = getIpHash(ip);
    const [upvote, bookmark] = await Promise.all([
      prisma.snippetUpvote.findFirst({ where: { snippetId: id, ipHash } }),
      prisma.snippetBookmark.findFirst({ where: { snippetId: id, ipHash } }),
    ]);
    return { ...normalized, hasUpvoted: !!upvote, hasBookmarked: !!bookmark };
  }
  return { ...normalized, hasUpvoted: false, hasBookmarked: false };
}

export async function getSnippetBySlug(slug: string, ip?: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { id: true, username: true, avatarUrl: true } },
      snippetToTags: { include: { tag: true } },
      variables: { orderBy: { sortOrder: 'asc' } },
      attachments: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { comments: true, upvotes: true, bookmarks: true } },
    },
  });

  if (!snippet) throw new NotFoundError('Snippet not found');
  await prisma.snippet.update({ where: { id: snippet.id }, data: { viewCount: { increment: 1 } } });

  const normalized = normalizeSnippet(snippet);
  if (ip) {
    const ipHash = getIpHash(ip);
    const [upvote, bookmark] = await Promise.all([
      prisma.snippetUpvote.findFirst({ where: { snippetId: snippet.id, ipHash } }),
      prisma.snippetBookmark.findFirst({ where: { snippetId: snippet.id, ipHash } }),
    ]);
    return { ...normalized, hasUpvoted: !!upvote, hasBookmarked: !!bookmark };
  }
  return { ...normalized, hasUpvoted: false, hasBookmarked: false };
}

export type CodeBlockInput = { name?: string; language?: string; code?: string };

// Normalize incoming code blocks: drop empty ones, ensure each has a name +
// language, and mirror the FIRST block onto the legacy `code`/`language`
// columns so old readers and search keep working.
function normalizeCodeBlocks(
  blocks: CodeBlockInput[] | undefined,
  legacyCode?: string,
  legacyLanguage?: string,
): { codeBlocks: Array<{ name: string; language: string; code: string }>; code: string; language: string } {
  let list = (blocks ?? [])
    .filter((b) => (b.code ?? '').trim().length > 0)
    .map((b, i) => ({
      name: (b.name ?? '').trim() || `Code ${i + 1}`,
      language: (b.language ?? '').trim() || 'text',
      code: b.code ?? '',
    }));
  if (list.length === 0 && (legacyCode ?? '').trim()) {
    list = [{ name: 'Code', language: (legacyLanguage ?? '').trim() || 'text', code: legacyCode ?? '' }];
  }
  return {
    codeBlocks: list,
    code: list[0]?.code ?? '',
    language: list[0]?.language ?? (legacyLanguage ?? ''),
  };
}

export async function createSnippet(
  data: {
    title: string;
    description?: string;
    language: string;
    code: string;
    codeBlocks?: CodeBlockInput[];
    kind?: 'CODE' | 'NOTE';
    noteContent?: string | null;
    explanation?: string;
    youtubeUrl?: string;
    referenceUrl?: string;
    categoryId?: number | null;
    tagIds?: number[];
    variables?: Array<{ key: string; label: string; defaultValue?: string }>;
    previewUrl?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  },
  authorId?: number
) {
  const slug = slugify(data.title);
  const existing = await prisma.snippet.findUnique({ where: { slug } });
  if (existing) throw new BadRequestError('A snippet with this title already exists');

  const cb = normalizeCodeBlocks(data.codeBlocks, data.code, data.language);

  const snippet = await prisma.snippet.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      kind: data.kind ?? 'CODE',
      language: cb.language,
      code: cb.code,
      codeBlocks: cb.codeBlocks as unknown as Prisma.InputJsonValue,
      noteContent: data.noteContent,
      explanation: data.explanation,
      youtubeUrl: data.youtubeUrl,
      referenceUrl: data.referenceUrl,
      categoryId: data.categoryId,
      previewUrl: data.previewUrl,
      status: data.status ?? 'DRAFT',
      authorId,
      snippetToTags: data.tagIds?.length ? { create: data.tagIds.map(tagId => ({ tagId })) } : undefined,
    },
    include: { snippetToTags: { include: { tag: true } }, variables: true },
  });

  if (data.variables?.length) {
    await prisma.snippetVariable.createMany({
      data: data.variables.map((v, i) => ({
        snippetId: snippet.id, key: v.key, label: v.label, defaultValue: v.defaultValue ?? null, sortOrder: i,
      })),
    });
  }

  await prisma.snippetVersion.create({ data: { snippetId: snippet.id, code: cb.code, editedById: authorId } });
  return normalizeSnippet(snippet);
}

export async function updateSnippet(
  id: number,
  data: {
    title?: string;
    description?: string;
    language?: string;
    code?: string;
    codeBlocks?: CodeBlockInput[];
    kind?: 'CODE' | 'NOTE';
    noteContent?: string | null;
    explanation?: string;
    youtubeUrl?: string;
    referenceUrl?: string;
    categoryId?: number | null;
    tagIds?: number[];
    variables?: Array<{ key: string; label: string; defaultValue?: string }>;
    previewUrl?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  },
  editorId?: number
) {
  const existing = await prisma.snippet.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Snippet not found');

  const updateData: Prisma.SnippetUpdateInput = {};

  if (data.title && data.title !== existing.title) {
    updateData.title = data.title;
    updateData.slug = slugify(data.title);
    const duplicate = await prisma.snippet.findFirst({ where: { slug: updateData.slug as string, NOT: { id } } });
    if (duplicate) throw new BadRequestError('A snippet with this title already exists');
  }

  if (data.description !== undefined) updateData.description = data.description;
  if (data.kind) updateData.kind = data.kind;
  if (data.noteContent !== undefined) updateData.noteContent = data.noteContent;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.previewUrl !== undefined) updateData.previewUrl = data.previewUrl;
  if (data.explanation !== undefined) updateData.explanation = data.explanation;
  if (data.youtubeUrl !== undefined) updateData.youtubeUrl = data.youtubeUrl;
  if (data.referenceUrl !== undefined) updateData.referenceUrl = data.referenceUrl;
  if (data.categoryId !== undefined) updateData.category = data.categoryId === null ? { disconnect: true } : { connect: { id: data.categoryId } };
  if (data.status) updateData.status = data.status;

  // Multi-block code: when the editor sends codeBlocks, they are the source
  // of truth — recompute the legacy code/language mirror from the first block.
  if (data.codeBlocks !== undefined) {
    const cb = normalizeCodeBlocks(data.codeBlocks, data.code ?? existing.code, data.language ?? existing.language);
    updateData.code = cb.code;
    updateData.language = cb.language;
    updateData.codeBlocks = cb.codeBlocks as unknown as Prisma.InputJsonValue;
  }

  // Handle tags separately
  if (data.tagIds !== undefined) {
    await prisma.snippetToTag.deleteMany({ where: { snippetId: id } });
    if (data.tagIds.length > 0) {
      await prisma.snippetToTag.createMany({
        data: data.tagIds.map(tagId => ({ snippetId: id, tagId })),
      });
    }
  }

  const snippet = await prisma.snippet.update({
    where: { id },
    data: updateData,
    include: { snippetToTags: { include: { tag: true } }, variables: true },
  });

  if (data.variables !== undefined) {
    await prisma.snippetVariable.deleteMany({ where: { snippetId: id } });
    if (data.variables.length > 0) {
      await prisma.snippetVariable.createMany({
        data: data.variables.map((v, i) => ({ snippetId: id, key: v.key, label: v.label, defaultValue: v.defaultValue ?? null, sortOrder: i })),
      });
    }
  }

  if (data.code && data.code !== existing.code) {
    await prisma.snippet.update({ where: { id }, data: { code: data.code } });
    await prisma.snippetVersion.create({ data: { snippetId: id, code: data.code, editedById: editorId } });
  }

  return normalizeSnippet(snippet);
}

export async function deleteSnippet(id: number) {
  return prisma.snippet.delete({ where: { id } });
}

export async function copySnippet(id: number, _ip?: string, variables?: Record<string, string>) {
  const snippet = await prisma.snippet.findUnique({ where: { id }, include: { variables: true } });
  if (!snippet) throw new NotFoundError('Snippet not found');

  let code = snippet.code;
  if (variables && snippet.variables.length > 0) {
    for (const v of snippet.variables) {
      if (variables[v.key] !== undefined) {
        code = code.replace(new RegExp(`\\{\\{${v.key}\\}\\}`, 'g'), variables[v.key]);
      }
    }
  }

  await prisma.snippet.update({ where: { id }, data: { copyCount: { increment: 1 } } });
  return { code, language: snippet.language };
}

// ─── Upvotes ──────────────────────────────────────────────────────────────

export async function toggleUpvote(snippetId: number, ip?: string, userId?: number) {
  if (!ip && !userId) throw new BadRequestError('IP or user ID required');
  const snippet = await prisma.snippet.findUnique({ where: { id: snippetId } });
  if (!snippet) throw new NotFoundError('Snippet not found');

  if (userId) {
    const existing = await prisma.snippetUpvote.findFirst({ where: { snippetId, userId } });
    if (existing) {
      await prisma.snippetUpvote.delete({ where: { id: existing.id } });
      await prisma.snippet.update({ where: { id: snippetId }, data: { upvoteCount: { decrement: 1 } } });
      return { upvoted: false };
    } else {
      await prisma.snippetUpvote.create({ data: { snippetId, userId } });
      await prisma.snippet.update({ where: { id: snippetId }, data: { upvoteCount: { increment: 1 } } });
      return { upvoted: true };
    }
  } else if (ip) {
    const ipHash = getIpHash(ip);
    const existing = await prisma.snippetUpvote.findFirst({ where: { snippetId, ipHash } });
    if (existing) {
      await prisma.snippetUpvote.delete({ where: { id: existing.id } });
      await prisma.snippet.update({ where: { id: snippetId }, data: { upvoteCount: { decrement: 1 } } });
      return { upvoted: false };
    } else {
      await prisma.snippetUpvote.create({ data: { snippetId, ipHash } });
      await prisma.snippet.update({ where: { id: snippetId }, data: { upvoteCount: { increment: 1 } } });
      return { upvoted: true };
    }
  }
  return { upvoted: false };
}

// ─── Bookmarks ────────────────────────────────────────────────────────────

export async function toggleBookmark(snippetId: number, ip?: string, userId?: number) {
  if (!ip && !userId) throw new BadRequestError('IP or user ID required');
  const snippet = await prisma.snippet.findUnique({ where: { id: snippetId } });
  if (!snippet) throw new NotFoundError('Snippet not found');

  if (userId) {
    const existing = await prisma.snippetBookmark.findFirst({ where: { snippetId, userId } });
    if (existing) {
      await prisma.snippetBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }
    await prisma.snippetBookmark.create({ data: { snippetId, userId } });
    return { bookmarked: true };
  } else if (ip) {
    const ipHash = getIpHash(ip);
    const existing = await prisma.snippetBookmark.findFirst({ where: { snippetId, ipHash } });
    if (existing) {
      await prisma.snippetBookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }
    await prisma.snippetBookmark.create({ data: { snippetId, ipHash } });
    return { bookmarked: true };
  }
  return { bookmarked: false };
}

export async function getBookmarks(userId?: number, ip?: string) {
  if (!userId && !ip) return { bookmarks: [], total: 0 };
  const where = userId ? { userId } : { ipHash: ip ? getIpHash(ip) : undefined };
  const bookmarks = await prisma.snippetBookmark.findMany({
    where, orderBy: { createdAt: 'desc' },
    include: {
      snippet: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
          snippetToTags: { include: { tag: true } },
          author: { select: { id: true, username: true, avatarUrl: true } },
        },
      },
    },
  });
  return { bookmarks: bookmarks.map(b => normalizeSnippet(b.snippet)), total: bookmarks.length };
}

// ─── Version History ────────────────────────────────────────────────────

export async function getSnippetVersions(snippetId: number) {
  return prisma.snippetVersion.findMany({
    where: { snippetId }, orderBy: { editedAt: 'desc' },
    include: { editedBy: { select: { id: true, username: true } } },
  });
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [totalSnippets, totalCategories, totalTags, mostCopied, recentActivity, categoryStats] = await Promise.all([
    prisma.snippet.count({ where: { status: 'PUBLISHED' } }),
    prisma.snippetCategory.count(),
    prisma.snippetTag.count(),
    prisma.snippet.findMany({
      where: { status: 'PUBLISHED' }, orderBy: { copyCount: 'desc' }, take: 10,
      select: { id: true, title: true, slug: true, language: true, copyCount: true, viewCount: true, upvoteCount: true },
    }),
    prisma.snippet.findMany({
      where: { status: 'PUBLISHED' }, orderBy: { updatedAt: 'desc' }, take: 10,
      select: { id: true, title: true, slug: true, language: true, updatedAt: true, author: { select: { username: true } } },
    }),
    prisma.snippet.groupBy({
      by: ['categoryId'], where: { status: 'PUBLISHED', categoryId: { not: null } },
      _count: true, orderBy: { _count: { categoryId: 'desc' } }, take: 10,
    }),
  ]);

  const categoryIds = categoryStats.map(c => c.categoryId).filter(Boolean);
  const categories = await prisma.snippetCategory.findMany({
    where: { id: { in: categoryIds as number[] } }, select: { id: true, name: true, slug: true },
  });
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return {
    totalSnippets, totalCategories, totalTags, mostCopied, recentActivity,
    categoryStats: categoryStats.map(c => ({ ...c, category: categoryMap.get(c.categoryId as number) })),
  };
}

// ─── Full-text Search ───────────────────────────────────────────────

export async function searchSnippets(query: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const where = {
    status: 'PUBLISHED' as const,
    OR: [
      { title: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } },
      { code: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const [snippets, total] = await Promise.all([
    prisma.snippet.findMany({
      where, skip, take: limit, orderBy: [{ copyCount: 'desc' }, { viewCount: 'desc' }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, username: true, avatarUrl: true } },
        snippetToTags: { include: { tag: true } },
        _count: { select: { comments: true, upvotes: true } },
      },
    }),
    prisma.snippet.count({ where }),
  ]);

  return { snippets: snippets.map(normalizeSnippet), total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Bulk Import ─────────────────────────────────────────────────────

export async function bulkImportSnippets(
  items: Array<{ title: string; description?: string; language: string; code: string; categoryId?: number; tags?: string[] }>,
  authorId?: number
) {
  const results: Array<{ title: string; status: 'success' | 'error'; message?: string; id?: number }> = [];

  for (const item of items) {
    try {
      const slug = slugify(item.title);
      const existing = await prisma.snippet.findUnique({ where: { slug } });
      if (existing) {
        results.push({ title: item.title, status: 'error', message: 'Snippet with this title already exists' });
        continue;
      }

      const tagIds: number[] = [];
      if (item.tags?.length) {
        for (const tagName of item.tags) {
          const tagSlug = slugify(tagName);
          let tag = await prisma.snippetTag.findUnique({ where: { slug: tagSlug } });
          if (!tag) tag = await prisma.snippetTag.create({ data: { name: tagName, slug: tagSlug } });
          tagIds.push(tag.id);
        }
      }

      const snippet = await prisma.snippet.create({
        data: {
          title: item.title, slug, description: item.description, language: item.language,
          code: item.code, categoryId: item.categoryId, status: 'DRAFT', authorId,
          snippetToTags: tagIds.length ? { create: tagIds.map(tagId => ({ tagId })) } : undefined,
        },
      });

      await prisma.snippetVersion.create({ data: { snippetId: snippet.id, code: item.code, editedById: authorId } });
      results.push({ title: item.title, status: 'success', id: snippet.id });
    } catch (error) {
      results.push({ title: item.title, status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return results;
}

// ─── Normalizers ─────────────────────────────────────────────────────

function normalizeSnippet(snippet: any) {
  const snippetToTags = snippet.snippetToTags;
  const _count = snippet._count;
  const tags = snippetToTags?.map((st: any) => st.tag) ?? [];
  return {
    ...snippet,
    tags,
    tagNames: tags.map((t: any) => t.name),
    commentCount: _count?.comments ?? 0,
    upvoteCount_total: _count?.upvotes ?? 0,
  };
}

// ─── Language Detection ──────────────────────────────────────────

const EXTENSION_MAP: Record<string, string> = {
  '.js': 'javascript', '.jsx': 'javascript', '.ts': 'typescript', '.tsx': 'typescript',
  '.py': 'python', '.rb': 'ruby', '.java': 'java', '.go': 'go', '.rs': 'rust',
  '.c': 'c', '.cpp': 'cpp', '.cs': 'csharp', '.php': 'php', '.swift': 'swift',
  '.kt': 'kotlin', '.scala': 'scala', '.r': 'r', '.sql': 'sql', '.sh': 'bash',
  '.bash': 'bash', '.ps1': 'powershell', '.yaml': 'yaml', '.yml': 'yaml',
  '.json': 'json', '.xml': 'xml', '.html': 'html', '.css': 'css', '.md': 'markdown',
};

export function detectLanguage(filename: string): string {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  return EXTENSION_MAP[ext] ?? 'text';
}
