/**
 * Bài 12.4 — Design token & chế độ sáng/tối (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật, giả lập prefers-color-scheme).
 * Deck: scripts/slides-src/wf-12-4.mjs (11 slide, WF/v1/wf-12-4).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const OUT_THEMES = ['light: ' + OUT['12-4/theme-light'], 'dark:  ' + OUT['12-4/theme-dark']].join('\n');

const G = walkWf('wf-12-4', 'Design tokens & theming', 'Design token & chế độ sáng/tối', [
  [1, 'Design tokens & theming',
    '<p>A design token is a named design decision: the brand colour, the standard spacing, the card radius. Stored as CSS custom properties, tokens make a redesign a one-line change and a dark mode a few lines.</p>',
    '<p>Design token là một quyết định thiết kế có tên: màu thương hiệu, khoảng cách chuẩn, độ bo góc của thẻ. Lưu bằng CSS custom property, token biến một lần đổi giao diện thành một dòng sửa và chế độ tối thành vài dòng.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills that together give you a real theming system: tokens in custom properties, the split between primitive and semantic tokens, following the operating system, a remembered switch with no flash of the wrong theme, and checking contrast with numbers.</p>',
    '<p>Năm kỹ năng ghép lại thành một hệ thống theme thật: token bằng custom property, tách token nguyên thuỷ và token ngữ nghĩa, theo cài đặt hệ điều hành, nút chuyển nhớ lựa chọn mà không loé sai theme, và kiểm độ tương phản bằng con số.</p>'],
  [3, 'Three layers of tokens',
    '<p>Primitive tokens are the palette: <code>--blue-600</code>. Semantic tokens say what a colour is for: <code>--color-primary</code>, <code>--color-bg</code>. Components only ever use semantic tokens. That one rule is what makes dark mode cheap.</p>',
    '<p>Token nguyên thuỷ là bảng màu: <code>--blue-600</code>. Token ngữ nghĩa nói màu dùng để làm gì: <code>--color-primary</code>, <code>--color-bg</code>. Component chỉ dùng token ngữ nghĩa. Riêng luật đó làm chế độ tối trở nên rẻ.</p>'],
  [4, 'Dark mode = swap the semantic layer',
    '<p>The dark theme redefines only the semantic tokens — background becomes the darkest grey, text the lightest, primary a lighter blue. Not a single component rule changes. The same block appears twice: once for the OS setting, once for an explicit <code>data-theme</code> attribute.</p>',
    '<p>Theme tối chỉ định nghĩa lại các token ngữ nghĩa — nền thành xám đậm nhất, chữ thành sáng nhất, màu chính thành xanh nhạt hơn. Không một luật component nào thay đổi. Cùng một khối xuất hiện hai lần: một cho cài đặt hệ điều hành, một cho thuộc tính <code>data-theme</code> tường minh.</p>'],
  [5, 'Same HTML, two settings',
    '<p>The identical page rendered twice in Chromium, once with the operating system in light mode and once in dark mode. The measured background colour changed from near-white to near-black, purely because one media query switched the token values.</p>',
    '<p>Cùng một trang render hai lần trong Chromium, một lần hệ điều hành ở chế độ sáng và một lần ở chế độ tối. Màu nền đo được đổi từ gần trắng sang gần đen, chỉ vì một media query đã đổi giá trị token.</p>'],
  [6, 'A switch that remembers',
    '<p>Users also want to choose. The button stores the choice in <code>localStorage</code> and sets <code>data-theme</code>. A tiny script in the head applies the saved choice before the page is painted, so there is no flash of the wrong theme on reload.</p>',
    '<p>Người dùng cũng muốn tự chọn. Nút bấm lưu lựa chọn vào <code>localStorage</code> và đặt <code>data-theme</code>. Một đoạn script nhỏ trong head áp lựa chọn đã lưu trước khi trang được vẽ, nên tải lại không bị loé theme sai.</p>'],
  [7, 'Custom property traps',
    '<p>Three real traps measured in one page: a token without a unit silently breaks the declaration, a typo in a token name silently falls back, and tokens are inherited — a parent can override them for everything inside it.</p>',
    '<p>Ba bẫy thật đo trong một trang: token thiếu đơn vị làm hỏng khai báo trong im lặng, gõ sai tên token thì lặng lẽ dùng giá trị dự phòng, và token được kế thừa — một cha có thể đè giá trị cho mọi thứ bên trong.</p>'],
  [8, 'Why 984px',
    '<p>Custom properties store raw text. <code>var(--size)</code> became <code>width: 20</code>, which is invalid, but the browser only notices after substituting the value — so instead of an error it uses the initial value, auto, which here is the full width. Put the unit inside the token.</p>',
    '<p>Custom property lưu chữ thô. <code>var(--size)</code> thành <code>width: 20</code>, không hợp lệ, nhưng trình duyệt chỉ nhận ra sau khi thay giá trị vào — nên thay vì báo lỗi nó dùng giá trị khởi đầu là auto, ở đây là toàn bộ bề rộng. Hãy để đơn vị nằm trong token.</p>'],
  [9, 'Contrast',
    '<p>The WCAG formula computed for each token pair. Every pair in both themes passes the 4.5 to 1 minimum for normal text; the classic light grey on white fails at 2.54. Run this check whenever a token changes.</p>',
    '<p>Công thức WCAG tính cho từng cặp token. Mọi cặp ở cả hai theme đều đạt mức tối thiểu 4,5 trên 1 cho chữ thường; cặp xám nhạt trên nền trắng kinh điển trượt với 2,54. Chạy phép kiểm này mỗi khi một token thay đổi.</p>'],
  [10, 'Beyond colour',
    '<p>Spacing, radius, font sizes, shadows, the z-index scale from lesson 12.1 and motion durations from 12.2 are tokens too. A good rule: if a value appears in more than one component, give it a name.</p>',
    '<p>Khoảng cách, độ bo góc, cỡ chữ, bóng đổ, thang z-index ở bài 12.1 và thời lượng chuyển động ở 12.2 cũng là token. Một luật tốt: giá trị nào xuất hiện ở hơn một component thì đặt tên cho nó.</p>'],
  [11, 'Summary & practice',
    '<p>The practice turns your navbar page into a themed page. The strictest "Done when" check is the first one: no colour literal outside <code>:root</code>. If you can pass it, the next redesign of that page is a token edit.</p>',
    '<p>Bài luyện biến trang thanh điều hướng của bạn thành trang có theme. Phép kiểm "Xong khi" khắt khe nhất là cái đầu: không mã màu nào nằm ngoài <code>:root</code>. Qua được nó thì lần đổi giao diện tới của trang chỉ là sửa token.</p>'],
]);

export default {
  title: '12.4 — Design tokens and theming|||12.4 — Token thiết kế và chế độ sáng/tối',
  slug: 'wf-12-4-tokens-theming',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Design token bằng CSS custom property, token nguyên thuỷ → ngữ nghĩa → component, chế độ tối theo prefers-color-scheme (chụp thật cả hai), nút chuyển nhớ lựa chọn không loé, bẫy thiếu đơn vị và gõ sai tên token, kiểm tương phản WCAG bằng số.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>One place for every design decision</h2>
<p class="lead">After this lesson you can store colours, spacing and radii as named <strong>design tokens</strong>, change the whole site's brand colour in one line, add a dark theme that follows the operating system, give users a switch that remembers their choice without flashing the wrong theme on reload, and prove with numbers that your text is readable. Why it matters: users expect dark mode; designers change the palette; and without tokens every one of those changes means searching hundreds of hex codes across dozens of files.</p>

<h3>Step 1 — custom properties are the storage</h3>
<p>A <strong>CSS custom property</strong> is a variable whose name starts with two dashes. You define it on an element — usually <code>:root</code> (the <code>&lt;html&gt;</code> element) so the whole page inherits it — and read it with <code>var(--name)</code>. A <strong>design token</strong> is simply a custom property that stores a design decision.</p>
<pre><code class="language-css">:root { --color-primary: #2563eb; }
.btn  { background: var(--color-primary); }</code></pre>
<p>Unlike Sass variables, custom properties exist in the browser at run time: they are inherited like <code>color</code>, can be changed by a media query or by JavaScript, and DevTools shows their current values.</p>

<h3>Step 2 — three layers: primitive, semantic, component</h3>
${ma('css', CODE['12-4/theme.css'], [1, 20])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Primitive tokens</span><span class="lz-t">--blue-600, --gray-900</span><span class="lz-d">The raw palette and scales. Components never use them directly.</span></div>
<div class="lz-layer"><span class="lz-k">Semantic tokens</span><span class="lz-t">--color-bg, --color-primary</span><span class="lz-d">What a value is <em>for</em>. Each points at a primitive. Themes change only this layer.</span></div>
<div class="lz-layer"><span class="lz-k">Component CSS</span><span class="lz-t">.btn { background: var(--color-primary) }</span><span class="lz-d">Uses semantic tokens only — and therefore works in every theme without changes.</span></div>
</div>
<p>Why two layers of tokens and not just one? Because "blue" is not a role. In dark mode the primary colour must become a <em>lighter</em> blue to stay readable on a dark background. If buttons used <code>--blue-600</code> directly you would have to edit every component; with <code>--color-primary</code> you edit one line in the theme.</p>

<h3>Step 3 — dark mode is a swap of the semantic layer</h3>
${ma('css', CODE['12-4/theme.css'], [21, 44])}
<p>The dark block redefines the five semantic tokens and nothing else; the component rules at the bottom never mention a colour. The block appears twice on purpose: inside <code>@media (prefers-color-scheme: dark)</code> to follow the operating system — unless the user explicitly chose light (<code>:not([data-theme="light"])</code>) — and as <code>:root[data-theme="dark"]</code> for an explicit choice.</p>
${ma('html', CODE['12-4/theme-dark.html'], [3, 21])}
${ra(OUT_THEMES)}
<p>The same file was opened twice in Chromium with the operating-system setting emulated — light, then dark. <code>matchMedia</code> reported the setting, the token <code>--color-bg</code> switched from <code>#f8fafc</code> to <code>#0f172a</code>, and the body's computed background followed. Both screenshots are on slide 5.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — inverting colours with a filter.</strong> <code>html { filter: invert(1); }</code> looks like a free dark mode for ten seconds: then you notice photos turned into negatives, brand colours became their opposites, and shadows glow white. Dark themes are designed: dark backgrounds are not pure black, text is not pure white, and accent colours are lightened. Tokens let you design it once.</p></div>

<h3>Step 4 — a switch that remembers, without a flash</h3>
${ma('html', CODE['12-4/toggle.html'], [6, 33])}
${ra(OUT['12-4/toggle'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Inline script in &lt;head&gt;</span><span class="lz-d">Reads <code>localStorage</code> and sets <code>data-theme</code> on <code>&lt;html&gt;</code> before anything is painted.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CSS decides</span><span class="lz-d">Saved choice wins; otherwise the OS setting; otherwise light.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Click toggles</span><span class="lz-d">Set <code>data-theme</code> and save it. Tokens update, the page repaints instantly.</span></div>
</div>
<p>The output reads like a user session: the OS says dark and nothing is saved, so the page starts dark; one click switches to light and saves <code>"light"</code>; another switches back. Every read and write of <code>localStorage</code> is wrapped in <code>try/catch</code> because storage can be blocked (private windows, strict settings) — the page must still work, just without remembering.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the flash of the wrong theme.</strong> If you apply the saved theme in a script at the end of <code>&lt;body&gt;</code>, or in a React effect, the browser first paints the page in the default theme and switches a moment later: a white flash for a dark-mode user on every page load. Put the tiny theme script in <code>&lt;head&gt;</code>, before the stylesheet, as shown. (Next.js projects usually use a small library such as <code>next-themes</code>, which injects exactly this script.)</p></div>

<h3>Step 5 — custom property traps, measured</h3>
${ma('html', CODE['12-4/var-traps.html'], [6, 26])}
${ra(OUT['12-4/var-traps'])}
<ul>
<li><strong>No unit:</strong> <code>--size: 20</code> stores the text "20". <code>width: var(--size)</code> becomes <code>width: 20</code>, which is invalid — but the browser only finds out <em>after</em> substituting, so it cannot fall back to an earlier declaration. It uses the property's initial value instead (<code>auto</code>): 984&nbsp;px, the full width. No error appears anywhere. Store <code>20px</code>, or convert with <code>calc(var(--size) * 1px)</code>.</li>
<li><strong>Typos:</strong> <code>var(--brnad, red)</code> silently uses its fallback. Without a fallback it would silently become the initial value. Keep tokens in one file and use editor autocompletion; some linters check names.</li>
<li><strong>Inheritance:</strong> <code>.scope { --gap: 40px }</code> changed the token for everything inside <code>.scope</code>. That is a feature — a "compact" section can redefine <code>--space-*</code> — but it also means a stray redefinition deep in the tree changes its whole subtree.</li>
</ul>

<h3>Step 6 — contrast: measure, do not guess</h3>
${ma('html', CODE['12-4/contrast.html'], [9, 27])}
${ra(OUT['12-4/contrast'])}
<p>The <strong>WCAG</strong> accessibility guidelines define contrast as a ratio between the relative luminance of two colours, from 1:1 (identical) to 21:1 (black on white). Normal-size text needs at least <strong>4.5:1</strong> (level AA); large text 3:1. Every semantic pair of our two themes passes; the popular "light grey text on white" (<code>#9ca3af</code>) fails at 2.54:1 — readable for the designer on a good monitor, unreadable on a phone in sunlight. Check every pair in both themes whenever a token changes; DevTools shows the ratio in the colour picker too.</p>

<h3>Tokens beyond colour</h3>
<pre><code class="language-css">:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --radius-sm: 6px;  --radius-md: 10px;
  --font-size-sm: 0.875rem;  --font-size-lg: 1.25rem;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.12);
  --z-modal: 400;           /* the z-index scale from lesson 12.1 */
  --duration-fast: 150ms;   /* motion tokens from lesson 12.2 */
}</code></pre>
<p>A practical rule: if a value appears in more than one component, it is a token. Design tools (Figma variables) and token pipelines (Style Dictionary) can export these names, so designers and developers share one vocabulary.</p>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Take the navbar page from lesson 12.3. Add primitive tokens (at least two blues and four greys) and semantic tokens (<code>--color-bg</code>, <code>--color-text</code>, <code>--color-muted</code>, <code>--color-primary</code>, <code>--color-border</code>). Replace every colour in the component CSS with a semantic token. Add a dark theme through <code>prefers-color-scheme</code> and <code>[data-theme="dark"]</code>, plus a toggle button that saves the choice, with the no-flash script in <code>&lt;head&gt;</code>.</p>
<p><strong>Done when:</strong> searching your CSS for <code>#</code> colour codes finds them only inside <code>:root</code> blocks; reloading the page keeps the chosen theme with no white flash (try it with DevTools → Network → throttling "Slow 4G" to make a flash visible); and every text/background pair you use is at least 4.5:1 in both themes (DevTools colour picker shows the ratio). Code Lab module 12.4 grades a version of this page in both colour schemes.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">custom property</span><span class="v">thuộc tính tuỳ biến (biến CSS) — <code>--tên</code>, đọc bằng <code>var()</code>.</span></div>
  <div class="kv"><span class="k">design token</span><span class="v">token thiết kế — một quyết định thiết kế có tên (màu, khoảng cách…).</span></div>
  <div class="kv"><span class="k">primitive / semantic token</span><span class="v">token nguyên thuỷ / ngữ nghĩa — bảng màu thô / vai trò của màu.</span></div>
  <div class="kv"><span class="k">prefers-color-scheme</span><span class="v">media query cho biết hệ điều hành đang sáng hay tối.</span></div>
  <div class="kv"><span class="k">FOUC / theme flash</span><span class="v">loé sai giao diện — vẽ theme mặc định trước rồi mới đổi.</span></div>
  <div class="kv"><span class="k">invalid at computed-value time</span><span class="v">không hợp lệ lúc tính giá trị — dùng giá trị khởi đầu, không báo lỗi.</span></div>
  <div class="kv"><span class="k">fallback</span><span class="v">giá trị dự phòng — đối số thứ hai của <code>var()</code>.</span></div>
  <div class="kv"><span class="k">contrast ratio (WCAG AA)</span><span class="v">tỉ lệ tương phản — chữ thường cần ≥ 4,5:1.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Design tokens are custom properties holding design decisions; define them on <code>:root</code>.</li>
  <li>Primitive tokens hold the palette; semantic tokens hold roles; components use semantic tokens only.</li>
  <li>A dark theme redefines the semantic layer — inside <code>prefers-color-scheme</code> and for <code>[data-theme]</code>.</li>
  <li>Apply a saved theme in a tiny <code>&lt;head&gt;</code> script to avoid a flash; guard <code>localStorage</code> with try/catch.</li>
  <li>Put units in tokens; typos and missing units fail silently.</li>
  <li>Measure contrast for every pair in both themes (≥ 4.5:1 for normal text).</li>
