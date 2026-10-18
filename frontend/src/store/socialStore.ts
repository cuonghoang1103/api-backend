'use client';

import { create } from 'zustand';
import { socialApi } from '@/lib/api';
import type {
  SocialPost,
  SocialComment,
  MediaUploadItem,
  ReactionType,
  ReactionBreakdown,
} from '@/types/social';

/** Feed query scope shared between the initial load and loadMore. */
export interface FeedQueryParams {
  sort?: 'recent' | 'popular';
  following?: boolean;
  hashtag?: string;
  type?: 'POST' | 'VIDEO' | 'FILE';
  // Video-category filter (home feed video pills). Omitted = all.
  videoCategoryId?: number;
}

interface SocialState {
  // Feed
  posts: SocialPost[];
  isLoadingFeed: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  cursor: number | null;
  error: string | null;
  // Active feed query scope (filter tabs + hashtag + content-type tab).
  // loadMore() reuses these so infinite-scroll pages stay in the same
  // scope as the initial load — previously loadMore ignored them and
  // appended an unfiltered page. The page keeps this in sync whenever a
  // tab / hashtag changes (alongside resetting `posts`).
  feedParams: FeedQueryParams;

  // Comments
  commentsByPost: Record<number, SocialComment[]>;
  commentsCursorByPost: Record<number, number | null>;
  commentsHasMoreByPost: Record<number, boolean>;
  isLoadingComments: Record<number, boolean>;

  // ─── Facebook-style comment modal (added 2026-07-09) ──────────
  // Which post's comment modal is currently open (null = closed).
  // <PostCommentModal /> is mounted once in the root layout and
  // reads this to render a centered dialog (desktop) / full-screen
  // sheet (mobile). The PostCard "Bình luận" button opens it via
  // openCommentModal instead of expanding inline.
  commentModalPostId: number | null;
  // Optional comment id to scroll to after the modal opens — used
  // by the ?comment=N deep-link so a notification click lands on
  // the exact comment.
  commentModalFocusCommentId: number | null;

  // Composer
  composerContent: string;
  composerMedia: MediaUploadItem[];
  composerVisibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  // Phase 2 — poll draft. Null = no poll. The post will be sent with
  // the poll if it's non-null and has at least 2 non-empty options.
  composerPoll: { question: string; options: string[]; multiChoice: boolean } | null;
  // Phase 3 — optional YouTube URL the user pasted in the composer.
  // When set, the backend stores it on the post and the renderer
  // embeds an inline player. Empty string means "no embed".
  composerYouTubeUrl: string;
  // Phase 3 add — Instagram-style music sticker. When set, the
  // post will be sent to the backend as a `postMusic` block
  // (canonical) OR a legacy `musicTrackId` field. The PostCard
  // renders a small "🎵 <title> — <artist>" overlay on the first
  // media tile. Null = no music sticker.
  //
  // startSec / endSec / audioUrl were added in Phase 5 so the
  // trimmed snippet the user picked in MusicPickerModal actually
  // makes it through the round-trip (the previous version dropped
  // them on the floor and the sticker always played from 0 with
  // the full track duration).
  composerMusicTrack: {
    id: number;
    title: string;
    artist: string;
    coverImage?: string | null;
    audioUrl?: string | null;
    startSec?: number;
    endSec?: number;
  } | null;
  // Content-type bucket the user is composing (feed tabs). Defaults to
  // POST; the composer's segmented picker sets it. Sent to createPost so
  // the post lands in the right tab. The server still derives a sensible
  // type if this is somehow omitted.
  composerType: 'POST' | 'VIDEO' | 'FILE';
  // Optional video category id chosen in the composer (only used when
  // composerType === 'VIDEO'). null = "Chưa phân loại".
  composerVideoCategoryId: number | null;
  // "Hiện ở mục Tất cả" checkbox — only meaningful when a VIDEO post has
  // a category. true (default) = visible everywhere; false = the post
  // only surfaces under its own category pill.
  composerVideoShowInAll: boolean;
  isPosting: boolean;

  // Saved posts
  savedPosts: SocialPost[];
  saveFolders: Array<{ name: string | null; count: number }>;
  isLoadingSaves: boolean;

  // Actions
  loadFeed: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  /** Update the active feed scope used by loadMore (set by the page). */
  setFeedParams: (params: FeedQueryParams) => void;

