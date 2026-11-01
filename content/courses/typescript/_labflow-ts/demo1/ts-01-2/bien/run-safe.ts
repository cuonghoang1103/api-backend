import { BODIES } from './bodies.ts';
import { handleCreate } from './handler-safe.ts';

for (const [label, body] of BODIES) {
  console.log(label, '→', JSON.stringify(handleCreate(body)));
}
