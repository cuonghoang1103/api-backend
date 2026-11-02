/** Web Foundations · deck bài 2.2 — Chữ, liên kết, ảnh. Output + ảnh thật: _demo/2-2 (Chromium), _t2/out/anh-giu-cho (ảnh chậm 1 s). */
import { deckWf, html, con, term, anh, box, two, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-2-2', code: 'WF 2.2', title: 'Text, links and images', sub: 'Web Foundations · Chapter 2' };

export const slides = deckWf({ chuong: 'Chapter 2 — HTML', bai: '2.2' }, [
  { cover: true, t: 'Text, links and images', sub: 'The three things nearly every page is made of — and the quiet rule behind each one' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Choose <b>headings</b> by structure, not by size</li>
    <li>Control line breaks: the browser <b>collapses whitespace</b></li>
    <li>Predict where any <b>relative link</b> will go</li>
    <li>Write useful <b>alt</b> text</li>
    <li>Stop images from making the page <b>jump</b></li>
    <li>Let the browser pick the right file with <b>srcset</b></li></ul>` },

  { t: 'Headings are an outline', giua: true, body: two(html('2-2/dan-y.html', null, { chi: [5, 9] }), `${con('2-2/dan-y', null, { title: 'what a screen reader lists' })}
    ${box('Rules', 'One <code class="i">h1</code> per page · never skip a level · choose by structure; CSS changes the size.', 'ok')}`) },

  { t: 'The browser collapses whitespace', giua: true, body: `${two(html('2-2/khoang-trang.html', null, { chi: [5, 10] }), anh('2-2/khoang-trang.png', { w: 500 }))}
    ${con('2-2/khoang-trang')}` },

  { t: 'Lists', giua: true, body: two(`${anh('2-2/danh-sach.png', { w: 530 })}${con('2-2/danh-sach')}`, tbl(['Tag', 'Use for'], [
      ['ul', 'order does not matter (menus too)'],
      ['ol', 'steps, rankings'],
      ['dl / dt / dd', 'terms with definitions'],
    ]) + box('Nesting', 'A nested list goes <b>inside an li</b>. Only <code class="i">li</code> may be a direct child of <code class="i">ul</code>/<code class="i">ol</code>.', 'info')) },

  { t: 'How a link becomes an address', giua: true, body: `${con('2-2/lien-ket', null, { title: 'href → what the browser resolved' })}
    ${tbl(['Starts with', 'Means'], [['a name', 'from the current folder'], ['../', 'up one folder'], ['/', 'from the root of this website'], ['#', 'a spot on this page, no request']])}` },

  { t: 'Links: details that matter', to: true, giua: true, body: `${html(null, `<a href="/docs/guide.pdf" download>Download the guide</a>
<a href="https://example.com" target="_blank" rel="noopener">New tab</a>
<h2 id="pricing">Pricing</h2>  …  <a href="#pricing">See pricing</a>`, { gon: false })}
    ${vsd('<ul><li>“click here”, “read more”</li><li><code class="i">images/Logo.PNG</code>, <code class="i">Trang Chủ.html</code></li></ul>', '<ul><li>Link text names the destination</li><li>lowercase-with-hyphens: Linux servers are case-sensitive</li></ul>', '✗ Trap', '✓ Instead')}` },

  { t: 'When an image fails', giua: true, body: two(`${anh('2-2/anh-loi.png', { w: 500 })}${con('2-2/anh-loi')}`, tbl(['The image is…', 'alt'], [
      ['content', 'what it shows, why it matters'],
      ['a link', 'where it goes'],
      ['a chart', 'the conclusion'],
      ['decoration', 'alt="" — empty, not missing'],
    ]), 'r46') },

  { t: 'Give images a size', giua: true, body: `${html('2-2/cho-giu-cho.html', null, { chi: [7, 7], gon: false })}${html('2-2/cho-giu-cho.html', null, { chi: [11, 11], gon: false })}
    ${term('_t2/out/anh-giu-cho', null, { title: 'images delayed by 1 second, measured in Chromium' })}
    ${box('Layout shift', 'Without a size the browser reserves nothing, and the text jumps when the file arrives. <code class="i">width</code> + <code class="i">height</code> give it the ratio; CSS can still resize the image.', 'ok')}` },

  { t: 'The right file for the screen', giua: true, body: `${html(null, `<img src="m.jpg" alt="Banner" width="800" height="400" loading="lazy"
     srcset="s.jpg 400w, m.jpg 800w, l.jpg 1600w" sizes="100vw">`, { gon: false })}
    ${two(con('2-2/srcset', null, { title: 'which file each frame really used' }), tbl(['Format', 'For'], [['WebP / AVIF', 'photos (modern default)'], ['JPEG', 'photos (maximum compatibility)'], ['PNG', 'screenshots, transparency'], ['SVG', 'logos, icons']]))}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Headings = outline</li>
    <li>Whitespace collapses</li>
    <li>Relative, <code class="i">../</code>, <code class="i">/</code>, <code class="i">#</code></li>
    <li>alt on every image; size on every image</li>
    <li>srcset + lazy + compress</li></ul>`,
    box('Practice (25 min)', 'A recipe site with real folders: list page, recipe page, images.<br><br><b>Done when</b>: no 404 in Network, links work both ways, one <code class="i">h1</code> with no skipped levels, and the alt text shows when the image is renamed.', 'ok')) },
]);
