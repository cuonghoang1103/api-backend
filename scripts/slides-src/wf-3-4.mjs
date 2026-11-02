/** Web Foundations · deck bài 3.4 — CSS Grid. Output + ảnh thật: _demo/3-4 (Chromium). */
import { deckWf, css, con, anh, box, two, tbl, steps, CODE } from './_wf-bai.mjs';

export const deck = { key: 'wf-3-4', code: 'WF 3.4', title: 'CSS Grid', sub: 'Web Foundations · Chapter 3' };

export const slides = deckWf({ chuong: 'Chapter 3 — CSS', bai: '3.4' }, [
  { cover: true, t: 'CSS Grid', sub: 'Rows and columns at the same time — and a gallery that picks its own columns' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Define a grid with <b>fixed and flexible</b> columns</li>
    <li>Place items across several tracks</li>
    <li>Write a <b>page layout</b> as a text map</li>
    <li>Build a <b>gallery</b> with no media query</li>
    <li>Choose between <b>Grid and Flexbox</b></li></ul>` },

  { t: 'Tracks, fr and gap', giua: true, body: `${two(css('3-4/luoi.html', null, { chi: [8, 10], gon: false }), con('3-4/luoi', null, { title: 'computed tracks' }))}
    ${steps(['600 − two gaps of 8 = <b>584</b> free', '1fr + 2fr + 1fr = <b>4</b> shares', '584 ÷ 4 = <b>146</b> ⇒ 146, 292, 146'])}` },

  { t: 'Items span tracks', giua: true, body: two(anh('3-4/luoi.png', { w: 520 }), `${css(null, `.wide   { grid-column: span 2; }
.banner { grid-column: 1 / -1; }
.tall   { grid-row: span 2; }`, { gon: false })}
    ${box('Implicit rows', 'We declared no rows, yet two appeared: extra items create them, so a grid accepts any number of items.', 'info')}`) },

  { t: 'Named areas: a page layout', giua: true, body: two(`${css('3-4/vung.html', null, { chi: [6, 15], gon: false })}`, `${anh('3-4/vung.png', { w: 460 })}
    ${con('3-4/vung')}`) },

  { t: 'A responsive gallery in one line', giua: true, body: `${css(null, `.gallery { display: grid; gap: 12px;
           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }`, { gon: false })}
    ${con('3-4/tu-dong', null, { title: 'the same page at four real window widths' })}
    ${box('Read it inside out', 'Each column: at least 200 pixels, at most a share of the space. <b>As many as fit.</b> No media query.', 'ok')}` },

  { t: 'auto-fit or auto-fill?', giua: true, body: `${anh('3-4/fit-fill.png', { w: 760 })}
    ${con('3-4/fit-fill')}
    ${box('', '<code class="i">auto-fit</code> collapses empty columns: items stretch. <code class="i">auto-fill</code> keeps them: items stay small.', 'info')}` },

  { t: 'Percentages plus gap overflow', to: true, giua: true, body: `${css('3-4/bay-phan-tram.html', null, { chi: [6, 7], gon: false })}
    ${con('3-4/bay-phan-tram')}
    ${box('Prefer fr', 'Percentages fill 100%, then gaps are added on top. <code class="i">fr</code> divides what is left after the gaps.', 'bad')}` },

  { t: 'Grid or Flexbox?', to: true, giua: true, body: tbl(['', 'Flexbox', 'Grid'], [
      ['Dimensions', 'one line (may wrap)', 'rows and columns'],
      ['Size decided by', 'the content', 'the layout'],
      ['Examples', 'menu, buttons, form row', 'page shell, gallery, dashboard'],
    ]) + box('Use both', 'Grid for the page and the gallery, Flexbox inside each card. Only <b>direct children</b> are items, in both.', 'ok') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li><code class="i">fr</code> shares the free space</li>
    <li><code class="i">span</code> and implicit rows</li>
    <li>Draw pages with named areas</li>
    <li><code class="i">auto-fit</code> + <code class="i">minmax</code></li>
    <li>Prefer <code class="i">fr</code> to %</li></ul>`,
    box('Practice (30 min)', 'A shop page: named areas, an eight-card gallery, the first card spanning two columns.<br><br><b>Done when</b>: the column count changes as you resize, no horizontal scrollbar at 360 px, and the footer stays at the bottom.', 'ok')) },
]);
