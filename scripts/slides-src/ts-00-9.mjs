/**
 * ts-00-9 — TypeScript · Section 0 · "Start here (2/2): real incidents, and how to learn without giving up" (01/11/2026).
 * Slug bài: typescript-0-9-bat-dau-tai-day-2. Output = chạy thật Node 22.23.3 + tsc 7.0.2 trên labflow-ts/demo0/ts-00-9
 * (su-co: sự cố seed 08/08/2026 thu nhỏ · undefined: Cannot read properties of undefined · units: xem trước branded types).
 */
import { lamDeck, ts, tc, two, box, steps, cards, flow, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s00/_ma-ts-00-9.mjs';

export const deck = { key: 'ts-00-9', code: 'TS 0.9', title: 'Start here (2/2)', sub: 'Real incidents, and how to learn without giving up' };

// Keep only lines, never edit them: drop Node's internal stack frames and the version footer.
const gon = (t) => t.split('\n').filter((l) => !/^\s+at (ModuleJob|async )|^Node\.js v|^$/.test(l)).join('\n');
const SEED = CODE.seed.split('\n').slice(3, 13).join('\n');
const FIXED = CODE.seedFixed.split('\n').slice(1, 9).join('\n');

export const slides = lamDeck({ chuong: 'Section 0 — Start here', bai: '0.9' }, [
  { cover: true, t: 'Start here (2/2):<br>real incidents, and how to learn without giving up', sub: 'What types catch, what they miss — and a study plan you can keep' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What research measured: <b>15%</b> of public bugs, Airbnb’s reported <b>38%</b></li>
    <li>A real incident on this website — <b>reproduced</b> on your machine</li>
    <li>The everyday crash: <b>Cannot read properties of undefined</b></li>
    <li>Mars Climate Orbiter: why units can be types (a preview)</li>
    <li>Why beginners give up on TypeScript — and the antidote</li>
    <li>Two paths through the course, and the rhythm of one lesson</li></ul>` },
  { t: 'What research says: 15% and 38%', body: cards([
      ['📄 Gao, Bird &amp; Barr — ICSE 2017', '400 real bugs from public JavaScript projects. Annotate the buggy code, run the checker: <b>TypeScript 2.0 and Flow 0.30 each flag 15%</b> — bugs that had already passed tests and review.'],
      ['🏠 Airbnb — reported 2019–2020', 'A postmortem analysis by Brie Bunge estimated <b>38%</b> of bugs in Airbnb’s code could have been prevented by TypeScript (talk at JSConf Hawaii 2019, reported by InfoQ, Aug 2020).'],
    ], 2) + box('Read the numbers honestly', `Neither number is 100%. Types remove a whole <b>class</b> of mistakes — wrong names, wrong shapes, missing cases. Wrong business logic still compiles, so you keep your tests.`, 'lam') },
  { t: 'This website, 8 Aug 2026: one rename, a broken seed', body: steps([
      `The enum value ${c('ContentType.CODE')} was renamed to ${c('CODE_REVIEW')} to match the frontend`,
      `The whole pre-push checklist was green, ${c('tsc --noEmit')} included`,
      `On production the <b>seed script</b> broke: ${c('prisma/seed.ts')} kept a <b>hand-written copy</b> of the old union`,
      `The main tsconfig excluded ${c('prisma/**')} — nobody type-checked that copy`,
      `Fix: import the real type + a second check, ${c('npm run typecheck:seed')}`,
    ]) + flow([
      { t: 'rename', s: 'CODE → CODE_REVIEW', mau: '#336791' },
      { t: 'tsc green', s: 'seed not included', mau: '#2f7d4f' },
      { t: 'deploy', s: 'seed runs', mau: '#b85a2b' },
      { t: 'broken', s: 'stale value', mau: '#c0392b' },
    ], { h: 130, fs: 20 }) + box('The lesson for you', `A hand-written copy of a type is a <b>second truth</b> that nobody updates. And a check only protects the files it actually reads — so know what your ${c('tsconfig')} includes.`, 'do2') },
  { t: 'The miniature: green check, red run', body: ts(SEED, { sm: true, hl: [1, 5] }) +
    two(tc('$ npx tsc -p demo0/ts-00-9/su-co\n[exit 0]', { title: 'tsc — seed.ts is not included' }),
      tc(gon(OUT['92-seed-chay']).split('\n').filter((l) => !/^\s+at |^\s+\^|throw new|db\.ts:8$|^\$ /.test(l)).join('\n') + '\n[exit 1]', { title: 'node app.ts && node seed.ts', wrap: 54 })) +
    box('Green is not the same as checked', `The check passed because it never <b>looked</b> at ${c('seed.ts')}. The copy said ${c("'CODE'")} was fine; the database disagreed — at run time.`, 'do2') },
  { t: 'Check the seed too: the compiler explains why', body: tc(OUT['93-tsc-seed'] + '\n[exit 1]', { title: 'tsc -p tsconfig.seed.json', wrap: 96 }) +
    two(box('Read it bottom-up', `The last line is the root cause: ${c('"CODE"')} is not in the real ${c('ContentType')}. The lines above explain how it got there.`, 'lam'),
      box('Two types, one name', `${c('ContentType')} and ${c('import("…/types").ContentType')} are <b>different</b> types that happen to share a name — the copy.`, 'do2')) },
  { t: 'The real fix: one definition, imported', body: ts(FIXED, { sm: true, hl: [1, 6] }) +
    two(tc(OUT['94-tsc-fixed'] + '\n[exit 1]', { title: 'tsc — the copy is gone', wrap: 54 }),
      tc(OUT['9c-luyen'] + '\n[exit 1]', { title: 'then: rename QUIZ → EXAM in types.ts only', wrap: 54 })) +
    box('One source of truth', `With ${c('import type')} the error moves to the exact data line. Rename once, and tsc lists <b>every</b> place that must follow.`, 'xanh') },
  { t: 'The everyday crash: Cannot read properties of undefined', body: two(
      tc(gon(OUT['96-undef-js']).split('\n').filter((l) => !/^\s+at |^\s+\^|^file:/.test(l)).join('\n') + '\n[exit 1]', { title: 'node labs.js — JavaScript', wrap: 46 }),
      tc(OUT['97-undef-tsc'] + '\n[exit 1]', { title: 'tsc — the same code as .ts', wrap: 46 })) +
    ts("return LABS.find((lab) => lab.code === code).seats;", { sm: true }) +
    box('Why tsc knew', `${c('find')} returns <b>the lab or undefined</b>. Strict mode makes you decide what happens when the lab does not exist — before a user asks for BE-209.`, 'lam') },
  { t: 'Mars Climate Orbiter: units are types too (preview)', body: two(
      `<div>${box('23 September 1999', `NASA lost a $327.6-million spacecraft. The Mishap Investigation Board (report of 10 Nov 1999): ground software produced thruster data in <b>English units</b> (pound-force seconds); navigation expected <b>metric</b> (newton-seconds).`, '')}${box('Preview of Chapter 16', `Two numbers with different <b>meaning</b> can get different types, so mixing them is a compile error.`, 'lam')}</div>`,
      `<div>${tc(OUT['9a-units-tsc'] + '\n[exit 1]', { title: 'tsc — impulse.ts', wrap: 52 })}${tc(OUT['9b-units-chay'] + '\n[exit 0]', { title: 'node — runs anyway', wrap: 52 })}</div>`, 'r46') },
  { t: 'Two situations every student team knows (illustrations)', body: cards([
      ['A · The rename before the demo', `The backend renames ${c('roomId')} to ${c('labId')}. The React page still reads ${c('booking.roomId')} — <b>undefined</b>, a blank table, in front of the lecturer. With one shared ${c('Booking')} type, the build turns red the night before.`],
      ['B · Seats arrive as a string', `The API sends ${c('"seats": "31"')}. ${c("'31' > 30")} is true in JS by luck, but ${c("'31' + 1")} is ${c("'311'")}. Types inside the app are only as true as the data at the door — Chapter 13 checks it with Zod.`],
    ], 2) + box('Not real reports', 'These two are illustrations built from the kinds of bugs this lesson measured — not stories about a real team.', 'lam') },
  { t: 'Why beginners give up — and the antidote', body: zm(`<table class="t">
    <tr><th>What it feels like</th><th>What this course does</th></tr>
    <tr><td>A wall of red the moment strict mode is on</td><td>Read the <b>first</b> error only; most of the rest follow from it (lesson 0.2)</td></tr>
    <tr><td>Error messages five lines long</td><td>Read them <b>bottom-up</b>: the last line is the cause</td></tr>
    <tr><td>${c('any')} makes the red go away</td><td>Lab 1 measures it: all-${c('any')} code refused only <b>1 of 8</b> wrong calls</td></tr>
    <tr><td>Generics look like algebra</td><td>Not before Chapter 6 — and always on LabFlow code, not ${c('Foo<T>')}</td></tr>
    <tr><td>“Is this even worth it?”</td><td>Every chapter shows a bug tsc catches and Node does not</td></tr></table>`, 1.12) },
  { t: 'Two paths, and the rhythm of one lesson', body: two(zm(`<table class="t">
    <tr><th></th><th>Minimum</th><th>Full</th></tr>
    <tr><td>Chapters</td><td>0, 1–6, 9, 11, 13</td><td>0–16 in order</td></tr>
    <tr><td>Time</td><td>≈ 30 h · 4–5 weeks</td><td>≈ 60–70 h · 10–12 weeks</td></tr>
    <tr><td>Labs</td><td>Labs of those chapters</td><td>Every lab + final project</td></tr>
    <tr><td>Good for</td><td>SDN302 / SWP391 backend now</td><td>Internship, real team work</td></tr></table>`, 1.0),
      steps(['<b>Slides</b> ≈ 10 min', '<b>Written lesson</b> — type and run ≈ 30 min', '<b>🧪 Practice</b> 15 min, with “Done when”', '<b>Code Lab</b> exercises for the lesson', '<b>Lab + quiz</b> at the end of the chapter'])) },
]);
