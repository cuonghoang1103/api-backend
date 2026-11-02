/**
 * Bài 2.4 — Biểu mẫu (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/2-4; _demo/_t2/chay.mjs bấm form thật
 * gửi tới máy chủ Node thật và ghi lại request). Deck: scripts/slides-src/wf-2-4.mjs (11 slide, WF/v1/wf-2-4). Code Lab: module 2.4 (7 đề).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-2-4', 'Forms', 'Biểu mẫu', [
  [1, 'Forms',
    '<p>Forms are how the web collects information: logging in, searching, paying, leaving a comment. They are also where HTML, the network and the server meet for the first time. Today you will see exactly what a browser sends when someone presses Submit.</p>',
    '<p>Biểu mẫu là cách web thu thập thông tin: đăng nhập, tìm kiếm, thanh toán, để lại bình luận. Đây cũng là chỗ HTML, mạng và máy chủ gặp nhau lần đầu. Hôm nay bạn sẽ thấy chính xác trình duyệt gửi gì khi có người nhấn Submit.</p>'],
  [2, 'After this lesson you can…',
    '<p>Every outcome maps to a real failure: a field whose value never reaches the server, a Cancel button that submits the form, a label that does not focus its input, and browser validation mistaken for security. We reproduce each one on a real page.</p>',
    '<p>Mỗi kết quả ứng với một lỗi có thật: một ô có giá trị không bao giờ tới máy chủ, một nút Huỷ lại gửi form, một nhãn không đưa tiêu điểm vào ô, và kiểm tra của trình duyệt bị nhầm là bảo mật. Ta tái hiện từng lỗi trên một trang thật.</p>'],
  [3, 'The controls',
    '<p>One form with most of the common controls, as Chromium draws them. Every <code>input</code> looks and behaves differently depending on its <code>type</code>, and on a phone the right type also brings up the right keyboard. Below is everything this form would send, as one string.</p>',
    '<p>Một form với hầu hết điều khiển phổ biến, đúng như Chromium vẽ chúng. Mỗi <code>input</code> trông và cư xử khác nhau tuỳ <code>type</code>, và trên điện thoại, type đúng còn bật đúng bàn phím. Bên dưới là toàn bộ thứ form này sẽ gửi đi, trong một chuỗi.</p>'],
  [4, 'No name, no data',
    '<p>The form has five fields, but only two are in the data. The email has an <code>id</code> and no <code>name</code>, so it is not sent. An unchecked checkbox is not sent. A disabled field is not sent. And a checked checkbox with no value sends the word "on".</p>',
    '<p>Form có năm ô, nhưng dữ liệu chỉ có hai. Ô email có <code>id</code> mà không có <code>name</code>, nên không được gửi. Ô chọn chưa tick không được gửi. Ô bị vô hiệu hoá không được gửi. Và ô chọn đã tick mà thiếu value sẽ gửi chữ "on".</p>'],
  [5, 'What really reaches the server',
    '<p>Here a real browser clicked two real buttons, and a real Node server recorded what arrived. With GET the data is in the URL. With POST it is in the request body, encoded: the at-sign became %40, a space became a plus, the ampersand became %26.</p>',
    '<p>Ở đây một trình duyệt thật bấm hai nút thật, và một máy chủ Node thật ghi lại thứ nhận được. Với GET dữ liệu nằm trong URL. Với POST nó nằm trong phần thân request, đã mã hoá: dấu @ thành %40, dấu cách thành dấu cộng, dấu & thành %26.</p>'],
  [6, 'GET or POST?',
    '<p>GET is for asking: search, filters, anything you might bookmark or share. POST is for changing: signing up, paying, deleting. Passwords must never go in a URL, because URLs are saved in browser history and server logs.</p>',
    '<p>GET để hỏi: tìm kiếm, bộ lọc, những thứ bạn có thể đánh dấu hay chia sẻ. POST để thay đổi: đăng ký, thanh toán, xoá. Mật khẩu không bao giờ được nằm trong URL, vì URL được lưu trong lịch sử trình duyệt và nhật ký máy chủ.</p>'],
  [7, 'Labels',
    '<p>A label names a field for screen readers, and it makes the words clickable. Click a real label and focus jumps to the input; click a plain <code>span</code> and nothing happens. The second column of output shows the browser connecting them. On a phone that bigger target matters.</p>',
    '<p>Nhãn đặt tên cho ô với trình đọc màn hình, và làm dòng chữ bấm được. Bấm một nhãn thật, tiêu điểm nhảy vào ô; bấm một <code>span</code> thường thì chẳng có gì xảy ra. Output cho thấy trình duyệt nối chúng với nhau. Trên điện thoại, vùng bấm lớn hơn đó rất đáng giá.</p>'],
  [8, 'Built-in validation',
    '<p>The browser checks a lot for free. These are its real messages: required, email format, minimum number, a pattern. <code>checkValidity</code> tells you if the whole form may be sent. No JavaScript was written for any of the checks themselves.</p>',
    '<p>Trình duyệt kiểm rất nhiều thứ miễn phí. Đây là thông báo thật của nó: bắt buộc nhập, định dạng email, số tối thiểu, một mẫu. <code>checkValidity</code> cho biết cả form có được gửi không. Không dòng JavaScript nào được viết cho bản thân các phép kiểm này.</p>'],
  [9, 'A button submits by default',
    '<p>Inside a form, a <code>button</code> without a type is a submit button, as the output shows. This is why a Cancel button sends the form and reloads the page. Always write the type: <code>type="button"</code> for actions and <code>type="submit"</code> for sending.</p>',
    '<p>Trong form, <code>button</code> không có type là nút gửi, như output cho thấy. Đó là lý do nút Huỷ lại gửi form và tải lại trang. Luôn viết rõ type: <code>type="button"</code> cho hành động và <code>type="submit"</code> để gửi.</p>'],
  [10, 'Browser checks are not security',
    '<p>Validation in the browser is a convenience, not a lock. Anyone can skip it with DevTools or send a request with curl. The server must check everything again. Treat browser validation as good manners and server validation as the actual rule.</p>',
    '<p>Kiểm tra ở trình duyệt là sự tiện lợi, không phải ổ khoá. Ai cũng có thể bỏ qua nó bằng DevTools hoặc gửi request bằng curl. Máy chủ phải kiểm lại mọi thứ. Hãy coi kiểm tra ở trình duyệt là phép lịch sự, còn kiểm tra ở máy chủ mới là luật thật.</p>'],
  [11, 'Summary & practice',
    '<p>The practice is a sign-up form you can submit to a tiny local server. "Done when" means you can see every field in the server output, and the browser refuses bad input — both ends of the conversation.</p>',
    '<p>Bài luyện là một form đăng ký gửi được tới một máy chủ cục bộ tí hon. "Xong khi" nghĩa là bạn thấy mọi ô trong output của máy chủ, và trình duyệt từ chối dữ liệu sai — cả hai đầu của cuộc trò chuyện.</p>'],
]);

export default {
  title: '2.4 — Forms: how the web collects input|||2.4 — Biểu mẫu: cách web nhận dữ liệu',
  slug: 'wf-2-4-forms',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/fNcJuPIZ2WE', durationSeconds: 0 },
  description: 'Các điều khiển form, name quyết định cái gì được gửi (đo bằng FormData), trình duyệt thật gửi tới máy chủ thật (GET vào URL, POST vào body đã mã hoá), GET hay POST, label nối với input, kiểm tra hợp lệ có sẵn với thông báo thật, nút mặc định là submit, kiểm tra ở trình duyệt không phải bảo mật.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Forms: where HTML, the network and the server meet</h2>
<p class="lead">After this lesson you can build a complete form with the right controls, explain exactly which fields are sent and how they travel, choose between GET and POST, connect labels to inputs, use the browser's built-in validation, and avoid the classic traps: a field that silently vanishes, a Cancel button that submits. You need this because a form is how a web page sends information to a server. Login, search, checkout and comments are all forms, and the same data format reappears in Chapter 6 (HTTP) and Chapter 7 (auth).</p>

<h3>Step 1 — the structure of a form</h3>
<p>A <code>form</code> wraps a group of controls and says where to send them. Its two key attributes:</p>
<pre><code class="language-html">&lt;form action="/signup" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required&gt;
  &lt;button type="submit"&gt;Sign up&lt;/button&gt;
&lt;/form&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">action</span><span class="v">The URL that receives the data. Missing means the current page.</span></div>
  <div class="kv"><span class="k">method</span><span class="v"><code>get</code> (the default) or <code>post</code>.</span></div>
  <div class="kv"><span class="k">name</span><span class="v">The key the server receives. Without it the field is not sent.</span></div>
  <div class="kv"><span class="k">id</span><span class="v">Connects a <code>label</code>. Has nothing to do with sending.</span></div>
  <div class="kv"><span class="k">value</span><span class="v">The current content of the field.</span></div>
</div>

<h3>Step 2 — the controls</h3>
${ma('html', CODE['2-4/cac-o-nhap.html'], [6, 22])}
<p>All of these are in one form on slide 3. Asking the browser what it would send gives one string:</p>
${ra(OUT['2-4/cac-o-nhap'])}
<table>
<thead><tr><th>Control</th><th>Use for</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>text</code>, <code>textarea</code></td><td>Short and long text</td><td><code>textarea</code> has content, not <code>value</code></td></tr>
<tr><td><code>email</code>, <code>tel</code>, <code>url</code></td><td>Contact details</td><td>Mobile shows a matching keyboard; <code>email</code> is validated</td></tr>
<tr><td><code>password</code></td><td>Secrets</td><td>Hidden on screen only. It is <em>not</em> encrypted by this</td></tr>
<tr><td><code>number</code>, <code>range</code></td><td>Quantities</td><td>Not for phone numbers or card numbers: use <code>tel</code> or <code>text</code></td></tr>
<tr><td><code>date</code>, <code>time</code></td><td>Dates</td><td>A native picker. The value is always <code>YYYY-MM-DD</code></td></tr>
<tr><td><code>checkbox</code></td><td>Any number of yes/no choices</td><td>Each one is independent</td></tr>
<tr><td><code>radio</code></td><td>Exactly one of several</td><td>Group them with the same <code>name</code></td></tr>
<tr><td><code>select</code></td><td>One of many options</td><td><code>value</code> on <code>option</code> is what is sent</td></tr>
<tr><td><code>file</code></td><td>Uploads</td><td>Needs <code>method="post"</code> and <code>enctype="multipart/form-data"</code></td></tr>
<tr><td><code>hidden</code></td><td>Data the user does not edit</td><td>Still visible in View Source, so not secret</td></tr>
</tbody>
</table>
<p>Group related radio buttons or checkboxes with <code>fieldset</code> and <code>legend</code>, so that a screen reader says "Plan, Free, radio button 1 of 2".</p>

<h3>Step 3 — no <code>name</code>, no data</h3>
<p>This is the bug that makes beginners say "my server is broken". Five fields, and here is everything the browser would send:</p>
${ma('html', CODE['2-4/thieu-name.html'], [5, 11])}
${ra(OUT['2-4/thieu-name'])}
<ul>
<li><strong>The email is gone:</strong> it has an <code>id</code> but no <code>name</code>. Only <code>name</code> counts.</li>
<li><strong>newsletter is gone:</strong> an unchecked checkbox sends nothing at all. The server must treat "missing" as "no".</li>
<li><strong>agree = on:</strong> a checked box with no <code>value</code> sends the word <code>on</code>.</li>
<li><strong>city is gone:</strong> a <code>disabled</code> field is not sent. If you want it sent but not editable, use <code>readonly</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Trap — the field that silently vanishes.</strong> You see the value on screen, you press Submit, and the server says it is empty. There is no error anywhere. Open the Network tab, click the request, and read the payload: the field simply is not there. Nine times out of ten the <code>name</code> attribute is missing or does not match what the server expects, including its case: <code>Email</code> and <code>email</code> are different keys.</p></div>

<h3>Step 4 — what really reaches the server</h3>
<p>Time to watch a real submission. This page has two forms:</p>
${ma('html', CODE['2-4/gui-form.html'], [5, 17])}
<p>We had a real browser click both buttons, against a real Node server that records what arrives:</p>
${ra(OUT['_t2/out/form-may-chu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You press Submit</span><span class="lz-d">The browser runs validation and fires a <code>submit</code> event.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It collects the fields</span><span class="lz-d">Every enabled control with a <code>name</code> becomes one <code>name=value</code> pair.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It encodes them</span><span class="lz-d">Special characters are escaped: <code>@</code> → <code>%40</code>, space → <code>+</code>, <code>&amp;</code> → <code>%26</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It sends a request</span><span class="lz-d">GET puts them in the URL; POST puts them in the body.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">It loads the response</span><span class="lz-d">The page is replaced by the server's answer. Chapter 5 shows how to avoid this reload with <code>fetch</code>.</span></div>
</div>
<p>Look at the password in that output: <code>s3cret+%26+safe</code>. Without encoding, the <code>&amp;</code> inside the password would look like the start of a new field. This format is called <code>application/x-www-form-urlencoded</code>, and you will see it again in Lesson 6.4.</p>

<h3>Step 5 — GET or POST?</h3>
<table>
<thead><tr><th></th><th>GET</th><th>POST</th></tr></thead>
<tbody>
<tr><td>Data goes in</td><td>the URL</td><td>the request body</td></tr>
<tr><td>Purpose</td><td>Reading: search, filter</td><td>Changing: sign up, pay, delete</td></tr>
<tr><td>Bookmark / share</td><td>Yes: the URL holds everything</td><td>No</td></tr>
<tr><td>Reload</td><td>Safe to repeat</td><td>Browser warns: it would send again</td></tr>
<tr><td>Size</td><td>Limited by URL length</td><td>Large, including files</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — passwords in a URL.</strong> The default method is GET, so forgetting <code>method="post"</code> on a login form puts <code>?password=…</code> into the address. It is then saved in the browser history, in server logs, and possibly sent to other sites through the Referer header. POST does not encrypt anything either: that is HTTPS's job (Lesson 7.5). POST just keeps it out of URLs; you need both.</p></div>

<h3>Step 6 — every control needs a label</h3>
${ma('html', CODE['2-4/nhan-label.html'], [5, 7])}
${ra(OUT['2-4/nhan-label'])}
<p>Clicking the label moves focus to its input, and <code>labels</code> shows the connection the browser made. The <code>span</code> looks identical and does nothing. There are two correct ways: <code>for</code> pointing at an <code>id</code>, or wrapping the input inside the <code>label</code>. Labels make the text clickable, which matters on a phone, and they give the field its name in the accessibility tree.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a placeholder instead of a label.</strong> <code>placeholder</code> disappears the moment the user types, so they forget what the field was for; it has low contrast; and it is not a reliable name for assistive technology. Use it for an example, as in <code>placeholder="linh@example.com"</code>, and always keep a real label.</p></div>

<h3>Step 7 — validation the browser does for free</h3>
${ma('html', CODE['2-4/kiem-hop-le.html'], [5, 11])}
<p>Each attribute adds a rule. Here is the browser's verdict on each field, with its real messages:</p>
${ra(OUT['2-4/kiem-hop-le'])}
<div class="kv-grid">
  <div class="kv"><span class="k">required</span><span class="v">Must not be empty.</span></div>
  <div class="kv"><span class="k">type</span><span class="v"><code>email</code> and <code>url</code> check the format.</span></div>
  <div class="kv"><span class="k">min, max, step</span><span class="v">Range for numbers and dates.</span></div>
  <div class="kv"><span class="k">minlength, maxlength</span><span class="v">Length of text typed by the user.</span></div>
  <div class="kv"><span class="k">pattern</span><span class="v">A regular expression (Lesson 11.5). Add <code>title</code> to explain the format.</span></div>
</div>
<p>On Submit, the browser shows the first message in a bubble next to the field and blocks the request. CSS can react too, with <code>:invalid</code> and <code>:user-invalid</code>. You can disable all of it with <code>novalidate</code> on the form, when you show your own messages.</p>

<h3>Step 8 — a button in a form submits</h3>
${ma('html', CODE['2-4/nut-mac-dinh.html'], [5, 10])}
${ra(OUT['2-4/nut-mac-dinh'])}
<p>Button <code>a</code> has no <code>type</code> attribute, and yet its <code>type</code> property says <code>submit</code>: the demo's three clicks caused two submissions. <code>type="button"</code> is the only one that left the form alone.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the Cancel button that sends the form.</strong> You add <code>&lt;button&gt;Cancel&lt;/button&gt;</code> or an "Add row" button inside a form. Clicking it submits the form and reloads the page, and any JavaScript state is lost. Always write <code>type="button"</code> for anything that is not the main submit. Pressing Enter in a text field also clicks the first submit button.</p></div>

<h3>Step 9 — browser checks are not security</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Browser validation</span><span class="lz-t">a convenience</span><span class="lz-d">Fast feedback for honest users. Can be removed with DevTools, or skipped entirely with curl.</span></div>
<div class="lz-layer"><span class="lz-k">The network</span><span class="lz-t">anyone can send anything</span><span class="lz-d">A request does not have to come from your form at all.</span></div>
<div class="lz-layer"><span class="lz-k">Server validation</span><span class="lz-t">the real rule</span><span class="lz-d">Checks every field again on every request. Chapters 6–7.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting <code>maxlength</code> or <code>required</code>.</strong> Open DevTools, delete the <code>required</code> attribute, press Submit: the form goes through. So does <code>curl -d 'email=not-valid'</code>, with no browser involved. Remember Lesson 0.1: anything in the browser belongs to the visitor. If a rule matters, it must also be enforced on the server.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a sign-up form and a tiny server</strong></p>
<ol>
<li>Build <code>signup.html</code> with: name (text), email, password (minimum 8 characters), birthday, country (<code>select</code>), plan (two radios), a terms checkbox (<code>required</code>), and a submit button. Every field has a label.</li>
<li>Add a Clear button that does <em>not</em> submit (<code>type="reset"</code>).</li>
<li>Copy the server from Lesson 0.2 and make it serve your file, or just set <code>action="http://localhost:3000/signup"</code> and <code>method="post"</code>. In the server, print <code>req.method</code>, <code>req.url</code> and the body:</li>
</ol>
<pre><code class="language-javascript">let body = '';
req.on('data', (chunk) =&gt; (body += chunk));
req.on('end', () =&gt; console.log(req.method, req.url, body));</code></pre>
<p>Hint: if a field is missing from the printed body, check its <code>name</code>. Fix each field before moving on.</p>
<p><strong>Done when:</strong> your server prints a body containing all your fields with their <code>name</code>s (and <code>%40</code> in the email); submitting an empty form is blocked by the browser with its bubble; a 5-character password is refused; and <code>document.forms[0].checkValidity()</code> in the Console returns <code>true</code> only when everything is filled in. Then Code Lab module 2.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">form</span><span class="v">biểu mẫu — nhóm điều khiển gửi dữ liệu.</span></div>
  <div class="kv"><span class="k">control</span><span class="v">điều khiển — ô nhập, nút, danh sách chọn.</span></div>
  <div class="kv"><span class="k">action / method</span><span class="v">gửi tới đâu / bằng phương thức nào.</span></div>
  <div class="kv"><span class="k">name / value</span><span class="v">khoá / giá trị của một ô.</span></div>
  <div class="kv"><span class="k">submit</span><span class="v">gửi form.</span></div>
  <div class="kv"><span class="k">payload</span><span class="v">dữ liệu mang theo trong request.</span></div>
  <div class="kv"><span class="k">URL encoding</span><span class="v">mã hoá URL — @ thành %40, dấu cách thành +.</span></div>
  <div class="kv"><span class="k">label</span><span class="v">nhãn — tên của một ô, bấm được.</span></div>
  <div class="kv"><span class="k">placeholder</span><span class="v">chữ gợi ý — biến mất khi gõ.</span></div>
  <div class="kv"><span class="k">validation</span><span class="v">kiểm tra hợp lệ.</span></div>
  <div class="kv"><span class="k">client-side / server-side</span><span class="v">phía trình duyệt / phía máy chủ.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A form says where (<code>action</code>) and how (<code>method</code>); only enabled controls with a <code>name</code> are sent.</li>
  <li>Unchecked boxes and disabled fields send nothing; checked boxes without a value send <code>on</code>.</li>
  <li>GET puts data in the URL for reading; POST puts it in the body for changing. Passwords never go in a URL.</li>
  <li>Data is URL-encoded on the way out. Check it in the Network tab.</li>
  <li>Every control needs a <code>label</code>; a placeholder is not a label.</li>
  <li>Built-in validation is free: <code>required</code>, <code>type</code>, <code>min</code>, <code>pattern</code>.</li>
  <li>In a form, <code>button</code> means submit unless you write <code>type="button"</code>.</li>
  <li>Browser validation is a courtesy. The server must check everything again.</li>
</ul>
${nguon('📗', 'MDN — Web forms', 'Every control and attribute, with examples', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms')}
${nguon('📘', 'web.dev — Learn Forms', 'A free course on UX, validation and accessibility of forms', 'https://web.dev/learn/forms')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-html-form', title: 'WED201c (Academy) — HTML forms', sub: 'The same topic in the university syllabus', cta: 'Open lesson' })}
${lienKet({ khoa: 'react', bai: 'rx-3-1-controlled', title: 'React 3.1 — controlled inputs', sub: 'What changes when React owns the value of each field', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Biểu mẫu: nơi HTML, mạng và máy chủ gặp nhau</h2>
<p class="lead">Học xong bài này bạn dựng được một form hoàn chỉnh với đúng điều khiển, giải thích chính xác ô nào được gửi và chúng đi thế nào, chọn được giữa GET và POST, nối nhãn với ô nhập, dùng được kiểm tra hợp lệ có sẵn của trình duyệt, và tránh các bẫy kinh điển: ô dữ liệu biến mất âm thầm, nút Huỷ lại gửi form. Bạn cần điều này vì form là cách một trang web gửi thông tin lên máy chủ. Đăng nhập, tìm kiếm, thanh toán, bình luận đều là form, và cùng định dạng dữ liệu này xuất hiện lại ở Chương 6 (HTTP) và Chương 7 (xác thực).</p>

<h3>Bước 1 — cấu trúc một form</h3>
<p><code>form</code> bọc một nhóm điều khiển và nói gửi chúng đi đâu. Hai thuộc tính chính:</p>
<pre><code class="language-html">&lt;form action="/signup" method="post"&gt;
  &lt;label for="email"&gt;Email&lt;/label&gt;
  &lt;input id="email" name="email" type="email" required&gt;
  &lt;button type="submit"&gt;Đăng ký&lt;/button&gt;
&lt;/form&gt;</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">action</span><span class="v">URL nhận dữ liệu. Thiếu nghĩa là chính trang hiện tại.</span></div>
  <div class="kv"><span class="k">method</span><span class="v"><code>get</code> (mặc định) hoặc <code>post</code>.</span></div>
  <div class="kv"><span class="k">name</span><span class="v">Khoá mà máy chủ nhận. Thiếu nó thì ô không được gửi.</span></div>
  <div class="kv"><span class="k">id</span><span class="v">Để nối với <code>label</code>. Không liên quan gì tới việc gửi.</span></div>
  <div class="kv"><span class="k">value</span><span class="v">Nội dung hiện tại của ô.</span></div>
</div>

<h3>Bước 2 — các điều khiển</h3>
${ma('html', CODE['2-4/cac-o-nhap.html'], [6, 22])}
<p>Tất cả nằm trong một form ở slide 3. Hỏi trình duyệt nó sẽ gửi gì thì được một chuỗi:</p>
${ra(OUT['2-4/cac-o-nhap'])}
<table>
<thead><tr><th>Điều khiển</th><th>Dùng cho</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>text</code>, <code>textarea</code></td><td>Chữ ngắn và dài</td><td><code>textarea</code> có nội dung, không có <code>value</code></td></tr>
<tr><td><code>email</code>, <code>tel</code>, <code>url</code></td><td>Thông tin liên hệ</td><td>Di động hiện bàn phím phù hợp; <code>email</code> được kiểm tra</td></tr>
<tr><td><code>password</code></td><td>Bí mật</td><td>Chỉ che trên màn hình. Nó <em>không</em> mã hoá gì cả</td></tr>
<tr><td><code>number</code>, <code>range</code></td><td>Số lượng</td><td>Không dùng cho số điện thoại hay số thẻ: dùng <code>tel</code> hoặc <code>text</code></td></tr>
<tr><td><code>date</code>, <code>time</code></td><td>Ngày giờ</td><td>Bộ chọn có sẵn. Giá trị luôn là <code>YYYY-MM-DD</code></td></tr>
<tr><td><code>checkbox</code></td><td>Nhiều lựa chọn có/không</td><td>Mỗi ô độc lập</td></tr>
<tr><td><code>radio</code></td><td>Đúng một trong nhiều</td><td>Nhóm bằng cùng một <code>name</code></td></tr>
<tr><td><code>select</code></td><td>Một trong nhiều tuỳ chọn</td><td><code>value</code> của <code>option</code> là thứ được gửi</td></tr>
<tr><td><code>file</code></td><td>Tải tệp lên</td><td>Cần <code>method="post"</code> và <code>enctype="multipart/form-data"</code></td></tr>
<tr><td><code>hidden</code></td><td>Dữ liệu người dùng không sửa</td><td>Vẫn thấy được trong View Source, nên không bí mật</td></tr>
</tbody>
</table>
<p>Nhóm các radio hay checkbox liên quan bằng <code>fieldset</code> và <code>legend</code>, để trình đọc màn hình đọc "Gói, Miễn phí, nút radio 1 trên 2".</p>

<h3>Bước 3 — không có <code>name</code> thì không có dữ liệu</h3>
<p>Đây là lỗi khiến người mới nói "máy chủ mình hỏng rồi". Năm ô, và đây là toàn bộ thứ trình duyệt sẽ gửi:</p>
${ma('html', CODE['2-4/thieu-name.html'], [5, 11])}
${ra(OUT['2-4/thieu-name'])}
<ul>
<li><strong>Mất email:</strong> nó có <code>id</code> nhưng không có <code>name</code>. Chỉ <code>name</code> mới tính.</li>
<li><strong>Mất newsletter:</strong> ô chọn chưa tick không gửi gì cả. Máy chủ phải coi "thiếu" là "không".</li>
<li><strong>agree = on:</strong> ô đã tick mà không có <code>value</code> sẽ gửi chữ <code>on</code>.</li>
<li><strong>Mất city:</strong> ô <code>disabled</code> không được gửi. Muốn gửi mà không cho sửa thì dùng <code>readonly</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — ô dữ liệu biến mất âm thầm.</strong> Bạn thấy giá trị trên màn hình, nhấn Gửi, và máy chủ báo rỗng. Không có lỗi ở đâu cả. Mở thẻ Network, bấm vào request, đọc payload: ô đó đơn giản là không có ở đấy. Chín trên mười lần là thiếu thuộc tính <code>name</code> hoặc nó không khớp thứ máy chủ chờ, kể cả hoa thường: <code>Email</code> và <code>email</code> là hai khoá khác nhau.</p></div>

<h3>Bước 4 — thứ thật sự tới máy chủ</h3>
<p>Đã đến lúc xem một lần gửi thật. Trang này có hai form:</p>
${ma('html', CODE['2-4/gui-form.html'], [5, 17])}
<p>Ta cho một trình duyệt thật bấm cả hai nút, tới một máy chủ Node thật ghi lại thứ nhận được:</p>
${ra(OUT['_t2/out/form-may-chu'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn nhấn Gửi</span><span class="lz-d">Trình duyệt chạy kiểm tra hợp lệ và phát sự kiện <code>submit</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó gom các ô</span><span class="lz-d">Mỗi điều khiển đang bật có <code>name</code> thành một cặp <code>name=value</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó mã hoá</span><span class="lz-d">Ký tự đặc biệt được thoát: <code>@</code> → <code>%40</code>, dấu cách → <code>+</code>, <code>&amp;</code> → <code>%26</code>.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó gửi request</span><span class="lz-d">GET đặt chúng vào URL; POST đặt chúng vào phần thân.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nó tải response</span><span class="lz-d">Trang được thay bằng câu trả lời của máy chủ. Chương 5 chỉ cách tránh tải lại bằng <code>fetch</code>.</span></div>
</div>
<p>Nhìn mật khẩu trong output: <code>s3cret+%26+safe</code>. Nếu không mã hoá, dấu <code>&amp;</code> trong mật khẩu sẽ trông như bắt đầu một ô mới. Định dạng này gọi là <code>application/x-www-form-urlencoded</code>, và bạn sẽ gặp lại ở Bài 6.4.</p>

<h3>Bước 5 — GET hay POST?</h3>
<table>
<thead><tr><th></th><th>GET</th><th>POST</th></tr></thead>
<tbody>
<tr><td>Dữ liệu nằm ở</td><td>URL</td><td>phần thân request</td></tr>
<tr><td>Mục đích</td><td>Đọc: tìm kiếm, lọc</td><td>Thay đổi: đăng ký, trả tiền, xoá</td></tr>
<tr><td>Đánh dấu / chia sẻ</td><td>Được: URL chứa đủ mọi thứ</td><td>Không</td></tr>
<tr><td>Tải lại</td><td>Lặp lại an toàn</td><td>Trình duyệt cảnh báo: sẽ gửi lần nữa</td></tr>
<tr><td>Kích thước</td><td>Giới hạn theo độ dài URL</td><td>Lớn, gồm cả tệp</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — mật khẩu trong URL.</strong> Method mặc định là GET, nên quên <code>method="post"</code> ở form đăng nhập sẽ đặt <code>?password=…</code> lên thanh địa chỉ. Nó được lưu vào lịch sử trình duyệt, nhật ký máy chủ, và có thể gửi sang trang khác qua header Referer. POST cũng chẳng mã hoá gì: đó là việc của HTTPS (Bài 7.5). POST chỉ giữ nó khỏi URL; bạn cần cả hai.</p></div>

<h3>Bước 6 — điều khiển nào cũng cần nhãn</h3>
${ma('html', CODE['2-4/nhan-label.html'], [5, 7])}
${ra(OUT['2-4/nhan-label'])}
<p>Bấm nhãn đưa tiêu điểm vào ô, và <code>labels</code> cho thấy mối nối trình duyệt đã tạo. <code>span</code> trông y hệt mà chẳng làm gì. Có hai cách đúng: <code>for</code> trỏ tới một <code>id</code>, hoặc đặt ô nhập bên trong <code>label</code>. Nhãn làm dòng chữ bấm được, rất có ích trên điện thoại, và cho ô một cái tên trong cây trợ năng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng placeholder thay nhãn.</strong> <code>placeholder</code> biến mất ngay khi gõ, nên người dùng quên ô đó để làm gì; nó có độ tương phản thấp; và không phải là tên đáng tin cậy với công nghệ hỗ trợ. Hãy dùng nó cho ví dụ, như <code>placeholder="linh@example.com"</code>, và luôn giữ một nhãn thật.</p></div>

<h3>Bước 7 — kiểm tra hợp lệ miễn phí của trình duyệt</h3>
${ma('html', CODE['2-4/kiem-hop-le.html'], [5, 11])}
<p>Mỗi thuộc tính thêm một luật. Đây là phán quyết của trình duyệt về từng ô, với thông báo thật:</p>
${ra(OUT['2-4/kiem-hop-le'])}
<div class="kv-grid">
  <div class="kv"><span class="k">required</span><span class="v">Không được để trống.</span></div>
  <div class="kv"><span class="k">type</span><span class="v"><code>email</code> và <code>url</code> kiểm định dạng.</span></div>
  <div class="kv"><span class="k">min, max, step</span><span class="v">Khoảng cho số và ngày.</span></div>
  <div class="kv"><span class="k">minlength, maxlength</span><span class="v">Độ dài chữ người dùng gõ.</span></div>
  <div class="kv"><span class="k">pattern</span><span class="v">Một biểu thức chính quy (Bài 11.5). Thêm <code>title</code> để giải thích định dạng.</span></div>
</div>
<p>Khi Gửi, trình duyệt hiện thông báo đầu tiên trong một bong bóng cạnh ô và chặn request. CSS cũng phản ứng được, với <code>:invalid</code> và <code>:user-invalid</code>. Bạn tắt được tất cả bằng <code>novalidate</code> trên form, khi muốn tự hiện thông báo.</p>

<h3>Bước 8 — nút trong form sẽ gửi form</h3>
${ma('html', CODE['2-4/nut-mac-dinh.html'], [5, 10])}
${ra(OUT['2-4/nut-mac-dinh'])}
<p>Nút <code>a</code> không có thuộc tính <code>type</code>, vậy mà property <code>type</code> của nó vẫn là <code>submit</code>: ba cú bấm của demo gây ra hai lần gửi. <code>type="button"</code> là nút duy nhất để yên cho form.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nút Huỷ lại gửi form.</strong> Bạn thêm <code>&lt;button&gt;Huỷ&lt;/button&gt;</code> hay nút "Thêm dòng" vào trong form. Bấm nó sẽ gửi form và tải lại trang, mọi trạng thái JavaScript mất sạch. Luôn viết <code>type="button"</code> cho mọi thứ không phải nút gửi chính. Nhấn Enter trong ô chữ cũng bấm nút gửi đầu tiên.</p></div>

<h3>Bước 9 — kiểm tra ở trình duyệt không phải bảo mật</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Kiểm tra ở trình duyệt</span><span class="lz-t">sự tiện lợi</span><span class="lz-d">Phản hồi nhanh cho người dùng thật thà. Gỡ được bằng DevTools, hoặc bỏ qua hẳn bằng curl.</span></div>
<div class="lz-layer"><span class="lz-k">Mạng</span><span class="lz-t">ai cũng gửi được bất cứ gì</span><span class="lz-d">Một request không nhất thiết phải đến từ form của bạn.</span></div>
<div class="lz-layer"><span class="lz-k">Kiểm tra ở máy chủ</span><span class="lz-t">luật thật</span><span class="lz-d">Kiểm lại mọi ô ở mọi request. Chương 6–7.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin vào <code>maxlength</code> hay <code>required</code>.</strong> Mở DevTools, xoá thuộc tính <code>required</code>, nhấn Gửi: form đi qua. <code>curl -d 'email=not-valid'</code> cũng vậy, chẳng cần trình duyệt. Hãy nhớ Bài 0.1: mọi thứ trong trình duyệt thuộc về người xem. Luật nào quan trọng thì phải được thực thi cả ở máy chủ.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — form đăng ký và một máy chủ tí hon</strong></p>
<ol>
<li>Dựng <code>signup.html</code> gồm: tên (text), email, mật khẩu (tối thiểu 8 ký tự), ngày sinh, quốc gia (<code>select</code>), gói (hai radio), ô đồng ý điều khoản (<code>required</code>), và nút gửi. Ô nào cũng có nhãn.</li>
<li>Thêm một nút Xoá trắng <em>không</em> gửi form (<code>type="reset"</code>).</li>
<li>Chép máy chủ ở Bài 0.2 và cho nó phục vụ tệp của bạn, hoặc đơn giản đặt <code>action="http://localhost:3000/signup"</code> và <code>method="post"</code>. Trong máy chủ, in <code>req.method</code>, <code>req.url</code> và phần thân:</li>
</ol>
<pre><code class="language-javascript">let body = '';
req.on('data', (chunk) =&gt; (body += chunk));
req.on('end', () =&gt; console.log(req.method, req.url, body));</code></pre>
<p>Gợi ý: nếu một ô thiếu trong phần thân in ra, hãy kiểm <code>name</code> của nó. Sửa từng ô trước khi đi tiếp.</p>
<p><strong>Xong khi:</strong> máy chủ in ra phần thân có đủ mọi ô với <code>name</code> của chúng (và <code>%40</code> trong email); gửi form trống bị trình duyệt chặn bằng bong bóng; mật khẩu 5 ký tự bị từ chối; và <code>document.forms[0].checkValidity()</code> trong Console chỉ trả <code>true</code> khi mọi thứ đã điền. Sau đó làm module Code Lab 2.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">form</span><span class="v">biểu mẫu — nhóm điều khiển gửi dữ liệu.</span></div>
  <div class="kv"><span class="k">control</span><span class="v">điều khiển — ô nhập, nút, danh sách chọn.</span></div>
  <div class="kv"><span class="k">action / method</span><span class="v">gửi tới đâu / bằng phương thức nào.</span></div>
  <div class="kv"><span class="k">name / value</span><span class="v">khoá / giá trị của một ô.</span></div>
  <div class="kv"><span class="k">submit</span><span class="v">gửi form.</span></div>
  <div class="kv"><span class="k">payload</span><span class="v">dữ liệu mang theo trong request.</span></div>
  <div class="kv"><span class="k">URL encoding</span><span class="v">mã hoá URL — @ thành %40, dấu cách thành +.</span></div>
  <div class="kv"><span class="k">label</span><span class="v">nhãn — tên của một ô, bấm được.</span></div>
  <div class="kv"><span class="k">placeholder</span><span class="v">chữ gợi ý — biến mất khi gõ.</span></div>
  <div class="kv"><span class="k">validation</span><span class="v">kiểm tra hợp lệ.</span></div>
  <div class="kv"><span class="k">client-side / server-side</span><span class="v">phía trình duyệt / phía máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Form nói gửi đi đâu (<code>action</code>) và thế nào (<code>method</code>); chỉ điều khiển đang bật có <code>name</code> mới được gửi.</li>
  <li>Ô chưa tick và ô bị vô hiệu hoá không gửi gì; ô tick mà thiếu value gửi <code>on</code>.</li>
  <li>GET đặt dữ liệu vào URL để đọc; POST đặt vào phần thân để thay đổi. Mật khẩu không bao giờ nằm trong URL.</li>
  <li>Dữ liệu được mã hoá URL trên đường đi. Kiểm trong thẻ Network.</li>
  <li>Điều khiển nào cũng cần <code>label</code>; placeholder không phải nhãn.</li>
  <li>Kiểm tra hợp lệ có sẵn miễn phí: <code>required</code>, <code>type</code>, <code>min</code>, <code>pattern</code>.</li>
  <li>Trong form, <code>button</code> nghĩa là gửi, trừ khi viết <code>type="button"</code>.</li>
  <li>Kiểm tra ở trình duyệt là phép lịch sự. Máy chủ phải kiểm lại mọi thứ.</li>
</ul>
${nguon('📗', 'MDN — Web forms', 'Mọi điều khiển và thuộc tính, kèm ví dụ', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms')}
${nguon('📘', 'web.dev — Learn Forms', 'Khoá miễn phí về trải nghiệm, kiểm tra hợp lệ và khả năng tiếp cận của form', 'https://web.dev/learn/forms')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-html-form', title: 'WED201c (Academy) — Biểu mẫu HTML', sub: 'Cùng chủ đề trong đề cương môn học ở trường', cta: 'Mở bài' })}
${lienKet({ khoa: 'react', bai: 'rx-3-1-controlled', title: 'React 3.1 — ô nhập có kiểm soát', sub: 'Điều gì đổi khi React sở hữu giá trị của từng ô', cta: 'Mở bài' })}
</div>
`,
};
