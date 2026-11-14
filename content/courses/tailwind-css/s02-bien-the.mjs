import G02_1 from './giang/twc-02-1.mjs';
import G02_2 from './giang/twc-02-2.mjs';
import G02_3 from './giang/twc-02-3.mjs';
import G02_4 from './giang/twc-02-4.mjs';
import G02_5 from './giang/twc-02-5.mjs';
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
${G02_1}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Five variant shapes, read from the output</h2>
<p class="lead">A variant prefix looks like a uniform mechanism: put a word and a colon in front of a utility. It is not uniform. The five common prefixes compile to five structurally different selectors, and the differences explain most of the confusing behaviour people attribute to Tailwind being magic.</p>

<h3>The measurement</h3>
<p>Put one of each in a file and read what comes out. No documentation involved:</p>

<pre><code class="language-html">&lt;!-- page.html · tw.config.js: darkMode: 'class' · a plain flex added to show the ORDER --&gt;
&lt;div class="hover:bg-blue-500 md:flex group-hover:opacity-50
            peer-checked:block dark:text-white flex"&gt;&lt;/div&gt;
</code></pre>

<pre><code class="language-bash">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
$ cat out.css
</code></pre>

<div class="out">.flex {
  display: flex
}

.hover\\:bg-blue-500:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1))
}

.group:hover .group-hover\\:opacity-50 {
  opacity: 0.5
}

.peer:checked ~ .peer-checked\\:block {
  display: block
}

.dark\\:text-white:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1))
}

@media (min-width: 768px) {
  .md\\:flex {
    display: flex
  }
}
# Tailwind 3.4.19, darkMode: 'class' — real output 14/11/2026</div>

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
<p><strong>Trap — assuming all variants raise specificity.</strong> Four of the five do; the breakpoint does not. That asymmetry is invisible from the syntax, and it means a hand-written CSS rule with specificity <code>0,2,0</code> will beat <code>md:flex</code> while losing to <code>hover:flex</code>. When a responsive class mysteriously does not apply and a hover class on the same element does, this asymmetry is the first thing to check.</p>
<p><strong>Measured 14/11/2026 — the "losing to hover:flex" half needs a condition.</strong> In Chromium, <code>.card .title { display: block }</code> loaded <em>after</em> the Tailwind 3 CSS beats <strong>both</strong> <code>md:flex</code> and <code>hover:flex</code> (a 0,2,0 tie goes to the later rule). Only when the hand-written rule comes <em>earlier</em> — loaded first, or inside <code>@layer components</code> — does <code>hover:flex</code> win. A rule at the end of <code>globals.css</code> beats both.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The uniform <code>prefix:</code> syntax hides five structurally different compilations — pseudo-class append, descendant selector, directional sibling combinator, <code>:is()</code> ancestor test, and media-query wrapper — and the last one is the odd member because it adds no specificity and wins only by being emitted later in the file.</p>
</div>

