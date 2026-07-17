'use client';

/**
 * The "everything the platform does" grid — six pillars, each a card that slides
 * up and fades in as it enters the viewport (staggered), agency-about-page style.
 * English copy, links straight into each area. Reduced-motion: cards just appear.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, FileText, Sparkles, Code2, Users, ArrowUpRight } from 'lucide-react';

interface Pillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href: string;
  accent: string;
}

const PILLARS: Pillar[] = [
  {
    icon: GraduationCap, accent: '#06b6d4', href: '/language',
    title: 'Language Learning',
    desc: 'Learn English, Japanese and Chinese with structured roadmaps, an AI tutor, pronunciation scoring, kana & hanzi writing, and spaced-repetition review — from your first word to fluency.',
  },
  {
    icon: Briefcase, accent: '#8b5cf6', href: '/interview',
    title: 'Interview Simulator',
    desc: 'Rehearse real technical interviews across 18 domains. Answer by voice or text, get graded with clear, actionable feedback, then drill the concepts you missed.',
  },
  {
    icon: FileText, accent: '#22c55e', href: '/cv',
    title: 'CV Builder',
    desc: 'Build an honest, ATS-friendly IT résumé, tailor it to any job description with AI, and export a polished PDF or DOCX in seconds.',
  },
  {
    icon: Sparkles, accent: '#ec4899', href: '/chat',
    title: 'AI Assistant',
    desc: 'A fast, multi-model chat assistant for code, writing and research — with image and document understanding built right in.',
  },
  {
    icon: Code2, accent: '#f59e0b', href: '/exp-hub',
    title: 'Developer Knowledge',
    desc: 'A living knowledge base of reusable snippets, notes and projects with full-text search and AI explanations — plus curated, in-depth Tech Trends articles.',
  },
  {
    icon: Users, accent: '#38bdf8', href: '/feed',
    title: 'Community & Play',
    desc: 'Share posts, message in real time, join the forum, listen to music together, and unwind with quick browser games and real leaderboards.',
  },
];

export default function FeatureShowcase() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything you need, in one place</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          One account, one platform — learn, prepare for your career, build things, and connect.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            <Link
              href={p.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 60px -30px ${p.accent}, 0 20px 50px -20px ${p.accent}55` }} />
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${p.accent}1f`, color: p.accent }}>
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="flex items-center gap-1.5 text-lg font-semibold text-white">
                {p.title}
                <ArrowUpRight className="h-4 w-4 text-slate-500 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
