/**
 * SWR302 · 19B.2 — From requirements to designs, code, tests and success (Wiegers Ch.19 slides 7–13).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Requirements to design 1 — which downstream front?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Requirements flow downstream into <b>architecture and allocation</b> (subsystems, hardware/software split, driven by functionality, quality attributes and constraints), <b>software design</b> (components, classes, interfaces), <b>user interface design</b> (dialog maps, wireframes, the display-action-response model) and <b>tests</b>. Which front does each activity belong to?</p>', vi: '<p>Yêu cầu chảy xuống kiến trúc & phân bổ, thiết kế phần mềm, thiết kế giao diện, kiểm thử.</p>' },
  cot: 'Front', luaChon: ['Architecture and allocation', 'Software design', 'User interface design', 'Tests'],
  hang: [
    ['The 99.9% availability requirement leads to two redundant servers.', 'Architecture and allocation'],
    ['The analysis class diagram is elaborated into a detailed object model.', 'Software design'],
    ['A display-action-response table lists what each button on the booking screen does.', 'User interface design'],
    ['Each user requirement gets acceptance tests reviewed with the users.', 'Tests'],
    ['The access-control requirements are split between door hardware and the control software.', 'Architecture and allocation'],
  ],
  giaiThich: '<p>Quality attributes and constraints mostly shape the architecture; functional requirements shape the detailed design; usage requirements shape the UI; all requirements shape the tests.</p>',
  goiY: ['Thuộc tính chất lượng ⇒ kiến trúc.', 'Bảng DAR ⇒ thiết kế giao diện.'],
  loiHayGap: ['Nghĩ yêu cầu chất lượng chỉ ảnh hưởng test.', 'Nhầm DAR với ERD.'],
  thuatNgu: tn('qualityAttr', 'dialogMap'),
  khaiNiem: ['requirements to design'],
});

const E2 = tracNghiem({
  tieuDe: 'Requirements to design 2 — the DAR model',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>A display-action-response (DAR) model documents the UI elements of each screen: what is <b>displayed</b> (and when), the <b>actions</b> a user can take on each element, and the system’s <b>response</b>. Paired with a visual design, it bridges "what the screen looks like" and "what it does".</p>', vi: '<p>Mô hình DAR: hiển thị – hành động – phản hồi cho từng phần tử giao diện.</p>' },
  cau: [
    { en: 'Which row belongs in a DAR table for the "Cancel appointment" button?', vi: 'Dòng nào thuộc bảng DAR cho nút "Huỷ lịch hẹn"?', lc: [['a', 'Display: only if the appointment starts in more than 2 hours · Action: click · Response: ask for confirmation, then cancel and show a message'], ['b', 'The button is red'], ['c', 'The developer who coded it'], ['d', 'The database table name']], dap: 'a', giai: ['Display condition, action, response.', 'Điều kiện hiển thị, hành động, phản hồi.'] },
    { en: 'Why pair a DAR model with a high-fidelity screen design?', vi: 'Vì sao ghép DAR với thiết kế màn hình chi tiết?', lc: [['a', 'The design shows how it looks; the DAR shows how it behaves — neither alone is complete'], ['b', 'To make the document longer'], ['c', 'DAR replaces the design'], ['d', 'Only for testers']], dap: 'a', giai: ['Look + behaviour.', 'Hình thức + hành vi.'] },
  ],
  goiY: ['DAR = hiển thị khi nào, làm gì được, hệ thống phản ứng gì.', 'Hình + hành vi.'],
  loiHayGap: ['Ghi màu sắc thay vì hành vi.', 'Nghĩ ảnh màn hình là đủ.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'display-action-response (DAR) model', vi: 'mô hình hiển thị – hành động – phản hồi' }],
  khaiNiem: ['DAR model'],
});

const E3 = tracNghiem({
  tieuDe: 'Requirements to design 3 — requirements and tests',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>"Good requirements engineering produces better tests; good test analysis produces better requirements." Test the product against what it was intended to do — the requirements — not against its design or code. Include testers in requirements reviews so requirements are verifiable.</p>', vi: '<p>Kiểm sản phẩm theo yêu cầu, không theo thiết kế/code; mời tester review yêu cầu.</p>' },
  cau: [
    { en: 'A tester writes tests by reading the code. What is the risk?', vi: 'Tester viết test bằng cách đọc code. Rủi ro là gì?', lc: [['a', 'The tests confirm what the code does, not what it should do — wrong behaviour passes'], ['b', 'None'], ['c', 'Tests run slower'], ['d', 'The code gets longer']], dap: 'a', giai: ['Test against requirements.', 'Kiểm theo yêu cầu.'] },
    { en: 'Why invite testers to requirements reviews?', vi: 'Vì sao mời tester vào buổi review yêu cầu?', lc: [['a', 'They spot requirements that cannot be verified and missing expected results'], ['b', 'To count pages'], ['c', 'To write code'], ['d', 'They should not be invited']], dap: 'a', giai: ['Verifiability.', 'Tính kiểm chứng được.'] },
  ],
  goiY: ['Test theo yêu cầu.', 'Tester giúp yêu cầu kiểm được.'],
  loiHayGap: ['Viết test từ code.', 'Không mời tester.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('verifiable'),
  khaiNiem: ['requirements and tests'],
});

const E4 = tracNghiem({
  tieuDe: 'Requirements to design 4 — requirements and success',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>It is faster to read the requirements before implementation than to build the wrong system and rebuild it correctly — and faster still to engage the development team early so they take part in requirements work, prototyping or iterative development.</p>', vi: '<p>Đọc yêu cầu trước khi làm nhanh hơn làm sai rồi làm lại; mời đội phát triển tham gia sớm còn nhanh hơn.</p>' },
  cau: [
    { en: 'What does Wiegers recommend about involving developers?', vi: 'Wiegers khuyên gì về việc mời dev tham gia?', lc: [['a', 'Engage them early in requirements work, prototyping or iterative development'], ['b', 'Give them the final SRS only at the end'], ['c', 'Keep them away from users'], ['d', 'Let them skip the requirements']], dap: 'a', giai: ['Early engagement.', 'Tham gia sớm.'] },
  ],
  goiY: ['Dev tham gia sớm.', 'Đọc yêu cầu trước khi làm.'],
  loiHayGap: ['"Ném" SRS sang đội dev vào phút chót.', 'Dev không cần đọc yêu cầu.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('requirement'),
  khaiNiem: ['requirements and success'],
});

export default moDun({
  slug: 'swr302-19b-2-ch19-design-tests',
  ten: '8.3 From requirements to design, code and tests',
  moTaModule: 'Yêu cầu chảy xuống kiến trúc & phân bổ, thiết kế phần mềm, thiết kế giao diện (mô hình DAR) và kiểm thử; kiểm theo yêu cầu chứ không theo code; đội phát triển tham gia sớm.',
  de: [E1, E2, E3, E4],
});
