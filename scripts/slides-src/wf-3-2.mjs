/** Web Foundations · deck bài 3.2 — Mô hình hộp. Output + ảnh thật: _demo/3-2 (Chromium). */
import { deckWf, html, css, con, anh, box, two, tbl, steps, CODE } from './_wf-bai.mjs';

export const deck = { key: 'wf-3-2', code: 'WF 3.2', title: 'The box model', sub: 'Web Foundations · Chapter 3' };

export const slides = deckWf({ chuong: 'Chapter 3 — CSS', bai: '3.2' }, [
  { cover: true, t: 'The box model', sub: 'Every element is a box — how big it really is, and what it does to the space around it' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read the <b>box</b> of any element in DevTools</li>
    <li>Make widths mean what you think with <b>box-sizing</b></li>
    <li>Use margin and padding, and <b>centre</b> a block</li>
    <li>Explain why margins <b>collapse</b></li>
    <li>Handle content that <b>does not fit</b></li>
    <li>Choose the right way to <b>hide</b> something</li></ul>` },

  { t: 'Four layers of a box', to: true, giua: true, body: tbl(['Layer', 'Where', 'Notes'], [
      ['margin', 'outside the box', 'space to the neighbours; always transparent'],
      ['border', 'the edge', 'a line around the padding'],
      ['padding', 'inside the box', 'shows the background colour'],
      ['content', 'the centre', 'text, images, children'],
    ]) + box('See it', 'Inspect → <b>Computed</b>: a diagram with the real numbers. Trick: <code class="i">* { outline: 1px solid red; }</code> shows every box without changing the layout.', 'ok') },

  { t: 'width: 300px is not always 300 pixels', giua: true, body: `${two(anh('3-2/hop.png', { w: 500 }), con('3-2/hop'))}
    ${css(null, `*, *::before, *::after { box-sizing: border-box; }   /* the first rule of almost every project */`, { gon: false })}` },

  { t: 'Shorthand and centring', to: true, giua: true, body: two(tbl(['You write', 'Means'], [
      ['margin: 10px', 'all four sides'],
      ['margin: 10px 20px', 'vertical, horizontal'],
      ['margin: 1px 2px 3px 4px', 'clockwise from the top'],
    ]), css(null, `.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}`, { gon: false }) + box('auto', 'The browser shares the free space between left and right.', 'info')) },

  { t: 'Margins collapse', giua: true, body: `${css(null, CODE['3-2/gop-le.html'].split('\n').slice(6, 12).join('\n'), { gon: false })}
    ${con('3-2/gop-le')}
    ${box('Rule', 'Vertical margins touch ⇒ the larger one wins. Padding, a border or <code class="i">display: flow-root</code> on the parent stops the escape. Flex and grid children never collapse.', 'info')}` },

  { t: 'block, inline, inline-block', giua: true, body: `${two(anh('3-2/hien-thi.png', { w: 500 }), con('3-2/hien-thi'))}
    ${tbl(['', 'block', 'inline', 'inline-block'], [['New line', 'yes', 'no', 'no'], ['width / height', 'yes', 'IGNORED', 'yes']])}` },

  { t: 'When content does not fit', giua: true, body: two(`${anh('3-2/tran.png', { w: 500 })}`, `${con('3-2/tran')}
    ${tbl(['Tool', 'Does'], [['overflow-wrap: anywhere', 'breaks long words'], ['overflow: auto', 'scrollbars when needed'], ['text-overflow: ellipsis', 'ends with …']])}
    ${box('Trap', 'Fixed <code class="i">height</code>. Use <code class="i">min-height</code>.', 'bad')}`) },

  { t: 'Three ways to hide', giua: true, body: `${con('3-2/an-di')}
    ${tbl(['', 'Keeps space', 'Clickable', 'Tab reaches it'], [['display: none', 'no', 'no', 'no'], ['visibility: hidden', 'yes', 'no', 'no'], ['opacity: 0', 'yes', 'YES', 'YES']])}
    ${box('Trap', 'An element faded with <code class="i">opacity: 0</code> still catches clicks. Add <code class="i">visibility: hidden</code>.', 'bad')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>content → padding → border → margin</li>
    <li>Start with <code class="i">border-box</code></li>
    <li>Vertical margins collapse</li>
    <li>Inline ignores width and height</li>
    <li>Let content set the height</li></ul>`,
    box('Practice (25 min)', 'Three pricing cards in a centred page.<br><br><b>Done when</b>: <code class="i">offsetWidth</code> is exactly 280, Computed shows the 24 padding and 2 border, there is no horizontal scrollbar, and you can explain margin collapse.', 'ok')) },
]);
