/**
 * Kỹ năng nghề · 📝 3.1 — Viết kỹ thuật: câu đo được, nói kết luận trước (BLUF), số liệu khớp bảng, viết không đổ lỗi
 * (gắn bài SSG105 3.1 Written communication). Số liệu thật: SportShop Lab 2–4, sự cố cuongthai.com.
 */
import { moDun, tracNghiem, phanLoai, TN } from './_chung.mjs';

const W1 = tracNghiem({
  tieuDe: 'Writing 1 — Rewrite vague sentences into measurable ones',
  doKho: 'EASY', phut: 7,
  moTa: {
    en: '<p>A technical sentence is <b>measurable</b> when a reader could check it: it has a number, a unit, and a point of comparison (before/after, target, total). “The API is faster” cannot be checked; “p95 latency fell from 840 ms to 120 ms after adding an index on <code>bookings(user_id)</code>” can. Pick the best rewrite of each vague sentence.</p>',
    vi: '<p>Một câu kỹ thuật <b>đo được</b> khi người đọc có thể kiểm: có con số, đơn vị và mốc so sánh (trước/sau, mục tiêu, tổng). "API nhanh hơn" không kiểm được; "p95 giảm từ 840 ms xuống 120 ms sau khi thêm index trên <code>bookings(user_id)</code>" thì kiểm được. Chọn bản viết lại tốt nhất cho mỗi câu mơ hồ.</p>',
  },
  cau: [
    { en: '“The API is faster now.”', vi: '"API giờ nhanh hơn."', lc: [['a', '“The API is much, much faster now.”'], ['b', '“p95 latency of GET /bookings fell from 840 ms to 120 ms after adding an index on bookings(user_id).”'], ['c', '“The API is optimised.”'], ['d', '“Users will love the new speed.”']], dap: 'b', giai: ['Metric (p95), endpoint, before → after, unit, and the cause.', 'Thước đo (p95), endpoint, trước → sau, đơn vị, và nguyên nhân.'] },
    { en: '“Most tests passed.”', vi: '"Phần lớn test đạt."', lc: [['a', '“93 of 113 unit tests passed (82.3%); the 20 fails map to tickets SS-19 … SS-33.”'], ['b', '“Almost all tests passed.”'], ['c', '“Tests were mostly OK.”'], ['d', '“A good number of tests passed.”']], dap: 'a', giai: ['Counts + ratio + where the rest went.', 'Số đếm + tỉ lệ + phần còn lại đi đâu.'] },
    { en: '“The system is stable.”', vi: '"Hệ thống ổn định."', lc: [['a', '“The system works well.”'], ['b', '“The system has been very stable lately.”'], ['c', '“0 restarts and 0 HTTP 5xx in the last 7 days; error rate 0.02% over 1.2 million requests.”'], ['d', '“No complaints so far.”']], dap: 'c', giai: ['“Stable” becomes counts over a stated window.', '"Ổn định" thành số đếm trong một khoảng thời gian nêu rõ.'] },
    { en: '“The page loads slowly on mobile.”', vi: '"Trang tải chậm trên điện thoại."', lc: [['a', '“The page is too slow on phones.”'], ['b', '“On a mid-range Android over 4G, Largest Contentful Paint is 6.1 s (target ≤ 2.5 s); the 2.4 MB hero image is the largest request.”'], ['c', '“Mobile performance is bad.”'], ['d', '“Mobile is a problem.”']], dap: 'b', giai: ['Device and network, a named metric, the target, and the suspected cause.', 'Thiết bị và mạng, thước đo có tên, mục tiêu, và nguyên nhân nghi ngờ.'] },
    { en: '“We fixed a lot of bugs this sprint.”', vi: '"Sprint này sửa được nhiều lỗi."', lc: [['a', '“We worked hard on bugs.”'], ['b', '“Many bugs were fixed.”'], ['c', '“14 bugs closed (3 Critical, 6 Major, 5 Minor); 4 reopened bugs from the last sprint remain open.”'], ['d', '“Bug count is down.”']], dap: 'c', giai: ['Count, breakdown by severity, and what is still open.', 'Số lượng, chia theo mức độ, và những gì vẫn mở.'] },
    { en: '“Coverage is high.”', vi: '"Độ phủ cao."', lc: [['a', '“Line coverage 99.3% (299/301), branch coverage 93.5% (116/124) — JaCoCo, module A, run of 28/10.”'], ['b', '“Coverage is very high.”'], ['c', '“Coverage is almost 100%.”'], ['d', '“We covered everything important.”']], dap: 'a', giai: ['Which coverage, the raw fraction, the tool, the scope and the date.', 'Độ phủ loại nào, phân số gốc, công cụ, phạm vi và ngày.'] },
  ],
  goiY: ['Câu đo được trả lời: bao nhiêu? so với gì? đo ở đâu, khi nào?', 'Thấy "nhanh", "nhiều", "ổn", "cao" ⇒ thay bằng con số + đơn vị.'],
  loiHayGap: ['Thêm trạng từ ("rất", "much") thay vì thêm số.', 'Đưa phần trăm mà không đưa số đếm gốc — người đọc không đối chiếu được.', 'Bỏ mốc so sánh: "120 ms" mà không nói trước đó là bao nhiêu.'],
  thuatNgu: [TN.measurable, TN.vague, { en: 'p95 latency', vi: 'độ trễ phân vị 95 — 95% request nhanh hơn mức này' }],
  khaiNiem: ['measurable writing'],
});

