/**
 * Bài 3.5 — Thiết kế responsive (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/3-5; _demo/_t3/chay.mjs dùng điện thoại
 * giả lập iPhone 13 và ba bề rộng màn hình). Deck: scripts/slides-src/wf-3-5.mjs (10 slide, WF/v1/wf-3-5). Code Lab: module 3.5 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-3-5', 'Responsive design', 'Thiết kế responsive', [
  [1, 'Responsive design',
    '<p>Most people will visit your site on a phone. Responsive design means one page that works at every size, not a separate mobile site. Today we use a real phone emulator and three screen widths to see what actually changes.</p>',
    '<p>Đa số người dùng sẽ ghé trang của bạn bằng điện thoại. Thiết kế responsive nghĩa là một trang chạy tốt ở mọi kích cỡ, không phải một trang di động riêng. Hôm nay ta dùng điện thoại giả lập và ba bề rộng màn hình để xem điều gì thật sự thay đổi.</p>'],
  [2, 'After this lesson you can…',
    '<p>The biggest win is the first: one line in the <code>head</code> decides whether your layout has 980 or 390 pixels to work with. The rest are habits: start from the phone, use fluid units, and test by dragging the window rather than trusting a screenshot.</p>',
    '<p>Thành quả lớn nhất là điều đầu tiên: một dòng trong <code>head</code> quyết định bố cục có 980 hay 390 điểm ảnh để làm việc. Phần còn lại là thói quen: bắt đầu từ điện thoại, dùng đơn vị co giãn, và kiểm bằng cách kéo cửa sổ thay vì tin một ảnh chụp.</p>'],
  [3, 'The viewport tag',
    '<p>The same page on an emulated 390-pixel iPhone. Without the tag, the phone pretends to be a 980-pixel desktop and zooms out, so text is tiny. With it, the layout gets the real width. Every page needs this line; it is why you typed it in Lesson 2.1.</p>',
    '<p>Cùng một trang trên iPhone 390 điểm ảnh giả lập. Thiếu thẻ này, điện thoại giả vờ là màn hình desktop 980 điểm ảnh rồi thu nhỏ, nên chữ bé tí. Có nó, bố cục nhận đúng bề rộng thật. Trang nào cũng cần dòng này; đó là lý do bạn đã gõ nó ở Bài 2.1.</p>'],
  [4, 'Media queries',
    '<p>A media query applies rules only when a condition is true. Three widths of the same page: one column on the phone, two on the tablet, three plus a sidebar on the laptop. The output shows which queries matched at each width, read with <code>matchMedia</code>.</p>',
    '<p>Media query chỉ áp dụng luật khi một điều kiện đúng. Ba bề rộng của cùng một trang: một cột trên điện thoại, hai trên máy bảng, ba cột kèm thanh bên trên laptop. Output cho thấy query nào khớp ở mỗi bề rộng, đọc bằng <code>matchMedia</code>.</p>'],
  [5, 'Mobile first',
    '<p>Write the phone layout as your base, with no media query, and then add to it with <code>min-width</code>. Phones are the hard case: if a design fits there, widening it is easy. It also means phones download and process the least CSS. Going the other way means undoing things.</p>',
    '<p>Viết bố cục điện thoại làm nền, không media query, rồi bổ sung bằng <code>min-width</code>. Điện thoại là trường hợp khó: thiết kế đã vừa ở đó thì mở rộng rất dễ. Nó cũng có nghĩa điện thoại xử lý ít CSS nhất. Đi theo hướng ngược lại nghĩa là phải đi gỡ từng thứ.</p>'],
  [6, 'Fluid units',
    '<p>Media queries jump; fluid values glide. <code>clamp</code> gives a size with a floor and a ceiling: the heading stays at 20 pixels on a small phone, grows with the window, and stops at 40. <code>min</code> caps a width. Together they remove many breakpoints.</p>',
    '<p>Media query thì nhảy bậc; giá trị co giãn thì trượt mượt. <code>clamp</code> cho một kích thước có sàn và trần: tiêu đề giữ 20 điểm ảnh trên điện thoại nhỏ, lớn dần theo cửa sổ, và dừng ở 40. <code>min</code> giới hạn bề rộng. Cùng nhau chúng bỏ được nhiều breakpoint.</p>'],
  [7, 'Images and tables',
    '<p>Two classic overflows. An 800-pixel image in a 300-pixel column pokes out; <code>max-width: 100%</code> fixes it, and the height follows. A wide table cannot shrink, so it gets a wrapper that scrolls by itself, and the page stays still.</p>',
    '<p>Hai kiểu tràn kinh điển. Ảnh 800 điểm ảnh trong cột 300 thò ra ngoài; <code>max-width: 100%</code> sửa được, chiều cao tự theo. Bảng rộng không co được, nên nó có một lớp bọc tự cuộn, và trang vẫn đứng yên.</p>'],
  [8, 'Touch is not a mouse',
    '<p>Phones have no hover, and fingers are bigger than pointers. Tap targets should be at least 44 pixels. Anything revealed only on hover is hidden on a phone. <code>(hover: hover)</code> lets you apply hover styles only where they make sense.</p>',
    '<p>Điện thoại không có hover, và ngón tay to hơn con trỏ. Vùng bấm nên ít nhất 44 điểm ảnh. Thứ chỉ hiện khi hover sẽ bị giấu trên điện thoại. <code>(hover: hover)</code> giúp bạn chỉ áp kiểu hover ở nơi có ý nghĩa.</p>'],
  [9, 'How to test',
    '<p>Do not trust one screenshot. Drag the window from wide to narrow and watch for the moment something breaks; that is where a breakpoint belongs. Use the device toolbar in DevTools, and test on a real phone. And the Console can tell you whether the page overflows.</p>',
    '<p>Đừng tin một ảnh chụp. Kéo cửa sổ từ rộng tới hẹp và canh lúc có gì đó vỡ; breakpoint nên đặt ở đó. Dùng thanh thiết bị trong DevTools, và thử trên điện thoại thật. Console cũng cho biết trang có bị tràn không.</p>'],
  [10, 'Summary & practice',
    '<p>The practice takes one of your earlier pages and makes it work from 320 pixels up. "Done when" is a measurement: no horizontal overflow at four widths, plus readable text and reachable buttons.</p>',
    '<p>Bài luyện lấy một trang bạn đã làm và cho nó chạy từ 320 điểm ảnh trở lên. "Xong khi" là một phép đo: không tràn ngang ở bốn bề rộng, cộng chữ đọc được và nút bấm tới được.</p>'],
]);

export default {
  title: '3.5 — Responsive design: one page, every screen|||3.5 — Thiết kế responsive: một trang, mọi màn hình',
  slug: 'wf-3-5-responsive',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/VQraviuwbzU', durationSeconds: 0 },
  description: 'Thẻ viewport trên điện thoại giả lập (980px so với 390px), media query và mobile first đo ở ba bề rộng, đơn vị co giãn clamp/min, ảnh và bảng không tràn, cảm ứng khác chuột, breakpoint theo nội dung, cách kiểm và phát hiện tràn ngang.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>One page, every screen</h2>
<p class="lead">After this lesson you can make a page fit any screen from a small phone to a wide monitor: you know the one tag every page needs, how media queries work, why you write the phone version first, how to use fluid sizes, how to stop images and tables from overflowing, and how to test it all. You need this because well over half of web traffic comes from phones. A page that needs pinching and zooming loses most visitors, and search engines rank the mobile version of your site.</p>

<h3>Step 1 — the viewport tag</h3>
<p>Before responsive design, phones had a problem: all websites were built for desktops. So phones pretend to be about 980 pixels wide and zoom out. Here is the same page on an emulated iPhone, without and with one line:</p>
${ma('html', CODE['3-5/co-viewport.html'], [4, 4])}
${ra(OUT['_t3/out/viewport'])}
<p>Without the tag the layout has 980 pixels and everything is tiny (left screenshot on slide 3). With <code>width=device-width</code> it gets the real 390. Every media query in this lesson depends on it: without the tag, a phone reports 980, and your phone styles never run. If responsive CSS "does nothing on my phone", check this first.</p>
<p>Note that these pixels are <strong>CSS pixels</strong>. A 390-CSS-pixel iPhone has about 1170 physical pixels; that is what <code>srcset</code> from Lesson 2.2 handles.</p>

<h3>Step 2 — start flexible</h3>
<p>Much of responsive design needs no special rules. Normal HTML is already responsive: text wraps and blocks fill the width. It is fixed sizes that break it. Three habits go a long way:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Use <code>max-width</code>, not <code>width</code></span><span class="lz-d">A box can shrink below it on a phone.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Let Flexbox wrap and Grid fit</span><span class="lz-d"><code>flex-wrap</code> and <code>auto-fit</code> from the last two lessons need no media queries.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Use <code>rem</code></span><span class="lz-d">Sizes that follow the reader's text setting.</span></div>
</div>

<h3>Step 3 — media queries</h3>
<p>When the layout really has to change, a <strong>media query</strong> applies a block of CSS only if a condition is true:</p>
<pre><code class="language-css">@media (min-width: 640px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}</code></pre>
<p>This page has two <strong>breakpoints</strong>. Note that the base rules, outside any query, are for the phone:</p>
${ma('css', CODE['3-5/mobile-first.html'], [8, 18])}
<p>We loaded it at three widths and asked the browser what is true at each one:</p>
${ra(OUT['_t3/out/mobile-first'])}
<p>The screenshots on slide 4 show the three results. The HTML is identical; only the CSS rules that apply are different. Media queries add no specificity, so a query placed earlier in the file can be overridden by a later normal rule. Keep them after the rules they change.</p>

<h3>Step 4 — mobile first</h3>
<p>You can write queries in two directions. <strong>Desktop first</strong> starts with the big layout and uses <code>max-width</code> to undo things. <strong>Mobile first</strong> starts with the small layout and uses <code>min-width</code> to add things. Prefer mobile first:</p>
<table>
<thead><tr><th></th><th>Mobile first (<code>min-width</code>)</th><th>Desktop first (<code>max-width</code>)</th></tr></thead>
<tbody>
<tr><td>Base CSS</td><td>The simple, one-column layout</td><td>The complex layout</td></tr>
<tr><td>Queries</td><td>Add features as space appears</td><td>Remove and undo features</td></tr>
<tr><td>Phones</td><td>Just the base rules</td><td>Base rules, then overrides</td></tr>
<tr><td>Design pressure</td><td>Decide what truly matters</td><td>Everything gets squeezed</td></tr>
</tbody>
</table>
<p><strong>Where to put breakpoints?</strong> Not at specific devices. Drag the window narrower until the layout starts to look wrong, and put a breakpoint there. Common values such as 640, 768, 1024 and 1280 are fine as a starting point. Prefer <code>rem</code> in serious projects (<code>min-width: 40rem</code>), so that a reader with bigger text gets the simpler layout sooner.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>max-width</code> queries in the wrong order.</strong> Mixing <code>min-width</code> and <code>max-width</code>, or writing them in the wrong order, makes later rules silently override earlier ones. Since media queries add no specificity, plain source order decides. Pick one direction for a project; for mobile first, go from small to large.</p></div>

<h3>Step 5 — fluid values: no jumps</h3>
${ma('css', CODE['3-5/don-vi.html'], [5, 7])}
${ra(OUT['3-5/don-vi'])}
<div class="kv-grid">
  <div class="kv"><span class="k">clamp(min, ideal, max)</span><span class="v">The ideal value, kept between a floor and a ceiling. Here the heading runs from 20 to 40 pixels smoothly.</span></div>
  <div class="kv"><span class="k">min(a, b)</span><span class="v">The smaller of the two. <code>min(90%, 600px)</code> is a page width with side margins on phones.</span></div>
  <div class="kv"><span class="k">max(a, b)</span><span class="v">The larger of the two. A guaranteed minimum.</span></div>
  <div class="kv"><span class="k">vw, vh</span><span class="v">A share of the window. Mix with <code>rem</code> in <code>clamp</code> so that zooming still works.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>100vh</code> on a phone.</strong> On mobile browsers the address bar slides away while scrolling, and <code>100vh</code> uses the largest possible height, so a "full-screen" section is cut off at the bottom when the bar is visible. Use <code>100dvh</code> (dynamic viewport height), which follows the real visible area, or <code>min-height</code>.</p></div>

<h3>Step 6 — images and tables</h3>
${ma('css', CODE['3-5/anh-co-gian.html'], [7, 9])}
${ra(OUT['3-5/anh-co-gian'])}
<p><code>max-width: 100%; height: auto;</code> lets an image shrink with its container and keep its ratio. Together with the <code>width</code> and <code>height</code> attributes from Lesson 2.2, you get no overflow and no layout shift. A table cannot shrink below its content, so it needs a wrapper with <code>overflow-x: auto</code>: the table scrolls inside, and the page stays still.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — one wide element ruins the whole page.</strong> A single overflowing element (a table, a long URL, a fixed <code>width: 500px</code>) makes the entire page scroll sideways on a phone. To find it, run this in the Console:</p>
<pre><code class="language-javascript">[...document.querySelectorAll('*')].filter((el) =&gt; el.getBoundingClientRect().right &gt; innerWidth)</code></pre>
<p>It lists every element sticking out past the right edge. Then look for what is forcing the width. Do not hide the symptom with <code>body { overflow-x: hidden; }</code>.</p></div>

<h3>Step 7 — a finger is not a mouse</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">No hover</span><span class="v">A menu that opens on hover cannot be opened on a phone. Use a click.</span></div>
  <div class="kv"><span class="k">Bigger targets</span><span class="v">At least 44 by 44 CSS pixels for buttons and links in a row.</span></div>
  <div class="kv"><span class="k">Inputs</span><span class="v">On iOS, text fields under 16px make the browser zoom in on focus.</span></div>
  <div class="kv"><span class="k">Reachability</span><span class="v">Important actions fit better at the bottom of a phone screen.</span></div>
</div>
<pre><code class="language-css">@media (hover: hover) {           /* only on devices with a real pointer */
  .btn:hover { background: #17406f; }
}
@media (prefers-reduced-motion: reduce) { /* respect the user's system setting */
  * { animation: none; transition: none; }
}</code></pre>
<p>Media queries are not only about width: they can also read the user's preferences, such as <code>prefers-color-scheme</code> (Lesson 12.4) and <code>prefers-reduced-motion</code> (Lesson 12.2).</p>

