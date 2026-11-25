/**
 * 3.2 — Mở PR dễ review (agl-3-2-pr-tot). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch3/kb-pr.sh (PR to của C4 vs bản đã tách) + ci/kiem-pr.mjs — qua ./_ma.mjs.
 * Nguồn: Google eng-practices "Small CLs" (đọc 24/11: "100 lines is usually a reasonable size… 1000 lines is usually too large");
 * xz-utils CVE-2024-3094 (oss-security 29/03/2024, Andres Freund). Ranh giới: giải phẫu PR + mẫu PR chung ⇒ Git 6.1; cách viết review ⇒ chương 4.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const MAU_PR = `## LF-44 — Quầy cho mượn (S30)
Ticket: LF-44 trên CT Work (dán đường dẫn thẻ)        Màn: S30 · Chủ màn: C4

### Làm gì
Kỹ thuật viên quét/nhập mã thiết bị và mã SV, bấm "Cho mượn" ⇒ tạo bản ghi muon_tra.
Chưa làm trong PR này: trả thiết bị (S31, PR sau), dữ liệu mẫu (PR chore riêng).

### Tiêu chí chấp nhận (copy từ ticket, tick khi đã tự thử)
- [x] AC1 Given TB-007 SAN_SANG When cho SV 2201 mượn Then trạng thái DANG_MUON, có dòng muon_tra
- [x] AC2 Given TB-007 DANG_MUON When cho mượn tiếp Then 409 "Thiết bị đang được mượn"
- [x] AC3 Given tài khoản sinh viên When gọi POST /api/muon Then 403

### Cách thử
1. ci/ci.sh  (xanh)     2. đăng nhập ktv@… ⇒ menu "Quầy cho mượn"     3. làm lại AC1–AC3

### Ảnh chụp
(ảnh S30 trước/sau, ảnh thông báo 409)

### Người review cần để ý
- Tệp chung: fe/src/menu.js (+1), fe/src/routes.js (+2 −1) — nhờ C1 xem
- Migration V3__muon_tra.sql — sẽ cập nhật nhánh với main ngay trước khi merge`;

export const L32 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 3 · Lesson 3.2', 'Chương 3 · Bài 3.2', `
<h2>${t('3.2 — Opening a PR that is easy to review', '3.2 — Mở PR dễ review')}</h2>
<p class="lead">${t(
    'A pull request is a request for someone else’s time. The author decides whether that time is 10 minutes of real checking or 40 minutes of scrolling followed by "LGTM". This lesson gives the team rules for PR size and shape, a self-check script that tells you what a reviewer will object to <em>before</em> you press Create, and a description template tied to the ticket’s acceptance criteria.',
    'Một pull request là lời xin thời gian của người khác. Người mở PR quyết định thời gian đó là 10 phút soát thật hay 40 phút cuộn chuột rồi gõ "LGTM". Bài này đưa ra luật nhóm về cỡ và hình dạng PR, một script tự soát cho bạn biết người review sẽ phản đối điều gì <em>trước khi</em> bấm Create, và mẫu mô tả gắn với tiêu chí chấp nhận của ticket.')}</p>
${note(t('The anatomy of a PR (title, description, linked issue, draft PRs) is in ', 'Giải phẫu một PR (tiêu đề, mô tả, liên kết issue, PR nháp) có ở ') + cs('git', 'git-6-1-giai-phau-pr', 'Git 6.1') + t('; how to write and receive review comments is chapter 4. Here: what the <em>team</em> agrees on, measured on LabFlow.', '; cách viết và nhận nhận xét review là chương 4. Ở đây: điều <em>nhóm</em> thoả thuận, đo trên LabFlow.'))}

<h3>${t('Everyday picture: asking a friend to proofread', 'Liên tưởng đời thường: nhờ bạn đọc hộ bài luận')}</h3>
<p>${t(
    'Send a friend one page and say "please check paragraph 2, I am not sure about the argument" — you get sharp comments in ten minutes. Send them a 40-page file where you also changed the font everywhere and say "check this" — you get "looks fine". Nobody reads forty pages carefully, and the real change hides among the font changes. Reviewers are the same friend.',
    'Gửi bạn một trang và nói "đọc giúp đoạn 2, mình không chắc lập luận" — mười phút sau bạn có nhận xét sắc. Gửi bạn tệp 40 trang mà còn đổi phông chữ khắp nơi và nói "xem giúp" — bạn nhận "ổn đấy". Không ai đọc kỹ bốn mươi trang, và chỗ sửa thật trốn giữa những chỗ đổi phông. Người review chính là người bạn đó.')}</p>

<h3>${t('The team rules', 'Luật của nhóm')}</h3>
${bang([t('Rule', 'Luật'), t('LabFlow agreement', 'Thoả thuận LabFlow'), t('Why', 'Vì sao')], [
    [t('One PR = one ticket = one screen', 'Một PR = một ticket = một màn'), t('Branch <code>feat/LF-44-…</code> touches only S30 and what S30 needs', 'Nhánh <code>feat/LF-44-…</code> chỉ chạm S30 và thứ S30 cần'), t('Reviewable in one sitting; revertable as a unit; LOC evidence per owner (3.1).', 'Review xong trong một lần ngồi; hoàn tác được nguyên khối; bằng chứng LOC theo chủ màn (3.1).')],
    [t('Size', 'Cỡ'), t('≤ 400 changed lines; usually far less', '≤ 400 dòng đổi; thường ít hơn nhiều'), t('Google’s guide: "100 lines is usually a reasonable size for a CL, and 1000 lines is usually too large" (', 'Hướng dẫn của Google: "100 dòng thường là cỡ hợp lý cho một CL, 1000 dòng thường là quá lớn" (') + ng('https://google.github.io/eng-practices/review/developer/small-cls.html', 'eng-practices, Small CLs') + ').'],
    [t('Formatting and generated files go alone', 'Định dạng và tệp sinh ra đi riêng'), t('Re-format, rename, seed data ⇒ separate <code>chore</code> PR', 'Định dạng lại, đổi tên, dữ liệu mẫu ⇒ PR <code>chore</code> riêng'), t('Mixed in, they hide the real change from the reviewer.', 'Trộn vào, chúng giấu chỗ sửa thật khỏi người review.')],
    [t('Self-review first', 'Tự review trước'), t('<code>git diff origin/main...</code>, <code>ci/ci.sh</code>, <code>node ci/kiem-pr.mjs</code> before Create', '<code>git diff origin/main...</code>, <code>ci/ci.sh</code>, <code>node ci/kiem-pr.mjs</code> trước khi Create'), t('You find the leftover console.log, not your reviewer.', 'Bạn tự thấy console.log sót, không phải người review.')],
    [t('Description from the ticket', 'Mô tả lấy từ ticket'), t('Template below: AC checklist, how to test, screenshots, "look here"', 'Mẫu bên dưới: checklist AC, cách thử, ảnh chụp, "xem kỹ chỗ này"'), t('The reviewer checks behaviour against criteria, not just style.', 'Người review soát hành vi theo tiêu chí, không chỉ soát văn phong.')],
    [t('Reviewers', 'Người review'), t('Rotating pair (C1→C2→C3→C4→C5→C1) + owner of any shared file touched', 'Cặp xoay vòng (C1→C2→C3→C4→C5→C1) + chủ của tệp chung bị chạm'), t('Everyone reads everyone’s code; the leader is not the bottleneck.', 'Ai cũng đọc code của mọi người; trưởng nhóm không thành nút thắt.')],
    [t('Response time', 'Thời gian phản hồi'), t('First review within one working day; author answers within one day', 'Review lần đầu trong một ngày làm việc; tác giả trả lời trong một ngày'), t('A PR waiting three days rots: conflicts grow (3.4).', 'PR chờ ba ngày sẽ mục: xung đột lớn dần (3.4).')],
  ])}

<h3>${t('Lab — one morning, two ways', 'Lab — một buổi sáng, hai cách')}</h3>
<p>${t('C4 owns S30 (lending desk) and S31 (returns). On 18/02 C4 worked all morning on one branch: S30, then S31, then "fixed the format" of the whole menu file (single to double quotes), then added 450 rows of demo data. CI is green:', 'C4 giữ S30 (quầy cho mượn) và S31 (trả thiết bị). Ngày 18/02 C4 làm cả buổi sáng trên một nhánh: S30, rồi S31, rồi "sửa format" cả tệp menu (nháy đơn thành nháy kép), rồi thêm 450 dòng dữ liệu mẫu. CI xanh:')}</p>
${out(RA.pr.split('\nC4 (feat/LF-44-quay-muon-tra)$ node ci/kiem-pr.mjs')[0].replace(/^### .*\n/, ''))}
<p>${t('Green CI only says "nothing we test is broken". It says nothing about whether a human can review the change. The team’s self-check script asks the reviewer’s questions:', 'CI xanh chỉ nói "không thứ gì ta test bị hỏng". Nó không nói gì về chuyện con người có review nổi thay đổi đó không. Script tự soát của nhóm hỏi đúng những câu người review sẽ hỏi:')}</p>
${js(MA.kiemPr)}
${out('C4 (feat/LF-44-quay-muon-tra)$ node ci/kiem-pr.mjs' + RA.pr.split('\nC4 (feat/LF-44-quay-muon-tra)$ node ci/kiem-pr.mjs')[1].split('\nC4 (feat/LF-44-quay-muon-tra)$ git diff origin/main...')[0])}
<p>${t('Look at what "fix the format" did to the shared menu — ten lines that every other member also edits, changed for no functional reason:', 'Nhìn xem "sửa format" đã làm gì với tệp menu dùng chung — mười dòng mà mọi thành viên khác cũng sửa, bị đổi mà không vì chức năng nào:')}</p>
${out('C4 (feat/LF-44-quay-muon-tra)$ git diff origin/main...' + RA.pr.split('\nC4 (feat/LF-44-quay-muon-tra)$ git diff origin/main...')[1].split('### Bản 2')[0])}
${cl('danger', `<p><strong>${t('Three costs of the big PR', 'Ba cái giá của PR to')}</strong></p><ol>
<li>${t('<strong>Review quality:</strong> 495 lines, 452 of them generated INSERTs. The reviewer scrolls past the data — and past whatever else is in that file.', '<strong>Chất lượng review:</strong> 495 dòng, 452 dòng là INSERT sinh ra. Người review lướt qua dữ liệu — và lướt qua luôn mọi thứ khác nằm trong tệp đó.')}</li>
<li>${t('<strong>Conflicts for everyone:</strong> the quote change rewrites lines in <code>menu.js</code> that C1 and C2 are editing today. Their next update of main will conflict on lines they never touched (3.4).', '<strong>Xung đột cho cả nhóm:</strong> đổi dấu nháy viết lại các dòng của <code>menu.js</code> mà C1 và C2 đang sửa hôm nay. Lần cập nhật main tới của họ sẽ xung đột ở những dòng họ không hề đụng (3.4).')}</li>
<li>${t('<strong>Wrong place for demo data:</strong> a versioned migration runs on <em>every</em> database, including the one the lecturer grades. Demo data belongs in a separate seed step for the dev profile, reviewed as its own PR.', '<strong>Dữ liệu mẫu đặt sai chỗ:</strong> migration có số phiên bản chạy trên <em>mọi</em> CSDL, kể cả CSDL giảng viên chấm. Dữ liệu demo thuộc về một bước seed riêng cho profile dev, review thành PR riêng.')}</li>
</ol>`)}
<p>${t('Version 2 — C4 splits: S30 now, S31 tomorrow, demo data as a separate <code>chore</code> PR, no formatting change:', 'Bản 2 — C4 tách: S30 hôm nay, S31 ngày mai, dữ liệu mẫu thành PR <code>chore</code> riêng, không đổi định dạng:')}</p>
${out(RA.pr.split('### Bản 2')[1].replace(/^[^\n]*\n/, ''))}
<p>${t('The warnings that remain are <em>useful</em>: they tell the reviewer exactly where to look (two shared files, one migration). That is the goal — not zero warnings, but no surprises.', 'Các cảnh báo còn lại là cảnh báo <em>có ích</em>: chúng chỉ cho người review đúng chỗ cần nhìn (hai tệp chung, một migration). Đó là mục tiêu — không phải 0 cảnh báo, mà là không có bất ngờ.')}</p>

<h3>${t('The description: the ticket’s criteria, ticked', 'Phần mô tả: tiêu chí của ticket, đã tick')}</h3>
<p>${t('Put this in <code>.github/pull_request_template.md</code> so every PR starts from it (the mechanism: Git 6.1). The key idea is the middle section: the acceptance criteria are copied from the ticket (lesson 2.1) and ticked only after the author tried them — the reviewer then tests behaviour, not taste.', 'Đặt vào <code>.github/pull_request_template.md</code> để PR nào cũng bắt đầu từ đây (cơ chế: Git 6.1). Ý chính nằm ở phần giữa: tiêu chí chấp nhận chép từ ticket (bài 2.1) và chỉ tick sau khi tác giả đã tự thử — người review khi đó soát hành vi, không soát sở thích.')}</p>
${out(MAU_PR)}
${note(t('Open a <strong>draft PR</strong> on day 1 of the ticket, even with one commit: the team sees the branch exists, CI runs early, and the reviewer can glance at the direction before you write 300 lines in the wrong one.', 'Mở <strong>PR nháp</strong> ngay ngày đầu của ticket, dù mới có một commit: cả nhóm thấy nhánh đang tồn tại, CI chạy sớm, và người review liếc được hướng đi trước khi bạn viết 300 dòng theo hướng sai.'))}

<h3>🕵️ ${t('Hacker’s corner: where nobody reads, attackers write', 'Góc hacker: chỗ không ai đọc là chỗ kẻ tấn công viết')}</h3>
<p>${t(
    'On 29 March 2024 Andres Freund, a PostgreSQL developer, reported on the oss-security list that releases 5.6.0 and 5.6.1 of <strong>xz-utils</strong> — a compression library present on most Linux systems — contained a backdoor targeting SSH servers (CVE-2024-3094). The payload was hidden inside binary <em>test files</em> (<code>tests/files/bad-3-corrupt_lzma2.xz</code>, <code>good-large_compressed.lzma</code>) and activated by a build-script change shipped in the release tarball. It was planted over two years by a contributor who had patiently earned maintainer trust. Freund found it by accident, investigating a half-second SSH slowdown (',
    'Ngày 29/03/2024, Andres Freund, một lập trình viên PostgreSQL, báo lên danh sách oss-security rằng bản 5.6.0 và 5.6.1 của <strong>xz-utils</strong> — thư viện nén có mặt trên hầu hết hệ thống Linux — chứa cửa hậu nhắm vào máy chủ SSH (CVE-2024-3094). Mã độc được giấu trong các <em>tệp test</em> nhị phân (<code>tests/files/bad-3-corrupt_lzma2.xz</code>, <code>good-large_compressed.lzma</code>) và được kích hoạt bởi một thay đổi script build nằm trong gói phát hành. Nó được cài cắm suốt hai năm bởi một người đóng góp đã kiên nhẫn lấy được lòng tin của người bảo trì. Freund phát hiện tình cờ, khi điều tra việc SSH chậm đi nửa giây (')}${ng('https://www.openwall.com/lists/oss-security/2024/03/29/4', 'oss-security, 29/03/2024')}).</p>
<p>${t('The lesson for a five-person team is not paranoia about your classmates. It is that <strong>reviewers skip what looks generated, binary or boring</strong> — test fixtures, lock files, seed data, minified files, "format only" changes — and that is exactly where mistakes and secrets (a real API key in seed data) slip through. Small PRs with generated files separated make "I did not read that part" visible instead of invisible.', 'Bài học cho nhóm năm người không phải là nghi ngờ bạn cùng lớp. Mà là <strong>người review bỏ qua thứ trông như sinh tự động, nhị phân hoặc nhàm chán</strong> — dữ liệu test, tệp khoá phiên bản, dữ liệu mẫu, tệp nén gọn, thay đổi "chỉ định dạng" — và đó đúng là chỗ lỗi và bí mật (một API key thật trong dữ liệu mẫu) lọt qua. PR nhỏ, tệp sinh ra tách riêng, biến chuyện "mình không đọc phần đó" từ vô hình thành nhìn thấy được.')}</p>

<h3>${t('At work', 'Đi làm')}</h3>
<p>${t(
    'In an outsourcing project your PR is often reviewed by a senior or the team leader, and sometimes the customer reads the merged code. Two habits get you trusted quickly: PRs that do exactly what the ticket says (nothing "while I was there"), and a description that states what you tested and what you did <em>not</em> do. If a ticket really needs 800 lines, say so in the description and propose the review order ("read the service first, then the controller; the mapper is generated").',
    'Ở dự án outsourcing, PR của bạn thường do senior hoặc trưởng nhóm review, đôi khi khách đọc cả code đã merge. Hai thói quen giúp bạn được tin nhanh: PR làm đúng điều ticket nói (không có gì "tiện tay sửa luôn"), và phần mô tả nêu bạn đã thử gì và <em>không</em> làm gì. Nếu ticket thật sự cần 800 dòng, ghi rõ trong mô tả và đề xuất thứ tự đọc ("đọc service trước, rồi controller; mapper là mã sinh").')}</p>

<h3>🧪 ${t('Exercise', 'Bài tập')}</h3>
<p>${t('Using the output of version 1 above, write the plan C4 should have followed: which PRs, in what order, with which branch names and reviewers. Then answer: why does the S31 PR need to be updated with main before it is merged?', 'Dựa vào output bản 1 ở trên, viết kế hoạch C4 lẽ ra nên làm: những PR nào, theo thứ tự nào, tên nhánh và người review ra sao. Rồi trả lời: vì sao PR S31 phải cập nhật với main trước khi merge?')}</p>
${giai(t('Answer', 'Đáp án'), `<ol>
<li>${t('<code>feat/LF-44-quay-muon</code> — S30 + route + menu item + <code>V3__muon_tra.sql</code>. Reviewers: C5 (rotation) + C1 (shared files). Merged first because S31 depends on the table.', '<code>feat/LF-44-quay-muon</code> — S30 + route + mục menu + <code>V3__muon_tra.sql</code>. Review: C5 (xoay vòng) + C1 (tệp chung). Merge trước vì S31 cần bảng này.')}</li>
<li>${t('<code>feat/LF-45-tra-thiet-bi</code> — S31 (ticket LF-45, its own row in the assignment table). Reviewers: C5 + C1.', '<code>feat/LF-45-tra-thiet-bi</code> — S31 (ticket LF-45, có dòng riêng trong bảng phân công). Review: C5 + C1.')}</li>
<li>${t('<code>chore/LF-02-du-lieu-mau</code> — demo data as a dev-only seed, not a versioned migration. Reviewer: C1.', '<code>chore/LF-02-du-lieu-mau</code> — dữ liệu demo dạng seed chỉ cho dev, không phải migration có số. Review: C1.')}</li>
<li>${t('No quote reformatting at all. If the team wants a formatter, the leader adds it once for the whole repo in a separate PR when nobody has open branches (e.g. the first day of a sprint).', 'Không đổi dấu nháy gì cả. Nếu nhóm muốn công cụ định dạng, trưởng nhóm thêm một lần cho cả repo bằng PR riêng vào lúc không ai có nhánh đang mở (vd ngày đầu sprint).')}</li>
</ol>
<p>${t('S31 must be updated with main because it was branched before S30 merged; it may also add a migration, and the CI result computed on the old base says nothing about the combination — lesson 3.3 shows this failing for real.', 'S31 phải cập nhật với main vì nó được tách nhánh trước khi S30 merge; nó cũng có thể thêm migration, và kết quả CI tính trên gốc cũ không nói gì về bản kết hợp — bài 3.3 cho thấy điều này hỏng thật.')}</p>`)}

${phongVan([
    [t('"How big should a pull request be?"', '"Một pull request nên lớn cỡ nào?"'), t('As small as one reviewable idea — one ticket, ideally under a few hundred changed lines. Google’s engineering guide calls about 100 lines reasonable and 1000 usually too large. Formatting and generated files go in their own PR so the reviewer sees the real change.', 'Nhỏ cỡ một ý review được — một ticket, tốt nhất dưới vài trăm dòng đổi. Hướng dẫn kỹ thuật của Google coi khoảng 100 dòng là hợp lý và 1000 dòng thường là quá lớn. Định dạng và tệp sinh ra đi PR riêng để người review thấy chỗ sửa thật.')],
    [t('"What do you do before asking for review?"', '"Bạn làm gì trước khi nhờ review?"'), t('Read my own diff against main, run the same checks as CI locally, make sure the PR does only what the ticket says, fill the description with the acceptance criteria I tested and screenshots, and point the reviewer to the risky parts.', 'Đọc diff của chính mình so với main, chạy cục bộ đúng các bước CI, bảo đảm PR chỉ làm đúng điều ticket nói, điền mô tả bằng các tiêu chí chấp nhận đã thử và ảnh chụp, và chỉ cho người review những phần rủi ro.')],
    [t('"A feature truly needs 1,500 lines. What now?"', '"Một tính năng thật sự cần 1.500 dòng. Làm sao?"'), t('Stack it: a PR for the schema and repository, one for the service with tests, one for the API, one for the UI — each reviewable and safe to merge (behind a feature flag or not yet linked in the menu). If it cannot be split, agree on a review order and do part of it as a walkthrough call.', 'Xếp tầng: một PR cho lược đồ và repository, một cho service kèm test, một cho API, một cho giao diện — mỗi cái review được và merge an toàn (sau cờ tính năng hoặc chưa gắn vào menu). Không tách được thì thống nhất thứ tự đọc và làm một phần bằng cuộc gọi đi qua code.')],
    [t('"What was the xz backdoor and what does it teach code reviewers?"', '"Cửa hậu xz là gì và nó dạy người review điều gì?"'), t('CVE-2024-3094, disclosed 29 March 2024: a long-trusted contributor hid a backdoor in binary test files and the release build script of xz-utils. Reviewers tend to skip generated and binary files; keeping them out of feature PRs and reviewing them deliberately reduces that blind spot.', 'CVE-2024-3094, công bố 29/03/2024: một người đóng góp được tin lâu năm giấu cửa hậu trong tệp test nhị phân và script build bản phát hành của xz-utils. Người review hay bỏ qua tệp sinh tự động và tệp nhị phân; tách chúng khỏi PR tính năng và review có chủ đích sẽ thu hẹp điểm mù đó.')],
  ], en)}

${thuatNgu([
    ['pull request (PR)', t('A request to merge a branch, with discussion and checks.', 'Yêu cầu merge một nhánh, kèm thảo luận và các check.')],
    ['CL (changelist)', t('Google’s word for one reviewable change.', 'Từ của Google cho một thay đổi review được.')],
    [t('draft PR', 'PR nháp'), t('A PR marked not ready; CI runs, no merge.', 'PR đánh dấu chưa sẵn sàng; CI chạy, không merge được.')],
    ['three-dot diff', t('<code>git diff main...HEAD</code>: only what the branch added since it forked.', '<code>git diff main...HEAD</code>: chỉ phần nhánh thêm từ lúc tách ra.')],
    [t('shared file', 'tệp dùng chung'), t('File many members edit (menu, route index, CI).', 'Tệp nhiều thành viên cùng sửa (menu, tệp gom route, CI).')],
    ['seed data', t('Demo/test rows loaded into a database.', 'Dòng dữ liệu demo/test nạp vào CSDL.')],
    ['LGTM', t('"Looks good to me" — approval, often too quick.', '"Looks good to me" — chấp thuận, thường quá nhanh.')],
  ], en)}

${tomTat([
    t('One PR = one ticket = one screen; ≤ 400 changed lines; formatting and generated data in separate PRs.', 'Một PR = một ticket = một màn; ≤ 400 dòng đổi; định dạng và dữ liệu sinh ra đi PR riêng.'),
    t('Green CI ≠ reviewable: run the self-check (diff, ci.sh, kiem-pr.mjs) before Create.', 'CI xanh ≠ review được: chạy tự soát (diff, ci.sh, kiem-pr.mjs) trước khi Create.'),
    t('The description copies the ticket’s acceptance criteria and ticks the ones the author tested.', 'Phần mô tả chép tiêu chí chấp nhận của ticket và tick những tiêu chí tác giả đã thử.'),
    t('Rotating reviewers + owner of any shared file; first response within one working day.', 'Người review xoay vòng + chủ của tệp chung bị chạm; phản hồi lần đầu trong một ngày làm việc.'),
    t('Reviewers skip what looks generated — the xz backdoor (2024) lived exactly there.', 'Người review bỏ qua thứ trông như sinh tự động — cửa hậu xz (2024) nằm đúng ở đó.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-3-3-ci', t('3.3 — CI checks as a teammate', '3.3 — CI như một đồng đội'))}.</p>
`);
};

export default {
  title: '3.2 — Opening a PR that is easy to review|||3.2 — Mở PR dễ review',
  slug: 'agl-3-2-pr-tot',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Luật nhóm cho PR: một PR = một ticket = một màn, ≤ 400 dòng, định dạng và dữ liệu mẫu đi riêng, tự soát trước khi mở, người review xoay vòng, phản hồi trong một ngày; lab chạy thật: PR to của C4 (CI xanh nhưng kiem-pr.mjs bắt 2 màn, 10 dòng chỉ đổi định dạng, 452 dòng dữ liệu mẫu) và bản đã tách; mẫu mô tả PR gắn tiêu chí chấp nhận; góc hacker: cửa hậu xz-utils 2024 trong tệp test.',
  content: L32(true) + L32(false),
};
