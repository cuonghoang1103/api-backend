'use client';

import { useState } from 'react';

interface SafeAvatarProps {
  src?: string | null;
  alt: string;
  seed?: string;
  size?: number;
  rounded?: 'full' | '2xl' | 'lg' | 'md' | 'none';
  className?: string;
  /** Use DiceBear placeholder when the source is missing or 404s. */
  fallbackType?: 'initials' | 'avataaars' | 'shapes';
}

/**
 * Robust avatar component. Falls back to a DiceBear placeholder
 * whenever the user-supplied URL is missing, fails to load (404
 * after a server rebuild, broken uploads volume, etc.) or the
 * browser can't decode it. This keeps the profile and blog
 * surfaces looking complete even when stored files are gone.
 */
export default function SafeAvatar({
  src,
  alt,
  seed,
  size = 112,
  rounded = '2xl',
  className = '',
  fallbackType = 'initials',
}: SafeAvatarProps) {
  const [errored, setErrored] = useState(false);

  const showImage = src && !errored;
  const placeholderSeed = encodeURIComponent(seed || alt || 'anon');
  const placeholder =
    fallbackType === 'avataaars'
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${placeholderSeed}`
      : fallbackType === 'shapes'
      ? `https://api.dicebear.com/7.x/shapes/svg?seed=${placeholderSeed}`
      : `https://api.dicebear.com/9.x/initials/svg?seed=${placeholderSeed}`;

  const radius =
    rounded === 'full' ? 'rounded-full' : rounded === '2xl' ? 'rounded-2xl' : rounded === 'lg' ? 'rounded-lg' : rounded === 'md' ? 'rounded-md' : '';
  const dim = { width: size, height: size };

  if (showImage) {
    return (
      <img
        src={src!}
        alt={alt}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        className={`${radius} object-cover ${className}`}
        style={dim}
      />
    );
  }

  // Initials placeholder rendered inline so it works even when
  // the network is down (DiceBear requires internet).
  if (fallbackType === 'initials') {
    const initial = (alt || '?').trim().charAt(0).toUpperCase();
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-neon-indigo to-neon-violet text-white font-bold ${radius} ${className}`}
        style={{ ...dim, fontSize: Math.max(20, size * 0.4) }}
        role="img"
        aria-label={alt}
      >
        {initial}
      </div>
    );
  }

  // DiceBear SVG placeholder (network-dependent).
  return (
    <img
      src={placeholder}
      alt={alt}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={`${radius} bg-white/5 ${className}`}
      style={dim}
    />
  );
}
