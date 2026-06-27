/**
 * ============================================================
 * Social Feed Service — Personal Social Network
 * ============================================================
 *
 * Handles all business logic for the social feed module:
 * - Create, read, update, delete posts
 * - Like/unlike posts and comments
 * - Comment and reply threads
 * - Save/unsave posts to folders
 * - Share tracking
 * - Feed pagination with cursor-based navigation
 * - Rich query with author, media, like/comment counts
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { registerSocketEmitter } from '../socket/messaging.socket.js';

/**
 * Returns true if the user has the ADMIN role. Used by delete
 * endpoints so admins can remove any post/comment on the feed.
 * We cache the check per-request via a Map because the same
 * userId can call multiple admin-gated deletes in one request.
 */
const adminCheckCache = new Map<number, boolean>();
async function isUserAdmin(userId: number): Promise<boolean> {
  if (adminCheckCache.has(userId)) return adminCheckCache.get(userId)!;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  });
  if (!user) {
    adminCheckCache.set(userId, false);
    return false;
  }
  const isAdmin = user.roles.some((ur) => {
    const name = ur.role.name.toUpperCase();
    return name === 'ADMIN' || name === 'ROLE_ADMIN' || name === 'SUPER_ADMIN' || name === 'ROLE_SUPER_ADMIN';
  });
  adminCheckCache.set(userId, isAdmin);
  return isAdmin;
}

/** Reset the per-request admin cache. Call this from tests. */
export function _clearAdminCache() {
  adminCheckCache.clear();
}

// ─── Types ─────────────────────────────────────────────────────────

export interface CreatePostInput {
  authorId: number;
  content: string;
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  latitude?: number;
  longitude?: number;
  locationName?: string;
  // Optional YouTube URL. The frontend uses this when the user
  // pastes a YouTube link into the composer instead of uploading a
  // video file. Validation lives in the service layer (light check
  // — we accept any URL the renderer can later embed).
  youtubeUrl?: string;
  // Content-type bucket for the feed tabs. When omitted, the service
  // derives it from the attached media / youtubeUrl (see
  // deriveSocialPostType) so older API clients keep working.
  type?: 'POST' | 'VIDEO' | 'FILE';
  media?: Array<{
    type: string;
    url: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: bigint;
    mimeType?: string;
    fileName?: string;
    alt?: string;
    sortOrder?: number;
  }>;
  // Phase 2 — optional poll attached to the post.
  poll?: {
    question: string;
    options: string[];
    multiChoice?: boolean;
    closesAt?: Date;
  };
  // Phase 3 add — Instagram-style music sticker. When set, the
  // PostCard renders a small overlay on the first media tile and
  // a tap on the sticker opens a mini-player. musicStartSec lets
  // the user pick where in the track the sticker should start
  // playing (we don't yet play the snippet on the feed; that's a
  // future TODO — for now we just persist the offset).
  musicTrackId?: number;
  musicStartSec?: number;
}

export interface FeedOptions {
  cursor?: number;
  limit?: number;
  authorId?: number;
  visibility?: string;
  /** Filter feed to posts whose content contains this hashtag (case-insensitive). */
  hashtag?: string;
  // Phase 5 home upgrade: feed filter tabs.
  // • sort: 'recent' (default) or 'popular' (last 7 days, top by
  //   likes + comments + saves so the "Popular" tab feels alive
  //   without exposing spam-prone ranking signals).
  // • following: when true, restrict to posts whose authorId is
  //   in the viewer's following set. Requires `currentUserId`.
  sort?: 'recent' | 'popular';
  following?: boolean;
  // Content-type tab filter (home feed). When set, restrict the feed
  // to posts of this bucket; omitted/undefined = "Tất cả" (all types).
  type?: 'POST' | 'VIDEO' | 'FILE';
}

/**
 * Derive a post's content-type bucket from its media + youtubeUrl.
 * Mirrors the SQL backfill in the add_social_post_type migration so a
 * post created without an explicit `type` lands in the same tab whether
 * it's classified at write time (here) or by the migration.
 *   VIDEO: any VIDEO media or a YouTube link.
 *   FILE:  no video, but has FILE / CODE_FILE media.
 *   POST:  everything else (text, images, polls).
 */
export function deriveSocialPostType(
  media: Array<{ type: string }> | undefined,
  youtubeUrl?: string | null,
): 'POST' | 'VIDEO' | 'FILE' {
  const list = media ?? [];
  if (youtubeUrl || list.some((m) => m.type === 'VIDEO')) return 'VIDEO';
  if (list.some((m) => m.type === 'FILE' || m.type === 'CODE_FILE')) return 'FILE';
  return 'POST';
}

export interface CommentInput {
  userId: number;
  postId: number;
  parentId?: number;
  content: string;
  // Optional @mention list. Either Int[] or string[] of numeric
  // ids; coerced in the service. Stored verbatim on the comment
  // so the notification job can fan out without re-parsing the
  // text body.
  mentions?: Array<number | string>;
}

// ─── Post CRUD ────────────────────────────────────────────────────

export async function createPost(input: CreatePostInput) {
  const { media, poll, ...postData } = input;

  // Validate poll first so we don't half-create a post with
  // an invalid poll attached.
  let pollCreateData: any = undefined;
  if (poll) {
    const q = poll.question?.trim();
    if (!q) throw new AppError('Poll question is required', 400, 'POLL_QUESTION_REQUIRED');
    if (q.length > 500) throw new AppError('Poll question is too long', 400, 'POLL_QUESTION_TOO_LONG');
    if (!Array.isArray(poll.options) || poll.options.length < 2 || poll.options.length > 10) {
      throw new AppError('A poll must have between 2 and 10 options', 400, 'POLL_OPTIONS_RANGE');
    }
    const cleaned = poll.options.map((o) => (o ?? '').toString().trim()).filter(Boolean);
    if (cleaned.length !== poll.options.length) {
      throw new AppError('Poll options cannot be blank', 400, 'POLL_OPTIONS_BLANK');
    }
    if (cleaned.some((o) => o.length > 255)) {
      throw new AppError('Each poll option must be 255 characters or less', 400, 'POLL_OPTION_TOO_LONG');
    }
    pollCreateData = {
      create: {
        question: q,
        multiChoice: !!poll.multiChoice,
        closesAt: poll.closesAt || undefined,
        options: {
          create: cleaned.map((text, sortOrder) => ({ text, sortOrder })),
        },
      },
    };
  }

  // Resolve the content-type bucket: trust an explicit choice from the
  // composer, otherwise derive from the attached media / youtubeUrl.
  const resolvedType = postData.type ?? deriveSocialPostType(media, postData.youtubeUrl);

  const post = await prisma.socialPost.create({
    data: {
      ...postData,
      type: resolvedType,
      // Phase 3 — music sticker. We pass these top-level (not
      // through `...postData`) because the destructure above
      // already stripped them out into `input` directly. Both
      // are optional; Prisma skips them when undefined.
      ...(input.musicTrackId != null
        ? {
            musicTrackId: input.musicTrackId,
            musicStartSec: input.musicStartSec ?? null,
          }
        : {}),
      media: media ? {
        createMany: {
          data: media.map((m: any, idx: number) => ({
            type: m.type,
            url: m.url,
            thumbnail: m.thumbnail,
            width: m.width,
            height: m.height,
            duration: m.duration,
            fileSize: m.fileSize ? BigInt(m.fileSize) : undefined,
            mimeType: m.mimeType,
            fileName: m.fileName,
            alt: m.alt,
            sortOrder: m.sortOrder ?? idx,
          })),
        },
      } : undefined,
      poll: pollCreateData,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
      musicTrack: { select: { id: true, title: true, artist: true, audioUrl: true, coverImage: true, durationSeconds: true } },
      poll: {
        include: { options: { orderBy: { sortOrder: 'asc' as const } } },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          saves: true,
        },
      },
    },
  });

  // Run the same shape the feed uses so the freshly created post
  // matches what PostCard / PostPoll expect. Without this the card
  // crashes because `isLiked` / `poll.userVotes` / `likesCount` are
  // missing on the response — only the feed enriches them.
  const freshUserVotes = post.poll
    ? (await prisma.socialPollVote.findMany({
        where: { pollId: post.poll.id, userId: input.authorId },
        select: { optionId: true },
      })).map((v) => v.optionId)
    : [];

  // Phase 5 home upgrade: ping every follower so the feed banner
  // can show "X bài viết mới" without polling. We only ping
  // PUBLIC + FRIENDS posts; PRIVATE never triggers a banner.
  // The actual feed fetch is still on the client (cursor fetch) —
  // we just emit a tiny ping here.
  if (post.visibility !== 'PRIVATE') {
    pingFollowersAboutNewPost(post.authorId, post.id);
  }

  return serializePost(post, {
    currentUserId: input.authorId,
    pollUserVotes: freshUserVotes,
  });
}

