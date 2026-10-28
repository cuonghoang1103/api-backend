/**
 * SWR302 · 4B.3 — Analyst knowledge, the five BA backgrounds, and the BA on agile projects (Wiegers Ch.4 slides 31–38).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const NEN = ['Former user', 'Former developer', 'Former tester', 'Former project manager', 'Subject-matter expert', 'Rookie'];

const E1 = phanLoai({
  tieuDe: 'BA backgrounds 1 — whose strength or gap?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Wiegers: BAs come from different backgrounds, each with strengths and pitfalls. Name the background each statement describes.</p>', vi: '<p>BA đến từ nhiều xuất phát điểm khác nhau, mỗi loại có điểm mạnh và điểm yếu. Gọi tên xuất phát điểm.</p>' },
  cot: 'Background', luaChon: NEN,
  hang: [
    ['Speaks the users’ language and is trusted by former colleagues, but knows little about software engineering.', 'Former user'],
    ['Thinks naturally about exceptions and how things break — great for finding gaps.', 'Former tester'],
    ['Knows the domain deeply but may specify to personal preferences and struggle to imagine the "to-be" system.', 'Subject-matter expert'],
    ['Strong at negotiation and organisation, but must shift focus from timelines and budget to business needs.', 'Former project manager'],
    ['Has few preconceived notions; benefits most from mentoring.', 'Rookie'],
    ['Understands technical feasibility but may lack patience with users and domain knowledge.', 'Former developer'],
  ],
  giaiThich: '<p>Every path into the role works if the BA consciously fills its typical gap.</p>',
  goiY: ['Giỏi tìm ngoại lệ ⇒ từng là tester.', 'Biết "as-is" rõ nhưng khó hình dung "to-be" ⇒ chuyên gia nghiệp vụ.'],
  loiHayGap: ['Nhầm SME với người dùng cũ.', 'Nghĩ người mới (rookie) không có lợi thế nào.'],
  thuatNgu: [{ en: 'subject-matter expert (SME)', vi: 'chuyên gia nghiệp vụ' }],
  khaiNiem: ['BA backgrounds'],
});

const E2 = tracNghiem({
  tieuDe: 'BA backgrounds 2 — the SME risk and essential knowledge',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>An SME hired as the analyst may specify to their own preferences rather than all user classes’ needs. Often better: a BA from the development team works with the SME as a key user representative or product champion. Essential BA knowledge: requirements practices across life cycles, when (and when not) to use each technique, project management, risk and quality, and enough domain knowledge to detect unstated assumptions.</p>', vi: '<p>Rủi ro khi SME làm BA; kiến thức thiết yếu của BA.</p>' },
  cau: [
    { en: 'The clinic wants its most senior doctor to write all the requirements alone. What do you suggest?', vi: 'Phòng khám muốn bác sĩ lâu năm nhất tự viết hết yêu cầu. Bạn đề xuất gì?', lc: [['a', 'Pair a BA with the doctor, who acts as product champion; the BA also hears other user classes'], ['b', 'Agree — nobody knows more'], ['c', 'Exclude the doctor'], ['d', 'Let developers decide']], dap: 'a', giai: ['Avoid one person’s preferences becoming everyone’s requirements.', 'Tránh sở thích một người thành yêu cầu của mọi người.'] },
    { en: 'Which is part of essential BA knowledge?', vi: 'Đâu là kiến thức thiết yếu của BA?', lc: [['a', 'Knowing when — and when not — to use each requirements technique'], ['b', 'Expert-level coding in three languages'], ['c', 'Network administration'], ['d', 'Graphic design']], dap: 'a', giai: ['A toolkit plus judgement.', 'Bộ công cụ cộng óc phán đoán.'] },
  ],
  goiY: ['SME là product champion tốt, BA giữ cái nhìn mọi lớp người dùng.', 'Biết khi nào KHÔNG dùng một kỹ thuật cũng là kiến thức.'],
  loiHayGap: ['Giao toàn bộ yêu cầu cho một chuyên gia.', 'Nghĩ BA phải là lập trình viên giỏi.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('productChampion'),
  khaiNiem: ['BA knowledge'],
});

const E3 = phanLoai({
  tieuDe: 'BA backgrounds 3 — the BA on an agile team',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>On agile projects the BA defines a lightweight, flexible requirements process; keeps documentation at the right level; decides how to document the backlog; facilitates frequent stakeholder conversations; validates that customer needs are in the backlog and helps prioritise it; and manages changing minds. Which statements fit an agile BA?</p>', vi: '<p>Câu nào phù hợp với BA trong đội agile?</p>' },
  cot: 'Fits an agile BA?', luaChon: ['Fits', 'Does not fit'],
  hang: [
    ['Keeps documentation "just enough" for developers and testers.', 'Fits'],
    ['Writes a complete 200-page SRS before the first sprint.', 'Does not fit'],
    ['Helps the product owner refine and prioritise the backlog.', 'Fits'],
    ['Refuses any change once a sprint has started, and also between sprints.', 'Does not fit'],
    ['Facilitates frequent conversations between users and the team.', 'Fits'],
  ],
  giaiThich: '<p>The role does not disappear on agile — its timing and documentation style change.</p>',
  goiY: ['Tài liệu vừa đủ.', 'Thay đổi giữa các sprint là bình thường.'],
  loiHayGap: ['Cho rằng agile không cần BA.', 'Viết SRS khổng lồ trước sprint 1.'],
  thuatNgu: tn('backlog'),
  khaiNiem: ['BA on agile projects'],
});

const E4 = tracNghiem({
  tieuDe: 'BA backgrounds 4 — the BA’s tasks across the life cycle',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Whatever the background, the BA’s ten tasks span the whole life cycle — from defining business requirements to managing requirements after the baseline (status, changes, traceability).</p>', vi: '<p>Mười nhiệm vụ của BA trải suốt vòng đời.</p>' },
  cau: [
    { en: 'After the baseline, the BA’s focus shifts to…', vi: 'Sau baseline, trọng tâm của BA chuyển sang…', lc: [['a', 'tracking status, verifying satisfaction, managing changes and collecting traceability information'], ['b', 'nothing — the BA leaves'], ['c', 'writing code'], ['d', 'only testing']], dap: 'a', giai: ['Task 10: manage requirements.', 'Nhiệm vụ 10: quản lý yêu cầu.'] },
  ],
  goiY: ['BA không biến mất sau baseline.', 'Quản lý yêu cầu là nhiệm vụ của BA.'],
  loiHayGap: ['Nghĩ BA chỉ làm ở đầu dự án.', 'Nghĩ BA chuyển sang viết code.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('baseline'),
  khaiNiem: ['BA tasks'],
});

export default moDun({
  slug: 'swr302-4b-3-ch4-knowledge-backgrounds',
  ten: '2.15 Analyst knowledge, backgrounds and the agile BA',
  moTaModule: 'Năm (sáu) xuất phát điểm của BA và điểm mạnh/điểm yếu, rủi ro khi SME làm BA, kiến thức thiết yếu, vai trò BA trong đội agile, trọng tâm sau baseline.',
  de: [E1, E2, E3, E4],
});
