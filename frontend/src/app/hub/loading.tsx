// Loading state for /hub (dev hub). Mirrors the post-list +
// upload-CTA layout. Hub uses shorter posts than the social
// feed so cards are more compact.
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero / upload CTA */}
      <div
        className="rounded-2xl p-6 mb-6 space-y-3"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="shimmer-track h-7 w-48 rounded" />
        <div className="shimmer-track h-4 w-72 rounded" />
        <div className="shimmer-track h-10 w-40 rounded-lg" />
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 space-y-2"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div className="shimmer-track h-32 w-full rounded-lg" />
            <div className="shimmer-track h-4 w-3/4 rounded" />
            <div className="shimmer-track h-3 w-full rounded" />
            <div className="flex items-center gap-2 pt-1">
              <div className="shimmer-track w-5 h-5 rounded-full" />
              <div className="shimmer-track h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}