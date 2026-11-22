/**
 * IDE & đồ nghề dev — Mục 0: Đồ nghề quyết định tốc độ (soạn 22/11/2026).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../ide-va-do-nghe-dev.mjs (ghép bằng ghep()).
 * Phím tắt luôn ghi cả Windows/Linux và macOS. Lệnh + output chạy thật trên Mac M1 (Node 26.8, npm 11.19, Express 5.3.0,
 * VS Code 1.124, OpenJDK 21.0.9, start.spring.io ngày 22/11/2026).
 * KHÔNG backtick trần trong content; mã mẫu đi qua bash()/js()/json()/out() của ./_chung.mjs.
 */
import { bash, out, tl, phim, bai } from './_chung.mjs';

/* ═════════════ Bắt đầu tại đây (1/2) ═════════════ */
const L1_EN = `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Start here (1/2) — Why fluent tools matter more than typing speed</h2>
<p class="lead">Welcome. Before you write a single line in this course, picture two interns on their first OJT week. Both get the same ticket: “rename <code>getUser</code> to <code>findUserById</code> and make sure nothing breaks”. One of them scrolls through files, uses Ctrl+F in each one, edits by hand and pushes after 40 minutes — the build fails because three call sites were missed. The other presses <code>F2</code>, types the new name, watches the IDE update 23 places in 11 files, runs the tests with one shortcut and is done in two minutes. They type at the same speed. The difference is the toolbox.</p>

<h3>Where the time really goes</h3>
<p>New developers usually think they are slow because they type slowly. Measure a real working hour and you find something else: most of the time goes to <strong>finding</strong> things (where is this defined, who calls it, which file handles this route), <strong>repeating</strong> small edits and <strong>waiting</strong> on manual steps. Those are exactly what an IDE automates.</p>
<table>
<thead><tr><th>Task</th><th>By eye and by hand</th><th>With the IDE</th></tr></thead>
<tbody>
<tr><td>Open the file that defines a function</td><td>Guess the folder, scroll, Ctrl+F — 1–10 min</td><td><code>F12</code> on the name — under 1 s</td></tr>
<tr><td>Find every caller</td><td>Search the text, filter comments and same-named functions by eye</td><td><code>Shift+F12</code> — an exact list, no comments, no look-alikes</td></tr>
<tr><td>Rename a function everywhere</td><td>Edit each file, hope you did not miss one</td><td><code>F2</code> — every reference, imports included</td></tr>
<tr><td>Change 30 similar lines</td><td>30 edits</td><td>Multi-cursor — one edit typed 30 times at once</td></tr>
<tr><td>Run the tests</td><td>Switch window, type the command, scroll the output</td><td>One shortcut, failures listed and clickable</td></tr>
</tbody>
</table>
<div class="callout ok"><p>Tools do not make you think better. They give you back <strong>time</strong> and, more importantly, <strong>focus</strong>: every 3-minute hunt for a file breaks the chain of thought you were building about the bug.</p></div>

<h3>An everyday picture: a carpenter and a chisel</h3>
<p>A carpenter with only a hand chisel can build a table — slowly, with uneven cuts. A carpenter who knows the saw, the plane and the drill builds a better table faster, and has energy left to think about the design. Nobody calls that cheating. Knowing your IDE is the same: it is part of the craft, not a shortcut around it.</p>

<h3>Editor, code editor, IDE — what is the difference?</h3>
<table>
<thead><tr><th></th><th>Text editor</th><th>Code editor</th><th>IDE (Integrated Development Environment)</th></tr></thead>
<tbody>
<tr><td>Examples</td><td>Notepad, TextEdit</td><td>VS Code, Sublime Text, Vim</td><td>IntelliJ IDEA, Visual Studio, Eclipse</td></tr>
<tr><td>Understands code?</td><td>No — only characters</td><td>Yes, through extensions and language servers</td><td>Yes, built in and very deep for its languages</td></tr>
<tr><td>Typical use in this course</td><td>—</td><td>Node.js, TypeScript, React</td><td>Java, Spring Boot</td></tr>
</tbody>
</table>
<p>The line is blurry today: VS Code with the right extensions behaves like an IDE, and that is fine. In this course “IDE” means whichever of the two you have open.</p>

<h3>How an IDE “understands” your code: the index and the language server</h3>
<p>When you open a project, the IDE reads every file and builds an <strong>index</strong> — a database of every class, function, variable and where each is used. That is why IntelliJ shows “Indexing…” for a minute on a new project, and why <code>F12</code> is instant afterwards. In VS Code the work is done by a <strong>language server</strong>: a separate process (for TypeScript it is the TypeScript server) that the editor talks to through the <strong>Language Server Protocol (LSP)</strong>.</p>
<p>This explains a difference you will meet constantly: <strong>text search</strong> finds characters, <strong>Find References</strong> finds <em>uses of one symbol</em>. Searching “save” finds comments, strings and five unrelated functions called save. Find References on one <code>save</code> finds only the callers of that one function.</p>

<h3>A short history</h3>
<ul>
<li><strong>1976</strong> — vi (Bill Joy) and Emacs appear. Keyboard-only editing is born; both are still used today.</li>
<li><strong>1983</strong> — Turbo Pascal by Borland puts editor, compiler and run in one program: an early popular IDE.</li>
<li><strong>2001</strong> — JetBrains releases IntelliJ IDEA (January) with automatic refactoring as a headline feature; IBM open-sources Eclipse (November).</li>
<li><strong>2015–2016</strong> — Microsoft announces Visual Studio Code (April 2015, Build conference), free and cross-platform; version 1.0 ships in April 2016.</li>
<li><strong>June 2016</strong> — Microsoft, Red Hat and Codenvy publish the Language Server Protocol: one language server can serve every editor, which is why VS Code supports almost every language.</li>
<li><strong>December 2025</strong> — IntelliJ IDEA 2025.3 merges Community and Ultimate into one product: one installer, the core stays free, Ultimate features need a licence (students get one free — lesson 0.1).</li>
<li><strong>Today</strong> — AI assistants live inside the editor. They write code faster than you read it, so the skills of this course — navigating, reviewing and refactoring safely — matter <em>more</em>, not less.</li>
</ul>

<h3>How much it matters: numbers with a source</h3>
<p>In the Stack Overflow Developer Survey 2025, <strong>75.9%</strong> of respondents used Visual Studio Code (first place, up from 73.6% in 2024) and <strong>27.1%</strong> used IntelliJ IDEA. In other words: whatever company you join for OJT, you will almost certainly open one of these two on day one — this course teaches both.</p>

<h3>Where this course takes you</h3>
<table>
<thead><tr><th>Part</th><th>You will be able to…</th></tr></thead>
<tbody>
<tr><td>Section 0</td><td>Install both IDEs and two sample projects; measure your starting speed</td></tr>
<tr><td>Chapter 1 — VS Code</td><td>Navigate, edit with multiple cursors, search the whole project, configure the team settings, run tasks</td></tr>
<tr><td>Chapter 2 — IntelliJ IDEA</td><td>Open Maven projects correctly, navigate Spring code, refactor automatically, run configurations</td></tr>
<tr><td>Chapter 3 — Terminal</td><td>History search, aliases, rg, fzf, jq</td></tr>
<tr><td>Chapter 4 — Regex</td><td>Find and replace hundreds of places safely; avoid ReDoS</td></tr>
<tr><td>Chapter 5 — Git in the IDE</td><td>Partial commits, three-way merge, Local History</td></tr>
<tr><td>Chapter 6 — New machine</td><td>Dotfiles, scripted installs, Windows and WSL2</td></tr>
<tr><td>Chapter 7 — Capstone</td><td>Your own toolbox and a timed speed-run against your Section 0 numbers</td></tr>
</tbody>
</table>
<p>This course is the foundation for two others: ${bai('debug-co-phuong-phap', 'dbg-0-8-bat-dau-tai-day', 'Debugging with a method')} (the debugger is taught there, not here) and reading and refactoring legacy code.</p>

<h3>How to learn it without giving up</h3>
<ul>
<li><strong>Keyboard first, mouse later.</strong> Every time you reach for the mouse, ask “is there a shortcut?”. The Command Palette answers that question (lesson 1.1).</li>
<li><strong>Three shortcuts a week.</strong> Write them on a sticky note under your screen. Do not try to learn fifty at once — you will forget all of them.</li>
<li><strong>Measure.</strong> You time yourself in Section 0 and again in Chapter 7. Seeing “9 minutes → 2 minutes” is what keeps you going.</li>
<li><strong>Type everything yourself.</strong> Reading about a shortcut teaches nothing; pressing it ten times does.</li>
</ul>

<h3>🧪 Practice (10 minutes)</h3>
<div class="callout ok"><ol>
<li>Open VS Code (install it first with lesson 0.1 if you do not have it).</li>
<li>Open the Command Palette: <code>Ctrl+Shift+P</code> on Windows/Linux, <code>⇧⌘P</code> on macOS. Type <code>keyboard shortcuts reference</code> and press Enter — the official one-page PDF for your operating system opens.</li>
<li>Save the PDF. Circle five actions you did with the mouse this week.</li>
<li>Open the Command Palette again, type <code>keyboard shortcuts</code> and choose <em>Preferences: Open Keyboard Shortcuts</em> (<code>Ctrl+K Ctrl+S</code> / <code>⌘K ⌘S</code>). Search each of your five actions and write its shortcut on a sticky note.</li>
</ol>
<p><strong>Done when:</strong> a sticky note with five shortcuts (Windows or Mac — your own machine) is stuck under your screen, and you have opened the Command Palette by keyboard at least three times.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IDE</span><span class="v">Integrated Development Environment: editor, navigation, refactoring, run and test in one program.</span></div>
  <div class="kv"><span class="k">Index</span><span class="v">The IDE’s database of every symbol in the project and where it is used.</span></div>
  <div class="kv"><span class="k">Language server</span><span class="v">A separate process that understands one language and answers the editor’s questions.</span></div>
  <div class="kv"><span class="k">LSP</span><span class="v">Language Server Protocol, the standard way editors talk to language servers (2016).</span></div>
  <div class="kv"><span class="k">Symbol</span><span class="v">A named thing in code: class, function, variable, method.</span></div>
  <div class="kv"><span class="k">Refactoring</span><span class="v">Changing the structure of code without changing what it does — rename, extract, move.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Beginners are slow mostly because they search and repeat by hand, not because they type slowly.</li>
<li>The IDE builds an index (or asks a language server), so it finds uses of a symbol, not just matching text.</li>
<li>VS Code (75.9%) and IntelliJ IDEA (27.1%) are what you will meet at work (Stack Overflow 2025).</li>
<li>This course teaches both, plus terminal, regex, Git in the IDE and setting up a machine.</li>
<li>Learn three shortcuts a week, type them yourself, and measure your speed before and after.</li>
</ul>
${tl('https://survey.stackoverflow.co/2025/technology/', '📊', 'Stack Overflow Developer Survey 2025 — Technology', 'Integrated development environment: usage figures')}
${tl('https://microsoft.github.io/language-server-protocol/', '📘', 'Language Server Protocol', 'Official overview of LSP by Microsoft')}
${tl('https://blog.jetbrains.com/idea/2025/12/intellij-idea-unified-release/', '📘', 'JetBrains blog — IntelliJ IDEA unified release', 'Community and Ultimate become one product (2025.3)')}
</div>
`;
const L1_VI = `
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Bắt đầu tại đây (1/2) — Vì sao thạo đồ nghề quan trọng hơn gõ nhanh</h2>
<p class="lead">Chào bạn. Trước khi gõ dòng nào trong khoá này, hãy hình dung hai bạn intern trong tuần OJT đầu tiên. Cả hai nhận cùng một ticket: “đổi tên <code>getUser</code> thành <code>findUserById</code> và đảm bảo không vỡ gì”. Bạn thứ nhất cuộn qua từng file, Ctrl+F trong từng file, sửa tay, 40 phút sau mới push — build hỏng vì sót ba chỗ gọi. Bạn thứ hai bấm <code>F2</code>, gõ tên mới, nhìn IDE tự sửa 23 chỗ trong 11 file, chạy test bằng một phím tắt và xong trong hai phút. Hai người gõ phím nhanh như nhau. Khác nhau là đồ nghề.</p>

<h3>Thời gian thật ra đi đâu</h3>
<p>Người mới thường nghĩ mình chậm vì gõ chậm. Đo thử một giờ làm việc thật thì thấy khác: phần lớn thời gian dành cho việc <strong>tìm</strong> (hàm này định nghĩa ở đâu, ai gọi nó, file nào xử lý route này), <strong>lặp lại</strong> những sửa đổi nhỏ và <strong>chờ</strong> các bước làm tay. Đó đúng là những thứ IDE làm thay được.</p>
<table>
<thead><tr><th>Việc</th><th>Bằng mắt, bằng tay</th><th>Bằng IDE</th></tr></thead>
<tbody>
<tr><td>Mở file định nghĩa một hàm</td><td>Đoán thư mục, cuộn, Ctrl+F — 1–10 phút</td><td><code>F12</code> trên tên hàm — dưới 1 giây</td></tr>
<tr><td>Tìm mọi chỗ gọi</td><td>Tìm theo chữ, tự lọc bằng mắt chú thích và hàm trùng tên</td><td><code>Shift+F12</code> — danh sách chính xác, không lẫn chú thích, không lẫn hàm trùng tên</td></tr>
<tr><td>Đổi tên hàm ở mọi nơi</td><td>Sửa từng file, cầu mong không sót</td><td><code>F2</code> — mọi chỗ dùng, kể cả dòng import</td></tr>
<tr><td>Sửa 30 dòng giống nhau</td><td>30 lần sửa</td><td>Đa con trỏ — gõ một lần, 30 chỗ cùng đổi</td></tr>
<tr><td>Chạy test</td><td>Đổi cửa sổ, gõ lệnh, cuộn tìm lỗi</td><td>Một phím tắt, lỗi hiện thành danh sách bấm được</td></tr>
</tbody>
</table>
<div class="callout ok"><p>Đồ nghề không làm bạn tư duy giỏi hơn. Nó trả lại cho bạn <strong>thời gian</strong> và, quan trọng hơn, <strong>sự tập trung</strong>: mỗi lần mất 3 phút đi tìm file là một lần đứt mạch suy nghĩ bạn đang xây về con bug.</p></div>

<h3>Liên tưởng đời thường: thợ mộc và cái đục</h3>
<p>Một bác thợ mộc chỉ có cái đục tay vẫn đóng được cái bàn — chậm, đường cắt không đều. Bác thợ biết dùng cưa máy, máy bào, máy khoan thì đóng cái bàn đẹp hơn, nhanh hơn, và còn sức để nghĩ về kiểu dáng. Không ai gọi đó là gian lận. Thạo IDE cũng vậy: nó là một phần của tay nghề, không phải đường tắt né tay nghề.</p>

<h3>Trình soạn thảo, code editor, IDE — khác nhau thế nào?</h3>
<table>
<thead><tr><th></th><th>Text editor (trình soạn thảo chữ)</th><th>Code editor (trình soạn code)</th><th>IDE (môi trường phát triển tích hợp)</th></tr></thead>
<tbody>
<tr><td>Ví dụ</td><td>Notepad, TextEdit</td><td>VS Code, Sublime Text, Vim</td><td>IntelliJ IDEA, Visual Studio, Eclipse</td></tr>
<tr><td>Có “hiểu” code không?</td><td>Không — chỉ thấy ký tự</td><td>Có, nhờ extension và language server</td><td>Có, cài sẵn và rất sâu với ngôn ngữ của nó</td></tr>
<tr><td>Dùng trong khoá này cho</td><td>—</td><td>Node.js, TypeScript, React</td><td>Java, Spring Boot</td></tr>
</tbody>
</table>
<p>Ranh giới giờ khá mờ: VS Code cài đúng extension thì làm việc như một IDE, và thế là ổn. Trong khoá này, chữ “IDE” nghĩa là cái nào trong hai cái bạn đang mở.</p>

<h3>IDE “hiểu” code bằng cách nào: chỉ mục và language server</h3>
<p>Khi bạn mở một dự án, IDE đọc mọi file và dựng một <strong>index (chỉ mục)</strong> — một cơ sở dữ liệu về mọi class, hàm, biến và nơi mỗi thứ được dùng. Vì thế IntelliJ hiện chữ “Indexing…” cả phút khi mở dự án mới, và sau đó <code>F12</code> nhảy ngay lập tức. Trong VS Code việc này do một <strong>language server (máy chủ ngôn ngữ)</strong> làm: một tiến trình riêng (với TypeScript là TypeScript server) mà editor hỏi chuyện qua <strong>Language Server Protocol — LSP (giao thức máy chủ ngôn ngữ)</strong>.</p>
<p>Điều này giải thích một khác biệt bạn sẽ gặp liên tục: <strong>tìm theo chữ</strong> tìm ký tự, còn <strong>Find References (tìm nơi dùng)</strong> tìm <em>các lần dùng của đúng một symbol (ký hiệu)</em>. Tìm chữ “save” ra cả chú thích, chuỗi và năm hàm khác nhau cùng tên save. Find References trên một hàm <code>save</code> chỉ ra những chỗ gọi đúng hàm đó.</p>

<h3>Lịch sử ngắn</h3>
<ul>
<li><strong>1976</strong> — vi (Bill Joy) và Emacs ra đời. Soạn thảo chỉ bằng bàn phím bắt đầu từ đây; cả hai vẫn được dùng tới hôm nay.</li>
<li><strong>1983</strong> — Turbo Pascal của Borland gom soạn thảo, biên dịch và chạy vào một chương trình: một trong những IDE phổ biến đầu tiên.</li>
<li><strong>2001</strong> — JetBrains phát hành IntelliJ IDEA (tháng 1) với refactor tự động là tính năng nổi bật; IBM mở mã nguồn Eclipse (tháng 11).</li>
<li><strong>2015–2016</strong> — Microsoft công bố Visual Studio Code (tháng 4/2015, hội nghị Build), miễn phí, chạy mọi hệ điều hành; bản 1.0 ra tháng 4/2016.</li>
<li><strong>6/2016</strong> — Microsoft, Red Hat và Codenvy công bố Language Server Protocol: một language server phục vụ được mọi editor — lý do VS Code hỗ trợ gần như mọi ngôn ngữ.</li>
<li><strong>12/2025</strong> — IntelliJ IDEA 2025.3 gộp Community và Ultimate thành một sản phẩm: một bộ cài, phần lõi vẫn miễn phí, tính năng Ultimate cần giấy phép (sinh viên được miễn phí — bài 0.1).</li>
<li><strong>Hôm nay</strong> — trợ lý AI nằm ngay trong editor. Nó viết code nhanh hơn bạn đọc, nên kỹ năng của khoá này — điều hướng, soát lại và refactor an toàn — càng <em>quan trọng hơn</em>, không phải bớt đi.</li>
</ul>

<h3>Quan trọng tới đâu: con số có nguồn</h3>
<p>Trong khảo sát Stack Overflow Developer Survey 2025, <strong>75,9%</strong> người trả lời dùng Visual Studio Code (đứng đầu, tăng từ 73,6% năm 2024) và <strong>27,1%</strong> dùng IntelliJ IDEA. Nói cách khác: dù bạn OJT ở công ty nào, gần như chắc chắn ngày đầu tiên bạn sẽ mở một trong hai cái này — khoá học dạy cả hai.</p>

<h3>Khoá này đưa bạn tới đâu</h3>
<table>
<thead><tr><th>Phần</th><th>Học xong bạn làm được…</th></tr></thead>
<tbody>
<tr><td>Mục 0</td><td>Cài hai IDE và hai dự án mẫu; đo tốc độ xuất phát của mình</td></tr>
<tr><td>Chương 1 — VS Code</td><td>Điều hướng, sửa bằng đa con trỏ, tìm trên toàn dự án, cấu hình chung cho nhóm, chạy task</td></tr>
<tr><td>Chương 2 — IntelliJ IDEA</td><td>Mở dự án Maven cho đúng, điều hướng code Spring, refactor tự động, run configuration</td></tr>
<tr><td>Chương 3 — Terminal</td><td>Tìm lịch sử lệnh, alias, rg, fzf, jq</td></tr>
<tr><td>Chương 4 — Regex</td><td>Tìm/thay hàng trăm chỗ an toàn; tránh ReDoS</td></tr>
<tr><td>Chương 5 — Git trong IDE</td><td>Commit từng đoạn, merge ba bên, Local History</td></tr>
<tr><td>Chương 6 — Máy mới</td><td>Dotfiles, cài bằng script, Windows và WSL2</td></tr>
<tr><td>Chương 7 — Dự án cuối khoá</td><td>Bộ đồ nghề của riêng bạn và một lượt chạy đua có bấm giờ so với số đo ở Mục 0</td></tr>
</tbody>
</table>
<p>Khoá này là nền cho hai khoá khác: ${bai('debug-co-phuong-phap', 'dbg-0-8-bat-dau-tai-day', 'Gỡ lỗi có phương pháp')} (debugger được dạy ở đó, không dạy ở đây) và đọc, refactor code cũ.</p>

<h3>Cách học để không nản</h3>
<ul>
<li><strong>Bàn phím trước, chuột sau.</strong> Mỗi lần với tay lấy chuột, tự hỏi “có phím tắt không?”. Command Palette trả lời câu đó (bài 1.1).</li>
<li><strong>Mỗi tuần ba phím tắt.</strong> Viết lên giấy nhớ dán dưới màn hình. Đừng cố học năm mươi phím một lúc — bạn sẽ quên sạch.</li>
<li><strong>Đo đạc.</strong> Bạn bấm giờ ở Mục 0 và bấm lại ở Chương 7. Thấy “9 phút → 2 phút” chính là thứ giữ bạn đi tiếp.</li>
<li><strong>Tự gõ mọi thứ.</strong> Đọc về một phím tắt không dạy được gì; bấm nó mười lần thì nhớ.</li>
</ul>

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok"><ol>
<li>Mở VS Code (chưa có thì cài theo bài 0.1 trước).</li>
<li>Mở Command Palette (bảng lệnh): <code>Ctrl+Shift+P</code> trên Windows/Linux, <code>⇧⌘P</code> trên macOS. Gõ <code>keyboard shortcuts reference</code> rồi Enter — trang PDF phím tắt chính thức cho hệ điều hành của bạn mở ra.</li>
<li>Lưu file PDF. Khoanh năm việc tuần này bạn đã làm bằng chuột.</li>
<li>Mở lại Command Palette, gõ <code>keyboard shortcuts</code> và chọn <em>Preferences: Open Keyboard Shortcuts</em> (<code>Ctrl+K Ctrl+S</code> / <code>⌘K ⌘S</code>). Tìm từng việc trong năm việc đó và chép phím tắt ra giấy nhớ.</li>
</ol>
<p><strong>Đạt khi:</strong> dưới màn hình có tờ giấy nhớ ghi năm phím tắt (đúng hệ máy của bạn — Windows hoặc Mac), và bạn đã mở Command Palette bằng bàn phím ít nhất ba lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IDE (môi trường phát triển tích hợp)</span><span class="v">Soạn thảo, điều hướng, refactor, chạy và test gom trong một chương trình.</span></div>
  <div class="kv"><span class="k">Index (chỉ mục)</span><span class="v">Cơ sở dữ liệu IDE tự dựng về mọi symbol trong dự án và nơi chúng được dùng.</span></div>
  <div class="kv"><span class="k">Language server (máy chủ ngôn ngữ)</span><span class="v">Tiến trình riêng hiểu một ngôn ngữ và trả lời câu hỏi của editor.</span></div>
  <div class="kv"><span class="k">LSP (giao thức máy chủ ngôn ngữ)</span><span class="v">Chuẩn chung để editor nói chuyện với language server (2016).</span></div>
  <div class="kv"><span class="k">Symbol (ký hiệu)</span><span class="v">Một thứ có tên trong code: class, hàm, biến, phương thức.</span></div>
  <div class="kv"><span class="k">Refactoring (tái cấu trúc)</span><span class="v">Đổi cấu trúc code mà không đổi việc nó làm — đổi tên, tách hàm, chuyển file.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Người mới chậm chủ yếu vì tìm và lặp lại bằng tay, không phải vì gõ chậm.</li>
<li>IDE dựng chỉ mục (hoặc hỏi language server) nên tìm được nơi dùng một symbol, không chỉ chữ trùng.</li>
<li>VS Code (75,9%) và IntelliJ IDEA (27,1%) là thứ bạn sẽ gặp khi đi làm (Stack Overflow 2025).</li>
<li>Khoá dạy cả hai, cộng terminal, regex, Git trong IDE và cài máy.</li>
<li>Mỗi tuần ba phím tắt, tự tay bấm, và đo tốc độ trước và sau khoá.</li>
</ul>
${tl('https://survey.stackoverflow.co/2025/technology/', '📊', 'Stack Overflow Developer Survey 2025 — Technology', 'Mục Integrated development environment: tỉ lệ sử dụng')}
${tl('https://microsoft.github.io/language-server-protocol/', '📘', 'Language Server Protocol', 'Trang giới thiệu chính thức của Microsoft')}
${tl('https://blog.jetbrains.com/idea/2025/12/intellij-idea-unified-release/', '📘', 'JetBrains blog — IntelliJ IDEA unified release', 'Community và Ultimate gộp thành một sản phẩm (2025.3)')}
</div>
`;

