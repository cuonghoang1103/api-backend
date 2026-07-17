'use client';

/**
 * The full landing composition — the piece that will become `/` later. Kept as
 * one self-contained component so the eventual swap is a one-line import; for
 * now it renders under /landing-preview and touches nothing else on the site.
 * Always dark (independent of the site theme), English-only.
 */
import { motion } from 'framer-motion';
import LandingBackground from './LandingBackground';
import LandingHero from './LandingHero';
import FeatureMarquee from './FeatureMarquee';

export default function RiveLanding() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a14] text-white">
      <LandingBackground />

      <LandingHero />

      {/* Feature conveyor */}
      <section className="relative z-10 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-6 px-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400"
        >
          Everything in one place
        </motion.h2>
        <FeatureMarquee />
        <p className="mt-8 px-4 text-center text-xs text-slate-500">
          Hover a card to pause · click to open the feature
        </p>
      </section>
    </div>
  );
}
