/**
 * Kỹ năng nghề · 📝 3.3 — README, commit, pull request, tiêu đề issue. README tồi (tự dựng) vs README thật của SportShop.
 * KHÔNG làm lại phần viết defect report (đã có ở swt301-practice).
 */
import { moDun, bangDe, phanLoai, tracNghiem, sapXep, giai, hai, TN } from './_chung.mjs';

const README_TOI = `# sportshop
Our SWT301 project.

## Setup
Install everything and run.

## Database
Copy db.properties.example to db.properties and set url, user, password
(SQL Server, database SportShop; the script is db/sportshop.sql).

## Run
Open in NetBeans → Run Project (F6) → http://localhost:8080/SportShop

## Tests
TODO`;

const TT = ['Present and usable', 'Present but unusable', 'Missing'];
const G1 = bangDe({
  tieuDe: 'Docs 1 — Audit a bad README',
  doKho: 'EASY', phut: 7,
  moTa: {
    en: `<p>A teammate cloned the repository on a new laptop and gave up after 40 minutes. Here is the README they found:</p><pre>${README_TOI.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>
<p>A README that works answers, in order: <b>what is this</b>, <b>what do I need</b> (with versions), <b>how do I install and configure it</b>, <b>how do I run it</b>, <b>how do I run the tests and what result to expect</b>, <b>where things are</b>, and <b>what to do when it breaks</b>. Mark each expected section.</p>`,
    vi: '<p>Một bạn trong nhóm clone kho mã về máy mới và bỏ cuộc sau 40 phút với README ở trên. README dùng được trả lời theo thứ tự: <b>đây là gì</b>, <b>cần gì</b> (kèm phiên bản), <b>cài và cấu hình thế nào</b>, <b>chạy thế nào</b>, <b>chạy test thế nào và kết quả mong đợi</b>, <b>cái gì nằm ở đâu</b>, <b>hỏng thì làm gì</b>. Đánh giá từng mục cần có.</p>',
  },
  bang: [{
    ma: 'b1', de: hai('Section → state in this README', 'Mục → tình trạng trong README này'),
    cot: [{ ma: 's', ten: 'Expected section' }, { ma: 't', ten: 'State', luaChon: TT }],
    hang: [
      'What the project is (stack in one line)',
      'Prerequisites with versions (JDK, Tomcat, SQL Server / Docker)',
      'Install steps',
      'Database configuration',
      'How to run the web app',
      'How to run the tests + expected result',
      'Folder structure (where code and tests live)',
      'Troubleshooting (known errors and fixes)',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.t': TT[1], 'r1.t': TT[2], 'r2.t': TT[1], 'r3.t': TT[0], 'r4.t': TT[0], 'r5.t': TT[1], 'r6.t': TT[2], 'r7.t': TT[2] },
    giaiThich: giai('“Our SWT301 project” names no stack; “Install everything” and “TODO” are headings without content; database and run steps are concrete and work; prerequisites, structure and troubleshooting do not exist.', '"Our SWT301 project" không nói công nghệ; "Install everything" và "TODO" là tiêu đề rỗng ruột; phần CSDL và chạy cụ thể và dùng được; điều kiện cần, cấu trúc và xử lý lỗi không có.'),
  }],
  goiY: ['Một mục có tiêu đề nhưng nội dung không làm theo được ("Install everything", "TODO") = có nhưng không dùng được.', 'Mục cần phiên bản mà không có số phiên bản ⇒ chưa đủ.'],
  loiHayGap: ['Tính "có tiêu đề" là "có mục".', 'Quên mục kết quả mong đợi của test — người mới không biết 20 ca fail là bình thường hay là máy mình hỏng.'],
  giaiThich: { en: '<p>Unusable · Missing · Unusable · Usable · Usable · Unusable · Missing · Missing.</p>', vi: '<p>Không dùng được · Thiếu · Không dùng được · Dùng được · Dùng được · Không dùng được · Thiếu · Thiếu.</p>' },
  thuatNgu: [TN.readme, { en: 'prerequisites', vi: 'điều kiện cần cài trước' }, { en: 'troubleshooting', vi: 'xử lý sự cố thường gặp' }],
  khaiNiem: ['README'],
});

const MUC = ['What it is', 'Folder structure', 'Install / configure', 'Run the tests', 'Sample data / accounts', 'Known limitations'];
const G2 = phanLoai({
  tieuDe: 'Docs 2 — Which README section does each real line belong to?',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>These lines come from the README the owner finally wrote for SportShop (translated). Good READMEs are scanned, not read: a line in the wrong section is as lost as a missing line. Put each line where a newcomer would look for it.</p>',
    vi: '<p>Các dòng này lấy từ README mà chủ dự án cuối cùng viết cho SportShop (đã dịch). README tốt được lướt, không được đọc: một dòng đặt sai mục cũng mất như dòng không có. Đặt mỗi dòng vào chỗ người mới sẽ tìm.</p>',
  },
  cotCau: 'README line',
  cot: 'Section',
  luaChon: MUC,
  hang: [
    ['“A sport shop in Java Servlet/JSP (Jakarta EE 10, Tomcat 10.1) + SQL Server, a NetBeans (Ant) project.”', MUC[0]],
    ['“test/ — *Test = unit (Lab 2), *IT = integration (Lab 3); e2e/ — Lab 4 Playwright scripts.”', MUC[1]],
    ['“macOS has no SQL Server: run it in Docker with bash scripts/mac-sqlserver.sh.”', MUC[2]],
    ['“bash scripts/test.sh unit ⇒ expect 113 tests found, 93 successful, 20 failed.”', MUC[3]],
    ['“10 sample users are created by db/sportshop.sql (admin and customers, passwords in the table).”', MUC[4]],
    ['“The team does NOT change business code; FAILED tests are real defects with SS-xx tickets.”', MUC[5]],
    ['“node postman/run-round.js 1 runs Lab 3 round 1 with Newman and writes bao-cao/lab3/postman/R1/.”', MUC[3]],
  ],
  giaiBang: ['Note the test line states the EXPECTED result — that single number saves a newcomer an hour of “is my machine broken?”.', 'Để ý dòng chạy test ghi kết quả MONG ĐỢI — một con số đó tiết kiệm cho người mới cả giờ "máy mình hỏng à?".'],
  goiY: ['Lệnh chạy test (unit hay Postman) đều thuộc mục chạy test.', '"Nhóm không sửa nghiệp vụ, fail là lỗi thật" là giới hạn/quy ước của dự án.'],
  loiHayGap: ['Đặt lệnh Docker vào mục chạy test thay vì cài đặt.', 'Bỏ dòng "kết quả mong đợi" vì nghĩ thừa.'],
  giaiThich: '<p>What it is · Structure · Install · Tests · Sample data · Limitations · Tests.</p>',
  thuatNgu: [TN.readme, { en: 'expected output', vi: 'kết quả mong đợi khi chạy lệnh' }],
  khaiNiem: ['README'],
});

