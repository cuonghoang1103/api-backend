'use client';

// ProjectsEmpty — friendly "no results" state shown when the
// filter+search combination yields zero projects. Animates
// in (fade + slide up) and offers a "Clear filters" CTA that
// resets all filter state at once.
//
// The big circular icon has a slow rotating ring (CSS only)
// and a pulsing center to draw the eye without being loud.

import { motion } from 'framer-motion';
import { SearchX, Sparkles } from 'lucide-react';

interface ProjectsEmptyProps {
 onClearFilters: () => void;
 hasFilters: boolean;
}

export default function ProjectsEmpty({ onClearFilters, hasFilters }: ProjectsEmptyProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 className="text-center py-20 max-w-md mx-auto"
 role="status"
 aria-live="polite"
 >
 {/* Icon — ringed search-off glyph. */}
 <div className="relative w-24 h-24 mx-auto mb-6">
 {/* Rotating outer ring — slow, 16s. */}
 <div
 className="absolute inset-0 rounded-full"
 style={{
 background:
 'conic-gradient(from 0deg, rgba(139, 92, 246, 0.45), rgba(34, 211, 238, 0.15), rgba(139, 92, 246, 0.45))',
 WebkitMask: 'radial-gradient(closest-side, transparent 70%, #000 72%, #000 78%, transparent 80%)',
 mask: 'radial-gradient(closest-side, transparent 70%, #000 72%, #000 78%, transparent 80%)',
 animation: 'spin 16s linear infinite',
 }}
 />
 {/* Inner glass disc. */}
 <div className="absolute inset-2 rounded-full glass-frost flex items-center justify-center">
 <SearchX className="w-8 h-8 text-violet-300" strokeWidth={1.5} />
 </div>
 {/* Subtle pulse — center glow. */}
 <div
 className="absolute inset-0 rounded-full pointer-events-none"
 style={{
 boxShadow: '0 0 40px rgba(139, 92, 246, 0.25)',
 animation: 'pulse 3s ease-in-out infinite',
 }}
 />
 </div>

 <h3 className="font-heading text-2xl font-semibold text-text-primary mb-2">
 {hasFilters ? 'No projects match those filters' : 'No projects yet'}
 </h3>
 <p className="text-text-secondary text-sm leading-relaxed mb-6">
 {hasFilters
 ? 'Try a different keyword or relax the status / tech filters.'
 : 'Once published, your projects will appear here in a grid.'}
 </p>

 {hasFilters && (
 <motion.button
 type="button"
 onClick={onClearFilters}
 whileHover={{ scale: 1.04 }}
 whileTap={{ scale: 0.96 }}
 transition={{ type: 'spring', stiffness: 400, damping: 22 }}
 className="magnetic-press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-violet-200 glass-frost gradient-border-violet"
 >
 <Sparkles className="w-4 h-4" />
 Clear filters
 </motion.button>
 )}
 </motion.div>
 );
}
