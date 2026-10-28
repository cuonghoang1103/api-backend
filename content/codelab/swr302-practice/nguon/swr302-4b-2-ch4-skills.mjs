/**
 * SWR302 · 4B.2 — The fourteen essential analyst skills (Wiegers Ch.4 slides 16–30).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const KN = ['Listening', 'Interviewing and questioning', 'Thinking on your feet', 'Analytical', 'Systems thinking', 'Learning', 'Facilitation', 'Leadership', 'Observational', 'Communication', 'Organizational', 'Modeling', 'Interpersonal', 'Creativity'];

const E1 = phanLoai({
  tieuDe: 'BA skills 1 — which skill is at work?',
  doKho: 'MEDIUM', phut: 9,
  moTa: { en: '<p>Wiegers lists fourteen essential skills of a business analyst. Name the main skill each BA is using.</p>', vi: '<p>Wiegers liệt kê mười bốn kỹ năng thiết yếu của BA. Gọi tên kỹ năng chính mà mỗi BA đang dùng.</p>' },
  cot: 'Skill', luaChon: KN,
  hang: [
    ['Lan restates what the head nurse said and notices the nurse hesitated when talking about night shifts.', 'Listening'],
    ['Minh asks: "And what happens if the scanner cannot read the wristband?"', 'Interviewing and questioning'],
    ['In the middle of a meeting, Hoa spots that the new request contradicts what finance said yesterday.', 'Thinking on your feet'],
    ['Tuan checks whether changing the discount rule in the shop affects the accounting and loyalty systems.', 'Systems thinking'],
    ['Thu runs a workshop of 12 people from 4 departments and keeps it neutral and on track.', 'Facilitation'],
    ['Watching cashiers, Nam sees them write customer phone numbers on paper — something nobody mentioned.', 'Observational'],
    ['Linh turns 300 sticky notes, e-mails and interview notes into a structured requirements repository.', 'Organizational'],
    ['An draws a state diagram so developers see every status of an order.', 'Modeling'],
    ['Khoa proposes a "repeat last order" feature that customers had never thought of, and asks them first.', 'Creativity'],
    ['Mai writes a one-page summary for executives and a detailed version for developers.', 'Communication'],
  ],
  giaiThich: '<p>A BA uses many skills at once; the exam usually asks you to recognise the dominant one from the behaviour described.</p>',
  goiY: ['Nhắc lại, đọc giữa các dòng ⇒ lắng nghe.', 'Thấy điều người dùng không nói khi quan sát ⇒ observational.'],
  loiHayGap: ['Nhầm systems thinking với analytical.', 'Nhầm facilitation với leadership.'],
  thuatNgu: [{ en: 'active listening', vi: 'lắng nghe chủ động' }, { en: 'systems thinking', vi: 'tư duy hệ thống' }],
  khaiNiem: ['business analyst skills'],
});

const E2 = tracNghiem({
  tieuDe: 'BA skills 2 — analytical skill and creativity',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Analytical skill: move between high and low levels of abstraction, reconcile conflicting information, separate wants from real needs, and distinguish solution ideas from requirements. Creativity: invent potential requirements for customers to consider — but avoid gold plating: never add requirements without customer approval.</p>', vi: '<p>Kỹ năng phân tích và sáng tạo — nhưng không mạ vàng.</p>' },
  cau: [
    { en: 'A BA has a great idea for a feature nobody asked for. What should she do?', vi: 'BA có ý tưởng hay cho một tính năng không ai yêu cầu. Cô ấy nên làm gì?', lc: [['a', 'Propose it to the customers and add it only if they approve'], ['b', 'Add it to the SRS — it is a good idea'], ['c', 'Ask a developer to build it quietly'], ['d', 'Forget it']], dap: 'a', giai: ['Creativity yes, gold plating no.', 'Sáng tạo có, mạ vàng không.'] },
    { en: 'One user says "I want a button to export to Excel." The analytical BA asks…', vi: 'Một người dùng nói "Tôi muốn nút xuất Excel." BA có tư duy phân tích sẽ hỏi…', lc: [['a', '"What do you do with the data afterwards?" — to find the real need behind the solution'], ['b', 'Nothing; writes it down'], ['c', '"Which Excel version?"'], ['d', '"Can it be a PDF?"']], dap: 'a', giai: ['Separate solution ideas from needs.', 'Tách ý tưởng giải pháp khỏi nhu cầu.'] },
    { en: 'Generalising one user’s request into a requirement for a whole user class uses…', vi: 'Khái quát yêu cầu của một người thành yêu cầu cho cả lớp người dùng là dùng…', lc: [['a', 'analytical skill (moving between levels of abstraction)'], ['b', 'listening only'], ['c', 'modeling only'], ['d', 'interpersonal skill']], dap: 'a', giai: ['High and low levels of abstraction.', 'Các mức trừu tượng cao và thấp.'] },
  ],
  goiY: ['Ý tưởng mới ⇒ đề xuất, chờ duyệt.', 'Hỏi "để làm gì" để tìm nhu cầu thật.'],
  loiHayGap: ['Tự thêm tính năng "hay".', 'Ghi giải pháp thành yêu cầu.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('goldPlating'),
  khaiNiem: ['analytical skills', 'creativity'],
});

const E3 = tracNghiem({
  tieuDe: 'BA skills 3 — learning, interpersonal, leadership',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Learning: absorb new domains fast and be honest about what you do not know — not knowing is fine, hiding ignorance is not. Interpersonal: get people with competing interests to work as a team, speak the audience’s language. Leadership: influence stakeholders toward a common goal, negotiate and resolve conflicts.</p>', vi: '<p>Học hỏi, giao tiếp liên cá nhân, lãnh đạo.</p>' },
  cau: [
    { en: 'A doctor uses a medical term the BA does not know. Best behaviour?', vi: 'Bác sĩ dùng thuật ngữ y khoa BA không biết. Cách cư xử tốt nhất?', lc: [['a', 'Ask what it means and add it to the glossary'], ['b', 'Nod and look it up later, maybe'], ['c', 'Pretend to know'], ['d', 'Change the topic']], dap: 'a', giai: ['Be honest about what you do not know.', 'Thành thật về điều mình chưa biết.'] },
    { en: 'With business people, the BA should avoid…', vi: 'Với người nghiệp vụ, BA nên tránh…', lc: [['a', 'technical jargon such as "REST endpoint" or "foreign key"'], ['b', 'the business vocabulary'], ['c', 'examples'], ['d', 'diagrams']], dap: 'a', giai: ['Speak the audience’s language.', 'Nói ngôn ngữ của người nghe.'] },
  ],
  goiY: ['Không biết thì hỏi.', 'Tránh thuật ngữ kỹ thuật với người nghiệp vụ.'],
  loiHayGap: ['Giả vờ hiểu.', 'Nói chuyện bằng thuật ngữ lập trình với khách.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'interpersonal skills', vi: 'kỹ năng giao tiếp liên cá nhân' }],
  khaiNiem: ['business analyst skills'],
});

const E4 = phanLoai({
  tieuDe: 'BA skills 4 — which model for which audience?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Modeling skill: some models help communicate with users, others with developers, others only support the analyst’s own analysis. Choose the most suitable model for each purpose.</p>', vi: '<p>Chọn mô hình phù hợp nhất cho từng mục đích.</p>' },
  cot: 'Model', luaChon: ['Swimlane / process flow', 'Use case diagram', 'State-transition diagram', 'Entity-relationship diagram', 'Decision table'],
  hang: [
    ['Show clerks who does each step of the refund process, in order.', 'Swimlane / process flow'],
    ['Show the sponsor which users get which capabilities.', 'Use case diagram'],
    ['Show developers every status of a loan application and what moves it.', 'State-transition diagram'],
    ['Agree with the data team what information the system stores and how it relates.', 'Entity-relationship diagram'],
    ['Check that every combination of member type and order size has a discount rule.', 'Decision table'],
  ],
  giaiThich: '<p>Pick the model that answers the question the audience has — and teach them how to read it.</p>',
  goiY: ['"Ai làm gì, theo thứ tự" ⇒ swimlane.', '"Mọi tổ hợp điều kiện" ⇒ bảng quyết định.'],
  loiHayGap: ['Dùng ERD để giải thích quy trình.', 'Dùng use case diagram để thể hiện thứ tự bước.'],
  thuatNgu: tn('swimlane', 'stateDiagram', 'erd', 'decisionTable'),
  khaiNiem: ['modeling skill'],
});

export default moDun({
  slug: 'swr302-4b-2-ch4-skills',
  ten: '2.14 The fourteen essential analyst skills',
  moTaModule: 'Mười bốn kỹ năng BA: nhận ra kỹ năng trong 10 tình huống, phân tích và sáng tạo (không mạ vàng), học hỏi/giao tiếp/lãnh đạo, chọn mô hình cho từng người nghe.',
  de: [E1, E2, E3, E4],
});
