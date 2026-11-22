/**
 * 1.4 — Giả thuyết, đọc kỹ thông báo lỗi, biết lúc nào nên hỏi (soạn 22/11/2026).
 * Output chạy THẬT /tmp/dbg-lab/ch1/1-4 (Node v26.8.1, macOS): EADDRINUSE khi chạy server.js lần hai; MODULE_NOT_FOUND
 * khi require('./cau-hinh') mà tệp tên cauHinh.js. lsof chỉ in PID (-t) để không lộ tên tài khoản máy.
 */
import { nguon } from '../_chung.mjs';

const OUT_PORT = `<div class="out">$ node server.js
node:events:505
    throw er; // Unhandled 'error' event
    ^

Error: listen EADDRINUSE: address already in use 127.0.0.1:18130
    at Server.setupListenHandle [as _listen2] (node:net:2328:16)
    at listenInCluster (node:net:2437:12)
…
  code: 'EADDRINUSE',
  errno: -48,
  syscall: 'listen',
  address: '127.0.0.1',
  port: 18130
}

Node.js v26.8.1
$ lsof -t -iTCP:18130 -sTCP:LISTEN
87785
$ ps -o pid=,command= -p 87785
87785 node server.js</div>`;

const OUT_MOD = `<div class="out">$ ls src
app.js
cauHinh.js
$ node src/app.js
node:internal/modules/cjs/loader:1573
  throw err;
  ^

Error: Cannot find module './cau-hinh'
Require stack:
- /private/tmp/dbg-lab/ch1/1-4/src/app.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1569:15)
…
    at Object.&lt;anonymous&gt; (/private/tmp/dbg-lab/ch1/1-4/src/app.js:1:13)
…
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/private/tmp/dbg-lab/ch1/1-4/src/app.js' ]
}</div>`;

const MAU_HOI = `<pre><code class="language-markdown">**Goal:** GET /api/dat-lich/3 should return the booking.
**Actual:** HTTP 500, body {"loi":"Internal Server Error"}; ids 1, 2, 4 work.
**Reproduce:** node server.js, then curl -i http://127.0.0.1:18130/api/dat-lich/3
**Evidence:** fence log shows TypeError: b.batDau.toISOString is not a function (service, line 19);
              typeof batDau = string only for id 3.
**Tried:** (1) restarted server — same; (2) id 2 — works.
**Question:** where should the string → Date conversion live in our project: repo or import script?</code></pre>`;

const NGUON = [
  nguon('📘', 'Google SRE Book — Effective Troubleshooting (Pitfalls)', '"Correlation is not causation", ưu tiên giải thích phổ biến, kiểm giả thuyết bằng thay đổi có kiểm soát.', 'https://sre.google/sre-book/effective-troubleshooting/'),
  nguon('🟢', 'Node.js — Errors: common system errors', 'Danh sách mã lỗi hệ thống EADDRINUSE, ECONNREFUSED, ENOENT… và nghĩa của từng mã.', 'https://nodejs.org/api/errors.html#common-system-errors'),
  nguon('🦆', 'The Pragmatic Programmer — Rubber duck debugging', 'Giải thích từng dòng cho một con vịt cao su: nói ra là thấy giả định sai.', 'https://en.wikipedia.org/wiki/Rubber_duck_debugging'),
].join('\n');

