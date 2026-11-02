/** Web Foundations · deck bài 3.3 — Flexbox. Output + ảnh thật: _demo/3-3, _t3/out/order-tab. */
import { deckWf, html, css, con, term, anh, box, two, tbl, vsd, CODE } from './_wf-bai.mjs';

export const deck = { key: 'wf-3-3', code: 'WF 3.3', title: 'Flexbox', sub: 'Web Foundations · Chapter 3' };

export const slides = deckWf({ chuong: 'Chapter 3 — CSS', bai: '3.3' }, [
  { cover: true, t: 'Flexbox', sub: 'Arranging things in one line — two axes, a few properties, and one famous bug' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Lay out a <b>row or column</b> of anything</li>
    <li><b>Centre</b> an item in both directions</li>
    <li>Build a <b>navigation bar</b></li>
    <li>Control how items <b>share space</b></li>
    <li>Make a row <b>wrap</b> on small screens</li>
    <li>Fix the overflow bug with <code class="i">min-width: 0</code></li></ul>` },

  { t: 'Two axes', to: true, giua: true, body: two(css(null, `.toolbar {
  display: flex;
  flex-direction: row;       /* main axis */
  justify-content: center;   /* along the main axis */
  align-items: center;       /* across it */
  gap: 12px;
}`, { gon: false }), `${box('Remember', '<b>justify = along the flow</b><br><b>align = across the flow</b>', 'ok')}
    ${box('Careful', 'With <code class="i">flex-direction: column</code> the axes swap: justify becomes vertical.', 'bad')}`) },

  { t: 'Measured on a real page', giua: true, body: two(anh('3-3/truc.png', { w: 540 }), con('3-3/truc', null, { title: '(x,y) width×height of each item' }), 'r46') },

  { t: 'Perfect centring, a real navbar', giua: true, body: `${two(css(null, `.stage {
  display: flex;
  justify-content: center;
  align-items: center;
}`, { gon: false }), con('3-3/can-giua'))}
    ${anh('3-3/thanh-nav.png', { w: 760 })}
    ${two(css(null, '.push { margin-left: auto; }', { gon: false }), con('3-3/thanh-nav'))}` },

  { t: 'grow, shrink, basis', giua: true, body: `${con('3-3/co-gian', null, { title: 'real widths in a 600-pixel row' })}
    ${two(tbl(['You want', 'Write'], [['equal columns', 'flex: 1'], ['fixed + flexible', 'flex: 0 0 200px + flex: 1'], ['double width', 'flex: 2 + flex: 1']]), box('flex: grow shrink basis', 'Grow: a share of spare space. Shrink: give up space. Basis: the starting size.', 'info'))}` },

  { t: 'Wrapping and gap', giua: true, body: two(`${anh('3-3/xuong-dong.png', { w: 500 })}`, `${con('3-3/xuong-dong')}
    ${box('Responsive with no media query', '<code class="i">flex-wrap: wrap</code> + <code class="i">flex: 1 1 180px</code> + <code class="i">gap</code>', 'ok')}`) },

  { t: 'The min-width bug', giua: true, body: two(`${anh('3-3/min-width.png', { w: 500 })}`, `${con('3-3/min-width')}
    ${box('Why', 'A flex item defaults to <code class="i">min-width: auto</code>: never smaller than its content.', 'info')}
    ${box('Fix', '<code class="i">.main { min-width: 0; }</code>', 'ok')}`) },

  { t: 'order changes the look, not the keyboard', giua: true, body: `${term('_t3/out/order-tab', null, { title: 'real Tab key' })}
    ${vsd('<ul><li><code class="i">order</code> or <code class="i">row-reverse</code> for important content</li></ul>', '<ul><li>Change the HTML when the reading order matters</li></ul>', '✗ Trap', '✓ Instead')}
    ${box('Flexbox or Grid?', '<b>Flexbox</b> for a line of things sized by content. <b>Grid</b> when rows and columns must line up.', 'info')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li><code class="i">display: flex</code> on the parent</li>
    <li>justify along, align across</li>
    <li><code class="i">flex: 1</code> shares space</li>
    <li>wrap + gap for simple responsive rows</li>
    <li>Stuck overflow? <code class="i">min-width: 0</code></li></ul>`,
    box('Practice (30 min)', 'A header and three cards with buttons pinned to the bottom.<br><br><b>Done when</b>: no horizontal scrollbar at any width, cards go 3 → 2 → 1, and <code class="i">scrollWidth === innerWidth</code>.', 'ok')) },
]);
