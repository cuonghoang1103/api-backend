'use client';

import { useMessagingStore } from '@/store/messagingStore';

/**
 * Small reusable badge showing the total unread count.
 * Mount wherever a chat icon is shown (NavBar, dock, …).
 */
export default function UnreadBadge({ className = '' }: { className?: string }) {
  const total = useMessagingStore((s) => s.unreadTotal);
  if (total <= 0) return null;
  return (
    <span
      className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-bold text-white ${className}`}
    >
      {total > 9 ? '9+' : total}
    </span>
  );
}
