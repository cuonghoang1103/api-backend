/**
 * node-09-3 — Node.js · Chapter 9 · Lesson 9.3 "Input is the enemy: ReDoS, prototype pollution, body limits, SSRF" (slide EN, đợt 8 — 01/11/2026).
 * MỘT deck, HAI tập: node-9-3 (slide 1–13) · node-9-3-2 (slide 14–28).
 *   A: ReDoS (thật: 31 ký tự 7 122 ms; server riêng tiến trình: /health chậm nhất 7 047 ms) · regex "cắt khoảng trắng" (28 dấu cách 3 631 ms) · nhận diện + phòng ·
 *      ô nhiễm nguyên mẫu (thật: user.isAdmin = true) · ba lớp phòng · bộ phân tích query của Express 5 (thật: không ô nhiễm)
 *   B: giới hạn thân request (thật: 90KB 200 / 200KB 413; 11,0 MB ⇒ RSS 57 → 134 → 148 MB) · giới hạn theo route · website này (10mb chung + parser riêng
 *      đứng TRƯỚC cho AI chat/agent — đọc src/index.ts) · SSRF (thật: đọc bí mật nội bộ; allow-list chặn; 302 lọt; kiểm từng chặng chặn; new URL() chuẩn hoá
 *      127.1/2130706433/0x7f…) · dẫn API Design 6.3 safeFetch · proxy GIPHY "đừng nhận URL" · ba thứ trông như phòng thủ · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-9-3-dau-vao-doc-hai. Output THẬT: that/c9/{redos,redos-server,proto,query-parser,body-limit,ssrf}.
 * Khác web: ReDoS 31 ký tự 7 122 ms (web 9 479 ms) · RSS +77…+91 MB cho 11,0 MB (web +139 MB cho 11,3 MB) · cú 302 đi qua chính route ĐÃ kiểm
 *   (web chạy trên route chưa kiểm) · lần chạy regex ĐẦU TIÊN chậm hơn ~5× (36,9 s) vì V8 thông dịch trước rồi mới biên dịch — server thật đã "ấm".
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-09-3', code: 'NODE 9.3', title: 'Input is the enemy: ReDoS, prototype pollution, body limits, SSRF', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';
const msOf = (re) => Number(dong('c9/redos', re).match(/([\d.]+) ms/)[1]);

export const slides = lamDeck({ chuong: 'Chapter 9 — Application security', bai: '9.3' }, [
  { cover: true, t: 'Input is the enemy:<br>ReDoS, prototype pollution, body limits, SSRF', sub: 'Four attacks. No password, no stolen token, no XSS. Just a request that looks normal.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>31 characters that freeze a real Express server for seven seconds</li>
<li>One JSON key that makes every object in the process an admin</li>
<li>What raising the body limit really costs, measured in RSS</li>
<li>SSRF: your server reading its own secrets — and the redirect that beats the allow-list</li>
<li>The fix for each, and three things that look like defences but are not</li>
</ul>` + box('Why it matters to you', 'Lesson 9.2 was data going OUT into a page. This one is data coming IN — each attack is a request your validation will happily accept.', 'lam') },

  { t: 'Four attacks, four prices', to: true, giua: true, body: bang(['attack', 'the request', 'what it costs you'], [
    ['ReDoS', 'a 31-character string', 'the event loop, for seconds'],
    ['prototype pollution', 'one JSON key: __proto__', 'every object in the process'],
    ['huge body', 'one 11 MB JSON', '~90 MB of RAM per request'],
    ['SSRF', 'a URL you fetch for the user', 'your internal network and secrets'],
  ], { co: 25 }) + box('All four pass ordinary validation', 'The value has the right type, the JSON is valid, the URL parses. That is what makes them dangerous.', 'do2') },

  { t: '1 · ReDoS: catastrophic backtracking', to: true, giua: true, body: J("const RE = /^(a+)+$/;\nRE.test('a'.repeat(n) + '!');   // does NOT match", { sm: false, hl: [1] }) +
    TT('c9/redos', 2, 9, 'node redos.mjs · real', { hl: [7, 8], sm: false }) +
    box('×4 for every 2 characters', 'The string ends in "!", so the match must FAIL — and proving failure means trying every way to split the a\'s between the inner + and the outer +.', 'do2') },

  { t: 'Exponential, on a log scale', to: true, giua: true, body: thanh([
    ['20 chars', msOf(/20 char/), NODE, msOf(/20 char/) + ' ms'], ['24 chars', msOf(/24 char/), CAM, msOf(/24 char/) + ' ms'], ['28 chars', msOf(/28 char/), CAM, msOf(/28 char/) + ' ms'],
    ['30 chars', msOf(/30 char/), DO, msOf(/30 char/) + ' ms'], ['31 chars', msOf(/31 char/), DO, msOf(/31 char/) + ' ms'],
  ], { log: true, ghi: 'RE.test time · log scale · real' }) +
    box('Thirty-one bytes', 'Not a gigabyte. Thirty-one bytes in a form field.', 'do2') },

  { t: 'What it does to the server', to: true, giua: true, body: JW("const NAME = /^(a+)+$/;      // \"letters only\" — innocent-looking validation\napp.get('/check', (req, res) => res.json({ ok: NAME.test(String(req.query.name)) }));", 80, [1], { sm: false }) +
    TT('c9/redos-server', 2, 3, 'node redos-server.mjs · server in its own process · /health polled every 100 ms · real', { hl: [2], n: 100, sm: false }) +
    two(box('A regex is synchronous JavaScript', 'It blocks the event loop exactly like the for-loop of lesson 2.4: every request, timer and socket waits.', 'do2'),
      box('Ten of these a second', 'is a denial of service with traffic too small to show on any graph.', 'cam')) },

  { t: 'A regex you would actually write', to: true, giua: true, body: TT('c9/redos', 10, 15, 'node redos.mjs · "trim the trailing spaces" · real', { hl: [6], sm: false }) +
    two(box('Twenty-eight spaces', `${msOf(/28 spaces/).toLocaleString('en-US')} ms. The culprit is <code class="i">(\\s+)+</code>: a quantifier on a group that already ends in a quantifier over the same characters.`, 'do2'),
      box('The linear version', '<code class="i">s.trimEnd()</code> — no regex at all.', 'xanh')) +
    TT('c9/redos', 16, 16, "'x   '.trimEnd() and /^a+$/ on the same 31 characters · real", { sm: false }) },

  { t: 'Recognise it, then defend', to: true, giua: true, body: cards([
    ['Recognise', 'A quantifier wrapping a quantified group: (a+)+, (a*)*, (\\s+)+, (.*,)*. Or alternatives that match the same text: (a|aa)+.'],
    ['Cap the length FIRST', 'z.string().max(200) (lesson 6.3) before any regex sees the value. Exponential on bounded input is a bounded cost.'],
    ['Prefer no regex', 'trimEnd, includes, split, URL, Number.isInteger — all linear.'],
    ['No home-made email regex', 'The famous "RFC-correct" ones are ReDoS material. z.string().email(), then a confirmation mail.'],
  ], 2) + box('There is no regex timeout', 'JavaScript is single-threaded; nothing interrupts a running RegExp. The only real timeout is a worker thread.', 'cam') },

  { t: '2 · Prototype pollution', to: true, giua: true, body: J(ma('c9/proto', 3, 9), { sm: false, hl: [5] }) +
    TT('c9/proto', 2, 2, 'node proto.mjs · real', { sm: false, n: 92 }) +
    J("merge({}, JSON.parse('{\"name\":\"An\",\"__proto__\":{\"isAdmin\":true}}'));", { sm: false }) +
    box('Every project has this function', 'A deep merge for settings or PATCH bodies. The danger appears when src comes from req.body.', 'cam') },

  { t: 'One key, everybody is admin', to: true, giua: true, body: TT('c9/proto', 2, 8, 'node proto.mjs · real', { hl: [1, 5, 6], n: 100, sm: false }) +
    two(box('JSON.parse makes an OWN key', 'In JSON, "__proto__" is just a string key, so the parsed object really has it — Object.keys lists it.', 'lam'),
      box('An object literal would not', 'Writing { __proto__: x } in code sets the prototype instead. Input arrives as JSON, so the dangerous form is the one you get.', 'lam')) +
    box('Read line 6 again', 'user is an unrelated object. Nobody set isAdmin on it. It INHERITS it from Object.prototype, which merge just modified — for every object in the process, for every user, until a restart.', 'do2') },

  { t: 'Why it spreads, and three defences', to: true, giua: true, body: flow([
    { t: 'req.body', s: '"__proto__" is a real key', mau: DO }, { t: 'merge(target, src)', s: 'target["__proto__"].isAdmin', mau: CAM }, { t: 'Object.prototype', s: 'now has isAdmin', mau: DO }, { t: 'every {}', s: 'inherits true', mau: DO }], { h: 140 }) +
    bang(['defence', 'measured above'], [['validate with a schema', 'zod .object() keeps only ["name"]'], ['skip __proto__ / constructor / prototype', 'after safeMerge: isAdmin = undefined'], ['prototype-less structures', 'Object.create(null), Map: undefined']], { co: 23 }) +
    box('Most useful first', 'The schema stops the key at the door; the other two protect code that never sees a schema.', 'xanh') },

  { t: 'Good news you should verify, not trust', to: true, giua: true, body: J("GET /q?tags=a&tags=b&user[__proto__][isAdmin]=true&user[name]=An", { sm: false }) +
    TT('c9/query-parser', 2, 3, 'node query-parser.mjs · Express 5.3.0 · real', { n: 100, sm: false }) +
    two(box('simple (Express 5 default)', 'Keeps the bracket syntax as the key name. No nested object, nothing to pollute.', 'xanh'),
      box('extended (qs)', 'Builds nested objects but silently drops the __proto__ branch.', 'xanh')) +
    box('The hole is not in Express', 'It is in the utility YOU write afterwards that merges req.query or req.body into something else.', 'cam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['attack', 'measured', 'fix'], [
    ['ReDoS', '31 chars → 7.1 s; /health waited 7 s', 'cap length first; avoid nested quantifiers; prefer string methods'],
    ['prototype pollution', 'one key → user.isAdmin = true', 'zod schema; skip __proto__; Map / Object.create(null)'],
  ], { co: 22 }) + box('The common thread', 'The value was valid JSON of the right type. Validation that only checks types lets both through.', 'lam') +
    box('Next: body size and SSRF', 'One request that costs ~90 MB of RAM, and one URL that reads your production secrets.', 'lam') },

  { t: '3 · Body size: the default protects you', to: true, giua: true, body: J("app.use(express.json());     // default limit: 100kb", { sm: false }) +
    TT('c9/body-limit', 2, 3, 'node body-limit.mjs · real', { hl: [2], n: 100, sm: false }) +
    box('Polite refusal', '413 with type entity.too.large and the limit in bytes (102,400) — through a JSON error handler we added (without one Express answers with an HTML page). Everyone raises the limit the first time a real payload is refused.', 'lam') +
    flow([{ t: 'client sends 200 KB', mau: LAM }, { t: 'express.json()', s: 'stops reading at 100 KB', mau: NODE }, { t: '413', s: 'before your handler runs', mau: CAM }], { h: 130 }) },

  { t: 'The price of raising it to 20mb', to: true, giua: true, body: TT('c9/body-limit', 4, 7, 'node body-limit.mjs · RSS of the SERVER process only · real', { hl: [3, 4], sm: false }) +
    thanh([['idle', 57, NODE, '57 MB'], ['in the handler', 134, CAM, '134 MB'], ['1.5 s later', 148, DO, '148 MB']], { ghi: 'server RSS · one request of 11.0 MB · real' }) +
    box('Raw buffer + decoded string + object tree, all at once', 'One 11 MB request: about +90 MB. Ten at once on the 6 GB VPS this project once ran on — that is when the OOM killer takes the container.', 'do2') },

  { t: 'Limits per route', to: true, giua: true, body: cards([
    ['100kb globally', 'and a bigger parser ONLY where it is needed. 10mb everywhere for one upload endpoint arms every endpoint.'],
    ['Files are not JSON', 'Uploads are multipart, streamed to storage (chapter 10). Base64 in JSON adds 33% before parsing even starts.'],
    ['Cap array lengths too', 'A 90 KB body under the limit can hold 5,000 items for an O(n²) loop. .max() on arrays, not just bytes.'],
  ], 3) + J("// this website, src/index.ts — specific limits FIRST, then the general one\napp.use('/api/v1/ai/chat', chatBodyParser);              // limit derived from the attachment quota\napp.use('/api/v1/agent', express.json({ limit: '48mb' }));\napp.use(express.json({ limit: '10mb' }));", { hl: [2, 3, 4] }) +
    box('Order matters', 'Whichever parser reads the body first decides; the later one skips it. The site learned this from a 413 on two lecture PDFs.', 'cam') },

  { t: '4 · SSRF: the server fetches for the user', to: true, giua: true, body: JW(ma('c9/ssrf', 13, 16), 84, [2], { sm: false }) +
    cards([['Link preview', 'Paste a URL, see a card.'], ['Avatar from URL', 'The server downloads the picture.'], ['"Test this webhook"', 'The server calls whatever you typed.']], 3) +
    box('An ordinary feature', 'The user gives a URL; the server goes and gets it. The whole hole is the one marked line.', 'cam') },

  { t: 'Your server reads its own secrets', to: true, giua: true, body: TT('c9/ssrf', 2, 3, 'node ssrf.mjs · internal service on 127.0.0.1:4404, never exposed · real', { hl: [2], n: 100, sm: false }) +
    flow([{ t: 'attacker', s: 'cannot reach :4404', mau: DO }, { t: '/preview?url=…', s: 'your public API', mau: CAM }, { t: 'your server', s: 'is INSIDE', mau: LAM }, { t: 'internal config', s: 'returned to the attacker', mau: DO }], { h: 130 }) +
    box('Same trick, other targets', 'http://postgres:5432, http://redis:6379, the Docker socket — or, on a cloud VM, 169.254.169.254, which hands out temporary IAM credentials. The firewall did nothing wrong: the request came from inside.', 'do2') },

  { t: 'An allow-list — and the redirect that beats it', to: true, giua: true, body: J(ma('c9/ssrf', 18, 24), { hl: [4, 5, 6] }) +
    TT('c9/ssrf', 4, 9, 'node ssrf.mjs · real', { hl: [2, 6], n: 96, sm: false }) },

  { t: 'Why the check was not enough', to: true, giua: true, body: flow([
    { t: 'URL passes the check', s: 'allowed host, /cat.png', mau: NODE }, { t: 'that host answers', s: '302 → 127.0.0.1:4404', mau: CAM }, { t: 'fetch follows', s: 'redirect: \'follow\' by default', mau: DO }, { t: 'secrets returned', s: 'check saw only URL #1', mau: DO }], { h: 140 }) +
    box('For the demo', 'localhost:4406 stands in for a real https host the attacker owns and that your list allows — a CDN, a shared hosting domain, an image service with open redirects.', 'lam') +
    box('Checking the host is necessary, not sufficient', 'Every hop must pass the same check.', 'do2') },

  { t: 'Re-check every hop', to: true, giua: true, body: JW(ma('c9/ssrf', 25, 34), 96, [4, 5, 7], { sm: false }) +
    TT('c9/ssrf', 10, 11, 'node ssrf.mjs · same URL as before · real', { hl: [2], n: 100, sm: false }) },

  { t: 'String checks lose, new URL() normalises', to: true, giua: true, body: TT('c9/ssrf', 12, 17, 'node ssrf.mjs · Node 22 WHATWG URL parser · real', { hl: [2, 3, 4], sm: false }) +
    two(box('A regex on the URL', 'Four of these spellings are loopback; three of them do not contain "127.0.0.1" or "localhost" at all.', 'do2'),
      box('Parse, then compare the hostname', 'And then resolve the name and check the IP — a name you allow can still resolve to 127.0.0.1 or 10.0.0.0/8.', 'xanh')) +
    J("new URL('http://0x7f.0.0.1/').hostname   // '127.0.0.1' — the parser does the normalising for you", { sm: false }) },

  { t: 'The full defence — already built in API Design', to: true, giua: true, body: cards([
    ['redirect: \'manual\'', 'Follow redirects yourself, re-checking every hop (measured above).'],
    ['Resolve, then check the IP', 'Refuse loopback, 10/8, 172.16/12, 192.168/16, 169.254/16 AFTER DNS — and know the DNS-rebinding race between check and connect.'],
    ['Better: do not take URLs', 'Take an identifier and build the URL yourself, or send all outbound fetches through a proxy that can only reach the public Internet.'],
  ], 3) + flow([{ t: 'new URL()', s: 'https only', mau: LAM }, { t: 'resolve DNS', s: 'every address', mau: CAM }, { t: 'private IP?', s: '→ refuse', mau: DO }, { t: 'fetch, manual redirect', s: 'repeat per hop', mau: NODE }], { h: 130 }) + box('If you took API Design lesson 6.3', 'safeFetch there does exactly this on LabFlow: https only, resolve DNS and refuse private addresses, never follow a redirect, 3 s timeout — and an audit that proves it.', 'lam') },

  { t: 'This website: "do not take URLs" by design', to: true, giua: true, body: flow([
    { t: 'browser', s: 'q=cat&offset=0', mau: LAM }, { t: '/api/v1/gifs', s: 'gifs.routes.ts', mau: NODE }, { t: 'server builds the URL', s: 'GIPHY + key from env', mau: CAM }, { t: 'GIPHY', s: 'the only host it can reach', mau: LAM }], { h: 140 }) +
    two(box('Born for another reason', 'To keep the API key out of the browser bundle (chapter 4).', 'lam'),
      box('SSRF-proof as a side effect', 'The client never chooses which host the server contacts. The design that keeps secrets server-side usually keeps fetch targets in your hands too.', 'xanh')) +
    J("// src/routes/gifs.routes.ts — the client sends only a query and an offset\nconst q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';\nconst endpoint = giphyUrl(apiKey, q, offset);   // https://api.giphy.com/v1/gifs/…", { hl: [3] }) },

  { t: 'Three things that look like defences', to: true, giua: true, body: cards([
    ['A regex on the URL', '127.1, [::1], 2130706433, localhost.evil.example — measured above. Parse with new URL().'],
    ['A "timeout" for a regex', 'Nothing interrupts a running RegExp on the main thread. Only a worker thread can be killed.'],
    ['"JSON.parse cleans input"', 'It happily creates an object with __proto__ as its own key — measured in part 1.'],
  ], 3) + bang(['instead of', 'do'], [['regex on a URL', 'new URL(), then check hostname and resolved IP'], ['regex timeout', 'cap the length; worker thread for untrusted patterns'], ['trusting JSON.parse', 'a zod schema on the parsed value']], { co: 22 }) +
    box('The pattern', 'Each one feels like a check, so nobody looks further. That is worse than having no check.', 'cam') },

  { t: 'Exercise', to: true, giua: true, body: J("app.post('/settings', requireAuth, async (req, res) => {\n  const s = await loadSettings(req.user.id);\n  merge(s, req.body);                       // deep merge from part 1\n  if (/^([a-z]+)*@[a-z]+\\.com$/.test(s.email)) await saveSettings(req.user.id, s);\n  res.json(s);\n});", { sm: false, hl: [3, 4] }) +
    box('Exercise', 'Find two attacks in this handler, name them, and fix both with what this lesson measured.', '') +
    `<div data-k="dapan">${box('Answer', 'Line 3: prototype pollution (body {"__proto__":{…}}) — validate with a zod object first, or skip __proto__/constructor/prototype. Line 4: ReDoS — ([a-z]+)* is a nested quantifier; cap the length with zod and use z.string().email().', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why does a 31-character string block every other request?</li>
<li>Why is prototype pollution not limited to the request that caused it?</li>
<li>Name two dangers of raising express.json() to 20mb globally.</li>
<li>Your SSRF allow-list checks the hostname. How does an attacker still reach 127.0.0.1?</li>
<li>Why is http://2130706433/ dangerous for a string check?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. A regex runs synchronously on the event loop. &nbsp;2. It modifies Object.prototype, shared by every object until restart. &nbsp;3. ~90 MB per 11 MB request (OOM); every endpoint gets the weapon. &nbsp;4. An allowed host answers 302 to the internal URL and fetch follows it. &nbsp;5. It is 127.0.0.1 written as one decimal number.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>ReDoS: 31 chars → ${msOf(/31 char/).toLocaleString('en-US')} ms of blocked event loop; cap length before any regex, avoid nested quantifiers</li>
<li>Prototype pollution: one __proto__ key → every object is admin; zod schema, skip dangerous keys, Map</li>
<li>Body limits: 100kb by default; 11 MB costs ~90 MB RSS; bigger parsers only on the routes that need them</li>
<li>SSRF: a checked URL + one 302 reads your secrets; re-check every hop, resolve and check IPs, or never take URLs</li>
</ul>` + box('Next: lesson 9.4', 'Secrets, dependencies, and what your errors give away: a weak JWT secret cracked in under a millisecond.', 'lam') },
]);
