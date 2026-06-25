import { ProfileHeaderSkeleton } from '@/components/ui/Skeleton'

// Loading state for /profile/[id] (public profile). Uses the
// same skeleton as the own-profile page because the layout is
// shared — just the source of data differs.
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <ProfileHeaderSkeleton />

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 space-y-2"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="shimmer-track h-3 w-16 rounded" />
            <div className="shimmer-track h-6 w-12 rounded" />
          </div>
        ))}
      </div>

      {/* Posts placeholder */}
      <div className="mt-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 80}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="shimmer-track w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-3 w-24 rounded" />
                <div className="shimmer-track h-2.5 w-16 rounded" />
              </div>
            </div>
            <div className="shimmer-track h-3 w-full rounded" />
            <div className="shimmer-track h-3 w-5/6 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}