/**
 * Sub-pages and wiki backlinks (Phase 6)
 * ======================================
 *
 * A note may nest under another note in the same subject. Nesting changes
 * only presentation — the child keeps its own subjectId, so sharing, trash
 * and search behave exactly as before.
 *
 * References are rebuilt from `[[Tiêu đề]]` markers whenever a page's content
 * is saved, and resolve only against pages the same owner has. Resolving
 * across owners would let anyone discover another user's page titles by
 * typing guesses into their own note.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/** Depth cap. Deep enough for real outlines, shallow enough to stay cheap. */
const MAX_NESTING_DEPTH = 10;
const MAX_REFERENCES_PER_NOTE = 200;

function assertId(value: number, label = 'id') {
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError(`${label} không hợp lệ`, 400, 'INVALID_ID');
  }
}

async function ownedNote(userId: number, noteId: number) {
  assertId(noteId, 'noteId');
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId, deletedAt: null },
    select: { id: true, userId: true, subjectId: true, parentNoteId: true, title: true },
  });
  if (!note) {
    throw new AppError('Ghi chú không tồn tại, đã ở trong thùng rác hoặc không thuộc về bạn', 404, 'NOT_FOUND');
  }
  return note;
}

// ─── Sub-pages ────────────────────────────────────────────────

/**
 * Re-parent a page.
 *
 * Rejects cycles by walking up from the proposed parent: if the walk reaches
 * the note being moved, the move would create a ring that makes the sidebar
 * tree recurse forever and `ancestorsOf` never terminate. Passing null moves
 * the page back to the top level.
 */
export async function setNoteParent(userId: number, noteId: number, parentNoteId: number | null) {
  const note = await ownedNote(userId, noteId);

  if (parentNoteId === null) {
    if (note.parentNoteId === null) return note;
    return prisma.note.update({ where: { id: noteId }, data: { parentNoteId: null } });
  }

  assertId(parentNoteId, 'parentNoteId');
  if (parentNoteId === noteId) {
    throw new AppError('Một trang không thể là trang cha của chính nó', 400, 'SELF_PARENT');
  }
  const parent = await ownedNote(userId, parentNoteId);
  if (parent.subjectId !== note.subjectId) {
    throw new AppError('Trang cha phải nằm trong cùng môn học', 400, 'PARENT_SUBJECT_MISMATCH');
  }

  // Walk up from the proposed parent looking for `noteId`.
  let cursor: number | null = parent.parentNoteId;
  let depth = 1;
  while (cursor !== null) {
    if (cursor === noteId) {
      throw new AppError('Không thể chuyển vào chính trang con của nó', 400, 'PARENT_CYCLE');
    }
    if (++depth > MAX_NESTING_DEPTH) {
      throw new AppError(`Chỉ hỗ trợ lồng tối đa ${MAX_NESTING_DEPTH} cấp`, 400, 'MAX_DEPTH');
    }
    const next: { parentNoteId: number | null } | null = await prisma.note.findUnique({
      where: { id: cursor },
      select: { parentNoteId: true },
    });
    cursor = next?.parentNoteId ?? null;
  }

  const last = await prisma.note.findFirst({
    where: { parentNoteId, deletedAt: null },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  return prisma.note.update({
    where: { id: noteId },
    data: { parentNoteId, sortOrder: (last?.sortOrder ?? -1) + 1 },
  });
}

/** Breadcrumb from the root down to (but excluding) the note itself. */
export async function ancestorsOf(userId: number, noteId: number) {
  const note = await ownedNote(userId, noteId);
  const chain: { id: number; title: string }[] = [];
  let cursor = note.parentNoteId;
  let guard = 0;
  while (cursor !== null && guard++ < MAX_NESTING_DEPTH) {
    const parent: { id: number; title: string; parentNoteId: number | null } | null =
      await prisma.note.findFirst({
        where: { id: cursor, userId },
        select: { id: true, title: true, parentNoteId: true },
      });
    if (!parent) break;
    chain.unshift({ id: parent.id, title: parent.title });
    cursor = parent.parentNoteId;
  }
  return chain;
}

export async function childrenOf(userId: number, noteId: number) {
  await ownedNote(userId, noteId);
  return prisma.note.findMany({
    where: { parentNoteId: noteId, userId, deletedAt: null },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    select: { id: true, title: true, sortOrder: true, updatedAt: true, isPinned: true, isFavorite: true },
  });
}

// ─── Wiki references ──────────────────────────────────────────

/** Collect every `text` leaf out of a ProseMirror/TipTap document. */
function plainTextOf(node: unknown, sink: string[], depth = 0): void {
  if (!node || typeof node !== 'object' || depth > 60) return;
  if (Array.isArray(node)) {
    for (const child of node) plainTextOf(child, sink, depth + 1);
    return;
  }
  const record = node as Record<string, unknown>;
  if (typeof record.text === 'string') sink.push(record.text);
  if (Array.isArray(record.content)) plainTextOf(record.content, sink, depth + 1);
}

/** Every distinct `[[label]]` in the document, in document order. */
export function extractWikiLabels(contentJson: unknown): string[] {
  const parts: string[] = [];
  plainTextOf(contentJson, parts);
  // Join with \n so a link cannot be forged across two separate text nodes.
  const text = parts.join('\n');
  const labels: string[] = [];
  const seen = new Set<string>();
  const pattern = /\[\[([^\[\]\n]{1,300})\]\]/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const label = match[1].trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    labels.push(label);
    if (labels.length >= MAX_REFERENCES_PER_NOTE) break;
  }
  return labels;
}

/**
 * Rebuild `note_references` for one page from its current content.
 *
 * Never throws into the caller: a page must still save when its links cannot
 * be resolved. Backlinks are a derived index, not part of the document.
 */
export async function syncNoteReferences(noteId: number): Promise<number> {
  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, deletedAt: null },
      select: { id: true, userId: true, contentJson: true },
    });
    if (!note) return 0;

    const labels = extractWikiLabels(note.contentJson);
    let targets: { id: number; title: string }[] = [];
    if (labels.length > 0) {
      // Resolve only within this owner's own pages — see the file header.
      const candidates = await prisma.note.findMany({
        where: {
          userId: note.userId,
          deletedAt: null,
          id: { not: noteId },
          title: { in: labels, mode: 'insensitive' },
        },
        select: { id: true, title: true },
      });
      const byTitle = new Map(candidates.map((item) => [item.title.toLowerCase(), item]));
      targets = labels
        .map((label) => {
          const found = byTitle.get(label.toLowerCase());
          return found ? { id: found.id, title: label } : null;
        })
        .filter((item): item is { id: number; title: string } => item !== null);
    }

    await prisma.$transaction(async (tx) => {
      await tx.noteReference.deleteMany({ where: { sourceNoteId: noteId } });
      if (targets.length > 0) {
        await tx.noteReference.createMany({
          data: targets.map((target) => ({
            sourceNoteId: noteId,
            targetNoteId: target.id,
            label: target.title.slice(0, 300),
          })),
          skipDuplicates: true,
        });
      }
    });
    return targets.length;
  } catch {
    return 0;
  }
}

