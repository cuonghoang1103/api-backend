// ─── Hub — Personal Bookmark Manager (service layer) ──────────────
//
// All Hub endpoints follow the same pattern: userId is taken from
// req.userId (set by the authenticate middleware), and every query
// includes `userId` in its WHERE clause. The frontend never needs
// to send userId — that's the only way to guarantee a hostile
// client can't read or mutate another user's data.
//
// Scrape uses Node 20's built-in `fetch` (no extra dependency) and
// regex-based meta parsing. The regex approach is "good enough" for
// 95% of sites because Open Graph markup is repetitive; we only fall
// back to <title>/<meta name=description> when og:* tags are absent.

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { nanoid } from 'nanoid';

// ─── Folder CRUD ────────────────────────────────────────────

export async function listFolders(userId: number) {
  return prisma.hubFolder.findMany({
    where: { userId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { links: true, files: true } } },
  });
}

export async function createFolder(
  userId: number,
  data: { name: string; icon?: string | null; sortOrder?: number; parentId?: number | null },
) {
  const name = data.name.trim();
  if (name.length === 0 || name.length > 100) {
    throw new AppError('Ten thu muc 1-100 ky tu', 400, 'INVALID_NAME');
  }
  if (data.icon != null && data.icon.length > 500) {
    throw new AppError('Icon qua dai (max 500 ky tu)', 400, 'INVALID_ICON');
  }
  if (data.parentId != null) {
    await assertFolderOwnership(userId, data.parentId);
    // Enforce max 2-level depth
    const parent = await prisma.hubFolder.findFirst({
      where: { id: data.parentId, userId },
      select: { parentId: true },
    });
    if (parent?.parentId != null) {
      throw new AppError('Chi ho tro toi da 2 cap thu muc', 400, 'FOLDER_DEPTH_EXCEEDED');
    }
  }
  return prisma.hubFolder.create({
    data: {
      userId,
      name,
      icon: data.icon ?? null,
      sortOrder: typeof data.sortOrder === 'number' ? Math.floor(data.sortOrder) : 0,
      parentId: data.parentId ?? null,
    },
    include: { _count: { select: { links: true, files: true } } },
  });
}

export async function updateFolder(
  userId: number,
  id: number,
  data: { name?: string; icon?: string | null; sortOrder?: number; parentId?: number | null },
) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) {
    const name = String(data.name).trim();
    if (name.length === 0 || name.length > 100) {
      throw new AppError('Ten thu muc 1-100 ky tu', 400, 'INVALID_NAME');
    }
    updateData.name = name;
  }
  if (data.icon !== undefined) {
    if (data.icon != null && String(data.icon).length > 500) {
      throw new AppError('Icon qua dai (max 500 ky tu)', 400, 'INVALID_ICON');
    }
    updateData.icon = data.icon;
  }
  if (data.sortOrder !== undefined) {
    if (typeof data.sortOrder !== 'number') {
      throw new AppError('sortOrder phai la so', 400, 'INVALID_SORT');
    }
    updateData.sortOrder = Math.floor(data.sortOrder);
  }
  if (data.parentId !== undefined) {
    if (data.parentId !== null) {
      await assertFolderOwnership(userId, data.parentId);
      // Prevent nesting a folder under itself or a descendant
      if (data.parentId === id) {
        throw new AppError('Khong the chuyen thu muc vao chinh no', 400, 'INVALID_PARENT');
      }
      const descendantIds = await getDescendantFolderIds(id);
      if (descendantIds.includes(data.parentId)) {
        throw new AppError('Khong the chuyen thu muc vao thu muc con', 400, 'INVALID_PARENT');
      }
      // Enforce max 2-level depth
      const parent = await prisma.hubFolder.findFirst({
        where: { id: data.parentId, userId },
        select: { parentId: true },
      });
      if (parent?.parentId != null) {
        throw new AppError('Chi ho tro toi da 2 cap thu muc', 400, 'FOLDER_DEPTH_EXCEEDED');
      }
    }
    updateData.parentId = data.parentId;
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Khong co truong hop le de cap nhat', 400, 'EMPTY_UPDATE');
  }
  // updateMany + userId in WHERE → can't touch someone else's folder
  const result = await prisma.hubFolder.updateMany({
    where: { id, userId },
    data: updateData,
  });
  if (result.count === 0) {
    throw new AppError('Folder khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return prisma.hubFolder.findUnique({
    where: { id },
    include: { _count: { select: { links: true, files: true } } },
  });
}

