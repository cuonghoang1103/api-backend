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
  media?: Array<{
    type: string;
    url: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    duration?: number;
    fileSize?: bigint;
    mimeType?: string;
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
}

export interface FeedOptions {
  cursor?: number;
  limit?: number;
  authorId?: number;
  visibility?: string;
}

export interface CommentInput {
  userId: number;
  postId: number;
  parentId?: number;
  content: string;
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

  const post = await prisma.socialPost.create({
    data: {
      ...postData,
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

  return serializePost(post, {
    currentUserId: input.authorId,
    pollUserVotes: freshUserVotes,
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

  return serializePost(post, {
    currentUserId,
    pollUserVotes,
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
  const { cursor, limit = 20, authorId, visibility, currentUserId } = options;

  const posts = await prisma.socialPost.findMany({
    where: {
      visibility: visibility as 'PUBLIC' | 'FRIENDS' | 'PRIVATE' | undefined,
      ...(authorId ? { authorId } : {}),
      ...(cursor ? { id: { lt: cursor } } : {}),
    },
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
        select: { id: true },
      } : false,
      saves: currentUserId ? {
        where: { userId: currentUserId },
        select: { id: true, folder: true },
      } : false,
    },
  });

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, limit) : posts;
  const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

  // Bulk-load the viewer's poll votes for the visible polls to avoid
  // an N+1 query. The PostCard needs userVotes to highlight the
  // selected state in the bars.
  const pollIds = items.map((p: any) => p.poll?.id).filter((x: any) => Boolean(x));
  const pollVotesByPollId = currentUserId
    ? await loadPollVotes(pollIds, currentUserId)
    : {};

  return {
    data: items.map((post: any) => serializePost(post, { currentUserId, pollUserVotes: pollVotesByPollId[post.poll?.id] || [] })),
    pagination: {
      nextCursor,
      hasNextPage,
      limit,
    },
  };
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
function serializePost(
  post: any,
  opts: {
    currentUserId?: number;
    pollUserVotes?: number[];
  } = {},
) {
  const { currentUserId, pollUserVotes } = opts;
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
    viewCount: post.viewCount ?? 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    media: post.media ?? [],
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
    savedFolder:
      currentUserId && Array.isArray(post.saves) && (post.saves as unknown[]).length > 0
        ? (post.saves[0] as { folder?: string }).folder ?? null
        : null,
  };
}

// ─── Like / Unlike ────────────────────────────────────────────────

export async function likePost(postId: number, userId: number) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  const existing = await prisma.socialLike.findFirst({
    where: { postId, userId },
  });

  if (existing) {
    return { liked: true, message: 'Already liked' };
  }

  await prisma.socialLike.create({
    data: { postId, userId },
  });

  const count = await prisma.socialLike.count({ where: { postId } });
  return { liked: true, likesCount: count };
}

export async function unlikePost(postId: number, userId: number) {
  await prisma.socialLike.deleteMany({
    where: { postId, userId },
  });

  const count = await prisma.socialLike.count({ where: { postId } });
  return { liked: false, likesCount: count };
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
    select: { id: true },
  });
  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');

  const comment = await prisma.socialComment.create({
    data: {
      postId: input.postId,
      userId: input.userId,
      parentId: input.parentId,
      content: input.content,
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

  if (input.parentId) {
    await prisma.socialComment.update({
      where: { id: input.parentId },
      data: { repliesCount: { increment: 1 } },
    });
  }

  return {
    ...comment,
    likesCount: comment._count.likes,
    isLiked: false,
    repliesCount: comment.repliesCount,
  };
}

export async function getComments(postId: number, options: { cursor?: number; limit?: number } = {}) {
  const { cursor: _c, limit = 20 } = options;

  const comments = await prisma.socialComment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: 'asc' },
    take: limit + 1,
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
    likesCount: c._count?.likes ?? 0,
    repliesCount: c.repliesCount,
    isEdited: c.isEdited,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    user: c.user,
    isLiked: (c.likes as any[]).some((l: any) => l.userId !== undefined),
    replies: c.replies.map((r: any) => ({
      id: r.id,
      postId: r.postId,
      parentId: r.parentId,
      content: r.content,
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
