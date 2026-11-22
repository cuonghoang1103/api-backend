import { readFile } from 'node:fs/promises';
import { createPlant, isThirsty } from './plant.mjs';

const rows = JSON.parse(await readFile(new URL('./seed.json', import.meta.url), 'utf8'));
const now = new Date('2026-11-22T08:00:00Z');
for (const r of rows) {
  try {
    const p = createPlant(r);
    console.log(p.name.padEnd(10), isThirsty(p, new Date(r.lastWateredAt), now) ? 'THIRSTY' : 'ok');
  } catch (err) {
    console.log('rejected  ', JSON.stringify(r.name), '-', err.message);
  }
}
