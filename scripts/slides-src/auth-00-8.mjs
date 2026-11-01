/**
 * auth-00-8 — Authentication · Section 0 · Start here (1/2) "What authentication is, where it came from, why it matters" (01/11/2026).
 * Slug bài: auth-0-8-bat-dau-tai-day. Output = _ma.mjs của s00 (LabFlow ID chạy thật, Node 22.23.3, env -i). Mốc lịch sử kiểm nguồn 01/11/2026.
 */
import { lamDeck, js, sh, two, box, cards, c, vsd, flow } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s00/_ma.mjs';

export const deck = { key: 'auth-00-8', code: 'AUTH 0.8', title: 'Start here (1/2)', sub: 'What authentication is, and why it matters to you' };

export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a setup that runs', bai: 'Start 1/2' }, [
  { cover: true, t: 'Start here (1/2):<br>what authentication is', sub: 'Everyday pictures, the words people mix up, a verified history — and your first proof' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Authentication explained with an everyday picture, then precisely</li>
    <li>Seven pairs of words that trip people up in reviews and interviews</li>
    <li>A history from 1961 to passkeys — each step fixing the last one</li>
    <li>The course map and the project: <b>LabFlow ID</b></li>
    <li>A 12-line program that issues a stamped card and catches a forgery</li></ul>` },
  { t: 'Everyday pictures first', body: cards([
      ['🏠 Dorm key card', 'The guard checks your student card <b>once</b>; afterwards the door opens for whoever holds the key card. <b>A session.</b>'],
      ['📮 Stamped card', '“An — room 204”, stamped by the office. Anyone can read it; nobody can change it and keep the stamp. <b>A signed token.</b>'],
      ['🏦 Bank teller', 'Your ID card <b>and</b> a code sent to your phone before a big transfer. <b>Two factors.</b>'],
    ], 3) + box('The definition', 'Authentication = proving that a claimed identity is genuine. The claim (“I am An”) is cheap; the <b>proof</b> is the work.', 'lam') },
  { t: 'Four steps, on every login', body: flow([
      { t: 'Identify', s: '“I am An” — a claim' },
      { t: 'Authenticate', s: 'password, passkey…', mau: '#2f7d4f' },
      { t: 'Credential', s: 'session id, token', mau: '#b85a2b' },
      { t: 'Authorize', s: 'may An do THIS?', mau: '#7a3d12' },
    ], { w: 900, h: 190, fs: 22 }) + two(box('Steps 1–3: once per login', 'Then the client shows the credential on every request — the server does not remember (lesson 0.1).', 'lam'),
      box('Step 4: on every request', `Per action, per resource. Forgetting it is the most common API bug (lesson 0.2: ${c('IDOR')}).`, 'do2')) },
  { t: 'The words people mix up', body: `<table class="t">
    <tr><th>Pair</th><th>The difference</th></tr>
    <tr><td>authn vs authz</td><td>who you are vs what you may do</td></tr>
    <tr><td>encoding · encryption · hashing</td><td>reversible by anyone · with a key · one-way</td></tr>
    <tr><td>session vs token</td><td>server record + random id vs self-contained signed claims</td></tr>
    <tr><td>401 vs 403</td><td>“who are you?” vs “I know you — no”</td></tr>
    <tr><td>OAuth vs OpenID Connect</td><td>access to an API vs login with an ID token</td></tr>
    <tr><td>2FA · MFA · passkey</td><td>two factors · two or more · a phishing-resistant key pair</td></tr></table>` },
  { t: 'A short history (sources checked 01/11/2026)', body: `<table class="t">
    <tr><th>When</th><th>What</th><th>Fixed what</th></tr>
    <tr><td>1961</td><td>CTSS at MIT: first password login</td><td>shared machines</td></tr>
    <tr><td>1974 · 1979</td><td>Unix hashed passwords · Morris &amp; Thompson paper</td><td>stored passwords</td></tr>
    <tr><td>1989</td><td>Kerberos v4 public (MIT, from 1986)</td><td>log in once, use a ticket</td></tr>
    <tr><td>Jun 1994</td><td>HTTP cookie (Lou Montulli, Netscape)</td><td>the web forgets</td></tr>
    <tr><td>2012 · 2014 · 2015</td><td>OAuth 2.0 · OpenID Connect · JWT</td><td>apps, “log in with…”, tokens</td></tr>
    <tr><td>2019 · 2022</td><td>WebAuthn W3C Rec · passkeys (Apple, Google, Microsoft)</td><td>phishing</td></tr></table>` },
  { t: 'What it does for you', body: cards([
      ['🎓 FPT projects', 'SWP391 / SEP490 build sign-in in sprint 1 — usually copied from a tutorial. You will know what the tutorial got wrong.'],
      ['💬 Interviews', '“Sessions or JWT?” · “How do you store passwords?” · “How does OAuth work?” — each answered with numbers you measured.'],
      ['🛠 Work', 'You will configure Passport, NextAuth, Spring Security or an IdP — and debug them when users cannot log in.'],
    ], 3) + box('The cost of getting it wrong', 'Lesson 2/2: seven real incidents, each traced to one careless step — and to the chapter that prevents it.', 'do2') },
  { t: 'Your first proof in 10 minutes', body: js(`const KEY = 'demo-key-only-the-server-knows';
const stamp = (v) => createHmac('sha256', KEY).update(v).digest('base64url');
const issue = (v) => v + '.' + stamp(v);
function check(card) {          // compares in constant time (lesson 1.3)
  const i = card.lastIndexOf('.');
  const value = card.slice(0, i);
  return same(stamp(value), card.slice(i + 1)) ? value : null;
}`, { sm: true, hl: [2] }) + sh(OUT['08-chung-minh-dau-tien'], { title: 'node demo0/first-proof.mjs' }) },
  { t: 'Trap: a stamp is not encryption', body: vsd(`<p>“The card is signed, so it is secret.”</p>${sh('user=An;role=STUDENT.Yn7qc3nY…', { title: 'anyone can read this part' })}`,
      `<p>A stamp proves the value was <b>not changed</b>. It hides <b>nothing</b>.</p>${box('', `Never put a password or private data in a signed card or a JWT — Chapter 4 decodes one by hand.`, 'xanh')}`,
      '✗ The assumption', '✓ What a signature gives') +
      box('And a new key kills every old card', `${c('old card, new key → null')} (practice): a weapon after a leak, an outage after a careless deploy — Chapter 11 rotates keys safely.`, 'lam') },
  { t: 'The course map — and LabFlow ID', body: `<table class="t">
    <tr><th>Section</th><th>Question</th><th>LabFlow ID</th></tr>
    <tr><td>0 · 1</td><td>Why the web forgets; the primitives underneath</td><td>v0 (six holes) → v0.1</td></tr>
    <tr><td>2 · 3 · 4 · 5</td><td>Passwords · sessions · JWT · refresh and revocation</td><td>argon2id, cookies, tokens</td></tr>
    <tr><td>6 · 7 · 8</td><td>Account lifecycle · MFA and passkeys · OAuth / OIDC</td><td>login provider of LabFlow API</td></tr>
    <tr><td>9 · 10 · 11 · 12</td><td>Authorization · attacks · operations · diagnosis</td><td>v1.0 = final project</td></tr></table>` +
      box('LabFlow ID', 'The identity service of LabFlow (API Design, Testing courses): An, Bình (password 123456 — on purpose) and Cô Lan.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Authentication = proving a claim; the proof is the work</li>
    <li>Identify → authenticate → carry a credential → authorize every request</li>
    <li>authn ≠ authz; encoding ≠ encryption ≠ hashing</li>
    <li>A server-stamped value: readable, not changeable</li>
    <li>Next — Start here 2/2: real incidents, and how to study this course</li></ul>` },
]);
