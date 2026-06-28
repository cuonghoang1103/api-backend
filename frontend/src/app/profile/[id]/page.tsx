'use client';

/**
 * /profile/[id] — Redirect to v2 page.
 * 
 * This page now redirects to the new /v2 version which has
 * the professional Facebook/Instagram style profile.
 */

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      router.replace(`/profile/${id}/v2`);
    }
  }, [id, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-text-muted">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neon-violet/20 border-t-neon-violet" />
        <span className="text-sm">Đang chuyển hướng...</span>
      </div>
    </div>
  );
}