  // Like/unlike — legacy entry kept for callers that still use
  // the old "Like / Unlike" pair of buttons (e.g. profile pages
  // that link to /social/posts/:id/like). New UI goes through
  // `toggleReaction` which carries the reaction type.
  toggleLike: (postId: number) => Promise<void>;

  // ─── Multi-emoji reactions (added 2026-06-20) ────────────────
  // Toggles a specific reaction type on a post. The server tells
  // us whether the user is now reacted or not, what their current
  // type is, and the per-type counts — we apply those directly to
  // the local post row so the emoji stack updates instantly.
  toggleReaction: (postId: number, type: ReactionType) => Promise<void>;

  // Patch a post's reaction breakdown in-place. Used when the
  // server pushes an updated breakdown via socket (so we don't
  // have to refetch the whole feed to render the new count).
  updatePostReactions: (
    postId: number,
    next: { reacted: boolean; myType: ReactionType | null; likesCount: number; breakdown: ReactionBreakdown },
  ) => void;

  // Save/unsave
  toggleSave: (postId: number, folder?: string) => Promise<void>;
  unsavePost: (postId: number) => Promise<void>;

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
  // Phase 3 — YouTube URL the composer is tracking
  setComposerYouTubeUrl: (url: string) => void;
  setComposerType: (t: 'POST' | 'VIDEO' | 'FILE') => void;
  setComposerVideoCategoryId: (id: number | null) => void;
  setComposerVideoShowInAll: (v: boolean) => void;
  // Phase 3 add — set the Instagram-style music sticker.
  // `track === null` clears the sticker. The composer calls
  // this from the music picker modal. The audioUrl + start/end
  // fields are optional but the snippet bounds are needed for
  // the trim UI to take effect on the published post.
  setComposerMusicTrack: (track: {
    id: number;
    title: string;
    artist: string;
    coverImage?: string | null;
    audioUrl?: string | null;
    startSec?: number;
    endSec?: number;
  } | null) => void;
  clearComposer: () => void;
  submitPost: () => Promise<SocialPost | null>;

  // Comments
  loadComments: (postId: number, reset?: boolean) => Promise<void>;
  loadMoreComments: (postId: number) => Promise<void>;
  addOptimisticComment: (postId: number, comment: SocialComment) => void;
  removeOptimisticComment: (postId: number, commentId: number) => void;

  // Comment modal (Facebook-style). openCommentModal sets the
  // active post (and optional comment to focus); closeCommentModal
  // clears both.
  openCommentModal: (postId: number, focusCommentId?: number) => void;
  closeCommentModal: () => void;

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
  feedParams: {},

  commentsByPost: {},
  commentsCursorByPost: {},
  commentsHasMoreByPost: {},
  isLoadingComments: {},
  commentModalPostId: null,
  commentModalFocusCommentId: null,

  composerContent: '',
  composerMedia: [],
  composerVisibility: 'PUBLIC',
  composerPoll: null,
  composerYouTubeUrl: '',
  composerMusicTrack: null,
  composerType: 'POST',
  composerVideoCategoryId: null,
  composerVideoShowInAll: true,
  isPosting: false,

  savedPosts: [],
  saveFolders: [],
  isLoadingSaves: false,

  setFeedParams: (params) => set({ feedParams: params }),

