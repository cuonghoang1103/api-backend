'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send,
  Repeat2, Trash2, Copy, Flag, Eye, Globe, Users, Lock,
  X, Youtube,
  Download, FileText, FileCode, FileArchive, FileSpreadsheet,
  CornerDownRight,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import { RenderContentWithCode } from '@/components/social/CodeBlock';
import PostPoll from '@/components/social/PostPoll';
import SocialSavePopover, {
  type SaveCollection,
} from '@/components/social/SocialSavePopover';
import SocialSavePopoverV2 from '@/components/social/SocialSavePopoverV2';
import { useAuthStore } from '@/store/authStore';
import { getMediaUrl } from '@/lib/utils';
import type { SocialPost, SocialComment, SocialMedia, ReactionType, ReactionBreakdown, FeedCollection, FeedPostSaveContext, FeedSaveResult } from '@/types/social';
import { REACTION_META, EMPTY_REACTION_BREAKDOWN } from '@/types/social';
import { socialKeys, type SocialFeedResponse } from '@/hooks/useSocialQueries';
import { formatRelative } from '@/lib/formatDate';
import { toast } from 'sonner';

interface PostCardProps {
  post: SocialPost;
}

const VISIBILITY_META: Record<string, { icon: any; label: string; color: string }> = {
  PUBLIC: { icon: Globe, label: 'Công khai', color: '#94a3b8' },
  FRIENDS: { icon: Users, label: 'Bạn bè', color: '#22c55e' },
  PRIVATE: { icon: Lock, label: 'Chỉ mình tôi', color: '#f59e0b' },
};

// ─── Multi-emoji reactions (added 2026-06-20) ─────────────────────
// Drives the reaction picker popover. `key` is the ReactionType
// the server now understands (LIKE / LOVE / HAHA / SAD / ANGRY).
// `meta` is the visual mapping (emoji + label + colour) sourced
// from types/social.ts so the new code and any future consumer
// share one source of truth.
const REACTION_KEYS: ReactionType[] = ['LIKE', 'LOVE', 'HAHA', 'SAD', 'ANGRY'];

const MAX_PREVIEW_LENGTH = 600;

// Matches the `activeColor` previously passed to ActionButton for
// the save state. Centralised here so the new bookmark button and
// the popover use exactly the same amber.
const NEON_AMBER = '#f59e0b';

interface PostCardProps {
  post: SocialPost;
  onToggleLike?: (postId: number) => Promise<void>;
  onToggleSave?: (postId: number) => Promise<void>;
  onDelete?: (postId: number) => Promise<void>;
}

