const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 6: Biến CSS làm cơ chế theme.
 * Số đo: 197 biến CSS trong globals.css; và một PHÁT HIỆN THẬT —
 * 91 lớp có bổ từ độ mờ trên màu var() KHÔNG hề được phát sinh.
 */

export default {
  title: 'Chapter 6 — CSS variables as the theme mechanism|||Chương 6 — Biến CSS làm cơ chế theme',
  slug: 'tw-ch6-bien-css',
  description: 'Cách MỘT tên lớp đúng ở CẢ hai theme mà không cần biến thể nào — và cái bẫy `<alpha-value>` mà kho này đang dính: 91 lớp có bổ từ độ mờ KHÔNG hề tồn tại trong CSS đầu ra.',
  sortOrder: 7,
  lessons: [

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — One class, correct in both themes|||6.1 — MỘT lớp, đúng ở CẢ hai theme',
      slug: 'tw-6-1-mot-lop',
      type: 'VIDEO',
      description: 'Chương 5 cho thấy bảng-màu-cặp THẤT BẠI (bốn màu sáng dùng 0 lần). Đây là cái đã thắng: đặt `var(--x)` vào config, để giá trị phân giải LÚC CHẠY, và một tên lớp duy nhất đúng ở mọi theme. Dùng 5.558 lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>One class, correct in both themes</h2>
<p class="lead">Chapter 5 measured a design that failed: four light-theme colours declared and used zero times, because choosing between a colour pair needs a variant at every call site. This chapter is the design that worked in the same codebase, and the mechanism is three lines.</p>

<h3>The mechanism</h3>
<pre><code class="language-ts">// tailwind.config.ts
colors: {
  text: {
    primary:   "var(--text-primary)",
    secondary: "var(--text-secondary)",
    muted:     "var(--text-muted)",
  },
},
</code></pre>

<pre><code class="language-css">/* globals.css */
:root            { --text-primary: #1c1e21; }   /* light */
html.theme-dark  { --text-primary: #e4e6eb; }   /* dark  */
</code></pre>

<div class="out">.text-text-primary { color: var(--text-primary) }
</div>

<p>One rule. Tailwind emits <code>var(--text-primary)</code> literally and never resolves it — resolution happens in the browser, per element, at paint time. Toggle <code>theme-dark</code> on <code>&lt;html&gt;</code> and every element using that class re-resolves to the other value. No variant, no second class, no rebuild.</p>

<div class="callout ok">
<p><strong>Why this cannot be half-applied.</strong> The failure mode from Chapter 5 was writing <code>bg-darkcard</code> and forgetting the light counterpart — a mistake that is invisible until someone switches themes. Here there is nothing to forget: there is only one class to write, and it is correct by construction. The whole class of bug disappears rather than being caught.</p>
</div>

<h3>The measured outcome</h3>
<div class="out">text-text-muted       2114
text-text-primary     1389
text-text-secondary    801
                      ─────
                      4304

lightbg / lightcard / lightsurface / lightborder    0
</div>

<p>Same repository, same problem, two designs. The variable-backed family is used 4,304 times. The paired-palette family it was meant to replace is used zero. That is as clear an outcome as a codebase ever gives you.</p>

<h3>Why the config layer is worth keeping</h3>
<p>You could skip the config and write <code>text-[var(--text-primary)]</code> directly — the arbitrary-value syntax accepts variables. This repo does that 281 times with <code>text-[var(--text-secondary)]</code>. It works, and it is worse:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">via config</span><span class="lz-nsub"><code>text-text-primary</code></span></span>
<span class="lz-nbody">The variable name appears once, in the config. Renaming <code>--text-primary</code> is a one-line change. Editor autocomplete offers the class. Typos are visibly wrong classes.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">via arbitrary value</span><span class="lz-nsub"><code>text-[var(--text-secondary)]</code></span></span>
<span class="lz-nbody">The variable name is repeated at all 281 call sites. No autocomplete. A typo produces a class that generates fine and resolves to nothing, so the text silently inherits its parent colour — a failure with no error at any stage.</span>
</div>
</div>

<p>Both compile to the same CSS. The difference is entirely maintainability, which is why the 281 bracket uses are worth migrating even though nothing is broken today.</p>

<h3>What a variable can hold</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">colours</span><span class="lz-lnote">the main use, and the one with a subtlety this chapter's next lesson is entirely about</span></div>
<div class="lz-layer"><span class="lz-lname">any length</span><span class="lz-lnote"><code>spacing: { gutter: 'var(--gutter)' }</code> — useful when a measurement must change with layout context rather than with a breakpoint</span></div>
<div class="lz-layer"><span class="lz-lname">whole shadows or gradients</span><span class="lz-lnote">a variable can hold a multi-part value. This repo's four-layer <code>premium-card</code> shadow could be one, letting the shadow differ per theme without a second utility</span></div>
<div class="lz-layer"><span class="lz-lname">values set from JavaScript</span><span class="lz-lnote"><code>el.style.setProperty('--progress', pct + '%')</code> and then <code>w-[var(--progress)]</code>. This is the one clean way to give a runtime-computed value a real class — recall lesson 0.1: the generator never sees runtime values, but it does not need to when the class is fixed and only the variable moves</span></div>
</div>

<h3>Scoping, which is where the real power is</h3>
<p>Variables cascade like any other property, so they can be redefined on a subtree:</p>

<pre><code class="language-html">&lt;div class="bg-card text-text-primary"&gt;
  &lt;!-- normal theme values --&gt;

  &lt;aside style="--text-primary: #ffffff; --bg-card: #1a1a2e"&gt;
    &lt;div class="bg-card text-text-primary"&gt;
      &lt;!-- SAME classes, different colours --&gt;
    &lt;/div&gt;
  &lt;/aside&gt;
&lt;/div&gt;
</code></pre>

<p>The inner element uses identical class names and renders differently, because the variables resolved against a nearer ancestor. This is how a dark sidebar inside a light page, or a preview pane showing the opposite theme, is built without a single variant. It is also exactly what the Notes feature needed in the 2026-07-02 incident — a scoped theme — and what <code>.dark</code> failed to give it because <code>:is(.dark *)</code> has no scope limit.</p>

<div class="pitfall">
<p><strong>Trap — a variable that is not defined anywhere.</strong> <code>var(--typo-here)</code> with no definition resolves to nothing, and the declaration is discarded as invalid at computed-value time. For <code>color</code> that means the element inherits its parent's colour, which is often close enough to look intentional. Nothing errors, and the class exists in the CSS. Always supply a fallback for anything load-bearing: <code>var(--text-primary, #1c1e21)</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Putting <code>var(--x)</code> in the config makes Tailwind emit the variable rather than a colour, so resolution moves to the browser and one class name is correct in every theme — which is why the variable-backed family here is used 4,304 times while the paired palette it replaced is used zero.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Using CSS custom properties</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — cascade behaviour, scoping, fallback syntax, and what happens when a variable is undefined.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Using CSS variables as colours</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors#using-css-variables — the config syntax, and the <code>&lt;alpha-value&gt;</code> note that lesson 6.2 measures the cost of ignoring.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — invalid at computed-value time</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Value_processing — why an undefined variable makes a declaration silently disappear rather than error.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 5 — the design this replaced</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — the paired palette measured at zero uses, and why a colour whose correct use needs a second step gets half-applied.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>MỘT lớp, đúng ở CẢ hai theme</h2>
<p class="lead">Chương 5 đã đo một thiết kế THẤT BẠI: bốn màu theme sáng được khai và dùng KHÔNG lần, vì chọn giữa một cặp màu cần một biến thể ở MỌI chỗ gọi. Chương này là thiết kế đã THẮNG trong CÙNG kho mã ấy, và cơ chế gói trong BA dòng.</p>

<h3>Cơ chế</h3>
<pre><code class="language-ts">// tailwind.config.ts
colors: {
  text: {
    primary:   "var(--text-primary)",
    secondary: "var(--text-secondary)",
    muted:     "var(--text-muted)",
  },
},
</code></pre>

<pre><code class="language-css">/* globals.css */
:root            { --text-primary: #1c1e21; }   /* sang */
html.theme-dark  { --text-primary: #e4e6eb; }   /* toi  */
</code></pre>

<div class="out">.text-text-primary { color: var(--text-primary) }
</div>

<p>MỘT quy tắc. Tailwind phát sinh <code>var(--text-primary)</code> NGUYÊN VĂN và KHÔNG BAO GIỜ phân giải nó — việc phân giải xảy ra trong TRÌNH DUYỆT, theo từng thẻ, lúc vẽ. Bật <code>theme-dark</code> trên <code>&lt;html&gt;</code> và MỌI thẻ dùng lớp ấy tự phân giải lại sang giá trị kia. Không biến thể, không lớp thứ hai, không dựng lại.</p>

<div class="callout ok">
<p><strong>Vì sao cái này KHÔNG THỂ bị áp nửa vời.</strong> Kiểu hỏng ở Chương 5 là viết <code>bg-darkcard</code> rồi QUÊN đối tác sáng — một sai lầm VÔ HÌNH cho tới khi ai đó đổi theme. Ở đây KHÔNG có gì để quên: chỉ có MỘT lớp để viết, và nó ĐÚNG theo cấu tạo. Cả một LỚP con bọ BIẾN MẤT thay vì bị bắt.</p>
</div>

<h3>Kết quả ĐO ĐƯỢC</h3>
<div class="out">text-text-muted       2114
text-text-primary     1389
text-text-secondary    801
                      ─────
                      4304

lightbg / lightcard / lightsurface / lightborder    0
</div>

<p>Cùng kho, cùng bài toán, HAI thiết kế. Họ dựa-trên-biến được dùng 4.304 lần. Họ bảng-màu-cặp mà nó định thay thế được dùng KHÔNG lần. Đó là một kết quả RÕ RÀNG hết mức mà một kho mã có thể cho bạn.</p>

<h3>Vì sao tầng CONFIG đáng giữ</h3>
<p>Bạn CÓ THỂ bỏ qua config và viết thẳng <code>text-[var(--text-primary)]</code> — cú pháp giá trị tuỳ ý NHẬN biến. Kho này làm thế 281 lần với <code>text-[var(--text-secondary)]</code>. Nó CHẠY, và nó TỆ HƠN:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">qua CONFIG</span><span class="lz-nsub"><code>text-text-primary</code></span></span>
<span class="lz-nbody">Tên biến xuất hiện MỘT lần, trong config. Đổi tên <code>--text-primary</code> là một thay đổi MỘT DÒNG. Trình soạn thảo gợi ý được cái lớp. Gõ sai đẻ ra một lớp SAI NHÌN THẤY ĐƯỢC.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">qua giá trị TUỲ Ý</span><span class="lz-nsub"><code>text-[var(--text-secondary)]</code></span></span>
<span class="lz-nbody">Tên biến LẶP LẠI ở cả 281 chỗ gọi. Không gợi ý. Một cú gõ sai đẻ ra một lớp SINH RA BÌNH THƯỜNG và phân giải thành KHÔNG GÌ, nên chữ âm thầm KẾ THỪA màu của thẻ cha — một cú hỏng KHÔNG có lỗi ở bất kỳ giai đoạn nào.</span>
</div>
</div>

<p>Cả hai biên dịch ra CÙNG CSS. Khác biệt hoàn toàn nằm ở khả năng BẢO TRÌ, đó là lý do 281 lượt dùng ngoặc ĐÁNG di trú dù hôm nay không có gì hỏng.</p>

<h3>Một biến chứa được gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">màu</span><span class="lz-lnote">công dụng chính, và là cái có một điểm tinh tế mà cả bài KẾ TIẾP của chương này dành trọn cho nó</span></div>
<div class="lz-layer"><span class="lz-lname">bất kỳ độ dài nào</span><span class="lz-lnote"><code>spacing: { gutter: 'var(--gutter)' }</code> — hữu ích khi một phép đo phải đổi theo NGỮ CẢNH BỐ CỤC chứ không theo một điểm ngắt</span></div>
<div class="lz-layer"><span class="lz-lname">trọn một cái bóng hay gradient</span><span class="lz-lnote">một biến chứa được một giá trị NHIỀU PHẦN. Cái bóng bốn-tầng <code>premium-card</code> của kho này có thể là một biến, cho phép cái bóng khác nhau theo từng theme mà không cần tiện ích thứ hai</span></div>
<div class="lz-layer"><span class="lz-lname">giá trị đặt TỪ JavaScript</span><span class="lz-lnote"><code>el.style.setProperty('--progress', pct + '%')</code> rồi <code>w-[var(--progress)]</code>. Đây là cách SẠCH duy nhất để cho một giá trị tính-lúc-chạy có một cái lớp THẬT — nhớ bài 0.1: trình sinh không bao giờ thấy giá trị lúc chạy, nhưng nó KHÔNG CẦN thấy khi cái LỚP cố định và chỉ cái BIẾN di chuyển</span></div>
</div>

<h3>Giới hạn phạm vi, chỗ có SỨC MẠNH thật</h3>
<p>Biến CASCADE như mọi thuộc tính khác, nên chúng ĐỊNH NGHĨA LẠI được trên một cây con:</p>

<pre><code class="language-html">&lt;div class="bg-card text-text-primary"&gt;
  &lt;!-- gia tri theme binh thuong --&gt;

  &lt;aside style="--text-primary: #ffffff; --bg-card: #1a1a2e"&gt;
    &lt;div class="bg-card text-text-primary"&gt;
      &lt;!-- CUNG lop, KHAC mau --&gt;
    &lt;/div&gt;
  &lt;/aside&gt;
&lt;/div&gt;
</code></pre>

<p>Thẻ bên trong dùng tên lớp Y HỆT và dựng ra KHÁC, vì các biến phân giải theo một TỔ TIÊN GẦN HƠN. Đây là cách dựng một thanh bên tối bên trong một trang sáng, hay một khoang xem trước hiện theme ngược lại, mà KHÔNG cần một biến thể nào. Nó cũng CHÍNH XÁC là thứ tính năng Notes cần trong sự cố 02/07/2026 — một theme CÓ PHẠM VI — và là thứ <code>.dark</code> KHÔNG cho được vì <code>:is(.dark *)</code> không có giới hạn phạm vi.</p>

<div class="pitfall">
<p><strong>Bẫy — một biến KHÔNG được định nghĩa ở đâu cả.</strong> <code>var(--go-sai-o-day)</code> không có định nghĩa thì phân giải thành KHÔNG GÌ, và khai báo bị VỨT như không hợp lệ lúc tính giá trị. Với <code>color</code> điều đó nghĩa là thẻ KẾ THỪA màu của cha, thường đủ gần để TRÔNG như có chủ ý. Không lỗi nào, và cái lớp CÓ trong CSS. Hãy LUÔN cung cấp giá trị dự phòng cho bất cứ thứ gì chịu lực: <code>var(--text-primary, #1c1e21)</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Đặt <code>var(--x)</code> vào config khiến Tailwind phát sinh CÁI BIẾN thay vì một màu, nên việc phân giải DỜI sang trình duyệt và MỘT tên lớp đúng ở MỌI theme — đó là lý do họ dựa-trên-biến ở đây được dùng 4.304 lần trong khi bảng màu cặp mà nó thay thế được dùng KHÔNG lần.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Using CSS custom properties</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — hành vi cascade, giới hạn phạm vi, cú pháp dự phòng, và chuyện gì xảy ra khi một biến không được định nghĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — dùng biến CSS làm màu</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors#using-css-variables — cú pháp config, và ghi chú <code>&lt;alpha-value&gt;</code> mà bài 6.2 đo cái giá của việc PHỚT LỜ nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — invalid at computed-value time</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Value_processing — vì sao một biến không định nghĩa làm một khai báo BIẾN MẤT ÂM THẦM chứ không báo lỗi.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 5 — thiết kế mà cái này thay thế</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — bảng màu cặp đo được 0 lượt dùng, và vì sao một cái màu mà việc dùng đúng đòi một bước thứ hai thì bị áp nửa vời.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — The alpha-value trap: 91 classes that do not exist|||6.2 — Bẫy alpha-value: 91 lớp KHÔNG hề tồn tại',
      slug: 'tw-6-2-bay-alpha',
      type: 'VIDEO',
      description: 'Dạng `var(--x)` hiển nhiên làm HỎNG bổ từ độ mờ — `bg-x/50` KHÔNG được phát sinh chút nào. Kho này viết 91 lớp như thế. Chín mươi mốt chỗ chữ được viết ở 30-80% độ mờ đang hiện ra ĐẶC 100%.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The alpha-value trap: 91 classes that do not exist</h2>
<p class="lead">Lesson 6.1's config is the obvious way to put a variable in a colour, and it is subtly incomplete. This lesson measures what it costs, finds ninety-one live instances of the cost in this repository, and gives the two-part fix.</p>

<h3>The measurement</h3>
<p>Two colours, defined two ways, with and without an opacity modifier:</p>

<pre><code class="language-js">colors: {
  naive: 'var(--c-naive)',                        // the obvious way
  smart: 'rgb(var(--c-smart) / &lt;alpha-value&gt;)',   // the documented way
}
</code></pre>

<pre><code class="language-html">&lt;div class="bg-naive bg-naive/50 bg-smart bg-smart/50"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.bg-naive        { background-color: var(--c-naive) }

.bg-smart        { --tw-bg-opacity: 1;
                   background-color: rgb(var(--c-smart) / var(--tw-bg-opacity)) }

.bg-smart\\/50    { background-color: rgb(var(--c-smart) / 0.5) }

# .bg-naive\\/50 — KHONG CO. Khong duoc phat sinh chut nao.
</div>

<p>Three rules for four classes. <code>bg-naive/50</code> <strong>was not generated</strong>. Tailwind cannot inject an alpha channel into an opaque value it does not understand, so it declines to emit the rule at all — and declines silently.</p>

<div class="callout warn">
<p><strong>This is lesson 0.1's bug wearing a new costume.</strong> The class is in your markup. It looks right in DevTools. The rule it refers to was never written. The element renders at full opacity, and because full opacity usually looks <em>fine</em> — just slightly wrong — nobody files a bug.</p>
</div>

<h3>Finding it in the live codebase</h3>
<p>This repository's config uses the naive form (<code>primary: "var(--text-primary)"</code>). So the question is whether anything ever tries an opacity modifier on those colours:</p>

<pre><code class="language-bash">$ grep -rhoE '\\b(bg|text|border|ring)-(text-(primary|secondary|muted)|cat-[a-z]+-[a-z]+)/[0-9]+' \\
    src --include="*.tsx" | sort | uniq -c
</code></pre>

<div class="out">     15 text-text-muted/30
     10 text-text-muted/40
     13 text-text-muted/50
     22 text-text-muted/60
     22 text-text-muted/70
      3 text-text-muted/80
      1 text-text-primary/70
      1 bg-text-muted/40
      1 bg-text-muted/50
      1 border-text-muted/30
      1 bg-cat-ai-icon/10
      1 ring-cat-ai-icon/40
        ─────
     91
</div>

<p><strong>Ninety-one.</strong> Every one of those is a developer asking for partially-transparent text and getting fully opaque text. Confirmed by building with this repo's exact config shape:</p>

<div class="out">$ cat out.css
.text-text-muted { color: var(--text-muted) }

$ grep -c 'text-text-muted\\\\/60' out.css
0     &lt;- KHONG duoc phat sinh
</div>

<p>Only the base class exists. Both <code>/60</code> and <code>/70</code> are absent from the output.</p>

<div class="callout warn">
<p><strong>Why this survived review and testing.</strong> Nothing errors at any stage. TypeScript is happy — it never sees class strings. The build succeeds. The linter has no opinion. Visual regression tests pass if the baseline was captured after the bug existed. And the rendered result — muted grey text at 100% instead of 60% — is a small enough difference that it reads as a design choice rather than a defect.</p>
</div>

<h3>The fix, which is two changes not one</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">rewrite the variables as channels</span><span class="lz-d"><code>--text-muted: 100 116 139</code> — space-separated RGB numbers, <em>no</em> <code>rgb()</code> wrapper and no <code>#</code>. The variable now holds the channels, not a finished colour.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">wrap in the config</span><span class="lz-d"><code>muted: 'rgb(var(--text-muted) / &lt;alpha-value&gt;)'</code>. Tailwind substitutes the literal token <code>&lt;alpha-value&gt;</code> with <code>1</code> for the bare class and with <code>0.6</code> for <code>/60</code>.</span></div>
<div class="lz-step"><span class="lz-k">!</span><span class="lz-t">both, or neither works</span><span class="lz-d">Changing only the config produces <code>rgb(#64748b / 1)</code>, which is invalid CSS and renders nothing. Changing only the variables produces <code>var(--text-muted)</code> resolving to <code>100 116 139</code>, also not a colour. This is a single atomic change across two files.</span></div>
</div>

<div class="callout warn">
<p><strong>The migration hazard.</strong> Because both halves must land together, the danger is a partial deploy — config shipped, <code>globals.css</code> not, or the two in separate commits that get reverted independently. The result is not "opacity still broken"; it is <em>every</em> use of that colour rendering as nothing. A bug affecting 4,304 call sites, from a change meant to fix 91. Ship the two files in one commit.</p>
</div>

<h3>Why the format is so awkward</h3>
<p><code>--text-muted: 100 116 139</code> is unreadable as a colour, and that is a genuine cost. The reason is that CSS has no way to inject an alpha channel into an already-formed colour value — <code>rgb(#64748b / 0.5)</code> is not valid syntax. The channels must be separate <em>before</em> the alpha is applied, so the variable has to hold the pre-assembly parts.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the cost</span><span class="lz-lnote">a designer opening <code>globals.css</code> sees <code>100 116 139</code> instead of <code>#64748b</code>. Add the hex in a comment; there is no way to have both in the value</span></div>
<div class="lz-layer"><span class="lz-lname">what it buys</span><span class="lz-lnote">every colour gains all eleven opacity steps for free, which for this repo is 91 currently-dead classes plus every future one nobody has written yet</span></div>
<div class="lz-layer"><span class="lz-lname">when to skip it</span><span class="lz-lnote">a colour that will genuinely never take an opacity modifier can stay in the readable form. The trouble is that "never" is a prediction, and this repo's 91 uses are what that prediction being wrong looks like</span></div>
<div class="lz-layer"><span class="lz-lname">the newer alternative</span><span class="lz-lnote">Tailwind 4 uses <code>@theme</code> and native <code>color-mix()</code>, which removes this whole awkwardness. On Tailwind 3.4 the channel form is the only option</span></div>
</div>

<h3>A guard so it cannot silently regress</h3>
<p>The failure is undetectable by normal tooling, so detect it directly — assert that any opacity-modified class you use actually reached the output CSS:</p>

<pre><code class="language-bash"># after a build, every /NN class in source should exist in the output
$ grep -rhoE '\\b[a-z-]+-(text|cat)-[a-z-]+/[0-9]+' src --include="*.tsx" | sort -u \\
  | while read -r cls; do
      esc=$(echo "$cls" | sed 's#/#\\\\\\\\/#')
      grep -q "$esc" .next/static/css/*.css || echo "DEAD: $cls"
    done
</code></pre>

<p>Ten lines in CI turns a silent visual defect into a build failure. This is the "verify the checker" habit from Chapter 5 applied forward: the interesting bugs are the ones that produce no error, so the check has to look at the artefact rather than at the exit code.</p>

<div class="pitfall">
<p><strong>Trap — assuming the opacity modifier works because the base class does.</strong> They are generated independently. <code>text-text-muted</code> renders perfectly, which is exactly what makes people trust <code>text-text-muted/60</code> without checking. Any time you introduce a variable-backed colour, test the modifier once — one build and one grep settles it permanently for that colour.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A colour defined as plain <code>var(--x)</code> silently refuses to generate its opacity-modified variants, and this repository has ninety-one such classes rendering fully opaque where 30-80% was written — fixable only by changing the variables to space-separated channels <em>and</em> wrapping them in <code>rgb(… / &lt;alpha-value&gt;)</code>, in the same commit.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Using CSS variables with alpha</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors#using-css-variables — the <code>&lt;alpha-value&gt;</code> placeholder and the channel format it requires. One short section, and this whole lesson is the cost of not reading it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — the rgb() slash syntax</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb — why <code>rgb(R G B / A)</code> needs separate channels and cannot take an assembled hex.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — color-mix()</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix — the modern approach that removes the channel-splitting requirement, and what Tailwind 4 builds on.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 10 — the diagnosis cookbook</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — "my class is in the markup but does nothing" as a decision tree, of which this is the most expensive branch.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Bẫy alpha-value: 91 lớp KHÔNG hề tồn tại</h2>
<p class="lead">Cấu hình ở bài 6.1 là cách HIỂN NHIÊN để đặt một biến vào một cái màu, và nó THIẾU một cách tinh vi. Bài này ĐO cái giá của nó, tìm ra chín mươi mốt trường hợp ĐANG SỐNG trong kho này, và đưa ra cú vá HAI PHẦN.</p>

<h3>Phép đo</h3>
<p>Hai màu, định nghĩa hai kiểu, có và không có bổ từ độ mờ:</p>

<pre><code class="language-js">colors: {
  naive: 'var(--c-naive)',                        // cach hien nhien
  smart: 'rgb(var(--c-smart) / &lt;alpha-value&gt;)',   // cach co tai lieu
}
</code></pre>

<pre><code class="language-html">&lt;div class="bg-naive bg-naive/50 bg-smart bg-smart/50"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.bg-naive        { background-color: var(--c-naive) }

.bg-smart        { --tw-bg-opacity: 1;
                   background-color: rgb(var(--c-smart) / var(--tw-bg-opacity)) }

.bg-smart\\/50    { background-color: rgb(var(--c-smart) / 0.5) }

# .bg-naive\\/50 — KHONG CO. Khong duoc phat sinh chut nao.
</div>

<p>BA quy tắc cho BỐN lớp. <code>bg-naive/50</code> <strong>KHÔNG được phát sinh</strong>. Tailwind KHÔNG thể chèn một kênh alpha vào một giá trị ĐỤC mà nó không hiểu, nên nó TỪ CHỐI phát sinh quy tắc ấy chút nào — và từ chối ÂM THẦM.</p>

<div class="callout warn">
<p><strong>Đây là con bọ ở bài 0.1 khoác bộ đồ mới.</strong> Cái lớp CÓ trong mã đánh dấu. Nó TRÔNG đúng trong DevTools. Quy tắc mà nó trỏ tới CHƯA BAO GIỜ được viết. Thẻ hiện ra ở độ mờ ĐẦY, và vì độ mờ đầy thường trông <em>ỔN</em> — chỉ hơi sai — nên KHÔNG AI báo lỗi.</p>
</div>

<h3>Tìm nó trong kho mã ĐANG SỐNG</h3>
<p>Config của kho này dùng dạng NGÂY THƠ (<code>primary: "var(--text-primary)"</code>). Nên câu hỏi là liệu có chỗ nào từng thử một bổ từ độ mờ trên những màu ấy không:</p>

<pre><code class="language-bash">$ grep -rhoE '\\b(bg|text|border|ring)-(text-(primary|secondary|muted)|cat-[a-z]+-[a-z]+)/[0-9]+' \\
    src --include="*.tsx" | sort | uniq -c
</code></pre>

<div class="out">     15 text-text-muted/30
     10 text-text-muted/40
     13 text-text-muted/50
     22 text-text-muted/60
     22 text-text-muted/70
      3 text-text-muted/80
      1 text-text-primary/70
      1 bg-text-muted/40
      1 bg-text-muted/50
      1 border-text-muted/30
      1 bg-cat-ai-icon/10
      1 ring-cat-ai-icon/40
        ─────
     91
</div>

<p><strong>Chín mươi mốt.</strong> MỌI cái trong số đó là một lập trình viên YÊU CẦU chữ trong suốt một phần và NHẬN VỀ chữ đục hoàn toàn. Xác nhận bằng cách dựng với ĐÚNG hình dạng config của kho này:</p>

<div class="out">$ cat out.css
.text-text-muted { color: var(--text-muted) }

$ grep -c 'text-text-muted\\\\/60' out.css
0     &lt;- KHONG duoc phat sinh
</div>

<p>CHỈ có lớp nền tồn tại. Cả <code>/60</code> lẫn <code>/70</code> đều VẮNG khỏi đầu ra.</p>

<div class="callout warn">
<p><strong>Vì sao chuyện này sống sót qua review và kiểm thử.</strong> KHÔNG gì báo lỗi ở bất kỳ giai đoạn nào. TypeScript vui vẻ — nó không bao giờ thấy chuỗi lớp. Bản dựng thành công. Bộ lint không có ý kiến. Kiểm thử hồi quy thị giác QUA nếu ảnh nền được chụp SAU khi con bọ đã tồn tại. Và kết quả dựng ra — chữ xám mờ ở 100% thay vì 60% — là một khác biệt ĐỦ NHỎ để đọc ra thành một lựa chọn thiết kế chứ không phải một khuyết tật.</p>
</div>

<h3>Cú vá, HAI thay đổi chứ không phải một</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">viết lại các biến thành KÊNH</span><span class="lz-d"><code>--text-muted: 100 116 139</code> — các số RGB ngăn bằng khoảng trắng, <em>KHÔNG</em> có vỏ <code>rgb()</code> và không có <code>#</code>. Cái biến giờ chứa các KÊNH, không phải một màu hoàn chỉnh.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">BỌC lại trong config</span><span class="lz-d"><code>muted: 'rgb(var(--text-muted) / &lt;alpha-value&gt;)'</code>. Tailwind thay token nguyên văn <code>&lt;alpha-value&gt;</code> bằng <code>1</code> cho lớp trần và bằng <code>0.6</code> cho <code>/60</code>.</span></div>
<div class="lz-step"><span class="lz-k">!</span><span class="lz-t">CẢ HAI, hoặc không cái nào chạy</span><span class="lz-d">Chỉ đổi config thì đẻ ra <code>rgb(#64748b / 1)</code>, CSS không hợp lệ và dựng ra KHÔNG GÌ. Chỉ đổi các biến thì đẻ ra <code>var(--text-muted)</code> phân giải thành <code>100 116 139</code>, cũng không phải một màu. Đây là MỘT thay đổi NGUYÊN TỬ trải hai file.</span></div>
</div>

<div class="callout warn">
<p><strong>Nguy cơ khi di trú.</strong> Vì cả hai nửa phải ĐÁP CÙNG LÚC, mối nguy là một cú deploy NỬA VỜI — config lên, <code>globals.css</code> không, hoặc hai cái ở hai commit riêng rồi bị revert độc lập. Kết quả KHÔNG phải "độ mờ vẫn hỏng"; nó là <em>MỌI</em> lượt dùng màu ấy dựng ra KHÔNG GÌ. Một con bọ ảnh hưởng 4.304 chỗ gọi, từ một thay đổi định vá 91 chỗ. Hãy giao hai file trong MỘT commit.</p>
</div>

<h3>Vì sao định dạng ấy VỤNG đến thế</h3>
<p><code>--text-muted: 100 116 139</code> KHÔNG đọc ra được là màu gì, và đó là một cái giá THẬT. Lý do là CSS KHÔNG có cách nào chèn một kênh alpha vào một giá trị màu ĐÃ THÀNH HÌNH — <code>rgb(#64748b / 0.5)</code> không phải cú pháp hợp lệ. Các kênh phải RIÊNG RẼ <em>TRƯỚC</em> khi alpha được áp, nên cái biến buộc phải chứa các phần TIỀN-LẮP-RÁP.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">cái giá</span><span class="lz-lnote">một nhà thiết kế mở <code>globals.css</code> sẽ thấy <code>100 116 139</code> thay vì <code>#64748b</code>. Hãy thêm mã hex vào một comment; KHÔNG có cách nào có cả hai trong giá trị</span></div>
<div class="lz-layer"><span class="lz-lname">cái nó mua được</span><span class="lz-lnote">MỌI màu có được cả mười một bậc độ mờ MIỄN PHÍ, với kho này là 91 lớp đang chết cộng với mọi lớp tương lai chưa ai viết</span></div>
<div class="lz-layer"><span class="lz-lname">khi nào BỎ QUA nó</span><span class="lz-lnote">một màu THẬT SỰ sẽ không bao giờ nhận bổ từ độ mờ thì giữ dạng đọc-được cũng được. Rắc rối là chữ "không bao giờ" là một DỰ ĐOÁN, và 91 lượt dùng của kho này chính là hình ảnh của dự đoán ấy SAI</span></div>
<div class="lz-layer"><span class="lz-lname">lựa chọn mới hơn</span><span class="lz-lnote">Tailwind 4 dùng <code>@theme</code> và <code>color-mix()</code> nguyên bản, gỡ bỏ toàn bộ sự vụng về này. Trên Tailwind 3.4 thì dạng kênh là lựa chọn DUY NHẤT</span></div>
</div>

<h3>Một cái chốt để nó không thể ÂM THẦM tái diễn</h3>
<p>Cú hỏng KHÔNG dò được bằng công cụ thông thường, nên hãy dò nó TRỰC TIẾP — khẳng định rằng mọi lớp có bổ từ độ mờ bạn dùng THẬT SỰ tới được CSS đầu ra:</p>

<pre><code class="language-bash"># sau mot lan dung, moi lop /NN trong nguon phai CO trong dau ra
$ grep -rhoE '\\b[a-z-]+-(text|cat)-[a-z-]+/[0-9]+' src --include="*.tsx" | sort -u \\
  | while read -r cls; do
      esc=$(echo "$cls" | sed 's#/#\\\\\\\\/#')
      grep -q "$esc" .next/static/css/*.css || echo "CHET: $cls"
    done
</code></pre>

<p>Mười dòng trong CI biến một khuyết tật thị giác ÂM THẦM thành một cú hỏng bản dựng. Đây là thói quen "kiểm bộ kiểm" từ Chương 5 áp về phía trước: các con bọ THÚ VỊ là những cái KHÔNG đẻ ra lỗi nào, nên phép kiểm buộc phải nhìn vào TẠO TÁC chứ không nhìn vào mã thoát.</p>

<div class="pitfall">
<p><strong>Bẫy — cho rằng bổ từ độ mờ CHẠY vì lớp nền chạy.</strong> Chúng được phát sinh ĐỘC LẬP. <code>text-text-muted</code> dựng ra hoàn hảo, và chính điều đó khiến người ta TIN <code>text-text-muted/60</code> mà không kiểm. Bất cứ khi nào bạn đưa vào một màu dựa-trên-biến, hãy KIỂM cái bổ từ MỘT lần — một lần dựng và một cú grep là dứt điểm VĨNH VIỄN cho màu ấy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một cái màu định nghĩa là <code>var(--x)</code> trần sẽ ÂM THẦM từ chối phát sinh các biến thể có bổ từ độ mờ của nó, và kho này có chín mươi mốt lớp như thế đang dựng ra ĐỤC HOÀN TOÀN ở chỗ 30-80% được viết — chỉ vá được bằng cách đổi các biến sang KÊNH ngăn-bằng-khoảng-trắng <em>VÀ</em> bọc chúng trong <code>rgb(… / &lt;alpha-value&gt;)</code>, trong CÙNG một commit.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — dùng biến CSS với alpha</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors#using-css-variables — chỗ giữ chỗ <code>&lt;alpha-value&gt;</code> và định dạng kênh mà nó đòi. MỘT mục ngắn, và cả bài này là cái giá của việc KHÔNG đọc nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — cú pháp gạch chéo của rgb()</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb — vì sao <code>rgb(R G B / A)</code> cần các kênh RIÊNG và không nhận một mã hex đã lắp ráp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — color-mix()</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix — cách tiếp cận hiện đại gỡ bỏ yêu cầu chẻ-kênh, và là thứ Tailwind 4 dựng trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 10 — sách công thức chẩn đoán</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — "lớp của tôi có trong mã đánh dấu mà không làm gì" dưới dạng một cây quyết định, mà đây là nhánh ĐẮT NHẤT.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Where the 197 variables live|||6.3 — 197 cái biến SỐNG ở đâu',
      slug: 'tw-6-3-cau-truc',
      type: 'VIDEO',
      description: 'Ba khối, ba vai trò: `:root` giữ 42 giá trị SÁNG làm mặc định, `html.theme-dark` đè 40, `html.light` đè 19. Bài này đọc cấu trúc ấy, giải thích vì sao con số bất đối xứng, và vì sao khối thứ ba KHÔNG thừa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Where the 197 variables live</h2>
<p class="lead">A theme system is only as good as its structure. This repository has 197 CSS variables and a three-block layout that looks redundant until you work out what the third block is for — so it is worth reading as a design, not just an inventory.</p>

<h3>The blocks</h3>
<pre><code class="language-bash">$ grep -cE '^\\s*--[a-z]' src/app/globals.css
</code></pre>

<div class="out">197 bien tong cong

:root              dong    7   42 bien
html.theme-dark    dong   77   40 bien
html.light         dong  124   19 bien
+ 11 bien khac rai o cac khoi :root nho hon (splash, pwa, …)
</div>

<h3>Reading <code>:root</code>: light is the default</h3>
<pre><code class="language-css">:root {
  color-scheme: light;
  --bg-primary:   #f0f2f5;
  --bg-card:      #ffffff;
  --text-primary: #050505;
  --text-secondary: #65676b;
  --border-color: #dddfe2;
  /* … 42 total … */
}
</code></pre>

<p>Two things settle the architecture immediately. <code>color-scheme: light</code> is declared, and the values are light — <code>#f0f2f5</code> is a pale grey, <code>#050505</code> is near-black text. So <strong>light is the base state</strong>, and dark is an override applied on top.</p>

<div class="callout ok">
<p><strong>Why that direction matters.</strong> Whatever <code>:root</code> holds is what renders when no theme class is present — during the first paint before JavaScript runs, in a server-rendered response, or if the theme script fails. Making the base light means a failure renders a readable light page. Had the base been dark with light as the override, the same failure would produce a dark page for a user who chose light, which is the more jarring outcome.</p>
</div>

<h3>Why 40 and not 42</h3>
<p><code>html.theme-dark</code> overrides 40 of the 42. Two are deliberately not overridden — values that are genuinely theme-independent, such as an accent hue that is the brand colour in both modes. This is a good sign: a dark block that overrode all 42 would suggest the base block contains nothing shared, which usually means the two themes are really two unrelated palettes wearing one variable namespace.</p>

<h3>Why <code>html.light</code> exists at all</h3>
<p>The nineteen variables in <code>html.light</code> repeat values already in <code>:root</code>. That looks like dead weight, and it is not — it depends on how the theme is toggled:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">toggle by REMOVING the class</span><span class="lz-nsub"><code>html.theme-dark</code> → <code>html</code></span></span>
<span class="lz-nbody">Removing <code>theme-dark</code> falls back to <code>:root</code>, which is light. In this model <code>html.light</code> is genuinely unnecessary.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">toggle by SWAPPING the class</span><span class="lz-nsub"><code>html.theme-dark</code> → <code>html.light</code></span></span>
<span class="lz-nbody">If the theme script always sets <em>some</em> class, then <code>light</code> must define the light values explicitly. It also wins over <code>:root</code> on specificity, so an explicit choice cannot be undercut by a stray base value.</span>
</div>
</div>

<p>The second model is more robust for a third reason: it distinguishes "the user chose light" from "no choice has been made yet", which matters if you ever add a <code>system</code> option that follows the OS. A codebase that only removes the dark class cannot express that difference.</p>

<h3>The naming discipline the list reveals</h3>
<div class="out">--bg-primary  --bg-card  --bg-surface  --bg-surface-hover
--bg-surface-active  --bg-overlay  --bg-glass
--border-color  --border-light  --border-light-hover
--text-primary  --text-secondary  --text-muted
--accent-color  --accent-hover
--shadow-sm  --shadow-md  --shadow-lg  --shadow-xl
</div>

<p>Every name is <code>--&lt;category&gt;-&lt;role&gt;[-&lt;state&gt;]</code>. No pigments, no theme names — exactly the layer-2 discipline from lesson 5.3, applied consistently across nineteen names. Compare this with the <code>darkbg</code>/<code>lightcard</code> family in the Tailwind config, which is the same codebase getting it wrong. The variables are the newer, better-designed half.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">state as a suffix</span><span class="lz-lnote"><code>--bg-surface</code>, <code>--bg-surface-hover</code>, <code>--bg-surface-active</code>. The hover colour is a property of the surface, so it lives next to it and changes with it per theme</span></div>
<div class="lz-layer"><span class="lz-lname">shadows are themed too</span><span class="lz-lnote">four shadow variables, overridden per theme. A shadow tuned for a light background is nearly invisible on a dark one, so shadows must be theme values rather than fixed utilities</span></div>
<div class="lz-layer"><span class="lz-lname">semi-transparent bases</span><span class="lz-lnote"><code>--bg-surface-hover: rgba(0,0,0,0.04)</code> — a translucent black in light mode, presumably a translucent white in dark. Using alpha here means the hover works over any background beneath it</span></div>
</div>

<h3>The gap between the two halves</h3>
<p>This is where the chapter's findings converge. The variables are well-named and correctly structured. The Tailwind config that exposes them is only partly migrated:</p>

<div class="out">Bien CSS dinh nghia:                     197
Duoc phoi qua config (ho &#96;text&#96;):          3   -> dung 4304 lan
Duoc voi toi qua ngoac &#96;[var(--x)]&#96;:      ~8   -> dung  ~900 lan
Con lai: chi voi toi duoc tu CSS thuong
</div>

<p><code>--bg-card</code>, <code>--border-color</code> and most of the other 194 have no config entry, so components reach them through <code>bg-[var(--bg-card)]</code> — 95 uses — or through hand-written CSS. Each of those is a variable name repeated at a call site, with the maintainability cost lesson 6.1 described. The theme system is sound; its exposure through Tailwind is the unfinished part.</p>

<div class="pitfall">
<p><strong>Trap — defining a variable in <code>html.theme-dark</code> and forgetting <code>:root</code>.</strong> The dark theme works, and light mode renders that property as nothing — an undefined variable is invalid at computed-value time, so the declaration is dropped and the element inherits. Because light is the base here, the asymmetry always fails in the same direction: a variable added only to the dark block is broken in light and nobody testing in dark will see it. Add to <code>:root</code> first, then override.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> This theme is 197 variables in three blocks — <code>:root</code> holding light as the base so a failed theme script still renders readably, <code>theme-dark</code> overriding 40 of 42, and <code>html.light</code> making an explicit choice distinguishable from no choice — and its names follow the role discipline the Tailwind config's <code>darkbg</code> family does not.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — color-scheme</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/color-scheme — what declaring it does to form controls, scrollbars and the canvas background, which is why it belongs next to the variables.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Building a colour scheme</span><span class="lc-sub">web.dev/building-a-color-scheme — the base-plus-override structure, and handling the system option alongside an explicit choice.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — custom property fallbacks</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/var — the second argument to <code>var()</code>, and why it is the cheap insurance against the pitfall above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js — setting the theme class before first paint</span><span class="lc-sub">/courses/nextjs/learn${REF} — the inline script that applies the stored theme before hydration, which is what prevents a flash of the base theme.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>197 cái biến SỐNG ở đâu</h2>
<p class="lead">Một hệ theme chỉ tốt bằng CẤU TRÚC của nó. Kho này có 197 biến CSS và một bố cục BA KHỐI trông có vẻ THỪA cho tới khi bạn hiểu ra khối thứ ba để làm gì — nên nó đáng đọc như một THIẾT KẾ, không chỉ như một bản kiểm kê.</p>

<h3>Các khối</h3>
<pre><code class="language-bash">$ grep -cE '^\\s*--[a-z]' src/app/globals.css
</code></pre>

<div class="out">197 bien tong cong

:root              dong    7   42 bien
html.theme-dark    dong   77   40 bien
html.light         dong  124   19 bien
+ 11 bien khac rai o cac khoi :root nho hon (splash, pwa, …)
</div>

<h3>Đọc <code>:root</code>: SÁNG là mặc định</h3>
<pre><code class="language-css">:root {
  color-scheme: light;
  --bg-primary:   #f0f2f5;
  --bg-card:      #ffffff;
  --text-primary: #050505;
  --text-secondary: #65676b;
  --border-color: #dddfe2;
  /* … tong 42 … */
}
</code></pre>

<p>HAI thứ dứt điểm kiến trúc ngay lập tức. <code>color-scheme: light</code> được khai, và các giá trị đều SÁNG — <code>#f0f2f5</code> là xám nhạt, <code>#050505</code> là chữ gần đen. Nên <strong>SÁNG là trạng thái NỀN</strong>, và TỐI là một cú đè chồng lên trên.</p>

<div class="callout ok">
<p><strong>Vì sao CHIỀU ấy quan trọng.</strong> Bất cứ thứ gì <code>:root</code> giữ chính là cái được dựng ra khi KHÔNG có lớp theme nào — trong lần vẽ đầu tiên trước khi JavaScript chạy, trong một phản hồi dựng-ở-máy-chủ, hoặc nếu script theme HỎNG. Đặt nền là SÁNG nghĩa là một cú hỏng dựng ra một trang sáng ĐỌC ĐƯỢC. Nếu nền là tối với sáng làm cú đè, thì cùng cú hỏng ấy sẽ đẻ ra một trang TỐI cho một người dùng đã chọn sáng, kết cục CHỎI hơn nhiều.</p>
</div>

<h3>Vì sao 40 chứ không phải 42</h3>
<p><code>html.theme-dark</code> đè 40 trên 42. Hai cái CỐ Ý không bị đè — những giá trị THẬT SỰ độc lập với theme, chẳng hạn một sắc nhấn là màu thương hiệu ở CẢ hai chế độ. Đây là một dấu hiệu TỐT: một khối tối đè cả 42 sẽ gợi ý rằng khối nền KHÔNG chứa gì dùng chung, thường có nghĩa hai theme thực ra là HAI bảng màu KHÔNG liên quan đội chung một không gian tên biến.</p>

<h3>Vì sao <code>html.light</code> tồn tại chút nào</h3>
<p>Mười chín biến trong <code>html.light</code> LẶP LẠI các giá trị đã có trong <code>:root</code>. Cái đó TRÔNG như trọng lượng chết, và nó KHÔNG phải — chuyện đó phụ thuộc vào cách theme được BẬT TẮT:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bật tắt bằng cách GỠ lớp</span><span class="lz-nsub"><code>html.theme-dark</code> → <code>html</code></span></span>
<span class="lz-nbody">Gỡ <code>theme-dark</code> thì rơi về <code>:root</code>, vốn là sáng. Trong mô hình này <code>html.light</code> THẬT SỰ không cần thiết.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bật tắt bằng cách TRÁO lớp</span><span class="lz-nsub"><code>html.theme-dark</code> → <code>html.light</code></span></span>
<span class="lz-nbody">Nếu script theme LUÔN đặt <em>MỘT</em> lớp nào đó, thì <code>light</code> BUỘC phải định nghĩa các giá trị sáng tường minh. Nó cũng THẮNG <code>:root</code> về độ đặc hiệu, nên một lựa chọn tường minh không thể bị một giá trị nền lạc chỗ cắt dưới chân.</span>
</div>
</div>

<p>Mô hình thứ hai BỀN hơn vì một lý do thứ ba: nó PHÂN BIỆT được "người dùng CHỌN sáng" với "chưa có lựa chọn nào", điều quan trọng nếu bạn từng thêm một tuỳ chọn <code>system</code> bám theo hệ điều hành. Một kho mã chỉ GỠ lớp tối thì KHÔNG diễn đạt được khác biệt ấy.</p>

<h3>Kỷ luật đặt tên mà danh sách phơi ra</h3>
<div class="out">--bg-primary  --bg-card  --bg-surface  --bg-surface-hover
--bg-surface-active  --bg-overlay  --bg-glass
--border-color  --border-light  --border-light-hover
--text-primary  --text-secondary  --text-muted
--accent-color  --accent-hover
--shadow-sm  --shadow-md  --shadow-lg  --shadow-xl
</div>

<p>MỌI cái tên đều là <code>--&lt;nhóm&gt;-&lt;vai trò&gt;[-&lt;trạng thái&gt;]</code>. Không sắc tố, không tên theme — CHÍNH XÁC kỷ luật tầng-2 từ bài 5.3, áp NHẤT QUÁN qua mười chín cái tên. So sánh với họ <code>darkbg</code>/<code>lightcard</code> trong config Tailwind, vốn là CÙNG kho mã làm SAI. Các biến là nửa MỚI HƠN, THIẾT KẾ TỐT HƠN.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">trạng thái làm HẬU TỐ</span><span class="lz-lnote"><code>--bg-surface</code>, <code>--bg-surface-hover</code>, <code>--bg-surface-active</code>. Màu hover là một TÍNH CHẤT của bề mặt, nên nó sống cạnh bề mặt và đổi theo bề mặt ở từng theme</span></div>
<div class="lz-layer"><span class="lz-lname">bóng cũng theo theme</span><span class="lz-lnote">bốn biến bóng, đè theo từng theme. Một cái bóng tinh chỉnh cho nền sáng thì gần như VÔ HÌNH trên nền tối, nên bóng buộc phải là giá trị theme chứ không phải tiện ích cố định</span></div>
<div class="lz-layer"><span class="lz-lname">nền BÁN TRONG SUỐT</span><span class="lz-lnote"><code>--bg-surface-hover: rgba(0,0,0,0.04)</code> — một màu đen trong suốt ở chế độ sáng, hẳn là một màu trắng trong suốt ở chế độ tối. Dùng alpha ở đây nghĩa là cú hover chạy được TRÊN BẤT KỲ nền nào bên dưới</span></div>
</div>

<h3>Khoảng cách giữa hai nửa</h3>
<p>Đây là chỗ các phát hiện của chương HỘI TỤ. Các biến ĐẶT TÊN TỐT và CẤU TRÚC ĐÚNG. Cái config Tailwind PHƠI chúng ra thì mới di trú một phần:</p>

<div class="out">Bien CSS dinh nghia:                     197
Duoc phoi qua config (ho &#96;text&#96;):          3   -> dung 4304 lan
Duoc voi toi qua ngoac &#96;[var(--x)]&#96;:      ~8   -> dung  ~900 lan
Con lai: chi voi toi duoc tu CSS thuong
</div>

<p><code>--bg-card</code>, <code>--border-color</code> và phần lớn 194 cái còn lại KHÔNG có mục config nào, nên các component với tới chúng qua <code>bg-[var(--bg-card)]</code> — 95 lượt — hoặc qua CSS viết tay. MỖI cái trong đó là một tên biến LẶP LẠI ở một chỗ gọi, với cái giá bảo trì mà bài 6.1 đã mô tả. Hệ theme thì LÀNH; cách nó được PHƠI RA qua Tailwind mới là phần CHƯA XONG.</p>

<div class="pitfall">
<p><strong>Bẫy — định nghĩa một biến trong <code>html.theme-dark</code> mà QUÊN <code>:root</code>.</strong> Theme tối chạy, và chế độ sáng dựng thuộc tính ấy thành KHÔNG GÌ — một biến không định nghĩa là không hợp lệ lúc tính giá trị, nên khai báo bị VỨT và thẻ kế thừa. Vì SÁNG là nền ở đây, sự bất đối xứng LUÔN hỏng theo CÙNG một chiều: một biến chỉ thêm vào khối tối thì VỠ ở sáng và không ai kiểm thử trong chế độ tối sẽ thấy. Hãy thêm vào <code>:root</code> TRƯỚC, rồi mới đè.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Theme này là 197 biến trong ba khối — <code>:root</code> giữ SÁNG làm nền để một script theme hỏng vẫn dựng ra trang đọc được, <code>theme-dark</code> đè 40 trên 42, và <code>html.light</code> làm cho một LỰA CHỌN TƯỜNG MINH phân biệt được với KHÔNG LỰA CHỌN — và tên của nó theo đúng kỷ luật vai-trò mà họ <code>darkbg</code> trong config Tailwind KHÔNG theo.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — color-scheme</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/color-scheme — khai nó thì tác động gì tới điều khiển biểu mẫu, thanh cuộn và nền canvas, đó là lý do nó thuộc về chỗ ngay cạnh các biến.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Building a colour scheme</span><span class="lc-sub">web.dev/building-a-color-scheme — cấu trúc nền-cộng-đè, và cách xử lý tuỳ chọn hệ thống song song với một lựa chọn tường minh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — giá trị dự phòng của custom property</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/var — đối số thứ hai của <code>var()</code>, và vì sao nó là bảo hiểm RẺ chống lại cái bẫy bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js — đặt lớp theme TRƯỚC lần vẽ đầu</span><span class="lc-sub">/courses/nextjs/learn${REF} — cái script nội tuyến áp theme đã lưu TRƯỚC hydration, chính là thứ ngăn một cú loé của theme nền.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — When a variable is the wrong tool|||6.4 — Khi một cái biến là công cụ SAI',
      slug: 'tw-6-4-khi-nao-khong',
      type: 'VIDEO',
      description: 'Biến CSS giải quyết theme rất tốt đến mức người ta bắt đầu dùng chúng cho MỌI thứ. Bốn ca mà chúng là câu trả lời SAI — gồm cả một ca chúng âm thầm phá luôn khả năng khử trùng lặp mà Chương 4 đã bảo vệ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>When a variable is the wrong tool</h2>
<p class="lead">Three lessons have shown CSS variables solving a problem the alternative could not. That success is exactly why this lesson is needed: a tool that works well for one job gets applied to jobs it does not fit, and variables have four failure cases worth naming.</p>

<h3>Case 1 — a value that is genuinely constant</h3>
<pre><code class="language-css">/* pointless */
:root { --border-radius-card: 0.75rem; }
</code></pre>

<p>If the value is the same in every theme, at every breakpoint, forever, then <code>rounded-xl</code> already says it and says it better. The variable adds an indirection that must be followed to answer "what does this look like", and buys nothing. Variables earn their cost by <em>varying</em>; one that never varies is a rename with extra steps.</p>

<div class="callout ok">
<p><strong>The test.</strong> Name the axis it varies along — theme, container, user preference, runtime state. If you cannot name one, use the utility. "It might change later" does not count: a config entry (Chapter 5) already gives you one place to change it, without moving resolution to the browser.</p>
</div>

<h3>Case 2 — something a variant already expresses</h3>
<pre><code class="language-html">&lt;!-- wrong: reimplementing responsive with a variable --&gt;
&lt;div class="p-[var(--pad)]" style="--pad: 1rem"&gt;

&lt;!-- right: the mechanism built for this --&gt;
&lt;div class="p-4 md:p-8"&gt;
</code></pre>

<p>Breakpoints, hover, focus and dark mode all have variants. Routing them through variables loses everything Chapter 2 measured — a media query cannot be expressed as a variable value, so you end up writing the media query anyway, in CSS, to set the variable. Two mechanisms doing one job.</p>

<h3>Case 3 — the deduplication trap</h3>
<p>This one is subtle and worth the most attention, because it undoes an argument from Chapter 4:</p>

<pre><code class="language-html">&lt;!-- 200 cards, each with its own inline variable --&gt;
&lt;div class="bg-[var(--card-bg)]" style="--card-bg: #1e293b"&gt;
</code></pre>

<p>The class <code>bg-[var(--card-bg)]</code> is generated once — that part is fine. But every element now carries an inline <code>style</code> attribute, and 200 of those are 200 copies of the same string in the HTML payload. You have moved the duplication from the stylesheet, where it was deduplicated, into the markup, where it is not.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">variable set on an ANCESTOR</span><span class="lz-nsub">correct</span></span>
<span class="lz-nbody">One declaration on a container, inherited by every descendant. This is the scoping from lesson 6.1 and it is the whole point — one definition, many consumers.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">variable set on EVERY element</span><span class="lz-nsub">a regression</span></span>
<span class="lz-nbody">If every element needs its own value, the value is per-element data, not a theme. Either it is genuinely dynamic — inline style is honest and correct — or it is a fixed set, in which case it should be a class.</span>
</div>
</div>

<h3>Case 4 — a variable holding a whole class list</h3>
<pre><code class="language-jsx">{/* does not work, and fails silently */}
const cls = 'flex items-center';
&lt;div style={{ '--x': cls }} className="[var(--x)]"&gt;
</code></pre>

<p>Variables hold <em>property values</em>, not selectors or class names. There is no mechanism by which a variable becomes a class. This looks obvious written out, and it still appears regularly — usually as an attempt to solve the dynamic-class problem from lesson 0.1. That problem has one solution: write complete class names literally, and pick between them.</p>

<h3>The performance question, in proportion</h3>
<p>Variables resolve at computed-value time on every element that uses them, so there is a real cost — but proportion matters:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a few hundred elements</span><span class="lz-lnote">unmeasurable. This repo has 197 variables across thousands of elements and no reported issue. Do not optimise this</span></div>
<div class="lz-layer"><span class="lz-lname">changing a variable on <code>:root</code></span><span class="lz-lnote">invalidates style for every descendant that reads it — which is the entire document. Fine for a theme toggle happening once. Not fine inside a <code>requestAnimationFrame</code> loop</span></div>
<div class="lz-layer"><span class="lz-lname">animating a variable</span><span class="lz-lnote">a custom property is not interpolatable by default, so transitions on it snap rather than animate unless registered via <code>@property</code>. Usually the sign that a transform or opacity was the right tool</span></div>
<div class="lz-layer"><span class="lz-lname">deep chains</span><span class="lz-lnote"><code>--a: var(--b)</code> where <code>--b: var(--c)</code>. Each level resolves per element. Two levels is normal; five is a design that has lost track of where values come from</span></div>
</div>

<h3>The rule</h3>
<div class="callout">
<p><strong>Use a variable when a single class name must produce different values depending on context the class cannot see</strong> — the active theme, an ancestor's scope, a runtime measurement. That is a narrow condition, and everything outside it is better served by a utility, a variant, or a config entry.</p>
</div>

<div class="pitfall">
<p><strong>Trap — migrating utilities to variables because variables solved the theme problem.</strong> The pattern is: theme via variables works beautifully, so spacing, radii and font sizes get variables too. Six months later the class list still says <code>p-[var(--pad-card)]</code> everywhere, nobody can tell what the padding is without opening two files, and none of those values ever varied. The theme problem was specific; the solution does not generalise to values that do not vary.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A CSS variable earns its indirection only when one class must resolve differently by context — so a value that never varies belongs in a utility, something a variant expresses belongs in a variant, a per-element value is data rather than a theme, and no variable can ever become a class name.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — @property</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@property — registering a custom property with a type so it can be interpolated, which is what makes animating one possible at all.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — custom property performance notes</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — inheritance behaviour and what changing a property high in the tree invalidates.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles — the decision order this lesson restates: utility first, then config, then arbitrary value, then a variable.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — the deduplication this can undo</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — why per-element inline styles reintroduce exactly the duplication utility CSS removed, the same argument that ruled out <code>@apply</code>.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Khi một cái biến là công cụ SAI</h2>
<p class="lead">Ba bài đã cho thấy biến CSS giải một bài toán mà lựa chọn kia KHÔNG giải được. Chính THÀNH CÔNG ấy là lý do cần bài này: một công cụ chạy tốt cho MỘT việc thì bị đem áp cho những việc nó KHÔNG hợp, và biến có BỐN ca hỏng đáng gọi tên.</p>

<h3>Ca 1 — một giá trị THẬT SỰ hằng</h3>
<pre><code class="language-css">/* vo nghia */
:root { --border-radius-card: 0.75rem; }
</code></pre>

<p>Nếu giá trị GIỐNG NHAU ở mọi theme, mọi điểm ngắt, mãi mãi, thì <code>rounded-xl</code> ĐÃ nói điều đó và nói TỐT HƠN. Cái biến thêm một lớp gián tiếp mà bạn phải ĐI THEO để trả lời "cái này trông ra sao", và không mua được gì. Biến XỨNG ĐÁNG cái giá của mình bằng cách <em>BIẾN THIÊN</em>; một cái không bao giờ biến thiên là một cú đổi tên kèm thêm vài bước.</p>

<div class="callout ok">
<p><strong>Phép kiểm.</strong> Hãy GỌI TÊN cái TRỤC mà nó biến thiên theo — theme, vật chứa, sở thích người dùng, trạng thái lúc chạy. Nếu bạn không gọi tên được cái nào, hãy dùng TIỆN ÍCH. "Nó có thể đổi về sau" KHÔNG tính: một mục config (Chương 5) ĐÃ cho bạn MỘT chỗ để đổi, mà không phải dời việc phân giải sang trình duyệt.</p>
</div>

<h3>Ca 2 — thứ mà một BIẾN THỂ đã diễn đạt được</h3>
<pre><code class="language-html">&lt;!-- SAI: cai lai responsive bang mot cai bien --&gt;
&lt;div class="p-[var(--pad)]" style="--pad: 1rem"&gt;

&lt;!-- DUNG: co che sinh ra de lam viec nay --&gt;
&lt;div class="p-4 md:p-8"&gt;
</code></pre>

<p>Điểm ngắt, hover, focus và chế độ tối đều CÓ biến thể. Lái chúng qua biến thì MẤT mọi thứ Chương 2 đã đo — một media query KHÔNG diễn đạt được thành một GIÁ TRỊ biến, nên rốt cuộc bạn VẪN phải viết cái media query, trong CSS, để ĐẶT cái biến. HAI cơ chế làm MỘT việc.</p>

<h3>Ca 3 — cái bẫy KHỬ TRÙNG LẶP</h3>
<p>Ca này TINH VI và đáng chú ý nhất, vì nó ĐẢO NGƯỢC một lập luận từ Chương 4:</p>

<pre><code class="language-html">&lt;!-- 200 the card, moi cai mot bien noi tuyen rieng --&gt;
&lt;div class="bg-[var(--card-bg)]" style="--card-bg: #1e293b"&gt;
</code></pre>

<p>Lớp <code>bg-[var(--card-bg)]</code> được phát sinh MỘT lần — phần ấy ổn. Nhưng giờ MỌI thẻ mang một thuộc tính <code>style</code> nội tuyến, và 200 cái đó là 200 BẢN SAO của cùng một chuỗi trong tải trọng HTML. Bạn đã DỜI sự trùng lặp khỏi BẢNG KIỂU, nơi nó ĐƯỢC khử trùng lặp, vào MÃ ĐÁNH DẤU, nơi nó KHÔNG.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">biến đặt trên một TỔ TIÊN</span><span class="lz-nsub">ĐÚNG</span></span>
<span class="lz-nbody">MỘT khai báo trên một vật chứa, được KẾ THỪA bởi mọi con cháu. Đây là cú giới hạn phạm vi ở bài 6.1 và nó chính LÀ trọng tâm — một định nghĩa, nhiều kẻ tiêu thụ.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">biến đặt trên MỌI thẻ</span><span class="lz-nsub">một cú THOÁI LUI</span></span>
<span class="lz-nbody">Nếu mọi thẻ cần giá trị RIÊNG của nó, thì giá trị ấy là DỮ LIỆU theo từng thẻ, không phải một theme. Hoặc nó THẬT SỰ động — inline style là trung thực và đúng — hoặc nó là một TẬP CỐ ĐỊNH, trường hợp ấy nó nên là một cái LỚP.</span>
</div>
</div>

<h3>Ca 4 — một cái biến chứa cả một DANH SÁCH LỚP</h3>
<pre><code class="language-jsx">{/* KHONG chay, va hong AM THAM */}
const cls = 'flex items-center';
&lt;div style={{ '--x': cls }} className="[var(--x)]"&gt;
</code></pre>

<p>Biến chứa <em>GIÁ TRỊ THUỘC TÍNH</em>, không chứa selector hay tên lớp. KHÔNG có cơ chế nào để một cái biến TRỞ THÀNH một cái lớp. Viết ra thì chuyện này trông HIỂN NHIÊN, và nó vẫn xuất hiện đều đặn — thường như một nỗ lực giải bài toán lớp-động ở bài 0.1. Bài toán ấy có MỘT lời giải: viết tên lớp HOÀN CHỈNH nguyên văn, và CHỌN giữa chúng.</p>

<h3>Câu hỏi hiệu năng, đặt đúng TỈ LỆ</h3>
<p>Biến phân giải lúc tính giá trị trên MỌI thẻ dùng chúng, nên có một cái giá THẬT — nhưng TỈ LỆ mới là điều quan trọng:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">vài trăm thẻ</span><span class="lz-lnote">KHÔNG đo được. Kho này có 197 biến trải hàng nghìn thẻ và không có vấn đề nào được báo. ĐỪNG tối ưu cái này</span></div>
<div class="lz-layer"><span class="lz-lname">đổi một biến trên <code>:root</code></span><span class="lz-lnote">làm mất hiệu lực kiểu dáng của MỌI con cháu đọc nó — tức là cả tài liệu. ỔN cho một cú bật tắt theme xảy ra MỘT lần. KHÔNG ổn bên trong một vòng <code>requestAnimationFrame</code></span></div>
<div class="lz-layer"><span class="lz-lname">hoạt ảnh hoá một biến</span><span class="lz-lnote">một custom property mặc định KHÔNG nội suy được, nên transition trên nó GIẬT CỤC chứ không mượt, trừ khi đăng ký qua <code>@property</code>. Thường là dấu hiệu rằng một transform hay opacity mới là công cụ đúng</span></div>
<div class="lz-layer"><span class="lz-lname">chuỗi SÂU</span><span class="lz-lnote"><code>--a: var(--b)</code> mà <code>--b: var(--c)</code>. Mỗi tầng phân giải theo từng thẻ. Hai tầng là bình thường; NĂM tầng là một thiết kế đã MẤT DẤU giá trị đến từ đâu</span></div>
</div>

<h3>Cái luật</h3>
<div class="callout">
<p><strong>Hãy dùng một cái biến khi MỘT tên lớp phải đẻ ra những giá trị KHÁC NHAU tuỳ theo NGỮ CẢNH mà cái lớp không nhìn thấy được</strong> — theme đang bật, phạm vi của một tổ tiên, một phép đo lúc chạy. Đó là một điều kiện HẸP, và mọi thứ ngoài nó được phục vụ TỐT HƠN bởi một tiện ích, một biến thể, hoặc một mục config.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — di trú tiện ích sang biến VÌ biến đã giải được bài toán theme.</strong> Khuôn mẫu là: theme bằng biến chạy tuyệt đẹp, nên khoảng cách, bo góc và cỡ chữ CŨNG được biến hoá. Sáu tháng sau danh sách lớp vẫn nói <code>p-[var(--pad-card)]</code> ở khắp nơi, không ai nói được padding là bao nhiêu nếu không mở HAI file, và KHÔNG giá trị nào trong đó từng biến thiên. Bài toán theme là CỤ THỂ; lời giải KHÔNG tổng quát hoá sang những giá trị không biến thiên.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một biến CSS xứng đáng cái lớp gián tiếp của nó CHỈ khi một cái lớp phải phân giải khác nhau theo NGỮ CẢNH — nên một giá trị không bao giờ biến thiên thuộc về một tiện ích, thứ mà một biến thể diễn đạt được thuộc về một biến thể, một giá trị theo-từng-thẻ là DỮ LIỆU chứ không phải theme, và KHÔNG biến nào có thể trở thành một tên lớp.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — @property</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@property — đăng ký một custom property kèm KIỂU để nó nội suy được, chính là thứ làm cho việc hoạt ảnh hoá nó KHẢ THI chút nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — ghi chú hiệu năng của custom property</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties — hành vi kế thừa và việc đổi một thuộc tính ở CAO trong cây thì làm mất hiệu lực những gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Adding custom styles</span><span class="lc-sub">tailwindcss.com/docs/adding-custom-styles — thứ tự quyết định mà bài này nhắc lại: tiện ích trước, rồi config, rồi giá trị tuỳ ý, rồi mới tới một cái biến.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — khả năng khử trùng lặp mà cái này có thể PHÁ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — vì sao inline style theo-từng-thẻ TÁI SINH đúng sự trùng lặp mà CSS tiện ích đã gỡ bỏ, cùng lập luận đã loại <code>@apply</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — The migration this repository still owes|||6.5 — Cuộc di trú kho này vẫn còn NỢ',
      slug: 'tw-6-5-di-tru',
      type: 'VIDEO',
      description: 'Gom ba phát hiện lại thành một kế hoạch có thứ tự: 91 lớp chết vì alpha, 767 lượt dùng ngoặc lẽ ra là mục config, và 2.677 lượt màu đặt-tên-theo-theme. Xếp theo TÁC ĐỘNG chia cho RỦI RO, không theo cái nào khó chịu nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>The migration this repository still owes</h2>
<p class="lead">Chapters 5 and 6 found three separate gaps in the same theme system. Individually each is a curiosity; together they are a work plan. This lesson orders them, because the order is the part people get wrong.</p>

<h3>The three findings</h3>
<div class="out">A. 91 lop CHET      bo tu do mo tren mau var() khong duoc phat sinh
                    -> chu 30-80% dang hien DAC 100%

B. 767 luot ngoac   bg-[var(--bg-surface)] & ban be, dang le la muc config
                    -> ten bien lap lai o 767 cho goi

C. 2677 luot        bg-darkcard / border-darkborder / bg-darkbg
                    -> mau dat-ten-theo-THEME, khong doi duoc theme
</div>

<h3>Ordering by impact over risk</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">A first — highest impact, lowest risk</span><span class="lz-nsub">91 sites, ~2 files</span></span>
<span class="lz-nbody">The only one of the three that is a <em>user-visible defect</em> rather than a maintainability cost. The change is confined to <code>globals.css</code> and the config; the 91 call sites are not edited at all — they start working. Small diff, visible result.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">B second — mechanical, incremental</span><span class="lz-nsub">767 sites, no behaviour change</span></span>
<span class="lz-nbody">Add config entries, then replace <code>bg-[var(--bg-surface)]</code> with <code>bg-surface</code> in batches. Output CSS is identical, so any visual difference is a mistake — which makes it easy to review. Can stop half-done indefinitely.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">C last — largest, and needs a decision</span><span class="lz-nsub">2,677 sites, real design work</span></span>
<span class="lz-nbody">Not mechanical: someone must decide what <code>darkcard</code> means as a role before it can be renamed. Do it after B, because B establishes the naming pattern C should follow.</span>
</div>
</div>

<div class="callout warn">
<p><strong>The tempting wrong order is C first.</strong> It is the biggest number, so it looks like the biggest problem. It is also the one that changes nothing a user can see, needs design decisions before any code moves, and touches 2,677 sites. Starting there means weeks of churn before any benefit, and the 91 actual defects stay broken throughout. Fix the thing that is <em>wrong</em> before the things that are merely <em>untidy</em>.</p>
</div>

<h3>A, in full</h3>
<pre><code class="language-css">/* globals.css — before */
:root           { --text-muted: #65676b; }
html.theme-dark { --text-muted: #b0b3b8; }

/* after — channels only, hex kept in a comment for humans */
:root           { --text-muted: 101 103 107; }  /* #65676b */
html.theme-dark { --text-muted: 176 179 184; }  /* #b0b3b8 */
</code></pre>

<pre><code class="language-ts">// tailwind.config.ts — before
muted: "var(--text-muted)",

// after
muted: "rgb(var(--text-muted) / &lt;alpha-value&gt;)",
</code></pre>

<p>Both files, one commit — lesson 6.2 measured why splitting them produces a worse bug than the one being fixed. Then verify with the artefact rather than the exit code:</p>

<div class="out">$ grep -c 'text-text-muted\\\\/60' .next/static/css/*.css
1     &lt;- truoc khi vá: 0
</div>

<div class="callout warn">
<p><strong>One caveat before touching every variable.</strong> Only convert the colours that are actually used with an opacity modifier, plus any you expect to be. A variable holding <code>rgba(0,0,0,0.04)</code> — like <code>--bg-surface-hover</code> — already carries its own alpha and cannot be expressed as three channels without deciding what its opacity should become. Those need thought, not a bulk find-and-replace.</p>
</div>

<h3>B, and why the boring version is the right one</h3>
<pre><code class="language-ts">// add alongside what exists; nothing is removed yet
colors: {
  surface: "rgb(var(--bg-surface) / &lt;alpha-value&gt;)",
  card:    "rgb(var(--bg-card) / &lt;alpha-value&gt;)",
  // …
}
</code></pre>

<p>Then the replacement is a scripted edit: <code>bg-[var(--bg-surface)]</code> → <code>bg-surface</code>, one feature directory per commit. Because the generated CSS is byte-identical, a reviewer only has to confirm the mapping is right — there is no behaviour to reason about. This is the same synonym-first discipline as the rename in lesson 5.3, and for the same reason: it makes a large diff boring.</p>

<h3>What "done" looks like</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">A done</span><span class="lz-lnote">the CI guard from lesson 6.2 passes: every <code>/NN</code> class in source exists in the built CSS. Add the guard in the same PR, or the fix has no way to stay fixed</span></div>
<div class="lz-layer"><span class="lz-lname">B done</span><span class="lz-lnote"><code>grep -c '\\[var(--' src</code> trends to zero. Not a deadline — a number someone can watch, which is what makes an incremental migration finishable</span></div>
<div class="lz-layer"><span class="lz-lname">C done</span><span class="lz-lnote">no colour name in the config contains <code>dark</code> or <code>light</code>. At that point the light theme is reachable for those 2,677 sites, which was the original goal from the 2026-08-08 incident</span></div>
<div class="lz-layer"><span class="lz-lname">and the dead config removed</span><span class="lz-lnote">once C lands, <code>lightbg</code> and its three siblings can go — but as the <em>last</em> step, not the first. Lesson 5.2's warning: deleting the zero-use entries first tidies the symptom and leaves the cause</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — treating this as one project.</strong> A/B/C share a subject and nothing else: A is a bug fix, B is a refactor, C is a design change. Bundled into one "theme migration" epic they block each other, and the 91-class defect waits behind 2,677 renames. Ship A this week on its own.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three findings, ordered by impact over risk rather than by size: fix the 91 dead opacity classes first because they are the only user-visible defect and the change touches two files, then move the 767 bracket uses into config as a boring synonym-first refactor, and only then take on renaming the 2,677 theme-named colours — which needs design decisions the first two steps make easier.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Using CSS variables with alpha</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors#using-css-variables — the exact syntax for step A, including the channel format.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Branch By Abstraction</span><span class="lc-sub">martinfowler.com/bliki/BranchByAbstraction.html — the add-the-new-name-first pattern that makes B and C reviewable in batches instead of one enormous diff.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-08-08 settings incident</span><span class="lc-sub">the bug that motivates C: hardcoded values left the settings screen black in light mode, and the theme-named colours are the same failure at larger scale.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git — splitting a large refactor into reviewable commits</span><span class="lc-sub">/courses/git/learn${REF} — staging by directory, keeping each commit independently revertable, and why a mechanical change should never share a commit with a behavioural one.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Cuộc di trú kho này vẫn còn NỢ</h2>
<p class="lead">Chương 5 và 6 tìm ra BA lỗ hổng riêng biệt trong CÙNG một hệ theme. Riêng lẻ thì mỗi cái là một điều thú vị; GỘP LẠI chúng là một KẾ HOẠCH LÀM VIỆC. Bài này XẾP THỨ TỰ chúng, vì thứ tự mới là phần người ta hay làm sai.</p>

<h3>Ba phát hiện</h3>
<div class="out">A. 91 lop CHET      bo tu do mo tren mau var() khong duoc phat sinh
                    -> chu 30-80% dang hien DAC 100%

B. 767 luot ngoac   bg-[var(--bg-surface)] & ban be, dang le la muc config
                    -> ten bien lap lai o 767 cho goi

C. 2677 luot        bg-darkcard / border-darkborder / bg-darkbg
                    -> mau dat-ten-theo-THEME, khong doi duoc theme
</div>

<h3>Xếp theo TÁC ĐỘNG chia cho RỦI RO</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">A trước — tác động cao nhất, rủi ro thấp nhất</span><span class="lz-nsub">91 chỗ, ~2 file</span></span>
<span class="lz-nbody">Cái DUY NHẤT trong ba cái là một <em>KHUYẾT TẬT NGƯỜI DÙNG THẤY ĐƯỢC</em> chứ không phải một cái giá bảo trì. Thay đổi gói gọn trong <code>globals.css</code> và config; 91 chỗ gọi KHÔNG bị sửa gì cả — chúng BẮT ĐẦU CHẠY. Diff nhỏ, kết quả nhìn thấy được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">B thứ hai — máy móc, từng bước</span><span class="lz-nsub">767 chỗ, không đổi hành vi</span></span>
<span class="lz-nbody">Thêm mục config, rồi thay <code>bg-[var(--bg-surface)]</code> bằng <code>bg-surface</code> theo LÔ. CSS đầu ra GIỐNG HỆT, nên mọi khác biệt thị giác đều là SAI SÓT — điều làm nó dễ review. DỪNG giữa chừng vô thời hạn cũng được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">C cuối — lớn nhất, và cần một QUYẾT ĐỊNH</span><span class="lz-nsub">2.677 chỗ, việc thiết kế thật</span></span>
<span class="lz-nbody">KHÔNG máy móc: phải có người QUYẾT ĐỊNH <code>darkcard</code> nghĩa là VAI TRÒ gì trước khi đổi tên được nó. Làm SAU B, vì B thiết lập khuôn mẫu đặt tên mà C nên theo.</span>
</div>
</div>

<div class="callout warn">
<p><strong>Thứ tự SAI hấp dẫn là làm C TRƯỚC.</strong> Nó là con số LỚN NHẤT, nên nó TRÔNG như vấn đề lớn nhất. Nó cũng là cái KHÔNG đổi bất cứ thứ gì người dùng thấy, CẦN các quyết định thiết kế trước khi bất kỳ dòng mã nào nhúc nhích, và động vào 2.677 chỗ. Bắt đầu từ đó nghĩa là HÀNG TUẦN xáo trộn trước khi có lợi ích nào, và 91 khuyết tật THẬT vẫn hỏng suốt thời gian ấy. Hãy vá cái đang <em>SAI</em> trước những cái chỉ đang <em>LUỘM THUỘM</em>.</p>
</div>

<h3>A, đầy đủ</h3>
<pre><code class="language-css">/* globals.css — TRUOC */
:root           { --text-muted: #65676b; }
html.theme-dark { --text-muted: #b0b3b8; }

/* SAU — chi con kenh, giu hex trong comment cho nguoi doc */
:root           { --text-muted: 101 103 107; }  /* #65676b */
html.theme-dark { --text-muted: 176 179 184; }  /* #b0b3b8 */
</code></pre>

<pre><code class="language-ts">// tailwind.config.ts — TRUOC
muted: "var(--text-muted)",

// SAU
muted: "rgb(var(--text-muted) / &lt;alpha-value&gt;)",
</code></pre>

<p>CẢ HAI file, MỘT commit — bài 6.2 đã đo vì sao chẻ chúng ra đẻ ra một con bọ TỆ HƠN cái đang được vá. Rồi XÁC MINH bằng TẠO TÁC chứ không bằng mã thoát:</p>

<div class="out">$ grep -c 'text-text-muted\\\\/60' .next/static/css/*.css
1     &lt;- truoc khi vá: 0
</div>

<div class="callout warn">
<p><strong>Một lưu ý trước khi động vào MỌI biến.</strong> Chỉ chuyển những màu THẬT SỰ được dùng với một bổ từ độ mờ, cộng những cái bạn DỰ ĐOÁN sẽ dùng. Một biến chứa <code>rgba(0,0,0,0.04)</code> — như <code>--bg-surface-hover</code> — ĐÃ mang alpha riêng và KHÔNG diễn đạt được thành ba kênh nếu chưa quyết định độ mờ của nó sẽ thành gì. Những cái đó cần SUY NGHĨ, không phải một cú tìm-và-thay hàng loạt.</p>
</div>

<h3>B, và vì sao bản NHÀM CHÁN mới đúng</h3>
<pre><code class="language-ts">// them BEN CANH cai da co; chua go gi ca
colors: {
  surface: "rgb(var(--bg-surface) / &lt;alpha-value&gt;)",
  card:    "rgb(var(--bg-card) / &lt;alpha-value&gt;)",
  // …
}
</code></pre>

<p>Rồi cú thay thế là một lần sửa BẰNG SCRIPT: <code>bg-[var(--bg-surface)]</code> → <code>bg-surface</code>, mỗi commit một thư mục tính năng. Vì CSS phát sinh GIỐNG HỆT TỪNG BYTE, người review chỉ phải xác nhận ánh xạ ĐÚNG — KHÔNG có hành vi nào phải suy luận. Đây cùng kỷ luật đồng-nghĩa-trước như cú đổi tên ở bài 5.3, và cùng lý do: nó làm một diff LỚN trở nên NHÀM CHÁN.</p>

<h3>"XONG" trông ra sao</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">A xong</span><span class="lz-lnote">cái chốt CI ở bài 6.2 QUA: mọi lớp <code>/NN</code> trong mã nguồn đều CÓ trong CSS đã dựng. Thêm cái chốt trong CÙNG PR, nếu không cú vá KHÔNG có cách nào GIỮ được trạng thái đã vá</span></div>
<div class="lz-layer"><span class="lz-lname">B xong</span><span class="lz-lnote"><code>grep -c '\\[var(--' src</code> đi về 0. Không phải một hạn chót — một CON SỐ ai đó theo dõi được, chính là thứ khiến một cuộc di trú từng bước có thể KẾT THÚC</span></div>
<div class="lz-layer"><span class="lz-lname">C xong</span><span class="lz-lnote">KHÔNG tên màu nào trong config chứa <code>dark</code> hay <code>light</code>. Tới điểm ấy theme sáng VỚI TỚI ĐƯỢC 2.677 chỗ kia, chính là mục tiêu ban đầu từ sự cố 08/08/2026</span></div>
<div class="lz-layer"><span class="lz-lname">và gỡ config CHẾT</span><span class="lz-lnote">một khi C đáp, <code>lightbg</code> và ba anh em có thể đi — nhưng là bước <em>CUỐI</em>, không phải bước đầu. Cảnh báo ở bài 5.2: xoá các mục 0-lượt-dùng trước thì dọn TRIỆU CHỨNG và để nguyên NGUYÊN NHÂN</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — coi chuyện này là MỘT dự án.</strong> A/B/C chung một CHỦ ĐỀ và không chung gì khác: A là một cú VÁ BỌ, B là một cú TÁI CẤU TRÚC, C là một THAY ĐỔI THIẾT KẾ. Gộp vào một epic "di trú theme" thì chúng CHẶN nhau, và khuyết tật 91-lớp phải chờ sau 2.677 cú đổi tên. Hãy giao A TUẦN NÀY, một mình nó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba phát hiện, xếp theo TÁC ĐỘNG chia RỦI RO chứ không theo KÍCH THƯỚC: vá 91 lớp độ mờ chết TRƯỚC vì chúng là khuyết tật DUY NHẤT người dùng thấy được và thay đổi chỉ động hai file, rồi dời 767 lượt ngoặc vào config như một cú tái cấu trúc nhàm chán đồng-nghĩa-trước, và CHỈ SAU ĐÓ mới nhận việc đổi tên 2.677 màu đặt-tên-theo-theme — vốn cần các quyết định thiết kế mà hai bước đầu làm cho dễ hơn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — dùng biến CSS với alpha</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors#using-css-variables — cú pháp CHÍNH XÁC cho bước A, gồm cả định dạng kênh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — Branch By Abstraction</span><span class="lc-sub">martinfowler.com/bliki/BranchByAbstraction.html — khuôn mẫu thêm-tên-mới-trước khiến B và C review được theo LÔ thay vì một diff khổng lồ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — sự cố settings 08/08/2026</span><span class="lc-sub">con bọ thúc đẩy C: các giá trị đóng cứng để màn Cài đặt đen kịt trong theme sáng, và các màu đặt-tên-theo-theme là CÙNG cú hỏng ấy ở quy mô lớn hơn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git — chẻ một cú tái cấu trúc lớn thành các commit review được</span><span class="lc-sub">/courses/git/learn${REF} — dàn theo thư mục, giữ mỗi commit revert được độc lập, và vì sao một thay đổi máy móc KHÔNG BAO GIỜ nên chung commit với một thay đổi hành vi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
      slug: 'tw-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về biến CSS: một lớp đúng cả hai theme, bẫy alpha-value và 91 lớp chết, cấu trúc ba khối, và khi nào biến là công cụ SAI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>What Chapter 6 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter found a live user-visible defect in the repository it studies, so several questions are about how such a thing survives every layer of tooling.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">6.1 — one class, both themes</span><span class="lz-lnote"><code>var(--x)</code> in config moves resolution to the browser. Used 4,304 times; the paired palette it replaced, zero</span></div>
<div class="lz-layer"><span class="lz-lname">6.2 — the alpha trap</span><span class="lz-lnote">plain <code>var(--x)</code> silently refuses to generate <code>/50</code> variants. 91 such classes here render fully opaque. Fix needs BOTH channel variables and the <code>&lt;alpha-value&gt;</code> wrapper, in one commit</span></div>
<div class="lz-layer"><span class="lz-lname">6.3 — the structure</span><span class="lz-lnote">197 variables; <code>:root</code> holds LIGHT as base so a failed theme script still renders readably; <code>theme-dark</code> overrides 40 of 42</span></div>
<div class="lz-layer"><span class="lz-lname">6.4 — when not to</span><span class="lz-lnote">a value that never varies, something a variant expresses, per-element values, and class names — which variables can never hold</span></div>
<div class="lz-layer"><span class="lz-lname">6.5 — the plan</span><span class="lz-lnote">impact over risk: 91 dead classes first (2 files, visible), 767 bracket uses second (mechanical), 2,677 renames last (needs design)</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Chương 6 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này tìm ra một khuyết tật ĐANG SỐNG mà người dùng thấy được trong chính kho nó nghiên cứu, nên vài câu hỏi về việc một thứ như thế sống sót qua MỌI tầng công cụ ra sao.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">6.1 — một lớp, cả hai theme</span><span class="lz-lnote"><code>var(--x)</code> trong config dời việc phân giải sang trình duyệt. Dùng 4.304 lần; bảng màu cặp mà nó thay thế, KHÔNG lần</span></div>
<div class="lz-layer"><span class="lz-lname">6.2 — bẫy alpha</span><span class="lz-lnote"><code>var(--x)</code> trần ÂM THẦM từ chối phát sinh các biến thể <code>/50</code>. 91 lớp như thế ở đây hiện ra ĐỤC HOÀN TOÀN. Cú vá cần CẢ biến dạng kênh LẪN vỏ <code>&lt;alpha-value&gt;</code>, trong MỘT commit</span></div>
<div class="lz-layer"><span class="lz-lname">6.3 — cấu trúc</span><span class="lz-lnote">197 biến; <code>:root</code> giữ SÁNG làm nền để một script theme hỏng vẫn dựng ra đọc được; <code>theme-dark</code> đè 40 trên 42</span></div>
<div class="lz-layer"><span class="lz-lname">6.4 — khi nào KHÔNG</span><span class="lz-lnote">một giá trị không biến thiên, thứ một biến thể diễn đạt được, giá trị theo-từng-thẻ, và TÊN LỚP — thứ biến KHÔNG BAO GIỜ chứa được</span></div>
<div class="lz-layer"><span class="lz-lname">6.5 — kế hoạch</span><span class="lz-lnote">tác động chia rủi ro: 91 lớp chết trước (2 file, nhìn thấy được), 767 lượt ngoặc thứ hai (máy móc), 2.677 cú đổi tên cuối (cần thiết kế)</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why does <code>colors: { primary: "var(--text-primary)" }</code> make one class correct in both themes?|||Vì sao <code>colors: { primary: "var(--text-primary)" }</code> làm MỘT lớp đúng ở cả hai theme?',
            options: [
              'Tailwind emits the variable literally and never resolves it — resolution happens in the browser per element, so toggling a theme class re-resolves every use with no rebuild and no variant|||Tailwind phát sinh cái biến NGUYÊN VĂN và không bao giờ phân giải nó — việc phân giải xảy ra trong trình duyệt theo từng thẻ, nên bật một lớp theme sẽ phân giải lại mọi lượt dùng mà không cần dựng lại và không cần biến thể',
              'Tailwind generates two rules, one per theme|||Tailwind phát sinh hai quy tắc, mỗi theme một cái',
              'The dark: variant is applied automatically|||Biến thể dark: được áp tự động',
              'PostCSS rewrites the value at build time per theme|||PostCSS viết lại giá trị lúc dựng theo từng theme',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'With <code>naive: "var(--c)"</code> in the config, what does <code>bg-naive/50</code> produce?|||Với <code>naive: "var(--c)"</code> trong config, <code>bg-naive/50</code> đẻ ra gì?',
            options: [
              'Nothing — the rule is NOT generated at all, because Tailwind cannot inject an alpha channel into an opaque value it does not understand. The class is in the markup and refers to nothing|||KHÔNG GÌ — quy tắc KHÔNG hề được phát sinh, vì Tailwind không chèn được một kênh alpha vào một giá trị đục mà nó không hiểu. Cái lớp CÓ trong mã đánh dấu và trỏ tới KHÔNG GÌ',
              'A rule with opacity 0.5 applied via a filter|||Một quy tắc với opacity 0,5 áp qua một filter',
              'A build error naming the offending class|||Một lỗi dựng nêu tên cái lớp gây chuyện',
              'The base colour with a separate opacity utility|||Màu nền cộng một tiện ích opacity riêng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo has 91 such opacity classes. Why did none of the tooling catch it?|||Kho này có 91 lớp độ mờ như thế. Vì sao KHÔNG công cụ nào bắt được?',
            options: [
              'Nothing errors at any stage — TypeScript never sees class strings, the build succeeds, the linter has no opinion, and fully-opaque muted grey looks like a design choice rather than a defect|||KHÔNG gì báo lỗi ở bất kỳ giai đoạn nào — TypeScript không bao giờ thấy chuỗi lớp, bản dựng thành công, bộ lint không có ý kiến, và màu xám mờ đục hoàn toàn TRÔNG như một lựa chọn thiết kế chứ không phải khuyết tật',
              'The classes are only used in files outside the content globs|||Các lớp ấy chỉ dùng trong file ngoài các glob content',
              'Tailwind logs a warning that CI suppresses|||Tailwind ghi một cảnh báo mà CI nén đi',
              'They fail only in production builds|||Chúng chỉ hỏng trong bản dựng production',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Fixing it requires changing the variables to channels AND wrapping in <code>rgb(… / &lt;alpha-value&gt;)</code>. Why must both ship together?|||Vá nó đòi đổi các biến sang KÊNH VÀ bọc trong <code>rgb(… / &lt;alpha-value&gt;)</code>. Vì sao cả hai phải đi CÙNG NHAU?',
            options: [
              'Either alone produces invalid CSS — config only gives <code>rgb(#64748b / 1)</code>, variables only gives <code>var(--x)</code> resolving to bare numbers. A partial deploy breaks all 4,304 uses, not just the 91|||Mỗi cái một mình đẻ ra CSS không hợp lệ — chỉ config thì cho <code>rgb(#64748b / 1)</code>, chỉ biến thì cho <code>var(--x)</code> phân giải thành các số trần. Một cú deploy nửa vời làm vỡ CẢ 4.304 lượt dùng, không chỉ 91',
              'Tailwind caches the config between builds|||Tailwind cache config giữa các lần dựng',
              'The order matters but they can be separate commits|||Thứ tự quan trọng nhưng chúng có thể là hai commit riêng',
              'They do not — either half fixes it independently|||Không cần — mỗi nửa tự vá được độc lập',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This theme puts LIGHT values in <code>:root</code> and overrides for dark. Why is that direction better than the reverse?|||Theme này đặt giá trị SÁNG trong <code>:root</code> và đè cho tối. Vì sao chiều ấy TỐT HƠN chiều ngược lại?',
            options: [
              'Whatever <code>:root</code> holds is what renders with no theme class — first paint, server response, or a failed theme script. A light base means a failure still renders a readable light page|||Bất cứ thứ gì <code>:root</code> giữ là cái được dựng khi KHÔNG có lớp theme — lần vẽ đầu, phản hồi máy chủ, hoặc một script theme hỏng. Nền sáng nghĩa là một cú hỏng vẫn dựng ra một trang sáng ĐỌC ĐƯỢC',
              'Dark values compress better in the CSS payload|||Giá trị tối nén tốt hơn trong tải trọng CSS',
              'CSS requires :root to hold the lighter values|||CSS đòi :root phải giữ các giá trị sáng hơn',
              'It halves the number of variables needed|||Nó giảm một nửa số biến cần thiết',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Setting <code>style="--card-bg: #1e293b"</code> on each of 200 cards is a regression. Why?|||Đặt <code>style="--card-bg: #1e293b"</code> lên từng cái trong 200 thẻ card là một cú THOÁI LUI. Vì sao?',
            options: [
              'It moves duplication from the stylesheet, where it was deduplicated, into the markup, where it is not — 200 copies of the same string in the HTML payload. Set it on an ANCESTOR and let it inherit|||Nó DỜI sự trùng lặp khỏi bảng kiểu, nơi nó ĐƯỢC khử trùng lặp, vào mã đánh dấu, nơi nó KHÔNG — 200 bản sao của cùng một chuỗi trong tải trọng HTML. Hãy đặt nó lên một TỔ TIÊN và để nó KẾ THỪA',
              'Inline styles cannot define custom properties|||Inline style không định nghĩa được custom property',
              'It forces a layout recalculation per card|||Nó ép tính lại bố cục cho từng thẻ',
              'The generated class would be duplicated 200 times|||Cái lớp phát sinh sẽ bị nhân bản 200 lần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A variable is referenced but never defined. What happens?|||Một biến được tham chiếu mà KHÔNG BAO GIỜ được định nghĩa. Chuyện gì xảy ra?',
            options: [
              'It is invalid at computed-value time, so the declaration is DISCARDED and the element inherits its parent\'s value — often close enough to look intentional, with no error anywhere|||Nó KHÔNG hợp lệ lúc tính giá trị, nên khai báo bị VỨT và thẻ KẾ THỪA giá trị của cha — thường đủ gần để trông như có chủ ý, mà KHÔNG có lỗi ở đâu cả',
              'The browser logs a console warning|||Trình duyệt ghi một cảnh báo console',
              'The property falls back to its CSS initial value|||Thuộc tính rơi về giá trị khởi tạo CSS của nó',
              'Tailwind refuses to generate the class|||Tailwind từ chối phát sinh cái lớp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Of the three findings (91 dead classes, 767 bracket uses, 2,677 theme-named colours), which goes first and why?|||Trong ba phát hiện (91 lớp chết, 767 lượt ngoặc, 2.677 màu đặt-tên-theo-theme), cái nào làm TRƯỚC và vì sao?',
            options: [
              'The 91 — the only USER-VISIBLE defect, and the change touches two files without editing any of the 91 call sites. Impact over risk, not size|||91 cái — khuyết tật DUY NHẤT người dùng thấy được, và thay đổi chỉ động HAI file mà không sửa chỗ gọi nào trong 91. Tác động chia rủi ro, không phải kích thước',
              'The 2,677 — largest number, so largest problem|||2.677 — con số lớn nhất, nên vấn đề lớn nhất',
              'The 767 — mechanical, so safest to start with|||767 — máy móc, nên an toàn nhất để bắt đầu',
              'Delete the zero-use config entries first to reduce scope|||Xoá các mục config 0-lượt-dùng trước để giảm phạm vi',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