const LOAI = ['Measurable', 'Vague', 'Opinion without evidence', 'Blames a person'];
const W2 = phanLoai({
  tieuDe: 'Writing 2 — Measurable, vague, opinion or blame?',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p>Before you rewrite, you must recognise the problem. Sentences in reports and tickets fall into four groups: <b>measurable</b> (a reader can check it), <b>vague</b> (no number, no comparison), <b>opinion without evidence</b> (“I think the design is bad”), and <b>blame</b> (makes a person the cause). Classify each sentence from real project chats and reports.</p>',
    vi: '<p>Muốn sửa phải nhận ra lỗi trước. Câu trong báo cáo và ticket chia bốn nhóm: <b>đo được</b> (người đọc kiểm được), <b>mơ hồ</b> (không số, không so sánh), <b>ý kiến không bằng chứng</b> ("em nghĩ thiết kế tệ"), và <b>đổ lỗi</b> (biến một người thành nguyên nhân). Phân loại từng câu lấy từ chat và báo cáo dự án thật.</p>',
  },
  cot: 'Type',
  luaChon: LOAI,
  hang: [
    ['“The deploy failed at 14:32 with ‘no space left on device’; free disk was 1.8 GB.”', LOAI[0], '“Deploy hỏng lúc 14:32 với ‘no space left on device’; đĩa còn trống 1,8 GB.”'],
    ['“The server is kind of slow these days.”', LOAI[1], '“Dạo này server hơi chậm.”'],
    ['“Minh forgot to run the migration, as usual.”', LOAI[3], '“Minh lại quên chạy migration như mọi khi.”'],
    ['“I think React is a bad choice for this project.”', LOAI[2], '“Em nghĩ React là lựa chọn tệ cho dự án này.”'],
    ['“16 of 22 integration cases pass in all 3 rounds.”', LOAI[0], '“16/22 ca tích hợp đạt ở cả 3 round.”'],
    ['“Testing went fine overall.”', LOAI[1], '“Nhìn chung test ổn.”'],
    ['“The bug exists because the developer was careless.”', LOAI[3], '“Lỗi có vì developer bất cẩn.”'],
    ['“The new layout is obviously better.”', LOAI[2], '“Bố cục mới rõ ràng đẹp hơn.”'],
  ],
  giaiBang: ['Blame names a person as the cause; an opinion judges without data; vague has no number; measurable can be checked.', 'Đổ lỗi gọi tên một người làm nguyên nhân; ý kiến phán xét không dữ liệu; mơ hồ không có số; đo được thì kiểm được.'],
  goiY: ['Có tên người + lời chê ⇒ đổ lỗi.', '"Em nghĩ… tệ / rõ ràng đẹp hơn" mà không số liệu ⇒ ý kiến không bằng chứng.'],
  loiHayGap: ['Cho rằng câu có tên người luôn là đổ lỗi — "Minh đã chạy migration lúc 10:05" là câu đo được.', 'Nhầm ý kiến (có phán xét) với câu mơ hồ (chỉ thiếu số).'],
  giaiThich: '<p>Measurable · Vague · Blame · Opinion · Measurable · Vague · Blame · Opinion.</p>',
  thuatNgu: [TN.measurable, TN.vague, TN.blameless],
  khaiNiem: ['sentence quality'],
});

