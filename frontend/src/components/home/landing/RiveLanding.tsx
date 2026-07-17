'use client';

/**
 * The full landing composition (this is what "/" renders). Always dark,
 * English-only, scrollable: hero → one-line mission → live stats → feature
 * pillars → promo marquee → closing call-to-action → slim footer. Sections
 * reveal on scroll (agency-about-page style).
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LandingBackground from './LandingBackground';
import LandingHero from './LandingHero';
import StatsCounter from './StatsCounter';
import FeatureShowcase from './FeatureShowcase';
import FeatureMarquee from './FeatureMarquee';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
};

export default function RiveLanding() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a14] text-white">
      <LandingBackground />

      <LandingHero />

      {/* One-line mission (About lives on its own page — this is just a nod) */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-10 text-center">
        <motion.p {...reveal} className="text-lg leading-relaxed text-slate-300 sm:text-xl">
          Built by <span className="font-semibold text-white">CuongHoang</span> to bring learning, career growth, and
          community together in one fast, interactive place.
        </motion.p>
      </section>

      {/* Live stats */}
      <section className="relative z-10 pb-10">
        <StatsCounter />
      </section>

      {/* Feature pillars */}
      <FeatureShowcase />

      {/* Promo marquee */}
      <section className="relative z-10 pb-24">
        <motion.h2 {...reveal} className="mb-6 px-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          A closer look
        </motion.h2>
        <FeatureMarquee />
        <p className="mt-8 px-4 text-center text-xs text-slate-500">Hover a card to pause · click to open the feature</p>
      </section>

      {/* Closing CTA */}
      <section className="relative z-10 px-4 pb-24">
        <motion.div
          {...reveal}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 px-6 py-14 text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Start where you are</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Create a free account and pick up a language, prep for your next interview, or just explore.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03]">
              Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/feed" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Browse the feed
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Slim footer */}
      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-sm text-slate-500">
        © CuongThai — crafted by CuongHoang · <Link href="/about" className="text-slate-400 hover:text-white">About</Link>
      </footer>
    </div>
  );
}
