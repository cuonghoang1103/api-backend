'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Lock, Zap, Clock, BarChart3, Package } from 'lucide-react';
import type { Game } from '@/types/games';

const difficultyColor: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10',
  Medium: 'text-amber-400 bg-amber-400/10',
  Hard: 'text-red-400 bg-red-400/10',
};

const categoryColor: Record<string, string> = {
  Arcade: 'from-pink-500 to-rose-500',
  Puzzle: 'from-violet-500 to-purple-500',
  Casual: 'from-cyan-500 to-blue-500',
  Strategy: 'from-amber-500 to-orange-500',
  Card: 'from-green-500 to-emerald-500',
  Classic: 'from-indigo-500 to-blue-500',
};

interface GameCardProps {
  game: Game;
  index?: number;
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden border
          bg-darkbg border-darkborder
          transition-all duration-300
          group-hover:border-neon-violet/50
          group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]
        `}
      >
        {/* Badges row */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
          {!game.isPlayable && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-amber-500/30 text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
              <Lock className="w-2.5 h-2.5" /> Soon
            </span>
          )}
          {game.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-neon-violet/20 backdrop-blur-sm border border-neon-violet/30 text-[10px] font-bold text-neon-violet uppercase tracking-wide">
              New
            </span>
          )}
          {game.isFeatured && game.isPlayable && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
              <Zap className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>

        {/* Thumbnail */}
        <Link href={`/games/${game.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          {game.thumbnail ? (
            <Image
              src={game.thumbnail}
              alt={game.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${!game.isPlayable && 'opacity-50'}`}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/30 to-neon-fuchsia/30 flex items-center justify-center">
              <Package className="w-8 h-8 text-white/30" />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-transparent to-transparent opacity-80" />

          {/* Play overlay */}
          {game.isPlayable ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full bg-neon-violet/90 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-darkbg/80 flex items-center justify-center border border-darkborder">
                <Lock className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          )}

          {/* Category gradient strip at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r bg-gradient-to-r from-transparent via-transparent to-transparent" />
        </Link>

        {/* Card body */}
        <div className="p-4 space-y-3">
          {/* Title + category */}
          <div>
            <div className={`inline-block mb-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r ${categoryColor[game.category] || 'from-gray-500 to-gray-600'} bg-opacity-20 text-[10px] font-bold text-white uppercase tracking-wider`}>
              {game.category}
            </div>
            <Link href={`/games/${game.slug}`}>
              <h3 className="font-heading font-bold text-text-primary group-hover:text-neon-violet transition-colors leading-snug">
                {game.title}
              </h3>
            </Link>
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{game.shortDescription}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${difficultyColor[game.difficulty] || 'text-text-muted bg-darkborder/50'}`}>
              <BarChart3 className="w-3 h-3" />
              {game.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {game.playTime}
            </span>
            {game.highScore !== undefined && game.highScore > 0 && (
              <span className="flex items-center gap-1 text-neon-violet">
                <Zap className="w-3 h-3" />
                Best: {game.highScore}
              </span>
            )}
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1">
            {game.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-darkborder/60 text-text-muted border border-darkborder/40"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Play button */}
          <Link href={`/games/${game.slug}`} className="block">
            <button
              className={`
                w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${game.isPlayable
                  ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-95'
                  : 'bg-darkborder/40 text-text-muted cursor-not-allowed border border-darkborder/50'
                }
              `}
              disabled={!game.isPlayable}
            >
              {game.isPlayable ? (
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-3.5 h-3.5" fill="currentColor" />
                  Play Now
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Coming Soon
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
