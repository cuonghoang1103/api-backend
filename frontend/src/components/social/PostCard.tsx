'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send,
  Repeat2, Trash2, Copy, Flag, Eye, Globe, Users, Lock,
  Smile, ThumbsUp, Frown, Laugh, Angry, Hand, X, Youtube,
} from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import { RenderContentWithCode } from '@/components/social/CodeBlock';
import PostPoll from '@/components/social/PostPoll';
import { useAuthStore } from '@/store/authStore';
import type { SocialPost, SocialComment, SocialMedia } from '@/types/social';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

interface PostCardProps {
  post: SocialPost;
}

const VISIBILITY_META: Record<string, { icon: any; label: string; color: string }> = {
  PUBLIC: { icon: Globe, label: 'Công khai', color: '#94a3b8' },
  FRIENDS: { icon: Users, label: 'Bạn bè', color: '#22c55e' },
  PRIVATE: { icon: Lock, label: 'Chỉ mình tôi', color: '#f59e0b' },
};

const REACTIONS = [
  { key: 'like', emoji: '👍', label: 'Thích', icon: ThumbsUp, color: '#3b82f6' },
  { key: 'love', emoji: '❤️', label: 'Yêu thích', icon: Heart, color: '#ec4899' },
  { key: 'laugh', emoji: '😆', label: 'Haha', icon: Laugh, color: '#eab308' },
  { key: 'wow', emoji: '😮', label: 'Wow', icon: Smile, color: '#f59e0b' },
  { key: 'sad', emoji: '😢', label: 'Buồn', icon: Frown, color: '#06b6d4' },
  { key: 'angry', emoji: '😡', label: 'Phẫn nộ', icon: Angry, color: '#ef4444' },
];

