const REF = '?ref=%2Fcourses%2Ftailwind-css%2Flearn&reflabel=Tailwind%20CSS';
/**
 * Tailwind CSS — Chương 4: Component, và chỗ ĐÚNG để tái sử dụng.
 * Số đo: phân bố độ dài chuỗi lớp thật trong frontend/ (26.343 mẫu),
 * 0 lượt dùng @apply, 0 lượt dùng cva, 3 file primitives.tsx.
 */

export default {
  title: 'Chapter 4 — Components, and the right place to reuse|||Chương 4 — Component, và chỗ ĐÚNG để tái sử dụng',
  slug: 'tw-ch4-component',
  description: 'Lời phàn nàn "mã đánh dấu đầy lớp không đọc nổi" ĐO ĐƯỢC — và số đo cho thấy nó đúng với 4,4% trường hợp. Sáu bài về chỗ tái sử dụng thuộc về: component, không phải `@apply`.',
  sortOrder: 5,
  lessons: [

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Measuring "class soup" instead of arguing about it|||4.1 — ĐO "canh lớp" thay vì cãi nhau về nó',
      slug: 'tw-4-1-do-canh-lop',
      type: 'VIDEO',
      description: 'Phân bố độ dài của 26.343 chuỗi lớp thật: 79% dưới 80 ký tự, và chỉ 4,4% vượt 160. Lời phàn nàn ĐÚNG — nhưng đúng với một thiểu số nhỏ, và chính thiểu số ấy chỉ ra chỗ cần tách component.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Measuring "class soup" instead of arguing about it</h2>
<p class="lead">"Utility classes make markup unreadable" is the most durable objection to this approach, and it is usually argued with a screenshot of a worst case. It is a claim about a distribution, so measure the distribution.</p>

<h3>The distribution</h3>
<pre><code class="language-bash">$ grep -rhoE 'className="[^"]*"' src --include="*.tsx" \\
  | awk '{n=length; if(n&lt;40)a++; else if(n&lt;80)b++; else if(n&lt;160)c++; else d++}
         END{printf "  &lt;40: %d\\n  40-79: %d\\n  80-159: %d\\n  160+: %d\\n",a,b,c,d}'
</code></pre>

<div class="out">  &lt;40:    10781    (40,9%)
  40-79:  10037    (38,1%)
  80-159:  4366    (16,6%)
  160+:    1159     (4,4%)

Dai nhat: 787 ky tu
</div>

<p><strong>79% of class attributes in this application are under 80 characters</strong> — a single readable line. The horror cases exist: 1,159 attributes exceed 160 characters and one reaches 787. But they are 4.4% of the total, not the norm.</p>

<div class="callout ok">
<p><strong>Both sides of the argument are right about different data.</strong> The advocate saying "in practice it reads fine" is describing the 79%. The critic holding up a 787-character line is describing the 4.4%. Neither is lying. The useful question is not which experience is typical but <em>what the 4.4% have in common</em> — because that is where the actual design signal is.</p>
</div>

<h3>What a 787-character class attribute actually means</h3>
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
<span class="lz-node"><span class="lz-ntitle">short class list = leaf element</span><span class="lz-nsub">the 79%</span></span>
<span class="lz-nbody"><code>flex items-center gap-2</code>. One job, obvious at a glance, and abstracting it would cost more than it saves. Leave these alone — a component named <code>&lt;Row&gt;</code> that wraps three utilities is worse than the three utilities.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">long class list = missing component</span><span class="lz-nsub">the 4.4%</span></span>
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
$ grep -rhoE 'className="[^"]{120,}"' src --include="*.tsx" \\
  | sort | uniq -c | sort -rn | head -10
</code></pre>

<p>Anything appearing three or more times with 120+ characters is a component waiting to be named. This is a better starting point than reading files, because it ranks by the thing that actually costs you — duplication that must be kept in sync by hand.</p>

<div class="callout warn">
<p><strong>The cost of not extracting, stated concretely.</strong> Four copies of a 200-character class list means a design change touches four files, and a reviewer must diff four nearly-identical strings to confirm they still match. That is precisely the failure the pre-Tailwind world used CSS classes to avoid — and it is the one legitimate thing the critics are pointing at. The answer is not to abandon utilities; it is to extract a component, which is lesson 4.2.</p>
</div>

<div class="pitfall">
<p><strong>Trap — treating line length as the metric.</strong> Some teams add a lint rule capping class-attribute length. It produces two bad outcomes: genuine one-off layouts get split into meaningless sub-components to satisfy the linter, and people work around it by moving classes into variables, which hides the length without removing the duplication. The metric that matters is <em>how many places must change together</em>, and no character count measures that.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> "Class soup" is a real phenomenon at 4.4% of this codebase and a non-issue at 79%, so stop arguing about typicality and use the long strings as a <em>signal</em> — a class list that is both long and repeated is a component whose name has not been written down yet.</p>
</div>

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
<pre><code class="language-bash">$ grep -rhoE 'className="[^"]*"' src --include="*.tsx" \\
  | awk '{n=length; if(n&lt;40)a++; else if(n&lt;80)b++; else if(n&lt;160)c++; else d++}
         END{printf "  &lt;40: %d\\n  40-79: %d\\n  80-159: %d\\n  160+: %d\\n",a,b,c,d}'
</code></pre>

<div class="out">  &lt;40:    10781    (40,9%)
  40-79:  10037    (38,1%)
  80-159:  4366    (16,6%)
  160+:    1159     (4,4%)

Dai nhat: 787 ky tu
</div>

<p><strong>79% thuộc tính lớp trong ứng dụng này dưới 80 ký tự</strong> — một dòng đọc được. Các ca kinh dị CÓ tồn tại: 1.159 thuộc tính vượt 160 ký tự và một cái chạm 787. Nhưng chúng là 4,4% tổng số, không phải cái thường lệ.</p>

<div class="callout ok">
<p><strong>CẢ HAI phe đều đúng về những dữ liệu KHÁC NHAU.</strong> Người ủng hộ nói "trong thực tế nó đọc ổn" đang mô tả 79%. Người phê bình giơ lên một dòng 787 ký tự đang mô tả 4,4%. Không ai nói dối. Câu hỏi HỮU ÍCH không phải trải nghiệm nào là điển hình mà là <em>4,4% ấy có ĐIỂM CHUNG gì</em> — vì đó mới là chỗ có tín hiệu thiết kế thật.</p>
</div>

<h3>Một thuộc tính lớp 787 ký tự THẬT SỰ nghĩa là gì</h3>
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
<span class="lz-node"><span class="lz-ntitle">danh sách lớp NGẮN = thẻ lá</span><span class="lz-nsub">79%</span></span>
<span class="lz-nbody"><code>flex items-center gap-2</code>. MỘT việc, hiển nhiên trong một cái liếc, và trừu tượng hoá nó sẽ TỐN hơn cái nó tiết kiệm. Hãy để yên — một component tên <code>&lt;Row&gt;</code> bọc ba tiện ích thì TỆ HƠN ba tiện ích ấy.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">danh sách lớp DÀI = component còn thiếu</span><span class="lz-nsub">4,4%</span></span>
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
$ grep -rhoE 'className="[^"]{120,}"' src --include="*.tsx" \\
  | sort | uniq -c | sort -rn | head -10
</code></pre>

<p>Bất cứ thứ gì xuất hiện từ ba lần trở lên với 120+ ký tự là một component đang chờ được đặt tên. Đây là điểm khởi đầu TỐT HƠN việc đọc file, vì nó XẾP HẠNG theo đúng cái thật sự làm bạn tốn kém — sự trùng lặp phải giữ đồng bộ bằng tay.</p>

<div class="callout warn">
<p><strong>Cái giá của việc KHÔNG tách, nói cho cụ thể.</strong> Bốn bản sao của một danh sách lớp 200 ký tự nghĩa là một thay đổi thiết kế động vào bốn file, và người review phải diff bốn chuỗi gần-như-giống-hệt để xác nhận chúng còn khớp. Đó CHÍNH XÁC là cú hỏng mà thế giới trước-Tailwind dùng lớp CSS để tránh — và nó là điều CHÍNH ĐÁNG duy nhất mà những người phê bình đang chỉ vào. Câu trả lời KHÔNG phải bỏ tiện ích; nó là TÁCH một component, tức bài 4.2.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — lấy ĐỘ DÀI DÒNG làm thước đo.</strong> Vài đội thêm một luật lint chặn độ dài thuộc tính lớp. Nó đẻ ra hai kết cục xấu: các bố cục một-lần chính đáng bị chẻ thành những component con VÔ NGHĨA để làm hài lòng bộ lint, và người ta lách bằng cách dời lớp vào biến, thứ GIẤU độ dài mà không gỡ sự trùng lặp. Thước đo QUAN TRỌNG là <em>bao nhiêu chỗ phải đổi CÙNG NHAU</em>, và không phép đếm ký tự nào đo được cái đó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> "Canh lớp" là một hiện tượng CÓ THẬT ở 4,4% kho mã này và là chuyện KHÔNG ĐÁNG BÀN ở 79%, nên hãy thôi cãi nhau về cái gì là điển hình và dùng các chuỗi dài như một <em>TÍN HIỆU</em> — một danh sách lớp vừa DÀI vừa LẶP LẠI là một component mà cái tên của nó chưa được viết ra.</p>
</div>

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
      description: '`@apply` trông như câu trả lời hiển nhiên cho canh lớp. Đo thật: nó CHÉP nguyên mọi khai báo — `.btn-lg` không THAM CHIẾU `.btn`, nó nội tuyến một bản sao. Kho này dùng nó ĐÚNG 0 lần trong 4.462 dòng CSS.',
      content: `
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
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity))
}

.btn-lg {
  border-radius: 0.25rem;              &lt;- ban sao
  --tw-bg-opacity: 1;                  &lt;- ban sao
  background-color: rgb(59 130 246 …); &lt;- ban sao
  padding-top: 0.5rem;                 &lt;- ban sao
  padding-bottom: 0.5rem;              &lt;- ban sao
  --tw-text-opacity: 1;                &lt;- ban sao
  color: rgb(255 255 255 …);           &lt;- ban sao
  padding-left: 2rem;
  padding-right: 2rem
}
</div>

<p><code>.btn-lg</code> does not <em>reference</em> <code>.btn</code>. It contains a full copy of it — seven of its nine declarations are duplicated bytes. <code>@apply</code> is a macro that inlines declarations at build time, not a mechanism for sharing them.</p>

<div class="callout warn">
<p><strong>This destroys the argument from lesson 0.1.</strong> The whole economic case for utility CSS was that stylesheet size tracks your <em>vocabulary</em>, not your number of use sites — 26,343 class attributes collapsing to 3,683 distinct utilities. <code>@apply</code> reverses that exactly: every named class carries its own copy of every declaration, so the stylesheet grows with the number of component classes, precisely like hand-written CSS. You have adopted a tool for its deduplication and then switched off the deduplication.</p>
</div>

<h3>What you give up, item by item</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">deduplication</span><span class="lz-lnote">measured above. Ten component classes sharing a base means ten copies of the base's declarations in the output</span></div>
<div class="lz-layer"><span class="lz-lname">readability at the call site</span><span class="lz-lnote"><code>class="btn"</code> tells you nothing about what the element looks like. You are back to opening a stylesheet to find out — the exact indirection utilities removed</span></div>
<div class="lz-layer"><span class="lz-lname">the conflict model</span><span class="lz-lnote"><code>tailwind-merge</code> knows nothing about <code>.btn</code>, so <code>cn('btn', 'px-8')</code> cannot resolve the padding conflict. Chapter 3's whole solution stops working for your custom classes</span></div>
<div class="lz-layer"><span class="lz-lname">safe deletion</span><span class="lz-lnote">deleting an unused utility from a component is free and obvious. Deleting a declaration from <code>.btn</code> risks breaking every element using it, and you cannot tell which without a full-text search</span></div>
<div class="lz-layer"><span class="lz-lname">variants without pain</span><span class="lz-lnote">a <code>.btn</code> that needs a hover state needs a second rule; a component that needs one adds <code>hover:bg-blue-600</code> inline. The CSS-class version reintroduces the naming problem for every state</span></div>
</div>

<h3>What this codebase did instead</h3>
<pre><code class="language-bash">$ grep -c '@apply' src/app/globals.css
</code></pre>

<div class="out">0
</div>

<p><strong>Zero uses across 4,462 lines of CSS.</strong> That is not an accident — the file contains roughly 300 hand-written lines for <code>.rich-content</code>, written as plain CSS declarations rather than <code>@apply</code>. The team's implicit rule is visible in the number: when CSS is genuinely needed, write CSS; when component styling is needed, write a component.</p>

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
<p><strong>The one honest advantage of <code>@apply</code>, and its limit.</strong> It works without a JavaScript component layer — a plain HTML site, a Rails or Django template, a web component. If your project has no component abstraction to extract into, <code>@apply</code> is a real option and the duplication is a real cost you accept knowingly. In a React codebase with 793 components, that argument does not apply.</p>
</div>

<div class="pitfall">
<p><strong>Trap — <code>@apply</code>-ing a class that is itself made of <code>@apply</code>.</strong> The measurement above shows <code>.btn-lg { @apply btn px-8 }</code> works, which encourages building a hierarchy. Each level copies the level below it, so a three-deep chain triples the declarations, and a change at the root silently rewrites every descendant's output. It reads like inheritance and behaves like copy-paste — the worst combination, because the code implies a relationship the output does not have.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>@apply</code> inlines a copy of every declaration rather than referencing them — measured, <code>.btn-lg</code> duplicates seven of <code>.btn</code>'s nine — so it reverses the deduplication that was the entire reason to adopt utility CSS, and in a codebase with a component layer the answer to a long class list is a component, which is why this repository uses <code>@apply</code> exactly zero times.</p>
</div>

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
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity))
}

.btn-lg {
  border-radius: 0.25rem;              &lt;- ban sao
  --tw-bg-opacity: 1;                  &lt;- ban sao
  background-color: rgb(59 130 246 …); &lt;- ban sao
  padding-top: 0.5rem;                 &lt;- ban sao
  padding-bottom: 0.5rem;              &lt;- ban sao
  --tw-text-opacity: 1;                &lt;- ban sao
  color: rgb(255 255 255 …);           &lt;- ban sao
  padding-left: 2rem;
  padding-right: 2rem
}
</div>

<p><code>.btn-lg</code> KHÔNG <em>THAM CHIẾU</em> <code>.btn</code>. Nó CHỨA một bản sao đầy đủ của nó — bảy trên chín khai báo là những byte TRÙNG LẶP. <code>@apply</code> là một MACRO nội tuyến các khai báo lúc dựng, không phải một cơ chế để CHIA SẺ chúng.</p>

<div class="callout warn">
<p><strong>Chuyện này PHÁ HUỶ lập luận ở bài 0.1.</strong> Toàn bộ luận điểm kinh tế của CSS tiện ích là kích thước bảng kiểu bám theo <em>VỐN TỪ</em> của bạn, không bám theo số CHỖ DÙNG — 26.343 thuộc tính lớp gói lại còn 3.683 tiện ích khác nhau. <code>@apply</code> ĐẢO NGƯỢC đúng cái đó: mỗi lớp có tên mang bản sao riêng của mọi khai báo, nên bảng kiểu PHÌNH theo số lớp component, y hệt CSS viết tay. Bạn đã nhận một công cụ VÌ khả năng khử trùng lặp của nó rồi TẮT khả năng khử trùng lặp đi.</p>
</div>

<h3>Bạn đánh mất gì, từng món</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">khử trùng lặp</span><span class="lz-lnote">đo được bên trên. Mười lớp component chung một nền nghĩa là MƯỜI bản sao các khai báo của cái nền ấy trong đầu ra</span></div>
<div class="lz-layer"><span class="lz-lname">tính đọc-được TẠI CHỖ GỌI</span><span class="lz-lnote"><code>class="btn"</code> không nói gì cho bạn về việc cái thẻ trông ra sao. Bạn quay lại việc mở một bảng kiểu để tìm hiểu — chính xác cú gián tiếp mà tiện ích đã gỡ bỏ</span></div>
<div class="lz-layer"><span class="lz-lname">mô hình xung đột</span><span class="lz-lnote"><code>tailwind-merge</code> không biết gì về <code>.btn</code>, nên <code>cn('btn', 'px-8')</code> KHÔNG phân giải được xung đột padding. Toàn bộ lời giải của Chương 3 NGỪNG chạy với các lớp tuỳ biến của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">xoá được an toàn</span><span class="lz-lnote">xoá một tiện ích không dùng khỏi một component thì miễn phí và hiển nhiên. Xoá một khai báo khỏi <code>.btn</code> có RỦI RO làm vỡ mọi thẻ đang dùng nó, và bạn không biết là những thẻ nào nếu không tìm toàn văn</span></div>
<div class="lz-layer"><span class="lz-lname">biến thể mà không đau</span><span class="lz-lnote">một <code>.btn</code> cần trạng thái hover thì cần một quy tắc THỨ HAI; một component cần nó thì thêm <code>hover:bg-blue-600</code> ngay trong dòng. Bản lớp-CSS TÁI SINH bài toán đặt tên cho MỌI trạng thái</span></div>
</div>

<h3>Kho mã này đã làm gì thay vào đó</h3>
<pre><code class="language-bash">$ grep -c '@apply' src/app/globals.css
</code></pre>

<div class="out">0
</div>

<p><strong>KHÔNG lượt nào trên 4.462 dòng CSS.</strong> Đó KHÔNG phải tai nạn — file ấy chứa khoảng 300 dòng viết tay cho <code>.rich-content</code>, viết dưới dạng khai báo CSS THUẦN chứ không dùng <code>@apply</code>. Luật ngầm của đội ngũ nhìn thấy được trong con số: khi THẬT SỰ cần CSS thì viết CSS; khi cần tạo kiểu component thì viết một COMPONENT.</p>

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
<p><strong>Lợi thế TRUNG THỰC duy nhất của <code>@apply</code>, và giới hạn của nó.</strong> Nó chạy được KHÔNG cần một tầng component JavaScript — một trang HTML thuần, một template Rails hay Django, một web component. Nếu dự án của bạn KHÔNG có một trừu tượng component nào để tách vào, thì <code>@apply</code> là một lựa chọn THẬT và sự trùng lặp là một cái giá thật bạn chấp nhận một cách CÓ Ý THỨC. Trong một kho mã React với 793 component, lập luận ấy KHÔNG áp dụng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>@apply</code> một lớp mà bản thân nó cũng làm bằng <code>@apply</code>.</strong> Phép đo bên trên cho thấy <code>.btn-lg { @apply btn px-8 }</code> CHẠY ĐƯỢC, thứ khuyến khích dựng một hệ phân cấp. Mỗi tầng CHÉP tầng dưới nó, nên một chuỗi ba tầng nhân ba số khai báo, và một thay đổi ở gốc ÂM THẦM viết lại đầu ra của mọi hậu duệ. Nó ĐỌC như kế thừa và HÀNH XỬ như chép-dán — tổ hợp TỆ NHẤT, vì mã ngụ ý một quan hệ mà đầu ra KHÔNG hề có.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>@apply</code> NỘI TUYẾN một bản sao của mọi khai báo thay vì tham chiếu chúng — đo được, <code>.btn-lg</code> chép trùng bảy trên chín khai báo của <code>.btn</code> — nên nó ĐẢO NGƯỢC khả năng khử trùng lặp vốn là toàn bộ lý do nhận CSS tiện ích, và trong một kho mã có tầng component thì câu trả lời cho một danh sách lớp dài là một COMPONENT, đó là lý do kho này dùng <code>@apply</code> đúng KHÔNG lần.</p>
</div>

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
      description: '62 component trong kho này nhận một prop `className`. Mỗi cái là một lời hứa "đưa lớp cho tôi và tôi sẽ áp chúng" — và lời hứa ấy chỉ đúng nếu prop được hợp nhất SAU CÙNG. Ba mức hợp đồng, xếp theo độ chặt.',
      content: `
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

<pre><code class="language-tsx">import { cn } from '@/lib/utils';

export const TextInput = forwardRef&lt;
  HTMLInputElement,
  React.InputHTMLAttributes&lt;HTMLInputElement&gt;
&gt;(({ className, ...props }, ref) =&gt; (
  &lt;input ref={ref} className={cn(BASE, className)} {...props} /&gt;
));
</code></pre>

<p>Three things are right here at once: the ref is forwarded, the remaining props are spread, and <code>className</code> is merged last. Typing the props as <code>React.InputHTMLAttributes</code> rather than a hand-written interface is what makes the spread honest — the type says "everything an <code>&lt;input&gt;</code> accepts", and the implementation delivers exactly that.</p>

<div class="callout warn">
<p><strong>The contract you cannot express in types.</strong> TypeScript can say <code>className?: string</code>. It cannot say "and it will actually take effect". Chapter 3 measured 631 places in this codebase where that second half is not guaranteed, and no type annotation distinguishes them from the 197 where it is. This is why the convention has to be enforced by lint or review rather than by the compiler.</p>
</div>

<div class="pitfall">
<p><strong>Trap — accepting <code>className</code> and applying it to a wrapper the caller cannot see.</strong> A caller passes <code>w-full</code> expecting the input to fill its container; the class lands on an outer <code>&lt;div&gt;</code> that was already full width, and the input does not change. Nothing errors, the class is applied somewhere, and DevTools shows it working — on the wrong element. If your component has a wrapper, either put <code>className</code> on the element the name implies or expose two props with explicit names.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> A <code>className</code> prop is a public promise that arbitrary classes will take effect, so either do not offer it — named variants keep a design system actually systematic — or honour it completely: merge it last, spread the remaining props, forward the ref, and document which element it lands on.</p>
</div>

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

<pre><code class="language-tsx">import { cn } from '@/lib/utils';

export const TextInput = forwardRef&lt;
  HTMLInputElement,
  React.InputHTMLAttributes&lt;HTMLInputElement&gt;
&gt;(({ className, ...props }, ref) =&gt; (
  &lt;input ref={ref} className={cn(BASE, className)} {...props} /&gt;
));
</code></pre>

<p>BA điều đúng cùng lúc ở đây: ref được chuyển tiếp, các prop còn lại được trải ra, và <code>className</code> được hợp nhất CUỐI. Khai kiểu props là <code>React.InputHTMLAttributes</code> thay vì một interface viết tay chính là thứ làm cú TRẢI trở nên TRUNG THỰC — kiểu nói "mọi thứ một <code>&lt;input&gt;</code> nhận được", và phần cài đặt giao đúng chừng ấy.</p>

<div class="callout warn">
<p><strong>Cái hợp đồng bạn KHÔNG diễn đạt được bằng kiểu.</strong> TypeScript nói được <code>className?: string</code>. Nó KHÔNG nói được "và nó sẽ THẬT SỰ có tác dụng". Chương 3 đã đo 631 chỗ trong kho mã này mà nửa sau ấy KHÔNG được bảo đảm, và không chú thích kiểu nào phân biệt chúng với 197 chỗ có bảo đảm. Đó là lý do quy ước phải được CƯỠNG CHẾ bằng lint hay review chứ không phải bằng trình biên dịch.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — nhận <code>className</code> rồi áp nó lên một VỎ BỌC mà người gọi không nhìn thấy.</strong> Người gọi truyền <code>w-full</code> mong ô nhập lấp đầy vật chứa; cái lớp rơi lên một <code>&lt;div&gt;</code> bên ngoài vốn đã rộng hết cỡ, và ô nhập KHÔNG đổi. Không lỗi nào, cái lớp CÓ được áp ở đâu đó, và DevTools cho thấy nó đang chạy — trên SAI thẻ. Nếu component của bạn có vỏ bọc, hoặc đặt <code>className</code> lên đúng cái thẻ mà cái tên ngụ ý, hoặc phơi ra HAI prop với tên tường minh.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Prop <code>className</code> là một lời hứa CÔNG KHAI rằng các lớp tuỳ ý sẽ có tác dụng, nên hoặc ĐỪNG cung cấp nó — các biến thể có tên giữ cho một hệ thiết kế thật sự có HỆ — hoặc TÔN TRỌNG nó trọn vẹn: hợp nhất cuối, trải các prop còn lại, chuyển tiếp ref, và ghi tài liệu nó rơi lên thẻ nào.</p>
</div>

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
<pre><code class="language-bash">$ grep -rho 'cva(' src --include="*.tsx" --include="*.ts" | wc -l
</code></pre>

<div class="out">0
</div>

<p><strong>Zero.</strong> With 793 components, this repository never reached for <code>cva</code>. That is worth taking seriously rather than reading as an oversight: it suggests the components here are mostly single-axis or no-axis, which matches the <code>primitives.tsx</code> files — <code>Toggle</code>, <code>TextInput</code>, <code>SettingsRow</code>, <code>StatusPill</code> are each one thing with at most a colour parameter.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">stay with the if-chain</span><span class="lz-nsub">one axis, or two with no exceptions</span></span>
<span class="lz-nbody">Readable, no dependency, no second syntax. This covers the large majority of components, and 793 of them here manage without the alternative.</span>
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
<p><strong>Trap — introducing <code>cva</code> for a component with one variant axis.</strong> The config object is longer than the if-chain it replaced, the team now has two ways to write variants, and the benefit — compound variants and derived types — is unused. Adopt it when the first compound case appears, not in anticipation. Zero uses across 793 components is evidence that the anticipation is usually wrong.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> An if-chain expresses independent variant axes perfectly well and needs no library; the signal to move to a declarative matrix is the arrival of the first <em>compound</em> case — a rule that depends on two axes at once — and this codebase's zero uses of <code>cva</code> across 793 components is a reminder that most components never get there.</p>
</div>

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
<pre><code class="language-bash">$ grep -rho 'cva(' src --include="*.tsx" --include="*.ts" | wc -l
</code></pre>

<div class="out">0
</div>

<p><strong>KHÔNG.</strong> Với 793 component, kho này CHƯA BAO GIỜ với tay tới <code>cva</code>. Điều đó đáng xem xét NGHIÊM TÚC chứ không đọc như một sự bỏ sót: nó gợi ý rằng các component ở đây phần lớn là MỘT-trục hoặc KHÔNG-trục, khớp với các file <code>primitives.tsx</code> — <code>Toggle</code>, <code>TextInput</code>, <code>SettingsRow</code>, <code>StatusPill</code> mỗi cái là MỘT thứ với nhiều nhất một tham số màu.</p>

<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">ở lại với chuỗi if</span><span class="lz-nsub">một trục, hoặc hai trục KHÔNG ngoại lệ</span></span>
<span class="lz-nbody">Đọc được, không phụ thuộc, không cú pháp thứ hai. Cái này bao PHẦN LỚN component, và 793 cái ở đây xoay xở được mà không cần lựa chọn kia.</span>
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
<p><strong>Bẫy — đưa <code>cva</code> vào cho một component chỉ có MỘT trục biến thể.</strong> Object cấu hình DÀI HƠN chuỗi if mà nó thay thế, đội ngũ giờ có HAI cách viết biến thể, và cái lợi — biến thể ghép và kiểu suy ra — thì KHÔNG dùng tới. Hãy nhận nó khi ca ghép ĐẦU TIÊN xuất hiện, không phải để ĐÓN ĐẦU. Không lượt dùng nào trên 793 component là bằng chứng rằng cú đón đầu ấy thường SAI.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Một chuỗi if diễn đạt các trục biến thể ĐỘC LẬP hoàn toàn ổn và KHÔNG cần thư viện nào; tín hiệu để chuyển sang một ma trận khai báo là sự xuất hiện của ca <em>GHÉP</em> đầu tiên — một quy tắc phụ thuộc vào hai trục cùng lúc — và việc kho mã này dùng <code>cva</code> không lần nào trên 793 component là một lời nhắc rằng phần lớn component KHÔNG bao giờ tới đó.</p>
</div>

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
<p><strong>Trap — extracting the components and leaving the hardcoded values.</strong> The extraction in this file was only a fix because the values became CSS variables at the same time. Moving <code>#0a0a14</code> from twenty call sites into one component makes it easier to fix later, but the settings screen is still black in light mode until someone does. Extraction and the actual correction are two steps, and shipping only the first feels like progress while changing nothing a user can see.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The strongest reason to extract is not duplication but <em>duplicated wrongness</em> — this repository's settings primitives exist because hardcoded hex values made the screen unusable in light mode — and the file's header earns its place by recording the bug, the mechanism that replaced it, and the repository rule it deliberately honours.</p>
</div>

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
<p><strong>Bẫy — tách các component ra rồi ĐỂ NGUYÊN các giá trị đóng cứng.</strong> Cú tách trong file này CHỈ là một cú vá vì các giá trị ĐỒNG THỜI trở thành biến CSS. Dời <code>#0a0a14</code> từ hai mươi chỗ gọi vào một component thì làm nó DỄ VÁ HƠN về sau, nhưng màn Cài đặt VẪN đen trong theme sáng cho tới khi có người làm việc ấy. Tách và cú SỬA thật là HAI bước, và giao mỗi bước đầu thì có CẢM GIÁC tiến bộ trong khi không đổi được thứ gì người dùng nhìn thấy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Lý do MẠNH nhất để tách không phải sự trùng lặp mà là <em>SỰ TRÙNG LẶP CỦA CÁI SAI</em> — các nguyên thể settings của kho này tồn tại vì các mã hex đóng cứng làm màn hình không dùng được ở theme sáng — và phần đầu file xứng đáng chỗ đứng của nó bằng cách GHI LẠI con bọ, cơ chế đã thay thế nó, và luật của kho mà nó cố ý tôn trọng.</p>
</div>

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
      description: 'Tám câu, mười hai phút. Về tái sử dụng: 4,4% canh lớp đo được, @apply chép chứ không tham chiếu, prop className là hợp đồng, và khi nào KHÔNG cần cva.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>What Chapter 4 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter is about judgement calls, so several questions have a defensible-looking wrong answer. The measured number is usually what separates them.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">4.1 — the distribution</span><span class="lz-lnote">79% of class attributes under 80 chars, 4.4% over 160, longest 787. Extract on REPETITION, not length</span></div>
<div class="lz-layer"><span class="lz-lname">4.2 — @apply copies</span><span class="lz-lnote"><code>.btn-lg</code> duplicates 7 of <code>.btn</code>'s 9 declarations. It reverses the dedup that justified utility CSS. This repo: 0 uses in 4,462 lines</span></div>
<div class="lz-layer"><span class="lz-lname">4.3 — the contract</span><span class="lz-lnote">merge last, spread props, forward ref, document which element. Or do not offer <code>className</code> at all</span></div>
<div class="lz-layer"><span class="lz-lname">4.4 — variants</span><span class="lz-lnote">if-chains are fine for independent axes; the signal for <code>cva</code> is the first COMPOUND case. This repo: 0 uses across 793 components</span></div>
<div class="lz-layer"><span class="lz-lname">4.5 — a real extraction</span><span class="lz-lnote">triggered by duplicated WRONGNESS (hardcoded hex, black in light mode), not duplication. The header records bug, mechanism and constraint</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Chương 4 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này nói về các quyết định PHÁN ĐOÁN, nên vài câu có một đáp án sai TRÔNG rất biện hộ được. Con số ĐO ĐƯỢC thường là thứ tách chúng ra.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">4.1 — phân bố</span><span class="lz-lnote">79% thuộc tính lớp dưới 80 ký tự, 4,4% trên 160, dài nhất 787. Tách theo SỰ LẶP LẠI, không theo độ dài</span></div>
<div class="lz-layer"><span class="lz-lname">4.2 — @apply CHÉP</span><span class="lz-lnote"><code>.btn-lg</code> trùng lặp 7 trên 9 khai báo của <code>.btn</code>. Nó đảo ngược cái khử-trùng-lặp vốn biện minh cho CSS tiện ích. Kho này: 0 lượt trong 4.462 dòng</span></div>
<div class="lz-layer"><span class="lz-lname">4.3 — hợp đồng</span><span class="lz-lnote">hợp nhất cuối, trải props, chuyển tiếp ref, ghi tài liệu thẻ nào. Hoặc ĐỪNG cung cấp <code>className</code> chút nào</span></div>
<div class="lz-layer"><span class="lz-lname">4.4 — biến thể</span><span class="lz-lnote">chuỗi if ổn cho các trục độc lập; tín hiệu cho <code>cva</code> là ca GHÉP đầu tiên. Kho này: 0 lượt trên 793 component</span></div>
<div class="lz-layer"><span class="lz-lname">4.5 — một cú tách thật</span><span class="lz-lnote">kích hoạt bởi SỰ TRÙNG LẶP CỦA CÁI SAI (hex đóng cứng, đen trong theme sáng), không phải trùng lặp. Phần đầu file ghi lại bọ, cơ chế và ràng buộc</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Measured across 26,343 class attributes: 79% are under 80 characters and 4.4% exceed 160. What follows?|||Đo trên 26.343 thuộc tính lớp: 79% dưới 80 ký tự và 4,4% vượt 160. Suy ra điều gì?',
            options: [
              'Both sides of the "class soup" argument describe real data — and the long 4.4% are a SIGNAL pointing at missing components, not evidence the approach fails|||Cả hai phe trong cuộc tranh luận "canh lớp" đều mô tả dữ liệu THẬT — và 4,4% dài là một TÍN HIỆU chỉ vào các component còn thiếu, không phải bằng chứng cách làm này thất bại',
              'The codebase needs a lint rule capping class attribute length|||Kho mã cần một luật lint chặn độ dài thuộc tính lớp',
              'The 4.4% should be rewritten with @apply|||4,4% ấy nên được viết lại bằng @apply',
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
            question: 'This repo uses <code>cva</code> zero times across 793 components. What is the right reading?|||Kho này dùng <code>cva</code> không lần nào trên 793 component. Cách đọc đúng là gì?',
            options: [
              'Most components are single-axis or no-axis, so an if-chain expresses them fine — the signal to adopt cva is the first COMPOUND case (a rule depending on two axes at once), not the number of variants|||Phần lớn component là một-trục hoặc không-trục, nên một chuỗi if diễn đạt chúng ổn — tín hiệu để nhận cva là ca GHÉP đầu tiên (một quy tắc phụ thuộc hai trục cùng lúc), không phải SỐ biến thể',
              'The team was unaware of cva and should migrate all 793|||Đội ngũ không biết tới cva và nên di trú cả 793 cái',
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