/* ═════════════ Bắt đầu tại đây (2/2) ═════════════ */
const PHIEU = `
# toc-do-dau-khoa.txt — điền sau khi xong bài 0.1 (dự án labflow-mini)
Ngày: ____    Máy: Mac / Windows    Editor đang quen dùng: ____
1. Mở file định nghĩa hàm formatDueDate              : ___ giây
2. Liệt kê MỌI chỗ gọi findUserById                   : ___ giây
3. Đổi tên markDone thành completeTask ở mọi nơi     : ___ giây  (chạy npm test xanh mới tính)
4. Tìm route nào xử lý PATCH /tasks/:id/done          : ___ giây
5. Thêm dấu ! vào cuối 3 tiêu đề trong mảng TASKS    : ___ giây  (src/services/task.service.js)
Tổng: ___ giây    Số lần chạm chuột (ước lượng): ___
`;
const L2 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Section 0 · Start here' : 'Mục 0 · Bắt đầu tại đây'}</span>
<h2>${en ? 'Start here (2/2) — Working without your tools: searching by eye, renaming by hand' : 'Bắt đầu tại đây (2/2) — Làm việc không có đồ nghề: tìm bằng mắt, đổi tên bằng tay'}</h2>
<p class="lead">${en
    ? 'The previous lesson said tools save time. This one shows what not having them costs — in an intern’s morning, in a team project the night before a demo, and in two real outages at companies with excellent engineers. Each story ends with the chapter of this course that prevents it. Then we set up the measurement you will compare against at the end of the course.'
    : 'Bài trước nói đồ nghề tiết kiệm thời gian. Bài này cho thấy cái giá của việc không có nó — trong một buổi sáng của intern, trong đồ án nhóm đêm trước buổi demo, và trong hai sự cố thật ở những công ty có kỹ sư rất giỏi. Mỗi câu chuyện kết thúc bằng chương của khoá này ngăn được nó. Sau đó ta chuẩn bị phiếu đo tốc độ để cuối khoá so lại.'}</p>

