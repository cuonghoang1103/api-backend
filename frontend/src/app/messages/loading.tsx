import { MessageThreadSkeleton } from '@/components/ui/Skeleton'

// Loading state for /messages. Reuses the dedicated thread
// skeleton which already mirrors the layout (sidebar +
// active conversation + composer).
export default function Loading() {
  return <MessageThreadSkeleton />
}