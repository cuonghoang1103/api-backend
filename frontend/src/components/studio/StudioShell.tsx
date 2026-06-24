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
 <div className="relative min-h-[100dvh] text-text-primary">
 {/* z=0 — background grid + amber key light + vignette */}
 <StudioBackground />
 {/* z=1 — film grain + drifting practical-light bokeh */}
 <StudioAmbient />
 {/* z=30 — sticky amber topbar. The site-wide Navbar +
 NavigationDock + FloatingAIAssistant are all hidden on
 /creator (see app/creator/layout.tsx and the path-aware
 returns in those components), so z=30 only has to beat
 the studio's own z=10 content — but we keep it above
 the studio's bg/ambient layers (z=0/1) for clarity. */}
 <StudioTopbar />
 {/* z=10 — main content. Sits below the topbar so the
 topbar can stick on top while the page scrolls under it. */}
 <main className="relative pt-14" style={{ zIndex: 10 }}>
 {children}
 </main>
 </div>
 );
}
