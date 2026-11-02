/** Web Foundations · deck bài 2.3 — HTML ngữ nghĩa. Ảnh + output thật: _demo/2-3 (Chromium), _t2/out (ariaSnapshot, phím Tab thật). */
import { deckWf, html, con, term, anh, box, two, tbl, vsd, cap, steps } from './_wf-bai.mjs';

export const deck = { key: 'wf-2-3', code: 'WF 2.3', title: 'Semantic HTML', sub: 'Web Foundations · Chapter 2' };

export const slides = deckWf({ chuong: 'Chapter 2 — HTML', bai: '2.3' }, [
  { cover: true, t: 'Semantic HTML', sub: 'Two identical-looking pages, and the measurable difference between them' },

  { t: 'After this lesson you can…', to: true, giua: true, body: `<ul>
    <li>Choose the tag that says what content <b>is</b></li>
    <li>Build a page from <b>landmarks</b>: header, nav, main, aside, footer</li>
    <li>Decide between <b>article, section, div</b></li>
    <li>Use <b>a</b> or <b>button</b>, never a clickable div</li>
    <li>Check your work with the <b>keyboard</b> and the <b>accessibility tree</b></li></ul>
    ${box('Why', 'Screen readers, search engines and tests read your tags. None of them read your CSS.', 'info')}` },

  { t: 'Same look, two pages', giua: true, body: two(`<div>${anh('2-3/div-soup.png', { w: 520 })}${cap('<b>div soup</b> — only div and span')}</div>`, `<div>${anh('2-3/semantic.png', { w: 520 })}${cap('<b>semantic</b> — header, nav, main, article, button')}</div>`) },

  { t: 'The accessibility tree', giua: true, body: `${term('_t2/out/aria-div-soup', null, { title: 'div soup — all of it' })}
    ${term('_t2/out/aria-semantic', null, { title: 'semantic — Chromium accessibility tree' })}
    ${box('', 'This is what a screen reader navigates: roles and names, built from your tags.', 'info')}` },

  { t: 'Try the keyboard', to: true, giua: true, body: `${two(term('_t2/out/tab-div-soup', null, { title: 'div soup: real Tab and Enter' }), term('_t2/out/tab-semantic', null, { title: 'semantic: real Tab and Enter' }))}
    ${box('Zero extra code', '<code class="i">a</code> and <code class="i">button</code> get focus and keyboard activation for free. A <code class="i">div</code> gets neither.', 'ok')}` },

  { t: 'Page landmarks', to: true, giua: true, body: tbl(['Tag', 'Means', 'Role in the tree'], [
      ['header', 'top of the page', 'banner'],
      ['nav', 'main navigation', 'navigation'],
      ['main', 'the unique content — exactly one', 'main'],
      ['aside', 'related, not essential', 'complementary'],
      ['footer', 'copyright, contact', 'contentinfo'],
    ]) + box('Careful', '<code class="i">header</code> and <code class="i">footer</code> are landmarks only at page level, not inside an <code class="i">article</code>.', 'info') },

  { t: 'article, section or div?', to: true, giua: true, body: `${steps([
      '<b>Stands alone?</b> A post, a comment, a product card ⇒ <code class="i">article</code>',
      '<b>A themed part with a heading?</b> “Pricing”, “Reviews” ⇒ <code class="i">section</code>',
      '<b>Only a box for layout?</b> ⇒ <code class="i">div</code> — that is its job',
    ])}${box('Trap', 'A <code class="i">section</code> with no heading is a nameless region. No heading in mind? Use <code class="i">div</code>.', 'bad')}` },

  { t: 'Meaning inside a sentence', giua: true, body: `${html('2-3/van-ban-ngu-nghia.html', null, { chi: [5, 8] })}
    ${two(anh('2-3/van-ban-ngu-nghia.png', { w: 440 }), `${con('2-3/van-ban-ngu-nghia')}
    ${box('Rule', 'Want it to <i>look</i> bold? CSS. It <i>is</i> important? <code class="i">strong</code>.', 'ok')}`)}` },

  { t: 'Native elements do the work', giua: true, body: two(`${html('2-3/mo-rong.html', null, { chi: [13, 16] })}${con('2-3/mo-rong')}`, vsd('<ul><li><code class="i">div onclick</code></li><li><code class="i">role="button"</code> on a div: announces, still ignores Tab</li></ul>', '<ul><li><code class="i">button type="button"</code></li><li>First rule of ARIA: use the native element</li></ul>', '✗ Trap', '✓ Instead'), 'r64') },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li>Tags build the accessibility tree</li>
    <li>Landmarks, one <code class="i">main</code></li>
    <li>article · section · div</li>
    <li>Goes somewhere = a; does something = button</li>
    <li>Test with Tab and Enter</li></ul>`,
    box('Practice (25 min)', 'Rewrite the div page with semantic tags, same look.<br><br><b>Done when</b>: Tab reaches both links and the button, Enter fires it, there is one <code class="i">main</code> and one <code class="i">h1</code>, and the Accessibility pane shows the roles.', 'ok')) },
]);
