'use client';

// ProjectsSkeleton — shimmer skeleton for the project grid
// while the API request is in flight. Renders 9 fake cards
// in the same 1/2/3-col responsive grid the real cards use,
// so the page never jumps when the data arrives.
//
// The shimmer effect is a 1.6s linear gradient sweep driven
// by a CSS keyframe (defined in globals.css + tailwind
// config). The gradient is a `::after` overlay on each
// `.shimmer-track` so the wrapper element doesn't need
// any state — it's pure CSS.

interface ProjectsSkeletonProps {
 count?: number;
}

export default function ProjectsSkeleton({ count = 9 }: ProjectsSkeletonProps) {
 return (
 <div
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
 role="status"
 aria-busy="true"
 aria-label="Loading projects"
 >
 {Array.from({ length: count }).map((_, i) => (
 <div
 key={i}
 className="rounded-3xl glass-frost overflow-hidden flex flex-col"
 // Stagger the shimmer start so the 9 cards don't all
 // flash in lockstep — gives a subtle "wave" feel.
 style={{ animationDelay: `${i * 80}ms` }}
 >
 {/* Image area — 16:10 ratio, shimmer-filled. */}
 <div className="shimmer-track h-48" />

 {/* Content area — three skeleton rows. */}
 <div className="p-5 space-y-3 flex-1 flex flex-col">
 {/* Title + tiny status pill row. */}
 <div className="flex items-center gap-2">
 <div className="shimmer-track h-5 rounded-md flex-1" />
 <div className="shimmer-track h-4 w-16 rounded-full" />
 </div>
 {/* Description line 1. */}
 <div className="shimmer-track h-3.5 rounded w-full" />
 {/* Description line 2 (shorter). */}
 <div className="shimmer-track h-3.5 rounded w-2/3" />
 {/* Tech chips row. */}
 <div className="flex gap-1.5 pt-1">
 <div className="shimmer-track h-5 w-12 rounded" />
 <div className="shimmer-track h-5 w-16 rounded" />
 <div className="shimmer-track h-5 w-10 rounded" />
 </div>
 {/* Spacer pushes the footer down so card heights match. */}
 <div className="flex-1" />
 {/* Action row. */}
 <div className="flex gap-2 pt-3 border-t border-white/[0.04]">
 <div className="shimmer-track h-9 flex-1 rounded-lg" />
 <div className="shimmer-track h-9 w-9 rounded-lg" />
 <div className="shimmer-track h-9 w-9 rounded-lg" />
 </div>
 </div>
 </div>
 ))}
 </div>
 );
}
