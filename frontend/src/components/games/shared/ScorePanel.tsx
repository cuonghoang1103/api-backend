'use client';

import { RotateCcw, Trophy } from 'lucide-react';

/**
 * End-of-run panel. Shows the run's score, the best of this session, and a
 * replay button. The page slots the server leaderboard in via `extra` —
 * GameShell deliberately knows nothing about score submission.
 */
export default function ScorePanel({
  score,
  sessionBest,
  scored,
  onReplay,
  labels,
  extra,
}: {
  score: number;
  sessionBest: number;
  /** Some games (Tic Tac Toe) don't produce a meaningful score. */
  scored: boolean;
  onReplay: () => void;
  labels: { yourScore: string; best: string; replay: string };
  extra?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md mx-auto text-center space-y-5">
      {scored && (
        <div>
          <p className="text-xs uppercase tracking-wider text-text-muted">{labels.yourScore}</p>
          <p className="mt-1 text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-indigo via-neon-violet to-neon-fuchsia tabular-nums">
            {score.toLocaleString()}
          </p>
          {sessionBest > 0 && (
            <p className="mt-2 text-xs text-text-muted inline-flex items-center gap-1">
              <Trophy className="w-3 h-3 text-neon-orange" />
              {labels.best}: <span className="text-text-secondary font-semibold tabular-nums">{sessionBest.toLocaleString()}</span>
            </p>
          )}
        </div>
      )}

      {extra}

      <button
        onClick={onReplay}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 transition-all"
      >
        <RotateCcw className="w-4 h-4" /> {labels.replay}
      </button>
    </div>
  );
}
