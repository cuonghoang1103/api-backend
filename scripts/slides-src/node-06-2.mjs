/**
 * node-06-2 — Node.js · Chapter 6 · Lesson 6.2 "Status codes and response shape" (slide EN, kiểu FU, đợt 4 — 01/11/2026). MỘT deck, HAI tập:
 *   6.2a (node-6-2) = slide 1–11 · 6.2b (node-6-2-2) = slide 12–19.
 * Phủ: mã cần dùng (bảng 12 mã) · 2xx thật (201 + Location, 204) · 401 vs 403 + vòng làm mới token vô tận (client thật) · 400 vs 422 · 409 vs 422 (thật) ·
 * 429 + Retry-After, 500 vs 503 (thật) · trả 201 đúng cách + 204 kèm body bị Express lặng lẽ bỏ (thật) · một hình dạng phản hồi + 200 {success:false} (thật) ·
 * vỏ bọc {data} · quy ước trường (ISO, tiền số nguyên, id lớn > 2^53, null vs thiếu: thật) · website (hình dạng thật trên prod + một interceptor) ·
 * chọn mã theo thứ đã xảy ra (cây quyết định) · bài tập · tự kiểm.
 * Nguồn: s06-rest.mjs › nodejs-6-2-ma-trang-thai. Output THẬT Node 22.23.3 + Express 5.3.0, cổng 4100: that/c6/{status,no-content,refresh-loop,fields,website-shape}.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-06-2', code: 'NODE 6.2', title: 'Status codes and response shape', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100").replace(/ \| grep -v '[^']*'/g, '');
const L = (ten, a, b) => ngan(ra(ten, a, b));

/** Cây chọn mã trạng thái (SVG). */
function cay() {
  const w = 1110, h = 360;
  const o = (x, y, ww, t, mau, s = '') => `<rect x="${x}" y="${y}" width="${ww}" height="64" rx="12" fill="${mau}14" stroke="${mau}" stroke-width="3"/><text x="${x + ww / 2}" y="${y + (s ? 28 : 40)}" text-anchor="middle" font-size="21" font-weight="800" fill="${mau}">${t}</text>` + (s ? `<text x="${x + ww / 2}" y="${y + 53}" text-anchor="middle" font-size="17" fill="#444">${s}</text>` : '');
  const ar = (x1, y1, x2, y2, t = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#666" stroke-width="2.5" marker-end="url(#m62)"/>` + (t ? `<text x="${(x1 + x2) / 2 + 6}" y="${(y1 + y2) / 2 - 4}" font-size="17" fill="#555" font-weight="700">${t}</text>` : '');
  let s = `<svg data-k="cay" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="m62" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#666"/></marker></defs>`;
  s += o(420, 0, 270, 'What happened?', LAM);
  s += ar(470, 64, 100, 120, 'it worked') + ar(510, 64, 325, 120, 'broken') + ar(555, 64, 550, 120, 'rejected') + ar(600, 64, 780, 120, 'who?') + ar(640, 64, 1010, 120, 'our bug');
  s += o(0, 124, 200, '2xx', NODE, '200 · 201 · 204');
  s += o(225, 124, 200, '400', DO, 'cannot parse it');
  s += o(450, 124, 200, '422 · 409', CAM, 'value · state');
  s += o(675, 124, 210, '401 · 403 · 404', TIM, 'who / which?');
  s += o(910, 124, 200, '5xx', DO, 'our fault');
  s += ar(720, 188, 640, 250) + ar(780, 188, 780, 250) + ar(840, 188, 900, 250, '') ;
  s += o(560, 254, 120, '401', DO, 'who are you?') + o(720, 254, 120, '403', DO, 'not allowed');
  s += o(860, 254, 110, '404', DO, 'no such');
  s += ar(1010, 188, 1010, 250);
  s += o(985, 254, 125, '500 · 503', DO, 'bug · later');
  s += o(0, 254, 520, '201 → add Location · 204 → empty body', NODE);
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Chapter 6 — REST API design', bai: '6.2' }, [
  { cover: true, t: 'Status codes<br>and response shape', sub: 'The first thing every client reads, and often the only thing it branches on.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>twelve</b> status codes you actually need, each tried for real</li>
<li>The three pairs people mix up: <b>401/403</b>, <b>400/422</b>, <b>409/422</b></li>
<li>201 done right, and what Express does to a body on 204</li>
<li><b>One response shape</b>, decided once; field conventions to fix early</li>
<li>Choosing a code from what actually happened</li>
</ul>
${box('Why it matters', 'Pick right and it costs nothing. Pick wrong and a client retries a permanent error forever, or gives up on a temporary one.', 'do2')}` },

  { t: 'Picture a courier\'s delivery slip', to: true, giua: true, body: cards([
    ['✅ Delivered', '200. And "here is your tracking page": 201 + where to find it.'],
    ['📭 Nothing to hand over', '204. Done, nothing to show.'],
    ['🔍 Address unreadable', '400. Fix the label you wrote.'],
    ['🪪 Show me your ID', '401. Who are you?'],
    ['⛔ You may not receive this', '403. I know you; still no.'],
    ['⏳ Come back later', '429 / 503. Not your fault, not forever.'],
  ], 3) + box('Mapping', 'The courier ticks ONE box, and you act on the box, not on his handwriting. Status code = the box. The message = the handwriting.', 'xanh') },

  { t: 'The codes you actually need', giua: true, body: bang(['Code', 'Meaning', 'Typical case'], [
    ['200 OK', 'it worked, here it is', 'GET, PATCH, PUT'],
    ['201 Created', 'a new thing exists', 'POST + Location header'],
    ['204 No Content', 'done, body MUST be empty', 'DELETE'],
    ['400 Bad Request', 'the request itself is broken', 'not JSON, missing header'],
    ['401 Unauthorized', '"I do not know who you are"', 'no / expired / wrong token'],
    ['403 Forbidden', '"I know you, and you may not"', 'student deletes a user'],
    ['404 Not Found', 'no such resource (or you may not know it exists)', 'GET /notes/999'],
    ['409 Conflict', 'valid, but clashes with current state', 'email already taken'],
    ['422 Unprocessable', 'parsed fine, values wrong', 'empty title, price &lt; 0'],
    ['429 Too Many Requests', 'rate limited, with Retry-After', 'login spam'],
    ['500 Internal', 'OUR bug', 'never for a bad request'],
    ['503 Unavailable', 'temporarily down: try later', 'dependency down, shutting down'],
  ], { co: 19 }) },

  { t: '2xx for real: 201 with Location, 204 empty', giua: true, body: js(ma('c6/status', 9, 15), { sm: true, hl: [6] }) + term(L('c6/status', 1, 7), { sm: true, title: 'POST · real (Date/ETag lines filtered)', hl: [2, 3, 7] }) + two(
    term(L('c6/status', 8, 9), { title: 'DELETE · real', hl: [2] }),
    box('Read it like a client', '201: something new exists, and Location says where. 204: done, nothing to read.', 'xanh')) },

  { t: '401 and 403', to: true, giua: true, body: vsd(
    `<b>401 = authentication failed</b><br>"Who are you?" Log in again, refresh the token.`,
    `<b>403 = authorisation failed</b><br>"I know you, and no." Logging in again changes NOTHING.`, '401 Unauthorized', '403 Forbidden') +
    term(L('c6/status', 14, 17), { title: 'curl · real', hl: [2, 4] }) +
    box('Never use 401 for a permission problem', 'A frontend with a 401 interceptor will refresh and retry — next slide.', 'do2') },

  { t: 'What a wrong 401 does to a frontend', giua: true, body: two(term(ra('c6/refresh-loop'), { sm: true, title: 'naive interceptor vs server · real', hl: [13, 15, 16] }), cot(
    box('The bug', 'The permission problem answered with <b>401</b>. The interceptor "fixes" it with a refresh, then asks again. Forever.', 'do2'),
    box('Real numbers', '5 refresh calls in 46 ms for one click, and only because the test has a brake. A real app has none.', 'do2'),
    box('With 403', 'The interceptor stops at once and shows "no permission".', 'xanh')), 'r64') },

  { t: '400 and 422', to: true, giua: true, body: two(
    box('400: "I cannot even parse this"', '<code class="i">{title:}</code> is not JSON. Fix your CODE.', 'do2'),
    box('422: "I parsed it, the values are wrong"', '<code class="i">{"title":""}</code> is empty. Fix your DATA.', 'lam')) +
    term(L('c6/status', 10, 13), { title: 'curl · real', hl: [2, 4] }) +
    box('Some teams use 400 for both', 'A defensible simplification. What is not defensible: choosing at random, so the client cannot tell "fix your code" from "fix your input".', '') },

  { t: '409 and 422', to: true, giua: true, body: two(
    box('422: the data itself is wrong', 'An email without @. No moment in time makes it valid.', 'lam'),
    box('409: the data is fine, the WORLD disagrees', 'That email is already registered. A minute ago it would have worked.', 'do2')) +
    term(L('c6/status', 18, 23), { title: 'curl · real', hl: [2, 4, 6] }) +
    box('The practical test', 'Could this exact request have succeeded a minute ago, or a minute from now? Yes ⇒ 409. Chapter 7 maps Prisma\'s P2002 (unique violation) to 409 for this reason.', 'xanh') },

  { t: '"Try later" codes: 429 and 503. And 500.', giua: true, body: term(L('c6/status', 24, 36), { sm: true, title: 'curl · real (the third /search is limited)', hl: [2, 4, 6, 7, 11, 13] }) + two(
    box('429 + Retry-After', 'You are going too fast. The header says how many seconds to wait.', 'lam'),
    box('500 vs 503', '500 = our bug, wake someone up. 503 = temporarily down, the only one that truly means "try again later". Never send 500 for a bad request.', 'do2')) },

  { t: 'Part 1: summary', to: true, giua: true, body: `<ul>
<li>Twelve codes: 2xx it worked · 4xx the client's side · 5xx ours</li>
<li><b>401</b> who are you? · <b>403</b> I know you, no</li>
<li><b>400</b> cannot parse · <b>422</b> values wrong · <b>409</b> the state says no</li>
<li><b>429</b> + Retry-After and <b>503</b> mean "later"; <b>500</b> means "our bug"</li>
</ul>${flow([{ t: '2xx', s: 'it worked', mau: NODE }, { t: '400 · 422 · 409', s: 'fix the request', mau: CAM }, { t: '401 · 403 · 404', s: 'who / which?', mau: TIM }, { t: '5xx', s: 'ours: wake someone', mau: DO }], { h: 130, fs: 21 })}${box('Part 2', '201 done right, what Express does to a body on 204, one response shape, field conventions, and this website.', 'lam')}` },

  { t: 'Return 201 the right way', to: true, giua: true, body: cards([
    ['Return the created object', 'The client needs the id and createdAt the server made. <code class="i">{"ok":true}</code> forces one more round trip.'],
    ['Send Location', 'Cheap, standard, tells any generic client where the new thing lives.'],
    ['204 means EMPTY', '<code class="i">res.status(204).json({ok:true})</code> contradicts itself. Use <code class="i">.end()</code>.'],
  ], 3) + js(ma('c6/no-content', 3, 5), { sm: true, hl: [2] }) + term(L('c6/no-content', 1, 4), { title: 'curl · real: the body silently vanished', hl: [2, 4] }) },

  { t: 'One response shape, decided once', giua: true, body: js(`// success: the resource itself, or a wrapper for a collection
{ "id": 1, "title": "…" }
{ "items": [ … ], "page": 1, "limit": 10, "total": 128 }

// error: ALWAYS this shape, for every 4xx and 5xx
{ "error": { "code": "NOTE_NOT_FOUND", "message": "Note 42 not found" } }`, { sm: false, hl: [6] }) + cards([
    ['A stable code', 'Clients branch on code, never on message. Wording gets rewritten and translated; codes are a contract.'],
    ['A human message', 'For your logs and developers. Not UI text: the frontend maps codes to its own translated strings.'],
    ['Optional fields', 'For validation errors, one entry per bad field. Lesson 6.3 builds it from the schema.'],
  ], 3) + term(ngan(ra('c5notes/index', 16, 17)), { title: 'the Notes API of lesson 5.5 already does it · real', hl: [2] }) },

  { t: 'Never 200 with an error inside', to: true, giua: true, body: term(L('c6/no-content', 5, 6), { title: 'curl · real', hl: [2] }) + cards([
    ['📈 Monitoring', 'Sees zero errors. The dashboard stays green while users fail.'],
    ['🔁 Retries', 'Never fire, because 200 means "it worked".'],
    ['🗄️ Caches', 'Happily store the failure and serve it again.'],
  ], 3) + box('The envelope question', 'Wrap every success in <code class="i">{ data: … }</code> or not? No right answer, but answer it ONCE. Half-wrapped APIs end in <code class="i">const note = res.data.data ?? res.data</code>, copied into forty files.', 'lam') },

  { t: 'Field conventions to fix early', giua: true, body: term(ra('c6/fields'), { sm: true, title: 'JSON in JavaScript · real', hl: [1, 4, 7, 8] }) + cards([
    ['Times: ISO 8601, UTC', '"2026-07-27T15:00:00.000Z": exactly what JSON.stringify does to a Date.'],
    ['Money: smallest unit, integer', '250000 VND, never a float (lesson 1.1).'],
    ['Big ids as strings', 'Above 2<sup>53</sup> numbers round silently: …993 became …992.'],
    ['null beats absent', 'One shape for clients: send "body": null.'],
  ], 4) + box('Booleans', 'Name what is true: <code class="i">isPublished</code>, not <code class="i">status: 1</code>. Avoid negatives like <code class="i">isDisabled: false</code>.', '') },

  { t: 'This website: one shape, one interceptor', giua: true, body: term(ra('c6/website-shape'), { title: 'cuongthai.com · production + frontend source · real (read-only)', hl: [2, 4, 6, 7, 9] }) + two(
    box('One flat shape, chosen years ago', '<code class="i">{ success, message, code }</code>, successes wrapped in <code class="i">{ success, data }</code>. Not this lesson\'s shape, same lesson: decided once.', 'lam'),
    box('One interceptor', 'Status for transport (401 → refresh once, retry, never on /auth/*). Code for the UI. The 404 has no code: the one leak.', 'xanh')) },

  { t: 'Choose the code from what happened', giua: true, body: cay() + steps([
    'Did it work? 200 for a read or change, 201 + Location for a create, 204 when there is truly nothing to return.',
    'Is the request malformed? 400. Data valid but unacceptable? 422 (or 409 if the current state is the reason).',
    'Whose fault? 401 not logged in, 403 refused, 404 no such thing. 5xx is yours: it should wake someone up.',
  ]) },

  { t: 'Exercise: which code?', to: true, giua: true, body: two(`<div style="font-size:24px"><ol style="line-height:1.6"><li>Body is <code class="i">{title:</code></li><li>Price is −5</li><li>Expired token</li><li>Student opens /admin</li><li>Username already taken</li><li>Payment provider is down</li><li>A <code class="i">TypeError</code> in your handler</li></ol></div>`,
    `<div data-k="dapan">${bang(['', 'Code'], [['1', '400'], ['2', '422'], ['3', '401'], ['4', '403'], ['5', '409'], ['6', '503'], ['7', '500']], { co: 22 })}</div>`) +
    `<div data-k="dapan">${box('Number 5', 'A minute ago that username was free: the request is fine, the state is not. 409.', 'xanh')}</div>` },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why does answering a permission problem with 401 hurt your own server?</li>
<li>Why is <code class="i">200 {"success":false}</code> worse than a 4xx?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The frontend\'s 401 interceptor refreshes and retries: a refresh loop hammering your auth endpoint. &nbsp; 2. Monitoring, retries and caches all believe it worked.', 'xanh')}</div>
<ul>
<li>Twelve codes; three pairs: 401/403, 400/422, 409/422</li>
<li>201 + Location + the object; 204 is empty</li>
<li>One error shape <code class="i">{ error: { code, message } }</code>, decided once</li>
<li>ISO UTC times, integer money, big ids as strings, null over absent</li>
</ul>
${box('Next', 'Lesson 6.3: validate input with a schema, and return per-field errors.', 'lam')}` },
]);
