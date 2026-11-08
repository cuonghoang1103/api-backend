/**
 * node-06-1 — Node.js · Chapter 6 · Lesson 6.1 "Resources, methods and what REST really means" (slide EN, kiểu FU, đợt 4 — 01/11/2026). MỘT deck, HAI tập:
 *   6.1a (node-6-1)   = slide 1–14: danh từ không phải động từ (+ ba tầng ở giữa đọc phương thức) · đặt tên URL (bảng 8 route chạy thật) · 4 luật đặt tên ·
 *                       hành động không phải CRUD · safe / idempotent (bảng) · thí nghiệm POST/PUT/DELETE hai lần (thật) · trừ tiền hai lần · bài tập
 *   6.1b (node-6-1-2) = slide 15–25: PUT vs PATCH (PUT thiếu trường ⇒ xoá trắng, thật) · lost update hai người (thật) · PATCH giảm nhưng không chữa (thật) ·
 *                       HEAD + OPTIONS miễn phí, 405 không miễn phí (thật) · website · biến tính năng thành tài nguyên · bài tập · tự kiểm
 * Nguồn: s06-rest.mjs › nodejs-6-1-tai-nguyen-phuong-thuc. Output THẬT Node 22.23.3 + Express 5.3.0, cổng 4100: that/c6/{rest-routes,idem,lost-update,free}.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-06-1', code: 'NODE 6.1', title: 'Resources, methods and what REST really means', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100").replace(/ \| grep -v '[^']*'/g, '');
const L = (ten, a, b) => ngan(ra(ten, a, b));

/** Ba tầng ở giữa client và server đều đọc PHƯƠNG THỨC (SVG). */
function baTang() {
  const w = 1110, h = 330;
  const o = (x, y, ww, hh, mau, t, s) => `<rect x="${x}" y="${y}" width="${ww}" height="${hh}" rx="14" fill="${mau}14" stroke="${mau}" stroke-width="3"/><text x="${x + ww / 2}" y="${y + 40}" text-anchor="middle" font-size="25" font-weight="800" fill="${mau}">${t}</text>` + (s ? `<text x="${x + ww / 2}" y="${y + 72}" text-anchor="middle" font-size="19" fill="#444">${s}</text>` : '');
  let s = `<svg data-k="batang" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="m61" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>`;
  s += o(10, 110, 170, 110, LAM, '📱 client', 'app, browser');
  s += o(940, 110, 160, 110, NODE, '🟢 server', 'your Express');
  const tang = [['🗄️ proxy / CDN', 'caches GET', 'never caches POST'], ['🔙 browser Back', 'resends GET silently', 'warns before POST'], ['🔁 SDK retry', 'repeats PUT, DELETE', 'refuses to repeat POST']];
  tang.forEach(([t, a, b], i) => {
    const x = 225 + i * 240;
    s += `<rect x="${x}" y="40" width="215" height="250" rx="14" fill="#fff" stroke="${CAM}" stroke-width="3" stroke-dasharray="8 6"/>`;
    s += `<text x="${x + 107}" y="82" text-anchor="middle" font-size="22" font-weight="800" fill="${CAM}">${t}</text>`;
    s += `<text x="${x + 107}" y="160" text-anchor="middle" font-size="19" font-weight="700" fill="${NODE}">✓ ${a}</text>`;
    s += `<text x="${x + 107}" y="205" text-anchor="middle" font-size="19" font-weight="700" fill="${DO}">✗ ${b}</text>`;
  });
  s += `<line x1="182" y1="300" x2="936" y2="300" stroke="#555" stroke-width="3" marker-end="url(#m61)"/><text x="560" y="324" text-anchor="middle" font-size="19" fill="#444">every layer in between reads the METHOD, never your URL wording</text>`;
  return s + '</svg>';
}

