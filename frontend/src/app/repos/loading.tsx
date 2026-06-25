// Loading state for /repos and /repos/[id]. The list page is a
// grid of repository cards; the detail page has a sidebar +
// file tree. We render a card-grid skeleton for the catch-all
// route and let nested [id]/loading.tsx override the detail.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 space-y-2">
        <div className="shimmer-track h-9 w-48 rounded" />
        <div className="shimmer-track h-4 w-72 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 50}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="shimmer-track w-10 h-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-track h-4 w-3/4 rounded" />
                <div className="shimmer-track h-3 w-1/2 rounded" />
              </div>
            </div>
            <div className="shimmer-track h-3 w-full rounded" />
            <div className="shimmer-track h-3 w-5/6 rounded" />
            <div className="flex items-center gap-2 pt-2">
              <div className="shimmer-track h-5 w-12 rounded" />
              <div className="shimmer-track h-5 w-12 rounded" />
              <div className="ml-auto shimmer-track h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}