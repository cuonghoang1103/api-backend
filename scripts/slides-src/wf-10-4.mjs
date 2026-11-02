/** Web Foundations · deck bài 10.4 — Cách tiếp tục học. Output thật: _demo/_t10/10-4/chay.sh (Node 22.23, ms 2.0.0 trong node_modules). */
import { deckWf, js, term, box, two, tbl, steps, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-10-4', code: 'WF 10.4', title: 'How to keep learning', sub: 'Web Foundations · Chapter 10' };

export const slides = deckWf({ chuong: 'Chapter 10 — Thinking, debugging, Git', bai: '10.4' }, [
  { cover: true, t: 'How to keep learning', sub: 'Build, read the docs, shrink the bug, ask well, read the source' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Pick projects that make you <b>learn</b></li>
    <li>Find answers in <b>official docs</b></li>
    <li>Shrink a bug to a <b>minimal reproduction</b></li>
    <li>Write a question people can <b>answer</b></li>
    <li>Read a library's <b>source</b></li></ul>` },

  { t: 'Build, do not only watch', to: true, giua: true, body: tbl(['Build', 'Practises'], [['page + contact form', 'HTML, form, API, validation'], ['tracker with login', 'sessions, DB, CRUD'], ['same, in TypeScript + tests', 'types, node --test'], ['a tool real people use', 'bugs, deploy, Git']]) + box('~20% unknown', 'less is boring, much more is paralysing', 'info') },

  { t: 'A bug hiding in a big program', giua: true, body: term('_t10/out/big-app', null, { title: 'node big-app.mjs' }) + box('"works with my data"', '2 notes look right; 5 do not', 'bad') },

  { t: 'Shrink it to one line', giua: true, body: term('_t10/out/repro', null, { title: 'repro-1 → repro-2', sm: true }) + box('Comparator contract', 'negative, 0 or positive — never true/false', 'ok') },

  { t: 'Read the docs first', giua: true, body: term('_t10/out/docs', null, { title: 'node docs.mjs' }) + box('MDN, first paragraphs', 'default sort compares strings: "10" < "9"', 'info') },

  { t: 'Ask a good question', to: true, giua: true, body: steps([
      '<b>Title</b> that names the problem',
      '<b>Minimal code</b>, as text',
      '<b>Expected vs actual</b>, exactly',
      '<b>What you tried</b>',
      '<b>Versions</b> — and no secrets',
    ]) },

  { t: "Read other people's code", giua: true, body: term(null, OUT['_t10/out/read-source'].split('\n').slice(0, 2).join('\n') + '\n\n' + OUT['_t10/out/read-source'].split('\n').slice(3, 10).join('\n'), { title: 'node_modules/ms/index.js' }) + box('Libraries are just code', 'line 52 is the whole contract', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Build, finish, repeat</li>
    <li>Shrink before asking</li>
    <li>Docs for your version</li>
    <li>Read the source</li></ul>`,
    box('Practice (45 min)', 'Reduce big-app.mjs, find the MDN sentence, write (not send) the question, read one package.<br><br><b>Done when</b>: repro under 10 lines.', 'ok')) },
]);