const G3 = tracNghiem({
  tieuDe: 'Docs 3 — Pick the commit message (Conventional Commits)',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p><b>Conventional Commits</b>: <code>type(scope): summary</code> — type is <code>feat</code> (new behaviour), <code>fix</code> (bug fix), <code>test</code>, <code>docs</code>, <code>refactor</code> (no behaviour change), <code>chore</code> (build, tooling); the summary is imperative (“add”, not “added”), specific, about 50–72 characters, and can carry the ticket id. Pick the best message for each change.</p>',
    vi: '<p><b>Conventional Commits</b>: <code>type(scope): mô tả</code> — type là <code>feat</code> (hành vi mới), <code>fix</code> (sửa lỗi), <code>test</code>, <code>docs</code>, <code>refactor</code> (không đổi hành vi), <code>chore</code> (build, công cụ); mô tả ở thể mệnh lệnh ("add", không "added"), cụ thể, khoảng 50–72 ký tự, có thể kèm mã ticket. Chọn message tốt nhất cho mỗi thay đổi.</p>',
  },
  cau: [
    { en: 'You added the 22 integration tests of module A.', vi: 'Bạn thêm 22 integration test của module A.', lc: [['a', 'update'], ['b', 'test(auth): add 22 integration cases IT01–IT22 for module A'], ['c', 'Added tests!!!'], ['d', 'feat: tests']], dap: 'b', giai: ['Type test, scope, imperative, specific count and ids.', 'Type test, phạm vi, mệnh lệnh, số lượng và mã cụ thể.'] },
    { en: 'You fixed the guest NullPointerException in AuthFilter.', vi: 'Bạn sửa NullPointerException của khách trong AuthFilter.', lc: [['a', 'fix bug'], ['b', 'fix(auth): redirect guests instead of throwing NPE in AuthFilter (SS-19)'], ['c', 'AuthFilter'], ['d', 'refactor: AuthFilter']], dap: 'b', giai: ['fix + what the user now gets + the ticket. refactor would claim “no behaviour change”, which is false.', 'fix + người dùng giờ nhận gì + ticket. refactor nghĩa là "không đổi hành vi" — sai.'] },
    { en: 'You documented the Postman/Newman steps in the README.', vi: 'Bạn viết hướng dẫn Postman/Newman vào README.', lc: [['a', 'docs(readme): add Postman/Newman steps for Lab 3 rounds'], ['b', 'readme'], ['c', 'feat(readme): Postman'], ['d', 'WIP']], dap: 'a', giai: ['Documentation only ⇒ docs.', 'Chỉ tài liệu ⇒ docs.'] },
    { en: 'You renamed variables in UserDAO; behaviour is identical and all tests still give 93/20.', vi: 'Bạn đổi tên biến trong UserDAO; hành vi y nguyên, test vẫn 93/20.', lc: [['a', 'fix(dao): clean code'], ['b', 'refactor(dao): rename UserDAO locals for readability, no behaviour change'], ['c', 'feat(dao): better DAO'], ['d', 'changes']], dap: 'b', giai: ['refactor = same behaviour; saying so explicitly helps reviewers.', 'refactor = cùng hành vi; nói rõ giúp người review.'] },
    { en: 'You moved JaCoCo jars to lib/test and updated build.xml.', vi: 'Bạn chuyển jar JaCoCo sang lib/test và sửa build.xml.', lc: [['a', 'chore(build): move JaCoCo jars to lib/test and update build.xml'], ['b', 'feat: jacoco'], ['c', 'fix: build'], ['d', 'final version']], dap: 'a', giai: ['Build/tooling with no product behaviour ⇒ chore (or build).', 'Build/công cụ, không đổi hành vi sản phẩm ⇒ chore (hoặc build).'] },
    { en: 'You added CSV export of the test statistics.', vi: 'Bạn thêm xuất CSV thống kê test.', lc: [['a', 'feat(report): export test statistics as CSV'], ['b', 'Added a new feature'], ['c', 'chore: csv'], ['d', 'test(report): csv']], dap: 'a', giai: ['New user-visible behaviour ⇒ feat.', 'Hành vi mới người dùng thấy ⇒ feat.'] },
  ],
  goiY: ['Có đổi hành vi không? Không ⇒ refactor/chore/docs/test; có, sửa lỗi ⇒ fix; có, mới ⇒ feat.', 'Mô tả bắt đầu bằng động từ mệnh lệnh: add, fix, move, rename, export.'],
  loiHayGap: ['Message "update", "fix bug", "final" — sau một tuần không ai biết commit làm gì.', 'Gắn refactor cho một commit có sửa hành vi.'],
  thuatNgu: [TN.conventional, { en: 'imperative mood', vi: 'thể mệnh lệnh — "add", "fix"' }, { en: 'scope', vi: 'phạm vi trong ngoặc: (auth), (dao), (readme)' }],
  khaiNiem: ['commit messages'],
});

