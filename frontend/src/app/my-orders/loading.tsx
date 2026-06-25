// Loading state for /my-orders. Order history list.
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-40 rounded" />
        <div className="shimmer-track h-4 w-64 rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="shimmer-track h-4 w-40 rounded" />
                <div className="shimmer-track h-3 w-24 rounded" />
              </div>
              <div className="shimmer-track h-7 w-24 rounded-full" />
            </div>
            <div className="shimmer-track h-px w-full rounded-full" />
            <div className="flex items-center gap-3">
              <div className="shimmer-track w-12 h-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-4 w-3/4 rounded" />
                <div className="shimmer-track h-3 w-1/2 rounded" />
              </div>
              <div className="shimmer-track h-6 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}