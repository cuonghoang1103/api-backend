/**
 * ts-09-4 — TypeScript · Chapter 9 · Lesson 9.4 "target, lib, module & noEmit" (04/11/2026). Slug: typescript-9-4-target-lib-module.
 * Mọi mã/output lấy từ content/courses/typescript/s09/_ma-ts-09-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s09/_ma-ts-09-4.mjs';

export const deck = { key: 'ts-09-4', code: 'TS 9.4', title: 'target, lib, module & noEmit', sub: 'the environment half of a tsconfig' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — tsconfig & the compiler', bai: '9.4' }, [
  { cover: true, t: 'target, lib, module<br>&amp; noEmit', sub: 'Chapter 9 · Lesson 9.4 — the environment half of a tsconfig' },
  { t: 'lib: which APIs exist', body: ts(pick(CODE.liboldFind, 1, 3), { sm: true, hl: [2] }) + tc(OUT['11-libold'], { title: 'lib: es2022', wrap: 72 }) +
    box('TS2550 · change lib to es2023', `${c('findLast')} is a real ES2023 method; too old a ${c('lib')} and it looks like a typo. The course lib (es2024) knows it, so the same call runs and prints ${c('AL-301')}.`, 'lam') },
  { t: 'target vs lib: syntax vs APIs', body: cards([
      [c('target'), 'Which JavaScript syntax — "can I write this?".'],
      [c('lib'), 'Which built-in APIs exist — "does this method exist?".'],
      ['too old a lib', 'A real method is TS2550.'],
      ['here', 'Node 22 runs the .ts, so target matters less.'],
      ['but lib', 'Still decides which methods you may call.'],
      ['they move together', 'Usually — but answer different questions.'],
    ], 3) },
  { t: 'module: how imports resolve', body: ts(CODE.moduleApp, { sm: true, hl: [2] }) + tc(OUT['13-module'], { wrap: 72 }) +
    box('TS2835 · needs the extension', `Under ${c('nodenext')}, a relative import must carry its extension. The course adds ${c('allowImportingTsExtensions')} so you write ${c("'./helper.ts'")}. Get module wrong and every import breaks at once.`, 'lam') },
  { t: 'noEmit: the CI gate', body: ts(CODE.noemitCheck, { sm: true, hl: [2] }) + tc(OUT['14-noemit'], { title: 'tsc --noEmit' }) +
    two(box('Check only, produce nothing', `${c('noEmit')} type-checks and writes no ${c('.js')} — exactly what you want in CI: a pure gate that says yes or no without cluttering the tree. The build either passes or it fails, and nothing is left behind.`, 'xanh'),
      box('tsc is a checker, not a build step', `Node runs the ${c('.ts')} here, so tsc never needs to emit. ${c('tsc --noEmit')} is the command behind Lab 9’s gate — run it and the whole project is checked against every flag in the tsconfig at once.`, 'lam')) },
  { t: 'Practice &amp; Lab 9', to: true, giua: true, body: two(
      box('🧪 Practice', `A call to ${c('findLast')} under an old lib (es2020) is TS2550 — move to the course lib and it runs.`, 'xanh'),
      box('The four', `${c('target')}: which syntax? ${c('lib')}: which APIs? ${c('module')}: how do imports resolve? ${c('noEmit')}: check only. The environment half of a config.`, 'lam')) +
    box('Next · Lab 9 — Tighten a loose project to strict', `Turn on strict + the flags, fix what appears, close the seed gap, pass ${c('tsc --noEmit')}.`, '') },
]);
