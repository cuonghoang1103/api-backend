/** Web Foundations · deck bài 8.3 — Ghi dữ liệu. Output thật: _demo/_t8/chay.sh (sqlite3), _demo/_t8/injection.mjs (node:sqlite). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=sqlite> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const tx = (...n) => { const p = OUT['_t8/out/transaction'].split(/\n+(?=-- \()/); return n.map((i) => p[i].trim()).join('\n\n'); };
const dong = (key, a, b) => OUT[key].split('\n').slice(a - 1, b).join('\n');

export const deck = { key: 'wf-8-3', code: 'WF 8.3', title: 'Writing data', sub: 'Web Foundations · Chapter 8' };

export const slides = deckWf({ chuong: 'Chapter 8 — Data & SQL', bai: '8.3' }, [
  { cover: true, t: 'Writing data', sub: 'INSERT, UPDATE, DELETE, transactions — and SQL injection' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>INSERT, UPDATE, DELETE with <b>RETURNING</b></li>
    <li>Catch an UPDATE <b>without WHERE</b></li>
    <li>Use a <b>transaction</b> that really rolls back</li>
    <li>Recognise <b>SQL injection</b></li>
    <li>Send values as <b>parameters</b></li></ul>` },

  { t: 'INSERT, UPDATE, DELETE', giua: true, body: two(term(null, doan('_t8/out/crud', 0, 1), { title: 'INSERT · UPDATE … RETURNING' }), term(null, doan('_t8/out/crud', 2, 3), { title: 'DELETE … RETURNING' }), 'r55') },

  { t: 'The missing WHERE', giua: true, body: term(null, doan('_t8/out/no-where', 1, 2), { title: 'UPDATE without WHERE' }) + box('Habit', 'Write WHERE first · SELECT the same WHERE first · check the changed-row count in code', 'ok') },

  { t: 'Money from nowhere', giua: true, body: term(null, tx(0), { title: 'two statements, no transaction' }) + box('Half done', 'Lan +700 000, Minh −0. Nothing reported it.', 'bad') },

  { t: 'A transaction must roll back', giua: true, body: two(term(null, tx(1), { title: '(b) keeps going after the error' }), term(null, tx(2), { title: '(c) stops at the first error' }), 'r55') + box('In code', '<code class="i">BEGIN</code> → try: statements, <code class="i">COMMIT</code> → catch: <code class="i">ROLLBACK</code>', 'ok') },

  { t: 'SQL injection', giua: true, body: term(null, dong('_t8/out/injection', 5, 11), { title: 'node injection.mjs — glued strings' }) + two(box('Leaked', 'unpublished drafts, then every user\'s email', 'bad'), box('Broken', 'an honest apostrophe → syntax error → 500', 'bad')) },

  { t: 'Parameters fix it', giua: true, body: js('_t8/injection.mjs', null, { gon: true, chi: [17, 19] }) + term(null, dong('_t8/out/injection', 13, 20), { title: 'parameters vs glue' }) + box('Every value, every time', '<code class="i">?</code> · <code class="i">$1</code> · Prisma tagged templates. Names come from an allow-list.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Check affected-row counts</li>
    <li>COMMIT on success, ROLLBACK on error</li>
    <li>Never glue input into SQL</li></ul>`,
    box('Practice (40 min)', 'Notes CRUD, an UPDATE without WHERE, a transfer with real rollback in Node, attack then fix a search.<br><br><b>Done when</b>: balances unchanged after the failed transfer; 0 rows for the injection.', 'ok')) },
]);
