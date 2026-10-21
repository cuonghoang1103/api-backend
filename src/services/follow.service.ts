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
import { getStatus, getStatusMap, getAcceptedFriendIds, type FriendStatus } from './friend.service.js';
import { loadPresenceViewer, presenceFor, visibleOnlineIds, type PresenceViewer } from './presencePrivacy.js';

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
  /** Effective Pro membership (admin OR valid Pro) — drives the avatar PRO badge. */
  isPro: boolean;
  createdAt: Date;
  isOnline: boolean;
  lastActiveAt: Date | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  // Two-way friend relationship between the viewer and this user.
  // 'none' for logged-out viewers. Independent of isFollowing.
  friendStatus: FriendStatus;
  // ─── Extended profile fields (FB-style About) ──────────
  // User-level columns:
  gender: string | null;
  birthYear: number | null;
  phone: string | null;
  socialLinks: Record<string, string> | null;
  // UserProfile-level columns (joined from user_profiles):
  location: string | null;
  websiteUrl: string | null;
  work: string | null;
  education: string | null;
  hometown: string | null;
  jobTitle: string | null;
  workplace: string | null;
  school: string | null;
  college: string | null;
  relationshipStatus: string | null;
  hobbies: string | null;
  languages: string | null;
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

// Trạng thái hoạt động đi qua MỘT luật (presencePrivacy.ts): khách chưa đăng nhập, người tắt công tắc, luật đối
// ứng, chặn, người lạ ⇒ isOnline=false / lastActiveAt=null. Các select dưới đây PHẢI lấy `showActiveStatus`
// (thiếu cờ thì luật coi như tắt — fail-closed, chấm xanh biến mất chứ không rò).
const PRESENCE_FIELDS = { lastActiveAt: true, showActiveStatus: true, kind: true } as const;

function isOnlineFor(
  viewer: PresenceViewer | null,
  u: { id: number; lastActiveAt: Date | null; showActiveStatus?: boolean | null; kind?: string | null },
): boolean {
  return presenceFor(viewer, u).isOnline;
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
    include: { roles: { include: { role: true } }, profile: true },
  });

  if (!user) return null;

  const [followerCount, followingCount, isFollowingRow, friendStatus] = await Promise.all([
    prisma.follow.count({ where: { followingId: targetId } }),
    prisma.follow.count({ where: { followerId: targetId } }),
    viewerId
      ? prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: targetId } },
        })
      : Promise.resolve(null),
    viewerId ? getStatus(viewerId, targetId) : Promise.resolve<FriendStatus>('none'),
  ]);
  const presence = presenceFor(await loadPresenceViewer(viewerId, [targetId]), user);

  const profile = user.profile;
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    coverPhotoUrl: user.coverPhotoUrl,
    bio: user.bio,
    roles: user.roles.map((ur) => ur.role.name),
    isPro:
      user.roles.some((ur) => /^(role_)?(admin|superadmin)$/i.test(ur.role.name)) ||
      (user.isPro && (!user.proExpiresAt || user.proExpiresAt > new Date())),
    createdAt: user.createdAt,
    isOnline: presence.isOnline,
    lastActiveAt: presence.lastActiveAt,
    followerCount,
    followingCount,
    isFollowing: !!isFollowingRow,
    friendStatus,
    // ─── Extended profile (User-level) ──────────────────
    gender: user.gender,
    birthYear: user.birthYear,
    // Phone is PII — only expose it to the profile owner. IDs are sequential,
    // so a public phone here would let an anonymous scraper enumerate every
    // user's number. The frontend already renders it behind a `p.phone &&`
    // guard, so null for other viewers just hides the row.
    phone: viewerId === targetId ? user.phone : null,
    socialLinks: (user.socialLinks as Record<string, string> | null) ?? null,
    // ─── Extended profile (UserProfile-level) ───────────
    location: profile?.location ?? null,
    websiteUrl: profile?.websiteUrl ?? null,
    work: profile?.work ?? null,
    education: profile?.education ?? null,
    hometown: profile?.hometown ?? null,
    jobTitle: profile?.jobTitle ?? null,
    workplace: profile?.workplace ?? null,
    school: profile?.school ?? null,
    college: profile?.college ?? null,
    relationshipStatus: profile?.relationshipStatus ?? null,
    hobbies: profile?.hobbies ?? null,
    languages: profile?.languages ?? null,
  };
}

