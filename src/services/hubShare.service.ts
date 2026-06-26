/**
 * Hub User-Sharing Service (Phase 2)
 * ===================================
 *
 * Lets user A share a folder, link, or file with a specific
 * user B at view-only (+ optional download) granularity. The
 * share is always private (recipient must be authenticated) —
 * for public-by-URL sharing we already have `isPublic` +
 * `publicSlug` on HubLink / HubFile.
 *
 * Three roles per share row:
 *   - ownerId     : the user giving access
 *   - recipientId : the user getting access
 *   - Exactly one of folderId / linkId / fileId is the item.
 *
 * Permissions:
 *   - "view"            : read-only. No downloads for files;
 *                         links can still be clicked (that's the
 *                         whole point of a link share).
 *   - "view_download"   : as above, plus file downloads enabled.
 *
 * Why a separate service file (not just appending to hub.service.ts):
 * hub.service.ts is 1100 lines and growing. Splitting share logic
 * out keeps each file focused. They share the same Prisma client
 * + AppError + folder-ownership helpers — those are exported from
 * `hub.service.ts` and re-imported here to avoid duplication.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  assertFolderOwnership,
  assertLinkOwnership,
  assertFileOwnership,
} from './hub.service.js';
import type { Prisma } from '@prisma/client';

/** Permission values stored in `hub_shares.permission`. */
export const SHARE_PERMISSIONS = ['view', 'view_download'] as const;
export type SharePermission = (typeof SHARE_PERMISSIONS)[number];

function safePermission(p: string): SharePermission {
  return (SHARE_PERMISSIONS as readonly string[]).includes(p)
    ? (p as SharePermission)
    : 'view_download';
}

/**
 * Look up a user by either numeric id, username, or email so the
 * frontend can accept any of those as the "recipient" input.
 * Throws 404 if not found. This is intentionally permissive —
 * usernames are public anyway (they show in @mentions), and
 * emails leak only when the sharee has already given us their
 * email. We do NOT auto-suggest; this is only called when the
 * owner explicitly types a value into the share modal.
 */
async function resolveRecipientId(input: string | number): Promise<number> {
  if (typeof input === 'number' && Number.isInteger(input) && input > 0) {
    const u = await prisma.user.findUnique({ where: { id: input }, select: { id: true } });
    if (!u) throw new AppError('Recipient khong ton tai', 404, 'RECIPIENT_NOT_FOUND');
    return u.id;
  }
  const raw = String(input).trim();
  if (raw.length === 0) {
    throw new AppError('Recipient id/username/email khong duoc trong', 400, 'INVALID_RECIPIENT');
  }
  // Try username first (unique), then email (unique). Most common
  // share flow is by username.
  const byUsername = await prisma.user.findUnique({
    where: { username: raw },
    select: { id: true },
  });
  if (byUsername) return byUsername.id;
  const byEmail = await prisma.user.findUnique({
    where: { email: raw },
    select: { id: true },
  });
  if (byEmail) return byEmail.id;
  throw new AppError('Recipient khong ton tai', 404, 'RECIPIENT_NOT_FOUND');
}

/**
 * Validate that exactly one of folderId / linkId / fileId is set,
 * and that the item belongs to the owner. Returns the item
 * descriptor (one of the three shapes) so the caller can include
 * it in the response payload.
 */
type ShareItem =
  | { kind: 'folder'; folderId: number }
  | { kind: 'link'; linkId: number }
  | { kind: 'file'; fileId: number };

async function resolveAndAssertOwnedItem(
  ownerId: number,
  data: { folderId?: number | null; linkId?: number | null; fileId?: number | null },
): Promise<ShareItem> {
  const set = [
    typeof data.folderId === 'number' ? 'folder' : null,
    typeof data.linkId === 'number' ? 'link' : null,
    typeof data.fileId === 'number' ? 'file' : null,
  ].filter((x): x is 'folder' | 'link' | 'file' => x !== null);
  if (set.length === 0) {
    throw new AppError('Phai chon dung 1 item (folder/HOẶc link HOẶc file)', 400, 'NO_ITEM');
  }
  if (set.length > 1) {
    throw new AppError('Chi duoc share 1 item moi lan', 400, 'MULTIPLE_ITEMS');
  }
  if (set[0] === 'folder') {
    await assertFolderOwnership(ownerId, data.folderId!);
    return { kind: 'folder', folderId: data.folderId! };
  }
  if (set[0] === 'link') {
    await assertLinkOwnership(ownerId, data.linkId!);
    return { kind: 'link', linkId: data.linkId! };
  }
  await assertFileOwnership(ownerId, data.fileId!);
  return { kind: 'file', fileId: data.fileId! };
}

