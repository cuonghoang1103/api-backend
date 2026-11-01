import { BODIES } from './bodies.ts';
import { handleCreate } from './handler-as.ts';

for (const [label, body] of BODIES) {
  try {
    console.log(label, '→', JSON.stringify(handleCreate(body)));
  } catch (e) {
    console.log(label, '→', e instanceof Error ? e.name + ': ' + e.message : e);
  }
}
