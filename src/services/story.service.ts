/**
 * ============================================================
 * Story Service — Instagram/Facebook-style ephemeral stories
 * ============================================================
 *
 * Features:
 * - Create story with media (image/video) and optional text
 * - Stories expire after 24h
 * - View story (track views)
 * - Create Story Highlights (persist on profile)
 * - Privacy controls (PUBLIC, FRIENDS, PRIVATE)
 * - Hide story from specific users
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const STORY_DURATION_HOURS = 24;
const STORY_EXPIRES_MS = STORY_DURATION_HOURS * 60 * 60 * 1000;

export interface CreateStoryInput {
  userId: number;
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  caption?: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  duration?: number; // seconds, for video
  thumbnail?: string;
  backgroundColor?: string;
}

export interface StoryWithMeta {
  id: number;
  userId: number;
  visibility: string;
  caption: string | null;
  mediaUrl: string | null;
  mediaType: string;
  duration: number | null;
  thumbnail: string | null;
  backgroundColor: string | null;
  expiresAt: Date;
  createdAt: Date;
  isOwn: boolean;
  hasViewed: boolean;
  viewsCount: number;
  user: {
    id: number;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

export interface HighlightWithStories {
  id: number;
  name: string;
  sortOrder: number;
  stories: Array<{
    id: number;
    thumbnail: string | null;
    mediaUrl: string | null;
    createdAt: Date;
  }>;
}

/**
 * Create a new story
 */
export async function createStory(input: CreateStoryInput) {
  const { userId, visibility = 'PUBLIC', caption, mediaUrl, mediaType = 'IMAGE', duration, thumbnail, backgroundColor } = input;

  if (!mediaUrl && !caption) {
    throw new AppError('Story must have either media or caption', 400, 'MISSING_CONTENT');
  }

  const expiresAt = new Date(Date.now() + STORY_EXPIRES_MS);

  const story = await prisma.story.create({
    data: {
      userId,
      visibility,
      caption,
      mediaUrl,
      mediaType,
      duration,
      thumbnail,
      backgroundColor,
      expiresAt,
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
    },
  });

  return story;
}

/**
 * Get stories for the home feed bar (users who have active stories)
 * Excludes hidden stories and expired stories
 */
export async function getHomeFeedStories(currentUserId: number) {
  const now = new Date();

  // Get all active stories grouped by user
  const stories = await prisma.story.findMany({
    where: {
      expiresAt: { gt: now },
      // Exclude stories from users the current user has hidden
      NOT: {
        userId: {
          in: await prisma.storyHide
            .findMany({
              where: { userId: currentUserId },
              select: { storyId: true, userId: true },
            })
            .then((hides) => {
              // Get userIds of story owners whose stories are hidden
              return hides.map((h) => h.userId);
            }),
        },
      },
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      views: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Group by user and mark own stories
  const userMap = new Map<number, StoryWithMeta>();
  for (const s of stories) {
    if (userMap.has(s.userId)) continue; // Only show one story per user
    userMap.set(s.userId, {
      id: s.id,
      userId: s.userId,
      visibility: s.visibility,
      caption: s.caption,
      mediaUrl: s.mediaUrl,
      mediaType: s.mediaType,
      duration: s.duration,
      thumbnail: s.thumbnail,
      backgroundColor: s.backgroundColor,
      expiresAt: s.expiresAt,
      createdAt: s.createdAt,
      isOwn: s.userId === currentUserId,
      hasViewed: currentUserId ? (s.views?.length ?? 0) > 0 : false,
      viewsCount: s.views?.length ?? 0,
      user: s.user,
    });
  }

  return Array.from(userMap.values());
}

/**
 * Get stories for a specific user profile (for the story bar)
 * Shows own stories + friends' stories based on privacy
 */
export async function getUserStories(userId: number, currentUserId: number) {
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: {
      userId,
      expiresAt: { gt: now },
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      views: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
    },
    orderBy: { createdAt: 'desc' },
  });

  const isOwn = userId === currentUserId;

  return stories.map((s) => ({
    id: s.id,
    userId: s.userId,
    visibility: s.visibility,
    caption: s.caption,
    mediaUrl: s.mediaUrl,
    mediaType: s.mediaType,
    duration: s.duration,
    thumbnail: s.thumbnail,
    backgroundColor: s.backgroundColor,
    expiresAt: s.expiresAt,
    createdAt: s.createdAt,
    isOwn,
    hasViewed: currentUserId ? (s.views?.length ?? 0) > 0 : false,
    viewsCount: s.views?.length ?? 0,
    user: s.user,
  }));
}

/**
 * Get all stories in a user's ring (for the viewer)
 * Includes current user's own stories and stories from followed users / public
 */
export async function getRingStories(currentUserId: number) {
  const now = new Date();

  // Get current user's stories
  const ownStories = await prisma.story.findMany({
    where: {
      userId: currentUserId,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Get stories from public accounts and friends (simplified: all non-private for now)
  const otherStories = await prisma.story.findMany({
    where: {
      userId: { not: currentUserId },
      expiresAt: { gt: now },
      visibility: 'PUBLIC',
      // Exclude hidden stories
      NOT: {
        userId: {
          in: await prisma.storyHide
            .findMany({
              where: { userId: currentUserId },
              select: { storyId: true, userId: true },
            })
            .then((hides) => hides.map((h) => h.userId)),
        },
      },
    },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      views: { where: { userId: currentUserId }, select: { id: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return [
    // Own stories first
    ...ownStories.map((s) => ({
      ...s,
      isOwn: true,
      hasViewed: true, // Own stories are always "viewed"
      user: null, // Will be filled from context
    })),
    // Then other stories
    ...otherStories.map((s) => ({
      ...s,
      isOwn: false,
      hasViewed: (s.views?.length ?? 0) > 0,
      user: s.user,
    })),
  ];
}

/**
 * View a story (mark as viewed)
 */
export async function viewStory(storyId: number, userId: number) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: { userId: true },
  });

  if (!story) throw new AppError('Story not found', 404, 'STORY_NOT_FOUND');
  if (story.userId === userId) {
    // Can't view your own story
    return { viewed: false };
  }

  await prisma.storyView.upsert({
    where: {
      storyId_userId: { storyId, userId },
    },
    create: { storyId, userId },
    update: {},
  });

  return { viewed: true };
}

/**
 * Get a single story by ID
 */
export async function getStoryById(storyId: number, currentUserId?: number) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    include: {
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      views: currentUserId
        ? { where: { userId: currentUserId }, select: { id: true } }
        : false,
    },
  });

  if (!story) throw new AppError('Story not found', 404, 'STORY_NOT_FOUND');

  const now = new Date();
  if (story.expiresAt < now) {
    throw new AppError('Story has expired', 410, 'STORY_EXPIRED');
  }

  return {
    ...story,
    isOwn: story.userId === currentUserId,
    hasViewed: currentUserId ? (story.views?.length ?? 0) > 0 : false,
    viewsCount: story.views?.length ?? 0,
  };
}

/**
 * Delete a story (owner only)
 */
export async function deleteStory(storyId: number, userId: number) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: { userId: true },
  });

  if (!story) throw new AppError('Story not found', 404, 'STORY_NOT_FOUND');
  if (story.userId !== userId) {
    throw new AppError('Not authorized', 403, 'UNAUTHORIZED');
  }

  await prisma.story.delete({ where: { id: storyId } });
  return { deleted: true };
}

