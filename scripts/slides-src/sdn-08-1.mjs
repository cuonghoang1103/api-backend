/**
 * sdn-08-1 — SDN302 · Chương 8 · Bài 8.1 "NestJS, Hono & the aggregation pipeline" (slide EN, đợt 12b — 08/11/2026).
 * MỘT deck, HAI tập: sdn-8-1 (slide 1–15: NestJS + Hono, cùng một API ở 3 framework, chạy thật) · sdn-8-1-2 (slide 16–28: aggregation pipeline).
 *   A: vì sao cần khung (bếp trống / bếp nhà hàng / xe đồ ăn) · đặc tả một API · Express · Nest: module → controller → provider · DI (thật: "ProductService created"
 *      MỘT lần) · chạy thật (log Nest map 3 route; 404/400/201; /products/abc 400 do ParseIntPipe) · bẫy quên provider (thật: Nest can't resolve dependencies…
 *      exit 1) · bẫy chạy bằng tsx (thật: khởi động xanh, request ⇒ 500 Cannot read properties of undefined (reading 'findAll')) · Hono · đo thật (gói, MB,
 *      khởi động, req/s) · chọn cái nào.
 *   B: băng chuyền $match → $group → $sort → $limit · dữ liệu 200.000 đơn · top 5 thật · số document qua từng chặng · kéo về Node vs aggregate (thật) · $lookup
 *      (thật: MongoDB dời $limit lên trước $lookup) · $lookup trên mọi đơn 4.706 vs 50 ms · chỉ mục + thứ tự chặng (thật: COLLSCAN/IXSCAN, MongoDB dời $match _id)
 *      · ba bẫy im lặng (chuỗi ⇒ $sum 0, $match sau $group ⇒ 0, aggregate KHÔNG ép kiểu ⇒ []) · route Express thật · bài tập · tự kiểm · tóm tắt.
 * Nguồn: SDN302 › sdn302-8-1-nestjs-hono. Output THẬT: that/s8/* (Node 22.23.3 · NestJS 12.4.0 · TypeScript 7.0.2 · Hono 4.13.17 + @hono/node-server 2.1.6 ·
 *   Express 5.3.0 · Mongoose 9.11.4 · MongoDB 7.0.37 trong Docker · autocannon 9.0.0).
 */
import { lamDeck, two, box, cards, flow, bang, js, term, ma, ra, kw, cot } from './_sdn-chung.mjs';
import { tep, gay, P, JW } from './_c7-chung.mjs';

