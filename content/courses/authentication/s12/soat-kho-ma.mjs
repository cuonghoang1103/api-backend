/**
 * Authentication · Chương 12 · 12.4 — Soát một kho mã không phải bạn viết. Slug giữ: auth-12-4-soat-kho-ma.
 * Không có demo riêng — bài là một bảng kiểm soát (checklist) nối cả khoá; dùng output cuối khoá làm minh hoạ "yếu".
 */
import G from '../giang/auth-12-4.mjs';
import { ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const GREP_EN = `# A few greps find most trouble in an auth codebase:
grep -rn "=== *'ADMIN'"       # scattered authorization (Ch9 — should be one gate)
grep -rn "localStorage"        # a session token in JS-readable storage (Ch3/10)
grep -rn "alg"                 # algorithm handling — is 'none' reachable? (Ch4)
grep -rniE "md5|sha1"          # fast/unsalted hashing of passwords (Ch2)
gitleaks detect                # a secret committed to the repo (Ch1/11)`;
const CHECK_EN = `<table>
<thead><tr><th>Look at</th><th>The question (chapter)</th></tr></thead>
<tbody>
<tr><td>the authorization gate</td><td>is there ONE, deny-by-default, on every write route? (9)</td></tr>
<tr><td>a token end to end</td><td>signed how, stored where, verified how (sig + claims)? (3/4/8)</td></tr>
<tr><td>the recovery path</td><td>one-time, atomic tokens; reset as strong as login? (6/10)</td></tr>
<tr><td>the config / deployment</td><td>cookie flags, CORS, secrets from env, token lifetime? (3/11)</td></tr>
<tr><td>the data, not just the code</td><td>does the current STATE match what code "can" produce?</td></tr>
<tr><td>the checker itself</td><td>does the security test actually run and fail when it should?</td></tr>
</tbody>
</table>`;
const CHECK_VI = `<table>
<thead><tr><th>Nhìn vào</th><th>Câu hỏi (chương)</th></tr></thead>
<tbody>
<tr><td>cổng phân quyền</td><td>có MỘT không, từ-chối-mặc-định, trên mọi tuyến ghi? (9)</td></tr>
<tr><td>một token từ đầu tới cuối</td><td>ký ra sao, lưu ở đâu, xác minh ra sao (chữ ký + claim)? (3/4/8)</td></tr>
<tr><td>đường khôi phục</td><td>token một-lần, nguyên tử; đặt lại mạnh ngang đăng nhập? (6/10)</td></tr>
<tr><td>cấu hình / triển khai</td><td>cờ cookie, CORS, bí mật từ env, vòng đời token? (3/11)</td></tr>
<tr><td>dữ liệu, không chỉ mã</td><td>TRẠNG THÁI hiện tại có khớp cái mã "có thể" tạo không?</td></tr>
<tr><td>chính cái chắn</td><td>test bảo mật có thực sự chạy và trượt khi nó nên không?</td></tr>
</tbody>
</table>`;

const NGUON_EN = [
  nguon('📋', 'OWASP — Application Security Verification Standard (ASVS)', 'The checklist a reviewer verifies auth against — V2 Authentication, V3 Session, V4 Access Control (read 04/11/2026).', 'https://owasp.org/www-project-application-security-verification-standard/'),
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Broken Access Control', 'The first thing a review checks — the one gate (read 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
].join('\n');
const NGUON_VI = [
  nguon('📋', 'OWASP — Application Security Verification Standard (ASVS)', 'Bảng kiểm một người soát đối chiếu xác thực — V2 Authentication, V3 Session, V4 Access Control (đọc 04/11/2026).', 'https://owasp.org/www-project-application-security-verification-standard/'),
  nguon('🥇', 'OWASP Top 10 (2021) — A01: Kiểm soát truy cập hỏng', 'Thứ đầu tiên một lần soát kiểm — một cổng (đọc 04/11/2026).', 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'),
].join('\n');

export default {
  title: '12.4 — Reviewing a codebase you did not write|||12.4 — Soát một kho mã không phải bạn viết',
  slug: 'auth-12-4-soat-kho-ma',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Phần lớn mã xác thực bạn đụng, bạn không viết. Soát nó là một kỹ năng riêng: một danh sách ngắn những thứ thường sai, kiểm theo thứ tự. (1) Bắt đầu từ CỔNG không phải tính năng: có MỘT cổng phân quyền không, từ-chối-mặc-định, mọi tuyến ghi qua nó? (Ch9). (2) LẦN một token từ đầu tới cuối: ký ra sao (alg, none có khả thi? Ch4), lưu ở đâu (cookie/localStorage Ch3/10), xác minh ra sao (chữ ký VÀ claim Ch8). (3) GREP các phản mẫu: ===\'ADMIN\', localStorage, alg, md5|sha1, một chuỗi trông-bí-mật. (4) KHÔI PHỤC là phần yếu (Ch10): token đặt lại một-lần + nguyên tử (10.5), đặt lại mạnh ngang đăng nhập. (5) ĐỌC cấu hình không chỉ mã (Ch11). (6) TIN DỮ LIỆU không chỉ mã ("mã không thể tạo X" ≠ "X không tồn tại" — hỏi dữ liệu). (7) XÁC MINH cái chắn (test qua ≠ test đúng). (8) Viết phát hiện = rủi ro + chương + cách sửa một dòng. Cả khoá là một bảng kiểm. Theo OWASP ASVS + A01.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Reviewing a codebase you did not write</h2>
<p class="lead">Most of the auth code you touch, you did not write — you inherit it, review a PR against it, or audit it. Reviewing it well is its own skill, and it is not reading top to bottom. It is a short list of the things that are usually wrong, checked in a deliberate order, so you find the real risk in minutes instead of hours.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> review an auth codebase from the highest-risk thing down; use greps that find the course's anti-patterns; and write findings as risk + chapter + one-line fix.</p>
</div>

<h3>Start at the gate, not the feature</h3>
<p>Do not read the login handler first. Find the <em>authorization gate</em> (Chapter 9): is there ONE, is it deny-by-default, does every write route go through it? A system with scattered <code>if (role === 'ADMIN')</code> checks is where the real bugs hide, and you can see that structure in minutes. Broken Access Control is OWASP's number one; it is the first thing a review should confirm.</p>

<h3>Follow one token end to end</h3>
<p>Trace a single token through the system: where is it <strong>signed</strong> (which algorithm, is <code>none</code> reachable — Chapter 4), where is it <strong>stored</strong> (a <code>__Host-</code> HttpOnly cookie, or localStorage — Chapters 3/10), where is it <strong>verified</strong> (signature <em>and</em> claims — Chapter 8). A gap anywhere on that path is a bypass. The review table, and the greps that jump-start it:</p>
${CHECK_EN}
${GREP_EN ? '' : ''}
<pre><code class="language-bash">${GREP_EN.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

<h3>The parts everyone forgets</h3>
<p><strong>The recovery path</strong> is usually weaker than the login (Chapter 10): read the password-reset and MFA-reset flows — are reset tokens one-time and atomic (10.5), is the reset as strong as the login? <strong>The config</strong> is half the risk: cookie flags, CORS, token lifetime, whether secrets come from the env (Chapter 11) — code can be perfect and the deployment insecure. And <strong>the data</strong> has its own history: "the code cannot produce state X" does not mean X does not exist, because migrations and manual edits made it. When the question is about the current state, ask the data with a query, not only the code.</p>

<h3>Verify the checker, then write it down</h3>
<p>A passing test proves nothing if the test is wrong — the smoke-test that never ran, the lint that was disabled. Before you trust a control, confirm its check actually runs and fails when it should. Then make the findings actionable: for each issue, the risk, the chapter it violates, and the one-line fix. "Logs the reset token (11.4), leaks a secret, drop the field" gets fixed; "the logging looks sketchy" does not.</p>

<h3>The capstone as a review</h3>
<p>The final project's weak build is a review in miniature — each failed scenario is a chapter it skipped, named in the scorecard:</p>
${ra(OUT['cuoi-yeu'])}
<p>Reading that scorecard is exactly the review skill: a ✓ for the basics it got right (hashing, cookies, refresh) and a ✗ for each hardening it missed, each pointing at the lesson that prevents it.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — reviewing for style, not risk.</strong> It is easy to fill a review with naming and formatting nits and miss that the authorization is scattered or a secret is committed. Spend the review budget on the high-risk list — the gate, the token path, recovery, config, the data — in that order. A clean-reading handler with no authorization gate is far more dangerous than a messy one that is correctly guarded.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"You inherit an auth service — where do you start?"</strong> — The authorization gate (is there one, deny-by-default), then follow a token end to end, then the recovery path and config.</li>
<li><strong>"How do you quickly spot auth anti-patterns?"</strong> — Grep: scattered role checks, localStorage tokens, <code>alg</code> handling, <code>md5</code>/<code>sha1</code>, committed secrets.</li>
<li><strong>"The code says state X is impossible."</strong> — Possibility is not reality — data has a history from migrations and manual edits. Ask the data with a query.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>You open an unfamiliar auth service for a security review. What is the first thing you look for, and why?</li>
<li>Name three greps that would surface the course's anti-patterns, and what each one finds.</li>
<li>A test for "cross-tenant access is blocked" passes. What must you confirm before trusting it?</li>
</ol>
<p><strong>Solution:</strong> (1) the authorization gate — is there one, is it deny-by-default, does every write route go through it? Broken Access Control is OWASP #1 and the highest-risk thing. (2) <code>=== 'ADMIN'</code> (scattered authz), <code>localStorage</code> (token storage), <code>md5|sha1</code> (weak hashing) — plus <code>alg</code> and gitleaks. (3) that the test actually runs and fails when cross-tenant access is allowed — a green test on a disabled or wrong check proves nothing.</p>
<p><strong>Done when:</strong> you review from highest risk down, grep the anti-patterns, and write findings as risk + chapter + fix.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">review order</span><span class="v">Gate → token path → recovery → config → data → the checker.</span></div>
  <div class="kv"><span class="k">anti-pattern grep</span><span class="v">A search that surfaces a known bug class (scattered authz, localStorage, weak hash).</span></div>
  <div class="kv"><span class="k">ASVS</span><span class="v">OWASP's verification checklist for auth, sessions and access control.</span></div>
  <div class="kv"><span class="k">ask the data</span><span class="v">Query the current state; code possibility is not data reality.</span></div>
  <div class="kv"><span class="k">verify the checker</span><span class="v">Confirm a control's test actually runs and fails when it should.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Review from highest risk down: the one gate, a token end to end, recovery, config, the data.</li>
<li>Grep the anti-patterns — scattered authz, localStorage, <code>alg</code>, weak hashing, committed secrets.</li>
<li>The recovery path and the config carry half the risk; read them like the handlers.</li>
<li>Ask the data, not just the code; verify the checker actually runs.</li>
<li>Write findings as risk + chapter + one-line fix — precise findings get fixed.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-9-5-dat-phep-kiem-o-dau', title: 'Back to 9.5 — the one gate a review looks for first', sub: 'There, building the single authorization gate every route is forced through. Here, finding whether a system you did not write actually has one. The thing you built is the first thing you review.', cta: 'OPEN LESSON 9.5 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Soát một kho mã không phải bạn viết</h2>
<p class="lead">Phần lớn mã xác thực bạn đụng, bạn không viết — bạn thừa kế nó, soát một PR với nó, hay audit nó. Soát nó tốt là một kỹ năng riêng, và nó không phải đọc trên xuống. Nó là một danh sách ngắn những thứ thường sai, kiểm theo một thứ tự có chủ đích, để bạn tìm rủi ro thật trong vài phút thay vì vài giờ.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> soát một kho mã xác thực từ thứ rủi-ro-cao-nhất xuống; dùng các grep tìm các phản mẫu của khoá; và viết phát hiện như rủi ro + chương + cách sửa một dòng.</p>
</div>

<h3>Bắt đầu từ cổng, không phải tính năng</h3>
<p>Đừng đọc handler đăng nhập trước. Tìm <em>cổng phân quyền</em> (Chương 9): có MỘT không, nó từ-chối-mặc-định không, mọi tuyến ghi có đi qua nó không? Một hệ với phép kiểm <code>if (role === 'ADMIN')</code> rải rác là nơi lỗi thật nấp, và bạn thấy cấu trúc đó trong vài phút. Kiểm soát truy cập hỏng là số một của OWASP; nó là thứ đầu tiên một lần soát nên xác nhận.</p>

<h3>Lần một token từ đầu tới cuối</h3>
<p>Lần một token duy nhất qua hệ thống: nó <strong>ký</strong> ở đâu (thuật toán nào, <code>none</code> có với tới được — Chương 4), nó <strong>lưu</strong> ở đâu (một cookie <code>__Host-</code> HttpOnly, hay localStorage — Chương 3/10), nó <strong>xác minh</strong> ở đâu (chữ ký <em>và</em> claim — Chương 8). Một khoảng trống bất kỳ trên đường đó là một bypass. Bảng soát, và các grep khởi động nó:</p>
${CHECK_VI}
<pre><code class="language-bash">${GREP_EN.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

<h3>Các phần ai cũng quên</h3>
<p><strong>Đường khôi phục</strong> thường yếu hơn đăng nhập (Chương 10): đọc các luồng đặt-lại-mật-khẩu và đặt-lại-MFA — token đặt lại có một-lần và nguyên tử không (10.5), đặt lại có mạnh ngang đăng nhập không? <strong>Cấu hình</strong> là nửa rủi ro: cờ cookie, CORS, vòng đời token, bí mật có từ env không (Chương 11) — mã có thể hoàn hảo và việc triển khai không an toàn. Và <strong>dữ liệu</strong> có lịch sử riêng: "mã không thể tạo trạng thái X" không nghĩa là X không tồn tại, vì migration và sửa tay tạo ra nó. Khi câu hỏi là về trạng thái hiện tại, hỏi dữ liệu bằng một truy vấn, không chỉ mã.</p>

<h3>Xác minh cái chắn, rồi viết xuống</h3>
<p>Một test qua chẳng chứng minh gì nếu test sai — cái smoke-test chưa bao giờ chạy, cái lint bị tắt. Trước khi bạn tin một control, xác nhận phép kiểm của nó thực sự chạy và trượt khi nó nên. Rồi làm các phát hiện hành động được: với mỗi vấn đề, rủi ro, chương nó vi phạm, và cách sửa một dòng. "Log token đặt lại (11.4), rò một bí mật, bỏ trường" được sửa; "việc log trông mờ ám" thì không.</p>

<h3>Dự án cuối như một lần soát</h3>
<p>Build yếu của dự án cuối là một lần soát thu nhỏ — mỗi kịch bản trượt là một chương nó bỏ qua, gọi tên trong bảng điểm:</p>
${ra(OUT['cuoi-yeu'])}
<p>Đọc bảng điểm đó đúng là kỹ năng soát: một ✓ cho cơ bản nó làm đúng (băm, cookie, refresh) và một ✗ cho mỗi hardening nó bỏ sót, mỗi cái chỉ vào bài ngăn nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — soát vì phong cách, không vì rủi ro.</strong> Dễ lấp một lần soát bằng các vặt vãnh đặt tên và định dạng mà bỏ sót rằng phân quyền rải rác hay một bí mật đã commit. Dùng ngân sách soát cho danh sách rủi-ro-cao — cổng, đường token, khôi phục, cấu hình, dữ liệu — theo thứ tự đó. Một handler đọc sạch không có cổng phân quyền nguy hiểm hơn nhiều một cái lộn xộn mà được canh đúng.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn thừa kế một dịch vụ xác thực — bắt đầu từ đâu?"</strong> — Cổng phân quyền (có một không, từ-chối-mặc-định), rồi lần một token từ đầu tới cuối, rồi đường khôi phục và cấu hình.</li>
<li><strong>"Bạn phát hiện nhanh phản mẫu xác thực ra sao?"</strong> — Grep: phép kiểm vai rải rác, token localStorage, xử lý <code>alg</code>, <code>md5</code>/<code>sha1</code>, bí mật đã commit.</li>
<li><strong>"Mã nói trạng thái X là bất khả."</strong> — Khả năng không phải thực tế — dữ liệu có lịch sử từ migration và sửa tay. Hỏi dữ liệu bằng một truy vấn.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Bạn mở một dịch vụ xác thực lạ cho một lần soát bảo mật. Thứ đầu tiên bạn tìm là gì, và vì sao?</li>
<li>Gọi tên ba grep sẽ làm nổi các phản mẫu của khoá, và mỗi cái tìm gì.</li>
<li>Một test cho "truy cập khác tenant bị chặn" qua. Bạn phải xác nhận gì trước khi tin nó?</li>
</ol>
<p><strong>Lời giải:</strong> (1) cổng phân quyền — có một không, nó từ-chối-mặc-định không, mọi tuyến ghi qua nó không? Kiểm soát truy cập hỏng là OWASP #1 và là thứ rủi-ro-cao-nhất. (2) <code>=== 'ADMIN'</code> (authz rải rác), <code>localStorage</code> (lưu token), <code>md5|sha1</code> (băm yếu) — cộng <code>alg</code> và gitleaks. (3) rằng test thực sự chạy và trượt khi truy cập khác tenant được cho phép — một test xanh trên một phép kiểm bị tắt hay sai chẳng chứng minh gì.</p>
<p><strong>Đạt khi:</strong> bạn soát từ rủi-ro-cao-nhất xuống, grep các phản mẫu, và viết phát hiện như rủi ro + chương + cách sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">review order (thứ tự soát)</span><span class="v">Cổng → đường token → khôi phục → cấu hình → dữ liệu → cái chắn.</span></div>
  <div class="kv"><span class="k">anti-pattern grep</span><span class="v">Một tìm kiếm làm nổi một lớp lỗi biết trước (authz rải rác, localStorage, băm yếu).</span></div>
  <div class="kv"><span class="k">ASVS</span><span class="v">Bảng kiểm xác minh của OWASP cho xác thực, phiên và kiểm soát truy cập.</span></div>
  <div class="kv"><span class="k">ask the data (hỏi dữ liệu)</span><span class="v">Truy vấn trạng thái hiện tại; khả năng của mã không phải thực tế của dữ liệu.</span></div>
  <div class="kv"><span class="k">verify the checker (xác minh cái chắn)</span><span class="v">Xác nhận test của một control thực sự chạy và trượt khi nó nên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Soát từ rủi-ro-cao-nhất xuống: một cổng, một token từ đầu tới cuối, khôi phục, cấu hình, dữ liệu.</li>
<li>Grep các phản mẫu — authz rải rác, localStorage, <code>alg</code>, băm yếu, bí mật đã commit.</li>
<li>Đường khôi phục và cấu hình mang nửa rủi ro; đọc chúng như các handler.</li>
<li>Hỏi dữ liệu, không chỉ mã; xác minh cái chắn thực sự chạy.</li>
<li>Viết phát hiện như rủi ro + chương + cách sửa một dòng — phát hiện chính xác được sửa.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-9-5-dat-phep-kiem-o-dau', title: 'Quay lại 9.5 — một cổng một lần soát tìm trước', sub: 'Ở đó, dựng một cổng phân quyền mọi tuyến bị buộc qua. Ở đây, tìm xem một hệ bạn không viết có thực sự có một cái không. Thứ bạn dựng là thứ đầu tiên bạn soát.', cta: 'MỞ BÀI 9.5 →' })}
</div>
`,
};