// ─── Phase 5 home upgrade: socket ping for "X bài viết mới" ─────
// Fire-and-forget so the createPost response stays fast. We
// intentionally do NOT await — the user is already seeing the
// new post in their composer-out / optimistic-insert path; this
// ping is only for *other* viewers' feeds.
function pingFollowersAboutNewPost(authorId: number, _postId: number): void {
  // Fetch the followers list in the background and emit a ping.
  // We don't surface errors — socket unreachability is non-fatal.
  setImmediate(async () => {
    try {
      const emitter = registerSocketEmitter();
      if (!emitter) return; // socket not ready yet, skip
      const followers = await prisma.follow.findMany({
        where: { followingId: authorId },
        select: { followerId: true },
      });
      // We send a single "new posts available" count rather than
      // the post itself — the client calls /posts?cursor= to pick
      // up new ones so the socket payload stays tiny.
      for (const f of followers) {
        emitter.emit('feed:has-new', { viewerId: f.followerId, count: 1 });
      }
    } catch {
      // Swallow — logging here would just spam logs when socket
      // is offline. Next REST poll will pick up the new post.
    }
  });
}

export async function getPostById(postId: number, currentUserId?: number) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      media: {
        orderBy: { sortOrder: 'asc' as const },
      },
      musicTrack: { select: { id: true, title: true, artist: true, audioUrl: true, coverImage: true, durationSeconds: true } },
      poll: {
        include: { options: { orderBy: { sortOrder: 'asc' as const } } },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          saves: true,
        },
      },
      likes: currentUserId ? {
        where: { userId: currentUserId },
        select: { id: true, userId: true },
      } : false,
      saves: currentUserId ? {
        where: { userId: currentUserId },
        select: { id: true, userId: true, folder: true },
      } : false,
    },
  });

  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  // Augment poll with the viewer's vote(s) so the UI can show the
  // selected state immediately. Skip for anonymous viewers.
  const pollUserVotes = post.poll && currentUserId
    ? (await prisma.socialPollVote.findMany({
        where: { pollId: post.poll.id, userId: currentUserId },
        select: { optionId: true },
      })).map((v) => v.optionId)
    : [];

  // ─── Reaction breakdown (groupBy SocialLike.type) ─────────────
  // SocialLike.type stores the reaction type (LIKE / LOVE / HAHA /
  // SAD / ANGRY). The groupBy gives per-type counts so PostCard
  // can render the emoji stack without an extra round-trip.
  const grouped = await prisma.socialLike.groupBy({
    by: ['type'],
    where: { postId: post.id },
    _count: { type: true },
  });
  const reactionBreakdown: Record<ReactionType, number> = {
    LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0,
  };
  for (const row of grouped as Array<{ type: string; _count: { type: number } }>) {
    if (row.type in reactionBreakdown) {
      reactionBreakdown[row.type as ReactionType] = row._count.type;
    }
  }
  // myReactionType: read the current user's reaction row from
  // SocialLike. The LIKE button stores 'LIKE'; the emoji picker
  // stores LOVE / HAHA / SAD / ANGRY in the same column.
  const myReactionType = currentUserId
    ? (post.likes as Array<{ type: string }> | undefined)?.[0]?.type ?? null
    : null;

  return serializePost(post, {
    currentUserId,
    pollUserVotes,
    reactionBreakdown,
    myReactionType,
  });
}

export async function deletePost(postId: number, userId: number) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  // Allow post author OR any user with the ADMIN role to delete.
  // This implements the requirement "admin có quyền cao nhất trong n,
  // có thể xoá bài viết của bất kì user hay tài khoản nào".
  if (post.authorId !== userId && !(await isUserAdmin(userId))) {
    throw new AppError('Unauthorized', 403, 'FORBIDDEN');
  }

  await prisma.socialPost.delete({ where: { id: postId } });
  return { message: 'Post deleted' };
}

export async function updatePost(postId: number, userId: number, data: {
  content?: string;
  visibility?: string;
}) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
  if (post.authorId !== userId) throw new AppError('Unauthorized', 403, 'FORBIDDEN');

  const updated = await prisma.socialPost.update({
    where: { id: postId },
    data,
    include: {
      author: {
        select: { id: true, username: true, fullName: true, avatarUrl: true },
      },
      media: { orderBy: { sortOrder: 'asc' } },
      musicTrack: { select: { id: true, title: true, artist: true, audioUrl: true, coverImage: true, durationSeconds: true } },
      _count: { select: { likes: true, comments: true, saves: true } },
    },
  });

  return {
    ...updated,
    likesCount: updated._count.likes,
    commentsCount: updated._count.comments,
    savesCount: updated._count.saves,
  };
}

// ─── Feed ────────────────────────────────────────────────────────

