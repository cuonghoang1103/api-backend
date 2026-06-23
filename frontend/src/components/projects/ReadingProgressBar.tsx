'use client';

import { useEffect, useRef, useState } from 'react';

interface ReadingProgressBarProps {
 /** CSS selector for the content wrapper whose scroll
 progress to track. If not provided, the document body
 is used. Measuring a wrapper (not the whole page)
 means the bar reflects case-study reading, not page
 chrome. */
 targetSelector?: string;
}

/**
 * ReadingProgressBar — fixed 2px gradient bar at the top
 * of the viewport. Tracks how far the user has scrolled
 * through the target wrapper (or document, if no
 * wrapper). rAF-throttled so it stays smooth even on
 * long pages.
 */
export default function ReadingProgressBar({ targetSelector }: ReadingProgressBarProps) {
 const [progress, setProgress] = useState(0);
 const rafRef = useRef<number | null>(null);

 useEffect(() => {
 const target = targetSelector ? document.getElementById(targetSelector) : null;

 const update = () => {
 rafRef.current = null;
 let pct = 0;
 if (target) {
 const rect = target.getBoundingClientRect();
 const total = rect.height - window.innerHeight;
 const scrolled = -rect.top;
 pct = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
 } else {
 const doc = document.documentElement;
 const total = doc.scrollHeight - window.innerHeight;
 pct = total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
 }
 setProgress(pct);
 };

 const schedule = () => {
 if (rafRef.current !== null) return;
 rafRef.current = requestAnimationFrame(update);
 };

 schedule();
 window.addEventListener('scroll', schedule, { passive: true });
 window.addEventListener('resize', schedule);

 return () => {
 window.removeEventListener('scroll', schedule);
 window.removeEventListener('resize', schedule);
 if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
 };
 }, [targetSelector]);

 return (
 <div
 className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
 style={{ height: '2px' }}
 aria-hidden
 >
 <div
 className="h-full transition-[width] duration-75 ease-linear"
 style={{
 width: `${progress * 100}%`,
 background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%)',
 boxShadow: '0 0 8px rgba(168,85,247,0.6)',
 }}
 />
 </div>
 );
}