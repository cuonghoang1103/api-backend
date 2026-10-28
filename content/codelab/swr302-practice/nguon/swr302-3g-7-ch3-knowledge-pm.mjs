/**
 * SWR302 · 3G.7 — Knowledge and project-management good practices (Wiegers Ch.3 slides 50–65).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Knowledge & PM 1 — knowledge or project management?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Classify each practice: <b>Knowledge</b> (train BAs, educate stakeholders, educate developers about the domain, define an RE process, create a glossary) or <b>Project management</b> (life cycle, plan the approach, estimate effort, base plans on requirements, decision makers, renegotiate commitments, manage risks, track effort, lessons learned).</p>', vi: '<p>Phân loại: nhóm Kiến thức hay nhóm Quản lý dự án.</p>' },
  cot: 'Group', luaChon: ['Knowledge', 'Project management'],
  hang: [
    ['Create a glossary', 'Knowledge'],
    ['Estimate requirements effort', 'Project management'],
    ['Educate developers about the application domain', 'Knowledge'],
    ['Manage requirements-related risks', 'Project management'],
    ['Define a requirements engineering process', 'Knowledge'],
    ['Review lessons learned regarding requirements on other projects', 'Project management'],
  ],
  giaiThich: '<p>Knowledge practices build people’s capability; project-management practices plan and steer the requirements work within the project.</p>',
  goiY: ['Đào tạo, glossary, quy trình RE ⇒ Knowledge.', 'Ước lượng, rủi ro, cam kết, bài học ⇒ PM.'],
  loiHayGap: ['Xếp "định nghĩa quy trình RE" vào PM.', 'Xếp "bài học kinh nghiệm" vào Knowledge.'],
  thuatNgu: [{ en: 'glossary', vi: 'bảng thuật ngữ' }],
  khaiNiem: ['knowledge and project-management practices'],
});

const E2 = phanLoai({
  tieuDe: 'Knowledge & PM 2 — which practice fits?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Choose the practice that answers each situation.</p>', vi: '<p>Chọn thực hành phù hợp với từng tình huống.</p>' },
  cot: 'Practice', luaChon: [...NHOM_TH.Knowledge, ...NHOM_TH['Project management']],
  hang: [
    ['New developers keep confusing "admission", "visit" and "encounter".', 'Create a glossary'],
    ['Developers spend a day shadowing nurses on the ward.', 'Educate developers about the application domain'],
    ['The sponsor adds 15 requirements but keeps the same deadline and budget.', 'Renegotiate project commitments when requirements change'],
    ['Nobody knows who may approve conflicting requests from two departments.', 'Identify requirements decision makers'],
    ['The PM asks what share of effort to reserve for requirements work.', 'Estimate requirements effort'],
    ['Requirements are very uncertain, so the team chooses incremental delivery.', 'Select an appropriate development life cycle'],
    ['After the project, the team records what went wrong with requirements.', 'Review lessons learned regarding requirements on other projects'],
    ['Users get a one-day course on what requirements are and why they matter.', 'Educate stakeholders about requirements'],
  ],
  giaiThich: '<p>Glossary and domain education fight vocabulary confusion; renegotiating commitments keeps promises honest when scope grows; decision makers must be named before the first big decision.</p>',
  goiY: ['Thêm yêu cầu nhưng giữ hạn/ngân sách ⇒ thương lượng lại cam kết.', 'Dev đi theo người dùng ⇒ giáo dục dev về miền nghiệp vụ.'],
  loiHayGap: ['Chấp nhận thêm yêu cầu mà không thương lượng lại.', 'Nhầm giáo dục người dùng với giáo dục dev.'],
  thuatNgu: tn('scopeCreep'),
  khaiNiem: ['knowledge and project-management practices'],
});

const E3 = tracNghiem({
  tieuDe: 'Knowledge & PM 3 — plans, estimates and risks',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Base project plans on requirements and refine them iteratively — early estimates from fuzzy requirements are uncertain. On agile, time-boxed iterations mean adjusting scope to fit fixed schedule and resources. Manage requirements risks: identify, document, mitigate and track them. Track the effort spent on requirements to improve future estimates.</p>', vi: '<p>Lập kế hoạch dựa trên yêu cầu và tinh chỉnh dần; quản lý rủi ro yêu cầu; ghi công sức làm yêu cầu.</p>' },
  cau: [
    { en: 'Early estimates made from a vague vision are…', vi: 'Ước lượng sớm từ một tầm nhìn mơ hồ thì…', lc: [['a', 'highly uncertain; refine them as requirements become clearer'], ['b', 'exact'], ['c', 'useless, never estimate'], ['d', 'binding contracts']], dap: 'a', giai: ['Plans evolve with understanding.', 'Kế hoạch thay đổi theo hiểu biết.'] },
    { en: 'On an agile project with a fixed release date, what is adjusted when requirements grow?', vi: 'Dự án agile có ngày phát hành cố định, khi yêu cầu tăng thì điều chỉnh gì?', lc: [['a', 'The scope delivered in the time box'], ['b', 'The length of the sprint, every time'], ['c', 'Nothing'], ['d', 'The quality bar']], dap: 'a', giai: ['Time-boxes fix time; scope flexes.', 'Time-box cố định thời gian; phạm vi co giãn.'] },
    { en: 'Why record the effort spent on requirements?', vi: 'Vì sao ghi lại công sức làm yêu cầu?', lc: [['a', 'To improve future estimates and judge the return on requirements work'], ['b', 'To blame the BA'], ['c', 'For payroll only'], ['d', 'It has no use']], dap: 'a', giai: ['Data for better planning.', 'Dữ liệu để lập kế hoạch tốt hơn.'] },
  ],
  goiY: ['Ước lượng sớm không chắc chắn.', 'Agile: thời gian cố định, phạm vi linh hoạt.'],
  loiHayGap: ['Hạ chất lượng để kịp hạn.', 'Coi ước lượng ban đầu là cam kết cứng.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('scope'),
  khaiNiem: ['planning and estimation'],
});

const E4 = tracNghiem({
  tieuDe: 'Knowledge & PM 4 — training and process',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Anyone doing BA tasks, with or without the title, needs requirements training. A documented requirements engineering process gives consistent quality and helps plan each project’s requirements tasks, schedule and resources; the PM puts requirements activities into the plan as discrete tasks.</p>', vi: '<p>Ai làm việc BA cũng cần đào tạo; quy trình RE được ghi lại giúp chất lượng nhất quán và dễ lập kế hoạch.</p>' },
  cau: [
    { en: 'A developer is asked to "also write the requirements". What does Wiegers recommend?', vi: 'Một dev được giao "viết luôn yêu cầu". Wiegers khuyên gì?', lc: [['a', 'Give them requirements training — anyone doing BA work needs it'], ['b', 'Nothing, developers know enough'], ['c', 'Let them copy an old SRS'], ['d', 'Skip requirements']], dap: 'a', giai: ['Training for whoever does the role.', 'Đào tạo cho ai làm vai trò đó.'] },
    { en: 'Where should requirements activities appear in a project?', vi: 'Hoạt động yêu cầu nên xuất hiện ở đâu trong dự án?', lc: [['a', 'As discrete tasks in the project plan, with effort and schedule'], ['b', 'Nowhere — they happen informally'], ['c', 'Only in the final report'], ['d', 'Only in the contract']], dap: 'a', giai: ['Plan them like any other work.', 'Lập kế hoạch như mọi việc khác.'] },
  ],
  goiY: ['Làm việc BA ⇒ cần đào tạo BA.', 'Việc yêu cầu là task trong kế hoạch.'],
  loiHayGap: ['Coi việc yêu cầu là "tự nhiên sẽ xong".', 'Giao việc BA mà không đào tạo.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'requirements engineering process', vi: 'quy trình kỹ nghệ yêu cầu' }],
  khaiNiem: ['knowledge practices'],
});

export default moDun({
  slug: 'swr302-3g-7-ch3-knowledge-pm',
  ten: '2.12 Good practices: knowledge and project management',
  moTaModule: 'Năm thực hành kiến thức và chín thực hành quản lý dự án: phân nhóm, chọn thực hành cho 8 tình huống (glossary, thương lượng lại cam kết, người quyết định…), kế hoạch/ước lượng/rủi ro, đào tạo và quy trình RE.',
  de: [E1, E2, E3, E4],
});