const W3 = tracNghiem({
  tieuDe: 'Writing 3 — Bottom line up front: choose the first sentence',
  doKho: 'MEDIUM', phut: 7,
  moTa: {
    en: '<p>Busy readers read the first sentence and decide whether to read more. <b>BLUF — bottom line up front</b>: the first sentence says the conclusion or the decision needed, with the key number; details follow. The right first sentence also depends on <b>who reads</b>: a teacher wants the result against the requirement, a team lead wants status and blockers, a manager wants the decision. Choose the best opening sentence.</p>',
    vi: '<p>Người đọc bận đọc câu đầu rồi quyết định có đọc tiếp không. <b>BLUF — kết luận trước</b>: câu đầu nói kết luận hoặc quyết định cần đưa ra, kèm con số chính; chi tiết theo sau. Câu đầu đúng còn phụ thuộc <b>ai đọc</b>: thầy cô muốn kết quả so với yêu cầu, trưởng nhóm muốn tình trạng và điểm tắc, quản lý muốn quyết định. Chọn câu mở đầu tốt nhất.</p>',
  },
  cau: [
    { en: 'Summary of Report 5.3 (Lab 4) for the teacher.', vi: 'Tóm tắt Report 5.3 (Lab 4) gửi cô.', lc: [['a', '“In this report we will present the system testing of module A.”'], ['b', '“Module A passes 12 of 18 system test cases (66.7%) in all 3 rounds; the 6 failures are 5 open defects (SS-19, SS-27, SS-31, SS-32, SS-33).”'], ['c', '“System testing is the third level of testing.”'], ['d', '“We worked very hard on Lab 4.”']], dap: 'b', giai: ['Result, ratio, stability, and what the failures are.', 'Kết quả, tỉ lệ, độ ổn định, và các ca fail là gì.'] },
    { en: 'Daily update in the team chat for the leader.', vi: 'Cập nhật hằng ngày trong chat nhóm cho trưởng nhóm.', lc: [['a', '“Hi everyone, hope you are well!”'], ['b', '“Status: Report 5.2 done (22 cases, 3 rounds); blocked on Lab 4 screenshots until the SQL Server container is fixed — need 30 minutes with the team leader tonight.”'], ['c', '“Yesterday I opened the project and…”'], ['d', '“Things are going OK.”']], dap: 'b', giai: ['Done, blocked, and the exact help needed.', 'Đã xong, đang tắc, và cần giúp gì cụ thể.'] },
    { en: 'Message to the mentor asking for a decision.', vi: 'Tin nhắn hỏi mentor một quyết định.', lc: [['a', '“Decision needed by Friday: ship release 2.1 with 3 open Minor defects, or delay one week to fix them. I recommend shipping; details below.”'], ['b', '“There are some defects, what do you think?”'], ['c', '“Here is the full test log.”'], ['d', '“Can we have a meeting?”']], dap: 'a', giai: ['The decision, the options, the deadline and your recommendation — in the first two sentences.', 'Quyết định, các phương án, hạn chót và đề xuất của bạn — ngay hai câu đầu.'] },
    { en: 'First line of an incident report to the whole team.', vi: 'Dòng đầu báo cáo sự cố gửi cả nhóm.', lc: [['a', '“Something went wrong with the server yesterday.”'], ['b', '“On 18/08 the API returned HTTP 502 for 7 minutes after a deploy shipped an image with the wrong Prisma engine; it is fixed and a pre-push check now blocks it.”'], ['c', '“As we all know, deploys are complicated.”'], ['d', '“I want to explain a long story.”']], dap: 'b', giai: ['What, when, how long, cause in one clause, current state.', 'Chuyện gì, khi nào, bao lâu, nguyên nhân một vế, tình trạng hiện tại.'] },
  ],
  goiY: ['Câu đầu phải đứng một mình được: người chỉ đọc câu đó vẫn biết kết quả/quyết định.', 'Đổi người đọc ⇒ đổi câu đầu.'],
  loiHayGap: ['Mở bằng "Trong báo cáo này em xin trình bày…" — câu không mang thông tin.', 'Giấu điểm tắc ở cuối tin nhắn dài.'],
  thuatNgu: [TN.bluf, { en: 'audience', vi: 'người đọc mục tiêu' }, { en: 'blocker', vi: 'điểm tắc — thứ chặn việc tiếp theo' }],
  khaiNiem: ['BLUF', 'audience'],
});

