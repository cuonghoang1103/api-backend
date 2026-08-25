const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 5: Mở rộng cấu hình.
 * Số đo: extend đối lập thay-thế đo bằng CLI thật; và cách dùng THẬT của
 * mọi họ màu tuỳ biến trong kho này — gồm bốn họ dùng ĐÚNG 0 lần.
 */

export default {
  title: 'Chapter 5 — Extending the config|||Chương 5 — Mở rộng cấu hình',
  slug: 'tw-ch5-cau-hinh',
  description: 'Sáu bài về việc dạy trình sinh những giá trị của RIÊNG bạn — và về việc ĐO xem những thứ bạn thêm vào có ai dùng không. Kho này định nghĩa bốn họ màu theme sáng mà KHÔNG chỗ nào dùng, và số 0 ấy giải thích một con bọ thật.',
  sortOrder: 6,
  lessons: [

    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — extend adds; theme replaces|||5.1 — extend THÊM VÀO; theme THAY THẾ',
      slug: 'tw-5-1-extend',
      type: 'VIDEO',
      description: 'Cùng một cấu hình, khác đúng một từ khoá: có `extend` thì `p-4` và `text-red-500` còn sống, không có thì chúng BIẾN MẤT. Một cú thụt lề sai xoá sạch thang mặc định mà không báo lỗi nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>extend adds; theme replaces</h2>
<p class="lead">The config has two places to put a custom value, they differ by one level of nesting, and the difference is between <em>adding one class</em> and <em>deleting the entire default scale</em>. No error marks the boundary, so it is worth measuring once.</p>

<h3>The measurement</h3>
<p>Same markup, same custom values, one keyword apart:</p>

<pre><code class="language-js">// A — inside extend
theme: { extend: { spacing: { brand: '7px' }, colors: { brand: '#123456' } } }

// B — directly on theme
theme: { spacing: { brand: '7px' }, colors: { brand: '#123456' } }
</code></pre>

<pre><code class="language-html">&lt;div class="p-4 p-brand text-red-500 text-brand"&gt;&lt;/div&gt;
</code></pre>

<div class="out">A (extend):     4 quy tac
  .p-4  .p-brand  .text-brand  .text-red-500

B (thay the):   2 quy tac
  .p-brand  .text-brand

=> p-4 va text-red-500 BIEN MAT. Khong loi, khong canh bao.
</div>

<p><code>theme.spacing</code> means "the spacing scale <em>is</em> this object". You supplied one key, so the scale now has one key, and the other 34 no longer exist. <code>theme.extend.spacing</code> means "merge these into the scale", which is almost always what you meant.</p>

<div class="callout warn">
<p><strong>Why this produces a confusing failure.</strong> The build succeeds. Your new class works — that is the part you test. Everything breaks somewhere else, in components you did not touch, all at once. The symptom reads as "the whole app lost its styling", which sends people looking at PostCSS or the content globs rather than at a one-word config change. Check the diff before checking anything else.</p>
</div>

<h3>When replacing is actually correct</h3>
<p>It is not always a mistake. Two legitimate cases:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">a closed design system</span><span class="lz-nsub">deliberate replacement</span></span>
<span class="lz-nbody">If your design system defines exactly nine colours and using a tenth is a mistake, replacing <code>theme.colors</code> makes <code>bg-emerald-400</code> a build-visible error rather than a review comment. The constraint is the point.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">everything else</span><span class="lz-nsub">use extend</span></span>
<span class="lz-nbody">You want your values <em>plus</em> the defaults. This is the overwhelming majority, which is why <code>extend</code> exists as a separate key rather than being the default behaviour — the explicit nesting is what makes the destructive version deliberate.</span>
</div>
</div>

<h3>What this repository does</h3>
<pre><code class="language-ts">const config: Config = {
  content: [ /* … */ ],
  darkMode: "class",
  theme: {
    extend: {          // &lt;- everything lives here
      colors: { /* … */ },
      fontFamily: { /* … */ },
      animation: { /* … */ },
      keyframes: { /* … */ },
      boxShadow: { /* … */ },
      backgroundImage: { /* … */ },
      perspective: { /* … */ },
    },
  },
  plugins: [],
};
</code></pre>

<p>Seven extension keys, all under <code>extend</code>, and four notable absences: <strong>no <code>spacing</code>, no <code>fontSize</code>, no <code>screens</code>, no <code>borderRadius</code></strong>. The defaults for those were accepted wholesale.</p>

<div class="callout warn">
<p><strong>Read that absence against Chapter 1.</strong> Lesson 1.2 measured 803 uses of <code>text-[11px]</code> and 595 of <code>text-[10px]</code> — 1,398 escapes caused by the font-size scale bottoming out at 12px. The config extends seven things and <em>not</em> <code>fontSize</code>. Those 1,398 arbitrary values are the cost of that omission, and closing it is a four-line change. This is what it looks like when a config decision and a usage pattern disagree, and only the measurement shows it.</p>
</div>

<h3>The keys worth knowing exist</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>colors</code></span><span class="lz-lnote">the one everyone extends first. Values can be nested objects (producing <code>bg-brand-500</code>), flat strings, or — importantly — CSS variables. Chapter 6 is about that last option</span></div>
<div class="lz-layer"><span class="lz-lname"><code>spacing</code></span><span class="lz-lnote">feeds padding, margin, gap, width, height and more from one definition. Adding one key here creates dozens of utilities at once, which is why it is the highest-leverage extension</span></div>
<div class="lz-layer"><span class="lz-lname"><code>fontSize</code></span><span class="lz-lnote">accepts either a string or a <code>[size, { lineHeight, letterSpacing }]</code> tuple, so a named size can carry its own leading. The default entries all use the tuple form</span></div>
<div class="lz-layer"><span class="lz-lname"><code>screens</code></span><span class="lz-lnote">replacing this is one of the few cases where NOT extending is common — teams often want exactly their four breakpoints, not those plus Tailwind's five</span></div>
<div class="lz-layer"><span class="lz-lname"><code>animation</code> + <code>keyframes</code></span><span class="lz-lnote">always a pair: <code>keyframes</code> defines the movement, <code>animation</code> names a timing of it. Lesson 5.4 measures this repo's thirteen</span></div>
</div>

<h3>Functions, for values that depend on other values</h3>
<p>A config key can be a function receiving the resolved theme, which is how you build on your own scale without repeating yourself:</p>

<pre><code class="language-js">extend: {
  // reuse the spacing scale for a property that does not use it by default
  maxHeight: ({ theme }) =&gt; ({ ...theme('spacing'), 'screen-1/2': '50vh' }),
}
</code></pre>

<p>This matters because hardcoding <code>'2rem'</code> in three config keys means a scale change silently misses two of them. The function form keeps one source of truth, which is the same argument as naming a repeated arbitrary value in lesson 1.2.</p>

<div class="pitfall">
<p><strong>Trap — extending <code>colors</code> with a key that shadows a default family.</strong> Adding <code>extend: { colors: { gray: { … } } }</code> does not merge with Tailwind's <code>gray</code> — it <em>replaces</em> that family entirely, even though you are inside <code>extend</code>. Merging happens one level deep, so extending <code>colors</code> merges families, and a family you supply overwrites the whole default family of that name. If you want to adjust two shades of grey, you must respell all eleven.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>theme.extend.x</code> merges into the default scale while <code>theme.x</code> replaces it wholesale — measured, that difference silently deletes <code>p-4</code> and <code>text-red-500</code> — and the merge is only one level deep, so extending a colour family overwrites that entire family rather than adding to it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Theme configuration</span><span class="lc-sub">tailwindcss.com/docs/theme — the full key list, the <code>extend</code> semantics, and the closest thing to a statement of the one-level-deep merge rule.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing spacing</span><span class="lc-sub">tailwindcss.com/docs/customizing-spacing — which utilities read the spacing scale, and therefore how many classes one added key produces.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind source — resolveConfig</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss — the merge implementation itself. Reading it is the fastest way to settle any question about what merges and what replaces.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 1 — the scale this config extends</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — what the defaults are, and the 1,398 arbitrary values this repo pays for not extending <code>fontSize</code>.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>extend THÊM VÀO; theme THAY THẾ</h2>
<p class="lead">Config có HAI chỗ để đặt một giá trị tuỳ biến, chúng khác nhau MỘT tầng lồng, và khác biệt ấy là giữa <em>thêm một cái lớp</em> và <em>XOÁ SẠCH toàn bộ thang mặc định</em>. KHÔNG lỗi nào đánh dấu ranh giới, nên đáng đo một lần.</p>

<h3>Phép đo</h3>
<p>Cùng mã đánh dấu, cùng giá trị tuỳ biến, cách nhau một từ khoá:</p>

<pre><code class="language-js">// A — BEN TRONG extend
theme: { extend: { spacing: { brand: '7px' }, colors: { brand: '#123456' } } }

// B — dat THANG len theme
theme: { spacing: { brand: '7px' }, colors: { brand: '#123456' } }
</code></pre>

<pre><code class="language-html">&lt;div class="p-4 p-brand text-red-500 text-brand"&gt;&lt;/div&gt;
</code></pre>

<div class="out">A (extend):     4 quy tac
  .p-4  .p-brand  .text-brand  .text-red-500

B (thay the):   2 quy tac
  .p-brand  .text-brand

=> p-4 va text-red-500 BIEN MAT. Khong loi, khong canh bao.
</div>

<p><code>theme.spacing</code> nghĩa là "thang khoảng cách <em>LÀ</em> cái object này". Bạn cung cấp MỘT khoá, nên cái thang giờ có MỘT khoá, và 34 khoá kia KHÔNG còn tồn tại. <code>theme.extend.spacing</code> nghĩa là "TRỘN những cái này vào thang", gần như luôn là cái bạn định làm.</p>

<div class="callout warn">
<p><strong>Vì sao chuyện này đẻ ra một cú hỏng khó hiểu.</strong> Bản dựng THÀNH CÔNG. Cái lớp MỚI của bạn CHẠY — đó là phần bạn kiểm. Mọi thứ khác VỠ ở chỗ khác, trong những component bạn không hề động vào, TẤT CẢ cùng lúc. Triệu chứng đọc ra thành "cả ứng dụng mất sạch kiểu dáng", thứ khiến người ta đi soi PostCSS hay các glob content thay vì soi một cú đổi config MỘT TỪ. Hãy kiểm cái DIFF trước khi kiểm bất cứ thứ gì khác.</p>
</div>

<h3>Khi nào THAY THẾ mới là ĐÚNG</h3>
<p>Nó KHÔNG phải luôn là sai lầm. Hai ca chính đáng:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">một hệ thiết kế ĐÓNG</span><span class="lz-nsub">thay thế CÓ CHỦ Ý</span></span>
<span class="lz-nbody">Nếu hệ thiết kế của bạn định nghĩa ĐÚNG chín màu và dùng màu thứ mười là một sai lầm, thì thay <code>theme.colors</code> biến <code>bg-emerald-400</code> thành một lỗi NHÌN THẤY LÚC DỰNG chứ không phải một comment review. Sự RÀNG BUỘC chính là điểm.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">mọi trường hợp khác</span><span class="lz-nsub">dùng extend</span></span>
<span class="lz-nbody">Bạn muốn giá trị của mình <em>CỘNG VỚI</em> các mặc định. Đây là đại đa số, đó là lý do <code>extend</code> tồn tại như một KHOÁ RIÊNG chứ không phải là hành vi mặc định — cú lồng tường minh chính là thứ khiến bản PHÁ HUỶ trở nên CÓ CHỦ Ý.</span>
</div>
</div>

<h3>Kho này làm gì</h3>
<pre><code class="language-ts">const config: Config = {
  content: [ /* … */ ],
  darkMode: "class",
  theme: {
    extend: {          // &lt;- moi thu song o day
      colors: { /* … */ },
      fontFamily: { /* … */ },
      animation: { /* … */ },
      keyframes: { /* … */ },
      boxShadow: { /* … */ },
      backgroundImage: { /* … */ },
      perspective: { /* … */ },
    },
  },
  plugins: [],
};
</code></pre>

<p>Bảy khoá mở rộng, tất cả dưới <code>extend</code>, và bốn sự VẮNG MẶT đáng chú ý: <strong>không có <code>spacing</code>, không có <code>fontSize</code>, không có <code>screens</code>, không có <code>borderRadius</code></strong>. Các mặc định cho những cái đó được nhận NGUYÊN XI.</p>

<div class="callout warn">
<p><strong>Hãy đọc sự vắng mặt ấy đối chiếu Chương 1.</strong> Bài 1.2 đã đo 803 lượt <code>text-[11px]</code> và 595 lượt <code>text-[10px]</code> — 1.398 cú thoát gây ra bởi việc thang cỡ chữ chạm đáy ở 12px. Config mở rộng BẢY thứ và <em>KHÔNG</em> có <code>fontSize</code>. 1.398 giá trị tuỳ ý ấy là CÁI GIÁ của sự bỏ sót đó, và bịt nó lại là một thay đổi BỐN DÒNG. Đây là hình dạng của việc một quyết định config và một khuôn mẫu sử dụng BẤT ĐỒNG với nhau, và chỉ phép ĐO mới cho thấy.</p>
</div>

<h3>Những khoá đáng biết là chúng tồn tại</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>colors</code></span><span class="lz-lnote">cái ai cũng mở rộng đầu tiên. Giá trị có thể là object lồng nhau (sinh ra <code>bg-brand-500</code>), chuỗi phẳng, hoặc — quan trọng — BIẾN CSS. Chương 6 nói về lựa chọn cuối ấy</span></div>
<div class="lz-layer"><span class="lz-lname"><code>spacing</code></span><span class="lz-lnote">nuôi padding, margin, gap, width, height và hơn nữa TỪ MỘT định nghĩa. Thêm một khoá ở đây tạo ra HÀNG CHỤC tiện ích cùng lúc, đó là lý do nó là cú mở rộng có ĐÒN BẨY cao nhất</span></div>
<div class="lz-layer"><span class="lz-lname"><code>fontSize</code></span><span class="lz-lnote">nhận hoặc một chuỗi hoặc một bộ <code>[cỡ, { lineHeight, letterSpacing }]</code>, nên một cỡ có tên MANG THEO được chiều cao dòng của riêng nó. Các mục mặc định đều dùng dạng bộ</span></div>
<div class="lz-layer"><span class="lz-lname"><code>screens</code></span><span class="lz-lnote">thay thế cái này là một trong số ít ca mà KHÔNG extend là chuyện thường — các đội thường muốn ĐÚNG bốn điểm ngắt của họ, không phải bốn cái đó CỘNG năm cái của Tailwind</span></div>
<div class="lz-layer"><span class="lz-lname"><code>animation</code> + <code>keyframes</code></span><span class="lz-lnote">luôn đi CẶP: <code>keyframes</code> định nghĩa CHUYỂN ĐỘNG, <code>animation</code> đặt tên cho một cách ĐỊNH THỜI của nó. Bài 5.4 đo mười ba cái của kho này</span></div>
</div>

<h3>Hàm, cho các giá trị phụ thuộc giá trị khác</h3>
<p>Một khoá config có thể là một HÀM nhận theme đã phân giải, đó là cách bạn xây dựng trên chính cái thang của mình mà không lặp lại:</p>

<pre><code class="language-js">extend: {
  // dung lai thang spacing cho mot thuoc tinh von khong dung no
  maxHeight: ({ theme }) =&gt; ({ ...theme('spacing'), 'screen-1/2': '50vh' }),
}
</code></pre>

<p>Chuyện này quan trọng vì đóng cứng <code>'2rem'</code> ở ba khoá config nghĩa là một cú đổi thang ÂM THẦM bỏ sót hai cái. Dạng hàm giữ MỘT nguồn sự thật, cùng lập luận với việc đặt tên cho một giá trị tuỳ ý lặp lại ở bài 1.2.</p>

<div class="pitfall">
<p><strong>Bẫy — mở rộng <code>colors</code> bằng một khoá TRÙNG TÊN một họ mặc định.</strong> Thêm <code>extend: { colors: { gray: { … } } }</code> KHÔNG trộn với <code>gray</code> của Tailwind — nó <em>THAY THẾ</em> trọn họ ấy, DÙ bạn đang ở bên trong <code>extend</code>. Việc trộn chỉ diễn ra SÂU MỘT TẦNG, nên mở rộng <code>colors</code> thì trộn các HỌ, và một họ bạn cung cấp GHI ĐÈ trọn họ mặc định cùng tên. Nếu bạn muốn chỉnh hai sắc xám, bạn phải viết lại cả mười một.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>theme.extend.x</code> TRỘN vào thang mặc định còn <code>theme.x</code> THAY THẾ nó trọn gói — đo được, khác biệt ấy âm thầm XOÁ <code>p-4</code> và <code>text-red-500</code> — và phép trộn chỉ SÂU MỘT TẦNG, nên mở rộng một họ màu sẽ GHI ĐÈ trọn họ ấy chứ không thêm vào nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Theme configuration</span><span class="lc-sub">tailwindcss.com/docs/theme — danh sách khoá đầy đủ, ngữ nghĩa <code>extend</code>, và thứ gần nhất với một lời phát biểu về luật trộn-sâu-một-tầng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing spacing</span><span class="lc-sub">tailwindcss.com/docs/customizing-spacing — những tiện ích nào ĐỌC thang spacing, và do đó một khoá thêm vào sinh ra bao nhiêu lớp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind source — resolveConfig</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss — chính phần cài đặt phép trộn. Đọc nó là cách NHANH NHẤT để dứt điểm mọi câu hỏi về cái gì trộn và cái gì thay thế.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 1 — cái thang mà config này mở rộng</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — các mặc định là gì, và 1.398 giá trị tuỳ ý mà kho này TRẢ GIÁ vì không mở rộng <code>fontSize</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Auditing what you added: four families used zero times|||5.2 — Soát cái bạn đã thêm: bốn họ màu dùng ĐÚNG 0 lần',
      slug: 'tw-5-2-soat-config',
      type: 'VIDEO',
      description: 'Config của kho này khai bốn màu "light theme (Facebook-like)". Đếm lượt dùng: `lightbg` 0, `lightcard` 0, `lightsurface` 0, `lightborder` 0. Trong khi bốn cái tối tương ứng dùng 2.677 lần. Số 0 ấy GIẢI THÍCH con bọ ở bài 4.5.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Auditing what you added: four families used zero times</h2>
<p class="lead">Config entries are write-once and read-never. Nobody deletes an unused colour, because deleting it feels risky and leaving it costs nothing visible. This lesson is a single shell loop that turns that invisible cost into a number, and on this codebase the number tells a story.</p>

<h3>The audit</h3>
<pre><code class="language-bash">$ for c in darkbg darkcard darksurface darkborder \\
           lightbg lightcard lightsurface lightborder; do
    n=$(grep -rhoE "\\b(bg|text|border|ring|divide|from|to|via)-$c\\b" \\
        src --include="*.tsx" | wc -l)
    printf "  %-14s %5d\\n" "$c" "$n"
  done
</code></pre>

<div class="out">  darkbg           641
  darkcard         615
  darksurface       12
  darkborder      1409
                  ─────
                   2677

  lightbg            0
  lightcard          0
  lightsurface       0
  lightborder        0
                  ─────
                      0
</div>

<p>The config comments label these two groups <code>// Dark theme colors</code> and <code>// Light theme colors (Facebook-like)</code>. They were clearly written as a matched pair. One half is used <strong>2,677 times</strong>. The other half is used <strong>never</strong>.</p>

<div class="callout warn">
<p><strong>This is the root cause of the incident in lesson 4.5.</strong> That lesson quoted the settings <code>primitives.tsx</code> header: the page it replaced hardcoded <code>#0a0a14</code>, so "the settings screen stayed pitch black in light mode while the rest of the site turned white". Now the mechanism is visible. Components styled themselves with <code>bg-darkcard</code> and <code>border-darkborder</code> — 2,677 uses of colours whose names contain the word <em>dark</em>. Those do not change with the theme. The light counterparts existed in config and no component ever reached for them, so there was nothing for light mode to switch to.</p>
</div>

<h3>Why the paired-palette design fails</h3>
<p>The intended model was presumably: use <code>darkbg</code> in dark mode, <code>lightbg</code> in light mode. That requires every component to <em>choose</em>, at every use site, which of the pair applies — and the only mechanism for choosing is a <code>dark:</code> variant, which this repository forbids outside Notes (lesson 2.4).</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">paired palette</span><span class="lz-nsub">what the config declares</span></span>
<span class="lz-nbody">Two colours per role, and each call site picks one. Needs a variant to switch, so every use is two classes. Forgetting the second is invisible until someone opens the other theme — which is exactly what happened.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">variable palette</span><span class="lz-nsub">what the codebase migrated to</span></span>
<span class="lz-nbody">One name per role, resolving per theme at runtime. <code>text-text-primary</code> is correct in both themes with no variant and no second code path. Impossible to half-apply, because there is only one thing to write.</span>
</div>
</div>

<h3>Measuring which model actually won</h3>
<pre><code class="language-bash">$ for c in neon studio cat state text; do
    n=$(grep -rhoE "\\b(bg|text|border|ring|from|to|via|shadow|fill)-$c-" \\
        src --include="*.tsx" | wc -l)
    printf "  %-8s %5d\\n" "$c" "$n"
  done
</code></pre>

<div class="out">  neon      4756
  text      5558     &lt;- ho tro boi bien CSS
  studio     424
  cat         26
  state       17
</div>

<p>The <code>text</code> family — <code>primary</code>, <code>secondary</code>, <code>muted</code>, each defined as <code>var(--text-primary)</code> and friends — is used <strong>5,558 times</strong>, more than any other custom family in the config. The hardcoded light palette, its conceptual competitor, is used zero. The codebase voted, and the measurement records the result.</p>

<div class="callout ok">
<p><strong>The lesson generalises past colour.</strong> Any config entry whose correct use requires the developer to remember a second step will eventually be half-applied. Colours needing a paired variant, spacing that only works with a matching gap, a shadow that assumes a particular background — all the same shape. Prefer entries that are correct on their own, because those cannot be forgotten halfway.</p>
</div>

<h3>The audit as a routine</h3>
<p>Run this over every custom key, not just colours, and act on what comes back:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0 uses</span><span class="lz-lnote">delete it — or find out why nobody uses it. Zero on one half of a matched pair is not "unused", it is a <em>design that did not take</em>, and it usually points at a live bug like this one</span></div>
<div class="lz-layer"><span class="lz-lname">1-3 uses</span><span class="lz-lnote">probably should have been an arbitrary value. A config entry earns its place by being reused; three uses does not repay the indirection of looking it up</span></div>
<div class="lz-layer"><span class="lz-lname">heavy use</span><span class="lz-lnote">correct, and worth protecting. <code>darkborder</code> at 1,409 uses is now load-bearing — renaming it is a 1,409-site change, so the name should be one you can live with</span></div>
<div class="lz-layer"><span class="lz-lname">used, but by the wrong name</span><span class="lz-lnote"><code>darkbg</code> at 641 uses is a colour named after a <em>theme</em> rather than a <em>role</em>. Lesson 5.3 is about why that naming is what made the light-mode bug possible</span></div>
</div>

<div class="callout warn">
<p><strong>What the audit cannot see.</strong> This grep only finds classes written literally. A colour referenced through a template literal or assembled at runtime is invisible to it — the same blind spot as the linter in lesson 3.3. So a zero here means "no literal uses", and the honest next step before deleting is a plain-text search for the bare name. On this codebase that search also returns nothing for the four light colours, which is why the conclusion stands.</p>
</div>

<div class="pitfall">
<p><strong>Trap — deleting the zero-use entries and calling it done.</strong> Removing <code>lightbg</code> and its three siblings tidies the config and fixes nothing: the settings screen is still black in light mode, because the actual problem is the 2,677 uses of theme-named colours. The zero is a <em>symptom</em> pointing at where the real work is. Cleaning up the symptom while leaving the cause is the most common way an audit produces motion without progress.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Config entries are never read after they are written, so audit them by counting real uses — this codebase declares four light-theme colours used <em>zero</em> times against four dark-theme colours used 2,677 times, and that asymmetry is not tidiness debt but the recorded cause of a screen that stayed black in light mode.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the 2026-07-02 theme rule</span><span class="lc-sub">the constraint that makes the paired palette unworkable here: <code>dark:</code> is reserved for the Notes wrapper, so there is no sanctioned mechanism for choosing between a colour pair.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing colors</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors — including the section on using CSS variables as colour values, which is the model that won here.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nathan Curtis — Naming Design Tokens</span><span class="lc-sub">medium.com/eightshapes-llc — on naming by role rather than by appearance or theme, which is the naming failure this measurement exposes.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — the variable palette in full</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — how <code>var(--text-primary)</code> in the config produces a class that is correct in both themes, and how to wire the variables themselves.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Soát cái bạn đã thêm: bốn họ màu dùng ĐÚNG 0 lần</h2>
<p class="lead">Các mục config được VIẾT MỘT LẦN và KHÔNG BAO GIỜ ĐỌC LẠI. Không ai xoá một cái màu không dùng, vì xoá thì có cảm giác RỦI RO còn để lại thì không tốn gì NHÌN THẤY ĐƯỢC. Bài này là MỘT vòng lặp shell biến cái giá vô hình ấy thành một CON SỐ, và trên kho mã này con số ấy kể một câu chuyện.</p>

<h3>Cuộc soát</h3>
<pre><code class="language-bash">$ for c in darkbg darkcard darksurface darkborder \\
           lightbg lightcard lightsurface lightborder; do
    n=$(grep -rhoE "\\b(bg|text|border|ring|divide|from|to|via)-$c\\b" \\
        src --include="*.tsx" | wc -l)
    printf "  %-14s %5d\\n" "$c" "$n"
  done
</code></pre>

<div class="out">  darkbg           641
  darkcard         615
  darksurface       12
  darkborder      1409
                  ─────
                   2677

  lightbg            0
  lightcard          0
  lightsurface       0
  lightborder        0
                  ─────
                      0
</div>

<p>Comment trong config gắn nhãn hai nhóm này là <code>// Dark theme colors</code> và <code>// Light theme colors (Facebook-like)</code>. Chúng rõ ràng được viết như một CẶP KHỚP NHAU. Một nửa được dùng <strong>2.677 lần</strong>. Nửa kia được dùng <strong>KHÔNG BAO GIỜ</strong>.</p>

<div class="callout warn">
<p><strong>Đây là NGUYÊN NHÂN GỐC của sự cố ở bài 4.5.</strong> Bài ấy trích phần đầu file <code>primitives.tsx</code> của settings: trang mà nó thay thế đã đóng cứng <code>#0a0a14</code>, nên "màn Cài đặt ĐEN KỊT trong theme sáng trong khi phần còn lại của trang web đã chuyển trắng". Giờ cơ chế NHÌN THẤY ĐƯỢC. Các component tự tạo kiểu bằng <code>bg-darkcard</code> và <code>border-darkborder</code> — 2.677 lượt dùng những màu mà TÊN chứa chữ <em>dark</em>. Những cái đó KHÔNG đổi theo theme. Các đối tác sáng CÓ trong config và KHÔNG component nào từng với tới, nên KHÔNG có gì để theme sáng chuyển sang cả.</p>
</div>

<h3>Vì sao thiết kế bảng-màu-cặp THẤT BẠI</h3>
<p>Mô hình dự định hẳn là: dùng <code>darkbg</code> ở chế độ tối, <code>lightbg</code> ở chế độ sáng. Cái đó đòi MỌI component phải <em>CHỌN</em>, ở MỌI chỗ dùng, cái nào trong cặp được áp — và cơ chế DUY NHẤT để chọn là một biến thể <code>dark:</code>, thứ mà kho này CẤM bên ngoài Notes (bài 2.4).</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bảng màu CẶP</span><span class="lz-nsub">cái config khai báo</span></span>
<span class="lz-nbody">Hai màu mỗi vai trò, và mỗi chỗ gọi chọn một. CẦN một biến thể để chuyển, nên mỗi lượt dùng là HAI lớp. Quên cái thứ hai thì VÔ HÌNH cho tới khi ai đó mở theme kia — đúng cái đã xảy ra.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bảng màu BIẾN</span><span class="lz-nsub">cái kho mã đã di trú sang</span></span>
<span class="lz-nbody">MỘT tên mỗi vai trò, phân giải theo từng theme lúc chạy. <code>text-text-primary</code> ĐÚNG ở cả hai theme mà không cần biến thể và không cần đường mã thứ hai. KHÔNG THỂ áp nửa vời, vì chỉ có MỘT thứ để viết.</span>
</div>
</div>

<h3>Đo xem mô hình nào THẬT SỰ thắng</h3>
<pre><code class="language-bash">$ for c in neon studio cat state text; do
    n=$(grep -rhoE "\\b(bg|text|border|ring|from|to|via|shadow|fill)-$c-" \\
        src --include="*.tsx" | wc -l)
    printf "  %-8s %5d\\n" "$c" "$n"
  done
</code></pre>

<div class="out">  neon      4756
  text      5558     &lt;- ho tro boi bien CSS
  studio     424
  cat         26
  state       17
</div>

<p>Họ <code>text</code> — <code>primary</code>, <code>secondary</code>, <code>muted</code>, mỗi cái định nghĩa là <code>var(--text-primary)</code> và họ hàng — được dùng <strong>5.558 lần</strong>, nhiều hơn bất kỳ họ tuỳ biến nào khác trong config. Bảng màu sáng đóng cứng, đối thủ khái niệm của nó, được dùng KHÔNG lần. Kho mã đã BỎ PHIẾU, và phép đo ghi lại kết quả.</p>

<div class="callout ok">
<p><strong>Bài học TỔNG QUÁT vượt ra ngoài chuyện màu.</strong> Bất kỳ mục config nào mà việc DÙNG ĐÚNG nó đòi lập trình viên phải NHỚ một bước thứ hai thì rốt cuộc sẽ bị áp NỬA VỜI. Màu cần một biến thể cặp, khoảng cách chỉ chạy khi có một gap khớp, một cái bóng giả định một nền cụ thể — tất cả cùng hình dạng. Hãy ưu tiên những mục ĐÚNG MỘT MÌNH, vì chúng KHÔNG THỂ bị quên nửa chừng.</p>
</div>

<h3>Cuộc soát như một THÓI QUEN</h3>
<p>Chạy cái này trên MỌI khoá tuỳ biến, không chỉ màu, và HÀNH ĐỘNG theo cái trả về:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">0 lượt dùng</span><span class="lz-lnote">xoá nó — hoặc tìm hiểu VÌ SAO không ai dùng. Số không trên MỘT NỬA của một cặp khớp thì không phải "không dùng tới", nó là một <em>THIẾT KẾ KHÔNG ĐƯỢC NHẬN</em>, và nó thường chỉ vào một con bọ đang sống như cái này</span></div>
<div class="lz-layer"><span class="lz-lname">1-3 lượt dùng</span><span class="lz-lnote">có lẽ đáng ra nên là một giá trị tuỳ ý. Một mục config XỨNG ĐÁNG chỗ đứng bằng cách được DÙNG LẠI; ba lượt không trả nổi cái giá gián tiếp của việc phải đi tra nó</span></div>
<div class="lz-layer"><span class="lz-lname">dùng NHIỀU</span><span class="lz-lnote">đúng đắn, và đáng BẢO VỆ. <code>darkborder</code> ở mức 1.409 lượt giờ CHỊU LỰC — đổi tên nó là một thay đổi 1.409 chỗ, nên cái tên phải là cái bạn sống chung được</span></div>
<div class="lz-layer"><span class="lz-lname">có dùng, nhưng SAI TÊN</span><span class="lz-lnote"><code>darkbg</code> ở mức 641 lượt là một màu đặt tên theo một <em>THEME</em> chứ không theo một <em>VAI TRÒ</em>. Bài 5.3 nói về việc chính cách đặt tên ấy đã làm con bọ theme sáng TRỞ NÊN CÓ THỂ</span></div>
</div>

<div class="callout warn">
<p><strong>Cái mà cuộc soát KHÔNG thấy được.</strong> Cú grep này chỉ tìm các lớp viết NGUYÊN VĂN. Một màu được tham chiếu qua chuỗi mẫu hay ghép lúc chạy thì VÔ HÌNH với nó — cùng điểm mù với bộ lint ở bài 3.3. Nên một số không ở đây nghĩa là "không có lượt dùng nguyên văn", và bước kế TRUNG THỰC trước khi xoá là một cú tìm toàn văn cho cái tên trần. Trên kho mã này cú tìm ấy cũng KHÔNG trả về gì cho bốn màu sáng, nên kết luận vẫn đứng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — xoá các mục 0-lượt-dùng rồi coi là XONG.</strong> Gỡ <code>lightbg</code> và ba anh em của nó thì DỌN GỌN config và KHÔNG vá được gì: màn Cài đặt VẪN đen trong theme sáng, vì vấn đề THẬT là 2.677 lượt dùng các màu đặt-tên-theo-theme. Số không là một <em>TRIỆU CHỨNG</em> chỉ vào chỗ có việc thật. Dọn triệu chứng mà để nguyên nguyên nhân là cách phổ biến nhất khiến một cuộc soát đẻ ra CHUYỂN ĐỘNG mà không có TIẾN BỘ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Các mục config KHÔNG bao giờ được đọc lại sau khi viết, nên hãy SOÁT chúng bằng cách đếm lượt dùng THẬT — kho mã này khai bốn màu theme sáng dùng <em>KHÔNG</em> lần đối chiếu bốn màu theme tối dùng 2.677 lần, và sự bất đối xứng ấy không phải nợ dọn dẹp mà là nguyên nhân ĐƯỢC GHI LẠI của một màn hình đen kịt trong theme sáng.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — luật theme 02/07/2026</span><span class="lc-sub">ràng buộc khiến bảng-màu-cặp KHÔNG chạy được ở đây: <code>dark:</code> dành riêng cho vỏ bọc Notes, nên KHÔNG có cơ chế nào được phép để chọn giữa một cặp màu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing colors</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors — gồm cả mục về dùng BIẾN CSS làm giá trị màu, chính là mô hình đã thắng ở đây.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nathan Curtis — Naming Design Tokens</span><span class="lc-sub">medium.com/eightshapes-llc — về đặt tên theo VAI TRÒ chứ không theo diện mạo hay theme, chính là cú hỏng đặt tên mà phép đo này phơi ra.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — bảng màu biến, đầy đủ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — cách <code>var(--text-primary)</code> trong config sinh ra một lớp ĐÚNG ở cả hai theme, và cách cắm chính các biến ấy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Naming by role, not by appearance|||5.3 — Đặt tên theo VAI TRÒ, không theo DIỆN MẠO',
      slug: 'tw-5-3-dat-ten',
      type: 'VIDEO',
      description: '`darkbg` được dùng 641 lần và cái tên ấy chính là con bọ: nó gắn một VAI TRÒ ("nền thẻ") vào một THEME. Ba tầng đặt tên, và luật kiểm chứng được: nếu đổi thương hiệu làm cái tên SAI, thì cái tên ấy đã sai từ đầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Naming by role, not by appearance</h2>
<p class="lead">Lesson 5.2 found four colours used zero times and 2,677 uses of their counterparts. The imbalance was caused by naming: <code>darkbg</code> puts a <em>theme</em> in the name of a <em>role</em>, and once that is in 641 call sites it cannot be themed. This lesson is about the three layers that avoid it.</p>

<h3>The three layers</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1 · primitive</span><span class="lz-nsub"><code>slate-900</code>, <code>#0f172a</code></span></span>
<span class="lz-nbody">The raw pigment. No meaning, no context, never changes. Tailwind's default palette is entirely this layer. Referencing it directly from a component is what makes a redesign a find-and-replace.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2 · semantic</span><span class="lz-nsub"><code>--bg-card</code>, <code>--text-primary</code></span></span>
<span class="lz-nbody">What the colour is FOR. "The background of a card", not "dark blue". This is the layer that can be re-pointed per theme, because the role stays true while the pigment changes underneath.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3 · component</span><span class="lz-nsub"><code>bg-card</code>, <code>text-text-primary</code></span></span>
<span class="lz-nbody">The class a developer types. Should reference layer 2, never layer 1. This is the only layer that appears in 26,343 class attributes, so it is the one whose name must survive.</span>
</div>
</div>

<h3>Testing a name in one question</h3>
<p>There is a mechanical check for whether a name belongs to layer 2 or has leaked layer 1:</p>

<div class="callout">
<p><strong>The question.</strong> <em>If the design changed, would this name become a lie?</em> Rebrand from blue to green: <code>bg-blue-600</code> becomes wrong everywhere it means "primary action". Switch to a light theme: <code>bg-darkcard</code> becomes wrong everywhere it means "card surface". Both names encoded something that turned out to be variable. <code>bg-card</code> and <code>bg-primary</code> survive both changes untouched.</p>
</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">names a THEME</span><span class="lz-lnote"><code>darkbg</code>, <code>lightcard</code> — 2,677 and 0 uses here. Breaks the moment a second theme exists, which is the whole point of having themes</span></div>
<div class="lz-layer"><span class="lz-lname">names a PIGMENT</span><span class="lz-lnote"><code>bg-blue-600</code> for a primary button. Breaks on rebrand, and the rename is not mechanical because some blues meant "primary" and others just meant "blue"</span></div>
<div class="lz-layer"><span class="lz-lname">names a PLACE</span><span class="lz-lnote"><code>sidebar-bg</code>. Breaks when the same surface appears in a modal. Places are more stable than pigments but less stable than roles</span></div>
<div class="lz-layer"><span class="lz-lname">names a ROLE</span><span class="lz-lnote"><code>bg-card</code>, <code>text-muted</code>, <code>border-subtle</code>. Survives rebrands, theme additions and layout changes, because the role is what was actually stable all along</span></div>
</div>

<h3>What this codebase gets right and wrong, side by side</h3>
<div class="out">RIGHT — role names, theme-resolved:
  text-text-primary     1389
  text-text-secondary    801
  text-text-muted       2114
                        ─────
                        4304   ("primary/secondary/muted" = VAI TRO)

WRONG — theme names, hardcoded:
  bg-darkcard            615
  border-darkborder     1409
  bg-darkbg              641
                        ─────
                        2665   ("dark…" = TEN THEME)
</div>

<p>Both patterns are live in the same repository, in similar volumes. The <code>text-*</code> family is a correct layer-2 design and is the most-used custom family in the config. The <code>dark*</code> family is a layer-1 leak, and lesson 5.2 measured its consequence.</p>

<div class="callout ok">
<p><strong>Why the correct one is also shorter to write.</strong> <code>text-text-primary</code> is a slightly awkward name — the repetition comes from the family being called <code>text</code> inside the <code>colors</code> key. Naming the family <code>fg</code> or <code>content</code> would give <code>text-fg-primary</code>. That is a real cost of the design, and worth noting because the awkwardness is the sort of thing that pushes people back toward <code>bg-darkcard</code>, which reads better and is wrong.</p>
</div>

<h3>The migration cost, stated in numbers</h3>
<p>Renaming <code>darkbg</code> → <code>bg-surface</code> across 641 call sites is mechanical but not free, and the reason to do it is not tidiness:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">add the new name</span><span class="lz-d">Define <code>surface: 'var(--bg-surface)'</code> in config alongside the old <code>darkbg</code>. Both work; nothing breaks. This is the step that makes the rest incremental.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">point the variable at the old value</span><span class="lz-d"><code>--bg-surface: #18191a</code> in the dark theme block — the same hex <code>darkbg</code> already was. Now the new class renders identically, so a migration commit changes nothing visually and is safe to review.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">migrate call sites in batches</span><span class="lz-d">641 of them, by feature area, each batch independently verifiable. Nothing changes appearance because step 2 made the two names synonyms.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">now the light theme becomes possible</span><span class="lz-d">Set <code>--bg-surface</code> to a light value under the light theme selector. Every migrated call site follows automatically — which is the payoff, and it was unreachable while the name said <em>dark</em>.</span></div>
</div>

<div class="callout warn">
<p><strong>The step people skip is number two.</strong> Renaming and re-valuing in the same commit means every visual difference is ambiguous: is that a rename bug or an intended colour change? Making the new name a synonym first turns a risky 641-site refactor into a boring one, and boring is the goal.</p>
</div>

<div class="pitfall">
<p><strong>Trap — semantic names that are secretly pigments.</strong> <code>bg-primary</code> looks like a role and often is not: if <code>primary</code> is defined as your brand blue and used for backgrounds, borders, text and focus rings, it is a pigment wearing a role's name. The test is whether you can change it independently — if making <code>primary</code> darker for text contrast would break every button, the name covers several roles and needs splitting into <code>bg-primary</code>, <code>text-on-primary</code> and <code>border-primary</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A name should survive every change the thing it names does not control — <code>darkbg</code> encodes a theme into 641 call sites and became unthemeable, while this repo's <code>text-primary</code>/<code>secondary</code>/<code>muted</code> family names roles and is used 4,304 times across both themes with no second code path.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nathan Curtis — Naming Design Tokens</span><span class="lc-sub">medium.com/eightshapes-llc — the three-layer model in full, with the vocabulary most design systems have converged on.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">W3C — Design Tokens Community Group format</span><span class="lc-sub">tr.designtokens.org — the emerging standard, which makes the primitive/semantic split explicit through token aliasing.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing colors</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors — how a config colour can be a CSS variable, which is what makes layer 2 expressible inside the config at all.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 6 — wiring the variables behind the names</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — defining <code>--bg-card</code> per theme, and why the <code>&lt;alpha-value&gt;</code> syntax matters if you want opacity modifiers to keep working.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Đặt tên theo VAI TRÒ, không theo DIỆN MẠO</h2>
<p class="lead">Bài 5.2 tìm ra bốn màu dùng KHÔNG lần và 2.677 lượt dùng các đối tác của chúng. Sự mất cân bằng ấy do ĐẶT TÊN gây ra: <code>darkbg</code> nhét một <em>THEME</em> vào tên của một <em>VAI TRÒ</em>, và một khi cái đó nằm ở 641 chỗ gọi thì nó KHÔNG thể đổi theme được nữa. Bài này nói về BA TẦNG giúp tránh chuyện đó.</p>

<h3>Ba tầng</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">1 · nguyên thể</span><span class="lz-nsub"><code>slate-900</code>, <code>#0f172a</code></span></span>
<span class="lz-nbody">SẮC TỐ thô. Không nghĩa, không ngữ cảnh, không bao giờ đổi. Bảng màu mặc định của Tailwind hoàn toàn thuộc tầng này. Tham chiếu thẳng nó từ một component là thứ biến một cuộc thiết kế lại thành một cú tìm-và-thay.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">2 · ngữ nghĩa</span><span class="lz-nsub"><code>--bg-card</code>, <code>--text-primary</code></span></span>
<span class="lz-nbody">Màu ấy ĐỂ LÀM GÌ. "Nền của một cái thẻ", không phải "xanh đậm". Đây là tầng có thể TRỎ LẠI theo từng theme, vì vai trò vẫn ĐÚNG trong khi sắc tố bên dưới thay đổi.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">3 · component</span><span class="lz-nsub"><code>bg-card</code>, <code>text-text-primary</code></span></span>
<span class="lz-nbody">Cái LỚP mà lập trình viên gõ. Nên tham chiếu tầng 2, KHÔNG BAO GIỜ tầng 1. Đây là tầng DUY NHẤT xuất hiện trong 26.343 thuộc tính lớp, nên nó là cái mà TÊN của nó phải SỐNG SÓT.</span>
</div>
</div>

<h3>Kiểm một cái tên bằng MỘT câu hỏi</h3>
<p>Có một phép kiểm MÁY MÓC để biết một cái tên thuộc tầng 2 hay đã rò rỉ tầng 1:</p>

<div class="callout">
<p><strong>Câu hỏi.</strong> <em>Nếu thiết kế THAY ĐỔI, cái tên này có trở thành một LỜI NÓI DỐI không?</em> Đổi thương hiệu từ xanh dương sang xanh lá: <code>bg-blue-600</code> trở thành SAI ở mọi nơi nó có nghĩa "hành động chính". Chuyển sang theme sáng: <code>bg-darkcard</code> trở thành SAI ở mọi nơi nó có nghĩa "bề mặt thẻ". Cả hai cái tên đều mã hoá một thứ HOÁ RA là BIẾN THIÊN. <code>bg-card</code> và <code>bg-primary</code> sống sót qua CẢ HAI thay đổi mà không phải động vào.</p>
</div>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đặt tên theo THEME</span><span class="lz-lnote"><code>darkbg</code>, <code>lightcard</code> — 2.677 và 0 lượt dùng ở đây. VỠ ngay khoảnh khắc có theme thứ hai, mà đó chính là toàn bộ lý do có theme</span></div>
<div class="lz-layer"><span class="lz-lname">đặt tên theo SẮC TỐ</span><span class="lz-lnote"><code>bg-blue-600</code> cho một nút chính. VỠ khi đổi thương hiệu, và cú đổi tên KHÔNG máy móc được vì vài cái xanh nghĩa là "chính" còn vài cái chỉ nghĩa là "xanh"</span></div>
<div class="lz-layer"><span class="lz-lname">đặt tên theo NƠI CHỐN</span><span class="lz-lnote"><code>sidebar-bg</code>. VỠ khi cùng bề mặt ấy xuất hiện trong một hộp thoại. Nơi chốn ỔN ĐỊNH hơn sắc tố nhưng kém ổn định hơn vai trò</span></div>
<div class="lz-layer"><span class="lz-lname">đặt tên theo VAI TRÒ</span><span class="lz-lnote"><code>bg-card</code>, <code>text-muted</code>, <code>border-subtle</code>. Sống sót qua đổi thương hiệu, thêm theme và đổi bố cục, vì VAI TRÒ mới là thứ vốn ổn định suốt từ đầu</span></div>
</div>

<h3>Kho mã này làm ĐÚNG và làm SAI, đặt cạnh nhau</h3>
<div class="out">DUNG — ten VAI TRO, phan giai theo theme:
  text-text-primary     1389
  text-text-secondary    801
  text-text-muted       2114
                        ─────
                        4304   ("primary/secondary/muted" = VAI TRO)

SAI — ten THEME, dong cung:
  bg-darkcard            615
  border-darkborder     1409
  bg-darkbg              641
                        ─────
                        2665   ("dark…" = TEN THEME)
</div>

<p>CẢ HAI khuôn mẫu đều đang sống trong CÙNG một kho, với khối lượng tương đương. Họ <code>text-*</code> là một thiết kế tầng-2 ĐÚNG và là họ tuỳ biến được dùng nhiều nhất trong config. Họ <code>dark*</code> là một cú rò rỉ tầng-1, và bài 5.2 đã đo hệ quả của nó.</p>

<div class="callout ok">
<p><strong>Vì sao cái ĐÚNG lại cũng DÀI hơn khi viết.</strong> <code>text-text-primary</code> là một cái tên hơi VỤNG — sự lặp lại đến từ việc cái họ được gọi là <code>text</code> bên trong khoá <code>colors</code>. Đặt tên họ ấy là <code>fg</code> hay <code>content</code> sẽ cho <code>text-fg-primary</code>. Đó là một CÁI GIÁ THẬT của thiết kế, và đáng nói vì sự vụng về ấy chính là loại thứ đẩy người ta quay về <code>bg-darkcard</code>, thứ ĐỌC XUÔI HƠN và SAI.</p>
</div>

<h3>Cái giá di trú, nói bằng con số</h3>
<p>Đổi tên <code>darkbg</code> → <code>bg-surface</code> qua 641 chỗ gọi thì máy móc nhưng KHÔNG miễn phí, và lý do làm việc ấy KHÔNG phải sự gọn gàng:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">THÊM cái tên mới</span><span class="lz-d">Định nghĩa <code>surface: 'var(--bg-surface)'</code> trong config BÊN CẠNH cái <code>darkbg</code> cũ. Cả hai đều chạy; không gì vỡ. Đây là bước làm cho phần còn lại trở nên TỪNG BƯỚC.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">TRỎ cái biến vào giá trị CŨ</span><span class="lz-d"><code>--bg-surface: #18191a</code> trong khối theme tối — ĐÚNG cái hex mà <code>darkbg</code> vốn là. Giờ lớp mới dựng ra GIỐNG HỆT, nên một commit di trú KHÔNG đổi gì về thị giác và AN TOÀN để review.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">di trú các chỗ gọi theo LÔ</span><span class="lz-d">641 chỗ, theo vùng tính năng, mỗi lô xác minh được độc lập. KHÔNG gì đổi diện mạo vì bước 2 đã làm hai cái tên thành ĐỒNG NGHĨA.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">giờ theme SÁNG mới KHẢ THI</span><span class="lz-d">Đặt <code>--bg-surface</code> thành một giá trị sáng dưới selector theme sáng. MỌI chỗ gọi đã di trú tự động theo — đó là PHẦN THƯỞNG, và nó KHÔNG với tới được khi cái tên còn nói chữ <em>dark</em>.</span></div>
</div>

<div class="callout warn">
<p><strong>Bước người ta hay BỎ QUA là bước hai.</strong> Đổi tên VÀ đổi giá trị trong CÙNG một commit nghĩa là mọi khác biệt thị giác đều MƠ HỒ: đó là một con bọ đổi tên hay một cú đổi màu có chủ ý? Làm cái tên mới thành ĐỒNG NGHĨA trước biến một cú tái cấu trúc 641-chỗ RỦI RO thành một cú NHÀM CHÁN, và nhàm chán mới là MỤC TIÊU.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — những cái tên ngữ nghĩa mà BÍ MẬT là sắc tố.</strong> <code>bg-primary</code> TRÔNG như một vai trò và thường thì không phải: nếu <code>primary</code> được định nghĩa là màu xanh thương hiệu của bạn và dùng cho nền, viền, chữ VÀ vòng focus, thì nó là một SẮC TỐ đội lốt tên một vai trò. Phép kiểm là bạn có đổi nó ĐỘC LẬP được không — nếu làm <code>primary</code> tối hơn để tăng tương phản chữ sẽ làm vỡ mọi cái nút, thì cái tên ấy đang bao NHIỀU vai trò và cần được chẻ thành <code>bg-primary</code>, <code>text-on-primary</code> và <code>border-primary</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một cái tên nên SỐNG SÓT qua mọi thay đổi mà thứ nó gọi tên KHÔNG kiểm soát — <code>darkbg</code> mã hoá một theme vào 641 chỗ gọi và trở nên không-đổi-theme-được, trong khi họ <code>text-primary</code>/<code>secondary</code>/<code>muted</code> của kho này đặt tên theo VAI TRÒ và được dùng 4.304 lần ở CẢ HAI theme mà không cần đường mã thứ hai.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Nathan Curtis — Naming Design Tokens</span><span class="lc-sub">medium.com/eightshapes-llc — mô hình ba tầng đầy đủ, với bộ từ vựng mà hầu hết hệ thiết kế đã HỘI TỤ về.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">W3C — Design Tokens Community Group format</span><span class="lc-sub">tr.designtokens.org — chuẩn đang hình thành, làm cho sự chẻ nguyên-thể/ngữ-nghĩa trở nên TƯỜNG MINH qua cơ chế bí danh token.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Customizing colors</span><span class="lc-sub">tailwindcss.com/docs/customizing-colors — cách một màu trong config CÓ THỂ là một biến CSS, chính là thứ làm cho tầng 2 diễn đạt được BÊN TRONG config.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 6 — cắm các biến đằng sau những cái tên</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — định nghĩa <code>--bg-card</code> theo từng theme, và vì sao cú pháp <code>&lt;alpha-value&gt;</code> quan trọng nếu bạn muốn các bổ từ độ mờ vẫn chạy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Animations, and a measurement that lied|||5.4 — Hoạt ảnh, và một phép đo NÓI DỐI',
      slug: 'tw-5-4-hoat-anh',
      type: 'VIDEO',
      description: '13 hoạt ảnh khai báo, 4 được dùng. Rồi tôi kiểm `motion-reduce:` trên từng thẻ và được "KHÔNG CÓ CHỐT" cho cả sáu — SAI. Chốt nằm trong CSS, theo lớp, ở dòng 2509. Một phép đo chỉ nhìn MỘT trong hai cơ chế báo ra một vấn đề KHÔNG có thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Animations, and a measurement that lied</h2>
<p class="lead">This lesson has two halves. The first is a straightforward audit of thirteen custom animations. The second is a false alarm I generated while auditing them, kept in full because the mistake is more instructive than the finding.</p>

<h3>The pair: keyframes and animation</h3>
<p>Custom animation always needs two config keys. <code>keyframes</code> defines the movement; <code>animation</code> names a particular timing of it:</p>

<pre><code class="language-ts">keyframes: {
  auroraDrift1: {
    "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
    "33%":      { transform: "translate3d(8%, -4%, 0) scale(1.08)" },
    "66%":      { transform: "translate3d(-6%, 6%, 0) scale(0.95)" },
  },
},
animation: {
  "aurora-drift-slow":   "auroraDrift1 44s ease-in-out infinite",
  "aurora-drift-slower": "auroraDrift2 56s ease-in-out infinite",
},
</code></pre>

<p>Note the config's own comment on these: <em>"Pure transform-only animation so it stays GPU-friendly and never causes layout thrash."</em> That is the single most important rule for web animation — <code>transform</code> and <code>opacity</code> are composited on the GPU, while animating <code>width</code>, <code>top</code> or <code>margin</code> forces layout recalculation on every frame.</p>

<h3>The audit: thirteen declared, four used</h3>
<pre><code class="language-bash">$ for a in fade-in slide-up slide-down float glow pulse-slow \\
           aurora-drift-slow aurora-drift-slower shimmer-sweep \\
           caret-blink scroll-cue-pulse reel-spin projector-pulse; do
    printf "  animate-%-22s %4d\\n" "$a" \\
      "$(grep -rho "animate-$a\\b" src --include="*.tsx" --include="*.css" | wc -l)"
  done
</code></pre>

<div class="out">  animate-fade-in                   0
  animate-slide-up                  0
  animate-slide-down                0
  animate-float                     0
  animate-glow                      0
  animate-pulse-slow                0
  animate-aurora-drift-slow         5
  animate-aurora-drift-slower       3
  animate-shimmer-sweep             0
  animate-caret-blink               0
  animate-scroll-cue-pulse          0
  animate-reel-spin                 2
  animate-projector-pulse           2
</div>

<p><strong>Nine of thirteen are used zero times.</strong> The same pattern lesson 5.2 found in the colours — config accretes, nothing prunes it. The six generic ones (<code>fade-in</code>, <code>slide-up</code>, <code>slide-down</code>, <code>float</code>, <code>glow</code>, <code>pulse-slow</code>) look like a starter set added at project setup and never adopted.</p>

<h3>The measurement that lied</h3>
<p>Long looping animations are an accessibility concern, so I checked whether the four used ones carry a <code>motion-reduce:</code> guard on the element:</p>

<pre><code class="language-bash">$ grep -rhoE 'className="[^"]*animate-(aurora|reel|projector)[^"]*"' src --include="*.tsx" \\
  | while read -r line; do
      a=$(echo "$line" | grep -oE 'animate-[a-z-]+' | head -1)
      echo "$line" | grep -q 'motion-reduce:animate-none' &amp;&amp; g="GUARDED" || g="-- NO GUARD"
      printf "  %-28s %s\\n" "$a" "$g"
    done
</code></pre>

<div class="out">  animate-aurora-drift-slow    -- NO GUARD
  animate-aurora-drift-slower  -- NO GUARD
  animate-aurora-drift-slow    -- NO GUARD
  animate-projector-pulse      -- NO GUARD
  animate-aurora-drift-slow    -- NO GUARD
  animate-aurora-drift-slower  -- NO GUARD
</div>

<p>Six out of six unguarded — a 44-second infinite drift with no reduced-motion handling. That is a real accessibility defect, and I nearly wrote it up as one.</p>

<div class="callout warn">
<p><strong>It was wrong.</strong> The check only looked for the <code>motion-reduce:</code> <em>variant</em>, which is one of two ways to guard an animation. The other is a plain CSS media query targeting the class. Grepping for the second mechanism found seventeen <code>prefers-reduced-motion</code> blocks in <code>globals.css</code> — and line 2509 is this:</p>
</div>

<div class="out">/* If the user has prefers-reduced-motion set, kill the
 * ambient drift + shimmer + caret pulse. The page stays
 * usable; it just stops moving. */
@media (prefers-reduced-motion: reduce) {
  .animate-aurora-drift-slow,
  .animate-aurora-drift-slower,
  .shimmer-track::after,
  .scroll-cue,
  .hero-caret,
  .noise-overlay::after,
  .film-grain::after,
  .animate-reel-spin,
  .animate-projector-pulse {
    animation: none !important;
  }
}
</div>

<p>All four used animations are named there explicitly. The repository is <em>correct</em> on this, and my audit reported a defect that does not exist.</p>

<div class="callout ok">
<p><strong>What the mistake teaches.</strong> A measurement that checks one of several possible mechanisms produces false negatives, and a false negative in an audit is worse than no audit — it manufactures work and, if acted on, adds a redundant guard that implies the CSS one is missing. Before reporting "X is not handled", enumerate the ways X <em>could</em> be handled and check each. Here there were two, and I checked one.</p>
</div>

<h3>The two guarding mechanisms, and when each fits</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CSS media query, by class</span><span class="lz-nsub">what this repo chose</span></span>
<span class="lz-nbody">One block covers every use of that animation, forever, including uses added later. Cannot be forgotten at a call site. The cost: invisible from the component — a reader of the JSX has no way to know the guard exists, which is exactly what tripped my audit.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle"><code>motion-reduce:</code> variant</span><span class="lz-nsub">visible at the call site</span></span>
<span class="lz-nbody"><code>animate-float motion-reduce:animate-none</code>. Self-documenting and greppable. The cost: it must be repeated at every use site, so the fifth use added six months later will be the one that forgets.</span>
</div>
</div>

<p>The repo actually uses both — ten <code>motion-reduce:</code> variants exist elsewhere alongside the CSS blocks. That is fine; the failure mode to avoid is using neither, and the way to check is to search for both.</p>

<h3>The pruning question</h3>
<p>What should happen to the nine unused animations? Unlike an unused colour, an unused <code>animation</code> entry costs output bytes — its <code>keyframes</code> block is emitted whether or not the animation class is used, because <code>@keyframes</code> is not tree-shaken by class detection:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the keyframes ship regardless</span><span class="lz-lnote">nine unused <code>@keyframes</code> blocks in every CSS payload. Small in absolute terms, but it is dead weight that no build step removes for you</span></div>
<div class="lz-layer"><span class="lz-lname">they also mislead</span><span class="lz-lnote">a developer who finds <code>animate-fade-in</code> in the config reasonably assumes it is the house convention for entrance animations. Adopting it revives a nine-month-dead entry rather than following whatever the codebase actually does</span></div>
<div class="lz-layer"><span class="lz-lname">delete, but check CSS first</span><span class="lz-lnote">the audit above greps <code>.tsx</code> and <code>.css</code>. An animation could also be referenced from a <code>style</code> attribute or a CSS <code>animation:</code> shorthand by keyframe name — search the bare keyframe name (<code>auroraDrift1</code>) before removing anything</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — adding a redundant guard because the audit said it was missing.</strong> If I had acted on that first measurement, six elements would have gained <code>motion-reduce:animate-none</code> on top of a CSS rule that already did the job. Harmless in effect, but it plants a false signal: the next reader sees the variant on some uses and not others and concludes the bare ones are bugs. A wrong audit does not stay wrong quietly; it propagates into the code as noise.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Thirteen animations were declared and four are used, which is the same accretion lesson 5.2 found in colours — and the more useful finding is that my accessibility audit reported six unguarded animations that were in fact guarded by a CSS media query, because a check that looks at only one of two possible mechanisms manufactures defects that do not exist.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — prefers-reduced-motion</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — who enables it and why. The setting exists for vestibular disorders, not aesthetic preference.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.3.3 — Animation from Interactions</span><span class="lc-sub">w3.org/WAI/WCAG21/Understanding/animation-from-interactions — the criterion that makes reduced-motion support a requirement rather than a courtesy for non-essential motion.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Animations and performance</span><span class="lc-sub">web.dev/animations-guide — why <code>transform</code> and <code>opacity</code> are cheap and everything else forces layout, which is the rule this repo's aurora keyframes follow deliberately.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 9 — the accessibility audit done properly</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — running contrast and motion checks across the whole codebase, with the enumerate-the-mechanisms rule this lesson learned the hard way.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Hoạt ảnh, và một phép đo NÓI DỐI</h2>
<p class="lead">Bài này có HAI nửa. Nửa đầu là một cuộc soát thẳng thắn mười ba hoạt ảnh tuỳ biến. Nửa sau là một BÁO ĐỘNG GIẢ mà chính tôi tạo ra trong lúc soát chúng, giữ nguyên vẹn vì SAI LẦM dạy được nhiều hơn PHÁT HIỆN.</p>

<h3>Cặp đôi: keyframes và animation</h3>
<p>Hoạt ảnh tuỳ biến LUÔN cần hai khoá config. <code>keyframes</code> định nghĩa CHUYỂN ĐỘNG; <code>animation</code> đặt tên cho một cách ĐỊNH THỜI cụ thể của nó:</p>

<pre><code class="language-ts">keyframes: {
  auroraDrift1: {
    "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
    "33%":      { transform: "translate3d(8%, -4%, 0) scale(1.08)" },
    "66%":      { transform: "translate3d(-6%, 6%, 0) scale(0.95)" },
  },
},
animation: {
  "aurora-drift-slow":   "auroraDrift1 44s ease-in-out infinite",
  "aurora-drift-slower": "auroraDrift2 56s ease-in-out infinite",
},
</code></pre>

<p>Để ý comment của chính config về chúng: <em>"Hoạt ảnh CHỈ dùng transform nên nó thân thiện với GPU và KHÔNG BAO GIỜ gây giật bố cục."</em> Đó là luật QUAN TRỌNG NHẤT cho hoạt ảnh web — <code>transform</code> và <code>opacity</code> được ghép trên GPU, trong khi hoạt ảnh hoá <code>width</code>, <code>top</code> hay <code>margin</code> ÉP tính lại bố cục ở MỌI khung hình.</p>

<h3>Cuộc soát: mười ba khai báo, bốn được dùng</h3>
<pre><code class="language-bash">$ for a in fade-in slide-up slide-down float glow pulse-slow \\
           aurora-drift-slow aurora-drift-slower shimmer-sweep \\
           caret-blink scroll-cue-pulse reel-spin projector-pulse; do
    printf "  animate-%-22s %4d\\n" "$a" \\
      "$(grep -rho "animate-$a\\b" src --include="*.tsx" --include="*.css" | wc -l)"
  done
</code></pre>

<div class="out">  animate-fade-in                   0
  animate-slide-up                  0
  animate-slide-down                0
  animate-float                     0
  animate-glow                      0
  animate-pulse-slow                0
  animate-aurora-drift-slow         5
  animate-aurora-drift-slower       3
  animate-shimmer-sweep             0
  animate-caret-blink               0
  animate-scroll-cue-pulse          0
  animate-reel-spin                 2
  animate-projector-pulse           2
</div>

<p><strong>Chín trên mười ba dùng KHÔNG lần.</strong> Cùng khuôn mẫu mà bài 5.2 tìm ra ở phần màu — config TÍCH TỤ, không gì TỈA nó. Sáu cái chung chung (<code>fade-in</code>, <code>slide-up</code>, <code>slide-down</code>, <code>float</code>, <code>glow</code>, <code>pulse-slow</code>) trông như một bộ khởi động thêm vào lúc dựng dự án rồi KHÔNG BAO GIỜ được nhận.</p>

<h3>Phép đo NÓI DỐI</h3>
<p>Hoạt ảnh lặp dài là một mối lo về khả năng tiếp cận, nên tôi kiểm xem bốn cái ĐANG DÙNG có mang một chốt <code>motion-reduce:</code> trên thẻ không:</p>

<pre><code class="language-bash">$ grep -rhoE 'className="[^"]*animate-(aurora|reel|projector)[^"]*"' src --include="*.tsx" \\
  | while read -r line; do
      a=$(echo "$line" | grep -oE 'animate-[a-z-]+' | head -1)
      echo "$line" | grep -q 'motion-reduce:animate-none' &amp;&amp; g="CO CHOT" || g="-- KHONG CHOT"
      printf "  %-28s %s\\n" "$a" "$g"
    done
</code></pre>

<div class="out">  animate-aurora-drift-slow    -- KHONG CHOT
  animate-aurora-drift-slower  -- KHONG CHOT
  animate-aurora-drift-slow    -- KHONG CHOT
  animate-projector-pulse      -- KHONG CHOT
  animate-aurora-drift-slow    -- KHONG CHOT
  animate-aurora-drift-slower  -- KHONG CHOT
</div>

<p>Sáu trên sáu KHÔNG có chốt — một cú trôi vô hạn 44 giây không hề xử lý giảm-chuyển-động. Đó là một KHUYẾT TẬT tiếp cận thật, và tôi SUÝT viết nó lên như một khuyết tật.</p>

<div class="callout warn">
<p><strong>Nó SAI.</strong> Phép kiểm CHỈ tìm <em>BIẾN THỂ</em> <code>motion-reduce:</code>, vốn là MỘT trong HAI cách chốt một hoạt ảnh. Cách kia là một media query CSS THUẦN nhắm vào cái LỚP. Grep cho cơ chế thứ hai tìm ra MƯỜI BẢY khối <code>prefers-reduced-motion</code> trong <code>globals.css</code> — và dòng 2509 là thế này:</p>
</div>

<div class="out">/* Neu nguoi dung dat prefers-reduced-motion thi GIET
 * cu troi nen + shimmer + nhip nhay con tro. Trang van
 * dung duoc; no chi NGUNG CHUYEN DONG. */
@media (prefers-reduced-motion: reduce) {
  .animate-aurora-drift-slow,
  .animate-aurora-drift-slower,
  .shimmer-track::after,
  .scroll-cue,
  .hero-caret,
  .noise-overlay::after,
  .film-grain::after,
  .animate-reel-spin,
  .animate-projector-pulse {
    animation: none !important;
  }
}
</div>

<p>Cả bốn hoạt ảnh đang dùng đều được nêu TÊN TƯỜNG MINH ở đó. Kho này làm <em>ĐÚNG</em> chuyện này, và cuộc soát của tôi báo ra một khuyết tật KHÔNG tồn tại.</p>

<div class="callout ok">
<p><strong>Sai lầm ấy dạy gì.</strong> Một phép đo kiểm MỘT trong NHIỀU cơ chế khả dĩ thì đẻ ra ÂM TÍNH GIẢ, và một âm tính giả trong một cuộc soát còn TỆ HƠN không soát — nó CHẾ TẠO ra việc, và nếu hành động theo thì thêm một cái chốt THỪA hàm ý rằng cái chốt CSS đang thiếu. Trước khi báo cáo "X không được xử lý", hãy LIỆT KÊ những cách X <em>CÓ THỂ</em> được xử lý và kiểm từng cách. Ở đây có HAI, và tôi kiểm MỘT.</p>
</div>

<h3>Hai cơ chế chốt, và cái nào hợp khi nào</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">media query CSS, theo LỚP</span><span class="lz-nsub">cái kho này chọn</span></span>
<span class="lz-nbody">MỘT khối bao MỌI lượt dùng hoạt ảnh ấy, mãi mãi, gồm cả các lượt thêm SAU. KHÔNG THỂ quên ở một chỗ gọi. Cái giá: VÔ HÌNH từ component — người đọc JSX KHÔNG có cách nào biết cái chốt tồn tại, chính là thứ đã làm cuộc soát của tôi vấp.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">biến thể <code>motion-reduce:</code></span><span class="lz-nsub">NHÌN THẤY tại chỗ gọi</span></span>
<span class="lz-nbody"><code>animate-float motion-reduce:animate-none</code>. Tự-ghi-tài-liệu và grep được. Cái giá: nó phải LẶP LẠI ở mọi chỗ dùng, nên lượt dùng thứ năm thêm vào sáu tháng sau sẽ là lượt QUÊN.</span>
</div>
</div>

<p>Kho này thực ra dùng CẢ HAI — mười biến thể <code>motion-reduce:</code> tồn tại ở chỗ khác bên cạnh các khối CSS. Thế là ổn; kiểu hỏng cần tránh là dùng KHÔNG CÁI NÀO, và cách kiểm là TÌM CẢ HAI.</p>

<h3>Câu hỏi TỈA BỚT</h3>
<p>Chín hoạt ảnh không dùng nên xử lý thế nào? Khác một cái màu không dùng, một mục <code>animation</code> không dùng TỐN byte đầu ra — khối <code>keyframes</code> của nó được phát sinh BẤT KỂ lớp hoạt ảnh có được dùng hay không, vì <code>@keyframes</code> KHÔNG bị rung-cây theo phép dò lớp:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">keyframes ĐI THEO bất kể</span><span class="lz-lnote">chín khối <code>@keyframes</code> không dùng trong MỌI gói CSS. Nhỏ về tuyệt đối, nhưng là TRỌNG LƯỢNG CHẾT mà không bước dựng nào gỡ hộ bạn</span></div>
<div class="lz-layer"><span class="lz-lname">chúng còn GÂY HIỂU NHẦM</span><span class="lz-lnote">một lập trình viên tìm thấy <code>animate-fade-in</code> trong config sẽ HỢP LÝ cho rằng đó là quy ước nhà cho hoạt ảnh vào. Nhận nó là HỒI SINH một mục đã chết chín tháng chứ không phải theo cái kho mã THẬT SỰ làm</span></div>
<div class="lz-layer"><span class="lz-lname">xoá, nhưng kiểm CSS TRƯỚC</span><span class="lz-lnote">cuộc soát bên trên grep <code>.tsx</code> và <code>.css</code>. Một hoạt ảnh CÒN có thể được tham chiếu từ một thuộc tính <code>style</code> hay một cú <code>animation:</code> rút gọn theo TÊN KEYFRAME — hãy tìm tên keyframe trần (<code>auroraDrift1</code>) trước khi gỡ bất cứ thứ gì</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm một cái chốt THỪA vì cuộc soát bảo là nó thiếu.</strong> Nếu tôi hành động theo phép đo đầu tiên ấy, sáu cái thẻ đã được thêm <code>motion-reduce:animate-none</code> CHỒNG lên một quy tắc CSS vốn đã làm việc đó. Vô hại về hiệu quả, nhưng nó GIEO một tín hiệu SAI: người đọc kế tiếp thấy biến thể ấy ở vài chỗ dùng mà không ở chỗ khác rồi kết luận những chỗ trần là BỌ. Một cuộc soát SAI không im lặng ở nguyên đó; nó LAN vào mã dưới dạng NHIỄU.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mười ba hoạt ảnh được khai và bốn được dùng, cùng sự tích tụ mà bài 5.2 tìm ra ở phần màu — và phát hiện HỮU ÍCH HƠN là cuộc soát tiếp cận của tôi báo ra sáu hoạt ảnh không chốt mà thực ra ĐÃ được chốt bằng một media query CSS, vì một phép kiểm chỉ nhìn MỘT trong HAI cơ chế khả dĩ thì CHẾ TẠO ra những khuyết tật không tồn tại.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — prefers-reduced-motion</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — ai bật nó và vì sao. Thiết lập ấy tồn tại cho các rối loạn tiền đình, không phải sở thích thẩm mỹ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">WCAG 2.3.3 — Animation from Interactions</span><span class="lc-sub">w3.org/WAI/WCAG21/Understanding/animation-from-interactions — tiêu chí biến hỗ trợ giảm-chuyển-động thành một YÊU CẦU chứ không phải một sự lịch thiệp, với chuyển động không thiết yếu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">web.dev — Animations and performance</span><span class="lc-sub">web.dev/animations-guide — vì sao <code>transform</code> và <code>opacity</code> RẺ còn mọi thứ khác ÉP tính bố cục, chính là luật mà keyframes aurora của kho này CỐ Ý tuân theo.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 9 — cuộc soát tiếp cận làm cho TỬ TẾ</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — chạy kiểm tương phản và chuyển động trên toàn kho mã, với luật liệt-kê-các-cơ-chế mà bài này học được bằng cách trả giá.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Plugins, and the cost of the one this repo refused|||5.5 — Plugin, và cái giá của cái mà kho này TỪ CHỐI',
      slug: 'tw-5-5-plugin',
      type: 'VIDEO',
      description: '`plugins: []` — và lý do được ghi ngay trong globals.css: `@tailwindcss/typography` sẽ ÉP các màu `.prose` mà theme tối không muốn. Cái giá của việc từ chối: khoảng 300 dòng CSS viết tay. Một cuộc đánh đổi có tài liệu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Plugins, and the cost of the one this repo refused</h2>
<p class="lead">A plugin can add utilities, components, variants or base styles programmatically. Most projects install two or three without much thought. This one installed none, and wrote down why — which makes it a better case study than a project that took the defaults.</p>

<h3>What a plugin can do</h3>
<pre><code class="language-js">const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function ({ addUtilities, addComponents, addVariant, theme }) {
      // 1. new utilities, driven by your own scale
      addUtilities({
        '.text-balance': { 'text-wrap': 'balance' },
      });

      // 2. a new variant
      addVariant('hocus', ['&amp;:hover', '&amp;:focus-visible']);

      // 3. utilities generated FROM the theme
      addUtilities(
        Object.entries(theme('spacing')).map(([k, v]) =&gt; ({
          [&#96;.scroll-mt-\${k}&#96;]: { 'scroll-margin-top': v },
        })),
      );
    }),
  ],
};
</code></pre>

