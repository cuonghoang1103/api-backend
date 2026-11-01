/** Web Foundations · deck bài 11.3 — Prototype & class. */
import { deckWf, js, con, box, two, steps, tbl, flow, OUT } from './_wf-bai.mjs';

const C = OUT['11-3/constructor'].split('\n');
const OUT_CTOR = C.slice(0, 3).join('\n');
const OUT_CTOR_NEW = C[3];

export const deck = { key: 'wf-11-3', code: 'WF 11.3', title: 'Prototype & class', sub: 'Web Foundations · Chapter 11' };

export const slides = deckWf({ chuong: 'Chapter 11 — Advanced JavaScript', bai: '11.3' }, [
  { cover: true, t: 'Prototype & class', sub: 'How objects inherit — the prototype chain underneath, the class syntax on top' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Explain how <code class="i">obj.prop</code> is found: the <b>prototype chain</b></li>
    <li>Say what <code class="i">new</code> does, in three steps</li>
    <li>Write a <b>class</b> with constructor, methods, getter, static and <code class="i">#private</code> fields</li>
    <li>Use <code class="i">extends</code> and <code class="i">super</code> correctly</li>
    <li>Know when a class method and an arrow field differ</li></ul>
    ${box('Why', 'Every array, string, DOM element and Error you use is built this way. Reading library code and error stacks needs this model.', 'info')}` },

  { t: 'The prototype chain: lookup walks upward', body: two(`${js('11-3/chain.js', null, { chi: [1, 9] })}${box('', 'Own property ⇒ found at once. Otherwise JavaScript asks the <b>prototype</b>, then its prototype… until <code class="i">null</code>.', 'info')}`, `${con('11-3/chain')}
    ${box('Prototype ≠ copy', '<code class="i">Object.create(animal)</code> copies nothing: rabbit only gets a <b>link</b> to animal.', 'ok')}`, 'r73') },

  { t: 'What the chain looks like', body: `${flow([
      { t: 'rabbit', s: 'own: jumps' },
      { t: 'animal', s: 'eats, describe()', mau: '#2f7d4f' },
      { t: 'Object.prototype', s: 'toString, hasOwnProperty…', mau: '#b85a2b' },
      { t: 'null', s: 'end of the chain', mau: '#666666' },
    ])}
    ${steps([
      'Read <code class="i">rabbit.eats</code>: not on rabbit ⇒ look at its prototype ⇒ found on animal.',
      'Read <code class="i">rabbit.flies</code>: walk to the end (<code class="i">null</code>) ⇒ <code class="i">undefined</code>, no error.',
      '<code class="i">Object.hasOwn(o, k)</code> = only the object itself; <code class="i">k in o</code> = the whole chain.',
    ])}
    ${box('Writing is different', 'Assigning <code class="i">rabbit.eats = false</code> creates an OWN property on rabbit — it never edits animal.', 'info')}` },

  { t: 'Constructor functions + prototype (pre-2015)', body: `${js('11-3/constructor.js', null, { chi: [1, 13] })}
    ${two(con(null, OUT_CTOR), box('', 'Data lives on each object; <b>methods live once</b> on the prototype and are shared.', 'ok'))}` },

  { t: 'What new does, written by hand', body: `${js('11-3/constructor.js', null, { chi: [15, 22] })}
    ${two(con(null, OUT_CTOR_NEW), steps(['Create an empty object linked to <code class="i">Ctor.prototype</code>', 'Run the constructor with <code class="i">this</code> = that object', 'Return it (unless the constructor returned another object)']), 'r37')}
    ${box('That is all new does', 'No copying of methods happens. The new object only gets a <b>link</b> to the prototype — that is why all users share one <code class="i">greet</code>.', 'ok')}` },

  { t: 'class: the modern syntax', body: `${js('11-3/class.mjs', null, { chi: [1, 17] })}
    ${tbl(['Part', 'Means'], [['static count', 'one value on the class itself: Product.count'], ['#price', 'private field — a SyntaxError if touched outside the class'], ['get price()', 'a getter: read p.price like a property']])}` },

  { t: 'Using the class', body: `${js('11-3/class.mjs', null, { chi: [19, 22] })}
    ${con('11-3/class')}
    ${two(box('return this', '<code class="i">applyDiscount</code> returns the object ⇒ calls can be chained: <code class="i">p.applyDiscount(10).applyDiscount(5)</code>.', 'ok'), box('Getter without setter', 'Assigning <code class="i">p.price = 1</code> throws in strict mode (classes are always strict). Read-only by design.', 'bad'))}
    ${box('Private means private', 'Outside the class, even <i>writing</i> <code class="i">p.#price</code> is a SyntaxError — the file will not load. Only the class’s own methods can read or change it.', 'info')}` },

  { t: 'class is still prototypes underneath', body: `${js('11-3/class-under-hood.mjs')}
    ${two(con('11-3/class-under-hood'), box('', '<code class="i">typeof</code> a class is <b>function</b>; methods sit on the prototype; JSON shows only own public fields — not methods, not <code class="i">#price</code>.', 'info'))}` },

  { t: 'Inheritance: extends and super', body: two(js('11-3/extends.mjs', null, { chi: [1, 17] }), `${con('11-3/extends')}
    ${box('super', '<code class="i">super(…)</code> runs the parent constructor; <code class="i">super.describe()</code> calls the parent’s method.', 'info')}`, 'r73') },

  { t: 'Methods vs arrow fields', body: `${js('11-3/arrow-field.mjs')}
    ${two(con('11-3/arrow-field'), tbl(['', 'method', 'arrow field'], [['lives on', 'prototype (1 copy)', 'each instance'], ['detached', 'loses this', 'keeps this'], ['cost', 'cheap', 'one fn per object']]))}` },

  { t: 'Never extend built-in prototypes', body: `${js('11-3/builtins.js')}
    ${two(con('11-3/builtins'), box('Banned in real code', 'It changes every array in the page, can collide with future JS features (<code class="i">Array.prototype.flatten</code> broke old sites ⇒ the standard renamed it <code class="i">flat</code>), and leaks into <code class="i">for…in</code>.', 'bad'))}` },

  { t: 'Summary & practice', to: true, body: two(`<ul>
    <li>Lookup walks the <b>prototype chain</b> up to <code class="i">null</code></li>
    <li><code class="i">new</code> = link, run, return</li>
    <li><code class="i">class</code> = clean syntax over prototypes</li>
    <li><code class="i">#field</code> = truly private</li>
    <li><code class="i">super()</code> before <code class="i">this</code></li>
    <li>Never patch built-in prototypes</li>
    <li>Methods share; arrow fields copy</li></ul>`,
    box('Practice (20 min)', 'Build <code class="i">class Cart</code> with private <code class="i">#items</code>, <code class="i">add(name, price, qty)</code>, a <code class="i">total</code> getter and <code class="i">clear()</code>; then <code class="i">class VipCart extends Cart</code> whose total is 10% off.<br><br><b>Done when</b>: add 2 × 50 000 and 1 × 100 000 ⇒ total 200 000; VIP ⇒ 180 000; <code class="i">cart.#items</code> is a SyntaxError outside the class.', 'ok')) },
]);
