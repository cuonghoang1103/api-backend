'use client';

import { create } from 'zustand';
import { socialApi } from '@/lib/api';
import type { SocialPost, SocialComment, MediaUploadItem } from '@/types/social';

interface SocialState {
  // Feed
  posts: SocialPost[];
  isLoadingFeed: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  cursor: number | null;
  error: string | null;

  // Comments
  commentsByPost: Record<number, SocialComment[]>;
  commentsCursorByPost: Record<number, number | null>;
  commentsHasMoreByPost: Record<number, boolean>;
  isLoadingComments: Record<number, boolean>;

  // Composer
  composerContent: string;
  composerMedia: MediaUploadItem[];
  composerVisibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  // Phase 2 — poll draft. Null = no poll. The post will be sent with
  // the poll if it's non-null and has at least 2 non-empty options.
  composerPoll: { question: string; options: string[]; multiChoice: boolean } | null;
  isPosting: boolean;

  // Saved posts
  savedPosts: SocialPost[];
  saveFolders: Array<{ name: string | null; count: number }>;
  isLoadingSaves: boolean;

  // Actions
  loadFeed: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;

  // Like/unlike
  toggleLike: (postId: number) => Promise<void>;

  // Save/unsave
  toggleSave: (postId: number, folder?: string) => Promise<void>;

  // Post management
  deletePost: (postId: number) => Promise<void>;
  updatePostPoll: (postId: number, poll: any) => void;

  // Composer
  setComposerContent: (content: string) => void;
  setComposerVisibility: (v: 'PUBLIC' | 'FRIENDS' | 'PRIVATE') => void;
  addComposerMedia: (items: MediaUploadItem[]) => void;
  removeComposerMedia: (id: string) => void;
  // Phase 2 — poll attached to the next post
  setComposerPoll: (poll: { question: string; options: string[]; multiChoice: boolean } | null) => void;
  clearComposer: () => void;
  submitPost: () => Promise<SocialPost | null>;

  // Comments
  loadComments: (postId: number, reset?: boolean) => Promise<void>;
  loadMoreComments: (postId: number) => Promise<void>;
  addOptimisticComment: (postId: number, comment: SocialComment) => void;
  removeOptimisticComment: (postId: number, commentId: number) => void;

  // Saved
  loadSaved: () => Promise<void>;
  loadSaveFolders: () => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: [],
  isLoadingFeed: false,
  isLoadingMore: false,
  hasNextPage: true,
  cursor: null,
  error: null,

  commentsByPost: {},
  commentsCursorByPost: {},
  commentsHasMoreByPost: {},
  isLoadingComments: {},

  composerContent: '',
  composerMedia: [],
  composerVisibility: 'PUBLIC',
  composerPoll: null,
  isPosting: false,

  savedPosts: [],
  saveFolders: [],
  isLoadingSaves: false,