<p>The third form is the one that justifies the machinery: a plugin can read your resolved theme and generate a full family of utilities from it, so adding a spacing key automatically produces the new utility too. Hand-writing that in CSS means maintaining a parallel list.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">worth a plugin</span><span class="lz-nsub">generated from the scale, or a new variant</span></span>
<span class="lz-nbody">Anything that must stay in sync with your theme, and any variant you want available everywhere. Both are things plain CSS cannot express without duplication.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">not worth a plugin</span><span class="lz-nsub">a handful of fixed rules</span></span>
<span class="lz-nbody">Three static utilities are three lines in <code>@layer utilities</code>. Wrapping them in a plugin adds a build-time dependency and an indirection for no gain — the plugin API earns its place only when generation or variants are involved.</span>
</div>
</div>

<h3>The refusal, and its recorded reason</h3>
<pre><code class="language-bash">$ grep -n 'plugins' tailwind.config.ts
</code></pre>

<div class="out">229:  plugins: [],
</div>

<p>Empty. And the reason is not lost — it is written in <code>globals.css</code> next to the code that exists because of it:</p>

<div class="out">/* Rich content (Lesson Content / Teaching Notes)
 * Used on the /learn page. Renders sanitized HTML produced by
 * the TipTap editor in the admin. …
 * We do NOT depend on &#96;@tailwindcss/typography&#96; because that
 * would force &#96;.prose&#96; colors we don't want in our dark theme. */
