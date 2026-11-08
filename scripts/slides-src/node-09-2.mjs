/**
 * node-09-2 — Node.js · Chapter 9 · Lesson 9.2 "XSS: from a stranger's note to your session" (slide EN, đợt 8 — 01/11/2026).
 * MỘT deck, HAI tập: node-9-2 (slide 1–12) · node-9-2-2 (slide 13–27).
 *   A: XSS là chuyện backend lưu + frontend chạy · ba dạng một nguyên nhân · phép đo 1 trong CHROMIUM THẬT (web dùng jsdom): lần 1 cookie bay,
 *      lần 2 httpOnly ⇒ chuỗi rỗng, lần 3 sanitize ⇒ không gì · lần 4 payload DÙNG cookie (delete-all 1 lần) · lần 5 CSP script-src 'self' (0 lần) · bán kính vụ nổ
 *   B: chín payload × năm cách (thật, nguy hiểm hay không do Chromium phán) · bộ lọc tự chế tự tạo ra thẻ script · escape hay sanitize ·
 *      giá (thật: 0,100 / 0,798 / 7,018 ms) · chạy ở đâu · lúc ghi hay lúc đọc · website này (95 chỗ dangerouslySetInnerHTML, đếm thật) · bốn đường quay lại ·
 *      CSP đỡ · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-9-2-xss-va-sanitize. Output THẬT: that/c9/{xss-browser,payloads,sanitize-cost}.
 * Khác web: Chromium 149 thay jsdom · thêm lần 5 (CSP) · 9 payload đủ (web in 6) · giá 7,0 ms / 70× / 8,8× (web 12,2 ms / 58× / 13,5×, máy khác).
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-09-2', code: 'NODE 9.2', title: 'XSS: from a stranger\'s note to your session', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const cost = (n) => Number(dong('c9/sanitize-cost', new RegExp('^' + n)).match(/([\d.]+) ms/)[1]);

export const slides = lamDeck({ chuong: 'Chapter 9 — Application security', bai: '9.2' }, [
  { cover: true, t: 'XSS: from a stranger\'s note<br>to your session', sub: 'Your backend stores some text. Your frontend runs it. Measured in a real browser.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A stored XSS end to end in a real Chromium: the cookie leaves, then httpOnly, then the real fix</li>
<li>Why httpOnly is not the fix — a payload that uses the cookie instead of reading it</li>
<li>Nine payloads through five ways of handling them, judged by a real browser</li>
<li>Escape or sanitise? One question decides it — and what sanitising costs</li>
<li>Sanitise on write or on read, and the four ways XSS comes back</li>
</ul>` + box('Why it matters to you', 'An injected script runs inside the user\'s session, with their cookie and their permissions. Whatever the user can do, the script can do.', 'lam') },

  { t: 'Not a browser problem', to: true, giua: true, body: flow([
    { t: 'a stranger posts', s: 'a note with &lt;script&gt;', mau: DO }, { t: 'your backend', s: 'stores the text', mau: LAM }, { t: 'your frontend', s: 'renders it as HTML', mau: CAM }, { t: 'every visitor', s: 'runs the stranger\'s code', mau: DO }], { h: 150 }) +
    two(box('The name misleads', '"Cross-site scripting" sounds like a browser issue, and every demo is alert(1).', 'cam'),
      box('What it really is', 'Data crossing a boundary into a context where it is READ AS CODE. Two of the three steps above are yours.', 'do2')) +
    cards([['Read the page', 'Private notes, messages, the CSRF token in a form.'], ['Act as the user', 'Call your API with the user\'s cookie: delete, transfer, change the email.'], ['Watch the user', 'Log keystrokes in the login form, swap a link, fake a "session expired" box.']], 3) },

  { t: 'Three forms, one root cause', to: true, giua: true, body: bang(['form', 'where the payload lives', 'what it needs'], [
    ['Stored', 'your database: a note, a comment, a display name', 'nothing — it fires for EVERY visitor'],
    ['Reflected', 'the URL, printed back: /search?q=…', 'a victim who clicks the link'],
    ['DOM-based', 'client JavaScript writing untrusted data into innerHTML', 'the server is not even involved'],
  ], { co: 22, hl: [0] }) + box('Stored is the worst', 'No link, no phishing, no action: the victim just opens the page they open every day.', 'do2') +
    box('One cause for all three', 'Untrusted data reaching a place where the browser parses it as markup or script.', 'lam') },

  { t: 'Measurement 1: three processes, a real browser', to: true, giua: true, body: flow([
    { t: 'attacker\'s server :4302', s: 'logs whatever arrives', mau: DO }, { t: 'Notes board :4301', s: 'renders saved notes', mau: LAM }, { t: 'victim: Chromium 149', s: 'logged in, cookie set', mau: NODE }], { h: 140 }) +
    JW(ma('c9/xss-browser', 29, 29), 92, [1]) + JW(ma('c9/xss-browser', 22, 26), 88, [2, 3])
  },

  { t: 'Three runs, one change each', to: true, giua: true, body: TT('c9/xss-browser', 2, 13, 'node xss-browser.mjs · Chromium 149 · real', { hl: [4, 8, 12], n: 104 }) +
    bang(['run', 'what changed', 'result'], [['1', 'raw render, normal cookie', 'session token arrives at the attacker'], ['2', 'raw render, httpOnly cookie', 'script runs, reads ""'], ['3', 'sanitize-html + httpOnly', 'no &lt;script&gt; element, nothing sent']], { co: 20, hl: [0] }) },

  { t: 'Run 1 is a full account takeover', to: true, giua: true, body: T(dong('c9/xss-browser', /received: \["session/), 'attacker\'s server log · real', { sm: false }) +
    two(box('The attacker now holds', 'A valid session token of a user who did nothing but open a page.', 'do2'),
      box('The console error is a red herring', 'Chromium blocked the script from READING the answer from :4302 (CORS, lesson 9.1). The request — with the cookie in the URL — had already left.', 'cam')) +
    box('And it fires for everyone', 'Every visitor of the board, every time, until someone deletes the note.', 'do2') },

  { t: 'httpOnly is not the fix', to: true, giua: true, body: J("<script>var x=new XMLHttpRequest();\n  x.open('POST','/notes/delete-all'); x.send()</script>", { sm: false, hl: [2] }) +
    TT('c9/xss-browser', 14, 16, 'run 4 · same victim, same httpOnly cookie · real', { hl: [3], n: 100 }) +
    two(box('The payload never reads the cookie', 'It calls your API from your page. The browser attaches the session cookie itself — same origin.', 'do2'),
      box('XSS = code running IN the victim\'s session', 'httpOnly narrows the blast radius (no token to take home). It does not stop the blast.', 'cam')) +
    flow([{ t: 'script in the page', s: 'no cookie access', mau: DO }, { t: 'POST /notes/delete-all', s: 'same origin', mau: CAM }, { t: 'browser adds the cookie', s: 'httpOnly or not', mau: LAM }, { t: 'server: valid session', s: 'deletes everything', mau: DO }], { h: 130 }) },

  { t: 'CSP catches what you missed', to: true, giua: true, body: J("res.set('Content-Security-Policy', \"script-src 'self'\");", { sm: false }) +
    TT('c9/xss-browser', 17, 20, 'run 5 · same stored note, raw render, plus CSP · real', { hl: [3, 4], n: 100 }) +
    two(box('Still in the DOM', 'The &lt;script&gt; element is there (1). The browser refuses to execute it.', 'lam'),
      box('An independent second line', 'Lesson 9.1: this is why configuring CSP is worth the effort even when your sanitiser should have been enough.', 'xanh')) },

  { t: 'Five runs, five lessons', to: true, giua: true, body: bang(['run', 'outcome', 'lesson'], [
    ['1 raw · cookie', 'token stolen', 'stored XSS = account takeover'],
    ['2 raw · httpOnly', 'script ran, read ""', 'httpOnly hides the token, not the script'],
    ['3 sanitised', 'nothing ran', 'the real fix is before the DOM'],
    ['4 raw · httpOnly · uses the cookie', 'data deleted', 'the session is the weapon'],
    ['5 raw · CSP', 'refused', 'a second, independent line'],
  ], { co: 21, hl: [2] }) + box('Where the fix lives', 'The payload must never reach the DOM as a tag. Everything else limits the damage.', 'xanh') +
    box('Order of work', '1. escape / sanitise every place user text meets HTML · 2. httpOnly cookies · 3. a CSP without unsafe-inline where you can.', 'lam') },

  { t: 'Blast radius', to: true, giua: true, body: flow([
    { t: 'no defence', s: 'token + session', mau: DO }, { t: '+ httpOnly', s: 'session only', mau: CAM }, { t: '+ CSP', s: 'inline script refused', mau: LAM }, { t: 'sanitise / escape', s: 'no script at all', mau: NODE }], { h: 150 }) +
    cards([
      ['httpOnly', 'Cheap, always on. Stops the token from leaving. Does not stop actions.'],
      ['CSP', 'Stops inline and foreign scripts if you can avoid unsafe-inline.'],
      ['Escape / sanitise', 'The only one that removes the hole itself.'],
    ], 3) + box('Defence in depth, measured', 'Each layer above stopped something real in the five runs — and only one of them stopped everything.', 'lam') },

  { t: 'Part 1 in one line', to: true, giua: true, body: box('Stored XSS', 'A stranger\'s text that your page runs, inside every visitor\'s session — measured in Chromium: token stolen (1), data deleted despite httpOnly (4), stopped by sanitising (3) or by CSP (5).', 'do2') +
    two(box('Next: what actually removes the script', 'Nine payloads, five ways of handling them, judged by a real browser.', 'lam'),
      box('And what it costs', 'escape vs sanitize-html vs DOMPurify on the same 12 KB, and where to run each.', 'lam')) +
    T('5) raw render again, but CSP script-src \'self\'\n   → POST /notes/delete-all called 0 time(s) with the victim\'s cookie', 'the result to remember · real', { sm: false }) +
    flow([{ t: 'stored text', s: 'a stranger\'s note', mau: DO }, { t: 'escape / sanitise', s: 'part 2', mau: NODE }, { t: 'CSP', s: 'second line', mau: LAM }, { t: 'httpOnly', s: 'smaller blast', mau: CAM }], { h: 120 }) },

  { t: 'Measurement 2: nine payloads, five ways', to: true, giua: true, body: JW(ma('c9/payloads', 8, 12), 92, [2]) +
    cards([
      ['escape', 'Turn &lt; &gt; &amp; " \' into entities. The text is shown, never parsed.'],
      ['home-made filter', 'One regex that deletes &lt;script&gt;…&lt;/script&gt;. Everybody has written it.'],
      ['sanitize-html / DOMPurify', 'Parse to a tree, drop everything not on an allow-list, serialise back.'],
    ], 3) + box('Judged by a real browser', 'Each output is rendered in Chromium 149; it counts as dangerous if the page ends up with a script, an on* handler, a javascript: URL or a scripted iframe.', 'lam') },

  { t: 'img onerror and the nested script', to: true, giua: true, body: TT('c9/payloads', 8, 19, 'node payloads.mjs · real', { hl: [4, 10], n: 100 }) +
    box('The filter wrote the script itself', 'The input had no valid &lt;script&gt;. The regex removed everything from the inner &lt;script&gt; to the first &lt;/script&gt;; the outer fragments &lt;scr + ipt&gt; joined into a brand-new &lt;script&gt; tag.', 'do2') },

  { t: 'svg, javascript: and upper case', to: true, giua: true, body: TT('c9/payloads', 20, 37, 'node payloads.mjs · real', { hl: [4, 10, 16], n: 100 }) },

  { t: 'iframe, mutation XSS, and valid content', to: true, giua: true, body: TT('c9/payloads', 38, 58, 'node payloads.mjs · real', { hl: [10, 19, 21], n: 100 }) },

  { t: 'The tally', to: true, giua: true, body: thanh([
    ['escape', 0.15, NODE, '0 of 9 dangerous'], ['home-made', 6, DO, '6 of 9 still run'], ['sanitize-html', 0.15, NODE, '0 of 9'], ['DOMPurify', 0.15, NODE, '0 of 9'],
  ], { ghi: 'dangerous outputs out of 9 payloads · Chromium 149 · real' }) +
    two(box('"I wrote a filter" is a warning, not a reassurance', 'HTML is not a regular language. Every filter ever written has lost this race.', 'do2'),
      box('Sanitising is not "drop all HTML"', 'The valid note passes both sanitisers untouched: keep markup that carries MEANING, drop markup that carries BEHAVIOUR.', 'xanh')) },

  { t: 'Escape or sanitise? Answer one question', to: true, giua: true, body: two(
    box('Is the field plain text?', 'Display name, title, comment, city. Escape — or better, let the framework do it: React\'s {value} escapes, so does every template engine\'s {{ }}. Here you almost cannot get XSS.', 'xanh'),
    box('MUST it carry formatting?', 'Rich-text editor output, rendered markdown, imported articles. Escaping would break it, so you sanitise.', 'lam')) +
    box('There is no third option', '"Strip the dangerous bits with a regex" is not a category. You just measured it: 6 of 9.', 'do2') +
    flow([{ t: 'plain text?', mau: LAM }, { t: 'yes → escape', s: 'framework default', mau: NODE }, { t: 'no → sanitise', s: 'allow-list parser', mau: CAM }], { h: 120 }) },

  { t: 'Measurement 3: what sanitising costs', to: true, giua: true, body: TT('c9/sanitize-cost', 2, 5, 'node sanitize-cost.mjs · the same 12.2 KB, 200 runs, median · real', { hl: [3, 4], sm: false, n: 90 }) +
    thanh([['escape', cost('escape'), NODE, cost('escape') + ' ms'], ['sanitize-html', cost('sanitize-html'), CAM, cost('sanitize-html') + ' ms'], ['DOMPurify', cost('DOMPurify'), DO, cost('DOMPurify') + ' ms']], { ghi: 'ms per 12.2 KB document · this machine' }) +
    box('Numbers move between machines; the ratios do not', 'Here DOMPurify costs about 70× escape and 9× sanitize-html. The lesson page measured 12.2 ms on another machine — same order, same conclusion.', 'lam') },

  { t: 'The cost is about WHERE, not whether', to: true, giua: true, body: two(
    box('On the server', 'DOMPurify builds a whole jsdom document. ~7 ms of CPU per render on the event loop (chapter 2): ~140 renders a second fill one core.', 'cam'),
    box('In the browser', 'The DOM is already there; the same call is far cheaper and costs your server nothing.', 'xanh')) +
    bang(['tool', 'good fit'], [['escape', 'every plain-text field, everywhere'], ['sanitize-html', 'server-side, explicit allow-list, cheap'], ['DOMPurify', 'in the browser; or server-side when the volume is small']], { co: 22 }) },

  { t: 'Sanitise on write, or on read?', to: true, giua: true, body: two(
    box('On write', 'Cheap — once per post. But the original is gone forever, and today\'s rules are the rules you live with forever.', 'cam'),
    box('On read (render)', 'More expensive — every render. But rules can change, and a library fix protects OLD data too.', 'xanh')) +
    box('Why to lean toward render', 'Sanitiser bypasses are always discovered AFTER your data is stored. A mutation-XSS fixed in DOMPurify next month protects old rows only if you sanitise at display time.', 'lam') +
    flow([{ t: 'day 0', s: 'row stored, "clean" by v1', mau: LAM }, { t: 'day 30', s: 'bypass published', mau: DO }, { t: 'v2 released', s: 'you upgrade', mau: CAM }, { t: 'render-time sanitise', s: 'old rows safe again', mau: NODE }], { h: 130 }) },

  { t: 'This website', to: true, giua: true, body: J(`import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty);
}`, { hl: [1, 5] }) + cards([
      ['At render time', 'Exp Hub notes and explanations, tech-trends bodies, the rich-text preview.'],
      ['isomorphic-dompurify', 'Same import in client components and during SSR (jsdom on the server).'],
      ['One dangerous element? Give it a field', 'YouTube is not allowed through HTML: Exp Hub has a typed youtubeUrl and builds its own iframe.'],
    ], 3) + box('Counted 01/11/2026: 95 dangerouslySetInnerHTML in the frontend', 'Most pour HTML the code itself produced (JSON-LD, highlighted code, mermaid SVG). Every new one must answer: can this string ever contain a user\'s text?', 'cam') },

  { t: 'Four ways it comes back after you "fixed" it', to: true, giua: true, body: cards([
    ['1 · element.innerHTML = data', 'Anywhere in client code. The server never even took part.'],
    ['2 · markdown renderers', 'The default passes raw HTML straight through. Markdown is not a sanitiser.'],
    ['3 · data in a script tag', '<code class="i">&lt;script&gt;window.__DATA__ = {"bio":"…"}</code> breaks out the moment a value contains <code class="i">&lt;/script&gt;</code>.'],
    ['4 · attributes you build', 'A string-concatenated href happily takes javascript:.'],
  ], 2) + J("// frontend/src/app/courses/[slug]/page.tsx — this website, case 3 done right\n<script type=\"application/ld+json\"\n  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />", { hl: [3] }) +
    box('Why \\u003c', 'A JSON string may legally contain &lt;/script&gt;. Escaping every &lt; means the HTML parser can never see a closing tag inside your data.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: J("app.get('/search', (req, res) => {\n  res.send(`<h1>Results for ${req.query.q}</h1>`);\n});", { sm: false, hl: [2] }) +
    box('Exercise', 'Which of the three forms is this? Write the URL an attacker would send, then fix it — escape or sanitise, and why?', '') +
    `<div data-k="dapan">${box('Answer', 'Reflected XSS: <code class="i">/search?q=&lt;img src=x onerror=…&gt;</code> runs when the victim clicks the link. The query is plain text, so escape it (or render it through a template/React that escapes by default). Sanitising would be the wrong tool here.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Why is stored XSS worse than reflected?</li>
<li>The cookie is httpOnly. What can an injected script still do?</li>
<li>Why did the home-made filter produce a working &lt;script&gt;?</li>
<li>A display name: escape or sanitise?</li>
<li>Why sanitise at render time rather than on write?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. It needs no link and fires for every visitor. &nbsp;2. Call your API inside the victim\'s session (run 4). &nbsp;3. One replace on nested input glued two halves into a tag. &nbsp;4. Escape (plain text). &nbsp;5. Library fixes then protect old data too.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>XSS = your backend stores text, your frontend runs it — inside the victim\'s session</li>
<li>Chromium 149: token stolen; httpOnly still deleted data; sanitising and CSP stopped it</li>
<li>Home-made filter: 6 of 9 payloads still run; escape / sanitize-html / DOMPurify: 0</li>
<li>Plain text → escape; formatting → sanitise with an allow-list; never regex</li>
<li>DOMPurify ≈ ${cost('DOMPurify')} ms per 12 KB on the server — prefer the browser; sanitise at render</li>
</ul>` + box('Next: lesson 9.3', 'Input as the enemy: 31 characters that freeze the server, one JSON key that makes everyone admin, and SSRF.', 'lam') },
]);