<h3>${en ? 'Story 1 — A whole morning to find one function (illustrative OJT scenario)' : 'Chuyện 1 — Cả buổi sáng để tìm một hàm (tình huống OJT minh hoạ)'}</h3>
<p>${en
    ? 'Day three of OJT. The mentor says: “the invoice total is wrong when there is a discount, have a look at <code>calculateTotal</code>”. The project has 1,800 files. The intern opens folders one by one, finds a <code>calculateTotal</code> in a test helper, edits it, nothing changes, finds a second one in an old module nobody uses, and only before lunch reaches the real one — which was imported under another name. <strong>Cost:</strong> three hours, and the mentor’s impression that the intern is slow. <strong>With tools:</strong> <code>Ctrl+T</code> / <code>⌘T</code> lists every symbol named calculateTotal with its file in one second; <code>F12</code> from the caller jumps straight to the one actually used. <strong>Where:</strong> lessons 1.1 (VS Code) and 2.2 (IntelliJ).'
    : 'Ngày thứ ba OJT. Mentor bảo: “tổng tiền hoá đơn sai khi có giảm giá, em xem hàm <code>calculateTotal</code> nhé”. Dự án có 1.800 file. Bạn intern mở từng thư mục, tìm thấy một <code>calculateTotal</code> trong file hỗ trợ test, sửa, không có gì đổi, tìm thấy cái thứ hai trong một module cũ không ai dùng, và mãi gần trưa mới tới đúng cái thật — được import dưới một tên khác. <strong>Hậu quả:</strong> ba tiếng, và mentor có ấn tượng bạn chậm. <strong>Có đồ nghề:</strong> <code>Ctrl+T</code> / <code>⌘T</code> liệt kê mọi symbol tên calculateTotal kèm file trong một giây; <code>F12</code> từ chỗ gọi nhảy thẳng tới đúng cái đang được dùng. <strong>Học ở:</strong> bài 1.1 (VS Code) và 2.2 (IntelliJ).'}</p>

