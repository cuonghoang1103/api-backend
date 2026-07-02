/**
 * Notes Subject Sharing Service (Phase 4)
 * ======================================
 *
 * Lets user A share a NoteSubject (folder) with user B at
 * view or edit granularity. Shares are private — the recipient
 * must be authenticated and have an active share record.
 *
 * Permission levels:
 *   - "view" : read-only access to the subject + all chapters + notes
 *   - "edit"  : can create/edit/delete notes within the shared subject
 *
 * Two models:
 *   - NoteSubjectShare     : owner-side (who has access, permission level)
 *   - NoteSubjectShareRecipient : recipient-side (inbox for shared folders)
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { notifyNoteShare } from './notification.service.js';

/** Permission values stored in `note_subject_shares.permission`. */
export const NOTE_SHARE_PERMISSIONS = ['view', 'edit'] as const;
export type NoteSharePermission = (typeof NOTE_SHARE_PERMISSIONS)[number];

function safePermission(p: string): NoteSharePermission {
  return (NOTE_SHARE_PERMISSIONS as readonly string[]).includes(p)
    ? (p as NoteSharePermission)
    : 'view';
}

// ─── Resolve recipient ──────────────────────────────────────────

/**
 * Look up a user by username or email.
 * Throws 404 if not found.
 */
async function resolveRecipientId(input: string | number): Promise<number> {
  if (typeof input === 'number' && Number.isInteger(input) && input > 0) {
    const u = await prisma.user.findUnique({ where: { id: input }, select: { id: true } });
    if (!u) throw new AppError('Recipient not found', 404, 'RECIPIENT_NOT_FOUND');
    return u.id;
  }
  const raw = String(input).trim();
  if (raw.length === 0) {
    throw new AppError('Recipient cannot be empty', 400, 'INVALID_RECIPIENT');
  }
  // Try username first
  const byUsername = await prisma.user.findUnique({
    where: { username: raw },
    select: { id: true },
  });
  if (byUsername) return byUsername.id;
  // Try email
  const byEmail = await prisma.user.findUnique({
    where: { email: raw },
    select: { id: true },
  });
  if (byEmail) return byEmail.id;
  throw new AppError('Recipient not found', 404, 'RECIPIENT_NOT_FOUND');
}

// ─── Assert ownership ──────────────────────────────────────────

/**
 * Verify that the subject belongs to ownerId.
 * Throws 403 if not.
 */
async function assertSubjectOwnership(ownerId: number, subjectId: number): Promise<void> {
  const subject = await prisma.noteSubject.findUnique({
    where: { id: subjectId },
    select: { id: true, userId: true },
  });
  if (!subject) {
    throw new AppError('Subject not found', 404, 'SUBJECT_NOT_FOUND');
  }
  if (subject.userId !== ownerId) {
    throw new AppError('You do not own this subject', 403, 'NOT_OWNER');
  }
}

// ─── Share a subject ──────────────────────────────────────────

export interface CreateNoteShareInput {
  subjectId: number;
  recipientId: number;
  permission?: NoteSharePermission;
  note?: string | null;
}

export async function createNoteShare(
  ownerId: number,
  input: CreateNoteShareInput,
) {
  // Verify ownership
  await assertSubjectOwnership(ownerId, input.subjectId);

  // Resolve recipient
  const resolvedRecipientId = await resolveRecipientId(input.recipientId);

  // Can't share with yourself
  if (resolvedRecipientId === ownerId) {
    throw new AppError('Cannot share with yourself', 400, 'SELF_SHARE');
  }

  // Check if already shared
  const existing = await prisma.noteSubjectShare.findUnique({
    where: {
      uk_note_subject_share: {
        subjectId: input.subjectId,
        recipientId: resolvedRecipientId,
      },
    },
  });
  if (existing) {
    throw new AppError('Already shared with this user', 409, 'ALREADY_SHARED');
  }

  // Create share
  const share = await prisma.noteSubjectShare.create({
    data: {
      subjectId: input.subjectId,
      ownerId,
      recipientId: resolvedRecipientId,
      permission: safePermission(input.permission ?? 'view'),
      note: input.note ?? null,
    },
    include: {
      subject: {
        select: { id: true, name: true, emoji: true, color: true },
      },
      recipient: {
        select: { id: true, username: true, email: true, avatarUrl: true, displayName: true },
      },
      owner: {
        select: { id: true, username: true, avatarUrl: true, displayName: true },
      },
    },
  });

  // Send notification to recipient
  await notifyNoteShare(
    resolvedRecipientId,
    ownerId,
    share.subject.id,
    share.subject.name,
    share.subject.emoji,
    share.permission,
  );

  return share;
}

