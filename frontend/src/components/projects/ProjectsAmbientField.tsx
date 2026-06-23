'use client';

// ProjectsAmbientField — the slow, living background for the
// /projects page. Two large radial-gradient "aurora" blobs
// drift on transform-only keyframe loops (44s + 56s) so they
// stay GPU-friendly and never cause layout thrash. A faint
// CSS grid + a noise overlay sit on top for the high-end
// tech texture.
//
// The wrapper has `pointer-events: none` and is placed at
// z-index 1 so it sits ABOVE the existing matrix-rain canvas
// (z=0) and BELOW the page content (z=10+). It is purely
// decorative — it never intercepts clicks.
//
// If the user has prefers-reduced-motion: reduce, the global
// CSS in globals.css already kills the keyframe animations.
// We also early-return the motion divs in that case to skip
// the Framer Motion mount entirely.

import { useReducedMotion } from 'framer-motion';

export default function ProjectsAmbientField() {
 const prefersReducedMotion = useReducedMotion();

 // If the user opted out of motion, we still want a flat
 // version of the field (the gradients + grid + noise) so
 // the page doesn't lose its atmosphere. Only the drift
 // animations are skipped via the global CSS rule.
 return (
 <div
 className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
 style={{ zIndex: 1 }}
 aria-hidden="true"
 >
 {/* CSS grid texture — always present, fixed cost. */}
 <div className="absolute inset-0 grid-overlay opacity-60" />

 {/* Aurora blob 1 — violet, drifts on the slow loop. */}
 {!prefersReducedMotion && (
 <div
 className="absolute animate-aurora-drift-slow"
 style={{
 top: '-15%',
 left: '-10%',
 width: '70vw',
 height: '70vw',
 maxWidth: '1100px',
 maxHeight: '1100px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.32) 0%, rgba(139, 92, 246, 0.12) 30%, transparent 60%)',
 filter: 'blur(60px)',
 willChange: 'transform',
 }}
 />
 )}

 {/* Aurora blob 2 — indigo, drifts on a different loop so
 * the two blobs never sync up (looks more organic). */}
 {!prefersReducedMotion && (
 <div
 className="absolute animate-aurora-drift-slower"
 style={{
 bottom: '-20%',
 right: '-15%',
 width: '80vw',
 height: '80vw',
 maxWidth: '1200px',
 maxHeight: '1200px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.26) 0%, rgba(99, 102, 241, 0.08) 30%, transparent 60%)',
 filter: 'blur(70px)',
 willChange: 'transform',
 }}
 />
 )}

 {/* Static fallback gradient — visible only when motion is
 * reduced, so the page still has color instead of going
 * completely flat. */}
 {prefersReducedMotion && (
 <div
 className="absolute inset-0"
 style={{
 background:
 'radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.18) 0%, transparent 50%), ' +
 'radial-gradient(ellipse at 70% 80%, rgba(99, 102, 241, 0.14) 0%, transparent 50%)',
 }}
 />
 )}

 {/* Cyan accent orb — small, third of the screen, top
 * right. Adds a third color so the violet/indigo pair
 * doesn't feel monotone. */}
 {!prefersReducedMotion && (
 <div
 className="absolute animate-aurora-drift-slow"
 style={{
 top: '30%',
 right: '10%',
 width: '40vw',
 height: '40vw',
 maxWidth: '600px',
 maxHeight: '600px',
 background:
 'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.10) 0%, transparent 60%)',
 filter: 'blur(50px)',
 willChange: 'transform',
 // 28s delay so the three blobs never align.
 animationDelay: '-28s',
 }}
 />
 )}

 {/* Top + bottom edge fade — keeps the content readable
 * by darkening the bands where the eyebrow + first row
 * of cards live. Uses two linear-gradients. */}
 <div
 className="absolute inset-x-0 top-0 h-64"
 style={{
 background: 'linear-gradient(to bottom, #0a0a0f 0%, transparent 100%)',
 }}
 />
 <div
 className="absolute inset-x-0 bottom-0 h-64"
 style={{
 background: 'linear-gradient(to top, #0a0a0f 0%, transparent 100%)',
 }}
 />

 {/* Noise overlay — last so it sits on top of the blobs
 * and grid, adding the film grain. */}
 <div className="absolute inset-0 noise-overlay" />
 </div>
 );
}
