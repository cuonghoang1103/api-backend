/** Web Foundations · deck bài 11.4 — Map, Set và bất biến. */
import { deckWf, js, con, box, two, steps, tbl, vsd, flow, OUT } from './_wf-bai.mjs';

const O = OUT['11-4/object-as-map'].split('\n');
const OUT_OBJ = O.slice(0, 2).join('\n');
const OUT_MAP = O.slice(2).join('\n');

export const deck = { key: 'wf-11-4', code: 'WF 11.4', title: 'Map, Set & immutability', sub: 'Web Foundations · Chapter 11' };

export const slides = deckWf({ chuong: 'Chapter 11 — Advanced JavaScript', bai: '11.4' }, [
  { cover: true, t: 'Map, Set & immutability', sub: 'The right container for the job — and the habit React depends on: replace, do not mutate' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Pick <b>Map</b> over a plain object for a dictionary — and say why</li>
    <li>Remove duplicates and compare groups with <b>Set</b></li>
    <li>Explain <b>reference vs value</b>: why <code class="i">{x:1} === {x:1}</code> is false</li>
    <li>Update objects and arrays <b>without mutating</b> them</li>
    <li>Know that spread and <code class="i">freeze</code> are <b>shallow</b></li></ul>
    ${box('Why', 'React decides whether to re-render by comparing references. Mutating state is the #1 “my screen does not update” bug.', 'info')}` },

  { t: 'An object turns every key into a string', body: `${js('11-4/object-as-map.mjs', null, { chi: [1, 9] })}
    ${two(con(null, OUT_OBJ), box('Collision', '<code class="i">1</code> and <code class="i">&#39;1&#39;</code> are the same key; two different objects both become <code class="i">"[object Object]"</code> ⇒ Minh overwrote Lan.', 'bad'), 'r46')}
    ${box('Why', 'Object keys are always strings. JavaScript calls <code class="i">String(key)</code> on whatever you use — for an object that is <code class="i">"[object Object]"</code>.', 'info')}` },

  { t: 'Map keeps keys exactly as they are', body: `${js('11-4/object-as-map.mjs', null, { chi: [11, 15] })}
    ${con(null, OUT_MAP)}
    ${tbl(['', 'Plain object', 'Map'], [['Key types', 'strings (and symbols)', 'anything, even objects'], ['Size', 'Object.keys(o).length', 'm.size'], ['Order', 'mostly insertion, numbers first', 'always insertion'], ['JSON', 'works', 'needs Object.fromEntries']])}
    ${box('Methods', '<code class="i">set</code> (chainable) · <code class="i">get</code> · <code class="i">has</code> · <code class="i">delete</code> · <code class="i">size</code> · <code class="i">for (const [k, v] of m)</code>', 'ok')}` },

  { t: 'Map in practice: counting and converting', body: `${js('11-4/map-api.mjs')}
    ${two(con('11-4/map-api'), box('Trap', '<code class="i">JSON.stringify(map)</code> gives <code class="i">{}</code> — convert with <code class="i">Object.fromEntries</code> first, and back with <code class="i">new Map(Object.entries(o))</code>.', 'bad'))}` },

  { t: 'Set: a collection without duplicates', body: two(js('11-4/set.mjs'), `${con('11-4/set')}
    ${box('', 'Set compares like <code class="i">===</code>: two look-alike objects are two members.', 'info')}`, 'r73') },

  { t: 'Reference vs value', body: `${js('11-4/reference.mjs')}
    ${two(con('11-4/reference'), box('Mental picture', 'A variable holding an object is a <b>name tag</b> on it, not a box containing it. <code class="i">b = a</code> adds a second tag to the SAME object.', 'info'))}` },

  { t: 'Immutable updates for objects', body: two(js('11-4/immutable-update.mjs'), `${con('11-4/immutable-update')}
    ${box('Spread is shallow', 'The “copy” still shares <code class="i">address</code> ⇒ editing it changed <code class="i">user</code>.', 'bad')}
    ${box('Fix', 'Copy every level you change, or <code class="i">structuredClone</code>.', 'ok')}`, 'r73') },

  { t: 'Immutable updates for arrays', body: `${js('11-4/array-immutable.mjs')}${con('11-4/array-immutable')}` },

  { t: 'Mutating vs non-mutating array methods', to: true, body: vsd(`<p><code class="i">push</code> <code class="i">pop</code> <code class="i">splice</code> <code class="i">sort</code> <code class="i">reverse</code> <code class="i">fill</code>, <code class="i">arr[i] = x</code></p><p>Change the original array.</p>`,
    `<p><code class="i">[...arr, x]</code> <code class="i">filter</code> <code class="i">map</code> <code class="i">slice</code> <code class="i">toSorted</code> <code class="i">toReversed</code> <code class="i">with</code> <code class="i">concat</code></p><p>Return a NEW array.</p>`, '✗ Mutate (avoid on state)', '✓ Return new (use on state)')
    + box('Rule for React state', 'Never call a mutating method on an array that is state. Build the next array and pass it to the setter.', 'info')
    + steps(['Add: <code class="i">[...todos, item]</code>', 'Remove: <code class="i">todos.filter(t =&gt; t.id !== id)</code>', 'Update one: <code class="i">todos.map(t =&gt; t.id === id ? { ...t, done: true } : t)</code>']) },

  { t: 'freeze is shallow too', body: `${js('11-4/freeze.mjs')}
    ${two(con('11-4/freeze'), box('', 'Use <code class="i">Object.freeze</code> for constants and to catch accidental writes in development — it is not a deep lock: the inner array still accepted <code class="i">push</code>.', 'info'))}
    ${box('Strict mode again', 'In a module the write to a frozen property <b>throws</b>; in an old script it is silently ignored.', 'ok')}` },

  { t: 'Why React cares: a 15-line imitation', body: `${js('11-4/fake-react.mjs')}
    ${two(con('11-4/fake-react'), box('', 'Same reference ⇒ “nothing changed” ⇒ no re-render, even though the array has new contents. React does exactly this check with <code class="i">Object.is</code>.', 'bad'))}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Dictionary with non-string keys ⇒ <b>Map</b></li>
    <li>Unique values ⇒ <b>Set</b></li>
    <li>Objects are shared by <b>reference</b></li>
    <li>Replace, do not mutate</li>
    <li>Spread &amp; freeze are <b>shallow</b></li>
    <li><code class="i">toSorted</code>, not <code class="i">sort</code>, on state</li></ul>`,
    box('Practice (20 min)', 'Write <code class="i">toggleTodo(todos, id)</code>, <code class="i">addTag(todo, tag)</code> (no duplicate tags, via Set) and <code class="i">groupByStatus(todos)</code> returning a Map.<br><br><b>Done when</b>: the input array and objects are unchanged (check with <code class="i">===</code>), untouched todos are reused, and the Map has keys <code class="i">done</code> / <code class="i">open</code>.', 'ok')) },
]);