<h3>${en ? 'Story 2 — Rename by hand, three places missed (illustrative team-project scenario)' : 'Chuyện 2 — Đổi tên bằng tay, sót ba chỗ (tình huống đồ án nhóm minh hoạ)'}</h3>
<p>${en
    ? 'SWP391, the night before the demo. To match the API document, a teammate renames the field <code>userName</code> to <code>username</code> with Ctrl+F and Replace in the files he has open. Three files he did not open still use the old name. JavaScript does not complain — the value is simply <code>undefined</code> — and the profile page shows an empty name in front of the lecturer. <strong>With tools:</strong> rename with <code>F2</code> (lesson 1.2) updates every reference the language server knows about; project-wide search with a preview (lesson 1.1) shows every remaining text match before you replace; and the test task (lesson 1.3) runs in one key press so you actually run it.'
    : 'SWP391, đêm trước buổi demo. Để khớp tài liệu API, một bạn trong nhóm đổi tên trường <code>userName</code> thành <code>username</code> bằng Ctrl+F và Replace trong những file đang mở. Ba file không mở vẫn dùng tên cũ. JavaScript không báo lỗi — giá trị chỉ đơn giản là <code>undefined</code> — và trang hồ sơ hiện tên trống ngay trước mặt giảng viên. <strong>Có đồ nghề:</strong> đổi tên bằng <code>F2</code> (bài 1.2) sửa mọi chỗ dùng mà language server biết; tìm trên toàn dự án có xem trước (bài 1.1) cho thấy mọi chỗ trùng chữ còn sót trước khi thay; và task chạy test (bài 1.3) chỉ cần một phím nên bạn chạy thật.'}</p>

<h3>${en ? 'Story 3 — Stack Overflow, 20 July 2016: 34 minutes down because of one regex (real)' : 'Chuyện 3 — Stack Overflow, 20/07/2016: sập 34 phút vì một regex (chuyện thật)'}</h3>
<p>${en
    ? 'A user posted content containing about 20,000 consecutive whitespace characters. A regular expression that trimmed whitespace from the end of lines had to backtrack an enormous number of times on it, CPU on the web servers hit 100%, and because the load balancer’s health check loaded the page that rendered this post, the servers were marked unhealthy and the site went down for 34 minutes. The postmortem ended with: the regex “has been replaced with a substring function”. <strong>Lesson for you:</strong> regex is a powerful tool and a dangerous one; you will use it for project-wide find and replace every week. <strong>Where:</strong> Chapter 4, including lesson 4.5 on ReDoS (regex denial of service).'
    : 'Một người dùng đăng nội dung có khoảng 20.000 ký tự khoảng trắng liền nhau. Một biểu thức chính quy (regex) dùng để cắt khoảng trắng cuối dòng phải quay lui (backtrack) một số lần khổng lồ trên chuỗi đó, CPU của máy chủ web lên 100%, và vì bước kiểm tra sức khoẻ (health check) của bộ cân bằng tải gọi đúng trang hiển thị bài này, các máy chủ bị đánh dấu là hỏng và cả trang sập 34 phút. Bản phân tích sự cố kết luận: regex đó “đã được thay bằng một hàm substring”. <strong>Bài học cho bạn:</strong> regex là công cụ mạnh và cũng nguy hiểm; bạn sẽ dùng nó để tìm/thay trên toàn dự án hằng tuần. <strong>Học ở:</strong> Chương 4, có bài 4.5 về ReDoS (tấn công từ chối dịch vụ bằng regex).'}</p>

<h3>${en ? 'Story 4 — Cloudflare, 2 July 2019: a regex took a large part of the web offline (real)' : 'Chuyện 4 — Cloudflare, 02/07/2019: một regex làm sập một phần lớn Internet (chuyện thật)'}</h3>
<p>${en
    ? 'Cloudflare deployed a new firewall rule containing a regex with the pattern <code>.*(?:.*=.*)</code>. On real traffic it backtracked so much that CPUs across Cloudflare’s network went to 100% and sites behind Cloudflare returned 502 errors for about 27 minutes. Their public postmortem is one of the best explanations of catastrophic backtracking ever written — you will read it in Chapter 4. Why it is in a tools course: the same pattern is exactly what beginners type into the “find in files” box of their IDE.'
    : 'Cloudflare triển khai một luật tường lửa mới chứa regex có mẫu <code>.*(?:.*=.*)</code>. Trên lưu lượng thật nó quay lui nhiều tới mức CPU trên khắp mạng của Cloudflare lên 100% và các trang đứng sau Cloudflare trả lỗi 502 khoảng 27 phút. Bản phân tích công khai của họ là một trong những bài giải thích “quay lui thảm hoạ” hay nhất từng viết — bạn sẽ đọc nó ở Chương 4. Vì sao nó nằm trong khoá đồ nghề: đúng kiểu mẫu đó là thứ người mới hay gõ vào ô “tìm trong file” của IDE.'}</p>

<h3>${en ? 'Story 5 — Code that Git never saw (illustrative)' : 'Chuyện 5 — Đoạn code mà Git chưa từng thấy (tình huống minh hoạ)'}</h3>
<p>${en
    ? 'You worked two hours without committing, then ran a command from Stack Overflow to “clean” the folder and the file was overwritten. Git cannot help: it only knows committed (or staged) content. IntelliJ’s Local History and VS Code’s Timeline keep their own snapshots of every save, and recover the file in a minute. <strong>Where:</strong> lesson 5.3.'
    : 'Bạn làm hai tiếng không commit, rồi chạy một lệnh chép trên mạng để “dọn” thư mục và file bị ghi đè. Git không cứu được: nó chỉ biết nội dung đã commit (hoặc đã stage). Local History của IntelliJ và Timeline của VS Code tự giữ bản chụp mỗi lần lưu, và lấy lại file trong một phút. <strong>Học ở:</strong> bài 5.3.'}</p>

<h3>${en ? 'Story 6 — Two days to set up a new laptop (illustrative)' : 'Chuyện 6 — Hai ngày để cài một laptop mới (tình huống minh hoạ)'}</h3>
<p>${en
    ? 'Your laptop dies a week before the final exam, or the company hands you a new machine on day one. Without a list, you spend two days remembering which JDK, which Node version, which extensions, which Git settings. With a dotfiles repository and an install script, it takes under an hour. <strong>Where:</strong> Chapter 6.'
    : 'Laptop hỏng một tuần trước kỳ thi, hoặc công ty giao máy mới ngày đầu đi làm. Không có danh sách, bạn mất hai ngày nhớ lại JDK nào, Node bản mấy, extension nào, cấu hình Git ra sao. Có một repo dotfiles và một script cài đặt thì dưới một giờ. <strong>Học ở:</strong> Chương 6.'}</p>

<h3>${en ? 'Why beginners give up on tools — and how not to' : 'Vì sao người mới hay bỏ cuộc với đồ nghề — và cách tránh'}</h3>
<table>
<thead><tr><th>${en ? 'Reason' : 'Lý do'}</th><th>${en ? 'What to do instead' : 'Làm thế này thay vào đó'}</th></tr></thead>
<tbody>
<tr><td>${en ? '“Using shortcuts is slower than the mouse at first”' : '“Lúc đầu dùng phím tắt còn chậm hơn chuột”'}</td><td>${en ? 'True for about three days. Commit to three shortcuts for one week, then decide.' : 'Đúng, khoảng ba ngày. Cam kết ba phím tắt trong một tuần rồi hãy đánh giá.'}</td></tr>
<tr><td>${en ? 'Too many shortcuts to remember' : 'Quá nhiều phím để nhớ'}</td><td>${en ? 'You only need the Command Palette shortcut. Everything else can be searched by name inside it — and it shows the shortcut next to the name.' : 'Bạn chỉ cần nhớ phím mở Command Palette. Mọi thứ khác gõ tên để tìm trong đó — và nó hiện luôn phím tắt cạnh tên lệnh.'}</td></tr>
<tr><td>${en ? 'English menu names' : 'Tên menu tiếng Anh'}</td><td>${en ? 'Each lesson has a 🗂 Key terms box. Keep the IDE in English — every tutorial and every colleague uses English names.' : 'Mỗi bài có ô 🗂 Thuật ngữ. Giữ IDE bằng tiếng Anh — mọi hướng dẫn và mọi đồng nghiệp đều gọi bằng tên tiếng Anh.'}</td></tr>
<tr><td>${en ? 'Mac and Windows keys differ' : 'Phím Mac và Windows khác nhau'}</td><td>${en ? 'Rule of thumb: Windows <code>Ctrl</code> ≈ Mac <code>⌘</code>, Windows <code>Alt</code> ≈ Mac <code>⌥</code>. Every table in this course lists both.' : 'Quy tắc nhớ nhanh: <code>Ctrl</code> của Windows ≈ <code>⌘</code> của Mac, <code>Alt</code> ≈ <code>⌥</code>. Mọi bảng trong khoá ghi đủ cả hai.'}</td></tr>
<tr><td>${en ? 'Reading without doing' : 'Đọc mà không làm'}</td><td>${en ? 'Every lesson ends with a 🧪 practice on your own machine and a “Done when” you can check.' : 'Mọi bài kết thúc bằng 🧪 thực hành trên máy của bạn và một dòng “Đạt khi” tự kiểm được.'}</td></tr>
</tbody>
</table>
<p>${en ? 'A rhythm that works for one session (45–60 minutes): read the lesson once → open the sample project → press every shortcut in the lesson at least three times → do the 🧪 practice → write the new shortcuts on your note.' : 'Nhịp học một buổi (45–60 phút) hiệu quả: đọc bài một lượt → mở dự án mẫu → bấm mỗi phím tắt trong bài ít nhất ba lần → làm 🧪 thực hành → chép phím mới lên giấy nhớ.'}</p>

