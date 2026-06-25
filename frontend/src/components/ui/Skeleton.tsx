'use client';

import { memo } from 'react';

/**
 * Skeleton primitives — shimmer blocks used by every page-level
 * `loading.tsx` and by inline `isLoading` states. The CSS keyframe
 * `social-shimmer` is defined in `globals.css` line 705-720 (and
 * `shimmerSweep` for `.shimmer-track`). Both animations loop
 * infinitely; the wrappers below don't need any state.
 *
 * Two flavours:
 * - <ShimmerBlock/> — uses the inline-styled approach from
 *   PostCard's ShimmerBlock (works inside dynamic content where
 *   we don't want to add another CSS class).
 * - <Skeleton/> — uses the .shimmer-track CSS class. Slightly
 *   cheaper (GPU-composited via the ::after pseudo-element)
 *   and matches ProjectsSkeleton.
 *
 * Use whichever fits the parent layout. They look identical to
 * the user — the difference is purely where the gradient lives.
 */

interface ShimmerBlockProps {
  className?: string;
  rounded?: 'rounded' | 'rounded-full' | 'rounded-lg' | 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  style?: React.CSSProperties;
}

/**
 * Shimmer block — a div with a 1.6s sliding gradient overlay.
 * Use this when you can't add the `.shimmer-track` class to the
 * wrapper (e.g. inside framer-motion containers or animated
 * layouts that already manage overflow).
 */
export const ShimmerBlock = memo(function ShimmerBlock({
  className = '',
  rounded = 'rounded',
  style,
}: ShimmerBlockProps) {
  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', ...style }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.10) 50%, transparent 100%)',
          animation: 'social-shimmer 1.6s ease-in-out infinite',
        }}
      />
    </div>
  );
});

interface SkeletonProps {
  className?: string;
  rounded?: 'rounded' | 'rounded-full' | 'rounded-lg' | 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
}

/**
 * Skeleton — uses the `.shimmer-track` CSS class. The gradient
 * lives in a `::after` pseudo-element so the wrapper itself stays
 * a plain block (better for layout/padding semantics).
 */
export const Skeleton = memo(function Skeleton({
  className = '',
  rounded = 'rounded',
}: SkeletonProps) {
  return <div className={`shimmer-track ${rounded} ${className}`} />;
});

/**
 * ProfileHeaderSkeleton — used by /profile and /profile/[id]
 * while the user record + stats load.
 */
export const ProfileHeaderSkeleton = memo(function ProfileHeaderSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading profile"
    >
      {/* Cover photo area */}
      <Skeleton className="h-32 sm:h-44 w-full mb-6" rounded="rounded-xl" />
      {/* Avatar + name row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 px-2">
        <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 ring-4 ring-darkbg" rounded="rounded-full" />
        <div className="flex-1 space-y-3 pb-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" rounded="rounded-lg" />
      </div>
    </div>
  );
});

/**
 * PostCardSkeleton — used by the social feed / blog list while
 * posts hydrate. Layout mirrors the real PostCard so there's no
 * jump when data arrives.
 */
export const PostCardSkeleton = memo(function PostCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading post"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10" rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <Skeleton className="w-6 h-6" rounded="rounded" />
      </div>
      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      {/* Optional media */}
      <Skeleton className="h-48 w-full mb-4" rounded="rounded-xl" />
      {/* Action bar */}
      <div
        className="flex items-center gap-6 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Skeleton className="h-7 w-16" rounded="rounded-lg" />
        <Skeleton className="h-7 w-16" rounded="rounded-lg" />
        <Skeleton className="h-7 w-16" rounded="rounded-lg" />
        <Skeleton className="h-7 w-16 ml-auto" rounded="rounded-lg" />
      </div>
    </div>
  );
});

/**
 * PostCardSkeletonList — renders N PostCardSkeleton stacked with
 * a small stagger delay so the wave effect reads as "things
 * arriving" instead of "everything in lockstep".
 */
