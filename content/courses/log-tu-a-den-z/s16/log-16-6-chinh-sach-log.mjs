/**
 * 16.6 — Viết chính sách log một trang (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/chinh-sach'] (node --test, Node 22, pino 9: 3 đạt 1 trượt vì console.log(req.body) ⇒ xoá dòng ⇒ 4/4).
 * Nguồn: OWASP Logging Cheat Sheet + Logging Vocabulary Cheat Sheet; NIST SP 800-92 (2006, Final) và SP 800-92 Rev. 1 (bản nháp công bố 11/10/2023 — kiểm 24/11/2026 chưa thấy bản chính thức).
 */
import { lenh, ma, nguon, lienKet, kv, escHtml } from '../_chung.mjs';

const MAU = `# CHÍNH SÁCH LOG — <tên dự án>            phiên bản 1.0 · <ngày> · người duyệt: <tên>

1. MỤC ĐÍCH   Log dùng để: gỡ lỗi, điều tra bảo mật, kiểm toán thao tác quản trị.
              Không dùng log để: phân tích hành vi người dùng (dùng analytics có đồng ý).

2. GHI GÌ     Mỗi request: 1 dòng kết thúc (method, route, status, ms, requestId, userId).
              Luôn ghi:  đăng nhập đúng/sai · đổi mật khẩu/quyền · thao tác admin ·
                         lỗi 5xx kèm stack · từ chối truy cập (401/403) · lỗi kiểm tra đầu vào.
              Tên sự kiện theo OWASP Logging Vocabulary: authn_login_fail:<userId> …

3. MỨC LOG    error: cần người xử lý · warn: bất thường tự hồi phục · info: sự kiện nghiệp vụ ·
              debug: chỉ ở máy dev/staging. Production mặc định info, đổi tạm qua cấu hình.

4. ĐỊNH DẠNG  JSON một dòng, UTC ISO 8601, trường bắt buộc: time level service msg requestId.
              Một logger chung (src/logger) — cấm console.log cho log nghiệp vụ.

5. KHÔNG GHI  Mật khẩu, OTP, token, cookie, header Authorization, số thẻ đầy đủ, CVV,
              CCCD/hộ chiếu, chuỗi kết nối có mật khẩu, nguyên body request/response.
              Email/SĐT/IP chỉ khi có lý do ở mục 1. Che bằng redact + lớp che ở bộ gửi log.

6. GIỮ BAO LÂU  debug 3 ngày · ứng dụng 14 ngày (nóng) · access log 90 ngày ·
              đăng nhập/admin 12 tháng (lạnh, bất biến) · rồi XOÁ (kể cả bản sao lưu).

7. AI ĐƯỢC    Đọc: dev xem log app trên Grafana (Viewer); log đăng nhập/admin: trưởng nhóm.
              Ghi: chỉ bộ gửi log (tài khoản chỉ-được-ghi). Xoá trước hạn: không ai.

8. LƯU Ở ĐÂU  Loki (nóng) + MinIO/S3 Object Lock (lạnh). Không để log trên máy cá nhân;
              log khách gửi: thư mục mã hoá, xoá khi đóng ticket.

9. CẢNH BÁO   5xx > 5 trong 5 phút · đăng nhập sai > 10 · nguồn log im lặng 15 phút.

10. KIỂM      Phép thử chính sách chạy trong CI · quét bí mật mỗi tuần · rà quyền mỗi tháng ·
              sự cố lộ dữ liệu qua log ⇒ thu hồi bí mật trước, rồi xoá mọi bản sao, ghi ticket.`;

const REVIEW = `## Checklist review — phần log (dán vào mẫu Pull Request)
- [ ] Không log nguyên req / body / object chứa dữ liệu người dùng (chỉ các trường cần)
- [ ] Không bí mật trong URL mới (token, code, password ở query string)
- [ ] Lỗi được log MỘT lần ở nơi xử lý, kèm stack và requestId — không log rồi ném lại
- [ ] Mức log đúng (error = cần người xử lý), thông điệp cố định + dữ liệu ở trường
- [ ] Sự kiện bảo mật mới (đăng nhập, phân quyền, admin) đã có dòng log theo tên chuẩn
- [ ] Không còn console.log / printStackTrace / System.out gỡ lỗi
- [ ] npm test (chinh-sach.test.mjs) xanh`;

