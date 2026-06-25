// Loading state for /projects. Reuses the project-card layout
// (image + meta + chips + actions) that the real ProjectCard
// uses, so the page transition is jump-free.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shimmer-track h-9 w-24 rounded-full"
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
              animationDelay: `${i * 80}ms`,
            }}
          >
            <div className="shimmer-track h-48 w-full" />
            <div className="p-5 space-y-3 flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="shimmer-track h-5 flex-1 rounded-md" />
                <div className="shimmer-track h-4 w-16 rounded-full" />
              </div>
              <div className="shimmer-track h-3.5 rounded w-full" />
              <div className="shimmer-track h-3.5 rounded w-2/3" />
              <div className="flex gap-1.5 pt-1">
                <div className="shimmer-track h-5 w-12 rounded" />
                <div className="shimmer-track h-5 w-16 rounded" />
                <div className="shimmer-track h-5 w-10 rounded" />
              </div>
              <div className="flex-1" />
              <div className="flex gap-2 pt-3 border-t border-white/[0.04]">
                <div className="shimmer-track h-9 flex-1 rounded-lg" />
                <div className="shimmer-track h-9 w-9 rounded-lg" />
                <div className="shimmer-track h-9 w-9 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}