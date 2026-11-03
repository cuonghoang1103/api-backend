/**
 * Bài 4.5 — DOM và sự kiện (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/4-5, có ảnh chụp todo + XSS).
 * Deck: scripts/slides-src/wf-4-5.mjs (10 slide, WF/v1/wf-4-5). Code Lab: module 4.5 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-4-5', 'The DOM and events', 'DOM và sự kiện', [
  [1, 'The DOM and events',
    '<p>This is where the three languages meet. JavaScript finds elements in the page, changes them, and reacts when the user clicks or types. At the end of the lesson you will have a small but complete todo app, built the same way frameworks build much larger ones.</p>',
    '<p>Đây là nơi ba ngôn ngữ gặp nhau. JavaScript tìm phần tử trong trang, thay đổi chúng, và phản ứng khi người dùng bấm hay gõ. Cuối bài bạn sẽ có một ứng dụng todo nhỏ mà hoàn chỉnh, dựng theo đúng cách các framework dựng những ứng dụng lớn hơn nhiều.</p>'],
  [2, 'After this lesson you can…',
    '<p>Two outcomes protect you from serious mistakes: knowing why a script in the head finds nothing, and knowing why <code>innerHTML</code> with user text is a security hole. The rest are the everyday tools for every interactive page you will build.</p>',
    '<p>Hai kết quả bảo vệ bạn khỏi sai lầm nghiêm trọng: biết vì sao script trong head không tìm thấy gì, và biết vì sao <code>innerHTML</code> với chữ người dùng là lỗ hổng bảo mật. Phần còn lại là công cụ hằng ngày cho mọi trang tương tác bạn sẽ dựng.</p>'],
  [3, 'Finding elements',
    '<p><code>querySelector</code> returns the first match, <code>querySelectorAll</code> all of them, using the same selectors as CSS. When nothing matches you get <code>null</code>, and the error appears only on the next line, when you try to use it. Read that error message carefully: it names the property, not the selector.</p>',
    '<p><code>querySelector</code> trả về phần tử khớp đầu tiên, <code>querySelectorAll</code> trả về tất cả, dùng đúng bộ chọn của CSS. Khi không khớp gì, bạn nhận <code>null</code>, và lỗi chỉ hiện ở dòng sau, khi bạn cố dùng nó. Đọc kỹ thông báo đó: nó nêu tên thuộc tính, không nêu bộ chọn.</p>'],
  [4, 'Changing the page',
    '<p>Change text with <code>textContent</code>, appearance with <code>classList</code>, attributes with <code>setAttribute</code>, and create new elements with <code>createElement</code> and <code>append</code>. The screenshot is the real result. Prefer toggling classes over writing inline styles.</p>',
    '<p>Đổi chữ bằng <code>textContent</code>, giao diện bằng <code>classList</code>, thuộc tính bằng <code>setAttribute</code>, và tạo phần tử mới bằng <code>createElement</code> và <code>append</code>. Ảnh chụp là kết quả thật. Hãy bật tắt class thay vì viết style nội dòng.</p>'],
  [5, 'textContent or innerHTML?',
    '<p>The same user comment, inserted twice. With <code>textContent</code> it appears as harmless text. With <code>innerHTML</code> the browser parsed it, created an image, and ran the attacker’s code. This attack is called cross-site scripting, and it is one of the most common holes on the web.</p>',
    '<p>Cùng một bình luận của người dùng, chèn hai lần. Với <code>textContent</code> nó hiện thành chữ vô hại. Với <code>innerHTML</code> trình duyệt phân tích nó, tạo ra một ảnh, và chạy mã của kẻ tấn công. Kiểu tấn công này gọi là cross-site scripting, và là một trong những lỗ hổng phổ biến nhất trên web.</p>'],
  [6, 'When does the script run?',
    '<p>The browser runs a script the moment it reaches it while reading the HTML. A script in the head runs before the button exists and finds <code>null</code>. A script at the end of the body, or one with <code>defer</code>, runs after the page is parsed. Use <code>defer</code>.</p>',
    '<p>Trình duyệt chạy script ngay khi đọc tới nó trong HTML. Script trong head chạy trước khi nút tồn tại nên nhận <code>null</code>. Script ở cuối body, hoặc có <code>defer</code>, chạy sau khi trang đã được phân tích. Hãy dùng <code>defer</code>.</p>'],
  [7, 'Events and bubbling',
    '<p>A listener runs every time its event happens. The event object says what happened and on which element. Events bubble up: the outer div heard the button’s click too, with the same target. A second listener adds rather than replaces, and <code>stopPropagation</code> stops the bubbling.</p>',
    '<p>Bộ nghe chạy mỗi lần sự kiện của nó xảy ra. Đối tượng event cho biết chuyện gì xảy ra và trên phần tử nào. Sự kiện nổi bọt lên: div bên ngoài cũng nghe thấy cú bấm của nút, với cùng target. Bộ nghe thứ hai được thêm vào chứ không thay thế, và <code>stopPropagation</code> chặn việc nổi bọt.</p>'],
  [8, 'Event delegation',
    '<p>Bubbling enables a powerful pattern: one listener on the parent handles clicks for every child, including children added later. <code>closest</code> finds which item was clicked. Here a row added after the listener was attached could still be deleted.</p>',
    '<p>Việc nổi bọt mở ra một mẫu mạnh mẽ: một bộ nghe trên cha xử lý cú bấm cho mọi con, kể cả con được thêm sau. <code>closest</code> tìm ra mục nào được bấm. Ở đây một dòng thêm vào sau khi gắn bộ nghe vẫn xoá được.</p>'],
  [9, 'A complete todo app',
    '<p>Everything together: the data is an array, a <code>render</code> function draws the page from it, the form adds items without reloading, and one delegated listener toggles them. The screenshot and the data dump come from Chromium. This data-then-render idea is exactly how React works.</p>',
    '<p>Mọi thứ cùng lúc: dữ liệu là một mảng, hàm <code>render</code> vẽ trang từ nó, form thêm mục mà không tải lại, và một bộ nghe ủy quyền bật tắt chúng. Ảnh chụp và bản dữ liệu đến từ Chromium. Ý tưởng dữ liệu rồi mới vẽ này chính là cách React làm việc.</p>'],
  [10, 'Summary & practice',
    '<p>The practice extends the todo app with deleting, a counter and saving to local storage. "Done when" includes reloading the page and finding your list still there, and pasting HTML into the input to prove it is shown as text.</p>',
    '<p>Bài luyện mở rộng app todo với xoá, bộ đếm và lưu vào local storage. "Xong khi" gồm việc tải lại trang mà danh sách vẫn còn, và dán HTML vào ô nhập để chứng minh nó hiện thành chữ.</p>'],
]);

export default {
  title: '4.5 — The DOM and events: making pages interactive|||4.5 — DOM và sự kiện: làm trang tương tác',
  slug: 'wf-4-5-dom-events',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/y17RuWkWdn8', durationSeconds: 0 },
  description: 'Tìm phần tử (querySelector, null), đổi trang (textContent, classList, setAttribute, createElement), textContent vs innerHTML và XSS đo thật, script chạy lúc nào và defer, sự kiện và nổi bọt, ủy quyền sự kiện, ứng dụng todo hoàn chỉnh theo mẫu dữ liệu → render. Output và ảnh chụp thật từ Chromium.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>JavaScript meets the page</h2>
<p class="lead">After this lesson you can find any element on a page, change its text, classes and attributes, create new elements, run code when the user clicks or types, handle many elements with one listener, and build a small interactive app — safely. You need this because this is the moment your pages stop being documents and become applications. It is also the foundation that React and other frameworks automate for you: understanding it makes those frameworks readable instead of magical.</p>

<h3>The DOM, again</h3>
<p>In Lesson 2.1 you saw that the browser turns HTML into a tree of objects, the DOM. JavaScript can read and change that tree, and the browser redraws whatever changed. Your HTML file never changes; only the living tree in memory does, which is why a reload resets everything.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Find</span><span class="lz-d"><code>document.querySelector('#title')</code></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Listen</span><span class="lz-d"><code>button.addEventListener('click', handler)</code></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Update data</span><span class="lz-d">The handler changes your variables.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Change the page</span><span class="lz-d"><code>textContent</code>, <code>classList</code>… The browser repaints.</span></div>
</div>

<h3>Step 1 — finding elements</h3>
${ma('html', CODE['4-5/chon.html'], [4, 24])}
${ra(OUT['4-5/chon'])}
<div class="kv-grid">
  <div class="kv"><span class="k">querySelector(s)</span><span class="v">The first element matching a CSS selector, or <code>null</code>.</span></div>
  <div class="kv"><span class="k">querySelectorAll(s)</span><span class="v">All matches, as a list you can loop with <code>forEach</code> or <code>for...of</code>.</span></div>
  <div class="kv"><span class="k">getElementById(id)</span><span class="v">An older, slightly faster way for ids.</span></div>
  <div class="kv"><span class="k">parentElement, children, closest(s)</span><span class="v">Move around the tree from an element you have.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "Cannot set properties of null".</strong> <code>querySelector</code> does not complain when nothing matches; it returns <code>null</code>, and the error appears on the <em>next</em> line, mentioning the property (<code>textContent</code>), not the selector. When you see it, check three things: a typo in the selector (<code>.item</code> vs <code>#item</code>), an element that does not exist yet (Step 4), or a missing dot or hash.</p></div>

<h3>Step 2 — changing the page</h3>
${ma('html', CODE['4-5/doi-trang.html'], [10, 26])}
${ra(OUT['4-5/doi-trang'])}
<table>
<thead><tr><th>To change</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Text</td><td><code>el.textContent = '…'</code></td></tr>
<tr><td>Appearance</td><td><code>el.classList.add / remove / toggle('name')</code>, styled in CSS</td></tr>
<tr><td>An attribute</td><td><code>el.setAttribute('href', …)</code>, or the property <code>el.href</code></td></tr>
<tr><td>Form values</td><td><code>input.value</code>, <code>checkbox.checked</code></td></tr>
<tr><td>Custom data</td><td><code>el.dataset.id</code> for <code>data-id</code></td></tr>
<tr><td>Add an element</td><td><code>document.createElement</code> then <code>parent.append(child)</code></td></tr>
<tr><td>Remove an element</td><td><code>el.remove()</code></td></tr>
</tbody>
</table>
<p><code>el.style.color</code> works, but writes an inline style with high specificity. Prefer a class: your CSS keeps the design, and JavaScript only says which state the element is in.</p>

<h3>Step 3 — <code>textContent</code> or <code>innerHTML</code>?</h3>
${ma('html', CODE['4-5/xss.html'], [5, 19])}
${ra(OUT['4-5/xss'])}
<p>The same "comment" was inserted twice. With <code>textContent</code> the page shows the characters literally. With <code>innerHTML</code> the browser parsed the text as HTML, created an <code>img</code> whose file failed to load, and ran its <code>onerror</code> code: <strong>injected code ran: true</strong>. Here it set a harmless variable; a real attacker would read the visitor's data or act as them.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>innerHTML</code> with data you did not write.</strong> This is <strong>cross-site scripting</strong> (XSS), one of the most common web vulnerabilities. Anything that came from a user, a URL or an API is untrusted. Insert it with <code>textContent</code>, or build elements with <code>createElement</code>. Use <code>innerHTML</code> only for markup you wrote yourself. React escapes text for you, which is one of its quiet benefits; its escape hatch is literally named <code>dangerouslySetInnerHTML</code>. Chapter 7 returns to this.</p></div>

<h3>Step 4 — when does your script run?</h3>
${ma('html', CODE['4-5/som-qua.html'])}
${ra(OUT['4-5/som-qua'])}
<p>The browser reads HTML from top to bottom and runs each <code>script</code> the moment it reaches it, pausing everything else. The script in <code>head</code> ran before the button existed, so it found <code>null</code>. Three ways to get it right:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;script src defer&gt; in head</span><span class="v">Downloads in parallel, runs after the page is parsed, in order. <strong>The recommended default.</strong></span></div>
  <div class="kv"><span class="k">&lt;script type="module"&gt;</span><span class="v">Deferred automatically (Lesson 5.5).</span></div>
  <div class="kv"><span class="k">At the end of body</span><span class="v">The old way. Works, but downloads late.</span></div>
</div>

<h3>Step 5 — events, and bubbling</h3>
${ma('html', CODE['4-5/su-kien.html'], [7, 31])}
${ra(OUT['4-5/su-kien'])}
<p><code>addEventListener(type, handler)</code> calls your function every time the event happens, and passes it an <strong>event object</strong>. <code>event.target</code> is the element where it started; <code>event.currentTarget</code> is the element whose listener is running. Common types: <code>click</code>, <code>input</code> (every keystroke), <code>change</code> (after editing), <code>submit</code>, <code>keydown</code>, <code>DOMContentLoaded</code>.</p>
<p>Look at the second line of output: the outer <code>div</code> also heard the click. Events <strong>bubble</strong> up from the target through every ancestor. A second listener on the same element is <em>added</em>, not substituted. <code>stopPropagation</code> stops the bubbling, and <code>preventDefault</code> (next step) cancels the browser's default action, such as submitting a form.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — adding the same listener again and again.</strong> If your code attaches a click listener inside another handler, or every time a list is redrawn, each click starts running the handler twice, then three times. Attach listeners once, at start-up, and for lists use delegation (next step). Remember also from Lesson 4.3: pass <code>handler</code>, not <code>handler()</code>.</p></div>

<h3>Step 6 — event delegation</h3>
${ma('html', CODE['4-5/uy-quyen.html'], [5, 17])}
${ra(OUT['4-5/uy-quyen'])}
<p>Instead of a listener on every delete button, one listener on the list catches every click that bubbles up. <code>event.target.closest('button')</code> finds the button that was clicked, even if the click landed on an icon inside it. Because the listener is on the parent, it works for rows added later, as row 2 shows. This is called <strong>event delegation</strong>.</p>

<h3>Step 7 — a complete app: data first, then render</h3>
${ma('html', CODE['4-5/todo.html'], [18, 59])}
${ra(OUT['4-5/todo'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">State</span><span class="lz-t">the array <code>tasks</code></span><span class="lz-d">The single source of truth. Never read data back from the page.</span></div>
<div class="lz-layer"><span class="lz-k">Render</span><span class="lz-t">a function</span><span class="lz-d">Clears the list and redraws it entirely from <code>tasks</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Events</span><span class="lz-t">submit and one delegated click</span><span class="lz-d">They only change <code>tasks</code>, then call <code>render()</code>.</span></div>
</div>
<p>The screenshot on slide 9 shows the result after the demo added three tasks and ticked the first. <code>event.preventDefault()</code> stopped the form from reloading the page (Lesson 2.4). User text goes in with <code>textContent</code>, so it can never run. This pattern — change the data, then redraw from the data — is exactly what React does for you, faster and automatically.</p>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — finish the todo app</strong></p>
<ol>
<li>Copy the todo page and run it. Remove the demo lines that add tasks by themselves.</li>
<li>Add a Delete button to each row, handled by the same delegated listener (check which button was clicked with a <code>data-action</code> attribute).</li>
<li>Add a "Clear done" button above the list.</li>
<li>Save <code>tasks</code> after every change with <code>localStorage.setItem('tasks', JSON.stringify(tasks))</code>, and load it at start-up inside <code>try/catch</code>.</li>
<li>Load your script with <code>defer</code> from a separate file.</li>
</ol>
<p>Hint: all changes go through the same two steps: update <code>tasks</code>, call <code>render()</code>. Then save.</p>
<p><strong>Done when:</strong> after adding three tasks and reloading the page, they are still there; deleting and "Clear done" work; typing <code>&lt;b&gt;bold&lt;/b&gt;</code> as a task shows the tags as text; the counter is always right; and the Console shows no errors. Then Code Lab module 4.5.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DOM</span><span class="v">cây đối tượng của trang.</span></div>
  <div class="kv"><span class="k">element / node</span><span class="v">phần tử / nút.</span></div>
  <div class="kv"><span class="k">querySelector</span><span class="v">tìm phần tử bằng bộ chọn CSS.</span></div>
  <div class="kv"><span class="k">textContent / innerHTML</span><span class="v">chữ thuần / phân tích thành HTML.</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">chèn mã độc qua dữ liệu người dùng.</span></div>
  <div class="kv"><span class="k">event / listener / handler</span><span class="v">sự kiện / bộ nghe / hàm xử lý.</span></div>
  <div class="kv"><span class="k">target / currentTarget</span><span class="v">nơi sự kiện bắt đầu / nơi bộ nghe đang chạy.</span></div>
  <div class="kv"><span class="k">bubbling</span><span class="v">nổi bọt — sự kiện đi ngược lên tổ tiên.</span></div>
  <div class="kv"><span class="k">event delegation</span><span class="v">ủy quyền sự kiện — một bộ nghe trên cha.</span></div>
  <div class="kv"><span class="k">preventDefault</span><span class="v">huỷ hành động mặc định của trình duyệt.</span></div>
  <div class="kv"><span class="k">defer</span><span class="v">chạy script sau khi trang đã phân tích xong.</span></div>
  <div class="kv"><span class="k">render</span><span class="v">vẽ giao diện từ dữ liệu.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Find with <code>querySelector</code>; an empty result is <code>null</code> and fails on the next line.</li>
  <li>Change text with <code>textContent</code>, looks with <code>classList</code>; create with <code>createElement</code> + <code>append</code>.</li>
  <li>Never put untrusted data into <code>innerHTML</code>: that is XSS.</li>
  <li>Load scripts with <code>defer</code>, so the page exists when they run.</li>
  <li><code>addEventListener</code> passes an event; events bubble; attach listeners once.</li>
  <li>Delegate: one listener on the parent, <code>closest</code> to find the item.</li>
  <li>Keep data as the source of truth, and render the page from it.</li>
</ul>
${nguon('📗', 'MDN — Manipulating documents', 'The DOM, step by step', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting')}
${nguon('📘', 'MDN — Introduction to events', 'Listeners, the event object, bubbling and delegation', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-dom', title: 'WED201c (Academy) — the DOM', sub: 'The same tools in the university syllabus', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>JavaScript gặp trang web</h2>
<p class="lead">Học xong bài này bạn tìm được mọi phần tử trên trang, đổi chữ, class và thuộc tính của nó, tạo phần tử mới, chạy mã khi người dùng bấm hay gõ, xử lý nhiều phần tử bằng một bộ nghe, và dựng một ứng dụng tương tác nhỏ — một cách an toàn. Bạn cần điều này vì đây là lúc trang của bạn thôi là tài liệu và trở thành ứng dụng. Nó cũng là nền tảng mà React và các framework khác tự động hoá cho bạn: hiểu nó khiến các framework đó đọc được, thay vì như phép thuật.</p>

<h3>Lại là DOM</h3>
<p>Ở Bài 2.1 bạn đã thấy trình duyệt biến HTML thành cây đối tượng, gọi là DOM. JavaScript đọc và đổi được cây đó, và trình duyệt vẽ lại chỗ thay đổi. Tệp HTML của bạn không bao giờ đổi; chỉ cây sống trong bộ nhớ đổi, vì vậy tải lại trang là mọi thứ về như cũ.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tìm</span><span class="lz-d"><code>document.querySelector('#title')</code></span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nghe</span><span class="lz-d"><code>button.addEventListener('click', handler)</code></span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cập nhật dữ liệu</span><span class="lz-d">Hàm xử lý đổi các biến của bạn.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đổi trang</span><span class="lz-d"><code>textContent</code>, <code>classList</code>… Trình duyệt vẽ lại.</span></div>
</div>

<h3>Bước 1 — tìm phần tử</h3>
${ma('html', CODE['4-5/chon.html'], [4, 24])}
${ra(OUT['4-5/chon'])}
<div class="kv-grid">
  <div class="kv"><span class="k">querySelector(s)</span><span class="v">Phần tử đầu tiên khớp bộ chọn CSS, hoặc <code>null</code>.</span></div>
  <div class="kv"><span class="k">querySelectorAll(s)</span><span class="v">Mọi phần tử khớp, dạng danh sách lặp được bằng <code>forEach</code> hay <code>for...of</code>.</span></div>
  <div class="kv"><span class="k">getElementById(id)</span><span class="v">Cách cũ hơn, nhanh hơn chút cho id.</span></div>
  <div class="kv"><span class="k">parentElement, children, closest(s)</span><span class="v">Di chuyển trong cây từ một phần tử đã có.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "Cannot set properties of null".</strong> <code>querySelector</code> không phàn nàn khi không khớp gì; nó trả về <code>null</code>, và lỗi xuất hiện ở dòng <em>sau</em>, nhắc tới thuộc tính (<code>textContent</code>), không nhắc bộ chọn. Khi gặp lỗi này, kiểm ba thứ: gõ sai bộ chọn (<code>.item</code> với <code>#item</code>), phần tử chưa tồn tại (Bước 4), hoặc thiếu dấu chấm hay dấu thăng.</p></div>

<h3>Bước 2 — đổi trang</h3>
${ma('html', CODE['4-5/doi-trang.html'], [10, 26])}
${ra(OUT['4-5/doi-trang'])}
<table>
<thead><tr><th>Muốn đổi</th><th>Dùng</th></tr></thead>
<tbody>
<tr><td>Chữ</td><td><code>el.textContent = '…'</code></td></tr>
<tr><td>Giao diện</td><td><code>el.classList.add / remove / toggle('ten')</code>, tạo kiểu trong CSS</td></tr>
<tr><td>Một thuộc tính</td><td><code>el.setAttribute('href', …)</code>, hoặc property <code>el.href</code></td></tr>
<tr><td>Giá trị form</td><td><code>input.value</code>, <code>checkbox.checked</code></td></tr>
<tr><td>Dữ liệu riêng</td><td><code>el.dataset.id</code> cho <code>data-id</code></td></tr>
<tr><td>Thêm phần tử</td><td><code>document.createElement</code> rồi <code>parent.append(child)</code></td></tr>
<tr><td>Gỡ phần tử</td><td><code>el.remove()</code></td></tr>
</tbody>
</table>
<p><code>el.style.color</code> chạy được, nhưng ghi style nội dòng có độ cụ thể cao. Hãy ưu tiên class: CSS giữ phần thiết kế, JavaScript chỉ nói phần tử đang ở trạng thái nào.</p>

<h3>Bước 3 — <code>textContent</code> hay <code>innerHTML</code>?</h3>
${ma('html', CODE['4-5/xss.html'], [5, 19])}
${ra(OUT['4-5/xss'])}
<p>Cùng một "bình luận" được chèn hai lần. Với <code>textContent</code> trang hiện nguyên văn các ký tự. Với <code>innerHTML</code> trình duyệt phân tích chữ đó thành HTML, tạo một <code>img</code> có tệp không tải được, và chạy mã <code>onerror</code> của nó: <strong>injected code ran: true</strong>. Ở đây nó chỉ đặt một biến vô hại; kẻ tấn công thật sẽ đọc dữ liệu của người xem hoặc hành động thay họ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>innerHTML</code> với dữ liệu không do bạn viết.</strong> Đây là <strong>cross-site scripting</strong> (XSS), một trong những lỗ hổng web phổ biến nhất. Mọi thứ đến từ người dùng, từ URL hay từ API đều không đáng tin. Hãy chèn bằng <code>textContent</code>, hoặc dựng phần tử bằng <code>createElement</code>. Chỉ dùng <code>innerHTML</code> cho đánh dấu bạn tự viết. React tự thoát chữ cho bạn, một lợi ích thầm lặng của nó; lối thoát hiểm của nó có tên đúng nghĩa đen là <code>dangerouslySetInnerHTML</code>. Chương 7 quay lại chủ đề này.</p></div>

<h3>Bước 4 — script chạy lúc nào?</h3>
${ma('html', CODE['4-5/som-qua.html'])}
${ra(OUT['4-5/som-qua'])}
<p>Trình duyệt đọc HTML từ trên xuống và chạy mỗi <code>script</code> ngay khi tới nó, tạm dừng mọi thứ khác. Script trong <code>head</code> chạy trước khi nút tồn tại, nên nhận <code>null</code>. Ba cách làm đúng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">&lt;script src defer&gt; trong head</span><span class="v">Tải song song, chạy sau khi trang đã phân tích, theo thứ tự. <strong>Mặc định nên dùng.</strong></span></div>
  <div class="kv"><span class="k">&lt;script type="module"&gt;</span><span class="v">Tự động defer (Bài 5.5).</span></div>
  <div class="kv"><span class="k">Cuối body</span><span class="v">Cách cũ. Chạy được, nhưng tải muộn.</span></div>
</div>

<h3>Bước 5 — sự kiện, và nổi bọt</h3>
${ma('html', CODE['4-5/su-kien.html'], [7, 31])}
${ra(OUT['4-5/su-kien'])}
<p><code>addEventListener(loai, hamXuLy)</code> gọi hàm của bạn mỗi lần sự kiện xảy ra, và truyền cho nó một <strong>đối tượng event</strong>. <code>event.target</code> là phần tử nơi sự kiện bắt đầu; <code>event.currentTarget</code> là phần tử có bộ nghe đang chạy. Các loại hay gặp: <code>click</code>, <code>input</code> (mỗi lần gõ), <code>change</code> (sau khi sửa xong), <code>submit</code>, <code>keydown</code>, <code>DOMContentLoaded</code>.</p>
<p>Nhìn dòng output thứ hai: <code>div</code> bên ngoài cũng nghe thấy cú bấm. Sự kiện <strong>nổi bọt (bubble)</strong> từ target lên qua mọi tổ tiên. Bộ nghe thứ hai trên cùng phần tử được <em>thêm vào</em>, không thay thế. <code>stopPropagation</code> chặn việc nổi bọt, còn <code>preventDefault</code> (bước sau) huỷ hành động mặc định của trình duyệt, như gửi form.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gắn cùng một bộ nghe nhiều lần.</strong> Nếu mã gắn bộ nghe click bên trong một hàm xử lý khác, hay mỗi lần vẽ lại danh sách, thì mỗi cú bấm bắt đầu chạy hàm xử lý hai lần, rồi ba lần. Hãy gắn bộ nghe một lần lúc khởi động, và với danh sách thì dùng ủy quyền (bước sau). Nhớ cả Bài 4.3: truyền <code>handler</code>, không phải <code>handler()</code>.</p></div>

<h3>Bước 6 — ủy quyền sự kiện</h3>
${ma('html', CODE['4-5/uy-quyen.html'], [5, 17])}
${ra(OUT['4-5/uy-quyen'])}
<p>Thay vì một bộ nghe trên mỗi nút xoá, một bộ nghe trên danh sách hứng mọi cú bấm nổi bọt lên. <code>event.target.closest('button')</code> tìm ra nút được bấm, kể cả khi cú bấm rơi vào biểu tượng bên trong nó. Vì bộ nghe nằm trên cha, nó chạy được với các dòng thêm sau, như dòng 2 cho thấy. Kỹ thuật này gọi là <strong>event delegation (ủy quyền sự kiện)</strong>.</p>

<h3>Bước 7 — một ứng dụng hoàn chỉnh: dữ liệu trước, rồi mới vẽ</h3>
${ma('html', CODE['4-5/todo.html'], [18, 59])}
${ra(OUT['4-5/todo'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">State</span><span class="lz-t">mảng <code>tasks</code></span><span class="lz-d">Nguồn sự thật duy nhất. Không bao giờ đọc ngược dữ liệu từ trang.</span></div>
<div class="lz-layer"><span class="lz-k">Render</span><span class="lz-t">một hàm</span><span class="lz-d">Xoá danh sách và vẽ lại toàn bộ từ <code>tasks</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Sự kiện</span><span class="lz-t">submit và một click ủy quyền</span><span class="lz-d">Chúng chỉ đổi <code>tasks</code>, rồi gọi <code>render()</code>.</span></div>
</div>
<p>Ảnh chụp ở slide 9 cho thấy kết quả sau khi demo thêm ba việc và tick việc đầu. <code>event.preventDefault()</code> ngăn form tải lại trang (Bài 2.4). Chữ người dùng được chèn bằng <code>textContent</code>, nên không bao giờ chạy được. Mẫu này — đổi dữ liệu, rồi vẽ lại từ dữ liệu — chính là điều React làm cho bạn, nhanh hơn và tự động.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — hoàn thiện app todo</strong></p>
<ol>
<li>Chép trang todo và chạy nó. Xoá các dòng demo tự thêm việc.</li>
<li>Thêm nút Xoá cho mỗi dòng, xử lý bằng chính bộ nghe ủy quyền (kiểm nút nào được bấm bằng thuộc tính <code>data-action</code>).</li>
<li>Thêm nút "Xoá việc đã xong" phía trên danh sách.</li>
<li>Lưu <code>tasks</code> sau mỗi thay đổi bằng <code>localStorage.setItem('tasks', JSON.stringify(tasks))</code>, và đọc lại lúc khởi động trong <code>try/catch</code>.</li>
<li>Tải script bằng <code>defer</code> từ một tệp riêng.</li>
</ol>
<p>Gợi ý: mọi thay đổi đi qua cùng hai bước: cập nhật <code>tasks</code>, gọi <code>render()</code>. Rồi lưu.</p>
<p><strong>Xong khi:</strong> thêm ba việc rồi tải lại trang, chúng vẫn còn; xoá và "Xoá việc đã xong" chạy được; gõ <code>&lt;b&gt;bold&lt;/b&gt;</code> làm một việc thì thẻ hiện thành chữ; bộ đếm luôn đúng; và Console không có lỗi. Sau đó làm module Code Lab 4.5.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DOM</span><span class="v">cây đối tượng của trang.</span></div>
  <div class="kv"><span class="k">element / node</span><span class="v">phần tử / nút.</span></div>
  <div class="kv"><span class="k">querySelector</span><span class="v">tìm phần tử bằng bộ chọn CSS.</span></div>
  <div class="kv"><span class="k">textContent / innerHTML</span><span class="v">chữ thuần / phân tích thành HTML.</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">chèn mã độc qua dữ liệu người dùng.</span></div>
  <div class="kv"><span class="k">event / listener / handler</span><span class="v">sự kiện / bộ nghe / hàm xử lý.</span></div>
  <div class="kv"><span class="k">target / currentTarget</span><span class="v">nơi sự kiện bắt đầu / nơi bộ nghe đang chạy.</span></div>
  <div class="kv"><span class="k">bubbling</span><span class="v">nổi bọt — sự kiện đi ngược lên tổ tiên.</span></div>
  <div class="kv"><span class="k">event delegation</span><span class="v">ủy quyền sự kiện — một bộ nghe trên cha.</span></div>
  <div class="kv"><span class="k">preventDefault</span><span class="v">huỷ hành động mặc định của trình duyệt.</span></div>
  <div class="kv"><span class="k">defer</span><span class="v">chạy script sau khi trang đã phân tích xong.</span></div>
  <div class="kv"><span class="k">render</span><span class="v">vẽ giao diện từ dữ liệu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Tìm bằng <code>querySelector</code>; không khớp thì là <code>null</code> và hỏng ở dòng sau.</li>
  <li>Đổi chữ bằng <code>textContent</code>, giao diện bằng <code>classList</code>; tạo bằng <code>createElement</code> + <code>append</code>.</li>
  <li>Không bao giờ đưa dữ liệu không đáng tin vào <code>innerHTML</code>: đó là XSS.</li>
  <li>Tải script bằng <code>defer</code>, để trang đã tồn tại khi nó chạy.</li>
  <li><code>addEventListener</code> truyền một event; sự kiện nổi bọt; gắn bộ nghe một lần.</li>
  <li>Ủy quyền: một bộ nghe trên cha, <code>closest</code> để tìm mục.</li>
  <li>Giữ dữ liệu làm nguồn sự thật, và vẽ trang từ nó.</li>
</ul>
${nguon('📗', 'MDN — Manipulating documents', 'DOM, từng bước', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting')}
${nguon('📘', 'MDN — Introduction to events', 'Bộ nghe, đối tượng event, nổi bọt và ủy quyền', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-dom', title: 'WED201c (Academy) — DOM', sub: 'Cùng các công cụ đó trong đề cương môn học ở trường', cta: 'Mở bài' })}
</div>
`,
};
