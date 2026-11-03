/**
 * ts-09-1 — TypeScript · Chapter 9 · Lesson 9.1 "What tsc does & tsconfig basics" (04/11/2026). Slug: typescript-9-1-tsc-and-tsconfig.
 * Mọi mã/output lấy từ content/courses/typescript/s09/_ma-ts-09-1.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s09/_ma-ts-09-1.mjs';

export const deck = { key: 'ts-09-1', code: 'TS 9.1', title: 'What tsc does & tsconfig basics', sub: 'the compiler, and what it does not check' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — tsconfig & the compiler', bai: '9.1' }, [
  { cover: true, t: 'What tsc does &amp;<br>tsconfig basics', sub: 'Chapter 9 · Lesson 9.1 — the compiler, and the gap it leaves' },
  { t: 'What you will take away from this chapter', to: true, giua: true, body: `<ul>
    <li>Read a tsconfig and know what each flag buys (this lesson)</li>
    <li><b>strict</b> and its family (9.2); the extra safety flags beyond it (9.3)</li>
    <li><b>target, lib, module, noEmit</b> (9.4)</li>
    <li>The biggest gap: tsc only checks the files in the project — a drifted file left outside is invisible</li>
    <li>Pass <b>Lab 9</b>: tighten a loose project to strict + a CI gate</li></ul>` },
  { t: 'Types are erased — see it', body: ts(CODE.eraseArea, { sm: true, hl: [4] }) + tc(OUT['11-erase'], { title: 'node' }) +
    box('The check is all there is', `Node strips the types and runs the JavaScript, so types never protect you at run time. Their whole job is the ${c('tsc')} check beforehand — which is why its config matters.`, 'xanh') },
  { t: 'The gap: tsc only checks the project', body: ts(CODE.scopeContent, { sm: true, hl: [2] }) + ts(CODE.scopeSeed, { sm: true, hl: [3] }) + tc(OUT['12-scope'], { title: 'tsc -p scope (include: src)' }) +
    two(box('0 errors, and it is broken', `The ${c('seed/')} folder is outside ${c('include')}, so the compiler never looked at it — even though it uses the renamed value ${c("'CODE'")}.`, 'do2'),
      box('What a green check proves', `A clean build only proves the files you pointed at are correct, not that the codebase is. The most dangerous line in a tsconfig is ${c('include')}.`, 'lam')) },
  { t: 'Close the gap: a second config', body: ts(CODE.scopeTsconfigSeed, { sm: true, hl: [1] }) + tc(OUT['13-scope-seed'], { wrap: 72 }) +
    box('The 08/08 incident', `Include the seed and the drift surfaces: <b>TS2322</b>, ${c("'CODE'")} is not a ${c('ContentType')}. A renamed enum once passed every check because ${c('seed.ts')} was excluded. A gap you do not check for is a gap that ships.`, 'lam') },
  { t: 'What tsc does — and does not', body: cards([
      [c('tsc'), 'Checks types; with noEmit, produces nothing.'],
      [c('tsconfig.json'), 'The control panel: target, lib, module, strict.'],
      [c('include'), 'Which files are the project — tsc checks only these.'],
      ['the gap', 'A file outside include is invisible.'],
      ['close it', 'A second typecheck config for the seed, run in CI.'],
      ['Next · 9.2', 'The strict flag.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A project with a ${c('seed/')} holding a dead value (${c("'VIEWER'")} is not a ${c('Role')}) compiles clean — add a config that includes it and watch the drift become a compile error.`, 'xanh'),
      box('Remember', `tsc checks only the files in ${c('include')}; a clean build proves those files, not the codebase. The seed gap closes with a second config in CI.`, 'lam')) +
    box('Next · 9.2 — strict mode', `The single switch that turns on the checks that caught most of this course’s bugs.`, '') },
]);