export default {
  title: '1.4 — Hypotheses, reading the error first, and knowing when to ask|||1.4 — Giả thuyết, đọc kỹ thông báo lỗi trước, và biết lúc nào nên hỏi',
  slug: 'dbg-1-4-gia-thuyet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc HẾT thông báo lỗi trước khi đoán (EADDRINUSE và Cannot find module chạy thật), viết giả thuyết bác bỏ được, mỗi lần đổi một thứ, thiên kiến xác nhận và tương quan không phải nhân quả, vịt cao su, quy tắc 30 phút với mẫu câu hỏi, hỏi AI mà không dán bí mật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The error message is the first witness — question it before you start guessing</h2>
<p class="lead">Most wasted debugging hours start the same way: a long red message appears, the eyes jump to the first familiar word, and the hands start changing code. This lesson slows that moment down. Read the whole message, turn it into one hypothesis that could be proven wrong, change one thing at a time, watch out for your own brain's tricks — and know when it is time to ask someone, and how.</p>

<h3>An everyday picture: the warning light on the dashboard</h3>
<p>A light turns on. One driver pulls over and opens the bonnet at random. Another reads the symbol — it is the oil-pressure symbol, not the battery — checks the manual, and knows what to look at. The message already narrowed the problem; ignoring it throws that work away.</p>

<h3>Read the whole message — example 1: the port</h3>
<p>You start the booking API from lesson 1.3 and get this. A guesser sees "Unhandled 'error' event", searches that phrase, and finds a hundred unrelated threads.</p>
${OUT_PORT}
<p>Read it top to bottom and each line has a job: <code>EADDRINUSE</code> is the <strong>code</strong> (address in use), <code>listen</code> is <strong>what was being attempted</strong>, <code>127.0.0.1:18130</code> is <strong>where</strong>. The stack lines are all <code>node:net</code> — none of them is your file, so your code is not where the problem is. Hypothesis: "another process is already listening on 18130." It can be proven wrong in one command — and <code>lsof</code> proves it right: an earlier <code>node server.js</code> you forgot in another terminal. No code change needed.</p>

<h3>Read the whole message — example 2: the module</h3>
<p>A guesser reads "Cannot find module" and runs <code>npm install</code>. That cannot help: npm installs packages, and <code>'./cau-hinh'</code> starts with <code>./</code>, which means <strong>a file of your own, relative to the requiring file</strong>.</p>
${OUT_MOD}
<p>The message says exactly which name was looked for (<code>./cau-hinh</code>), from which file (<code>Require stack: src/app.js</code>, line 1, column 13). <code>ls src</code> shows the file is called <code>cauHinh.js</code>. Hypothesis: "the name in <code>require</code> does not match the file name" — fix the name. One more thing worth knowing: macOS and Windows file systems are usually case-insensitive, Linux is not, so <code>require('./CauHinh')</code> can work on your laptop and fail in the Docker image or on the server (Chapter 9).</p>
<div class="callout warn"><p><strong>A reading routine for any error:</strong> (1) the last line of the message part — the type and the text; (2) the code, such as <code>EADDRINUSE</code> or <code>MODULE_NOT_FOUND</code>; (3) the first stack line that is <em>your</em> file; (4) the extra fields (<code>port</code>, <code>requireStack</code>, <code>syscall</code>). Chapter 2 drills this on Java, JavaScript and Python.</p></div>

<h3>A good hypothesis</h3>
<table>
<thead><tr><th>Weak</th><th>Strong</th></tr></thead>
<tbody>
<tr><td>"Something is wrong with the database."</td><td>"Row 3's <code>batDau</code> is a string, so <code>toISOString</code> does not exist on it."</td></tr>
<tr><td>"Maybe a caching issue."</td><td>"The browser serves the old <code>app.js</code>; with cache disabled the bug disappears."</td></tr>
<tr><td>"Node is broken."</td><td>"Another process holds port 18130; <code>lsof</code> will show its PID."</td></tr>
</tbody>
</table>
<p>A strong hypothesis is <strong>specific</strong> (names a value, a line, a condition) and <strong>falsifiable</strong> (one observation could prove it wrong). If you cannot say what observation would kill it, it is not a hypothesis yet.</p>

<h3>Change one thing at a time</h3>
<p>If you change two things and the bug disappears, you have learned nothing about which one mattered — and you may have introduced a second bug. If a change does not help, <strong>undo it</strong> before trying the next one. Git makes this cheap: <code>git stash</code> or <code>git restore</code> after each failed experiment, and every row in your "Tried | Result" log stays a clean experiment.</p>

<h3>Your brain's two favourite tricks</h3>
<ul>
<li><strong>Confirmation bias</strong> — once you believe "it is the cache", you notice every clue that fits and skip the ones that do not. Defence: before testing, write what result would prove your hypothesis <em>wrong</em>, and look for that.</li>
<li><strong>Correlation is not causation</strong> — the Google SRE Book's warning. "The errors started when Minh deployed" may be true and still not the cause: perhaps a nightly job started at the same minute. Defence: test the hypothesis directly (roll back only that change, or reproduce without it).</li>
</ul>

<h3>Rubber duck debugging</h3>
<p>Explain the code, line by line, out loud, to someone who knows nothing — a colleague, or literally a rubber duck (the name comes from <em>The Pragmatic Programmer</em>). Saying "and here <code>batDau</code> is a Date because…" forces you to notice that you never checked it. Surprisingly often the bug is found before the listener says a word.</p>

<h3>The 30-minute rule, and how to ask</h3>
<p>Stuck for 30 minutes <em>without new information</em>? Ask. Not after three hours — seniors would rather spend five minutes than see you lose a day. But ask in a way that respects their time: the question should contain your debugging log.</p>
${MAU_HOI}
<p>Notice what is not in it: "it does not work, help". Notice also what the question asks: not "fix it", but a decision you cannot make alone. Half the time, writing this message makes you see the answer — the rubber duck again.</p>

<h3>🕵️ Asking an AI or a public forum without leaking secrets</h3>
<p>Pasting the whole project or the whole <code>.env</code> into a chatbot or a forum is a real way secrets leak: database passwords, API keys, JWT secrets, customer emails in a log line. Rules for every question you send outside the company:</p>
<ul>
<li>Send the <strong>minimal reproduction</strong> (lesson 1.2), not the repository. It is safer and gets better answers.</li>
<li>Replace secrets and personal data with placeholders: <code>DATABASE_URL=postgres://USER:PASSWORD@HOST/db</code>, <code>Authorization: Bearer &lt;TOKEN&gt;</code>, <code>email: user@example.com</code>.</li>
<li>Check your company's rules: many forbid pasting internal code into public AI tools at all. During OJT, ask your mentor which tools are approved.</li>
<li>Treat the answer as a hypothesis, not a fix: test it like any other (lesson 2.5 returns to this).</li>
</ul>

<h3>🧪 Practice (15 min) — from message to hypothesis</h3>
<div class="callout ok">
<ol>
<li>Start <code>server.js</code> from 1.3 in two terminals and get <code>EADDRINUSE</code>. Write the hypothesis, then prove it with <code>lsof -t -iTCP:18130 -sTCP:LISTEN</code> (Windows: <code>netstat -ano | findstr 18130</code>). Stop the old process.</li>
<li>Create <code>src/cauHinh.js</code> and <code>src/app.js</code> requiring <code>'./cau-hinh'</code>. Before running, predict the message. Run it. Underline the four parts of the reading routine.</li>
<li>Take any bug from your current school project. Write one weak and one strong hypothesis for it, and the observation that would prove the strong one wrong.</li>
<li>Write a question in the template above about one bug from 1.3, with every secret replaced by a placeholder.</li>
</ol>
<p><strong>Done when:</strong> you proved the port hypothesis with a PID before changing any code, your prediction for the module error matched the real message, and your question contains reproduce + evidence + tried + one specific question, and no real secret.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">falsifiable</span><span class="v">Able to be proven wrong by an observation.</span></div>
  <div class="kv"><span class="k">EADDRINUSE</span><span class="v">"Address already in use": another process listens on that port.</span></div>
  <div class="kv"><span class="k">MODULE_NOT_FOUND</span><span class="v">Node could not resolve the name passed to <code>require</code>.</span></div>
  <div class="kv"><span class="k">confirmation bias</span><span class="v">Seeing only the evidence that fits what you already believe.</span></div>
  <div class="kv"><span class="k">correlation vs causation</span><span class="v">Happening together is not the same as one causing the other.</span></div>
  <div class="kv"><span class="k">rubber duck debugging</span><span class="v">Explaining code aloud, line by line, to find wrong assumptions.</span></div>
  <div class="kv"><span class="k">placeholder</span><span class="v">A fake value (<code>&lt;TOKEN&gt;</code>) that replaces a secret in a shared text.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read the whole message: type and text, code, your first stack line, extra fields.</li>
<li>A hypothesis must be specific and falsifiable; write the observation that would kill it.</li>
<li>Change one thing at a time and undo experiments that did not help.</li>
<li>Beware confirmation bias and correlation-as-causation; test directly.</li>
<li>Stuck 30 minutes without new information: ask, with your log, a specific question — and no secrets.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Thông báo lỗi là nhân chứng đầu tiên — hỏi nó trước khi bắt đầu đoán</h2>
<p class="lead">Phần lớn những giờ gỡ lỗi phí hoài bắt đầu giống nhau: một dòng đỏ dài hiện ra, mắt nhảy tới chữ quen đầu tiên, tay bắt đầu sửa code. Bài này làm chậm khoảnh khắc đó lại. Đọc hết thông báo, biến nó thành một giả thuyết có thể bác bỏ, mỗi lần đổi một thứ, cảnh giác với chiêu lừa của chính bộ não — và biết lúc nào nên hỏi người khác, hỏi thế nào.</p>

<h3>Liên tưởng đời thường: đèn cảnh báo trên táp-lô</h3>
<p>Một đèn sáng lên. Người lái thứ nhất tấp vào lề và mở nắp capo lục bừa. Người thứ hai đọc ký hiệu — đó là ký hiệu áp suất dầu, không phải ắc-quy — tra sổ hướng dẫn, và biết phải nhìn vào đâu. Thông báo đã thu hẹp vấn đề sẵn; bỏ qua nó là vứt đi phần việc đó.</p>

<h3>Đọc hết thông báo — ví dụ 1: cái cổng</h3>
<p>Bạn chạy API đặt lịch ở bài 1.3 và nhận được thứ này. Người đoán mò thấy "Unhandled 'error' event", đem câu đó đi tìm, và gặp cả trăm chủ đề chẳng liên quan.</p>
${OUT_PORT}
<p>Đọc từ trên xuống, dòng nào cũng có việc: <code>EADDRINUSE</code> là <strong>mã lỗi</strong> (địa chỉ đang được dùng), <code>listen</code> là <strong>việc đang cố làm</strong>, <code>127.0.0.1:18130</code> là <strong>ở đâu</strong>. Các dòng stack đều là <code>node:net</code> — không dòng nào là tệp của bạn, nên vấn đề không nằm trong code của bạn. Giả thuyết: "đã có tiến trình khác nghe ở cổng 18130." Một lệnh là bác bỏ được — và <code>lsof</code> xác nhận nó đúng: một <code>node server.js</code> lúc nãy bạn quên ở terminal khác. Không cần sửa dòng code nào.</p>

<h3>Đọc hết thông báo — ví dụ 2: module</h3>
<p>Người đoán mò đọc "Cannot find module" và chạy <code>npm install</code>. Việc đó không thể giúp: npm cài gói thư viện, còn <code>'./cau-hinh'</code> bắt đầu bằng <code>./</code>, nghĩa là <strong>một tệp của chính bạn, tính từ tệp đang gọi require</strong>.</p>
${OUT_MOD}
<p>Thông báo nói chính xác tên nào được tìm (<code>./cau-hinh</code>), từ tệp nào (<code>Require stack: src/app.js</code>, dòng 1, cột 13). <code>ls src</code> cho thấy tệp tên là <code>cauHinh.js</code>. Giả thuyết: "tên trong <code>require</code> không khớp tên tệp" — sửa tên. Thêm một điều đáng biết: hệ thống tệp của macOS và Windows thường không phân biệt hoa thường, Linux thì có, nên <code>require('./CauHinh')</code> có thể chạy trên laptop của bạn và hỏng trong ảnh Docker hoặc trên server (Chương 9).</p>
<div class="callout warn"><p><strong>Thứ tự đọc cho mọi lỗi:</strong> (1) dòng cuối của phần thông điệp — loại lỗi và câu chữ; (2) mã lỗi, như <code>EADDRINUSE</code> hay <code>MODULE_NOT_FOUND</code>; (3) dòng stack đầu tiên là tệp <em>của bạn</em>; (4) các trường thêm (<code>port</code>, <code>requireStack</code>, <code>syscall</code>). Chương 2 luyện kỹ việc này với Java, JavaScript và Python.</p></div>

<h3>Thế nào là giả thuyết tốt</h3>
<table>
<thead><tr><th>Yếu</th><th>Mạnh</th></tr></thead>
<tbody>
<tr><td>"Có gì đó sai với cơ sở dữ liệu."</td><td>"<code>batDau</code> của bản ghi 3 là chuỗi, nên nó không có <code>toISOString</code>."</td></tr>
<tr><td>"Chắc do cache."</td><td>"Trình duyệt dùng <code>app.js</code> cũ; tắt cache thì hết lỗi."</td></tr>
<tr><td>"Node bị hỏng."</td><td>"Tiến trình khác đang giữ cổng 18130; <code>lsof</code> sẽ in ra PID của nó."</td></tr>
</tbody>
</table>
<p>Giả thuyết mạnh thì <strong>cụ thể</strong> (gọi tên một giá trị, một dòng, một điều kiện) và <strong>bác bỏ được (falsifiable)</strong> (một quan sát có thể chứng minh nó sai). Nếu bạn không nói được quan sát nào sẽ bác nó, thì nó chưa phải giả thuyết.</p>

<h3>Mỗi lần đổi một thứ</h3>
<p>Đổi hai thứ mà lỗi biến mất thì bạn không biết được thứ nào quan trọng — và có khi còn tạo thêm lỗi thứ hai. Một thay đổi không giúp được thì <strong>hoàn tác nó</strong> trước khi thử cái tiếp theo. Git làm việc này rẻ: <code>git stash</code> hoặc <code>git restore</code> sau mỗi lần thử hỏng, và mỗi dòng "Đã thử | Kết quả" trong nhật ký là một thí nghiệm sạch.</p>

<h3>Hai chiêu ưa thích của bộ não</h3>
<ul>
<li><strong>Confirmation bias (thiên kiến xác nhận)</strong> — một khi đã tin "là do cache", bạn để ý mọi manh mối khớp và lướt qua những cái không khớp. Cách phòng: trước khi kiểm, viết ra kết quả nào sẽ chứng minh giả thuyết <em>sai</em>, rồi đi tìm đúng kết quả đó.</li>
<li><strong>Tương quan không phải nhân quả</strong> — lời cảnh báo của sách Google SRE. "Lỗi bắt đầu đúng lúc Minh deploy" có thể đúng mà vẫn không phải nguyên nhân: biết đâu một job chạy đêm khởi động cùng phút đó. Cách phòng: kiểm thẳng giả thuyết (chỉ hoàn tác đúng thay đổi đó, hoặc tái hiện khi không có nó).</li>
</ul>

<h3>Gỡ lỗi kiểu vịt cao su</h3>
<p>Giải thích code, từng dòng, thành tiếng, cho một người chẳng biết gì — một đồng nghiệp, hoặc đúng nghĩa đen là một con vịt cao su (tên gọi lấy từ sách <em>The Pragmatic Programmer</em>). Nói ra câu "và ở đây <code>batDau</code> là Date vì…" ép bạn nhận ra mình chưa từng kiểm điều đó. Thường thì lỗi được tìm ra trước khi người nghe kịp nói câu nào.</p>

<h3>Quy tắc 30 phút, và cách hỏi</h3>
<p>Bí 30 phút <em>mà không có thông tin mới</em>? Hỏi. Đừng đợi ba tiếng — người đi trước thà mất năm phút còn hơn thấy bạn mất cả ngày. Nhưng hỏi sao cho tôn trọng thời gian của họ: câu hỏi nên chứa sẵn nhật ký gỡ lỗi của bạn.</p>
${MAU_HOI}
<p>Để ý thứ không có trong đó: "không chạy, giúp em với". Để ý cả thứ câu hỏi hỏi: không phải "sửa giùm", mà là một quyết định bạn không tự đưa ra được. Một nửa số lần, chỉ viết xong tin nhắn này là bạn đã thấy đáp án — lại là con vịt cao su.</p>

<h3>🕵️ Hỏi AI hoặc diễn đàn công khai mà không lộ bí mật</h3>
<p>Dán cả dự án hay cả tệp <code>.env</code> vào chatbot hoặc diễn đàn là một đường lộ bí mật có thật: mật khẩu CSDL, khoá API, khoá ký JWT, email khách hàng nằm trong một dòng log. Luật cho mọi câu hỏi gửi ra ngoài công ty:</p>
<ul>
<li>Gửi <strong>bản tái hiện tối giản</strong> (bài 1.2), không gửi cả repo. An toàn hơn và được trả lời tốt hơn.</li>
<li>Thay bí mật và dữ liệu cá nhân bằng chỗ giữ (placeholder): <code>DATABASE_URL=postgres://USER:PASSWORD@HOST/db</code>, <code>Authorization: Bearer &lt;TOKEN&gt;</code>, <code>email: user@example.com</code>.</li>
<li>Xem quy định công ty: nhiều nơi cấm hẳn dán code nội bộ vào công cụ AI công cộng. Khi OJT, hỏi mentor công cụ nào được phép.</li>
<li>Coi câu trả lời là giả thuyết, không phải bản sửa: kiểm nó như mọi giả thuyết khác (bài 2.5 quay lại chuyện này).</li>
</ul>

<h3>🧪 Thực hành (15 phút) — từ thông báo tới giả thuyết</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>server.js</code> của bài 1.3 ở hai terminal để nhận <code>EADDRINUSE</code>. Viết giả thuyết, rồi chứng minh bằng <code>lsof -t -iTCP:18130 -sTCP:LISTEN</code> (Windows: <code>netstat -ano | findstr 18130</code>). Tắt tiến trình cũ.</li>
<li>Tạo <code>src/cauHinh.js</code> và <code>src/app.js</code> gọi <code>require('./cau-hinh')</code>. Trước khi chạy, đoán thông báo lỗi. Chạy thật. Gạch chân bốn phần của thứ tự đọc.</li>
<li>Lấy một lỗi bất kỳ trong đồ án đang làm. Viết một giả thuyết yếu và một giả thuyết mạnh, kèm quan sát sẽ bác bỏ giả thuyết mạnh.</li>
<li>Viết một câu hỏi theo mẫu trên về một lỗi ở bài 1.3, mọi bí mật đều thay bằng placeholder.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chứng minh giả thuyết về cổng bằng một PID trước khi sửa dòng code nào, lời đoán cho lỗi module khớp thông báo thật, và câu hỏi có đủ tái hiện + bằng chứng + đã thử + một câu hỏi cụ thể, không có bí mật thật nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">falsifiable (bác bỏ được)</span><span class="v">Có thể bị một quan sát chứng minh là sai.</span></div>
  <div class="kv"><span class="k">EADDRINUSE</span><span class="v">"Địa chỉ đang được dùng": tiến trình khác đang nghe ở cổng đó.</span></div>
  <div class="kv"><span class="k">MODULE_NOT_FOUND</span><span class="v">Node không tìm ra tên truyền vào <code>require</code>.</span></div>
  <div class="kv"><span class="k">confirmation bias (thiên kiến xác nhận)</span><span class="v">Chỉ thấy bằng chứng khớp với điều mình đã tin.</span></div>
  <div class="kv"><span class="k">correlation vs causation (tương quan vs nhân quả)</span><span class="v">Xảy ra cùng lúc không có nghĩa cái này gây ra cái kia.</span></div>
  <div class="kv"><span class="k">rubber duck debugging (gỡ lỗi vịt cao su)</span><span class="v">Giải thích code thành tiếng từng dòng để lộ giả định sai.</span></div>
  <div class="kv"><span class="k">placeholder (chỗ giữ)</span><span class="v">Giá trị giả (<code>&lt;TOKEN&gt;</code>) thay cho bí mật trong văn bản chia sẻ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc hết thông báo: loại và câu chữ, mã lỗi, dòng stack đầu tiên của bạn, các trường thêm.</li>
<li>Giả thuyết phải cụ thể và bác bỏ được; viết ra quan sát sẽ giết nó.</li>
<li>Mỗi lần đổi một thứ và hoàn tác những lần thử không giúp được.</li>
<li>Cảnh giác thiên kiến xác nhận và nhầm tương quan với nhân quả; kiểm thẳng.</li>
<li>Bí 30 phút không có thông tin mới: hỏi, kèm nhật ký, một câu hỏi cụ thể — và không có bí mật.</li>
</ul>
${NGUON}
</div>
`,
};
