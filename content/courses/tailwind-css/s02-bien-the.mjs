const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 2: Biến thể, và cái chúng BIÊN DỊCH RA.
 * Số đo: đầu ra CSS thật của Tailwind CLI 3.4.14 cho từng loại biến thể,
 * gồm cả thứ tự phát sinh (media query luôn ĐỨNG CUỐI).
 */

export default {
  title: 'Chapter 2 — Variants, and what they compile to|||Chương 2 — Biến thể, và cái chúng BIÊN DỊCH RA',
  slug: 'tw-ch2-bien-the',
  description: 'Sáu bài mở nắp cái tiền tố: `hover:` thành lớp giả, `md:` thành media query đặt CUỐI file, `group-hover:` thành selector CON CHÁU, `peer-` thành selector ANH EM. Biết chúng biên dịch ra gì thì mọi hành vi lạ về sau đều đoán được.',
  sortOrder: 3,
  lessons: [

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Five variant shapes, read from the output|||2.1 — Năm hình dạng biến thể, đọc từ đầu ra',
      slug: 'tw-2-1-nam-hinh-dang',
      type: 'VIDEO',
      description: 'Một lần dựng thật cho thấy `hover:`, `md:`, `group-hover:`, `peer-checked:` và `dark:` biên dịch ra NĂM hình dạng selector khác nhau — và bốn trong năm cái có hệ quả mà tên lớp không hề gợi ý.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Five variant shapes, read from the output</h2>
<p class="lead">A variant prefix looks like a uniform mechanism: put a word and a colon in front of a utility. It is not uniform. The five common prefixes compile to five structurally different selectors, and the differences explain most of the confusing behaviour people attribute to Tailwind being magic.</p>

<h3>The measurement</h3>
<p>Put one of each in a file and read what comes out. No documentation involved:</p>

<pre><code class="language-html">&lt;!-- page.html --&gt;
&lt;div class="hover:bg-blue-500 md:flex group-hover:opacity-50
            peer-checked:block dark:text-white"&gt;&lt;/div&gt;
</code></pre>

<pre><code class="language-bash">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
$ cat out.css
</code></pre>

<div class="out">.hover\\:bg-blue-500:hover { background-color: rgb(59 130 246 / …) }

.group:hover .group-hover\\:opacity-50 { opacity: 0.5 }

.peer:checked ~ .peer-checked\\:block { display: block }

.dark\\:text-white:is(.dark *) { color: rgb(255 255 255 / …) }

@media (min-width: 768px) {
  .md\\:flex { display: flex }
}
</div>

<p>Five prefixes, five different selector structures. Read each one carefully, because each carries a rule you cannot guess from the class name.</p>

<h3>Shape 1 — the pseudo-class append</h3>
<div class="out">.hover\\:bg-blue-500:hover
</div>
<p>The simplest case. The class name is <code>hover:bg-blue-500</code> with the colon <em>escaped</em> as <code>\\:</code> — because a bare colon in a CSS selector would start a pseudo-class. Then <code>:hover</code> is appended. This is the shape for <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, <code>first:</code>, <code>checked:</code> — anything that is a real CSS pseudo-class.</p>

<div class="callout ok">
<p><strong>The consequence.</strong> Specificity is <code>0,2,0</code> — one class plus one pseudo-class — versus <code>0,1,0</code> for a plain utility. That is why <code>hover:bg-red-500</code> reliably beats <code>bg-blue-500</code> regardless of source order. It is not special handling; the hover rule is genuinely more specific.</p>
</div>

<h3>Shape 2 — the descendant combinator</h3>
<div class="out">.group:hover .group-hover\\:opacity-50
</div>
<p>Note the <strong>space</strong>. This is a descendant selector: "an element with <code>group-hover:opacity-50</code>, anywhere inside an element with <code>group</code> that is being hovered". Two separate elements are involved, which is why <code>group-hover:</code> silently does nothing if you forget to put <code>group</code> on an ancestor — the selector simply never matches, and nothing warns you.</p>

<h3>Shape 3 — the sibling combinator</h3>
<div class="out">.peer:checked ~ .peer-checked\\:block
</div>
<p>The <code>~</code> is the general sibling combinator, and it is <em>directional</em>: it matches siblings that come <strong>after</strong> the peer in the document. So a <code>peer-checked:</code> element placed <em>before</em> its peer will never match. This catches people building a floating label above an input — the label must come after the input in the DOM and be positioned above it visually, not the other way round.</p>

<h3>Shape 4 — the <code>:is()</code> ancestor test</h3>
<div class="out">.dark\\:text-white:is(.dark *)
</div>
<p><code>:is(.dark *)</code> means "and this element is a descendant of something with class <code>dark</code>". Two things follow. First, the toggle is a class on an ancestor — usually <code>&lt;html&gt;</code> — so dark mode is a DOM state, not a media query, under <code>darkMode: 'class'</code>. Second, and less obviously: <code>:is()</code> takes the specificity of its most specific argument, so this selector is <code>0,2,0</code>, beating plain utilities.</p>

<div class="callout warn">
<p><strong>This is the mechanism behind a real incident in this repository.</strong> CLAUDE.md records that putting the class <code>dark</code> on <code>&lt;html&gt;</code> for a global theme <em>force-activated every <code>dark:</code> utility in the app</em>, breaking a feature that had its own three-theme switcher. The reason is exactly the selector above: every <code>dark:</code> class in the entire codebase matches as soon as any ancestor has <code>.dark</code>. The fix was to name the global theme class <code>theme-dark</code> instead, leaving <code>.dark</code> reserved. Lesson 2.4 covers this in full.</p>
</div>

<h3>Shape 5 — the media query wrapper</h3>
<div class="out">@media (min-width: 768px) {
  .md\\:flex { display: flex }
}
</div>
<p>Structurally unlike the other four: the selector is unchanged and the <em>rule</em> is wrapped. Specificity is therefore <code>0,1,0</code> — identical to a plain utility. A media query adds no specificity at all.</p>

<div class="callout warn">
<p><strong>So what makes <code>md:flex</code> beat <code>flex</code>?</strong> Source order, and nothing else. Look at the output again: the media query block is emitted <em>after</em> all the unprefixed rules. At equal specificity, later wins. This is the single most important structural fact in this lesson, and lesson 2.3 measures what happens when you rely on it without knowing it.</p>
</div>

<h3>The summary table</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">pseudo-class (<code>hover:</code>, <code>focus:</code>, <code>disabled:</code>)</span><span class="lz-lnote">appends <code>:hover</code> etc. Specificity 0,2,0 — beats plain utilities on merit</span></div>
<div class="lz-layer"><span class="lz-lname">group (<code>group-hover:</code>)</span><span class="lz-lnote">descendant selector across TWO elements. Fails silently if <code>group</code> is missing from an ancestor</span></div>
<div class="lz-layer"><span class="lz-lname">peer (<code>peer-checked:</code>)</span><span class="lz-lnote">sibling combinator <code>~</code>, DIRECTIONAL. Only matches siblings AFTER the peer in the DOM</span></div>
<div class="lz-layer"><span class="lz-lname">dark (<code>dark:</code>)</span><span class="lz-lnote"><code>:is(.dark *)</code> ancestor test. Specificity 0,2,0, and a single ancestor class switches every such utility app-wide</span></div>
<div class="lz-layer"><span class="lz-lname">breakpoint (<code>md:</code>)</span><span class="lz-lnote">wraps the rule in <code>@media</code>. Specificity UNCHANGED at 0,1,0 — it wins purely by being emitted later</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — assuming all variants raise specificity.</strong> Four of the five do; the breakpoint does not. That asymmetry is invisible from the syntax, and it means a hand-written CSS rule with specificity <code>0,2,0</code> will beat <code>md:flex</code> while losing to <code>hover:flex</code>. When a responsive class mysteriously does not apply and a hover class on the same element does, this asymmetry is the first thing to check.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The uniform <code>prefix:</code> syntax hides five structurally different compilations — pseudo-class append, descendant selector, directional sibling combinator, <code>:is()</code> ancestor test, and media-query wrapper — and the last one is the odd member because it adds no specificity and wins only by being emitted later in the file.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Hover, focus, and other states</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states — the full variant catalogue. Read it after this lesson, so each entry reads as "which of the five shapes is this".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:is()</code> and its specificity rule</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:is — the rule that <code>:is()</code> takes the specificity of its most specific argument, which is what makes the <code>dark:</code> shape score 0,2,0.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — general sibling combinator <code>~</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator — the directionality that makes <code>peer-*</code> only work on later siblings.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — specificity, computed properly</span><span class="lc-sub">/courses/web-foundations/learn${REF} — how the three-number specificity tuple is calculated and compared. Every claim in this lesson about which rule wins is that arithmetic.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Năm hình dạng biến thể, đọc từ đầu ra</h2>
<p class="lead">Một tiền tố biến thể TRÔNG như một cơ chế ĐỒNG NHẤT: đặt một từ và một dấu hai chấm trước một tiện ích. Nó KHÔNG đồng nhất. Năm tiền tố thông dụng biên dịch ra năm selector khác nhau về CẤU TRÚC, và các khác biệt ấy giải thích phần lớn hành vi khó hiểu mà người ta quy cho Tailwind là ma thuật.</p>

<h3>Phép đo</h3>
<p>Đặt mỗi loại một cái vào một file rồi ĐỌC cái chui ra. Không dính tới tài liệu nào:</p>

<pre><code class="language-html">&lt;!-- page.html --&gt;
&lt;div class="hover:bg-blue-500 md:flex group-hover:opacity-50
            peer-checked:block dark:text-white"&gt;&lt;/div&gt;
</code></pre>

<pre><code class="language-bash">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
$ cat out.css
</code></pre>

<div class="out">.hover\\:bg-blue-500:hover { background-color: rgb(59 130 246 / …) }

.group:hover .group-hover\\:opacity-50 { opacity: 0.5 }

.peer:checked ~ .peer-checked\\:block { display: block }

.dark\\:text-white:is(.dark *) { color: rgb(255 255 255 / …) }

@media (min-width: 768px) {
  .md\\:flex { display: flex }
}
</div>

<p>Năm tiền tố, năm cấu trúc selector khác nhau. Đọc từng cái cho kỹ, vì mỗi cái mang một LUẬT mà bạn không đoán ra được từ tên lớp.</p>

<h3>Hình dạng 1 — nối thêm lớp giả</h3>
<div class="out">.hover\\:bg-blue-500:hover
</div>
<p>Ca đơn giản nhất. Tên lớp là <code>hover:bg-blue-500</code> với dấu hai chấm được <em>THOÁT</em> thành <code>\\:</code> — vì một dấu hai chấm trần trong selector CSS sẽ khởi đầu một lớp giả. Rồi <code>:hover</code> được nối vào. Đây là hình dạng cho <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, <code>first:</code>, <code>checked:</code> — bất cứ thứ gì là một lớp giả CSS thật.</p>

<div class="callout ok">
<p><strong>Hệ quả.</strong> Độ đặc hiệu là <code>0,2,0</code> — một lớp cộng một lớp giả — đối lập <code>0,1,0</code> của một tiện ích trần. Đó là lý do <code>hover:bg-red-500</code> thắng <code>bg-blue-500</code> một cách đáng tin BẤT KỂ thứ tự nguồn. Không phải xử lý đặc biệt gì; quy tắc hover THẬT SỰ đặc hiệu hơn.</p>
</div>

<h3>Hình dạng 2 — tổ hợp CON CHÁU</h3>
<div class="out">.group:hover .group-hover\\:opacity-50
</div>
<p>Để ý cái <strong>KHOẢNG TRẮNG</strong>. Đây là một selector con cháu: "một thẻ có <code>group-hover:opacity-50</code>, ở BẤT CỨ ĐÂU bên trong một thẻ có <code>group</code> đang được rê chuột". Có HAI thẻ riêng biệt tham gia, đó là lý do <code>group-hover:</code> ÂM THẦM không làm gì nếu bạn quên đặt <code>group</code> lên một tổ tiên — selector đơn giản là KHÔNG BAO GIỜ khớp, và không có gì cảnh báo bạn.</p>

<h3>Hình dạng 3 — tổ hợp ANH EM</h3>
<div class="out">.peer:checked ~ .peer-checked\\:block
</div>
<p>Dấu <code>~</code> là tổ hợp anh em tổng quát, và nó CÓ HƯỚNG: nó khớp các anh em đứng <strong>SAU</strong> cái peer trong tài liệu. Nên một thẻ <code>peer-checked:</code> đặt <em>TRƯỚC</em> cái peer của nó sẽ KHÔNG BAO GIỜ khớp. Chuyện này bắt trúng những người dựng nhãn nổi phía trên một ô nhập — cái nhãn phải đứng SAU ô nhập trong DOM rồi được định vị lên trên bằng thị giác, chứ không phải ngược lại.</p>

<h3>Hình dạng 4 — phép thử tổ tiên bằng <code>:is()</code></h3>
<div class="out">.dark\\:text-white:is(.dark *)
</div>
<p><code>:is(.dark *)</code> nghĩa là "và thẻ này là con cháu của một thứ có lớp <code>dark</code>". Hai điều rơi ra. Thứ nhất, cái công tắc là một LỚP trên một tổ tiên — thường là <code>&lt;html&gt;</code> — nên chế độ tối là một TRẠNG THÁI DOM, không phải một media query, dưới <code>darkMode: 'class'</code>. Thứ hai, và kém hiển nhiên hơn: <code>:is()</code> lấy độ đặc hiệu của ĐỐI SỐ ĐẶC HIỆU NHẤT của nó, nên selector này là <code>0,2,0</code>, thắng các tiện ích trần.</p>

<div class="callout warn">
<p><strong>Đây là cơ chế đằng sau một sự cố THẬT trong kho này.</strong> CLAUDE.md ghi rằng đặt lớp <code>dark</code> lên <code>&lt;html&gt;</code> cho một theme toàn cục đã <em>ÉP KÍCH HOẠT MỌI tiện ích <code>dark:</code> trong cả ứng dụng</em>, làm vỡ một tính năng vốn có bộ chuyển ba-theme riêng. Lý do đúng là cái selector bên trên: MỌI lớp <code>dark:</code> trong toàn bộ kho mã khớp ngay khi bất kỳ tổ tiên nào có <code>.dark</code>. Cú vá là đặt tên lớp theme toàn cục thành <code>theme-dark</code>, để dành <code>.dark</code>. Bài 2.4 bao chuyện này trọn vẹn.</p>
</div>

<h3>Hình dạng 5 — vỏ bọc media query</h3>
<div class="out">@media (min-width: 768px) {
  .md\\:flex { display: flex }
}
</div>
<p>KHÁC hẳn bốn cái kia về cấu trúc: selector KHÔNG đổi và cái <em>QUY TẮC</em> bị bọc lại. Do đó độ đặc hiệu là <code>0,1,0</code> — Y HỆT một tiện ích trần. Một media query KHÔNG thêm độ đặc hiệu nào cả.</p>

<div class="callout warn">
<p><strong>Vậy cái gì làm <code>md:flex</code> thắng <code>flex</code>?</strong> THỨ TỰ NGUỒN, và không gì khác. Nhìn lại đầu ra: khối media query được phát sinh <em>SAU</em> mọi quy tắc không tiền tố. Khi độ đặc hiệu bằng nhau, cái SAU thắng. Đây là sự thật cấu trúc quan trọng nhất trong bài này, và bài 2.3 đo cái xảy ra khi bạn dựa vào nó mà không biết nó.</p>
</div>

<h3>Bảng tóm tắt</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">lớp giả (<code>hover:</code>, <code>focus:</code>, <code>disabled:</code>)</span><span class="lz-lnote">nối thêm <code>:hover</code> v.v. Độ đặc hiệu 0,2,0 — thắng tiện ích trần một cách CHÍNH ĐÁNG</span></div>
<div class="lz-layer"><span class="lz-lname">group (<code>group-hover:</code>)</span><span class="lz-lnote">selector con cháu qua HAI thẻ. Hỏng ÂM THẦM nếu tổ tiên thiếu <code>group</code></span></div>
<div class="lz-layer"><span class="lz-lname">peer (<code>peer-checked:</code>)</span><span class="lz-lnote">tổ hợp anh em <code>~</code>, CÓ HƯỚNG. Chỉ khớp anh em đứng SAU cái peer trong DOM</span></div>
<div class="lz-layer"><span class="lz-lname">dark (<code>dark:</code>)</span><span class="lz-lnote">phép thử tổ tiên <code>:is(.dark *)</code>. Độ đặc hiệu 0,2,0, và MỘT lớp tổ tiên bật mọi tiện ích loại ấy trên toàn ứng dụng</span></div>
<div class="lz-layer"><span class="lz-lname">điểm ngắt (<code>md:</code>)</span><span class="lz-lnote">bọc quy tắc trong <code>@media</code>. Độ đặc hiệu KHÔNG ĐỔI ở 0,1,0 — nó thắng thuần tuý vì được phát sinh SAU</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cho rằng mọi biến thể đều NÂNG độ đặc hiệu.</strong> Bốn trên năm cái có; điểm ngắt thì KHÔNG. Sự bất đối xứng ấy VÔ HÌNH từ cú pháp, và nó có nghĩa một quy tắc CSS viết tay với độ đặc hiệu <code>0,2,0</code> sẽ THẮNG <code>md:flex</code> trong khi THUA <code>hover:flex</code>. Khi một lớp responsive tự dưng không ăn mà một lớp hover trên cùng thẻ thì ăn, sự bất đối xứng này là thứ đầu tiên cần kiểm.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Cú pháp <code>tiền_tố:</code> đồng nhất che giấu NĂM cú biên dịch khác nhau về cấu trúc — nối lớp giả, selector con cháu, tổ hợp anh em CÓ HƯỚNG, phép thử tổ tiên <code>:is()</code>, và vỏ bọc media query — và cái cuối là thành viên LẠ vì nó không thêm độ đặc hiệu nào và thắng CHỈ nhờ được phát sinh sau trong file.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Hover, focus, and other states</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states — danh mục biến thể đầy đủ. Đọc nó SAU bài này, để mỗi mục đọc ra thành "cái này thuộc hình dạng nào trong năm".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:is()</code> và luật độ đặc hiệu của nó</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:is — luật rằng <code>:is()</code> lấy độ đặc hiệu của đối số đặc hiệu nhất, chính là thứ làm hình dạng <code>dark:</code> đạt 0,2,0.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — tổ hợp anh em tổng quát <code>~</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator — tính CÓ HƯỚNG làm <code>peer-*</code> chỉ chạy trên anh em đứng sau.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — độ đặc hiệu, tính cho tử tế</span><span class="lc-sub">/courses/web-foundations/learn${REF} — bộ ba số độ đặc hiệu được tính và so sánh ra sao. Mọi khẳng định trong bài này về quy tắc nào thắng đều là phép số học ấy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — group and peer, and how they fail silently|||2.2 — group và peer, và cách chúng hỏng ÂM THẦM',
      slug: 'tw-2-2-group-peer',
      type: 'VIDEO',
      description: 'Đo thật: CSS cho `group-hover:` được phát sinh HOÀN HẢO ngay cả khi KHÔNG có lớp `group` nào trong toàn bộ mã nguồn. Quy tắc tồn tại, hợp lệ, và không bao giờ khớp — đó chính xác là cơ chế của cú hỏng âm thầm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>group and peer, and how they fail silently</h2>
<p class="lead"><code>group-hover:</code> and <code>peer-checked:</code> are the two variants that involve a second element, and both of them fail in the same distinctive way: perfectly valid CSS that never matches anything. Understanding the failure mode is more useful than memorising the syntax.</p>

<h3>Proving the silent failure</h3>
<p>Write a file that uses <code>group-hover:</code> and <code>peer-checked:</code> but <em>never</em> declares <code>group</code> or <code>peer</code> anywhere:</p>

<pre><code class="language-html">&lt;!-- page.html — note: no "group" class, no "peer" class --&gt;
&lt;div class="group-hover:opacity-50 peer-checked:block"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
Done in 190ms.

$ cat out.css
.group:hover .group-hover\\:opacity-50 { opacity: 0.5 }
.peer:checked ~ .peer-checked\\:block { display: block }
</div>

<p>The build succeeds. The CSS is emitted. The rules are syntactically perfect. And they can never match, because no element in the document has <code>group</code> or <code>peer</code>. There is no warning at build time, no console error at runtime, and the class attribute in the browser looks exactly right.</p>

<div class="callout warn">
<p><strong>Why this is worse than an error.</strong> Every other failure mode in this course leaves evidence: a missing class is absent from the CSS, a conflict shows both rules in DevTools with one struck through. This one leaves a rule that is <em>present and correct</em>. Inspecting the element shows the class applied. The only way to see the problem is to notice that the <em>selector</em> requires an ancestor you did not provide — which means reading the generated selector, not the class list.</p>
</div>

<h3>The two structures, side by side</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>group</code> — descendant</span><span class="lz-nsub"><code>.group:hover .group-hover\\:x</code></span></span>
<span class="lz-nbody">A <strong>space</strong> separates the two parts, so the styled element may be at any depth inside the group. Direction: parent → child. Requires <code>group</code> on an ancestor.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>peer</code> — sibling</span><span class="lz-nsub"><code>.peer:checked ~ .peer-checked\\:x</code></span></span>
<span class="lz-nbody">A <strong><code>~</code></strong> separates them, so both must share a parent, and the styled element must come <em>after</em> the peer. Direction: earlier sibling → later sibling. Requires <code>peer</code> on a preceding sibling.</span>
</div>
</div>

<h3>The directionality that catches everyone</h3>
<p><code>~</code> is the <em>subsequent</em>-sibling combinator. CSS has no way to select a preceding sibling, so this is not a Tailwind limitation — it is a CSS one, and it dictates your DOM order:</p>

<pre><code class="language-jsx">{/* BROKEN — label comes BEFORE the input, so ~ never reaches it */}
&lt;label className="peer-focus:text-blue-500"&gt;Email&lt;/label&gt;
&lt;input className="peer" /&gt;

{/* WORKS — input first in the DOM, label after it, positioned above visually */}
&lt;input className="peer" placeholder=" " /&gt;
&lt;label className="peer-focus:text-blue-500 peer-placeholder-shown:top-3 …"&gt;
  Email
&lt;/label&gt;
</code></pre>

<p>This is exactly why every floating-label implementation you will read puts the input before the label and then moves the label with <code>absolute</code> positioning. It looks like an odd choice until you know that <code>~</code> only points forwards.</p>

<h3>Named groups, for when they nest</h3>
<p>A plain <code>group</code> inside another <code>group</code> is ambiguous — the inner element's <code>group-hover:</code> matches <em>both</em> ancestors, so hovering the outer card also triggers styles meant for the inner row. Named groups disambiguate:</p>

<pre><code class="language-html">&lt;div class="group/item group-hover/item:underline
            peer/x peer-checked/x:flex"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.group\\/item:hover .group-hover\\/item\\:underline { text-decoration-line: underline }
.peer\\/x:checked ~ .peer-checked\\/x\\:flex { display: flex }
</div>

<p>The <code>/item</code> suffix becomes part of both class names, so the selector only pairs a named group with variants carrying the same name. Use these the moment you have nesting; the ambiguous version produces a bug where hovering anywhere on a card lights up every row inside it, which reads as "hover is broken" rather than "my groups are ambiguous".</p>

<h3>The diagnostic checklist</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the class is in the CSS but nothing happens</span><span class="lz-lnote">read the generated selector. If it has a space or a <code>~</code>, the variant needs a second element you probably have not provided</span></div>
<div class="lz-layer"><span class="lz-lname"><code>group-hover:</code> does nothing</span><span class="lz-lnote">is <code>group</code> on an ANCESTOR (not the same element, not a sibling)? This is the single most common cause</span></div>
<div class="lz-layer"><span class="lz-lname"><code>peer-*</code> does nothing</span><span class="lz-lnote">two checks: is <code>peer</code> on a SIBLING, and does that sibling come BEFORE the styled element in the DOM? Both must be true</span></div>
<div class="lz-layer"><span class="lz-lname">hovering the outer element triggers inner styles</span><span class="lz-lnote">nested unnamed groups. Add <code>/name</code> suffixes to both the <code>group</code> and its variants</span></div>
<div class="lz-layer"><span class="lz-lname">it works in one place and not another</span><span class="lz-lnote">the component was moved and lost its <code>group</code> ancestor. This is why a component using <code>group-hover:</code> has an invisible dependency on its parent — worth a comment</span></div>
</div>

<div class="callout ok">
<p><strong>The design consequence.</strong> A component containing <code>group-hover:</code> is not self-contained: it only works inside a parent that declares <code>group</code>. That is a real coupling, invisible from the component's own source. Either put the <code>group</code> on the component's own root element so it carries its dependency with it, or document the requirement — a component that silently needs something from its parent is a component that will break when someone reuses it.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — putting <code>group</code> on the same element as <code>group-hover:</code>.</strong> The selector is <code>.group:hover .group-hover\\:x</code> with a <em>descendant</em> space, so the two classes must be on different elements. Putting both on one element produces a rule that requires the element to be its own ancestor, which nothing satisfies. It looks completely reasonable in the JSX and never fires.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>group-*</code> and <code>peer-*</code> compile to selectors spanning two elements — a descendant space and a forward-only <code>~</code> respectively — so they fail by emitting valid CSS that never matches, and the only way to diagnose them is to read the generated selector and ask which second element it is waiting for.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Styling based on parent and sibling state</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state — the official <code>group</code> and <code>peer</code> documentation, including the named-group syntax.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Subsequent-sibling combinator</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator — the forward-only rule, and the note that CSS has no previous-sibling combinator at all.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:placeholder-shown</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown — the pseudo-class behind <code>peer-placeholder-shown:</code>, which is what makes CSS-only floating labels work without JavaScript.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — combinators and the selector engine</span><span class="lc-sub">/courses/web-foundations/learn${REF} — how descendant, child and sibling combinators are matched, and why matching runs right-to-left.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>group và peer, và cách chúng hỏng ÂM THẦM</h2>
<p class="lead"><code>group-hover:</code> và <code>peer-checked:</code> là hai biến thể có dính tới một thẻ THỨ HAI, và cả hai hỏng theo cùng một kiểu đặc trưng: CSS hoàn toàn hợp lệ mà KHÔNG BAO GIỜ khớp cái gì. Hiểu kiểu hỏng ấy có ích hơn học thuộc cú pháp.</p>

<h3>Chứng minh cú hỏng âm thầm</h3>
<p>Viết một file có dùng <code>group-hover:</code> và <code>peer-checked:</code> nhưng <em>KHÔNG BAO GIỜ</em> khai <code>group</code> hay <code>peer</code> ở đâu cả:</p>

<pre><code class="language-html">&lt;!-- page.html — luu y: khong co lop "group", khong co lop "peer" --&gt;
&lt;div class="group-hover:opacity-50 peer-checked:block"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
Done in 190ms.

$ cat out.css
.group:hover .group-hover\\:opacity-50 { opacity: 0.5 }
.peer:checked ~ .peer-checked\\:block { display: block }
</div>

<p>Cú dựng THÀNH CÔNG. CSS ĐƯỢC phát sinh. Các quy tắc hoàn hảo về cú pháp. Và chúng KHÔNG BAO GIỜ khớp được, vì không thẻ nào trong tài liệu có <code>group</code> hay <code>peer</code>. Không có cảnh báo lúc dựng, không có lỗi console lúc chạy, và thuộc tính lớp trong trình duyệt trông ĐÚNG y.</p>

<div class="callout warn">
<p><strong>Vì sao chuyện này TỆ HƠN một lỗi.</strong> Mọi kiểu hỏng khác trong khoá này đều để lại BẰNG CHỨNG: một lớp thiếu thì VẮNG trong CSS, một xung đột thì hiện cả hai quy tắc trong DevTools với một cái bị gạch ngang. Cái này để lại một quy tắc <em>CÓ MẶT và ĐÚNG</em>. Soi thẻ thì thấy lớp đã được áp. Cách DUY NHẤT thấy vấn đề là để ý rằng cái <em>SELECTOR</em> đòi một tổ tiên mà bạn không cung cấp — tức là phải đọc SELECTOR ĐƯỢC PHÁT SINH, không phải danh sách lớp.</p>
</div>

<h3>Hai cấu trúc, đặt cạnh nhau</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>group</code> — con cháu</span><span class="lz-nsub"><code>.group:hover .group-hover\\:x</code></span></span>
<span class="lz-nbody">Một <strong>KHOẢNG TRẮNG</strong> ngăn hai phần, nên thẻ được tạo kiểu có thể ở BẤT KỲ độ sâu nào bên trong nhóm. Chiều: cha → con. Đòi <code>group</code> trên một TỔ TIÊN.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>peer</code> — anh em</span><span class="lz-nsub"><code>.peer:checked ~ .peer-checked\\:x</code></span></span>
<span class="lz-nbody">Một dấu <strong><code>~</code></strong> ngăn chúng, nên cả hai phải CHUNG một thẻ cha, và thẻ được tạo kiểu phải đứng <em>SAU</em> cái peer. Chiều: anh em trước → anh em sau. Đòi <code>peer</code> trên một anh em ĐỨNG TRƯỚC.</span>
</div>
</div>

<h3>Tính có hướng bắt trúng tất cả mọi người</h3>
<p><code>~</code> là tổ hợp anh em <em>ĐỨNG SAU</em>. CSS KHÔNG có cách nào chọn một anh em đứng trước, nên đây không phải hạn chế của Tailwind — nó là hạn chế của CSS, và nó QUY ĐỊNH thứ tự DOM của bạn:</p>

<pre><code class="language-jsx">{/* BO — nhan dung TRUOC o nhap, nen ~ khong bao gio voi toi no */}
&lt;label className="peer-focus:text-blue-500"&gt;Email&lt;/label&gt;
&lt;input className="peer" /&gt;

{/* CHAY — o nhap truoc trong DOM, nhan sau no, dat len tren bang thi giac */}
&lt;input className="peer" placeholder=" " /&gt;
&lt;label className="peer-focus:text-blue-500 peer-placeholder-shown:top-3 …"&gt;
  Email
&lt;/label&gt;
</code></pre>

<p>Đây chính xác là lý do MỌI cách cài nhãn nổi bạn sẽ đọc đều đặt ô nhập TRƯỚC nhãn rồi dời nhãn bằng định vị <code>absolute</code>. Nó trông như một lựa chọn kỳ quặc cho tới khi bạn biết <code>~</code> chỉ trỏ VỀ PHÍA TRƯỚC.</p>

<h3>Nhóm CÓ TÊN, cho khi chúng lồng nhau</h3>
<p>Một <code>group</code> trần bên trong một <code>group</code> khác là NHẬP NHẰNG — <code>group-hover:</code> của thẻ bên trong khớp <em>CẢ HAI</em> tổ tiên, nên rê chuột lên thẻ ngoài cũng kích hoạt kiểu dáng dành cho hàng bên trong. Nhóm có tên gỡ nhập nhằng:</p>

<pre><code class="language-html">&lt;div class="group/item group-hover/item:underline
            peer/x peer-checked/x:flex"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.group\\/item:hover .group-hover\\/item\\:underline { text-decoration-line: underline }
.peer\\/x:checked ~ .peer-checked\\/x\\:flex { display: flex }
</div>

<p>Hậu tố <code>/item</code> trở thành một phần của CẢ HAI tên lớp, nên selector chỉ ghép một nhóm có tên với các biến thể mang CÙNG tên. Hãy dùng chúng NGAY khi bạn có lồng nhau; bản nhập nhằng đẻ ra một con bọ mà rê chuột bất cứ đâu trên một thẻ đều làm sáng mọi hàng bên trong nó, đọc ra thành "hover bị hỏng" chứ không phải "nhóm của tôi nhập nhằng".</p>

<h3>Bảng chẩn đoán</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">lớp CÓ trong CSS mà không có gì xảy ra</span><span class="lz-lnote">đọc SELECTOR được phát sinh. Nếu nó có khoảng trắng hay dấu <code>~</code>, biến thể ấy cần một thẻ THỨ HAI mà bạn có lẽ chưa cung cấp</span></div>
<div class="lz-layer"><span class="lz-lname"><code>group-hover:</code> không làm gì</span><span class="lz-lnote"><code>group</code> có nằm trên một TỔ TIÊN không (không phải cùng thẻ, không phải anh em)? Đây là nguyên nhân phổ biến nhất</span></div>
<div class="lz-layer"><span class="lz-lname"><code>peer-*</code> không làm gì</span><span class="lz-lnote">hai phép kiểm: <code>peer</code> có nằm trên một ANH EM không, và anh em đó có đứng TRƯỚC thẻ được tạo kiểu trong DOM không? Cả hai phải đúng</span></div>
<div class="lz-layer"><span class="lz-lname">rê chuột thẻ ngoài kích hoạt kiểu bên trong</span><span class="lz-lnote">nhóm lồng nhau không tên. Thêm hậu tố <code>/tên</code> vào CẢ <code>group</code> lẫn các biến thể của nó</span></div>
<div class="lz-layer"><span class="lz-lname">chạy ở chỗ này không chạy ở chỗ kia</span><span class="lz-lnote">component bị DỜI đi và mất tổ tiên <code>group</code>. Đây là lý do một component dùng <code>group-hover:</code> có một phụ thuộc VÔ HÌNH vào thẻ cha của nó — đáng ghi một dòng comment</span></div>
</div>

<div class="callout ok">
<p><strong>Hệ quả về thiết kế.</strong> Một component chứa <code>group-hover:</code> KHÔNG tự chứa: nó chỉ chạy bên trong một thẻ cha có khai <code>group</code>. Đó là một sự GẮN KẾT thật, vô hình từ chính mã nguồn của component. Hoặc đặt <code>group</code> lên chính thẻ gốc của component để nó MANG THEO phụ thuộc của mình, hoặc ghi tài liệu cho yêu cầu ấy — một component âm thầm cần thứ gì đó từ cha nó là một component sẽ VỠ khi ai đó dùng lại.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — đặt <code>group</code> lên CÙNG thẻ với <code>group-hover:</code>.</strong> Selector là <code>.group:hover .group-hover\\:x</code> với một khoảng trắng <em>CON CHÁU</em>, nên hai lớp phải nằm trên các thẻ KHÁC nhau. Đặt cả hai lên một thẻ đẻ ra một quy tắc đòi thẻ ấy phải là tổ tiên của CHÍNH NÓ, thứ không gì thoả mãn. Nó trông hoàn toàn hợp lý trong JSX và KHÔNG BAO GIỜ nổ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>group-*</code> và <code>peer-*</code> biên dịch ra các selector TRẢI QUA hai thẻ — một khoảng trắng con cháu và một dấu <code>~</code> chỉ-tiến — nên chúng hỏng bằng cách phát sinh CSS hợp lệ mà không bao giờ khớp, và cách duy nhất chẩn đoán là ĐỌC selector được phát sinh và hỏi nó đang chờ thẻ thứ hai NÀO.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Styling based on parent and sibling state</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state — tài liệu chính thức về <code>group</code> và <code>peer</code>, gồm cả cú pháp nhóm có tên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Subsequent-sibling combinator</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator — luật chỉ-tiến, và ghi chú rằng CSS KHÔNG hề có tổ hợp anh-em-trước.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:placeholder-shown</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown — lớp giả đằng sau <code>peer-placeholder-shown:</code>, thứ làm nhãn nổi chỉ-bằng-CSS chạy được mà không cần JavaScript.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — tổ hợp và bộ máy selector</span><span class="lc-sub">/courses/web-foundations/learn${REF} — tổ hợp con cháu, con trực tiếp và anh em được khớp ra sao, và vì sao việc khớp chạy từ PHẢI sang TRÁI.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Breakpoints win by position, not by specificity|||2.3 — Điểm ngắt thắng nhờ VỊ TRÍ, không nhờ độ đặc hiệu',
      slug: 'tw-2-3-diem-ngat',
      type: 'VIDEO',
      description: 'Viết lộn xộn `2xl: sm: base xl: md: lg:` và Tailwind vẫn phát sinh theo thứ tự TĂNG DẦN nghiêm ngặt. Đó là lý do responsive chạy được — và cũng là lý do một quy tắc CSS viết tay 0,2,0 đánh bại được mọi lớp `md:` trong ứng dụng của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Breakpoints win by position, not by specificity</h2>
<p class="lead">Lesson 2.1 established that a media query adds no specificity. That raises an obvious question: if <code>md:flex</code> and <code>flex</code> both score <code>0,1,0</code>, how does the responsive one ever win? The answer is source order, and Tailwind takes deliberate steps to make that order correct.</p>

<h3>The measurement: written order does not matter</h3>
<p>Write the breakpoints deliberately scrambled and see what comes out:</p>

<pre><code class="language-html">&lt;div class="2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
$ grep -E '^\\.|^@media' out.css

.p-1 {
@media (min-width: 640px) {
@media (min-width: 768px) {
@media (min-width: 1024px) {
@media (min-width: 1280px) {
@media (min-width: 1536px) {
</div>

<p>Written as <code>2xl, sm, base, xl, md, lg</code>. Emitted as <code>base, 640, 768, 1024, 1280, 1536</code> — <strong>strict ascending order</strong>. Tailwind normalises breakpoint order at generation time, so the order you type in the class attribute is irrelevant.</p>

<div class="callout ok">
<p><strong>Why this ordering is the whole mechanism.</strong> At 1280px wide, <em>four</em> of those media queries match simultaneously: 640, 768, 1024 and 1280 are all satisfied. Four rules of equal specificity all apply, so the last one in the file wins — which is the largest matching breakpoint, <code>xl:p-8</code>. That is exactly the desired behaviour, and it works only because they are emitted in ascending order. Reverse the order and every responsive layout in the world would break.</p>
</div>

<h3>The consequence for how you write responsive classes</h3>
<p>Because each breakpoint overrides upward from the base, the unprefixed class is the <em>smallest-screen</em> case, not the default-for-everything case:</p>

<pre><code class="language-html">&lt;!-- reads as: 1 column, then 2 from 768px, then 4 from 1024px --&gt;
&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"&gt;
</code></pre>

<p>This is what "mobile-first" means in Tailwind: not a recommendation but the direction the cascade runs. You cannot write desktop-first with <code>min-width</code> breakpoints without fighting the system, which is why the base class should always describe the narrowest layout.</p>

<h3>The <code>max-*</code> variants, and their reversed order</h3>
<p>Tailwind also offers <code>max-md:</code> for the genuinely-need-a-ceiling cases. They compile differently, and their ordering is reversed:</p>

<pre><code class="language-html">&lt;div class="p-1 md:p-4 max-md:p-8 max-lg:p-6"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.p-1 {
@media not all and (min-width: 1024px) {   ← max-lg
@media not all and (min-width: 768px) {    ← max-md
@media (min-width: 768px) {                ← md
</div>

<p>Two things to read here. First, <code>max-lg</code> compiles to <code>not all and (min-width: 1024px)</code> rather than <code>max-width: 1023px</code> — logically equivalent, and it sidesteps the off-by-one problem of fractional pixel widths. Second, the <code>max-*</code> queries are emitted in <strong>descending</strong> order, the mirror of the <code>min-*</code> ones. Same reasoning: at 500px both <code>max-lg</code> and <code>max-md</code> match, and the narrower constraint should win, so it is placed later.</p>

<div class="callout warn">
<p><strong>Mixing <code>min-</code> and <code>max-</code> is where it gets sharp.</strong> Note the output above: all <code>max-*</code> rules come <em>before</em> all <code>min-*</code> rules. So at 800px, both <code>max-lg:p-6</code> and <code>md:p-4</code> match, and <code>md:p-4</code> wins because <code>min-*</code> is emitted later — even though <code>max-lg</code> is arguably the more specific intent. If you need a style to apply only in a band, use the two-sided form <code>md:max-lg:p-4</code> rather than hoping two separate variants combine the way you meant.</p>
</div>

<h3>The vulnerability that follows from zero specificity</h3>
<p>Since <code>md:flex</code> scores <code>0,1,0</code>, <em>any</em> hand-written CSS rule with two classes, or one class plus a pseudo-class, beats it — at every screen size:</p>

<pre><code class="language-css">/* in globals.css — specificity 0,2,0 */
.card .title { display: block; }
</code></pre>

<pre><code class="language-html">&lt;!-- md:flex scores 0,1,0 and LOSES at every width --&gt;
&lt;div class="card"&gt;&lt;h3 class="title md:flex"&gt;…&lt;/h3&gt;&lt;/div&gt;
</code></pre>

<p>The symptom is distinctive and confusing: the responsive class does nothing at any breakpoint, while <code>hover:</code> classes on the same element work fine — because those score <code>0,2,0</code> and tie-break on order instead of losing outright. Recognising that asymmetry saves an afternoon.</p>

<h3>What this repository's responsive coverage looks like</h3>
<pre><code class="language-bash">$ grep -rl -E '\\b(sm|md|lg|xl|2xl):' src --include="*.tsx" | wc -l
$ find src -name "*.tsx" | wc -l
</code></pre>

<div class="out">372    # file co IT NHAT mot bien the diem ngat
793    # tong so file .tsx
</div>

<p>47% of components carry at least one breakpoint variant. And recall the distribution from Section 0: <code>sm:</code> 1,220 uses, <code>lg:</code> 376, <code>md:</code> 266, <code>xl:</code> 48, <code>2xl:</code> 1. The heavy skew to <code>sm:</code> says most responsive work here is the single jump from phone to everything-else, rather than a carefully tiered five-breakpoint system. That is typical and fine — and it means the <code>2xl:</code> single use is almost certainly an accident worth deleting.</p>

<div class="pitfall">
<p><strong>Bẫy — reading <code>md:</code> as "on medium screens".</strong> It means "at 768px <em>and above</em>", so it applies to medium, large, extra-large and beyond. Writing <code>md:hidden</code> to hide something on tablets also hides it on every desktop. To target a band you need both ends: <code>md:max-lg:hidden</code>. This single misreading accounts for a large share of "my responsive layout is wrong on desktop" bugs, and it is entirely a vocabulary problem — the name suggests a range, the behaviour is a threshold.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Breakpoint variants add no specificity and win purely by being emitted later, so Tailwind sorts <code>min-*</code> ascending and <code>max-*</code> descending to make the narrowest matching rule land last — which makes mobile-first the direction the cascade runs rather than a style preference, and leaves every responsive class vulnerable to any hand-written rule scoring <code>0,2,0</code>.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Responsive design</span><span class="lc-sub">tailwindcss.com/docs/responsive-design — the mobile-first explanation, the <code>max-*</code> variants, and the two-sided <code>md:max-lg:</code> form for targeting a band.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Using media queries</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries — including the explicit statement that a media query does not affect specificity, which is the fact this whole lesson rests on.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>not</code> in media queries</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media#not — why <code>not all and (min-width: X)</code> is the safe way to express a ceiling, versus <code>max-width</code> and fractional-pixel gaps.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — when emit order is NOT on your side</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — breakpoint ordering is normalised in your favour; conflicting utilities of the same property are not, and the difference is measured there.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Điểm ngắt thắng nhờ VỊ TRÍ, không nhờ độ đặc hiệu</h2>
<p class="lead">Bài 2.1 đã dựng được rằng một media query KHÔNG thêm độ đặc hiệu. Điều đó đặt ra một câu hỏi hiển nhiên: nếu <code>md:flex</code> và <code>flex</code> đều đạt <code>0,1,0</code>, thì cái responsive THẮNG bằng cách nào? Câu trả lời là THỨ TỰ NGUỒN, và Tailwind chủ động làm cho thứ tự ấy đúng.</p>

<h3>Phép đo: thứ tự VIẾT không quan trọng</h3>
<p>Viết các điểm ngắt CỐ Ý xáo trộn rồi xem cái gì chui ra:</p>

<pre><code class="language-html">&lt;div class="2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
$ grep -E '^\\.|^@media' out.css

.p-1 {
@media (min-width: 640px) {
@media (min-width: 768px) {
@media (min-width: 1024px) {
@media (min-width: 1280px) {
@media (min-width: 1536px) {
</div>

<p>Viết là <code>2xl, sm, nền, xl, md, lg</code>. Phát sinh ra là <code>nền, 640, 768, 1024, 1280, 1536</code> — <strong>thứ tự TĂNG DẦN nghiêm ngặt</strong>. Tailwind CHUẨN HOÁ thứ tự điểm ngắt lúc phát sinh, nên thứ tự bạn gõ trong thuộc tính lớp là VÔ NGHĨA.</p>

<div class="callout ok">
<p><strong>Vì sao thứ tự này là TOÀN BỘ cơ chế.</strong> Ở bề ngang 1280px, <em>BỐN</em> media query trong số đó khớp CÙNG LÚC: 640, 768, 1024 và 1280 đều thoả. Bốn quy tắc cùng độ đặc hiệu đều áp, nên cái CUỐI trong file thắng — chính là điểm ngắt LỚN NHẤT khớp được, <code>xl:p-8</code>. Đó đúng là hành vi mong muốn, và nó chạy được CHỈ vì chúng được phát sinh theo thứ tự tăng dần. Đảo thứ tự lại thì mọi bố cục responsive trên đời sẽ vỡ.</p>
</div>

<h3>Hệ quả cho cách bạn viết lớp responsive</h3>
<p>Vì mỗi điểm ngắt đè lên theo chiều TĂNG từ lớp nền, lớp KHÔNG tiền tố là ca <em>MÀN HÌNH NHỎ NHẤT</em>, không phải ca mặc-định-cho-mọi-thứ:</p>

<pre><code class="language-html">&lt;!-- doc ra: 1 cot, roi 2 tu 768px, roi 4 tu 1024px --&gt;
&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"&gt;
</code></pre>

<p>Đây là ý nghĩa của "mobile-first" trong Tailwind: không phải một lời khuyên mà là CHIỀU CHẠY của cascade. Bạn KHÔNG THỂ viết desktop-first với điểm ngắt <code>min-width</code> mà không đánh nhau với cả hệ, đó là lý do lớp nền phải LUÔN mô tả bố cục HẸP NHẤT.</p>

<h3>Các biến thể <code>max-*</code>, và thứ tự ĐẢO NGƯỢC của chúng</h3>
<p>Tailwind cũng có <code>max-md:</code> cho các ca THẬT SỰ cần một cái trần. Chúng biên dịch khác, và thứ tự của chúng bị đảo:</p>

<pre><code class="language-html">&lt;div class="p-1 md:p-4 max-md:p-8 max-lg:p-6"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.p-1 {
@media not all and (min-width: 1024px) {   ← max-lg
@media not all and (min-width: 768px) {    ← max-md
@media (min-width: 768px) {                ← md
</div>

<p>Có hai điều để đọc ở đây. Thứ nhất, <code>max-lg</code> biên dịch thành <code>not all and (min-width: 1024px)</code> chứ không phải <code>max-width: 1023px</code> — tương đương về logic, và nó TRÁNH được bài toán lệch-một của các bề ngang pixel phân số. Thứ hai, các truy vấn <code>max-*</code> được phát sinh theo thứ tự <strong>GIẢM DẦN</strong>, đối xứng gương với các cái <code>min-*</code>. Cùng lý lẽ: ở 500px cả <code>max-lg</code> lẫn <code>max-md</code> đều khớp, và ràng buộc HẸP HƠN nên thắng, nên nó được đặt SAU.</p>

<div class="callout warn">
<p><strong>Trộn <code>min-</code> với <code>max-</code> là chỗ nó trở nên SẮC.</strong> Để ý đầu ra bên trên: MỌI quy tắc <code>max-*</code> đứng <em>TRƯỚC</em> mọi quy tắc <code>min-*</code>. Nên ở 800px, cả <code>max-lg:p-6</code> lẫn <code>md:p-4</code> đều khớp, và <code>md:p-4</code> THẮNG vì <code>min-*</code> được phát sinh sau — dù <code>max-lg</code> có thể lập luận là ý định đặc hiệu hơn. Nếu bạn cần một kiểu dáng chỉ áp trong một DẢI, hãy dùng dạng hai-đầu <code>md:max-lg:p-4</code> thay vì hy vọng hai biến thể riêng biệt kết hợp theo ý bạn.</p>
</div>

<h3>Chỗ yếu suy ra từ việc KHÔNG có độ đặc hiệu</h3>
<p>Vì <code>md:flex</code> đạt <code>0,1,0</code>, <em>BẤT KỲ</em> quy tắc CSS viết tay nào có hai lớp, hoặc một lớp cộng một lớp giả, đều thắng nó — ở MỌI cỡ màn hình:</p>

<pre><code class="language-css">/* trong globals.css — do dac hieu 0,2,0 */
.card .title { display: block; }
</code></pre>

<pre><code class="language-html">&lt;!-- md:flex dat 0,1,0 va THUA o moi be ngang --&gt;
&lt;div class="card"&gt;&lt;h3 class="title md:flex"&gt;…&lt;/h3&gt;&lt;/div&gt;
</code></pre>

<p>Triệu chứng rất đặc trưng và gây rối: lớp responsive KHÔNG làm gì ở MỌI điểm ngắt, trong khi các lớp <code>hover:</code> trên CÙNG thẻ chạy tốt — vì chúng đạt <code>0,2,0</code> và phá hoà bằng thứ tự thay vì thua đứt. Nhận ra sự bất đối xứng ấy tiết kiệm cho bạn một buổi chiều.</p>

<h3>Độ phủ responsive của kho này trông ra sao</h3>
<pre><code class="language-bash">$ grep -rl -E '\\b(sm|md|lg|xl|2xl):' src --include="*.tsx" | wc -l
$ find src -name "*.tsx" | wc -l
</code></pre>

<div class="out">372    # file co IT NHAT mot bien the diem ngat
793    # tong so file .tsx
</div>

<p>47% component mang ít nhất một biến thể điểm ngắt. Và nhớ lại phân bố từ Mục 0: <code>sm:</code> 1.220 lượt, <code>lg:</code> 376, <code>md:</code> 266, <code>xl:</code> 48, <code>2xl:</code> 1. Độ lệch nặng về <code>sm:</code> nói rằng phần lớn việc responsive ở đây là MỘT bước nhảy từ điện thoại sang mọi-thứ-còn-lại, chứ không phải một hệ năm-điểm-ngắt phân tầng cẩn thận. Điều đó điển hình và ổn — và nó có nghĩa một lượt <code>2xl:</code> duy nhất gần như chắc chắn là một tai nạn đáng xoá.</p>

<div class="pitfall">
<p><strong>Bẫy — đọc <code>md:</code> thành "trên màn hình trung bình".</strong> Nó nghĩa là "ở 768px <em>TRỞ LÊN</em>", nên nó áp cho trung bình, lớn, siêu lớn và hơn nữa. Viết <code>md:hidden</code> để ẩn thứ gì đó trên máy tính bảng thì cũng ẩn nó trên MỌI desktop. Để nhắm một DẢI bạn cần cả hai đầu: <code>md:max-lg:hidden</code>. Chỉ riêng cú đọc nhầm này chiếm một phần lớn số bọ "bố cục responsive của tôi sai trên desktop", và nó hoàn toàn là một vấn đề TỪ VỰNG — cái tên gợi ý một khoảng, hành vi là một NGƯỠNG.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Biến thể điểm ngắt KHÔNG thêm độ đặc hiệu và thắng thuần tuý nhờ được phát sinh sau, nên Tailwind sắp <code>min-*</code> tăng dần và <code>max-*</code> giảm dần để quy tắc khớp HẸP NHẤT rơi xuống cuối — thứ biến mobile-first thành CHIỀU CHẠY của cascade chứ không phải một sở thích phong cách, và để mọi lớp responsive dễ tổn thương trước bất kỳ quy tắc viết tay nào đạt <code>0,2,0</code>.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Responsive design</span><span class="lc-sub">tailwindcss.com/docs/responsive-design — lời giải thích mobile-first, các biến thể <code>max-*</code>, và dạng hai-đầu <code>md:max-lg:</code> để nhắm một dải.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Using media queries</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries — gồm cả lời khẳng định TƯỜNG MINH rằng media query KHÔNG ảnh hưởng độ đặc hiệu, chính là sự thật mà cả bài này dựa lên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>not</code> trong media query</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media#not — vì sao <code>not all and (min-width: X)</code> là cách AN TOÀN để diễn đạt một cái trần, đối lập <code>max-width</code> và các khe pixel phân số.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — khi thứ tự phát sinh KHÔNG đứng về phía bạn</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — thứ tự điểm ngắt được chuẩn hoá theo hướng có lợi cho bạn; các tiện ích XUNG ĐỘT cùng một thuộc tính thì KHÔNG, và khác biệt ấy được đo ở đó.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Dark mode, and the class name that broke a feature|||2.4 — Chế độ tối, và cái tên lớp làm vỡ một tính năng',
      slug: 'tw-2-4-che-do-toi',
      type: 'VIDEO',
      description: 'Sự cố 02/07/2026 của kho này: đặt lớp `dark` lên `<html>` cho theme toàn cục đã ÉP KÍCH HOẠT mọi tiện ích `dark:` trong cả ứng dụng, làm vỡ bộ chuyển ba-theme của vùng Notes. Ba cấu hình darkMode đo thật, và một cái dùng `:where()` nên KHÔNG có độ đặc hiệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Dark mode, and the class name that broke a feature</h2>
<p class="lead">Dark mode is the variant with the largest blast radius: one class on one element changes how thousands of utilities behave across an entire application. This repository has the incident to prove it, and the mechanism is entirely visible in the compiled output.</p>

<h3>Three strategies, three different compilations</h3>
<pre><code class="language-html">&lt;div class="dark:text-white"&gt;&lt;/div&gt;
</code></pre>

<div class="out"># darkMode: 'media'  (the default)
@media (prefers-color-scheme: dark) {
  .dark\\:text-white { color: rgb(255 255 255 / …) }
}

# darkMode: 'class'  (what this repo uses)
.dark\\:text-white:is(.dark *) { color: rgb(255 255 255 / …) }

# darkMode: ['selector', '.theme-dark']  (the modern form)
.dark\\:text-white:where(.theme-dark, .theme-dark *) { color: rgb(255 255 255 / …) }
</div>

<p>Three genuinely different mechanisms, and the differences are not cosmetic:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>'media'</code></span><span class="lz-lnote">follows the OS setting via <code>prefers-color-scheme</code>. Specificity <code>0,1,0</code>. The user cannot override it in your UI, because there is no DOM state to toggle</span></div>
<div class="lz-layer"><span class="lz-lname"><code>'class'</code></span><span class="lz-lnote"><code>:is(.dark *)</code> — matches DESCENDANTS of <code>.dark</code> only. Specificity <strong>0,2,0</strong>, because <code>:is()</code> inherits its argument's specificity</span></div>
<div class="lz-layer"><span class="lz-lname"><code>['selector', '.x']</code></span><span class="lz-lnote"><code>:where(.x, .x *)</code> — matches the element ITSELF as well as descendants, and <code>:where()</code> contributes <strong>ZERO</strong> specificity, so the result is <code>0,1,0</code></span></div>
</div>

<div class="callout warn">
<p><strong>The specificity difference is the one nobody expects.</strong> <code>'class'</code> produces <code>0,2,0</code>; <code>'selector'</code> produces <code>0,1,0</code>. Switching between them changes which of your rules win, application-wide, with no other code change. If you migrate from <code>'class'</code> to <code>'selector'</code> and some dark styles stop applying, this is why — they were previously winning on specificity they no longer have.</p>
</div>

<h3>The incident</h3>
<p>CLAUDE.md records it under 2026-07-02:</p>

<div class="out">Global theme put &#96;.dark&#96; class on <html> -> force-activated every
Tailwind &#96;dark:&#96; utility inside Notes, breaking its own 3-theme
(light/dark/brown) switcher.
</div>

<p>Read the selector again and the mechanism is immediate. Under <code>darkMode: 'class'</code>, every <code>dark:</code> utility in the codebase compiles to <code>:is(.dark *)</code> — "any descendant of any element with class <code>dark</code>". Putting <code>.dark</code> on <code>&lt;html&gt;</code> makes <em>every element in the document</em> a descendant of <code>.dark</code>. Every <code>dark:</code> class in the entire application activates simultaneously.</p>

<p>The Notes feature had built its own three-theme system (light / dark / brown) using Tailwind's <code>dark:</code> variants scoped to its own wrapper. Those 722 utilities were designed to activate only when Notes was in its dark theme. The global switch took that decision away from them — Notes could be in brown mode and every <code>dark:</code> rule inside it would still fire.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">what was intended</span><span class="lz-nsub">two independent theme systems</span></span>
<span class="lz-nbody">A global light/dark toggle for the app shell, and a separate three-way switcher inside Notes. Two switches, two scopes, no interaction.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">what the selector actually says</span><span class="lz-nsub">one global switch</span></span>
<span class="lz-nbody"><code>:is(.dark *)</code> has no scope limit. Any <code>.dark</code> ancestor anywhere activates every <code>dark:</code> utility below it. The two systems were never independent — they shared one keyword.</span>
</div>
</div>

<h3>The fix, and why it is a naming fix rather than a code fix</h3>
<p>The resolution recorded in CLAUDE.md is a rule about vocabulary:</p>

<div class="out">The global dark theme class is &#96;theme-dark&#96;, NEVER &#96;dark&#96;.
Tailwind &#96;dark:&#96; variants are RESERVED for the Notes wrapper
(NotesThemeProvider puts &#96;.dark&#96; on &#96;.notes-theme-root&#96;).
Global theme-dependent styles use &#96;html.theme-dark ...&#96; CSS or the
theme CSS variables (var(--text-primary) etc), not &#96;dark:&#96;.
</div>

<p>Nothing about the Tailwind config changed. The global theme was renamed to a class Tailwind does not know about, leaving <code>.dark</code> free to mean exactly one thing: the Notes wrapper's dark state. It is a fix by <em>namespace separation</em> — the two systems now use different words for different concepts, which is what they should have done from the start.</p>

<h3>Measuring whether the rule held</h3>
<p>A rule written in a document is a hypothesis. Count whether the codebase obeys it:</p>

<pre><code class="language-bash">$ grep -rho 'dark:[^ "'"'"'&#96;]*' src --include="*.tsx" | wc -l
$ grep -rho 'dark:[^ "'"'"'&#96;]*' $(grep -rl 'dark:' src --include="*.tsx" | grep '/notes/') | wc -l
$ grep -rho 'dark:[^ "'"'"'&#96;]*' $(grep -rl 'dark:' src --include="*.tsx" | grep -v '/notes/') | wc -l
</code></pre>

<div class="out">786    # tong so luot dung dark:
722    # trong components/notes/  -> DUNG luat (91,9%)
 64    # NGOAI notes/             -> TROI khoi luat (8,1%), trai 32 file
</div>

<p><strong>91.9% compliance.</strong> The rule largely held, and the 64 stragglers across 32 files are concentrated in features built after the rule was written — <code>exp-hub</code> (7 files), <code>language</code> (6), <code>tech-trends</code> (4), <code>cv</code> (3). None of them currently misbehave, because those <code>dark:</code> utilities simply never activate outside Notes. They are dead styles: harmless today, and a trap the moment someone puts <code>.dark</code> higher in the tree again.</p>

<div class="callout ok">
<p><strong>This is why the measurement is worth running.</strong> A documented rule with 91.9% compliance looks like a success and is also a live liability — 64 utilities are silently doing nothing, which means whoever wrote them believed they were styling something. The dead ones should either be migrated to <code>html.theme-dark</code> CSS or deleted. Neither happens unless someone counts.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — my own first measurement of this returned 0.</strong> I ran <code>grep -o 'dark:[a-z0-9/\\[\\]#.-]*'</code> and got zero matches, when the baseline count was 786. The escaped brackets inside a character class broke the class itself. The number was obviously wrong <em>only because I had a baseline to compare against</em> — without the 786 I would have concluded the rule was perfectly followed and moved on. A measurement returning zero deserves more suspicion than one returning a surprising number.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>dark:</code> compiles to an ancestor test with no scope limit, so a single class placed high in the DOM activates every such utility in the application at once — which is why the global theme here is named <code>theme-dark</code> and <code>.dark</code> is reserved, and why the three <code>darkMode</code> strategies differ in specificity (<code>:is()</code> scores, <code>:where()</code> does not) as well as in trigger.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-07-02 theme incident</span><span class="lc-sub">the repository's own record: the <code>.dark</code>-on-<code>&lt;html&gt;</code> collision, and the rule that global theme styles use <code>html.theme-dark</code> or CSS variables rather than <code>dark:</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Dark mode</span><span class="lc-sub">tailwindcss.com/docs/dark-mode — the three strategies, and the <code>selector</code> form that supersedes <code>class</code> in Tailwind 3.4+.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:where()</code> and zero specificity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:where — the rule that <code>:where()</code> always contributes zero, which is the entire difference between the <code>class</code> and <code>selector</code> compilations measured above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — CSS variables as the theme mechanism</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — the approach this repo moved to: one class name that is correct in both themes because the value resolves per theme, needing no <code>dark:</code> variant at all.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chế độ tối, và cái tên lớp làm vỡ một tính năng</h2>
<p class="lead">Chế độ tối là biến thể có BÁN KÍNH NỔ lớn nhất: một lớp trên một thẻ thay đổi cách hàng nghìn tiện ích hành xử xuyên cả một ứng dụng. Kho này có sự cố để chứng minh, và cơ chế HOÀN TOÀN nhìn thấy được trong đầu ra biên dịch.</p>

<h3>Ba chiến lược, ba cú biên dịch khác nhau</h3>
<pre><code class="language-html">&lt;div class="dark:text-white"&gt;&lt;/div&gt;
</code></pre>

<div class="out"># darkMode: 'media'  (mac dinh)
@media (prefers-color-scheme: dark) {
  .dark\\:text-white { color: rgb(255 255 255 / …) }
}

# darkMode: 'class'  (cai kho nay dung)
.dark\\:text-white:is(.dark *) { color: rgb(255 255 255 / …) }

# darkMode: ['selector', '.theme-dark']  (dang hien dai)
.dark\\:text-white:where(.theme-dark, .theme-dark *) { color: rgb(255 255 255 / …) }
</div>

<p>Ba cơ chế KHÁC NHAU thật sự, và các khác biệt không phải chuyện hình thức:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>'media'</code></span><span class="lz-lnote">bám theo thiết lập của HỆ ĐIỀU HÀNH qua <code>prefers-color-scheme</code>. Độ đặc hiệu <code>0,1,0</code>. Người dùng KHÔNG đè được nó trong giao diện của bạn, vì không có trạng thái DOM nào để bật tắt</span></div>
<div class="lz-layer"><span class="lz-lname"><code>'class'</code></span><span class="lz-lnote"><code>:is(.dark *)</code> — CHỈ khớp CON CHÁU của <code>.dark</code>. Độ đặc hiệu <strong>0,2,0</strong>, vì <code>:is()</code> thừa hưởng độ đặc hiệu của đối số</span></div>
<div class="lz-layer"><span class="lz-lname"><code>['selector', '.x']</code></span><span class="lz-lnote"><code>:where(.x, .x *)</code> — khớp CẢ CHÍNH thẻ đó lẫn con cháu, và <code>:where()</code> đóng góp <strong>KHÔNG</strong> độ đặc hiệu, nên kết quả là <code>0,1,0</code></span></div>
</div>

<div class="callout warn">
<p><strong>Khác biệt độ đặc hiệu là thứ KHÔNG AI ngờ tới.</strong> <code>'class'</code> đẻ ra <code>0,2,0</code>; <code>'selector'</code> đẻ ra <code>0,1,0</code>. Chuyển giữa hai cái thay đổi quy tắc nào của bạn THẮNG, trên toàn ứng dụng, mà không đổi một dòng mã nào khác. Nếu bạn di trú từ <code>'class'</code> sang <code>'selector'</code> và vài kiểu dáng tối ngừng áp, ĐÂY là lý do — chúng trước đây thắng nhờ một độ đặc hiệu mà giờ chúng không còn.</p>
</div>

<h3>Sự cố</h3>
<p>CLAUDE.md ghi nó dưới ngày 02/07/2026:</p>

<div class="out">Theme toan cuc dat lop &#96;.dark&#96; len <html> -> EP KICH HOAT moi tien ich
&#96;dark:&#96; cua Tailwind ben trong Notes, lam vo bo chuyen 3-theme
(sang/toi/nau) cua chinh no.
</div>

<p>Đọc lại selector thì cơ chế hiện ra ngay lập tức. Dưới <code>darkMode: 'class'</code>, MỌI tiện ích <code>dark:</code> trong kho mã biên dịch thành <code>:is(.dark *)</code> — "bất kỳ con cháu nào của bất kỳ thẻ nào có lớp <code>dark</code>". Đặt <code>.dark</code> lên <code>&lt;html&gt;</code> làm <em>MỌI thẻ trong tài liệu</em> trở thành con cháu của <code>.dark</code>. Mọi lớp <code>dark:</code> trong toàn bộ ứng dụng kích hoạt CÙNG LÚC.</p>

<p>Tính năng Notes đã dựng hệ ba-theme riêng của nó (sáng / tối / nâu) dùng các biến thể <code>dark:</code> của Tailwind giới hạn trong vỏ bọc của chính nó. 722 tiện ích ấy được thiết kế để kích hoạt CHỈ khi Notes đang ở theme tối của nó. Cái công tắc toàn cục đã TƯỚC quyết định ấy khỏi chúng — Notes có thể đang ở chế độ NÂU mà mọi quy tắc <code>dark:</code> bên trong nó vẫn nổ.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cái được DỰ ĐỊNH</span><span class="lz-nsub">hai hệ theme ĐỘC LẬP</span></span>
<span class="lz-nbody">Một công tắc sáng/tối toàn cục cho vỏ ứng dụng, và một bộ chuyển ba-chiều riêng bên trong Notes. Hai công tắc, hai phạm vi, không tương tác.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cái selector THẬT SỰ nói</span><span class="lz-nsub">MỘT công tắc toàn cục</span></span>
<span class="lz-nbody"><code>:is(.dark *)</code> KHÔNG có giới hạn phạm vi. Bất kỳ tổ tiên <code>.dark</code> nào ở bất cứ đâu đều kích hoạt mọi tiện ích <code>dark:</code> bên dưới nó. Hai hệ CHƯA BAO GIỜ độc lập — chúng dùng chung MỘT từ khoá.</span>
</div>
</div>

<h3>Cú vá, và vì sao nó là cú vá TÊN GỌI chứ không phải cú vá mã</h3>
<p>Cách giải quyết ghi trong CLAUDE.md là một luật về TỪ VỰNG:</p>

<div class="out">Lop theme toi TOAN CUC la &#96;theme-dark&#96;, KHONG BAO GIO &#96;dark&#96;.
Bien the &#96;dark:&#96; cua Tailwind DANH RIENG cho vo boc Notes
(NotesThemeProvider dat &#96;.dark&#96; len &#96;.notes-theme-root&#96;).
Kieu dang phu thuoc theme toan cuc dung CSS &#96;html.theme-dark ...&#96;
hoac bien CSS theme (var(--text-primary) v.v.), khong dung &#96;dark:&#96;.
</div>

<p>KHÔNG có gì trong config Tailwind thay đổi. Theme toàn cục được ĐỔI TÊN sang một lớp mà Tailwind không biết tới, để <code>.dark</code> rảnh ra và có đúng MỘT nghĩa: trạng thái tối của vỏ bọc Notes. Đó là một cú vá bằng <em>TÁCH KHÔNG GIAN TÊN</em> — hai hệ giờ dùng những từ KHÁC nhau cho những khái niệm khác nhau, đúng cái lẽ ra chúng phải làm ngay từ đầu.</p>

<h3>Đo xem cái luật ấy có ĐỨNG được không</h3>
<p>Một luật viết trong tài liệu là một GIẢ THUYẾT. Hãy đếm xem kho mã có tuân nó không:</p>

<pre><code class="language-bash">$ grep -rho 'dark:[^ "'"'"'&#96;]*' src --include="*.tsx" | wc -l
$ grep -rho 'dark:[^ "'"'"'&#96;]*' $(grep -rl 'dark:' src --include="*.tsx" | grep '/notes/') | wc -l
$ grep -rho 'dark:[^ "'"'"'&#96;]*' $(grep -rl 'dark:' src --include="*.tsx" | grep -v '/notes/') | wc -l
</code></pre>

<div class="out">786    # tong so luot dung dark:
722    # trong components/notes/  -> DUNG luat (91,9%)
 64    # NGOAI notes/             -> TROI khoi luat (8,1%), trai 32 file
</div>

<p><strong>91,9% tuân thủ.</strong> Cái luật phần lớn ĐÃ đứng, và 64 cái rớt lại trải 32 file thì tập trung ở các tính năng dựng SAU khi luật được viết — <code>exp-hub</code> (7 file), <code>language</code> (6), <code>tech-trends</code> (4), <code>cv</code> (3). Hiện tại KHÔNG cái nào hành xử sai, vì các tiện ích <code>dark:</code> ấy đơn giản là KHÔNG BAO GIỜ kích hoạt bên ngoài Notes. Chúng là kiểu dáng CHẾT: vô hại hôm nay, và là một cái bẫy ngay khoảnh khắc ai đó lại đặt <code>.dark</code> lên cao hơn trong cây.</p>

<div class="callout ok">
<p><strong>Đây là lý do phép đo đáng chạy.</strong> Một luật có tài liệu với 91,9% tuân thủ TRÔNG như một thành công và đồng thời là một khoản NỢ đang sống — 64 tiện ích đang âm thầm không làm gì, nghĩa là người viết chúng TIN rằng mình đang tạo kiểu cho cái gì đó. Những cái chết nên hoặc được chuyển sang CSS <code>html.theme-dark</code> hoặc bị XOÁ. Không cái nào xảy ra trừ khi có người ĐẾM.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — phép đo ĐẦU TIÊN của chính tôi cho ra 0.</strong> Tôi chạy <code>grep -o 'dark:[a-z0-9/\\[\\]#.-]*'</code> và được KHÔNG kết quả nào, trong khi số nền là 786. Các dấu ngoặc vuông bị thoát BÊN TRONG một lớp ký tự đã làm vỡ chính lớp ký tự ấy. Con số rõ ràng sai <em>CHỈ vì tôi có một con số NỀN để đối chiếu</em> — không có 786 thì tôi đã kết luận luật được tuân thủ hoàn hảo rồi đi tiếp. Một phép đo trả về KHÔNG đáng ngờ hơn một phép đo trả về một con số gây bất ngờ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>dark:</code> biên dịch thành một phép thử TỔ TIÊN KHÔNG có giới hạn phạm vi, nên một lớp duy nhất đặt cao trong DOM kích hoạt MỌI tiện ích loại đó trong ứng dụng cùng lúc — đó là lý do theme toàn cục ở đây tên là <code>theme-dark</code> và <code>.dark</code> được để dành, và là lý do ba chiến lược <code>darkMode</code> khác nhau cả về ĐỘ ĐẶC HIỆU (<code>:is()</code> có tính, <code>:where()</code> không) lẫn về cách kích hoạt.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố theme 02/07/2026</span><span class="lc-sub">bản ghi của chính kho này: cú đụng độ <code>.dark</code>-trên-<code>&lt;html&gt;</code>, và luật rằng kiểu dáng theme toàn cục dùng <code>html.theme-dark</code> hoặc biến CSS chứ không dùng <code>dark:</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Dark mode</span><span class="lc-sub">tailwindcss.com/docs/dark-mode — ba chiến lược, và dạng <code>selector</code> thay thế <code>class</code> từ Tailwind 3.4 trở đi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:where()</code> và độ đặc hiệu bằng không</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:where — luật rằng <code>:where()</code> LUÔN đóng góp không, chính là toàn bộ khác biệt giữa cú biên dịch <code>class</code> và <code>selector</code> đo được bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — biến CSS như cơ chế theme</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cách tiếp cận mà kho này chuyển sang: MỘT tên lớp đúng ở CẢ hai theme vì giá trị phân giải theo từng theme, KHÔNG cần biến thể <code>dark:</code> nào.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Arbitrary variants, and the ones worth knowing|||2.5 — Biến thể tuỳ ý, và những cái đáng biết',
      slug: 'tw-2-5-bien-the-tuy-y',
      type: 'VIDEO',
      description: 'Cú pháp `[&>svg]:` cho bạn viết BẤT KỲ selector nào ngay trong tên lớp. Cộng với bốn biến thể hiện đại giải quyết những bài toán thật mà người ta vẫn viết JavaScript để làm: `data-[]`, `aria-`, `has-[]`, và `motion-reduce`.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Arbitrary variants, and the ones worth knowing</h2>
<p class="lead">The variants in the previous lessons are named ones. Tailwind also lets you write an arbitrary selector inline, and ships a set of modern variants that solve problems people routinely reach for JavaScript to solve. Both are worth a lesson because they change what is possible without leaving the class attribute.</p>

<h3>The measurement</h3>
<pre><code class="language-html">&lt;div class="[&amp;&gt;svg]:h-4 [&amp;_p]:mt-2 supports-[display:grid]:grid
            motion-reduce:transition-none print:hidden
            aria-expanded:rotate-180 data-[state=open]:block has-[img]:p-0"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.has-\\[img\\]\\:p-0:has(img)                    { … }
.aria-expanded\\:rotate-180[aria-expanded="true"] { … }
.data-\\[state\\=open\\]\\:block[data-state="open"] { … }
@supports (display:grid)                        { … }
@media (prefers-reduced-motion: reduce)         { … }
@media print                                    { … }
.\\[\\&amp;\\&gt;svg\\]\\:h-4 &gt; svg                       { … }
.\\[\\&amp;_p\\]\\:mt-2 p                              { … }
</div>

<p>Eight prefixes, and the compiled forms show exactly what each buys. Read the last two first, because they are the general mechanism the others are special cases of.</p>

<h3>Arbitrary variants: <code>&amp;</code> is the element</h3>
<p><code>[&amp;&gt;svg]:h-4</code> becomes <code>.class &gt; svg</code>. The <code>&amp;</code> stands for the element carrying the class, exactly as in Sass, and everything else is literal CSS selector syntax. Note that <code>_</code> is used for a space — <code>[&amp;_p]:mt-2</code> becomes <code>.class p</code> — because a space would terminate the class attribute.</p>

<div class="callout ok">
<p><strong>Why this matters more than it looks.</strong> It is the escape hatch that makes utility CSS complete. Styling children you do not control — markdown output, a third-party widget, an SVG from an icon library — previously forced you out to a stylesheet. <code>[&amp;&gt;svg]:h-4</code> keeps it at the call site, where you can see it. This is the utility answer to "but what about styling things I did not author".</p>
</div>

<h3><code>data-[]</code> — the one that replaces conditional class logic</h3>
<pre><code class="language-jsx">{/* the usual approach: compute a class list in JS */}
&lt;div className={isOpen ? 'block' : 'hidden'}&gt;

{/* the data-attribute approach: state in the DOM, styling in CSS */}
&lt;div data-state={isOpen ? 'open' : 'closed'}
     className="hidden data-[state=open]:block"&gt;
</code></pre>

<p>The second version moves the conditional out of JavaScript and into the selector. That matters for three reasons: the state is inspectable in DevTools without React tooling, it works identically in a server-rendered page with no hydration, and every headless UI library (Radix, Headless UI, and this repo's Radix-based components) already sets these attributes for you. If a component library documents <code>data-state</code>, <code>data-side</code> or <code>data-disabled</code>, those are variant hooks you do not have to build.</p>

<h3><code>aria-*</code> — styling that cannot drift from accessibility</h3>
<p><code>aria-expanded:rotate-180</code> compiles to <code>[aria-expanded="true"]</code>. The payoff is structural: the chevron can only rotate if the ARIA attribute is actually set correctly. You cannot ship a visually-correct, screen-reader-broken accordion, because the visual state is <em>driven by</em> the accessibility state rather than running alongside it.</p>

<div class="callout ok">
<p><strong>This is the rare case where the convenient path is also the accessible one.</strong> Most accessibility work is extra effort layered on top of working code. Here, using <code>aria-expanded:</code> to drive the arrow means forgetting the ARIA attribute produces an obvious visual bug — so the failure is loud instead of silent. Prefer <code>aria-*</code> variants over <code>data-*</code> whenever a real ARIA attribute exists for the state.</p>
</div>

<h3><code>has-[]</code> — the parent selector CSS never had</h3>
<p><code>has-[img]:p-0</code> compiles to <code>:has(img)</code>: style an element based on what is <em>inside</em> it. For twenty years this was the canonical "CSS cannot do this" example and required JavaScript. A card that drops its padding when it contains an image, a form field that turns red when it contains an invalid input, a list that changes layout when it has more than three children — all now one class.</p>

<div class="callout warn">
<p><strong>The caveat worth stating.</strong> <code>:has()</code> is genuinely well-supported in current browsers, but it is the newest thing in this lesson. Use it for enhancement rather than for anything load-bearing: a card that loses its padding in an old browser is fine, a navigation menu that becomes unreachable is not.</p>
</div>

<h3><code>motion-reduce</code> — the accessibility variant with real users</h3>
<p><code>motion-reduce:transition-none</code> compiles to <code>@media (prefers-reduced-motion: reduce)</code>. This is an OS-level setting people enable because motion causes them nausea, dizziness or migraines. It is not a preference in the aesthetic sense.</p>

<p>Recall from Section 0 that this repository's config declares 13 custom animations — aurora drifts, shimmer sweeps, pulses, a spinning reel. Every one of those is a candidate for <code>motion-reduce:animate-none</code>. The general rule: any animation that loops indefinitely or moves a large area should be disabled under this query. A 200ms fade on a button is fine; a 44-second drifting gradient is exactly what the setting exists for.</p>

<h3>The full set, ranked by how often you will want them</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>data-[state=open]:</code></span><span class="lz-lnote">the workhorse. Every headless UI library sets these; using them removes conditional class logic from your components entirely</span></div>
<div class="lz-layer"><span class="lz-lname"><code>[&amp;&gt;svg]:</code>, <code>[&amp;_p]:</code></span><span class="lz-lnote">for children you do not author. <code>&amp;</code> is the element, <code>_</code> is a space. The completeness escape hatch</span></div>
<div class="lz-layer"><span class="lz-lname"><code>aria-expanded:</code>, <code>aria-selected:</code></span><span class="lz-lnote">prefer over <code>data-*</code> when a real ARIA attribute exists — it couples the visual state to the accessible state so they cannot drift</span></div>
<div class="lz-layer"><span class="lz-lname"><code>motion-reduce:</code></span><span class="lz-lnote">for any looping or large-area animation. Not optional for the people who need it</span></div>
<div class="lz-layer"><span class="lz-lname"><code>has-[img]:</code></span><span class="lz-lnote">the parent selector. Powerful and newest — enhancement, not load-bearing structure</span></div>
<div class="lz-layer"><span class="lz-lname"><code>print:</code></span><span class="lz-lnote">compiles to <code>@media print</code>. One <code>print:hidden</code> on your nav and chat widget is usually the entire print stylesheet a web app needs</span></div>
<div class="lz-layer"><span class="lz-lname"><code>supports-[display:grid]:</code></span><span class="lz-lnote">feature detection via <code>@supports</code>. Rarely needed now that layout features are widely supported, but the right tool for genuinely new CSS</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — reaching for an arbitrary variant when a component would be better.</strong> <code>[&amp;&gt;div&gt;span:nth-child(2)]:text-red-500</code> is legal, generated correctly, and unreadable. Arbitrary variants are for reaching into markup you do not control; when you <em>do</em> control the markup, put the class on the element directly. The syntax existing does not make it the right answer — a selector you cannot read at a glance has moved complexity rather than removing it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Arbitrary variants make the class attribute selector-complete by letting <code>&amp;</code> stand for the element, and the modern named variants — <code>data-[]</code>, <code>aria-*</code>, <code>has-[]</code>, <code>motion-reduce</code> — each replace a chunk of JavaScript with a selector, with <code>aria-*</code> being the one that makes the convenient path and the accessible path the same path.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Using arbitrary variants</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants — the <code>[&amp;…]</code> syntax, including the underscore-for-space rule.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:has()</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:has — the parent selector, its performance characteristics, and current browser support.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>prefers-reduced-motion</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — what the setting means, who turns it on and why. Worth reading before deciding an animation is harmless.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — ARIA state in real components</span><span class="lc-sub">/courses/authentication/learn${REF} — accessible form and dialog patterns where the ARIA attributes that <code>aria-*</code> variants hook into are set correctly in the first place.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Biến thể tuỳ ý, và những cái đáng biết</h2>
<p class="lead">Các biến thể ở những bài trước đều CÓ TÊN. Tailwind còn cho bạn viết một selector TUỲ Ý ngay trong dòng, và giao kèm một bộ biến thể hiện đại giải quyết những bài toán mà người ta vẫn thường xuyên với tay tới JavaScript để giải. Cả hai đáng một bài vì chúng thay đổi cái LÀM ĐƯỢC mà không phải rời khỏi thuộc tính lớp.</p>

<h3>Phép đo</h3>
<pre><code class="language-html">&lt;div class="[&amp;&gt;svg]:h-4 [&amp;_p]:mt-2 supports-[display:grid]:grid
            motion-reduce:transition-none print:hidden
            aria-expanded:rotate-180 data-[state=open]:block has-[img]:p-0"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.has-\\[img\\]\\:p-0:has(img)                    { … }
.aria-expanded\\:rotate-180[aria-expanded="true"] { … }
.data-\\[state\\=open\\]\\:block[data-state="open"] { … }
@supports (display:grid)                        { … }
@media (prefers-reduced-motion: reduce)         { … }
@media print                                    { … }
.\\[\\&amp;\\&gt;svg\\]\\:h-4 &gt; svg                       { … }
.\\[\\&amp;_p\\]\\:mt-2 p                              { … }
</div>

<p>Tám tiền tố, và các dạng đã biên dịch cho thấy CHÍNH XÁC mỗi cái mua được gì. Đọc HAI CÁI CUỐI trước, vì chúng là cơ chế TỔNG QUÁT mà các cái kia chỉ là trường hợp riêng.</p>

<h3>Biến thể tuỳ ý: <code>&amp;</code> chính là cái thẻ</h3>
<p><code>[&amp;&gt;svg]:h-4</code> trở thành <code>.lop &gt; svg</code>. Dấu <code>&amp;</code> đại diện cho thẻ MANG cái lớp, y hệt như trong Sass, và mọi thứ còn lại là cú pháp selector CSS nguyên bản. Để ý <code>_</code> được dùng thay cho một KHOẢNG TRẮNG — <code>[&amp;_p]:mt-2</code> trở thành <code>.lop p</code> — vì một khoảng trắng sẽ KẾT THÚC thuộc tính lớp.</p>

<div class="callout ok">
<p><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó.</strong> Nó là CỬA THOÁT khiến CSS tiện ích trở nên ĐẦY ĐỦ. Tạo kiểu cho các thẻ con mà bạn KHÔNG kiểm soát — đầu ra markdown, một widget bên thứ ba, một SVG từ thư viện biểu tượng — trước đây buộc bạn phải chạy ra một bảng kiểu. <code>[&amp;&gt;svg]:h-4</code> giữ nó lại ngay tại chỗ gọi, nơi bạn NHÌN THẤY nó. Đây là câu trả lời của phe tiện ích cho "thế còn tạo kiểu cho những thứ tôi không viết ra thì sao".</p>
</div>

<h3><code>data-[]</code> — cái thay thế logic lớp có điều kiện</h3>
<pre><code class="language-jsx">{/* cach thuong lam: tinh danh sach lop trong JS */}
&lt;div className={isOpen ? 'block' : 'hidden'}&gt;

{/* cach dung thuoc tinh data: trang thai o DOM, tao kieu o CSS */}
&lt;div data-state={isOpen ? 'open' : 'closed'}
     className="hidden data-[state=open]:block"&gt;
</code></pre>

<p>Bản thứ hai DỜI cái điều kiện ra khỏi JavaScript và đưa vào SELECTOR. Chuyện đó quan trọng vì ba lý do: trạng thái SOI ĐƯỢC trong DevTools mà không cần công cụ React, nó chạy y hệt trong một trang dựng-ở-máy-chủ không có hydration, và MỌI thư viện giao diện headless (Radix, Headless UI, và các component dựa trên Radix của chính kho này) ĐÃ đặt sẵn các thuộc tính ấy cho bạn. Nếu một thư viện component ghi tài liệu về <code>data-state</code>, <code>data-side</code> hay <code>data-disabled</code>, đó là những móc biến thể bạn KHÔNG phải tự dựng.</p>

<h3><code>aria-*</code> — cách tạo kiểu KHÔNG THỂ trôi khỏi khả năng tiếp cận</h3>
<p><code>aria-expanded:rotate-180</code> biên dịch thành <code>[aria-expanded="true"]</code>. Cái lợi mang tính CẤU TRÚC: mũi tên CHỈ có thể xoay nếu thuộc tính ARIA THẬT SỰ được đặt đúng. Bạn KHÔNG THỂ giao một accordion đúng-về-thị-giác mà hỏng-với-trình-đọc-màn-hình, vì trạng thái thị giác được <em>LÁI BỞI</em> trạng thái tiếp cận chứ không phải chạy song song với nó.</p>

<div class="callout ok">
<p><strong>Đây là ca HIẾM mà đường TIỆN cũng là đường TIẾP CẬN ĐƯỢC.</strong> Phần lớn việc về khả năng tiếp cận là công sức PHỤ THÊM chồng lên mã đã chạy. Ở đây, dùng <code>aria-expanded:</code> để lái mũi tên có nghĩa QUÊN thuộc tính ARIA sẽ đẻ ra một con bọ thị giác HIỂN NHIÊN — nên cú hỏng ỒN chứ không âm thầm. Hãy ưu tiên biến thể <code>aria-*</code> hơn <code>data-*</code> bất cứ khi nào có một thuộc tính ARIA thật cho trạng thái ấy.</p>
</div>

<h3><code>has-[]</code> — selector thẻ CHA mà CSS chưa bao giờ có</h3>
<p><code>has-[img]:p-0</code> biên dịch thành <code>:has(img)</code>: tạo kiểu cho một thẻ dựa trên cái nằm <em>BÊN TRONG</em> nó. Suốt hai mươi năm đây là ví dụ kinh điển "CSS không làm được cái này" và đòi phải có JavaScript. Một thẻ bỏ padding khi nó chứa ảnh, một ô biểu mẫu chuyển đỏ khi chứa một đầu vào không hợp lệ, một danh sách đổi bố cục khi có hơn ba con — giờ tất cả là MỘT lớp.</p>

<div class="callout warn">
<p><strong>Điều cần nói rõ.</strong> <code>:has()</code> THẬT SỰ được hỗ trợ tốt trong các trình duyệt hiện tại, nhưng nó là thứ MỚI NHẤT trong bài này. Hãy dùng nó để TĂNG CƯỜNG chứ không cho thứ gì CHỊU LỰC: một cái thẻ mất padding trên trình duyệt cũ thì ổn, một menu điều hướng trở nên không với tới được thì không.</p>
</div>

<h3><code>motion-reduce</code> — biến thể tiếp cận có NGƯỜI DÙNG THẬT</h3>
<p><code>motion-reduce:transition-none</code> biên dịch thành <code>@media (prefers-reduced-motion: reduce)</code>. Đây là một thiết lập cấp HỆ ĐIỀU HÀNH mà người ta bật vì chuyển động gây cho họ buồn nôn, chóng mặt hoặc đau nửa đầu. Nó KHÔNG phải một sở thích theo nghĩa thẩm mỹ.</p>

<p>Nhớ lại từ Mục 0 rằng config của kho này khai 13 hoạt ảnh tuỳ biến — aurora trôi, ánh loé quét, các nhịp đập, một cuộn phim quay. MỌI cái trong số đó đều là ứng viên cho <code>motion-reduce:animate-none</code>. Luật tổng quát: bất kỳ hoạt ảnh nào LẶP VÔ HẠN hoặc di chuyển một VÙNG LỚN đều nên bị tắt dưới truy vấn này. Một cú mờ dần 200ms trên một cái nút thì ổn; một gradient trôi 44 giây chính xác là thứ mà thiết lập ấy sinh ra để chống.</p>

<h3>Trọn bộ, xếp theo mức bạn sẽ muốn dùng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>data-[state=open]:</code></span><span class="lz-lnote">con ngựa thồ. Mọi thư viện giao diện headless đều đặt sẵn; dùng chúng gỡ HOÀN TOÀN logic lớp có điều kiện khỏi component của bạn</span></div>
<div class="lz-layer"><span class="lz-lname"><code>[&amp;&gt;svg]:</code>, <code>[&amp;_p]:</code></span><span class="lz-lnote">cho các thẻ con bạn không viết ra. <code>&amp;</code> là cái thẻ, <code>_</code> là khoảng trắng. Cửa thoát của tính đầy đủ</span></div>
<div class="lz-layer"><span class="lz-lname"><code>aria-expanded:</code>, <code>aria-selected:</code></span><span class="lz-lnote">ưu tiên hơn <code>data-*</code> khi có một thuộc tính ARIA thật — nó GẮN trạng thái thị giác vào trạng thái tiếp cận để chúng không thể trôi khỏi nhau</span></div>
<div class="lz-layer"><span class="lz-lname"><code>motion-reduce:</code></span><span class="lz-lnote">cho mọi hoạt ảnh lặp hoặc vùng lớn. KHÔNG tuỳ chọn với những người cần nó</span></div>
<div class="lz-layer"><span class="lz-lname"><code>has-[img]:</code></span><span class="lz-lnote">selector thẻ cha. Mạnh và mới nhất — dùng để tăng cường, không làm cấu trúc chịu lực</span></div>
<div class="lz-layer"><span class="lz-lname"><code>print:</code></span><span class="lz-lnote">biên dịch thành <code>@media print</code>. Một cái <code>print:hidden</code> trên thanh điều hướng và widget chat thường LÀ toàn bộ bảng kiểu in mà một ứng dụng web cần</span></div>
<div class="lz-layer"><span class="lz-lname"><code>supports-[display:grid]:</code></span><span class="lz-lnote">dò tính năng qua <code>@supports</code>. Hiếm khi cần nữa vì các tính năng bố cục đã được hỗ trợ rộng, nhưng là công cụ ĐÚNG cho CSS thật sự mới</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — với tay tới một biến thể tuỳ ý trong khi một COMPONENT sẽ tốt hơn.</strong> <code>[&amp;&gt;div&gt;span:nth-child(2)]:text-red-500</code> hợp lệ, được sinh ra đúng, và KHÔNG ĐỌC NỔI. Biến thể tuỳ ý là để với vào mã đánh dấu bạn KHÔNG kiểm soát; khi bạn <em>CÓ</em> kiểm soát mã đánh dấu, hãy đặt lớp thẳng lên thẻ. Việc cú pháp TỒN TẠI không làm nó thành câu trả lời đúng — một selector bạn không đọc nổi trong một cái liếc là một selector đã DỜI độ phức tạp đi chứ không gỡ bỏ nó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Biến thể tuỳ ý làm thuộc tính lớp trở nên ĐẦY ĐỦ VỀ SELECTOR bằng cách cho <code>&amp;</code> đại diện cái thẻ, và các biến thể hiện đại có tên — <code>data-[]</code>, <code>aria-*</code>, <code>has-[]</code>, <code>motion-reduce</code> — mỗi cái thay một mảng JavaScript bằng một selector, với <code>aria-*</code> là cái làm cho đường TIỆN và đường TIẾP CẬN ĐƯỢC trở thành CÙNG MỘT đường.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Using arbitrary variants</span><span class="lc-sub">tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants — cú pháp <code>[&amp;…]</code>, gồm cả luật gạch-dưới-thay-khoảng-trắng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>:has()</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/:has — selector thẻ cha, đặc tính hiệu năng của nó, và mức hỗ trợ trình duyệt hiện tại.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — <code>prefers-reduced-motion</code></span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — thiết lập ấy nghĩa là gì, ai bật nó và vì sao. Đáng đọc TRƯỚC khi quyết rằng một hoạt ảnh là vô hại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — trạng thái ARIA trong component thật</span><span class="lc-sub">/courses/authentication/learn${REF} — các khuôn mẫu biểu mẫu và hộp thoại tiếp cận được, nơi các thuộc tính ARIA mà biến thể <code>aria-*</code> móc vào được đặt ĐÚNG ngay từ đầu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'tw-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về cái tiền tố biên dịch ra gì: năm hình dạng selector, cú hỏng âm thầm của group/peer, điểm ngắt thắng nhờ vị trí, và sự cố `.dark` của chính kho này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>What Chapter 2 measured</h2>
<p class="lead">Eight questions, twelve minutes. Every answer was read out of real compiled CSS. If a question is hard, the move is to picture the generated selector — not to recall a rule.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">2.1 — five shapes</span><span class="lz-lnote">pseudo-class append, descendant space, directional <code>~</code>, <code>:is()</code> ancestor test, media wrapper. Four raise specificity; the breakpoint does not</span></div>
<div class="lz-layer"><span class="lz-lname">2.2 — silent failure</span><span class="lz-lnote">CSS for <code>group-hover:</code> is emitted perfectly with no <code>group</code> anywhere. Valid rule, never matches, no warning</span></div>
<div class="lz-layer"><span class="lz-lname">2.3 — ordering</span><span class="lz-lnote">written order is irrelevant; <code>min-*</code> emits ascending and <code>max-*</code> descending so the narrowest match lands last. Breakpoints win by position alone</span></div>
<div class="lz-layer"><span class="lz-lname">2.4 — the incident</span><span class="lz-lnote"><code>.dark</code> on <code>&lt;html&gt;</code> activated all 786 <code>dark:</code> utilities app-wide. Fixed by renaming the global theme to <code>theme-dark</code>. 91.9% compliance today</span></div>
<div class="lz-layer"><span class="lz-lname">2.5 — arbitrary + modern</span><span class="lz-lnote"><code>&amp;</code> is the element, <code>_</code> is a space; <code>aria-*</code> couples visual state to accessible state so they cannot drift</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Chương 2 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Mọi đáp án đều đọc ra từ CSS biên dịch THẬT. Nếu một câu khó, nước đi là HÌNH DUNG selector được phát sinh — không phải cố nhớ một luật.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">2.1 — năm hình dạng</span><span class="lz-lnote">nối lớp giả, khoảng trắng con cháu, dấu <code>~</code> có hướng, phép thử tổ tiên <code>:is()</code>, vỏ media. Bốn cái NÂNG độ đặc hiệu; điểm ngắt thì KHÔNG</span></div>
<div class="lz-layer"><span class="lz-lname">2.2 — hỏng âm thầm</span><span class="lz-lnote">CSS cho <code>group-hover:</code> được phát sinh hoàn hảo dù KHÔNG có <code>group</code> ở đâu. Quy tắc hợp lệ, không bao giờ khớp, không cảnh báo</span></div>
<div class="lz-layer"><span class="lz-lname">2.3 — thứ tự</span><span class="lz-lnote">thứ tự VIẾT vô nghĩa; <code>min-*</code> phát sinh tăng dần và <code>max-*</code> giảm dần để cái khớp HẸP NHẤT rơi cuối. Điểm ngắt thắng chỉ nhờ VỊ TRÍ</span></div>
<div class="lz-layer"><span class="lz-lname">2.4 — sự cố</span><span class="lz-lnote"><code>.dark</code> trên <code>&lt;html&gt;</code> kích hoạt cả 786 tiện ích <code>dark:</code> toàn ứng dụng. Vá bằng cách đổi tên theme toàn cục thành <code>theme-dark</code>. Hôm nay tuân thủ 91,9%</span></div>
<div class="lz-layer"><span class="lz-lname">2.5 — tuỳ ý + hiện đại</span><span class="lz-lnote"><code>&amp;</code> là cái thẻ, <code>_</code> là khoảng trắng; <code>aria-*</code> GẮN trạng thái thị giác vào trạng thái tiếp cận để chúng không trôi khỏi nhau</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does <code>hover:bg-red-500</code> reliably beat <code>bg-blue-500</code> regardless of the order you write them?|||Vì sao <code>hover:bg-red-500</code> thắng <code>bg-blue-500</code> một cách đáng tin BẤT KỂ thứ tự bạn viết?',
            options: [
              'It compiles to <code>.hover\\:bg-red-500:hover</code> — one class plus one pseudo-class, specificity 0,2,0 versus 0,1,0. It genuinely IS more specific|||Nó biên dịch thành <code>.hover\\:bg-red-500:hover</code> — một lớp cộng một lớp giả, độ đặc hiệu 0,2,0 đối lập 0,1,0. Nó THẬT SỰ đặc hiệu hơn',
              'Tailwind emits hover rules last on purpose|||Tailwind cố ý phát sinh quy tắc hover ở cuối',
              'Browsers give hover states priority over static ones|||Trình duyệt ưu tiên trạng thái hover hơn trạng thái tĩnh',
              'The hover variant adds an implicit <code>!important</code>|||Biến thể hover thêm một <code>!important</code> ngầm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You use <code>group-hover:opacity-50</code> but nothing happens. The class IS in the built CSS. What is the most likely cause?|||Bạn dùng <code>group-hover:opacity-50</code> mà không có gì xảy ra. Lớp ĐÃ CÓ trong CSS đã dựng. Nguyên nhân khả dĩ nhất?',
            options: [
              'No ancestor carries the <code>group</code> class — the selector is <code>.group:hover .group-hover\\:opacity-50</code>, a DESCENDANT selector needing a second element, and it simply never matches|||Không tổ tiên nào mang lớp <code>group</code> — selector là <code>.group:hover .group-hover\\:opacity-50</code>, một selector CON CHÁU cần thẻ thứ hai, và nó đơn giản là không bao giờ khớp',
              'The opacity value is too low to see|||Giá trị opacity quá thấp để thấy',
              'Tailwind purged the rule as unused|||Tailwind đã dọn quy tắc ấy vì không dùng tới',
              'You need to add <code>transition</code> for it to take effect|||Bạn cần thêm <code>transition</code> thì nó mới có tác dụng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A floating label using <code>peer-focus:</code> never activates. The <code>peer</code> class IS on the input. What else is wrong?|||Một nhãn nổi dùng <code>peer-focus:</code> không bao giờ kích hoạt. Lớp <code>peer</code> ĐÃ có trên ô nhập. Còn gì sai nữa?',
            options: [
              'The label comes BEFORE the input in the DOM — <code>~</code> is the subsequent-sibling combinator and only matches forwards, so the input must come first|||Cái nhãn đứng TRƯỚC ô nhập trong DOM — <code>~</code> là tổ hợp anh-em-đứng-sau và chỉ khớp về phía trước, nên ô nhập phải đứng trước',
              'The label and input must not share a parent|||Nhãn và ô nhập không được chung một thẻ cha',
              '<code>peer-focus:</code> requires <code>peer-focus-within:</code> instead|||<code>peer-focus:</code> phải thay bằng <code>peer-focus-within:</code>',
              'The peer class must also be on the label|||Lớp peer phải có cả trên cái nhãn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You write <code>2xl:p-10 sm:p-2 p-1 md:p-4</code> in that scrambled order. What does Tailwind emit?|||Bạn viết <code>2xl:p-10 sm:p-2 p-1 md:p-4</code> theo thứ tự lộn xộn đó. Tailwind phát sinh ra gì?',
            options: [
              'Base first, then media queries in strict ASCENDING breakpoint order — written order is irrelevant because Tailwind normalises it at generation time|||Lớp nền trước, rồi các media query theo thứ tự điểm ngắt TĂNG DẦN nghiêm ngặt — thứ tự viết vô nghĩa vì Tailwind chuẩn hoá nó lúc phát sinh',
              'Exactly the order written, so the layout will be wrong|||Đúng thứ tự đã viết, nên bố cục sẽ sai',
              'Only the last one, since they all set padding|||Chỉ cái cuối, vì tất cả đều đặt padding',
              'Alphabetical order by class name|||Thứ tự bảng chữ cái theo tên lớp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A hand-written rule <code>.card .title { display: block }</code> makes <code>md:flex</code> do nothing at any width, yet <code>hover:flex</code> on the same element works. Why the asymmetry?|||Một quy tắc viết tay <code>.card .title { display: block }</code> làm <code>md:flex</code> không ăn ở mọi bề ngang, nhưng <code>hover:flex</code> trên cùng thẻ lại chạy. Vì sao bất đối xứng?',
            options: [
              'A media query adds NO specificity, so <code>md:flex</code> is 0,1,0 and loses to 0,2,0; <code>hover:flex</code> is itself 0,2,0 so it ties and wins on source order|||Media query KHÔNG thêm độ đặc hiệu, nên <code>md:flex</code> là 0,1,0 và thua 0,2,0; còn <code>hover:flex</code> tự nó là 0,2,0 nên hoà và thắng nhờ thứ tự nguồn',
              'Media queries are evaluated before the cascade|||Media query được tính TRƯỚC cascade',
              'The <code>.card</code> rule is scoped and cannot affect hover states|||Quy tắc <code>.card</code> bị giới hạn phạm vi và không ảnh hưởng trạng thái hover',
              '<code>md:</code> requires a matching base <code>flex</code> class to work|||<code>md:</code> cần một lớp <code>flex</code> nền đi kèm mới chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Putting <code>.dark</code> on <code>&lt;html&gt;</code> broke a feature with its own three-theme switcher. What is the mechanism?|||Đặt <code>.dark</code> lên <code>&lt;html&gt;</code> làm vỡ một tính năng có bộ chuyển ba-theme riêng. Cơ chế là gì?',
            options: [
              'Under <code>darkMode: "class"</code> every <code>dark:</code> utility compiles to <code>:is(.dark *)</code>, which has NO scope limit — so one ancestor class activates all 786 of them app-wide at once|||Dưới <code>darkMode: "class"</code> mọi tiện ích <code>dark:</code> biên dịch thành <code>:is(.dark *)</code>, thứ KHÔNG có giới hạn phạm vi — nên một lớp tổ tiên kích hoạt cả 786 cái trên toàn ứng dụng cùng lúc',
              'React re-rendered the whole tree when the class changed|||React dựng lại toàn bộ cây khi lớp thay đổi',
              'The three-theme switcher used inline styles that got overridden|||Bộ chuyển ba-theme dùng inline style và bị đè',
              'Tailwind cannot support more than two themes|||Tailwind không hỗ trợ quá hai theme',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Switching <code>darkMode</code> from <code>"class"</code> to <code>["selector", ".x"]</code> makes some dark styles stop applying. Why?|||Chuyển <code>darkMode</code> từ <code>"class"</code> sang <code>["selector", ".x"]</code> làm vài kiểu dáng tối ngừng áp. Vì sao?',
            options: [
              '<code>class</code> compiles to <code>:is(...)</code> which INHERITS its argument specificity (0,2,0); <code>selector</code> compiles to <code>:where(...)</code> which contributes ZERO (0,1,0) — those styles were winning on specificity they no longer have|||<code>class</code> biên dịch thành <code>:is(...)</code> vốn THỪA HƯỞNG độ đặc hiệu của đối số (0,2,0); <code>selector</code> biên dịch thành <code>:where(...)</code> vốn đóng góp KHÔNG (0,1,0) — các kiểu dáng ấy trước đây thắng nhờ một độ đặc hiệu mà giờ không còn',
              'The selector strategy only works with a media query fallback|||Chiến lược selector chỉ chạy khi có media query dự phòng',
              'The class name must start with <code>dark</code> for the variant to compile|||Tên lớp phải bắt đầu bằng <code>dark</code> thì biến thể mới biên dịch được',
              'Nothing changes; the two are equivalent|||Không gì thay đổi; hai cái tương đương',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When should you prefer <code>aria-expanded:rotate-180</code> over <code>data-[state=open]:rotate-180</code>?|||Khi nào nên ưu tiên <code>aria-expanded:rotate-180</code> hơn <code>data-[state=open]:rotate-180</code>?',
            options: [
              'Whenever a real ARIA attribute exists for the state — it couples the visual state to the accessible one, so a missing ARIA attribute becomes a VISIBLE bug instead of a silent screen-reader failure|||Bất cứ khi nào có một thuộc tính ARIA thật cho trạng thái ấy — nó GẮN trạng thái thị giác vào trạng thái tiếp cận, nên thiếu thuộc tính ARIA thành một con bọ NHÌN THẤY ĐƯỢC thay vì một cú hỏng âm thầm với trình đọc màn hình',
              'Never; <code>data-*</code> is always preferred because libraries set it|||Không bao giờ; <code>data-*</code> luôn được ưu tiên vì thư viện đặt sẵn nó',
              'Only when the component is server-rendered|||Chỉ khi component được dựng ở phía máy chủ',
              'Only in forms, where ARIA attributes are required|||Chỉ trong biểu mẫu, nơi thuộc tính ARIA là bắt buộc',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
