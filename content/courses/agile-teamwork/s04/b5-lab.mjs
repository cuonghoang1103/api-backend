/**
 * 4.5 — Lab: một ngày review của LabFlow (agl-4-5-lab). Soạn 24/11/2026, agent agt. Bài MỚI (thêm vào khung).
 * Mốc dự án chương 4: CODEOWNERS + bảng xoay vòng cả kỳ + luật bảo vệ main bật review + docs/review.md + 4 script review
 * (soat-diff, loc-nhan-xet, tra-loi, kiem-duyet) — output thật qua ./_ma.mjs (scratchpad/agt/lab/ch4).
 * Tên ô cài đặt GitHub ("Require review from Code Owners", "Dismiss stale pull request approvals when new commits are pushed",
 * "Require conversation resolution before merging") đối chiếu GitHub Docs about-protected-branches 24/11; CODEOWNERS "dòng khớp sau cùng
 * thắng" đối chiếu about-code-owners 24/11.
 */
import { bang, cl, note, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const CAY = `labflow/
├── .github/CODEOWNERS               ← bài 4.5 (tệp chung, migration, ci có hai chủ)
├── .github/pull_request_template.md ← bài 3.2 (thêm dòng "Người review cần để ý")
├── docs/review.md                   ← bài 4.5 (thoả thuận review — bên dưới)
├── docs/xoay-vong.md                ← bài 4.5 (sinh bởi xoay-vong.mjs)
└── ci/
    ├── soat-diff.mjs                ← bài 4.4 (người review chạy trước khi đọc)
    ├── loc-nhan-xet.mjs             ← bài 4.2 (soát lượt review trước khi Submit)
    ├── tra-loi.mjs                  ← bài 4.3 (luồng nào đang chờ ai)
    └── kiem-duyet.mjs               ← bài 4.5 (mô phỏng luật bảo vệ main)`;

const THOA_THUAN = `# docs/review.md — Thoả thuận review của LabFlow (chốt ở planning sprint 1, sửa ở retro)
1. Ai review: theo docs/xoay-vong.md (đổi cặp mỗi tuần) + chủ trong CODEOWNERS khi PR chạm tệp chung/migration/ci.
   PR của trưởng nhóm được review như mọi PR khác.
2. Bao lâu: phản hồi lần đầu ≤ 1 ngày làm việc; tác giả trả lời mọi luồng ≤ 1 ngày làm việc.
   Không kịp ⇒ nói ở daily và nhờ người kế tiếp trong bảng xoay vòng.
3. Mỗi lượt review ≤ 60 phút / ≤ 400 dòng. PR to hơn ⇒ nhờ tách (bài 3.2).
4. Trước khi đọc: node ci/soat-diff.mjs. Khi đọc: checklist bài 4.4, mở ticket cạnh diff, thử ít nhất một ca tấn công cho API mới.
5. Nhận xét có nhãn Conventional Comments; có issue chặn ⇒ Request changes. Chạy ci/loc-nhan-xet.mjs trước khi Submit.
6. Tác giả: "Đã sửa ở <hash>" / "Không sửa vì … (LF-xx)" / câu hỏi. Không force-push trong lúc review.
   Luồng chặn do người review đóng.
7. Cãi quá 2 lượt ⇒ gọi 10 phút, ghi kết luận vào luồng. Kẹt ⇒ AC/BR → thoả thuận nhóm → người thứ ba; lặp lại ⇒ ADR.
8. Nói về mã, không về người. Chuyện thái độ ⇒ nói riêng với trưởng nhóm, đưa ra retro không nêu tên.`;

export const L45 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 4 · Lesson 4.5 · Lab', 'Chương 4 · Bài 4.5 · Lab', `
<h2>${t('4.5 — Lab: a review day on LabFlow', '4.5 — Lab: một ngày review của LabFlow')}</h2>
<p class="lead">${t(
    'This lab turns chapter 4 into rules and tools your real SWP391 repo keeps for the whole semester. You play three roles in one day — leader setting up the rules, reviewer, author — on the same PR #31, then end the day as the leader checking which of five PRs may merge. Every output below is from a real run; try each step before opening the answer.',
    'Lab này biến chương 4 thành luật và công cụ mà repo SWP391 thật của bạn giữ suốt kỳ. Bạn đóng ba vai trong một ngày — trưởng nhóm đặt luật, người review, tác giả — trên cùng PR #31, rồi kết thúc ngày bằng vai trưởng nhóm soát xem trong năm PR cái nào được merge. Mọi output dưới đây là chạy thật; hãy tự làm từng bước trước khi mở đáp án.')}</p>

<h3>🛠 ${t('Project milestone for chapter 4', 'Mốc dự án chương 4')}</h3>
<p>${t('By the end of this lab your repo has, in addition to chapter 3’s files:', 'Hết lab này, ngoài các tệp của chương 3, repo của bạn có thêm:')}</p>
${out(CAY)}
${note(t('Needed: Node 22, Git, Java 21+ and Docker only if you rerun the attack from 4.4. All four scripts use only Node’s standard library — copy them from lessons 4.2–4.5 into <code>ci/</code>.', 'Cần: Node 22, Git, Java 21+ và Docker chỉ khi bạn chạy lại đòn tấn công ở 4.4. Cả bốn script chỉ dùng thư viện chuẩn của Node — chép từ các bài 4.2–4.5 vào <code>ci/</code>.'))}

<h3>${t('Step 1 — Leader, morning: write the rules down', 'Bước 1 — Trưởng nhóm, buổi sáng: viết luật ra giấy')}</h3>
<p>${t('(a) Who reviews whom, all semester. The rotation from 4.1 (policy C) as a table you paste into <code>docs/xoay-vong.md</code>:', '(a) Ai review ai, cả kỳ. Bảng xoay vòng từ bài 4.1 (cách C) dưới dạng bảng để dán vào <code>docs/xoay-vong.md</code>:')}</p>
${js(MA.xoayVong)}
${out(RA.xoayVong)}
<p>${t('(b) Who <em>must</em> approve risky files. Two owners for every shared file, so even the leader’s change to the menu needs someone else. GitHub uses the <strong>last</strong> matching line, so specific paths go below general ones (', '(b) Ai <em>bắt buộc</em> phải duyệt tệp rủi ro. Mỗi tệp chung có hai chủ, để ngay cả thay đổi menu của trưởng nhóm cũng cần người khác duyệt. GitHub dùng dòng khớp <strong>sau cùng</strong>, nên đường dẫn cụ thể đặt dưới đường dẫn chung (')}${ng('https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners', 'GitHub Docs: About code owners')}).</p>
${out(MA.codeowners)}
<p>${t('(c) The agreement everyone reads at sprint planning:', '(c) Bản thoả thuận cả nhóm đọc ở buổi planning:')}</p>
${out(THOA_THUAN)}
<p>${t('(d) Branch protection on <code>main</code> (Settings → Branches), adding to chapter 3’s rule: ', '(d) Bảo vệ nhánh <code>main</code> (Settings → Branches), thêm vào luật của chương 3: ')}${ng('https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches', 'GitHub Docs: About protected branches')}</p>
${bang([t('Setting', 'Ô cài đặt'), t('Value', 'Giá trị'), t('Why', 'Vì sao')], [
    ['Require approvals', '1', t('One real reviewer per PR (the rotation).', 'Mỗi PR một người review thật (theo bảng xoay vòng).')],
    ['Require review from Code Owners', t('on', 'bật'), t('Shared files and migrations need their owner.', 'Tệp chung và migration cần chủ của chúng.')],
    ['Dismiss stale pull request approvals when new commits are pushed', t('on', 'bật'), t('An approval covers the code that was read, not code pushed afterwards.', 'Một lượt duyệt chỉ bao phủ phần mã đã được đọc, không bao phủ mã đẩy lên sau đó.')],
    ['Require conversation resolution before merging', t('on', 'bật'), t('No open blocking thread can be merged past.', 'Không thể merge khi còn luồng chặn đang mở.')],
    [t('Required status checks (chapter 3)', 'Required status checks (chương 3)'), t('ci', 'ci'), t('Unchanged.', 'Giữ nguyên.')],
  ])}

