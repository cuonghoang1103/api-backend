/** Web Foundations · deck bài 8.4 — Quan hệ và JOIN. Output thật: _demo/_t8 (sqlite3, nhieu-nhieu.sh, n-plus-1.mjs). */
import { deckWf, js, term, box, two, tbl, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=sqlite> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-8-4', code: 'WF 8.4', title: 'Relationships and JOINs', sub: 'Web Foundations · Chapter 8' };

export const slides = deckWf({ chuong: 'Chapter 8 — Data & SQL', bai: '8.4' }, [
  { cover: true, t: 'Relationships and JOINs', sub: 'Real data is tables that point at each other' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain <b>primary</b> and <b>foreign keys</b></li>
    <li>Choose <b>INNER</b> or <b>LEFT JOIN</b></li>
    <li>Count related rows <b>including zero</b></li>
    <li>Model <b>many-to-many</b></li>
    <li>Spot the <b>N+1</b> problem</li></ul>` },

  { t: 'Keys connect tables', to: true, giua: true, body: tbl(['', 'Example', 'Means'], [
      ['primary key', 'users.id', 'identifies each row'],
      ['foreign key', 'posts.user_id → users.id', '"written by user 1"'],
      ['one-to-many', 'user → posts', 'FK on the "many" side'],
      ['many-to-many', 'posts ↔ tags', 'needs a join table'],
    ]) + box('A foreign key constraint', 'makes the database check that user_id points at a real user (SQLite: PRAGMA foreign_keys = ON).', 'ok') },

  { t: 'INNER or LEFT', giua: true, body: two(term(null, doan('_t8/out/joins', 0), { title: 'INNER JOIN' }), term(null, doan('_t8/out/joins', 1), { title: 'LEFT JOIN' }), 'r55') + box('Ask', 'May the left row exist without a partner — and do I want to see it? Yes → LEFT.', 'info') },

  { t: 'Counting with zeros', giua: true, body: two(term(null, doan('_t8/out/joins-count', 0), { title: 'LEFT JOIN — An stays, with 0' }), term(null, doan('_t8/out/joins-count', 1), { title: 'INNER JOIN — An vanishes' }), 'r55') },

  { t: 'Many-to-many', giua: true, body: term(null, doan('_t8/out/many-to-many', 1, 3), { title: 'post_tags (post_id, tag_id)' }) },

  { t: 'When the parent is deleted', giua: true, body: two(term(null, doan('_t8/out/cascade', 1, 2), { title: 'ON DELETE CASCADE' }), term('_t8/out/restrict', null, { title: 'no action' }), 'r55') + tbl(['Rule', 'Effect'], [['CASCADE', 'children deleted too'], ['(default)', 'delete refused'], ['SET NULL', 'children kept, FK = NULL']]) },

  { t: 'The N+1 problem', giua: true, body: js('_t8/n-plus-1.mjs', null, { gon: true, chi: [15, 19] }) + term('_t8/out/n-plus-1', null, { title: '1 000 posts' }) + box('Fix', 'one query: <code class="i">SELECT posts.title, users.name FROM posts JOIN users ON users.id = posts.user_id</code>', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>FK on the many side</li>
    <li>LEFT JOIN keeps zeros</li>
    <li>Join tables for many-to-many</li>
    <li>One JOIN, not N+1</li></ul>`,
    box('Practice (40 min)', 'Six join questions, a tag table, an N+1 loop rewritten.<br><br><b>Done when</b>: An shows 2 comments, three posts have none, and the rewrite runs 1 query.', 'ok')) },
]);
