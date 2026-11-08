/**
 * sdn-04-1 — SDN302 · Chapter 4 · Lesson 4.1 "A full REST API with Express, Mongoose & MVC" (slide EN, kiểu FU, đợt 5 — 01/11/2026). MỘT deck, HAI tập:
 *   4.1a (sdn-4-1)   = slide 1–15: vì sao chia lớp (controller béo) · route → controller → service → model, chiều phụ thuộc · cây thư mục · model, service,
 *                      controller (endpoint create đúng cách của bài web), routes + app · bảng mã trạng thái · chạy thật đủ CRUD bằng curl (201/400/200/204/404) +
 *                      log server từng tầng · bài tập đoán mã · tự kiểm + tóm tắt.
 *   4.1b (sdn-4-1-2) = slide 16–28: không có error handler ⇒ 500 HTML lộ stack (thật) · một hình dạng lỗi { error, details? } · CastError ⇒ 400, ValidationError ⇒ 400 +
 *                      details, 11000 ⇒ 409, còn lại 500 (không lộ) · chạy thật · phân trang skip/limit + countDocuments + chặn limit + sort có khoá phụ _id (thật) ·
 *                      Express 4 cần try/catch + next(err) · bài tập · tự kiểm + tóm tắt.
 * Nguồn: content/academy/SDN302.mjs › sdn302-4-1-rest-mvc. Output THẬT Express 5.3.0 + Mongoose 9.11.4 + MongoDB 7.0.37 (Node 22.23.3), cổng 4300: that/s4mvc/*, that/s4/raw-errors.
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot, gay, rc } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-04-1', code: 'SDN 4.1', title: 'A full REST API with Express, Mongoose & MVC', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const W = (t) => t.split(" -w '  [%{http_code}]'").join('').split(" -o /dev/null").join('');
const S = (a, b, n = 106) => gay(W(rc('s4mvc/server', a, b)), n);
const ID = /"_id":"([0-9a-f]{24})","name":"Lamp"/.exec(ra('s4mvc/server', 14, 14))?.[1] ?? '?';
const SV = (a, b) => ra('s4mvc/server', a, b, 'server');

/** Cây thư mục MVC (SVG). */
function cay() {
  const w = 1110, h = 330;
  const dong = [
    [0, '📁 src/', ''], [1, '📄 server.js', 'connect MongoDB, then listen', CAM], [1, '📄 app.js', 'middleware, routers, 404, error handler', NODE],
    [1, '📁 routes/', ''], [2, '📄 product.routes.js', 'URL + method → controller', LAM], [1, '📁 controllers/', ''], [2, '📄 product.controller.js', 'read req, validate, status', CAM],
    [1, '📁 services/', ''], [2, '📄 product.service.js', 'business rules, no HTTP', TIM], [1, '📁 models/', ''], [2, '📄 product.model.js · category.model.js', 'the only layer that touches MongoDB', NODE],
  ];
  let s = `<svg data-k="cay" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  dong.forEach(([cap, t, g, mau], i) => {
    const y = 24 + i * 29, x = 10 + cap * 30;
    s += `<text data-k="tep" x="${x}" y="${y}" font-size="20" font-family="Menlo,monospace" fill="#222">${t}</text>`;
    if (g) s += `<text x="600" y="${y}" font-size="18.5" fill="${mau}" font-weight="700">${g}</text>`;
  });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Chapter 4 — REST API with MVC', bai: '4.1' }, [
  // ───── PHẦN A (sdn-4-1): slide 1–15 ─────
  { cover: true, t: 'A full REST API<br>with Express, Mongoose & MVC', sub: 'Every layer one job, every request run for real with curl.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(box('Part 1 (this video)', '<ul><li>Why one big route file loses marks</li><li>Four layers and who may call whom</li><li>The folder structure</li><li>Model · service · controller · routes</li><li>Full CRUD, run with curl</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>One error shape for every failure</li><li>CastError · ValidationError · 11000</li><li>Pagination with skip / limit</li><li>Express 4 vs 5 and async errors</li></ul>', 'lam')) +
    box('CLO5 + the Practical Exam', 'This is the core of both: a REST API with Express, Mongoose and population.', '') +
    box('Builds on', 'Lesson 2.1 (routers), 3.2 (Mongoose), and the 7 ways to lose marks from lesson 0.5.', 'lam') },

  { t: 'Picture a restaurant', to: true, giua: true, body: flow([
    { t: 'Route', s: 'door: which table?', mau: LAM }, { t: 'Controller', s: 'waiter: takes the order', mau: CAM }, { t: 'Service', s: 'chef: the recipe', mau: TIM }, { t: 'Model', s: 'pantry: ingredients', mau: NODE },
  ], { h: 160, fs: 22 }) + two(
    box('✗ Fat controller', 'One person greets, cooks and fetches from the pantry. It works, until you need to change anything.', 'do2'),
    box('✓ Layers', 'Each layer one job. You can change the recipe without retraining the waiter, and test the chef alone.', 'xanh')) +
    box('Lesson 0.5, mistake 5', '“Fat controller: all logic in the route” is one of the seven ways students lose marks.', 'lam') },

  { t: 'Four layers, one direction', to: true, giua: true, body: bang(['Layer', 'Job', 'Knows about'], [
    ['Route', 'maps URL + method to a controller: <code class="i">router.post(\'/\', create)</code>', 'Express'],
    ['Controller', 'reads req, validates, calls the service, sends status + JSON', 'HTTP'],
    ['Service', 'business rules, coordinates model calls', 'no HTTP at all'],
    ['Model (Mongoose)', 'the only layer that touches the database', 'MongoDB'],
  ], { co: 22 }) + box('Dependency direction', 'Route → Controller → Service → Model. Never the other way: a model never imports a controller.', 'xanh') +
    box('Why “no HTTP” in the service?', 'The same service can then be reused by a script, a worker or a test (Node.js course 18.1).', 'lam') },

  { t: 'The folder structure', to: true, giua: true, body: cay() + box('One resource, one file per layer', 'Add a resource = add four files. You always know where a URL is handled.', 'xanh') },

  { t: 'Model', body: js(ma('s4mvc/product.model', 1, 10)) + js(ma('s4mvc/category.model', 3, 3), { sm: true }) + three(
    box('unique + uppercase', '<code class="i">bk-001</code> is stored as <b>BK-001</b> and must be unique.', 'lam'),
    box('ref: \'Category\'', 'A reference, so the API can populate the category name.', 'xanh'),
    box('timestamps', 'createdAt and updatedAt for free.', '')) },

  { t: 'Service: business rules, no HTTP', body: js(ma('s4mvc/product.service', 1, 2) + '\n' + ma('s4mvc/product.service', 4, 20), { sm: true }) },

  { t: 'Proof: the service runs without Express', to: true, giua: true, body: js(ma('s4mvc/script', 1, 4) + '\n…\n' + ma('s4mvc/script', 10, 13), { sm: true }) + term(ra('s4mvc/script', 1, 2), { title: 'node scripts/report.js · real' }) + two(
    box('No req, no res, no server', 'A plain script calls the same service: rules (category name → id) and pagination still apply.', 'xanh'),
    box('Why it matters', 'Seed scripts, scheduled jobs and unit tests reuse the service instead of copying logic out of a route.', 'lam')) },

  { t: 'Controller: the create endpoint, done right', body: js(ma('s4mvc/product.controller', 1, 12), { sm: true }) + three(
    box('Validate → 400', 'Missing name or price: answer 400, stop.', 'do2'), box('201 Created', 'A successful create is not a plain 200.', 'xanh'), box('next(err)', 'Errors are passed on, never swallowed.', 'lam')) +
    box('Pick the fields', '<code class="i">{ name, price, sku, category }</code>: the client cannot sneak in other fields.', '') },

  { t: 'Routes and app', body: js(ma('s4mvc/product.routes', 4, 8), { sm: true }) + js(ma('s4mvc/app', 5, 10).replace("app.use((req, res, next) => { res.on('finish', () => console.log(req.method, req.originalUrl, res.statusCode)); next(); });", "app.use(logger); // logs: METHOD url status"), { sm: true }) +
    three(box('Router', 'Five routes, five controller functions. Nothing else.', 'lam'), box('Order in app.js', 'logger → JSON → router → 404 → error handler (Node.js 5.3).', 'xanh'), box('server.js', 'Connects to MongoDB first, then listens on a port.', '')) },

  { t: 'Status codes: the vocabulary of REST', to: true, giua: true, body: bang(['Code', 'Meaning', 'Use it for'], [
    ['200 / 201', 'OK / Created', 'GET, PUT succeeded · POST created something'], ['204', 'No Content', 'DELETE succeeded, nothing to send back'],
    ['400', 'Bad Request', 'validation failed, malformed id'], ['401 / 403', 'Unauthorized / Forbidden', 'not logged in · logged in but not allowed'],
    ['404', 'Not Found', 'the id does not exist'], ['409', 'Conflict', 'duplicate unique value (part 2)'], ['500', 'Server Error', 'an unexpected exception'],
  ], { co: 21 }) + box('Never 200 for everything', 'Status codes are part of the contract: the client branches on them.', 'do2') },

  { t: 'Run it: create and list', body: term(S(1, 10).replace('\n$ curl -X POST', '\n$ curl -X POST'), { title: 'curl · Express 5.3 + Mongoose 9.11 · real', sm: true }) + two(
    box('201 and 400', 'Two products created; “Mug” without a price refused with 400 before any database call.', 'xanh'),
    box('Populated list', 'category is <code class="i">{ name: \'book\' }</code>, not an id: the service populated it.', 'lam')) },

  { t: 'Run it: read, update, delete', body: two(term(S(13, 20, 60), { title: `curl · $ID = id of Lamp (${ID.slice(0, 8)}…) · real`, sm: true }),
    term(SV(21, 30), { title: 'server log · one line per database call · real', sm: true })) + three(
    box('200 · 200', 'Read Lamp; PUT changed price 30 → 35 and returned the new document.', 'xanh'), box('204', 'Deleted. No body at all.', 'lam'), box('404', 'Same id again: Product not found.', 'do2')) },

  { t: 'Exercise: predict the status', to: true, giua: true, body: `${box('Your task', 'Write the status code and the reason for each request, before looking: 1) POST <code class="i">{ "name": "Mug" }</code> · 2) DELETE an existing product · 3) GET it again · 4) PUT <code class="i">{ "price": 35 }</code> on an existing one.', '')}
<div data-k="dapan">${bang(['Request', 'Status', 'Why'], [['POST without price', '400', 'controller validation'], ['DELETE', '204', 'deleted, empty body'], ['GET deleted id', '404', 'service returned null'], ['PUT price 35', '200', 'updated document returned']], { co: 21 })}</div>
${box('Check against the real run', 'All four answers appear in the curl output of slides 12 and 13.', 'lam')}` },

  { t: 'Check yourself + summary (part 1)', to: true, giua: true, body: `<ol>
<li>Which layer may import Mongoose models?</li>
<li>Which status code does a successful POST return here?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Services (and the models themselves); never routes or controllers directly. &nbsp;2. 201 Created.', 'xanh')}</div>
${flow([{ t: 'Route', s: 'URL → controller', mau: LAM }, { t: 'Controller', s: 'req, validate, status', mau: CAM }, { t: 'Service', s: 'rules', mau: TIM }, { t: 'Model', s: 'MongoDB', mau: NODE }], { h: 120, fs: 21 })}
${box('Next video', 'Part 2: one error shape, CastError and duplicates, and pagination.', 'lam')}` },

  // ───── PHẦN B (sdn-4-1-2): slide 16–28 ─────
  { cover: true, t: 'REST API, part 2:<br>errors and pagination', sub: 'Turn every failure into a clear 4xx, and never send 10,000 rows at once.' },

  { t: 'No error handler: what the client sees', body: js(ma('s4/raw-errors', 8, 11), { sm: true }) + term(gay(W(rc('s4/raw-errors', 1, 8)), 106), { title: 'curl · Express 5.3 default error handler · real', sm: true }) + two(
    box('Three client mistakes, three 500s', 'A bad id, a duplicate sku, a missing name: all reported as <b>our</b> fault.', 'do2'),
    box('And an HTML page with a stack trace', 'File paths and internals leak to anyone (Node.js 5.3–5.4).', 'do2')) },

  { t: 'One error shape, one place', body: js(ma('s4mvc/error', 1, 13)) + two(
    box('{ error, details? }', 'The shape from the web lesson. The React client handles every failure with one piece of code.', 'xanh'),
    box('4 arguments', '<code class="i">(err, req, res, next)</code>: Express knows it is the error handler. It goes last in app.js.', 'lam')) },

  { t: 'Which error becomes which status', to: true, giua: true, body: bang(['Error', 'Comes from', 'Status', 'Body'], [
    ['CastError', 'id is not 24 hex characters', '400', 'Invalid _id: abc'],
    ['ValidationError', 'schema rules (create, or update with runValidators)', '400', 'Validation failed + details per field'],
    ['code 11000', 'unique index in MongoDB', '409', 'sku already exists'],
    ['anything else', 'a bug', '500', 'Internal server error (log it, do not show it)'],
  ], { co: 21 }) + box('400 vs 409', '400: the request itself is wrong. 409: the request is fine but conflicts with what already exists.', 'lam') },

  { t: 'Run it: the same mistakes, mapped', body: term(S(21, 32), { title: 'curl · with the error handler · real', sm: true }) + three(
    box('400', 'Invalid _id: abc', 'xanh'), box('409', 'sku already exists (OF-001 after uppercase)', 'xanh'), box('400 + details', 'sku required, price below 0, also on PUT', 'xanh')) +
    box('Server log', 'The duplicate reached MongoDB (insertOne, then 409); the invalid body and the PUT -1 never touched the database.', 'lam') },

  { t: 'Why not just check before creating?', to: true, giua: true, body: js(ma('s4/race-dup', 5, 10), { sm: true }) + term(ra('s4/race-dup', 2, 4), { title: 'node race-dup.js · two requests at the same moment · real' }) + two(
    box('Both checks passed', 'Request A and B looked at the same moment: no OF-001 yet. Only the unique index stopped the second insert.', 'do2'),
    box('So keep the index, and map 11000', 'A manual check is a nice message, never the guarantee. The index is the guarantee; 409 is how you report it.', 'xanh')) },

  { t: 'Pagination: never return everything', body: js(ma('s4mvc/product.controller', 14, 21), { sm: true }) + js(ma('s4mvc/product.service', 5, 12), { sm: true }) + three(
    box('page and limit', 'Defaults 1 and 10. limit capped at 50.', 'lam'), box('sort whitelist', 'Only price or name; anything else falls back to name.', 'xanh'), box('_id as tie-breaker', 'Equal prices keep a stable order between pages.', '')) },

  { t: 'Run it: pages', body: term(S(35, 40, 108), { title: 'curl · 7 products · real', sm: true }) + three(
    box('Page 1 of 3', 'limit 3 sorted by price: Pen 2, Note 1 4, Note 2 8.', 'xanh'), box('Page 3 of 3', 'Only Clean Code left. total 7, pages 3.', 'lam'), box('limit=1000', 'Capped to 50: one client cannot dump the whole collection.', 'do2')) },

  { t: 'Pagination: what skip costs', to: true, giua: true, body: term(ra('s4/skip-cost', 2, 5), { title: 'node skip-cost.js · 200,000 products · index { price, _id } · median of 5 · real' }) + two(
    box('skip() still walks', 'Page 10,000 reads 200,000 index keys to return 20 documents: 51.9 ms instead of 1.2 ms.', 'do2'),
    box('Cursor pagination', '“Give me 20 after this price and _id”: the index jumps straight there. API Design 3.1–3.2 measure both.', 'xanh')) +
    two(box('countDocuments', 'One extra query per page for total and pages. Promise.all runs both queries at the same time.', 'lam'), box('Stable sort', 'Always add a unique field (_id) after your sort field, or rows can repeat or vanish between pages.', '')) },

  { t: 'Express 4 vs 5: async errors', body: js(ma('s4/express4-crash', 5, 7), { sm: true }) + two(term(ra('s4/express4-crash', 1, 4).split(" -s -m 3 -w '[%{http_code}]'").join('').replace(/ localhost:4300/g, ' :4300').replace(/; echo " curl exit \$\?"/g, ''), { title: 'curl · Express 4.22.3 · real', sm: true }),
    term((ra('s4/express4-crash', 2, 3, 'server') + '\n' + ra('s4/express4-crash', 7, 7, 'server') + '\n' + ra('s4/express4-crash', 19, 20, 'server')).replace(/\/private\/tmp\/sdn-demo\//g, ''), { title: 'server · Node 22 · real (stack trimmed)', sm: true })) + two(
    box('Express 4 (what the generator installs)', 'Not caught: Node 22 <b>kills the whole server</b>; the next request finds nobody listening (curl exit 7). With an unhandledRejection listener it survives, but the request hangs (Node.js 5.4).', 'do2'),
    box('Express 5, or try/catch + next(err)', 'Express 5 sends rejected promises to the error handler. Our controllers use try/catch, so they are safe on both.', 'xanh')) },

  { t: 'Exercise: map the errors', to: true, giua: true, body: `<ol><li>GET /api/products/123</li><li>POST a product whose sku already exists</li><li>PUT <code class="i">{ "price": -1 }</code></li><li>GET /api/prodcuts (typo)</li></ol>
<div data-k="dapan">${bang(['Request', 'Status', 'Body'], [['GET /api/products/123', '400', 'Invalid _id: 123'], ['duplicate sku', '409', 'sku already exists'], ['PUT price -1', '400', 'Validation failed, details.price'], ['GET /api/prodcuts', '404', 'Route GET /api/prodcuts not found']], { co: 22 })}</div>` },

  { t: 'Check yourself (part 2)', to: true, giua: true, body: `<ol>
<li>Why do CastError and ValidationError map to 4xx, not 500?</li>
<li>Which error code means “duplicate key”, and which status do we send?</li>
<li>Why cap <code class="i">limit</code>?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. They are the client’s mistakes. &nbsp;2. 11000 → 409 Conflict. &nbsp;3. So one request cannot pull the whole collection.', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}` },

  { t: 'Summary (part 2)', to: true, giua: true, body: `<ul>
<li>One error handler, one shape: <code class="i">{ error, details? }</code></li>
<li>CastError → 400 · ValidationError → 400 + details · 11000 → 409 · rest → 500 without leaking</li>
<li>Paginate: page, capped limit, whitelisted sort + _id tie-breaker, total via countDocuments</li>
<li>try/catch + next(err) keeps the code safe on Express 4 and 5</li>
</ul>
${box('Next', 'Lesson 4.2: EJS and Handlebars, when the server renders HTML itself.', 'lam')}
${box('Go deeper', 'Node.js 6.2 (status codes), API Design 2.1 (error format) and 3.1–3.2 (pagination).', 'xanh')}` },
]);
