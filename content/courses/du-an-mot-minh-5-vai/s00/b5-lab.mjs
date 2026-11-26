/**
 * 0.5 — Lab: Khai trương "công ty một người" trên CT Work & GitHub (dm5-0-lab).
 * Bài thực hành kiểm chứng toàn bộ Mục 0 trước khi bước vào Chương 1 & Tuần 1 của LabFlow AI.
 * Có hướng dẫn từng bước trên CT Work LF #2 + GitHub + Calendar, gợi ý từng bậc (giai),
 * tiêu chí chấm 10 điểm (rubric), bảng tự chấm điền được, mẫu đầu ra và thử thách thêm.
 */
import { bang, cl, note, thuatNgu, tomTat, giai, bash, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L05 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Section 0 · Hands-on Lab', 'Mục 0 · Bài thực hành Lab', `
<h2>${t('0.5 — Lab: Commissioning your one-person company on CT Work &amp; GitHub', '0.5 — Lab: Khai trương "công ty một người" trên CT Work &amp; GitHub')}</h2>
<p class="lead">${t(
    'Before a new aircraft carries its first passenger, ground engineers run a formal commissioning checklist: every warning light must actually trigger when tested, every door lock must actually latch, and the flight logbook must be signed. Reading lessons 0.1–0.4 without wiring and <em>stress-testing</em> your workspace leaves silent holes that explode in Week 3. In this 90–120 minute lab, you will commission your LabFlow one-person company across CT Work (<strong>LF #2</strong>), GitHub, and your calendar — and prove every guardrail works by intentionally trying to break it.',
    'Trước khi một chiếc máy bay mới chở hành khách đầu tiên, kỹ sư mặt đất chạy một quy trình nghiệm thu (commissioning) nghiêm ngặt: mọi đèn cảnh báo phải thật sự sáng khi thử lỗi, mọi chốt cửa phải thật sự khoá, và sổ bay phải có chữ ký. Đọc bài 0.1–0.4 mà không tự tay lắp và <em>thử phá</em> các hàng rào bảo vệ sẽ để lại lỗ hổng ngầm nổ tung ở Tuần 3. Trong bài lab 90–120 phút này, bạn sẽ khai trương trọn vẹn "công ty một người" LabFlow trên CT Work (<strong>LF #2</strong>), GitHub và lịch cá nhân — rồi tự chứng minh mọi hàng rào chạy thật bằng cách cố tình vi phạm chúng.')}</p>

<h3>${t('Everyday picture: testing the smoke alarm before you cook', 'Liên tưởng đời thường: bấm nút thử chuông báo cháy trước khi bật bếp')}</h3>
<p>${t(
    'Buying a smoke alarm and leaving it on the shelf gives you comfort, not safety. Even screwing it to the ceiling is not enough until you press the test button and hear it beep. In this lab, you do not just tick "I enabled branch protection" or "I turned on Done rules" — you literally attempt a forbidden push to <code>main</code> and attempt dragging an empty card to <code>Done</code>, and you capture proof that the system stops you.',
    'Mua chuông báo cháy rồi để trên kệ chỉ cho cảm giác yên tâm giả tạo, không phải an toàn thật. Ngay cả khi đã bắt vít lên trần nhà vẫn chưa đủ cho tới khi bạn bấm nút Test và nghe nó kêu vang. Trong bài lab này, bạn không chỉ đánh dấu "đã bật bảo vệ nhánh" hay "đã bật Done rules" — bạn sẽ cố tình push trái phép lên <code>main</code> và cố tình kéo một thẻ trống Evidence sang <code>Done</code>, rồi chụp bằng chứng hệ thống chặn bạn lại.')}</p>

<h3>${t('Pre-flight checklist &amp; time budget', 'Chuẩn bị trước khi làm &amp; phân bổ thời gian')}</h3>
<ul>
<li>${t('<strong>Time budget:</strong> 90–120 minutes (can be split into two 1-hour blocks).', '<strong>Thời gian dự kiến:</strong> 90–120 phút (có thể tách làm hai phiên, mỗi phiên 1 giờ).')}</li>
<li>${t('<strong>Accounts ready:</strong> Your CT Work workspace (<strong>LabFlow Studio</strong>, project <strong>LF #2</strong>) with 5 real accounts (C1 main + C2–C5), your real GitHub account (<strong>GitHub Student Developer Pack / Pro</strong> if using a private repo with branch protection, OR a clean PII-free public repo, OR GitLab Free as fallback), and Google Calendar (or Apple/Outlook Calendar).', '<strong>Tài khoản cần có:</strong> Không gian CT Work (<strong>LabFlow Studio</strong>, dự án <strong>LF #2</strong>) với 5 tài khoản thật (C1 chính + C2–C5), tài khoản GitHub thật của bạn (có <strong>GitHub Student Developer Pack / Pro</strong> nếu dùng kho private bật branch protection, HOẶC kho public sạch không PII, HOẶC GitLab Free làm phương án dự phòng) và Google Calendar (hoặc lịch Apple/Outlook).')}</li>
<li>${t('<strong>Reference tabs:</strong> Keep ', '<strong>Tab tra cứu mở sẵn:</strong> Mở ')}${lf('/projects/labflow-ai')} ${t('and ', 'và ')}${dm('dm5-0-4-dung-cong-ty-mot-nguoi', t('Lesson 0.4', 'Bài 0.4'))} ${t('open beside you.', 'ngay bên cạnh.')}</li>
</ul>

<h3>${t('Day-0 Commissioning Flow (how the 5 tasks verify each other)', 'Sơ đồ nghiệm thu Ngày 0 (cách 5 nhiệm vụ kiểm chéo nhau)')}</h3>
<pre><code>  [Task 1 · C1 PM]   Audit LF #2, 5 accounts, transparency banner, Charter doc
          |
          v
  [Task 2 · C2 BA]   Create 3 Week-1 Q&amp;A cards + cross-check 1 Req vs Blueprint
          |
          v
  [Task 3 · C3/C4]   Init GitHub repo (Pro/Student private or PII-free public),
          |          .gitignore, .env.example, protect main (no bypass), webhook → LF-1
          v
  [Task 4 · C5 QA]   TRY TO BREAK IT: push directly to main + drag empty card to Done
          |          + verify 5 browser profiles &amp; 2FA/password hygiene → log audit
          v
  [Task 5 · C1 PM]   Book recurring Weekly/Daily rituals + post Day-0 kickoff in chat
          |
          v
  =================&gt; GREEN LIGHT: READY FOR CHAPTER 1 &amp; WEEK 1 &lt;=================</code></pre>

<h3>${t('Step-by-step lab tasks', 'Các nhiệm vụ thực hành từng bước')}</h3>

<h4>${t('Task 1 — Configure &amp; audit CT Work LF #2 (20 min)', 'Nhiệm vụ 1 — Cấu hình &amp; kiểm toán CT Work LF #2 (20 phút)')} ${mu('C1', en)}</h4>
<ol>
<li>${t('Log into your <strong>Purple (C1)</strong> browser profile and open CT Work → <code>LF #2</code> → <code>team</code> (or project members settings). Confirm all five accounts (C1 Admin, C2–C5 Members) are present and every secondary role name explicitly contains <code>[Solo · 1 người 5 vai]</code> (or English equivalent).', 'Đăng nhập profile trình duyệt <strong>Tím (C1)</strong>, mở CT Work → <code>LF #2</code> → trang <code>team</code> (hoặc cài đặt thành viên). Xác nhận đủ năm tài khoản (C1 Admin, C2–C5 Member) và tên các tài khoản vai phụ đều ghi rõ <code>[Solo · 1 người 5 vai]</code>.')}</li>
<li>${t('Open <code>settings</code>: verify the project description includes the solo transparency statement, verify the 5 labels (<code>Req</code>, <code>Task</code>, <code>Q&amp;A</code>, <code>Defect</code>, <code>Leakage</code>) exist, and turn on <strong>Done rules</strong> requiring Evidence before a card can move to <code>Done</code>.', 'Mở <code>settings</code>: kiểm tra mô tả dự án có câu tuyên bố trung thực làm một mình 5 vai, kiểm đủ 5 nhãn (<code>Req</code>, <code>Task</code>, <code>Q&amp;A</code>, <code>Defect</code>, <code>Leakage</code>), và bật <strong>Done rules</strong> bắt buộc có Evidence trước khi kéo thẻ sang <code>Done</code>.')}</li>
<li>${t('Open <code>docs</code> and create/complete two pages: <code>00-Company-Charter</code> (from Lesson 0.4) and <code>00-Solo-Charter-Notes</code> (from Lessons 0.1–0.2, including your readiness scores and 4 Mentor Prompt Templates).', 'Mở <code>docs</code> và tạo/hoàn thiện hai trang: <code>00-Company-Charter</code> (từ Bài 0.4) và <code>00-Solo-Charter-Notes</code> (từ Bài 0.1–0.2, gồm điểm tự đánh giá và 4 mẫu Mentor Prompt).')}</li>
</ol>

<h4>${t('Task 2 — Log Week-1 Q&amp;A cards &amp; trace one Req (20 min)', 'Nhiệm vụ 2 — Tạo bộ thẻ Q&amp;A Tuần 1 &amp; truy vết thử 1 Req (20 phút)')} ${mu('C2', en)}</h4>
<ol>
<li>${t('Switch to your <strong>Sky Blue (C2 BA)</strong> browser profile. Verify you see LF #2 under the C2 account.', 'Chuyển sang profile trình duyệt <strong>Xanh dương (C2 BA)</strong>. Xác nhận góc màn hình hiện đúng tài khoản C2.')}</li>
<li>${t('Create three cards with label <code>Q&amp;A</code> in the Week 1 / Backlog area for your lecturer meeting: (a) <em>Q&amp;A #1: Confirm tech stack (PostgreSQL 16 + Spring Boot 3 + React) vs MySQL</em>; (b) <em>Q&amp;A #2: Confirm MaxLOC grading table (180/240/660 vs 240/240/720) &amp; iteration dates</em>; (c) <em>Q&amp;A #3: Confirm 14 proposed Business Rules (BR-01..14)</em>. Each card must use a closed-question format with a proposed default ("We propose X; fallback if rejected is Y").', 'Tạo ba thẻ gắn nhãn <code>Q&amp;A</code> cho buổi gặp giảng viên Tuần 1: (a) <em>Q&amp;A #1: Xác nhận tech stack (PostgreSQL 16 + Spring Boot 3 + React) so với MySQL</em>; (b) <em>Q&amp;A #2: Xác nhận bảng MaxLOC (180/240/660 hay 240/240/720) &amp; hạn nộp</em>; (c) <em>Q&amp;A #3: Xác nhận 14 Business Rule đề xuất (BR-01..14)</em>. Mỗi thẻ viết theo dạng câu hỏi đóng kèm đề xuất mặc định ("Nhóm đề xuất X; phương án dự phòng nếu không duyệt là Y").')}</li>
<li>${t('Open one existing Iteration 1 Req card (for example <code>S03 Login</code> or <code>S13 Building &amp; Lab list</code>) and cross-check it against ', 'Mở một thẻ Req có sẵn của Iteration 1 (ví dụ <code>S03 Login</code> hoặc <code>S13 Building &amp; Lab list</code>) rồi đối chiếu với ')}${lf(t('46 screens', '46 màn hình'))}${t('. Add one comment as C2 listing 1 happy case and 3 unhappy cases that this screen must satisfy to reach Quality L2.', '. Thêm một bình luận dưới tài khoản C2 liệt kê 1 happy case và 3 unhappy case mà màn này phải đạt để chạm Quality L2.')}</li>
</ol>

<h4>${t('Task 3 — Wire GitHub repo, branch protection &amp; CT Work webhook (25 min)', 'Nhiệm vụ 3 — Dựng repo GitHub, bảo vệ main &amp; nối webhook CT Work (25 phút)')} ${mu('C3', en)} ${mu('C4', en)}</h4>
<ol>
<li>${t('Create a GitHub repository named <code>labflow</code> (or verify your existing one): use a <strong>private</strong> repo if you have <strong>GitHub Student Developer Pack / Pro</strong>; if you are on GitHub Free without Student Pack yet, either use a <strong>public</strong> repo strictly containing <strong>zero PII and zero secrets</strong>, or fall back to <strong>GitLab Free</strong> (private repos include branch protection) while waiting for Student Pack approval. Check your local Git config uses your <strong>one real identity</strong> (<code>git config user.name</code> and <code>git config user.email</code>).', 'Tạo kho GitHub tên <code>labflow</code> (hoặc kiểm lại kho đang có): dùng kho <strong>private</strong> nếu bạn đã có <strong>GitHub Student Developer Pack / Pro</strong>; nếu dùng tài khoản GitHub Free chưa có Student Pack, chọn dùng kho <strong>public</strong> bảo đảm <strong>không chứa PII và không chứa bí mật</strong>, hoặc chuyển sang <strong>GitLab Free</strong> (kho private có sẵn bảo vệ nhánh) trong lúc chờ duyệt Student Pack. Kiểm tra cấu hình Git dưới máy dùng đúng <strong>một danh tính thật duy nhất</strong> (<code>git config user.name</code> và <code>git config user.email</code>).')}</li>
<li>${t('Make Commit #1 on a fresh repo containing ONLY <code>README.md</code> (with your solo transparency note), <code>.gitignore</code> (ignoring <code>.env</code>, <code>target/</code>, <code>node_modules/</code>), and <code>.env.example</code> (placeholders only — zero real secrets). Push to <code>main</code> once to seed the default branch.', 'Tạo Commit #1 chỉ gồm <code>README.md</code> (có ghi chú minh bạch làm một mình 5 vai), <code>.gitignore</code> (chặn <code>.env</code>, <code>target/</code>, <code>node_modules/</code>) và <code>.env.example</code> (chỉ giá trị giả — tuyệt đối không bí mật thật). Push lên <code>main</code> một lần để khởi tạo nhánh mặc định.')}</li>
<li>${t('Enable GitHub <strong>Branch Protection</strong> (or a Ruleset) on <code>main</code> (see ', 'Bật <strong>Branch Protection</strong> (hoặc Ruleset) trên GitHub cho nhánh <code>main</code> (xem ')}${cs('git', 'git-6-4-bao-ve-nhanh', 'Git 6.4')}${t('): (a) require a pull request before merging, (b) disallow force-pushes, and (c) <strong>tick "Do not allow bypassing the above settings"</strong> (or "Include administrators" / leave bypass list empty in Rulesets) so even your own repo-owner account is blocked from direct pushes. <strong>Verify:</strong> open <code>Settings → Branches</code> (or <code>Rulesets</code>) and confirm an active rule is listed for <code>main</code> (screenshot it). <em>(Leave "Require status checks" off on Day 0; turn it on after Lesson 6.3. Fallback if GitHub Free blocks rules on a private repo: switch to a PII-free public repo or GitLab Free before running Task 4.)</em>', '): (a) bắt buộc đi qua Pull Request, (b) cấm force-push, và (c) <strong>bắt buộc tích "Do not allow bypassing the above settings"</strong> (hoặc "Include administrators" / để trống danh sách bypass trong Rulesets) để ngay cả tài khoản chủ kho của chính bạn cũng bị chặn push thẳng. <strong>Bước kiểm:</strong> mở <code>Settings → Branches</code> (hoặc <code>Rulesets</code>) xác nhận đã hiện rule đang hoạt động cho <code>main</code> (chụp ảnh). <em>(Chưa cần bật "Require status checks" ở Ngày 0 — bật sau Bài 6.3. Phương án dự phòng nếu GitHub Free không cho bật rule trên kho private: đổi sang kho public không PII hoặc GitLab Free rồi mới chạy Nhiệm vụ 4.)</em>')}</li>
<li>${t('Connect the GitHub webhook to CT Work (see ', 'Nối webhook GitHub về CT Work (xem ')}${cs('git', 'git-kd-10-noi-ct-work', 'Git KĐ.10')}${t('). Create a small test branch <code>chore/lf-setup-c3-verify-webhook</code>, add one harmless line to <code>README.md</code>, commit with a real CT Work card key (e.g. <code>chore(LF-1): [C3] verify github webhook link</code>), push the branch, open a PR, and verify that the commit/PR appears inside card <code>LF-1</code> on CT Work <code>code</code> / issue panel (capture a screenshot).', '): tạo một nhánh thử <code>chore/lf-setup-c3-verify-webhook</code>, thêm một dòng ghi chú ngắn vào <code>README.md</code>, commit kèm mã thẻ CT Work thật (vd <code>chore(LF-1): [C3] verify github webhook link</code>), push nhánh, mở PR và xác nhận commit/PR hiện lên trong thẻ <code>LF-1</code> trên CT Work (chụp ảnh màn hình).')}</li>
</ol>

<h4>${t('Task 4 — Stress-test your guardrails like QA (20 min)', 'Nhiệm vụ 4 — Tự phá hàng rào để nghiệm thu như QA (20 phút)')} ${mu('C5', en)}</h4>
<ol>
<li>${t('Switch to your <strong>Red (C5 QA)</strong> browser profile. Attempt to drag a test/open card with <strong>empty Evidence</strong> straight into <code>Done</code>. Confirm CT Work blocks it and capture a <strong>screenshot</strong> of the rejection message for <code>00-Company-Charter</code>.', 'Chuyển sang profile trình duyệt <strong>Đỏ (C5 QA)</strong>. Thử kéo một thẻ đang mở (chưa điền Evidence) thẳng sang cột <code>Done</code>. Xác nhận CT Work chặn lại và <strong>chụp ảnh màn hình</strong> thông báo từ chối để đính vào <code>00-Company-Charter</code>.')}</li>
<li>${t('In your terminal, check out <code>main</code>, add a dummy comment line, commit locally, and attempt <code>git push origin main</code> directly. <strong>Expected result:</strong> GitHub rejects the push with a protected-branch error (screenshot the terminal output!) — then clean your local branch with <code>git reset --hard origin/main</code>. <strong>If the push SUCCEEDS instead of failing:</strong> your rule FAILED the test (most often because "Do not allow bypassing" was not ticked or the repo is Free private) — do <em>not</em> use <code>git reset --hard origin/main</code> because the dummy commit is already on remote! Fix the rule first, create a revert branch (<code>git switch -c chore/lf-1-c1-revert-test</code> → <code>git revert &lt;sha&gt;</code>), open a PR to revert it via C1, and re-run this test until direct push is rejected.', 'Trong terminal, chuyển sang nhánh <code>main</code>, thêm một dòng thử, commit dưới máy và thử <code>git push origin main</code> trực tiếp. <strong>Kết quả đạt:</strong> GitHub từ chối với lỗi protected branch (chụp ảnh terminal!) — sau đó dọn nhánh dưới máy bằng <code>git reset --hard origin/main</code>. <strong>Nếu push LỌT lên remote:</strong> rule của bạn CHƯA ĐẠT (thường do chưa tích "Do not allow bypassing" hoặc kho đang là private gói Free) — lúc này <code>git reset --hard origin/main</code> <em>không</em> gỡ được vì commit rác đã lên remote! Hãy sửa lại rule trước, mở nhánh revert (<code>git switch -c chore/lf-1-c1-revert-test</code> → <code>git revert &lt;sha&gt;</code>), tạo PR revert để C1 merge, rồi chạy lại bài thử tới khi push thẳng bị chặn.')}</li>
<li>${t('Run a 2-minute secret check: create a local dummy <code>.env</code> file, run <code>git status</code> to confirm it is ignored (screenshot), delete the dummy file if not needed, and confirm 2FA is active on your GitHub and main CT Work accounts.', 'Chạy kiểm bí mật 2 phút: tạo thử một tệp <code>.env</code> giả dưới máy, chạy <code>git status</code> xác nhận nó bị bỏ qua không hiện để commit (chụp ảnh), rồi xác nhận 2FA đang bật trên GitHub cùng tài khoản CT Work chính.')}</li>
</ol>

<h4>${t('Task 5 — Schedule rituals &amp; post Day-0 Kickoff (15 min)', 'Nhiệm vụ 5 — Đặt lịch nghi thức &amp; đăng thông báo Khai trương Ngày 0 (15 phút)')} ${mu('C1', en)}</h4>
<ol>
<li>${t('Switch back to <strong>Purple (C1)</strong>. Create three recurring events in your calendar (and your first meeting item in CT Work <code>meetings</code>): Daily 5-min standup (Mon–Sat), Mid-sprint check (Wed, 15 min), and Weekly Review + Retro (Sun, 45 min total).', 'Quay lại profile <strong>Tím (C1)</strong>. Tạo ba sự kiện lặp trong lịch cá nhân (và buổi họp đầu tiên trong mục <code>meetings</code> trên CT Work): Daily 5 phút (T2–T7), Soát giữa tuần (T4, 15 phút), và Review tuần + Retro (CN, tổng 45 phút).')}</li>
<li>${t('Post a concise <strong>Day-0 Kickoff</strong> message in CT Work <code>chat</code> linking <code>00-Company-Charter</code>, your 3 <code>Q&amp;A</code> cards, and your Day-0 QA audit result (all guardrails green).', 'Đăng một tin nhắn ngắn <strong>Khai trương Ngày 0</strong> trong kênh <code>chat</code> trên CT Work, gắn link <code>00-Company-Charter</code>, 3 thẻ <code>Q&amp;A</code> và kết quả kiểm thử hàng rào Ngày 0 (mọi cổng đều xanh).')}</li>
</ol>

<h3>${t('Progressive hints (open only if stuck)', 'Gợi ý từng bậc (chỉ mở khi vướng)')}</h3>
${giai(t('Hint 1 — GitHub still lets you push directly to main as repo admin', 'Gợi ý 1 — GitHub vẫn cho push thẳng lên main vì bạn là chủ repo'), `<p>${t('By default, GitHub branch protection exempts repository administrators! Tick the checkbox <strong>"Do not allow bypassing the above settings"</strong> (or "Include administrators") inside your branch protection rule / ruleset so even your own admin account must go through a PR.', 'Mặc định, luật bảo vệ nhánh của GitHub bỏ qua quản trị viên kho! Hãy tích thêm ô <strong>"Do not allow bypassing the above settings"</strong> (hoặc "Include administrators") trong cài đặt bảo vệ nhánh / ruleset để ngay cả tài khoản chủ kho của chính bạn cũng bắt buộc đi qua PR.')}</p>`)}
${giai(t('Hint 2 — Webhook delivered 200 OK but commit does not appear on the card', 'Gợi ý 2 — Webhook báo 200 OK nhưng commit không hiện trong thẻ CT Work'), `<p>${t('Check two things: (1) the exact project key in the commit message must match uppercase <code>LF-&lt;number&gt;</code> of an <em>existing</em> card number in LF #2; (2) check GitHub Repo → Settings → Webhooks → Recent Deliveries to confirm the event payload includes <code>push</code> and <code>pull_request</code>.', 'Kiểm tra hai điểm: (1) mã thẻ trong lời nhắn commit phải viết hoa đúng định dạng <code>LF-&lt;số&gt;</code> của một thẻ <em>đang tồn tại</em> trong LF #2; (2) mở GitHub Repo → Settings → Webhooks → Recent Deliveries xem đã chọn gửi cả hai sự kiện <code>push</code> và <code>pull_request</code> chưa.')}</p>`)}
${giai(t('Hint 3 — Sample Day-0 Q&amp;A card &amp; Kickoff message', 'Gợi ý 3 — Mẫu thẻ Q&amp;A Tuần 1 &amp; tin nhắn Khai trương Ngày 0'), `
${out(`[Q&A #1 — Stack Confirmation]
Context: LabFlow requires strict race-condition-free booking (double-booking = 0).
Proposal: Use PostgreSQL 16 (EXCLUDE USING gist) + Spring Boot 3 + React/TS.
Fallback if MySQL is strictly required: UNIQUE (resource_id, slot_id) + @Transactional, documented in ADR-01.
Question for Lecturer: May I proceed with PostgreSQL 16 + Spring Boot 3 + React?
Decision (fill after class): [ ] Approved  [ ] Use MySQL fallback

[Day-0 Kickoff — CT Work Chat]
🚀 LabFlow One-Person Company (C1–C5 Solo) is LIVE!
- Charter &amp; Rules: docs/00-Company-Charter
- Week-1 Lecturer Q&amp;A: LF-xxx, LF-xxy, LF-xxz
- Guardrail Audit (C5): Protected main ✅ | .env ignored ✅ | Done rules ✅ | Webhook ✅
- Next ritual: Sprint 1 Planning Monday 08:00 (Hat: C1 + C2)`)}
`)}

<h3>${t('Grading rubric (10 points — 2 / 1 / 0 per criterion) &amp; mandatory evidence screenshots', 'Thang chấm Rubric (10 điểm — mức 2 / 1 / 0 mỗi tiêu chí) &amp; danh sách ảnh bằng chứng bắt buộc')}</h3>
${bang(
  [t('Criterion', 'Tiêu chí'), t('2 pts (Pass)', '2 điểm (Đạt trọn)'), t('1 pt (Partial)', '1 điểm (Đạt một phần)'), t('0 pts (Fail)', '0 điểm (Chưa đạt)'), t('Your score', 'Tự chấm')],
  [
    [
      t('<strong>1. CT Work 5-role &amp; Honesty setup</strong>', '<strong>1. Cấu hình CT Work 5 vai &amp; Trung thực</strong>'),
      t('Screenshot of CT Work <code>team</code> shows 5 real accounts with <code>[Solo · 1 người 5 vai]</code> on C2–C5; separate screenshots show C2 &amp; C5 logged into distinct colour-coded profiles; <code>00-Company-Charter</code> &amp; <code>00-Solo-Charter-Notes</code> filled with zero blanks.', 'Ảnh trang <code>team</code> CT Work hiện đủ 5 tài khoản thật có nhãn <code>[Solo · 1 người 5 vai]</code> trên C2–C5; có ảnh riêng C2 &amp; C5 đăng nhập trên profile màu tách biệt; <code>00-Company-Charter</code> &amp; <code>00-Solo-Charter-Notes</code> điền đủ không ô trống.'),
      t('5 accounts exist, but missing 1–2 Charter fields, missing transparency text on secondary names, or profiles not verified separately.', 'Đủ 5 tài khoản nhưng còn thiếu 1–2 ô Điều lệ dự án, thiếu nhãn minh bạch ở tên phụ hoặc chưa chụp chứng minh tách profile.'),
      t('Fewer than 5 accounts, missing Charter docs, or misleading team names implying 5 different students.', 'Thiếu tài khoản, chưa tạo Điều lệ dự án, hoặc đặt tên gây hiểu nhầm có 5 sinh viên khác nhau.'),
      '___ / 2'
    ],
    [
      t('<strong>2. Week-1 Q&amp;A &amp; Req trace</strong>', '<strong>2. Bộ thẻ Q&amp;A Tuần 1 &amp; truy vết Req</strong>'),
      t('3 closed-question <code>Q&amp;A</code> cards created by C2 with proposal + fallback; 1 Iter-1 Req has C2 comment with 1 happy + ≥ 3 unhappy cases.', 'Đủ 3 thẻ <code>Q&amp;A</code> dạng câu hỏi đóng do C2 tạo kèm đề xuất + phương án lùi; 1 Req Iter 1 có bình luận C2 đủ 1 happy + ≥ 3 unhappy case.'),
      t('Only 1–2 Q&amp;A cards, missing fallback options, or Req comment has fewer than 3 unhappy cases.', 'Chỉ có 1–2 thẻ Q&amp;A, thiếu phương án lùi, hoặc bình luận Req chưa đủ 3 unhappy case.'),
      t('No Q&amp;A cards or no C2 comment on an Iter-1 Req.', 'Chưa tạo thẻ Q&amp;A hoặc chưa có bình luận C2 trên thẻ Req Iter 1.'),
      '___ / 2'
    ],
    [
      t('<strong>3. GitHub repo, Rule &amp; Webhook</strong>', '<strong>3. Repo GitHub, Rule &amp; Webhook</strong>'),
      t('Repo (Private Pro/Student Pack, PII-free Public, or GitLab Free) with 1 real Git identity; Commit #1 has <code>.gitignore</code> + <code>.env.example</code> (0 secrets); screenshot of active rule in <code>Settings → Branches</code>; screenshot of test commit/PR visible inside CT Work card <code>LF-1</code>.', 'Kho (Private Pro/Student Pack, Public sạch không PII, hoặc GitLab Free) với 1 danh tính Git thật; Commit #1 có <code>.gitignore</code> + <code>.env.example</code> (0 bí mật); có ảnh rule hoạt động ở <code>Settings → Branches</code> và ảnh commit/PR thử hiện trong thẻ <code>LF-1</code>.'),
      t('Repo and Commit #1 exist, but webhook commit does not show inside <code>LF-1</code> yet or branch rule screenshot is missing.', 'Đã có repo và Commit #1 nhưng commit webhook chưa hiện trong thẻ <code>LF-1</code> hoặc thiếu ảnh rule bảo vệ nhánh.'),
      t('Secrets committed, fake Git identity used, or repo not connected at all.', 'Lỡ commit bí mật, tạo danh tính Git giả, hoặc chưa dựng repo.'),
      '___ / 2'
    ],
    [
      t('<strong>4. QA Guardrail Stress-Test</strong>', '<strong>4. QA tự phá hàng rào (Stress-Test)</strong>'),
      t('All 3 screenshots attached in <code>00-Company-Charter</code>: (a) terminal rejecting direct <code>git push origin main</code>, (b) CT Work blocking empty-Evidence move to <code>Done</code>, (c) <code>git status</code> ignoring dummy <code>.env</code>; plus 2FA active on GitHub &amp; C1.', 'Đính đủ 3 ảnh trong <code>00-Company-Charter</code>: (a) terminal báo từ chối <code>git push origin main</code>, (b) CT Work chặn kéo thẻ trống Evidence sang <code>Done</code>, (c) <code>git status</code> bỏ qua tệp <code>.env</code> giả; kèm 2FA đang bật trên GitHub &amp; C1.'),
      t('1 of the 3 guardrails not stress-tested live (or direct push slipped through and was not yet fixed via revert PR + bypass lock).', 'Còn 1 trong 3 hàng rào chưa thử phá thật (hoặc push lọt lên main mà chưa mở PR revert + bật khoá bypass).'),
      t('No live stress-test screenshots attached — guardrails only assumed.', 'Không có ảnh thử phá thật — chỉ giả định là hàng rào chạy.'),
      '___ / 2'
    ],
    [
      t('<strong>5. Calendar rituals &amp; Kickoff</strong>', '<strong>5. Lịch nghi thức &amp; Tin khai trương</strong>'),
      t('Screenshot shows recurring Daily, Mid-sprint Wed, and Weekly+Retro Sun (45 min) events in Calendar + CT Work <code>meetings</code>; Day-0 Kickoff message posted in <code>chat</code> linking Charter &amp; Q&amp;A cards.', 'Ảnh chứng minh đủ 3 lịch lặp Daily, Soát T4 và Weekly+Retro CN (45 phút) trên Calendar + <code>meetings</code> CT Work; tin Khai trương Ngày 0 đã đăng trên <code>chat</code> kèm link Điều lệ dự án &amp; thẻ Q&amp;A.'),
      t('Calendar events created without CT Work <code>meetings</code> entry, or Kickoff chat post missing links.', 'Đã tạo lịch cá nhân nhưng thiếu mục <code>meetings</code> trên CT Work, hoặc tin Khai trương thiếu link.'),
      t('No recurring rituals scheduled and no Kickoff post.', 'Chưa đặt lịch lặp và chưa đăng tin Khai trương.'),
      '___ / 2'
    ],
    [
      t('<strong>TOTAL</strong>', '<strong>TỔNG CỘNG</strong>'),
      t('<strong>Pass:</strong> ≥ 8/10 AND zero security/honesty red flags.', '<strong>Đạt:</strong> ≥ 8/10 VÀ không dính cờ đỏ bảo mật/trung thực.'),
      t('<strong>Fix &amp; re-test</strong> any 0–1 pt row before Week 1.', '<strong>Sửa &amp; thử lại</strong> mọi dòng 0–1 điểm trước Tuần 1.'),
      t('<strong>Stop:</strong> rotate leaked secrets / remove fake Git identities first.', '<strong>Dừng ngay:</strong> đổi khoá nếu lộ / bỏ Git giả trước khi đi tiếp.'),
      '<strong>___ / 10</strong>'
    ]
  ]
)}

<p><strong>${t('Mandatory Evidence Screenshots to attach inside <code>00-Company-Charter</code>:', 'Danh sách ảnh bằng chứng bắt buộc đính vào trang <code>00-Company-Charter</code>:')}</strong></p>
<ol>
<li>${t('<strong>CT Work <code>team</code> + profiles:</strong> 5 accounts with <code>[Solo · 1 người 5 vai]</code> labels visible, plus C2/C5 signed into their colour-coded browser profiles.', '<strong>CT Work <code>team</code> + profile:</strong> hiện đủ 5 tài khoản có nhãn <code>[Solo · 1 người 5 vai]</code>, kèm ảnh C2/C5 đăng nhập trên profile màu riêng.')}</li>
<li>${t('<strong>GitHub rule + Webhook on card <code>LF-1</code>:</strong> <code>Settings → Branches</code> showing the active rule on <code>main</code>, plus the test commit/PR appearing inside CT Work card <code>LF-1</code>.', '<strong>Rule GitHub + Webhook trên thẻ <code>LF-1</code>:</strong> trang <code>Settings → Branches</code> hiện rule đang bật cho <code>main</code>, và commit/PR thử hiện trong thẻ <code>LF-1</code> trên CT Work.')}</li>
<li>${t('<strong>Rejected direct push to <code>main</code>:</strong> Terminal screenshot showing GitHub rejecting <code>git push origin main</code>.', '<strong>Push thẳng <code>main</code> bị từ chối:</strong> ảnh terminal cho thấy GitHub chặn lệnh <code>git push origin main</code>.')}</li>
<li>${t('<strong>Blocked <code>Done</code> move:</strong> CT Work screenshot showing Done rules rejecting a card with empty Evidence.', '<strong>Kéo sang <code>Done</code> bị chặn:</strong> ảnh CT Work báo lỗi từ chối khi kéo thẻ trống Evidence sang cột <code>Done</code>.')}</li>
<li>${t('<strong>Secret check &amp; Rituals:</strong> <code>git status</code> ignoring a local dummy <code>.env</code> file + recurring Calendar / CT Work <code>meetings</code> + Day-0 Kickoff post in <code>chat</code>.', '<strong>Kiểm secret &amp; Lịch nghi thức:</strong> lệnh <code>git status</code> bỏ qua tệp <code>.env</code> giả + lịch lặp trên Calendar / <code>meetings</code> + tin Khai trương trong <code>chat</code>.')}</li>
</ol>

${cl('tip', `<p><strong>${t('Extra challenge (optional)', 'Thử thách thêm (tuỳ chọn)')}</strong> — ${t('Add the shared <code>.githooks/commit-msg</code> hook from ', 'Thêm hook dùng chung <code>.githooks/commit-msg</code> từ ')}${cs('agile-teamwork', 'agl-0-2-cong-cu', t('Agile Teamwork 0.2', 'Agile Teamwork 0.2'))}${t(' to your LabFlow repo and verify it rejects a sloppy message like <code>fix bug</code> while accepting <code>feat(LF-1): [C3] add health endpoint</code>.', ' vào repo LabFlow của bạn và kiểm chứng nó chặn lời nhắn ẩu như <code>fix bug</code> nhưng cho qua <code>feat(LF-1): [C3] add health endpoint</code>.')}</p>`)}

${viecLabflow([
  [
    t('Complete all 5 Commissioning Tasks above, attach all <strong>5 mandatory evidence screenshots</strong>, and paste your filled Self-Assessment Scorecard (total ≥ 8/10) into the bottom of CT Work doc <code>00-Company-Charter</code>.', 'Hoàn thành trọn 5 Nhiệm vụ Khai trương ở trên, đính đủ <strong>5 nhóm ảnh bằng chứng bắt buộc</strong> và dán Bảng tự chấm đã điền (tổng ≥ 8/10) vào cuối trang <code>00-Company-Charter</code> trên CT Work.'),
    t('Every guardrail has screenshot proof of being stress-tested live (not assumed), score ≥ 8/10, and the Day-0 Kickoff post is live in CT Work <code>chat</code>.', 'Mọi hàng rào đều có ảnh chụp chứng minh đã thử phá thật (không đoán), điểm ≥ 8/10 và tin Khai trương Ngày 0 đã đăng trong <code>chat</code> CT Work.')
  ]
], en)}

${apDung([
  [t('Multi-vendor E-commerce Marketplace (topic switch)', 'Sàn thương mại điện tử nhiều người bán (đổi đề tài)'), t('Run the exact Day-0 commissioning flow before writing code: log Week-1 Q&amp;A cards for inventory-lock timing and refund/cancel Business Rules, verify <code>.gitignore</code> blocks local VNPay/Stripe sandbox keys in <code>.env</code>, and stress-test branch protection + Done rules on an Order Checkout card.', 'Chạy đúng quy trình nghiệm thu Ngày 0 trước khi code: tạo thẻ Q&amp;A Tuần 1 chốt BR giữ tồn kho và hạn huỷ/hoàn tiền, thử kiểm <code>.gitignore</code> chặn khoá sandbox VNPay/Stripe trong <code>.env</code>, và tự thử phá bảo vệ nhánh + Done rules trên một thẻ Thanh toán đơn hàng.')],
  [t('Real 5-person SEP490 team', 'Đồ án nhóm thật 5 người (SEP490)'), t('Have the newest teammate run Tasks 3 and 4 on Day 1: confirm all 5 real accounts have proper permissions (only Maintainer merges), verify non-maintainers are blocked from pushing directly to <code>main</code>, verify Done rules block cards without PR/test evidence, and verify test PR commits appear on CT Work cards.', 'Để thành viên mới nhất chạy Nhiệm vụ 3 và 4 ngay Ngày 1: xác nhận đủ 5 tài khoản thật đúng quyền (chỉ Maintainer merge), thử chứng minh thành viên không push thẳng được lên <code>main</code>, Done rules chặn thẻ thiếu bằng chứng PR/test và commit PR thử hiện đúng thẻ CT Work.')],
  [t('Enterprise company (FPT Software, 20–100 person outsourcing project)', 'Công ty lớn (FPT Software, dự án outsourcing 20–100 người)'), t('DevOps, Security, QA Lead, and Scrum Master run a formal Day-0 environment commissioning checklist under CMMI/ISO before Sprint 1: verify GitLab/GitHub branch rulesets with bypass disabled, Jira workflow validators, automated secret scanning, least-privilege service tokens, and audit-ready evidence storage.', 'DevOps, Bảo mật, QA Lead và Scrum Master chạy checklist nghiệm thu môi trường Ngày 0 theo chuẩn CMMI/ISO trước Sprint 1: kiểm ruleset bảo vệ nhánh GitLab/GitHub có chặn bypass, bộ kiểm quy trình Jira, quét secret tự động, token dịch vụ quyền tối thiểu và nơi lưu bằng chứng kiểm toán.')]
], en)}

${thuatNgu([
  ['commissioning (nghiệm thu vận hành)', t('Testing every system control and safety interlock under real conditions before production work starts.', 'Kiểm chứng từng cơ chế kiểm soát và chốt an toàn trong điều kiện thật trước khi bắt đầu sản xuất chính thức.')],
  ['closed question (câu hỏi đóng có đề xuất)', t('A stakeholder/lecturer question framed as "We propose X (fallback Y) — do you approve?" so decisions happen fast in writing.', 'Câu hỏi gửi khách/GV theo dạng "Đề xuất X (phương án lùi Y) — thầy có duyệt không?" để chốt quyết định nhanh bằng văn bản.')],
  ['bypass protection', t('A GitHub rule setting ("Do not allow bypassing") ensuring even repo owners cannot push directly to <code>main</code>.', 'Tuỳ chọn trên GitHub ("Do not allow bypassing") bảo đảm ngay cả chủ kho cũng không thể push thẳng lên <code>main</code>.')],
  ['rubric (thang chấm tiêu chí)', t('An explicit scoring table stating what evidence earns full marks vs partial marks.', 'Bảng tiêu chí chấm minh bạch nêu rõ bằng chứng nào đạt điểm tối đa, loại bỏ cảm tính.')]
], en)}

${tomTat([
  t('A guardrail you never tested is a guardrail you do not have — always stress-test branch protection, Done rules, and <code>.gitignore</code> on Day 0.', 'Hàng rào chưa từng thử phá coi như chưa tồn tại — luôn thử vi phạm bảo vệ nhánh, Done rules và <code>.gitignore</code> ngay Ngày 0.'),
  t('Every hat (C1–C5) touched the workspace in this lab: C1 set governance &amp; calendar, C2 logged Q&amp;A &amp; unhappy cases, C3/C4 wired GitHub &amp; webhook, C5 tried to break the controls.', 'Cả năm mũ (C1–C5) đều đã vận hành thật trong bài lab: C1 dựng quản trị &amp; lịch, C2 ghi Q&amp;A &amp; unhappy case, C3/C4 nối GitHub &amp; webhook, C5 thử phá chốt bảo vệ.'),
  t('Score at least 8/10 on the rubric with zero security or honesty red flags before moving to Section 0 Quiz and Chapter 1.', 'Đạt ít nhất 8/10 trên rubric và không dính cờ đỏ bảo mật/trung thực trước khi làm Kiểm tra Mục 0 và sang Chương 1.')
], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${dm('dm5-0-quiz', t('0.6 — Section 0 Quiz', '0.6 — Kiểm tra Mục 0'))}.</p>
`);
};

export default {
  title: '0.5 — Lab: Commissioning your one-person company on CT Work & GitHub|||0.5 — Lab: Khai trương "công ty một người" trên CT Work & GitHub',
  slug: 'dm5-0-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài lab thực hành Mục 0: nghiệm thu trọn bộ "công ty một người" qua 5 nhiệm vụ theo 5 mũ C1–C5 trên CT Work LF #2, GitHub và lịch cá nhân; cố tình phá hàng rào bảo vệ nhánh & Done rules để kiểm chứng; gợi ý từng bậc, thang chấm rubric 10 điểm và bảng tự chấm.',
  content: L05(true) + L05(false),
};
