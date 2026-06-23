'use client';

import { motion } from 'framer-motion';
import { FileText, FileCode2, Github, ExternalLink, Download } from 'lucide-react';
import type { ProjectResource, ProjectResourceType } from '@/types';

interface ResourcesListProps {
 resources: ProjectResource[];
}

const TYPE_META: Record<ProjectResourceType, {
 label: string;
 icon: typeof FileText;
 color: string;
}> = {
 PDF: { label: 'PDF', icon: FileText, color: 'text-rose-400' },
 DOC: { label: 'Tài liệu', icon: FileText, color: 'text-blue-400' },
 REPO: { label: 'Repository', icon: Github, color: 'text-text-primary' },
 LINK: { label: 'Liên kết', icon: ExternalLink, color: 'text-neon-violet' },
 OTHER: { label: 'Khác', icon: FileCode2, color: 'text-text-muted' },
};

function formatSize(bytes?: number): string {
 if (!bytes || bytes <= 0) return '';
 const units = ['B', 'KB', 'MB', 'GB'];
 let n = bytes;
 let u = 0;
 while (n >= 1024 && u < units.length - 1) {
 n /= 1024;
 u++;
 }
 return `${n.toFixed(n >= 10 ? 0 : 1)} ${units[u]}`;
}

/**
 * ResourcesList — clickable list of downloadable /
 * reference resources. Each row shows type icon, title,
 * optional description, optional file size (for PDFs /
 * DOCs), and opens external links in a new tab. Row
 * stagger is via framer-motion.
 */
export default function ResourcesList({ resources }: ResourcesListProps) {
 if (!resources || resources.length === 0) return null;

 const sorted = [...resources].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

 return (
 <section className="mt-12">
 <h2 className="text-lg font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
 <Download className="w-5 h-5 text-neon-violet" />
 Tài nguyên tham khảo
 </h2>
 <ul className="space-y-3">
 {sorted.map((r, i) => {
 const meta = TYPE_META[r.type] ?? TYPE_META.OTHER;
 const Icon = meta.icon;
 const isExternal = r.type === 'LINK' || r.type === 'REPO' || /^https?:\/\//i.test(r.url);
 return (
 <motion.li
 key={r.id ?? i}
 initial={{ opacity: 0, y: 6 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-30px' }}
 transition={{ duration: 0.25, delay: i * 0.04 }}
 >
 <a
 href={r.url}
 target={isExternal ? '_blank' : undefined}
 rel={isExternal ? 'noopener noreferrer' : undefined}
 download={r.type === 'PDF' || r.type === 'DOC' ? '' : undefined}
 className="group flex items-center gap-4 p-4 rounded-xl border border-darkborder bg-darkcard hover:border-neon-violet/30 transition-colors"
 >
 <div
 className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-darkbg border border-darkborder ${meta.color}`}
 >
 <Icon className="w-5 h-5" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="font-medium text-text-primary group-hover:text-neon-violet transition-colors line-clamp-1">
 {r.title}
 </span>
 <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${meta.color} bg-current/10`}>
 {meta.label}
 </span>
 </div>
 {r.description && (
 <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{r.description}</p>
 )}
 </div>
 {formatSize(r.fileSize) && (
 <span className="text-xs text-text-muted whitespace-nowrap">
 {formatSize(r.fileSize)}
 </span>
 )}
 {isExternal && (
 <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-neon-violet flex-shrink-0" />
 )}
 </a>
 </motion.li>
 );
 })}
 </ul>
 </section>
 );
}