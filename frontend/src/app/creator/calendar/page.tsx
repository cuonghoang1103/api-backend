'use client';

// /creator/calendar — Calendar (Phase 6 will build the
// real react-day-picker month + agenda view).

import { motion } from 'framer-motion';
import { CalendarRange, Construction } from 'lucide-react';

export default function CalendarPage() {
 return (
 <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto">
 <motion.div
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="text-center"
 >
 <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-studio-500/15 ring-1 ring-studio-500/30 mb-4">
 <CalendarRange className="w-7 h-7 text-studio-400" />
 </div>
 <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
 Calendar
 </h1>
 <p className="mt-2 text-text-secondary text-sm">
 See every film date and publish date at a glance.
 </p>
 <div className="mt-8 inline-flex items-center gap-2 px-3 h-9 rounded-full bg-studio-500/10 text-studio-300 text-xs font-semibold uppercase tracking-wider">
 <Construction className="w-3.5 h-3.5" />
 Arriving in Phase 6
 </div>
 </motion.div>
 </div>
 );
}