/**
 * Create or update a share. Idempotent on
 * (ownerId, recipientId, folderId|linkId|fileId) — re-sharing the
 * same item to the same user updates the existing row's
 * permission + note instead of inserting a duplicate (the DB
 * unique index backs us up if a race sneaks past).
 */
export async function createShare(
  ownerId: number,
  data: {
    recipientId: string | number;
    folderId?: number | null;
    linkId?: number | null;
    fileId?: number | null;
    permission?: SharePermission;
    note?: string | null;
  },
) {
  // No self-sharing — pointless and clutters the inbox.
  const recipientId = await resolveRecipientId(data.recipientId);
  if (recipientId === ownerId) {
    throw new AppError('Khong the share cho chinh minh', 400, 'SELF_SHARE');
  }
  const item = await resolveAndAssertOwnedItem(ownerId, data);
  const permission = data.permission ? safePermission(data.permission) : 'view_download';
  const note = data.note != null ? String(data.note).trim().slice(0, 500) || null : null;

  // Build the "where" for upsert based on item kind. The unique
  // indexes use (ownerId, recipientId, folderId|linkId|fileId),
  // so we match on that tuple to find the existing row.
  const where: Prisma.HubShareWhereUniqueInput =
    item.kind === 'folder'
      ? { uk_hub_share_owner_recipient_folder: { ownerId, recipientId, folderId: item.folderId } }
      : item.kind === 'link'
        ? { uk_hub_share_owner_recipient_link: { ownerId, recipientId, linkId: item.linkId } }
        : { uk_hub_share_owner_recipient_file: { ownerId, recipientId, fileId: item.fileId } };

  const createData: Prisma.HubShareCreateInput = {
    owner: { connect: { id: ownerId } },
    recipient: { connect: { id: recipientId } },
    permission,
    note,
    ...(item.kind === 'folder' ? { folder: { connect: { id: item.folderId } } } : {}),
    ...(item.kind === 'link' ? { link: { connect: { id: item.linkId } } } : {}),
    ...(item.kind === 'file' ? { file: { connect: { id: item.fileId } } } : {}),
  };

  const updateData: Prisma.HubShareUpdateInput = {
    permission,
    note,
  };

  const share = await prisma.hubShare.upsert({
    where,
    create: createData,
    update: updateData,
    include: SHARE_INCLUDE,
  });
  return share;
}

const SHARE_INCLUDE = {
  owner: {
    select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
  },
  recipient: {
    select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
  },
  folder: { select: { id: true, name: true, icon: true } },
  link: { select: { id: true, url: true, title: true, description: true, thumbnailUrl: true, faviconUrl: true } },
  file: { select: { id: true, name: true, mimeType: true, size: true } },
} satisfies Prisma.HubShareInclude;

/** List shares the authenticated user SENT (outbox). */
export async function listOutboxShares(ownerId: number) {
  return prisma.hubShare.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: SHARE_INCLUDE,
  });
}

/** List shares the authenticated user RECEIVED (inbox). */
export async function listInboxShares(recipientId: number) {
  return prisma.hubShare.findMany({
    where: { recipientId },
    orderBy: { createdAt: 'desc' },
    include: SHARE_INCLUDE,
  });
}

/**
 * Fetch a single share by id — but only if the caller is either
 * the owner OR the recipient. Returns null otherwise (we don't
 * 403 because that would leak the share's existence to a third
 * party; null is indistinguishable from "not found").
 */
export async function getShareForUser(shareId: number, userId: number) {
  return prisma.hubShare.findFirst({
    where: {
      id: shareId,
      OR: [{ ownerId: userId }, { recipientId: userId }],
    },
    include: SHARE_INCLUDE,
  });
}

/**
 * Recipient-side read: load a folder/link/file through the
 * share gate. Returns the underlying item (folder, link, or
 * file) so the frontend can render it the same way as the
 * owner's own view, but with edit/delete buttons hidden (we
 * only enforce read-only at the UI layer for now — the share
 * row's existence is the security guarantee because the only
 * way to get an item id is via `getShareForUser` which checks
 * ownerId OR recipientId).
 */