export async function getFeed(options: FeedOptions & { currentUserId?: number }) {
  const { cursor, limit = 20, authorId, visibility, currentUserId, hashtag, sort = 'recent', following, type } = options;

  // Phase 5 home upgrade: "Following" tab. Only return posts from
  // authors the viewer follows. Anonymous viewers (no currentUserId)
  // fall back to the public recent feed.
  let followingAuthorIds: number[] | undefined;
  if (following && currentUserId) {
    const edges = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    followingAuthorIds = edges.map((e) => e.followingId);
    // No follows yet → empty feed rather than "show everyone".
    if (followingAuthorIds.length === 0) {
      return { items: [], nextCursor: null, hasMore: false, sort };
    }
  }

  const posts = await prisma.socialPost.findMany({
    where: {
      visibility: visibility as 'PUBLIC' | 'FRIENDS' | 'PRIVATE' | undefined,
      ...(authorId ? { authorId } : {}),
      ...(followingAuthorIds ? { authorId: { in: followingAuthorIds } } : {}),
      ...(cursor ? { id: { lt: cursor } } : {}),
      // Hashtag filter: ILIKE '%#tag%' — uses the GIN trigram index on
      // social_posts.content (created at startup if pg_trgm is available).
      ...(hashtag ? { content: { contains: `#${hashtag}`, mode: 'insensitive' as const } } : {}),
      // Content-type tab filter (Bài viết / Video / File). Omitted = all.
      ...(type ? { type } : {}),
      // "Popular" tab: scope to last 7 days so the ranking doesn't
      // freeze on all-time favourites. We sort by composite score
      // below (likes*2 + comments + saves).
      ...(sort === 'popular' ? { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } : {}),
    },
    // For popular we want a weighted ranking, not pure createdAt;
    // we still use id < cursor as a stable cursor for pagination.
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      media: {
        orderBy: { sortOrder: 'asc' as const },
        select: {
          id: true,
          type: true,
          url: true,
          thumbnail: true,
          width: true,
          height: true,
          duration: true,
          mimeType: true,
          // fileName + fileSize power the File tab's download rows.
          // Additive to the select; existing readers ignore them.
          fileName: true,
          fileSize: true,
          alt: true,
          sortOrder: true,
        },
      },
      poll: {
        include: { options: { orderBy: { sortOrder: 'asc' as const } } },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          saves: true,
        },
      },
      likes: currentUserId ? {
        where: { userId: currentUserId },
        select: { id: true, type: true },
      } : false,
      saves: currentUserId ? {
        where: { userId: currentUserId },
        select: { id: true, folder: true },
      } : false,
    },
  });

  const hasNextPage = posts.length > limit;
  let items = hasNextPage ? posts.slice(0, limit) : posts;

  // Phase 5 home upgrade: for the "Popular" tab we re-rank by a
  // composite engagement score (likes*2 + comments + saves) so the
  // feed shows what's trending, not just what's newest. The DB
  // still scans by createdAt (with a 7-day cutoff), and we re-rank
  // in memory — fine for limit<=50.
  if (sort === 'popular') {
    items = [...items].sort((a: any, b: any) => {
      const scoreA = a._count.likes * 2 + a._count.comments + a._count.saves;
      const scoreB = b._count.likes * 2 + b._count.comments + b._count.saves;
      if (scoreB !== scoreA) return scoreB - scoreA;
      // Tiebreaker: newer wins.
      return b.id - a.id;
    });
  }

  const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

  // Bulk-load the viewer's poll votes for the visible polls to avoid
  // an N+1 query. The PostCard needs userVotes to highlight the
  // selected state in the bars.
  const pollIds = items.map((p: any) => p.poll?.id).filter((x: any) => Boolean(x));
  const pollVotesByPollId = currentUserId
    ? await loadPollVotes(pollIds, currentUserId)
    : {};

  // Per-post reaction breakdown + viewer's own reaction type. We
  // do a single groupBy across the visible post ids so the
  // PostCard can render the emoji stack without N extra queries.
  const postIds = items.map((p: any) => p.id);
  const reactionGrouped = postIds.length > 0
    ? await prisma.socialLike.groupBy({
        by: ['postId', 'type'],
        where: { postId: { in: postIds } },
        _count: { type: true },
      })
    : [];
  const breakdownByPost = new Map<number, Record<ReactionType, number>>();
  for (const row of reactionGrouped as Array<{ postId: number; type: string; _count: { type: number } }>) {
    let cur = breakdownByPost.get(row.postId);
    if (!cur) {
      cur = { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 };
      breakdownByPost.set(row.postId, cur);
    }
    if (row.type in cur) {
      cur[row.type as ReactionType] = row._count.type;
    }
  }

  return {
    data: items.map((post: any) => serializePost(post, {
      currentUserId,
      pollUserVotes: pollVotesByPollId[post.poll?.id] || [],
      reactionBreakdown: breakdownByPost.get(post.id) ?? { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 },
      // SocialLike.type stores the reaction type (LIKE / LOVE / HAHA /
      // SAD / ANGRY). Both the legacy LIKE button and the new emoji
      // picker write to this column so this single read covers both.
      myReactionType:
        (post.likes as Array<{ type: string }> | undefined)?.[0]?.type ?? null,
    })),
    pagination: {
      nextCursor,
      hasNextPage,
      limit,
    },
  };
}

/**
 * Per-content-type counts for the home feed tabs (Tất cả / Bài viết /
 * Video / File). Mirrors the default feed scope so each tab's badge
 * matches what it will actually show. One cheap GROUP BY; the frontend
 * fetches it once per visit (and after composing a post).
 */
export async function getFeedCounts(options: { visibility?: string } = {}) {
  const where = {
    ...(options.visibility ? { visibility: options.visibility } : {}),
  };
  const grouped = await prisma.socialPost.groupBy({
    by: ['type'],
    where,
    _count: { _all: true },
  });
  const counts = { all: 0, post: 0, video: 0, file: 0 };
  for (const g of grouped as Array<{ type: string; _count: { _all: number } }>) {
    const n = g._count._all;
    counts.all += n;
    if (g.type === 'VIDEO') counts.video += n;
    else if (g.type === 'FILE') counts.file += n;
    else counts.post += n;
  }
  return counts;
}

/**
 * Bulk-loads the viewer's poll votes for a list of poll ids. Used by
 * both the feed and the single-post page so the renderer can highlight
 * the options the viewer voted for.
 */
async function loadPollVotes(
  pollIds: (number | undefined | null)[],
  currentUserId: number,
): Promise<Record<number, number[]>> {
  const filtered = pollIds.filter((x): x is number => typeof x === 'number' && !Number.isNaN(x));
  if (filtered.length === 0) return {};
  const userVotes = await prisma.socialPollVote.findMany({
    where: { pollId: { in: filtered }, userId: currentUserId },
    select: { pollId: true, optionId: true },
  });
  return userVotes.reduce((acc, v) => {
    (acc[v.pollId] ||= []).push(v.optionId);
    return acc;
  }, {} as Record<number, number[]>);
}

/**
 * Shape a Prisma post + viewer-scoped data into the wire format the
 * frontend expects. Centralised so createPost, getFeed, getPostById
 * and any other reader all return the same shape — otherwise a
 * freshly-created post (with no likes/saves yet) would crash the
 * PostCard because `likesCount` / `isLiked` / `poll.userVotes` are
 * missing.
 */