/** Trạng thái sau N lần gọi (SVG nhỏ): POST nhân bản, PUT giữ nguyên, DELETE vẫn không còn. */
function nLan() {
  const w = 1110, h = 200;
  let s = `<svg data-k="nlan" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  const hang = [['POST /notes ×2', 'two notes now exist', DO, 2], ['PUT /settings/theme ×2', 'still one theme: dark', NODE, 1], ['DELETE /notes/1 ×2', 'gone in both cases', NODE, 0]];
  hang.forEach(([t, kq, mau, n], i) => {
    const y = 20 + i * 62;
    s += `<text x="10" y="${y + 32}" font-size="23" font-weight="800" fill="#333" font-family="monospace">${t}</text>`;
    for (let k = 0; k < Math.max(n, 1); k++) s += n === 0
      ? `<rect x="${400}" y="${y + 6}" width="60" height="40" rx="8" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="6 5"/>`
      : `<rect x="${400 + k * 72}" y="${y + 6}" width="60" height="40" rx="8" fill="${mau}22" stroke="${mau}" stroke-width="3"/><text x="${430 + k * 72}" y="${y + 33}" text-anchor="middle" font-size="20" font-weight="800" fill="${mau}">${n === 2 ? `#${k + 1}` : '🌙'}</text>`;
    s += `<text x="580" y="${y + 33}" font-size="22" font-weight="700" fill="${mau}">${mau === DO ? '✗' : '✓'} ${kq}</text>`;
  });
  return s + '</svg>';
}

export const slides = lamDeck({ chuong: 'Chapter 6 — REST API design', bai: '6.1' }, [
  /* ───── 6.1a ───── */
  { cover: true, t: 'Resources, methods<br>and what REST really means', sub: 'The API you design today is called by a phone app three years from now.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The one idea of REST: <b>nouns</b> in the URL, <b>verbs</b> in the method</li>
<li>How to name URLs, and the four rules that end the arguments</li>
<li>Two properties you can test: <b>safe</b> and <b>idempotent</b></li>
<li>Part 2: PUT vs PATCH, the update everyone gets wrong, and what Express gives you for free</li>
</ul>
${box('Why this outlives the framework', 'Chapter 5 gave you the machine. This chapter decides WHICH requests to answer. That decision lives longer than any Express version.', 'lam')}
${box('Real outputs', 'Node 22 + Express 5.3.0, curl against a real server.', 'xanh')}` },

  { t: 'Picture a restaurant order slip', to: true, giua: true, body: cards([
    ['🧾 Fixed boxes everyone reads', 'ADD · CHANGE · CANCEL. The waiter, the kitchen and the cashier all act on those boxes.'],
    ['🍜 The dish is the thing', '"Pho, table 4". A noun. It stays the same whatever you do to it.'],
    ['✍️ "please-make-it-go-away-pho"', 'Written in the dish field. Only the writer understands it. The cashier still charges you.'],
  ], 3) + box('Mapping', 'The boxes = HTTP methods. The dish = the URL (a resource). Writing a verb in the URL = writing an action where only your own code can read it.', 'xanh') + box('REST', '<b>RE</b>presentational <b>S</b>tate <b>T</b>ransfer: expose <b>resources</b> (things) and let the HTTP method be the verb.', 'lam') },

  { t: 'The one idea: nouns, not verbs', to: true, giua: true, body: vsd(
    `<div style="font-family:monospace;font-size:26px;line-height:1.9">POST /getNotes<br>POST /createNote<br>POST /deleteNote?id=42<br>POST /notes/42/updateTitle</div>`,
    `<div style="font-family:monospace;font-size:26px;line-height:1.9">GET /notes<br>POST /notes<br>DELETE /notes/42<br>PATCH /notes/42</div>`,
    '✗ Verbs hidden in the URL', '✓ Noun in the URL, verb in the method') + box('Most bad APIs are bad for this one reason', 'They stuff the action into the URL, and every request becomes a POST.', 'do2') + box('Resource', 'a "thing" the API exposes: a note, a user, a comment. Plural noun, never an action.', 'lam') },

  { t: 'Why it matters more than looks', giua: true, body: baTang() + two(
    box('HTTP already gave methods a meaning', 'Proxies, browsers and SDKs all act on it, without reading your code.', 'lam'),
    box('POST /deleteNote', 'None of them can help you: the meaning is hidden in a string only your code understands.', 'do2')) },

  { t: 'Naming URLs: one router, eight routes', giua: true, body: two(js(ma('c6/rest-routes', 8, 17), { sm: true, hl: [1, 2, 3, 4, 5, 6, 7, 8] }), term(L('c6/rest-routes').split('\n').filter((l, i) => i % 2 === 1).join('\n'), { sm: true, title: 'curl × 8 · real: what Express matched' }), 'r64') + flow([{ t: '/notes', s: 'the collection', mau: NODE }, { t: '/notes/42', s: 'one item', mau: LAM }, { t: '/notes/42/comments', s: 'sub-collection', mau: CAM }], { h: 120, fs: 22 }) +
    box('Collection vs item', '<code class="i">/notes</code> = the collection. <code class="i">/notes/42</code> = one item. <code class="i">/notes/42/comments</code> = a sub-collection of that item.', 'xanh') },

  { t: 'Four naming rules that end the arguments', to: true, giua: true, body: cards([
    ['1 · Plural nouns', '<code class="i">/notes</code>, not <code class="i">/note</code>. Consistency beats grammar: pick plural, stop thinking.'],
    ['2 · Lowercase, hyphens', '<code class="i">/note-templates</code>, not <code class="i">/noteTemplates</code>. Paths are case-sensitive on the wire.'],
    ['3 · Nest one level at most', '<code class="i">/notes/42/comments</code> is fine. <code class="i">/users/7/notes/42/comments/9/likes</code>: expose <code class="i">/comments/9/likes</code>.'],
    ['4 · Filters go in the query', '<code class="i">/notes?tag=work&amp;pinned=true</code>, not <code class="i">/notes/tag/work/pinned/true</code>.'],
  ], 2) + box('Why filters belong in the query', 'Filters are optional and combine freely. Path segments are neither.', 'lam') },

  { t: 'Actions that are not CRUD', to: true, giua: true, body: two(cot(
    box('A sub-resource that reads as a noun', '<code class="i">POST /notes/42/publication</code><br>"create the publication of note 42"', 'xanh'),
    box('Or an action endpoint, when the noun gets awkward', '<code class="i">POST /notes/42/publish</code>', 'lam')), cot(
    box('This website', 'Restoring a deleted chat is <code class="i">POST /threads/:id/restore</code>. A pure-noun version would be harder to read and to find in the code.', ''),
    box('The rule', 'Use action endpoints rarely, and the same way everywhere. The goal is consistency, not purity.', 'xanh'))) +
    box('CRUD', 'Create, Read, Update, Delete: the four basic things you do to data. Publish, archive, send, retry are not among them.', 'lam') },

  { t: 'Two properties worth remembering', giua: true, body: bang(['Method', 'Safe?', 'Idempotent?', 'Meaning'], [
    ['GET · HEAD · OPTIONS', '✓', '✓', 'only reads'],
    ['PUT', '✗', '✓', 'make it exactly this'],
    ['DELETE', '✗', '✓', 'make it gone'],
    ['POST', '✗', '<b class="do">✗</b>', 'create a new one, every time'],
    ['PATCH', '✗', 'not guaranteed', 'change these fields'],
  ], { co: 22, hl: [3] }) + two(
    box('Safe', 'Changes nothing. Call it a thousand times: still harmless.', 'xanh'),
    box('Idempotent', 'Calling it N times leaves the SAME state as calling it once.', 'lam')) },

  { t: 'Experiment: call each one twice', giua: true, body: two(term(L('c6/idem', 1, 6).replace(/curl -s /g, 'curl '), { sm: true, title: 'POST twice · real (-s left out)', hl: [2, 4, 6] }), term(L('c6/idem', 7, 16).replace(/curl -s /g, 'curl '), { sm: true, title: 'PUT twice, DELETE twice · real', hl: [2, 4, 6, 8, 10] })) + nLan() },

  { t: 'DELETE twice: different codes, same state', to: true, giua: true, body: bang(['Call', 'Status', 'Note 1 after the call'], [['DELETE #1', '204 No Content', 'gone'], ['DELETE #2', '404 Not Found', 'gone'], ['DELETE #3, #4…', '404', 'gone']], { co: 23, hl: [1] }) + two(term(L('c6/idem', 11, 16), { title: 'curl · real', hl: [2, 4, 6] }), cot(
    box('Still idempotent', 'The status differs (204, then 404), but the STATE is the same: note 1 is gone either way.', 'xanh'),
    box('404 or 204 the second time?', 'Both are defensible. 404 says more; 204 is kinder to a client that retries. Pick one and document it.', 'lam'))) },

  { t: 'This is how customers get charged twice', to: true, giua: true, body: flow([
    { t: 'POST /payments', s: '📱 bad network', mau: LAM },
    { t: '✓ charged', s: 'payment #1 created', mau: NODE },
    { t: '✗ response lost', s: 'phone hears nothing', mau: DO },
    { t: 'SDK retries', s: 'same POST again', mau: CAM },
    { t: 'charged again', s: 'payment #2 💸', mau: DO },
  ], { h: 170, fs: 21 }) + box('Why', 'POST is not idempotent, and the server has no way to tell a retry from a new payment.', 'do2') + bang(['A client may retry automatically…', 'Why'], [['GET, HEAD, PUT, DELETE', 'idempotent: one more call leaves the same state'], ['POST, PATCH', '<b class="do">not by default</b>: one more call may create or change more']], { co: 22 }) + box('Until lesson 6.5 fixes it with Idempotency-Key', 'Never let a retrying client call a non-idempotent endpoint.', 'xanh') },

  { t: 'Exercise: name them, classify them', to: true, giua: true, body: two(`<div style="font-size:26px">Rewrite as resource + method, then say: safe? idempotent?<ol style="font-family:monospace;font-size:24px;line-height:1.7"><li>POST /getUserProfile?id=7</li><li>GET /notes/42/delete</li><li>POST /notes/42/addComment</li><li>POST /updateAvatar (full image)</li></ol></div>`,
    `<div data-k="dapan">${bang(['', 'Better', 'Safe', 'Idem.'], [['1', 'GET /users/7', '✓', '✓'], ['2', 'DELETE /notes/42', '✗', '✓'], ['3', 'POST /notes/42/comments', '✗', '✗'], ['4', 'PUT /users/7/avatar', '✗', '✓']], { co: 21 })}</div>`) +
    `<div data-k="dapan">${box('Number 2 is dangerous as GET', 'A crawler or a link preview that follows every link would delete your notes: GET must be safe.', 'do2')}</div>` + box('Two questions for each one', 'Does the URL name a THING? If I send it twice, does anything change more than once?', 'lam') },

  { t: 'Part 1: summary', to: true, giua: true, body: `<ul>
<li>URL = a noun (a resource); method = the verb</li>
<li>Plural, lowercase-hyphen, nest one level, filters in the query</li>
<li>Safe: GET, HEAD, OPTIONS. Idempotent: also PUT and DELETE. <b>Not POST.</b></li>
<li>Retries + POST = duplicates (charged twice)</li>
</ul>${flow([{ t: 'noun', s: '/notes/42', mau: NODE }, { t: 'method', s: 'GET PUT DELETE…', mau: LAM }, { t: 'promise', s: 'safe? idempotent?', mau: CAM }, { t: 'every layer acts', s: 'cache · Back · retry', mau: TIM }], { h: 130, fs: 21 })}${box('Part 2', 'PUT vs PATCH and the lost update, plus the two things Express gives you for free.', 'lam')}` },

  /* ───── 6.1b ───── */
  { t: 'PUT and PATCH', to: true, giua: true, body: two(
    box('PUT: "make it exactly this"', 'Fields you do not send are wiped. Idempotent by definition.', 'lam'),
    box('PATCH: "change these fields"', 'Fields you do not send stay as they are. Usually what a form needs.', 'xanh')) +
    term(L('c6/lost-update', 1, 2) + '\n' + L('c6/lost-update', 11, 12), { title: 'GET, then PUT with only a title · real', hl: [4] }) +
    box('Seen above, real', 'PUT with only <code class="i">title</code>: the <code class="i">body</code> field is gone. The server did exactly what it was told.', 'do2') },

  { t: 'The update everyone gets wrong', giua: true, body: bang(['Step', 'Person A', 'Person B', 'Note on the server'], [
    ['1', 'reads the note', 'reads the note', 'title "Original" · body "original body"'],
    ['2', 'changes the title, PUTs the WHOLE object', '', 'title "A changed the title"'],
    ['3', '', 'changes the body, PUTs the WHOLE (old) object', 'title "Original" · body "B changed the body"'],
  ], { co: 21, hl: [2] }) + term(L('c6/lost-update', 3, 8), { sm: true, title: 'curl · real', hl: [2, 4, 6] }) + box('A\'s change is GONE', 'This is the <b>lost update</b>.', 'do2') },

  { t: 'No error. No conflict. No log line.', to: true, giua: true, body: term(L('c6/lost-update', 15, 22), { sm: true, title: 'PATCH · real', hl: [4, 8] }) + two(
    box('PATCH limits the damage', 'A sends only the title, B only the body: both changes survive (first two calls).', 'xanh'),
    box('…but does not cure it', 'Two people on the SAME field still overwrite each other in silence (last two calls).', 'do2')) +
    box('The real cure, lesson 6.5', 'Optimistic concurrency with ETag + If-Match: the second writer gets a 412 instead of silently winning.', 'lam') },

  { t: 'Free gift 1: HEAD', to: true, giua: true, body: js(ma('c6/free', 4, 7), { sm: true, hl: [2] }) + two(
    term(L('c6/free', 1, 4), { title: 'curl -I (HEAD) · real', hl: [2, 4] }),
    term(ra('c6/free', 1, 2, 'server'), { title: 'server log · real', hl: [2] })) +
    box('You never wrote a HEAD route', 'Express answers HEAD with your GET route: it runs the handler, then drops the body. <code class="i">Content-Length</code> is still right.', 'xanh') +
    box('What clients use it for', 'Checking that something exists, or how big it is, without downloading it.', 'lam') },

  { t: 'Free gift 2: OPTIONS. Not free: 405', giua: true, body: two(term(L('c6/free', 5, 12), { title: 'curl OPTIONS · real', hl: [3, 8] }),
    box('No 405', 'Express matches method AND path together. DELETE on a GET-only path finds nothing: 404, not 405 Method Not Allowed.', 'do2')) +
    term(L('c6/free', 13, 16), { title: 'DELETE and POST on a GET-only path · real', hl: [2, 4] }) +
    box('Worth remembering', 'Someone debugging "404 on an endpoint that works in my browser" is almost always sending the wrong method.', 'xanh') },

  { t: '"The URL is right, I swear!"', to: true, giua: true, body: steps([
    'The browser address bar always sends <b>GET</b>. Your frontend may send POST or DELETE.',
    'Express answers a wrong method with <b>404</b>, exactly like a wrong path.',
    'So check the method first: DevTools → Network → the <b>Method</b> column.',
    'Then check the path, the prefix (<code class="i">/api/v1</code>) and the trailing segments.',
  ]) + term(L('c6/free', 13, 14), { title: 'the same path, the wrong method · real', hl: [2] }) + box('Debug habit', 'curl -i -X &lt;METHOD&gt; on the exact URL. If GET works and DELETE is 404, the route for DELETE does not exist.', 'lam') },

  { t: 'This website: the table, plus a few action endpoints', to: true, giua: true, body: two(term(ra('c6/website-routes'), { title: 'cuongthai.com · src/routes · real (read-only)', hl: [7, 8, 9, 10] }), cot(
    box('Resources follow the table', 'One noun, four methods: create, change, read, delete.', 'xanh'),
    box('A few deliberate action endpoints', 'Duplicate, restore. Easy to read, easy to find with grep.', 'lam'),
    box('Consistency over purity', 'An odd endpoint used the SAME way everywhere is fine. Ten different styles are not.', '')), 'r64') },

  { t: 'Turn a feature into a resource', to: true, giua: true, body: steps([
    'Name the <b>noun</b>, not the action: <code class="i">/notes</code>, not <code class="i">/getNotes</code>. The method carries the verb.',
    'Collections plural, items by id: <code class="i">GET /notes</code> lists, <code class="i">GET /notes/12</code> reads one.',
    'Nest one level only: <code class="i">/notes/12/comments</code>. Link deeper things by id.',
    'Then pick the method by its promise: safe, idempotent, or neither. The method is a contract the internet acts on.',
  ]) + flow([{ t: 'noun', s: 'comments', mau: NODE }, { t: 'collection', s: '/notes/12/comments', mau: LAM }, { t: 'item', s: '/comments/9', mau: LAM }, { t: 'method', s: 'by its promise', mau: CAM }], { h: 130, fs: 21 }) + box('Contract', 'a promise both sides rely on. Break it and someone else\'s code breaks.', 'lam') },

  { t: 'Exercise: design the comments feature', to: true, giua: true, body: two(`<div style="font-size:27px;line-height:1.5">Notes get comments. Users can:<ol><li>list a note's comments</li><li>add one</li><li>edit the text of their comment</li><li>delete it</li><li>like a comment</li></ol>Write the five routes.</div>`,
    `<div data-k="dapan">${js(`GET    /notes/42/comments
POST   /notes/42/comments
PATCH  /comments/9
DELETE /comments/9
POST   /comments/9/likes`, { sm: false })}${box('Why /comments/9, not /notes/42/comments/9', 'A comment has its own id: one level of nesting is enough.', 'xanh')}</div>`) + box('Like = a sub-resource', 'POST creates a like, DELETE /comments/9/likes/me removes it. No verb in the URL.', 'lam') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why is <code class="i">DELETE</code> idempotent even though the second call returns 404?</li>
<li>Two people PUT the same note one after the other. What goes wrong, and why does nobody notice?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Idempotent is about STATE: the note is gone after one call or two. &nbsp; 2. The second PUT carries an old copy and wipes the first change: a lost update. No error, no log line.', 'xanh')}</div>
<ul>
<li>Nouns in URLs, verbs in methods, four naming rules</li>
<li>Safe vs idempotent: tested, not memorised</li>
<li>PUT replaces, PATCH changes fields; neither stops a lost update</li>
<li>HEAD and OPTIONS are free; 405 is not</li>
</ul>
${box('Next', 'Lesson 6.2: status codes and one response shape.', 'lam')}` },
]);
