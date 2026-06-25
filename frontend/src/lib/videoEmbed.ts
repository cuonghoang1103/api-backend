// Shared helpers for video posts in the feed: extracting YouTube /
// TikTok ids from a pasted link, and picking the best poster image.
// Used by FeedVideoGrid (thumbnail grid) and the /feed/video reel so
// the embed logic lives in exactly one place.

import type { SocialPost } from '@/types/social';

/** Extract an 11-char YouTube id from any common URL shape (or a bare id). */
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
  let m = url.match(/youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtube\.com\/(?:shorts|embed)\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

export function isTikTokUrl(url?: string | null): boolean {
  return !!url && /tiktok\.com/i.test(url);
}

/** Extract a numeric TikTok video id from a share/embed URL. */
export function getTikTokId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|embed\/v2\/|embed\/)(\d+)/);
  return m ? m[1] : null;
}

/** The first uploaded VIDEO media on a post, if any. */
export function firstVideoMedia(post: SocialPost) {
  return (post.media ?? []).find((m) => m.type === 'VIDEO') ?? null;
}

/** True if the post carries a playable video (uploaded clip or link). */
export function postHasVideo(post: SocialPost): boolean {
  return !!firstVideoMedia(post) || !!post.youtubeUrl;
}

/**
 * Best poster/thumbnail for a video post:
 *   1. explicit thumbnail on the VIDEO media,
 *   2. YouTube hqdefault for a YouTube link,
 *   3. any media thumbnail,
 *   4. null → caller renders a gradient fallback.
 */
export function posterForPost(post: SocialPost): string | null {
  const vid = firstVideoMedia(post);
  if (vid?.thumbnail) return vid.thumbnail;
  const yt = getYouTubeId(post.youtubeUrl);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  const anyThumb = (post.media ?? []).find((m) => m.thumbnail)?.thumbnail;
  return anyThumb ?? null;
}
