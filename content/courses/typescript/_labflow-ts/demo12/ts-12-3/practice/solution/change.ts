import type { ChangeEvent } from './react.ts';
export function onSeatsChange(e: ChangeEvent): number {
  return Number(e.target.value);
}
console.log(onSeatsChange({ target: { value: '40' } }));
