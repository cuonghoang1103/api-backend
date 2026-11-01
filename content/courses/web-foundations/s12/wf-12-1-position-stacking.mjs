/**
 * Bài 12.1 — Position & stacking context (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật, có ảnh chụp trong deck).
 * Deck: scripts/slides-src/wf-12-1.mjs (12 slide, WF/v1/wf-12-1).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-12-1', 'Position & stacking', 'Position & ngữ cảnh xếp chồng', [
  [1, 'Position & stacking',
    '<p>Normal flow puts elements one after another. <code>position</code> lets you take an element out of that flow and place it precisely — and the moment elements overlap, a second question appears: which one is on top?</p>',
    '<p>Luồng bình thường xếp phần tử nối tiếp nhau. <code>position</code> cho phép kéo một phần tử ra khỏi luồng và đặt nó chính xác — và ngay khi các phần tử chồng lên nhau, câu hỏi thứ hai xuất hiện: cái nào nằm trên?</p>'],
  [2, 'After this lesson you can…',
    '<p>Badges, dropdowns, sticky headers and modals are in every real interface, and their bugs are almost always about positioning or stacking. The most valuable skill here is the last one: debugging a hidden element by finding its stacking context instead of typing a bigger z-index.</p>',
    '<p>Huy hiệu, menu thả xuống, header dính và modal có trong mọi giao diện thật, và bug của chúng gần như luôn là chuyện định vị hoặc xếp chồng. Kỹ năng đáng giá nhất ở đây là cái cuối: gỡ lỗi phần tử bị che bằng cách tìm ngữ cảnh xếp chồng của nó, thay vì gõ một z-index to hơn.</p>'],
  [3, 'The five values',
    '<p>A real page in Chromium with one box per value. Relative moved 40 pixels right and 10 down but kept its original space — that is why it now overlaps the sticky box. Absolute went to the top-right corner of the dashed stage. Fixed sits at the bottom-right of the window, outside the stage.</p>',
    '<p>Một trang thật trong Chromium, mỗi giá trị một hộp. Relative dịch phải 40 và xuống 10 điểm ảnh nhưng vẫn giữ chỗ cũ — vì vậy nó đè lên hộp sticky. Absolute tới góc trên phải của khung nét đứt. Fixed nằm góc dưới phải cửa sổ, ra ngoài cả khung.</p>'],
  [4, 'absolute needs a positioned parent',
    '<p>Both cards have the same badge with <code>top: 8px; right: 8px</code>. In card A the badge flew to the corner of the page, because absolute measures from the nearest positioned ancestor and there was none. Card B has <code>position: relative</code>, so the badge stays in its corner.</p>',
    '<p>Hai thẻ có cùng huy hiệu <code>top: 8px; right: 8px</code>. Ở thẻ A huy hiệu bay lên góc trang, vì absolute đo từ tổ tiên gần nhất có định vị mà không có ai. Thẻ B có <code>position: relative</code>, nên huy hiệu ở yên trong góc thẻ.</p>'],
  [5, 'sticky and the overflow trap',
    '<p>Both boxes scrolled 200 pixels. On the left the header stayed at the top. On the right it moved up with the content, because an <code>overflow: hidden</code> wrapper sits between the header and the scrolling box, and sticky only sticks inside its nearest scrolling ancestor.</p>',
    '<p>Cả hai hộp đều cuộn 200 điểm ảnh. Bên trái header ở yên trên đỉnh. Bên phải nó trôi lên cùng nội dung, vì một lớp bọc <code>overflow: hidden</code> chen giữa header và hộp cuộn, mà sticky chỉ dính trong tổ tiên cuộn gần nhất.</p>'],
  [6, 'z-index: 9999 still loses',
    '<p>The modal has z-index 9999 and the header only 10, yet the header covers it — the element found at the overlap point is the header. The reason is the parent: <code>main</code> has its own z-index, so it forms a stacking context and its whole content is ranked as level 1.</p>',
    '<p>Modal có z-index 9999 còn header chỉ 10, vậy mà header vẫn che nó — phần tử tìm thấy ở điểm chồng là header. Lý do nằm ở cha: <code>main</code> có z-index riêng, nên nó tạo một ngữ cảnh xếp chồng và toàn bộ nội dung bên trong được xếp hạng như tầng 1.</p>'],
  [7, 'Picture the layers',
    '<p>Think of folders. Each stacking context is a folder; z-index ranks folders against folders, and sheets inside one folder against each other. A sheet numbered 9999 inside folder 1 can never rise above folder 10. Raising the number is pointless — change the folder.</p>',
    '<p>Hãy nghĩ tới các tập hồ sơ. Mỗi ngữ cảnh xếp chồng là một tập; z-index xếp hạng tập với tập, và tờ giấy với tờ giấy bên trong một tập. Tờ số 9999 trong tập 1 không bao giờ vượt được tập 10. Tăng con số là vô ích — phải đổi tập.</p>'],
  [8, 'What creates a stacking context',
    '<p>Measured, not memorised: a child with z-index 999 tries to rise above a cover with z-index 5. It only succeeds when its parent has nothing special. Opacity below one, any transform, filter, a z-index, isolation and will-change all trap the child.</p>',
    '<p>Đo chứ không học thuộc: một con có z-index 999 cố vượt lên một tấm phủ z-index 5. Nó chỉ thành công khi cha không có gì đặc biệt. Opacity dưới 1, mọi transform, filter, một z-index, isolation và will-change đều nhốt đứa con lại.</p>'],
  [9, 'The fix: move the modal out',
    '<p>Make the modal a direct child of <code>body</code>, and it competes with the header directly — now it is on top with a modest z-index of 100. This is exactly why React has portals, and why the native <code>dialog</code> element uses the browser’s top layer.</p>',
    '<p>Cho modal làm con trực tiếp của <code>body</code>, nó cạnh tranh trực tiếp với header — giờ nó nằm trên chỉ với z-index 100. Đây chính là lý do React có portal, và vì sao phần tử <code>dialog</code> gốc dùng tầng trên cùng của trình duyệt.</p>'],
  [10, 'A z-index scale',
    '<p>Instead of random numbers, define a few named levels once — dropdown, sticky, overlay, modal, toast — and use them everywhere. A scale orders elements that share a context; it still cannot rescue an element trapped in a lower one.</p>',
    '<p>Thay vì số ngẫu nhiên, định nghĩa vài tầng có tên một lần — dropdown, sticky, overlay, modal, toast — rồi dùng ở mọi nơi. Một thang tầng sắp xếp các phần tử cùng ngữ cảnh; nó vẫn không cứu được phần tử bị nhốt trong ngữ cảnh thấp hơn.</p>'],
  [11, 'Debugging in DevTools',
    '<p>The recipe: inspect the hidden element, read its computed position and z-index, then walk up the tree until you find the first ancestor that creates a stacking context. Chrome’s Layers panel shows the real layers when you are unsure.</p>',
    '<p>Công thức: inspect phần tử bị che, đọc position và z-index đã tính, rồi đi ngược lên cây tới khi gặp tổ tiên đầu tiên tạo ngữ cảnh xếp chồng. Bảng Layers của Chrome cho thấy các lớp thật khi bạn còn phân vân.</p>'],
  [12, 'Summary & practice',
    '<p>The practice combines all three traps on one page. The "Done when" uses <code>elementFromPoint</code>, the same tool the demos used, so you check the result with a measurement instead of by eye.</p>',
    '<p>Bài luyện gộp cả ba bẫy vào một trang. Phần "Xong khi" dùng <code>elementFromPoint</code>, đúng công cụ các ví dụ đã dùng, để bạn kiểm kết quả bằng phép đo chứ không bằng mắt.</p>'],
]);

export default {
  title: '12.1 — Position and the stacking context|||12.1 — Position và ngữ cảnh xếp chồng',
  slug: 'wf-12-1-position-stacking',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Năm giá trị position đo thật, absolute cần cha có định vị, sticky và bẫy overflow, vì sao z-index 9999 vẫn thua, những gì tạo ngữ cảnh xếp chồng (đo trong Chromium), đưa modal ra body, thang z-index, gỡ lỗi bằng DevTools.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Placing elements precisely — and deciding which one is on top</h2>
<p class="lead">After this lesson you can pin a badge to the corner of a card, make a header that sticks while the page scrolls, place a toast at the corner of the window, and — the skill that saves the most time — fix a dropdown or modal that hides behind something even though its <code>z-index</code> is huge. You need this because every real interface has overlapping pieces, and "it is under the header" is one of the most common front-end bug reports. The cure is never a bigger number; it is understanding the <strong>stacking context</strong>.</p>

<h3>Step 1 — the five values of <code>position</code></h3>
<p>By default every element is <code>position: static</code>: it sits in the <strong>normal flow</strong>, one block after another. The other four values change two things: what the element is measured from (its reference box) and whether it still occupies its space in the flow.</p>
${ma('html', CODE['12-1/position-five.html'], [8, 15])}
${ra(OUT['12-1/position-five'])}
<div class="kv-grid">
  <div class="kv"><span class="k">static</span><span class="v">Normal flow. <code>top</code>/<code>left</code>/<code>z-index</code> do nothing.</span></div>
  <div class="kv"><span class="k">relative</span><span class="v">Shifted from <em>its own</em> normal position (here +40, +10 — compare the static box at 14,14 with relative at 54,66). Its original space stays reserved, so it can overlap neighbours.</span></div>
  <div class="kv"><span class="k">absolute</span><span class="v">Removed from the flow; measured from the nearest <strong>positioned</strong> ancestor (any value except static). Here: the stage, top-right corner.</span></div>
  <div class="kv"><span class="k">fixed</span><span class="v">Removed from the flow; measured from the <strong>viewport</strong> (the window). It ignores the stage entirely and stays put when the page scrolls.</span></div>
  <div class="kv"><span class="k">sticky</span><span class="v">Behaves like relative until its scroll container scrolls it to the <code>top</code> threshold; then it sticks there.</span></div>
</div>
<p>The screenshot of this page is on slide 3. Notice that the relative box now overlaps the sticky one: shifting with <code>relative</code> moves the drawing, not the reserved space.</p>

<h3>Step 2 — <code>absolute</code> needs a positioned parent</h3>
${ma('html', CODE['12-1/absolute-parent.html'], [7, 18])}
${ra(OUT['12-1/absolute-parent'])}
<p>The badge in card A reported its <code>offsetParent</code> as <code>body</code>: no ancestor was positioned, so <code>top: 8px; right: 8px</code> was measured from the page and the badge flew to the top-right of the screen. Card B has <code>position: relative</code> (with no offsets — it does not move the card at all), which makes it the reference box. That one line is the standard pattern: <strong>parent <code>relative</code>, child <code>absolute</code></strong>.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Child is absolute</span><span class="lz-d">The browser looks for its containing block.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Walk up the ancestors</span><span class="lz-d">The first one whose <code>position</code> is not <code>static</code> wins (a <code>transform</code> also counts).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">None found?</span><span class="lz-d">The initial containing block — effectively the page. The badge "flies away".</span></div>
</div>

<h3>Step 3 — <code>sticky</code>, and the overflow trap</h3>
${ma('html', CODE['12-1/sticky.html'], [8, 13])}
${ra(OUT['12-1/sticky'])}
<p>Both boxes were scrolled by 200 pixels. In the first, the header stayed 2&nbsp;px from the top (the border). In the second it moved to −198&nbsp;px — gone. The only difference is a wrapper with <code>overflow: hidden</code> between the header and the scrolling box.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>sticky</code> "does nothing".</strong> A sticky element sticks inside its <em>nearest ancestor that has a scrolling mechanism</em> — any <code>overflow</code> other than <code>visible</code> creates one, even <code>hidden</code>. If that ancestor is not the thing that actually scrolls, sticky has nowhere to stick. The other two classic causes: forgetting the threshold (<code>top: 0</code>) and a parent that is only as tall as the sticky element itself (it has no room to travel). In DevTools, select the sticky element and check every ancestor's <code>overflow</code>.</p></div>

<h3>Step 4 — the stacking context: why <code>z-index: 9999</code> still loses</h3>
${ma('html', CODE['12-1/z-index-trap.html'], [7, 21])}
${ra(OUT['12-1/z-index-trap'])}
<p><code>document.elementFromPoint</code> asks the browser which element is really on top at a given pixel. The answer was the header, although the modal's z-index is 9999 and the header's is 10. The reason is <code>main</code>: it is positioned and has its own <code>z-index: 1</code>, so it creates a <strong>stacking context</strong>.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Root context (the page)</span><span class="lz-t">ranks its direct contexts</span><span class="lz-d">header (10) is above main (1).</span></div>
<div class="lz-layer"><span class="lz-k">header — z-index 10</span><span class="lz-t">one layer</span><span class="lz-d">Everything inside it is drawn together at level 10.</span></div>
<div class="lz-layer"><span class="lz-k">main — z-index 1</span><span class="lz-t">a separate folder</span><span class="lz-d">The modal's 9999 only ranks it against other things <em>inside main</em>. The whole folder still sits at level 1, under the header.</span></div>
</div>
<p>A stacking context is like a folder: z-index compares sheets inside the same folder, and folders against folders. No number written on a sheet can lift it out of its folder.</p>

<h3>What creates a stacking context? Measured in Chromium</h3>
${ma('html', CODE['12-1/stacking-creators.html'], [17, 34])}
${ra(OUT['12-1/stacking-creators'])}
<p>Each row puts a child with z-index 999 inside a parent, next to a cover with z-index 5. Only when the parent has nothing special does the child win. Every other property in the list turned the parent into a stacking context and trapped the child. The full list also includes <code>position: fixed</code>/<code>sticky</code>, flex or grid children with a z-index, <code>mix-blend-mode</code>, <code>contain</code> and a few more — but the six above cause almost every real bug, and <code>transform</code> (often added by an animation library) is the sneakiest.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — an animation library breaks your dropdown.</strong> You add a slide-in effect to a sidebar; the library sets <code>transform: translateX(0)</code> on it when the animation ends. Suddenly every dropdown inside the sidebar opens <em>under</em> the main content. Nothing in your dropdown changed — its ancestor became a stacking context. Search for transform/opacity/filter on the ancestors before touching z-index.</p></div>

<h3>The fix: move the element out of the trap</h3>
${ma('html', CODE['12-1/z-index-fixed.html'], [7, 20])}
${ra(OUT['12-1/z-index-fixed'])}
<p>Two real-world tools do this for you: React's <code>createPortal(children, document.body)</code> renders a component's modal as a direct child of <code>body</code> while keeping it in your component tree, and the native <code>&lt;dialog&gt;</code> element opened with <code>showModal()</code> is placed in the browser's <strong>top layer</strong>, above every stacking context on the page.</p>

<h3>A z-index scale instead of a war</h3>
<p>Inside one context, keep the numbers boring and named:</p>
<pre><code class="language-css">:root {
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
}
.site-header { position: sticky; top: 0; z-index: var(--z-sticky); }
.modal       { position: fixed; inset: 0; z-index: var(--z-modal); }</code></pre>
<p>Five levels, documented once (this is a design token — lesson 12.4). When someone wants something above the modal, the conversation is about which level it belongs to, not about typing 99999.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>position: fixed</code> inside a transformed parent.</strong> A transformed ancestor becomes the containing block for its fixed descendants, so a "fixed" toast inside an animated panel scrolls with the panel instead of staying on screen. Same cure as the z-index trap: render it outside, at <code>body</code> level.</p></div>

<h3>Debugging layering in DevTools</h3>
<ol>
<li>Right-click the element that is hidden or misplaced → <strong>Inspect</strong>.</li>
<li>In the <strong>Computed</strong> tab read <code>position</code> and <code>z-index</code>. A z-index of <code>auto</code> means the element is not competing at all.</li>
<li>Click upward through the ancestors in the Elements panel and look for <code>transform</code>, <code>opacity</code>, <code>filter</code>, <code>z-index</code>, <code>overflow</code>.</li>
<li>Still unsure? Chrome → More tools → <strong>Layers</strong> shows the actual compositing layers in 3D.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Build one HTML page with: (1) a header that sticks to the top while a long article scrolls; (2) a product card with a "SALE" badge in its top-right corner; (3) a "Delete" button that opens a confirmation modal covering the whole page. Then add <code>main { transform: translateZ(0); }</code> to simulate an animation library — and make the modal still cover the header.</p>
<p>Hint: the badge needs its card to be positioned; the modal should not live inside <code>main</code>.</p>
<p><strong>Done when:</strong> resizing the window keeps the badge in the card corner; after scrolling, the header is still at the top; and with the modal open, running <code>document.elementFromPoint(20, 20)</code> in the console returns the modal (or its backdrop), not the header. Code Lab module 12.1 grades a version of this page.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">normal flow</span><span class="v">luồng bình thường — phần tử xếp nối tiếp nhau.</span></div>
  <div class="kv"><span class="k">positioned element</span><span class="v">phần tử có định vị — position khác static.</span></div>
  <div class="kv"><span class="k">containing block</span><span class="v">khối chứa — hộp mà top/left được đo từ đó.</span></div>
  <div class="kv"><span class="k">offsetParent</span><span class="v">tổ tiên có định vị gần nhất (thuộc tính DOM).</span></div>
  <div class="kv"><span class="k">viewport</span><span class="v">khung nhìn — vùng cửa sổ trình duyệt đang thấy.</span></div>
  <div class="kv"><span class="k">scroll container</span><span class="v">vùng cuộn — tổ tiên có overflow khác visible.</span></div>
  <div class="kv"><span class="k">stacking context</span><span class="v">ngữ cảnh xếp chồng — "tập hồ sơ" mà z-index chỉ so bên trong.</span></div>
  <div class="kv"><span class="k">top layer</span><span class="v">tầng trên cùng — nơi trình duyệt đặt dialog modal, trên mọi ngữ cảnh.</span></div>
  <div class="kv"><span class="k">portal</span><span class="v">cổng — render component ra chỗ khác trong DOM (thường là body).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>relative</code> shifts but keeps its space; <code>absolute</code> and <code>fixed</code> leave the flow; <code>sticky</code> sticks inside its scroll container.</li>
  <li><code>absolute</code> is measured from the nearest positioned ancestor — give the parent <code>position: relative</code>.</li>
  <li>Sticky fails when an <code>overflow</code> ancestor sits between it and the real scroller, or without a <code>top</code>.</li>
  <li>z-index only competes inside its <strong>stacking context</strong>; position+z-index, opacity, transform, filter, isolation, will-change create one.</li>
  <li>Fix layering by changing the context (move the element to <code>body</code>, portals, <code>&lt;dialog&gt;</code>), not by bigger numbers.</li>
  <li>Keep a small, named z-index scale.</li>
</ul>
${nguon('📗', 'MDN — Stacking context', 'The full list of properties that create one, with interactive examples', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context')}
${nguon('📘', 'web.dev — Learn CSS: Z-index and stacking contexts', 'A short, illustrated chapter of Google’s free CSS course', 'https://web.dev/learn/css/z-index')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-4-theme-css-variables', title: 'Next.js 13.4 — theming with CSS variables', sub: 'Where a named z-index scale lives in a real Next.js codebase', cta: 'Open lesson' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-7-2-render-props', title: 'FER202 (Academy) — reusable components', sub: 'Modals and dropdowns as reusable components — the place portals come in', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Đặt phần tử chính xác — và quyết định cái nào nằm trên</h2>
<p class="lead">Học xong bài này bạn ghim được huy hiệu vào góc một thẻ, làm header dính trên đầu khi trang cuộn, đặt thông báo ở góc cửa sổ, và — kỹ năng tiết kiệm nhiều thời gian nhất — sửa được menu thả xuống hay modal bị che dù <code>z-index</code> của nó rất lớn. Bạn cần điều này vì giao diện thật nào cũng có những mảnh chồng lên nhau, và "nó bị header che" là một trong những báo lỗi front-end phổ biến nhất. Cách chữa không bao giờ là một con số to hơn; mà là hiểu <strong>ngữ cảnh xếp chồng (stacking context)</strong>.</p>

<h3>Bước 1 — năm giá trị của <code>position</code></h3>
<p>Mặc định mọi phần tử là <code>position: static</code>: nằm trong <strong>luồng bình thường</strong>, khối này nối khối kia. Bốn giá trị còn lại đổi hai thứ: phần tử được đo từ đâu (hộp tham chiếu) và nó còn giữ chỗ trong luồng hay không.</p>
${ma('html', CODE['12-1/position-five.html'], [8, 15])}
${ra(OUT['12-1/position-five'])}
<div class="kv-grid">
  <div class="kv"><span class="k">static</span><span class="v">Luồng bình thường. <code>top</code>/<code>left</code>/<code>z-index</code> không có tác dụng.</span></div>
  <div class="kv"><span class="k">relative</span><span class="v">Dịch khỏi vị trí bình thường <em>của chính nó</em> (ở đây +40, +10 — so hộp static ở 14,14 với relative ở 54,66). Chỗ cũ vẫn được giữ, nên nó có thể đè lên hàng xóm.</span></div>
  <div class="kv"><span class="k">absolute</span><span class="v">Ra khỏi luồng; đo từ tổ tiên <strong>có định vị</strong> gần nhất (mọi giá trị trừ static). Ở đây: khung stage, góc trên phải.</span></div>
  <div class="kv"><span class="k">fixed</span><span class="v">Ra khỏi luồng; đo từ <strong>khung nhìn</strong> (cửa sổ). Nó bỏ qua khung stage và đứng yên khi trang cuộn.</span></div>
  <div class="kv"><span class="k">sticky</span><span class="v">Cư xử như relative cho tới khi vùng cuộn đẩy nó tới ngưỡng <code>top</code>; rồi dính lại ở đó.</span></div>
</div>
<p>Ảnh chụp trang này ở slide 3. Để ý hộp relative giờ đè lên hộp sticky: dịch bằng <code>relative</code> là dịch hình vẽ, không dịch chỗ đã giữ.</p>

<h3>Bước 2 — <code>absolute</code> cần cha có định vị</h3>
${ma('html', CODE['12-1/absolute-parent.html'], [7, 18])}
${ra(OUT['12-1/absolute-parent'])}
<p>Huy hiệu ở thẻ A báo <code>offsetParent</code> là <code>body</code>: không tổ tiên nào có định vị, nên <code>top: 8px; right: 8px</code> được đo từ trang và huy hiệu bay lên góc trên phải màn hình. Thẻ B có <code>position: relative</code> (không kèm độ dịch — nó không làm thẻ xê dịch chút nào), nên thẻ thành hộp tham chiếu. Một dòng đó là mẫu chuẩn: <strong>cha <code>relative</code>, con <code>absolute</code></strong>.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Con là absolute</span><span class="lz-d">Trình duyệt đi tìm khối chứa của nó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đi ngược lên tổ tiên</span><span class="lz-d">Tổ tiên đầu tiên có <code>position</code> khác <code>static</code> thắng (<code>transform</code> cũng tính).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Không thấy ai?</span><span class="lz-d">Khối chứa ban đầu — coi như cả trang. Huy hiệu "bay mất".</span></div>
</div>

<h3>Bước 3 — <code>sticky</code>, và bẫy overflow</h3>
${ma('html', CODE['12-1/sticky.html'], [8, 13])}
${ra(OUT['12-1/sticky'])}
<p>Cả hai hộp đều cuộn 200 điểm ảnh. Ở hộp đầu, header ở yên cách đỉnh 2&nbsp;px (đường viền). Ở hộp thứ hai nó lên tới −198&nbsp;px — biến mất. Khác biệt duy nhất là một lớp bọc có <code>overflow: hidden</code> chen giữa header và hộp cuộn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>sticky</code> "không làm gì cả".</strong> Phần tử sticky dính bên trong <em>tổ tiên gần nhất có cơ chế cuộn</em> — mọi <code>overflow</code> khác <code>visible</code> đều tạo ra cơ chế đó, kể cả <code>hidden</code>. Nếu tổ tiên đó không phải thứ thật sự cuộn, sticky chẳng có chỗ nào để dính. Hai nguyên nhân kinh điển khác: quên ngưỡng (<code>top: 0</code>) và cha chỉ cao bằng chính phần tử sticky (không còn chỗ để trượt). Trong DevTools, chọn phần tử sticky rồi kiểm <code>overflow</code> của từng tổ tiên.</p></div>

<h3>Bước 4 — ngữ cảnh xếp chồng: vì sao <code>z-index: 9999</code> vẫn thua</h3>
${ma('html', CODE['12-1/z-index-trap.html'], [7, 21])}
${ra(OUT['12-1/z-index-trap'])}
<p><code>document.elementFromPoint</code> hỏi trình duyệt phần tử nào thật sự nằm trên cùng tại một điểm ảnh. Đáp án là header, dù z-index của modal là 9999 còn của header là 10. Lý do là <code>main</code>: nó có định vị và có <code>z-index: 1</code> riêng, nên nó tạo một <strong>ngữ cảnh xếp chồng</strong>.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Ngữ cảnh gốc (trang)</span><span class="lz-t">xếp hạng các ngữ cảnh con trực tiếp</span><span class="lz-d">header (10) nằm trên main (1).</span></div>
<div class="lz-layer"><span class="lz-k">header — z-index 10</span><span class="lz-t">một lớp</span><span class="lz-d">Mọi thứ bên trong được vẽ cùng nhau ở tầng 10.</span></div>
<div class="lz-layer"><span class="lz-k">main — z-index 1</span><span class="lz-t">một tập hồ sơ riêng</span><span class="lz-d">Số 9999 của modal chỉ xếp hạng nó với những thứ khác <em>bên trong main</em>. Cả tập vẫn nằm ở tầng 1, dưới header.</span></div>
</div>
<p>Ngữ cảnh xếp chồng giống một tập hồ sơ: z-index so các tờ giấy trong cùng một tập, và so tập với tập. Không con số nào viết trên tờ giấy kéo được nó ra khỏi tập của mình.</p>

<h3>Thứ gì tạo ngữ cảnh xếp chồng? Đo trong Chromium</h3>
${ma('html', CODE['12-1/stacking-creators.html'], [17, 34])}
${ra(OUT['12-1/stacking-creators'])}
<p>Mỗi hàng đặt một con có z-index 999 trong một cha, cạnh một tấm phủ z-index 5. Chỉ khi cha không có gì đặc biệt thì con mới thắng. Mọi thuộc tính khác trong danh sách đều biến cha thành ngữ cảnh xếp chồng và nhốt đứa con lại. Danh sách đầy đủ còn có <code>position: fixed</code>/<code>sticky</code>, con của flex/grid có z-index, <code>mix-blend-mode</code>, <code>contain</code> và vài thứ nữa — nhưng sáu thứ trên gây ra gần như mọi bug thật, và <code>transform</code> (thường do thư viện animation thêm vào) là thủ phạm khó thấy nhất.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thư viện animation làm hỏng menu thả xuống.</strong> Bạn thêm hiệu ứng trượt vào cho sidebar; thư viện đặt <code>transform: translateX(0)</code> lên nó khi hiệu ứng kết thúc. Bỗng mọi menu thả xuống trong sidebar mở ra <em>bên dưới</em> nội dung chính. Menu của bạn không đổi gì — tổ tiên của nó đã thành ngữ cảnh xếp chồng. Hãy tìm transform/opacity/filter trên tổ tiên trước khi đụng vào z-index.</p></div>

<h3>Cách sửa: đưa phần tử ra khỏi bẫy</h3>
${ma('html', CODE['12-1/z-index-fixed.html'], [7, 20])}
${ra(OUT['12-1/z-index-fixed'])}
<p>Hai công cụ thật làm việc này giúp bạn: <code>createPortal(children, document.body)</code> của React render modal của một component thành con trực tiếp của <code>body</code> mà vẫn giữ nó trong cây component, và phần tử <code>&lt;dialog&gt;</code> gốc mở bằng <code>showModal()</code> được đặt vào <strong>tầng trên cùng (top layer)</strong> của trình duyệt, trên mọi ngữ cảnh xếp chồng trong trang.</p>

<h3>Một thang z-index thay cho cuộc chiến</h3>
<p>Bên trong một ngữ cảnh, giữ các con số nhàm chán và có tên:</p>
<pre><code class="language-css">:root {
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
}
.site-header { position: sticky; top: 0; z-index: var(--z-sticky); }
.modal       { position: fixed; inset: 0; z-index: var(--z-modal); }</code></pre>
<p>Năm tầng, ghi lại một lần (đây là một design token — bài 12.4). Khi ai đó muốn thứ gì nằm trên modal, cuộc thảo luận là nó thuộc tầng nào, không phải gõ 99999.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>position: fixed</code> bên trong cha có transform.</strong> Tổ tiên có transform trở thành khối chứa của con cháu fixed, nên một thông báo "fixed" trong một panel đang chuyển động lại cuộn theo panel thay vì đứng yên trên màn hình. Cách chữa giống bẫy z-index: render nó ra ngoài, ở cấp <code>body</code>.</p></div>

<h3>Gỡ lỗi xếp lớp bằng DevTools</h3>
<ol>
<li>Chuột phải vào phần tử bị che hay sai chỗ → <strong>Inspect</strong>.</li>
<li>Ở tab <strong>Computed</strong> đọc <code>position</code> và <code>z-index</code>. z-index là <code>auto</code> nghĩa là phần tử không tham gia cạnh tranh.</li>
<li>Bấm ngược lên các tổ tiên trong bảng Elements và tìm <code>transform</code>, <code>opacity</code>, <code>filter</code>, <code>z-index</code>, <code>overflow</code>.</li>
<li>Vẫn phân vân? Chrome → More tools → <strong>Layers</strong> cho thấy các lớp compositing thật dưới dạng 3D.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Dựng một trang HTML có: (1) header dính trên đỉnh trong khi một bài viết dài cuộn; (2) một thẻ sản phẩm có huy hiệu "SALE" ở góc trên phải; (3) nút "Xoá" mở modal xác nhận phủ cả trang. Rồi thêm <code>main { transform: translateZ(0); }</code> để giả lập thư viện animation — và làm cho modal vẫn phủ lên header.</p>
<p>Gợi ý: huy hiệu cần thẻ của nó có định vị; modal không nên nằm trong <code>main</code>.</p>
<p><strong>Xong khi:</strong> thu phóng cửa sổ thì huy hiệu vẫn ở góc thẻ; sau khi cuộn, header vẫn ở trên đỉnh; và khi modal mở, chạy <code>document.elementFromPoint(20, 20)</code> trong Console trả về modal (hoặc lớp nền của nó), không phải header. Code Lab module 12.1 chấm một phiên bản của trang này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">normal flow</span><span class="v">luồng bình thường — phần tử xếp nối tiếp nhau.</span></div>
  <div class="kv"><span class="k">positioned element</span><span class="v">phần tử có định vị — position khác static.</span></div>
  <div class="kv"><span class="k">containing block</span><span class="v">khối chứa — hộp mà top/left được đo từ đó.</span></div>
  <div class="kv"><span class="k">offsetParent</span><span class="v">tổ tiên có định vị gần nhất (thuộc tính DOM).</span></div>
  <div class="kv"><span class="k">viewport</span><span class="v">khung nhìn — vùng cửa sổ trình duyệt đang thấy.</span></div>
  <div class="kv"><span class="k">scroll container</span><span class="v">vùng cuộn — tổ tiên có overflow khác visible.</span></div>
  <div class="kv"><span class="k">stacking context</span><span class="v">ngữ cảnh xếp chồng — "tập hồ sơ" mà z-index chỉ so bên trong.</span></div>
  <div class="kv"><span class="k">top layer</span><span class="v">tầng trên cùng — nơi trình duyệt đặt dialog modal, trên mọi ngữ cảnh.</span></div>
  <div class="kv"><span class="k">portal</span><span class="v">cổng — render component ra chỗ khác trong DOM (thường là body).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>relative</code> dịch nhưng giữ chỗ; <code>absolute</code> và <code>fixed</code> rời luồng; <code>sticky</code> dính bên trong vùng cuộn của nó.</li>
  <li><code>absolute</code> đo từ tổ tiên có định vị gần nhất — cho cha <code>position: relative</code>.</li>
  <li>Sticky hỏng khi một tổ tiên có <code>overflow</code> chen giữa nó và vùng cuộn thật, hoặc khi thiếu <code>top</code>.</li>
  <li>z-index chỉ cạnh tranh bên trong <strong>ngữ cảnh xếp chồng</strong> của nó; position+z-index, opacity, transform, filter, isolation, will-change tạo ra ngữ cảnh.</li>
  <li>Sửa xếp lớp bằng cách đổi ngữ cảnh (đưa phần tử ra <code>body</code>, portal, <code>&lt;dialog&gt;</code>), không bằng số to hơn.</li>
  <li>Giữ một thang z-index nhỏ, có tên.</li>
</ul>
${nguon('📗', 'MDN — Stacking context', 'Danh sách đầy đủ thuộc tính tạo ngữ cảnh, có ví dụ tương tác', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context')}
${nguon('📘', 'web.dev — Learn CSS: Z-index and stacking contexts', 'Một chương ngắn có hình minh hoạ trong khoá CSS miễn phí của Google', 'https://web.dev/learn/css/z-index')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-4-theme-css-variables', title: 'Next.js 13.4 — theme bằng CSS variables', sub: 'Thang z-index có tên nằm ở đâu trong một codebase Next.js thật', cta: 'Mở bài' })}
${lienKet({ khoa: 'front-end-web-development-with-react', bai: 'fer202-7-2-render-props', title: 'FER202 (Academy) — component dùng lại được', sub: 'Modal và menu thả xuống như component dùng lại — chỗ portal xuất hiện', cta: 'Mở bài' })}
</div>
`,
};
