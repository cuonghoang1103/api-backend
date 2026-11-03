/** auth-09-1 — Chapter 9 · 9.1 "Where authentication ends" (04/11/2026). Slug auth-9-1-phan-quyen-la-gi. Output = s09/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { OUT } from '../../content/courses/authentication/s09/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const MATRIX = clip(OUT['91-authz-matrix'].split('\n').slice(1, 7).join('\n'), 60);
const IDOR = `app.get('/bookings/:id', requireSession, (req, res) => {
  const b = db.booking.findById(req.params.id);  // ✅ who, ❌ whose
  res.json(b);        // +1 on the id reads anyone's booking
});`;
export const deck = { key: 'auth-09-1', code: 'AUTH 9.1', title: 'Where authentication ends and the expensive bugs begin', sub: 'Broken Access Control is OWASP #1 — and it is a forgotten line' };
export const slides = lamDeck({ chuong: 'Chapter 9 — Authorization models', bai: '9.1' }, [
  { cover: true, t: 'Where authentication ends and<br>the expensive bugs begin', sub: 'Chapter 9 · Lesson 9.1 — authorization, OWASP #1, and three structural rules' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Chapter 9</b>: one gate — <code class="i">can(user, action, resource)</code> — over rooms and bookings</li>
    <li>Authentication asks "who"; authorization asks "what may you do"</li>
    <li>Broken Access Control is OWASP #1 — usually a missing check (IDOR)</li>
    <li>Three rules: deny by default · one gate · decide on the resource</li>
    <li>One question can have five correct answers from one function</li></ul>` },
  { t: 'Two questions, one specification', body: two(
      box('Authentication — "who are you?"', 'Chapters 1–8: has RFCs, token formats, a provider you can point to. It happens ONCE, at the door, and then it is done.', 'xanh'),
      box('Authorization — "what may you do?"', 'this chapter: has no RFC. It is your business logic, scattered wherever a request touches a resource — on EVERY route.', 'do2')) +
      box('That difference is the whole danger', 'one door is easy to guard; the ten thousand requests that come after it are not — and each route is a fresh chance to forget a line.', 'lam') +
      box('So this chapter is unusual', 'it is less about an algorithm and more about a shape — a way to arrange the code so the rules are in one place and hard to skip.', 'lam') },
  { t: 'OWASP #1, in four lines', body: js(IDOR, { sm: true }) +
      box('An IDOR', 'the session is valid — we never checked the booking belongs to the caller. Walk the ids, read everyone\'s.', 'do2') +
      box('No crypto failed', 'this is Broken Access Control, the top category of the OWASP Top 10. A line was missing, not an algorithm.', 'lam') },
  { t: 'Why it is forgotten — and the fix', giua: true, body: cards([
      ['You cannot fix it with "remember"', 'vigilance does not scale to hundreds of routes and years of turnover; someone, eventually, forgets the line'],
      ['The fix is structural', 'arrange the system so the FORGETFUL path denies, and writing a route without a check is harder than writing one with it'],
      ['Three rules get us there', 'deny by default · one gate · decide on the resource — the rest of the chapter builds each one'],
    ], 1) },
  { t: 'The three rules', giua: true, body: cards([
      ['1 · Deny by default', 'the answer starts at NO; a rule must flip it. A route with no rule denies — a forgotten line fails safe'],
      ['2 · One gate', 'every decision goes through one can(user, action, resource) — not if-role scattered in controllers'],
      ['3 · Decide on the resource', 'not "is the user an admin?" but "may THIS user act on THIS booking in THIS tenant?"'],
    ], 1) },
  { t: 'One question, five correct answers', body: sh(MATRIX, { title: 'node demo9/authz-matrix.mjs — may each cancel An\'s booking?', sm: true }) +
      box('One gate, five reasons', 'owner (ownership) · peer (deny) · head (relationship) · admin (role) · cross-tenant admin (the boundary, first).', 'lam') },
  { t: 'Trap: "we hide the button"', giua: true, body: box('Hiding a UI control is not authorization', 'it is decoration — the API still answers curl, which renders no buttons, and a mobile app or a script never sees your React at all.', 'do2') +
      box('Every rule in this chapter lives on the server', 'at the route, in the gate. That is the only place a decision is actually enforced.', 'xanh') +
      box('The UI may ALSO hide the button', 'for tidiness, mirroring the policy — but it is never the thing that makes the action safe. The gate is.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Authentication ends at "who"; authorization begins at "what may you do" — no RFC</li>
    <li>Broken Access Control is OWASP #1 — an IDOR, a missing check, not broken crypto</li>
    <li>The check is on every route, so the defence is structural, not vigilance</li>
    <li>Three rules: deny by default, one gate, decide on the resource</li>
    <li>Next — 9.2: RBAC, and the boolean that becomes forty booleans</li></ul>` },
]);
