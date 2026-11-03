/** ts-14-4 — TypeScript · Chapter 14 · Lesson 14.4 "Decorators". Slug: typescript-14-4-decorators. _ma: s14/_ma-ts-14-4.mjs. */
import { lamDeck, ts, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s14/_ma-ts-14-4.mjs';
export const deck = { key: 'ts-14-4', code: 'TS 14.4', title: 'Decorators', sub: 'a typed function that wraps a class member' };
const L = (s) => s.split('\n'); const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const run = (out) => L(out).filter((l) => !/^\$ /.test(l)).join('\n');
export const slides = lamDeck({ chuong: 'Chapter 14 — Classes & decorators', bai: '14.4' }, [
  { cover: true, t: 'Decorators', sub: 'Chapter 14 · Lesson 14.4 — TC39 standard decorators, typed per target' },
  { t: 'A method decorator wraps the method', body: ts(pick(CODE.decRun, 7, 12), { sm: true, hl: [2] }) + tc(run(OUT['11-run']), { title: 'tsc emit → node' }) +
    box('Needs a build step', `${c('@logged')} takes the method and a ${c('ClassMethodDecoratorContext')} and returns a wrapper. Decorators are run-time behaviour, so you compile to JS then run — Node’s type-stripping does not run them.`, 'xanh') },
  { t: 'The wrong target is a compile error', body: ts(pick(CODE.wrongtarget, 4, 9), { sm: true, hl: [3] }) + tc(L(OUT['12-wrongtarget']).slice(1, 3).join('\n'), { wrap: 70 }) +
    box('TS1240', `A method decorator’s context (${c('ClassMethodDecoratorContext')}) is a different type than a field’s, so the function does not fit — a method logging wrapper cannot land on a field where it would be meaningless.`, 'lam') },
  { t: 'The context types the target', to: true, giua: true, body: `<ul>
    <li>Each kind has its own context: <b>ClassMethodDecoratorContext</b>, <b>ClassFieldDecoratorContext</b>, <b>ClassDecoratorContext</b></li>
    <li>It carries the member’s <b>name</b>, <b>kind</b>, and helpers like <b>addInitializer</b></li>
    <li>The signature is what makes a decorator type-safe — it only fits where its context fits</li>
    <li>TypeScript uses the <b>TC39 standard</b> decorators — no <b>experimentalDecorators</b> flag</li></ul>` },
  { t: 'At a glance', body: cards([
      ['a decorator', 'A function that wraps a class member to add behaviour.'],
      ['TC39 standard', 'No experimentalDecorators — native in TypeScript.'],
      ['a typed context', 'ClassMethodDecoratorContext, …'],
      ['wrong target', 'A method decorator on a field is TS1240.'],
      ['needs a build', 'Compile to JS, then run — not type-stripping.'],
      ['Next · Lab 14', 'A service over an abstract repo.'],
    ], 3) },
  { t: 'Practice &amp; what is next', to: true, giua: true, body: two(
      box('🧪 Practice', `A ${c('@logged')} method decorator is put on a field — TS1240; move it onto a method and it compiles.`, 'xanh'),
      box('Chapter 14 done', `classes, access, abstract, ${c('#private')}, decorators — the object-oriented half of TypeScript.`, 'lam')) +
    box('Next · Lab 14', `A service over an abstract repo — graded by tsc and Node.`, '') },
]);
