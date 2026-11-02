/** Web Foundations · deck bài 4.4 — Mảng và object. Output thật: _demo/4-4 (Chromium). */
import { deckWf, js, con, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-4-4', code: 'WF 4.4', title: 'Arrays and objects', sub: 'Web Foundations · Chapter 4' };

export const slides = deckWf({ chuong: 'Chapter 4 — JavaScript', bai: '4.4' }, [
  { cover: true, t: 'Arrays and objects', sub: 'Lists and records: the shape of real data, and the four methods you use every day' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Create and change <b>arrays</b></li>
    <li>Transform lists with <b>map, filter, find, reduce</b></li>
    <li><b>Sort</b> correctly, including Vietnamese names</li>
    <li>Read and update <b>objects</b> safely</li>
    <li><b>Copy</b> data without changing the original</li>
    <li>Convert to and from <b>JSON</b></li></ul>` },

  { t: 'Array basics', giua: true, body: two(js('4-4/mang.js', null, { gon: true }), `${con('4-4/mang')}
    ${tbl(['Changes it', 'Returns new'], [['push pop splice', 'slice concat'], ['sort reverse', 'map filter toSorted']])}`, 'r64') },

  { t: 'map, filter, find, reduce', giua: true, body: two(js('4-4/map-filter-reduce.js', null, { gon: true, chi: [8, 22] }), `${con('4-4/map-filter-reduce')}
    ${box('Always', 'Give <code class="i">reduce</code> a starting value.', 'bad')}`, 'r73') },

  { t: 'Sorting has traps', giua: true, body: two(js('4-4/sap-xep.js', null, { gon: true, chi: [1, 15] }), `${con('4-4/sap-xep')}
    ${steps(['Compares as <b>text</b>: pass <code class="i">(a, b) =&gt; a - b</code>', 'Sorts <b>in place</b>: copy first or <code class="i">toSorted</code>', 'Names: <code class="i">localeCompare(y, \'vi\')</code>'])}`, 'r64') },

  { t: 'Objects', giua: true, body: `${two(js(null, `const user = { name: 'Linh', age: 20,
  'favourite color': 'blue', address: { city: 'Hà Nội' } };
user.name; user['favourite color'];
const field = 'age';
user[field];  user.field;          // 20 · undefined
user.email = 'linh@example.com';   // add
delete user['favourite color'];    // remove
Object.keys(user);
user.phone?.number;                // undefined, no crash
const { name, age: years, phone = 'none' } = user;`, { gon: false }), con('4-4/doi-tuong'))}` },

  { t: 'Copies are shallow', to: true, giua: true, body: `${js(null, `const older = { ...user, age: 22 };     // user.age stays 21
const shallow = { ...user };
shallow.address.city = 'Huế';           // user.address.city is now 'Huế'!

const safe = { ...user, address: { ...user.address, city: 'Huế' } };
const deep = structuredClone(user);`, { gon: false })}
    ${box('Spread copies one level', 'Nested objects stay shared. Copy every level you change, or use <code class="i">structuredClone</code>. This is how React state is updated.', 'info')}` },

  { t: 'JSON', giua: true, body: two(js(null, `const product = { name: 'Book', price: 100,
  tags: ['a', 'b'], stock: undefined,
  added: new Date(0), fn() {} };
const text = JSON.stringify(product);
JSON.stringify({ a: 1, b: [1, 2] }, null, 2);
const back = JSON.parse(text);
JSON.parse("{name: 'Linh'}");      // SyntaxError
structuredClone({ a: { b: 1 } });`, { gon: false }), `${con('4-4/json')}
    ${box('Lost on the way', '<code class="i">undefined</code> and functions vanish; dates become strings. Parse untrusted text in <code class="i">try/catch</code>.', 'bad')}`, 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Know which methods mutate</li>
    <li>map · filter · find · reduce(…, 0)</li>
    <li>Sort with a compare function</li>
    <li>Spread is shallow</li>
    <li>JSON is text</li></ul>`,
    box('Practice (30 min)', 'A product list with no manual loops.<br><br><b>Done when</b>: stock value is 5010000, categories count <code class="i">{ clothes: 2, office: 1, home: 1 }</code>, the Vietnamese sort ends with “Quần jean”, and the original list is untouched.', 'ok')) },
]);
