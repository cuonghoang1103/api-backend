/**
 * 2.5 — Tra cứu lỗi cho đúng: docs, issue, Stack Overflow, AI (soạn 22/11/2026).
 * Output + mã chạy THẬT: _out-2-5.mjs (Express 4.22.2 mặc định lộ stack khi NODE_ENV khác production; script lam-sach.sh che bí mật).
 * Token trong log mẫu là giả rõ ràng (FAKE-TOKEN-0000, FAKE.JWT.TOKEN) để gitleaks sạch.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { P } from './_out-2-5.mjs';

const O = (k) => `<div class="out">${P[k]}</div>`;
const C = (k, lang) => `<pre><code class="language-${lang}">${P[k]}</code></pre>`;

const NGUON = [
  nguon('🛡️', 'OWASP — Error Handling Cheat Sheet', 'Không trả chi tiết lỗi cho client; ghi chi tiết ở server, trả mã tham chiếu.', 'https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html'),
  nguon('🚂', 'Express — Production best practices: security', 'Đặt NODE_ENV=production, tắt X-Powered-By, xử lý lỗi đúng cách.', 'https://expressjs.com/en/advanced/best-practice-security.html'),
  nguon('🐙', 'GitHub Docs — Searching issues and pull requests', 'Cú pháp is:issue, repo:, in:title để tìm đúng lỗi trong kho của thư viện.', 'https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests'),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-10-8-log-cau-truc', title: 'Log từ A đến Z — Log có cấu trúc', sub: 'Ghi log sao cho dễ tìm và không chứa bí mật ngay từ đầu.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '2.5 — Searching an error well: docs, issues, Stack Overflow, AI|||2.5 — Tra cứu lỗi cho đúng: docs, issue, Stack Overflow, AI',
  slug: 'dbg-2-5-tra-cuu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chép phần ổn định của lỗi, bỏ id/giờ/đường dẫn; tìm theo thứ tự docs → issue GitHub + changelog → Stack Overflow → AI; kiểm đáp án như kiểm giả thuyết. Góc hacker chạy thật: Express 4 mặc định trả cả stack trace (đường dẫn, thư viện) cho người lạ khi quên NODE_ENV=production; script che token/email trước khi dán log ra ngoài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Search the part of the error that is the same for everyone — and never paste what is only yours</h2>
<p class="lead">Searching an error is a skill, not luck. Paste a whole log line and you get nothing, because nobody else has your timestamp, your request id or your home folder. Paste the stable part and you find the GitHub issue where the library's author explains it. This lesson gives you a search order, a cleaning script, and two warnings: answers must be tested like hypotheses, and error output itself can leak secrets — to forums, to AI tools, and to attackers.</p>

<h3>An everyday picture: describing a car fault to a mechanic on the phone</h3>
<p>"Toyota Vios 2019, warning light P0420 after a cold start" gets a useful answer. "My car, the one parked outside my house, made a noise at 7:42 this morning" does not. Model and code are the stable part; your street and the exact minute are noise.</p>

<h3>1. Clean the error before you search</h3>
<p>Two real-looking log lines of the same bug, from two developers' machines:</p>
${O('L1')}
<p>Keep: the error type and message (<code>TypeError: b.batDau.toISOString is not a function</code>), library and version names, error codes. Remove: timestamps, request ids, user emails, tokens, absolute paths, ids in URLs. A small script does it consistently:</p>
${C('SH', 'bash')}
${O('L2')}
<p>Now both lines say the same thing, and the cleaned text is safe to paste into a chat with a teammate, a GitHub issue or an AI tool. For a search engine, go one step shorter: the most specific stable fragment, in quotes, plus the technology — for example <code>"toISOString is not a function" node</code>.</p>

<h3>2. Where to look, in order</h3>
<table>
<thead><tr><th>Order</th><th>Source</th><th>Why</th></tr></thead>
<tbody>
<tr><td>1</td><td>The official docs for the exact error or API (Node errors page, Spring reference, Python docs)</td><td>Authoritative, matches the version you use</td></tr>
<tr><td>2</td><td>The library's GitHub issues + its changelog / release notes for your version</td><td>Real bugs and breaking changes, often with the maintainer's explanation; search <code>is:issue "message"</code> in that repo</td></tr>
<tr><td>3</td><td>Stack Overflow</td><td>Many answers are for old versions — check the date and the version in the question</td></tr>
<tr><td>4</td><td>AI assistants</td><td>Fast at explaining a message; can be confidently wrong about versions and invent APIs</td></tr>
</tbody>
</table>
<p>Before searching anywhere, check your version: <code>npm ls express</code>, <code>mvn dependency:tree</code>, <code>python3 --version</code>. "Works in the answer, fails for me" is very often a version difference (lesson 2.3: Express 4 vs 5 behave differently on async errors).</p>

<h3>3. Treat every answer as a hypothesis</h3>
<ul>
<li>Can you explain <em>why</em> the suggested change removes the cause? If not, you are copying a symptom fix.</li>
<li>Test it the way you test your own hypotheses: reproduce → apply one change → reproduce again → keep the regression test.</li>
<li>Be suspicious of answers that disable a check (<code>--force</code>, <code>@ts-ignore</code>, turning off SSL verification, catching and ignoring everything). They make the message disappear, not the bug.</li>
</ul>

<h3>🕵️ Hacker's corner — your error output is reconnaissance for an attacker</h3>
<p>The first place a stack trace leaks is not a forum — it is your own server's response. Here is a three-line Express 4 route that crashes on a missing invoice:</p>
${C('LO', 'js')}
${O('E1')}
<p>A stranger sending one request now knows your framework, the absolute folder layout on the server, that you use Express 4 (<code>lib/router/layer.js</code>) and the line of your code that crashed — useful for finding known vulnerabilities or guessing other files. This happens because Express's built-in error handler prints the stack whenever <code>NODE_ENV</code> is not <code>production</code>. The same app started with <code>NODE_ENV=production</code>:</p>
${O('E2')}
<p>Only <code>Internal Server Error</code>. Notice one remaining leak: <code>X-Powered-By: Express</code> still announces the framework — <code>app.disable('x-powered-by')</code> removes it. <strong>How to defend:</strong> always set <code>NODE_ENV=production</code> in production; have your own error handler that logs the details on the server and returns a generic message plus a reference id (as in lesson 2.3); in Spring Boot keep <code>server.error.include-stacktrace</code> at its default <code>never</code>; never forward <code>err.message</code> from the database to the client.</p>
<p>The second leak is you: pasting an uncleaned log into a public forum or a public AI tool can publish tokens, customer emails and internal hostnames. Run the cleaning script first, and follow your company's rules about which AI tools are allowed.</p>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<ol>
<li>Create <code>log-loi.txt</code> and <code>lam-sach.sh</code>; run it and confirm no email, token, id, time or home path remains.</li>
<li>Add a third log line of your own containing <code>password=…</code> and a phone number; extend the script until both are masked.</li>
<li>Run <code>lo.js</code> (Express 4) without and with <code>NODE_ENV=production</code>; save both responses. Then add <code>app.disable('x-powered-by')</code> and your own error handler returning <code>{ "loi": "…", "ma": "&lt;id&gt;" }</code>.</li>
<li>Take one error from Chapter 2 and search it in the order of the table. Write which source answered it and for which version.</li>
</ol>
<p><strong>Done when:</strong> the cleaned log contains only placeholders for personal or secret data; the production response contains no path, no stack and no <code>X-Powered-By</code>; and your search note names the source and the version it applies to.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stable part</span><span class="v">The text of an error that is the same on every machine: type, message, code.</span></div>
  <div class="kv"><span class="k">redact / mask</span><span class="v">Replace secrets and personal data with placeholders before sharing.</span></div>
  <div class="kv"><span class="k">changelog / release notes</span><span class="v">The list of changes per version — where breaking changes are announced.</span></div>
  <div class="kv"><span class="k">information disclosure</span><span class="v">A response that tells outsiders about your internals.</span></div>
  <div class="kv"><span class="k">NODE_ENV=production</span><span class="v">The setting that makes Express (and many libraries) hide stack traces.</span></div>
  <div class="kv"><span class="k">reference id</span><span class="v">An id returned to the user that lets you find the full error in your logs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Search the stable part (type, message, code, library + version); strip times, ids, paths, emails, tokens.</li>
<li>Order: official docs → GitHub issues + changelog → Stack Overflow → AI; always check versions.</li>
<li>Every answer is a hypothesis: explain it, test it, keep the regression test; distrust "turn the check off".</li>
<li>Express 4 shows stack traces to anyone unless <code>NODE_ENV=production</code>; return a generic message + reference id.</li>
<li>Clean logs before pasting them anywhere outside your team.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Tra phần lỗi giống nhau với mọi người — và đừng bao giờ dán phần chỉ của riêng bạn</h2>
<p class="lead">Tra cứu lỗi là kỹ năng, không phải may rủi. Dán nguyên một dòng log thì chẳng ra gì, vì không ai khác có mốc giờ, mã request hay thư mục nhà của bạn. Dán đúng phần ổn định thì bạn tìm thấy issue GitHub nơi chính tác giả thư viện giải thích. Bài này cho bạn một thứ tự tra cứu, một script làm sạch, và hai lời cảnh báo: câu trả lời phải được kiểm như giả thuyết, và chính output lỗi có thể làm lộ bí mật — ra diễn đàn, vào công cụ AI, và tới tay kẻ tấn công.</p>

<h3>Liên tưởng đời thường: tả bệnh xe cho thợ qua điện thoại</h3>
<p>"Toyota Vios 2019, đèn báo P0420 sau khi nổ máy lúc nguội" sẽ nhận được câu trả lời có ích. "Xe của em, cái đậu trước nhà em, kêu lúc 7:42 sáng nay" thì không. Đời xe và mã lỗi là phần ổn định; tên đường và phút chính xác là nhiễu.</p>

<h3>1. Làm sạch lỗi trước khi tra</h3>
<p>Hai dòng log trông như thật của cùng một lỗi, từ máy của hai lập trình viên:</p>
${O('L1')}
<p>Giữ lại: loại lỗi và thông điệp (<code>TypeError: b.batDau.toISOString is not a function</code>), tên thư viện và phiên bản, mã lỗi. Bỏ đi: mốc giờ, mã request, email người dùng, token, đường dẫn tuyệt đối, id trong URL. Một script nhỏ làm việc đó lần nào cũng như lần nào:</p>
${C('SH', 'bash')}
${O('L2')}
<p>Giờ hai dòng nói cùng một điều, và đoạn đã làm sạch an toàn để dán vào chat với đồng nghiệp, một issue GitHub hay một công cụ AI. Với máy tìm kiếm thì rút gọn thêm một bước: mẩu ổn định cụ thể nhất, đặt trong ngoặc kép, cộng tên công nghệ — ví dụ <code>"toISOString is not a function" node</code>.</p>

<h3>2. Tìm ở đâu, theo thứ tự nào</h3>
<table>
<thead><tr><th>Thứ tự</th><th>Nguồn</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tài liệu chính thức cho đúng lỗi hoặc API đó (trang lỗi của Node, tài liệu Spring, docs Python)</td><td>Có thẩm quyền, khớp phiên bản bạn đang dùng</td></tr>
<tr><td>2</td><td>Issue GitHub của thư viện + changelog / release notes của phiên bản bạn dùng</td><td>Bug thật và thay đổi phá vỡ tương thích, thường kèm giải thích của người bảo trì; tìm <code>is:issue "thông điệp"</code> trong đúng repo đó</td></tr>
<tr><td>3</td><td>Stack Overflow</td><td>Nhiều câu trả lời cho phiên bản cũ — xem ngày và phiên bản trong câu hỏi</td></tr>
<tr><td>4</td><td>Trợ lý AI</td><td>Giải thích thông điệp nhanh; có thể sai một cách tự tin về phiên bản và bịa ra API</td></tr>
</tbody>
</table>
<p>Trước khi tra ở đâu, kiểm phiên bản của bạn: <code>npm ls express</code>, <code>mvn dependency:tree</code>, <code>python3 --version</code>. "Câu trả lời chạy, máy mình thì không" rất hay là do khác phiên bản (bài 2.3: Express 4 và 5 xử lý lỗi async khác nhau).</p>

<h3>3. Coi mọi câu trả lời là một giả thuyết</h3>
<ul>
<li>Bạn giải thích được <em>vì sao</em> thay đổi được gợi ý gỡ được nguyên nhân không? Không thì bạn đang chép một bản sửa triệu chứng.</li>
<li>Kiểm nó như kiểm giả thuyết của chính bạn: tái hiện → áp một thay đổi → tái hiện lại → giữ test chặn tái phát.</li>
<li>Nghi ngờ những câu trả lời tắt một phép kiểm (<code>--force</code>, <code>@ts-ignore</code>, tắt kiểm chứng chỉ SSL, bắt rồi bỏ qua mọi lỗi). Chúng làm thông báo biến mất, không làm lỗi biến mất.</li>
</ul>

<h3>🕵️ Góc hacker — output lỗi của bạn là tài liệu trinh sát cho kẻ tấn công</h3>
<p>Nơi đầu tiên stack trace bị lộ không phải diễn đàn — mà là phản hồi của chính server bạn. Đây là một route Express 4 ba dòng, sập khi không tìm thấy hoá đơn:</p>
${C('LO', 'js')}
${O('E1')}
<p>Một người lạ gửi đúng một request giờ đã biết framework của bạn, cấu trúc thư mục tuyệt đối trên server, rằng bạn dùng Express 4 (<code>lib/router/layer.js</code>) và dòng code nào của bạn bị sập — đủ để đi tìm lỗ hổng đã biết hoặc đoán các tệp khác. Chuyện này xảy ra vì error handler có sẵn của Express in stack bất cứ khi nào <code>NODE_ENV</code> không phải <code>production</code>. Cùng ứng dụng đó chạy với <code>NODE_ENV=production</code>:</p>
${O('E2')}
<p>Chỉ còn <code>Internal Server Error</code>. Để ý vẫn còn một chỗ lộ: <code>X-Powered-By: Express</code> vẫn khai tên framework — <code>app.disable('x-powered-by')</code> gỡ nó đi. <strong>Cách phòng:</strong> luôn đặt <code>NODE_ENV=production</code> trên production; có error handler riêng ghi chi tiết ở server và trả về thông điệp chung kèm mã tham chiếu (như bài 2.3); với Spring Boot, giữ <code>server.error.include-stacktrace</code> ở mặc định <code>never</code>; không bao giờ chuyển nguyên <code>err.message</code> của CSDL về cho client.</p>
<p>Chỗ lộ thứ hai là chính bạn: dán một đoạn log chưa làm sạch lên diễn đàn công khai hay công cụ AI công cộng có thể công bố token, email khách hàng và tên máy nội bộ. Chạy script làm sạch trước, và theo quy định của công ty về công cụ AI nào được dùng.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo <code>log-loi.txt</code> và <code>lam-sach.sh</code>; chạy và xác nhận không còn email, token, id, giờ hay đường dẫn thư mục nhà.</li>
<li>Thêm dòng log thứ ba của bạn có <code>password=…</code> và một số điện thoại; mở rộng script tới khi cả hai bị che.</li>
<li>Chạy <code>lo.js</code> (Express 4) khi không có và có <code>NODE_ENV=production</code>; lưu cả hai phản hồi. Rồi thêm <code>app.disable('x-powered-by')</code> và error handler riêng trả về <code>{ "loi": "…", "ma": "&lt;id&gt;" }</code>.</li>
<li>Lấy một lỗi bất kỳ ở Chương 2 và tra theo thứ tự trong bảng. Ghi nguồn nào trả lời được, cho phiên bản nào.</li>
</ol>
<p><strong>Đạt khi:</strong> log đã làm sạch chỉ còn placeholder thay cho dữ liệu cá nhân hay bí mật; phản hồi production không có đường dẫn, không có stack, không có <code>X-Powered-By</code>; và ghi chú tra cứu nêu rõ nguồn cùng phiên bản áp dụng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stable part (phần ổn định)</span><span class="v">Phần chữ của lỗi giống nhau trên mọi máy: loại, thông điệp, mã.</span></div>
  <div class="kv"><span class="k">redact / mask (che)</span><span class="v">Thay bí mật và dữ liệu cá nhân bằng placeholder trước khi chia sẻ.</span></div>
  <div class="kv"><span class="k">changelog / release notes (nhật ký thay đổi)</span><span class="v">Danh sách thay đổi theo phiên bản — nơi công bố thay đổi phá vỡ tương thích.</span></div>
  <div class="kv"><span class="k">information disclosure (lộ thông tin)</span><span class="v">Phản hồi kể cho người ngoài về bên trong hệ thống của bạn.</span></div>
  <div class="kv"><span class="k">NODE_ENV=production</span><span class="v">Thiết lập khiến Express (và nhiều thư viện) giấu stack trace.</span></div>
  <div class="kv"><span class="k">reference id (mã tham chiếu)</span><span class="v">Mã trả cho người dùng để bạn tìm ra lỗi đầy đủ trong log.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tra phần ổn định (loại, thông điệp, mã, thư viện + phiên bản); bỏ giờ, id, đường dẫn, email, token.</li>
<li>Thứ tự: docs chính thức → issue GitHub + changelog → Stack Overflow → AI; luôn kiểm phiên bản.</li>
<li>Mọi câu trả lời là giả thuyết: giải thích được, kiểm được, giữ test; nghi ngờ kiểu "tắt phép kiểm đi".</li>
<li>Express 4 cho mọi người xem stack trace trừ khi <code>NODE_ENV=production</code>; trả thông điệp chung + mã tham chiếu.</li>
<li>Làm sạch log trước khi dán ra bất cứ đâu ngoài nhóm.</li>
</ul>
${NGUON}
</div>
`,
};