/** Pages that link TO this one. */
export async function backlinksOf(userId: number, noteId: number) {
  await ownedNote(userId, noteId);
  const rows = await prisma.noteReference.findMany({
    where: { targetNoteId: noteId },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      label: true,
      source: {
        select: { id: true, title: true, subjectId: true, updatedAt: true, userId: true, deletedAt: true },
      },
    },
  });
  return rows
    // A source in the trash must not appear as a live backlink.
    .filter((row) => row.source && row.source.userId === userId && row.source.deletedAt === null)
    .map((row) => ({
      label: row.label,
      id: row.source.id,
      title: row.source.title,
      subjectId: row.source.subjectId,
      updatedAt: row.source.updatedAt,
    }));
}

/** Pages this one links OUT to, for the graph view. */
export async function outgoingLinksOf(userId: number, noteId: number) {
  await ownedNote(userId, noteId);
  const rows = await prisma.noteReference.findMany({
    where: { sourceNoteId: noteId },
    select: { label: true, target: { select: { id: true, title: true, subjectId: true, deletedAt: true } } },
  });
  return rows
    .filter((row) => row.target && row.target.deletedAt === null)
    .map((row) => ({
      label: row.label,
      id: row.target.id,
      title: row.target.title,
      subjectId: row.target.subjectId,
    }));
}

/** Whole-graph edges for the current user, for a knowledge-graph view. */
export async function referenceGraph(userId: number) {
  const notes = await prisma.note.findMany({
    where: { userId, deletedAt: null },
    select: { id: true, title: true, subjectId: true },
    take: 2000,
  });
  const ids = new Set(notes.map((note) => note.id));
  const edges = await prisma.noteReference.findMany({
    where: { sourceNoteId: { in: [...ids] } },
    select: { sourceNoteId: true, targetNoteId: true },
    take: 5000,
  });
  return {
    nodes: notes,
    edges: edges.filter((edge) => ids.has(edge.targetNoteId)),
  };
}