export async function deleteFolder(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  // Links keep existing with folderId = NULL (ON DELETE SET NULL).
  // The deleteMany + userId in WHERE is the cross-tenant guard.
  const result = await prisma.hubFolder.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    throw new AppError('Folder khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return { id, deleted: true };
}

// ─── Link CRUD ──────────────────────────────────────────────

export type ListLinksOpts = {
  folderId?: number | null | 'all';
  keyword?: string;
  page?: number;
  pageSize?: number;
};

export async function listLinks(userId: number, opts: ListLinksOpts) {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(opts.pageSize ?? 50)));

  // folderId semantics:
  //   - undefined / 'all'  → all links
  //   - null               → links with NO folder (unsorted)
  //   - number             → links in that folder
  const folderFilter = (() => {
    if (opts.folderId === undefined || opts.folderId === 'all') return {};
    if (opts.folderId === null) return { folderId: null };
    return { folderId: opts.folderId };
  })();

  const keyword = opts.keyword?.trim();
  const keywordFilter = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' as const } },
          { notes: { contains: keyword, mode: 'insensitive' as const } },
          { tags: { has: keyword } },
          { url: { contains: keyword, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const where = {
    userId,
    ...folderFilter,
    ...keywordFilter,
  };

  const [items, total] = await Promise.all([
    prisma.hubLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.hubLink.count({ where }),
  ]);

  return {
    items: items.map(serializeLink),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createLink(
  userId: number,
  data: {
    folderId?: number | null;
    url: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
  },
) {
  const url = String(data.url ?? '').trim();
  if (!url) throw new AppError('url la bat buoc', 400, 'MISSING_URL');
  if (url.length > 2000) throw new AppError('url qua dai (max 2000 ky tu)', 400, 'URL_TOO_LONG');
  try {
    new URL(url);
  } catch {
    throw new AppError('url khong hop le (phai la http/https)', 400, 'INVALID_URL');
  }

  const title = String(data.title ?? '').trim();
  if (!title) throw new AppError('title la bat buoc', 400, 'MISSING_TITLE');
  if (title.length > 500) throw new AppError('title qua dai (max 500 ky tu)', 400, 'TITLE_TOO_LONG');

  if (data.folderId != null) {
    await assertFolderOwnership(userId, data.folderId);
  }

  const tags = normalizeTags(data.tags);

  // isPublic = true → generate a unique publicSlug.
  // isPublic = false → keep slug null (saves a UNIQUE constraint slot).
  const wantsPublic = data.isPublic === true;

  return prisma.hubLink.create({
    data: {
      userId,
      folderId: data.folderId ?? null,
      url,
      title,
      description: data.description?.trim() || null,
      thumbnailUrl: data.thumbnailUrl?.trim() || null,
      faviconUrl: data.faviconUrl?.trim() || null,
      notes: data.notes?.trim() || null,
      tags,
      isPublic: wantsPublic,
      publicSlug: wantsPublic ? await uniquePublicSlug() : null,
    },
  });
}

export async function updateLink(
  userId: number,
  id: number,
  data: {
    folderId?: number | null;
    url?: string;
    title?: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    faviconUrl?: string | null;
    notes?: string | null;
    tags?: string[];
    isPublic?: boolean;
    status?: string;
  },
) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const updateData: Record<string, unknown> = {};
  if (data.url !== undefined) {
    const url = String(data.url).trim();
    if (!url) throw new AppError('url khong duoc rong', 400, 'INVALID_URL');
    if (url.length > 2000) throw new AppError('url qua dai', 400, 'URL_TOO_LONG');
    try {
      new URL(url);
    } catch {
      throw new AppError('url khong hop le', 400, 'INVALID_URL');
    }
    updateData.url = url;
  }
  if (data.title !== undefined) {
    const title = String(data.title).trim();
    if (!title) throw new AppError('title khong duoc rong', 400, 'MISSING_TITLE');
    if (title.length > 500) throw new AppError('title qua dai', 400, 'TITLE_TOO_LONG');
    updateData.title = title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description == null ? null : String(data.description).trim() || null;
  }
  if (data.thumbnailUrl !== undefined) {
    updateData.thumbnailUrl = data.thumbnailUrl == null
      ? null
      : String(data.thumbnailUrl).trim() || null;
  }
  if (data.faviconUrl !== undefined) {
    updateData.faviconUrl = data.faviconUrl == null
      ? null
      : String(data.faviconUrl).trim() || null;
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes == null ? null : String(data.notes).trim() || null;
  }
  if (data.tags !== undefined) {
    updateData.tags = normalizeTags(data.tags);
  }
  if (data.folderId !== undefined) {
    if (data.folderId == null) {
      updateData.folderId = null;
    } else {
      await assertFolderOwnership(userId, data.folderId);
      updateData.folderId = data.folderId;
    }
  }
  if (data.isPublic !== undefined) {
    const wantsPublic = data.isPublic === true;
    updateData.isPublic = wantsPublic;
    // Regenerate slug when transitioning to public; clear when going private.
    if (wantsPublic) {
      const existing = await prisma.hubLink.findFirst({
        where: { id, userId },
        select: { publicSlug: true },
      });
      if (!existing) {
        throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
      }
      updateData.publicSlug = existing.publicSlug ?? (await uniquePublicSlug());
    } else {
      updateData.publicSlug = null;
    }
  }
  const VALID_STATUSES = ['unread', 'learning', 'done'];
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      throw new AppError(`Status phai la mot trong: ${VALID_STATUSES.join(', ')}`, 400, 'INVALID_STATUS');
    }
    updateData.status = data.status;
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Khong co truong hop le de cap nhat', 400, 'EMPTY_UPDATE');
  }

  const result = await prisma.hubLink.updateMany({
    where: { id, userId },
    data: updateData,
  });
  if (result.count === 0) {
    throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return prisma.hubLink.findUnique({ where: { id } });
}

export async function deleteLink(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  // Clear publicSlug in a separate step before deleting — Prisma's
  // `delete` bypasses `update` callbacks, so we can't set it to null
  // as part of the delete. Two queries but the row is gone either way
  // and the unique index stays clean.
  await prisma.hubLink.updateMany({
    where: { id, userId, publicSlug: { not: null } },
    data: { publicSlug: null },
  });
  const result = await prisma.hubLink.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) {
    throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return { id, deleted: true };
}

// ─── File CRUD ──────────────────────────────────────────────

export type ListFilesOpts = {
  folderId?: number | null | 'all';
  status?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
};

export async function listFiles(userId: number, opts: ListFilesOpts) {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(opts.pageSize ?? 50)));

  const folderFilter = (() => {
    if (opts.folderId === undefined || opts.folderId === 'all') return {};
    if (opts.folderId === null) return { folderId: null };
    return { folderId: opts.folderId };
  })();

  const statusFilter = opts.status ? { status: opts.status } : {};

  const keyword = opts.keyword?.trim();
  const keywordFilter = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' as const } },
          { notes: { contains: keyword, mode: 'insensitive' as const } },
          { tags: { has: keyword } },
        ],
      }
    : {};

  const where = { userId, ...folderFilter, ...statusFilter, ...keywordFilter };

  const [items, total] = await Promise.all([
    prisma.hubFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.hubFile.count({ where }),
  ]);

  return {
    items: items.map(serializeFile),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createFile(
  userId: number,
  data: {
    folderId?: number | null;
    name: string;
    key: string;
    size: number;
    mimeType: string;
    tags?: string[];
    notes?: string | null;
    isPublic?: boolean;
  },
) {
  const name = String(data.name ?? '').trim();
  if (!name || name.length > 255) {
    throw new AppError('Ten file 1-255 ky tu', 400, 'INVALID_NAME');
  }
  if (data.folderId != null) {
    await assertFolderOwnership(userId, data.folderId);
  }

  const tags = normalizeTags(data.tags);
  const wantsPublic = data.isPublic === true;

  return prisma.hubFile.create({
    data: {
      userId,
      folderId: data.folderId ?? null,
      name,
      key: String(data.key),
      size: Math.max(0, Math.floor(data.size)),
      mimeType: String(data.mimeType).slice(0, 100),
      tags,
      notes: data.notes?.trim() || null,
      isPublic: wantsPublic,
      publicSlug: wantsPublic ? await uniqueFilePublicSlug() : null,
    },
  });
}

export async function updateFile(
  userId: number,
  id: number,
  data: {
    folderId?: number | null;
    name?: string;
    tags?: string[];
    notes?: string | null;
    status?: string;
    isPublic?: boolean;
  },
) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const VALID_STATUSES = ['unread', 'learning', 'done'];
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) {
    const name = String(data.name).trim();
    if (!name || name.length > 255) {
      throw new AppError('Ten file 1-255 ky tu', 400, 'INVALID_NAME');
    }
    updateData.name = name;
  }
  if (data.folderId !== undefined) {
    if (data.folderId == null) {
      updateData.folderId = null;
    } else {
      await assertFolderOwnership(userId, data.folderId);
      updateData.folderId = data.folderId;
    }
  }
  if (data.tags !== undefined) {
    updateData.tags = normalizeTags(data.tags);
  }
  if (data.notes !== undefined) {
    updateData.notes = data.notes == null ? null : String(data.notes).trim() || null;
  }
  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      throw new AppError(`Status phai la mot trong: ${VALID_STATUSES.join(', ')}`, 400, 'INVALID_STATUS');
    }
    updateData.status = data.status;
  }
  if (data.isPublic !== undefined) {
    const wantsPublic = data.isPublic === true;
    updateData.isPublic = wantsPublic;
    if (wantsPublic) {
      const existing = await prisma.hubFile.findFirst({
        where: { id, userId },
        select: { publicSlug: true },
      });
      if (!existing) {
        throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
      }
      updateData.publicSlug = existing.publicSlug ?? (await uniqueFilePublicSlug());
    } else {
      updateData.publicSlug = null;
    }
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Khong co truong hop le de cap nhat', 400, 'EMPTY_UPDATE');
  }

  const result = await prisma.hubFile.updateMany({
    where: { id, userId },
    data: updateData,
  });
  if (result.count === 0) {
    throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  return prisma.hubFile.findUnique({ where: { id } });
}

