import { AdminTableSkeleton } from '@/components/ui/Skeleton'

// Loading state for /admin/posts. Mirrors the table layout
// (header row + N data rows + action buttons) so the page
// doesn't jump when posts arrive.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="shimmer-track h-8 w-40 rounded" />
          <div className="shimmer-track h-4 w-64 rounded" />
        </div>
        <div className="shimmer-track h-10 w-32 rounded-lg" />
      </div>

      <AdminTableSkeleton rows={10} />
    </div>
  )
}