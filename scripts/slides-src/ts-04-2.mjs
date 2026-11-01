/**
 * ts-04-2 — TypeScript · Chapter 4 · Lesson 4.2 "interface vs type alias" (01/11/2026). Slug: typescript-4-2-interface-vs-type.
 * Mọi mã/output lấy từ content/courses/typescript/s04/_ma-ts-04-2.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 * Số đếm backend cuongthai.com: git ls-files "src/*.ts" + grep, commit 88ec543b0 (01/11/2026).
 */
import { lamDeck, ts, tc, two, box, steps, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s04/_ma-ts-04-2.mjs';

export const deck = { key: 'ts-04-2', code: 'TS 4.2', title: 'interface vs type alias', sub: 'two ways to name a shape — and three real differences' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noComment = (s) => L(s).filter((l) => !/^\s*\/\//.test(l)).join('\n').replace(/\n\n+/g, '\n');
const MODEL = `// src/rules/model.ts (Lab 4) — the course convention
export interface Lab { readonly code: LabCode; name: string; … }
export interface User extends Entity { email: string; role: Role; … }

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type BookingView = BookingRecord & { labName: string; userName: string };`;
const STAT = (n, t) => `<div style="text-align:center;padding:14px 8px;border-radius:12px;background:#f4f7fb"><div style="font-size:54px;font-weight:800;color:#2b5fae">${n}</div><div style="font-size:22px">${t}</div></div>`;

export const slides = lamDeck({ chuong: 'Chapter 4 — Objects, interfaces & type aliases', bai: '4.2' }, [
  { cover: true, t: 'interface vs type alias', sub: 'Chapter 4 · Lesson 4.2 — two ways to name a shape, three real differences' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Both spellings check an object the same way</li>
    <li>Difference 1: same-named interfaces <b>merge</b> — a trap, and a tool (augmentation)</li>
    <li>Difference 2: only ${c('type')} names unions, tuples, function types</li>
    <li>Difference 3: ${c('extends')} and ${c('&')} report conflicts in different places</li>
    <li>What this website’s backend does — measured</li>
    <li>One rule for your project: the one LabFlow uses in Lab 4</li></ul>` },
  { t: 'Two spellings, the same checks', body: two(ts(pick(CODE.both, 3, 14), { sm: true }), `<div>${ts(pick(CODE.both, 15, 18), { sm: true, hl: [3] })}${box('Interchangeable', `Same shape ⇒ a ${c('LabI')} is a ${c('LabT')} (structural typing, 4.1).`, 'lam')}</div>`) +
    tc(OUT['11-both'], { wrap: 100 }) },
  { t: 'Difference 1 — same-named interfaces merge', body: ts(noComment(CODE.merge), { sm: true, hl: [9, 10, 11, 12] }) + tc(OUT['12-merge'], { wrap: 100 }) +
    box('No error at the second declaration', `The two ${c('User')} became one with four properties. The error lands where an object is created — and never mentions line 13.`, 'do2') },
  { t: 'Trap: a red build, a green run', body: two(`<div>${tc(OUT['13-merge-run'], { title: 'node merge/user.ts — types are erased' })}${box('Exit code 0', 'Node never sees interfaces. The build is red, the program runs, and the message points at innocent code.', 'do2')}</div>`,
      `<div>${ts(noComment(CODE.dup), { sm: true })}${tc(OUT['14-dup'], { title: 'the same mistake with type aliases', wrap: 52 })}</div>`) +
    box('Rule of thumb', `“Property X is missing” for a property you never wrote? Search the project for a <b>second declaration</b> with the same name.`, 'lam') },
  { t: 'When merging is exactly what you want', body: ts('// cuongthai.com backend — src/middleware/auth.ts (excerpt)\n' + pick(CODE.excerpt, 1, 99), { hl: [4, 5, 6] }) +
    two(box('Augmentation', `Express declares ${c('interface Request')}; this file declares it again and the two merge — ${c('req.userId')} type-checks in every route.`, 'xanh'),
      box('Only an interface can do this', 'Chapter 10 builds the same thing for LabFlow. Until then: a second declaration of your own interface is a bug.', 'lam')) },
  { t: 'Difference 2 — only type names unions, tuples, functions', body: ts(pick(noComment(CODE.union), 1, 99), { sm: true, hl: [5] }) + tc(OUT['15-union'], { wrap: 100 }) +
    ts(pick(noComment(CODE.extunion), 3, 99), { sm: true, hl: [2] }) + tc(OUT['16-extunion'], { wrap: 100 }) },
  { t: 'Difference 3 — extends vs &amp;: where conflicts show', body: steps([
      `An interface “creates a single flat object type that <b>detects property conflicts</b>”`,
      `An intersection “just recursively merges properties, and in some cases produce[s] <b>never</b>”`,
      'Interfaces display better in error messages, and their relationships are cached',
    ]) + box('Source', 'TypeScript team — Performance wiki, “Preferring Interfaces Over Intersections”. Lesson 4.3 measures the conflict on LabFlow’s Entity.', 'lam') },
  { t: 'Measured on this website’s backend', body: zm(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${STAT('896', 'non-test .ts files')}${STAT('1,460', 'interface declarations')}${STAT('890', 'type aliases')}</div>`, 1) +
    two(box('What the aliases are', `Only <b>123</b> are a plain object ${c('= {')}; <b>224</b> start with a string literal — unions of roles and statuses.`, 'lam'),
      box('And Prisma?', `Its generated models are ${c('export type User = $Result.DefaultSelection<…>')} — computed types, which only ${c('type')} can name.`, 'lam')) +
    `<p style="font-size:18px;color:#667">cuongthai.com backend, commit 88ec543b0, counted with git ls-files + grep, 1 Nov 2026.</p>` },
  { t: 'The rule this course uses', body: ts(MODEL, { hl: [2, 3, 5, 6] }) +
    two(box(c('interface'), 'A named object shape: entity, component props, request / response body.', 'xanh'),
      box(c('type'), `Everything else: unions, tuples, function types, ${c('&')} compositions, computed types.`, 'xanh')) +
    box('Consistency beats the choice', `Teams that use ${c('type')} everywhere are fine too. What is never fine: one name declared twice.`, 'lam') },
  { t: 'interface or type — what actually differs', body: zm(`<table class="t"><tr><th>Question</th><th>interface</th><th>type alias</th></tr>
    <tr><td>Name an object shape</td><td>✓</td><td>✓ same checks</td></tr>
    <tr><td>Same name twice</td><td><b>merges silently</b></td><td>TS2300</td></tr>
    <tr><td>Union, tuple, function type</td><td>✗ TS1005</td><td>✓</td></tr>
    <tr><td>Build on another type</td><td>${c('extends')} shapes only (TS2312), conflicts at the declaration</td><td>${c('&')} anything, conflicts later</td></tr>
    <tr><td>Computed types (Ch7–8)</td><td>✗</td><td>✓</td></tr>
    <tr><td>Augment a library’s type</td><td>✓ (Ch10)</td><td>✗</td></tr></table>`, 1.1) },
  { t: 'Choosing in four questions', body: steps([
      `Not an object shape (union, tuple, function, computed)? → ${c('type')}`,
      `Adding fields to a library’s type? → ${c('interface')} in ${c('declare global')} / ${c('declare module')}`,
      `A named entity, props, DTO? → ${c('interface')} (this course)`,
      'Whatever you pick: one name per shape, never declared twice',
    ]) + box('Next · 4.3', `Build big shapes from small ones: ${c('interface User extends Entity')} and ${c('BookingRecord & { labName }')}.`, 'xanh') },
]);