const G4 = tracNghiem({
  tieuDe: 'Docs 4 — Pull request and issue titles that work',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>A pull request is read by someone who did not write the code and has ten minutes. Its title says what changes; its description says <b>why</b>, <b>what</b>, and <b>how it was tested</b>. An issue title names the observed problem and where it happens. (Writing full defect reports is practised in SWT301 Code Lab; here you only pick titles and PR content.)</p>',
    vi: '<p>Pull request được đọc bởi người không viết code và chỉ có mười phút. Tiêu đề nói thay đổi gì; mô tả nói <b>vì sao</b>, <b>làm gì</b>, và <b>đã kiểm thế nào</b>. Tiêu đề issue nêu vấn đề quan sát được và nơi xảy ra. (Viết defect report đầy đủ đã có ở Code Lab SWT301; ở đây chỉ chọn tiêu đề và nội dung PR.)</p>',
  },
  cau: [
    { en: 'Best PR title for the SS-28 fix', vi: 'Tiêu đề PR tốt nhất cho bản sửa SS-28', lc: [['a', 'Fix'], ['b', 'Take the profile owner from the session, not the form (SS-28)'], ['c', 'Changes to UpdateProfileServlet and UserDAO and some other files'], ['d', 'Please review my code']], dap: 'b', giai: ['Behaviour-level title + ticket. File lists belong in the description.', 'Tiêu đề ở mức hành vi + ticket. Danh sách tệp để trong mô tả.'] },
    { en: 'Which “How tested” section is useful?', vi: 'Mục "How tested" nào hữu ích?', lc: [['a', '“Tested, works.”'], ['b', '“bash scripts/test.sh it → 22 found, 17 pass, 5 fail (IT17 now passes); IT17 re-run 3× on a clean DB.”'], ['c', '“I tested everything carefully.”'], ['d', 'Empty']], dap: 'b', giai: ['Command + numbers before/after + the specific case that changed.', 'Lệnh + số trước/sau + đúng ca thay đổi.'] },
    { en: 'Best issue title', vi: 'Tiêu đề issue tốt nhất', lc: [['a', 'Bug!!!'], ['b', 'Logout from /profile returns HTTP 405 (POST not supported by LogoutServlet)'], ['c', 'Logout not working sometimes'], ['d', 'Problem with the website']], dap: 'b', giai: ['Action, place, observed result, and the cause if already known.', 'Thao tác, vị trí, kết quả quan sát, và nguyên nhân nếu đã biết.'] },
    { en: 'What must a PR description NOT do?', vi: 'Mô tả PR KHÔNG được làm gì?', lc: [['a', 'Link the issue it closes'], ['b', 'Hide that one test still fails'], ['c', 'List risks and how to roll back'], ['d', 'Include a screenshot of the changed page']], dap: 'b', giai: ['Reviewers decide based on the description; hiding a red test is the fastest way to lose their trust.', 'Người review quyết dựa trên mô tả; giấu một test đỏ là cách nhanh nhất mất lòng tin.'] },
    { en: 'A feature request title', vi: 'Tiêu đề yêu cầu tính năng', lc: [['a', 'Feature'], ['b', 'Let customers reset a forgotten password by e-mail link (currently /reset is 404)'], ['c', 'Make the site better'], ['d', 'Urgent!!!']], dap: 'b', giai: ['Who, what capability, and the current state.', 'Ai, khả năng gì, và hiện trạng.'] },
  ],
  goiY: ['Tiêu đề tốt đọc riêng vẫn hiểu thay đổi/vấn đề.', '"How tested" = lệnh + con số.'],
  loiHayGap: ['Tiêu đề PR là danh sách tệp.', 'Giấu ca test còn đỏ trong mô tả PR.'],
  thuatNgu: [TN.pr, { en: 'issue', vi: 'phiếu việc/lỗi trên GitHub/Jira/CT Work' }, { en: 'rollback', vi: 'quay lại bản trước khi bản mới hỏng' }],
  khaiNiem: ['pull requests', 'issues'],
});

