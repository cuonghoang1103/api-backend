import { LABS } from '../derive/labs.ts';

// Promise what you really do: the helper only reads, so it takes a readonly list.
function printLabs(labs: readonly string[]): void {
  console.log(labs.join(', '));
}

printLabs(LABS);
printLabs(['X-1', 'X-2']);      // ordinary mutable arrays are still accepted
