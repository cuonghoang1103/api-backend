/** Web Foundations · deck bài 0.4 — Cách học. Output thật: _demo/0-4 (Chromium). */
import { deckWf, js, con, box, two, steps, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-0-4', code: 'WF 0.4', title: 'How to study this course', sub: 'Web Foundations · Section 0' };

export const slides = deckWf({ chuong: 'Section 0 — Getting started', bai: '0.4' }, [
  { cover: true, t: 'How to study this course', sub: 'Seven habits that separate people who finish from people who quit — shown on real code' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li><b>Predict</b> before you run, and learn from the surprise</li>
    <li>Read a red <b>error</b> and go to the exact line</li>
    <li><b>Print</b> the value you are sure about</li>
    <li><b>Shrink</b> a bug until it is obvious</li>
    <li>Ask a <b>question</b> that gets answered</li>
    <li>Review on a <b>schedule</b> so it stays</li></ul>` },

  { t: 'Predict, run, compare', to: true, giua: true, body: two(js('0-4/du-doan.js', null, { gon: true }), `${con('0-4/du-doan')}
    ${box('The point', 'A wrong guess shows exactly where your mental model is wrong. Running without guessing teaches nothing.', 'ok')}`, 'r55') },

  { t: 'An error is a direction', giua: true, body: `${con('0-4/doc-loi-stack')}
    ${tbl(['Read', 'It says'], [['TypeError', 'the kind of error'], ['Cannot read… (reading ’city’)', 'the thing BEFORE .city is null: look at user.profile'], ['at showCity …:3:23', 'file : line : column — start here'], ['at renderPage …:7:10', 'who called it — read downward to see how it got there']])}
    ${box('One rule', 'Read the <b>first</b> line, go to the location it names. Fix the first error before the others.', 'ok')}` },

  { t: 'Print what you are sure about', giua: true, body: `${js('0-4/in-gia-tri.js', null, { gon: false })}
    ${two(con('0-4/in-gia-tri'), box('The bug was an assumption', 'The loop is fine. The values are <b>strings</b>, so <code class="i">+</code> joins them. One print showed it.', 'ok'))}` },

  { t: 'Shrink it until it is tiny', giua: true, body: two(`${js(null, `function topThree(list) {
  const scores = list.map((p) => p.score);
  scores.sort();
  scores.reverse();
  return scores.slice(0, 3);
}`, { gon: false })}${con('0-4/thu-nho-truoc')}`,
      `${js('0-4/thu-nho-sau.js', null, { gon: true })}${con('0-4/thu-nho-sau')}
      ${box('Minimal reproduction', 'By default <code class="i">sort()</code> compares as <b>text</b>. The small version shows it — or is the perfect question.', 'info')}`) },

  { t: 'Stuck? Follow this order', to: true, giua: true, body: `${steps([
      '<b>Read the actual error</b> — all of it',
      '<b>Check one assumption</b> with a print',
      '<b>Shrink it</b> to ten lines',
      '<b>Search</b> with the exact message',
      '<b>Ask</b> — after about 20 honest minutes',
    ])}${box('The 20-minute rule', 'Struggle is where you learn. Three days stuck only teaches you to hate it.', 'info')}` },

  { t: 'Ask a good question', to: true, giua: true, body: two(tbl(['Part', 'Example'], [
      ['Expected', '[8, 9, 25, 100]'],
      ['Actual', '[100, 25, 8, 9]'],
      ['Tried', 'printed the array; read the MDN page'],
      ['Code', '[9, 100, 25, 8].sort()'],
    ]), vsd('<ul><li>“fix this” + a whole file</li><li>A fourth tutorial</li></ul>', '<ul><li>Ask the AI for the <b>cause</b>, type the fix</li><li>Build a small thing alone</li></ul>', '✗ Trap', '✓ Instead'), 'r55') },

  { t: 'Remember it: recall and spacing', giua: true, body: `${js('0-4/lich-on.js', null, { gon: true })}
    ${two(con('0-4/lich-on'), box('A review = 5 minutes', 'A blank note: write what you remember, compare, re-read only the gaps. Little and often beats seven hours on Sunday.', 'ok'))}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Predict → run → compare</li>
    <li>First error, top of the stack</li>
    <li>Print, shrink, search, ask</li>
    <li>Recall + spaced review · MDN first</li></ul>`,
    box('Practice (25 min)', 'Fix the leaderboard using every habit.<br><br><b>Done when</b>: it prints <code class="i">[ 100, 25, 9 ]</code> and <code class="i">winner: Binh</code>, you wrote a four-part question, and five review dates are in your calendar.', 'ok')) },
]);
