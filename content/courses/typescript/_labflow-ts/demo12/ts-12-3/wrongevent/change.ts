import type { ChangeEvent } from './react.ts';
export function onLabChange(e: ChangeEvent): string {
  // The event has target.value, not value directly.
  return e.value;
}