<h3>${t('Step 2 — Reviewer C2: review PR #31', 'Bước 2 — Người review C2: review PR #31')}</h3>
<p>${t('Week 1, so C2 reviews C1 (table above). Do it in this order and time yourself — target 45 minutes:', 'Tuần 1, nên C2 review C1 (bảng trên). Làm theo thứ tự này và bấm giờ — mục tiêu 45 phút:')}</p>
<ol>
<li>${t('<code>git diff origin/main... | node ci/soat-diff.mjs</code> — note what the machine flagged, and which flags are wrong.', '<code>git diff origin/main... | node ci/soat-diff.mjs</code> — ghi lại máy đánh dấu gì, và chỗ nào đánh dấu sai.')}</li>
<li>${t('Open ticket LF-23 next to the diff. For each acceptance criterion, find the line that implements it.', 'Mở ticket LF-23 cạnh diff. Với mỗi tiêu chí chấp nhận, tìm dòng mã thực hiện nó.')}</li>
<li>${t('Run the branch and try one attack per checklist item 2–4 (another user’s id, a quote mark, no login, an error).', 'Chạy nhánh và thử một đòn cho mỗi mục checklist 2–4 (id người khác, dấu nháy, không đăng nhập, gây lỗi).')}</li>
<li>${t('Write the review in the file format of 4.2, run <code>node ci/loc-nhan-xet.mjs</code> until it reports 0 errors, then submit with the matching verdict.', 'Viết lượt review theo định dạng tệp của bài 4.2, chạy <code>node ci/loc-nhan-xet.mjs</code> tới khi báo 0 lỗi, rồi gửi kèm phán quyết khớp.')}</li>
</ol>
${giai(t('Reference review and checks (from 4.2 and 4.4)', 'Lượt review và kết quả soát tham khảo (từ bài 4.2 và 4.4)'), `${out(RA.soatDiff.split('\n\n$ git diff --no-index v1')[0].split('\n\nPHẦN NGƯỜI')[0])}
${out(MA.c2v2)}
${out(RA.locNhanXet.split(/\n(?=\$ node loc-nhan-xet)/)[1])}
<p>${t('Did you find all three blocking issues? Most first attempts find the SQL injection (the machine points at it) and miss the IDOR (nothing to point at). If you missed it, that is the reason for checklist item 2.', 'Bạn có tìm được cả ba issue chặn không? Phần lớn lần thử đầu tìm ra SQL injection (máy đã chỉ vào nó) và bỏ sót IDOR (chẳng có gì để chỉ). Nếu bạn bỏ sót, đó chính là lý do của mục 2 trong checklist.')}</p>`)}