// ─── List Followers / Following ────────────────────────────────

export async function getFollowers(
  userId: number,
  cursor?: number,
  limit = 20,
  viewerId?: number | null,
): Promise<{ users: FollowerInfo[]; nextCursor?: number }> {
  const follows = await prisma.follow.findMany({
    where: { followingId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      follower: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, ...PRESENCE_FIELDS },
      },
    },
  });

  const hasMore = follows.length > limit;
  const items = hasMore ? follows.slice(0, -1) : follows;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;
  const viewer = await loadPresenceViewer(viewerId, items.map((f) => f.follower.id));

  return {
    users: items.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      displayName: f.follower.displayName,
      avatarUrl: f.follower.avatarUrl,
      isOnline: isOnlineFor(viewer, f.follower),
      followedAt: f.createdAt,
    })),
    nextCursor,
  };
}

export async function getFollowing(
  userId: number,
  cursor?: number,
  limit = 20,
  viewerId?: number | null,
): Promise<{ users: FollowingInfo[]; nextCursor?: number }> {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      following: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, ...PRESENCE_FIELDS },
      },
    },
  });

  const hasMore = follows.length > limit;
  const items = hasMore ? follows.slice(0, -1) : follows;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;
  const viewer = await loadPresenceViewer(viewerId, items.map((f) => f.following.id));

  return {
    users: items.map((f) => ({
      id: f.following.id,
      username: f.following.username,
      displayName: f.following.displayName,
      avatarUrl: f.following.avatarUrl,
      isOnline: isOnlineFor(viewer, f.following),
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

// ─── Get "My Network" (accepted friends ∪ people I follow) ───

/**
 * The union of the viewer's ACCEPTED friends (both directions) and everyone
 * they follow, de-duplicated. This backs the home "Bạn bè" sidebar, which must
 * show only people the user actually has a relationship with — NOT the
 * who-to-follow suggestions (`getSuggestedUsers`), which deliberately surfaces
 * strangers and therefore looked like "all users" on a small site.
 * Online users are returned first, then most-recently-active.
 */
export async function getNetworkUsers(
  userId: number,
  limit = 30,
): Promise<FollowerInfo[]> {
  const [friendIds, following] = await Promise.all([
    getAcceptedFriendIds(userId),
    prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } }),
  ]);
  const ids = new Set<number>([...friendIds, ...following.map((f) => f.followingId)]);
  ids.delete(userId);
  if (ids.size === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] }, enabled: true },
    select: { id: true, username: true, displayName: true, avatarUrl: true, ...PRESENCE_FIELDS },
  });
  const viewer = await loadPresenceViewer(userId, users.map((u) => u.id));
  // Sắp theo trạng thái ĐÃ CHE: sắp theo mốc thật thì thứ tự trong danh sách tự nói ai vừa hoạt động.
  const withPresence = users.map((u) => ({ u, p: presenceFor(viewer, u) }));

  return withPresence
    .sort((a, b) => {
      const onlineDelta = Number(b.p.isOnline) - Number(a.p.isOnline);
      if (onlineDelta !== 0) return onlineDelta;
      const t = (b.p.lastActiveAt?.getTime() ?? 0) - (a.p.lastActiveAt?.getTime() ?? 0);
      return t !== 0 ? t : a.u.username.localeCompare(b.u.username);
    })
    .slice(0, limit)
    .map(({ u, p }) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      isOnline: p.isOnline,
      followedAt: p.lastActiveAt ?? new Date(0),
    }));
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
    select: { id: true, username: true, displayName: true, avatarUrl: true, ...PRESENCE_FIELDS },
  });
  const viewer = await loadPresenceViewer(userId, users.map((u) => u.id));

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    isOnline: isOnlineFor(viewer, u),
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