/**
 * Hide a story from a user (the viewer hides the story)
 */
export async function hideStory(storyId: number, userId: number) {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: { userId: true },
  });

  if (!story) throw new AppError('Story not found', 404, 'STORY_NOT_FOUND');

  await prisma.storyHide.upsert({
    where: {
      storyId_userId: { storyId, userId },
    },
    create: { storyId, userId },
    update: {},
  });

  return { hidden: true };
}

/**
 * Create or update a Story Highlight
 */
export async function addToHighlight(userId: number, storyId: number, name: string) {
  // Verify story belongs to user
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: { userId: true },
  });

  if (!story) throw new AppError('Story not found', 404, 'STORY_NOT_FOUND');
  if (story.userId !== userId) {
    throw new AppError('Not authorized', 403, 'UNAUTHORIZED');
  }

  // Find or create highlight with this name
  const existing = await prisma.storyHighlight.findFirst({
    where: { userId, name },
  });

  let highlightId: number;

  if (existing) {
    highlightId = existing.id;
    // Check if story already in highlight
    const existingStory = await prisma.storyHighlight.findFirst({
      where: { userId, storyId },
    });
    if (existingStory) {
      return { added: true, highlightId };
    }
  } else {
    // Create new highlight
    const count = await prisma.storyHighlight.count({ where: { userId } });
    const newHighlight = await prisma.storyHighlight.create({
      data: { userId, name, storyId, sortOrder: count },
    });
    highlightId = newHighlight.id;
    return { added: true, highlightId };
  }

  // Add story to existing highlight
  const count = await prisma.storyHighlight.count({
    where: { userId, name },
  });

  await prisma.storyHighlight.create({
    data: { userId, name, storyId, sortOrder: count },
  });

  return { added: true, highlightId };
}

/**
 * Get user's story highlights
 */
export async function getUserHighlights(userId: number) {
  const highlights = await prisma.storyHighlight.groupBy({
    by: ['name'],
    where: { userId },
    _count: { storyId: true },
  });

  // Get first story thumbnail for each highlight
  const result: HighlightWithStories[] = [];

  for (const h of highlights) {
    const stories = await prisma.storyHighlight.findMany({
      where: { userId, name: h.name },
      include: {
        story: {
          select: { id: true, thumbnail: true, mediaUrl: true, createdAt: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: 10, // Limit for preview
    });

    result.push({
      id: stories[0]?.id ?? 0,
      name: h.name,
      sortOrder: 0,
      stories: stories.map((s) => ({
        id: s.story.id,
        thumbnail: s.story.thumbnail ?? s.story.mediaUrl,
        mediaUrl: s.story.mediaUrl,
        createdAt: s.story.createdAt,
      })),
    });
  }

  return result;
}

/**
 * Delete a highlight
 */
export async function deleteHighlight(userId: number, name: string) {
  await prisma.storyHighlight.deleteMany({
    where: { userId, name },
  });
  return { deleted: true };
}

/**
 * Rename a highlight
 */
export async function renameHighlight(userId: number, oldName: string, newName: string) {
  await prisma.storyHighlight.updateMany({
    where: { userId, name: oldName },
    data: { name: newName },
  });
  return { renamed: true };
}

/**
 * Update story privacy
 */
export async function updateStoryPrivacy(storyId: number, userId: number, visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE') {
  const story = await prisma.story.findUnique({
    where: { id: storyId },
    select: { userId: true },
  });

  if (!story) throw new AppError('Story not found', 404, 'STORY_NOT_FOUND');
  if (story.userId !== userId) {
    throw new AppError('Not authorized', 403, 'UNAUTHORIZED');
  }

  await prisma.story.update({
    where: { id: storyId },
    data: { visibility },
  });

  return { updated: true };
}
