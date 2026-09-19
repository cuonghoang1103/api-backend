/**
 * Web Foundations — Chương 12: CSS nâng cao (position & stacking context,
 * transition/animation, kiến trúc CSS, biến & theme). Song ngữ EN/VI.
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape thành \${.
 */

import { gallery } from './_slides.mjs';

export default {
  title: 'Chapter 12 — Advanced CSS|||Chương 12 — CSS nâng cao',
  description: 'Chương 3 cho bạn dàn được trang. Chương này cho bạn kiểm soát nó: phần tử chồng lên nhau theo luật nào, chuyển động mượt mà không giật, đặt tên class để sáu tháng sau còn sửa được, và làm chế độ sáng/tối tử tế.',
  lessons: [
    /* ─────────────────── 12.0 slide bài giảng ─────────────────── */
    {
      title: '12.0 — Advanced CSS in 12 slides|||12.0 — CSS nâng cao trong 12 slide',
      slug: 'wf-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Position, ngữ cảnh xếp chồng, transition/animation, BEM và token — 12 slide.',
      content: `
<div class="ml-en"><h2>📑 Advanced CSS in 12 slides</h2>
<p>Slide 4 explains why z-index: 9999 can still lose. It is the single most confusing CSS behaviour there is.</p>
<p>Skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 CSS nâng cao trong 12 slide</h2>
<p>Slide 4 giải thích vì sao z-index: 9999 vẫn có thể thua. Đó là hành vi khó hiểu nhất của cả CSS.</p>
<p>Lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${gallery('wf-css2', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Năm giá trị của position"],
  [4, "Vì sao z-index: 9999 vẫn thua"],
  [5, "Thang z-index có tên"],
  [6, "Transition"],
  [7, "Chỉ HAI thuộc tính rẻ để làm động ⭐"],
  [8, "BEM — Block, Element, Modifier"],
  [9, "Ba cách cô lập CSS"],
  [10, "Token thiết kế — hai tầng"],
  [11, "Chế độ tối làm cho tử tế"],
  [12, "Tự luyện"],
])}
`,
    },

    {
      title: '12.1 — Position and the stacking context|||12.1 — Position và ngữ cảnh xếp chồng',
      slug: 'wf-12-1-position-stacking',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Năm giá trị của position, vì sao z-index đôi khi vô tác dụng, và cách dựng modal/dropdown không bị cắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Five values of <code>position</code>, and the one that surprises everyone</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">static</span><span class="v">The default. Sits in normal flow. <code>top/left</code> do nothing.</span></div>
  <div class="kv"><span class="k">relative</span><span class="v">Stays in flow, but can be nudged — and becomes a reference point for absolute children.</span></div>
  <div class="kv"><span class="k">absolute</span><span class="v">Leaves the flow. Positioned against the nearest ancestor that is NOT static.</span></div>
  <div class="kv"><span class="k">fixed</span><span class="v">Leaves the flow. Positioned against the viewport — stays put while scrolling.</span></div>
  <div class="kv"><span class="k">sticky</span><span class="v">Normal until it hits a threshold, then sticks. Needs a <code>top</code> value to work.</span></div>
</div>

<pre><code>.parent { position: relative; }        /* ← the reference point */
.badge  { position: absolute; top: 8px; right: 8px; }
/* Without position:relative on .parent, .badge jumps to the page corner */</code></pre>
<p class="note-ct"><strong>The single most common position bug:</strong> an absolutely positioned element flying to the top-left of the whole page. It means no ancestor is positioned, so it fell back to the document. Add <code>position: relative</code> to the box you meant to anchor it to.</p>

<h3>Why z-index sometimes does nothing</h3>
<pre><code>/* This looks like it should work — and does not */
.modal   { z-index: 9999; }
.overlay { z-index: 1; }</code></pre>
<p><code>z-index</code> only compares elements <strong>inside the same stacking context</strong>. If <code>.modal</code> sits inside a parent that created its own context, its 9999 is only 9999 <em>within that parent</em> — the whole parent still stacks below <code>.overlay</code>.</p>

<h3>What creates a stacking context</h3>
<pre><code>position: relative/absolute + any z-index other than auto
position: fixed  or  position: sticky
opacity less than 1
transform, filter, perspective, will-change
isolation: isolate        /* ← creates one ON PURPOSE */</code></pre>
<div class="pitfall"><strong>The trap that costs an afternoon:</strong> adding <code>opacity: 0.99</code> or a <code>transform</code> for a hover effect silently creates a stacking context, and a dropdown that worked yesterday now renders behind its neighbour. When z-index "stops working", look at the <em>ancestors</em> for these properties — not at the element itself.</div>

<h3>Two rules that avoid the whole class of bugs</h3>
<pre><code>/* 1. Render overlays at the top level, not nested inside cards */
/*    React does this with createPortal — same idea. */

/* 2. Keep a small, documented z-index scale instead of ad-hoc numbers */
:root {
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    300;
  --z-toast:    400;
}</code></pre>
<p>A page where every z-index is <code>9999</code> is a page where nobody can reason about layering any more. Four named levels beat forty random numbers.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Năm giá trị của <code>position</code>, và cái làm ai cũng bất ngờ</h2>
<div class="kv-grid">
  <div class="kv"><span class="k">static</span><span class="v">Mặc định. Nằm trong dòng chảy bình thường. <code>top/left</code> không có tác dụng.</span></div>
  <div class="kv"><span class="k">relative</span><span class="v">Vẫn trong dòng chảy nhưng dịch được — và trở thành MỐC cho con absolute.</span></div>
  <div class="kv"><span class="k">absolute</span><span class="v">Rời dòng chảy. Định vị theo tổ tiên gần nhất KHÔNG phải static.</span></div>
  <div class="kv"><span class="k">fixed</span><span class="v">Rời dòng chảy. Định vị theo khung nhìn — cuộn trang vẫn đứng yên.</span></div>
  <div class="kv"><span class="k">sticky</span><span class="v">Bình thường cho tới khi chạm ngưỡng thì dính lại. PHẢI có <code>top</code> mới chạy.</span></div>
</div>

<pre><code>.cha  { position: relative; }        /* ← cái mốc */
.nhan { position: absolute; top: 8px; right: 8px; }
/* Không có position:relative ở .cha thì .nhan bay ra góc TRANG */</code></pre>
<p class="note-ct"><strong>Lỗi position hay gặp nhất:</strong> một phần tử absolute bay lên góc trên bên trái của cả trang. Nghĩa là không có tổ tiên nào được định vị, nên nó lấy mốc là cả tài liệu. Thêm <code>position: relative</code> vào đúng cái hộp bạn muốn neo vào.</p>

<h3>Vì sao z-index đôi khi vô tác dụng</h3>
<pre><code>/* Trông như phải chạy — mà không chạy */
.modal   { z-index: 9999; }
.lop-phu { z-index: 1; }</code></pre>
<p><code>z-index</code> chỉ so sánh các phần tử <strong>trong CÙNG một ngữ cảnh xếp chồng</strong>. Nếu <code>.modal</code> nằm trong một cha đã tạo ngữ cảnh riêng, thì 9999 của nó chỉ là 9999 <em>bên trong cái cha đó</em> — cả cụm cha vẫn nằm dưới <code>.lop-phu</code>.</p>

<h3>Thứ gì tạo ra ngữ cảnh xếp chồng</h3>
<pre><code>position: relative/absolute + z-index khác auto
position: fixed  hoặc  position: sticky
opacity nhỏ hơn 1
transform, filter, perspective, will-change
isolation: isolate        /* ← tạo một cái CÓ CHỦ ĐÍCH */</code></pre>
<div class="pitfall"><strong>Cái bẫy tốn cả buổi chiều:</strong> thêm <code>opacity: 0.99</code> hay một <code>transform</code> cho hiệu ứng hover là âm thầm tạo ra ngữ cảnh xếp chồng, và một dropdown hôm qua còn chạy thì nay hiện ra sau phần tử bên cạnh. Khi z-index "không ăn nữa", hãy soi <em>các tổ tiên</em> xem có mấy thuộc tính này không — đừng soi chính phần tử đó.</div>

<h3>Hai luật tránh được cả nhóm lỗi này</h3>
<pre><code>/* 1. Vẽ lớp phủ ở TẦNG TRÊN CÙNG, đừng lồng trong thẻ card */
/*    React làm việc này bằng createPortal — cùng một ý tưởng. */

/* 2. Giữ một thang z-index nhỏ, có tên, thay vì số tuỳ hứng */
:root {
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    300;
  --z-toast:    400;
}</code></pre>
<p>Một trang mà mọi z-index đều là <code>9999</code> là một trang không ai còn suy luận được về thứ tự lớp nữa. Bốn mức có tên hơn hẳn bốn mươi con số ngẫu nhiên.</p>
</div>
`,
    },

    {
      title: '12.2 — Transitions and animations|||12.2 — Chuyển cảnh và hoạt hình',
      slug: 'wf-12-2-transition-animation',
      type: 'DOCUMENT',
      description: 'transition, keyframes, và hai thuộc tính duy nhất nên dùng để chuyển động mượt 60fps.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Transition: animate a change you already make</h2>
<pre><code>.btn {
  background: #1b5fa8;
  transition: background 200ms ease, transform 200ms ease;
}
.btn:hover {
  background: #14487f;
  transform: translateY(-2px);
}
/* shorthand order: property  duration  timing-function  delay */</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">150–250ms</span><span class="v">The sweet spot for hover and small UI changes. Under 100ms feels instant; over 400ms feels sluggish.</span></div>
  <div class="kv"><span class="k">ease-out</span><span class="v">Best default for things entering: fast start, gentle stop.</span></div>
  <div class="kv"><span class="k">Never <code>transition: all</code></span><span class="v">It animates properties you did not intend, including layout ones — a common cause of mystery jank.</span></div>
</div>

<h3>Keyframes: animate on your own timeline</h3>
<pre><code>@keyframes spin  { to { transform: rotate(360deg); } }
@keyframes fadeIn{ from { opacity: 0; transform: translateY(8px); }
                   to   { opacity: 1; transform: none; } }

.spinner { animation: spin 1s linear infinite; }
.card    { animation: fadeIn 300ms ease-out both; }</code></pre>

<h3>Only two properties are cheap to animate</h3>
<pre><code>/* ✅ FAST — the compositor handles these, no layout recalculation */
transform   (translate, scale, rotate)
opacity

/* ❌ SLOW — these force the browser to re-measure the whole page each frame */
width  height  top  left  margin  padding  font-size</code></pre>
<p class="note-ct"><strong>Why this matters.</strong> Animating <code>left</code> makes the browser recompute layout 60 times a second. Animating <code>transform: translateX()</code> does not touch layout at all — the GPU moves an already-painted layer. Same visual result, wildly different cost. This one substitution is most of what "performance work" means for animation.</p>

<h3>Respect people who get motion sick</h3>
<pre><code>@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}</code></pre>
<p>This is four lines, it is an accessibility requirement in most guidelines, and vestibular disorders are far more common than developers assume.</p>

<div class="pitfall"><strong>Transitions do not run on <code>display: none</code>.</strong> An element that appears from nothing has no starting value to animate from. Use <code>opacity</code> plus <code>visibility</code>, or keep it in the DOM and animate <code>transform: scale(0)</code> instead.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Transition: làm mượt một thay đổi bạn vốn đã tạo ra</h2>
<pre><code>.nut {
  background: #1b5fa8;
  transition: background 200ms ease, transform 200ms ease;
}
.nut:hover {
  background: #14487f;
  transform: translateY(-2px);
}
/* thứ tự viết tắt: thuộc-tính  thời-lượng  kiểu-gia-tốc  độ-trễ */</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">150–250ms</span><span class="v">Khoảng đẹp nhất cho hover và thay đổi nhỏ. Dưới 100ms thấy như tức thì; trên 400ms thấy ì.</span></div>
  <div class="kv"><span class="k">ease-out</span><span class="v">Mặc định tốt cho thứ đang xuất hiện: vào nhanh, dừng êm.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ <code>transition: all</code></span><span class="v">Nó làm mượt cả những thuộc tính bạn không định, kể cả thuộc tính bố cục — nguyên nhân phổ biến của hiện tượng giật khó hiểu.</span></div>
</div>

<h3>Keyframes: tự định nghĩa dòng thời gian</h3>
<pre><code>@keyframes quay   { to { transform: rotate(360deg); } }
@keyframes hienRa { from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: none; } }

.spinner { animation: quay 1s linear infinite; }
.the     { animation: hienRa 300ms ease-out both; }</code></pre>

<h3>Chỉ có HAI thuộc tính là rẻ để chuyển động</h3>
<pre><code>/* ✅ NHANH — bộ hợp thành lo, không phải tính lại bố cục */
transform   (translate, scale, rotate)
opacity

/* ❌ CHẬM — buộc trình duyệt đo lại cả trang MỖI KHUNG HÌNH */
width  height  top  left  margin  padding  font-size</code></pre>
<p class="note-ct"><strong>Vì sao điều này quan trọng.</strong> Làm động <code>left</code> khiến trình duyệt tính lại bố cục 60 lần mỗi giây. Làm động <code>transform: translateX()</code> thì không đụng tới bố cục chút nào — GPU chỉ dịch một lớp đã vẽ sẵn. Kết quả nhìn giống hệt, chi phí khác một trời một vực. Riêng phép thay thế này đã là phần lớn cái gọi là "tối ưu hiệu năng" cho hoạt hình.</p>

<h3>Tôn trọng người bị say chuyển động</h3>
<pre><code>@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}</code></pre>
<p>Bốn dòng, là yêu cầu bắt buộc trong hầu hết hướng dẫn về khả năng tiếp cận, và rối loạn tiền đình phổ biến hơn nhiều so với hình dung của lập trình viên.</p>

<div class="pitfall"><strong>Transition KHÔNG chạy với <code>display: none</code>.</strong> Một phần tử xuất hiện từ hư không thì không có giá trị khởi đầu để làm mượt. Dùng <code>opacity</code> kèm <code>visibility</code>, hoặc giữ nó trong DOM và làm động <code>transform: scale(0)</code> thay thế.</div>
</div>
`,
    },

    {
      title: '12.3 — Naming and organising CSS|||12.3 — Đặt tên và tổ chức CSS',
      slug: 'wf-12-3-css-architecture',
      type: 'DOCUMENT',
      description: 'BEM, quy tắc độ ưu tiên thấp, và ba cách cô lập CSS mà các dự án thật đang dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>CSS is global — naming is the only thing that saves you</h2>
<p class="lead">Every selector you write competes with every other selector on the page, including the ones in the library you installed. A project with no naming convention becomes unmaintainable at around a thousand lines, and the symptom is always the same: people add <code>!important</code> until it works.</p>

<h3>BEM — Block, Element, Modifier</h3>
<pre><code>/* Block: a standalone thing */
.card { }

/* Element: a part of it — two underscores */
.card__title { }
.card__image { }

/* Modifier: a variant — two dashes */
.card--featured { }
.card__title--large { }</code></pre>
<pre><code>&lt;article class="card card--featured"&gt;
  &lt;img class="card__image" ... /&gt;
  &lt;h3 class="card__title card__title--large"&gt;Pizza&lt;/h3&gt;
&lt;/article&gt;</code></pre>
<p>The names are long and that is the point: <code>.card__title</code> can only mean one thing, and you can grep for it. Compare with <code>.title</code>, which will collide with something within a month.</p>

<h3>Keep specificity flat</h3>
<pre><code>/* ❌ deep and fragile — now everything must be at least this specific */
.page .content .card .card-body h3 { font-size: 20px; }

/* ✅ flat — one class, easy to override */
.card__title { font-size: 20px; }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Rule of thumb</span><span class="v">Aim for one class per rule. If you need three levels to win, the naming is wrong.</span></div>
  <div class="kv"><span class="k">!important</span><span class="v">A signal, not a solution. It means the cascade already got away from you.</span></div>
</div>

<h3>Three ways real projects isolate styles</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BEM by hand</span><span class="v">Works anywhere, no tooling. Discipline required.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v"><code>import s from './Card.module.css'</code> — the build tool renames classes so collisions are impossible. Standard in Create React App.</span></div>
  <div class="kv"><span class="k">Utility classes</span><span class="v">Tailwind, and Bootstrap's <code>d-flex p-3</code>. No naming at all; you compose in the markup.</span></div>
</div>

<div class="pitfall"><strong>A real example from this very site.</strong> A stylesheet had <code>.card { }</code> and <code>button { }</code> at global scope. Both names are also Bootstrap's, so every card lost its border and every button lost its colour — on pages that had nothing to do with that stylesheet. The fix was to scope every rule under one parent class. Generic global names are not a small problem; they are the problem.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>CSS là toàn cục — đặt tên là thứ duy nhất cứu bạn</h2>
<p class="lead">Mọi bộ chọn bạn viết đều cạnh tranh với mọi bộ chọn khác trên trang, kể cả của thư viện bạn vừa cài. Một dự án không có quy ước đặt tên sẽ hết sửa nổi vào khoảng một nghìn dòng, và triệu chứng luôn giống nhau: người ta rắc <code>!important</code> cho tới khi nó chịu chạy.</p>

<h3>BEM — Block, Element, Modifier</h3>
<pre><code>/* Block: một thứ đứng độc lập */
.card { }

/* Element: một bộ phận của nó — hai gạch dưới */
.card__title { }
.card__image { }

/* Modifier: một biến thể — hai gạch ngang */
.card--featured { }
.card__title--large { }</code></pre>
<pre><code>&lt;article class="card card--featured"&gt;
  &lt;img class="card__image" ... /&gt;
  &lt;h3 class="card__title card__title--large"&gt;Pizza&lt;/h3&gt;
&lt;/article&gt;</code></pre>
<p>Tên dài, và đó chính là chủ đích: <code>.card__title</code> chỉ có thể mang đúng một nghĩa, và bạn grep ra được nó. So với <code>.title</code> — cái sẽ đụng với thứ gì đó trong vòng một tháng.</p>

<h3>Giữ độ ưu tiên THẤP và phẳng</h3>
<pre><code>/* ❌ sâu và mong manh — giờ mọi thứ khác phải đặc tả ít nhất bằng ngần này */
.page .content .card .card-body h3 { font-size: 20px; }

/* ✅ phẳng — một class, dễ ghi đè */
.card__title { font-size: 20px; }</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nguyên tắc</span><span class="v">Nhắm một class cho mỗi quy tắc. Cần ba tầng mới thắng thì việc đặt tên đang sai.</span></div>
  <div class="kv"><span class="k">!important</span><span class="v">Là một tín hiệu, không phải giải pháp. Nó nghĩa là bạn đã mất kiểm soát sự xếp tầng.</span></div>
</div>

<h3>Ba cách các dự án thật cô lập CSS</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BEM viết tay</span><span class="v">Chạy ở đâu cũng được, không cần công cụ. Đổi lại phải kỷ luật.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v"><code>import s from './Card.module.css'</code> — công cụ dựng tự đổi tên class nên không thể đụng nhau. Có sẵn trong Create React App.</span></div>
  <div class="kv"><span class="k">Class tiện ích</span><span class="v">Tailwind, và <code>d-flex p-3</code> của Bootstrap. Không đặt tên gì cả; bạn ghép ngay trong HTML.</span></div>
</div>

<div class="pitfall"><strong>Một ví dụ có thật từ chính trang web này.</strong> Một file CSS có <code>.card { }</code> và <code>button { }</code> ở phạm vi toàn cục. Hai cái tên đó cũng là của Bootstrap, nên mọi card mất viền chuẩn và mọi nút mất màu — ở những trang chẳng liên quan gì tới file CSS đó. Cách chữa là khoanh mọi quy tắc vào trong một class cha. Tên chung chung ở phạm vi toàn cục không phải vấn đề nhỏ; nó chính là vấn đề.</div>
</div>
`,
    },

    {
      title: '12.4 — Design tokens and theming|||12.4 — Token thiết kế và chế độ sáng/tối',
      slug: 'wf-12-4-tokens-theming',
      type: 'DOCUMENT',
      description: 'Dùng biến CSS làm token, dựng chế độ tối tử tế, và vì sao đừng khai màu ở hai chỗ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Name your values once, use the names everywhere</h2>
<pre><code>:root {
  /* primitives — raw values, named by what they ARE */
  --blue-600: #1b5fa8;
  --gray-100: #f2f7fd;
  --space-3:  16px;

  /* semantic tokens — named by what they are FOR */
  --color-primary:    var(--blue-600);
  --color-surface:    #ffffff;
  --color-text:       #11243d;
  --radius-card:      12px;
}

.card { background: var(--color-surface); border-radius: var(--radius-card); }
.btn  { background: var(--color-primary); padding: var(--space-3); }</code></pre>
<p>The two layers matter. <code>--blue-600</code> says what the colour is; <code>--color-primary</code> says what it means. When the brand colour changes you edit one line, and when you add dark mode you only redefine the semantic layer.</p>

<h3>Dark mode, done properly</h3>
<pre><code>/* 1. follow the operating system by default */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface: #11151b;
    --color-text:    #e6edf3;
  }
}

/* 2. let the user override the OS */
:root[data-theme="dark"] {
  --color-surface: #11151b;
  --color-text:    #e6edf3;
}</code></pre>
<pre><code>// the toggle is one line of JavaScript
document.documentElement.dataset.theme = 'dark';</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Redefine tokens, not rules</span><span class="v">Dark mode should change ~10 variable values, not duplicate 400 rules.</span></div>
  <div class="kv"><span class="k">Give body a background</span><span class="v">Without an explicit <code>background</code> on <code>body</code>, dark text lands on the browser's white default.</span></div>
  <div class="kv"><span class="k">Check contrast</span><span class="v">Pure white on pure black is harsh. Use <code>#e6edf3</code> on <code>#11151b</code>, and aim for a 4.5:1 ratio on body text.</span></div>
</div>

<div class="pitfall"><strong>Do not declare a colour in two places.</strong> The moment a hex code appears both in a token and hard-coded in a rule, the two will drift — and the one you forget is always the one on the page you did not test. Search your stylesheet for <code>#</code>: outside the token block, there should be almost none.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Đặt tên cho giá trị một lần, rồi dùng cái tên ở mọi nơi</h2>
<pre><code>:root {
  /* nguyên thuỷ — giá trị thô, đặt tên theo nó LÀ GÌ */
  --blue-600: #1b5fa8;
  --gray-100: #f2f7fd;
  --space-3:  16px;

  /* token ngữ nghĩa — đặt tên theo nó DÙNG ĐỂ LÀM GÌ */
  --color-primary:    var(--blue-600);
  --color-surface:    #ffffff;
  --color-text:       #11243d;
  --radius-card:      12px;
}

.card { background: var(--color-surface); border-radius: var(--radius-card); }
.btn  { background: var(--color-primary); padding: var(--space-3); }</code></pre>
<p>Hai tầng này quan trọng. <code>--blue-600</code> nói màu đó LÀ gì; <code>--color-primary</code> nói nó CÓ NGHĨA gì. Đổi màu thương hiệu thì sửa một dòng, và khi thêm chế độ tối bạn chỉ khai lại tầng ngữ nghĩa.</p>

<h3>Chế độ tối, làm cho tử tế</h3>
<pre><code>/* 1. mặc định đi theo hệ điều hành */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface: #11151b;
    --color-text:    #e6edf3;
  }
}

/* 2. cho người dùng tự ghi đè hệ điều hành */
:root[data-theme="dark"] {
  --color-surface: #11151b;
  --color-text:    #e6edf3;
}</code></pre>
<pre><code>// cái công tắc chỉ là một dòng JavaScript
document.documentElement.dataset.theme = 'dark';</code></pre>

<div class="kv-grid">
  <div class="kv"><span class="k">Khai lại TOKEN, không khai lại quy tắc</span><span class="v">Chế độ tối nên đổi khoảng 10 giá trị biến, không phải chép lại 400 quy tắc.</span></div>
  <div class="kv"><span class="k">Đặt nền cho body</span><span class="v">Không đặt <code>background</code> rõ ràng cho <code>body</code> thì chữ sáng rơi trên nền trắng mặc định của trình duyệt.</span></div>
  <div class="kv"><span class="k">Kiểm độ tương phản</span><span class="v">Trắng tinh trên đen tuyền rất chói. Dùng <code>#e6edf3</code> trên <code>#11151b</code>, và nhắm tỉ lệ 4,5:1 cho chữ nội dung.</span></div>
</div>

<div class="pitfall"><strong>Đừng khai một màu ở hai chỗ.</strong> Ngay khi một mã hex vừa nằm trong token vừa viết cứng trong một quy tắc, hai chỗ đó sẽ trôi dạt khỏi nhau — và cái bạn quên luôn là cái nằm trên trang bạn không thử. Tìm chữ <code>#</code> trong file CSS của bạn: ngoài khối token ra, gần như không nên còn cái nào.</div>
</div>
`,
    },

    {
      title: '12.5 — Chapter 12 quiz|||12.5 — Kiểm tra chương 12',
      slug: 'wf-12-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về position, stacking context, hiệu năng hoạt hình, BEM và token.',
      content: `
<div class="ml-en"><p class="lead">Six questions on positioning, stacking contexts, animation performance, naming and theming.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">absolute needs an anchor</span><span class="lz-t">position: relative on the parent</span><span class="lz-d">No positioned ancestor means it anchors to the document — that is the element flying to the page corner.</span></div>
<div class="lz-node"><span class="lz-k">z-index is scoped</span><span class="lz-t">to its stacking context</span><span class="lz-d">opacity, transform and filter create contexts silently. Look at ancestors, not the element.</span></div>
<div class="lz-node"><span class="lz-k">Animate transform and opacity</span><span class="lz-t">never width, height or left</span><span class="lz-d">Layout properties force a recalculation every frame; the compositor handles the other two for free.</span></div>
<div class="lz-node"><span class="lz-k">Global names collide</span><span class="lz-t">scope them or namespace them</span><span class="lz-d">.card and button at global scope will fight your CSS framework, on pages you never touched.</span></div>
</div></div>
<div class="ml-vi"><p class="lead">Sáu câu về định vị, ngữ cảnh xếp chồng, hiệu năng hoạt hình, đặt tên và token.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">absolute cần một cái neo</span><span class="lz-t">position: relative ở cha</span><span class="lz-d">Không có tổ tiên nào được định vị thì nó neo vào cả tài liệu — đó là phần tử bay ra góc trang.</span></div>
<div class="lz-node"><span class="lz-k">z-index có phạm vi</span><span class="lz-t">trong ngữ cảnh xếp chồng của nó</span><span class="lz-d">opacity, transform và filter tạo ngữ cảnh một cách âm thầm. Soi tổ tiên, đừng soi phần tử.</span></div>
<div class="lz-node"><span class="lz-k">Làm động transform và opacity</span><span class="lz-t">đừng bao giờ width, height hay left</span><span class="lz-d">Thuộc tính bố cục buộc tính lại mỗi khung hình; hai cái kia bộ hợp thành lo miễn phí.</span></div>
<div class="lz-node"><span class="lz-k">Tên toàn cục sẽ đụng nhau</span><span class="lz-t">khoanh vùng hoặc gắn tiền tố</span><span class="lz-d">.card và button ở phạm vi toàn cục sẽ đánh nhau với framework CSS, trên những trang bạn chưa từng đụng tới.</span></div>
</div></div>
`,
      quiz: {
        timeLimitSeconds: 480,
        questions: [
          {
            question: 'An element with position: absolute jumps to the top-left of the page. Why?|||Một phần tử position: absolute bay lên góc trên bên trái của trang. Vì sao?',
            options: [
              'No ancestor has a position other than static|||Không tổ tiên nào có position khác static',
              'It is missing a z-index|||Nó thiếu z-index',
              'The parent has display: flex|||Cha đang để display: flex',
              'absolute always anchors to the page|||absolute luôn neo vào cả trang',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'z-index: 9999 on a modal still renders behind another element. Most likely cause?|||Modal để z-index: 9999 mà vẫn nằm dưới phần tử khác. Nguyên nhân thường gặp nhất?',
            options: [
              'An ancestor created its own stacking context|||Một tổ tiên đã tạo ngữ cảnh xếp chồng riêng',
              'z-index only accepts values up to 100|||z-index chỉ nhận giá trị tới 100',
              'The modal needs position: static|||Modal cần position: static',
              'Two elements cannot share a z-index|||Hai phần tử không thể trùng z-index',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which pair is cheap to animate at 60fps?|||Cặp thuộc tính nào rẻ để làm động ở 60fps?',
            options: [
              'transform and opacity|||transform và opacity',
              'width and height|||width và height',
              'top and left|||top và left',
              'margin and padding|||margin và padding',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why avoid transition: all?|||Vì sao nên tránh transition: all?',
            options: [
              'It animates properties you did not intend, including layout ones|||Nó làm động cả thuộc tính bạn không định, kể cả thuộc tính bố cục',
              'It is not supported in Chrome|||Chrome không hỗ trợ',
              'It only works with keyframes|||Nó chỉ chạy cùng keyframes',
              'It disables hover states|||Nó tắt trạng thái hover',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In BEM, what does .card__title--large mean?|||Trong BEM, .card__title--large nghĩa là gì?',
            options: [
              'The title element of the card block, in its large variant|||Phần tử title của block card, ở biến thể large',
              'Three separate classes that must all match|||Ba class riêng biệt phải khớp cả ba',
              'A card inside a title inside a large box|||Một card trong title trong hộp large',
              'A deprecated syntax|||Một cú pháp đã bị bỏ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the cleanest way to implement dark mode with CSS variables?|||Cách sạch nhất để làm chế độ tối bằng biến CSS là gì?',
            options: [
              'Redefine the semantic token values under a dark selector|||Khai lại GIÁ TRỊ của các token ngữ nghĩa dưới một bộ chọn dark',
              'Duplicate every rule with dark colours|||Chép lại mọi quy tắc với màu tối',
              'Add !important to every dark rule|||Thêm !important vào mọi quy tắc tối',
              'Use a separate stylesheet loaded by JavaScript|||Dùng một file CSS riêng do JavaScript nạp',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
