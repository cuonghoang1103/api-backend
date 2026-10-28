/**
 * SWR302 · 2.3 — The business analyst: role, tasks and skills (Wiegers Ch.4).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'The business analyst 1 — the role',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers: the business analyst (BA) is the individual with the primary responsibility to elicit, analyse, document and validate the needs of the project stakeholders — the bridge between the people who have needs and the people who can satisfy them. "BA" is a role, not necessarily a job title.</p>', vi: '<p>Wiegers: business analyst (BA) là người chịu trách nhiệm chính khai thác, phân tích, ghi lại và thẩm định nhu cầu của các bên liên quan — cây cầu giữa người có nhu cầu và người đáp ứng nhu cầu. "BA" là một vai trò, không nhất thiết là chức danh.</p>' },
  cau: [
    { en: 'The BA is best described as…', vi: 'BA được mô tả đúng nhất là…', lc: [['a', 'the person who writes all the code'], ['b', 'a communication bridge between stakeholders and the development team'], ['c', 'the project sponsor'], ['d', 'the tester']], dap: 'b', giai: ['The BA translates needs into requirements developers can implement.', 'BA dịch nhu cầu thành yêu cầu dev hiện thực được.'] },
    { en: 'In a small team without a BA, who performs the BA role?', vi: 'Trong nhóm nhỏ không có BA, ai làm vai BA?', lc: [['a', 'Nobody — the role is skipped'], ['b', 'Someone else (a developer, PM, product owner) must still do the BA activities'], ['c', 'The customer alone'], ['d', 'The tool']], dap: 'b', giai: ['The work still has to be done; the role is shared or assigned.', 'Việc vẫn phải làm; vai được chia hoặc giao cho ai đó.'] },
    { en: 'On agile projects, much of the BA work is often done by…', vi: 'Trong dự án agile, phần lớn việc BA thường do… làm', lc: [['a', 'the product owner, with team members helping'], ['b', 'the database administrator'], ['c', 'nobody, agile has no requirements'], ['d', 'an external auditor']], dap: 'a', giai: ['The agile analyst role is shared; the product owner owns the backlog.', 'Vai phân tích trong agile được chia sẻ; product owner sở hữu backlog.'] },
  ],
  goiY: ['BA = vai trò cầu nối, không phải chức danh.', 'Không có BA thì vẫn phải có người làm việc của BA.'],
  loiHayGap: ['Cho rằng BA là "người viết tài liệu" duy nhất.', 'Cho rằng agile không cần ai làm việc phân tích yêu cầu.'],
  giaiThich: '<p>Answers: b · b · a.</p>',
  thuatNgu: [{ en: 'business analyst (BA)', vi: 'người phân tích nghiệp vụ — chịu trách nhiệm chính về yêu cầu' }],
  khaiNiem: ['BA role'],
});

const E2 = phanLoai({
  tieuDe: 'The business analyst 2 — is this a BA task?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers lists ten typical BA tasks: define business requirements, plan the requirements approach, identify stakeholders and user classes, elicit requirements, analyse requirements, document requirements, communicate requirements, lead validation, facilitate prioritisation, manage requirements. Decide for each activity whether it is a <b>BA task</b> or belongs to <b>another role</b>.</p>', vi: '<p>Wiegers liệt kê mười việc điển hình của BA: xác định yêu cầu nghiệp vụ, lập kế hoạch cách làm yêu cầu, xác định bên liên quan và lớp người dùng, khai thác, phân tích, ghi lại, truyền đạt yêu cầu, dẫn dắt thẩm định, điều phối xếp ưu tiên, quản lý yêu cầu. Xác định mỗi hoạt động là <b>việc của BA</b> hay của <b>vai khác</b>.</p>' },
  cot: 'Whose task?', luaChon: ['BA task', 'Another role'],
  hang: [
    ['Run a workshop to elicit the booking requirements.', 'BA task'],
    ['Choose the database engine and design the tables.', 'Another role'],
    ['Facilitate a prioritisation session between the owner and the doctors.', 'BA task'],
    ['Approve the budget of the project.', 'Another role'],
    ['Lead the review of the SRS with stakeholders.', 'BA task'],
    ['Write unit tests for the payment module.', 'Another role'],
    ['Track the status of each requirement after the baseline.', 'BA task'],
    ['Decide which features are in scope when the sponsor and the doctors disagree.', 'Another role'],
  ],
  giaiThich: '<p>The BA facilitates, elicits, analyses, documents, validates and manages; design and code belong to developers, budgets and final scope decisions to the sponsor or decision makers — the BA helps them decide but does not own the decision.</p>',
  goiY: ['BA điều phối và ghi lại; người quyết định phạm vi/ngân sách là nhà tài trợ.', 'Thiết kế CSDL và viết unit test là việc của đội phát triển.'],
  loiHayGap: ['Cho rằng BA tự quyết định phạm vi khi các bên bất đồng.', 'Giao thiết kế bảng CSDL cho BA.'],
  thuatNgu: [{ en: 'facilitate', vi: 'điều phối — dẫn dắt buổi làm việc để nhóm tự đi tới kết quả' }],
  khaiNiem: ['BA tasks'],
});

const KN = ['Listening', 'Interviewing and questioning', 'Thinking on your feet', 'Analytical', 'Systems thinking', 'Learning', 'Facilitation', 'Leadership', 'Observational', 'Communication', 'Organizational', 'Modeling', 'Interpersonal', 'Creativity'];
const E3 = phanLoai({
  tieuDe: 'The business analyst 3 — which skill?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: `<p>Wiegers’ essential analyst skills: ${KN.join(' · ')}. Which skill does the BA use most in each moment?</p>`, vi: '<p>Các kỹ năng thiết yếu của BA theo Wiegers (bản tiếng Anh). Ở mỗi khoảnh khắc, BA dùng kỹ năng nào nhiều nhất?</p>' },
  cot: 'Skill', luaChon: KN,
  hang: [
    ['The BA notices the receptionist writes bookings on sticky notes before typing them — something nobody mentioned.', 'Observational'],
    ['A stakeholder suddenly raises a new constraint in a meeting; the BA quickly asks the right follow-up questions.', 'Thinking on your feet'],
    ['The BA draws a context diagram so everybody sees the scope.', 'Modeling'],
    ['The BA keeps a workshop of 12 people on track and makes sure quiet people speak.', 'Facilitation'],
    ['The BA sees that changing the booking rule will also affect billing and insurance reports.', 'Systems thinking'],
    ['The BA proposes a waitlist the users had never imagined.', 'Creativity'],
  ],
  giaiThich: '<p>Noticing what is not said = observation; reacting live = thinking on your feet; diagrams = modelling; running a group = facilitation; seeing the ripple effects = systems thinking; proposing new ideas = creativity.</p>',
  goiY: ['Thấy điều không ai nói ⇒ quan sát. Thấy ảnh hưởng dây chuyền ⇒ tư duy hệ thống.', 'Giữ buổi họp đúng hướng ⇒ điều phối.'],
  loiHayGap: ['Chọn Communication cho mọi tình huống có nói chuyện.', 'Nhầm Analytical với Systems thinking (cái sau nhìn toàn cục và tác động qua lại).'],
  thuatNgu: [{ en: 'systems thinking', vi: 'tư duy hệ thống — thấy các phần ảnh hưởng nhau thế nào' }, { en: 'facilitation', vi: 'kỹ năng điều phối nhóm' }],
  khaiNiem: ['BA skills'],
});

const E4 = phanLoai({
  tieuDe: 'BA role 4 — which of the ten BA tasks?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers’ ten BA tasks: define business requirements · plan the requirements approach · identify stakeholders and user classes · elicit · analyze · document · communicate · lead validation · facilitate prioritization · manage requirements. Name the task each activity belongs to.</p>', vi: '<p>Mười nhiệm vụ của BA. Mỗi hoạt động thuộc nhiệm vụ nào?</p>' },
  cot: 'Task', luaChon: ['Define business requirements', 'Plan the requirements approach', 'Identify stakeholders and user classes', 'Elicit requirements', 'Analyze requirements', 'Document requirements', 'Communicate requirements', 'Lead requirements validation', 'Facilitate requirements prioritization', 'Manage requirements'],
  hang: [
    ['Help the sponsor write the vision statement.', 'Define business requirements'],
    ['Agree with the PM which elicitation techniques happen in which weeks.', 'Plan the requirements approach'],
    ['Find derived and implicit requirements and check scope.', 'Analyze requirements'],
    ['Run the inspection of the SRS.', 'Lead requirements validation'],
    ['Broker a negotiation on what goes into release 1.', 'Facilitate requirements prioritization'],
    ['Track status and change requests after the baseline.', 'Manage requirements'],
    ['Walk the developers through the state diagram and confirm they understood it.', 'Communicate requirements'],
  ],
  giaiThich: '<p>The ten tasks cover the whole requirements life cycle — from the vision to managing changes after the baseline.</p>',
  goiY: ['Tầm nhìn ⇒ define business requirements.', 'Sau baseline ⇒ manage requirements.'],
  loiHayGap: ['Nhầm communicate với document.', 'Nhầm analyze với elicit.'],
  thuatNgu: [{ en: 'business analyst', vi: 'chuyên viên phân tích nghiệp vụ' }],
  khaiNiem: ['BA tasks'],
});

export default moDun({
  slug: 'swr302-4b-1-ch4-role-tasks',
  ten: '2.13 The business analyst: role and tasks',
  moTaModule: 'BA là vai trò cầu nối (không phải chức danh), mười việc điển hình của BA so với việc của vai khác, mười bốn kỹ năng thiết yếu qua tình huống thật.',
  de: [E1, E2, E3, E4],
});
