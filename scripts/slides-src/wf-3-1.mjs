/** Web Foundations · deck bài 3.1 — CSS cơ bản. Output + ảnh thật: _demo/3-1 (Chromium). */
import { deckWf, html, css, con, anh, box, two, tbl, steps, vsd, CODE } from './_wf-bai.mjs';

export const deck = { key: 'wf-3-1', code: 'WF 3.1', title: 'CSS basics', sub: 'Web Foundations · Chapter 3' };

export const slides = deckWf({ chuong: 'Chapter 3 — CSS', bai: '3.1' }, [
  { cover: true, t: 'CSS basics', sub: 'Selecting elements, and knowing which rule wins' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Write a rule and attach a <b>stylesheet</b></li>
    <li>Select exactly the elements you want</li>
    <li>Predict which of two rules <b>wins</b></li>
    <li>Use <b>inheritance</b> instead of repeating yourself</li>
    <li>Find out why a style is ignored with <b>DevTools → Styles</b></li></ul>` },

  { t: 'Anatomy of a rule, three ways to add it', giua: true, body: two(`${css(null, `h1 {               /* selector */
  color: #1f4e8c;  /* property: value; */
  font-size: 28px;
}`, { gon: false })}
    ${tbl(['Where', 'When'], [['external file', 'the normal way: one file, the whole site'], ['style element', 'quick demos'], ['style attribute', 'only when a script sets it']])}`, `${anh('3-1/ba-cach.png', { w: 480 })}${con('3-1/ba-cach')}`) },

  { t: 'Selectors', giua: true, body: two(con('3-1/bo-chon', null, { title: 'querySelectorAll(…).length' }), tbl(['Syntax', 'Means'], [
      ['nav a', 'space: anywhere inside'],
      ['article > p', 'direct child'],
      ['a.link.active', 'no space: same element'],
      ['h1, h2', 'either'],
      ['[href^="https"]', 'attribute starts with'],
      ['h2 + p', 'right after'],
      [':hover', 'a state (pseudo-class)'],
    ])) },

  { t: 'The cascade: which rule wins?', giua: true, body: two(css(null, CODE['3-1/cascade.html'].split('\n').slice(5, 16).join('\n')), `${con('3-1/cascade')}
    ${steps(['<b>Importance</b>', '<b>Specificity</b>', '<b>Order</b> (only breaks ties)', 'Inheritance last'])}`) },

  { t: 'Specificity is a score', to: true, giua: true, body: two(tbl(['Selector', '(ids, classes, tags)'], [
      ['p', '(0, 0, 1)'], ['article p', '(0, 0, 2)'], ['.card', '(0, 1, 0)'], ['.card .title', '(0, 2, 0)'], ['a:hover', '(0, 1, 1)'], ['#top', '(1, 0, 0)'],
    ]), `${box('Compare left to right', 'One id beats a hundred classes. Order only matters if the scores are equal.', 'info')}
    ${box('Keep it low', 'Single classes. No ids in CSS. No <code class="i">!important</code>: each one forces the next rule to be stronger.', 'bad')}`) },

  { t: 'Inheritance', giua: true, body: `${two(anh('3-1/ke-thua.png', { w: 500 }), con('3-1/ke-thua'))}
    ${box('Rule of thumb', 'Text properties inherit (color, font). Box properties do not (border, padding). Fix the exceptions: <code class="i">a { color: inherit }</code>, <code class="i">button, input { font: inherit }</code>.', 'ok')}` },

  { t: 'Colours and units', giua: true, body: `${con('3-1/mau-don-vi')}
    ${two(tbl(['Colour', 'Good for'], [['#1f4e8c', 'copied from design tools'], ['rgb(… / 50%)', 'transparency'], ['hsl(214 64% 34%)', 'lighter shades']]), tbl(['Unit', 'Relative to'], [['%', 'the parent'], ['em', 'this font size'], ['rem', 'the root (best default)'], ['vw', 'the window']]))}` },

  { t: 'CSS fails silently', giua: true, body: `${css(null, CODE['3-1/loi-css.html'].split('\n').slice(4, 9).join('\n'), { gon: false })}
    ${con('3-1/loi-css')}
    ${box('In DevTools → Styles', 'Absent = no match · struck through = another rule won · yellow triangle = typo · otherwise look at Computed.', 'info')}` },

  { t: 'Styling a button, keeping focus', giua: true, body: two(css(null, CODE['3-1/nut-tieu-diem.html'].split('\n').slice(5, 17).join('\n').replace('{ outline: 3px solid #e08a1e; outline-offset: 2px; }', '{ outline: 3px solid #e08a1e; }'), { gon: true }), `${anh('3-1/nut-tieu-diem.png', { w: 420 })}
    ${con('3-1/nut-tieu-diem')}
    ${box('Never', '<code class="i">outline: none</code> with no replacement. Use <code class="i">:focus-visible</code>.', 'bad')}`, 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Selector + declarations</li>
    <li>Importance → specificity → order</li>
    <li>Text inherits, boxes do not</li>
    <li>Prefer <code class="i">rem</code>, classes, low specificity</li>
    <li>Fails silently: open DevTools</li></ul>`,
    box('Practice (25 min)', 'A profile card with classes only, then create a conflict.<br><br><b>Done when</b>: the red line is struck through in Styles and you can say why, Tab shows your own focus ring, and no ids appear in your CSS.', 'ok')) },
]);
