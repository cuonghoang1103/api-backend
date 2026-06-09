'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O';
type Cell = Player | null;

function checkWinner(board: Cell[]): { winner: Player | 'draw'; line: number[] } | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  if (board.every((c) => c !== null)) return { winner: 'draw', line: [] };
  return null;
}

// Minimax AI
function minimax(board: Cell[], depth: number, isMax: boolean): number {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Cell[]): number {
  let best = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [player, setPlayer] = useState<Player>('X');
  const [gameResult, setGameResult] = useState<{ winner: Player | 'draw'; line: number[] } | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [lastWin, setLastWin] = useState<Player | 'draw' | null>(null);

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setGameResult(result);
      setScores((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
      setLastWin(result.winner);
    }
  }, [board]);

  // AI move
  useEffect(() => {
    if (gameResult) return;
    if (player !== 'O') return;
    const result = checkWinner(board);
    if (result) return;

    const timer = setTimeout(() => {
      const boardCopy = [...board];
      const move = getBestMove(boardCopy);
      if (move !== -1) {
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setPlayer('X');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [player, gameResult, board]);

  const handleCellClick = useCallback((i: number) => {
    if (gameResult) return;
    if (board[i] || player === 'O') return;

    const newBoard = [...board];
    newBoard[i] = player;
    setBoard(newBoard);
    setPlayer('O');
  }, [board, player, gameResult]);

  const restart = () => {
    setBoard(Array(9).fill(null));
    setPlayer('X');
    setGameResult(null);
  };

  const resetAll = () => {
    restart();
    setScores({ X: 0, O: 0, draw: 0 });
    setLastWin(null);
  };

  const lines = [
    { cells: [0, 1, 2], style: 'top-1/3' },
    { cells: [3, 4, 5], style: 'top-2/3' },
    { cells: [6, 7, 8], style: 'bottom-0' },
    { cells: [0, 3, 6], style: 'left-1/3' },
    { cells: [1, 4, 7], style: 'left-2/3' },
    { cells: [2, 5, 8], style: 'right-0' },
    { cells: [0, 4, 8], style: 'rotate-45 origin-left' },
    { cells: [2, 4, 6], style: '-rotate-45 origin-right' },
  ];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Scoreboard */}
      <div className="flex items-center gap-5 w-full max-w-sm">
        <div className={`flex-1 text-center py-2.5 rounded-xl border transition-all ${player === 'X' && !gameResult ? 'border-neon-indigo/50 bg-neon-indigo/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-darkborder bg-darkbg/60'}`}>
          <div className="text-[10px] text-text-muted mb-0.5">You (X)</div>
          <div className="font-heading font-bold text-2xl text-neon-indigo tabular-nums">{scores.X}</div>
        </div>
        <div className="flex-1 text-center py-2.5 rounded-xl border border-darkborder bg-darkbg/60">
          <div className="text-[10px] text-text-muted mb-0.5">Draw</div>
          <div className="font-heading font-bold text-2xl text-text-muted tabular-nums">{scores.draw}</div>
        </div>
        <div className={`flex-1 text-center py-2.5 rounded-xl border transition-all ${player === 'O' && !gameResult ? 'border-neon-fuchsia/50 bg-neon-fuchsia/10 shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'border-darkborder bg-darkbg/60'}`}>
          <div className="text-[10px] text-text-muted mb-0.5">AI (O)</div>
          <div className="font-heading font-bold text-2xl text-neon-fuchsia tabular-nums">{scores.O}</div>
        </div>
      </div>

      {/* Turn indicator */}
      <p className="text-sm text-text-muted">
        {gameResult ? (
          gameResult.winner === 'draw' ? (
            <span className="text-amber-400">It&apos;s a Draw!</span>
          ) : (
            <span className={gameResult.winner === 'X' ? 'text-neon-indigo' : 'text-neon-fuchsia'}>
              {gameResult.winner === 'X' ? 'You Won!' : 'AI Wins!'}
            </span>
          )
        ) : (
          <span>
            Your turn —{' '}
            <span className={player === 'X' ? 'text-neon-indigo' : 'text-neon-fuchsia'}>
              {player === 'X' ? 'You (X)' : 'AI is thinking...'}
            </span>
          </span>
        )}
      </p>

      {/* Board */}
      <div className="relative w-64 h-64 bg-darkbg border-2 border-darkborder rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={`h${i}`} className="col-span-4">
              {i > 0 && i < 3 && <div className="absolute left-0 right-0 h-0.5 bg-darkborder" style={{ top: `${(i / 3) * 100}%` }} />}
            </div>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <div key={`v${i}`} className="row-span-4">
              {i > 0 && i < 3 && <div className="absolute top-0 bottom-0 w-0.5 bg-darkborder" style={{ left: `${(i / 3) * 100}%` }} />}
            </div>
          ))}
        </div>

        {/* Win line */}
        {gameResult && gameResult.line.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {(() => {
              const [a, b, c] = gameResult.line;
              const cells = lines.find((l) => l.cells.join(',') === [a, b, c].join(','));
              if (!cells) return null;
              const cellSize = 256 / 3;
              const startCenter = [cells.cells[0] % 3, Math.floor(cells.cells[0] / 3)];
              const endCenter = [cells.cells[2] % 3, Math.floor(cells.cells[2] / 3)];
              const x1 = startCenter[0] * cellSize + cellSize / 2;
              const y1 = startCenter[1] * cellSize + cellSize / 2;
              const x2 = endCenter[0] * cellSize + cellSize / 2;
              const y2 = endCenter[1] * cellSize + cellSize / 2;
              const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
              const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
              return (
                <div
                  className="absolute bg-neon-violet"
                  style={{
                    width: length,
                    height: 4,
                    borderRadius: 2,
                    top: y1,
                    left: x1,
                    transformOrigin: '0 50%',
                    transform: `rotate(${angle}deg)`,
                    boxShadow: '0 0 12px rgba(139,92,246,0.8)',
                  }}
                />
              );
            })()}
          </div>
        )}

        {/* Cells */}
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={!!cell || !!gameResult || player === 'O'}
            className={`
              absolute w-1/3 h-1/3 flex items-center justify-center
              transition-colors
              ${!cell && !gameResult && player === 'X' ? 'hover:bg-darkborder/30 cursor-pointer' : 'cursor-default'}
            `}
            style={{ left: `${(i % 3) * (100 / 3)}%`, top: `${Math.floor(i / 3) * (100 / 3)}%` }}
          >
            {cell === 'X' && (
              <svg viewBox="0 0 50 50" className="w-16 h-16">
                <line x1="10" y1="10" x2="40" y2="40" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
                <line x1="40" y1="10" x2="10" y2="40" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
              </svg>
            )}
            {cell === 'O' && (
              <svg viewBox="0 0 50 50" className="w-16 h-16">
                <circle cx="25" cy="25" r="15" fill="none" stroke="#f472b6" strokeWidth="5" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={restart}
          disabled={!gameResult}
          className="flex items-center gap-2 px-4 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-muted hover:border-neon-violet/40 hover:text-neon-violet transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          New Round
        </button>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-muted hover:border-neon-violet/40 hover:text-neon-violet transition-all"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
}
