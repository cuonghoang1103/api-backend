/**
 * auth-01-1 — Authentication · Chapter 1 · Lesson 1.1 "Whoever holds it, is you" (01/11/2026). Slug bài: auth-1-1-tin-vat-mang-theo.
 * Output = _ma.mjs của s01 (LabFlow ID chạy thật, Node 22.23.3, Chromium 156.0.8078.4, env -i). Token dài cắt bằng …
 */
import { lamDeck, js, sh, http, two, box, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s01/_ma.mjs';

export const deck = { key: 'auth-01-1', code: 'AUTH 1.1', title: 'Whoever holds it, is you', sub: 'Bearer credentials and where a copy travels' };

const cut = (t) => t.replace(/(lfid_reset_)[A-Za-z0-9_-]+/g, '$1lc-NO…').replace(/(lfid_ses_)[A-Za-z0-9_-]{8,}/g, '$1…');
const LOG = OUT['11-log-labflow'].split('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — Credentials and primitives', bai: '1.1' }, [
  { cover: true, t: 'Whoever holds it,<br>is you', sub: 'Chapter 1 · Lesson 1.1 — bearer credentials, and where a copy travels' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 1</b>: tokens nobody can guess, safe comparison, hash vs MAC vs signature, where secrets leak — then Lab 1 builds ${c('src/crypto/')}</li>
    <li>What <b>bearer</b> means, shown on LabFlow ID</li>
    <li>Where a token in a URL ends up — real Chromium 156</li>
    <li>Designing for the copy: TLS, lifetime, scope, revocation</li>
    <li>The attackers you will actually meet; DPoP, mTLS, passkeys</li></ul>` },
  { t: 'A cinema ticket is a bearer credential', body: cards([
      ['The door', 'checks the ticket is <b>genuine and unused</b> — never whose pocket it came from'],
      ['You drop it', 'someone else watches the film, and you do not'],
      ['On the web', 'session cookies, JWTs, API keys, reset links: <b>presenting the value is the proof</b>'],
    ], 3) + box('RFC 6750 §1.2 (2012)', '“Any party in possession of the token (a ‘bearer’) can use the token in any way that any other party in possession of it can.” Using it “does not require a bearer to prove possession of cryptographic key material”.', 'lam') },
  { t: 'One token, two machines', body: js(`app.get('/me', (req, res) => {
  const who = tokens.get(
    (req.get('authorization') ?? '').replace(/^Bearer /, ''));
  if (!who) return res.status(401).json({ error: 'UNAUTHENTICATED' });
  res.json({ you: who });
});`, { sm: true, hl: [2] }) + sh(['$ curl … /sign-in … ; curl … /me -H "Authorization: Bearer $T"', ...OUT['11-an'].split('\n').slice(1),
      '$ curl http://127.0.0.1:4800/me -A "… Firefox/140.0" -H "Authorization: Bearer $T"', OUT['11-ke-cap'].split('\n')[1],
      '$ curl http://127.0.0.1:4800/me -A "… Firefox/140.0" -H "Authorization: Bearer ${T}x"', OUT['11-ke-cap'].split('\n')[2]].join('\n'), { title: 'terminal — copied to a second machine' }) },
  { t: 'The server’s view: which one is An?', body: sh(LOG.slice(0, 6).join('\n'), { title: 'node demo1/bearer.js — access log' }) +
      two(box('Indistinguishable', 'The two <b>GET /me 200</b> lines are equally valid. They differ only in IP and user agent — and lesson 0.1 showed neither is identity.', 'do2'),
        box('No trace', 'Copying a token changes nothing for the owner. Account takeover often goes unnoticed for weeks.', 'lam')) },
  { t: 'Almost everything is bearer', body: cards([
      ['Bearer', 'session ids · JWT access tokens · refresh tokens · API keys · reset &amp; magic links · OAuth tokens · webhook secrets · a DATABASE_URL'],
      ['Sender-constrained', '<b>DPoP</b> (RFC 9449), <b>mTLS</b> (RFC 8705): the token <b>plus</b> a key the thief does not have'],
      ['No copyable secret', '<b>Passkeys</b>: the private key never leaves the authenticator; the server gets a fresh signature (Chapter 7)'],
    ], 3) + box('So design for leakage', 'Not “how do I make it unstealable” — you cannot — but: what can a copy do, for how long, and how would I stop it?', 'xanh') },
  { t: 'Design for the copy that will exist', body: cards([
      ['1 · TLS everywhere', 'over plain HTTP every hop reads the token — staging and “internal” traffic included'],
      ['2 · Lifetime', '15-minute access token (LabFlow, API Design 6.1) = an incident; 30 days = a breach. Needs a renewal path (Ch5)'],
      ['3 · Scope', 'a key that reads one user’s bookings is worth far less than one that does anything'],
      ['4 · Revocation', 'build the off switch before the day you need it — sessions (Ch3), signed tokens (Ch4–5)'],
    ], 2) },
  { t: 'Experiment: a reset link with the token in the URL', body: two(js(`app.get('/reset', (req, res) => {
  if (req.query.policy)
    res.set('Referrer-Policy', req.query.policy);
  res.type('html').send(\`…
<script src="/static/app.js"></script>
<img src="http://127.0.0.1:4801/pixel.gif">…\`);
});`, { hl: [3, 5, 6] }), box('The experiment', 'Real Chromium ' + c('156.0.8078.4') + ' (Playwright) opens ' + c('/reset?token=lfid_reset_…') + ' four times: no policy, ' + c('no-referrer-when-downgrade') + ', ' + c('unsafe-url') + ', ' + c('no-referrer') + '. The page loads its own script and a third-party pixel — like most real pages.', 'lam')) +
      http(cut(OUT['11-log-third']).split('\n').slice(1).join('\n'), { title: 'node demo1/third-party.js — what the analytics server received', wrap: true, sm: false }) },
  { t: 'What each Referrer-Policy leaked', body: `<table class="t"><tr><th>Policy on the reset page</th><th>Same-origin script</th><th>Third-party pixel</th></tr>
    <tr><td>none — default ${c('strict-origin-when-cross-origin')}</td><td><b>full URL + token</b></td><td>origin only</td></tr>
    <tr><td>${c('no-referrer-when-downgrade')} (default before Chrome 85)</td><td><b>full URL + token</b></td><td><b>full URL + token</b></td></tr>
    <tr><td>${c('unsafe-url')}</td><td><b>full URL + token</b></td><td><b>full URL + token</b></td></tr>
    <tr><td>${c('no-referrer')}</td><td>none</td><td>none</td></tr></table>` +
      two(box('Correction', 'Since Chrome 85 (Aug 2020) third parties get only the origin by default. Your <b>access log</b> still recorded the full URL on all 4 visits.', 'do2'),
        box('Do this', 'Avoid tokens in URLs. Email links: single-use, short expiry, ' + c('Referrer-Policy: no-referrer') + ', exchange for a cookie at once (Ch6).', 'xanh')) },
  { t: 'Who the attacker really is', body: cards([
      ['Another user', 'changes an id in the URL (0.2) — the most common, no tools'],
      ['A script on your page', 'XSS, an npm package, a tag, an extension (0.3 read localStorage)'],
      ['A breach list', 'credential stuffing: millions of pairs, everywhere (Ch2, Ch10)'],
      ['A phishing page', 'relays password + code in real time; passkeys stop it (Ch7)'],
      ['A copy of your data', 'backups, log archives — why tokens are digests (1.3), passwords slow-hashed (Ch2)'],
      ['Rarely: broken crypto', 'nobody factors your key; they find it in a log or in git (1.5)'],
    ], 3) },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Bearer: possession is the proof — the server cannot tell owner from thief</li>
    <li>Design for leakage: TLS, short lifetime, narrow scope, revocation</li>
    <li>Tokens in URLs reach logs and same-origin Referers even by default</li>
    <li>The usual attacker is another user, a script, a breach list, a phishing kit</li>
    <li>Next — 1.2: randomness, and how many bits is enough</li></ul>` },
]);