export function serializePost(
  post: any,
  opts: {
    currentUserId?: number;
    pollUserVotes?: number[];
    // Reaction breakdown + viewer's own reaction type (added 2026-06-20).
    // These are optional so legacy callers (createPost) keep working
    // — the resulting post just won't carry the new fields. PostCard
    // falls back to a default when the fields are missing.
    reactionBreakdown?: Record<ReactionType, number>;
    myReactionType?: string | null;
  } = {},
) {
  const { currentUserId, pollUserVotes, reactionBreakdown, myReactionType } = opts;
  return {
    id: post.id,
    content: post.content,
    visibility: post.visibility,
    latitude: post.latitude ?? null,
    longitude: post.longitude ?? null,
    locationName: post.locationName ?? null,
    // `youtubeUrl` may not be selected by every query — fall back to
    // null so the renderer can defensively check.
    youtubeUrl: post.youtubeUrl ?? null,
    // Phase 3 add — Instagram-style music sticker. When the
    // include selected `musicTrack`, we pass it through; when
    // not, we still expose the raw musicTrackId so the client
    // can fetch the track separately if it needs to render the
    // sticker (it falls back to looking up by id).
    musicTrackId: post.musicTrackId ?? null,
    musicStartSec: post.musicStartSec ?? null,
    musicTrack: post.musicTrack ?? null,
    // Content-type bucket for the feed tabs / per-type badge. Falls back
    // to POST for any row/query that didn't select it.
    type: post.type ?? 'POST',
    viewCount: post.viewCount ?? 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    // `fileSize` on SocialMedia is a Prisma BigInt; JSON.stringify
    // throws "Do not know how to serialize a BigInt" when we try
    // to ship it across the wire. Convert to a regular number
    // (the cap is 500MB for video which fits safely in a JS
    // double). `fileName` is included so the post card can show
    // the original filename on the download row.
    media: (post.media ?? []).map((m: any) => ({
      ...m,
      fileSize:
        typeof m.fileSize === 'bigint' ? Number(m.fileSize) : m.fileSize ?? null,
    })),
    poll: post.poll
      ? {
          ...post.poll,
          userVotes:
            pollUserVotes ??
            (currentUserId ? [] : []),
        }
      : null,
    likesCount: post._count?.likes ?? 0,
    commentsCount: post._count?.comments ?? 0,
    savesCount: post._count?.saves ?? 0,
    isLiked: currentUserId ? (post.likes as unknown[] | undefined)?.length ?? 0 > 0 : false,
    isSaved: currentUserId ? (post.saves as unknown[] | undefined)?.length ?? 0 > 0 : false,
    // ─── Reaction fields (added 2026-06-20) ────────────────────
    // The user's current reaction type (or null if they haven't
    // reacted). PostCard reads this to highlight the right emoji.
    myReaction: myReactionType ?? null,
    // Per-type counts. Empty default so the PostCard can always
    // call `breakdown.LIKE` without a null check.
    reactionBreakdown: reactionBreakdown ?? { LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0 },
    savedFolder:
      currentUserId && Array.isArray(post.saves) && (post.saves as unknown[]).length > 0
        ? (post.saves[0] as { folder?: string }).folder ?? null
        : null,
  };
}

// ─── Like / Unlike / React ────────────────────────────────────────

// Allow-list of reaction types the API accepts. Anything else is
// rejected with 400. We keep this as a runtime constant (not a
// Prisma enum) so we can add new emojis in the future without a
// schema migration — the column is a plain VARCHAR(16).
export const REACTION_TYPES = ['LIKE', 'LOVE', 'HAHA', 'SAD', 'ANGRY'] as const;
export type ReactionType = (typeof REACTION_TYPES)[number];

/** Reject anything that isn't in the allow-list. */
function normaliseReactionType(raw: unknown): ReactionType {
  if (typeof raw !== 'string') return 'LIKE';
  const upper = raw.toUpperCase();
  return (REACTION_TYPES as readonly string[]).includes(upper)
    ? (upper as ReactionType)
    : 'LIKE';
}

export async function likePost(postId: number, userId: number) {
  // Legacy endpoint — kept as a thin wrapper around reactPost()
  // so the original /social/posts/:id/like route continues to
  // work unchanged. Internally we just write a 'LIKE' reaction.
  return reactPost(postId, userId, 'LIKE');
}

export async function unlikePost(postId: number, userId: number) {
  // Clear ALL reaction types the user has on this post (legacy
  // behaviour: unlike = remove any reaction). We don't filter by
  // type so a user who reacted with 'LOVE' and then hits the
  // legacy unlike endpoint still gets cleared.
  await prisma.socialLike.deleteMany({
    where: { postId, userId },
  });

  const count = await prisma.socialLike.count({ where: { postId } });
  return { liked: false, likesCount: count };
}

/**
 * New multi-emoji reaction endpoint.
 *
 * Semantics (spec'd by the user):
 *   - First time the user reacts with type T on a post: insert a
 *     row. The post is now "reacted to" with T.
 *   - The user clicks the SAME emoji again: remove the row (toggle
 *     off). The post is no longer reacted to with T.
 *   - The user clicks a DIFFERENT emoji while already having T:
 *     remove T, insert the new one (swap reaction). The
 *     @@unique([postId, userId, type]) constraint makes this safe.
 *
 * Always returns a small payload that lets the PostCard update
 * its UI without an extra round-trip:
 *   { reacted: bool, type, likesCount, myReactions: [{ type, count }] }
 */
export async function reactPost(
  postId: number,
  userId: number,
  rawType: unknown,
) {
  const type = normaliseReactionType(rawType);

  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  const existing = await prisma.socialLike.findFirst({
    where: { postId, userId, type },
    select: { id: true },
  });

  if (existing) {
    // Same type clicked twice → unreact
    await prisma.socialLike.delete({ where: { id: existing.id } });
  } else {
    // If the user has a DIFFERENT reaction on this post, drop it
    // so the (post, user) pair has at most one reaction row.
    // This matches Facebook's "swap reaction" UX.
    await prisma.socialLike.deleteMany({ where: { postId, userId } });
    await prisma.socialLike.create({
      data: { postId, userId, type },
    });
  }

  // Recompute counts. We return a per-type breakdown so the
  // PostCard can render the emoji stack ("👍 12  ❤️ 3  😆 1").
  const [total, grouped] = await Promise.all([
    prisma.socialLike.count({ where: { postId } }),
    prisma.socialLike.groupBy({
      by: ['type'],
      where: { postId },
      _count: { type: true },
    }),
  ]);

  const breakdown: Record<ReactionType, number> = {
    LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0,
  };
  for (const row of grouped as Array<{ type: string; _count: { type: number } }>) {
    if (row.type in breakdown) {
      breakdown[row.type as ReactionType] = row._count.type;
    }
  }

  // Look up the user's CURRENT reaction (might be null if they
  // just unreacted). The PostCard reads this to know which emoji
  // to highlight.
  const mine = await prisma.socialLike.findFirst({
    where: { postId, userId },
    select: { type: true },
  });

  // Real-time fan-out: anyone who has this post in their feed
  // (and is currently connected) should see the new counts
  // without a page refresh. We emit a per-post event so it
  // doesn't leak to other posts. The frontend `usePostReactionsSocket`
  // listener picks it up and patches the matching PostCard in
  // place via the existing `updatePostReactions` store action.
  //
  // Note: the reactor's own card already shows the optimistic
  // update so the server-side broadcast is mostly for *other*
  // viewers — but emitting to everyone is safe and the
  // receiver-side `myReaction` field is null in the payload,
  // so the reactor's card doesn't double-update.
  const emitter = registerSocketEmitter();
  emitter?.emit('post:reacted' as any, {
    postId,
    likesCount: total,
    breakdown,
    actorId: userId,
  });

  return {
    reacted: !!mine,
    myType: (mine?.type as ReactionType | undefined) ?? null,
    likesCount: total,
    breakdown,
  };
}

/**
 * Returns the per-type breakdown for a post (used by the feed
 * service to enrich the wire payload so PostCard can render the
 * emoji stack without an extra round-trip).
 */
