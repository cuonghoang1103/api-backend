/** auth-09-4 — Chapter 9 · 9.4 "Multi-tenancy" (04/11/2026). Slug auth-9-4-nhieu-tenant. Output = s09/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s09/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const GA = CODE.gate.split('\n');
const GATE_404 = clip(GA.slice(GA.findIndex((l) => l.includes('const resource = await loadResource')), GA.findIndex((l) => l.includes("FORBIDDEN")) + 1).join('\n'), 62);
const DEMO = clip(OUT['92-http-gate'].split('\n').slice(1, 7).join('\n'), 60);
export const deck = { key: 'auth-09-4', code: 'AUTH 9.4', title: 'Multi-tenancy: the boundary that must never leak', sub: 'Cross-tenant answers 404, not 403 — or it enumerates' };
export const slides = lamDeck({ chuong: 'Chapter 9 — Authorization models', bai: '9.4' }, [
  { cover: true, t: 'Multi-tenancy: the boundary<br>that must never leak', sub: 'Chapter 9 · Lesson 9.4 — one database, many tenants, and the 404-not-403 rule' },
  { t: 'One system, many tenants', giua: true, body: box('FPT HCM and FPT HN, one deployment, one database', 'a tenant is a hard wall.', 'lam') +
      box('A user of HCM must never…', 'see, touch, or even CONFIRM THE EXISTENCE OF HN\'s rooms and bookings.', 'do2') +
      box('The most expensive boundary to get wrong', 'and it leaks in a way you do not expect — a 403, not a 200.', 'xanh') },
  { t: 'The boundary is the first check', giua: true, body: box('Tenant, before any role', 'in the one gate, resource.tenantId !== user.tenantId ⇒ false, full stop — the role, ownership and relationship checks below never even run.', 'xanh') +
      box('Even ADMIN never crosses', '\'*\' is checked AFTER this line, so an admin of FPT HCM is simply not an admin of FPT HN. The wall sits above every grant in the system.', 'lam') +
      box('One comparison, the whole isolation', 'everything that keeps two tenants apart rests on this single line being first — which is why the lab weights it at 2 points.', 'do2') },
  { t: 'Filtering queries is not enough', giua: true, body: box('WHERE tenant_id = $me helps — and you should do it', 'but it is per-query vigilance, repeated by hand on every list query you write.', 'lam') +
      box('The day someone writes GET /:id with no WHERE', 'the whole wall is gone for that one route — and nothing about the code looks wrong at a glance.', 'do2') +
      box('So the check belongs in the one gate', 'which loads the resource and checks its tenant for EVERY route, so no single forgotten WHERE can breach the wall.', 'xanh') },
  { t: 'The leak you do not see: 403', giua: true, body: box('Suppose a cross-tenant request returns 403 Forbidden', 'you have just told the attacker the booking EXISTS — otherwise it would have been a 404.', 'do2') +
      box('Now two answers map the other tenant', '404 for ids that are not real, 403 for ids that are real-but-another-tenant — together they reveal which ids exist across the wall.', 'do2') +
      box('A slow, quiet enumeration', 'no alarm fires; the attacker just walks the id space and records which ones answer 403. The wall leaks through its own politeness.', 'lam') },
  { t: 'Cross-tenant answers 404', body: js(GATE_404, { sm: true }) +
      box('Same 404 as "not found"', 'a missing resource and a wrong-tenant resource take the SAME branch; the attacker cannot tell them apart.', 'xanh') +
      box('The Chapter 6 rule, at the resource door', 'one answer for every case — the same idea that gave sign-up one message for every email, now guarding the tenant wall.', 'lam') },
  { t: 'The HTTP demo — four outcomes', body: sh(DEMO, { title: 'node demo9/http-gate.mjs', sm: true }) +
      box('Three honest statuses', 'owner 200 · same-tenant-no-grant 403 · other tenant 404, identical to a missing id. Zero enumeration.', 'lam') },
  { t: 'Trap: "ADMIN should see everything"', giua: true, body: box('Letting ADMIN skip the tenant check "for support"', 'is exactly how one tenant\'s admin reads — or edits — another tenant\'s data. It is the single most common multi-tenant breach.', 'do2') +
      box('If cross-tenant access is truly needed', 'make it a separate, audited, rarely-granted role (a "support" or "platform" role), and log every single use of it.', 'xanh') +
      box('The default ADMIN is an admin of ONE tenant', 'strong inside its wall, powerless outside it — because \'*\' is checked after the tenant line, never before.', 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>A tenant is a hard wall; the check is first, above every role — even ADMIN</li>
    <li>Query filters help but are per-query; the gate covers every route</li>
    <li>A 403 for another tenant leaks existence — answer the same 404 as "not found"</li>
    <li>403 is reserved for same-tenant, no-grant, where it leaks nothing</li>
    <li>Next — 9.5: where the one gate lives so no route forgets it</li></ul>` },
]);
