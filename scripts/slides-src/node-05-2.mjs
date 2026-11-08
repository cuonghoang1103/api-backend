/**
 * node-05-2 — Node.js · Chapter 5 · Lesson 5.2 "Routing: params, query and Router" (slide EN, kiểu FU, đợt 3 — 01/11/2026).
 * Nguồn: content/courses/nodejs/s05-express.mjs › nodejs-5-2-dinh-tuyen. Output THẬT Node 22.23.3 + Express 5.3.0, cổng 4100:
 * src/khung/node/that/c5/{params,order-bug,order-fix,paging,wildcard,wildcard-v4,optional-v4,merge-params,count-routers} + c5router/{app,notes.routes}.
 * Bổ sung so với bài web (chạy thật): NaN thành null khi JSON hoá (nên in chuỗi), "2" + 1 = "21", trang/giới hạn phòng thủ với đầu vào xấu, cú pháp Express 4
 * (`/files/*`, `/:id?`) làm sập lúc khởi động với PathError, mergeParams có/không, req.url vs req.originalUrl trong Router.
 * Khác bài web: website hiện có 150 tệp router (đếm thật 01/11/2026), web ghi "khoảng bốn mươi".
 */
import { lamDeck, two, box, kw, bang, cards, steps, flow, vsd, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-05-2', code: 'NODE 5.2', title: 'Routing: params, query and Router', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100");
const loiPath = (ten) => ra(ten).split('\n').filter((l) => /^PathError/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Express', bai: '5.2' }, [
  { cover: true, t: 'Routing: params,<br>query and Router', sub: 'A route is a pair, method and path, plus a function. Almost every surprise comes from three words: an ordered list.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The anatomy of a route, and the rule <b>first match wins</b></li>
<li>Path parameters, and why <code class="i">"42"</code> is never the number 42</li>
<li>The <b>order bug</b>, seen with your own eyes, and its fix</li>
<li>Query strings: three traps that reached production</li>
<li>Wildcards in Express 5, and <code class="i">express.Router()</code>: one file per resource</li>
</ul>
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('route', 'method + path + handler')} ${kw('params', 'values cut from the path')} ${kw('query string', 'the part after ?')}</div>
${box('Every output here is real', 'Express 5.3.0 on Node 22, a server on port 4100, called with curl.', 'xanh')}` },

  { t: 'Picture a reception desk', to: true, giua: true, body: cards([
    ['📋 An ordered rule list', 'The receptionist reads the rules from the top, one by one.'],
    ['✅ First rule that fits', 'The visitor goes there. Nobody reads the rules below it.'],
    ['😕 A rule that is too wide', '"Anyone with a name goes to room A" placed first: the VIP never reaches room B.'],
  ], 3) + box('Mapping', 'Visitor = request. Rule list = your routes, in file order. A too-wide rule = <code class="i">/notes/:id</code> placed before <code class="i">/notes/new</code>.', 'xanh') + box('Hold on to this', 'Every routing bug in this lesson is this picture.', 'lam') },

  { t: 'Anatomy of a route', giua: true, body: steps([
    '<b>A request arrives:</b> <code class="i">GET /notes/42?full=1</code>',
    '<b>Express walks the stack</b> in the order you declared, top to bottom',
    '<b>First match wins:</b> the first entry matching BOTH method AND path',
    '<b>The handler runs</b> with <code class="i">req.params</code> and <code class="i">req.query</code> filled in',
  ]) + js(`app.get('/notes/:id', handler)
//   │      │         └── handler: (req, res) => { ... }
//   │      └── path pattern: ':id' captures one segment
//   └── HTTP method: get post put patch delete all`) + box('Three words to remember', '<b>An ordered list.</b> Almost every routing surprise comes from them.', 'lam') },

  { t: 'Path parameters', giua: true, body: js(ma('c5/params', 4, 9), { sm: true }) + two(term(gay(ngan(ra('c5/params', 1, 6)), 52), { title: 'curl · real', hl: [2, 5, 8] }), cot(
    box('req.params.id', 'Always a <b>string</b>: "42", never the number 42. A URL has no types.', 'do2'),
    box('Number(\'abc\') = NaN', 'Pass NaN to a database query and you have a 500 waiting its turn.', 'do2'),
    box('Careful when printing', 'JSON.stringify turns NaN into null, so the demo sends it as a string.', 'lam')), 'r64') },

  { t: 'Check the id before you use it', to: true, giua: true, body: vsd(js(`const note = await db.find(
  Number(req.params.id));
// "abc" → NaN → the query fails
//              → 500`, { sm: false }), js(`const id = Number(req.params.id);
if (!Number.isInteger(id) || id < 1)
  return res.status(400)
    .json({ error: 'Bad id' });`, { sm: false })) + box('400 vs 500', 'Bad input is the client\'s mistake: 400. A 500 says the server is broken, and it wakes someone up at night.', 'xanh') + box('Chapter 6', 'A schema validator does this for every field, declared once.', 'lam') },

  { t: 'The order bug, seen with your own eyes', giua: true, body: js(ma('c5/order-bug', 4, 5), { sm: true }) + two(term(ngan(ra('c5/order-bug')), { title: 'curl · real', hl: [2] }), cot(
    box('The "new note" page vanished', '<code class="i">/notes/:id</code> is earlier in the list, and <code class="i">:id</code> happily matches the word <b>new</b>.', 'do2'),
    box('Express never looked further', 'First match wins. The second route is dead code, and nothing warns you.', ''),
    box('In a real app', 'The handler runs <code class="i">SELECT ... WHERE id = Number(\'new\')</code>: a 404 or a 500, and an hour lost in the database.', 'do2')), 'r64') },

  { t: 'The fix: specific before general', to: true, giua: true, body: js(ma('c5/order-fix', 4, 6), { sm: true }) + term(ngan(ra('c5/order-fix')), { title: 'curl · real', hl: [2, 4] }) +
    box('Why it gets worse as the file grows', 'No compile step and no "duplicate route" error. The more routes, the more likely a wide pattern hides a narrow one.', 'do2') +
    box('Habits', 'Inside one resource: most specific first, most general last. And one router file per resource, so the list stays short enough to read.', 'xanh') },

  { t: 'Query strings', giua: true, body: term(gay(ngan(ra('c5/params', 7, 10)), 92), { title: 'curl · real', hl: [2, 4] }) + cards([
    ['1 · Everything is a string', 'page is "2", and "2" + 1 is "21". Always convert, always with a default: Number(req.query.page ?? 1).'],
    ['2 · Repeated keys become arrays', 'tags=a&tags=b → ["a","b"], but tags=a alone → "a". Code written for one shape breaks on the other.'],
    ['3 · The client controls the object', 'Never pass req.query straight into a database where clause. Read only the fields you expect, by name.'],
  ], 3) + box('Attackers know trap 2', 'Repeat any query field and its type changes from string to array.', 'do2') },

  { t: 'A defensive list endpoint', to: true, giua: true, body: js(ma('c5/paging', 4, 8), { sm: true }) + term(ngan(ra('c5/paging')), { title: 'curl · real, including bad input', hl: [2, 4, 6, 8] }) +
    box('Read the last two', '<code class="i">page=abc&amp;limit=1000000</code> → page 1, limit 50. <code class="i">page=-5&amp;limit=0</code> → page 1, limit 10. Nobody can ask for a million rows.', 'xanh') },

  { t: 'Wildcards, the Express 5 way', to: true, giua: true, body: js(ma('c5/wildcard', 4, 4), { sm: true }) + two(term(ngan(ra('c5/wildcard')), { title: 'curl · real', hl: [2, 4] }), cot(
    box('*splat', 'A wildcard must have a <b>name</b> in Express 5. It matches one or more path segments.', 'lam'),
    box('An array', 'You get the segments: ["a", "b", "c.png"], not one string.', 'xanh'))) +
    box('Typical use', 'A file browser, or a catch-all under a prefix such as <code class="i">/docs/*splat</code>.', '') },

  { t: 'Express 4 syntax crashes at startup', giua: true, body: js(ma('c5/wildcard-v4', 4, 4) + '\n' + ma('c5/optional-v4', 4, 4), { sm: true }) + two(
    box('Express 4 wrote', "<code class=\"i\">'/files/*'</code> and put the match in <code class=\"i\">req.params[0]</code> as one string.", ''),
    box('Optional :id? is gone too', 'Declare two routes instead.', 'lam')) +
    term(gay(loiPath('c5/wildcard-v4') + '\n' + loiPath('c5/optional-v4'), 100), { title: 'node wildcard-v4.mjs / optional-v4.mjs · Express 5.3.0 · real (stack trimmed)', hl: [1, 3] }) +
    box('The number-one reason', 'a copied Express 4 snippet dies before the server even listens. Read the message: "Missing parameter name".', 'do2') },

  { t: 'express.Router(): one file per resource', giua: true, body: js(ma('c5router/notes.routes'), { sm: true }) + two(js(ma('c5router/app', 1, 6), { sm: true }), term(gay(ngan(ra('c5router/app')), 50), { title: 'curl · real: url vs originalUrl', hl: [2, 4, 6] })) },

  { t: 'What a Router gives you', to: true, giua: true, body: cards([
    ['Paths inside are relative', 'The router never repeats its prefix. Move the mount point once, the whole group moves.'],
    ['Scoped middleware', "app.use('/api/v1/admin', requireAdmin, adminRouter): the guard runs for that branch only."],
    ['Order becomes local', 'You reason about the route order of ONE resource, not all of them.'],
    ['mergeParams for nesting', "Router({ mergeParams: true }) lets a child router see the parent's :noteId."],
  ], 2) + box('Scoped middleware is the shape of every guard', 'Lesson 5.3 builds <code class="i">requireAdmin</code>; Chapter 8 swaps the header check for a real token check. One line in app.mjs protects a whole branch of the API.', 'lam') },

  { t: 'mergeParams: a child router sees the parent', giua: true, body: js(ma('c5/merge-params', 4, 11), { sm: true }) + two(term(ngan(ra('c5/merge-params')), { title: 'curl · real', hl: [2, 4] }), cot(
    box('Without it', 'The comments router sees an empty <code class="i">req.params</code>: <code class="i">:noteId</code> belongs to the parent path.', 'do2'),
    box('With mergeParams: true', 'The child router sees noteId "7". Needed for <code class="i">/notes/:noteId/comments</code>.', 'xanh'))) },

  { t: 'This website: count the routers', to: true, giua: true, body: two(term(gay(ra('c5/count-routers'), 40), { title: 'cuongthai.com backend, 01/11/2026', hl: [2] }), cot(
    box('150 router files', 'One per resource: notes, messages, courses, uploads... each mounted under its own /api/v1/... prefix.', 'lam'),
    box('One central file', 'Lists every mount. The fastest answer to "does this endpoint exist?".', 'xanh'))) +
    box('The deploy smoke-test uses it', 'An unauthenticated GET that returns 404 means the route was never mounted (a stale build). 401 or 200 means it is alive.', '') },

  { t: 'Exercise: predict the paging answers', to: true, giua: true, body: two(`<div style="font-size:28px">Same defensive endpoint. What comes back for:<ol><li><code class="i">/notes?page=abc&amp;limit=1000000</code></li><li><code class="i">/notes?page=-5&amp;limit=0</code></li></ol>Hint: <code class="i">Number('abc') || 1</code>, then clamp.</div>`,
    `<div data-k="dapan">${term(ngan(ra('c5/paging', 5, 8)), { title: 'real answers' })}${box('Why', '1. NaN is falsy → 1; a million is clamped to 50. &nbsp; 2. -5 → max(1, -5) = 1; 0 is falsy → the default 10.', 'xanh')}</div>`) +
    box('Takeaway', 'Never trust a query value. Convert, give a default, clamp.', 'lam') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why does <code class="i">GET /notes/new</code> reach <code class="i">/notes/:id</code>, and how do you fix it?</li>
<li>What is <code class="i">typeof req.query.page</code>, and what is <code class="i">page + 1</code> when page=2?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. First match wins and :id matches "new": declare /notes/new first. &nbsp; 2. "string", and "21".', 'xanh')}</div>
<ul>
<li>Routes are an ordered list: first match (method + path) wins</li>
<li>params and query are strings: convert, default, clamp, validate</li>
<li>Express 5: named wildcards; one Router per resource</li>
</ul>
${box('Next', 'Lesson 5.3: middleware, the chain every request walks.', 'lam')}` },
]);
