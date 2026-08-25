const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 3: Xung đột, chỗ mô hình RÒ RỈ.
 * Số đo: Tailwind CLI 3.4.14 thật. Phát hiện trung tâm — thứ tự VIẾT
 * không ảnh hưởng gì (diff byte-identical), và trong cùng một nhóm
 * thuộc tính thì sắp theo CHUỖI nên mt-8 thắng mt-32.
 */

export default {
  title: 'Chapter 3 — Conflicts, where the model leaks|||Chương 3 — Xung đột, chỗ mô hình RÒ RỈ',
  slug: 'tw-ch3-xung-dot',
  description: 'Sáu bài về cạnh sắc nhất của Tailwind: khi hai tiện ích cùng đặt một thuộc tính, kẻ thắng KHÔNG phải cái bạn viết sau. Đo thật, giải thích đầy đủ, và ba cách xử lý xếp theo thứ tự nên thử.',
  sortOrder: 4,
  lessons: [

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Written order has zero effect|||3.1 — Thứ tự VIẾT không có tác dụng gì',
      slug: 'tw-3-1-thu-tu-viet',
      type: 'VIDEO',
      description: 'Dựng hai file — `p-2 p-8` và `p-8 p-2` — rồi `diff` đầu ra: GIỐNG HỆT nhau từng byte. Cái trực giác CSS quen thuộc "cái viết sau thắng" KHÔNG áp dụng, vì cái bạn viết không phải một quy tắc CSS mà là một DANH SÁCH THAM CHIẾU.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Written order has zero effect</h2>
<p class="lead">This is the sharpest edge in Tailwind, and it catches experienced CSS developers hardest — precisely because their instincts are correct about CSS and wrong about this. The fix is not a trick; it is understanding what the class attribute actually is.</p>

<h3>The experiment</h3>
<p>Build the same two utilities in both orders and compare the output byte for byte:</p>

<pre><code class="language-bash">$ echo '&lt;div class="p-2 p-8"&gt;&lt;/div&gt;' &gt; page.html
$ npx tailwindcss -c tw.config.js -i in.css -o a.css

$ echo '&lt;div class="p-8 p-2"&gt;&lt;/div&gt;' &gt; page.html
$ npx tailwindcss -c tw.config.js -i in.css -o b.css

$ diff a.css b.css
</code></pre>

<div class="out">(khong co dau ra)

=> HAI FILE GIONG HET NHAU TUNG BYTE.
   Thu tu viet trong class KHONG anh huong gi ca.
</div>

<p>Not "usually the same". Identical. Reversing the class order changed nothing at all, because the class attribute is not where the ordering decision lives.</p>

<div class="callout">
<p><strong>The reason, in one line.</strong> <code>class="p-2 p-8"</code> is not a list of instructions applied in sequence — it is an unordered <em>set of references</em>. The browser looks up each referenced rule in the stylesheet and resolves conflicts using the cascade, which for equal specificity means <em>whichever rule appears later in the stylesheet</em>. Your class attribute has no say in that.</p>
</div>

<h3>So which one wins?</h3>
<p>Look at the generated stylesheet:</p>

<div class="out">.p-2 { padding: 0.5rem }
.p-8 { padding: 2rem }
</div>

<p><code>.p-8</code> is emitted second, so <code>p-8</code> wins — in <strong>both</strong> files. Whether you wrote <code>p-2 p-8</code> or <code>p-8 p-2</code>, the element gets 2rem of padding.</p>

<h3>Where the intuition comes from, and why it is right about CSS</h3>
<p>The instinct "later wins" is correct, and it is worth being precise about what it applies to:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">inline styles — order matters</span><span class="lz-nsub"><code>style="padding:2px; padding:8px"</code></span></span>
<span class="lz-nbody">These ARE sequential declarations in one rule, so the later one wins. 8px. The intuition holds perfectly here, which is part of why it transfers so confidently and so wrongly.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">class attribute — order is meaningless</span><span class="lz-nsub"><code>class="p-2 p-8"</code></span></span>
<span class="lz-nbody">These are references to two separate rules elsewhere. The HTML spec defines <code>class</code> as an unordered set of tokens. Nothing in CSS ever consults the order tokens appear in.</span>
</div>
</div>

<p>This is not a Tailwind design flaw — it is how <code>class</code> has always worked. Writing <code>class="btn btn-primary"</code> versus <code>class="btn-primary btn"</code> in Bootstrap has the same non-effect. Utility CSS just makes you notice, because it is the only style of CSS where you routinely put two conflicting classes on one element.</p>

<h3>The failure this produces in practice</h3>
<pre><code class="language-jsx">function Button({ className }) {
  return &lt;button className={&#96;px-4 py-2 rounded \${className}&#96;} /&gt;;
}

// The caller intends to override the padding:
&lt;Button className="px-8" /&gt;
// Renders: class="px-4 py-2 rounded px-8"
// Result:  px-4 wins. The override silently does nothing.
</code></pre>

<p>This is the single most common real-world manifestation. The component author left a <code>className</code> prop to allow customisation, the caller used it exactly as intended, the class appears in the DOM, and it does not apply. Nothing errors. In DevTools you can see <code>px-8</code> on the element and <code>.px-4</code> winning in the styles panel with <code>.px-8</code> nowhere to be seen — because the browser resolved it before rendering.</p>

<div class="callout warn">
<p><strong>Why this is a design problem, not just a bug.</strong> A <code>className</code> prop that <em>sometimes</em> works — depending on which utilities happen to be involved and their positions in the generated file — is worse than one that never works. It works in testing with one set of overrides and fails in production with another. Chapter 4 is entirely about fixing this properly.</p>
</div>

<h3>Verifying it yourself in thirty seconds</h3>
<p>You do not need to trust this lesson. In any browser, on any Tailwind page:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">inspect the element</span><span class="lz-d">Find one with two conflicting utilities, or add one in the Elements panel.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">read the Styles panel</span><span class="lz-d">Both rules appear. One has its declaration struck through. That is the loser, and it is decided by which rule sits later in the stylesheet.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">reorder the classes in the DOM</span><span class="lz-d">Edit the class attribute to swap them. Nothing changes. The struck-through rule stays struck through. That is the whole lesson, demonstrated live.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — "fixing" it by reordering the classes.</strong> When someone hits this, the first attempt is almost always to move the class to the end of the string. It appears to work sometimes, which is the worst possible outcome — the apparent success is coincidence (the utility that happened to be later in the generated file was also the one moved), and the false lesson gets carried forward. Reordering is never the fix; lesson 3.4 has the real one.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The class attribute is an unordered set of references, not a sequence of declarations, so reversing two conflicting utilities produces byte-identical CSS — the winner is decided entirely by which rule Tailwind emitted later, and no amount of reordering your JSX will change it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">HTML spec — the class attribute</span><span class="lc-sub">html.spec.whatwg.org/multipage/dom.html#classes — defines <code>class</code> as "a set of space-separated tokens". The word <em>set</em> is the whole lesson: sets are unordered.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Cascade, specificity, and order of appearance</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade — the tie-break rule that "order of appearance" means position in the stylesheet, not position in the markup.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — the note on conflicting classes</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes#conflicting-classes — Tailwind's own warning about this, and its recommendation not to rely on order.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — composing classes without this bug</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — <code>tailwind-merge</code>, and the measurement showing 76% of this repository's dynamic class composition is currently exposed to exactly this failure.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Thứ tự VIẾT không có tác dụng gì</h2>
<p class="lead">Đây là cạnh SẮC nhất của Tailwind, và nó bắt trúng các lập trình viên CSS DÀY DẠN nặng nhất — chính vì trực giác của họ ĐÚNG về CSS và SAI về chuyện này. Cách sửa không phải một mẹo; nó là hiểu thuộc tính lớp THẬT SỰ là cái gì.</p>

<h3>Thí nghiệm</h3>
<p>Dựng cùng hai tiện ích theo cả hai thứ tự rồi so đầu ra từng byte:</p>

<pre><code class="language-bash">$ echo '&lt;div class="p-2 p-8"&gt;&lt;/div&gt;' &gt; page.html
$ npx tailwindcss -c tw.config.js -i in.css -o a.css

$ echo '&lt;div class="p-8 p-2"&gt;&lt;/div&gt;' &gt; page.html
$ npx tailwindcss -c tw.config.js -i in.css -o b.css

$ diff a.css b.css
</code></pre>

<div class="out">(khong co dau ra)

=> HAI FILE GIONG HET NHAU TUNG BYTE.
   Thu tu viet trong class KHONG anh huong gi ca.
</div>

<p>Không phải "thường thì giống nhau". GIỐNG HỆT. Đảo thứ tự lớp KHÔNG đổi gì hết, vì thuộc tính lớp KHÔNG phải nơi quyết định về thứ tự nằm ở đó.</p>

<div class="callout">
<p><strong>Lý do, trong một dòng.</strong> <code>class="p-2 p-8"</code> KHÔNG phải một danh sách chỉ thị được áp theo trình tự — nó là một <em>TẬP HỢP THAM CHIẾU KHÔNG CÓ THỨ TỰ</em>. Trình duyệt TRA từng quy tắc được tham chiếu trong bảng kiểu và phá xung đột bằng CASCADE, mà với độ đặc hiệu bằng nhau thì nghĩa là <em>quy tắc nào xuất hiện SAU HƠN TRONG BẢNG KIỂU</em>. Thuộc tính lớp của bạn KHÔNG có tiếng nói gì trong đó.</p>
</div>

<h3>Vậy cái nào thắng?</h3>
<p>Nhìn vào bảng kiểu được phát sinh:</p>

<div class="out">.p-2 { padding: 0.5rem }
.p-8 { padding: 2rem }
</div>

<p><code>.p-8</code> được phát sinh THỨ HAI, nên <code>p-8</code> thắng — trong <strong>CẢ HAI</strong> file. Dù bạn viết <code>p-2 p-8</code> hay <code>p-8 p-2</code>, cái thẻ nhận 2rem padding.</p>

<h3>Trực giác đến từ đâu, và vì sao nó ĐÚNG về CSS</h3>
<p>Bản năng "cái sau thắng" là ĐÚNG, và đáng nói cho chính xác nó áp cho cái gì:</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">inline style — thứ tự CÓ nghĩa</span><span class="lz-nsub"><code>style="padding:2px; padding:8px"</code></span></span>
<span class="lz-nbody">Đây LÀ các khai báo TUẦN TỰ trong MỘT quy tắc, nên cái sau thắng. 8px. Trực giác đúng hoàn hảo ở đây, và đó là một phần lý do nó chuyển sang chỗ khác một cách tự tin và sai lầm đến thế.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">thuộc tính class — thứ tự VÔ NGHĨA</span><span class="lz-nsub"><code>class="p-2 p-8"</code></span></span>
<span class="lz-nbody">Đây là các THAM CHIẾU tới hai quy tắc riêng biệt ở chỗ khác. Đặc tả HTML định nghĩa <code>class</code> là một TẬP token KHÔNG THỨ TỰ. Không có gì trong CSS từng tra tới thứ tự các token xuất hiện.</span>
</div>
</div>

<p>Đây KHÔNG phải một khiếm khuyết thiết kế của Tailwind — nó là cách <code>class</code> vẫn luôn hoạt động. Viết <code>class="btn btn-primary"</code> đối lập <code>class="btn-primary btn"</code> trong Bootstrap cũng KHÔNG có tác dụng y như vậy. CSS tiện ích chỉ làm bạn ĐỂ Ý tới, vì nó là kiểu CSS DUY NHẤT mà bạn thường xuyên đặt hai lớp xung đột lên một thẻ.</p>

<h3>Cú hỏng chuyện này đẻ ra trong thực tế</h3>
<pre><code class="language-jsx">function Button({ className }) {
  return &lt;button className={&#96;px-4 py-2 rounded \${className}&#96;} /&gt;;
}

// Nguoi goi CO Y de len padding:
&lt;Button className="px-8" /&gt;
// Dung ra: class="px-4 py-2 rounded px-8"
// Ket qua: px-4 THANG. Cu de len am tham khong lam gi.
</code></pre>

<p>Đây là biểu hiện thực tế phổ biến NHẤT. Tác giả component để lại một prop <code>className</code> để cho phép tuỳ biến, người gọi dùng nó ĐÚNG như dự định, cái lớp XUẤT HIỆN trong DOM, và nó KHÔNG áp. Không có lỗi nào. Trong DevTools bạn thấy <code>px-8</code> trên thẻ và <code>.px-4</code> đang thắng ở bảng styles còn <code>.px-8</code> thì chẳng thấy đâu — vì trình duyệt đã phân giải xong trước khi vẽ.</p>

<div class="callout warn">
<p><strong>Vì sao đây là vấn đề THIẾT KẾ, không chỉ là một con bọ.</strong> Một prop <code>className</code> <em>THỈNH THOẢNG</em> chạy — tuỳ vào những tiện ích nào tình cờ dính vào và vị trí của chúng trong file được phát sinh — thì TỆ HƠN một prop không bao giờ chạy. Nó chạy lúc thử nghiệm với một bộ đè này và hỏng ở production với một bộ khác. Chương 4 dành trọn cho việc vá chuyện này cho tử tế.</p>
</div>

<h3>Tự xác minh trong ba mươi giây</h3>
<p>Bạn KHÔNG cần tin bài này. Trên bất kỳ trình duyệt nào, ở bất kỳ trang Tailwind nào:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">soi cái thẻ</span><span class="lz-d">Tìm một thẻ có hai tiện ích xung đột, hoặc tự thêm một cái trong bảng Elements.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">đọc bảng Styles</span><span class="lz-d">CẢ HAI quy tắc đều xuất hiện. Một cái có khai báo bị GẠCH NGANG. Đó là kẻ thua, và nó do quy tắc nào nằm SAU trong bảng kiểu quyết định.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">đảo thứ tự lớp ngay trong DOM</span><span class="lz-d">Sửa thuộc tính lớp để hoán vị chúng. KHÔNG gì thay đổi. Cái bị gạch vẫn bị gạch. Đó là toàn bộ bài học, trình diễn trực tiếp.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — "vá" nó bằng cách sắp xếp lại các lớp.</strong> Khi ai đó gặp chuyện này, nỗ lực đầu tiên gần như luôn là dời cái lớp về CUỐI chuỗi. Nó CÓ VẺ chạy đôi khi, và đó là kết cục TỆ NHẤT có thể — thành công biểu kiến ấy là TRÙNG HỢP (cái tiện ích tình cờ nằm sau trong file được phát sinh cũng chính là cái được dời), và bài học SAI được mang đi tiếp. Sắp xếp lại KHÔNG BAO GIỜ là cú vá; bài 3.4 có cú vá thật.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Thuộc tính lớp là một TẬP THAM CHIẾU không thứ tự, không phải một dãy khai báo, nên đảo hai tiện ích xung đột đẻ ra CSS giống hệt nhau từng byte — kẻ thắng do quy tắc nào Tailwind phát sinh SAU HƠN quyết định hoàn toàn, và không lượng sắp-xếp-lại JSX nào của bạn đổi được nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả HTML — thuộc tính class</span><span class="lc-sub">html.spec.whatwg.org/multipage/dom.html#classes — định nghĩa <code>class</code> là "một TẬP các token ngăn bởi khoảng trắng". Chữ <em>TẬP</em> chính là toàn bộ bài học: tập hợp thì KHÔNG có thứ tự.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Cascade, độ đặc hiệu, và thứ tự xuất hiện</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Cascade — luật phá hoà rằng "thứ tự xuất hiện" nghĩa là vị trí TRONG BẢNG KIỂU, không phải vị trí trong mã đánh dấu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — ghi chú về lớp xung đột</span><span class="lc-sub">tailwindcss.com/docs/styling-with-utility-classes#conflicting-classes — chính Tailwind cảnh báo chuyện này, và khuyến nghị ĐỪNG dựa vào thứ tự.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — soạn lớp mà không dính con bọ này</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — <code>tailwind-merge</code>, và số đo cho thấy 76% cách soạn lớp động của kho này hiện đang PHƠI ra đúng cú hỏng ấy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Reading the sort: why mt-8 beats mt-32|||3.2 — Đọc phép sắp: vì sao mt-8 thắng mt-32',
      slug: 'tw-3-2-phep-sap',
      type: 'VIDEO',
      description: 'Mười một lớp `mt-*` trên một thẻ, và kẻ thắng là `mt-8` — không phải cái viết đầu, không phải cái viết cuối, không phải cái lớn nhất. Vì trong một nhóm thuộc tính Tailwind sắp theo CHUỖI, còn giữa các nhóm thì sắp theo NGỮ NGHĨA.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Reading the sort: why mt-8 beats mt-32</h2>
<p class="lead">Lesson 3.1 established that emit order decides. This lesson asks the obvious follow-up: what <em>is</em> the emit order? The answer has two halves — one sensible, one surprising — and knowing which half you are in tells you whether to trust your instincts.</p>

<h3>The surprising half: within one property group</h3>
<p>Put every <code>mt-*</code> on one element and read what comes out:</p>

<pre><code class="language-html">&lt;div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12
            mt-16 mt-20 mt-24 mt-32"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ grep -o '^\\.mt-[0-9]*' out.css | tr '\\n' ' '
.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8

$ grep -o '^\\.mt-[0-9]*' out.css | tail -1
.mt-8                      &lt;- phat sinh CUOI CUNG => THANG
</div>

<p>The order is <code>1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8</code>. That is <strong>lexicographic string order</strong>, not numeric — <code>"10"</code> sorts before <code>"2"</code> because <code>"1"</code> &lt; <code>"2"</code> as characters. The last one emitted is <code>mt-8</code>, so out of eleven conflicting classes, <strong><code>mt-8</code> (32px) wins</strong>.</p>

<div class="callout warn">
<p><strong>Note what it is not.</strong> Not <code>mt-1</code> (written first). Not <code>mt-32</code> (written last). Not <code>mt-32</code> (largest value). It is <code>mt-8</code>, for the entirely incidental reason that <code>"8"</code> is the last single character in the sorted list. No mental model of "bigger wins" or "later wins" predicts this; only reading the sort does.</p>
</div>

<h3>The sensible half: across property groups</h3>
<p>Now mix utilities that affect padding at different scopes:</p>

<pre><code class="language-html">&lt;div class="pt-1 p-2 px-3 py-4 pl-5"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ grep -o '^\\.[a-z-]*[0-9]*' out.css | tr '\\n' ' '
.p-2 .px-3 .py-4 .pl-5 .pt-1
</div>

<p>This one is <em>deliberately designed</em>: broadest first (<code>p</code>, all four sides), then axis (<code>px</code>, <code>py</code>), then individual side (<code>pl</code>, <code>pt</code>). So <code>p-2 px-3</code> resolves to "2 units everywhere, overridden to 3 on the horizontal axis" — exactly what anyone would intend. The narrower the intent, the later it is emitted, and the more reliably it wins.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">across groups — TRUST it</span><span class="lz-nsub"><code>p-4 px-8</code> → <code>px-8</code> wins horizontally</span></span>
<span class="lz-nbody">Semantic hierarchy: whole → axis → side. This is designed behaviour and it matches intent, so combining a broad utility with a narrow override is a legitimate, readable pattern.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">within a group — NEVER rely on it</span><span class="lz-nsub"><code>mt-2 mt-10</code> → depends on string sort</span></span>
<span class="lz-nbody">Lexicographic on the value. Arbitrary from your point of view, and it can change between Tailwind versions if the scale gains entries. Two utilities from the same group on one element is a bug, not a technique.</span>
</div>
</div>

<h3>The rule that follows</h3>
<p>The two halves give a clean, usable distinction:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>p-4 px-8</code> — fine</span><span class="lz-lnote">different scopes. The narrower one is emitted later by design and wins. Readable, intentional, stable across versions</span></div>
<div class="lz-layer"><span class="lz-lname"><code>mt-4 mb-4</code> — fine</span><span class="lz-lnote">different properties entirely (margin-top vs margin-bottom). No conflict exists, so no ordering question arises</span></div>
<div class="lz-layer"><span class="lz-lname"><code>mt-2 mt-10</code> — bug</span><span class="lz-lnote">same property, same scope. One of them is dead code, and which one is decided by string sort. If this appears in a diff, it is a mistake to fix, not an override to preserve</span></div>
<div class="lz-layer"><span class="lz-lname"><code>text-sm text-lg</code> — bug</span><span class="lz-lnote">same as above. Common when a conditional was meant and a template literal concatenated both branches instead</span></div>
</div>

<h3>Why the sort is lexicographic in the first place</h3>
<p>It is worth understanding rather than resenting. Tailwind's scale keys are not all numbers — the spacing scale contains <code>px</code>, <code>0.5</code>, <code>1.5</code>, <code>2.5</code>, <code>3.5</code> alongside the integers. There is no total numeric ordering over a set that mixes <code>"px"</code> with <code>"2.5"</code> with <code>"32"</code>. String sort is the only ordering that is <em>defined</em> for all of them, so that is what gets used.</p>

<div class="callout ok">
<p><strong>The upshot: the sort is arbitrary but deterministic.</strong> It is stable for a given Tailwind version and a given scale, so a conflict that resolves one way today resolves the same way tomorrow. That is why the failure is so insidious — it is perfectly reproducible, which makes it look like intended behaviour rather than a bug. Adding one custom value to your scale can silently change which class wins in a conflict elsewhere in the app.</p>
</div>

<h3>Detecting these in a codebase</h3>
<p>Same-group conflicts are mechanically findable, which means they should be linted rather than hunted:</p>

<pre><code class="language-bash"># crude but effective: two mt-* on one class attribute
$ grep -rhoE 'className="[^"]*\\bmt-[0-9]+[^"]*\\bmt-[0-9]+[^"]*"' src --include="*.tsx"
</code></pre>

<p>The proper tool is <code>eslint-plugin-tailwindcss</code>, whose <code>no-contradicting-classname</code> rule knows the full group structure and flags exactly these. It catches the static cases at lint time. It cannot catch the dynamic ones — a conflict assembled from a prop at runtime is invisible to a linter, which is why Chapter 4's runtime solution is still necessary.</p>

<div class="pitfall">
<p><strong>Trap — treating <code>p-4 px-8</code> and <code>mt-2 mt-10</code> as the same thing.</strong> They look identical in structure and are completely different in kind. The first is a designed, stable override. The second is undefined behaviour that happens to be deterministic. Reviewers who ban both lose a useful pattern; reviewers who allow both ship the bug. The question to ask is always "same property at the same scope?" — if yes, it is a mistake.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Emit order has two halves — <em>across</em> property groups it is a designed semantic hierarchy you can rely on (whole → axis → side), and <em>within</em> a group it is lexicographic string sort on the value, which is arbitrary from your point of view, so two utilities of the same property at the same scope is always a bug rather than an override.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">eslint-plugin-tailwindcss — no-contradicting-classname</span><span class="lc-sub">github.com/francoismassart/eslint-plugin-tailwindcss — the lint rule that catches static same-group conflicts. Worth enabling before you go looking for them by hand.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind source — the utility ordering logic</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss — the plugin definition order and sort behaviour that produce the two halves measured in this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — shorthand properties and their expansion</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties — why <code>padding</code> and <code>padding-left</code> interact the way they do, which is the CSS behaviour the semantic hierarchy is built to match.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — resolving conflicts at runtime</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — <code>tailwind-merge</code> restores last-written-wins and understands the same group structure measured here, including that <code>p</code> contains <code>px</code>.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Đọc phép sắp: vì sao mt-8 thắng mt-32</h2>
<p class="lead">Bài 3.1 đã dựng được rằng THỨ TỰ PHÁT SINH quyết định. Bài này hỏi câu tiếp theo hiển nhiên: thứ tự phát sinh <em>LÀ</em> gì? Câu trả lời có hai nửa — một nửa hợp lý, một nửa gây bất ngờ — và biết mình đang ở nửa nào cho bạn biết có nên tin trực giác không.</p>

<h3>Nửa gây bất ngờ: TRONG một nhóm thuộc tính</h3>
<p>Đặt mọi <code>mt-*</code> lên một thẻ rồi đọc cái chui ra:</p>

<pre><code class="language-html">&lt;div class="mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12
            mt-16 mt-20 mt-24 mt-32"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ grep -o '^\\.mt-[0-9]*' out.css | tr '\\n' ' '
.mt-1 .mt-10 .mt-12 .mt-16 .mt-2 .mt-20 .mt-24 .mt-3 .mt-32 .mt-4 .mt-8

$ grep -o '^\\.mt-[0-9]*' out.css | tail -1
.mt-8                      &lt;- phat sinh CUOI CUNG => THANG
</div>

<p>Thứ tự là <code>1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8</code>. Đó là <strong>thứ tự CHUỖI từ điển</strong>, không phải thứ tự SỐ — <code>"10"</code> đứng trước <code>"2"</code> vì <code>"1"</code> &lt; <code>"2"</code> xét theo ký tự. Cái phát sinh cuối cùng là <code>mt-8</code>, nên trong mười một lớp xung đột, <strong><code>mt-8</code> (32px) THẮNG</strong>.</p>

<div class="callout warn">
<p><strong>Để ý cái nó KHÔNG phải.</strong> Không phải <code>mt-1</code> (viết đầu). Không phải <code>mt-32</code> (viết cuối). Không phải <code>mt-32</code> (giá trị lớn nhất). Nó là <code>mt-8</code>, vì một lý do HOÀN TOÀN tình cờ rằng <code>"8"</code> là ký tự đơn cuối cùng trong danh sách đã sắp. KHÔNG mô hình tinh thần nào kiểu "lớn hơn thắng" hay "sau hơn thắng" dự đoán được cái này; chỉ ĐỌC phép sắp mới ra.</p>
</div>

<h3>Nửa hợp lý: GIỮA các nhóm thuộc tính</h3>
<p>Giờ trộn các tiện ích tác động lên padding ở các PHẠM VI khác nhau:</p>

<pre><code class="language-html">&lt;div class="pt-1 p-2 px-3 py-4 pl-5"&gt;&lt;/div&gt;
</code></pre>

<div class="out">$ grep -o '^\\.[a-z-]*[0-9]*' out.css | tr '\\n' ' '
.p-2 .px-3 .py-4 .pl-5 .pt-1
</div>

<p>Cái này được <em>THIẾT KẾ CÓ CHỦ Ý</em>: rộng nhất trước (<code>p</code>, cả bốn cạnh), rồi TRỤC (<code>px</code>, <code>py</code>), rồi từng CẠNH (<code>pl</code>, <code>pt</code>). Nên <code>p-2 px-3</code> phân giải thành "2 đơn vị khắp nơi, đè thành 3 ở trục ngang" — đúng cái bất kỳ ai cũng có ý định. Ý định càng HẸP thì càng được phát sinh SAU, và càng thắng đáng tin.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">giữa các nhóm — HÃY TIN nó</span><span class="lz-nsub"><code>p-4 px-8</code> → <code>px-8</code> thắng ở chiều ngang</span></span>
<span class="lz-nbody">Trật tự NGỮ NGHĨA: toàn phần → trục → cạnh. Đây là hành vi được thiết kế và nó khớp Ý ĐỊNH, nên kết hợp một tiện ích rộng với một cú đè hẹp là một khuôn mẫu CHÍNH ĐÁNG, đọc được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">trong một nhóm — ĐỪNG BAO GIỜ dựa vào</span><span class="lz-nsub"><code>mt-2 mt-10</code> → tuỳ phép sắp chuỗi</span></span>
<span class="lz-nbody">Từ điển theo giá trị. TUỲ TIỆN xét từ góc nhìn của bạn, và nó CÓ THỂ ĐỔI giữa các phiên bản Tailwind nếu cái thang có thêm mục. Hai tiện ích cùng nhóm trên một thẻ là một CON BỌ, không phải một kỹ thuật.</span>
</div>
</div>

<h3>Luật rơi ra</h3>
<p>Hai nửa cho một sự phân biệt sạch sẽ, dùng được:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>p-4 px-8</code> — ổn</span><span class="lz-lnote">phạm vi khác nhau. Cái hẹp hơn được phát sinh sau THEO THIẾT KẾ và thắng. Đọc được, có chủ ý, ổn định qua các phiên bản</span></div>
<div class="lz-layer"><span class="lz-lname"><code>mt-4 mb-4</code> — ổn</span><span class="lz-lnote">hai thuộc tính HOÀN TOÀN khác nhau (margin-top và margin-bottom). KHÔNG có xung đột nào tồn tại, nên không nảy sinh câu hỏi thứ tự</span></div>
<div class="lz-layer"><span class="lz-lname"><code>mt-2 mt-10</code> — BỌ</span><span class="lz-lnote">cùng thuộc tính, cùng phạm vi. MỘT trong hai là mã chết, và cái nào thì do phép sắp chuỗi quyết định. Nếu thứ này xuất hiện trong một diff, đó là một sai sót cần vá, không phải một cú đè cần giữ</span></div>
<div class="lz-layer"><span class="lz-lname"><code>text-sm text-lg</code> — BỌ</span><span class="lz-lnote">y như trên. Thường gặp khi người ta ĐỊNH viết một điều kiện mà một chuỗi mẫu lại nối CẢ HAI nhánh vào</span></div>
</div>

<h3>Vì sao phép sắp lại theo từ điển ngay từ đầu</h3>
<p>Chuyện này đáng HIỂU chứ không phải đáng bực. Các khoá thang của Tailwind KHÔNG phải toàn số — thang khoảng cách chứa <code>px</code>, <code>0.5</code>, <code>1.5</code>, <code>2.5</code>, <code>3.5</code> bên cạnh các số nguyên. KHÔNG tồn tại một thứ tự SỐ toàn phần trên một tập trộn <code>"px"</code> với <code>"2.5"</code> với <code>"32"</code>. Sắp theo chuỗi là thứ tự DUY NHẤT <em>ĐỊNH NGHĨA ĐƯỢC</em> cho tất cả chúng, nên đó là cái được dùng.</p>

<div class="callout ok">
<p><strong>Điều rút ra: phép sắp TUỲ TIỆN nhưng TẤT ĐỊNH.</strong> Nó ỔN ĐỊNH với một phiên bản Tailwind và một cái thang cho trước, nên một xung đột phân giải theo cách này hôm nay sẽ phân giải y hệt ngày mai. Đó là lý do cú hỏng này thâm hiểm đến vậy — nó TÁI HIỆN hoàn hảo, khiến nó TRÔNG như hành vi được dự định chứ không phải một con bọ. Thêm MỘT giá trị tuỳ biến vào thang của bạn có thể ÂM THẦM đổi lớp nào thắng trong một xung đột ở chỗ khác trong ứng dụng.</p>
</div>

<h3>Phát hiện chúng trong một kho mã</h3>
<p>Xung đột cùng-nhóm tìm được BẰNG MÁY, nghĩa là chúng nên được LINT chứ không phải đi săn:</p>

<pre><code class="language-bash"># tho nhung hieu qua: hai mt-* tren mot thuoc tinh class
$ grep -rhoE 'className="[^"]*\\bmt-[0-9]+[^"]*\\bmt-[0-9]+[^"]*"' src --include="*.tsx"
</code></pre>

<p>Công cụ ĐÚNG là <code>eslint-plugin-tailwindcss</code>, với luật <code>no-contradicting-classname</code> biết trọn cấu trúc nhóm và bắt đúng những cái này. Nó bắt các ca TĨNH lúc lint. Nó KHÔNG bắt được các ca ĐỘNG — một xung đột ghép từ một prop lúc chạy thì VÔ HÌNH với một bộ lint, đó là lý do lời giải lúc-chạy của Chương 4 vẫn CẦN THIẾT.</p>

<div class="pitfall">
<p><strong>Bẫy — coi <code>p-4 px-8</code> và <code>mt-2 mt-10</code> là cùng một thứ.</strong> Chúng trông GIỐNG HỆT về cấu trúc và KHÁC HẲN về BẢN CHẤT. Cái đầu là một cú đè được thiết kế, ổn định. Cái sau là hành vi KHÔNG ĐỊNH NGHĨA mà tình cờ tất định. Người review CẤM cả hai thì mất một khuôn mẫu hữu ích; người review CHO cả hai thì giao con bọ đi. Câu hỏi luôn phải hỏi là "cùng thuộc tính ở cùng phạm vi không?" — nếu có, đó là một sai sót.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Thứ tự phát sinh có hai nửa — <em>GIỮA</em> các nhóm thuộc tính là một trật tự ngữ nghĩa được thiết kế mà bạn TIN được (toàn phần → trục → cạnh), còn <em>TRONG</em> một nhóm là phép sắp chuỗi từ điển theo giá trị, thứ TUỲ TIỆN xét từ góc nhìn của bạn, nên hai tiện ích cùng thuộc tính ở cùng phạm vi LUÔN LÀ một con bọ chứ không phải một cú đè.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">eslint-plugin-tailwindcss — no-contradicting-classname</span><span class="lc-sub">github.com/francoismassart/eslint-plugin-tailwindcss — luật lint bắt các xung đột cùng-nhóm TĨNH. Đáng bật lên TRƯỚC khi bạn đi tìm chúng bằng tay.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind source — logic sắp thứ tự tiện ích</span><span class="lc-sub">github.com/tailwindlabs/tailwindcss — thứ tự định nghĩa plugin và hành vi sắp xếp đẻ ra hai nửa được đo trong bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — thuộc tính rút gọn và cách chúng nở ra</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties — vì sao <code>padding</code> và <code>padding-left</code> tương tác theo cách chúng làm, chính là hành vi CSS mà trật tự ngữ nghĩa được dựng để khớp.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — phân giải xung đột lúc CHẠY</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — <code>tailwind-merge</code> khôi phục luật cái-viết-sau-thắng và HIỂU đúng cấu trúc nhóm đo được ở đây, gồm cả chuyện <code>p</code> bao <code>px</code>.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Measuring one codebase&#39;s exposure|||3.3 — Đo mức PHƠI NHIỄM của một kho mã',
      slug: 'tw-3-3-phoi-nhiem',
      type: 'VIDEO',
      description: 'Kho này có 197 chỗ gọi `cn()` và 633 chuỗi mẫu className — 631 trong số đó có nội suy thật. Tức 76% cách soạn lớp động KHÔNG đi qua bộ phân giải xung đột. Đây là cách đo phơi nhiễm của chính bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Measuring one codebase's exposure</h2>
<p class="lead">Lessons 3.1 and 3.2 described a failure mode. This one asks how much of a real application is actually standing in it — because "this can happen" and "this is happening in 631 places" call for different responses.</p>

<h3>The two ways to build a class string</h3>
<p>Every dynamic class list in a React codebase is built one of two ways. This repository has a helper for the safe one:</p>

<pre><code class="language-ts">// frontend/src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string =&gt; twMerge(clsx(inputs));
</code></pre>

<p><code>clsx</code> flattens conditionals into a string; <code>twMerge</code> then resolves Tailwind conflicts inside that string. Together they restore the intuition that the last class written wins. Lesson 3.4 measures exactly what <code>twMerge</code> does.</p>

<h3>Counting which way the codebase actually builds them</h3>
<pre><code class="language-bash">$ grep -rho '\\bcn(' src --include="*.tsx" | wc -l
$ grep -rhoE 'className=\\{&#96;[^&#96;]*&#96;\\}' src --include="*.tsx" | wc -l
$ grep -rhoE 'className=\\{&#96;[^&#96;]*&#96;\\}' src --include="*.tsx" | grep -c '\\\${'
</code></pre>

<div class="out">197    # goi qua cn()      -> AN TOAN
633    # chuoi mau className
631    # ...trong do CO noi suy \${...}  -> PHOI NHIEM
</div>

<p><strong>631 of the 633</strong> template literals contain a real interpolation, so they are genuinely dynamic — not static strings that merely happen to use backticks. Against 197 <code>cn()</code> calls, that is <strong>76.2% of dynamic class composition bypassing conflict resolution</strong>.</p>

<div class="callout warn">
<p><strong>What that percentage does and does not mean.</strong> It does not mean 631 bugs. Most of those interpolations never produce a conflict — they append a class that no other class in the string competes with. The number measures <em>exposure</em>, not defects: 631 places where a future edit that introduces a competing utility will fail silently, with no lint error and no test failure to catch it.</p>
</div>

<h3>Where the exposure concentrates</h3>
<p>The dangerous subset is components that accept a <code>className</code> prop, because that is where a <em>caller</em> supplies a class the component author never saw:</p>

<pre><code class="language-bash">$ grep -rlE 'className\\??:\\s*string' src --include="*.tsx" | wc -l
</code></pre>

<div class="out">62
</div>

<p>Sixty-two components expose a customisation point. Each is a contract that says "pass me classes and I will apply them". Whether that contract holds depends entirely on whether the component runs the merge — and on which utilities the caller happens to pass.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the honest version</span><span class="lz-nsub"><code>className={cn('px-4 py-2', className)}</code></span></span>
<span class="lz-nbody">The caller's class is merged last and wins any conflict. The prop does what its name promises, for every possible input. This is the version that can be documented.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">the coin-flip version</span><span class="lz-nsub"><code>className={&#96;px-4 py-2 \${className}&#96;}</code></span></span>
<span class="lz-nbody">Whether the caller's class wins depends on the emit order of whichever two utilities collided. <code>px-8</code> loses to <code>px-4</code>; <code>mt-8</code> beats <code>mt-32</code>. Same code, different outcome per input.</span>
</div>
</div>

<h3>Why this is worth fixing even where nothing is broken today</h3>
<p>The failure has a specific and unpleasant shape:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">no build error</span><span class="lz-lnote">the template literal is valid TypeScript and valid JSX. <code>tsc</code> is entirely happy</span></div>
<div class="lz-layer"><span class="lz-lname">no lint error</span><span class="lz-lnote"><code>eslint-plugin-tailwindcss</code> can see static conflicts in a literal string, but this conflict only exists after interpolation at runtime. It is structurally invisible to a linter</span></div>
<div class="lz-layer"><span class="lz-lname">no runtime error</span><span class="lz-lnote">the class attribute renders exactly as written. The DOM is correct. Only the computed style is wrong</span></div>
<div class="lz-layer"><span class="lz-lname">it looks right in DevTools</span><span class="lz-lnote">the class IS on the element. You have to open the Styles panel and notice the struck-through declaration to see anything is wrong</span></div>
<div class="lz-layer"><span class="lz-lname">it is intermittent by input</span><span class="lz-lnote">the same component works for <code>mt-4</code> and fails for <code>px-8</code>. So it passes the test someone wrote and fails the case someone else hits</span></div>
</div>

<div class="callout ok">
<p><strong>The migration is mechanical and safe.</strong> Replacing <code>&#96;a b \${c}&#96;</code> with <code>cn('a b', c)</code> is behaviour-preserving in every case where no conflict exists, and behaviour-<em>correcting</em> in every case where one does. There is no scenario where the template literal is right and <code>cn()</code> is wrong. That makes this a rare refactor with genuinely no downside except the diff size — which is why the sensible policy is to migrate the 62 <code>className</code>-prop components first and let the rest follow opportunistically.</p>
</div>

<h3>Making the rule enforceable</h3>
<p>A convention that relies on remembering is a convention that decays — the 76% here is evidence of exactly that, since <code>cn()</code> exists and is used 197 times, so the team knows about it. The fix is to make the wrong version hard to write:</p>

<pre><code class="language-js">// .eslintrc — flag template literals in className
'no-restricted-syntax': ['warn', {
  selector: 'JSXAttribute[name.name="className"] &gt; JSXExpressionContainer &gt; TemplateLiteral',
  message: 'Use cn() so Tailwind conflicts resolve; template literals do not merge.',
}],
</code></pre>

<p>Start it at <code>warn</code> with the existing 631 as accepted debt, and set it to <code>error</code> for new code. A rule that fails the build on day one against 631 existing violations gets disabled on day two.</p>

<div class="pitfall">
<p><strong>Trap — assuming <code>clsx</code> alone is enough.</strong> <code>clsx</code> and <code>classnames</code> handle conditionals elegantly and do <em>not</em> resolve Tailwind conflicts at all — they concatenate. <code>clsx('px-4', 'px-8')</code> returns the string <code>"px-4 px-8"</code>, which has exactly the same problem as the template literal. This repo's <code>cn()</code> wraps <code>clsx</code> in <code>twMerge</code> precisely because the two do different jobs. A codebase using bare <code>clsx</code> for class composition is as exposed as one using template literals.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Measure exposure rather than assuming it — this codebase composes classes dynamically 828 times and only 197 of those go through conflict resolution, so 76% of its dynamic composition is one competing utility away from failing silently, and the 62 components taking a <code>className</code> prop are where that matters most.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tailwind-merge — README</span><span class="lc-sub">github.com/dcastil/tailwind-merge — what it resolves, what it costs, and its explicit statement that <code>clsx</code> alone does not do this job.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">clsx — README</span><span class="lc-sub">github.com/lukeed/clsx — the conditional-flattening half of <code>cn()</code>. Reading its API makes clear it is a string builder with no knowledge of CSS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ESLint — no-restricted-syntax</span><span class="lc-sub">eslint.org/docs/latest/rules/no-restricted-syntax — the AST-selector rule used above to make the unsafe pattern visible at review time.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — typing a className prop honestly</span><span class="lc-sub">/courses/typescript/learn${REF} — component prop contracts, and why a prop whose behaviour depends on its value is a contract the type system cannot express.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Đo mức PHƠI NHIỄM của một kho mã</h2>
<p class="lead">Bài 3.1 và 3.2 MÔ TẢ một kiểu hỏng. Bài này hỏi bao nhiêu phần của một ứng dụng thật đang THẬT SỰ đứng trong đó — vì "chuyện này CÓ THỂ xảy ra" và "chuyện này ĐANG xảy ra ở 631 chỗ" đòi hai cách đáp lại khác nhau.</p>

<h3>Hai cách dựng một chuỗi lớp</h3>
<p>Mọi danh sách lớp động trong một kho mã React đều được dựng theo một trong hai cách. Kho này có một hàm trợ giúp cho cách AN TOÀN:</p>

<pre><code class="language-ts">// frontend/src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string =&gt; twMerge(clsx(inputs));
</code></pre>

<p><code>clsx</code> làm PHẲNG các điều kiện thành một chuỗi; <code>twMerge</code> sau đó PHÂN GIẢI các xung đột Tailwind bên trong chuỗi ấy. Cùng nhau chúng KHÔI PHỤC trực giác rằng lớp viết CUỐI thắng. Bài 3.4 đo chính xác <code>twMerge</code> làm gì.</p>

<h3>Đếm xem kho mã THẬT SỰ dựng chúng theo cách nào</h3>
<pre><code class="language-bash">$ grep -rho '\\bcn(' src --include="*.tsx" | wc -l
$ grep -rhoE 'className=\\{&#96;[^&#96;]*&#96;\\}' src --include="*.tsx" | wc -l
$ grep -rhoE 'className=\\{&#96;[^&#96;]*&#96;\\}' src --include="*.tsx" | grep -c '\\\${'
</code></pre>

<div class="out">197    # goi qua cn()      -> AN TOAN
633    # chuoi mau className
631    # ...trong do CO noi suy \${...}  -> PHOI NHIEM
</div>

<p><strong>631 trên 633</strong> chuỗi mẫu có một cú nội suy THẬT, nên chúng động một cách thực chất — không phải chuỗi tĩnh chỉ tình cờ dùng dấu huyền. Đối chiếu với 197 lượt gọi <code>cn()</code>, đó là <strong>76,2% cách soạn lớp động ĐI VÒNG qua bộ phân giải xung đột</strong>.</p>

<div class="callout warn">
<p><strong>Con số phần trăm ấy nghĩa gì và KHÔNG nghĩa gì.</strong> Nó KHÔNG có nghĩa 631 con bọ. Phần lớn các cú nội suy ấy KHÔNG BAO GIỜ đẻ ra xung đột — chúng nối thêm một lớp mà không lớp nào khác trong chuỗi cạnh tranh. Con số đo mức <em>PHƠI NHIỄM</em>, không đo KHUYẾT TẬT: 631 chỗ mà một lần sửa TƯƠNG LAI đưa vào một tiện ích cạnh tranh sẽ hỏng ÂM THẦM, không lỗi lint và không test nào bắt được.</p>
</div>

<h3>Phơi nhiễm tập trung ở đâu</h3>
<p>Tập con NGUY HIỂM là các component nhận một prop <code>className</code>, vì đó là chỗ một <em>NGƯỜI GỌI</em> đưa vào một lớp mà tác giả component chưa bao giờ thấy:</p>

<pre><code class="language-bash">$ grep -rlE 'className\\??:\\s*string' src --include="*.tsx" | wc -l
</code></pre>

<div class="out">62
</div>

<p>Sáu mươi hai component phơi ra một điểm tuỳ biến. Mỗi cái là một HỢP ĐỒNG nói rằng "đưa lớp cho tôi và tôi sẽ áp chúng". Hợp đồng ấy có đứng vững hay không phụ thuộc HOÀN TOÀN vào việc component có chạy phép hợp nhất không — và vào việc người gọi tình cờ đưa vào những tiện ích nào.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bản TRUNG THỰC</span><span class="lz-nsub"><code>className={cn('px-4 py-2', className)}</code></span></span>
<span class="lz-nbody">Lớp của người gọi được hợp nhất SAU CÙNG và thắng mọi xung đột. Cái prop làm ĐÚNG cái tên nó hứa, với MỌI đầu vào có thể. Đây là bản có thể ghi tài liệu được.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">bản TUNG ĐỒNG XU</span><span class="lz-nsub"><code>className={&#96;px-4 py-2 \${className}&#96;}</code></span></span>
<span class="lz-nbody">Lớp của người gọi có thắng hay không tuỳ vào thứ tự phát sinh của hai tiện ích tình cờ đụng nhau. <code>px-8</code> THUA <code>px-4</code>; <code>mt-8</code> THẮNG <code>mt-32</code>. Cùng một mã, kết quả khác nhau theo từng đầu vào.</span>
</div>
</div>

<h3>Vì sao đáng vá cả ở những chỗ hôm nay chưa hỏng</h3>
<p>Cú hỏng có một hình dạng cụ thể và khó chịu:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">không lỗi lúc dựng</span><span class="lz-lnote">chuỗi mẫu là TypeScript hợp lệ và JSX hợp lệ. <code>tsc</code> hoàn toàn vui vẻ</span></div>
<div class="lz-layer"><span class="lz-lname">không lỗi lint</span><span class="lz-lnote"><code>eslint-plugin-tailwindcss</code> THẤY được xung đột tĩnh trong một chuỗi nguyên văn, nhưng xung đột này chỉ TỒN TẠI sau khi nội suy lúc CHẠY. Nó vô hình với một bộ lint về mặt CẤU TRÚC</span></div>
<div class="lz-layer"><span class="lz-lname">không lỗi lúc chạy</span><span class="lz-lnote">thuộc tính lớp dựng ra ĐÚNG như đã viết. DOM đúng. Chỉ có kiểu dáng ĐƯỢC TÍNH là sai</span></div>
<div class="lz-layer"><span class="lz-lname">trông ĐÚNG trong DevTools</span><span class="lz-lnote">cái lớp CÓ trên thẻ. Bạn phải mở bảng Styles và ĐỂ Ý khai báo bị gạch ngang mới thấy có gì sai</span></div>
<div class="lz-layer"><span class="lz-lname">nó CHẬP CHỜN theo đầu vào</span><span class="lz-lnote">cùng một component chạy với <code>mt-4</code> và hỏng với <code>px-8</code>. Nên nó QUA cái test người ta viết và HỎNG ở ca người khác gặp</span></div>
</div>

<div class="callout ok">
<p><strong>Cuộc di trú vừa MÁY MÓC vừa AN TOÀN.</strong> Thay <code>&#96;a b \${c}&#96;</code> bằng <code>cn('a b', c)</code> là BẢO TOÀN hành vi ở mọi ca không có xung đột, và SỬA hành vi ở mọi ca có. KHÔNG có kịch bản nào mà chuỗi mẫu đúng còn <code>cn()</code> sai. Điều đó khiến đây là một cú tái cấu trúc HIẾM hoi thật sự không có nhược điểm nào ngoài kích thước diff — nên chính sách hợp lý là di trú 62 component có prop <code>className</code> TRƯỚC rồi để phần còn lại theo sau khi có dịp.</p>
</div>

<h3>Làm cho cái luật CƯỠNG CHẾ ĐƯỢC</h3>
<p>Một quy ước dựa vào việc GHI NHỚ là một quy ước sẽ MỤC — con số 76% ở đây chính là bằng chứng, vì <code>cn()</code> CÓ tồn tại và được dùng 197 lần, nên đội ngũ BIẾT về nó. Cách vá là làm cho bản SAI KHÓ viết:</p>

<pre><code class="language-js">// .eslintrc — canh bao chuoi mau trong className
'no-restricted-syntax': ['warn', {
  selector: 'JSXAttribute[name.name="className"] &gt; JSXExpressionContainer &gt; TemplateLiteral',
  message: 'Dung cn() de xung dot Tailwind duoc phan giai; chuoi mau KHONG hop nhat.',
}],
</code></pre>

<p>Khởi động nó ở mức <code>warn</code> với 631 cái hiện có như một khoản NỢ được chấp nhận, và đặt <code>error</code> cho mã MỚI. Một luật làm HỎNG bản dựng ngay ngày đầu với 631 vi phạm sẵn có thì sẽ bị TẮT vào ngày thứ hai.</p>

<div class="pitfall">
<p><strong>Bẫy — cho rằng chỉ mình <code>clsx</code> là đủ.</strong> <code>clsx</code> và <code>classnames</code> xử lý điều kiện rất gọn và <em>KHÔNG</em> hề phân giải xung đột Tailwind — chúng NỐI chuỗi. <code>clsx('px-4', 'px-8')</code> trả về chuỗi <code>"px-4 px-8"</code>, thứ có CHÍNH XÁC cùng vấn đề với chuỗi mẫu. Hàm <code>cn()</code> của kho này bọc <code>clsx</code> trong <code>twMerge</code> CHÍNH VÌ hai cái làm hai việc khác nhau. Một kho mã dùng <code>clsx</code> trần để soạn lớp thì PHƠI NHIỄM y như một kho dùng chuỗi mẫu.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Hãy ĐO mức phơi nhiễm thay vì phỏng đoán nó — kho mã này soạn lớp động 828 lần và chỉ 197 lần đi qua bộ phân giải xung đột, nên 76% cách soạn động của nó chỉ cách cú hỏng âm thầm ĐÚNG MỘT tiện ích cạnh tranh, và 62 component nhận prop <code>className</code> là chỗ chuyện đó quan trọng nhất.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tailwind-merge — README</span><span class="lc-sub">github.com/dcastil/tailwind-merge — nó phân giải cái gì, tốn cái gì, và lời khẳng định tường minh rằng chỉ mình <code>clsx</code> KHÔNG làm việc này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">clsx — README</span><span class="lc-sub">github.com/lukeed/clsx — nửa làm-phẳng-điều-kiện của <code>cn()</code>. Đọc API của nó thì rõ nó là một bộ dựng CHUỖI không hề biết gì về CSS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ESLint — no-restricted-syntax</span><span class="lc-sub">eslint.org/docs/latest/rules/no-restricted-syntax — luật selector-AST dùng bên trên để làm khuôn mẫu không-an-toàn HIỆN RA lúc review.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">TypeScript — khai kiểu cho prop className một cách trung thực</span><span class="lc-sub">/courses/typescript/learn${REF} — hợp đồng prop của component, và vì sao một prop mà HÀNH VI phụ thuộc vào GIÁ TRỊ của nó là một hợp đồng hệ kiểu KHÔNG diễn đạt được.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — tailwind-merge restores last-wins|||3.4 — tailwind-merge khôi phục luật cái-sau-thắng',
      slug: 'tw-3-4-twmerge',
      type: 'VIDEO',
      description: 'Cùng mười một lớp `mt-*`: thô thì `mt-8` thắng, qua `cn()` thì `mt-32` thắng — cái viết CUỐI. Và nó hiểu cả TAXONOMY: `text-sm text-red-500` giữ CẢ HAI vì một cái là cỡ chữ, một cái là màu. Giá: 1,26 micro-giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>tailwind-merge restores last-wins</h2>
<p class="lead">Three lessons have established a problem. This one is the solution, and it is a library rather than a technique — because resolving these conflicts correctly requires knowing Tailwind's entire property taxonomy, which is not something you want to hand-roll.</p>

<h3>The same eleven classes, both ways</h3>
<pre><code class="language-js">import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
const cn = (...i) =&gt; twMerge(clsx(i));

cn('mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32');
</code></pre>

<div class="out">Chuoi tho, Tailwind quyet dinh:   mt-8     (thu tu phat sinh)
Qua cn(), twMerge quyet dinh:     mt-32    (VIET CUOI CUNG)
</div>

<p>That is the whole value proposition. <code>twMerge</code> parses the string, identifies which classes target the same CSS property, discards all but the last, and returns a string with no conflicts left in it. The class you wrote last wins — the rule everyone already expected.</p>

<h3>It understands the taxonomy, not just prefixes</h3>
<p>The naive implementation would group by prefix, and that would be wrong in both directions. Measure what it actually does:</p>

<div class="out">"p-2 p-8"                     -> "p-8"                          # cung thuoc tinh
"px-4 p-8"                    -> "p-8"                          # biet p BAO px
"mt-4 mb-4 my-8"              -> "my-8"                         # biet my nuot mt+mb
"top-0 inset-0"               -> "inset-0"                      # biet inset bao top
"w-4 size-8"                  -> "size-8"                       # biet size bao w
"block flex"                  -> "flex"                         # cung 'display'
"border border-2"             -> "border-2"                     # cung 'border-width'
"text-[11px] text-sm"         -> "text-sm"                      # tuy y vs thang

"text-sm text-red-500"        -> "text-sm text-red-500"         # GIU CA HAI
"bg-red-500 bg-gradient-to-r" -> "bg-red-500 bg-gradient-to-r"  # GIU CA HAI
</div>

<p>Read the last two rows carefully — they are the reason this cannot be a regex. <code>text-sm</code> and <code>text-red-500</code> share a prefix but set <em>different</em> CSS properties (<code>font-size</code> and <code>color</code>), so both are kept. Same for <code>bg-red-500</code> (a <code>background-color</code>) and <code>bg-gradient-to-r</code> (a <code>background-image</code>). A prefix-based implementation would delete one of each pair and break your styling.</p>

<div class="callout ok">
<p><strong>And it works in the other direction too.</strong> <code>px-4 p-8</code> → <code>p-8</code> requires knowing that the <em>broader</em> utility supersedes the narrower one when written later. <code>mt-4 mb-4 my-8</code> → <code>my-8</code> requires knowing <code>my</code> covers both. This is a genuine model of Tailwind's property structure, maintained alongside Tailwind's releases — which is exactly why hand-rolling it is a bad idea.</p>
</div>

<h3>The cost, measured</h3>
<p>The reasonable objection is performance: this is string parsing on every render. Measure it rather than speculating:</p>

<pre><code class="language-js">const t0 = process.hrtime.bigint();
for (let i = 0; i &lt; 10000; i++)
  twMerge('px-4 py-2 rounded text-sm font-medium', 'px-8 text-lg');
const t1 = process.hrtime.bigint();
</code></pre>

<div class="out">10.000 lan hop nhat: 12,56 ms
=> 1,26 micro-giay moi lan
</div>

<p><strong>1.26 microseconds.</strong> For scale: a React component render is typically tens to hundreds of microseconds, and one animation frame is 16,667 µs. Merging every one of this repository's 828 dynamic class compositions on a single render would cost about <strong>1.04 ms</strong> — and that is the absolute worst case, since they are not all on screen at once.</p>

<div class="callout warn">
<p><strong>Performance is not the reason to avoid it.</strong> The library also caches results by input string, so repeated renders with the same classes are cheaper than the figure above. If someone objects on performance grounds, the honest answer is the measurement: one microsecond, cached, against a class of bug that produces silent visual failures. That trade is not close.</p>
</div>

<h3>The pattern for a component that accepts classes</h3>
<pre><code class="language-jsx">import { cn } from '@/lib/utils';

export function Button({ className, variant = 'primary', ...props }) {
  return (
    &lt;button
      className={cn(
        'inline-flex items-center rounded-lg px-4 py-2 font-medium',  // base
        variant === 'primary' &amp;&amp; 'bg-blue-600 text-white',           // conditional
        variant === 'ghost' &amp;&amp; 'bg-transparent text-blue-600',
        className,                                                    // caller LAST
      )}
      {...props}
    /&gt;
  );
}
</code></pre>

<p>Two rules make this correct, and they are the whole convention:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">the caller's <code>className</code> goes LAST</span><span class="lz-lnote">it is the outermost override, so it must be able to beat everything the component set. Putting it anywhere else silently limits what callers can customise</span></div>
<div class="lz-layer"><span class="lz-lname">pass separate arguments, not one concatenated string</span><span class="lz-lnote"><code>cn('a', b, c)</code> not <code>cn(&#96;a \${b} \${c}&#96;)</code> — the second form does still work, but building the string yourself defeats the readability that made the pattern worth adopting</span></div>
<div class="lz-layer"><span class="lz-lname">conditionals as <code>cond &amp;&amp; 'classes'</code></span><span class="lz-lnote"><code>clsx</code> drops <code>false</code>, <code>null</code> and <code>undefined</code> automatically, so this is safe and reads well. No ternary with an empty string needed</span></div>
</div>

<h3>What it does not do</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">it cannot see custom utilities</span><span class="lz-nsub">unless you configure it</span></span>
<span class="lz-nbody">A utility you added via a plugin or a custom class in <code>@layer utilities</code> is unknown to the default config — it will be passed through rather than merged. <code>extendTailwindMerge()</code> teaches it your additions; without that, custom utilities silently keep the old conflicting behaviour.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">it cannot fix static conflicts you wrote</span><span class="lz-nsub"><code>class="mt-2 mt-10"</code> in plain JSX</span></span>
<span class="lz-nbody">If the string never passes through <code>cn()</code>, nothing merges it. Static conflicts are the linter's job (lesson 3.2); <code>twMerge</code> only helps where classes are composed at runtime.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Trap — adding <code>cn()</code> to a component and assuming the caller's class now wins.</strong> It only wins if it is passed <em>last</em>. <code>cn(className, 'px-4')</code> compiles fine, merges correctly, and does the exact opposite of what was intended — the component's own class beats the caller's every time. This is a review-catchable mistake that behaves identically to having no merge at all, so it survives a superficial "we use cn() everywhere" audit.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>tailwind-merge</code> restores the rule everyone expected — last written wins — by parsing the string against a real model of Tailwind's property taxonomy, so it knows <code>p</code> contains <code>px</code> and that <code>text-sm</code> and <code>text-red-500</code> do not conflict, and it costs 1.26 µs, which is not a reason to avoid it.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tailwind-merge — README and configuration</span><span class="lc-sub">github.com/dcastil/tailwind-merge — the conflict groups it knows, its cache behaviour, and <code>extendTailwindMerge()</code> for teaching it custom utilities.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">shadcn/ui — the cn() convention</span><span class="lc-sub">ui.shadcn.com/docs/installation — where the <code>cn = twMerge(clsx(...))</code> helper in this repo comes from. Worth reading for how consistently it puts <code>className</code> last in every component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">class-variance-authority (cva)</span><span class="lc-sub">cva.style — the next step up when a component has several variants and sizes: it makes the variant matrix declarative and composes with <code>twMerge</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 4 — component APIs that survive customisation</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — beyond merging: when to expose a <code>className</code> prop at all, versus named variants that cannot be misused.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>tailwind-merge khôi phục luật cái-sau-thắng</h2>
<p class="lead">Ba bài đã dựng lên một VẤN ĐỀ. Bài này là LỜI GIẢI, và nó là một THƯ VIỆN chứ không phải một kỹ thuật — vì phân giải các xung đột này cho đúng đòi biết TRỌN taxonomy thuộc tính của Tailwind, thứ bạn không muốn tự viết tay.</p>

<h3>Cùng mười một lớp ấy, theo cả hai đường</h3>
<pre><code class="language-js">import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
const cn = (...i) =&gt; twMerge(clsx(i));

cn('mt-1 mt-2 mt-3 mt-4 mt-8 mt-10 mt-12 mt-16 mt-20 mt-24 mt-32');
</code></pre>

<div class="out">Chuoi tho, Tailwind quyet dinh:   mt-8     (thu tu phat sinh)
Qua cn(), twMerge quyet dinh:     mt-32    (VIET CUOI CUNG)
</div>

<p>Đó là toàn bộ giá trị nó mang lại. <code>twMerge</code> PHÂN TÍCH chuỗi, xác định lớp nào nhắm cùng một thuộc tính CSS, VỨT hết trừ cái cuối, rồi trả về một chuỗi KHÔNG còn xung đột nào trong đó. Lớp bạn viết CUỐI thắng — đúng cái luật ai cũng đã trông đợi.</p>

<h3>Nó hiểu TAXONOMY, không chỉ tiền tố</h3>
<p>Cách cài đặt ngây thơ sẽ gom theo TIỀN TỐ, và cách đó sẽ SAI theo cả hai chiều. Hãy đo xem nó THẬT SỰ làm gì:</p>

<div class="out">"p-2 p-8"                     -> "p-8"                          # cung thuoc tinh
"px-4 p-8"                    -> "p-8"                          # biet p BAO px
"mt-4 mb-4 my-8"              -> "my-8"                         # biet my nuot mt+mb
"top-0 inset-0"               -> "inset-0"                      # biet inset bao top
"w-4 size-8"                  -> "size-8"                       # biet size bao w
"block flex"                  -> "flex"                         # cung 'display'
"border border-2"             -> "border-2"                     # cung 'border-width'
"text-[11px] text-sm"         -> "text-sm"                      # tuy y vs thang

"text-sm text-red-500"        -> "text-sm text-red-500"         # GIU CA HAI
"bg-red-500 bg-gradient-to-r" -> "bg-red-500 bg-gradient-to-r"  # GIU CA HAI
</div>

<p>Đọc HAI HÀNG CUỐI cho kỹ — chúng là lý do cái này KHÔNG THỂ là một biểu thức chính quy. <code>text-sm</code> và <code>text-red-500</code> chung tiền tố nhưng đặt <em>HAI</em> thuộc tính CSS khác nhau (<code>font-size</code> và <code>color</code>), nên GIỮ cả hai. Tương tự với <code>bg-red-500</code> (một <code>background-color</code>) và <code>bg-gradient-to-r</code> (một <code>background-image</code>). Một cách cài dựa trên tiền tố sẽ XOÁ một cái ở mỗi cặp và làm vỡ kiểu dáng của bạn.</p>

<div class="callout ok">
<p><strong>Và nó chạy được cả chiều ngược lại.</strong> <code>px-4 p-8</code> → <code>p-8</code> đòi biết rằng tiện ích <em>RỘNG HƠN</em> thay thế cái hẹp hơn khi được viết SAU. <code>mt-4 mb-4 my-8</code> → <code>my-8</code> đòi biết <code>my</code> BAO cả hai. Đây là một MÔ HÌNH thật về cấu trúc thuộc tính của Tailwind, được bảo trì song song với các bản phát hành của Tailwind — chính xác là lý do tự viết tay nó là một ý tồi.</p>
</div>

<h3>Cái GIÁ, đo được</h3>
<p>Lời phản đối hợp lý là HIỆU NĂNG: đây là phân tích chuỗi ở MỌI lần dựng. Hãy ĐO nó thay vì suy đoán:</p>

<pre><code class="language-js">const t0 = process.hrtime.bigint();
for (let i = 0; i &lt; 10000; i++)
  twMerge('px-4 py-2 rounded text-sm font-medium', 'px-8 text-lg');
const t1 = process.hrtime.bigint();
</code></pre>

<div class="out">10.000 lan hop nhat: 12,56 ms
=> 1,26 micro-giay moi lan
</div>

<p><strong>1,26 micro-giây.</strong> Để so sánh: một lần dựng component React thường tốn hàng chục tới hàng trăm micro-giây, và một khung hình hoạt ảnh là 16.667 µs. Hợp nhất TOÀN BỘ 828 cách soạn lớp động của kho này trong MỘT lần dựng sẽ tốn khoảng <strong>1,04 ms</strong> — và đó là ca TỆ NHẤT tuyệt đối, vì chúng không cùng nằm trên màn hình một lúc.</p>

<div class="callout warn">
<p><strong>Hiệu năng KHÔNG phải lý do để tránh nó.</strong> Thư viện còn CACHE kết quả theo chuỗi đầu vào, nên các lần dựng lặp lại với cùng lớp còn rẻ hơn con số bên trên. Nếu ai đó phản đối vì lý do hiệu năng, câu trả lời trung thực là SỐ ĐO: một micro-giây, có cache, đổi lấy việc chặn một lớp bọ đẻ ra hỏng hóc thị giác âm thầm. Cuộc đổi chác ấy không hề sít sao.</p>
</div>

<h3>Khuôn mẫu cho một component nhận lớp</h3>
<pre><code class="language-jsx">import { cn } from '@/lib/utils';

export function Button({ className, variant = 'primary', ...props }) {
  return (
    &lt;button
      className={cn(
        'inline-flex items-center rounded-lg px-4 py-2 font-medium',  // nen
        variant === 'primary' &amp;&amp; 'bg-blue-600 text-white',           // dieu kien
        variant === 'ghost' &amp;&amp; 'bg-transparent text-blue-600',
        className,                                                    // nguoi goi CUOI
      )}
      {...props}
    /&gt;
  );
}
</code></pre>

<p>Hai luật làm cho cái này ĐÚNG, và chúng là toàn bộ quy ước:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>className</code> của người gọi đặt CUỐI</span><span class="lz-lnote">nó là cú đè NGOÀI CÙNG, nên nó phải thắng được MỌI thứ component đặt ra. Đặt nó ở chỗ khác thì âm thầm GIỚI HẠN cái người gọi tuỳ biến được</span></div>
<div class="lz-layer"><span class="lz-lname">truyền các ĐỐI SỐ RIÊNG, không phải một chuỗi đã nối</span><span class="lz-lnote"><code>cn('a', b, c)</code> chứ không phải <code>cn(&#96;a \${b} \${c}&#96;)</code> — dạng sau VẪN chạy được, nhưng tự dựng chuỗi thì đánh mất tính đọc-được vốn là lý do khuôn mẫu này đáng nhận</span></div>
<div class="lz-layer"><span class="lz-lname">điều kiện viết dạng <code>cond &amp;&amp; 'các lớp'</code></span><span class="lz-lnote"><code>clsx</code> tự động BỎ <code>false</code>, <code>null</code> và <code>undefined</code>, nên cách này an toàn và đọc xuôi. Không cần một toán tử ba ngôi với chuỗi rỗng</span></div>
</div>

<h3>Cái nó KHÔNG làm</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nó KHÔNG thấy tiện ích tuỳ biến</span><span class="lz-nsub">trừ khi bạn cấu hình cho nó</span></span>
<span class="lz-nbody">Một tiện ích bạn thêm qua plugin hay một lớp tuỳ biến trong <code>@layer utilities</code> là VÔ DANH với config mặc định — nó sẽ được cho đi qua chứ không được hợp nhất. <code>extendTailwindMerge()</code> dạy nó các phần bạn thêm; không có bước đó, tiện ích tuỳ biến âm thầm GIỮ NGUYÊN hành vi xung đột cũ.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">nó KHÔNG vá được xung đột TĨNH bạn viết ra</span><span class="lz-nsub"><code>class="mt-2 mt-10"</code> trong JSX thuần</span></span>
<span class="lz-nbody">Nếu chuỗi KHÔNG BAO GIỜ đi qua <code>cn()</code>, không gì hợp nhất nó cả. Xung đột tĩnh là việc của bộ LINT (bài 3.2); <code>twMerge</code> chỉ giúp ở chỗ lớp được soạn LÚC CHẠY.</span>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm <code>cn()</code> vào một component rồi cho rằng lớp của người gọi giờ đã thắng.</strong> Nó CHỈ thắng nếu được truyền vào <em>CUỐI CÙNG</em>. <code>cn(className, 'px-4')</code> biên dịch ngon lành, hợp nhất đúng đắn, và làm ĐÚNG NGƯỢC LẠI cái được dự định — lớp của chính component thắng lớp của người gọi mọi lần. Đây là một sai sót bắt được lúc review mà hành xử Y HỆT như không có phép hợp nhất nào, nên nó sống sót qua một cuộc soát hời hợt kiểu "chúng ta dùng cn() khắp nơi rồi".</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>tailwind-merge</code> khôi phục cái luật ai cũng trông đợi — viết cuối thì thắng — bằng cách phân tích chuỗi đối chiếu một MÔ HÌNH thật về taxonomy thuộc tính của Tailwind, nên nó biết <code>p</code> bao <code>px</code> và biết <code>text-sm</code> với <code>text-red-500</code> KHÔNG xung đột, và nó tốn 1,26 µs, thứ không phải một lý do để tránh nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">tailwind-merge — README và cấu hình</span><span class="lc-sub">github.com/dcastil/tailwind-merge — các nhóm xung đột nó biết, hành vi cache của nó, và <code>extendTailwindMerge()</code> để dạy nó các tiện ích tuỳ biến.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">shadcn/ui — quy ước cn()</span><span class="lc-sub">ui.shadcn.com/docs/installation — nơi hàm <code>cn = twMerge(clsx(...))</code> trong kho này bắt nguồn. Đáng đọc để thấy nó ĐẶT <code>className</code> ở CUỐI nhất quán đến mức nào trong mọi component.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">class-variance-authority (cva)</span><span class="lc-sub">cva.style — bậc kế tiếp khi một component có vài biến thể và kích cỡ: nó làm ma trận biến thể trở nên KHAI BÁO và ghép được với <code>twMerge</code>.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 4 — API component sống sót qua tuỳ biến</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — xa hơn phép hợp nhất: khi nào NÊN phơi ra một prop <code>className</code> chút nào, đối lập với các biến thể có tên KHÔNG thể dùng sai.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — The escalation ladder, and where !important belongs|||3.5 — Cái thang leo thang, và chỗ của !important',
      slug: 'tw-3-5-important',
      type: 'VIDEO',
      description: 'Đo thật trong kho này: 11 lượt dùng tiền tố `!` trên 26.343 thuộc tính lớp (0,04%), nhưng 38 lượt `!important` trong globals.css. Sự bất đối xứng ấy nói cho bạn biết chỗ nào áp lực CASCADE thật sự dồn về.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>The escalation ladder, and where !important belongs</h2>
<p class="lead">Every conflict in this chapter has a correct fix and a fast fix, and <code>!important</code> is almost always the fast one. This lesson gives an ordered ladder to climb, and measures how a real codebase actually behaves — which turns out to be disciplined in one place and not in another.</p>

<h3>What the modifier compiles to</h3>
<pre><code class="language-html">&lt;div class="!p-8 p-2 hover:!text-red-500"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.\\!p-8 { padding: 2rem !important }

.p-2  { padding: 0.5rem }

.hover\\:\\!text-red-500:hover {
  --tw-text-opacity: 1 !important;
  color: rgb(239 68 68 / var(--tw-text-opacity)) !important
}
</div>

<p>The <code>!</code> prefix appends <code>!important</code> to every declaration the utility produces. Note the third rule: a utility that emits <em>two</em> declarations gets <code>!important</code> on both. And note the position — <code>hover:!text-red-500</code>, with the <code>!</code> after the variant prefix, not before it.</p>

<div class="callout ok">
<p><strong>What <code>!important</code> actually does.</strong> It does not raise specificity. It moves the declaration into a higher <em>cascade origin</em> — a separate, earlier-resolved layer of the cascade that beats all normal declarations regardless of their specificity. That is why it always wins, and also why the only thing that beats it is another <code>!important</code> with higher specificity. There is no rung above it.</p>
</div>

<h3>The ladder, in the order you should climb it</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">remove the conflict</span><span class="lz-d">Two utilities for the same property at the same scope is a bug (lesson 3.2). Delete the one you did not mean. This resolves the majority of cases and is the only fix that leaves the code simpler than it found it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">merge instead of concatenate</span><span class="lz-d">If the classes are composed at runtime, route them through <code>cn()</code> (lesson 3.4). Last-written wins, which is what the code already looked like it did.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">check the layer</span><span class="lz-d">If a hand-written CSS rule is winning, check two things: its specificity, and whether it sits outside any <code>@layer</code>. Chapter 7 measures this repo — 88% of its CSS is unlayered — and works out which of those two is actually deciding, because the fix differs.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">then, and only then, <code>!</code></span><span class="lz-d">When you genuinely cannot change the losing side — third-party CSS you do not control, a widget that injects inline styles — <code>!p-8</code> is the correct tool. Leave a comment saying which rule you are overriding, because the next reader cannot see it from here.</span></div>
</div>

<h3>How this codebase actually behaves</h3>
<pre><code class="language-bash">$ grep -rhoE 'className="[^"]*"' src --include="*.tsx" | tr ' ' '\\n' | grep -c '^!'
$ grep -c '!important' src/app/globals.css
</code></pre>

<div class="out">11    # tien to ! trong 26.343 thuoc tinh lop  => 0,04%
38    # !important trong globals.css
</div>

<p>An interesting asymmetry. On the utility side the discipline is near-total: <strong>11 uses out of 26,343</strong> class attributes, four hundredths of one percent. On the hand-written CSS side, <strong>38</strong> — more than three times as many, in a single file.</p>

<div class="callout warn">
<p><strong>What that asymmetry probably means.</strong> Recall the measurement from Section 0 that will be developed in Chapter 7: 3,945 of <code>globals.css</code>'s 4,462 lines sit <em>outside</em> any <code>@layer</code>. Rules outside a layer already beat all layered utilities without needing <code>!important</code> at all. So those 38 are unlikely to be winning fights against Tailwind — they are far more likely to be fighting <em>each other</em>, or third-party CSS. That is a different and more concerning problem, because <code>!important</code> vs <code>!important</code> resolves on specificity and has no further escape hatch.</p>
</div>

<h3>The legitimate uses</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">third-party CSS you cannot edit</span><span class="lz-lnote">a date picker, an editor, an embedded widget shipping its own stylesheet with high specificity. You do not own the losing side, so you cannot fix it there</span></div>
<div class="lz-layer"><span class="lz-lname">overriding inline styles</span><span class="lz-lnote">a library that sets <code>style="..."</code> from JavaScript. Inline styles beat all normal rules, so <code>!important</code> in a stylesheet is the ONLY thing that can override them — this is the textbook case the feature exists for</span></div>
<div class="lz-layer"><span class="lz-lname">print stylesheets</span><span class="lz-lnote"><code>print:!hidden</code> to guarantee something is gone on paper. Deliberate, narrow, and unlikely to be fought over</span></div>
<div class="lz-layer"><span class="lz-lname">a one-line stopgap with a dated comment</span><span class="lz-lnote">shipping a fix now and doing it properly later is legitimate — as long as the comment says which rule is being beaten and why, so the cleanup is possible</span></div>
</div>

<h3>The illegitimate use, which is most of them</h3>
<p>The characteristic bad case is reaching for <code>!</code> without having identified what is winning. That is not a fix — it is an assertion that you would rather not know. And it compounds:</p>

<pre><code class="language-css">/* week 1 */          .card { padding: 1rem }
/* week 3 */          .card { padding: 2rem !important }        /* "the utility was winning" */
/* week 7 */          .modal .card { padding: 1rem !important } /* "week 3 broke modals" */
/* week 12 */         &lt;div class="!p-0"&gt;                        /* "nothing else worked" */
</code></pre>

<p>Each step is locally reasonable and the result is a file where nobody can predict what any element's padding will be without opening DevTools. The ladder above exists to stop step one.</p>

<div class="callout ok">
<p><strong>The diagnostic that replaces the guess.</strong> Before adding <code>!</code>, open DevTools, select the element, and read the Styles panel top to bottom. The winning rule is the topmost non-struck-through declaration, and its selector is right there. Now you know whether you are fighting a utility (fix with <code>cn()</code>), your own CSS (fix the layer), or something you do not control (<code>!</code> is correct). Thirty seconds of looking replaces an irreversible escalation.</p>
</div>

<h3>The config-level alternative, and why not to use it</h3>
<p>Tailwind can mark <em>every</em> utility important via <code>important: true</code> in the config. It exists for one scenario: incrementally adopting Tailwind inside an app with a large legacy stylesheet you cannot remove. Outside that migration case it is a trap — it makes every utility unoverridable, so component composition stops working entirely and the only remaining tool is inline styles.</p>

<div class="pitfall">
<p><strong>Trap — using <code>!</code> to beat a rule that is only winning because of layer position.</strong> This is the most common wasted escalation. A hand-written rule outside <code>@layer</code> beats your utility for structural reasons, and <code>!p-8</code> does fix it — but it fixes one element, and the same structural problem is still there for every other utility in the app. Moving the rule into <code>@layer components</code> fixes all of them at once. Chapter 7 covers this; the point here is that <code>!</code> can mask a systemic problem as a local one.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>!important</code> moves a declaration into a higher cascade origin so nothing normal can beat it, which makes it a genuine tool for CSS you do not control and a trap everywhere else — climb the ladder in order (remove the conflict, merge, check the layer, then escalate), and note that this codebase is disciplined on the utility side at 0.04% while its hand-written CSS reaches for it 38 times.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — !important and cascade origins</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/important — the precise statement that <code>!important</code> changes cascade origin rather than specificity, which is why it is unconditional.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — the important modifier</span><span class="lc-sub">tailwindcss.com/docs/configuration#important — the <code>!</code> prefix, the config-level <code>important: true</code>, and the explicit note that the latter is for legacy-migration scenarios.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Cascade layers</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@layer — including the counter-intuitive rule that <code>!important</code> REVERSES layer priority, which is worth knowing before combining the two.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 7 — layers, and the 88% measurement</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — how much of this repository's CSS beats utilities, and whether the cause is specificity or source order. The answer changes what the fix is.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Cái thang leo thang, và chỗ của !important</h2>
<p class="lead">Mọi xung đột trong chương này đều có một cú vá ĐÚNG và một cú vá NHANH, và <code>!important</code> gần như luôn là cái nhanh. Bài này đưa ra một CÁI THANG có thứ tự để leo, và đo xem một kho mã thật hành xử ra sao — hoá ra KỶ LUẬT ở một chỗ và KHÔNG ở chỗ khác.</p>

<h3>Cái bổ từ ấy biên dịch ra gì</h3>
<pre><code class="language-html">&lt;div class="!p-8 p-2 hover:!text-red-500"&gt;&lt;/div&gt;
</code></pre>

<div class="out">.\\!p-8 { padding: 2rem !important }

.p-2  { padding: 0.5rem }

.hover\\:\\!text-red-500:hover {
  --tw-text-opacity: 1 !important;
  color: rgb(239 68 68 / var(--tw-text-opacity)) !important
}
</div>

<p>Tiền tố <code>!</code> nối <code>!important</code> vào MỌI khai báo mà tiện ích ấy sản sinh. Để ý quy tắc thứ ba: một tiện ích phát sinh <em>HAI</em> khai báo thì được <code>!important</code> trên CẢ HAI. Và để ý VỊ TRÍ — <code>hover:!text-red-500</code>, với dấu <code>!</code> đặt SAU tiền tố biến thể, không phải trước.</p>

<div class="callout ok">
<p><strong><code>!important</code> THẬT SỰ làm gì.</strong> Nó KHÔNG nâng độ đặc hiệu. Nó DỜI khai báo sang một <em>NGUỒN GỐC CASCADE</em> cao hơn — một tầng riêng, được phân giải sớm hơn, thắng MỌI khai báo thường bất kể độ đặc hiệu của chúng. Đó là lý do nó LUÔN thắng, và cũng là lý do thứ duy nhất thắng được nó là một <code>!important</code> khác có độ đặc hiệu cao hơn. KHÔNG có nấc nào trên nó nữa.</p>
</div>

<h3>Cái thang, theo thứ tự bạn nên leo</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">GỠ cái xung đột</span><span class="lz-d">Hai tiện ích cùng thuộc tính ở cùng phạm vi là một CON BỌ (bài 3.2). Xoá cái bạn không định viết. Cách này giải quyết PHẦN LỚN các ca và là cú vá DUY NHẤT để lại mã đơn giản hơn lúc nó tới.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">HỢP NHẤT thay vì NỐI chuỗi</span><span class="lz-d">Nếu các lớp được soạn lúc chạy, hãy cho chúng đi qua <code>cn()</code> (bài 3.4). Viết-cuối-thắng, đúng cái mà mã VỐN TRÔNG như đang làm.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">kiểm cái LAYER</span><span class="lz-d">Nếu một quy tắc CSS viết tay đang thắng, hãy kiểm HAI thứ: ĐỘ ĐẶC HIỆU của nó, và nó có nằm NGOÀI mọi <code>@layer</code> không. Chương 7 đo kho này — 88% CSS của nó không-layer — và tìm ra cái nào trong hai thứ ấy THẬT SỰ quyết định, vì cú vá KHÁC nhau.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">rồi, và CHỈ khi đó, dùng <code>!</code></span><span class="lz-d">Khi bạn THẬT SỰ không đổi được phía đang thua — CSS bên thứ ba bạn không kiểm soát, một widget bơm inline style — thì <code>!p-8</code> là công cụ ĐÚNG. Hãy để lại một comment nói bạn đang đè quy tắc NÀO, vì người đọc sau không thấy được từ đây.</span></div>
</div>

<h3>Kho mã này THẬT SỰ hành xử ra sao</h3>
<pre><code class="language-bash">$ grep -rhoE 'className="[^"]*"' src --include="*.tsx" | tr ' ' '\\n' | grep -c '^!'
$ grep -c '!important' src/app/globals.css
</code></pre>

<div class="out">11    # tien to ! trong 26.343 thuoc tinh lop  => 0,04%
38    # !important trong globals.css
</div>

<p>Một sự BẤT ĐỐI XỨNG thú vị. Ở phía tiện ích, kỷ luật gần như tuyệt đối: <strong>11 lượt trên 26.343</strong> thuộc tính lớp, bốn phần trăm của một phần trăm. Ở phía CSS viết tay, <strong>38</strong> — nhiều gấp hơn ba lần, trong MỘT file.</p>

<div class="callout warn">
<p><strong>Sự bất đối xứng ấy có lẽ nghĩa là gì.</strong> Nhớ lại phép đo từ Mục 0 sẽ được khai triển ở Chương 7: 3.945 trên 4.462 dòng của <code>globals.css</code> nằm <em>NGOÀI</em> mọi <code>@layer</code>. Quy tắc ngoài layer ĐÃ thắng mọi tiện ích trong layer mà KHÔNG cần <code>!important</code> chút nào. Nên 38 cái đó KHÓ mà đang thắng các cuộc đấu với Tailwind — nhiều khả năng hơn nhiều là chúng đang đánh nhau <em>VỚI NHAU</em>, hoặc với CSS bên thứ ba. Đó là một vấn đề KHÁC và đáng lo hơn, vì <code>!important</code> đấu <code>!important</code> thì phân giải bằng độ đặc hiệu và KHÔNG còn cửa thoát nào nữa.</p>
</div>

<h3>Những cách dùng CHÍNH ĐÁNG</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">CSS bên thứ ba bạn không sửa được</span><span class="lz-lnote">một bộ chọn ngày, một trình soạn thảo, một widget nhúng mang bảng kiểu riêng có độ đặc hiệu cao. Bạn KHÔNG sở hữu phía đang thua, nên không vá ở đó được</span></div>
<div class="lz-layer"><span class="lz-lname">đè lên INLINE STYLE</span><span class="lz-lnote">một thư viện đặt <code>style="..."</code> từ JavaScript. Inline style thắng mọi quy tắc thường, nên <code>!important</code> trong một bảng kiểu là thứ DUY NHẤT đè được chúng — đây là ca sách giáo khoa mà tính năng ấy sinh ra để phục vụ</span></div>
<div class="lz-layer"><span class="lz-lname">bảng kiểu IN</span><span class="lz-lnote"><code>print:!hidden</code> để BẢO ĐẢM thứ gì đó biến mất trên giấy. Có chủ ý, hẹp, và khó bị tranh chấp</span></div>
<div class="lz-layer"><span class="lz-lname">một cú chèn tạm một-dòng có comment ghi ngày</span><span class="lz-lnote">giao cú vá NGAY rồi làm tử tế SAU là chính đáng — miễn là comment nói rõ đang đè quy tắc nào và vì sao, để việc dọn dẹp CÓ THỂ xảy ra</span></div>
</div>

<h3>Cách dùng KHÔNG chính đáng, tức phần lớn chúng</h3>
<p>Ca xấu ĐẶC TRƯNG là với tay tới <code>!</code> mà CHƯA xác định được cái gì đang thắng. Đó KHÔNG phải một cú vá — nó là một lời tuyên bố rằng bạn thà không biết. Và nó CỘNG DỒN:</p>

<pre><code class="language-css">/* tuan 1 */   .card { padding: 1rem }
/* tuan 3 */   .card { padding: 2rem !important }        /* "tien ich dang thang" */
/* tuan 7 */   .modal .card { padding: 1rem !important } /* "tuan 3 lam vo modal" */
/* tuan 12 */  &lt;div class="!p-0"&gt;                        /* "khong con cach nao" */
</code></pre>

<p>Mỗi bước hợp lý một cách CỤC BỘ và kết quả là một file mà KHÔNG AI đoán được padding của bất kỳ thẻ nào nếu không mở DevTools. Cái thang bên trên tồn tại để CHẶN bước một.</p>

<div class="callout ok">
<p><strong>Phép chẩn đoán thay thế cho việc ĐOÁN.</strong> Trước khi thêm <code>!</code>, hãy mở DevTools, chọn cái thẻ, và đọc bảng Styles từ trên xuống. Quy tắc ĐANG THẮNG là khai báo trên cùng KHÔNG bị gạch ngang, và selector của nó nằm ngay đó. Giờ bạn BIẾT mình đang đánh nhau với một tiện ích (vá bằng <code>cn()</code>), với CSS của chính bạn (vá cái layer), hay với thứ bạn không kiểm soát (<code>!</code> là đúng). Ba mươi giây NHÌN thay thế một cú leo thang KHÔNG ĐẢO NGƯỢC ĐƯỢC.</p>
</div>

<h3>Lựa chọn ở cấp CONFIG, và vì sao đừng dùng</h3>
<p>Tailwind có thể đánh dấu <em>MỌI</em> tiện ích là important qua <code>important: true</code> trong config. Nó tồn tại cho MỘT kịch bản: nhận Tailwind vào DẦN DẦN bên trong một ứng dụng có một bảng kiểu di sản lớn mà bạn không gỡ được. Ngoài ca di trú ấy nó là một cái bẫy — nó làm MỌI tiện ích không đè được, nên việc soạn component NGỪNG hoạt động hoàn toàn và công cụ duy nhất còn lại là inline style.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>!</code> để thắng một quy tắc mà nó CHỈ thắng nhờ vị trí LAYER.</strong> Đây là cú leo thang lãng phí phổ biến nhất. Một quy tắc viết tay ngoài <code>@layer</code> thắng tiện ích của bạn vì lý do CẤU TRÚC, và <code>!p-8</code> CÓ vá được — nhưng nó vá MỘT cái thẻ, còn cùng vấn đề cấu trúc ấy VẪN NGUYÊN cho mọi tiện ích khác trong ứng dụng. Dời quy tắc vào <code>@layer components</code> vá TẤT CẢ chúng cùng lúc. Chương 7 bao chuyện này; điểm ở đây là <code>!</code> có thể NGUỴ TRANG một vấn đề hệ thống thành một vấn đề cục bộ.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>!important</code> dời một khai báo sang một NGUỒN GỐC cascade cao hơn nên không gì thường thắng được nó, thứ khiến nó là một công cụ CHÍNH ĐÁNG cho CSS bạn không kiểm soát và là một cái bẫy ở mọi nơi khác — hãy leo thang theo THỨ TỰ (gỡ xung đột, hợp nhất, kiểm layer, rồi mới leo), và lưu ý kho mã này kỷ luật ở phía tiện ích với 0,04% trong khi CSS viết tay của nó với tay tới nó 38 lần.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — !important và nguồn gốc cascade</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/important — lời khẳng định chính xác rằng <code>!important</code> đổi NGUỒN GỐC cascade chứ không đổi độ đặc hiệu, đó là lý do nó VÔ ĐIỀU KIỆN.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Tailwind docs — bổ từ important</span><span class="lc-sub">tailwindcss.com/docs/configuration#important — tiền tố <code>!</code>, tuỳ chọn cấp config <code>important: true</code>, và ghi chú tường minh rằng cái sau dành cho kịch bản DI TRÚ di sản.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Cascade layers</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/@layer — gồm cả luật PHẢN TRỰC GIÁC rằng <code>!important</code> ĐẢO NGƯỢC thứ tự ưu tiên của layer, đáng biết trước khi kết hợp hai thứ.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 7 — layer, và phép đo 88%</span><span class="lc-sub">/courses/tailwind-css/learn${REF} — vì sao phần lớn CSS của kho này thắng tiện ích về mặt cấu trúc, và dời nó vào một layer sẽ đổi điều gì.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra Chương 3',
      slug: 'tw-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu, mười hai phút. Về xung đột: thứ tự viết vô nghĩa, mt-8 thắng mt-32, 76% phơi nhiễm đo được, tailwind-merge tốn 1,26 µs, và cái thang leo thang.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>What Chapter 3 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter is the one people get wrong in production, so the questions are deliberately the shapes that appear in real code review.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">3.1 — order is meaningless</span><span class="lz-lnote"><code>p-2 p-8</code> and <code>p-8 p-2</code> produce byte-identical CSS. <code>class</code> is an unordered SET of references; the cascade uses stylesheet position</span></div>
<div class="lz-layer"><span class="lz-lname">3.2 — two halves</span><span class="lz-lnote">across groups: designed hierarchy (whole → axis → side), trust it. Within a group: lexicographic string sort, so <code>mt-8</code> beats <code>mt-32</code>. Never rely on it</span></div>
<div class="lz-layer"><span class="lz-lname">3.3 — exposure</span><span class="lz-lnote">197 <code>cn()</code> vs 631 interpolating template literals = 76% unprotected. 62 components take a <code>className</code> prop</span></div>
<div class="lz-layer"><span class="lz-lname">3.4 — the fix</span><span class="lz-lnote"><code>twMerge</code> restores last-wins, knows <code>p</code> contains <code>px</code>, keeps <code>text-sm</code> AND <code>text-red-500</code>, costs 1.26 µs</span></div>
<div class="lz-layer"><span class="lz-lname">3.5 — the ladder</span><span class="lz-lnote">remove the conflict → merge → check the layer → then <code>!</code>. This repo: 0.04% on utilities, 38 in globals.css</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Chương 3 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này là chương người ta làm SAI ở production, nên các câu hỏi cố ý mang đúng hình dạng xuất hiện trong review mã thật.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">3.1 — thứ tự vô nghĩa</span><span class="lz-lnote"><code>p-2 p-8</code> và <code>p-8 p-2</code> đẻ ra CSS giống hệt từng byte. <code>class</code> là một TẬP tham chiếu không thứ tự; cascade dùng VỊ TRÍ trong bảng kiểu</span></div>
<div class="lz-layer"><span class="lz-lname">3.2 — hai nửa</span><span class="lz-lnote">giữa các nhóm: trật tự được thiết kế (toàn phần → trục → cạnh), tin được. Trong một nhóm: sắp chuỗi từ điển, nên <code>mt-8</code> thắng <code>mt-32</code>. Đừng bao giờ dựa vào</span></div>
<div class="lz-layer"><span class="lz-lname">3.3 — phơi nhiễm</span><span class="lz-lnote">197 <code>cn()</code> đối lập 631 chuỗi mẫu có nội suy = 76% không được bảo vệ. 62 component nhận prop <code>className</code></span></div>
<div class="lz-layer"><span class="lz-lname">3.4 — cú vá</span><span class="lz-lnote"><code>twMerge</code> khôi phục cái-sau-thắng, biết <code>p</code> bao <code>px</code>, GIỮ cả <code>text-sm</code> LẪN <code>text-red-500</code>, tốn 1,26 µs</span></div>
<div class="lz-layer"><span class="lz-lname">3.5 — cái thang</span><span class="lz-lnote">gỡ xung đột → hợp nhất → kiểm layer → rồi mới <code>!</code>. Kho này: 0,04% ở tiện ích, 38 trong globals.css</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You build <code>class="p-2 p-8"</code> and <code>class="p-8 p-2"</code> and diff the generated CSS. What do you get?|||Bạn dựng <code>class="p-2 p-8"</code> và <code>class="p-8 p-2"</code> rồi diff CSS được phát sinh. Bạn được gì?',
            options: [
              'No difference at all — the files are byte-identical, because <code>class</code> is an unordered SET of references and the cascade resolves by position in the STYLESHEET|||Không khác gì cả — hai file giống hệt từng byte, vì <code>class</code> là một TẬP tham chiếu không thứ tự và cascade phân giải bằng vị trí TRONG BẢNG KIỂU',
              'The rule order flips to match the written order|||Thứ tự quy tắc đảo lại để khớp thứ tự viết',
              'The second file omits <code>.p-2</code> as unreachable|||File thứ hai bỏ <code>.p-2</code> vì không với tới được',
              'The files differ in size but produce the same rendering|||Hai file khác kích thước nhưng dựng ra như nhau',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Eleven classes <code>mt-1</code> through <code>mt-32</code> on one element. Which wins, and why?|||Mười một lớp từ <code>mt-1</code> tới <code>mt-32</code> trên một thẻ. Cái nào thắng, và vì sao?',
            options: [
              '<code>mt-8</code> — within one property group Tailwind emits in LEXICOGRAPHIC string order (1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8), and the last emitted wins|||<code>mt-8</code> — trong một nhóm thuộc tính Tailwind phát sinh theo thứ tự CHUỖI từ điển (1, 10, 12, 16, 2, 20, 24, 3, 32, 4, 8), và cái phát sinh cuối thắng',
              '<code>mt-32</code>, because it is written last|||<code>mt-32</code>, vì nó được viết cuối',
              '<code>mt-32</code>, because it is the largest value|||<code>mt-32</code>, vì nó là giá trị lớn nhất',
              '<code>mt-1</code>, because it is written first|||<code>mt-1</code>, vì nó được viết đầu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Is <code>class="p-4 px-8"</code> a bug in the same way <code>class="mt-2 mt-10"</code> is?|||<code>class="p-4 px-8"</code> có phải một con bọ theo cùng kiểu <code>class="mt-2 mt-10"</code> không?',
            options: [
              'No — different SCOPES. Tailwind deliberately emits whole → axis → side, so <code>px-8</code> lands later and wins horizontally. That is designed, stable behaviour; the <code>mt</code> pair is same property at same scope and is a genuine mistake|||KHÔNG — khác PHẠM VI. Tailwind CỐ Ý phát sinh toàn phần → trục → cạnh, nên <code>px-8</code> rơi sau và thắng ở chiều ngang. Đó là hành vi được thiết kế, ổn định; còn cặp <code>mt</code> là cùng thuộc tính ở cùng phạm vi và là một sai sót thật',
              'Yes, both are undefined behaviour and should be avoided|||CÓ, cả hai đều là hành vi không định nghĩa và nên tránh',
              'No, because padding and margin are different properties|||KHÔNG, vì padding và margin là hai thuộc tính khác nhau',
              'Yes, but only in production builds|||CÓ, nhưng chỉ trong bản dựng production',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why can a linter catch <code>class="mt-2 mt-10"</code> but not the conflict in <code>className={`mt-2 ${props.className}`}</code>?|||Vì sao một bộ lint bắt được <code>class="mt-2 mt-10"</code> mà không bắt được xung đột trong <code>className={`mt-2 ${props.className}`}</code>?',
            options: [
              'The second conflict only EXISTS after interpolation at runtime — the linter sees a template literal with a hole, not two competing classes. It is structurally invisible to static analysis|||Xung đột thứ hai CHỈ TỒN TẠI sau khi nội suy lúc CHẠY — bộ lint thấy một chuỗi mẫu có lỗ hổng, không thấy hai lớp cạnh tranh. Nó VÔ HÌNH với phân tích tĩnh về mặt cấu trúc',
              'Linters cannot parse template literals at all|||Bộ lint hoàn toàn không phân tích được chuỗi mẫu',
              'The second one is not actually a conflict|||Cái thứ hai thực ra không phải xung đột',
              'ESLint only checks files listed in the tailwind content globs|||ESLint chỉ kiểm các file có trong glob content của tailwind',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why must <code>tailwind-merge</code> keep BOTH classes in <code>text-sm text-red-500</code>?|||Vì sao <code>tailwind-merge</code> phải GIỮ CẢ HAI lớp trong <code>text-sm text-red-500</code>?',
            options: [
              'They share a prefix but set DIFFERENT CSS properties — <code>font-size</code> and <code>color</code>. A prefix-based implementation would wrongly delete one; twMerge models the real property taxonomy|||Chúng chung tiền tố nhưng đặt HAI thuộc tính CSS KHÁC NHAU — <code>font-size</code> và <code>color</code>. Một cách cài dựa trên tiền tố sẽ xoá nhầm một cái; twMerge mô hình hoá taxonomy thuộc tính THẬT',
              'Because color utilities are never merged|||Vì tiện ích màu không bao giờ được hợp nhất',
              'Because they appear in different generated layers|||Vì chúng xuất hiện ở các layer phát sinh khác nhau',
              'It does not — it keeps only <code>text-red-500</code>|||Nó KHÔNG giữ — nó chỉ giữ <code>text-red-500</code>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A colleague rejects <code>cn()</code> on performance grounds. What is the measured answer?|||Một đồng nghiệp bác bỏ <code>cn()</code> vì lý do hiệu năng. Câu trả lời ĐO ĐƯỢC là gì?',
            options: [
              '1.26 µs per merge, and results are cached by input — merging all 828 dynamic compositions in one render would cost ~1.04 ms against a 16,667 µs frame budget|||1,26 µs mỗi lần hợp nhất, và kết quả được cache theo đầu vào — hợp nhất cả 828 cách soạn động trong một lần dựng tốn ~1,04 ms so với ngân sách khung hình 16.667 µs',
              'It is genuinely slow, so restrict it to components with a className prop|||Nó CHẬM thật, nên giới hạn cho các component có prop className',
              'Performance is irrelevant because it runs at build time|||Hiệu năng không liên quan vì nó chạy lúc dựng',
              'It adds ~50 µs per call, which is acceptable|||Nó thêm ~50 µs mỗi lượt gọi, mức chấp nhận được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A component uses <code>cn(className, "px-4")</code>. What is wrong?|||Một component dùng <code>cn(className, "px-4")</code>. Sai ở đâu?',
            options: [
              'The caller\'s class is not last, so the component\'s own <code>px-4</code> beats it every time — it merges correctly and does the exact opposite of what the prop promises|||Lớp của người gọi KHÔNG ở cuối, nên <code>px-4</code> của chính component thắng nó mọi lần — nó hợp nhất ĐÚNG và làm ĐÚNG NGƯỢC LẠI cái mà prop hứa hẹn',
              'Nothing; <code>cn()</code> sorts its arguments internally|||Không sai gì; <code>cn()</code> tự sắp xếp đối số bên trong',
              '<code>cn()</code> requires at least three arguments|||<code>cn()</code> đòi ít nhất ba đối số',
              'The string literal must come first for clsx to parse it|||Chuỗi nguyên văn phải đứng đầu để clsx phân tích được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A hand-written rule beats your utility. Before reaching for <code>!</code>, what should you check?|||Một quy tắc viết tay thắng tiện ích của bạn. TRƯỚC khi với tay tới <code>!</code>, bạn nên kiểm gì?',
            options: [
              'Its SPECIFICITY first, then whether it sits outside any <code>@layer</code> — a more specific rule wins from anywhere, so only a tie is fixed by layering|||ĐỘ ĐẶC HIỆU của nó TRƯỚC, rồi mới xem nó có nằm NGOÀI mọi <code>@layer</code> không — một quy tắc đặc hiệu hơn thắng từ bất cứ đâu, nên chỉ một cú HOÀ mới vá được bằng layer',
              'Whether the utility is spelled correctly|||Xem tiện ích có gõ đúng chính tả không',
              'Whether the browser supports the property|||Xem trình duyệt có hỗ trợ thuộc tính đó không',
              'Nothing — <code>!</code> is the standard fix for cascade conflicts|||Không gì cả — <code>!</code> là cú vá tiêu chuẩn cho xung đột cascade',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
