/** ts-11-1 — TypeScript · Chapter 11 · Lesson 11.1 "Typing Express handlers". Slug: typescript-11-1-express-handlers. _ma: s11/_ma-ts-11-1.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s11/_ma-ts-11-1.mjs';
export const deck = { key: 'ts-11-1', code: 'TS 11.1', title: 'Typing Express handlers', sub: 'a function of a typed request & response' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 11 — Typing a Node/Express backend', bai: '11.1' }, [
  { cover: true, t: 'Typing Express handlers', sub: 'Chapter 11 · Lesson 11.1 — a function of a typed request & response' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>Type a backend end to end — a self-contained model of the Express surface, run with tsc & Node</li>
    <li>A handler with typed <b>params, query, body</b> (this lesson)</li>
    <li>A typed <b>response</b> so res.json cannot send the wrong shape (11.2)</li>
    <li>An <b>ApiResult</b> envelope that forces you to handle errors (11.3); typed config & services (11.4)</li>
    <li>Pass <b>Lab 11</b>: a typed POST /bookings handler with a validated body</li></ul>` },
  { t: 'A handler with typed params', body: ts(pick(CODE.handlerGet, 0, 8), { sm: true, hl: [5] }) + tc(OUT['11-handler'], { title: 'node' }) +
    box('The generics carry the route’s shape', `Give ${c('Handler')} a ${c('Params')} of ${c('{ id: string }')} and ${c('req.params.id')} is a typed string. The handler is just a function; the generics do the work.`, 'xanh') },
  { t: 'The typed request refuses a wrong param', body: ts(CODE.wrongparamGet, { sm: true, hl: [5] }) + tc(OUT['12-wrongparam'], { wrap: 72 }) +
    box('TS2339 · a contract', `Read ${c('req.params.labId')} when the route only has ${c('id')} and it is refused. A typo in a param stops being a run-time ${c('undefined')} and becomes a compile error.`, 'lam') },
  { t: 'A handler, at a glance', body: cards([
      [c('Handler<P, Q, B, T>'), 'Params, query, body, response — four shapes.'],
      ['typed params', 'req.params.id is a string.'],
      ['a contract', 'Only what the route provides is reachable.'],
      ['wrong param', 'TS2339 — a compile error, not undefined.'],
      ['the real thing', '@types/express is this, with more overloads.'],
      ['Next · 11.2', 'Type the response.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A handler reads ${c('req.params.code')} when the route declares only ${c('id')} — TS2339; read ${c('req.params.id')} and it runs.`, 'xanh'),
      box('Remember', `The typed request is a contract: the handler can only touch what the route provides. The real ${c('@types/express')} is the same shape.`, 'lam')) +
    box('Next · 11.2 — Typed responses', `res.json checks the shape the route promises to send.`, '') },
]);
