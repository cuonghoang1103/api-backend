import { DashboardSkeleton } from '@/components/ui/Skeleton'

// Loading state for /admin (admin dashboard landing). Mirrors
// the KPI + activity layout that the AdminDashboardClient
// renders.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <DashboardSkeleton />
    </div>
  )
}