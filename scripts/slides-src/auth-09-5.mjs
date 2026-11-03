/** auth-09-5 — Chapter 9 · 9.5 "Where the check lives" (04/11/2026). Slug auth-9-5-dat-phep-kiem-o-dau. Output = s09/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s09/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const GA = CODE.gate.split('\n');
const AUTHZ = clip(GA.slice(GA.findIndex((l) => l.includes('export function authorize')), GA.findIndex((l) => l.includes('next();')) + 2).join('\n'), 64);
const WIRE = `app.post('/bookings/:id/cancel',
  authorize('booking:cancel', (req) => find(req.params.id)),
  (req, res) => { cancel(req.resource); res.json({ ok: true }); });`;
const NPM = clip(OUT['lab-npm-test'].split('\n').slice(-3).join('\n'), 40);
export const deck = { key: 'auth-09-5', code: 'AUTH 9.5', title: 'Where the check lives, and how to make forgetting impossible', sub: 'One gate middleware, loaded resource, tested once for all routes' };
export const slides = lamDeck({ chuong: 'Chapter 9 — Authorization models', bai: '9.5' }, [
  { cover: true, t: 'Where the check lives, and<br>how to make forgetting impossible', sub: 'Chapter 9 · Lesson 9.5 — one gate middleware, not a code-review note' },
  { t: 'The model is not enough', giua: true, body: box('can() is a clean decision function', 'but a decision function that nobody actually calls protects nothing at all.', 'lam') +
      box('"Remember to call can()" is a code-review note', 'and code-review notes are forgotten — by the next hire, by you on a busy day, by anyone copying an existing route.', 'do2') +
      box('The last question of the chapter is structural', 'where does the check go, so that adding a route WITHOUT it is hard — and ideally the normal way to write a route already includes it?', 'xanh') },
  { t: 'A gate middleware', body: js(AUTHZ, { sm: true }) +
      box('Between path and handler', 'authorize(action, loadResource) loads the resource, enforces the tenant boundary (404), calls can() (403) — and only then calls next().', 'xanh') +
      box('Three outcomes, one module', '401 no user · 404 missing-or-other-tenant · 403 same-tenant-no-grant — identical for every route that uses it.', 'lam') },
  { t: 'Wiring a route', body: js(WIRE, { sm: true }) +
      box('The check is in the route definition', 'not the handler body. Read the route, see which action guards it.', 'xanh') +
      box('The gate loads the resource', 'so a handler can never hand it attacker-controlled attributes (the 9.3 trap), and sets req.resource.', 'lam') },
  { t: 'Make the unsafe path loud', giua: true, body: box('The strongest version goes one step further', 'register every route through a helper that REQUIRES an action argument, so a route with no authorization does not compile or fails a startup assertion.', 'xanh') +
      box('You cannot forget it', 'adding an unguarded route is no longer a slip — you would have to go out of your way to bypass the helper.', 'lam') +
      box('Fail loud, not silent', 'the mistake surfaces at startup, in front of a developer — not in production, in front of an attacker.', 'do2') },
  { t: 'Test the gate, not forty routes', body: sh(clip(OUT['92-http-gate'].split('\n').slice(1, 7).join('\n'), 60), { title: 'the shipped gate, over HTTP', sm: true }) +
      sh(NPM, { title: 'npm test', sm: true }) +
      box('One module, one spec', 'owner · peer 403 · cross-tenant 404 · missing 404 · no-session 401. Forty routes inherit the proof — 48 tests green.', 'lam') },
  { t: 'Belt and braces', giua: true, body: two(
      box('Belt — the gate at the route', 'it STATES the rules; it is the one place you read to know the policy, and it enforces the tenant boundary and can().', 'xanh'),
      box('Braces — the query filter', 'WHERE tenant_id = $me on list queries; defence in depth, so a bug in one layer still leaves the other standing.', 'lam')) +
      box('Neither replaces the other', 'the filter protects the data; the gate declares the policy. Keep both.', 'lam') +
      box('Never authorize only in the frontend', 'hiding a button is good UX and zero security — the API still answers curl, with no React in sight.', 'do2') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>can() is the whole decision; 9.5 makes every route use it</li>
    <li>One gate middleware loads the resource, enforces the tenant (404), calls can() (403)</li>
    <li>Authorization is in the route definition; the handler gets req.resource</li>
    <li>Register so a missing check is loud; test the gate once as the spec</li>
    <li>Next — Lab 9: you write can(), and the grader plays every role</li></ul>` },
]);