const G5 = sapXep({
  tieuDe: 'Docs 5 — Order a PR description and a commit message',
  doKho: 'MEDIUM', phut: 5,
  moTa: {
    en: '<p>Reviewers read top-down and stop when they have enough. So the PR description starts with the one-paragraph <b>why + what</b>, then the details a reviewer checks, then the safety net. A commit message has a fixed anatomy that tools (git log, changelog generators) depend on. Order both.</p>',
    vi: '<p>Người review đọc từ trên xuống và dừng khi đủ. Vậy mô tả PR mở bằng một đoạn <b>vì sao + làm gì</b>, rồi chi tiết người review cần kiểm, rồi lưới an toàn. Commit message có cấu trúc cố định mà công cụ (git log, bộ sinh changelog) dựa vào. Sắp cả hai.</p>',
  },
  cau: [
    {
      en: 'PR description', vi: 'Mô tả PR',
      dung: ['Summary: why and what in 2–3 sentences, with “Closes #28”', 'Changes: bullet list by file or area', 'How tested: commands and results (before → after)', 'Screenshots / evidence of the changed behaviour', 'Risks and how to roll back', 'Reviewer checklist / open questions'],
      giai: ['Context first, verification in the middle, safety at the end.', 'Bối cảnh trước, kiểm chứng ở giữa, an toàn ở cuối.'],
    },
    {
      en: 'Commit message anatomy', vi: 'Cấu trúc một commit message',
      dung: ['Subject: type(scope): imperative summary, ≤ 72 characters', 'A blank line', 'Body: why the change was needed and what it does', 'Footer: Refs/Closes ticket, BREAKING CHANGE if any'],
      giai: ['git uses the first line as the title; the blank line separates title from body; footers are machine-readable.', 'git lấy dòng đầu làm tiêu đề; dòng trống tách tiêu đề với thân; footer cho máy đọc.'],
    },
  ],
  goiY: ['Thứ người review cần đầu tiên là vì sao và làm gì.', 'Commit: tiêu đề — dòng trống — thân — footer.'],
  loiHayGap: ['Mở mô tả PR bằng danh sách tệp.', 'Viết thân commit ngay dưới tiêu đề, không có dòng trống — git gộp thành một tiêu đề dài.'],
  thuatNgu: [TN.pr, TN.conventional, { en: 'footer', vi: 'phần cuối commit: Refs/Closes, BREAKING CHANGE' }],
  khaiNiem: ['PR description', 'commit anatomy'],
});

export default moDun({
  slug: 'ssg105-3-3-readme-commit-pr',
  ten: '3.3 README, commits, pull requests and issue titles',
  moTaModule: 'Soi một README tồi (mục nào thiếu, mục nào có mà không dùng được), xếp các dòng README thật của SportShop vào đúng mục, chọn commit message theo Conventional Commits, tiêu đề PR/issue và mục "How tested", sắp mô tả PR và cấu trúc commit.',
  baiHoc: 'ssg105-3-1-writing',
  de: [G1, G2, G3, G4, G5],
});
