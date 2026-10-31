/**
 * tst-05-3 — Testing · Chapter 5 · Lesson 5.3 "Validation and error responses" (01/11/2026). Slug: tst-5-3-validation.
 * Output = chạy thật: demo5/validation (10 xanh): 400 VALIDATION theo path, BAD_JSON, 422 theo luật.
 */
import { lamDeck, js, vt, two, box, steps, c, zm } from './_tst-chung.mjs';

export const deck = { key: 'tst-05-3', code: 'TST 5.3', title: 'Validation and errors', sub: '400 vs 422, one error format' };

const SCHEMA = `const time = z.string().regex(/^([01]\\d|2[0-3]):[0-5]\\d$/, 'time must be HH:MM …');

export const BookingInput = z.strictObject({
  lab: z.string().regex(/^[A-Z]{2}-\\d{3}$/, 'lab must look like BE-201'),
  date: z.iso.date(),
  start: time,
  end: time,
  seats: z.number().int().min(1).max(200),
});`;
const HANDLER = `const parsed = BookingInput.safeParse(req.body);
if (!parsed.success) {
  const details = parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  return fail(res, 400, 'VALIDATION', { details });
}`;
const EACH = `it.each([
  ['lab missing', 'lab', noLab],
  ['seats as a string', 'seats', body({ seats: '20' })],
  ['seats 2.5', 'seats', body({ seats: 2.5 })],
  ['date 2026-13-01', 'date', body({ date: '2026-13-01' })],
  ['start "7:00"', 'start', body({ start: '7:00' })],
  ['end "24:00"', 'end', body({ end: '24:00' })],
])('%s → 400 on path "%s"', async (_, path, payload) => {
  const res = await post(payload);
  expect(res.status).toBe(400);
  expect(res.body.error.details.map((d) => d.path)).toContain(path);
});`;
const OUT = `   ✓ 400 VALIDATION: the request itself is malformed (7)
     ✓ lab missing → 400 on path "lab" 22ms
     ✓ seats as a string → 400 on path "seats" 4ms
     ✓ seats 2.5 → 400 on path "seats" 3ms
     ✓ date 2026-13-01 → 400 on path "date" 2ms
     ✓ start "7:00" → 400 on path "start" 3ms
     ✓ end "24:00" → 400 on path "end" 1ms
     ✓ broken JSON → 400 BAD_JSON 2ms
   ✓ 422: well-formed, but against a business rule (3)
     ✓ 08:15–09:00 → 422 OFF_GRID 2ms
     ✓ 10:00–08:00 → 422 END_BEFORE_START 4ms
     ✓ 08:00–12:30 → 422 TOO_LONG 2ms`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Testing HTTP APIs', bai: '5.3' }, [
  { cover: true, t: 'Validation and<br>error responses', sub: 'Chapter 5 · Lesson 5.3 — malformed requests, rule violations, one error format' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Validating input at the door with Zod</li>
    <li>400 (malformed) vs 422 (well-formed, against a rule)</li>
    <li>A table of bad inputs, each pointing at its field</li>
    <li>Broken JSON and the error middleware</li>
    <li>One error format for every failure</li></ul>` },
  { t: 'The input schema', body: js(SCHEMA, { hl: [3, 8] }) + two(box('Types and shapes', 'Zod checks what JSON alone cannot: integer seats, a real calendar date, HH:MM inside the day, the lab code format.', 'lam'), box('strictObject', 'Unknown keys are refused — the role and the status are not the client’s to choose.', 'xanh')) },
  { t: 'From Zod issues to a 400 response', body: js(HANDLER, { hl: [3] }) + vt('{"error":{"code":"VALIDATION","details":[{"path":"seats","message":"Too small: expected number to be >=1"},\n{"path":"","message":"Unrecognized key: \\"role\\""}]}}', { title: 'response body for seats 0 and role ADMIN', fs: 14 }) +
    two(box('Clients need the path', 'A form can highlight the wrong field only if the error says which one.', 'lam'), box('All issues at once', 'Zod reports every problem in one go — the user fixes the form once, not field by field.', 'xanh')) },
  { t: 'A table of bad inputs', body: js(EACH, { sm: true, hl: [8] }) + box('Same technique as Chapter 1', 'Equivalence classes for each field — missing, wrong type, out of range, wrong format — one row each.', 'xanh') },
  { t: 'Ten checks, all green', body: zm(vt(OUT, { title: 'terminal — npx vitest run demo5/validation.test.js', sm: false }), 1.0) },
  { t: '400 or 422?', body: zm(`<table class="t"><tr><th>Status</th><th>Meaning</th><th>Who catches it</th><th>LabFlow</th></tr>
    <tr><td><b>400</b></td><td>the request is malformed</td><td>JSON parser, Zod schema</td><td>${c('BAD_JSON')}, ${c('VALIDATION')}</td></tr>
    <tr><td><b>422</b></td><td>well-formed, but breaks a rule</td><td>${c('bookLab')} (BR-04…)</td><td>${c('OFF_GRID')}, ${c('TOO_LONG')}</td></tr>
    <tr><td><b>409</b></td><td>conflicts with current state</td><td>repository / database</td><td>${c('OVERLAP')}</td></tr>
    <tr><td><b>500</b></td><td>our bug</td><td>error middleware</td><td>${c('INTERNAL')} — never leak the stack</td></tr></table>`, 1.08) +
    box('One format for all', `Every error is ${c('{ error: { code, details? } }')} — clients switch on ${c('code')}, as in lesson 2.3.`, 'xanh') },
  { t: 'Practice (15 minutes)', to: true, body: steps([
      '201 seats → 400 on seats; exactly 200 seats is accepted (a boundary!)',
      `An unknown key ${c('status')} → 400 “Unrecognized key”`,
    ]) + box('Done when', `${c('demo5/th53.test.js')}: 2 passed.`, 'xanh') + box('Hint', `Use ${c('toContainEqual')} to find one detail in the list without depending on its position.`, 'lam') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>Validate at the door; refuse unknown keys</li>
    <li>400 malformed · 422 rule · 409 conflict · 500 our bug</li>
    <li>Test a table of bad inputs, each pointing at its field</li>
    <li>One error format, checked in every test</li>
    <li>Never let a malformed request reach the business rules</li></ul>` },
]);
