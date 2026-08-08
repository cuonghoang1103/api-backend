/**
 * Next.js & React — Chương 13: Styling, Tailwind & theme. MỞ GIAI ĐOẠN 4.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kỹ thuật styling — không có output console để chạy. Sự cố THẬT cuongthai.com
 * lồng vào .note-ct/.pitfall: `.dark` vs `theme-dark` (class dark toàn cục force mọi
 * Tailwind dark: trong Notes), và "chữ đen trên nền đen" (nền tối cố định + màu chữ
 * theo biến theme = phải đặt cả color, không chỉ ghim biến).
 */

export default {
  title: 'Chapter 13 — Styling: Tailwind, dark mode, and theming|||Chương 13 — Styling: Tailwind, dark mode và theme',
  description: 'Các cách style trong Next.js và vì sao Tailwind. Utility class, responsive/hover, ghép class có điều kiện, dark mode bằng biến dark: + class trên <html>, theme bằng CSS variables, và hai cái bẫy theme thật của cuongthai.com.',
  lessons: [
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — Styling options, and why Tailwind|||13.1 — Các cách style, và vì sao Tailwind',
      slug: 'nextjs-13-1-styling-va-tailwind',
      type: 'VIDEO',
      isFreePreview: true,
      // Video: "Next.js Dark Mode with No Flicker + Tailwind CSS" — Dave Gray (oEmbed verified).
      video: { url: 'https://youtu.be/7zqI4qMDdg8', durationSeconds: 0 },
      description: 'Next.js hỗ trợ global CSS, CSS Modules và Tailwind. Bài này điểm qua từng cách, rồi giải thích vì sao khoá dùng Tailwind — cùng cách chính cuongthai.com được style.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1 · Stage 4 begins</span>
<h2>Three ways to style, one this course commits to</h2>
<p class="lead">Stages 1–3 built structure and behaviour; nothing looked good yet. Stage 4 is the production layer — styling, state at scale, auth, forms. We start with styling, where Next.js gives you a few options.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Global CSS</span><span class="v">A plain <code>.css</code> file imported once in the root layout. Good for resets, CSS variables, base element styles. One global scope, so class names can collide.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v">A <code>Button.module.css</code> whose classes are locally scoped to one component — no name clashes. Solid, but you jump between two files per component.</span></div>
  <div class="kv"><span class="k">Tailwind CSS</span><span class="v">Utility classes you compose right in the JSX (<code>class="flex gap-2 p-4"</code>). No naming, styles live with the markup. This is what the course uses.</span></div>
</div>

<h3>Why Tailwind wins for app work</h3>
<p>The hard part of CSS at scale is not writing rules — it is <em>naming</em> and the fear of editing a shared class. Tailwind sidesteps both: you apply small, single-purpose utilities inline, so a component's styles are visible where the component is, and deleting a component deletes its styles with it. It also ships a consistent design system out of the box — a spacing scale, a colour palette, type sizes — so a team's UI stays coherent without a separate design-tokens effort.</p>

<pre><code><span class="tok-comment">// the same button, Tailwind way</span>
&lt;button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;
  Save
&lt;/button&gt;</code></pre>

<h3>How it is wired in a Next.js app</h3>
<p>Tailwind scans your files for class names and generates only the CSS you actually used. Two moving parts: a config that lists which files to scan (the <code>content</code> globs), and a global stylesheet that pulls Tailwind in. Get the content paths wrong and classes silently produce no styles — the first thing to check when "my Tailwind class does nothing."</p>

<div class="callout ok">
<p><strong>You do not have to choose only one.</strong> A real app often uses Tailwind for components plus a small global stylesheet for CSS variables and base styles. That is exactly the mix the theming lessons below rely on.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/styling" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Styling</span><span class="lc-sub">Global CSS, CSS Modules, Tailwind, and Sass in the App Router.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/installation/framework-guides/nextjs" target="_blank" rel="noopener">
  <span class="lc-ico">💨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Install with Next.js</span><span class="lc-sub">Content scanning, the directives, and the config.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1 · Mở Giai đoạn 4</span>
<h2>Ba cách style, một cách khoá này chọn</h2>
<p class="lead">Giai đoạn 1–3 dựng cấu trúc và hành vi; chưa gì đẹp cả. Giai đoạn 4 là lớp production — styling, state ở quy mô lớn, auth, form. Ta bắt đầu với styling, nơi Next.js cho vài lựa chọn.</p>

<div class="kv-grid">
  <div class="kv"><span class="k">Global CSS</span><span class="v">Một file <code>.css</code> thường import một lần ở root layout. Hợp cho reset, CSS variables, style phần tử nền. Một phạm vi toàn cục, nên tên class có thể đụng nhau.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v">Một <code>Button.module.css</code> có class khoanh cục bộ vào một component — không đụng tên. Chắc chắn, nhưng phải nhảy giữa hai file mỗi component.</span></div>
  <div class="kv"><span class="k">Tailwind CSS</span><span class="v">Utility class bạn ghép ngay trong JSX (<code>class="flex gap-2 p-4"</code>). Không đặt tên, style nằm cùng markup. Đây là cái khoá dùng.</span></div>
</div>

<h3>Vì sao Tailwind thắng cho việc làm app</h3>
<p>Phần khó của CSS ở quy mô lớn không phải viết luật — mà là <em>đặt tên</em> và nỗi sợ sửa một class dùng chung. Tailwind né cả hai: bạn áp các utility nhỏ, một-mục-đích, ngay tại chỗ, nên style của một component hiện ngay nơi component ở đó, và xoá một component là xoá luôn style của nó. Nó cũng kèm sẵn một hệ thiết kế nhất quán — thang khoảng cách, bảng màu, cỡ chữ — nên UI của cả nhóm giữ mạch lạc mà không cần một nỗ lực design-tokens riêng.</p>

<pre><code><span class="tok-comment">// cùng cái nút, kiểu Tailwind</span>
&lt;button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;
  Lưu
&lt;/button&gt;</code></pre>

<h3>Nó được nối trong app Next.js ra sao</h3>
<p>Tailwind quét file của bạn tìm tên class và chỉ sinh ra CSS bạn thật sự dùng. Hai bộ phận: một config liệt kê file nào cần quét (các glob <code>content</code>), và một stylesheet toàn cục kéo Tailwind vào. Sai đường dẫn content thì class âm thầm không tạo style nào — điều đầu tiên cần kiểm khi "class Tailwind của tôi chẳng làm gì".</p>

<div class="callout ok">
<p><strong>Bạn không buộc phải chọn chỉ một.</strong> App thật thường dùng Tailwind cho component cộng một stylesheet toàn cục nhỏ cho CSS variables và style nền. Đó chính là sự pha trộn mà các bài theme bên dưới dựa vào.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/styling" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Styling</span><span class="lc-sub">Global CSS, CSS Modules, Tailwind, và Sass trong App Router.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/installation/framework-guides/nextjs" target="_blank" rel="noopener">
  <span class="lc-ico">💨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Cài với Next.js</span><span class="lc-sub">Quét content, các directive, và config.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — Tailwind fundamentals: utilities, responsive, states|||13.2 — Nền tảng Tailwind: utility, responsive, trạng thái',
      slug: 'nextjs-13-2-tailwind-nen-tang',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Utility class là các mảnh style một-mục-đích. Tiền tố responsive (md:) và trạng thái (hover:, focus:) đắp thêm điều kiện. Và cách ghép class có điều kiện gọn gàng bằng một hàm cn().',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Small utilities, composed — plus prefixes for responsive and states</h2>
<p class="lead">A Tailwind class does one thing: <code>p-4</code> is padding, <code>text-lg</code> is font size, <code>flex</code> is display. You build a design by composing many of them. Two families of prefixes make them conditional.</p>

<h3>Responsive: mobile-first breakpoints</h3>
<pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"&gt;</code></pre>
<p>An unprefixed utility applies at all sizes; a prefixed one applies from that breakpoint <em>up</em>. So <code>grid-cols-1</code> is the base (mobile), <code>md:grid-cols-2</code> kicks in on medium screens, <code>lg:grid-cols-3</code> on large. Design the small screen first, then layer widths on top — the opposite of desktop-first CSS.</p>

<h3>States: hover, focus, disabled, and more</h3>
<pre><code>&lt;button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 disabled:opacity-50"&gt;</code></pre>
<p>State prefixes apply a utility only in that state. <code>hover:</code>, <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, and the group/peer variants for reacting to a parent or sibling. No separate <code>:hover</code> rule to write elsewhere — the interaction lives on the element.</p>

<h3>The design system is the point</h3>
<p>Values are not arbitrary. <code>p-4</code> is 1rem, <code>p-6</code> is 1.5rem — a fixed spacing scale. Colours come as <code>blue-600</code>, <code>gray-100</code> — a curated palette with consistent steps. Sticking to the scale is what keeps a UI looking intentional; reach for an arbitrary value like <code>p-[13px]</code> only when you truly must.</p>

<h3>Conditional classes without string soup</h3>
<p>You often toggle classes by state. Building the string by hand gets ugly fast; a tiny helper (commonly named <code>cn</code>, wrapping <code>clsx</code> + <code>tailwind-merge</code>) keeps it clean and resolves conflicts:</p>
<pre><code>&lt;button class={cn('rounded px-4 py-2', isActive &amp;&amp; 'bg-blue-600 text-white')}&gt;</code></pre>
<p><code>tailwind-merge</code> also fixes the "last one wins" problem: <code>cn('p-2', 'p-4')</code> yields <code>p-4</code>, not both. You will use this <code>cn</code> pattern in almost every component.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://tailwindcss.com/docs/styling-with-utility-classes" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Utility-first fundamentals</span><span class="lc-sub">Utilities, responsive prefixes, and state variants.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Utility nhỏ, ghép lại — cộng tiền tố cho responsive và trạng thái</h2>
<p class="lead">Một class Tailwind làm một việc: <code>p-4</code> là padding, <code>text-lg</code> là cỡ chữ, <code>flex</code> là display. Bạn dựng một thiết kế bằng cách ghép nhiều cái lại. Hai họ tiền tố làm chúng có điều kiện.</p>

<h3>Responsive: breakpoint mobile-first</h3>
<pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"&gt;</code></pre>
<p>Một utility không tiền tố áp ở mọi kích thước; một cái có tiền tố áp từ breakpoint đó <em>trở lên</em>. Nên <code>grid-cols-1</code> là nền (mobile), <code>md:grid-cols-2</code> bật ở màn trung, <code>lg:grid-cols-3</code> ở màn lớn. Thiết kế màn nhỏ trước, rồi đắp bề rộng lên trên — ngược với CSS desktop-first.</p>

<h3>Trạng thái: hover, focus, disabled, và hơn nữa</h3>
<pre><code>&lt;button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 disabled:opacity-50"&gt;</code></pre>
<p>Tiền tố trạng thái áp một utility chỉ trong trạng thái đó. <code>hover:</code>, <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, và các biến group/peer để phản ứng theo cha hoặc anh em. Không phải viết một luật <code>:hover</code> riêng ở chỗ khác — tương tác nằm ngay trên phần tử.</p>

<h3>Hệ thiết kế mới là điểm chính</h3>
<p>Các giá trị không tuỳ tiện. <code>p-4</code> là 1rem, <code>p-6</code> là 1.5rem — một thang khoảng cách cố định. Màu đến dạng <code>blue-600</code>, <code>gray-100</code> — một bảng màu tuyển với các bước nhất quán. Bám thang đó là điều giữ UI trông có chủ đích; chỉ dùng giá trị tuỳ ý như <code>p-[13px]</code> khi thật sự bắt buộc.</p>

<h3>Class có điều kiện mà không phải nấu súp chuỗi</h3>
<p>Bạn thường bật/tắt class theo state. Ghép chuỗi bằng tay xấu đi rất nhanh; một hàm nhỏ (thường tên <code>cn</code>, bọc <code>clsx</code> + <code>tailwind-merge</code>) giữ gọn và xử lý xung đột:</p>
<pre><code>&lt;button class={cn('rounded px-4 py-2', isActive &amp;&amp; 'bg-blue-600 text-white')}&gt;</code></pre>
<p><code>tailwind-merge</code> còn sửa vấn đề "cái cuối thắng": <code>cn('p-2', 'p-4')</code> ra <code>p-4</code>, không phải cả hai. Bạn sẽ dùng mẫu <code>cn</code> này ở gần như mọi component.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://tailwindcss.com/docs/styling-with-utility-classes" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Nền tảng utility-first</span><span class="lc-sub">Utility, tiền tố responsive, và biến trạng thái.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Dark mode: the dark: variant and no-flicker toggle|||13.3 — Dark mode: biến dark: và bật/tắt không nháy',
      slug: 'nextjs-13-3-dark-mode',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Tailwind bật dark mode bằng tiền tố dark: kích hoạt khi có một class trên <html>. Cách bật/tắt, cách tránh nháy sáng-rồi-tối lúc tải (chạy script trước khi paint), và next-themes.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Dark mode is one variant and one class on &lt;html&gt;</h2>
<p class="lead">Tailwind's <code>dark:</code> prefix applies a utility only in dark mode. The common setup is the <em>class</em> strategy: dark styles activate whenever a chosen class is present on the <code>&lt;html&gt;</code> element, so a toggle just adds or removes that class.</p>

<pre><code>&lt;div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white"&gt;
  Adapts to the theme
&lt;/div&gt;</code></pre>
<p>With the class strategy, these <code>dark:</code> utilities take effect only when the toggle class is on <code>&lt;html&gt;</code>. Toggling the theme is then just toggling one class high in the tree — every <code>dark:</code> utility responds at once.</p>

<h3>The no-flicker problem</h3>
<p>The theme choice lives in <code>localStorage</code>, which is a browser thing — the server does not know it when it renders the HTML. If you apply the class only after React hydrates, the user sees a flash of the wrong theme first. The fix is a tiny script that runs <em>before</em> the first paint, reads the stored preference, and sets the class on <code>&lt;html&gt;</code> immediately.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">A blocking inline script in the document head reads <code>localStorage</code> and adds the theme class before anything paints.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">The first paint is already in the right theme — no flash.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">React hydrates on top; a toggle later just flips the class.</div></div>
</div>
<p>The library <strong>next-themes</strong> does all of this for you — the script, the storage, a <code>useTheme()</code> hook, and system-preference support. Reach for it rather than hand-rolling unless you have a reason not to.</p>

<div class="callout warn">
<p><strong>Because the class isn't on the server render, you will see a hydration warning</strong> on the element you mutate before hydration (usually <code>&lt;html&gt;</code>). That is expected here; the standard fix is <code>suppressHydrationWarning</code> on that element. It is one of the few legitimate uses of that escape hatch.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://tailwindcss.com/docs/dark-mode" target="_blank" rel="noopener">
  <span class="lc-ico">🌓</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Dark Mode</span><span class="lc-sub">The dark: variant, the class strategy, and toggling.</span></span>
</a>
<a class="link-card dl" href="https://github.com/pacocoursey/next-themes" target="_blank" rel="noopener">
  <span class="lc-ico">🌗</span>
  <span class="lc-body"><span class="lc-title">next-themes</span><span class="lc-sub">No-flicker theme handling for Next.js, with system support.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Dark mode là một biến và một class trên &lt;html&gt;</h2>
<p class="lead">Tiền tố <code>dark:</code> của Tailwind áp một utility chỉ trong dark mode. Cách phổ biến là chiến lược <em>class</em>: style tối kích hoạt bất cứ khi nào một class đã chọn có mặt trên phần tử <code>&lt;html&gt;</code>, nên một toggle chỉ việc thêm hoặc bỏ class đó.</p>

<pre><code>&lt;div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white"&gt;
  Thích ứng theo theme
&lt;/div&gt;</code></pre>
<p>Với chiến lược class, các utility <code>dark:</code> này chỉ có tác dụng khi class toggle nằm trên <code>&lt;html&gt;</code>. Đổi theme khi đó chỉ là bật/tắt một class cao trong cây — mọi utility <code>dark:</code> phản hồi cùng lúc.</p>

<h3>Vấn đề nháy màn</h3>
<p>Lựa chọn theme nằm trong <code>localStorage</code>, vốn là thứ của trình duyệt — server không biết nó lúc render HTML. Nếu bạn chỉ áp class sau khi React hydrate, người dùng thấy một nháy sai theme trước. Cách chữa là một script bé chạy <em>trước</em> lần paint đầu, đọc lựa chọn đã lưu, và đặt class lên <code>&lt;html&gt;</code> ngay.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Một script inline chặn trong head đọc <code>localStorage</code> và thêm class theme trước khi bất cứ gì paint.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Lần paint đầu đã đúng theme — không nháy.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">React hydrate lên trên; một toggle sau đó chỉ lật class.</div></div>
</div>
<p>Thư viện <strong>next-themes</strong> làm hết cho bạn — script, lưu trữ, một hook <code>useTheme()</code>, và hỗ trợ theo hệ thống. Hãy dùng nó thay vì tự chế trừ khi có lý do.</p>

<div class="callout warn">
<p><strong>Vì class không có trên bản render của server, bạn sẽ thấy một cảnh báo hydration</strong> ở phần tử bạn sửa trước hydration (thường là <code>&lt;html&gt;</code>). Ở đây điều đó là bình thường; cách sửa chuẩn là <code>suppressHydrationWarning</code> trên phần tử đó. Đây là một trong số ít lần dùng cửa thoát đó là chính đáng.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://tailwindcss.com/docs/dark-mode" target="_blank" rel="noopener">
  <span class="lc-ico">🌓</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Dark Mode</span><span class="lc-sub">Biến dark:, chiến lược class, và toggle.</span></span>
</a>
<a class="link-card dl" href="https://github.com/pacocoursey/next-themes" target="_blank" rel="noopener">
  <span class="lc-ico">🌗</span>
  <span class="lc-body"><span class="lc-title">next-themes</span><span class="lc-sub">Xử lý theme không nháy cho Next.js, có hỗ trợ hệ thống.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Theming with CSS variables (and a naming trap)|||13.4 — Theme bằng CSS variables (và bẫy đặt tên)',
      slug: 'nextjs-13-4-theme-css-variables',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Nhiều theme (không chỉ sáng/tối) làm gọn bằng CSS variables: định nghĩa màu theo biến, đổi theme là đổi giá trị biến. Kèm bẫy tên class thật của cuongthai.com: class dark toàn cục phải là theme-dark, KHÔNG phải dark.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>For real theming, drive colours through CSS variables</h2>
<p class="lead">Writing <code>dark:</code> on every element works for two themes. But when you have several themes, or want one source of truth for "the primary text colour," CSS custom properties are cleaner: define semantic variables, and switch a theme by changing the variables' values in one place.</p>

<pre><code><span class="tok-comment">/* globals.css */</span>
:root            { --text-primary: #111; --surface: #fff; }
html.theme-dark  { --text-primary: #eee; --surface: #0b0b0b; }
html.theme-brown { --text-primary: #f3e9d8; --surface: #2b211a; }

<span class="tok-comment">/* components read the variable, not a fixed colour */</span>
.card { color: var(--text-primary); background: var(--surface); }</code></pre>
<p>Now a component never hard-codes a colour; it reads <code>var(--text-primary)</code>. Switching themes is swapping the class on <code>&lt;html&gt;</code>, and every element re-colours from the new variable values. This scales to any number of themes without touching component code.</p>

<div class="note-ct">
<p><strong>The exact naming trap cuongthai.com hit, so you don't:</strong> the site's global dark theme uses the class <strong><code>theme-dark</code></strong> on <code>&lt;html&gt;</code> — deliberately NOT <code>dark</code>. Why: Tailwind's <code>dark:</code> variant is reserved for one feature (the Notes editor, which has its own light/dark/brown switcher via a <code>.dark</code> class scoped to its own wrapper). Early on, putting a plain <code>.dark</code> class on <code>&lt;html&gt;</code> globally force-activated <em>every</em> Tailwind <code>dark:</code> utility inside Notes and broke its own theme switcher. Rule that came out of it: the global theme class is <code>theme-dark</code>; global theme-dependent styles use <code>html.theme-dark ...</code> CSS or the CSS variables — Tailwind <code>dark:</code> stays reserved for the scoped Notes wrapper. Two theme systems in one app must not share the same activation class.</p>
</div>

<h3>Semantic names beat literal ones</h3>
<p>Name variables by <em>role</em> — <code>--text-primary</code>, <code>--surface</code>, <code>--border</code> — not by colour (<code>--gray-900</code>). A role survives a redesign; a literal colour name becomes a lie the moment the palette changes. This is the same tokens idea Tailwind ships, applied to your own multi-theme setup.</p>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">MDN — CSS custom properties</span><span class="lc-sub">Defining and using CSS variables for theming.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Muốn theme thật sự, hãy điều khiển màu qua CSS variables</h2>
<p class="lead">Viết <code>dark:</code> lên mỗi phần tử thì ổn cho hai theme. Nhưng khi bạn có nhiều theme, hoặc muốn một nguồn sự thật cho "màu chữ chính", CSS custom property gọn hơn: định nghĩa các biến ngữ nghĩa, và đổi theme bằng cách đổi giá trị biến ở một chỗ.</p>

<pre><code><span class="tok-comment">/* globals.css */</span>
:root            { --text-primary: #111; --surface: #fff; }
html.theme-dark  { --text-primary: #eee; --surface: #0b0b0b; }
html.theme-brown { --text-primary: #f3e9d8; --surface: #2b211a; }

<span class="tok-comment">/* component đọc biến, không phải màu cố định */</span>
.card { color: var(--text-primary); background: var(--surface); }</code></pre>
<p>Giờ một component không bao giờ ghi cứng một màu; nó đọc <code>var(--text-primary)</code>. Đổi theme là tráo class trên <code>&lt;html&gt;</code>, và mọi phần tử tô lại theo giá trị biến mới. Cái này mở rộng tới bao nhiêu theme cũng được mà không đụng code component.</p>

<div class="note-ct">
<p><strong>Đúng cái bẫy tên mà cuongthai.com dính, để bạn khỏi dính:</strong> theme tối toàn cục của site dùng class <strong><code>theme-dark</code></strong> trên <code>&lt;html&gt;</code> — cố tình KHÔNG phải <code>dark</code>. Vì sao: biến <code>dark:</code> của Tailwind được dành riêng cho một tính năng (trình soạn Notes, vốn có bộ chuyển sáng/tối/nâu riêng qua một class <code>.dark</code> khoanh vào wrapper của chính nó). Lúc đầu, đặt một class <code>.dark</code> thường lên <code>&lt;html&gt;</code> toàn cục đã force-kích hoạt <em>mọi</em> utility <code>dark:</code> của Tailwind bên trong Notes và làm hỏng bộ chuyển theme của chính nó. Quy tắc rút ra: class theme toàn cục là <code>theme-dark</code>; style theo theme toàn cục dùng CSS <code>html.theme-dark ...</code> hoặc CSS variables — <code>dark:</code> của Tailwind vẫn để dành cho wrapper Notes khoanh vùng. Hai hệ theme trong một app không được chung một class kích hoạt.</p>
</div>

<h3>Tên ngữ nghĩa hơn tên chữ đen</h3>
<p>Đặt tên biến theo <em>vai trò</em> — <code>--text-primary</code>, <code>--surface</code>, <code>--border</code> — không theo màu (<code>--gray-900</code>). Một vai trò sống sót qua một lần thiết kế lại; một tên màu chữ đen thành lời nói dối ngay khi bảng màu đổi. Đây là cùng ý tưởng tokens Tailwind kèm sẵn, áp cho bộ nhiều theme của chính bạn.</p>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">MDN — CSS custom properties</span><span class="lc-sub">Định nghĩa và dùng CSS variables cho theme.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: '13.5 — Styling at scale, and the black-on-black trap|||13.5 — Style ở quy mô lớn, và bẫy chữ đen trên nền đen',
      slug: 'nextjs-13-5-scale-va-bay-mau',
      type: 'VIDEO',
      isFreePreview: false,
      description: 'Giữ style gọn khi app lớn: cn() + biến class (variants). Và một bẫy màu thật của cuongthai.com: nền tối CỐ ĐỊNH + chữ theo biến theme = chữ đen trên nền đen — phải đặt cả color, không chỉ ghim biến nền.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.5</span>
<h2>Keeping styles sane as the app grows</h2>
<p class="lead">A handful of Tailwind classes on a button is fine. A hundred components with a dozen variants each needs a little structure, or the class strings become unreadable and inconsistent.</p>

<h3>Variants over copy-paste</h3>
<p>When a component has variations — a button that is primary/secondary/danger, small/large — don't scatter conditional strings. Define the variants once (a lookup object, or a helper like <code>class-variance-authority</code>) and pick by prop:</p>
<pre><code>const button = cva('rounded font-medium', {
  variants: {
    intent: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },
    size:   { sm: 'px-2 py-1 text-sm', lg: 'px-5 py-3 text-lg' },
  },
});
&lt;button class={button({ intent: 'primary', size: 'lg' })}&gt;</code></pre>
<p>Now variants are declared in one place, type-checked, and consistent everywhere the component is used.</p>

<div class="pitfall">
<p><strong>The black-on-black trap — a real, costly cuongthai.com bug.</strong> A component had a <em>fixed</em> dark background (e.g. a permanently dark hero or card) but its text colour came from a theme variable. In light theme, that variable resolves to a dark colour — so you get dark text on a fixed dark background: invisible. The lesson, learned across ~140 files: <strong>pinning a background via a variable is not enough — you must also set an explicit <code>color</code> on any surface that is fixed-dark regardless of theme.</strong> A surface that does not follow the theme cannot borrow the theme's text colour. And do not trust a raw count of "how many elements use the variable" — verify by actually flipping light↔dark and looking, because the failure only shows in the theme where the variable's colour collides with the fixed surface.</p>
</div>

<div class="callout ok">
<p><strong>How to catch it:</strong> test every screen in <em>both</em> themes, not just the one you built in. Most theme bugs are invisible in the theme you developed in and only appear when you flip. A quick light/dark toggle pass before shipping catches the whole class of "unreadable in the other theme" problems.</p>
</div>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://cva.style/docs" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">cva — Class Variance Authority</span><span class="lc-sub">Type-safe component variants for Tailwind.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.5</span>
<h2>Giữ style tỉnh táo khi app lớn lên</h2>
<p class="lead">Vài class Tailwind trên một nút thì ổn. Một trăm component mỗi cái chục biến thể thì cần chút cấu trúc, kẻo chuỗi class thành khó đọc và thiếu nhất quán.</p>

<h3>Biến thể thay vì copy-paste</h3>
<p>Khi một component có biến thể — nút primary/secondary/danger, nhỏ/lớn — đừng rải chuỗi điều kiện. Định nghĩa biến thể một lần (một object tra cứu, hoặc một hàm như <code>class-variance-authority</code>) và chọn theo prop:</p>
<pre><code>const button = cva('rounded font-medium', {
  variants: {
    intent: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },
    size:   { sm: 'px-2 py-1 text-sm', lg: 'px-5 py-3 text-lg' },
  },
});
&lt;button class={button({ intent: 'primary', size: 'lg' })}&gt;</code></pre>
<p>Giờ biến thể được khai ở một chỗ, kiểm kiểu, và nhất quán ở mọi nơi component được dùng.</p>

<div class="pitfall">
<p><strong>Bẫy chữ đen trên nền đen — một bug thật, trả giá đắt của cuongthai.com.</strong> Một component có nền tối <em>cố định</em> (ví dụ một hero hay card luôn tối) nhưng màu chữ lấy từ một biến theme. Ở theme sáng, biến đó ra một màu tối — nên bạn có chữ tối trên nền tối cố định: vô hình. Bài học, rút ra qua ~140 file: <strong>ghim nền bằng một biến là CHƯA đủ — bạn phải đặt cả một <code>color</code> tường minh trên bất kỳ mặt nào tối-cố-định bất kể theme.</strong> Một mặt không theo theme thì không thể mượn màu chữ của theme. Và đừng tin con số thô "bao nhiêu phần tử dùng biến" — hãy verify bằng cách thật sự lật sáng↔tối và nhìn, vì lỗi chỉ hiện ở theme mà màu của biến đụng với mặt cố định.</p>
</div>

<div class="callout ok">
<p><strong>Cách bắt nó:</strong> test mọi màn ở <em>cả hai</em> theme, không chỉ cái bạn dựng bằng. Đa số bug theme vô hình ở theme bạn phát triển và chỉ hiện khi lật. Một lượt toggle sáng/tối nhanh trước khi ship bắt trọn loại lỗi "không đọc được ở theme kia".</p>
</div>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://cva.style/docs" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">cva — Class Variance Authority</span><span class="lc-sub">Biến thể component kiểu-an-toàn cho Tailwind.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.6 QUIZ ─────────────────────────── */
    {
      title: '13.6 — Chapter 13 quiz|||13.6 — Kiểm tra chương 13',
      slug: 'nextjs-13-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về styling: các lựa chọn và vì sao Tailwind, utility/responsive/state, cn()+tailwind-merge, dark: và class strategy, no-flicker, CSS variables theme, bẫy theme-dark vs dark, và bẫy chữ đen trên nền đen.',
      content: `
<div class="ml-en">
<p class="lead">Ten questions on Chapter 13: styling options and why Tailwind, utilities/responsive/state prefixes, cn + tailwind-merge, the dark: variant and class strategy, no-flicker theming, CSS-variable themes, and the two real theme traps.</p>
</div>
<div class="ml-vi">
<p class="lead">Mười câu cho Chương 13: lựa chọn styling và vì sao Tailwind, tiền tố utility/responsive/state, cn + tailwind-merge, biến dark: và chiến lược class, theme không nháy, theme bằng CSS variables, và hai bẫy theme thật.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the main problem Tailwind solves for CSS at scale?|||Tailwind giải quyết vấn đề chính gì của CSS ở quy mô lớn?',
            options: [
              'it makes CSS run faster|||nó làm CSS chạy nhanh hơn',
              'naming and the fear of editing shared classes — utilities live inline with the markup|||đặt tên và nỗi sợ sửa class dùng chung — utility nằm cùng markup',
              'it removes the need for HTML|||nó bỏ nhu cầu HTML',
              'it only works in dark mode|||nó chỉ chạy trong dark mode',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In "grid-cols-1 md:grid-cols-2", what does md: mean?|||Trong "grid-cols-1 md:grid-cols-2", md: nghĩa là gì?',
            options: [
              'medium priority|||ưu tiên trung bình',
              'apply from the medium breakpoint upward (mobile-first)|||áp từ breakpoint trung trở lên (mobile-first)',
              'only on medium screens exactly|||chỉ đúng màn trung',
              'a typo|||lỗi gõ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why use a cn() helper (clsx + tailwind-merge) for conditional classes?|||Vì sao dùng hàm cn() (clsx + tailwind-merge) cho class có điều kiện?',
            options: [
              'it is required by Next.js|||Next.js bắt buộc',
              'it composes classes cleanly and resolves conflicts so the last wins (p-2 + p-4 → p-4)|||nó ghép class gọn và xử lý xung đột để cái cuối thắng (p-2 + p-4 → p-4)',
              'it makes classes global|||nó làm class thành toàn cục',
              'it disables Tailwind|||nó tắt Tailwind',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With the Tailwind class strategy, when do dark: utilities take effect?|||Với chiến lược class của Tailwind, các utility dark: có tác dụng khi nào?',
            options: [
              'always|||luôn luôn',
              'when the chosen class is present on <html>|||khi class đã chọn có trên <html>',
              'only at night|||chỉ ban đêm',
              'when localStorage is empty|||khi localStorage rỗng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does dark mode flicker on load if handled only after hydration?|||Vì sao dark mode nháy lúc tải nếu chỉ xử lý sau hydration?',
            options: [
              'React is slow|||React chậm',
              'the theme is in localStorage (client-only); the server HTML renders in the wrong theme first|||theme ở localStorage (chỉ client); HTML server render sai theme trước',
              'Tailwind has a bug|||Tailwind có bug',
              'the CSS file is too big|||file CSS quá lớn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The standard way to prevent theme flicker is…|||Cách chuẩn để tránh nháy theme là…',
            options: [
              'disable dark mode|||tắt dark mode',
              'a blocking inline script that sets the theme class before first paint (or next-themes)|||một script inline chặn đặt class theme trước lần paint đầu (hoặc next-themes)',
              'a useEffect|||một useEffect',
              'reload twice|||tải lại hai lần',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'For many themes (not just light/dark), the cleaner approach is…|||Cho nhiều theme (không chỉ sáng/tối), cách gọn hơn là…',
            options: [
              'write dark: on every element|||viết dark: lên mọi phần tử',
              'semantic CSS variables (var(--text-primary)) whose values change per theme|||CSS variables ngữ nghĩa (var(--text-primary)) đổi giá trị theo theme',
              'inline styles|||style inline',
              'a separate site per theme|||một site riêng cho mỗi theme',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'On cuongthai.com, why is the global dark class named theme-dark, not dark?|||Trên cuongthai.com, vì sao class tối toàn cục tên theme-dark, không phải dark?',
            options: [
              'personal preference|||sở thích cá nhân',
              'a plain .dark on <html> would force-activate every Tailwind dark: utility (reserved for the scoped Notes editor) and break it|||một .dark thường trên <html> sẽ force mọi utility dark: của Tailwind (dành cho Notes khoanh vùng) và làm hỏng nó',
              'dark is an invalid class name|||dark là tên class không hợp lệ',
              'Tailwind requires theme-dark|||Tailwind bắt buộc theme-dark',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A fixed-dark card shows invisible text in light theme. The root cause?|||Một card tối-cố-định hiện chữ vô hình ở theme sáng. Nguyên nhân gốc?',
            options: [
              'the font is missing|||thiếu font',
              'text colour comes from a theme variable that resolves dark in light theme, on a fixed-dark surface — set an explicit color|||màu chữ lấy từ biến theme ra màu tối ở theme sáng, trên mặt tối-cố-định — phải đặt color tường minh',
              'the card is too small|||card quá nhỏ',
              'dark mode is on|||dark mode đang bật',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The reliable way to catch "unreadable in the other theme" bugs is…|||Cách đáng tin để bắt bug "không đọc được ở theme kia" là…',
            options: [
              'count how many elements use the variable|||đếm bao nhiêu phần tử dùng biến',
              'actually flip light↔dark and look at every screen in both|||thật sự lật sáng↔tối và nhìn mọi màn ở cả hai',
              'read the CSS file|||đọc file CSS',
              'trust that variables always work|||tin rằng biến luôn chạy đúng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
