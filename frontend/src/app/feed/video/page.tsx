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
  // Carry over the video-category filter (?vc=) so the reel stays scoped to
  // the same category the user tapped from on the home feed.
  const vcRaw = params.get('vc');
  const videoCategoryId = vcRaw ? Number(vcRaw) : undefined;
  return (
    <VerticalVideoFeed
      startPostId={Number.isNaN(startPostId) ? undefined : startPostId}
      videoCategoryId={videoCategoryId && !Number.isNaN(videoCategoryId) ? videoCategoryId : undefined}
    />
  );
}

export default function FeedVideoPage() {
  // useSearchParams requires a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-black" />}>
      <VideoReel />
    </Suspense>
  );
}
