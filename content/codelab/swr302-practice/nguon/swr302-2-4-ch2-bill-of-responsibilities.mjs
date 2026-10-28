/**
 * SWR302 · 2.4 — The customer's Requirements Bill of Responsibilities (Wiegers Ch.2 slides 19–29).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const TRACH = ['1 Educate BAs about your business', '2 Dedicate the time it takes', '3 Be specific and precise', '4 Make timely decisions', '5 Respect cost and feasibility assessments', '6 Set realistic priorities', '7 Review requirements and evaluate prototypes', '8 Establish acceptance criteria', '9 Promptly communicate changes', '10 Respect the requirements process'];

const E1 = phanLoai({
  tieuDe: 'Responsibilities 1 — which responsibility is neglected?',
  doKho: 'MEDIUM', phut: 9,
  moTa: { en: '<p>Wiegers’ ten customer responsibilities balance the ten rights. Each story shows a customer neglecting one of them. Name it.</p>', vi: '<p>Mười trách nhiệm của khách hàng cân bằng mười quyền. Mỗi câu chuyện cho thấy khách bỏ bê một trách nhiệm. Gọi tên.</p>' },
  cot: 'Responsibility neglected', luaChon: TRACH,
  hang: [
    ['The head nurse cancels three workshops in a row: "too busy".', '2 Dedicate the time it takes'],
    ['The sponsor marks all 120 requirements as "High".', '6 Set realistic priorities'],
    ['The client decided a month ago to drop a feature but told nobody.', '9 Promptly communicate changes'],
    ['"Make it fast and nice" — and the customer refuses to say more.', '3 Be specific and precise'],
    ['Developers estimate 6 weeks for a feature; the client insists "it is a 2-day job".', '5 Respect cost and feasibility assessments'],
    ['A question about the refund rule has waited three weeks for an answer; coding is blocked.', '4 Make timely decisions'],
    ['Nobody on the client side opens the prototype the team sent.', '7 Review requirements and evaluate prototypes'],
    ['The client cannot say how they will decide whether the release is acceptable.', '8 Establish acceptance criteria'],
    ['Staff use internal jargon and expect the BA to just know it.', '1 Educate BAs about your business'],
  ],
  giaiThich: '<p>Rights without responsibilities do not work: the customer must invest time, precision, decisions and reviews for the BA and developers to deliver what they need.</p>',
  goiY: ['Không trả lời câu hỏi ⇒ quyết định không kịp thời.', 'Mọi thứ đều "High" ⇒ ưu tiên không thực tế.'],
  loiHayGap: ['Nhầm "không dành thời gian" với "không review prototype".', 'Nhầm "đổi ý mà không báo" với "không cụ thể".'],
  thuatNgu: [{ en: 'Bill of Responsibilities', vi: 'Bản trách nhiệm của khách hàng về yêu cầu' }],
  khaiNiem: ['customer responsibilities'],
});

const E2 = phanLoai({
  tieuDe: 'Responsibilities 2 — a right or a responsibility?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Each statement comes from either the customer’s <b>Bill of Rights</b> (what the customer can expect from the BA and developers) or the <b>Bill of Responsibilities</b> (what the customer owes the project). Classify.</p>', vi: '<p>Mỗi phát biểu thuộc <b>Quyền</b> hoặc <b>Trách nhiệm</b> của khách hàng. Phân loại.</p>' },
  cot: 'Bill', luaChon: ['Right', 'Responsibility'],
  hang: [
    ['Expect BAs to speak your language.', 'Right'],
    ['Dedicate the time it takes to provide requirements.', 'Responsibility'],
    ['Change your requirements.', 'Right'],
    ['Promptly communicate changes to the requirements.', 'Responsibility'],
    ['Hear ideas and alternatives for your requirements.', 'Right'],
    ['Set realistic priorities.', 'Responsibility'],
  ],
  giaiThich: '<p>Note how they pair: the right to change requirements comes with the responsibility to communicate changes promptly through the change process.</p>',
  goiY: ['"Expect / receive / hear" ⇒ quyền.', '"Dedicate / set / communicate" ⇒ trách nhiệm.'],
  loiHayGap: ['Coi "thay đổi yêu cầu" là trách nhiệm.', 'Coi "đặt ưu tiên thực tế" là quyền.'],
  thuatNgu: [{ en: 'Bill of Rights', vi: 'Bản quyền lợi của khách hàng về yêu cầu' }],
  khaiNiem: ['rights and responsibilities'],
});

const E3 = tracNghiem({
  tieuDe: 'Responsibilities 3 — making requirements attainable',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Responsibility #5: respect developers’ cost and feasibility assessments, and consider rewriting a requirement to make it attainable (e.g. "instantaneously" → "within 50 ms"). Responsibility #3: be specific — TBD markers may flag needed exploration, but must not hide a hard decision nobody will make.</p>', vi: '<p>Tôn trọng đánh giá chi phí/khả thi và viết lại yêu cầu để đạt được; cụ thể, không để TBD che quyết định khó.</p>' },
  cau: [
    { en: 'Developers say "update instantly" is impossible over the hospital network. Best customer response?', vi: 'Dev nói "cập nhật tức thì" không khả thi trên mạng bệnh viện. Khách nên phản hồi thế nào?', lc: [['a', 'Agree a measurable, attainable target such as "within 2 seconds for 95% of updates"'], ['b', 'Insist on "instantly"'], ['c', 'Drop the requirement silently'], ['d', 'Hire other developers']], dap: 'a', giai: ['Rewrite to make it attainable and verifiable.', 'Viết lại cho khả thi và kiểm được.'] },
    { en: 'The SRS has had "Refund policy: TBD" for two months and nobody owns it. This violates…', vi: 'SRS ghi "Chính sách hoàn tiền: TBD" hai tháng, không ai phụ trách. Điều này vi phạm…', lc: [['a', 'being specific and precise (and making timely decisions)'], ['b', 'the right to change requirements'], ['c', 'nothing — TBD is fine forever'], ['d', 'acceptance criteria only']], dap: 'a', giai: ['TBD must not hide an avoided decision.', 'TBD không được che một quyết định bị né.'] },
    { en: 'Why should customers review requirements in small chunks throughout the project?', vi: 'Vì sao khách nên review yêu cầu từng phần nhỏ suốt dự án?', lc: [['a', 'Early, frequent reviews find defects when they are cheap; a giant tome at the end is rarely reviewed well'], ['b', 'To slow the BA down'], ['c', 'Because the template says so'], ['d', 'It makes no difference']], dap: 'a', giai: ['Responsibility #7.', 'Trách nhiệm #7.'] },
  ],
  goiY: ['"Tức thì" ⇒ đổi thành con số đạt được.', 'TBD cần người phụ trách và hạn.'],
  loiHayGap: ['Giữ yêu cầu bất khả thi.', 'Để TBD trôi mãi.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('tbd', 'verifiable'),
  khaiNiem: ['customer responsibilities'],
});

const E4 = tracNghiem({
  tieuDe: 'Responsibilities 4 — respecting the process',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Responsibility #10: respect the requirements process. Eliciting and specifying requirements is one of the hardest parts of software; there is a rationale behind the BA’s approach. Responsibility #9: route every change through the project’s change-control process.</p>', vi: '<p>Tôn trọng quy trình yêu cầu; mọi thay đổi đi qua quy trình kiểm soát thay đổi.</p>' },
  cau: [
    { en: 'The client e-mails a developer directly: "add a field to the form, it’s tiny". The developer should…', vi: 'Khách e-mail thẳng cho dev: "thêm một trường vào form, nhỏ thôi". Dev nên…', lc: [['a', 'Redirect it to the BA / change-control process so its impact is analysed and nothing is lost'], ['b', 'Add it immediately'], ['c', 'Ignore the e-mail'], ['d', 'Reply that changes are forbidden']], dap: 'a', giai: ['Changes go through one consistent process.', 'Thay đổi đi qua một quy trình thống nhất.'] },
    { en: 'A stakeholder asks why the BA needs so much detail about exceptions. The best attitude is…', vi: 'Một bên liên quan hỏi vì sao BA cần nhiều chi tiết về ngoại lệ. Thái độ đúng là…', lc: [['a', 'Ask the BA to explain the reason, then cooperate — much of the code handles exceptions'], ['b', 'Refuse to answer'], ['c', 'Let developers guess the exceptions'], ['d', 'Skip exceptions']], dap: 'a', giai: ['Mutual understanding makes the process work.', 'Hiểu nhau thì quy trình mới chạy.'] },
  ],
  goiY: ['Thay đổi nhỏ cũng phải qua quy trình.', 'Hỏi "vì sao" rồi hợp tác.'],
  loiHayGap: ['Thêm thẳng thay đổi "nhỏ".', 'Bỏ qua ngoại lệ.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('ccb'),
  khaiNiem: ['customer responsibilities'],
});

export default moDun({
  slug: 'swr302-2-4-ch2-bill-of-responsibilities',
  ten: '2.4 The customer’s Bill of Responsibilities',
  moTaModule: 'Mười trách nhiệm của khách hàng về yêu cầu: gọi tên trách nhiệm bị bỏ bê trong 9 tình huống, phân biệt quyền / trách nhiệm, viết lại yêu cầu cho khả thi, TBD và quy trình thay đổi.',
  de: [E2, E1, E3, E4],
});
