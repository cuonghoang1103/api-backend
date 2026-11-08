/**
 * node-06-5 — Node.js · Chapter 6 · Lesson 6.5 "The API contract: versions, ETag, idempotency" (slide EN, kiểu FU, đợt 4 — 01/11/2026). MỘT deck, HAI tập:
 *   6.5a (node-6-5)   = slide 1–12: thay đổi phá vỡ vs an toàn · siết luật kiểm cũng phá vỡ (thật) · đánh phiên bản v1/v2 + Deprecation/Sunset (thật) · URL/header/không phiên bản ·
 *                       ETag + If-Match: A 200, B 412, C 428 (thật) · 412 vs 428, cột version, khoá bi quan · đặt ETag TRƯỚC res.json (thật: W/ tự sinh, ERR_HTTP_HEADERS_SENT, 304) · tóm tắt
 *   6.5b (node-6-5-2) = slide 13–24: khoá idempotency (thật: không khoá ⇒ trừ 2 lần; có khoá ⇒ phát lại) · bốn quy tắc · cuộc đua (thật: check-then-act ⇒ 2 lần; giữ khoá trước ⇒ 1) ·
 *                       sinh khoá lúc người dùng có ý định · tài liệu sinh từ lược đồ (thật: z.toJSONSchema) · báo ngừng, log phiên bản client (thật) · website (thật) ·
 *                       Notes API chương 6 với If-Match (thật) · client được phụ thuộc vào gì · bài tập · tự kiểm
 * Nguồn: s06-rest.mjs › nodejs-6-5-hop-dong-api. Output THẬT Node 22.23.3 + Express 5.3.0 + zod 4.6.7, cổng 4100:
 * that/c6/{tighten,versions,etag,etag-order,pay,openapi,website-contract} + c6notes/index.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-06-5', code: 'NODE 6.5', title: 'The API contract: versions, ETag, idempotency', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100").replace(/ \| grep -v '[^']*'/g, '');
const L = (ten, a, b) => ngan(ra(ten, a, b));
const gay = (t, n = 100) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(',', n); if (k < 20) k = n; o.push(r.slice(0, k + 1)); r = '    ' + r.slice(k + 1); } o.push(r); return o; }).join('\n');
const hlCo = (t, ...re) => t.split('\n').map((l, i) => (re.some((r) => r.test(l)) ? i + 1 : 0)).filter(Boolean);
const tm = (t, title, re, sm = false) => term(t, { title, sm, hl: hlCo(t, ...re) });

export const slides = lamDeck({ chuong: 'Chapter 6 — REST API design', bai: '6.5' }, [
  /* ───── 6.5a ───── */
  { cover: true, t: 'The API contract:<br>versions, ETag, idempotency', sub: 'An API is a promise to code you do not control.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What counts as a <b>breaking change</b>, including the one nobody notices in review</li>
<li>Versioning: <code class="i">/api/v1</code>, headers, or not at all</li>
<li><b>ETag + If-Match</b>: the real cure for the lost update of lesson 6.1</li>
<li>Part 2: the <b>Idempotency-Key</b> that stops a double charge, the race inside it, and documentation generated from code</li>
</ul>
${box('Why this is hard', 'A web app redeploys in a minute. A mobile app on someone\'s phone is eight months old, and a partner reads your change email three weeks after their integration broke.', 'lam')}` },

  { t: 'Picture a power socket', to: true, giua: true, body: cards([
    ['🔌 Add a USB port next to it', 'Old plugs still fit. Nobody notices. That is an additive change.'],
    ['📐 Move the pins 2 mm', 'Every plug in every home stops fitting. That is a breaking change.'],
    ['🏷️ "This socket model ends in 2027"', 'A notice, a date, a count of who still uses it. That is deprecation.'],
  ], 3) + box('Mapping', 'The socket = your API. The plugs = clients you cannot update. You may add; you may not move the pins without a new socket (a new version).', 'xanh') + box('Contract (hợp đồng)', 'everything a client is allowed to rely on: URLs, fields, types, status codes, meanings.', 'lam') },

  { t: 'What breaks a client, and what does not', to: true, giua: true, body: vsd(
    `<ul style="margin:0"><li>remove a field</li><li>rename a field</li><li>change a type ("42" → 42)</li><li>add a required request field</li><li><b>tighten validation</b></li><li>change a status code</li><li>change what a value means</li></ul>`,
    `<ul style="margin:0"><li>add an optional response field</li><li>add an optional request field with a default</li><li>add a new endpoint</li><li>add an enum value, IF clients were told to ignore unknown ones</li></ul>`,
    '✗ Breaking', '✓ Safe') + box('Loosening is safe; tightening is not', 'Neither shows up in code review labelled "breaking".', 'do2') },

  { t: 'Tightening validation is breaking: proof', giua: true, body: js(ma('c6/tighten', 3, 6), { sm: true, hl: [2, 3] }) + term(ra('c6/tighten'), { title: 'node tighten.mjs · real', hl: [2, 3] }) +
    two(box('"Just add .max(200)"', 'Yesterday a 300-character title was accepted. Today the same request from the same 8-month-old app is rejected.', 'do2'),
      box('Optional with a default: safe', 'Old clients never send it and never notice.', 'xanh')) },

  { t: 'Versioning: two routers, side by side', giua: true, body: js([ma('c6/versions', 6, 13), ma('c6/versions', 15, 16), ma('c6/versions', 18, 19)].join('\n'), { sm: true, hl: [5, 9, 11, 12] }) + tm(L('c6/versions', 1, 6) + '\n' + L('c6/versions', 7, 8), 'v1 · old Android app, then v2 · new iOS app · real', [/^Deprecation|^Sunset|content/], true) },

  { t: 'Where the version lives', to: true, giua: true, body: cards([
    ['In the URL', '<code class="i">/api/v1/…</code>. Ugly to purists; visible in logs, easy to route, easy to curl. Most APIs, this one included.'],
    ['In a header', '<code class="i">Accept: application/vnd.api+json;version=2</code>. Cleaner URLs; harder to debug and cache, cannot paste into a browser.'],
    ['Best: do not version', 'Only add, never remove. A v2 means two code paths forever. Most "breaking" changes can be rephrased as an added field plus deprecation.'],
  ], 3) + box('Start at /api/v1 on day one', 'Adding a version prefix later means changing every client. Having it from the start costs three characters.', 'xanh') },

  { t: 'Optimistic concurrency: ETag + If-Match', giua: true, body: js(ma('c6/etag', 7, 23), { sm: true, hl: [5, 10, 11, 13] }) +
    box('One header each way', 'GET sends <code class="i">ETag</code> (a fingerprint of this version). PATCH must send it back in <code class="i">If-Match</code>: "change it only if it is still the version I read".', 'xanh') },

  { t: 'Two people edit, for real', to: true, giua: true, body: tm(gay(ra('c6/etag'), 96), 'two clients, same ETag · real', [/-> 200|-> 412|-> 428|final state/]) + two(
    box('B gets 412, not silence', 'The client knows exactly what to do: reload, show the difference, let a human decide.', 'xanh'),
    box('A\'s change survives', 'Final state is "A edited", version 2. Compare with the lost update of lesson 6.1.', 'lam')) + box('C sent nothing', '428: this endpoint REQUIRES If-Match, so a careless client cannot overwrite anyone by accident.', '') },

  { t: '412, 428, and other ways to do it', to: true, giua: true, body: cards([
    ['412 vs 428', '412: you sent a precondition and it failed. 428: you sent none and this endpoint requires one. Requiring it makes the safe path the only path.'],
    ['A version column works too', '<code class="i">UPDATE … WHERE id = $1 AND version = $2</code>: zero rows updated means someone was faster. Same idea, enforced by the database. Chapter 7 uses this.'],
    ['Why "optimistic"', 'No lock, no waiting: conflicts are detected only when they really happen.'],
    ['The pessimistic way', 'Lock the row while someone edits. One forgotten browser tab blocks that note for everyone.'],
  ], 2) + js(`-- the same idea in SQL (chapter 7): update only if nobody was faster
UPDATE notes SET title = $1, version = version + 1 WHERE id = $2 AND version = $3;`, { sm: false }) },

  { t: 'Set the ETag BEFORE res.json', giua: true, body: js(ma('c6/etag-order', 5, 7), { sm: true, hl: [2, 3] }) + two(
    tm(L('c6/etag-order', 1, 9), 'curl · real', [/^ETag/]),
    cot(tm(ra('c6/etag-order', 2, 2, 'server'), 'server log · /late · real', [/ERR/]), tm(gay(L('c6/etag-order', 10, 11), 46), 'If-None-Match "v1" · real', [/304/]))) +
    box('Why', 'If no ETag is set, Express makes its own inside send(): a weak hash of the body (W/"27-…"). After res.json the headers are already sent: setting one throws.', 'lam') },

  { t: 'Part 1: summary', to: true, giua: true, body: `<ul>
<li>Breaking: remove, rename, retype, require, <b>tighten</b>. Safe: add optional</li>
<li>Version in the URL from day one; better still, only add</li>
<li>ETag + If-Match: the second writer gets <b>412</b>, not silent success</li>
<li>Set your ETag before <code class="i">res.json</code></li>
</ul>${flow([{ t: 'GET', s: 'ETag "7f49…"', mau: LAM }, { t: 'PATCH', s: 'If-Match "7f49…"', mau: NODE }, { t: 'changed since?', s: 'compare', mau: CAM }, { t: '200 or 412', s: 'never silent', mau: DO }], { h: 130, fs: 21 })}${box('Part 2', 'The Idempotency-Key that stops a double charge, the race hidden inside it, and documentation that cannot lie.', 'lam')}` },

  /* ───── 6.5b ───── */
  { t: 'Idempotency-Key: stop the double charge', giua: true, body: js(ma('c6/pay', 19, 30), { sm: true, hl: [3, 5, 6, 7, 10] }) +
    box('The standard cure', 'The client sends a key it generated. Seen before? Replay the saved response, do NOT charge again. New key? Do the work, save the response under it.', 'xanh') },

  { t: 'Real: a lost response, a retry', giua: true, body: tm(gay(ra('c6/pay', 1, 10), 100), 'pay.client.mjs · real', [/charged \d times|Replay/]) + two(
    box('Without a key', 'Two charges for ONE tap. The server could not tell a retry from a new payment.', 'do2'),
    box('With a key', 'The retry gets the SAME id and an Idempotent-Replay header. Two taps, two charges: correct.', 'xanh')) + box('No key at all', '400 IDEMPOTENCY_KEY_REQUIRED: the endpoint refuses to guess.', '') },

  { t: 'Four rules for keys', to: true, giua: true, body: cards([
    ['The client generates it', 'One UUID per user intent: created on the button press, reused by every retry of that press.'],
    ['Store it somewhere that survives', 'A Map is fine for a demo. Production: a table or a Redis key with a TTL (24 h is common). A Map is per process: with two containers the retry may land on the one that never saw the key.'],
    ['Store the response, not just the key', 'The retry must get the original body, not a 409. The client cannot tell "response lost" from "never sent".'],
    ['Block the race too', 'Two retries can arrive at the same moment. Claim the key BEFORE the work, so the second one waits or replays.'],
  ], 2) + box('In one sentence', 'Same key ⇒ same outcome, however many times and however fast the request arrives.', 'xanh') },

  { t: 'The race inside the lesson\'s code', giua: true, body: js(ma('c6/pay', 36, 43), { sm: true, hl: [1, 2, 5, 6] }) + tm(ra('c6/pay', 11, 13), 'two retries at the same moment · real', [/charged/]) +
    box('Check-then-act vs claim first', 'Both requests checked the Map while the first was still awaiting the bank: both charged. Storing the PROMISE before any await makes the second wait for the same result. In a database: insert the key with a UNIQUE constraint first.', 'xanh') },

  { t: 'Generate the key at the moment of intent', to: true, giua: true, body: vsd(
    js(`// wrong: a new key on every attempt
for (let i = 0; i < 3; i++) {
  const key = crypto.randomUUID();
  if (await pay(amount, key)) break;
}`, { sm: false }),
    js(`// right: one key per button press
const key = crypto.randomUUID();
for (let i = 0; i < 3; i++) {
  if (await pay(amount, key)) break;
}`, { sm: false }), '✗ Key inside the retry loop', '✓ Key at the moment of intent') + box('Why the wrong one is useless', 'Every retry carries a fresh key, so the server sees three different payments. The whole mechanism is disabled.', 'do2') + box('Payment providers require this header', 'For exactly this reason. Writing a client for one? Generate the key when the user taps "Pay".', 'lam') },

  { t: 'Documentation generated from the schema', giua: true, body: js(ma('c6/openapi', 3, 9), { sm: true }) + tm(ra('c6/openapi'), 'node openapi.mjs · real (zod 4 z.toJSONSchema)', [/maxLength|maxItems|required/]) +
    box('Docs that cannot lie', 'Hand-written API docs are wrong within a month: nothing forces them to be right. Generated from the schemas of lesson 6.3, they cannot drift from the validator that keeps the build green.', 'xanh') },

  { t: 'Deprecate before you delete', to: true, giua: true, body: two(tm(L('c6/versions', 1, 6) + '\n' + L('c6/versions', 13, 14), 'v1 headers + who still calls v1 · real', [/^Deprecation|^Sunset|v1-callers|NotesApp/]), cot(
    box('Announce, mark, measure', 'A Deprecation header, a Sunset date, and a log of which clients still call. Delete only when that log is empty.', 'xanh'),
    box('Log the client version', 'You cannot plan a removal if you cannot answer "who still uses v1?"', 'lam'),
    box('Additive by default', 'The cheapest migration is the one old clients never notice.', '')), 'r64') },

  { t: 'This website: one version, keys where money moves', giua: true, body: tm(ra('c6/website-contract'), 'cuongthai.com · src + prisma (read-only) · real', [/\/api\/v2: 0|@@unique/]) + two(
    box('Never needed a v2', 'Every change so far fit as an added optional field.', 'xanh'),
    box('Idempotency where it matters', 'Course checkout, shop orders, top-ups, Pro orders: a key per user, UNIQUE in the database. A double-clicked "Buy" returns the first order.', 'lam')) },

  { t: 'Notes API, chapter 6: If-Match on PATCH', giua: true, body: js(ma('c6notes/notes.routes', 29, 35), { sm: true, hl: [2, 3, 4, 5] }) + tm(gay(L('c6notes/index', 18, 23), 110), 'curl · real (the whole project)', [/\[\d{3}\]/], true) },

  { t: 'What a client may depend on', to: true, giua: true, body: steps([
    'Adding a field is safe: a client that ignores unknown keys keeps working. That is why "tolerant reading" is part of the contract, not a courtesy.',
    'Removing or renaming a field is not. Neither is narrowing a type, making an optional field required, or changing what a status means: those need a new version.',
    'ETag gives you optimistic concurrency: the client sends If-Match, and a 412 means someone changed the row first. No "last write wins", no locks.',
    'An idempotency key makes retries safe: the client creates it, the server stores the outcome under it, a second attempt returns the first result.',
  ]) + box('Tolerant reader (đọc khoan dung)', 'A client that ignores fields it does not know. Write your own clients this way, and tell API users to do the same.', 'lam') },

  { t: 'Exercise: breaking or safe?', giua: true, body: two(`<div style="font-size:22px;line-height:1.45"><ol><li>add optional <code class="i">color</code> to responses</li><li>rename <code class="i">body</code> to <code class="i">content</code></li><li>make <code class="i">tags</code> required on POST</li><li>add enum value <code class="i">archived</code> (clients told to ignore unknown values)</li><li>a missing note now returns 410 instead of 404</li></ol></div>`,
    `<div data-k="dapan">${bang(['', 'Verdict'], [['1', '✓ safe'], ['2', '✗ breaking: new version, or add <code class="i">content</code> and deprecate <code class="i">body</code>'], ['3', '✗ breaking (tightening)'], ['4', '✓ safe, because of that promise'], ['5', '✗ breaking: status codes are part of the contract']], { co: 19 })}</div>`) +
    box('Bonus', 'A mobile SDK retries POST /payments with a NEW key each attempt. What happens, and what is the one-line fix?', 'lam') + `<div data-k="dapan">${box('Bonus answer', 'Every retry looks like a new payment: double charges are back. Move <code class="i">randomUUID()</code> out of the retry loop, to the button press.', 'xanh')}</div>` },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why is adding <code class="i">.max(200)</code> to an existing field a breaking change?</li>
<li>In the lesson's first Idempotency-Key code, how can a customer still be charged twice?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Requests that worked yesterday are rejected today, from clients you cannot update. &nbsp; 2. Two retries arrive together: both pass the "seen?" check before either stores the key. Claim the key first.', 'xanh')}</div>
<ul>
<li>Add, do not remove; tightening breaks; version in the URL from day one</li>
<li>ETag + If-Match → 412 instead of a lost update</li>
<li>Idempotency-Key: client-generated, stored with the response, claimed before work</li>
<li>Docs generated from the schema; deprecate, measure, then delete</li>
</ul>
${box('Next', 'Chapter 7: PostgreSQL and Prisma. The Map inside the Notes API becomes a real database.', 'lam')}` },
]);
