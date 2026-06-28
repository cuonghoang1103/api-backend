'use client';

// ProjectsHero — compact header for the /projects page.
//
// Layout:
// • Eyebrow chip (mono, "WORK · 2020 — PRESENT")
// • Title "My Projects" (compact, text-4xl/5xl)
// • Subtitle
// • Stats row — inline small counters

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ProjectsHeroProps {
  projectCount: number;
  techCount: number;
  featuredCount: number;
}

export default function ProjectsHero({ projectCount, techCount, featuredCount }: ProjectsHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Left: Title + Subtitle */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-3"
            >
              <span className="eyebrow-chip">
                <span className="dot" />
                WORK · 2020 — PRESENT
              </span>
            </motion.div>

            {/* Compact Title */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading font-bold text-text-primary"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              My{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(120deg, #8b5cf6 0%, #6366f1 40%, #a855f7 70%, #d946ef 100%)',
                }}
              >
                Projects
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-text-secondary mt-1 max-w-xl"
            >
              Products I have built throughout my learning and development journey.
            </motion.p>
          </div>

          {/* Right: Compact stats */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-6"
          >
            <StatItem value={projectCount} label="Projects" />
            <StatDivider />
            <StatItem value={techCount} label="Techs" />
            <StatDivider />
            <StatItem value={featuredCount} label="Featured" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="font-heading font-bold text-text-primary tabular-nums"
        style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">
        {label}
      </div>
    </div>
  );
}

function StatDivider() {
  return (
    <div
      className="hidden sm:block w-px h-8"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(139,92,246,0.4), transparent)',
      }}
    />
  );
}
