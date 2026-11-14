/**
 * Next.js & React — Chương 13: Styling, Tailwind & theme. MỞ GIAI ĐOẠN 4.
 * Song ngữ EN/VI. Escape trong code: &lt; &gt; cho < >, &#96; cho backtick, \${ cho ${.
 *
 * Thuần kỹ thuật styling — không có output console để chạy. Sự cố THẬT cuongthai.com
 * lồng vào .note-ct/.pitfall: `.dark` vs `theme-dark` (class dark toàn cục force mọi
 * Tailwind dark: trong Notes), và "chữ đen trên nền đen" (nền tối cố định + màu chữ
 * theo biến theme = phải đặt cả color, không chỉ ghim biến).
 */

import G13_1 from './giang/nxj-13-1.mjs';
import G13_2 from './giang/nxj-13-2.mjs';
import G13_3 from './giang/nxj-13-3.mjs';
import G13_4 from './giang/nxj-13-4.mjs';
import G13_5 from './giang/nxj-13-5.mjs';
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
${G13_1}
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

<pre><code class="language-html"><span class="tok-comment">// the same button, Tailwind way</span>
&lt;button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;
  Save
&lt;/button&gt;</code></pre>

<h3>How it is wired in a Next.js app</h3>
<p>Tailwind scans your files for class names and generates only the CSS you actually used. <em>Which</em> files it scans depends on the major version. <b>Tailwind 4</b> — what <code>create-next-app</code> 16 installs — has no config file: <code>globals.css</code> starts with <code>@import "tailwindcss";</code> and the scanner reads every file in the project except git-ignored ones, <code>node_modules</code>, CSS files and binaries; you add a skipped path with <code>@source "../path";</code>. <b>Tailwind 3</b> — what cuongthai.com runs — scans <em>only</em> the files matched by the <code>content</code> globs in <code>tailwind.config</code>, and pulls itself in with three <code>@tailwind</code> directives. Either way, a class in a file the scanner skips silently produces no styles — the first thing to check when "my Tailwind class does nothing."</p>