<h3>${en ? 'The rule that saves the most time of all' : 'Quy tắc tiết kiệm thời gian nhất'}</h3>
${phim([
    ['Open the Command Palette — find any command by name', 'Mở Command Palette — tìm mọi lệnh theo tên', 'Ctrl+Shift+P (or F1)', '⇧⌘P (or F1)'],
    ['IntelliJ: Find Action — the same idea', 'IntelliJ: Find Action — cùng ý tưởng', 'Ctrl+Shift+A', '⇧⌘A'],
  ], !en)}
<p>${en ? 'If you remember nothing else from Section 0, remember these two. They turn “I don’t know the shortcut” into “I type what I want”.' : 'Nếu Mục 0 chỉ nhớ được một thứ, hãy nhớ hai phím này. Chúng biến “mình không biết phím tắt” thành “mình gõ điều mình muốn”.'}</p>

<h3>${en ? '🧪 Practice (10 minutes): your starting-speed sheet' : '🧪 Thực hành (10 phút): phiếu đo tốc độ xuất phát'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create a text file <code>toc-do-dau-khoa.txt</code> anywhere outside the project (e.g. your Documents) and copy the sheet below into it.' : 'Tạo file chữ <code>toc-do-dau-khoa.txt</code> ở đâu đó ngoài dự án (ví dụ thư mục Documents) và chép phiếu dưới đây vào.'}</li>
<li>${en ? 'Finish lesson 0.1 first (it creates the <code>labflow-mini</code> project). Then do the five tasks <strong>the way you work today</strong> — mouse, scrolling, whatever you normally do — and time each with your phone.' : 'Làm xong bài 0.1 trước (bài đó tạo dự án <code>labflow-mini</code>). Rồi làm năm việc <strong>theo cách bạn đang làm hiện nay</strong> — chuột, cuộn, cách nào quen cũng được — và bấm giờ từng việc bằng điện thoại.'}</li>
<li>${en ? 'After task 5, run <code>git checkout .</code> in the project to undo your edits so the project is clean for Chapter 1.' : 'Sau việc 5, chạy <code>git checkout .</code> trong dự án để bỏ các thay đổi, giữ dự án sạch cho Chương 1.'}</li>
</ol>
${bash(PHIEU)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'all five lines have a number of seconds, <code>npm test</code> was green after task 3, and <code>git status</code> in <code>labflow-mini</code> shows “nothing to commit” again. Do not try to be fast — an honest slow number makes the Chapter 7 comparison meaningful.' : 'cả năm dòng có số giây, <code>npm test</code> xanh sau việc 3, và <code>git status</code> trong <code>labflow-mini</code> lại báo “nothing to commit”. Đừng cố làm nhanh — một con số chậm mà thật mới làm phép so ở Chương 7 có ý nghĩa.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Regex' : 'Regex (biểu thức chính quy)'}</span><span class="v">${en ? 'A pattern language for matching text; used in search boxes and code.' : 'Ngôn ngữ mẫu để khớp chữ; dùng trong ô tìm kiếm và trong code.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Backtracking' : 'Backtracking (quay lui)'}</span><span class="v">${en ? 'A regex engine undoing and retrying choices; can explode on bad patterns.' : 'Bộ máy regex lùi lại thử cách khác; có thể bùng nổ với mẫu xấu.'}</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">${en ? 'Regular expression Denial of Service: input that makes a regex run for a very long time.' : 'Từ chối dịch vụ bằng regex: đầu vào làm một regex chạy rất lâu.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Postmortem' : 'Postmortem (phân tích sau sự cố)'}</span><span class="v">${en ? 'A written analysis of an incident: what happened, why, what changes.' : 'Bản viết phân tích một sự cố: chuyện gì xảy ra, vì sao, sửa gì.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Health check' : 'Health check (kiểm tra sức khoẻ)'}</span><span class="v">${en ? 'A request the load balancer sends to decide if a server is alive.' : 'Request bộ cân bằng tải gửi để biết máy chủ còn sống không.'}</span></div>
  <div class="kv"><span class="k">Find Action / Command Palette</span><span class="v">${en ? 'A search box for every command of the IDE, showing its shortcut.' : 'Ô tìm kiếm mọi lệnh của IDE, kèm phím tắt của lệnh.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Searching by eye costs hours on a real project; symbol search and Go to Definition cost seconds.' : 'Tìm bằng mắt tốn hàng giờ trên dự án thật; tìm symbol và Go to Definition chỉ tốn vài giây.'}</li>
<li>${en ? 'Renaming by text misses places silently in JavaScript; rename refactoring plus a test run does not.' : 'Đổi tên theo chữ sót chỗ một cách im lặng trong JavaScript; refactor đổi tên kèm chạy test thì không.'}</li>
<li>${en ? 'Stack Overflow (2016) and Cloudflare (2019) went down because of regex backtracking — Chapter 4 teaches regex safely.' : 'Stack Overflow (2016) và Cloudflare (2019) sập vì regex quay lui — Chương 4 dạy regex an toàn.'}</li>
<li>${en ? 'Local History saves code Git never saw; dotfiles make a new machine an hour’s work.' : 'Local History cứu code Git chưa từng thấy; dotfiles biến việc cài máy mới thành việc một giờ.'}</li>
<li>${en ? 'Remember Ctrl+Shift+P / ⇧⌘P (VS Code) and Ctrl+Shift+A / ⇧⌘A (IntelliJ): type what you want.' : 'Nhớ Ctrl+Shift+P / ⇧⌘P (VS Code) và Ctrl+Shift+A / ⇧⌘A (IntelliJ): gõ điều bạn muốn.'}</li>
<li>${en ? 'Record honest starting times now; you compare them in Chapter 7.' : 'Ghi lại thời gian xuất phát thật ngay bây giờ; so lại ở Chương 7.'}</li>
</ul>
${tl('https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/', '📰', 'Cloudflare — Details of the Cloudflare outage on July 2, 2019', en ? 'The regex, the backtracking, the fix' : 'Regex gây sự cố, quay lui, cách sửa')}
${tl('https://mjtsai.com/blog/2016/07/21/this-regular-expression-has-been-replaced-with-a-substring-function/', '📰', 'Michael Tsai — “This regular expression has been replaced with a substring function”', en ? 'Quotes and links the Stack Overflow postmortem of 20 July 2016' : 'Trích và dẫn bản phân tích sự cố Stack Overflow 20/07/2016')}
</div>
`;

/* ═════════════ 0.1 — Cài đặt ═════════════ */
const TAO = `
mkdir -p labflow-mini/src/routes labflow-mini/src/services labflow-mini/src/utils labflow-mini/test labflow-mini/web/src
cd labflow-mini

cat > package.json <<'EOF'
{
  "name": "labflow-mini",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "node --test"
  }
}
EOF

cat > src/server.js <<'EOF'
import { createApp } from './app.js';

const PORT = Number(process.env.PORT || 3000);
createApp().listen(PORT, () => console.log('labflow-mini on http://localhost:' + PORT));
EOF

cat > src/app.js <<'EOF'
import express from 'express';
import { tasksRouter } from './routes/tasks.routes.js';
import { usersRouter } from './routes/users.routes.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/tasks', tasksRouter);
  app.use('/users', usersRouter);
  app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
  return app;
}
EOF

cat > src/routes/tasks.routes.js <<'EOF'
import { Router } from 'express';
import { listTasks, createTask, markDone } from '../services/task.service.js';

export const tasksRouter = Router();

tasksRouter.get('/', (req, res) => res.json(listTasks(req.query.status)));

tasksRouter.post('/', (req, res) => {
  const task = createTask(req.body);
  res.status(201).json(task);
});

tasksRouter.patch('/:id/done', (req, res) => res.json(markDone(Number(req.params.id))));
EOF

cat > src/routes/users.routes.js <<'EOF'
import { Router } from 'express';
import { findUserById, listUsers } from '../services/user.service.js';

export const usersRouter = Router();

usersRouter.get('/', (req, res) => res.json(listUsers()));

usersRouter.get('/:id', (req, res) => {
  const user = findUserById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json(user);
});
EOF

cat > src/services/user.service.js <<'EOF'
const USERS = [
  { id: 1, name: 'An', role: 'LEAD' },
  { id: 2, name: 'Binh', role: 'DEV' },
  { id: 3, name: 'Chi', role: 'DEV' },
];

export function listUsers() {
  return USERS;
}

export function findUserById(id) {
  return USERS.find((u) => u.id === id) || null;
}
EOF

cat > src/services/task.service.js <<'EOF'
import { findUserById } from './user.service.js';
import { formatDueDate } from '../utils/format.js';

const TASKS = [
  { id: 1, title: 'Viet API dang nhap', assigneeId: 1, status: 'TODO', due: '2026-12-01' },
  { id: 2, title: 'Ve man hinh danh sach', assigneeId: 2, status: 'DOING', due: '2026-12-03' },
  { id: 3, title: 'Viet test cho task service', assigneeId: 3, status: 'TODO', due: '2026-12-05' },
];

