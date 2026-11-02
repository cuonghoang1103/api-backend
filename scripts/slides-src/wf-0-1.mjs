/** Web Foundations · deck bài 0.1 — Bắt đầu: bản đồ toàn khoá. Ảnh + output thật: _demo/0-1 (Chromium). */
import { deckWf, html, con, anh, box, two, three, steps, tbl, vsd, cap } from './_wf-bai.mjs';

export const deck = { key: 'wf-0-1', code: 'WF 0.1', title: 'Start here', sub: 'Web Foundations · Section 0' };

export const slides = deckWf({ chuong: 'Section 0 — Getting started', bai: '0.1' }, [
  { cover: true, t: 'Start here', sub: 'What web development is, the four layers of every web app, and the map of all 15 chapters' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Say what <b>HTML</b>, <b>CSS</b> and <b>JavaScript</b> each do — seen on one real page</li>
    <li>Draw the <b>four layers</b>: browser, network, server, database</li>
    <li>Explain why a reload makes the browser <b>forget</b></li>
    <li>Explain why <b>nothing in the browser is secret</b></li>
    <li>Find your way on the <b>15-chapter roadmap</b> and plan your study time</li></ul>` },

  { t: 'Why framework courses feel impossible', to: true, giua: true, body: two(steps([
      'A Node.js / Next.js lesson uses HTML, CSS, JS, HTTP, cookies, APIs, SQL…',
      '…and assumes you already know all of them.',
      'One missing layer ⇒ the lesson looks like magic.',
      'You copy code you cannot change.',
    ]), box('This course', 'Builds every missing layer <b>from zero</b>, in the order they depend on each other. After it, a framework feels like “X with a nicer name”.', 'ok'), 'r55') },

  { t: 'One page, three languages', giua: true, body: `${three(
      `<div>${anh('0-1/lop-1-html.png', { w: 340 })}${cap('<b>HTML</b> — structure')}</div>`,
      `<div>${anh('0-1/lop-2-css.png', { w: 340 })}${cap('<b>+ CSS</b> — appearance')}</div>`,
      `<div>${anh('0-1/lop-3-js.png', { w: 340 })}${cap('<b>+ JavaScript</b> — behaviour (3 clicks)')}</div>`)}
    ${tbl(['Language', 'Job', 'Like a house…', 'Chapter'], [['HTML', 'what each piece IS', 'walls and rooms', '2'], ['CSS', 'how it LOOKS', 'paint and furniture', '3, 12'], ['JavaScript', 'what it DOES', 'electricity', '4, 5, 11']])}` },

  { t: 'What JavaScript adds', giua: true, body: `${html('0-1/lop-3-js.html', null, { chi: [20, 33] })}
    ${two(con('0-1/lop-3-js'), box('Now reload the page', 'The counter is back to <b>0</b>. The variable lived in one browser tab. To remember likes for everyone you need a <b>server</b> and a <b>database</b>.', 'bad'))}` },

  { t: 'The four layers of every web app', to: true, giua: true, body: tbl(['Layer', 'Made of', 'Its job', 'Chapters'], [
      ['🖥️ Browser (frontend)', 'HTML, CSS, JavaScript', 'show things, react to clicks — runs on the USER’s machine', '2–5, 11–12'],
      ['🌐 Network', 'HTTP requests & responses', 'carry every interaction there and back', '0.2, 6'],
      ['⚙️ Server (backend)', 'Node.js — your code', 'check passwords, decide, keep secrets', '6–7'],
      ['🗄️ Database', 'SQL tables', 'remember after the request ends', '8'],
    ]) + box('Words', '<b>frontend</b> = browser side · <b>backend</b> = server + database · <b>full-stack</b> = both', 'info') },

  { t: 'The browser is public', giua: true, body: `${html('0-1/bi-mat.html', null, { chi: [6, 16] })}
    ${two(con('0-1/bi-mat'), box('Rule — no exceptions', 'Everything sent to the browser is downloaded by the visitor (View Source, DevTools). <b>Secrets and final decisions live on the server.</b> Chapter 7 · Lesson 14.2.', 'bad'))}` },

  { t: 'The roadmap: 15 chapters', giua: true, body: tbl(['Ch.', 'You learn', 'After it you can'], [
      ['0', 'how the web works · setup · how to study', 'explain a page load; a working machine'],
      ['1', 'terminal · VS Code · Git · GitHub · npm', 'create, version and publish a project'],
      ['2 · 3', 'HTML · CSS & responsive', 'build a correct page that works on a phone'],
      ['4 · 5', 'JavaScript · async JS & fetch', 'make pages react and load real data'],
      ['6 · 7 · 8', 'HTTP & APIs · auth & security · SQL', 'connect browser ⇄ server ⇄ database'],
      ['9 · 10', 'TypeScript · thinking & debugging · Git flow', 'work like a professional'],
      ['11–14', 'advanced JS & CSS · testing · shipping', 'go deeper; deploy a real site'],
    ]) + box('Next courses', 'After Ch. 8 ⇒ <b>Node.js</b>. After Ch. 4–5 + 9 ⇒ <b>React</b> and <b>Next.js</b>.', 'ok') },

  { t: 'How each lesson works', to: true, giua: true, body: two(steps([
      '📑 <b>Slides</b> + short explanation — skim first, revise later',
      '📖 <b>Written lesson</b> — every output is real; type the examples',
      '⚠️ <b>Traps</b> — the mistakes beginners really make',
      '🧪 <b>Practice</b> with a measurable <b>Done when</b>',
      '🧩 <b>Code Lab</b> graded in your browser · 📝 <b>Quiz</b> + review sheet',
    ]), vsd('<ul><li>Watch the video, feel you understood</li><li>Skip a chapter “I know HTML”</li><li>Seven hours on Sunday</li></ul>',
      '<ul><li>Close the page, rebuild from memory</li><li>Prove it: do the quiz first</li><li>One hour every day</li></ul>', '✗ Trap', '✓ Instead'), 'r55') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>HTML = structure · CSS = looks · JS = behaviour</li>
    <li>Browser · network · server · database</li>
    <li>The browser forgets and is public</li>
    <li>15 chapters, ~90–110 hours, a little every day</li></ul>`,
    box('Practice (15 min)', 'Type the three-layer page with <b>your name</b>, open it, press F12 → Console.<br><br><b>Done when</b>: 3 clicks show “3 likes”, the Console shows 3 lines, a reload shows 0 — and your weekly study slot is written down.', 'ok')) },
]);
