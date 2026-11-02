/** Web Foundations · deck bài 8.1 — Vì sao cần CSDL. Output thật: _demo/_t8 (json-vs-db.mjs, sqlite3). */
import { deckWf, term, box, two, tbl, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-8-1', code: 'WF 8.1', title: 'Why a database', sub: 'Web Foundations · Chapter 8' };

export const slides = deckWf({ chuong: 'Chapter 8 — Data & SQL', bai: '8.1' }, [
  { cover: true, t: 'Why a database', sub: 'An app forgets everything unless something remembers for it' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain why memory and <b>JSON files</b> fail</li>
    <li>Read a <b>table definition</b></li>
    <li>Name <b>tables, rows, columns, keys</b></li>
    <li>Use <b>constraints</b> to refuse bad data</li>
    <li>Choose <b>relational</b> or <b>document</b></li></ul>` },

  { t: 'A JSON file under load', giua: true, body: term('_t8/out/json-vs-db', null, { title: 'node json-vs-db.mjs — 2 users × 200 likes' }) + two(box('Lost updates', 'about half of the likes vanished', 'bad'), box('Torn reads', 'Unexpected end of JSON input — the file was half-written', 'bad')) },

  { t: 'Read, change, write', to: true, giua: true, body: steps([
      '<b>File</b>: read the whole file → change one number → write it all back',
      'Two requests overlap → the second writes an old value',
      '<b>Database</b>: <code class="i">UPDATE posts SET likes = likes + 1</code> — one atomic step',
      'A journal on disk survives crashes mid-write',
    ]) + box('Rule', 'Use a database from the first version other people use.', 'ok') },

  { t: 'Tables, rows, columns', giua: true, body: term('_t8/out/schema', null, { title: 'sqlite3 blog.db' }) },

  { t: 'Constraints refuse bad data', giua: true, body: term('_t8/out/constraints', null, { title: 'four bad inserts' }) + box('SQLite only', 'checks foreign keys after <code class="i">PRAGMA foreign_keys = ON;</code>', 'info') },

  { t: 'Relational or document?', to: true, giua: true, body: tbl(['', 'Relational (SQL)', 'Document'], [
      ['examples', 'PostgreSQL, MySQL, SQLite', 'MongoDB, Firestore'],
      ['shape', 'tables + keys', 'JSON-like documents'],
      ['strong at', 'relations, constraints, transactions', 'flexible shapes'],
      ['default for', 'most web apps', 'logs, varied content'],
    ]) + two(box('Safe default', 'a relational database for users, orders, comments', 'ok'), box('Not either-or', 'PostgreSQL also stores JSON columns', 'info')) },

  { t: 'SQL in one sentence', to: true, giua: true, body: tbl(['SQL', 'HTTP (Chapter 6)', 'Lesson'], [
      ['SELECT', 'GET', '8.2'], ['INSERT', 'POST', '8.3'], ['UPDATE', 'PUT / PATCH', '8.3'], ['DELETE', 'DELETE', '8.3'],
    ]) + box('Declarative', 'You say WHAT you want; the database decides HOW (scan or index).', 'info') + box('This chapter: SQLite', 'zero setup, one file. The PostgreSQL course runs the same SQL on a server.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Files lose updates under load</li>
    <li>Tables · rows · columns · keys</li>
    <li>Constraints guard every code path</li>
    <li>SQL: SELECT INSERT UPDATE DELETE</li></ul>`,
    box('Practice (25 min)', 'Build blog.db from blog.sql, read .schema, break UNIQUE, NOT NULL, CHECK and the foreign key.<br><br><b>Done when</b>: four refusals and still 3 users.', 'ok')) },
]);
