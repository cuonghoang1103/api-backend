/** Web Foundations · deck bài 9.1 — Vì sao TypeScript. Output thật: _demo/_t9/chay.sh (Node 22.23, tsc 5.9). */
import { deckWf, js, ts, term, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-9-1', code: 'WF 9.1', title: 'Why TypeScript', sub: 'Web Foundations · Chapter 9' };

export const slides = deckWf({ chuong: 'Chapter 9 — TypeScript', bai: '9.1' }, [
  { cover: true, t: 'Why TypeScript', sub: 'Find the bug before the user does' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Say what TypeScript <b>adds</b> to JavaScript</li>
    <li>Read a <b>tsc error</b> and find its line</li>
    <li>Spot the <b>everyday bugs</b> it prevents</li>
    <li>Explain why types <b>disappear</b> at runtime</li>
    <li>Say <b>where</b> checking happens</li></ul>` },

  { t: 'A bug JavaScript runs happily', giua: true, body: js('_t9/9-1/cart.js', null, { gon: true }) + term('_t9/out/cart-js', null, { title: 'node cart.js' }) + box('No error', '"5000" from an input: × converts, + concatenates → 250 005 000 VND', 'bad') },

  { t: 'The same code with types', giua: true, body: ts('_t9/9-1/cart.ts', null, { gon: true, chi: [2, 17] }) + term('_t9/out/cart-ts', null, { title: 'npx tsc --noEmit --strict' }) },

  { t: 'Everyday bugs it catches', giua: true, body: term('_t9/out/mistakes', null, { title: 'mistakes.ts — 5 errors' }) + tbl(['Error', 'In plain JS'], [['nmae', 'undefined'], ['possibly null', 'crash on .length'], ['Element has no value', 'undefined'], ['email missing', 'bad data saved']]) },

  { t: 'Types disappear at runtime', giua: true, body: term('_t9/out/runtime', null, { title: 'compiled JS + a real run' }) + box('as Product = "trust me"', 'JSON with the wrong shape passes the checker and crashes. Validate at the boundary (9.5).', 'bad') },

  { t: 'Where the checking happens', to: true, giua: true, body: steps([
      '<b>Editor</b> — red underlines as you type',
      '<b>Terminal</b> — <code class="i">npx tsc --noEmit</code> → exit code',
      '<b>CI</b> — non-zero exit blocks the merge',
      '<b>Node / Vite / tsx</b> — strip types, run JS, check nothing',
    ]) + two(box('Exit code 0', 'no type errors — safe to merge', 'ok'), box('Exit code 2', 'errors found — CI blocks the merge', 'bad')) },

  { t: 'What it costs', to: true, giua: true, body: two(box('You pay', 'a little more typing · learning the type system · occasional fights with the checker', 'info'), box('You get', 'rename a field → every broken place listed · autocomplete · whole classes of bugs never shipped', 'ok')) + box('Rule of thumb', 'Anything that lives longer than a weekend: TypeScript.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>TS = JS + types + a checker</li>
    <li>Errors point to file(line,col)</li>
    <li>Types are erased when code runs</li>
    <li>Check in editor, terminal, CI</li>
    <li>Runtime data still needs checks</li></ul>`,
    box('Practice (30 min)', 'Install TypeScript in an empty folder, run the cart in JS and TS, fix every error in mistakes.ts.<br><br><b>Done when</b>: tsc exits 0 and the total is right.', 'ok')) },
]);
