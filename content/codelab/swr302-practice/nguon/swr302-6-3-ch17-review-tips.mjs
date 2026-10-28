/**
 * SWR302 · 6.3 — Requirements review challenges and tips (Wiegers Ch.17), finding defects in an SRS excerpt.
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Review tips 1 — review challenges and remedies',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers lists challenges for requirements reviews: <b>large requirements documents</b>, <b>large inspection teams</b>, <b>geographically separated reviewers</b> and <b>unprepared reviewers</b>. Tips include: review early and incrementally, use checklists, give each reviewer a perspective, focus on high-risk parts, and keep the team small.</p>', vi: '<p>Wiegers nêu các thách thức: tài liệu lớn, nhóm inspection đông, người review ở xa nhau, người review không chuẩn bị. Mẹo: review sớm và từng phần, dùng checklist, mỗi người một góc nhìn, tập trung phần rủi ro cao, giữ nhóm nhỏ.</p>' },
  cau: [
    { en: 'The SRS is 300 pages. Best approach?', vi: 'SRS dày 300 trang. Cách tốt nhất?', lc: [['a', 'Review it incrementally as sections are written, focusing on high-risk parts'], ['b', 'One 8-hour meeting at the end'], ['c', 'Skip the review'], ['d', 'Let only the author read it']], dap: 'a', giai: ['Small chunks, early, risk-based.', 'Từng phần nhỏ, sớm, theo rủi ro.'] },
    { en: '15 stakeholders want to attend the inspection. What do you do?', vi: '15 bên liên quan muốn dự inspection. Làm gì?', lc: [['a', 'Invite all 15 to the meeting'], ['b', 'Keep the meeting small; pick representatives of each perspective; let others review offline'], ['c', 'Cancel'], ['d', 'Invite only developers']], dap: 'b', giai: ['Large teams slow decisions; choose perspectives.', 'Nhóm đông chậm quyết định; chọn đại diện góc nhìn.'] },
    { en: 'Several inspectors arrive without having read the document. What does the moderator do?', vi: 'Vài inspector tới mà chưa đọc tài liệu. Moderator làm gì?', lc: [['a', 'Reschedule; preparation is essential'], ['b', 'Read it together for the first time in the meeting'], ['c', 'Proceed; they will catch up'], ['d', 'Blame the author']], dap: 'a', giai: ['Most defects are found during preparation.', 'Phần lớn lỗi được tìm ra lúc chuẩn bị.'] },
    { en: 'Reviewers are in Hanoi, HCMC and Tokyo. Wiegers suggests…', vi: 'Người review ở Hà Nội, TP.HCM và Tokyo. Wiegers gợi ý…', lc: [['a', 'collaborative review tools and asynchronous comments, with a short online meeting for disputed issues'], ['b', 'no review'], ['c', 'flying everyone to one city every week'], ['d', 'e-mail the whole document without guidance']], dap: 'a', giai: ['Use tools and asynchronous review.', 'Dùng công cụ và review bất đồng bộ.'] },
  ],
  goiY: ['Tài liệu lớn ⇒ chia nhỏ, review sớm, theo rủi ro.', 'Không chuẩn bị ⇒ hoãn.'],
  loiHayGap: ['Mời tất cả mọi người vào buổi họp.', 'Đọc tài liệu lần đầu ngay trong buổi họp.'],
  giaiThich: '<p>Answers: a · b · a · a.</p>',
  thuatNgu: tn('inspection'),
  khaiNiem: ['review challenges'],
});

const E2 = phanLoai({
  tieuDe: 'Review tips 2 — perspectives',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Giving each reviewer a <b>perspective</b> finds more defects: a <b>user</b> checks that tasks are possible; a <b>developer</b> checks that requirements can be designed and built; a <b>tester</b> checks that each requirement is verifiable; a <b>maintainer</b> checks clarity and modifiability. Which perspective is most likely to raise each comment?</p>', vi: '<p>Giao cho mỗi người review một <b>góc nhìn</b> giúp tìm nhiều lỗi hơn. Góc nhìn nào dễ nêu từng nhận xét nhất?</p>' },
  cot: 'Perspective', luaChon: ['User', 'Developer', 'Tester', 'Maintainer'],
  hang: [
    ['"How would I check ‘the page loads quickly’? There is no number."', 'Tester'],
    ['"I can’t book for my child — there is no way to choose another patient."', 'User'],
    ['"FR-30 needs real-time data from the lab system, which has no API."', 'Developer'],
    ['"The same discount rule is written in three places; changing it will be error-prone."', 'Maintainer'],
    ['"What is the expected result when the slot is already taken?"', 'Tester'],
    ['"Nurses work with gloves on; tiny buttons won’t work for us."', 'User'],
  ],
  giaiThich: '<p>Testers ask "how do I verify it?"; users ask "can I do my job?"; developers ask "can we build it?"; maintainers ask "can we change it safely?".</p>',
  goiY: ['"Làm sao kiểm?" ⇒ tester.', '"Trùng lặp, khó sửa" ⇒ maintainer.'],
  loiHayGap: ['Gán mọi nhận xét kỹ thuật cho developer.', 'Quên góc nhìn người bảo trì.'],
  thuatNgu: tn('inspection', 'verifiable'),
  khaiNiem: ['review perspectives'],
});

const E3 = phanLoai({
  tieuDe: 'Review tips 3 — inspect an SRS excerpt',
  doKho: 'HARD', phut: 12,
  moTa: { en: '<p>Excerpt from the SRS of <b>PetCare</b>, a veterinary-clinic booking app. Inspect each line with the checklist and record the main defect type. Some lines are fine — mark them <b>No defect</b> (a false claim costs as much as a miss).</p><ul><li>L1 The system shall let a pet owner book a check-up for a registered pet.</li><li>L2 The system shall send reminders in a timely manner.</li><li>L3 A booking shall be cancelled up to 2 hours before the appointment. (Elsewhere, FR-40: up to 24 hours.)</li><li>L4 The system shall let a vet record a diagnosis for</li><li>L5 The system shall respond to every request within 0.001 ms on 3G.</li><li>L6 The system shall show the vet’s schedule for the next 14 days.</li><li>L7 The system shall store pet photos in an S3 bucket using the AWS SDK v3.</li><li>L8 The system shall generate a monthly revenue report for the clinic owner.</li></ul>', vi: '<p>Trích SRS của <b>PetCare</b> (đặt lịch phòng khám thú y). Soát từng dòng theo checklist, ghi loại lỗi chính. Dòng không lỗi ⇒ <b>No defect</b>.</p>' },
  cot: 'Defect', luaChon: ['No defect', 'Ambiguous', 'Inconsistent', 'Incomplete', 'Infeasible', 'Design, not requirement'],
  hang: [
    ['L1', 'No defect'],
    ['L2', 'Ambiguous'],
    ['L3', 'Inconsistent'],
    ['L4', 'Incomplete'],
    ['L5', 'Infeasible'],
    ['L6', 'No defect'],
    ['L7', 'Design, not requirement'],
    ['L8', 'No defect'],
  ],
  giaiThich: '<p>L2 "in a timely manner" — when exactly? L3 contradicts FR-40. L4 stops mid-sentence. L5 is physically impossible on 3G. L7 prescribes the storage design. L1, L6 and L8 are clear, complete and verifiable.</p>',
  goiY: ['So từng dòng với các yêu cầu khác (L3 ↔ FR-40).', 'Không phải dòng nào cũng có lỗi.'],
  loiHayGap: ['Đánh dấu lỗi cho mọi dòng (khẳng định sai).', 'Gọi L2 là "incomplete" — vấn đề là "timely" mơ hồ.'],
  thuatNgu: tn('inspection', 'ambiguous'),
  khaiNiem: ['inspecting requirements'],
});

const E4 = phanLoai({
  tieuDe: 'Review tips 4 — informal or formal review?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Informal reviews (peer desk-check, pass-around, walkthrough) are quick and cheap; the inspection is the most formal, with roles, entry/exit criteria and recorded data, and finds the most defects. Choose the more suitable review for each situation.</p>', vi: '<p>Review không chính thức nhanh, rẻ; inspection chính thức nhất, tìm nhiều lỗi nhất. Chọn loại phù hợp.</p>' },
  cot: 'Review', luaChon: ['Informal review', 'Inspection'],
  hang: [
    ['A colleague glances at two new user stories before sprint planning.', 'Informal review'],
    ['The safety requirements of an insulin pump before certification.', 'Inspection'],
    ['The BA walks three users through a draft use case to get early feedback.', 'Informal review'],
    ['The payment and refund section of a banking SRS that will be baselined in a fixed-price contract.', 'Inspection'],
  ],
  giaiThich: '<p>Match the rigour to the risk: inspect what is critical; use light reviews early and often for everything else.</p>',
  goiY: ['Rủi ro cao, sắp baseline ⇒ inspection.', 'Phản hồi sớm, nhanh ⇒ không chính thức.'],
  loiHayGap: ['Inspection mọi story nhỏ.', 'Chỉ review lướt yêu cầu an toàn.'],
  thuatNgu: tn('inspection'),
  khaiNiem: ['review types'],
});

export default moDun({
  slug: 'swr302-6-3-ch17-review-tips',
  ten: '6.3 Review challenges and tips',
  moTaModule: 'Thách thức khi review yêu cầu (tài liệu lớn, nhóm đông, ở xa, không chuẩn bị) và cách xử lý, review theo góc nhìn (user/dev/tester/maintainer), tự inspect trích đoạn SRS PetCare có cả dòng không lỗi.',
  de: [E1, E2, E3, E4],
});
