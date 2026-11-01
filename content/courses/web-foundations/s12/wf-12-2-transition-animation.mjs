/**
 * Bài 12.2 — Transition & animation (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật, đo theo khung hình).
 * Deck: scripts/slides-src/wf-12-2.mjs (11 slide, WF/v1/wf-12-2).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const OUT_RM = [OUT['12-2/reduced-motion-normal'], OUT['12-2/reduced-motion-reduce']].join('\n');

const G = walkWf('wf-12-2', 'Transitions & animations', 'Chuyển cảnh & hoạt hình', [
  [1, 'Transitions & animations',
    '<p>Motion in an interface is not decoration. A menu that slides out of the button tells you where it came from; a toast that fades in tells you something was saved. This lesson teaches the two CSS tools for motion, measures them in a real browser, and shows the rules that keep motion fast and accessible.</p>',
    '<p>Chuyển động trong giao diện không phải trang trí. Một menu trượt ra từ nút cho biết nó đến từ đâu; một thông báo hiện dần cho biết vừa lưu xong. Bài này dạy hai công cụ CSS cho chuyển động, đo chúng trong trình duyệt thật, và chỉ ra các luật giữ chuyển động nhanh và thân thiện với mọi người.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills, from writing your first transition to respecting the operating-system setting that turns motion off. The "height: auto" trick alone solves one of the most searched CSS questions.</p>',
    '<p>Năm kỹ năng, từ viết transition đầu tiên tới tôn trọng cài đặt tắt chuyển động của hệ điều hành. Riêng mẹo "height: auto" đã giải một trong những câu hỏi CSS được tìm nhiều nhất.</p>'],
  [3, 'A transition, measured',
    '<p>Two bars grow from 100 to 300 pixels in one second. The page measured their real widths every quarter second. Linear moves in equal steps. Ease starts fast and slows down — it is already at 182 pixels after a quarter of the time. That difference is what makes ease feel natural.</p>',
    '<p>Hai thanh dài ra từ 100 tới 300 điểm ảnh trong một giây. Trang đo bề rộng thật của chúng mỗi phần tư giây. Linear đi đều từng bước. Ease khởi đầu nhanh rồi chậm dần — mới một phần tư thời gian đã tới 182 điểm ảnh. Khác biệt đó làm ease trông tự nhiên.</p>'],
  [4, 'The shorthand',
    '<p>Property, duration, timing function, delay — in that order, several transitions separated by commas. Durations between one and four hundred milliseconds cover nearly everything; longer motion makes an interface feel slow.</p>',
    '<p>Thuộc tính, thời lượng, hàm thời gian, độ trễ — theo thứ tự đó, nhiều transition cách nhau bằng dấu phẩy. Thời lượng từ một trăm tới bốn trăm mili giây đủ cho gần như mọi thứ; chuyển động dài hơn làm giao diện có cảm giác chậm.</p>'],
  [5, 'height: auto',
    '<p>Measured: the panel set to <code>height: auto</code> jumped to its full 104 pixels instantly — auto is not a number, so the browser cannot compute the in-between values. Animating grid rows from <code>0fr</code> to <code>1fr</code> is numeric, and the measured heights grow smoothly.</p>',
    '<p>Đo được: panel đặt <code>height: auto</code> nhảy ngay lên đủ 104 điểm ảnh — auto không phải con số, nên trình duyệt không tính được các giá trị ở giữa. Animate hàng grid từ <code>0fr</code> tới <code>1fr</code> là số, và chiều cao đo được tăng mượt.</p>'],
  [6, '@keyframes',
    '<p>When a transition is not enough — a loop, or more than two steps — define named keyframes. The browser reports both running animations: the spinner loops forever, the toast plays once and, thanks to <code>fill: both</code>, stays in its final state.</p>',
    '<p>Khi transition không đủ — một vòng lặp, hoặc hơn hai bước — hãy định nghĩa keyframes có tên. Trình duyệt báo cả hai animation đang chạy: spinner lặp mãi, toast chạy một lần và nhờ <code>fill: both</code> giữ nguyên trạng thái cuối.</p>'],
  [7, 'Transition or animation?',
    '<p>A transition moves between two states and is started by a change — hover, focus, a class. An animation can have many steps, can loop, and starts by itself. If you can describe it as "from A to B when something happens", use a transition.</p>',
    '<p>Transition đi giữa hai trạng thái và được kích bởi một thay đổi — hover, focus, một class. Animation có thể nhiều bước, có thể lặp, và tự bắt đầu. Nếu mô tả được là "từ A sang B khi có gì đó xảy ra", hãy dùng transition.</p>'],
  [8, 'Cheap vs expensive',
    '<p>Moving 400 dots for 60 frames: with <code>left</code> the browser recomputed layout every frame; with <code>transform</code> it did not. Measured here, transform took about half the time. On a phone the difference decides whether the animation is smooth or stutters.</p>',
    '<p>Di chuyển 400 chấm trong 60 khung hình: dùng <code>left</code> thì trình duyệt tính lại bố cục mỗi khung; dùng <code>transform</code> thì không. Đo ở đây, transform mất khoảng một nửa thời gian. Trên điện thoại khác biệt này quyết định animation mượt hay giật.</p>'],
  [9, 'transitionend',
    '<p>To remove an element after it fades, listen for <code>transitionend</code>. Two properties were animated, so two events arrived — act on one of them only. <code>getAnimations()</code> with the <code>finished</code> promise is a more modern way to wait.</p>',
    '<p>Muốn gỡ phần tử sau khi nó mờ đi, hãy nghe <code>transitionend</code>. Hai thuộc tính được animate nên có hai sự kiện — chỉ hành động với một cái. <code>getAnimations()</code> cùng promise <code>finished</code> là cách hiện đại hơn để chờ.</p>'],
  [10, 'prefers-reduced-motion',
    '<p>Some people turn motion off in their operating system because animation causes dizziness or nausea. The same page was rendered twice: normally, the spinner runs for 0.8 seconds forever; with reduced motion, every duration collapses to almost zero and the loop runs once.</p>',
    '<p>Có người tắt chuyển động trong hệ điều hành vì animation làm họ chóng mặt hoặc buồn nôn. Cùng một trang được render hai lần: bình thường, spinner chạy 0,8 giây lặp mãi; khi giảm chuyển động, mọi thời lượng gần như bằng không và vòng lặp chỉ chạy một lần.</p>'],
  [11, 'Summary & practice',
    '<p>The FAQ exercise uses everything: a grid-row transition, a rotating icon with transform, a toast removed on <code>transitionend</code>, and a reduced-motion rule. Check it with DevTools’ rendering panel, which can emulate reduced motion.</p>',
    '<p>Bài FAQ dùng tất cả: transition hàng grid, icon xoay bằng transform, toast được gỡ khi <code>transitionend</code>, và một luật giảm chuyển động. Kiểm bằng bảng Rendering của DevTools, nơi giả lập được chế độ giảm chuyển động.</p>'],
]);

export default {
  title: '12.2 — Transitions and animations|||12.2 — Chuyển cảnh và hoạt hình',
  slug: 'wf-12-2-transition-animation',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Transition đo theo từng khung hình (linear vs ease), cú pháp và thời lượng hợp lý, vì sao height: auto không animate và mẹo grid 0fr→1fr, @keyframes, transition hay animation, transform/opacity rẻ hơn left (đo thật), transitionend, prefers-reduced-motion.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Motion that explains, stays smooth, and can be turned off</h2>
<p class="lead">After this lesson you can make a button change colour smoothly, open an accordion panel with an animated height, build a loading spinner and a toast that slides in, remove an element right after it fades out, and make all of it switch off for people who ask their computer for less motion. Why it matters: motion is how an interface explains change — what appeared, where it came from, what was saved. Done badly it is slow, janky on phones, or makes some users physically unwell. Every example below was measured frame by frame in Chromium.</p>

<h3>Step 1 — a transition, measured</h3>
<p>A <strong>transition</strong> tells the browser: "when this property changes, do not jump — move from the old value to the new one over this much time".</p>
${ma('html', CODE['12-2/transition-sample.html'], [7, 18])}
${ra(OUT['12-2/transition-sample'])}
<p>Adding the class <code>wide</code> changed <code>width</code> from 100&nbsp;px to 300&nbsp;px, and the transition spread that change over one second. The page read the real widths at 0, 250, 500, 750 and 1000&nbsp;ms. With <code>linear</code> the bar grows by the same 50&nbsp;px each quarter. With <code>ease</code> (the default) it is already at 182&nbsp;px after a quarter of the time and creeps over the last part — fast start, gentle stop, the way physical objects move.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">transition-property</span><span class="v">What to animate: <code>width</code>, <code>background-color</code>, <code>transform</code>… (avoid <code>all</code>, see the trap below).</span></div>
  <div class="kv"><span class="k">transition-duration</span><span class="v">How long. 100–200&nbsp;ms for hover and press, 200–400&nbsp;ms for menus and panels.</span></div>
  <div class="kv"><span class="k">transition-timing-function</span><span class="v">The speed curve: <code>ease</code>, <code>linear</code>, <code>ease-in</code>, <code>ease-out</code> (best for things entering), <code>cubic-bezier(…)</code>.</span></div>
  <div class="kv"><span class="k">transition-delay</span><span class="v">Wait before starting — useful for staggered lists.</span></div>
</div>
<p>The shorthand puts them in one line: <code>transition: background-color 200ms ease-out;</code>, and several transitions are separated by commas: <code>transition: transform 300ms ease, opacity 300ms ease;</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>transition: all</code>.</strong> It animates every property that changes, including ones you did not intend (a colour change in dark mode, a layout property that makes the page jump around) and it makes the browser track every property. Name the properties you mean.</p></div>

<h3>Step 2 — why <code>height: auto</code> will not animate (and the fix)</h3>
${ma('html', CODE['12-2/height-auto.html'], [7, 21])}
${ra(OUT['12-2/height-auto'])}
<p>The left column of the output is the first panel. It was already at its full 104&nbsp;px at time 0: the browser can interpolate between two <em>numbers</em>, and <code>auto</code> is not a number — it means "whatever the content needs", which is only known after layout. So there is nothing to interpolate and the value jumps.</p>
<p>The second panel animates <code>grid-template-rows</code> from <code>0fr</code> to <code>1fr</code>. Fractions are numbers, so the browser can compute every frame: 29, 55, 81, 104&nbsp;px. The single grid row stretches from zero to the content's natural height. The inner element needs <code>min-height: 0</code> (and usually <code>overflow: hidden</code>) so it is allowed to shrink below its content.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Wrapper is a grid</span><span class="lz-d"><code>display: grid; grid-template-rows: 0fr;</code> — one row, collapsed.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Child may shrink</span><span class="lz-d"><code>min-height: 0; overflow: hidden;</code> on the single child.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Open = 1fr</span><span class="lz-d">Toggle a class that sets <code>grid-template-rows: 1fr</code>; the transition does the rest.</span></div>
</div>

<h3>Step 3 — <code>@keyframes</code> animations</h3>
${ma('html', CODE['12-2/keyframes.html'], [8, 26])}
${ra(OUT['12-2/keyframes'])}
<p>An <strong>animation</strong> is defined separately with <code>@keyframes name { … }</code> and attached with <code>animation: name duration timing iteration-count fill-mode</code>. The page asked the browser for its running animations with <code>document.getAnimations()</code>: the spinner rotates every 800&nbsp;ms forever (<code>Infinity</code>), the toast slides in once. <code>fill: both</code> means "show the first keyframe before the animation starts and keep the last one after it ends" — without it, a toast with a delay would flash at its final position before animating. The screenshot on slide 6 was taken mid-animation.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Use a transition when…</span><span class="v">there are two states (closed ⇄ open), the change is triggered (hover, focus, a class), and it should reverse naturally.</span></div>
  <div class="kv"><span class="k">Use @keyframes when…</span><span class="v">there are more than two steps, it loops (spinner, skeleton shimmer), or it plays by itself on page load.</span></div>
</div>

<h3>Step 4 — cheap properties and expensive ones</h3>
<p>Every frame the browser may have to run up to three stages: <strong>layout</strong> (compute sizes and positions), <strong>paint</strong> (draw pixels) and <strong>composite</strong> (stack the painted layers). Changing <code>left</code>, <code>top</code>, <code>width</code> or <code>margin</code> triggers all three. Changing <code>transform</code> or <code>opacity</code> usually triggers only compositing, which can run on the GPU.</p>
${ma('html', CODE['12-2/left-vs-transform.html'], [21, 40])}
${ra(OUT['12-2/left-vs-transform'])}
<p>The test moves 400 dots for 60 frames twice and forces the browser to bring layout up to date after each frame. Moving them with <code>transform</code> took roughly half the time of <code>left</code> on this machine, because no layout had to be recomputed. On a mid-range phone the gap is what separates 60 smooth frames per second from a visibly stuttering animation.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — animating layout properties.</strong> Sliding a drawer with <code>left: -300px → 0</code> or growing a card with <code>width</code> looks fine on your laptop and janks on a cheap phone. Move with <code>transform: translate(…)</code>, grow with <code>transform: scale(…)</code>, fade with <code>opacity</code>. Check it in Chrome DevTools: Performance panel → record → look for purple "Layout" blocks during the animation.</p></div>

<h3>Step 5 — waiting for the end of a transition</h3>
${ma('html', CODE['12-2/transitionend.html'], [16, 30])}
${ra(OUT['12-2/transitionend'])}
<p>A typical pattern: when the user dismisses an alert, fade it out, then remove it from the DOM. <code>transitionend</code> fires when a transition finishes — <em>once per property</em>. Both opacity and transform were animated, so two events arrived about 300&nbsp;ms after the click. The handler acts only on <code>opacity</code>; acting on both would try to remove the element twice (or run a callback twice).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>transitionend</code> that never comes.</strong> If the property does not actually change (the class was already there), if the element is hidden with <code>display: none</code>, or if reduced motion sets the duration to zero in some setups, no event fires and your cleanup never runs. Use <code>Promise.all(el.getAnimations().map((a) =&gt; a.finished))</code> or add a timeout fallback for code that <em>must</em> run.</p></div>

<h3>Step 6 — respect <code>prefers-reduced-motion</code></h3>
<p>Operating systems have a setting "reduce motion" (Windows: Animation effects; macOS/iOS: Reduce motion). Some people need it because large motion causes dizziness or nausea (vestibular disorders). The browser exposes it as a media query.</p>
${ma('css', CODE['12-2/reduced-motion.css'])}
${ra(OUT_RM)}
<p>The same page was opened twice in Chromium, once normally and once with reduced motion emulated. In the second run every animation and transition duration collapsed to <code>1e-05s</code> (0.01&nbsp;ms) and the spinner plays a single iteration. Using a tiny duration instead of <code>none</code> keeps <code>animationend</code>/<code>transitionend</code> events firing, so JavaScript that waits for them still works. You can test it yourself: DevTools → ⋮ → More tools → <strong>Rendering</strong> → "Emulate CSS media feature prefers-reduced-motion".</p>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Build a three-question FAQ. Clicking a question toggles a class on its item: the answer opens with the <code>grid-template-rows</code> trick in 300&nbsp;ms, and a "▾" icon rotates 180° with <code>transform</code>. Add a "Copy link" button that shows a "Copied!" toast with a slide-in keyframe animation; after 2 seconds add a <code>leaving</code> class that fades it out, and remove it from the DOM on <code>transitionend</code> (opacity only). Finish with a <code>prefers-reduced-motion</code> block.</p>
<p><strong>Done when:</strong> the answer's height visibly animates both ways; DevTools' Performance recording shows no purple Layout blocks while the icon rotates; after the toast fades, <code>document.querySelectorAll('.toast').length</code> is 0; and with reduced motion emulated in the Rendering panel, everything changes instantly. Code Lab module 12.2 grades the CSS of this exercise.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">transition</span><span class="v">chuyển cảnh — đi mượt từ giá trị cũ sang giá trị mới khi thuộc tính đổi.</span></div>
  <div class="kv"><span class="k">timing function / easing</span><span class="v">hàm thời gian — đường cong tốc độ (ease, linear, ease-out…).</span></div>
  <div class="kv"><span class="k">keyframes</span><span class="v">khung hình chính — các mốc của một animation có tên.</span></div>
  <div class="kv"><span class="k">fill-mode</span><span class="v">chế độ giữ — giữ trạng thái đầu/cuối trước và sau animation.</span></div>
  <div class="kv"><span class="k">interpolate</span><span class="v">nội suy — tính các giá trị ở giữa hai số.</span></div>
  <div class="kv"><span class="k">layout / paint / composite</span><span class="v">bố cục / vẽ / ghép lớp — ba giai đoạn dựng mỗi khung hình.</span></div>
  <div class="kv"><span class="k">jank</span><span class="v">giật — animation rớt khung hình, không mượt.</span></div>
  <div class="kv"><span class="k">reduced motion</span><span class="v">giảm chuyển động — cài đặt hệ điều hành cho người nhạy cảm với chuyển động.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A transition animates between two states when a property changes; name the properties, keep durations around 100–400&nbsp;ms.</li>
  <li><code>ease</code> moves fast then slows; <code>ease-out</code> suits elements entering the screen.</li>
  <li><code>auto</code> cannot be interpolated — animate <code>grid-template-rows: 0fr → 1fr</code> instead of height.</li>
  <li><code>@keyframes</code> for loops and multi-step motion; <code>fill: both</code> to keep start/end states.</li>
  <li>Animate <code>transform</code> and <code>opacity</code>; layout properties cost layout every frame.</li>
  <li><code>transitionend</code> fires once per property; handle reduced motion for every animation.</li>
</ul>
${nguon('📘', 'web.dev — Learn CSS: Transitions and Animations', 'Two short chapters with live demos of every property', 'https://web.dev/learn/css/transitions')}
${nguon('📗', 'MDN — prefers-reduced-motion', 'What the setting is, who uses it, and how to test it', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion')}
${lienKet({ khoa: 'react', bai: 'rx-12-2-transition', title: 'React 12.2 — useTransition and useDeferredValue', sub: 'The other meaning of "transition": keeping typing responsive while a list re-renders', cta: 'Open lesson' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-17-5-core-web-vitals', title: 'Next.js 17.5 — Core Web Vitals', sub: 'How layout-shifting animations hurt the CLS score Google measures', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Chuyển động biết giải thích, luôn mượt, và tắt được</h2>
<p class="lead">Học xong bài này bạn làm được nút đổi màu mượt mà, mở panel accordion có chiều cao chuyển động, dựng spinner chờ tải và một thông báo trượt vào, gỡ phần tử ngay sau khi nó mờ đi, và cho tất cả tự tắt với người đã bảo máy tính "giảm chuyển động". Vì sao cần: chuyển động là cách giao diện giải thích thay đổi — cái gì vừa xuất hiện, nó đến từ đâu, cái gì vừa được lưu. Làm dở thì chậm, giật trên điện thoại, hoặc khiến vài người dùng khó chịu thật sự về thể chất. Mọi ví dụ dưới đây được đo theo từng khung hình trong Chromium.</p>

<h3>Bước 1 — một transition, đo thật</h3>
<p><strong>Transition (chuyển cảnh)</strong> bảo trình duyệt: "khi thuộc tính này đổi, đừng nhảy — đi từ giá trị cũ sang giá trị mới trong chừng này thời gian".</p>
${ma('html', CODE['12-2/transition-sample.html'], [7, 18])}
${ra(OUT['12-2/transition-sample'])}
<p>Thêm class <code>wide</code> đổi <code>width</code> từ 100&nbsp;px lên 300&nbsp;px, và transition trải thay đổi đó ra một giây. Trang đọc bề rộng thật ở 0, 250, 500, 750 và 1000&nbsp;ms. Với <code>linear</code> thanh dài thêm đều 50&nbsp;px mỗi phần tư. Với <code>ease</code> (mặc định) nó đã tới 182&nbsp;px sau một phần tư thời gian và nhích chậm ở đoạn cuối — khởi đầu nhanh, dừng nhẹ nhàng, giống cách vật thể thật chuyển động.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">transition-property</span><span class="v">Animate cái gì: <code>width</code>, <code>background-color</code>, <code>transform</code>… (tránh <code>all</code>, xem bẫy bên dưới).</span></div>
  <div class="kv"><span class="k">transition-duration</span><span class="v">Bao lâu. 100–200&nbsp;ms cho hover và bấm, 200–400&nbsp;ms cho menu và panel.</span></div>
  <div class="kv"><span class="k">transition-timing-function</span><span class="v">Đường cong tốc độ: <code>ease</code>, <code>linear</code>, <code>ease-in</code>, <code>ease-out</code> (hợp nhất cho thứ đi vào), <code>cubic-bezier(…)</code>.</span></div>
  <div class="kv"><span class="k">transition-delay</span><span class="v">Chờ trước khi bắt đầu — hữu ích cho danh sách xuất hiện so le.</span></div>
</div>
<p>Cú pháp rút gọn gộp vào một dòng: <code>transition: background-color 200ms ease-out;</code>, và nhiều transition cách nhau bằng dấu phẩy: <code>transition: transform 300ms ease, opacity 300ms ease;</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>transition: all</code>.</strong> Nó animate mọi thuộc tính thay đổi, kể cả những thứ bạn không định (đổi màu khi sang chế độ tối, một thuộc tính bố cục làm trang nhảy lung tung) và bắt trình duyệt theo dõi mọi thuộc tính. Hãy gọi tên đúng thuộc tính bạn muốn.</p></div>

<h3>Bước 2 — vì sao <code>height: auto</code> không animate (và cách sửa)</h3>
${ma('html', CODE['12-2/height-auto.html'], [7, 21])}
${ra(OUT['12-2/height-auto'])}
<p>Cột trái của output là panel đầu tiên. Ngay thời điểm 0 nó đã cao đủ 104&nbsp;px: trình duyệt nội suy được giữa hai <em>con số</em>, mà <code>auto</code> không phải con số — nó nghĩa là "nội dung cần bao nhiêu thì bấy nhiêu", chỉ biết được sau khi tính bố cục. Không có gì để nội suy nên giá trị nhảy luôn.</p>
<p>Panel thứ hai animate <code>grid-template-rows</code> từ <code>0fr</code> tới <code>1fr</code>. Phân số là số, nên trình duyệt tính được từng khung: 29, 55, 81, 104&nbsp;px. Hàng grid duy nhất giãn từ không tới chiều cao tự nhiên của nội dung. Phần tử bên trong cần <code>min-height: 0</code> (và thường <code>overflow: hidden</code>) để được phép co nhỏ hơn nội dung.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lớp bọc là grid</span><span class="lz-d"><code>display: grid; grid-template-rows: 0fr;</code> — một hàng, đang gập.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Con được co</span><span class="lz-d"><code>min-height: 0; overflow: hidden;</code> trên đứa con duy nhất.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mở = 1fr</span><span class="lz-d">Bật một class đặt <code>grid-template-rows: 1fr</code>; transition lo phần còn lại.</span></div>
</div>

<h3>Bước 3 — animation với <code>@keyframes</code></h3>
${ma('html', CODE['12-2/keyframes.html'], [8, 26])}
${ra(OUT['12-2/keyframes'])}
<p><strong>Animation</strong> được định nghĩa riêng bằng <code>@keyframes tên { … }</code> và gắn vào bằng <code>animation: tên thời-lượng hàm-thời-gian số-lần fill-mode</code>. Trang hỏi trình duyệt các animation đang chạy bằng <code>document.getAnimations()</code>: spinner xoay mỗi 800&nbsp;ms mãi mãi (<code>Infinity</code>), toast trượt vào một lần. <code>fill: both</code> nghĩa là "hiện khung đầu trước khi animation bắt đầu và giữ khung cuối sau khi kết thúc" — thiếu nó, một toast có độ trễ sẽ loé lên ở vị trí cuối trước khi chạy. Ảnh chụp ở slide 6 được chụp giữa lúc animation đang chạy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng transition khi…</span><span class="v">có hai trạng thái (đóng ⇄ mở), thay đổi được kích hoạt (hover, focus, một class), và nên tự đảo ngược.</span></div>
  <div class="kv"><span class="k">Dùng @keyframes khi…</span><span class="v">có hơn hai bước, cần lặp (spinner, hiệu ứng skeleton), hoặc tự chạy khi tải trang.</span></div>
</div>

<h3>Bước 4 — thuộc tính rẻ và thuộc tính đắt</h3>
<p>Mỗi khung hình, trình duyệt có thể phải chạy tới ba giai đoạn: <strong>layout</strong> (tính kích thước, vị trí), <strong>paint</strong> (vẽ điểm ảnh) và <strong>composite</strong> (ghép các lớp đã vẽ). Đổi <code>left</code>, <code>top</code>, <code>width</code> hay <code>margin</code> kích cả ba. Đổi <code>transform</code> hay <code>opacity</code> thường chỉ kích bước ghép lớp, có thể chạy trên GPU.</p>
${ma('html', CODE['12-2/left-vs-transform.html'], [21, 40])}
${ra(OUT['12-2/left-vs-transform'])}
<p>Bài thử di chuyển 400 chấm trong 60 khung hình hai lần và buộc trình duyệt cập nhật bố cục sau mỗi khung. Di chuyển bằng <code>transform</code> mất khoảng một nửa thời gian so với <code>left</code> trên máy này, vì không phải tính lại bố cục. Trên một điện thoại tầm trung, khoảng cách đó là ranh giới giữa 60 khung hình mượt mỗi giây và một animation giật thấy rõ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — animate thuộc tính bố cục.</strong> Trượt ngăn kéo bằng <code>left: -300px → 0</code> hay phóng to thẻ bằng <code>width</code> trông ổn trên laptop của bạn và giật trên điện thoại rẻ. Di chuyển bằng <code>transform: translate(…)</code>, phóng bằng <code>transform: scale(…)</code>, mờ dần bằng <code>opacity</code>. Kiểm trong Chrome DevTools: bảng Performance → ghi → tìm các khối "Layout" màu tím trong lúc animation chạy.</p></div>

<h3>Bước 5 — chờ transition kết thúc</h3>
${ma('html', CODE['12-2/transitionend.html'], [16, 30])}
${ra(OUT['12-2/transitionend'])}
<p>Mẫu hay gặp: khi người dùng tắt một cảnh báo, cho nó mờ đi rồi gỡ khỏi DOM. <code>transitionend</code> bắn khi một transition kết thúc — <em>mỗi thuộc tính một lần</em>. Cả opacity và transform đều được animate, nên hai sự kiện tới khoảng 300&nbsp;ms sau cú bấm. Handler chỉ hành động với <code>opacity</code>; hành động với cả hai sẽ cố gỡ phần tử hai lần (hoặc chạy callback hai lần).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>transitionend</code> không bao giờ tới.</strong> Nếu thuộc tính không thật sự đổi (class đã có sẵn), nếu phần tử bị ẩn bằng <code>display: none</code>, hoặc nếu chế độ giảm chuyển động đặt thời lượng bằng không ở vài cấu hình, sẽ không có sự kiện nào và phần dọn dẹp của bạn không bao giờ chạy. Dùng <code>Promise.all(el.getAnimations().map((a) =&gt; a.finished))</code> hoặc thêm một hẹn giờ dự phòng cho đoạn code <em>bắt buộc</em> phải chạy.</p></div>

<h3>Bước 6 — tôn trọng <code>prefers-reduced-motion</code></h3>
<p>Hệ điều hành có cài đặt "giảm chuyển động" (Windows: Animation effects; macOS/iOS: Reduce motion). Một số người cần nó vì chuyển động lớn gây chóng mặt hay buồn nôn (rối loạn tiền đình). Trình duyệt đưa nó ra thành một media query.</p>
${ma('css', CODE['12-2/reduced-motion.css'])}
${ra(OUT_RM)}
<p>Cùng một trang được mở hai lần trong Chromium, một lần bình thường và một lần giả lập giảm chuyển động. Ở lần thứ hai mọi thời lượng animation và transition co về <code>1e-05s</code> (0,01&nbsp;ms) và spinner chỉ chạy một vòng. Dùng thời lượng cực nhỏ thay vì <code>none</code> giữ cho sự kiện <code>animationend</code>/<code>transitionend</code> vẫn bắn, nên JavaScript đang chờ chúng vẫn chạy. Bạn tự thử được: DevTools → ⋮ → More tools → <strong>Rendering</strong> → "Emulate CSS media feature prefers-reduced-motion".</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Dựng một FAQ ba câu hỏi. Bấm vào câu hỏi thì bật một class trên mục của nó: câu trả lời mở bằng mẹo <code>grid-template-rows</code> trong 300&nbsp;ms, và icon "▾" xoay 180° bằng <code>transform</code>. Thêm nút "Sao chép liên kết" hiện toast "Đã chép!" bằng một animation keyframe trượt vào; sau 2 giây thêm class <code>leaving</code> cho nó mờ đi, và gỡ nó khỏi DOM khi <code>transitionend</code> (chỉ opacity). Kết thúc bằng một khối <code>prefers-reduced-motion</code>.</p>
<p><strong>Xong khi:</strong> chiều cao câu trả lời chuyển động thấy rõ cả hai chiều; bản ghi Performance của DevTools không có khối Layout tím khi icon xoay; sau khi toast mờ đi, <code>document.querySelectorAll('.toast').length</code> là 0; và khi giả lập giảm chuyển động trong bảng Rendering, mọi thứ đổi tức thì. Code Lab module 12.2 chấm phần CSS của bài này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">transition</span><span class="v">chuyển cảnh — đi mượt từ giá trị cũ sang giá trị mới khi thuộc tính đổi.</span></div>
  <div class="kv"><span class="k">timing function / easing</span><span class="v">hàm thời gian — đường cong tốc độ (ease, linear, ease-out…).</span></div>
  <div class="kv"><span class="k">keyframes</span><span class="v">khung hình chính — các mốc của một animation có tên.</span></div>
  <div class="kv"><span class="k">fill-mode</span><span class="v">chế độ giữ — giữ trạng thái đầu/cuối trước và sau animation.</span></div>
  <div class="kv"><span class="k">interpolate</span><span class="v">nội suy — tính các giá trị ở giữa hai số.</span></div>
  <div class="kv"><span class="k">layout / paint / composite</span><span class="v">bố cục / vẽ / ghép lớp — ba giai đoạn dựng mỗi khung hình.</span></div>
  <div class="kv"><span class="k">jank</span><span class="v">giật — animation rớt khung hình, không mượt.</span></div>
  <div class="kv"><span class="k">reduced motion</span><span class="v">giảm chuyển động — cài đặt hệ điều hành cho người nhạy cảm với chuyển động.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Transition animate giữa hai trạng thái khi thuộc tính đổi; gọi tên thuộc tính, giữ thời lượng quanh 100–400&nbsp;ms.</li>
  <li><code>ease</code> nhanh rồi chậm dần; <code>ease-out</code> hợp với phần tử đi vào màn hình.</li>
  <li><code>auto</code> không nội suy được — animate <code>grid-template-rows: 0fr → 1fr</code> thay cho height.</li>
  <li><code>@keyframes</code> cho vòng lặp và chuyển động nhiều bước; <code>fill: both</code> để giữ trạng thái đầu/cuối.</li>
  <li>Animate <code>transform</code> và <code>opacity</code>; thuộc tính bố cục tốn một lần layout mỗi khung.</li>
  <li><code>transitionend</code> bắn mỗi thuộc tính một lần; xử lý giảm chuyển động cho mọi animation.</li>
</ul>
${nguon('📘', 'web.dev — Learn CSS: Transitions and Animations', 'Hai chương ngắn có demo trực tiếp cho mọi thuộc tính', 'https://web.dev/learn/css/transitions')}
${nguon('📗', 'MDN — prefers-reduced-motion', 'Cài đặt này là gì, ai dùng, và cách kiểm thử', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion')}
${lienKet({ khoa: 'react', bai: 'rx-12-2-transition', title: 'React 12.2 — useTransition và useDeferredValue', sub: 'Nghĩa khác của "transition": giữ ô gõ phản hồi nhanh trong khi danh sách render lại', cta: 'Mở bài' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-17-5-core-web-vitals', title: 'Next.js 17.5 — Core Web Vitals', sub: 'Animation làm xô lệch bố cục làm hỏng điểm CLS mà Google đo thế nào', cta: 'Mở bài' })}
</div>
`,
};
