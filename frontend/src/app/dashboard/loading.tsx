import { DashboardSkeleton } from '@/components/ui/Skeleton'

// Loading state for /dashboard. Mirrors the KPI-cards + chart
// layout so the first paint doesn't jump when the metrics
// arrive.
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <DashboardSkeleton />
    </div>
  )
}