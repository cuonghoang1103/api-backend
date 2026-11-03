/**
 * Bài 2.1 — HTML là gì: phần tử, thẻ, thuộc tính (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/2-1).
 * Deck: scripts/slides-src/wf-2-1.mjs (10 slide, WF/v1/wf-2-1). Giữ video YouTube cũ. Code Lab: module 2.1 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-2-1', 'What HTML is', 'HTML là gì', [
  [1, 'What HTML is',
    '<p>HTML is the first language of the web, and the easiest. It does not calculate anything; it labels content so the browser knows what each piece is. In this lesson you learn the vocabulary every later lesson uses: element, tag, attribute, and the tree the browser builds.</p>',
    '<p>HTML là ngôn ngữ đầu tiên của web, và là ngôn ngữ dễ nhất. Nó không tính toán gì cả; nó dán nhãn cho nội dung để trình duyệt biết mỗi mẩu là gì. Trong bài này bạn học bộ từ vựng mọi bài sau đều dùng: phần tử, thẻ, thuộc tính, và cái cây trình duyệt dựng ra.</p>'],
  [2, 'After this lesson you can…',
    '<p>The most useful outcome is the last one. HTML never reports an error, so a broken page just looks strange. Once you know how to inspect what the browser really built, you stop blaming your CSS for a problem that lives in your tags.</p>',
    '<p>Kết quả hữu ích nhất là điều cuối cùng. HTML không bao giờ báo lỗi, nên một trang hỏng chỉ trông lạ đi thôi. Khi biết cách xem trình duyệt thật sự đã dựng ra gì, bạn sẽ thôi đổ lỗi cho CSS về một vấn đề nằm trong các thẻ của mình.</p>'],
  [3, 'Anatomy of an element',
    '<p>An element is usually an opening tag, some content and a closing tag. The closing tag has a slash. Attributes sit inside the opening tag as name and value. A few elements, like <code>img</code>, are void: they have no content and no closing tag.</p>',
    '<p>Một phần tử thường gồm thẻ mở, phần nội dung và thẻ đóng. Thẻ đóng có dấu gạch chéo. Thuộc tính nằm trong thẻ mở dạng tên và giá trị. Vài phần tử, như <code>img</code>, là phần tử rỗng: không có nội dung và không có thẻ đóng.</p>'],
  [4, 'The skeleton of every page',
    '<p>Every page starts from the same few lines. The doctype, <code>html</code> with its language, <code>head</code> for information about the page, <code>body</code> for what the visitor sees. On the right is how Chromium renders it. Memorise this shape; your editor can type it for you with an exclamation mark and Tab.</p>',
    '<p>Trang nào cũng bắt đầu từ cùng vài dòng. Doctype, <code>html</code> kèm ngôn ngữ, <code>head</code> cho thông tin về trang, <code>body</code> cho thứ người xem thấy. Bên phải là cách Chromium hiển thị nó. Hãy thuộc hình dạng này; trình soạn thảo gõ hộ bạn bằng dấu chấm than rồi Tab.</p>'],
  [5, 'The browser builds a tree',
    '<p>Your file is only text. The browser parses it into a tree of nodes called the DOM, and that tree — not your file — is what CSS styles and JavaScript changes. This output is the real tree, printed by walking it. Notice that text pieces are nodes too.</p>',
    '<p>Tệp của bạn chỉ là chữ. Trình duyệt phân tích nó thành một cây các nút gọi là DOM, và chính cây đó — không phải tệp — là thứ CSS tạo kiểu và JavaScript thay đổi. Output này là cây thật, in ra bằng cách đi qua nó. Để ý rằng các mẩu chữ cũng là nút.</p>'],
  [6, 'HTML never throws an error',
    '<p>Three deliberate mistakes, zero errors. The browser quietly repaired each one, and the repairs are visible: a closing tag appeared, a paragraph was split and an empty one was created, an italic was reopened. A page can look fine while the tree is not what you wrote.</p>',
    '<p>Ba lỗi cố ý, không một thông báo lỗi. Trình duyệt âm thầm sửa từng cái, và dấu vết sửa nhìn thấy được: một thẻ đóng xuất hiện, một đoạn văn bị tách và một đoạn rỗng được tạo ra, một chữ nghiêng được mở lại. Trang có thể trông ổn trong khi cây không phải thứ bạn đã viết.</p>'],
  [7, 'Attributes',
    '<p>Attributes configure an element. Some take a value, like <code>href</code>; <code>class</code> can hold several names; <code>data-</code> attributes are your own. Boolean attributes are the trap: only their presence matters, so <code>disabled="false"</code> still disables the button, as the output shows.</p>',
    '<p>Thuộc tính cấu hình cho phần tử. Một số nhận giá trị, như <code>href</code>; <code>class</code> chứa được nhiều tên; thuộc tính <code>data-</code> là của riêng bạn. Thuộc tính boolean là cái bẫy: chỉ cần có mặt là đủ, nên <code>disabled="false"</code> vẫn vô hiệu hoá nút, như output cho thấy.</p>'],
  [8, 'Why the doctype matters',
    '<p>One line at the top decides how the browser lays out the whole page. Without the doctype the browser falls into quirks mode, imitating the bugs of the 1990s; with it you get standards mode. The value of <code>compatMode</code> proves it.</p>',
    '<p>Một dòng trên cùng quyết định trình duyệt bố trí cả trang thế nào. Thiếu doctype, trình duyệt rơi vào chế độ quirks, bắt chước các lỗi của thập niên 1990; có nó thì được chế độ chuẩn. Giá trị <code>compatMode</code> chứng minh điều đó.</p>'],
  [9, 'Writing special characters',
    '<p>The less-than sign starts a tag, so writing it as text creates a real paragraph by accident: the page has four paragraphs, not three. To show a tag as text use the entities for less-than and greater-than; ampersand has one too.</p>',
    '<p>Dấu nhỏ hơn mở đầu một thẻ, nên viết nó như chữ sẽ vô tình tạo một đoạn văn thật: trang có bốn đoạn chứ không phải ba. Muốn hiện một thẻ dưới dạng chữ, hãy dùng thực thể cho dấu nhỏ hơn và lớn hơn; dấu và cũng có thực thể riêng.</p>'],
  [10, 'Summary & practice',
    '<p>The practice builds a profile page from memory, then makes you inspect the tree. The "Done when" uses the W3C validator and the Elements tab, so you confirm the structure the browser really got — not just that the page looks acceptable.</p>',
    '<p>Bài luyện dựng một trang hồ sơ theo trí nhớ, rồi bắt bạn soi cái cây. Phần "Xong khi" dùng trình kiểm W3C và thẻ Elements, để bạn xác nhận cấu trúc trình duyệt thật sự nhận được — không chỉ là trang trông tạm ổn.</p>'],
]);

export default {
  title: '2.1 — What HTML is: elements, tags, attributes|||2.1 — HTML là gì: phần tử, thẻ, thuộc tính',
  slug: 'wf-2-1-html-basics',
  type: 'VIDEO',
  isFreePreview: true,
  video: { url: 'https://youtu.be/ok-plXXHlWw', durationSeconds: 0 },
  description: 'Phần tử, thẻ, thuộc tính và bộ khung một trang; cây DOM trình duyệt dựng ra (in thật), HTML không bao giờ báo lỗi mà tự sửa (ba lỗi cố ý và bằng chứng), thuộc tính boolean, doctype và chế độ quirks, ký tự đặc biệt, kiểm bằng Elements và W3C validator.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>HTML labels meaning; it does not decorate</h2>
<p class="lead">After this lesson you can read and write any HTML element, explain what a tag, an attribute and a void element are, type the skeleton of a page from memory, and — the skill that saves the most time — inspect the tree the browser really built when a page behaves strangely. You need this because HTML is the foundation under everything: CSS can only style what HTML named, JavaScript can only change what HTML created, and search engines and screen readers read nothing else.</p>

<h3>What HTML is, in one paragraph</h3>
<p>HTML (HyperText Markup Language) is how you tell the browser <em>what each piece of content is</em>: "this is a heading", "this is a paragraph", "this is a link". It is not a programming language: it has no variables, no loops, and it cannot calculate anything. It is a <strong>markup</strong> language — you take plain text and mark up its parts with labels. "HyperText" just means text with links to other text, the idea that started the web.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">HTML</span><span class="lz-t">what it is</span><span class="lz-d">The skeleton: heading, paragraph, button. This chapter.</span></div>
<div class="lz-layer"><span class="lz-k">CSS</span><span class="lz-t">how it looks</span><span class="lz-d">Paints the skeleton. Chapter 3.</span></div>
<div class="lz-layer"><span class="lz-k">JavaScript</span><span class="lz-t">what it does</span><span class="lz-d">Makes it move. Chapter 4.</span></div>
</div>

<h3>Step 1 — anatomy of an element</h3>
<p>Most content is wrapped in an <strong>element</strong>: an opening tag, the content, and a closing tag. The closing tag has a slash.</p>
<pre><code class="language-html">&lt;p&gt;Hello, world&lt;/p&gt;
 │   │           │
 │   │           └── closing tag (note the / )
 │   └────────────── the content
 └────────────────── opening tag</code></pre>
<p>An <strong>attribute</strong> gives extra configuration. It lives in the opening tag as <code>name="value"</code>. A link needs to know where to go; an image needs to know which file to show:</p>
<pre><code class="language-html">&lt;a href="https://cuongthai.com"&gt;Visit CuongThai&lt;/a&gt;
&lt;img src="cat.jpg" alt="A grey cat sleeping on a sofa"&gt;
&lt;br&gt;</code></pre>
<p>The last two have no content and no closing tag. They are <strong>void elements</strong>: an image or a line break has nothing to wrap. You will sometimes see <code>&lt;br /&gt;</code> with a slash. In HTML it means the same thing; in JSX (React) the slash is required.</p>
<p>Elements nest inside each other, and must close in reverse order: last opened, first closed.</p>
<pre><code class="language-html">&lt;p&gt;This is &lt;strong&gt;very &lt;em&gt;important&lt;/em&gt;&lt;/strong&gt; text.&lt;/p&gt;   &lt;!-- correct nesting --&gt;
&lt;p&gt;This is &lt;strong&gt;wrong&lt;/p&gt;&lt;/strong&gt;                         &lt;!-- crossed tags --&gt;</code></pre>
<p>The text inside <code>&lt;!-- --&gt;</code> is a <strong>comment</strong>: the browser ignores it, but anyone can read it with View Source, so never put private notes there.</p>

<h3>Step 2 — the skeleton every page starts from</h3>
${ma('html', CODE['2-1/trang-dau-tien.html'])}
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;!DOCTYPE html&gt;</span><span class="v">"This is modern HTML." Always the first line. Step 6 shows what happens without it.</span></div>
  <div class="kv"><span class="k">&lt;html lang="vi"&gt;</span><span class="v">The root of the page. <code>lang</code> tells screen readers which voice to use and browsers when to offer translation.</span></div>
  <div class="kv"><span class="k">&lt;head&gt;</span><span class="v">Information <em>about</em> the page: title, character set, links to CSS. Nothing here appears in the page area.</span></div>
  <div class="kv"><span class="k">&lt;meta charset="UTF-8"&gt;</span><span class="v">How letters are stored. UTF-8 makes Tiếng Việt display correctly. Put it first in <code>head</code>.</span></div>
  <div class="kv"><span class="k">&lt;meta name="viewport"…&gt;</span><span class="v">Tells phones to use their real width. Without it a phone shows a tiny zoomed-out desktop page (Lesson 3.5).</span></div>
  <div class="kv"><span class="k">&lt;title&gt;</span><span class="v">The text on the browser tab and the blue headline in Google results.</span></div>
  <div class="kv"><span class="k">&lt;body&gt;</span><span class="v">Everything visible on the page lives here.</span></div>
</div>
<p>Save it as <code>index.html</code> and double-click it. The screenshot on slide 4 is exactly what Chromium displayed. In VS Code you can type <code>!</code> then Tab to generate this skeleton; still, type it by hand a few times so you know what each line is for.</p>

<h3>Step 3 — your file becomes a tree: the DOM</h3>
<p>The browser does not display your file. It <strong>parses</strong> the text into a tree of objects called the <strong>DOM</strong> (Document Object Model), and displays the tree. Here is a tiny page, and a few lines of JavaScript that walk the tree and print it:</p>
${ma('html', CODE['2-1/cay-dom.html'], [5, 9])}
${ra(OUT['2-1/cay-dom'])}
<p>Each tag became a node, nested exactly as the tags nest. Look at the <code>h1</code>: it has three children, because the text "My", the <code>em</code> element, and the text "page" are separate nodes. The browser also added things: it printed <code>head</code> and <code>body</code> as usual, and if you leave them out, it creates them for you.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Text arrives</span><span class="lz-d">The <code>.html</code> file is plain text. Nothing is compiled; the browser reads it as it arrives.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Parse into the DOM</span><span class="lz-d">Tags become nodes in a tree. Mistakes are repaired silently here.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Apply CSS, then paint</span><span class="lz-d">Styles attach to tree nodes, not to lines in your file.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">JavaScript changes the tree</span><span class="lz-d">The page updates; your file on disk does not change.</span></div>
</div>
<p>DevTools' <strong>Elements</strong> tab shows this tree, not your file. "View Page Source" shows your file. When they differ, the difference is usually your bug.</p>

<h3>Step 4 — HTML never throws an error</h3>
<p>This is the most important fact about HTML, and the one beginners learn the hard way. Here are three mistakes on purpose:</p>
${ma('html', CODE['2-1/tu-sua-loi.html'], [5, 7])}
<p>No error appears in the console. The browser repaired everything. Printing the tree shows what it really built:</p>
${ra(OUT['2-1/tu-sua-loi'])}
<ul>
<li><strong>a:</strong> a new <code>&lt;p&gt;</code> closed the unclosed one. Harmless, and even legal.</li>
<li><strong>b:</strong> a <code>div</code> is not allowed inside a <code>p</code>. The browser closed the paragraph before the <code>div</code>, left "it" floating, and turned your stray <code>&lt;/p&gt;</code> into a new <strong>empty paragraph</strong>. You now have a mystery gap on the page.</li>
<li><strong>c:</strong> crossed tags. It closed the <code>i</code> early and opened a second <code>i</code> to continue. The tree contains two <code>i</code> elements you never wrote.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — a broken page looks like a CSS or JavaScript problem.</strong> Forget one closing <code>&lt;/div&gt;</code> and the browser closes it for you — somewhere. Your footer ends up nested inside your sidebar, your CSS selector no longer matches, and you spend an hour on a stylesheet that was correct all along. Nothing in the console mentions it, because recovering from bad HTML is documented behaviour, not an error. When something is in the wrong place, open <strong>Elements</strong> first and compare the tree with what you intended. The <a href="https://validator.w3.org/nu/" target="_blank" rel="noopener">W3C validator</a> lists every problem in seconds.</p></div>

<h3>Step 5 — attributes in detail</h3>
${ma('html', CODE['2-1/thuoc-tinh.html'], [5, 8])}
${ra(OUT['2-1/thuoc-tinh'])}
<table>
<thead><tr><th>Attribute</th><th>Works on</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>any element</td><td>A unique name on the page, for links, labels and JavaScript</td></tr>
<tr><td><code>class</code></td><td>any element</td><td>One or more names separated by spaces, for CSS</td></tr>
<tr><td><code>title</code></td><td>any element</td><td>Extra text shown as a tooltip</td></tr>
<tr><td><code>lang</code></td><td>any element</td><td>The language of that content</td></tr>
<tr><td><code>hidden</code></td><td>any element</td><td>Not displayed</td></tr>
<tr><td><code>data-*</code></td><td>any element</td><td>Your own data, read in JavaScript through <code>dataset</code></td></tr>
<tr><td><code>href</code>, <code>src</code>, <code>alt</code></td><td>specific elements</td><td>Link target, file to load, alternative text</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>disabled="false"</code> still disables.</strong> <code>disabled</code>, <code>checked</code>, <code>required</code>, <code>hidden</code> and <code>readonly</code> are <strong>boolean attributes</strong>: their <em>presence</em> means true, whatever the value says. The output above proves it: <code>b2</code> has <code>disabled="false"</code> and is disabled. To turn one off, remove the attribute entirely. The same rule explains why these are often written with no value at all.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — the same <code>id</code> twice.</strong> An <code>id</code> must be unique on the page. The browser will not complain about duplicates, but <code>document.getElementById</code> returns only the first, a <code>label for</code> connects only to the first, and links with <code>#id</code> jump to the first. For several elements sharing a style, use <code>class</code>.</p></div>

<h3>Step 6 — why the doctype matters</h3>
<p>The first line looks like decoration. It is not. Here are two pages, one without it:</p>
${ra(OUT['2-1/khong-doctype'] + '\n' + OUT['2-1/co-doctype'])}
<p><code>BackCompat</code> is <strong>quirks mode</strong>: the browser imitates the layout bugs of 1990s browsers, so that very old pages keep working. <code>CSS1Compat</code> is standards mode, the only mode you ever want. In quirks mode, box sizes and some inherited styles behave differently, and your CSS will look subtly broken for no visible reason. One line prevents it.</p>

<h3>Step 7 — writing special characters</h3>
<p><code>&lt;</code> starts a tag, and <code>&amp;</code> starts a character reference. So what happens if you just want to <em>show</em> the text <code>&lt;p&gt;</code>?</p>
${ma('html', CODE['2-1/ky-tu-dac-biet.html'], [5, 7])}
${ra(OUT['2-1/ky-tu-dac-biet'])}
<p>We wrote three paragraphs and the page has <strong>four</strong>: the first <code>&lt;p&gt;</code> in the text was parsed as a real tag (screenshot on slide 9). The fix is <strong>character entities</strong>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">&amp;lt; &amp;gt;</span><span class="v">The characters &lt; and &gt;.</span></div>
  <div class="kv"><span class="k">&amp;amp;</span><span class="v">The character &amp;.</span></div>
  <div class="kv"><span class="k">&amp;nbsp;</span><span class="v">A non-breaking space: the line will not wrap between "100" and "000".</span></div>
</div>
<p>With UTF-8 you can type Vietnamese letters, emoji and symbols like ₫ directly; entities are needed only for the characters that mean something to HTML. In Chapter 7 you will see this is also a security matter: text from users that contains <code>&lt;script&gt;</code> must be escaped.</p>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes) — a profile page from memory</strong></p>
<ol>
<li>Close this lesson. In a new folder create <code>index.html</code> and type the whole skeleton from memory, with <code>lang="en"</code> or <code>lang="vi"</code>.</li>
<li>In the <code>body</code> add a heading with your name, a paragraph about you, a link to a website you like, and a list of three hobbies (<code>ul</code> and <code>li</code>).</li>
<li>Add a <code>data-age</code> attribute to the paragraph and show the text <code>&lt;strong&gt;</code> literally on the page.</li>
<li>Open it, and open <strong>Elements</strong>. Remove one closing tag on purpose, save, reload and find what changed in the tree.</li>
</ol>
<p>Hint: indent nested elements. Wrong nesting is visible at a glance when the indentation is right.</p>
<p><strong>Done when:</strong> pasting your final file into the <a href="https://validator.w3.org/nu/#textarea" target="_blank" rel="noopener">W3C validator</a> reports no errors; running <code>document.compatMode</code> in the Console prints <code>CSS1Compat</code>; and the page shows the literal text <code>&lt;strong&gt;</code>. Code Lab module 2.1 then grades seven small pages like this one automatically.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">element</span><span class="v">phần tử — thẻ mở + nội dung + thẻ đóng.</span></div>
  <div class="kv"><span class="k">tag</span><span class="v">thẻ — phần trong dấu ngoặc nhọn.</span></div>
  <div class="kv"><span class="k">attribute</span><span class="v">thuộc tính — tên="giá trị" trong thẻ mở.</span></div>
  <div class="kv"><span class="k">void element</span><span class="v">phần tử rỗng — không có nội dung, không có thẻ đóng.</span></div>
  <div class="kv"><span class="k">boolean attribute</span><span class="v">thuộc tính boolean — có mặt là đúng.</span></div>
  <div class="kv"><span class="k">nesting</span><span class="v">lồng nhau — mở sau, đóng trước.</span></div>
  <div class="kv"><span class="k">parse</span><span class="v">phân tích cú pháp — đọc chữ thành cấu trúc.</span></div>
  <div class="kv"><span class="k">DOM</span><span class="v">mô hình đối tượng tài liệu — cây các nút của trang.</span></div>
  <div class="kv"><span class="k">quirks mode</span><span class="v">chế độ tương thích cũ — bắt chước lỗi trình duyệt xưa.</span></div>
  <div class="kv"><span class="k">character entity</span><span class="v">thực thể ký tự — &amp;lt;, &amp;amp;…</span></div>
  <div class="kv"><span class="k">UTF-8</span><span class="v">bảng mã chứa mọi ký tự, kể cả tiếng Việt.</span></div>
  <div class="kv"><span class="k">validator</span><span class="v">trình kiểm tra — liệt kê lỗi HTML.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>HTML labels content. It does not calculate; it marks up what each piece is.</li>
  <li>An element = opening tag + content + closing tag; void elements have neither content nor closing tag.</li>
  <li>Every page: doctype, <code>html lang</code>, <code>head</code> with charset, viewport, title; <code>body</code> with the content.</li>
  <li>The browser parses your file into the DOM tree. CSS and JavaScript work on the tree.</li>
  <li>HTML never reports errors; the browser repairs them silently. Inspect with Elements, verify with the validator.</li>
  <li>Boolean attributes: presence means true. <code>id</code> must be unique.</li>
  <li>Without the doctype you get quirks mode. Escape <code>&lt;</code> and <code>&amp;</code> with entities.</li>
</ul>
${nguon('📗', 'MDN — Structuring content with HTML', 'The reference worth bookmarking', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content')}
${nguon('📘', 'W3C Nu HTML Checker', 'Paste your HTML and see exactly what is malformed', 'https://validator.w3.org/nu/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-html', title: 'WED201c (Academy) — HTML basics', sub: 'The university course that builds on this lesson', cta: 'Open lesson' })}
${lienKet({ khoa: 'react', bai: 'rx-0-2-jsx', title: 'React 0.2 — JSX', sub: 'What changes when you write this markup inside JavaScript', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>HTML đặt tên cho ý nghĩa; nó không trang trí</h2>
<p class="lead">Học xong bài này bạn đọc và viết được mọi phần tử HTML, giải thích được thẻ, thuộc tính và phần tử rỗng là gì, gõ được bộ khung một trang theo trí nhớ, và — kỹ năng tiết kiệm nhiều thời gian nhất — soi được cái cây trình duyệt thật sự đã dựng khi một trang cư xử lạ. Bạn cần điều này vì HTML là nền móng dưới mọi thứ: CSS chỉ tạo kiểu được cho thứ HTML đã đặt tên, JavaScript chỉ đổi được thứ HTML đã tạo ra, còn công cụ tìm kiếm và trình đọc màn hình chẳng đọc gì khác.</p>

<h3>HTML là gì, trong một đoạn</h3>
<p>HTML (HyperText Markup Language — ngôn ngữ đánh dấu siêu văn bản) là cách bạn nói cho trình duyệt <em>mỗi mẩu nội dung là gì</em>: "đây là tiêu đề", "đây là đoạn văn", "đây là liên kết". Nó không phải ngôn ngữ lập trình: không có biến, không có vòng lặp, và không tính toán được gì. Nó là ngôn ngữ <strong>đánh dấu</strong> — bạn lấy chữ thường và dán nhãn cho từng phần. "HyperText" chỉ có nghĩa là chữ có liên kết tới chữ khác, ý tưởng đã khai sinh ra web.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">HTML</span><span class="lz-t">nó là gì</span><span class="lz-d">Bộ xương: tiêu đề, đoạn văn, nút bấm. Chương này.</span></div>
<div class="lz-layer"><span class="lz-k">CSS</span><span class="lz-t">nó trông ra sao</span><span class="lz-d">Sơn cho bộ xương. Chương 3.</span></div>
<div class="lz-layer"><span class="lz-k">JavaScript</span><span class="lz-t">nó làm gì</span><span class="lz-d">Làm cho nó cử động. Chương 4.</span></div>
</div>

<h3>Bước 1 — giải phẫu một phần tử</h3>
<p>Hầu hết nội dung được bọc trong một <strong>phần tử (element)</strong>: thẻ mở, nội dung, và thẻ đóng. Thẻ đóng có dấu gạch chéo.</p>
<pre><code class="language-html">&lt;p&gt;Xin chào&lt;/p&gt;
 │   │        │
 │   │        └── thẻ đóng (để ý dấu / )
 │   └─────────── phần nội dung
 └─────────────── thẻ mở</code></pre>
<p>Một <strong>thuộc tính (attribute)</strong> cho thêm cấu hình. Nó nằm trong thẻ mở dạng <code>tên="giá trị"</code>. Liên kết cần biết đi đâu; ảnh cần biết hiện tệp nào:</p>
<pre><code class="language-html">&lt;a href="https://cuongthai.com"&gt;Ghé thăm CuongThai&lt;/a&gt;
&lt;img src="meo.jpg" alt="Một con mèo xám ngủ trên ghế sô-pha"&gt;
&lt;br&gt;</code></pre>
<p>Hai dòng cuối không có nội dung và không có thẻ đóng. Chúng là <strong>phần tử rỗng (void element)</strong>: ảnh hay ngắt dòng chẳng có gì để bọc. Đôi khi bạn sẽ thấy <code>&lt;br /&gt;</code> có dấu gạch chéo. Trong HTML nó có nghĩa như nhau; trong JSX (React) dấu gạch chéo là bắt buộc.</p>
<p>Các phần tử lồng vào nhau, và phải đóng theo thứ tự ngược: mở sau, đóng trước.</p>
<pre><code class="language-html">&lt;p&gt;Đây là chữ &lt;strong&gt;rất &lt;em&gt;quan trọng&lt;/em&gt;&lt;/strong&gt;.&lt;/p&gt;   &lt;!-- lồng đúng --&gt;
&lt;p&gt;Đây là &lt;strong&gt;sai&lt;/p&gt;&lt;/strong&gt;                          &lt;!-- thẻ bắt chéo --&gt;</code></pre>
<p>Chữ nằm trong <code>&lt;!-- --&gt;</code> là <strong>chú thích (comment)</strong>: trình duyệt bỏ qua, nhưng ai cũng đọc được bằng View Source, nên đừng bao giờ để ghi chú riêng tư ở đó.</p>

<h3>Bước 2 — bộ khung mà trang nào cũng bắt đầu từ đó</h3>
${ma('html', CODE['2-1/trang-dau-tien.html'])}
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;!DOCTYPE html&gt;</span><span class="v">"Đây là HTML hiện đại." Luôn là dòng đầu tiên. Bước 6 cho thấy chuyện gì xảy ra nếu thiếu.</span></div>
  <div class="kv"><span class="k">&lt;html lang="vi"&gt;</span><span class="v">Gốc của trang. <code>lang</code> cho trình đọc màn hình biết dùng giọng nào và cho trình duyệt biết khi nào nên đề nghị dịch.</span></div>
  <div class="kv"><span class="k">&lt;head&gt;</span><span class="v">Thông tin <em>về</em> trang: tiêu đề, bảng mã, liên kết tới CSS. Không gì ở đây hiện trong vùng trang.</span></div>
  <div class="kv"><span class="k">&lt;meta charset="UTF-8"&gt;</span><span class="v">Cách lưu các chữ cái. UTF-8 làm Tiếng Việt hiện đúng. Đặt đầu tiên trong <code>head</code>.</span></div>
  <div class="kv"><span class="k">&lt;meta name="viewport"…&gt;</span><span class="v">Bảo điện thoại dùng đúng bề rộng thật. Thiếu nó, điện thoại hiện một trang desktop bé tí (Bài 3.5).</span></div>
  <div class="kv"><span class="k">&lt;title&gt;</span><span class="v">Chữ trên thẻ trình duyệt và dòng tiêu đề xanh trong kết quả Google.</span></div>
  <div class="kv"><span class="k">&lt;body&gt;</span><span class="v">Mọi thứ nhìn thấy trên trang nằm ở đây.</span></div>
</div>
<p>Lưu thành <code>index.html</code> rồi bấm đúp. Ảnh chụp ở slide 4 đúng là thứ Chromium đã hiển thị. Trong VS Code bạn gõ <code>!</code> rồi Tab để sinh bộ khung này; nhưng hãy tự gõ vài lần để biết mỗi dòng để làm gì.</p>

<h3>Bước 3 — tệp của bạn thành một cái cây: DOM</h3>
<p>Trình duyệt không hiển thị tệp của bạn. Nó <strong>phân tích (parse)</strong> chữ thành một cây các đối tượng gọi là <strong>DOM</strong> (Document Object Model — mô hình đối tượng tài liệu), rồi hiển thị cái cây. Đây là một trang tí hon, và vài dòng JavaScript đi qua cây rồi in nó ra:</p>
${ma('html', CODE['2-1/cay-dom.html'], [5, 9])}
${ra(OUT['2-1/cay-dom'])}
<p>Mỗi thẻ thành một nút, lồng đúng như các thẻ lồng nhau. Nhìn vào <code>h1</code>: nó có ba con, vì chữ "My", phần tử <code>em</code>, và chữ "page" là ba nút riêng. Trình duyệt còn thêm thứ khác: nếu bạn bỏ sót <code>head</code> và <code>body</code>, nó tự tạo cho bạn.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chữ tới nơi</span><span class="lz-d">Tệp <code>.html</code> là chữ thường. Không có biên dịch; trình duyệt đọc nó ngay khi nó tới.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Phân tích thành DOM</span><span class="lz-d">Thẻ thành nút trong cây. Lỗi được sửa âm thầm ở bước này.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Áp CSS, rồi vẽ</span><span class="lz-d">Kiểu gắn vào nút của cây, không gắn vào dòng trong tệp.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">JavaScript đổi cây</span><span class="lz-d">Trang cập nhật; tệp của bạn trên đĩa không đổi.</span></div>
</div>
<p>Thẻ <strong>Elements</strong> của DevTools hiện cái cây này, không phải tệp của bạn. "View Page Source" mới hiện tệp. Khi hai thứ khác nhau, chỗ khác đó thường chính là lỗi của bạn.</p>

<h3>Bước 4 — HTML không bao giờ báo lỗi</h3>
<p>Đây là sự thật quan trọng nhất về HTML, và là điều người mới học được theo cách đau đớn. Đây là ba lỗi cố ý:</p>
${ma('html', CODE['2-1/tu-sua-loi.html'], [5, 7])}
<p>Console không hiện lỗi nào. Trình duyệt đã sửa hết. In cây ra sẽ thấy nó thật sự dựng gì:</p>
${ra(OUT['2-1/tu-sua-loi'])}
<ul>
<li><strong>a:</strong> một <code>&lt;p&gt;</code> mới đóng cái chưa đóng. Vô hại, và thậm chí hợp lệ.</li>
<li><strong>b:</strong> <code>div</code> không được nằm trong <code>p</code>. Trình duyệt đóng đoạn văn trước <code>div</code>, để chữ "it" trôi nổi, và biến <code>&lt;/p&gt;</code> lẻ của bạn thành một <strong>đoạn văn rỗng</strong> mới. Giờ trang có một khoảng trống bí ẩn.</li>
<li><strong>c:</strong> thẻ bắt chéo. Nó đóng <code>i</code> sớm và mở một <code>i</code> thứ hai để nối tiếp. Cây chứa hai phần tử <code>i</code> bạn chưa bao giờ viết.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trang hỏng trông như lỗi CSS hay JavaScript.</strong> Quên một <code>&lt;/div&gt;</code> và trình duyệt đóng hộ bạn — ở đâu đó. Chân trang chui vào trong thanh bên, bộ chọn CSS không khớp nữa, và bạn mất một giờ với một tệp CSS vốn hoàn toàn đúng. Console không nhắc gì, vì phục hồi từ HTML sai là hành vi đã được quy định, không phải lỗi. Khi có gì nằm sai chỗ, hãy mở <strong>Elements</strong> trước tiên và so cái cây với điều bạn định viết. <a href="https://validator.w3.org/nu/" target="_blank" rel="noopener">W3C validator</a> liệt kê mọi vấn đề trong vài giây.</p></div>

<h3>Bước 5 — thuộc tính, chi tiết hơn</h3>
${ma('html', CODE['2-1/thuoc-tinh.html'], [5, 8])}
${ra(OUT['2-1/thuoc-tinh'])}
<table>
<thead><tr><th>Thuộc tính</th><th>Dùng cho</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td><code>id</code></td><td>mọi phần tử</td><td>Tên duy nhất trên trang, cho liên kết, nhãn và JavaScript</td></tr>
<tr><td><code>class</code></td><td>mọi phần tử</td><td>Một hoặc nhiều tên cách nhau bởi dấu cách, cho CSS</td></tr>
<tr><td><code>title</code></td><td>mọi phần tử</td><td>Chữ thêm, hiện thành chú giải khi rê chuột</td></tr>
<tr><td><code>lang</code></td><td>mọi phần tử</td><td>Ngôn ngữ của nội dung đó</td></tr>
<tr><td><code>hidden</code></td><td>mọi phần tử</td><td>Không hiển thị</td></tr>
<tr><td><code>data-*</code></td><td>mọi phần tử</td><td>Dữ liệu của riêng bạn, đọc trong JavaScript qua <code>dataset</code></td></tr>
<tr><td><code>href</code>, <code>src</code>, <code>alt</code></td><td>phần tử cụ thể</td><td>Đích liên kết, tệp cần tải, chữ thay thế</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>disabled="false"</code> vẫn vô hiệu hoá.</strong> <code>disabled</code>, <code>checked</code>, <code>required</code>, <code>hidden</code> và <code>readonly</code> là <strong>thuộc tính boolean</strong>: chỉ cần <em>có mặt</em> là đúng, giá trị viết gì cũng mặc. Output ở trên chứng minh: <code>b2</code> có <code>disabled="false"</code> mà vẫn bị vô hiệu hoá. Muốn tắt thì xoá hẳn thuộc tính. Cùng luật đó giải thích vì sao chúng thường được viết không kèm giá trị.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — trùng <code>id</code>.</strong> <code>id</code> phải duy nhất trên trang. Trình duyệt không than phiền khi trùng, nhưng <code>document.getElementById</code> chỉ trả cái đầu tiên, <code>label for</code> chỉ nối với cái đầu tiên, và liên kết <code>#id</code> nhảy tới cái đầu tiên. Nhiều phần tử dùng chung kiểu thì dùng <code>class</code>.</p></div>

<h3>Bước 6 — vì sao doctype quan trọng</h3>
<p>Dòng đầu trông như trang trí. Không phải đâu. Đây là hai trang, một trang không có nó:</p>
${ra(OUT['2-1/khong-doctype'] + '\n' + OUT['2-1/co-doctype'])}
<p><code>BackCompat</code> là <strong>chế độ quirks</strong>: trình duyệt bắt chước các lỗi bố cục của trình duyệt thập niên 1990, để những trang rất cũ vẫn chạy. <code>CSS1Compat</code> là chế độ chuẩn, chế độ duy nhất bạn muốn. Trong quirks, kích thước hộp và một số kiểu kế thừa cư xử khác đi, và CSS của bạn trông hỏng một cách khó hiểu. Một dòng ngăn được hết.</p>

<h3>Bước 7 — viết ký tự đặc biệt</h3>
<p><code>&lt;</code> mở đầu một thẻ, còn <code>&amp;</code> mở đầu một tham chiếu ký tự. Vậy nếu bạn chỉ muốn <em>hiện</em> dòng chữ <code>&lt;p&gt;</code> thì sao?</p>
${ma('html', CODE['2-1/ky-tu-dac-biet.html'], [5, 7])}
${ra(OUT['2-1/ky-tu-dac-biet'])}
<p>Ta viết ba đoạn mà trang có <strong>bốn</strong>: <code>&lt;p&gt;</code> đầu tiên trong chữ bị phân tích thành thẻ thật (ảnh chụp ở slide 9). Cách sửa là <strong>thực thể ký tự (character entity)</strong>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">&amp;lt; &amp;gt;</span><span class="v">Ký tự &lt; và &gt;.</span></div>
  <div class="kv"><span class="k">&amp;amp;</span><span class="v">Ký tự &amp;.</span></div>
  <div class="kv"><span class="k">&amp;nbsp;</span><span class="v">Dấu cách không ngắt: dòng sẽ không xuống giữa "100" và "000".</span></div>
</div>
<p>Với UTF-8 bạn gõ thẳng được chữ Việt, emoji và ký hiệu như ₫; thực thể chỉ cần cho những ký tự có nghĩa với HTML. Ở Chương 7 bạn sẽ thấy đây cũng là chuyện bảo mật: chữ người dùng nhập có chứa <code>&lt;script&gt;</code> phải được thoát.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút) — trang hồ sơ theo trí nhớ</strong></p>
<ol>
<li>Đóng bài học lại. Trong một thư mục mới, tạo <code>index.html</code> và gõ cả bộ khung theo trí nhớ, với <code>lang="en"</code> hoặc <code>lang="vi"</code>.</li>
<li>Trong <code>body</code> thêm tiêu đề là tên bạn, một đoạn văn về bạn, một liên kết tới trang bạn thích, và danh sách ba sở thích (<code>ul</code> và <code>li</code>).</li>
<li>Thêm thuộc tính <code>data-age</code> vào đoạn văn và hiện dòng chữ <code>&lt;strong&gt;</code> đúng nguyên văn trên trang.</li>
<li>Mở trang, mở <strong>Elements</strong>. Cố ý xoá một thẻ đóng, lưu, tải lại và tìm xem cái cây đổi ra sao.</li>
</ol>
<p>Gợi ý: hãy thụt lề các phần tử lồng nhau. Thụt đúng thì lồng sai sẽ lộ ngay trước mắt.</p>
<p><strong>Xong khi:</strong> dán tệp cuối cùng vào <a href="https://validator.w3.org/nu/#textarea" target="_blank" rel="noopener">W3C validator</a> không báo lỗi nào; chạy <code>document.compatMode</code> trong Console in ra <code>CSS1Compat</code>; và trang hiện đúng dòng chữ <code>&lt;strong&gt;</code>. Sau đó module Code Lab 2.1 tự chấm bảy trang nhỏ kiểu này.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">element</span><span class="v">phần tử — thẻ mở + nội dung + thẻ đóng.</span></div>
  <div class="kv"><span class="k">tag</span><span class="v">thẻ — phần trong dấu ngoặc nhọn.</span></div>
  <div class="kv"><span class="k">attribute</span><span class="v">thuộc tính — tên="giá trị" trong thẻ mở.</span></div>
  <div class="kv"><span class="k">void element</span><span class="v">phần tử rỗng — không có nội dung, không có thẻ đóng.</span></div>
  <div class="kv"><span class="k">boolean attribute</span><span class="v">thuộc tính boolean — có mặt là đúng.</span></div>
  <div class="kv"><span class="k">nesting</span><span class="v">lồng nhau — mở sau, đóng trước.</span></div>
  <div class="kv"><span class="k">parse</span><span class="v">phân tích cú pháp — đọc chữ thành cấu trúc.</span></div>
  <div class="kv"><span class="k">DOM</span><span class="v">mô hình đối tượng tài liệu — cây các nút của trang.</span></div>
  <div class="kv"><span class="k">quirks mode</span><span class="v">chế độ tương thích cũ — bắt chước lỗi trình duyệt xưa.</span></div>
  <div class="kv"><span class="k">character entity</span><span class="v">thực thể ký tự — &amp;lt;, &amp;amp;…</span></div>
  <div class="kv"><span class="k">UTF-8</span><span class="v">bảng mã chứa mọi ký tự, kể cả tiếng Việt.</span></div>
  <div class="kv"><span class="k">validator</span><span class="v">trình kiểm tra — liệt kê lỗi HTML.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>HTML dán nhãn cho nội dung. Nó không tính toán; nó đánh dấu mỗi mẩu là gì.</li>
  <li>Phần tử = thẻ mở + nội dung + thẻ đóng; phần tử rỗng không có nội dung lẫn thẻ đóng.</li>
  <li>Mọi trang: doctype, <code>html lang</code>, <code>head</code> có charset, viewport, title; <code>body</code> chứa nội dung.</li>
  <li>Trình duyệt phân tích tệp thành cây DOM. CSS và JavaScript làm việc trên cây.</li>
  <li>HTML không bao giờ báo lỗi; trình duyệt sửa âm thầm. Soi bằng Elements, kiểm bằng validator.</li>
  <li>Thuộc tính boolean: có mặt là đúng. <code>id</code> phải duy nhất.</li>
  <li>Thiếu doctype là vào chế độ quirks. Thoát <code>&lt;</code> và <code>&amp;</code> bằng thực thể.</li>
</ul>
${nguon('📗', 'MDN — Structuring content with HTML', 'Tài liệu đáng đánh dấu', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content')}
${nguon('📘', 'W3C Nu HTML Checker', 'Dán HTML vào và thấy chính xác chỗ nào sai', 'https://validator.w3.org/nu/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-html', title: 'WED201c (Academy) — HTML cơ bản', sub: 'Môn học ở trường, dựng tiếp trên bài này', cta: 'Mở bài' })}
${lienKet({ khoa: 'react', bai: 'rx-0-2-jsx', title: 'React 0.2 — JSX', sub: 'Điều gì đổi khi bạn viết chính thứ đánh dấu này trong JavaScript', cta: 'Mở bài' })}
</div>
`,
};
