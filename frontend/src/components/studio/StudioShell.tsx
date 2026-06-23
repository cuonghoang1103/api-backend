'use client';

// StudioShell — the outermost wrapper for every page in
// the /creator area. Composes the three studio layers
// (background z=0, ambient z=1, content z=10+) and the
// sticky topbar.
//
// Why this exists as a single component rather than in
// app/creator/layout.tsx directly:
// • Easier to unit-test the layering in isolation
// • Other layouts (e.g. a future "preview" mode) can
// reuse the same visual scaffolding without copying it
// • The framer-motion + framer-motion-aware hooks stay
// client-only — `app/creator/layout.tsx` can stay
// server-rendered for the auth check.

import { ReactNode } from 'react';
import StudioBackground from './StudioBackground';
import StudioAmbient from './StudioAmbient';
import StudioTopbar from './StudioTopbar';

export default function StudioShell({ children }: { children: ReactNode }) {
 return (
 <div className="relative min-h-[calc(100vh-4rem)] text-text-primary">
 {/* z=0 — background grid + amber key light + vignette */}
 <StudioBackground />
 {/* z=1 — film grain + drifting practical-light bokeh */}
 <StudioAmbient />
 {/* z=20 — sticky amber topbar (sits above the global navbar
 pt-16 already accounted for by min-h calc) */}
 <StudioTopbar />
 {/* z=10 — main content. Negative top pulls content up
 under the topbar so the page can scroll under it. */}
 <main className="relative" style={{ zIndex: 10 }}>
 {children}
 </main>
 </div>
 );
}
