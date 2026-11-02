/** Web Foundations · deck bài 8.2 — SELECT. Output thật: _demo/_t8/chay.sh (sqlite3 trên blog.sql; chỉ mục trên 300 000 dòng). */
import { deckWf, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=sqlite> )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-8-2', code: 'WF 8.2', title: 'SELECT', sub: 'Web Foundations · Chapter 8' };

export const slides = deckWf({ chuong: 'Chapter 8 — Data & SQL', bai: '8.2' }, [
  { cover: true, t: 'SELECT', sub: 'Asking the database a question' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Choose <b>columns</b> and filter <b>rows</b></li>
    <li>Sort and <b>page</b> results</li>
    <li>Avoid the <b>NULL</b> trap</li>
    <li>Summarise with <b>COUNT, SUM, GROUP BY</b></li>
    <li>Read a <b>query plan</b> and add an index</li></ul>` },

  { t: 'Columns and rows', giua: true, body: term(null, doan('_t8/out/select-where', 1, 2), { title: 'sqlite3 blog.db' }) + box('Text in single quotes', "<code class=\"i\">'Lan'</code> is a value; <code class=\"i\">\"Lan\"</code> may be read as a column name.", 'info') },

  { t: 'Sort and page', giua: true, body: term('_t8/out/order-limit', null, { title: 'ORDER BY · LIMIT · OFFSET' }) + two(box('Page N', 'OFFSET = (page − 1) × limit — Lesson 6.5 in SQL', 'ok'), box('LIMIT without ORDER BY', 'order is not guaranteed — pages repeat and skip rows', 'bad')) },

  { t: 'The NULL trap', giua: true, body: term('_t8/out/null', null, { title: 'NULL = unknown' }) + box('Rule', '<code class="i">= NULL</code> is never true. Use <code class="i">IS NULL</code>. <code class="i">count(col)</code> skips NULLs.', 'bad') },

  { t: 'Summaries', giua: true, body: term(null, doan('_t8/out/aggregate', 1, 2), { title: 'GROUP BY · HAVING' }) + box('WHERE vs HAVING', 'WHERE filters rows before grouping; HAVING filters groups after.', 'info') },

  { t: 'The order SQL runs in', to: true, giua: true, body: steps([
      '<b>FROM</b> — which tables (and joins)',
      '<b>WHERE</b> — filter rows (no aggregates yet)',
      '<b>GROUP BY · HAVING</b> — form and filter groups',
      '<b>SELECT</b> — choose and name columns',
      '<b>ORDER BY · LIMIT</b> — sort, then cut',
    ]) },

  { t: 'An index, measured', giua: true, body: term('_t8/out/index', null, { title: '300 000 rows' }) + box('SCAN → SEARCH', 'Index columns you filter, join and sort on. Check with EXPLAIN QUERY PLAN.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>SELECT … FROM … WHERE … ORDER BY … LIMIT</li>
    <li>IS NULL, never = NULL</li>
    <li>GROUP BY + HAVING</li>
    <li>Index what you search</li></ul>`,
    box('Practice (35 min)', 'Eight questions about the blog, then index a 300 000-row table.<br><br><b>Done when</b>: every answer matches and the plan says SEARCH … USING INDEX.', 'ok')) },
]);
