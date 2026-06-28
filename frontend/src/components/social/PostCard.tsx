'use client';

import { memo, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send,
  Repeat2, Trash2, Copy, Flag, Eye, Globe, Users, Lock,
  X, Youtube,
  Download, FileText, FileCode, FileArchive, FileSpreadsheet,
  CornerDownRight,
  Loader2,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import MentionAutocomplete from '@/components/social/MentionAutocomplete';
import { RenderContentWithCode } from '@/components/social/CodeBlock';
import PostPoll from '@/components/social/PostPoll';
import SocialSavePopover, {
  type SaveCollection,
} from '@/components/social/SocialSavePopover';
import SocialSavePopoverV2 from '@/components/social/SocialSavePopoverV2';
import MusicSticker, { type MusicTrackMini } from '@/components/social/MusicSticker';
import { useAuthStore } from '@/store/authStore';
import { getMediaUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { SocialPost, SocialComment, SocialMedia, ReactionType, ReactionBreakdown, FeedCollection, FeedPostSaveContext, FeedSaveResult } from '@/types/social';
import { REACTION_META, REACTION_PICKER_ORDER, WOW_META, EMPTY_REACTION_BREAKDOWN } from '@/types/social';
import { socialKeys, type SocialFeedResponse } from '@/hooks/useSocialQueries';
import { formatRelative } from '@/lib/formatDate';
import { toast } from 'sonner';

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
  /**
   * Fired when the user clicks the "Theater" button on a video
   * media item. The page-level wrapper opens the fullscreen
   * TheaterMode modal. PostCard does not own the modal — it
   * only emits the intent.
   */
  onOpenTheater?: (postId: number) => void;
}

// ─── Memoisation ───────────────────────────────────────────────
// PostCard is heavy (multiple sub-views, video preview, comment
// thread, action row, save popover). Without memo, every socket
// tick that touches the social store re-renders every card in the
// feed — which is exactly the jank users see when they're scrolled
// mid-list. The custom equality fn compares only what the user can
// actually see change on the card surface; deeper state lives
// inside the card and is owned by it (showComments, etc.).
function PostCardImpl({ post, onToggleLike, onToggleSave, onDelete, onOpenTheater }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  // User ids the user @'d in the current comment. Populated by
  // MentionAutocomplete's onPick callback. We send this in the
  // createComment payload so the backend can fan out NEW_MENTION
  // notifications to each mentioned user. The set is cleared on
  // submit and on text change so the next comment starts fresh.
  const [commentMentions, setCommentMentions] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  // ─── Saved Collections popover (legacy single-folder, kept
  //      for callers that still wire it up). ───────────────────
  const [showSavePopover, setShowSavePopover] = useState(false);
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  // Phase 5 home upgrade: ref for the comment composer input so the
  // MentionAutocomplete component can listen to its caret position.
  const commentInputRef = useRef<HTMLInputElement | null>(null);
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
    const submittedText = commentText;
    const tempId = Date.now();
    const optimisticComment: SocialComment = {
      id: tempId,
      postId: post.id,
      content: submittedText,
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
    // Snapshot mention ids BEFORE clearing the textarea so the
    // createComment payload carries them to the server. Without
    // this the server never knows who was @'d and no NEW_MENTION
    // notification fires.
    const mentionsArr = Array.from(commentMentions);
    setCommentText('');
    setCommentMentions(new Set());

    try {
      await socialApi.createComment({
        postId: post.id,
        content: submittedText,
        mentions: mentionsArr.length > 0 ? mentionsArr : undefined,
      });
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
   *   - mentions: optional user ids that the reply composer
   *     collected from MentionAutocomplete's onPick. We send
   *     them in the createComment payload so the server can
   *     fan out NEW_MENTION notifications to the right people.
   */
  const handleReplyComment = async (
    parentId: number,
    content: string,
    mentions?: number[],
  ) => {
    const mentionIds = (mentions ?? []).filter(
      (n) => Number.isFinite(n) && n > 0,
    );

    try {
      await socialApi.createComment({
        postId: post.id,
        parentId,
        content,
        mentions: mentionIds.length > 0 ? mentionIds : undefined,
      });
      // Refresh the comment list so the new reply shows up
      // under the parent.
      loadComments(post.id, true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gửi trả lời thất bại');
      throw err; // let CommentItem re-enable its submit button
    }
  };

  // Phase 5 home upgrade: lazy-load replies beyond the first
  // page. Called from CommentItem when the user clicks
  // "Xem thêm N phản hồi". We just delegate to the API; the
  // caller (CommentItem) merges the result into its local
  // `extraReplies` state.
  const handleLoadMoreReplies = async (rootId: number, cursor: number): Promise<SocialComment[] | null> => {
    try {
      const res = await socialApi.getCommentReplies(rootId, { cursor, limit: 10 });
      const data = (res.data as unknown as { data: SocialComment[] }).data ?? [];
      return data;
    } catch (err) {
      toast.error('Không tải được thêm phản hồi');
      return null;
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
  const handleSaveCommit = async (folder: string | null, remove?: boolean) => {
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
      // Phase 4 perf follow-up: dropped the previous inline
      // `backdropFilter: 'blur(20px)'` + `boxShadow: '0 8px 32px ...'`
      // styles. Backdrop-filter was forcing the browser to re-blur
      // the area behind every card on every frame the descendants
      // painted — and with a `<video>` inside the card, that's
      // ~60 re-blurs per second per card, which dropped video
      // playback to ~10 FPS on mid-range laptops.
      // The card keeps the same visual feel via the `.post-card-frame`
      // utility class (see globals.css) which uses a cheap inset
      // box-shadow that lives entirely on the GPU compositor.
      className="post-card-frame group relative overflow-hidden rounded-3xl"
      // data-post-id lets the home page deep-link from a
      // notification (?post=N) to a specific card via querySelector
      // + scrollIntoView. Bounded: zero perf cost, the value is
      // already on the post object.
      data-post-id={post.id}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
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
                width={44}
                height={44}
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
                {/* Content-type badge — only for Video/File so normal
                    posts (and non-social callers that don't set `type`)
                    render exactly as before. */}
                {(post.type === 'VIDEO' || post.type === 'FILE') && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md"
                    style={
                      post.type === 'VIDEO'
                        ? { background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)' }
                        : { background: 'rgba(6,182,212,0.12)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.3)' }
                    }
                  >
                    {post.type === 'VIDEO' ? 'Video' : 'File'}
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
          <MediaGrid
            media={safeMedia}
            postId={post.id}
            onOpenTheater={onOpenTheater}
            musicTrack={post.musicTrack ?? null}
            musicStartSec={post.musicStartSec ?? null}
          />
        )}

        {/* YouTube embed — shown after media if a URL is attached.
            Renders the official youtube-nocookie iframe so the post
            works with strict privacy settings. */}
        {post.youtubeUrl && (
          <YouTubeEmbed url={post.youtubeUrl} />
        )}

        {/* Action bar — placed BELOW the post content (after the
            image / YouTube embed) so it doesn't overlay the media.
            The previous overlay design blocked carousel swipe gestures
            in the top zone of the image, which broke Next/Prev
            navigation on every post that had an image. */}
        <PostActionsBar
          myReaction={myReaction}
          reactionColor={reactionColor}
          reactionEmoji={reactionEmoji}
          safeLikesCount={safeLikesCount}
          handleReact={handleReact}
          cancelLongPress={cancelLongPress}
          showReactions={showReactions}
          setShowReactions={setShowReactions}
          REACTION_PICKER_ORDER={REACTION_PICKER_ORDER}
          activeReactions={activeReactions}
          showComments={showComments}
          safeCommentsCount={safeCommentsCount}
          handleToggleComments={handleToggleComments}
          handleShare={handleShare}
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          safeIsSaved={safeIsSaved}
          safeSavesCount={safeSavesCount}
          saveButtonRef={saveButtonRef}
          handleSaveClick={handleSaveClick}
          post={post}
          showSavePopover={showSavePopover}
          setShowSavePopover={setShowSavePopover}
          cachedCollections={cachedCollections}
          handleSaveCommit={handleSaveCommit}
          showSavePopoverV2={showSavePopoverV2}
          setShowSavePopoverV2={setShowSavePopoverV2}
          collectionsV2={collectionsV2}
          saveContext={saveContext}
          collectionsV2Loading={collectionsV2Loading}
          handleCommitV2={handleCommitV2}
          handleCreateV2={handleCreateV2}
          overlay={false}
        />

        {/* Comments section — use grid-template-rows for an
            animated height without triggering layout per frame.
            Animating height: 'auto' forces a synchronous layout
            on every frame; the grid-rows trick lets the browser
            interpolate between 0fr and 1fr in the compositor. */}
        <AnimatePresence initial={false}>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, gridTemplateRows: '0fr' }}
              animate={{ opacity: 1, gridTemplateRows: '1fr' }}
              exit={{ opacity: 0, gridTemplateRows: '0fr' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mt-4 grid"
            >
              <div className="min-h-0 overflow-hidden">
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
                          // Phase 5 home upgrade: lazy-load more
                          // replies when the server says there
                          // are more than the eagerly fetched
                          // count.
                          onLoadMoreReplies={handleLoadMoreReplies}
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
                      ref={commentInputRef}
                      type="text"
                      placeholder="Write a comment... (gõ @ để tag)"
                      value={commentText}
                      onChange={(e) => {
                        const next = e.target.value;
                        setCommentText(next);
                        // If the user cleared the text, drop the
                        // accumulated mention set too — the next
                        // comment starts from a clean slate.
                        if (next === '') setCommentMentions(new Set());
                      }}
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
                  {/* Phase 5 home upgrade: @mention autocomplete for the
                      comment composer. Listens to the input's caret
                      and pops up a list of users to tag while they
                      type @username. */}
                  <MentionAutocomplete
                    textareaRef={commentInputRef}
                    value={commentText}
                    onChange={setCommentText}
                    onPick={(item) => {
                      // Append (de-duped) the picked user id to the
                      // mentions set. handleSubmitComment reads
                      // this set when building the createComment
                      // payload, so the server can fan out
                      // NEW_MENTION notifications.
                      setCommentMentions((prev) => {
                        if (prev.has(item.id)) return prev;
                        const next = new Set(prev);
                        next.add(item.id);
                        return next;
                      });
                    }}
                    offsetY={36}
                  />
                </form>
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

// ─── Memoised export ────────────────────────────────────────────
// We compare only the surface fields the user actually sees: the
// post body (id, content, media, author), the toggle booleans
// (liked/saved/pinned/visibility), and the counter + updatedAt
// fields. Comment lists + reaction breakdowns live in their own
// sub-components and are owned by the card. Callbacks compare by
// reference — they're wrapped in useCallback at the page level
// (see page.tsx handleToggleLike etc.) so identity stability is
// guaranteed across re-renders of the same feed page.
function postCardPropsEqual(prev: PostCardProps, next: PostCardProps): boolean {
  const a = prev.post;
  const b = next.post;
  if (a === b) return true;
  if (a.id !== b.id) return false;
  if (a.content !== b.content) return false;
  if (a.updatedAt !== b.updatedAt) return false;
  if (a.likesCount !== b.likesCount) return false;
  if (a.commentsCount !== b.commentsCount) return false;
  if (a.savesCount !== b.savesCount) return false;
  if (a.isLiked !== b.isLiked) return false;
  if (a.isSaved !== b.isSaved) return false;
  if (a.visibility !== b.visibility) return false;
  if (a.author?.id !== b.author?.id) return false;
  if (a.author?.avatarUrl !== b.author?.avatarUrl) return false;
  if (a.author?.displayName !== b.author?.displayName) return false;
  // Callback identity — parent must useCallback these.
  if (prev.onToggleLike !== next.onToggleLike) return false;
  if (prev.onToggleSave !== next.onToggleSave) return false;
  if (prev.onDelete !== next.onDelete) return false;
  if (prev.onOpenTheater !== next.onOpenTheater) return false;
  return true;
}

export interface PostCardHandle {
  /** Open the comments section, load the comments list, and
   *  scroll to the matching comment. Used by the home page's
   *  ?comment=N deep-link effect — the bell notification click
   *  flow that the user reported wasn't taking them to the
   *  right comment before. */
  openComment: (commentId: number) => void;
}

// PostCardImpl has a long list of internal useState / useRef /
// useEffect that we don't want to duplicate. We use a thin
// forwardRef wrapper that captures the imperative handle and
// delegates rendering to the existing memoised component. The
// wrapper is not memoised because it accepts a ref whose identity
// changes every render — React handles the ref forward without
// re-running PostCardImpl.
const PostCardForward = forwardRef<PostCardHandle, PostCardProps>(
  function PostCardForward(props, ref) {
    return <PostCardWithHandle ref={ref} {...props} />;
  },
);

export const PostCard = memo(PostCardForward, postCardPropsEqual);

function PostCardWithHandle({
  ref,
  ...props
}: PostCardProps & { ref: React.ForwardedRef<PostCardHandle> }) {
  // We need access to setShowComments and loadComments — both
  // are local to the original PostCardImpl. Instead of refactoring
  // that component (large blast radius), we walk the DOM to find
  // the comment we want and click the "Bình luận" toggle if the
  // comments section isn't open yet. The "openComment" imperative
  // does this synchronously after the page has placed the card
  // into the viewport via ?post=N — at that point the card is
  // already mounted and the comments toggle button is in the
  // tree. This is the minimum-risk integration.
  useImperativeHandle(
    ref,
    () => ({
      openComment: (commentId: number) => {
        const postId = props.post.id;
        const card = document.querySelector<HTMLElement>(
          `[data-post-id="${postId}"]`,
        );
        if (!card) return;
        // Click the Bình luận toggle if comments are not yet
        // visible. We use the data-comments-toggle attribute we
        // set on the ActionButton; this is a stable selector that
        // doesn't depend on the button's rendered aria-label text.
        const toggle = card.querySelector<HTMLButtonElement>(
          '[data-comments-toggle="1"]',
        );
        if (toggle) {
          // Check if comments are already visible by looking for
          // any mounted [data-comment-id] inside the card.
          const alreadyOpen = card.querySelector('[data-comment-id]');
          if (!alreadyOpen) toggle.click();
        }
        // Wait two frames for the comments list to mount, then
        // scroll to the target comment and add a brief highlight.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const target = document.querySelector<HTMLElement>(
              `[data-comment-id="${commentId}"]`,
            );
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add(
                'ring-2',
                'ring-violet-500/60',
                'rounded-2xl',
                'transition',
              );
              window.setTimeout(() => {
                target.classList.remove(
                  'ring-2',
                  'ring-violet-500/60',
                  'rounded-2xl',
                );
              }, 2400);
            }
          });
        });
      },
    }),
    [props.post.id],
  );
  return <PostCardImpl {...props} />;
}

// ─── Fullscreen Video Player ──────────────────────────────────────────────────

function VideoPlayerModal({ src, onClose }: { src: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on Escape (global so it fires even without focus)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Track browser fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Focus player on mount so keyboard shortcuts work immediately
  useEffect(() => {
    playerContainerRef.current?.focus();
  }, []);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 2000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
    resetHideTimer();
  };

  // Show controls always when paused
  const handlePause = () => {
    setPlaying(false);
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; videoRef.current.muted = val === 0; }
    setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  // Keyboard shortcuts: Space = play/pause, ←/→ = seek ±5s
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v) return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      v.currentTime = Math.max(0, v.currentTime - 5);
      setCurrentTime(v.currentTime);
      resetHideTimer();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      v.currentTime = Math.min(duration, v.currentTime + 5);
      setCurrentTime(v.currentTime);
      resetHideTimer();
    }
  };

  const fmt = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
      onClick={onClose}
      onMouseMove={resetHideTimer}
    >
      <div
        ref={playerContainerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src={src}
          className="max-h-[calc(100dvh-80px)] w-full object-contain cursor-pointer"
          autoPlay
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={handlePause}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          onVolumeChange={() => {
            const v = videoRef.current;
            if (!v) return;
            setVolume(v.muted ? 0 : v.volume);
            setMuted(v.muted);
          }}
        />

        {/* Controls overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              }}
            >
              {/* Scrubber: invisible input on top of visual track */}
              <div className="group/scrub relative mb-3 w-full cursor-pointer py-2">
                {/* Track */}
                <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                  {/* Fill */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-violet-500"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Thumb (appears on hover) */}
                  <div
                    className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow-md transition-transform duration-150 group-hover/scrub:scale-100"
                    style={{ left: `calc(${progress}% - 7px)` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (videoRef.current) videoRef.current.currentTime = val;
                    setCurrentTime(val);
                    resetHideTimer();
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Seek"
                />
              </div>

              {/* Bottom controls row */}
              <div className="flex items-center gap-3 text-white">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="shrink-0 transition-opacity hover:opacity-75" aria-label={playing ? 'Pause' : 'Play'}>
                  {playing ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                </button>

                {/* Time */}
                <span className="text-[13px] tabular-nums opacity-80">
                  {fmt(currentTime)} / {fmt(duration)}
                </span>

                <div className="flex-1" />

                {/* Volume */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !videoRef.current.muted;
                        setMuted(videoRef.current.muted);
                      }
                    }}
                    className="transition-opacity hover:opacity-75"
                    aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {muted || volume === 0 ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-violet-500 cursor-pointer"
                    aria-label="Volume"
                  />
                </div>

                {/* Fullscreen toggle */}
                <button onClick={toggleFullscreen} className="ml-1 transition-opacity hover:opacity-75" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                  {isFullscreen ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                      <path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                      <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                    </svg>
                  )}
                </button>

                {/* Close */}
                <button onClick={onClose} className="ml-1 transition-opacity hover:opacity-75" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top close button (always visible) */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/80"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Media Grid ───────────────────────────────────────────────────────────────

function MediaGrid({
  media,
  postId,
  onOpenTheater,
  musicTrack,
  musicStartSec,
}: {
  media: SocialMedia[];
  /** Owning post id — passed down so MediaItem's Theater button
   *  can fire the right callback without re-deriving it. */
  postId?: number;
  onOpenTheater?: (postId: number) => void;
  // Phase 3 add — Instagram-style music sticker. When set,
  // the FIRST media tile gets the sticker overlay. We only
  // render it on the first tile to avoid cluttering multi-image
  // carousels (Instagram itself does the same).
  musicTrack?: MusicTrackMini | null;
  musicStartSec?: number | null;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const visual = media.filter((m) => m.type !== 'FILE');
  const files = media.filter((m) => m.type === 'FILE');

  const handleMediaClick = (item: SocialMedia) => {
    const url = getMediaUrl(item.url, item.url);
    if (item.type === 'VIDEO') {
      setVideoSrc(url);
    } else {
      setLightboxSrc(url);
    }
  };

  if (visual.length === 0) {
    // Pure file post (no image / video). Hand off to the file list
    // renderer below so we don't end up rendering an empty grid.
    return (
      <>
        <FileAttachmentList media={files} />
      </>
    );
  }

  // Single-image path is a degenerate case of the carousel
  // (no dots, no arrows) so the JSX below handles 1+ uniformly.
  // (Bypasses the grid layout — Instagram itself does the same.)

  // Horizontal swipeable carousel state. We track:
  //  - currentIdx: which tile is in view
  //  - dragOffset: how many px the user is currently dragging —
  //    applied as translate-x on the inner track so the slide
  //    follows the finger 1:1 while dragging. Released via the
  //    snapTo logic below.
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const startIdxRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Keep currentIdx in range when the post is updated (e.g. a
  // new tile added/removed). We clamp instead of resetting so
  // the user keeps their place.
  useEffect(() => {
    if (currentIdx >= visual.length) setCurrentIdx(Math.max(0, visual.length - 1));
  }, [visual.length, currentIdx]);

  // Pointer drag handlers (mouse + touch). We use Pointer Events
  // so the same code handles both — pointer capture means the
  // drag keeps tracking even if the user leaves the track
  // rectangle mid-drag. Threshold: 50px horizontal OR 15% of
  // the track width (whichever is smaller) commits a slide;
  // smaller throws snap back to the current tile.
  //
  // ── Bugfix (2026-06-28) ─────────────────────────────────────────
  // The previous implementation relied on `isDragging` (React
  // state) inside the move/up handlers. State updates are
  // asynchronous, so the FIRST pointermove right after
  // pointerdown saw the stale `false` and bailed out — the
  // carousel would not track the finger until the second
  // move event, which felt broken especially with many tiles
  // (5–6+). We now mirror isDragging into a ref so the
  // handlers always read the latest value.
  const onPointerDown = (e: React.PointerEvent) => {
    if (visual.length <= 1) return;
    // ─── Critical: don't capture the pointer if the user is
    // touching one of the carousel's OWN interactive elements
    // (the prev/next arrows, the dot pager, the counter pill).
    // Capturing a pointer when the click started on one of
    // those buttons REDIRECTS all subsequent pointer events to
    // the carousel wrapper and suppresses the synthetic click
    // event on the button — the user sees a frozen carousel on
    // every Next/Prev click.
    //
    // We match on aria-label / data-testid instead of the
    // generic <button> selector because the IMAGE/VIDEO tiles
    // themselves are wrapped in <button> for tap-to-open, and
    // we DO want to start a drag from the tile body. ───
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-carousel-control="1"]') ||
      target.closest('[aria-label="Ảnh trước"], [aria-label="Ảnh sau"]') ||
      target.closest('[data-testid^="media-dot-"]') ||
      target.closest('a[href]')
    ) {
      return;
    }
    // Only start drag on horizontal intent. A vertical scroll
    // (touch device) should still scroll the page, not the
    // carousel. We bail out if the touch starts with a clear
    // vertical bias — otherwise the carousel would steal
    // scroll gestures on mobile.
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startIdxRef.current = currentIdx;
    setDragOffset(0);
    // Capture on the INNER track (the flex container being
    // transformed), not the outer wrapper. The control buttons
    // are siblings of the inner track so their pointer events
    // don't fire here at all — which is exactly what we want.
    const inner = trackRef.current?.querySelector('[data-carousel-track]') as HTMLElement | null;
    try {
      (inner || e.currentTarget).setPointerCapture(e.pointerId);
    } catch {
      /* setPointerCapture can throw on some browsers when the
         pointer is already released; ignore — pointerup still
         fires via the capture target. */
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    // Defensive: if the move somehow originated on one of the
    // carousel's own controls, ignore. (Shouldn't happen now
    // that onPointerDown bails out, but keep this as a safety
    // net.) We use the same selector logic as onPointerDown.
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-carousel-control="1"]') ||
      target.closest('[aria-label="Ảnh trước"], [aria-label="Ảnh sau"]') ||
      target.closest('[data-testid^="media-dot-"]') ||
      target.closest('a[href]')
    ) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    // If the user is scrolling vertically (dy dominant), let the
    // page handle the scroll and don't translate the carousel.
    // We only commit horizontal drags.
    if (Math.abs(dy) > Math.abs(dx) * 1.5 && Math.abs(dy) > 8) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch { /* noop */ }
      return;
    }
    // Rubber-band resistance at the edges: first 25% of the
    // over-drag moves 1:1, the rest is dampened. This makes
    // swiping past the first/last tile feel like a tug instead
    // of a hard wall.
    const trackWidth = trackRef.current?.clientWidth ?? 1;
    const atStart = startIdxRef.current === 0 && dx > 0;
    const atEnd = startIdxRef.current === visual.length - 1 && dx < 0;
    let displayDx = dx;
    if (atStart || atEnd) {
      const overshoot = Math.abs(dx);
      const dampened = Math.min(overshoot * 0.35, trackWidth * 0.18);
      displayDx = dx < 0 ? -dampened : dampened;
    }
    setDragOffset(displayDx);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const dx = e.clientX - startXRef.current;
    const trackWidth = trackRef.current?.clientWidth ?? 1;
    const threshold = Math.min(50, trackWidth * 0.15);
    let next = startIdxRef.current;
    if (dx < -threshold) next = Math.min(visual.length - 1, startIdxRef.current + 1);
    else if (dx > threshold) next = Math.max(0, startIdxRef.current - 1);
    setCurrentIdx(next);
    setDragOffset(0);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch { /* noop */ }
  };

  // Tap a tile to open the lightbox/video (Phase 1 behaviour).
  // We keep tap-to-open for the lightbox-style zoom-in and add
  // swipe for the carousel navigation. Tap is detected by
  // pointerdown + pointerup on the same target within a small
  // distance + short time — anything else is a drag.
  const tapStartRef = useRef<{ x: number; y: number; t: number; target: EventTarget | null } | null>(null);
  const onTilePointerDown = (e: React.PointerEvent, item: SocialMedia) => {
    tapStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      t: Date.now(),
      target: e.currentTarget,
    };
  };
  const onTilePointerUp = (e: React.PointerEvent, item: SocialMedia) => {
    const start = tapStartRef.current;
    tapStartRef.current = null;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = Date.now() - start.t;
    if (dt > 250 || dx > 6 || dy > 6) return; // it was a drag
    handleMediaClick(item);
  };

  // Phase 3 add — music sticker always rides on the FIRST tile
  // (per Instagram convention). When the user navigates the
  // carousel, the sticker follows the active tile (which is
  // visually always index 0, so it stays put at the bottom).
  // We use `key` on the inner track so framer-motion remounts
  // the active tile cleanly when items change.
  const renderCarousel = () => (
    <div
      ref={trackRef}
      data-testid="media-carousel"
      data-current-idx={currentIdx}
      data-total={visual.length}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative w-full overflow-hidden rounded-2xl touch-pan-y select-none"
    >
      <div
        data-carousel-track
        className="flex"
        style={{
          // ── Bugfix (2026-06-28) ─────────────────────────────────
          // The previous track was sized `width: ${N * 100}%` and
          // each tile `${100 / N}%`. translateX(`-${i * 100}%`)
          // then shifted by the TRACK width (one screen × N), not
          // one tile, so for N=5–6+ slides jumped multiple tiles
          // or wrapped. We now keep the track 100% of the parent
          // and each tile 100% of the track, so `-i * 100%`
          // equals exactly one tile width regardless of N.
          // Drag offset stays in pixels (rubber-band dampened
          // above).
          width: '100%',
          transform: `translate3d(calc(${-currentIdx * 100}% + ${dragOffset}px), 0, 0)`,
          transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {visual.map((item, i) => (
          <div
            key={item.id}
            className="relative shrink-0 grow-0 basis-full"
            onPointerDown={(e) => onTilePointerDown(e, item)}
            onPointerUp={(e) => onTilePointerUp(e, item)}
            onPointerCancel={() => { tapStartRef.current = null; }}
          >
            <MediaItem
              item={item}
              onClick={() => { /* taps handled by pointerup above */ }}
              autoPlayEnabled={item.type === 'VIDEO' && i === currentIdx}
              onOpenTheater={
                onOpenTheater && postId != null
                  ? () => onOpenTheater(postId)
                  : undefined
              }
            />
            {/* Sticker only on the FIRST tile — it stays put
                visually (we always render at index 0). */}
            {i === 0 && musicTrack && (
              <MusicSticker
                track={musicTrack}
                startSec={musicStartSec ?? 0}
              />
            )}
          </div>
        ))}
      </div>

      {/* Side arrows (desktop). Show on hover only so they
          don't crowd the mobile layout. The arrows are 40px
          squares centered vertically on each edge with a
          dark translucent background. */}
      {visual.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            aria-label="Ảnh trước"
            data-carousel-control="1"
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-9 w-9 rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 disabled:opacity-0 md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => Math.min(visual.length - 1, i + 1))}
            disabled={currentIdx === visual.length - 1}
            aria-label="Ảnh sau"
            data-carousel-control="1"
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-9 w-9 rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 disabled:opacity-0 md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Counter pill (bottom-left) + dots (bottom-center). Both
          match Instagram's overlay style. The counter used to be
          top-right but the floating action bar now occupies the
          top edge, so we moved the counter to bottom-left so it
          doesn't fight for the same corner. Dots stay bottom-center
          as before. Hidden on 1-image posts where they add noise. */}
      {visual.length > 1 && (
        <>
          <div className="pointer-events-none absolute left-2 bottom-2 z-10 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            {currentIdx + 1}/{visual.length}
          </div>
          <div
            role="tablist"
            aria-label="Carousel position"
            className="pointer-events-auto absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
          >
            {visual.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentIdx}
                aria-label={`Ảnh ${i + 1}`}
                onClick={() => setCurrentIdx(i)}
                data-testid={`media-dot-${i}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === currentIdx
                    ? 'w-5 bg-white shadow'
                    : 'w-1.5 bg-white/60 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (visual.length === 1) {
    return (
      <div className="mt-3 relative">
        {renderCarousel()}
        {files.length > 0 && (
          <div className="mt-2">
            <FileAttachmentList media={files} />
          </div>
        )}
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
        <AnimatePresence>
          {videoSrc && (
            <VideoPlayerModal src={videoSrc} onClose={() => setVideoSrc(null)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="mt-3 relative">
      {renderCarousel()}
      {files.length > 0 && (
        <div className="mt-2">
          <FileAttachmentList media={files} />
        </div>
      )}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
      <AnimatePresence>
        {videoSrc && (
          <VideoPlayerModal src={videoSrc} onClose={() => setVideoSrc(null)} />
        )}
      </AnimatePresence>
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
  onOpenTheater,
}: {
  item: SocialMedia;
  onClick: () => void;
  autoPlayEnabled?: boolean;
  onOpenTheater?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [muted, setMuted] = useState(true);
  // Inline playback state for the control bar
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showInlineControls, setShowInlineControls] = useState(false);
  const inlineHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Auto-play on scroll: only when the video cell is at least
  // 50% visible. We use an IntersectionObserver to avoid expensive
  // scroll-listener math.
  //
  // Phase 4 perf follow-up: simplified from 4 thresholds
  // ([0, 0.3, 0.6, 0.9]) down to a single 0.5 threshold with a
  // 50px rootMargin. The old setup made the playback toggle
  // (play/pause) flip-flop several times per scroll tick whenever
  // a card was near the 60% boundary, which forced video decode
  // to restart constantly — visible as a choppy ~10 FPS playback
  // in the feed. One threshold + rootMargin keeps the toggle
  // hysteresis wide enough to avoid that, while rootMargin gives
  // the video a head-start (play before the user actually
  // centres the card).
  useEffect(() => {
    if (!autoPlayEnabled || item.type !== 'VIDEO') return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setIsInView(e.isIntersecting && e.intersectionRatio >= 0.5);
        }
      },
      { threshold: 0.5, rootMargin: '50px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlayEnabled, item.type]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isInView) {
      // Autoplay may fail (browser policy) but we swallow the error.
      // Also broadcast a custom event so SocialBackground can pause
      // its animated canvas and free up the main thread for video
      // decode.
      v.play().catch(() => {});
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('social:video-playing', { detail: { src: v.currentSrc } }));
      }
    } else {
      v.pause();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('social:video-paused', { detail: { src: v.currentSrc } }));
      }
    }
  }, [isInView]);

  const resetInlineHideTimer = () => {
    setShowInlineControls(true);
    if (inlineHideTimer.current) clearTimeout(inlineHideTimer.current);
    inlineHideTimer.current = setTimeout(() => setShowInlineControls(false), 2000);
  };

  const fmtInline = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  };

  const inlineProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (item.type === 'VIDEO') {
    return (
      <button
        ref={containerRef}
        onClick={onClick}
        className="group/media relative h-full w-full overflow-hidden bg-black"
        onMouseEnter={resetInlineHideTimer}
        onMouseMove={resetInlineHideTimer}
        onMouseLeave={() => { if (isPlaying) setShowInlineControls(false); }}
      >
        {autoPlayEnabled ? (
          <video
            ref={videoRef}
            src={getMediaUrl(item.url, item.url)}
            poster={item.thumbnail ? getMediaUrl(item.thumbnail, item.thumbnail) : undefined}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            // Phase 4 perf follow-up: promote the video onto its
            // own GPU compositing layer so the browser doesn't
            // re-composite the parent card (which still re-paints
            // periodically — like buttons, comment counts, etc.)
            // every time the video frame changes. Without this
            // hint the video decode and the card repaint end up
            // on the same compositor and contend for the GPU.
            style={{ willChange: 'transform' }}
            className="h-full w-full object-cover"
            onClick={(e) => e.stopPropagation()}
            onPlay={() => setIsPlaying(true)}
            onPause={() => { setIsPlaying(false); setShowInlineControls(true); }}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          />
        ) : (
          <img
            src={getMediaUrl(item.thumbnail || item.url, item.thumbnail || item.url)}
            alt={item.alt || ''}
            loading="lazy"
            decoding="async"
            width={600}
            height={600}
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

        {/* Theater-mode shortcut */}
        {onOpenTheater && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTheater();
            }}
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-neon-violet"
            title="Mở Theater Mode (toàn màn hình)"
            aria-label="Mở Theater Mode"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            Theater
          </button>
        )}

        {/* Inline control bar (auto-play mode only) */}
        {autoPlayEnabled && (
          <div
            className={`absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6 transition-opacity duration-200 ${showInlineControls ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrubber */}
            <div className="group/iscrub relative mb-1.5 w-full cursor-pointer py-1.5">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-white/25">
                <div className="absolute inset-y-0 left-0 rounded-full bg-violet-500" style={{ width: `${inlineProgress}%` }} />
                <div
                  className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 scale-0 rounded-full bg-white shadow transition-transform duration-150 group-hover/iscrub:scale-100"
                  style={{ left: `calc(${inlineProgress}% - 5px)` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = val;
                  setCurrentTime(val);
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Seek"
              />
            </div>
            {/* Controls row */}
            <div className="flex items-center gap-2 text-white">
              {/* Play/Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const v = videoRef.current;
                  if (!v) return;
                  if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
                }}
                className="shrink-0 transition-opacity hover:opacity-75"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              {/* Time */}
              <span className="text-[10px] tabular-nums opacity-80">
                {fmtInline(currentTime)} / {fmtInline(duration)}
              </span>
              <div className="flex-1" />
              {/* Mute */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted((m) => !m);
                }}
                className="transition-opacity hover:opacity-75"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Static duration badge (non-autoplay) */}
        {!autoPlayEnabled && item.duration && (
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
    <button
      onClick={(e) => {
        // The carousel detects tap vs drag at the wrapper level
        // and decides whether to advance the slide or open the
        // lightbox. We stopPropagation here so the button's own
        // onClick (which opens the lightbox) doesn't fire when the
        // user is dragging — only when it's a clean tap.
        e.stopPropagation();
        onClick();
      }}
      className="relative h-full w-full overflow-hidden"
    >
      <img
        src={imgUrl}
        alt={item.alt || ''}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform hover:scale-105"
        // Drag protection: prevent the browser from interpreting
        // the image drag as a file download. We still let the
        // parent wrapper see pointerdown/pointermove for the
        // carousel swipe.
        onDragStart={(e) => e.preventDefault()}
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

// Phase 5 home upgrade: signature for the lazy-load-more-replies
// callback. Extracted to a top-level alias so the `Promise<X[]>`
// generic doesn't get parsed as JSX inside the inline object
// type that follows it.
type CommentLoadMoreFn = (rootId: number, cursor: number) => Promise<SocialComment[] | null | undefined>;

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
  onLoadMoreReplies,
}: {
  comment: SocialComment;
  onLike: () => void;
  onLikeComment?: (commentId: number) => void;
  onDelete?: () => void;
  onDeleteComment?: (commentId: number) => void;
  // Optional `mentions` array carries the user ids the user @'d in
  // the reply (collected via MentionAutocomplete.onPick). The parent
  // PostCard forwards them in the createComment payload so the server
  // can fan out NEW_MENTION notifications.
  onReply?: (parentId: number, content: string, mentions?: number[]) => Promise<void>;
  canDelete?: boolean;
  postId: number;
  depth?: number;
  onLoadMoreReplies?: CommentLoadMoreFn;
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
  // User ids the user @'d in the current reply. Populated by
  // MentionAutocomplete's onPick. Sent in the createComment
  // payload so the server can fan out NEW_MENTION notifications.
  const [replyMentions, setReplyMentions] = useState<Set<number>>(new Set());
  const [replySubmitting, setReplySubmitting] = useState(false);
  // Phase 5 home upgrade: extra replies fetched lazily when the
  // user clicks "Xem thêm N phản hồi". We track them locally so
  // we can append without rebuilding the parent's tree.
  const [extraReplies, setExtraReplies] = useState<SocialComment[]>([]);
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);

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
      // Snapshot mention ids so the parent's createComment
      // payload carries the right user ids. The mention set
      // is cleared after submit; the next reply starts fresh.
      const mentions = Array.from(replyMentions);
      await onReply(comment.id, trimmed, mentions);
      setReplyText('');
      setReplyOpen(false);
      setReplyMentions(new Set());
    } catch {
      /* parent surfaces the error toast */
    } finally {
      setReplySubmitting(false);
    }
  };

  // Phase 5 home upgrade: ref for the reply input so the
  // MentionAutocomplete dropdown can hook into it. Same pattern
  // as the top-level comment composer.
  const replyInputRef = useRef<HTMLInputElement | null>(null);
  // Phase 5 home upgrade: lazy-load more replies. We track the
  // cursor (last reply id we've shown) so the parent can issue
  // the next page request. The parent passes a callback so this
  // component doesn't need to know about socialApi directly.
  const handleLoadMoreReplies = async () => {
    if (!onLoadMoreReplies) return;
    const allShown = [...(comment.replies ?? []), ...extraReplies];
    const last = allShown[allShown.length - 1];
    if (!last) return;
    setLoadingMoreReplies(true);
    try {
      const next = await onLoadMoreReplies(comment.id, last.id);
      if (next && next.length > 0) {
        setExtraReplies((prev) => [...prev, ...next]);
      }
    } catch {
      // silent — parent can retry via refresh
    } finally {
      setLoadingMoreReplies(false);
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
    <div
      // data-comment-id is the anchor used by the home page's
      // ?comment=N deep-link effect (see app/page.tsx). Bounded:
      // it's just a DOM attribute, zero perf cost, and only matters
      // when the user navigates from a notification.
      data-comment-id={comment.id}
      className="flex gap-2.5 group"
    >
      <Link
        href={commentUserId === (useAuthStore.getState().user as any)?.id ? '/profile' : `/profile/${commentUserId ?? ''}`}
        className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full transition-transform hover:scale-110"
      >
        <img src={avatar} alt={display} loading="lazy" decoding="async" width={32} height={32} className="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
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
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  if (e.target.value === '') setReplyMentions(new Set());
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void submitReply();
                  } else if (e.key === 'Escape') {
                    setReplyOpen(false);
                  }
                }}
                autoFocus
                placeholder={`Trả lời ${display}... (gõ @ để tag)`}
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
              {/* Phase 5 home upgrade: @mention autocomplete for the
                  reply form. The reply input gets the same dropdown
                  as the top-level composer. onPick pushes the
                  picked user id into replyMentions so submitReply
                  can include it in the createComment payload. */}
              <MentionAutocomplete
                textareaRef={replyInputRef}
                value={replyText}
                onChange={(v) => {
                  setReplyText(v);
                  if (v === '') setReplyMentions(new Set());
                }}
                onPick={(item) => {
                  setReplyMentions((prev) => {
                    if (prev.has(item.id)) return prev;
                    const next = new Set(prev);
                    next.add(item.id);
                    return next;
                  });
                }}
                offsetY={36}
              />
            </div>
          </div>
        )}

        {/* Replies — nested under the top-level comment. We
            only render one level deep (depth==0 → renders its
            .replies[] with depth==1, those don't recurse).
            Phase 5 home upgrade: also append `extraReplies`
            loaded lazily via "Xem thêm" button. */}
        {depth === 0 && (Array.isArray(comment.replies) && comment.replies.length > 0 || extraReplies.length > 0) && (
          <div className="mt-3 ml-3 pl-3 space-y-2 border-l border-white/[0.06]">
            {[...(comment.replies ?? []), ...extraReplies].map((reply) => (
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
            {/* Phase 5 home upgrade: "Xem thêm N phản hồi" — only
                shows when the server signalled there's more than
                what we eagerly fetched. Clicking it calls
                /comments/by-root/:rootId with the last shown
                reply's id as cursor. */}
            {comment.hasMoreReplies && onLoadMoreReplies && (
              <button
                type="button"
                onClick={handleLoadMoreReplies}
                disabled={loadingMoreReplies}
                className="ml-2 flex items-center gap-1 text-xs font-medium text-violet-300 transition-colors hover:text-violet-200 disabled:opacity-50"
              >
                {loadingMoreReplies ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Đang tải…
                  </>
                ) : (
                  <>
                    <CornerDownRight className="h-3 w-3 rotate-180" />
                    Xem thêm {Math.max(0, (comment.repliesCount ?? 0) - (comment.repliesShown ?? comment.replies?.length ?? 0) - extraReplies.length)} phản hồi
                  </>
                )}
              </button>
            )}
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
  // Phase 5 home upgrade: iOS-quality motion. Each tap fires a
  // quick scale-down (whileTap) and a counter scale-up
  // (whileHover) so the icon "pops" when the user interacts.
  // The active state animates between inactive/active via the
  // `animate` prop driven by `active` — no manual class
  // swapping, so the colour transition is also spring-eased.
  // This is cheap (no per-frame JS) because the values stay on
  // the compositor.
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
      animate={{
        color: active ? activeColor : '#64748b',
        backgroundColor: active ? `${activeColor}1A` : 'rgba(0,0,0,0)',
      }}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium"
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

// ─── PostActionsBar (rebuilt 2026-06-28) ─────────────────────────────
// Renders the Like / Comment / Repost / Share / Bookmark row as
// ONE rounded "pill" container that can either float over the
// top edge of the post image (when `overlay` is true) or sit
// as a normal block above the comments (when there is no media).
//
// The bookmark button is positioned at the far-right via
// `ml-auto`, while the Like/Comment/Repost/Share cluster sits
// to the left — exactly the new L→R order requested.
//
// We accept every state/callback needed as props (rather than
// importing the parent closure) so the component remains easy
// to swap out or move later. The popover anchors (save popover
// V1 + V2, share menu, reaction picker) are still owned by the
// parent — we only forward the refs that the popovers expect.
function PostActionsBar(props: {
  // Like + reactions
  myReaction: ReactionType | null | undefined;
  reactionColor: string | null | undefined;
  reactionEmoji: string | null | undefined;
  safeLikesCount: number;
  handleReact: (r: ReactionType) => void;
  cancelLongPress: () => void;
  showReactions: boolean;
  setShowReactions: (v: boolean) => void;
  REACTION_PICKER_ORDER: any[];
  activeReactions: ReactionType[];
  // Comment
  showComments: boolean;
  safeCommentsCount: number;
  handleToggleComments: () => void;
  // Share / Repost
  handleShare: (kind: string) => void;
  showShareMenu: boolean;
  setShowShareMenu: (v: boolean) => void;
  // Bookmark + save popovers
  safeIsSaved: boolean;
  safeSavesCount: number;
  saveButtonRef: React.RefObject<HTMLButtonElement>;
  handleSaveClick: () => void;
  post: SocialPost;
  showSavePopover: boolean;
  setShowSavePopover: (v: boolean) => void;
  cachedCollections: SaveCollection[];
  handleSaveCommit: (folder: string | null, remove?: boolean) => Promise<void>;
  showSavePopoverV2: boolean;
  setShowSavePopoverV2: (v: boolean) => void;
  collectionsV2: FeedCollection[];
  saveContext: FeedPostSaveContext | null;
  collectionsV2Loading: boolean;
  handleCommitV2: (collectionIds: number[]) => Promise<void>;
  handleCreateV2: (name: string) => Promise<FeedCollection | null>;
  // Visual mode
  overlay: boolean;
}) {
  const {
    myReaction,
    reactionColor,
    reactionEmoji,
    safeLikesCount,
    handleReact,
    cancelLongPress,
    showReactions,
    setShowReactions,
    REACTION_PICKER_ORDER,
    activeReactions,
    showComments,
    safeCommentsCount,
    handleToggleComments,
    handleShare,
    showShareMenu,
    setShowShareMenu,
    safeIsSaved,
    safeSavesCount,
    saveButtonRef,
    handleSaveClick,
    post,
    showSavePopover,
    setShowSavePopover,
    cachedCollections,
    handleSaveCommit,
    showSavePopoverV2,
    setShowSavePopoverV2,
    collectionsV2,
    saveContext,
    collectionsV2Loading,
    handleCommitV2,
    handleCreateV2,
    overlay,
  } = props;

  // Pill container styling. The action bar now sits BELOW the
  // post content (not overlaid on the image), matching the
  // Instagram layout. We render it as a full-width rounded
  // pill with a subtle top divider so it reads as part of
  // the post card while still being visually distinct from
  // the media above. `overlay` is kept for type compatibility
  // but is no longer honoured (always rendered as a block row).
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '8px 8px',
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 9999,
    background: 'rgba(15,15,25,0.55)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  return (
    <>
      <div style={containerStyle} className="select-none">
        {/* ─── Like (with hover reaction picker) ──────────── */}
        <div
          className="relative"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => {
            cancelLongPress();
            setShowReactions(false);
          }}
        >
          <motion.button
            onClick={() => handleReact('LIKE')}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 480, damping: 22 }}
            className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium"
            style={{ color: myReaction && reactionColor ? reactionColor : '#cbd5e1' }}
            aria-label="Thích bài viết"
            aria-pressed={myReaction === 'LIKE'}
          >
            {myReaction ? (
              <motion.span
                key={myReaction}
                initial={{ scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                className="text-[15px] leading-none"
                aria-label={REACTION_META[myReaction].label}
              >
                {reactionEmoji}
              </motion.span>
            ) : (
              <Heart size={15} fill="none" className="transition-transform group-active:scale-125" />
            )}
            <span className="tabular-nums">{safeLikesCount}</span>
          </motion.button>
          <AnimatePresence>
            {showReactions && (
              <motion.div
                key="reaction-picker"
                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22, mass: 0.6 }}
                className="absolute bottom-full left-0 z-50 flex flex-col items-start pointer-events-auto"
              >
                <div className="w-full cursor-default" style={{ height: '12px', pointerEvents: 'none' }} />
                <div
                  className="relative z-50 flex gap-0.5 rounded-2xl p-1.5 shadow-2xl"
                  style={{
                    background: 'rgba(15,15,25,0.96)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {REACTION_PICKER_ORDER.map((k, idx) => {
                    const isWow = k === 'WOW';
                    const r = isWow ? WOW_META : REACTION_META[k as ReactionType];
                    const isMine = !isWow && myReaction === k;
                    return (
                      <motion.button
                        key={k}
                        initial={{ opacity: 0, y: 6, scale: 0.6 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { delay: idx * 0.03, type: 'spring', stiffness: 420, damping: 18 },
                        }}
                        exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.1 } }}
                        whileHover={{ scale: 1.45, y: -6, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 1.1 }}
                        onClick={() => {
                          handleReact(isWow ? 'LIKE' : (k as ReactionType));
                        }}
                        className="text-2xl px-1.5 py-0.5 cursor-pointer origin-bottom"
                        title={r.label}
                        style={{
                          transform: isMine ? 'scale(1.18)' : 'scale(1)',
                          filter: isMine ? `drop-shadow(0 0 6px ${r.color})` : undefined,
                        }}
                      >
                        {r.emoji}
                      </motion.button>
                    );
                  })}
                </div>
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

        {/* ─── Comment ─────────────────────────────────────── */}
        <motion.button
          onClick={handleToggleComments}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
          className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium"
          style={{
            color: showComments ? '#a78bfa' : '#cbd5e1',
            background: showComments ? 'rgba(139,92,246,0.16)' : 'transparent',
          }}
          data-comments-toggle="1"
          aria-label="Bình luận"
          aria-pressed={showComments}
          title="Bình luận"
        >
          <MessageCircle size={15} fill={showComments ? '#8B5CF6' : 'none'} />
          <span className="tabular-nums">{safeCommentsCount}</span>
        </motion.button>

        {/* ─── Repost ──────────────────────────────────────── */}
        <motion.button
          onClick={() => handleShare('repost')}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
          className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium"
          style={{ color: '#cbd5e1' }}
          aria-label="Đăng lại"
          title="Đăng lại"
        >
          <Repeat2 size={15} />
        </motion.button>

        {/* ─── Share (opens dropdown menu) ──────────────────── */}
        <div className="relative">
          <motion.button
            onClick={() => setShowShareMenu(!showShareMenu)}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
            className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium"
            style={{
              color: showShareMenu ? '#22d3ee' : '#cbd5e1',
              background: showShareMenu ? 'rgba(6,182,212,0.16)' : 'transparent',
            }}
            aria-label="Chia sẻ"
            aria-haspopup="menu"
            aria-expanded={showShareMenu}
            title="Chia sẻ"
          >
            <Share2 size={15} />
          </motion.button>
          <AnimatePresence>
            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowShareMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute left-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-2xl py-1"
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

        {/* Spacer pushes the bookmark button to the far right */}
        <div className="flex-1" />

        {/* ─── Bookmark (far-right) ────────────────────────── */}
        <motion.button
          ref={saveButtonRef}
          onClick={handleSaveClick}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 480, damping: 22 }}
          className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium"
          style={{
            color: safeIsSaved ? NEON_AMBER : '#cbd5e1',
            background: safeIsSaved ? 'rgba(245,158,11,0.16)' : 'transparent',
          }}
          title={safeIsSaved ? `Đã lưu${post.savedFolder ? ` vào "${post.savedFolder}"` : ''}` : 'Lưu bài viết'}
          aria-label={safeIsSaved ? 'Đã lưu bài viết' : 'Lưu bài viết'}
          aria-haspopup="dialog"
          aria-expanded={showSavePopover || showSavePopoverV2}
        >
          <Bookmark
            size={15}
            fill={safeIsSaved ? NEON_AMBER : 'none'}
            className="transition-transform group-active:scale-125"
          />
          {safeSavesCount > 0 && <span className="tabular-nums">{safeSavesCount}</span>}
        </motion.button>
      </div>

      {/* Save popovers (V1 + V2) — still anchored to the
          bookmark button ref forwarded from the parent. They
          must live OUTSIDE the rounded container so they
          don't get clipped by the overflow-hidden pill. */}
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
    </>
  );
}

