/**
 * SWR302 · 3.3 — The elicitation technique toolbox (Wiegers Ch.7 slides 1–21).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const KT = ['Interviews', 'Workshops', 'Focus groups', 'Observations', 'Questionnaires', 'System interface analysis', 'User interface analysis', 'Document analysis', 'Brainstorming', 'Prototyping', 'Storyboards'];

const E1 = phanLoai({
  tieuDe: 'Techniques 1 — facilitated or independent?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Two families of elicitation techniques: <b>facilitated</b> techniques interact with stakeholders (mainly discovering business and user requirements); <b>independent</b> techniques are done by the analyst alone to discover information and functionality users may not be aware of. Classify.</p>', vi: '<p>Hai họ kỹ thuật: có điều phối (làm cùng bên liên quan) và độc lập (BA tự làm).</p>' },
  cot: 'Family', luaChon: ['Facilitated', 'Independent'],
  hang: [['Interviews', 'Facilitated'], ['Document analysis', 'Independent'], ['Workshops', 'Facilitated'], ['System interface analysis', 'Independent'], ['Focus groups', 'Facilitated'], ['User interface analysis', 'Independent']],
  giaiThich: '<p>Most projects combine both: facilitated techniques bring out what people know; independent ones reveal what they forgot or never knew.</p>',
  goiY: ['Có mặt bên liên quan ⇒ có điều phối.', 'BA tự đọc/tự xem hệ thống ⇒ độc lập.'],
  loiHayGap: ['Xếp phân tích giao diện vào có điều phối.', 'Nghĩ chỉ dùng một họ là đủ.'],
  thuatNgu: tn('elicitation'),
  khaiNiem: ['elicitation techniques'],
});

const E2 = phanLoai({
  tieuDe: 'Techniques 2 — which technique fits?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Choose the best technique for each situation.</p>', vi: '<p>Chọn kỹ thuật tốt nhất cho từng tình huống.</p>' },
  cot: 'Technique', luaChon: KT,
  hang: [
    ['You need many candidate ideas for a loyalty feature quickly, without early criticism.', 'Brainstorming'],
    ['The new app must exchange orders with the courier’s system.', 'System interface analysis'],
    ['You replace an old desktop app; its screens show what users do today.', 'User interface analysis'],
    ['You want users’ feedback on how a task flows, with a few quick sketches of the screens in sequence.', 'Storyboards'],
    ['3,000 drivers across the country must rate the importance of 10 features.', 'Questionnaires'],
    ['You need to understand a task users find hard to describe in words.', 'Observations'],
    ['Users and developers are unsure whether the proposed screen layout works.', 'Prototyping'],
    ['New regulations and the old specification must be checked for requirements.', 'Document analysis'],
  ],
  giaiThich: '<p>Select by project characteristics, not habit: many BAs default to interviews and workshops and forget techniques that would be cheaper or more effective.</p>',
  goiY: ['Nhiều người, ở xa ⇒ questionnaire.', 'Chuỗi phác thảo màn hình theo bước ⇒ storyboard.'],
  loiHayGap: ['Phỏng vấn 3.000 tài xế.', 'Nhầm storyboard với prototype.'],
  thuatNgu: tn('elicitation', 'prototype'),
  khaiNiem: ['choosing elicitation techniques'],
});

const E3 = tracNghiem({
  tieuDe: 'Techniques 3 — interviews and workshops done well',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Interviews: establish rapport, stay in scope, prepare questions and straw-man models (people critique more easily than create), suggest ideas, listen actively and paraphrase. Workshops: ground rules, all roles filled (facilitator, scribe, timekeeper), an agenda, a parking lot, time-boxed topics, a small team of the right people (5–6).</p>', vi: '<p>Phỏng vấn và workshop hiệu quả.</p>' },
  cau: [
    { en: 'Why bring a straw-man model to an interview?', vi: 'Vì sao mang mô hình nháp (straw man) tới buổi phỏng vấn?', lc: [['a', 'People critique an existing draft more easily than they create from nothing'], ['b', 'To finish the interview faster without listening'], ['c', 'To show off'], ['d', 'It replaces the interview']], dap: 'a', giai: ['Easier to correct than to create.', 'Sửa dễ hơn tạo mới.'] },
    { en: 'An important but off-topic issue comes up in a workshop. The facilitator should…', vi: 'Một vấn đề quan trọng nhưng lạc đề nảy ra trong workshop. Người điều phối nên…', lc: [['a', 'Put it in the parking lot and come back to it later'], ['b', 'Spend the rest of the session on it'], ['c', 'Ignore it forever'], ['d', 'End the workshop']], dap: 'a', giai: ['Parking lot.', 'Bãi đỗ (parking lot).'] },
    { en: 'The ideal size of a requirements workshop is…', vi: 'Quy mô lý tưởng của một workshop yêu cầu là…', lc: [['a', 'about 5–6 of the right people; run parallel workshops for different user classes'], ['b', 'as many people as possible'], ['c', 'only the BA'], ['d', '30 people']], dap: 'a', giai: ['Small but right.', 'Nhỏ nhưng đúng người.'] },
  ],
  goiY: ['Bản nháp giúp người dùng phản biện.', 'Lạc đề ⇒ parking lot.'],
  loiHayGap: ['Đi phỏng vấn tay không.', 'Workshop 30 người.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: [{ en: 'straw-man model', vi: 'mô hình nháp để người khác phản biện' }, { en: 'parking lot', vi: 'danh sách vấn đề tạm gác để xử lý sau' }],
  khaiNiem: ['interviews', 'workshops'],
});

const E4 = tracNghiem({
  tieuDe: 'Techniques 4 — observation, questionnaires and analysis traps',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Observation may be passive (watch without interfering; protocol analysis — the performer explains while working; ethnography — long-term) or active (you join the work). Questionnaires suffer from biases; use a representative sample, unbiased and unambiguous questions, and redundant questions to detect inconsistency. User interface analysis: do not assume the new system needs a function just because the old one had it. Document analysis: documents may be out of date.</p>', vi: '<p>Quan sát, bảng hỏi và các bẫy khi phân tích giao diện/tài liệu.</p>' },
  cau: [
    { en: 'A clerk explains aloud what she is doing while processing an invoice. This is…', vi: 'Nhân viên vừa xử lý hoá đơn vừa nói to điều mình đang làm. Đây là…', lc: [['a', 'protocol analysis (passive observation)'], ['b', 'a questionnaire'], ['c', 'a focus group'], ['d', 'active observation']], dap: 'a', giai: ['The performer explains concurrently.', 'Người làm giải thích song song.'] },
    { en: 'Why add redundant questions to a questionnaire?', vi: 'Vì sao thêm câu hỏi trùng ý vào bảng hỏi?', lc: [['a', 'To detect inconsistent or careless answers'], ['b', 'To make it longer'], ['c', 'To confuse respondents'], ['d', 'They are never useful']], dap: 'a', giai: ['Consistency check.', 'Kiểm tính nhất quán.'] },
    { en: 'The old system has a "fax order" screen. Should the new one?', vi: 'Hệ thống cũ có màn hình "đặt hàng qua fax". Hệ thống mới có nên có?', lc: [['a', 'Not automatically — confirm the need still exists'], ['b', 'Yes, copy every old screen'], ['c', 'Yes, it is in the documents'], ['d', 'Only if it is easy']], dap: 'a', giai: ['Old functionality is a lead, not a requirement.', 'Chức năng cũ là manh mối, chưa phải yêu cầu.'] },
  ],
  goiY: ['Vừa làm vừa nói ⇒ protocol analysis.', 'Cái cũ có chưa chắc cái mới cần.'],
  loiHayGap: ['Sao chép mọi chức năng của hệ thống cũ.', 'Tin tài liệu cũ là đúng hiện tại.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: [{ en: 'protocol analysis', vi: 'phân tích giao thức — người làm vừa làm vừa giải thích' }],
  khaiNiem: ['observation', 'questionnaires'],
});

export default moDun({
  slug: 'swr302-3-3-ch7-techniques',
  ten: '3.3 The elicitation technique toolbox',
  moTaModule: 'Kỹ thuật có điều phối vs độc lập, chọn kỹ thuật cho 8 tình huống (brainstorming, storyboard, phân tích giao diện…), phỏng vấn và workshop tốt, quan sát, bảng hỏi và các bẫy.',
  de: [E1, E2, E3, E4],
});
