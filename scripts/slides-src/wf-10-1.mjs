/** Web Foundations · deck bài 10.1 — Tư duy như lập trình viên. Output thật: _demo/_t10/10-1/chay.sh (Node 22.23, node --test). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

const dong = (k, a, b) => OUT[k].split('\n').slice(a, b).join('\n');

export const deck = { key: 'wf-10-1', code: 'WF 10.1', title: 'Thinking like a programmer', sub: 'Web Foundations · Chapter 10' };

export const slides = deckWf({ chuong: 'Chapter 10 — Thinking, debugging, Git', bai: '10.1' }, [
  { cover: true, t: 'Thinking like a programmer', sub: 'Plan in words, make one case work, then the hard ones' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Turn a task into <b>input, output, steps</b></li>
    <li><b>Trace</b> a plan by hand</li>
    <li>List <b>edge cases</b> on purpose</li>
    <li>Write them as <b>tests</b> (node --test)</li>
    <li>Fix <b>one failing test</b> at a time</li></ul>` },

  { t: 'Restate, plan, solve, extend', to: true, giua: true, body: steps([
      '<b>Restate</b> — input, output, one example',
      '<b>Plan</b> — plain words, no syntax',
      '<b>Simplest case</b> — end to end',
      '<b>Extend</b> — one edge case at a time, tested',
    ]) + box('Rule', 'Cannot write step 2? You are not ready to write code.', 'info') },

  { t: 'The plan works — for one case', giua: true, body: term('_t10/out/reverse', null, { title: 'node reverse.mjs' }) + two(box("split(' ')", 'extra spaces → empty words; tab not a separator', 'bad'), box('trim().split(/\\s+/)', 'any run of white space is one separator', 'ok')) },

  { t: 'Trace the plan by hand', giua: true, body: term('_t10/out/trace', null, { title: 'node top-words.mjs --trace' }) + box('Each line checkable by eye', 'words → kept → counts → top 3', 'info') },

  { t: 'Edge cases become tests', giua: true, body: term(null, dong('_t10/out/tests-v1', 0, 14), { title: 'first version: 1 of 5' }) + box('Each failure', 'shows expected (-) and actual (+)', 'info') },

  { t: 'Fix one case at a time', giua: true, body: term(null, dong('_t10/out/tests-final', 0, 10), { title: 'after four small fixes' }) + box('Run after every change', '"the line I just typed is broken" beats "something is broken"', 'ok') },

  { t: 'When you are stuck', to: true, giua: true, body: tbl(['Try', 'Why'], [['shrink the input', 'fewer things to hold in your head'], ['print every step', 'stop guessing values'], ['explain out loud', 'hear the wrong assumption'], ['write the test first', 'forces a clear expected output'], ['step away 10 min', 'it works surprisingly often']]) + box('Being stuck is normal', 'staying stuck without a method is the problem', 'info') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Plan in plain words first</li>
    <li>The task example is not enough</li>
    <li>Trace by printing each step</li>
    <li>Edge cases → node --test</li>
    <li>Fix one test, run, repeat</li></ul>`,
    box('Practice (40 min)', 'Top N customers by total: plan as comments, trace by hand, five tests incl. edge cases.<br><br><b>Done when</b>: ℹ pass 5, ℹ fail 0.', 'ok')) },
]);