function toView(task) {
  const user = findUserById(task.assigneeId);
  return { ...task, assignee: user ? user.name : 'Chua giao', dueText: formatDueDate(task.due) };
}

export function listTasks(status) {
  const rows = status ? TASKS.filter((t) => t.status === status) : TASKS;
  return rows.map(toView);
}

export function createTask(input) {
  if (!input || !input.title) {
    const err = new Error('title is required');
    err.status = 400;
    throw err;
  }
  const task = { id: TASKS.length + 1, status: 'TODO', assigneeId: null, due: null, ...input };
  TASKS.push(task);
  return toView(task);
}

export function markDone(id) {
  const task = TASKS.find((t) => t.id === id);
  if (!task) {
    const err = new Error('task not found');
    err.status = 404;
    throw err;
  }
  task.status = 'DONE';
  return toView(task);
}
EOF

cat > src/utils/format.js <<'EOF'
export function formatDueDate(iso) {
  if (!iso) return 'Khong han';
  const [y, m, d] = iso.split('-');
  return d + '/' + m + '/' + y;
}
EOF

cat > test/task.service.test.js <<'EOF'
import test from 'node:test';
import assert from 'node:assert/strict';
import { listTasks, createTask } from '../src/services/task.service.js';
import { formatDueDate } from '../src/utils/format.js';

test('formatDueDate doi yyyy-mm-dd thanh dd/mm/yyyy', () => {
  assert.equal(formatDueDate('2026-12-01'), '01/12/2026');
});

test('listTasks loc theo status', () => {
  assert.ok(listTasks('TODO').every((t) => t.status === 'TODO'));
});

test('createTask bat buoc co title', () => {
  assert.throws(() => createTask({}), /title is required/);
});
EOF

cat > web/src/api.js <<'EOF'
const BASE = 'http://localhost:3000';

export async function fetchTasks(status) {
  const url = status ? BASE + '/tasks?status=' + status : BASE + '/tasks';
  const res = await fetch(url);
  return res.json();
}

export async function markTaskDone(id) {
  const res = await fetch(BASE + '/tasks/' + id + '/done', { method: 'PATCH' });
  return res.json();
}
EOF

cat > web/src/TaskList.jsx <<'EOF'
import { useEffect, useState } from 'react';
import { fetchTasks, markTaskDone } from './api.js';

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => { fetchTasks().then(setTasks); }, []);

  async function onDone(id) {
    await markTaskDone(id);
    setTasks(await fetchTasks());
  }

  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id}>
          {t.title} - {t.assignee} - {t.dueText}
          <button onClick={() => onDone(t.id)}>Done</button>
        </li>
      ))}
    </ul>
  );
}
EOF

cat > .gitignore <<'EOF'
node_modules/
.env
EOF
npm install express@5 --silent
git init -q && git add . && git commit -qm "labflow-mini: diem xuat phat"
echo "XONG: $(pwd)"
`;
const O_TEST = out(`
$ npm test

> labflow-mini@1.0.0 test
> node --test

✔ formatDueDate doi yyyy-mm-dd thanh dd/mm/yyyy (0.443709ms)
✔ listTasks loc theo status (0.587ms)
✔ createTask bat buoc co title (0.27425ms)
ℹ tests 3
ℹ suites 0
ℹ pass 3
ℹ fail 0
…
`
);
const CAI_MAC = bash(`
# macOS — cần Homebrew (https://brew.sh). Mỗi dòng một công cụ.
xcode-select --install                          # Git + công cụ dòng lệnh của Apple (đã có thì báo "already installed")
brew install --cask visual-studio-code          # VS Code
brew install --cask jetbrains-toolbox           # JetBrains Toolbox: cài + cập nhật IntelliJ IDEA
brew install --cask temurin@21                  # JDK 21 (Eclipse Temurin)
brew install fnm                                # trình quản lý phiên bản Node
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
exec zsh                                        # nạp lại shell để fnm có hiệu lực
fnm install 24 && fnm default 24             # Node 24 LTS (bản 22 trở lên đều chạy được labflow-mini)
node -v && npm -v && java -version && git --version
`
);
const CAI_WIN = bash(`
# Windows 10/11 — PowerShell (không cần quyền admin cho phần lớn lệnh). Mỗi dòng một công cụ.
winget install -e --id Git.Git                  # Git + Git Bash
winget install -e --id Microsoft.VisualStudioCode
winget install -e --id JetBrains.Toolbox        # JetBrains Toolbox: cài + cập nhật IntelliJ IDEA
winget install -e --id EclipseAdoptium.Temurin.21.JDK
winget install -e --id Schniz.fnm               # trình quản lý phiên bản Node
# mở PowerShell MỚI rồi:
if (!(Test-Path $PROFILE)) { New-Item $PROFILE -Force }
Add-Content $PROFILE 'fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression'
# mở PowerShell MỚI lần nữa rồi:
fnm install 24; fnm default 24
node -v; npm -v; java -version; git --version
`
);
const SPRING = bash(`
# Mac/Linux/Git Bash:
cd ~/do-nghe
curl -s https://start.spring.io/starter.zip -d type=maven-project -d language=java -d javaVersion=21 \\
  -d dependencies=web -d groupId=com.labflow -d artifactId=gear-mini -d name=gear-mini \\
  -d packageName=com.labflow.gear -o gear-mini.zip
unzip -q gear-mini.zip -d gear-mini && ls gear-mini

