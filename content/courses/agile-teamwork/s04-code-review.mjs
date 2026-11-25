/**
 * Chương 4 — Code review (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s04/; ./s04/_ma.mjs là tệp SINH (mã + output thật: Node 22.22.2, git 2.55.0, Java 25, PostgreSQL 16, GCC 16.1.1)
 * bởi scratchpad/agt/lab/ch4/tao-ma.mjs. Slug + title 4 bài cũ GIỮ NGUYÊN theo khung (agl-4-1 … agl-4-4);
 * thêm agl-4-5-lab và agl-4-6-quiz (đã thêm vào khung trong ../agile-teamwork.mjs).
 */
import { Q } from './_chung.mjs';
import B1 from './s04/b1-muc-dich.mjs';
import B2 from './s04/b2-viet-review.mjs';
import B3 from './s04/b3-nhan-review.mjs';
import B4 from './s04/b4-checklist.mjs';
import B5 from './s04/b5-lab.mjs';

const QUIZ4 = [
  Q('agl4-1', 'According to Bacchelli & Bird (Microsoft, 2013), what do modern code reviews mostly deliver besides finding defects?|||Theo Bacchelli & Bird (Microsoft, 2013), ngoài bắt lỗi, review hiện đại chủ yếu mang lại gì?', [
    'Faster compilation|||Biên dịch nhanh hơn',
    'Knowledge transfer, team awareness and alternative solutions|||Truyền kiến thức, hiểu biết chung của nhóm và lời giải thay thế',
    'Higher LOC per person|||LOC mỗi người cao hơn',
    'Fewer meetings|||Ít họp hơn',
  ], 1, 'Reviews are "less about defects than expected". For SWP391: two people can explain every screen. Lesson 4.1.|||Review "ít liên quan tới lỗi hơn kỳ vọng". Với SWP391: hai người giải thích được mọi màn. Bài 4.1.'),
  Q('agl4-2', 'In the simulation, the leader reviews every PR and has three exam days in a busy iteration. What happened?|||Trong mô phỏng, trưởng nhóm review mọi PR và có ba ngày thi trong một iteration bận. Chuyện gì xảy ra?', [
    'Nothing changed — the leader caught up|||Không có gì thay đổi — trưởng nhóm đuổi kịp',
    'Median wait 9 days and 13/30 PRs missed the deadline, while rotation barely noticed|||Chờ trung vị 9 ngày và 13/30 PR trễ hạn, trong khi cách xoay vòng gần như không bị ảnh hưởng',
    'Rotation was slower than the leader|||Xoay vòng chậm hơn trưởng nhóm',
    'All PRs were merged on the last day|||Mọi PR được merge vào ngày cuối',
  ], 1, 'One reviewer is a single point of failure. Lesson 4.1.|||Một người review là điểm chết duy nhất. Bài 4.1.'),
  Q('agl4-3', 'C2 writes "sai rồi, sửa đi" on the leader’s SQL concatenation and approves "to make the demo". What is the main problem?|||C2 viết "sai rồi, sửa đi" ở chỗ nối chuỗi SQL của trưởng nhóm rồi duyệt "cho kịp demo". Vấn đề chính là gì?', [
    'The comment is too long|||Nhận xét quá dài',
    'No label, no evidence, no proposal — and APPROVE lets the leader merge a known hole|||Không nhãn, không bằng chứng, không đề xuất — và APPROVE cho phép trưởng nhóm merge một lỗ hổng đã biết',
    'Members should not review the leader|||Thành viên không nên review trưởng nhóm',
    'It should have been a nitpick|||Lẽ ra phải là nitpick',
  ], 1, 'issue (blocking) + evidence + proposal ⇒ Request changes. Lesson 4.2.|||issue (blocking) + bằng chứng + đề xuất ⇒ Request changes. Bài 4.2.'),
  Q('agl4-4', 'Which Conventional Comments label must never block a merge?|||Nhãn Conventional Comments nào không bao giờ được chặn merge?', [
    'issue|||issue',
    'todo|||todo',
    'nitpick|||nitpick',
    'suggestion (blocking)|||suggestion (blocking)',
  ], 2, 'Nitpicks are trivial preferences, non-blocking by nature. Lesson 4.2.|||Nitpick là sở thích nhỏ, bản chất không chặn. Bài 4.2.'),
  Q('agl4-5', 'An author replies "ok" and resolves a blocking thread themselves. Why does tra-loi.mjs report an error?|||Tác giả trả lời "ok" và tự đóng một luồng chặn. Vì sao tra-loi.mjs báo lỗi?', [
    'Replies must be in English|||Trả lời phải bằng tiếng Anh',
    'Blocking threads are closed by the reviewer after checking the fix; "ok" gives no commit to check|||Luồng chặn do người review đóng sau khi kiểm bản sửa; "ok" không cho commit nào để kiểm',
    'Threads can only be closed by the leader|||Chỉ trưởng nhóm được đóng luồng',
    'The author must force-push first|||Tác giả phải force-push trước',
  ], 1, 'Reply "Fixed in <hash>" and let the reviewer resolve. Lesson 4.3.|||Trả lời "Đã sửa ở <hash>" và để người review đóng. Bài 4.3.'),
  Q('agl4-6', 'Author and reviewer have argued five rounds in a thread about 401 vs 200. Next step?|||Tác giả và người review đã cãi năm lượt trong một luồng về 401 hay 200. Bước tiếp?', [
    'Whoever is more senior wins|||Ai lâu năm hơn thì thắng',
    'Stop typing, call for 10 minutes, write the conclusion in the thread; if stuck, use the agreed tie-breakers|||Dừng gõ, gọi 10 phút, ghi kết luận vào luồng; nếu kẹt, dùng luật phân xử đã thống nhất',
    'Close the PR|||Đóng PR',
    'Ask the lecturer to decide|||Nhờ giảng viên quyết',
  ], 1, 'AC/BR → team agreement → a third person; never taste. Lesson 4.3.|||AC/BR → thoả thuận nhóm → người thứ ba; không bao giờ là sở thích. Bài 4.3.'),
  Q('agl4-7', 'Why is IDOR the bug reviewers miss most often?|||Vì sao IDOR là lỗi người review bỏ sót nhiều nhất?', [
    'It only exists in old Java versions|||Nó chỉ có ở Java cũ',
    'The bug is a missing condition — nothing in the diff looks wrong; you find it by calling as user A with user B’s id|||Lỗi là một điều kiện vắng mặt — không gì trong diff trông sai; bạn tìm ra bằng cách gọi với tư cách người A bằng id của người B',
    'Linters always catch it|||Linter luôn bắt được',
    'It only happens with SQL injection|||Nó chỉ xảy ra cùng SQL injection',
  ], 1, 'In PR #31, An read booking 102 of Bình with its private note. Lesson 4.4.|||Ở PR #31, An đọc được lịch 102 của Bình kèm ghi chú riêng. Bài 4.4.'),
  Q('agl4-8', 'Why does the fixed API return 404, not 403, when An asks for Bình’s booking?|||Vì sao API đã sửa trả 404, không phải 403, khi An hỏi lịch của Bình?', [
    '404 is faster|||404 nhanh hơn',
    '403 would confirm the id exists, helping enumeration; 404 reveals nothing|||403 xác nhận id đó tồn tại, giúp dò tìm; 404 không tiết lộ gì',
    'Spring Boot cannot return 403|||Spring Boot không trả được 403',
    'The lab manager also gets 404|||Quản lý lab cũng nhận 404',
  ], 1, 'And users who are allowed (lab manager, BR-07) still get 200. Lesson 4.4.|||Và người được phép (quản lý lab, BR-07) vẫn nhận 200. Bài 4.4.'),
  Q('agl4-9', 'What would have caught Apple’s "goto fail" (CVE-2014-1266) besides human review?|||Ngoài con người review, thứ gì đã có thể bắt lỗi "goto fail" của Apple (CVE-2014-1266)?', [
    'A faster compiler|||Trình biên dịch nhanh hơn',
    'Compiler warnings such as -Wmisleading-indentation in CI, and a test that a bad signature is rejected|||Cảnh báo trình biên dịch như -Wmisleading-indentation trong CI, và một test rằng chữ ký sai bị từ chối',
    'Squash merging|||Squash merge',
    'Code owners|||Code owners',
  ], 1, 'In the rebuilt version, gcc -Wall pointed at the duplicated line. Lesson 4.4.|||Ở bản dựng lại, gcc -Wall chỉ thẳng vào dòng lặp. Bài 4.4.'),
  Q('agl4-10', 'PR #33 was approved by C1, then C2 pushed another commit. With the LabFlow protection rules, what happens?|||PR #33 được C1 duyệt, rồi C2 đẩy thêm một commit. Với luật bảo vệ của LabFlow, chuyện gì xảy ra?', [
    'It can merge — it was approved|||Merge được — đã được duyệt rồi',
    'The approval is dismissed as stale; C1 re-reviews the new commit (and the open thread must be resolved)|||Lượt duyệt bị bỏ vì đã cũ; C1 review lại commit mới (và luồng đang mở phải được đóng)',
    'GitHub deletes the branch|||GitHub xoá nhánh',
    'C2 must open a new PR|||C2 phải mở PR mới',
  ], 1, '"Dismiss stale pull request approvals when new commits are pushed": an approval covers only code that was read. Lesson 4.5.|||"Dismiss stale pull request approvals when new commits are pushed": lượt duyệt chỉ bao phủ phần mã đã được đọc. Bài 4.5.'),
];

export default {
  title: 'Chapter 4 — Code review|||Chương 4 — Code review',
  description: 'Code review nhìn từ vai trưởng nhóm, chạy thật trên PR của chính trưởng nhóm LabFlow: review để cùng hiểu và mô phỏng ba cách chia người review; viết nhận xét có nhãn, bằng chứng, đề xuất và làm cho việc chặn trưởng nhóm an toàn; nhận góp ý, kết thúc bất đồng, xử lý người review khó; checklist theo ưu tiên với IDOR/SQL injection tấn công thật trên PostgreSQL và goto fail dựng lại; lab mốc dự án: CODEOWNERS, xoay vòng cả kỳ, luật bảo vệ main.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'agl-4-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: review để làm gì, điểm chết "trưởng nhóm duyệt hết", nhận xét không nhãn + APPROVE, nitpick, tự đóng luồng chặn, cãi quá hai lượt, vì sao IDOR khó thấy, 404 thay 403, goto fail, duyệt cũ bị bỏ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the real runs of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các lần chạy thật trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ4 },
    },
  ],
};
