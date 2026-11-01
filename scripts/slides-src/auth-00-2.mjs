/**
 * auth-00-2 — Authentication · Section 0 · Lesson 0.2 "Three problems hiding in the word login" (01/11/2026).
 * Slug bài: auth-0-2-ba-bai-toan. Output = _ma.mjs của s00 (demo0/gates.js chạy thật, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, http, two, box, steps, cards, c } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s00/_ma.mjs';

export const deck = { key: 'auth-00-2', code: 'AUTH 0.2', title: 'Three problems hiding in the word "login"', sub: 'Identification, authentication, authorization' };

const json = (k) => OUT[k].split('\n').slice(1).join('\n');
// Drops boilerplate headers (X-Powered-By, ETag, Date, Connection, Keep-Alive, Content-Length) and marks the cut with "…".
const httpShort = (k) => { const L = OUT[k].split('\n'); const keep = L.filter((l) => !/^(X-Powered-By|ETag|Date|Connection|Keep-Alive|Content-Length):/.test(l)); const i = keep.findIndex((l) => l === ''); if (keep.length < L.length && i > 0) keep.splice(i, 0, '…'); return keep.join('\n'); };

export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a setup that runs', bai: '0.2' }, [
  { cover: true, t: 'Three problems hiding<br>in the word “login”', sub: 'Section 0 · Lesson 0.2 — three gates, each one broken on purpose' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Tell <b>identification</b>, <b>authentication</b> and <b>authorization</b> apart</li>
    <li>Find an <b>IDOR</b> by changing an id — and fix it inside the lookup</li>
    <li>Choose <b>401, 403 or 404</b> — and say why</li>
    <li>Classify a <b>factor</b>; refuse what is not one</li>
    <li>The vocabulary of the rest of the course</li></ul>` },
  { t: 'A reception desk with three checks', body: cards([
      ['Say your name', '<b>Identification</b> — a claim. Anyone can say a name.'],
      ['Show your card', '<b>Authentication</b> — the guard compares the photo: proof.'],
      ['Which doors open', '<b>Authorization</b> — floor-3 labs yes, server room no. Per door, every time.'],
    ], 3) + steps([
      'Gate 1 — who do you claim to be? (an id, an email)',
      'Gate 2 — prove it (password, code, passkey, valid session) → Chapters 2–8',
      'Gate 3 — may you do <b>this</b> to <b>this</b>? → Chapter 9',
    ]) },
  { t: 'Gate 1 alone: a claim is not proof', body: js(`app.get('/v1/me', (req, res) => {
  const user = find(req.get('x-user-id')); // a claim
  if (!user) return res.status(400).json({ error: 'Send X-User-Id' });
  res.json(user);
});`, { sm: true, hl: [2] }) + http([OUT['02-v1-an'], OUT['02-v1-mao']].join('\n'), { title: 'An asks for usr_1 … then types usr_3', wrap: 'any' }) +
      box('Nobody hacked anything', `Typing ${c('usr_3')} made the caller Cô Lan, lab manager. Same pattern in real systems: ${c('X-User-Id')} “set by the gateway” — safe only if nothing can reach the service except through it.`, 'do2') },
  { t: 'Gate 2: prove it — 401 when you cannot', body: js(`function authenticate(req, res, next) {
  const token = (req.get('authorization') ?? '')
    .replace(/^Bearer /, '');
  const user = find(TOKENS.get(token));
  if (!user) return res.status(401)
    .set('WWW-Authenticate', 'Bearer realm="labflow-id"')
    .json({ error: 'UNAUTHENTICATED' });
  req.user = user;
  next();
}`, { sm: true, hl: [5, 6] }) + two(http(httpShort('02-v2-401'), { title: 'no token' }), box('401 = unauthenticated', `The name is historical. ${c('WWW-Authenticate')} tells the client <b>how</b> to authenticate. Demo tokens ${c('tok_an')}, ${c('tok_bin')}, ${c('tok_lan')} stand in for sessions until Ch3.`, 'lam')) },
  { t: 'Gate 3 forgotten: An reads everyone (IDOR)', body: js(`app.get('/v2/users/:id', authenticate, (req, res) => {
  const user = find(req.params.id); // WHOSE profile?
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json(user);
});`, { sm: true, hl: [2] }) + two(http(json('02-v2-idor'), { title: 'An (tok_an) asks for usr_2', wrap: 'any' }), sh(json('02-v2-quet'), { title: 'a 4-line loop over ids' }), 'r64') +
      box('OWASP’s number one', 'IDOR = BOLA (API1:2023). Broken Access Control is A01 of the OWASP Top 10:2025: “100% of the applications tested” had some form of it.', 'do2') },
  { t: 'All three gates: gate 3 inside the lookup', body: two(js(`app.get('/v3/users/:id', authenticate, (req, res) => {
  const allowed = req.user.id === req.params.id
    || req.user.role === 'LAB_MANAGER';
  const user = allowed ? find(req.params.id) : undefined;
  if (!user) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json(user);
});`, { sm: true, hl: [2, 3, 4] }), `<div>${sh(json('02-v3-an'), { title: 'tok_an' })}${sh(json('02-v3-lan'), { title: 'tok_lan' })}</div>`, 'r64') + cards([
      ['In the lookup', `not an ${c('if')} after it — a refactor cannot skip it. SQL: ${c('WHERE id=$1 AND owner_id=$2')}`],
      ['404, not 403', 'do not confirm that usr_2 exists (MDN allows 404 to hide existence)'],
      ['Random ids help', 'but they leak in links and logs — the check is the defence'],
    ], 3) },
  { t: '403: we know who you are, and the answer is no', body: two(http(httpShort('02-v3-403'), { title: 'An tries to promote herself', wrap: true }),
      `<div>${http(json('02-v3-lan-doi'), { title: 'Cô Lan does the same', wrap: 'any' })}${box('Two kinds of gate 3', `Per <b>action</b>: only a lab manager changes roles (top of the handler). Per <b>object</b>: whose profile (inside the lookup). Real systems need both.`, 'lam')}</div>`) },
  { t: '401, 403 or 404?', body: `<table class="t"><tr><th>Code</th><th>Means</th><th>Client should</th><th>LabFlow ID (measured)</th></tr>
    <tr><td><b>401</b></td><td>gate 2 failed: “who are you?”</td><td>sign in (again)</td><td>no token ⇒ 401 + WWW-Authenticate</td></tr>
    <tr><td><b>403</b></td><td>gate 3 failed, nothing secret</td><td>stop — signing in changes nothing</td><td>An changes a role ⇒ 403</td></tr>
    <tr><td><b>404</b></td><td>does not exist — or you may not know it does</td><td>stop guessing</td><td>An reads usr_2 on v3 ⇒ 404</td></tr></table>` +
      box('Trap: 401 for “not allowed”', 'The front end hears “your session is gone” and sends the user into a sign-in loop. 401 only when identity is missing.', 'do2') },
  { t: 'Three kinds of proof — and what is not proof', body: cards([
      ['Know', 'Password, PIN. Guessed, reused, phished — Chapter 2 limits the damage.'],
      ['Have', 'Authenticator app, security key. Stops remote guessing; passkeys stop phishing (Ch7).'],
      ['Are', 'Fingerprint, face — unlocks a key on the device; your server receives a signature.'],
      ['Not a factor', 'IP, device fingerprint, “remember me”: risk signals, never proof.'],
    ], 4) + box('Security questions are banned', 'NIST SP 800-63B (800-63-4): verifiers SHALL NOT prompt for security questions or knowledge-based authentication, and SHALL NOT allow password hints. Two passwords are not two factors.', 'xanh') },
  { t: 'Practice: the whole matrix in one loop', body: sh(OUT['02-ma-tran'].replace(/^\$ .*$/m, '$ for who in none tok_an tok_bin tok_lan; do … /v3/users/$id …; done'), { title: 'GET /v3/users/:id — 4 callers × 3 profiles', sm: false }) +
      sh(OUT['02-thuc-hanh-403'].replace(/^\$ .*$/m, "$ curl … -X PATCH /v3/users/usr_2/role -H 'Authorization: Bearer tok_bin' …"), { title: 'Bình changes the role on her OWN profile' }) +
      box('Read it', 'No token: 401 everywhere (gate 2). Students: only the diagonal, the rest 404 (gate 3 in the lookup). Bình’s own profile still 403 — the rule is per action, not only per object.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>“Login” = <b>claim</b> + <b>proof</b> + <b>permission</b> — three gates</li>
    <li>Gate 1 alone: one header made anyone Cô Lan</li>
    <li>Gate 2 without gate 3: IDOR — change an id, read everyone</li>
    <li>Gate 3 in the lookup; 404 hides, 403 refuses, 401 only for “who are you?”</li>
    <li>Next — 0.3: a login that runs, and is wrong in six ways</li></ul>` },
]);
