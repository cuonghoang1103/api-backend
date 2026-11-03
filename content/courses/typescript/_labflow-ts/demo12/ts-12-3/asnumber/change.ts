import type { ChangeEvent } from './react.ts';
export function onSeatsChange(e: ChangeEvent): number {
  // e.target.value is always a string — assigning it to a number is refused.
  const seats: number = e.target.value;
  return seats;
}