export function PostCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 80}ms` }}>
          <PostCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/**
 * NotesListSkeleton — used by /notes while the tree + active
 * note content hydrate.
 */
export const NotesListSkeleton = memo(function NotesListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label="Loading notes">
      {/* Editor area */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Title */}
        <Skeleton className="h-8 w-2/3 mb-6" />
        {/* Toolbar */}
        <div className="flex gap-2 mb-4 pb-3 border-b border-white/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" rounded="rounded-md" />
          ))}
        </div>
        {/* Content lines */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-9/12" />
          <Skeleton className="h-32 w-full" rounded="rounded-lg" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-8/12" />
        </div>
      </div>
    </div>
  );
});

/**
 * MessageThreadSkeleton — used by /messages while thread list
 * and active conversation hydrate.
 */
export const MessageThreadSkeleton = memo(function MessageThreadSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-4rem)]" role="status" aria-busy="true" aria-label="Loading messages">
      {/* Sidebar */}
      <div
        className="w-72 border-r border-white/5 p-3 space-y-2 hidden md:block"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="w-10 h-10" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
      {/* Active thread */}
      <div className="flex-1 flex flex-col">
        {/* Thread header */}
        <div
          className="flex items-center gap-3 p-4 border-b border-white/5"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <Skeleton className="w-10 h-10" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-hidden">
          {/* Incoming */}
          <div className="flex gap-2 max-w-[70%]">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <Skeleton className="h-16 flex-1" rounded="rounded-2xl" />
          </div>
          {/* Outgoing */}
          <div className="flex gap-2 max-w-[70%] ml-auto flex-row-reverse">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <Skeleton className="h-12 flex-1" rounded="rounded-2xl" />
          </div>
          <div className="flex gap-2 max-w-[60%]">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <Skeleton className="h-10 flex-1" rounded="rounded-2xl" />
          </div>
          <div className="flex gap-2 max-w-[65%] ml-auto flex-row-reverse">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <Skeleton className="h-20 flex-1" rounded="rounded-2xl" />
          </div>
        </div>
        {/* Composer */}
        <div
          className="p-3 border-t border-white/5"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <Skeleton className="h-11 w-full" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
});

/**
 * CourseCardSkeleton — used by /courses and /my-courses while
 * course list hydrates.
 */
export const CourseCardSkeleton = memo(function CourseCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading course"
    >
      <Skeleton className="h-40 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-6 w-6" rounded="rounded-full" />
          <Skeleton className="h-3 w-20" />
          <div className="ml-auto flex gap-1">
            <Skeleton className="h-5 w-12" rounded="rounded" />
            <Skeleton className="h-5 w-12" rounded="rounded" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" rounded="rounded-lg" />
      </div>
    </div>
  );
});

export function CourseCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading courses"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 60}ms` }}>
          <CourseCardSkeleton />
        </div>
      ))}
    </div>
  );
}

/**
 * ChatHistorySkeleton — used by /chat while AI chat sessions
 * hydrate.
 */
export const ChatHistorySkeleton = memo(function ChatHistorySkeleton() {
  return (
    <div className="flex h-[calc(100dvh-4rem)]" role="status" aria-busy="true" aria-label="Loading chat history">
      {/* Sessions sidebar */}
      <div
        className="w-72 border-r border-white/5 p-3 space-y-2 hidden md:block overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <Skeleton className="h-10 w-full mb-3" rounded="rounded-lg" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="p-2 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
      {/* Message area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-4 overflow-hidden">
          {/* User msg */}
          <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <Skeleton className="h-12 flex-1" rounded="rounded-2xl" />
          </div>
          {/* AI msg */}
          <div className="flex gap-3 max-w-[85%]">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" rounded="rounded-2xl" />
              <Skeleton className="h-4 w-11/12" rounded="rounded-2xl" />
              <Skeleton className="h-4 w-3/4" rounded="rounded-2xl" />
            </div>
          </div>
          {/* User msg */}
          <div className="flex gap-3 max-w-[60%] ml-auto flex-row-reverse">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <Skeleton className="h-10 flex-1" rounded="rounded-2xl" />
          </div>
          {/* AI msg (streaming) */}
          <div className="flex gap-3 max-w-[80%]">
            <Skeleton className="w-8 h-8 flex-shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" rounded="rounded-2xl" />
              <Skeleton className="h-4 w-2/3" rounded="rounded-2xl" />
            </div>
          </div>
        </div>
        {/* Composer */}
        <div
          className="p-4 border-t border-white/5"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <Skeleton className="h-12 w-full" rounded="rounded-2xl" />
        </div>
      </div>
    </div>
  );
});

/**
 * AdminTableSkeleton — used by /admin/* pages while list data
 * hydrates. Mirrors a generic table layout with rows.
 */
export const AdminTableSkeleton = memo(function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading table"
    >
      {/* Header */}
      <div
        className="grid grid-cols-12 gap-4 p-4 border-b border-white/5"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <Skeleton className="h-3 col-span-1" />
        <Skeleton className="h-3 col-span-4" />
        <Skeleton className="h-3 col-span-3" />
        <Skeleton className="h-3 col-span-2" />
        <Skeleton className="h-3 col-span-2" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-b-0 items-center"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <Skeleton className="h-10 w-10 col-span-1" rounded="rounded-lg" />
          <div className="col-span-4 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-3 col-span-3" />
          <Skeleton className="h-6 w-20 col-span-2" rounded="rounded-full" />
          <div className="col-span-2 flex gap-2 justify-end">
            <Skeleton className="h-8 w-8" rounded="rounded-md" />
            <Skeleton className="h-8 w-8" rounded="rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
});

/**
 * DashboardSkeleton — used by /dashboard while KPI cards +
 * chart data hydrate.
 */
export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading dashboard">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {/* KPI cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-6" rounded="rounded-md" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" rounded="rounded-md" />
        </div>
        <Skeleton className="h-64 w-full" rounded="rounded-xl" />
      </div>
    </div>
  );
});