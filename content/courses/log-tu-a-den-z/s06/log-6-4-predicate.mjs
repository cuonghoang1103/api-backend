/**
 * 6.4 — Predicate: process, subsystem, eventMessage CONTAINS, messageType (soạn 25/11/2026, agent Mac tiếp quản lgz).
 * Output thật: OUT['s06/predicate'] trên log của shopmac/motep (bài 6.1–6.2) + OUT['s06/lab6'] (khoá/mở màn hình, pmset) — macOS 27.2.1, đã ẩn danh.
 * Nguồn: `log help predicates`, `log help shorthand` (in trong bài), Apple "Predicate Format String Syntax".
 * Đo thật: CONTAINS trên cả kho 3 giờ mất 24,9 s; thêm process == "loginwindow" phía trước còn 2,3 s.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '6.4 — Predicates: process, subsystem, eventMessage CONTAINS, messageType|||6.4 — Predicate: process, subsystem, eventMessage CONTAINS, messageType',
  slug: 'log-6-4-predicate',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ngôn ngữ lọc NSPredicate của lệnh log trên dữ liệu thật: trường (process, subsystem, category, messageType, eventMessage, senderImagePath, processImagePath…), toán tử ==, CONTAINS, BEGINSWITH, ENDSWITH, MATCHES, IN, phân biệt hoa thường [c] và dấu [cd] (tìm "het thoi gian" ra "Hết thời gian"), AND/OR/NOT, dạng viết tắt p=…/type>=error, lỗi "no such field" khi quên ngoặc kép, cái bẫy lệnh log tự ghi câu truy vấn của bạn vào log; tốc độ đo thật (24,9 s ⇒ 2,3 s khi lọc process trước) và công thức hay dùng: lỗi của một ứng dụng, mọi Fatal error của Swift, khoá/mở màn hình, sudo, ngủ/thức (kèm pmset -g log).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Predicates: asking the unified log precise questions</h2>
<p class="lead">A predicate is the <code>WHERE</code> clause of <code>log show</code>, <code>log stream</code> and Console. It uses Apple's NSPredicate syntax — the same one Swift and Objective-C use to filter arrays. Learn a dozen fields and seven operators and you can answer most questions in one command, fast.</p>

<h3>The everyday picture: filters in a shopping app</h3>
<p>"Shoes, size 42, black or brown, under 1 million, not second-hand." Each part narrows the list; the shop does the filtering on its server instead of sending you every product. A predicate is that filter for log lines, applied inside <code>log</code> before anything reaches your terminal.</p>

<h3>The fields you will use</h3>
<div class="table-wrap"><table>
<thead><tr><th>Field</th><th>Example value</th><th>Use</th></tr></thead>
<tbody>
<tr><td><code>process</code></td><td><code>"loginwindow"</code></td><td>Name of the process (attested by the system)</td></tr>
<tr><td><code>processImagePath</code></td><td><code>"/usr/bin/logger"</code></td><td>Full path of the binary — tells a fake from the real one</td></tr>
<tr><td><code>processIdentifier</code></td><td><code>24303</code></td><td>PID</td></tr>
<tr><td><code>subsystem</code>, <code>category</code></td><td><code>"com.example.shopmac"</code>, <code>"db"</code></td><td>Component and part (6.1)</td></tr>
<tr><td><code>messageType</code></td><td><code>error</code>, <code>fault</code>, <code>default</code>, <code>info</code>, <code>debug</code></td><td>Level; supports <code>&gt;=</code></td></tr>
<tr><td><code>eventMessage</code> (also <code>composedMessage</code>)</td><td><code>"Fatal error"</code></td><td>The text</td></tr>
<tr><td><code>senderImagePath</code></td><td><code>…/libswiftCore.dylib</code></td><td>Library that wrote the line</td></tr>
<tr><td><code>eventType</code></td><td><code>logEvent</code>, <code>timesyncEvent</code>, <code>activityCreateEvent</code></td><td>Kind of event</td></tr>
<tr><td><code>formatString</code></td><td><code>"Token = %{private,mask.hash}s"</code></td><td>The template — matches even when values are &lt;private&gt;</td></tr>
</tbody></table></div>
<p>The full list is printed by <code>log help predicates</code> on your Mac — it is short; read it once.</p>

<h3>Step 1 — equality and AND</h3>
${lenh('s06/predicate', 0)}
<p>Strings in double quotes, the whole predicate in single quotes so the shell leaves it alone. <code>==</code> and <code>=</code> are the same; <code>AND</code>/<code>and</code>/<code>&amp;&amp;</code> too:</p>
${lenh('s06/predicate', 10)}
<p>That one even worked with an unquoted <code>db</code>, but do not rely on it — an unquoted value with dots is read as a <em>field name</em>:</p>
${lenh('s06/predicate', 11)}

<h3>Step 2 — levels: messageType and the shorthand</h3>
${lenh('s06/predicate', 1)}
${lenh('s06/predicate', 2)}
<p><code>messageType &gt;= error</code> = error and fault. The second command is the <strong>shorthand</strong> (<code>log help shorthand</code>): <code>p</code> = process, <code>s</code> = subsystem, <code>c</code> = category, <code>m</code> = message, <code>type</code>; <code>:</code> means contains, <code>:^</code> starts with, <code>~/…</code> regex, <code>|</code> OR between values. Handy at the keyboard; in scripts and documentation use the full form, which everyone can read.</p>

<h3>Step 3 — text: CONTAINS, case and diacritics</h3>
${lenh('s06/predicate', 3)}
${lenh('s06/predicate', 4)}
${lenh('s06/predicate', 5)}
<p>NSPredicate is <strong>case-sensitive by default</strong>: <code>"csdl"</code> finds nothing, the message says "CSDL". <code>[c]</code> ignores case, <code>[d]</code> ignores diacritics, <code>[cd]</code> both — so <code>"het thoi gian"</code> matches "Hết thời gian". Very useful with Vietnamese or French messages. (journalctl's <code>-g</code> uses "smart case" instead — lesson 7.2.)</p>

<h3>Step 4 — the search that finds itself</h3>
${lenh('s06/predicate', 6)}
<p>Searching the whole store for "csdl" (with no other field) returned only… <strong>our own searches</strong>. The <code>log</code> tool records each run: <code>log run noninteractively, parent: … (zsh), args: …</code> — the full query, including the earlier one with <code>/usr/bin/log</code>. Two lessons: (1) narrow by process or subsystem, or your search matches its own trace; (2) an investigator's queries leave a trail on the machine — on a suspect's Mac, collect first (6.3) and analyse the archive on your own machine. Lesson 6.5 shows the trail from the attacker's side.</p>

<h3>Step 5 — prefix, sets, NOT, regex, library</h3>
${lenh('s06/predicate', 7)}
${lenh('s06/predicate', 8)}
${lenh('s06/predicate', 9)}
<ul>
<li><code>BEGINSWITH</code> / <code>ENDSWITH</code> — every subsystem of your company: <code>subsystem BEGINSWITH "com.example."</code>.</li>
<li><code>IN {"a", "b"}</code> — a set; <code>NOT</code> negates. Parentheses group: <code>A AND (B OR C)</code>.</li>
<li><code>MATCHES</code> — a regular expression that must match the <strong>whole</strong> string (hence <code>.*</code> at both ends). <code>LIKE</code> is a simpler wildcard (<code>*</code>, <code>?</code>).</li>
<li><code>senderImagePath ENDSWITH "libswiftCore.dylib" AND eventMessage CONTAINS "Fatal error"</code> = <strong>every Swift crash message on the machine</strong>, whatever the app is called. The same idea finds Objective-C exceptions (<code>libobjc</code>) or messages from one framework.</li>
</ul>

<h3>Step 6 — speed: put the cheap field first</h3>
${lenh('s06/predicate', 12)}
${lenh('s06/predicate', 13)}
<p>Same question, three hours of history: <strong>24.9 s</strong> with only <code>eventMessage CONTAINS</code>, <strong>2.3 s</strong> when <code>process == "loginwindow"</code> comes first — about 10× faster. (<code>wc -l</code> counts the header line too: 4 matches versus 0. No lock happened in those three hours; the four lines were <code>log run …</code> traces of our own queries containing "screenIsLocked" (this one included) — step 4 again.) Rule: filter by process / subsystem / time first, text last.</p>

<h3>Recipes you will reuse</h3>
<div class="table-wrap"><table>
<thead><tr><th>Question</th><th>Predicate / command</th></tr></thead>
<tbody>
<tr><td>All errors of my app</td><td><code>subsystem == "com.example.app" AND messageType &gt;= error</code></td></tr>
<tr><td>Every Swift crash message</td><td><code>senderImagePath ENDSWITH "libswiftCore.dylib" AND eventMessage CONTAINS "Fatal error"</code></td></tr>
<tr><td>Screen locked / unlocked</td><td><code>process == "loginwindow" AND eventMessage CONTAINS "sendDistributedNotification: com.apple.screenIs"</code></td></tr>
<tr><td>Who used sudo</td><td><code>process == "sudo"</code> (lesson 6.5)</td></tr>
<tr><td>Why the Mac went to sleep</td><td><code>process == "powerd" AND eventMessage BEGINSWITH "Entering Sleep"</code> + <code>pmset -g log</code></td></tr>
<tr><td>Clock changed</td><td><code>eventType == timesyncEvent</code></td></tr>
<tr><td>Privacy prompts</td><td><code>subsystem == "com.apple.TCC" AND eventMessage BEGINSWITH "AUTHREQ_"</code> (6.5)</td></tr>
<tr><td>Wi-Fi changes</td><td><code>subsystem == "com.apple.wifi"</code> — careful: network names are personal data</td></tr>
</tbody></table></div>
<p>Screen lock/unlock over seven days, tidied with <code>grep -o</code> + <code>paste</code>:</p>
${lenh('s06/lab6', 3)}
<p>Sleep and wake have their own long-lived log, outside the unified log, in <code>/var/log/powermanagement</code>, read with <code>pmset -g log</code>:</p>
${lenh('s06/lab6', 1)}
${lenh('s06/lab6', 2)}
<p>"DarkWake" = the Mac woke up without turning on the screen (maintenance, network, Power Nap); "Wake … due to UserActivity" = someone opened the lid or touched a key. The Lab joins these into a timeline.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"The company VPN drops every morning."</strong> <code>subsystem BEGINSWITH "com.vendor" AND messageType &gt;= error</code> over a week, then <code>pmset -g log</code> for the same minutes — often it is a sleep/DarkWake.</li>
<li><strong>Your Swift/Electron app's QA build crashes sometimes.</strong> Save the "every Swift crash" predicate in Console (Save button) for the team.</li>
<li><strong>A security review asks "when was this Mac unlocked last week?"</strong> The lock/unlock recipe — plus <code>last</code> for logins (6.5).</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>Write a predicate for errors and faults of <code>com.example.shopmac</code> in category <code>db</code> only, in full form and in shorthand.</li>
<li>Find messages containing "thoi gian" regardless of case and diacritics.</li>
<li>Measure the time of a text-only search versus the same search with a process filter, over 1 hour, on your Mac.</li>
<li>List your own lock/unlock times for the last 3 days.</li>
</ol>
<p><strong>Done when:</strong> 1 returns only the db lines with E/F; 2 uses <code>CONTAINS[cd]</code>; 3 shows a clear speed-up; 4 prints pairs of time + screenIsLocked/Unlocked.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['predicate', 'NSPredicate filter applied inside log/Console before output.'],
  ['CONTAINS[c] / [d] / [cd]', 'Ignore case / diacritics / both.'],
  ['BEGINSWITH, ENDSWITH, IN, NOT', 'Prefix, suffix, set, negation.'],
  ['MATCHES', 'Regular expression on the whole string.'],
  ['shorthand', 'p=, s=, c=, type>=, : (contains) — quick typing, see log help shorthand.'],
  ['senderImagePath', 'The library that wrote the line — finds runtime messages of any app.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Quote strings; an unquoted dotted value is read as a field name.</li>
<li>Case-sensitive by default — add <code>[c]</code> or <code>[cd]</code>.</li>
<li>Cheap fields first: process/subsystem then text — 10× faster in our test.</li>
<li><code>log</code> logs your queries; narrow searches so they do not find themselves.</li>
</ul>
${nguon('📘', 'Apple — Predicate Format String Syntax', 'Operators, [c][d], MATCHES, IN', 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Predicates/Articles/pSyntax.html')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-2-journalctl-loc', title: 'Lesson 7.2 — journalctl filters', sub: 'AND/OR rules and -g on Linux', cta: 'Open lesson' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-2-filterhashtable', title: 'Lesson 5.2 — FilterHashtable', sub: 'The Windows way to filter at the source', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Predicate: hỏi unified log những câu thật chính xác</h2>
<p class="lead">Predicate là mệnh đề <code>WHERE</code> của <code>log show</code>, <code>log stream</code> và Console. Nó dùng cú pháp NSPredicate của Apple — đúng cú pháp Swift và Objective-C dùng để lọc mảng. Học khoảng chục trường và bảy toán tử là bạn trả lời được phần lớn câu hỏi trong một lệnh, mà nhanh.</p>

<h3>Liên tưởng đời thường: bộ lọc trong ứng dụng mua sắm</h3>
<p>"Giày, cỡ 42, đen hoặc nâu, dưới 1 triệu, không phải hàng cũ." Mỗi vế thu hẹp danh sách; cửa hàng lọc ngay trên máy chủ của họ thay vì gửi cho bạn mọi sản phẩm. Predicate là bộ lọc đó cho các dòng log, áp bên trong <code>log</code> trước khi có gì tới được terminal.</p>

<h3>Các trường sẽ dùng</h3>
<div class="table-wrap"><table>
<thead><tr><th>Trường</th><th>Giá trị ví dụ</th><th>Dùng để</th></tr></thead>
<tbody>
<tr><td><code>process</code></td><td><code>"loginwindow"</code></td><td>Tên tiến trình (hệ thống xác nhận)</td></tr>
<tr><td><code>processImagePath</code></td><td><code>"/usr/bin/logger"</code></td><td>Đường dẫn đầy đủ của tệp chạy — phân biệt hàng giả với hàng thật</td></tr>
<tr><td><code>processIdentifier</code></td><td><code>24303</code></td><td>PID</td></tr>
<tr><td><code>subsystem</code>, <code>category</code></td><td><code>"com.example.shopmac"</code>, <code>"db"</code></td><td>Thành phần và phần bên trong (6.1)</td></tr>
<tr><td><code>messageType</code></td><td><code>error</code>, <code>fault</code>, <code>default</code>, <code>info</code>, <code>debug</code></td><td>Mức; hỗ trợ <code>&gt;=</code></td></tr>
<tr><td><code>eventMessage</code> (còn có <code>composedMessage</code>)</td><td><code>"Fatal error"</code></td><td>Nội dung chữ</td></tr>
<tr><td><code>senderImagePath</code></td><td><code>…/libswiftCore.dylib</code></td><td>Thư viện đã viết dòng đó</td></tr>
<tr><td><code>eventType</code></td><td><code>logEvent</code>, <code>timesyncEvent</code>, <code>activityCreateEvent</code></td><td>Loại sự kiện</td></tr>
<tr><td><code>formatString</code></td><td><code>"Token = %{private,mask.hash}s"</code></td><td>Khuôn — khớp được cả khi giá trị là &lt;private&gt;</td></tr>
</tbody></table></div>
<p>Danh sách đầy đủ do <code>log help predicates</code> in ra trên máy bạn — ngắn thôi; đọc một lần.</p>

<h3>Bước 1 — bằng nhau và VÀ</h3>
${lenh('s06/predicate', 0)}
<p>Chuỗi đặt trong ngoặc kép, cả predicate đặt trong ngoặc đơn để shell không đụng vào. <code>==</code> và <code>=</code> như nhau; <code>AND</code>/<code>and</code>/<code>&amp;&amp;</code> cũng vậy:</p>
${lenh('s06/predicate', 10)}
<p>Lệnh đó chạy được cả với <code>db</code> không ngoặc kép, nhưng đừng dựa vào điều này — một giá trị không ngoặc kép có dấu chấm bị đọc thành <em>tên trường</em>:</p>
${lenh('s06/predicate', 11)}

<h3>Bước 2 — mức: messageType và dạng viết tắt</h3>
${lenh('s06/predicate', 1)}
${lenh('s06/predicate', 2)}
<p><code>messageType &gt;= error</code> = error và fault. Lệnh thứ hai là <strong>dạng viết tắt</strong> (<code>log help shorthand</code>): <code>p</code> = process, <code>s</code> = subsystem, <code>c</code> = category, <code>m</code> = message, <code>type</code>; <code>:</code> là chứa, <code>:^</code> là bắt đầu bằng, <code>~/…</code> là regex, <code>|</code> là HOẶC giữa các giá trị. Tiện khi gõ tay; trong script và tài liệu dùng dạng đầy đủ, ai đọc cũng hiểu.</p>

<h3>Bước 3 — chữ: CONTAINS, hoa thường và dấu</h3>
${lenh('s06/predicate', 3)}
${lenh('s06/predicate', 4)}
${lenh('s06/predicate', 5)}
<p>NSPredicate <strong>mặc định phân biệt hoa thường</strong>: <code>"csdl"</code> không ra gì, thông điệp viết "CSDL". <code>[c]</code> bỏ qua hoa thường, <code>[d]</code> bỏ qua dấu, <code>[cd]</code> cả hai — nên <code>"het thoi gian"</code> khớp "Hết thời gian". Rất có ích với thông điệp tiếng Việt hay tiếng Pháp. (<code>-g</code> của journalctl thì dùng "smart case" — bài 7.2.)</p>

<h3>Bước 4 — câu tìm kiếm tìm ra chính nó</h3>
${lenh('s06/predicate', 6)}
<p>Tìm "csdl" trên cả kho (không kèm trường nào khác) chỉ trả về… <strong>chính các lần tìm của chúng ta</strong>. Công cụ <code>log</code> ghi lại mỗi lần chạy: <code>log run noninteractively, parent: … (zsh), args: …</code> — nguyên câu truy vấn, kể cả lần trước gõ <code>/usr/bin/log</code>. Hai bài học: (1) thu hẹp theo process hay subsystem, không thì câu tìm khớp với dấu vết của chính nó; (2) câu truy vấn của người điều tra để lại dấu vết trên máy — với máy Mac bị nghi ngờ, thu log trước (6.3) rồi phân tích bản lưu trên máy của mình. Bài 6.5 nhìn dấu vết này từ phía kẻ tấn công.</p>

<h3>Bước 5 — tiền tố, tập hợp, NOT, regex, thư viện</h3>
${lenh('s06/predicate', 7)}
${lenh('s06/predicate', 8)}
${lenh('s06/predicate', 9)}
<ul>
<li><code>BEGINSWITH</code> / <code>ENDSWITH</code> — mọi subsystem của công ty bạn: <code>subsystem BEGINSWITH "com.example."</code>.</li>
<li><code>IN {"a", "b"}</code> — một tập hợp; <code>NOT</code> phủ định. Ngoặc tròn để nhóm: <code>A AND (B OR C)</code>.</li>
<li><code>MATCHES</code> — biểu thức chính quy phải khớp <strong>cả</strong> chuỗi (vì thế có <code>.*</code> ở hai đầu). <code>LIKE</code> là ký tự đại diện đơn giản hơn (<code>*</code>, <code>?</code>).</li>
<li><code>senderImagePath ENDSWITH "libswiftCore.dylib" AND eventMessage CONTAINS "Fatal error"</code> = <strong>mọi thông điệp văng của Swift trên máy</strong>, ứng dụng tên gì cũng được. Cùng ý đó tìm được ngoại lệ Objective-C (<code>libobjc</code>) hay thông điệp của một framework.</li>
</ul>

<h3>Bước 6 — tốc độ: đặt trường rẻ lên trước</h3>
${lenh('s06/predicate', 12)}
${lenh('s06/predicate', 13)}
<p>Cùng câu hỏi, ba giờ lịch sử: <strong>24,9 s</strong> khi chỉ có <code>eventMessage CONTAINS</code>, <strong>2,3 s</strong> khi <code>process == "loginwindow"</code> đứng trước — nhanh hơn khoảng 10 lần. (<code>wc -l</code> đếm cả dòng tiêu đề: 4 kết quả so với 0. Ba giờ đó không có lần khoá nào; bốn dòng kia là dấu vết <code>log run …</code> của chính các câu truy vấn có chữ "screenIsLocked" (kể cả câu này) — lại là bước 4.) Luật: lọc theo process / subsystem / thời gian trước, chữ sau cùng.</p>

<h3>Công thức dùng lại</h3>
<div class="table-wrap"><table>
<thead><tr><th>Câu hỏi</th><th>Predicate / lệnh</th></tr></thead>
<tbody>
<tr><td>Mọi lỗi của ứng dụng của tôi</td><td><code>subsystem == "com.example.app" AND messageType &gt;= error</code></td></tr>
<tr><td>Mọi thông điệp văng của Swift</td><td><code>senderImagePath ENDSWITH "libswiftCore.dylib" AND eventMessage CONTAINS "Fatal error"</code></td></tr>
<tr><td>Khoá / mở khoá màn hình</td><td><code>process == "loginwindow" AND eventMessage CONTAINS "sendDistributedNotification: com.apple.screenIs"</code></td></tr>
<tr><td>Ai đã dùng sudo</td><td><code>process == "sudo"</code> (bài 6.5)</td></tr>
<tr><td>Vì sao Mac đi ngủ</td><td><code>process == "powerd" AND eventMessage BEGINSWITH "Entering Sleep"</code> + <code>pmset -g log</code></td></tr>
<tr><td>Đồng hồ bị chỉnh</td><td><code>eventType == timesyncEvent</code></td></tr>
<tr><td>Hộp thoại xin quyền riêng tư</td><td><code>subsystem == "com.apple.TCC" AND eventMessage BEGINSWITH "AUTHREQ_"</code> (6.5)</td></tr>
<tr><td>Đổi mạng Wi-Fi</td><td><code>subsystem == "com.apple.wifi"</code> — cẩn thận: tên mạng là dữ liệu cá nhân</td></tr>
</tbody></table></div>
<p>Khoá/mở màn hình trong bảy ngày, làm gọn bằng <code>grep -o</code> + <code>paste</code>:</p>
${lenh('s06/lab6', 3)}
<p>Ngủ và thức có log sống lâu riêng, nằm ngoài unified log, trong <code>/var/log/powermanagement</code>, đọc bằng <code>pmset -g log</code>:</p>
${lenh('s06/lab6', 1)}
${lenh('s06/lab6', 2)}
<p>"DarkWake" = Mac thức dậy mà không bật màn hình (bảo trì, mạng, Power Nap); "Wake … due to UserActivity" = có người mở nắp hoặc chạm phím. Lab ghép những thứ này thành dòng thời gian.</p>

<h3>Tình huống đi làm</h3>
<ul>
<li><strong>"VPN công ty sáng nào cũng rớt."</strong> <code>subsystem BEGINSWITH "com.vendor" AND messageType &gt;= error</code> trong một tuần, rồi <code>pmset -g log</code> đúng những phút đó — thường là một lần ngủ/DarkWake.</li>
<li><strong>Bản QA của ứng dụng Swift/Electron thỉnh thoảng văng.</strong> Lưu predicate "mọi thông điệp văng của Swift" trong Console (nút Save) cho cả nhóm.</li>
<li><strong>Đợt rà soát bảo mật hỏi "tuần trước máy Mac này được mở khoá lúc nào?"</strong> Công thức khoá/mở — cộng <code>last</code> cho lần đăng nhập (6.5).</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Viết predicate lấy error và fault của <code>com.example.shopmac</code> chỉ trong category <code>db</code>, dạng đầy đủ và dạng viết tắt.</li>
<li>Tìm thông điệp chứa "thoi gian" bất kể hoa thường và dấu.</li>
<li>Đo thời gian của một câu tìm chỉ theo chữ so với cùng câu đó có lọc process, trên 1 giờ, trên Mac của bạn.</li>
<li>Liệt kê giờ khoá/mở màn hình của chính bạn trong 3 ngày qua.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 chỉ ra dòng db có E/F; câu 2 dùng <code>CONTAINS[cd]</code>; câu 3 thấy rõ nhanh hơn; câu 4 in từng cặp giờ + screenIsLocked/Unlocked.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['predicate', 'Bộ lọc NSPredicate áp bên trong log/Console trước khi xuất.'],
  ['CONTAINS[c] / [d] / [cd]', 'Bỏ qua hoa thường / dấu / cả hai.'],
  ['BEGINSWITH, ENDSWITH, IN, NOT', 'Tiền tố, hậu tố, tập hợp, phủ định.'],
  ['MATCHES', 'Biểu thức chính quy trên cả chuỗi.'],
  ['dạng viết tắt', 'p=, s=, c=, type>=, : (chứa) — gõ nhanh, xem log help shorthand.'],
  ['senderImagePath', 'Thư viện đã viết dòng log — tìm thông điệp runtime của mọi ứng dụng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt chuỗi trong ngoặc kép; giá trị có dấu chấm mà không ngoặc kép bị đọc thành tên trường.</li>
<li>Mặc định phân biệt hoa thường — thêm <code>[c]</code> hoặc <code>[cd]</code>.</li>
<li>Trường rẻ đứng trước: process/subsystem rồi mới tới chữ — nhanh gấp 10 lần trong phép đo của ta.</li>
<li><code>log</code> ghi lại câu truy vấn của bạn; thu hẹp câu tìm để nó không tìm ra chính nó.</li>
</ul>
${nguon('📘', 'Apple — Predicate Format String Syntax', 'Toán tử, [c][d], MATCHES, IN', 'https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Predicates/Articles/pSyntax.html')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-7-2-journalctl-loc', title: 'Bài 7.2 — Bộ lọc journalctl', sub: 'Luật VÀ/HOẶC và -g trên Linux', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-5-2-filterhashtable', title: 'Bài 5.2 — FilterHashtable', sub: 'Cách Windows lọc ngay tại nguồn', cta: 'Mở bài' })}
</div>
`,
};
