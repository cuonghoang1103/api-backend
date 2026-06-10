'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send } from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import { RenderContentWithCode } from '@/components/social/CodeBlock';
import type { SocialPost, SocialComment, SocialMedia } from '@/types/social';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PostCardProps {
  post: SocialPost;
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { toggleLike, toggleSave, loadComments, commentsByPost, loadMoreComments, commentsHasMoreByPost, isLoadingComments, addOptimisticComment } = useSocialStore();

  const comments = commentsByPost[post.id] || [];
  const hasMoreComments = commentsHasMoreByPost[post.id] ?? false;
  const loadingComments = isLoadingComments[post.id] ?? false;

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

  const handleLikeComment = async (commentId: number) => {
    try {
      await socialApi.likeComment(commentId);
    } catch {
      // ignore
    }
  };

  const authorAvatar = post.author.avatarUrl
    ? post.author.avatarUrl
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`;

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
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-violet-500/20">
              <Image
                src={authorAvatar}
                alt={post.author.fullName || post.author.username}
                fill
                className="object-cover"
              />
            </div>

            {/* Name + time */}
            <div>
              <p className="font-semibold text-white">
                {post.author.fullName || post.author.username}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs" style={{ color: '#64748b' }}>
                  @{post.author.username}
                </p>
                <span style={{ color: '#334155' }}>·</span>
                <p className="text-xs" style={{ color: '#64748b' }}>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </p>
                {post.locationName && (
                  <>
                    <span style={{ color: '#334155' }}>·</span>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      📍 {post.locationName}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu */}
          <button
            className="rounded-xl p-2 transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-3">
          <RenderContentWithCode content={post.content} />
        </div>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <MediaGrid media={post.media} />
        )}

        {/* Action bar */}
        <div
          className="mt-4 flex items-center gap-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}
        >
          {/* Like */}
          <ActionButton
            active={post.isLiked}
            activeColor="#ec4899"
            icon={<Heart size={17} fill={post.isLiked ? '#ec4899' : 'none'} />}
            count={post.likesCount}
            label="Like"
            onClick={() => toggleLike(post.id)}
          />

          {/* Comment */}
          <ActionButton
            active={showComments}
            activeColor="#8B5CF6"
            icon={<MessageCircle size={17} fill={showComments ? '#8B5CF6' : 'none'} />}
            count={post.commentsCount}
            label="Comment"
            onClick={handleToggleComments}
          />

          {/* Save */}
          <ActionButton
            active={post.isSaved}
            activeColor="#f59e0b"
            icon={<Bookmark size={17} fill={post.isSaved ? '#f59e0b' : 'none'} />}
            count={post.savesCount}
            label="Save"
            onClick={() => toggleSave(post.id)}
          />

          {/* Share */}
          <div className="relative ml-auto">
            <ActionButton
              active={showShareMenu}
              activeColor="#06b6d4"
              icon={<Share2 size={17} />}
              label="Share"
              onClick={() => setShowShareMenu(!showShareMenu)}
            />
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-2xl py-1"
                  style={{
                    background: 'rgba(15,15,25,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {[
                    { key: 'copy', label: 'Copy link' },
                    { key: 'twitter', label: 'Share to X' },
                    { key: 'facebook', label: 'Share to Facebook' },
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
                    No comments yet. Be the first!
                  </p>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onLike={() => handleLikeComment(comment.id)}
                      />
                    ))}
                    {hasMoreComments && (
                      <button
                        className="w-full rounded-xl py-2 text-xs font-medium transition-colors"
                        style={{ color: '#8B5CF6' }}
                        onClick={() => loadMoreComments(post.id)}
                      >
                        Load more comments
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
        <MediaItem item={media[0]} onClick={() => setLightboxSrc(media[0].url)} />
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
}: {
  item: SocialMedia;
  onClick: () => void;
}) {
  if (item.type === 'VIDEO') {
    return (
      <button onClick={onClick} className="relative h-full w-full">
        <Image
          src={item.thumbnail || item.url}
          alt={item.alt || ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {item.duration && (
          <div className="absolute bottom-2 right-2 rounded-md px-1.5 py-0.5 text-xs font-medium text-white"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
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
}: {
  comment: SocialComment;
  onLike: () => void;
}) {
  const avatar = comment.user.avatarUrl
    ? comment.user.avatarUrl
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.username}`;

  return (
    <div className="flex gap-2.5">
      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={avatar} alt={comment.user.username} width={32} height={32} className="object-cover" />
      </div>
      <div className="flex-1">
        <div
          className="inline-block rounded-2xl px-3 py-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs font-semibold text-white">
            {comment.user.fullName || comment.user.username}
          </p>
          <p className="mt-0.5 text-sm" style={{ color: '#cbd5e1' }}>
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
              (edited)
            </span>
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
  count: number;
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
      {count > 0 && <span>{count}</span>}
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
