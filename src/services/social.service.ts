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

// ─── Types ─────────────────────────────────────────────────────────

export interface CreatePostInput {
  authorId: number;
  content: string;
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  latitude?: number;
  longitude?: number;
  locationName?: string;
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
  const { media, ...postData } = input;

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
            alt: m.alt,
            sortOrder: m.sortOrder ?? idx,
          })),
        },
      } : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      media: {
        orderBy: { sortOrder: 'asc' as const },
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

  return post;
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
          avatarUrl: true,
        },
      },
      media: {
        orderBy: { sortOrder: 'asc' as const },
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

  return {
    ...post,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    savesCount: post._count.saves,
    isLiked: currentUserId ? (post.likes as unknown[]).length > 0 : false,
    isSaved: currentUserId ? (post.saves as unknown[]).length > 0 : false,
    savedFolder: currentUserId && Array.isArray(post.saves) && post.saves.length > 0
      ? (post.saves[0] as { folder?: string }).folder : null,
    likes: undefined,
    saves: undefined,
    _count: undefined,
  };
}

export async function deletePost(postId: number, userId: number) {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
  if (post.authorId !== userId) throw new AppError('Unauthorized', 403, 'FORBIDDEN');

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

  const enriched = items.map((post: any) => ({
    id: post.id,
    content: post.content,
    visibility: post.visibility,
    latitude: post.latitude,
    longitude: post.longitude,
    locationName: post.locationName,
    viewCount: post.viewCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author,
    media: post.media,
    likesCount: post._count?.likes ?? 0,
    commentsCount: post._count?.comments ?? 0,
    savesCount: post._count?.saves ?? 0,
    isLiked: currentUserId ? (post.likes as unknown[]).length > 0 : false,
    isSaved: currentUserId ? (post.saves as unknown[]).length > 0 : false,
    savedFolder: currentUserId && Array.isArray(post.saves) && post.saves.length > 0
      ? (post.saves[0] as { folder?: string }).folder : null,
  }));

  return {
    data: enriched,
    pagination: {
      nextCursor,
      hasNextPage,
      limit,
    },
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
  if (comment.userId !== userId) throw new AppError('Unauthorized', 403, 'FORBIDDEN');

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
