const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 8: Kích thước đầu ra, đo thật.
 * Số đo: dựng CHÍNH config + CHÍNH mã nguồn của kho này bằng CLI 3.4.14.
 * 371.550 B thô / 45.242 B gzip / 3.664 quy tắc / ~5,3 s.
 */

export default {
  title: 'Chapter 8 — Output size, actually measured|||Chương 8 — Kích thước đầu ra, đo thật',
  slug: 'tw-ch8-kich-thuoc',
  description: 'Sáu bài dựng CHÍNH cái CSS mà kho này giao và cân nó. 371 KB thô nghe đáng sợ, 45 KB gzip thì không — và tỉ số 8,2:1 giữa chúng là lập luận quan trọng nhất của cả chương.',
  sortOrder: 9,
  lessons: [

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — Build it and weigh it|||8.1 — Dựng nó ra và CÂN nó',
      slug: 'tw-8-1-can-no',
      type: 'VIDEO',
      description: 'Dựng chính config và chính mã nguồn của kho này: 371.550 byte thô, 45.242 byte sau gzip, 3.664 quy tắc, ~5,3 giây. Bốn con số ấy trả lời gần hết các câu hỏi mà người ta thường tranh cãi bằng cảm giác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Build it and weigh it</h2>
<p class="lead">"Tailwind produces huge CSS" and "Tailwind produces tiny CSS" are both common claims, and both are usually made without a number. The build takes five seconds. This lesson runs it on this repository and reports what came out.</p>

<h3>The build</h3>
<pre><code class="language-bash">$ # the repo's real config, pointed at the repo's real source
$ printf '@tailwind base;\\n@tailwind components;\\n@tailwind utilities;\\n' &gt; in.css
$ npx tailwindcss -c tw.config.js -i in.css -o out.css

$ ls -l out.css
$ gzip -c out.css | wc -c
$ grep -c '^\\.' out.css
</code></pre>

<div class="out">raw   : 371.550 byte   (363 KB)
gzip  :  45.242 byte   ( 44 KB)
rules :   3.664
build :   ~5.300 ms (on dung, ba lan do)
</div>

<div class="callout ok">
<p><strong>The rule count validates Section 0.</strong> Lesson 0.1 counted <strong>3,683 distinct utilities</strong> across 26,343 class attributes by grepping the source. The build emits <strong>3,664 rules</strong>. The two numbers were arrived at completely differently — one from source text, one from generated CSS — and they agree to within 0.5%. That is the strongest confirmation available that the generator model in lesson 0.1 is accurate.</p>
</div>

<h3>Which number to quote</h3>
<p>The two size figures support opposite arguments, which is exactly why quoting one without the other is misleading:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">371 KB raw</span><span class="lz-nsub">the alarming number</span></span>
<span class="lz-nbody">What you see in a file listing, and what a critic quotes. It is real — the file on disk is that big — but it is not what crosses the network, because every server on earth compresses CSS.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">45 KB gzipped</span><span class="lz-nsub">the transferred number</span></span>
<span class="lz-nbody">What the user actually downloads. For comparison: a single medium JPEG is often 100-200 KB. The entire styling of a 793-component application costs less than one photograph.</span>
</div>
</div>

<p>The honest framing is to give both and name which is which. Lesson 8.2 measures <em>why</em> the gap is so large, because the ratio turns out to be a property of utility CSS specifically rather than a general fact about compression.</p>

<h3>What five seconds of build time means</h3>
<div class="out">run 1: 5.415 ms
run 2: 5.257 ms
run 3: 5.205 ms
</div>

<p>Consistent at roughly 5.3 seconds to scan 793 files and emit 3,664 rules. Two things follow. In development this cost is not paid per keystroke — the dev server watches and rebuilds incrementally, so the full scan happens once at startup. In CI it is paid on every build, and five seconds is small enough that no optimisation is warranted.</p>

<div class="callout warn">
<p><strong>A first run measured 8,437 ms and I nearly reported that.</strong> Re-running three times gave 5.2-5.4 s consistently, so the first figure included process startup and cold filesystem cache. Any single timing measurement is suspect; the useful number is the steady state across several runs. This is the same discipline as re-running a flaky CI job before believing it.</p>
</div>

<h3>Putting 45 KB in proportion</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a typical React bundle</span><span class="lz-lnote">150-400 KB gzipped for the JavaScript alone. CSS at 45 KB is a small fraction of what the page already ships</span></div>
<div class="lz-layer"><span class="lz-lname">one web font</span><span class="lz-lnote">20-40 KB per weight, and this repo declares five families. Fonts plausibly outweigh the entire stylesheet</span></div>
<div class="lz-layer"><span class="lz-lname">one hero image</span><span class="lz-lnote">100-300 KB for a photo. Compressing a single image better saves more bytes than any CSS optimisation available here</span></div>
<div class="lz-layer"><span class="lz-lname">CSS is render-blocking though</span><span class="lz-lnote">the one way CSS matters more than its size suggests: the browser will not paint until it arrives. 45 KB on a slow connection is still worth caring about — but the fix is caching and delivery, not deleting utilities</span></div>
</div>

<div class="callout ok">
<p><strong>The optimisation that actually matters.</strong> CSS output is essentially static across deploys — the same utilities in the same order — so it caches almost perfectly. A returning visitor downloads zero bytes of it. That property does more for real-world performance than any byte-shaving, and it is a consequence of the generator being deterministic (Chapter 3).</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — optimising CSS size before measuring the page.</strong> 45 KB gzipped is rarely the largest thing on a page, and time spent shrinking it is time not spent on the image, the font loading strategy, or the JavaScript. Open the Network tab, sort by size, and act on the top of that list. If CSS is not in the top three, this chapter is background reading rather than a task list.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Building this repository's real CSS gives 371 KB raw and 45 KB gzipped from 3,664 rules in about 5.3 seconds — the rule count independently confirms the 3,683 utilities counted from source in Section 0, and the two size figures support opposite arguments, so quoting either alone is how the size debate stays unresolved.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Optimizing for production</span><span class="lc-sub">tailwindcss.com/docs/optimizing-for-production — the official guidance, including the point that the output compresses unusually well.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Render-blocking resources</span><span class="lc-sub">web.dev/render-blocking-resources — why CSS size matters for first paint in a way JavaScript size does not, which is the one argument for caring about 45 KB.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">HTTP Archive — Web Almanac, CSS chapter</span><span class="lc-sub">almanac.httparchive.org — median CSS sizes across millions of real sites, which is the comparison that puts 45 KB in context rather than in the abstract.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — compression and cache headers</span><span class="lc-sub">/courses/nginx/learn${REF} — turning on gzip or brotli and setting immutable cache headers, which is what makes the 45 KB figure the one that counts and then makes it zero on repeat visits.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Dựng nó ra và CÂN nó</h2>
<p class="lead">"Tailwind đẻ ra CSS khổng lồ" và "Tailwind đẻ ra CSS tí hon" đều là những lời khẳng định phổ biến, và cả hai thường được nói mà KHÔNG có con số. Cú dựng tốn năm giây. Bài này chạy nó trên kho này và BÁO CÁO cái chui ra.</p>

<h3>Cú dựng</h3>
<pre><code class="language-bash">$ # config THAT cua kho, chia vao ma nguon THAT cua kho
$ printf '@tailwind base;\\n@tailwind components;\\n@tailwind utilities;\\n' &gt; in.css
$ npx tailwindcss -c tw.config.js -i in.css -o out.css

$ ls -l out.css
$ gzip -c out.css | wc -c
$ grep -c '^\\.' out.css
</code></pre>

<div class="out">raw   : 371.550 byte   (363 KB)
gzip  :  45.242 byte   ( 44 KB)
rules :   3.664
build :   ~5.300 ms (on dinh, ba lan do)
</div>

<div class="callout ok">
<p><strong>Số quy tắc XÁC NHẬN Mục 0.</strong> Bài 0.1 đếm được <strong>3.683 tiện ích khác nhau</strong> trên 26.343 thuộc tính lớp bằng cách grep MÃ NGUỒN. Cú dựng phát sinh <strong>3.664 quy tắc</strong>. Hai con số được lấy theo hai cách HOÀN TOÀN khác nhau — một từ văn bản nguồn, một từ CSS phát sinh — và chúng khớp nhau trong vòng 0,5%. Đó là XÁC NHẬN mạnh nhất có được rằng mô hình trình-sinh ở bài 0.1 là CHÍNH XÁC.</p>
</div>

<h3>Trích dẫn con số nào</h3>
<p>Hai con số kích thước chống lưng cho hai lập luận NGƯỢC nhau, chính là lý do trích một cái mà không trích cái kia là GÂY HIỂU NHẦM:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">371 KB thô</span><span class="lz-nsub">con số ĐÁNG SỢ</span></span>
<span class="lz-nbody">Cái bạn thấy khi liệt kê file, và cái một người phê bình trích. Nó CÓ THẬT — file trên đĩa to đúng thế — nhưng nó KHÔNG phải cái đi qua mạng, vì MỌI máy chủ trên đời đều nén CSS.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">45 KB sau gzip</span><span class="lz-nsub">con số ĐƯỢC TRUYỀN</span></span>
<span class="lz-nbody">Cái người dùng THẬT SỰ tải về. Để so sánh: một tấm JPEG cỡ trung thường 100-200 KB. TOÀN BỘ kiểu dáng của một ứng dụng 793 component tốn ÍT HƠN một tấm ảnh.</span>
</div>
</div>

<p>Cách đóng khung TRUNG THỰC là đưa CẢ HAI và gọi tên cái nào là cái nào. Bài 8.2 đo <em>VÌ SAO</em> khoảng cách lại lớn đến thế, vì cái tỉ số hoá ra là một TÍNH CHẤT của CSS tiện ích nói riêng chứ không phải một sự thật chung về nén.</p>

<h3>Năm giây dựng nghĩa là gì</h3>
<div class="out">run 1: 5.415 ms
run 2: 5.257 ms
run 3: 5.205 ms
</div>

<p>Ổn định ở khoảng 5,3 giây để quét 793 file và phát sinh 3.664 quy tắc. Hai điều rơi ra. Ở DEV cái giá này KHÔNG trả theo từng phím gõ — máy chủ dev theo dõi và dựng lại TỪNG PHẦN, nên cú quét đầy đủ xảy ra MỘT lần lúc khởi động. Ở CI thì nó trả ở MỌI lần dựng, và năm giây đủ nhỏ để KHÔNG cần tối ưu gì.</p>

<div class="callout warn">
<p><strong>Lần chạy ĐẦU đo được 8.437 ms và tôi SUÝT báo cáo con số đó.</strong> Chạy lại ba lần cho 5,2-5,4 s một cách ổn định, nên con số đầu tiên đã bao gồm khởi động tiến trình và cache hệ tệp còn nguội. BẤT KỲ phép đo thời gian ĐƠN LẺ nào cũng đáng ngờ; con số HỮU ÍCH là trạng thái ỔN ĐỊNH qua vài lần chạy. Đây cùng kỷ luật với việc chạy lại một job CI chập chờn TRƯỚC khi tin nó.</p>
</div>

<h3>Đặt 45 KB đúng TỈ LỆ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một gói React điển hình</span><span class="lz-lnote">150-400 KB sau gzip cho RIÊNG phần JavaScript. CSS ở mức 45 KB là một PHẦN NHỎ của cái trang vốn đã giao</span></div>
<div class="lz-layer"><span class="lz-lname">một font web</span><span class="lz-lnote">20-40 KB mỗi độ đậm, và kho này khai NĂM họ. Font hoàn toàn có thể NẶNG HƠN cả bảng kiểu</span></div>
<div class="lz-layer"><span class="lz-lname">một ảnh hero</span><span class="lz-lnote">100-300 KB cho một tấm ảnh. Nén MỘT tấm ảnh tốt hơn thì tiết kiệm nhiều byte hơn mọi cú tối ưu CSS có sẵn ở đây</span></div>
<div class="lz-layer"><span class="lz-lname">nhưng CSS CHẶN VẼ</span><span class="lz-lnote">cách DUY NHẤT khiến CSS quan trọng hơn kích thước của nó gợi ý: trình duyệt KHÔNG vẽ cho tới khi nó tới. 45 KB trên một đường truyền chậm VẪN đáng quan tâm — nhưng cú vá là CACHE và GIAO NHẬN, không phải xoá tiện ích</span></div>
</div>

<div class="callout ok">
<p><strong>Cú tối ưu THẬT SỰ quan trọng.</strong> Đầu ra CSS về cơ bản là TĨNH qua các lần deploy — cùng những tiện ích theo cùng thứ tự — nên nó CACHE gần như hoàn hảo. Một khách quay lại tải về KHÔNG byte nào của nó. Tính chất ấy làm được nhiều cho hiệu năng thực tế hơn mọi cú gọt byte, và nó là HỆ QUẢ của việc trình sinh TẤT ĐỊNH (Chương 3).</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tối ưu kích thước CSS TRƯỚC khi đo cái TRANG.</strong> 45 KB sau gzip HIẾM khi là thứ lớn nhất trên một trang, và thời gian bỏ ra để rút nó là thời gian KHÔNG bỏ vào ảnh, chiến lược tải font, hay JavaScript. Mở tab Network, sắp theo KÍCH THƯỚC, và hành động theo ĐẦU danh sách ấy. Nếu CSS không nằm trong top ba, chương này là đọc THAM KHẢO chứ không phải một danh sách việc.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Dựng CSS THẬT của kho này cho 371 KB thô và 45 KB sau gzip từ 3.664 quy tắc trong khoảng 5,3 giây — số quy tắc ĐỘC LẬP xác nhận 3.683 tiện ích đếm từ mã nguồn ở Mục 0, và hai con số kích thước chống lưng cho hai lập luận NGƯỢC nhau, nên trích một cái đơn lẻ chính là cách cuộc tranh cãi về kích thước KHÔNG BAO GIỜ ngã ngũ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Optimizing for production</span><span class="lc-sub">tailwindcss.com/docs/optimizing-for-production — hướng dẫn chính thức, gồm cả điểm rằng đầu ra nén TỐT BẤT THƯỜNG.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Render-blocking resources</span><span class="lc-sub">web.dev/render-blocking-resources — vì sao kích thước CSS quan trọng cho lần vẽ đầu theo cách kích thước JavaScript thì không, chính là lập luận DUY NHẤT để quan tâm tới 45 KB.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">HTTP Archive — Web Almanac, chương CSS</span><span class="lc-sub">almanac.httparchive.org — kích thước CSS trung vị trên hàng triệu trang thật, phép so sánh đặt 45 KB vào NGỮ CẢNH chứ không để nó trừu tượng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — nén và header cache</span><span class="lc-sub">/courses/nginx/learn${REF} — bật gzip hay brotli và đặt header cache immutable, chính là thứ làm con số 45 KB thành con số ĐÁNG KỂ rồi làm nó thành SỐ KHÔNG ở các lần thăm sau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Why gzip ends the raw-size argument|||8.2 — Vì sao gzip KẾT THÚC cuộc tranh cãi về kích thước thô',
      slug: 'tw-8-2-gzip',
      type: 'VIDEO',
      description: 'Đo có ĐỐI CHỨNG: CSS Tailwind nén 8,52:1, CSS viết tay 3,68:1, mã nguồn .tsx 4,10:1. Và cú so sánh dứt điểm — `globals.css` 166 KB thô nén xuống 45.229 B, gần Y HỆT bản Tailwind 371 KB. Một nửa kích thước thô, CÙNG cái giá qua mạng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Why gzip ends the raw-size argument</h2>
<p class="lead">Lesson 8.1 reported 371 KB raw and 45 KB gzipped and called the ratio the most important number in the chapter. That is only true if the ratio is unusual — every text file compresses somewhat. This lesson runs the controls.</p>

<h3>Three compressions, same method</h3>
<pre><code class="language-python">import gzip
def ratio(name, data):
    g = gzip.compress(data, 9)
    print(name, len(data), len(g), len(data)/len(g))
</code></pre>

<div class="out">                       raw       gzip -9    ti so
Tailwind output      371.550     43.623     8,52:1
globals.css (tay)    166.234     45.229     3,68:1
.tsx source (doi ch) 371.550     90.662     4,10:1
</div>

<p>Tailwind's output compresses <strong>2.3× better than hand-written CSS</strong> and <strong>2.1× better than source code of identical raw size</strong>. The ratio is not a general property of text — it is a property of <em>this kind</em> of output.</p>

<div class="callout ok">
<p><strong>Why utility CSS compresses so well.</strong> gzip replaces repeated byte sequences with back-references. Utility output is almost pathologically repetitive: thousands of rules with the same shape, the same property names, the same values from a small scale, in sorted order so similar rules sit adjacent. <code>.mt-1{margin-top:0.25rem}.mt-2{margin-top:0.5rem}</code> — the compressor sees <code>margin-top:0.</code> over and over. Hand-written CSS is more varied and therefore less compressible, which is exactly the trade being made.</p>
</div>

<h3>The comparison that settles it</h3>
<div class="out">Tailwind output   371.550 byte tho  ->  43.623 byte gzip
globals.css       166.234 byte tho  ->  45.229 byte gzip
                  ─────────────────      ─────────────────
                  Tailwind to gap 2,2x   nhung NHE HON qua mang
</div>

<p>The hand-written stylesheet is <strong>less than half</strong> the raw size and costs <strong>more bytes on the wire</strong>. Anyone comparing the two by <code>ls -l</code> would conclude the opposite of the truth. This single pair of numbers is the whole argument: raw size is not a proxy for transfer size when the two files have very different internal repetition.</p>

<div class="callout warn">
<p><strong>Be precise about what this does and does not show.</strong> It does not show utility CSS is smaller than hand-written CSS in general — these two files style different things and are not equivalent implementations. It shows that <em>for these two real files</em>, ranking them by raw size inverts the ranking by transfer size. That is enough to retire <code>ls -l</code> as a way of comparing stylesheets.</p>
</div>

<h3>A note on which gzip</h3>
<p>Lesson 8.1 reported 45,242 bytes and this lesson reports 43,623 for the same file. Both are correct: 8.1 used <code>gzip -c</code> at the default level 6, this lesson used level 9. The 1.6 KB gap is the compression level, not a measurement error — and it is worth naming, because reporting two different numbers for the same file without explanation is how measurements lose credibility.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">what your server actually uses</span><span class="lz-lnote">nginx defaults to gzip level 1 for CPU reasons; a CDN often pre-compresses at level 9 or 11. So the real transferred size depends on infrastructure, not just the file</span></div>
<div class="lz-layer"><span class="lz-lname">brotli beats gzip here</span><span class="lz-lnote">typically another 15-20% on CSS, and it is broadly supported. For a file this repetitive the gain is at the higher end — worth enabling before considering any other size work</span></div>
<div class="lz-layer"><span class="lz-lname">pre-compress at build time</span><span class="lz-lnote">compressing once at level 11 and serving the stored file beats compressing per request at level 1. Static assets are exactly the case where this is free</span></div>
<div class="lz-layer"><span class="lz-lname">measure the response, not the file</span><span class="lz-lnote">the Network tab shows transferred size. That is the only number that reflects your actual server config, and it is the one to quote</span></div>
</div>

<h3>What this means for the minifier</h3>
<p>CSS minification removes whitespace and shortens values. On utility output its benefit is smaller than it appears, because gzip already handles repetition — minifying mostly removes bytes that were compressing to almost nothing anyway. It still helps, and every build tool does it by default, but it is not where the leverage is.</p>

<div class="callout ok">
<p><strong>The ordering that follows.</strong> Enable brotli (or gzip) → set immutable cache headers → then, if CSS is still in your page's top three payloads, look at what is generating unusual rules. Lesson 8.3 measures where this repo's bytes actually concentrate, and the answer is narrower than "utilities in general".</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — quoting raw size in a technical argument.</strong> "Our CSS is 371 KB" is true, alarming, and describes a file nobody downloads. It is the single most common way the Tailwind size debate is conducted, on both sides. If someone raises raw size, the reply is not a counter-claim — it is the gzip figure and, if they are comparing against hand-written CSS, the measurement above showing the ranking inverts.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Utility CSS compresses at 8.52:1 against 3.68:1 for hand-written CSS and 4.10:1 for source code, because sorted repetitive rules are what gzip is best at — and this repo's own <code>globals.css</code>, at less than half the raw size, transfers slightly <em>heavier</em> than the entire Tailwind output.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 1951 — DEFLATE</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc1951 — the back-reference mechanism behind gzip, which explains why adjacency and repetition matter so much for the ratio.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google — Brotli compression</span><span class="lc-sub">github.com/google/brotli — the successor, its CSS gains over gzip, and the pre-compression workflow for static assets.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Optimizing for production</span><span class="lc-sub">tailwindcss.com/docs/optimizing-for-production — makes the compression point, though without the controlled comparison this lesson runs.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — gzip, brotli and cache headers</span><span class="lc-sub">/courses/nginx/learn${REF} — the actual directives, the CPU-versus-ratio trade at each level, and serving pre-compressed files.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Vì sao gzip KẾT THÚC cuộc tranh cãi về kích thước thô</h2>
<p class="lead">Bài 8.1 báo 371 KB thô và 45 KB gzip rồi gọi cái TỈ SỐ là con số quan trọng nhất chương. Điều đó CHỈ đúng nếu tỉ số ấy BẤT THƯỜNG — mọi file văn bản đều nén được ít nhiều. Bài này chạy các phép ĐỐI CHỨNG.</p>

<h3>Ba cú nén, cùng một phương pháp</h3>
<pre><code class="language-python">import gzip
def ratio(name, data):
    g = gzip.compress(data, 9)
    print(name, len(data), len(g), len(data)/len(g))
</code></pre>

<div class="out">                       raw       gzip -9    ti so
Tailwind output      371.550     43.623     8,52:1
globals.css (tay)    166.234     45.229     3,68:1
.tsx source (doi ch) 371.550     90.662     4,10:1
</div>

<p>Đầu ra Tailwind nén <strong>TỐT HƠN 2,3 lần so với CSS viết tay</strong> và <strong>TỐT HƠN 2,1 lần so với mã nguồn cùng kích thước thô</strong>. Cái tỉ số KHÔNG phải một tính chất chung của văn bản — nó là tính chất của <em>LOẠI đầu ra này</em>.</p>

<div class="callout ok">
<p><strong>Vì sao CSS tiện ích nén tốt đến vậy.</strong> gzip thay các dãy byte LẶP LẠI bằng tham chiếu ngược. Đầu ra tiện ích lặp lại tới mức gần như bệnh lý: hàng nghìn quy tắc cùng hình dạng, cùng tên thuộc tính, cùng giá trị từ một cái thang nhỏ, theo thứ tự đã sắp nên các quy tắc giống nhau NẰM KỀ nhau. <code>.mt-1{margin-top:0.25rem}.mt-2{margin-top:0.5rem}</code> — bộ nén thấy <code>margin-top:0.</code> lặp đi lặp lại. CSS viết tay ĐA DẠNG hơn nên nén KÉM hơn, và đó chính là cuộc đánh đổi đang diễn ra.</p>
</div>

<h3>Phép so sánh DỨT ĐIỂM</h3>
<div class="out">Tailwind output   371.550 byte tho  ->  43.623 byte gzip
globals.css       166.234 byte tho  ->  45.229 byte gzip
                  ─────────────────      ─────────────────
                  Tailwind to gap 2,2x   nhung NHE HON qua mang
</div>

<p>Bảng kiểu viết tay có kích thước thô <strong>chưa tới một nửa</strong> mà tốn <strong>NHIỀU byte hơn trên đường truyền</strong>. Bất kỳ ai so hai cái bằng <code>ls -l</code> sẽ kết luận NGƯỢC với sự thật. Chỉ một cặp số này là toàn bộ lập luận: kích thước thô KHÔNG phải đại diện cho kích thước truyền khi hai file có mức LẶP LẠI nội tại rất khác nhau.</p>

<div class="callout warn">
<p><strong>Hãy CHÍNH XÁC về cái này cho thấy gì và KHÔNG cho thấy gì.</strong> Nó KHÔNG cho thấy CSS tiện ích nhỏ hơn CSS viết tay nói CHUNG — hai file này tạo kiểu cho những thứ KHÁC nhau và không phải hai cách cài đặt tương đương. Nó cho thấy rằng <em>với HAI file thật này</em>, xếp hạng theo kích thước THÔ thì ĐẢO NGƯỢC xếp hạng theo kích thước TRUYỀN. Chừng đó đủ để cho <code>ls -l</code> nghỉ hưu khỏi việc so sánh bảng kiểu.</p>
</div>

<h3>Một ghi chú về gzip NÀO</h3>
<p>Bài 8.1 báo 45.242 byte còn bài này báo 43.623 cho CÙNG một file. Cả hai đều ĐÚNG: 8.1 dùng <code>gzip -c</code> ở mức mặc định 6, bài này dùng mức 9. Khoảng cách 1,6 KB là MỨC NÉN, không phải sai số đo — và nó đáng được GỌI TÊN, vì báo hai con số khác nhau cho cùng một file mà không giải thích là cách các phép đo ĐÁNH MẤT uy tín.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">máy chủ của bạn THẬT SỰ dùng gì</span><span class="lz-lnote">nginx mặc định gzip mức 1 vì lý do CPU; một CDN thường nén sẵn ở mức 9 hay 11. Nên kích thước truyền THẬT phụ thuộc HẠ TẦNG, không chỉ phụ thuộc cái file</span></div>
<div class="lz-layer"><span class="lz-lname">brotli thắng gzip ở đây</span><span class="lz-lnote">thường thêm 15-20% nữa trên CSS, và nó được hỗ trợ rộng. Với một file lặp lại như thế này thì cái lợi nằm ở ĐẦU CAO — đáng bật TRƯỚC khi cân nhắc bất kỳ việc nào khác về kích thước</span></div>
<div class="lz-layer"><span class="lz-lname">nén SẴN lúc dựng</span><span class="lz-lnote">nén MỘT lần ở mức 11 rồi phục vụ file đã lưu thì thắng nén theo từng yêu cầu ở mức 1. Tài sản tĩnh chính xác là ca mà chuyện này MIỄN PHÍ</span></div>
<div class="lz-layer"><span class="lz-lname">đo PHẢN HỒI, không đo FILE</span><span class="lz-lnote">tab Network hiện kích thước ĐÃ TRUYỀN. Đó là con số DUY NHẤT phản ánh cấu hình máy chủ thật của bạn, và là con số nên trích</span></div>
</div>

<h3>Điều này nghĩa gì với bộ NÉN MÃ</h3>
<p>Việc nén mã CSS gỡ khoảng trắng và rút ngắn giá trị. Trên đầu ra tiện ích thì cái lợi của nó NHỎ HƠN vẻ ngoài, vì gzip ĐÃ xử lý phần lặp lại — nén mã chủ yếu gỡ những byte vốn đã nén xuống gần như không có gì. Nó VẪN giúp, và mọi công cụ dựng đều làm mặc định, nhưng nó KHÔNG phải chỗ có đòn bẩy.</p>

<div class="callout ok">
<p><strong>Thứ tự rơi ra.</strong> Bật brotli (hoặc gzip) → đặt header cache immutable → RỒI, nếu CSS vẫn nằm trong top ba tải trọng của trang bạn, hãy xem cái gì đang sinh ra các quy tắc BẤT THƯỜNG. Bài 8.3 đo chỗ các byte của kho này THẬT SỰ tập trung, và câu trả lời HẸP hơn "tiện ích nói chung".</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — trích kích thước THÔ trong một cuộc tranh luận kỹ thuật.</strong> "CSS của chúng ta 371 KB" là ĐÚNG, ĐÁNG SỢ, và mô tả một file KHÔNG AI tải về. Nó là cách phổ biến NHẤT mà cuộc tranh cãi kích thước Tailwind được tiến hành, ở CẢ HAI phe. Nếu ai đó nêu kích thước thô, câu trả lời KHÔNG phải một phản-khẳng-định — nó là CON SỐ GZIP và, nếu họ đang so với CSS viết tay, là phép đo bên trên cho thấy xếp hạng ĐẢO NGƯỢC.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> CSS tiện ích nén ở mức 8,52:1 đối chiếu 3,68:1 của CSS viết tay và 4,10:1 của mã nguồn, vì các quy tắc lặp lại ĐÃ SẮP là thứ gzip giỏi nhất — và chính <code>globals.css</code> của kho này, với chưa tới một nửa kích thước thô, truyền đi NẶNG HƠN một chút so với TOÀN BỘ đầu ra Tailwind.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 1951 — DEFLATE</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc1951 — cơ chế tham chiếu ngược đằng sau gzip, giải thích vì sao sự KỀ NHAU và LẶP LẠI quan trọng đến thế với tỉ số.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google — Brotli compression</span><span class="lc-sub">github.com/google/brotli — kẻ kế nhiệm, cái lợi của nó trên CSS so với gzip, và quy trình nén-sẵn cho tài sản tĩnh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Optimizing for production</span><span class="lc-sub">tailwindcss.com/docs/optimizing-for-production — có nêu điểm về nén, dù KHÔNG có phép so sánh ĐỐI CHỨNG mà bài này chạy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — gzip, brotli và header cache</span><span class="lc-sub">/courses/nginx/learn${REF} — các chỉ thị thật, cuộc đánh đổi CPU-đối-lập-tỉ-số ở từng mức, và phục vụ file đã nén sẵn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Where the bytes actually concentrate|||8.3 — Chỗ các byte THẬT SỰ tập trung',
      slug: 'tw-8-3-tap-trung',
      type: 'VIDEO',
      description: 'Không phải "tiện ích nói chung". Gradient và shadow là 11,8% số quy tắc và 28,4% số byte — nặng gấp 2,4 lần mức trung bình. Và giá trị tuỳ ý là 29,6% quy tắc nhưng 33,1% byte. Byte tập trung ở chỗ ĐOÁN ĐƯỢC.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Where the bytes actually concentrate</h2>
<p class="lead">Lesson 8.2 established that the transferred size is fine. That does not mean the distribution is uniform — and knowing which rules are disproportionately expensive is what makes any future optimisation targeted rather than superstitious.</p>

<h3>The three directives, weighed separately</h3>
<div class="out">                       raw       gzip
@tailwind base        10.379     2.966
@tailwind components     706       191
@tailwind utilities  356.346    41.995
                     ───────    ──────
                     367.431    45.152
</div>

<p><strong>Utilities are 96% of the payload.</strong> Preflight — the 555 lines from lesson 7.4 that felt substantial when reading them — is 2.8%. The <code>components</code> band is 706 bytes, essentially nothing, because this repo puts almost no custom CSS in a layer (lesson 7.2's finding, seen from the other side).</p>

<div class="callout ok">
<p><strong>The practical consequence.</strong> Any conversation about CSS size is a conversation about utilities. Disabling Preflight to save bytes would recover 2,966 gzipped bytes — 6.5% — while breaking every element it normalises. That trade is never worth it, and now there is a number to say so with.</p>
</div>

<h3>Which utilities cost the most</h3>
<pre><code class="language-python"># bucket every rule by the family its selector names
for sel, body in rules:
    bytes_by_family[family(sel)] += len(sel) + len(body)
</code></pre>

<div class="out">nhom          quy tac      byte   % byte
other            2993    193143    60,8%
gradient          282     49656    15,6%
shadow            152     40474    12,7%
transform          69     17573     5,5%
ring              134     13310     4,2%
transition         25      2605     0,8%
animate             9       687     0,2%
                 ────    ──────
TONG             3664    317448
</div>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">gradient + shadow</span><span class="lz-nsub">11.8% of rules, 28.4% of bytes</span></span>
<span class="lz-nbody">434 rules carrying 90,130 bytes — <strong>2.4× heavier per rule</strong> than average. Both emit long multi-part values, and shadows in this repo stack four layers each.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">everything else</span><span class="lz-nsub">88% of rules, 72% of bytes</span></span>
<span class="lz-nbody">Spacing, colour, flex, typography. Individually tiny — <code>.mt-2{margin-top:0.5rem}</code> is 25 bytes — and they are what compresses best, because they are the most repetitive.</span>
</div>
</div>

<h3>The largest single rules</h3>
<div class="out">507 B  .shadow-\\[0_24px_80px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.65\\)\\2c 0_0_0_…
463 B  .hover\\:shadow-studio-card-hover:hover
451 B  .shadow-premium-card-hover
450 B  .shadow-studio-card-hover
442 B  .shadow-premium-card
</div>

<p>Every one is a shadow, and the top entry is an <em>arbitrary</em> shadow — a four-layer <code>box-shadow</code> written inline in a class attribute. Recall the config from Section 0: <code>premium-card</code> stacks an inset highlight, a hairline, a drop shadow and a ring. That is genuinely four shadows, so the rule is genuinely long. Nothing is wrong; it is simply where the bytes are.</p>

<h3>The arbitrary-value share</h3>
<pre><code class="language-bash">$ # rules whose selector contains an escaped bracket
</code></pre>

<div class="out">tong quy tac        : 3664
quy tac tuy y [..]  : 1085   (29,6% so quy tac)
byte tuy y          : 105.189 / 317.448  (33,1% so byte)
</div>

<p>Arbitrary values are <strong>29.6% of rules and 33.1% of bytes</strong> — mildly disproportionate, and worth reading against Chapter 1. Lesson 1.2 measured 1,398 uses of <code>text-[10px]</code> and <code>text-[11px]</code> alone. Those particular ones are cheap; the expensive arbitrary values are the long shadows and gradients that appear once each.</p>

<div class="callout warn">
<p><strong>Why arbitrary values compress worse.</strong> A scale value like <code>mt-2</code> appears in a family of near-identical siblings, so gzip back-references it almost entirely. A one-off <code>shadow-[0_24px_80px_rgba(0,0,0,0.65)]</code> has no siblings — it is 507 unique bytes with nothing to reference. This is the mechanism behind lesson 1.2's counting rule stated in terms of bytes: values that recur are nearly free, values that appear once are not.</p>
</div>

<h3>What this does and does not license</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">does NOT license removing shadows</span><span class="lz-lnote">40 KB raw is roughly 5 KB gzipped, on a page that ships fonts and images. Deleting a design feature to save 5 KB is a bad trade, and the measurement exists to let you decline it with a number</span></div>
<div class="lz-layer"><span class="lz-lname">DOES license naming repeated arbitrary shadows</span><span class="lz-lnote">a four-layer shadow used five times as an arbitrary value is 2,500 unique bytes; as a config entry it is one rule plus five short class names. This is lesson 1.2's rule, and shadows are where it pays most</span></div>
<div class="lz-layer"><span class="lz-lname">DOES tell you where to look first</span><span class="lz-lnote">if CSS ever is your largest payload, sort rules by length. The answer will be shadows and gradients, not the thousands of spacing utilities people assume are the problem</span></div>
<div class="lz-layer"><span class="lz-lname">DOES retire "too many utilities"</span><span class="lz-lnote">2,993 non-shadow non-gradient rules average 65 bytes each and compress hardest. The count of utilities is not what makes a stylesheet large</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — assuming byte share tracks rule count.</strong> Gradients are 7.7% of rules and 15.6% of bytes; spacing utilities are the opposite. Any optimisation reasoned from rule counts — "we have 3,664 rules, that seems like a lot" — targets the cheap majority and misses the expensive minority. Sort by bytes, not by count; they rank differently and only one of them is what you pay for.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Utilities are 96% of the payload and within them the cost is concentrated — gradients and shadows are 11.8% of rules but 28.4% of bytes at 2.4× the average weight, and arbitrary values take 33.1% of bytes because a one-off value has no siblings for the compressor to reference.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — box-shadow</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/box-shadow — the multi-shadow syntax that makes these the longest rules in the file, and the layering this repo's <code>premium-card</code> uses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Box shadow</span><span class="lc-sub">tailwindcss.com/docs/box-shadow — the default scale and how to add named shadows in config, which is the fix for a repeated arbitrary shadow.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Arbitrary values</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values — the escaping rules that produce those long selectors, visible in the top-five listing above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 1 — the counting rule, restated in bytes</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — one or two uses stay arbitrary, ten or more get a config name. This chapter gives the byte-level reason that threshold exists.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Chỗ các byte THẬT SỰ tập trung</h2>
<p class="lead">Bài 8.2 đã dựng được rằng kích thước TRUYỀN thì ổn. Điều đó KHÔNG có nghĩa phân bố là ĐỀU — và biết quy tắc nào ĐẮT một cách bất cân xứng chính là thứ khiến mọi cú tối ưu tương lai NHẮM TRÚNG chứ không mê tín.</p>

<h3>Ba chỉ thị, cân RIÊNG</h3>
<div class="out">                       raw       gzip
@tailwind base        10.379     2.966
@tailwind components     706       191
@tailwind utilities  356.346    41.995
                     ───────    ──────
                     367.431    45.152
</div>

<p><strong>Tiện ích là 96% tải trọng.</strong> Preflight — 555 dòng từ bài 7.4 mà đọc lên thấy đồ sộ — là 2,8%. Dải <code>components</code> là 706 byte, gần như KHÔNG GÌ, vì kho này đặt gần như KHÔNG CSS tuỳ biến nào vào một layer (phát hiện của bài 7.2, nhìn từ phía bên kia).</p>

<div class="callout ok">
<p><strong>Hệ quả thực tế.</strong> MỌI cuộc trò chuyện về kích thước CSS là một cuộc trò chuyện về TIỆN ÍCH. Tắt Preflight để tiết kiệm byte sẽ thu về 2.966 byte gzip — 6,5% — trong khi làm VỠ mọi thẻ mà nó chuẩn hoá. Cuộc đánh đổi ấy KHÔNG BAO GIỜ đáng, và giờ đã có một CON SỐ để nói điều đó.</p>
</div>

<h3>Tiện ích nào TỐN nhất</h3>
<pre><code class="language-python"># gom moi quy tac theo HO ma selector cua no goi ten
for sel, body in rules:
    bytes_by_family[family(sel)] += len(sel) + len(body)
</code></pre>

<div class="out">nhom          quy tac      byte   % byte
other            2993    193143    60,8%
gradient          282     49656    15,6%
shadow            152     40474    12,7%
transform          69     17573     5,5%
ring              134     13310     4,2%
transition         25      2605     0,8%
animate             9       687     0,2%
                 ────    ──────
TONG             3664    317448
</div>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">gradient + shadow</span><span class="lz-nsub">11,8% quy tắc, 28,4% byte</span></span>
<span class="lz-nbody">434 quy tắc gánh 90.130 byte — <strong>NẶNG GẤP 2,4 lần mỗi quy tắc</strong> so với trung bình. Cả hai đều phát sinh giá trị NHIỀU PHẦN dài, và bóng trong kho này xếp BỐN tầng mỗi cái.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">mọi thứ còn lại</span><span class="lz-nsub">88% quy tắc, 72% byte</span></span>
<span class="lz-nbody">Khoảng cách, màu, flex, kiểu chữ. Riêng lẻ thì TÍ HON — <code>.mt-2{margin-top:0.5rem}</code> là 25 byte — và chúng là thứ nén TỐT NHẤT, vì chúng LẶP LẠI nhiều nhất.</span>
</div>
</div>

<h3>Các quy tắc ĐƠN LẺ lớn nhất</h3>
<div class="out">507 B  .shadow-\\[0_24px_80px_rgba\\(0\\2c 0\\2c 0\\2c 0\\.65\\)\\2c 0_0_0_…
463 B  .hover\\:shadow-studio-card-hover:hover
451 B  .shadow-premium-card-hover
450 B  .shadow-studio-card-hover
442 B  .shadow-premium-card
</div>

<p>MỌI cái đều là BÓNG, và mục đầu bảng là một cái bóng <em>TUỲ Ý</em> — một <code>box-shadow</code> bốn tầng viết thẳng trong một thuộc tính lớp. Nhớ lại config từ Mục 0: <code>premium-card</code> xếp một điểm sáng inset, một sợi tóc, một cái bóng đổ và một cái vòng. Đó THẬT SỰ là bốn cái bóng, nên quy tắc THẬT SỰ dài. KHÔNG gì sai cả; đơn giản đó là CHỖ các byte nằm.</p>

<h3>Phần của giá trị TUỲ Ý</h3>
<pre><code class="language-bash">$ # quy tac ma selector chua mot dau ngoac da thoat</code></pre>

<div class="out">tong quy tac        : 3664
quy tac tuy y [..]  : 1085   (29,6% so quy tac)
byte tuy y          : 105.189 / 317.448  (33,1% so byte)
</div>

<p>Giá trị tuỳ ý là <strong>29,6% quy tắc và 33,1% byte</strong> — bất cân xứng NHẸ, và đáng đọc đối chiếu Chương 1. Bài 1.2 đã đo RIÊNG 1.398 lượt dùng <code>text-[10px]</code> và <code>text-[11px]</code>. Những cái ấy thì RẺ; các giá trị tuỳ ý ĐẮT là các cái bóng và gradient DÀI xuất hiện MỖI CÁI MỘT LẦN.</p>

<div class="callout warn">
<p><strong>Vì sao giá trị tuỳ ý nén KÉM hơn.</strong> Một giá trị thang như <code>mt-2</code> xuất hiện trong một HỌ các anh em gần-giống-hệt, nên gzip tham chiếu ngược gần như trọn vẹn. Một cái <code>shadow-[0_24px_80px_rgba(0,0,0,0.65)]</code> một-lần thì KHÔNG có anh em — nó là 507 byte DUY NHẤT không có gì để tham chiếu. Đây là cơ chế đằng sau luật ĐẾM của bài 1.2 phát biểu bằng byte: giá trị LẶP LẠI thì gần như miễn phí, giá trị xuất hiện MỘT lần thì không.</p>
</div>

<h3>Cái này CHO PHÉP và KHÔNG cho phép gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">KHÔNG cho phép gỡ bóng</span><span class="lz-lnote">40 KB thô là khoảng 5 KB gzip, trên một trang giao cả font lẫn ảnh. Xoá một tính năng THIẾT KẾ để tiết kiệm 5 KB là một cuộc đánh đổi TỆ, và phép đo tồn tại để bạn TỪ CHỐI nó bằng một con số</span></div>
<div class="lz-layer"><span class="lz-lname">CÓ cho phép ĐẶT TÊN các bóng tuỳ ý lặp lại</span><span class="lz-lnote">một cái bóng bốn tầng dùng năm lần dưới dạng giá trị tuỳ ý là 2.500 byte duy nhất; dưới dạng một mục config nó là MỘT quy tắc cộng năm tên lớp ngắn. Đây là luật của bài 1.2, và BÓNG là chỗ nó trả công nhiều nhất</span></div>
<div class="lz-layer"><span class="lz-lname">CÓ cho bạn biết nhìn ĐÂU trước</span><span class="lz-lnote">nếu CSS có bao giờ là tải trọng lớn nhất của bạn, hãy sắp quy tắc theo ĐỘ DÀI. Câu trả lời sẽ là bóng và gradient, KHÔNG phải hàng nghìn tiện ích khoảng cách mà người ta mặc định cho là vấn đề</span></div>
<div class="lz-layer"><span class="lz-lname">CÓ cho "quá nhiều tiện ích" nghỉ hưu</span><span class="lz-lnote">2.993 quy tắc không-bóng không-gradient trung bình 65 byte mỗi cái và nén NẶNG NHẤT. SỐ LƯỢNG tiện ích KHÔNG phải thứ làm một bảng kiểu lớn</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng phần byte bám theo SỐ quy tắc.</strong> Gradient là 7,7% quy tắc và 15,6% byte; tiện ích khoảng cách thì NGƯỢC LẠI. Mọi cú tối ưu suy luận từ SỐ ĐẾM quy tắc — "chúng ta có 3.664 quy tắc, nghe nhiều đấy" — đều nhắm vào ĐA SỐ RẺ và bỏ lỡ THIỂU SỐ ĐẮT. Hãy sắp theo BYTE, không theo SỐ ĐẾM; chúng xếp hạng KHÁC nhau và chỉ MỘT trong hai là cái bạn trả tiền.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Tiện ích là 96% tải trọng và BÊN TRONG chúng cái giá TẬP TRUNG — gradient và bóng là 11,8% quy tắc nhưng 28,4% byte ở mức nặng gấp 2,4 lần trung bình, và giá trị tuỳ ý chiếm 33,1% byte vì một giá trị MỘT-LẦN không có anh em nào cho bộ nén tham chiếu.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — box-shadow</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/box-shadow — cú pháp nhiều-bóng làm những cái này thành quy tắc DÀI NHẤT trong file, và cách xếp tầng mà <code>premium-card</code> của kho này dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Box shadow</span><span class="lc-sub">tailwindcss.com/docs/box-shadow — thang mặc định và cách thêm bóng CÓ TÊN trong config, chính là cú vá cho một cái bóng tuỳ ý bị lặp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Arbitrary values</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values — luật thoát ký tự đẻ ra các selector dài ấy, nhìn thấy được trong bảng top-năm bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 1 — luật đếm, phát biểu lại bằng byte</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — một hai lượt thì để tuỳ ý, mười lượt trở lên thì đặt tên trong config. Chương này đưa ra lý do CẤP BYTE khiến cái ngưỡng ấy tồn tại.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    {
      title: '8.4 — A fast build is a symptom, not a win|||8.4 — Dựng NHANH là một TRIỆU CHỨNG, không phải một chiến thắng',
      slug: 'tw-8-4-glob-hong',
      type: 'VIDEO',
      description: 'Chĩa `content` vào một đường dẫn gõ sai: dựng xong trong 147 ms thay vì 5.300 ms, đầu ra 10.379 byte, KHÔNG quy tắc nào. Nhanh gấp 36 lần vì nó KHÔNG LÀM GÌ. Ba con số ấy là chữ ký của một glob hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>A fast build is a symptom, not a win</h2>
<p class="lead">Lesson 0.3 listed a broken <code>content</code> glob as one of four setup failures, all presenting as "my class does not apply". This chapter can now give that failure a fingerprint made of numbers — and the fingerprint is counter-intuitive, because the broken build looks better on the metric people watch.</p>

<h3>The measurement</h3>
<p>Take the working config and introduce a typo in the path — <code>src</code> becomes <code>SRC-TYPO</code>:</p>

<div class="out">                     thoi gian    raw byte    quy tac
glob DUNG            5.300 ms     371.550       3664
glob GO SAI            147 ms      10.379          0
                     ─────────    ────────      ─────
                     nhanh 36x    nho 36x       KHONG CO GI
</div>

<p>Thirty-six times faster, because it did thirty-six times less. The 10,379 bytes are Preflight and nothing else — exactly the <code>@tailwind base</code> figure from lesson 8.3. Not one utility was generated.</p>

<div class="callout warn">
<p><strong>Why this is worse than an error.</strong> The build exits zero. There is no warning that the globs matched no files. In CI it passes. The deploy succeeds. The site ships with a stylesheet containing a browser reset and no styling at all — and the first person to notice is a user looking at an unstyled page. Meanwhile the build-time graph shows a dramatic improvement.</p>
</div>

<h3>The fingerprint</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">output near 10 KB raw</span><span class="lz-lnote">Preflight alone. Any Tailwind build that produces roughly this and nothing more has matched zero source files. The number is stable because Preflight does not depend on your source</span></div>
<div class="lz-layer"><span class="lz-lname">zero rules starting with a class selector</span><span class="lz-lnote"><code>grep -c '^\\.' out.css</code> returning 0 is unambiguous. Preflight styles elements, not classes, so a healthy build always has thousands here</span></div>
<div class="lz-layer"><span class="lz-lname">a build that got dramatically faster</span><span class="lz-lnote">the counter-intuitive one. Scanning is most of the work, so not scanning is most of the speedup. A build time that improves by an order of magnitude after a config change deserves suspicion, not celebration</span></div>
<div class="lz-layer"><span class="lz-lname">the page renders but looks unstyled</span><span class="lz-lnote">not blank — Preflight is doing its job, so text renders in a normalised default. That is why it can look like a CSS-failed-to-load problem rather than a build problem</span></div>
</div>

<h3>The check worth having in CI</h3>
<pre><code class="language-bash"># fail the build if the stylesheet has no utilities in it
RULES=$(grep -c '^\\.' "$CSS_OUT")
if [ "$RULES" -lt 100 ]; then
  echo "::error::Only $RULES rules in $CSS_OUT — content globs likely match nothing"
  exit 1
fi
</code></pre>

<p>Three lines, and it converts a silent visual catastrophe into a red build. The threshold is deliberately loose: any real project generates thousands, so 100 distinguishes "broken" from "small" without needing tuning. This is the same shape as lesson 6.2's guard for dead opacity classes — assert against the artefact, because the exit code has already told you everything is fine.</p>

<div class="callout ok">
<p><strong>Pair it with a size floor, not a ceiling.</strong> The instinct is to alert when CSS grows. The failure that actually ships broken is CSS <em>shrinking</em> — a glob that stops matching after a directory rename. A check for "output is at least 50 KB raw" catches the disaster; a check for "output is under 500 KB" catches a slow drift nobody was going to act on anyway.</p>
</div>

<h3>The opposite mistake, and why I could not measure it</h3>
<p>Lesson 0.3 warned against pointing <code>content</code> at <code>node_modules</code>. I tried to measure that cost here and the result was <strong>faster</strong> than baseline — 5,393 ms against 5,415 ms. That is impossible for a glob that adds tens of thousands of files.</p>

<pre><code class="language-bash">$ test -d /home/user/api-backend/frontend/node_modules &amp;&amp; echo EXISTS || echo ABSENT
</code></pre>

<div class="out">ABSENT — dependencies are not installed in this sandbox
</div>

<p>The glob matched nothing, so it cost nothing, and the difference was ordinary run-to-run variance. The measurement was meaningless and I am not reporting a number for it. What remains true is the mechanism from lesson 0.3 — the scanner reads every matched file — but the magnitude on a real project is not something this environment can establish.</p>

<div class="callout warn">
<p><strong>Stating what you could not measure is part of the measurement.</strong> The tempting move is to quote the 5,393 ms as if it meant something, or to substitute a figure from documentation. Both would put an unverified number next to eleven verified ones and weaken all of them. An honest gap is cheaper than a plausible fabrication.</p>
</div>

<h3>What the 5.3 seconds is actually spent on</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">scanning dominates</span><span class="lz-nsub">147 ms without it, 5,300 ms with</span></span>
<span class="lz-nbody">Reading and pattern-matching 793 files is 97% of the build. Generation itself — turning 3,664 matched class names into CSS — is the small remainder.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">so glob breadth is the lever</span><span class="lz-nsub">the only one that matters</span></span>
<span class="lz-nbody">If a build ever is too slow, the fix is narrower globs — not fewer utilities, not a smaller config. Adding a thousand more class names to your source barely moves it; adding a thousand more files does.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — celebrating a build-time improvement without checking the output.</strong> Build duration is the metric teams watch, and it is the one metric a broken content glob improves. Any config change that speeds the build materially should be followed by one <code>grep -c '^\\.'</code> on the output. If the rule count fell, the speedup was the bug.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A mistyped <code>content</code> path builds 36× faster and emits 10,379 bytes with zero rules — so the fingerprint of the most common Tailwind setup failure is a build that got dramatically <em>better</em> on the only metric anyone watches, which is why the check belongs on the artefact and the alert belongs on a size <em>floor</em>.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — the glob semantics, and the explicit warning about scanning <code>node_modules</code> that this lesson could not put a number on.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Actions — workflow commands</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — the <code>::error::</code> annotation used in the CI guard, which surfaces the failure at the top of the run summary.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Optimizing for production</span><span class="lc-sub">tailwindcss.com/docs/optimizing-for-production — build performance guidance, all of which reduces to keeping the globs tight.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">GitHub Actions — asserting on artefacts, not exit codes</span><span class="lc-sub">/courses/github-actions/learn${REF} — why a check that only reads the exit status misses every silent failure, and how to write one that inspects what was produced.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Dựng NHANH là một TRIỆU CHỨNG, không phải một chiến thắng</h2>
<p class="lead">Bài 0.3 liệt kê một glob <code>content</code> hỏng như MỘT trong bốn kiểu hỏng cấu hình, tất cả đều hiện ra thành "lớp của tôi không ăn". Chương này giờ cho cú hỏng ấy một DẤU VÂN TAY làm bằng con số — và dấu vân tay ấy PHẢN TRỰC GIÁC, vì bản dựng HỎNG trông ĐẸP HƠN trên đúng cái chỉ số mà người ta theo dõi.</p>

<h3>Phép đo</h3>
<p>Lấy config đang chạy và đưa vào một lỗi gõ trong đường dẫn — <code>src</code> thành <code>SRC-TYPO</code>:</p>

<div class="out">                     thoi gian    raw byte    quy tac
glob DUNG            5.300 ms     371.550       3664
glob GO SAI            147 ms      10.379          0
                     ─────────    ────────      ─────
                     nhanh 36x    nho 36x       KHONG CO GI
</div>

<p>Nhanh gấp ba mươi sáu lần, vì nó LÀM ÍT hơn ba mươi sáu lần. 10.379 byte ấy là Preflight và KHÔNG GÌ KHÁC — đúng con số <code>@tailwind base</code> từ bài 8.3. KHÔNG một tiện ích nào được phát sinh.</p>

<div class="callout warn">
<p><strong>Vì sao chuyện này TỆ HƠN một lỗi.</strong> Bản dựng thoát KHÔNG. KHÔNG có cảnh báo nào rằng các glob khớp KHÔNG file nào. Ở CI nó QUA. Cú deploy THÀNH CÔNG. Trang web được giao với một bảng kiểu chứa một cú reset trình duyệt và KHÔNG kiểu dáng nào cả — và người ĐẦU TIÊN nhận ra là một NGƯỜI DÙNG nhìn vào một trang không có kiểu. Trong khi đó biểu đồ thời-gian-dựng cho thấy một cải thiện NGOẠN MỤC.</p>
</div>

<h3>Dấu vân tay</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đầu ra khoảng 10 KB thô</span><span class="lz-lnote">CHỈ Preflight. Bất kỳ bản dựng Tailwind nào đẻ ra khoảng chừng này và không hơn thì đã khớp KHÔNG file nguồn nào. Con số ỔN ĐỊNH vì Preflight KHÔNG phụ thuộc mã nguồn của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG quy tắc nào bắt đầu bằng selector lớp</span><span class="lz-lnote"><code>grep -c '^\\.' out.css</code> trả về 0 là KHÔNG THỂ NHẦM. Preflight tạo kiểu cho PHẦN TỬ, không cho lớp, nên một bản dựng khoẻ LUÔN có hàng nghìn ở đây</span></div>
<div class="lz-layer"><span class="lz-lname">một bản dựng NHANH LÊN ngoạn mục</span><span class="lz-lnote">cái phản trực giác. QUÉT là phần lớn công việc, nên KHÔNG quét là phần lớn cú tăng tốc. Một thời gian dựng cải thiện MỘT BẬC ĐỘ LỚN sau một cú đổi config thì đáng NGHI, không đáng ăn mừng</span></div>
<div class="lz-layer"><span class="lz-lname">trang dựng ra được nhưng TRÔNG KHÔNG CÓ KIỂU</span><span class="lz-lnote">không TRẮNG TRƠN — Preflight đang làm việc của nó, nên chữ hiện ra ở một mặc định đã chuẩn hoá. Đó là lý do nó có thể trông như một vấn đề CSS-không-tải-được chứ không phải một vấn đề DỰNG</span></div>
</div>

<h3>Phép kiểm đáng có trong CI</h3>
<pre><code class="language-bash"># lam HONG ban dung neu bang kieu khong co tien ich nao
RULES=$(grep -c '^\\.' "$CSS_OUT")
if [ "$RULES" -lt 100 ]; then
  echo "::error::Chi $RULES quy tac trong $CSS_OUT — glob content co le khop KHONG GI"
  exit 1
fi
</code></pre>

<p>Ba dòng, và nó biến một thảm hoạ thị giác ÂM THẦM thành một bản dựng ĐỎ. Ngưỡng cố ý LỎNG: mọi dự án thật đều sinh ra hàng nghìn, nên 100 phân biệt được "hỏng" với "nhỏ" mà không cần tinh chỉnh. Đây cùng hình dạng với cái chốt ở bài 6.2 cho các lớp độ mờ chết — khẳng định đối chiếu với TẠO TÁC, vì mã thoát ĐÃ nói với bạn rằng mọi thứ đều ổn.</p>

<div class="callout ok">
<p><strong>Hãy ghép nó với một cái SÀN kích thước, không phải cái TRẦN.</strong> Bản năng là cảnh báo khi CSS LỚN LÊN. Cú hỏng THẬT SỰ được giao đi trong tình trạng vỡ là CSS <em>NHỎ ĐI</em> — một glob thôi khớp sau một cú đổi tên thư mục. Một phép kiểm "đầu ra ít nhất 50 KB thô" bắt được thảm hoạ; một phép kiểm "đầu ra dưới 500 KB" bắt được một cú trôi chậm mà đằng nào cũng không ai định hành động.</p>
</div>

<h3>Sai lầm NGƯỢC LẠI, và vì sao tôi KHÔNG đo được nó</h3>
<p>Bài 0.3 cảnh báo đừng chĩa <code>content</code> vào <code>node_modules</code>. Tôi đã thử ĐO cái giá ấy ở đây và kết quả là <strong>NHANH HƠN</strong> mức nền — 5.393 ms so với 5.415 ms. Điều đó là BẤT KHẢ với một glob thêm hàng chục nghìn file.</p>

<pre><code class="language-bash">$ test -d /home/user/api-backend/frontend/node_modules &amp;&amp; echo EXISTS || echo ABSENT
</code></pre>

<div class="out">ABSENT — cac goi phu thuoc KHONG duoc cai trong hop cat nay
</div>

<p>Cái glob khớp KHÔNG GÌ, nên nó tốn KHÔNG GÌ, và khác biệt ấy chỉ là dao động thông thường giữa các lần chạy. Phép đo VÔ NGHĨA và tôi KHÔNG báo cáo một con số cho nó. Cái VẪN ĐÚNG là cơ chế ở bài 0.3 — bộ quét ĐỌC mọi file khớp — nhưng ĐỘ LỚN trên một dự án thật là thứ môi trường này KHÔNG thiết lập được.</p>

<div class="callout warn">
<p><strong>Nói ra cái bạn KHÔNG đo được là một PHẦN của phép đo.</strong> Nước đi cám dỗ là trích 5.393 ms như thể nó có nghĩa gì đó, hoặc thay bằng một con số lấy từ tài liệu. Cả hai đều đặt một con số CHƯA XÁC MINH cạnh mười một con số ĐÃ xác minh và làm YẾU tất cả chúng. Một khoảng trống TRUNG THỰC RẺ hơn một sự bịa đặt nghe hợp lý.</p>
</div>

<h3>5,3 giây ấy THẬT SỰ tiêu vào đâu</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">QUÉT chiếm ưu thế</span><span class="lz-nsub">147 ms khi không quét, 5.300 ms khi có</span></span>
<span class="lz-nbody">Đọc và khớp mẫu 793 file là 97% cú dựng. Bản thân việc PHÁT SINH — biến 3.664 tên lớp đã khớp thành CSS — là phần dư nhỏ.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nên ĐỘ RỘNG GLOB là đòn bẩy</span><span class="lz-nsub">cái DUY NHẤT quan trọng</span></span>
<span class="lz-nbody">Nếu một bản dựng có bao giờ quá chậm, cú vá là glob HẸP HƠN — không phải ít tiện ích hơn, không phải config nhỏ hơn. Thêm một nghìn tên lớp nữa vào mã nguồn thì gần như không nhúc nhích; thêm một nghìn FILE nữa thì có.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — ăn mừng một cú cải thiện thời gian dựng mà KHÔNG kiểm đầu ra.</strong> Thời lượng dựng là chỉ số các đội theo dõi, và nó là chỉ số DUY NHẤT mà một glob content hỏng làm TỐT LÊN. Bất kỳ cú đổi config nào làm bản dựng nhanh lên ĐÁNG KỂ đều nên được theo sau bởi MỘT cú <code>grep -c '^\\.'</code> trên đầu ra. Nếu số quy tắc TỤT, thì chính cú tăng tốc ấy là con bọ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một đường dẫn <code>content</code> gõ sai dựng NHANH gấp 36 lần và phát sinh 10.379 byte với KHÔNG quy tắc nào — nên dấu vân tay của cú hỏng cấu hình Tailwind phổ biến nhất là một bản dựng TỐT LÊN ngoạn mục trên đúng cái chỉ số duy nhất ai cũng theo dõi, đó là lý do phép kiểm thuộc về TẠO TÁC và cảnh báo thuộc về một cái SÀN kích thước.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Detecting classes in source files</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files — ngữ nghĩa glob, và lời cảnh báo tường minh về việc quét <code>node_modules</code> mà bài này KHÔNG đặt được con số lên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Actions — workflow commands</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions — ghi chú <code>::error::</code> dùng trong cái chốt CI, thứ đưa cú hỏng lên ĐẦU trang tóm tắt lần chạy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Optimizing for production</span><span class="lc-sub">tailwindcss.com/docs/optimizing-for-production — hướng dẫn hiệu năng dựng, tất cả đều quy về việc giữ các glob CHẶT.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">GitHub Actions — khẳng định trên TẠO TÁC, không trên mã thoát</span><span class="lc-sub">/courses/github-actions/learn${REF} — vì sao một phép kiểm chỉ đọc mã thoát BỎ LỠ mọi cú hỏng âm thầm, và cách viết một cái SOI thứ đã được sản sinh.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    {
      title: '8.5 — The optimisation order, and where to stop|||8.5 — Thứ tự tối ưu, và chỗ NÊN DỪNG',
      slug: 'tw-8-5-thu-tu',
      type: 'VIDEO',
      description: 'Bốn bước xếp theo BYTE TIẾT KIỆM chia CÔNG SỨC, đo từ chính kho này — và một lập luận rằng với 45 KB thì bước một và hai là chỗ NÊN DỪNG. Cộng ba cú "tối ưu" LÀM MỌI THỨ TỆ ĐI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>The optimisation order, and where to stop</h2>
<p class="lead">Four lessons of measurement produce a short answer: for this repository, do the first two steps and stop. This lesson gives the ordering, the numbers behind it, and — more usefully — the point past which further work costs more than it returns.</p>

<h3>The order, by bytes saved over effort</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">compression</span><span class="lz-d">gzip takes 371 KB to 45 KB; brotli typically takes another 15-20% off a file this repetitive. One server config line. <strong>~326 KB saved.</strong></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">immutable cache headers</span><span class="lz-d">Output is deterministic across deploys, so a returning visitor downloads <em>zero</em> bytes. One config line. <strong>45 KB → 0 on repeat visits.</strong></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">name repeated arbitrary shadows</span><span class="lz-d">Lesson 8.3 found shadows are the longest rules and arbitrary values compress worst. A four-layer shadow used five times is ~2,500 unique bytes; named in config it is one rule. <strong>Low thousands of bytes, real effort.</strong></span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">everything else</span><span class="lz-d">Tightening globs, auditing unused config, pruning the nine dead animations from lesson 5.4. <strong>Hundreds of bytes, each with a diff to review.</strong></span></div>
</div>

<div class="callout ok">
<p><strong>Steps 1 and 2 are 99% of the available win and cost two lines of nginx config.</strong> Everything after them is rounding error against a page that also ships fonts and images. That is the honest conclusion of this chapter, and it is worth stating plainly because the alternative — an ongoing CSS-size project — is a common way to spend weeks moving a number nobody was going to notice.</p>
</div>

<h3>Where to stop, stated as a test</h3>
<pre><code class="language-bash"># open the Network tab, sort by transferred size
# is CSS in the top three?
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">CSS is not in the top three</span><span class="lz-lnote">stop after step 2. The bytes are somewhere else, and this chapter is background knowledge rather than a task list. For this repo, with five font families declared, that is the likely outcome</span></div>
<div class="lz-layer"><span class="lz-lname">CSS is the largest payload</span><span class="lz-lnote">then step 3 is justified — and lesson 8.3 already tells you where to look. Sort rules by length; the answer will be shadows and gradients</span></div>
<div class="lz-layer"><span class="lz-lname">CSS is growing build over build</span><span class="lz-lnote">a different problem from size: something is generating rules nobody wrote. Usually a new dependency scanned by a widened glob. Diff the rule count between builds rather than the byte total</span></div>
<div class="lz-layer"><span class="lz-lname">CSS shrank</span><span class="lz-lnote">the urgent one, from lesson 8.4. A drop means globs stopped matching. Alert on a size FLOOR, not a ceiling</span></div>
</div>

<h3>Three optimisations that make things worse</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">disabling Preflight to save bytes</span><span class="lz-nsub">recovers 2,966 gzipped bytes</span></span>
<span class="lz-nbody">6.5% of the payload, in exchange for every element losing its normalisation — headings, lists and buttons revert to browser defaults that vary per browser. Lesson 7.4 measured what it does; this measures what removing it returns. The trade is never worth it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">splitting CSS per route</span><span class="lz-nsub">turns one cached file into many</span></span>
<span class="lz-nbody">Utility CSS is shared by construction — the same <code>flex</code> serves every page. Splitting it duplicates the common utilities across bundles and destroys the caching from step 2, which was the largest win available.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">a manual safelist "to be safe"</span><span class="lz-nsub">adds rules nothing uses</span></span>
<span class="lz-nbody">Safelisting is for classes assembled at runtime, and the correct fix for those is writing complete class names (lesson 0.1). A precautionary safelist generates utilities no source file references — the one way to make the output genuinely, permanently larger.</span>
</div>
</div>

<h3>The measurement worth keeping</h3>
<p>Rather than a one-off audit, record the four numbers on every build and watch them move:</p>

<pre><code class="language-bash">printf 'raw=%s gzip=%s rules=%s\\n' \\
  "$(stat -c%s out.css)" \\
  "$(gzip -c out.css | wc -c)" \\
  "$(grep -c '^\\.' out.css)"
</code></pre>

<div class="out">raw=371550 gzip=45242 rules=3664
</div>

<p>Three numbers, one line, logged per build. A sudden fall in <code>rules</code> is lesson 8.4's broken glob. A sudden rise is a widened glob or a new dependency. A rise in <code>gzip</code> without a rise in <code>rules</code> means the new rules are unusually long — shadows or gradients, per lesson 8.3. The trend is diagnostic in a way any single snapshot is not.</p>

<div class="callout warn">
<p><strong>Do not gate the build on the byte total.</strong> A threshold on gzipped size fails on the day someone legitimately adds a feature, and the reflex is to raise the threshold — after which it never fails again and protects nothing. Gate on the <em>rule floor</em> from lesson 8.4, which only fires when something is genuinely broken, and merely <em>log</em> the sizes so a human can read the trend.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — optimising CSS because it is the thing you know how to measure.</strong> CSS size is easy to measure, easy to graph, and satisfying to reduce. Font loading strategy and image compression are harder to measure and usually worth an order of magnitude more. The measurement being convenient is not evidence that the target is the right one — and this chapter's own numbers say to do two server config lines and go and look at the images.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Compression and cache headers are two config lines that capture 99% of the available win, which for a 45 KB stylesheet is where the work should stop — and the three optimisations that actively hurt are disabling Preflight for 6.5%, splitting shared utility CSS per route, and safelisting precautionarily.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — HTTP caching</span><span class="lc-sub">web.dev/http-cache — <code>immutable</code> and long max-age on content-hashed assets, which is what makes step 2 reduce repeat visits to zero bytes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — safelisting classes</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files#safelisting-classes — when it is genuinely needed, and the warning that it is not a general precaution.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Optimize web fonts</span><span class="lc-sub">web.dev/font-best-practices — the payload this chapter keeps pointing at as the likelier target, with five font families declared in this repo's config.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — the two config lines</span><span class="lc-sub">/courses/nginx/learn${REF} — enabling brotli with a gzip fallback, and setting immutable cache headers on hashed static assets.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Thứ tự tối ưu, và chỗ NÊN DỪNG</h2>
<p class="lead">Bốn bài đo đạc cho ra một câu trả lời NGẮN: với kho này, làm HAI bước đầu rồi DỪNG. Bài này đưa ra thứ tự, các con số đằng sau nó, và — hữu ích hơn — cái ĐIỂM mà quá nó thì làm thêm TỐN hơn thu về.</p>

<h3>Thứ tự, theo BYTE TIẾT KIỆM chia CÔNG SỨC</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">NÉN</span><span class="lz-d">gzip đưa 371 KB xuống 45 KB; brotli thường lấy thêm 15-20% nữa trên một file lặp lại như thế này. MỘT dòng cấu hình máy chủ. <strong>~326 KB tiết kiệm.</strong></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">header cache immutable</span><span class="lz-d">Đầu ra TẤT ĐỊNH qua các lần deploy, nên một khách quay lại tải về <em>KHÔNG</em> byte nào. MỘT dòng cấu hình. <strong>45 KB → 0 ở các lần thăm sau.</strong></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ĐẶT TÊN các bóng tuỳ ý bị lặp</span><span class="lz-d">Bài 8.3 tìm ra bóng là các quy tắc DÀI NHẤT và giá trị tuỳ ý nén KÉM NHẤT. Một cái bóng bốn tầng dùng năm lần là ~2.500 byte duy nhất; đặt tên trong config thì nó là MỘT quy tắc. <strong>Vài nghìn byte, công sức THẬT.</strong></span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">mọi thứ còn lại</span><span class="lz-d">Siết glob, soát config không dùng, tỉa chín hoạt ảnh chết từ bài 5.4. <strong>Hàng trăm byte, mỗi cái một diff phải review.</strong></span></div>
</div>

<div class="callout ok">
<p><strong>Bước 1 và 2 là 99% cái lợi có sẵn và tốn HAI dòng cấu hình nginx.</strong> Mọi thứ sau chúng là sai số làm tròn đối chiếu với một trang vốn cũng giao font và ảnh. Đó là kết luận TRUNG THỰC của chương này, và đáng nói THẲNG vì lựa chọn thay thế — một dự án kích-thước-CSS kéo dài — là một cách phổ biến để tiêu hàng tuần dịch một con số mà đằng nào cũng không ai để ý.</p>
</div>

<h3>Chỗ nên DỪNG, phát biểu thành một phép kiểm</h3>
<pre><code class="language-bash"># mo tab Network, sap theo kich thuoc DA TRUYEN
# CSS co nam trong top ba khong?
</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">CSS KHÔNG ở top ba</span><span class="lz-lnote">dừng sau bước 2. Các byte nằm ở CHỖ KHÁC, và chương này là kiến thức NỀN chứ không phải một danh sách việc. Với kho này, vốn khai NĂM họ font, đó là kết cục nhiều khả năng</span></div>
<div class="lz-layer"><span class="lz-lname">CSS là tải trọng LỚN NHẤT</span><span class="lz-lnote">thì bước 3 CHÍNH ĐÁNG — và bài 8.3 ĐÃ nói cho bạn nhìn đâu. Sắp quy tắc theo độ dài; câu trả lời sẽ là bóng và gradient</span></div>
<div class="lz-layer"><span class="lz-lname">CSS LỚN LÊN qua từng bản dựng</span><span class="lz-lnote">một vấn đề KHÁC với kích thước: có thứ gì đó đang sinh ra quy tắc KHÔNG AI viết. Thường là một phụ thuộc mới bị một glob nới rộng quét trúng. Hãy diff SỐ QUY TẮC giữa các bản dựng chứ không diff tổng byte</span></div>
<div class="lz-layer"><span class="lz-lname">CSS NHỎ ĐI</span><span class="lz-lnote">cái KHẨN CẤP, từ bài 8.4. Một cú tụt nghĩa là glob thôi khớp. Hãy cảnh báo trên một cái SÀN kích thước, không phải cái trần</span></div>
</div>

<h3>Ba cú tối ưu làm MỌI THỨ TỆ ĐI</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">tắt Preflight để tiết kiệm byte</span><span class="lz-nsub">thu về 2.966 byte gzip</span></span>
<span class="lz-nbody">6,5% tải trọng, đổi lấy việc MỌI thẻ mất chuẩn hoá — tiêu đề, danh sách và nút quay về các mặc định trình duyệt vốn KHÁC nhau giữa các trình duyệt. Bài 7.4 đã đo nó LÀM gì; cái này đo việc GỠ nó thu về gì. Cuộc đánh đổi KHÔNG BAO GIỜ đáng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">chẻ CSS theo từng route</span><span class="lz-nsub">biến MỘT file được cache thành NHIỀU</span></span>
<span class="lz-nbody">CSS tiện ích DÙNG CHUNG theo cấu tạo — cùng một <code>flex</code> phục vụ mọi trang. Chẻ nó ra thì NHÂN BẢN các tiện ích chung qua các gói và PHÁ HUỶ phần cache ở bước 2, vốn là cái lợi LỚN NHẤT có sẵn.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">một safelist thủ công "cho chắc"</span><span class="lz-nsub">thêm quy tắc KHÔNG GÌ dùng</span></span>
<span class="lz-nbody">Safelist là để cho các lớp ghép LÚC CHẠY, và cú vá đúng cho những cái đó là viết TÊN LỚP HOÀN CHỈNH (bài 0.1). Một safelist phòng xa sinh ra các tiện ích KHÔNG file nguồn nào tham chiếu — cách DUY NHẤT làm đầu ra lớn lên một cách thật sự, VĨNH VIỄN.</span>
</div>
</div>

<h3>Phép đo đáng GIỮ LẠI</h3>
<p>Thay vì một cuộc soát MỘT LẦN, hãy ghi lại các con số ở MỌI bản dựng và xem chúng DỊCH CHUYỂN:</p>

<pre><code class="language-bash">printf 'raw=%s gzip=%s rules=%s\\n' \\
  "$(stat -c%s out.css)" \\
  "$(gzip -c out.css | wc -c)" \\
  "$(grep -c '^\\.' out.css)"
</code></pre>

<div class="out">raw=371550 gzip=45242 rules=3664
</div>

<p>Ba con số, một dòng, ghi log theo từng bản dựng. Một cú TỤT đột ngột ở <code>rules</code> là glob hỏng ở bài 8.4. Một cú TĂNG đột ngột là một glob nới rộng hay một phụ thuộc mới. Một cú tăng ở <code>gzip</code> mà KHÔNG tăng ở <code>rules</code> nghĩa là các quy tắc mới DÀI bất thường — bóng hay gradient, theo bài 8.3. XU HƯỚNG có tính chẩn đoán theo cách mà bất kỳ ảnh chụp ĐƠN LẺ nào không có.</p>

<div class="callout warn">
<p><strong>ĐỪNG chặn bản dựng bằng TỔNG BYTE.</strong> Một ngưỡng trên kích thước gzip sẽ HỎNG vào ngày ai đó thêm một tính năng CHÍNH ĐÁNG, và phản xạ là NÂNG ngưỡng — sau đó nó KHÔNG BAO GIỜ hỏng nữa và không bảo vệ gì cả. Hãy chặn bằng <em>SÀN SỐ QUY TẮC</em> từ bài 8.4, thứ chỉ nổ khi có gì đó THẬT SỰ hỏng, và chỉ <em>GHI LOG</em> các kích thước để một con người đọc được xu hướng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tối ưu CSS VÌ nó là thứ bạn biết cách đo.</strong> Kích thước CSS dễ đo, dễ vẽ biểu đồ, và giảm nó thì thoả mãn. Chiến lược tải font và nén ảnh thì KHÓ đo hơn và thường đáng giá GẤP MỘT BẬC ĐỘ LỚN. Việc phép đo TIỆN không phải bằng chứng rằng mục tiêu ấy ĐÚNG — và chính các con số của chương này bảo hãy làm hai dòng cấu hình máy chủ rồi đi NHÌN VÀO ẢNH.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Nén và header cache là HAI dòng cấu hình thu về 99% cái lợi có sẵn, và với một bảng kiểu 45 KB thì đó là chỗ công việc NÊN DỪNG — còn ba cú tối ưu THẬT SỰ gây hại là tắt Preflight để lấy 6,5%, chẻ CSS tiện ích dùng chung theo route, và safelist phòng xa.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — HTTP caching</span><span class="lc-sub">web.dev/http-cache — <code>immutable</code> và max-age dài trên tài sản băm-theo-nội-dung, chính là thứ khiến bước 2 giảm các lần thăm sau xuống KHÔNG byte.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — safelisting classes</span><span class="lc-sub">tailwindcss.com/docs/detecting-classes-in-source-files#safelisting-classes — khi nào nó THẬT SỰ cần, và lời cảnh báo rằng nó KHÔNG phải một biện pháp phòng xa chung.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Optimize web fonts</span><span class="lc-sub">web.dev/font-best-practices — cái tải trọng mà chương này cứ trỏ vào như mục tiêu NHIỀU KHẢ NĂNG hơn, với năm họ font khai trong config kho này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — hai dòng cấu hình ấy</span><span class="lc-sub">/courses/nginx/learn${REF} — bật brotli với gzip dự phòng, và đặt header cache immutable trên tài sản tĩnh đã băm.</span></span></div>
</div>
`,
    },


    /* ─────────────────────────── 8.6 ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
      slug: 'tw-8-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về kích thước: 371 KB thô thành 45 KB qua mạng, cú đảo ngược globals.css, 96% tải trọng là tiện ích, chữ ký của một glob hỏng, và vì sao công việc NÊN DỪNG sau bước 2.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>What Chapter 8 measured</h2>
<p class="lead">Eight questions, twelve minutes. Every number here came from building this repo&#39;s real config against its real source with Tailwind CLI 3.4.14 — not from documentation, and not from a demo project.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">8.1 — the four numbers</span><span class="lz-lnote">371.550 B raw · 45.242 B gzip · 3.664 rules · ~5,3 s. The rule count independently confirms Section 0&#39;s 3.683 distinct utilities to within 0,5%</span></div>
<div class="lz-layer"><span class="lz-lname">8.2 — the inversion</span><span class="lz-lnote">Tailwind compresses 8,52:1, hand-written CSS 3,68:1. <code>globals.css</code> is less than half the raw size and costs MORE on the wire — 45.229 B against 43.623 B</span></div>
<div class="lz-layer"><span class="lz-lname">8.3 — where bytes sit</span><span class="lz-lnote">utilities are 96% of the payload. Gradient + shadow are 11,8% of rules but 28,4% of bytes — 2,4× heavier per rule than average</span></div>
<div class="lz-layer"><span class="lz-lname">8.4 — the fingerprint</span><span class="lz-lnote">a broken glob builds 36× faster: 147 ms, 10.379 B, ZERO rules. The failure improves the metric people watch</span></div>
<div class="lz-layer"><span class="lz-lname">8.5 — where to stop</span><span class="lz-lnote">compression + cache headers are two config lines worth 99% of the available win. Gate builds on a rule-count FLOOR, never a byte ceiling</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Chương 8 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mọi con số ở đây đến từ việc dựng CHÍNH config thật của kho này với CHÍNH mã nguồn thật bằng Tailwind CLI 3.4.14 — không phải từ tài liệu, cũng không phải từ một dự án mẫu.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">8.1 — bốn con số</span><span class="lz-lnote">371.550 B thô · 45.242 B gzip · 3.664 quy tắc · ~5,3 s. Số quy tắc XÁC NHẬN ĐỘC LẬP con số 3.683 lớp duy nhất ở Mục 0, lệch trong 0,5%</span></div>
<div class="lz-layer"><span class="lz-lname">8.2 — cú đảo ngược</span><span class="lz-lnote">Tailwind nén 8,52:1, CSS viết tay 3,68:1. <code>globals.css</code> chưa bằng NỬA kích thước thô mà tốn NHIỀU byte hơn qua mạng — 45.229 B so với 43.623 B</span></div>
<div class="lz-layer"><span class="lz-lname">8.3 — byte nằm ở đâu</span><span class="lz-lnote">tiện ích là 96% tải trọng. Gradient + bóng là 11,8% số quy tắc nhưng 28,4% số byte — nặng gấp 2,4 lần trung bình mỗi quy tắc</span></div>
<div class="lz-layer"><span class="lz-lname">8.4 — chữ ký</span><span class="lz-lnote">một glob hỏng dựng NHANH GẤP 36 LẦN: 147 ms, 10.379 B, KHÔNG quy tắc nào. Cái hỏng làm ĐẸP chính chỉ số người ta hay theo dõi</span></div>
<div class="lz-layer"><span class="lz-lname">8.5 — chỗ nên dừng</span><span class="lz-lnote">nén và header cache là hai dòng cấu hình đáng 99% cái lợi có sẵn. Chặn bản dựng bằng SÀN số quy tắc, KHÔNG BAO GIỜ bằng trần byte</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'The build emits 371.550 bytes of CSS and 3.664 rules. Why is the rule count the more reassuring of the two numbers?|||Bản dựng phát ra 371.550 byte CSS và 3.664 quy tắc. Vì sao SỐ QUY TẮC mới là con số đáng yên tâm hơn trong hai cái?',
            options: [
              'Because it independently confirms the scan worked — Section 0 counted 3.683 distinct utility classes in the source by a completely different method, and the two agree to within 0,5%|||Vì nó XÁC NHẬN ĐỘC LẬP rằng phép quét đã chạy đúng — Mục 0 đếm được 3.683 lớp tiện ích khác nhau trong mã nguồn bằng một phương pháp HOÀN TOÀN KHÁC, và hai con số khớp nhau trong 0,5%',
              'Because rule count is what browsers spend time parsing, and bytes are irrelevant to parse cost|||Vì số quy tắc là thứ trình duyệt tốn thời gian phân tích, còn byte thì không liên quan gì tới chi phí phân tích',
              'Because Tailwind guarantees one rule per class in the config|||Vì Tailwind bảo đảm mỗi lớp trong config cho đúng một quy tắc',
              'Because the raw byte count changes with the minifier and the rule count does not|||Vì số byte thô thay đổi theo bộ rút gọn còn số quy tắc thì không',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Tailwind&#39;s output is 371.550 raw bytes and <code>globals.css</code> is 166.234. Which costs more to transfer, and what does that prove?|||Đầu ra Tailwind là 371.550 byte thô còn <code>globals.css</code> là 166.234. Cái nào tốn NHIỀU HƠN qua mạng, và điều đó chứng minh gì?',
            options: [
              '<code>globals.css</code> — 45.229 gzipped against Tailwind&#39;s 43.623. Less than half the raw size, more bytes on the wire, so raw size is not a proxy for transfer size when internal repetition differs|||<code>globals.css</code> — 45.229 byte gzip so với 43.623 của Tailwind. Chưa bằng NỬA kích thước thô mà tốn nhiều byte hơn qua mạng, nên kích thước thô KHÔNG đại diện cho kích thước truyền khi độ lặp bên trong khác nhau',
              'Tailwind — it is 2,2× larger raw, so it is roughly 2,2× larger compressed too|||Tailwind — nó lớn gấp 2,2 lần khi thô, nên nén xong cũng lớn gấp khoảng 2,2 lần',
              'They transfer identically, because gzip normalises all CSS to the same density|||Chúng truyền y hệt nhau, vì gzip đưa mọi CSS về cùng một mật độ',
              'Impossible to say without knowing which minifier ran|||Không thể nói được nếu chưa biết bộ rút gọn nào đã chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does utility CSS compress 2,3× better than hand-written CSS of the same kind of content?|||Vì sao CSS tiện ích nén TỐT HƠN 2,3 lần so với CSS viết tay cùng loại nội dung?',
            options: [
              'gzip replaces repeated byte sequences with back-references, and sorted utility output is pathologically repetitive — thousands of rules with the same property names and values from a small scale, sitting adjacent|||gzip thay các dãy byte lặp bằng tham chiếu lùi, mà đầu ra tiện ích ĐÃ SẮP XẾP thì lặp đến mức bệnh lý — hàng nghìn quy tắc cùng tên thuộc tính, cùng giá trị lấy từ một thang nhỏ, nằm SÁT NHAU',
              'Because Tailwind pre-compresses its output before writing the file|||Vì Tailwind nén trước đầu ra rồi mới ghi file',
              'Because utility class names are shorter than semantic class names|||Vì tên lớp tiện ích ngắn hơn tên lớp ngữ nghĩa',
              'Because Tailwind removes all comments and hand-written CSS keeps them|||Vì Tailwind gỡ hết chú thích còn CSS viết tay thì giữ lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Weighed separately: base 10.379 B, components 706 B, utilities 356.346 B. What follows?|||Cân riêng từng phần: base 10.379 B, components 706 B, utilities 356.346 B. Suy ra điều gì?',
            options: [
              'Utilities are 96% of the payload, so every conversation about CSS size is a conversation about utilities — and the 706-byte components band is small because this repo puts almost no custom CSS inside a layer|||Tiện ích là 96% tải trọng, nên mọi cuộc bàn về kích thước CSS đều là cuộc bàn về TIỆN ÍCH — và dải components 706 byte nhỏ vì kho này gần như KHÔNG đặt CSS tuỳ biến nào trong layer',
              'Preflight is the obvious place to cut, since 10.379 bytes is the second-largest band|||Preflight là chỗ cắt hiển nhiên, vì 10.379 byte là dải lớn thứ hai',
              'The components band is broken — 706 bytes means the directive failed to emit|||Dải components bị hỏng — 706 byte nghĩa là chỉ thị không phát ra được gì',
              'Base and components together are worth optimising before utilities, because they are easier to change|||Base và components gộp lại đáng tối ưu TRƯỚC tiện ích, vì chúng dễ sửa hơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which rule family is disproportionately expensive, and by how much?|||Nhóm quy tắc nào đắt một cách MẤT CÂN ĐỐI, và đắt bao nhiêu?',
            options: [
              'Gradient and shadow — 434 rules carrying 90.130 bytes: 11,8% of rules but 28,4% of bytes, so 2,4× heavier per rule than average, because both emit long multi-part values and this repo stacks four shadow layers|||Gradient và bóng — 434 quy tắc mang 90.130 byte: 11,8% số quy tắc nhưng 28,4% số byte, tức nặng gấp 2,4 lần trung bình mỗi quy tắc, vì cả hai phát ra giá trị NHIỀU PHẦN dài và kho này xếp bốn lớp bóng',
              'Spacing — it has the most rules, so it must carry the most bytes|||Khoảng cách — nó có nhiều quy tắc nhất, nên hẳn phải mang nhiều byte nhất',
              'Animation — nine rules but very long keyframe bodies|||Hoạt ảnh — chín quy tắc nhưng thân keyframe rất dài',
              'Colour — 2.677 dark-theme uses make it the heaviest family|||Màu — 2.677 lượt dùng theme tối làm nó thành nhóm nặng nhất',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A colleague reports the CSS build got 36× faster overnight — 147 ms instead of 5.300 ms. What do you check first?|||Một đồng nghiệp báo bản dựng CSS đột nhiên NHANH GẤP 36 LẦN qua một đêm — 147 ms thay vì 5.300 ms. Bạn kiểm tra gì TRƯỚC?',
            options: [
              'The rule count and output size — a broken <code>content</code> glob emits 10.379 bytes and ZERO rules, which is exactly Preflight alone. Fast is the symptom; scanning nothing is the cause|||Số quy tắc và kích thước đầu ra — một glob <code>content</code> hỏng phát ra 10.379 byte và KHÔNG quy tắc nào, đúng bằng một mình Preflight. NHANH là triệu chứng; không quét gì mới là nguyên nhân',
              'Whether the machine has more RAM available than yesterday|||Xem máy có nhiều RAM rảnh hơn hôm qua không',
              'Nothing — a faster build is unambiguously good news|||Không gì cả — dựng nhanh hơn là tin tốt không cần bàn',
              'Whether someone enabled the Tailwind build cache|||Xem có ai bật bộ đệm dựng của Tailwind không',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why gate CI on a rule-count FLOOR rather than a gzip-size CEILING?|||Vì sao chặn CI bằng SÀN SỐ QUY TẮC thay vì TRẦN KÍCH THƯỚC gzip?',
            options: [
              'A size ceiling breaks the day someone adds a legitimate feature, and the reflex is to raise it — after which it never fires again. A rule-count floor only fires when scanning genuinely broke|||Trần kích thước sẽ HỎNG vào ngày ai đó thêm một tính năng CHÍNH ĐÁNG, và phản xạ là NÂNG nó lên — sau đó nó không bao giờ nổ nữa. Sàn số quy tắc chỉ nổ khi phép quét THẬT SỰ hỏng',
              'Because gzip size is not deterministic across machines and rule count is|||Vì kích thước gzip không xác định giữa các máy còn số quy tắc thì có',
              'Because rule count is cheaper to compute in CI|||Vì số quy tắc rẻ hơn để tính trong CI',
              'Because a size ceiling cannot detect a broken glob at all|||Vì trần kích thước hoàn toàn không phát hiện được glob hỏng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these is the chapter&#39;s actual conclusion about optimisation work?|||Cái nào là KẾT LUẬN THẬT của chương này về việc tối ưu?',
            options: [
              'Enable compression and set cache headers — two config lines worth 99% of the available win — then STOP, because at 45 KB the remaining leverage is in fonts and images, not CSS|||Bật nén và đặt header cache — hai dòng cấu hình đáng 99% cái lợi có sẵn — rồi DỪNG, vì ở mức 45 KB thì đòn bẩy còn lại nằm ở FONT và ẢNH, không phải CSS',
              'Disable Preflight to recover 6,5% of the payload|||Tắt Preflight để lấy lại 6,5% tải trọng',
              'Split the CSS per route so each page downloads only what it needs|||Chẻ CSS theo từng route để mỗi trang chỉ tải phần nó cần',
              'Add a precautionary safelist so no class can ever be missed|||Thêm một safelist phòng xa để không lớp nào bị bỏ sót',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
