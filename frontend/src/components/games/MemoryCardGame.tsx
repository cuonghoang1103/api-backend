'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';

const SYMBOLS = ['🎮', '🎯', '🚀', '💎', '⚡', '🔥', '🌙', '🎪'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Card {
  id: string;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createCards(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  return shuffle(pairs).map((symbol, i) => ({
    id: `card-${i}`,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryCardGame() {
  const [cards, setCards] = useState<Card[]>(() => createCards());
  const [selected, setSelected] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const lockedRef = useRef(false);
  const totalPairs = SYMBOLS.length;

  // Check for win
  useEffect(() => {
    if (matches === totalPairs && matches > 0) {
      setGameState('won');
    }
  }, [matches, totalPairs]);

  // Handle card flip logic
  useEffect(() => {
    if (selected.length !== 2) return;
    lockedRef.current = true;

    const [id1, id2] = selected;
    const [card1, card2] = [cards.find((c) => c.id === id1)!, cards.find((c) => c.id === id2)!];

    if (card1.symbol === card2.symbol) {
      // Match
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c))
        );
        setMatches((m) => m + 1);
        setSelected([]);
        lockedRef.current = false;
      }, 400);
    } else {
      // No match — flip back
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c))
        );
        setSelected([]);
        lockedRef.current = false;
      }, 900);
    }
  }, [selected, cards]);

  const handleCardClick = (id: string) => {
    if (lockedRef.current) return;
    if (gameState === 'won') return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));
    const next = [...selected, id];
    setSelected(next);

    if (next.length === 1) {
      setMoves((m) => m + 1);
    }
  };

  const restart = () => {
    setCards(createCards());
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setGameState('playing');
    lockedRef.current = false;
  };

  const starsEarned =
    moves <= 10 ? 3 : moves <= 16 ? 2 : moves <= 22 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Score bar */}
      <div className="flex items-center gap-5 w-full max-w-md">
        <div className="flex-1 bg-darkbg/80 border border-darkborder rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">Moves</span>
          <span className="font-heading font-bold text-xl text-neon-violet tabular-nums">{moves}</span>
        </div>
        <div className="flex-1 bg-darkbg/80 border border-darkborder rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">Pairs</span>
          <span className="font-heading font-bold text-xl text-emerald-400 tabular-nums">
            {matches}/{totalPairs}
          </span>
        </div>
        <button
          onClick={restart}
          className="p-2.5 bg-darkbg border border-darkborder rounded-xl hover:border-neon-violet/40 transition-colors text-text-muted hover:text-neon-violet"
          title="Restart"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2.5 w-full max-w-md">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={card.isFlipped || card.isMatched ? { rotateY: 0 } : {}}
            transition={{ duration: 0.3 }}
            className={`
              relative aspect-square rounded-xl cursor-pointer overflow-hidden
              transition-all duration-300 border-2
              ${card.isMatched
                ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : card.isFlipped
                ? 'border-neon-violet/50 bg-darkbg/90 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                : 'border-darkborder bg-darkbg hover:border-neon-violet/30'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {(card.isFlipped || card.isMatched) ? (
                <motion.div
                  key="face"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center bg-darkbg/90 rounded-lg"
                >
                  <span
                    className={`text-3xl select-none ${card.isMatched ? 'scale-110' : ''}`}
                  >
                    {card.symbol}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
                  }}
                >
                  <span className="text-lg font-bold text-neon-violet/30 select-none">?</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Win screen */}
      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-darkbg/90 backdrop-blur-md"
          >
            <div className="bg-darkbg border border-darkborder rounded-3xl p-8 text-center max-w-sm w-full mx-4 shadow-[0_0_60px_rgba(139,92,246,0.3)]">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)]"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="font-heading font-bold text-2xl text-text-primary mb-2">You Won!</h2>
              <p className="text-text-muted mb-4">
                Completed in <span className="text-neon-violet font-bold">{moves}</span> moves
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`text-3xl ${s <= starsEarned ? 'opacity-100' : 'opacity-20'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={restart}
                  className="w-full py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow"
                >
                  Play Again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