export async function getReactionBreakdown(postId: number) {
  const grouped = await prisma.socialLike.groupBy({
    by: ['type'],
    where: { postId },
    _count: { type: true },
  });
  const breakdown: Record<ReactionType, number> = {
    LIKE: 0, LOVE: 0, HAHA: 0, SAD: 0, ANGRY: 0,
  };
  for (const row of grouped as Array<{ type: string; _count: { type: number } }>) {
    if (row.type in breakdown) {
      breakdown[row.type as ReactionType] = row._count.type;
    }
  }
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  return { total, breakdown };
}

export async function likeComment(commentId: number, userId: number) {
  const existing = await (prisma.socialCommentLike as any).findUnique({
    where: { commentId, userId },
  });

  if (existing) {
    await (prisma.socialCommentLike as any).delete({
      where: { commentId, userId },
    });
    const count = await prisma.socialCommentLike.count({ where: { commentId } });
    await prisma.socialComment.update({
      where: { id: commentId },
      data: { likesCount: count },
    });
    return { liked: false };
  }

  await prisma.socialCommentLike.create({
    data: { commentId, userId },
  });

  const count = await prisma.socialCommentLike.count({ where: { commentId } });
  await prisma.socialComment.update({
    where: { id: commentId },
    data: { likesCount: count },
  });
  return { liked: true };
}

// ─── Comments ────────────────────────────────────────────────────

