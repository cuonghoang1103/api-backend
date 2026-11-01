/**
 * ts-04-4 — TypeScript · Chapter 4 · Lesson 4.4 "Index signatures & Record" (01/11/2026). Slug: typescript-4-4-index-record.
 * Mọi mã/output lấy từ content/courses/typescript/s04/_ma-ts-04-4.mjs (sinh từ LabFlow TS chạy thật: Node 22.23.3, tsc 7.0.2).
 */
import { lamDeck, ts, js, tc, two, box, cards, c } from './_ts-chung.mjs';
import { CODE, OUT } from '../../content/courses/typescript/s04/_ma-ts-04-4.mjs';

export const deck = { key: 'ts-04-4', code: 'TS 4.4', title: 'Index signatures & Record', sub: 'dictionaries: open keys, closed keys' };

const L = (s) => s.split('\n');
const pick = (s, a, b) => L(s).slice(a, b).join('\n');
const noComment = (s) => L(s).filter((l) => !/^\s*\/\//.test(l)).join('\n').replace(/\n\n+/g, '\n');
const firstLines = (s, n) => L(s).slice(0, n).join('\n') + '\n…';

export const slides = lamDeck({ chuong: 'Chapter 4 — Objects, interfaces & type aliases', bai: '4.4' }, [
  { cover: true, t: 'Index signatures &amp; Record', sub: 'Chapter 4 · Lesson 4.4 — objects used as dictionaries' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>An <b>index signature</b> ${c('{ [code: string]: Lab }')} — and what it promises</li>
    <li>Why ${c('noUncheckedIndexedAccess')} makes that promise honest</li>
    <li>${c('Record<LabCode, Lab>')}: every lab, no more, no less — Lab 4’s ${c('LAB_INFO')}</li>
    <li>Two traps: ${c('Object.keys')} is ${c('string[]')}, and counts that lose the zeros</li>
    <li>Numeric keys, ${c('Map')}, and mixing properties with an index signature</li></ul>` },
  { t: 'JavaScript: a key that is not there', body: js(noComment(CODE.js), { hl: [7, 10] }) + tc(firstLines(OUT['11-js'], 5), { title: 'terminal — Node 22.23.3', wrap: 100 }) +
    box('The key is data', `It came from the URL. ${c("LAB_INFO['BE-999']")} is ${c('undefined')}, and the request dies.`, 'do2') },
  { t: 'An index signature: any string key', body: ts(pick(noComment(CODE.open), 0, 9), { sm: true, hl: [2, 8] }) + tc(OUT['12-open'], { wrap: 100 }) +
    two(box('What it says', `Keys not listed — only their type (${c('string')}) and the value type (${c('Lab')}). ${c('code')} is just a label.`, 'lam'),
      box('Course tsconfig', `${c('noUncheckedIndexedAccess')}: a read is ${c('Lab | undefined')} → TS2532 before running.`, 'xanh')) },
  { t: 'Trap: the flag off, the crash back', body: two(`<div>${ts(CODE.looseCfg.replace(/, "/g, ',\n  "').replace(' }, ', ' },\n  '), { sm: true })}${box('Not part of strict', `tsc’s ${c('strict')} does not turn this flag on — measured with TS 7.0.2.`, 'lam')}</div>`,
      tc(firstLines(OUT['13-loose'], 8), { title: '0 errors — then the same TypeError', wrap: 56 })) +
    box('The type says what a key would hold, not whether it is there', `With the flag off ${c("LAB_INFO['BE-999']")} is a ${c('Lab')}. Check before indexing — or close the key set.`, 'do2') },
  { t: 'Record&lt;LabCode, Lab&gt;: exactly these keys', body: ts([L(CODE.record)[10], '  …', L(CODE.record)[13]].concat(L(CODE.record).slice(14, 23).filter((x) => x.trim())).join('\n'), { sm: true, hl: [1, 4, 6, 8, 10] }) + tc(L(OUT['14-record']).filter((x) => !/^  /.test(x)).join('\n'), { wrap: 116 }) },
  { t: 'Four protections, zero checks', body: cards([
      ['TS2741', `A table missing ${c('AL-301')}.`],
      ['TS2353', `A table with an extra ${c('BE-999')} (4.1’s excess check).`],
      ['TS7053', `Reading ${c("LAB_INFO['BE-999']")}.`],
      ['TS7053', `Indexing with a plain ${c('string')} from the URL → guard it with ${c('isLab')} (2.4).`],
      ['No error, no check', `${c('LAB_INFO[code].capacity')} with ${c('code: LabCode')} — every LabCode is a key.`],
      ['Lab 4', `This is ${c('LAB_INFO')} in ${c('model.ts')}.`],
    ], 3) },
  { t: 'The Object.keys trap', body: ts(pick(noComment(CODE.keys), 2, 99), { sm: true, hl: [2, 4, 7] }) + tc(OUT['15-keys'], { wrap: 100 }) +
    two(box('Why string[]', `Structural typing: at runtime the object may carry <b>extra</b> keys, so tsc cannot promise ${c('LabCode')}.`, 'lam'),
      box('Fix honestly', `Loop over ${c('LABS')} (the one list), or ${c('Object.entries')} for values. Not ${c('as LabCode[]')}.`, 'xanh')) },
  { t: 'Counting per lab: keep the zeros', body: two(`<div>${ts(CODE.empty.split('\n').slice(2).join('\n'), { sm: true })}${tc(OUT['16-empty'], { wrap: 54 })}</div>`,
      tc(L(OUT['17-count']).slice(1).join('\n'), { title: 'node count/seats.ts — open vs Record', wrap: 54 })) +
    box('A checked copy', `The three zeros are written by hand — but add a lab to ${c('LABS')} and tsc reports TS2741 here. That is ${c('seatsByLab')} in Lab 4.`, 'xanh') },
  { t: 'Numeric keys: Record&lt;number, User&gt; or Map', body: ts(pick(CODE.byid, 4, 13), { sm: true, hl: [2, 5, 9] }) +
    two(tc(OUT['18-byid-tsc'], { wrap: 54 }), tc(OUT['19-byid-run'], { title: 'node byid/users.ts', wrap: 54 })) +
    box(`${c("['1', '2']")}`, 'Object keys are always strings at runtime. A Map keeps real number keys, has .size, and suits frequent add / delete.', 'lam') },
  { t: 'Which dictionary, when', body: cards([
      [c('{ [k: string]: V }'), 'Keys arrive at runtime. Reads may miss: check.'],
      [c('Record<string, V>'), 'The same, shorter; a type alias.'],
      [c('Record<LabCode, V>'), 'One entry per known value. Missing / extra / unknown refused.'],
      [c('Map<K, V>'), 'Non-string keys, add / delete often, need size.'],
      ['TS2411', `Properties must match the index type: keep metadata beside the dictionary.`],
      ['Next · Lab 4', `LabFlow’s data model in ${c('model.ts')} — 8 wrong uses refused.`],
    ], 3) },
]);
