// Loading state for /music. Mirrors the track-list + sidebar
// layout.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-48 rounded" />
        <div className="shimmer-track h-4 w-72 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Track list */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 border-b border-white/5 last:border-b-0"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="shimmer-track w-12 h-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-4 w-3/4 rounded" />
                <div className="shimmer-track h-3 w-1/2 rounded" />
              </div>
              <div className="shimmer-track h-8 w-20 rounded-md" />
            </div>
          ))}
        </div>
        {/* Sidebar */}
        <div
          className="rounded-2xl p-4 space-y-3 hidden lg:block"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="shimmer-track h-5 w-32 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="shimmer-track w-10 h-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-3 w-3/4 rounded" />
                <div className="shimmer-track h-2.5 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}