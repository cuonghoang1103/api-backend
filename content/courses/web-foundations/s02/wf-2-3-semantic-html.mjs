/**
 * Bài 2.3 — HTML ngữ nghĩa (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/2-3; _demo/_t2/chay.mjs lấy cây
 * trợ năng bằng Playwright ariaSnapshot và đi bằng phím Tab thật). Deck: scripts/slides-src/wf-2-3.mjs (10 slide, WF/v1/wf-2-3).
 * Code Lab: module 2.3 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-2-3', 'Semantic HTML', 'HTML ngữ nghĩa', [
  [1, 'Semantic HTML',
    '<p>Two pages can look identical and be completely different underneath. Semantic HTML means choosing the tag that says what a piece of content is, not just what it should look like. Today we measure the difference instead of taking it on faith.</p>',
    '<p>Hai trang có thể trông y hệt nhau mà bên dưới khác hoàn toàn. HTML ngữ nghĩa nghĩa là chọn thẻ nói được mẩu nội dung đó là gì, chứ không chỉ nên trông thế nào. Hôm nay ta đo sự khác biệt thay vì chỉ tin theo lời.</p>'],
  [2, 'After this lesson you can…',
    '<p>The skills here cost nothing to apply. Writing <code>button</code> instead of a clickable <code>div</code> takes the same time, and it gives you keyboard support, screen-reader support and focus handling for free. Most of accessibility is simply choosing the right element.</p>',
    '<p>Các kỹ năng ở đây không tốn gì để áp dụng. Viết <code>button</code> thay vì một <code>div</code> bấm được tốn đúng ngần ấy thời gian, mà bạn được hỗ trợ bàn phím, trình đọc màn hình và quản lý tiêu điểm miễn phí. Phần lớn khả năng tiếp cận đơn giản là chọn đúng phần tử.</p>'],
  [3, 'Same look, two pages',
    '<p>Two real screenshots from Chromium. On the left, a page made entirely of <code>div</code> and <code>span</code>; on the right, the same page with semantic tags. CSS makes them look the same, so a sighted person using a mouse would never know. Now look at what everyone else receives.</p>',
    '<p>Hai ảnh chụp thật từ Chromium. Bên trái là trang toàn <code>div</code> và <code>span</code>; bên phải là cùng trang đó với thẻ ngữ nghĩa. CSS làm chúng trông giống nhau, nên người nhìn được và dùng chuột sẽ không bao giờ biết. Giờ hãy xem những người khác nhận được gì.</p>'],
  [4, 'The accessibility tree',
    '<p>Browsers build a second tree from the DOM for assistive technology. The div page produces one line of text. The semantic page produces a banner, a navigation with two links, a main area, an article, a level-one heading and a button. That is what a screen reader navigates.</p>',
    '<p>Trình duyệt dựng thêm một cây thứ hai từ DOM cho công nghệ hỗ trợ. Trang div cho ra đúng một dòng chữ. Trang ngữ nghĩa cho ra banner, navigation với hai liên kết, vùng main, article, heading cấp một và button. Đó là thứ trình đọc màn hình đi theo.</p>'],
  [5, 'Try the keyboard',
    '<p>Press Tab on each page. On the div page nothing can receive focus, and pressing Enter does nothing, so the page cannot be used without a mouse. On the semantic page Tab visits each control in order, and Enter on the button fires it. We wrote no extra code for that.</p>',
    '<p>Nhấn Tab trên mỗi trang. Ở trang div không gì nhận được tiêu điểm, Enter cũng không làm gì, nên trang không dùng được nếu thiếu chuột. Ở trang ngữ nghĩa Tab đi qua từng điều khiển theo thứ tự, và Enter trên nút sẽ kích hoạt nó. Ta không viết thêm dòng mã nào cho việc đó.</p>'],
  [6, 'Page landmarks',
    '<p>Five tags describe the big regions of a page and turn into landmarks that a screen reader can jump to: <code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code> and <code>footer</code>. Use one <code>main</code> per page. <code>header</code> and <code>footer</code> count as landmarks only at page level.</p>',
    '<p>Năm thẻ mô tả các vùng lớn của trang và trở thành mốc mà trình đọc màn hình nhảy tới được: <code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code> và <code>footer</code>. Mỗi trang một <code>main</code>. <code>header</code> và <code>footer</code> chỉ tính là mốc khi ở cấp trang.</p>'],
  [7, 'article, section or div?',
    '<p>Ask three questions in order. Would this make sense on its own, say in a feed? Then it is an <code>article</code>. Is it a themed part with its own heading? Then a <code>section</code>. Do you only need a box for styling? Then a <code>div</code> is exactly right.</p>',
    '<p>Hỏi ba câu theo thứ tự. Mẩu này đứng một mình có nghĩa không, ví dụ trong một bảng tin? Thì là <code>article</code>. Nó là một phần theo chủ đề, có tiêu đề riêng? Thì là <code>section</code>. Bạn chỉ cần một cái hộp để tạo kiểu? Thì <code>div</code> hoàn toàn đúng.</p>'],
  [8, 'Meaning inside a sentence',
    '<p>Inline tags carry meaning too. <code>strong</code> is importance, <code>em</code> is stress, <code>code</code> is code, <code>kbd</code> is a key. <code>time</code> has a machine-readable date and <code>abbr</code> spells out an abbreviation, and both values can be read back by scripts, as the output shows.</p>',
    '<p>Thẻ trong dòng cũng mang ý nghĩa. <code>strong</code> là tầm quan trọng, <code>em</code> là nhấn giọng, <code>code</code> là mã, <code>kbd</code> là phím. <code>time</code> có ngày tháng máy đọc được và <code>abbr</code> viết đầy đủ từ viết tắt, và cả hai giá trị đều đọc lại được bằng script, như output cho thấy.</p>'],
  [9, 'Native elements do the work',
    '<p>Before you write JavaScript, check whether HTML already does it. <code>details</code> and <code>summary</code> give you an accordion that opens without any script, and <code>figure</code> ties a caption to its image. The first rule of ARIA: if a native element exists, use it.</p>',
    '<p>Trước khi viết JavaScript, hãy kiểm xem HTML đã làm sẵn chưa. <code>details</code> và <code>summary</code> cho bạn khung mở/đóng không cần script, còn <code>figure</code> gắn chú thích với ảnh của nó. Luật đầu tiên của ARIA: nếu có phần tử gốc thì hãy dùng nó.</p>'],
  [10, 'Summary & practice',
    '<p>The practice rewrites a div page without changing how it looks. "Done when" is checked with the keyboard and the Accessibility pane in DevTools, which is exactly how we tested in this lesson. If it works with Tab and Enter alone, you have done it right.</p>',
    '<p>Bài luyện viết lại một trang div mà không đổi giao diện. "Xong khi" được kiểm bằng bàn phím và ngăn Accessibility trong DevTools, đúng cách ta đã kiểm trong bài. Nếu dùng được chỉ với Tab và Enter, bạn đã làm đúng.</p>'],
]);

export default {
  title: '2.3 — Semantic HTML: meaning over decoration|||2.3 — HTML ngữ nghĩa: ý nghĩa trước trang trí',
  slug: 'wf-2-3-semantic-html',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/bOUhq46fd5g', durationSeconds: 0 },
  description: 'Hai trang giống hệt nhau, đo sự khác biệt: cây trợ năng (Playwright ariaSnapshot) và đi bằng phím Tab/Enter thật. Các mốc trang, chọn article/section/div, ngữ nghĩa trong câu (strong, em, time, abbr), a hay button, details/figure không cần JavaScript, luật đầu của ARIA.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Same look, different meaning — and we can measure the difference</h2>
<p class="lead">After this lesson you can choose the tag that says what content <em>is</em>, build a page from the landmark elements, decide between <code>article</code>, <code>section</code> and <code>div</code>, use a <code>button</code> or a link instead of a clickable <code>div</code>, and check your work with the keyboard and the accessibility tree. You need this because a page is read by much more than eyes: screen readers, search engines, browser reader modes, automated tests, translation tools. All of them read your tags, and none of them read your CSS.</p>

<h3>Step 1 — two pages that look identical</h3>
<p>Here are the bodies of two pages. The first uses only <code>div</code> and <code>span</code>:</p>
${ma('html', CODE['2-3/div-soup.html'], [17, 24])}
<p>The second says what each part is:</p>
${ma('html', CODE['2-3/semantic.html'], [18, 27])}
<p>With CSS applied, the screenshots on slide 3 are practically the same picture. A sighted mouse user would never see a difference. This kind of page, made entirely of generic boxes, is known as <strong>div soup</strong>.</p>

<h3>Step 2 — what a screen reader receives: the accessibility tree</h3>
<p>From the DOM, the browser builds a second tree for assistive technology: the <strong>accessibility tree</strong>. Each node has a <em>role</em> (button, link, heading) and a <em>name</em>. We asked Chromium for that tree on both pages. The div page:</p>
${ra(OUT['_t2/out/aria-div-soup'])}
<p>One flat line of text. No regions, no heading, no links, no button. And the semantic page:</p>
${ra(OUT['_t2/out/aria-semantic'])}
<p>Now there is a page structure. A screen-reader user can say "go to navigation", "next heading", "list the links". You also see that <code>header</code> became <code>banner</code> and <code>footer</code> became <code>contentinfo</code>: these are the role names.</p>

<h3>Step 3 — try it without a mouse</h3>
<p>Many people cannot use a mouse, and many others prefer the keyboard. We pressed the real Tab key and Enter on both pages. The div page:</p>
${ra(OUT['_t2/out/tab-div-soup'])}
<p>The "links" and the "button" cannot be reached at all. The semantic page:</p>
${ra(OUT['_t2/out/tab-semantic'])}
<p>The same three controls, reachable and working, and <strong>we did not write one extra line</strong>. <code>a</code> and <code>button</code> are focusable and activate with the keyboard by default. To make a <code>div</code> do the same you would need <code>tabindex</code>, a <code>role</code>, and JavaScript for Enter and Space, and you would probably still miss something.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Screen readers</span><span class="lz-t">read the accessibility tree</span><span class="lz-d">Users jump between landmarks, headings and links.</span></div>
<div class="lz-layer"><span class="lz-k">Search engines</span><span class="lz-t">read the structure</span><span class="lz-d">Headings, links and <code>article</code> tell them what the page is about.</span></div>
<div class="lz-layer"><span class="lz-k">Keyboards</span><span class="lz-t">follow focusable elements</span><span class="lz-d">Only real controls receive focus by default.</span></div>
<div class="lz-layer"><span class="lz-k">Reader mode, translators, tests</span><span class="lz-t">find content by meaning</span><span class="lz-d">Automated tests find a button by its role (Lesson 13.3).</span></div>
<div class="lz-layer"><span class="lz-k">Your teammates</span><span class="lz-t">read the code</span><span class="lz-d"><code>main</code> and <code>nav</code> explain themselves; <code>div class="box2"</code> does not.</span></div>
</div>

<h3>Step 4 — the landmarks of a page</h3>
<table>
<thead><tr><th>Tag</th><th>Means</th><th>Role</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>header</code></td><td>Top of the page: logo, title</td><td>banner</td><td>Inside an <code>article</code> it is only that article's header</td></tr>
<tr><td><code>nav</code></td><td>Main navigation links</td><td>navigation</td><td>For major link groups, not every list of links</td></tr>
<tr><td><code>main</code></td><td>The unique content of this page</td><td>main</td><td>Exactly one visible per page</td></tr>
<tr><td><code>aside</code></td><td>Related but not essential: sidebar</td><td>complementary</td><td>The page still makes sense without it</td></tr>
<tr><td><code>footer</code></td><td>Copyright, contact, secondary links</td><td>contentinfo</td><td>Page-level only, like <code>header</code></td></tr>
</tbody>
</table>
<pre><code class="language-html">&lt;body&gt;
  &lt;header&gt; … logo … &lt;/header&gt;
  &lt;nav&gt; … links … &lt;/nav&gt;
  &lt;main&gt;
    &lt;article&gt; … the post … &lt;/article&gt;
    &lt;aside&gt; … related posts … &lt;/aside&gt;
  &lt;/main&gt;
  &lt;footer&gt; … copyright … &lt;/footer&gt;
&lt;/body&gt;</code></pre>

<h3>Step 5 — <code>article</code>, <code>section</code> or <code>div</code>?</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Does it stand alone?</span><span class="lz-d">Could it appear by itself in a feed or an RSS reader? A blog post, a comment, a product card: <code>article</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Is it a themed part?</span><span class="lz-d">Does it have its own heading, like a chapter? "Pricing", "Reviews": <code>section</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Just a box for layout?</span><span class="lz-d">A wrapper for Flexbox or a background: <code>div</code>. That is its job, and it is perfectly correct.</span></div>
</div>
<p><code>div</code> is not the enemy. It means "no particular meaning", which is the honest choice for a styling wrapper. The problem is only <em>using it where a meaningful element exists</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>section</code> as a fancy <code>div</code>.</strong> Replacing every <code>div</code> with <code>section</code> adds nothing and can make things worse: a <code>section</code> with no heading is a nameless region. Each <code>section</code> should have a heading. If you cannot think of one, it should be a <code>div</code>.</p></div>

<h3>Step 6 — meaning inside a sentence</h3>
${ma('html', CODE['2-3/van-ban-ngu-nghia.html'], [5, 8])}
${ra(OUT['2-3/van-ban-ngu-nghia'])}
<table>
<thead><tr><th>Tag</th><th>Means</th><th>Not</th></tr></thead>
<tbody>
<tr><td><code>strong</code></td><td>Important</td><td><code>b</code> only makes text bold, with no meaning</td></tr>
<tr><td><code>em</code></td><td>Stressed: changes how a sentence is read</td><td><code>i</code> is for foreign words or titles</td></tr>
<tr><td><code>code</code>, <code>kbd</code></td><td>Computer code; a key to press</td><td>A monospace font in CSS</td></tr>
<tr><td><code>time</code></td><td>A date, with <code>datetime</code> for machines</td><td>Plain text</td></tr>
<tr><td><code>abbr</code></td><td>An abbreviation and its expansion</td><td>—</td></tr>
<tr><td><code>mark</code>, <code>del</code>, <code>ins</code></td><td>Highlighted, deleted, inserted text</td><td>Colours and strikethrough in CSS</td></tr>
</tbody>
</table>
<p>The rule of thumb: if you want it to <em>look</em> bold, use CSS; if it <em>is</em> important, use <code>strong</code>.</p>

<h3>Step 7 — <code>a</code> or <code>button</code>?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">It goes somewhere</span><span class="v">A new URL → <code>a href</code>. Users can open it in a new tab, copy the address, use Back.</span></div>
  <div class="kv"><span class="k">It does something</span><span class="v">Save, delete, open a menu → <code>button</code>. It stays on this page, and activates with Enter and Space.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — the clickable <code>div</code>.</strong> <code>&lt;div onclick="…"&gt;</code> works with a mouse, so it passes a quick test, and it fails for keyboard users, screen-reader users, and voice control. It was the first thing our measurement caught: Tab found nothing, and Enter did nothing. Same with <code>&lt;a href="#" onclick="…"&gt;</code> for an action: it pretends to be a link. Use <code>button type="button"</code> and reset its look in CSS (Lesson 3.1).</p></div>

<h3>Step 8 — native elements that do the work for you</h3>
<p>Before you reach for JavaScript, check whether HTML already does it:</p>
${ma('html', CODE['2-3/mo-rong.html'], [6, 16])}
${ra(OUT['2-3/mo-rong'])}
<p><code>details</code> and <code>summary</code> give you an accordion: click and it opens, with keyboard support, and no JavaScript of ours. <code>figure</code> and <code>figcaption</code> tie a caption to an image, code block or chart; <code>blockquote</code> marks a quotation. Others worth knowing: <code>dialog</code> for modals (Lesson 12.1) and <code>address</code> for contact details.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reaching for ARIA first.</strong> ARIA attributes such as <code>role="button"</code> and <code>aria-label</code> add information to the accessibility tree. They do not add behaviour: <code>role="button"</code> on a <code>div</code> announces "button" but still ignores Tab and Enter, which is worse than saying nothing. The first rule of ARIA is: <strong>if a native HTML element does the job, use it</strong>. Use ARIA only for what HTML cannot express, and test it.</p></div>

<h3>How to check your own page</h3>
<ol>
<li><strong>Unplug the mouse.</strong> Tab through the page. Can you reach everything? Can you see where the focus is? Does Enter work?</li>
<li><strong>DevTools → Elements → Accessibility pane.</strong> Select an element to see its role and name. Chrome can also show the full accessibility tree.</li>
<li><strong>Lighthouse → Accessibility.</strong> An automatic audit. It catches missing <code>alt</code> and labels, but not everything, so step 1 still matters.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes) — remove the div soup</strong></p>
<p>Copy the <code>div-soup</code> body above into a file, and add this CSS so it has some shape: <code>body { font-family: sans-serif; } .top { background: navy; color: white; }</code>.</p>
<ol>
<li>Replace the generic tags with <code>header</code>, <code>nav</code>, <code>main</code>, <code>article</code>, <code>h1</code>, <code>p</code>, <code>footer</code>.</li>
<li>Turn the two menu <code>span</code>s into real links, and the Like <code>div</code> into a <code>button type="button"</code>.</li>
<li>Add an <code>aside</code> with two related links, and a <code>time</code> for the publishing date.</li>
<li>Rewrite your CSS selectors so the page looks as it did.</li>
</ol>
<p>Hint: the Elements tab shows at a glance which elements are left over. A <code>div</code> that remains should be a wrapper with no meaning of its own.</p>
<p><strong>Done when:</strong> pressing Tab reaches both links and the button in order, and Enter on the button runs its action; <code>document.querySelectorAll('main').length</code> is 1; <code>document.querySelectorAll('h1').length</code> is 1; and the Accessibility pane shows role "button" for Like and "navigation" for the menu. Code Lab module 2.3 grades the same conversions.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">semantic HTML</span><span class="v">HTML ngữ nghĩa — thẻ nói được nội dung là gì.</span></div>
  <div class="kv"><span class="k">div soup</span><span class="v">"súp div" — trang toàn thẻ chung chung.</span></div>
  <div class="kv"><span class="k">accessibility (a11y)</span><span class="v">khả năng tiếp cận — ai cũng dùng được.</span></div>
  <div class="kv"><span class="k">accessibility tree</span><span class="v">cây trợ năng — cây vai trò và tên cho công nghệ hỗ trợ.</span></div>
  <div class="kv"><span class="k">screen reader</span><span class="v">trình đọc màn hình — đọc to trang cho người khiếm thị.</span></div>
  <div class="kv"><span class="k">landmark</span><span class="v">mốc trang — vùng lớn có thể nhảy tới.</span></div>
  <div class="kv"><span class="k">role</span><span class="v">vai trò — button, link, heading…</span></div>
  <div class="kv"><span class="k">focus</span><span class="v">tiêu điểm — phần tử đang nhận phím.</span></div>
  <div class="kv"><span class="k">ARIA</span><span class="v">thuộc tính bổ sung thông tin trợ năng.</span></div>
  <div class="kv"><span class="k">native element</span><span class="v">phần tử gốc — thẻ HTML sẵn có hành vi.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Two pages can look identical; only the tags tell machines and assistive technology what they are.</li>
  <li>The accessibility tree is built from your tags: div soup gives one line of text; semantic HTML gives a structure.</li>
  <li><code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code>, <code>footer</code> are page landmarks; one <code>main</code>.</li>
  <li><code>article</code> stands alone, <code>section</code> is a themed part with a heading, <code>div</code> is for layout.</li>
  <li>Goes somewhere: <code>a</code>. Does something: <code>button</code>. Never a clickable <code>div</code>.</li>
  <li><code>strong</code>/<code>em</code> are meaning; looks are CSS.</li>
  <li>Native elements first; ARIA only for what HTML cannot express. Test with Tab and Enter.</li>
</ul>
${nguon('📗', 'MDN — HTML elements reference', 'Every element, grouped by purpose', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element')}
${nguon('📘', 'web.dev — Learn Accessibility', 'A free course on the accessibility tree, focus and semantics', 'https://web.dev/learn/accessibility')}
${lienKet({ khoa: 'testing', bai: 'tst-6-1-testing-library', title: 'Testing 6.1 — Testing Library', sub: 'Tests find elements by role, so semantic HTML makes pages testable', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Cùng giao diện, khác ý nghĩa — và ta đo được sự khác biệt</h2>
<p class="lead">Học xong bài này bạn chọn được thẻ nói đúng nội dung <em>là gì</em>, dựng trang từ các phần tử mốc, quyết định giữa <code>article</code>, <code>section</code> và <code>div</code>, dùng <code>button</code> hay liên kết thay cho <code>div</code> bấm được, và kiểm công việc bằng bàn phím và cây trợ năng. Bạn cần điều này vì trang web được đọc bởi nhiều thứ hơn là mắt: trình đọc màn hình, công cụ tìm kiếm, chế độ đọc của trình duyệt, kiểm thử tự động, công cụ dịch. Tất cả đều đọc thẻ của bạn, và không cái nào đọc CSS.</p>

<h3>Bước 1 — hai trang trông giống hệt nhau</h3>
<p>Đây là phần body của hai trang. Trang đầu chỉ dùng <code>div</code> và <code>span</code>:</p>
${ma('html', CODE['2-3/div-soup.html'], [17, 24])}
<p>Trang thứ hai nói rõ mỗi phần là gì:</p>
${ma('html', CODE['2-3/semantic.html'], [18, 27])}
<p>Khi đã có CSS, hai ảnh chụp ở slide 3 gần như là một. Người nhìn được và dùng chuột sẽ không thấy khác biệt nào. Kiểu trang dựng toàn hộp chung chung như vậy gọi là <strong>div soup (súp div)</strong>.</p>

<h3>Bước 2 — trình đọc màn hình nhận được gì: cây trợ năng</h3>
<p>Từ DOM, trình duyệt dựng thêm một cây thứ hai cho công nghệ hỗ trợ: <strong>cây trợ năng (accessibility tree)</strong>. Mỗi nút có một <em>vai trò (role)</em> (button, link, heading) và một <em>tên</em>. Ta hỏi Chromium lấy cây đó trên cả hai trang. Trang div:</p>
${ra(OUT['_t2/out/aria-div-soup'])}
<p>Một dòng chữ phẳng. Không có vùng nào, không tiêu đề, không liên kết, không nút. Và trang ngữ nghĩa:</p>
${ra(OUT['_t2/out/aria-semantic'])}
<p>Giờ đã có cấu trúc trang. Người dùng trình đọc màn hình có thể ra lệnh "tới phần điều hướng", "tiêu đề tiếp theo", "liệt kê liên kết". Bạn cũng thấy <code>header</code> thành <code>banner</code> và <code>footer</code> thành <code>contentinfo</code>: đó là tên vai trò.</p>

<h3>Bước 3 — thử không dùng chuột</h3>
<p>Nhiều người không dùng được chuột, nhiều người khác thích bàn phím hơn. Ta nhấn phím Tab và Enter thật trên cả hai trang. Trang div:</p>
${ra(OUT['_t2/out/tab-div-soup'])}
<p>Các "liên kết" và "nút" hoàn toàn không với tới được. Trang ngữ nghĩa:</p>
${ra(OUT['_t2/out/tab-semantic'])}
<p>Vẫn ba điều khiển đó, tới được và chạy được, và <strong>ta không viết thêm một dòng nào</strong>. <code>a</code> và <code>button</code> mặc định nhận tiêu điểm và kích hoạt được bằng bàn phím. Muốn <code>div</code> làm được vậy bạn cần <code>tabindex</code>, một <code>role</code>, và JavaScript cho Enter với Space, mà có lẽ vẫn sót gì đó.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trình đọc màn hình</span><span class="lz-t">đọc cây trợ năng</span><span class="lz-d">Người dùng nhảy giữa các mốc, tiêu đề và liên kết.</span></div>
<div class="lz-layer"><span class="lz-k">Công cụ tìm kiếm</span><span class="lz-t">đọc cấu trúc</span><span class="lz-d">Tiêu đề, liên kết và <code>article</code> cho chúng biết trang nói về gì.</span></div>
<div class="lz-layer"><span class="lz-k">Bàn phím</span><span class="lz-t">đi theo phần tử nhận tiêu điểm</span><span class="lz-d">Chỉ điều khiển thật mới nhận tiêu điểm theo mặc định.</span></div>
<div class="lz-layer"><span class="lz-k">Chế độ đọc, trình dịch, kiểm thử</span><span class="lz-t">tìm nội dung theo ý nghĩa</span><span class="lz-d">Kiểm thử tự động tìm nút theo vai trò (Bài 13.3).</span></div>
<div class="lz-layer"><span class="lz-k">Đồng đội của bạn</span><span class="lz-t">đọc mã</span><span class="lz-d"><code>main</code> và <code>nav</code> tự giải thích; <code>div class="box2"</code> thì không.</span></div>
</div>

<h3>Bước 4 — các mốc của một trang</h3>
<table>
<thead><tr><th>Thẻ</th><th>Nghĩa</th><th>Vai trò</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>header</code></td><td>Đầu trang: logo, tên</td><td>banner</td><td>Trong <code>article</code> thì chỉ là đầu của bài đó</td></tr>
<tr><td><code>nav</code></td><td>Liên kết điều hướng chính</td><td>navigation</td><td>Cho các nhóm liên kết lớn, không phải danh sách nào cũng vậy</td></tr>
<tr><td><code>main</code></td><td>Nội dung riêng của trang này</td><td>main</td><td>Đúng một cái hiển thị mỗi trang</td></tr>
<tr><td><code>aside</code></td><td>Liên quan nhưng không thiết yếu: thanh bên</td><td>complementary</td><td>Bỏ đi trang vẫn có nghĩa</td></tr>
<tr><td><code>footer</code></td><td>Bản quyền, liên hệ, liên kết phụ</td><td>contentinfo</td><td>Chỉ ở cấp trang, như <code>header</code></td></tr>
</tbody>
</table>
<pre><code class="language-html">&lt;body&gt;
  &lt;header&gt; … logo … &lt;/header&gt;
  &lt;nav&gt; … liên kết … &lt;/nav&gt;
  &lt;main&gt;
    &lt;article&gt; … bài viết … &lt;/article&gt;
    &lt;aside&gt; … bài liên quan … &lt;/aside&gt;
  &lt;/main&gt;
  &lt;footer&gt; … bản quyền … &lt;/footer&gt;
&lt;/body&gt;</code></pre>

<h3>Bước 5 — <code>article</code>, <code>section</code> hay <code>div</code>?</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó đứng một mình được không?</span><span class="lz-d">Có thể hiện riêng trong bảng tin hay RSS không? Bài blog, bình luận, thẻ sản phẩm: <code>article</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó là một phần theo chủ đề?</span><span class="lz-d">Có tiêu đề riêng, như một chương? "Bảng giá", "Đánh giá": <code>section</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chỉ là hộp để bố cục?</span><span class="lz-d">Lớp bọc cho Flexbox hay màu nền: <code>div</code>. Đó là việc của nó, và hoàn toàn đúng.</span></div>
</div>
<p><code>div</code> không phải kẻ thù. Nó nghĩa là "không có ý nghĩa cụ thể", là lựa chọn trung thực cho một lớp bọc tạo kiểu. Vấn đề chỉ là <em>dùng nó ở chỗ đã có phần tử mang nghĩa</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>section</code> như một <code>div</code> sang chảnh.</strong> Thay mọi <code>div</code> bằng <code>section</code> chẳng thêm gì mà còn có thể tệ hơn: <code>section</code> không tiêu đề là một vùng không tên. Mỗi <code>section</code> nên có tiêu đề. Nếu không nghĩ ra tiêu đề nào, nó nên là <code>div</code>.</p></div>

<h3>Bước 6 — ý nghĩa bên trong câu</h3>
${ma('html', CODE['2-3/van-ban-ngu-nghia.html'], [5, 8])}
${ra(OUT['2-3/van-ban-ngu-nghia'])}
<table>
<thead><tr><th>Thẻ</th><th>Nghĩa</th><th>Không phải</th></tr></thead>
<tbody>
<tr><td><code>strong</code></td><td>Quan trọng</td><td><code>b</code> chỉ làm đậm, không có nghĩa gì</td></tr>
<tr><td><code>em</code></td><td>Nhấn giọng: đổi cách đọc câu</td><td><code>i</code> dành cho từ nước ngoài hay tên tác phẩm</td></tr>
<tr><td><code>code</code>, <code>kbd</code></td><td>Mã máy tính; phím cần nhấn</td><td>Phông đơn cách trong CSS</td></tr>
<tr><td><code>time</code></td><td>Ngày tháng, có <code>datetime</code> cho máy đọc</td><td>Chữ thường</td></tr>
<tr><td><code>abbr</code></td><td>Từ viết tắt và dạng đầy đủ</td><td>—</td></tr>
<tr><td><code>mark</code>, <code>del</code>, <code>ins</code></td><td>Chữ nổi bật, đã xoá, được thêm</td><td>Màu và gạch ngang trong CSS</td></tr>
</tbody>
</table>
<p>Quy tắc nhanh: nếu muốn nó <em>trông</em> đậm, dùng CSS; nếu nó <em>thật sự</em> quan trọng, dùng <code>strong</code>.</p>

<h3>Bước 7 — <code>a</code> hay <code>button</code>?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó đi tới đâu đó</span><span class="v">URL mới → <code>a href</code>. Người dùng mở được ở thẻ mới, chép địa chỉ, bấm Back.</span></div>
  <div class="kv"><span class="k">Nó làm gì đó</span><span class="v">Lưu, xoá, mở menu → <code>button</code>. Vẫn ở trang này, kích hoạt bằng Enter và Space.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>div</code> bấm được.</strong> <code>&lt;div onclick="…"&gt;</code> chạy với chuột nên qua được phép thử nhanh, nhưng hỏng với người dùng bàn phím, trình đọc màn hình và điều khiển bằng giọng nói. Đó là thứ đầu tiên phép đo của ta bắt được: Tab không thấy gì, Enter không làm gì. Tương tự với <code>&lt;a href="#" onclick="…"&gt;</code> cho một hành động: nó giả làm liên kết. Hãy dùng <code>button type="button"</code> và đặt lại giao diện bằng CSS (Bài 3.1).</p></div>

<h3>Bước 8 — phần tử gốc làm hộ bạn</h3>
<p>Trước khi với tay tới JavaScript, hãy kiểm xem HTML đã có sẵn chưa:</p>
${ma('html', CODE['2-3/mo-rong.html'], [6, 16])}
${ra(OUT['2-3/mo-rong'])}
<p><code>details</code> và <code>summary</code> cho bạn khung mở/đóng: bấm là mở, có hỗ trợ bàn phím, và không có dòng JavaScript nào của ta. <code>figure</code> và <code>figcaption</code> gắn chú thích vào ảnh, khối mã hay biểu đồ; <code>blockquote</code> đánh dấu trích dẫn. Những thẻ khác đáng biết: <code>dialog</code> cho hộp thoại (Bài 12.1) và <code>address</code> cho thông tin liên hệ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — với tay tới ARIA trước tiên.</strong> Các thuộc tính ARIA như <code>role="button"</code> và <code>aria-label</code> thêm thông tin vào cây trợ năng. Chúng không thêm hành vi: <code>role="button"</code> trên <code>div</code> sẽ thông báo "nút" nhưng vẫn phớt lờ Tab và Enter, còn tệ hơn là không nói gì. Luật đầu tiên của ARIA là: <strong>nếu có phần tử HTML gốc làm được việc, hãy dùng nó</strong>. Chỉ dùng ARIA cho thứ HTML không diễn đạt được, và phải kiểm thử.</p></div>

<h3>Cách tự kiểm trang của bạn</h3>
<ol>
<li><strong>Rút chuột ra.</strong> Tab qua trang. Có tới được mọi thứ không? Có thấy tiêu điểm đang ở đâu không? Enter có chạy không?</li>
<li><strong>DevTools → Elements → ngăn Accessibility.</strong> Chọn một phần tử để xem vai trò và tên. Chrome còn hiện được cả cây trợ năng.</li>
<li><strong>Lighthouse → Accessibility.</strong> Kiểm tra tự động. Nó bắt được thiếu <code>alt</code>, thiếu nhãn, nhưng không bắt được hết, nên bước 1 vẫn quan trọng.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút) — dọn súp div</strong></p>
<p>Chép phần body <code>div-soup</code> ở trên vào một tệp, và thêm CSS này cho có hình hài: <code>body { font-family: sans-serif; } .top { background: navy; color: white; }</code>.</p>
<ol>
<li>Thay các thẻ chung chung bằng <code>header</code>, <code>nav</code>, <code>main</code>, <code>article</code>, <code>h1</code>, <code>p</code>, <code>footer</code>.</li>
<li>Biến hai <code>span</code> menu thành liên kết thật, và <code>div</code> Like thành <code>button type="button"</code>.</li>
<li>Thêm một <code>aside</code> với hai liên kết liên quan, và một <code>time</code> cho ngày đăng.</li>
<li>Viết lại bộ chọn CSS để trang trông như cũ.</li>
</ol>
<p>Gợi ý: thẻ Elements cho thấy ngay còn sót phần tử nào. <code>div</code> còn lại phải là lớp bọc không có ý nghĩa riêng.</p>
<p><strong>Xong khi:</strong> nhấn Tab tới được hai liên kết và nút theo thứ tự, Enter trên nút chạy hành động của nó; <code>document.querySelectorAll('main').length</code> là 1; <code>document.querySelectorAll('h1').length</code> là 1; và ngăn Accessibility hiện vai trò "button" cho Like và "navigation" cho menu. Module Code Lab 2.3 chấm đúng những chuyển đổi này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">semantic HTML</span><span class="v">HTML ngữ nghĩa — thẻ nói được nội dung là gì.</span></div>
  <div class="kv"><span class="k">div soup</span><span class="v">"súp div" — trang toàn thẻ chung chung.</span></div>
  <div class="kv"><span class="k">accessibility (a11y)</span><span class="v">khả năng tiếp cận — ai cũng dùng được.</span></div>
  <div class="kv"><span class="k">accessibility tree</span><span class="v">cây trợ năng — cây vai trò và tên cho công nghệ hỗ trợ.</span></div>
  <div class="kv"><span class="k">screen reader</span><span class="v">trình đọc màn hình — đọc to trang cho người khiếm thị.</span></div>
  <div class="kv"><span class="k">landmark</span><span class="v">mốc trang — vùng lớn có thể nhảy tới.</span></div>
  <div class="kv"><span class="k">role</span><span class="v">vai trò — button, link, heading…</span></div>
  <div class="kv"><span class="k">focus</span><span class="v">tiêu điểm — phần tử đang nhận phím.</span></div>
  <div class="kv"><span class="k">ARIA</span><span class="v">thuộc tính bổ sung thông tin trợ năng.</span></div>
  <div class="kv"><span class="k">native element</span><span class="v">phần tử gốc — thẻ HTML sẵn có hành vi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Hai trang có thể trông giống hệt; chỉ các thẻ mới nói cho máy và công nghệ hỗ trợ biết chúng là gì.</li>
  <li>Cây trợ năng được dựng từ thẻ của bạn: súp div cho một dòng chữ; HTML ngữ nghĩa cho một cấu trúc.</li>
  <li><code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code>, <code>footer</code> là các mốc trang; một <code>main</code>.</li>
  <li><code>article</code> đứng một mình, <code>section</code> là phần theo chủ đề có tiêu đề, <code>div</code> để bố cục.</li>
  <li>Đi tới đâu: <code>a</code>. Làm gì đó: <code>button</code>. Không bao giờ dùng <code>div</code> bấm được.</li>
  <li><code>strong</code>/<code>em</code> là ý nghĩa; giao diện là CSS.</li>
  <li>Phần tử gốc trước; ARIA chỉ cho thứ HTML không diễn đạt được. Kiểm bằng Tab và Enter.</li>
</ul>
${nguon('📗', 'MDN — HTML elements reference', 'Mọi phần tử, xếp theo mục đích', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element')}
${nguon('📘', 'web.dev — Learn Accessibility', 'Khoá miễn phí về cây trợ năng, tiêu điểm và ngữ nghĩa', 'https://web.dev/learn/accessibility')}
${lienKet({ khoa: 'testing', bai: 'tst-6-1-testing-library', title: 'Kiểm thử 6.1 — Testing Library', sub: 'Test tìm phần tử theo vai trò, nên HTML ngữ nghĩa làm trang kiểm thử được', cta: 'Mở bài' })}
</div>
`,
};
