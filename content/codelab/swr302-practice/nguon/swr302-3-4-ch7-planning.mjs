/**
 * SWR302 · 3.4 — Planning, preparing, performing and following up elicitation (Wiegers Ch.7 slides 22–26).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Elicitation planning 1 — prepare, perform or follow up?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers splits each elicitation activity into <b>preparing</b> (scope and agenda, resources, learn about the stakeholders, questions, straw-man models), <b>performing</b> (educate stakeholders about the approach, take good notes, use the physical space) and <b>following up</b> (organise and share the notes, document open issues).</p>', vi: '<p>Chuẩn bị · thực hiện · theo dõi sau buổi khai thác.</p>' },
  cot: 'Stage', luaChon: ['Preparing', 'Performing', 'Following up'],
  hang: [
    ['Book a room and check participants’ time zones.', 'Preparing'],
    ['Draft a process flow for participants to correct.', 'Preparing'],
    ['A scribe records decisions, actions with owners and open issues.', 'Performing'],
    ['Put diagrams on the walls and let people move sticky notes.', 'Performing'],
    ['Send the consolidated notes to participants for review within two days.', 'Following up'],
    ['Move each parking-lot item into the issue tracker with an owner and due date.', 'Following up'],
  ],
  giaiThich: '<p>Only those who supplied the requirements can judge whether they were captured correctly — so share notes quickly.</p>',
  goiY: ['Trước buổi ⇒ chuẩn bị; trong buổi ⇒ thực hiện; sau buổi ⇒ theo dõi.', 'Parking lot xử lý sau buổi.'],
  loiHayGap: ['Để ghi chú vài tuần mới gửi.', 'Không ai ghi chép trong buổi.'],
  thuatNgu: tn('elicitation'),
  khaiNiem: ['elicitation activities'],
});

const E2 = sapXep({
  tieuDe: 'Elicitation planning 2 — one session from start to finish',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Order the steps of one elicitation session.</p>', vi: '<p>Sắp các bước của một buổi khai thác.</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp các bước', dung: ['Plan the scope and agenda', 'Prepare questions and a straw-man model', 'Explain the approach to the participants', 'Elicit and take notes', 'Consolidate and share the notes for review', 'Log open issues with owners'], hien: [3, 5, 0, 2, 4, 1], giai: ['Prepare → perform → follow up.', 'Chuẩn bị → thực hiện → theo dõi.'] }],
  goiY: ['Câu hỏi và mô hình nháp được chuẩn bị trước buổi.', 'Ghi nhận vấn đề mở là bước theo dõi.'],
  loiHayGap: ['Soạn câu hỏi ngay trong buổi.', 'Bỏ bước gửi lại ghi chú.'],
  giaiThich: '<p>Scope and agenda → questions and straw man → explain the approach → elicit with notes → share notes → log open issues.</p>',
  thuatNgu: tn('elicitation'),
  khaiNiem: ['elicitation activities'],
});

const E3 = tracNghiem({
  tieuDe: 'Elicitation planning 3 — the elicitation plan',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A project-level elicitation plan covers: objectives (overall and per activity); strategy and techniques (which technique for which stakeholder group, depending on access); schedule and resource estimates (participants, BA preparation and follow-up time); documents and systems needed for independent elicitation; expected products; and elicitation risks.</p>', vi: '<p>Kế hoạch khai thác cấp dự án gồm gì.</p>' },
  cau: [
    { en: 'Which item belongs in an elicitation plan?', vi: 'Mục nào thuộc kế hoạch khai thác?', lc: [['a', 'Which technique is used with which stakeholder group, and why'], ['b', 'The database schema'], ['c', 'The test cases'], ['d', 'The deployment script']], dap: 'a', giai: ['Strategy and techniques.', 'Chiến lược và kỹ thuật.'] },
    { en: 'A BA estimates only the time of the sessions themselves. What is missing?', vi: 'BA chỉ ước lượng thời gian các buổi. Thiếu gì?', lc: [['a', 'Preparation and follow-up time, often as long as the sessions'], ['b', 'Nothing'], ['c', 'Coding time'], ['d', 'Holiday time']], dap: 'a', giai: ['Prepare + follow up.', 'Chuẩn bị + theo dõi.'] },
    { en: 'Key users are available only two hours a month. This is…', vi: 'Người dùng chính chỉ rảnh hai giờ mỗi tháng. Đây là…', lc: [['a', 'an elicitation risk to record in the plan, with a mitigation'], ['b', 'irrelevant'], ['c', 'a design decision'], ['d', 'a test failure']], dap: 'a', giai: ['Elicitation risks.', 'Rủi ro khai thác.'] },
  ],
  goiY: ['Kế hoạch: mục tiêu, kỹ thuật, lịch & nguồn lực, tài liệu, sản phẩm, rủi ro.', 'Thời gian chuẩn bị và theo dõi rất đáng kể.'],
  loiHayGap: ['Chỉ tính giờ họp.', 'Không ghi rủi ro về sự sẵn sàng của người dùng.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('elicitation'),
  khaiNiem: ['elicitation plan'],
});

const E4 = tracNghiem({
  tieuDe: 'Elicitation planning 4 — notes and open issues',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Organise and share the notes soon after the session: consolidate sources, update while fresh, keep the raw notes, and ask participants to review. Record each open issue in the issue tracker with notes, an owner and a due date.</p>', vi: '<p>Gửi ghi chú sớm, giữ ghi chú thô, ghi vấn đề mở kèm người phụ trách và hạn.</p>' },
  cau: [
    { en: 'Who can best judge whether requirements were captured correctly?', vi: 'Ai đánh giá tốt nhất việc ghi lại yêu cầu có đúng không?', lc: [['a', 'The people who supplied them'], ['b', 'The developers'], ['c', 'The BA alone'], ['d', 'The sponsor only']], dap: 'a', giai: ['Hence share notes for review.', 'Vì vậy gửi ghi chú để họ xem lại.'] },
    { en: 'Should the raw notes be thrown away after consolidation?', vi: 'Có nên vứt ghi chú thô sau khi tổng hợp?', lc: [['a', 'No — keep them as a source to check later'], ['b', 'Yes, always'], ['c', 'Only on agile projects'], ['d', 'Only if they are handwritten']], dap: 'a', giai: ['Keep the evidence.', 'Giữ bằng chứng.'] },
  ],
  goiY: ['Người cung cấp yêu cầu là người kiểm.', 'Giữ ghi chú thô.'],
  loiHayGap: ['Không gửi lại ghi chú.', 'Huỷ ghi chú thô.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('elicitation'),
  khaiNiem: ['following up'],
});

export default moDun({
  slug: 'swr302-3-4-ch7-planning',
  ten: '3.4 Planning and running elicitation',
  moTaModule: 'Ba giai đoạn chuẩn bị / thực hiện / theo dõi, trình tự một buổi khai thác, nội dung kế hoạch khai thác (kỹ thuật theo nhóm, thời gian chuẩn bị, rủi ro), ghi chú và vấn đề mở.',
  de: [E1, E2, E3, E4],
});
