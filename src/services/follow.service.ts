/**
 * ============================================================
 * Follow Service — Social Follow Graph
 * ============================================================
 *
 * Responsibilities:
 * - Follow / unfollow a user (toggle)
 * - Get follow status (isFollowing, follower/following counts)
 * - List followers / following of a user
 * - Get enhanced public profile (with follow stats + isFollowing + isOnline)
 * - Update user presence (lastActiveAt)
 */

import { prisma } from '../config/database.js';

/** Online threshold: a user is considered "online" if they were
 * active within this many seconds. Matches Socket.IO ping interval
 * (which pings every ~25s). */
const ONLINE_THRESHOLD_SECONDS = 60;

export interface FollowStatus {
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

export interface PublicProfileEnhanced {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  coverPhotoUrl: string | null;
  bio: string | null;
  roles: string[];
  createdAt: Date;
  isOnline: boolean;
  lastActiveAt: Date | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface FollowerInfo {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  followedAt: Date;
}

export interface FollowingInfo {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  followedAt: Date;
}

// ─── Helpers ────────────────────────────────────────────────

function isOnline(lastActiveAt: Date | null): boolean {
  if (!lastActiveAt) return false;
  return (Date.now() - lastActiveAt.getTime()) / 1000 <= ONLINE_THRESHOLD_SECONDS;
}

// ─── Toggle Follow ──────────────────────────────────────────

export async function toggleFollow(followerId: number, followingId: number): Promise<{ action: 'followed' | 'unfollowed'; isFollowing: boolean }> {
  if (followerId === followingId) {
    throw new Error('Không thể tự theo dõi chính mình');
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { action: 'unfollowed', isFollowing: false };
  }

  await prisma.follow.create({ data: { followerId, followingId } });
  return { action: 'followed', isFollowing: true };
}

// ─── Follow Status ───────────────────────────────────────────

export async function getFollowStatus(viewerId: number, targetId: number): Promise<FollowStatus> {
  const [isFollowingRow, followerCount, followingCount] = await Promise.all([
    prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
    }),
    prisma.follow.count({ where: { followingId: targetId } }),
    prisma.follow.count({ where: { followerId: targetId } }),
  ]);

  return {
    isFollowing: !!isFollowingRow,
    followerCount,
    followingCount,
  };
}

// ─── Enhanced Public Profile ─────────────────────────────────

export async function getEnhancedPublicProfile(targetId: number, viewerId?: number): Promise<PublicProfileEnhanced | null> {
  const user = await prisma.user.findUnique({
    where: { id: targetId },
    include: { roles: { include: { role: true } } },
  });

  if (!user) return null;

  const [followerCount, followingCount, isFollowingRow] = await Promise.all([
    prisma.follow.count({ where: { followingId: targetId } }),
    prisma.follow.count({ where: { followerId: targetId } }),
    viewerId
      ? prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
        })
      : Promise.resolve(null),
  ]);

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    coverPhotoUrl: user.coverPhotoUrl,
    bio: user.bio,
    roles: user.roles.map((ur) => ur.role.name),
    createdAt: user.createdAt,
    isOnline: isOnline(user.lastActiveAt),
    lastActiveAt: user.lastActiveAt,
    followerCount,
    followingCount,
    isFollowing: !!isFollowingRow,
  };
}

// ─── List Followers / Following ────────────────────────────────

export async function getFollowers(
  userId: number,
  cursor?: number,
  limit = 20,
): Promise<{ users: FollowerInfo[]; nextCursor?: number }> {
  const follows = await prisma.follow.findMany({
    where: { followingId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      follower: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, lastActiveAt: true },
      },
    },
  });

  const hasMore = follows.length > limit;
  const items = hasMore ? follows.slice(0, -1) : follows;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;

  return {
    users: items.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      displayName: f.follower.displayName,
      avatarUrl: f.follower.avatarUrl,
      isOnline: isOnline(f.follower.lastActiveAt),
      followedAt: f.createdAt,
    })),
    nextCursor,
  };
}