<h3>Step 8 — how to test</h3>
<ol>
<li><strong>Drag the window</strong> slowly from wide to 320 pixels. Whatever breaks tells you where to work.</li>
<li><strong>DevTools → device toolbar</strong> (Ctrl/Cmd+Shift+M): choose a phone or type a width; it also emulates touch.</li>
<li><strong>A real phone</strong>: emulators do not show thumb reach, real speed or the moving address bar. Find your computer's IP and open <code>http://192.168.x.x:3000</code> on the same Wi-Fi.</li>
<li><strong>Measure:</strong> <code>document.documentElement.scrollWidth &gt; innerWidth</code> must be <code>false</code> at each size.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — make a real page responsive</strong></p>
<p>Take your shop page from Lesson 3.4 (or the recipes from 2.2):</p>
<ol>
<li>Check the viewport tag. Add <code>img { max-width: 100%; height: auto; }</code>.</li>
<li>Write the phone layout as the base: one column, and the sidebar below or hidden behind a <code>details</code>.</li>
<li>Add two <code>min-width</code> breakpoints, chosen by dragging the window.</li>
<li>Set the heading with <code>clamp</code>, and the content width with <code>min(90%, 1100px)</code>.</li>
<li>Make buttons at least 44 pixels tall.</li>
</ol>
<p>Hint: redefine <code>grid-template-areas</code> in one media query instead of moving elements around.</p>
<p><strong>Done when:</strong> <code>document.documentElement.scrollWidth &gt; innerWidth</code> prints <code>false</code> at 320, 390, 768 and 1280 pixels; all text is readable with no zooming; every control can be pressed with a thumb; and removing the viewport tag visibly breaks it, so you know the tag matters. Then Code Lab module 3.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">responsive design</span><span class="v">thiết kế đáp ứng — một trang, mọi màn hình.</span></div>
  <div class="kv"><span class="k">viewport</span><span class="v">khung nhìn — vùng trình duyệt hiển thị.</span></div>
  <div class="kv"><span class="k">CSS pixel</span><span class="v">điểm ảnh CSS — đơn vị logic, không phải điểm vật lý.</span></div>
  <div class="kv"><span class="k">media query</span><span class="v">điều kiện theo thiết bị.</span></div>
  <div class="kv"><span class="k">breakpoint</span><span class="v">điểm ngắt — bề rộng mà bố cục đổi.</span></div>
  <div class="kv"><span class="k">mobile first</span><span class="v">viết cho điện thoại trước, bổ sung dần.</span></div>
  <div class="kv"><span class="k">fluid</span><span class="v">co giãn liên tục theo kích thước.</span></div>
  <div class="kv"><span class="k">clamp()</span><span class="v">giá trị có sàn và trần.</span></div>
  <div class="kv"><span class="k">tap target</span><span class="v">vùng bấm — cần đủ lớn cho ngón tay.</span></div>
  <div class="kv"><span class="k">device toolbar</span><span class="v">thanh thiết bị — giả lập màn hình trong DevTools.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Without the viewport tag, a phone lays the page out at 980 pixels. Every page needs it.</li>
  <li>Flexible by default: <code>max-width</code>, <code>rem</code>, <code>flex-wrap</code>, <code>auto-fit</code>.</li>
  <li>Mobile first: phone rules as the base, <code>min-width</code> queries from small to large.</li>
  <li>Put breakpoints where the content breaks, not at device names.</li>
  <li><code>clamp()</code> and <code>min()</code> give smooth sizes; prefer <code>100dvh</code> on phones.</li>
  <li><code>img { max-width: 100%; height: auto; }</code>; wrap wide tables in <code>overflow-x: auto</code>.</li>
  <li>Phones have no hover and need 44-pixel targets.</li>
  <li>Drag the window, use the device toolbar and a real phone, and measure overflow.</li>
