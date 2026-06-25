import { CourseCardSkeletonList } from '@/components/ui/Skeleton'

// Loading state for /courses (course catalog). Mirrors the
// course grid so the transition from skeleton → real cards is
// layout-shift-free.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-48 rounded" />
        <div className="shimmer-track h-4 w-72 rounded" />
      </div>

      {/* Filters bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shimmer-track h-9 w-24 rounded-full"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>

      <CourseCardSkeletonList count={6} />
    </div>
  )
}