const MAX_PREVIEW_LENGTH = 600;

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const longPressTimer = useRef<any>(null);
  const { toggleLike, toggleSave, loadComments, commentsByPost, loadMoreComments, commentsHasMoreByPost, isLoadingComments, addOptimisticComment, deletePost } = useSocialStore();
  const { user: currentUser } = useAuthStore();

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
  const contentLong = post.content.length > MAX_PREVIEW_LENGTH;
  const visibleContent = expanded || !contentLong
    ? post.content
    : post.content.slice(0, MAX_PREVIEW_LENGTH).trimEnd() + '…';

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
      const text = `🔁 Repost từ @${authorObj?.username ?? 'user'}\n\n${post.content.slice(0, 280)}`;
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
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content.slice(0, 100))}&url=${encodeURIComponent(window.location.origin + '/social/post/' + post.id)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/social/post/' + post.id)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xoá bài viết này?')) return;
    try {
      await deletePost(post.id);
      toast.success('Đã xoá bài viết');
      setShowMoreMenu(false);
    } catch (err: any) {
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
              <Image
                src={authorAvatar}
                alt={authorDisplay}
                fill
                className="object-cover"
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
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}</span>
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
        {post.poll && <PostPoll postId={post.id} poll={post.poll} />}

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <MediaGrid media={post.media} />
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
          {/* Like (with long-press to choose reaction) */}
          <div
            className="relative"
            onMouseEnter={() => setShowReactions(false)}
          >
            <button
              onClick={() => toggleLike(post.id)}
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={(e) => {
                cancelLongPress();
                e.currentTarget.style.background = 'transparent';
              }}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              className="group inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors"
              style={{ color: post.isLiked ? '#ec4899' : '#94a3b8' }}
              onMouseEnter={(e) => { if (!post.isLiked) e.currentTarget.style.background = 'rgba(236,72,153,0.08)'; }}
            >
              <Heart
                size={16}
                fill={post.isLiked ? '#ec4899' : 'none'}
                className="transition-transform group-active:scale-125"
              />
              <span className="tabular-nums">{post.likesCount}</span>
            </button>
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-2xl p-1.5 z-30"
                  style={{ background: 'rgba(15,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
                  onMouseLeave={() => setShowReactions(false)}
                >
                  {REACTIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => { setShowReactions(false); toggleLike(post.id); }}
                      className="text-xl hover:scale-125 transition-transform px-1.5"
                      title={r.label}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comment */}
          <ActionButton
            active={showComments}
            activeColor="#8B5CF6"
            icon={<MessageCircle size={16} fill={showComments ? '#8B5CF6' : 'none'} />}
            count={post.commentsCount}
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

          {/* Save */}
          <ActionButton
            active={post.isSaved}
            activeColor="#f59e0b"
            icon={<Bookmark size={16} fill={post.isSaved ? '#f59e0b' : 'none'} />}
            count={post.savesCount}
            label="Lưu"
            onClick={() => toggleSave(post.id)}
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
                          canDelete={canDeleteComment}
                          onDelete={canDeleteComment ? () => handleDeleteComment(comment.id) : undefined}
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

  if (media.length === 1) {
    return (
      <div className="mt-3">
        <MediaItem
          item={media[0]}
          onClick={() => setLightboxSrc(media[0].url)}
          autoPlayEnabled={media[0].type === 'VIDEO'}
        />
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </div>
    );
  }

  const gridClass =
    media.length === 2
      ? 'grid-cols-2'
      : media.length === 3
      ? 'grid-cols-2'
      : 'grid-cols-2';

  return (
    <div className={`mt-3 grid ${gridClass} gap-1.5 rounded-2xl overflow-hidden`}>
      {media.slice(0, 4).map((item, i) => (
        <div
          key={item.id}
          className="relative overflow-hidden rounded-xl"
          style={{
            aspectRatio: '1',
            gridColumn: i === 0 && media.length === 3 ? 'span 2' : 'span 1',
          }}
        >
          <MediaItem item={item} onClick={() => setLightboxSrc(item.url)} />
          {i === 3 && media.length > 4 && (
            <div
              className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              +{media.length - 4}
            </div>
          )}
        </div>
      ))}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
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
            src={item.url}
            poster={item.thumbnail ?? undefined}
            muted={muted}
            loop
            playsInline
            className="h-full w-full object-cover"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Image
            src={item.thumbnail || item.url}
            alt={item.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
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

  return (
    <button onClick={onClick} className="relative h-full w-full">
      <Image
        src={item.url}
        alt={item.alt || ''}
        fill
        className="object-cover transition-transform hover:scale-105"
        sizes="(max-width: 768px) 100vw, 600px"
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
        <Image
          src={src}
          alt="Full size"
          width={1200}
          height={800}
          className="rounded-2xl"
          style={{ maxHeight: '80vh', objectFit: 'contain' }}
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
  onDelete,
  canDelete,
}: {
  comment: SocialComment;
  onLike: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}) {
  // Defensive defaults — a comment without a user object (e.g.
  // one that's been partially deleted on the server) should still
  // render without crashing the whole card.
  const commentUser = (comment as any)?.user ?? {};
  const commentUserId = commentUser?.id;
  const commentUsername = commentUser?.username ?? 'user';
  const avatar = commentUser.avatarUrl
    ? commentUser.avatarUrl
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentUsername}`;
  const display = commentUser.displayName || commentUser.fullName || commentUser.username || 'Người dùng';

  return (
    <div className="flex gap-2.5 group">
      <Link
        href={commentUserId === (useAuthStore.getState().user as any)?.id ? '/profile' : `/profile/${commentUserId ?? ''}`}
        className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full transition-transform hover:scale-110"
      >
        <Image src={avatar} alt={display} width={32} height={32} className="object-cover" />
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
            {comment.content}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 pl-1">
          <button
            onClick={onLike}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: comment.isLiked ? '#ec4899' : '#475569' }}
          >
            <Heart size={12} fill={comment.isLiked ? '#ec4899' : 'none'} />
            {comment.likesCount > 0 && comment.likesCount}
          </button>
          <span className="text-xs" style={{ color: '#334155' }}>
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
          </span>
          {comment.isEdited && (
            <span className="text-xs" style={{ color: '#334155' }}>
              (đã sửa)
            </span>
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