export async function deleteFile(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const file = await prisma.hubFile.findFirst({
    where: { id, userId },
    select: { id: true, key: true, publicSlug: true },
  });
  if (!file) {
    throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  // Delete from R2 (non-fatal if already gone)
  try {
    const { deleteObject } = await import('../config/r2.js');
    await deleteObject(file.key);
  } catch {
    // Non-fatal: file may already be gone from R2
  }
  // Clear publicSlug before delete — Prisma deleteMany bypasses
  // update callbacks so we need a separate update call to clear
  // the unique constraint before the row is removed.
  if (file.publicSlug) {
    await prisma.hubFile.updateMany({
      where: { id, userId, publicSlug: file.publicSlug },
      data: { publicSlug: null },
    });
  }
  await prisma.hubFile.deleteMany({ where: { id, userId } });
  return { id, deleted: true };
}

export async function getSignedFileUrl(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const file = await prisma.hubFile.findFirst({
    where: { id, userId },
    select: { id: true, key: true, name: true, mimeType: true },
  });
  if (!file) {
    throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }
  const { getSignedDownloadUrl } = await import('../config/r2.js');
  const url = await getSignedDownloadUrl(file.key, 300, file.name);
  return { url, mimeType: file.mimeType };
}

/**
 * Recipient-side signed URL: returns a short-lived download URL
 * ONLY if a HubShare row exists where the caller is the recipient
 * AND the share's permission is "view_download". View-only shares
 * cannot download — they can still preview via the public-by-id
 * endpoint? No — files don't have public-by-id, only public-by-slug
 * (isPublic=true). So view-only file shares can only see the file
 * card (name, size, mime) but cannot stream its bytes. That's the
 * intended "view-only" semantic.
 *
 * Note: this lives in hub.service.ts (not hubShare.service.ts)
 * because it needs the R2 helper + the HubFile model. Splitting
 * services by feature, not by table, so files-stuff stays here.
 */
export async function getSharedFileDownloadUrl(recipientId: number, fileId: number) {
  if (!Number.isInteger(fileId) || fileId <= 0) {
    throw new AppError('fileId khong hop le', 400, 'INVALID_ID');
  }
  const share = await prisma.hubShare.findFirst({
    where: {
      recipientId,
      fileId,
      permission: 'view_download',
    },
    select: {
      id: true,
      file: { select: { id: true, key: true, name: true, mimeType: true } },
    },
  });
  if (!share || !share.file) {
    throw new AppError(
      'File khong duoc share cho ban hoac share la view-only (khong the download)',
      403,
      'NO_DOWNLOAD_PERMISSION',
    );
  }
  const { getSignedDownloadUrl } = await import('../config/r2.js');
  const url = await getSignedDownloadUrl(share.file.key, 300, share.file.name);
  return { url, mimeType: share.file.mimeType };
}

// ─── AI Auto-tagging ────────────────────────────────────────

const TAG_PROMPT_SYSTEM = 'Ban la mot chuyen gia phan loai tai lieu. Nhan vao ten file (name) va dinh dang (mimeType), tra ve danh sach tag phu hop. Chi tra ve danh sach tag, moi tag la mot chu thuong, khong dau, toi da 10 tag, phan cach nhau bang dau phay. Cac tag can phu hop voi noi dung tai lieu. Vi du: name="postgres_tuning.sql", mimeType="application/sql" => "database, postgresql, sql, performance, backend". Khong giai thich, chi tra ve tags.';

const TAG_PROMPT_USER = (name: string, mimeType: string) =>
  `Ten file: ${name}\nDinh dang: ${mimeType}`;

const EXTENSION_TAG_MAP: Record<string, string[]> = {
  '.pdf': ['document', 'pdf'],
  '.docx': ['document', 'word'],
  '.doc': ['document', 'word'],
  '.txt': ['document', 'text'],
  '.md': ['markdown', 'documentation'],
  '.sql': ['database', 'sql'],
  '.ts': ['typescript', 'frontend'],
  '.tsx': ['react', 'typescript', 'frontend'],
  '.js': ['javascript', 'frontend'],
  '.jsx': ['react', 'javascript', 'frontend'],
  '.py': ['python', 'backend'],
  '.java': ['java', 'backend'],
  '.go': ['golang', 'backend'],
  '.rs': ['rust', 'backend'],
  '.cs': ['csharp', 'backend'],
  '.cpp': ['cpp', 'backend'],
  '.c': ['c', 'backend'],
  '.zip': ['archive', 'compressed'],
  '.tar': ['archive', 'compressed'],
  '.gz': ['archive', 'compressed'],
  '.rar': ['archive', 'compressed'],
  '.json': ['data', 'config'],
  '.xml': ['data', 'config'],
  '.yaml': ['devops', 'config'],
  '.yml': ['devops', 'config'],
  '.png': ['image', 'image'],
  '.jpg': ['image', 'image'],
  '.jpeg': ['image', 'image'],
  '.gif': ['image', 'image'],
  '.webp': ['image', 'image'],
  '.svg': ['image', 'vector'],
  '.mp4': ['video', 'media'],
  '.mp3': ['audio', 'media'],
  '.wav': ['audio', 'media'],
  '.css': ['css', 'frontend'],
  '.html': ['html', 'frontend'],
  '.sh': ['bash', 'devops'],
  '.ps1': ['powershell', 'devops'],
};

export async function aiSuggestTags(userId: number, id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('id khong hop le', 400, 'INVALID_ID');
  }
  const file = await prisma.hubFile.findFirst({
    where: { id, userId },
    select: { id: true, name: true, mimeType: true, tags: true },
  });
  if (!file) {
    throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'NOT_FOUND');
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  const extTags = EXTENSION_TAG_MAP[ext] ?? [];
  let suggestedTags = [...new Set(extTags)];

  // Try AI tagging via Groq
  try {
    const { chatWithFallback } = await import('../services/aiProviders.js');
    const result = await chatWithFallback({
      messages: [
        { role: 'system', content: TAG_PROMPT_SYSTEM },
        { role: 'user', content: TAG_PROMPT_USER(file.name, file.mimeType) },
      ],
      maxTokens: 100,
    });
    const rawContent = result.text ?? '';
    const aiTags = rawContent
      .toLowerCase()
      .replace(/tags?:\s*/gi, '')
      .split(',')
      .map((t: string) => t.trim().replace(/^#+/, ''))
      .filter((t: string) => t.length > 0 && t.length <= 50);
    if (aiTags.length > 0) {
      suggestedTags = [...new Set([...suggestedTags, ...aiTags])];
    }
  } catch {
    // AI unavailable — fall back to extension-based tags only
  }

  const merged = [...new Set([...file.tags, ...suggestedTags])].slice(0, 30);
  await prisma.hubFile.updateMany({
    where: { id, userId },
    data: { tags: merged },
  });
  return { tags: merged };
}

// ─── Public file lookup ──────────────────────────────────────

export async function getPublicFile(slug: string) {
  const cleanSlug = String(slug ?? '').trim();
  if (!cleanSlug) return null;
  return prisma.hubFile.findFirst({
    where: { publicSlug: cleanSlug, isPublic: true },
    select: {
      id: true, name: true, mimeType: true, size: true,
      publicSlug: true, createdAt: true,
    },
  });
}

// ─── Scrape ─────────────────────────────────────────────────

export type ScrapeResult = {
  url: string;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  faviconUrl: string | null;
  siteName: string | null;
};

const SCRAPE_TIMEOUT_MS = 8000;
const SCRAPE_MAX_BYTES = 2 * 1024 * 1024; // 2MB cap — we only need the head of the HTML
const MAX_REDIRECTS = 5;

/**
 * Fetch a URL and extract Open Graph / Twitter card metadata.
 *
 * Safety: only http(s) URLs are accepted and the redirect chain
 * is bounded so a malicious host can't make us follow infinite
 * redirects. We also enforce a 2MB cap on the response body via
 * a manual byte counter — a streaming fetch() would not respect
 * this on its own. The final URL is returned so the client can
 * see what we actually scraped (after redirects).
 */
export async function scrapeUrl(_userId: number, rawUrl: string): Promise<ScrapeResult> {
  const url = rawUrl.trim();
  if (!url) throw new AppError('url la bat buoc', 400, 'MISSING_URL');

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AppError('url khong hop le', 400, 'INVALID_URL');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new AppError('url phai la http hoac https', 400, 'INVALID_PROTOCOL');
  }
  // Basic SSRF block — keep it short, the goal is just to refuse
  // loopback / private addresses. A real production system would
  // also resolve DNS and re-check at the end of each redirect.
  if (isPrivateHost(parsed.hostname)) {
    throw new AppError('url khong duoc tro vao mang noi bo', 400, 'PRIVATE_HOST');
  }

  let html: string;
  let finalUrl: string;
  try {
    ({ html, finalUrl } = await fetchWithCap(url, SCRAPE_TIMEOUT_MS, SCRAPE_MAX_BYTES, MAX_REDIRECTS));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'fetch failed';
    throw new AppError(`Khong the doc noi dung trang: ${message}`, 502, 'SCRAPE_FAILED');
  }

  const baseUrl = new URL(finalUrl);
  return {
    url: finalUrl,
    title: pickMeta(html, ['og:title', 'twitter:title']) ?? pickTagTitle(html),
    description: pickMeta(html, [
      'og:description',
      'twitter:description',
      'description',
    ]),
    thumbnailUrl: absolutize(pickMeta(html, ['og:image', 'twitter:image']), baseUrl),
    faviconUrl: pickFavicon(html, baseUrl),
    siteName: pickMeta(html, ['og:site_name']),
  };
}

// ─── Public lookup (no auth) ────────────────────────────────

/**
 * Returns a sanitized public view of a link. Only links with
 * isPublic=true are returned. We intentionally omit userId,
 * notes, and personal tags — the public endpoint must not leak
 * anything the owner didn't explicitly share.
 */
export async function getPublicLink(slug: string) {
  const cleanSlug = String(slug ?? '').trim();
  if (!cleanSlug) return null;
  const link = await prisma.hubLink.findFirst({
    where: { publicSlug: cleanSlug, isPublic: true },
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      faviconUrl: true,
      publicSlug: true,
      createdAt: true,
    },
  });
  return link;
}

