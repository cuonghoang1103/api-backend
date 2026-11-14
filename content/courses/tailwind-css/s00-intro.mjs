import G00_8 from './giang/twc-00-8.mjs';
import G00_9 from './giang/twc-00-9.mjs';
import G00_1 from './giang/twc-00-1.mjs';
import G00_2 from './giang/twc-00-2.mjs';
import G00_3 from './giang/twc-00-3.mjs';
const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Mục 0: Tailwind thật ra LÀ cái gì.
 * Số đo lấy từ chính frontend/ của kho này: 793 file .tsx, 26.343 className,
 * 3.683 lớp duy nhất, và Tailwind CLI 3.4.14 chạy thật trong hộp cát.
 */

export default {
  title: 'Section 0 — What Tailwind actually is|||Mục 0 — Tailwind thật ra LÀ cái gì',
  slug: 'tw-muc0-intro',
  description: 'Bốn bài dựng lại mô hình tinh thần trước khi dựng lớp nào: Tailwind KHÔNG phải một thư viện CSS mà là một trình SINH đọc mã nguồn của bạn — và gần như mọi thứ gây bất ngờ về sau đều suy ra từ đúng một câu đó.',
  sortOrder: 1,
  lessons: [

    /* ─────────────────────── Bắt đầu tại đây 1/2 ─────────────────────── */
    {
      title: 'Start here (1/2) — What Tailwind CSS is, and why this course exists|||Bắt đầu tại đây (1/2) — Tailwind CSS là gì, và vì sao có khoá này',
      slug: 'tw-0-0-start-here-1',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bài mở cửa cho người đã viết chút HTML/CSS và muốn hiểu Tailwind thật sự là gì thay vì nghe ý kiến: Tailwind là một công cụ SINH ra bảng kiểu từ tên lớp nó thấy trong mã, bạn sẽ làm được gì sau khoá, và khoá này giả định bạn biết sẵn những gì.',
      content: `
${G00_8}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What Tailwind CSS is, and why this course exists</h2>
<p class="lead">If you have written some HTML and CSS and keep hearing that Tailwind is either the best or the worst thing to happen to styling, this is the course that replaces the opinions with measurements. Tailwind is a tool that generates a CSS stylesheet from the class names it finds in your markup. By the end you will not be memorising class names — you will be deriving them from a handful of rules, and you will know exactly why a class sometimes does nothing.</p>
<h3>What it is, in one line</h3>
<p>Tailwind scans your source files as text, collects every string that looks like a class name (<code>flex</code>, <code>p-4</code>, <code>hover:bg-blue-600</code>), and writes a stylesheet containing only those. You style by composing small single-purpose utility classes in the markup instead of writing rule blocks in a separate file.</p>
<h3>What you will be able to do</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read the scale</span><span class="v">Derive any spacing, colour or size class from a rule instead of searching docs.</span></div>
  <div class="kv"><span class="k">Style conditionally</span><span class="v">Express hover, focus and responsive breakpoints that an inline style cannot.</span></div>
  <div class="kv"><span class="k">Win conflicts on purpose</span><span class="v">Know which of two competing utilities actually applies, and why.</span></div>
  <div class="kv"><span class="k">Configure the generator</span><span class="v">Extend the theme, drive both light and dark from one class, organise with layers.</span></div>
  <div class="kv"><span class="k">Diagnose "my class does not apply"</span><span class="v">Split the common causes in one grep of the built CSS.</span></div>
</div>
<h3>Who this course is for</h3>
<p>It assumes you can write basic HTML and some CSS — you know what <code>padding</code>, <code>color</code> and a class selector are. It does not assume you have used Tailwind, React or a build tool before; where those matter the lessons point you to the Web Foundations course for the underlying CSS. Every number in this course was measured from one real codebase (this repository's frontend — re-measured 14/11/2026: 1,673 <code>.tsx</code> files, 49,298 <code>className="…"</code> attributes; it was 793 and 26,343 when the course was first written, and the app keeps growing), so the claims are checkable, not marketing.</p>
<h3>🧪 Practice (10–15 min)</h3>
<div class="callout ok"><ol><li>Open a site built with Tailwind (many are) and inspect an element; notice the class list is many short names like <code>flex</code>, <code>px-4</code>, <code>text-sm</code> rather than one semantic name.</li><li>Write down two things you currently put in a separate <code>.css</code> file that you would now write as classes in the markup.</li><li>Name one styling need you are unsure Tailwind can express; you will be able to answer it yourself by the end of Chapter 2.</li></ol>
<p><strong>Done when:</strong> you can state, in one sentence, the difference between a CSS library you link and a tool that generates CSS from your markup.</p></div>
<h3>📜 Where Tailwind came from — read from the npm registry</h3>
<p>Dates below are not from memory: they are the publish times the npm registry records for each version. Tailwind was started by Adam Wathan and a small team; version 0.1 shipped on 1 November 2017. Version 3.0 (December 2021) made the on-demand engine the default — the step that turned "a huge file you purge afterwards" into "a file that only ever contains what you used". Version 4.0 (January 2025) moved configuration into CSS itself (<code>@theme</code>).</p>
<div class="out">$ npm view tailwindcss time --json | node -e 'const t=JSON.parse(require("fs").readFileSync(0));for(const v of ["0.1.0","1.0.0","2.0.0","3.0.0","4.0.0","3.4.19","4.3.5"])console.log(v.padEnd(7),t[v].slice(0,10))'
0.1.0   2017-11-01
1.0.0   2019-05-13
2.0.0   2020-11-18
3.0.0   2021-12-09
4.0.0   2025-01-21
3.4.19  2025-12-10
4.3.5   2026-11-06</div>
<p>This matters for you because you will meet <strong>both</strong> major versions: this site's own frontend runs Tailwind <strong>3.4.19</strong> (and most tutorials online teach 3.x), while <code>npm i tailwindcss</code> today installs <strong>4.3.5</strong>. The written lessons measure the real 3.4 app; the videos run both and point out every difference where it bites.</p>
<h3>🔬 Measured: the same card, with a library and with a generator</h3>
<p>One small card, built twice and opened in Chromium: once with Bootstrap 5.3.9 (a library: one prepared stylesheet you link), once with Tailwind 4.3.5 (a generator). The Tailwind page:</p>
<pre><code class="language-html">&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;link rel="stylesheet" href="out.css"&gt;&lt;/head&gt;
&lt;body class="bg-slate-100 p-8"&gt;
  &lt;div class="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg"&gt;
    &lt;h2 class="text-xl font-bold text-slate-900"&gt;Khoá Tailwind CSS&lt;/h2&gt;
    &lt;p class="mt-2 text-slate-600"&gt;Từ lớp tiện ích tới hệ thiết kế.&lt;/p&gt;
    &lt;button class="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"&gt;Học ngay&lt;/button&gt;
  &lt;/div&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<div class="out">$ npx @tailwindcss/cli -i input.css -o out.css --minify 2&gt;&amp;1 | tail -1
Done in 39ms
$ wc -c bs/bootstrap.min.css tw/out.css | sed '$d'
  232360 bs/bootstrap.min.css
    7420 tw/out.css
$ for f in bs/bootstrap.min.css tw/out.css; do printf '%-22s gzip %6d byte\\n' $f $(gzip -9c $f | wc -c); done
bs/bootstrap.min.css   gzip  30913 byte
tw/out.css             gzip   2238 byte
$ grep -oE '\\.[a-z][a-z0-9-]*' bs/bootstrap.min.css | sort -u | wc -l | sed 's/^ */lớp có trong bootstrap.min.css: /'
lớp có trong bootstrap.min.css: 2032
$ grep -oE 'class="[^"]*"' bs/index.html | sed 's/class="//;s/"//' | tr ' ' '\\n' | sort -u | wc -l | sed 's/^ */lớp trang Bootstrap dùng: /'
lớp trang Bootstrap dùng: 12
$ grep -oE 'class="[^"]*"' tw/index.html | sed 's/class="//;s/"//' | tr ' ' '\\n' | sort -u | wc -l | sed 's/^ */lớp trang Tailwind dùng: /'
lớp trang Tailwind dùng: 20
$ grep -oE '\\.[a-z][a-z0-9:\\\\-]*' tw/out.css | grep -vE '^\\.(sr|not-sr|com)$' | sort -u | tr '\\n' ' '; echo
.bg-cyan-600 .bg-slate-100 .bg-white .font-bold .hover\\:bg-cyan-700:hover .max-w-sm .mt-2 .mt-4 .mx-auto .p-6 .p-8 .px-4 .py-2 .rounded-lg .rounded-xl .shadow-lg .text-slate-600 .text-slate-900 .text-white .text-xl 
$ tr '}' '\\n' &lt; tw/out.css | grep -E '^\\.(p-6|text-xl|bg-cyan-600|mt-4)\\{' | sed 's/$/}/'
.mt-4{margin-top:calc(var(--spacing) * 4)}
.bg-cyan-600{background-color:var(--color-cyan-600)}
.p-6{padding:calc(var(--spacing) * 6)}
.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}</div>
<p>Bootstrap ships all of its ~2,000 classes whether the page uses 12 or 1,200. Tailwind wrote exactly the 20 rules the page asked for, plus its base styles. Each rule does one job:</p>
<div class="out">$ tr '}' '\\n' &lt; tw/out.css | grep -E '^\\.(p-6|text-xl|bg-cyan-600|mt-4)\\{' | sed 's/$/}/'
.mt-4{margin-top:calc(var(--spacing) * 4)}
.bg-cyan-600{background-color:var(--color-cyan-600)}
.p-6{padding:calc(var(--spacing) * 6)}
.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}</div>
<p>And on a real app — this site, today:</p>
<div class="out">$ grep -A1 '"node_modules/tailwindcss"' package-lock.json | tail -1 | sed 's/^ *//'
"version": "3.4.19",
$ for u in $(curl -s https://cuongthai.com/ | grep -oE '/_next/static/css/[^"]+\\.css' | sort -u); do curl -s https://cuongthai.com$u | wc -c; done | awk '{s+=$1} END {printf "CSS của trang chủ cuongthai.com: %d byte\\n", s}'
CSS của trang chủ cuongthai.com: 705653 byte</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">mkdir tw-thu &amp;&amp; cd tw-thu &amp;&amp; npm init -y
npm i tailwindcss @tailwindcss/cli
echo '@import "tailwindcss";' &gt; input.css
<span class="tok-comment"># write index.html with a few classes, then:</span>
npx @tailwindcss/cli -i input.css -o out.css --minify
wc -c out.css
tr '}' '\\n' &lt; out.css | grep -E '^\\.(p-6|mt-4)\\{'</code></pre>
<p>Add one class to <code>index.html</code>, build again, and compare <code>wc -c</code>. Then reuse a class that already exists a hundred times: the size does not move.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — What CSS is: selectors, cascade, inheritance</span><span class="lc-sub">The plain-CSS rules every utility class sits on</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-2-box-model" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.2 — The box model</span><span class="lc-sub">What p-6, mt-4 and max-w-sm actually change</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-1-styling-va-tailwind" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.1 — Styling options, and why Tailwind</span><span class="lc-sub">Tailwind inside a real Next.js 16 app, and 7 classes missing on cuongthai.com</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Utility class</span><span class="v">A small single-purpose class like <code>p-4</code> or <code>flex</code> that maps to one or two CSS declarations.</span></div>
  <div class="kv"><span class="k">Generator</span><span class="v">A build-time tool that writes a stylesheet from the classes it finds, rather than shipping a fixed one.</span></div>
  <div class="kv"><span class="k">Scale</span><span class="v">The fixed set of values (spacing, colour, size) that the utility names are derived from.</span></div>
  <div class="kv"><span class="k">Variant</span><span class="v">A conditional prefix such as <code>hover:</code> or <code>md:</code> applied to a utility.</span></div>
  <div class="kv"><span class="k">Utility-first</span><span class="v">Composing utilities in markup instead of writing semantic rule blocks in a separate file.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>Tailwind generates a CSS stylesheet from the class names it finds in your source — you style by composing utilities in the markup.</li><li>By the end you will derive classes from the scale, style conditionally, resolve conflicts, configure the generator, and diagnose failures.</li><li>The course assumes basic HTML/CSS, not prior Tailwind, React or build-tool experience.</li><li>Every figure is measured from one real codebase, so the claims are checkable.</li></ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Tailwind CSS là gì, và vì sao có khoá này</h2>
<p class="lead">Nếu bạn đã viết chút HTML và CSS rồi liên tục nghe rằng Tailwind hoặc là điều tuyệt nhất hoặc tệ nhất từng xảy ra với việc tạo kiểu, thì đây là khoá học thay những ý kiến đó bằng các số đo. Tailwind là một công cụ SINH ra một bảng kiểu CSS từ những tên lớp nó tìm thấy trong mã đánh dấu của bạn. Hết khoá, bạn sẽ không học thuộc tên lớp — bạn sẽ SUY RA chúng từ một nhúm quy tắc, và biết chính xác vì sao đôi khi một lớp không làm gì.</p>
<h3>Nó là gì, trong một dòng</h3>
<p>Tailwind quét file mã nguồn của bạn như văn bản, gom mọi chuỗi trông giống tên lớp (<code>flex</code>, <code>p-4</code>, <code>hover:bg-blue-600</code>), rồi viết ra một bảng kiểu chỉ chứa chừng ấy. Bạn tạo kiểu bằng cách ghép những lớp tiện ích nhỏ, mỗi lớp một việc, ngay trong mã đánh dấu thay vì viết các khối quy tắc ở một file riêng.</p>
<h3>Bạn sẽ làm được gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Read the scale</span><span class="v">Đọc thang: suy ra mọi lớp khoảng cách, màu hay kích thước từ một quy tắc thay vì tra tài liệu.</span></div>
  <div class="kv"><span class="k">Style conditionally</span><span class="v">Tạo kiểu có điều kiện: diễn đạt hover, focus và điểm ngắt mà inline style không làm được.</span></div>
  <div class="kv"><span class="k">Win conflicts on purpose</span><span class="v">Thắng xung đột có chủ đích: biết trong hai tiện ích tranh nhau, cái nào thật sự ăn, và vì sao.</span></div>
  <div class="kv"><span class="k">Configure the generator</span><span class="v">Cấu hình trình sinh: mở rộng theme, lái cả sáng lẫn tối từ một lớp, tổ chức bằng layer.</span></div>
  <div class="kv"><span class="k">Diagnose "my class does not apply"</span><span class="v">Chẩn đoán "lớp của tôi không ăn": tách các nguyên nhân thường gặp bằng một lần grep CSS đã dựng.</span></div>
</div>
<h3>Khoá này dành cho ai</h3>
<p>Nó giả định bạn viết được HTML cơ bản và chút CSS — bạn biết <code>padding</code>, <code>color</code> và một bộ chọn lớp là gì. Nó KHÔNG giả định bạn từng dùng Tailwind, React hay một công cụ dựng; chỗ nào cần tới chúng, bài học trỏ bạn sang khoá Web Foundations để lấy phần CSS nền. Mọi con số trong khoá này được đo từ một kho mã thật (frontend của chính kho này — đo lại 14/11/2026: 1.673 tệp <code>.tsx</code>, 49.298 thuộc tính <code>className="…"</code>; lúc mới soạn khoá là 793 và 26.343, và ứng dụng vẫn đang lớn lên), nên các lời khẳng định đều KIỂM ĐƯỢC, không phải quảng cáo.</p>
<h3>🧪 Thực hành (10–15 phút)</h3>
<div class="callout ok"><ol><li>Mở một trang dựng bằng Tailwind (có nhiều) và kiểm phần tử; để ý danh sách lớp là nhiều tên ngắn như <code>flex</code>, <code>px-4</code>, <code>text-sm</code> chứ không phải một tên có nghĩa.</li><li>Ghi lại hai thứ hiện bạn đặt trong một file <code>.css</code> riêng mà giờ bạn sẽ viết thành lớp ngay trong mã đánh dấu.</li><li>Nêu một nhu cầu tạo kiểu bạn chưa chắc Tailwind diễn đạt được; bạn sẽ tự trả lời được nó khi hết Chương 2.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được, trong một câu, khác biệt giữa một thư viện CSS bạn liên kết tới và một công cụ SINH ra CSS từ mã đánh dấu của bạn.</p></div>
<h3>📜 Tailwind từ đâu ra — đọc từ kho npm</h3>
<p>Các mốc dưới đây không chép theo trí nhớ: đó là thời điểm phát hành mà kho npm ghi lại cho từng phiên bản. Tailwind do Adam Wathan cùng một nhóm nhỏ khởi xướng; bản 0.1 ra ngày 1/11/2017. Bản 3.0 (12/2021) bật bộ máy sinh theo nhu cầu làm mặc định — bước biến "một tệp khổng lồ rồi lọc bớt" thành "một tệp chỉ bao giờ chứa thứ bạn đã dùng". Bản 4.0 (1/2025) chuyển cấu hình vào ngay trong CSS (<code>@theme</code>).</p>
<div class="out">$ npm view tailwindcss time --json | node -e 'const t=JSON.parse(require("fs").readFileSync(0));for(const v of ["0.1.0","1.0.0","2.0.0","3.0.0","4.0.0","3.4.19","4.3.5"])console.log(v.padEnd(7),t[v].slice(0,10))'
0.1.0   2017-11-01
1.0.0   2019-05-13
2.0.0   2020-11-18
3.0.0   2021-12-09
4.0.0   2025-01-21
3.4.19  2025-12-10
4.3.5   2026-11-06</div>
<p>Điều này quan trọng vì bạn sẽ gặp <strong>cả hai</strong> phiên bản lớn: frontend của chính trang này chạy Tailwind <strong>3.4.19</strong> (và phần lớn bài hướng dẫn trên mạng dạy 3.x), còn <code>npm i tailwindcss</code> hôm nay cài <strong>4.3.5</strong>. Bài đọc đo trên ứng dụng 3.4 thật; video chạy cả hai và chỉ ra mọi khác biệt ngay chỗ nó gây chuyện.</p>
<h3>🔬 Đo thật: cùng một thẻ, bằng thư viện và bằng trình sinh</h3>
<p>Một thẻ nhỏ, dựng hai lần rồi mở bằng Chromium: một lần bằng Bootstrap 5.3.9 (thư viện: một bảng kiểu làm sẵn bạn liên kết tới), một lần bằng Tailwind 4.3.5 (trình sinh). Trang Tailwind:</p>
<pre><code class="language-html">&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;link rel="stylesheet" href="out.css"&gt;&lt;/head&gt;
&lt;body class="bg-slate-100 p-8"&gt;
  &lt;div class="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-lg"&gt;
    &lt;h2 class="text-xl font-bold text-slate-900"&gt;Khoá Tailwind CSS&lt;/h2&gt;
    &lt;p class="mt-2 text-slate-600"&gt;Từ lớp tiện ích tới hệ thiết kế.&lt;/p&gt;
    &lt;button class="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"&gt;Học ngay&lt;/button&gt;
  &lt;/div&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<div class="out">$ npx @tailwindcss/cli -i input.css -o out.css --minify 2&gt;&amp;1 | tail -1
Done in 39ms
$ wc -c bs/bootstrap.min.css tw/out.css | sed '$d'
  232360 bs/bootstrap.min.css
    7420 tw/out.css
$ for f in bs/bootstrap.min.css tw/out.css; do printf '%-22s gzip %6d byte\\n' $f $(gzip -9c $f | wc -c); done
bs/bootstrap.min.css   gzip  30913 byte
tw/out.css             gzip   2238 byte
$ grep -oE '\\.[a-z][a-z0-9-]*' bs/bootstrap.min.css | sort -u | wc -l | sed 's/^ */lớp có trong bootstrap.min.css: /'
lớp có trong bootstrap.min.css: 2032
$ grep -oE 'class="[^"]*"' bs/index.html | sed 's/class="//;s/"//' | tr ' ' '\\n' | sort -u | wc -l | sed 's/^ */lớp trang Bootstrap dùng: /'
lớp trang Bootstrap dùng: 12
$ grep -oE 'class="[^"]*"' tw/index.html | sed 's/class="//;s/"//' | tr ' ' '\\n' | sort -u | wc -l | sed 's/^ */lớp trang Tailwind dùng: /'
lớp trang Tailwind dùng: 20
$ grep -oE '\\.[a-z][a-z0-9:\\\\-]*' tw/out.css | grep -vE '^\\.(sr|not-sr|com)$' | sort -u | tr '\\n' ' '; echo
.bg-cyan-600 .bg-slate-100 .bg-white .font-bold .hover\\:bg-cyan-700:hover .max-w-sm .mt-2 .mt-4 .mx-auto .p-6 .p-8 .px-4 .py-2 .rounded-lg .rounded-xl .shadow-lg .text-slate-600 .text-slate-900 .text-white .text-xl 
$ tr '}' '\\n' &lt; tw/out.css | grep -E '^\\.(p-6|text-xl|bg-cyan-600|mt-4)\\{' | sed 's/$/}/'
.mt-4{margin-top:calc(var(--spacing) * 4)}
.bg-cyan-600{background-color:var(--color-cyan-600)}
.p-6{padding:calc(var(--spacing) * 6)}
.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}</div>
<p>Bootstrap gửi cả khoảng 2.000 lớp dù trang dùng 12 hay 1.200. Tailwind viết đúng 20 luật trang cần, cộng phần kiểu nền. Mỗi luật làm một việc:</p>
<div class="out">$ tr '}' '\\n' &lt; tw/out.css | grep -E '^\\.(p-6|text-xl|bg-cyan-600|mt-4)\\{' | sed 's/$/}/'
.mt-4{margin-top:calc(var(--spacing) * 4)}
.bg-cyan-600{background-color:var(--color-cyan-600)}
.p-6{padding:calc(var(--spacing) * 6)}
.text-xl{font-size:var(--text-xl);line-height:var(--tw-leading,var(--text-xl--line-height))}</div>
<p>Và trên một ứng dụng thật — chính trang này, hôm nay:</p>
<div class="out">$ grep -A1 '"node_modules/tailwindcss"' package-lock.json | tail -1 | sed 's/^ *//'
"version": "3.4.19",
$ for u in $(curl -s https://cuongthai.com/ | grep -oE '/_next/static/css/[^"]+\\.css' | sort -u); do curl -s https://cuongthai.com$u | wc -c; done | awk '{s+=$1} END {printf "CSS của trang chủ cuongthai.com: %d byte\\n", s}'
CSS của trang chủ cuongthai.com: 705653 byte</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">mkdir tw-thu &amp;&amp; cd tw-thu &amp;&amp; npm init -y
npm i tailwindcss @tailwindcss/cli
echo '@import "tailwindcss";' &gt; input.css
<span class="tok-comment"># viết index.html với vài lớp, rồi:</span>
npx @tailwindcss/cli -i input.css -o out.css --minify
wc -c out.css
tr '}' '\\n' &lt; out.css | grep -E '^\\.(p-6|mt-4)\\{'</code></pre>
<p>Thêm một lớp vào <code>index.html</code>, dựng lại, so <code>wc -c</code>. Rồi dùng lại một lớp đã có thêm trăm lần: kích thước không nhích.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — CSS là gì: bộ chọn, cascade, kế thừa</span><span class="lc-sub">Luật CSS thuần mà mọi lớp tiện ích ngồi lên</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-2-box-model" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.2 — Mô hình hộp</span><span class="lc-sub">Thứ mà p-6, mt-4 và max-w-sm thật sự thay đổi</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-1-styling-va-tailwind" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.1 — Các cách style, và vì sao Tailwind</span><span class="lc-sub">Tailwind trong một ứng dụng Next.js 16 thật, và 7 lớp đang vắng trên cuongthai.com</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Utility class</span><span class="v">Lớp tiện ích: một lớp nhỏ một-việc như <code>p-4</code> hay <code>flex</code>, ánh xạ tới một hai khai báo CSS.</span></div>
  <div class="kv"><span class="k">Generator</span><span class="v">Trình sinh: công cụ lúc dựng viết ra bảng kiểu từ những lớp nó thấy, thay vì giao một file cố định.</span></div>
  <div class="kv"><span class="k">Scale</span><span class="v">Thang: tập giá trị cố định (khoảng cách, màu, kích thước) mà tên tiện ích được suy ra từ đó.</span></div>
  <div class="kv"><span class="k">Variant</span><span class="v">Biến thể: tiền tố điều kiện như <code>hover:</code> hay <code>md:</code> gắn lên một tiện ích.</span></div>
  <div class="kv"><span class="k">Utility-first</span><span class="v">Tiện ích trước: ghép tiện ích trong mã đánh dấu thay vì viết khối quy tắc có nghĩa ở file riêng.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tailwind sinh ra một bảng kiểu CSS từ những tên lớp nó thấy trong mã nguồn — bạn tạo kiểu bằng cách ghép tiện ích trong mã đánh dấu.</li><li>Hết khoá, bạn sẽ suy ra lớp từ thang, tạo kiểu có điều kiện, phân giải xung đột, cấu hình trình sinh, và chẩn đoán lỗi.</li><li>Khoá giả định HTML/CSS cơ bản, không đòi kinh nghiệm Tailwind, React hay công cụ dựng.</li><li>Mọi con số được đo từ một kho mã thật, nên các lời khẳng định kiểm được.</li></ul>
</div>
`,
    },

    /* ─────────────────────── Bắt đầu tại đây 2/2 ─────────────────────── */
    {
      title: 'Start here (2/2) — What you need first, and how to study this course|||Bắt đầu tại đây (2/2) — Cần biết gì trước, và cách học khoá này',
      slug: 'tw-0-0-start-here-2',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bài thứ hai của cặp mở đầu: mô hình tinh thần duy nhất cả khoá treo lên, nền bạn nên có trước Chương 1, bản đồ các chương, và cách học trung thực cho một khoá mà cốt lõi là số đo — tự chạy lệnh.',
      content: `
${G00_9}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>What you need first, and how to study this course</h2>
<p class="lead">The first lesson said what Tailwind is. This one gives you the single mental model the whole course hangs on, what you should already know before Chapter 1, the map of the chapters, and the honest way to study a course whose point is measured numbers: run the commands yourself.</p>
<h3>The one mental model</h3>
<p>Hold on to a single sentence and most surprises stop being surprising: Tailwind reads your source as text and writes a stylesheet of only the classes it found. From that one fact follow the three things beginners trip on — a class assembled at runtime does not exist, the stylesheet does not grow when you reuse utilities, and when two utilities conflict the winner is set by Tailwind's output order, not yours. Lesson 0.1 proves each of these.</p>
<h3>What you should already know</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HTML</span><span class="v">Elements, attributes, and the <code>class</code> attribute.</span></div>
  <div class="kv"><span class="k">CSS basics</span><span class="v"><code>padding</code>, <code>color</code>, a class selector, and roughly what the cascade is.</span></div>
  <div class="kv"><span class="k">A little JSX</span><span class="v">This repo is React, so examples use <code>className</code>; you do not need to know React itself.</span></div>
  <div class="kv"><span class="k">The terminal</span><span class="v">You will run a few <code>grep</code> and <code>npx</code> commands to check claims.</span></div>
</div>
<h3>The chapter map</h3>
<p>Chapters 1-2 are the generator's vocabulary — the scale, and how a variant prefix compiles. Chapters 3-4 are where the model leaks — conflict resolution and composing classes dynamically. Chapters 5-7 configure the generator — extending the theme, CSS variables for theming, and layers. Chapters 8-10 operate it — size, accessibility, and a diagnosis cookbook. Chapter 11 is what survived measurement plus a final exam.</p>
<h3>How to study it</h3>
<p>Reading a measurement is not the same as taking it. Each table in this course is a number someone ran against this repository; the fastest way to make the ideas stick is to run the same command on a project of your own and compare. When a lesson shows a <code>grep</code> or an <code>npx tailwindcss</code> invocation, type it. The one habit that pays off all course: before reaching for <code>!important</code>, grep the built CSS to see whether the rule was even generated.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In a scratch folder, make a minimal Tailwind input and generate CSS once:</li></ol>
<pre><code class="language-bash">$ npm i tailwindcss @tailwindcss/cli          # Tailwind 4: the CLI is its own package
$ npx @tailwindcss/cli -i input.css -o out.css
$ grep -cE '^ *\\.[a-z]' out.css      # rules (Tailwind 4 indents them inside @layer)
</code></pre>
<ol start="2"><li>Add a few classes (<code>flex</code>, <code>p-4</code>, <code>text-xl</code>) to a file the config scans, regenerate, and watch the rule count change.</li><li>Write the one-sentence mental model from memory and list the three consequences it predicts.</li></ol>
<p><strong>Done when:</strong> you have generated a CSS file yourself and can recite the one sentence plus its three consequences.</p></div>
<h3>✅ Check yourself before Chapter 1</h3>
<ol><li>What does <code>padding</code> change, and what does <code>margin</code> change? (Web Foundations 3.2)</li>
<li>Two rules match one element with the same specificity. Which one wins? (Web Foundations 3.1)</li>
<li>In <code>display: flex</code>, what are the main axis and the cross axis? (Web Foundations 3.3)</li>
<li>What does <code>@media (min-width: 768px)</code> mean? (Web Foundations 3.5)</li>
<li>Can you run a command in a terminal and read its output?</li></ol>
<p>Stuck on one? Do that lesson first — it is shorter than fighting Tailwind without it.</p>
<h3>🔬 Measured: the cascade, the one plain-CSS rule you need</h3>
<p>Two rules, <code>.do { color: red }</code> then <code>.xanh { color: blue }</code>, and two paragraphs listing the classes in opposite orders. Chromium:</p>
<div class="out">class="do xanh"   rgb(0, 0, 255)
class="xanh do"   rgb(0, 0, 255)</div>
<p>Both blue. The order inside <code>class="…"</code> does nothing; with equal specificity the rule written later <em>in the stylesheet</em> wins. Tailwind writes the stylesheet — so Tailwind's order decides your conflicts (Chapter 3).</p>
<h3>🧯 Two real incidents on this site</h3>
<p><strong>1. Badges that lost their colour.</strong> Language badges on <code>/repos</code> take their classes from <code>src/lib/repos.ts</code>, but Tailwind 3's <code>content</code> list never scanned <code>src/lib</code>. The one-line fix landed in the repository on 14/11/2026; the live CSS (before that deploy) still has none of those classes:</p>
<div class="out">$ sed -n '4,10p' tailwind.config.ts
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // 14/11/2026: lớp màu khai trong src/lib (repos.ts huy hiệu ngôn ngữ, studio-meta.ts) trước đây KHÔNG được quét
    // ⇒ 8 lớp không có trong CSS prod (huy hiệu Shell/Swift/C++/C#/JavaScript ở /repos mất màu; ring ở /creator).
    "./src/lib/**/*.{js,ts,jsx,tsx}",
$ git -C .. log -1 --format='%h %ad %s' --date=short -- frontend/tailwind.config.ts | cut -c1-110
63c4a65f7 2026-11-14 fix(web): Tailwind quét cả src/lib — 8 lớp màu của huy hiệu /repos và /creator vắng khỏi 
$ grep -n "Shell:" src/lib/repos.ts
22:  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
$ for s in '.bg-lime-500\\/20' '.text-lime-300' '.border-lime-500\\/30' '.bg-sky-500\\/20'; do printf '%-22s %s\\n' "$s" "$(grep -cF "$s{" $TMPDIR/prod.css)"; done
.bg-lime-500\\/20       0
.text-lime-300         0
.border-lime-500\\/30   0
.bg-sky-500\\/20        1</div>
<p><strong>2. One class name that broke a feature</strong> (the repository's incident log, 2026-07-02): the global dark theme put a class named <code>dark</code> on <code>&lt;html&gt;</code>, which switches on every <code>dark:</code> utility beneath it — including those of the Notes page, which has its own theme switcher. The global class was renamed <code>theme-dark</code>. Lesson 2.4 reads what <code>dark:</code> compiles to.</p>
<h3>⚠️ Two traps when an older tutorial meets Tailwind 4</h3>
<p><strong>Trap 1 — <code>npx tailwindcss</code> does not exist any more</strong> if you only installed <code>tailwindcss</code>:</p>
<div class="out">$ npm ls --depth=0 2&gt;/dev/null | tail -n +2      # chỉ cài tailwindcss, như bài hướng dẫn cũ
└── tailwindcss@4.3.5
$ npx --no-install tailwindcss -i input.css -o out.css 2&gt;&amp;1 | tail -2
npm error could not determine executable to run
npm error A complete log of this run can be found in: /Users/admin/.npm/_logs/2026-11-14T02_43_13_486Z-debug-0.log
$ ls node_modules/.bin 2&gt;/dev/null | grep -c tailwind
0</div>
<p>In Tailwind 4 the <code>tailwindcss</code> package is the engine; the CLI is <code>@tailwindcss/cli</code> (PostCSS: <code>@tailwindcss/postcss</code>, Vite: <code>@tailwindcss/vite</code>).</p>
<p><strong>Trap 2 — a counting command that silently returns 0.</strong> Same page, three classes:</p>
<div class="out">$ npx @tailwindcss/cli -i input.css -o out.css 2&gt;&amp;1 | tail -1
Done in 21ms
$ grep -c '^\\.' out.css; echo "(lệnh đếm '^\\.' của bài cũ)"
0
(lệnh đếm '^\\.' của bài cũ)
$ grep -cE '^ *\\.[a-z]' out.css; echo "(đếm cả dòng thụt lề)"
3
(đếm cả dòng thụt lề)
$ sed -n "$(grep -n '@layer utilities' out.css | cut -d: -f1),+4p" out.css
@layer utilities {
  .flex {
    display: flex;
  }
  .p-4 {</div>
<div class="out">$ grep -c '^\\.' out.css
3
$ grep -nE '^\\.(flex|p-4|text-xl) \\{' out.css
557:.flex {
561:.p-4 {
565:.text-xl {</div>
<p>Tailwind 4 nests rules inside <code>@layer utilities { … }</code>, indented; the old pattern only matched Tailwind 3's unindented output. Before trusting a number, check what the command measures.</p>
<h3>🗺 Minimum path, full path</h3>
<p><strong>Minimum (≈ 2 weeks):</strong> Section 0, Chapters 1–4 and 10 — enough to style real pages and fix "my class does nothing". <strong>Full (≈ 5–6 weeks):</strong> all 11 chapters and the final exam. One session = one lesson plus its commands (45–60 min); the Code Lab module the next day.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">mkdir chi4 &amp;&amp; cd chi4 &amp;&amp; npm init -y &amp;&amp; npm i tailwindcss
echo '@import "tailwindcss";' &gt; input.css
npx tailwindcss -i input.css -o out.css      <span class="tok-comment">  # read the error</span>
npm i @tailwindcss/cli
echo '&lt;p class="flex p-4 text-xl"&gt;hi&lt;/p&gt;' &gt; index.html
npx @tailwindcss/cli -i input.css -o out.css
grep -c '^\\.' out.css ; grep -cE '^ *\\.[a-z]' out.css</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — Selectors, cascade, inheritance</span><span class="lc-sub">Question 2 of the self-check</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-3-flexbox" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.3 — Flexbox</span><span class="lc-sub">Question 3: main axis vs cross axis</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-5-responsive" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.5 — Responsive design</span><span class="lc-sub">Question 4: what a min-width media query means</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-2-hook-styling" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.2 — Styling: CSS Modules or Tailwind</span><span class="lc-sub">If you come from React: the same choice inside a component</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mental model</span><span class="v">The one sentence — reads source as text, writes only what it found — that the whole course derives from.</span></div>
  <div class="kv"><span class="k">Cascade</span><span class="v">The CSS rule that, at equal specificity, the later rule in the stylesheet wins; Tailwind controls that order.</span></div>
  <div class="kv"><span class="k"><code>content</code> globs</span><span class="v">The config patterns that decide which files Tailwind scans.</span></div>
  <div class="kv"><span class="k">Built CSS</span><span class="v">The generated output file; grepping it is the first diagnostic step.</span></div>
  <div class="kv"><span class="k">Measured vs reasoned</span><span class="v">A number someone ran versus one inferred — the course labels which.</span></div>
</div>
<h3>📌 Summary</h3>
<ul><li>One sentence carries the course: Tailwind reads source as text and writes a stylesheet of only the classes it found.</li><li>Come in knowing basic HTML/CSS and the terminal; React itself is not required.</li><li>The chapters go vocabulary (1-2), leaks (3-4), configuration (5-7), operation (8-10), and a wrap-up plus exam (11).</li><li>Study by running the commands; before <code>!important</code>, grep the built CSS to see if the rule exists.</li></ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Cần biết gì trước, và cách học khoá này</h2>
<p class="lead">Bài đầu nói Tailwind là gì. Bài này cho bạn mô hình tinh thần DUY NHẤT mà cả khoá treo lên, những gì bạn nên biết sẵn trước Chương 1, bản đồ các chương, và cách học trung thực cho một khoá mà cốt lõi là những con số đo được: hãy tự chạy lệnh.</p>
<h3>Mô hình tinh thần duy nhất</h3>
<p>Giữ lấy một câu thì phần lớn bất ngờ thôi là bất ngờ: Tailwind đọc mã nguồn của bạn như văn bản và viết ra một bảng kiểu chỉ chứa những lớp nó tìm thấy. Từ đúng một sự thật đó suy ra ba thứ người mới vấp — một lớp ghép lúc chạy thì không tồn tại, bảng kiểu không phình khi bạn dùng lại tiện ích, và khi hai tiện ích xung đột thì kẻ thắng do thứ tự đầu ra của Tailwind quyết định, không phải của bạn. Bài 0.1 chứng minh từng cái.</p>
<h3>Bạn nên biết sẵn gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HTML</span><span class="v">Phần tử, thuộc tính, và thuộc tính <code>class</code>.</span></div>
  <div class="kv"><span class="k">CSS basics</span><span class="v">CSS cơ bản: <code>padding</code>, <code>color</code>, một bộ chọn lớp, và đại khái cascade là gì.</span></div>
  <div class="kv"><span class="k">A little JSX</span><span class="v">Chút JSX: kho này dùng React nên ví dụ dùng <code>className</code>; bạn không cần biết React.</span></div>
  <div class="kv"><span class="k">The terminal</span><span class="v">Dòng lệnh: bạn sẽ chạy vài lệnh <code>grep</code> và <code>npx</code> để kiểm các lời khẳng định.</span></div>
</div>
<h3>Bản đồ các chương</h3>
<p>Chương 1-2 là vốn từ của trình sinh — cái thang, và một tiền tố biến thể biên dịch ra sao. Chương 3-4 là chỗ mô hình rò rỉ — phân giải xung đột và ghép lớp động. Chương 5-7 cấu hình trình sinh — mở rộng theme, biến CSS để tạo theme, và layer. Chương 8-10 vận hành nó — kích thước, khả năng tiếp cận, và một sách chẩn đoán. Chương 11 là cái sống qua đo lường cộng một đề thi cuối.</p>
<h3>Cách học</h3>
<p>Đọc một số đo không giống việc tự đo. Mỗi bảng trong khoá này là một con số có người chạy trên chính kho này; cách nhanh nhất để ý tưởng bám lại là chạy đúng lệnh ấy trên một dự án của bạn và so. Khi một bài hiện một lệnh <code>grep</code> hay một lời gọi <code>npx tailwindcss</code>, hãy gõ nó. Thói quen đáng giá suốt khoá: trước khi với tới <code>!important</code>, hãy grep CSS đã dựng để xem quy tắc có được sinh ra hay không.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong một thư mục nháp, tạo một input Tailwind tối giản và sinh CSS một lần:</li></ol>
<pre><code class="language-bash">$ npm i tailwindcss @tailwindcss/cli          # Tailwind 4: cong cu dong lenh la goi rieng
$ npx @tailwindcss/cli -i input.css -o out.css
$ grep -cE '^ *\\.[a-z]' out.css      # so luat (Tailwind 4 thut le ben trong @layer)
</code></pre>
<ol start="2"><li>Thêm vài lớp (<code>flex</code>, <code>p-4</code>, <code>text-xl</code>) vào một file mà config quét, sinh lại, và xem số quy tắc đổi.</li><li>Viết lại câu mô hình tinh thần từ trí nhớ và liệt kê ba hệ quả nó dự đoán.</li></ol>
<p><strong>Đạt khi:</strong> bạn đã tự sinh một file CSS và đọc thuộc được một câu ấy cùng ba hệ quả của nó.</p></div>
<h3>✅ Tự kiểm trước Chương 1</h3>
<ol><li><code>padding</code> đổi cái gì, <code>margin</code> đổi cái gì? (Nền tảng Web 3.2)</li>
<li>Hai luật cùng khớp một phần tử, cùng độ đặc hiệu. Luật nào thắng? (Nền tảng Web 3.1)</li>
<li>Với <code>display: flex</code>, trục chính và trục phụ là gì? (Nền tảng Web 3.3)</li>
<li><code>@media (min-width: 768px)</code> nghĩa là gì? (Nền tảng Web 3.5)</li>
<li>Bạn chạy được một lệnh trong terminal và đọc kết quả của nó chưa?</li></ol>
<p>Vấp câu nào thì học bài đó trước — ngắn hơn nhiều so với vật lộn với Tailwind khi thiếu nó.</p>
<h3>🔬 Đo thật: cascade, luật CSS thuần duy nhất bạn cần</h3>
<p>Hai luật, <code>.do { color: red }</code> rồi <code>.xanh { color: blue }</code>, và hai đoạn văn ghi lớp theo hai thứ tự ngược nhau. Chromium đo:</p>
<div class="out">class="do xanh"   rgb(0, 0, 255)
class="xanh do"   rgb(0, 0, 255)</div>
<p>Cả hai đều xanh. Thứ tự trong <code>class="…"</code> không làm gì; cùng độ đặc hiệu thì luật viết sau <em>trong bảng kiểu</em> thắng. Tailwind viết bảng kiểu — nên thứ tự của Tailwind quyết định xung đột của bạn (Chương 3).</p>
<h3>🧯 Hai sự cố thật trên chính trang này</h3>
<p><strong>1. Huy hiệu mất màu.</strong> Huy hiệu ngôn ngữ ở <code>/repos</code> lấy lớp từ <code>src/lib/repos.ts</code>, nhưng danh sách <code>content</code> của Tailwind 3 chưa bao giờ quét <code>src/lib</code>. Bản sửa một dòng vào kho ngày 14/11/2026; CSS đang chạy (trước lần deploy đó) vẫn không có lớp nào trong số ấy:</p>
<div class="out">$ sed -n '4,10p' tailwind.config.ts
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // 14/11/2026: lớp màu khai trong src/lib (repos.ts huy hiệu ngôn ngữ, studio-meta.ts) trước đây KHÔNG được quét
    // ⇒ 8 lớp không có trong CSS prod (huy hiệu Shell/Swift/C++/C#/JavaScript ở /repos mất màu; ring ở /creator).
    "./src/lib/**/*.{js,ts,jsx,tsx}",
$ git -C .. log -1 --format='%h %ad %s' --date=short -- frontend/tailwind.config.ts | cut -c1-110
63c4a65f7 2026-11-14 fix(web): Tailwind quét cả src/lib — 8 lớp màu của huy hiệu /repos và /creator vắng khỏi 
$ grep -n "Shell:" src/lib/repos.ts
22:  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
$ for s in '.bg-lime-500\\/20' '.text-lime-300' '.border-lime-500\\/30' '.bg-sky-500\\/20'; do printf '%-22s %s\\n' "$s" "$(grep -cF "$s{" $TMPDIR/prod.css)"; done
.bg-lime-500\\/20       0
.text-lime-300         0
.border-lime-500\\/30   0
.bg-sky-500\\/20        1</div>
<p><strong>2. Một tên lớp làm hỏng một tính năng</strong> (sổ sự cố của kho, 02/07/2026): giao diện tối toàn trang gắn lớp tên <code>dark</code> lên <code>&lt;html&gt;</code> — đúng lớp bật mọi tiện ích <code>dark:</code> bên dưới, kể cả của trang Ghi chú vốn có bộ đổi giao diện riêng. Lớp toàn trang được đổi tên thành <code>theme-dark</code>. Bài 2.4 đọc xem <code>dark:</code> biên dịch ra gì.</p>
<h3>⚠️ Hai cái bẫy khi bài hướng dẫn cũ gặp Tailwind 4</h3>
<p><strong>Bẫy 1 — <code>npx tailwindcss</code> không còn tồn tại</strong> nếu bạn chỉ cài <code>tailwindcss</code>:</p>
<div class="out">$ npm ls --depth=0 2&gt;/dev/null | tail -n +2      # chỉ cài tailwindcss, như bài hướng dẫn cũ
└── tailwindcss@4.3.5
$ npx --no-install tailwindcss -i input.css -o out.css 2&gt;&amp;1 | tail -2
npm error could not determine executable to run
npm error A complete log of this run can be found in: /Users/admin/.npm/_logs/2026-11-14T02_43_13_486Z-debug-0.log
$ ls node_modules/.bin 2&gt;/dev/null | grep -c tailwind
0</div>
<p>Ở Tailwind 4, gói <code>tailwindcss</code> là bộ máy; công cụ dòng lệnh là <code>@tailwindcss/cli</code> (PostCSS: <code>@tailwindcss/postcss</code>, Vite: <code>@tailwindcss/vite</code>).</p>
<p><strong>Bẫy 2 — lệnh đếm lặng lẽ trả về 0.</strong> Cùng một trang, ba lớp:</p>
<div class="out">$ npx @tailwindcss/cli -i input.css -o out.css 2&gt;&amp;1 | tail -1
Done in 21ms
$ grep -c '^\\.' out.css; echo "(lệnh đếm '^\\.' của bài cũ)"
0
(lệnh đếm '^\\.' của bài cũ)
$ grep -cE '^ *\\.[a-z]' out.css; echo "(đếm cả dòng thụt lề)"
3
(đếm cả dòng thụt lề)
$ sed -n "$(grep -n '@layer utilities' out.css | cut -d: -f1),+4p" out.css
@layer utilities {
  .flex {
    display: flex;
  }
  .p-4 {</div>
<div class="out">$ grep -c '^\\.' out.css
3
$ grep -nE '^\\.(flex|p-4|text-xl) \\{' out.css
557:.flex {
561:.p-4 {
565:.text-xl {</div>
<p>Tailwind 4 lồng luật trong <code>@layer utilities { … }</code>, thụt lề; mẫu cũ chỉ khớp đầu ra không thụt lề của Tailwind 3. Trước khi tin một con số, hỏi lệnh ấy thật ra đo cái gì.</p>
<h3>🗺 Lộ trình tối thiểu, lộ trình đầy đủ</h3>
<p><strong>Tối thiểu (≈ 2 tuần):</strong> Mục 0, Chương 1–4 và Chương 10 — đủ để tạo kiểu trang thật và sửa "lớp của tôi không ăn". <strong>Đầy đủ (≈ 5–6 tuần):</strong> cả 11 chương và đề thi cuối. Một buổi = một bài cộng các lệnh của nó (45–60 phút); hôm sau làm module Code Lab.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">mkdir chi4 &amp;&amp; cd chi4 &amp;&amp; npm init -y &amp;&amp; npm i tailwindcss
echo '@import "tailwindcss";' &gt; input.css
npx tailwindcss -i input.css -o out.css      <span class="tok-comment">  # đọc lỗi</span>
npm i @tailwindcss/cli
echo '&lt;p class="flex p-4 text-xl"&gt;hi&lt;/p&gt;' &gt; index.html
npx @tailwindcss/cli -i input.css -o out.css
grep -c '^\\.' out.css ; grep -cE '^ *\\.[a-z]' out.css</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — Bộ chọn, cascade, kế thừa</span><span class="lc-sub">Câu 2 của phần tự kiểm</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-3-flexbox" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.3 — Flexbox</span><span class="lc-sub">Câu 3: trục chính và trục phụ</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-5-responsive" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.5 — Thiết kế responsive</span><span class="lc-sub">Câu 4: media query min-width nghĩa là gì</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-2-hook-styling" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.2 — Styling: CSS Modules hay Tailwind</span><span class="lc-sub">Nếu bạn đi từ React: cùng lựa chọn đó trong một component</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mental model</span><span class="v">Mô hình tinh thần: một câu — đọc mã như văn bản, chỉ viết ra cái nó tìm thấy — mà cả khoá suy ra từ đó.</span></div>
  <div class="kv"><span class="k">Cascade</span><span class="v">Luật CSS rằng khi cùng độ đặc hiệu, quy tắc đứng sau trong bảng kiểu thắng; Tailwind kiểm soát thứ tự ấy.</span></div>
  <div class="kv"><span class="k"><code>content</code> globs</span><span class="v">Các mẫu glob trong config quyết định Tailwind quét file nào.</span></div>
  <div class="kv"><span class="k">Built CSS</span><span class="v">CSS đã dựng: file đầu ra được sinh; grep nó là bước chẩn đoán đầu tiên.</span></div>
  <div class="kv"><span class="k">Measured vs reasoned</span><span class="v">Đo vs suy luận: con số có người chạy so với con số suy ra — khoá học ghi rõ cái nào.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một câu cõng cả khoá: Tailwind đọc mã nguồn như văn bản và viết ra bảng kiểu chỉ chứa những lớp nó tìm thấy.</li><li>Vào khoá với HTML/CSS cơ bản và dòng lệnh; không bắt buộc biết React.</li><li>Các chương đi theo: vốn từ (1-2), rò rỉ (3-4), cấu hình (5-7), vận hành (8-10), và tổng kết cộng thi (11).</li><li>Học bằng cách chạy lệnh; trước <code>!important</code>, hãy grep CSS đã dựng xem quy tắc có tồn tại không.</li></ul>
</div>
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Tailwind is a generator, not a library|||0.1 — Tailwind là một trình SINH, không phải một thư viện',
      slug: 'tw-0-1-trinh-sinh',
      type: 'VIDEO',
      description: 'Sự khác biệt nghe như chuyện chữ nghĩa, nhưng nó quyết định mọi thứ: vì sao lớp bạn ghép chuỗi lúc chạy KHÔNG tồn tại, vì sao file CSS không phình theo số component, và vì sao "tìm trong docs" thường là cách sai để học nó.',
      content: `
${G00_1}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Tailwind is a generator, not a library</h2>
<p class="lead">Almost every confusing thing about Tailwind — classes that mysteriously do not exist, a CSS file that stays small no matter how many components you add, the fact that two utilities on the same element fight in an order you did not choose — follows from one sentence. Learn the sentence first and most of the surprises stop being surprises.</p>

<div class="callout">
<p><strong>The sentence.</strong> Tailwind reads your source files as <em>text</em>, collects every string that looks like a class name, and generates a CSS file containing only those. It does not ship a stylesheet. It writes one, per build, for your project.</p>
</div>

<h3>Why "library" is the wrong word</h3>
<p>Bootstrap is a library: a fixed CSS file exists on a server, you link it, and every class in it is available whether you use it or not. Tailwind inverts that completely. There is no fixed file. At build time a scanner walks your source, and the output contains exactly the utilities it saw — nothing else. The distinction has three consequences you will meet within your first day:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">a class that is never written is never generated</span><span class="lz-nsub">consequence 1</span></span>
<span class="lz-nbody">If <code>text-4xl</code> appears nowhere in your source, the string <code>.text-4xl</code> appears nowhere in your CSS. Not "unused"; <em>absent</em>. This is why the output stays small, and also why a class assembled at runtime silently does nothing.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the scanner reads TEXT, not code</span><span class="lz-nsub">consequence 2</span></span>
<span class="lz-nbody">It does not parse JSX or evaluate expressions. It looks for character sequences that could be class names. <code>&#96;text-\${size}xl&#96;</code> is not a class name to a text scanner — it is a template with a hole in it, and the hole is never filled at build time.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">output order is Tailwind's, not yours</span><span class="lz-nsub">consequence 3</span></span>
<span class="lz-nbody">Since Tailwind writes the file, Tailwind decides the order rules appear in it. When two utilities set the same property, CSS resolves the tie by <em>source order in the stylesheet</em> — which is Tailwind's order, not the order you typed. Chapter 3 measures exactly what that order is, and the answer is not what most people guess.</span>
</div>
</div>

<h3>Measuring the claim on a real app</h3>
<p>This repository's frontend is a good specimen because it is large enough for the numbers to mean something. Counting every <code>className</code> attribute in <code>src/</code>:</p>

<pre><code class="language-bash">$ cd frontend
$ find src -name "*.tsx" | wc -l
$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" | wc -l
$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" \\
    | sed 's/className="//; s/"$//' | tr ' ' '\\n' | grep -v '^$' | sort -u | wc -l
</code></pre>

<div class="out">1673       # file .tsx          (đo 14/11/2026; lúc soạn khoá: 793)
49298      # thuoc tinh className="..."   (lúc soạn: 26343)
6169       # lop tien ich DUY NHAT        (lúc soạn: 3683)
</div>

<p>Read the third number against the second. Forty-nine thousand class attributes across the app (re-measured 14/11/2026), but only <strong>6,169 distinct utilities</strong> among them — about eight uses each. When the course was written the app was half this size (26,343 and 3,683); the ratio held. That ratio is the whole economic argument for the approach: the CSS Tailwind generates is proportional to the <em>vocabulary</em> you use, not to the number of places you use it. Add a thousand more components that reuse the same utilities and the stylesheet does not grow at all.</p>

<div class="callout ok">
<p><strong>Why the file stops growing.</strong> In hand-written CSS, a new component usually means a new block of rules, so stylesheet size tracks component count. Under a generator, a new component that reuses existing utilities adds <em>zero bytes</em>. This is the property that makes utility CSS scale, and it is a direct consequence of "generator, not library" — not a separate feature.</p>
</div>

<h3>The failure this model predicts</h3>
<p>If the scanner reads text, then any class name that does not exist as a complete literal string in your source cannot be generated. That predicts a specific bug, and it is the single most common Tailwind bug there is:</p>

<pre><code class="language-jsx">// BROKEN — the string "text-red-500" never appears in the file
const color = 'red';
&lt;p className={&#96;text-\${color}-500&#96;}&gt;Error&lt;/p&gt;

// WORKS — both complete class names appear literally
const cls = isError ? 'text-red-500' : 'text-green-500';
&lt;p className={cls}&gt;Error&lt;/p&gt;
</code></pre>

<p>The first version type-checks, renders, produces the markup <code>class="text-red-500"</code> in the browser, and the text is not red. Nothing errors. The class attribute is correct; the rule it refers to was never written into the CSS. Lesson 10.5 hunts the whole family of these (and 8.4 the scanner-config side), but you can already derive it yourself from the one sentence — which is the point of learning the sentence first.</p>

<div class="pitfall">
<p><strong>Trap — searching the docs for a class name you cannot find.</strong> Newcomers hit an unfamiliar need, search "tailwind class for …", find nothing, and conclude Tailwind cannot do it. Usually the class exists and is derivable from the <em>scale</em> (Chapter 1), or the correct answer is an arbitrary value like <code>mt-[7px]</code>. Searching by name is the wrong retrieval strategy for a system whose names are generated from a small set of rules. Learn the rules; the names fall out.</p>
</div>

<h3>What this course does with the sentence</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chapters 1-2</span><span class="lz-d">The generator's vocabulary: the value scale, and why learning the scale beats memorising class names.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chapters 3-4</span><span class="lz-d">Where the model leaks: generation order deciding conflicts, and composing classes dynamically without stepping in it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chapters 5-7</span><span class="lz-d">Configuring the generator: extending the scale, CSS variables so one class is right in both themes, and layers.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chapters 8-10</span><span class="lz-d">Operating it: size, accessibility, and a diagnosis cookbook for "my class does not apply".</span></div>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Tailwind is a program that reads your source as text and writes a stylesheet containing only the utilities it found — so a class you never wrote literally does not exist, a stylesheet does not grow when you reuse utilities, and when two utilities conflict the winner is decided by the order <em>Tailwind</em> wrote them, not the order you typed them.</p>
</div>

<h3>🔬 Measured: the three consequences, on Tailwind 4.3.5</h3>
<p><strong>1 — never written, never generated.</strong> A page using <code>text-2xl</code>, grepped for <code>text-4xl</code>, then edited:</p>
<div class="out">$ grep -c 'text-4xl' out.css
0
$ sed -i '' 's/text-2xl/text-4xl/' index.html &amp;&amp; cat index.html
&lt;h1 class="text-4xl font-bold"&gt;Xin chào&lt;/h1&gt;
$ grep -o '\\.text-4xl{[^}]*}' out.css
.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}</div>
<p><strong>Reuse costs nothing.</strong> One card (7 classes), then the same card 1,000 times:</p>
<div class="out">$ npx @tailwindcss/cli -i input.css -o out.css --minify 2&gt;&amp;1 | tail -1; wc -c &lt; out.css | sed 's/^ */1 thẻ:     /;s/$/ byte/'
Done in 120ms
1 thẻ:     6652 byte
$ grep -o 'class="' index.html | wc -l | sed 's/^ */thuộc tính class trong trang: /'
thuộc tính class trong trang: 3000
$ npx @tailwindcss/cli -i input.css -o out.css --minify 2&gt;&amp;1 | tail -1; wc -c &lt; out.css | sed 's/^ */1000 thẻ:  /;s/$/ byte/'
Done in 112ms
1000 thẻ:  6652 byte</div>
<p><strong>2 — the scanner reads text.</strong> The page script (one name built from a variable, one from a lookup object):</p>
<pre><code class="language-javascript">const mau = 'red';
<span class="tok-comment">// VỠ — tên lớp ghép từ biến lúc chạy</span>
document.getElementById('sai').className = &#96;text-\${mau}-500 font-bold&#96;;
<span class="tok-comment">// CHẠY — bảng tra viết TRỌN tên lớp</span>
const LOP = { red: 'text-red-600', green: 'text-green-600' };
document.getElementById('dung').className = LOP[mau] + ' font-bold';</code></pre>
<div class="out">$ for s in '.text-red-500 ' '.text-red-600 ' '.text-green-600 ' '.font-bold '; do printf '%-18s %s\\n' "$s" "$(grep -c -- "^ *$s{" out.css)"; done
.text-red-500      0
.text-red-600      1
.text-green-600    1
.font-bold         1</div>
<p>Chromium, <code>getComputedStyle(p).color</code>:</p>
<div class="out">text-red-500 font-bold  rgb(0, 0, 0)
text-red-600 font-bold  oklch(0.577 0.245 27.325)</div>
<p>Then only a <em>comment</em> is changed so that it mentions the full name — and the rule appears. The bug did not go away; it hid:</p>
<div class="out">$ sed -i '' 's#// VỠ — tên lớp ghép từ biến lúc chạy#// VỠ — mong ra text-red-500 nhưng tên ghép từ biến#' index.html &amp;&amp; grep -n 'VỠ' index.html
7:    // VỠ — mong ra text-red-500 nhưng tên ghép từ biến
$ printf '%-18s %s\\n' '.text-red-500 ' "$(grep -c -- '^ *.text-red-500 {' out2.css)"
.text-red-500      1</div>
<p><strong>3 — the order is Tailwind's.</strong> Two paragraphs with <code>mt-8 mt-2</code> and <code>mt-2 mt-8</code> (Tailwind wrote <code>.mt-2</code> on line 169 and <code>.mt-8</code> on line 172); plus an arbitrary value:</p>
<div class="out">class="mt-8 mt-2"     32px
class="mt-2 mt-8"     32px
class="mt-[7px]"      7px</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i tailwindcss @tailwindcss/cli
echo '@import "tailwindcss";' &gt; input.css
echo '&lt;p class="mt-8 mt-2 text-2xl"&gt;a&lt;/p&gt;' &gt; index.html
npx @tailwindcss/cli -i input.css -o out.css
grep -c 'text-4xl' out.css         <span class="tok-comment">  # 0 — never written</span>
grep -nE '^ *\\.mt-(2|8) \\{' out.css   <span class="tok-comment">  # which one is written later?</span></code></pre>
<p>Then build a class from a variable in a <code>&lt;script&gt;</code>, open the page and read <code>getComputedStyle</code> in DevTools; add a comment with the full name and build again.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-1-styling-va-tailwind" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.1 — Styling options, and why Tailwind</span><span class="lc-sub">The same built-class bug inside a real Next.js app, plus 7 classes missing on cuongthai.com</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — Selectors, cascade, inheritance</span><span class="lc-sub">Consequence 3 is just this rule</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-10-5-ai" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 10.5 — Dynamic classes and the AI trap</span><span class="lc-sub">The whole family of built class names</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Generator</span><span class="v">A build-time tool that writes a stylesheet from the classes it finds, instead of shipping a fixed one.</span></div>
  <div class="kv"><span class="k">Library (e.g. Bootstrap)</span><span class="v">A fixed stylesheet where every class exists whether you use it or not — the opposite model.</span></div>
  <div class="kv"><span class="k">Text scanner</span><span class="v">Reads source as plain text; it does not parse JSX or evaluate expressions.</span></div>
  <div class="kv"><span class="k">Dynamic class bug</span><span class="v">A class assembled at runtime never appears as a literal string, so it is never generated and silently does nothing.</span></div>
  <div class="kv"><span class="k">Vocabulary vs usage</span><span class="v">Output size tracks distinct utilities used (6,169), not the number of class attributes (49,298).</span></div>
  <div class="kv"><span class="k">Source order</span><span class="v">Tailwind decides the order rules appear in the output, so conflicts resolve by its order, not yours.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Tailwind reads your source as text and generates a stylesheet of only the classes it found — it is a generator, not a library.</li><li>A class never written literally does not exist in the CSS; a runtime-assembled class silently does nothing.</li><li>The stylesheet grows with the vocabulary of utilities you use, not with how many times you use them (6,169 distinct of 49,298 attributes, measured 14/11/2026).</li><li>Because Tailwind writes the file, a conflict between two utilities is decided by its source order, not the order you typed.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — the official statement that the scanner treats files as plain text and does not execute them. The page's "Dynamic class names" section is this lesson's bug, from the horse's mouth.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Styling with utility classes</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes — the core-concept page. Read the whole thing once; it is short and it is the foundation the rest of the docs assume.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS cascade and inheritance</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade — the rule that "later in the stylesheet wins at equal specificity" is plain CSS, not a Tailwind invention. Consequence 3 is CSS doing exactly what it always did.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — the cascade, before a generator touches it</span><span class="lc-sub">/courses/web-foundations/learn${REF} — specificity, inheritance and source order in hand-written CSS. Everything in this course sits on top of those rules; nothing here replaces them.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Tailwind là một trình SINH, không phải một thư viện</h2>
<p class="lead">Gần như mọi thứ khó hiểu ở Tailwind — những lớp tự dưng KHÔNG tồn tại, một file CSS không phình lên dù bạn thêm bao nhiêu component, chuyện hai lớp tiện ích trên cùng một thẻ đánh nhau theo một thứ tự bạn không hề chọn — đều suy ra từ MỘT câu. Học câu đó trước thì phần lớn bất ngờ thôi là bất ngờ.</p>

<div class="callout">
<p><strong>Câu ấy.</strong> Tailwind đọc file mã nguồn của bạn như <em>văn bản</em>, gom mọi chuỗi TRÔNG GIỐNG tên lớp, rồi phát sinh ra một file CSS chỉ chứa đúng chừng ấy. Nó KHÔNG giao cho bạn một bảng kiểu. Nó VIẾT ra một bảng kiểu, mỗi lần dựng, riêng cho dự án của bạn.</p>
</div>

<h3>Vì sao "thư viện" là chữ sai</h3>
<p>Bootstrap là một thư viện: một file CSS cố định nằm sẵn trên máy chủ, bạn liên kết tới, và mọi lớp trong đó đều dùng được dù bạn có dùng hay không. Tailwind lật ngược hoàn toàn. KHÔNG có file cố định nào. Lúc dựng, một bộ quét đi qua mã nguồn, và đầu ra chứa đúng những tiện ích nó THẤY — không gì khác. Sự phân biệt này có ba hệ quả bạn sẽ gặp ngay trong ngày đầu:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">lớp không bao giờ được VIẾT thì không bao giờ được SINH</span><span class="lz-nsub">hệ quả 1</span></span>
<span class="lz-nbody">Nếu <code>text-4xl</code> không xuất hiện ở đâu trong mã nguồn, chuỗi <code>.text-4xl</code> không xuất hiện ở đâu trong CSS của bạn. Không phải "không dùng tới"; là <em>VẮNG MẶT</em>. Đây là lý do đầu ra nhỏ, và cũng là lý do một lớp ghép lúc chạy âm thầm không làm gì.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bộ quét đọc VĂN BẢN, không đọc MÃ</span><span class="lz-nsub">hệ quả 2</span></span>
<span class="lz-nbody">Nó KHÔNG phân tích cú pháp JSX và KHÔNG tính biểu thức. Nó tìm những dãy ký tự CÓ THỂ là tên lớp. <code>&#96;text-\${size}xl&#96;</code> với một bộ quét văn bản thì không phải tên lớp — nó là một khuôn có lỗ hổng, và cái lỗ ấy không bao giờ được điền lúc dựng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">thứ tự đầu ra là của TAILWIND, không phải của bạn</span><span class="lz-nsub">hệ quả 3</span></span>
<span class="lz-nbody">Vì Tailwind VIẾT ra file, Tailwind quyết định thứ tự các quy tắc xuất hiện trong đó. Khi hai tiện ích cùng đặt một thuộc tính, CSS phá hoà bằng <em>thứ tự nguồn TRONG BẢNG KIỂU</em> — tức thứ tự của Tailwind, không phải thứ tự bạn gõ. Chương 3 đo chính xác thứ tự ấy, và câu trả lời KHÁC cái hầu hết mọi người đoán.</span>
</div>
</div>

<h3>Đo lời khẳng định trên một ứng dụng thật</h3>
<p>Frontend của chính kho này là một mẫu vật tốt vì nó đủ lớn để các con số có nghĩa. Đếm mọi thuộc tính <code>className</code> trong <code>src/</code>:</p>

<pre><code class="language-bash">$ cd frontend
$ find src -name "*.tsx" | wc -l
$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" | wc -l
$ grep -ho 'className="[^"]*"' -r src --include="*.tsx" \\
    | sed 's/className="//; s/"$//' | tr ' ' '\\n' | grep -v '^$' | sort -u | wc -l
</code></pre>

<div class="out">1673       # file .tsx          (đo 14/11/2026; lúc soạn khoá: 793)
49298      # thuoc tinh className="..."   (lúc soạn: 26343)
6169       # lop tien ich DUY NHAT        (lúc soạn: 3683)
</div>

<p>Đọc con số thứ ba đối chiếu con số thứ hai. Bốn mươi chín nghìn thuộc tính lớp trải khắp ứng dụng (đo lại 14/11/2026), mà chỉ có <strong>6.169 tiện ích khác nhau</strong> trong đó — mỗi cái dùng khoảng tám lần. Lúc soạn khoá ứng dụng chỉ bằng một nửa (26.343 và 3.683); tỉ lệ vẫn giữ. Tỉ số ấy là toàn bộ lập luận kinh tế của cách làm này: CSS mà Tailwind phát sinh tỉ lệ với <em>VỐN TỪ</em> bạn dùng, không tỉ lệ với SỐ CHỖ bạn dùng nó. Thêm một nghìn component nữa dùng lại đúng những tiện ích đó thì bảng kiểu KHÔNG lớn thêm một byte.</p>

<div class="callout ok">
<p><strong>Vì sao file ngừng phình.</strong> Trong CSS viết tay, một component mới thường có nghĩa một khối quy tắc mới, nên kích thước bảng kiểu bám theo số component. Dưới một trình sinh, một component mới dùng lại tiện ích đã có thì thêm <em>KHÔNG byte nào</em>. Đây là tính chất khiến CSS tiện ích mở rộng được, và nó là hệ quả TRỰC TIẾP của "trình sinh, không phải thư viện" — không phải một tính năng riêng.</p>
</div>

<h3>Cú hỏng mà mô hình này DỰ ĐOÁN ĐƯỢC</h3>
<p>Nếu bộ quét đọc văn bản, thì bất kỳ tên lớp nào KHÔNG tồn tại dưới dạng một chuỗi nguyên vẹn trong mã nguồn đều không thể được sinh. Điều đó dự đoán một lỗi cụ thể, và nó là lỗi Tailwind phổ biến nhất:</p>

<pre><code class="language-jsx">// VO — chuoi "text-red-500" khong bao gio xuat hien trong file
const color = 'red';
&lt;p className={&#96;text-\${color}-500&#96;}&gt;Error&lt;/p&gt;

// CHAY — ca hai ten lop day du deu xuat hien nguyen van
const cls = isError ? 'text-red-500' : 'text-green-500';
&lt;p className={cls}&gt;Error&lt;/p&gt;
</code></pre>

<p>Bản đầu qua type-check, dựng ra được, sinh ra đúng thẻ <code>class="text-red-500"</code> trong trình duyệt, và chữ KHÔNG đỏ. Không có lỗi nào. Thuộc tính lớp thì đúng; quy tắc mà nó trỏ tới chưa bao giờ được viết vào CSS. Bài 10.5 săn cả họ lỗi này (và bài 8.4 phía cấu hình bộ quét), nhưng bạn ĐÃ có thể tự suy ra nó từ một câu duy nhất — đó chính là điểm của việc học câu ấy trước.</p>

<div class="pitfall">
<p><strong>Bẫy — tra tài liệu tìm một tên lớp mà không thấy.</strong> Người mới gặp một nhu cầu lạ, tra "tailwind class cho …", không thấy gì, rồi kết luận Tailwind không làm được. Thường thì lớp ấy CÓ và suy ra được từ <em>THANG giá trị</em> (Chương 1), hoặc câu trả lời đúng là một giá trị tuỳ ý như <code>mt-[7px]</code>. Tra theo TÊN là chiến lược truy hồi sai cho một hệ mà tên được SINH ra từ một tập quy tắc nhỏ. Học quy tắc; tên tự rơi ra.</p>
</div>

<h3>Khoá này làm gì với câu ấy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chương 1-2</span><span class="lz-d">Vốn từ của trình sinh: thang giá trị, và vì sao học THANG thắng học thuộc tên lớp.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chương 3-4</span><span class="lz-d">Chỗ mô hình rò rỉ: thứ tự phát sinh quyết định xung đột, và cách soạn lớp động mà không giẫm phải.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chương 5-7</span><span class="lz-d">Cấu hình trình sinh: mở rộng thang, biến CSS để một lớp đúng ở cả hai theme, và layer.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chương 8-10</span><span class="lz-d">Vận hành nó: kích thước, khả năng tiếp cận, và sách chẩn đoán "lớp của tôi không ăn".</span></div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tailwind là một chương trình đọc mã nguồn của bạn như văn bản và viết ra một bảng kiểu chỉ chứa những tiện ích nó tìm thấy — nên một lớp bạn chưa bao giờ viết nguyên vẹn thì KHÔNG tồn tại, một bảng kiểu KHÔNG phình khi bạn dùng lại tiện ích, và khi hai tiện ích xung đột thì kẻ thắng do thứ tự <em>TAILWIND</em> viết quyết định, không phải thứ tự bạn gõ.</p>
</div>

<h3>🔬 Đo thật: ba hệ quả, trên Tailwind 4.3.5</h3>
<p><strong>1 — không viết thì không sinh.</strong> Trang dùng <code>text-2xl</code>, grep <code>text-4xl</code>, rồi sửa trang:</p>
<div class="out">$ grep -c 'text-4xl' out.css
0
$ sed -i '' 's/text-2xl/text-4xl/' index.html &amp;&amp; cat index.html
&lt;h1 class="text-4xl font-bold"&gt;Xin chào&lt;/h1&gt;
$ grep -o '\\.text-4xl{[^}]*}' out.css
.text-4xl{font-size:var(--text-4xl);line-height:var(--tw-leading,var(--text-4xl--line-height))}</div>
<p><strong>Dùng lại không tốn gì.</strong> Một thẻ (7 lớp), rồi đúng thẻ đó nhân 1.000 lần:</p>
<div class="out">$ npx @tailwindcss/cli -i input.css -o out.css --minify 2&gt;&amp;1 | tail -1; wc -c &lt; out.css | sed 's/^ */1 thẻ:     /;s/$/ byte/'
Done in 120ms
1 thẻ:     6652 byte
$ grep -o 'class="' index.html | wc -l | sed 's/^ */thuộc tính class trong trang: /'
thuộc tính class trong trang: 3000
$ npx @tailwindcss/cli -i input.css -o out.css --minify 2&gt;&amp;1 | tail -1; wc -c &lt; out.css | sed 's/^ */1000 thẻ:  /;s/$/ byte/'
Done in 112ms
1000 thẻ:  6652 byte</div>
<p><strong>2 — máy quét đọc chữ.</strong> Đoạn script của trang (một tên ghép từ biến, một tên lấy từ bảng tra):</p>
<pre><code class="language-javascript">const mau = 'red';
<span class="tok-comment">// VỠ — tên lớp ghép từ biến lúc chạy</span>
document.getElementById('sai').className = &#96;text-\${mau}-500 font-bold&#96;;
<span class="tok-comment">// CHẠY — bảng tra viết TRỌN tên lớp</span>
const LOP = { red: 'text-red-600', green: 'text-green-600' };
document.getElementById('dung').className = LOP[mau] + ' font-bold';</code></pre>
<div class="out">$ for s in '.text-red-500 ' '.text-red-600 ' '.text-green-600 ' '.font-bold '; do printf '%-18s %s\\n' "$s" "$(grep -c -- "^ *$s{" out.css)"; done
.text-red-500      0
.text-red-600      1
.text-green-600    1
.font-bold         1</div>
<p>Chromium, <code>getComputedStyle(p).color</code>:</p>
<div class="out">text-red-500 font-bold  rgb(0, 0, 0)
text-red-600 font-bold  oklch(0.577 0.245 27.325)</div>
<p>Rồi chỉ sửa một <em>chú thích</em> cho nó nhắc tên trọn — và luật xuất hiện. Lỗi không mất; nó trốn:</p>
<div class="out">$ sed -i '' 's#// VỠ — tên lớp ghép từ biến lúc chạy#// VỠ — mong ra text-red-500 nhưng tên ghép từ biến#' index.html &amp;&amp; grep -n 'VỠ' index.html
7:    // VỠ — mong ra text-red-500 nhưng tên ghép từ biến
$ printf '%-18s %s\\n' '.text-red-500 ' "$(grep -c -- '^ *.text-red-500 {' out2.css)"
.text-red-500      1</div>
<p><strong>3 — thứ tự là của Tailwind.</strong> Hai đoạn văn ghi <code>mt-8 mt-2</code> và <code>mt-2 mt-8</code> (Tailwind viết <code>.mt-2</code> ở dòng 169, <code>.mt-8</code> ở dòng 172); thêm một giá trị tuỳ ý:</p>
<div class="out">class="mt-8 mt-2"     32px
class="mt-2 mt-8"     32px
class="mt-[7px]"      7px</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i tailwindcss @tailwindcss/cli
echo '@import "tailwindcss";' &gt; input.css
echo '&lt;p class="mt-8 mt-2 text-2xl"&gt;a&lt;/p&gt;' &gt; index.html
npx @tailwindcss/cli -i input.css -o out.css
grep -c 'text-4xl' out.css         <span class="tok-comment">  # 0 — chưa viết</span>
grep -nE '^ *\\.mt-(2|8) \\{' out.css   <span class="tok-comment">  # lớp nào được viết sau?</span></code></pre>
<p>Rồi ghép một lớp từ biến trong <code>&lt;script&gt;</code>, mở trang và đọc <code>getComputedStyle</code> trong DevTools; thêm một chú thích có tên trọn rồi dựng lại.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-1-styling-va-tailwind" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.1 — Các cách style, và vì sao Tailwind</span><span class="lc-sub">Cùng lỗi lớp ghép trong một ứng dụng Next.js thật, kèm 7 lớp vắng trên cuongthai.com</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — Bộ chọn, cascade, kế thừa</span><span class="lc-sub">Hệ quả 3 chính là luật này</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-10-5-ai" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 10.5 — Lớp động và bẫy AI</span><span class="lc-sub">Cả họ lỗi tên lớp ghép</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Generator</span><span class="v">Trình sinh: công cụ lúc dựng viết ra bảng kiểu từ những lớp nó tìm thấy, thay vì giao một file cố định.</span></div>
  <div class="kv"><span class="k">Library (ví dụ Bootstrap)</span><span class="v">Thư viện: một bảng kiểu cố định mà mọi lớp đều có sẵn dù bạn dùng hay không — mô hình ngược lại.</span></div>
  <div class="kv"><span class="k">Text scanner</span><span class="v">Bộ quét đọc mã nguồn như văn bản thuần; không phân tích JSX, không tính biểu thức.</span></div>
  <div class="kv"><span class="k">Dynamic class bug</span><span class="v">Lỗi lớp động: lớp ghép lúc chạy không xuất hiện dưới dạng chuỗi nguyên vẹn nên không được sinh, âm thầm không làm gì.</span></div>
  <div class="kv"><span class="k">Vocabulary vs usage</span><span class="v">Kích thước đầu ra bám theo số tiện ích KHÁC NHAU được dùng (6.169), không theo số thuộc tính lớp (49.298).</span></div>
  <div class="kv"><span class="k">Source order</span><span class="v">Thứ tự nguồn: Tailwind quyết định thứ tự quy tắc trong đầu ra, nên xung đột phân giải theo thứ tự của nó, không phải của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Tailwind đọc mã nguồn như văn bản và sinh ra bảng kiểu chỉ chứa những lớp nó tìm thấy — nó là một trình sinh, không phải thư viện.</li><li>Lớp chưa bao giờ được viết nguyên vẹn thì không tồn tại trong CSS; lớp ghép lúc chạy âm thầm không làm gì.</li><li>Bảng kiểu lớn theo VỐN TỪ tiện ích bạn dùng, không theo số lần dùng (6.169 duy nhất trong 49.298 thuộc tính, đo 14/11/2026).</li><li>Vì Tailwind viết ra file, xung đột giữa hai tiện ích do thứ tự nguồn của nó quyết định, không phải thứ tự bạn gõ.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — lời khẳng định chính thức rằng bộ quét coi file là văn bản thuần và KHÔNG thực thi chúng. Mục "Dynamic class names" của trang ấy chính là con bọ trong bài này, nói từ chính miệng ngựa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Styling with utility classes</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes — trang khái niệm lõi. Đọc hết một lần; nó ngắn và là nền mà phần còn lại của tài liệu mặc định bạn đã biết.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS cascade and inheritance</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade — luật "đứng sau trong bảng kiểu thì thắng khi cùng độ đặc hiệu" là CSS THUẦN, không phải phát minh của Tailwind. Hệ quả 3 chỉ là CSS làm đúng cái nó vẫn luôn làm.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — cascade, trước khi một trình sinh chạm vào</span><span class="lc-sub">/courses/web-foundations/learn${REF} — độ đặc hiệu, kế thừa và thứ tự nguồn trong CSS viết tay. Mọi thứ trong khoá này ngồi TRÊN các luật đó; không có gì ở đây thay thế chúng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — "This is just inline styles" — measuring the objection|||0.2 — "Cái này khác gì inline style" — đo lời phản đối',
      slug: 'tw-0-2-phan-doi',
      type: 'VIDEO',
      description: 'Lời phản đối phổ biến nhất, và một phép đo dứt điểm nó: 11.646 tiện ích trong kho này diễn đạt những thứ mà `style={{}}` KHÔNG THỂ diễn đạt được — không phải "bất tiện hơn", mà là KHÔNG CÓ CÚ PHÁP nào để viết.',
      content: `
${G00_2}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>"This is just inline styles" — measuring the objection</h2>
<p class="lead">Every developer meeting utility CSS says some version of this, and it deserves a real answer rather than a taste argument. The honest answer has two halves: the visual resemblance is genuine, and the functional claim is false in a way you can count.</p>

<h3>Granting the resemblance</h3>
<p>The objection is not silly. Compare:</p>

<pre><code class="language-jsx">&lt;div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}&gt;
&lt;div className="flex items-center p-4"&gt;
</code></pre>

<p>Both put presentation in the markup. Both make the element's appearance readable at the point of use. Both mean a redesign touches component files rather than a stylesheet. If your objection is <em>"styling belongs in a separate file"</em>, utility CSS does not answer it — it disagrees with it, and that is a real design disagreement, not a misunderstanding.</p>

<h3>Where the resemblance stops</h3>
<p>But the objection usually smuggles in a stronger claim: that utilities are <em>equivalent</em> to inline styles, so you gain nothing. That claim is testable. The <code>style</code> attribute has no syntax for a conditional — no media query, no pseudo-class, no pseudo-element. There is no way to write "padding 1rem, but 2rem above 640px" or "blue, but darker on hover" in a <code>style</code> attribute. Not awkwardly; <em>at all</em>.</p>

<p>So count how much of a real codebase depends on exactly those:</p>

<pre><code class="language-bash">$ cd frontend
$ for v in hover focus active disabled group-hover focus-visible sm md lg xl 2xl; do
    printf "%-14s %6d\\n" "$v:" "$(grep -rho "\\b$v:" src --include="*.tsx" | wc -l)"
  done
</code></pre>

<div class="out">hover:           5242
focus:           1028
active:           284
disabled:         838
group-hover:      312
focus-visible:    346
                 ─────
trang thai:      8050

sm:              2112
md:               734
lg:               652
xl:                87
2xl:               11
                 ─────
diem ngat:       3596

TONG:           11646      # do lai 14/11/2026 (luc soan khoa: 7758)
</div>

<p><strong>11,646 utilities</strong> in this codebase express something the <code>style</code> attribute has no syntax for. That is the measured refutation. It is not that utilities are a nicer way to write inline styles — it is that a majority of the interesting styling in a real app is <em>conditional</em>, and inline styles cannot express conditions.</p>

<div class="callout ok">
<p><strong>The right framing.</strong> A utility class is not an inline style. It is a <em>named reference to a rule in a stylesheet</em> — and because it lives in a stylesheet, it gets everything stylesheets have: media queries, pseudo-classes, pseudo-elements, and the cascade. It merely happens to be referenced from the markup. The reference is in the markup; the rule is not.</p>
</div>

<h3>What inline styles are still for</h3>
<p>This cuts both ways, and the same codebase shows where the line falls. Inline styles are still used <strong>6,036 times</strong>:</p>

<pre><code class="language-bash">$ grep -rho 'style={{' src --include="*.tsx" | wc -l
</code></pre>

<div class="out">3128
</div>

<p>Those are not mistakes. Inline styles are correct precisely where utility classes cannot go: a value computed at runtime that is not from a fixed set. A progress bar's width from a percentage, a chart bar's height from data, a colour from a database row, a transform from a drag position. Recall lesson 0.1 — a class that is not in your source cannot be generated, so a genuinely dynamic value <em>must</em> take the inline path.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">use a utility class</span><span class="lz-nsub">value comes from a fixed, known-at-build-time set</span></span>
<span class="lz-nbody">Spacing, colours from your palette, breakpoints, states, typography. Anything you could enumerate. It ends up in the stylesheet, is deduplicated across all uses, and can carry variants.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">use an inline style</span><span class="lz-nsub">value is computed at runtime and unbounded</span></span>
<span class="lz-nbody"><code>width: &#96;\${pct}%&#96;</code>, a canvas position, a colour from an API. Cannot be a class because the generator never saw it. No variants available — if you need a hover on a dynamic value, drive it through a CSS variable instead (Chapter 6).</span>
</div>
</div>

<h3>The real trade-off, stated honestly</h3>
<p>Having disposed of the false claim, the genuine costs are worth naming, because this course is not marketing:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">markup gets noisy</span><span class="lz-lnote">a long class list is genuinely harder to skim than one semantic class name. The mitigation is component extraction, not shorter class lists — see Chapter 4</span></div>
<div class="lz-layer"><span class="lz-lname">you must learn the scale</span><span class="lz-lnote">a real up-front cost of a few days. This is what Chapter 1 is for, and why learning the scale beats memorising names</span></div>
<div class="lz-layer"><span class="lz-lname">conflicts resolve confusingly</span><span class="lz-lnote">two utilities for the same property fight, and the winner is not the one you wrote last. This is a real sharp edge — Chapter 3 measures it in full</span></div>
<div class="lz-layer"><span class="lz-lname">grep for a colour gets harder</span><span class="lz-lnote">"where is this blue used" is one search in a stylesheet and hundreds of hits across components. Mitigated by putting colours in config (Chapter 5) so there is still one place</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — answering the objection with "it just scales better".</strong> That is an assertion, and the person objecting is right to distrust it. Answer with the measurement instead: the <code>style</code> attribute has no syntax for hover or for a breakpoint, and here are 11,646 places this application needs exactly that. A number ends the argument; a slogan extends it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A utility class resembles an inline style only in <em>where it is referenced</em> — it is a reference to a stylesheet rule, so it gets media queries, pseudo-classes and the cascade, none of which the <code>style</code> attribute has any syntax for, and in this codebase 11,646 utilities depend on exactly that difference.</p>
</div>

<h3>🔬 Measured in Chromium: hover, a breakpoint, a runtime value</h3>
<p>One page, two buttons of the same colour (one inline, one Tailwind with <code>hover:</code> and <code>md:</code>) and two progress bars (inline width, and a CSS variable read by <code>w-(--pct)</code>):</p>
<pre><code class="language-html">&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;link rel="stylesheet" href="out.css"&gt;&lt;/head&gt;
&lt;body class="space-y-4 p-6 text-xl"&gt;
  &lt;button id="inl" style="background:#0891b2; color:#fff; padding:8px 16px; border-radius:8px"&gt;inline style&lt;/button&gt;
  &lt;button id="tw" class="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-800 md:px-10"&gt;Tailwind&lt;/button&gt;
  &lt;div class="h-4 w-80 rounded bg-slate-200"&gt;&lt;div id="pct" class="h-4 rounded bg-cyan-600" style="width: 37%"&gt;&lt;/div&gt;&lt;/div&gt;
  &lt;div class="h-4 w-80 rounded bg-slate-200"&gt;&lt;div id="bien" class="h-4 w-(--pct) rounded bg-cyan-600 hover:bg-amber-500" style="--pct: 37%"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p><code>getComputedStyle</code> in Chromium, hovering and at two window widths:</p>
<div class="out">inline  background  rgb(8, 145, 178)   hover: rgb(8, 145, 178)
utility background  oklch(0.609 0.126 221.723)   hover: oklch(0.45 0.085 224.283)
inline  padding-left  900px: 16px   500px: 16px
utility padding-left  900px: 40px   500px: 16px
pct   width 118.391px  background oklch(0.609 0.126 221.723)
bien  width 118.391px  background oklch(0.769 0.188 70.08)</div>
<p>What Tailwind 4.3.5 wrote for those classes — note that even <code>hover:</code> sits inside <code>@media (hover: hover)</code>:</p>
<div class="out">$ grep -nE '@media \\(hover|hover\\\\:bg-cyan-800|--color-cyan-800\\)' out.css
218:  @media (hover: hover) {
222:    .hover\\:bg-cyan-800:hover {
223:      background-color: var(--color-cyan-800);
$ grep -B1 -A3 'md\\\\:px-10 {' out.css | head -5
  @media (width &gt;= 48rem) {
    .md\\:px-10 {
      padding-inline: calc(var(--spacing) * 10);
    }
  }
$ grep -A2 'w-\\\\(--pct\\\\) {' out.css
  .w-\\(--pct\\) {
    width: var(--pct);
  }</div>
<p><strong>Know what the count measures:</strong> <code>\\bhover:</code> also matches inside <code>group-hover:</code>, so the honest total above is a little lower (still over 11,300).</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i tailwindcss @tailwindcss/cli
echo '@import "tailwindcss";' &gt; input.css
<span class="tok-comment"># save the page above as index.html, then:</span>
npx @tailwindcss/cli -i input.css -o out.css
python3 -m http.server 8000    <span class="tok-comment">  # open :8000, hover both buttons, resize the window</span></code></pre>
<p>In DevTools, select each button and watch <em>Computed → background-color</em> while hovering; then drag the window narrower than 768 px and watch <code>padding-left</code>.</p>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-5-responsive" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.5 — Responsive design</span><span class="lc-sub">The media queries md: compiles to</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — Selectors, cascade, inheritance</span><span class="lc-sub">Pseudo-classes like :hover live in selectors</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-2-tailwind-nen-tang" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.2 — Tailwind basics: utilities, responsive, states</span><span class="lc-sub">The same variants inside a real Next.js app</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inline style (<code>style={{}}</code>)</span><span class="v">Presentation written directly on the element; its grammar accepts declarations only, never a selector.</span></div>
  <div class="kv"><span class="k">Utility class</span><span class="v">A named reference to a rule in a stylesheet — so it gets media queries, pseudo-classes and the cascade.</span></div>
  <div class="kv"><span class="k">Variant</span><span class="v">A conditional prefix like <code>hover:</code> or <code>md:</code> that the <code>style</code> attribute has no syntax for.</span></div>
  <div class="kv"><span class="k">State vs breakpoint</span><span class="v">The two variant families counted here: 8,050 state + 3,596 breakpoint = 11,646 inline-impossible uses.</span></div>
  <div class="kv"><span class="k">Runtime value</span><span class="v">An unbounded computed value (a percentage width, a DB colour) that must stay inline — 6,036 times here.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A utility class resembles an inline style only in <em>where it is referenced</em>; it is a reference to a stylesheet rule.</li><li>The <code>style</code> attribute has no syntax for hover, pseudo-classes or media queries — not awkward, impossible.</li><li>This app has 11,646 utilities (8,050 state + 3,596 breakpoint) that inline styles cannot express — the measured refutation.</li><li>Inline styles stay correct for runtime-computed, unbounded values (6,036 uses); a class cannot exist for a value the generator never saw.</li><li>Answer the objection with the number, not the slogan "it scales better".</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — the style attribute</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style — read the grammar: it accepts declarations only. There is no production for a selector, which is why no pseudo-class or media query can appear.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Hover, focus, and other states</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states — the full variant list. Skim it once purely to see the size of the set that inline styles cannot reach.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nicholas Gallagher — About HTML semantics and front-end architecture</span><span class="lc-sub">nicolasgallagher.com/about-html-semantics-front-end-architecture — written in 2012, years before Tailwind, and still the clearest argument for why "separation of concerns" was never really achieved by putting styles in another file.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — pseudo-classes and media queries from scratch</span><span class="lc-sub">/courses/web-foundations/learn${REF} — what <code>:hover</code> and <code>@media</code> actually are in CSS. Every Tailwind variant compiles down to one of these; Chapter 2 shows the compilation.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>"Cái này khác gì inline style" — đo lời phản đối</h2>
<p class="lead">Lập trình viên nào gặp CSS tiện ích cũng nói một phiên bản của câu này, và nó xứng đáng có câu trả lời THẬT chứ không phải một cuộc cãi vã về gu. Câu trả lời trung thực có hai nửa: sự GIỐNG NHAU về hình thức là có thật, còn lời khẳng định về CHỨC NĂNG thì sai theo một cách đếm được.</p>

<h3>Thừa nhận sự giống nhau</h3>
<p>Lời phản đối không ngớ ngẩn. So sánh:</p>

<pre><code class="language-jsx">&lt;div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}&gt;
&lt;div className="flex items-center p-4"&gt;
</code></pre>

<p>Cả hai đều đặt phần trình bày vào trong mã đánh dấu. Cả hai đều khiến diện mạo của thẻ đọc được ngay tại chỗ dùng. Cả hai đều có nghĩa một cuộc thiết kế lại sẽ động vào file component chứ không phải một bảng kiểu. Nếu lời phản đối của bạn là <em>"kiểu dáng phải nằm ở một file riêng"</em>, thì CSS tiện ích KHÔNG trả lời nó — nó BẤT ĐỒNG với nó, và đó là một bất đồng thiết kế thật sự, không phải một sự hiểu nhầm.</p>

<h3>Chỗ sự giống nhau DỪNG lại</h3>
<p>Nhưng lời phản đối thường lén mang theo một khẳng định MẠNH hơn: rằng tiện ích <em>TƯƠNG ĐƯƠNG</em> inline style, nên bạn chẳng được gì. Khẳng định ấy KIỂM CHỨNG ĐƯỢC. Thuộc tính <code>style</code> KHÔNG có cú pháp cho một điều kiện — không media query, không lớp giả, không phần tử giả. KHÔNG có cách nào viết "padding 1rem, nhưng 2rem khi trên 640px" hay "xanh, nhưng đậm hơn khi rê chuột" trong một thuộc tính <code>style</code>. Không phải vụng về; là <em>KHÔNG HỀ CÓ</em>.</p>

<p>Vậy hãy đếm xem một kho mã thật phụ thuộc vào đúng những thứ đó bao nhiêu:</p>

<pre><code class="language-bash">$ cd frontend
$ for v in hover focus active disabled group-hover focus-visible sm md lg xl 2xl; do
    printf "%-14s %6d\\n" "$v:" "$(grep -rho "\\b$v:" src --include="*.tsx" | wc -l)"
  done
</code></pre>

<div class="out">hover:           5242
focus:           1028
active:           284
disabled:         838
group-hover:      312
focus-visible:    346
                 ─────
trang thai:      8050

sm:              2112
md:               734
lg:               652
xl:                87
2xl:               11
                 ─────
diem ngat:       3596

TONG:           11646      # do lai 14/11/2026 (luc soan khoa: 7758)
</div>

<p><strong>11.646 tiện ích</strong> trong kho mã này diễn đạt một thứ mà thuộc tính <code>style</code> KHÔNG CÓ cú pháp nào để viết. Đó là lời bác bỏ ĐO ĐƯỢC. Không phải chuyện tiện ích là cách viết inline style đẹp hơn — mà là phần LỚN những chỗ tạo kiểu đáng chú ý trong một ứng dụng thật đều CÓ ĐIỀU KIỆN, và inline style không diễn đạt được điều kiện.</p>

<div class="callout ok">
<p><strong>Cách đóng khung đúng.</strong> Một lớp tiện ích KHÔNG PHẢI một inline style. Nó là một <em>THAM CHIẾU CÓ TÊN tới một quy tắc trong bảng kiểu</em> — và vì nó sống trong một bảng kiểu, nó được hưởng mọi thứ bảng kiểu có: media query, lớp giả, phần tử giả, và cascade. Nó chỉ TÌNH CỜ được tham chiếu từ mã đánh dấu. Cái THAM CHIẾU nằm trong mã đánh dấu; cái QUY TẮC thì không.</p>
</div>

<h3>Inline style vẫn còn để làm gì</h3>
<p>Chuyện này cắt cả hai chiều, và cùng kho mã ấy cho thấy ranh giới rơi ở đâu. Inline style vẫn được dùng <strong>6.036 lần</strong>:</p>

<pre><code class="language-bash">$ grep -rho 'style={{' src --include="*.tsx" | wc -l
</code></pre>

<div class="out">3128
</div>

<p>Đó KHÔNG phải sai sót. Inline style đúng chính xác ở chỗ lớp tiện ích không đi tới được: một giá trị TÍNH lúc chạy và không thuộc một tập cố định. Chiều rộng thanh tiến độ từ một phần trăm, chiều cao cột biểu đồ từ dữ liệu, một màu từ một dòng cơ sở dữ liệu, một phép biến hình từ vị trí kéo. Nhớ lại bài 0.1 — một lớp không có trong mã nguồn thì không thể được sinh, nên một giá trị THẬT SỰ động <em>BẮT BUỘC</em> phải đi đường inline.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">dùng lớp tiện ích</span><span class="lz-nsub">giá trị đến từ một tập CỐ ĐỊNH, biết-lúc-dựng</span></span>
<span class="lz-nbody">Khoảng cách, màu từ bảng màu của bạn, điểm ngắt, trạng thái, kiểu chữ. Bất cứ thứ gì bạn liệt kê ra được. Nó vào bảng kiểu, được khử trùng lặp qua mọi lần dùng, và mang được biến thể.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">dùng inline style</span><span class="lz-nsub">giá trị TÍNH lúc chạy và không chặn trên</span></span>
<span class="lz-nbody"><code>width: &#96;\${pct}%&#96;</code>, một vị trí canvas, một màu từ API. KHÔNG thể là lớp vì trình sinh chưa bao giờ thấy nó. Không có biến thể nào — nếu cần hover trên một giá trị động, hãy lái qua một biến CSS (Chương 6).</span>
</div>
</div>

<h3>Sự đánh đổi THẬT, nói cho sòng phẳng</h3>
<p>Đã dẹp được lời khẳng định sai, những cái GIÁ thật đáng được gọi tên, vì khoá này không phải quảng cáo:</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mã đánh dấu ồn lên</span><span class="lz-lnote">một danh sách lớp dài THẬT SỰ khó liếc hơn một tên lớp có nghĩa. Cách giảm nhẹ là TÁCH COMPONENT, không phải rút ngắn danh sách lớp — xem Chương 4</span></div>
<div class="lz-layer"><span class="lz-lname">bạn phải học THANG</span><span class="lz-lnote">một cái giá trả trước thật, vài ngày. Đó là để làm gì có Chương 1, và vì sao học thang thắng học thuộc tên</span></div>
<div class="lz-layer"><span class="lz-lname">xung đột phân giải khó hiểu</span><span class="lz-lnote">hai tiện ích cùng một thuộc tính thì đánh nhau, và kẻ thắng KHÔNG phải cái bạn viết sau. Đây là một cạnh sắc thật — Chương 3 đo trọn vẹn</span></div>
<div class="lz-layer"><span class="lz-lname">tìm một màu khó hơn</span><span class="lz-lnote">"cái xanh này dùng ở đâu" là MỘT lần tìm trong bảng kiểu và hàng trăm kết quả rải khắp component. Giảm nhẹ bằng cách đặt màu vào config (Chương 5) để vẫn còn MỘT chỗ</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — trả lời lời phản đối bằng "nó mở rộng tốt hơn".</strong> Đó là một lời khẳng định, và người phản đối có lý khi không tin. Hãy trả lời bằng SỐ ĐO: thuộc tính <code>style</code> không có cú pháp cho hover hay cho một điểm ngắt, và đây là 11.646 chỗ ứng dụng này cần đúng thứ ấy. Một con số KẾT THÚC cuộc tranh cãi; một khẩu hiệu KÉO DÀI nó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một lớp tiện ích chỉ giống inline style ở <em>CHỖ NÓ ĐƯỢC THAM CHIẾU</em> — nó là tham chiếu tới một quy tắc trong bảng kiểu, nên nó được media query, lớp giả và cascade, những thứ mà thuộc tính <code>style</code> không có cú pháp nào cả, và trong kho mã này có 11.646 tiện ích phụ thuộc đúng vào khác biệt đó.</p>
</div>

<h3>🔬 Đo thật trong Chromium: hover, một điểm ngắt, một giá trị lúc chạy</h3>
<p>Một trang, hai nút cùng màu (một inline, một Tailwind có <code>hover:</code> và <code>md:</code>) và hai thanh tiến độ (độ rộng inline, và một biến CSS được <code>w-(--pct)</code> đọc):</p>
<pre><code class="language-html">&lt;!doctype html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;link rel="stylesheet" href="out.css"&gt;&lt;/head&gt;
&lt;body class="space-y-4 p-6 text-xl"&gt;
  &lt;button id="inl" style="background:#0891b2; color:#fff; padding:8px 16px; border-radius:8px"&gt;inline style&lt;/button&gt;
  &lt;button id="tw" class="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-800 md:px-10"&gt;Tailwind&lt;/button&gt;
  &lt;div class="h-4 w-80 rounded bg-slate-200"&gt;&lt;div id="pct" class="h-4 rounded bg-cyan-600" style="width: 37%"&gt;&lt;/div&gt;&lt;/div&gt;
  &lt;div class="h-4 w-80 rounded bg-slate-200"&gt;&lt;div id="bien" class="h-4 w-(--pct) rounded bg-cyan-600 hover:bg-amber-500" style="--pct: 37%"&gt;&lt;/div&gt;&lt;/div&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p><code>getComputedStyle</code> trong Chromium, khi rê chuột và ở hai bề rộng cửa sổ:</p>
<div class="out">inline  background  rgb(8, 145, 178)   hover: rgb(8, 145, 178)
utility background  oklch(0.609 0.126 221.723)   hover: oklch(0.45 0.085 224.283)
inline  padding-left  900px: 16px   500px: 16px
utility padding-left  900px: 40px   500px: 16px
pct   width 118.391px  background oklch(0.609 0.126 221.723)
bien  width 118.391px  background oklch(0.769 0.188 70.08)</div>
<p>Tailwind 4.3.5 viết gì cho các lớp đó — để ý cả <code>hover:</code> cũng nằm trong <code>@media (hover: hover)</code>:</p>
<div class="out">$ grep -nE '@media \\(hover|hover\\\\:bg-cyan-800|--color-cyan-800\\)' out.css
218:  @media (hover: hover) {
222:    .hover\\:bg-cyan-800:hover {
223:      background-color: var(--color-cyan-800);
$ grep -B1 -A3 'md\\\\:px-10 {' out.css | head -5
  @media (width &gt;= 48rem) {
    .md\\:px-10 {
      padding-inline: calc(var(--spacing) * 10);
    }
  }
$ grep -A2 'w-\\\\(--pct\\\\) {' out.css
  .w-\\(--pct\\) {
    width: var(--pct);
  }</div>
<p><strong>Hiểu lệnh đếm cái gì:</strong> <code>\\bhover:</code> cũng khớp bên trong <code>group-hover:</code>, nên tổng thật thấp hơn một chút (vẫn trên 11.300).</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i tailwindcss @tailwindcss/cli
echo '@import "tailwindcss";' &gt; input.css
<span class="tok-comment"># lưu trang ở trên thành index.html, rồi:</span>
npx @tailwindcss/cli -i input.css -o out.css
python3 -m http.server 8000    <span class="tok-comment">  # mở :8000, rê chuột hai nút, kéo hẹp cửa sổ</span></code></pre>
<p>Trong DevTools, chọn từng nút và xem <em>Computed → background-color</em> khi rê chuột; rồi kéo cửa sổ hẹp hơn 768 px và xem <code>padding-left</code>.</p>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-5-responsive" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.5 — Thiết kế responsive</span><span class="lc-sub">Media query mà md: biên dịch ra</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — Bộ chọn, cascade, kế thừa</span><span class="lc-sub">Lớp giả như :hover sống trong bộ chọn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-2-tailwind-nen-tang" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.2 — Nền tảng Tailwind: utility, responsive, trạng thái</span><span class="lc-sub">Cùng các biến thể ấy trong một ứng dụng Next.js thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inline style (<code>style={{}}</code>)</span><span class="v">Kiểu dáng viết thẳng lên thẻ; văn phạm của nó chỉ nhận khai báo, không bao giờ nhận selector.</span></div>
  <div class="kv"><span class="k">Utility class</span><span class="v">Lớp tiện ích: một tham chiếu có tên tới quy tắc trong bảng kiểu — nên được media query, lớp giả và cascade.</span></div>
  <div class="kv"><span class="k">Variant</span><span class="v">Biến thể: tiền tố điều kiện như <code>hover:</code> hay <code>md:</code> mà thuộc tính <code>style</code> không có cú pháp nào.</span></div>
  <div class="kv"><span class="k">State vs breakpoint</span><span class="v">Hai họ biến thể đếm ở đây: 8.050 trạng thái + 3.596 điểm ngắt = 11.646 chỗ inline không làm được.</span></div>
  <div class="kv"><span class="k">Runtime value</span><span class="v">Giá trị động: giá trị tính lúc chạy, không chặn trên (chiều rộng phần trăm, màu từ DB) buộc phải ở inline — 6.036 lần ở đây.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một lớp tiện ích chỉ giống inline style ở <em>chỗ nó được tham chiếu</em>; nó là tham chiếu tới một quy tắc trong bảng kiểu.</li><li>Thuộc tính <code>style</code> không có cú pháp cho hover, lớp giả hay media query — không phải vụng về, mà là không hề có.</li><li>Ứng dụng này có 11.646 tiện ích (8.050 trạng thái + 3.596 điểm ngắt) mà inline style không diễn đạt được — lời bác bỏ đo được.</li><li>Inline style vẫn đúng cho giá trị tính lúc chạy, không chặn trên (6.036 lần); không thể có lớp cho giá trị trình sinh chưa bao giờ thấy.</li><li>Trả lời lời phản đối bằng con số, không phải khẩu hiệu "nó mở rộng tốt hơn".</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — thuộc tính style</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style — đọc phần văn phạm: nó chỉ nhận các khai báo. KHÔNG có sản xuất nào cho một selector, đó là lý do không lớp giả hay media query nào xuất hiện được.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Hover, focus, and other states</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states — danh sách biến thể đầy đủ. Lướt một lần thuần tuý để thấy ĐỘ LỚN của tập mà inline style không với tới.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nicholas Gallagher — About HTML semantics and front-end architecture</span><span class="lc-sub">nicolasgallagher.com/about-html-semantics-front-end-architecture — viết năm 2012, nhiều năm trước Tailwind, và vẫn là lập luận rõ nhất về việc "tách bạch mối quan tâm" chưa bao giờ THẬT SỰ đạt được chỉ bằng cách đẩy kiểu dáng sang file khác.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — lớp giả và media query từ đầu</span><span class="lc-sub">/courses/web-foundations/learn${REF} — <code>:hover</code> và <code>@media</code> THẬT SỰ là gì trong CSS. Mọi biến thể Tailwind đều biên dịch xuống một trong hai thứ đó; Chương 2 cho thấy cú biên dịch.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — The four moving parts, and which one breaks|||0.3 — Bốn bộ phận chuyển động, và cái nào hay hỏng',
      slug: 'tw-0-3-bon-bo-phan',
      type: 'VIDEO',
      description: 'Cài đặt Tailwind là bốn thứ, không phải một: `content` (quét ở đâu), chỉ thị `@tailwind` (chèn vào đâu), config (thang giá trị), và PostCSS (ai chạy nó). Bài này chỉ ra bộ phận nào hỏng gây triệu chứng nào — vì cả bốn cùng hỏng ra một triệu chứng: "lớp của tôi không ăn".',
      content: `
${G00_3}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The four moving parts, and which one breaks</h2>
<p class="lead">Tailwind installs in about four minutes and then every setup problem for the next year produces the identical symptom: <em>my class does not apply</em>. Knowing the four parts, and what each one's failure looks like, converts that one symptom back into four distinguishable problems.</p>

<h3>The four parts</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>content</code> — where to scan</span><span class="lz-d">An array of globs in <code>tailwind.config.ts</code>. Files matched are read as text and mined for class names. Files not matched are invisible; classes in them are never generated.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>@tailwind</code> — where to inject</span><span class="lz-d">Three directives in your CSS entry file. Each is replaced with a block of generated CSS. Their <em>position in the file</em> determines where those blocks land relative to your own rules — which matters more than it looks (Chapter 7).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>theme</code> — the value scale</span><span class="lz-d">What <code>4</code> means in <code>p-4</code>, what <code>500</code> means in <code>text-blue-500</code>. Chapter 1 is about reading it; Chapter 5 is about extending it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">PostCSS — who runs it</span><span class="lz-d">Tailwind is a PostCSS plugin. Something has to invoke PostCSS on your CSS during the build. In this repo that is Next.js, reading <code>postcss.config.js</code>.</span></div>
</div>

<h3>What each one looks like in this repository</h3>
<p>All four are small enough to read in full, which is worth doing once:</p>

<pre><code class="language-js">// frontend/postcss.config.js — part 4
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
</code></pre>

<pre><code class="language-ts">// frontend/tailwind.config.ts — parts 1 and 3
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: { extend: { /* … 200 lines of scale … */ } },
  plugins: [],
};
</code></pre>

<pre><code class="language-css">/* frontend/src/app/globals.css lines 1-4 (14/11/2026) — part 2 */
@import &quot;../../tokens.css&quot;;

@tailwind base;
@tailwind components;
@tailwind utilities;
</code></pre>

<p>Note what the <code>content</code> array does <em>not</em> include: anything outside <code>src/</code>. A class written in a file at the repo root, or in a package under <code>node_modules</code>, or in a Markdown file outside those three globs, is invisible to the scanner. That is not a bug — it is the array doing its job — but it is the number-one cause of "my class does not apply" in a project that has grown new directories since setup.</p>

<h3>The diagnostic table</h3>
<p>Because all four failures present identically in the browser, diagnose by asking which part could produce <em>this specific</em> flavour of nothing:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">ONE class fails, others in the same file work</span><span class="lz-lnote">not a setup problem. The class is misspelled, or it is assembled dynamically (lesson 0.1), or it is losing a conflict (Chapter 3). Part 1-4 are all fine — a broken <code>content</code> would kill the whole file, not one class</span></div>
<div class="lz-layer"><span class="lz-lname">EVERY class in ONE file fails</span><span class="lz-lnote">part 1. That file is outside the <code>content</code> globs. Check the path against the array; a new top-level directory is the usual cause</span></div>
<div class="lz-layer"><span class="lz-lname">every class EVERYWHERE fails, no CSS at all</span><span class="lz-lnote">part 2 or 4. Either the CSS entry file is not imported by the app, or PostCSS never ran. Check the browser's Network tab: is a stylesheet loading, and does it contain any <code>.flex</code> rule at all?</span></div>
<div class="lz-layer"><span class="lz-lname">the class exists in CSS but the element ignores it</span><span class="lz-lnote">not part 1-4 at all — a cascade problem. Something else has higher specificity or comes later. This is Chapter 7, and adding <code>!important</code> before understanding which is the wrong first move</span></div>
<div class="lz-layer"><span class="lz-lname">works in dev, breaks in production build</span><span class="lz-lnote">part 1, specifically. Dev servers often scan more loosely or rebuild on demand; a production build does one pass with the real globs. A class only reachable via a path the globs miss survives dev and dies in prod</span></div>
</div>

<div class="callout ok">
<p><strong>The one command that splits the table.</strong> Search the built CSS for the class. If <code>.text-4xl</code> is not in the output file, it was never generated — parts 1, 2 or 4. If it <em>is</em> in the output and the element still ignores it, it was generated and lost a cascade fight — Chapter 7. That single check divides the whole space in two, and it takes one grep.</p>
</div>

<h3>What <code>plugins: []</code> tells you</h3>
<p>This repository's config ends with an empty plugin array, and that is a decision rather than an omission. The reason is written down in <code>globals.css</code>:</p>

<div class="out">/* We do NOT depend on @tailwindcss/typography because that
   would force &#96;.prose&#96; colors we don't want in our dark theme. */
</div>

<p>This is worth reading as a general pattern. <code>@tailwindcss/typography</code> is the most commonly installed Tailwind plugin, and it ships opinionated colour choices along with its typography. In a project with a custom dark theme, adopting it means fighting those colours everywhere. The team measured that cost and chose to hand-write about 300 lines of <code>.rich-content</code> rules instead. Neither choice is universally right; what is right is that the reason is recorded next to the code, so the next person does not "helpfully" install the plugin and quietly break the theme.</p>

<div class="pitfall">
<p><strong>Trap — adding a glob to <code>content</code> that matches <code>node_modules</code>.</strong> The instinct when a class in a dependency does not work is to widen the globs. Pointing <code>content</code> at <code>node_modules</code> makes the scanner read tens of thousands of files on every rebuild; dev-server rebuild times go from milliseconds to seconds and nobody connects it to the config change weeks later. If you genuinely need classes from one package, add that one package's path, never the whole directory.</p>
</div>

<h3>Verifying the install, rather than assuming it</h3>
<p>The check that actually proves the pipeline works is to generate CSS for a class you can confirm, from a file you control:</p>

<pre><code class="language-bash">$ npx tailwindcss -i input.css -o out.css
$ grep -c '^\\.' out.css        # how many rules were emitted at all
$ grep -n '\\.flex' out.css     # is the one you expect there
</code></pre>

<div class="out">$ grep -c '^\\.' out.css
0                              # Tailwind 3.4.19: 0 luat tien ich => content KHONG khop file nao
                               # (va no canh bao: No utility classes were detected…)
</div>

<p>A near-empty output file is the clearest possible signal that part 1 is misconfigured, and it is visible in one command without opening a browser. Compare against a run where the globs are right and the count is in the hundreds or thousands. Chapter 8 uses this same technique to measure output size properly. On Tailwind 4 the rules are indented inside <code>@layer utilities</code>, so count with <code>grep -cE '^ *\\.[a-z]'</code> (see Start here 2/2).</p>

<div class="callout">
<p><strong>One sentence.</strong> Four independent things must be right — where to scan, where to inject, the scale, and who runs PostCSS — and because all four fail with the identical symptom, diagnose by <em>scope</em>: one class, one file, or everything, and check whether the rule reached the output CSS before touching the cascade.</p>
</div>

<h3>🔁 The same four parts in Tailwind 4</h3>
<p>If you start a project today you get Tailwind 4, where the four parts still exist but have moved: <strong>1</strong> scanning is automatic (every file not git-ignored; add or skip paths with <code>@source "…"</code> / <code>@source not "…"</code>); <strong>2</strong> one <code>@import "tailwindcss";</code> inserts everything; <strong>3</strong> the scale lives in CSS inside <code>@theme { … }</code>; <strong>4</strong> the runner is a separate package — <code>@tailwindcss/postcss</code>, <code>@tailwindcss/vite</code> or <code>@tailwindcss/cli</code>. A complete setup:</p>
<div class="out">$ grep -c . input.css; cat input.css
1
@import "tailwindcss";
$ ls tailwind.config.* postcss.config.* 2&gt;&amp;1 | sed 's/^ls: //'
postcss.config.*: No such file or directory
tailwind.config.*: No such file or directory</div>
<h3>🔬 Measured: breaking each part (Tailwind 3.4.19, Chromium)</h3>
<p><strong>Part 1 — a glob that matches nothing</strong> (the page is in <code>pages/</code>, the glob points at <code>src/</code>), then fixed:</p>
<div class="out">$ npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep -vE '^$|rowserslist|update-browserslist|Why you should' | head -4
Rebuilding...
warn - No utility classes were detected in your source files. If this is unexpected, double-check the &#96;content&#96; option in your Tailwind CSS configuration.
warn - https://tailwindcss.com/docs/content-configuration
Done in 145ms.
$ grep -c '^\\.' out.css
0
$ grep -n '^\\.flex' out.css; echo "(.flex: $(grep -c '^\\.flex {' out.css))"
(.flex: 0)</div>
<div class="out">$ grep -c '^\\.' out.css
6
$ grep -E '^\\.(flex|p-6|text-4xl) \\{' out.css
.flex {
.p-6 {
.text-4xl {</div>
<p><strong>Part 2/4 — the build never ran.</strong> A page linking the raw <code>input.css</code>: Chromium understood <strong>0</strong> rules; the <code>div</code> stayed <code>display: block</code> at <code>16px</code>. <code>@tailwind</code> is a placeholder for the build step, not CSS.</p>
<p><strong>Not a part at all — the rule exists and loses.</strong> <code>.mt-8</code> is in the built CSS, but a hand-written <code>.the p { margin-top: 0 }</code> is more specific; Chromium measured <code>margin-top: 0px</code>:</p>
<div class="out">$ grep -A2 '^\\.mt-8 {' out.css
.mt-8 {
  margin-top: 2rem;
}</div>
<p><strong>The node_modules trap</strong> — the "safe" glob <code>./**/*.{html,js}</code>, then the narrow one (wall time incl. npx, on the course machine):</p>
<div class="out">$ npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep -vE '^$|rowserslist|update-browserslist|Why you should' | head -6
Rebuilding...
warn - Your &#96;content&#96; configuration includes a pattern which looks like it's accidentally matching all of &#96;node_modules&#96; and can cause serious performance issues.
warn - Pattern: &#96;./**/*.js&#96;
warn - See our documentation for recommendations:
warn - https://tailwindcss.com/docs/content-configuration#pattern-recommendations
Done in 4048ms.
$ find -L . -path ./node_modules -prune -o -name '*.js' -print | wc -l | sed 's/^ */tệp .js ngoài node_modules: /'
tệp .js ngoài node_modules: 1
$ find -L node_modules -name '*.js' | wc -l | sed 's/^ */tệp .js trong node_modules: /'
tệp .js trong node_modules: 699
$ for i in 1 2 3; do /usr/bin/time -p npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep real; done
real 6.07
real 4.31
real 5.39
$ for i in 1 2 3; do /usr/bin/time -p npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep real; done
real 0.66
real 0.72
real 0.57</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">mkdir bon &amp;&amp; cd bon &amp;&amp; npm init -y &amp;&amp; npm i tailwindcss@3
mkdir pages &amp;&amp; echo '&lt;div class="flex p-6 text-4xl"&gt;hi&lt;/div&gt;' &gt; pages/index.html
printf '@tailwind base;\\n@tailwind components;\\n@tailwind utilities;\\n' &gt; input.css
echo "module.exports = { content: ['./src/**/*.html'] };" &gt; tailwind.config.js
npx tailwindcss -i input.css -o out.css    <span class="tok-comment">  # read the warning</span>
grep -c '^\\.' out.css                      <span class="tok-comment">  # 0</span>
<span class="tok-comment"># now point content at ./pages/**/*.html and build again</span></code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-1-styling-va-tailwind" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.1 — Styling options, and why Tailwind</span><span class="lc-sub">Parts 1 and 4 inside a fresh Next.js 16 app</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — Selectors, cascade, inheritance</span><span class="lc-sub">Why a present rule can still lose: specificity</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-8-4-glob-hong" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 8.4 — A fast build is a symptom</span><span class="lc-sub">The scan configuration, measured on a real app</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>content</code> (globs)</span><span class="v">The config patterns that decide which files Tailwind scans; files outside them are invisible.</span></div>
  <div class="kv"><span class="k"><code>@tailwind</code> directives</span><span class="v">The three injection points (base, components, utilities); their position in the CSS file matters.</span></div>
  <div class="kv"><span class="k"><code>theme</code> (scale)</span><span class="v">What the numbers mean — <code>4</code> in <code>p-4</code>, <code>500</code> in <code>text-blue-500</code>.</span></div>
  <div class="kv"><span class="k">PostCSS</span><span class="v">The plugin host that actually runs Tailwind during the build (here, invoked by Next.js).</span></div>
  <div class="kv"><span class="k">Diagnose by scope</span><span class="v">One class vs one file vs everything tells you which of the four parts failed.</span></div>
  <div class="kv"><span class="k">Output-CSS grep</span><span class="v">Searching the built CSS splits "never generated" (parts 1/2/4) from "lost a cascade fight" (Chapter 7).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A Tailwind install is four independent parts: <code>content</code> (where to scan), <code>@tailwind</code> directives (where to inject), <code>theme</code> (the scale), and PostCSS (who runs it).</li><li>All four fail with the same symptom — "my class does not apply" — so diagnose by scope: one class, one file, or everything.</li><li>One class fails = spelling / dynamic / conflict; one file fails = <code>content</code> globs; everything fails = directives or PostCSS.</li><li>Grep the built CSS first: absent means it was never generated; present-but-ignored means it lost a cascade fight (Chapter 7).</li><li><code>plugins: []</code> here is a deliberate choice (avoiding <code>@tailwindcss/typography</code>'s colours), recorded next to the code.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — the <code>content</code> globs, what they match, and the explicit warning about scanning <code>node_modules</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Functions and directives</span><span class="lc-sub">tailwindcss.com/docs/functions-and-directives — what <code>@tailwind base</code>, <code>components</code> and <code>utilities</code> each expand into. Chapter 7 depends on knowing that these are three separate injection points, not one.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostCSS — the plugin model</span><span class="lc-sub">github.com/postcss/postcss — Tailwind is a plugin in this pipeline, not a standalone tool. Understanding that explains why a missing <code>postcss.config.js</code> produces total silence rather than an error.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js — where the CSS entry file is imported</span><span class="lc-sub">/courses/nextjs/learn${REF} — <code>globals.css</code> is imported once from the root layout, and that import is what puts the whole pipeline on the page. A missing import is failure mode 3 in the table above.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Bốn bộ phận chuyển động, và cái nào hay hỏng</h2>
<p class="lead">Tailwind cài mất chừng bốn phút, rồi suốt cả năm sau mọi trục trặc cấu hình đều đẻ ra đúng một triệu chứng: <em>lớp của tôi không ăn</em>. Biết bốn bộ phận, và biết cú hỏng của từng cái trông ra sao, biến một triệu chứng ấy trở lại thành bốn vấn đề PHÂN BIỆT ĐƯỢC.</p>

<h3>Bốn bộ phận</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>content</code> — quét Ở ĐÂU</span><span class="lz-d">Một mảng glob trong <code>tailwind.config.ts</code>. File khớp thì được đọc như văn bản và đãi lấy tên lớp. File không khớp thì VÔ HÌNH; lớp trong đó không bao giờ được sinh.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>@tailwind</code> — chèn VÀO ĐÂU</span><span class="lz-d">Ba chỉ thị trong file CSS gốc của bạn. Mỗi cái được thay bằng một khối CSS phát sinh. <em>VỊ TRÍ của chúng trong file</em> quyết định các khối ấy rơi ở đâu so với quy tắc của chính bạn — chuyện này quan trọng hơn vẻ ngoài của nó (Chương 7).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>theme</code> — THANG giá trị</span><span class="lz-d"><code>4</code> trong <code>p-4</code> nghĩa là gì, <code>500</code> trong <code>text-blue-500</code> nghĩa là gì. Chương 1 dạy ĐỌC nó; Chương 5 dạy MỞ RỘNG nó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">PostCSS — AI chạy nó</span><span class="lz-d">Tailwind là một plugin PostCSS. Phải có thứ gì đó gọi PostCSS lên CSS của bạn lúc dựng. Ở kho này thứ đó là Next.js, đọc <code>postcss.config.js</code>.</span></div>
</div>

<h3>Từng cái trông ra sao trong kho này</h3>
<p>Cả bốn đều đủ nhỏ để đọc trọn vẹn, và đáng đọc một lần:</p>

<pre><code class="language-js">// frontend/postcss.config.js — bo phan 4
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
</code></pre>

<pre><code class="language-ts">// frontend/tailwind.config.ts — bo phan 1 va 3
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: { extend: { /* … 200 dong thang gia tri … */ } },
  plugins: [],
};
</code></pre>

<pre><code class="language-css">/* frontend/src/app/globals.css dong 1-4 (14/11/2026) — bo phan 2 */
@import &quot;../../tokens.css&quot;;

@tailwind base;
@tailwind components;
@tailwind utilities;
</code></pre>

<p>Để ý cái mà mảng <code>content</code> <em>KHÔNG</em> bao gồm: bất cứ thứ gì ngoài <code>src/</code>. Một lớp viết trong một file ở gốc kho, hay trong một gói dưới <code>node_modules</code>, hay trong một file Markdown ngoài ba glob ấy, đều VÔ HÌNH với bộ quét. Đó không phải lỗi — đó là mảng đang làm đúng việc của nó — nhưng nó là nguyên nhân số một của "lớp của tôi không ăn" trong một dự án đã mọc thêm thư mục mới kể từ lúc cài đặt.</p>

<h3>Bảng chẩn đoán</h3>
<p>Vì cả bốn cú hỏng đều hiện ra y hệt nhau trên trình duyệt, hãy chẩn đoán bằng cách hỏi bộ phận nào có thể đẻ ra <em>ĐÚNG cái vị</em> "không có gì" này:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">MỘT lớp hỏng, các lớp khác cùng file chạy</span><span class="lz-lnote">KHÔNG phải vấn đề cấu hình. Lớp bị gõ sai, hoặc nó được ghép động (bài 0.1), hoặc nó đang THUA một cuộc xung đột (Chương 3). Bộ phận 1-4 đều ổn — một <code>content</code> hỏng sẽ giết cả FILE, không giết một lớp</span></div>
<div class="lz-layer"><span class="lz-lname">MỌI lớp trong MỘT file hỏng</span><span class="lz-lnote">bộ phận 1. File đó nằm NGOÀI các glob <code>content</code>. Đối chiếu đường dẫn với mảng; một thư mục cấp cao mới là nguyên nhân thường gặp</span></div>
<div class="lz-layer"><span class="lz-lname">mọi lớp ở MỌI NƠI hỏng, không có CSS nào cả</span><span class="lz-lnote">bộ phận 2 hoặc 4. Hoặc file CSS gốc không được ứng dụng import, hoặc PostCSS chưa bao giờ chạy. Kiểm tab Network của trình duyệt: có bảng kiểu nào đang tải không, và trong đó có quy tắc <code>.flex</code> nào không?</span></div>
<div class="lz-layer"><span class="lz-lname">lớp CÓ trong CSS mà thẻ vẫn lờ đi</span><span class="lz-lnote">không phải bộ phận 1-4 gì cả — một vấn đề CASCADE. Có thứ khác độ đặc hiệu cao hơn hoặc đứng sau. Đây là Chương 7, và thêm <code>!important</code> trước khi hiểu là nước đi đầu tiên SAI</span></div>
<div class="lz-layer"><span class="lz-lname">chạy ở dev, hỏng ở bản dựng production</span><span class="lz-lnote">bộ phận 1, cụ thể. Máy chủ dev thường quét lỏng hơn hoặc dựng lại theo yêu cầu; một bản dựng production đi MỘT lượt với glob thật. Một lớp chỉ tới được qua một đường mà glob bỏ sót thì sống ở dev và chết ở prod</span></div>
</div>

<div class="callout ok">
<p><strong>Một lệnh chẻ đôi cái bảng.</strong> Tìm lớp ấy trong CSS ĐÃ DỰNG. Nếu <code>.text-4xl</code> KHÔNG có trong file đầu ra, nó chưa bao giờ được sinh — bộ phận 1, 2 hoặc 4. Nếu nó CÓ trong đầu ra mà thẻ vẫn lờ đi, nó đã được sinh và THUA một cuộc đấu cascade — Chương 7. Một phép kiểm ấy chia đôi toàn bộ không gian, và tốn một cú grep.</p>
</div>

<h3><code>plugins: []</code> nói lên điều gì</h3>
<p>Config của kho này kết thúc bằng một mảng plugin RỖNG, và đó là một QUYẾT ĐỊNH chứ không phải một thiếu sót. Lý do được ghi lại trong <code>globals.css</code>:</p>

<div class="out">/* We do NOT depend on @tailwindcss/typography because that
   would force &#96;.prose&#96; colors we don't want in our dark theme. */
</div>

<p>Chỗ này đáng đọc như một khuôn mẫu chung. <code>@tailwindcss/typography</code> là plugin Tailwind được cài nhiều nhất, và nó giao kèm những lựa chọn MÀU có định kiến cùng với phần kiểu chữ. Trong một dự án có theme tối tuỳ biến, nhận nó vào nghĩa là đánh nhau với những màu ấy ở khắp nơi. Đội ngũ đã ĐO cái giá đó và chọn viết tay khoảng 300 dòng quy tắc <code>.rich-content</code> thay vào. Không lựa chọn nào đúng phổ quát; cái ĐÚNG là LÝ DO được ghi ngay cạnh mã, để người sau không "nhiệt tình" cài plugin vào rồi âm thầm làm vỡ theme.</p>

<div class="pitfall">
<p><strong>Bẫy — thêm một glob vào <code>content</code> khớp trúng <code>node_modules</code>.</strong> Bản năng khi một lớp trong một gói phụ thuộc không chạy là NỚI glob ra. Chĩa <code>content</code> vào <code>node_modules</code> khiến bộ quét đọc hàng chục nghìn file mỗi lần dựng lại; thời gian dựng lại của máy chủ dev đi từ mili-giây lên GIÂY và vài tuần sau không ai nối được nó với cú đổi config. Nếu bạn THẬT SỰ cần lớp từ một gói, hãy thêm đường dẫn của ĐÚNG gói ấy, không bao giờ cả thư mục.</p>
</div>

<h3>XÁC MINH cú cài đặt, thay vì cho là nó chạy</h3>
<p>Phép kiểm THẬT SỰ chứng minh đường ống chạy là sinh CSS cho một lớp bạn xác nhận được, từ một file bạn kiểm soát:</p>

<pre><code class="language-bash">$ npx tailwindcss -i input.css -o out.css
$ grep -c '^\\.' out.css        # co bao nhieu quy tac duoc phat sinh
$ grep -n '\\.flex' out.css     # cai ban trong doi co o do khong
</code></pre>

<div class="out">$ grep -c '^\\.' out.css
0                              # Tailwind 3.4.19: 0 luat tien ich => content KHONG khop file nao
                               # (va no canh bao: No utility classes were detected…)
</div>

<p>Một file đầu ra gần rỗng là tín hiệu rõ nhất có thể rằng bộ phận 1 sai cấu hình, và nó nhìn thấy được trong MỘT lệnh mà không cần mở trình duyệt. Đối chiếu với một lần chạy có glob đúng thì số đếm nằm ở hàng trăm hoặc hàng nghìn. Chương 8 dùng đúng kỹ thuật này để đo kích thước đầu ra cho tử tế. Ở Tailwind 4 các luật thụt lề bên trong <code>@layer utilities</code>, nên đếm bằng <code>grep -cE '^ *\\.[a-z]'</code> (xem Bắt đầu tại đây 2/2).</p>

<div class="callout">
<p><strong>Một câu.</strong> Bốn thứ độc lập phải đúng — quét ở đâu, chèn vào đâu, cái thang, và ai chạy PostCSS — và vì cả bốn hỏng ra cùng một triệu chứng, hãy chẩn đoán theo <em>PHẠM VI</em>: một lớp, một file, hay tất cả, và kiểm xem quy tắc có TỚI được CSS đầu ra không TRƯỚC khi động vào cascade.</p>
</div>

<h3>🔁 Cùng bốn bộ phận, ở Tailwind 4</h3>
<p>Bắt đầu dự án hôm nay thì bạn nhận Tailwind 4, nơi bốn bộ phận vẫn còn nhưng đã dời chỗ: <strong>1</strong> việc quét là tự động (mọi tệp không bị gitignore; thêm hoặc bỏ đường dẫn bằng <code>@source "…"</code> / <code>@source not "…"</code>); <strong>2</strong> một dòng <code>@import "tailwindcss";</code> chèn tất cả; <strong>3</strong> cái thang nằm trong CSS, trong <code>@theme { … }</code>; <strong>4</strong> trạm chạy là gói riêng — <code>@tailwindcss/postcss</code>, <code>@tailwindcss/vite</code> hoặc <code>@tailwindcss/cli</code>. Một bản cài đầy đủ:</p>
<div class="out">$ grep -c . input.css; cat input.css
1
@import "tailwindcss";
$ ls tailwind.config.* postcss.config.* 2&gt;&amp;1 | sed 's/^ls: //'
postcss.config.*: No such file or directory
tailwind.config.*: No such file or directory</div>
<h3>🔬 Đo thật: làm hỏng từng bộ phận (Tailwind 3.4.19, Chromium)</h3>
<p><strong>Bộ phận 1 — glob không khớp gì</strong> (trang ở <code>pages/</code>, glob trỏ vào <code>src/</code>), rồi sửa:</p>
<div class="out">$ npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep -vE '^$|rowserslist|update-browserslist|Why you should' | head -4
Rebuilding...
warn - No utility classes were detected in your source files. If this is unexpected, double-check the &#96;content&#96; option in your Tailwind CSS configuration.
warn - https://tailwindcss.com/docs/content-configuration
Done in 145ms.
$ grep -c '^\\.' out.css
0
$ grep -n '^\\.flex' out.css; echo "(.flex: $(grep -c '^\\.flex {' out.css))"
(.flex: 0)</div>
<div class="out">$ grep -c '^\\.' out.css
6
$ grep -E '^\\.(flex|p-6|text-4xl) \\{' out.css
.flex {
.p-6 {
.text-4xl {</div>
<p><strong>Bộ phận 2/4 — bước dựng chưa hề chạy.</strong> Trang liên kết thẳng <code>input.css</code> thô: Chromium hiểu được <strong>0</strong> luật; khối <code>div</code> vẫn <code>display: block</code>, chữ <code>16px</code>. <code>@tailwind</code> là chỗ giữ cho bước dựng, không phải CSS.</p>
<p><strong>Không phải bộ phận nào — luật có mà thua.</strong> <code>.mt-8</code> có trong CSS đã dựng, nhưng luật viết tay <code>.the p { margin-top: 0 }</code> đặc hiệu hơn; Chromium đo <code>margin-top: 0px</code>:</p>
<div class="out">$ grep -A2 '^\\.mt-8 {' out.css
.mt-8 {
  margin-top: 2rem;
}</div>
<p><strong>Bẫy node_modules</strong> — glob "cho chắc" <code>./**/*.{html,js}</code>, rồi glob hẹp (thời gian thực, gồm cả npx, trên máy của khoá):</p>
<div class="out">$ npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep -vE '^$|rowserslist|update-browserslist|Why you should' | head -6
Rebuilding...
warn - Your &#96;content&#96; configuration includes a pattern which looks like it's accidentally matching all of &#96;node_modules&#96; and can cause serious performance issues.
warn - Pattern: &#96;./**/*.js&#96;
warn - See our documentation for recommendations:
warn - https://tailwindcss.com/docs/content-configuration#pattern-recommendations
Done in 4048ms.
$ find -L . -path ./node_modules -prune -o -name '*.js' -print | wc -l | sed 's/^ */tệp .js ngoài node_modules: /'
tệp .js ngoài node_modules: 1
$ find -L node_modules -name '*.js' | wc -l | sed 's/^ */tệp .js trong node_modules: /'
tệp .js trong node_modules: 699
$ for i in 1 2 3; do /usr/bin/time -p npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep real; done
real 6.07
real 4.31
real 5.39
$ for i in 1 2 3; do /usr/bin/time -p npx tailwindcss -i input.css -o out.css 2&gt;&amp;1 | grep real; done
real 0.66
real 0.72
real 0.57</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">mkdir bon &amp;&amp; cd bon &amp;&amp; npm init -y &amp;&amp; npm i tailwindcss@3
mkdir pages &amp;&amp; echo '&lt;div class="flex p-6 text-4xl"&gt;hi&lt;/div&gt;' &gt; pages/index.html
printf '@tailwind base;\\n@tailwind components;\\n@tailwind utilities;\\n' &gt; input.css
echo "module.exports = { content: ['./src/**/*.html'] };" &gt; tailwind.config.js
npx tailwindcss -i input.css -o out.css    <span class="tok-comment">  # đọc cảnh báo</span>
grep -c '^\\.' out.css                      <span class="tok-comment">  # 0</span>
<span class="tok-comment"># giờ trỏ content vào ./pages/**/*.html rồi dựng lại</span></code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-1-styling-va-tailwind" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.1 — Các cách style, và vì sao Tailwind</span><span class="lc-sub">Bộ phận 1 và 4 trong một ứng dụng Next.js 16 mới tạo</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — Bộ chọn, cascade, kế thừa</span><span class="lc-sub">Vì sao một luật có mặt vẫn thua: độ đặc hiệu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-8-4-glob-hong" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 8.4 — Dựng nhanh là một triệu chứng</span><span class="lc-sub">Cấu hình quét, đo trên ứng dụng thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>content</code> (globs)</span><span class="v">Các mẫu glob trong config quyết định Tailwind quét file nào; file ngoài chúng là vô hình.</span></div>
  <div class="kv"><span class="k"><code>@tailwind</code> directives</span><span class="v">Ba điểm chèn (base, components, utilities); vị trí của chúng trong file CSS có ảnh hưởng.</span></div>
  <div class="kv"><span class="k"><code>theme</code> (scale)</span><span class="v">Thang giá trị: các con số nghĩa là gì — <code>4</code> trong <code>p-4</code>, <code>500</code> trong <code>text-blue-500</code>.</span></div>
  <div class="kv"><span class="k">PostCSS</span><span class="v">Nơi chứa plugin thật sự chạy Tailwind lúc dựng (ở đây do Next.js gọi).</span></div>
  <div class="kv"><span class="k">Diagnose by scope</span><span class="v">Chẩn đoán theo phạm vi: một lớp, một file, hay tất cả cho biết bộ phận nào trong bốn cái hỏng.</span></div>
  <div class="kv"><span class="k">Output-CSS grep</span><span class="v">Tìm trong CSS đã dựng tách "chưa bao giờ sinh" (bộ phận 1/2/4) khỏi "thua một cuộc đấu cascade" (Chương 7).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một bản cài Tailwind là bốn bộ phận độc lập: <code>content</code> (quét ở đâu), chỉ thị <code>@tailwind</code> (chèn vào đâu), <code>theme</code> (cái thang), và PostCSS (ai chạy nó).</li><li>Cả bốn hỏng ra cùng một triệu chứng — "lớp của tôi không ăn" — nên chẩn đoán theo phạm vi: một lớp, một file, hay tất cả.</li><li>Một lớp hỏng = sai chính tả / lớp động / xung đột; một file hỏng = glob <code>content</code>; tất cả hỏng = chỉ thị hoặc PostCSS.</li><li>Tìm trong CSS đã dựng trước: vắng mặt nghĩa là chưa bao giờ sinh; có mà bị lờ nghĩa là thua một cuộc đấu cascade (Chương 7).</li><li><code>plugins: []</code> ở đây là một lựa chọn có chủ ý (tránh màu của <code>@tailwindcss/typography</code>), được ghi ngay cạnh mã.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — các glob <code>content</code>, chúng khớp gì, và lời cảnh báo tường minh về việc quét <code>node_modules</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Functions and directives</span><span class="lc-sub">tailwindcss.com/docs/functions-and-directives — <code>@tailwind base</code>, <code>components</code> và <code>utilities</code> mỗi cái nở ra thành gì. Chương 7 phụ thuộc vào việc biết đây là BA điểm chèn riêng biệt, không phải một.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostCSS — mô hình plugin</span><span class="lc-sub">github.com/postcss/postcss — Tailwind là một plugin trong đường ống này, không phải một công cụ độc lập. Hiểu điều đó giải thích vì sao thiếu <code>postcss.config.js</code> lại đẻ ra sự im lặng HOÀN TOÀN chứ không phải một lỗi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js — file CSS gốc được import ở đâu</span><span class="lc-sub">/courses/nextjs/learn${REF} — <code>globals.css</code> được import MỘT lần từ layout gốc, và chính cú import ấy đặt cả đường ống lên trang. Thiếu cú import là kiểu hỏng số 3 trong bảng trên.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — Section 0 quiz|||0.4 — Kiểm tra Mục 0',
      slug: 'tw-0-4-quiz',
      type: 'QUIZ',
      description: 'Sáu câu, chín phút. Về mô hình tinh thần: trình sinh chứ không phải thư viện, vì sao lớp ghép động vô hiệu, đo lời phản đối inline style, và bốn bộ phận hỏng ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>What Section 0 established</h2>
<p class="lead">Six questions, nine minutes. Everything here is derivable from lesson 0.1's one sentence — if a question feels like memorisation, re-read that sentence and derive the answer instead.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0.1 — the generator</span><span class="lz-lnote">reads source as TEXT, writes a stylesheet of only what it found. 793 files, 26,343 class attributes, 3,683 distinct utilities</span></div>
<div class="lz-layer"><span class="lz-lname">0.2 — the objection</span><span class="lz-lnote">7,758 utilities in this app express what <code>style={{}}</code> has no syntax for; 3,128 inline styles remain, correctly, for runtime-computed values</span></div>
<div class="lz-layer"><span class="lz-lname">0.3 — four parts</span><span class="lz-lnote">content, directives, theme, PostCSS — all four fail identically, so diagnose by SCOPE and check the output CSS before touching the cascade</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Mục 0 đã dựng được gì</h2>
<p class="lead">Sáu câu, chín phút. Mọi thứ ở đây đều SUY RA được từ một câu ở bài 0.1 — nếu một câu hỏi có cảm giác phải học thuộc, hãy đọc lại câu ấy và SUY RA đáp án.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0.1 — trình sinh</span><span class="lz-lnote">đọc mã nguồn như VĂN BẢN, viết ra bảng kiểu chỉ chứa cái nó tìm thấy. 793 file, 26.343 thuộc tính lớp, 3.683 tiện ích duy nhất</span></div>
<div class="lz-layer"><span class="lz-lname">0.2 — lời phản đối</span><span class="lz-lnote">7.758 tiện ích trong ứng dụng này diễn đạt thứ mà <code>style={{}}</code> không có cú pháp nào; 3.128 inline style vẫn còn, ĐÚNG, cho giá trị tính lúc chạy</span></div>
<div class="lz-layer"><span class="lz-lname">0.3 — bốn bộ phận</span><span class="lz-lnote">content, chỉ thị, theme, PostCSS — cả bốn hỏng y hệt nhau, nên chẩn đoán theo PHẠM VI và kiểm CSS đầu ra TRƯỚC khi động vào cascade</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 540,
        questions: [
          {
            question: 'Why does <code>className={`text-${color}-500`}</code> render the right class attribute but produce no styling?|||Vì sao <code>className={`text-${color}-500`}</code> sinh ra đúng thuộc tính lớp mà KHÔNG tạo kiểu gì?',
            options: [
              'The scanner reads source as text at BUILD time and never sees the complete string, so the rule is never generated — the attribute is correct but refers to a rule that does not exist|||Bộ quét đọc mã nguồn như văn bản lúc DỰNG và không bao giờ thấy chuỗi hoàn chỉnh, nên quy tắc không bao giờ được sinh — thuộc tính đúng nhưng trỏ tới một quy tắc KHÔNG tồn tại',
              'React escapes template literals in className for security|||React thoát chuỗi mẫu trong className vì lý do bảo mật',
              'Tailwind requires all colors to be declared in the theme first|||Tailwind đòi mọi màu phải khai trong theme trước',
              'The class is generated but purged later by the minifier|||Lớp được sinh nhưng bị bộ nén dọn đi sau đó',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This app has 26,343 class attributes but only 3,683 distinct utilities. What does that ratio demonstrate?|||Ứng dụng này có 26.343 thuộc tính lớp mà chỉ 3.683 tiện ích duy nhất. Tỉ số ấy chứng minh điều gì?',
            options: [
              'Generated CSS scales with the VOCABULARY used, not with how many places it is used — reusing utilities in new components adds zero bytes|||CSS phát sinh tỉ lệ với VỐN TỪ được dùng, không với SỐ CHỖ dùng — dùng lại tiện ích ở component mới thêm KHÔNG byte nào',
              'The codebase has significant duplication that should be refactored|||Kho mã trùng lặp nhiều và cần được tái cấu trúc',
              'Most utilities in Tailwind go unused and should be purged|||Phần lớn tiện ích của Tailwind không được dùng và nên bị dọn',
              'The team should extract more component classes to reduce the count|||Đội ngũ nên tách thêm lớp component để giảm con số',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the strongest MEASURED answer to "utility classes are just inline styles"?|||Câu trả lời ĐO ĐƯỢC mạnh nhất cho "lớp tiện ích khác gì inline style" là gì?',
            options: [
              'The <code>style</code> attribute has no syntax for pseudo-classes or media queries at all; this app has 7,758 utilities (5,847 state + 1,911 breakpoint) that depend on exactly that|||Thuộc tính <code>style</code> KHÔNG có cú pháp nào cho lớp giả hay media query; ứng dụng này có 7.758 tiện ích (5.847 trạng thái + 1.911 điểm ngắt) phụ thuộc đúng vào đó',
              'Utility classes are shorter to type than inline style objects|||Lớp tiện ích gõ ngắn hơn object inline style',
              'Inline styles have higher specificity and cause maintenance problems|||Inline style có độ đặc hiệu cao hơn và gây khó bảo trì',
              'Utility classes scale better in large teams|||Lớp tiện ích mở rộng tốt hơn trong đội lớn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This app still uses <code>style={{}}</code> 3,128 times. When is that CORRECT rather than a mistake?|||Ứng dụng này vẫn dùng <code>style={{}}</code> 3.128 lần. Khi nào đó là ĐÚNG chứ không phải sai sót?',
            options: [
              'When the value is computed at runtime and unbounded (a percentage width, a colour from the database) — a class cannot exist for a value the generator never saw|||Khi giá trị được TÍNH lúc chạy và không chặn trên (chiều rộng phần trăm, màu từ cơ sở dữ liệu) — không thể có lớp cho một giá trị trình sinh chưa bao giờ thấy',
              'When you need the style to override a utility class|||Khi bạn cần kiểu dáng đè lên một lớp tiện ích',
              'When the component is rendered on the server|||Khi component được dựng ở phía máy chủ',
              'Never — all 3,128 should be migrated to utility classes|||Không bao giờ — cả 3.128 chỗ nên được chuyển sang lớp tiện ích',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'EVERY class in one specific file stops working, while other files are fine. Which of the four parts is at fault?|||MỌI lớp trong MỘT file cụ thể ngừng chạy, trong khi các file khác vẫn ổn. Bộ phận nào trong bốn cái là thủ phạm?',
            options: [
              '<code>content</code> — that file is outside the configured globs, so the scanner never read it. A new top-level directory added after setup is the usual cause|||<code>content</code> — file đó nằm NGOÀI các glob đã cấu hình, nên bộ quét chưa bao giờ đọc nó. Một thư mục cấp cao thêm sau lúc cài đặt là nguyên nhân thường gặp',
              'PostCSS — the plugin failed on that one file|||PostCSS — plugin hỏng trên đúng file đó',
              'The <code>@tailwind</code> directives are in the wrong order|||Các chỉ thị <code>@tailwind</code> đặt sai thứ tự',
              'The theme scale is missing values that file needs|||Thang theme thiếu các giá trị file đó cần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A class visibly exists in the built CSS file, but the element ignores it. What does that rule OUT?|||Một lớp rõ ràng CÓ trong file CSS đã dựng, nhưng thẻ vẫn lờ đi. Điều đó LOẠI TRỪ cái gì?',
            options: [
              'All four setup parts — generation clearly worked, so this is a cascade fight (specificity or source order), and reaching for <code>!important</code> before identifying the winner is the wrong first move|||Cả bốn bộ phận cấu hình — rõ ràng cú phát sinh đã chạy, nên đây là một cuộc đấu cascade (độ đặc hiệu hoặc thứ tự nguồn), và với tay tới <code>!important</code> trước khi xác định kẻ thắng là nước đi đầu tiên SAI',
              'Nothing; it could still be any of the four parts|||Không gì cả; vẫn có thể là bất kỳ bộ phận nào trong bốn',
              'Only the <code>content</code> globs|||Chỉ các glob <code>content</code>',
              'It rules out a cascade problem, since the class was generated|||Nó loại trừ vấn đề cascade, vì lớp đã được sinh',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