</div>

<p><code>@tailwindcss/typography</code> is the most-installed Tailwind plugin. It styles arbitrary HTML — exactly the problem this repo has, rendering editor output on the <code>/learn</code> page. It would have been the obvious choice. It ships opinionated colour decisions alongside its typography, and in a project with a custom dark theme those colours have to be overridden everywhere.</p>

<div class="callout ok">
<p><strong>What makes this a good decision rather than just a decision.</strong> The alternative cost is visible and bounded: roughly 300 hand-written lines of <code>.rich-content</code> rules. The team compared "300 lines we control" against "a dependency plus an ongoing fight with its colour defaults" and chose the first. Either answer is defensible; what makes this one good engineering is that the comparison is recorded next to the consequence, so the next person can re-evaluate it instead of re-deriving it.</p>
</div>

<h3>The general shape of the plugin trade</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a plugin brings decisions, not just code</span><span class="lz-lnote">typography brings colours and spacing; forms brings input resets. Those decisions are the value when they match yours and the cost when they do not — and you cannot take one half</span></div>
<div class="lz-layer"><span class="lz-lname">overriding a plugin is unbounded work</span><span class="lz-lnote">300 lines written once is a known quantity. "Override <code>.prose</code> colours as we find them" has no end date, and each override is a place the plugin's next version can surprise you</span></div>
<div class="lz-layer"><span class="lz-lname">plugins version with Tailwind</span><span class="lz-lnote">a major Tailwind upgrade means every plugin must have a compatible release. Three plugins is three things that can block an upgrade — a real cost that shows up months later, not at install time</span></div>
<div class="lz-layer"><span class="lz-lname">but do not hand-write a variant</span><span class="lz-lnote">the one case where a plugin clearly wins: <code>addVariant</code> makes a variant available on every utility. Reproducing that by hand is not 300 lines, it is impossible</span></div>
</div>