export async function getFollowing(
  userId: number,
  cursor?: number,
  limit = 20,
): Promise<{ users: FollowingInfo[]; nextCursor?: number }> {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      following: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, lastActiveAt: true },
      },
    },
  });

  const hasMore = follows.length > limit;
  const items = hasMore ? follows.slice(0, -1) : follows;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;

  return {
    users: items.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      displayName: f.following.displayName,
      avatarUrl: f.following.avatarUrl,
      isOnline: isOnline(f.following.lastActiveAt),
      followedAt: f.createdAt,
    })),
    nextCursor,
  };
}

// ─── Update Presence ─────────────────────────────────────────

export async function updatePresence(userId: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });
}

// ─── Update Cover Photo ──────────────────────────────────────

export async function updateCoverPhoto(userId: number, coverPhotoUrl: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { coverPhotoUrl },
  });
}

// ─── Get People Suggestions (who to follow) ─────────────────

export async function getSuggestedUsers(
  userId: number,
  limit = 10,
): Promise<FollowerInfo[]> {
  // Find users who are followed by people you follow (friends-of-friends)
  // but that you haven't followed yet.
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = new Set(following.map((f) => f.followingId));
  followingIds.add(userId); // exclude self

  const friendIds =
    following.length > 0
      ? await prisma.follow.findMany({
          where: { followerId: { in: following.map((f) => f.followingId) } },
          select: { followingId: true },
        })
      : [];

  const candidates = new Set(friendIds.map((f) => f.followingId));
  if (candidates.size < limit) {
    // Fill with random active users
    const randomUsers = await prisma.user.findMany({
      where: {
        enabled: true,
        id: { notIn: Array.from(followingIds) },
      },
      select: { id: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    randomUsers.forEach((u) => candidates.add(u.id));
  }

  const filtered = Array.from(candidates).filter((id) => !followingIds.has(id)).slice(0, limit);

  if (filtered.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: filtered } },
    select: { id: true, username: true, displayName: true, avatarUrl: true, lastActiveAt: true },
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    isOnline: isOnline(u.lastActiveAt),
    followedAt: new Date(),
  }));
}

// ─── Phase 5 home upgrade: mention autocomplete ─────────────────
// Drives the `@cuong` dropdown in the comment composer (and the
// post composer hashtag/mention quick-insert). We match against
// `username` (case-insensitive) OR `displayName` so users typing
// either the handle or the friendly name surface.
//
// We deliberately:
//  • cap at 8 results — the dropdown is small and we don't want
//    to scroll a giant list while typing
//  • require at least 1 character of query — empty returns nothing
//    so the dropdown only appears once the user actually types
//  • exclude the requester (don't suggest yourself in your own
//    @-list)
//  • prefer users the requester already follows (friends first)
//    so the common "tag my friend" path needs zero scrolling
export interface MentionSuggestion {
  id: number;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isFollowing: boolean;
}

export async function searchMentionableUsers(
  viewerId: number,
  query: string,
  limit = 8,
): Promise<MentionSuggestion[]> {
  const q = (query ?? '').trim();
  if (q.length < 1) return [];

  const matches = await prisma.user.findMany({
    where: {
      enabled: true,
      id: { not: viewerId },
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
    take: limit * 4, // overfetch a bit so we can re-rank by following
    orderBy: [{ username: 'asc' }],
  });

  if (matches.length === 0) return [];

  // Cheap follow-status lookup so we can put already-followed users
  // first (the common case is "tag my friend").
  const followingIds = new Set(
    (
      await prisma.follow.findMany({
        where: { followerId: viewerId, followingId: { in: matches.map((m) => m.id) } },
        select: { followingId: true },
      })
    ).map((f) => f.followingId),
  );

  const ranked = matches
    .map((u) => ({ user: u, isFollowing: followingIds.has(u.id) }))
    .sort((a, b) => {
      // Following users first, then by username length (shorter =
      // closer match), then alphabetical.
      if (a.isFollowing !== b.isFollowing) return a.isFollowing ? -1 : 1;
      if (a.user.username.length !== b.user.username.length) {
        return a.user.username.length - b.user.username.length;
      }
      return a.user.username.localeCompare(b.user.username);
    })
    .slice(0, limit);

  return ranked.map(({ user, isFollowing }) => ({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    isFollowing,
  }));
}