// ─── helpers ────────────────────────────────────────────────

function serializeLink(l: {
  id: number; folderId: number | null; url: string; title: string;
  description: string | null; thumbnailUrl: string | null;
  faviconUrl: string | null; notes: string | null; tags: string[];
  isPublic: boolean; publicSlug: string | null; status: string;
  createdAt: Date; updatedAt: Date;
}) {
  return {
    id: l.id,
    folderId: l.folderId,
    url: l.url,
    title: l.title,
    description: l.description,
    thumbnailUrl: l.thumbnailUrl,
    faviconUrl: l.faviconUrl,
    notes: l.notes,
    tags: l.tags,
    isPublic: l.isPublic,
    publicSlug: l.publicSlug,
    status: l.status,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

/**
 * Hub ownership helpers — exported so hubShare.service.ts can
 * reuse them when the share owner proves they own the item
 * they're sharing. Centralising prevents "ownership check
 * drift" between services. Throws 404 (not 403) when the item
 * exists but belongs to someone else — that's the existing
 * pattern in hub.service.ts and we mirror it here so the
 * 404 vs 403 distinction stays consistent across the module.
 */
export async function assertFolderOwnership(userId: number, folderId: number) {
  if (!Number.isInteger(folderId) || folderId <= 0) {
    throw new AppError('folderId khong hop le', 400, 'INVALID_FOLDER_ID');
  }
  const folder = await prisma.hubFolder.findFirst({
    where: { id: folderId, userId },
    select: { id: true },
  });
  if (!folder) {
    throw new AppError('Folder khong ton tai hoac khong thuoc ve ban', 404, 'FOLDER_NOT_FOUND');
  }
}

/**
 * Hub ownership helpers — exported so hubShare.service.ts can
 * reuse them when the share owner proves they own the item
 * they're sharing. Centralising prevents "ownership check
 * drift" between services. Throws 404 (not 403) when the item
 * exists but belongs to someone else — that's the existing
 * pattern in hub.service.ts and we mirror it here so the
 * 404 vs 403 distinction stays consistent across the module.
 */
export async function assertLinkOwnership(userId: number, linkId: number) {
  if (!Number.isInteger(linkId) || linkId <= 0) {
    throw new AppError('linkId khong hop le', 400, 'INVALID_LINK_ID');
  }
  const link = await prisma.hubLink.findFirst({
    where: { id: linkId, userId },
    select: { id: true },
  });
  if (!link) {
    throw new AppError('Link khong ton tai hoac khong thuoc ve ban', 404, 'LINK_NOT_FOUND');
  }
}

export async function assertFileOwnership(userId: number, fileId: number) {
  if (!Number.isInteger(fileId) || fileId <= 0) {
    throw new AppError('fileId khong hop le', 400, 'INVALID_FILE_ID');
  }
  const file = await prisma.hubFile.findFirst({
    where: { id: fileId, userId },
    select: { id: true },
  });
  if (!file) {
    throw new AppError('File khong ton tai hoac khong thuoc ve ban', 404, 'FILE_NOT_FOUND');
  }
}

async function getDescendantFolderIds(folderId: number): Promise<number[]> {
  const children = await prisma.hubFolder.findMany({
    where: { parentId: folderId },
    select: { id: true },
  });
  const ids: number[] = [];
  for (const child of children) {
    ids.push(child.id);
    const grandChildren = await getDescendantFolderIds(child.id);
    ids.push(...grandChildren);
  }
  return ids;
}

function serializeFile(f: {
  id: number; folderId: number | null; name: string; key: string;
  size: number; mimeType: string; status: string; tags: string[];
  notes: string | null; isPublic: boolean; publicSlug: string | null;
  createdAt: Date; updatedAt: Date;
}) {
  return {
    id: f.id,
    folderId: f.folderId,
    name: f.name,
    key: f.key,
    size: f.size,
    mimeType: f.mimeType,
    status: f.status,
    tags: f.tags,
    notes: f.notes,
    isPublic: f.isPublic,
    publicSlug: f.publicSlug,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

async function uniqueFilePublicSlug(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const slug = nanoid(10);
    const exists = await prisma.hubFile.findFirst({
      where: { publicSlug: slug },
      select: { id: true },
    });
    if (!exists) return slug;
  }
  return `${nanoid(8)}${Date.now().toString(36)}`;
}

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    if (typeof t !== 'string') continue;
    const clean = t.trim().toLowerCase().replace(/^#+/, '');
    if (!clean) continue;
    if (clean.length > 50) continue;
    if (seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
    if (out.length >= 30) break;
  }
  return out;
}

async function uniquePublicSlug(): Promise<string> {
  // nanoid(10) → ~62^10 = 8.4e17 combinations. Plenty for a personal
  // bookmark manager. We retry on the (extremely unlikely) collision.
  for (let i = 0; i < 5; i++) {
    const slug = nanoid(10);
    const exists = await prisma.hubLink.findFirst({
      where: { publicSlug: slug },
      select: { id: true },
    });
    if (!exists) return slug;
  }
  // Fallback: timestamp-suffixed. Should be unreachable in practice.
  return `${nanoid(8)}${Date.now().toString(36)}`;
}

function pickMeta(html: string, names: string[]): string | null {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `<meta[^>]+(?:property|name)\\s*=\\s*["']${escaped}["'][^>]*content\\s*=\\s*["']([^"']+)["']`,
      'i',
    );
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1].trim());
    // Try the alternative order: content= before property= (rare but valid HTML).
    const re2 = new RegExp(
      `<meta[^>]+content\\s*=\\s*["']([^"']+)["'][^>]+(?:property|name)\\s*=\\s*["']${escaped}["']`,
      'i',
    );
    const m2 = html.match(re2);
    if (m2?.[1]) return decodeHtmlEntities(m2[1].trim());
  }
  return null;
}

function pickTagTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m?.[1]) return null;
  return decodeHtmlEntities(m[1].trim()).slice(0, 500);
}

function pickFavicon(html: string, baseUrl: URL): string | null {
  // Look for <link rel="icon" ...> or rel="shortcut icon"
  const linkRe = /<link[^>]+rel\s*=\s*["'](?:shortcut\s+icon|icon|apple-touch-icon)["'][^>]+href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  let best: string | null = null;
  while ((m = linkRe.exec(html)) !== null) {
    if (!m[1]) continue;
    if (!best) best = m[1];
    // Prefer 32x32+ sizes if specified
    if (/sizes\s*=\s*["'][^"']*\b(?:32|48|64|96|128|192|256)\b/i.test(m.input.slice(Math.max(0, m.index - 200), m.index + 200))) {
      best = m[1];
      break;
    }
  }
  return absolutize(best, baseUrl);
}

function absolutize(maybe: string | null, baseUrl: URL): string | null {
  if (!maybe) return null;
  try {
    return new URL(maybe, baseUrl).toString();
  } catch {
    return null;
  }
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&apos;/g, '\'')
    .replace(/&#(\d+);/g, (_m, code) => {
      const n = Number(code);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : _m;
    });
}

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '::1' || h === '0.0.0.0') return true;
  // IPv4
  const ipv4 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(h);
  if (ipv4) {
    const [, a, b] = ipv4.map(Number) as unknown as [string, number, number, number, number];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
  }
  // IPv6 (very rough)
  if (h.startsWith('fc') || h.startsWith('fd')) return true;
  if (h.startsWith('fe80:')) return true;
  return false;
}

