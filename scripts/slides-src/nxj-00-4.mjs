/**
 * nxj-00-4 — Next.js · Section 0 · Lesson 0.4 "How to study this course" (deck video + web, 13/11/2026).
 * Bài web: nextjs-0-4-cach-hoc. Output THẬT (scratchpad/nxj/demo/n0-4.txt · Next.js 16.4.6 · Node 22.23.3 · Chromium/Playwright) — CỐ Ý làm hỏng:
 * (1) list thiếu key trong Server Component ⇒ terminal dev + console trình duyệt: 'Each child in a list should have a unique "key" prop.', huy hiệu "1 Issue";
 * (2) ten!.toUpperCase() với ten = undefined ⇒ lớp phủ lỗi dev "Runtime TypeError · Server · Cannot read properties of undefined (reading 'toUpperCase')"
 *     + khung mã src/app/loi/page.tsx (3:29); (3) gõ sai tên prop tieude ⇒ tsc: TS2322 … "Did you mean 'tieuDe'?".
 * Phòng thi: NEXTJS-PT1..3, NEXTJS-FE..FE5 (50 câu/đề), NEXTJS-PE (10 đề × 5 câu, Node đọc stdin). Code Lab track nextjs: 16 module.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-4:file:src/app/page.tsx": "const MON = ['Bàn phím cơ', 'Chuột không dây', 'Lót chuột'];\n\nfunction The({ tieuDe }: { tieuDe: string }) {\n  return <h2 className=\"text-xl font-bold\">{tieuDe}</h2>;\n}\n\nexport default function Home() {\n  return (\n    <main className=\"p-10 font-sans\">\n      <The tieuDe=\"Giỏ hàng\" />\n      <ul className=\"list-disc pl-6\">\n        {MON.map((m) => <li>{m}</li>)}\n      </ul>\n    </main>\n  );\n}\n",
 "n0-4:file:src/app/loi/page.tsx": "export default function Loi() {\n  const ten = ['An', 'Bình'].find((x) => x === 'Cường');\n  return <h1>Xin chào {ten!.toUpperCase()}</h1>;\n}\n",
 "n0-4:tao": "$ npm run dev -- -p 19308\n$ curl -s -o /dev/null -w 'GET / → %{http_code}\\n' localhost:19308/\nGET / → 200\n▲ Next.js 16.4.6 (Turbopack)\n- Local:         http://127.0.0.1:19308\n- Network:       http://127.0.0.1:19308\n✓ Ready in 674ms\n\n✓ Running next.config.ts took 1113ms\n\n✓ Generated AGENTS.md for AI agents. Set `agentRules: false` in next.config to disable.\nEach child in a list should have a unique \"key\" prop.\n\nCheck the top-level render call using <li>. See https://react.dev/link/warning-keys for more information.\n GET / 200 in 244ms (next.js: 132ms, application-code: 112ms)",
 "n0-4:sai-prop": "$ sed -i '' 's/<The tieuDe=\"Giỏ hàng\" \\/>/<The tieude=\"Giỏ hàng\" \\/>/' src/app/page.tsx && grep -n 'The tieude' src/app/page.tsx\n10:      <The tieude=\"Giỏ hàng\" />\n$ npx tsc --noEmit\nsrc/app/page.tsx(10,12): error TS2322: Type '{ tieude: string; }' is not assignable to type 'IntrinsicAttributes & { tieuDe: string; }'.\n  Property 'tieude' does not exist on type 'IntrinsicAttributes & { tieuDe: string; }'. Did you mean 'tieuDe'?",
 "n0-4:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, icards, cmp, box, two, steps, kw, c, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-00-4', code: 'NXJ 0.4', title: 'How to study this course', sub: 'Section 0 · Lesson 0.4' };
const O = (k) => { const v = DU_LIEU[`n0-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-00-4', ten, { vp: 640, ...o });

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.4', t: 'How to study<br>this course', sub: 'A course you build alongside: type it, break it on purpose, read the whole error, then prove it in the Exam Room',
    en: 'Lesson zero point four: how to get the most out of this course. It is one you build alongside, not one you watch: type the code, break it on purpose, read the whole error, then prove it in the Exam Room and Code Lab.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The five-step loop that makes ideas stick</li>
    <li>Breaking code on purpose — three real errors, read line by line</li>
    <li>What every marker in the lessons means</li>
    <li>The Exam Room and Code Lab: what is there, and when to use it</li>
    <li>Where AI helps, and where it quietly hurts</li></ul>`,
    en: 'Five takeaways: the five-step loop; breaking code on purpose and reading three real errors; what each marker in the lessons means; the Exam Room and Code Lab; and where AI helps and where it hurts.' },
  { t: 'The loop that works', body: path([{ t: '1 · Read', s: 'once, for the shape' }, { t: '2 · Type', s: 'never copy-paste', on: true }, { t: '3 · Predict', s: 'guess, then save', on: true }, { t: '4 · Read it', s: 'the whole error', on: true }, { t: '5 · Code Lab', s: 'make it stick' }], { h: 230, fs: 21 }) +
    two(box('Reading feels like understanding', 'You nod along, then sit at the keyboard and find you cannot write it. Typing makes you read every token.', 'cam'),
      box('A wrong guess IS the lesson', 'Before you save, say what will happen. When you are wrong, you just found the gap in your model.', 'lam')), to: true,
    en: 'The loop: read the lesson once for the shape of the idea; type the code yourself, never paste; change one thing and predict what will happen before saving; read the full error message; then do the Code Lab exercise. Reading feels like understanding — typing reveals the truth, and a wrong prediction is exactly the lesson.' },
  { t: 'Break it on purpose (1): a list without key', body: two(tsx(`const MON = ['Bàn phím cơ', 'Chuột không dây', 'Lót chuột'];
// …
<ul className="list-disc pl-6">
  {MON.map((m) => <li>{m}</li>)}   {/* no key */}