<h3>🔬 Measured: how often each shape appears, and the asymmetry in Chromium</h3>
<p>Variants at the start of a class in this site's frontend (14/11/2026, Tailwind 3.4.19):</p>
<div class="out">$ for v in hover focus disabled group-hover peer- dark sm md lg xl 2xl; do printf "%-12s %6d\\n" "$v:" "$(git grep -ohE "(^|[\\"' \\&#96;{])$v[a-z-]*:" -- 'src/*.tsx' | wc -l)"; done
hover:         4729
focus:         1395
disabled:       838
group-hover:    293
peer-:            2
dark:          1098
sm:            2015
md:             654
lg:             645
xl:              87
2xl:              8</div>
<p>Pseudo-class variants dominate; <code>peer-*</code> is almost never used — which is exactly why it surprises people when they reach for it. Then the asymmetry: two rows, <code>md:flex</code> and <code>hover:flex</code>, against a hand-written <code>.card .title { display: block }</code> (0,2,0), window 900px wide, second row hovered:</p>
<div class="out">tay.css AFTER Tailwind 3   md:flex -&gt; block   hover:flex (hovered) -&gt; block
tay.css BEFORE Tailwind 3  md:flex -&gt; block   hover:flex (hovered) -&gt; flex
tay.css BEFORE Tailwind 4  md:flex -&gt; block   hover:flex (hovered) -&gt; block</div>
<h3>🆕 In Tailwind 4</h3>
<p>The same five shapes, compiled differently (Tailwind 4.3.5, selectors only):</p>
<div class="out">@layer utilities {
  .flex {
  @media (hover: hover) {
    :is(:where(.group):hover .group-hover\\:opacity-50) {
  :is(:where(.peer):checked ~ .peer-checked\\:block) {
  @media (hover: hover) {
    .hover\\:bg-blue-500:hover {
  @media (width &gt;= 48rem) {
    .md\\:flex {
  @media (prefers-color-scheme: dark) {
    .dark\\:text-white {</div>
<ul><li><code>hover:</code> is also wrapped in <code>@media (hover: hover)</code> — a tap on a phone no longer leaves the hover colour stuck.</li>
<li><code>group-hover:</code> / <code>peer-*</code> become <code>:is(:where(.group):hover …)</code> — still a descendant space and a forward-only <code>~</code>, so lesson 2.2's failures are unchanged.</li>
<li><code>md:</code> is <code>width &gt;= 48rem</code>; <code>dark:</code> defaults to <code>prefers-color-scheme</code>. For the class strategy declare <code>@custom-variant dark (&amp;:where(.dark, .dark *));</code> — and <code>:where()</code> adds <strong>zero</strong>, so it is 0,1,0, not 0,2,0:</li></ul>
<div class="out">  .dark\\:text-white:where(.dark, .dark *) {
    color: var(--color-white);
  }
}</div>
<p>Everything sits inside <code>@layer utilities</code>, so a hand-written rule outside any layer beats every utility even when loaded first (third row above). Chapter 7 covers layers.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 (like this site): npm i -D tailwindcss@3 · in.css: @tailwind utilities; · window 900px wide --&gt;
&lt;!-- tay.css: .card .title { display: block; } --&gt;
&lt;link rel="stylesheet" href="out.css"&gt;&lt;link rel="stylesheet" href="tay.css"&gt;
&lt;div class="card"&gt;&lt;h3 class="title md:flex gap-2"&gt;&lt;div&gt;A&lt;/div&gt;&lt;div&gt;B&lt;/div&gt;&lt;/h3&gt;&lt;/div&gt;
&lt;div class="card"&gt;&lt;h3 class="title hover:flex gap-2"&gt;&lt;div&gt;A&lt;/div&gt;&lt;div&gt;B&lt;/div&gt;&lt;/h3&gt;&lt;/div&gt;
&lt;!-- DevTools console: getComputedStyle(document.querySelector('.md\\\\:flex')).display  // "block" --&gt;
&lt;!-- then swap the two &lt;link&gt; tags and hover the second row again --&gt;</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — What CSS is: selectors, cascade, inheritance</span><span class="lc-sub">How specificity is counted — every "which rule wins" in this lesson is that arithmetic</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-2-tailwind-nen-tang" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.2 — Tailwind basics: utilities, responsive, states</span><span class="lc-sub">hover:, md: and friends inside a real Next.js app</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-2-group-peer" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.2 — group and peer</span><span class="lc-sub">Next lesson: the two shapes that fail silently</span></span></a>

<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> a menu that changes colour on <code>hover:</code> with a mouse does nothing on a phone (Tailwind 4 even wraps it in <code>@media (hover: hover)</code>); a card layout that switches at <code>md:</code> when you rotate your phone.</li><li><strong>What if…</strong> a teammate adds <code>.card .title { display: block }</code> at the end of <code>globals.css</code>? Measured above: every <code>md:flex</code> <em>and</em> <code>hover:flex</code> on those titles stops working, with no error.</li><li><strong>The attacker's view:</strong> variants decide what a user <em>sees</em>, not what they can <em>do</em>. A button shown only on <code>hover:</code> or only at <code>md:</code> is still in the DOM and still clickable from DevTools — never use a variant to "protect" an action; check permissions on the server.</li><li><strong>Related:</strong> specificity arithmetic — Web Foundations 3.1; the cascade layers that change all of this in Tailwind 4 — Chapter 7.</li></ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variant prefix</span><span class="v">The <code>word:</code> before a utility — uniform syntax, but five different compiled selectors.</span></div>
  <div class="kv"><span class="k">Pseudo-class append</span><span class="v"><code>hover:</code>/<code>focus:</code>/<code>disabled:</code> append <code>:hover</code> etc.; specificity rises to <code>0,2,0</code>.</span></div>
  <div class="kv"><span class="k">Descendant combinator</span><span class="v"><code>group-hover:</code> spans two elements; fails silently if an ancestor lacks <code>group</code>.</span></div>
  <div class="kv"><span class="k">Directional sibling</span><span class="v"><code>peer-checked:</code> uses <code>~</code>, matching only siblings <em>after</em> the peer in the DOM.</span></div>
  <div class="kv"><span class="k"><code>:is(.dark *)</code></span><span class="v">The <code>dark:</code> shape — a DOM-state ancestor test at specificity <code>0,2,0</code>.</span></div>
  <div class="kv"><span class="k">Media-query wrapper</span><span class="v"><code>md:</code> wraps the rule in <code>@media</code>, adds no specificity, and wins only by source order.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The uniform <code>prefix:</code> syntax hides five structurally different compilations — read them from the output, not the docs.</li><li>Four variants (pseudo-class, group, peer, dark) raise specificity; the breakpoint does not.</li><li><code>group-hover:</code> and <code>peer-*</code> fail silently: a missing <code>group</code> ancestor, or a peer placed after its target, simply never matches.</li><li><code>md:flex</code> beats <code>flex</code> only because the media-query block is emitted later at equal specificity.</li><li>The <code>dark:</code> <code>:is(.dark *)</code> shape is why one ancestor class can switch every dark utility app-wide (lesson 2.4).</li></ul>

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

<pre><code class="language-html">&lt;!-- page.html · tw.config.js: darkMode: 'class' · them mot lop flex tran de thay THU TU --&gt;
&lt;div class="hover:bg-blue-500 md:flex group-hover:opacity-50
            peer-checked:block dark:text-white flex"&gt;&lt;/div&gt;
</code></pre>

<pre><code class="language-bash">$ npx tailwindcss -c tw.config.js -i in.css -o out.css
$ cat out.css
</code></pre>

<div class="out">.flex {
  display: flex
}

.hover\\:bg-blue-500:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1))
}

.group:hover .group-hover\\:opacity-50 {
  opacity: 0.5
}

.peer:checked ~ .peer-checked\\:block {
  display: block
}

.dark\\:text-white:is(.dark *) {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1))
}

@media (min-width: 768px) {
  .md\\:flex {
    display: flex
  }
}
# Tailwind 3.4.19, darkMode: 'class' — đầu ra thật 14/11/2026</div>

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
<p><strong>Đo lại 14/11/2026 — nửa câu "THUA hover:flex" cần một điều kiện.</strong> Trong Chromium, <code>.card .title { display: block }</code> nạp <em>SAU</em> CSS của Tailwind 3 thắng <strong>CẢ HAI</strong> <code>md:flex</code> lẫn <code>hover:flex</code> (hoà 0,2,0 thì cái sau thắng). Chỉ khi luật viết tay đứng <em>TRƯỚC</em> — nạp trước, hoặc nằm trong <code>@layer components</code> — thì <code>hover:flex</code> mới thắng. Một luật ở cuối <code>globals.css</code> thắng cả hai.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Cú pháp <code>tiền_tố:</code> đồng nhất che giấu NĂM cú biên dịch khác nhau về cấu trúc — nối lớp giả, selector con cháu, tổ hợp anh em CÓ HƯỚNG, phép thử tổ tiên <code>:is()</code>, và vỏ bọc media query — và cái cuối là thành viên LẠ vì nó không thêm độ đặc hiệu nào và thắng CHỈ nhờ được phát sinh sau trong file.</p>
</div>

<h3>🔬 Đo thật: mỗi hình dạng xuất hiện bao nhiêu, và sự bất đối xứng trong Chromium</h3>
<p>Biến thể đứng đầu lớp trong frontend của trang này (14/11/2026, Tailwind 3.4.19):</p>
<div class="out">$ for v in hover focus disabled group-hover peer- dark sm md lg xl 2xl; do printf "%-12s %6d\\n" "$v:" "$(git grep -ohE "(^|[\\"' \\&#96;{])$v[a-z-]*:" -- 'src/*.tsx' | wc -l)"; done
hover:         4729
focus:         1395
disabled:       838
group-hover:    293
peer-:            2
dark:          1098
sm:            2015
md:             654
lg:             645
xl:              87
2xl:              8</div>
<p>Biến thể lớp giả áp đảo; <code>peer-*</code> gần như không dùng — chính vì thế nó làm người ta bất ngờ khi cần tới. Rồi sự bất đối xứng: hai hàng, <code>md:flex</code> và <code>hover:flex</code>, đấu với luật viết tay <code>.card .title { display: block }</code> (0,2,0), cửa sổ rộng 900px, chuột rê lên hàng hai:</p>
<div class="out">tay.css AFTER Tailwind 3   md:flex -&gt; block   hover:flex (hovered) -&gt; block
tay.css BEFORE Tailwind 3  md:flex -&gt; block   hover:flex (hovered) -&gt; flex
tay.css BEFORE Tailwind 4  md:flex -&gt; block   hover:flex (hovered) -&gt; block</div>
<h3>🆕 Ở Tailwind 4</h3>
<p>Vẫn năm hình dạng đó, biên dịch khác (Tailwind 4.3.5, chỉ in selector):</p>
<div class="out">@layer utilities {
  .flex {
  @media (hover: hover) {
    :is(:where(.group):hover .group-hover\\:opacity-50) {
  :is(:where(.peer):checked ~ .peer-checked\\:block) {
  @media (hover: hover) {
    .hover\\:bg-blue-500:hover {
  @media (width &gt;= 48rem) {
    .md\\:flex {
  @media (prefers-color-scheme: dark) {
    .dark\\:text-white {</div>
<ul><li><code>hover:</code> còn được bọc trong <code>@media (hover: hover)</code> — chạm trên điện thoại không còn để màu hover bị kẹt.</li>
<li><code>group-hover:</code> / <code>peer-*</code> thành <code>:is(:where(.group):hover …)</code> — vẫn khoảng trắng con cháu và <code>~</code> chỉ-tiến, nên các kiểu hỏng của bài 2.2 không đổi.</li>
<li><code>md:</code> là <code>width &gt;= 48rem</code>; <code>dark:</code> mặc định theo <code>prefers-color-scheme</code>. Muốn kiểu class thì khai <code>@custom-variant dark (&amp;:where(.dark, .dark *));</code> — và <code>:where()</code> cộng <strong>KHÔNG</strong>, nên ra 0,1,0 chứ không phải 0,2,0:</li></ul>
<div class="out">  .dark\\:text-white:where(.dark, .dark *) {
    color: var(--color-white);
  }
}</div>
<p>Mọi thứ nằm trong <code>@layer utilities</code>, nên một luật viết tay NGOÀI mọi layer thắng mọi tiện ích kể cả khi nạp trước (hàng thứ ba ở trên). Chương 7 nói kỹ về layer.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 (like this site): npm i -D tailwindcss@3 · in.css: @tailwind utilities; · window 900px wide --&gt;
&lt;!-- tay.css: .card .title { display: block; } --&gt;
&lt;link rel="stylesheet" href="out.css"&gt;&lt;link rel="stylesheet" href="tay.css"&gt;
&lt;div class="card"&gt;&lt;h3 class="title md:flex gap-2"&gt;&lt;div&gt;A&lt;/div&gt;&lt;div&gt;B&lt;/div&gt;&lt;/h3&gt;&lt;/div&gt;
&lt;div class="card"&gt;&lt;h3 class="title hover:flex gap-2"&gt;&lt;div&gt;A&lt;/div&gt;&lt;div&gt;B&lt;/div&gt;&lt;/h3&gt;&lt;/div&gt;
&lt;!-- DevTools console: getComputedStyle(document.querySelector('.md\\\\:flex')).display  // "block" --&gt;
&lt;!-- rồi đổi chỗ hai thẻ &lt;link&gt; và rê chuột lên hàng hai lần nữa --&gt;</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — CSS là gì: bộ chọn, cascade, kế thừa</span><span class="lc-sub">Cách tính độ đặc hiệu — mọi câu "luật nào thắng" trong bài này là phép tính đó</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-2-tailwind-nen-tang" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.2 — Nền tảng Tailwind: utility, responsive, trạng thái</span><span class="lc-sub">hover:, md: và các biến thể khác trong một ứng dụng Next.js thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-2-group-peer" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.2 — group và peer</span><span class="lc-sub">Bài sau: hai hình dạng hỏng âm thầm</span></span></a>

<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> menu đổi màu khi <code>hover:</code> chạy với chuột, nhưng trên điện thoại thì không (Tailwind 4 còn bọc nó trong <code>@media (hover: hover)</code>); bố cục thẻ đổi ở <code>md:</code> khi bạn xoay ngang điện thoại.</li><li><strong>Nếu… thì sao:</strong> một bạn cùng nhóm thêm <code>.card .title { display: block }</code> vào cuối <code>globals.css</code>? Đo ở trên: mọi <code>md:flex</code> <em>VÀ</em> <code>hover:flex</code> trên các tiêu đề ấy ngừng chạy, không một lỗi nào.</li><li><strong>Góc kẻ xấu:</strong> biến thể quyết định người dùng <em>THẤY</em> gì, không quyết định họ <em>LÀM</em> được gì. Một nút chỉ hiện khi <code>hover:</code> hay từ <code>md:</code> vẫn nằm trong DOM và vẫn bấm được từ DevTools — đừng bao giờ dùng biến thể để "bảo vệ" một thao tác; kiểm quyền ở máy chủ.</li><li><strong>Liên quan:</strong> phép tính độ đặc hiệu — Nền tảng Web 3.1; layer làm thay đổi tất cả chuyện này ở Tailwind 4 — Chương 7.</li></ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variant prefix</span><span class="v">Tiền tố biến thể — <code>từ:</code> trước một tiện ích; cú pháp đồng nhất nhưng năm selector biên dịch khác nhau.</span></div>
  <div class="kv"><span class="k">Pseudo-class append</span><span class="v">Nối lớp giả — <code>hover:</code>/<code>focus:</code>/<code>disabled:</code> nối <code>:hover</code> v.v.; độ đặc hiệu lên <code>0,2,0</code>.</span></div>
  <div class="kv"><span class="k">Descendant combinator</span><span class="v">Tổ hợp con cháu — <code>group-hover:</code> trải qua hai thẻ; hỏng âm thầm nếu tổ tiên thiếu <code>group</code>.</span></div>
  <div class="kv"><span class="k">Directional sibling</span><span class="v">Anh em có hướng — <code>peer-checked:</code> dùng <code>~</code>, chỉ khớp anh em đứng <em>sau</em> peer trong DOM.</span></div>
  <div class="kv"><span class="k"><code>:is(.dark *)</code></span><span class="v">Hình dạng <code>dark:</code> — phép thử tổ tiên theo trạng thái DOM, độ đặc hiệu <code>0,2,0</code>.</span></div>
  <div class="kv"><span class="k">Media-query wrapper</span><span class="v">Vỏ bọc media query — <code>md:</code> bọc quy tắc trong <code>@media</code>, không thêm độ đặc hiệu, thắng chỉ nhờ thứ tự nguồn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cú pháp <code>tiền_tố:</code> đồng nhất che năm cú biên dịch khác nhau về cấu trúc — đọc từ đầu ra, không từ tài liệu.</li><li>Bốn biến thể (lớp giả, group, peer, dark) nâng độ đặc hiệu; điểm ngắt thì không.</li><li><code>group-hover:</code> và <code>peer-*</code> hỏng âm thầm: thiếu tổ tiên <code>group</code>, hoặc peer đặt sau mục tiêu, đơn giản là không khớp.</li><li><code>md:flex</code> thắng <code>flex</code> chỉ vì khối media query phát sinh sau khi độ đặc hiệu bằng nhau.</li><li>Hình dạng <code>dark:</code> <code>:is(.dark *)</code> là lý do một lớp tổ tiên bật mọi tiện ích dark trên toàn ứng dụng (bài 2.4).</li></ul>

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
${G02_2}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>group and peer, and how they fail silently</h2>
<p class="lead"><code>group-hover:</code> and <code>peer-checked:</code> are the two variants that involve a second element, and both of them fail in the same distinctive way: perfectly valid CSS that never matches anything. Understanding the failure mode is more useful than memorising the syntax.</p>

<h3>Proving the silent failure</h3>
<p>Write a file that uses <code>group-hover:</code> and <code>peer-checked:</code> but <em>never</em> declares <code>group</code> or <code>peer</code> anywhere:</p>

<pre><code class="language-html">&lt;!-- page.html — note: no "group" class, no "peer" class --&gt;
&lt;div class="group-hover:opacity-50 peer-checked:block"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2&gt;&amp;1 | tail -1
Done in 92ms.
$ cat out.css
.group:hover .group-hover\\:opacity-50 {
  opacity: 0.5
}

.peer:checked ~ .peer-checked\\:block {
  display: block
}
$ grep -oE 'class="[^"]*"' page.html | tr ' "' '\\n\\n' | grep -cxE 'group|peer'
0
# Tailwind 3.4.19 — real output 14/11/2026 (the last command counts group/peer classes in page.html: 0)</div>

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

<div class="out">.group\\/item:hover .group-hover\\/item\\:underline {
  text-decoration-line: underline
}

.peer\\/x:checked ~ .peer-checked\\/x\\:flex {
  display: flex
}</div>

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
<p><strong>Trap — putting <code>group</code> on the same element as <code>group-hover:</code>.</strong> The selector is <code>.group:hover .group-hover\\:x</code> with a <em>descendant</em> space, so the two classes must be on different elements. Putting both on one element produces a rule that requires the element to be its own ancestor, which nothing satisfies. It looks completely reasonable in the JSX and never fires.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>group-*</code> and <code>peer-*</code> compile to selectors spanning two elements — a descendant space and a forward-only <code>~</code> respectively — so they fail by emitting valid CSS that never matches, and the only way to diagnose them is to read the generated selector and ask which second element it is waiting for.</p>
</div>

<h3>🔬 Measured: three cards, a label, nested groups (Chromium, Tailwind 3.4.19)</h3>
<p>Each icon has <code>group-hover:opacity-30</code>; each card is hovered in turn and the icon's opacity read with <code>getComputedStyle</code>:</p>
<div class="out">card A  no group                  -&gt; icon opacity 1
card B  group on the card (ancestor)  -&gt; icon opacity 0.3
card C  group on the SAME element     -&gt; icon opacity 1</div>
<p>Card C is the "group on the same element" trap: the rule asks the element to be its own ancestor. Then the forward-only <code>~</code>, with <code>peer-focus:text-blue-600</code> on the label:</p>
<div class="out">label BEFORE input, input focused  -&gt; label rgb(100, 116, 139)  (slate-500, unchanged)
label AFTER input (order-1), focused -&gt; label rgb(37, 99, 235)  (blue-600)</div>
<p>And nested groups — hovering only the outer card's own text:</p>
<div class="out">outer card hovered, inner bare group     -&gt; inner text: underline, rgb(220, 38, 38)
outer card hovered, inner group/item      -&gt; inner text: none</div>
<h3>🔬 Measured in this site's code (14/11/2026)</h3>
<div class="out">$ git grep -l 'group-hover:' -- 'src/*.tsx' | wc -l
     161
$ for f in $(git grep -l 'group-hover:' -- 'src/*.tsx'); do grep -qE "(className=[\\"'{\\&#96;]|[\\"' \\&#96;])group[\\"' \\&#96;]" "$f" || echo "$f"; done | wc -l
       2
$ for f in $(git grep -l 'group-hover:' -- 'src/*.tsx'); do grep -qE "(className=[\\"'{\\&#96;]|[\\"' \\&#96;])group[\\"' \\&#96;]" "$f" || echo "$f"; done | head -4
src/app/admin/user-codes/page.tsx
src/components/doiKhang/MinhHoa.tsx
$ git grep -n 'group-hover:opacity-100' -- src/app/admin/user-codes/page.tsx
src/app/admin/user-codes/page.tsx:102:                      &lt;Check className="w-4 h-4 text-neon-violet opacity-0 group-hover:opacity-100" /&gt;
$ git grep -c -wE 'group' -- src/app/admin/user-codes/page.tsx
src/app/admin/user-codes/page.tsx:1
$ git grep -n 'group-hover:' -- src/components/doiKhang/MinhHoa.tsx
src/components/doiKhang/MinhHoa.tsx:11:const NHAC = 'transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transiti…
$ git grep -n 'className="group relative' -- src/components/doiKhang/SanhDoiKhang.tsx
src/components/doiKhang/SanhDoiKhang.tsx:55:      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg…</div>
<p>Two files use <code>group-hover:</code> with no <code>group</code> class in the same file. <code>MinhHoa.tsx</code> is an <strong>invisible coupling</strong> that works: the <code>group</code> lives in its parent, <code>SanhDoiKhang.tsx:55</code>. <code>admin/user-codes/page.tsx:102</code> is a <strong>real silent bug</strong>: a check icon with <code>opacity-0 group-hover:opacity-100</code> inside a <code>&lt;button&gt;</code> (line 95) that has no <code>group</code> — the only line in the file containing the word is line 102 itself, so the icon can never appear on hover. The fix is one word: add <code>group</code> to the button.</p>
<div class="out">$ git grep -ohE 'className="[^"]*"' -- 'src/*.tsx' | tr ' "' '\\n\\n' | grep -cxE 'group|group/[a-z-]+'
219
$ git grep -ohE 'className="[^"]*"' -- 'src/*.tsx' | tr ' "' '\\n\\n' | grep -cx 'peer'
2
$ git grep -ohE 'peer-[a-z-]+:' -- 'src/*.tsx' | sort | uniq -c
   2 peer-empty:</div>
<p>Two <code>peer</code>s in the whole app, both used the right way round: a <code>div.peer</code> followed by a hidden paragraph with <code>peer-empty:block</code>.</p>
<h3>🆕 In Tailwind 4</h3>
<div class="out">@layer utilities {
  @media (hover: hover) {
    :is(:where(.group):hover .group-hover\\:opacity-50) {
    :is(:where(.group\\/item):hover .group-hover\\/item\\:underline) {
  :is(:where(.peer):checked ~ .peer-checked\\:block) {
  @media (hover: hover) {
    :where(:hover) .in-hover\\:underline {</div>
<p>The same descendant space and forward-only <code>~</code>, now inside <code>:is(:where(.group)…)</code> and <code>@media (hover: hover)</code> — every failure in this lesson still applies. New: <code>in-hover:</code> needs no <code>group</code>:</p>
<div class="out">    }
    :where(:hover) .in-hover\\:underline {
      text-decoration-line: underline;
    }
  }</div>
<p><code>:where(:hover) .x</code> means <em>any</em> hovered ancestor — and <code>&lt;html&gt;</code>/<code>&lt;body&gt;</code> are hovered whenever the mouse is on the page. Measured: hovering an unrelated box still underlined the text (underline). Use it inside a region whose hover you mean, or keep a named group.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 or 4, any page. Hover each card and read the icon's opacity in DevTools --&gt;
&lt;div class="rounded bg-slate-100 p-3"&gt;A · no group
  &lt;span class="group-hover:opacity-30"&gt;icon&lt;/span&gt;&lt;/div&gt;          &lt;!-- stays 1 --&gt;
&lt;div class="group rounded bg-slate-100 p-3"&gt;B · group on the ancestor
  &lt;span class="group-hover:opacity-30"&gt;icon&lt;/span&gt;&lt;/div&gt;          &lt;!-- 0.3 --&gt;
&lt;div class="rounded bg-slate-100 p-3"&gt;C · group on the SAME element
  &lt;span class="group group-hover:opacity-30"&gt;icon&lt;/span&gt;&lt;/div&gt;    &lt;!-- stays 1 --&gt;
&lt;!-- find the silent ones in your own project (bash): --&gt;
&lt;!-- for f in $(git grep -l 'group-hover:' -- '*.tsx'); do grep -qwE 'group' "$f" || echo "$f"; done --&gt;</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.1 — What CSS is: selectors, cascade, inheritance</span><span class="lc-sub">Descendant selectors and how the browser matches them</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-4-forms" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 2.4 — Forms: how the web receives data</span><span class="lc-sub">Labels and inputs — the pair that peer-* styles</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-3-diem-ngat" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.3 — Breakpoints win by POSITION</span><span class="lc-sub">Next lesson: the fifth shape, measured</span></span></a>

<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> a dropdown that opens on <code>group-hover:</code> needs a tap target on phones (no hover there); floating labels on login forms (<code>peer-focus:</code>) and "show password" toggles (<code>peer-checked:</code>).</li><li><strong>What if…</strong> someone copies <code>MinhHoa.tsx</code> into a page without its <code>group</code> parent? The lift-on-hover vanishes silently — nothing looks broken, so nobody reports it.</li><li><strong>The attacker's view:</strong> hiding is not protecting. An <code>opacity-0</code> or <code>hidden</code> admin control is still in the DOM; anyone can delete the class in DevTools and click. The real check must be on the server. And phishing pages copy floating labels pixel for pixel — polish proves nothing, read the address bar.</li><li><strong>Related:</strong> forms, labels and inputs — Web Foundations 2.4.</li></ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Silent failure</span><span class="v">Valid CSS is emitted but never matches — no build warning, no runtime error, the class looks applied.</span></div>
  <div class="kv"><span class="k"><code>group</code></span><span class="v">Descendant pairing (<code>.group:hover .group-hover\\:x</code>) — needs <code>group</code> on an ancestor.</span></div>
  <div class="kv"><span class="k"><code>peer</code></span><span class="v">Sibling pairing with <code>~</code> — needs <code>peer</code> on a preceding sibling, same parent.</span></div>
  <div class="kv"><span class="k">Forward-only <code>~</code></span><span class="v">The subsequent-sibling combinator matches later siblings only; CSS cannot select a previous sibling.</span></div>
  <div class="kv"><span class="k">Named groups</span><span class="v"><code>group/item</code> + <code>group-hover/item:</code> disambiguate nested groups so hover does not bleed across levels.</span></div>
  <div class="kv"><span class="k">Invisible coupling</span><span class="v">A component using <code>group-hover:</code> secretly depends on a <code>group</code> ancestor it does not declare.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>group-*</code> and <code>peer-*</code> span two elements, so they fail by emitting correct CSS that never matches.</li><li>Diagnose by reading the generated selector: a space or a <code>~</code> means it is waiting for a second element you must supply.</li><li><code>~</code> points forward only — floating labels put the input before the label for exactly this reason.</li><li>Nested unnamed groups bleed; add <code>/name</code> suffixes to both the group and its variants.</li><li>A component needing <code>group</code> from its parent is coupled — carry the <code>group</code> on its own root or document it.</li></ul>

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

<div class="out">$ npx tailwindcss -c tw.config.js -i in.css -o out.css 2&gt;&amp;1 | tail -1
Done in 92ms.
$ cat out.css
.group:hover .group-hover\\:opacity-50 {
  opacity: 0.5
}

.peer:checked ~ .peer-checked\\:block {
  display: block
}
$ grep -oE 'class="[^"]*"' page.html | tr ' "' '\\n\\n' | grep -cxE 'group|peer'
0
# Tailwind 3.4.19 — real output 14/11/2026 (the last command counts group/peer classes in page.html: 0)</div>

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

<div class="out">.group\\/item:hover .group-hover\\/item\\:underline {
  text-decoration-line: underline
}

.peer\\/x:checked ~ .peer-checked\\/x\\:flex {
  display: flex
}</div>

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

<h3>🔬 Đo thật: ba tấm thẻ, một cái nhãn, group lồng nhau (Chromium, Tailwind 3.4.19)</h3>
<p>Mỗi icon mang <code>group-hover:opacity-30</code>; lần lượt rê chuột lên từng tấm thẻ rồi đọc opacity của icon bằng <code>getComputedStyle</code>:</p>
<div class="out">card A  không group                  -&gt; icon opacity 1
card B  group ở tấm thẻ (tổ tiên)      -&gt; icon opacity 0.3
card C  group CÙNG thẻ với icon        -&gt; icon opacity 1</div>
<p>Tấm C là cái bẫy "group CÙNG thẻ": luật đòi thẻ phải là tổ tiên của chính nó. Rồi tới dấu <code>~</code> chỉ-tiến, với <code>peer-focus:text-blue-600</code> trên nhãn:</p>
<div class="out">label BEFORE input, input focused  -&gt; label rgb(100, 116, 139)  (slate-500, unchanged)
label AFTER input (order-1), focused -&gt; label rgb(37, 99, 235)  (blue-600)</div>
<p>Và group lồng nhau — chỉ rê chuột lên dòng chữ của thẻ NGOÀI:</p>
<div class="out">outer card hovered, inner bare group     -&gt; inner text: underline, rgb(220, 38, 38)
outer card hovered, inner group/item      -&gt; inner text: none</div>
<h3>🔬 Đo trên mã của chính trang này (14/11/2026)</h3>
<div class="out">$ git grep -l 'group-hover:' -- 'src/*.tsx' | wc -l
     161
$ for f in $(git grep -l 'group-hover:' -- 'src/*.tsx'); do grep -qE "(className=[\\"'{\\&#96;]|[\\"' \\&#96;])group[\\"' \\&#96;]" "$f" || echo "$f"; done | wc -l
       2
$ for f in $(git grep -l 'group-hover:' -- 'src/*.tsx'); do grep -qE "(className=[\\"'{\\&#96;]|[\\"' \\&#96;])group[\\"' \\&#96;]" "$f" || echo "$f"; done | head -4
src/app/admin/user-codes/page.tsx
src/components/doiKhang/MinhHoa.tsx
$ git grep -n 'group-hover:opacity-100' -- src/app/admin/user-codes/page.tsx
src/app/admin/user-codes/page.tsx:102:                      &lt;Check className="w-4 h-4 text-neon-violet opacity-0 group-hover:opacity-100" /&gt;
$ git grep -c -wE 'group' -- src/app/admin/user-codes/page.tsx
src/app/admin/user-codes/page.tsx:1
$ git grep -n 'group-hover:' -- src/components/doiKhang/MinhHoa.tsx
src/components/doiKhang/MinhHoa.tsx:11:const NHAC = 'transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transiti…
$ git grep -n 'className="group relative' -- src/components/doiKhang/SanhDoiKhang.tsx
src/components/doiKhang/SanhDoiKhang.tsx:55:      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg…</div>
<p>Hai tệp dùng <code>group-hover:</code> mà không có lớp <code>group</code> nào trong cùng tệp. <code>MinhHoa.tsx</code> là một <strong>ràng buộc vô hình</strong> vẫn chạy: <code>group</code> nằm ở component cha, <code>SanhDoiKhang.tsx:55</code>. <code>admin/user-codes/page.tsx:102</code> là một <strong>con bọ âm thầm THẬT</strong>: icon dấu tích mang <code>opacity-0 group-hover:opacity-100</code> nằm trong một <code>&lt;button&gt;</code> (dòng 95) không có <code>group</code> — dòng duy nhất trong tệp chứa chữ ấy là chính dòng 102, nên icon không bao giờ hiện khi rê chuột. Sửa bằng một từ: thêm <code>group</code> vào nút.</p>
<div class="out">$ git grep -ohE 'className="[^"]*"' -- 'src/*.tsx' | tr ' "' '\\n\\n' | grep -cxE 'group|group/[a-z-]+'
219
$ git grep -ohE 'className="[^"]*"' -- 'src/*.tsx' | tr ' "' '\\n\\n' | grep -cx 'peer'
2
$ git grep -ohE 'peer-[a-z-]+:' -- 'src/*.tsx' | sort | uniq -c
   2 peer-empty:</div>
<p>Cả ứng dụng chỉ có hai <code>peer</code>, cả hai đúng chiều: một <code>div.peer</code> theo sau là đoạn chữ ẩn mang <code>peer-empty:block</code>.</p>
<h3>🆕 Ở Tailwind 4</h3>
<div class="out">@layer utilities {
  @media (hover: hover) {
    :is(:where(.group):hover .group-hover\\:opacity-50) {
    :is(:where(.group\\/item):hover .group-hover\\/item\\:underline) {
  :is(:where(.peer):checked ~ .peer-checked\\:block) {
  @media (hover: hover) {
    :where(:hover) .in-hover\\:underline {</div>
<p>Vẫn khoảng trắng con cháu và <code>~</code> chỉ-tiến, giờ nằm trong <code>:is(:where(.group)…)</code> và <code>@media (hover: hover)</code> — mọi kiểu hỏng trong bài vẫn đúng. Mới: <code>in-hover:</code> không cần <code>group</code>:</p>
<div class="out">    }
    :where(:hover) .in-hover\\:underline {
      text-decoration-line: underline;
    }
  }</div>
<p><code>:where(:hover) .x</code> nghĩa là <em>BẤT KỲ</em> tổ tiên nào đang được rê — mà <code>&lt;html&gt;</code>/<code>&lt;body&gt;</code> luôn được rê khi chuột nằm trên trang. Đo thật: rê một hộp không liên quan, chữ vẫn gạch chân (underline). Dùng nó bên trong một vùng mà bạn thật sự muốn bắt hover, hoặc giữ group có tên.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 hoặc 4. Rê từng tấm thẻ rồi đọc opacity của icon trong DevTools --&gt;
&lt;div class="rounded bg-slate-100 p-3"&gt;A · no group
  &lt;span class="group-hover:opacity-30"&gt;icon&lt;/span&gt;&lt;/div&gt;          &lt;!-- stays 1 --&gt;
&lt;div class="group rounded bg-slate-100 p-3"&gt;B · group on the ancestor
  &lt;span class="group-hover:opacity-30"&gt;icon&lt;/span&gt;&lt;/div&gt;          &lt;!-- 0.3 --&gt;
&lt;div class="rounded bg-slate-100 p-3"&gt;C · group on the SAME element
  &lt;span class="group group-hover:opacity-30"&gt;icon&lt;/span&gt;&lt;/div&gt;    &lt;!-- stays 1 --&gt;
&lt;!-- tìm các chỗ hỏng âm thầm trong dự án của bạn (bash): --&gt;
&lt;!-- for f in $(git grep -l 'group-hover:' -- '*.tsx'); do grep -qwE 'group' "$f" || echo "$f"; done --&gt;</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.1 — CSS là gì: bộ chọn, cascade, kế thừa</span><span class="lc-sub">Selector con cháu và cách trình duyệt khớp</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-2-4-forms" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 2.4 — Biểu mẫu: cách web nhận dữ liệu</span><span class="lc-sub">Nhãn và ô nhập — cặp mà peer-* tạo kiểu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-3-diem-ngat" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.3 — Điểm ngắt thắng nhờ VỊ TRÍ</span><span class="lc-sub">Bài sau: hình dạng thứ năm, đo thật</span></span></a>

<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> menu thả xuống mở bằng <code>group-hover:</code> cần chỗ để chạm trên điện thoại (ở đó không có hover); nhãn nổi ở trang đăng nhập (<code>peer-focus:</code>) và nút "hiện mật khẩu" (<code>peer-checked:</code>).</li><li><strong>Nếu… thì sao:</strong> ai đó chép <code>MinhHoa.tsx</code> sang trang khác mà thiếu thẻ cha mang <code>group</code>? Hiệu ứng nhấc lên biến mất âm thầm — không gì trông hỏng, nên chẳng ai báo.</li><li><strong>Góc kẻ xấu:</strong> ẨN không phải BẢO VỆ. Một nút quản trị <code>opacity-0</code> hay <code>hidden</code> vẫn nằm trong DOM; ai cũng xoá được lớp trong DevTools rồi bấm. Kiểm quyền thật phải ở máy chủ. Còn trang lừa đảo chép nhãn nổi y từng pixel — đẹp không chứng minh gì, hãy đọc thanh địa chỉ.</li><li><strong>Liên quan:</strong> biểu mẫu, nhãn và ô nhập — Nền tảng Web 2.4.</li></ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Silent failure</span><span class="v">Hỏng âm thầm — CSS hợp lệ được phát sinh nhưng không bao giờ khớp; không cảnh báo, không lỗi, lớp trông đã áp.</span></div>
  <div class="kv"><span class="k"><code>group</code></span><span class="v">Ghép con cháu (<code>.group:hover .group-hover\\:x</code>) — cần <code>group</code> trên một tổ tiên.</span></div>
  <div class="kv"><span class="k"><code>peer</code></span><span class="v">Ghép anh em với <code>~</code> — cần <code>peer</code> trên anh em đứng trước, cùng cha.</span></div>
  <div class="kv"><span class="k">Forward-only <code>~</code></span><span class="v"><code>~</code> chỉ tiến — tổ hợp anh em đứng sau chỉ khớp anh em sau; CSS không chọn được anh em trước.</span></div>
  <div class="kv"><span class="k">Named groups</span><span class="v">Nhóm có tên — <code>group/item</code> + <code>group-hover/item:</code> gỡ nhập nhằng nhóm lồng nhau để hover không lan qua các cấp.</span></div>
  <div class="kv"><span class="k">Invisible coupling</span><span class="v">Ràng buộc vô hình — thẻ dùng <code>group-hover:</code> ngầm phụ thuộc một tổ tiên <code>group</code> mà nó không khai.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>group-*</code> và <code>peer-*</code> trải qua hai thẻ, nên hỏng bằng cách phát sinh CSS đúng mà không bao giờ khớp.</li><li>Chẩn đoán bằng cách đọc selector phát sinh: khoảng trắng hoặc <code>~</code> nghĩa là nó chờ một thẻ thứ hai bạn phải cấp.</li><li><code>~</code> chỉ trỏ về phía trước — nhãn nổi đặt ô nhập trước nhãn đúng vì lý do này.</li><li>Nhóm lồng không tên bị lan; thêm hậu tố <code>/name</code> vào cả group lẫn biến thể của nó.</li><li>Một thẻ cần <code>group</code> từ cha là bị ràng buộc — mang <code>group</code> trên gốc của chính nó hoặc ghi chú lại.</li></ul>

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
${G02_3}
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
<pre><code class="language-bash">$ git grep -lE '(^|[" &#96;{])(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
$ git ls-files 'src/*.tsx' | wc -l
</code></pre>

<div class="out">671    # file co IT NHAT mot bien the diem ngat   (do 14/11/2026; luc soan bai: 372)
1673   # tong so file .tsx                  (luc soan bai: 793)
</div>

<p>40% of <code>.tsx</code> files carry at least one breakpoint variant (47% when the lesson was written). Counted 14/11/2026 at the start of a class: <code>sm:</code> 2,014 uses, <code>md:</code> 654, <code>lg:</code> 645, <code>xl:</code> 83, <code>2xl:</code> 8 (the lesson measured 1,220 / 266 / 376 / 48 / 1). The heavy skew to <code>sm:</code> says most responsive work here is the single jump from phone to everything-else, rather than a carefully tiered five-breakpoint system. That is typical and fine — and it means the <code>2xl:</code> single use is almost certainly an accident worth deleting.</p>
<p><strong>Corrected 14/11/2026:</strong> <code>2xl:</code> is no longer a single accident — there are eight distinct <code>2xl:</code> classes today (<code>2xl:grid-cols-4</code>, <code>2xl:w-[240px]</code>, <code>2xl:hidden</code>…), deliberate wide-screen layouts. Count before you delete.</p>

<div class="pitfall">
<p><strong>Trap — reading <code>md:</code> as "on medium screens".</strong> It means "at 768px <em>and above</em>", so it applies to medium, large, extra-large and beyond. Writing <code>md:hidden</code> to hide something on tablets also hides it on every desktop. To target a band you need both ends: <code>md:max-lg:hidden</code>. This single misreading accounts for a large share of "my responsive layout is wrong on desktop" bugs, and it is entirely a vocabulary problem — the name suggests a range, the behaviour is a threshold.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Breakpoint variants add no specificity and win purely by being emitted later, so Tailwind sorts <code>min-*</code> ascending and <code>max-*</code> descending to make the narrowest matching rule land last — which makes mobile-first the direction the cascade runs rather than a style preference, and leaves every responsive class vulnerable to any hand-written rule scoring <code>0,2,0</code>.</p>
</div>

<h3>Why breakpoint order in the class attribute does not matter</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Every responsive utility has zero extra specificity</span><span class="lz-d"><code>md:p-4</code> is a plain class inside a media query. It does not outrank <code>p-2</code> by being more specific, because it is not.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">So the winner is source order in the stylesheet</span><span class="lz-d">And Tailwind emits breakpoints in ascending width, always — <code>sm</code>, then <code>md</code>, then <code>lg</code>, regardless of how you typed them.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Which is why mobile-first works</span><span class="lz-d">The unprefixed value applies everywhere and each larger breakpoint overrides it, because each is emitted later.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">And why <code>md:p-4 p-2</code> behaves identically to <code>p-2 md:p-4</code></span><span class="lz-d">The class attribute is a set, not a sequence. Nothing you do in the markup changes which rule wins.</span></div>
</div>
<h3>🔬 Measured: one page at six widths (Chromium, Tailwind 3.4.19)</h3>
<div class="out">window  #h (2xl sm base xl md lg)  p-1 md:p-4 max-lg:p-6  p-1 md:max-lg:p-3  md:hidden
 500px                       4px                   24px                4px  block
 700px                       8px                   24px                4px  block
 800px                      16px                   16px               12px  none
1100px                      24px                   16px                4px  none
1300px                      32px                   16px                4px  none
1600px                      40px                   16px                4px  none</div>
<p>The shuffled box is right at every width — because of emit order, not class order. At 800px <code>max-lg:p-6</code> and <code>md:p-4</code> both match and <code>md:p-4</code> wins (16px); the two-sided band applies only between 768 and 1024 (12px); <code>md:hidden</code> is gone at 800px <em>and</em> at 1600px.</p>
<p>In this site's code today:</p>
<div class="out">$ git ls-files 'src/*.tsx' | wc -l
    1673
$ git grep -lE '(^|[" &#96;{])(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
     671
$ for v in sm md lg xl 2xl; do printf "%-4s %6d\\n" "$v:" "$(git grep -ohE "(^|[\\"' \\&#96;{])$v:" -- 'src/*.tsx' | wc -l)"; done
sm:    2014
md:     654
lg:     645
xl:      83
2xl:      8
$ git grep -ohE '(^|[" &#96;{])max-(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
     170
$ git grep -ohE '(^|[" &#96;{])(sm|md|lg|xl):max-(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
       0
$ git grep -ohE '(^|[" &#96;{])(sm|md|lg|xl|2xl):hidden' -- 'src/*.tsx' | sed -E 's/^[" &#96;{]//' | sort | uniq -c
  17 lg:hidden
  29 md:hidden
  16 sm:hidden
   4 xl:hidden
$ git grep -ohE "2xl:[^ \\"'\\&#96;]+" -- 'src/*.tsx' | sort | uniq -c
   2 2xl:!hidden
   1 2xl:grid-cols-[minmax(0,1fr)_340px]
   1 2xl:grid-cols-3
   3 2xl:grid-cols-4
   1 2xl:grid-cols-8
   1 2xl:hidden
   1 2xl:pr-20
   1 2xl:w-[240px]</div>
<h3>🆕 In Tailwind 4</h3>
<div class="out">@layer utilities {
  .p-1 {
  @media (width &lt; 64rem) {
    .max-lg\\:p-5 {
  @media (width &lt; 48rem) {
    .max-md\\:p-7 {
  @media (width &gt;= 40rem) {
    .sm\\:p-2 {
  @media (width &gt;= 48rem) {
    .md\\:p-4 {
    @media (width &lt; 64rem) {
      .md\\:max-lg\\:p-3 {
  @media (width &gt;= 64rem) {
    .lg\\:p-6 {
  @media (width &gt;= 80rem) {
    .xl\\:p-8 {
  @media (width &gt;= 96rem) {
    .\\32 xl\\:p-10 {</div>
<p>Same mechanism: every <code>max-*</code> first (descending), then <code>min-*</code> ascending; a band like <code>md:max-lg:</code> becomes a <em>nested</em> <code>@media</code>. What changed: breakpoints are <strong>rem</strong> with range syntax — <code>(width &gt;= 48rem)</code> — so they equal 768px only while the root font is 16px, and they are theme variables (<code>--breakpoint-md</code> in <code>@theme</code>).</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 or 4. Open DevTools, toggle the device toolbar, drag the width from 500 to 1600 --&gt;
&lt;div id="h" class="2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6 bg-cyan-100"&gt;written shuffled&lt;/div&gt;
&lt;div id="m" class="p-1 md:p-4 max-lg:p-6 bg-amber-100"&gt;p-1 md:p-4 max-lg:p-6&lt;/div&gt;
&lt;div id="n" class="md:hidden bg-rose-100"&gt;md:hidden&lt;/div&gt;
&lt;!-- console: [innerWidth, getComputedStyle(h).paddingTop, getComputedStyle(m).paddingTop, getComputedStyle(n).display] --&gt;</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-5-responsive" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations · 3.5 — Responsive design: one page, every screen</span><span class="lc-sub">The same mobile-first min-width media queries, in plain CSS</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-4-che-do-toi" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.4 — Dark mode</span><span class="lc-sub">Next lesson: the variant with the largest blast radius</span></span></a>

<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> rotate your phone and you cross 640 or 768px — the layout jumps. A laptop at 125% Windows scaling has a narrower CSS width than its pixels and gets the tablet layout.</li><li><strong>What if…</strong> the user sets the browser font to 20px? Tailwind 4 breakpoints are rem: <code>md</code> = 48rem = 48 × 20 = 960px, so the desktop layout starts at 960px. Tailwind 3 px breakpoints do not move.</li><li><strong>The attacker's view (dark patterns):</strong> a fee line or the "cancel subscription" link inside <code>hidden md:block</code> simply does not exist on the phone where most people pay; scam pages do the reverse and show an "official" badge only at phone widths. Before paying, view the page at two widths; as a developer, never put required text behind a breakpoint.</li><li><strong>Related:</strong> mobile-first media queries in plain CSS — Web Foundations 3.5.</li></ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Source-order win</span><span class="v">Breakpoints add no specificity, so the later rule wins at equal specificity.</span></div>
  <div class="kv"><span class="k">Ascending emit order</span><span class="v">Tailwind sorts <code>min-*</code> queries ascending so the largest matching breakpoint lands last and wins.</span></div>
  <div class="kv"><span class="k">Mobile-first</span><span class="v">The unprefixed class is the smallest-screen case; each breakpoint overrides upward.</span></div>
  <div class="kv"><span class="k"><code>max-*</code> variants</span><span class="v">Ceilings compiled as <code>not all and (min-width: X)</code>, emitted descending and before all <code>min-*</code>.</span></div>
  <div class="kv"><span class="k">Two-sided band</span><span class="v"><code>md:max-lg:p-4</code> — the reliable way to target only one width band.</span></div>
  <div class="kv"><span class="k">Zero-specificity vulnerability</span><span class="v">Any hand-written <code>0,2,0</code> rule beats <code>md:flex</code> at every screen size.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Breakpoint variants win purely by emit order, not specificity — the order you type in the class attribute is irrelevant.</li><li>Tailwind emits <code>min-*</code> ascending and <code>max-*</code> descending so the narrowest matching rule lands last.</li><li>Mobile-first is the direction the cascade runs, not advice: the base class is the narrowest layout.</li><li><code>md:</code> means "768px and above", a threshold not a range — target a band with <code>md:max-lg:</code>.</li><li>Because responsive classes score <code>0,1,0</code>, a hand-written <code>0,2,0</code> rule silently beats them everywhere.</li></ul>

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
<pre><code class="language-bash">$ git grep -lE '(^|[" &#96;{])(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
$ git ls-files 'src/*.tsx' | wc -l
</code></pre>

<div class="out">671    # file co IT NHAT mot bien the diem ngat   (do 14/11/2026; luc soan bai: 372)
1673   # tong so file .tsx                  (luc soan bai: 793)
</div>

<p>40% tệp <code>.tsx</code> mang ít nhất một biến thể điểm ngắt (lúc soạn bài là 47%). Đếm 14/11/2026, đứng đầu lớp: <code>sm:</code> 2.014 lượt, <code>md:</code> 654, <code>lg:</code> 645, <code>xl:</code> 83, <code>2xl:</code> 8 (lúc soạn: 1.220 / 266 / 376 / 48 / 1). Độ lệch nặng về <code>sm:</code> nói rằng phần lớn việc responsive ở đây là MỘT bước nhảy từ điện thoại sang mọi-thứ-còn-lại, chứ không phải một hệ năm-điểm-ngắt phân tầng cẩn thận. Điều đó điển hình và ổn — và nó có nghĩa một lượt <code>2xl:</code> duy nhất gần như chắc chắn là một tai nạn đáng xoá.</p>
<p><strong>Sửa 14/11/2026:</strong> <code>2xl:</code> không còn là một tai nạn lẻ — hôm nay có tám lớp <code>2xl:</code> khác nhau (<code>2xl:grid-cols-4</code>, <code>2xl:w-[240px]</code>, <code>2xl:hidden</code>…), là bố cục màn rất rộng CÓ CHỦ Ý. Đếm trước khi xoá.</p>

<div class="pitfall">
<p><strong>Bẫy — đọc <code>md:</code> thành "trên màn hình trung bình".</strong> Nó nghĩa là "ở 768px <em>TRỞ LÊN</em>", nên nó áp cho trung bình, lớn, siêu lớn và hơn nữa. Viết <code>md:hidden</code> để ẩn thứ gì đó trên máy tính bảng thì cũng ẩn nó trên MỌI desktop. Để nhắm một DẢI bạn cần cả hai đầu: <code>md:max-lg:hidden</code>. Chỉ riêng cú đọc nhầm này chiếm một phần lớn số bọ "bố cục responsive của tôi sai trên desktop", và nó hoàn toàn là một vấn đề TỪ VỰNG — cái tên gợi ý một khoảng, hành vi là một NGƯỠNG.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Biến thể điểm ngắt KHÔNG thêm độ đặc hiệu và thắng thuần tuý nhờ được phát sinh sau, nên Tailwind sắp <code>min-*</code> tăng dần và <code>max-*</code> giảm dần để quy tắc khớp HẸP NHẤT rơi xuống cuối — thứ biến mobile-first thành CHIỀU CHẠY của cascade chứ không phải một sở thích phong cách, và để mọi lớp responsive dễ tổn thương trước bất kỳ quy tắc viết tay nào đạt <code>0,2,0</code>.</p>
</div>

<h3>Vì sao thứ tự điểm ngắt trong thuộc tính class không có ý nghĩa</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mọi utility responsive đều có độ đặc hiệu bằng không</span><span class="lz-d"><code>md:p-4</code> chỉ là một class thường nằm trong một media query. Nó KHÔNG thắng <code>p-2</code> nhờ đặc hiệu hơn, vì nó không hề đặc hiệu hơn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nên kẻ thắng là thứ tự trong bảng kiểu</span><span class="lz-d">Và Tailwind luôn sinh ra các điểm ngắt theo chiều rộng tăng dần — <code>sm</code>, rồi <code>md</code>, rồi <code>lg</code>, bất kể bạn gõ chúng theo thứ tự nào.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đó là lý do lối ưu-tiên-điện-thoại chạy được</span><span class="lz-d">Giá trị không tiền tố áp ở mọi nơi và mỗi điểm ngắt lớn hơn đè lên nó, vì mỗi cái được sinh ra sau.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Và là lý do <code>md:p-4 p-2</code> hành xử y hệt <code>p-2 md:p-4</code></span><span class="lz-d">Thuộc tính class là một TẬP HỢP, không phải một trình tự. Chẳng có gì bạn làm trong markup đổi được luật nào thắng.</span></div>
</div>
<h3>🔬 Đo thật: một trang ở sáu bề ngang (Chromium, Tailwind 3.4.19)</h3>
<div class="out">cua so  #h (2xl sm base xl md lg)  p-1 md:p-4 max-lg:p-6  p-1 md:max-lg:p-3  md:hidden
 500px                       4px                   24px                4px  block
 700px                       8px                   24px                4px  block
 800px                      16px                   16px               12px  none
1100px                      24px                   16px                4px  none
1300px                      32px                   16px                4px  none
1600px                      40px                   16px                4px  none</div>
<p>Hộp viết lộn xộn đúng ở mọi bề ngang — nhờ thứ tự SINH RA, không nhờ thứ tự viết. Ở 800px cả <code>max-lg:p-6</code> lẫn <code>md:p-4</code> đều khớp và <code>md:p-4</code> thắng (16px); dải hai đầu chỉ áp từ 768 tới 1024 (12px); <code>md:hidden</code> biến mất ở 800px <em>VÀ</em> ở 1600px.</p>
<p>Trên mã của trang này hôm nay:</p>
<div class="out">$ git ls-files 'src/*.tsx' | wc -l
    1673
$ git grep -lE '(^|[" &#96;{])(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
     671
$ for v in sm md lg xl 2xl; do printf "%-4s %6d\\n" "$v:" "$(git grep -ohE "(^|[\\"' \\&#96;{])$v:" -- 'src/*.tsx' | wc -l)"; done
sm:    2014
md:     654
lg:     645
xl:      83
2xl:      8
$ git grep -ohE '(^|[" &#96;{])max-(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
     170
$ git grep -ohE '(^|[" &#96;{])(sm|md|lg|xl):max-(sm|md|lg|xl|2xl):' -- 'src/*.tsx' | wc -l
       0
$ git grep -ohE '(^|[" &#96;{])(sm|md|lg|xl|2xl):hidden' -- 'src/*.tsx' | sed -E 's/^[" &#96;{]//' | sort | uniq -c
  17 lg:hidden
  29 md:hidden
  16 sm:hidden
   4 xl:hidden
$ git grep -ohE "2xl:[^ \\"'\\&#96;]+" -- 'src/*.tsx' | sort | uniq -c
   2 2xl:!hidden
   1 2xl:grid-cols-[minmax(0,1fr)_340px]
   1 2xl:grid-cols-3
   3 2xl:grid-cols-4
   1 2xl:grid-cols-8
   1 2xl:hidden
   1 2xl:pr-20
   1 2xl:w-[240px]</div>
<h3>🆕 Ở Tailwind 4</h3>
<div class="out">@layer utilities {
  .p-1 {
  @media (width &lt; 64rem) {
    .max-lg\\:p-5 {
  @media (width &lt; 48rem) {
    .max-md\\:p-7 {
  @media (width &gt;= 40rem) {
    .sm\\:p-2 {
  @media (width &gt;= 48rem) {
    .md\\:p-4 {
    @media (width &lt; 64rem) {
      .md\\:max-lg\\:p-3 {
  @media (width &gt;= 64rem) {
    .lg\\:p-6 {
  @media (width &gt;= 80rem) {
    .xl\\:p-8 {
  @media (width &gt;= 96rem) {
    .\\32 xl\\:p-10 {</div>
<p>Cùng cơ chế: mọi <code>max-*</code> đứng trước (giảm dần), rồi <code>min-*</code> tăng dần; dải như <code>md:max-lg:</code> thành một <code>@media</code> <em>LỒNG</em>. Khác: điểm ngắt dùng <strong>rem</strong> và cú pháp khoảng — <code>(width &gt;= 48rem)</code> — nên chỉ bằng 768px khi cỡ chữ gốc là 16px, và chúng là biến theme (<code>--breakpoint-md</code> trong <code>@theme</code>).</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 hoặc 4. Mở DevTools, bật thanh thiết bị, kéo bề ngang từ 500 tới 1600 --&gt;
&lt;div id="h" class="2xl:p-10 sm:p-2 p-1 xl:p-8 md:p-4 lg:p-6 bg-cyan-100"&gt;written shuffled&lt;/div&gt;
&lt;div id="m" class="p-1 md:p-4 max-lg:p-6 bg-amber-100"&gt;p-1 md:p-4 max-lg:p-6&lt;/div&gt;
&lt;div id="n" class="md:hidden bg-rose-100"&gt;md:hidden&lt;/div&gt;
&lt;!-- console: [innerWidth, getComputedStyle(h).paddingTop, getComputedStyle(m).paddingTop, getComputedStyle(n).display] --&gt;</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-5-responsive" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web · 3.5 — Thiết kế responsive: một trang, mọi màn hình</span><span class="lc-sub">Cùng các media min-width viết mobile-first, bằng CSS thuần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-4-che-do-toi" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.4 — Chế độ tối</span><span class="lc-sub">Bài sau: biến thể có bán kính nổ lớn nhất</span></span></a>

<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> xoay ngang điện thoại là vượt qua 640 hay 768px — bố cục nhảy. Laptop chỉnh tỉ lệ hiển thị 125% có bề ngang CSS hẹp hơn số điểm ảnh, và nhận bố cục máy tính bảng.</li><li><strong>Nếu… thì sao:</strong> người dùng đặt cỡ chữ trình duyệt 20px? Điểm ngắt Tailwind 4 là rem: <code>md</code> = 48rem = 48 × 20 = 960px, nên bố cục máy tính chỉ bắt đầu từ 960px. Điểm ngắt px của Tailwind 3 thì không dịch.</li><li><strong>Góc kẻ xấu (dark pattern):</strong> dòng phí hay liên kết "huỷ đăng ký" nằm trong <code>hidden md:block</code> đơn giản là KHÔNG CÓ trên điện thoại, nơi người ta trả tiền nhiều nhất; trang lừa thì làm ngược lại, chỉ hiện huy hiệu "chính thức" ở bề ngang điện thoại. Trước khi trả tiền, xem trang ở hai bề ngang; làm web thì đừng đặt chữ bắt buộc sau một điểm ngắt.</li><li><strong>Liên quan:</strong> media query mobile-first bằng CSS thuần — Nền tảng Web 3.5.</li></ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Source-order win</span><span class="v">Thắng nhờ thứ tự nguồn — điểm ngắt không thêm độ đặc hiệu, nên khi bằng độ đặc hiệu, quy tắc sau thắng.</span></div>
  <div class="kv"><span class="k">Ascending emit order</span><span class="v">Phát sinh tăng dần — Tailwind xếp <code>min-*</code> tăng dần để điểm ngắt lớn nhất khớp rơi cuối và thắng.</span></div>
  <div class="kv"><span class="k">Mobile-first</span><span class="v">Lớp không tiền tố là ca màn nhỏ nhất; mỗi điểm ngắt ghi đè lên trên.</span></div>
  <div class="kv"><span class="k"><code>max-*</code> variants</span><span class="v">Biến thể trần — biên dịch thành <code>not all and (min-width: X)</code>, phát sinh giảm dần và trước mọi <code>min-*</code>.</span></div>
  <div class="kv"><span class="k">Two-sided band</span><span class="v">Dải hai đầu — <code>md:max-lg:p-4</code>, cách đáng tin để nhắm đúng một dải bề ngang.</span></div>
  <div class="kv"><span class="k">Zero-specificity vulnerability</span><span class="v">Lỗ hổng độ đặc hiệu 0 — bất kỳ quy tắc tay <code>0,2,0</code> nào cũng thắng <code>md:flex</code> ở mọi cỡ màn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Biến thể điểm ngắt thắng thuần tuý nhờ thứ tự phát sinh, không nhờ độ đặc hiệu — thứ tự bạn gõ trong thuộc tính lớp là vô nghĩa.</li><li>Tailwind phát sinh <code>min-*</code> tăng dần và <code>max-*</code> giảm dần để quy tắc hẹp nhất khớp rơi cuối.</li><li>Mobile-first là chiều cascade chạy, không phải lời khuyên: lớp nền là bố cục hẹp nhất.</li><li><code>md:</code> nghĩa là "từ 768px trở lên", một ngưỡng chứ không phải một dải — nhắm dải bằng <code>md:max-lg:</code>.</li><li>Vì lớp responsive đạt <code>0,1,0</code>, một quy tắc tay <code>0,2,0</code> âm thầm đánh bại chúng ở mọi nơi.</li></ul>

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
${G02_4}
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

<div class="out">1102   # tong so luot dung dark:                       (do 14/11/2026; luc soan bai: 786)
 915   # trong components/notes/  -> DUNG luat (83,0%)   (luc soan: 722, 91,9%)
 187   # NGOAI notes/             -> TROI khoi luat (17,0%), trai 56 file   (luc soan: 64, 32 file)
</div>

<p><strong>83.0% compliance today (91.9% when the lesson was written).</strong> The rule still mostly holds, but the drift has <strong>grown</strong>: 187 stragglers across 56 files, concentrated in features built after the rule was written — <code>components/work</code> (8 files), <code>exp-hub</code> (7), <code>components/language</code> (5), <code>tech-trends</code> (4), <code>app/language</code> (4), <code>cv</code> (3). None of them currently misbehave, because those <code>dark:</code> utilities simply never activate outside Notes. They are dead styles: harmless today, and a trap the moment someone puts <code>.dark</code> higher in the tree again.</p>

<div class="callout ok">
<p><strong>This is why the measurement is worth running.</strong> A documented rule with 83% compliance looks like a success and is also a live liability — 187 utilities are silently doing nothing, which means whoever wrote them believed they were styling something. The dead ones should either be migrated to <code>html.theme-dark</code> CSS or deleted. Neither happens unless someone counts.</p>
</div>

<div class="pitfall">
<p><strong>Trap — my own first measurement of this returned 0.</strong> I ran <code>grep -o 'dark:[a-z0-9/\\[\\]#.-]*'</code> and got zero matches, when the baseline count was 786. The escaped brackets inside a character class broke the class itself. The number was obviously wrong <em>only because I had a baseline to compare against</em> — without the 786 I would have concluded the rule was perfectly followed and moved on. A measurement returning zero deserves more suspicion than one returning a surprising number.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>dark:</code> compiles to an ancestor test with no scope limit, so a single class placed high in the DOM activates every such utility in the application at once — which is why the global theme here is named <code>theme-dark</code> and <code>.dark</code> is reserved, and why the three <code>darkMode</code> strategies differ in specificity (<code>:is()</code> scores, <code>:where()</code> does not) as well as in trigger.</p>
</div>

<h3>🔬 Measured: the three strategies, and what each one does in Chromium</h3>
<div class="out"># darkMode: media
@media (prefers-color-scheme: dark) {
  .dark\\:text-white {
  }
}
# darkMode: class
.dark\\:text-white:is(.dark *) {
}
# darkMode: selector
.dark\\:text-white:where(.theme-dark, .theme-dark *) {
}
# (Tailwind 3.4.19; the --tw-text-opacity lines are hidden)</div>
<p>The specificity difference, measured on one page with a hand-written <code>.note</code> loaded after Tailwind:</p>
<div class="out">&lt;html class="dark"&gt; + .note (0,1,0, loaded after Tailwind)
darkMode: 'class'                -&gt; text rgb(255, 255, 255)   (white: dark:text-white 0,2,0 wins)
darkMode: ['selector', '.dark']  -&gt; text rgb(220, 38, 38)    (red: 0,1,0 tie, .note is later)</div>
<p>The incident, reproduced: a Notes wrapper in its <strong>brown</strong> theme, inside an app shell that puts a class on <code>&lt;html&gt;</code>:</p>
<div class="out">&lt;html class="dark"&gt;        Notes box (theme BROWN) background -&gt; rgb(15, 23, 42)   (slate-900, DARK)
&lt;html class="theme-dark"&gt;  Notes box (theme BROWN) background -&gt; rgb(254, 243, 199)  (amber-100, brown)</div>
<p>And the trap — the broken character class, re-run on today's code next to the baseline:</p>
<div class="out">$ git grep -oh 'dark:[^ "'"'"'&#96;]*' -- 'src/*.tsx' | wc -l
    1102
$ git grep -oh 'dark:[a-z0-9/\\[\\]#.-]*' -- 'src/*.tsx' | wc -l
       0</div>
<h3>🆕 In Tailwind 4</h3>
<div class="out">$ npx @tailwindcss/cli -i mac-dinh.css -o o1.css 2&gt;&amp;1 | tail -1; grep -B1 -A2 'dark\\\\:text-white {' o1.css
Done in 25ms
  @media (prefers-color-scheme: dark) {
    .dark\\:text-white {
      color: var(--color-white);
    }
$ npx @tailwindcss/cli -i lop.css -o o2.css 2&gt;&amp;1 | tail -1; grep -A1 'dark\\\\:text-white:' o2.css
Done in 24ms
  .dark\\:text-white:where(.dark, .dark *) {
    color: var(--color-white);</div>
<p>The default is <code>prefers-color-scheme</code>; the class strategy is one <code>@custom-variant</code> line, compiled with <code>:where()</code> — <strong>0,1,0</strong>, the same as the <code>selector</code> strategy measured red above. A migration from <code>darkMode: 'class'</code> therefore removes one level of specificity from every <code>dark:</code> rule. You also choose the variant's name, so <code>@custom-variant notes-dark (…)</code> can make the namespace split explicit.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3: tailwind.config.js { darkMode: 'class' } · then try ['selector', '.dark'] --&gt;
&lt;html class="dark"&gt;
  &lt;link rel="stylesheet" href="out.css"&gt;&lt;style&gt;.note { color: rgb(220 38 38); }&lt;/style&gt;
  &lt;p class="note dark:text-white"&gt;which colour?&lt;/p&gt;
  &lt;div data-notes-theme="brown"&gt;&lt;div class="bg-amber-100 dark:bg-slate-900"&gt;Notes in BROWN&lt;/div&gt;&lt;/div&gt;
&lt;/html&gt;
&lt;!-- then change &lt;html class="dark"&gt; to &lt;html class="theme-dark"&gt; and look again --&gt;</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-3-dark-mode" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.3 — Dark mode: the dark: variant and a no-flash toggle</span><span class="lc-sub">Building the switch itself in a real app</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-4-theme-css-variables" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.4 — Theming with CSS variables (and the naming trap)</span><span class="lc-sub">The approach that needs no dark: variant at all</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-5-bien-the-tuy-y" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.5 — Arbitrary variants</span><span class="lc-sub">Next lesson: the escape hatch and the modern variants</span></span></a>

<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> your phone switches to dark mode at night (<code>prefers-color-scheme</code>); a site with half its <code>dark:</code> styles gives dark text on a dark background — readable at noon, invisible at 11pm.</li><li><strong>What if…</strong> someone puts <code>.dark</code> back on <code>&lt;html&gt;</code>? The 187 dead <code>dark:</code> uses in 56 files wake up at once — the 02/07 incident again, wider.</li><li><strong>The attacker's view:</strong> text hidden by one theme — white on a white card, black on black. Scam pages hide fees and terms this way, SEO spam hides keywords, and some pages hide instructions aimed at AI assistants that read them ("prompt injection"). Press Ctrl/⌘ + A: selection reveals hidden text; switch the theme and look again. As a developer, check contrast in both themes (Chapter 9).</li><li><strong>Related:</strong> a no-flash dark toggle — Next.js 13.3; theming with CSS variables — Next.js 13.4.</li></ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>darkMode: 'media'</code></span><span class="v">Follows the OS via <code>prefers-color-scheme</code>; no DOM state, so the UI cannot override it.</span></div>
  <div class="kv"><span class="k"><code>darkMode: 'class'</code></span><span class="v">Compiles to <code>:is(.dark *)</code> — matches descendants of <code>.dark</code>, specificity <code>0,2,0</code>.</span></div>
  <div class="kv"><span class="k"><code>['selector', '.x']</code></span><span class="v"><code>:where(.x, .x *)</code> — matches the element itself too, and adds <em>zero</em> specificity (<code>0,1,0</code>).</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">One <code>.dark</code> ancestor high in the DOM activates every <code>dark:</code> utility below it.</span></div>
  <div class="kv"><span class="k">Namespace separation</span><span class="v">The fix: name the global theme <code>theme-dark</code> and reserve <code>.dark</code> for the Notes wrapper.</span></div>
  <div class="kv"><span class="k">Dead styles</span><span class="v">The 64 <code>dark:</code> utilities outside Notes never activate — harmless now, a trap if <code>.dark</code> moves up again.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The three <code>darkMode</code> strategies differ in trigger and in specificity — <code>:is()</code> scores <code>0,2,0</code>, <code>:where()</code> scores nothing.</li><li><code>'class'</code> compiles to a scope-less ancestor test, so <code>.dark</code> on <code>&lt;html&gt;</code> activates every dark utility at once — the 2026-07-02 incident.</li><li>The fix was a naming fix: global theme is <code>theme-dark</code>, <code>.dark</code> is reserved for Notes — no config change.</li><li>A measurement showed 83.0% compliance (14/11/2026; 91.9% earlier), with 187 dead <code>dark:</code> utilities that should be migrated or deleted.</li><li>A measurement returning zero deserves more suspicion than a surprising number — keep a baseline.</li></ul>

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

<div class="out">1102   # tong so luot dung dark:                       (do 14/11/2026; luc soan bai: 786)
 915   # trong components/notes/  -> DUNG luat (83,0%)   (luc soan: 722, 91,9%)
 187   # NGOAI notes/             -> TROI khoi luat (17,0%), trai 56 file   (luc soan: 64, 32 file)
</div>

<p><strong>Hôm nay 83,0% tuân thủ (lúc soạn bài 91,9%).</strong> Cái luật vẫn phần lớn đứng, nhưng phần trôi đã TĂNG: 187 cái rớt lại trải 56 tệp, tập trung ở các tính năng dựng SAU khi luật được viết — <code>components/work</code> (8 tệp), <code>exp-hub</code> (7), <code>components/language</code> (5), <code>tech-trends</code> (4), <code>app/language</code> (4), <code>cv</code> (3). Hiện tại KHÔNG cái nào hành xử sai, vì các tiện ích <code>dark:</code> ấy đơn giản là KHÔNG BAO GIỜ kích hoạt bên ngoài Notes. Chúng là kiểu dáng CHẾT: vô hại hôm nay, và là một cái bẫy ngay khoảnh khắc ai đó lại đặt <code>.dark</code> lên cao hơn trong cây.</p>

<div class="callout ok">
<p><strong>Đây là lý do phép đo đáng chạy.</strong> Một luật có tài liệu với 83% tuân thủ TRÔNG như một thành công và đồng thời là một khoản NỢ đang sống — 187 tiện ích đang âm thầm không làm gì, nghĩa là người viết chúng TIN rằng mình đang tạo kiểu cho cái gì đó. Những cái chết nên hoặc được chuyển sang CSS <code>html.theme-dark</code> hoặc bị XOÁ. Không cái nào xảy ra trừ khi có người ĐẾM.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — phép đo ĐẦU TIÊN của chính tôi cho ra 0.</strong> Tôi chạy <code>grep -o 'dark:[a-z0-9/\\[\\]#.-]*'</code> và được KHÔNG kết quả nào, trong khi số nền là 786. Các dấu ngoặc vuông bị thoát BÊN TRONG một lớp ký tự đã làm vỡ chính lớp ký tự ấy. Con số rõ ràng sai <em>CHỈ vì tôi có một con số NỀN để đối chiếu</em> — không có 786 thì tôi đã kết luận luật được tuân thủ hoàn hảo rồi đi tiếp. Một phép đo trả về KHÔNG đáng ngờ hơn một phép đo trả về một con số gây bất ngờ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>dark:</code> biên dịch thành một phép thử TỔ TIÊN KHÔNG có giới hạn phạm vi, nên một lớp duy nhất đặt cao trong DOM kích hoạt MỌI tiện ích loại đó trong ứng dụng cùng lúc — đó là lý do theme toàn cục ở đây tên là <code>theme-dark</code> và <code>.dark</code> được để dành, và là lý do ba chiến lược <code>darkMode</code> khác nhau cả về ĐỘ ĐẶC HIỆU (<code>:is()</code> có tính, <code>:where()</code> không) lẫn về cách kích hoạt.</p>
</div>

<h3>🔬 Đo thật: ba chiến lược, và mỗi cái làm gì trong Chromium</h3>
<div class="out"># darkMode: media
@media (prefers-color-scheme: dark) {
  .dark\\:text-white {
  }
}
# darkMode: class
.dark\\:text-white:is(.dark *) {
}
# darkMode: selector
.dark\\:text-white:where(.theme-dark, .theme-dark *) {
}
# (Tailwind 3.4.19; da an dong --tw-text-opacity)</div>
<p>Khác biệt độ đặc hiệu, đo trên một trang có luật viết tay <code>.note</code> nạp SAU Tailwind:</p>
<div class="out">&lt;html class="dark"&gt; + .note (0,1,0, nap SAU Tailwind)
darkMode: 'class'                -&gt; text rgb(255, 255, 255)   (white: dark:text-white 0,2,0 wins)
darkMode: ['selector', '.dark']  -&gt; text rgb(220, 38, 38)    (red: 0,1,0 tie, .note is later)</div>
<p>Sự cố, tái hiện: một vùng Notes đang ở theme <strong>NÂU</strong>, nằm trong vỏ ứng dụng đặt một lớp lên <code>&lt;html&gt;</code>:</p>
<div class="out">&lt;html class="dark"&gt;        Notes box (theme BROWN) background -&gt; rgb(15, 23, 42)   (slate-900, DARK)
&lt;html class="theme-dark"&gt;  Notes box (theme BROWN) background -&gt; rgb(254, 243, 199)  (amber-100, brown)</div>
<p>Và cái bẫy — lớp ký tự hỏng, chạy lại trên mã hôm nay, cạnh phép đếm mốc:</p>
<div class="out">$ git grep -oh 'dark:[^ "'"'"'&#96;]*' -- 'src/*.tsx' | wc -l
    1102
$ git grep -oh 'dark:[a-z0-9/\\[\\]#.-]*' -- 'src/*.tsx' | wc -l
       0</div>
<h3>🆕 Ở Tailwind 4</h3>
<div class="out">$ npx @tailwindcss/cli -i mac-dinh.css -o o1.css 2&gt;&amp;1 | tail -1; grep -B1 -A2 'dark\\\\:text-white {' o1.css
Done in 25ms
  @media (prefers-color-scheme: dark) {
    .dark\\:text-white {
      color: var(--color-white);
    }
$ npx @tailwindcss/cli -i lop.css -o o2.css 2&gt;&amp;1 | tail -1; grep -A1 'dark\\\\:text-white:' o2.css
Done in 24ms
  .dark\\:text-white:where(.dark, .dark *) {
    color: var(--color-white);</div>
<p>Mặc định là <code>prefers-color-scheme</code>; kiểu class là một dòng <code>@custom-variant</code>, biên dịch bằng <code>:where()</code> — <strong>0,1,0</strong>, giống chiến lược <code>selector</code> đo ra màu đỏ ở trên. Di trú từ <code>darkMode: 'class'</code> vì thế lấy đi một bậc độ đặc hiệu của MỌI luật <code>dark:</code>. Bạn cũng tự chọn tên biến thể, nên <code>@custom-variant notes-dark (…)</code> làm cú tách không gian tên hiện rõ ra.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3: tailwind.config.js { darkMode: 'class' } · then try ['selector', '.dark'] --&gt;
&lt;html class="dark"&gt;
  &lt;link rel="stylesheet" href="out.css"&gt;&lt;style&gt;.note { color: rgb(220 38 38); }&lt;/style&gt;
  &lt;p class="note dark:text-white"&gt;which colour?&lt;/p&gt;
  &lt;div data-notes-theme="brown"&gt;&lt;div class="bg-amber-100 dark:bg-slate-900"&gt;Notes in BROWN&lt;/div&gt;&lt;/div&gt;
&lt;/html&gt;
&lt;!-- rồi đổi &lt;html class="dark"&gt; thành &lt;html class="theme-dark"&gt; và xem lại --&gt;</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-3-dark-mode" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.3 — Dark mode: biến dark: và bật/tắt không nháy</span><span class="lc-sub">Dựng chính cái công tắc trong một ứng dụng thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-13-4-theme-css-variables" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js · 13.4 — Theme bằng CSS variables (và bẫy đặt tên)</span><span class="lc-sub">Cách làm không cần biến thể dark: nào</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-5-bien-the-tuy-y" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.5 — Biến thể tuỳ ý</span><span class="lc-sub">Bài sau: cửa thoát và các biến thể hiện đại</span></span></a>

<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> điện thoại tự sang chế độ tối lúc đêm (<code>prefers-color-scheme</code>); trang chỉ làm nửa số kiểu <code>dark:</code> sẽ ra chữ tối trên nền tối — trưa đọc được, 11 giờ đêm thì không.</li><li><strong>Nếu… thì sao:</strong> ai đó lại đặt <code>.dark</code> lên <code>&lt;html&gt;</code>? 187 lượt <code>dark:</code> đang chết trong 56 tệp thức dậy cùng lúc — sự cố 02/07 lặp lại, rộng hơn.</li><li><strong>Góc kẻ xấu:</strong> chữ bị một theme giấu đi — trắng trên thẻ trắng, đen trên đen. Trang lừa giấu phí và điều khoản kiểu này, trang rác giấu từ khoá, có trang giấu cả lời dặn nhắm vào trợ lý AI đọc trang ("prompt injection"). Bấm Ctrl/⌘ + A: vùng chọn làm lộ chữ ẩn; đổi theme rồi xem lại. Làm web thì soát tương phản ở CẢ HAI theme (Chương 9).</li><li><strong>Liên quan:</strong> nút chuyển tối không nháy — Next.js 13.3; theme bằng biến CSS — Next.js 13.4.</li></ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>darkMode: 'media'</code></span><span class="v">Theo OS qua <code>prefers-color-scheme</code>; không có trạng thái DOM nên UI không ghi đè được.</span></div>
  <div class="kv"><span class="k"><code>darkMode: 'class'</code></span><span class="v">Biên dịch thành <code>:is(.dark *)</code> — khớp con cháu của <code>.dark</code>, độ đặc hiệu <code>0,2,0</code>.</span></div>
  <div class="kv"><span class="k"><code>['selector', '.x']</code></span><span class="v"><code>:where(.x, .x *)</code> — khớp cả chính thẻ đó, và thêm <em>0</em> độ đặc hiệu (<code>0,1,0</code>).</span></div>
  <div class="kv"><span class="k">Blast radius</span><span class="v">Bán kính nổ — một tổ tiên <code>.dark</code> ở trên cao kích hoạt mọi tiện ích <code>dark:</code> bên dưới.</span></div>
  <div class="kv"><span class="k">Namespace separation</span><span class="v">Tách không gian tên — bản vá: đặt tên theme toàn cục là <code>theme-dark</code> và để dành <code>.dark</code> cho vỏ Notes.</span></div>
  <div class="kv"><span class="k">Dead styles</span><span class="v">Kiểu chết — 64 tiện ích <code>dark:</code> ngoài Notes không bao giờ kích hoạt; vô hại giờ, là bẫy nếu <code>.dark</code> leo lên lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba chiến lược <code>darkMode</code> khác nhau về cò bật và về độ đặc hiệu — <code>:is()</code> đạt <code>0,2,0</code>, <code>:where()</code> không đạt gì.</li><li><code>'class'</code> biên dịch thành phép thử tổ tiên không giới hạn phạm vi, nên <code>.dark</code> trên <code>&lt;html&gt;</code> bật mọi tiện ích dark cùng lúc — sự cố 02/07/2026.</li><li>Bản vá là vá TÊN: theme toàn cục là <code>theme-dark</code>, <code>.dark</code> để dành cho Notes — không đổi config.</li><li>Phép đo cho thấy tuân thủ 83,0% (14/11/2026; trước đó 91,9%), với 187 tiện ích <code>dark:</code> chết nên được chuyển hoặc xoá.</li><li>Một phép đo trả về 0 đáng nghi hơn một con số bất ngờ — giữ một mốc so sánh.</li></ul>

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
${G02_5}
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
<p><strong>Trap — reaching for an arbitrary variant when a component would be better.</strong> <code>[&amp;&gt;div&gt;span:nth-child(2)]:text-red-500</code> is legal, generated correctly, and unreadable. Arbitrary variants are for reaching into markup you do not control; when you <em>do</em> control the markup, put the class on the element directly. The syntax existing does not make it the right answer — a selector you cannot read at a glance has moved complexity rather than removing it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Arbitrary variants make the class attribute selector-complete by letting <code>&amp;</code> stand for the element, and the modern named variants — <code>data-[]</code>, <code>aria-*</code>, <code>has-[]</code>, <code>motion-reduce</code> — each replace a chunk of JavaScript with a selector, with <code>aria-*</code> being the one that makes the convenient path and the accessible path the same path.</p>
</div>

<h3>🔬 Measured: the real output, and one accordion in Chromium (Tailwind 3.4.19)</h3>
<div class="out">$ grep -E '^[.@]|^  \\.' out.css
.has-\\[img\\]\\:p-0:has(img) {
.aria-expanded\\:rotate-180[aria-expanded="true"] {
.data-\\[state\\=open\\]\\:block[data-state="open"] {
@supports (display:grid) {
  .supports-\\[display\\:grid\\]\\:grid {
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\\:transition-none {
@media print {
  .print\\:hidden {
.\\[\\&amp;\\&gt;svg\\]\\:h-4&gt;svg {
.\\[\\&amp;_p\\]\\:mt-2 p {</div>
<div class="out">before click: aria-expanded=false  panel display=none
after click : aria-expanded=true   panel display=block
arrow 1  aria-expanded:rotate-180 (on the span)        transform: none
arrow 2  group-aria-expanded:rotate-180 (+ group on button)  transform: matrix(-1, 0, 0, -1, 0, 0)
card, text only    has-[img]:p-0  padding: 24px
card with &lt;img&gt;    has-[img]:p-0  padding: 0px
[&amp;&gt;svg]:h-4        svg height: 16px</div>
<p><strong>Correction (measured 14/11/2026).</strong> "The arrow can only rotate if the ARIA attribute is set" is true — but the attribute is tested on the <em>same element</em> that carries the class (<code>.x[aria-expanded="true"]</code>). A chevron inside a button never turns with <code>aria-expanded:</code>; put <code>group</code> on the button and <code>group-aria-expanded:</code> on the chevron. The structural gain is unchanged: forget the attribute and the bug is loud.</p>
<p>In this site's code (14/11/2026):</p>
<div class="out">$ for v in 'data-\\[' 'aria-[a-z]+:' 'has-\\[' 'group-has' '\\[&amp;' 'motion-reduce:' 'motion-safe:' 'print:' 'supports-'; do printf "%-16s %5d\\n" "$v" "$(git grep -ohE "(^|[\\"' \\&#96;{])$v" -- 'src/*.tsx' | wc -l)"; done
data-\\[             12
aria-[a-z]+:         0
has-\\[               0
group-has            0
\\[&amp;                274
motion-reduce:      23
motion-safe:         2
print:              11
supports-            0
$ git grep -ohE "(^|[\\"' \\&#96;{])animate-[a-z-]+" -- 'src/*.tsx' | wc -l
     876
$ sed -n '/animation: {/,/},/p' tailwind.config.ts | grep -vE 'animation: [{]' | grep -oE "^ +['\\"]?[a-z0-9-]+['\\"]?:" | tr -d " '\\":" | tr '\\n' ' '
fade-in slide-up slide-down float glow pulse-slow aurora-drift-slow aurora-drift-slower shimmer-sweep caret-blink scroll-cue-pulse reel-spin projector-pulse 
$ git grep -ohE "(^|[\\"' \\&#96;{])motion-reduce:[a-z-]+" -- 'src/*.tsx' | sed -E 's/^[^m]//' | sort | uniq -c | sort -rn
   9 motion-reduce:animate-none
   8 motion-reduce:transition-none
   3 motion-reduce:transform-none
   2 motion-reduce:group-hover
   1 motion-reduce:hover</div>
<p><code>[&amp;…]</code> is used 274 times, <code>aria-*:</code> not at all, and 876 <code>animate-*</code> uses face only 23 <code>motion-reduce:</code> ones — 13 custom animations, most of them looping.</p>
<h3>🆕 In Tailwind 4</h3>
<div class="out">@layer utilities {
  .has-\\[img\\]\\:p-0:has(:is(img)) {
  .aria-expanded\\:rotate-180[aria-expanded="true"] {
  .data-open\\:flex[data-open] {
  .data-\\[state\\=open\\]\\:block[data-state="open"] {
  @supports (display:grid) {
    .supports-\\[display\\:grid\\]\\:grid {
  @media (prefers-reduced-motion: reduce) {
    .motion-reduce\\:transition-none {
  @media print {
    .print\\:hidden {
  .\\[\\&amp;_p\\]\\:mt-2 p {
  .\\[\\&amp;\\&gt;svg\\]\\:h-4 &gt; svg {</div>
<p><code>has-[img]</code> becomes <code>:has(:is(img))</code>; the new shorthand <code>data-open:</code> means <code>[data-open]</code> (attribute present). The <code>&amp;</code>/<code>_</code> rules and the same-element <code>aria-*</code> test are unchanged.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 or 4. Click the button, then read both arrows' transform in DevTools --&gt;
&lt;button aria-expanded="false" class="group flex items-center gap-3"
  onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')"&gt;
  FAQ
  &lt;span class="inline-block aria-expanded:rotate-180"&gt;▼&lt;/span&gt;        &lt;!-- never turns: tests the span --&gt;
  &lt;span class="inline-block group-aria-expanded:rotate-180"&gt;▼&lt;/span&gt;  &lt;!-- turns: tests the button --&gt;
&lt;/button&gt;</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-4-a11y" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.4 — Accessible components: semantic HTML, keyboard, ARIA, axe</span><span class="lc-sub">Where the ARIA attributes that aria-* hooks into are set correctly</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-6-quiz" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.6 — Chapter 2 quiz</span><span class="lc-sub">Check the five shapes before Chapter 3</span></span></a>

<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> FAQ accordions on your phone (<code>data-state</code>), icons from a library sized with <code>[&amp;&gt;svg]:h-4</code>, the chat bubble that <code>print:hidden</code> removes when you print a receipt, the "reduce motion" switch in a classmate's phone settings.</li><li><strong>What if…</strong> the arrow trap ships? Sighted users see a dead arrow, while screen-reader users still hear "expanded" — the bug is loud, which is exactly the point of <code>aria-*</code>.</li><li><strong>The attacker's view (measured):</strong> if a class comes from user data — a profile "theme" field fed into <code>className</code> — someone types <code>fixed inset-0 z-50 opacity-0</code>, classes that already exist in the build, and an invisible layer covers the page. In Chromium, <code>document.elementFromPoint</code> at the centre of the "download" button returned <code>#bio</code> (opacity 0): the click lands on the attacker's link. Never put user input into <code>className</code>; map it through a fixed list (Chapter 4, lesson 10.5). The DevTools element picker reveals any invisible layer.</li><li><strong>Related:</strong> accessible components and ARIA — React 8.4.</li></ul>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Arbitrary variant</span><span class="v"><code>[&amp;&gt;svg]:h-4</code> — write any selector inline; <code>&amp;</code> is the element, <code>_</code> is a space.</span></div>
  <div class="kv"><span class="k"><code>data-[]</code></span><span class="v"><code>data-[state=open]:block</code> — moves conditional class logic out of JS into the selector; headless libs set these.</span></div>
  <div class="kv"><span class="k"><code>aria-*</code></span><span class="v"><code>aria-expanded:rotate-180</code> — drives the visual state from the accessibility state so they cannot drift.</span></div>
  <div class="kv"><span class="k"><code>has-[]</code></span><span class="v"><code>:has(img)</code> — the parent selector CSS never had; style an element by what it contains.</span></div>
  <div class="kv"><span class="k"><code>motion-reduce</code></span><span class="v"><code>@media (prefers-reduced-motion: reduce)</code> — disable looping/large-area animation for users who need it.</span></div>
  <div class="kv"><span class="k"><code>print:</code> / <code>supports-[]</code></span><span class="v"><code>@media print</code> and <code>@supports</code> feature detection, inline in the class attribute.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Arbitrary variants make the class attribute selector-complete — <code>&amp;</code> is the element, <code>_</code> stands for a space.</li><li>The modern named variants each replace a chunk of JavaScript: <code>data-[]</code>, <code>aria-*</code>, <code>has-[]</code>, <code>motion-reduce</code>.</li><li>Prefer <code>aria-*</code> over <code>data-*</code> when a real ARIA attribute exists — it makes the convenient path the accessible one.</li><li><code>has-[]</code> (<code>:has()</code>) is powerful but newest — use it for enhancement, not load-bearing structure.</li><li>Do not reach for an unreadable arbitrary selector when you control the markup — put the class on the element directly.</li></ul>

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

<h3>🔬 Đo thật: đầu ra thật, và một mục hỏi đáp trong Chromium (Tailwind 3.4.19)</h3>
<div class="out">$ grep -E '^[.@]|^  \\.' out.css
.has-\\[img\\]\\:p-0:has(img) {
.aria-expanded\\:rotate-180[aria-expanded="true"] {
.data-\\[state\\=open\\]\\:block[data-state="open"] {
@supports (display:grid) {
  .supports-\\[display\\:grid\\]\\:grid {
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\\:transition-none {
@media print {
  .print\\:hidden {
.\\[\\&amp;\\&gt;svg\\]\\:h-4&gt;svg {
.\\[\\&amp;_p\\]\\:mt-2 p {</div>
<div class="out">truoc khi bam: aria-expanded=false  panel display=none
sau khi bam  : aria-expanded=true   panel display=block
arrow 1  aria-expanded:rotate-180 (on the span)        transform: none
arrow 2  group-aria-expanded:rotate-180 (+ group on button)  transform: matrix(-1, 0, 0, -1, 0, 0)
card, text only    has-[img]:p-0  padding: 24px
card with &lt;img&gt;    has-[img]:p-0  padding: 0px
[&amp;&gt;svg]:h-4        svg height: 16px</div>
<p><strong>Sửa (đo 14/11/2026).</strong> "Mũi tên CHỈ xoay được nếu thuộc tính ARIA được đặt đúng" là đúng — nhưng thuộc tính được hỏi trên <em>CHÍNH thẻ</em> mang lớp (<code>.x[aria-expanded="true"]</code>). Mũi tên nằm trong nút sẽ không bao giờ xoay với <code>aria-expanded:</code>; đặt <code>group</code> lên nút và <code>group-aria-expanded:</code> lên mũi tên. Cái lợi về cấu trúc vẫn nguyên: quên thuộc tính thì bọ hiện ra ỒN ÀO.</p>
<p>Trên mã của trang này (14/11/2026):</p>
<div class="out">$ for v in 'data-\\[' 'aria-[a-z]+:' 'has-\\[' 'group-has' '\\[&amp;' 'motion-reduce:' 'motion-safe:' 'print:' 'supports-'; do printf "%-16s %5d\\n" "$v" "$(git grep -ohE "(^|[\\"' \\&#96;{])$v" -- 'src/*.tsx' | wc -l)"; done
data-\\[             12
aria-[a-z]+:         0
has-\\[               0
group-has            0
\\[&amp;                274
motion-reduce:      23
motion-safe:         2
print:              11
supports-            0
$ git grep -ohE "(^|[\\"' \\&#96;{])animate-[a-z-]+" -- 'src/*.tsx' | wc -l
     876
$ sed -n '/animation: {/,/},/p' tailwind.config.ts | grep -vE 'animation: [{]' | grep -oE "^ +['\\"]?[a-z0-9-]+['\\"]?:" | tr -d " '\\":" | tr '\\n' ' '
fade-in slide-up slide-down float glow pulse-slow aurora-drift-slow aurora-drift-slower shimmer-sweep caret-blink scroll-cue-pulse reel-spin projector-pulse 
$ git grep -ohE "(^|[\\"' \\&#96;{])motion-reduce:[a-z-]+" -- 'src/*.tsx' | sed -E 's/^[^m]//' | sort | uniq -c | sort -rn
   9 motion-reduce:animate-none
   8 motion-reduce:transition-none
   3 motion-reduce:transform-none
   2 motion-reduce:group-hover
   1 motion-reduce:hover</div>
<p><code>[&amp;…]</code> dùng 274 lần, <code>aria-*:</code> chưa dùng lần nào, và 876 lượt <code>animate-*</code> chỉ có 23 lượt <code>motion-reduce:</code> đi kèm — 13 hoạt ảnh tuỳ biến, phần lớn lặp vô hạn.</p>
<h3>🆕 Ở Tailwind 4</h3>
<div class="out">@layer utilities {
  .has-\\[img\\]\\:p-0:has(:is(img)) {
  .aria-expanded\\:rotate-180[aria-expanded="true"] {
  .data-open\\:flex[data-open] {
  .data-\\[state\\=open\\]\\:block[data-state="open"] {
  @supports (display:grid) {
    .supports-\\[display\\:grid\\]\\:grid {
  @media (prefers-reduced-motion: reduce) {
    .motion-reduce\\:transition-none {
  @media print {
    .print\\:hidden {
  .\\[\\&amp;_p\\]\\:mt-2 p {
  .\\[\\&amp;\\&gt;svg\\]\\:h-4 &gt; svg {</div>
<p><code>has-[img]</code> thành <code>:has(:is(img))</code>; cách viết tắt mới <code>data-open:</code> nghĩa là <code>[data-open]</code> (thuộc tính có mặt). Luật <code>&amp;</code>/<code>_</code> và phép thử <code>aria-*</code> trên chính thẻ không đổi.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-html">&lt;!-- Tailwind 3 hoặc 4. Bấm nút rồi đọc transform của hai mũi tên trong DevTools --&gt;
&lt;button aria-expanded="false" class="group flex items-center gap-3"
  onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')"&gt;
  FAQ
  &lt;span class="inline-block aria-expanded:rotate-180"&gt;▼&lt;/span&gt;        &lt;!-- never turns: tests the span --&gt;
  &lt;span class="inline-block group-aria-expanded:rotate-180"&gt;▼&lt;/span&gt;  &lt;!-- turns: tests the button --&gt;
&lt;/button&gt;</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-8-4-a11y" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 8.4 — Component dễ tiếp cận: HTML đúng nghĩa, bàn phím, ARIA</span><span class="lc-sub">Nơi thuộc tính ARIA mà aria-* móc vào được đặt đúng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-6-quiz" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.6 — Kiểm tra Chương 2</span><span class="lc-sub">Soát năm hình dạng trước khi sang Chương 3</span></span></a>

<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> mục hỏi đáp trên điện thoại (<code>data-state</code>), icon từ thư viện chỉnh cỡ bằng <code>[&amp;&gt;svg]:h-4</code>, bong bóng chat bị <code>print:hidden</code> gỡ khi bạn in hoá đơn, công tắc "giảm chuyển động" trong cài đặt điện thoại của bạn cùng lớp.</li><li><strong>Nếu… thì sao:</strong> cái bẫy mũi tên lọt lên bản thật? Người nhìn thấy một mũi tên chết, còn người dùng trình đọc màn hình vẫn nghe "đã mở" — bọ hiện ra ỒN ÀO, đúng là cái lợi của <code>aria-*</code>.</li><li><strong>Góc kẻ xấu (đo thật):</strong> nếu lớp CSS lấy từ dữ liệu người dùng — ô "màu hồ sơ" đổ thẳng vào <code>className</code> — ai đó gõ <code>fixed inset-0 z-50 opacity-0</code>, toàn lớp có sẵn trong bản dựng, và một lớp vô hình phủ kín trang. Trong Chromium, <code>document.elementFromPoint</code> ở giữa nút "Tải bài giảng" trả về <code>#bio</code> (opacity 0): cú bấm rơi vào liên kết của kẻ xấu. Đừng bao giờ đưa chữ người dùng vào <code>className</code>; ánh xạ qua một danh sách cố định (Chương 4, bài 10.5). Công cụ chọn thẻ của DevTools làm lộ mọi lớp vô hình.</li><li><strong>Liên quan:</strong> component dễ tiếp cận và ARIA — React 8.4.</li></ul>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Arbitrary variant</span><span class="v">Biến thể tuỳ ý — <code>[&amp;&gt;svg]:h-4</code>, viết selector bất kỳ ngay dòng; <code>&amp;</code> là thẻ, <code>_</code> là khoảng trắng.</span></div>
  <div class="kv"><span class="k"><code>data-[]</code></span><span class="v"><code>data-[state=open]:block</code> — chuyển logic lớp điều kiện khỏi JS vào selector; thư viện headless tự đặt các thuộc tính này.</span></div>
  <div class="kv"><span class="k"><code>aria-*</code></span><span class="v"><code>aria-expanded:rotate-180</code> — lái trạng thái thị giác từ trạng thái tiếp cận để chúng không lệch nhau.</span></div>
  <div class="kv"><span class="k"><code>has-[]</code></span><span class="v"><code>:has(img)</code> — selector cha mà CSS chưa từng có; tạo kiểu một thẻ theo thứ bên trong nó.</span></div>
  <div class="kv"><span class="k"><code>motion-reduce</code></span><span class="v"><code>@media (prefers-reduced-motion: reduce)</code> — tắt animation lặp/diện lớn cho người cần.</span></div>
  <div class="kv"><span class="k"><code>print:</code> / <code>supports-[]</code></span><span class="v"><code>@media print</code> và dò tính năng <code>@supports</code>, ngay trong thuộc tính lớp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Biến thể tuỳ ý làm thuộc tính lớp đầy đủ về selector — <code>&amp;</code> là thẻ, <code>_</code> thay cho khoảng trắng.</li><li>Các biến thể hiện đại có tên mỗi cái thay một mảng JavaScript: <code>data-[]</code>, <code>aria-*</code>, <code>has-[]</code>, <code>motion-reduce</code>.</li><li>Ưu tiên <code>aria-*</code> hơn <code>data-*</code> khi có thuộc tính ARIA thật — nó biến đường tiện lợi thành đường tiếp cận.</li><li><code>has-[]</code> (<code>:has()</code>) mạnh nhưng mới nhất — dùng để tăng cường, không làm cấu trúc chịu lực.</li><li>Đừng với tới một selector tuỳ ý khó đọc khi bạn kiểm soát markup — đặt lớp thẳng lên thẻ.</li></ul>

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
