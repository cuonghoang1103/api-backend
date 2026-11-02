/** Web Foundations · deck bài 9.2 — Kiểu cơ bản. Output thật: _demo/_t9/chay.sh (tsc 5.9 --declaration, Node 22.23). */
import { deckWf, ts, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-9-2', code: 'WF 9.2', title: 'Basic types', sub: 'Web Foundations · Chapter 9' };

export const slides = deckWf({ chuong: 'Chapter 9 — TypeScript', bai: '9.2' }, [
  { cover: true, t: 'Basic types', sub: 'Let inference work — annotate the edges' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Let <b>inference</b> type most variables</li>
    <li>Use string, number, boolean, arrays</li>
    <li>Write <b>unions</b> and narrow them</li>
    <li>Restrict values with <b>literal types</b></li>
    <li>Choose <b>unknown</b> over <b>any</b></li></ul>` },

  { t: 'Inference', giua: true, body: term(null, OUT['_t9/out/infer'].split('export declare const post')[0].trim(), { title: 'tsc --declaration — what TS inferred' }) + box('const vs let', 'const title → "Hello World" (literal) · let price → number', 'info') },

  { t: 'Five mistakes the basics catch', giua: true, body: term('_t9/out/basics', null, { title: 'npx tsc --noEmit --strict basics.ts' }) + two(box('Annotate', 'function parameters · empty arrays · values from outside', 'info'), box('Let TS infer', 'local variables · return values · object literals', 'ok')) },

  { t: 'Unions and narrowing', to: true, giua: true, body: steps([
      '<code class="i">string | number</code> — only what both share is allowed',
      '<code class="i">typeof x === \'number\'</code> → inside, x is a number',
      '<code class="i">x === null</code> / <code class="i">if (x)</code> → null removed',
      'After the check, TypeScript remembers',
    ]) + box('toFixed on string | number', 'refused until you narrow', 'bad') },

  { t: 'Literal types', giua: true, body: tbl(['Type', 'Allows'], [["'asc' | 'desc'", 'exactly two strings'], ['200 | 404', 'two numbers'], ['as const', 'readonly literals']]) + box('"descending"', 'not assignable to SortDir — caught at compile time', 'bad') },

  { t: 'any switches checking off', giua: true, body: term('_t9/out/any-unknown', null, { title: 'any vs unknown' }) + box('any', 'compiles, then crashes at runtime', 'bad') },

  { t: 'unknown makes you check', to: true, giua: true, body: ts(null, `const data: unknown = JSON.parse(text);
if (typeof data === 'object' && data !== null && 'name' in data
    && typeof data.name === 'string') {
  console.log(data.name.toUpperCase());   // checked, so allowed
}`) + two(box('unknown', 'the honest type of JSON, catch (e), localStorage — narrow before use', 'ok'), box('any', 'spreads silently to everything it touches', 'bad')) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Inference first, annotate edges</li>
    <li>Unions + narrowing</li>
    <li>Literal unions for fixed values</li>
    <li>unknown, never any</li></ul>`,
    box('Practice (30 min)', 'Fix basics.ts, write a formatPrice(string | number), type a sort direction, parse JSON as unknown.<br><br><b>Done when</b>: tsc exits 0 without any.', 'ok')) },
]);