  loadFeed: async (reset = false) => {
    if (get().isLoadingFeed) return;
    set({ isLoadingFeed: true, error: null });

    try {
      const res = await socialApi.getFeed({ limit: 20 });
      set({
        posts: res.data.data,
        cursor: res.data.pagination.nextCursor,
        hasNextPage: res.data.pagination.hasNextPage,
        isLoadingFeed: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load feed';
      set({ error: msg, isLoadingFeed: false });
    }
  },

  loadMore: async () => {
    const { cursor, isLoadingMore, hasNextPage } = get();
    if (isLoadingMore || !hasNextPage || !cursor) return;

    set({ isLoadingMore: true });

    try {
      const res = await socialApi.getFeed({ cursor, limit: 20 });
      set((s) => ({
        posts: [...s.posts, ...res.data.data],
        cursor: res.data.pagination.nextCursor,
        hasNextPage: res.data.pagination.hasNextPage,
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },

  toggleLike: async (postId) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const wasLiked = post.isLiked;
    // Optimistic update
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !wasLiked, likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      ),
    }));

    try {
      if (wasLiked) {
        await socialApi.unlikePost(postId);
      } else {
        await socialApi.likePost(postId);
      }
    } catch {
      // Revert on error
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId
            ? { ...p, isLiked: wasLiked, likesCount: wasLiked ? p.likesCount + 1 : p.likesCount - 1 }
            : p
        ),
      }));
    }
  },

  toggleSave: async (postId, folder) => {
    const { posts } = get();
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const wasSaved = post.isSaved;
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId
          ? { ...p, isSaved: !wasSaved, savesCount: wasSaved ? p.savesCount - 1 : p.savesCount + 1 }
          : p
      ),
    }));

    try {
      if (wasSaved) {
        await socialApi.unsavePost(postId);
      } else {
        await socialApi.savePost(postId, folder);
      }
    } catch {
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId
            ? { ...p, isSaved: wasSaved, savesCount: wasSaved ? p.savesCount + 1 : p.savesCount - 1 }
            : p
        ),
      }));
    }
  },

  /**
   * Remove a post from the feed. Used by the post card "Delete"
   * action which is visible to the author OR any admin (the
   * backend enforces the same rule). The removal is optimistic
   * and we don't roll it back on failure because the user just
   * saw the row disappear — surfacing a 500 here would be more
   * confusing than a single missing card.
   */
  deletePost: async (postId) => {
    const before = get().posts;
    set({ posts: before.filter((p) => p.id !== postId) });
    try {
      await socialApi.deletePost(postId);
    } catch (err) {
      // Restore on error so the feed doesn't lie.
      set({ posts: before });
      throw err;
    }
  },

  /**
   * In-place patch of a post's poll. We don't refetch the whole
   * feed because the rest of the row is unchanged; the user just
   * toggled their vote.
   */
  updatePostPoll: (postId, poll) =>
    set((s) => ({
      posts: s.posts.map((p) => (p.id === postId ? { ...p, poll } : p)),
    })),

  setComposerContent: (content) => set({ composerContent: content }),
  setComposerVisibility: (v) => set({ composerVisibility: v }),

  addComposerMedia: (items) =>
    set((s) => ({ composerMedia: [...s.composerMedia, ...items] })),

  removeComposerMedia: (id) =>
    set((s) => ({ composerMedia: s.composerMedia.filter((m) => m.id !== id) })),

  clearComposer: () =>
    set({ composerContent: '', composerMedia: [], composerVisibility: 'PUBLIC', composerPoll: null }),

  setComposerPoll: (poll) => set({ composerPoll: poll }),

  submitPost: async () => {
    const { composerContent, composerMedia, composerVisibility, composerPoll } = get();
    if (!composerContent.trim() && composerMedia.length === 0 && !composerPoll) return null;

    set({ isPosting: true });
    try {
      const mediaPayload = composerMedia
        .filter((m) => m.url && m.progress === 100)
        .map((m, i) => ({
          type: m.type,
          url: m.url!,
          thumbnail: m.thumbnail,
          width: m.width,
          height: m.height,
          duration: m.duration,
          sortOrder: i,
          mimeType: m.file.type,
          alt: m.file.name,
        }));

      // Only send the poll if the user actually filled in the question
      // and at least 2 options. Otherwise the draft was abandoned and
      // we silently drop it.
      const pollPayload = composerPoll
        ? (() => {
            const q = composerPoll.question.trim();
            const opts = composerPoll.options.map((o) => o.trim()).filter(Boolean);
            if (q && opts.length >= 2) {
              return { question: q, options: opts, multiChoice: composerPoll.multiChoice };
            }
            return null;
          })()
        : null;

      const res = await socialApi.createPost({
        content: composerContent,
        visibility: composerVisibility,
        media: mediaPayload.length > 0 ? mediaPayload : undefined,
        poll: pollPayload || undefined,
      });

      const newPost = res.data as unknown as SocialPost;
      set((s) => ({
        posts: [newPost, ...s.posts],
        isPosting: false,
      }));
      get().clearComposer();
      return newPost;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post';
      set({ isPosting: false });
      throw new Error(msg);
    }
  },

  loadComments: async (postId, reset = false) => {
    set((s) => ({ isLoadingComments: { ...s.isLoadingComments, [postId]: true } }));
    try {
      const res = await socialApi.getComments(postId, { limit: 20 });
      set((s) => ({
        commentsByPost: { ...s.commentsByPost, [postId]: res.data.data },
        commentsCursorByPost: { ...s.commentsCursorByPost, [postId]: res.data.pagination.nextCursor },
        commentsHasMoreByPost: { ...s.commentsHasMoreByPost, [postId]: res.data.pagination.hasNextPage },
        isLoadingComments: { ...s.isLoadingComments, [postId]: false },
      }));
    } catch {
      set((s) => ({ isLoadingComments: { ...s.isLoadingComments, [postId]: false } }));
    }
  },

  loadMoreComments: async (postId) => {
    const cursor = get().commentsCursorByPost[postId];
    if (!cursor) return;
    try {
      const res = await socialApi.getComments(postId, { cursor, limit: 20 });
      set((s) => ({
        commentsByPost: {
          ...s.commentsByPost,
          [postId]: [...(s.commentsByPost[postId] || []), ...res.data.data],
        },
        commentsCursorByPost: { ...s.commentsCursorByPost, [postId]: res.data.pagination.nextCursor },
        commentsHasMoreByPost: { ...s.commentsHasMoreByPost, [postId]: res.data.pagination.hasNextPage },
      }));
    } catch {
      // ignore
    }
  },

  addOptimisticComment: (postId, comment) =>
    set((s) => ({
      commentsByPost: {
        ...s.commentsByPost,
        [postId]: [...(s.commentsByPost[postId] || []), comment],
      },
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
      ),
    })),

  removeOptimisticComment: (postId, commentId) =>
    set((s) => ({
      commentsByPost: {
        ...s.commentsByPost,
        [postId]: (s.commentsByPost[postId] || []).filter((c) => c.id !== commentId),
      },
      posts: s.posts.map((p) =>
        p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) } : p
      ),
    })),

  loadSaved: async () => {
    set({ isLoadingSaves: true });
    try {
      const res = await socialApi.getSaved({ limit: 20 });
      set({ savedPosts: (res.data.data as any).map((s: any) => s.post), isLoadingSaves: false });
    } catch {
      set({ isLoadingSaves: false });
    }
  },

  loadSaveFolders: async () => {
    try {
      const res = await socialApi.getSaveFolders();
      set({ saveFolders: res.data.folders });
    } catch {
      // ignore
    }
  },
}));
