import DOMPurify from 'isomorphic-dompurify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Sanitize HTML/Markdown content rendered via dangerouslySetInnerHTML.
 * Removes script tags, event handlers, and other XSS vectors.
 * Use this on every dangerouslySetInnerHTML usage.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div', 'hr',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'style', 'data-language', 'language'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  });
}

/**
 * Sanitize HTML for rich content coming from the TipTap editor
 * (Lesson Content / Teaching Notes). Same allowlist as
 * sanitizeHtml but with `data-language` exposed so future
 * server-side syntax highlight tokens survive the trip.
 */
export function sanitizeRichHtml(dirty: string): string {
  return sanitizeHtml(dirty);
}

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format a VND amount as "1.234.567 ₫" (no decimals). Accepts number | string
 * (the finance API returns Decimal fields as strings to preserve precision).
 * Used everywhere in the MoneyFlow module.
 */
export const formatVnd = (value: number | string | null | undefined): string => {
  const n = typeof value === 'string' ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return '0 ₫';
  return `${Math.round(n).toLocaleString('vi-VN')} ₫`;
};

/** Compact VND for tight spaces: 1.2tr / 950k / 500. */
export const formatVndCompact = (value: number | string | null | undefined): string => {
  const n = typeof value === 'string' ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return '0';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}tỷ`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
  if (abs >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(Math.round(n));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

export const getImageUrl = (url?: string): string => {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
};

/**
 * Build a playable URL for a track / audio file.
 *
 * `localPath` from the backend can be one of three things, and
 * each needs a different host. We pick the right one in a single
 * place so the rules don't drift across components (admin page,
 * playlist view, music store, audio hook, etc.).
 *
 * 1. R2 bucket key, e.g. `audio/songs/abc.mp3`. Never starts
 *    with `/`, `uploads/`, or `http`. → public CDN URL so the
 *    browser streams directly from Cloudflare (Range support,
 *    no backend hop).
 * 2. Legacy local path, e.g. `uploads/songs/abc.mp3` or
 *    `/uploads/songs/abc.mp3`. → backend origin so nginx
 *    serves the file from disk. Used for the few pre-migration
 *    tracks still in the DB.
 * 3. A full https URL (YouTube, Spotify, direct R2 public URL).
 *    Return it as-is.
 * 4. Nothing useful. → backend streaming endpoint, which has
 *    the same R2-vs-local logic and will return a signed URL
 *    or 404.
 */
export const getMediaUrl = (
  localPath: string | null | undefined,
  audioUrl: string | null | undefined,
  trackId?: number | string,
): string => {
  const cdnBase =
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://e8105049f41b90209104afb5911d84b2.r2.cloudflarestorage.com';
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.cuongthai.com';

  const lp = (localPath ?? '').trim();
  const au = (audioUrl ?? '').trim();

  // (0) Object/data URLs are optimistic local previews created with
  // URL.createObjectURL()/FileReader while an upload is in flight
  // (e.g. avatar/cover cropper, image message preview). They are
  // already directly renderable by the browser — NEVER prepend the
  // CDN base to them. Doing so produced
  // `https://<r2>.cloudflarestorage.com/blob:https://.../<uuid>`
  // which 400s at R2. Return them untouched.
  if (lp.startsWith('blob:') || lp.startsWith('data:')) return lp;
  if (au.startsWith('blob:') || au.startsWith('data:')) return au;

  // (1) R2 key → backend stream endpoint. We deliberately go
  // through the API instead of pointing directly at
  // `https://media.cuongthai.com/<key>` because:
  //
  //   - MusicAudioController creates the <audio> element with
  //     `crossOrigin = 'anonymous'` (needed by the Web Audio
  //     AnalyserNode that powers the visualizer).
  //   - With crossOrigin = 'anonymous', the browser performs a
  //     CORS check on the byte stream.
  //   - Cloudflare R2's bucket has no CORS policy — the deployed
  //     R2 access token does not carry `s3:PutBucketCORS`, and
  //     the dashboard is not reachable from this code path.
  //     Without CORS headers, direct requests to
  //     media.cuongthai.com are rejected by the browser, and
  //     signed R2 URLs hit the same wall.
  //
  // The backend's /api/v1/music/stream/:id endpoint now streams
  // the R2 bytes itself (proxy, not redirect), and the backend
  // already serves CORS headers for the cuongthai.com origin
  // via the global `cors()` middleware. So the <audio> sees a
  // same-first-party response and starts playing.
  //
  // Cost: one extra hop through Node.js per play. Acceptable for
  // the music workload; the alternative is to disable the
  // visualizer (`crossOrigin = null`) which is the more visible
  // regression.
  if (
    lp &&
    !lp.startsWith('/') &&
    !lp.startsWith('uploads/') &&
    !lp.startsWith('http')
  ) {
    if (trackId != null) {
      return `${apiBase}/api/v1/music/stream/${trackId}`;
    }
    // No track ID — fall back to the direct CDN URL. This path
    // is rare (only hit by components that build media URLs
    // outside the track context, e.g. cover-art previews); those
    // components render <img>, not <audio>, so the CORS issue
    // doesn't apply.
    return `${cdnBase}/${lp}`;
  }

  // (2) Legacy local path
  if (lp.startsWith('uploads/')) {
    return `${apiBase}/${lp}`;
  }
  if (lp.startsWith('/')) {
    return `${apiBase}${lp}`;
  }

  // (3) Remote URL (YouTube, Spotify, etc.). These are full
  // https URLs the browser can hit directly; crossOrigin + CORS
  // are still required for the audio element but the upstream
  // YouTube/Spotify hosts already set Access-Control-Allow-Origin
  // for the public web, so they work.
  if (au.startsWith('http')) {
    return au;
  }

  // (4) Backend stream endpoint fallback (handles missing-key 404).
  if (trackId != null) {
    return `${apiBase}/api/v1/music/stream/${trackId}`;
  }
  return '';
};
