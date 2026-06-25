// Loading state for /cart. Two-column layout: items list + summary.
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-32 rounded" />
        <div className="shimmer-track h-4 w-56 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div className="shimmer-track w-20 h-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-4 w-3/4 rounded" />
                <div className="shimmer-track h-3 w-1/3 rounded" />
              </div>
              <div className="shimmer-track h-9 w-24 rounded-lg" />
            </div>
          ))}
        </div>
        <div
          className="rounded-2xl p-5 space-y-3 h-fit"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="shimmer-track h-5 w-32 rounded" />
          <div className="shimmer-track h-4 w-full rounded" />
          <div className="shimmer-track h-4 w-full rounded" />
          <div className="shimmer-track h-px w-full rounded-full" />
          <div className="shimmer-track h-6 w-1/2 rounded" />
          <div className="shimmer-track h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}