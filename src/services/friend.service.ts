/**
 * ============================================================
 * Friend Service — Two-way Friend Graph (Facebook-style)
 * ============================================================
 *
 * Independent of the follow graph (see follow.service.ts). A
 * friendship must be confirmed by the addressee. One row per
 * ordered pair; a declined/cancelled invite is deleted.
 *
 * Status values: 'PENDING' | 'ACCEPTED'.
 *
 * Responsibilities:
 * - Send / cancel a friend request
 * - Accept / decline an incoming request
 * - Unfriend
 * - Resolve the relationship status between two users
 * - List friends / incoming / outgoing requests
 * - Count incoming requests (for the badge)
 */

import { prisma } from '../config/database.js';
import { notifyFriendRequest, notifyFriendAccept } from './notification.service.js';

/** Matches follow.service's online window (Socket.IO pings ~25s). */
const ONLINE_THRESHOLD_SECONDS = 60;

function isOnline(lastActiveAt: Date | null): boolean {
  if (!lastActiveAt) return false;
  return (Date.now() - lastActiveAt.getTime()) / 1000 <= ONLINE_THRESHOLD_SECONDS;
}

export type FriendStatus =
  | 'none'
  | 'pending_outgoing'
  | 'pending_incoming'
  | 'friends';

export interface FriendUserInfo {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  /** When the friendship row was created (request time). */
  since: Date;
}

export interface FriendRequestInfo {
  /** Friendship row id — used by the unfriend/respond endpoints. */
  friendshipId: number;
  user: FriendUserInfo;
  createdAt: Date;
}

// ─── Internal: fetch the single row for an unordered pair ──────

async function findPairRow(a: number, b: number) {
  return prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: a, addresseeId: b },
        { requesterId: b, addresseeId: a },
      ],
    },
  });
}

const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  lastActiveAt: true,
} as const;

function mapUser(u: {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  lastActiveAt: Date | null;
}, since: Date): FriendUserInfo {
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    isOnline: isOnline(u.lastActiveAt),
    since,
  };
}

// ─── Send Request ─────────────────────────────────────────────

export interface SendRequestResult {
  status: FriendStatus;
  /** True when the send auto-accepted a mirror PENDING request. */
  autoAccepted: boolean;
}

export async function sendRequest(
  requesterId: number,
  addresseeId: number,
): Promise<SendRequestResult> {
  if (requesterId === addresseeId) {
    throw new Error('Không thể tự kết bạn với chính mình');
  }

  const existing = await findPairRow(requesterId, addresseeId);

  if (existing) {
    if (existing.status === 'ACCEPTED') {
      return { status: 'friends', autoAccepted: false };
    }
    // PENDING already exists.
    if (existing.requesterId === requesterId) {
      // I already sent it — idempotent.
      return { status: 'pending_outgoing', autoAccepted: false };
    }
    // The other person already invited me → accept it (FB behaviour
    // when both sides hit "Add friend").
    await prisma.friendship.update({
      where: { id: existing.id },
      data: { status: 'ACCEPTED', respondedAt: new Date() },
    });
    // Tell the original requester their invite was accepted.
    void notifyFriendAccept(addresseeId, requesterId).catch(() => {});
    return { status: 'friends', autoAccepted: true };
  }

  await prisma.friendship.create({
    data: { requesterId, addresseeId, status: 'PENDING' },
  });
  void notifyFriendRequest(addresseeId, requesterId).catch(() => {});
  return { status: 'pending_outgoing', autoAccepted: false };
}

// ─── Respond (accept / decline) ──────────────────────────────

export interface RespondResult {
  status: FriendStatus;
  /** The other user's id (requester), for notifications. */
  requesterId: number;
}

export async function respond(
  userId: number,
  requesterId: number,
  accept: boolean,
): Promise<RespondResult> {
  const row = await prisma.friendship.findUnique({
    where: { requesterId_addresseeId: { requesterId, addresseeId: userId } },
  });
  if (!row || row.status !== 'PENDING') {
    throw new Error('Không tìm thấy lời mời kết bạn');
  }

  if (accept) {
    await prisma.friendship.update({
      where: { id: row.id },
      data: { status: 'ACCEPTED', respondedAt: new Date() },
    });
    // Notify the original requester that userId accepted.
    void notifyFriendAccept(requesterId, userId).catch(() => {});
    return { status: 'friends', requesterId };
  }

  await prisma.friendship.delete({ where: { id: row.id } });
  return { status: 'none', requesterId };
}

// ─── Cancel an outgoing request ──────────────────────────────