<h3>${t('Step 3 — Author C1: answer the review', 'Bước 3 — Tác giả C1: trả lời lượt review')}</h3>
<ol>
<li>${t('Wait 10 minutes. Reproduce each blocking finding on your machine before replying.', 'Chờ 10 phút. Tự chạy lại từng phát hiện chặn trên máy mình trước khi trả lời.')}</li>
<li>${t('Fix in a new commit on the branch; no force-push.', 'Sửa bằng một commit mới trên nhánh; không force-push.')}</li>
<li>${t('Reply to every thread (fixed in &lt;hash&gt; / not doing because + ticket / question), re-request review, then run <code>node ci/tra-loi.mjs</code>.', 'Trả lời mọi luồng (đã sửa ở &lt;hash&gt; / không sửa vì + ticket / câu hỏi), nhờ duyệt lại, rồi chạy <code>node ci/tra-loi.mjs</code>.')}</li>
</ol>
${giai(t('Reference result (from 4.3)', 'Kết quả tham khảo (từ bài 4.3)'), `${out(RA.commit)}
${out(RA.traLoi.split(/\n(?=\$ node tra-loi)/)[1])}`)}

<h3>${t('Step 4 — Leader, end of day: which PRs may merge?', 'Bước 4 — Trưởng nhóm, cuối ngày: PR nào được merge?')}</h3>
<p>${t('Five PRs are open. Before running anything, predict for each one whether GitHub will allow the merge and what is missing. Then run the simulation of the branch protection rules from step 1(d):', 'Có năm PR đang mở. Trước khi chạy gì, đoán với mỗi PR xem GitHub có cho merge không và còn thiếu gì. Rồi chạy mô phỏng luật bảo vệ nhánh ở bước 1(d):')}</p>
${out(MA.prJson)}
${js(MA.kiemDuyet)}
${giai(t('Real output and what the leader does about each PR', 'Output thật và việc trưởng nhóm làm với từng PR'), `${out(RA.kiemDuyet)}
${bang(['PR', t('Leader’s action', 'Trưởng nhóm làm gì')], [
    ['#31', t('Merge (squash). Mention C2’s review in the group chat as the standard (4.2).', 'Merge (squash). Nhắc lượt review của C2 trong nhóm chat như chuẩn mực của nhóm (4.2).')],
    ['#32', t('C5’s approval is fine for S30, but menu, routes and a migration were touched: C1 or C2 must approve, and C1 or C3 for the migration. C1 can cover all three — review today.', 'Lượt duyệt của C5 ổn cho S30, nhưng PR chạm menu, routes và một migration: cần C1 hoặc C2 duyệt, và C1 hoặc C3 cho migration. C1 phủ được cả ba — review ngay hôm nay.')],
    ['#33', t('C2 pushed after C1 approved, so the approval was dismissed — correct behaviour, the new code was never read. One thread is still open. C2 replies, C1 re-reviews only the new commit.', 'C2 đẩy commit sau khi C1 duyệt, nên lượt duyệt bị bỏ — đúng như mong muốn, mã mới chưa ai đọc. Còn một luồng mở. C2 trả lời, C1 chỉ review lại commit mới.')],
    ['#34', t('The leader’s own scaffolding PR (3.4) with no approval. Even "just placeholders" in shared files need C2. Ask C2 at standup; do not bypass protection.', 'PR khung của chính trưởng nhóm (3.4) chưa có ai duyệt. Dù "chỉ là giữ chỗ" trong tệp chung vẫn cần C2. Nhờ C2 ở buổi daily; không vượt luật bảo vệ.')],
    ['#35', t('Three problems: C5 requested changes, a thread is open, CI is red. Nothing for the leader to merge — but if it stays like this for a day, ask C3 at standup whether they are stuck (chapter 6).', 'Ba vấn đề: C5 yêu cầu sửa, một luồng đang mở, CI đỏ. Trưởng nhóm không có gì để merge — nhưng nếu để vậy quá một ngày, hỏi C3 ở daily xem có bị kẹt không (chương 6).')],
  ])}`)}