export function PostCard({ post, onToggleLike, onToggleSave, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  // ─── Saved Collections popover (legacy single-folder, kept
  //      for callers that still wire it up). ───────────────────
  const [showSavePopover, setShowSavePopover] = useState(false);
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  // Cache of the user's existing collections. We hydrate this on
  // first popover open. Lazily loaded so the PostCard stays cheap
  // when no one opens the popover.
  const [cachedCollections, setCachedCollections] = useState<SaveCollection[]>([]);
  const [collectionsLoaded, setCollectionsLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const longPressTimer = useRef<any>(null);

  // ─── Saved Collections V2 popover (added 2026-06-20) ────────
  // Multi-folder variant powered by FeedCollection +
  // FeedSavedPost. State is separate from the legacy
  // single-folder popover above so we can A/B them or roll
  // back without touching unrelated code. The V2 popover
  // is the default for new saves; the legacy one stays as
  // a compatibility fallback for the existing single-folder
  // route.
  const [showSavePopoverV2, setShowSavePopoverV2] = useState(false);
  // Cached FeedCollection rows for the popover. Fetched once
  // per popover open. The parent (e.g. the /saved page) can
  // also pre-load this via `initialCollections`.
  const [collectionsV2, setCollectionsV2] = useState<FeedCollection[]>(
    () => ((post as any).__initialCollections as FeedCollection[] | undefined) ?? [],
  );
  // Pre-tick state: which collections this post is currently
  // saved into. Cached so reopening the popover is instant.
  const [saveContext, setSaveContext] = useState<FeedPostSaveContext | null>(
    () => (post as any).__saveContext as FeedPostSaveContext | null ?? null,
  );
  const [collectionsV2Loaded, setCollectionsV2Loaded] = useState(
    Boolean((post as any).__initialCollections) || Boolean((post as any).__saveContext),
  );
  const [collectionsV2Loading, setCollectionsV2Loading] = useState(false);
  // Whether the next click on the bookmark button should open
  // the V2 popover. We always open V2 for new code; the legacy
  // popover is left alone.
  const { toggleLike, toggleReaction, toggleSave, loadComments, commentsByPost, loadMoreComments, commentsHasMoreByPost, isLoadingComments, addOptimisticComment, deletePost } = useSocialStore();
  const { user: currentUser } = useAuthStore();
  const qc = useQueryClient();

  // ─── Query cache helpers (added 2026-06-20) ────────────────────
  // The feed page renders from the TanStack Query cache
  // (`useSocialFeed`), NOT from Zustand. Zustand mutations alone
  // never trigger a re-render of the cached data — we must
  // write to the cache directly too.
  //
  // TanStack Query v5 `setQueriesData({ queryKey: [...] })` uses
  // `matchQuery` with `exact=true` (default) for key comparison.
  // `partialMatchKey` checks object-keys but NOT array prefixes.
  // Result: `setQueriesData({ queryKey: ['social','feed'] })` does
  // NOT match a cache entry stored under
  // `['social','feed',{limit:20}]` — causing a silent no-op.
  //
  // Fix: use `qc.getQueryCache().findAll({ predicate })` to
  // iterate all cached queries and manually match on the feed
  // prefix. We also call `qc.invalidateQueries` afterward so the
  // next background refetch syncs with the server.

  /** Return all Query objects in the cache whose key starts with
   *  `['social','feed']`. This is the reliable way to match feed
   *  pages regardless of their pagination params. */
  const getFeedQueries = () =>
    qc.getQueryCache().getAll().filter(
      (q) => Array.isArray(q.queryKey) &&
             q.queryKey[0] === 'social' &&
             q.queryKey[1] === 'feed',
    );

  /** Snapshot the feed cache entries before a mutation. */
  const snapshotFeed = () =>
    getFeedQueries().map((q) => [q.queryKey as string[], q.state.data as SocialFeedResponse | undefined]);

  /** Patch a single post in all cached feed queries. Calls
   *  `invalidateFeed` afterward so the next refetch reconciles. */
  const patchFeed = (postId: number, updater: (p: SocialPost) => SocialPost) => {
    for (const q of getFeedQueries()) {
      const data = q.state.data as SocialFeedResponse | undefined;
      if (!data || !Array.isArray(data.data)) continue;
      const next = data.data.map((p) => (p.id === postId ? updater(p) : p));
      if (next.some((p, i) => p !== data.data[i])) {
        q.setState({ data: { ...data, data: next } });
      }
    }
    invalidateFeed();
  };

  /** Restore the snapshot after a failed mutation. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restoreSnapshot = (snap: any) => {
    if (!snap) return;
    for (const [key, data] of snap) {
      const q = qc.getQueryCache().getAll().find(
        (q) => JSON.stringify(q.queryKey) === JSON.stringify(key),
      );
      if (q && data !== undefined) q.setState({ data });
    }
  };

  /** Drop a post from all cached feed queries (delete). */
  const removePostFromCache = (postId: number) => {
    for (const q of getFeedQueries()) {
      const data = q.state.data as SocialFeedResponse | undefined;
      if (!data || !Array.isArray(data.data)) continue;
      const next = data.data.filter((p) => p.id !== postId);
      if (next.length !== data.data.length) {
        q.setState({ data: { ...data, data: next } });
      }
    }
    invalidateFeed();
  };

  /** Invalidate all social queries so the next background refetch
   *  picks up authoritative data from the server. */
  const invalidateFeed = () =>
    qc.invalidateQueries({ queryKey: socialKeys.all });



  const comments = commentsByPost[post.id] || [];
  const hasMoreComments = commentsHasMoreByPost[post.id] ?? false;
  const loadingComments = isLoadingComments[post.id] ?? false;

  // Permission flags. We defend against missing `post.author` so a
  // malformed post object doesn't crash the whole card (this was
  // a real crash — "Cannot read properties of undefined (reading
  // 'id')" — visible in production console). All comparisons
  // short-circuit when the author or current user is missing.
  const authorId = (post as any)?.author?.id;
  const isAuthor = authorId != null && (currentUser as any)?.id === authorId;
  const userRoles = (currentUser as any)?.roles || [];
  const isAdmin = userRoles.some((r: string) =>
    ['admin', 'ADMIN', 'ROLE_ADMIN', 'SUPER_ADMIN'].includes(r)
  );
  const canDelete = isAuthor || isAdmin;
  const visMeta = VISIBILITY_META[post.visibility] || VISIBILITY_META.PUBLIC;
  const VisIcon = visMeta.icon;
  // Defensive defaults. A backend response that lacks `content`
  // (e.g. a stale cached payload) would otherwise crash on
  // `.length`. We coerce to '' so the rest of the card keeps
  // working — the user just sees an empty post body.
  const safeContent = typeof post.content === 'string' ? post.content : '';
  const safeMedia = Array.isArray(post.media) ? post.media : [];
  const safePoll = post.poll ?? null;
  const safeLikesCount = typeof post.likesCount === 'number' ? post.likesCount : 0;
  const safeCommentsCount = typeof post.commentsCount === 'number' ? post.commentsCount : 0;
  const safeSavesCount = typeof post.savesCount === 'number' ? post.savesCount : 0;
  const safeIsLiked = !!post.isLiked;
  const safeIsSaved = !!post.isSaved;
  const contentLong = safeContent.length > MAX_PREVIEW_LENGTH;
  const visibleContent = expanded || !contentLong
    ? safeContent
    : safeContent.slice(0, MAX_PREVIEW_LENGTH).trimEnd() + '…';

  // Cleanup the long-press timer on unmount so we don't leak
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, []);

  const handleToggleComments = () => {
    if (!showComments) {
      setShowComments(true);
      loadComments(post.id);
    } else {
      setShowComments(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const tempId = Date.now();
    const optimisticComment: SocialComment = {
      id: tempId,
      postId: post.id,
      content: commentText,
      likesCount: 0,
      repliesCount: 0,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 0,
        username: 'You',
        fullName: 'You',
        avatarUrl: null,
      },
      isLiked: false,
      replies: [],
    };
    addOptimisticComment(post.id, optimisticComment);
    setCommentText('');

    try {
      await socialApi.createComment({ postId: post.id, content: commentText });
    } catch {
      // optimistic already added, ignore for now
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (platform: string) => {
    setShowShareMenu(false);
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${window.location.origin}/social/post/${post.id}`);
      toast.success('Đã sao chép liên kết');
      return;
    }
    if (platform === 'repost') {
      // Retweet-style share: create a new post with the same content
      // prefixed by "🔁 Repost from @author". We keep the link back
      // to the original so credit is preserved.
      const link = `${window.location.origin}/social/post/${post.id}`;
      const text = `🔁 Repost từ @${authorObj?.username ?? 'user'}\n\n${safeContent.slice(0, 280)}`;
      const composer = document.querySelector<HTMLTextAreaElement>('textarea[placeholder*="nghĩ"]');
      if (composer) {
        composer.value = text;
        composer.dispatchEvent(new Event('input', { bubbles: true }));
        composer.focus();
        composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toast.success('Đã điền vào khung soạn — bấm "Đăng" để repost');
      } else {
        navigator.clipboard.writeText(`${text}\n\n${link}`);
        toast.success('Đã sao chép nội dung repost');
      }
      return;
    }
    socialApi.sharePost(post.id, platform).catch(() => {});
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(safeContent.slice(0, 100))}&url=${encodeURIComponent(window.location.origin + '/social/post/' + post.id)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/social/post/' + post.id)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xoá bài viết này?')) return;
    // Snapshot both TQ cache and Zustand for rollback on error.
    const snapshot = snapshotFeed();
    const prevPosts = useSocialStore.getState().posts;
    const prevSaved = useSocialStore.getState().savedPosts;

    // ─── Optimistic UI — update BOTH stores immediately so the card
    // disappears INSTANTLY without waiting for the network round-trip.
    removePostFromCache(post.id);
    useSocialStore.setState((s) => ({
      posts: s.posts.filter((p) => p.id !== post.id),
      savedPosts: s.savedPosts.filter((p) => p.id !== post.id),
    }));

    try {
      if (onDelete) {
        await onDelete(post.id);
      } else {
        await deletePost(post.id);
      }
      toast.success('Đã xoá bài viết');
      setShowMoreMenu(false);
    } catch (err: any) {
      // Restore both TQ cache AND Zustand on failure.
      restoreSnapshot(snapshot);
      useSocialStore.setState({ posts: prevPosts, savedPosts: prevSaved });
      toast.error(err?.response?.data?.message || 'Xoá thất bại');
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await socialApi.likeComment(commentId);
    } catch {
      // ignore
    }
  };

  /**
   * Delete a comment. We hit the backend directly here (not through
   * the store) because the optimistic list update is bound to the
   * specific PostCard instance — refetching the whole comment list
   * on every delete would re-trigger the cursor pagination.
   */
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Xoá bình luận này?')) return;
    try {
      await socialApi.deleteComment(commentId);
      setShowComments(false);
      // Refresh feed to update comment count
      loadComments(post.id, true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xoá bình luận thất bại');
    }
  };

  /**
   * Post a reply to a top-level comment.
   *   - parentId: id of the comment being replied to
   *   - content: the full text (including the leading
   *     "@display " that CommentItem pre-filled)
   *
   * We extract the @mention ids from `content` against the
   * usernames we know about (currently the only candidates
   * are the users appearing in the comments of this post).
   * For v1 we just send an empty mentions array and let the
   * notification service do best-effort from the @string
   * itself; the mentions column on the row is opt-in
   * metadata. A future iteration can resolve names → ids via
   * a /api/users/search endpoint.
   */
  const handleReplyComment = async (parentId: number, content: string) => {
    // Best-effort: try to find an @username in the content
    // and resolve it to a user id by scanning the currently
    // loaded comments. If we can't find it, we send an empty
    // array — the comment still saves, just without the
    // mention notification.
    const match = content.match(/@([\p{L}\p{N}_.]{1,30})/u);
    let mentionId: number | null = null;
    if (match) {
      const target = match[1].toLowerCase();
      for (const c of comments) {
        const u = (c as any).user;
        if (!u) continue;
        if (u.username?.toLowerCase() === target || u.displayName?.toLowerCase() === target || u.fullName?.toLowerCase() === target) {
          mentionId = u.id;
          break;
        }
        if (Array.isArray(c.replies)) {
          for (const r of c.replies) {
            const ru = (r as any).user;
            if (ru && (ru.username?.toLowerCase() === target || ru.displayName?.toLowerCase() === target || ru.fullName?.toLowerCase() === target)) {
              mentionId = ru.id;
              break;
            }
          }
          if (mentionId) break;
        }
      }
    }

    try {
      await socialApi.createComment({
        postId: post.id,
        parentId,
        content,
        mentions: mentionId ? [mentionId] : undefined,
      });
      // Refresh the comment list so the new reply shows up
      // under the parent.
      loadComments(post.id, true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gửi trả lời thất bại');
      throw err; // let CommentItem re-enable its submit button
    }
  };

  // Long-press to show reactions panel
  const startLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => setShowReactions(true), 450);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // ─── Multi-emoji reactions (added 2026-06-20) ──────────────────
  // Click on the picker (long-press or hover) → call
  // `toggleReaction(type)`. The store handles optimistic update
  // and the round-trip; this is just a thin proxy.
  //
  // We ALSO patch the TanStack Query cache in parallel because
  // the /social page renders from the cache, not the Zustand
  // store. Without this the emoji never appears on the card
  // even though the API call succeeds.
  const handleReact = (type: ReactionType) => {
    setShowReactions(false);

    // Snapshot for rollback if the API call fails.
    const snapshot = snapshotFeed();

    // ─── Optimistic state update ──────────────────────────────────
    // Compute the next breakdown from the current row, then write
    // it directly to Zustand AND patch the TanStack Query cache
    // so both the Zustand-driven render AND any TQ-driven render
    // stay in sync.
    const prevBreakdown: ReactionBreakdown = {
      LIKE: post.reactionBreakdown?.LIKE ?? 0,
      LOVE: post.reactionBreakdown?.LOVE ?? 0,
      HAHA: post.reactionBreakdown?.HAHA ?? 0,
      SAD:  post.reactionBreakdown?.SAD  ?? 0,
      ANGRY:post.reactionBreakdown?.ANGRY?? 0,
    };
    const prevMyType: ReactionType | null = (post as any).myReaction ?? null;
    const willRemove = prevMyType === type;
    const nextBreakdown: ReactionBreakdown = { ...prevBreakdown };
    if (prevMyType) nextBreakdown[prevMyType] = Math.max(0, nextBreakdown[prevMyType] - 1);
    if (!willRemove) nextBreakdown[type] = (nextBreakdown[type] ?? 0) + 1;
    const nextLikesCount = Object.values(nextBreakdown).reduce((a, b) => a + b, 0);
    const nextMyType: ReactionType | null = willRemove ? null : type;

    // 1. Patch TQ cache (covers TQ-driven feed renders)
    patchFeed(post.id, (p) => ({
      ...p,
      myReaction: nextMyType,
      isLiked: !!nextMyType,
      likesCount: nextLikesCount,
      reactionBreakdown: nextBreakdown,
    }));

    // 2. Update Zustand directly (covers Zustand-driven renders —
    //    PostCard reads from the Zustand store, not TQ)
    useSocialStore.setState((s) => ({
      posts: s.posts.map((p) =>
        p.id === post.id
          ? { ...p, myReaction: nextMyType, isLiked: !!nextMyType, likesCount: nextLikesCount, reactionBreakdown: nextBreakdown }
          : p
      ),
    }));

    // 3. Fire API — on failure revert both TQ cache and Zustand
    toggleReaction(post.id, type).catch(() => {
      restoreSnapshot(snapshot);
      // Revert Zustand too
      useSocialStore.setState((s) => ({
        posts: s.posts.map((p) =>
          p.id === post.id
            ? { ...p, myReaction: prevMyType, isLiked: !!prevMyType, likesCount: Object.values(prevBreakdown).reduce((a, b) => a + b, 0), reactionBreakdown: prevBreakdown }
            : p
        ),
      }));
    });
  };

  // ─── Save toggle (added 2026-06-20) ────────────────────────────
  // The page renders from Zustand AND TQ cache. We must update
  // BOTH so the bookmark icon flips immediately regardless of which
  // store the current page reads from.
  const handleSave = async () => {
    const snapshot = snapshotFeed();
    const wasSaved = post.isSaved;
    const willBeSaved = !wasSaved;
    const nextSavesCount = Math.max(0, (post.savesCount ?? 0) + (wasSaved ? -1 : 1));

    // 1. Patch TQ cache
    patchFeed(post.id, (p) => ({
      ...p,
      isSaved: willBeSaved,
      savesCount: nextSavesCount,
    }));

    // 2. Update Zustand directly
    useSocialStore.setState((s) => ({
      posts: s.posts.map((p) =>
        p.id === post.id ? { ...p, isSaved: willBeSaved, savesCount: nextSavesCount } : p
      ),
    }));

    try {
      if (onToggleSave) {
        await onToggleSave(post.id);
      } else {
        await toggleSave(post.id);
      }
    } catch {
      restoreSnapshot(snapshot);
      // Revert Zustand
      useSocialStore.setState((s) => ({
        posts: s.posts.map((p) =>
          p.id === post.id ? { ...p, isSaved: wasSaved, savesCount: Math.max(0, nextSavesCount + (wasSaved ? 1 : -1)) } : p
        ),
      }));
    }
  };

  // The viewer's current reaction. Drives the heart icon
  // colour + the label below the count.
  const myReaction = (post as any).myReaction as ReactionType | null | undefined;
  const reactionColor = myReaction ? REACTION_META[myReaction].color : '#94a3b8';
  const reactionEmoji = myReaction ? REACTION_META[myReaction].emoji : null;
  const breakdown = (post as any).reactionBreakdown as
    | Record<ReactionType, number>
    | undefined;
  // Count of "non-zero" reaction types so we can show the
  // emoji stack: a post with only 👍 shows just 👍, but a post
  // with 👍 + ❤️ shows both.
  const activeReactions = REACTION_KEYS.filter(
    (k) => (breakdown?.[k] ?? 0) > 0,
  );

  // ─── Saved Collections: handlers (added 2026-06-20) ────────────
  // When the popover opens for the first time, fetch the user's
  // existing collections. We cache the result for the rest of the
  // session so navigating to /saved and back is instant. The list
  // is fetched via the new /feed/collections endpoint; legacy
  // /social/saves/folders still works as a fallback so we don't
  // break if the new route hasn't been deployed yet.
  const ensureCollectionsLoaded = async () => {
    if (collectionsLoaded) return;
    try {
      const res = await socialApi.listCollections();
      const data = res.data?.data;
      if (data && Array.isArray(data.collections)) {
        setCachedCollections(data.collections as SaveCollection[]);
        setCollectionsLoaded(true);
      }
    } catch {
      try {
        // Fallback to legacy endpoint
        const res = await socialApi.getSaveFolders();
        const folders = (res.data?.data?.folders ?? []) as SaveCollection[];
        setCachedCollections(folders);
        setCollectionsLoaded(true);
      } catch {
        // ignore — empty list will be shown
      }
    }
  };

  /**
   * Called by SocialSavePopover when the user picks a collection
   * or hits "Bỏ lưu". We delegate to the existing `toggleSave`
   * action from the social store so the optimistic UI, the
   * `savedFolder` field on the post, and the saves count all stay
   * consistent with the rest of the app.
   *
   * - `folder === null` + `remove === false`: save into the
   *   uncategorised bucket (legacy `toggleSave(id)` semantics).
   * - `folder === 'X'` + `remove === false`: save into "X".
   * - `remove === true`: unsave entirely.
   */
  const handleSaveCommit = async (folder: string | null, remove: boolean) => {
    // Optimistic cache patch — the popover always saves INTO a
    // folder (or removes). We patch `isSaved` + `savesCount` so
    // the bookmark icon reflects the action immediately.
    const snapshot = snapshotFeed();
    const wasSaved = post.isSaved;
    patchFeed(post.id, (p) => ({
      ...p,
      isSaved: remove ? false : true,
      savedFolder: remove ? null : folder ?? p.savedFolder ?? null,
      savesCount: Math.max(0, (p.savesCount ?? 0) + ((remove || wasSaved) ? -1 : 1)),
    }));
    try {
      if (remove) {
        await (onToggleSave ? onToggleSave(post.id) : toggleSave(post.id));
      } else {
        await toggleSave(post.id, folder ?? undefined);
      }
    } catch (err: any) {
      restoreSnapshot(snapshot);
      toast.error(err?.response?.data?.message || 'Lưu bài viết thất bại');
    }
  };

  // ─── Saved Collections V2 handlers (added 2026-06-20) ────────
  // Lazy-fetch the user's collections + the post's current
  // save context. We re-fetch every time the popover opens
  // so the popover is always fresh (counts, new folders
  // created in another tab, etc.).
  const ensureV2Loaded = async () => {
    setCollectionsV2Loading(true);
    try {
      const [listRes, ctxRes] = await Promise.all([
        socialApi.listCollectionsV2(),
        socialApi.getPostSaveContext(post.id),
      ]);
      const list = (listRes as any)?.data?.data;
      const ctx = (ctxRes as any)?.data?.data;
      if (Array.isArray(list?.collections)) {
        setCollectionsV2(list.collections);
      }
      if (ctx) setSaveContext(ctx);
      setCollectionsV2Loaded(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tải bộ sưu tập thất bại');
    } finally {
      setCollectionsV2Loading(false);
    }
  };

  /**
   * Multi-collection commit. The popover tells us the new
   * set of collection ids the user wants this post in; we
   * hit `/feed/save-post-v2`, patch the TQ cache + Zustand,
   * and refresh the context.
   */
  const handleCommitV2 = async (collectionIds: number[]) => {
    const snapshot = snapshotFeed();
    const prevPosts = useSocialStore.getState().posts;
    const prevSaved = useSocialStore.getState().savedPosts;
    const wasSaved = post.isSaved;
    const willBeSaved = collectionIds.length > 0;
    const prevSavesCount = post.savesCount ?? 0;
    const nextSavesCount = wasSaved === willBeSaved
      ? prevSavesCount
      : willBeSaved ? prevSavesCount + 1 : Math.max(0, prevSavesCount - 1);

    // ─── Optimistic UI — update TQ cache AND Zustand immediately
    patchFeed(post.id, (p) => ({
      ...p,
      isSaved: willBeSaved,
      savesCount: nextSavesCount,
    }));
    useSocialStore.setState((s) => ({
      posts: s.posts.map((p) =>
        p.id === post.id ? { ...p, isSaved: willBeSaved, savesCount: nextSavesCount } : p
      ),
      savedPosts: willBeSaved
        ? (() => {
            const without = s.savedPosts.filter((p) => p.id !== post.id);
            return [post, ...without];
          })()
        : s.savedPosts.filter((p) => p.id !== post.id),
    }));

    try {
      const res = await socialApi.savePostToCollections(post.id, collectionIds);
      const data = (res as any)?.data?.data as FeedSaveResult | undefined;

      // Refresh save context from server.
      const ctxRes = await socialApi.getPostSaveContext(post.id);
      const freshCtx = (ctxRes as any)?.data?.data as FeedPostSaveContext | undefined;
      if (freshCtx) setSaveContext(freshCtx);

      // Refresh collections list with updated counts.
      const listRes = await socialApi.listCollectionsV2();
      const listData = (listRes as any)?.data?.data;
      if (Array.isArray(listData?.collections)) {
        setCollectionsV2(listData.collections);
      }
    } catch (err: any) {
      // Revert both TQ cache AND Zustand on failure.
      restoreSnapshot(snapshot);
      useSocialStore.setState({ posts: prevPosts, savedPosts: prevSaved });
      toast.error(err?.response?.data?.message || 'Lưu bài viết thất bại');
      throw err;
    }
  };

  /** Inline-create a collection. The new row is appended to
   *  the local list so the popover shows it immediately. */
  const handleCreateV2 = async (name: string): Promise<FeedCollection | null> => {
    try {
      const res = await socialApi.createCollectionV2(name);
      const created = (res as any)?.data?.data as FeedCollection | undefined;
      if (!created) return null;
      // Optimistic prepend. Server returns id + sortOrder.
      setCollectionsV2((prev) => {
        if (prev.some((c) => c.id === created.id)) return prev;
        return [...prev, created];
      });
      return created;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tạo bộ sưu tập thất bại');
      return null;
    }
  };

  /** Open the V2 popover. Refreshes the data each time. */
  const openSavePopoverV2 = async () => {
    setShowSavePopoverV2(true);
    void ensureV2Loaded();
  };

  // Bookmark button click: open the V2 multi-collection popover.
  // The popover's own toggleCollection → handleCommitV2 path manages
  // all optimistic UI and API calls. We no longer delegate to
  // onToggleSave prop here — PostCard owns the entire save UX.
  const handleSaveClick = async () => {
    if (showSavePopoverV2) {
      setShowSavePopoverV2(false);
      return;
    }
    await openSavePopoverV2();
  };

  // Author info can be missing on a malformed post (e.g. an
  // optimistic update that hasn't received the server echo yet).
  // We always render *something* safe so the rest of the card
  // doesn't crash. The previous code assumed `post.author` was
  // present, which produced the "Cannot read properties of
  // undefined (reading 'id')" runtime error.
  const authorObj = (post as any)?.author ?? null;
  const authorAvatar = authorObj?.avatarUrl
    ? authorObj.avatarUrl
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorObj?.username ?? 'user'}`;
  const authorDisplay =
    authorObj?.displayName || authorObj?.fullName || authorObj?.username || 'Người dùng';

  return (
    <article
      className="group relative overflow-hidden rounded-3xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent)',
        }}
      />

      <div className="p-5">
        {/* Author row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar — clicking goes to the public profile. Wrapped
                in a Link so the entire avatar+name cluster is one
                affordance; we add a `stopPropagation` so the card
                body itself doesn't get a click-through. */}
            <Link
              href={isAuthor ? '/profile' : `/profile/${authorId ?? ''}`}
              className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-violet-500/20 transition-transform hover:scale-105"
              aria-label={`Xem trang cá nhân của ${authorDisplay}`}
            >
              <img
                src={authorAvatar}
                alt={authorDisplay}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </Link>

            {/* Name + time + visibility */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={isAuthor ? '/profile' : `/profile/${authorId ?? ''}`}
                  className="font-semibold text-white truncate hover:underline"
                  title={authorDisplay}
                >
                  {authorDisplay}
                </Link>
                {isAdmin && !isAuthor && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.3)' }}
                  >
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs flex-wrap" style={{ color: '#64748b' }}>
                <span>@{authorObj?.username ?? 'user'}</span>
                <span style={{ color: '#334155' }}>·</span>
                <span>{formatRelative(post.createdAt)}</span>
                <span style={{ color: '#334155' }}>·</span>
                <span className="inline-flex items-center gap-0.5" style={{ color: visMeta.color }} title={visMeta.label}>
                  <VisIcon className="h-3 w-3" />
                </span>
                {post.locationName && (
                  <>
                    <span style={{ color: '#334155' }}>·</span>
                    <span>📍 {post.locationName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* More menu */}
          <div className="relative flex-shrink-0">
            <button
              className="rounded-xl p-2 transition-colors"
              style={{ color: '#64748b' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu(!showMoreMenu);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-2xl py-1"
                    style={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
                  >
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-white/[0.05] hover:text-text-primary transition-colors"
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/social/post/${post.id}`); setShowMoreMenu(false); toast.success('Đã sao chép liên kết'); }}
                    >
                      <Copy className="h-3.5 w-3.5" /> Sao chép liên kết
                    </button>
                    {canDelete && (
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        onClick={handleDelete}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {isAuthor ? 'Xoá bài viết' : 'Xoá (quyền admin)'}
                      </button>
                    )}
                    {!isAuthor && (
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-white/[0.05] transition-colors"
                        onClick={() => { toast.info('Đã gửi báo cáo'); setShowMoreMenu(false); }}
                      >
                        <Flag className="h-3.5 w-3.5" /> Báo cáo
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content with "See more" */}
        <div className="mt-3">
          <RenderContentWithCode content={visibleContent} />
          {contentLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs font-medium text-neon-violet hover:text-neon-indigo transition-colors"
            >
              {expanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </div>

        {/* Poll */}
        {safePoll && <PostPoll postId={post.id} poll={safePoll} />}

        {/* Media */}
        {safeMedia.length > 0 && (
          <MediaGrid media={safeMedia} />
        )}

        {/* YouTube embed — shown after media if a URL is attached.
            Renders the official youtube-nocookie iframe so the post
            works with strict privacy settings. */}
        {post.youtubeUrl && (
          <YouTubeEmbed url={post.youtubeUrl} />
        )}

        {/* Action bar */}
        <div
          className="mt-4 flex items-center gap-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}
        >
          {/* ─── Like button wrapper — onMouseLeave HERE (not on the button)
              prevents the popover from closing when the mouse travels
              from the button edge to the popover. The popover closes
              only when the cursor leaves the entire button+popover
              zone (the wrapper div). ─── */}
        <div
          className="relative"
          onMouseLeave={() => {
            cancelLongPress();
            setShowReactions(false);
          }}
        >
          <button
            onClick={() => handleReact('LIKE')}
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            className="group inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{ color: myReaction ? reactionColor : '#94a3b8' }}
            onMouseEnter={(e) => { if (!myReaction) e.currentTarget.style.background = 'rgba(236,72,153,0.08)'; }}
          >
              {myReaction ? (
                // Render the viewer's current reaction emoji
                // (could be any of the 5 types). It scales up
                // on press just like the old heart.
                <span
                  className="text-[15px] leading-none transition-transform group-active:scale-125"
                  aria-label={REACTION_META[myReaction].label}
                >
                  {reactionEmoji}
                </span>
              ) : (
                <Heart
                  size={16}
                  fill="none"
                  className="transition-transform group-active:scale-125"
                />
              )}
              <span className="tabular-nums">{safeLikesCount}</span>
            </button>
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 mb-0 z-50 flex flex-col items-start gap-0 pointer-events-auto">
                  {/* Invisible hit-area: a tall transparent div that fills
                      the gap between the button and the emoji row so the
                      cursor can never "fall through" while moving up.
                      pointer-events-none so it never blocks clicks. */}
                  <div
                    className="w-full cursor-default"
                    style={{ height: '12px', pointerEvents: 'none' }}
                  />
                  {/* Emoji picker row */}
                  <div
                    className="relative z-50 flex gap-1 rounded-2xl p-1.5"
                    style={{
                      pointerEvents: 'auto',
                      background: 'rgba(15,15,25,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {REACTION_KEYS.map((k) => {
                      const r = REACTION_META[k];
                      const isMine = myReaction === k;
                      return (
                        <button
                          key={k}
                          onClick={() => handleReact(k)}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.4) translateY(-4px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = isMine ? 'scale(1.15)' : 'scale(1)'; }}
                          className="text-xl transition-transform px-1.5"
                          title={r.label}
                          style={{
                            transform: isMine ? 'scale(1.15)' : 'scale(1)',
                            filter: isMine ? `drop-shadow(0 0 6px ${r.color})` : undefined,
                          }}
                        >
                          {r.emoji}
                        </button>
                      );
                    })}
                  </div>
                  {/* Emoji stack — now INSIDE AnimatePresence so no
                      gap exists between button and popover. */}
                  {activeReactions.length > 0 && safeLikesCount > 0 && (
                    <div className="flex items-center gap-1 pl-1.5">
                      <div className="flex -space-x-1">
                        {activeReactions.slice(0, 3).map((k) => (
                          <span
                            key={k}
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] leading-none"
                            style={{
                              background: 'rgba(15,15,25,0.95)',
                              border: '1px solid rgba(255,255,255,0.1)',
                            }}
                            title={REACTION_META[k].label}
                          >
                            {REACTION_META[k].emoji}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 tabular-nums">
                        {safeLikesCount}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comment */}
          <ActionButton
            active={showComments}
            activeColor="#8B5CF6"
            icon={<MessageCircle size={16} fill={showComments ? '#8B5CF6' : 'none'} />}
            count={safeCommentsCount}
            label="Bình luận"
            onClick={handleToggleComments}
          />

          {/* Repost */}
          <ActionButton
            active={false}
            activeColor="#22c55e"
            icon={<Repeat2 size={16} />}
            count={0}
            label="Repost"
            onClick={() => handleShare('repost')}
          />

          {/* Save — opens the Saved Collections popover on click.
              The button's own ref is forwarded so the popover can
              anchor itself below it. We keep the ActionButton
              wrapper so the visual style is identical to before. */}
          <button
            ref={saveButtonRef}
            onClick={handleSaveClick}
            className="group flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-colors"
            style={{
              color: safeIsSaved ? NEON_AMBER : '#64748b',
              background: safeIsSaved ? 'rgba(245,158,11,0.08)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!safeIsSaved) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
            onMouseLeave={(e) => {
              if (!safeIsSaved) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }
            }}
            title={safeIsSaved ? `Đã lưu${post.savedFolder ? ` vào "${post.savedFolder}"` : ''}` : 'Lưu bài viết'}
            aria-label={safeIsSaved ? 'Đã lưu bài viết' : 'Lưu bài viết'}
            aria-haspopup="dialog"
            aria-expanded={showSavePopover}
          >
            <Bookmark
              size={16}
              fill={safeIsSaved ? NEON_AMBER : 'none'}
              className="transition-transform group-active:scale-125"
            />
            {safeSavesCount > 0 && <span className="tabular-nums">{safeSavesCount}</span>}
          </button>
          <SocialSavePopover
            postId={post.id}
            currentFolder={post.savedFolder ?? null}
            isSaved={safeIsSaved}
            collections={cachedCollections}
            onCommit={handleSaveCommit}
            anchorRef={saveButtonRef}
            open={showSavePopover}
            onClose={() => setShowSavePopover(false)}
          />
          {/* V2 multi-collection popover (added 2026-06-20).
              Wired alongside the legacy one; the bookmark
              button now opens this one. The legacy remains
              for callers that explicitly toggle
              `showSavePopover` themselves. */}
          <SocialSavePopoverV2
            postId={post.id}
            collections={collectionsV2}
            context={saveContext}
            loading={collectionsV2Loading}
            onCommit={handleCommitV2}
            onCreateCollection={handleCreateV2}
            anchorRef={saveButtonRef}
            open={showSavePopoverV2}
            onClose={() => setShowSavePopoverV2(false)}
          />

          {/* Share menu */}
          <div className="relative ml-auto">
            <ActionButton
              active={showShareMenu}
              activeColor="#06b6d4"
              icon={<Share2 size={16} />}
              label="Chia sẻ"
              onClick={() => setShowShareMenu(!showShareMenu)}
            />
            <AnimatePresence>
              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowShareMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-2xl py-1"
                    style={{
                      background: 'rgba(15,15,25,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {[
                      { key: 'copy', label: 'Sao chép liên kết' },
                      { key: 'twitter', label: 'Chia sẻ lên X' },
                      { key: 'facebook', label: 'Chia sẻ lên Facebook' },
                      { key: 'repost', label: 'Repost về trang cá nhân' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors"
                        style={{ color: '#94a3b8' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.color = '#e2e8f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }}
                        onClick={() => handleShare(item.key)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div
                className="space-y-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}
              >
                {loadingComments && comments.length === 0 ? (
                  <CommentSkeleton />
                ) : comments.length === 0 ? (
                  <p className="py-2 text-center text-xs" style={{ color: '#475569' }}>
                    Chưa có bình luận nào. Hãy là người đầu tiên!
                  </p>
                ) : (
                  <>
                    {comments.map((comment) => {
                      const isCommentAuthor = (currentUser as any)?.id === comment.user?.id;
                      const canDeleteComment = isCommentAuthor || isAdmin;
                      return (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          onLike={() => handleLikeComment(comment.id)}
                          onLikeComment={handleLikeComment}
                          onDelete={canDeleteComment ? () => handleDeleteComment(comment.id) : undefined}
                          onDeleteComment={handleDeleteComment}
                          onReply={handleReplyComment}
                          canDelete={canDeleteComment}
                          postId={post.id}
                        />
                      );
                    })}
                    {hasMoreComments && (
                      <button
                        className="w-full rounded-xl py-2 text-xs font-medium transition-colors"
                        style={{ color: '#8B5CF6' }}
                        onClick={() => loadMoreComments(post.id)}
                      >
                        Xem thêm bình luận
                      </button>
                    )}
                  </>
                )}

                {/* Comment input */}
                <form onSubmit={handleSubmitComment} className="mt-3 flex items-center gap-2">
                  <div
                    className="flex flex-1 items-center gap-2 rounded-2xl px-4 py-2.5"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: '#e2e8f0' }}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isSubmitting}
                      className="flex-shrink-0 rounded-xl p-1.5 transition-all disabled:opacity-40"
                      style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

// ─── Media Grid ───────────────────────────────────────────────────────────────

function MediaGrid({ media }: { media: SocialMedia[] }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const visual = media.filter((m) => m.type !== 'FILE');
  const files = media.filter((m) => m.type === 'FILE');

  if (visual.length === 0) {
    // Pure file post (no image / video). Hand off to the file list
    // renderer below so we don't end up rendering an empty grid.
    return (
      <>
        <FileAttachmentList media={files} />
      </>
    );
  }

  if (visual.length === 1) {
    return (
      <div className="mt-3">
        <MediaItem
          item={visual[0]}
          onClick={() => setLightboxSrc(getMediaUrl(visual[0].url, visual[0].url))}
          autoPlayEnabled={visual[0].type === 'VIDEO'}
        />
        {files.length > 0 && (
          <div className="mt-2">
            <FileAttachmentList media={files} />
          </div>
        )}
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </div>
    );
  }

  const gridClass =
    visual.length === 2
      ? 'grid-cols-2'
      : visual.length === 3
      ? 'grid-cols-2'
      : 'grid-cols-2';

  return (
    <div className="mt-3">
      <div className={`grid ${gridClass} gap-1.5 rounded-2xl overflow-hidden`}>
        {visual.slice(0, 4).map((item, i) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-xl"
            style={{
              aspectRatio: '1',
              gridColumn: i === 0 && visual.length === 3 ? 'span 2' : 'span 1',
            }}
          >
            <MediaItem
              item={item}
              onClick={() => setLightboxSrc(getMediaUrl(item.url, item.url))}
            />
            {i === 3 && visual.length > 4 && (
              <div
                className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
              >
                +{visual.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
      {files.length > 0 && (
        <div className="mt-2">
          <FileAttachmentList media={files} />
        </div>
      )}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}

// ─── File Attachment List ─────────────────────────────────────────────
// Renders one row per FILE attachment with a download button. The
// icon + colour are picked from the file extension so a glance is
// enough to tell archives from source files from docs.

function fileIconForPostCard(name: string): { Icon: any; color: string } {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext)) {
    return { Icon: FileArchive, color: '#f59e0b' };
  }
  if (['md', 'txt', 'log'].includes(ext)) {
    return { Icon: FileText, color: '#94a3b8' };
  }
  if (['pdf'].includes(ext)) {
    return { Icon: FileText, color: '#ef4444' };
  }
  if (['doc', 'docx', 'odt'].includes(ext)) {
    return { Icon: FileText, color: '#3b82f6' };
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return { Icon: FileSpreadsheet, color: '#22c55e' };
  }
  if (['js', 'jsx', 'ts', 'tsx', 'json', 'py', 'go', 'rs', 'java', 'rb', 'php', 'css', 'html', 'yml', 'yaml'].includes(ext)) {
    return { Icon: FileCode, color: '#a78bfa' };
  }
  return { Icon: FileText, color: '#64748b' };
}

function humanFileSizePostCard(bytes?: number | string | bigint | null): string {
  if (bytes == null) return '';
  const n = typeof bytes === 'string' ? Number(bytes) : typeof bytes === 'bigint' ? Number(bytes) : bytes;
  if (!Number.isFinite(n) || n < 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function FileAttachmentList({ media }: { media: SocialMedia[] }) {
  return (
    <ul
      className="overflow-hidden rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {media.map((m) => {
        const name = m.fileName || m.alt || 'Tệp đính kèm';
        const { Icon, color } = fileIconForPostCard(name);
        return (
          <li
            key={m.id}
            className="flex items-center gap-3 border-b border-white/[0.04] px-3 py-2.5 last:border-b-0"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `${color}20`, color }}
            >
              <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary" title={name}>
                {name}
              </p>
              <p className="text-[10px]" style={{ color: '#64748b' }}>
                {humanFileSizePostCard(m.fileSize)}
                {m.mimeType ? ` · ${m.mimeType}` : ''}
              </p>
            </div>
            <a
              href={m.url}
              download={name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors"
              style={{
                background: 'rgba(139,92,246,0.12)',
                color: '#a78bfa',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
              title="Tải xuống"
            >
              <Download size={14} />
              Tải
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function MediaItem({
  item,
  onClick,
  autoPlayEnabled = false,
}: {
  item: SocialMedia;
  onClick: () => void;
  autoPlayEnabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [muted, setMuted] = useState(true);

  // ─── Auto-play on scroll: only when the video cell is at least
  // 60% visible AND the user hasn't scrolled it out. We use an
  // IntersectionObserver to avoid expensive scroll-listener math.
  useEffect(() => {
    if (!autoPlayEnabled || item.type !== 'VIDEO') return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setIsInView(e.isIntersecting && e.intersectionRatio >= 0.6);
        }
      },
      { threshold: [0, 0.3, 0.6, 0.9] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlayEnabled, item.type]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isInView) {
      // Autoplay may fail (browser policy) but we swallow the error.
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isInView]);

  if (item.type === 'VIDEO') {
    return (
      <button
        ref={containerRef}
        onClick={onClick}
        className="relative h-full w-full overflow-hidden bg-black"
      >
        {autoPlayEnabled ? (
          <video
            ref={videoRef}
            src={getMediaUrl(item.url, item.url)}
            poster={item.thumbnail ? getMediaUrl(item.thumbnail, item.thumbnail) : undefined}
            muted={muted}
            loop
            playsInline
            className="h-full w-full object-cover"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={getMediaUrl(item.thumbnail || item.url, item.thumbnail || item.url)}
            alt={item.alt || ''}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}

        {!autoPlayEnabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Mute toggle (only when autoplaying) */}
        {autoPlayEnabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
            className="absolute bottom-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            title={muted ? 'Bật tiếng' : 'Tắt tiếng'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        )}

        {item.duration && (
          <div
            className="absolute bottom-2 right-2 rounded-md px-1.5 py-0.5 text-xs font-medium text-white"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            {formatDuration(item.duration)}
          </div>
        )}
      </button>
    );
  }

  // Post media urls can be:
  //   - a full https URL (R2 public CDN or any other host) → as-is
  //   - an R2 bucket key (no leading slash, no `uploads/`) → CDN
  //   - a relative path starting with `/` → backend origin
  // getMediaUrl() handles all three so legacy local uploads
  // and new R2 uploads both render.
  const imgUrl = getMediaUrl(item.url, item.url) || '';

  return (
    <button onClick={onClick} className="relative h-full w-full overflow-hidden">
      <img
        src={imgUrl}
        alt={item.alt || ''}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform hover:scale-105"
      />
    </button>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-h-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt="Full size"
          className="rounded-2xl"
          style={{ maxHeight: '80vh', objectFit: 'contain', width: 'auto', height: 'auto' }}
        />
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <X size={16} className="text-white" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Comment Item ─────────────────────────────────────────────────────────────

function CommentItem({
  comment,
  onLike,
  onLikeComment,
  onDelete,
  onDeleteComment,
  onReply,
  canDelete,
  postId,
  depth = 0,
}: {
  comment: SocialComment;
  onLike: () => void;
  // Like handler that accepts a commentId. We need this for the
  // nested-replies case because each reply's like lives in
  // PostCard's closure (it has access to `socialApi` + the
  // `loadComments` refresh). `onLike` is a no-arg variant
  // reserved for the top-level "click to like this comment"
  // path; for replies we always use `onLikeComment(id)`.
  onLikeComment?: (commentId: number) => void;
  onDelete?: () => void;
  onDeleteComment?: (commentId: number) => void;
  onReply?: (parentId: number, content: string) => Promise<void>;
  canDelete?: boolean;
  postId: number;
  depth?: number;
}) {  // Defensive defaults — a comment without a user object (e.g.
  // one that's been partially deleted on the server) should still
  // render without crashing the whole card.
  const commentUser = (comment as any)?.user ?? {};
  const commentUserId = commentUser?.id;
  const commentUsername = commentUser?.username ?? 'user';
  const avatar = commentUser.avatarUrl
    ? commentUser.avatarUrl
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentUsername}`;
  const display = commentUser.displayName || commentUser.fullName || commentUser.username || 'Người dùng';

  // Reply input state. We track per-comment whether the input
  // is open, what the user has typed, and whether the
  // submission is in flight. The store doesn't own this state
  // — it's a pure UI concern of CommentItem.
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Pre-fill `@display ` when the user clicks the Reply button
  // for the first time. We use the display name with a trailing
  // space so the user can immediately start typing their reply.
  const openReply = () => {
    setReplyText((cur) => (cur.length === 0 ? `@${display} ` : cur));
    setReplyOpen(true);
  };

  const submitReply = async () => {
    const trimmed = replyText.trim();
    if (!trimmed || !onReply) return;
    setReplySubmitting(true);
    try {
      await onReply(comment.id, trimmed);
      setReplyText('');
      setReplyOpen(false);
    } catch {
      /* parent surfaces the error toast */
    } finally {
      setReplySubmitting(false);
    }
  };

  // Render the comment body with @mention chips. We split on
  // @username tokens and wrap each one in a clickable link.
  // The mention user IDs are on `comment.mentions` so we can
  // pick the right href per token.
  const mentionIds: number[] = Array.isArray((comment as any).mentions)
    ? ((comment as any).mentions as number[])
    : [];
  const renderContent = () => {
    const text = comment.content || '';
    // Match @ followed by non-whitespace characters, max 30
    // chars (matches the username limit in the registration
    // form).
    const re = /@([\p{L}\p{N}_.]{1,30})/gu;
    const parts: Array<{ type: 'text' | 'mention'; value: string; idx: number }> = [];
    let last = 0;
    let i = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) {
        parts.push({ type: 'text', value: text.slice(last, m.index), idx: i++ });
      }
      // We don't know the userId from the username alone
      // (the API only stores userId, not name). The link
      // still works as a visual hint — clicking jumps to
      // the commenter's own profile (searchable on the
      // server). In a future iteration the backend can
      // resolve usernames to ids in the response.
      parts.push({ type: 'mention', value: m[0], idx: i++ });
      last = m.index + m[0].length;
    }
    if (last < text.length) {
      parts.push({ type: 'text', value: text.slice(last), idx: i++ });
    }
    return parts.map((p) =>
      p.type === 'mention' ? (
        <span
          key={p.idx}
          className="text-violet-300 font-medium"
        >
          {p.value}
        </span>
      ) : (
        <span key={p.idx}>{p.value}</span>
      ),
    );
  };

  return (
    <div className="flex gap-2.5 group">
      <Link
        href={commentUserId === (useAuthStore.getState().user as any)?.id ? '/profile' : `/profile/${commentUserId ?? ''}`}
        className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full transition-transform hover:scale-110"
      >
        <img src={avatar} alt={display} loading="lazy" decoding="async" className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <div
          className="inline-block max-w-full rounded-2xl px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Link
            href={commentUserId === (useAuthStore.getState().user as any)?.id ? '/profile' : `/profile/${commentUserId ?? ''}`}
            className="text-xs font-semibold text-white hover:underline"
          >
            {display}
          </Link>
          <p className="mt-0.5 text-sm break-words" style={{ color: '#cbd5e1' }}>
            {renderContent()}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 pl-1 flex-wrap">
          <button
            onClick={onLike}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: comment.isLiked ? '#ec4899' : '#475569' }}
          >
            <Heart size={12} fill={comment.isLiked ? '#ec4899' : 'none'} />
            {comment.likesCount > 0 && comment.likesCount}
          </button>
          <span className="text-xs" style={{ color: '#334155' }}>
            {formatRelative(comment.createdAt)}
          </span>
          {comment.isEdited && (
            <span className="text-xs" style={{ color: '#334155' }}>
              (đã sửa)
            </span>
          )}
          {/* Reply button — only meaningful for top-level
              comments. We deliberately don't let users reply
              to a reply of a reply (1-level deep, matches the
              backend's 1-level nesting in getComments). */}
          {onReply && depth === 0 && (
            <button
              onClick={openReply}
              className="flex items-center gap-1 text-xs transition-colors text-text-muted hover:text-violet-300"
              title="Trả lời bình luận này"
            >
              <CornerDownRight size={11} />
              Trả lời
            </button>
          )}
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-xs transition-colors text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100"
              title="Xoá bình luận"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>

        {/* Reply input — only when replyOpen is true. Indented
            with a left margin so it visually nests under the
            comment. The pre-filled `@display ` token makes it
            obvious to the user who they're replying to. */}
        {replyOpen && (
          <div className="mt-2 ml-2 pl-3 border-l border-violet-500/30">
            <div className="flex items-center gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void submitReply();
                  } else if (e.key === 'Escape') {
                    setReplyOpen(false);
                  }
                }}
                autoFocus
                placeholder={`Trả lời ${display}...`}
                className="flex-1 rounded-xl px-3 py-1.5 text-sm text-white placeholder-slate-500 outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(139,92,246,0.3)',
                }}
                disabled={replySubmitting}
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim() || replySubmitting}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                style={{
                  background: 'rgba(139,92,246,0.2)',
                  color: '#c4b5fd',
                }}
                title="Gửi (Enter)"
              >
                <Send size={12} />
              </button>
              <button
                onClick={() => setReplyOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
                title="Huỷ (Esc)"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Replies — nested under the top-level comment. We
            only render one level deep (depth==0 → renders its
            .replies[] with depth==1, those don't recurse). */}
        {depth === 0 && Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <div className="mt-3 ml-3 pl-3 space-y-2 border-l border-white/[0.06]">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={() => onLikeComment ? onLikeComment(reply.id) : undefined}
                onLikeComment={onLikeComment}
                onDelete={canDelete ? () => onDeleteComment ? onDeleteComment(reply.id) : undefined : undefined}
                onReply={onReply}
                canDelete={canDelete}
                postId={postId}
                depth={1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Action Button ───────────────────────────────────────────────────────────

function ActionButton({
  active,
  activeColor,
  icon,
  count,
  label,
  onClick,
}: {
  active: boolean;
  activeColor: string;
  icon: React.ReactNode;
  count?: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-colors"
      style={{
        color: active ? activeColor : '#64748b',
        background: active ? `${activeColor}10` : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748b';
        }
      }}
      onClick={onClick}
      title={label}
    >
      {icon}
      {count != null && count > 0 && <span>{count}</span>}
    </motion.button>
  );
}

function CommentSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-2.5">
          <div className="h-8 w-8 animate-pulse rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex-1 space-y-1.5 pt-1">
            <div className="h-3 w-24 animate-pulse rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="h-3 w-4/5 animate-pulse rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── YouTube Embed ──────────────────────────────────────────────────────

function YouTubeEmbed({ url }: { url: string }) {
  // Same regex the composer uses to extract the video id from any
  // of the common YouTube URL shapes (watch, youtu.be, /shorts,
  // /embed, or a bare 11-char id).
  const id = (() => {
    if (!url) return null;
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    let m = url.match(/youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtube\.com\/(?:shorts|embed)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return null;
  })();

  if (!id) {
    // Fallback: render a clickable link card when we can't make
    // sense of the URL.
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-3 rounded-2xl p-3 transition-colors"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Youtube className="h-6 w-6 text-red-500 shrink-0" />
        <span className="truncate text-sm" style={{ color: '#cbd5e1' }}>{url}</span>
      </a>
    );
  }

  return (
    <div
      className="mt-3 overflow-hidden rounded-2xl"
      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────

export function PostSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-2.5 w-16 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div className="w-6 h-6 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-3 w-5/6 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-3 w-4/6 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      {/* Action bar */}
      <div className="flex items-center gap-6 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  );
}