export async function cancelRequest(
  requesterId: number,
  addresseeId: number,
): Promise<void> {
  await prisma.friendship.deleteMany({
    where: { requesterId, addresseeId, status: 'PENDING' },
  });
}

// ─── Unfriend ────────────────────────────────────────────────

export async function unfriend(userId: number, otherId: number): Promise<void> {
  await prisma.friendship.deleteMany({
    where: {
      status: 'ACCEPTED',
      OR: [
        { requesterId: userId, addresseeId: otherId },
        { requesterId: otherId, addresseeId: userId },
      ],
    },
  });
}

// ─── Status between two users ────────────────────────────────

export async function getStatus(
  viewerId: number,
  targetId: number,
): Promise<FriendStatus> {
  if (viewerId === targetId) return 'none';
  const row = await findPairRow(viewerId, targetId);
  if (!row) return 'none';
  if (row.status === 'ACCEPTED') return 'friends';
  return row.requesterId === viewerId ? 'pending_outgoing' : 'pending_incoming';
}

/**
 * Batch variant for list/search endpoints — resolves the friend
 * status of `viewerId` against many targets in one query.
 */
export async function getStatusMap(
  viewerId: number,
  targetIds: number[],
): Promise<Map<number, FriendStatus>> {
  const result = new Map<number, FriendStatus>();
  if (targetIds.length === 0) return result;

  const rows = await prisma.friendship.findMany({
    where: {
      OR: [
        { requesterId: viewerId, addresseeId: { in: targetIds } },
        { addresseeId: viewerId, requesterId: { in: targetIds } },
      ],
    },
  });

  for (const row of rows) {
    const other = row.requesterId === viewerId ? row.addresseeId : row.requesterId;
    if (row.status === 'ACCEPTED') {
      result.set(other, 'friends');
    } else {
      result.set(other, row.requesterId === viewerId ? 'pending_outgoing' : 'pending_incoming');
    }
  }
  return result;
}

/**
 * Return the ids of every user who is an ACCEPTED friend of
 * `userId` (either direction). Used by the access-control
 * predicates that gate FRIENDS-visibility posts/stories — see
 * `buildPostVisibilityWhere` in social.service and the story
 * read paths. Returns [] when the user has no friends.
 */
export async function getAcceptedFriendIds(userId: number): Promise<number[]> {
  const rows = await prisma.friendship.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    select: { requesterId: true, addresseeId: true },
  });
  return rows.map((r) => (r.requesterId === userId ? r.addresseeId : r.requesterId));
}

// ─── List Friends (ACCEPTED, both directions) ────────────────

export async function listFriends(
  userId: number,
  cursor?: number,
  limit = 20,
): Promise<{ users: FriendUserInfo[]; nextCursor?: number }> {
  const rows = await prisma.friendship.findMany({
    where: {
      status: 'ACCEPTED',
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    orderBy: { id: 'desc' },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      requester: { select: userSelect },
      addressee: { select: userSelect },
    },
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, -1) : rows;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;

  const users = items.map((r) => {
    const other = r.requesterId === userId ? r.addressee : r.requester;
    return mapUser(other, r.respondedAt ?? r.createdAt);
  });

  return { users, nextCursor };
}

// ─── Incoming / Outgoing pending requests ────────────────────

export async function listIncoming(
  userId: number,
  limit = 30,
): Promise<FriendRequestInfo[]> {
  const rows = await prisma.friendship.findMany({
    where: { addresseeId: userId, status: 'PENDING' },
    orderBy: { id: 'desc' },
    take: limit,
    include: { requester: { select: userSelect } },
  });
  return rows.map((r) => ({
    friendshipId: r.id,
    user: mapUser(r.requester, r.createdAt),
    createdAt: r.createdAt,
  }));
}

export async function listOutgoing(
  userId: number,
  limit = 30,
): Promise<FriendRequestInfo[]> {
  const rows = await prisma.friendship.findMany({
    where: { requesterId: userId, status: 'PENDING' },
    orderBy: { id: 'desc' },
    take: limit,
    include: { addressee: { select: userSelect } },
  });
  return rows.map((r) => ({
    friendshipId: r.id,
    user: mapUser(r.addressee, r.createdAt),
    createdAt: r.createdAt,
  }));
}

export async function countIncoming(userId: number): Promise<number> {
  return prisma.friendship.count({
    where: { addresseeId: userId, status: 'PENDING' },
  });
}

export async function countFriends(userId: number): Promise<number> {
  return prisma.friendship.count({
    where: {
      status: 'ACCEPTED',
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
  });
}
