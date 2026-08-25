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

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Tailwind is a generator, not a library|||0.1 — Tailwind là một trình SINH, không phải một thư viện',
      slug: 'tw-0-1-trinh-sinh',
      type: 'VIDEO',
      description: 'Sự khác biệt nghe như chuyện chữ nghĩa, nhưng nó quyết định mọi thứ: vì sao lớp bạn ghép chuỗi lúc chạy KHÔNG tồn tại, vì sao file CSS không phình theo số component, và vì sao "tìm trong docs" thường là cách sai để học nó.',
      content: `
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

<div class="out">793        # file .tsx
26343      # thuoc tinh className="..."
3683       # lop tien ich DUY NHAT
</div>

<p>Read the third number against the second. Twenty-six thousand class attributes across the app, but only <strong>3,683 distinct utilities</strong> among them. That ratio is the whole economic argument for the approach: the CSS Tailwind generates is proportional to the <em>vocabulary</em> you use, not to the number of places you use it. Add a thousand more components that reuse the same utilities and the stylesheet does not grow at all.</p>

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

<p>The first version type-checks, renders, produces the markup <code>class="text-red-500"</code> in the browser, and the text is not red. Nothing errors. The class attribute is correct; the rule it refers to was never written into the CSS. Chapter 8 covers the whole family of these, but you can already derive it yourself from the one sentence — which is the point of learning the sentence first.</p>

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

<div class="out">793        # file .tsx
26343      # thuoc tinh className="..."
3683       # lop tien ich DUY NHAT
</div>

<p>Đọc con số thứ ba đối chiếu con số thứ hai. Hai mươi sáu nghìn thuộc tính lớp trải khắp ứng dụng, mà chỉ có <strong>3.683 tiện ích khác nhau</strong> trong đó. Tỉ số ấy là toàn bộ lập luận kinh tế của cách làm này: CSS mà Tailwind phát sinh tỉ lệ với <em>VỐN TỪ</em> bạn dùng, không tỉ lệ với SỐ CHỖ bạn dùng nó. Thêm một nghìn component nữa dùng lại đúng những tiện ích đó thì bảng kiểu KHÔNG lớn thêm một byte.</p>

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

<p>Bản đầu qua type-check, dựng ra được, sinh ra đúng thẻ <code>class="text-red-500"</code> trong trình duyệt, và chữ KHÔNG đỏ. Không có lỗi nào. Thuộc tính lớp thì đúng; quy tắc mà nó trỏ tới chưa bao giờ được viết vào CSS. Chương 8 bao cả họ lỗi này, nhưng bạn ĐÃ có thể tự suy ra nó từ một câu duy nhất — đó chính là điểm của việc học câu ấy trước.</p>

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
      description: 'Lời phản đối phổ biến nhất, và một phép đo dứt điểm nó: 7.758 tiện ích trong kho này diễn đạt những thứ mà `style={{}}` KHÔNG THỂ diễn đạt được — không phải "bất tiện hơn", mà là KHÔNG CÓ CÚ PHÁP nào để viết.',
      content: `
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

<div class="out">hover:           3674
focus:            854
active:           244
disabled:         596
group-hover:      268
focus-visible:    211
                 ─────
trang thai:      5847

sm:              1220
md:               266
lg:               376
xl:                48
2xl:                1
                 ─────
diem ngat:       1911

TONG:            7758
</div>

<p><strong>7,758 utilities</strong> in this codebase express something the <code>style</code> attribute has no syntax for. That is the measured refutation. It is not that utilities are a nicer way to write inline styles — it is that a majority of the interesting styling in a real app is <em>conditional</em>, and inline styles cannot express conditions.</p>

<div class="callout ok">
<p><strong>The right framing.</strong> A utility class is not an inline style. It is a <em>named reference to a rule in a stylesheet</em> — and because it lives in a stylesheet, it gets everything stylesheets have: media queries, pseudo-classes, pseudo-elements, and the cascade. It merely happens to be referenced from the markup. The reference is in the markup; the rule is not.</p>
</div>

<h3>What inline styles are still for</h3>
<p>This cuts both ways, and the same codebase shows where the line falls. Inline styles are still used <strong>3,128 times</strong>:</p>

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
<div class="lz-layer"><span class="lz-lname">grep for a colour gets harder</span><span class="lz-lnote">"where is this blue used" is one search in a stylesheet and 800 hits across components. Mitigated by putting colours in config (Chapter 5) so there is still one place</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — answering the objection with "it just scales better".</strong> That is an assertion, and the person objecting is right to distrust it. Answer with the measurement instead: the <code>style</code> attribute has no syntax for hover or for a breakpoint, and here are 7,758 places this application needs exactly that. A number ends the argument; a slogan extends it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A utility class resembles an inline style only in <em>where it is referenced</em> — it is a reference to a stylesheet rule, so it gets media queries, pseudo-classes and the cascade, none of which the <code>style</code> attribute has any syntax for, and in this codebase 7,758 utilities depend on exactly that difference.</p>
</div>

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