export const deck = { key: 'sdn-08-1', code: 'SDN302 8.1', title: 'NestJS, Hono & the aggregation pipeline', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed', NEST = '#e0234e';
const J = (src, o = {}) => js(src, { sm: o.sm ?? true, hl: o.hl });
const T = (text, title, o = {}) => term(text, { title, sm: o.sm ?? true, hl: o.hl });
/** Log Nest: bỏ "PID - ngày giờ" ở đầu dòng (chỉ bớt chữ, không đổi nội dung log). */
const nest = (t) => t.replace(/\[Nest\] \d+ {2}- [\d/]+, [\d:]+ [AP]M +/g, '[Nest] ');
const curl = (ten, a, b) => ra(ten, a, b).replace(/curl -s (-w '  \[%\{http_code\}\]' )?/g, 'curl ').replace(/ -H 'content-type: application\/json'/g, '').replace(/localhost:/g, ':');
const s8 = (f, a, b) => tep(`s8/${f}`, a, b);

export const slides = lamDeck({ chuong: 'Chapter 8 — Beyond Express', bai: '8.1' }, [
  { cover: true, t: 'NestJS, Hono<br>& the aggregation pipeline', sub: 'One API written three ways and measured — then let MongoDB do the counting.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Why teams put a framework on top of Express — and what it costs</li>
<li>NestJS: module, controller, provider, and dependency injection, run for real</li>
<li>The two Nest mistakes that bite every beginner, with the real error</li>
<li>Hono: a tiny framework that runs on Node and at the edge</li>
<li>Express vs NestJS vs Hono measured: install size, start-up, requests per second</li>
<li>Part 2: the MongoDB aggregation pipeline — $match, $group, $sort, $lookup</li>
</ul>` + two(box('In the syllabus', 'CLO2: "Understand Express, NestJS and Hono". Sessions 49–54 are NestJS, 55–56 are Hono.', 'lam'),
    box('Beyond the syllabus', 'The aggregation pipeline (part 2) — what you will use for every report and dashboard.', 'cam')) },

  { t: 'Why another framework? An everyday picture', to: true, giua: true, body: cards([
    ['🍳 Express = an empty kitchen', 'Stove, sink, knives. You decide where everything goes. Perfect for one cook — chaos for twenty.'],
    ['🏨 NestJS = a restaurant kitchen', 'Fixed stations (modules), a head chef who hands every cook the tools they need (dependency injection). Twenty cooks, one way of working.'],
    ['🚚 Hono = a food truck', 'Small, fast, starts in a second, and parks anywhere: Node, Bun, Deno, Cloudflare Workers.'],
  ], 3) + bang(['', 'Express', 'NestJS', 'Hono'], [['language', 'JavaScript', 'TypeScript + decorators', 'JS or TS'], ['structure', 'you invent it', 'enforced: module → controller → service', 'you invent it'], ['runs on', 'Node', 'Node (on Express by default)', 'Node, Bun, Deno, edge']], { co: 21 }) },

  { t: 'One API, three frameworks', to: true, giua: true, body: bang(['request', 'answer'], [
    ['GET /products', '200 · the list'], ['GET /products/9', '404 · product not found'], ['POST /products  { "price": 3 }', '400 · name required'], ['POST /products  { "name": "Lamp", "price": 12 }', '201 · the new product'],
  ], { co: 24, hl: [1, 2] }) + two(box('A fair test', 'The same two products in memory, the same four answers. No database — so the only thing that differs is the framework.', 'lam'),
    box('Run for real', 'Each app runs on its own port (Express 4640, NestJS 4641, Hono 4642) and is called with curl. Every output on the next slides is copied from the terminal.', 'xanh')) },

  { t: 'Express: what you already know', to: true, giua: true, body: J(ma('s8/express-app', 1, 20).split('\n').filter(Boolean).join('\n'), { hl: [8, 12, 15] }) +
    T(curl('s8/express-app', 3, 4) + '\n' + curl('s8/express-app', 7, 8), 'curl against node app.js · real (the 400 case: same as slide 4)', { hl: [2, 4] }) },

  { t: 'NestJS: three kinds of pieces', to: true, giua: true, body: flow([
    { t: '@Module', s: 'the station: lists its parts', mau: NEST }, { t: '@Controller', s: 'routes: URL → method', mau: LAM }, { t: '@Injectable provider', s: 'the work: ProductService', mau: NODE },
  ]) + bang(['file', 'piece', 'its one job'], [
    ['products.module.ts', '@Module', 'say which controllers and providers belong together'],
    ['products.controller.ts', '@Controller(\'products\')', 'receive the request, call the service, return the answer'],
    ['products.service.ts', '@Injectable()', 'the business logic and the data — no req, no res'],
    ['main.ts', 'NestFactory.create', 'build the app from the module and listen'],
  ], { co: 21 }) + box('You have seen this before', 'It is the routes → controllers → services layering of lesson 4.1 — except Nest makes it the only way to write the app.', 'lam') },

  { t: 'The service and the module', to: true, giua: true, body: P(s8('nest/products.service.ts.txt', 3), { hl: [1] }) + P(s8('nest/products.module.ts.txt', 5, 8), { hl: [3] }) +
    `<div style="display:flex;flex-wrap:wrap;gap:10px">${kw('@Injectable()', 'Nest may create it and hand it to others')}${kw('no req, no res', 'plain logic, easy to test')}${kw('providers: [ProductService]', 'what Nest must create — forget it: slide 11')}</div>` },

  { t: 'The controller: decorators instead of app.get', to: true, giua: true, body: P(s8('nest/products.controller.ts.txt', 4), { hl: [1, 5, 7, 13] }) +
    `<div style="display:flex;flex-wrap:wrap;gap:10px">${kw('@Get(\':id\')', '= app.get(\'/products/:id\')')}${kw('ParseIntPipe', '"1" → 1, or 400')}${kw('NotFoundException', 'Nest sends the 404')}</div>` },

  { t: 'Dependency injection: who creates the service?', to: true, giua: true, body: flow([
    { t: 'Nest reads the module', s: 'providers: [ProductService]', mau: NEST }, { t: 'creates it ONCE', s: 'new ProductService()', mau: NODE }, { t: 'reads the constructor', s: 'needs a ProductService', mau: LAM }, { t: 'hands it in', s: 'new ProductController(service)', mau: CAM },
  ]) + J("constructor(private service: ProductService) {}   // the controller ASKS — it never calls new", { sm: false }) +
    two(box('Why bother', 'The controller does not know how the service is built. In a test you hand it a fake service; in production the real one. One line changes, not twenty files.', 'xanh'),
      box('One instance', '"ProductService created" is printed ONCE at start-up (next slide), not once per request: every controller that asks gets the same object.', 'lam')) },

  { t: 'Run it: Nest maps the routes for you', to: true, giua: true, body: T(nest(ra('s8/nest-app', 2, 9, 'server')), 'npx tsc -p . && node run.js · real (PID and time trimmed)', { hl: [2, 5, 6, 7] }) +
    T(curl('s8/nest-app', 3, 10), 'curl :4641 · real', { hl: [2, 8] }) +
    box('Same answers, Nest\'s own error shape', '{ message, error, statusCode }. And "abc" never reaches your code: ParseIntPipe answers 400.', 'lam') },

  { t: 'Mistake 1: the provider you forgot', to: true, giua: true, body: P(s8('nest/products.module.forgot.ts.txt', 5, 9), { sm: false, hl: [3] }) +
    T(gay(nest(ra('s8/nest-forget', 2, 3)), 104) + '\n' + ra('s8/nest-forget', 5, 7) + '\n…\n' + ra('s8/nest-forget', 30, 30), 'npx tsc -p . && node run.js · real', { hl: [2, 3, 4] }) +
    box('A good failure', 'Nest checks every constructor at START-UP and refuses to run — Express would crash on the first request instead. The message names the missing piece: ProductService at index [0].', 'xanh') },

  { t: 'Mistake 2: running Nest with tsx', to: true, giua: true, body: T(nest(ra('s8/nest-tsx', 2, 3, 'server')) + '\n…\n' + nest(ra('s8/nest-tsx', 9, 12, 'server')).replace('/private/tmp/sdn8-demo/', ''), 'npx tsx main.ts · real', { hl: [2, 6] }) +
    T(curl('s8/nest-tsx', 1, 2), 'curl :4641/products · real', { hl: [2] }) +
    two(box('Why it starts, then fails', 'Nest learns the constructor types from metadata that the TypeScript compiler writes (emitDecoratorMetadata). tsx uses esbuild, which does not write it — so the service is created but never handed in.', 'do2'),
      box('The fix', 'Compile with tsc (that is what nest build and nest start do), or say it explicitly: @Inject(ProductService).', 'xanh')) },

  { t: 'Hono: the same API, a few lines', to: true, giua: true, body: J((ma('s8/hono-app', 1, 3) + '\n' + ma('s8/hono-app', 7, 21)).split('\n').filter(Boolean).join('\n'), { hl: [7, 12, 15, 17] }) +
    box('c = the context · app.fetch runs anywhere', 'c.req is the request, c.json(data, status) the response. app.fetch is a web-standard function: Node via @hono/node-server, or Workers, Bun, Deno.', 'xanh') },

  { t: 'Measured: what each one costs', to: true, giua: true, body: T(ra('s8/compare', 2, 15), 'node compare.mjs · real (laptop busy, load ≈ 25: compare the ratios)', { hl: [3, 8, 14] }) +
    two(box('An empty route', 'No database here. A real route waits on the database — 97.2 % of the handler time in Node.js lesson 16.2. Then req/s hardly matters.', 'cam'),
      box('What does matter', 'NestJS: 95 packages, 21.1 MB, 257 ms to start — fine on a server, heavy for serverless. Hono: 2 packages.', 'lam')) },

  { t: 'Which one, when', to: true, giua: true, body: bang(['choose', 'when', 'watch out'], [
    ['Express', 'the exam, small APIs, learning how HTTP works', 'structure is your job — or it never happens'],
    ['NestJS', 'a big team, many modules, rules everyone must follow', 'TypeScript build, decorators, slower start'],
    ['Hono', 'edge / serverless, tiny services, very fast start', 'young ecosystem, fewer ready-made plugins'],
  ], { co: 23, hl: [] }) + box('Match the tool to the size of the job', 'A 3-resource API does not need NestJS. Twenty developers on one codebase usually do. Understanding the trade-off is the skill — not memorising one framework.', 'xanh') +
    box('Part 2', 'Whatever the framework, the slow part is the data. Next: let MongoDB do the counting.', 'lam') },

  // ───────── phần B (tập sdn-8-1-2) ─────────
  { t: 'Aggregation: a conveyor belt for documents', to: true, giua: true, body: '<div style="width:100%">' + flow([
    { t: '$match', s: 'keep only paid orders', mau: LAM }, { t: '$group', s: 'one box per user: add up', mau: NODE }, { t: '$sort', s: 'biggest first', mau: CAM }, { t: '$limit', s: 'keep 5', mau: TIM },
  ], { h: 118 }) + '</div>' + two(box('The question', '"Our five best customers, by money actually paid?"', 'lam'),
    box('The idea', 'Each stage changes the documents and passes them on — inside MongoDB. Node gets only the answer.', 'xanh')) +
    bang(['stage', 'like SQL'], [['$match', 'WHERE'], ['$group + $sum', 'GROUP BY + SUM()'], ['$sort / $limit', 'ORDER BY / LIMIT'], ['$lookup', 'JOIN']], { co: 20 }) },

  { t: 'The data: 200,000 orders', to: true, giua: true, body: J(ma('s8/agg-models', 3, 9), { sm: false, hl: [3, 4] }) +
    T(gay(ra('s8/agg-seed', 1, 4), 100), 'node seed.js · real', { hl: [2, 3] }) +
    box('Same data every run', 'Seeded random numbers: 5,000 users, 200,000 orders, 60 % paid. Some users buy far more than others — like a real shop.', 'lam') },

  { t: 'The pipeline from the lesson — run for real', to: true, giua: true, body: J(ma('s8/agg-top', 6, 11), { sm: false, hl: [2, 3, 4] }) +
    T(ra('s8/agg-top', 5, 10), 'node app.js · real', { hl: [1] }) +
    two(box('"$amount": the dollar sign', '"$amount" means "the value of the field amount". Without the $, $sum adds the TEXT "amount" — a mistake you will make once.', 'cam'),
      box('What comes back', '_id is now the user, total the money, orders the count. The result is a NEW shape — not an Order document.', 'lam')) },

  { t: 'Stage by stage: how many documents move on', to: true, giua: true, body: T(ra('s8/agg-top', 2, 5), 'node app.js · counted with $count after each stage · real') +
    bang(['stage', 'documents out', 'what happened'], [['(input)', '200,000', 'every order'], ['$match', '121,908', 'only paid ones'], ['$group', '2,879', 'one per user who paid'], ['$sort', '2,879', 'same documents, new order'], ['$limit', '5', 'the answer']], { co: 21, hl: [1, 2] }) +
    box('Filter early', '$match first: every later stage handles 121,908 documents, not 200,000. Shrink the belt early.', 'xanh') },

  { t: 'Pull it into Node, or let MongoDB count?', to: true, giua: true, body: J(ma('s8/agg-vs-node', 5, 8), { hl: [2] }) +
    T(ra('s8/agg-vs-node', 2, 4), 'node app.js · median of 5 · real', { hl: [1, 2] }) +
    two(box('4.1× slower, and 10.7 MB through the network', 'find + loop sends all 121,908 paid orders to Node, which turns each into a JS object and adds them up.', 'do2'),
      box('Same answer', '"same top 5: true". aggregate sends 5 small documents. On a busier server and a real network the gap only grows.', 'xanh')) },

  { t: '$lookup: a join inside the pipeline', to: true, giua: true, body: J(ma('s8/agg-lookup', 5, 5) + '\n' + ma('s8/agg-lookup', 8, 15), { hl: [7] }) +
    T(ra('s8/agg-lookup', 2, 3) + '\n    …\n' + ra('s8/agg-lookup', 8, 8), 'node app.js · real (rows 2–5 cut: the same five as slide 18)', { hl: [4] }) +
    two(box('localField → foreignField', 'Users whose _id equals this _id go into the array user; $first takes one.', 'lam'),
      box('MongoDB helped: $sort 5', '$limit was folded into $sort: 5 lookups, not 2,879. Ask explain().', 'xanh')) },

  { t: 'A $lookup on every order', to: true, giua: true, body: T(gay(ra('s8/agg-lookup', 10, 12), 104), 'node app.js · real', { hl: [2, 3] }) +
    J("// slow: join 200,000 orders to users, THEN keep one name\n[{ $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },\n { $match: { 'user.name': 'User 14' } }]\n\n// fast: find the user once, then match by userId\nconst u = await User.findOne({ name: 'User 14' });\nawait Order.aggregate([{ $match: { userId: u._id } }, …]);", { sm: false, hl: [2, 6, 7] }) +
    box('4,683 ms vs 41 ms — the same 343 orders (all statuses)', 'A join is a lookup per document. Shrink the belt first, join last.', 'do2') },

  { t: 'Where the $match sits decides if an index helps', to: true, giua: true, body: T(ra('s8/agg-explain', 2, 7), 'node app.js · explain() + median of 5 · real', { hl: [2, 4, 6] }) +
    two(box('First stage = a normal query', 'A $match at the start is a find(): it can use an index (IXSCAN, 1.3 ms instead of 42.9 ms).', 'xanh'),
      box('MongoDB moves some — not all', 'It moved $match { _id } before $group by itself. A filter on total, which $group computes, cannot move: it scans everything.', 'cam')) +
    J("await Order.aggregate(pipeline).explain('executionStats');   // read the plan: IXSCAN or COLLSCAN?", { sm: false }) },

  { t: 'Three traps that return a wrong answer silently', to: true, giua: true, body: T(gay(ra('s8/agg-traps', 2, 13), 104), 'node app.js · real', { hl: [2, 6, 11] }) +
    cards([['Numbers saved as text', '$sum skips strings: 0, no error. Convert with $toInt, or fix the import.'], ['$match after $group', '$group keeps only _id and what you compute — status is gone: 0 documents.'], ['aggregate() does not cast', 'find() turns the id string into an ObjectId. aggregate() does not: wrap it in new mongoose.Types.ObjectId(id).']], 3) },

  { t: 'In an Express route', to: true, giua: true, body: JW(ma('s8/agg-route', 6, 19), 100, [3, 5, 9]) +
    T(gay(curl('s8/agg-route', 1, 4), 104), 'curl · real — Math.min(…, 50): the client never asks for "everything"', { hl: [2] }) },

  { t: 'Exercise', to: true, giua: true, body: J("// GET /users/:id/total — total PAID amount of one user\nconst r = await Order.aggregate([\n  { $group: { _id: '$userId', total: { $sum: 'amount' } } },\n  { $match: { status: 'paid', _id: req.params.id } },\n]);\nres.json(r[0]);", { sm: false, hl: [3, 4] }) +
    box('Exercise', 'It always answers nothing. Find the three mistakes and rewrite the pipeline. Then say: Express, NestJS or Hono for a two-person exam project — and why?', '') +
    `<div data-k="dapan">${box('Answer', '1. \'amount\' needs a $: \'$amount\'. 2. $match after $group: status no longer exists — match first. 3. req.params.id is a string; aggregate does not cast: new mongoose.Types.ObjectId(id). Fixed: [{ $match: { userId: new ObjectId(id), status: \'paid\' } }, { $group: { _id: \'$userId\', total: { $sum: \'$amount\' } } }]. Framework: Express — small, the exam\'s own tool, nothing to build.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>In NestJS, which piece holds the business logic, and which decorator marks it?</li>
<li>Your Nest app prints "can't resolve dependencies of the ProductController (?)". What did you forget?</li>
<li>Why can Hono run on Cloudflare Workers but an Express app cannot as-is?</li>
<li>Why is aggregate() faster than find() + a loop in Node?</li>
<li>A $match placed after $group returns 0 documents. Why?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The provider (service), @Injectable(). &nbsp;2. ProductService in the module\'s providers. &nbsp;3. A Hono app is a web-standard fetch function; Express needs Node\'s http module. &nbsp;4. The work stays in MongoDB and only the answer travels (5 documents, not 121,908). &nbsp;5. $group outputs only _id and the computed fields — the original fields are gone.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>NestJS = Express + enforced structure: module → controller → provider, joined by dependency injection</li>
<li>Nest checks providers at start-up; compile with tsc, not esbuild/tsx, or use @Inject</li>
<li>Hono = tiny and fast, runs on Node, Bun, Deno and the edge; choose by team and job size, not by req/s</li>
<li>Aggregation: $match early → $group with "$field" → $sort → $limit → $lookup last; cast ids yourself</li>
</ul>` + box('Going deeper', 'Node.js course 18.1–18.2 (layers, structure), 16.2 (where the time really goes); PostgreSQL 6 (GROUP BY) and 17.3 (MongoDB vs JSONB); SDN302 3.1–3.2 (indexes, populate).', 'lam') },
]);
