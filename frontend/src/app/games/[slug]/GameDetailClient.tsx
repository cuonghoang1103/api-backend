'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Play, Maximize2, ChevronRight,
  Clock, BarChart3, Calendar, Tag, Code2, Gamepad2, Lock, Package
} from 'lucide-react';
import GameRenderer from '@/components/games';
import type { Game } from '@/types/games';
import { GAMES_DATA } from '@/types/games';

const difficultyColor: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const categoryColor: Record<string, string> = {
  Arcade: 'from-pink-500 to-rose-500',
  Puzzle: 'from-violet-500 to-purple-500',
  Casual: 'from-cyan-500 to-blue-500',
  Strategy: 'from-amber-500 to-orange-500',
  Card: 'from-green-500 to-emerald-500',
  Classic: 'from-indigo-500 to-blue-500',
};

interface GameDetailClientProps {
  game: Game;
  relatedGames: Game[];
}

export default function GameDetailClient({ game, relatedGames }: GameDetailClientProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const el = document.getElementById('game-area');
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-darkbg pt-20 pb-20">
      {/* Hero banner */}
      <div className="relative h-56 overflow-hidden">
        {game.previewImage ? (
          <Image
            src={game.previewImage}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/30 to-neon-fuchsia/30 flex items-center justify-center">
            <Gamepad2 className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-darkbg/40 via-darkbg/60 to-darkbg" />
        <div className="absolute inset-0 bg-gradient-to-r from-darkbg/80 via-transparent to-darkbg/40" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Link
            href="/games"
            className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-white/80 hover:text-white hover:bg-black/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            All Games
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {!game.isPlayable && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400">
              <Lock className="w-3 h-3" /> Coming Soon
            </span>
          )}
          {game.isNew && (
            <span className="px-3 py-1 rounded-full bg-neon-violet/20 border border-neon-violet/30 text-xs font-bold text-neon-violet">
              New
            </span>
          )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title + meta */}
            <div>
              <div className={`inline-block mb-3 px-3 py-1 rounded-lg bg-gradient-to-r ${categoryColor[game.category] || 'from-gray-500 to-gray-600'} bg-opacity-20 text-xs font-bold text-white uppercase tracking-wider`}>
                {game.category}
              </div>
              <h1 className="font-heading font-black text-4xl md:text-5xl text-text-primary mb-3">
                {game.title}
              </h1>
              <p className="text-base text-text-secondary leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Game area */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-bold text-lg text-text-primary">Game</h2>
                {game.isPlayable && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Ready to play
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 bg-darkbg border border-darkborder rounded-lg text-text-muted hover:text-text-primary hover:border-neon-violet/30 transition-all"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div
                id="game-area"
                className="bg-darkbg rounded-2xl border border-darkborder p-6 flex items-center justify-center min-h-[400px]"
              >
                {game.isPlayable ? (
                  <GameRenderer game={game} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-darkborder/50 flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-text-muted" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Coming Soon</h3>
                    <p className="text-text-muted max-w-sm">
                      This game is under development. Stay tuned!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* How to play */}
            <div className="bg-darkbg/60 border border-darkborder rounded-2xl p-6">
              <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-neon-violet" />
                How to Play
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">{game.howToPlay}</p>
            </div>

            {/* Related games */}
            {relatedGames.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-neon-violet" />
                  More Games
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedGames.map((g) => (
                    <Link
                      key={g.id}
                      href={`/games/${g.slug}`}
                      className="group flex items-center gap-3 bg-darkbg/60 border border-darkborder rounded-xl p-3 hover:border-neon-violet/30 transition-all"
                    >
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0">
                        {g.thumbnail ? (
                          <Image src={g.thumbnail} alt={g.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-darkcard flex items-center justify-center">
                            <Package className="w-4 h-4 text-text-muted" />
                          </div>
                        )}
                        {!g.isPlayable && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white/60" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary group-hover:text-neon-violet transition-colors truncate">
                          {g.title}
                        </p>
                        <p className="text-[11px] text-text-muted">{g.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5">
            {/* Game info card */}
            <div className="bg-darkbg border border-darkborder rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold text-base text-text-primary">Game Info</h3>

              {[
                {
                  icon: <BarChart3 className="w-4 h-4" />,
                  label: 'Difficulty',
                  value: game.difficulty,
                  color: difficultyColor[game.difficulty] || '',
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  label: 'Play Time',
                  value: game.playTime,
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: 'Released',
                  value: new Date(game.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-text-muted">
                    {icon}
                    {label}
                  </span>
                  <span className={`text-sm font-medium ${color || 'text-text-primary'}`}>
                    {value}
                  </span>
                </div>
              ))}

              {game.highScore !== undefined && game.highScore > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-darkborder">
                  <span className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="text-amber-400">⭐</span>
                    Your Best
                  </span>
                  <span className="text-sm font-bold text-amber-400">{game.highScore}</span>
                </div>
              )}
            </div>

            {/* Technologies */}
            <div className="bg-darkbg border border-darkborder rounded-2xl p-5">
              <h3 className="font-heading font-bold text-base text-text-primary mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-neon-indigo" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-darkborder/50 text-text-muted border border-darkborder/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-darkbg border border-darkborder rounded-2xl p-5">
              <h3 className="font-heading font-bold text-base text-text-primary mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-neon-fuchsia" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs bg-neon-violet/10 text-neon-violet border border-neon-violet/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link
              href="/games"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all games
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