<h3>The plugins worth knowing about</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>@tailwindcss/typography</code></span><span class="lz-lnote">styles HTML you did not author. Genuinely useful, and brings colour opinions — the exact trade this repo declined. Check its output against your theme before adopting</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@tailwindcss/forms</code></span><span class="lz-lnote">normalises form controls across browsers. Lower-opinion than typography and correspondingly easier to accept; the <code>class</code> strategy limits it to elements you opt in</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@tailwindcss/container-queries</code></span><span class="lz-lnote">adds <code>@container</code> variants, so a component responds to its own width rather than the viewport. This is the <code>addVariant</code> case — not reproducible by hand</span></div>
<div class="lz-layer"><span class="lz-lname">your own inline plugin</span><span class="lz-lnote">for one project-specific variant, a <code>plugin()</code> call directly in the config file is fine. No package, no version to track, and the code sits next to the theme it depends on</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — installing typography and then fighting <code>.prose</code> with <code>!important</code>.</strong> The predictable path: install it, discover the colours are wrong in dark mode, override a few, discover the overrides lose to <code>.prose</code>'s specificity, reach for <code>!important</code>, and end up with a stylesheet that is more override than content. That is strictly worse than the 300 lines it was meant to save — and it is the outcome this repo's recorded comment exists to prevent.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A plugin is worth it when it generates utilities from your theme or adds a variant — things plain CSS cannot do without duplication — and not worth it for a handful of fixed rules, which is why <code>plugins: []</code> here is a documented trade of one dependency and its colour opinions against roughly 300 lines of CSS the team fully controls.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Writing plugins</span><span class="lc-sub">tailwindcss.com/docs/plugins — <code>addUtilities</code>, <code>addComponents</code>, <code>addVariant</code>, and reading the resolved theme from inside a plugin.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@tailwindcss/typography — README</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss-typography — including the customisation section, which is worth reading specifically to gauge how much overriding a dark theme would require.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@tailwindcss/forms — the class strategy</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss-forms — the opt-in mode, which is the pattern to prefer whenever a plugin restyles elements globally.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 7 — where the 300 hand-written lines live</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — <code>@layer</code> placement for custom CSS, and the measurement showing most of this repo's CSS sits outside any layer.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Plugin, và cái giá của cái mà kho này TỪ CHỐI</h2>
<p class="lead">Một plugin có thể thêm tiện ích, component, biến thể hay kiểu nền bằng LẬP TRÌNH. Phần lớn dự án cài hai ba cái mà không nghĩ nhiều. Cái này cài KHÔNG cái nào, và GHI LẠI VÌ SAO — điều khiến nó là một ca nghiên cứu TỐT HƠN một dự án chỉ nhận mặc định.</p>

