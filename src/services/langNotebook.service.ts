/**
 * My Language — per-user Language Notebook.
 *
 * Nested folders (self-referential parentId) + entries, scoped per user AND
 * per language. Every operation derives userId from the session and verifies
 * ownership — the client never chooses whose notebook it touches.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';

const ENTRY_KINDS = new Set(['note', 'explanation', 'vocab', 'grammar', 'pronunciation', 'writing']);

function cleanStr(v: unknown, label: string, max: number, required = true): string {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) {
    if (required) throw new BadRequestError(`Thiếu ${label}.`);
    return '';
  }
  return s.slice(0, max);
}
function optStr(v: unknown, max = 10000): string | null {
  const s = typeof v === 'string' ? v.trim() : '';
  return s ? s.slice(0, max) : null;
}

async function langByCode(code: string): Promise<{ id: number; code: string; name: string; flagEmoji: string }> {
  const lang = await prisma.language.findUnique({ where: { code: String(code || '').trim() }, select: { id: true, code: true, name: true, flagEmoji: true } });
  if (!lang) throw new NotFoundError('Không tìm thấy ngôn ngữ.');
  return lang;
}

async function ownFolder(userId: number, id: number) {
  const f = await prisma.langNotebookFolder.findUnique({ where: { id } });
  if (!f) throw new NotFoundError('Không tìm thấy thư mục.');
  if (f.userId !== userId) throw new ForbiddenError('Không có quyền với thư mục này.');
  return f;
}
async function ownEntry(userId: number, id: number) {
  const e = await prisma.langNotebookEntry.findUnique({ where: { id } });
  if (!e) throw new NotFoundError('Không tìm thấy mục.');
  if (e.userId !== userId) throw new ForbiddenError('Không có quyền với mục này.');
  return e;
}

// ── Read ──────────────────────────────────────────────────────────
export async function getTree(userId: number, code: string) {
  const language = await langByCode(code);
  const [folders, entries] = await Promise.all([
    prisma.langNotebookFolder.findMany({
      where: { userId, languageId: language.id },
      select: { id: true, parentId: true, name: true, icon: true, sortOrder: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    }),
    prisma.langNotebookEntry.findMany({
      where: { userId, languageId: language.id },
      select: { id: true, folderId: true, kind: true, title: true, reading: true, updatedAt: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    }),
  ]);
  return { language, folders, entries };
}

export async function getEntry(userId: number, id: number) {
  return ownEntry(userId, id);
}

/** Languages the user has notebook content in (+ counts), for the picker. */
export async function listLanguages(userId: number) {
  const langs = await prisma.language.findMany({ where: { isActive: true }, select: { id: true, code: true, name: true, flagEmoji: true }, orderBy: { order: 'asc' } });
  const counts = await prisma.langNotebookEntry.groupBy({ by: ['languageId'], where: { userId }, _count: { _all: true } });
  const byId = new Map(counts.map((c) => [c.languageId, c._count._all]));
  return langs.map((l) => ({ ...l, entryCount: byId.get(l.id) ?? 0 }));
}

// ── Folders ───────────────────────────────────────────────────────
export async function createFolder(userId: number, body: { code?: string; name?: unknown; icon?: unknown; parentId?: unknown }) {
  const language = await langByCode(String(body?.code ?? ''));
  const name = cleanStr(body?.name, 'tên thư mục', 120);
  const parentId = body?.parentId != null ? Number(body.parentId) : null;
  if (parentId != null) {
    const parent = await ownFolder(userId, parentId);
    if (parent.languageId !== language.id) throw new BadRequestError('Thư mục cha khác ngôn ngữ.');
  }
  const count = await prisma.langNotebookFolder.count({ where: { userId, languageId: language.id, parentId } });
  return prisma.langNotebookFolder.create({
    data: { userId, languageId: language.id, parentId, name, icon: optStr(body?.icon, 64), sortOrder: count },
  });
}

export async function renameFolder(userId: number, id: number, body: { name?: unknown; icon?: unknown }) {
  await ownFolder(userId, id);
  const data: { name?: string; icon?: string | null } = {};
  if (body?.name !== undefined) data.name = cleanStr(body.name, 'tên thư mục', 120);
  if (body?.icon !== undefined) data.icon = optStr(body.icon, 64);
  return prisma.langNotebookFolder.update({ where: { id }, data });
}