  loadFeed: async (reset = false) => {
    if (get().isLoadingFeed) return;
    set({ isLoadingFeed: true, error: null });

    try {
      const res = await socialApi.getFeed({ ...get().feedParams, limit: 20 });
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
    const { cursor, isLoadingMore, hasNextPage, feedParams } = get();
    if (isLoadingMore || !hasNextPage || !cursor) return;

    set({ isLoadingMore: true });

    try {
      const res = await socialApi.getFeed({ ...feedParams, cursor, limit: 20 });
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

    // Play the "like" sound on every state change (both like and
    // unlike). The user explicitly asked for the chime to play even
    // when they themselves like their own posts.
    if (typeof window !== 'undefined') {
      import('@/lib/sound').then(({ playSound }) => {
        playSound('like');
      }).catch(() => { /* ignore */ });
    }

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

  /**
   * Multi-emoji reaction toggle (added 2026-06-20).
   *
   * Optimistic update path:
   *   1. Snapshot the previous reaction state (wasReacted,
   *      wasType, prevBreakdown) so we can roll back on failure.
   *   2. Locally apply the new state: if the user previously
   *      reacted with the same emoji → remove (un-react);
   *      otherwise → swap to the new emoji.
   *   3. Recompute the optimistic breakdown (the +/- 1 per type).
   *   4. Fire the API call. On success we replace the optimistic
   *      snapshot with the server's authoritative counts (covers
   *      edge cases like concurrent reactions from other users).
   *      On failure we revert.
   */
  toggleReaction: async (postId, type) => {
    const post = get().posts.find((p) => p.id === postId);
    if (!post) return;

    const prevBreakdown: ReactionBreakdown = {
      LIKE: post.reactionBreakdown?.LIKE ?? 0,
      LOVE: post.reactionBreakdown?.LOVE ?? 0,
      HAHA: post.reactionBreakdown?.HAHA ?? 0,
      SAD:  post.reactionBreakdown?.SAD ?? 0,
      ANGRY: post.reactionBreakdown?.ANGRY ?? 0,
    };
    const prevMyType = post.myReaction ?? null;
    const willRemove = prevMyType === type;

    // Build the optimistic next state.
    const nextBreakdown: ReactionBreakdown = { ...prevBreakdown };
    if (prevMyType) nextBreakdown[prevMyType] = Math.max(0, nextBreakdown[prevMyType] - 1);
    if (!willRemove) nextBreakdown[type] = (nextBreakdown[type] ?? 0) + 1;

    const nextLikesCount = Object.values(nextBreakdown).reduce((a, b) => a + b, 0);
    const nextMyType: ReactionType | null = willRemove ? null : type;

    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              myReaction: nextMyType,
              // `isLiked` mirrors "did this user react at all" so
              // legacy renderers and the save popover still work.
              isLiked: !!nextMyType,
              likesCount: nextLikesCount,
              reactionBreakdown: nextBreakdown,
            }
          : p,
      ),
    }));

    // Play the "like" sound on every state change (both like and
    // unlike). The user explicitly asked for the chime to play even
    // when they themselves like their own posts.
    if (typeof window !== 'undefined') {
      import('@/lib/sound').then(({ playSound }) => {
        playSound('like');
      }).catch(() => { /* ignore */ });
    }

    try {
      const res = await socialApi.reactPost(postId, type);
      const data = res.data.data;
      // Replace the optimistic snapshot with the server's
      // authoritative numbers.
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                myReaction: data.myType,
                isLiked: !!data.myType,
                likesCount: data.likesCount,
                reactionBreakdown: data.breakdown,
              }
            : p,
        ),
      }));
    } catch {
      // Revert on error
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                myReaction: prevMyType,
                isLiked: !!prevMyType,
                likesCount: Object.values(prevBreakdown).reduce((a, b) => a + b, 0),
                reactionBreakdown: prevBreakdown,
              }
            : p,
        ),
      }));
    }
  },

  /**
   * Replace the reaction block on a post with a fresh snapshot
   * from the server (typically pushed by a socket event). We
   * don't touch `myReaction` here — the server doesn't know the
   * viewer's vote, only the aggregate — so this is for OTHER
   * users' reactions that just bumped the count.
   */
  updatePostReactions: (postId, next) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likesCount: next.likesCount,
              reactionBreakdown: next.breakdown,
              // We don't blindly overwrite myReaction — only when
              // the server tells us the viewer is no longer
              // reacted. (If the viewer's reaction changed on
              // another tab they need to refresh anyway.)
              isLiked: next.reacted ? true : p.isLiked,
            }
          : p,
      ),
    })),

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
   * Bookmark page helper. Removes a saved post from both the local
   * `savedPosts` list and the main feed. Always optimistically
   * updates the UI; the network call is best-effort.
   */
  unsavePost: async (postId) => {
    const wasSaved = true;
    set((s) => ({
      savedPosts: s.savedPosts.filter((p) => p.id !== postId),
      posts: s.posts.map((p) =>
        p.id === postId
          ? { ...p, isSaved: false, savesCount: Math.max(0, p.savesCount - 1) }
          : p
      ),
    }));
    try {
      await socialApi.unsavePost(postId);
    } catch {
      // Roll back the optimistic removal
      set((s) => ({
        posts: s.posts.map((p) =>
          p.id === postId
            ? { ...p, isSaved: wasSaved, savesCount: p.savesCount + 1 }
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
    set({
      composerContent: '',
      composerMedia: [],
      composerVisibility: 'PUBLIC',
      composerPoll: null,
      composerYouTubeUrl: '',
      composerMusicTrack: null,
      composerType: 'POST',
      composerVideoCategoryId: null,
      composerVideoShowInAll: true,
    }),

  setComposerPoll: (poll) => set({ composerPoll: poll }),
  setComposerYouTubeUrl: (url) => set({ composerYouTubeUrl: url }),
  setComposerType: (t) => set({ composerType: t }),
  setComposerVideoCategoryId: (id) => set({ composerVideoCategoryId: id }),
  setComposerVideoShowInAll: (v) => set({ composerVideoShowInAll: v }),
  setComposerMusicTrack: (track) => set({ composerMusicTrack: track }),

  submitPost: async () => {
    const { composerContent, composerMedia, composerVisibility, composerPoll, composerYouTubeUrl, composerType, composerMusicTrack, composerVideoCategoryId, composerVideoShowInAll } = get();
    if (!composerContent.trim() && composerMedia.length === 0 && !composerPoll) return null;

    set({ isPosting: true });
    try {
      const mediaPayload = composerMedia
        .filter((m) => m.url && m.progress === 100)
        .map((m, i) => ({
          type: m.type,
          url: m.url!,
          // Belt-and-braces: never ship browser-local object/data URLs —
          // they only resolve in this session, so persisting one bakes a
          // permanently broken poster into the post (2026-06 blob: incident).
          thumbnail: m.thumbnail && !/^(blob|data):/i.test(m.thumbnail) ? m.thumbnail : undefined,
          width: m.width,
          height: m.height,
          duration: m.duration,
          // BigInt can't cross JSON, so we ship size as a number
          // (or string for files > Number.MAX_SAFE_INTEGER) and
          // the service converts back to BigInt on insert.
          fileSize: m.file?.size,
          fileName: m.file?.name,
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
        youtubeUrl: (composerYouTubeUrl || '').trim() || undefined,
        // Phase 5 — Instagram-style music sticker with snippet
        // bounds. We send the canonical `postMusic` block so the
        // backend creates a PostMusic join row with the trim
        // values the user picked in MusicPickerModal. We still
        // pass the legacy `musicTrackId` / `musicStartSec`
        // fields too so any older backend code path keeps
        // working (the backend's createPost prefers postMusic
        // when both are present).
        musicTrackId: composerMusicTrack?.id,
        musicStartSec: composerMusicTrack?.startSec ?? 0,
        musicEndSec: composerMusicTrack?.endSec,
        postMusic: composerMusicTrack
          ? {
              songId: composerMusicTrack.id,
              startSec: composerMusicTrack.startSec ?? 0,
              endSec: composerMusicTrack.endSec,
            }
          : undefined,
        type: composerType,
        // Only attach a category to VIDEO posts.
        videoCategoryId: composerType === 'VIDEO' ? (composerVideoCategoryId ?? undefined) : undefined,
        // "Hiện ở mục Tất cả" — only sent for categorised VIDEO posts;
        // the backend forces true for every other combination anyway.
        showInAll:
          composerType === 'VIDEO' && composerVideoCategoryId
            ? composerVideoShowInAll
            : undefined,
      });

      // The backend returns an envelope { success, data, ... }.
      // `res.data` is that envelope, the actual post lives at
      // `res.data.data`. Reading the wrong level would push a
      // post-looking object with `id`/`createdAt` undefined
      // into the feed and crash every PostCard that tries to
      // render it. We defend against both shapes just in case.
      const envelope: any = res.data;
      const newPost: SocialPost = (envelope && envelope.data) ? envelope.data : envelope;
      set((s) => ({
        posts: [newPost, ...s.posts],
        isPosting: false,
      }));
      get().clearComposer();
      // Play the "post created" sound. Lazy-imported; the sound
      // service respects the user's per-kind toggle.
      if (typeof window !== 'undefined') {
        import('@/lib/sound').then(({ playSound }) => {
          playSound('post');
        }).catch(() => { /* ignore */ });
      }
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

  openCommentModal: (postId, focusCommentId) =>
    set({
      commentModalPostId: postId,
      commentModalFocusCommentId: focusCommentId ?? null,
    }),

  closeCommentModal: () =>
    set({ commentModalPostId: null, commentModalFocusCommentId: null }),

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
