'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

// ─── Avatar size map ─────────────────────────────────────────────────────────

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

export type AvatarSizePreset = keyof typeof SIZE_MAP;

// ─── Props ───────────────────────────────────────────────────────────────────

export interface UserAvatarProps {
  /**
   * User object. If omitted, the component reads from `useAuthStore`.
   * Supports partial users (e.g. `{ id, displayName, avatarUrl }`).
   */
  user?: Partial<User> | null;
  /**
   * Size preset or a pixel number. Defaults to 'md' (40px).
   */
  size?: AvatarSizePreset | number;
  /**
   * Show an online/active ring around the avatar.
   * @default false
   */
  showStatusRing?: boolean;
  /**
   * Optional CSS class overrides.
   */
  className?: string;
  /**
   * When true, wraps the avatar in a Next.js `<Link>` pointing to
   * `/profile/{user.id}/v2`. Only applied when `user` is provided and
   * has an `id`.
   * @default false
   */
  linkToProfile?: boolean;
  /**
   * ARIA label override. Defaults to the user's display name.
   */
  ariaLabel?: string;
}

// ─── Deterministic colour from string ────────────────────────────────────────

/** Returns a consistent bg-gradient string for a given seed (user id / name). */
function gradientForSeed(seed: string): string {
  // Pick two neon-adjacent hues from the project's palette (0-360).
  const hue1 = (seed.charCodeAt(0) * 137 + (seed.length % 7) * 53) % 360;
  const hue2 = (hue1 + 60 + (seed.charCodeAt(seed.length - 1) % 5) * 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1},70%,55%), hsl(${hue2},70%,45%))`;
}

// ─── Initials helper ─────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Avatar URL resolver ──────────────────────────────────────────────────────

/** Resolve the avatar URL from a user object, checking common field names. */
function resolveAvatarUrl(user: Partial<User> | null | undefined): string | undefined {
  if (!user) return undefined;
  return (
    user.avatarUrl ?? (user as unknown as { avatar?: string }).avatar ??
    (user as unknown as { photoURL?: string }).photoURL ??
    (user as unknown as { image?: string }).image
  );
}

// ─── Display name resolver ────────────────────────────────────────────────────

function resolveDisplayName(user: Partial<User> | null | undefined): string {
  if (!user) return 'Người dùng';
  return (
    user.displayName ?? user.fullName ?? user.username ?? 'User'
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function UserAvatarSkeleton({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-darkcard ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UserAvatar({
  user,
  size = 'md',
  showStatusRing = false,
  className = '',
  linkToProfile = false,
  ariaLabel,
}: UserAvatarProps) {
  // ── Read from auth store when no user is passed ──────────────────────────
  const storeUser = useAuthStore((s) => s.user);
  console.log('[UserAvatar] storeUser:', JSON.stringify(storeUser));
  const resolvedUser = user ?? storeUser ?? undefined;

  const avatarUrl = useMemo(() => resolveAvatarUrl(resolvedUser), [resolvedUser]);
  console.log('[UserAvatar] resolvedUser avatarUrl:', avatarUrl);
  const displayName = useMemo(() => resolveDisplayName(resolvedUser), [resolvedUser]);
  const userId = resolvedUser?.id;

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];

  const [imageError, setImageError] = useState(false);
  const handleError = useCallback(() => setImageError(true), []);
  const handleLoad = useCallback(() => setImageError(false), []);

  // ── Decide what to render ────────────────────────────────────────────────
  const showImage = Boolean(avatarUrl) && !imageError;
  const showInitials = !showImage && displayName && displayName !== 'Người dùng' && displayName !== 'User';
  const showIcon = !showImage && !showInitials;

  const seed = userId?.toString() ?? displayName ?? 'anon';
  const gradient = useMemo(() => gradientForSeed(seed), [seed]);

  // Ring colours
  const ringClass = showStatusRing
    ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-darkbg'
    : '';

  const wrapperStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    flexShrink: 0,
  };

  const fontSize = Math.max(10, pixelSize * 0.38);

  // ── Render ───────────────────────────────────────────────────────────────
  const avatarContent = (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-darkcard ${ringClass} ${className}`}
      style={wrapperStyle}
      role="img"
      aria-label={ariaLabel ?? displayName}
    >
      {/* Online dot */}
      {showStatusRing && (
        <span
          className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-darkbg bg-green-400"
          aria-label="Online"
        />
      )}

      {/* 1️⃣ Image */}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl!}
          alt={displayName}
          width={pixelSize}
          height={pixelSize}
          loading="lazy"
          decoding="async"
          onError={handleError}
          onLoad={handleLoad}
          className="h-full w-full object-cover"
        />
      )}

      {/* 2️⃣ Initials on gradient circle */}
      {showInitials && (
        <div
          className="flex h-full w-full items-center justify-center font-bold text-white"
          style={{
            background: gradient,
            fontSize,
          }}
        >
          {getInitials(displayName)}
        </div>
      )}

      {/* 3️⃣ Neutral person icon */}
      {showIcon && (
        <div
          className="flex h-full w-full items-center justify-center bg-darkcard text-text-muted"
        >
          <UserIcon
            size={pixelSize * 0.55}
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  );

  // ── Optional profile link ────────────────────────────────────────────────
  if (linkToProfile && userId != null) {
    return (
      <Link
        href={`/profile/${userId}/v2`}
        className="inline-block flex-shrink-0"
        aria-label={`Xem trang cá nhân của ${displayName}`}
      >
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
}

// ─── Convenience re-exports ────────────────────────────────────────────────────

export default UserAvatar;