<h3>${t('Step 5 — The whole team: a 30-minute drill', 'Bước 5 — Cả nhóm: diễn tập 30 phút')}</h3>
<p>${t('At the first sprint planning of SWP391, do this once with the real team:', 'Ở buổi planning đầu tiên của SWP391, làm một lần với nhóm thật:')}</p>
<ol>
<li>${t('The leader opens a small PR containing <code>v1/DatLichApi.java</code> from 4.4 (or one planted bug of your own: a missing owner check is ideal).', 'Trưởng nhóm mở một PR nhỏ chứa <code>v1/DatLichApi.java</code> của bài 4.4 (hoặc một lỗi tự cài: thiếu kiểm chủ là lý tưởng).')}</li>
<li>${t('Everyone reviews it independently for 15 minutes using the checklist, writes comments in the 4.2 format and runs <code>loc-nhan-xet.mjs</code>.', 'Mọi người review độc lập trong 15 phút theo checklist, viết nhận xét theo định dạng 4.2 và chạy <code>loc-nhan-xet.mjs</code>.')}</li>
<li>${t('Compare: who found the IDOR? Who approved? Who wrote "sai rồi"? No grades — the point is that everyone sees the gap between "I looked at it" and "I checked it".', 'So sánh: ai tìm ra IDOR? Ai đã duyệt? Ai viết "sai rồi"? Không chấm điểm — điều cần là mọi người thấy khoảng cách giữa "mình đã xem" và "mình đã kiểm".')}</li>
<li>${t('The leader replies to the reviews following 4.3 — in front of everyone. This is the moment the team learns it is safe to block the leader.', 'Trưởng nhóm trả lời các lượt review theo bài 4.3 — trước mặt cả nhóm. Đây là khoảnh khắc cả nhóm học được rằng chặn trưởng nhóm là an toàn.')}</li>
</ol>

