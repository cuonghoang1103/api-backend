/**
 * api-06-2 — API Design · Chapter 6 · Lesson 6.2 "Authorisation and BOLA" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s06-bao-mat.mjs › api-6-2-phan-quyen. Output = chạy thật LabFlow Ch6 (LABFLOW_VULN=1 và bản đã vá).
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 6 — Security for APIs', bai: '6.2' };

export const deck = { key: 'api-06-2', code: 'API 6.2', title: 'Authorisation and BOLA', sub: 'Exploit, fix in one place, prove with a matrix' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Authorisation and<br>object-level access (BOLA)', sub: 'Logged in, allowed to call the endpoint —<br>but the record belongs to someone else.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Three levels of authorisation: function, <b>object</b>, property</li>
<li><b>BOLA</b> exploited on a new receipt endpoint</li>
<li>One policy table + <code class="i">authorize()</code>, answering <b>404</b></li>
<li>A matrix of every role against every booking — 8 wrong cells ⇒ 0</li>
<li>Traps: ids from the client, checking the list but not the item</li>
</ul>` },

  { t: 'Three levels of “may I?”', to: true, giua: true, body: cards([
    ['Function level — API5', 'May a student call <code class="i">PATCH /devices/:id</code> at all? <code class="i">requireRole</code>, since Chapter 1.'],
    ['Object level — API1', 'May Bin read <b>this</b> booking, <code class="i">bk_1</code>? OWASP’s number one — this lesson.'],
    ['Property level — API3', 'May An change <b>this field</b>, <code class="i">role</code>? Strict schemas and views (Chapter 2), revisited in 6.3.'],
  ]) + box('Why object level is forgotten', 'Every test you run with your own account passes.', 'do2') },

  { t: 'The quick receipt — and the exploit', to: true, body: two(`
<p style="margin-top:0">New: a <b>receipt</b> with lab, time, student name and email.</p>
<p>Quick version: <code class="i">requireAuth</code>, load by id, done. (<code class="i">LABFLOW_VULN=1</code>)</p>
${box('Sequential ids', '<code class="i">bk_1</code>, <code class="i">bk_2</code>… a loop reads everyone. Random ids leak too.', 'lam')}`, http(`# Bin, logged in correctly
$ curl -s …/v2/bookings/bk_1/receipt -H "Authorization: Bearer $(cat bin.jwt)"
{
  "bookingId": "bk_1",
  "lab": { "code": "AL-201",
           "name": "Phòng Lab Mạng máy tính" },
  "student": {
    "name": "Nguyễn Văn An",
    "email": "an@student.labflow.example"
  },
  "period": { "start": "2026-11-02T00:00:00.000Z",
              "end": "2026-11-02T02:00:00.000Z" },
  "status": "PENDING"
}`, { title: 'terminal (re-indented)' }) + box('BOLA', 'An’s name and email, by changing one number.', 'do2'), 'r46') },

  { t: 'The fix: one policy, asked everywhere', body: two(sql(`// policy.js
const isManager = (u) => u.role === 'LAB_MANAGER';
export const POLICIES = {
  'booking:read': (u, b) => isManager(u) || b.userId === u.id,
  'booking:cancel': (u, b) => isManager(u) || b.userId === u.id,
  'device:write': (u) => isManager(u),
  'issue:resolve': (u) => isManager(u),
};
export const can = (user, action, resource) =>
  Boolean(POLICIES[action]?.(user, resource));

// forbidden ⇒ 404, as if the record did not exist
export function authorize(req, action, resource, notFound) {
  if (!can(req.user, action, resource)) throw notFound;
}`, { lang: 'javascript', sm: true, hl: [4, 14] }), sql(`// routes/bookings.js — GET /:id/receipt
(req, res) => {
  const notFound = new HttpError(404,
    'BOOKING_NOT_FOUND', { id: req.params.id });
  const b = bookings.find((x) => x.id === req.params.id);
  if (!b) throw notFound;
  authorize(req, 'booking:read', b, notFound);
  // … build the receipt …
}`, { lang: 'javascript', sm: true, hl: [7] }) + box('One table', 'Rules change once, not in twenty <code class="i">if</code>s. Deny by default: no rule ⇒ no access.', 'xanh') + box('404, not 403', 'Bin cannot even learn that bk_1 exists. Old <code class="i">GET /bookings/:id</code> keeps its 403 — changing a status is breaking (4.1).', 'lam'), 'r46') },

  { t: 'Prove it for everyone: the matrix', body: two(sql(`// authz-matrix.mjs (condensed)
// owners: booking ⇒ userId, read as the manager
for (const [id, email, pw, role] of PEOPLE) {
  const token = await login(email, pw);
  for (const bk of ids) {
    const r = await getReceipt(bk, token);
    const ok = role === 'LAB_MANAGER'
      || owners[bk] === id;
    if (r.status !== (ok ? 200 : 404)) wrong++;
  }
}`, { lang: 'javascript', sm: true, hl: [7, 8, 9] }), http(`# quick version (LABFLOW_VULN=1)
usr_1 STUDENT     1:200 2:200✗ 3:200 4:200✗ 5:200 6:200✗ 7:200 8:200✗
usr_2 STUDENT     1:200✗ 2:200 3:200✗ 4:200 5:200✗ 6:200 7:200✗ 8:200
usr_3 LAB_MANAGER 1:200 2:200 3:200 4:200 5:200 6:200 7:200 8:200
✗ 8 ô sai chính sách

# after the fix
usr_1 STUDENT     1:200 2:404 3:200 4:404 5:200 6:404 7:200 8:404
usr_2 STUDENT     1:404 2:200 3:404 4:200 5:404 6:200 7:404 8:200
usr_3 LAB_MANAGER 1:200 2:200 3:200 4:200 5:200 6:200 7:200 8:200
✓ 0 ô sai chính sách`, { sm: true, title: '$ node authz-matrix.mjs' }) + box('Run it in CI', 'For every endpoint that returns one person’s data — it catches the next BOLA first.', 'xanh'), 'r46" style="grid-template-columns:37fr 63fr') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ Trusting ids from the client', '<code class="i">?userId=</code>, <code class="i">/users/usr_2/…</code>, <code class="i">ownerId</code> in the body are claims. ✓ The owner comes from the token (<code class="i">req.user</code>).'],
    ['✗ Checking the list, not the item', 'The list filtered “only mine” (3.3); the receipt forgot. ✓ Every path to an object is checked.'],
    ['✗ Testing only with your own account', 'Everything passes. ✓ A matrix of every role against every object.'],
  ]) + box('Rule of thumb', 'Every handler that takes an id from the URL asks the policy before it returns or changes anything.', 'xanh') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“What is BOLA?”', 'An authenticated user reaches another user’s object by changing its id — OWASP API1.'],
    ['“How do you prevent it?”', 'Object-level check on every access, centralised policy, deny by default, 404 for hidden objects, matrix tests.'],
    ['“Do UUIDs fix it?”', 'No — they slow down guessing, but ids leak. Only the check fixes it.'],
  ]) + box('At work', 'Security reviews start here: pick an endpoint with an id, log in as someone else, change the id.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Quick receipt: Bin read An’s name and email; matrix <b>8 wrong cells</b></li>
<li>Fix: one <code class="i">POLICIES</code> table, <code class="i">authorize()</code> on every object access, <b>404</b></li>
<li>After the fix: <b>0 wrong cells</b></li>
<li>The owner comes from the token; random ids are not a fix</li>
<li>Old endpoints keep their codes (4.1); new ones use 404</li>
</ul>
${box('Next', 'Lesson 6.3 — all ten OWASP API risks as an automatic audit.', 'xanh')}` },
]);