const KHOP = ['Consistent with the table', 'Inconsistent with the table'];
const W4 = phanLoai({
  tieuDe: 'Writing 4 — Do the sentences match the results table?',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: `<p>One number in the text that disagrees with the table makes the reader distrust everything. Here is the Lab 4 statistics table (Report 5.3, module A, run of 28/10):</p>
<table><thead><tr><th>Workflows</th><th>Cases</th><th>Steps</th><th>Rounds</th><th>Pass / round</th><th>Fail / round</th><th>Screenshots</th></tr></thead>
<tbody><tr><td>5</td><td>18</td><td>48</td><td>3</td><td>12</td><td>6</td><td>144</td></tr></tbody></table>
<p>Failed cases: RG01 (SS-33) · AC05 (SS-27) · AC06, AC07 (SS-31) · FP01 (SS-32) · RL02 (SS-19). Decide whether each sentence of a draft summary is consistent with the table.</p>`,
    vi: '<p>Một con số trong văn bản lệch với bảng khiến người đọc nghi mọi thứ. Bảng thống kê Lab 4 ở trên (Report 5.3, module A, lần chạy 28/10): 5 workflow, 18 ca, 48 bước, 3 round, mỗi round 12 đạt / 6 fail, 144 ảnh. Ca fail: RG01 (SS-33) · AC05 (SS-27) · AC06, AC07 (SS-31) · FP01 (SS-32) · RL02 (SS-19). Xét từng câu của bản tóm tắt nháp có khớp bảng không.</p>',
  },
  cot: 'Verdict',
  luaChon: KHOP,
  hang: [
    ['“12 of 18 cases pass (66.7%).”', KHOP[0], '“12/18 ca đạt (66,7%).”'],
    ['“The pass rate is 72.7%.”', KHOP[1], '“Tỉ lệ đạt 72,7%.” (đó là số của Lab 3)'],
    ['“Every step has one screenshot per round: 48 × 3 = 144.”', KHOP[0], '“Mỗi bước mỗi round một ảnh: 48 × 3 = 144.”'],
    ['“6 failures correspond to 6 different defects.”', KHOP[1], '“6 ca fail ứng với 6 lỗi khác nhau.” (AC06 và AC07 cùng SS-31)'],
    ['“The 6 failures correspond to 5 distinct defects.”', KHOP[0], '“6 ca fail ứng với 5 lỗi khác nhau.”'],
    ['“Results improved from round 1 to round 3.”', KHOP[1], '“Kết quả tốt lên từ round 1 tới round 3.”'],
    ['“The logout defect SS-31 causes two of the failures.”', KHOP[0], '“Lỗi đăng xuất SS-31 gây ra hai ca fail.”'],
  ],
  giaiBang: ['72.7% is the Lab 3 rate (16/22); the rounds are identical, so nothing “improved”; AC06 and AC07 share SS-31, so 6 failures = 5 defects.', '72,7% là tỉ lệ Lab 3 (16/22); các round giống nhau nên không có gì "tốt lên"; AC06 và AC07 chung SS-31 nên 6 ca fail = 5 lỗi.'],
  goiY: ['Đếm số mã lỗi KHÁC NHAU trong danh sách ca fail.', 'Số phần trăm phải tính lại từ chính bảng này, không chép từ lab khác.'],
  loiHayGap: ['Chép tỉ lệ của Lab 3 sang báo cáo Lab 4.', 'Đếm số ca fail làm số lỗi khi hai ca chung một lỗi.', 'Viết "cải thiện" khi các round giống hệt nhau.'],
  giaiThich: '<p>Consistent · Inconsistent · Consistent · Inconsistent · Consistent · Inconsistent · Consistent.</p>',
  thuatNgu: [{ en: 'consistency', vi: 'tính nhất quán — văn bản và bảng nói cùng một số' }, TN.successfulCoverage],
  khaiNiem: ['numbers consistency'],
});

