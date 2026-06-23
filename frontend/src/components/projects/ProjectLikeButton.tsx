'use client';

import { useState, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsApi } from '@/lib/api';

interface ProjectLikeButtonProps {
 slug: string;
 initialCount: number;
}

/**
 * ProjectLikeButton — frictionless anonymous like. The
 * server dedupes by IP HMAC-SHA256 hash, so the user can
 * press this many times without inflating the count.
 *
 * Optimistic update: we bump the counter immediately and
 * roll back on error. The heart animates with a brief
 * burst on each successful like.
 */
export default function ProjectLikeButton({ slug, initialCount }: ProjectLikeButtonProps) {
 const [count, setCount] = useState<number>(initialCount);
 const [pending, setPending] = useState(false);
 const [burst, setBurst] = useState(false);

 const onLike = useCallback(async () => {
 if (pending) return;
 setPending(true);
 // Optimistic increment — server may dedupe and not
 // actually bump the count, but the user sees feedback.
 const prev = count;
 setCount(prev + 1);
 setBurst(true);
 setTimeout(() => setBurst(false), 600);

 try {
 const res = await projectsApi.like(slug);
 const next = res.data?.data?.likeCount;
 if (typeof next === 'number') setCount(next);
 } catch {
 // Roll back to the previous count so the UI stays
 // truthful to the server.
 setCount(prev);
 } finally {
 setPending(false);
 }
 }, [count, pending, slug]);

 return (
 <button
 onClick={onLike}
 disabled={pending}
 aria-label="Like this project"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary hover:border-rose-400/40 hover:text-rose-300 transition-colors disabled:opacity-60 relative"
 >
 <span className="relative">
 <Heart className="w-4 h-4" />
 <AnimatePresence>
 {burst && (
 <motion.span
 key="burst"
 initial={{ scale: 1, opacity: 0.8 }}
 animate={{ scale: 2.4, opacity: 0 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.6, ease: 'easeOut' }}
 className="absolute inset-0 text-rose-400"
 style={{ filter: 'blur(2px)' }}
 >
 <Heart className="w-4 h-4 fill-current" />
 </motion.span>
 )}
 </AnimatePresence>
 </span>
 <span className="tabular-nums">{count}</span>
 </button>
 );
}