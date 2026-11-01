/**
 * ts-00-2 — TypeScript · Section 0 · Lesson 0.2 "How to study: let the compiler teach you" (01/11/2026). Slug: typescript-0-2-cach-hoc.
 * Output = chạy thật Node 22.23.3 + tsc 7.0.2 trên labflow-ts/demo0/ts-00-2 (lấy thẳng từ _ma-ts-00-2.mjs, sinh tự động).
 */
import { lamDeck, ts, tc, two, box, steps, cards, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s00/_ma-ts-00-2.mjs';

export const deck = { key: 'ts-00-2', code: 'TS 0.2', title: 'How to study', sub: 'Let the compiler teach you' };

const ANAT = CODE.anatomy.split('\n').slice(2, 5).join('\n');
const PRETTY = OUT['04-anatomy-pretty'].replace(/\n\n\n/, '\n\n');
const CHAIN_OUT = OUT['05-chain'].split('\n').filter((l, i) => i === 0 || i >= 2).join('\n');
const CHAIN_SRC = CODE.chain.split('\n').slice(8, 12).join('\n');
const B1 = CODE.b1.split('\n').slice(0, 9).join('\n');
const PRETTY_B1 = OUT['07-cascade-pretty'].split('\n').slice(10, 18).join('\n');
const EXPECT_SRC = CODE.expect.split('\n').slice(2, 9).join('\n');
const PRACT = CODE.practice.split('\n').slice(3, 11).join('\n');

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & how to study', bai: '0.2' }, [
  { cover: true, t: 'How to study:<br>let the compiler teach you', sub: 'Section 0 · Lesson 0.2 — read every error like an address' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A five-step loop for every lesson: read, retype, hover, <b>break it</b>, practise</li>
    <li>Read one diagnostic like an address: ${c('file(line,col): error TSxxxx')}</li>
    <li>Long messages: read the <b>last indented line</b> first</li>
    <li><b>First error first</b> — fixing one can reveal another</li>
    <li>The ten error codes you will meet most in this course</li>
    <li>${c('// @ts-expect-error')}: write down the error you expect</li></ul>` },
  { t: 'The loop for every lesson', body: two(steps([
      '<b>Read once</b> — the whole lesson, no typing',
      '<b>Retype</b> every example in VS Code',
      '<b>Hover</b> each variable: what type did TypeScript infer?',
      '<b>Break it</b> on purpose and read the red message',
      '<b>Practise</b>: the lesson task, then Code Lab',
    ]), box('Why this works', `The compiler is a second teacher that never gets tired. Step 4 is the one beginners skip — and the one that teaches the most: you learn what a type <b>prevents</b> by watching it refuse something.`, 'xanh'), 'r64') },
  { t: 'One error, read like an address', body: ts(ANAT, { sm: true, hl: [2] }) + tc(OUT['01-anatomy'] + '\n' + OUT['03-anatomy-node'], { wrap: 92, title: 'terminal — tsc refuses, node runs anyway' }) +
    box('Four parts', `${c('report.ts')} file · ${c('(4,40)')} line 4, column 40 · ${c('TS2339')} the error code · the sentence. Node still runs the file and prints <b>NaN</b> — only tsc stopped the bug.`, 'lam') },
  { t: 'The --pretty view and the exit code', body: tc(PRETTY, { wrap: 92, title: 'npx tsc -p … --pretty' }) +
    two(box('The ~~~ line', 'Underlines the exact characters tsc is unhappy with. Same error, easier to spot.', 'lam'),
      box('Exit code', `${c('tsc')} exits <b>1</b> when it finds an error, <b>0</b> when clean. CI reads that number — that is how a red build is made.`, 'lam')) },
  { t: 'Long messages: read the last line first', body: ts(CHAIN_SRC, { sm: true }) + tc(CHAIN_OUT, { wrap: 96, title: 'an elaboration chain' }) +
    box('Top says WHAT, bottom says WHY', `Line 1: this object does not fit ${c('Booking')}. Each indented line narrows it down. The last one is the root cause: ${c('minutes')} can be ${c('undefined')}.`, 'xanh') },
  { t: 'First error first: 4 → 1 → 1 → 0', body: ts(B1, { sm: true, hl: [1, 3, 8, 9] }) + two(`<table class="t"><tr><th>Round</th><th>Fix</th><th>tsc says</th></tr>
<tr><td>1</td><td>—</td><td>4 errors: TS2724 + 3 × TS2322</td></tr>
<tr><td>2</td><td>${c("const role = 'STUDENT'")}</td><td>1 error: TS2724</td></tr>
<tr><td>3</td><td>${c('checkSlots')} → ${c('checkSlot')}</td><td>1 <b>new</b> error: TS2339</td></tr>
<tr><td>4</td><td>${c('if (morning.ok)')}</td><td>0 errors</td></tr></table>`, box('Why a new one appeared', `While the import was broken, ${c('checkSlots')} had no type, so its result was not checked at all.`, 'do2'), 'r64') },
  { t: 'Pretty mode shows where the rule came from', body: tc(PRETTY_B1, { wrap: 96, title: 'npx tsc -p demo0/ts-00-2/cascade/b1 --pretty' }) +
    box('Three errors, one cause', `The three TS2322 lines point at three calls, but the cause is one declaration: ${c("const role: string")}. Pretty mode adds “the expected type comes from …” — follow it to the rule you broke.`, 'lam') },
  { t: 'The ten codes you will meet most', body: zm(`<table class="t"><tr><th>Code</th><th>Means</th><th>Usual fix</th></tr>
<tr><td>TS2322</td><td>value does not fit the declared type</td><td>fix the value or the declaration</td></tr>
<tr><td>TS2345</td><td>argument has the wrong type</td><td>pass what the function asks for</td></tr>
<tr><td>TS2339</td><td>property does not exist</td><td>check the type you really have</td></tr>
<tr><td>TS2551</td><td>…and “Did you mean ‘x’?”</td><td>a typo — take the suggestion</td></tr>
<tr><td>TS2554</td><td>wrong number of arguments</td><td>add / remove the argument</td></tr>
<tr><td>TS2561 · TS2353</td><td>unknown key in an object literal</td><td>rename the key / remove it</td></tr>
<tr><td>TS2820</td><td>string not in the allowed set, “Did you mean”</td><td>use the exact literal</td></tr>
<tr><td>TS7006</td><td>parameter has no type</td><td>annotate the parameter</td></tr>
<tr><td>TS18048</td><td>value is possibly undefined</td><td>check it before use</td></tr>
<tr><td>TS2307</td><td>module not found</td><td>fix the path / install the package</td></tr></table>`, 1.0) },
  { t: 'Editor and gate are two programs', body: two(cards([
      ['VS Code 1.124.2', 'Draws the red squiggles with its <b>own bundled TypeScript 6.0.3</b>.'],
      ['npx tsc', 'The project’s pinned <b>TypeScript 7.0.2</b>. This is what CI runs.'],
    ], 1), `<div>${box('Rule', `The editor helps you write. ${c('npx tsc')} decides. When they disagree, believe the terminal.`, 'xanh')}${tc(OUT['09-ts5112'], { wrap: 52, title: 'tsc + a file name inside a project' })}</div>`, 'r46') +
    box('TS5112', `Inside a folder with tsconfig.json, ${c('tsc file.ts')} refuses to guess. Use ${c('npx tsc -p <folder>')}.`, 'lam') },
  { t: '@ts-expect-error: write the error you expect', body: ts(EXPECT_SRC, { sm: true, hl: [3, 7] }) + tc(OUT['10-expect'], { wrap: 96 }) +
    box('A test for the type checker', `The call on line 5 fails as expected, so its directive stays silent. The call on line 9 is fine, so the directive on line 8 is <b>unused</b>: TS2578. Course graders use the same idea with ${c('// expect TS2345')} markers.`, 'xanh') },
  { t: 'When you are stuck', body: two(steps([
      'Read the <b>first</b> error only; ignore the rest for now',
      'Hover the variable it names: what type is it really?',
      'Shrink the file until only the error is left',
      'Search the code: <b>TS2345</b> + a few words',
      'Ask with the <b>full</b> message, the file and the tsc version',
    ]), box('Never', `Do not paste ${c('any')} or ${c('@ts-ignore')} to make red go away. It deletes the check and keeps the bug. Lesson 1.4 measures what it costs.`, 'do2'), 'r64') },
]);