const W5 = tracNghiem({
  tieuDe: 'Writing 5 — Active voice, clear actor, no blame',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>Two opposite mistakes: the <b>passive fog</b> (“mistakes were made”, “it was decided”) hides who did what and what happens next; <b>blame</b> (“Minh broke the build”) names a person as the cause and makes everyone hide information next time. Good technical writing names the <b>system, the step or the role</b> as the actor and states facts. Pick the best sentence.</p>',
    vi: '<p>Hai lỗi ngược nhau: <b>sương mù bị động</b> ("đã có sai sót", "đã được quyết định") giấu ai làm gì và việc tiếp theo; <b>đổ lỗi</b> ("Minh làm hỏng build") biến một người thành nguyên nhân và khiến mọi người giấu thông tin lần sau. Viết kỹ thuật tốt gọi tên <b>hệ thống, bước hoặc vai trò</b> làm chủ ngữ và nêu sự việc. Chọn câu tốt nhất.</p>',
  },
  cau: [
    { en: 'The nginx change did not take effect.', vi: 'Thay đổi nginx không có hiệu lực.', lc: [['a', '“Mistakes were made with nginx.”'], ['b', '“The deploy step replaced nginx.conf with mv, so the container kept reading the old inode.”'], ['c', '“Whoever wrote that script did not understand Docker.”'], ['d', '“Nginx was weird.”']], dap: 'b', giai: ['Actor = the deploy step; mechanism = mv + inode; no person blamed.', 'Chủ ngữ = bước deploy; cơ chế = mv + inode; không đổ lỗi người.'] },
    { en: 'A test was skipped.', vi: 'Một test bị bỏ qua.', lc: [['a', '“It was decided that IT19 would not be run.”'], ['b', '“The tester skipped IT19 because the logout button was missing in build 0.4; it is scheduled for round 2.”'], ['c', '“Someone lazy skipped IT19.”'], ['d', '“IT19 happened to not run.”']], dap: 'b', giai: ['Role + reason + what happens next.', 'Vai trò + lý do + việc tiếp theo.'] },
    { en: 'A deploy shipped a broken image.', vi: 'Một lần deploy đẩy lên ảnh hỏng.', lc: [['a', '“The deploy script built the image from the default Dockerfile instead of Dockerfile.backend; no check verified that the image could start.”'], ['b', '“Nam broke production again.”'], ['c', '“Production was broken.”'], ['d', '“Bad things happened during the deploy.”']], dap: 'a', giai: ['Two facts: what the script did, and which safety check was missing — the second points at the fix.', 'Hai sự việc: script đã làm gì, và chốt kiểm nào thiếu — cái thứ hai chỉ ra cách sửa.'] },
    { en: 'Data in a report was wrong.', vi: 'Số liệu trong báo cáo sai.', lc: [['a', '“Errors were found.”'], ['b', '“The Test Statistics sheet used Round 1 instead of the latest round, so the coverage showed 85.00% instead of 94.44%.”'], ['c', '“My teammate made a mess of the Excel file.”'], ['d', '“The numbers were a bit off.”']], dap: 'b', giai: ['Which artefact, what was wrong, the size of the error.', 'Sản phẩm nào, sai chỗ nào, sai bao nhiêu.'] },
  ],
  goiY: ['Chủ ngữ tốt là hệ thống / bước / vai trò; động từ chủ động; kèm cơ chế hoặc con số.', 'Loại câu có tính từ chê người ("lazy", "careless") và câu bị động không chủ thể.'],
  loiHayGap: ['Viết bị động cho "lịch sự" ⇒ không ai biết phải làm gì.', 'Gọi tên người làm nguyên nhân — lần sau không ai báo lỗi sớm nữa.'],
  thuatNgu: [TN.blameless, { en: 'active voice', vi: 'câu chủ động — chủ ngữ là bên thực hiện' }, { en: 'passive voice', vi: 'câu bị động — dễ giấu bên thực hiện' }],
  khaiNiem: ['blameless writing', 'active voice'],
});

