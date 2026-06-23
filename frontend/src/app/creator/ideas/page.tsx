'use client';

// /creator/ideas — Idea Bank (Phase 5 will build the real
// capture + promote flow).

import { motion } from 'framer-motion';
import { Lightbulb, Construction } from 'lucide-react';

export default function IdeasPage() {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="text-center"
 >
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/15 ring-1 ring-studio-500/30 mb-4">
 <Lightbulb className="w-7 h-7 text-studio-400" />
 </div>
 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
 Idea Bank
 </h1>
 <p className="mt-2 text-text-secondary text-sm">
 Capture sparks. Promote to project when ready.
 </p>
 <div className="mt-8 inline-flex items-center gap-2 px-3 h-9 rounded-full bg-studio-500/10 text-studio-300 text-xs font-semibold uppercase tracking-wider">
 <Construction className="w-3.5 h-3.5" />
 Arriving in Phase 5
 </div>
 </motion.div>
 </div>
 );
}
