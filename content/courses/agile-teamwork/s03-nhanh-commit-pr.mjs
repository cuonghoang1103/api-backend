/**
 * Chương 3 — Nhánh, commit và pull request (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s03/; ./s03/_ma.mjs là tệp SINH (mã + output thật: git 2.55.0, Node 22.22.2, Java 25, Flyway 12.4.0,
 * PostgreSQL 16) bởi scratchpad/agt/lab/ch3/tao-ma.mjs. Slug + title 4 bài cũ GIỮ NGUYÊN theo khung (agl-3-1 … agl-3-4);
 * thêm agl-3-5-lab và agl-3-6-quiz (đã thêm vào khung trong ../agile-teamwork.mjs).
 */
import { Q } from './_chung.mjs';
import B1 from './s03/b1-quy-uoc.mjs';
import B2 from './s03/b2-pr-tot.mjs';
import B3 from './s03/b3-ci.mjs';
import B4 from './s03/b4-merge.mjs';
import B5 from './s03/b5-lab.mjs';

const QUIZ3 = [
  Q('agl3-1', 'Why does LabFlow put the ticket ID (LF-21) as the scope of every commit message?|||Vì sao LabFlow đặt mã ticket (LF-21) làm scope của mọi lời nhắn commit?', [
    'Conventional Commits requires the scope to be a ticket ID|||Conventional Commits bắt buộc scope phải là mã ticket',
    'So Git, CT Work and the grading sheet all point at the same thing: commits can be traced to a ticket, a screen and its owner|||Để Git, CT Work và sheet chấm điểm cùng trỏ một thứ: commit lần được về ticket, màn và chủ màn',
    'Because GitHub rejects commits without a scope|||Vì GitHub từ chối commit không có scope',
    'To make commit messages shorter|||Để lời nhắn commit ngắn hơn',
  ], 1, 'The scope is a team choice on top of the standard; LabFlow chose traceability. Lesson 3.1.|||Scope là lựa chọn của nhóm đặt trên chuẩn chung; LabFlow chọn truy vết. Bài 3.1.'),
  Q('agl3-2', 'C5 reinstalled their laptop and a commit "xong màn báo hỏng" reached the branch. What caught it?|||C5 cài lại máy và commit "xong màn báo hỏng" lọt lên nhánh. Cái gì bắt được nó?', [
    'The commit-msg hook|||Hook commit-msg',
    'Step 1 of CI, which re-checks every commit of the branch on the server side|||Bước 1 của CI, soát lại mọi commit của nhánh ở phía máy chủ',
    'Git itself|||Chính Git',
    'Nothing; it was only noticed at the demo|||Không gì cả; tới buổi demo mới thấy',
  ], 1, 'core.hooksPath was not set on the new clone, so the hook never ran. Hooks are convenience; the required CI check is the rule. Lesson 3.1.|||Bản clone mới chưa đặt core.hooksPath nên hook không chạy. Hook là tiện lợi; check CI bắt buộc mới là luật. Bài 3.1.'),
  Q('agl3-3', 'C4’s branch has CI green, 495 changed lines (452 generated INSERTs), two screens and 10 formatting-only lines in menu.js. What should happen?|||Nhánh của C4 CI xanh, 495 dòng đổi (452 dòng INSERT sinh ra), hai màn và 10 dòng chỉ đổi định dạng trong menu.js. Nên làm gì?', [
    'Merge it — CI is green|||Merge — CI xanh rồi',
    'Split: one PR for S30, one for S31, demo data as a separate seed PR, and drop the reformat|||Tách: một PR cho S30, một cho S31, dữ liệu mẫu thành PR seed riêng, bỏ phần định dạng lại',
    'Ask two reviewers instead of one|||Nhờ hai người review thay vì một',
    'Squash the commits into one before opening the PR|||Gộp các commit thành một trước khi mở PR',
  ], 1, 'Green CI says nothing about whether a human can review it; the reformat also creates conflicts for everyone. Lesson 3.2.|||CI xanh không nói gì về chuyện con người review nổi hay không; phần định dạng lại còn tạo xung đột cho cả nhóm. Bài 3.2.'),
  Q('agl3-4', 'What does the xz-utils backdoor (CVE-2024-3094, disclosed 29/03/2024) teach about code review?|||Cửa hậu xz-utils (CVE-2024-3094, công bố 29/03/2024) dạy gì về code review?', [
    'Open source cannot be trusted|||Không thể tin mã nguồn mở',
    'Reviewers tend to skip generated, binary and test-fixture files — the payload was hidden in binary test files|||Người review hay bỏ qua tệp sinh tự động, nhị phân và dữ liệu test — mã độc giấu trong tệp test nhị phân',
    'Only senior developers should review|||Chỉ senior mới được review',
    'Compression libraries are dangerous|||Thư viện nén nguy hiểm',
  ], 1, 'Keep generated files out of feature PRs and review them deliberately. Lesson 3.2.|||Tách tệp sinh tự động khỏi PR tính năng và review chúng có chủ đích. Bài 3.2.'),
  Q('agl3-5', 'PR #1 (V3__dat_lich.sql) and PR #2 (V3__muon_tra.sql) are both green and touch different files. #2 merges, then #1 merges. What happens on main?|||PR #1 (V3__dat_lich.sql) và PR #2 (V3__muon_tra.sql) đều xanh và chạm các tệp khác nhau. #2 merge, rồi #1 merge. Điều gì xảy ra trên main?', [
    'Git reports a merge conflict|||Git báo xung đột merge',
    'Nothing; Flyway runs both|||Không sao; Flyway chạy cả hai',
    'Main goes red: Flyway "Found more than one migration with version 3" — a semantic conflict Git cannot see|||Main đỏ: Flyway "Found more than one migration with version 3" — xung đột ngữ nghĩa mà Git không thấy',
    'GitHub refuses to merge #1|||GitHub từ chối merge #1',
  ], 2, 'With checks in loose mode, #1’s green result was computed on an older main. Lesson 3.3.|||Khi check ở chế độ loose, kết quả xanh của #1 được tính trên main cũ. Bài 3.3.'),
  Q('agl3-6', 'Which setting makes the tested commit the same as the merged commit?|||Ô cài đặt nào làm commit được kiểm cũng là commit được merge?', [
    'Require a pull request before merging|||Require a pull request before merging',
    'Require branches to be up to date before merging (or a merge queue)|||Require branches to be up to date before merging (hoặc merge queue)',
    'Automatically delete head branches|||Automatically delete head branches',
    'Allow squash merging|||Allow squash merging',
  ], 1, 'GitHub calls it "strict"; a merge queue gives the same guarantee without asking authors to update. Lesson 3.3.|||GitHub gọi là "strict"; merge queue cho cùng bảo đảm mà không bắt tác giả tự cập nhật. Bài 3.3.'),
  Q('agl3-7', 'The shared demo database is at version 4. Someone runs git revert on the PR that added V4__ngay_nghi.sql. What does Flyway do on the next start?|||CSDL demo dùng chung đang ở phiên bản 4. Ai đó git revert PR đã thêm V4__ngay_nghi.sql. Lần khởi động sau Flyway làm gì?', [
    'Drops the table ngay_nghi|||Xoá bảng ngay_nghi',
    'Fails with "Detected resolved migration not applied"|||Báo lỗi "Detected resolved migration not applied"',
    'Applies 0 migrations silently; the table stays and the database still says version 4|||Lặng lẽ áp 0 migration; bảng vẫn còn và CSDL vẫn ghi phiên bản 4',
    'Re-creates the file from its history table|||Tạo lại tệp từ bảng lịch sử',
  ], 2, 'Migrations only move forward: undo with a new migration (V5__xoa_ngay_nghi.sql). Lesson 3.3.|||Migration chỉ đi tới: hoàn tác bằng migration mới (V5__xoa_ngay_nghi.sql). Bài 3.3.'),
  Q('agl3-8', 'A CI step runs "node --test … | grep … | head -8" and reports success although a test failed. Why?|||Một bước CI chạy "node --test … | grep … | head -8" và báo thành công dù test hỏng. Vì sao?', [
    'node --test ignores syntax errors|||node --test bỏ qua lỗi cú pháp',
    'The exit code of a pipeline is the last command’s (head); set -o pipefail fixes it|||Mã thoát của ống lệnh là của lệnh cuối (head); set -o pipefail sửa được',
    'grep removes the error|||grep xoá mất lỗi',
    'CI caches the previous result|||CI dùng lại kết quả lần trước',
  ], 1, 'CI is code — break something on purpose to prove each check can go red. Lesson 3.3.|||CI cũng là code — cố ý làm hỏng để chứng minh mỗi bước kiểm có thể chuyển đỏ. Bài 3.3.'),
  Q('agl3-9', 'C2’s PR conflicts with C1’s merged PR in dat-lich/routes.js. Both added a route for different screens. Best action?|||PR của C2 xung đột với PR đã merge của C1 ở dat-lich/routes.js. Cả hai thêm route cho hai màn khác nhau. Làm gì là tốt nhất?', [
    'Delete the three marker lines and keep everything|||Xoá ba dòng đánh dấu và giữ hết',
    'Accept theirs for the whole file|||Accept theirs cho cả tệp',
    'C2 resolves by meaning (one import list, one array, both routes), confirms with C1, runs CI|||C2 giải theo nghĩa (một danh sách import, một mảng, đủ hai route), xác nhận với C1, chạy CI',
    'Ask C1 to revert so C2 can merge first|||Nhờ C1 revert để C2 merge trước',
  ], 2, 'Deleting the markers produced two "export default [" — CI went red. Lesson 3.4.|||Xoá dấu đánh dấu sinh ra hai "export default [" — CI chuyển đỏ. Bài 3.4.'),
  Q('agl3-10', 'tep-nong.mjs shows menu.js touched by 5 people and routes.js by 4. What does the leader do at the next planning?|||tep-nong.mjs cho thấy menu.js bị 5 người sửa và routes.js bị 4 người. Trưởng nhóm làm gì ở buổi planning tới?', [
    'Forbid everyone except the leader from editing those files forever|||Cấm vĩnh viễn mọi người trừ trưởng nhóm sửa hai tệp đó',
    'Open one small PR that registers every planned route and menu item with placeholder pages, so members only edit their own pages|||Mở một PR nhỏ đăng ký sẵn mọi route và mục menu đã lên kế hoạch kèm trang giữ chỗ, để thành viên chỉ sửa trang của mình',
    'Switch from squash to merge commits|||Đổi từ squash sang merge commit',
    'Ask members to merge at night when nobody else works|||Bảo thành viên merge vào ban đêm khi không ai làm',
  ], 1, 'Same day, same branches: 0 conflicts and C2’s diff was exactly one file. Lesson 3.4.|||Cùng ngày, cùng nhánh: 0 xung đột và diff của C2 đúng một tệp. Bài 3.4.'),
];

export default {
  title: 'Chapter 3 — Branches, commits and pull requests|||Chương 3 — Nhánh, commit và pull request',
  description: 'Quy trình Git của đội nhìn từ vai trưởng nhóm, chạy thật trên repo LabFlow 5 người: quy ước nhánh/commit theo ticket và báo cáo đóng góp theo màn; PR nhỏ + script tự soát; CI nhóm (commit, test, thứ tự migration, Flyway trên PostgreSQL) và ba lần dấu xanh nói dối; xung đột, tệp nóng, PR khung ở planning, chính sách squash; lab mốc dự án và diễn tập cả nhóm.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra Chương 3',
      slug: 'agl-3-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: scope là mã ticket, hook vs CI, PR to dù CI xanh, bài học xz 2024, hai migration V3, nhánh phải cập nhật, revert migration trên CSDL dùng chung, ống lệnh nuốt mã thoát, giải xung đột theo nghĩa, tệp nóng và PR khung.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the real runs of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các lần chạy thật trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ3 },
    },
  ],
};