const W6 = phanLoai({
  tieuDe: 'Writing 6 — Replace the vague word',
  doKho: 'EASY', phut: 5,
  moTa: {
    en: '<p>Each sentence from a draft report has one vague word (in bold). Choose the replacement that turns it into something a reader could check. Vietnamese drafts have the same words: “khá”, “nhanh”, “nhiều”, “ổn”, “tốt”.</p>',
    vi: '<p>Mỗi câu trong bản nháp báo cáo có một từ mơ hồ (in đậm). Chọn cụm thay thế để người đọc kiểm được. Bản nháp tiếng Việt có đúng những từ đó: "khá", "nhanh", "nhiều", "ổn", "tốt".</p>',
  },
  cotCau: 'Draft sentence',
  cot: 'Replace with',
  luaChon: ['in 1.4 s (target ≤ 2 s)', '20 of 113', 'with 0 failed requests in 3 rounds', 'from 7 to 3 clicks', '4 of 5 workflows', 'within 24 hours'],
  hang: [
    ['“The login page loads <b>quickly</b>.”', 'in 1.4 s (target ≤ 2 s)', '“Trang đăng nhập tải <b>nhanh</b>.”'],
    ['“<b>Some</b> unit tests fail.”', '20 of 113', '“<b>Một số</b> unit test fail.”'],
    ['“The Postman suite runs <b>fine</b>.”', 'with 0 failed requests in 3 rounds', '“Bộ Postman chạy <b>ổn</b>.”'],
    ['“The new checkout is <b>much simpler</b>.”', 'from 7 to 3 clicks', '“Trang thanh toán mới <b>đơn giản hơn nhiều</b>.”'],
    ['“<b>Most</b> workflows are covered by screenshots.”', '4 of 5 workflows', '“<b>Phần lớn</b> workflow có ảnh.”'],
    ['“We will fix it <b>soon</b>.”', 'within 24 hours', '“Bọn em sẽ sửa <b>sớm</b>.”'],
  ],
  giaiBang: ['Each replacement adds a number with its reference: a target, a total, a before/after or a deadline.', 'Mỗi cụm thay thêm một con số kèm mốc: mục tiêu, tổng, trước/sau hoặc hạn.'],
  goiY: ['"Sớm" ⇒ một hạn có đơn vị thời gian.', '"Một số / phần lớn" ⇒ x trên tổng.'],
  loiHayGap: ['Thay "nhanh" bằng "rất nhanh" — vẫn mơ hồ.', 'Đưa con số không có mốc: "1,4 giây" mà không nói mục tiêu là bao nhiêu.'],
  giaiThich: '<p>1.4 s · 20 of 113 · 0 failed requests · 7 → 3 clicks · 4 of 5 · within 24 hours.</p>',
  thuatNgu: [TN.vague, TN.measurable],
  khaiNiem: ['measurable writing'],
});

export default moDun({
  slug: 'ssg105-3-1-writing',
  ten: '3.1 Technical writing: measurable sentences, BLUF, consistency, no blame',
  moTaModule: 'Viết lại câu mơ hồ thành câu đo được, phân biệt câu đo được / mơ hồ / ý kiến / đổ lỗi, chọn câu đầu theo BLUF và người đọc, đối chiếu câu tóm tắt với bảng kết quả Lab 4 thật, viết chủ động không đổ lỗi, thay từ mơ hồ.',
  de: [W1, W2, W3, W4, W5, W6],
});