export async function createComment(input: CommentInput) {
  const post = await prisma.socialPost.findUnique({
    where: { id: input.postId },
    select: { id: true, authorId: true },
  });
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  // Optional parent comment for replies. We validate it belongs
  // to the same post so a reply can't be cross-attached.
  let resolvedParentId: number | null = null;
  let parentDepth = -1;
  let parentRootId: number | null = null;
  if (input.parentId != null) {
    const parent = await prisma.socialComment.findUnique({
      where: { id: input.parentId },
      select: { id: true, postId: true, depth: true, rootId: true },
    });
    if (!parent) {
      throw new AppError('Parent comment not found', 404, 'PARENT_COMMENT_NOT_FOUND');
    }
    if (parent.postId !== input.postId) {
      throw new AppError('Parent comment does not belong to this post', 400, 'PARENT_COMMENT_MISMATCH');
    }
    // Phase 5 home upgrade: enforce maxDepth=2. A reply to a
    // depth-1 comment (i.e. reply-to-reply) is rejected so the
    // thread stays at 2 visible levels (top-level + one reply).
    // Frontend also hides the reply button at depth>=1, so this
    // is the server-side safety net.
    if (parent.depth >= 1) {
      throw new AppError(
        'Đã đạt giới hạn 2 cấp trả lời. Hãy trả lời trực tiếp bình luận gốc.',
        400,
        'MAX_COMMENT_DEPTH',
      );
    }
    resolvedParentId = parent.id;
    parentDepth = parent.depth;
    parentRootId = parent.rootId ?? parent.id;
  }

  // Phase 5 home upgrade: depth + rootId.
  // • depth: 0 for top-level, 1 for first-level reply.
  // • rootId: pointer to the top-level comment so the UI can load
  //   the whole thread in one query (parent + all its replies).
  const computedDepth = parentDepth + 1; // 0 → reply is 1
  const computedRootId = parentRootId; // null for top-level, parent's root for reply

  // Optional @mentions. We accept either a number[] (preferred) or
  // a string[] that we'll attempt to coerce. De-dupe and drop
  // mentions of the commenter themselves (no point notifying
  // yourself).
  const rawMentions = (input as any).mentions;
  const cleanedMentions: number[] = Array.isArray(rawMentions)
    ? Array.from(new Set(
        rawMentions
          .map((m: unknown) => (typeof m === 'number' ? m : parseInt(String(m), 10)))
          .filter((n: number) => Number.isFinite(n) && n > 0 && n !== input.userId),
      ))
    : [];

  const comment = await prisma.socialComment.create({
    data: {
      postId: input.postId,
      userId: input.userId,
      parentId: resolvedParentId,
      depth: computedDepth,
      rootId: computedRootId,
      content: input.content,
      mentions: cleanedMentions,
    },
    include: {
      user: {
        select: { id: true, username: true, fullName: true, avatarUrl: true },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  // Bump the parent's `repliesCount` so the UI can show "View N
  // replies" without a count query. We only do this for replies
  // (parentId set); top-level comments don't have a parent to
  // bump.
  if (resolvedParentId != null) {
    await prisma.socialComment.update({
      where: { id: resolvedParentId },
      data: { repliesCount: { increment: 1 } },
    });
  }

  return {
    ...comment,
    likesCount: comment._count.likes,
    isLiked: false,
    repliesCount: comment.repliesCount,
    parentId: resolvedParentId,
    mentions: cleanedMentions,
  };
}

export async function getComments(postId: number, options: { cursor?: number; limit?: number } = {}) {
  const { cursor, limit = 20 } = options;

  // Cursor-based pagination. The frontend (`socialStore.ts:514`)
  // uses a "load more" pattern: store `nextCursor` from the response
  // and pass it back as `?cursor=<id>`. The list is sorted `id ASC`
  // (oldest first, since `id` is monotonically increasing with
  // insertion order) and the UI renders the same order top-to-bottom.
  // "Xem thêm bình luận" therefore expects *older* comments on
  // subsequent pages — that means smaller id, which we reach via
  // at `items[items.length-1].id` (newest in the page) — skip: 1
  // then ORDER BY id ASC walks forward to the next page. The
  // previous `items[0]?.id` was wrong: with ASC order it would
  // re-fetch the same page. Mirror pattern in
  // `src/routes/notifications.routes.ts:71` which uses the analogous
  // end-of-page id under DESC order.
  const comments = await prisma.socialComment.findMany({
    where: { postId, parentId: null },
    orderBy: { id: 'asc' },
    take: limit + 1,
  ...(cursor != null ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      user: {
        select: { id: true, username: true, fullName: true, avatarUrl: true },
      },
      _count: { select: { likes: true } },
      replies: {
        orderBy: { createdAt: 'asc' as const },
        include: {
          user: {
            select: { id: true, username: true, fullName: true, avatarUrl: true },
          },
          _count: { select: { likes: true } },
          likes: { select: { userId: true } },
        },
      },
      likes: { select: { userId: true } },
    },
  });

  const hasNextPage = comments.length > limit;
  const items = hasNextPage ? comments.slice(0, limit) : comments;
  const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

  const enriched = items.map((c: any) => ({
    id: c.id,
    postId: c.postId,
    content: c.content,
    // @mention ids — the PostCard reads this to render
    // `<a>@username</a>` inside the comment body.
    mentions: Array.isArray(c.mentions) ? c.mentions : [],
    likesCount: c._count?.likes ?? 0,
    repliesCount: c.repliesCount,
    // Phase 5 home upgrade: when the stored repliesCount exceeds
    // what we eagerly fetched (we capped at REPLIES_FETCH_LIMIT
    // below), signal the client so it can render "Xem thêm N
    // phản hồi" and lazy-load the rest on click.
    repliesShown: c.replies.length,
    hasMoreReplies: c.repliesCount > c.replies.length,
    isEdited: c.isEdited,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    user: c.user,
    isLiked: (c.likes as any[]).some((l: any) => l.userId !== undefined),
    replies: c.replies.map((r: any) => ({
      id: r.id,
      postId: r.postId,
      parentId: r.parentId,
      depth: r.depth ?? 1,
      content: r.content,
      mentions: Array.isArray(r.mentions) ? r.mentions : [],
      likesCount: r._count?.likes ?? 0,
      repliesCount: r.repliesCount,
      isEdited: r.isEdited,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: r.user,
      isLiked: (r.likes as any[]).some((l: any) => l.userId !== undefined),
    })),
  }));

  return { data: enriched, pagination: { nextCursor, hasNextPage, limit } };
}

// ─── Phase 5 home upgrade: lazy-load replies for a comment thread ─
// When a thread has more than REPLIES_FETCH_LIMIT replies, the
// PostCard shows "Xem thêm N phản hồi" and calls this endpoint
// on click. We always fetch only depth=1 children of `rootId`
// (Phase 5 enforces maxDepth=2 so no deeper nesting is possible).
//
// Cursor is the id of the last reply already shown; we return
// replies with `id > cursor` in ASC order so the client can
// append to the existing list.
export async function getCommentReplies(
  rootId: number,
  _currentUserId: number | undefined,
  options: { cursor?: number; limit?: number } = {},
) {
  const { cursor, limit = 10 } = options;

  // Verify the root comment exists (so 404 surfaces clearly
  // rather than returning an empty list).
  const root = await prisma.socialComment.findUnique({
    where: { id: rootId },
    select: { id: true, postId: true, depth: true },
  });
  if (!root) throw new AppError('Root comment not found', 404, 'COMMENT_NOT_FOUND');

  const replies = await prisma.socialComment.findMany({
    where: {
      rootId,
      ...(cursor != null ? { id: { gt: cursor } } : {}),
    },
    orderBy: { id: 'asc' },
    take: limit + 1,
    include: {
      user: {
        select: { id: true, username: true, fullName: true, avatarUrl: true },
      },
      _count: { select: { likes: true } },
      likes: { select: { userId: true } },
    },
  });

  const hasNextPage = replies.length > limit;
  const items = hasNextPage ? replies.slice(0, limit) : replies;
  const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

  const data = items.map((r: any) => ({
    id: r.id,
    postId: r.postId,
    parentId: r.parentId,
    depth: r.depth ?? 1,
    content: r.content,
    mentions: Array.isArray(r.mentions) ? r.mentions : [],
    likesCount: r._count?.likes ?? 0,
    repliesCount: r.repliesCount,
    isEdited: r.isEdited,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: r.user,
    isLiked: (r.likes as any[]).some((l: any) => l.userId !== undefined),
  }));

  return { data, pagination: { nextCursor, hasNextPage, limit } };
}

export async function deleteComment(commentId: number, userId: number) {
  const comment = await prisma.socialComment.findUnique({
    where: { id: commentId },
    select: { userId: true, parentId: true, postId: true },
  });

  if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');

  // Allow comment author OR any admin to delete.
  if (comment.userId !== userId && !(await isUserAdmin(userId))) {
    throw new AppError('Unauthorized', 403, 'FORBIDDEN');
  }

  await prisma.socialComment.delete({ where: { id: commentId } });

  if (comment.parentId) {
    await prisma.socialComment.update({
      where: { id: comment.parentId },
      data: { repliesCount: { decrement: 1 } },
    });
  }

  return { message: 'Comment deleted' };
}

export async function updateComment(commentId: number, userId: number, content: string) {
  const comment = await prisma.socialComment.findUnique({
    where: { id: commentId },
    select: { userId: true },
  });

  if (!comment) throw new AppError('Comment not found', 404, 'COMMENT_NOT_FOUND');
  if (comment.userId !== userId) throw new AppError('Unauthorized', 403, 'FORBIDDEN');

  const updated = await prisma.socialComment.update({
    where: { id: commentId },
    data: { content, isEdited: true },
    include: {
      user: {
        select: { id: true, username: true, fullName: true, avatarUrl: true },
      },
      _count: { select: { likes: true } },
    },
  });

  return {
    ...updated,
    likesCount: updated._count.likes,
  };
}

// ─── Save / Unsave ───────────────────────────────────────────────

export async function savePost(postId: number, userId: number, folder?: string) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  const existing = await prisma.socialSave.findFirst({
    where: { postId, userId },
  });

  if (existing) {
    await prisma.socialSave.updateMany({
      where: { postId, userId },
      data: { folder },
    });
    return { saved: true, folder };
  }

  await prisma.socialSave.create({
    data: { postId, userId, folder },
  });

  return { saved: true, folder };
}

export async function unsavePost(postId: number, userId: number) {
  await prisma.socialSave.deleteMany({
    where: { postId, userId },
  });
  return { saved: false };
}

export async function getSavedPosts(userId: number, folder?: string, cursor?: number, limit = 20) {
  const saves = await prisma.socialSave.findMany({
    where: {
      userId,
      ...(folder ? { folder } : {}),
      ...(cursor ? { id: { lt: cursor } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    include: {
      post: {
        include: {
          author: {
            select: { id: true, username: true, fullName: true, avatarUrl: true },
          },
          media: {
            orderBy: { sortOrder: 'asc' as const },
            select: {
              id: true, type: true, url: true, thumbnail: true,
              width: true, height: true, duration: true, sortOrder: true,
            },
          },
          _count: { select: { likes: true, comments: true, saves: true } },
          likes: { where: { userId }, select: { id: true } },
        },
      },
    },
  });

  const hasNextPage = saves.length > limit;
  const items = hasNextPage ? saves.slice(0, limit) : saves;
  const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

  const enriched = items.map((s: any) => ({
    savedId: s.id,
    folder: s.folder,
    savedAt: s.createdAt,
    post: {
      ...s.post,
      likesCount: s.post._count?.likes ?? 0,
      commentsCount: s.post._count?.comments ?? 0,
      savesCount: s.post._count?.saves ?? 0,
      isLiked: (s.post.likes ?? []).length > 0,
      isSaved: true,
      likes: undefined,
      _count: undefined,
    },
  }));

  return { data: enriched, pagination: { nextCursor, hasNextPage, limit } };
}

export async function getSaveFolders(userId: number) {
  const saves = await prisma.socialSave.groupBy({
    by: ['folder'],
    where: { userId, folder: { not: null } },
    _count: { folder: true },
    orderBy: { _count: { folder: 'desc' } },
  });

  const total = await prisma.socialSave.count({ where: { userId } });
  const uncategorized = await prisma.socialSave.count({
    where: { userId, folder: null },
  });

  return {
    folders: saves.map((s: any) => ({
      name: s.folder,
      count: s._count?.folder ?? 0,
    })),
    total,
    uncategorized,
  };
}

// ─── Share ──────────────────────────────────────────────────────

export async function sharePost(postId: number, userId: number, platform?: string) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  await prisma.socialShare.create({
    data: { postId, userId, platform },
  });

  return { shared: true };
}

// ════════════════════════════════════════════════════════════════
// Polls (Phase 2)
// ════════════════════════════════════════════════════════════════

/**
 * Cast a vote on a poll. Replaces any previous vote if not
 * multi-choice. Increments total_votes on the poll and votes_count
 * on the option. The transaction prevents partial writes if the
 * user double-submits (unique constraint blocks duplicates).
 */
export async function votePoll(pollId: number, userId: number, optionIds: number[]) {
  if (!Array.isArray(optionIds) || optionIds.length === 0) {
    throw new AppError('At least one option id is required', 400, 'MISSING_OPTIONS');
  }

  return prisma.$transaction(async (tx) => {
    const poll = await tx.socialPoll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
    if (!poll) throw new AppError('Poll not found', 404, 'POLL_NOT_FOUND');

    if (poll.closesAt && poll.closesAt.getTime() < Date.now()) {
      throw new AppError('Poll has closed', 400, 'POLL_CLOSED');
    }

    if (!poll.multiChoice && optionIds.length > 1) {
      throw new AppError('This poll only allows a single choice', 400, 'POLL_SINGLE_CHOICE');
    }

    const validIds = new Set(poll.options.map((o: any) => o.id));
    for (const id of optionIds) {
      if (!validIds.has(id)) {
        throw new AppError(`Option ${id} is not part of this poll`, 400, 'INVALID_OPTION');
      }
    }

    // Remove previous vote(s) for this user on this poll (re-vote)
    const previous = await tx.socialPollVote.findMany({
      where: { pollId, userId },
    });
    if (previous.length > 0) {
      const prevOptionIds = previous.map((v: any) => v.optionId);
      await tx.socialPollVote.deleteMany({ where: { pollId, userId } });
      // Decrement counts
      for (const prevOptId of prevOptionIds) {
        await tx.socialPollOption.update({
          where: { id: prevOptId },
          data: { votesCount: { decrement: 1 } },
        });
      }
      await tx.socialPoll.update({
        where: { id: pollId },
        data: { totalVotes: { decrement: previous.length } },
      });
    }

    // Apply new votes
    for (const optionId of optionIds) {
      await tx.socialPollVote.create({
        data: { pollId, optionId, userId },
      });
      await tx.socialPollOption.update({
        where: { id: optionId },
        data: { votesCount: { increment: 1 } },
      });
    }

    await tx.socialPoll.update({
      where: { id: pollId },
      data: { totalVotes: { increment: optionIds.length } },
    });

    const fresh = await tx.socialPoll.findUnique({
      where: { id: pollId },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
      },
    });
    return fresh;
  });
}

/**
 * Returns the poll with the viewer's selection(s) flagged.
 * Used by the post-card to render the bars + selected state.
 */
export async function getPollForViewer(pollId: number, userId?: number) {
  const poll = await prisma.socialPoll.findUnique({
    where: { id: pollId },
    include: { options: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!poll) throw new AppError('Poll not found', 404, 'POLL_NOT_FOUND');

  const userVotes = userId
    ? await prisma.socialPollVote.findMany({ where: { pollId, userId } })
    : [];
  const userOptionIds = new Set(userVotes.map((v: any) => v.optionId));

  return {
    ...poll,
    userVotes: Array.from(userOptionIds),
  };
}

// ════════════════════════════════════════════════════════════════
// Feed Collections — multi-folder saved posts (added 2026-06-20)
// ════════════════════════════════════════════════════════════════
//
// Two-table design (FeedCollection + FeedSavedPost) — one row
// per (user, post, collection) triple. This supersedes the old
// single-folder `SocialSave.folder` model for new saves, but we
// keep `SocialSave` for backward compatibility with any code
// path that still writes to it (the legacy /social/posts/:id/
// save route is untouched and continues to use it).
//
// Functions below:
//   - listCollections(userId)        → user-facing collection list
//   - createCollection(userId, name) → create + return new row
//   - deleteCollection(userId, id)   → owner-only delete + cascade
//   - renameCollection(userId, id)   → owner-only rename
//   - savePostToCollections(...)     → multi-folder save/un-save
//   - listSavedPostsInCollection     → posts in a specific folder
//   - getPostSaveContext             → which collections a post is in
//
// `SocialSave` is intentionally NOT updated by these functions —
// the legacy single-folder table becomes a read-only mirror. We
// still update `SocialPost.savesCount` so the existing feed card
// counters stay accurate (the feed cares about "saved? yes/no",
// not which folder).

/** Normalise a collection name. We lowercase for uniqueness
 *  checks but keep the original casing for display. We trim
 *  whitespace, collapse runs of internal whitespace, and
 *  cap at 80 chars (matches `FeedCollection.name` schema). */
function normaliseCollectionName(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, 80);
}

/** List all collections owned by `userId` plus per-collection
 *  save counts and an `uncategorized` bucket count. Sorted by
 *  user-defined sortOrder then by createdAt (oldest first). */
export async function listCollections(userId: number) {
  const collections = await prisma.feedCollection.findMany({
    where: { ownerId: userId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    include: {
      _count: { select: { saves: { where: { userId } } } },
    },
  });

  // The "uncategorised" bucket = legacy `SocialSave` rows with
  // a NULL folder. New multi-collection saves always go through
  // `FeedSavedPost`, which requires a non-null collectionId by
  // schema. This legacy bucket stays visible so existing users
  // don't lose access to posts they saved before this feature.
  const legacyUncategorised = await prisma.socialSave.count({
    where: { userId, folder: null },
  });

  return {
    collections: collections.map((c: any) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      sortOrder: c.sortOrder,
      count: c._count.saves,
      createdAt: c.createdAt,
    })),
    uncategorized: legacyUncategorised,
    total: collections.reduce((a: number, c: any) => a + c._count.saves, 0) + legacyUncategorised,
  };
}

/** Create a new collection owned by `userId`. Throws
 *  DUPLICATE_COLLECTION_NAME if a folder with the same
 *  (case-insensitive) name already exists. */
export async function createCollection(userId: number, rawName: string, icon?: string | null) {
  const name = normaliseCollectionName(rawName);
  if (name.length === 0) {
    throw new AppError('Tên bộ sưu tập không được để trống', 400, 'EMPTY_NAME');
  }
  // Case-insensitive duplicate check. Postgres `mode: 'insensitive'`
  // is supported by Prisma for the `contains`/`equals` filters.
  const existing = await prisma.feedCollection.findFirst({
    where: {
      ownerId: userId,
      name: { equals: name, mode: 'insensitive' as any },
    },
  });
  if (existing) {
    throw new AppError('Bạn đã có bộ sưu tập với tên này', 409, 'DUPLICATE_COLLECTION_NAME');
  }
  // Compute sortOrder = max + 1 so new collections appear at the
  // bottom of the list by default. The user can re-order later.
  const maxRow = await prisma.feedCollection.findFirst({
    where: { ownerId: userId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  const nextOrder = (maxRow?.sortOrder ?? 0) + 1;

  const created = await prisma.feedCollection.create({
    data: {
      name,
      ownerId: userId,
      icon: icon && icon.length <= 8 ? icon : null,
      sortOrder: nextOrder,
    },
  });
  return created;
}

/** Owner-only delete. Cascades to FeedSavedPost rows so no
 *  orphan saves survive. */
export async function deleteCollection(userId: number, collectionId: number) {
  const c = await prisma.feedCollection.findUnique({ where: { id: collectionId } });
  if (!c) throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
  if (c.ownerId !== userId) {
    throw new AppError('Bạn không có quyền xoá bộ sưu tập này', 403, 'NOT_OWNER');
  }
  const affected = await prisma.feedSavedPost.count({ where: { collectionId } });
  await prisma.feedCollection.delete({ where: { id: collectionId } });
  return { deletedCollectionId: collectionId, affectedPosts: affected };
}

/** Owner-only rename. */
export async function renameCollection(userId: number, collectionId: number, rawName: string) {
  const name = normaliseCollectionName(rawName);
  if (name.length === 0) throw new AppError('Tên không được để trống', 400, 'EMPTY_NAME');
  const c = await prisma.feedCollection.findUnique({ where: { id: collectionId } });
  if (!c) throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
  if (c.ownerId !== userId) throw new AppError('Không có quyền đổi tên', 403, 'NOT_OWNER');
  const dupe = await prisma.feedCollection.findFirst({
    where: {
      ownerId: userId,
      id: { not: collectionId },
      name: { equals: name, mode: 'insensitive' as any },
    },
  });
  if (dupe) throw new AppError('Đã có bộ sưu tập trùng tên', 409, 'DUPLICATE_COLLECTION_NAME');
  const updated = await prisma.feedCollection.update({
    where: { id: collectionId },
    data: { name },
  });
  return updated;
}

/**
 * Save a post into one or more collections. The semantics
 * are "set the membership to exactly these collections" —
 * any prior (post,user,collection) rows for this user NOT
 * in the new list are removed. This mirrors how Facebook's
 * bookmark popup works: check a few boxes, click Save, the
 *   "checked" set is the new state.
 *
 * Body params:
 *   - postId:        number (required)
 *   - collectionIds: number[] (optional — empty = remove ALL saves
 *                                for this (post,user))
 *
 * The legacy `SocialSave` row is also written/cleared so the
 * feed card's `isSaved` flag stays consistent across both
 * tables. (The feed card only reads `SocialPost.isSaved`, which
 * is derived from `SocialSave.exists` in `serializePost`.)
 */
export async function savePostToCollections(
  userId: number,
  postId: number,
  collectionIds: number[],
) {
  // 1. Validate post exists.
  const post = await prisma.socialPost.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Bài viết không tồn tại', 404, 'POST_NOT_FOUND');

  // 2. Validate collections belong to user (and exist).
  let validIds: number[] = [];
  if (Array.isArray(collectionIds) && collectionIds.length > 0) {
    const ids = Array.from(new Set(collectionIds.map((n) => Number(n)).filter((n) => Number.isInteger(n) && n > 0)));
    if (ids.length > 0) {
      const owned = await prisma.feedCollection.findMany({
        where: { id: { in: ids }, ownerId: userId },
        select: { id: true },
      });
      validIds = owned.map((o: any) => o.id);
      if (validIds.length !== ids.length) {
        throw new AppError('Một hoặc nhiều bộ sưu tập không hợp lệ', 400, 'INVALID_COLLECTION');
      }
    }
  }

  return prisma.$transaction(async (tx) => {
    // 3. Read existing memberships so we can compute the
    //    delta on the post's `isSaved` UI flag.
    const existing = await tx.feedSavedPost.findMany({
      where: { userId, postId },
      select: { collectionId: true },
    });
    const prev = new Set(existing.map((e: any) => e.collectionId));
    const next = new Set(validIds);

    const toAdd   = validIds.filter((id) => !prev.has(id));
    const toRemove = Array.from(prev).filter((id) => !next.has(id));

    // 4. Insert the new rows (unique constraint dedupes dupes).
    for (const cid of toAdd) {
      await tx.feedSavedPost.create({
        data: { userId, postId, collectionId: cid },
      });
    }

    // 5. Delete the removed rows.
    if (toRemove.length > 0) {
      await tx.feedSavedPost.deleteMany({
        where: { userId, postId, collectionId: { in: toRemove } },
      });
    }

    // 6. Mirror to legacy `SocialSave` so the feed card's
    //    `isSaved` stays accurate. The legacy table stores a
    //    single folder name — we use the FIRST collection's
    //    name for display, or NULL if the user removed all
    //    collections.
    const isSaved = validIds.length > 0;
    if (isSaved) {
      const firstCollection = await tx.feedCollection.findUnique({
        where: { id: validIds[0] },
        select: { name: true },
      });
      // SocialSave doesn't expose a composite unique key in
      // the Prisma schema (no named @@unique), so we
      // upsert by find-then-create/update on the (postId,
      // userId) pair. Cheaper to deleteMany + create than
      // a full transaction here.
      await tx.socialSave.deleteMany({ where: { postId, userId } });
      await tx.socialSave.create({
        data: { postId, userId, folder: firstCollection?.name ?? null },
      });
    } else {
      await tx.socialSave.deleteMany({ where: { postId, userId } });
    }

    return {
      postId,
      collectionIds: validIds,
      added: toAdd,
      removed: toRemove,
      isSaved,
    };
  });
}

/** Which collections does THIS user have THIS post in?
 *  Used by the popover to pre-tick checkboxes when the
 *  user opens it on an already-saved post. */
export async function getPostSaveContext(userId: number, postId: number) {
  const rows = await prisma.feedSavedPost.findMany({
    where: { userId, postId },
    select: {
      collectionId: true,
      collection: { select: { id: true, name: true, icon: true } },
    },
  });
  return {
    collectionIds: rows.map((r: any) => r.collectionId),
    collections: rows.map((r: any) => r.collection),
    isSaved: rows.length > 0,
  };
}

/** List posts in a specific collection. Cursor-paginated.
 *  Returns the full SocialPost rows so the page can render
 *  them with PostCard without an extra fetch. */
export async function listSavedPostsInCollection(
  userId: number,
  collectionId: number | null,
  cursor: number | null,
  limit: number,
) {
  // Validate ownership for non-null collections.
  if (collectionId !== null) {
    const owned = await prisma.feedCollection.findFirst({
      where: { id: collectionId, ownerId: userId },
      select: { id: true },
    });
    if (!owned) throw new AppError('Collection not found', 404, 'COLLECTION_NOT_FOUND');
  }

  const where: any = collectionId === null
    ? { userId, collectionId: null as any } // sentinel — see below
    : { userId, collectionId };

  // The schema requires a non-null collectionId on
  // FeedSavedPost; for the "Chưa phân loại" bucket we fall
  // back to the legacy `SocialSave.folder IS NULL` query and
  // shape it the same way so the page renders identically.
  if (collectionId === null) {
    const legacyRows = await prisma.socialSave.findMany({
      where: { userId, folder: null },
      include: {
        post: {
          include: {
            _count: { select: { likes: true, comments: true, saves: true } },
            author: true,
            media: true,
            poll: true,
            likes: true,
            saves: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const hasMore = legacyRows.length > limit;
    const sliced = legacyRows.slice(0, limit);
    return {
      items: sliced.map((r: any) => ({
        saveId: r.id,
        savedAt: r.createdAt,
        folder: r.folder,
        post: serializePost(r.post, { currentUserId: userId }),
      })),
      nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
    };
  }

  const rows = await prisma.feedSavedPost.findMany({
    where,
    include: {
      post: {
        include: {
          _count: { select: { likes: true, comments: true, saves: true } },
          author: true,
          media: true,
          poll: true,
          likes: true,
          saves: true,
        },
      },
      collection: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const hasMore = rows.length > limit;
  const sliced = rows.slice(0, limit);
  return {
    items: sliced.map((r: any) => {
      // Pass collection name so savedFolder appears correctly on the card.
      const serialized = serializePost(r.post, { currentUserId: userId });
      serialized.savedFolder = r.collection?.name ?? null;
      return {
        saveId: r.id,
        savedAt: r.createdAt,
        collectionId: r.collectionId,
        post: serialized,
      };
    }),
    nextCursor: hasMore ? sliced[sliced.length - 1].id : null,
  };
}
