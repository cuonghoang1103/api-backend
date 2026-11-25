/**
 * 3.3 — CI như một đồng đội (agl-3-3-ci). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: ci/ci.sh (Node 22.22.2 + Java 25 + Flyway 12.4.0 trên PostgreSQL 16 trong container, giới hạn 2 GB) — kịch bản
 * kb-ci.sh (khong-luat / co-luat), kb-ngoai-thu-tu.sh (CSDL dùng chung), kb-ong.sh (lỗi XANH GIẢ có thật của chính ci.sh bản đầu).
 * Nguồn: GitHub Docs "About protected branches" (đọc 24/11: bảng Strict/Loose, merge queue). Ranh giới: viết workflow YAML ⇒ khoá
 * GitHub Actions 15.1, 14.1, 1.4; bảo vệ nhánh ⇒ Git 6.4. Bài này: CI nhóm cần kiểm GÌ, và luật nhóm quanh nó.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { java } from '../../spring-boot/_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L33 = (en) => {
  const t = (a, b) => (en ? a : b);
  const ckl = RA.ciKhongLuat, ccl = RA.ciCoLuat;
  return vo(en, 'Chapter 3 · Lesson 3.3', 'Chương 3 · Bài 3.3', `
<h2>${t('3.3 — CI checks as a teammate', '3.3 — CI như một đồng đội')}</h2>
<p class="lead">${t(
    'Continuous integration is the sixth member of your team: the one who never gets tired, checks every PR the same way, and says no to the leader as calmly as to anyone else. This lesson is about what <em>a student team</em> should make it check, which rules make its answer mean something — and three real failures, measured on LabFlow, where a green tick lied.',
    'Tích hợp liên tục (CI) là thành viên thứ sáu của nhóm: người không bao giờ mệt, soát mọi PR theo cùng một cách, và nói "không" với trưởng nhóm bình thản như với bất kỳ ai. Bài này dạy <em>một nhóm sinh viên</em> nên bắt CI kiểm gì, luật nào làm câu trả lời của nó có nghĩa — và ba lần hỏng thật, đo trên LabFlow, khi dấu tick xanh nói dối.')}</p>
${note(t('How to write the workflow file (YAML, Postgres service container, caching) is taught in ', 'Cách viết tệp workflow (YAML, Postgres dạng service container, cache) được dạy ở ') + cs('github-actions', 'ga-15-1-ci-cho-pr', t('GitHub Actions 15.1 — CI for pull requests', 'GitHub Actions 15.1 — CI cho pull request')) + t(' and ', ' và ') + cs('github-actions', 'ga-14-1-cong-chat-luong', t('14.1 — quality gates and merge queue', '14.1 — cổng chất lượng và merge queue')) + t('; branch protection clicks in ', '; các bước bật bảo vệ nhánh ở ') + cs('git', 'git-6-4-bao-ve-nhanh', 'Git 6.4') + t('. Here the same checks run as one local script, so you can see every result.', '. Ở đây các bước kiểm chạy thành một script cục bộ để bạn thấy mọi kết quả.'))}

<h3>${t('Everyday picture: the scale at the airport check-in', 'Liên tưởng đời thường: cái cân ở quầy check-in sân bay')}</h3>
<p>${t(
    'The check-in scale does not care who you are or how sure you are that your bag is 20 kg. Everyone puts the bag on the same scale, and the argument is over before it starts. CI is that scale for code — but only if (1) it weighs what actually matters, (2) nobody can walk around it, and (3) it is calibrated. Each of the three labs below breaks one of those.',
    'Cân ở quầy check-in không quan tâm bạn là ai hay bạn chắc vali mình 20 kg tới đâu. Ai cũng đặt vali lên cùng một cái cân, và cuộc tranh cãi kết thúc trước khi bắt đầu. CI là cái cân đó cho code — nhưng chỉ khi (1) nó cân đúng thứ quan trọng, (2) không ai đi vòng qua nó được, và (3) nó được hiệu chuẩn. Mỗi lab dưới đây phá một trong ba điều đó.')}</p>

<h3>${t('What LabFlow’s CI checks — and why each step', 'CI của LabFlow kiểm gì — và vì sao có từng bước')}</h3>
${bang([t('Step', 'Bước'), t('Catches', 'Bắt được'), t('In the real stack', 'Ở bộ công nghệ thật')], [
    [t('1 commit messages', '1 lời nhắn commit'), t('Commits without a ticket (lesson 3.1)', 'Commit không mang ticket (bài 3.1)'), t('Same script, or commitlint', 'Cùng script, hoặc commitlint')],
    [t('2 front-end tests', '2 test giao diện'), t('Duplicate routes, menu items pointing nowhere, syntax errors after a conflict', 'Route trùng, mục menu trỏ vào hư không, lỗi cú pháp sau khi giải xung đột'), '<code>npm ci && npm test && npm run build</code>'],
    [t('3 migration versions', '3 số phiên bản migration'), t('New migration not newer than everything on main', 'Migration mới không mới hơn mọi thứ trên main'), t('Same script (Git can never see this)', 'Cùng script (Git không bao giờ thấy được điều này)')],
    [t('4 Flyway on an empty database', '4 Flyway trên CSDL trống'), t('SQL that does not run; duplicate versions', 'SQL không chạy được; phiên bản trùng'), t('<code>mvn verify</code> with a Postgres service, as in GA 15.1', '<code>mvn verify</code> với Postgres dạng service, như GA 15.1')],
  ])}
${bash(MA.ci)}
${java(MA.migrate)}
<p>${t('The two short Node scripts it calls (step 1 is in lesson 3.1):', 'Script Node ngắn mà nó gọi (bước 1 ở bài 3.1):')}</p>
${js(MA.kiemMigration)}
${js(MA.test)}

<h3>${t('Lab 1 — two green PRs, one red main', 'Lab 1 — hai PR xanh, một main đỏ')}</h3>
<p>${t('Thursday 18/02/2027. C1 builds S22 (booking) and needs a <code>dat_lich</code> table; C4 builds S30 (lending desk) and needs a <code>muon_tra</code> table. Both look at main, see V2 as the latest migration, and both create <strong>V3</strong>. They touch different files, so Git sees no conflict at all. At 11:30 CI runs on each branch:', 'Thứ Năm 18/02/2027. C1 làm S22 (đặt lịch) cần bảng <code>dat_lich</code>; C4 làm S30 (quầy cho mượn) cần bảng <code>muon_tra</code>. Cả hai nhìn main, thấy migration mới nhất là V2, và cả hai tạo <strong>V3</strong>. Họ chạm các tệp khác nhau nên Git không thấy xung đột nào. 11:30 CI chạy trên từng nhánh:')}</p>
${out(ckl.split('### 13:00')[0].replace(/^### .*\n/, '').split('\nC4 (')[0] + '\nC4 (feat/LF-44-quay-muon)$ ci/ci.sh\n…\nCI: XANH\n(exit 0)')}
<p>${t('At 13:00 C5 approves #2 and squash-merges it. At 13:30 #1 still shows the green tick from 11:30 and has no conflicts, so GitHub lets C2 merge it. Then CI runs on main:', '13:00 C5 duyệt #2 và merge kiểu squash. 13:30 #1 vẫn hiện dấu tick xanh từ 11:30 và không có xung đột, nên GitHub cho C2 merge. Rồi CI chạy trên main:')}</p>
${out(ckl.split('### 13:31 — CI chạy trên main sau merge:\n')[1])}
<p>${t('Each PR was correct on its own. The <em>combination</em> is broken — the Spring Boot app on the demo server would refuse to start with exactly this Flyway error. This is a <strong>semantic conflict</strong>: no two people edited the same line, yet their changes cannot coexist. GitHub’s documentation describes the setting that caused it with unusual honesty — with required checks in "loose" mode the branch need not be up to date, and "status checks may fail after you merge your branch if there are incompatible changes with the base branch" (', 'Mỗi PR đúng khi đứng riêng. <em>Bản kết hợp</em> thì hỏng — ứng dụng Spring Boot trên máy demo sẽ từ chối khởi động với đúng lỗi Flyway này. Đây là <strong>xung đột ngữ nghĩa</strong>: không ai sửa cùng một dòng, nhưng hai thay đổi không thể cùng tồn tại. Tài liệu GitHub mô tả cài đặt gây ra nó thẳng thắn hiếm thấy — khi check bắt buộc ở chế độ "loose", nhánh không cần cập nhật, và "status checks may fail after you merge your branch if there are incompatible changes with the base branch" (')}${ng('https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches', 'GitHub Docs — About protected branches')}).</p>

<h3>${t('The fix: the result that gets checked is the result that gets merged', 'Cách sửa: thứ được kiểm phải là thứ được merge')}</h3>
<p>${t('Turn on <strong>"Require branches to be up to date before merging"</strong> (GitHub calls this "strict"). Now #1 cannot be merged until C1 brings main into the branch, which re-runs CI on the real combination:', 'Bật <strong>"Require branches to be up to date before merging"</strong> (GitHub gọi là "strict"). Giờ #1 không merge được cho tới khi C1 đưa main vào nhánh, và CI chạy lại trên đúng bản kết hợp:')}</p>
${out(ccl.split('### 13:30')[1].split('### 13:40')[0].replace(/^[^\n]*\n/, ''))}
<p>${t('Red on the branch, not on main — the failure stays C1’s problem and blocks nobody. C1 renames the migration:', 'Đỏ trên nhánh, không phải trên main — lỗi vẫn là việc của C1 và không chặn ai. C1 đổi số migration:')}</p>
${out(ccl.split('### 13:40')[1].replace(/^[^\n]*\n/, ''))}
${cl('info', `<p>${t('The price of "strict" is more CI runs: every merge to main makes every open PR out of date. For five people with ~15 PRs per iteration that is nothing. Busy teams use a <strong>merge queue</strong> instead — GitHub’s docs say it "provides the same benefits as the Require branches to be up to date before merging branch protection, but does not require a pull request author to update their pull request branch" (details: GA 14.1).', 'Cái giá của "strict" là chạy CI nhiều hơn: mỗi lần merge vào main làm mọi PR đang mở bị cũ. Với năm người, ~15 PR mỗi iteration, chẳng đáng gì. Đội đông dùng <strong>merge queue</strong> thay thế — tài liệu GitHub nói nó "provides the same benefits as the Require branches to be up to date before merging branch protection, but does not require a pull request author to update their pull request branch" (chi tiết: GA 14.1).')}</p>`)}

<h3>${t('Lab 2 — the shared database remembers', 'Lab 2 — CSDL dùng chung thì nhớ dai')}</h3>
<p>${t('Many SWP391 teams share one cloud database for the demo server. A shared database adds two traps that a fresh CI database never shows. Monday: the holiday-calendar PR with <code>V4</code> merges first and the server migrates. Tuesday: a PR created last week with <code>V3</code> merges:', 'Nhiều nhóm SWP391 dùng chung một CSDL trên mây cho máy demo. CSDL dùng chung thêm hai cái bẫy mà CSDL trống của CI không bao giờ cho thấy. Thứ Hai: PR lịch nghỉ mang <code>V4</code> merge trước, máy chủ migrate. Thứ Ba: một PR tạo từ tuần trước mang <code>V3</code> merge:')}</p>
${out(RA.ngoaiThuTu.split('### Thứ Tư')[0].replace(/^### .*\n/, ''))}
<p>${t('Flyway refuses to apply a migration older than the database (unless someone turns on <code>outOfOrder</code>, which hides the problem). That is why step 3 of the CI insists that a new migration must be newer than <em>everything on main</em> — it turns this server-side failure into a red PR. Wednesday, worse: someone reverts the holiday PR with <code>git revert</code> because it had a bug. The file disappears; the database does not forget:', 'Flyway từ chối áp một migration cũ hơn CSDL (trừ khi ai đó bật <code>outOfOrder</code>, thứ chỉ che vấn đề đi). Vì vậy bước 3 của CI đòi migration mới phải mới hơn <em>mọi thứ trên main</em> — biến lỗi phía máy chủ này thành một PR đỏ. Thứ Tư, tệ hơn: ai đó <code>git revert</code> PR lịch nghỉ vì nó có lỗi. Tệp biến mất; CSDL thì không quên:')}</p>
${out(RA.ngoaiThuTu.split('### Thứ Tư')[1].replace(/^[^\n]*\n/, ''))}
${cl('danger', `<p>${t('No error, "0 migrations applied" — and the table <code>ngay_nghi</code> is still there, recorded as version 4, while the code no longer knows it exists. The next person who writes a <code>V4</code> will be skipped silently on this server. Team rule: <strong>migrations only move forward</strong>. Never edit, rename or revert a migration that has reached a shared database; to undo, write a new one (<code>V5__xoa_ngay_nghi.sql</code>).', 'Không lỗi, "áp 0 migration" — và bảng <code>ngay_nghi</code> vẫn nằm đó, ghi nhận là phiên bản 4, trong khi code không còn biết nó tồn tại. Người tiếp theo viết một <code>V4</code> sẽ bị bỏ qua lặng lẽ trên máy chủ này. Luật nhóm: <strong>migration chỉ đi tới</strong>. Không bao giờ sửa, đổi tên hay revert migration đã chạm CSDL dùng chung; muốn hoàn tác thì viết migration mới (<code>V5__xoa_ngay_nghi.sql</code>).')}</p>`)}

<h3>${t('Lab 3 — a CI that lies: the first version of this very script', 'Lab 3 — CI nói dối: bản đầu của chính script này')}</h3>
<p>${t('While preparing this lesson, the first version of <code>ci.sh</code> reported <strong>CI: XANH</strong> on a branch whose route file did not even parse. Step 2 piped the test output through <code>grep</code> and <code>head</code> to keep it short — and in a pipeline the exit code is the <em>last</em> command’s:', 'Khi soạn bài này, bản đầu của <code>ci.sh</code> báo <strong>CI: XANH</strong> trên một nhánh mà tệp route còn không đọc được. Bước 2 cho output test đi qua <code>grep</code> và <code>head</code> cho gọn — và trong một ống lệnh, mã thoát là của lệnh <em>cuối</em>:')}</p>
${out(RA.ciOng)}
<p>${t('The test failed (<code># fail 1</code>, a SyntaxError), <code>head</code> succeeded, and the step reported success. One line — <code>set -o pipefail</code> — makes the pipeline fail if any part fails. The general lesson: <strong>CI is code, and untested code lies</strong>. When you add a check, break something on purpose once and watch the check go red. (The GitHub Actions course has the twin of this bug: a test suite that is green because it runs zero tests.)', 'Test hỏng (<code># fail 1</code>, một SyntaxError), <code>head</code> thành công, và bước kiểm báo thành công. Một dòng — <code>set -o pipefail</code> — làm cả ống lệnh hỏng nếu bất kỳ phần nào hỏng. Bài học chung: <strong>CI cũng là code, và code chưa được thử thì nói dối</strong>. Khi thêm một bước kiểm, cố ý làm hỏng một thứ một lần và xem bước đó chuyển đỏ. (Khoá GitHub Actions có người anh em của lỗi này: bộ test xanh vì chạy 0 test.)')}</p>

<h3>${t('Team rules around CI', 'Luật nhóm quanh CI')}</h3>
${bang([t('Rule', 'Luật'), t('Meaning for LabFlow', 'Nghĩa với LabFlow')], [
    [t('Required, strict', 'Bắt buộc, strict'), t('All four steps are a required check; branches must be up to date; nobody (including the leader and admins) merges red', 'Cả bốn bước là check bắt buộc; nhánh phải cập nhật; không ai (kể cả trưởng nhóm, admin) merge khi đỏ')],
    [t('Stop the line', 'Dừng dây chuyền'), t('Main red ⇒ nobody merges anything else; whoever merged last fixes or reverts within 30 minutes', 'Main đỏ ⇒ không ai merge thêm gì; người merge cuối sửa hoặc revert trong 30 phút')],
    [t('Run it before you push', 'Chạy trước khi push'), t('<code>ci/ci.sh</code> locally — CI on the server is the referee, not your debugger', '<code>ci/ci.sh</code> ở máy — CI trên máy chủ là trọng tài, không phải công cụ gỡ lỗi của bạn')],
    [t('No flaky tests', 'Không test chập chờn'), t('A test that fails randomly is fixed or quarantined the same day, or people learn to ignore red', 'Test hỏng ngẫu nhiên phải sửa hoặc cách ly trong ngày, kẻo mọi người quen lờ màu đỏ')],
    [t('Under 10 minutes', 'Dưới 10 phút'), t('Slow CI makes people batch changes into big PRs (3.2)', 'CI chậm khiến mọi người gom thay đổi thành PR to (3.2)')],
  ])}
<p>${t('"Stop the line" comes from Toyota’s andon cord: any worker who sees a defect may stop the whole assembly line, because a defect passed downstream costs far more. A red main is that defect: every branch updated from it inherits the failure.', '"Dừng dây chuyền" lấy từ dây andon của Toyota: công nhân nào thấy lỗi cũng được dừng cả dây chuyền, vì lỗi bị chuyển xuống công đoạn sau tốn kém hơn nhiều. Main đỏ chính là lỗi đó: mọi nhánh cập nhật từ nó đều thừa hưởng cái hỏng.')}</p>

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'In a company the CI pipeline already exists and is owned by someone (a DevOps or the tech lead). Your duties as a new member: run the checks locally before pushing, never ask for "just merge it, CI is wrong" without proof, and when main breaks after your merge, say so in the team channel first — "main is red after my PR #812, reverting now" — then fix. Teams forgive a red build; they do not forgive silence.',
    'Ở công ty, pipeline CI đã có sẵn và có người phụ trách (DevOps hoặc tech lead). Việc của bạn khi là người mới: chạy các bước kiểm ở máy trước khi push, không bao giờ xin "cứ merge đi, CI sai đấy" khi chưa có bằng chứng, và khi main hỏng sau lần merge của bạn, nói trước trên kênh nhóm — "main đỏ sau PR #812 của em, em revert ngay" — rồi mới sửa. Đội tha thứ cho một bản build đỏ; họ không tha thứ cho sự im lặng.')}</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Answer from the outputs above. (1) In Lab 1 without the strict rule, which step would have caught the problem if C1 had simply re-run CI at 13:29? (2) Why does the fresh database of step 4 never reproduce Lab 2? (3) Add a fifth step to <code>ci.sh</code> that fails if a file named <code>.env</code> or ending in <code>.pem</code> is in the repository — then prove it goes red.', 'Trả lời từ các output ở trên. (1) Ở Lab 1 khi không có luật strict, nếu C1 chạy lại CI lúc 13:29 thì bước nào bắt được vấn đề? (2) Vì sao CSDL trống của bước 4 không bao giờ tái hiện được Lab 2? (3) Thêm bước thứ năm vào <code>ci.sh</code>: hỏng nếu trong repo có tệp tên <code>.env</code> hoặc đuôi <code>.pem</code> — rồi chứng minh nó chuyển đỏ.')}</p>
${giai(t('Answer', 'Đáp án'), `<ol>
<li>${t('Not necessarily any! Re-running CI on the branch as it was (based on the old main) still passes. Only CI on the <em>merge result</em> — what GitHub Actions does for <code>pull_request</code> events, see ', 'Chưa chắc bước nào! Chạy lại CI trên nhánh như cũ (dựa trên main cũ) vẫn qua. Chỉ CI trên <em>kết quả merge</em> — điều GitHub Actions làm với sự kiện <code>pull_request</code>, xem ')}${cs('github-actions', 'ga-1-4-merge-commit', 'GA 1.4')}${t(' — or after updating the branch, sees both V3 files; then steps 3 and 4 both fail.', ' — hoặc sau khi cập nhật nhánh, mới thấy cả hai tệp V3; khi đó bước 3 và 4 cùng hỏng.')}</li>
<li>${t('Because it starts empty every time and applies migrations in order: it has no memory of what was applied before. The shared database’s history table is exactly that memory.', 'Vì lần nào nó cũng bắt đầu trống rồi áp migration theo thứ tự: nó không nhớ cái gì đã từng được áp. Bảng lịch sử của CSDL dùng chung chính là trí nhớ đó.')}</li>
<li>${t('One possible step (then <code>touch .env &amp;&amp; git add -f .env</code> on a test branch and watch it fail):', 'Một cách viết (rồi <code>touch .env &amp;&amp; git add -f .env</code> trên một nhánh thử và xem nó hỏng):')}<br><code>buoc "5/5 tệp cấm" bash -c '! git ls-files | grep -E "(^|/)\\.env$|\\.pem$"'</code></li>
</ol>`)}

${phongVan([
    [t('"Your PR passed CI, but main broke after it was merged. How is that possible?"', '"PR của bạn qua CI, nhưng main hỏng sau khi merge. Sao có thể?"'), t('CI ran on my branch against an older main. Another PR merged in between, and the combination conflicted semantically — in our case two migrations with the same version, no textual conflict. The fix is to require branches to be up to date (or a merge queue), so the tested commit is the merged one.', 'CI chạy trên nhánh của tôi dựa trên main cũ. Một PR khác merge vào giữa chừng, và bản kết hợp xung đột về ngữ nghĩa — trường hợp của nhóm tôi là hai migration trùng số phiên bản, không có xung đột chữ. Cách sửa là bắt nhánh phải cập nhật (hoặc dùng merge queue) để commit được kiểm chính là commit được merge.')],
    [t('"What do you do when main is red?"', '"Main đỏ thì bạn làm gì?"'), t('Stop merging. The person who merged last says so in the channel and either fixes it fast or reverts their PR; a revert is cheap and safe compared with everyone building on a broken base.', 'Dừng merge. Người merge cuối nói ngay trên kênh nhóm và sửa nhanh hoặc revert PR của mình; revert rẻ và an toàn so với cả nhóm xây tiếp trên một nền hỏng.')],
    [t('"How do you undo a database migration that is already deployed?"', '"Làm sao hoàn tác một migration CSDL đã triển khai?"'), t('With a new forward migration. Deleting or reverting the file does not change the database — Flyway records what ran, and a missing latest migration is silently ignored, leaving schema and code out of sync.', 'Bằng một migration mới đi tới. Xoá hay revert tệp không làm CSDL thay đổi — Flyway ghi lại cái đã chạy, và migration mới nhất bị thiếu sẽ bị bỏ qua lặng lẽ, để lược đồ và code lệch nhau.')],
    [t('"How do you know your CI actually catches failures?"', '"Làm sao biết CI của bạn thật sự bắt được lỗi?"'), t('Break something deliberately and watch it go red. I once found a CI step that was green on a syntax error because the exit code of a grep/head pipeline hid the failure; set -o pipefail fixed it.', 'Cố ý làm hỏng một thứ và xem nó chuyển đỏ. Tôi từng gặp một bước CI vẫn xanh khi có lỗi cú pháp vì mã thoát của ống grep/head che mất lỗi; set -o pipefail đã sửa được.')],
  ], en)}

${thuatNgu([
    ['CI', t('Continuous integration: every change is built and tested automatically.', 'Tích hợp liên tục: mọi thay đổi được tự động build và test.')],
    ['required check', t('A status check that must pass before merge.', 'Một status check phải đạt mới merge được.')],
    ['strict / up to date', t('Branch must contain the latest base before merge.', 'Nhánh phải chứa gốc mới nhất trước khi merge.')],
    ['merge queue', t('GitHub queues PRs and tests each on top of the ones ahead.', 'GitHub xếp hàng PR, kiểm từng cái trên nền các PR đứng trước.')],
    [t('semantic conflict', 'xung đột ngữ nghĩa'), t('Changes that merge cleanly but break together.', 'Thay đổi merge sạch nhưng đặt cạnh nhau thì hỏng.')],
    ['migration', t('Versioned script that changes the database schema.', 'Script có số phiên bản thay đổi lược đồ CSDL.')],
    ['Flyway', t('Java tool that applies migrations in version order and records them.', 'Công cụ Java áp migration theo thứ tự phiên bản và ghi lại.')],
    ['pipefail', t('Shell option: a pipeline fails if any command in it fails.', 'Tuỳ chọn shell: ống lệnh hỏng nếu bất kỳ lệnh nào trong đó hỏng.')],
    ['flaky test', t('A test that passes or fails without code changes.', 'Test lúc đạt lúc hỏng dù code không đổi.')],
  ], en)}

${tomTat([
    t('Make CI check what breaks your team: commit rules, front-end tests, migration order, migrations on an empty database.', 'Bắt CI kiểm đúng thứ làm nhóm hỏng: luật commit, test giao diện, thứ tự migration, chạy migration trên CSDL trống.'),
    t('Two green PRs can make a red main; require up-to-date branches (or a merge queue) so the tested commit is the merged commit.', 'Hai PR xanh có thể tạo một main đỏ; bắt nhánh cập nhật (hoặc merge queue) để commit được kiểm là commit được merge.'),
    t('Migrations only move forward; reverting a file does not revert a database.', 'Migration chỉ đi tới; revert tệp không revert được CSDL.'),
    t('CI is code: break something on purpose to prove each check can go red.', 'CI cũng là code: cố ý làm hỏng để chứng minh mỗi bước kiểm có thể chuyển đỏ.'),
    t('Main red ⇒ stop the line; the last merger fixes or reverts, and says so first.', 'Main đỏ ⇒ dừng dây chuyền; người merge cuối sửa hoặc revert, và nói ra trước.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-3-4-merge', t('3.4 — Merging and resolving conflicts together', '3.4 — Merge và cùng giải xung đột'))}.</p>
`);
};

export default {
  title: '3.3 — CI checks as a teammate|||3.3 — CI như một đồng đội',
  slug: 'agl-3-3-ci',
  type: 'LESSON',
  isFreePreview: true,
  description: 'CI nhóm cần kiểm gì (commit, test giao diện, thứ tự migration, Flyway trên CSDL trống) và luật quanh nó; ba lab chạy thật trên PostgreSQL 16: hai PR cùng tạo V3 đều xanh nhưng main đỏ — sửa bằng "Require branches to be up to date"; CSDL dùng chung từ chối migration cũ và lặng lẽ giữ bảng sau git revert; và lỗi XANH GIẢ có thật của chính script CI (thiếu pipefail). Dừng dây chuyền khi main đỏ.',
  content: L33(true) + L33(false),
};