<div class="out">hover:           3674
focus:            854
active:           244
disabled:         596
group-hover:      268
focus-visible:    211
                 ─────
trang thai:      5847

sm:              1220
md:               266
lg:               376
xl:                48
2xl:                1
                 ─────
diem ngat:       1911

TONG:            7758
</div>

<p><strong>7.758 tiện ích</strong> trong kho mã này diễn đạt một thứ mà thuộc tính <code>style</code> KHÔNG CÓ cú pháp nào để viết. Đó là lời bác bỏ ĐO ĐƯỢC. Không phải chuyện tiện ích là cách viết inline style đẹp hơn — mà là phần LỚN những chỗ tạo kiểu đáng chú ý trong một ứng dụng thật đều CÓ ĐIỀU KIỆN, và inline style không diễn đạt được điều kiện.</p>

<div class="callout ok">
<p><strong>Cách đóng khung đúng.</strong> Một lớp tiện ích KHÔNG PHẢI một inline style. Nó là một <em>THAM CHIẾU CÓ TÊN tới một quy tắc trong bảng kiểu</em> — và vì nó sống trong một bảng kiểu, nó được hưởng mọi thứ bảng kiểu có: media query, lớp giả, phần tử giả, và cascade. Nó chỉ TÌNH CỜ được tham chiếu từ mã đánh dấu. Cái THAM CHIẾU nằm trong mã đánh dấu; cái QUY TẮC thì không.</p>
</div>

<h3>Inline style vẫn còn để làm gì</h3>
<p>Chuyện này cắt cả hai chiều, và cùng kho mã ấy cho thấy ranh giới rơi ở đâu. Inline style vẫn được dùng <strong>3.128 lần</strong>:</p>

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
<div class="lz-layer"><span class="lz-lname">tìm một màu khó hơn</span><span class="lz-lnote">"cái xanh này dùng ở đâu" là MỘT lần tìm trong bảng kiểu và 800 kết quả rải khắp component. Giảm nhẹ bằng cách đặt màu vào config (Chương 5) để vẫn còn MỘT chỗ</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — trả lời lời phản đối bằng "nó mở rộng tốt hơn".</strong> Đó là một lời khẳng định, và người phản đối có lý khi không tin. Hãy trả lời bằng SỐ ĐO: thuộc tính <code>style</code> không có cú pháp cho hover hay cho một điểm ngắt, và đây là 7.758 chỗ ứng dụng này cần đúng thứ ấy. Một con số KẾT THÚC cuộc tranh cãi; một khẩu hiệu KÉO DÀI nó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một lớp tiện ích chỉ giống inline style ở <em>CHỖ NÓ ĐƯỢC THAM CHIẾU</em> — nó là tham chiếu tới một quy tắc trong bảng kiểu, nên nó được media query, lớp giả và cascade, những thứ mà thuộc tính <code>style</code> không có cú pháp nào cả, và trong kho mã này có 7.758 tiện ích phụ thuộc đúng vào khác biệt đó.</p>
</div>

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

<pre><code class="language-css">/* frontend/src/app/globals.css lines 1-3 — part 2 */
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
2                              # chi 2 quy tac => content KHONG khop file nao
</div>

<p>A near-empty output file is the clearest possible signal that part 1 is misconfigured, and it is visible in one command without opening a browser. Compare against a run where the globs are right and the count is in the hundreds or thousands. Chapter 9 uses this same technique to measure output size properly.</p>

<div class="callout">
<p><strong>One sentence.</strong> Four independent things must be right — where to scan, where to inject, the scale, and who runs PostCSS — and because all four fail with the identical symptom, diagnose by <em>scope</em>: one class, one file, or everything, and check whether the rule reached the output CSS before touching the cascade.</p>
</div>

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

<pre><code class="language-css">/* frontend/src/app/globals.css dong 1-3 — bo phan 2 */
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
2                              # chi 2 quy tac => content KHONG khop file nao
</div>

<p>Một file đầu ra gần rỗng là tín hiệu rõ nhất có thể rằng bộ phận 1 sai cấu hình, và nó nhìn thấy được trong MỘT lệnh mà không cần mở trình duyệt. Đối chiếu với một lần chạy có glob đúng thì số đếm nằm ở hàng trăm hoặc hàng nghìn. Chương 9 dùng đúng kỹ thuật này để đo kích thước đầu ra cho tử tế.</p>

<div class="callout">
<p><strong>Một câu.</strong> Bốn thứ độc lập phải đúng — quét ở đâu, chèn vào đâu, cái thang, và ai chạy PostCSS — và vì cả bốn hỏng ra cùng một triệu chứng, hãy chẩn đoán theo <em>PHẠM VI</em>: một lớp, một file, hay tất cả, và kiểm xem quy tắc có TỚI được CSS đầu ra không TRƯỚC khi động vào cascade.</p>
</div>

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
