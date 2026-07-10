'use client';

import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Drop-in replacement for a plain <img> that self-heals transient
 * load failures.
 *
 * Why: feed/avatar images are served from the Cloudflare R2 CDN
 * (media.cuongthai.com). A one-off edge blip (timeout / 5xx / HTTP-3
 * hiccup / bot-challenge) makes the browser mark the <img> broken and
 * *cache that broken state* — the image then stays blank until a manual
 * reload, and because each browser hits its own transient failures it
 * looks like "works in Chrome, broken in Cococ, and vice versa".
 *
 * SmartImage retries once (with a cache-busting query param so the
 * browser re-fetches instead of reusing the cached failure), and only
 * shows a subtle placeholder if the retry also fails — instead of the
 * default broken-image icon.
 *
 * API mirrors <img>: pass src/alt/className/style and any other <img>
 * props. Keep it a drop-in so call sites change only the tag name.
 */

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string | undefined | null;
  alt?: string;
};

// Increasing backoff between retries. A freshly-uploaded R2 object can
// take a couple of seconds to become reliably reachable through the
// Cloudflare edge (cache MISS race / HTTP-3 blip), so a single quick
// retry often lands inside the same failure window. Spreading 3 retries
// over ~700ms → 1.6s → 3.2s covers that propagation gap without making
// a genuinely-dead image hang too long before the placeholder shows.
const RETRY_DELAYS_MS = [700, 1600, 3200];

function withCacheBuster(url: string, attempt: number): string {
  // Fresh query param each attempt → new cache key, forces the browser
  // to re-fetch instead of reusing the cached failure, and nudges a new
  // connection (helps past a stuck HTTP-3 attempt).
  return url + (url.includes('?') ? '&' : '?') + `r=${attempt}`;
}

export default function SmartImage({ src, alt = '', className, style, onError, ...rest }: SmartImageProps) {
  const original = src ?? '';
  const [currentSrc, setCurrentSrc] = useState(original);
  const [failed, setFailed] = useState(false);
  // How many retries we've already scheduled (0 = none yet).
  const [attempt, setAttempt] = useState(0);

  // Reset when the incoming src changes (e.g. carousel swipe, new post).
  useEffect(() => {
    setCurrentSrc(original);
    setFailed(false);
    setAttempt(0);
  }, [original]);

  if (failed || !original) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.25)',
          color: 'rgba(255,255,255,0.45)',
          ...style,
        }}
        aria-label={alt || 'image unavailable'}
        role="img"
      >
        <ImageOff size={20} strokeWidth={1.5} />
      </span>
    );
  }

  return (
    // Default loading/decoding are set before {...rest} so callers can
    // override them (e.g. loading="eager" for an above-the-fold LCP image);
    // lazy-loading keeps off-screen feed images/avatars from blocking render.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      loading="lazy"
      decoding="async"
      {...rest}
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        if (attempt < RETRY_DELAYS_MS.length) {
          // Schedule the next retry with a fresh cache-buster.
          const next = attempt + 1;
          setAttempt(next);
          setTimeout(() => setCurrentSrc(withCacheBuster(original, next)), RETRY_DELAYS_MS[attempt]);
        } else {
          // Exhausted all retries → show the placeholder.
          setFailed(true);
        }
        onError?.(e);
      }}
    />
  );
}
