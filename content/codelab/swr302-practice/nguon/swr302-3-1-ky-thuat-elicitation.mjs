/**
 * SWR302 · 3.1 — Elicitation techniques (Wiegers Ch.7 slides 1–21).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const KT = ['Interview', 'Workshop', 'Focus group', 'Observation', 'Questionnaire', 'System interface analysis', 'User interface analysis', 'Document analysis', 'Prototyping'];

const E1 = tracNghiem({
  tieuDe: 'Elicitation techniques 1 — what each technique is',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers Ch.7 describes nine techniques: interviews, workshops, focus groups, observations, questionnaires, system interface analysis, user interface analysis, document analysis and prototyping (Ch.15). Five questions on what each one is good for.</p>', vi: '<p>Wiegers Ch.7 mô tả chín kỹ thuật: phỏng vấn, workshop, focus group, quan sát, bảng hỏi, phân tích giao diện hệ thống, phân tích giao diện người dùng, phân tích tài liệu và prototyping (Ch.15). Năm câu về mỗi kỹ thuật hợp với việc gì.</p>' },
  cau: [
    { en: 'Which technique best reveals tacit knowledge — things people do but cannot explain?', vi: 'Kỹ thuật nào lộ ra tri thức ngầm — điều người ta làm nhưng không giải thích được?', lc: [['a', 'Questionnaire'], ['b', 'Observation'], ['c', 'Document analysis'], ['d', 'Interview']], dap: 'b', giai: ['Watching people work shows steps they skip when they describe their job.', 'Quan sát người làm việc cho thấy các bước họ bỏ qua khi kể.'] },
    { en: 'Which technique reaches hundreds of users cheaply and gives statistics?', vi: 'Kỹ thuật nào tới được hàng trăm người dùng với chi phí thấp và cho số liệu thống kê?', lc: [['a', 'Questionnaire'], ['b', 'Workshop'], ['c', 'Observation'], ['d', 'Prototyping']], dap: 'a', giai: ['Questionnaires scale; their questions must be well designed.', 'Bảng hỏi mở rộng được; câu hỏi phải thiết kế tốt.'] },
    { en: 'A facilitated session in which several stakeholders define requirements together is a…', vi: 'Buổi làm việc có điều phối, nhiều bên cùng xác định yêu cầu, là…', lc: [['a', 'focus group'], ['b', 'workshop'], ['c', 'interview'], ['d', 'survey']], dap: 'b', giai: ['A workshop produces agreed requirements; a focus group gathers opinions from users of one kind.', 'Workshop tạo ra yêu cầu thống nhất; focus group thu ý kiến của một nhóm người dùng.'] },
    { en: 'Reading an existing system’s reports and screens to find features to keep is…', vi: 'Đọc báo cáo và màn hình của hệ thống hiện có để tìm tính năng cần giữ là…', lc: [['a', 'user interface analysis'], ['b', 'observation'], ['c', 'focus group'], ['d', 'interview']], dap: 'a', giai: ['UI analysis studies existing screens to uncover requirements.', 'Phân tích giao diện người dùng nghiên cứu màn hình hiện có để tìm yêu cầu.'] },
    { en: 'Studying the external system your product must exchange data with is…', vi: 'Nghiên cứu hệ thống bên ngoài mà sản phẩm phải trao đổi dữ liệu là…', lc: [['a', 'system interface analysis'], ['b', 'document analysis'], ['c', 'prototyping'], ['d', 'observation']], dap: 'a', giai: ['It reveals functional requirements about data exchanged with other systems.', 'Nó lộ ra yêu cầu chức năng về dữ liệu trao đổi với hệ thống khác.'] },
  ],
  goiY: ['Tri thức nằm ở đâu: trong đầu người, trong việc họ làm, trong tài liệu, trong hệ thống?', 'Workshop = cùng đi tới thống nhất; focus group = thu ý kiến.'],
  loiHayGap: ['Nhầm workshop với focus group.', 'Dùng bảng hỏi để tìm tri thức ngầm.'],
  giaiThich: '<p>Answers: b · a · b · a · a.</p>',
  thuatNgu: [...tn('elicitation'), { en: 'tacit knowledge', vi: 'tri thức ngầm — điều người ta biết làm nhưng khó diễn đạt' }],
  khaiNiem: ['elicitation techniques'],
});

const E2 = phanLoai({
  tieuDe: 'Elicitation techniques 2 — choose the technique (hospital pharmacy)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>A hospital is replacing its pharmacy dispensing system. Choose the most suitable technique for each situation.</p>', vi: '<p>Một bệnh viện thay hệ thống cấp phát thuốc. Chọn kỹ thuật phù hợp nhất cho từng tình huống.</p>' },
  cot: 'Technique', luaChon: KT,
  hang: [
    ['The ministry’s 60-page regulation on narcotic drug records must be followed.', 'Document analysis'],
    ['Pharmacists cannot explain how they double-check prescriptions during the night shift — "we just know".', 'Observation'],
    ['The new system must receive prescriptions from the e-prescription system, whose message format is published.', 'System interface analysis'],
    ['The head pharmacist has strong opinions on stock control that need a deep one-to-one conversation.', 'Interview'],
    ['400 nurses in 20 wards should rate how often each current feature is used.', 'Questionnaire'],
    ['Doctors, pharmacists and finance must agree in one day on the rules for urgent prescriptions.', 'Workshop'],
    ['Nobody can say how the new dispensing screen should look until they see something.', 'Prototyping'],
    ['Six night-shift nurses share their frustrations with the current system together.', 'Focus group'],
  ],
  giaiThich: '<p>Regulations ⇒ documents; tacit routine ⇒ observation; published message format ⇒ system interface analysis; one expert in depth ⇒ interview; many people, statistics ⇒ questionnaire; agreement across groups ⇒ workshop; unknown UI ⇒ prototype; shared opinions of one user class ⇒ focus group.</p>',
  goiY: ['Số người và mục đích (đi tới thống nhất hay chỉ thu ý kiến) quyết định nhiều.', 'Tài liệu/hệ thống có sẵn ⇒ phân tích, không cần hỏi người.'],
  loiHayGap: ['Phỏng vấn 400 điều dưỡng một một.', 'Dùng focus group khi cần ra quyết định chung.'],
  thuatNgu: tn('elicitation'),
  khaiNiem: ['choosing elicitation techniques'],
});

const E3 = phanLoai({
  tieuDe: 'Elicitation techniques 3 — the main limitation of each technique',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Every technique has a weak side. Match each technique with its main limitation.</p>', vi: '<p>Kỹ thuật nào cũng có điểm yếu. Ghép mỗi kỹ thuật với hạn chế chính của nó.</p>' },
  cotCau: 'Technique', cot: 'Main limitation',
  luaChon: ['Answers are limited to the questions asked; no follow-up', 'People may work differently when they know they are watched', 'Time-consuming for one person at a time', 'Hard to schedule many busy stakeholders; can be dominated by strong voices', 'Documents may be outdated or describe the ideal, not the reality', 'Users may think the prototype is almost the finished product'],
  hang: [
    ['Questionnaire', 'Answers are limited to the questions asked; no follow-up'],
    ['Observation', 'People may work differently when they know they are watched'],
    ['Interview', 'Time-consuming for one person at a time'],
    ['Workshop', 'Hard to schedule many busy stakeholders; can be dominated by strong voices'],
    ['Document analysis', 'Documents may be outdated or describe the ideal, not the reality'],
    ['Prototyping', 'Users may think the prototype is almost the finished product'],
  ],
  giaiThich: '<p>Knowing the limits tells you how to combine techniques: e.g. validate document analysis by observation, follow up a questionnaire with interviews, set expectations before showing a prototype.</p>',
  goiY: ['Bảng hỏi không hỏi lại được; quan sát làm người ta thay đổi cách làm.', 'Tài liệu thường mô tả quy trình lý tưởng.'],
  loiHayGap: ['Cho rằng tài liệu luôn đúng thực tế.', 'Quên rằng prototype tạo kỳ vọng sai về tiến độ.'],
  thuatNgu: [{ en: 'Hawthorne effect', vi: 'hiệu ứng người bị quan sát làm khác thường ngày' }],
  khaiNiem: ['elicitation technique trade-offs'],
});

const E4 = tracNghiem({
  tieuDe: 'Elicitation techniques 4 — combine techniques for a plan',
  doKho: 'HARD', phut: 8,
  moTa: { en: '<p>No single technique is enough. Pick ALL the techniques that fit each part of the pharmacy elicitation plan.</p>', vi: '<p>Không kỹ thuật nào đủ một mình. Chọn TẤT CẢ kỹ thuật phù hợp với từng phần của kế hoạch khai thác cho nhà thuốc bệnh viện.</p>' },
  cau: [
    { en: 'Understand the current night-shift process in depth (choose two).', vi: 'Hiểu sâu quy trình ca đêm hiện tại (chọn hai).', lc: [['a', 'Observation'], ['b', 'Questionnaire'], ['c', 'Interview with night-shift pharmacists'], ['d', 'System interface analysis']], dap: ['a', 'c'], nhieu: true, giai: ['Watch the work, then interview to understand why.', 'Quan sát công việc rồi phỏng vấn để hiểu vì sao.'] },
    { en: 'Find every data element exchanged with external systems (choose two).', vi: 'Tìm mọi phần tử dữ liệu trao đổi với hệ thống ngoài (chọn hai).', lc: [['a', 'System interface analysis'], ['b', 'Document analysis of the interface specifications'], ['c', 'Focus group'], ['d', 'Prototyping']], dap: ['a', 'b'], nhieu: true, giai: ['Read the interfaces and their specifications.', 'Đọc các giao diện và đặc tả của chúng.'] },
    { en: 'Agree the urgent-prescription rules and check that the new screens support them (choose two).', vi: 'Thống nhất luật đơn thuốc khẩn và kiểm màn hình mới đáp ứng chúng (chọn hai).', lc: [['a', 'Workshop'], ['b', 'Prototyping'], ['c', 'Questionnaire'], ['d', 'Observation']], dap: ['a', 'b'], nhieu: true, giai: ['Agree in a workshop, then confirm with a prototype.', 'Thống nhất trong workshop, rồi xác nhận bằng prototype.'] },
  ],
  goiY: ['Mỗi phần cần hai kỹ thuật bổ trợ nhau.', 'Hiểu "cái gì" (quan sát) rồi "vì sao" (phỏng vấn).'],
  loiHayGap: ['Chỉ chọn một kỹ thuật cho mọi việc.', 'Dùng bảng hỏi cho việc cần đi tới thống nhất.'],
  giaiThich: '<p>Answers: a+c · a+b · a+b.</p>',
  thuatNgu: [{ en: 'elicitation plan', vi: 'kế hoạch khai thác — mục tiêu, kỹ thuật, lịch, người tham gia, sản phẩm' }],
  khaiNiem: ['elicitation planning'],
});

export default moDun({
  slug: 'swr302-3-1-ky-thuat-elicitation',
  ten: '3.1 Elicitation techniques',
  moTaModule: 'Chín kỹ thuật khai thác của Wiegers Ch.7: mỗi kỹ thuật hợp với việc gì, chọn kỹ thuật cho nhà thuốc bệnh viện, hạn chế chính của từng kỹ thuật, phối hợp kỹ thuật trong kế hoạch khai thác.',
  de: [E1, E2, E3, E4],
});
