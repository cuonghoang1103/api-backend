/** Web Foundations · deck bài 6.5 — REST, tham số, query. Output thật: _demo/_t6 (curl lọc/sắp/trang, limit=abc; form GET Chromium; idor.mjs), _demo/6-5. */
import { deckWf, js, con, term, box, two, tbl, OUT } from './_wf-bai.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

export const deck = { key: 'wf-6-5', code: 'WF 6.5', title: 'REST, params and query', sub: 'Web Foundations · Chapter 6' };

export const slides = deckWf({ chuong: 'Chapter 6 — HTTP & APIs', bai: '6.5' }, [
  { cover: true, t: 'REST, params and queries', sub: 'Predictable addresses for things, and options for how to see them' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Design <b>RESTful</b> URLs</li>
    <li>Choose <b>path</b> or <b>query</b> for a value</li>
    <li>Build query strings with <b>URLSearchParams</b></li>
    <li>Validate values that arrive as <b>strings</b></li>
    <li>Check <b>ownership</b> instead of trusting an id</li></ul>` },

  { t: 'Nouns in the path, verbs in the method', to: true, giua: true, body: tbl(['Request', 'Means'], [
      ['GET /posts', 'the collection'], ['POST /posts', 'create one'], ['GET /posts/17', 'one post'],
      ['PATCH · DELETE /posts/17', 'change · delete it'], ['GET /posts/17/comments', 'its comments'],
    ]) + two(box('Avoid', '<code class="i">/getPosts</code>, <code class="i">/deletePost?id=17</code>, deep nesting', 'bad'), box('Prefer', 'plural nouns, lower-case-with-dashes, one level of nesting', 'ok')) },

  { t: 'Path or query?', to: true, giua: true, body: tbl(['', 'Example', 'Question it answers'], [
      ['Path', '/api/products/3', 'WHICH thing?'],
      ['Query', '?category=office&sort=-price&page=2', 'HOW to filter, sort, page it?'],
    ]) + box('Rule of thumb', 'Remove it: a different thing → path. The same collection, seen differently → query (with a default).', 'ok')
    + two(box('Odd', '<code class="i">/products?id=3</code> — an id is identity, not an option', 'bad'), box('Odd', '<code class="i">/products/office/price-desc/2</code> — options pretending to be things', 'bad')) },

  { t: 'Filtering, sorting, paging', giua: true, body: term(null, doan('_t6/out/query', 0, 1, 2), { title: 'curl' }) },

  { t: 'Encoding the query', giua: true, body: term(null, doan('_t6/out/query', 3, 4), { title: 'curl' }) + two(con('6-5/tham-so', null, { title: 'URLSearchParams · Chromium' }), con('_t6/out/form-get', null, { title: 'form method="get" · Chromium' }), 'r55') },

  { t: 'Everything arrives as a string', giua: true, body: term(null, doan('_t6/out/query', 5, 6, 7), { title: 'curl' }) + two(box('limit=abc', 'Number → NaN → empty list, no error. Wrong data is worse than an error.', 'bad'), box('Do', 'convert · check · default · cap · <b>400</b> when invalid', 'ok')) },

  { t: 'An id is not permission', giua: true, body: js('_t6/idor.mjs', null, { gon: true, chi: [14, 17] }) + term('_t6/out/idor', null, { title: 'node idor.mjs · logged in as "an"' }) + box('IDOR — OWASP API #1', 'Logged in ≠ allowed to see this. Filter every lookup by owner; answer 404.', 'bad') },

  { t: 'The whole chapter in one request', to: true, giua: true, body: tbl(['Piece', 'Example', 'Lesson'], [
      ['method + path + query', 'POST /api/products?notify=false', '6.2 · 6.5'],
      ['headers', 'Content-Type · Accept · Authorization', '6.4'],
      ['body', '{"name":"Tape","price":15000}', '6.4'],
      ['status + headers + body', '201 Created · Location · JSON', '6.3 · 6.4'],
    ]) + box('Next: Node.js', 'In Express this request is <code class="i">app.post(\'/api/products\', …)</code> reading <code class="i">req.query</code>, <code class="i">req.get()</code>, <code class="i">req.body</code> and answering <code class="i">res.status(201).location(…).json(…)</code>.', 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Nouns in paths, verbs in methods</li>
    <li>Path = which, query = how</li>
    <li>URLSearchParams, never string glue</li>
    <li>Validate strings; check the owner</li></ul>`,
    box('Practice (40 min)', 'Design a library API; validate limit/page (400); add minPrice + sort=name; stop <code class="i">an</code> deleting note 13.<br><br><b>Done when</b>: <code class="i">?limit=abc</code> → 400 and note 13 survives.', 'ok')) },
]);
