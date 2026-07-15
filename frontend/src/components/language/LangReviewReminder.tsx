'use client';

/**
 * Once-per-day reminder toast when the user has language-notebook cards due for
 * review. Mounted globally in the root layout; no-op for guests. Keyed on the
 * calendar day via sessionStorage so it fires at most once per day per session.
 */
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { notebookApi } from '@/lib/language-api';

export default function LangReviewReminder() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current || !isAuthenticated || typeof window === 'undefined') return;
    const today = new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem('lang-review-reminded') === today) return;
    shownRef.current = true;
    notebookApi
      .languages()
      .then((r) => {
        const total = (r.data.data ?? []).reduce((n, l) => n + (l.dueCount || 0), 0);
        if (total <= 0) { shownRef.current = false; return; } // re-check on a later navigation
        sessionStorage.setItem('lang-review-reminded', today);
        toast('📚 Đến giờ ôn tập ngôn ngữ', {
          description: `Bạn có ${total} thẻ cần ôn hôm nay trong sổ tay.`,
          duration: 9000,
          action: { label: 'Ôn ngay', onClick: () => { window.location.href = '/language/notebook'; } },
        });
      })
      .catch(() => { shownRef.current = false; });
  }, [isAuthenticated]);

  return null;
}
