'use client';

// ProjectsHero — the redesigned hero for the /projects page.
//
// Layout:
// • Eyebrow chip (mono, "WORK · 2020 — PRESENT" with a
// pulsing green dot) — establishes the editorial tone
// • Display-font "My Projects" headline (Poppins 700,
// clamp(3.5rem, 9vw, 7.5rem), tight letter-spacing)
// • Subtitle (Inter 400, text-secondary)
// • Rotating tagline — 4 phrases fade-rotate every 3s with
// a blinking caret, mono font
// • Stats row — 3 live counters (projects / techs / featured)
// animated from 0 to value on mount via Framer Motion spring
// • Scroll cue at the bottom — pulsing vertical line
//
// The headline is split into per-word motion spans so the
// stagger is per-word (not per-letter) — looks more
// editorial and is much lighter on the GPU.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const TAGLINES = ['Full-stack', 'AI integrations', 'Dev tooling', 'Side projects'];

// Per-word stagger: each word slides up + fades in.
const headlineContainer = {
 hidden: {},
 visible: {
 transition: { staggerChildren: 0.07, delayChildren: 0.1 },
 },
};
const headlineWord = {
 hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
 visible: {
 opacity: 1,
 y: 0,
 filter: 'blur(0px)',
 transition: { type: 'spring' as const, stiffness: 90, damping: 16, mass: 0.8 },
 },
};

// Animated counter — drives a number from 0 to `value` over
// `duration` seconds on mount, using Framer Motion's
// `animate()` for the spring.
function CountUp({ value, duration = 1.6 }: { value: number; duration?: number }) {
 const [display, setDisplay] = useState(0);
 const prefersReducedMotion = useReducedMotion();

 useEffect(() => {
 if (prefersReducedMotion) {
 setDisplay(value);
 return;
 }
 const controls = animate(0, value, {
 duration,
 ease: [0.16, 1, 0.3, 1],
 onUpdate: (v) => setDisplay(Math.round(v)),
 });
 return () => controls.stop();
 }, [value, duration, prefersReducedMotion]);

 return <span>{display}</span>;
}

interface ProjectsHeroProps {
 projectCount: number;
 techCount: number;
 featuredCount: number;
}

export default function ProjectsHero({ projectCount, techCount, featuredCount }: ProjectsHeroProps) {
 // Rotating tagline — picks the next phrase every 3s.
 const [taglineIndex, setTaglineIndex] = useState(0);
 useEffect(() => {
 const id = setInterval(() => {
 setTaglineIndex((i) => (i + 1) % TAGLINES.length);
 }, 3000);
 return () => clearInterval(id);
 }, []);

 // Subtle scroll-driven parallax hook (currently unused —
 // reserved for a future enhancement that ties headline
 // movement to scroll position without affecting layout).
 // const scrollY = useMotionValue(0);
 // useTransform(scrollY, [0, 300], [0, -30]);

 return (
 <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 {/* Eyebrow chip — mono, pulsing dot. */}
 <motion.div
 initial={{ opacity: 0, y: -8 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 className="inline-block mb-8"
 >
 <span className="eyebrow-chip">
 <span className="dot" />
 WORK · 2020 — PRESENT
 </span>
 </motion.div>

 {/* Display headline. */}
 <motion.h1
 variants={headlineContainer}
 initial="hidden"
 animate="visible"
 className="font-heading font-bold text-text-primary mx-auto"
 style={{
 fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
 letterSpacing: '-0.04em',
 lineHeight: 0.95,
 maxWidth: '12ch',
 }}
 >
 {['My', 'Projects'].map((word, wi) => (
 <motion.span
 key={wi}
 variants={headlineWord}
 className="inline-block mr-[0.2em]"
 >
 {word === 'Projects' ? (
 <span
 className="text-transparent bg-clip-text"
 style={{
 backgroundImage: 'linear-gradient(120deg, #8b5cf6 0%, #6366f1 40%, #a855f7 70%, #d946ef 100%)',
 }}
 >
 {word}
 </span>
 ) : (
 word
 )}
 </motion.span>
 ))}
 </motion.h1>

 {/* Subtitle. */}
 <motion.p
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
 className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mt-8 leading-relaxed"
 >
 Products I have built throughout my learning and development journey.
 </motion.p>

 {/* Rotating tagline — fading in/out per phrase, mono
 * font + blinking caret. */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6, duration: 0.5 }}
 className="mt-6 font-mono text-sm tracking-wide text-text-muted inline-flex items-center justify-center"
 >
 <span className="mr-1 text-violet-400/70">{'>'}</span>
 {/* The motion.span key={taglineIndex} forces Framer Motion
 * to remount + re-animate the entry transition each time
 * the index changes. AnimatePresence wraps it so the exit
 * transition runs as the next phrase enters. */}
 <span className="relative inline-block h-5 overflow-hidden">
 <AnimatePresence mode="wait">
 <motion.span
 key={taglineIndex}
 initial={{ y: 12, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: -12, opacity: 0 }}
 transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
 className="inline-block text-violet-200"
 >
 {TAGLINES[taglineIndex]}
 </motion.span>
 </AnimatePresence>
 </span>
 <span className="hero-caret" aria-hidden="true" />
 </motion.div>

 {/* Stats row — three live counters. Each animates from 0
 * to its value on mount. Mono labels, large numbers. */}
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
 className="mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-14"
 >
 <Stat label="Projects shipped" value={projectCount} />
 <StatDivider />
 <Stat label="Techs used" value={techCount} />
 <StatDivider />
 <Stat label="Featured works" value={featuredCount} />
 </motion.div>
 </div>

 {/* Scroll cue — pulsing vertical line + label. Anchored
 * to the bottom of the hero. */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 1.4, duration: 0.6 }}
 className="absolute left-1/2 -translate-x-1/2 bottom-2 flex flex-col items-center gap-2"
 aria-hidden="true"
 >
 <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">
 Scroll
 </span>
 <div className="scroll-cue" />
 <ChevronDown className="w-3 h-3 text-violet-300/60" />
 </motion.div>
 </section>
 );
}

// Small stat subcomponent — keeps the parent tidy.
function Stat({ label, value }: { label: string; value: number }) {
 return (
 <div className="text-center">
 <div className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tabular-nums" style={{ letterSpacing: '-0.02em' }}>
 <CountUp value={value} />
 </div>
 <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted mt-2">
 {label}
 </div>
 </div>
 );
}

// Vertical separator between stats — hides on narrow screens.
function StatDivider() {
 return (
 <div
 className="hidden sm:block w-px h-10"
 style={{
 background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.4), transparent)',
 }}
 aria-hidden="true"
 />
 );
}
