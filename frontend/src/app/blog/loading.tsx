// Loading state for /blog (post list). Uses a 2-column grid of
// post-card-shaped skeletons matching the real BlogCard layout.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-48 rounded" />
        <div className="shimmer-track h-4 w-72 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="shimmer-track h-44 w-full" />
            <div className="p-5 space-y-3">
              <div className="shimmer-track h-5 w-3/4 rounded" />
              <div className="shimmer-track h-3 w-full rounded" />
              <div className="shimmer-track h-3 w-5/6 rounded" />
              <div className="flex items-center gap-2 pt-2">
                <div className="shimmer-track w-6 h-6 rounded-full" />
                <div className="shimmer-track h-3 w-20 rounded" />
                <div className="ml-auto shimmer-track h-3 w-12 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}