# Windows PowerShell: dùng curl.exe (chữ "curl" trơn trong Windows PowerShell 5.1 là bí danh của Invoke-WebRequest)
curl.exe -s https://start.spring.io/starter.zip -d type=maven-project -d language=java -d javaVersion=21 -d dependencies=web -d groupId=com.labflow -d artifactId=gear-mini -d name=gear-mini -d packageName=com.labflow.gear -o gear-mini.zip
Expand-Archive gear-mini.zip -DestinationPath gear-mini
`
);
const O_SPRING = out(`
HELP.md
mvnw
mvnw.cmd
pom.xml
src
`
);
const RUN_TAO = bash(`
mkdir -p ~/do-nghe && cd ~/do-nghe
# (lưu script bên dưới thành tao-labflow-mini.sh rồi:)
bash tao-labflow-mini.sh
cd labflow-mini && npm test
`
);
const L3 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Section 0 · Setup' : 'Mục 0 · Cài đặt'}</span>
<h2>${en ? '0.1 — Installing VS Code and IntelliJ IDEA (free student licence), on Mac and Windows' : '0.1 — Cài VS Code và IntelliJ IDEA (giấy phép sinh viên miễn phí), trên Mac và Windows'}</h2>
<p class="lead">${en
    ? 'By the end of this lesson your machine has VS Code, IntelliJ IDEA, a JDK, Node.js and Git, plus the two sample projects every chapter uses: <code>labflow-mini</code> (Express + a small React folder) and <code>gear-mini</code> (Spring Boot, Maven). If you installed VS Code in the Web Foundations course, skip that part — the rest is new.'
    : 'Hết bài này máy bạn có VS Code, IntelliJ IDEA, JDK, Node.js và Git, cộng hai dự án mẫu mà mọi chương đều dùng: <code>labflow-mini</code> (Express + một thư mục React nhỏ) và <code>gear-mini</code> (Spring Boot, Maven). Nếu bạn đã cài VS Code ở khoá Web Foundations thì bỏ qua phần đó — phần còn lại là mới.'}</p>
<p>${en ? 'Installing VS Code for the very first time, step by step with screenshots, is in ' : 'Cài VS Code lần đầu từng bước có ảnh chụp nằm ở '}${bai('web-foundations', 'wf-1-2-vscode', 'Web Foundations 1.2')}${en ? '. Here we install everything with a package manager, which is faster and is what Chapter 6 automates.' : '. Ở đây ta cài mọi thứ bằng trình quản lý gói (package manager) — nhanh hơn, và đúng là thứ Chương 6 sẽ tự động hoá.'}</p>

<h3>${en ? 'What you install and why' : 'Cài những gì và vì sao'}</h3>
<table>
<thead><tr><th>${en ? 'Tool' : 'Công cụ'}</th><th>${en ? 'Used for' : 'Dùng để'}</th><th>${en ? 'Version in this course' : 'Phiên bản trong khoá'}</th></tr></thead>
<tbody>
<tr><td>VS Code</td><td>${en ? 'Node.js, TypeScript, React (Chapter 1)' : 'Node.js, TypeScript, React (Chương 1)'}</td><td>1.124 (11/2026)</td></tr>
<tr><td>IntelliJ IDEA</td><td>${en ? 'Java, Spring Boot (Chapter 2)' : 'Java, Spring Boot (Chương 2)'}</td><td>${en ? 'latest from Toolbox' : 'bản mới nhất qua Toolbox'}</td></tr>
<tr><td>JDK (Temurin)</td><td>${en ? 'compile and run Java' : 'biên dịch và chạy Java'}</td><td>21</td></tr>
<tr><td>Node.js (${en ? 'via' : 'qua'} fnm)</td><td>${en ? 'run labflow-mini' : 'chạy labflow-mini'}</td><td>${en ? 'current LTS; 22 or newer works' : 'bản LTS hiện tại; từ 22 trở lên đều chạy'}</td></tr>
<tr><td>Git</td><td>${en ? 'version control; Chapter 5' : 'quản lý phiên bản; Chương 5'}</td><td>${en ? 'any recent' : 'bản gần đây bất kỳ'}</td></tr>
</tbody>
</table>
<div class="callout ok"><p>${en
    ? '<strong>Why a version manager for Node?</strong> Different projects need different Node versions. fnm lets you switch per project (it reads <code>.nvmrc</code> or <code>.node-version</code> when you <code>cd</code> into the folder). Installing Node from the website gives you exactly one version, and the day a project needs another you start uninstalling.'
    : '<strong>Vì sao cài Node qua trình quản lý phiên bản?</strong> Mỗi dự án cần một bản Node khác nhau. fnm cho đổi bản theo từng dự án (nó đọc file <code>.nvmrc</code> hoặc <code>.node-version</code> khi bạn <code>cd</code> vào thư mục). Cài Node từ trang chủ thì bạn chỉ có đúng một bản, và hôm nào dự án cần bản khác là bắt đầu gỡ cài.'}</p></div>

<h3>${en ? 'Step 1 — Install everything on macOS' : 'Bước 1 — Cài mọi thứ trên macOS'}</h3>
${CAI_MAC}
<h3>${en ? 'Step 1 — Install everything on Windows' : 'Bước 1 — Cài mọi thứ trên Windows'}</h3>
${CAI_WIN}
<p>${en
    ? 'After installing VS Code on Windows, the <code>code</code> command works in a new terminal (the installer adds it to PATH by default). On macOS you add it yourself once: open VS Code, Command Palette (<code>⇧⌘P</code>), run <strong>Shell Command: Install ‘code’ command in PATH</strong>. Check with <code>code --version</code>.'
    : 'Cài VS Code trên Windows xong, lệnh <code>code</code> dùng được trong terminal mới (bộ cài mặc định thêm vào PATH). Trên macOS bạn tự thêm một lần: mở VS Code, Command Palette (<code>⇧⌘P</code>), chạy <strong>Shell Command: Install ‘code’ command in PATH</strong>. Kiểm bằng <code>code --version</code>.'}</p>

<h3>${en ? 'Step 2 — IntelliJ IDEA and the free student licence' : 'Bước 2 — IntelliJ IDEA và giấy phép sinh viên miễn phí'}</h3>
<p>${en
    ? 'Open JetBrains Toolbox and install <strong>IntelliJ IDEA</strong>. Since version 2025.3 there is a single IntelliJ IDEA product: without a licence you get the free core (Java, Maven, Gradle, Git — everything Chapter 2 needs except a few Ultimate tools); with a licence the Ultimate features unlock (Spring-specific views, Database tools, HTTP Client and more). Older tutorials talk about “Community” and “Ultimate” as two downloads — that is the situation before 2025.3.'
    : 'Mở JetBrains Toolbox và cài <strong>IntelliJ IDEA</strong>. Từ bản 2025.3 chỉ còn một sản phẩm IntelliJ IDEA: không có giấy phép thì bạn dùng phần lõi miễn phí (Java, Maven, Gradle, Git — đủ mọi thứ Chương 2 cần trừ vài công cụ Ultimate); có giấy phép thì mở khoá tính năng Ultimate (giao diện riêng cho Spring, công cụ Database, HTTP Client…). Hướng dẫn cũ nói “Community” và “Ultimate” là hai bản tải riêng — đó là tình hình trước 2025.3.'}</p>
<ol>
<li>${en ? 'Go to the JetBrains Free Educational Licenses page (link at the end), choose <em>Apply now</em> for students and use your <strong>university email</strong> (e.g. <code>…@fpt.edu.vn</code>). An ISIC card or official document also works.' : 'Vào trang JetBrains Free Educational Licenses (link cuối bài), chọn <em>Apply now</em> cho sinh viên và dùng <strong>email trường</strong> (ví dụ <code>…@fpt.edu.vn</code>). Thẻ ISIC hoặc giấy xác nhận chính thức cũng được.'}</li>
<li>${en ? 'Confirm from the email, create or link a JetBrains Account.' : 'Xác nhận qua email, tạo hoặc liên kết JetBrains Account.'}</li>
<li>${en ? 'In IntelliJ: <em>Help → Register…</em> (or the licence dialog on first start) → <em>Log in to JetBrains Account</em>. The licence lasts one year and can be renewed while you are a student.' : 'Trong IntelliJ: <em>Help → Register…</em> (hoặc hộp thoại giấy phép lần đầu mở) → <em>Log in to JetBrains Account</em>. Giấy phép có hạn một năm, gia hạn được khi còn là sinh viên.'}</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Do not use “cracked” licences or keygens' : 'Đừng dùng bản “crack” hay keygen'}</strong></p><p>${en
    ? 'They are a common way malware reaches student laptops — and your laptop holds your GitHub tokens and SSH keys. The student licence is free and legal; the free core is enough for most of this course.'
    : 'Đó là đường phổ biến để mã độc vào laptop sinh viên — mà laptop của bạn giữ token GitHub và khoá SSH. Giấy phép sinh viên miễn phí và hợp pháp; phần lõi miễn phí cũng đủ cho phần lớn khoá này.'}</p></div>

<h3>${en ? 'Step 3 — Create the labflow-mini project (Express + React folder)' : 'Bước 3 — Tạo dự án labflow-mini (Express + thư mục React)'}</h3>
<p>${en
    ? 'This small project is built so that the Chapter 1 exercises have something real to navigate: routes call services, services call each other, a utility is used in several places, a React component calls the API, and there are tests. Create a folder for the course, then in VS Code create a new file (<code>Ctrl+N</code> / <code>⌘N</code>), paste the script below, save it as <code>~/do-nghe/tao-labflow-mini.sh</code> and run it. On Windows run it in <strong>Git Bash</strong> (installed with Git) or WSL.'
    : 'Dự án nhỏ này được dựng để bài tập Chương 1 có thứ thật mà điều hướng: route gọi service, service gọi nhau, một hàm tiện ích được dùng nhiều chỗ, một component React gọi API, và có test. Tạo một thư mục cho khoá, rồi trong VS Code tạo file mới (<code>Ctrl+N</code> / <code>⌘N</code>), dán script dưới đây, lưu thành <code>~/do-nghe/tao-labflow-mini.sh</code> và chạy nó. Trên Windows chạy trong <strong>Git Bash</strong> (cài kèm Git) hoặc WSL.'}</p>
${RUN_TAO}
<details><summary>${en ? 'tao-labflow-mini.sh — click to open (≈200 lines, copy all of it)' : 'tao-labflow-mini.sh — bấm để mở (≈200 dòng, chép toàn bộ)'}</summary>
${bash(TAO)}
</details>
<p>${en ? 'Real output on a Mac (Node 26.8, Express 5.3.0):' : 'Output thật trên Mac (Node 26.8, Express 5.3.0):'}</p>
${O_TEST}
<div class="callout warn"><p>${en
    ? 'If the last step says <code>Please tell me who you are</code>, Git has no name and email yet: run <code>git config --global user.name "Your Name"</code> and <code>git config --global user.email "you@example.com"</code>, then run <code>git add . &amp;&amp; git commit -m "labflow-mini: diem xuat phat"</code> inside the folder. Git identity is covered properly in lesson 6.3.'
    : 'Nếu bước cuối báo <code>Please tell me who you are</code> thì Git chưa có tên và email: chạy <code>git config --global user.name "Ten Ban"</code> và <code>git config --global user.email "ban@example.com"</code>, rồi trong thư mục chạy <code>git add . &amp;&amp; git commit -m "labflow-mini: diem xuat phat"</code>. Danh tính Git được dạy kỹ ở bài 6.3.'}</p></div>
<p>${en ? 'Now open it: <code>code ~/do-nghe/labflow-mini</code>. VS Code asks <em>“Do you trust the authors of the files in this folder?”</em> — you created these files, so choose <strong>Yes, I trust the authors</strong>. Lesson 1.4 explains why you should answer <strong>No</strong> for repositories you have not read.' : 'Giờ mở nó: <code>code ~/do-nghe/labflow-mini</code>. VS Code hỏi <em>“Do you trust the authors of the files in this folder?”</em> (bạn có tin tác giả các file trong thư mục này không) — file do chính bạn tạo, nên chọn <strong>Yes, I trust the authors</strong>. Bài 1.4 giải thích vì sao nên chọn <strong>No</strong> với repo bạn chưa đọc.'}</p>

<h3>${en ? 'Step 4 — Create the gear-mini project (Spring Boot)' : 'Bước 4 — Tạo dự án gear-mini (Spring Boot)'}</h3>
<p>${en
    ? 'Spring Initializr (start.spring.io) generates a Spring Boot project. You can click through the website, or ask it from the terminal — same result:'
    : 'Spring Initializr (start.spring.io) sinh ra một dự án Spring Boot. Bạn có thể bấm trên trang web, hoặc gọi nó từ terminal — kết quả như nhau:'}</p>
${SPRING}
${O_SPRING}
<p>${en
    ? 'On 22/11/2026 this generated Spring Boot 4.2.0. Open it in IntelliJ: <em>File → Open…</em>, choose the <code>gear-mini</code> folder (the one containing <code>pom.xml</code>), click <em>Trust Project</em>. Wait until the progress bar at the bottom finishes “Indexing” and Maven has downloaded the dependencies (first time: a few minutes). Then open <code>GearMiniApplicationTests</code> and click the green ▶ next to the class name. Lesson 2.1 covers what to do when the editor is full of red because the SDK is wrong.'
    : 'Ngày 22/11/2026 lệnh này sinh ra Spring Boot 4.2.0. Mở bằng IntelliJ: <em>File → Open…</em>, chọn thư mục <code>gear-mini</code> (thư mục chứa <code>pom.xml</code>), bấm <em>Trust Project</em>. Chờ thanh tiến trình dưới đáy chạy xong “Indexing” và Maven tải xong thư viện (lần đầu: vài phút). Rồi mở <code>GearMiniApplicationTests</code> và bấm ▶ xanh cạnh tên class. Bài 2.1 dạy cách xử lý khi editor đỏ lòm vì sai SDK.'}</p>

<h3>${en ? 'Common setup problems' : 'Lỗi cài đặt hay gặp'}</h3>
<table>
<thead><tr><th>${en ? 'Symptom' : 'Triệu chứng'}</th><th>${en ? 'Cause and fix' : 'Nguyên nhân và cách sửa'}</th></tr></thead>
<tbody>
<tr><td><code>code: command not found</code> (Mac)</td><td>${en ? 'Run “Shell Command: Install ‘code’ command in PATH” from the Command Palette, open a new terminal.' : 'Chạy “Shell Command: Install ‘code’ command in PATH” trong Command Palette, mở terminal mới.'}</td></tr>
<tr><td><code>node: command not found</code> ${en ? 'after fnm install' : 'sau khi cài fnm'}</td><td>${en ? 'The fnm line was not added to <code>~/.zshrc</code> / <code>$PROFILE</code>, or you did not open a new terminal.' : 'Chưa thêm dòng fnm vào <code>~/.zshrc</code> / <code>$PROFILE</code>, hoặc chưa mở terminal mới.'}</td></tr>
<tr><td><code>running scripts is disabled on this system</code> (PowerShell)</td><td>${en ? 'Execution policy blocks your profile. Run <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code> once (lesson 6.4 explains it).' : 'Execution policy chặn file profile. Chạy một lần <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code> (bài 6.4 giải thích).'}</td></tr>
<tr><td><code>Cannot find package 'express'</code></td><td>${en ? 'The <code>npm install</code> step failed (no network/proxy). Run <code>npm install</code> again inside <code>labflow-mini</code>.' : 'Bước <code>npm install</code> lỗi (mất mạng/proxy). Chạy lại <code>npm install</code> trong <code>labflow-mini</code>.'}</td></tr>
<tr><td>${en ? 'IntelliJ: everything red, “Cannot resolve symbol String”' : 'IntelliJ: đỏ hết, “Cannot resolve symbol String”'}</td><td>${en ? 'No Project SDK. <em>File → Project Structure → SDK</em> → choose 21 (or <em>Download JDK</em>). Details in lesson 2.1.' : 'Chưa chọn Project SDK. <em>File → Project Structure → SDK</em> → chọn 21 (hoặc <em>Download JDK</em>). Chi tiết ở bài 2.1.'}</td></tr>
</tbody>
</table>

<h3>${en ? '🧪 Practice (20 minutes)' : '🧪 Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Install the tools for your OS (Step 1) and print the versions: <code>node -v</code>, <code>java -version</code>, <code>git --version</code>, <code>code --version</code>.' : 'Cài công cụ cho hệ của bạn (Bước 1) và in phiên bản: <code>node -v</code>, <code>java -version</code>, <code>git --version</code>, <code>code --version</code>.'}</li>
<li>${en ? 'Create <code>labflow-mini</code>, run <code>npm test</code>, then <code>npm start</code> and open <code>http://localhost:3000/tasks</code> in the browser. Stop the server with <code>Ctrl+C</code>.' : 'Tạo <code>labflow-mini</code>, chạy <code>npm test</code>, rồi <code>npm start</code> và mở <code>http://localhost:3000/tasks</code> trên trình duyệt. Dừng server bằng <code>Ctrl+C</code>.'}</li>
<li>${en ? 'Create <code>gear-mini</code>, open it in IntelliJ and run <code>GearMiniApplicationTests</code>.' : 'Tạo <code>gear-mini</code>, mở bằng IntelliJ và chạy <code>GearMiniApplicationTests</code>.'}</li>
<li>${en ? 'Fill in your starting-speed sheet from the previous lesson on <code>labflow-mini</code>.' : 'Điền phiếu đo tốc độ xuất phát của bài trước trên <code>labflow-mini</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'four version numbers printed; <code>npm test</code> shows <code>pass 3</code> and <code>fail 0</code>; the browser shows a JSON array of three tasks with a <code>dueText</code> like <code>01/12/2026</code>; IntelliJ shows the test green; and the speed sheet has five numbers.' : 'in ra đủ bốn số phiên bản; <code>npm test</code> báo <code>pass 3</code> và <code>fail 0</code>; trình duyệt hiện mảng JSON ba task có <code>dueText</code> dạng <code>01/12/2026</code>; IntelliJ báo test xanh; và phiếu tốc độ có đủ năm con số.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Package manager' : 'Package manager (trình quản lý gói)'}</span><span class="v">${en ? 'Homebrew (Mac), winget (Windows): install software with one command.' : 'Homebrew (Mac), winget (Windows): cài phần mềm bằng một lệnh.'}</span></div>
  <div class="kv"><span class="k">JDK</span><span class="v">${en ? 'Java Development Kit: compiler and runtime for Java. Temurin is a free build.' : 'Bộ công cụ phát triển Java: trình biên dịch và môi trường chạy. Temurin là một bản miễn phí.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Version manager' : 'Version manager (trình quản lý phiên bản)'}</span><span class="v">${en ? 'fnm, nvm, SDKMAN: several versions side by side, switch per project.' : 'fnm, nvm, SDKMAN: nhiều phiên bản song song, đổi theo dự án.'}</span></div>
  <div class="kv"><span class="k">PATH</span><span class="v">${en ? 'The list of folders the shell searches for commands like <code>code</code>.' : 'Danh sách thư mục mà shell tìm lệnh như <code>code</code>.'}</span></div>
  <div class="kv"><span class="k">Spring Initializr</span><span class="v">${en ? 'start.spring.io — generates a ready-to-run Spring Boot project.' : 'start.spring.io — sinh sẵn một dự án Spring Boot chạy được.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Workspace Trust' : 'Workspace Trust (tin cậy thư mục)'}</span><span class="v">${en ? 'VS Code asks before running code from a folder you just opened.' : 'VS Code hỏi trước khi chạy code từ thư mục vừa mở.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Install with a package manager: brew on Mac, winget on Windows — Chapter 6 turns these lines into a script.' : 'Cài bằng trình quản lý gói: brew trên Mac, winget trên Windows — Chương 6 biến các dòng này thành script.'}</li>
<li>${en ? 'Node goes through fnm so each project can have its own version.' : 'Node cài qua fnm để mỗi dự án có bản riêng.'}</li>
<li>${en ? 'IntelliJ IDEA is one product since 2025.3; the student licence unlocks Ultimate for free.' : 'IntelliJ IDEA là một sản phẩm từ 2025.3; giấy phép sinh viên mở khoá Ultimate miễn phí.'}</li>
<li>${en ? 'labflow-mini (Express + React folder) and gear-mini (Spring Boot) are the projects for every lab.' : 'labflow-mini (Express + thư mục React) và gear-mini (Spring Boot) là dự án của mọi bài lab.'}</li>
<li>${en ? 'Trust only folders whose content you know; never install cracked IDEs.' : 'Chỉ tin thư mục bạn biết nội dung; không cài IDE crack.'}</li>
</ul>
${tl('https://www.jetbrains.com/community/education/#students', '🎓', 'JetBrains — Free Educational Licenses', en ? 'Apply with your university email' : 'Đăng ký bằng email trường')}
${tl('https://code.visualstudio.com/docs/setup/setup-overview', '📘', 'VS Code — Setting up Visual Studio Code', en ? 'Official install guide for macOS, Windows, Linux' : 'Hướng dẫn cài chính thức cho macOS, Windows, Linux')}
${tl('https://github.com/Schniz/fnm', '📘', 'fnm — Fast Node Manager', en ? 'Install and shell setup for zsh, bash, PowerShell' : 'Cài đặt và cấu hình shell cho zsh, bash, PowerShell')}
${tl('https://start.spring.io/', '🌱', 'Spring Initializr', en ? 'Generate Spring Boot projects' : 'Sinh dự án Spring Boot')}
</div>
`;