${cl('ok', `<p><strong>${t('Done when', 'Đạt khi')}</strong></p><ul>
<li>${t('<code>.github/CODEOWNERS</code>, <code>docs/review.md</code>, <code>docs/xoay-vong.md</code> are merged — through a PR that someone other than the leader approved.', '<code>.github/CODEOWNERS</code>, <code>docs/review.md</code>, <code>docs/xoay-vong.md</code> đã được merge — qua một PR do người khác trưởng nhóm duyệt.')}</li>
<li>${t('The four settings of step 1(d) are on; a test PR touching <code>fe/src/menu.js</code> shows "Review required" from a code owner.', 'Bốn ô cài đặt ở bước 1(d) đã bật; một PR thử chạm <code>fe/src/menu.js</code> hiện "Review required" từ chủ tệp.')}</li>
<li>${t('In your own review of PR #31 (or the drill PR) you found the missing owner check, and <code>loc-nhan-xet.mjs</code> reports 0 errors.', 'Trong lượt review của chính bạn cho PR #31 (hoặc PR diễn tập) bạn đã tìm ra thiếu kiểm chủ, và <code>loc-nhan-xet.mjs</code> báo 0 lỗi.')}</li>
<li>${t('As author you replied to every thread with a hash or a ticket and <code>tra-loi.mjs</code> ends with "đủ điều kiện merge".', 'Ở vai tác giả, bạn đã trả lời mọi luồng kèm hash hoặc ticket và <code>tra-loi.mjs</code> kết thúc bằng "đủ điều kiện merge".')}</li>
<li>${t('You can explain, for each of the five PRs in step 4, why the merge button is locked or not.', 'Bạn giải thích được, với từng PR trong năm PR ở bước 4, vì sao nút merge bị khoá hay không.')}</li>
</ul>`)}

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'Companies have the same pieces under different names: a CODEOWNERS file or "required reviewers" per module, a review guideline page on the wiki, a checklist in Excel, a dashboard of PRs waiting for review. On your first week at FPT Software or any OJT, ask three questions: "Who reviews my PRs?", "Is there a review checklist?", "How fast are reviews expected?" — and you will already know more about the team’s process than most new hires.',
    'Công ty có đúng những mảnh này dưới tên khác: tệp CODEOWNERS hoặc "người review bắt buộc" theo module, trang hướng dẫn review trên wiki, checklist Excel, bảng theo dõi PR chờ review. Tuần đầu ở FPT Software hay bất kỳ đợt OJT nào, hãy hỏi ba câu: "Ai review PR của em?", "Có checklist review không?", "Review được kỳ vọng nhanh cỡ nào?" — và bạn đã hiểu quy trình của đội hơn phần lớn người mới.')}</p>
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-4-6-quiz', t('4.6 — Chapter 4 quiz', '4.6 — Kiểm tra Chương 4'))}${t('. Then chapter 5 writes down the decisions this chapter produced (ADR) and the postmortem when a review does miss something.', '. Sau đó chương 5 ghi lại các quyết định chương này sinh ra (ADR) và bản postmortem khi review thật sự bỏ sót.')}</p>
`);
};

export default {
  title: '4.5 — Lab: a review day on LabFlow|||4.5 — Lab: một ngày review của LabFlow',
  slug: 'agl-4-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab mốc dự án chương 4: trưởng nhóm viết luật (bảng xoay vòng cả kỳ, CODEOWNERS hai chủ cho tệp chung, docs/review.md, bốn ô bảo vệ main); C2 review PR #31 (soat-diff, checklist, tấn công thử, loc-nhan-xet); C1 trả lời (commit sửa, tra-loi); cuối ngày trưởng nhóm soát năm PR bằng kiem-duyet.mjs (thiếu chủ tệp, duyệt cũ bị bỏ, PR của chính trưởng nhóm chưa ai duyệt, CI đỏ); diễn tập 30 phút cho nhóm thật; tiêu chí đạt.',
  content: L45(true) + L45(false),
};
