/** Web Foundations · deck bài 2.1 — HTML là gì. Output + ảnh thật: _demo/2-1 (Chromium). */
import { deckWf, html, con, anh, box, two, tbl, OUT } from './_wf-bai.mjs';

export const deck = { key: 'wf-2-1', code: 'WF 2.1', title: 'What HTML is', sub: 'Web Foundations · Chapter 2' };

const CH = { chuong: 'Chapter 2 — HTML', bai: '2.1' };
const OUT_DOC = OUT['2-1/khong-doctype'] + '\n' + OUT['2-1/co-doctype'];

export const slides = deckWf(CH, [
  { cover: true, t: 'What HTML is', sub: 'Elements, tags, attributes — and the tree the browser really builds' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Read and write any <b>element</b>: tag, content, attribute</li>
    <li>Type the <b>skeleton</b> of a page from memory</li>
    <li>Explain the <b>DOM</b>: the tree behind the page</li>
    <li>Avoid the traps: boolean attributes, duplicate ids, no doctype</li>
    <li>Find a broken tag with <b>Elements</b> and the <b>validator</b></li></ul>` },

  { t: 'Anatomy of an element', to: true, giua: true, body: `${html(null, `<p>Hello, world</p>
<a href="https://cuongthai.com">Visit CuongThai</a>
<img src="cat.jpg" alt="A grey cat sleeping on a sofa">
<br>`, { gon: false })}
    ${tbl(['Word', 'Means'], [['element', 'opening tag + content + closing tag'], ['tag', '&lt;p&gt; or &lt;/p&gt; — the part in angle brackets'], ['attribute', 'name="value" in the opening tag'], ['void element', 'no content, no closing tag: img, br, input, meta']])}` },

  { t: 'The skeleton of every page', giua: true, body: two(html('2-1/trang-dau-tien.html', null, { gon: false }), `${anh('2-1/trang-dau-tien.png', { w: 320 })}
    ${box('Tip', 'In VS Code: <code class="i">!</code> then Tab. Type it by hand a few times first.', 'info')}`, 'r73') },

  { t: 'The browser builds a tree', giua: true, body: two(`${html('2-1/cay-dom.html', null, { chi: [5, 9] })}
    ${box('The DOM', 'CSS and JavaScript work on this tree, not on your file. <b>Elements</b> shows the tree; <b>View Source</b> shows the file.', 'info')}`, con('2-1/cay-dom', null, { title: 'the real tree, printed' }), 'r55') },

  { t: 'HTML never throws an error', giua: true, body: `${html('2-1/tu-sua-loi.html', null, { chi: [5, 7] })}
    ${con('2-1/tu-sua-loi', null, { title: 'what the browser really built' })}
    ${box('Zero errors in the console', 'A stray <code class="i">&lt;/p&gt;</code> became an empty paragraph; crossed tags became two <code class="i">i</code> elements. Compare <b>Elements</b> with what you meant.', 'bad')}` },

  { t: 'Attributes', giua: true, body: `${html('2-1/thuoc-tinh.html', null, { chi: [5, 8] })}
    ${two(con('2-1/thuoc-tinh'), box('Boolean attributes', 'Presence means true. <code class="i">disabled="false"</code> <b>still disables</b>. To turn it off, remove the attribute.<br><br>And <code class="i">id</code> must be unique on the page.', 'bad'))}` },

  { t: 'Why the doctype matters', to: true, giua: true, body: `${con(null, OUT_DOC, { title: 'document.compatMode' })}
    ${two(box('BackCompat = quirks mode', 'The browser imitates the layout bugs of the 1990s so that very old pages keep working.', 'bad'), box('CSS1Compat = standards mode', 'The only mode you want. One line at the top of the file gets it.', 'ok'))}` },

  { t: 'Writing special characters', giua: true, body: two(`${html('2-1/ky-tu-dac-biet.html', null, { chi: [5, 7] })}${con('2-1/ky-tu-dac-biet')}`,
    `${anh('2-1/ky-tu-dac-biet.png', { w: 420 })}
    ${tbl(['Write', 'To show'], [['&amp;lt; &amp;gt;', '&lt; &gt;'], ['&amp;amp;', '&amp;'], ['&amp;nbsp;', 'a space that does not wrap']])}`, 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>HTML labels; it does not calculate</li>
    <li>Your file becomes the <b>DOM</b> tree</li>
    <li>Mistakes are repaired silently</li>
    <li>Boolean: presence = true · id = unique</li>
    <li>Doctype first, entities for &lt; and &amp;</li></ul>`,
    box('Practice (20 min)', 'Type a profile page from memory: skeleton, heading, link, list, a literal <code class="i">&lt;strong&gt;</code>.<br><br><b>Done when</b>: the W3C validator shows no errors and <code class="i">document.compatMode</code> prints <code class="i">CSS1Compat</code>.', 'ok')) },
]);
