/**
 * ts-04-1 — TypeScript · Chapter 4 · Lesson 4.1 "Object shapes: required, optional & readonly properties" (01/11/2026). Slug: typescript-4-1-dang-object.
 * Mọi mã/output lấy từ content/courses/typescript/s04/_ma-ts-04-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, js, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s04/_ma-ts-04-1.mjs';

export const deck = { key: 'ts-04-1', code: 'TS 4.1', title: 'Object shapes', sub: 'required, optional & readonly properties' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noComment = (s) => L(s).filter((l) => !/^\s*\/\//.test(l)).join('\n').replace(/\n\n+/g, '\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Objects, interfaces & type aliases', bai: '4.1' }, [
  { cover: true, t: 'Object shapes:<br>required, optional &amp; readonly properties', sub: 'Chapter 4 · Lesson 4.1 — the first piece of LabFlow’s data model' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Chapter 4 goal: LabFlow’s data model — ${c('Lab')}, ${c('User')}, ${c('BookingRecord')} — and pass <b>Lab 4</b></li>
    <li>Name a shape once; the four rules: <b>required</b>, <b>excess</b>, <b>optional</b>, <b>readonly</b></li>
    <li>The trap: the typo check needs a <b>fresh literal</b> — and ${c('?')} to silence tsc rebuilds the bug</li>
    <li>Absent is not empty: ${c('undefined')} vs ${c('[]')}</li>
    <li>${c('readonly')} is shallow — a shared array still changes</li>
    <li>Nested shapes, and <b>structural typing</b> (shape, not name)</li></ul>` },
  { t: 'JavaScript takes any key', body: js(noComment(CODE.typoJs), { hl: [4] }) + tc(OUT['11-js-typo'], { title: 'terminal — Node 22.23.3' }) +
    two(box('A typo is just a new key', `${c('capasity')} became a property; ${c('lab.capacity')} is ${c('undefined')} → ${c('NaN')}. Exit code 0.`, 'do2'),
      box('And it is saved', 'The wrong key goes to the database. The next screen reads capacity and finds nothing.', 'do2')) },
  { t: 'Describe the shape once, give it a name', body: two(ts(pick(CODE.shapeLab, 3, 8), { hl: [2, 3, 4] }), tc(OUT['12-shape'], { wrap: 60 })) + ts(pick(CODE.shapeUse, 4, 10), { sm: true, hl: [1, 5] }) +
    box('One name, many uses', `${c('code: LabCode')} (Chapter 2) — only the three real labs fit. Inline shapes mean the same, but a name shows up in every error message.`, 'xanh') },
  { t: 'Rule 1 — every required property must be there', body: ts(pick(CODE.missing, 2, 5), { sm: true }) + tc(OUT['13-missing'], { wrap: 100 }) +
    two(box('TS2741 · TS2739', 'One missing property is named; several are listed after the colon.', 'lam'),
      box('TS2322', `The column points at the value: ${c("capacity: '40'")} — a form field is text.`, 'lam')) },
  { t: 'Rule 2 — no unknown keys in a literal', body: ts(pick(CODE.excess, 2, 4), { sm: true }) + tc(OUT['14-excess'], { wrap: 92 }) + box('Two codes', `${c('TS2353')}: a key the type does not have · ${c('TS2561')}: a key that looks like a real one — tsc suggests the right name.`, 'lam') +
    two(box('The excess property check', `A literal assigned straight to ${c('Lab')} may only use the keys ${c('Lab')} declares. A near miss gets <b>“Did you mean to write 'capacity'?”</b>`, 'xanh'),
      box('The JavaScript bug, caught', `Plain JS saved ${c('capasity')} and printed ${c('NaN')}. Here the same typo stops the build, with the right name suggested.`, 'lam')) },
  { t: 'Trap: the typo check needs a fresh literal', body: ts(pick(CODE.freshStrict, 14, 18), { sm: true, hl: [2, 3] }) +
    two(tc(OUT['15-fresh-strict'], { title: 'capacity required — still refused, no “Did you mean”', wrap: 54 }),
      tc(OUT['16-fresh-loose'], { title: 'capacity?: number + “?? 0” — 0 errors', wrap: 54 })) +
    box('Every step “fixed an error”', `Optional to silence TS2741, then ${c('?? 0')} to silence TS18048 → the typo is legal and the screen says −12. Type the object where it is created; make a property optional only when missing is real.`, 'do2') },
  { t: 'Rule 3 — optional: absent is not empty', body: two(`<div>${ts(pick(CODE.optional, 3, 12), { sm: true, hl: [5, 9] })}${tc(OUT['17-optional'], { wrap: 56 })}</div>`,
      tc(OUT['18-optional-run'], { title: 'node optional/fixed.ts', wrap: 56 }), 'r46') +
    box('Two different answers', `${c('undefined')} = not recorded yet · ${c('[]')} = recorded, nothing there. ${c('equipment?.length ?? 0')} prints 0 for both — fine for a count, wrong where the difference matters.`, 'lam') },
  { t: 'Rule 4 — readonly, and why it is shallow', body: ts(pick(CODE.roShallow, 13, 18), { sm: true, hl: [2, 3, 4] }) +
    two(tc(OUT['19-ro-tsc'], { wrap: 56 }), tc(OUT['20-ro-run'], { title: 'node run.ts — push compiles', wrap: 56 })) +
    box('readonly protects the property, not the array inside', `Both labs got their list from the same ${c('STANDARD')} array, so BE-202 got BE-201’s GPU.`, 'do2') },
  { t: 'readonly all the way down', body: ts(pick(CODE.roDeep, 2, 16), { sm: true, hl: [6, 9, 12, 13] }) + tc(OUT['21-ro-deep'], { wrap: 100 }) +
    two(box(c('readonly string[]'), `No ${c('push')} on the type (TS2339). Change = build a <b>new</b> object with spread.`, 'xanh'),
      box('Compile-time only', `Erased before Node runs. ${c('Object.freeze')} is the runtime lock (also shallow).`, 'lam')) },
  { t: 'Shape, not name: structural typing', body: ts(pick(CODE.structural, 2, 12), { sm: true, hl: [3, 9, 10] }) + tc(L(OUT['23-structural']).slice(0, 2).join('\n'), { wrap: 100 }) +
    box('Shape, not name', `${c('Classroom')} never mentions ${c('Lab')} and still fits: it has everything ${c('Lab')} needs. Java compares names (${c('implements')}); TypeScript compares shapes.`, 'lam') },
  { t: 'Which property form, when', body: cards([
      [c('capacity: number'), 'Required — the default. Missing is TS2741 / TS2739.'],
      [c('equipment?: string[]'), '“Not known yet” is real. Check before use (TS18048).'],
      [c('note: string | null'), 'Always there, may be empty — a nullable column.'],
      [c('readonly code'), 'Identity: set once, reassigning is TS2540.'],
      [c('readonly string[]'), 'A list others may share: no push (TS2339), use spread.'],
      ['Next · 4.2', `Two ways to name a shape: ${c('interface')} vs ${c('type')}.`],
    ], 3) },
]);
