/** Web Foundations · deck bài 8.5 — ORM với Prisma. Output thật: _demo/_t8/prisma/chay-prisma.sh (Prisma 5.22 + SQLite tạm). */
import { deckWf, js, ts, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const buoc = (...n) => { const p = OUT['_t8/out/prisma'].split(/\n+(?=> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-8-5', code: 'WF 8.5', title: 'ORMs and Prisma', sub: 'Web Foundations · Chapter 8' };

export const slides = deckWf({ chuong: 'Chapter 8 — Data & SQL', bai: '8.5' }, [
  { cover: true, t: 'ORMs and Prisma', sub: 'JavaScript instead of SQL strings — and the SQL is still there' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read a <b>Prisma schema</b></li>
    <li>Query with <b>relations</b> — and see the SQL</li>
    <li>Turn <b>P2002 / P2025</b> into 409 / 404</li>
    <li>Let <b>types</b> catch mistakes</li>
    <li>Use <b>raw SQL</b> safely</li></ul>` },

  { t: 'What an ORM does', to: true, giua: true, body: steps([
      '<b>Schema</b> — models, fields, relations',
      '<b>Generate</b> — a typed client',
      '<b>Call</b> — prisma.post.findMany({ where })',
      '<b>SQL + parameters</b> — sent for you',
      '<b>Objects</b> — published is a real true',
    ]) },

  { t: 'One schema, three models', giua: true, body: term('_t8/out/prisma-push', null, { title: 'npx prisma db push' }) + two(box('db push', 'prototypes only — may drop columns', 'bad'), box('migrate dev / deploy', 'reviewed migration files in Git', 'ok')) },

  { t: 'Calls become SQL', giua: true, body: term(null, buoc(0, 1), { title: "log: 'query'" }) + box('include', '2 queries with IN — never one per row. A for-loop of findUnique is N+1.', 'info') },

  { t: 'Writes and errors', giua: true, body: term(null, buoc(3, 4), { title: 'errors you should expect' }) + tbl(['Prisma code', 'Means', 'HTTP'], [['P2002', 'unique constraint failed', '409'], ['P2025', 'record not found', '404']]) },

  { t: 'Types catch mistakes', giua: true, body: ts('_t8/prisma/check.ts', null, { gon: true }) + term('_t8/out/prisma-types', null, { title: 'npx tsc --noEmit' }) },

  { t: 'Raw SQL, safely', giua: true, body: term(null, buoc(5, 6), { title: '$queryRaw vs $queryRawUnsafe' }) + box('Unsafe means unsafe', 'Tagged template only; never glue values into $queryRawUnsafe.', 'bad') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>One schema, typed client</li>
    <li>Watch the query log</li>
    <li>include / select, not loops</li>
    <li>Migrations for real data</li></ul>`,
    box('Practice (45 min)', 'Prisma + SQLite in an empty folder, a Tag model, logged SQL, errors mapped to HTTP.<br><br><b>Done when</b>: users-with-posts is 2 queries and a duplicate email gives 409.', 'ok')) },
]);
