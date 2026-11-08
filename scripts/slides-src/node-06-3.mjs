/**
 * node-06-3 — Node.js · Chapter 6 · Lesson 6.3 "Validation with a schema" (slide EN, kiểu FU, đợt 4 — 01/11/2026). MỘT deck, HAI tập:
 *   6.3a (node-6-3)   = slide 1–12: luật "mọi thứ từ client là thù địch" · bức tường if (thật: báo từng lỗi một) · lược đồ zod · safeParse trong route ·
 *                       output thật 3 lỗi một lần · mặc định được điền · parse vs safeParse · query string ép kiểu + chặn trần (thật) · .max(50) là ký tự chịu lực · tóm tắt
 *   6.3b (node-6-3-2) = slide 13–22: mass assignment (thật: lười ⇒ isAdmin lọt, authorId bị đè) · lược đồ vứt khoá lạ · .strict() (thật) · middleware validate ·
 *                       Express 5 req.query chỉ đọc (thật: 500) · bốn thẻ · website (thật: 150 router, 51 zod, 8 express-validator) · Notes API v6 (thật) · nơi đặt · bài tập · tự kiểm
 * Nguồn: s06-rest.mjs › nodejs-6-3-validate-schema. Output THẬT Node 22.23.3 + Express 5.3.0 + zod 4.6.7, cổng 4100:
 * that/c6/{wall-of-ifs,zod-route,mass,validate-mw,website-validate} + c6notes/{notes.schemas,validate,index}. Web ghi zod 4.4.3: thông điệp lỗi trùng khớp.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-06-3', code: 'NODE 6.3', title: 'Validation with a schema', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100").replace(/ \| grep -v '[^']*'/g, '');
const L = (ten, a, b) => ngan(ra(ten, a, b));
/** Ngắt JSON một dòng dài thành nhiều dòng ở ranh giới phần tử (giữ nguyên chữ). */
/** Số dòng (1-based) chứa một trong các mẫu — để tô dòng sau khi đã ngắt. */
const hlCo = (t, ...re) => t.split('\n').map((l, i) => (re.some((r) => r.test(l)) ? i + 1 : 0)).filter(Boolean);
const tm = (t, title, re = [/\[\d{3}\]/], sm = false) => term(t, { title, sm, hl: hlCo(t, ...re) });
const gayJson = (t, n = 84) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(',', n); if (k < 20) k = n; o.push(r.slice(0, k + 1)); r = '   ' + r.slice(k + 1); } o.push(r); return o; }).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 6 — REST API design', bai: '6.3' }, [
  /* ───── 6.3a ───── */
  { cover: true, t: 'Validation<br>with a schema', sub: 'Everything from the client is hostile until proven otherwise.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why a wall of <code class="i">if</code>s fails, shown for real</li>
<li>One <b>schema</b> (zod) that is both the spec and the check</li>
<li>Every error at once, defaults filled, the query string typed and capped</li>
<li>Part 2: the attack a schema silently stops (<b>mass assignment</b>), a <code class="i">validate()</code> middleware, and the Notes API upgraded</li>
</ul>
${js(ma('c5notes/notes.routes', 22, 24), { sm: false, hl: [2] })}
${box('Where we start', 'Lesson 5.5 checked one field by hand (above, the real Notes API). Fine for one field; not for eight.', 'lam')}
` },

  { t: 'Picture an airport check-in desk', to: true, giua: true, body: cards([
    ['📋 One rule sheet', 'Bag ≤ 23 kg, name matches the passport, no liquids. Every passenger, same sheet.'],
    ['🧾 All problems at once', 'A good agent says "your bag is heavy AND your name is misspelled", not one per visit.'],
    ['🚫 Odd items stay behind', 'Things that are not on the list never reach the plane.'],
  ], 3) + box('Mapping', 'The rule sheet = the schema. The desk = validation at the edge, BEFORE the plane (your database). Odd items left behind = unknown keys dropped.', 'xanh') + box('Schema (lược đồ)', 'a declared description of what valid data looks like, that a program can check.', 'lam') },

  { t: 'The rule this lesson enforces', giua: true, body: two(cot(
    box('Everything from the client is hostile', 'body · query · params · headers. Until proven otherwise.', 'do2'),
    box('Not because users attack you', 'Most honest people send you broken data by accident. The code path is identical.', 'lam')),
    flow([{ t: 'client', s: 'any data', mau: LAM }, { t: 'validator', s: 'at the edge', mau: NODE }, { t: 'service', s: 'trusts it', mau: NODE }, { t: 'database', s: 'clean', mau: NODE }], { w: 540, h: 160, fs: 19 })) +
    bang(['Input', 'Example', 'Arrives as'], [['body', '{"title": "", "pinned": "yes"}', 'whatever JSON was sent'], ['query', '?limit=500&amp;sort=colour', 'always strings'], ['params', '/notes/abc', 'always strings'], ['headers', 'If-Match, Idempotency-Key', 'strings, or missing']], { co: 19 }) +
    box('The only real question', 'Does bad data hit your DATABASE first, or your VALIDATOR first?', 'xanh') },

  { t: 'The wall of ifs, from lesson 5.5 grown up', giua: true, body: js(ma('c6/wall-of-ifs', 2, 11), { sm: true, hl: [2, 3, 4, 5, 6, 7, 8, 9] }) + term(ra('c6/wall-of-ifs'), { title: 'node wall-of-ifs.mjs · real', hl: [1, 2, 3] }) +
    box('Three mistakes, three round trips', 'The wall stops at the first failing if. The user fixes one thing, sends, meets the next. Eight ifs, each with its own wording, half of them forgotten in the next route.', 'do2') },

  { t: 'One schema instead of the wall', to: true, giua: true, body: js(ma('c6/zod-route', 2, 2) + '\n\n' + ma('c6/zod-route', 7, 12), { sm: false, hl: [4, 5, 6, 7] }) + two(
    box('Reads like a spec', 'title: text, 1 to 200 characters. body: up to 10 000, empty by default. tags: up to 5. pinned: true/false, false by default.', 'xanh'),
    box('Runs like a check', 'The same four lines are executed on every request. The spec cannot drift from the check.', 'lam')) },

  { t: 'The route: safeParse first', giua: true, body: js(ma('c6/zod-route', 21, 30), { sm: true, hl: [2, 3, 5, 8] }) + two(
    box('safeParse vs parse', '<code class="i">parse</code> throws. <code class="i">safeParse</code> returns <code class="i">{ success, data | error }</code>. Both work with the 5.4 handler; safeParse keeps the control flow visible.', 'lam'),
    box('After the check', '<code class="i">parsed.data</code> is clean, typed, defaults filled. The service never sees req.body.', 'xanh')) },

  { t: 'What it returns: three errors at once', giua: true, body: tm(gayJson(L('c6/zod-route', 1, 2), 92), 'curl · real', [/"path"/]) + bang(['path', 'message (zod 4, real)'], [
    ['title', 'title must not be empty <span style="color:#888">(our own text)</span>'],
    ['tags', 'Too big: expected array to have &lt;=5 items'],
    ['pinned', 'Invalid input: expected boolean, received string'],
  ], { co: 21 }) + box('One response, every problem', 'A form that reveals one error per click is a form people abandon.', 'xanh') },

  { t: 'A valid request: what the schema adds', to: true, giua: true, body: js(ma('c6/zod-route', 7, 12), { sm: true, hl: [3, 5] }) + term(L('c6/zod-route', 3, 4), { title: 'curl · real', hl: [2] }) + two(
    box('Never sent, still there', '<code class="i">body</code> and <code class="i">pinned</code> were not in the request. <code class="i">.default()</code> filled them in.', 'xanh'),
    box('No more ?? \'\' in five places', 'By the time data reaches the service it is complete. The code behind the edge gets simpler.', 'lam')) },

  { t: 'The query-string problem, solved', giua: true, body: js(ma('c6/zod-route', 13, 18), { sm: true, hl: [2, 3] }) + tm(gayJson(L('c6/zod-route', 5, 10), 110), 'curl · real', [/"path"|appliedQuery|"types"/], true) +
    box('Strings in, numbers out', 'Everything in req.query is a string (lesson 5.2). <code class="i">z.coerce.number()</code> converts, <code class="i">.default()</code> fills, <code class="i">.max(50)</code> caps, <code class="i">z.enum</code> whitelists.', 'xanh') },

  { t: '.max(50) is a load-bearing character', to: true, giua: true, body: flow([
    { t: '?limit=1000000', s: 'one request', mau: DO },
    { t: 'DB fetches 1M rows', s: 'into RAM', mau: DO },
    { t: 'JSON.stringify', s: 'blocks the loop (2.4)', mau: DO },
    { t: 'process dies', s: 'for everyone', mau: DO },
  ], { h: 160, fs: 21 }) + two(
    box('Reject (422)', 'When you want the client to learn something: an API used by other teams.', 'lam'),
    box('Or clamp: Math.min(50, limit)', 'When the client is your own browser code: never breaks a greedy request.', 'xanh')) +
    box('Pick one', 'Either is fine. No cap at all is the bug: the line between an endpoint and a denial-of-service tool.', 'do2') },

  { t: 'Part 1: summary', to: true, giua: true, body: `<ul>
<li>Everything from the client is hostile: validate at the edge, first</li>
<li>A wall of ifs reports one problem per round trip; a schema reports all</li>
<li><code class="i">safeParse</code> → <code class="i">parsed.data</code>: clean, typed, defaults filled</li>
<li>Query strings: coerce, default, cap, whitelist</li>
</ul>${flow([{ t: 'req.body', s: 'untrusted', mau: DO }, { t: 'schema', s: 'safeParse', mau: LAM }, { t: 'parsed.data', s: 'clean', mau: NODE }, { t: 'or 422', s: 'fields[]', mau: CAM }], { h: 130, fs: 21 })}${box('Part 2', 'The attack a schema silently stops, a validate() middleware, and the Notes API upgraded.', 'lam')}` },

  /* ───── 6.3b ───── */
  { t: 'The lazy version, and the attack', giua: true, body: js(`// lazy: every key the client sends goes in
const note = await db.note.create({ data: { ...req.body, authorId: user.id } });`, { sm: false, hl: [2] }) + tm(gayJson(L('c6/mass', 1, 4), 96), 'curl with extra keys · real (two lazy routes)', [/isAdmin":true,/]) +
    two(box('Mass assignment (gán ồ ạt)', 'The client sets fields you never meant to expose: a permission flag, someone else\'s id, a "verified" boolean, a price.', 'do2'),
      box('Not far-fetched', 'It happens the first time someone opens DevTools and edits a request body.', 'do2')) },

  { t: 'A schema drops unknown keys by default', to: true, giua: true, body: tm(gayJson(L('c6/mass', 5, 6), 96), 'same attack, schema route · real') + two(
    box('Structural fix', '<code class="i">z.object()</code> keeps only the keys you declared. Spreading <code class="i">req.body</code> is the bug; spreading <code class="i">parsed.data</code> is safe.', 'xanh'),
    box('authorId stays ours', 'The server sets it AFTER the schema, from the logged-in user, never from the body.', 'lam')) +
    flow([{ t: '"title"', s: '✓ declared: kept', mau: NODE }, { t: '"isAdmin"', s: '✗ dropped', mau: DO }, { t: '"authorId"', s: '✗ dropped', mau: DO }, { t: '"createdAt"', s: '✗ dropped', mau: DO }, { t: 'parsed.data', s: '{ title, body }', mau: NODE }], { h: 140, fs: 21 }) },

  { t: '.strict(): unknown keys become errors', giua: true, body: js(ma('c6/mass', 23, 23), { sm: false, hl: [1] }) + tm(gayJson(L('c6/mass', 7, 10), 96), 'a typo in a field name · real', [/Unrecognized|\[422\]/]) + two(
    box('With .strict()', '<code class="i">{"titel":"x"}</code> → "Unrecognized key: titel". The typo is named.', 'xanh'),
    box('Without it', 'The same typo becomes "title missing", which confuses everyone. Use .strict() for internal APIs.', 'lam')) +
    box('Strict or not?', 'Internal API, your own clients: strict, so typos explode loudly. Public API with old clients: default, so a new field from a newer app is ignored, not rejected.', '') },

  { t: 'Turn it into middleware', giua: true, body: js(ma('c6/validate-mw', 10, 19), { sm: true, hl: [4, 5, 7] }) + js(ma('c6/validate-mw', 25, 25), { sm: true }) + two(
    box('Write to req.valid', 'Never back to req.query: in Express 5 it is a computed getter.', 'do2'),
    box('Every route', '<code class="i">validate({ body, query, params })</code> runs before the handler. The handler reads <code class="i">req.valid.body</code>: always clean.', 'xanh')) },

  { t: 'Real outputs, and the Express 5 trap', giua: true, body: tm(gayJson(L('c6/validate-mw', 1, 12), 100), 'curl · real', [/\[\d{3}\]/], true) + term(ra('c6/validate-mw', 2, 2, 'server'), { title: 'server log · real: req.query = … in Express 5', hl: [1] }) },

  { t: 'What one schema buys you', to: true, giua: true, body: cards([
    ['One schema, two jobs', 'The same file describes the endpoint and enforces it. Documentation cannot drift: it IS the code.'],
    ['TypeScript for free', '<code class="i">z.infer&lt;typeof CreateNote&gt;</code> gives the static type of validated data. One definition, no duplicate interface.'],
    ['Validate at the edge', 'Once, at the route. Services behind it trust their input instead of re-checking at every layer.'],
    ['Not a DB constraint', 'Validation catches honest mistakes. Only a unique index catches two requests racing. Chapter 7 needs both.'],
  ], 2) + js(`// TypeScript (the idea, not run here): the type comes FROM the schema
type CreateNoteInput = z.infer<typeof CreateNote>;
// ⇒ { title: string; body: string; tags?: string[]; pinned: boolean }`, { sm: false }) },

  { t: 'This website: not uniform yet', giua: true, body: term(ra('c6/website-validate'), { sm: true, title: 'cuongthai.com · src (read-only) · real', hl: [7, 8, 9, 12] }) + two(
    box('The shared middleware', 'Joins every problem into ONE message string, 422, VALIDATION_ERROR. A form cannot point at the field.', 'do2'),
    box('Where it is heading', 'Newer zod routes return per-field lists (the CV builder does). One fields[] everywhere is the target.', 'xanh')) },

  { t: 'Notes API, chapter 6: schemas at the edge', giua: true, body: js(ma('c6notes/notes.schemas', 3, 6) + '\n// … UpdateNote (all optional), IdParam …\n' + ma('c6notes/notes.schemas', 12, 16), { sm: true, hl: [1, 6] }) + tm(gayJson(L('c6notes/index', 7, 8) + '\n' + L('c6notes/index', 13, 14), 120), 'curl · real (the whole project)', [/\[\d{3}\]/], true) +
    box('Same project, grown', 'notes.schemas.mjs + validate.mjs; the router reads req.valid. isAdmin and version from the client were dropped, the empty title is a 422 with fields[].', 'xanh') },

  { t: 'Where validation belongs', to: true, giua: true, body: steps([
    'At the edge, before anything else: the first statement of the request. Everything after can assume the shape.',
    'PARSE, do not ASSERT: <code class="i">schema.parse(req.body)</code> gives a typed value or fails. <code class="i">req.body as CreateNote</code> is a lie that compiles.',
    'Return errors per field: a path and a message each, so the client can attach them to inputs.',
    'Derive the types from the schema: one declaration, runtime check and compile-time type, never drifting apart.',
  ]) + box('Parse vs assert', 'Parsing checks and converts. Asserting only TELLS the compiler to believe you.', 'lam') },

  { t: 'Exercise: a sign-up schema', to: true, giua: true, body: two(`<div style="font-size:26px;line-height:1.5">POST /users accepts:<ul><li>email: a valid email</li><li>password: at least 8 characters</li><li>age: optional whole number ≥ 13</li><li>the client must NOT be able to set <code class="i">role</code></li></ul>Write the zod schema, and say what <code class="i">{"email": "a@b.co", "password": "12345678", "role": "admin"}</code> becomes.</div>`,
    `<div data-k="dapan">${js(ma('c6/signup', 3, 7), { sm: true })}${term(ra('c6/signup', 1, 2), { sm: true, title: 'node signup.mjs · real', hl: [1, 2] })}${box('Result', 'role is silently dropped. With .strict() it becomes an error.', 'xanh')}</div>`, 'r46') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why is <code class="i">{ ...req.body, authorId }</code> dangerous, and what fixes it structurally?</li>
<li>Why must validate() write to <code class="i">req.valid</code> and not to <code class="i">req.query</code> in Express 5?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Mass assignment: the client can set any field. Spread parsed.data from a schema: unknown keys are dropped. &nbsp; 2. req.query is a read-only getter: assigning throws (a real 500 above).', 'xanh')}</div>
<ul>
<li>One schema = the spec and the check; every error at once</li>
<li>Unknown keys dropped (or rejected with .strict())</li>
<li>validate() middleware → req.valid; per-field errors</li>
<li>Validation at the edge; DB constraints still needed</li>
</ul>
${box('Next', 'Lesson 6.4: pagination, filtering and sorting, measured on a million rows.', 'lam')}` },
]);
