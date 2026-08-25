const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 7: @layer, và cơ chế THẬT.
 * Số đo: Tailwind 3.4 XOÁ SẠCH @layer khỏi đầu ra — nó là chỉ thị DI DỜI
 * lúc dựng, không phải cascade layer của CSS. Đo bằng CLI thật + Chromium thật.
 * Bài 7.1 SỬA LẠI cách nói lỏng lẻo ở Chương 3.
 */

export default {
  title: 'Chapter 7 — @layer, and the mechanism it actually is|||Chương 7 — @layer, và cơ chế THẬT của nó',
  slug: 'tw-ch7-layer',
  description: 'Sáu bài về chỗ CSS viết tay THUỘC VỀ. Phát hiện trung tâm gây bất ngờ: Tailwind 3 XOÁ `@layer` khỏi đầu ra hoàn toàn — nó KHÔNG phải cascade layer của CSS mà là một chỉ thị DI DỜI lúc dựng. Bài 7.1 sửa lại một câu tôi đã nói lỏng ở Chương 3.',
  sortOrder: 8,
  lessons: [

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Tailwind strips @layer, and what that changes|||7.1 — Tailwind XOÁ @layer, và điều đó thay đổi gì',
      slug: 'tw-7-1-strip-layer',
      type: 'VIDEO',
      description: 'Dựng một file có `@layer components` và grep đầu ra: KHÔNG có một at-rule `@layer` nào. Tailwind 3 dùng nó như chỉ thị DI DỜI rồi vứt đi. Điều đó nghĩa là quy tắc không-layer của bạn thắng hay thua tuỳ VỊ TRÍ TRONG FILE — và tôi đã nói chuyện này KHÔNG chính xác ở Chương 3.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Tailwind strips @layer, and what that changes</h2>
<p class="lead">Chapters 3, 5 and 6 all referred forward to "the 88% of this repo's CSS sitting outside any layer" and said it beats utilities <em>structurally</em>. Measuring it properly for this chapter shows the outcome is right and my stated mechanism was not. This lesson gets it right and corrects the earlier phrasing.</p>

<h3>What I assumed</h3>
<p>CSS has a real cascade-layer feature, and its rule is unambiguous: <strong>unlayered styles beat layered styles</strong>, regardless of specificity. Verified in Chromium rather than taken on trust:</p>

<pre><code class="language-html">&lt;style&gt;
@layer base, components, utilities;
@layer utilities { .p-4 { padding: 1rem; } }
.card { padding: 99px; }        /* same 0,1,0 specificity, no layer */
&lt;/style&gt;
&lt;div class="card p-4"&gt;x&lt;/div&gt;
</code></pre>

<div class="out">$ node probe.mjs
computed padding = 99px
=> UNLAYERED (.card) WON — layered .p-4 lost despite equal specificity
</div>

<p>That is genuine CSS behaviour and worth knowing. From it I inferred that this repository's unlayered rules beat Tailwind's utilities for the same reason. That inference had one unchecked step.</p>

<h3>What the build actually emits</h3>
<pre><code class="language-css">/* input */
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components { .btn { color: red; } }
.unlayered { color: blue; }
</code></pre>

<pre><code class="language-bash">$ npx tailwindcss -i in3.css -o out3.css
$ grep -c '@layer' out3.css
</code></pre>

<div class="out">0     &lt;- Tailwind XOA SACH. Dau ra KHONG co at-rule @layer nao.

.btn        dong 557
.p-4        dong 561
.unlayered  dong 565
</div>

<p><strong>Zero.</strong> Tailwind 3.4's <code>@layer</code> is not the CSS at-rule that shares its name. It is a build-time instruction meaning "move this rule into the block that <code>@tailwind components</code> generates", and once the move is done the directive is discarded. The output is flat CSS with no layers at all — so the cascade-layer rule measured above <em>never applies to Tailwind 3 output</em>.</p>

<div class="callout warn">
<p><strong>The correction.</strong> In lesson 3.5 I wrote that a hand-written rule outside <code>@layer</code> "beats utilities structurally". That is the right outcome for this repository and the wrong reason. There is no structural layer relationship in the output, because there are no layers. The actual mechanism is plain source order — which matters, because it means the outcome is <em>positional</em> and therefore changeable.</p>
</div>

<h3>The real rule, measured three ways</h3>
<p>Same rule, three placements, and the emitted line number is the whole answer:</p>

<div class="out">A. .unlayered viet TRUOC cac chi thi @tailwind
   .unlayered  dong   1
   .p-4        dong 561      => .p-4 THANG (dung sau)

B. .unlayered viet SAU cac chi thi
   .p-4        dong 557
   .unlayered  dong 561      => .unlayered THANG

C. .unlayered dat trong @layer utilities, viet TRUOC
   .p-4        dong 557
   .unlayered  dong 561      => .unlayered THANG
</div>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">unlayered CSS</span><span class="lz-nsub">stays exactly where you wrote it</span></span>
<span class="lz-nbody">Compare A and B: moving the same rule from before the directives to after them flips which one wins. Unlayered CSS is not relocated at all — its position in your source file is its position in the output.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>@layer</code>-wrapped CSS</span><span class="lz-nsub">gets MOVED to the matching block</span></span>
<span class="lz-nbody">Compare A and C: identical placement in the source, opposite outcomes. <code>@layer utilities</code> relocated the rule into the utilities block, so where you typed it became irrelevant. That relocation is the entire feature.</span>
</div>
</div>

<h3>Why the conclusion still holds for this repository</h3>
<pre><code class="language-bash">$ grep -n '^@tailwind' src/app/globals.css
</code></pre>

<div class="out">1:@tailwind base;
2:@tailwind components;
3:@tailwind utilities;

=> 4.459 dong con lai deu nam SAU chi thi utilities
</div>

<p>The directives are the first three lines, so every one of the ~630 unlayered rules is emitted after every utility. They do beat utilities — by source order, exactly as case B measured. The 88% figure and its consequence stand; only the explanation needed fixing.</p>

<div class="callout ok">
<p><strong>Why the distinction is worth the correction rather than a shrug.</strong> "Structural" implies unfixable-without-restructuring. "Source order" implies a one-line move. If the problem were cascade layers, the fix would be adopting layers throughout. Because it is position, moving the three <code>@tailwind</code> directives below the custom CSS would invert all ~630 relationships at once — which is a real option, and one you cannot see if you believe the wrong mechanism.</p>
</div>

<h3>What <code>@layer</code> is genuinely for in Tailwind 3</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">placing custom CSS in the right band</span><span class="lz-lnote">a component class in <code>@layer components</code> lands before utilities, so utilities can override it — the ordering you almost always want, and one you get without thinking about file position</span></div>
<div class="lz-layer"><span class="lz-lname">making custom rules removable</span><span class="lz-lnote">rules inside a Tailwind layer participate in the same tree-shaking as utilities: unused ones can be dropped. Unlayered CSS always ships</span></div>
<div class="lz-layer"><span class="lz-lname">position-independence</span><span class="lz-lnote">the real benefit. A layered rule behaves the same wherever it sits in a 4,462-line file, which stops a reordering or a file split from silently changing which styles win</span></div>
<div class="lz-layer"><span class="lz-lname">NOT the CSS cascade-layer feature</span><span class="lz-lnote">despite the shared spelling. Tailwind 4 does emit real <code>@layer</code>; on 3.4 the two are unrelated mechanisms with one name</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — reasoning about Tailwind 3 output using CSS cascade-layer rules.</strong> Every article about <code>@layer</code> describes the CSS feature, which is real, well-specified and does not apply here. Reading the output once settles it: <code>grep -c '@layer' out.css</code> returns 0 on Tailwind 3 and non-zero on Tailwind 4. That single command tells you which set of rules governs your project.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Tailwind 3's <code>@layer</code> is a build-time relocation instruction that is stripped from the output, so unlayered CSS keeps the position you gave it and wins or loses purely on source order — which is why this repository's ~630 unlayered rules beat every utility, and why the fix is positional rather than structural as I put it in Chapter 3.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Functions and directives: @layer</span><span class="lc-sub">tailwindcss.com/docs/functions-and-directives#layer — states that the directive tells Tailwind which bucket a rule belongs to. Read alongside the output and the "not the CSS feature" point becomes obvious.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — @layer (the CSS feature)</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@layer — the real cascade-layer rules, including unlayered-beats-layered as verified in Chromium above. Applies to Tailwind 4, not 3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind 4 — cascade layers in the output</span><span class="lc-sub">tailwindcss.com/blog — the version that emits genuine <code>@layer</code>, which changes the reasoning in this lesson entirely and is worth checking before upgrading.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — the cascade in full</span><span class="lc-sub">/courses/web-foundations/learn${REF} — origin, layer, specificity and order as one ordered algorithm, which is the frame that makes "which of these actually applies" answerable.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Tailwind XOÁ @layer, và điều đó thay đổi gì</h2>
<p class="lead">Chương 3, 5 và 6 đều trỏ tới trước về "88% CSS của kho này nằm ngoài mọi layer" và nói rằng nó thắng tiện ích một cách <em>CẤU TRÚC</em>. Đo cho tử tế ở chương này cho thấy KẾT QUẢ thì đúng còn CƠ CHẾ tôi nêu thì không. Bài này nói cho đúng và SỬA LẠI cách diễn đạt trước đó.</p>

<h3>Cái tôi đã GIẢ ĐỊNH</h3>
<p>CSS CÓ một tính năng cascade layer thật, và luật của nó rõ ràng: <strong>kiểu dáng KHÔNG-layer THẮNG kiểu dáng CÓ-layer</strong>, bất kể độ đặc hiệu. Xác minh trong Chromium chứ không tin suông:</p>

<pre><code class="language-html">&lt;style&gt;
@layer base, components, utilities;
@layer utilities { .p-4 { padding: 1rem; } }
.card { padding: 99px; }        /* cung do dac hieu 0,1,0, khong layer */
&lt;/style&gt;
&lt;div class="card p-4"&gt;x&lt;/div&gt;
</code></pre>

<div class="out">$ node probe.mjs
computed padding = 99px
=> KHONG-LAYER (.card) THANG — .p-4 co layer THUA du cung do dac hieu
</div>

<p>Đó là hành vi CSS THẬT và đáng biết. Từ đó tôi SUY RA rằng các quy tắc không-layer của kho này thắng tiện ích của Tailwind vì CÙNG lý do. Cú suy ra ấy có MỘT bước chưa được kiểm.</p>

<h3>Bản dựng THẬT SỰ phát sinh ra gì</h3>
<pre><code class="language-css">/* dau vao */
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components { .btn { color: red; } }
.unlayered { color: blue; }
</code></pre>

<pre><code class="language-bash">$ npx tailwindcss -i in3.css -o out3.css
$ grep -c '@layer' out3.css
</code></pre>

<div class="out">0     &lt;- Tailwind XOA SACH. Dau ra KHONG co at-rule @layer nao.

.btn        dong 557
.p-4        dong 561
.unlayered  dong 565
</div>

<p><strong>KHÔNG.</strong> <code>@layer</code> của Tailwind 3.4 KHÔNG PHẢI cái at-rule CSS trùng tên với nó. Nó là một CHỈ THỊ LÚC DỰNG nghĩa là "DI DỜI quy tắc này vào cái khối mà <code>@tailwind components</code> phát sinh", và một khi cú dời xong thì chỉ thị bị VỨT. Đầu ra là CSS PHẲNG không có layer nào — nên cái luật cascade-layer đo được bên trên <em>KHÔNG BAO GIỜ áp cho đầu ra Tailwind 3</em>.</p>

<div class="callout warn">
<p><strong>Cú SỬA.</strong> Ở bài 3.5 tôi viết rằng một quy tắc viết tay ngoài <code>@layer</code> "thắng tiện ích một cách CẤU TRÚC". Đó là KẾT QUẢ ĐÚNG cho kho này và LÝ DO SAI. KHÔNG có quan hệ layer cấu trúc nào trong đầu ra, vì KHÔNG có layer nào. Cơ chế THẬT là THỨ TỰ NGUỒN thuần tuý — và điều đó quan trọng, vì nó có nghĩa kết quả mang tính VỊ TRÍ và do đó ĐỔI ĐƯỢC.</p>
</div>

<h3>Luật THẬT, đo ba cách</h3>
<p>Cùng một quy tắc, ba vị trí đặt, và SỐ DÒNG phát sinh là toàn bộ câu trả lời:</p>

<div class="out">A. .unlayered viet TRUOC cac chi thi @tailwind
   .unlayered  dong   1
   .p-4        dong 561      => .p-4 THANG (dung sau)

B. .unlayered viet SAU cac chi thi
   .p-4        dong 557
   .unlayered  dong 561      => .unlayered THANG

C. .unlayered dat trong @layer utilities, viet TRUOC
   .p-4        dong 557
   .unlayered  dong 561      => .unlayered THANG
</div>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CSS KHÔNG-layer</span><span class="lz-nsub">nằm ĐÚNG chỗ bạn viết nó</span></span>
<span class="lz-nbody">So A với B: dời CÙNG một quy tắc từ trước các chỉ thị sang sau chúng thì LẬT NGƯỢC kẻ thắng. CSS không-layer KHÔNG hề bị di dời — vị trí của nó trong file nguồn CHÍNH LÀ vị trí trong đầu ra.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CSS bọc <code>@layer</code></span><span class="lz-nsub">bị DỜI tới khối tương ứng</span></span>
<span class="lz-nbody">So A với C: vị trí trong nguồn Y HỆT, kết quả NGƯỢC nhau. <code>@layer utilities</code> đã DI DỜI quy tắc vào khối utilities, nên chỗ bạn gõ nó trở nên VÔ NGHĨA. Cú di dời ấy CHÍNH LÀ toàn bộ tính năng.</span>
</div>
</div>

<h3>Vì sao kết luận VẪN ĐÚNG cho kho này</h3>
<pre><code class="language-bash">$ grep -n '^@tailwind' src/app/globals.css
</code></pre>

<div class="out">1:@tailwind base;
2:@tailwind components;
3:@tailwind utilities;

=> 4.459 dong con lai deu nam SAU chi thi utilities
</div>

<p>Các chỉ thị là BA DÒNG ĐẦU, nên MỌI cái trong ~630 quy tắc không-layer đều được phát sinh SAU mọi tiện ích. Chúng THẬT SỰ thắng tiện ích — bằng THỨ TỰ NGUỒN, đúng như ca B đã đo. Con số 88% và hệ quả của nó VẪN ĐỨNG; chỉ có LỜI GIẢI THÍCH là cần sửa.</p>

<div class="callout ok">
<p><strong>Vì sao sự phân biệt ấy đáng SỬA chứ không đáng nhún vai.</strong> "Cấu trúc" ngụ ý KHÔNG-vá-được-nếu-không-tái-cấu-trúc. "Thứ tự nguồn" ngụ ý một cú DỜI MỘT DÒNG. Nếu vấn đề là cascade layer thì cú vá sẽ là nhận layer trên toàn bộ. Vì nó là VỊ TRÍ, dời ba chỉ thị <code>@tailwind</code> xuống DƯỚI phần CSS tuỳ biến sẽ ĐẢO NGƯỢC cả ~630 quan hệ CÙNG LÚC — đó là một lựa chọn THẬT, và là cái bạn KHÔNG nhìn ra nếu tin vào cơ chế sai.</p>
</div>

<h3><code>@layer</code> THẬT SỰ để làm gì trong Tailwind 3</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đặt CSS tuỳ biến vào đúng DẢI</span><span class="lz-lnote">một lớp component trong <code>@layer components</code> rơi TRƯỚC tiện ích, nên tiện ích ĐÈ được nó — thứ tự bạn gần như luôn muốn, và có được mà không phải nghĩ về vị trí file</span></div>
<div class="lz-layer"><span class="lz-lname">làm quy tắc tuỳ biến GỠ ĐƯỢC</span><span class="lz-lnote">quy tắc bên trong một layer Tailwind THAM GIA cùng phép rung cây với tiện ích: cái không dùng có thể bị bỏ. CSS không-layer thì LUÔN đi theo</span></div>
<div class="lz-layer"><span class="lz-lname">ĐỘC LẬP VỊ TRÍ</span><span class="lz-lnote">lợi ích THẬT. Một quy tắc có layer hành xử GIỐNG NHAU dù nó nằm đâu trong một file 4.462 dòng, thứ ngăn một cú sắp xếp lại hay một cú chẻ file âm thầm đổi kiểu dáng nào thắng</span></div>
<div class="lz-layer"><span class="lz-lname">KHÔNG PHẢI tính năng cascade layer của CSS</span><span class="lz-lnote">dù viết giống hệt nhau. Tailwind 4 CÓ phát sinh <code>@layer</code> thật; trên 3.4 hai thứ là hai cơ chế KHÔNG liên quan trùng một cái tên</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — suy luận về đầu ra Tailwind 3 bằng luật cascade layer của CSS.</strong> MỌI bài viết về <code>@layer</code> đều mô tả TÍNH NĂNG CSS, thứ có thật, được đặc tả kỹ và KHÔNG áp dụng ở đây. Đọc đầu ra MỘT lần là dứt điểm: <code>grep -c '@layer' out.css</code> trả về 0 trên Tailwind 3 và khác 0 trên Tailwind 4. Một lệnh ấy cho bạn biết TẬP LUẬT nào chi phối dự án của bạn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>@layer</code> của Tailwind 3 là một chỉ thị DI DỜI lúc dựng và bị XOÁ khỏi đầu ra, nên CSS không-layer GIỮ NGUYÊN vị trí bạn cho nó và thắng hay thua thuần tuý bằng THỨ TỰ NGUỒN — đó là lý do ~630 quy tắc không-layer của kho này thắng mọi tiện ích, và là lý do cú vá mang tính VỊ TRÍ chứ không phải cấu trúc như tôi đã nói ở Chương 3.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Functions and directives: @layer</span><span class="lc-sub">tailwindcss.com/docs/functions-and-directives#layer — nói rằng chỉ thị ấy cho Tailwind biết một quy tắc thuộc GIỎ nào. Đọc song song với đầu ra thì điểm "không phải tính năng CSS" hiện ra rõ ràng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — @layer (tính năng CSS)</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@layer — các luật cascade layer THẬT, gồm cả không-layer-thắng-có-layer như đã xác minh trong Chromium bên trên. Áp cho Tailwind 4, không phải 3.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind 4 — cascade layer trong đầu ra</span><span class="lc-sub">tailwindcss.com/blog — phiên bản CÓ phát sinh <code>@layer</code> thật, thứ thay đổi HOÀN TOÀN lập luận trong bài này và đáng kiểm trước khi nâng cấp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — cascade đầy đủ</span><span class="lc-sub">/courses/web-foundations/learn${REF} — nguồn gốc, layer, độ đặc hiệu và thứ tự như MỘT thuật toán có thứ tự, khuôn khổ khiến câu "cái nào thật sự áp" trả lời được.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Which of the 620 actually depend on position|||7.2 — Trong 620 cái, cái nào THẬT SỰ phụ thuộc vị trí',
      slug: 'tw-7-2-phan-loai',
      type: 'VIDEO',
      description: 'Bài 7.1 nói cú vá mang tính VỊ TRÍ. Phân loại 620 selector cho thấy chỉ 139 cái là vậy — 358 cái là selector con cháu thắng tiện ích bằng ĐỘ ĐẶC HIỆU dù đặt ở đâu. Dời ba chỉ thị chỉ đổi được chưa tới một phần tư.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Which of the 620 actually depend on position</h2>
<p class="lead">Lesson 7.1 ended on an appealing idea: move the three <code>@tailwind</code> directives below the custom CSS and invert every relationship at once. Before acting on that, it is worth classifying what those rules are — because most of them would not move.</p>

<h3>The classification</h3>
<pre><code class="language-python">sels = re.findall(r'^\\s*([.#a-zA-Z\\[][^{}\\n]*)\\{', chunk, re.M)
# bucket by selector shape
</code></pre>

<div class="out">selector ngoai layer: 620

  descendant (long nhau)    358      .a .b / .a &gt; .b   -> do dac hieu >= 0,2,0
  single class              139      .a                -> do dac hieu    0,1,0
  pseudo state               92      .a:hover, ::after -> do dac hieu    0,2,0
  theme / :root              23
  element / other             8
</div>

<h3>What the split means</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">450 win on SPECIFICITY</span><span class="lz-nsub">358 descendant + 92 pseudo</span></span>
<span class="lz-nbody">These score <code>0,2,0</code> or higher against a utility's <code>0,1,0</code>. Specificity is compared before source order, so they beat utilities from anywhere in the file. Moving the directives changes nothing for them.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">139 win on POSITION</span><span class="lz-nsub">single class only</span></span>
<span class="lz-nbody">Tied at <code>0,1,0</code> with utilities, so the cascade falls through to source order — and they happen to be later. These are the only ones the directive move would affect, and it would flip all of them at once.</span>
</div>
</div>

<p>So the appealing one-line fix touches <strong>139 of 620</strong>, or 22%. That is not nothing, but it is a different proposition from "invert all ~630 relationships", and the difference is exactly the sort of thing an unclassified count hides.</p>

<div class="callout warn">
<p><strong>And flipping 139 relationships at once is not obviously an improvement.</strong> Each of those 139 rules currently wins. Some of them are <em>supposed</em> to win — a deliberate override that has been working for months. Moving the directives would silently reverse every one, and the ones that break would break in components nobody touched. A change with 139 blast radius and no per-rule review is how you turn one clear problem into many unclear ones.</p>
</div>

<h3>Reading the 358 as a different problem</h3>
<p>Descendant selectors beating utilities is not a layering issue at all — it is ordinary CSS specificity, and it is the thing utility CSS is least able to fight:</p>

<pre><code class="language-css">/* 0,2,0 — beats every single-class utility, always */
.rich-content h2 { font-size: 1.5rem; color: var(--text-primary); }
</code></pre>

<pre><code class="language-html">&lt;!-- text-3xl loses. Not to a layer — to specificity. --&gt;
&lt;div class="rich-content"&gt;&lt;h2 class="text-3xl"&gt;…&lt;/h2&gt;&lt;/div&gt;
</code></pre>

<p>This is by design here. <code>.rich-content</code> has <strong>135 rules</strong> styling HTML produced by the TipTap editor — markup with no classes on it, so descendant selectors are the only way to reach it. Chapter 5 measured the decision to hand-write these rather than adopt <code>@tailwindcss/typography</code>. Their specificity is not an accident; it is what makes them work.</p>

<div class="callout ok">
<p><strong>The rule that falls out.</strong> Descendant selectors are correct precisely where you cannot put a class on the element — editor output, markdown, a third-party widget. Everywhere else they are a specificity liability, because they beat utilities silently and there is no warning at the call site. The 358 here are mostly the legitimate case; a codebase where they are not would have a real problem.</p>
</div>

<h3>The honest options, ordered</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 · leave it, and know why</span><span class="lz-lnote">450 rules win legitimately on specificity; 139 win on position and are currently correct. Nothing is broken. The value of this measurement is knowing which is which when something does break</span></div>
<div class="lz-layer"><span class="lz-lname">2 · wrap NEW custom CSS in <code>@layer components</code></span><span class="lz-lnote">the only change that costs nothing. New rules become position-independent and utility-overridable from the start, and the existing 620 are untouched. Stops the count growing</span></div>
<div class="lz-layer"><span class="lz-lname">3 · migrate the 139 single-class rules deliberately</span><span class="lz-lnote">one at a time, each with a decision: should a utility be able to override this? Usually yes, in which case <code>@layer components</code> is right. This is reviewable work; the directive move is not</span></div>
<div class="lz-layer"><span class="lz-lname">4 · leave the 358 alone</span><span class="lz-lnote">they exist because the elements have no classes. Wrapping them in a layer would make utilities beat them, which is the opposite of what <code>.rich-content</code> needs — its whole job is styling markup that cannot carry utilities</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating a single count as a single problem.</strong> "620 rules outside a layer" reads like one issue with one fix. Classified, it is at least three: 358 legitimate descendant selectors that should stay, 139 position-dependent rules worth reviewing individually, and 92 pseudo-state rules that are fine. Any fix aimed at the aggregate would be wrong for most of it — and the aggregate is what a grep gives you unless you ask a second question.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Of 620 unlayered selectors only 139 actually depend on source order — the other 450 beat utilities on specificity from anywhere — so the one-line directive move from lesson 7.1 would flip 22% of them, all currently working, which makes wrapping <em>new</em> CSS in <code>@layer components</code> the only change here that costs nothing.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Specificity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity — the three-number tuple and the order in which the cascade consults specificity versus source position.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles to a layer</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles#adding-component-classes — the <code>@layer components</code> form that option 2 uses.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TipTap — the HTML the editor produces</span><span class="lc-sub">tiptap.dev — class-less semantic markup, which is why <code>.rich-content</code> needs 135 descendant rules and why those are the legitimate case.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 5 — the plugin decision behind those 135 rules</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — why this repo hand-wrote <code>.rich-content</code> instead of installing <code>@tailwindcss/typography</code>, and what that traded.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Trong 620 cái, cái nào THẬT SỰ phụ thuộc vị trí</h2>
<p class="lead">Bài 7.1 kết thúc bằng một ý HẤP DẪN: dời ba chỉ thị <code>@tailwind</code> xuống dưới phần CSS tuỳ biến và ĐẢO NGƯỢC mọi quan hệ cùng lúc. Trước khi hành động theo, đáng PHÂN LOẠI xem những quy tắc ấy LÀ GÌ — vì PHẦN LỚN chúng sẽ KHÔNG nhúc nhích.</p>

<h3>Phân loại</h3>
<pre><code class="language-python">sels = re.findall(r'^\\s*([.#a-zA-Z\\[][^{}\\n]*)\\{', chunk, re.M)
# gom nhom theo HINH DANG selector
</code></pre>

<div class="out">selector ngoai layer: 620

  descendant (long nhau)    358      .a .b / .a &gt; .b   -> do dac hieu >= 0,2,0
  single class              139      .a                -> do dac hieu    0,1,0
  pseudo state               92      .a:hover, ::after -> do dac hieu    0,2,0
  theme / :root              23
  element / other             8
</div>

<h3>Cú chẻ ấy nghĩa là gì</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">450 cái thắng nhờ ĐỘ ĐẶC HIỆU</span><span class="lz-nsub">358 con cháu + 92 lớp giả</span></span>
<span class="lz-nbody">Chúng đạt <code>0,2,0</code> trở lên đối chiếu <code>0,1,0</code> của một tiện ích. Độ đặc hiệu được so SÁNH TRƯỚC thứ tự nguồn, nên chúng thắng tiện ích từ BẤT KỲ ĐÂU trong file. Dời các chỉ thị KHÔNG đổi gì cho chúng.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">139 cái thắng nhờ VỊ TRÍ</span><span class="lz-nsub">chỉ các lớp đơn</span></span>
<span class="lz-nbody">HOÀ ở <code>0,1,0</code> với tiện ích, nên cascade rơi xuống THỨ TỰ NGUỒN — và chúng TÌNH CỜ đứng sau. Đây là những cái DUY NHẤT mà cú dời chỉ thị tác động tới, và nó sẽ LẬT hết chúng cùng lúc.</span>
</div>
</div>

<p>Nên cú vá một-dòng hấp dẫn ấy động tới <strong>139 trên 620</strong>, tức 22%. Đó không phải không có gì, nhưng nó là một đề xuất KHÁC HẲN "đảo ngược cả ~630 quan hệ", và khác biệt ấy chính xác là loại thứ mà một con số CHƯA PHÂN LOẠI che giấu.</p>

<div class="callout warn">
<p><strong>Và lật 139 quan hệ cùng lúc KHÔNG hiển nhiên là một cải thiện.</strong> MỖI cái trong 139 quy tắc ấy hiện đang THẮNG. Vài cái LẼ RA phải thắng — một cú đè CÓ CHỦ Ý đã chạy nhiều tháng. Dời các chỉ thị sẽ ÂM THẦM đảo ngược từng cái, và những cái vỡ sẽ vỡ trong những component không ai động vào. Một thay đổi bán kính nổ 139 mà KHÔNG review từng quy tắc là cách bạn biến MỘT vấn đề rõ ràng thành NHIỀU vấn đề mơ hồ.</p>
</div>

<h3>Đọc 358 cái như một vấn đề KHÁC</h3>
<p>Selector con cháu thắng tiện ích KHÔNG phải chuyện layer chút nào — nó là ĐỘ ĐẶC HIỆU CSS thông thường, và là thứ mà CSS tiện ích ÍT có khả năng chống lại nhất:</p>

<pre><code class="language-css">/* 0,2,0 — thang MOI tien ich lop-don, LUON LUON */
.rich-content h2 { font-size: 1.5rem; color: var(--text-primary); }
</code></pre>

<pre><code class="language-html">&lt;!-- text-3xl THUA. Khong phai thua mot layer — thua DO DAC HIEU. --&gt;
&lt;div class="rich-content"&gt;&lt;h2 class="text-3xl"&gt;…&lt;/h2&gt;&lt;/div&gt;
</code></pre>

<p>Ở đây đó là CHỦ Ý. <code>.rich-content</code> có <strong>135 quy tắc</strong> tạo kiểu cho HTML sinh bởi trình soạn TipTap — mã đánh dấu KHÔNG có lớp nào trên nó, nên selector con cháu là cách DUY NHẤT với tới. Chương 5 đã đo quyết định viết tay chúng thay vì nhận <code>@tailwindcss/typography</code>. Độ đặc hiệu của chúng KHÔNG phải tai nạn; nó chính là thứ làm chúng CHẠY ĐƯỢC.</p>

<div class="callout ok">
<p><strong>Cái luật rơi ra.</strong> Selector con cháu ĐÚNG chính xác ở chỗ bạn KHÔNG đặt được một cái lớp lên cái thẻ — đầu ra trình soạn, markdown, một widget bên thứ ba. Mọi nơi khác chúng là một khoản NỢ độ đặc hiệu, vì chúng thắng tiện ích ÂM THẦM và KHÔNG có cảnh báo nào tại chỗ gọi. 358 cái ở đây phần lớn là ca CHÍNH ĐÁNG; một kho mã mà chúng KHÔNG chính đáng thì mới có vấn đề thật.</p>
</div>

<h3>Các lựa chọn TRUNG THỰC, xếp thứ tự</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 · để yên, và BIẾT vì sao</span><span class="lz-lnote">450 quy tắc thắng CHÍNH ĐÁNG nhờ độ đặc hiệu; 139 thắng nhờ vị trí và hiện ĐANG ĐÚNG. KHÔNG gì hỏng cả. Giá trị của phép đo này là BIẾT cái nào là cái nào khi có thứ gì đó hỏng</span></div>
<div class="lz-layer"><span class="lz-lname">2 · bọc CSS tuỳ biến MỚI trong <code>@layer components</code></span><span class="lz-lnote">thay đổi DUY NHẤT không tốn gì. Quy tắc mới trở nên độc-lập-vị-trí và đè-được-bởi-tiện-ích ngay từ đầu, và 620 cái đang có KHÔNG bị động tới. CHẶN con số khỏi lớn thêm</span></div>
<div class="lz-layer"><span class="lz-lname">3 · di trú 139 quy tắc lớp-đơn CÓ CHỦ Ý</span><span class="lz-lnote">từng cái một, mỗi cái kèm một QUYẾT ĐỊNH: một tiện ích có NÊN đè được cái này không? Thường là CÓ, trường hợp ấy <code>@layer components</code> là đúng. Đây là việc REVIEW ĐƯỢC; cú dời chỉ thị thì không</span></div>
<div class="lz-layer"><span class="lz-lname">4 · để yên 358 cái</span><span class="lz-lnote">chúng tồn tại vì các thẻ KHÔNG có lớp. Bọc chúng vào một layer sẽ làm tiện ích THẮNG chúng, ngược hẳn cái <code>.rich-content</code> cần — việc của nó là tạo kiểu cho mã đánh dấu KHÔNG mang được tiện ích</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi MỘT con số là MỘT vấn đề.</strong> "620 quy tắc ngoài layer" đọc ra như MỘT vấn đề với MỘT cú vá. Phân loại ra thì nó ít nhất là BA: 358 selector con cháu chính đáng NÊN Ở LẠI, 139 quy tắc phụ thuộc vị trí đáng review từng cái, và 92 quy tắc lớp giả thì ổn. BẤT KỲ cú vá nào nhắm vào con số TỔNG đều sẽ SAI với phần lớn nó — và con số tổng là thứ một cú grep đưa cho bạn trừ khi bạn hỏi một câu THỨ HAI.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Trong 620 selector không-layer chỉ 139 cái THẬT SỰ phụ thuộc thứ tự nguồn — 450 cái kia thắng tiện ích nhờ ĐỘ ĐẶC HIỆU từ bất cứ đâu — nên cú dời chỉ thị một-dòng ở bài 7.1 sẽ lật 22% số đó, tất cả đang chạy đúng, điều khiến việc bọc CSS <em>MỚI</em> trong <code>@layer components</code> là thay đổi DUY NHẤT ở đây không tốn gì.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Specificity</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity — bộ ba số và THỨ TỰ mà cascade tra độ đặc hiệu đối lập vị trí nguồn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — thêm kiểu tuỳ biến vào một layer</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles#adding-component-classes — dạng <code>@layer components</code> mà lựa chọn 2 dùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TipTap — HTML mà trình soạn sinh ra</span><span class="lc-sub">tiptap.dev — mã đánh dấu ngữ nghĩa KHÔNG có lớp, đó là lý do <code>.rich-content</code> cần 135 quy tắc con cháu và vì sao đó là ca chính đáng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 5 — quyết định plugin đằng sau 135 quy tắc ấy</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — vì sao kho này viết tay <code>.rich-content</code> thay vì cài <code>@tailwindcss/typography</code>, và cuộc đánh đổi ấy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — The three bands, and what belongs in each|||7.3 — Ba DẢI, và cái gì thuộc về mỗi dải',
      slug: 'tw-7-3-ba-dai',
      type: 'VIDEO',
      description: '`base` cho kiểu dáng phần tử trần, `components` cho lớp mà tiện ích PHẢI đè được, `utilities` cho tiện ích của riêng bạn. Kho này: 155 / 143 / 219 dòng. Một cây quyết định bốn nhánh cho mọi dòng CSS bạn sắp viết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>The three bands, and what belongs in each</h2>
<p class="lead">Lesson 7.2 concluded that wrapping new CSS in a layer is the one free improvement. That raises the practical question it deferred: <em>which</em> layer. The three bands have distinct jobs, and picking wrongly produces the override problems the whole chapter is about.</p>

<h3>What each band means</h3>
<pre><code class="language-bash">$ # this repo's three layers, brace-matched
</code></pre>

<div class="out">@layer base         dong    5-  160   (155 dong)
@layer components   dong  174-  317   (143 dong)
@layer utilities    dong  319-  538   (219 dong)
</div>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">base</span><span class="lz-nsub">bare element styles, no classes</span></span>
<span class="lz-nbody"><code>body</code>, <code>h1</code>, <code>a</code>, <code>:root</code> variables, font-face. Emitted first, so <em>everything</em> can override it. This is where defaults live — the styling a page has before any class is applied.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">components</span><span class="lz-nsub">classes utilities must beat</span></span>
<span class="lz-nbody">A <code>.card</code> or <code>.btn</code> you want <code>p-8</code> to be able to override. Emitted between base and utilities, which is precisely the property that makes a component class composable rather than a wall.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">utilities</span><span class="lz-nsub">single-purpose classes of your own</span></span>
<span class="lz-nbody">A one-property class the generator does not provide — <code>.scrollbar-none</code>, <code>.text-balance</code>. Emitted last so it behaves like a real utility and beats component classes.</span>
</div>
</div>

<div class="callout ok">
<p><strong>The ordering is the whole point.</strong> base → components → utilities is not alphabetical or arbitrary; it is a statement about who overrides whom. Put a component class in <code>utilities</code> and utilities can no longer override it — you have built the wall the layer system exists to prevent.</p>
</div>

<h3>The decision tree</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">can a utility do it?</span><span class="lz-d">Then use the utility and write no CSS. This eliminates most cases before the question of layers arises — and Chapter 4 measured that 79% of class attributes never need more.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">is it a bare element default?</span><span class="lz-d">Styling <code>body</code>, <code>h1</code>, or setting <code>:root</code> variables, with no class involved → <code>@layer base</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">is it a named thing utilities should override?</span><span class="lz-d">A <code>.card</code> whose padding a caller may want to change → <code>@layer components</code>. If you are unsure, this is the right default: it is the least surprising position.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">is it a single-purpose class that should beat components?</span><span class="lz-d">A one-property helper Tailwind lacks → <code>@layer utilities</code>. Rare, because the config (Chapter 5) usually expresses this better and generates all the variants too.</span></div>
</div>

<h3>Where the 135 <code>.rich-content</code> rules belong</h3>
<p>Applying the tree to this repo's largest custom block gives an answer that contradicts the chapter's general advice, which makes it worth working through:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">not <code>base</code></span><span class="lz-lnote">the selectors are <code>.rich-content h2</code>, not <code>h2</code>. Putting them in base would style every heading on the site, not just editor output</span></div>
<div class="lz-layer"><span class="lz-lname">arguably <code>components</code></span><span class="lz-lnote">by the tree, yes — it is a named block of styling. And it would gain position-independence</span></div>
<div class="lz-layer"><span class="lz-lname">but that would BREAK it</span><span class="lz-lnote">in <code>components</code> the rules land before utilities. They currently beat utilities on specificity (<code>0,2,0</code>) and would still do so — layering does not lower specificity — so functionally nothing changes. The real reason to leave them is simpler: nothing is wrong, and moving 135 rules to gain position-independence they do not need is churn</span></div>
<div class="lz-layer"><span class="lz-lname">the actual rule</span><span class="lz-lnote">layer the rules whose <em>outcome depends on position</em> — the 139 single-class ones from lesson 7.2. Descendant selectors already win by specificity, so their position is irrelevant and layering them changes nothing either way</span></div>
</div>

<div class="callout warn">
<p><strong>A correction worth making explicit.</strong> It is tempting to say "layering makes utilities able to override your CSS". It does not — <em>layering does not change specificity</em>. A <code>0,2,0</code> descendant selector inside <code>@layer components</code> still beats a <code>0,1,0</code> utility. Layers only decide the outcome when specificity ties. That is why lesson 7.2's classification mattered: it identified exactly the 139 rules where a tie exists.</p>
</div>

<h3>What <code>base</code> is really for, and the trap in it</h3>
<pre><code class="language-css">@layer base {
  :root { --text-primary: #050505; }     /* correct: a default */
  body  { font-family: var(--font-inter); }
  h1    { font-size: 2rem; }             /* dangerous — see below */
}
</code></pre>

<p>The first two are ideal base content. The third is the trap: styling <code>h1</code> globally means every <code>&lt;h1&gt;</code> carries that size, and a component wanting a small heading must override it. That is fine — utilities beat base easily — but it means every heading in the app now has a style you did not ask for, and removing it later is a site-wide visual change. Prefer styling elements in base only where a genuine document-level default is wanted.</p>

<div class="pitfall">
<p><strong>Trap — putting a component class in <code>@layer utilities</code> to make it "win".</strong> It works, and it inverts the relationship you actually want: now no utility can override that component, so every call site needing a variation must reach for <code>!important</code> or an arbitrary value. This is the failure lesson 3.5's ladder was built to avoid, arrived at from a different direction. If a component class keeps losing, the answer is almost never to promote it a layer — it is that something else has higher specificity, which layers do not fix.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The three bands encode who overrides whom — base for bare defaults, components for classes utilities should beat, utilities for your own single-purpose helpers — but layering only decides outcomes when specificity ties, so it is worth applying to the 139 single-class rules and irrelevant to the 450 that already win on specificity.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles — the three layers with worked examples of what belongs in each, including base styles versus component classes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Preflight</span><span class="lc-sub">tailwindcss.com/docs/preflight — what <code>@tailwind base</code> already puts in that layer before your rules, and how to opt out if it conflicts with existing CSS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Specificity versus source order</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity — the ordering that makes "layers only matter on a tie" true, which is the correction in this lesson.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 3 — the escalation ladder</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — remove the conflict, merge, check the layer, then <code>!</code>. This lesson is the "check the layer" rung, now with the accurate mechanism behind it.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Ba DẢI, và cái gì thuộc về mỗi dải</h2>
<p class="lead">Bài 7.2 kết luận rằng bọc CSS MỚI vào một layer là cải thiện MIỄN PHÍ duy nhất. Điều đó đặt ra câu hỏi thực tế mà nó hoãn lại: layer NÀO. Ba dải có những VIỆC riêng biệt, và chọn sai thì đẻ ra đúng các vấn đề đè-lên-nhau mà cả chương này nói tới.</p>

<h3>Mỗi dải nghĩa là gì</h3>
<pre><code class="language-bash">$ # ba layer cua kho nay, khop bang NGOAC</code></pre>

<div class="out">@layer base         dong    5-  160   (155 dong)
@layer components   dong  174-  317   (143 dong)
@layer utilities    dong  319-  538   (219 dong)
</div>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">base</span><span class="lz-nsub">kiểu dáng phần tử TRẦN, không lớp</span></span>
<span class="lz-nbody"><code>body</code>, <code>h1</code>, <code>a</code>, các biến <code>:root</code>, font-face. Phát sinh ĐẦU TIÊN, nên <em>MỌI THỨ</em> đè được nó. Đây là chỗ các MẶC ĐỊNH sống — kiểu dáng một trang có TRƯỚC khi bất kỳ lớp nào được áp.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">components</span><span class="lz-nsub">lớp mà tiện ích PHẢI thắng</span></span>
<span class="lz-nbody">Một <code>.card</code> hay <code>.btn</code> mà bạn MUỐN <code>p-8</code> đè được. Phát sinh GIỮA base và utilities, chính là tính chất khiến một lớp component GHÉP ĐƯỢC chứ không phải một BỨC TƯỜNG.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">utilities</span><span class="lz-nsub">lớp một-mục-đích của RIÊNG bạn</span></span>
<span class="lz-nbody">Một lớp một-thuộc-tính mà trình sinh không cung cấp — <code>.scrollbar-none</code>, <code>.text-balance</code>. Phát sinh CUỐI để nó hành xử như một tiện ích thật và thắng các lớp component.</span>
</div>
</div>

<div class="callout ok">
<p><strong>THỨ TỰ chính là toàn bộ trọng tâm.</strong> base → components → utilities KHÔNG phải theo bảng chữ cái hay tuỳ tiện; nó là một LỜI PHÁT BIỂU về AI ĐÈ AI. Đặt một lớp component vào <code>utilities</code> thì tiện ích KHÔNG còn đè được nó — bạn vừa dựng đúng cái BỨC TƯỜNG mà hệ layer sinh ra để NGĂN.</p>
</div>

<h3>Cây quyết định</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">một tiện ích làm được không?</span><span class="lz-d">Thế thì DÙNG tiện ích và ĐỪNG viết CSS. Cái này loại bỏ phần lớn trường hợp TRƯỚC khi câu hỏi về layer nảy sinh — và Chương 4 đã đo rằng 79% thuộc tính lớp KHÔNG BAO GIỜ cần hơn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">có phải một mặc định phần tử trần?</span><span class="lz-d">Tạo kiểu <code>body</code>, <code>h1</code>, hay đặt biến <code>:root</code>, KHÔNG dính lớp nào → <code>@layer base</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">có phải một thứ CÓ TÊN mà tiện ích nên đè được?</span><span class="lz-d">Một <code>.card</code> mà padding của nó người gọi có thể muốn đổi → <code>@layer components</code>. Nếu bạn KHÔNG CHẮC, đây là mặc định ĐÚNG: nó là vị trí ÍT GÂY BẤT NGỜ nhất.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">có phải một lớp một-mục-đích nên thắng component?</span><span class="lz-d">Một trợ giúp một-thuộc-tính mà Tailwind thiếu → <code>@layer utilities</code>. HIẾM, vì config (Chương 5) thường diễn đạt cái này TỐT HƠN và sinh ra cả các biến thể.</span></div>
</div>

<h3>135 quy tắc <code>.rich-content</code> thuộc về đâu</h3>
<p>Áp cái cây lên khối tuỳ biến LỚN NHẤT của kho này cho một câu trả lời MÂU THUẪN với lời khuyên chung của chương, điều làm nó đáng đi qua từng bước:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">KHÔNG phải <code>base</code></span><span class="lz-lnote">selector là <code>.rich-content h2</code>, không phải <code>h2</code>. Đặt chúng vào base sẽ tạo kiểu cho MỌI tiêu đề trên trang, không chỉ đầu ra trình soạn</span></div>
<div class="lz-layer"><span class="lz-lname">có thể lập luận là <code>components</code></span><span class="lz-lnote">theo cái cây thì ĐÚNG — nó là một khối tạo kiểu CÓ TÊN. Và nó sẽ có được tính độc-lập-vị-trí</span></div>
<div class="lz-layer"><span class="lz-lname">nhưng thế sẽ KHÔNG đổi gì</span><span class="lz-lnote">trong <code>components</code> các quy tắc rơi TRƯỚC tiện ích. Chúng hiện thắng tiện ích nhờ ĐỘ ĐẶC HIỆU (<code>0,2,0</code>) và sẽ VẪN thắng — layer KHÔNG hạ độ đặc hiệu — nên về chức năng KHÔNG gì đổi. Lý do thật để yên đơn giản hơn: KHÔNG gì sai, và dời 135 quy tắc để có được tính độc-lập-vị-trí mà chúng KHÔNG CẦN thì chỉ là xáo trộn</span></div>
<div class="lz-layer"><span class="lz-lname">cái luật THẬT</span><span class="lz-lnote">hãy layer những quy tắc mà <em>KẾT QUẢ phụ thuộc VỊ TRÍ</em> — 139 cái lớp-đơn ở bài 7.2. Selector con cháu ĐÃ thắng bằng độ đặc hiệu, nên vị trí của chúng VÔ NGHĨA và layer chúng cũng chẳng đổi gì theo chiều nào</span></div>
</div>

<div class="callout warn">
<p><strong>Một cú sửa đáng nói TƯỜNG MINH.</strong> Rất dễ nói "layer làm cho tiện ích đè được CSS của bạn". KHÔNG phải — <em>layer KHÔNG đổi độ đặc hiệu</em>. Một selector con cháu <code>0,2,0</code> bên trong <code>@layer components</code> VẪN thắng một tiện ích <code>0,1,0</code>. Layer CHỈ quyết định kết quả khi độ đặc hiệu HOÀ. Đó là lý do phép phân loại ở bài 7.2 quan trọng: nó xác định CHÍNH XÁC 139 quy tắc có tồn tại một cú hoà.</p>
</div>

<h3><code>base</code> THẬT SỰ để làm gì, và cái bẫy trong nó</h3>
<pre><code class="language-css">@layer base {
  :root { --text-primary: #050505; }     /* dung: mot mac dinh */
  body  { font-family: var(--font-inter); }
  h1    { font-size: 2rem; }             /* NGUY HIEM — xem duoi */
}
</code></pre>

<p>Hai cái đầu là nội dung base LÝ TƯỞNG. Cái thứ ba là cái bẫy: tạo kiểu <code>h1</code> TOÀN CỤC nghĩa là MỌI <code>&lt;h1&gt;</code> mang cỡ ấy, và một component muốn một tiêu đề nhỏ PHẢI đè nó. Điều đó ổn — tiện ích thắng base dễ dàng — nhưng nó có nghĩa MỌI tiêu đề trong ứng dụng giờ có một kiểu dáng bạn KHÔNG yêu cầu, và gỡ nó về sau là một thay đổi thị giác TOÀN TRANG. Hãy chỉ tạo kiểu phần tử trong base ở chỗ THẬT SỰ muốn một mặc định cấp-tài-liệu.</p>

<div class="pitfall">
<p><strong>Bẫy — đặt một lớp component vào <code>@layer utilities</code> để nó "THẮNG".</strong> Nó CHẠY, và nó ĐẢO NGƯỢC đúng cái quan hệ bạn muốn: giờ KHÔNG tiện ích nào đè được component ấy, nên mọi chỗ gọi cần một biến thể đều phải với tay tới <code>!important</code> hay một giá trị tuỳ ý. Đây là cú hỏng mà cái thang ở bài 3.5 được dựng để TRÁNH, tới từ một hướng khác. Nếu một lớp component cứ THUA, câu trả lời gần như KHÔNG BAO GIỜ là nâng nó lên một layer — mà là có thứ khác độ đặc hiệu CAO HƠN, thứ layer KHÔNG vá được.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba dải mã hoá AI ĐÈ AI — base cho mặc định trần, components cho lớp mà tiện ích nên thắng, utilities cho các trợ giúp một-mục-đích của riêng bạn — nhưng layer CHỈ quyết định kết quả khi độ đặc hiệu HOÀ, nên nó đáng áp cho 139 quy tắc lớp-đơn và VÔ NGHĨA với 450 cái vốn đã thắng bằng độ đặc hiệu.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles — ba layer với ví dụ đã giải về cái gì thuộc về đâu, gồm cả kiểu base đối lập lớp component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Preflight</span><span class="lc-sub">tailwindcss.com/docs/preflight — cái mà <code>@tailwind base</code> ĐÃ đặt vào layer ấy TRƯỚC các quy tắc của bạn, và cách tắt nếu nó xung đột với CSS sẵn có.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — độ đặc hiệu đối lập thứ tự nguồn</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity — thứ tự khiến câu "layer chỉ quan trọng khi hoà" là ĐÚNG, chính là cú sửa trong bài này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 3 — cái thang leo thang</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — gỡ xung đột, hợp nhất, kiểm layer, rồi mới <code>!</code>. Bài này là nấc "kiểm layer", giờ đã có cơ chế CHÍNH XÁC đằng sau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Preflight: the base styles you did not write|||7.4 — Preflight: những kiểu nền bạn KHÔNG hề viết',
      slug: 'tw-7-4-preflight',
      type: 'VIDEO',
      description: '`@tailwind base` chèn hơn 400 dòng reset TRƯỚC bất cứ thứ gì bạn viết — nó gỡ cỡ chữ của `h1`, dấu đầu dòng của `ul`, và viền của `button`. Đo bằng CLI thật. Biết nó có ở đó giải thích một nửa số câu "sao thẻ này trông trần trụi thế".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Preflight: the base styles you did not write</h2>
<p class="lead">Every measurement in this chapter showed rules starting around line 557 of the output. That is because exactly 555 lines come first, and none of them are yours. Knowing what Preflight removes explains a whole category of "why does this element look wrong" that has nothing to do with your CSS.</p>

<h3>Measuring what arrives before your first rule</h3>
<pre><code class="language-bash">$ echo '@tailwind base;' &gt; only-base.css
$ npx tailwindcss -i only-base.css -o out.css
$ wc -l out.css
</code></pre>

<div class="out">$ wc -l out.css
555 out.css      # 41 quy tac, truoc khi ban viet dong nao
</div>

<p>That block is Preflight, an opinionated reset built on modern-normalize. It is emitted into the <code>base</code> layer, so everything you write can override it — but it runs first and it is aggressive.</p>

<h3>The four removals that surprise people</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">headings lose their size and weight</span><span class="lz-lnote"><code>h1</code>-<code>h6</code> render at the same size as body text, in normal weight. Deliberate: it forces every heading to declare its own scale, so a heading level is chosen for document structure rather than for how big it looks</span></div>
<div class="lz-layer"><span class="lz-lname">lists lose their markers</span><span class="lz-lnote"><code>ul</code> and <code>ol</code> have no bullets or numbers and no indent. This is the one that catches people rendering markdown — the list is semantically correct and looks like plain paragraphs</span></div>
<div class="lz-layer"><span class="lz-lname">buttons lose their appearance</span><span class="lz-lnote">no border, no background, inherited font. A <code>&lt;button&gt;</code> with no classes is visually a span. Useful, because you were going to restyle it anyway, and it removes the browser differences you would have fought</span></div>
<div class="lz-layer"><span class="lz-lname">images become block-level</span><span class="lz-lnote"><code>display: block</code> and <code>max-width: 100%</code>. This silently fixes the mysterious gap under images (the inline-baseline gap) and stops overflow — one of Preflight's genuinely free wins</span></div>
</div>

<div class="callout warn">
<p><strong>This is the actual reason <code>.rich-content</code> exists.</strong> Chapter 5 framed the 135 hand-written rules as a decision not to install <code>@tailwindcss/typography</code>. Preflight is the other half of the story: editor output is class-less <code>h2</code>, <code>ul</code>, <code>blockquote</code> elements, and Preflight has just stripped all of their default styling. Without those 135 rules the lesson content would render as undifferentiated paragraphs. Something has to put the styling back, and the only question was whether to write it or install it.</p>
</div>

<h3>The trade, stated plainly</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">what Preflight buys</span><span class="lz-nsub">a flat starting point</span></span>
<span class="lz-nbody">No browser disagreements, no inherited defaults to override, and no accidental styling. Every visual property on the page is one you asked for, which is what makes utility classes predictable.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">what it costs</span><span class="lz-nsub">any HTML you do not control</span></span>
<span class="lz-nbody">Markdown, CMS output, a rich-text editor, an email preview. All arrive as semantic class-less HTML that Preflight has flattened, so all of it needs styling put back — 135 rules here, and a plugin or a large stylesheet anywhere else.</span>
</div>
</div>

<h3>Turning it off, and why that is usually the wrong move</h3>
<pre><code class="language-js">// tailwind.config.ts
corePlugins: { preflight: false }
</code></pre>

<p>The legitimate case is adding Tailwind to an existing app with its own established CSS, where Preflight would flatten styling other parts of the app depend on. Outside that, disabling it trades a known, documented reset for the browser's inconsistent defaults — and utilities then compose on top of styling you did not choose, which makes their effect unpredictable across elements.</p>

<div class="callout ok">
<p><strong>The middle path.</strong> Rather than disabling Preflight globally, put the defaults back in a scoped block — exactly what <code>.rich-content</code> does. Preflight stays flat everywhere the app uses utilities, and the one region that renders foreign HTML gets its own styling. That scoping is why the 135 rules use descendant selectors, and why lesson 7.2 concluded they should stay as they are.</p>
</div>

<h3>What this means for reading the output</h3>
<p>The line numbers in every measurement in this chapter are now explicable:</p>

<div class="out">dong    1 -  555    Preflight (@tailwind base)
dong   556 -  556    cac lop @layer components cua ban
dong   557           .btn        &lt;- lop component dau tien
dong   561           .p-4        &lt;- tien ich
dong   565           .unlayered  &lt;- CSS khong-layer, DUNG CHO BAN VIET
</div>

<p>Reading a built stylesheet top to bottom is a reliable way to answer "why did that win" — the answer is nearly always visible as a line number, and Preflight occupying the first 555 lines is the reason your own rules start where they do.</p>

<div class="pitfall">
<p><strong>Trap — diagnosing a Preflight removal as a missing utility.</strong> A list with no bullets looks like a styling bug, so people add <code>list-disc</code> and move on. That is correct for a list you author. For editor or markdown output you cannot add a class, so the same symptom needs a completely different fix — a scoped rule. Recognising the symptom as <em>Preflight removed a default</em> rather than <em>I forgot a class</em> is what points at the right one.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>@tailwind base</code> injects 555 lines of Preflight (41 rules) before anything you write, stripping heading sizes, list markers and button appearance so that every visual property is one you asked for — which is exactly why HTML you do not control needs its styling restored, and why this repo has 135 scoped rules doing that.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Preflight</span><span class="lc-sub">tailwindcss.com/docs/preflight — the complete list of what it changes, with the reasoning for each removal. Short enough to read once and worth it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">modern-normalize</span><span class="lc-sub">github.com/sindresorhus/modern-normalize — the reset Preflight builds on, which handles the cross-browser differences before Tailwind's own opinions are applied.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — corePlugins</span><span class="lc-sub">tailwindcss.com/docs/configuration#core-plugins — disabling Preflight or any other core plugin, and the incremental-adoption case where that is the right call.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — browser default stylesheets</span><span class="lc-sub">/courses/web-foundations/learn${REF} — what the user-agent stylesheet actually contains, which is what Preflight is normalising away.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Preflight: những kiểu nền bạn KHÔNG hề viết</h2>
<p class="lead">Mọi phép đo trong chương này đều cho thấy các quy tắc bắt đầu quanh dòng 557 của đầu ra. Đó là vì đúng 555 dòng đi TRƯỚC, và KHÔNG dòng nào là của bạn. Biết Preflight GỠ BỎ cái gì giải thích cả một LOẠI câu hỏi "sao thẻ này trông sai" mà KHÔNG liên quan gì tới CSS của bạn.</p>

<h3>Đo cái tới TRƯỚC quy tắc đầu tiên của bạn</h3>
<pre><code class="language-bash">$ echo '@tailwind base;' &gt; only-base.css
$ npx tailwindcss -i only-base.css -o out.css
$ wc -l out.css
</code></pre>

<div class="out">$ wc -l out.css
555 out.css      # 41 quy tac, truoc khi ban viet dong nao
</div>

<p>Khối ấy là Preflight, một cú reset CÓ ĐỊNH KIẾN dựng trên modern-normalize. Nó được phát sinh vào layer <code>base</code>, nên mọi thứ bạn viết đều đè được nó — nhưng nó chạy TRƯỚC và nó QUYẾT LIỆT.</p>

<h3>Bốn cú gỡ làm người ta bất ngờ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tiêu đề MẤT cỡ và độ đậm</span><span class="lz-lnote"><code>h1</code>-<code>h6</code> hiện ra CÙNG cỡ với chữ thân bài, đậm bình thường. CHỦ Ý: nó ÉP mọi tiêu đề tự khai thang của mình, để một CẤP tiêu đề được chọn theo CẤU TRÚC TÀI LIỆU chứ không theo việc nó trông TO cỡ nào</span></div>
<div class="lz-layer"><span class="lz-lname">danh sách MẤT dấu đầu dòng</span><span class="lz-lnote"><code>ul</code> và <code>ol</code> KHÔNG có chấm hay số và KHÔNG thụt lề. Đây là cái bắt trúng người dựng markdown — danh sách ĐÚNG về ngữ nghĩa và TRÔNG như các đoạn văn thường</span></div>
<div class="lz-layer"><span class="lz-lname">nút MẤT diện mạo</span><span class="lz-lnote">không viền, không nền, font kế thừa. Một <code>&lt;button&gt;</code> không có lớp thì về thị giác là một span. HỮU ÍCH, vì đằng nào bạn cũng định tạo kiểu lại nó, và nó GỠ những khác biệt giữa các trình duyệt mà bạn sẽ phải đánh nhau</span></div>
<div class="lz-layer"><span class="lz-lname">ảnh thành cấp KHỐI</span><span class="lz-lnote"><code>display: block</code> và <code>max-width: 100%</code>. Cái này âm thầm VÁ cái khe bí ẩn dưới ảnh (khe đường-cơ-sở inline) và chặn tràn — một trong những cú thắng THẬT SỰ miễn phí của Preflight</span></div>
</div>

<div class="callout warn">
<p><strong>Đây mới là lý do THẬT khiến <code>.rich-content</code> tồn tại.</strong> Chương 5 đóng khung 135 quy tắc viết tay ấy như một quyết định KHÔNG cài <code>@tailwindcss/typography</code>. Preflight là NỬA CÒN LẠI của câu chuyện: đầu ra trình soạn là các thẻ <code>h2</code>, <code>ul</code>, <code>blockquote</code> KHÔNG lớp, và Preflight vừa LỘT SẠCH kiểu dáng mặc định của tất cả chúng. KHÔNG có 135 quy tắc ấy thì nội dung bài học sẽ dựng ra thành các đoạn văn KHÔNG PHÂN BIỆT được. Phải có thứ gì đó ĐẶT LẠI kiểu dáng, và câu hỏi duy nhất là VIẾT nó hay CÀI nó.</p>
</div>

<h3>Cuộc đánh đổi, nói thẳng</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Preflight mua được gì</span><span class="lz-nsub">một điểm khởi đầu PHẲNG</span></span>
<span class="lz-nbody">Không bất đồng giữa trình duyệt, không mặc định kế thừa phải đè, và không tạo kiểu ngoài ý muốn. MỌI thuộc tính thị giác trên trang đều là cái bạn YÊU CẦU, chính là thứ khiến lớp tiện ích ĐOÁN TRƯỚC ĐƯỢC.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nó tốn gì</span><span class="lz-nsub">bất kỳ HTML nào bạn KHÔNG kiểm soát</span></span>
<span class="lz-nbody">Markdown, đầu ra CMS, một trình soạn văn bản, một bản xem trước email. Tất cả tới dưới dạng HTML ngữ nghĩa KHÔNG lớp mà Preflight đã làm phẳng, nên TẤT CẢ cần được đặt lại kiểu dáng — 135 quy tắc ở đây, và một plugin hay một bảng kiểu lớn ở mọi nơi khác.</span>
</div>
</div>

<h3>Tắt nó đi, và vì sao đó thường là nước đi SAI</h3>
<pre><code class="language-js">// tailwind.config.ts
corePlugins: { preflight: false }
</code></pre>

<p>Ca CHÍNH ĐÁNG là thêm Tailwind vào một ứng dụng SẴN CÓ với CSS đã thiết lập của nó, nơi Preflight sẽ làm phẳng kiểu dáng mà các phần khác của ứng dụng PHỤ THUỘC. Ngoài ca ấy, tắt nó là đánh đổi một cú reset ĐÃ BIẾT, CÓ TÀI LIỆU lấy các mặc định KHÔNG NHẤT QUÁN của trình duyệt — và tiện ích khi ấy GHÉP LÊN một kiểu dáng bạn KHÔNG chọn, khiến tác dụng của chúng KHÔNG ĐOÁN TRƯỚC ĐƯỢC giữa các thẻ.</p>

<div class="callout ok">
<p><strong>Đường ở giữa.</strong> Thay vì TẮT Preflight toàn cục, hãy ĐẶT LẠI các mặc định trong một khối CÓ PHẠM VI — chính xác cái <code>.rich-content</code> làm. Preflight VẪN phẳng ở mọi nơi ứng dụng dùng tiện ích, và MỘT vùng dựng HTML ngoại lai thì có kiểu dáng riêng của nó. Cú giới hạn phạm vi ấy là lý do 135 quy tắc dùng selector con cháu, và là lý do bài 7.2 kết luận chúng nên Ở NGUYÊN.</p>
</div>

<h3>Điều này nghĩa gì khi ĐỌC đầu ra</h3>
<p>Các số dòng trong mọi phép đo của chương này giờ GIẢI THÍCH ĐƯỢC:</p>

<div class="out">dong    1 -  555    Preflight (@tailwind base)
dong   556 -  556    cac lop @layer components cua ban
dong   557           .btn        &lt;- lop component dau tien
dong   561           .p-4        &lt;- tien ich
dong   565           .unlayered  &lt;- CSS khong-layer, DUNG CHO BAN VIET
</div>

<p>Đọc một bảng kiểu đã dựng TỪ TRÊN XUỐNG là một cách ĐÁNG TIN để trả lời "vì sao cái kia thắng" — câu trả lời gần như luôn NHÌN THẤY ĐƯỢC dưới dạng một SỐ DÒNG, và việc Preflight chiếm 555 dòng đầu là lý do các quy tắc của chính bạn bắt đầu ở chỗ chúng bắt đầu.</p>

<div class="pitfall">
<p><strong>Bẫy — chẩn đoán một cú gỡ của Preflight thành một tiện ích BỊ THIẾU.</strong> Một danh sách không có chấm TRÔNG như một con bọ tạo kiểu, nên người ta thêm <code>list-disc</code> rồi đi tiếp. Điều đó ĐÚNG với một danh sách bạn tự viết. Với đầu ra trình soạn hay markdown thì bạn KHÔNG thêm được lớp, nên CÙNG triệu chứng ấy cần một cú vá HOÀN TOÀN KHÁC — một quy tắc có phạm vi. Nhận ra triệu chứng là <em>Preflight đã gỡ một mặc định</em> chứ không phải <em>tôi quên một cái lớp</em> chính là thứ chỉ vào cú vá đúng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>@tailwind base</code> chèn 555 dòng Preflight (41 quy tắc) TRƯỚC bất cứ thứ gì bạn viết, lột bỏ cỡ tiêu đề, dấu danh sách và diện mạo nút để MỌI thuộc tính thị giác đều là cái bạn yêu cầu — đó chính xác là lý do HTML bạn KHÔNG kiểm soát cần được ĐẶT LẠI kiểu dáng, và là lý do kho này có 135 quy tắc có-phạm-vi làm việc đó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Preflight</span><span class="lc-sub">tailwindcss.com/docs/preflight — danh sách ĐẦY ĐỦ những gì nó đổi, kèm lý lẽ cho từng cú gỡ. Đủ ngắn để đọc một lần và đáng đọc.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">modern-normalize</span><span class="lc-sub">github.com/sindresorhus/modern-normalize — cú reset mà Preflight dựng trên, xử lý các khác biệt giữa trình duyệt TRƯỚC khi các định kiến riêng của Tailwind được áp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — corePlugins</span><span class="lc-sub">tailwindcss.com/docs/configuration#core-plugins — tắt Preflight hay bất kỳ core plugin nào, và ca nhận-dần-từng-bước nơi đó là quyết định ĐÚNG.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Web Foundations — bảng kiểu mặc định của trình duyệt</span><span class="lc-sub">/courses/web-foundations/learn${REF} — bảng kiểu user-agent THẬT SỰ chứa gì, chính là thứ Preflight đang chuẩn hoá đi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — Reading a built stylesheet to answer "why did that win"|||7.5 — Đọc bảng kiểu ĐÃ DỰNG để trả lời "vì sao cái kia thắng"',
      slug: 'tw-7-5-doc-dau-ra',
      type: 'VIDEO',
      description: 'Cả chương này trả lời câu hỏi ấy bằng SỐ DÒNG. Bài này biến nó thành một quy trình bốn bước dùng được ở bất kỳ dự án nào — và chỉ ra chỗ DevTools nói cho bạn ít hơn file đầu ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Reading a built stylesheet to answer "why did that win"</h2>
<p class="lead">Every measurement in this chapter came from the same move: build the CSS and look at line numbers. That is not a trick specific to these examples — it is the general procedure for cascade questions, and it answers things DevTools cannot.</p>

<h3>The four steps</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">is the rule there at all?</span><span class="lz-d"><code>grep -c '\\.text-text-muted\\\\/60' out.css</code>. Zero means it was never generated — a dynamic class (0.1), a missing content glob (0.3), or the alpha trap (6.2). No cascade reasoning applies until this returns non-zero.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">what are the competing rules?</span><span class="lz-d"><code>grep -n 'padding' out.css | grep -E 'card|p-4'</code>. Get every rule that sets the property, with its line number.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">compare specificity first</span><span class="lz-d">Count classes, pseudo-classes and IDs in each selector. Higher wins outright, and line numbers are irrelevant. This resolves the 450 descendant and pseudo rules from lesson 7.2.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">only on a tie, compare line numbers</span><span class="lz-d">Equal specificity means later wins. This is the 139-rule case, and the one where the answer is literally a number you can read.</span></div>
</div>

<div class="callout ok">
<p><strong>Why the order matters.</strong> Step 3 before step 4 is not a stylistic preference — it is the cascade's own order. Comparing line numbers first gives the wrong answer for 450 of this repo's 620 unlayered rules, because those win regardless of position. Most confused cascade debugging is these two steps taken in the wrong order.</p>
</div>

<h3>Where the built file beats DevTools</h3>
<p>DevTools is better for most work — it shows the winner immediately with losers struck through. Three questions it answers poorly:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">"was this class ever generated?"</span><span class="lz-lnote">DevTools shows the class on the element whether or not a rule exists. An absent rule looks identical to a rule that lost. Only <code>grep</code> on the output distinguishes them — and this is the single most common Tailwind failure</span></div>
<div class="lz-layer"><span class="lz-lname">"how far apart are these rules?"</span><span class="lz-lnote">DevTools shows order, not distance. Knowing that <code>.unlayered</code> is at 565 and <code>.p-4</code> at 561 tells you they are adjacent — so a small reordering would flip them, which is fragile. Two rules 3,000 lines apart are stable</span></div>
<div class="lz-layer"><span class="lz-lname">"what does the whole file look like?"</span><span class="lz-lnote">the band structure — Preflight to 555, components, utilities, then unlayered CSS — is visible in thirty seconds of scrolling the output and invisible in DevTools, which only ever shows one element's matches</span></div>
</div>

<h3>A worked example, end to end</h3>
<p>Suppose <code>text-3xl</code> does nothing on a heading inside lesson content:</p>

<div class="out">1. co ton tai khong?
   $ grep -c '\\.text-3xl' out.css
   1                          -> CO. Khong phai bug phat sinh.

2. cai gi canh tranh?
   $ grep -n 'font-size' out.css | grep -E 'text-3xl|rich-content h2'
   1893: .rich-content h2 { font-size: 1.5rem }
   2412: .text-3xl        { font-size: 1.875rem }

3. do dac hieu?
   .rich-content h2  = 1 lop + 1 phan tu = 0,1,1
   .text-3xl         = 1 lop             = 0,1,0
   -> .rich-content h2 THANG. Ket thuc o day.

4. so dong?
   KHONG CAN. Buoc 3 da dut diem — du .text-3xl dung SAU (2412 > 1893).
</div>

<p>Note step 4: <code>.text-3xl</code> is emitted <em>later</em> and still loses. Anyone reasoning by source order alone would predict the opposite. This is the concrete reason the steps are ordered as they are.</p>

<div class="callout warn">
<p><strong>And the fix follows from the diagnosis.</strong> Because it is a specificity loss and not a position one, moving <code>@tailwind</code> directives, wrapping things in layers, or reordering the file all change nothing. The options are: add a class to the element and use a more specific selector, scope the utility with <code>[&amp;_h2]:text-3xl</code> (lesson 2.5), or accept that <code>.rich-content</code> owns its headings — which for editor output is usually the right answer.</p>
</div>

<h3>Where the built CSS lives</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Next.js</span><span class="lz-lnote"><code>.next/static/css/*.css</code> after a build. In dev the CSS is injected by the dev server, so build first if you want a file to grep</span></div>
<div class="lz-layer"><span class="lz-lname">the CLI directly</span><span class="lz-lnote"><code>npx tailwindcss -i globals.css -o /tmp/out.css</code> — fastest for cascade questions, and what every measurement in this chapter used. No framework in the way</span></div>
<div class="lz-layer"><span class="lz-lname">the browser</span><span class="lz-lnote">the Network tab's CSS response, or <code>document.styleSheets</code> in the console. Correct when you suspect the deployed file differs from your local build — the stale-artifact case</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — grepping the source instead of the output.</strong> Searching <code>globals.css</code> for a competing rule misses everything Tailwind generates, which is most of the file — Preflight's 555 lines and every utility. The question "what beats my class" can only be answered against the artefact that ships. This is the same principle as lesson 6.2's CI guard: check the output, not the input.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Cascade questions are answerable mechanically — confirm the rule exists in the built CSS, list the competitors with line numbers, compare specificity, and only consult line numbers on a tie — and the built file answers "was this ever generated" and "how fragile is this ordering", which DevTools cannot.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — the Styles pane</span><span class="lc-sub">developer.chrome.com/docs/devtools/css — reading struck-through declarations and the computed tab, which is the faster path for everything except the three questions above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Specificity calculation</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity — counting the three-number tuple, which is step 3 done by hand.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind CLI</span><span class="lc-sub">tailwindcss.com/docs/installation — the standalone build command used throughout this course, which is the fastest way to get a file to inspect.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 10 — the full diagnosis cookbook</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — this procedure as one branch of a larger decision tree covering every way a class can fail to apply.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Đọc bảng kiểu ĐÃ DỰNG để trả lời "vì sao cái kia thắng"</h2>
<p class="lead">MỌI phép đo trong chương này đều đến từ cùng một nước đi: DỰNG cái CSS và NHÌN SỐ DÒNG. Đó không phải một mẹo riêng cho các ví dụ này — nó là QUY TRÌNH CHUNG cho các câu hỏi về cascade, và nó trả lời được những thứ DevTools không trả lời được.</p>

<h3>Bốn bước</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">quy tắc ấy CÓ ở đó không?</span><span class="lz-d"><code>grep -c '\\.text-text-muted\\\\/60' out.css</code>. Số không nghĩa là nó CHƯA BAO GIỜ được phát sinh — một lớp động (0.1), một glob content thiếu (0.3), hay bẫy alpha (6.2). KHÔNG suy luận cascade nào áp được cho tới khi cái này trả về khác 0.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">các quy tắc CẠNH TRANH là gì?</span><span class="lz-d"><code>grep -n 'padding' out.css | grep -E 'card|p-4'</code>. Lấy MỌI quy tắc đặt thuộc tính ấy, kèm SỐ DÒNG.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">so ĐỘ ĐẶC HIỆU trước</span><span class="lz-d">Đếm lớp, lớp giả và ID trong mỗi selector. Cao hơn thì thắng ĐỨT, và số dòng VÔ NGHĨA. Cái này giải quyết 450 quy tắc con cháu và lớp giả từ bài 7.2.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">CHỈ khi HOÀ mới so số dòng</span><span class="lz-d">Cùng độ đặc hiệu thì cái SAU thắng. Đây là ca 139-quy-tắc, và là ca mà câu trả lời ĐÚNG NGHĨA ĐEN là một con số bạn đọc được.</span></div>
</div>

<div class="callout ok">
<p><strong>Vì sao THỨ TỰ quan trọng.</strong> Bước 3 trước bước 4 KHÔNG phải một sở thích phong cách — nó là THỨ TỰ của chính cascade. So số dòng TRƯỚC thì cho câu trả lời SAI với 450 trên 620 quy tắc không-layer của kho này, vì chúng thắng BẤT KỂ vị trí. Phần lớn việc gỡ lỗi cascade rối rắm là HAI bước này bị làm SAI THỨ TỰ.</p>
</div>

<h3>Chỗ file ĐÃ DỰNG thắng DevTools</h3>
<p>DevTools TỐT HƠN cho phần lớn công việc — nó hiện kẻ thắng ngay lập tức với kẻ thua bị gạch ngang. BA câu hỏi nó trả lời KÉM:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">"lớp này có TỪNG được phát sinh không?"</span><span class="lz-lnote">DevTools hiện cái lớp trên thẻ BẤT KỂ có quy tắc hay không. Một quy tắc VẮNG MẶT trông Y HỆT một quy tắc đã THUA. Chỉ <code>grep</code> trên ĐẦU RA mới phân biệt được — và đây là cú hỏng Tailwind phổ biến NHẤT</span></div>
<div class="lz-layer"><span class="lz-lname">"hai quy tắc này CÁCH NHAU bao xa?"</span><span class="lz-lnote">DevTools hiện THỨ TỰ, không hiện KHOẢNG CÁCH. Biết <code>.unlayered</code> ở 565 và <code>.p-4</code> ở 561 cho bạn biết chúng KỀ NHAU — nên một cú sắp xếp lại nhỏ sẽ LẬT chúng, tức là MONG MANH. Hai quy tắc cách nhau 3.000 dòng thì ỔN ĐỊNH</span></div>
<div class="lz-layer"><span class="lz-lname">"cả cái FILE trông ra sao?"</span><span class="lz-lnote">cấu trúc dải — Preflight tới 555, components, utilities, rồi CSS không-layer — nhìn thấy được trong ba mươi giây cuộn đầu ra và VÔ HÌNH trong DevTools, thứ chỉ bao giờ hiện các khớp của MỘT thẻ</span></div>
</div>

<h3>Một ví dụ đã giải, từ đầu tới cuối</h3>
<p>Giả sử <code>text-3xl</code> KHÔNG làm gì trên một tiêu đề bên trong nội dung bài học:</p>

<div class="out">1. co ton tai khong?
   $ grep -c '\\.text-3xl' out.css
   1                          -> CO. Khong phai bug phat sinh.

2. cai gi canh tranh?
   $ grep -n 'font-size' out.css | grep -E 'text-3xl|rich-content h2'
   1893: .rich-content h2 { font-size: 1.5rem }
   2412: .text-3xl        { font-size: 1.875rem }

3. do dac hieu?
   .rich-content h2  = 1 lop + 1 phan tu = 0,1,1
   .text-3xl         = 1 lop             = 0,1,0
   -> .rich-content h2 THANG. Ket thuc o day.

4. so dong?
   KHONG CAN. Buoc 3 da dut diem — du .text-3xl dung SAU (2412 > 1893).
</div>

<p>Để ý bước 4: <code>.text-3xl</code> được phát sinh <em>SAU HƠN</em> mà VẪN THUA. Bất kỳ ai suy luận CHỈ bằng thứ tự nguồn sẽ dự đoán NGƯỢC LẠI. Đây là lý do CỤ THỂ khiến các bước được xếp thứ tự như vậy.</p>

<div class="callout warn">
<p><strong>Và cú vá SUY RA từ chẩn đoán.</strong> Vì đó là một cú thua về ĐỘ ĐẶC HIỆU chứ không phải về vị trí, nên dời các chỉ thị <code>@tailwind</code>, bọc mọi thứ vào layer, hay sắp xếp lại file đều KHÔNG đổi gì. Các lựa chọn là: thêm một lớp lên thẻ và dùng một selector đặc hiệu hơn, giới hạn tiện ích bằng <code>[&amp;_h2]:text-3xl</code> (bài 2.5), hoặc CHẤP NHẬN rằng <code>.rich-content</code> SỞ HỮU các tiêu đề của nó — với đầu ra trình soạn thì đó thường là câu trả lời ĐÚNG.</p>
</div>

<h3>CSS đã dựng sống ở đâu</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Next.js</span><span class="lz-lnote"><code>.next/static/css/*.css</code> sau một lần dựng. Ở dev thì CSS được máy chủ dev bơm vào, nên hãy DỰNG trước nếu bạn muốn một FILE để grep</span></div>
<div class="lz-layer"><span class="lz-lname">CLI trực tiếp</span><span class="lz-lnote"><code>npx tailwindcss -i globals.css -o /tmp/out.css</code> — NHANH NHẤT cho các câu hỏi cascade, và là cái mọi phép đo trong chương này dùng. Không có framework chắn đường</span></div>
<div class="lz-layer"><span class="lz-lname">trình duyệt</span><span class="lz-lnote">phản hồi CSS ở tab Network, hoặc <code>document.styleSheets</code> trong console. ĐÚNG khi bạn nghi file đã triển khai KHÁC bản dựng local của bạn — ca tạo-tác-cũ</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — grep MÃ NGUỒN thay vì ĐẦU RA.</strong> Tìm trong <code>globals.css</code> một quy tắc cạnh tranh thì BỎ SÓT mọi thứ Tailwind phát sinh, vốn là PHẦN LỚN cái file — 555 dòng Preflight và mọi tiện ích. Câu hỏi "cái gì thắng lớp của tôi" CHỈ trả lời được đối chiếu với TẠO TÁC ĐƯỢC GIAO. Đây cùng nguyên lý với cái chốt CI ở bài 6.2: kiểm ĐẦU RA, không kiểm đầu vào.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Câu hỏi về cascade trả lời được một cách MÁY MÓC — xác nhận quy tắc CÓ trong CSS đã dựng, liệt kê các kẻ cạnh tranh kèm số dòng, so ĐỘ ĐẶC HIỆU, và CHỈ tra số dòng khi HOÀ — và file đã dựng trả lời được "cái này có từng được phát sinh không" và "thứ tự này mong manh cỡ nào", những thứ DevTools không làm được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Chrome DevTools — bảng Styles</span><span class="lc-sub">developer.chrome.com/docs/devtools/css — đọc các khai báo bị gạch ngang và tab computed, con đường NHANH HƠN cho mọi thứ trừ ba câu hỏi bên trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — cách tính độ đặc hiệu</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity — đếm bộ ba số, chính là bước 3 làm bằng tay.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind CLI</span><span class="lc-sub">tailwindcss.com/docs/installation — lệnh dựng độc lập dùng xuyên suốt khoá này, cách NHANH NHẤT để có một file mà soi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — sách công thức chẩn đoán đầy đủ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — quy trình này như MỘT nhánh của một cây quyết định lớn hơn bao mọi cách một cái lớp có thể không ăn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 7.6 ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'tw-7-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về @layer: Tailwind 3 XOÁ nó, chỉ 139/620 phụ thuộc vị trí, layer KHÔNG đổi độ đặc hiệu, Preflight 555 dòng, và quy trình bốn bước đọc đầu ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>What Chapter 7 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter corrected a claim made loosely in Chapter 3, so several questions turn on the difference between the right outcome and the right mechanism.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">7.1 — the correction</span><span class="lz-lnote">Tailwind 3 STRIPS <code>@layer</code> from the output (grep returns 0). It is a build-time relocation instruction, not the CSS feature. Unlayered CSS wins by SOURCE ORDER, not "structurally"</span></div>
<div class="lz-layer"><span class="lz-lname">7.2 — classify before fixing</span><span class="lz-lnote">of 620 unlayered selectors, 358 descendant + 92 pseudo win on SPECIFICITY from anywhere; only 139 single-class ones depend on position</span></div>
<div class="lz-layer"><span class="lz-lname">7.3 — the three bands</span><span class="lz-lnote">base → components → utilities encodes who overrides whom. But layering does NOT change specificity — it only decides ties</span></div>
<div class="lz-layer"><span class="lz-lname">7.4 — Preflight</span><span class="lz-lnote">555 lines, 41 rules, before anything you write. Strips heading sizes, list markers, button appearance — which is why class-less editor HTML needs styling restored</span></div>
<div class="lz-layer"><span class="lz-lname">7.5 — the procedure</span><span class="lz-lnote">does the rule exist → list competitors → compare specificity → only then line numbers. Wrong order gives the wrong answer for 450 of 620 rules</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Chương 7 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này SỬA một lời khẳng định nói lỏng ở Chương 3, nên vài câu xoay quanh khác biệt giữa KẾT QUẢ đúng và CƠ CHẾ đúng.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">7.1 — cú sửa</span><span class="lz-lnote">Tailwind 3 XOÁ <code>@layer</code> khỏi đầu ra (grep trả 0). Nó là chỉ thị DI DỜI lúc dựng, không phải tính năng CSS. CSS không-layer thắng nhờ THỨ TỰ NGUỒN, không phải "cấu trúc"</span></div>
<div class="lz-layer"><span class="lz-lname">7.2 — phân loại trước khi vá</span><span class="lz-lnote">trong 620 selector không-layer, 358 con cháu + 92 lớp giả thắng nhờ ĐỘ ĐẶC HIỆU từ bất cứ đâu; chỉ 139 cái lớp-đơn phụ thuộc vị trí</span></div>
<div class="lz-layer"><span class="lz-lname">7.3 — ba dải</span><span class="lz-lnote">base → components → utilities mã hoá ai đè ai. Nhưng layer KHÔNG đổi độ đặc hiệu — nó chỉ quyết định khi HOÀ</span></div>
<div class="lz-layer"><span class="lz-lname">7.4 — Preflight</span><span class="lz-lnote">555 dòng, 41 quy tắc, trước mọi thứ bạn viết. Lột cỡ tiêu đề, dấu danh sách, diện mạo nút — đó là lý do HTML trình soạn không-lớp cần được đặt lại kiểu</span></div>
<div class="lz-layer"><span class="lz-lname">7.5 — quy trình</span><span class="lz-lnote">quy tắc có tồn tại không → liệt kê kẻ cạnh tranh → so độ đặc hiệu → RỒI mới số dòng. Sai thứ tự thì cho đáp án SAI với 450 trên 620 quy tắc</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You run <code>grep -c "@layer" out.css</code> on a Tailwind 3.4 build. What comes back, and why?|||Bạn chạy <code>grep -c "@layer" out.css</code> trên một bản dựng Tailwind 3.4. Kết quả là gì, và vì sao?',
            options: [
              'Zero — Tailwind 3 uses @layer as a BUILD-TIME relocation instruction and discards it, so the output is flat CSS with no cascade layers at all|||KHÔNG — Tailwind 3 dùng @layer như một chỉ thị DI DỜI LÚC DỰNG rồi vứt nó đi, nên đầu ra là CSS PHẲNG không có cascade layer nào',
              'Three — one for each of base, components and utilities|||Ba — mỗi cái cho base, components và utilities',
              'One — a single @layer statement declaring the order|||Một — một câu lệnh @layer khai báo thứ tự',
              'It varies with how many @layer blocks you wrote|||Nó thay đổi theo số khối @layer bạn viết',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The same custom rule is written once before the @tailwind directives and once after. What differs?|||Cùng một quy tắc tuỳ biến viết một lần TRƯỚC các chỉ thị @tailwind và một lần SAU. Khác gì?',
            options: [
              'Everything — unlayered CSS stays exactly where you wrote it, so before the directives it loses to utilities and after them it wins. Position IS the mechanism|||MỌI THỨ — CSS không-layer nằm ĐÚNG chỗ bạn viết, nên trước các chỉ thị thì nó THUA tiện ích và sau chúng thì nó THẮNG. VỊ TRÍ chính LÀ cơ chế',
              'Nothing — Tailwind sorts all rules canonically|||Không gì — Tailwind sắp mọi quy tắc theo thứ tự chuẩn',
              'Only the file size differs|||Chỉ kích thước file khác',
              'The earlier one wins, because it is parsed first|||Cái trước thắng, vì nó được phân tích trước',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Wrapping a rule in <code>@layer utilities</code> makes its position in your source file irrelevant. Why?|||Bọc một quy tắc trong <code>@layer utilities</code> làm vị trí của nó trong file nguồn trở nên vô nghĩa. Vì sao?',
            options: [
              'Because the directive RELOCATES the rule into the generated utilities block — that relocation is the entire feature in Tailwind 3|||Vì chỉ thị ấy DI DỜI quy tắc vào khối utilities được phát sinh — cú di dời ấy CHÍNH LÀ toàn bộ tính năng trong Tailwind 3',
              'Because CSS cascade layers override source order|||Vì cascade layer của CSS đè lên thứ tự nguồn',
              'Because utilities are marked !important|||Vì tiện ích được đánh dấu !important',
              'It does not — position still matters|||Không phải — vị trí vẫn quan trọng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Of 620 unlayered selectors, how many would actually change behaviour if you moved the @tailwind directives to the bottom?|||Trong 620 selector không-layer, bao nhiêu cái THẬT SỰ đổi hành vi nếu bạn dời các chỉ thị @tailwind xuống cuối?',
            options: [
              '139 — only the single-class rules tie with utilities at 0,1,0. The 358 descendant and 92 pseudo rules win on specificity from anywhere and are unaffected|||139 — chỉ các quy tắc lớp-đơn HOÀ với tiện ích ở 0,1,0. 358 quy tắc con cháu và 92 lớp giả thắng nhờ độ đặc hiệu từ bất cứ đâu và KHÔNG bị ảnh hưởng',
              'All 620 — every unlayered rule depends on position|||Cả 620 — mọi quy tắc không-layer đều phụ thuộc vị trí',
              'None — specificity always decides|||Không cái nào — độ đặc hiệu luôn quyết định',
              '450 — the descendant and pseudo rules|||450 — các quy tắc con cháu và lớp giả',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Does moving a <code>0,2,0</code> descendant rule into <code>@layer components</code> let a <code>0,1,0</code> utility override it?|||Dời một quy tắc con cháu <code>0,2,0</code> vào <code>@layer components</code> có cho một tiện ích <code>0,1,0</code> đè được nó không?',
            options: [
              'No — layering does NOT change specificity. The descendant rule still wins; layers only decide the outcome when specificity ties|||KHÔNG — layer KHÔNG đổi độ đặc hiệu. Quy tắc con cháu VẪN thắng; layer chỉ quyết định kết quả khi độ đặc hiệu HOÀ',
              'Yes — the components layer is emitted before utilities, so utilities win|||CÓ — layer components phát sinh trước utilities, nên tiện ích thắng',
              'Yes, but only for properties utilities also set|||CÓ, nhưng chỉ với các thuộc tính mà tiện ích cũng đặt',
              'Only if you also add !important to the utility|||Chỉ khi bạn thêm !important vào tiện ích nữa',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does this repo need 135 hand-written <code>.rich-content</code> rules?|||Vì sao kho này cần 135 quy tắc <code>.rich-content</code> viết tay?',
            options: [
              'Preflight strips heading sizes, list markers and button appearance, and the TipTap editor emits class-less semantic HTML — so something must restore the styling that Preflight removed|||Preflight lột cỡ tiêu đề, dấu danh sách và diện mạo nút, còn trình soạn TipTap phát ra HTML ngữ nghĩa KHÔNG lớp — nên phải có thứ gì đó ĐẶT LẠI kiểu dáng mà Preflight đã gỡ',
              'Because @apply is forbidden in this codebase|||Vì @apply bị cấm trong kho mã này',
              'To raise specificity above the utility layer|||Để nâng độ đặc hiệu lên trên layer tiện ích',
              'Because Tailwind cannot style h2 elements|||Vì Tailwind không tạo kiểu được cho thẻ h2',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: '<code>.text-3xl</code> sits at line 2412 and <code>.rich-content h2</code> at line 1893. Which wins on an editor heading?|||<code>.text-3xl</code> ở dòng 2412 và <code>.rich-content h2</code> ở dòng 1893. Cái nào thắng trên một tiêu đề của trình soạn?',
            options: [
              '<code>.rich-content h2</code> — it scores 0,1,1 against 0,1,0, and specificity is compared BEFORE source order, so being emitted later does not save <code>.text-3xl</code>|||<code>.rich-content h2</code> — nó đạt 0,1,1 đối lập 0,1,0, và độ đặc hiệu được so TRƯỚC thứ tự nguồn, nên việc được phát sinh SAU không cứu được <code>.text-3xl</code>',
              '<code>.text-3xl</code> — it comes later in the file|||<code>.text-3xl</code> — nó đứng sau trong file',
              'Neither; they set different properties|||Không cái nào; chúng đặt hai thuộc tính khác nhau',
              'Whichever appears first in the class attribute|||Cái nào xuất hiện trước trong thuộc tính lớp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which question can the built CSS file answer that DevTools cannot?|||Câu hỏi nào file CSS ĐÃ DỰNG trả lời được mà DevTools không?',
            options: [
              '"Was this class ever generated?" — DevTools shows the class on the element whether or not a rule exists, so an absent rule looks identical to one that lost|||"Lớp này có TỪNG được phát sinh không?" — DevTools hiện cái lớp trên thẻ bất kể có quy tắc hay không, nên một quy tắc VẮNG MẶT trông y hệt một quy tắc đã THUA',
              '"Which rule is currently winning?"|||"Quy tắc nào đang thắng?"',
              '"What is the computed value?"|||"Giá trị được tính là gì?"',
              '"Which declarations are struck through?"|||"Khai báo nào bị gạch ngang?"',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
