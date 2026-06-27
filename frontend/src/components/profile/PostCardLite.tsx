'use client';

/**
 * PostCardLite — minimal post card for the profile Posts tab.
 *
 * This is a stripped-down version of the full PostCard for use
 * in the profile page, where we don't need the full feed
 * surface (comment sheets, share popups, reaction emoji
 * pickers, etc.). We show:
 *   - author + time
 *   - first image preview (single-tile, 4:5)
 *   - caption (truncated)
 *   - counts: like, comment
 *   - "Open" link to the full post page
 *
 * Tapping the like button triggers an OPTIMISTIC update on the
 * server: we set the count +1 first, then call the server,
 * then re-sync with the server's authoritative count. Same shape
 * the full feed uses.
 */

import { Heart, MessageCircle, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface PostCardLiteProps {
  post: {
    id: number;
    content: string;
    createdAt: string;
    author?: { id: number; username: string; displayName?: string; avatarUrl?: string | null };
    media?: Array<{ type: 'IMAGE' | 'VIDEO'; url: string; thumbnail?: string | null; alt?: string | null }>;
    _count?: { likes: number; comments: number };
  };
  onToggleLike: () => void;
}

export default function PostCardLite({ post, onToggleLike }: PostCardLiteProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
  const firstImage = post.media?.find((m) => m.type === 'IMAGE') ?? post.media?.[0];

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => !v);
    setLikeCount((c) => c + (liked ? -1 : 1));
    onToggleLike();
  };

  return (
    <Link
      href={`/social/post/${post.id}`}
      className="group block overflow-hidden rounded-2xl border border-darkborder bg-darkcard/40 transition-colors hover:border-neon-violet/40"
    >
      {/* Cover image */}
      {firstImage ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-darkbg">
          {firstImage.type === 'VIDEO' ? (
            <video
              src={firstImage.url}
              poster={firstImage.thumbnail ?? undefined}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firstImage.url || firstImage.thumbnail || ''}
              alt={firstImage.alt || ''}
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-darkbg/40 text-text-muted/30">
          <ImageIcon className="h-12 w-12" />
        </div>
      )}

      {/* Author + body */}
      <div className="p-3">
        {post.author && (
          <div className="mb-1.5 flex items-center gap-2">
            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-neon-violet to-neon-pink">
              {post.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.author.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white">
                  {(post.author.displayName || post.author.username).slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <span className="truncate text-xs font-semibold text-text-primary">
              {post.author.displayName || post.author.username}
            </span>
            <span className="text-[10px] text-text-muted">·</span>
            <span className="truncate text-[10px] text-text-muted">
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        )}
        {post.content && (
          <p className="line-clamp-3 text-sm text-text-primary">
            {post.content}
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-3 text-xs text-text-muted">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors',
              liked
                ? 'bg-red-500/15 text-red-400'
                : 'hover:bg-white/5 hover:text-text-primary',
            )}
            aria-label={liked ? 'Bỏ thích' : 'Thích'}
          >
            <Heart className={cn('h-3.5 w-3.5', liked && 'fill-current')} />
            {likeCount}
          </button>
          <div className="inline-flex items-center gap-1 text-text-muted">
            <MessageCircle className="h-3.5 w-3.5" />
            {post._count?.comments ?? 0}
          </div>
          <div className="ml-auto inline-flex items-center gap-1 text-text-muted">
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
