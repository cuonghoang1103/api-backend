/** ts-11-3 — TypeScript · Chapter 11 · Lesson 11.3 "The API result envelope". Slug: typescript-11-3-api-envelope-errors. _ma: s11/_ma-ts-11-3.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s11/_ma-ts-11-3.mjs';
export const deck = { key: 'ts-11-3', code: 'TS 11.3', title: 'The API result envelope', sub: 'ok with data, or a typed error' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 11 — Typing a Node/Express backend', bai: '11.3' }, [
  { cover: true, t: 'The API result envelope', sub: 'Chapter 11 · Lesson 11.3 — ok with data, or a typed error' },
  { t: 'ApiResult: ok with data, or an error', body: ts(CODE.apiEnv, { sm: true, hl: [2, 3] }) + ts(pick(CODE.envelopeHandler, 0, 7), { sm: true }) + tc(OUT['11-envelope'], { title: 'node' }) +
    box('A discriminated union', `Every response is ${c('{ ok: true; data }')} or ${c('{ ok: false; error }')}. The tag ${c('ok')} narrows it — Chapter 5, at the scale of a whole API.`, 'xanh') },
  { t: 'You cannot read data without checking', body: ts(CODE.wrongbranchHandler, { sm: true, hl: [5] }) + tc(OUT['12-wrongbranch'], { wrap: 72 }) +
    box('TS2339', `Read ${c('r.data')} without checking ${c('r.ok')} and it is refused — ${c('data')} is not on the error branch. You must handle the failure before you touch the success.`, 'do2') },
  { t: 'The error is typed too', body: ts(CODE.apiEnv, { sm: true, hl: [2] }) + ts(pick(CODE.envelopeHandler, 9, 13), { sm: true, hl: [2] }) +
    two(box('A code and a message', `The error branch has its own typed shape, so ${c('r.error.code')} reads with the same safety as ${c('r.data')} — typed errors are as valuable as typed data.`, 'lam'),
      box('No stringly-typed errors', `A client can switch on the ${c('code')} and show the ${c('message')}, and the compiler checks that every error carries both. No guessing, no undocumented shapes.`, 'xanh')) },
  { t: 'The envelope, at a glance', body: cards([
      [c('ApiResult<T>'), 'A union: { ok: true; data } or { ok: false; error }.'],
      ['narrow on ok', 'The tag reaches data on success, error on failure.'],
      ['no unchecked data', 'Reading data without checking ok is TS2339.'],
      ['typed errors', 'The error carries a code and a message, not a string.'],
      ['Chapter 5, at scale', 'The discriminated union, now the backbone of the API.'],
      ['Next · 11.4', 'Config and the service layer below the handlers.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A function reads ${c('r.data.code')} without narrowing on ${c('ok')} (TS2339) — return ${c('r.ok ? r.data.code : r.error.message')}.`, 'xanh'),
      box('Remember', `The envelope makes “this might fail” part of the type, not a convention — a client cannot silently ignore an endpoint’s errors.`, 'lam')) +
    box('Next · 11.4 — Services & config', `A read-only config, and a service with an honest return type.`, '') },
]);
