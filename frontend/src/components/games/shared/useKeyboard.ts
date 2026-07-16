'use client';

import { useEffect, useRef } from 'react';

/**
 * Tracks which keys are currently held. Returns a ref (not state) on purpose:
 * a game loop reads it every frame, and re-rendering React 60 times a second
 * just to know an arrow key is down would be pure waste.
 *
 * Keys are normalised to lowercase; arrows keep their `ArrowLeft` form.
 * Prevents default scrolling for arrows/space while the game is mounted.
 */
export function useKeyboard(enabled = true) {
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    // Capture the Set now: the cleanup below must clear THIS instance, not
    // whatever keys.current happens to point at when the effect tears down.
    const held = keys.current;

    const norm = (e: KeyboardEvent) => (e.key.length === 1 ? e.key.toLowerCase() : e.key);
    const BLOCK = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']);

    const down = (e: KeyboardEvent) => {
      if (BLOCK.has(e.key)) e.preventDefault(); // stop page scroll during play
      held.add(norm(e));
    };
    const up = (e: KeyboardEvent) => held.delete(norm(e));
    // Releasing outside the window would otherwise leave a key stuck "down".
    const clear = () => held.clear();

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      held.clear();
    };
  }, [enabled]);

  return keys;
}