<h3>Một plugin làm được gì</h3>
<pre><code class="language-js">const plugin = require('tailwindcss/plugin');

module.exports = {
  plugins: [
    plugin(function ({ addUtilities, addComponents, addVariant, theme }) {
      // 1. tien ich moi
      addUtilities({
        '.text-balance': { 'text-wrap': 'balance' },
      });

      // 2. mot bien the moi
      addVariant('hocus', ['&amp;:hover', '&amp;:focus-visible']);

      // 3. tien ich sinh TU chinh cai theme
      addUtilities(
        Object.entries(theme('spacing')).map(([k, v]) =&gt; ({
          [&#96;.scroll-mt-\${k}&#96;]: { 'scroll-margin-top': v },
        })),
      );
    }),
  ],
};
</code></pre>

<p>Dạng thứ BA là cái biện minh cho cả bộ máy: một plugin ĐỌC được theme đã phân giải của bạn và SINH ra một họ tiện ích đầy đủ từ nó, nên thêm một khoá spacing thì tự động đẻ ra cả tiện ích mới. Viết tay cái đó bằng CSS nghĩa là bảo trì một DANH SÁCH SONG SONG.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ĐÁNG một plugin</span><span class="lz-nsub">sinh ra TỪ thang, hoặc một biến thể mới</span></span>
<span class="lz-nbody">Bất cứ thứ gì phải GIỮ ĐỒNG BỘ với theme của bạn, và bất kỳ biến thể nào bạn muốn có ở KHẮP NƠI. Cả hai là những thứ CSS thuần không diễn đạt được mà không trùng lặp.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">KHÔNG đáng một plugin</span><span class="lz-nsub">một nhúm quy tắc CỐ ĐỊNH</span></span>
<span class="lz-nbody">Ba tiện ích tĩnh là ba dòng trong <code>@layer utilities</code>. Bọc chúng vào một plugin thì thêm một phụ thuộc lúc dựng và một lớp gián tiếp mà KHÔNG được gì — API plugin xứng đáng chỗ đứng CHỈ khi có chuyện SINH RA hoặc BIẾN THỂ.</span>
</div>
</div>

<h3>Cú từ chối, và lý do được GHI LẠI</h3>
<pre><code class="language-bash">$ grep -n 'plugins' tailwind.config.ts
</code></pre>

<div class="out">229:  plugins: [],
</div>

<p>RỖNG. Và lý do KHÔNG bị mất — nó được viết trong <code>globals.css</code> ngay cạnh đoạn mã tồn tại VÌ nó:</p>

<div class="out">/* Rich content (Lesson Content / Teaching Notes)
 * Dung o trang /learn. Dung HTML da lam sach sinh boi
 * trinh soan TipTap trong admin. …
 * Chung ta KHONG phu thuoc &#96;@tailwindcss/typography&#96; vi no
 * se EP cac mau &#96;.prose&#96; ma theme toi cua ta KHONG muon. */
</div>

<p><code>@tailwindcss/typography</code> là plugin Tailwind được cài NHIỀU NHẤT. Nó tạo kiểu cho HTML tuỳ ý — CHÍNH XÁC bài toán kho này có, dựng đầu ra của trình soạn trên trang <code>/learn</code>. Nó lẽ ra đã là lựa chọn HIỂN NHIÊN. Nó GIAO KÈM những quyết định MÀU có định kiến bên cạnh phần kiểu chữ, và trong một dự án có theme tối tuỳ biến thì những màu ấy phải bị đè ở KHẮP NƠI.</p>

<div class="callout ok">
<p><strong>Điều biến đây thành một QUYẾT ĐỊNH TỐT chứ không chỉ là một quyết định.</strong> Cái giá thay thế NHÌN THẤY ĐƯỢC và CÓ CHẶN TRÊN: khoảng 300 dòng quy tắc <code>.rich-content</code> viết tay. Đội ngũ đã SO SÁNH "300 dòng ta kiểm soát" với "một phụ thuộc cộng một cuộc đánh nhau LIÊN MIÊN với các màu mặc định của nó" và chọn cái đầu. Cả hai câu trả lời đều biện hộ được; thứ khiến cái này là kỹ thuật TỐT là phép SO SÁNH được GHI LẠI ngay cạnh HỆ QUẢ, để người sau ĐÁNH GIÁ LẠI được thay vì phải SUY LẠI từ đầu.</p>
</div>

<h3>Hình dạng chung của cuộc đánh đổi plugin</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một plugin mang theo QUYẾT ĐỊNH, không chỉ mã</span><span class="lz-lnote">typography mang màu và khoảng cách; forms mang reset cho ô nhập. Những quyết định ấy là GIÁ TRỊ khi chúng khớp với bạn và là CÁI GIÁ khi không — và bạn KHÔNG lấy được một nửa</span></div>
<div class="lz-layer"><span class="lz-lname">đè một plugin là công việc KHÔNG CHẶN TRÊN</span><span class="lz-lnote">300 dòng viết một lần là một lượng ĐÃ BIẾT. "Đè các màu <code>.prose</code> khi nào gặp" thì KHÔNG có ngày kết thúc, và mỗi cú đè là một chỗ mà phiên bản kế của plugin có thể làm bạn bất ngờ</span></div>
<div class="lz-layer"><span class="lz-lname">plugin đi theo PHIÊN BẢN Tailwind</span><span class="lz-lnote">một cú nâng cấp Tailwind lớn nghĩa là MỌI plugin phải có bản tương thích. Ba plugin là ba thứ có thể CHẶN một cuộc nâng cấp — một cái giá THẬT hiện ra sau nhiều tháng, không phải lúc cài</span></div>
<div class="lz-layer"><span class="lz-lname">nhưng ĐỪNG viết tay một BIẾN THỂ</span><span class="lz-lnote">ca duy nhất mà plugin thắng rõ ràng: <code>addVariant</code> làm một biến thể có mặt trên MỌI tiện ích. Tái tạo cái đó bằng tay không phải 300 dòng, mà là BẤT KHẢ</span></div>
</div>

<h3>Những plugin đáng biết</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>@tailwindcss/typography</code></span><span class="lz-lnote">tạo kiểu cho HTML bạn không viết ra. THẬT SỰ hữu ích, và mang theo định kiến về màu — đúng cuộc đánh đổi kho này từ chối. Hãy kiểm đầu ra của nó đối chiếu theme của bạn TRƯỚC khi nhận</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@tailwindcss/forms</code></span><span class="lz-lnote">chuẩn hoá các điều khiển biểu mẫu qua các trình duyệt. ÍT định kiến hơn typography và tương ứng dễ chấp nhận hơn; chiến lược <code>class</code> giới hạn nó vào các thẻ bạn CHỌN THAM GIA</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@tailwindcss/container-queries</code></span><span class="lz-lnote">thêm các biến thể <code>@container</code>, để một component phản ứng theo BỀ RỘNG CỦA CHÍNH NÓ chứ không theo khung nhìn. Đây là ca <code>addVariant</code> — KHÔNG tái tạo bằng tay được</span></div>
<div class="lz-layer"><span class="lz-lname">plugin nội tuyến của CHÍNH BẠN</span><span class="lz-lnote">cho một biến thể riêng của dự án, một lời gọi <code>plugin()</code> đặt THẲNG trong file config là ổn. Không gói, không phiên bản phải theo dõi, và mã nằm ngay cạnh cái theme mà nó phụ thuộc</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cài typography rồi ĐÁNH NHAU với <code>.prose</code> bằng <code>!important</code>.</strong> Con đường ĐOÁN TRƯỚC ĐƯỢC: cài nó, phát hiện màu sai ở chế độ tối, đè vài cái, phát hiện các cú đè THUA độ đặc hiệu của <code>.prose</code>, với tay tới <code>!important</code>, và kết thúc với một bảng kiểu mà phần ĐÈ nhiều hơn phần NỘI DUNG. Cái đó TỆ HƠN HẲN 300 dòng mà nó định tiết kiệm — và là kết cục mà cái comment được ghi lại của kho này tồn tại để NGĂN CHẶN.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một plugin ĐÁNG khi nó SINH tiện ích từ theme của bạn hoặc THÊM một biến thể — những thứ CSS thuần không làm được mà không trùng lặp — và KHÔNG đáng cho một nhúm quy tắc cố định, đó là lý do <code>plugins: []</code> ở đây là một cuộc đánh đổi CÓ TÀI LIỆU giữa một phụ thuộc cùng các định kiến màu của nó và khoảng 300 dòng CSS mà đội ngũ kiểm soát HOÀN TOÀN.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — Writing plugins</span><span class="lc-sub">tailwindcss.com/docs/plugins — <code>addUtilities</code>, <code>addComponents</code>, <code>addVariant</code>, và cách đọc theme đã phân giải từ bên trong một plugin.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@tailwindcss/typography — README</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss-typography — gồm cả mục tuỳ biến, đáng đọc CỤ THỂ để ước lượng một theme tối sẽ phải đè bao nhiêu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">@tailwindcss/forms — chiến lược class</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss-forms — chế độ chọn-tham-gia, khuôn mẫu nên ưu tiên mỗi khi một plugin tạo kiểu lại các thẻ trên TOÀN CỤC.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 7 — 300 dòng viết tay ấy SỐNG ở đâu</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — đặt <code>@layer</code> cho CSS tuỳ biến, và phép đo cho thấy phần lớn CSS của kho này nằm NGOÀI mọi layer.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra Chương 5',
      slug: 'tw-5-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về cấu hình: extend đối lập thay thế, bốn màu dùng 0 lần và con bọ chúng giải thích, đặt tên theo vai trò, và một cuộc soát báo động giả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>What Chapter 5 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter is mostly about auditing what you already wrote, so several answers are counts rather than concepts.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">5.1 — extend vs replace</span><span class="lz-lnote">measured: <code>theme.x</code> silently deletes <code>p-4</code> and <code>text-red-500</code>. The merge is one level deep, so a colour family you supply overwrites the whole default family</span></div>
<div class="lz-layer"><span class="lz-lname">5.2 — the dead config</span><span class="lz-lnote">four light-theme colours at 0 uses against four dark ones at 2,677 — and that zero is the recorded cause of a screen that stayed black in light mode</span></div>
<div class="lz-layer"><span class="lz-lname">5.3 — naming</span><span class="lz-lnote">the test: would a design change make this name a lie? <code>darkbg</code> encodes a theme; <code>text-primary/secondary/muted</code> encodes roles and is used 4,304 times across both themes</span></div>
<div class="lz-layer"><span class="lz-lname">5.4 — the false alarm</span><span class="lz-lnote">13 animations declared, 4 used. My guard audit reported 6 unguarded — wrong, because it checked only the variant and not the CSS media query at line 2509</span></div>
<div class="lz-layer"><span class="lz-lname">5.5 — plugins</span><span class="lz-lnote"><code>plugins: []</code> with the reason recorded: typography would force <code>.prose</code> colours the dark theme does not want. Cost of refusing: ~300 controlled lines</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Chương 5 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này phần lớn nói về SOÁT cái bạn đã viết, nên vài đáp án là CON SỐ chứ không phải khái niệm.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">5.1 — extend đối lập thay thế</span><span class="lz-lnote">đo được: <code>theme.x</code> âm thầm XOÁ <code>p-4</code> và <code>text-red-500</code>. Phép trộn SÂU MỘT TẦNG, nên một họ màu bạn cung cấp GHI ĐÈ trọn họ mặc định</span></div>
<div class="lz-layer"><span class="lz-lname">5.2 — config CHẾT</span><span class="lz-lnote">bốn màu theme sáng dùng 0 lần đối chiếu bốn màu tối dùng 2.677 — và số không ấy là nguyên nhân ĐƯỢC GHI LẠI của một màn hình đen kịt trong theme sáng</span></div>
<div class="lz-layer"><span class="lz-lname">5.3 — đặt tên</span><span class="lz-lnote">phép kiểm: một thay đổi thiết kế có làm cái tên này thành LỜI NÓI DỐI không? <code>darkbg</code> mã hoá một theme; <code>text-primary/secondary/muted</code> mã hoá VAI TRÒ và được dùng 4.304 lần ở cả hai theme</span></div>
<div class="lz-layer"><span class="lz-lname">5.4 — báo động giả</span><span class="lz-lnote">13 hoạt ảnh khai, 4 dùng. Cuộc soát chốt của tôi báo 6 cái không chốt — SAI, vì nó chỉ kiểm biến thể mà không kiểm media query CSS ở dòng 2509</span></div>
<div class="lz-layer"><span class="lz-lname">5.5 — plugin</span><span class="lz-lnote"><code>plugins: []</code> với lý do được ghi lại: typography sẽ ép các màu <code>.prose</code> mà theme tối không muốn. Giá của việc từ chối: ~300 dòng ta kiểm soát</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You write <code>theme: { spacing: { brand: "7px" } }</code> without <code>extend</code>. What happens?|||Bạn viết <code>theme: { spacing: { brand: "7px" } }</code> mà KHÔNG có <code>extend</code>. Chuyện gì xảy ra?',
            options: [
              'The spacing scale becomes exactly that one key — <code>p-4</code>, <code>gap-2</code> and every other spacing utility stop existing, with no error or warning|||Thang spacing trở thành ĐÚNG một khoá đó — <code>p-4</code>, <code>gap-2</code> và mọi tiện ích khoảng cách khác THÔI TỒN TẠI, không lỗi không cảnh báo',
              '<code>brand</code> is merged into the default scale, same as extend|||<code>brand</code> được trộn vào thang mặc định, y như extend',
              'The build fails with a config validation error|||Bản dựng hỏng với một lỗi xác thực config',
              'Only utilities used in your source are affected|||Chỉ các tiện ích dùng trong mã nguồn của bạn bị ảnh hưởng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Inside <code>extend</code>, you add <code>colors: { gray: { 500: "#888" } }</code>. What happens to Tailwind\'s other gray shades?|||Bên trong <code>extend</code>, bạn thêm <code>colors: { gray: { 500: "#888" } }</code>. Các sắc xám khác của Tailwind ra sao?',
            options: [
              'They are GONE — the merge is only one level deep, so a family you supply replaces the entire default family of that name, even inside extend|||Chúng BIẾN MẤT — phép trộn chỉ SÂU MỘT TẦNG, nên một họ bạn cung cấp THAY THẾ trọn họ mặc định cùng tên, KỂ CẢ bên trong extend',
              'They are preserved; only gray-500 is overridden|||Chúng được giữ nguyên; chỉ gray-500 bị đè',
              'The build fails because gray already exists|||Bản dựng hỏng vì gray đã tồn tại',
              'Tailwind renames the default family to gray-default|||Tailwind đổi tên họ mặc định thành gray-default',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The config defines lightbg/lightcard/lightsurface/lightborder, all used 0 times, while the dark equivalents total 2,677. What does that explain?|||Config khai lightbg/lightcard/lightsurface/lightborder, tất cả dùng 0 lần, trong khi các cái tối tương đương tổng 2.677. Điều đó GIẢI THÍCH cái gì?',
            options: [
              'Why the settings screen stayed pitch black in light mode — components styled themselves with theme-named colours that do not change, and nothing ever reached for the light half|||Vì sao màn Cài đặt đen kịt trong theme sáng — các component tự tạo kiểu bằng những màu đặt-tên-theo-theme vốn KHÔNG đổi, và không gì từng với tới nửa sáng',
              'That the light theme was removed from the product|||Rằng theme sáng đã bị gỡ khỏi sản phẩm',
              'That the config needs tree-shaking enabled|||Rằng config cần bật tính năng rung cây',
              'Nothing — unused config entries are harmless|||Không gì cả — các mục config không dùng thì vô hại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does the paired-palette design (darkbg + lightbg) fail specifically in THIS repository?|||Vì sao thiết kế bảng-màu-cặp (darkbg + lightbg) thất bại CỤ THỂ trong kho này?',
            options: [
              'Choosing between a pair requires a <code>dark:</code> variant at every call site, and CLAUDE.md reserves <code>dark:</code> for the Notes wrapper — so there is no sanctioned mechanism to switch|||Chọn giữa một cặp đòi một biến thể <code>dark:</code> ở MỌI chỗ gọi, và CLAUDE.md DÀNH RIÊNG <code>dark:</code> cho vỏ bọc Notes — nên KHÔNG có cơ chế nào được phép để chuyển',
              'Tailwind does not support two colours with similar names|||Tailwind không hỗ trợ hai màu có tên giống nhau',
              'The light colours were defined after the dark ones|||Các màu sáng được định nghĩa sau các màu tối',
              'Flat colour values cannot be themed at all|||Giá trị màu phẳng hoàn toàn không đổi theme được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What single question tests whether a colour name belongs to the semantic layer?|||MỘT câu hỏi nào kiểm được một tên màu có thuộc tầng ngữ nghĩa không?',
            options: [
              '"If the design changed, would this name become a lie?" — <code>bg-blue-600</code> breaks on rebrand and <code>bg-darkcard</code> breaks on adding a theme; <code>bg-card</code> survives both|||"Nếu thiết kế thay đổi, cái tên này có thành LỜI NÓI DỐI không?" — <code>bg-blue-600</code> vỡ khi đổi thương hiệu và <code>bg-darkcard</code> vỡ khi thêm theme; <code>bg-card</code> sống sót cả hai',
              '"Is the name shorter than twelve characters?"|||"Cái tên có ngắn hơn mười hai ký tự không?"',
              '"Does it appear in the default Tailwind palette?"|||"Nó có xuất hiện trong bảng màu mặc định của Tailwind không?"',
              '"Is it used more than 100 times?"|||"Nó có được dùng hơn 100 lần không?"',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When renaming <code>darkbg</code> to <code>bg-surface</code> across 641 call sites, which step do people skip — and why does it matter?|||Khi đổi tên <code>darkbg</code> thành <code>bg-surface</code> qua 641 chỗ gọi, người ta bỏ qua bước nào — và vì sao nó quan trọng?',
            options: [
              'Pointing the new variable at the OLD value first, so the two names are synonyms — without it, every visual difference during migration is ambiguous between a rename bug and an intended colour change|||TRỎ biến mới vào giá trị CŨ trước, để hai cái tên thành ĐỒNG NGHĨA — không có bước ấy, mọi khác biệt thị giác lúc di trú đều MƠ HỒ giữa một con bọ đổi tên và một cú đổi màu có chủ ý',
              'Deleting the old name immediately to prevent drift|||Xoá cái tên cũ NGAY để chặn trôi dạt',
              'Running the migration in a single commit|||Chạy cuộc di trú trong MỘT commit',
              'Updating the design mockups first|||Cập nhật các bản mẫu thiết kế trước',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'An audit reported six animations with no reduced-motion guard. The claim was false. What was the methodological error?|||Một cuộc soát báo sáu hoạt ảnh không có chốt giảm-chuyển-động. Lời khẳng định ấy SAI. Sai lầm về PHƯƠNG PHÁP là gì?',
            options: [
              'It checked only ONE of two possible mechanisms — the <code>motion-reduce:</code> variant — and missed the CSS media query guarding the same classes by name. Enumerate the mechanisms before reporting an absence|||Nó chỉ kiểm MỘT trong HAI cơ chế khả dĩ — biến thể <code>motion-reduce:</code> — và bỏ sót media query CSS chốt chính các lớp ấy theo tên. Hãy LIỆT KÊ các cơ chế trước khi báo cáo một sự VẮNG MẶT',
              'It searched .tsx files but the animations are in .jsx|||Nó tìm trong file .tsx nhưng hoạt ảnh nằm trong .jsx',
              'The animations were unused, so the question did not apply|||Các hoạt ảnh không được dùng, nên câu hỏi không áp dụng',
              'It used grep instead of an AST parser|||Nó dùng grep thay vì một bộ phân tích AST',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'When is a Tailwind plugin clearly worth the dependency?|||Khi nào một plugin Tailwind RÕ RÀNG đáng cái phụ thuộc?',
            options: [
              'When it generates utilities FROM your resolved theme (so they stay in sync automatically) or adds a variant via addVariant — neither is reproducible in plain CSS without duplication|||Khi nó SINH tiện ích TỪ theme đã phân giải của bạn (để chúng tự đồng bộ) hoặc THÊM một biến thể qua addVariant — cả hai đều không tái tạo được bằng CSS thuần mà không trùng lặp',
              'Whenever it saves more than ten lines of CSS|||Bất cứ khi nào nó tiết kiệm hơn mười dòng CSS',
              'Always — official plugins are maintained alongside Tailwind|||Luôn luôn — plugin chính thức được bảo trì song song với Tailwind',
              'Only for typography and forms, which are effectively standard|||Chỉ với typography và forms, vốn coi như tiêu chuẩn',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
