import { NotesListSkeleton } from '@/components/ui/Skeleton'

// Loading state for /notes. The page is split into a sidebar
// tree (subject / chapter / note) and the active-note editor,
// so the skeleton mirrors that two-column layout. The mobile
// layout collapses the sidebar to a drawer — we render a single
// editor skeleton because on mobile only one column shows at
// a time, and Next.js' viewport-aware layout will pick the
// right one at hydration time.
export default function Loading() {
  return (
    <div className="flex h-[calc(100dvh-4rem)]">
      {/* Sidebar tree skeleton */}
      <div
        className="hidden md:flex flex-col w-72 border-r border-white/5 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="p-3 border-b border-white/5">
          <div className="shimmer-track h-9 w-full rounded-lg" />
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 rounded-md"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="shimmer-track w-4 h-4 rounded" />
              <div
                className="shimmer-track h-3.5 rounded"
                style={{ width: `${50 + (i % 3) * 20}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Editor skeleton */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 sm:p-10">
          <NotesListSkeleton />
        </div>
      </div>
    </div>
  )
}