export default {
  title: 'Writing a one-page logging policy for a team project or a small company|||Viết chính sách log một trang cho đồ án nhóm hoặc công ty nhỏ',
  slug: 'log-16-6-chinh-sach-log',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Gom Chương 10–16 vào MỘT trang mười mục: mục đích, ghi gì (theo OWASP Logging Cheat Sheet và Logging Vocabulary), mức, định dạng, không ghi gì, giữ bao lâu, ai được đọc/ghi/xoá, lưu ở đâu, cảnh báo, kiểm thế nào. Mẫu điền sẵn cho đồ án SWP391 + checklist review Pull Request. Rồi biến chính sách thành phép thử chạy trong CI (node --test): mật khẩu/token/OTP/CCCD không ra log, trường bắt buộc, production không debug, cấm console.log(req.body) — chạy thật, đỏ khi có người thêm dòng gỡ lỗi "tạm". Đối chiếu NIST SP 800-92.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.6</span>
<h2>One page that everyone follows</h2>
<p class="lead">Every earlier lesson ended with a rule: one line per request, JSON, no secrets, 12 months for auth, read access by role… In a team, rules that live only in one person's head are broken in the first week. A logging policy is those rules on <strong>one page</strong> — short enough to be read, specific enough to be checked — plus the checks themselves, running in CI.</p>

<h3>The everyday picture: the house rules on the fridge</h3>
<p>A shared flat works with a short list on the fridge: who takes out the rubbish, quiet after 23:00, label your food. Nobody reads a 40-page contract; everybody reads the fridge. And the best rules are the ones that check themselves — a lock that closes automatically beats "please lock the door".</p>

<h3>The ten sections</h3>
<p>Each answers one question an auditor, a new team member or your future self will ask, and points to the lesson that explains it:</p>
<ol>
<li><strong>Purpose</strong> — what logs are for and not for (16.1).</li>
<li><strong>What to log</strong> — the request line, security events, errors (10.4–10.8). OWASP's list of events always worth logging: authentication successes and failures, authorisation failures, session management events, input validation failures, application errors, administrative actions, use of high-risk functions.</li>
<li><strong>Levels</strong> — what error/warn/info/debug mean <em>in this project</em> (1.3).</li>
<li><strong>Format</strong> — JSON, UTC, mandatory fields, one logger (1.4, 10.8).</li>
<li><strong>Never log</strong> (16.3).</li>
<li><strong>Retention</strong> per stream (16.1, 16.2).</li>
<li><strong>Access</strong> — read, write, delete (16.4).</li>
<li><strong>Where</strong> — stores and tiers (15, 16.4).</li>
<li><strong>Alerts</strong> — the three minimum (15.5).</li>
<li><strong>Checks</strong> — tests, scans, reviews, and what to do on a leak (16.3, 16.5).</li>
</ol>

<h3>A filled example (team project, SWP391-sized)</h3>
<pre><code>${escHtml(MAU)}</code></pre>
<p>Event names follow the <strong>OWASP Logging Vocabulary</strong> (<code>authn_login_fail</code>, <code>authz_fail</code>, <code>user_created</code>, <code>privilege_permissions_changed</code>, <code>sys_crash</code>…): when every service names the same event the same way, one query finds it everywhere.</p>

<h3>Put it into code review</h3>
<pre><code>${escHtml(REVIEW)}</code></pre>

<h3>Make the policy a test</h3>
<p>Rules that a machine can check should be checked by a machine. Section 4 says "one shared logger"; section 5 says "never log"; section 3 says "no debug in production". Here they are as tests against the project's real logger:</p>
${ma('javascript', 's16/chinh-sach/logger.mjs')}
${ma('javascript', 's16/chinh-sach/chinh-sach.test.mjs')}
<p>Someone added a "temporary" debug line:</p>
${ma('javascript', 's16/chinh-sach/src/dang-nhap.mjs')}
${lenh('s16/chinh-sach', 0)}
${lenh('s16/chinh-sach', 1)}
<p>The pull request is red and names the file; removing the line makes it green (4/4). The first three tests also protect the policy from a well-meant refactor that drops a path from <code>redact</code>. In a Spring project the same idea is a JUnit test with Logback's <code>ListAppender</code> (capture events, assert no secret appears) plus an ArchUnit rule forbidding <code>System.out</code>.</p>

<h3>Measure it against the references</h3>
<ul>
<li><strong>OWASP Logging Cheat Sheet</strong> — which events, which fields, data to exclude, protection of logs. Read the "Data to exclude" and "Event attributes" sections against your sections 2, 4, 5.</li>
<li><strong>NIST SP 800-92</strong>, "Guide to Computer Security Log Management" (2006) — the classic: policy, infrastructure, operational processes. A revision, SP 800-92 Rev. 1 "Cybersecurity Log Management Planning Guide", was published as a draft in October 2023; when checked for this course (November 2026) it was still a draft — check its status before citing it.</li>
<li><strong>Your law and your contract</strong> — section 6 must name them (16.1).</li>
</ul>

<h3>🛡️ Attacker's corner</h3>
<p>Each incident in this chapter was a policy failure, not a technology gap: Twitter and GitHub (2018) had hashing — but no rule-as-test that a password never reaches a log; Facebook (2019) had the logs — but no review of who could search them. A one-page policy with tests for sections 5 and 7 targets exactly those gaps.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"What would you put in a logging policy?" — the ten sections, in one breath.</li>
<li>"How do you make sure developers follow it?" — one shared logger, PR checklist, tests in CI, weekly secret scan.</li>
<li>"What security events must an app log?" — OWASP's list in section 2.</li>
</ul>

<h3>Real-world situations</h3>
<ul>
<li><strong>Outsourcing</strong>: many customers send their own logging/security guideline in the first week. Map it onto the ten sections; ask about anything missing (often retention and who may read).</li>
<li><strong>SWP391 / capstone</strong>: put the page in the repository as <code>docs/CHINH-SACH-LOG.md</code> and the tests in CI — it is a strong talking point in the defence and in interviews.</li>
</ul>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok"><ol>
<li>Copy the template and fill it for your current team project. Keep it to one page.</li>
<li>Add a fifth test: every line at level <code>error</code> must have an <code>err</code> field with a stack.</li>
<li>Exchange policies with a classmate and find two rules in theirs that cannot be checked; rewrite them so they can.</li>
</ol>
<p><strong>Pass:</strong> (1) ten sections, each with at least one number or name (days, roles, fields); (2) log <code>log.error({ err: new Error('x') }, 'lỗi')</code> into the captured stream and assert <code>dong[0].err.stack</code> exists; (3) e.g. "log appropriately" → "every 5xx has one error line with requestId and stack".</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Logging policy', 'Short, checkable document: what, how, how long, who, where.'],
  ['OWASP Logging Vocabulary', 'Standard event names such as authn_login_fail.'],
  ['Policy as code / as test', 'Rules enforced by automated checks in CI.'],
  ['NIST SP 800-92', 'US guide to security log management (2006; Rev. 1 in draft).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>One page, ten sections, each with numbers and names.</li>
<li>Code review checklist for logging.</li>
<li>Enforce what can be enforced: one logger, redaction tests, no console.log, no debug in production.</li>
<li>Check against OWASP and NIST; name the law and contract.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.6</span>
<h2>Một trang mà cả đội làm theo</h2>
<p class="lead">Bài nào trước đó cũng khép lại bằng một quy tắc: mỗi request một dòng, JSON, không bí mật, log đăng nhập giữ 12 tháng, quyền đọc theo vai trò… Trong một đội, quy tắc chỉ nằm trong đầu một người sẽ bị phá ngay tuần đầu. Chính sách log là những quy tắc đó trên <strong>một trang</strong> — đủ ngắn để được đọc, đủ cụ thể để kiểm được — cộng với chính các phép kiểm, chạy trong CI.</p>

<h3>Liên tưởng đời thường: nội quy dán trên tủ lạnh</h3>
<p>Một căn hộ ở chung vận hành nhờ một danh sách ngắn trên tủ lạnh: ai đổ rác, sau 23 giờ giữ yên lặng, đồ ăn phải dán tên. Không ai đọc bản hợp đồng 40 trang; ai cũng đọc tủ lạnh. Và quy tắc tốt nhất là quy tắc tự kiểm — một ổ khoá tự đóng hơn hẳn tấm biển "nhớ khoá cửa".</p>

<h3>Mười mục</h3>
<p>Mỗi mục trả lời một câu mà kiểm toán viên, thành viên mới hay chính bạn sau này sẽ hỏi, và trỏ về bài đã giải thích nó:</p>
<ol>
<li><strong>Mục đích</strong> — log dùng để làm gì và không để làm gì (16.1).</li>
<li><strong>Ghi gì</strong> — dòng request, sự kiện bảo mật, lỗi (10.4–10.8). Danh sách sự kiện OWASP khuyên luôn ghi: đăng nhập thành công và thất bại, từ chối phân quyền, sự kiện quản lý phiên, lỗi kiểm tra dữ liệu vào, lỗi ứng dụng, thao tác quản trị, dùng chức năng rủi ro cao.</li>
<li><strong>Mức log</strong> — error/warn/info/debug nghĩa là gì <em>trong dự án này</em> (1.3).</li>
<li><strong>Định dạng</strong> — JSON, UTC, các trường bắt buộc, một logger chung (1.4, 10.8).</li>
<li><strong>Không bao giờ ghi</strong> (16.3).</li>
<li><strong>Thời gian lưu</strong> theo từng luồng (16.1, 16.2).</li>
<li><strong>Quyền</strong> — đọc, ghi, xoá (16.4).</li>
<li><strong>Lưu ở đâu</strong> — kho và tầng (15, 16.4).</li>
<li><strong>Cảnh báo</strong> — ba cái tối thiểu (15.5).</li>
<li><strong>Kiểm</strong> — phép thử, quét, review, và làm gì khi lộ (16.3, 16.5).</li>
</ol>

<h3>Một mẫu điền sẵn (đồ án nhóm cỡ SWP391)</h3>
<pre><code>${escHtml(MAU)}</code></pre>
<p>Tên sự kiện theo <strong>OWASP Logging Vocabulary</strong> (<code>authn_login_fail</code>, <code>authz_fail</code>, <code>user_created</code>, <code>privilege_permissions_changed</code>, <code>sys_crash</code>…): khi mọi dịch vụ gọi cùng một sự kiện bằng cùng một tên, một câu truy vấn tìm được nó ở mọi nơi.</p>

<h3>Đưa vào review mã</h3>
<pre><code>${escHtml(REVIEW)}</code></pre>

<h3>Biến chính sách thành phép thử</h3>
<p>Quy tắc nào máy kiểm được thì để máy kiểm. Mục 4 nói "một logger chung"; mục 5 nói "không bao giờ ghi"; mục 3 nói "không debug trên production". Đây là chúng dưới dạng phép thử chạy trên chính logger của dự án:</p>
${ma('javascript', 's16/chinh-sach/logger.mjs')}
${ma('javascript', 's16/chinh-sach/chinh-sach.test.mjs')}
<p>Có người thêm một dòng gỡ lỗi "tạm":</p>
${ma('javascript', 's16/chinh-sach/src/dang-nhap.mjs')}
${lenh('s16/chinh-sach', 0)}
${lenh('s16/chinh-sach', 1)}
<p>Pull request đỏ và chỉ đúng tệp; xoá dòng đó là xanh (4/4). Ba phép thử đầu còn bảo vệ chính sách khỏi một lần refactor có ý tốt mà lỡ bỏ một đường dẫn khỏi <code>redact</code>. Với dự án Spring, cùng ý tưởng là một phép thử JUnit dùng <code>ListAppender</code> của Logback (bắt các sự kiện, khẳng định không bí mật nào xuất hiện) cộng một luật ArchUnit cấm <code>System.out</code>.</p>

<h3>Đối chiếu với tài liệu chuẩn</h3>
<ul>
<li><strong>OWASP Logging Cheat Sheet</strong> — sự kiện nào, trường nào, dữ liệu phải loại trừ, bảo vệ log. Đọc mục "Data to exclude" và "Event attributes" đối chiếu với mục 2, 4, 5 của bạn.</li>
<li><strong>NIST SP 800-92</strong>, "Guide to Computer Security Log Management" (2006) — tài liệu kinh điển: chính sách, hạ tầng, quy trình vận hành. Bản sửa đổi SP 800-92 Rev. 1 "Cybersecurity Log Management Planning Guide" được công bố dạng nháp tháng 10/2023; khi kiểm cho khoá này (tháng 11/2026) vẫn là bản nháp — kiểm trạng thái trước khi trích dẫn.</li>
<li><strong>Luật và hợp đồng của bạn</strong> — mục 6 phải gọi tên chúng (16.1).</li>
</ul>

<h3>🛡️ Góc hacker</h3>
<p>Mỗi sự cố trong chương này là lỗi chính sách, không phải thiếu công nghệ: Twitter và GitHub (2018) đã có băm mật khẩu — nhưng không có quy tắc-thành-phép-thử rằng mật khẩu không bao giờ chạm tới log; Facebook (2019) có log — nhưng không rà soát ai tìm kiếm được trong đó. Một chính sách một trang có phép thử cho mục 5 và mục 7 nhắm đúng vào những lỗ hổng đó.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Bạn sẽ đưa gì vào chính sách log?" — mười mục, nói một hơi.</li>
<li>"Làm sao chắc lập trình viên làm theo?" — một logger chung, checklist PR, phép thử trong CI, quét bí mật mỗi tuần.</li>
<li>"Ứng dụng phải ghi những sự kiện bảo mật nào?" — danh sách OWASP ở mục 2.</li>
</ul>

<h3>Tình huống đi làm thật</h3>
<ul>
<li><strong>Outsourcing</strong>: nhiều khách gửi hướng dẫn log/bảo mật riêng ngay tuần đầu. Ánh xạ nó vào mười mục; hỏi lại mục nào thiếu (hay thiếu nhất là thời gian lưu và ai được đọc).</li>
<li><strong>SWP391 / đồ án tốt nghiệp</strong>: đặt trang này vào kho mã thành <code>docs/CHINH-SACH-LOG.md</code> và phép thử vào CI — một điểm nói rất mạnh khi bảo vệ và khi phỏng vấn.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Chép mẫu và điền cho đồ án nhóm hiện tại của bạn. Giữ trong một trang.</li>
<li>Thêm phép thử thứ năm: mọi dòng mức <code>error</code> phải có trường <code>err</code> kèm stack.</li>
<li>Đổi chính sách với một bạn cùng lớp và tìm hai quy tắc của bạn ấy không kiểm được; viết lại để kiểm được.</li>
</ol>
<p><strong>Đạt khi:</strong> (1) đủ mười mục, mục nào cũng có ít nhất một con số hoặc một cái tên (ngày, vai trò, trường); (2) ghi <code>log.error({ err: new Error('x') }, 'lỗi')</code> vào luồng bắt được và khẳng định <code>dong[0].err.stack</code> tồn tại; (3) vd "ghi log hợp lý" → "mỗi lỗi 5xx có đúng một dòng error kèm requestId và stack".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Chính sách log', 'Tài liệu ngắn, kiểm được: ghi gì, thế nào, bao lâu, ai, ở đâu.'],
  ['OWASP Logging Vocabulary', 'Tên sự kiện chuẩn như authn_login_fail.'],
  ['Chính sách thành mã / phép thử', 'Quy tắc được ép bằng phép kiểm tự động trong CI.'],
  ['NIST SP 800-92', 'Hướng dẫn quản lý log bảo mật của Mỹ (2006; Rev. 1 đang là bản nháp).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một trang, mười mục, mục nào cũng có số và tên.</li>
<li>Checklist review mã cho phần log.</li>
<li>Ép những gì ép được: một logger, phép thử che, cấm console.log, không debug trên production.</li>
<li>Đối chiếu OWASP và NIST; gọi tên luật và hợp đồng.</li>
</ul>
${nguon('📘', 'OWASP — Logging Cheat Sheet', 'Sự kiện cần ghi, thuộc tính, dữ liệu loại trừ', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')}
${nguon('📘', 'OWASP — Logging Vocabulary Cheat Sheet', 'authn_login_fail, authz_fail, user_created…', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html')}
${nguon('📘', 'NIST SP 800-92 Rev. 1 (Initial Public Draft, 10/2023)', 'Cybersecurity Log Management Planning Guide', 'https://csrc.nist.gov/pubs/sp/800/92/r1/ipd')}
${nguon('📘', 'NIST SP 800-92 (2006)', 'Guide to Computer Security Log Management', 'https://csrc.nist.gov/pubs/sp/800/92/final')}
${lienKet({ khoa: 'testing', bai: 'tst-11-4-ci', title: 'Testing 11.4 — Đưa vào CI, và checklist cuối', sub: 'Chạy phép thử chính sách như một check bắt buộc', cta: 'Mở bài' })}
</div>
`,
};