</ul>
${nguon('📗', 'MDN — Responsive design', 'The full picture, from viewport to media queries', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design')}
${nguon('📘', 'web.dev — Learn Responsive Design', 'A free course from Google', 'https://web.dev/learn/design')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-responsive', title: 'WED201c (Academy) — responsive design', sub: 'The same techniques in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Một trang, mọi màn hình</h2>
<p class="lead">Học xong bài này bạn làm được một trang vừa mọi màn hình từ điện thoại nhỏ tới màn hình rộng: bạn biết thẻ duy nhất mà trang nào cũng cần, media query hoạt động ra sao, vì sao viết bản điện thoại trước, dùng kích thước co giãn thế nào, ngăn ảnh và bảng tràn ra sao, và kiểm tất cả thế nào. Bạn cần điều này vì hơn một nửa lưu lượng web đến từ điện thoại. Một trang phải chụm ngón để phóng to sẽ mất phần lớn người xem, và công cụ tìm kiếm xếp hạng theo phiên bản di động của trang.</p>

<h3>Bước 1 — thẻ viewport</h3>
<p>Trước thời responsive, điện thoại có một vấn đề: mọi website đều làm cho desktop. Nên điện thoại giả vờ rộng khoảng 980 điểm ảnh rồi thu nhỏ lại. Đây là cùng một trang trên iPhone giả lập, không có và có một dòng:</p>
${ma('html', CODE['3-5/co-viewport.html'], [4, 4])}
${ra(OUT['_t3/out/viewport'])}
<p>Thiếu thẻ, bố cục có 980 điểm ảnh và mọi thứ bé tí (ảnh trái ở slide 3). Với <code>width=device-width</code> nó nhận đúng 390. Mọi media query trong bài này phụ thuộc vào nó: thiếu thẻ, điện thoại báo 980, và các kiểu cho điện thoại của bạn không bao giờ chạy. Nếu CSS responsive "không có tác dụng trên điện thoại", hãy kiểm điều này trước.</p>
<p>Lưu ý đây là <strong>điểm ảnh CSS</strong>. iPhone 390 điểm ảnh CSS có khoảng 1170 điểm ảnh vật lý; đó là việc của <code>srcset</code> ở Bài 2.2.</p>

<h3>Bước 2 — bắt đầu từ sự linh hoạt</h3>
<p>Phần lớn thiết kế responsive không cần luật đặc biệt. HTML thường vốn đã responsive: chữ tự xuống dòng, khối lấp đầy bề rộng. Kích thước cố định mới làm hỏng nó. Ba thói quen đi được rất xa:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dùng <code>max-width</code>, không dùng <code>width</code></span><span class="lz-d">Hộp co nhỏ hơn được trên điện thoại.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Để Flexbox xuống dòng, Grid tự vừa</span><span class="lz-d"><code>flex-wrap</code> và <code>auto-fit</code> ở hai bài trước không cần media query.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dùng <code>rem</code></span><span class="lz-d">Kích thước theo thiết lập chữ của người đọc.</span></div>
</div>

<h3>Bước 3 — media query</h3>
<p>Khi bố cục thật sự phải đổi, <strong>media query</strong> chỉ áp một khối CSS nếu một điều kiện đúng:</p>
<pre><code class="language-css">@media (min-width: 640px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}</code></pre>
<p>Trang này có hai <strong>breakpoint</strong>. Lưu ý các luật nền, nằm ngoài mọi query, là dành cho điện thoại:</p>
${ma('css', CODE['3-5/mobile-first.html'], [8, 18])}
<p>Ta tải nó ở ba bề rộng và hỏi trình duyệt điều gì đúng ở mỗi bề rộng:</p>
${ra(OUT['_t3/out/mobile-first'])}
<p>Ảnh chụp ở slide 4 cho thấy ba kết quả. HTML giống hệt; chỉ các luật CSS được áp dụng là khác. Media query không thêm độ cụ thể, nên query đặt sớm trong tệp có thể bị luật thường phía sau ghi đè. Hãy giữ chúng sau các luật mà chúng thay đổi.</p>

<h3>Bước 4 — mobile first</h3>
<p>Bạn viết query được theo hai hướng. <strong>Desktop first</strong> bắt đầu từ bố cục lớn và dùng <code>max-width</code> để gỡ bớt. <strong>Mobile first</strong> bắt đầu từ bố cục nhỏ và dùng <code>min-width</code> để thêm vào. Hãy chọn mobile first:</p>
<table>
<thead><tr><th></th><th>Mobile first (<code>min-width</code>)</th><th>Desktop first (<code>max-width</code>)</th></tr></thead>
<tbody>
<tr><td>CSS nền</td><td>Bố cục một cột đơn giản</td><td>Bố cục phức tạp</td></tr>
<tr><td>Query</td><td>Thêm tính năng khi có chỗ</td><td>Gỡ và hoàn tác tính năng</td></tr>
<tr><td>Điện thoại</td><td>Chỉ luật nền</td><td>Luật nền, rồi ghi đè</td></tr>
<tr><td>Áp lực thiết kế</td><td>Quyết định điều gì thật sự quan trọng</td><td>Mọi thứ bị nén lại</td></tr>
</tbody>
</table>
<p><strong>Đặt breakpoint ở đâu?</strong> Không theo thiết bị cụ thể. Kéo cửa sổ hẹp dần tới khi bố cục bắt đầu trông sai, và đặt breakpoint ở đó. Các giá trị phổ biến như 640, 768, 1024, 1280 ổn để bắt đầu. Dự án nghiêm túc nên dùng <code>rem</code> (<code>min-width: 40rem</code>), để người đọc chữ lớn sớm nhận bố cục đơn giản hơn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — query <code>max-width</code> sai thứ tự.</strong> Trộn <code>min-width</code> với <code>max-width</code>, hoặc viết sai thứ tự, khiến luật sau âm thầm ghi đè luật trước. Vì media query không thêm độ cụ thể, thứ tự trong nguồn quyết định. Hãy chọn một hướng cho dự án; với mobile first, đi từ nhỏ tới lớn.</p></div>

<h3>Bước 5 — giá trị co giãn: không nhảy bậc</h3>
${ma('css', CODE['3-5/don-vi.html'], [5, 7])}
${ra(OUT['3-5/don-vi'])}
<div class="kv-grid">
  <div class="kv"><span class="k">clamp(min, ideal, max)</span><span class="v">Giá trị lý tưởng, giữ giữa sàn và trần. Ở đây tiêu đề đi mượt từ 20 tới 40 điểm ảnh.</span></div>
  <div class="kv"><span class="k">min(a, b)</span><span class="v">Cái nhỏ hơn. <code>min(90%, 600px)</code> là bề rộng trang có lề hai bên trên điện thoại.</span></div>
  <div class="kv"><span class="k">max(a, b)</span><span class="v">Cái lớn hơn. Một mức tối thiểu chắc chắn.</span></div>
  <div class="kv"><span class="k">vw, vh</span><span class="v">Một phần của cửa sổ. Trộn với <code>rem</code> trong <code>clamp</code> để phóng to vẫn chạy.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>100vh</code> trên điện thoại.</strong> Trên trình duyệt di động, thanh địa chỉ trượt đi khi cuộn, và <code>100vh</code> dùng chiều cao lớn nhất có thể, nên phần "toàn màn hình" bị cắt ở đáy khi thanh còn hiện. Hãy dùng <code>100dvh</code> (chiều cao khung nhìn động), theo đúng vùng nhìn thấy, hoặc <code>min-height</code>.</p></div>

<h3>Bước 6 — ảnh và bảng</h3>
${ma('css', CODE['3-5/anh-co-gian.html'], [7, 9])}
${ra(OUT['3-5/anh-co-gian'])}
<p><code>max-width: 100%; height: auto;</code> cho ảnh co theo vùng chứa và giữ tỉ lệ. Cùng với thuộc tính <code>width</code> và <code>height</code> ở Bài 2.2, bạn vừa không tràn vừa không nhảy bố cục. Bảng không co nhỏ hơn nội dung, nên nó cần lớp bọc <code>overflow-x: auto</code>: bảng cuộn bên trong, trang đứng yên.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một phần tử rộng làm hỏng cả trang.</strong> Một phần tử tràn duy nhất (bảng, URL dài, <code>width: 500px</code> cố định) khiến cả trang cuộn ngang trên điện thoại. Để tìm nó, chạy dòng này trong Console:</p>
<pre><code class="language-javascript">[...document.querySelectorAll('*')].filter((el) =&gt; el.getBoundingClientRect().right &gt; innerWidth)</code></pre>
<p>Nó liệt kê mọi phần tử thò qua mép phải. Rồi tìm thứ đang ép bề rộng. Đừng che triệu chứng bằng <code>body { overflow-x: hidden; }</code>.</p></div>

<h3>Bước 7 — ngón tay không phải con chuột</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có hover</span><span class="v">Menu mở khi rê chuột không mở được trên điện thoại. Hãy dùng cú bấm.</span></div>
  <div class="kv"><span class="k">Vùng bấm lớn hơn</span><span class="v">Ít nhất 44 × 44 điểm ảnh CSS cho nút và liên kết liền nhau.</span></div>
  <div class="kv"><span class="k">Ô nhập</span><span class="v">Trên iOS, ô chữ dưới 16px khiến trình duyệt phóng to khi chạm vào.</span></div>
  <div class="kv"><span class="k">Tầm với</span><span class="v">Hành động quan trọng nằm phía dưới màn hình điện thoại sẽ dễ với hơn.</span></div>
</div>
<pre><code class="language-css">@media (hover: hover) {           /* chỉ trên thiết bị có con trỏ thật */
  .btn:hover { background: #17406f; }
}
@media (prefers-reduced-motion: reduce) { /* tôn trọng thiết lập của người dùng */
  * { animation: none; transition: none; }
}</code></pre>
<p>Media query không chỉ nói về bề rộng: chúng còn đọc được tuỳ chọn người dùng, như <code>prefers-color-scheme</code> (Bài 12.4) và <code>prefers-reduced-motion</code> (Bài 12.2).</p>

<h3>Bước 8 — cách kiểm</h3>
<ol>
<li><strong>Kéo cửa sổ</strong> từ từ từ rộng xuống 320 điểm ảnh. Chỗ nào vỡ cho bạn biết cần làm gì.</li>
<li><strong>DevTools → thanh thiết bị</strong> (Ctrl/Cmd+Shift+M): chọn điện thoại hoặc gõ bề rộng; nó còn giả lập cảm ứng.</li>
<li><strong>Điện thoại thật</strong>: giả lập không cho thấy tầm với của ngón cái, tốc độ thật hay thanh địa chỉ di chuyển. Tìm IP máy tính và mở <code>http://192.168.x.x:3000</code> trên cùng Wi-Fi.</li>
<li><strong>Đo:</strong> <code>document.documentElement.scrollWidth &gt; innerWidth</code> phải là <code>false</code> ở mọi cỡ.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — làm một trang thật thành responsive</strong></p>
<p>Lấy trang cửa hàng ở Bài 3.4 (hoặc công thức ở Bài 2.2):</p>
<ol>
<li>Kiểm thẻ viewport. Thêm <code>img { max-width: 100%; height: auto; }</code>.</li>
<li>Viết bố cục điện thoại làm nền: một cột, thanh bên xuống dưới hoặc giấu sau <code>details</code>.</li>
<li>Thêm hai breakpoint <code>min-width</code>, chọn bằng cách kéo cửa sổ.</li>
<li>Đặt tiêu đề bằng <code>clamp</code>, và bề rộng nội dung bằng <code>min(90%, 1100px)</code>.</li>
<li>Cho nút cao ít nhất 44 điểm ảnh.</li>
</ol>
<p>Gợi ý: định nghĩa lại <code>grid-template-areas</code> trong một media query thay vì di chuyển phần tử.</p>
<p><strong>Xong khi:</strong> <code>document.documentElement.scrollWidth &gt; innerWidth</code> in <code>false</code> ở 320, 390, 768 và 1280 điểm ảnh; mọi chữ đọc được mà không cần phóng to; mọi điều khiển bấm được bằng ngón cái; và xoá thẻ viewport làm trang hỏng rõ rệt, để bạn biết thẻ đó quan trọng. Sau đó làm module Code Lab 3.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">responsive design</span><span class="v">thiết kế đáp ứng — một trang, mọi màn hình.</span></div>
  <div class="kv"><span class="k">viewport</span><span class="v">khung nhìn — vùng trình duyệt hiển thị.</span></div>
  <div class="kv"><span class="k">CSS pixel</span><span class="v">điểm ảnh CSS — đơn vị logic, không phải điểm vật lý.</span></div>
  <div class="kv"><span class="k">media query</span><span class="v">điều kiện theo thiết bị.</span></div>
  <div class="kv"><span class="k">breakpoint</span><span class="v">điểm ngắt — bề rộng mà bố cục đổi.</span></div>
  <div class="kv"><span class="k">mobile first</span><span class="v">viết cho điện thoại trước, bổ sung dần.</span></div>
  <div class="kv"><span class="k">fluid</span><span class="v">co giãn liên tục theo kích thước.</span></div>
  <div class="kv"><span class="k">clamp()</span><span class="v">giá trị có sàn và trần.</span></div>
  <div class="kv"><span class="k">tap target</span><span class="v">vùng bấm — cần đủ lớn cho ngón tay.</span></div>
  <div class="kv"><span class="k">device toolbar</span><span class="v">thanh thiết bị — giả lập màn hình trong DevTools.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Thiếu thẻ viewport, điện thoại dựng trang ở 980 điểm ảnh. Trang nào cũng cần nó.</li>
  <li>Linh hoạt từ đầu: <code>max-width</code>, <code>rem</code>, <code>flex-wrap</code>, <code>auto-fit</code>.</li>
  <li>Mobile first: luật điện thoại làm nền, query <code>min-width</code> từ nhỏ tới lớn.</li>
  <li>Đặt breakpoint ở chỗ nội dung vỡ, không theo tên thiết bị.</li>
  <li><code>clamp()</code> và <code>min()</code> cho kích thước mượt; ưu tiên <code>100dvh</code> trên điện thoại.</li>
  <li><code>img { max-width: 100%; height: auto; }</code>; bọc bảng rộng trong <code>overflow-x: auto</code>.</li>
  <li>Điện thoại không có hover và cần vùng bấm 44 điểm ảnh.</li>
  <li>Kéo cửa sổ, dùng thanh thiết bị và điện thoại thật, và đo tràn ngang.</li>
</ul>
${nguon('📗', 'MDN — Responsive design', 'Bức tranh đầy đủ, từ viewport tới media query', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design')}
${nguon('📘', 'web.dev — Learn Responsive Design', 'Khoá miễn phí từ Google', 'https://web.dev/learn/design')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-responsive', title: 'WED201c (Academy) — thiết kế responsive', sub: 'Cùng các kỹ thuật trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
