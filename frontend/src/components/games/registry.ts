import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Game registry — the single source of truth mapping a DB `componentKey` to a
 * lazily-loaded React game component.
 *
 * Why a registry: the portal and the admin form must both know which component
 * keys exist without importing any game code. `load` wraps next/dynamic, so the
 * import() only runs when a game is actually opened — the /games listing ships
 * zero game code.
 *
 * Adding a game: build the component under components/games/<key>/, honour the
 * GameProps contract (see shared/GameShell.tsx), then add one entry here. The
 * admin form's componentKey select reads this map automatically.
 *
 * `scoreCap` MIRRORS the server-side cap in src/services/games/game.service.ts
 * (SCORE_CAPS) for display only — the server is the enforcement point and will
 * clamp anything above it. Keep the two in sync.
 */

export interface GameRegistryEntry {
  /** Human label shown in the admin componentKey select. */
  name: string;
  /** Lazily-loaded component. ssr:false — games are canvas/DOM driven. */
  load: () => ComponentType<GameProps>;
  /** Display-only mirror of the server cap. */
  scoreCap: number;
  /** Whether the game reports a score (Tic Tac Toe, for example, does not). */
  scored: boolean;
}

/**
 * Contract every registered game honours. GameShell supplies the start/pause/
 * end chrome; the game itself only plays and reports a final score.
 */
export interface GameProps {
  /** Called exactly once when a run ends. */
  onScore: (score: number, durationSec?: number) => void;
  onExit?: () => void;
  locale: 'vi' | 'en';
}

const loader = (fn: () => Promise<{ default: ComponentType<never> }>) =>
  dynamic(fn as never, { ssr: false }) as unknown as ComponentType<GameProps>;

export const GAME_REGISTRY: Record<string, GameRegistryEntry> = {
  snake: {
    name: 'Snake',
    load: () => loader(() => import('./SnakeGame')),
    scoreCap: 2_000,
    scored: true,
  },
  'memory-card': {
    name: 'Memory Card',
    load: () => loader(() => import('./MemoryCardGame')),
    scoreCap: 10_000,
    scored: true,
  },
  'tic-tac-toe': {
    name: 'Tic Tac Toe',
    load: () => loader(() => import('./TicTacToeGame')),
    scoreCap: 100,
    scored: false,
  },
  'math-blitz': {
    name: 'Math Blitz',
    load: () => loader(() => import('./MathBlitzGame')),
    scoreCap: 5_000,
    scored: true,
  },
  projectile: {
    name: 'Projectile Challenge',
    load: () => loader(() => import('./ProjectileGame')),
    scoreCap: 20_000,
    scored: true,
  },
};

/** Keys for the admin select (free-text entry is still allowed alongside). */
export function registryKeys(): { key: string; name: string }[] {
  return Object.entries(GAME_REGISTRY).map(([key, v]) => ({ key, name: v.name }));
}

export function getRegistryEntry(key: string | null | undefined): GameRegistryEntry | null {
  if (!key) return null;
  return GAME_REGISTRY[key] ?? null;
}
