import { ProfileHeaderSkeleton } from '@/components/ui/Skeleton'

// Loading state for /profile (own profile) and /profile/[id] (public).
// Renders while the user record + post history hydrate. The
// header skeleton mirrors the real layout so there's no jump when
// data arrives.
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <ProfileHeaderSkeleton />

      {/* Tabs placeholder */}
      <div className="mt-8 flex gap-2 border-b border-white/5 pb-2">
        <div className="shimmer-track h-9 w-24 rounded-lg" />
        <div className="shimmer-track h-9 w-24 rounded-lg" />
        <div className="shimmer-track h-9 w-24 rounded-lg" />
      </div>

      {/* Posts grid placeholder */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
            <div className="shimmer-track h-3 w-4/6 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}