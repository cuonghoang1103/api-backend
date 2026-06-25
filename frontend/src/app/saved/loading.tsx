// Loading state for /saved (saved posts/collections). Mirrors
// the layout: tab pills + post grid.
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-40 rounded" />
        <div className="shimmer-track h-4 w-64 rounded" />
      </div>

      {/* Tab pills */}
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shimmer-track h-9 w-28 rounded-full"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>

      {/* Posts grid */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="shimmer-track w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-3 w-32 rounded" />
                <div className="shimmer-track h-2.5 w-20 rounded" />
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