<div class="callout warn">
<p><strong>Measured on a fresh <code>create-next-app</code> 16.4.6 with Tailwind:</strong> CSS Modules silently do nothing. The generated <code>next.config.ts</code> sends every <code>*.css</code> through the Tailwind loader with <code>as: "*.css"</code>, so <code>Button.module.css</code> is treated as plain global CSS — <code>styles.btn</code> is <code>undefined</code>, the element gets no class, and <code>tsc</code> stays green. Delete that <code>as</code> line (the loader's own README does not have it): module names are hashed again and Tailwind keeps working.</p>
</div>
<div class="callout ok">
<p><strong>You do not have to choose only one.</strong> A real app often uses Tailwind for components plus a small global stylesheet for CSS variables and base styles. That is exactly the mix the theming lessons below rely on.</p>
</div>

<h3>The styling options, and what each costs</h3>
<div class="lz-map">
  <div class="lz-stage">Pick by how the styles are scoped and when they load</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tailwind utilities</div><div class="lz-nsub">Classes in the markup. No naming, no dead CSS, and the styles for a component travel with it. The cost is verbose class strings.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">CSS Modules</div><div class="lz-nsub">&#96;styles.card&#96; from a &#96;.module.css&#96; file. Real CSS with local scoping — good when you want the cascade back.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Global CSS</div><div class="lz-nsub">One file, imported in the root layout. For resets, fonts and CSS variables; not for component styling.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">CSS-in-JS</div><div class="lz-nsub">Runtime libraries need &#96;&#39;use client&#39;&#96;, which pulls the component into the bundle. Prefer a zero-runtime option in the App Router.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — building a class name from a variable, so Tailwind never generates it.</strong> &#96;className={&#96;text-\${color}-500&#96;}&#96; produces &#96;text-red-500&#96; at runtime and nothing at build time: Tailwind scans your source as plain text and only keeps classes it can literally see, so that class was never written into the CSS file. The element renders with no colour at all, and nothing errors — the class is in the DOM, it just does not exist in the stylesheet. Write the complete class names out (a lookup object mapping &#96;red&#96; to &#96;&#39;text-red-500&#39;&#96;), or force them in — &#96;safelist&#96; in Tailwind 3, &#96;@source inline("text-red-500")&#96; in Tailwind 4. This is the single most common Tailwind bug, and it can hide: measured below, the broken page "worked" as soon as another file spelled &#96;text-red-500&#96; out.</p></div>
<a class="link-card dl" href="https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names" target="_blank" rel="noopener">
  <span class="lc-ico">🚨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Dynamic class names</span><span class="lc-sub">The official warning about this exact trap, with the recommended pattern.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/styling" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Styling</span><span class="lc-sub">Every supported approach, with the App Router caveats for each.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Style one component three ways: a CSS Module, inline styles, and Tailwind utility classes; compare the developer experience.</li>
<li>Open <code>globals.css</code> (Tailwind 4: <code>@import "tailwindcss";</code>; Tailwind 3: the three <code>@tailwind</code> directives) and confirm utilities work in a component — then <code>grep</code> the built CSS for one of them.</li>
<li>Write one sentence on why utility classes reduce the naming problem of plain CSS.</li>
</ol>
<p><strong>Done when:</strong> you have tried the main styling options and can say why Tailwind is this course's default.</p></div>

<h3>🔬 Measured: four buttons, the scanner, and a missing class (Next.js 16.4.6 · Tailwind 4.3.3)</h3>
<p>One button styled four ways in a fresh <code>create-next-app</code>, built, then the HTML and the CSS read back:</p>
<pre><code class="language-tsx">import styles from './Nut.module.css';

export default function Trang() {
  return (
    &lt;main className="flex flex-col items-start gap-4 p-6 text-xl"&gt;
      &lt;button className="nut-global"&gt;1 · global CSS&lt;/button&gt;
      &lt;button className={styles.nut}&gt;2 · CSS Module&lt;/button&gt;
      &lt;button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;3 · Tailwind&lt;/button&gt;
      &lt;button style={{ borderRadius: 8, background: '#2563eb', padding: '8px 16px', color: '#fff' }}&gt;4 · inline style&lt;/button&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ curl -s localhost:3000/nut | grep -o '&lt;button[^&gt;]*&gt;'      # bốn cái nút trong HTML thật
&lt;button class="nut-global"&gt;
&lt;button&gt;
&lt;button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;
&lt;button style="border-radius:8px;background:#2563eb;padding:8px 16px;color:#fff"&gt;
$ find .next/static -name '*.css' | xargs wc -c      # tệp CSS sau build
     101 0676obh1g-k3z.css
   15346 0zyhz5aaj7ylm.css
   15447 total
$ for s in '.nut-global{' '.nut{' '.bg-blue-600{' '.hover\\:bg-blue-700:hover{'; do printf '%-27s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s") tệp CSS có"; done
.nut-global{                1 tệp CSS có
.nut{                       1 tệp CSS có
.bg-blue-600{               1 tệp CSS có
.hover\\:bg-blue-700:hover{  1 tệp CSS có</div>
<p>The CSS Module button has <b>no class</b>, and the CSS holds an unscoped <code>.nut{{…}}</code>. After deleting <code>as: "*.css"</code> from <code>next.config.ts</code>:</p>
<div class="out">$ curl -s localhost:3000/nut | grep -o '&lt;button[^&gt;]*&gt;' | sed -n 2p
&lt;button class="u-Rnhq_nut"&gt;
$ cat .next/static/chunks/*.css | grep -oE '\\.[A-Za-z0-9_-]*nut\\{[^}]*\\}' | head -2
.u-Rnhq_nut{color:#fff;background:#2563eb;border-radius:8px;padding:8px 16px}</div>
<p><b>What the scanner keeps.</b> Only the colours written in the source; a class only in <code>README.md</code> is generated, one in the git-ignored <code>/build</code> is not until <code>@source</code>:</p>
<div class="out">$ grep -oE -- '--color-[a-z]+-[0-9]+:' node_modules/tailwindcss/theme.css | wc -l | sed 's/^ */màu có sẵn trong bảng của Tailwind 4.3.3: /'
màu có sẵn trong bảng của Tailwind 4.3.3: 286
$ cat .next/static/chunks/*.css | grep -oE '\\.bg-[a-z]+-[0-9]+' | sort -u | tr '\\n' ' '; echo
.bg-blue-600 .bg-zinc-50 
$ cat .next/static/chunks/*.css | grep -oE '\\.(bg|text)-(pink|lime)-500' | sort -u | wc -l | sed 's/^ */lớp pink\\/lime trong CSS: /'
lớp pink/lime trong CSS: 0
$ echo 'Màu thương hiệu: bg-pink-500' &gt;&gt; README.md      # lớp chỉ nằm trong README
$ mkdir build &amp;&amp; echo '&lt;div class="bg-lime-500"&gt;' &gt; build/nhap.html      # thư mục /build có trong .gitignore
/build
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled'
✓ Compiled successfully in 466ms
$ for s in '.bg-pink-500{' '.bg-lime-500{'; do printf '%-16s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s")"; done
.bg-pink-500{    1
.bg-lime-500{    0
$ sed -i '' '1a\\'$'\\n''@source "../../build";' src/app/globals.css      # chỉ đích danh thư mục bị bỏ qua
@import "tailwindcss";
@source "../../build";
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled'
✓ Compiled successfully in 264ms
$ for s in '.bg-pink-500{' '.bg-lime-500{'; do printf '%-16s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s")"; done
.bg-pink-500{    1
.bg-lime-500{    1</div>
<p><b>The dynamic class.</b> In the DOM, not in the CSS; Chromium paints the body colour:</p>
<pre><code class="language-tsx">const mau = 'red'; <span class="tok-comment">  // giả sử đến từ props / cơ sở dữ liệu</span>

export default function Trang() {
  return &lt;p id="sai" className={&#96;text-\${mau}-500 p-6 text-3xl font-bold&#96;}&gt;Chữ này phải màu đỏ&lt;/p&gt;;
}</code></pre>
<div class="out">$ curl -s localhost:3000/mau | grep -o '&lt;p id="sai"[^&gt;]*&gt;'      # lớp CÓ trong DOM
&lt;p id="sai" class="text-red-500 p-6 text-3xl font-bold"&gt;
$ printf '%-16s %s\\n' '.text-red-500{' "$(cat .next/static/chunks/*.css | grep -cF '.text-red-500{') tệp CSS có"
.text-red-500{   0 tệp CSS có
Chromium · getComputedStyle(#sai).color = rgb(23, 23, 23)</div>
<p>Add a lookup page that spells <code>text-red-500</code> out (and a page whose <em>comment</em> mentions <code>text-amber-500</code>) — and the untouched broken page turns red too:</p>
<div class="out">$ for s in '.text-red-500{' '.text-green-600{' '.text-amber-500{'; do printf '%-18s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s") tệp CSS có"; done
.text-red-500{     1 tệp CSS có
.text-green-600{   1 tệp CSS có
.text-amber-500{   1 tệp CSS có
/mau2 (lookup) color = lab(55.4814 75.0732 48.8528)
/mau  (unchanged) color = lab(55.4814 75.0732 48.8528)</div>
<p><b>Tailwind 3</b> (Next 14.2.35 + 3.4.19, the cuongthai.com stack): a class map in <code>lib/</code> outside the <code>content</code> globs, before and after adding the folder:</p>
<div class="out">$ for s in '.bg-lime-500\\/20{' '.text-lime-700{' '.border-lime-500{'; do printf '%-20s %s\\n' "$s" "$(cat .next/static/css/*.css | grep -cF "$s")"; done
.bg-lime-500\\/20{    0
.text-lime-700{      0
.border-lime-500{    0
$ content: ['./app/**/*.{js,jsx}', './lib/**/*.js']      # thêm thư mục lib/
  content: ['./app/**/*.{js,jsx}', './lib/**/*.js'],
$ for s in '.bg-lime-500\\/20{' '.text-lime-700{' '.border-lime-500{'; do printf '%-20s %s\\n' "$s" "$(cat .next/static/css/*.css | grep -cF "$s")"; done
.bg-lime-500\\/20{    1
.text-lime-700{      1
.border-lime-500{    1</div>
<p><b>And on cuongthai.com today.</b> <code>tailwind.config.ts</code> does not scan <code>src/lib</code>; every colour class in <code>src/lib/*.ts</code> checked against the live CSS:</p>
<div class="out">$ grep -E '"(next|tailwindcss)"' package.json
    "next": "^14.2.15",
    "tailwindcss": "^3.4.14",
$ sed -n '4,8p' tailwind.config.ts      # content KHÔNG có ./src/lib
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
$ sed -n '22p' src/lib/repos.ts
  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
$ python3 doi-css.py      # mọi lớp trong src/lib/*.ts so với CSS THẬT của cuongthai.com hôm nay
CSS prod: 705.624 byte
src/lib/linkify.tsx: 1 lớp · VẮNG trong CSS prod: 0
src/lib/repos.ts: 47 lớp · VẮNG trong CSS prod: 7 → bg-indigo-500/20 bg-lime-500/20 bg-pink-500/20 border-lime-500/30 border-pink-500/30 text-lime-300 text-yellow-200
src/lib/studio-meta.ts: 18 lớp · VẮNG trong CSS prod: 1 → ring-cyan-500/30</div>
<p>Seven badge classes in <code>src/lib/repos.ts</code> do not exist — the Shell badge has no colour at all, Swift/C++ and C# lose their background — with no error anywhere.</p>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npx create-next-app@latest my-app <span class="tok-comment">  # TypeScript, Tailwind = Yes</span>
cd my-app &amp;&amp; grep -n 'as:' next.config.ts <span class="tok-comment">  # the line that turns .module.css into plain CSS</span>
npm run build &amp;&amp; cat .next/static/chunks/*.css | grep -c '.text-red-500{' <span class="tok-comment">  # 0 = the class does not exist</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-0-3-bon-bo-phan" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 0.3 — The four moving parts</span><span class="lc-sub">Scanner, config, layers, output — and which one breaks</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-8-4-glob-hong" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 8.4 — A fast build is a symptom</span><span class="lc-sub">The broken content glob that makes a build suspiciously quick</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a3-2-slot20-nextjs-tailwind-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · A3.2 — Next.js & Tailwind CSS (Slot 20)</span><span class="lc-sub">The same topic, slide by slide, in the FER202 course</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSS Module</span><span class="v">Scoped CSS files (<code>.module.css</code>) with locally-unique class names.</span></div>
  <div class="kv"><span class="k">Inline styles</span><span class="v">A <code>style</code> object on an element — quick but limited.</span></div>
  <div class="kv"><span class="k">Tailwind CSS</span><span class="v">Utility classes applied in markup instead of separate CSS.</span></div>
  <div class="kv"><span class="k">Utility class</span><span class="v">A single-purpose class like <code>p-4</code> or <code>flex</code>.</span></div>
  <div class="kv"><span class="k">globals.css</span><span class="v">Where Tailwind's directives and global styles live.</span></div>
  <div class="kv"><span class="k">Naming problem</span><span class="v">Plain CSS forces you to invent class names; utilities do not.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>You can style with CSS Modules, inline styles, or utility classes — each with trade-offs.</li><li>Tailwind applies single-purpose utility classes in the markup, removing the naming burden of plain CSS.</li><li>Tailwind directives live in <code>globals.css</code>, imported in the root layout.</li><li>This course uses Tailwind because cuongthai.com does.</li></ul>

<h3>📚 Learn deeper</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/styling" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Styling</span><span class="lc-sub">Global CSS, CSS Modules, Tailwind, and Sass in the App Router.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/installation/framework-guides/nextjs" target="_blank" rel="noopener">
  <span class="lc-ico">💨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Install with Next.js</span><span class="lc-sub">The setup for the current major version (Tailwind 4: one import, no config file).</span></span>
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

<pre><code class="language-html"><span class="tok-comment">// cùng cái nút, kiểu Tailwind</span>
&lt;button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;
  Lưu
&lt;/button&gt;</code></pre>

<h3>Nó được nối trong app Next.js ra sao</h3>
<p>Tailwind quét file của bạn tìm tên class và chỉ sinh ra CSS bạn thật sự dùng. Quét <em>những file nào</em> thì tuỳ phiên bản lớn. <b>Tailwind 4</b> — thứ <code>create-next-app</code> 16 cài — không có file config: <code>globals.css</code> mở đầu bằng <code>@import "tailwindcss";</code> và bộ quét đọc mọi file trong dự án trừ file bị gitignore, <code>node_modules</code>, file CSS và file nhị phân; muốn thêm đường bị bỏ qua thì viết <code>@source "../duong-dan";</code>. <b>Tailwind 3</b> — thứ cuongthai.com đang chạy — <em>chỉ</em> quét file khớp các glob <code>content</code> trong <code>tailwind.config</code>, và kéo mình vào bằng ba chỉ thị <code>@tailwind</code>. Bản nào cũng vậy: class nằm trong file bộ quét bỏ qua thì âm thầm không tạo style nào — điều đầu tiên cần kiểm khi "class Tailwind của tôi chẳng làm gì".</p>

<div class="callout warn">
<p><strong>Đo trên app <code>create-next-app</code> 16.4.6 mới tạo, có Tailwind:</strong> CSS Modules lặng lẽ không chạy. File <code>next.config.ts</code> được sinh ra đưa mọi <code>*.css</code> qua bộ nạp Tailwind kèm <code>as: "*.css"</code>, nên <code>Button.module.css</code> bị coi như CSS toàn cục thường — <code>styles.btn</code> là <code>undefined</code>, phần tử không có class, mà <code>tsc</code> vẫn xanh. Xoá dòng <code>as</code> đó (README của chính bộ nạp không có dòng này): tên trong module lại được băm và Tailwind vẫn chạy.</p>
</div>
<div class="callout ok">
<p><strong>Bạn không buộc phải chọn chỉ một.</strong> App thật thường dùng Tailwind cho component cộng một stylesheet toàn cục nhỏ cho CSS variables và style nền. Đó chính là sự pha trộn mà các bài theme bên dưới dựa vào.</p>
</div>

<h3>Các lựa chọn tô kiểu, và mỗi cái tốn gì</h3>
<div class="lz-map">
  <div class="lz-stage">Chọn theo cách style được giới hạn phạm vi và thời điểm nó tải</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Utility của Tailwind</div><div class="lz-nsub">Class viết thẳng trong markup. Không phải đặt tên, không có CSS chết, và style của một component đi theo component đó. Cái giá là những chuỗi class dài dòng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">CSS Modules</div><div class="lz-nsub">&#96;styles.card&#96; lấy từ một file &#96;.module.css&#96;. CSS thật với phạm vi cục bộ — tốt khi bạn muốn lấy lại phép đổ tầng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">CSS toàn cục</div><div class="lz-nsub">Một file, import trong layout gốc. Dành cho reset, font và biến CSS; không dành để tô component.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">CSS-in-JS</div><div class="lz-nsub">Các thư viện chạy lúc runtime cần &#96;&#39;use client&#39;&#96;, thứ kéo component vào gói. Trong App Router hãy ưu tiên loại không có runtime.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — ghép tên class từ một biến, và Tailwind chẳng bao giờ sinh ra nó.</strong> &#96;className={&#96;text-\${color}-500&#96;}&#96; cho ra &#96;text-red-500&#96; lúc chạy và cho ra con số không lúc build: Tailwind quét mã nguồn của bạn như chữ thuần và chỉ giữ những class nó nhìn thấy nguyên văn, nên cái class đó chưa từng được viết vào file CSS. Phần tử vẽ ra chẳng có màu gì cả, mà chẳng lỗi nào — class có trong DOM, chỉ là nó không tồn tại trong bảng kiểu. Hãy viết trọn vẹn các tên class ra (một object tra cứu ánh xạ &#96;red&#96; sang &#96;&#39;text-red-500&#39;&#96;), hoặc ép chúng vào — &#96;safelist&#96; ở Tailwind 3, &#96;@source inline("text-red-500")&#96; ở Tailwind 4. Đây là lỗi Tailwind phổ biến nhất, và nó biết trốn: đo ở dưới, trang hỏng "chạy đúng" ngay khi một file khác viết trọn &#96;text-red-500&#96;.</p></div>
<a class="link-card dl" href="https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names" target="_blank" rel="noopener">
  <span class="lc-ico">🚨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Tên class động</span><span class="lc-sub">Cảnh báo chính thức về đúng cái bẫy này, kèm mẫu được khuyến nghị.</span></span>
</a>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/styling" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Tô kiểu</span><span class="lc-sub">Mọi cách được hỗ trợ, kèm lưu ý riêng của App Router cho từng cách.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Style một component ba cách: CSS Module, inline style, và class utility Tailwind; so trải nghiệm phát triển.</li>
<li>Mở <code>globals.css</code> (Tailwind 4: <code>@import "tailwindcss";</code>; Tailwind 3: ba chỉ thị <code>@tailwind</code>) và xác nhận utility chạy trong một component — rồi <code>grep</code> CSS đã build tìm một utility đó.</li>
<li>Viết một câu vì sao class utility giảm được vấn đề đặt tên của CSS thuần.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã thử các lựa chọn style chính và nói được vì sao Tailwind là mặc định của khoá này.</p></div>

<h3>🔬 Đo thật: bốn cái nút, bộ quét, và một lớp không tồn tại (Next.js 16.4.6 · Tailwind 4.3.3)</h3>
<p>Một cái nút tô bốn cách trong app <code>create-next-app</code> mới tạo, build, rồi đọc lại HTML và CSS:</p>
<pre><code class="language-tsx">import styles from './Nut.module.css';

export default function Trang() {
  return (
    &lt;main className="flex flex-col items-start gap-4 p-6 text-xl"&gt;
      &lt;button className="nut-global"&gt;1 · global CSS&lt;/button&gt;
      &lt;button className={styles.nut}&gt;2 · CSS Module&lt;/button&gt;
      &lt;button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;3 · Tailwind&lt;/button&gt;
      &lt;button style={{ borderRadius: 8, background: '#2563eb', padding: '8px 16px', color: '#fff' }}&gt;4 · inline style&lt;/button&gt;
    &lt;/main&gt;
  );
}</code></pre>
<div class="out">$ curl -s localhost:3000/nut | grep -o '&lt;button[^&gt;]*&gt;'      # bốn cái nút trong HTML thật
&lt;button class="nut-global"&gt;
&lt;button&gt;
&lt;button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"&gt;
&lt;button style="border-radius:8px;background:#2563eb;padding:8px 16px;color:#fff"&gt;
$ find .next/static -name '*.css' | xargs wc -c      # tệp CSS sau build
     101 0676obh1g-k3z.css
   15346 0zyhz5aaj7ylm.css
   15447 total
$ for s in '.nut-global{' '.nut{' '.bg-blue-600{' '.hover\\:bg-blue-700:hover{'; do printf '%-27s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s") tệp CSS có"; done
.nut-global{                1 tệp CSS có
.nut{                       1 tệp CSS có
.bg-blue-600{               1 tệp CSS có
.hover\\:bg-blue-700:hover{  1 tệp CSS có</div>
<p>Nút CSS Module <b>không có class</b>, còn CSS chứa một <code>.nut{{…}}</code> không khoanh phạm vi. Sau khi xoá <code>as: "*.css"</code> khỏi <code>next.config.ts</code>:</p>
<div class="out">$ curl -s localhost:3000/nut | grep -o '&lt;button[^&gt;]*&gt;' | sed -n 2p
&lt;button class="u-Rnhq_nut"&gt;
$ cat .next/static/chunks/*.css | grep -oE '\\.[A-Za-z0-9_-]*nut\\{[^}]*\\}' | head -2
.u-Rnhq_nut{color:#fff;background:#2563eb;border-radius:8px;padding:8px 16px}</div>
<p><b>Bộ quét giữ lại gì.</b> Chỉ những màu viết trong mã nguồn; class chỉ nằm trong <code>README.md</code> vẫn được sinh, class trong <code>/build</code> (bị gitignore) thì không, cho tới khi có <code>@source</code>:</p>
<div class="out">$ grep -oE -- '--color-[a-z]+-[0-9]+:' node_modules/tailwindcss/theme.css | wc -l | sed 's/^ */màu có sẵn trong bảng của Tailwind 4.3.3: /'
màu có sẵn trong bảng của Tailwind 4.3.3: 286
$ cat .next/static/chunks/*.css | grep -oE '\\.bg-[a-z]+-[0-9]+' | sort -u | tr '\\n' ' '; echo
.bg-blue-600 .bg-zinc-50 
$ cat .next/static/chunks/*.css | grep -oE '\\.(bg|text)-(pink|lime)-500' | sort -u | wc -l | sed 's/^ */lớp pink\\/lime trong CSS: /'
lớp pink/lime trong CSS: 0
$ echo 'Màu thương hiệu: bg-pink-500' &gt;&gt; README.md      # lớp chỉ nằm trong README
$ mkdir build &amp;&amp; echo '&lt;div class="bg-lime-500"&gt;' &gt; build/nhap.html      # thư mục /build có trong .gitignore
/build
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled'
✓ Compiled successfully in 466ms
$ for s in '.bg-pink-500{' '.bg-lime-500{'; do printf '%-16s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s")"; done
.bg-pink-500{    1
.bg-lime-500{    0
$ sed -i '' '1a\\'$'\\n''@source "../../build";' src/app/globals.css      # chỉ đích danh thư mục bị bỏ qua
@import "tailwindcss";
@source "../../build";
$ npm run build 2&gt;&amp;1 | grep -E 'Compiled'
✓ Compiled successfully in 264ms
$ for s in '.bg-pink-500{' '.bg-lime-500{'; do printf '%-16s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s")"; done
.bg-pink-500{    1
.bg-lime-500{    1</div>
<p><b>Class ghép động.</b> Có trong DOM, không có trong CSS; Chromium tô bằng màu chữ của body:</p>
<pre><code class="language-tsx">const mau = 'red'; <span class="tok-comment">  // giả sử đến từ props / cơ sở dữ liệu</span>

export default function Trang() {
  return &lt;p id="sai" className={&#96;text-\${mau}-500 p-6 text-3xl font-bold&#96;}&gt;Chữ này phải màu đỏ&lt;/p&gt;;
}</code></pre>
<div class="out">$ curl -s localhost:3000/mau | grep -o '&lt;p id="sai"[^&gt;]*&gt;'      # lớp CÓ trong DOM
&lt;p id="sai" class="text-red-500 p-6 text-3xl font-bold"&gt;
$ printf '%-16s %s\\n' '.text-red-500{' "$(cat .next/static/chunks/*.css | grep -cF '.text-red-500{') tệp CSS có"
.text-red-500{   0 tệp CSS có
Chromium · getComputedStyle(#sai).color = rgb(23, 23, 23)</div>
<p>Thêm một trang bảng tra viết trọn <code>text-red-500</code> (và một trang chỉ nhắc <code>text-amber-500</code> trong <em>chú thích</em>) — trang hỏng chưa sửa gì cũng đỏ theo:</p>
<div class="out">$ for s in '.text-red-500{' '.text-green-600{' '.text-amber-500{'; do printf '%-18s %s\\n' "$s" "$(cat .next/static/chunks/*.css | grep -cF "$s") tệp CSS có"; done
.text-red-500{     1 tệp CSS có
.text-green-600{   1 tệp CSS có
.text-amber-500{   1 tệp CSS có
/mau2 (lookup) color = lab(55.4814 75.0732 48.8528)
/mau  (unchanged) color = lab(55.4814 75.0732 48.8528)</div>
<p><b>Tailwind 3</b> (Next 14.2.35 + 3.4.19, đúng bộ của cuongthai.com): một bảng class trong <code>lib/</code> nằm ngoài các glob <code>content</code>, trước và sau khi thêm thư mục:</p>
<div class="out">$ for s in '.bg-lime-500\\/20{' '.text-lime-700{' '.border-lime-500{'; do printf '%-20s %s\\n' "$s" "$(cat .next/static/css/*.css | grep -cF "$s")"; done
.bg-lime-500\\/20{    0
.text-lime-700{      0
.border-lime-500{    0
$ content: ['./app/**/*.{js,jsx}', './lib/**/*.js']      # thêm thư mục lib/
  content: ['./app/**/*.{js,jsx}', './lib/**/*.js'],
$ for s in '.bg-lime-500\\/20{' '.text-lime-700{' '.border-lime-500{'; do printf '%-20s %s\\n' "$s" "$(cat .next/static/css/*.css | grep -cF "$s")"; done
.bg-lime-500\\/20{    1
.text-lime-700{      1
.border-lime-500{    1</div>
<p><b>Và trên cuongthai.com hôm nay.</b> <code>tailwind.config.ts</code> không quét <code>src/lib</code>; mọi class màu trong <code>src/lib/*.ts</code> đối chiếu với CSS đang chạy thật:</p>
<div class="out">$ grep -E '"(next|tailwindcss)"' package.json
    "next": "^14.2.15",
    "tailwindcss": "^3.4.14",
$ sed -n '4,8p' tailwind.config.ts      # content KHÔNG có ./src/lib
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
$ sed -n '22p' src/lib/repos.ts
  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
$ python3 doi-css.py      # mọi lớp trong src/lib/*.ts so với CSS THẬT của cuongthai.com hôm nay
CSS prod: 705.624 byte
src/lib/linkify.tsx: 1 lớp · VẮNG trong CSS prod: 0
src/lib/repos.ts: 47 lớp · VẮNG trong CSS prod: 7 → bg-indigo-500/20 bg-lime-500/20 bg-pink-500/20 border-lime-500/30 border-pink-500/30 text-lime-300 text-yellow-200
src/lib/studio-meta.ts: 18 lớp · VẮNG trong CSS prod: 1 → ring-cyan-500/30</div>
<p>Bảy class huy hiệu trong <code>src/lib/repos.ts</code> không tồn tại — huy hiệu Shell mất hết màu, Swift/C++ và C# mất màu nền — mà không có lỗi nào ở đâu cả.</p>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npx create-next-app@latest my-app <span class="tok-comment">  # TypeScript, Tailwind = Yes</span>
cd my-app &amp;&amp; grep -n 'as:' next.config.ts <span class="tok-comment">  # dòng biến .module.css thành CSS thường</span>
npm run build &amp;&amp; cat .next/static/chunks/*.css | grep -c '.text-red-500{' <span class="tok-comment">  # 0 = class không tồn tại</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-0-3-bon-bo-phan" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 0.3 — Bốn bộ phận chuyển động</span><span class="lc-sub">Bộ quét, cấu hình, layer, đầu ra — và cái nào hay hỏng</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-8-4-glob-hong" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 8.4 — Dựng nhanh là một triệu chứng</span><span class="lc-sub">Cái glob content hỏng khiến build nhanh bất thường</span></span></a>
<a class="link-card lien-ket-cheo" href="/academy/courses/front-end-web-development-with-react/learn?lessonSlug=fer202-a3-2-slot20-nextjs-tailwind-slides" target="_blank" rel="noopener"><span class="lc-ico">🏫</span><span class="lc-body"><span class="lc-title">Academy · FER202 · A3.2 — Next.js & Tailwind CSS (Slot 20)</span><span class="lc-sub">Cùng chủ đề, theo từng slide, trong môn FER202</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSS Module</span><span class="v">File CSS có phạm vi (<code>.module.css</code>) với tên class duy nhất cục bộ.</span></div>
  <div class="kv"><span class="k">Inline style</span><span class="v">Một object <code>style</code> trên element — nhanh nhưng hạn chế.</span></div>
  <div class="kv"><span class="k">Tailwind CSS</span><span class="v">Class utility áp trong markup thay vì CSS riêng.</span></div>
  <div class="kv"><span class="k">Class utility</span><span class="v">Một class một-nhiệm-vụ như <code>p-4</code> hay <code>flex</code>.</span></div>
  <div class="kv"><span class="k">globals.css</span><span class="v">Nơi chứa các chỉ thị Tailwind và style toàn cục.</span></div>
  <div class="kv"><span class="k">Vấn đề đặt tên</span><span class="v">CSS thuần buộc bạn nghĩ tên class; utility thì không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bạn style được bằng CSS Modules, inline style, hoặc class utility — mỗi cái có đánh đổi.</li><li>Tailwind áp class utility một-nhiệm-vụ trong markup, bỏ gánh nặng đặt tên của CSS thuần.</li><li>Chỉ thị Tailwind nằm trong <code>globals.css</code>, import ở root layout.</li><li>Khoá này dùng Tailwind vì cuongthai.com dùng nó.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://nextjs.org/docs/app/building-your-application/styling" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">nextjs.org — Styling</span><span class="lc-sub">Global CSS, CSS Modules, Tailwind, và Sass trong App Router.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/installation/framework-guides/nextjs" target="_blank" rel="noopener">
  <span class="lc-ico">💨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Cài với Next.js</span><span class="lc-sub">Cách cài cho phiên bản lớn hiện tại (Tailwind 4: một dòng import, không file config).</span></span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 3.1 — the cascade under Tailwind</span><span class="lc-sub">Specificity and inheritance: what utility classes are avoiding</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-3-1-css-basics" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 3.1 — cascade bên dưới Tailwind</span><span class="lc-sub">Độ cụ thể và kế thừa: thứ mà class tiện ích đang tránh</span></span>
  <span class="lc-cta">Mở bài</span>
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
${G13_2}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Small utilities, composed — plus prefixes for responsive and states</h2>
<p class="lead">A Tailwind class does one thing: <code>p-4</code> is padding, <code>text-lg</code> is font size, <code>flex</code> is display. You build a design by composing many of them. Two families of prefixes make them conditional.</p>

<h3>Responsive: mobile-first breakpoints</h3>
<pre><code class="language-html">&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"&gt;</code></pre>
<p>An unprefixed utility applies at all sizes; a prefixed one applies from that breakpoint <em>up</em>. So <code>grid-cols-1</code> is the base (mobile), <code>md:grid-cols-2</code> kicks in on medium screens, <code>lg:grid-cols-3</code> on large. Design the small screen first, then layer widths on top — the opposite of desktop-first CSS.</p>

<h3>States: hover, focus, disabled, and more</h3>
<pre><code class="language-html">&lt;button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 disabled:opacity-50"&gt;</code></pre>
<p>State prefixes apply a utility only in that state. <code>hover:</code>, <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, and the group/peer variants for reacting to a parent or sibling. No separate <code>:hover</code> rule to write elsewhere — the interaction lives on the element.</p>

<h3>The design system is the point</h3>
<p>Values are not arbitrary. <code>p-4</code> is 1rem, <code>p-6</code> is 1.5rem — a fixed spacing scale. Colours come as <code>blue-600</code>, <code>gray-100</code> — a curated palette with consistent steps. Sticking to the scale is what keeps a UI looking intentional; reach for an arbitrary value like <code>p-[13px]</code> only when you truly must.</p>

<h3>Conditional classes without string soup</h3>
<p>You often toggle classes by state. Building the string by hand gets ugly fast; a tiny helper (commonly named <code>cn</code>, wrapping <code>clsx</code> + <code>tailwind-merge</code>) keeps it clean and resolves conflicts:</p>
<pre><code class="language-tsx">&lt;button className={cn('rounded px-4 py-2', isActive &amp;&amp; 'bg-blue-600 text-white')}&gt;</code></pre>
<p><code>tailwind-merge</code> also fixes the "last one wins" problem: <code>cn('p-2', 'p-4')</code> yields <code>p-4</code>, not both. You will use this <code>cn</code> pattern in almost every component.</p>

<h3>Reading a Tailwind class string</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Utilities map one to one</b> — &#96;p-4&#96; is &#96;padding: 1rem&#96;. Once you know the scale, you read CSS directly out of the markup.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>The scale is the point</b> — &#96;p-2 p-4 p-6&#96; instead of &#96;12px 16px 18px&#96;. Constraints are what keep a design consistent across people.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Prefixes are conditions</b> — &#96;md:flex&#96;, &#96;hover:bg-blue-600&#96;, &#96;dark:text-white&#96;. Each is a media query or a selector, applied to that one utility.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Mobile first</b> — An unprefixed class applies everywhere; &#96;md:&#96; means &quot;from medium up&quot;. For the rare &quot;only below md&quot; case there is &#96;max-md:&#96; (measured: &#96;@media not all and (min-width:48rem)&#96;) — but design the small screen first.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — two conflicting utilities on one element, where the winner is decided by the stylesheet, not by your order.</strong> &#96;className="p-4 p-2"&#96; does not apply &#96;p-2&#96; because it is written last — CSS does not care about class attribute order. The winner is whichever rule appears later in the generated stylesheet, which is Tailwind&#39;s internal order and not something you control. It bites hardest when merging props: a base component with &#96;p-4&#96; and a caller passing &#96;p-2&#96; produce a result the caller cannot predict from the markup — measured below, the caller&#39;s &#96;p-2&#96; simply lost. Use &#96;tailwind-merge&#96; to resolve conflicts intentionally, and keep one source of truth for each property.</p></div>
<a class="link-card dl" href="https://tailwindcss.com/docs/styling-with-utility-classes" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Utility-first fundamentals</span><span class="lc-sub">Why the approach works, and the objections it answers.</span></span>
</a>
<a class="link-card dl" href="https://github.com/dcastil/tailwind-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">tailwind-merge</span><span class="lc-sub">Resolving conflicting utilities predictably — the standard fix for component props.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Build a card using spacing, flex and color utilities; then make it responsive with <code>md:</code> and <code>lg:</code> prefixes.</li>
<li>Add hover and focus states with <code>hover:</code> and <code>focus:</code> variants.</li>
<li>Confirm mobile-first: an unprefixed utility applies to all sizes, a prefixed one only from that breakpoint up.</li>
</ol>
<p><strong>Done when:</strong> you can use responsive and state variants and explain Tailwind's mobile-first model.</p></div>

<h3>🔬 Measured: every prefix is a rule you can read (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>The rules each class compiled to, read from the built CSS:</p>
<div class="out">$ python3 doc-css.py md:grid-cols-2 lg:grid-cols-3 hover:bg-blue-700 focus:ring-2 disabled:opacity-50 p-4 'p-[13px]'      # luật THẬT trong CSS đã build
md:grid-cols-2         ⇒ @media (min-width:48rem) › .md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
lg:grid-cols-3         ⇒ @media (min-width:64rem) › .lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
hover:bg-blue-700      ⇒ @media (hover:hover) › .hover\\:bg-blue-700:hover{background-color:var(--color-blue-700)}
focus:ring-2           ⇒ .focus\\:ring-2:focus{… box-shadow: vòng 2px …}
disabled:opacity-50    ⇒ .disabled\\:opacity-50:disabled{opacity:.5}
p-4                    ⇒ .p-4{padding:calc(var(--spacing) * 4)}
p-[13px]               ⇒ .p-\\[13px\\]{padding:13px}
$ cat .next/static/chunks/*.css | grep -oE -- '--spacing:[^;]*' | head -1
--spacing:.25rem</div>
<p>In Chromium: the grid at three widths, the button under the mouse, after <kbd>Tab</kbd>, and disabled:</p>
<div class="out">375px → 1 cột · 800px → 2 cột · 1100px → 3 cột
background   lab(44.0605 29.0279 -86.0352)
after hover  lab(36.9089 35.0961 -85.6872)
after Tab    box-shadow … 0) 0px 0px 0px 0px
disabled     opacity 0.5
p-4 · p-[13px]  16px · 13px</div>
<p>"Below md" exists:</p>
<div class="out">$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py max-md:bg-red-100 md:bg-green-100
max-md:bg-red-100      ⇒ @media not all and (min-width:48rem) › .max-md\\:bg-red-100{background-color:var(--color-red-100)}
md:bg-green-100        ⇒ @media (min-width:48rem) › .md\\:bg-green-100{background-color:var(--color-green-100)}</div>
<p><b>Conflicts.</b> The same element with both orders, and the byte offset of each rule in the stylesheet:</p>
<div class="out">p-4 p-2 ⇒ padding 16px
p-2 p-4 ⇒ padding 16px
mt-32 mt-8 ⇒ margin-top 128px
text-lg text-sm ⇒ font-size 14px
$ vị trí trong CSS (lớp đứng SAU thắng)
.p-2{      byte 11777
.p-4{      byte 11815
.mt-8{     byte 9886
.mt-32{    byte 9928
.text-sm{  byte 12656
.text-lg{  byte 12564</div>
<p><b>cn()</b> (<code>clsx</code> + <code>tailwind-merge</code>), run for real, then a base component with <code>p-4</code> and a caller passing <code>p-2</code>:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/cn.ts — clsx (ghép có điều kiện) + tailwind-merge (gỡ xung đột: cái SAU thắng)</span>
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}</code></pre>
<div class="out">$ node -e "…cn(…)"      # chạy thật hàm cn của lib/cn.ts
cn('p-2', 'p-4')                                               → "p-4"
cn('p-4', 'p-2')                                               → "p-2"
cn('px-4 py-2', 'p-2')                                         → "p-2"
cn('rounded px-4 py-2', isActive &amp;&amp; 'bg-blue-600 text-white')  → "rounded px-4 py-2"
'p-2' + ' ' + 'p-4' (nối chuỗi)                                → "p-2 p-4"
bg-sky-100 p-4 p-2 ⇒ padding 16px
bg-sky-100 p-2 ⇒ padding 8px</div>
<p>And the lesson&#39;s snippet, as written, in a <code>.tsx</code> file:</p>
<div class="out">$ npx tsc --noEmit      # đoạn mã cn của bài, chép nguyên (class=)
xung/bai.tsx(5,18): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTMLProps&lt;ButtonHTMLAttributes&lt;HTMLBu
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi (class= → className=)'
tsc: 0 lỗi (class= → className=)</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i clsx tailwind-merge
npm run build &amp;&amp; grep -o '@media[^{]*{[^}]*md\\\\:grid-cols-2' .next/static/chunks/*.css <span class="tok-comment">  # the media query md: becomes</span>
<span class="tok-comment"># DevTools → Elements → pick the element → Computed → padding: which class won?</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-3-diem-ngat" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.3 — Breakpoints win by position</span><span class="lc-sub">Why md: beats an unprefixed class: the media query comes later</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-3-1-thu-tu-viet" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 3.1 — Written order has zero effect</span><span class="lc-sub">The conflict trap, measured in depth</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-3-4-twmerge" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 3.4 — tailwind-merge restores last-wins</span><span class="lc-sub">How twMerge decides which class to drop</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Utility</span><span class="v">A single-purpose class (<code>flex</code>, <code>p-4</code>, <code>text-sm</code>).</span></div>
  <div class="kv"><span class="k">Responsive prefix</span><span class="v"><code>md:</code>, <code>lg:</code> apply a utility from a breakpoint up.</span></div>
  <div class="kv"><span class="k">Mobile-first</span><span class="v">Unprefixed = all sizes; prefixes add from larger screens.</span></div>
  <div class="kv"><span class="k">State variant</span><span class="v"><code>hover:</code>, <code>focus:</code>, <code>disabled:</code> style interaction states.</span></div>
  <div class="kv"><span class="k">Breakpoint</span><span class="v">A screen-width threshold (sm/md/lg/xl).</span></div>
  <div class="kv"><span class="k">Composition</span><span class="v">Combine many small utilities to build a component's look.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Build designs by composing single-purpose utilities for spacing, layout, color and type.</li><li>Tailwind is mobile-first: an unprefixed utility applies everywhere; <code>md:</code>/<code>lg:</code> add from a breakpoint up.</li><li>State variants (<code>hover:</code>, <code>focus:</code>, <code>disabled:</code>) style interaction without extra CSS.</li><li>The look of a component is just a well-chosen string of utilities.</li></ul>

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
<pre><code class="language-html">&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"&gt;</code></pre>
<p>Một utility không tiền tố áp ở mọi kích thước; một cái có tiền tố áp từ breakpoint đó <em>trở lên</em>. Nên <code>grid-cols-1</code> là nền (mobile), <code>md:grid-cols-2</code> bật ở màn trung, <code>lg:grid-cols-3</code> ở màn lớn. Thiết kế màn nhỏ trước, rồi đắp bề rộng lên trên — ngược với CSS desktop-first.</p>

<h3>Trạng thái: hover, focus, disabled, và hơn nữa</h3>
<pre><code class="language-html">&lt;button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 disabled:opacity-50"&gt;</code></pre>
<p>Tiền tố trạng thái áp một utility chỉ trong trạng thái đó. <code>hover:</code>, <code>focus:</code>, <code>active:</code>, <code>disabled:</code>, và các biến group/peer để phản ứng theo cha hoặc anh em. Không phải viết một luật <code>:hover</code> riêng ở chỗ khác — tương tác nằm ngay trên phần tử.</p>

<h3>Hệ thiết kế mới là điểm chính</h3>
<p>Các giá trị không tuỳ tiện. <code>p-4</code> là 1rem, <code>p-6</code> là 1.5rem — một thang khoảng cách cố định. Màu đến dạng <code>blue-600</code>, <code>gray-100</code> — một bảng màu tuyển với các bước nhất quán. Bám thang đó là điều giữ UI trông có chủ đích; chỉ dùng giá trị tuỳ ý như <code>p-[13px]</code> khi thật sự bắt buộc.</p>

<h3>Class có điều kiện mà không phải nấu súp chuỗi</h3>
<p>Bạn thường bật/tắt class theo state. Ghép chuỗi bằng tay xấu đi rất nhanh; một hàm nhỏ (thường tên <code>cn</code>, bọc <code>clsx</code> + <code>tailwind-merge</code>) giữ gọn và xử lý xung đột:</p>
<pre><code class="language-tsx">&lt;button className={cn('rounded px-4 py-2', isActive &amp;&amp; 'bg-blue-600 text-white')}&gt;</code></pre>
<p><code>tailwind-merge</code> còn sửa vấn đề "cái cuối thắng": <code>cn('p-2', 'p-4')</code> ra <code>p-4</code>, không phải cả hai. Bạn sẽ dùng mẫu <code>cn</code> này ở gần như mọi component.</p>

<h3>Đọc một chuỗi class Tailwind</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Utility ánh xạ một-đối-một</b> — &#96;p-4&#96; là &#96;padding: 1rem&#96;. Nắm được cái thang rồi thì bạn đọc thẳng CSS ra từ markup.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Chính cái thang mới là mục đích</b> — &#96;p-2 p-4 p-6&#96; thay vì &#96;12px 16px 18px&#96;. Ràng buộc mới là thứ giữ cho một thiết kế nhất quán giữa nhiều người.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Tiền tố là các điều kiện</b> — &#96;md:flex&#96;, &#96;hover:bg-blue-600&#96;, &#96;dark:text-white&#96;. Mỗi cái là một media query hoặc một bộ chọn, áp cho đúng utility đó.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Ưu tiên điện thoại trước</b> — Một class không tiền tố áp ở mọi nơi; &#96;md:&#96; nghĩa là &quot;từ cỡ vừa trở lên&quot;. Trường hợp hiếm &quot;chỉ dưới md&quot; thì có &#96;max-md:&#96; (đo thật: &#96;@media not all and (min-width:48rem)&#96;) — nhưng vẫn thiết kế cho màn nhỏ trước.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — hai utility xung đột trên cùng một phần tử, mà kẻ thắng do bảng kiểu quyết định chứ không do thứ tự bạn viết.</strong> &#96;className="p-4 p-2"&#96; KHÔNG áp &#96;p-2&#96; chỉ vì nó viết sau — CSS chẳng quan tâm thứ tự trong thuộc tính class. Kẻ thắng là luật nào xuất hiện sau hơn trong bảng kiểu được sinh ra, tức là thứ tự nội bộ của Tailwind chứ không phải thứ bạn điều khiển. Nó cắn đau nhất khi trộn props: một component nền có &#96;p-4&#96; và một chỗ gọi truyền &#96;p-2&#96; cho ra một kết quả mà người gọi không đoán được từ markup — đo ở dưới, &#96;p-2&#96; của người gọi thua thẳng. Hãy dùng &#96;tailwind-merge&#96; để giải xung đột một cách có chủ đích, và giữ một nguồn sự thật duy nhất cho mỗi thuộc tính.</p></div>
<a class="link-card dl" href="https://tailwindcss.com/docs/styling-with-utility-classes" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Nền tảng utility-first</span><span class="lc-sub">Vì sao cách tiếp cận này chạy được, và nó trả lời những phản đối nào.</span></span>
</a>
<a class="link-card dl" href="https://github.com/dcastil/tailwind-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">tailwind-merge</span><span class="lc-sub">Giải xung đột utility một cách đoán được — cách chữa tiêu chuẩn cho props của component.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một card dùng utility spacing, flex và màu; rồi làm nó responsive bằng tiền tố <code>md:</code> và <code>lg:</code>.</li>
<li>Thêm trạng thái hover và focus bằng biến thể <code>hover:</code> và <code>focus:</code>.</li>
<li>Xác nhận mobile-first: utility không tiền tố áp cho mọi kích thước, cái có tiền tố chỉ từ breakpoint đó trở lên.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dùng được biến thể responsive và trạng thái và giải thích mô hình mobile-first của Tailwind.</p></div>

<h3>🔬 Đo thật: mỗi tiền tố là một luật đọc được (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>Luật mà mỗi class được dịch ra, đọc từ CSS đã build:</p>
<div class="out">$ python3 doc-css.py md:grid-cols-2 lg:grid-cols-3 hover:bg-blue-700 focus:ring-2 disabled:opacity-50 p-4 'p-[13px]'      # luật THẬT trong CSS đã build
md:grid-cols-2         ⇒ @media (min-width:48rem) › .md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
lg:grid-cols-3         ⇒ @media (min-width:64rem) › .lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
hover:bg-blue-700      ⇒ @media (hover:hover) › .hover\\:bg-blue-700:hover{background-color:var(--color-blue-700)}
focus:ring-2           ⇒ .focus\\:ring-2:focus{… box-shadow: vòng 2px …}
disabled:opacity-50    ⇒ .disabled\\:opacity-50:disabled{opacity:.5}
p-4                    ⇒ .p-4{padding:calc(var(--spacing) * 4)}
p-[13px]               ⇒ .p-\\[13px\\]{padding:13px}
$ cat .next/static/chunks/*.css | grep -oE -- '--spacing:[^;]*' | head -1
--spacing:.25rem</div>
<p>Trong Chromium: lưới ở ba bề rộng, nút dưới con trỏ, sau khi bấm <kbd>Tab</kbd>, và nút tắt:</p>
<div class="out">375px → 1 cột · 800px → 2 cột · 1100px → 3 cột
background   lab(44.0605 29.0279 -86.0352)
after hover  lab(36.9089 35.0961 -85.6872)
after Tab    box-shadow … 0) 0px 0px 0px 0px
disabled     opacity 0.5
p-4 · p-[13px]  16px · 13px</div>
<p>"Dưới md" có tồn tại:</p>
<div class="out">$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py max-md:bg-red-100 md:bg-green-100
max-md:bg-red-100      ⇒ @media not all and (min-width:48rem) › .max-md\\:bg-red-100{background-color:var(--color-red-100)}
md:bg-green-100        ⇒ @media (min-width:48rem) › .md\\:bg-green-100{background-color:var(--color-green-100)}</div>
<p><b>Xung đột.</b> Cùng một phần tử với cả hai thứ tự, và vị trí (byte) của từng luật trong bảng kiểu:</p>
<div class="out">p-4 p-2 ⇒ padding 16px
p-2 p-4 ⇒ padding 16px
mt-32 mt-8 ⇒ margin-top 128px
text-lg text-sm ⇒ font-size 14px
$ vị trí trong CSS (lớp đứng SAU thắng)
.p-2{      byte 11777
.p-4{      byte 11815
.mt-8{     byte 9886
.mt-32{    byte 9928
.text-sm{  byte 12656
.text-lg{  byte 12564</div>
<p><b>cn()</b> (<code>clsx</code> + <code>tailwind-merge</code>), chạy thật, rồi một component nền có <code>p-4</code> và người gọi truyền <code>p-2</code>:</p>
<pre><code class="language-typescript"><span class="tok-comment">// lib/cn.ts — clsx (ghép có điều kiện) + tailwind-merge (gỡ xung đột: cái SAU thắng)</span>
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}</code></pre>
<div class="out">$ node -e "…cn(…)"      # chạy thật hàm cn của lib/cn.ts
cn('p-2', 'p-4')                                               → "p-4"
cn('p-4', 'p-2')                                               → "p-2"
cn('px-4 py-2', 'p-2')                                         → "p-2"
cn('rounded px-4 py-2', isActive &amp;&amp; 'bg-blue-600 text-white')  → "rounded px-4 py-2"
'p-2' + ' ' + 'p-4' (nối chuỗi)                                → "p-2 p-4"
bg-sky-100 p-4 p-2 ⇒ padding 16px
bg-sky-100 p-2 ⇒ padding 8px</div>
<p>Và đoạn mã của bài, đúng như viết, trong tệp <code>.tsx</code>:</p>
<div class="out">$ npx tsc --noEmit      # đoạn mã cn của bài, chép nguyên (class=)
xung/bai.tsx(5,18): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTMLProps&lt;ButtonHTMLAttributes&lt;HTMLBu
$ npx tsc --noEmit &amp;&amp; echo 'tsc: 0 lỗi (class= → className=)'
tsc: 0 lỗi (class= → className=)</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i clsx tailwind-merge
npm run build &amp;&amp; grep -o '@media[^{]*{[^}]*md\\\\:grid-cols-2' .next/static/chunks/*.css <span class="tok-comment">  # media query mà md: trở thành</span>
<span class="tok-comment"># DevTools → Elements → chọn phần tử → Computed → padding: lớp nào thắng?</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-3-diem-ngat" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.3 — Điểm ngắt thắng nhờ vị trí</span><span class="lc-sub">Vì sao md: thắng lớp không tiền tố: media query đứng sau</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-3-1-thu-tu-viet" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 3.1 — Thứ tự viết không có tác dụng</span><span class="lc-sub">Bẫy xung đột, đo kỹ hơn</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-3-4-twmerge" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 3.4 — tailwind-merge khôi phục cái-sau-thắng</span><span class="lc-sub">twMerge quyết định bỏ lớp nào ra sao</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Utility</span><span class="v">Một class một-nhiệm-vụ (<code>flex</code>, <code>p-4</code>, <code>text-sm</code>).</span></div>
  <div class="kv"><span class="k">Tiền tố responsive</span><span class="v"><code>md:</code>, <code>lg:</code> áp một utility từ một breakpoint trở lên.</span></div>
  <div class="kv"><span class="k">Mobile-first</span><span class="v">Không tiền tố = mọi kích thước; tiền tố thêm từ màn lớn hơn.</span></div>
  <div class="kv"><span class="k">Biến thể trạng thái</span><span class="v"><code>hover:</code>, <code>focus:</code>, <code>disabled:</code> style trạng thái tương tác.</span></div>
  <div class="kv"><span class="k">Breakpoint</span><span class="v">Ngưỡng chiều rộng màn hình (sm/md/lg/xl).</span></div>
  <div class="kv"><span class="k">Ghép</span><span class="v">Kết hợp nhiều utility nhỏ để dựng dáng một component.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Dựng thiết kế bằng cách ghép các utility một-nhiệm-vụ cho spacing, bố cục, màu và chữ.</li><li>Tailwind là mobile-first: utility không tiền tố áp khắp nơi; <code>md:</code>/<code>lg:</code> thêm từ một breakpoint trở lên.</li><li>Biến thể trạng thái (<code>hover:</code>, <code>focus:</code>, <code>disabled:</code>) style tương tác mà không cần CSS thêm.</li><li>Dáng một component chỉ là một chuỗi utility chọn khéo.</li></ul>

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
${G13_3}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Dark mode is one variant and one class on &lt;html&gt;</h2>
<p class="lead">Tailwind's <code>dark:</code> prefix applies a utility only in dark mode. The common setup is the <em>class</em> strategy: dark styles activate whenever a chosen class is present on the <code>&lt;html&gt;</code> element, so a toggle just adds or removes that class.</p>

<pre><code class="language-html">&lt;div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white"&gt;
  Adapts to the theme
&lt;/div&gt;</code></pre>
<p>With the class strategy, these <code>dark:</code> utilities take effect only when the toggle class is on <code>&lt;html&gt;</code>. Toggling the theme is then just toggling one class high in the tree — every <code>dark:</code> utility responds at once.</p>
<div class="callout warn"><p><strong>Which strategy you get depends on the Tailwind version.</strong> In <b>Tailwind 4</b> (what <code>create-next-app</code> 16 installs) <code>dark:</code> is a <em>media query</em> by default — <code>@media (prefers-color-scheme: dark)</code> — and a <code>dark</code> class on <code>&lt;html&gt;</code> does nothing (measured below). Switch to the class strategy with one line in <code>globals.css</code>: <code>@custom-variant dark (&amp;:where(.dark, .dark *));</code>. In <b>Tailwind 3</b> the same switch is <code>darkMode: 'class'</code> in <code>tailwind.config</code> — what cuongthai.com uses.</p></div>

<h3>The no-flicker problem</h3>
<p>The theme choice lives in <code>localStorage</code>, which is a browser thing — the server does not know it when it renders the HTML. If you apply the class only after React hydrates, the user sees a flash of the wrong theme first. The fix is a tiny script that runs <em>before</em> the first paint, reads the stored preference, and sets the class on <code>&lt;html&gt;</code> immediately.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">A blocking inline script in the document head reads <code>localStorage</code> and adds the theme class before anything paints.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">The first paint is already in the right theme — no flash.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">React hydrates on top; a toggle later just flips the class.</div></div>
</div>
<p>The library <strong>next-themes</strong> does all of this for you — the script, the storage, a <code>useTheme()</code> hook, and system-preference support. Reach for it rather than hand-rolling unless you have a reason not to.</p>

<div class="callout warn">
<p><strong>Because the class isn't on the server render, you will see a hydration error in the dev console</strong> on the element you mutate before hydration (usually <code>&lt;html&gt;</code>). That is expected here; the standard fix is <code>suppressHydrationWarning</code> on that element. It is one of the few legitimate uses of that escape hatch.</p>
</div>

<h3>Dark mode without a flash</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Put the class on html</b> — &#96;@custom-variant dark (&amp;:where(.dark, .dark *));&#96; in &#96;globals.css&#96; (Tailwind 4) or &#96;darkMode: &#39;class&#39;&#96; in the config (Tailwind 3), and &#96;&lt;html class="dark"&gt;&#96;. Every &#96;dark:&#96; utility keys off that one class.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Read the preference before paint</b> — A tiny inline script in the root layout sets the class from &#96;localStorage&#96; or &#96;prefers-color-scheme&#96; before the body renders.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Then hydrate the toggle</b> — A Client Component reads the current state and writes both the class and the stored preference.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Three states, not two</b> — Light, dark, and &quot;follow the system&quot;. The third is what most users actually want, and it needs storing as its own value.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a flash of the wrong theme on every page load.</strong> Setting the theme in a &#96;useEffect&#96; means the server rendered the light page, the browser painted it, and only then did your code add the &#96;dark&#96; class — so every navigation starts with a white flash on a dark-mode site. It is not a bug you can fix with a faster effect: effects run after paint, by definition. The answer is a blocking inline &#96;&lt;script&gt;&#96; in the root layout that sets the class before the body exists. It is one of the few legitimate uses of an inline script in a React app, and every theme library ships one.</p></div>
<a class="link-card dl" href="https://tailwindcss.com/docs/dark-mode" target="_blank" rel="noopener">
  <span class="lc-ico">🌗</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Dark mode</span><span class="lc-sub">The class strategy, the media strategy, and the three-state toggle.</span></span>
</a>
<a class="link-card dl" href="https://github.com/pacocoursey/next-themes" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">next-themes</span><span class="lc-sub">The library that solves the flash and the three states, for the App Router.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Enable class-based dark mode and style a component with <code>dark:</code> variants; toggle the class on <code>&lt;html&gt;</code> and watch it flip.</li>
<li>Set the initial theme before paint (an inline script or server class) to avoid the white flash on load.</li>
<li>Persist the choice in <code>localStorage</code> and read it back on next visit.</li>
</ol>
<p><strong>Done when:</strong> you can build a dark-mode toggle that persists and does not flash on load.</p></div>

<h3>🔬 Measured: what dark: compiles to, and the flash (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>The lesson&#39;s card, built with Tailwind 4&#39;s defaults:</p>
<div class="out">$ python3 doc-css.py dark:bg-gray-900      # Tailwind 4 MẶC ĐỊNH: dark: = ?
dark:bg-gray-900       ⇒ @media (prefers-color-scheme:dark) › .dark\\:bg-gray-900{background-color:var(--color-gray-900)}
dark:text-white        ⇒ @media (prefers-color-scheme:dark) › .dark\\:text-white{color:var(--color-white)}</div>
<div class="out">light OS                       → white
light OS + &lt;html class="dark"&gt; → white
dark OS                        → gray-900 (dark)</div>
<p>After adding <code>@custom-variant dark (&amp;:where(.dark, .dark *));</code> to <code>globals.css</code>:</p>
<div class="out">$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py dark:bg-gray-900
dark:bg-gray-900       ⇒ .dark\\:bg-gray-900:where(.dark,.dark *){background-color:var(--color-gray-900)}
light OS + &lt;html class="dark"&gt; → gray-900 (dark)
dark OS, no class              → white</div>
<p><b>The flash.</b> <code>localStorage.theme = "dark"</code>, every JavaScript chunk delayed by 2 s (a slow phone), background read 600 ms and 3.6 s after opening:</p>
<div class="out">useEffect     600 ms: white   ·   3600 ms: gray-900 (dark)
inline script 600 ms: gray-900 (dark)   ·   3600 ms: gray-900 (dark)
next-themes   600 ms: gray-900 (dark)   ·   3600 ms: gray-900 (dark)</div>
<p><b>The price of the script</b> in <code>next dev</code>: the console error, then the fix on <code>&lt;html&gt;</code>:</p>
<div class="out">console.error · A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
next-themes without suppressHydrationWarning: 2 errors
suppressHydrationWarning ⇒ 0 errors</div>
<p><b>How cuongthai.com does it</b> (Tailwind 3, three choices, a blocking boot script):</p>
<div class="out">$ grep -n 'darkMode' tailwind.config.ts
9:  darkMode: "class",
$ sed -n '68,73p' src/context/themeLogic.ts      # script chạy trước lần vẽ đầu của cuongthai.com
export const THEME_BOOT_SCRIPT =
  "try{var h=document.documentElement,p=localStorage.getItem('theme');" +
  "if(p!=='light'&amp;&amp;p!=='system')p='dark';" +
  "var r=p==='system'?(window.matchMedia&amp;&amp;window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;" +
  "h.classList.add(r==='light'?'light':'theme-dark');h.setAttribute('data-theme-pref',p)" +
  "}catch(e){document.documentElement.classList.add('theme-dark')}";
$ grep -n 'suppressHydrationWarning' src/app/layout.tsx
349:      suppressHydrationWarning
351:      &lt;body suppressHydrationWarning className="antialiased"&gt;</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># globals.css (Tailwind 4)</span>
@custom-variant dark (&amp;:where(.dark, .dark *));
<span class="tok-comment"># DevTools → Network → throttling "Slow 3G", reload: a useEffect toggle flashes white, a blocking script does not</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-4-che-do-toi" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.4 — Dark mode, and the class name that broke a feature</span><span class="lc-sub">The dark: variant from the output side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-4-tokens-theming" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations 12.4 — Design tokens and theming</span><span class="lc-sub">prefers-color-scheme and data-theme in plain CSS</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-5-1-effect-la-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js 5.1 — What an effect is</span><span class="lc-sub">Why an effect always runs after paint</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dark: variant</span><span class="v">Tailwind utilities applied when dark mode is active.</span></div>
  <div class="kv"><span class="k">Class strategy</span><span class="v">Dark mode toggled by a class on <code>&lt;html&gt;</code>.</span></div>
  <div class="kv"><span class="k">FOUC / flash</span><span class="v">The wrong-theme flash before JS runs on load.</span></div>
  <div class="kv"><span class="k">Pre-paint script</span><span class="v">Set the theme class before first paint to avoid the flash.</span></div>
  <div class="kv"><span class="k">localStorage</span><span class="v">Where the chosen theme is persisted.</span></div>
  <div class="kv"><span class="k">System preference</span><span class="v"><code>prefers-color-scheme</code> as the default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Class-based dark mode styles with <code>dark:</code> variants and a class toggled on <code>&lt;html&gt;</code>.</li><li>Set the theme before first paint (inline script or server class) to avoid the wrong-theme flash.</li><li>Persist the choice in <code>localStorage</code> and fall back to the system preference.</li><li>Chapter 13's naming trap (next lesson) is why cuongthai.com uses a custom class, not <code>dark</code>, globally.</li></ul>

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

<pre><code class="language-html">&lt;div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white"&gt;
  Thích ứng theo theme
&lt;/div&gt;</code></pre>
<p>Với chiến lược class, các utility <code>dark:</code> này chỉ có tác dụng khi class toggle nằm trên <code>&lt;html&gt;</code>. Đổi theme khi đó chỉ là bật/tắt một class cao trong cây — mọi utility <code>dark:</code> phản hồi cùng lúc.</p>
<div class="callout warn"><p><strong>Bạn được chiến lược nào là tuỳ phiên bản Tailwind.</strong> Ở <b>Tailwind 4</b> (thứ <code>create-next-app</code> 16 cài) <code>dark:</code> mặc định là một <em>media query</em> — <code>@media (prefers-color-scheme: dark)</code> — và class <code>dark</code> trên <code>&lt;html&gt;</code> chẳng làm gì (đo ở dưới). Chuyển sang chiến lược class bằng một dòng trong <code>globals.css</code>: <code>@custom-variant dark (&amp;:where(.dark, .dark *));</code>. Ở <b>Tailwind 3</b> công tắc tương ứng là <code>darkMode: 'class'</code> trong <code>tailwind.config</code> — thứ cuongthai.com đang dùng.</p></div>

<h3>Vấn đề nháy màn</h3>
<p>Lựa chọn theme nằm trong <code>localStorage</code>, vốn là thứ của trình duyệt — server không biết nó lúc render HTML. Nếu bạn chỉ áp class sau khi React hydrate, người dùng thấy một nháy sai theme trước. Cách chữa là một script bé chạy <em>trước</em> lần paint đầu, đọc lựa chọn đã lưu, và đặt class lên <code>&lt;html&gt;</code> ngay.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb">Một script inline chặn trong head đọc <code>localStorage</code> và thêm class theme trước khi bất cứ gì paint.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb">Lần paint đầu đã đúng theme — không nháy.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb">React hydrate lên trên; một toggle sau đó chỉ lật class.</div></div>
</div>
<p>Thư viện <strong>next-themes</strong> làm hết cho bạn — script, lưu trữ, một hook <code>useTheme()</code>, và hỗ trợ theo hệ thống. Hãy dùng nó thay vì tự chế trừ khi có lý do.</p>

<div class="callout warn">
<p><strong>Vì class không có trên bản render của server, bạn sẽ thấy một lỗi hydration trong console lúc dev</strong> ở phần tử bạn sửa trước hydration (thường là <code>&lt;html&gt;</code>). Ở đây điều đó là bình thường; cách sửa chuẩn là <code>suppressHydrationWarning</code> trên phần tử đó. Đây là một trong số ít lần dùng cửa thoát đó là chính đáng.</p>
</div>

<h3>Chế độ tối mà không bị chớp sáng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Đặt class lên thẻ html</b> — &#96;@custom-variant dark (&amp;:where(.dark, .dark *));&#96; trong &#96;globals.css&#96; (Tailwind 4) hoặc &#96;darkMode: &#39;class&#39;&#96; trong cấu hình (Tailwind 3), và &#96;&lt;html class="dark"&gt;&#96;. Mọi utility &#96;dark:&#96; đều bám vào đúng cái class đó.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Đọc lựa chọn TRƯỚC khi vẽ</b> — Một script nội tuyến bé xíu trong layout gốc đặt class từ &#96;localStorage&#96; hoặc &#96;prefers-color-scheme&#96; trước khi thẻ body được vẽ.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Rồi mới hydrate cái công tắc</b> — Một Client Component đọc trạng thái hiện tại rồi ghi cả cái class lẫn lựa chọn đã lưu.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Ba trạng thái, không phải hai</b> — Sáng, tối, và &quot;theo hệ thống&quot;. Cái thứ ba mới là thứ phần lớn người dùng thật sự muốn, và nó cần được lưu thành một giá trị riêng.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một cú chớp sai chủ đề ở mỗi lần tải trang.</strong> Đặt chủ đề trong một &#96;useEffect&#96; nghĩa là máy chủ đã vẽ trang sáng, trình duyệt đã vẽ nó ra, rồi mã của bạn mới thêm class &#96;dark&#96; vào — nên mọi lần chuyển trang đều bắt đầu bằng một cú chớp trắng trên một trang chế độ tối. Đây không phải lỗi chữa được bằng một effect nhanh hơn: effect chạy SAU khi vẽ, theo định nghĩa. Câu trả lời là một thẻ &#96;&lt;script&gt;&#96; nội tuyến chặn luồng trong layout gốc, đặt class trước khi thẻ body tồn tại. Đó là một trong số ít lần dùng script nội tuyến chính đáng trong một ứng dụng React, và thư viện chủ đề nào cũng ship một cái.</p></div>
<a class="link-card dl" href="https://tailwindcss.com/docs/dark-mode" target="_blank" rel="noopener">
  <span class="lc-ico">🌗</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Chế độ tối</span><span class="lc-sub">Chiến lược dùng class, chiến lược dùng media, và công tắc ba trạng thái.</span></span>
</a>
<a class="link-card dl" href="https://github.com/pacocoursey/next-themes" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">next-themes</span><span class="lc-sub">Thư viện giải quyết cú chớp và ba trạng thái, cho App Router.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Bật dark mode theo class và style một component bằng biến thể <code>dark:</code>; bật/tắt class trên <code>&lt;html&gt;</code> và xem nó lật.</li>
<li>Đặt theme khởi tạo trước khi vẽ (một script inline hoặc class từ server) để tránh nháy trắng lúc tải.</li>
<li>Lưu lựa chọn vào <code>localStorage</code> và đọc lại ở lần vào sau.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn dựng được công tắc dark mode có lưu và không nháy lúc tải.</p></div>

<h3>🔬 Đo thật: dark: được dịch ra gì, và cú nháy (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>Thẻ của bài, build với mặc định của Tailwind 4:</p>
<div class="out">$ python3 doc-css.py dark:bg-gray-900      # Tailwind 4 MẶC ĐỊNH: dark: = ?
dark:bg-gray-900       ⇒ @media (prefers-color-scheme:dark) › .dark\\:bg-gray-900{background-color:var(--color-gray-900)}
dark:text-white        ⇒ @media (prefers-color-scheme:dark) › .dark\\:text-white{color:var(--color-white)}</div>
<div class="out">light OS                       → white
light OS + &lt;html class="dark"&gt; → white
dark OS                        → gray-900 (dark)</div>
<p>Sau khi thêm <code>@custom-variant dark (&amp;:where(.dark, .dark *));</code> vào <code>globals.css</code>:</p>
<div class="out">$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py dark:bg-gray-900
dark:bg-gray-900       ⇒ .dark\\:bg-gray-900:where(.dark,.dark *){background-color:var(--color-gray-900)}
light OS + &lt;html class="dark"&gt; → gray-900 (dark)
dark OS, no class              → white</div>
<p><b>Cú nháy.</b> <code>localStorage.theme = "dark"</code>, mọi tệp JavaScript bị làm chậm 2 s (như điện thoại yếu), đọc màu nền 600 ms và 3,6 s sau khi mở:</p>
<div class="out">useEffect     600 ms: white   ·   3600 ms: gray-900 (dark)
inline script 600 ms: gray-900 (dark)   ·   3600 ms: gray-900 (dark)
next-themes   600 ms: gray-900 (dark)   ·   3600 ms: gray-900 (dark)</div>
<p><b>Cái giá của script</b> trong <code>next dev</code>: lỗi console, rồi cách sửa trên <code>&lt;html&gt;</code>:</p>
<div class="out">console.error · A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
next-themes không có suppressHydrationWarning: 2 lỗi
suppressHydrationWarning ⇒ 0 lỗi</div>
<p><b>cuongthai.com làm thế nào</b> (Tailwind 3, ba lựa chọn, một script khởi động chặn):</p>
<div class="out">$ grep -n 'darkMode' tailwind.config.ts
9:  darkMode: "class",
$ sed -n '68,73p' src/context/themeLogic.ts      # script chạy trước lần vẽ đầu của cuongthai.com
export const THEME_BOOT_SCRIPT =
  "try{var h=document.documentElement,p=localStorage.getItem('theme');" +
  "if(p!=='light'&amp;&amp;p!=='system')p='dark';" +
  "var r=p==='system'?(window.matchMedia&amp;&amp;window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;" +
  "h.classList.add(r==='light'?'light':'theme-dark');h.setAttribute('data-theme-pref',p)" +
  "}catch(e){document.documentElement.classList.add('theme-dark')}";
$ grep -n 'suppressHydrationWarning' src/app/layout.tsx
349:      suppressHydrationWarning
351:      &lt;body suppressHydrationWarning className="antialiased"&gt;</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># globals.css (Tailwind 4)</span>
@custom-variant dark (&amp;:where(.dark, .dark *));
<span class="tok-comment"># DevTools → Network → giới hạn "Slow 3G", tải lại: nút bằng useEffect nháy trắng, script chặn thì không</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-2-4-che-do-toi" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 2.4 — Chế độ tối, và cái tên lớp làm vỡ một tính năng</span><span class="lc-sub">Biến thể dark: nhìn từ đầu ra</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-4-tokens-theming" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web 12.4 — Token thiết kế và chế độ sáng/tối</span><span class="lc-sub">prefers-color-scheme và data-theme bằng CSS thuần</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/nextjs/learn?lessonSlug=nextjs-5-1-effect-la-gi" target="_blank" rel="noopener"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Next.js 5.1 — Effect là gì</span><span class="lc-sub">Vì sao effect luôn chạy sau khi vẽ</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Biến thể dark:</span><span class="v">Utility Tailwind áp khi dark mode bật.</span></div>
  <div class="kv"><span class="k">Chiến lược class</span><span class="v">Dark mode bật/tắt bằng một class trên <code>&lt;html&gt;</code>.</span></div>
  <div class="kv"><span class="k">FOUC / nháy</span><span class="v">Cú nháy sai-theme trước khi JS chạy lúc tải.</span></div>
  <div class="kv"><span class="k">Script trước khi vẽ</span><span class="v">Đặt class theme trước first paint để tránh nháy.</span></div>
  <div class="kv"><span class="k">localStorage</span><span class="v">Nơi lưu theme đã chọn.</span></div>
  <div class="kv"><span class="k">Tuỳ chọn hệ thống</span><span class="v"><code>prefers-color-scheme</code> làm mặc định.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Dark mode theo class style bằng biến thể <code>dark:</code> và một class bật/tắt trên <code>&lt;html&gt;</code>.</li><li>Đặt theme trước first paint (script inline hoặc class từ server) để tránh nháy sai-theme.</li><li>Lưu lựa chọn vào <code>localStorage</code> và lùi về tuỳ chọn hệ thống.</li><li>Bẫy đặt tên ở Chương 13 (bài sau) là lý do cuongthai.com dùng một class riêng, không phải <code>dark</code>, ở phạm vi toàn cục.</li></ul>

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
${G13_4}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>For real theming, drive colours through CSS variables</h2>
<p class="lead">Writing <code>dark:</code> on every element works for two themes. But when you have several themes, or want one source of truth for "the primary text colour," CSS custom properties are cleaner: define semantic variables, and switch a theme by changing the variables' values in one place.</p>

<pre><code class="language-css"><span class="tok-comment">/* globals.css */</span>
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

<h3>Theming with CSS variables</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Define tokens on :root</b> — &#96;--bg&#96;, &#96;--fg&#96;, &#96;--accent&#96;. Names describe the role, not the colour — &#96;--danger&#96;, never &#96;--red&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Redefine them per theme</b> — &#96;.dark { --bg: #0b0b0c }&#96;. One block per theme, and every component follows without knowing themes exist.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Wire them into Tailwind</b> — Tailwind 4: &#96;@theme inline { --color-bg: var(--bg); }&#96; in &#96;globals.css&#96; (a fresh &#96;create-next-app&#96; already does this for &#96;--background&#96;); Tailwind 3: &#96;colors: { bg: &#39;var(--bg)&#39; }&#96; in the config. Either way &#96;bg-bg&#96; and &#96;text-fg&#96; resolve through the variables.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Then a third theme is one block</b> — Adding brown or high-contrast means adding variable values, not touching a single component.</div></div>
</div>
<div class="pitfall"><p><strong>Trap — a token named after its colour, which becomes a lie in the second theme.</strong> &#96;--gray-100&#96; used for card backgrounds reads fine in light mode and becomes nonsense in dark, where that background is nearly black; six months later there is a &#96;--gray-100: #1a1a1a&#96; line that every new reader has to decode. Worse, the name gives no clue about where it may be used, so it spreads into places a redesign then cannot change safely. Name by role — &#96;--surface&#96;, &#96;--surface-raised&#96;, &#96;--border-subtle&#96; — and the theme file stays readable and the components stay theme-agnostic.</p></div>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">MDN — Using CSS custom properties</span><span class="lc-sub">Scope, inheritance and fallbacks — the mechanics behind the pattern.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/theme" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Colors from CSS variables</span><span class="lc-sub">Theme variables in Tailwind 4: @theme, inline, and the utilities they create.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Define semantic CSS variables (<code>--text-primary</code>, <code>--bg</code>) and reference them in utilities/CSS instead of hard-coded colors.</li>
<li>Swap the variable values under a theme class and watch the whole UI retheme with no component changes.</li>
<li>Note the naming trap: a global theme class named <code>dark</code> would hijack every Tailwind <code>dark:</code> utility — use a distinct name like <code>theme-dark</code>.</li>
</ol>
<p><strong>Done when:</strong> you can theme with CSS variables and avoid the class-name collision with Tailwind's <code>dark:</code>.</p></div>

<h3>🔬 Measured: one class swap, two wirings, one collision (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>Role tokens, a plain <code>.card</code> and the same tokens wired into Tailwind 4:</p>
<pre><code class="language-css">@import "tailwindcss";

/* token theo VAI TRÒ, ba theme. Chỉ đổi giá trị, không đụng component */
:root            { --text-primary: #111111; --surface: #ffffff; }
html.theme-dark  { --text-primary: #eeeeee; --surface: #0b0b0b; }
html.theme-brown { --text-primary: #f3e9d8; --surface: #2b211a; }

/* component đọc BIẾN, không đọc màu cố định */
.card { color: var(--text-primary); background: var(--surface); padding: 16px; }

/* nối biến vào Tailwind 4 ⇒ có lớp bg-surface / text-fg (create-next-app làm y hệt với --background) */
@theme inline {
  --color-surface: var(--surface);
  --color-fg: var(--text-primary);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}</code></pre>
<div class="out">$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py bg-surface text-fg bg-fg/50 | sed -E 's/\\{background-color:color-mix.*/{… color-mix(… var(--text-primary) 50% …)}/'
bg-surface             ⇒ .bg-surface{background-color:var(--surface)}
text-fg                ⇒ .text-fg{color:var(--text-primary)}
bg-fg/50               ⇒ .bg-fg\\/50{background-color:var(--text-primary)}</div>
<p>Computed in Chromium after swapping the class on <code>&lt;html&gt;</code> (<code>#css</code> = .card, <code>#tw</code> = <code>bg-surface text-fg</code>, <code>#mo</code> = <code>bg-fg/50</code>):</p>
<div class="out">(gốc)        css nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | tw nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | mo nền oklab(0.177637 0.00000810623 0.00000356138 / 0.5)
theme-dark   css nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | tw nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | mo nền oklab(0.949113 0.0000431836 0.0000190735 / 0.5)
theme-brown  css nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | tw nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | mo nền oklab(0.937341 0.00390819 0.02477 / 0.5)</div>
<p><b>Tailwind 3</b> (Next 14.2.35 + 3.4.19) wires them in the config — and an opaque variable gets no opacity modifier:</p>
<pre><code class="language-javascript"><span class="tok-comment">// tailwind.config.js — Tailwind 3: nối biến vào bảng màu trong config</span>
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: { extend: { colors: { surface: 'var(--surface)', fg: 'rgb(var(--fg-rgb) / &lt;alpha-value&gt;)' } } },
};</code></pre>
<div class="out">$ for s in '.bg-surface{' '.bg-surface\\/50{' '.text-fg{' '.text-fg\\/50{'; do printf '%-18s %s\\n' "$s" "$(cat .next/static/css/*.css | grep -cF "$s")"; done
.bg-surface{       1
.bg-surface\\/50{   0
.text-fg{          1
.text-fg\\/50{      1
$ cat .next/static/css/*.css | grep -oE '\\.(bg-surface|text-fg\\\\/50)\\{[^}]*\\}' | head -3
.bg-surface{background-color:var(--surface)}
.text-fg\\/50{color:rgb(var(--fg-rgb)/.5)}</div>
<p><b>The naming collision, reproduced.</b> Notes keeps its own <code>.dark</code> on its wrapper; the user picked LIGHT. The global dark theme set two ways:</p>
<div class="out">html.class có "dark" · Notes nền lab(8.30603 0.618205 -2.16572)
html.class chỉ "theme-dark" · Notes nền rgb(255, 255, 255)</div>
<p>And in the cuongthai.com repository:</p>
<div class="out">$ grep -oE -- '--[a-zA-Z0-9-]+\\s*:' src/app/globals.css | sort -u | wc -l | sed 's/^ */biến CSS trong globals.css: /'
biến CSS trong globals.css: 107
$ sed -n '87,92p' src/app/globals.css
  html.theme-dark {
    color-scheme: dark;
    --bg-primary: #18191a;
    --bg-card: #242526;
    --bg-surface: #303031;
    --bg-surface-hover: rgba(255, 255, 255, 0.08);
$ grep -n 'notes-theme-root' src/components/notes/NotesThemeProvider.tsx | head -3
183:        bên trong cây con. className &#96;notes-theme-root&#96; chỉ để
192:        className={&#96;notes-theme-root h-full \${theme === 'dark' ? 'dark' : ''}&#96;}
$ sed -n '/^  theme:/,/colors/p' tailwind.config.ts | head -3; grep -c "var(--" tailwind.config.ts | sed 's/^/dòng màu trỏ vào var(--…) trong tailwind.config.ts: /'
  theme: {
    extend: {
      colors: {
dòng màu trỏ vào var(--…) trong tailwind.config.ts: 18</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash"><span class="tok-comment"># globals.css (Tailwind 4)</span>
@theme inline { --color-surface: var(--surface); }
<span class="tok-comment"># DevTools console: document.documentElement.classList.toggle("theme-dark") — every bg-surface follows</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-6-1-mot-lop" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 6.1 — One class, correct in both themes</span><span class="lc-sub">Variables behind every colour utility</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-6-2-bay-alpha" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 6.2 — The alpha-value trap</span><span class="lc-sub">91 classes that do not exist, measured</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-4-tokens-theming" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Web Foundations 12.4 — Design tokens and theming</span><span class="lc-sub">Primitive and semantic tokens in plain CSS</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CSS variable</span><span class="v">A <code>--custom-prop</code> read with <code>var(--x)</code>, swappable at runtime.</span></div>
  <div class="kv"><span class="k">Semantic token</span><span class="v">A name by role (<code>--text-primary</code>) not by value.</span></div>
  <div class="kv"><span class="k">Retheme by swap</span><span class="v">Change variable values under a class to retheme instantly.</span></div>
  <div class="kv"><span class="k">Naming collision</span><span class="v">A global <code>dark</code> class clashes with Tailwind's <code>dark:</code> variant.</span></div>
  <div class="kv"><span class="k">theme-dark</span><span class="v">A distinct theme class name that avoids the collision.</span></div>
  <div class="kv"><span class="k">Single source of color</span><span class="v">Components read tokens, not raw hex values.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Theme with semantic CSS variables (<code>--text-primary</code>) so components read roles, not raw colors.</li><li>Swap variable values under a theme class to retheme the whole UI without touching components.</li><li>Avoid naming a global theme class <code>dark</code> — it hijacks Tailwind's <code>dark:</code> variant.</li><li>cuongthai.com learned this the hard way; it uses <code>theme-dark</code> globally and reserves <code>dark:</code> for one scoped area.</li></ul>

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

<pre><code class="language-css"><span class="tok-comment">/* globals.css */</span>
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

<h3>Làm chủ đề bằng biến CSS</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-sb"><b>Khai các token trên :root</b> — &#96;--bg&#96;, &#96;--fg&#96;, &#96;--accent&#96;. Tên mô tả VAI TRÒ, không mô tả màu — &#96;--danger&#96;, đừng bao giờ &#96;--red&#96;.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-sb"><b>Khai lại chúng theo từng chủ đề</b> — &#96;.dark { --bg: #0b0b0c }&#96;. Mỗi chủ đề một khối, và mọi component đi theo mà chẳng cần biết là có chủ đề tồn tại.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-sb"><b>Đấu chúng vào Tailwind</b> — Tailwind 4: &#96;@theme inline { --color-bg: var(--bg); }&#96; trong &#96;globals.css&#96; (app &#96;create-next-app&#96; mới tạo đã làm vậy với &#96;--background&#96;); Tailwind 3: &#96;colors: { bg: &#39;var(--bg)&#39; }&#96; trong cấu hình. Cách nào thì &#96;bg-bg&#96; và &#96;text-fg&#96; cũng giải qua các biến.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-sb"><b>Rồi chủ đề thứ ba chỉ là một khối</b> — Thêm màu nâu hay chế độ tương phản cao nghĩa là thêm giá trị biến, chứ không đụng vào một component nào.</div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một token đặt tên theo màu của nó, và cái tên đó thành lời nói dối ở chủ đề thứ hai.</strong> &#96;--gray-100&#96; dùng làm nền thẻ thì đọc lên rất ổn ở chế độ sáng và thành vô nghĩa ở chế độ tối, nơi cái nền ấy gần như đen; sáu tháng sau có một dòng &#96;--gray-100: #1a1a1a&#96; mà mọi người đọc mới đều phải giải mã. Tệ hơn, cái tên chẳng gợi ý gì về chỗ được phép dùng nó, nên nó lan vào những nơi mà một lần thiết kế lại sau này không đổi an toàn được. Hãy đặt tên theo vai trò — &#96;--surface&#96;, &#96;--surface-raised&#96;, &#96;--border-subtle&#96; — thế thì file chủ đề vẫn đọc được và các component vẫn không dính gì tới chủ đề.</p></div>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">MDN — Dùng biến CSS tuỳ chỉnh</span><span class="lc-sub">Phạm vi, kế thừa và giá trị dự phòng — cơ chế đằng sau cái mẫu này.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/theme" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Màu lấy từ biến CSS</span><span class="lc-sub">Biến theme ở Tailwind 4: @theme, inline, và các utility chúng sinh ra.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Định nghĩa biến CSS ngữ nghĩa (<code>--text-primary</code>, <code>--bg</code>) và tham chiếu chúng trong utility/CSS thay vì màu cứng.</li>
<li>Đổi giá trị biến dưới một class theme và xem cả UI đổi theme mà không sửa component.</li>
<li>Để ý bẫy đặt tên: một class theme toàn cục tên <code>dark</code> sẽ chiếm mọi utility <code>dark:</code> của Tailwind — dùng tên riêng như <code>theme-dark</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn theme được bằng biến CSS và tránh được va chạm tên class với <code>dark:</code> của Tailwind.</p></div>

<h3>🔬 Đo thật: đổi một class, hai cách nối, một va chạm (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>Token theo vai trò, một <code>.card</code> CSS thường, và chính các token đó nối vào Tailwind 4:</p>
<pre><code class="language-css">@import "tailwindcss";

/* token theo VAI TRÒ, ba theme. Chỉ đổi giá trị, không đụng component */
:root            { --text-primary: #111111; --surface: #ffffff; }
html.theme-dark  { --text-primary: #eeeeee; --surface: #0b0b0b; }
html.theme-brown { --text-primary: #f3e9d8; --surface: #2b211a; }

/* component đọc BIẾN, không đọc màu cố định */
.card { color: var(--text-primary); background: var(--surface); padding: 16px; }

/* nối biến vào Tailwind 4 ⇒ có lớp bg-surface / text-fg (create-next-app làm y hệt với --background) */
@theme inline {
  --color-surface: var(--surface);
  --color-fg: var(--text-primary);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}</code></pre>
<div class="out">$ python3 ~/Documents/video-bai-giang/scratchpad/nxj/demo/doc-css.py bg-surface text-fg bg-fg/50 | sed -E 's/\\{background-color:color-mix.*/{… color-mix(… var(--text-primary) 50% …)}/'
bg-surface             ⇒ .bg-surface{background-color:var(--surface)}
text-fg                ⇒ .text-fg{color:var(--text-primary)}
bg-fg/50               ⇒ .bg-fg\\/50{background-color:var(--text-primary)}</div>
<p>Giá trị Chromium tính được sau khi đổi class trên <code>&lt;html&gt;</code> (<code>#css</code> = .card, <code>#tw</code> = <code>bg-surface text-fg</code>, <code>#mo</code> = <code>bg-fg/50</code>):</p>
<div class="out">(gốc)        css nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | tw nền rgb(255, 255, 255) chữ rgb(17, 17, 17) | mo nền oklab(0.177637 0.00000810623 0.00000356138 / 0.5)
theme-dark   css nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | tw nền rgb(11, 11, 11) chữ rgb(238, 238, 238) | mo nền oklab(0.949113 0.0000431836 0.0000190735 / 0.5)
theme-brown  css nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | tw nền rgb(43, 33, 26) chữ rgb(243, 233, 216) | mo nền oklab(0.937341 0.00390819 0.02477 / 0.5)</div>
<p><b>Tailwind 3</b> (Next 14.2.35 + 3.4.19) nối trong config — và một biến đặc không có modifier độ trong suốt:</p>
<pre><code class="language-javascript"><span class="tok-comment">// tailwind.config.js — Tailwind 3: nối biến vào bảng màu trong config</span>
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: { extend: { colors: { surface: 'var(--surface)', fg: 'rgb(var(--fg-rgb) / &lt;alpha-value&gt;)' } } },
};</code></pre>
<div class="out">$ for s in '.bg-surface{' '.bg-surface\\/50{' '.text-fg{' '.text-fg\\/50{'; do printf '%-18s %s\\n' "$s" "$(cat .next/static/css/*.css | grep -cF "$s")"; done
.bg-surface{       1
.bg-surface\\/50{   0
.text-fg{          1
.text-fg\\/50{      1
$ cat .next/static/css/*.css | grep -oE '\\.(bg-surface|text-fg\\\\/50)\\{[^}]*\\}' | head -3
.bg-surface{background-color:var(--surface)}
.text-fg\\/50{color:rgb(var(--fg-rgb)/.5)}</div>
<p><b>Va chạm tên, tái hiện.</b> Notes giữ <code>.dark</code> riêng trên vỏ của nó; người dùng chọn SÁNG. Theme tối toàn trang đặt theo hai cách:</p>
<div class="out">html.class có "dark" · Notes nền lab(8.30603 0.618205 -2.16572)
html.class chỉ "theme-dark" · Notes nền rgb(255, 255, 255)</div>
<p>Và trong kho cuongthai.com:</p>
<div class="out">$ grep -oE -- '--[a-zA-Z0-9-]+\\s*:' src/app/globals.css | sort -u | wc -l | sed 's/^ */biến CSS trong globals.css: /'
biến CSS trong globals.css: 107
$ sed -n '87,92p' src/app/globals.css
  html.theme-dark {
    color-scheme: dark;
    --bg-primary: #18191a;
    --bg-card: #242526;
    --bg-surface: #303031;
    --bg-surface-hover: rgba(255, 255, 255, 0.08);
$ grep -n 'notes-theme-root' src/components/notes/NotesThemeProvider.tsx | head -3
183:        bên trong cây con. className &#96;notes-theme-root&#96; chỉ để
192:        className={&#96;notes-theme-root h-full \${theme === 'dark' ? 'dark' : ''}&#96;}
$ sed -n '/^  theme:/,/colors/p' tailwind.config.ts | head -3; grep -c "var(--" tailwind.config.ts | sed 's/^/dòng màu trỏ vào var(--…) trong tailwind.config.ts: /'
  theme: {
    extend: {
      colors: {
dòng màu trỏ vào var(--…) trong tailwind.config.ts: 18</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># globals.css (Tailwind 4)</span>
@theme inline { --color-surface: var(--surface); }
<span class="tok-comment"># Console DevTools: document.documentElement.classList.toggle("theme-dark") — mọi bg-surface đổi theo</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-6-1-mot-lop" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 6.1 — Một lớp, đúng ở cả hai theme</span><span class="lc-sub">Biến đứng sau mọi utility màu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-6-2-bay-alpha" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 6.2 — Bẫy alpha-value</span><span class="lc-sub">91 lớp không hề tồn tại, có số đo</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-4-tokens-theming" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">Nền tảng Web 12.4 — Token thiết kế và chế độ sáng/tối</span><span class="lc-sub">Token nguyên thuỷ và ngữ nghĩa bằng CSS thuần</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Biến CSS</span><span class="v">Một <code>--custom-prop</code> đọc bằng <code>var(--x)</code>, đổi được lúc chạy.</span></div>
  <div class="kv"><span class="k">Token ngữ nghĩa</span><span class="v">Tên theo vai trò (<code>--text-primary</code>) không theo giá trị.</span></div>
  <div class="kv"><span class="k">Đổi theme bằng swap</span><span class="v">Đổi giá trị biến dưới một class để đổi theme tức thì.</span></div>
  <div class="kv"><span class="k">Va chạm tên</span><span class="v">Một class <code>dark</code> toàn cục đụng biến thể <code>dark:</code> của Tailwind.</span></div>
  <div class="kv"><span class="k">theme-dark</span><span class="v">Một tên class theme riêng tránh va chạm.</span></div>
  <div class="kv"><span class="k">Một nguồn màu</span><span class="v">Component đọc token, không đọc giá trị hex thô.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Theme bằng biến CSS ngữ nghĩa (<code>--text-primary</code>) để component đọc vai trò, không đọc màu thô.</li><li>Đổi giá trị biến dưới một class theme để đổi theme cả UI mà không chạm component.</li><li>Đừng đặt tên class theme toàn cục là <code>dark</code> — nó chiếm biến thể <code>dark:</code> của Tailwind.</li><li>cuongthai.com học điều này bằng cách khổ; nó dùng <code>theme-dark</code> toàn cục và dành <code>dark:</code> cho một vùng có phạm vi.</li></ul>

<h3>📚 Học sâu thêm</h3>
<a class="link-card dl" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" target="_blank" rel="noopener">
  <span class="lc-ico">🎚️</span>
  <span class="lc-body"><span class="lc-title">MDN — CSS custom properties</span><span class="lc-sub">Định nghĩa và dùng CSS variables cho theme.</span></span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-1-position-stacking" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 12.1 — Position and the stacking context</span><span class="lc-sub">Why z-index: 9999 still loses, with screenshots from Chromium</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-1-position-stacking" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 12.1 — Position và ngữ cảnh xếp chồng</span><span class="lc-sub">Vì sao z-index: 9999 vẫn thua, kèm ảnh chụp từ Chromium</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-3-css-architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 12.3 — Naming and organising CSS</span><span class="lc-sub">BEM, CSS Modules, @layer and why class names collide</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-3-css-architecture" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 12.3 — Đặt tên và tổ chức CSS</span><span class="lc-sub">BEM, CSS Modules, @layer và vì sao tên class đụng nhau</span></span>
  <span class="lc-cta">Mở bài</span>
</a>
</div>

<div class="ml-en">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-4-tokens-theming" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Web Foundations 12.4 — Design tokens and theming</span><span class="lc-sub">Primitive and semantic tokens, dark mode with prefers-color-scheme and data-theme</span></span>
  <span class="lc-cta">Open lesson</span>
</a>
</div>
<div class="ml-vi">
<a class="link-card lien-ket-cheo" href="/courses/web-foundations/learn?lessonSlug=wf-12-4-tokens-theming" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Nền tảng Web 12.4 — Token thiết kế và giao diện</span><span class="lc-sub">Token nguyên thuỷ và ngữ nghĩa, chế độ tối với prefers-color-scheme và data-theme</span></span>
  <span class="lc-cta">Mở bài</span>
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
${G13_5}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.5</span>
<h2>Keeping styles sane as the app grows</h2>
<p class="lead">A handful of Tailwind classes on a button is fine. A hundred components with a dozen variants each needs a little structure, or the class strings become unreadable and inconsistent.</p>

<h3>Variants over copy-paste</h3>
<p>When a component has variations — a button that is primary/secondary/danger, small/large — don't scatter conditional strings. Define the variants once (a lookup object, or a helper like <code>class-variance-authority</code>) and pick by prop:</p>
<pre><code class="language-typescript">const button = cva('rounded font-medium', {
  variants: {
    intent: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },
    size:   { sm: 'px-2 py-1 text-sm', lg: 'px-5 py-3 text-lg' },
  },
});
&lt;button className={button({ intent: 'primary', size: 'lg' })}&gt;</code></pre>
<p>Now variants are declared in one place, type-checked, and consistent everywhere the component is used.</p>

<div class="pitfall">
<p><strong>The black-on-black trap — a real, costly cuongthai.com bug.</strong> A component had a <em>fixed</em> dark background (e.g. a permanently dark hero or card) but its text colour came from a theme variable. In light theme, that variable resolves to a dark colour — so you get dark text on a fixed dark background: invisible. The repository history has both halves of it — <code>019db6d3f</code> fixed near-black text on a fixed dark background on <code>/cv/xem</code> (contrast 1.08:1), and <code>562f6379d</code> replaced fixed dark backgrounds and fixed text with tokens across 109 files. The lesson: <strong>pinning a background via a variable is not enough — you must also set an explicit <code>color</code> on any surface that is fixed-dark regardless of theme.</strong> A surface that does not follow the theme cannot borrow the theme's text colour. And do not trust a raw count of "how many elements use the variable" — verify by actually flipping light↔dark and looking, because the failure only shows in the theme where the variable's colour collides with the fixed surface.</p>
</div>

<div class="callout ok">
<p><strong>How to catch it:</strong> test every screen in <em>both</em> themes, not just the one you built in. Most theme bugs are invisible in the theme you developed in and only appear when you flip. A quick light/dark toggle pass before shipping catches the whole class of "unreadable in the other theme" problems.</p>
</div>

<h3>Keeping a design consistent as the app grows</h3>
<div class="lz-map">
  <div class="lz-stage">Constraints beat discipline</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Use the scale, not arbitrary values</div><div class="lz-nsub">&#96;p-4&#96; rather than &#96;p-[17px]&#96;. Every escape hatch is a value nobody else will reuse.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Extract a component, not a class string</div><div class="lz-nsub">Copy-pasted class strings drift. A &#96;&lt;Button variant=&quot;danger&quot;&gt;&#96; changes in one place.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Check contrast when you pick colours</div><div class="lz-nsub">4.5:1 for body text. A palette that fails is invisible on your monitor and unreadable on a phone in sunlight.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Test both themes on every screen</div><div class="lz-nsub">A colour that reads well on white can vanish on near-black. This is a per-screen check, not a per-token one.</div></div></div>
</div>
<div class="pitfall"><p><strong>Trap — hard-coded colours that ignore the theme entirely.</strong> &#96;className="bg-white text-gray-900"&#96; is perfectly readable — measured 17.75:1 in light and 17.75:1 in dark — but it is a white island: the card stays white while everything around it turns near-black. What is actually invisible is <em>mixing</em> a fixed colour with a themed one: a fixed dark background with theme text measured 1.07:1 in light, a theme background with fixed dark text 1.11:1 in dark. It happens most often in a component copied from an example, and it survives review because the screenshot in the PR was taken in light mode. The mechanical fix is to ban raw colour utilities in components and use the role tokens instead (&#96;bg-surface text-fg&#96;), so a component cannot opt out of the theme by accident. Then switching themes on any screen is a real test rather than a spot check.</p></div>
<a class="link-card dl" href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">W3C — Contrast minimum</span><span class="lc-sub">What 4.5:1 means and which text sizes are exempt.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/theme" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Theme configuration</span><span class="lc-sub">Extending the scale properly, instead of reaching for arbitrary values.</span></span>
</a>


<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Extract a repeated set of utilities into a component (not a giant className copied around), so the style has one home.</li>
<li>Audit one dark-theme screen for a black-on-black or white-on-white element and fix it with semantic tokens.</li>
<li>Add a focus-visible ring to an interactive element to keep it keyboard-accessible.</li>
</ol>
<p><strong>Done when:</strong> you can keep styles maintainable at scale and catch the contrast traps.</p></div>

<h3>🔬 Measured: cva in tsc, four surfaces in two themes, three focus styles (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p>The lesson&#39;s <code>button</code> with <code>cva</code>, asked for a variant it does not have, then run:</p>
<div class="out">$ npx tsc --noEmit      # intent: 'danger' — không có trong variants
nut-cva/page.tsx(8,35): error TS2322: Type '"danger"' is not assignable to type '"primary" | "ghost" | null | undefined'.
$ npx tsc --noEmit &amp;&amp; echo "tsc: 0 lỗi (danger → ghost)"
tsc: 0 lỗi (danger → ghost)
$ npx tsx -e "…button(…)"      # cva trả về CHUỖI lớp
button({ intent: 'primary', size: 'lg' }) → "rounded font-medium bg-blue-600 text-white px-5 py-3 text-lg"
button({ intent: 'ghost', size: 'sm' })  → "rounded font-medium bg-transparent px-2 py-1 text-sm"
button()                                 → "rounded font-medium"
$ (bài) &lt;button class={button({ intent: 'primary', size: 'lg' })}&gt;
nut-cva/bai.tsx(2,32): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTML</div>
<p><b>Contrast</b> (WCAG, computed text vs background colour in Chromium; 4.5:1 is the minimum for body text):</p>
<div class="out">A · zinc-900 + theme text              light 1.07:1    theme-dark 15.27:1
B · zinc-900 + text-white              light 17.72:1   theme-dark 17.72:1
C · bg-surface + text-gray-900         light 17.75:1   theme-dark 1.11:1
D · bg-white + text-gray-900           light 17.75:1   theme-dark 17.75:1</div>
<p><b>Focus.</b> Each button clicked with the mouse, then reached with <kbd>Tab</kbd>:</p>
<div class="out">f1 · chuột   CÓ vòng
f2 · chuột   không vòng · outline none
f3 · chuột   không vòng · outline none
Tab 2        f1 CÓ vòng
Tab 3        f2 CÓ vòng
Tab 4        f3 không vòng · outline none</div>
<p>And in this course&#39;s repository:</p>
<div class="out">$ git show --stat --format='%h %ad %s' --date=short 019db6d3f | head -1 | cut -c1-110
019db6d3f 2026-08-22 fix(cv): /cv/xem chữ gần-đen trên nền cố định tối — tương phản 1,08
$ git show --stat --format='%h %ad' --date=short 562f6379d | sed -n '1p;$p'
562f6379d 2026-11-08
 109 files changed, 3285 insertions(+), 3210 deletions(-)
$ grep -rlE "outline-none" frontend/src --include='*.tsx' | wc -l | sed 's/^ */tệp .tsx có outline-none: /'
tệp .tsx có outline-none: 321</div>
<h3>🔁 Run it yourself</h3>
<pre><code class="language-bash">npm i class-variance-authority
<span class="tok-comment"># DevTools → Elements → pick a text element → the colour swatch shows the contrast ratio; flip the theme class and read it again</span></code></pre>
<h3>🔗 Go deeper</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-4-bien-the-cva" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.4 — Variants as a declarative matrix</span><span class="lc-sub">cva from the output side</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-9-1-tuong-phan" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 9.1 — Auditing the real palette for contrast</span><span class="lc-sub">The WCAG formula on every pair</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-9-4-focus" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 9.4 — Focus rings</span><span class="lc-sub">72 outlines removed with nothing put back</span></span></a>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Componentise styles</span><span class="v">Wrap repeated utilities in a component for one source of truth.</span></div>
  <div class="kv"><span class="k">Contrast trap</span><span class="v">Black-on-black / white-on-white when a theme flips but a color was hard-coded.</span></div>
  <div class="kv"><span class="k">Semantic token</span><span class="v">Use role-based colors so both themes stay readable.</span></div>
  <div class="kv"><span class="k">focus-visible</span><span class="v">Keep a visible focus ring for keyboard users.</span></div>
  <div class="kv"><span class="k">Consistency</span><span class="v">Shared components keep spacing and color consistent at scale.</span></div>
  <div class="kv"><span class="k">Accessibility</span><span class="v">Contrast and focus states are correctness, not decoration.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>At scale, wrap repeated utilities in components so each style has one home.</li><li>Hard-coded colors cause black-on-black / white-on-white when a theme flips — use semantic tokens.</li><li>Keep a visible focus ring (<code>focus-visible</code>) for keyboard accessibility.</li><li>Contrast and focus states are correctness requirements, not extras.</li></ul>

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
<pre><code class="language-typescript">const button = cva('rounded font-medium', {
  variants: {
    intent: { primary: 'bg-blue-600 text-white', ghost: 'bg-transparent' },
    size:   { sm: 'px-2 py-1 text-sm', lg: 'px-5 py-3 text-lg' },
  },
});
&lt;button className={button({ intent: 'primary', size: 'lg' })}&gt;</code></pre>
<p>Giờ biến thể được khai ở một chỗ, kiểm kiểu, và nhất quán ở mọi nơi component được dùng.</p>

<div class="pitfall">
<p><strong>Bẫy chữ đen trên nền đen — một bug thật, trả giá đắt của cuongthai.com.</strong> Một component có nền tối <em>cố định</em> (ví dụ một hero hay card luôn tối) nhưng màu chữ lấy từ một biến theme. Ở theme sáng, biến đó ra một màu tối — nên bạn có chữ tối trên nền tối cố định: vô hình. Lịch sử của kho có đủ cả hai nửa — <code>019db6d3f</code> sửa chữ gần đen trên nền tối cố định ở <code>/cv/xem</code> (tương phản 1,08:1), và <code>562f6379d</code> thay nền tối cố định và chữ cố định bằng token trên 109 file. Bài học: <strong>ghim nền bằng một biến là CHƯA đủ — bạn phải đặt cả một <code>color</code> tường minh trên bất kỳ mặt nào tối-cố-định bất kể theme.</strong> Một mặt không theo theme thì không thể mượn màu chữ của theme. Và đừng tin con số thô "bao nhiêu phần tử dùng biến" — hãy verify bằng cách thật sự lật sáng↔tối và nhìn, vì lỗi chỉ hiện ở theme mà màu của biến đụng với mặt cố định.</p>
</div>

<div class="callout ok">
<p><strong>Cách bắt nó:</strong> test mọi màn ở <em>cả hai</em> theme, không chỉ cái bạn dựng bằng. Đa số bug theme vô hình ở theme bạn phát triển và chỉ hiện khi lật. Một lượt toggle sáng/tối nhanh trước khi ship bắt trọn loại lỗi "không đọc được ở theme kia".</p>
</div>

<h3>Giữ một thiết kế nhất quán khi ứng dụng lớn lên</h3>
<div class="lz-map">
  <div class="lz-stage">Ràng buộc thắng kỷ luật</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Dùng cái thang, đừng dùng giá trị tuỳ tiện</div><div class="lz-nsub">&#96;p-4&#96; chứ đừng &#96;p-[17px]&#96;. Mỗi cửa thoát là một giá trị chẳng ai khác dùng lại.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hãy rút ra một component, đừng rút ra một chuỗi class</div><div class="lz-nsub">Chuỗi class chép-dán sẽ trôi dạt. Một &#96;&lt;Button variant=&quot;danger&quot;&gt;&#96; thì đổi ở một chỗ.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm tương phản ngay khi chọn màu</div><div class="lz-nsub">4,5:1 cho chữ thân bài. Một bảng màu trượt chuẩn thì vô hình trên màn hình của bạn và không đọc nổi trên điện thoại ngoài nắng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Thử cả hai chủ đề trên MỌI màn hình</div><div class="lz-nsub">Một màu đọc tốt trên nền trắng có thể biến mất trên nền gần đen. Đây là phép kiểm theo từng màn hình, không phải theo từng token.</div></div></div>
</div>
<div class="pitfall"><p><strong>Bẫy — màu viết cứng, lờ hẳn chủ đề đi.</strong> &#96;className="bg-white text-gray-900"&#96; vẫn đọc rõ — đo được 17.75:1 ở sáng và 17.75:1 ở tối — nhưng nó là một ốc đảo trắng: cái thẻ vẫn trắng trong khi mọi thứ quanh nó chuyển sang gần đen. Thứ thật sự vô hình là <em>trộn</em> một màu cố định với một màu theo chủ đề: nền tối cố định với chữ theo theme đo được 1.07:1 ở sáng, nền theo theme với chữ tối cố định 1.11:1 ở tối. Nó hay xảy ra nhất ở một component chép từ một ví dụ, và nó sống sót qua review vì tấm ảnh chụp trong PR được chụp ở chế độ sáng. Cách chữa máy móc là cấm các utility màu thô trong component và dùng token vai trò thay thế (&#96;bg-surface text-fg&#96;), để một component không thể vô tình thoát khỏi chủ đề. Khi đó việc đổi chủ đề trên bất kỳ màn hình nào mới là một phép thử thật chứ không phải một cú kiểm ngẫu nhiên.</p></div>
<a class="link-card dl" href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">W3C — Tương phản tối thiểu</span><span class="lc-sub">4,5:1 nghĩa là gì và cỡ chữ nào được miễn.</span></span>
</a>
<a class="link-card dl" href="https://tailwindcss.com/docs/theme" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">tailwindcss.com — Cấu hình chủ đề</span><span class="lc-sub">Mở rộng cái thang cho đúng cách, thay vì với tay lấy giá trị tuỳ tiện.</span></span>
</a>


<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Rút một bộ utility lặp lại thành một component (không phải một className khổng lồ chép khắp nơi), để style có một nhà.</li>
<li>Soát một màn hình theme tối tìm một element đen-trên-đen hoặc trắng-trên-trắng và sửa bằng token ngữ nghĩa.</li>
<li>Thêm một vòng focus-visible cho một element tương tác để giữ truy cập bằng bàn phím.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giữ được style dễ bảo trì ở quy mô lớn và bắt được các bẫy tương phản.</p></div>

<h3>🔬 Đo thật: cva qua tsc, bốn bề mặt ở hai theme, ba kiểu focus (Next.js 16.4.6 · Tailwind 4.3.3 · Chromium)</h3>
<p><code>button</code> của bài dùng <code>cva</code>, gọi một biến thể không có, rồi chạy thật:</p>
<div class="out">$ npx tsc --noEmit      # intent: 'danger' — không có trong variants
nut-cva/page.tsx(8,35): error TS2322: Type '"danger"' is not assignable to type '"primary" | "ghost" | null | undefined'.
$ npx tsc --noEmit &amp;&amp; echo "tsc: 0 lỗi (danger → ghost)"
tsc: 0 lỗi (danger → ghost)
$ npx tsx -e "…button(…)"      # cva trả về CHUỖI lớp
button({ intent: 'primary', size: 'lg' }) → "rounded font-medium bg-blue-600 text-white px-5 py-3 text-lg"
button({ intent: 'ghost', size: 'sm' })  → "rounded font-medium bg-transparent px-2 py-1 text-sm"
button()                                 → "rounded font-medium"
$ (bài) &lt;button class={button({ intent: 'primary', size: 'lg' })}&gt;
nut-cva/bai.tsx(2,32): error TS2322: Type '{ children: string; class: string; }' is not assignable to type 'DetailedHTML</div>
<p><b>Tương phản</b> (WCAG, màu chữ và màu nền Chromium tính được; 4,5:1 là mức tối thiểu cho chữ thường):</p>
<div class="out">A · zinc-900 + theme text              sáng 1.07:1    theme-dark 15.27:1
B · zinc-900 + text-white              sáng 17.72:1   theme-dark 17.72:1
C · bg-surface + text-gray-900         sáng 17.75:1   theme-dark 1.11:1
D · bg-white + text-gray-900           sáng 17.75:1   theme-dark 17.75:1</div>
<p><b>Focus.</b> Bấm chuột vào từng nút, rồi đi tới bằng <kbd>Tab</kbd>:</p>
<div class="out">f1 · chuột   CÓ vòng
f2 · chuột   không vòng · outline none
f3 · chuột   không vòng · outline none
Tab 2        f1 CÓ vòng
Tab 3        f2 CÓ vòng
Tab 4        f3 không vòng · outline none</div>
<p>Và trong kho của chính khoá này:</p>
<div class="out">$ git show --stat --format='%h %ad %s' --date=short 019db6d3f | head -1 | cut -c1-110
019db6d3f 2026-08-22 fix(cv): /cv/xem chữ gần-đen trên nền cố định tối — tương phản 1,08
$ git show --stat --format='%h %ad' --date=short 562f6379d | sed -n '1p;$p'
562f6379d 2026-11-08
 109 files changed, 3285 insertions(+), 3210 deletions(-)
$ grep -rlE "outline-none" frontend/src --include='*.tsx' | wc -l | sed 's/^ */tệp .tsx có outline-none: /'
tệp .tsx có outline-none: 321</div>
<h3>🔁 Tự chạy lại</h3>
<pre><code class="language-bash">npm i class-variance-authority
<span class="tok-comment"># DevTools → Elements → chọn một phần tử chữ → ô màu hiện tỉ lệ tương phản; đổi class theme rồi đọc lại</span></code></pre>
<h3>🔗 Học sâu hơn</h3>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-4-4-bien-the-cva" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 4.4 — Biến thể: ma trận khai báo</span><span class="lc-sub">cva nhìn từ đầu ra</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-9-1-tuong-phan" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 9.1 — Soát tương phản trên bảng màu thật</span><span class="lc-sub">Công thức WCAG cho từng cặp màu</span></span></a>
<a class="link-card lien-ket-cheo" href="/courses/tailwind-css/learn?lessonSlug=tw-9-4-focus" target="_blank" rel="noopener"><span class="lc-ico">💨</span><span class="lc-body"><span class="lc-title">Tailwind CSS · 9.4 — Vòng focus</span><span class="lc-sub">72 chỗ gỡ outline mà không đặt lại gì</span></span></a>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Component hoá style</span><span class="v">Bọc utility lặp lại trong một component để có một nguồn sự thật.</span></div>
  <div class="kv"><span class="k">Bẫy tương phản</span><span class="v">Đen-trên-đen / trắng-trên-trắng khi theme lật mà một màu bị cứng.</span></div>
  <div class="kv"><span class="k">Token ngữ nghĩa</span><span class="v">Dùng màu theo vai trò để cả hai theme vẫn đọc được.</span></div>
  <div class="kv"><span class="k">focus-visible</span><span class="v">Giữ vòng focus thấy được cho người dùng bàn phím.</span></div>
  <div class="kv"><span class="k">Nhất quán</span><span class="v">Component dùng chung giữ spacing và màu nhất quán ở quy mô lớn.</span></div>
  <div class="kv"><span class="k">Khả năng truy cập</span><span class="v">Tương phản và trạng thái focus là tính đúng, không phải trang trí.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ở quy mô lớn, bọc utility lặp lại trong component để mỗi style có một nhà.</li><li>Màu cứng gây đen-trên-đen / trắng-trên-trắng khi theme lật — hãy dùng token ngữ nghĩa.</li><li>Giữ một vòng focus thấy được (<code>focus-visible</code>) cho khả năng truy cập bằng bàn phím.</li><li>Tương phản và trạng thái focus là yêu cầu tính đúng, không phải thứ thêm thắt.</li></ul>

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
