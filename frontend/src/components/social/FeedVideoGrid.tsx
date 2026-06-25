'use client';

// FeedVideoGrid — the "Video" feed tab.
//
// A grid of vertical poster thumbnails (TikTok/Reels style). Tapping a
// poster opens the dedicated full-screen /feed/video reel seeded at that
// post (?start=<id>). Kept deliberately light: just <img> posters + a
// play badge — no <video> elements mount here, so the grid never decodes
// video and stays smooth. The heavy single-video playback lives only in
// the /feed/video route.

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Video as VideoIcon } from 'lucide-react';
import type { SocialPost } from '@/types/social';
import { posterForPost } from '@/lib/videoEmbed';

export default function FeedVideoGrid({ posts }: { posts: SocialPost[] }) {
  const videos = posts ?? [];
  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {videos.map((post, i) => {
        const poster = posterForPost(post);
        const author =
          post.author?.displayName || post.author?.fullName || post.author?.username || 'Người dùng';
        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, delay: Math.min(i * 0.02, 0.2) }}
          >
            <Link
              href={`/feed/video?start=${post.id}`}
              aria-label={`Mở video của ${author}`}
              className="group relative block aspect-[9/16] overflow-hidden rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.12))' }}
            >
              {poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-violet-300/60">
                  <VideoIcon size={28} />
                </div>
              )}

              {/* Play badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-110">
                  <Play size={18} className="ml-0.5 fill-white text-white" />
                </span>
              </div>

              {/* Caption / author footer */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="truncate text-[11px] font-medium text-white/90">{author}</p>
                {post.content?.trim() && (
                  <p className="truncate text-[10px] text-white/60">{post.content.trim()}</p>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