/**
 * Fetch a URL with:
 *  - AbortController-based timeout
 *  - Manual byte cap (we read chunks and abort once we exceed SCRAPE_MAX_BYTES)
 *  - Bounded manual redirect chain (we re-validate the host on each hop)
 */
async function fetchWithCap(
  startUrl: string,
  timeoutMs: number,
  maxBytes: number,
  maxRedirects: number,
): Promise<{ html: string; finalUrl: string }> {
  let currentUrl = startUrl;
  for (let i = 0; i <= maxRedirects; i++) {
    if (isPrivateHost(new URL(currentUrl).hostname)) {
      throw new Error('redirect went to a private host');
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw new Error('redirect without Location');
      const next = new URL(location, currentUrl).toString();
      // Consume body to free the connection before following.
      try { await res.arrayBuffer(); } catch { /* ignore */ }
      currentUrl = next;
      continue;
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (!/text\/html|application\/xhtml/i.test(contentType)) {
      throw new Error('not an HTML page');
    }
    if (!res.body) {
      throw new Error('no response body');
    }

    // Read up to maxBytes, then stop.
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    let truncated = false;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        truncated = true;
        break;
      }
      chunks.push(value);
    }
    try { await reader.cancel(); } catch { /* ignore */ }
    const combined = new Uint8Array(total > maxBytes ? maxBytes : total);
    let offset = 0;
    for (const chunk of chunks) {
      if (offset + chunk.byteLength > combined.byteLength) {
        const slice = chunk.subarray(0, combined.byteLength - offset);
        combined.set(slice, offset);
        offset = combined.byteLength;
        break;
      }
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const html = new TextDecoder('utf-8', { fatal: false }).decode(combined);
    if (truncated) {
      // We still return what we have — the meta tags almost always
      // appear in the first 100KB of an HTML page.
    }
    return { html, finalUrl: currentUrl };
  }
  throw new Error('too many redirects');
}
