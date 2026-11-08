/**
 * node-18-3 — Node.js · Chapter 18 · Lesson 18.3 "Coupling: 608 models in one schema" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-18-3.
 * Nguồn: nodejs-18-3-ghep-noi-ranh-gioi. Output THẬT: that/c18/coupling (mã nguồn website @ 9076fb918, chỉ đọc; tệp mã không tính test).
 * Khác web: được import nhiều nhất nay là work/permissions 143× · work/common 111× (web: pro.service 7×, nay 39×, và pro.service import 0 service — web ghi 5) ·
 *   import nhiều service nhất: work/toolRegistry/parity3 54× · cron.service 40× · 28 cặp service import lẫn nhau · schema 608 model, 17.569 dòng, 243 migration
 *   (web 248 / 6.980 / 95) · 126 dòng app.use('/api/v1…') (web 76) · social.service 2.503 dòng, 4 tệp import (web 2.262 / 5) · prisma.user được chạm từ 57 chỗ.
 */
import { lamDeck, two, box, cards, flow, bang, TT, thanh, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-18-3', code: 'NODE 18.3', title: 'Coupling: 608 models in one schema', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const JS = (src, o = {}) => sql(src, { lang: 'javascript', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 18 — Architecture', bai: '18.3' }, [
  { cover: true, t: 'Coupling:<br>608 models in one schema', sub: 'Two modules are coupled when changing one forces you to change the other. Some coupling is the point; the question is which you accept — measured, not guessed.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Measuring coupling with the import graph — the real hubs</li>
<li>Healthy, painful, circular and hidden coupling</li>
<li>The coupling the import graph cannot see: one schema, 608 models</li>
<li>Which boundaries are real, from a folder to a separate database</li>
<li>Reducing coupling without splitting anything</li>
</ul>` + box('Why it matters to you', 'The couplings you accept quietly decide what you can change later, and how expensive every future decision is.', 'lam') },

  { t: 'Measure it instead of guessing', to: true, giua: true, body: TT('c18/coupling', 4, 11, 'services imported by the most other code files · api-backend @ 9076fb918 · real', { n: 104, hl: [2, 3, 8], sm: false }) +
    two(box('The hubs are stable concepts', 'work/permissions (143 files) answers "may this person do this?"; work/common, audit, events, constants. Everything depends on them — and they rarely change.', 'xanh'), box('pro.service: 39 importers, 0 dependencies', '"Is this user Pro?" is asked everywhere, and the answer depends on nothing else. The web lesson measured 7 importers and 5 dependencies.', 'lam')) },

  { t: 'Who depends on the most', to: true, giua: true, body: TT('c18/coupling', 13, 21, 'services that import the most other services · real', { n: 104, hl: [3, 9], sm: false }) +
    two(box('Fan-out is not bad by itself', 'cron.service imports 40 services because its job IS to schedule 40 jobs. A registry that wires 54 commands together is a switchboard.', 'lam'), box('social.service: 2,503 lines, 4 importers', 'Large but no longer a hub (the web lesson: 5). Size plus many importers is the combination that makes change slow.', 'cam')) },

  { t: 'Four kinds of coupling', to: true, giua: true, body: cards([['HEALTHY', 'Many places depending on a STABLE concept: authentication, permissions, logging, configuration. They rarely change.'], ['PAINFUL', 'Many places depending on something CONSTANTLY CHANGING: a feature service still evolving.'], ['CIRCULAR', 'A calls B and B calls A. Neither can be tested or understood alone. Always worth fixing.'], ['HIDDEN', 'Two modules sharing a table without importing each other. The import graph CANNOT see it.']], 2) +
    box('Like a power strip', 'Twenty devices plugged into one wall socket is fine — the socket does not change. Twenty devices plugged into each other is a fire.', 'lam') },

  { t: 'Circular coupling, counted', to: true, giua: true, body: TT('c18/coupling', 23, 26, 'pairs of services that import each other (A → B and B → A) · real', { n: 104, hl: [1], sm: false }) +
    flow([{ t: 'agent/turn', s: 'imports agent/compact', mau: CAM }, { t: 'agent/compact', s: 'imports agent/turn', mau: CAM }, { t: 'one unit, two files', s: 'change and test together', mau: DO }], { h: 130 }) +
    box('28 pairs in 705 service files — 19 of them inside work/', 'Each pair cannot be changed, tested or understood alone. In ES modules a cycle can also mean a value is still undefined when the other file reads it at load time.', 'cam') },

  { t: 'The coupling the import graph cannot see', to: true, giua: true, body: TT('c18/coupling', 28, 29, 'one schema, one client, every feature · real', { n: 104, hl: [1], sm: false }) +
    cards([['608 models, 243 migrations', 'courses, messages, music, finance, language, interview, CV builder, games, CT Work — all in one database, one generated client.'], ['Coupled without importing', 'One feature adds a column another\'s SELECT * now returns, renames a table, or holds a lock the other waits on.'], ['The largest shared object', 'In most systems it is the database — and it is invisible to every dependency analysis you will run.']], 3) +
    box('A typical way it bites', 'Feature A adds users.passwordResetToken. Feature B\'s admin export selects every column of users — and now ships that token in a CSV. Neither file imports the other.', 'do2') },

  { t: 'Which tables are shared, measured', to: true, giua: true, body: TT('c18/coupling', 31, 36, 'prisma.<model>.find/create/update/… counted per service folder or route file · real', { n: 104, hl: [2], sm: false }) +
    thanh([['prisma.user', 57, DO, '57 places'], ['prisma.note', 13, CAM, '13'], ['prisma.course', 12, CAM, '12']], { w: 1100, x0: 330, wMax: 560, h0: 46, chu: 22, ghi: 'separate places that query the table directly · real' }) +
    box('Two "independent" modules sharing a table are one module with two names', 'Change the users table and 57 places may need to know — a floor: each service folder counts once, raw SQL not at all.', 'do2') },

  { t: 'Which boundaries are real', to: true, giua: true, body: bang(['boundary', 'how real', 'the price'], [
    ['a directory', 'NOT a boundary — nothing stops an import straight through', 'nothing'],
    ['a module with explicit exports', 'weak — a facade, but people import the inside anyway', 'a little discipline'],
    ['a separate package / workspace', 'REAL — importing the inside is a compile error', 'you now manage versions'],
    ['a separate process (service)', 'the hardest — only the network connects them', 'every call can fail (18.4)'],
    ['a separate database', 'the final one — no more JOINs', 'this is where the pain begins'],
  ], { co: 21, hl: [2] }) + box('Pick the level for what you need enforced', 'A folder called domain/ that anything can import from is not a boundary; it is a wish.', 'cam') },

  { t: 'Reduce coupling without splitting: depend on a shape', to: true, giua: true, body: JS(`// tight: notes KNOWS about email
import { sendEmail } from './email.service.js';
async function share(note, to) { await sendEmail(to, 'New note', note.title); }

// loose: notes only knows "there is a function (to, subject, body)"
async function share(note, to, notify) { await notify(to, 'New note', note.title); }`, { sm: false, hl: [2, 6] }) +
    two(box('The dependency inverts', 'The caller passes the function in. The email module can change freely; notes never imports it.', 'xanh'), box('The test gets easy', 'Chapter 14: pass a fake notify and assert what it received. No mail server, no mocking library.', 'lam')) +
    box('Same idea as plugging into a socket, not wiring into the wall', 'notes needs "something that can notify". It should not care whether that is email, a push message or a test spy.', 'cam') },

  { t: 'Two more techniques that cost nothing structural', to: true, giua: true, body: cards([['Communicate by event', '"A note was shared" is a fact. Who cares — email, notifications, analytics — is not the note module\'s business. Chapter 13\'s queue makes that boundary durable.'], ['Push shared concepts DOWN', 'If two features both need "is this user Pro?", it belongs in a layer below both — not in one of them that the other imports.'], ['Watch the direction', 'A hub is healthy while it depends on nothing above it. pro.service here: 39 importers, 0 imports.']], 3) +
    flow([{ t: 'notes', s: 'publishes "shared"', mau: NODE }, { t: 'queue / event', s: 'the boundary', mau: CAM }, { t: 'email', s: 'subscriber', mau: LAM }, { t: 'notifications', s: 'subscriber', mau: LAM }], { h: 120 }) },

  { t: 'A real trap: the code nobody uses', to: true, giua: true, body: cards([['It still costs', 'An unused feature still constrains every schema change, appears in every dependency scan, breaks every refactor and must keep compiling.'], ['The cheapest decoupling is deleting', 'This project removed its old /admin/messages page on purpose when support threads merged into /messages.'], ['And wrote "do not recreate it" down', 'In its own instructions — because the strongest force in a codebase is someone helpfully adding back what was removed on purpose.']], 3) +
    box('Deleting is a design decision', 'Record why it was removed, or it will come back.', 'cam') +
    flow([{ t: 'remove the feature', s: 'on purpose', mau: NODE }, { t: 'write down why', s: 'next to the code', mau: NODE }, { t: 'six months later', s: 'someone "helps"', mau: CAM }, { t: 'reads the note', s: 'does not re-add it', mau: NODE }], { h: 110 }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: bang(['', 'measured 08/11/2026', 'what it says'], [
    ['schema', '608 models · 17,569 lines · 243 migrations', 'a monolith by any measure'],
    ['route groups', '126 app.use(\'/api/v1…\') lines', 'one process serves them all'],
    ['top hubs', 'work/permissions 143× · pro.service 39× (0 imports)', 'shared concepts, depending on nothing above'],
    ['cycles', '28 pairs of services import each other', 'mostly inside work/ (19) and agent/ (6)'],
    ['shared table', 'prisma.user from 57 places', 'the coupling no import graph shows'],
  ], { co: 21, hl: [2] }) + box('Coherent, because the coupling mostly points one way', 'Features depend on shared concepts; shared concepts do not depend on features. That is what keeps a 600-model monolith changeable.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'In your Notes API: notes.service imports email.service to send "note shared" mails, and email.service imports notes.service to put the note title in the template. Separately, notes.service and stats.service both run raw SQL on the notes table. (1) Name the two kinds of coupling. (2) Break the first one without splitting anything. (3) Why will a dependency scanner never warn you about the second?', '') +
    box('Hint', 'Slides 5, 6 and 10.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) Circular (notes ⇄ email) and hidden (two modules sharing the notes table). (2) Pass a notify(to, subject, body) function into share — or publish a "note shared" event — and give the template the title as data; email no longer imports notes. (3) The two modules never import each other; they meet in the database.', 'xanh')}</div>` },

  { t: 'Lesson 18.3 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['hubs', 'permissions 143× · pro 39× (0 imports)', 'depend on stable things'],
    ['cycles', '28 pairs', 'always worth breaking'],
    ['hidden', 'prisma.user from 57 places', 'the schema is the biggest shared object'],
    ['boundaries', 'folder < module < package < service < database', 'pick by what must be enforced'],
    ['techniques', 'inject a function · publish an event · push down', 'decouple without splitting'],
  ], { co: 22 }) + box('Next: 18.4 — monolith or services: deciding with numbers', 'What splitting buys, what it costs, and the three signals that survive measurement.', 'lam') },
]);
