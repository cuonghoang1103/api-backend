/**
 * Bài 12.3 — Đặt tên và tổ chức CSS (nâng cấp 01/11/2026). Mã + output: ../_ma.mjs (Chromium thật).
 * Deck: scripts/slides-src/wf-12-3.mjs (12 slide, WF/v1/wf-12-3).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-12-3', 'Naming & organising CSS', 'Đặt tên & tổ chức CSS', [
  [1, 'Naming & organising CSS',
    '<p>CSS on a tutorial page is easy. CSS on a project that four people change for a year becomes a place nobody dares to touch. This lesson shows the two real causes and four tools teams use to keep stylesheets calm.</p>',
    '<p>CSS trong một trang bài tập thì dễ. CSS trong dự án bốn người cùng sửa suốt một năm thành nơi không ai dám đụng. Bài này chỉ ra hai nguyên nhân thật và bốn công cụ các nhóm dùng để giữ stylesheet yên ổn.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to explain why a style suddenly breaks in a part of the site nobody edited, name classes so that cannot happen, and use the browser’s own ordering tools. You will also recognise the approaches you will meet in real codebases: CSS Modules in React projects and utility classes in Tailwind projects.</p>',
    '<p>Bạn sẽ giải thích được vì sao một kiểu dáng bỗng vỡ ở chỗ không ai sửa, đặt tên class để chuyện đó không xảy ra, và dùng công cụ sắp thứ tự có sẵn của trình duyệt. Bạn cũng nhận ra các cách làm sẽ gặp trong codebase thật: CSS Modules trong dự án React và utility class trong dự án Tailwind.</p>'],
  [3, 'Global names collide',
    '<p>Lan wrote a card with a <code>.title</code> class. A month later Minh wrote a footer, also with <code>.title</code>. Same specificity, later in the file: Minh’s rule now styles Lan’s card too — small, grey, uppercase. Nobody touched the card, and it broke.</p>',
    '<p>Lan viết một thẻ có class <code>.title</code>. Một tháng sau Minh viết footer, cũng dùng <code>.title</code>. Cùng độ đặc hiệu, đứng sau trong file: luật của Minh giờ tô luôn thẻ của Lan — nhỏ, xám, viết hoa. Không ai đụng vào thẻ, vậy mà nó vỡ.</p>'],
  [4, 'The specificity war',
    '<p>Each week someone "fixes" a style with a stronger selector: an id, a class repeated three times, finally <code>!important</code>. The measured result shows the sidebar still wins over the danger variant, because an id beats any number of classes. Only <code>!important</code> broke through — the start of the next war.</p>',
    '<p>Mỗi tuần có người "sửa" kiểu dáng bằng một selector mạnh hơn: một id, một class lặp ba lần, cuối cùng là <code>!important</code>. Kết quả đo cho thấy sidebar vẫn thắng biến thể danger, vì id thắng mọi số lượng class. Chỉ <code>!important</code> phá được — mở đầu cuộc chiến tiếp theo.</p>'],
  [5, 'BEM',
    '<p>BEM is a naming convention: Block, Element, Modifier. The block name works as a namespace, elements are joined with two underscores, modifiers with two dashes. Every selector is one class, so every rule has the same weight and source order decides.</p>',
    '<p>BEM là một quy ước đặt tên: Block (khối), Element (phần tử), Modifier (biến thể). Tên khối làm vai trò không gian tên, phần tử nối bằng hai gạch dưới, biến thể bằng hai gạch ngang. Mọi selector là một class, nên mọi luật nặng như nhau và thứ tự trong file quyết định.</p>'],
  [6, 'Why BEM works',
    '<p>Four reasons, all about predictability. Flat specificity ends the war, the block prefix ends collisions, modifiers document themselves, and not tying styles to tags means you can change the HTML structure without touching CSS.</p>',
    '<p>Bốn lý do, đều về tính đoán trước được. Độ đặc hiệu phẳng chấm dứt chiến tranh, tiền tố khối chấm dứt va chạm, biến thể tự giải thích, và không buộc kiểu dáng vào thẻ nghĩa là đổi cấu trúc HTML mà không phải sửa CSS.</p>'],
  [7, 'Cascade layers',
    '<p><code>@layer</code> lets you declare the order of whole groups of styles once. Measured: a one-class utility in the utilities layer beat an id selector in the components layer, because the later layer wins regardless of specificity. Styles outside any layer beat every layer.</p>',
    '<p><code>@layer</code> cho bạn khai báo thứ tự của cả nhóm kiểu dáng một lần. Đo được: một utility một class ở lớp utilities thắng một selector có id ở lớp components, vì lớp sau thắng bất kể độ đặc hiệu. Kiểu dáng nằm ngoài mọi lớp thắng tất cả các lớp.</p>'],
  [8, ':where() and :is()',
    '<p>Both group selectors, but <code>:where()</code> contributes zero specificity while <code>:is()</code> keeps the weight of its strongest argument. That is why the plain <code>h3</code> rule overrode the first heading and lost to the second. Library defaults written with <code>:where()</code> are easy to customise.</p>',
    '<p>Cả hai đều gom selector, nhưng <code>:where()</code> đóng góp độ đặc hiệu bằng không còn <code>:is()</code> giữ trọng lượng của đối số mạnh nhất. Vì vậy luật <code>h3</code> trơn thắng tiêu đề đầu và thua tiêu đề sau. Giá trị mặc định của thư viện viết bằng <code>:where()</code> rất dễ tuỳ biến.</p>'],
  [9, 'CSS Modules',
    '<p>A build step renames every class per file — <code>.title</code> in the card file becomes something like <code>title_2leku</code>, in the footer file <code>title_1870c</code>. The demo imitates that step and shows both titles keep their own styles. React and Next.js support this out of the box.</p>',
    '<p>Một bước build đổi tên mọi class theo từng file — <code>.title</code> trong file thẻ thành kiểu <code>title_2leku</code>, trong file footer thành <code>title_1870c</code>. Ví dụ bắt chước bước đó và cho thấy hai tiêu đề giữ kiểu dáng riêng. React và Next.js hỗ trợ sẵn.</p>'],
  [10, 'Four approaches',
    '<p>BEM needs no tools; CSS Modules need a bundler; utility-first frameworks like Tailwind put many small classes in the HTML; layers and <code>:where()</code> are built into the browser. Real projects combine them.</p>',
    '<p>BEM không cần công cụ; CSS Modules cần bundler; framework utility-first như Tailwind đặt nhiều class nhỏ trong HTML; layer và <code>:where()</code> có sẵn trong trình duyệt. Dự án thật kết hợp chúng.</p>'],
  [11, 'File structure',
    '<p>One file per component, tokens in one place, and the order of everything declared once with <code>@layer</code>. The best test of a structure is deletion: removing a component should mean removing one file, with nothing else to clean up.</p>',
    '<p>Mỗi component một file, token ở một chỗ, và thứ tự mọi thứ khai báo một lần bằng <code>@layer</code>. Phép thử tốt nhất cho một cấu trúc là xoá: gỡ một component nghĩa là xoá một file, không còn gì khác phải dọn.</p>'],
  [12, 'Summary & practice',
    '<p>The practice is a typical refactor: a navbar full of ids and <code>!important</code> becomes flat BEM classes inside a layer, with one utility that still works. When you can delete every <code>!important</code> and nothing changes visually, the refactor succeeded.</p>',
    '<p>Bài luyện là một lần refactor điển hình: một thanh điều hướng đầy id và <code>!important</code> thành các class BEM phẳng trong một layer, cùng một utility vẫn chạy. Khi bạn xoá được mọi <code>!important</code> mà giao diện không đổi, lần refactor đã thành công.</p>'],
]);

export default {
  title: '12.3 — Naming and organising CSS|||12.3 — Đặt tên và tổ chức CSS',
  slug: 'wf-12-3-css-architecture',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Hai nguyên nhân CSS rối (tên toàn cục va nhau, chiến tranh độ đặc hiệu) đo thật trong Chromium, BEM, @layer, :where() và :is(), CSS Modules làm gì, utility-first, cấu trúc file mở rộng được.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>CSS that a team can still change after a year</h2>
<p class="lead">After this lesson you can explain why a style breaks in a part of the site that nobody edited, name classes so it cannot happen again, end "specificity wars" without <code>!important</code>, order whole groups of styles with <code>@layer</code>, and recognise the two approaches you will meet in real React projects: CSS Modules and utility classes. Why it matters: CSS rarely fails loudly. It fails slowly — every quick fix adds a stronger selector, until a one-line change in the header breaks the checkout page and nobody dares to delete anything.</p>

<h3>Problem 1 — every class name is global</h3>
${ma('html', CODE['12-3/global-leak.html'], [7, 19])}
${ra(OUT['12-3/global-leak'])}
<p>All CSS on a page lives in one global namespace. Lan's <code>.title</code> and Minh's <code>.title</code> are the same selector with the same specificity, so the one that comes later in the file wins — for <em>both</em> components. Lan's product title is now 12&nbsp;px, grey and uppercase, although nobody opened her file (screenshot on slide 3). On a big project this is the most common source of "I didn't touch that page!".</p>

<h3>Problem 2 — the specificity war</h3>
<p><strong>Specificity</strong> is the weight of a selector, written as three numbers (ids, classes, elements): <code>#sidebar .btn</code> is (1,1,0), <code>.btn-danger</code> is (0,1,0). Higher weight wins regardless of order. Watch a team escalate over eight weeks:</p>
${ma('html', CODE['12-3/specificity-war.html'], [7, 17])}
${ra(OUT['12-3/specificity-war'])}
<p>The "danger" button in the sidebar is still red after week 6: an id outranks any number of classes, so repeating <code>.btn-danger</code> three times (0,3,0) still loses to (1,1,0). Only <code>!important</code> broke through — and the next person who needs to override that will need another <code>!important</code> with a stronger selector.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">A style does not apply</span><span class="lz-d">Because something heavier wins elsewhere.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">"Fix" with a heavier selector</span><span class="lz-d">An id, a nested selector, a repeated class.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The next change needs heavier still</span><span class="lz-d">Weights only go up; nothing is ever deleted.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">!important everywhere</span><span class="lz-d">Then !important against !important. The stylesheet is now frozen.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — styling with ids and nested selectors.</strong> <code>#sidebar .btn</code> or <code>.page .content .card h3</code> feels precise, but it raises the weight of a rule for no reason, and every future override must be at least as heavy. Rule for components: <strong>no ids in CSS, no <code>!important</code>, one class per selector</strong>. Keep ids for JavaScript and anchor links.</p></div>

<h3>Tool 1 — BEM naming</h3>
<p><strong>BEM</strong> (Block, Element, Modifier) is a naming convention, nothing more — no library, no build step.</p>
${ma('html', CODE['12-3/bem.html'], [8, 33])}
${ra(OUT['12-3/bem'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Block</span><span class="v">A standalone component: <code>.product-card</code>, <code>.site-header</code>.</span></div>
  <div class="kv"><span class="k">Element</span><span class="v">A part that only makes sense inside its block: <code>.product-card__title</code> (two underscores).</span></div>
  <div class="kv"><span class="k">Modifier</span><span class="v">A variant or state: <code>.product-card--featured</code>, <code>.product-card__button--disabled</code> (two dashes). Used together with the base class.</span></div>
</div>
<p>The script on the demo page checked every selector in the stylesheet: apart from <code>body</code>, every one is a single class. That is the point. Flat specificity means no wars — when two rules conflict, the later one wins, which is easy to predict. The block prefix is a namespace, so <code>.product-card__title</code> can never collide with the footer's title. And since nothing depends on tag names, turning the <code>h3</code> into an <code>h2</code> for accessibility does not break the styling.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "grandchild" names.</strong> <code>.card__body__title__icon</code> mirrors the HTML nesting and breaks as soon as the structure changes. BEM elements belong to the <em>block</em>, not to each other: write <code>.card__icon</code>. If a part is complex enough to have its own parts, it is probably its own block.</p></div>

<h3>Tool 2 — cascade layers: order beats specificity</h3>
${ma('html', CODE['12-3/layers.html'], [6, 17])}
${ra(OUT['12-3/layers'])}
<p><code>@layer reset, base, components, utilities;</code> declares four layers in priority order: later layers win. Inside the components layer, <code>#checkout .btn</code> has an id; inside the utilities layer, <code>.bg-green</code> is a single class. The utility still won (second line), because <strong>between layers, layer order decides — specificity only matters inside one layer</strong>. The third line shows the escape hatch: styles written outside any layer beat all layers, which is handy for migrating old CSS but also a reason to put new code in a layer.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Unlayered styles</span><span class="lz-t">strongest</span><span class="lz-d">Legacy code, quick overrides.</span></div>
<div class="lz-layer"><span class="lz-k">@layer utilities</span><span class="lz-t">.hidden, .bg-green</span><span class="lz-d">Small helpers that must always win over components.</span></div>
<div class="lz-layer"><span class="lz-k">@layer components</span><span class="lz-t">.product-card, .btn</span><span class="lz-d">Your BEM blocks.</span></div>
<div class="lz-layer"><span class="lz-k">@layer base / reset</span><span class="lz-t">body, a, h1…</span><span class="lz-d">Defaults; everything above may override them.</span></div>
</div>

<h3>Tool 3 — <code>:where()</code> for easy-to-override defaults</h3>
${ma('html', CODE['12-3/where-is.html'], [6, 12])}
${ra(OUT['12-3/where-is'])}
<p>Both pseudo-classes group selectors, but <code>:where(…)</code> always has zero specificity, while <code>:is(…)</code> takes the specificity of its strongest argument. So <code>:where(.lib-card) h3</code> weighs only (0,0,1) — the same as a plain <code>h3</code> — and the user's later <code>h3</code> rule won. <code>:is(.lib-panel) h3</code> weighs (0,1,1) and the user's rule lost. Modern CSS resets and component libraries write their defaults with <code>:where()</code> precisely so you can override them with simple selectors.</p>

<h3>Tool 4 — scoped styles: CSS Modules (and utility classes)</h3>
${ma('html', CODE['12-3/modules-sim.html'], [10, 30])}
${ra(OUT['12-3/modules-sim'])}
<p>This page imitates what a bundler does with files named <code>*.module.css</code>: every class gets a suffix derived from the file, so <code>.title</code> becomes <code>title_2leku</code> in the card and <code>title_1870c</code> in the footer. The component receives a map of names: <code>import styles from './Card.module.css'</code> then <code>className={styles.title}</code>. Collisions become impossible, and you can use short names inside each file. Vite, Next.js and Create React App all support it with no configuration.</p>
<p><strong>Utility-first</strong> frameworks such as Tailwind take the opposite route: instead of writing CSS per component, you compose many tiny single-purpose classes in the HTML (<code>class="p-4 rounded-lg bg-white shadow"</code>). There is nothing to name and nothing collides, at the cost of longer class lists. The choice is mostly a team preference; the problems they solve are the same two from the top of this lesson.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">BEM</span><span class="v">Plain CSS + a naming rule. Works everywhere, no tools.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v">Build step renames classes per file. Natural in React/Next.js.</span></div>
  <div class="kv"><span class="k">Utility-first (Tailwind)</span><span class="v">Small classes composed in HTML; a design system is built in.</span></div>
  <div class="kv"><span class="k">@layer + :where()</span><span class="v">Browser-native ordering; combines with any of the above.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — mixing approaches with no rule.</strong> Half the components in BEM, a few in Modules, Tailwind classes sprinkled in, and an old <code>style.css</code> outside any layer is the worst of all worlds: each system's guarantees break where it meets the others. Pick one approach for components, put everything into declared layers, and write the decision in the README.</p></div>

<h3>A file structure that scales</h3>
<pre><code class="language-plaintext">styles/
  reset.css            @layer reset
  tokens.css           :root custom properties (lesson 12.4)
  base.css             @layer base — body, a, h1…
  components/
    product-card.css   @layer components — .product-card…
    site-header.css
  utilities.css        @layer utilities — .hidden, .sr-only…
main.css               @layer order declared once + @import of the files above</code></pre>
<p>The test of a good structure is deletion: removing the product card should mean deleting one file, and nothing else in the project should change.</p>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>Start from this messy navbar CSS and refactor it:</p>
<pre><code class="language-css">#nav ul li a { color: #333; padding: 8px; }
#nav ul li a.active { color: blue !important; }
.nav-link-red { color: red !important; }
div#nav { display: flex; }</code></pre>
<p>Rename to BEM (<code>.site-nav</code>, <code>.site-nav__link</code>, <code>.site-nav__link--active</code>), put the rules in <code>@layer components</code>, and add a utility <code>.hidden { display: none; }</code> in <code>@layer utilities</code>. Update the HTML class names to match.</p>
<p><strong>Done when:</strong> the CSS contains no <code>#</code> selectors and no <code>!important</code>; every selector is a single class; the active link is still blue; and adding <code>hidden</code> to a link hides it although <code>.site-nav__link</code> sets <code>display</code>. Code Lab module 12.3 checks these rules automatically.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">global namespace</span><span class="v">không gian tên toàn cục — mọi class trong trang dùng chung một "bảng tên".</span></div>
  <div class="kv"><span class="k">specificity</span><span class="v">độ đặc hiệu — trọng lượng của selector (id, class, thẻ).</span></div>
  <div class="kv"><span class="k">source order</span><span class="v">thứ tự nguồn — luật đứng sau thắng khi trọng lượng bằng nhau.</span></div>
  <div class="kv"><span class="k">BEM (block, element, modifier)</span><span class="v">khối, phần tử, biến thể — quy ước đặt tên class.</span></div>
  <div class="kv"><span class="k">cascade layer (@layer)</span><span class="v">lớp tầng — nhóm kiểu dáng có thứ tự ưu tiên khai báo trước.</span></div>
  <div class="kv"><span class="k">:where() / :is()</span><span class="v">gom selector — :where độ đặc hiệu 0, :is lấy theo đối số mạnh nhất.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v">CSS theo module — bước build đổi tên class riêng cho từng file.</span></div>
  <div class="kv"><span class="k">utility-first</span><span class="v">ưu tiên class tiện ích — ghép nhiều class nhỏ trong HTML (Tailwind).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Two root problems: class names are global, and specificity only ever escalates.</li>
  <li>For components: one class per selector, no ids, no <code>!important</code>.</li>
  <li>BEM gives every component a namespace and flat specificity.</li>
  <li><code>@layer</code> orders groups of styles; between layers, order beats specificity.</li>
  <li><code>:where()</code> makes defaults easy to override; CSS Modules make collisions impossible; utilities avoid naming altogether.</li>
  <li>Choose one approach for components, write it down, and keep a structure where deleting a component is deleting a file.</li>
</ul>
${nguon('📘', 'getbem.com — Introduction', 'The official short guide to Block, Element, Modifier', 'https://getbem.com/introduction/')}
${nguon('📗', 'MDN — @layer', 'Cascade layers: declaration, ordering, unlayered styles', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@layer')}
${lienKet({ khoa: 'react', bai: 'rx-13-2-hook-styling', title: 'React 13.2 — styling: CSS Modules or Tailwind', sub: 'The same choice inside a real React app, with the trade-offs measured', cta: 'Open lesson' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-4-theme-css-variables', title: 'Next.js 13.4 — theme with CSS variables (and the naming trap)', sub: 'How a Next.js project organises global styles, modules and tokens', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>CSS mà cả nhóm vẫn sửa được sau một năm</h2>
<p class="lead">Học xong bài này bạn giải thích được vì sao một kiểu dáng vỡ ở chỗ không ai sửa, đặt tên class để chuyện đó không lặp lại, chấm dứt "chiến tranh độ đặc hiệu" mà không cần <code>!important</code>, sắp thứ tự cả nhóm kiểu dáng bằng <code>@layer</code>, và nhận ra hai cách làm bạn sẽ gặp trong dự án React thật: CSS Modules và utility class. Vì sao cần: CSS hiếm khi hỏng một cách ồn ào. Nó hỏng từ từ — mỗi lần sửa nhanh thêm một selector mạnh hơn, tới khi một dòng sửa ở header làm vỡ trang thanh toán và không ai dám xoá gì nữa.</p>

<h3>Vấn đề 1 — mọi tên class đều là toàn cục</h3>
${ma('html', CODE['12-3/global-leak.html'], [7, 19])}
${ra(OUT['12-3/global-leak'])}
<p>Toàn bộ CSS trong một trang nằm chung một không gian tên toàn cục. <code>.title</code> của Lan và <code>.title</code> của Minh là cùng một selector, cùng độ đặc hiệu, nên cái đứng sau trong file thắng — cho <em>cả hai</em> component. Tiêu đề sản phẩm của Lan giờ cỡ 12&nbsp;px, màu xám và viết hoa, dù chẳng ai mở file của cô (ảnh ở slide 3). Trong dự án lớn đây là nguồn phổ biến nhất của câu "Tôi có đụng gì vào trang đó đâu!".</p>

<h3>Vấn đề 2 — chiến tranh độ đặc hiệu</h3>
<p><strong>Độ đặc hiệu (specificity)</strong> là trọng lượng của một selector, viết thành ba con số (id, class, thẻ): <code>#sidebar .btn</code> là (1,1,0), <code>.btn-danger</code> là (0,1,0). Nặng hơn thì thắng, bất kể thứ tự. Xem một nhóm leo thang trong tám tuần:</p>
${ma('html', CODE['12-3/specificity-war.html'], [7, 17])}
${ra(OUT['12-3/specificity-war'])}
<p>Nút "danger" trong sidebar vẫn đỏ sau tuần 6: id vượt trên mọi số lượng class, nên lặp <code>.btn-danger</code> ba lần (0,3,0) vẫn thua (1,1,0). Chỉ <code>!important</code> phá được — và người tiếp theo muốn đè nó sẽ cần thêm một <code>!important</code> với selector mạnh hơn.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kiểu dáng không ăn</span><span class="lz-d">Vì ở đâu đó có thứ nặng hơn đang thắng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">"Sửa" bằng selector nặng hơn</span><span class="lz-d">Một id, một selector lồng, một class lặp lại.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lần sửa sau cần nặng hơn nữa</span><span class="lz-d">Trọng lượng chỉ tăng; không gì từng bị xoá.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">!important khắp nơi</span><span class="lz-d">Rồi !important chọi !important. Stylesheet giờ đã đông cứng.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tạo kiểu bằng id và selector lồng nhau.</strong> <code>#sidebar .btn</code> hay <code>.page .content .card h3</code> có vẻ chính xác, nhưng nó nâng trọng lượng của luật một cách vô cớ, và mọi lần đè sau này phải nặng ít nhất bằng. Luật cho component: <strong>không id trong CSS, không <code>!important</code>, mỗi selector một class</strong>. Để dành id cho JavaScript và liên kết neo.</p></div>

<h3>Công cụ 1 — đặt tên kiểu BEM</h3>
<p><strong>BEM</strong> (Block, Element, Modifier — khối, phần tử, biến thể) chỉ là một quy ước đặt tên — không thư viện, không bước build.</p>
${ma('html', CODE['12-3/bem.html'], [8, 33])}
${ra(OUT['12-3/bem'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Block</span><span class="v">Một component đứng độc lập: <code>.product-card</code>, <code>.site-header</code>.</span></div>
  <div class="kv"><span class="k">Element</span><span class="v">Một phần chỉ có nghĩa bên trong khối của nó: <code>.product-card__title</code> (hai gạch dưới).</span></div>
  <div class="kv"><span class="k">Modifier</span><span class="v">Một biến thể hay trạng thái: <code>.product-card--featured</code>, <code>.product-card__button--disabled</code> (hai gạch ngang). Dùng kèm với class gốc.</span></div>
</div>
<p>Script trên trang ví dụ đã kiểm mọi selector trong stylesheet: ngoài <code>body</code>, tất cả đều là một class. Đó chính là điểm mấu chốt. Độ đặc hiệu phẳng nghĩa là không có chiến tranh — khi hai luật xung đột, luật đứng sau thắng, rất dễ đoán. Tiền tố khối là một không gian tên, nên <code>.product-card__title</code> không bao giờ va với tiêu đề của footer. Và vì không gì phụ thuộc tên thẻ, đổi <code>h3</code> thành <code>h2</code> cho khả năng tiếp cận cũng không làm vỡ kiểu dáng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tên kiểu "chắt chút".</strong> <code>.card__body__title__icon</code> chép lại cấu trúc lồng của HTML và vỡ ngay khi cấu trúc đổi. Element trong BEM thuộc về <em>khối</em>, không thuộc về nhau: viết <code>.card__icon</code>. Nếu một phần phức tạp tới mức có các phần con riêng, có lẽ nó nên là một khối riêng.</p></div>

<h3>Công cụ 2 — cascade layer: thứ tự thắng độ đặc hiệu</h3>
${ma('html', CODE['12-3/layers.html'], [6, 17])}
${ra(OUT['12-3/layers'])}
<p><code>@layer reset, base, components, utilities;</code> khai báo bốn lớp theo thứ tự ưu tiên: lớp sau thắng. Trong lớp components, <code>#checkout .btn</code> có một id; trong lớp utilities, <code>.bg-green</code> chỉ là một class. Utility vẫn thắng (dòng hai), vì <strong>giữa các lớp, thứ tự lớp quyết định — độ đặc hiệu chỉ có ý nghĩa bên trong một lớp</strong>. Dòng ba cho thấy lối thoát: kiểu dáng viết ngoài mọi lớp thắng tất cả các lớp, tiện khi chuyển dần CSS cũ nhưng cũng là lý do nên đặt code mới vào một lớp.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Kiểu dáng ngoài lớp</span><span class="lz-t">mạnh nhất</span><span class="lz-d">Code cũ, đè nhanh.</span></div>
<div class="lz-layer"><span class="lz-k">@layer utilities</span><span class="lz-t">.hidden, .bg-green</span><span class="lz-d">Helper nhỏ luôn phải thắng component.</span></div>
<div class="lz-layer"><span class="lz-k">@layer components</span><span class="lz-t">.product-card, .btn</span><span class="lz-d">Các khối BEM của bạn.</span></div>
<div class="lz-layer"><span class="lz-k">@layer base / reset</span><span class="lz-t">body, a, h1…</span><span class="lz-d">Giá trị mặc định; mọi lớp phía trên đều đè được.</span></div>
</div>

<h3>Công cụ 3 — <code>:where()</code> cho giá trị mặc định dễ đè</h3>
${ma('html', CODE['12-3/where-is.html'], [6, 12])}
${ra(OUT['12-3/where-is'])}
<p>Cả hai pseudo-class đều gom selector, nhưng <code>:where(…)</code> luôn có độ đặc hiệu bằng 0, còn <code>:is(…)</code> lấy độ đặc hiệu của đối số mạnh nhất. Nên <code>:where(.lib-card) h3</code> chỉ nặng (0,0,1) — bằng một <code>h3</code> trơn — và luật <code>h3</code> đứng sau của người dùng thắng. <code>:is(.lib-panel) h3</code> nặng (0,1,1) và luật của người dùng thua. Các bộ CSS reset và thư viện component hiện đại viết giá trị mặc định bằng <code>:where()</code> chính để bạn đè được bằng selector đơn giản.</p>

<h3>Công cụ 4 — kiểu dáng có phạm vi: CSS Modules (và utility class)</h3>
${ma('html', CODE['12-3/modules-sim.html'], [10, 30])}
${ra(OUT['12-3/modules-sim'])}
<p>Trang này bắt chước việc bundler làm với file tên <code>*.module.css</code>: mỗi class được gắn một hậu tố suy ra từ file, nên <code>.title</code> thành <code>title_2leku</code> trong thẻ và <code>title_1870c</code> trong footer. Component nhận một bảng tên: <code>import styles from './Card.module.css'</code> rồi <code>className={styles.title}</code>. Va chạm trở nên bất khả, và bạn dùng được tên ngắn trong từng file. Vite, Next.js và Create React App đều hỗ trợ mà không cần cấu hình.</p>
<p>Framework <strong>utility-first</strong> như Tailwind đi đường ngược lại: thay vì viết CSS cho từng component, bạn ghép nhiều class nhỏ một-việc trong HTML (<code>class="p-4 rounded-lg bg-white shadow"</code>). Không có gì phải đặt tên và không gì va nhau, đổi lại danh sách class dài. Chọn cách nào phần lớn là sở thích của nhóm; vấn đề chúng giải quyết vẫn là hai vấn đề ở đầu bài.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">BEM</span><span class="v">CSS thuần + một luật đặt tên. Chạy ở mọi nơi, không cần công cụ.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v">Bước build đổi tên class theo từng file. Tự nhiên trong React/Next.js.</span></div>
  <div class="kv"><span class="k">Utility-first (Tailwind)</span><span class="v">Class nhỏ ghép trong HTML; có sẵn một hệ thống thiết kế.</span></div>
  <div class="kv"><span class="k">@layer + :where()</span><span class="v">Sắp thứ tự có sẵn trong trình duyệt; kết hợp được với mọi cách trên.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trộn nhiều cách mà không có luật.</strong> Nửa component theo BEM, vài cái dùng Modules, rắc thêm class Tailwind, và một file <code>style.css</code> cũ nằm ngoài mọi lớp là tệ nhất của mọi thế giới: cam kết của từng hệ thống vỡ ở chỗ nó gặp các hệ thống khác. Chọn một cách cho component, đưa mọi thứ vào các lớp đã khai báo, và ghi quyết định vào README.</p></div>

<h3>Một cấu trúc file mở rộng được</h3>
<pre><code class="language-plaintext">styles/
  reset.css            @layer reset
  tokens.css           custom property trên :root (bài 12.4)
  base.css             @layer base — body, a, h1…
  components/
    product-card.css   @layer components — .product-card…
    site-header.css
  utilities.css        @layer utilities — .hidden, .sr-only…
main.css               khai báo thứ tự @layer một lần + @import các file trên</code></pre>
<p>Phép thử của một cấu trúc tốt là xoá: gỡ thẻ sản phẩm nghĩa là xoá một file, và không gì khác trong dự án phải đổi.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Bắt đầu từ đoạn CSS thanh điều hướng lộn xộn này và refactor nó:</p>
<pre><code class="language-css">#nav ul li a { color: #333; padding: 8px; }
#nav ul li a.active { color: blue !important; }
.nav-link-red { color: red !important; }
div#nav { display: flex; }</code></pre>
<p>Đổi tên theo BEM (<code>.site-nav</code>, <code>.site-nav__link</code>, <code>.site-nav__link--active</code>), đặt các luật vào <code>@layer components</code>, và thêm utility <code>.hidden { display: none; }</code> trong <code>@layer utilities</code>. Sửa class trong HTML cho khớp.</p>
<p><strong>Xong khi:</strong> CSS không còn selector <code>#</code> và không còn <code>!important</code>; mọi selector là một class; link đang chọn vẫn màu xanh; và thêm <code>hidden</code> vào một link thì nó ẩn đi dù <code>.site-nav__link</code> có đặt <code>display</code>. Code Lab module 12.3 kiểm tự động các luật này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">global namespace</span><span class="v">không gian tên toàn cục — mọi class trong trang dùng chung một "bảng tên".</span></div>
  <div class="kv"><span class="k">specificity</span><span class="v">độ đặc hiệu — trọng lượng của selector (id, class, thẻ).</span></div>
  <div class="kv"><span class="k">source order</span><span class="v">thứ tự nguồn — luật đứng sau thắng khi trọng lượng bằng nhau.</span></div>
  <div class="kv"><span class="k">BEM (block, element, modifier)</span><span class="v">khối, phần tử, biến thể — quy ước đặt tên class.</span></div>
  <div class="kv"><span class="k">cascade layer (@layer)</span><span class="v">lớp tầng — nhóm kiểu dáng có thứ tự ưu tiên khai báo trước.</span></div>
  <div class="kv"><span class="k">:where() / :is()</span><span class="v">gom selector — :where độ đặc hiệu 0, :is lấy theo đối số mạnh nhất.</span></div>
  <div class="kv"><span class="k">CSS Modules</span><span class="v">CSS theo module — bước build đổi tên class riêng cho từng file.</span></div>
  <div class="kv"><span class="k">utility-first</span><span class="v">ưu tiên class tiện ích — ghép nhiều class nhỏ trong HTML (Tailwind).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Hai vấn đề gốc: tên class là toàn cục, và độ đặc hiệu chỉ có leo thang.</li>
  <li>Với component: mỗi selector một class, không id, không <code>!important</code>.</li>
  <li>BEM cho mỗi component một không gian tên và độ đặc hiệu phẳng.</li>
  <li><code>@layer</code> sắp thứ tự các nhóm kiểu dáng; giữa các lớp, thứ tự thắng độ đặc hiệu.</li>
  <li><code>:where()</code> làm giá trị mặc định dễ đè; CSS Modules làm va chạm bất khả; utility tránh hẳn việc đặt tên.</li>
  <li>Chọn một cách cho component, ghi lại, và giữ cấu trúc mà xoá một component là xoá một file.</li>
</ul>
${nguon('📘', 'getbem.com — Introduction', 'Hướng dẫn ngắn chính thức về Block, Element, Modifier', 'https://getbem.com/introduction/')}
${nguon('📗', 'MDN — @layer', 'Cascade layer: khai báo, thứ tự, kiểu dáng ngoài lớp', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@layer')}
${lienKet({ khoa: 'react', bai: 'rx-13-2-hook-styling', title: 'React 13.2 — tạo kiểu: CSS Modules hay Tailwind', sub: 'Cùng lựa chọn đó trong một app React thật, có đo đánh đổi', cta: 'Mở bài' })}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-13-4-theme-css-variables', title: 'Next.js 13.4 — theme bằng CSS variables (và bẫy đặt tên)', sub: 'Dự án Next.js tổ chức style toàn cục, module và token thế nào', cta: 'Mở bài' })}
</div>
`,
};
