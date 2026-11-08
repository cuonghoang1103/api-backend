/**
 * node-18-1 — Node.js · Chapter 18 · Lesson 18.1 "Layers, and the 50 route files that skip one" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-18-1.
 * Nguồn: nodejs-18-1-tang-va-trach-nhiem. Output THẬT: that/c18/layers (đọc mã nguồn website ở commit 9076fb918, chỉ đọc; tệp mã, không tính *.test.ts).
 * Khác web (repo đã lớn ~4×): route gọi thẳng prisma 50/150 = 33 % (web 28/62 = 45 %) · service 382/705 = 54 % (web 61/77 = 79 %) · 900 tệp 302.781 dòng
 *   (web 244 / 80.454) · services : routes = 4,8 : 1 (web 1,9) · middleware 6 tệp 949 dòng (web 5 / 727) · request id vẫn ở mục 1b, dòng 261.
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-18-1', code: 'NODE 18.1', title: 'Layers, and the 50 route files that skip one', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const JS = (src, o = {}) => sql(src, { lang: 'javascript', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 18 — Architecture', bai: '18.1' }, [
  { cover: true, t: 'Layers, and the 50 route files<br>that skip one', sub: 'Architecture is not diagrams. It is a few rules about who may know what — and noticing when a rule has quietly stopped being followed. Measured on a real 302,781-line backend.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Three layers, and what each one is NOT allowed to know</li>
<li>Measuring whether the boundary holds: 50 of 150 route files skip it</li>
<li>When skipping the layer is genuinely fine — and the test for it</li>
<li>Where the code actually lives: services : routes = 4.8 : 1</li>
<li>The layer nobody names: middleware, and why its order is architecture</li>
</ul>` + box('Why it matters to you', 'Seventeen chapters built pieces. This one decides whether the codebase is still changeable in year three — or something everybody is afraid of.', 'lam') },

  { t: 'Three layers, and what each may know', to: true, giua: true, body: flow([{ t: 'route (HTTP)', s: 'paths, status codes, validation', mau: LAM }, { t: 'service (business)', s: 'who may do what, prices, order of steps', mau: NODE }, { t: 'data (storage)', s: 'Prisma, SQL, Redis, R2', mau: CAM }], { h: 130 }) +
    cards([['Route knows HTTP', 'Paths, status codes, headers, input validation. Knows NO SQL and NO business rules.'], ['Service knows the rules', 'Who may edit what, how a price is computed, the order of steps. Does NOT know if HTTP or a background job called it.'], ['Data knows how to store', 'How to read and write. Does NOT know why.']], 3) +
    box('Like a restaurant', 'The waiter takes the order and brings the plate (route). The chef decides how the dish is made (service). The pantry stores ingredients (data). A waiter cooking in the pantry works — until the recipe changes.', 'lam') },

  { t: 'The value is in the negatives', to: true, giua: true, body: cards([['A service that does not know HTTP', 'can be reused by a queue worker (ch. 13), a cron job, a CLI script and a test (ch. 14) — without changing a line.'], ['A route that does not know SQL', 'cannot accidentally ship a query that scans a million rows.'], ['Each "does not know"', 'is a class of bug that becomes impossible, not merely unlikely.']], 3) +
    flow([{ t: 'HTTP route', s: 'req, res', mau: LAM }, { t: 'queue worker', s: 'no req at all', mau: TIM }, { t: 'cron job', s: 'no user at all', mau: TIM }, { t: 'test', s: 'a fake user', mau: TIM }, { t: 'one service', s: 'the same rules for all four', mau: NODE }], { h: 120 }) +
    box('This website does exactly this', 'In CT Work, issue changes from REST routes, MCP commands and bulk edits all pass through one service function, applyIssueChange — so a rule added there reaches all three.', 'xanh') },

  { t: 'What it looks like in code', to: true, giua: true, body: JS(`// route — speaks HTTP only
router.post('/notes', requireAuth, async (req, res, next) => {
  const parsed = createNoteSchema.safeParse(req.body);           // validate (chapter 6)
  if (!parsed.success) return res.status(400).json({ fields: parsed.error.issues });
  try {
    const note = await notesService.create(req.user, parsed.data); // hand the work over
    res.status(201).json(note);                                    // translate to HTTP
  } catch (e) { next(e); }                                         // errors go elsewhere (ch. 5)
});

// service — speaks business only
async function create(actor, data) {
  if (!actor) throw new AppError('UNAUTHENTICATED', 401);
  if (await repo.slugExists(data.slug)) throw new AppError('SLUG_TAKEN', 409);
  return repo.insert({ ...data, authorId: actor.id });
}`, { sm: true, hl: [6, 14] }) +
    box('The service throws AppError(\'SLUG_TAKEN\', 409), not res.status(409)', 'It names a business condition and lets the HTTP layer decide how to say it — which is what makes it callable from a worker, where there is no res at all.', 'cam') },

  { t: 'Measuring whether the boundary holds', to: true, giua: true, body: TT('c18/layers', 4, 8, 'files that import src/config/database (Prisma) directly · api-backend @ 9076fb918 · real', { n: 104, hl: [2, 5], sm: false }) +
    thanh([['routes → prisma', 50, DO, '50 / 150 (33%)'], ['… with no service at all', 11, DO, '11'], ['services → prisma', 382, LAM, '382 / 705 (54%)']], { w: 1100, x0: 330, wMax: 560, h0: 56, chu: 22, log: true, ghi: 'log scale · code files only, tests excluded · real' }) +
    box('On the whiteboard: route → service → data', 'In the repository: one route file in three also goes route → data, skipping the middle. Nobody decided this; it happened one endpoint at a time, each for a good local reason.', 'cam') },

  { t: 'The cost arrives on a specific day', to: true, giua: true, body: cards([['The day a rule must apply everywhere', 'soft-delete, an audit log, a tenant filter, a permission check, a cache.'], ['With a service layer', 'one change, in one place.'], ['With 50 route files talking to the data', 'up to fifty changes — fifty chances to miss one.']], 3) +
    box('What missing one looks like (chapter 8)', 'An IDOR where Binh could read An\'s note — found because someone went looking, not because anything failed.', 'do2') +
    box('Services talking to the data layer is normal', 'Here the "data layer" mostly lives inside services: 382 of 705 import Prisma. The leak that matters is the ROUTE that skips the service.', 'lam') },

  { t: 'When skipping the layer is genuinely fine', to: true, giua: true, body: two(box('A dropdown\'s list of categories', 'Read-only, no authorisation beyond "logged in", no business rule, no reuse. A service that only forwards the call gains nothing.', 'xanh'),
    box('The honest test', 'Not "is there logic here today", but: "if a rule had to apply to every note, would this endpoint get it automatically?" If not, the layer is load-bearing even when it looks empty.', 'cam')) +
    flow([{ t: 'new endpoint', s: 'no logic yet', mau: LAM }, { t: 'a rule arrives', s: 'soft-delete, tenant…', mau: CAM }, { t: 'through a service?', s: 'gets it for free', mau: NODE }, { t: 'straight to prisma?', s: 'forgotten', mau: DO }], { h: 120 }) +
    box('Measured here', '11 of the 150 route files call Prisma and no service at all; 39 more call both. Each is a place a future "everywhere" rule has to be remembered.', 'cam') },

  { t: 'Where the code actually lives', to: true, giua: true, body: TT('c18/layers', 10, 23, 'non-test .ts files and lines per directory · real', { n: 104, hl: [4, 5, 14], sm: true }) +
    two(box('services : routes = 4.8 : 1', '241,068 lines of rules against 50,242 of HTTP plumbing. The web lesson measured 1.9 : 1 when the repo was a quarter of this size.', 'xanh'), box('Why that shape is healthy', 'The plumbing is nearly identical in every app; the rules are the part that is yours. Routes outweighing services usually means logic inside handlers.', 'lam')) },

  { t: 'The layer nobody names: middleware', to: true, giua: true, body: cards([['Authentication (ch. 8)', 'requireAuth on every protected route — forgetting it once is an incident.'], ['Rate limit (ch. 9)', 'one limiter in front of /api/.'], ['Request id (ch. 15)', 'every log line and error carries it.'], ['Error handler (ch. 5)', 'one place turns thrown errors into HTTP.']], 4) +
    box('Cross-cutting concerns live here', 'The things that must happen for every request, regardless of what it does. 6 files, 949 lines in this backend.', 'lam') +
    box('Rule of thumb', 'If forgetting it in one place is a security bug, it should not be something you can forget.', 'cam') },

  { t: 'Middleware order is architecture', to: true, giua: true, body: TT('c18/layers', 25, 35, 'order of app.use in src/index.ts · real', { n: 104, hl: [2, 6, 7], sm: false }) +
    two(box('Request id first (line 261, section "1b")', 'Before helmet, CORS and the rate limiter — so even a request rejected with 429 carries an id.', 'xanh'), box('Move it below the limiter', 'Every rate-limited request becomes untraceable. No test catches it, no error appears: it just stops working on the day you need it.', 'do2')) },

  { t: 'A real trap: order changes behaviour silently', to: true, giua: true, body: flow([{ t: 'request id', s: 'line 261', mau: NODE }, { t: 'helmet, cors', s: '270, 334', mau: LAM }, { t: 'body parsers', s: '375', mau: LAM }, { t: 'rate limit', s: '555', mau: CAM }, { t: 'routers', s: '562 … 114 of them', mau: LAM }, { t: '404 + errors', s: '790, 798', mau: DO }], { h: 130 }) +
    box('Read top to bottom', 'Every request walks this list in order. A piece of middleware can only help requests that reach it.', 'lam') +
    cards([['Chapter 5 met it', 'morgan placed after express.json: malformed JSON got a 400 and NO log line.'], ['Error handler last', 'Mounted before a router, it never sees that router\'s errors.'], ['Rate limit before routers', 'After them, it limits nothing those routers already answered.']], 3) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: bang(['', 'measured 08/11/2026', 'what it means'], [
    ['routes → prisma', '50 / 150 · 11 with no service', 'layering real but not enforced'],
    ['services → prisma', '382 / 705', 'the data layer lives inside services'],
    ['code size', '900 files · 302,781 lines', '~4× the web lesson\'s 80,454'],
    ['services : routes', '4.8 : 1', 'the rules outweigh the plumbing'],
    ['middleware', '6 files · mounted once in index.ts', 'no route can opt out'],
  ], { co: 22, hl: [0] }) + box('Strict where it is load-bearing', 'A route that skips the service writes a slightly awkward query. A route that skips requireAuth is an incident. This backend is strict about the second, relaxed about the first — and that is the right way round.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Notes API has 12 route files; 5 of them call prisma directly. Tomorrow product asks for soft-delete: deleted notes must disappear everywhere. (1) How many places might you have to change, and why is that risky? (2) Which ONE of those 5 could reasonably keep calling prisma? (3) Where must requireAuth live so that no route can forget it?', '') +
    box('Hint', 'Slides 7, 8 and 10.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) The notes service plus up to 5 route files — and missing one is a data leak (chapter 8\'s IDOR shape). (2) A read-only, rule-free list like note categories — if a future rule would not apply to it. (3) In middleware mounted once (per router or globally in index.ts), not copied into each handler.', 'xanh')}</div>` },

  { t: 'Lesson 18.1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['route skips service', '50 / 150 (33%), 11 with no service', 'one rule = one change, not fifty'],
    ['service knows HTTP?', 'no — throws AppError, not res.status', 'reusable by workers, cron, tests'],
    ['code shape', 'services : routes = 4.8 : 1', 'rules should outweigh plumbing'],
    ['middleware', 'request id at line 261, before the limiter', 'order is architecture'],
    ['strictness', 'auth never skipped, layers sometimes', 'be strict where it is load-bearing'],
  ], { co: 22 }) + box('Next: 18.2 — organising by feature, and the 6,113-line file', 'By type or by feature, the real size distribution, and what actually makes a file hard.', 'lam') },
]);
