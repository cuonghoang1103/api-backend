import type { ChangeEvent } from './react.ts';
export function onSeatsChange(e: ChangeEvent): number {
  // e.target.value is a string — Number() converts it; reading e.value is wrong.
  return Number(e.value);
}
