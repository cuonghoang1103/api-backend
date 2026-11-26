/**
 * 6.2 — Git flow một người mà như năm người: nhánh theo thẻ, commit quy ước & PR tự review (dm5-6-2-git-flow-mot-nguoi).
 * Chương 6 — Nền kỹ thuật & quy trình code (mũ Dev, PM giám sát).
 * Nguồn đã kiểm: Knight Capital Group incident (Aug 1, 2012 — U.S. SEC Release No. 34-70694, Oct 2013);
 * Conventional Commits Specification v1.0.0 (conventionalcommits.org);
 * Accelerate / DORA Research (Forsgren, Humble, Kim, 2018 — short-lived branches & trunk-based integration).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, bash, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L62 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 6 · Lesson 6.2', 'Chương 6 · Bài 6.2', `
<h2>${t('6.2 — Solo Git Flow that runs like a 5-person team: ticket branches, conventional commits &amp; self-reviewed PRs', '6.2 — Git flow một người mà như năm người: nhánh theo thẻ, commit quy ước &amp; PR tự review')}</h2>
<p class="lead">${t(
    'When nobody else is pushing to your repository, pushing straight to <code>main</code> with messages like <code>"update"</code> and <code>"fix bug 2"</code> feels faster — until you break a working flow two days before Iteration 2, cannot trace which commit touched a business rule, or face a defense panel looking at an unreadable commit graph. This lesson shows you how ONE developer runs a crisp, honest, enterprise-grade <strong>GitHub Flow</strong> — one ticket = one short-lived branch = one conventional commit trail = one Pull Request with a structured description and cross-hat self-review — linked directly to CT Work.',
    'Khi chẳng có ai khác cùng push vào kho mã, việc đẩy thẳng lên <code>main</code> với lời nhắn <code>"update"</code> hay <code>"fix bug 2"</code> có vẻ rất nhanh — cho tới lúc bạn làm hỏng luồng đang chạy chỉ hai ngày trước mốc Iteration 2, không tra nổi commit nào đã đụng vào một business rule, hoặc ngồi trước hội đồng nhìn vào lịch sử commit rối mù. Bài này dạy MỘT người vận hành <strong>GitHub Flow</strong> sắc nét, trung thực chuẩn doanh nghiệp — một thẻ việc = một nhánh sống ngắn = một chuỗi commit quy ước = một Pull Request có mô tả chuẩn và tự review khác mũ — nối thẳng với CT Work.')}</p>

<h3>${t('Everyday picture: shipping parcels with tracking barcodes vs tossing boxes into the back of a truck', 'Liên tưởng đời thường: gửi hàng có mã vận đơn so với ném hộp lên thùng xe')}</h3>
<p>${t(
    'Imagine running a small online shop alone. If you toss twenty orders into a van without tracking labels because "it is just me, I remember who ordered what," one broken vase or address change forces you to rip open every box. Putting a barcode on every box takes ten extra seconds and turns chaos into a traceable assembly line — whether you have 1 employee today or 50 next year. In Git, <strong>your CT Work ticket ID (e.g., <code>LF-22</code>) is that tracking barcode</strong> stamped across your branch name, every commit, your PR title, and your Release Notes.',
    'Hãy tưởng tượng bạn tự mở một cửa hàng online một mình. Nếu bạn ném hai mươi đơn hàng lên xe tải mà không dán mã vận đơn vì "có mỗi mình làm, mình nhớ hết mà", chỉ cần một bình hoa vỡ hay một khách đổi địa chỉ là bạn phải rạch tung từng thùng ra tìm. Dán mã vận đơn lên từng hộp chỉ tốn thêm mười giây nhưng biến mớ hỗn độn thành dây chuyền truy vết được — dù hôm nay bạn chỉ có 1 người hay năm sau có 50 người. Trong Git, <strong>mã thẻ CT Work (vd <code>LF-22</code>) chính là mã vận đơn đó</strong>, đóng dấu thống nhất từ tên nhánh, từng commit, tiêu đề PR cho tới Release Notes.')}</p>

<h3>${t('1. Why Git discipline matters even solo — real-world evidence &amp; honesty law', '1. Vì sao kỷ luật Git quan trọng ngay cả khi làm một mình — bằng chứng thật &amp; luật trung thực')}</h3>
<ul>
<li>${t('<strong>Knight Capital Group (August 1, 2012 — U.S. SEC Release No. 34-70694):</strong> Uncontrolled deployment procedures and reactivated legacy code left behind in the repository caused <strong>$440 million in trading losses in 45 minutes</strong>, nearly destroying the firm overnight. Disciplined change control — small, isolated, reviewed, traceable changes — is not bureaucracy; it is crash protection.', '<strong>Sự cố Knight Capital Group (01/08/2012 — Hồ sơ SEC Hoa Kỳ số 34-70694):</strong> Quy trình triển khai thiếu kiểm soát và đoạn mã cũ bị kích hoạt nhầm trong kho mã gây lỗ <strong>440 triệu USD chỉ trong 45 phút</strong>, suýt xoá sổ công ty sau một buổi sáng. Kiểm soát thay đổi chặt chẽ — từng thay đổi nhỏ, cô lập, được review và truy vết được — không phải thủ tục rườm rà; đó là túi khí chống va chạm.')}</li>
<li>${t('<strong>DORA / Accelerate Research (Forsgren, Humble, Kim, 2018):</strong> High-performing software teams keep branches short-lived (under 1–2 days) and integrate into trunk/<code>main</code> frequently via small PRs. Long-lived branches accumulate silent drift and explode into painful merge conflicts.', '<strong>Nghiên cứu DORA / Accelerate (Forsgren, Humble, Kim, 2018):</strong> Các đội phần mềm hiệu suất cao luôn giữ nhánh sống ngắn (dưới 1–2 ngày) và tích hợp thường xuyên vào <code>main</code> qua các PR nhỏ. Nhánh nuôi lâu ngày tích tụ sai lệch ngầm và nổ thành xung đột merge đau đớn.')}</li>
</ul>

${cl('warn', `<strong>⚖️ ${t('Academic Honesty Reminder (Solo 5-Role Rule)', 'Nhắc lại Luật Trung Thực Học Thuật (Quy tắc 1 người 5 vai)')}</strong><br>${t('Running Git "like a 5-person team" means running <strong>5-person process discipline</strong> (protected <code>main</code>, ticket branches, PR template, cooling-off review), <strong>NEVER forging 5 fake GitHub accounts or fake commit authors!</strong> Keep ONE real Git identity (<code>git config user.name</code> / <code>user.email</code>) on GitHub and record role handoffs honestly via CT Work cards and PR labels (recall ', 'Chạy Git "như năm người" nghĩa là chạy <strong>kỷ luật quy trình của đội năm người</strong> (khoá <code>main</code>, nhánh theo thẻ, mẫu PR, review sau khoảng nghỉ), <strong>TUYỆT ĐỐI KHÔNG tạo 5 tài khoản GitHub giả hay làm giả tác giả commit!</strong> Giữ ĐÚNG MỘT danh tính Git thật trên GitHub và ghi nhận chuyển vai trung thực qua thẻ CT Work và nhãn PR (nhắc lại ')}${dm('dm5-0-2-bat-dau-2', t('Lesson 0.2', 'Bài 0.2'))}).`)}

<h3>${t('2. General Workflow: GitHub Flow tailored for 1–5 people (no duplication of Git basics)', '2. Quy trình tổng quát: GitHub Flow chuẩn cho đội 1–5 người (không lặp lại cơ bản Git)')}</h3>
<p>${t('You already have full Git command tutorials in ', 'Bạn đã có toàn bộ hướng dẫn lệnh Git ở ')}${cs('git', 'git-7-1-chien-luoc-nhanh', 'Git 7.1 — Branching strategies')}${t(', ', ', ')}${cs('git', 'git-6-1-giai-phau-pr', 'Git 6.1 — Anatomy of a PR')}${t(', and team rules in ', ' và quy ước nhóm ở ')}${cs('agile-teamwork', 'agl-3-1-quy-uoc', 'Agile Teamwork 3.1')} / ${cs('agile-teamwork', 'agl-3-2-pr-tot', '3.2')}${t('. Here is the exact <strong>end-to-end 7-step solo-team cycle</strong> showing which hat acts at each gate:', '. Dưới đây là đúng <strong>vòng lặp 7 bước đầu-cuối cho công ty một người</strong> chỉ rõ mũ nào làm việc ở từng chốt:')}</p>

<pre><code>  [CT Work Card: LF-22 (In Progress)]
        |
        | 1. (C3/C4 Dev) Sync main &amp; cut short-lived branch (&lt;= 2-3 days)
        |    git switch main &amp;&amp; git pull &amp;&amp; git switch -c feat/lf-22-reservation-wizard
        v
  [Work locally in small atomic commits: feat(LF-22): ... / test(LF-22): ...]
        |
        | 2. (C3/C4 Dev) Run local build + tests, push branch &amp; open PR on GitHub
        |    Fill PR Template (Summary, Card link, Acceptance Criteria, Evidence)
        v
  [GitHub Automated CI Gate (Lesson 6.3)] ---- RED ----&gt; Fix on same branch &amp; push
        |
       GREEN
        | 3. Move CT Work card -&gt; "In Review"  |  STOP! Mandatory Cooling-Off Gap (&gt;= 1h / overnight)
        v
  [C5 QA / Reviewer Hat]
        | 4. Read PR Diff on GitHub Files Changed tab (like a stranger!) + 10-pt checklist
        | 5. Leave REAL review comments on line numbers if flawed -&gt; Dev fixes &amp; pushes
        v
  [C1 Maintainer Hat]
        | 6. Verify CI green + DoD + Evidence on card -&gt; Squash/Merge PR into main &amp; delete branch
        | 7. Move CT Work card -&gt; "Done" (at Milestone end: C1 tags iter1 / iter2 / iter3)</code></pre>

<h3>${t('3. Branch, Commit &amp; Merge Policy Matrix (reusable blank rules + LabFlow mapping)', '3. Ma trận Luật Nhánh, Commit &amp; Merge (khung dùng lại được + ánh xạ LabFlow)')}</h3>
${bang(
  [t('Policy Item', 'Hạng mục luật'), t('General Reusable Rule', 'Quy ước tổng quát dùng lại được'), t('LabFlow Concrete Example', 'Ví dụ cụ thể trên LabFlow'), t('Why It Protects You', 'Lợi ích bảo vệ bạn')],
  [
    [t('<strong>Branching model</strong>', '<strong>Mô hình nhánh</strong>'), t('<strong>GitHub Flow:</strong> 1 always-green <code>main</code> + short-lived feature/fix branches', '<strong>GitHub Flow:</strong> 1 nhánh <code>main</code> luôn xanh + nhánh tính năng/sửa lỗi ngắn hạn'), t('<code>main</code> protected; zero <code>develop</code> branch needed for single demo env', '<code>main</code> được bảo vệ; không cần nhánh <code>develop</code> vì chỉ có 1 môi trường demo'), t('Simple, fast daily integration; avoids double-merge overhead of classic git-flow.', 'Đơn giản, tích hợp hằng ngày nhanh; tránh gánh nặng merge hai lần của git-flow cổ điển.')],
    [t('<strong>Branch naming</strong>', '<strong>Đặt tên nhánh</strong>'), t('<code>&lt;type&gt;/&lt;ticket-id&gt;-&lt;short-kebab&gt;</code> (max lifetime 2–3 days)', '<code>&lt;loai&gt;/&lt;ma-the&gt;-&lt;mo-ta-ngan&gt;</code> (tuổi thọ tối đa 2–3 ngày)'), '<code>feat/lf-22-reservation-wizard</code><br><code>fix/lf-88-adjacent-slot-overlap</code>', t('Easy to trace between GitHub, CT Work <code>code</code>, and card web links; forces breaking huge tasks into mergeable slices.', 'Dễ đối chiếu giữa GitHub, trang <code>code</code> CT Work và liên kết web trên thẻ; ép chia việc to thành các lát merge được trong 1–3 ngày.')],
    [t('<strong>Commit message</strong>', '<strong>Lời nhắn commit</strong>'), t('<strong>Conventional Commits 1.0.0:</strong> <code>&lt;type&gt;(&lt;TICKET&gt;): &lt;imperative summary&gt;</code>', '<strong>Conventional Commits 1.0.0:</strong> <code>&lt;loai&gt;(&lt;MA-THE&gt;): &lt;mô tả ngắn&gt;</code>'), '<code>feat(LF-22): enforce slot overlap check</code><br><code>test(LF-22): add 50-thread booking test</code>', t('Readable <code>git log</code>, easy to inspect in CT Work <code>code</code>, fast Release Notes generation. Note: when squashing, the PR title MUST follow Conventional Commits with the ticket ID; small commits remain inside the PR.', '<code>git log</code> đọc hiểu ngay, dễ tra cứu ở trang <code>code</code> CT Work, sinh Release Notes rất nhanh. Lưu ý: khi squash, tiêu đề PR phải theo Conventional Commits có mã thẻ; commit nhỏ chỉ còn lưu trong PR.')],
    [t('<strong>PR size limit</strong>', '<strong>Giới hạn cỡ PR</strong>'), t('Target <strong>≤ 300–400 changed lines</strong> per PR (split BE API / FE UI if bigger)', 'Mục tiêu <strong>≤ 300–400 dòng đổi</strong> mỗi PR (nếu to hơn thì tách PR BE / PR FE)'), t('PR #12: <code>LF-22 BE reservation API</code>; PR #13: <code>LF-22 FE wizard form</code>', 'PR #12: <code>LF-22 BE API đặt phòng</code>; PR #13: <code>LF-22 FE form wizard</code>'), t('Keeps self-review sharp (Cisco study, Lesson 1.5) and rollback painless.', 'Giữ mắt tự review tỉnh táo (nghiên cứu Cisco, Bài 1.5) và lùi bản cực dễ.')],
    [t('<strong>Merge strategy</strong>', '<strong>Chiến lược merge</strong>'), t('<strong>Squash and merge</strong> (clean 1-commit-per-PR on <code>main</code> — squash commit title comes from the PR title, so keep PR title in Conventional Commits with ticket ID; granular commits stay archived in the PR) OR regular Merge if commits are already atomic; <strong>NEVER force-push <code>main</code></strong>', '<strong>Squash and merge</strong> (gọn 1 commit/PR trên <code>main</code> — tiêu đề commit squash lấy theo tiêu đề PR nên tiêu đề PR bắt buộc theo Conventional Commits có mã thẻ; các commit nhỏ vẫn còn lưu trong PR) HOẶC Merge thường nếu từng commit đã sạch; <strong>CẤM force-push <code>main</code></strong>'), t('LabFlow: Squash &amp; merge with PR title <code>feat(LF-22): create reservation (#12)</code> + auto-delete branch', 'LabFlow: Squash &amp; merge với tiêu đề PR <code>feat(LF-22): create reservation (#12)</code> + tự xoá nhánh'), t('Clean linear history on <code>main</code>; reverting a broken feature takes one <code>git revert</code>.', 'Lịch sử <code>main</code> thẳng tắp; muốn lùi một tính năng hỏng chỉ cần đúng một lệnh <code>git revert</code>.')],
    [t('<strong>Milestone tags</strong>', '<strong>Tag các mốc nộp</strong>'), t('Annotated tag (<code>git tag -a</code>) on green <code>main</code> commit; never move a submitted tag', 'Annotated tag (<code>git tag -a</code>) trên commit <code>main</code> xanh; không bao giờ dời tag đã nộp'), '<code>iter1</code>, <code>iter2</code>, <code>iter3</code>, <code>v1.0-swp391-reference</code>', t('Immutable proof matching Software Package &amp; video demo (see ', 'Bằng chứng bất biến khớp Software Package &amp; video demo (xem ')+ac('software-development-project', 'swp391-6-1-build-staging-cicd', 'SWP391 6.1')+').']
  ]
)}

<h3>${t('4. Fillable Pull Request Template (commit at .github/PULL_REQUEST_TEMPLATE.md)', '4. Mẫu Pull Request điền được (lưu sẵn tại .github/PULL_REQUEST_TEMPLATE.md)')}</h3>
<p>${t('GitHub automatically pre-fills every new PR body with this file. Even when working alone, filling it out forces your Dev hat to explain <em>why</em> and prove <em>how you tested</em> before your Reviewer hat reads a single line of code:', 'GitHub tự động điền sẵn tệp này vào mọi PR mới mở. Kể cả khi làm một mình, tự điền đủ 5 mục ép mũ Dev giải thích <em>vì sao làm vậy</em> và chứng minh <em>đã test thế nào</em> trước khi mũ Reviewer đọc bất kỳ dòng code nào:')}</p>

${out(`## 1. Linked Ticket &amp; Scope
- CT Work Card: LF-___ (Screen/Req: S___)
- Hat authoring this PR: [ ] C3 Dev BE  [ ] C4 Dev FE  [ ] C1 Infra/Docs

## 2. What Changed &amp; Why (max 5 bullets)
- ...

## 3. Verification &amp; Evidence (Happy + Unhappy)
- [ ] Local build + unit/integration tests pass (paste command + pass count)
- [ ] Unhappy cases tested: empty/spaces · boundary · conflict · unauthorized (401/403)
- Screenshot / curl output / test log attached below or on CT Work card:

## 4. Database, Config &amp; Docs Sync
- [ ] New Flyway migration tested on fresh DB (or N/A)
- [ ] New env vars added to .env.example &amp; README.md (or N/A)
- [ ] SRS / SDS / OpenAPI updated if contract or BR changed (or N/A)

## 5. Self-Review &amp; Honesty Sign-Off (filled AFTER cooling-off gap under C5/C1)
- Cooling-off gap observed: ___ hours
- [ ] 100% hand-coded (AI used strictly as reviewer/mentor, logged in Template5)
- [ ] Reviewed diff line-by-line on GitHub; zero secrets or debug logs`)}

<h3>${t('5. Protecting main on GitHub — even when you are the sole admin', '5. Khoá nhánh main trên GitHub — ngay cả khi bạn là admin duy nhất')}</h3>
<p>${t('Under ', 'Dưới mũ ')}${mu('C1', en)}${t(', open GitHub → <strong>Settings → Rules → Rulesets (or Branch protection rules)</strong> for <code>main</code> (detailed walkthrough in ', ', vào GitHub → <strong>Settings → Rules → Rulesets (hoặc Branch protection rules)</strong> cho nhánh <code>main</code> (xem chi tiết từng nút ở ')}${cs('git', 'git-6-4-bao-ve-nhanh', 'Git 6.4 — Branch protection')}${t('). Turn on these 4 locks:', '). Bật đủ 4 ổ khoá sau:')}</p>
<ol>
<li>${t('<strong>Require a pull request before merging:</strong> Blocks accidental <code>git push origin main</code>.', '<strong>Bắt buộc qua Pull Request trước khi merge:</strong> Chặn sạch thao tác lỡ tay <code>git push origin main</code>.')}</li>
<li>${t('<strong>Require status checks to pass (CI green) &amp; branch up to date:</strong> You cannot merge red tests (configured in Lesson 6.3).', '<strong>Bắt buộc status check (CI xanh) &amp; nhánh cập nhật mới nhất:</strong> Không thể merge khi test đỏ (cài ở Bài 6.3).')}</li>
<li>${t('<strong>Block force pushes &amp; branch deletions:</strong> Guarantees history on <code>main</code> can never be wiped.', '<strong>Cấm force push &amp; cấm xoá nhánh <code>main</code>:</strong> Bảo đảm lịch sử trên <code>main</code> không bao giờ bị xoá sạch.')}</li>
<li>${t('<strong>Do not allow bypassing the above settings (Include administrators):</strong> Crucial for solo mode! Without this checkbox, GitHub silently lets the repo owner push directly to <code>main</code> at 1 AM.', '<strong>Không cho phép quản trị viên vượt qua luật (Include administrators):</strong> Cực kỳ quan trọng khi làm một mình! Quên tích ô này, GitHub vẫn âm thầm cho chủ repo đẩy thẳng lên <code>main</code> lúc 1 giờ sáng.')}</li>
</ol>

${cl('warn', `<strong>⚠️ ${t('GitHub Free Plan Caveat for Private Repositories', 'Lưu ý quan trọng về tài khoản GitHub Free với repo Private')}</strong><br>${t('GitHub Free personal accounts <strong>do NOT enforce Branch Protection or Rulesets on private repositories</strong> — server-side locking works only on <strong>public repositories</strong> or on private repositories with <strong>GitHub Pro / Team</strong>. As a student, activate the free <strong>GitHub Student Developer Pack</strong> (includes GitHub Pro!) using your university email, OR set the repo to <strong>public</strong> if your lecturer permits. If neither option is available, document honestly in an ADR: <em>"Server-side branch lock unavailable on GitHub Free private repo — enforcing PR-only workflow via self-discipline + local <code>pre-push</code> hook."</em>', 'Tài khoản cá nhân GitHub Free <strong>KHÔNG thực thi Branch Protection hay Ruleset trên kho private</strong> — khoá phía máy chủ chỉ chạy trên <strong>repo public</strong> hoặc repo private có gói <strong>GitHub Pro / Team</strong>. Là sinh viên, bạn có thể kích hoạt miễn phí <strong>GitHub Student Developer Pack</strong> (tặng sẵn GitHub Pro!) bằng email trường, HOẶC để repo <strong>public</strong> nếu giảng viên cho phép. Nếu chưa có cả hai, hãy ghi trung thực vào một ADR: <em>"Không khoá được trên máy chủ do repo private GitHub Free — áp dụng tự kỷ luật chỉ merge qua PR + hook cục bộ <code>pre-push</code>."</em>')}`)}

<p>${t('<strong>Daily 6-command muscle memory</strong> (keep this cheat sheet beside your monitor):', '<strong>Phản xạ 6 lệnh Git hằng ngày</strong> (dán ngay cạnh màn hình):')}</p>
${bash(`# Start a ticket branch from fresh main
git switch main && git pull --ff-only
git switch -c feat/lf-22-reservation-wizard

# Commit small, logical steps with ticket ID
git add -p
git commit -m "feat(LF-22): validate half-open slot interval"

# Push branch and open PR (via GitHub web or gh CLI)
git push -u origin feat/lf-22-reservation-wizard`)}

<h3>🕵️ ${t('The security &amp; hacker angle: supply-chain attacks on unprotected main branches', 'Góc bảo mật &amp; hacker: tấn công chuỗi cung ứng vào nhánh main không khoá')}</h3>
<p>${t(
    'If a malicious npm/Maven dependency or a compromised laptop runs a script with your cached Git token and <code>main</code> has no branch protection, an attacker can push a backdoor commit directly to <code>main</code> (or silently force-push over history) and trigger production deploys without a single PR notification. Turning on server-side rulesets, signed commits (optional, see ',
    'Nếu một thư viện npm/Maven nhiễm mã độc hoặc máy tính bị xâm nhập chạy script dùng token Git lưu sẵn trong khi nhánh <code>main</code> không khoá, kẻ tấn công có thể push cửa hậu thẳng lên <code>main</code> (hoặc âm thầm force-push đè lịch sử) và kích hoạt deploy mà không hề hiện thông báo PR nào. Bật ruleset phía máy chủ, ký commit (tuỳ chọn, xem ')}${cs('git', 'git-12-2-ky-commit', 'Git 12.2')}${t('), and requiring CI checks closes that wide-open door.', '), và ép chạy CI sẽ đóng sập cánh cửa mở toang đó.')}</p>

<h3>${t('6. Four solo Git traps — and how to fix them cleanly', '6. Bốn cái bẫy Git khi làm một mình — và cách xử lý gọn')}</h3>
<ul>
<li>${t('<strong>"I worked on main by mistake for 2 hours!":</strong> Do NOT panic or delete your work. Cut a branch right where you are (<code>git switch -c feat/lf-xx-name</code>), push it, open a PR, and reset local <code>main</code> back to <code>origin/main</code> (see ', '<strong>"Chết rồi, em lỡ code thẳng trên main suốt 2 tiếng!":</strong> Đừng hoảng hay xoá code. Cắt nhánh mới ngay tại chỗ (<code>git switch -c feat/lf-xx-ten</code>), push nhánh đó lên mở PR, rồi đưa <code>main</code> cục bộ về khớp <code>origin/main</code> (xem ')}${cs('git', 'git-18-4-sua-nham-tren-main', 'Git 18.4')}).</li>
<li>${t('<strong>One mega-branch alive for 10 days (1,800 lines changed):</strong> Impossible to review or revert safely. Fix: merge smaller vertical slices (e.g., schema + entity → API → UI → tests) every 1–2 days. Every merged PR keeps <code>main</code> working.', '<strong>Nuôi một nhánh khổng lồ suốt 10 ngày (đổi 1.800 dòng):</strong> Không thể review nổi và cũng không dám lùi bản. Cách tránh: chia thành lát nhỏ merge được sau mỗi 1–2 ngày (vd migration + entity → API → UI → test). Mọi PR sau khi merge phải giữ <code>main</code> chạy xanh.')}</li>
<li>${t('<strong>Forgetting the ticket ID in commits/PR:</strong> Breaks traceability between CT Work and GitHub. Fix: add a lightweight local <code>.githooks/commit-msg</code> reminder AND check PR titles in CI.', '<strong>Quên mã thẻ trong lời nhắn commit/PR:</strong> Làm đứt mạch truy vết giữa CT Work và GitHub. Cách tránh: đặt một hook nhắc cục bộ ở <code>.githooks/commit-msg</code> VÀ soát tiêu đề PR/commit trên CI.')}</li>
<li>${t('<strong>Using <code>git push --force</code> carelessly:</strong> Can erase commits permanently when working across two machines (laptop + lab PC). If you ever must rewrite your OWN feature branch before merge, use <code>--force-with-lease</code> — and NEVER on <code>main</code>.', '<strong>Dùng <code>git push --force</code> bừa bãi:</strong> Rất dễ xoá mất commit khi làm trên hai máy (laptop + máy bàn). Nếu bắt buộc phải viết lại lịch sử nhánh tính năng CỦA RIÊNG BẠN trước khi merge, chỉ dùng <code>--force-with-lease</code> — và TUYỆT ĐỐI không bao giờ dùng trên <code>main</code>.')}</li>
</ul>

${phongVan([
  [t('"You worked solo on this prototype — why did you bother opening Pull Requests and protecting main instead of committing straight to main?"', '"Bạn tự làm prototype một mình — sao phải mất công mở Pull Request và khoá nhánh main thay vì commit thẳng lên main cho nhanh?"'), t('Three reasons: first, branch protection + required CI guarantees main is always demoable and deployable at any minute; second, opening a PR gives me a dedicated Files Changed view on GitHub to perform an objective next-day review under my QA hat; third, linking every branch, conventional commit, and PR to a CT Work card creates an audit trail for Release Notes, RTM, and defense questions — and builds the exact daily workflow expected at OJT.', 'Ba lý do ạ: thứ nhất, khoá nhánh + ép CI xanh bảo đảm main luôn chạy và demo được bất kỳ lúc nào; thứ hai, mở PR tạo giao diện Files Changed trên GitHub để hôm sau em đổi mũ QA tự soi diff khách quan; thứ ba, gắn mã thẻ CT Work xuyên suốt nhánh, commit quy ước và PR tạo mạch truy vết rõ ràng cho Release Notes, RTM và câu hỏi hội đồng — đồng thời rèn đúng nhịp đi làm thực tế ở kỳ OJT.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Replace the <code>LF-</code> prefix with your marketplace ticket prefix (e.g., <code>EC-14</code>): branch <code>feat/ec-14-cart-checkout</code>, commits <code>feat(EC-14): reserve stock with row lock</code>, and add a mandatory checkbox in <code>PULL_REQUEST_TEMPLATE.md</code> for "Money/tax rounding verified with BigDecimal, never float/double."', 'Chỉ cần thay tiền tố <code>LF-</code> bằng mã thẻ sàn TMĐT (vd <code>EC-14</code>): nhánh <code>feat/ec-14-cart-checkout</code>, commit <code>feat(EC-14): giu ton kho bang khoa dong</code>, và thêm một ô tích bắt buộc trong <code>PULL_REQUEST_TEMPLATE.md</code>: "Tính tiền/thuế dùng BigDecimal, tuyệt đối không dùng float/double."')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Add ONE extra rule in GitHub Branch Protection: <strong>"Require at least 1 approving review from someone other than the author"</strong> + enable "Dismiss stale pull request approvals when new commits are pushed." Rotate reviewers weekly so all 5 members know the codebase before Final Presentation (see ', 'Bật thêm ĐÚNG MỘT luật trong Branch Protection trên GitHub: <strong>"Bắt buộc ít nhất 1 lượt Approve từ người KHÁC tác giả"</strong> + bật tự huỷ duyệt cũ khi push commit mới. Xoay vòng người review mỗi tuần để cả 5 bạn đều hiểu mã trước ngày bảo vệ (xem ')+cs('agile-teamwork', 'agl-4-1-muc-dich', 'Agile Teamwork 4.1')+').'],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Teams often run Trunk-Based Development with feature flags (or Release Branches <code>release/2.4</code> when maintaining multiple client versions in parallel), Jira/Azure DevOps smart commits auto-transitioning tickets, <code>CODEOWNERS</code> requiring Tech Lead + Security approvals, and mandatory GPG/SSH signed commits.', 'Các đội lớn thường dùng Trunk-Based Development kèm feature flag (hoặc nhánh phát hành <code>release/2.4</code> khi phải bảo trì song song nhiều bản cho khách), smart commit của Jira/Azure DevOps tự chuyển trạng thái thẻ, <code>CODEOWNERS</code> ép Tech Lead + Bảo mật duyệt, và bắt buộc ký commit bằng GPG/SSH.')]
], en)}

${viecLabflow([
  [t('Under hat C1, enable GitHub Branch Protection / Ruleset on <code>main</code> (PR required, CI check required, no force-push, <strong>do not allow admin bypass</strong> — using GitHub Student Pack/Pro or a lecturer-approved public repo; if stuck on GitHub Free private, log the limitation in an ADR + add a local <code>pre-push</code> hook) and add <code>.github/PULL_REQUEST_TEMPLATE.md</code>.', 'Dưới mũ C1, bật Branch Protection / Ruleset trên GitHub cho nhánh <code>main</code> (bắt buộc PR, bắt buộc CI xanh, cấm force-push, <strong>cấm admin vượt qua</strong> — dùng GitHub Student Pack/Pro hoặc repo public nếu GV cho phép; nếu còn dùng repo private Free thì ghi rõ vào ADR + thêm hook <code>pre-push</code> cục bộ) và thêm <code>.github/PULL_REQUEST_TEMPLATE.md</code>.'), t('Attempting <code>git push origin main</code> directly is rejected by GitHub server (or blocked by local hook + documented in ADR on Free private); opening a new PR automatically pre-fills the 5-section template; CT Work <code>code</code> displays your branch/PR and you attach the PR link to your LF card via Web link or Comment.', 'Thử <code>git push origin main</code> thẳng bị máy chủ GitHub từ chối (hoặc chặn bằng hook cục bộ + ghi ADR nếu dùng repo private Free); mở PR mới tự hiện sẵn mẫu 5 phần; trang <code>code</code> CT Work hiển thị nhánh/PR và bạn gắn link PR vào thẻ LF qua Liên kết web hoặc Bình luận.')]
], en)}

${thuatNgu([
  ['GitHub Flow', t('A lightweight branching workflow with one always-deployable <code>main</code> branch and short-lived feature branches merged exclusively via Pull Requests.', 'Quy trình nhánh gọn nhẹ gồm một nhánh <code>main</code> luôn triển khai được và các nhánh tính năng sống ngắn chỉ hợp nhất qua Pull Request.')],
  ['Conventional Commits', t('A standardized commit message format (<code>type(scope): summary</code>, v1.0.0) enabling clean history, ticket traceability, and automated changelogs.', 'Quy chuẩn lời nhắn commit (<code>loai(pham-vi): mo-ta</code>, v1.0.0) giúp lịch sử dễ đọc, truy vết theo thẻ và tự sinh changelog.')],
  ['Squash and Merge', t('Combining all work-in-progress commits on a feature branch into a single clean commit when merging a PR into <code>main</code>.', 'Gộp toàn bộ các commit dở dang trên nhánh tính năng thành đúng một commit sạch khi merge PR vào <code>main</code>.')],
  ['Branch Protection / Ruleset', t('Server-side GitHub rules enforcing PRs, passing CI checks, and blocking direct pushes or force-pushes to <code>main</code>.', 'Bộ luật phía máy chủ GitHub ép qua PR, ép CI xanh và chặn push thẳng hoặc force-push lên <code>main</code>.')],
  ['Annotated Tag', t('A full Git tag object (<code>git tag -a</code>) storing tagger, date, and release message — immutable anchor for milestones and Software Packages.', 'Đối tượng tag đầy đủ trong Git (<code>git tag -a</code>) lưu người tạo, ngày và ghi chú — điểm neo bất biến cho mốc nộp và Software Package.')]
], en)}

${tomTat([
  t('Stamp your ticket ID (e.g., <code>LF-22</code>) across branch name, conventional commits, and PR title so CT Work, GitHub, and Release Notes form one unbroken audit trail.', 'Đóng dấu mã thẻ (vd <code>LF-22</code>) xuyên suốt tên nhánh, commit quy ước và tiêu đề PR để CT Work, GitHub và Release Notes nối thành một mạch truy vết liền khối.'),
  t('Keep branches short-lived (1–3 days) and PRs small (≤ 300–400 lines) — supported by DORA research and Cisco review data.', 'Giữ nhánh sống ngắn (1–3 ngày) và PR nhỏ (≤ 300–400 dòng) — đúng khuyến nghị của nghiên cứu DORA và dữ liệu review Cisco.'),
  t('Lock <code>main</code> on GitHub WITH "Do not allow admin bypass" enabled, and commit <code>.github/PULL_REQUEST_TEMPLATE.md</code> so every merge is deliberate.', 'Khoá nhánh <code>main</code> trên GitHub KÈM mục cấm admin vượt luật, và commit sẵn <code>.github/PULL_REQUEST_TEMPLATE.md</code> để mọi lần merge đều có kiểm soát.'),
  t('Stay 100% honest: run 5-person Git discipline under ONE real GitHub identity — never forge fake team accounts.', 'Giữ trung thực 100%: vận hành kỷ luật Git như 5 người dưới ĐÚNG MỘT danh tính GitHub thật — tuyệt đối không tạo tài khoản nhóm giả.')
], en)}
<p>${t('Cross-references: ', 'Đọc thêm: ')}${cs('agile-teamwork', 'agl-3-1-quy-uoc', 'Agile Teamwork 3.1 — Branch &amp; commit conventions')} · ${cs('agile-teamwork', 'agl-3-2-pr-tot', 'Agile Teamwork 3.2 — Easy-to-review PRs')} · ${cs('git', 'git-6-4-bao-ve-nhanh', 'Git 6.4 — Branch protection')} · ${ac('software-development-project', 'swp391-4-2-code-review-integration', 'SWP391 4.6 — Daily integration')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-6-3-ci-toi-thieu-dod', t('6.3 — Minimal CI and Automated Definition of Done', '6.3 — CI tối thiểu và Definition of Done tự động'))}.</p>
`);
};

export default {
  title: '6.2 — Solo Git Flow that runs like a 5-person team: ticket branches, conventional commits & self-reviewed PRs|||6.2 — Git flow một người mà như năm người: nhánh theo thẻ, commit quy ước & PR tự review',
  slug: 'dm5-6-2-git-flow-mot-nguoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vận hành GitHub Flow sắc nét cho công ty một người mà không làm giả tài khoản: bài học Knight Capital (2012) & DORA, vòng 7 bước đổi mũ, ma trận luật nhánh/commit/merge/tag, mẫu PULL_REQUEST_TEMPLATE.md điền được, khoá main cấm admin vượt luật và áp sang sàn TMĐT, nhóm SEP490 và doanh nghiệp.',
  content: L62(true) + L62(false),
};
