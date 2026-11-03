/** Web Foundations · deck bài 3.5 — Responsive. Output + ảnh thật: _demo/3-5, _t3/out (iPhone 13 giả lập, ba bề rộng). */
import { deckWf, css, con, term, anh, box, two, three, tbl, vsd, steps, cap } from './_wf-bai.mjs';

export const deck = { key: 'wf-3-5', code: 'WF 3.5', title: 'Responsive design', sub: 'Web Foundations · Chapter 3' };

export const slides = deckWf({ chuong: 'Chapter 3 — CSS', bai: '3.5' }, [
  { cover: true, t: 'Responsive design', sub: 'One page, every screen — measured on an emulated phone and three widths' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Explain the one tag every page needs</li>
    <li>Write <b>media queries</b>, phone first</li>
    <li>Use fluid sizes: <b>clamp()</b> and <b>min()</b></li>
    <li>Stop images and tables from <b>overflowing</b></li>
    <li>Design for fingers, not only for mice</li>
    <li><b>Test</b> and measure at every size</li></ul>` },

  { t: 'The viewport tag', giua: true, body: two(`<div>${anh('3-5/khong-viewport-phone.png', { w: 200 })}${cap('no tag: 980 px, tiny')}</div>`, `<div>${anh('3-5/co-viewport-phone.png', { w: 200 })}${cap('with the tag: 390 px')}</div>`, 'r37') + term('_t3/out/viewport', null, { title: 'emulated iPhone 13' }) },

  { t: 'Media queries', giua: true, body: `${three(`<div>${anh('3-5/mf-dt.png', { w: 200 })}${cap('390 px')}</div>`, `<div>${anh('3-5/mf-tablet.png', { w: 340 })}${cap('768 px')}</div>`, `<div>${anh('3-5/mf-laptop.png', { w: 380 })}${cap('1100 px')}</div>`)}
    ${term('_t3/out/mobile-first', null, { title: 'the same HTML; only the rules that apply differ' })}` },

  { t: 'Mobile first', giua: true, body: `${css('3-5/mobile-first.html', null, { chi: [8, 18] })}
    ${two(tbl(['', 'min-width', 'max-width'], [['Base', 'simple phone layout', 'complex layout'], ['Queries', 'add', 'undo']]), box('Breakpoints', 'Put them where the <b>content</b> breaks, not at device names. Drag the window to find them.', 'ok'))}` },

  { t: 'Fluid units', giua: true, body: `${con('3-5/don-vi')}
    ${two(box('clamp(min, ideal, max)', 'A size with a floor and a ceiling: it glides instead of jumping.', 'info'), box('Careful', '<code class="i">100vh</code> on a phone ignores the address bar. Use <code class="i">100dvh</code>.', 'bad'))}` },

  { t: 'Images and tables', giua: true, body: `${con('3-5/anh-co-gian')}
    ${css(null, `img { max-width: 100%; height: auto; }
.scroller { overflow-x: auto; }`, { gon: false })}
    ${box('Find the overflow', '<code class="i">[...document.querySelectorAll(\'*\')].filter(el =&gt; el.getBoundingClientRect().right &gt; innerWidth)</code>', 'info')}` },

  { t: 'Touch is not a mouse', to: true, giua: true, body: `${tbl(['Mouse', 'Finger'], [['hover exists', 'no hover'], ['tiny pointer', 'targets of 44 × 44 px'], ['any input size', 'under 16 px zooms on iOS']])}
    ${css(null, `@media (hover: hover) {
  .btn:hover { background: #17406f; }
}`, { gon: false })}` },

  { t: 'How to test', to: true, giua: true, body: steps([
      '<b>Drag the window</b> from wide to 320 px',
      '<b>Device toolbar</b>: Ctrl/Cmd+Shift+M',
      '<b>A real phone</b>: thumb reach, speed, the moving address bar',
      '<b>Measure</b>: <code class="i">scrollWidth &gt; innerWidth</code> must be false',
    ]) + box('Do not hide it', 'Never cover an overflow with <code class="i">body { overflow-x: hidden }</code>. Find the element that forces the width.', 'bad') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Viewport tag on every page</li>
    <li>Base = phone; <code class="i">min-width</code> adds</li>
    <li><code class="i">clamp</code>, <code class="i">min</code>, <code class="i">dvh</code></li>
    <li><code class="i">max-width: 100%</code> on images</li>
    <li>44 px targets, no hover-only UI</li></ul>`,
    box('Practice (30 min)', 'Make your shop page work from 320 px up.<br><br><b>Done when</b>: no horizontal overflow at 320, 390, 768 and 1280 px, text readable with no zoom, and every control reachable by thumb.', 'ok')) },
]);
