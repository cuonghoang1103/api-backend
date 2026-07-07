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

const RETRY_DELAY_MS = 600;

function withCacheBuster(url: string): string {
  // Preserve existing query string; append a retry marker.
  return url + (url.includes('?') ? '&' : '?') + 'r=1';
}

export default function SmartImage({ src, alt = '', className, style, onError, ...rest }: SmartImageProps) {
  const original = src ?? '';
  const [currentSrc, setCurrentSrc] = useState(original);
  const [failed, setFailed] = useState(false);
  const [retried, setRetried] = useState(false);

  // Reset when the incoming src changes (e.g. carousel swipe, new post).
  useEffect(() => {
    setCurrentSrc(original);
    setFailed(false);
    setRetried(false);
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        if (!retried) {
          // First failure: retry once after a short delay with a
          // cache-buster so the browser doesn't reuse the failed entry.
          setRetried(true);
          setTimeout(() => setCurrentSrc(withCacheBuster(original)), RETRY_DELAY_MS);
        } else {
          setFailed(true);
        }
        onError?.(e);
      }}
    />
  );
}
