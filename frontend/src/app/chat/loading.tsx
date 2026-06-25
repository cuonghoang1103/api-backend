import { ChatHistorySkeleton } from '@/components/ui/Skeleton'

// Loading state for /chat. Renders the sessions-sidebar +
// streaming-message layout while sessions and the active
// conversation hydrate.
export default function Loading() {
  return <ChatHistorySkeleton />
}