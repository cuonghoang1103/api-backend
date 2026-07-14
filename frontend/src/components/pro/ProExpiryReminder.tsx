'use client';

/**
 * Shows a one-per-session reminder toast when a time-limited Pro membership is
 * within 7 days of expiring. Lifetime members and admins never see it. Mounted
 * globally in the root layout; relies on the shared usePro query.
 */
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { usePro } from '@/hooks/usePro';

export default function ProExpiryReminder() {
  const { status } = usePro();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    if (typeof window === 'undefined') return;
    if (!status.effective || status.isAdmin || status.lifetime || !status.expiresAt) return;

    const days = Math.ceil((new Date(status.expiresAt).getTime() - Date.now()) / 86_400_000);
    if (days < 0 || days > 7) return;

    // Once per session, keyed to the specific expiry (so a renewal re-arms it).
    if (sessionStorage.getItem('pro-expiry-warned') === status.expiresAt) return;
    shownRef.current = true;
    sessionStorage.setItem('pro-expiry-warned', status.expiresAt);

    toast.warning(
      days <= 0 ? 'Gói Pro của bạn hết hạn hôm nay!' : `Gói Pro của bạn còn ${days} ngày.`,
      {
        description: 'Gia hạn để không bị gián đoạn nhạc, AI Pro/Max và Academy.',
        duration: 9000,
        action: { label: 'Gia hạn', onClick: () => { window.location.href = '/pro'; } },
      },
    );
  }, [status]);

  return null;
}
