/** Web Foundations · deck bài 9.4 — Hàm và generic. Output thật: _demo/_t9/chay.sh (tsc 5.9 --declaration, Node 22.23). */
import { deckWf, ts, term, box, two, tbl, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-9-4', code: 'WF 9.4', title: 'Functions and generics', sub: 'Web Foundations · Chapter 9' };

export const slides = deckWf({ chuong: 'Chapter 9 — TypeScript', bai: '9.4' }, [
  { cover: true, t: 'Functions and generics', sub: 'Every call checked — and the type remembered' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Type <b>parameters</b> and <b>return values</b></li>
    <li>Use <b>default</b> and <b>optional</b> parameters</li>
    <li>Describe <b>callbacks</b> with function types</li>
    <li>Write <b>generic</b> functions and types</li>
    <li>Constrain with <b>extends</b></li></ul>` },

  { t: 'Parameters and return types', giua: true, body: ts('_t9/9-4/functions.ts', null, { gon: true, chi: [1, 11] }) + term('_t9/out/functions', null, { title: 'npx tsc --noEmit --strict', sm: true }) },

  { t: 'Optional parameters and void', to: true, giua: true, body: tbl(['Syntax', 'Means'], [['level?: …', "'info' | 'error' | undefined"], ['rate = 0.1', 'optional, with a default'], [': void', 'returns nothing useful']]) + box("log('failed', 'warning')", 'not one of the allowed levels', 'bad') },

  { t: 'Function types for callbacks', giua: true, body: ts('_t9/9-4/functions.ts', null, { gon: true, chi: [19, 21] }) + box('e is typed for free', 'React event handlers and Express handlers work the same way', 'ok') + tbl(['Function type', 'Example'], [['(e: MouseEvent) =&gt; void', 'onClick'], ['(req, res) =&gt; void', 'Express route'], ['(a: T, b: T) =&gt; number', 'sort compare']]) },

  { t: 'Generics keep the type', giua: true, body: term(null, OUT['_t9/out/generics'].split('export declare const c')[0].trim() + '\n\n' + OUT['_t9/out/generics'].slice(OUT['_t9/out/generics'].indexOf('$ node')).trim(), { title: 'tsc --declaration — inferred types' }) },

  { t: 'Constraints with extends', giua: true, body: term('_t9/out/generics-errors', null, { title: 'what generics still refuse' }) + box('T extends { id: number }', 'any type with a numeric id — and T keeps its real shape', 'info') },

  { t: 'Generic types', to: true, giua: true, body: tbl(['You already use', 'T is'], [['string[]', 'element'], ['Promise&lt;ProductList&gt;', 'what await gives'], ['Record&lt;K, V&gt;', 'key, value'], ['useState&lt;T&gt;', 'state type']]) + box('Red flag', 'parse&lt;T&gt;(json): T — T only in the return type = a hidden "as"', 'bad') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Annotate params, fix returns</li>
    <li>Function types for callbacks</li>
    <li>&lt;T&gt; keeps the caller's type</li>
    <li>extends constrains T</li></ul>`,
    box('Practice (40 min)', 'Fix functions.ts, type five helpers, write groupBy&lt;T, K&gt; and getJson&lt;T&gt; with a type predicate.<br><br><b>Done when</b>: tsc clean; groupBy returns Record&lt;"live" | "draft", …&gt;.', 'ok')) },
]);
