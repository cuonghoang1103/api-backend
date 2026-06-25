import { AdminTableSkeleton } from '@/components/ui/Skeleton'

// Generic loading state for /admin sub-pages that share the
// header + table layout. Pages with custom shapes (e.g. music
// upload, AI analytics charts) should override this with their
// own loading.tsx in their own folder.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="shimmer-track h-8 w-40 rounded" />
          <div className="shimmer-track h-4 w-64 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="shimmer-track h-10 w-28 rounded-lg" />
          <div className="shimmer-track h-10 w-28 rounded-lg" />
        </div>
      </div>
      <AdminTableSkeleton rows={10} />
    </div>
  )
}