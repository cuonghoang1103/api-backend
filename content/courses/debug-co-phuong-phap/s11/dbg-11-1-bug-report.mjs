/**
 * 11.1 — Bug report người khác làm được ngay (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: LabFlow mini (node:http + pg 8.23 + PostgreSQL 16), Chrome 150 headless lái qua CDP để tái hiện như người dùng
 * và xuất HAR, che bí mật, thu nhỏ bằng curl — scratchpad/dbg/lab/ch11/c111 (c111.sh, out/o-111-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { APP111, HAR_MJS, CHE_HAR, SOI, C111_SH } from './_ma-11.mjs';
import { HAR, CHE, LOG, THU_NHO, MOI_TRUONG } from './_ra-11.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;
const chiTiet = (tom, noiDung) => `<details><summary>${tom}</summary>${noiDung}</details>`;

const TE_EN = ma(`Title:  Booking error
Body:   Booking doesn't work, please fix asap. I tried several times.
        (screenshot of the red box "Có lỗi xảy ra, vui lòng thử lại sau.")`, 'text');
const TE_VI = ma(`Tiêu đề:  Lỗi đặt lịch
Nội dung: Đặt lịch không được, fix gấp giúp em. Em thử mấy lần rồi.
          (ảnh chụp ô đỏ "Có lỗi xảy ra, vui lòng thử lại sau.")`, 'text');

const MAU_EN = ma(`Summary:     POST /api/dat-lich returns 500 when the note is longer than 255 characters
Component:   Booking API            Affects version: 2.5.1 (commit 7f3c2a9)
Environment: staging · Chrome 150 / Linux · also reproduced with curl (not browser-specific)
Severity:    Minor (booking fails only with long notes; workaround: shorten the note)
Priority:    P2 (fix this sprint; students paste lab requirements into the note)
Frequency:   10/10 with a 256-character note; 0/10 with 255

Steps to reproduce (data: any logged-in student, room 3, 2026-12-01, slot 2)
  1. Log in as SE180001.
  2. Book with a note of 256 characters:
       TOKEN=…   # from POST /api/dang-nhap, not pasted here
       curl -s -w ' HTTP %{http_code}\\n' $BASE/api/dat-lich -H "authorization: Bearer $TOKEN" \\
         -d '{"phong":3,"ngay":"2026-12-01","ca":2,"ghiChu":"'$(head -c 256 &lt;/dev/zero | tr '\\0' x)'"}'
Expected:    201 with the booking id — or 400 with a message saying the limit, if 255 is the rule.
Actual:      500 {"loi":"Lỗi máy chủ","requestId":"c58a3ea5"}; the page shows only "Có lỗi xảy ra".
Evidence:    loi-da-che.har (sanitised, 0 secrets by soi-bi-mat.mjs), screenshot, request id c58a3ea5.
Notes:       255 → 201, 256 → 500; 255 Vietnamese characters (765 bytes) → 201, so the limit counts characters, not bytes.
             Guess (not verified): a varchar(255) column with no validation in the API.`, 'text');
const MAU_VI = ma(`Tóm tắt:     POST /api/dat-lich trả 500 khi ghi chú dài hơn 255 ký tự
Thành phần:  API đặt lịch           Phiên bản bị ảnh hưởng: 2.5.1 (commit 7f3c2a9)
Môi trường:  staging · Chrome 150 / Linux · tái hiện được cả bằng curl (không phụ thuộc trình duyệt)
Severity:    Minor (chỉ hỏng khi ghi chú dài; cách tránh: rút ngắn ghi chú)
Priority:    P2 (sửa trong sprint này; SV hay dán yêu cầu bài lab vào ghi chú)
Tần suất:    10/10 với ghi chú 256 ký tự; 0/10 với 255

Các bước tái hiện (dữ liệu: SV bất kỳ đã đăng nhập, phòng 3, 2026-12-01, ca 2)
  1. Đăng nhập SE180001.
  2. Đặt lịch với ghi chú 256 ký tự:
       TOKEN=…   # lấy từ POST /api/dang-nhap, không dán vào đây
       curl -s -w ' HTTP %{http_code}\\n' $BASE/api/dat-lich -H "authorization: Bearer $TOKEN" \\
         -d '{"phong":3,"ngay":"2026-12-01","ca":2,"ghiChu":"'$(head -c 256 &lt;/dev/zero | tr '\\0' x)'"}'
Mong đợi:    201 kèm id lịch — hoặc 400 kèm lời báo giới hạn, nếu 255 là quy định.
Thực tế:     500 {"loi":"Lỗi máy chủ","requestId":"c58a3ea5"}; trang chỉ hiện "Có lỗi xảy ra".
Bằng chứng:  loi-da-che.har (đã che, soi-bi-mat.mjs báo 0 bí mật), ảnh chụp, request id c58a3ea5.
Ghi chú:     255 → 201, 256 → 500; 255 ký tự tiếng Việt (765 byte) → 201, vậy giới hạn đếm theo ký tự, không theo byte.
             Phỏng đoán (chưa kiểm): cột varchar(255), API không kiểm độ dài.`, 'text');

const SP_EN = `<table>
<thead><tr><th>Situation</th><th>Severity (how bad, technical)</th><th>Priority (how soon, business)</th></tr></thead>
<tbody>
<tr><td>Payments fail for every user</td><td>Critical</td><td>P0 — now, wake people up</td></tr>
<tr><td>Crash when exporting a report used once a year, next use in 10 months</td><td>Major</td><td>P3 — backlog</td></tr>
<tr><td>Customer's company name misspelled on the home page, demo tomorrow</td><td>Trivial</td><td>P1 — today</td></tr>
<tr><td>This lesson's bug: long note ⇒ 500, workaround exists</td><td>Minor</td><td>P2 — this sprint</td></tr>
</tbody></table>`;
const SP_VI = `<table>
<thead><tr><th>Tình huống</th><th>Severity (nặng tới đâu, góc kỹ thuật)</th><th>Priority (gấp tới đâu, góc kinh doanh)</th></tr></thead>
<tbody>
<tr><td>Mọi người dùng thanh toán đều lỗi</td><td>Critical</td><td>P0 — ngay bây giờ, gọi người dậy</td></tr>
<tr><td>Sập khi xuất một báo cáo mỗi năm dùng một lần, lần dùng kế tiếp sau 10 tháng</td><td>Major</td><td>P3 — để backlog</td></tr>
<tr><td>Tên công ty khách viết sai trên trang chủ, mai demo</td><td>Trivial</td><td>P1 — trong hôm nay</td></tr>
<tr><td>Lỗi của bài này: ghi chú dài ⇒ 500, có cách tránh</td><td>Minor</td><td>P2 — trong sprint này</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('📘', 'Chrome DevTools — Network features reference', 'Export HAR (sanitized) bỏ header Cookie, Set-Cookie, Authorization — không đụng body hay URL.', 'https://developer.chrome.com/docs/devtools/network/reference'),
  nguon('🛡️', 'Okta — Tracking Unauthorized Access to Okta\'s Support System (20/10/2023)', 'HAR khách gửi cho bộ phận hỗ trợ chứa cookie và session token.', 'https://sec.okta.com/articles/2023/10/tracking-unauthorized-access-oktas-support-system'),
  nguon('🛡️', 'Okta — Root cause (03/11/2023)', '134 khách bị truy cập tệp; token trong HAR dùng để chiếm phiên của 5 khách.', 'https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause'),
  nguon('🛡️', 'Cloudflare — How Cloudflare mitigated yet another Okta compromise', 'Một nạn nhân mô tả lại từ phía mình.', 'https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/'),
  lienKet({ khoa: 'tieng-anh-ky-thuat-di-lam', bai: 'tak-2-2-bug-report', title: 'Tiếng Anh kỹ thuật 2.2 — Bug report bằng tiếng Anh', sub: 'Cùng cấu trúc, phần câu chữ tiếng Anh cho khách nước ngoài.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-1-2-tai-hien', title: 'Bài 1.2 — Tái hiện chắc chắn và bản tái hiện tối giản', sub: 'Phép thu nhỏ dùng ở đây.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-2-network', title: 'Bài 5.2 — Tab Network của DevTools', sub: 'Đọc request trước khi xuất HAR.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'observability-monitoring', bai: 'obs-3-1-id-di-den-hu-vo', title: 'Observability 3.1 — Request id đi đến đâu', sub: 'Vì sao một id trong bug report rút việc tra log còn một lệnh.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.1 — A bug report people can act on|||11.1 — Bug report người khác làm được ngay',
  slug: 'dbg-11-1-bug-report',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bug report là bản bàn giao gỡ lỗi: người đọc phải tái hiện được trong vài phút mà không cần hỏi lại. Chạy thật một lỗi của LabFlow (ghi chú dài ⇒ trang chỉ báo "Có lỗi xảy ra"): Chrome 150 headless tái hiện như người dùng và xuất HAR; thu nhỏ bằng curl, chia đôi độ dài tìm đúng ngưỡng 255/256 và thử 255 chữ có dấu (765 byte vẫn 201 ⇒ đếm ký tự, không đếm byte); khối Môi trường lấy bằng lệnh; request id đưa dev tới đúng dòng log pg 22001. Mẫu ticket CT Work/Jira từng mục, severity khác priority (4 ví dụ), báo cáo tệ vs tốt. Góc hacker: HAR chứa 8 chỗ bí mật; "Export HAR (sanitized)" kiểu Chrome chỉ bỏ 3 header nên còn mật khẩu, token trong body và URL — che-har.mjs thu giá trị rồi thay ở mọi chỗ; vụ Okta 10/2023 (134 khách, token trong HAR chiếm phiên 5 khách).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>A bug report is a debugging hand-off</h2>
<p class="lead">You found a bug. Somebody else — a developer on another team, the customer's vendor, you in three weeks — has to fix it. Everything they need is either in the report, or they come back with questions and the bug waits another day. This lesson writes one report from a real bug, from the first "it doesn't work" to a ticket a developer can act on in five minutes, and shows the one attachment that can leak a customer's account if you send it raw.</p>

<h3>An everyday picture: calling the motorbike repair shop</h3>
<p>"My bike makes a noise" gets you "bring it in, we'll see". "Since yesterday, a high squeal from the front when I brake above 40 km/h, not when cold, Honda Vision 2022" gets you "front pads are worn, 150k, come at 5". The mechanic is not smarter in the second case — you did half of the diagnosis for them: symptom, condition, since when, which model. A bug report is the same deal.</p>

<h3>The bug, as a user meets it</h3>
<p>LabFlow lets a student book a lab room with a note. Here is the app (node:http + PostgreSQL), and a script that does exactly what a user does in Chrome — log in, type a note, click Book — then exports the network log as HAR, like DevTools does:</p>
${ma(APP111)}
${chiTiet('har.mjs — Chrome headless driven over CDP, HAR 1.2 built from Network events', ma(HAR_MJS))}
${chiTiet('c111.sh — the whole lesson in one script', ma(C111_SH, 'bash'))}
${ra(HAR)}
<p>The user sees a red box and nothing else. This is the report you usually receive:</p>
${TE_EN}
<p>Nobody can act on it. Which booking? Which account, which data, which version, every time or once? The developer's first reply will be five questions, and the reporter will answer two.</p>

<h3>Step 1 — Shrink it: from a browser session to one command</h3>
<p>The minimal reproduction of lesson 1.2 applies to reports too. Remove the browser (does it happen with curl?), then bisect the input — the note length — until one character makes the difference. Then test the obvious next question before the developer asks it: characters or bytes?</p>
${ra(THU_NHO)}
<p>Three facts a title can carry: it is the API (not the page), the boundary is exactly 255/256, and it counts characters (765 bytes of Vietnamese pass). The title writes itself: <em>"POST /api/dat-lich returns 500 when the note is longer than 255 characters"</em>. Notice the token was kept in a shell variable — the command in the report must not contain it.</p>

<h3>Step 2 — Environment from commands, not memory</h3>
${ra(MOI_TRUONG)}
<p>"Latest version" means nothing a week later. A version plus commit hash lets the developer check out exactly what you ran; <code>/health</code> (lesson 8.3) is there for this.</p>

<h3>Step 3 — The request id: a direct line to the server log</h3>
${ra(LOG)}
<p>The 500 response carried <code>requestId</code> (and an <code>x-request-id</code> header). With it, the developer does not search logs by time and guess — one grep gives the PostgreSQL error code 22001 and the message. If your system returns a request id, it belongs in every bug report.</p>

<h3>The report, field by field</h3>
${MAU_EN}
<ul>
<li><strong>Summary</strong> — symptom + where + condition. Someone skimming 40 tickets should know what this one is.</li>
<li><strong>Steps with data</strong> — which account, which room, which input. "Book a room" is not a step; the 256-character note is.</li>
<li><strong>Expected vs actual</strong> — what should happen is not always obvious (maybe 255 is a rule and the fix is a 400 message, not accepting more).</li>
<li><strong>Frequency</strong> — 10/10 and 1/50 are different bugs to the reader.</li>
<li><strong>Facts vs guesses</strong> — "varchar(255)" is labelled as a guess. Reports that state guesses as facts send developers in the wrong direction.</li>
<li><strong>One bug per ticket</strong> — if you also noticed the page does not show the server's message, file a second ticket and link it.</li>
</ul>

<h3>Severity is not priority</h3>
${SP_EN}
<p>Severity is how bad the failure is; priority is how soon the business wants it fixed. The reporter proposes, the lead or product owner decides priority. On FPT-style outsourcing projects the customer's contract often defines severity levels and response times — read that table in your first week.</p>

<h3>Evidence, and the attachment that leaks accounts</h3>
<p>Screenshots show what the user saw; a short screen recording shows the steps; logs show the server's view. A <strong>HAR file</strong> shows every request and response — headers, bodies, timings — and vendors routinely ask for one. It is also a copy of the user's session.</p>
${chiTiet('soi-bi-mat.mjs — count secrets left in a HAR', ma(SOI))}
${chiTiet('che-har.mjs — sanitise: headers, query, sensitive JSON keys, then replace every collected value everywhere', ma(CHE_HAR))}
${ra(CHE)}
<p>Read it from the top. The raw HAR holds <strong>8</strong> secrets: the session cookie, the password in the login body, the token in the login response, the token in a URL query, the Bearer header. Chrome's <em>Export HAR (sanitized)</em> is documented to exclude the Cookie, Set-Cookie and Authorization headers — that is all it promises. <code>che-har.mjs --kieu-chrome</code> does exactly that, and <strong>4</strong> secrets remain, including the password. The full sanitiser collects each secret value, masks it where it was found and then replaces it everywhere else (here: the URL). What remains — status 500, the body, the request id — is all a developer needs.</p>
<p>(The token visible in the URL above belongs to a local demo process that no longer exists.)</p>

<h3>🕵️ Hacker corner: Okta, October 2023</h3>
<p>Okta's support team asked customers to upload HAR files to troubleshoot. From 28 September to 17 October 2023 an attacker had access to files in Okta's support case system for 134 customers; some HAR files contained session tokens, which were used to hijack the Okta sessions of 5 customers. Okta revoked the tokens embedded in the HAR files and has since recommended sanitising all credentials and cookies before sharing. BeyondTrust, Cloudflare and 1Password were among the customers who detected the activity and published their side. The lesson for your bug reports: a HAR, a log excerpt or a "copy as cURL" is a credential until you have checked it — run <code>soi-bi-mat</code> (or your company's tool) before attaching anything, and prefer a test account.</p>

<h3>On the job</h3>
<p>In outsourcing, bug reports cross a company boundary: the customer's QA files in Jira, your team fixes, the customer verifies. Reports flow both ways — you will report bugs in the customer's API too. Two habits get noticed: (1) every report you file has a reproduction a stranger can run, and (2) when you receive a vague report, you reply with the template filled in as far as you can and ask only for the missing fields — instead of "cannot reproduce" and closing it. Many projects use English tickets; the course <em>Technical English at Work</em> chapter 2 covers the phrasing.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>c111.sh</code>. Open <code>loi-chrome.har</code> and find the password yourself with <code>jq</code>.</li>
<li>In your browser, open DevTools → Network on any site you are logged into, export the sanitized HAR and run <code>soi-bi-mat.mjs</code> on it. What is left?</li>
<li>Rewrite the "Booking error" report above into the template for a different input: <code>ngay</code> = <code>2026-02-30</code>. Run it first; report what actually happens.</li>
<li>Classify severity and priority for three bugs from your own project; ask a classmate to classify them independently and compare.</li>
</ol>
<p><strong>Done when:</strong> a classmate who has never seen the bug reproduces it from your report alone, in under five minutes, and your attachments pass the secret scan.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bug report / ticket</span><span class="v">A hand-off of a failure: summary, environment, steps with data, expected, actual, evidence.</span></div>
  <div class="kv"><span class="k">Minimal reproduction</span><span class="v">The smallest input and steps that still fail; ideally one command.</span></div>
  <div class="kv"><span class="k">Severity</span><span class="v">How bad the failure is (technical impact).</span></div>
  <div class="kv"><span class="k">Priority</span><span class="v">How soon it should be fixed (business decision).</span></div>
  <div class="kv"><span class="k">HAR</span><span class="v">HTTP Archive: JSON of every request/response a browser made, including headers and bodies.</span></div>
  <div class="kv"><span class="k">Sanitise</span><span class="v">Remove or mask secrets (cookies, tokens, passwords, keys) before sharing.</span></div>
  <div class="kv"><span class="k">Request id</span><span class="v">An id returned to the client and written in server logs, linking a report to log lines.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Write for a stranger: they must reproduce from the report alone.</li>
<li>Shrink to one command, find the exact boundary, answer the obvious next question.</li>
<li>Environment from commands (version + commit), steps with data, expected vs actual, frequency, facts separated from guesses.</li>
<li>Severity ≠ priority; the reporter proposes, the lead decides.</li>
<li>HAR = session copy. Chrome's sanitized export removes three headers only; scan and mask bodies and URLs too.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Bug report là một bản bàn giao gỡ lỗi</h2>
<p class="lead">Bạn tìm ra một lỗi. Người khác — dev ở đội khác, bên cung cấp của khách hàng, chính bạn ba tuần sau — phải sửa nó. Mọi thứ họ cần hoặc nằm sẵn trong báo cáo, hoặc họ quay lại hỏi và lỗi chờ thêm một ngày. Bài này viết một báo cáo từ một lỗi thật, đi từ câu "nó không chạy" tới một ticket mà dev làm được ngay trong năm phút, và chỉ ra loại tệp đính kèm có thể làm lộ tài khoản của khách nếu gửi đi nguyên bản.</p>

<h3>Liên tưởng đời thường: gọi điện cho tiệm sửa xe máy</h3>
<p>"Xe em kêu" sẽ nhận được "anh mang qua đây xem". "Từ hôm qua, phanh trước kêu rít khi đi trên 40 km/h, lúc máy nguội thì không, xe Vision 2022" sẽ nhận được "mòn má phanh trước rồi, 150 nghìn, 5 giờ qua nhé". Thợ không giỏi hơn ở trường hợp thứ hai — bạn đã làm giúp họ nửa phần chẩn đoán: triệu chứng, điều kiện, từ khi nào, đời xe nào. Bug report cũng là giao kèo như thế.</p>

<h3>Lỗi, theo cách người dùng gặp nó</h3>
<p>LabFlow cho sinh viên đặt phòng lab kèm ghi chú. Đây là ứng dụng (node:http + PostgreSQL), và một script làm đúng những gì người dùng làm trên Chrome — đăng nhập, gõ ghi chú, bấm Đặt — rồi xuất nhật ký mạng thành HAR như DevTools làm:</p>
${ma(APP111)}
${chiTiet('har.mjs — Chrome headless lái qua CDP, dựng HAR 1.2 từ sự kiện Network', ma(HAR_MJS))}
${chiTiet('c111.sh — cả bài trong một script', ma(C111_SH, 'bash'))}
${ra(HAR)}
<p>Người dùng thấy một ô đỏ, ngoài ra không có gì. Đây là báo cáo bạn thường nhận được:</p>
${TE_VI}
<p>Không ai làm gì được với nó. Đặt lịch nào? Tài khoản nào, dữ liệu gì, phiên bản nào, lần nào cũng bị hay chỉ một lần? Câu trả lời đầu tiên của dev sẽ là năm câu hỏi, và người báo sẽ trả lời được hai.</p>

<h3>Bước 1 — Thu nhỏ: từ một phiên trình duyệt xuống một lệnh</h3>
<p>Bản tái hiện tối giản ở bài 1.2 cũng áp dụng cho báo cáo. Bỏ trình duyệt đi (curl có bị không?), rồi chia đôi đầu vào — độ dài ghi chú — tới khi một ký tự tạo ra khác biệt. Sau đó tự kiểm luôn câu hỏi hiển nhiên tiếp theo trước khi dev hỏi: đếm theo ký tự hay theo byte?</p>
${ra(THU_NHO)}
<p>Ba sự thật mà tiêu đề mang được: lỗi ở API (không phải ở trang), biên đúng là 255/256, và nó đếm theo ký tự (765 byte tiếng Việt vẫn qua). Tiêu đề tự hiện ra: <em>"POST /api/dat-lich trả 500 khi ghi chú dài hơn 255 ký tự"</em>. Để ý token được giữ trong biến shell — lệnh trong báo cáo không được chứa nó.</p>

<h3>Bước 2 — Môi trường lấy bằng lệnh, không lấy bằng trí nhớ</h3>
${ra(MOI_TRUONG)}
<p>"Bản mới nhất" một tuần sau chẳng còn nghĩa gì. Phiên bản kèm mã băm commit cho dev checkout đúng thứ bạn đã chạy; <code>/health</code> (bài 8.3) có ra là để làm việc này.</p>

<h3>Bước 3 — Request id: đường thẳng tới log server</h3>
${ra(LOG)}
<p>Phản hồi 500 có kèm <code>requestId</code> (và header <code>x-request-id</code>). Có nó, dev không phải lục log theo giờ rồi đoán — một lệnh grep ra luôn mã lỗi PostgreSQL 22001 và thông báo. Nếu hệ thống của bạn trả về request id, nó phải có mặt trong mọi bug report.</p>

<h3>Báo cáo, từng mục một</h3>
${MAU_VI}
<ul>
<li><strong>Tóm tắt</strong> — triệu chứng + ở đâu + điều kiện. Người lướt qua 40 ticket phải biết ticket này nói về gì.</li>
<li><strong>Các bước kèm dữ liệu</strong> — tài khoản nào, phòng nào, đầu vào gì. "Đặt một phòng" chưa phải là một bước; ghi chú 256 ký tự mới là bước.</li>
<li><strong>Mong đợi và thực tế</strong> — điều đúng ra phải xảy ra không phải lúc nào cũng hiển nhiên (có thể 255 là quy định, và bản sửa là trả lời báo 400 chứ không phải nhận thêm ký tự).</li>
<li><strong>Tần suất</strong> — 10/10 và 1/50 là hai lỗi khác hẳn nhau với người đọc.</li>
<li><strong>Sự thật tách khỏi phỏng đoán</strong> — "varchar(255)" được ghi rõ là phỏng đoán. Báo cáo viết phỏng đoán như sự thật sẽ đẩy dev đi sai hướng.</li>
<li><strong>Mỗi ticket một lỗi</strong> — nếu bạn còn thấy trang không hiện lời báo của server, hãy mở ticket thứ hai và liên kết lại.</li>
</ul>

<h3>Severity không phải priority</h3>
${SP_VI}
<p>Severity là lỗi nặng tới đâu; priority là doanh nghiệp muốn sửa gấp tới đâu. Người báo đề xuất, trưởng nhóm hoặc product owner quyết định priority. Ở các dự án outsourcing kiểu FPT, hợp đồng với khách thường định nghĩa sẵn các mức severity và thời gian phản hồi — hãy đọc bảng đó ngay tuần đầu.</p>

<h3>Bằng chứng, và tệp đính kèm làm lộ tài khoản</h3>
<p>Ảnh chụp cho thấy người dùng nhìn thấy gì; một đoạn quay màn hình ngắn cho thấy các bước; log cho thấy góc nhìn của server. Một <strong>tệp HAR</strong> cho thấy mọi request và response — header, body, thời gian — và bên cung cấp phần mềm hay xin tệp này. Nó cũng là một bản sao phiên đăng nhập của người dùng.</p>
${chiTiet('soi-bi-mat.mjs — đếm bí mật còn sót trong HAR', ma(SOI))}
${chiTiet('che-har.mjs — che: header, query, khoá JSON nhạy cảm, rồi thay mọi giá trị đã thu ở mọi chỗ', ma(CHE_HAR))}
${ra(CHE)}
<p>Đọc từ trên xuống. HAR thô chứa <strong>8</strong> chỗ bí mật: cookie phiên, mật khẩu trong body đăng nhập, token trong phản hồi đăng nhập, token trong query của URL, header Bearer. Tài liệu của Chrome ghi <em>Export HAR (sanitized)</em> bỏ header Cookie, Set-Cookie và Authorization — nó chỉ hứa có vậy. <code>che-har.mjs --kieu-chrome</code> làm đúng như thế, và còn <strong>4</strong> chỗ, có cả mật khẩu. Bộ che đầy đủ thu từng giá trị bí mật, che nó ở chỗ tìm thấy rồi thay nó ở mọi chỗ khác (ở đây: trong URL). Phần còn lại — mã 500, body, request id — là đủ cho dev.</p>
<p>(Token còn thấy trong URL ở trên thuộc về một tiến trình demo chạy cục bộ, đã tắt.)</p>

<h3>🕵️ Góc hacker: Okta, tháng 10/2023</h3>
<p>Đội hỗ trợ của Okta yêu cầu khách tải lên tệp HAR để gỡ lỗi. Từ 28/9 tới 17/10/2023, kẻ tấn công truy cập được tệp trong hệ thống hỗ trợ của Okta thuộc 134 khách hàng; một số tệp HAR chứa session token, và token đó được dùng để chiếm phiên Okta của 5 khách. Okta thu hồi các token nằm trong HAR và từ đó khuyến nghị che mọi thông tin đăng nhập, cookie trước khi chia sẻ. BeyondTrust, Cloudflare và 1Password là những khách đã tự phát hiện và công bố góc nhìn của mình. Bài học cho bug report của bạn: một tệp HAR, một đoạn log hay một lệnh "copy as cURL" là thông tin đăng nhập cho tới khi bạn đã kiểm — chạy <code>soi-bi-mat</code> (hoặc công cụ của công ty) trước khi đính kèm bất cứ gì, và ưu tiên dùng tài khoản test.</p>

<h3>Đi làm thật</h3>
<p>Ở outsourcing, bug report đi qua ranh giới hai công ty: QA của khách tạo ticket trên Jira, đội bạn sửa, khách kiểm lại. Báo cáo đi theo cả hai chiều — bạn cũng sẽ báo lỗi API của phía khách. Hai thói quen được để ý: (1) mọi báo cáo bạn tạo đều có bản tái hiện mà người lạ chạy được, và (2) khi nhận một báo cáo mơ hồ, bạn trả lời bằng mẫu đã điền hết mức có thể và chỉ hỏi những mục còn thiếu — thay vì ghi "không tái hiện được" rồi đóng. Nhiều dự án dùng ticket tiếng Anh; khoá <em>Tiếng Anh kỹ thuật khi đi làm</em> chương 2 dạy phần câu chữ.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>c111.sh</code>. Mở <code>loi-chrome.har</code> và tự tìm mật khẩu bằng <code>jq</code>.</li>
<li>Trên trình duyệt của bạn, mở DevTools → Network ở một trang bạn đang đăng nhập, xuất HAR (sanitized) rồi chạy <code>soi-bi-mat.mjs</code> lên nó. Còn sót gì?</li>
<li>Viết lại báo cáo "Lỗi đặt lịch" ở trên theo mẫu, cho một đầu vào khác: <code>ngay</code> = <code>2026-02-30</code>. Chạy thử trước; báo đúng điều thật sự xảy ra.</li>
<li>Xếp severity và priority cho ba lỗi trong dự án của bạn; nhờ một bạn cùng lớp xếp độc lập rồi so.</li>
</ol>
<p><strong>Đạt khi:</strong> một bạn chưa từng thấy lỗi tái hiện được nó chỉ từ báo cáo của bạn, trong chưa đầy năm phút, và tệp đính kèm qua được bước soát bí mật.</p>
</div>

<h3>🗂 Thuật ngữ chính</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bug report / ticket</span><span class="v">Bản bàn giao một lỗi: tóm tắt, môi trường, các bước kèm dữ liệu, mong đợi, thực tế, bằng chứng.</span></div>
  <div class="kv"><span class="k">Bản tái hiện tối giản</span><span class="v">Đầu vào và các bước nhỏ nhất mà vẫn lỗi; tốt nhất là một lệnh.</span></div>
  <div class="kv"><span class="k">Severity</span><span class="v">Lỗi nặng tới đâu (ảnh hưởng kỹ thuật).</span></div>
  <div class="kv"><span class="k">Priority</span><span class="v">Cần sửa gấp tới đâu (quyết định kinh doanh).</span></div>
  <div class="kv"><span class="k">HAR</span><span class="v">HTTP Archive: JSON chứa mọi request/response trình duyệt đã gửi, gồm cả header và body.</span></div>
  <div class="kv"><span class="k">Che (sanitise)</span><span class="v">Xoá hoặc che bí mật (cookie, token, mật khẩu, khoá) trước khi chia sẻ.</span></div>
  <div class="kv"><span class="k">Request id</span><span class="v">Mã trả về cho client và ghi trong log server, nối một báo cáo với đúng dòng log.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Viết cho người lạ: họ phải tái hiện được chỉ từ báo cáo.</li>
<li>Thu nhỏ về một lệnh, tìm đúng biên, tự trả lời trước câu hỏi hiển nhiên kế tiếp.</li>
<li>Môi trường lấy bằng lệnh (phiên bản + commit), các bước kèm dữ liệu, mong đợi và thực tế, tần suất, sự thật tách khỏi phỏng đoán.</li>
<li>Severity ≠ priority; người báo đề xuất, trưởng nhóm quyết định.</li>
<li>HAR = bản sao phiên đăng nhập. Bản sanitized của Chrome chỉ bỏ ba header; phải soát và che cả body lẫn URL.</li>
</ul>
${NGUON}
</div>
`,
};
