import type { ChangeEvent } from './react.ts';
// The event is typed, so e.target.value is a string.
export function onLabChange(e: ChangeEvent): string {
  return e.target.value.toUpperCase();
}
console.log(onLabChange({ target: { value: 'be-201' } }));
