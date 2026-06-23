'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Hammer, CircleDashed } from 'lucide-react';
import type { ProjectFeature, ProjectFeatureStatus } from '@/types';

interface FeatureChecklistProps {
 features: ProjectFeature[];
}

const STATUS_META: Record<ProjectFeatureStatus, {
 label: string;
 pill: string;
 icon: typeof CheckCircle2;
}> = {
 DONE: {
 label: 'Hoàn thành',
 pill: 'bg-emerald-500/15 text-emerald-400',
 icon: CheckCircle2,
 },
 IN_PROGRESS: {
 label: 'Đang làm',
 pill: 'bg-yellow-500/15 text-yellow-400',
 icon: Hammer,
 },
 PLANNED: {
 label: 'Kế hoạch',
 pill: 'bg-blue-500/15 text-blue-400',
 icon: CircleDashed,
 },
};

/**
 * FeatureChecklist — three-column grid (DONE / IN_PROGRESS
 * / PLANNED) of feature bullets. Each column has a coloured
 * pill at the top summarising the count, and a colour-blind-
 * safe icon next to each bullet so the status is conveyed
 * without relying on colour alone.
 */
export default function FeatureChecklist({ features }: FeatureChecklistProps) {
 if (!features || features.length === 0) return null;

 const grouped: Record<ProjectFeatureStatus, ProjectFeature[]> = {
 DONE: [],
 IN_PROGRESS: [],
 PLANNED: [],
 };

 for (const f of features) {
 const status = (f.status ?? 'PLANNED') as ProjectFeatureStatus;
 if (!grouped[status]) grouped[status] = [];
 grouped[status].push(f);
 }

 const total = features.length;

 return (
 <section className="mt-12">
 <div className="flex items-baseline justify-between mb-6">
 <h2 className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 text-neon-violet" />
 Tính năng chính
 </h2>
 <span className="text-xs text-text-muted">{total} mục</span>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {(['DONE', 'IN_PROGRESS', 'PLANNED'] as ProjectFeatureStatus[]).map((status) => {
 const items = grouped[status] ?? [];
 const meta = STATUS_META[status];
 const Icon = meta.icon;
 return (
 <div
 key={status}
 className="rounded-2xl border border-darkborder bg-darkcard p-5"
 >
 <div className="flex items-center justify-between mb-4">
 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.pill}`}>
 {meta.label}
 </span>
 <span className="text-xs text-text-muted">{items.length}</span>
 </div>
 {items.length === 0 ? (
 <p className="text-xs text-text-muted italic">Chưa có mục nào.</p>
 ) : (
 <ul className="space-y-2.5">
 {items.map((f, i) => (
 <motion.li
 key={f.id ?? i}
 initial={{ opacity: 0, x: -4 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true, margin: '-30px' }}
 transition={{ duration: 0.25, delay: i * 0.04 }}
 className="flex items-start gap-2.5 text-sm text-text-secondary"
 >
 <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
 <div className="min-w-0">
 <p className="leading-relaxed">{f.title}</p>
 {f.description && (
 <p className="text-xs text-text-muted mt-0.5">{f.description}</p>
 )}
 </div>
 </motion.li>
 ))}
 </ul>
 )}
 </div>
 );
 })}
 </div>
 </section>
 );
}