</ul>
${nguon('📗', 'MDN — Using CSS custom properties', 'Syntax, inheritance, fallbacks and the invalid-at-computed-value rule', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties')}
${nguon('📘', 'web.dev — prefers-color-scheme: Hello darkness, my old friend', 'A complete guide to building a dark theme properly', 'https://web.dev/articles/prefers-color-scheme')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-4-theme-css-variables', title: 'Next.js 13.4 — theme with CSS variables (and the naming trap)', sub: 'The same token system inside a Next.js app, including the no-flash script', cta: 'Open lesson' })}
${lienKet({ khoa: 'react', bai: 'rx-13-2-hook-styling', title: 'React 13.2 — styling: CSS Modules or Tailwind', sub: 'How tokens plug into CSS Modules and into Tailwind’s theme', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Một chỗ duy nhất cho mọi quyết định thiết kế</h2>
<p class="lead">Học xong bài này bạn lưu được màu, khoảng cách và độ bo góc thành các <strong>design token</strong> có tên, đổi màu thương hiệu cả trang bằng một dòng, thêm theme tối theo cài đặt hệ điều hành, cho người dùng một nút chuyển nhớ lựa chọn mà không loé sai theme khi tải lại, và chứng minh bằng con số rằng chữ của bạn đọc được. Vì sao cần: người dùng mong có chế độ tối; nhà thiết kế đổi bảng màu; và không có token thì mỗi lần thay đổi như thế là đi tìm hàng trăm mã hex rải trong hàng chục file.</p>

<h3>Bước 1 — custom property là nơi lưu</h3>
<p><strong>CSS custom property</strong> là một biến có tên bắt đầu bằng hai dấu gạch ngang. Bạn định nghĩa nó trên một phần tử — thường là <code>:root</code> (phần tử <code>&lt;html&gt;</code>) để cả trang kế thừa — và đọc bằng <code>var(--tên)</code>. <strong>Design token</strong> đơn giản là một custom property lưu một quyết định thiết kế.</p>
<pre><code class="language-css">:root { --color-primary: #2563eb; }
.btn  { background: var(--color-primary); }</code></pre>
<p>Khác biến Sass, custom property tồn tại trong trình duyệt lúc chạy: được kế thừa như <code>color</code>, đổi được bằng media query hay JavaScript, và DevTools hiện giá trị hiện tại của chúng.</p>

<h3>Bước 2 — ba tầng: nguyên thuỷ, ngữ nghĩa, component</h3>
${ma('css', CODE['12-4/theme.css'], [1, 20])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Token nguyên thuỷ</span><span class="lz-t">--blue-600, --gray-900</span><span class="lz-d">Bảng màu và thang đo thô. Component không bao giờ dùng trực tiếp.</span></div>
<div class="lz-layer"><span class="lz-k">Token ngữ nghĩa</span><span class="lz-t">--color-bg, --color-primary</span><span class="lz-d">Giá trị dùng để <em>làm gì</em>. Mỗi cái trỏ tới một token nguyên thuỷ. Theme chỉ đổi tầng này.</span></div>
<div class="lz-layer"><span class="lz-k">CSS component</span><span class="lz-t">.btn { background: var(--color-primary) }</span><span class="lz-d">Chỉ dùng token ngữ nghĩa — nên chạy được ở mọi theme mà không phải sửa.</span></div>
</div>
<p>Vì sao hai tầng token mà không chỉ một? Vì "xanh dương" không phải một vai trò. Ở chế độ tối, màu chính phải thành xanh <em>nhạt hơn</em> để vẫn đọc được trên nền tối. Nếu nút dùng thẳng <code>--blue-600</code> bạn sẽ phải sửa mọi component; với <code>--color-primary</code> bạn sửa một dòng trong theme.</p>

<h3>Bước 3 — chế độ tối là tráo tầng ngữ nghĩa</h3>
${ma('css', CODE['12-4/theme.css'], [21, 44])}
<p>Khối tối định nghĩa lại năm token ngữ nghĩa, không gì khác; các luật component ở cuối không hề nhắc tới một màu nào. Khối này xuất hiện hai lần có chủ đích: trong <code>@media (prefers-color-scheme: dark)</code> để theo hệ điều hành — trừ khi người dùng đã chủ động chọn sáng (<code>:not([data-theme="light"])</code>) — và dạng <code>:root[data-theme="dark"]</code> cho lựa chọn tường minh.</p>
${ma('html', CODE['12-4/theme-dark.html'], [3, 21])}
${ra(OUT_THEMES)}
<p>Cùng một file được mở hai lần trong Chromium với cài đặt hệ điều hành được giả lập — sáng, rồi tối. <code>matchMedia</code> báo đúng cài đặt, token <code>--color-bg</code> đổi từ <code>#f8fafc</code> sang <code>#0f172a</code>, và nền đã tính của body đổi theo. Cả hai ảnh chụp ở slide 5.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đảo màu bằng filter.</strong> <code>html { filter: invert(1); }</code> trông như chế độ tối miễn phí được mười giây: rồi bạn thấy ảnh thành âm bản, màu thương hiệu thành màu ngược, bóng đổ phát sáng trắng. Theme tối phải được thiết kế: nền tối không phải đen tuyền, chữ không phải trắng tuyền, và màu nhấn được làm sáng hơn. Token cho bạn thiết kế nó một lần.</p></div>

<h3>Bước 4 — nút chuyển nhớ lựa chọn, không loé</h3>
${ma('html', CODE['12-4/toggle.html'], [6, 33])}
${ra(OUT['12-4/toggle'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Script nội tuyến trong &lt;head&gt;</span><span class="lz-d">Đọc <code>localStorage</code> và đặt <code>data-theme</code> lên <code>&lt;html&gt;</code> trước khi vẽ bất cứ gì.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">CSS quyết định</span><span class="lz-d">Lựa chọn đã lưu thắng; không có thì theo hệ điều hành; không nữa thì sáng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bấm để chuyển</span><span class="lz-d">Đặt <code>data-theme</code> và lưu lại. Token cập nhật, trang vẽ lại tức thì.</span></div>
</div>
<p>Output đọc như một phiên dùng thật: hệ điều hành nói tối và chưa lưu gì, nên trang khởi đầu tối; một cú bấm chuyển sang sáng và lưu <code>"light"</code>; cú nữa chuyển lại. Mọi lần đọc, ghi <code>localStorage</code> đều bọc <code>try/catch</code> vì bộ nhớ có thể bị chặn (cửa sổ ẩn danh, cài đặt nghiêm ngặt) — trang vẫn phải chạy, chỉ là không nhớ được.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — loé sai theme.</strong> Nếu bạn áp theme đã lưu trong một script ở cuối <code>&lt;body&gt;</code>, hoặc trong effect của React, trình duyệt sẽ vẽ trang bằng theme mặc định trước rồi đổi một lát sau: một cú loé trắng với người dùng chế độ tối ở mỗi lần tải trang. Đặt đoạn script theme nhỏ trong <code>&lt;head&gt;</code>, trước stylesheet, như ví dụ. (Dự án Next.js thường dùng thư viện nhỏ như <code>next-themes</code>, nó chèn đúng đoạn script này.)</p></div>

<h3>Bước 5 — bẫy custom property, đo thật</h3>
${ma('html', CODE['12-4/var-traps.html'], [6, 26])}
${ra(OUT['12-4/var-traps'])}
<ul>
<li><strong>Thiếu đơn vị:</strong> <code>--size: 20</code> lưu chữ "20". <code>width: var(--size)</code> thành <code>width: 20</code>, không hợp lệ — nhưng trình duyệt chỉ phát hiện <em>sau khi</em> thay giá trị vào, nên không lùi về khai báo trước được. Nó dùng giá trị khởi đầu của thuộc tính (<code>auto</code>): 984&nbsp;px, toàn bộ bề rộng. Không có lỗi nào hiện ra. Hãy lưu <code>20px</code>, hoặc đổi bằng <code>calc(var(--size) * 1px)</code>.</li>
<li><strong>Gõ sai:</strong> <code>var(--brnad, red)</code> lặng lẽ dùng giá trị dự phòng. Không có dự phòng thì lặng lẽ thành giá trị khởi đầu. Giữ token trong một file và dùng gợi ý của trình soạn thảo; một số linter kiểm tên.</li>
<li><strong>Kế thừa:</strong> <code>.scope { --gap: 40px }</code> đổi token cho mọi thứ bên trong <code>.scope</code>. Đó là tính năng — một vùng "gọn" có thể định nghĩa lại <code>--space-*</code> — nhưng cũng nghĩa là một lần định nghĩa lạc chỗ sâu trong cây làm đổi cả nhánh con.</li>
</ul>

<h3>Bước 6 — tương phản: đo, đừng đoán</h3>
${ma('html', CODE['12-4/contrast.html'], [9, 27])}
${ra(OUT['12-4/contrast'])}
<p>Hướng dẫn tiếp cận <strong>WCAG</strong> định nghĩa độ tương phản là tỉ lệ giữa độ chói tương đối của hai màu, từ 1:1 (giống hệt) tới 21:1 (đen trên trắng). Chữ cỡ thường cần ít nhất <strong>4,5:1</strong> (mức AA); chữ lớn 3:1. Mọi cặp ngữ nghĩa của hai theme đều đạt; cặp "chữ xám nhạt trên nền trắng" phổ biến (<code>#9ca3af</code>) trượt với 2,54:1 — nhà thiết kế đọc được trên màn hình tốt, không đọc nổi trên điện thoại ngoài nắng. Kiểm mọi cặp ở cả hai theme mỗi khi token đổi; bảng chọn màu của DevTools cũng hiện tỉ lệ này.</p>

<h3>Token không chỉ là màu</h3>
<pre><code class="language-css">:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --radius-sm: 6px;  --radius-md: 10px;
  --font-size-sm: 0.875rem;  --font-size-lg: 1.25rem;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.12);
  --z-modal: 400;           /* thang z-index ở bài 12.1 */
  --duration-fast: 150ms;   /* token chuyển động ở bài 12.2 */
}</code></pre>
<p>Một luật thực tế: giá trị nào xuất hiện ở hơn một component thì là token. Công cụ thiết kế (biến của Figma) và quy trình token (Style Dictionary) xuất được đúng các tên này, nên nhà thiết kế và lập trình viên dùng chung một bộ từ vựng.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Lấy trang thanh điều hướng ở bài 12.3. Thêm token nguyên thuỷ (ít nhất hai màu xanh và bốn màu xám) và token ngữ nghĩa (<code>--color-bg</code>, <code>--color-text</code>, <code>--color-muted</code>, <code>--color-primary</code>, <code>--color-border</code>). Thay mọi màu trong CSS component bằng token ngữ nghĩa. Thêm theme tối qua <code>prefers-color-scheme</code> và <code>[data-theme="dark"]</code>, cùng một nút chuyển lưu lựa chọn, với script chống loé trong <code>&lt;head&gt;</code>.</p>
<p><strong>Xong khi:</strong> tìm mã màu <code>#</code> trong CSS chỉ thấy bên trong các khối <code>:root</code>; tải lại trang giữ đúng theme đã chọn mà không loé trắng (thử với DevTools → Network → throttling "Slow 4G" để cú loé lộ ra); và mọi cặp chữ/nền bạn dùng đạt ít nhất 4,5:1 ở cả hai theme (bảng chọn màu của DevTools hiện tỉ lệ). Code Lab module 12.4 chấm một phiên bản trang này ở cả hai chế độ màu.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">custom property</span><span class="v">thuộc tính tuỳ biến (biến CSS) — <code>--tên</code>, đọc bằng <code>var()</code>.</span></div>
  <div class="kv"><span class="k">design token</span><span class="v">token thiết kế — một quyết định thiết kế có tên (màu, khoảng cách…).</span></div>
  <div class="kv"><span class="k">primitive / semantic token</span><span class="v">token nguyên thuỷ / ngữ nghĩa — bảng màu thô / vai trò của màu.</span></div>
  <div class="kv"><span class="k">prefers-color-scheme</span><span class="v">media query cho biết hệ điều hành đang sáng hay tối.</span></div>
  <div class="kv"><span class="k">FOUC / theme flash</span><span class="v">loé sai giao diện — vẽ theme mặc định trước rồi mới đổi.</span></div>
  <div class="kv"><span class="k">invalid at computed-value time</span><span class="v">không hợp lệ lúc tính giá trị — dùng giá trị khởi đầu, không báo lỗi.</span></div>
  <div class="kv"><span class="k">fallback</span><span class="v">giá trị dự phòng — đối số thứ hai của <code>var()</code>.</span></div>
  <div class="kv"><span class="k">contrast ratio (WCAG AA)</span><span class="v">tỉ lệ tương phản — chữ thường cần ≥ 4,5:1.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Design token là custom property giữ quyết định thiết kế; định nghĩa trên <code>:root</code>.</li>
  <li>Token nguyên thuỷ giữ bảng màu; token ngữ nghĩa giữ vai trò; component chỉ dùng token ngữ nghĩa.</li>
  <li>Theme tối định nghĩa lại tầng ngữ nghĩa — trong <code>prefers-color-scheme</code> và cho <code>[data-theme]</code>.</li>
  <li>Áp theme đã lưu trong một script nhỏ ở <code>&lt;head&gt;</code> để khỏi loé; bọc <code>localStorage</code> bằng try/catch.</li>
  <li>Để đơn vị trong token; gõ sai và thiếu đơn vị hỏng trong im lặng.</li>
  <li>Đo tương phản cho mọi cặp ở cả hai theme (≥ 4,5:1 với chữ thường).</li>
</ul>
${nguon('📗', 'MDN — Using CSS custom properties', 'Cú pháp, kế thừa, giá trị dự phòng và luật không hợp lệ lúc tính giá trị', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties')}
${nguon('📘', 'web.dev — prefers-color-scheme: Hello darkness, my old friend', 'Hướng dẫn đầy đủ để dựng theme tối cho đúng', 'https://web.dev/articles/prefers-color-scheme')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-4-theme-css-variables', title: 'Next.js 13.4 — theme bằng CSS variables (và bẫy đặt tên)', sub: 'Cùng hệ token đó trong app Next.js, kể cả script chống loé', cta: 'Mở bài' })}
${lienKet({ khoa: 'react', bai: 'rx-13-2-hook-styling', title: 'React 13.2 — tạo kiểu: CSS Modules hay Tailwind', sub: 'Token cắm vào CSS Modules và vào theme của Tailwind thế nào', cta: 'Mở bài' })}
</div>
`,
};
