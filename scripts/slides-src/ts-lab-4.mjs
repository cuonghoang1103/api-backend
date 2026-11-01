/**
 * ts-lab-4 — TypeScript · Chapter 4 · Lab 4 "LabFlow's data model" (01/11/2026). Slug bài: typescript-4-6-lab-mo-hinh-du-lieu.
 * Output = chạy thật Node 22.23.3 + tsc 7.0.2, máy chấm scripts/cham-lab-4.mjs: khởi đầu 4.5/10 (0 lỗi tsc), "index signature any" 6.5/10,
 * "interface + union, không readonly, bảng mở" 7.5/10, tham khảo 10/10. Mã/output đọc thẳng từ content/courses/typescript/s04/_ma-ts-lab-4.mjs.
 */
import { lamDeck, ts, tc, two, box, steps, c, zm } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s04/_ma-ts-lab-4.mjs';

export const deck = { key: 'ts-lab-4', code: 'TS Lab 4', title: 'Lab 4 — the data model', sub: 'zero errors is not the goal: refusing wrong data is' };

const L = (s) => s.split('\n');
const STARTER = `// lab4/src/model.ts — the teammate's types (bodies cut)
export type Lab = {
  code: string;
  name: string;
  capacity?: number; // "made optional: the seed did not compile"
  equipment: string[];
};
export type User = { id: number; createdAt: string; …; role: string };
export type BookingRecord = { …; lab: string; status: string; … };
export type LabTable = { [code: string]: Lab };

export function seatsByLab(…): { [lab: string]: number }
export function withStatus(b, status: string) { b.status = status; … }`;
const pickGrader = (k, keep) => L(OUT[k]).filter((l) => keep.test(l)).join('\n');
const STARTER_RUN = '$ npm run lab4\n' + pickGrader('l5-starter', /^[✓✗] [A-E] |^Score/);
const YEU_RUN = '$ node scripts/cham-lab-4.mjs --from lab4/yeu\n' + pickGrader('l7-yeu', /^[✓✗] [A-E] |✗ S\d|^Score/);
const VUA_RUN = '$ node scripts/cham-lab-4.mjs --from lab4/vua\n' + pickGrader('l8-vua', /^[✓✗] [A-E] |✗ S\d|^Score/);
const REF_RUN = '$ node scripts/cham-lab-4.mjs --from src/rules\n' + pickGrader('l9-ref', /^[✓✗] [A-E] |^Score/);
const REF_TYPES = `// src/rules/model.ts — the types (bodies cut)
export interface Entity { readonly id: number; readonly createdAt: string }
export interface Lab {
  readonly code: LabCode; name: string; capacity: number;
  equipment?: readonly string[];
}
export interface User extends Entity { …; role: Role; studentCode?: string }
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export interface BookingRecord extends Entity { readonly lab: LabCode; … readonly status: BookingStatus; … }
export type BookingView = BookingRecord & { labName: string; userName: string };
export const LAB_INFO: Record<LabCode, Lab> = { … };
export function seatsByLab(…): Record<LabCode, number>
export function withStatus(b, status): BookingRecord { return { ...b, status }; }`;
const SAI_RUN = L(OUT['l6-sai-chay']).slice(1).map((l) => l.replace(/^(S\d) .* = /, '$1 → ')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Objects, interfaces & type aliases', bai: 'Lab 4' }, [
  { cover: true, t: 'Lab 4 — LabFlow’s<br>data model', sub: 'Chapter 4 lab · 60–90 minutes · graded by tsc and Node, not by opinion' },
  { t: 'Your mission', to: true, giua: true, body: steps([
      `Start from ${c('lab4/src/model.ts')}: it compiles under strict with <b>0 errors</b> — and scores 4.5/10`,
      `Rewrite the types: ${c('Entity')} + ${c('extends')}, ${c('readonly')}, optional only where it is true, ${c('Record<LabCode, Lab>')}`,
      `No ${c('any')}, no ${c('as')} cast, no ${c('!')} — and the 10 behaviour tests must pass`,
      `Make tsc <b>refuse</b> the 8 wrong uses in ${c('lab4/kiem/sai.ts')}, each with the right code`,
      `Grade yourself any time: ${c('npm run lab4')} → a score out of 10`,
    ]) + box('Why this matters', 'The data model is the file the API, the React form and the Prisma schema will all import. A loose type here is a wrong value on every screen.', 'lam') },
  { t: 'The starter: zero errors, loose types', body: two(ts(STARTER, { sm: true, hl: [3, 5, 8, 10, 13] }),
      `<div>${tc(OUT['l4-strict'], { title: 'npx tsc -p lab4 — strict, no error in src', wrap: 38 })}${box('Valid is not precise', `${c('string')} accepts any code or role, ${c('?')} makes a room without seats legal, the table is open, nothing is read-only. A type refuses only what it describes.`, 'do2')}</div>`, 'r64') +
    box('Your job', `Keep it compiling — and make it <b>refuse</b>: 8 wrong uses, each with the right code, without ${c('any')}, ${c('as')} or ${c('!')}.`, 'xanh') },
  { t: 'Eight wrong uses — what Node does today', body: tc(SAI_RUN, { title: 'node demo4/ts-lab-4/sai-chay.ts — the starter model, run for real', wrap: 104 }) +
    zm(`<table class="t"><tr><th>Quietly wrong</th><th>Crash</th></tr>
    <tr><td>S1/S2 a real room shows 0 free seats · S3 a TEACHER needs approval · S4 the pending list says CONFIRMED · S5 the shared table gains a printer · S7 a ghost lab · S8 a user stored under ${c('"undefined"')}</td><td>S6 ${c("reading 'length'")} of a lab from the database</td></tr></table>`, 1.0) },
  { t: 'The starter, graded', body: two(tc(STARTER_RUN, { title: 'the untouched starter — real output', wrap: 48 }),
      `<div>${box('B — the open table', `Every read of ${c('LAB_INFO[code]')} is ${c('Lab | undefined')}: correct callers must check a lab that always exists.`, 'do2')}${box('D — three behaviour problems', `BE-202 has ${c('equipment: []')} (recorded nothing ≠ not recorded) · ${c('seatsByLab')} loses labs with 0 · ${c('withStatus')} edits the record in place.`, 'do2')}${box('S1 — refused for the wrong reason', `The message names ${c('equipment')}, not ${c('capacity')}.`, 'lam')}</div>`, 'r64') },
  { t: 'Two typical first attempts', body: two(tc(YEU_RUN, { title: 'attempt A — [extra: string]: any, LAB_INFO: any', wrap: 54 }),
      tc(VUA_RUN, { title: 'attempt B — interfaces + unions, no readonly, open table', wrap: 54 })) +
    two(box('A: “a flexible model”', `6.5/10. The any index signature turns S2’s TS2561 into TS2741 — the typo is never named; ${c('LAB_INFO: any')} lets S7 through.`, 'do2'),
      box('B: passes, three holes', `7.5/10. No ${c('readonly')}: S4, S5 compile. Open table: S7 compiles and B fails.`, 'lam')) },
  { t: 'The reference solution: 10 of 10', body: ts(REF_TYPES, { sm: true, hl: [2, 4, 5, 7, 9, 11] }) + tc(REF_RUN, { title: 'src/rules — the reference, graded', wrap: 120 }) },
  { t: 'Rubric (10 points)', body: zm(`<table class="t"><tr><th>Part</th><th>Points</th><th>How it is checked</th><th>The habit it trains</th></tr>
    <tr><td>A · compiles (strict)</td><td>2</td><td>${c('tsc -p')} on your model.ts</td><td>a model that type-checks on its own</td></tr>
    <tr><td>B · correct uses compile</td><td>1</td><td>tsc on ${c('kiem/phai-dung.ts')}</td><td>pleasant to use, not just strict</td></tr>
    <tr><td>C · honesty</td><td>1</td><td>no ${c('any')}, ${c('as')}, ${c('!')}, ${c('@ts-')}</td><td>the type says what the data is</td></tr>
    <tr><td>D · behaviour</td><td>2</td><td>${c('node --test')}: 10 tests</td><td>absent ≠ empty, zeros, copies</td></tr>
    <tr><td>E · wrong uses refused</td><td>4 (8 × 0.5)</td><td>each line of ${c('kiem/sai.ts')} has the expected code</td><td>required, excess, readonly, optional, closed keys, extends</td></tr></table>`, 1.05) +
    box('Pass mark', '7/10. Attempt B passes with 7.5 — and still lets one screen edit a booking every other screen is showing.', 'xanh') },
  { t: 'Hints, from gentle to strong', to: true, body: steps([
      `${c('interface Entity { readonly id: number; readonly createdAt: string }')}; ${c('User extends Entity')}`,
      `${c('Lab')}: ${c('readonly code: LabCode')}, required ${c('capacity')}, ${c('equipment?: readonly string[]')}`,
      `${c('BookingStatus')} union; every ${c('BookingRecord')} field ${c('readonly')}; ${c('withStatus')} returns ${c('{ ...b, status }')}`,
      `${c('LAB_INFO: Record<LabCode, Lab>')}; ${c('seatsByLab')} returns ${c('Record<LabCode, number>')} from three zeros`,
      `${c('indexById')} stays open: ${c('Record<number, User>')} — ids really arrive at runtime`,
    ]) },
  { t: 'Before you call it done', to: true, giua: true, body: `<ul>
    <li>${c('npm run lab4')} prints <b>Score: 10/10</b> (7 is a pass; 10 is the goal)</li>
    <li>${c('npx tsc -p lab4')} is clean — tests and correct uses included</li>
    <li>No ${c('any')}, ${c('as')} or ${c('!')}; BE-202 has no ${c('equipment')} key</li>
    <li>You can point at the line of your file that refuses each of S1–S8</li>
    <li>Commit: ${c('feat(model): readonly entities, closed lab table (lab 4: 10/10)')}</li></ul>` },
]);
