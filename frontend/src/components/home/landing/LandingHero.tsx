'use client';

/**
 * Landing hero — personalized, English-only greeting over the dark backdrop,
 * plus two CTAs. The greeting depends on auth + time-of-day, both client-only,
 * so it's computed in an effect (initial paint shows the visitor greeting to
 * avoid any hydration mismatch, then upgrades once the auth store rehydrates).
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AnimatedGreeting from './AnimatedGreeting';

interface Greeting { line1: string; line2: string; }

const VISITOR: Greeting = {
  line1: 'Welcome to CuongThai',
  line2: 'Sign up and explore — practice interviews, learn languages, build your CV, and more, all with AI on your side.',
};

function timeWord(h: number): string {
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function LandingHero() {
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [greeting, setGreeting] = useState<Greeting>(VISITOR);

  useEffect(() => {
    if (isAuthed && user) {
      const name = user.fullName || user.displayName || user.username || 'there';
      setGreeting({
        line1: `Welcome back, ${name}`,
        line2: `${timeWord(new Date().getHours())} — have a great, productive day.`,
      });
    } else {
      setGreeting(VISITOR);
    }
  }, [isAuthed, user]);

  return (
    <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-24 pb-16 sm:pt-32">
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-300 backdrop-blur"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> The interactive learning & career platform
      </motion.span>

      <AnimatedGreeting line1={greeting.line1} line2={greeting.line2} />

      <motion.div
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Link
          href={isAuthed ? '/feed' : '/register'}
          className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-[1.03]"
        >
          {isAuthed ? 'Go to your feed' : 'Get started'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/interview"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
        >
          <Compass className="h-4 w-4" /> Explore features
        </Link>
      </motion.div>
    </div>
  );
}
