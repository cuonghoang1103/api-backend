import { LABS } from '../derive/labs.ts';

// A helper written long ago: it only reads the list, but its parameter says string[].
function printLabs(labs: string[]): void {
  console.log(labs.join(', '));
}

printLabs(LABS);