export default {
  title: 'Section 0 — Tools decide your speed|||Mục 0 — Đồ nghề quyết định tốc độ',
  description: 'Vì sao người mới chậm không phải vì gõ chậm; đo tốc độ xuất phát; cài VS Code, IntelliJ IDEA và hai dự án mẫu.',
  lessons: [
    { title: 'Start here (1/2) — Why fluent tools matter more than typing speed|||Bắt đầu tại đây (1/2) — Vì sao thạo đồ nghề quan trọng hơn gõ nhanh', slug: 'ide-0-8-bat-dau-tai-day', type: 'LESSON', isFreePreview: true, description: 'Thời gian thật ra đi đâu, IDE hiểu code bằng chỉ mục và LSP, lịch sử 1976→2025, số liệu Stack Overflow 2025, lộ trình khoá.', content: L1_EN + L1_VI },
    { title: 'Start here (2/2) — Working without your tools: searching by eye, renaming by hand|||Bắt đầu tại đây (2/2) — Làm việc không có đồ nghề: tìm bằng mắt, đổi tên bằng tay', slug: 'ide-0-9-bat-dau-khi-khong-co', type: 'LESSON', isFreePreview: true, description: 'Sáu câu chuyện (OJT, đồ án, Stack Overflow 2016, Cloudflare 2019, mất code, cài máy) và phiếu đo tốc độ xuất phát.', content: L2(true) + L2(false) },
    { title: '0.1 — Installing VS Code and IntelliJ IDEA (free student licence), on Mac and Windows|||0.1 — Cài VS Code và IntelliJ IDEA (giấy phép sinh viên miễn phí), trên Mac và Windows', slug: 'ide-0-1-cai-dat', type: 'LESSON', isFreePreview: true, description: 'Cài bằng brew/winget, Node qua fnm, IntelliJ một sản phẩm từ 2025.3 + giấy phép sinh viên, tạo hai dự án mẫu labflow-mini và gear-mini.', content: L3(true) + L3(false) },
  ],
};
