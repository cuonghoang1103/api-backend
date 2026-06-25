'use client';

// /feed/video — dedicated full-screen TikTok-style vertical video reel.
// Reached from the home feed's "Video" tab (thumbnail grid). Isolated
// from the 3-column home layout so it never fights it and so we can
// guarantee only one video plays at a time (see VerticalVideoFeed).

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import VerticalVideoFeed from '@/components/social/VerticalVideoFeed';

function VideoReel() {
  const params = useSearchParams();
  const startRaw = params.get('start');
  const startPostId = startRaw ? Number(startRaw) : undefined;
  return <VerticalVideoFeed startPostId={Number.isNaN(startPostId) ? undefined : startPostId} />;
}

export default function FeedVideoPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-black" />}>
      <VideoReel />
    </Suspense>
  );
}