</ul>`, { sm: true, hl: [4] }) + tn(O('tao').split('\n').filter((l) => /key|Check the top|GET \/ 200/.test(l)).join('\n'), { fs: 13, wrap: 52 }),
      B('key', { url: 'localhost:3000 · dev', h: 400, w: 430, mark: [[20, 344, 118, 36, '1 Issue']] }), 'r64'),
    en: 'Break it on purpose, number one: render a list without a key. The page still shows, so it is easy to miss — but the dev terminal and the browser console both print: each child in a list should have a unique key prop, with a link to the docs, and Next shows a red one issue badge. Chapter seven explains why keys matter.' },
  { t: 'Break it on purpose (2): read the WHOLE error overlay', body: two(B('loi', { url: 'localhost:3000/loi · dev', vp: 960, h: 560, w: 640, mark: [[144, 136, 200, 26, '1'], [144, 168, 432, 26, '2'], [146, 222, 280, 22, '3'], [146, 306, 662, 22, '4']] }),
      steps(['<b>Type</b>: Runtime TypeError, on the <b>Server</b>', '<b>Message</b>: reading <code>toUpperCase</code> of <code>undefined</code>', '<b>Where</b>: <code>src/app/loi/page.tsx (3:29)</code>', '<b>The line</b>, with a caret under the exact spot', '<b>Fix</b>: <code>find</code> can return undefined — handle it']), 'r64'),
    en: 'Break it on purpose, number two: the dev error overlay. Read it top to bottom: the type, a runtime TypeError, raised on the server; the message, reading toUpperCase of undefined; the file and line, loi page dot tsx, line three column twenty nine; and the exact line with a caret. The fix follows: find can return undefined, so handle that case.' },
  { t: 'Break it on purpose (3): TypeScript catches the typo first', body: tsx(`function The({ tieuDe }: { tieuDe: string }) { … }
