'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Gamepad2 } from 'lucide-react';
import GameCard from '@/components/games/GameCard';
import type { Game, GameCategory } from '@/types/games';

const CATEGORIES: { label: string; value: GameCategory | 'All' }[] = [
  { label: 'All Games', value: 'All' },
  { label: 'Arcade', value: 'Arcade' },
  { label: 'Puzzle', value: 'Puzzle' },
  { label: 'Strategy', value: 'Strategy' },
  { label: 'Casual', value: 'Casual' },
  { label: 'Classic', value: 'Classic' },
  { label: 'Card', value: 'Card' },
];

interface GamesClientProps {
  games: Game[];
}

export default function GamesClient({ games }: GamesClientProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchSearch =
        !search ||
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(g.technologies) && g.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())));
      const matchCat = activeCategory === 'All' || g.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [games, search, activeCategory]);

  const playableCount = games.filter((g) => g.isPlayable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-darkbg/80 backdrop-blur-xl border-b border-darkborder py-4 -mx-4 px-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games, tech..."
              className="w-full pl-9 pr-9 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-muted"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Category pills */}
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setActiveCategory(cat.value); setShowFilters(false); }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${activeCategory === cat.value
                    ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-darkbg border border-darkborder text-text-muted hover:border-neon-violet/30 hover:text-text-primary'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results meta */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-muted">
          Showing{' '}
          <span className="text-text-primary font-medium">{filtered.length}</span>{' '}
          of {games.length} games
          {activeCategory !== 'All' && (
            <span className="ml-1 text-neon-violet">in {activeCategory}</span>
          )}
          {search && (
            <span className="ml-1">
              matching{' '}
              <span className="text-neon-violet">&ldquo;{search}&rdquo;</span>
            </span>
          )}
        </p>
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          {playableCount} playable
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4 opacity-50">
            <Gamepad2 className="w-16 h-16 text-text-muted" />
          </div>
          <h3 className="font-heading font-bold text-xl text-text-primary mb-2">No games found</h3>
          <p className="text-text-muted mb-4">
            Try a different search term or category.
          </p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="px-4 py-2 bg-neon-violet/10 border border-neon-violet/20 rounded-xl text-sm text-neon-violet hover:bg-neon-violet/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
