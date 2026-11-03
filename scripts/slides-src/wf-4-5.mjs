/** Web Foundations · deck bài 4.5 — DOM và sự kiện. Output + ảnh thật: _demo/4-5 (Chromium). */
import { deckWf, html, js, con, anh, box, two, tbl, steps, CODE } from './_wf-bai.mjs';

export const deck = { key: 'wf-4-5', code: 'WF 4.5', title: 'The DOM and events', sub: 'Web Foundations · Chapter 4' };
const cat = (k, a, b) => CODE[k].split('\n').slice(a - 1, b).join('\n');

export const slides = deckWf({ chuong: 'Chapter 4 — JavaScript', bai: '4.5' }, [
  { cover: true, t: 'The DOM and events', sub: 'JavaScript meets the page — find, change, listen, and build a small app safely' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li><b>Find</b> any element on a page</li>
    <li><b>Change</b> text, classes, attributes; create elements</li>
    <li>Insert user text <b>safely</b> (no XSS)</li>
    <li>Run code on <b>clicks and typing</b></li>
    <li>Handle many elements with <b>one listener</b></li>
    <li>Build an app as <b>data → render</b></li></ul>` },

  { t: 'Finding elements', giua: true, body: two(js(null, cat('4-5/chon.html', 11, 24), { gon: true }), `${con('4-5/chon')}
    ${box('null is silent', 'No match ⇒ <code class="i">null</code>. The error comes on the <b>next</b> line and names the property, not the selector.', 'bad')}`, 'r64') },

  { t: 'Changing the page', giua: true, body: two(js(null, cat('4-5/doi-trang.html', 12, 25), { gon: true }), `${anh('4-5/doi-trang.png', { w: 420 })}${con('4-5/doi-trang')}`, 'r64') },

  { t: 'textContent or innerHTML?', giua: true, body: two(js(null, cat('4-5/xss.html', 8, 13), { gon: true }), `${anh('4-5/xss.png', { w: 440 })}
    ${con('4-5/xss')}
    ${box('XSS', 'Untrusted data goes in with <code class="i">textContent</code>. Never <code class="i">innerHTML</code>.', 'bad')}`, 'r64') },

  { t: 'When does the script run?', giua: true, body: `${html('4-5/som-qua.html', null, { chi: [1, 15] })}
    ${two(con('4-5/som-qua'), box('Default', '<code class="i">&lt;script src="app.js" defer&gt;</code> in the head: downloads early, runs after parsing.', 'ok'))}` },

  { t: 'Events and bubbling', giua: true, body: `${js(null, cat('4-5/su-kien.html', 9, 16), { gon: true })}
    ${two(con('4-5/su-kien'), tbl(['', ''], [['target', 'where it started'], ['currentTarget', 'whose listener runs'], ['bubbling', 'up through ancestors'], ['preventDefault', 'cancel the default action']]))}` },

  { t: 'Event delegation', giua: true, body: `${js(null, cat('4-5/uy-quyen.html', 7, 16), { gon: true })}
    ${two(con('4-5/uy-quyen'), box('One listener on the parent', 'Works for rows added later. <code class="i">closest(\'button\')</code> finds which one.', 'ok'))}` },

  { t: 'A complete todo app', giua: true, body: two(`${anh('4-5/todo.png', { w: 440 })}${con('4-5/todo')}`, steps([
      '<b>State</b>: an array, the only source of truth',
      '<b>Render</b>: redraw the list from the array',
      '<b>Events</b>: change the array, then render',
      'User text via <code class="i">textContent</code>',
    ]) + box('This is React', 'Change the data, redraw from the data — React does exactly this for you.', 'info')) },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>querySelector · null</li>
    <li>textContent, classList</li>
    <li>No innerHTML with user data</li>
    <li>defer · bubbling · delegation</li>
    <li>Data → render</li></ul>`,
    box('Practice (40 min)', 'Finish the todo app: delete, clear done, save to localStorage.<br><br><b>Done when</b>: tasks survive a reload, <code class="i">&lt;b&gt;bold&lt;/b&gt;</code> shows as text, the counter is right and the Console is clean.', 'ok')) },
]);
