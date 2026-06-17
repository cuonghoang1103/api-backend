'use client';

import { useState, type ImgHTMLAttributes, type ReactNode } from 'react';

/**
 * SafeImage — `<img>` with built-in broken-state fallback.
 *
 * Why: a few uploads in the DB point at files that were
 * never persisted to the host volume (early deploys before
 * the `uploads_data` mount was wired up). The URLs resolve
 * to 404, the browser shows the "broken image" icon, and
 * users can't tell the difference between "we don't have
 * a cover" and "the file is missing". This component swaps
 * the broken `<img>` for a clean placeholder on the fly —
 * no layout shift, no flash, no console errors.
 *
 * SSR-safe: the failed state is local component state
 * (initialized to `false` and flipped on the `onError`
 * callback), so the server-rendered HTML and the first
 * client paint agree. No `typeof window` checks needed.
 */
export interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'children'> {
  /** Optional override of the fallback element. Default is a
   *  gradient + icon block sized to `className` or a 16:9 box. */
  fallback?: ReactNode;
  /** Label shown inside the default fallback. Helps the user
   *  see *which* image failed (useful for dev). */
  label?: string;
}

export function SafeImage({ src, alt, fallback, label, className, ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <>{fallback ?? <DefaultFallback className={className} label={label ?? alt ?? 'Image unavailable'} />}</>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}

function DefaultFallback({ className, label }: { className?: string; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={[
        className,
        'flex flex-col items-center justify-center gap-1.5',
        'bg-gradient-to-br from-neon-indigo/15 via-neon-violet/10 to-neon-fuchsia/10',
        'text-text-muted text-xs select-none',
        // Only apply a default aspect ratio when the caller
        // didn't give us sizing info — otherwise the parent
        // container is in charge.
        className?.includes('aspect-') ? '' : 'aspect-video',
      ].join(' ')}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="px-2 text-center line-clamp-2">{label}</span>
    </div>
  );
}

export default SafeImage;
