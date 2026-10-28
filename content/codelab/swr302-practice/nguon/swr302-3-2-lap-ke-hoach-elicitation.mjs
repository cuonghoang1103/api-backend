/**
 * SWR302 · 3.2 — Planning and conducting elicitation; avoiding pitfalls (Wiegers Ch.7 slides 22–26).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = sapXep({
  tieuDe: 'Elicitation planning 1 — the life of an interview',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers splits each elicitation activity into <b>prepare → perform → follow up</b>. Put the steps of one interview with the head of a dormitory in order.</p>', vi: '<p>Wiegers chia mỗi hoạt động khai thác thành <b>chuẩn bị → thực hiện → theo dõi</b>. Sắp thứ tự các bước của một buổi phỏng vấn trưởng ký túc xá.</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp các bước', dung: ['Define the goal of the interview and read the dormitory rules', 'Prepare open questions and a draft process model', 'Send the invitation with the goal and the agenda', 'Run the interview, stay in scope and take notes', 'Summarise the notes and send them to the interviewee within a day', 'Classify the input and record open issues'], hien: [3, 5, 0, 4, 2, 1], giai: ['Prepare (goal, questions, invitation) → perform → follow up (notes, classification, issues).', 'Chuẩn bị → thực hiện → theo dõi.'] }],
  goiY: ['Mục tiêu và tài liệu đọc trước luôn ở đầu.', 'Ghi chú gửi lại người được phỏng vấn để họ xác nhận — thuộc phần theo dõi.'],
  loiHayGap: ['Phân loại đầu vào ngay trong buổi phỏng vấn thay vì sau đó.', 'Không gửi lại ghi chú để xác nhận.'],
  giaiThich: '<p>Prepare → perform → follow up.</p>',
  thuatNgu: [{ en: 'agenda', vi: 'chương trình buổi làm việc' }, { en: 'follow-up', vi: 'theo dõi sau buổi làm việc' }],
  khaiNiem: ['elicitation lifecycle'],
});

const E2 = phanLoai({
  tieuDe: 'Elicitation planning 2 — open, closed or leading question?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Open questions invite a description; closed questions ask for a fact or a choice; leading questions suggest the answer the asker wants. Classify the questions a BA prepared for the dormitory interview.</p>', vi: '<p>Câu hỏi mở mời mô tả; câu hỏi đóng hỏi một dữ kiện hay một lựa chọn; câu hỏi dẫn dắt gợi sẵn câu trả lời người hỏi muốn. Phân loại câu hỏi BA chuẩn bị cho buổi phỏng vấn KTX.</p>' },
  cot: 'Kind', luaChon: ['Open', 'Closed', 'Leading'],
  hang: [
    ['How do students report a broken air conditioner today?', 'Open'],
    ['How many rooms does building B have?', 'Closed'],
    ['You would prefer an app to the paper form, right?', 'Leading'],
    ['What happens when two students report the same problem?', 'Open'],
    ['Do repairs happen on weekends — yes or no?', 'Closed'],
    ['Surely the slow repairs are the technicians’ fault?', 'Leading'],
    ['Can you walk me through the last repair that went wrong?', 'Open'],
  ],
  giaiThich: '<p>Use open questions to explore, closed ones to confirm facts, and avoid leading questions — they put the BA’s solution into the customer’s mouth.</p>',
  goiY: ['Câu bắt đầu bằng How/What/Walk me through thường là câu mở.', 'Câu gợi sẵn đáp án ("right?", "surely") là câu dẫn dắt.'],
  loiHayGap: ['Coi câu hỏi số lượng là câu mở.', 'Không nhận ra câu dẫn dắt có đuôi "right?".'],
  thuatNgu: [{ en: 'open / closed / leading question', vi: 'câu hỏi mở / đóng / dẫn dắt' }],
  khaiNiem: ['interview questions'],
});

const E3 = phanLoai({
  tieuDe: 'Elicitation planning 3 — pitfalls and their remedies',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Common elicitation pitfalls and what a good BA does about them. Match each pitfall with its remedy.</p>', vi: '<p>Những cái bẫy thường gặp khi khai thác và cách BA giỏi xử lý. Ghép mỗi bẫy với cách khắc phục.</p>' },
  cotCau: 'Pitfall', cot: 'Remedy',
  luaChon: ['Keep a parking lot of off-topic items and return to the agenda', 'Ask "why?" until you reach the underlying need', 'Invite representatives of every user class and the decision makers', 'Ask about exceptions: "what if… fails?"', 'Write down assumptions and confirm them with the stakeholders', 'Give the participants the goal and materials in advance'],
  hang: [
    ['The workshop drifts into a debate about the colour of the app.', 'Keep a parking lot of off-topic items and return to the agenda'],
    ['A manager says "we need a chatbot" without saying why.', 'Ask "why?" until you reach the underlying need'],
    ['Only managers attended; no student or technician was there.', 'Invite representatives of every user class and the decision makers'],
    ['Everyone describes the happy path; nobody mentions what happens when a part is out of stock.', 'Ask about exceptions: "what if… fails?"'],
    ['The BA "knows" how dormitories work and does not check.', 'Write down assumptions and confirm them with the stakeholders'],
    ['Participants arrive without having read anything and spend an hour catching up.', 'Give the participants the goal and materials in advance'],
  ],
  giaiThich: '<p>Stay in scope, dig for needs behind solutions, get the right people, explore exceptions, surface assumptions, prepare participants.</p>',
  goiY: ['Ý tưởng giải pháp ⇒ hỏi "vì sao".', 'Chỉ có đường thuận ⇒ hỏi "nếu … hỏng thì sao".'],
  loiHayGap: ['Ghép "chỉ có quản lý tham dự" với "gửi tài liệu trước".', 'Bỏ qua giả định của chính BA.'],
  thuatNgu: [{ en: 'parking lot', vi: 'bảng "để sau" — ghi ý ngoài chủ đề để không lạc buổi họp' }],
  khaiNiem: ['elicitation pitfalls'],
});

const E4 = tracNghiem({
  tieuDe: 'Elicitation planning 4 — the elicitation plan',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>An elicitation plan states the objectives, the techniques and their order, the schedule and effort, the participants, the documents and systems to study, the expected products and the risks.</p>', vi: '<p>Kế hoạch khai thác nêu mục tiêu, kỹ thuật và thứ tự, lịch và công sức, người tham gia, tài liệu và hệ thống cần nghiên cứu, sản phẩm mong đợi và rủi ro.</p>' },
  cau: [
    { en: 'Which item does NOT belong in an elicitation plan?', vi: 'Mục nào KHÔNG thuộc kế hoạch khai thác?', lc: [['a', 'Elicitation objectives'], ['b', 'Planned techniques and their order'], ['c', 'The database schema'], ['d', 'Expected products of each session']], dap: 'c', giai: ['The database design is not part of planning elicitation.', 'Thiết kế CSDL không thuộc kế hoạch khai thác.'] },
    { en: 'Why plan the ORDER of techniques?', vi: 'Vì sao phải lập THỨ TỰ kỹ thuật?', lc: [['a', 'It does not matter'], ['b', 'Early techniques (document analysis, interviews) prepare later ones (workshops, prototypes)'], ['c', 'To please the sponsor'], ['d', 'Because tools require it']], dap: 'b', giai: ['You arrive at a workshop with a straw-man model from the earlier work.', 'Bạn tới workshop với mô hình nháp từ các bước trước.'] },
    { en: 'A risk of the dormitory elicitation is that students are on holiday in August. Where do you write it?', vi: 'Một rủi ro của việc khai thác KTX là sinh viên nghỉ hè tháng 8. Ghi ở đâu?', lc: [['a', 'Nowhere'], ['b', 'In the risks of the elicitation plan, with a mitigation such as an online questionnaire'], ['c', 'In the SRS functional requirements'], ['d', 'In the code comments']], dap: 'b', giai: ['Planned risks come with mitigations.', 'Rủi ro được lập kế hoạch kèm cách giảm thiểu.'] },
  ],
  goiY: ['Kế hoạch khai thác nói về CÁCH làm yêu cầu, không về thiết kế.', 'Kỹ thuật trước chuẩn bị đầu vào cho kỹ thuật sau.'],
  loiHayGap: ['Lẫn kế hoạch khai thác với kế hoạch dự án tổng.', 'Bỏ qua rủi ro về lịch của người tham gia.'],
  giaiThich: '<p>Answers: c · b · b.</p>',
  thuatNgu: [{ en: 'elicitation plan', vi: 'kế hoạch khai thác' }, { en: 'mitigation', vi: 'biện pháp giảm thiểu rủi ro' }],
  khaiNiem: ['elicitation plan'],
});

export default moDun({
  slug: 'swr302-3-2-lap-ke-hoach-elicitation',
  ten: '3.2 Planning and conducting elicitation',
  moTaModule: 'Vòng đời một buổi khai thác (chuẩn bị → thực hiện → theo dõi), câu hỏi mở/đóng/dẫn dắt, sáu cái bẫy khi khai thác và cách khắc phục, nội dung kế hoạch khai thác.',
  de: [E1, E2, E3, E4],
});
