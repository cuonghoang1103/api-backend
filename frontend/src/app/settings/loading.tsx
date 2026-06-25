// Loading state for /settings. Mirrors the multi-section form
// layout (profile / security / notifications / account).
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-40 rounded" />
        <div className="shimmer-track h-4 w-64 rounded" />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-white/5 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shimmer-track h-9 w-28 rounded-lg"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>

      {/* Form sections */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="shimmer-track h-3 w-24 rounded" />
            <div className="shimmer-track h-11 w-full rounded-lg" />
            <div className="shimmer-track h-3 w-48 rounded" />
          </div>
        ))}
        <div className="shimmer-track h-11 w-32 rounded-lg" />
      </div>
    </div>
  )
}