<The tieude="Giỏ hàng" />   // typo: tieude instead of tieuDe`, { sm: true, hl: [2] }) + tn(O('sai-prop').split('\n').slice(-3).join('\n'), { fs: 15, wrap: 100 }) +
    box('"Did you mean \'tieuDe\'?"', 'React and Next errors — and TypeScript\'s — very often name the fix. Read to the end of the message before you start guessing.', 'xanh'),
    en: 'Number three: a typo in a prop name — tieude instead of tieuDe. npx tsc reports TS twenty three twenty two: property tieude does not exist — and the last words are: did you mean tieuDe. The message names the fix. Read to the end before guessing.' },
  { t: 'What every marker in the lessons means', body: icards([
      ['code', 'Lead + example', 'the core idea, then code with its REAL output in an out block — read the output, that is the point'],
      ['warn', 'Trap', 'mistakes that are easy to make and hard to spot — worth more than the happy path'],
      ['eye', '"How cuongthai.com does it"', 'the same idea in a production codebase, including the bugs it caused here'],
      ['check', 'Quiz & Exam Room', 'every chapter ends with a quiz; the course has progress tests, finals and practicals'],
    ], 2), to: true,
    en: 'The markers: a lead and an example, with the real output in an out block; a Trap — easy to make, hard to spot, worth more than the happy path; how cuongthai dot com does it — the same idea in production, bugs included; and the quiz and Exam Room.' },
  { t: 'The Exam Room and Code Lab', body: cmp(['', 'What', 'When'], [
      ['Progress tests (PT)', '3 tests', 'after Chapter 4, 12 and 20'],
      ['Final exams (FE)', '5 exams × 50 questions, the whole course', 'at the end'],
      ['Practical exams (PE)', '10 exams × 5 tasks — Node programs (stdin → stdout) that isolate React/Next logic, AI-graded with a rubric', 'per stage'],
      ['Code Lab', 'track "Next.js": 16 modules of exercises with solutions', 'after every lesson'],
    ]) + box('Reading proves nothing', 'The questions are written to catch exactly the misconceptions this course is trying to fix.', 'cam'),
    en: 'The Exam Room: three progress tests, after chapters four, twelve and twenty; five final exams of fifty questions covering the whole course; ten practical exams of five tasks each — small Node programs that isolate React and Next logic, graded with a rubric. And Code Lab: the Next.js track has sixteen modules with solutions. Reading proves nothing.' },
  { t: 'A word about asking AI to write React for you', body: two(box('It compiles. It renders. It is quietly wrong.', 'An effect with a missing dependency, an index used as a key, a <code>\'use client\'</code> at the top of a file that drags half the app into the browser — and it ships to production.', 'do2'),
      box('Use it where you already understand', 'AI is a speed-up for what you can already judge, never a way to skip the understanding. Chapter 5 shows three effects AI likes to write — all bugs.', 'xanh')) +
    icards([
      ['page', 'react.dev/reference', 'look up hooks and APIs exactly when you need them'],
      ['flag', 'nextjs.org/learn', 'the official hands-on course — a good companion to Stage 3'],
      ['db', 'MDN Web Docs', 'HTML, CSS, JavaScript, DOM, fetch — the ground truth React sits on'],
    ], 3),
    en: 'A word about AI. It writes code that compiles and renders and is quietly wrong: a missing dependency, an index as a key, use client at the top of a file. Use it to go faster where you already understand; chapter five shows three effects AI likes to write that are all bugs. Keep open while studying: react dot dev reference, nextjs dot org learn, and MDN.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Active learning', 'type and break code, not just read'), kw('Fast Refresh loop', 'edit, save, see — tight feedback'), kw('Error overlay', 'type · message · file:line · the line'),
      kw('Exam Room', 'progress tests, finals, practicals'), kw('Code Lab', 'exercises with solutions, per chapter'), kw('AI judgement gap', 'compiles, still wrong'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: active learning, the Fast Refresh loop, the error overlay, the Exam Room, Code Lab, and the AI judgement gap.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Type one snippet from Chapter 1 into your dev app — change one line, predict, then save',
      `Break something on purpose: remove a ${c('key')}, misspell a prop — read the whole message`,
      'Open the Exam Room and Code Lab; mark where Chapter 1 lives',
    ]), box('Keep these', `<ul><li>Read once, type, predict, read the error</li><li>Errors usually name the fix</li><li>Prove it: quizzes, Exam Room, Code Lab</li><li>AI for speed, not understanding</li></ul>`, 'lam'), ''),
    en: 'Your turn: type a snippet from chapter one and predict before saving; break something on purpose and read the whole message; find the Exam Room and Code Lab for chapter one. Keep: read once, type, predict, read the error; errors usually name the fix; prove it in the Exam Room and Code Lab; AI for speed, not understanding.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.4' }, S);
