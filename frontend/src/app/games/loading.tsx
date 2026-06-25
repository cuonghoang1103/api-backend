// Loading state for /games (game list) and /games/[slug] (game
// detail). The list is a grid of game cards; we render that
// shape for the catch-all. The detail page has its own
// [slug]/loading.tsx.
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-40 rounded" />
        <div className="shimmer-track h-4 w-64 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="shimmer-track h-40 w-full" />
            <div className="p-4 space-y-2">
              <div className="shimmer-track h-4 w-3/4 rounded" />
              <div className="shimmer-track h-3 w-full rounded" />
              <div className="flex items-center gap-2 pt-2">
                <div className="shimmer-track h-6 w-16 rounded-full" />
                <div className="shimmer-track h-6 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}