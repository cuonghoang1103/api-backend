/**
 * node-18-2 — Node.js · Chapter 18 · Lesson 18.2 "Organising by feature, and the 6,113-line file" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-18-2.
 * Nguồn: nodejs-18-2-to-chuc-ma-nguon. Output THẬT: that/c18/files (mã nguồn website @ 9076fb918, chỉ đọc; tệp mã không tính test).
 * Khác web: 150 file route (web 62): <200 91 · 200–500 36 · 500–1000 12 · >1000 11 (web 28/19/8/7) · tệp lớn nhất roadmap.seed.mo-rong.ts 6.113 dòng (web roadmap.seed.ts 3.607,
 *   nay 3.646) · course.routes.ts 3.626 (web 2.554) · social.service.ts 2.503 (web 2.262) · services có 33 thư mục con giữ 560/705 tệp (web 8 thư mục, 82/159) · index.ts 997 dòng,
 *   126 dòng app.use('/api/v1…') (web 808 / 76).
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-18-2', code: 'NODE 18.2', title: 'Organising by feature, and the 6,113-line file', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const B = (src, o = {}) => sql(src, { lang: 'bash', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 18 — Architecture', bai: '18.2' }, [
  { cover: true, t: 'Organising by feature,<br>and the 6,113-line file', sub: 'Where a file lives decides what a developer reads before changing it. Two principles compete, both are defensible — and the one you pick early is nearly impossible to change later.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>By type or by feature — what each one buys and costs</li>
<li>The rule that decides it: optimise for the change you actually make</li>
<li>The real distribution of 150 route files, and the largest files</li>
<li>Why the 6,113-line file is fine — data and logic follow different rules</li>
<li>What actually makes a file hard (it is not the line count)</li>
</ul>` + box('Why it matters to you', 'The structure you pick on day one is the structure you live with in year three. This is one of the few early choices that is expensive to undo.', 'lam') },

  { t: 'By type, or by feature', to: true, giua: true, body: two(B(`# by TYPE — all routes, all services
src/routes/notes.routes.ts
src/routes/messages.routes.ts
src/routes/courses.routes.ts
src/services/notes.service.ts
src/services/messages.service.ts
src/services/courses.service.ts`, { sm: false }), B(`# by FEATURE — one feature together
src/features/notes/
    routes.ts  service.ts  repo.ts
    schema.ts  notes.test.ts
src/features/messages/
    routes.ts  service.ts  repo.ts
    schema.ts  messages.test.ts`, { sm: false })) +
    box('Like a supermarket versus a kitchen drawer per dish', 'By type is the supermarket: every can in one aisle, every vegetable in another. By feature is a box per recipe: everything for one dish in one place. Which is better depends on what you do most often.', 'lam') +
    two(box('Change "notes" by type', 'open routes/, services/, schemas/, tests/ — four folders for one feature.', 'cam'), box('Change "notes" by feature', 'open features/notes/ — everything is there, and nothing else is.', 'xanh')) },

  { t: 'What each one buys, and what it costs', to: true, giua: true, body: cards([['By TYPE — gains', 'Easy to see what a route looks like here. Matches most tutorials. A fast start.'], ['By TYPE — losses', 'Editing ONE feature means opening four or five directories. Deleting a feature means hunting it everywhere.'], ['By FEATURE — gains', 'One directory = one thing. Delete the directory, the feature is gone. The boundary is visible.'], ['By FEATURE — losses', 'Easy to duplicate code between features. Needs discipline about where SHARED code lives.']], 2) +
    box('The rule that decides it', 'Optimise for the change you actually make. Almost nobody edits "all the routes"; they edit "the notes feature". Below ~10 features the difference is noise; above it, by-feature wins — and the migration cost has grown too big to happen.', 'xanh') },

  { t: 'The real distribution: 150 route files', to: true, giua: true, body: TT('c18/files', 4, 8, 'lines per *.routes.ts file · api-backend @ 9076fb918 · real', { n: 104, hl: [2, 5], sm: false }) +
    thanh([['< 200 lines', 91, NODE, '91 files'], ['200 – 500', 36, NODE, '36'], ['500 – 1000', 12, CAM, '12'], ['> 1000', 11, DO, '11']], { w: 1100, x0: 260, wMax: 600, h0: 46, chu: 22, ghi: 'route files by size · real' }) +
    box('127 of 150 under 500 lines', 'Healthy at the bottom: each one is a feature that stayed one feature. The eleven above a thousand are where by-type stopped paying.', 'xanh') },

  { t: 'The largest files', to: true, giua: true, body: TT('c18/files', 10, 18, 'the eight largest code files in src/ · real', { n: 104, hl: [2, 3, 4, 6], sm: false }) +
    two(box('course.routes.ts: 3,626 lines', 'Not "the courses route": enrolment, lessons, progress, quizzes and admin, all sharing a file because they all happened to be routes.', 'cam'), box('The two largest are seed data', 'roadmap.seed.mo-rong.ts (6,113) and roadmap.seed.ts (3,646) describe learning roadmaps, entry after entry.', 'lam')) },

  { t: 'A threshold worth having', to: true, giua: true, body: steps([
    '<b>Under ~300 lines</b> — you scroll to the function you came for',
    '<b>Past ~500</b> — you search for it',
    '<b>Past ~1,000</b> — you search, then read carefully: is the thing you found the only one like it?',
  ]) + box('The real reason to split', 'Usually, when a file crosses that last line it has also crossed from "one thing" into "several things that share a prefix". THAT, not the line count, is the reason to split it.', 'cam') +
    box('No magic number', 'Line-count rules applied without judgement produce a lot of pointless refactoring. The next slide is the counter-example.', 'lam') },

  { t: 'The 6,113-line file, and why it is fine', to: true, giua: true, body: TT('c18/files', 20, 21, 'counting branches and arrow functions (if, else, switch, for, while, =>) · real', { n: 104, hl: [1, 2], sm: false }) +
    two(box('Seed data: 3,646 lines, 42 branches', 'Flat: similar entries one after another, no interaction between them. Nobody navigates it — they search it, and search works the same in one file or twelve.', 'xanh'), box('Logic: 2,503 lines, 246 branches', 'Tangled: every function can call every other one, and understanding one may mean understanding six.', 'do2')) +
    box('Splitting the seed into twelve files makes it harder to read, not easier', 'Same content, more places to look, no interaction removed.', 'cam') },

  { t: 'Data, logic and configuration follow different rules', to: true, giua: true, body: cards([['Flat data', 'seeds, constants, translations. As large as you like: no branching, no interaction. You read it by SEARCHING.'], ['Logic', 'services, routes. Starts to hurt around 500 lines, because every function can call every other one.'], ['Configuration', 'index.ts: 997 lines, 126 app.use(\'/api/v1…\') lines. Fine while it is STRAIGHT-LINE; 997 lines of logic would not be.']], 3) +
    box('Ask "what kind of file is this?" before "how long is it?"', 'The same number of lines means three different things.', 'lam') +
    flow([{ t: 'flat data', s: '3,646 lines · 42 branches', mau: NODE }, { t: 'read by', s: 'searching', mau: NODE }, { t: 'logic', s: '2,503 lines · 246 branches', mau: DO }, { t: 'read by', s: 'following calls', mau: DO }], { h: 110 }) },

  { t: 'What actually makes a file hard', to: true, giua: true, body: steps([
    '<b>The number of REASONS to change</b> — a file that changes when pricing, email AND the schema change is three features sharing one house',
    '<b>Import depth</b> — how many other files must you open to understand this one? Three is fine, ten is not',
    '<b>How many people edit it at once</b> — a file that causes merge conflicts every time is a bottleneck, however long it is',
  ]) + box('Signal 1 is old advice with a bad name', '"Single responsibility" sounds like a rule about size and is really a rule about reasons to change. A 900-line file that only changes when the payment provider changes its API is a good file. A 200-line file touched by three unrelated tickets a week is not.', 'xanh') },

  { t: 'A real trap: a split that is only a page break', to: true, giua: true, body: flow([{ t: 'one big file', s: 'one tangle', mau: CAM }, { t: 'move functions out', s: 'same callers, same calls', mau: CAM }, { t: 'eight files', s: 'the same tangle, now invisible', mau: DO }], { h: 130 }) +
    two(box('If the extracted piece still reaches back', 'into the original, you have not found a boundary — you have found a page break.', 'do2'), box('A real split', 'leaves both halves understandable on their own. If that is not yet true, leave it as one file until you know where the seam is.', 'xanh')) +
    cards([['Page break', 'pricing.ts imports invoice internals; invoice.ts imports pricing internals. Two files, one tangle.'], ['Boundary', 'pricing.ts exports price(items); invoice.ts only calls that. Each can change without opening the other.']], 2) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c18/files', 23, 26, 'subdirectories of src/services, and src/index.ts · real', { n: 104, hl: [1, 2], sm: false }) +
    two(box('By type at the top, by feature underneath', '33 subdirectories now hold 560 of the 705 service files — work/ alone 306. The web lesson counted 8 subdirectories and 82 of 159.', 'xanh'), box('Nobody planned a migration', 'The structure bent where the pressure was: the features that grew large got their own folder. Healthier than a scheme imposed on day one that nothing has tested.', 'lam')) +
    box('The pressure still shows at the top', 'course.routes.ts (3,626) and work.routes.ts (2,272) are the two route files that grew into several features sharing a prefix.', 'cam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'You have three files: (A) translations.vi.ts, 4,000 lines of key–value pairs; (B) billing.service.ts, 700 lines that change whenever pricing, invoices or tax rules change; (C) admin.routes.ts, 300 lines edited by three people every week. (1) Which one would you split first, and why? (2) Which one would you leave alone, however long it gets? (3) What would you check before splitting B?', '') +
    box('Hint', 'Slides 9, 10 and 11.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) B — three reasons to change (pricing, invoices, tax) sharing one house; maybe C next, because of merge conflicts. (2) A — flat data, read by searching. (3) That each extracted part would not reach back into the others: if pricing still calls invoice internals, it is a page break, not a boundary.', 'xanh')}</div>` },

  { t: 'Lesson 18.2 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['route files', '91 / 36 / 12 / 11 by size', 'most features stay one feature'],
    ['largest file', 'seed data, 6,113 lines', 'flat data can be any size'],
    ['seed vs service', '42 vs 246 branches', 'complexity, not length'],
    ['services/', '33 folders hold 560 of 705', 'structure bends where the pressure is'],
    ['splitting', 'boundary or page break?', 'split by reasons to change'],
  ], { co: 22 }) + box('Next: 18.3 — coupling, and 608 models in one schema', 'What the import graph shows, and the coupling it cannot see.', 'lam') },
]);
