/** ts-11-4 — TypeScript · Chapter 11 · Lesson 11.4 "Services & config". Slug: typescript-11-4-services-and-config. _ma: s11/_ma-ts-11-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s11/_ma-ts-11-4.mjs';
export const deck = { key: 'ts-11-4', code: 'TS 11.4', title: 'Services & config', sub: 'read-only config, honest services' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 11 — Typing a Node/Express backend', bai: '11.4' }, [
  { cover: true, t: 'Services &amp; config', sub: 'Chapter 11 · Lesson 11.4 — read-only config, honest services' },
  { t: 'A read-only config, built once', body: ts(pick(CODE.configConfig, 0, 11), { sm: true, hl: [2, 3] }) + tc(OUT['11-config'], { title: 'node' }) +
    box('Trusted everywhere', `${c('loadConfig')} reads the environment once and returns a ${c('readonly')} ${c('Config')}. Every module reads a typed, immutable value instead of poking at ${c('process.env')}.`, 'xanh') },
  { t: 'Read-only means it cannot drift', body: ts(CODE.frozenConfig, { sm: true, hl: [4] }) + tc(OUT['12-frozen'], { wrap: 72 }) +
    box('TS2540', `Reassign ${c('cfg.port')} and it is refused — the config is frozen at the type level, so no module changes it after startup. Chapter 8’s ${c('Readonly')}, doing one important job.`, 'lam') },
  { t: 'A service returns, it does not lie', body: ts(CODE.prStart, { sm: true, hl: [5] }) + tc(OUT['13-pr-start'], { wrap: 74 }) +
    box('TS2322 · an honest return type', `A ${c('bookingById')} that promises a ${c('Booking')} but can return ${c('undefined')} is a lie tsc catches. The honest type is ${c('Booking | undefined')}, and the caller guards the miss.`, 'do2') },
  { t: 'The layers, at a glance', body: cards([
      ['typed config', 'Built once; a readonly value trusted everywhere.'],
      [c('readonly'), 'Reassigning a field is TS2540.'],
      ['honest service', 'A lookup that may miss returns T | undefined.'],
      ['the layers', 'Config → service → handler.'],
      ['each a contract', 'The next layer relies on it.'],
      ['Next · Lab 11', 'A typed POST /bookings handler.'],
    ], 3) },
  { t: 'Practice &amp; Lab 11', to: true, giua: true, body: two(
      box('🧪 Practice', `A service returns ${c('store.find(...)')} as a ${c('Booking')} (TS2322) — make it ${c('Booking | undefined')} and the caller guards it.`, 'xanh'),
      box('Remember', `Config → service → handler: each layer’s type is a contract the next relies on, and the compiler enforces all three.`, 'lam')) +
    box('Next · Lab 11 — A typed handler with an error envelope', `A validated body, an ${c('ApiResult')} response, a typed error.`, '') },
]);
