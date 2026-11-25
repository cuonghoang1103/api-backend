/**
 * 9.3 — Tệp HAR: đọc bằng jq, tìm bí mật, làm sạch (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s09/har'] — HAR 1.2 ghi bởi Playwright 1.61 (recordHar) trên Chrome 150, jq 1.7; công cụ che-har.jq, tim-bi-mat.bash.
 * Bước "sanitized" mô phỏng đúng thứ Chrome 130+ bỏ khi xuất mặc định (header Cookie, Set-Cookie, Authorization — theo "What's new in DevTools 130").
 * Sự cố Okta 2023: số liệu và mốc lấy từ bài RCA của Okta (3/11/2023) và bài của Cloudflare (20/10 và 26/10/2023).
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '9.3 — HAR files: export, read with jq, find the secrets inside, and sanitise before sharing|||9.3 — Tệp HAR: xuất, đọc bằng jq, tìm bí mật bên trong, và làm sạch trước khi gửi đi',
  slug: 'log-9-3-har',
  type: 'LESSON',
  isFreePreview: true,
  description: 'HAR là cả bảng Network lưu thành một tệp JSON — tệp log mang đi được, và cũng là một túi đầy thông tin đăng nhập. Ghi một HAR thật của Lab 9, đọc cấu trúc log/pages/entries/timings, dùng jq lập bảng request, lọc lỗi, tìm request chậm, đọc header + thân phản hồi lỗi; đếm bí mật có trong tệp (Authorization, JWT, mật khẩu trong body, Set-Cookie, token trên URL); thấy vì sao chế độ xuất "sanitized" mặc định của Chrome 130+ vẫn để sót; làm sạch đầy đủ bằng một script jq và kiểm lại. Góc hacker: vụ lộ hệ thống hỗ trợ của Okta 9–10/2023 — HAR chứa token phiên, 134 khách hàng, 5 phiên bị chiếm, và một kiểu sự kiện log khác làm cuộc điều tra sót hai tuần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>HAR: the whole Network panel in one file — evidence and danger</h2>
<p class="lead">A HAR file (HTTP Archive) is everything the Network panel saw, saved as JSON: every request and response, headers, cookies, bodies and timings. Support teams ask for it because it lets them see your problem without your computer. That is also why it is dangerous: a HAR of a logged-in session is a copy of your login. This lesson reads HAR files with <code>jq</code> like any other log, and cleans them before they leave your machine.</p>

<h3>The everyday picture: the shop's CCTV recording</h3>
<p>When something goes missing, the shop sends the CCTV clip to the police — very useful. But the clip also shows every customer typing their PIN at the counter. Before sending, a careful manager blurs the keypad. A HAR is the clip; sanitising is the blur.</p>

<h3>Where HAR files come from</h3>
<ul>
<li><strong>History:</strong> the format was designed around 2009 by the authors of Firebug and HttpWatch so tools could exchange recordings; version 1.2 is what everyone uses. A W3C draft was started and then abandoned — HAR is a de facto standard, not an official one.</li>
<li><strong>Chrome/Edge:</strong> Network panel → the download arrow (<em>Export HAR</em>). Since <strong>Chrome 130</strong> (October 2024) the default export is <strong>"Export HAR (sanitized)"</strong>, which leaves out <code>Cookie</code>, <code>Set-Cookie</code> and <code>Authorization</code> headers; the full version needs Settings → Preferences → Network → <em>Allow to generate HAR with sensitive data</em>, then long-press the button.</li>
<li><strong>Firefox:</strong> Network panel → right-click → <em>Save All As HAR</em>. <strong>Safari:</strong> Network tab → Export.</li>
<li><strong>In this course:</strong> <code>har.mjs</code> records with Playwright's <code>recordHar</code> on the same Chrome — same HAR 1.2 format (custom fields start with <code>_</code>, as in Chrome's own exports).</li>
</ul>

<h3>Step 1 — record one, and look at its shape</h3>
${lenh('s09/har', 0)}
${lenh('s09/har', 1)}
${lenh('s09/har', 2)}
<p>The skeleton is always <code>log</code> → <code>creator</code>, <code>browser</code>, <code>pages[]</code>, <code>entries[]</code>. One entry = one request: <code>startedDateTime</code> (ISO 8601 with milliseconds — Lesson 1.5), <code>time</code> (total ms), <code>request</code>, <code>response</code>, <code>serverIPAddress</code>, and <code>timings</code> with the phases from Lesson 9.2 (<code>blocked, dns, connect, ssl, send, wait, receive</code>). <strong><code>-1</code> means "did not happen"</strong>: here <code>dns</code>, <code>connect</code>, <code>ssl</code> are -1 because the connection was reused. Sizes are in bytes; <code>-1</code> also means unknown.</p>

<h3>Step 2 — jq recipes for any HAR</h3>
${lenh('s09/har', 3)}
${lenh('s09/har', 4)}
${lenh('s09/har', 5)}
<p>Three habits: list everything once (status, method, time, URL without query string), filter failures — <strong>including status <code>-1</code>/<code>0</code></strong>, which means the request never got a response (CORS, network, cancelled; the reason is in <code>_failureText</code>) — and sort by time. The CORS-blocked <code>/api/orders</code> is invisible if you only filter <code>status &gt;= 400</code>.</p>
${lenh('s09/har', 6)}
<p>The response of each error, with the headers that explain it: the 401 says <em>The access token expired</em>; every response carries an <code>X-Request-Id</code> you can hand to the backend (9.2). The 404 body is <code>bm90IGZvdW5k</code> — not garbage: non-text bodies are stored base64 (<code>content.encoding: "base64"</code>); <code>echo bm90IGZvdW5k | base64 -d</code> → <code>not found</code>.</p>

<h3>Step 3 — what is inside that an attacker wants</h3>
${ma('bash', 's09/cong-cu/tim-bi-mat.bash')}
${lenh('s09/har', 7)}
<p>From one page load: 4 <code>Authorization</code> headers, 6 JWTs (in headers, in the login response body, in a URL), a password in a POST body, a session cookie in <code>Set-Cookie</code>. Anyone with this file can call the API as this user until the tokens expire — no password needed — and here they even get the password.</p>

<h3>Step 4 — "sanitized" is not "safe"</h3>
<p>Let us do exactly what Chrome 130's default export does — drop the <code>Cookie</code>, <code>Set-Cookie</code> and <code>Authorization</code> headers and the cookie arrays — and search again:</p>
${lenh('s09/har', 8)}
<div class="pitfall co-tieu-de"><p><strong>Still two JWTs, a token in a URL and a password.</strong> Header-based sanitising cannot know that your app puts the token in the login <em>response body</em>, in a <code>?token=</code> query string, or that a form posts a password. Treat "sanitized" as a first step, not a guarantee.</p></div>

<h3>Step 5 — sanitise properly, then verify</h3>
${ma('bash', 's09/cong-cu/che-har.jq')}
${lenh('s09/har', 9)}
${lenh('s09/har', 10)}
${lenh('s09/har', 11)}
<p>The cleaned file keeps what a support engineer needs (URLs, statuses, timings, error bodies, request ids) and masks headers, cookies, sensitive query parameters, password/token fields in bodies, and anything shaped like a JWT. The email address remains 3 times — it is personal data, not a credential; decide case by case (a customer's HAR → mask it too). Always re-run the search after cleaning, and remember what no regex finds: internal host names, IP addresses, the content of pages the user visited.</p>
<p>Before sending any HAR: (1) reproduce in a fresh Incognito window with only the failing steps; (2) export, then sanitise with a script or a client-side tool (Cloudflare's HAR Sanitizer; Google's HAR Analyzer to view it); (3) search for your own token/cookie values; (4) send through the ticket system, not chat; (5) log out afterwards so any missed token dies.</p>

<h3>Hacker's corner: the Okta support breach (September–October 2023)</h3>
<p>Okta sells login for thousands of companies; customers with a problem upload HAR files to Okta's support system so engineers can see what went wrong. From <strong>28 September to 17 October 2023</strong> an attacker had access to that system and downloaded files of <strong>134 customers</strong>. Some were HAR files containing <strong>session tokens</strong>; the attacker replayed them to <strong>hijack the Okta sessions of 5 customers</strong> — three of them, 1Password, BeyondTrust and Cloudflare, published their own accounts. How the attacker got in: a <strong>service account</strong> of the support system whose password an employee had saved in a <strong>personal Google profile</strong> in Chrome on a work laptop (Okta's root-cause report, 3 November 2023).</p>
<p>The part for a log course: 1Password reported suspicious activity on 29 September and BeyondTrust on 2 October, yet Okta's first searches found nothing. Okta's report explains why: opening a file attached to a case writes one <strong>type of log event</strong>; going straight to the <em>Files</em> tab, as the attacker did, writes a <strong>different event with a different record ID</strong> — and the investigation was looking at case-access events. Only after BeyondTrust supplied the attacker's IP address on 13 October did they find the file downloads. Cloudflare detected the intrusion into its own Okta tenant on 18 October and, a week later, released a free client-side HAR sanitiser.</p>
<ul>
<li><strong>For you as the sender:</strong> never send an unsanitised HAR of a logged-in session; log out after capturing.</li>
<li><strong>For you as the receiver</strong> (support, OJT on a customer project): delete HARs after use, keep them out of chat, and sanitise on upload.</li>
<li><strong>For you as the investigator:</strong> before concluding "no suspicious downloads", list every event type the system can emit for that action. A query on the wrong event type returns a clean, confident, wrong answer.</li>
<li><strong>For the system designer:</strong> short-lived sessions and sessions bound to a network or device (Okta added binding of admin sessions to network location after this) make a stolen token far less useful.</li>
</ul>

<h3>Real-life situations</h3>
<ul>
<li><strong>A vendor's support asks "please attach a HAR".</strong> Reproduce in Incognito, sanitise, check, then attach — and say in the ticket that cookies/tokens were masked so they do not ask again.</li>
<li><strong>A tester attaches a HAR to a Jira ticket on an outsourcing project.</strong> The ticket is visible to the whole customer team. Clean it, replace the attachment, and ask the tester to log out of that test account.</li>
<li><strong>What if</strong> the problem only happens with real cookies (SameSite, expired session)? Send the HAR with cookie <em>names</em> but masked <em>values</em> — the names and attributes are usually enough.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>What is in a HAR file and why is it sensitive?</em> — All requests/responses with headers, cookies, bodies, timings; session tokens let anyone replay the session (Okta 2023).</li>
<li><em>How do you find failed requests in a HAR, including CORS failures?</em> — Filter <code>status &gt;= 400 or status &lt;= 0</code>; read <code>_failureText</code>.</li>
<li><em>Chrome now exports sanitised HARs. Is that enough?</em> — No: it removes three headers only; tokens in URLs/bodies and passwords in forms remain.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Export a HAR of <code>?kb=login,me</code> from your own Chrome twice: default and "with sensitive data". Run <code>tim-bi-mat.bash</code> on both and compare with Step 4.</li>
<li>Write a jq one-liner that prints, for each failed request, the status, the URL path and the <code>X-Request-Id</code>.</li>
<li>Extend <code>che-har.jq</code> to also mask email addresses everywhere, and prove it with <code>grep -c</code>.</li>
<li>Write the three sentences you would put in a ticket to a vendor when you attach a cleaned HAR.</li>
</ol>
<p><strong>Done when:</strong> 1 shows the full export has the Authorization/Set-Cookie lines and both still contain the password and the URL token; 2 outputs four lines (404, 401, -1, 504) — the -1 row has no headers, so it needs <code>// "-"</code>; 3 makes <code>grep -c 'sv.lab9@example.com'</code> print 0; 4 says what you did, when (UTC), and that tokens/cookies/passwords were masked.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['HAR', 'HTTP Archive: JSON file (version 1.2) with every request/response a browser recorded.'],
  ['entry', 'One request in a HAR: request, response, timings, startedDateTime, time.'],
  ['timings -1', 'The phase did not happen (e.g. reused connection) or is unknown.'],
  ['_failureText', 'Chrome/Playwright field with the network error when there was no response (status -1/0).'],
  ['sanitized export', 'Chrome 130+ default HAR export without Cookie, Set-Cookie, Authorization headers.'],
  ['session hijacking', 'Using a stolen session token or cookie to act as the user without their password.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>HAR = the Network panel as JSON; read it with jq like any log.</li>
<li>Failures include status -1/0 — CORS and network errors have no HTTP status.</li>
<li>A logged-in HAR is a copy of the login: headers, cookies, URL tokens, bodies, passwords.</li>
<li>Chrome's sanitised export removes three headers only — clean fully and search again.</li>
<li>Okta 2023: HAR tokens → 5 hijacked sessions; a different log event type hid the downloads for two weeks.</li>
</ul>
${nguon('🛡️', 'Okta — Root cause and remediation (3/11/2023)', '134 customers, HAR files with session tokens, 5 hijacked sessions, the "Files tab" log event, timeline', 'https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/')}
${nguon('🛡️', 'Cloudflare — How Cloudflare mitigated yet another Okta compromise (20/10/2023)', 'Detection on 18 October 2023, BeyondTrust reported on 2 October', 'https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/')}
${nguon('🧰', 'Cloudflare HAR Sanitizer (26/10/2023)', 'Client-side removal of cookies and JWTs; source on GitHub', 'https://blog.cloudflare.com/introducing-har-sanitizer-secure-har-sharing/')}
${nguon('📘', 'What’s new in DevTools, Chrome 130', 'HAR exports exclude sensitive data by default', 'https://developer.chrome.com/blog/new-in-devtools-130')}
${nguon('📄', 'HAR 1.2 spec (Jan Odvarko)', 'Every field of log, entries, request, response, timings', 'http://www.softwareishard.com/blog/har-12-spec/')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-11-1-bug-report', title: 'Debugging 11.1 — A bug report people can act on', sub: 'Attach screenshots, HAR and logs — cleaned', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>HAR: cả bảng Network trong một tệp — vừa là bằng chứng, vừa là hiểm hoạ</h2>
<p class="lead">Tệp HAR (HTTP Archive) là mọi thứ bảng Network đã thấy, lưu thành JSON: từng request và phản hồi, header, cookie, phần thân và thời gian. Bộ phận hỗ trợ xin nó vì nó cho họ thấy vấn đề của bạn mà không cần máy của bạn. Cũng vì thế nó nguy hiểm: HAR của một phiên đang đăng nhập là một bản sao của lần đăng nhập đó. Bài này đọc tệp HAR bằng <code>jq</code> như mọi tệp log khác, và làm sạch nó trước khi nó rời máy bạn.</p>

<h3>Liên tưởng đời thường: đoạn băng camera của cửa hàng</h3>
<p>Mất đồ, cửa hàng gửi đoạn camera cho công an — rất có ích. Nhưng đoạn băng cũng quay rõ từng khách bấm mã PIN ở quầy. Trước khi gửi, người quản lý cẩn thận sẽ làm mờ bàn phím. HAR là đoạn băng; làm sạch là làm mờ.</p>

<h3>Tệp HAR từ đâu ra</h3>
<ul>
<li><strong>Lịch sử:</strong> định dạng được thiết kế khoảng năm 2009 bởi tác giả của Firebug và HttpWatch để các công cụ trao đổi bản ghi với nhau; phiên bản 1.2 là bản ai cũng dùng. Một bản nháp ở W3C từng được bắt đầu rồi bỏ dở — HAR là chuẩn trên thực tế, không phải chuẩn chính thức.</li>
<li><strong>Chrome/Edge:</strong> bảng Network → mũi tên tải xuống (<em>Export HAR</em>). Từ <strong>Chrome 130</strong> (tháng 10/2024), cách xuất mặc định là <strong>"Export HAR (sanitized)"</strong>, bỏ các header <code>Cookie</code>, <code>Set-Cookie</code> và <code>Authorization</code>; muốn bản đầy đủ phải vào Settings → Preferences → Network → <em>Allow to generate HAR with sensitive data</em>, rồi nhấn giữ nút xuất.</li>
<li><strong>Firefox:</strong> bảng Network → chuột phải → <em>Save All As HAR</em>. <strong>Safari:</strong> tab Network → Export.</li>
<li><strong>Trong khoá này:</strong> <code>har.mjs</code> ghi bằng <code>recordHar</code> của Playwright trên chính Chrome đó — cùng định dạng HAR 1.2 (trường riêng bắt đầu bằng <code>_</code>, giống tệp Chrome tự xuất).</li>
</ul>

<h3>Bước 1 — ghi một tệp, và xem hình dạng của nó</h3>
${lenh('s09/har', 0)}
${lenh('s09/har', 1)}
${lenh('s09/har', 2)}
<p>Bộ khung lúc nào cũng là <code>log</code> → <code>creator</code>, <code>browser</code>, <code>pages[]</code>, <code>entries[]</code>. Một entry = một request: <code>startedDateTime</code> (ISO 8601 có mili giây — bài 1.5), <code>time</code> (tổng số ms), <code>request</code>, <code>response</code>, <code>serverIPAddress</code>, và <code>timings</code> với các pha ở bài 9.2 (<code>blocked, dns, connect, ssl, send, wait, receive</code>). <strong><code>-1</code> nghĩa là "không xảy ra"</strong>: ở đây <code>dns</code>, <code>connect</code>, <code>ssl</code> bằng -1 vì kết nối được dùng lại. Kích thước tính bằng byte; <code>-1</code> cũng có nghĩa là không rõ.</p>

<h3>Bước 2 — công thức jq dùng cho mọi tệp HAR</h3>
${lenh('s09/har', 3)}
${lenh('s09/har', 4)}
${lenh('s09/har', 5)}
<p>Ba thói quen: liệt kê tất cả một lần (mã trạng thái, phương thức, thời gian, URL bỏ phần query), lọc lỗi — <strong>kể cả trạng thái <code>-1</code>/<code>0</code></strong>, nghĩa là request không bao giờ nhận được phản hồi (CORS, mạng, bị huỷ; lý do nằm ở <code>_failureText</code>) — và xếp theo thời gian. Lời gọi <code>/api/orders</code> bị CORS chặn sẽ vô hình nếu bạn chỉ lọc <code>status &gt;= 400</code>.</p>
${lenh('s09/har', 6)}
<p>Phản hồi của từng lỗi, kèm header giải thích nó: 401 nói <em>The access token expired</em>; phản hồi nào cũng mang <code>X-Request-Id</code> để đưa cho backend (9.2). Thân của 404 là <code>bm90IGZvdW5k</code> — không phải rác: phần thân không phải chữ được lưu dạng base64 (<code>content.encoding: "base64"</code>); <code>echo bm90IGZvdW5k | base64 -d</code> → <code>not found</code>.</p>

<h3>Bước 3 — bên trong có gì mà kẻ tấn công thèm</h3>
${ma('bash', 's09/cong-cu/tim-bi-mat.bash')}
${lenh('s09/har', 7)}
<p>Chỉ từ một lần tải trang: 4 header <code>Authorization</code>, 6 JWT (trong header, trong thân phản hồi đăng nhập, trên một URL), một mật khẩu trong thân POST, một cookie phiên trong <code>Set-Cookie</code>. Ai có tệp này cũng gọi được API dưới tên người dùng đó cho tới khi token hết hạn — không cần mật khẩu — mà ở đây còn được tặng luôn mật khẩu.</p>

<h3>Bước 4 — "sanitized" chưa có nghĩa là "an toàn"</h3>
<p>Làm đúng điều cách xuất mặc định của Chrome 130 làm — bỏ header <code>Cookie</code>, <code>Set-Cookie</code>, <code>Authorization</code> và các mảng cookie — rồi tìm lại:</p>
${lenh('s09/har', 8)}
<div class="pitfall co-tieu-de"><p><strong>Vẫn còn hai JWT, một token trên URL và một mật khẩu.</strong> Làm sạch dựa trên header không thể biết ứng dụng của bạn để token trong <em>thân phản hồi</em> đăng nhập, trong chuỗi <code>?token=</code>, hay một form gửi mật khẩu đi. Coi "sanitized" là bước đầu, không phải lời bảo đảm.</p></div>

<h3>Bước 5 — làm sạch cho đúng, rồi kiểm lại</h3>
${ma('bash', 's09/cong-cu/che-har.jq')}
${lenh('s09/har', 9)}
${lenh('s09/har', 10)}
${lenh('s09/har', 11)}
<p>Tệp đã làm sạch giữ những gì kỹ sư hỗ trợ cần (URL, mã trạng thái, thời gian, thân phản hồi lỗi, request id) và che header, cookie, tham số nhạy cảm trên URL, các trường mật khẩu/token trong thân, và mọi thứ có hình dạng JWT. Địa chỉ email còn 3 lần — đó là dữ liệu cá nhân, không phải thông tin đăng nhập; tuỳ từng trường hợp (HAR của khách hàng ⇒ che luôn). Luôn chạy lại lệnh tìm sau khi làm sạch, và nhớ những thứ không regex nào tìm ra: tên máy nội bộ, địa chỉ IP, nội dung các trang người dùng đã xem.</p>
<p>Trước khi gửi bất kỳ tệp HAR nào: (1) tái hiện trong một cửa sổ ẩn danh mới, chỉ gồm các bước gây lỗi; (2) xuất ra, rồi làm sạch bằng script hoặc công cụ chạy phía máy khách (HAR Sanitizer của Cloudflare; HAR Analyzer của Google để xem); (3) tìm chính giá trị token/cookie của bạn trong tệp; (4) gửi qua hệ thống ticket, không qua chat; (5) đăng xuất sau đó để token nào lỡ sót cũng chết.</p>

<h3>Góc hacker: vụ lộ hệ thống hỗ trợ của Okta (tháng 9–10/2023)</h3>
<p>Okta bán dịch vụ đăng nhập cho hàng nghìn công ty; khách gặp sự cố tải tệp HAR lên hệ thống hỗ trợ của Okta để kỹ sư xem lỗi. Từ <strong>28/9 tới 17/10/2023</strong>, một kẻ tấn công có quyền vào hệ thống đó và tải về tệp của <strong>134 khách hàng</strong>. Một số là tệp HAR chứa <strong>token phiên</strong>; kẻ tấn công phát lại chúng để <strong>chiếm phiên Okta của 5 khách hàng</strong> — ba trong số đó là 1Password, BeyondTrust và Cloudflare đã công bố tường thuật riêng. Kẻ tấn công vào bằng cách nào: một <strong>tài khoản dịch vụ</strong> của hệ thống hỗ trợ, mật khẩu của nó được một nhân viên lưu trong <strong>hồ sơ Google cá nhân</strong> trên Chrome của laptop công ty (báo cáo nguyên nhân gốc của Okta, 3/11/2023).</p>
<p>Phần dành cho một khoá về log: 1Password báo hoạt động đáng ngờ ngày 29/9, BeyondTrust ngày 2/10, vậy mà các lần tìm đầu tiên của Okta không thấy gì. Báo cáo của Okta giải thích: mở một tệp đính kèm trong case sinh ra một <strong>kiểu sự kiện log</strong>; còn đi thẳng vào tab <em>Files</em>, như kẻ tấn công đã làm, sinh ra <strong>một sự kiện khác với mã bản ghi khác</strong> — mà cuộc điều tra lại đang nhìn vào sự kiện truy cập case. Chỉ khi BeyondTrust đưa địa chỉ IP của kẻ tấn công ngày 13/10, họ mới tìm ra các lần tải tệp. Cloudflare phát hiện kẻ xâm nhập trong tenant Okta của chính mình ngày 18/10 và một tuần sau phát hành miễn phí công cụ làm sạch HAR chạy phía máy khách.</p>
<ul>
<li><strong>Bạn là người gửi:</strong> không bao giờ gửi HAR chưa làm sạch của một phiên đang đăng nhập; đăng xuất sau khi ghi.</li>
<li><strong>Bạn là người nhận</strong> (hỗ trợ, OJT trong dự án của khách): xoá HAR sau khi dùng, không để trong chat, làm sạch ngay khi tải lên.</li>
<li><strong>Bạn là người điều tra:</strong> trước khi kết luận "không có lượt tải đáng ngờ", liệt kê mọi kiểu sự kiện hệ thống có thể sinh ra cho hành động đó. Truy vấn sai kiểu sự kiện cho ra một câu trả lời sạch sẽ, tự tin, và sai.</li>
<li><strong>Bạn là người thiết kế hệ thống:</strong> phiên ngắn hạn và phiên gắn với mạng hay thiết bị (Okta đã thêm việc gắn phiên quản trị với vị trí mạng sau vụ này) làm token bị đánh cắp kém giá trị hơn nhiều.</li>
</ul>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Bộ phận hỗ trợ của một nhà cung cấp xin "đính kèm giúp tệp HAR".</strong> Tái hiện trong cửa sổ ẩn danh, làm sạch, kiểm, rồi đính kèm — và ghi trong ticket rằng cookie/token đã được che để họ khỏi hỏi lại.</li>
<li><strong>Tester đính kèm HAR vào ticket Jira trong một dự án outsourcing.</strong> Ticket hiện cho cả đội phía khách hàng. Làm sạch, thay tệp đính kèm, và nhờ tester đăng xuất tài khoản thử nghiệm đó.</li>
<li><strong>Nếu</strong> lỗi chỉ xảy ra với cookie thật (SameSite, phiên hết hạn)? Gửi HAR giữ <em>tên</em> cookie nhưng che <em>giá trị</em> — tên và thuộc tính thường là đủ.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>Tệp HAR chứa gì và vì sao nhạy cảm?</em> — Mọi request/phản hồi với header, cookie, phần thân, thời gian; token phiên cho phép bất kỳ ai phát lại phiên (Okta 2023).</li>
<li><em>Tìm request lỗi trong HAR thế nào, kể cả lỗi CORS?</em> — Lọc <code>status &gt;= 400 or status &lt;= 0</code>; đọc <code>_failureText</code>.</li>
<li><em>Chrome giờ xuất HAR đã làm sạch. Thế đủ chưa?</em> — Chưa: nó chỉ bỏ ba header; token trên URL/trong thân và mật khẩu trong form vẫn còn.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Xuất HAR của <code>?kb=login,me</code> từ Chrome của bạn hai lần: mặc định và "with sensitive data". Chạy <code>tim-bi-mat.bash</code> trên cả hai và so với Bước 4.</li>
<li>Viết một dòng jq in ra, với mỗi request lỗi, mã trạng thái, đường dẫn URL và <code>X-Request-Id</code>.</li>
<li>Mở rộng <code>che-har.jq</code> để che cả địa chỉ email ở mọi nơi, chứng minh bằng <code>grep -c</code>.</li>
<li>Viết ba câu bạn sẽ ghi trong ticket gửi nhà cung cấp khi đính kèm một HAR đã làm sạch.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 cho thấy bản đầy đủ có các dòng Authorization/Set-Cookie và cả hai bản vẫn chứa mật khẩu và token trên URL; câu 2 in ra bốn dòng (404, 401, -1, 504) — hàng -1 không có header nên cần <code>// "-"</code>; câu 3 làm <code>grep -c 'sv.lab9@example.com'</code> in ra 0; câu 4 nói bạn đã làm gì, lúc nào (UTC), và rằng token/cookie/mật khẩu đã được che.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['HAR', 'HTTP Archive: tệp JSON (phiên bản 1.2) chứa mọi request/phản hồi trình duyệt đã ghi.'],
  ['entry', 'Một request trong HAR: request, response, timings, startedDateTime, time.'],
  ['timings -1', 'Pha đó không xảy ra (ví dụ dùng lại kết nối) hoặc không rõ.'],
  ['_failureText', 'Trường của Chrome/Playwright ghi lỗi mạng khi không có phản hồi (trạng thái -1/0).'],
  ['bản xuất sanitized', 'Cách xuất HAR mặc định của Chrome 130+, không có header Cookie, Set-Cookie, Authorization.'],
  ['chiếm phiên (session hijacking)', 'Dùng token hay cookie phiên đánh cắp được để hành động như người dùng mà không cần mật khẩu.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>HAR = bảng Network dạng JSON; đọc bằng jq như mọi tệp log.</li>
<li>Lỗi gồm cả trạng thái -1/0 — lỗi CORS và lỗi mạng không có mã HTTP.</li>
<li>HAR của phiên đang đăng nhập là bản sao lần đăng nhập: header, cookie, token trên URL, phần thân, mật khẩu.</li>
<li>Bản xuất sanitized của Chrome chỉ bỏ ba header — làm sạch đầy đủ rồi tìm lại.</li>
<li>Okta 2023: token trong HAR → 5 phiên bị chiếm; một kiểu sự kiện log khác đã giấu các lượt tải suốt hai tuần.</li>
</ul>
${nguon('🛡️', 'Okta — Nguyên nhân gốc và khắc phục (3/11/2023)', '134 khách hàng, HAR chứa token phiên, 5 phiên bị chiếm, sự kiện log của tab "Files", dòng thời gian', 'https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/')}
${nguon('🛡️', 'Cloudflare — How Cloudflare mitigated yet another Okta compromise (20/10/2023)', 'Phát hiện ngày 18/10/2023, BeyondTrust đã báo từ 2/10', 'https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/')}
${nguon('🧰', 'Cloudflare HAR Sanitizer (26/10/2023)', 'Bỏ cookie và JWT ngay trên máy; mã nguồn trên GitHub', 'https://blog.cloudflare.com/introducing-har-sanitizer-secure-har-sharing/')}
${nguon('📘', 'What’s new in DevTools, Chrome 130', 'HAR xuất ra mặc định không chứa dữ liệu nhạy cảm', 'https://developer.chrome.com/blog/new-in-devtools-130')}
${nguon('📄', 'Đặc tả HAR 1.2 (Jan Odvarko)', 'Từng trường của log, entries, request, response, timings', 'http://www.softwareishard.com/blog/har-12-spec/')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-11-1-bug-report', title: 'Gỡ lỗi 11.1 — Bug report người khác làm được ngay', sub: 'Đính kèm ảnh, HAR và log — đã làm sạch', cta: 'Mở bài' })}
</div>
`,
};