// ─── People search / discovery (Navbar + /friends page) ─────────
// Richer cousin of searchMentionableUsers: drives the global
// "Search Facebook"-style box and the People page. Unlike the
// mention search (capped at 8, no relationship data) this:
//  • supports a larger limit + cursor pagination
//  • returns isFollowing + friendStatus so each result card can
//    render the right action button (Theo dõi / Kết bạn / Bạn bè)
//  • includes fullName + isOnline for a fuller identity row
//
// An empty query returns "people you may know"-style results
// (recent enabled users excluding self) so the dropdown / page is
// never blank before the user types.
export interface DiscoverUser {
  id: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isOnline: boolean;
  isFollowing: boolean;
  friendStatus: FriendStatus;
}

export async function discoverUsers(
  viewerId: number,
  query: string,
  limit = 12,
  cursor?: number,
): Promise<{ users: DiscoverUser[]; nextCursor?: number }> {
  const q = (query ?? '').trim();
  const take = Math.min(Math.max(limit, 1), 30);

  const where = {
    enabled: true,
    id: { not: viewerId },
    ...(q.length > 0
      ? {
          OR: [
            { username: { contains: q, mode: 'insensitive' as const } },
            { displayName: { contains: q, mode: 'insensitive' as const } },
            { fullName: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const rows = await prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      fullName: true,
      displayName: true,
      avatarUrl: true,
      ...PRESENCE_FIELDS,
    },
    // Cursor pagination keyed on id keeps the order stable across
    // pages. When searching we still order by id desc (newest first)
    // — relevance ranking would need a tsvector index; not worth it
    // for the small result sets here.
    orderBy: { id: 'desc' },
    take: take + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, -1) : rows;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;

  if (items.length === 0) return { users: [], nextCursor: undefined };

  const ids = items.map((u) => u.id);
  const [followingIds, friendStatusMap, viewer] = await Promise.all([
    prisma.follow
      .findMany({
        where: { followerId: viewerId, followingId: { in: ids } },
        select: { followingId: true },
      })
      .then((rows) => new Set(rows.map((r) => r.followingId))),
    getStatusMap(viewerId, ids),
    loadPresenceViewer(viewerId, ids),
  ]);

  const users: DiscoverUser[] = items.map((u) => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    isOnline: isOnlineFor(viewer, u),
    isFollowing: followingIds.has(u.id),
    friendStatus: friendStatusMap.get(u.id) ?? 'none',
  }));

  return { users, nextCursor };
}

// ─── "Đang online" (04/10/2026, siết 21/10/2026) ───────────────
// Nguồn sự thật là tập socket đang nối (`getOnlineUserIds`) — không phải `lastActiveAt`
// (chỉ cập nhật theo nhịp tim, trễ tới 60 giây).
// ⚠️ 21/10/2026: trước đây trả MỌI người đang nối (có bật công tắc) cho BẤT KỲ ai đã đăng
// nhập — người lạ dò được ai đang online. Nay chỉ người có quan hệ (bạn bè, đã nhắn nhau,
// cùng không gian CT Work), trừ chặn, và luật đối ứng (mình tắt ⇒ danh sách rỗng). Luật ở
// `visibleOnlineIds` (presencePrivacy.ts), dùng chung với `GET /messages/online`.
export async function listOnlineUsers(viewerId: number, limit = 100): Promise<DiscoverUser[]> {
  const { getOnlineUserIds } = await import('../socket/messaging.socket.js');
  const ids = await visibleOnlineIds(viewerId, getOnlineUserIds());
  if (ids.length === 0) return [];
  const rows = await prisma.user.findMany({
    where: { id: { in: ids }, enabled: true, showActiveStatus: true },
    select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true },
    orderBy: { lastActiveAt: { sort: 'desc', nulls: 'last' } },
    take: Math.min(Math.max(limit, 1), 200),
  });
  if (rows.length === 0) return [];
  const rowIds = rows.map((u) => u.id);
  const [followingIds, friendStatusMap] = await Promise.all([
    prisma.follow
      .findMany({ where: { followerId: viewerId, followingId: { in: rowIds } }, select: { followingId: true } })
      .then((r) => new Set(r.map((x) => x.followingId))),
    getStatusMap(viewerId, rowIds),
  ]);
  return rows.map((u) => ({
    ...u,
    isOnline: true,
    isFollowing: followingIds.has(u.id),
    friendStatus: friendStatusMap.get(u.id) ?? 'none',
  }));
}