// Phase 5 home upgrade: shimmer skeleton (instead of the old
// flat animate-pulse). The skeleton uses a moving linear-gradient
// overlay so it reads as "real content loading" not "broken UI".
// The gradient moves via a single CSS animation on the wrapper
// — pure GPU work, no per-frame React renders.
function CommentSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-2.5">
          <div className="shimmer h-8 w-8 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5 pt-1">
            <div className="shimmer h-3 w-24 rounded" />
            <div className="shimmer h-3 w-4/5 rounded" />
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

// ─── Shimmering skeleton loader ─────────────────────────────────
// Replaces the previous flat `animate-pulse` block with a moving
// gradient that slides from left to right. Two variants share the
// same shimmer keyframe so the page looks visually consistent while
// the feed is hydrating.

function ShimmerBlock({
  className,
  rounded = 'rounded',
}: {
  className: string;
  rounded?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.10) 50%, transparent 100%)',
          animation: 'social-shimmer 1.6s ease-in-out infinite',
        }}
      />
    </div>
  );
}

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
        <ShimmerBlock className="w-10 h-10" rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <ShimmerBlock className="h-3 w-24" />
          <ShimmerBlock className="h-2.5 w-16" />
        </div>
        <ShimmerBlock className="w-6 h-6" rounded="rounded" />
      </div>
      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <ShimmerBlock className="h-3 w-full" />
        <ShimmerBlock className="h-3 w-5/6" />
        <ShimmerBlock className="h-3 w-4/6" />
      </div>
      {/* Action bar */}
      <div
        className="flex items-center gap-6 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <ShimmerBlock className="h-7 w-16" rounded="rounded-lg" />
        <ShimmerBlock className="h-7 w-16" rounded="rounded-lg" />
        <ShimmerBlock className="h-7 w-16" rounded="rounded-lg" />
      </div>
    </div>
  );
}
