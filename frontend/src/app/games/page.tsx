import GamesClient from './GamesClient';
import { GAMES_DATA } from '@/types/games';

export const metadata = {
  title: 'Games — Playground | CuongHoangDev',
  description: 'Play free games built with HTML5 Canvas, React & TypeScript.',
};

export default async function GamesPage() {
  const games = GAMES_DATA;

  return (
    <div className="min-h-screen bg-darkbg pt-20 pb-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-violet/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-indigo/10 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon-fuchsia/5 rounded-full blur-[128px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-violet/10 border border-neon-violet/20 mb-6">
            <span className="w-2 h-2 bg-neon-violet rounded-full animate-pulse" />
            <span className="text-xs font-mono font-medium text-neon-violet tracking-widest uppercase">
              Game Zone
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4 leading-none">
            Playground
          </h1>
          <p className="font-heading text-2xl md:text-3xl text-text-muted mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia">
              Games
            </span>{' '}
            by CuongHoang
          </p>
          <p className="text-base text-text-secondary max-w-xl">
            Mini games built with HTML5 Canvas, React & TypeScript. Play for fun,
            challenge yourself, or just take a break.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8">
            {[
              { label: 'Games', value: games.length },
              { label: 'Playable', value: games.filter((g) => g.isPlayable).length },
              { label: 'Categories', value: new Set(games.map((g) => g.category)).size },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading font-bold text-2xl text-neon-violet">{stat.value}</div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GamesClient games={games} />
    </div>
  );
}
