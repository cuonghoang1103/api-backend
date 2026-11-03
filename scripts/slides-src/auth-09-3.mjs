/** auth-09-3 — Chapter 9 · 9.3 "ABAC & ReBAC" (04/11/2026). Slug auth-9-3-abac-rebac. Output = s09/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s09/_ma.mjs';
const clip = (s, n = 62) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const P = CODE.policy.split('\n');
const ABAC = clip(P.find((l) => l.includes('3. ABAC:')).trim().replace(/\s+\/\/.*$/, ''), 64);
const REBAC = clip(P.find((l) => l.includes('4. ReBAC:')).trim().replace(/\s+\/\/.*$/, ''), 64);
const AR_LINES = clip(OUT['91-authz-matrix'].split('\n').filter((l) => l.includes('ABAC') || l.includes('ReBAC')).join('\n'), 62);
export const deck = { key: 'auth-09-3', code: 'AUTH 9.3', title: 'Attributes and relationships: authorization RBAC cannot express', sub: 'Own your booking (ABAC); head of the room\'s dept (ReBAC)' };
export const slides = lamDeck({ chuong: 'Chapter 9 — Authorization models', bai: '9.3' }, [
  { cover: true, t: 'Attributes and relationships:<br>authorization RBAC cannot express', sub: 'Chapter 9 · Lesson 9.3 — ABAC (ownership) and ReBAC (the Zanzibar model)' },
  { t: 'Two gaps a role alone leaves', giua: true, body: two(
      box('"Cancel my OWN booking"', 'depends on an attribute — who owns this specific booking. A role cannot capture it. That is ABAC.', 'xanh'),
      box('"The head cancels in THEIR dept"', 'depends on a relationship — who heads the department the room belongs to. That is ReBAC.', 'lam')) +
      box('Neither can be a role', 'everyone owns different things, so "owner" is not a fixed set of users; and "head of SE" is a relationship, not a bundle of generic actions.', 'do2') +
      box('They slot into the one gate', 'as extra ways to say YES, tried after RBAC — the gate stays a single function, just with more reasons to grant.', 'lam') },
  { t: 'ABAC — an attribute of the pair', body: js(ABAC) +
      box('The data carries the permission', 'if the booking\'s ownerId equals the caller\'s id, they may cancel it — no role involved. The fact lives on the resource, not on the user.', 'xanh') +
      box('Scoped to exactly this action', 'owning a booking lets you cancel it — it does not let you manage the room it is in, or touch anyone else\'s booking.', 'lam') +
      box('Computed at decision time', 'you cannot precompute "owners"; you compare the pair (this user, this booking) the moment the request arrives.', 'lam') },
  { t: 'ReBAC — a relationship in the graph', body: js(REBAC) +
      box('The Zanzibar model', 'Google authorizes much of itself by storing relationships. Here: a DEPT_HEAD whose departmentId matches the room\'s may cancel.', 'lam') +
      box('Scoped, where RBAC is blanket', 'the SE head cannot touch a BA room\'s booking — the relationship beats the paper grant.', 'xanh') },
  { t: 'The three models are an OR chain', giua: true, body: cards([
      ['RBAC', 'does the role grant the action? (9.2)'],
      ['ABAC', 'do you own this resource?'],
      ['ReBAC', 'do you have the right relationship to it?'],
      ['else', 'deny by default'],
    ], 2) + box('Behind the tenant check', 'any one that says yes wins; each line is one readable reason.', 'lam') },
  { t: 'Attributes are only as safe as their source', giua: true, body: box('❌ ownerId read from req.body', 'the caller simply sends ownerId equal to their own id and "owns" any resource — the check is pure theatre.', 'do2') +
      box('✅ ownerId read from the loaded record', 'the server\'s own copy of the booking decides; the request cannot influence it.', 'xanh') +
      box('So: load first, then decide', 'the gate in 9.5 fetches the resource itself and passes THAT to can(), so a handler can never hand it attacker-controlled attributes.', 'lam') },
  { t: 'explain() and the matrix', body: sh(AR_LINES, { title: 'node demo9/authz-matrix.mjs — ABAC + ReBAC rows', sm: true }) +
      box('A reason, for the audit log', 'the policy returns WHY — "you own this booking", "you head this room\'s department" — for an audit trail and for teaching.', 'lam') +
      box('Never shown to the end user', 'they get only allow, or a bare 403/404 — an explanation of why access was denied is itself a hint an attacker can use.', 'do2') },
  { t: 'Trap: every attribute a rule', giua: true, body: box('ABAC can express almost anything', 'which is exactly its danger — a gate full of ad-hoc attribute comparisons becomes as unreadable as the scattered role checks of 9.2.', 'do2') +
      box('Keep it to a few, named reasons', 'ownership; the head relationship. Let RBAC carry the bulk of the policy, and reach for ABAC/ReBAC only for the questions a role truly cannot answer.', 'xanh') +
      box('Expressiveness is not the goal', 'a policy you can read on one screen is. The more attribute rules you add, the fewer people can tell you who may do what.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>RBAC cannot express ownership (a per-pair fact) or a relationship</li>
    <li>ABAC grants by an attribute of the (actor, resource) pair — ownership</li>
    <li>ReBAC grants by a relationship — head of the dept; the Zanzibar model</li>
    <li>Read attributes only from server-side data, never the request body</li>
    <li>Next — 9.4: the tenant boundary that must never leak</li></ul>` },
]);
