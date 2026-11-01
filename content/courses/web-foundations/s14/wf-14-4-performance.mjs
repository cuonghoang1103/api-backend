/**
 * Bài 14.4 — Đo hiệu năng (nâng cấp 01/11/2026). Output: Chromium (Playwright, mạng + CPU bóp băng thông qua CDP) và
 * Lighthouse 13.6.0, chạy thật trong _demo/_t14/perf (ảnh sinh bằng make-images.mjs). Deck: scripts/slides-src/wf-14-4.mjs (11 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-14-4', 'Measuring performance', 'Đo hiệu năng', [
  [1, 'Measuring performance',
    '<p>The last lesson of the course measures what users feel: how fast the page appears, whether it jumps around, and how quickly it reacts. One page in three versions goes from a Lighthouse score of 64 to 99 — and every number on these slides was measured.</p>',
    '<p>Bài cuối của khoá đo thứ người dùng cảm nhận: trang hiện ra nhanh cỡ nào, có nhảy lung tung không, và phản hồi nhanh ra sao. Một trang ở ba phiên bản đi từ điểm Lighthouse 64 lên 99 — và mọi con số trên các slide này đều đo thật.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills: naming the Core Web Vitals, measuring with Lighthouse and with the browser’s own observers, fixing the three causes behind most slow pages, telling lab numbers from field numbers, and always measuring on a phone profile.</p>',
    '<p>Năm kỹ năng: gọi tên các Core Web Vitals, đo bằng Lighthouse và bằng bộ quan sát có sẵn của trình duyệt, sửa ba nguyên nhân đứng sau phần lớn các trang chậm, phân biệt số đo phòng lab với số đo thực tế, và luôn đo trên cấu hình điện thoại.</p>'],
  [3, 'Core Web Vitals',
    '<p>LCP asks when the main content appeared. CLS asks whether things jumped while loading. INP asks how quickly the page reacts to a tap. In the lab, where nobody taps, Total Blocking Time stands in for INP. Each has a "good" threshold that Google publishes and uses in search ranking.</p>',
    '<p>LCP hỏi khi nào nội dung chính hiện ra. CLS hỏi mọi thứ có nhảy khi đang tải không. INP hỏi trang phản hồi một lần chạm nhanh cỡ nào. Trong phòng lab, nơi không ai chạm, Total Blocking Time đứng thay cho INP. Mỗi chỉ số có một ngưỡng "tốt" mà Google công bố và dùng khi xếp hạng tìm kiếm.</p>'],
  [4, 'The slow page',
    '<p>Three problems you will meet on real sites: a 2.5-megabyte camera photo with no dimensions, a promotion banner inserted above the content after the page has started, and a third-party style script that blocks the main thread for 300 milliseconds.</p>',
    '<p>Ba vấn đề bạn sẽ gặp trên trang thật: một ảnh chụp từ máy ảnh 2,5 megabyte không khai kích thước, một banner khuyến mãi chèn lên trên nội dung sau khi trang đã bắt đầu hiện, và một script kiểu bên thứ ba chặn luồng chính 300 mili giây.</p>'],
  [5, 'Three versions, measured',
    '<p>On a phone-sized window with a slow network and a four-times slower CPU, the slow page shows its main content after 12 seconds and shifts by 0.2. The fixed versions show it in about a second with no shift. Lighthouse agrees: 64, 76 and 99. Why the middle version is only 76 is the most interesting part.</p>',
    '<p>Trên cửa sổ cỡ điện thoại, mạng chậm và CPU chậm bốn lần, trang chậm hiện nội dung chính sau 12 giây và xô lệch 0,2. Các phiên bản đã sửa hiện trong khoảng một giây và không xô lệch. Lighthouse đồng ý: 64, 76 và 99. Vì sao bản ở giữa chỉ được 76 là phần thú vị nhất.</p>'],
  [6, 'Fix 1: the image',
    '<p>The page displays the photo at phone width, so it never needed 2400 pixels. A 1200-pixel WebP is thirteen times smaller. Preloading it with high priority lets the browser start the download before it even reaches the image tag. On a phone network, fewer bytes means less time.</p>',
    '<p>Trang hiển thị ảnh ở bề rộng điện thoại, nên chưa bao giờ cần 2400 điểm ảnh. Một ảnh WebP 1200 điểm ảnh nhỏ hơn mười ba lần. Preload nó với độ ưu tiên cao giúp trình duyệt bắt đầu tải trước cả khi đọc tới thẻ ảnh. Trên mạng điện thoại, ít byte hơn nghĩa là ít thời gian hơn.</p>'],
  [7, 'Fix 2: reserve space',
    '<p>Layout shift happens when something appears above content that is already visible. Give images their dimensions so the browser knows their height before they load, and reserve room for anything inserted later. The banner still arrives after 800 milliseconds — but nothing moves.</p>',
    '<p>Xô lệch bố cục xảy ra khi có thứ xuất hiện phía trên nội dung đã hiển thị. Khai kích thước cho ảnh để trình duyệt biết chiều cao trước khi ảnh tải xong, và giữ chỗ cho mọi thứ chèn vào sau. Banner vẫn tới sau 800 mili giây — nhưng không có gì dịch chuyển.</p>'],
  [8, 'Fix 3: long tasks',
    '<p>The middle version only added <code>defer</code>: the 300 milliseconds of work still ran in one block, now after the first paint, so Lighthouse measured 1,150 milliseconds of blocking time. Splitting the work into ten-millisecond slices during idle time keeps every task short. Same work, score 99.</p>',
    '<p>Phiên bản giữa chỉ thêm <code>defer</code>: 300 mili giây công việc vẫn chạy thành một khối, giờ là sau lần vẽ đầu, nên Lighthouse đo được 1.150 mili giây bị chặn. Chia công việc thành các lát mười mili giây trong lúc rảnh giữ mọi tác vụ đều ngắn. Cùng một lượng việc, điểm 99.</p>'],
  [9, 'Lab vs field',
    '<p>Lab tools like Lighthouse simulate one device and network, which makes them perfect for comparing fixes. Field data comes from real visitors and is what Google ranks with, using the 75th percentile. A good lab score is a necessary first step, not the final answer.</p>',
    '<p>Công cụ phòng lab như Lighthouse mô phỏng một thiết bị và một mạng, nên hoàn hảo để so các bản sửa. Dữ liệu thực tế đến từ người truy cập thật và là thứ Google dùng để xếp hạng, theo phân vị 75. Điểm lab tốt là bước đầu cần thiết, không phải đáp án cuối.</p>'],
  [10, 'A checklist',
    '<p>Measure first, on a mobile profile. Fix images, then layout shifts, then the main thread. Re-measure after every change and keep the numbers, so you know which change helped — and so you can show it in an interview or a pull request.</p>',
    '<p>Đo trước, trên cấu hình điện thoại. Sửa ảnh, rồi xô lệch bố cục, rồi luồng chính. Đo lại sau mỗi thay đổi và giữ các con số, để biết thay đổi nào có tác dụng — và để trình bày được trong buổi phỏng vấn hay một pull request.</p>'],
  [11, 'Summary & practice',
    '<p>The practice is to measure, fix and re-measure a page of your own. The most important habit is the last line of "Done when": naming which change moved which number. That is the end of the course — and the start of every performance discussion you will have at work.</p>',
    '<p>Bài luyện là đo, sửa và đo lại một trang của chính bạn. Thói quen quan trọng nhất là dòng cuối của "Xong khi": gọi tên thay đổi nào làm dịch chuyển con số nào. Đó là điểm kết của khoá học — và là điểm khởi đầu của mọi cuộc bàn về hiệu năng bạn sẽ có khi đi làm.</p>'],
]);

export default {
  title: '14.4 — Measuring performance|||14.4 — Đo hiệu năng',
  slug: 'wf-14-4-performance',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Core Web Vitals (LCP, CLS, INP, TBT) bằng lời đơn giản, đo một trang ở ba phiên bản bằng Chromium bóp mạng + CPU và Lighthouse 13 (64 → 76 → 99), sửa ảnh quá lớn, giữ chỗ chống xô lệch, chia nhỏ tác vụ dài (defer chưa đủ), lab khác field, danh sách kiểm.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Measure what users feel, fix the biggest cause, measure again</h2>
<p class="lead">After this lesson you can explain the Core Web Vitals in plain words, measure a page with Lighthouse and with the browser's own performance APIs, fix the three causes behind most slow pages — oversized images, layout shifts and long main-thread tasks — and interpret the difference between lab and field data. Why it matters: users abandon slow pages, and Google uses these exact metrics when ranking search results. In this lesson one page goes from a Lighthouse score of 64 to 99, and every number was measured on a simulated phone, not guessed.</p>

<h3>Step 1 — the metrics, in plain words</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">LCP — Largest Contentful Paint</span><span class="v">"When did the main content appear?" The time until the biggest image or text block is drawn. Good: ≤ 2.5&nbsp;s.</span></div>
  <div class="kv"><span class="k">CLS — Cumulative Layout Shift</span><span class="v">"Did things jump while loading?" A score of how much visible content moved, and how far. Good: ≤ 0.1.</span></div>
  <div class="kv"><span class="k">INP — Interaction to Next Paint</span><span class="v">"When I tap, how fast does the page react?" Measured on real users' interactions. Good: ≤ 200&nbsp;ms.</span></div>
  <div class="kv"><span class="k">TBT — Total Blocking Time (lab only)</span><span class="v">How long the main thread was too busy to respond during loading — the lab stand-in for INP. Good: ≤ 200&nbsp;ms.</span></div>
</div>
<p>All three Core Web Vitals come from the user's point of view: seeing, stability, responsiveness. None of them is "how many kilobytes" — bytes matter only because they cost time.</p>

<h3>Step 2 — a slow page, built on purpose</h3>
${ma('html', CODE['_t14/perf/slow.html'])}
<p>Three problems that appear on real sites every day: the hero image is a 2.5&nbsp;MB, 2400-pixel camera JPEG with no <code>width</code>/<code>height</code>; a promotion banner is inserted <em>above</em> the content 800&nbsp;ms after load; and a "tracking" script in <code>&lt;head&gt;</code> keeps the main thread busy for 300&nbsp;ms. The images are generated by <code>make-images.mjs</code> (a noisy gradient that compresses like a photo).</p>

<h3>Step 3 — measure, with the browser's own sensors</h3>
${ma('javascript', CODE['_t14/perf/measure.mjs'])}
${ra(OUT['_t14/out/perf-measure'])}
<p>The script opens each page in Chromium in a phone-sized window, slows the network to 1.6&nbsp;Mbps with 150&nbsp;ms of latency and the CPU by 4× (Chrome DevTools Protocol, the same switches as the Network and Performance panels), and reads LCP and CLS from <code>PerformanceObserver</code> — the exact entries the browser reports to real-user monitoring. Median of three runs. The slow page shows its main content after <strong>12.3&nbsp;seconds</strong> and shifts by <strong>0.209</strong>; both fixed versions show it in <strong>1.24&nbsp;s</strong> with no shift, downloading 182&nbsp;KB instead of 2,456&nbsp;KB.</p>

<h3>Step 4 — Lighthouse: the score and the surprise</h3>
${ra(OUT['_t14/out/perf-lighthouse'])}
<p>Lighthouse 13.6, mobile profile (simulated throttling), on the same three pages. It confirms the LCP and CLS findings and adds the main-thread view: <code>fast.html</code> scored only <strong>76</strong>, with a Total Blocking Time of 1,150&nbsp;ms. The best version scored <strong>99</strong>. The difference between them is the subject of fix 3.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">slow</span><span class="lz-t">64</span><span class="lz-d">LCP 13.2&nbsp;s (huge image), CLS 0.209 (late banner). TBT 0 only because the blocking happened before the first paint.</span></div>
<div class="lz-step"><span class="lz-k">fast</span><span class="lz-t">76</span><span class="lz-d">Image and layout fixed. The 300&nbsp;ms script was merely <code>defer</code>red — it now runs after paint as one long task.</span></div>
<div class="lz-step"><span class="lz-k">best</span><span class="lz-t">99</span><span class="lz-d">The same work, split into small slices that run when the browser is idle.</span></div>
</div>

<h3>Fix 1 — the image (LCP 12.3&nbsp;s → 1.2&nbsp;s)</h3>
${ma('html', CODE['_t14/perf/fast.html'], [6, 16])}
<ul>
<li><strong>Right size, right format:</strong> on a 412-pixel-wide phone the image never needed 2400 pixels. A 1200-pixel WebP (enough for high-density screens) weighs 185&nbsp;KB instead of 2.5&nbsp;MB. For several screen sizes, use <code>srcset</code>/<code>sizes</code> so each device downloads the size it needs.</li>
<li><strong>Tell the browser early:</strong> <code>&lt;link rel="preload" as="image" … fetchpriority="high"&gt;</code> starts the download while the HTML is still being read.</li>
<li><strong>Never lazy-load the LCP image:</strong> <code>loading="lazy"</code> is for images below the fold; on the hero it delays exactly the metric you care about.</li>
</ul>

<h3>Fix 2 — reserve space (CLS 0.209 → 0)</h3>
<p>A layout shift is visible content moving because something appeared before it. Two rules remove almost all of them: give every image its <code>width</code> and <code>height</code> attributes (or a CSS <code>aspect-ratio</code>) so the browser reserves the right height before the file arrives, and reserve room for content inserted later — here <code>#banner-slot { min-height: 220px; }</code>. The banner still arrives after 800&nbsp;ms; nothing moves when it does.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — cookie bars, ads and "you may also like" blocks.</strong> Anything injected at the top of the page after load causes shifts, and CLS keeps counting for the page's whole life. Reserve space, overlay it (a fixed bar at the bottom does not move content), or insert below what the user is reading.</p></div>

<h3>Fix 3 — long tasks (TBT 1,150&nbsp;ms → 0)</h3>
${ma('javascript', CODE['_t14/perf/tracking-chunked.js'])}
<p>A <strong>long task</strong> is any piece of JavaScript that holds the main thread for more than 50&nbsp;ms; while it runs, the page cannot respond to taps (that is what INP measures for real users). <code>defer</code> only <em>moved</em> the 300&nbsp;ms block to after the first paint — where it now blocks interaction, and with the 4× slower CPU Lighthouse counted 1,150&nbsp;ms of blocking. The best version does the same total work in thirty 10&nbsp;ms slices inside <code>requestIdleCallback</code>: no task exceeds 50&nbsp;ms, the browser can answer a tap between slices, and TBT drops to 0.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "I added defer/async, so the script is fixed".</strong> Those attributes change <em>when</em> a script runs, not how much it costs. Third-party scripts (analytics, chat widgets, ads) are the most common source of long tasks on real sites. Measure their cost, load them late, or remove them — and in your own code, split heavy loops or move them to a Web Worker.</p></div>

<h3>Lab data versus field data</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lab</span><span class="v">Lighthouse, our <code>measure.mjs</code>, the DevTools Performance panel. One simulated device and network; repeatable — ideal for comparing fixes.</span></div>
  <div class="kv"><span class="k">Field</span><span class="v">Real visitors: the Chrome UX Report, PageSpeed Insights' top section, or the <code>web-vitals</code> library sending numbers to your analytics. Every phone and network; Google ranks with the 75th percentile.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — measuring on your laptop.</strong> A modern laptop on office Wi-Fi turns a 12-second page into a 1-second page; you will see no problem. Always measure with a mobile profile (Lighthouse's default, or DevTools throttling), and remember that field data from real users is the final judge.</p></div>

<h3>A checklist you can reuse</h3>
<ol>
<li>Measure first, on a mobile profile — never optimise blind.</li>
<li>Images: right size, modern format (WebP/AVIF), dimensions set, hero preloaded, the rest lazy.</li>
<li>Stability: reserve space for anything that arrives late; avoid inserting above visible content.</li>
<li>Main thread: ship less JavaScript (lesson 14.1), split long tasks, load third-party scripts late.</li>
<li>Re-measure after each change and keep the before/after numbers.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Practice (25 minutes)</strong></p>
<p>Pick a page you built in this course (or the portfolio you deployed in lesson 14.3). In Chrome open DevTools → Lighthouse → Mobile → Performance → Analyze. Write down the score, LCP, CLS and TBT. Fix the biggest image (resize, convert to WebP, add <code>width</code>/<code>height</code>) and one source of layout shift, then run Lighthouse again.</p>
<p><strong>Done when:</strong> you have two reports (before and after) saved; LCP or CLS improved measurably; and you can write one sentence per change saying which number it moved and by how much — for example "resizing the hero from 2.5&nbsp;MB to 185&nbsp;KB moved LCP from 12.3&nbsp;s to 1.2&nbsp;s". Code Lab module 14.4 grades functions that rate metrics, compute CLS from shift entries and find long tasks.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Core Web Vitals</span><span class="v">các chỉ số trải nghiệm cốt lõi — LCP, CLS, INP.</span></div>
  <div class="kv"><span class="k">LCP</span><span class="v">lần vẽ nội dung lớn nhất — nội dung chính hiện ra lúc nào.</span></div>
  <div class="kv"><span class="k">CLS</span><span class="v">tổng xô lệch bố cục — trang nhảy nhiều cỡ nào.</span></div>
  <div class="kv"><span class="k">INP / TBT</span><span class="v">độ trễ phản hồi tương tác / tổng thời gian bị chặn (đo trong lab).</span></div>
  <div class="kv"><span class="k">long task</span><span class="v">tác vụ dài — JavaScript giữ luồng chính quá 50&nbsp;ms.</span></div>
  <div class="kv"><span class="k">throttling</span><span class="v">bóp băng thông/CPU — giả lập điện thoại và mạng chậm.</span></div>
  <div class="kv"><span class="k">lab data / field data</span><span class="v">số đo phòng lab / số đo từ người dùng thật.</span></div>
  <div class="kv"><span class="k">preload / fetchpriority</span><span class="v">tải trước / độ ưu tiên tải — báo trình duyệt tài nguyên quan trọng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>LCP (seeing), CLS (stability), INP (responsiveness); TBT stands in for INP in the lab.</li>
  <li>Measured on a phone profile: a 2.5&nbsp;MB image gave LCP 12.3&nbsp;s; a right-sized WebP gave 1.2&nbsp;s.</li>
  <li>Dimensions and reserved space removed a 0.209 layout shift completely.</li>
  <li><code>defer</code> moved a long task instead of removing it (score 76); splitting it gave 99.</li>
  <li>Use lab tools to compare fixes; trust field data from real users in the end.</li>
</ul>
${nguon('📗', 'web.dev — Core Web Vitals', 'Definitions, thresholds and how each metric is measured', 'https://web.dev/articles/vitals')}
${nguon('📘', 'Chrome — Lighthouse overview', 'How to run Lighthouse and read the performance report', 'https://developer.chrome.com/docs/lighthouse/overview')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-17-5-core-web-vitals', title: 'Next.js 17.5 — Core Web Vitals: how Google measures "good"', sub: 'The same metrics with next/image, fonts and streaming', cta: 'Open lesson' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-18-4-fonts-assets', title: 'Next.js 18.4 — fonts and static assets', sub: 'Avoiding font-related layout shifts in a framework', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Đo thứ người dùng cảm nhận, sửa nguyên nhân lớn nhất, rồi đo lại</h2>
<p class="lead">Học xong bài này bạn giải thích được Core Web Vitals bằng lời đơn giản, đo một trang bằng Lighthouse và bằng API hiệu năng có sẵn của trình duyệt, sửa ba nguyên nhân đứng sau phần lớn các trang chậm — ảnh quá lớn, xô lệch bố cục và tác vụ dài trên luồng chính — và hiểu khác biệt giữa số đo phòng lab và số đo thực tế. Vì sao cần: người dùng bỏ đi khỏi trang chậm, và Google dùng chính các chỉ số này khi xếp hạng kết quả tìm kiếm. Trong bài này một trang đi từ điểm Lighthouse 64 lên 99, và mọi con số đều đo trên một điện thoại giả lập, không phải đoán.</p>

<h3>Bước 1 — các chỉ số, bằng lời đơn giản</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">LCP — Largest Contentful Paint</span><span class="v">"Nội dung chính hiện ra lúc nào?" Thời gian tới khi ảnh hay khối chữ lớn nhất được vẽ. Tốt: ≤ 2,5&nbsp;s.</span></div>
  <div class="kv"><span class="k">CLS — Cumulative Layout Shift</span><span class="v">"Mọi thứ có nhảy khi đang tải không?" Điểm đo nội dung nhìn thấy dịch chuyển bao nhiêu và bao xa. Tốt: ≤ 0,1.</span></div>
  <div class="kv"><span class="k">INP — Interaction to Next Paint</span><span class="v">"Khi tôi chạm, trang phản hồi nhanh cỡ nào?" Đo trên tương tác của người dùng thật. Tốt: ≤ 200&nbsp;ms.</span></div>
  <div class="kv"><span class="k">TBT — Total Blocking Time (chỉ trong lab)</span><span class="v">Luồng chính bận tới mức không phản hồi được trong bao lâu khi đang tải — thay thế INP trong lab. Tốt: ≤ 200&nbsp;ms.</span></div>
</div>
<p>Cả ba Core Web Vitals đều đứng từ góc nhìn người dùng: nhìn thấy, ổn định, phản hồi. Không chỉ số nào là "bao nhiêu kilobyte" — byte chỉ quan trọng vì chúng tốn thời gian.</p>

<h3>Bước 2 — một trang chậm, dựng có chủ đích</h3>
${ma('html', CODE['_t14/perf/slow.html'])}
<p>Ba vấn đề xuất hiện trên trang thật hằng ngày: ảnh chính là một JPEG máy ảnh 2,5&nbsp;MB, 2400 điểm ảnh, không có <code>width</code>/<code>height</code>; một banner khuyến mãi chèn <em>lên trên</em> nội dung 800&nbsp;ms sau khi tải; và một script "theo dõi" trong <code>&lt;head&gt;</code> giữ luồng chính bận 300&nbsp;ms. Ảnh được sinh bằng <code>make-images.mjs</code> (một dải màu có nhiễu, nén khó như ảnh chụp thật).</p>

<h3>Bước 3 — đo, bằng chính cảm biến của trình duyệt</h3>
${ma('javascript', CODE['_t14/perf/measure.mjs'])}
${ra(OUT['_t14/out/perf-measure'])}
<p>Script mở từng trang trong Chromium ở cửa sổ cỡ điện thoại, bóp mạng xuống 1,6&nbsp;Mbps với độ trễ 150&nbsp;ms và CPU chậm 4× (Chrome DevTools Protocol, đúng các công tắc của bảng Network và Performance), rồi đọc LCP và CLS từ <code>PerformanceObserver</code> — đúng những mục trình duyệt báo cho hệ thống đo người dùng thật. Trung vị của ba lần chạy. Trang chậm hiện nội dung chính sau <strong>12,3&nbsp;giây</strong> và xô lệch <strong>0,209</strong>; cả hai bản đã sửa hiện trong <strong>1,24&nbsp;s</strong> và không xô lệch, tải 182&nbsp;KB thay vì 2.456&nbsp;KB.</p>

<h3>Bước 4 — Lighthouse: điểm số và một bất ngờ</h3>
${ra(OUT['_t14/out/perf-lighthouse'])}
<p>Lighthouse 13.6, cấu hình điện thoại (bóp băng thông mô phỏng), trên cùng ba trang. Nó xác nhận kết quả LCP và CLS và thêm góc nhìn luồng chính: <code>fast.html</code> chỉ được <strong>76</strong>, với Total Blocking Time 1.150&nbsp;ms. Bản tốt nhất được <strong>99</strong>. Khác biệt giữa hai bản là chủ đề của cách sửa thứ 3.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">slow</span><span class="lz-t">64</span><span class="lz-d">LCP 13,2&nbsp;s (ảnh khổng lồ), CLS 0,209 (banner tới muộn). TBT bằng 0 chỉ vì việc chặn xảy ra trước lần vẽ đầu.</span></div>
<div class="lz-step"><span class="lz-k">fast</span><span class="lz-t">76</span><span class="lz-d">Đã sửa ảnh và bố cục. Script 300&nbsp;ms chỉ được <code>defer</code> — giờ nó chạy sau khi vẽ, thành một tác vụ dài.</span></div>
<div class="lz-step"><span class="lz-k">best</span><span class="lz-t">99</span><span class="lz-d">Cùng lượng việc, chia thành các lát nhỏ chạy khi trình duyệt rảnh.</span></div>
</div>

<h3>Sửa 1 — ảnh (LCP 12,3&nbsp;s → 1,2&nbsp;s)</h3>
${ma('html', CODE['_t14/perf/fast.html'], [6, 16])}
<ul>
<li><strong>Đúng kích thước, đúng định dạng:</strong> trên điện thoại rộng 412 điểm ảnh, ảnh không bao giờ cần 2400 điểm ảnh. Một WebP 1200 điểm ảnh (đủ cho màn hình mật độ cao) nặng 185&nbsp;KB thay vì 2,5&nbsp;MB. Với nhiều cỡ màn hình, dùng <code>srcset</code>/<code>sizes</code> để mỗi thiết bị tải đúng cỡ nó cần.</li>
<li><strong>Báo sớm cho trình duyệt:</strong> <code>&lt;link rel="preload" as="image" … fetchpriority="high"&gt;</code> bắt đầu tải trong khi HTML còn đang được đọc.</li>
<li><strong>Không bao giờ lazy-load ảnh LCP:</strong> <code>loading="lazy"</code> dành cho ảnh nằm dưới màn hình đầu; dùng cho ảnh chính là làm chậm đúng chỉ số bạn quan tâm.</li>
</ul>

<h3>Sửa 2 — giữ chỗ (CLS 0,209 → 0)</h3>
<p>Xô lệch bố cục là nội dung đang hiển thị bị dịch chuyển vì có thứ xuất hiện trước nó. Hai luật loại bỏ gần hết: khai <code>width</code> và <code>height</code> cho mọi ảnh (hoặc CSS <code>aspect-ratio</code>) để trình duyệt giữ đúng chiều cao trước khi file tới, và giữ chỗ cho nội dung chèn vào sau — ở đây là <code>#banner-slot { min-height: 220px; }</code>. Banner vẫn tới sau 800&nbsp;ms; nó tới thì không có gì xê dịch.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — thanh cookie, quảng cáo và khối "có thể bạn thích".</strong> Bất cứ thứ gì chèn lên đầu trang sau khi tải đều gây xô lệch, và CLS tính suốt đời của trang. Hãy giữ chỗ, đặt nổi lên trên (thanh cố định ở đáy không đẩy nội dung), hoặc chèn bên dưới phần người dùng đang đọc.</p></div>

<h3>Sửa 3 — tác vụ dài (TBT 1.150&nbsp;ms → 0)</h3>
${ma('javascript', CODE['_t14/perf/tracking-chunked.js'])}
<p><strong>Tác vụ dài (long task)</strong> là bất kỳ đoạn JavaScript nào giữ luồng chính quá 50&nbsp;ms; khi nó chạy, trang không phản hồi được cú chạm (chính là thứ INP đo với người dùng thật). <code>defer</code> chỉ <em>dời</em> khối 300&nbsp;ms tới sau lần vẽ đầu — nơi giờ nó chặn tương tác, và với CPU chậm 4× Lighthouse tính được 1.150&nbsp;ms bị chặn. Bản tốt nhất làm cùng tổng lượng việc trong ba mươi lát 10&nbsp;ms bên trong <code>requestIdleCallback</code>: không tác vụ nào quá 50&nbsp;ms, trình duyệt trả lời được cú chạm giữa các lát, và TBT về 0.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "tôi thêm defer/async rồi, script ổn rồi".</strong> Các thuộc tính đó đổi <em>khi nào</em> script chạy, không đổi nó tốn bao nhiêu. Script bên thứ ba (analytics, widget chat, quảng cáo) là nguồn tác vụ dài phổ biến nhất trên trang thật. Đo chi phí của chúng, nạp muộn, hoặc gỡ bỏ — còn trong code của bạn, chia nhỏ vòng lặp nặng hoặc chuyển sang Web Worker.</p></div>

<h3>Số đo lab và số đo thực tế</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lab</span><span class="v">Lighthouse, <code>measure.mjs</code> của ta, bảng Performance của DevTools. Một thiết bị và một mạng mô phỏng; lặp lại được — lý tưởng để so các bản sửa.</span></div>
  <div class="kv"><span class="k">Field (thực tế)</span><span class="v">Người truy cập thật: Chrome UX Report, phần trên cùng của PageSpeed Insights, hoặc thư viện <code>web-vitals</code> gửi số về analytics của bạn. Mọi điện thoại và mọi mạng; Google xếp hạng theo phân vị 75.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đo trên laptop của bạn.</strong> Một laptop hiện đại dùng Wi-Fi văn phòng biến trang 12 giây thành trang 1 giây; bạn sẽ không thấy vấn đề gì. Luôn đo với cấu hình điện thoại (mặc định của Lighthouse, hoặc bóp băng thông trong DevTools), và nhớ rằng dữ liệu thực tế từ người dùng thật mới là trọng tài cuối cùng.</p></div>

<h3>Danh sách kiểm dùng lại được</h3>
<ol>
<li>Đo trước, trên cấu hình điện thoại — không bao giờ tối ưu mù.</li>
<li>Ảnh: đúng cỡ, định dạng hiện đại (WebP/AVIF), khai kích thước, preload ảnh chính, còn lại lazy.</li>
<li>Ổn định: giữ chỗ cho mọi thứ tới muộn; tránh chèn lên trên nội dung đang hiển thị.</li>
<li>Luồng chính: gửi ít JavaScript hơn (bài 14.1), chia nhỏ tác vụ dài, nạp script bên thứ ba muộn.</li>
<li>Đo lại sau mỗi thay đổi và giữ số trước/sau.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Luyện tập (25 phút)</strong></p>
<p>Chọn một trang bạn đã dựng trong khoá (hoặc portfolio đã deploy ở bài 14.3). Trong Chrome mở DevTools → Lighthouse → Mobile → Performance → Analyze. Ghi lại điểm, LCP, CLS và TBT. Sửa ảnh lớn nhất (thu nhỏ, đổi sang WebP, thêm <code>width</code>/<code>height</code>) và một nguồn xô lệch bố cục, rồi chạy Lighthouse lần nữa.</p>
<p><strong>Xong khi:</strong> bạn lưu được hai báo cáo (trước và sau); LCP hoặc CLS cải thiện đo được; và bạn viết được mỗi thay đổi một câu nói nó làm dịch con số nào và bao nhiêu — ví dụ "thu ảnh chính từ 2,5&nbsp;MB xuống 185&nbsp;KB đưa LCP từ 12,3&nbsp;s xuống 1,2&nbsp;s". Code Lab module 14.4 chấm các hàm xếp loại chỉ số, tính CLS từ danh sách xô lệch và tìm tác vụ dài.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Core Web Vitals</span><span class="v">các chỉ số trải nghiệm cốt lõi — LCP, CLS, INP.</span></div>
  <div class="kv"><span class="k">LCP</span><span class="v">lần vẽ nội dung lớn nhất — nội dung chính hiện ra lúc nào.</span></div>
  <div class="kv"><span class="k">CLS</span><span class="v">tổng xô lệch bố cục — trang nhảy nhiều cỡ nào.</span></div>
  <div class="kv"><span class="k">INP / TBT</span><span class="v">độ trễ phản hồi tương tác / tổng thời gian bị chặn (đo trong lab).</span></div>
  <div class="kv"><span class="k">long task</span><span class="v">tác vụ dài — JavaScript giữ luồng chính quá 50&nbsp;ms.</span></div>
  <div class="kv"><span class="k">throttling</span><span class="v">bóp băng thông/CPU — giả lập điện thoại và mạng chậm.</span></div>
  <div class="kv"><span class="k">lab data / field data</span><span class="v">số đo phòng lab / số đo từ người dùng thật.</span></div>
  <div class="kv"><span class="k">preload / fetchpriority</span><span class="v">tải trước / độ ưu tiên tải — báo trình duyệt tài nguyên quan trọng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>LCP (nhìn thấy), CLS (ổn định), INP (phản hồi); TBT đứng thay INP trong lab.</li>
  <li>Đo trên cấu hình điện thoại: ảnh 2,5&nbsp;MB cho LCP 12,3&nbsp;s; ảnh WebP đúng cỡ cho 1,2&nbsp;s.</li>
  <li>Khai kích thước và giữ chỗ đã xoá sạch mức xô lệch 0,209.</li>
  <li><code>defer</code> dời một tác vụ dài thay vì gỡ nó (điểm 76); chia nhỏ nó cho 99.</li>
  <li>Dùng công cụ lab để so các bản sửa; cuối cùng hãy tin dữ liệu thực tế từ người dùng thật.</li>
</ul>
${nguon('📗', 'web.dev — Core Web Vitals', 'Định nghĩa, ngưỡng và cách đo từng chỉ số', 'https://web.dev/articles/vitals')}
${nguon('📘', 'Chrome — Lighthouse overview', 'Cách chạy Lighthouse và đọc báo cáo hiệu năng', 'https://developer.chrome.com/docs/lighthouse/overview')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-17-5-core-web-vitals', title: 'Next.js 17.5 — Core Web Vitals: Google đo "tốt" thế nào', sub: 'Cùng các chỉ số đó với next/image, font và streaming', cta: 'Mở bài' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-18-4-fonts-assets', title: 'Next.js 18.4 — font và tài nguyên tĩnh', sub: 'Tránh xô lệch bố cục do font trong một framework', cta: 'Mở bài' })}
</div>
`,
};
