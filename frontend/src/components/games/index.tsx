'use client';

import dynamic from 'next/dynamic';
import type { Game } from '@/types/games';

// Lazy load games — heavy components only when needed
const SnakeGame = dynamic(() => import('./SnakeGame'), { ssr: false, loading: () => <GameLoader /> });
const MemoryCardGame = dynamic(() => import('./MemoryCardGame'), { ssr: false, loading: () => <GameLoader /> });
const TicTacToeGame = dynamic(() => import('./TicTacToeGame'), { ssr: false, loading: () => <GameLoader /> });

function GameLoader() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-neon-violet border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

interface GameRendererProps {
  game: Game;
}

export default function GameRenderer({ game }: GameRendererProps) {
  if (game.gameType === 'iframe' && game.iframeSrc) {
    return (
      <iframe
        src={game.iframeSrc}
        title={game.title}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '400px' }}
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    );
  }

  switch (game.componentName) {
    case 'SnakeGame':
      return <SnakeGame />;
    case 'MemoryCardGame':
      return <MemoryCardGame />;
    case 'TicTacToeGame':
      return <TicTacToeGame />;
    default:
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Coming Soon</h3>
          <p className="text-text-muted max-w-sm">
            This game is still under development. Check back soon!
          </p>
        </div>
      );
  }
}

export { SnakeGame, MemoryCardGame, TicTacToeGame };
