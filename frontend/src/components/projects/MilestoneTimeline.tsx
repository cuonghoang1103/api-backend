'use client';

import { motion } from 'framer-motion';
import {
 Lightbulb,
 Hammer,
 CheckCircle2,
 Rocket,
 Cog,
 Calendar,
 Image as ImageIcon,
} from 'lucide-react';
import type { ProjectMilestone } from '@/types';

interface MilestoneTimelineProps {
 milestones: ProjectMilestone[];
}

/**
 * Phase → icon mapping. We pick by keyword because the
 * backend doesn't enforce a fixed enum yet (it just stores
 * a free-form string from the admin form).
 */
function pickIcon(phase: string) {
 const p = phase.toLowerCase();
 if (p.includes('ide') || p.includes('discovery') || p.includes('plan')) return Lightbulb;
 if (p.includes('dev') || p.includes('build') || p.includes('implement')) return Hammer;
 if (p.includes('test') || p.includes('qa') || p.includes('review')) return CheckCircle2;
 if (p.includes('launch') || p.includes('release') || p.includes('ship')) return Rocket;
 return Cog;
}

function formatDate(d?: string) {
 if (!d) return null;
 try {
 return new Date(d).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
 } catch {
 return d;
 }
}

/**
 * MilestoneTimeline — vertical timeline with a glowing
 * gradient line. Each phase has a coloured circular node
 * with an icon, a title, an optional date, an optional
 * image, and a description. Phases reveal with a stagger
 * via framer-motion.
 */
export default function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
 if (!milestones || milestones.length === 0) return null;

 const sorted = [...milestones].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

 return (
 <section className="mt-12">
 <h2 className="text-lg font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
 <Cog className="w-5 h-5 text-neon-violet" />
 Lộ trình phát triển
 </h2>
 <div className="relative pl-6 sm:pl-10">
 {/* vertical gradient line */}
 <div
 className="absolute top-0 bottom-0 w-0.5"
 style={{
 left: '0.875rem',
 background: 'linear-gradient(180deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%)',
 opacity: 0.6,
 }}
 />
 <ul className="space-y-6">
 {sorted.map((m, i) => {
 const Icon = pickIcon(m.phase);
 return (
 <motion.li
 key={m.id ?? i}
 initial={{ opacity: 0, x: -8 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.3, delay: i * 0.05 }}
 className="relative"
 >
 {/* circular node */}
 <div
 className="absolute -left-[1.55rem] sm:-left-[2.30rem] top-1 w-7 h-7 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center"
 style={{ boxShadow: '0 0 16px rgba(168,85,247,0.5)' }}
 >
 <Icon className="w-3.5 h-3.5 text-white" />
 </div>
 <div className="bg-darkcard border border-darkborder rounded-xl p-4 sm:p-5">
 <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
 <h3 className="font-semibold text-text-primary">{m.title}</h3>
 <div className="flex items-center gap-2 text-xs text-text-muted">
 <span className="px-2 py-0.5 bg-neon-violet/10 text-neon-violet rounded-full uppercase tracking-wider">
 {m.phase}
 </span>
 {m.date && (
 <span className="inline-flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 {formatDate(m.date)}
 </span>
 )}
 </div>
 </div>
 {m.description && (
 <p className="text-sm text-text-secondary leading-relaxed">{m.description}</p>
 )}
 {m.imageUrl && (
 <div className="mt-3 rounded-lg overflow-hidden border border-darkborder">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={m.imageUrl} alt={m.title} className="w-full h-auto" />
 </div>
 )}
 </div>
 </motion.li>
 );
 })}
 </ul>
 </div>
 </section>
 );
}