export async function deleteFolder(userId: number, id: number) {
  await ownFolder(userId, id);
  // Cascade removes descendant folders (FK); entries under them get folderId=null (SetNull).
  await prisma.langNotebookFolder.delete({ where: { id } });
  return { id };
}

export async function moveFolder(userId: number, id: number, body: { parentId?: unknown }) {
  const folder = await ownFolder(userId, id);
  const parentId = body?.parentId != null ? Number(body.parentId) : null;
  if (parentId === id) throw new BadRequestError('Không thể đặt thư mục vào chính nó.');
  if (parentId != null) {
    const parent = await ownFolder(userId, parentId);
    if (parent.languageId !== folder.languageId) throw new BadRequestError('Thư mục cha khác ngôn ngữ.');
    // Reject cycles: walk up from the new parent; hitting `id` means it's a descendant.
    let cur: number | null = parent.parentId;
    let guard = 0;
    while (cur != null && guard++ < 100) {
      if (cur === id) throw new BadRequestError('Không thể di chuyển vào thư mục con của nó.');
      const up = await prisma.langNotebookFolder.findUnique({ where: { id: cur }, select: { parentId: true } });
      cur = up?.parentId ?? null;
    }
  }
  return prisma.langNotebookFolder.update({ where: { id }, data: { parentId } });
}

// ── Entries ───────────────────────────────────────────────────────
function entryData(body: { folderId?: unknown; kind?: unknown; title?: unknown; body?: unknown; reading?: unknown; meaning?: unknown }) {
  const kind = typeof body?.kind === 'string' && ENTRY_KINDS.has(body.kind) ? body.kind : 'note';
  return {
    kind,
    title: cleanStr(body?.title, 'tiêu đề', 255),
    body: cleanStr(body?.body, 'nội dung', 20000),
    reading: optStr(body?.reading, 255),
    meaning: optStr(body?.meaning, 5000),
  };
}

async function resolveFolder(userId: number, languageId: number, folderId: number | null): Promise<number | null> {
  if (folderId == null) return null;
  const folder = await ownFolder(userId, folderId);
  if (folder.languageId !== languageId) throw new BadRequestError('Thư mục khác ngôn ngữ.');
  return folder.id;
}

export async function createEntry(userId: number, body: { code?: string; folderId?: unknown; kind?: unknown; title?: unknown; body?: unknown; reading?: unknown; meaning?: unknown }) {
  const language = await langByCode(String(body?.code ?? ''));
  const folderId = await resolveFolder(userId, language.id, body?.folderId != null ? Number(body.folderId) : null);
  const count = await prisma.langNotebookEntry.count({ where: { userId, languageId: language.id, folderId } });
  return prisma.langNotebookEntry.create({ data: { userId, languageId: language.id, folderId, sortOrder: count, ...entryData(body) } });
}

export async function updateEntry(userId: number, id: number, body: { title?: unknown; body?: unknown; reading?: unknown; meaning?: unknown; kind?: unknown }) {
  await ownEntry(userId, id);
  const data: Record<string, unknown> = {};
  if (body?.title !== undefined) data.title = cleanStr(body.title, 'tiêu đề', 255);
  if (body?.body !== undefined) data.body = cleanStr(body.body, 'nội dung', 20000);
  if (body?.reading !== undefined) data.reading = optStr(body.reading, 255);
  if (body?.meaning !== undefined) data.meaning = optStr(body.meaning, 5000);
  if (typeof body?.kind === 'string' && ENTRY_KINDS.has(body.kind)) data.kind = body.kind;
  return prisma.langNotebookEntry.update({ where: { id }, data });
}

export async function deleteEntry(userId: number, id: number) {
  await ownEntry(userId, id);
  await prisma.langNotebookEntry.delete({ where: { id } });
  return { id };
}

export async function moveEntry(userId: number, id: number, body: { folderId?: unknown }) {
  const entry = await ownEntry(userId, id);
  const folderId = await resolveFolder(userId, entry.languageId, body?.folderId != null ? Number(body.folderId) : null);
  return prisma.langNotebookEntry.update({ where: { id }, data: { folderId } });
}

/** Quick-save from an AI feature (the "Lưu vào sổ tay" button). */
export async function saveFromAi(userId: number, body: { code?: string; folderId?: unknown; kind?: unknown; title?: unknown; body?: unknown; reading?: unknown; meaning?: unknown }) {
  const entry = await createEntry(userId, body);
  return { id: entry.id, languageId: entry.languageId };
}