export async function getSharedItem(shareId: number, recipientId: number) {
  const share = await prisma.hubShare.findFirst({
    where: { id: shareId, recipientId },
    include: SHARE_INCLUDE,
  });
  if (!share) return null;
  // Resolve to the concrete item. We load it with the same
  // shape the owner-side endpoints return so the frontend
  // can reuse HubLinkCard / HubFileCard components.
  if (share.folderId) {
    const folder = await prisma.hubFolder.findFirst({
      where: { id: share.folderId, userId: share.ownerId },
      include: {
        links: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, username: true, displayName: true } } },
        },
        files: { orderBy: { createdAt: 'desc' } },
        _count: { select: { links: true, files: true } },
      },
    });
    return { share, folder };
  }
  if (share.linkId) {
    const link = await prisma.hubLink.findFirst({
      where: { id: share.linkId, userId: share.ownerId },
    });
    return { share, link };
  }
  if (share.fileId) {
    const file = await prisma.hubFile.findFirst({
      where: { id: share.fileId, userId: share.ownerId },
    });
    return { share, file };
  }
  return null;
}

/** Owner-only: delete a share (revoke access). */
export async function deleteShare(ownerId: number, shareId: number) {
  const existing = await prisma.hubShare.findFirst({
    where: { id: shareId, ownerId },
    select: { id: true },
  });
  if (!existing) {
    throw new AppError('Share khong ton tai hoac khong phai cua ban', 404, 'SHARE_NOT_FOUND');
  }
  await prisma.hubShare.delete({ where: { id: shareId } });
  return { id: shareId, deleted: true };
}

/** Owner-only: update the permission + note on an existing share. */
export async function updateShare(
  ownerId: number,
  shareId: number,
  data: { permission?: SharePermission; note?: string | null },
) {
  const existing = await prisma.hubShare.findFirst({
    where: { id: shareId, ownerId },
    select: { id: true },
  });
  if (!existing) {
    throw new AppError('Share khong ton tai hoac khong phai cua ban', 404, 'SHARE_NOT_FOUND');
  }
  const updateData: Prisma.HubShareUpdateInput = {};
  if (data.permission !== undefined) updateData.permission = safePermission(data.permission);
  if (data.note !== undefined) {
    updateData.note = data.note != null ? String(data.note).trim().slice(0, 500) || null : null;
  }
  const updated = await prisma.hubShare.update({
    where: { id: shareId },
    data: updateData,
    include: SHARE_INCLUDE,
  });
  return updated;
}

/**
 * List distinct users who have at least one Hub item shared with
 * the authenticated caller. Used to render the "Users sharing
 * with you" sidebar in the Hub UI. We return the user's public
 * profile fields + the count of shares + the most recent share
 * date so the sidebar can sort "recent sharers" to the top.
 */
export async function listUsersSharingWithMe(recipientId: number) {
  // Group-by in raw SQL would be more efficient, but Prisma
  // doesn't support it cleanly. Two queries is fine at this
  // scale — a power user probably has < 100 shares.
  const shares = await prisma.hubShare.findMany({
    where: { recipientId },
    orderBy: { createdAt: 'desc' },
    select: {
      ownerId: true,
      createdAt: true,
      owner: {
        select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
      },
    },
  });
  const byOwner = new Map<
    number,
    { owner: (typeof shares)[number]['owner']; count: number; latestAt: Date }
  >();
  for (const s of shares) {
    const prev = byOwner.get(s.ownerId);
    if (prev) {
      prev.count += 1;
      if (s.createdAt > prev.latestAt) prev.latestAt = s.createdAt;
    } else {
      byOwner.set(s.ownerId, {
        owner: s.owner,
        count: 1,
        latestAt: s.createdAt,
      });
    }
  }
  // Sort by latest share date desc — most recent sharer first.
  return Array.from(byOwner.values())
    .sort((a, b) => b.latestAt.getTime() - a.latestAt.getTime())
    .map((x) => ({
      user: x.owner,
      shareCount: x.count,
      latestSharedAt: x.latestAt.toISOString(),
    }));
}

/**
 * Search users by username prefix / displayName / fullName for
 * the "share with user" typeahead. We deliberately return at
 * most 10 results and exclude the caller themselves (no point
 * suggesting yourself).
 */
export async function searchUsersForShare(
  callerId: number,
  q: string,
  limit = 10,
) {
  const term = String(q).trim();
  if (term.length === 0) return [];
  const capped = Math.min(Math.max(1, Math.floor(limit)), 20);
  const users = await prisma.user.findMany({
    where: {
      id: { not: callerId },
      OR: [
        { username: { contains: term, mode: 'insensitive' } },
        { displayName: { contains: term, mode: 'insensitive' } },
        { fullName: { contains: term, mode: 'insensitive' } },
      ],
    },
    select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
    orderBy: [{ username: 'asc' }],
    take: capped,
  });
  return users;
}