// ─── Delete/revoke a share ────────────────────────────────────

export async function deleteNoteShare(ownerId: number, shareId: number) {
  const share = await prisma.noteSubjectShare.findUnique({
    where: { id: shareId },
    select: { id: true, ownerId: true, subjectId: true, recipientId: true },
  });
  if (!share) {
    throw new AppError('Share not found', 404, 'SHARE_NOT_FOUND');
  }
  // Only owner can revoke
  if (share.ownerId !== ownerId) {
    throw new AppError('You do not own this share', 403, 'NOT_OWNER');
  }

  await prisma.$transaction([
    prisma.noteSubjectShareRecipient.deleteMany({
      where: { shareId },
    }),
    prisma.noteSubjectShare.delete({
      where: { id: shareId },
    }),
  ]);

  return { id: shareId, deleted: true };
}

// ─── List shares for a subject (owner view) ────────────────────

export async function listSubjectShares(ownerId: number, subjectId: number) {
  // Verify ownership
  await assertSubjectOwnership(ownerId, subjectId);

  return prisma.noteSubjectShare.findMany({
    where: { subjectId },
    orderBy: { createdAt: 'desc' },
    include: {
      recipient: {
        select: { id: true, username: true, email: true, avatarUrl: true, displayName: true },
      },
    },
  });
}

// ─── List all shares I own ─────────────────────────────────────

export async function listMyNoteShares(ownerId: number) {
  return prisma.noteSubjectShare.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: {
      subject: {
        select: { id: true, name: true, emoji: true, color: true },
      },
      recipient: {
        select: { id: true, username: true, email: true, avatarUrl: true, displayName: true },
      },
    },
  });
}

// ─── List shared with me ──────────────────────────────────────

export async function listSharedWithMe(recipientId: number) {
  return prisma.noteSubjectShare.findMany({
    where: { recipientId },
    orderBy: { createdAt: 'desc' },
    include: {
      subject: {
        include: {
          chapters: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, title: true },
          },
          notes: {
            where: { isArchived: false },
            orderBy: { sortOrder: 'asc' },
            select: { id: true, title: true, updatedAt: true },
          },
        },
      },
      owner: {
        select: { id: true, username: true, avatarUrl: true, displayName: true },
      },
    },
  });
}

// ─── Check if I have access to a subject ──────────────────────

export async function checkNoteAccess(userId: number, subjectId: number): Promise<{
  hasAccess: boolean;
  permission: NoteSharePermission | null;
  isOwner: boolean;
}> {
  // Check if owner
  const subject = await prisma.noteSubject.findUnique({
    where: { id: subjectId },
    select: { userId: true },
  });
  if (!subject) {
    throw new AppError('Subject not found', 404, 'SUBJECT_NOT_FOUND');
  }
  if (subject.userId === userId) {
    return { hasAccess: true, permission: 'edit', isOwner: true };
  }

  // Check for active share
  const share = await prisma.noteSubjectShare.findUnique({
    where: {
      uk_note_subject_share: { subjectId, recipientId: userId },
    },
  });
  if (!share) {
    return { hasAccess: false, permission: null, isOwner: false };
  }
  return {
    hasAccess: true,
    permission: share.permission as NoteSharePermission,
    isOwner: false,
  };
}

// ─── Update share permission ───────────────────────────────────

export async function updateNoteShare(
  ownerId: number,
  shareId: number,
  data: { permission?: NoteSharePermission; note?: string | null },
) {
  const share = await prisma.noteSubjectShare.findUnique({
    where: { id: shareId },
    select: { id: true, ownerId: true },
  });
  if (!share) {
    throw new AppError('Share not found', 404, 'SHARE_NOT_FOUND');
  }
  if (share.ownerId !== ownerId) {
    throw new AppError('You do not own this share', 403, 'NOT_OWNER');
  }

  return prisma.noteSubjectShare.update({
    where: { id: shareId },
    data: {
      permission: data.permission ? safePermission(data.permission) : undefined,
      note: data.note !== undefined ? data.note : undefined,
    },
    include: {
      subject: {
        select: { id: true, name: true, emoji: true, color: true },
      },
      recipient: {
        select: { id: true, username: true, email: true, avatarUrl: true, displayName: true },
      },
    },
  });
}

// ─── Search users to share with ────────────────────────────────

export async function searchUsersToShare(
  currentUserId: number,
  query: string,
  limit = 8,
) {
  if (query.trim().length === 0) return [];

  return prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } },
        {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
            { fullName: { contains: query, mode: 'insensitive' } },
          ],
        },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      displayName: true,
      fullName: true,
    },
    take: limit,
  });
}
