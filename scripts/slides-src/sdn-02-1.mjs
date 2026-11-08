/**
 * sdn-02-1 — SDN302 · Chapter 2 · Lesson 2.1 "Express routing & your first app" (slide EN, kiểu FU, đợt 5 — 01/11/2026). Tập sdn-2-1.
 * Nguồn: content/academy/SDN302.mjs › sdn302-2-1-express-routing.
 * Phủ: Express là gì (khung mỏng trên module HTTP: route handler + middleware) · app đầu tiên (express.json, GET list, GET :id, res.json đặt Content-Type) ·
 * so với server thuần · Router theo tài nguyên + app.use gắn đường dẫn · Express Generator (CLO3) · ★ resource router · bẫy quên express.json.
 * BỔ SUNG: chạy thật mọi đoạn (curl + header), req.params luôn là chuỗi (thật), 404 "Cannot DELETE" khi không có route, ghép đường dẫn mount,
 * Generator CHẠY THẬT: cây tệp, app.js sinh ra, bin/www + PORT, package.json (Express ~4.16.1, ejs ~2.6.1), npm install ⇒ 10 lỗ hổng (01/11/2026),
 * nâng lên Express 5.3.0 + ejs 7.0.2 ⇒ 0 lỗ hổng, app vẫn chạy · bài tập router orders.
 * Output THẬT Node 22.23.3 + npm 10.9.9 + Express 5.3.0 (generator: express-generator 4.16.1), cổng 4300: that/s2/{first-app,no-json,generator}, that/s2r/app.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot, rc, gay, ngan } from './_sdn-chung.mjs';

export const deck = { key: 'sdn-02-1', code: 'SDN 2.1', title: 'Express routing & your first app', sub: 'SDN302 — Node.js, Express & MongoDB' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const G = (a, b) => ra('s2/generator', a, b);
const W = (t) => t.replace(/ -w '  \[%\{http_code\}\]'/g, '').replace(/ -w '\\n\[%\{http_code\}\]'/g, '');

/** Cây thư mục do Generator sinh (SVG). */
function cay() {
  const w = 1110, h = 380;
  const dong = [
    [0, '📁 myapp/', ''], [1, '📄 app.js', 'the middleware stack + routers', NODE], [1, '📁 bin/', ''], [2, '📄 www', 'creates the HTTP server, reads PORT', CAM],
    [1, '📄 package.json', 'npm start = node ./bin/www', LAM], [1, '📁 routes/', ''], [2, '📄 index.js', 'GET /  → renders a page', NODE], [2, '📄 users.js', 'GET /users → text', NODE],
    [1, '📁 views/', ''], [2, '📄 index.ejs · error.ejs', 'templates (lesson 4.2)', TIM], [1, '📁 public/', ''], [2, '📁 stylesheets · javascripts · images', 'static files', '#666'],
  ];
  let s = `<svg data-k="cay" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  dong.forEach(([cap, t, g, mau], i) => {
    const y = 26 + i * 30, x = 10 + cap * 34;
    s += `<text data-k="tep" x="${x}" y="${y}" font-size="21" font-family="Menlo,monospace" fill="#222">${t}</text>`;
    if (g) s += `<text x="560" y="${y}" font-size="19" fill="${mau}" font-weight="700">${g}</text><line x1="${x + t.length * 12.6 + 10}" y1="${y - 7}" x2="548" y2="${y - 7}" stroke="#ccc" stroke-dasharray="4 4"/>`;
  });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Chapter 2 — Express', bai: '2.1' }, [
  { cover: true, t: 'Express routing<br>& your first app', sub: 'Route handlers, one router per resource, and Express Generator run for real.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What Express adds on top of Node’s <code class="i">http</code> module</li>
<li>Your first app: three routes, run with curl</li>
<li>Two traps: params are strings, and the missing <code class="i">express.json()</code></li>
<li>One router per resource, mounted with <code class="i">app.use</code></li>
<li><b>Express Generator</b> (CLO3): what it creates, and what to fix before you use it</li>
</ul>
${box('Deeper later', 'Node.js course, lessons 5.1–5.2: route anatomy, route order bugs, query strings, Express 5 changes.', 'lam')}
${box('Before this', 'Lesson 1.2 built a server with only the http module. Keep that picture: Express sits right on top of it.', 'xanh')}` },

  { t: 'Why Express?', to: true, giua: true, body: bang(['With only the http module (Lesson 1.2)', 'With Express'], [
    ['Parse the URL and compare strings by hand', '<code class="i">app.get(\'/api/products/:id\', handler)</code>'],
    ['Read the body chunk by chunk, then JSON.parse', '<code class="i">app.use(express.json())</code> fills <code class="i">req.body</code>'],
    ['Write status + Content-Type header yourself', '<code class="i">res.status(201).json(data)</code>'],
    ['One giant if / else for every path', 'Routers, one file per resource'],
  ], { co: 22 }) + two(box('Route handler', 'A function that answers one method + one path.', 'xanh'), box('Middleware', 'A function every request passes through, in order (Lesson 2.2).', 'lam')) +
    `<div style="display:flex;gap:12px">${kw('framework', 'a ready-made skeleton you fill in')} ${kw('Express 5.3.0', 'installed for this lesson')}</div>` },

  { t: 'Your first Express app', body: js(ma('s2/first-app', 1, 18), { sm: true }) + box('Run it', '<code class="i">npm install express</code>, then <code class="i">node app.js</code>. The web lesson uses port 3000; this machine uses 4300 because 3000 is busy.', 'lam') },

  { t: 'Run it for real', body: term(W(rc('s2/first-app', 1, 11)), { title: 'curl · Express 5.3.0 · real · [code] = HTTP status', hl: [1, 2, 4, 6, 9] }) + `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
${box('res.json()', 'Sets <b>Content-Type: application/json</b> and serialises for you.', 'xanh')}
${box('201 on POST', 'You choose the status: <code class="i">res.status(201)</code>.', 'lam')}
${box('No route?', 'Express answers <b>404</b> “Cannot DELETE …” on its own.', 'do2')}</div>` },

  { t: 'Anatomy of a route', to: true, giua: true, body: flow([
    { t: 'app.get', s: 'the HTTP method', mau: LAM },
    { t: "'/api/products/:id'", s: 'the path, :id is a param', mau: NODE },
    { t: '(req, res) => {…}', s: 'the handler', mau: CAM },
    { t: 'res.json(…)', s: 'the answer', mau: DO },
  ], { h: 160, fs: 21 }) + two(
    box('req.params', 'Values cut out of the path: <code class="i">/api/products/42</code> ⇒ <code class="i">{ id: "42" }</code>.', 'xanh'),
    box('One answer only', 'A handler sends exactly one response: <code class="i">res.json</code>, <code class="i">res.send</code> or <code class="i">res.status(…).end()</code>.', 'lam')) +
    bang(['Method', 'Usual meaning on a resource'], [['GET', 'read (a list or one item)'], ['POST', 'create a new item'], ['PUT', 'update an item'], ['DELETE', 'remove an item']], { co: 21 }) },

  { t: 'Trap 1: params are always strings', to: true, giua: true, body: term(W(rc('s2/first-app', 5, 6)), { title: 'curl · real' }) + vsd(
    js(`products.find((p) => p.id === req.params.id)\n// 1 === "42"? never true`), js(`products.find((p) => p.id === Number(req.params.id))`)) +
    box('Why', 'Everything in a URL is text. Convert before you compare. With MongoDB the id stays a string and Mongoose converts it (lesson 3.2).', '') +
    box('Query strings too', '<code class="i">?page=2</code> gives <code class="i">req.query.page</code> = <code class="i">"2"</code>, a string as well (Node.js 5.2).', 'lam') },

  { t: 'Trap 2: forgot express.json()', body: js(`// forgot: app.use(express.json());\napp.post('/api/products', (req, res) => {\n  res.status(201).json({ received: req.body });\n});`) + term(W(rc('s2/no-json', 1, 2)), { title: 'curl · real' }) + two(
    box('What happened', '<code class="i">req.body</code> is <b>undefined</b>, and JSON drops undefined: the client gets <code class="i">{}</code> with 201. No error anywhere.', 'do2'),
    box('Fix', 'Add <code class="i">app.use(express.json())</code> <b>before</b> the routes.', 'xanh')) + box('The classic question', '“Why is my body empty?” Nine times out of ten: this line, or a route placed above it (Node.js 5.3).', 'lam') },

  { t: 'One router per resource', body: js(ma('s2r/products.routes', 1, 18), { sm: true }) + two(
    box('express.Router()', 'A mini-app with its own routes. It knows nothing about where it will be mounted.', 'xanh'),
    box('Inside the router', 'Paths are relative: write <code class="i">\'/\'</code> and <code class="i">\'/:id\'</code>, not <code class="i">\'/api/products\'</code>.', 'lam')) },

  { t: 'Mount it, then run it', body: js(ma('s2r/app', 2, 7), { sm: true }) + term(W(rc('s2r/app', 1, 10)), { title: 'curl · two routers mounted · real', sm: true }) + two(
    box('Paths add up', '<code class="i">\'/api/products\'</code> + <code class="i">\'/:id\'</code> ⇒ <b>GET /api/products/:id</b>.', 'xanh'),
    box('★ Resource routers scale', 'products.js, users.js, orders.js: you always know which file owns a URL.', 'lam')) },

  { t: 'Express Generator (CLO3)', body: two(term(G(2, 19), { title: 'npx express-generator · real', sm: true }),
    cot(box('One command', 'Creates a full Express skeleton: folders, a server file, two routers, views and a stylesheet.', 'xanh'),
      box('--view=ejs', 'Picks EJS for the templates. Without it you get the old Jade engine.', 'lam'),
      box('Version', 'express-generator 4.16.1 is the latest release. It generates an Express 4 app.', ''))) },

  { t: 'What each file does', to: true, giua: true, body: cay() + box('Start command', '<code class="i">npm start</code> runs <code class="i">node ./bin/www</code>, which reads <code class="i">PORT</code> from the environment, default 3000.', 'lam') },

  { t: 'Inside the generated app.js', body: two(js(G(56, 78), { sm: true }), cot(box('Order of middleware', 'logger → JSON body → form body → cookies → static files → routers → 404 → error handler.', 'xanh'),
    term(G(108, 113), { title: 'grep bin/www · real', sm: true }),
    box('var and require', 'Older style (CommonJS + var). It still runs today; the Node.js course explains modules in 1.5.', 'lam'))) },

  { t: 'Run it, and read the warnings', body: two(cot(term(G(39, 54), { title: 'package.json · real', sm: true })),
    cot(term(W(ngan(G(114, 129))).replace("(in another terminal)", '').replace(' 2>&1 | grep -E "added|vulnerabilit"', '').replace('/private/tmp/sdn-demo/myapp', '/tmp/…/myapp').replace(', and audited 55 packages in 1s', ''), { title: 'npm install + curl · 01/11/2026 · real', sm: true }),
      box('10 vulnerabilities', 'The template pins Express ~4.16 and ejs ~2.6 from 2018–2019. It runs, but npm flags known holes.', 'do2'))) },

  { t: 'Update before you build on it', to: true, giua: true, body: term(W(ngan(G(130, 138))).replace(/ 2>&1 \| grep -E.*$/m, '').replace('/private/tmp/sdn-demo/myapp', '/tmp/…/myapp'), { title: 'upgrade to Express 5 · real' }) + two(
    box('Result', '0 vulnerabilities, Express 5.3.0, ejs 7.0.2, and the same route still answers.', 'xanh'),
    box('Use the generator for structure', 'Keep the folders and app.js order, update the packages, then add your own routes/products.js.', 'lam')) },

  { t: 'Exercise: an orders router', body: box('Your task', 'Create <code class="i">routes/orders.js</code> with <b>GET /</b> (list) and <b>GET /:id</b> (one, or 404). Mount it at <code class="i">/api/orders</code>. Which full URL does <code class="i">router.get(\'/:id\')</code> answer?', '') +
`<div data-k="dapan">${js(ma('s2r/orders.routes', 1, 12), { sm: true })}${two(term(W(rc('s2r/orders-app', 3, 6)), { title: 'curl · real', sm: true }), box('', '<code class="i">app.use(\'/api/orders\', require(\'./routes/orders\'))</code> ⇒ <b>GET /api/orders/:id</b>.', 'xanh'))}</div>` },

  { t: 'Check yourself', to: true, giua: true, body: `<ol>
<li>GET /api/products/7: what is <code class="i">typeof req.params.id</code>?</li>
<li>POST with JSON, but the server sees <code class="i">{}</code>. First line you check?</li>
<li>Which file starts the server in a generated app?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. "string". &nbsp;2. <code class="i">app.use(express.json())</code>, above the routes. &nbsp;3. <code class="i">bin/www</code> (via npm start).', 'xanh')}</div>
${box('Pause first', 'Answer out loud, then reveal.', '')}
${box('Hint for 3', 'Look at the "start" script in package.json.', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>A route = method + path + handler; <code class="i">res.json</code> sets the header for you</li>
<li>Params are strings; <code class="i">express.json()</code> goes before the routes</li>
<li>One router per resource, mounted with <code class="i">app.use(prefix, router)</code></li>
<li>Express Generator gives the structure; update its packages first</li>
</ul>
${flow([{ t: 'app.use(prefix, router)', s: 'mount', mau: LAM }, { t: 'router.get(path)', s: 'relative path', mau: NODE }, { t: 'handler', s: 'res.json', mau: CAM }], { h: 120, fs: 21 })}
${box('Next', 'Lesson 2.2 (video: Node.js 5.3): middleware, the chain every request walks. Then Chapter 3: MongoDB.', 'lam')}` },
]);
