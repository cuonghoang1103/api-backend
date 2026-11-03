/** Web Foundations · deck bài 12.1 — position & stacking context. */
import { deckWf, html, css, con, anh, box, two, steps, tbl, vsd } from './_wf-bai.mjs';

export const deck = { key: 'wf-12-1', code: 'WF 12.1', title: 'Position & stacking', sub: 'Web Foundations · Chapter 12' };

export const slides = deckWf({ chuong: 'Chapter 12 — Advanced CSS', bai: '12.1' }, [
  { cover: true, t: 'Position & stacking', sub: 'Put an element exactly where you want it — and understand why z-index: 9999 sometimes still loses' },

  { t: 'After this lesson you can…', to: true, body: `<ul>
    <li>Choose between <b>static, relative, absolute, fixed, sticky</b></li>
    <li>Pin a badge to a card corner (and know why it flew away)</li>
    <li>Make a <b>sticky</b> header that really sticks</li>
    <li>Explain a <b>stacking context</b> — and fix a modal hidden under the header</li>
    <li>Debug layering with DevTools instead of raising z-index</li></ul>
    ${box('Why', 'Dropdowns, modals, tooltips, sticky headers, badges — every real UI has them, and the bugs are always about position and stacking.', 'info')}` },

  { t: 'The five position values', body: two(anh('12-1/position-five.png', { w: 560 }), `${con('12-1/position-five')}
    ${tbl(['value', 'measured from', 'keeps space?'], [['static', '— (normal flow)', 'yes'], ['relative', 'its own normal spot', 'yes'], ['absolute', 'nearest positioned ancestor', 'no'], ['fixed', 'the viewport', 'no'], ['sticky', 'flow, then sticks', 'yes']])}`, 'r46') },

  { t: 'absolute needs a positioned parent', body: `${anh('12-1/absolute-parent.png', { w: 700 })}
    ${two(con('12-1/absolute-parent'), box('Rule', '<code class="i">absolute</code> measures from the nearest ancestor that is <b>positioned</b> (not static). None ⇒ the page. Fix: <code class="i">.card { position: relative }</code>.', 'ok'))}` },

  { t: 'sticky and the overflow trap', body: `${anh('12-1/sticky.png', { w: 700 })}
    ${two(con('12-1/sticky'), box('Why it broke', 'Sticky sticks inside its <b>nearest scrolling ancestor</b>. An <code class="i">overflow: hidden</code> wrapper in between becomes that ancestor — and it never scrolls.', 'bad'))}` },

  { t: 'z-index: 9999 still loses', body: two(anh('12-1/z-index-trap.png', { w: 540 }), `${con('12-1/z-index-trap')}
    ${box('Stacking context', '<code class="i">main</code> has <code class="i">z-index: 1</code> ⇒ everything inside it is ranked <b>as one layer at level 1</b>. 9999 only competes with its siblings inside main.', 'bad')}`, 'r46') },

  { t: 'Picture the layers', to: true, giua: true, body: `${steps([
      'The page is a stack of <b>stacking contexts</b>, like folders.',
      '<code class="i">header</code> is folder 10, <code class="i">main</code> is folder 1.',
      'The modal is a sheet INSIDE folder 1 — its 9999 is only a number inside that folder.',
      'Folder 10 is above folder 1, so every sheet in folder 1 is below the header.',
    ])}
    ${box('Consequence', 'You cannot escape a stacking context by raising z-index. You must change the context: remove what creates it, or move the element out.', 'info')}` },

  { t: 'What creates a stacking context (measured)', giua: true, body: `${con('12-1/stacking-creators')}
    ${box('The list to remember', '<code class="i">position</code> + <code class="i">z-index</code> · <code class="i">opacity &lt; 1</code> · <code class="i">transform</code> · <code class="i">filter</code> · <code class="i">isolation: isolate</code> · <code class="i">will-change</code> · also flex/grid children with z-index.', 'info')}` },

  { t: 'The fix: move the modal out', body: two(anh('12-1/z-index-fixed.png', { w: 540 }), `${con('12-1/z-index-fixed')}
    ${box('Portals', 'React’s <code class="i">createPortal</code> renders a modal as a child of <code class="i">&lt;body&gt;</code> for exactly this reason. Dialogs: <code class="i">&lt;dialog&gt;.showModal()</code> uses the browser’s top layer.', 'ok')}`, 'r46') },

  { t: 'A z-index scale instead of a war', giua: true, body: `${css(null, `:root {
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
}
.site-header { position: sticky; top: 0; z-index: var(--z-sticky); }
.modal       { position: fixed; inset: 0; z-index: var(--z-modal); }`)}
    ${two(box('Rule', 'A handful of named levels, documented once. Nobody types 9999 again.', 'ok'), box('Still not a cure', 'A scale orders elements that share a context. It cannot rescue an element trapped inside a lower context.', 'bad'))}` },

  { t: 'Debugging layering in DevTools', to: true, giua: true, body: `${steps([
      'Right-click the hidden element ⇒ <b>Inspect</b>.',
      'Computed tab: check <code class="i">position</code> and <code class="i">z-index</code> — "auto" means it is not competing.',
      'Walk UP the tree: find the first ancestor with transform / opacity / z-index.',
      'Chrome: More tools ⇒ <b>Layers</b> panel shows the real layers.',
    ])}
    ${box('Smell', 'If you are about to type a bigger z-index, stop and look for the stacking context instead.', 'bad')}` },

  { t: 'Summary & practice', to: true, giua: true, body: two(`<ul>
    <li><code class="i">absolute</code> ⇒ parent <code class="i">relative</code></li>
    <li><code class="i">sticky</code> ⇒ no overflow wrapper</li>
    <li>z-index competes only inside its stacking context</li>
    <li>Modals live at <code class="i">&lt;body&gt;</code> level</li>
    <li>Use a named z-index scale</li></ul>`,
    box('Practice (20 min)', 'Build a page with a sticky header, a card with a corner badge, and a "Delete" button that opens a modal covering everything — while <code class="i">main</code> has <code class="i">transform: translateZ(0)</code>.<br><br><b>Done when</b>: the badge stays in the card corner at any width, the header sticks, and <code class="i">document.elementFromPoint</code> at the header returns the modal.', 'ok')) },
]);
