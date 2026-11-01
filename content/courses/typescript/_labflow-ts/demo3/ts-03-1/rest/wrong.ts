import { totalMinutes } from './total.ts';

totalMinutes([480, 600], 720);
totalMinutes([480, 600, 660]);

// No type on a rest parameter:
export function countAll(...items) {
  return items.length;
}
