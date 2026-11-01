/**
 * auth-00-1 — Authentication · Section 0 · Lesson 0.1 "A protocol that forgets everything" (01/11/2026).
 * Slug bài: auth-0-1-giao-thuc-quen. Output = _ma.mjs của s00 (demo0/forget.js chạy thật, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, steps, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s00/_ma.mjs';

export const deck = { key: 'auth-00-1', code: 'AUTH 0.1', title: 'A protocol that forgets everything', sub: 'Three ways to remember a user — two fail' };

export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a setup that runs', bai: '0.1' }, [
  { cover: true, t: 'A protocol that<br>forgets everything', sub: 'Section 0 · Lesson 0.1 — three ways to remember a user, measured' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A raw HTTP request has <b>no “who”</b> in it</li>
    <li>Why an <b>IP address</b> cannot identify a user — measured</li>
    <li>Why a <b>TCP connection</b> cannot either — measured</li>
    <li>The one design that works: <b>the client carries proof</b></li>
    <li>Its price — a bearer credential — and the map of the whole course</li></ul>` },
  { t: 'A canteen whose cashier forgets every face', body: cards([
      ['The problem', 'You pay at the till, walk to the counter — and the cook has no idea you paid.'],
      ['The fix', 'A <b>receipt</b>. You carry the slip; whoever holds the slip gets the food.'],
      ['The catch', 'The cook checks the slip, never the face. <b>Lose the slip, lose your lunch.</b>'],
    ], 3) + steps([
      'HTTP is the forgetful cashier: every request arrives from a stranger',
      'Cookies, session ids and tokens are the receipt',
      'Everything in this course is about issuing, checking and expiring that receipt',
    ]) },
  { t: 'What the server actually receives', body: two(sh(OUT['01-raw'], { title: 'GET /raw — plain curl', sm: false }),
      sh(OUT['01-raw-trinh-duyet'].split('\n').slice(1).join('\n'), { title: 'curl pretending to be a browser', sm: false })) +
      box('No field called “user”', `A method, a path, ${c('Host')} and headers the client <b>chose</b> to send. MDN: “HTTP is stateless: there is no link between two requests being successively carried out on the same connection.”`, 'lam') },
  { t: 'Try 1: remember people by IP address', body: sh([OUT['01-ip-an'], OUT['01-ip-binh'], OUT['01-ip-4g']].join('\n'), { title: 'An signs in · Bình asks (same machine) · An asks via 127.0.0.1' }) + two(js(`const byIp = new Map();
app.post('/ip/sign-in', (req, res) => {
  byIp.set(req.ip, req.body.name);
  …
});
app.get('/ip/me', (req, res) =>
  res.json({ you: byIp.get(req.ip) ?? null }));`, { sm: true, hl: [3, 7] }),
      `<div>${box('Wrong person', 'Bình asked from the same machine and was told she is An.', 'do2')}${box('Lost person', 'An reached the server through another address and became nobody.', 'do2')}</div>`) },
  { t: 'Why IP fails on real networks', body: cards([
      ['Shared', 'A dorm Wi-Fi, a café, a campus: hundreds of people behind one public address.'],
      ['Carrier-Grade NAT', `Mobile carriers share addresses too — RFC 6598 reserves ${c('100.64.0.0/10')} for it.`],
      ['Moving', 'Wi-Fi → 4G changes the address in the middle of a session.'],
    ], 3) + box('IP is a signal, not an identity', 'Useful for <b>risk</b> (“new country — look twice”) and rate limits (Chapter 10). Never as proof of who someone is.', 'xanh') },
  { t: 'Try 2: remember people by connection', body: js(`app.post('/conn/sign-in', (req, res) => { req.socket.who = req.body.name; … });
app.get('/conn/me', (req, res) => res.json({ you: req.socket.who ?? null }));`, { sm: true }) +
      sh([OUT['01-conn-cung'].replace(" --next -s -w '\\n' localhost:4800/conn/me", ' --next … /conn/me'), OUT['01-conn-moi']].join('\n'), { title: 'one curl run (2 requests), then a new curl' }) +
      two(box('Lives seconds', 'Port 60295 remembered; the next connection (60296) forgot. Node closes idle keep-alive after 5 s.', 'do2'),
        box('Mixes users', 'A proxy or load balancer carries <b>many users</b> over one upstream connection.', 'do2')) },
  { t: 'Try 3: the client carries proof', body: two(js(`const cards = new Map();
app.post('/card/sign-in', (req, res) => {
  const card = randomBytes(16)
    .toString('base64url');
  cards.set(card, req.body.name);
  res.json({ card });
});
app.get('/card/me', (req, res) => res.json(
  { you: cards.get(req.get('x-card')) ?? null }));`, { sm: true, hl: [3, 9] }),
      `<div>${sh(OUT['01-card'].split('\n').slice(1).join('\n'), { title: 'card, then /card/me ×2 with it, ×1 without', sm: false })}${box('It works', 'Any connection, any address. The card is a <b>credential</b>: a session id in a cookie (Ch3) or a signed token (Ch4).', 'xanh')}${box('16 random bytes', `From ${c('node:crypto')} — never ${c('Date.now()')} or ${c('Math.random()')} (lesson 0.3, lesson 1.2).`, 'lam')}</div>`, 'r64') },
  { t: 'Three tries, compared', body: `<table class="t"><tr><th>Try</th><th>Server keys on</th><th>Measured</th><th>Verdict</th></tr>
    <tr><td>1 · IP address</td><td>${c('req.ip')}</td><td>Bình became An; An on 127.0.0.1 became nobody</td><td>❌ wrong + lost</td></tr>
    <tr><td>2 · TCP connection</td><td>${c('req.socket')}</td><td>port 60295 remembered, 60296 forgot</td><td>❌ seconds; proxies mix</td></tr>
    <tr><td>3 · Card the client carries</td><td>${c('x-card')} header</td><td>recognised on every request</td><td>✅ works — holder = you</td></tr></table>` +
      box('The rule that follows', 'State lives on the server (a session) or inside a signed token — <b>never in the protocol</b>. The client must bring proof every time.', 'lam') },
  { t: 'The price: whoever holds the card is you', body: sh(OUT['01-thuc-hanh'].split('\n').slice(1).join('\n'), { title: 'An and Bình sign in; then Bình sends An’s card' }) + cards([
      ['Copy = identity', 'Stealing it is the goal of most attacks (Ch10). Lesson 1.1 measures where copies leak.'],
      ['Sent for you', 'Browsers attach cookies even to requests another site caused: CSRF (Ch3).'],
      ['Readable by JS', 'In localStorage, any script on the page reads it (lesson 0.3).'],
      ['Never expires', 'Our Map keeps every card forever. Expiry is a feature you build (Ch3, Ch5).'],
    ], 4) },
  { t: 'The whole course on one map', body: steps([
      '<b>Once</b> — prove who you are, receive a credential: password (Ch2), second factor and passkey (Ch7), another provider via OIDC (Ch8)',
      '<b>Every request</b> — present it, the server verifies it: session (Ch3) or signed token (Ch4), on primitives from Ch1; then “may you?” (Ch9)',
      '<b>Eventually</b> — expire, rotate, revoke: refresh (Ch5), account lifecycle (Ch6), running it (Ch11)',
    ]) + box('Trap: “we will add authentication later”', 'It decides your data model, routes, caching and every test fixture. Adding it at the end touches every file that reads data.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A raw request has a method, a path and headers — no “who”</li>
    <li>IP: wrong person <b>and</b> lost person · connection: lives seconds</li>
    <li>What works: the client carries a random credential, the server looks it up</li>
    <li>Its price: <b>whoever holds it is you</b> — a bearer credential</li>
    <li>Next — 0.2: “login” hides three different problems</li></ul>` },
]);
