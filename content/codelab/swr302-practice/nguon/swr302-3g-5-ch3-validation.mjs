/**
 * SWR302 · 3G.5 — Validation good practices (Wiegers Ch.3 slides 36–40).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Validation practices 1 — which practice?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Four validation practices: review the requirements, test the requirements, define acceptance criteria, simulate the requirements. Which one does each action apply?</p>', vi: '<p>Bốn thực hành thẩm định. Mỗi hành động áp dụng thực hành nào?</p>' },
  cot: 'Practice', luaChon: NHOM_TH.Validation,
  hang: [
    ['An analyst, a customer, a developer and a tester inspect section 3 of the SRS.', 'Review the requirements'],
    ['The tester writes test cases from the use cases before any code exists.', 'Test the requirements'],
    ['The clinic manager states: "We accept the release if all booking tests pass and the system holds 200 users."', 'Define acceptance criteria'],
    ['Users click through an executable model of the new ordering process built in a simulation tool.', 'Simulate the requirements'],
    ['The team walks through tests with the customer to check that the expected results are right.', 'Test the requirements'],
  ],
  giaiThich: '<p>Reviews and tests find defects in the requirements themselves; acceptance criteria define "fit for use"; simulation brings requirements to life before code.</p>',
  goiY: ['Nhiều góc nhìn cùng soát tài liệu ⇒ review.', 'Mô hình chạy được trong công cụ ⇒ simulate.'],
  loiHayGap: ['Nhầm simulation với prototype trên giấy.', 'Nhầm acceptance criteria với test cases chi tiết.'],
  thuatNgu: tn('validation', 'inspection', 'acceptanceCriteria'),
  khaiNiem: ['validation practices'],
});

const E2 = phanLoai({
  tieuDe: 'Validation practices 2 — what makes up acceptance criteria?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Wiegers: acceptance criteria may combine (1) passing <b>acceptance tests</b> based on user requirements, (2) satisfying specific <b>nonfunctional requirements</b>, (3) the state of <b>open defects and issues</b>, and (4) <b>infrastructure and training</b> ready for rollout. Classify each criterion.</p>', vi: '<p>Tiêu chí chấp nhận có thể gồm: test chấp nhận, yêu cầu phi chức năng, tình trạng lỗi/vấn đề mở, hạ tầng và đào tạo sẵn sàng.</p>' },
  cot: 'Component', luaChon: ['Acceptance tests', 'Nonfunctional requirements', 'Open defects and issues', 'Infrastructure and training'],
  hang: [
    ['All 40 booking and cancellation scenarios pass.', 'Acceptance tests'],
    ['The system supports 200 concurrent users with 2-second responses.', 'Nonfunctional requirements'],
    ['No open defect of severity "critical"; at most 5 "minor".', 'Open defects and issues'],
    ['All receptionists have completed a 2-hour training.', 'Infrastructure and training'],
    ['The production servers and backups are in place.', 'Infrastructure and training'],
  ],
  giaiThich: '<p>"Done" is more than passing functional tests: quality, residual defects and readiness count too.</p>',
  goiY: ['Đào tạo, máy chủ ⇒ hạ tầng và đào tạo.', 'Ngưỡng lỗi còn mở ⇒ defects and issues.'],
  loiHayGap: ['Chỉ coi test chức năng là tiêu chí chấp nhận.', 'Bỏ qua đào tạo người dùng.'],
  thuatNgu: tn('acceptanceCriteria'),
  khaiNiem: ['acceptance criteria'],
});

const E3 = tracNghiem({
  tieuDe: 'Validation practices 3 — reviews and tests',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Peer review — especially inspection — is one of the highest-value quality practices: a small team with different perspectives examines requirements and models for defects. Tests are an alternative view of the requirements: writing them forces you to think about how you would know the functionality is correct; map tests to functional requirements so none is overlooked.</p>', vi: '<p>Review (đặc biệt inspection) giá trị cao; test là góc nhìn khác của yêu cầu, ánh xạ test ↔ yêu cầu chức năng.</p>' },
  cau: [
    { en: 'Who should take part in a requirements review?', vi: 'Ai nên tham gia review yêu cầu?', lc: [['a', 'A small team with different perspectives: analyst, customer, developer, tester'], ['b', 'Only the author'], ['c', 'The whole company'], ['d', 'Only managers']], dap: 'a', giai: ['Different perspectives find different defects.', 'Góc nhìn khác nhau tìm lỗi khác nhau.'] },
    { en: 'Why map tests to functional requirements?', vi: 'Vì sao ánh xạ test với yêu cầu chức năng?', lc: [['a', 'So no requirement is overlooked and every test has a purpose'], ['b', 'To count tests'], ['c', 'To make the RTM look full'], ['d', 'It is not useful']], dap: 'a', giai: ['Coverage both ways.', 'Phủ hai chiều.'] },
    { en: 'Simulation of requirements is…', vi: 'Mô phỏng yêu cầu là…', lc: [['a', 'a supplement to elicitation and analysis, not a substitute'], ['b', 'a replacement for requirements'], ['c', 'the same as coding'], ['d', 'only for games']], dap: 'a', giai: ['Wiegers: supplement, not substitute.', 'Wiegers: bổ trợ, không thay thế.'] },
  ],
  goiY: ['Nhiều góc nhìn.', 'Ánh xạ test ↔ yêu cầu.'],
  loiHayGap: ['Để tác giả tự review.', 'Coi mô phỏng thay được phân tích.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('inspection', 'rtm'),
  khaiNiem: ['reviews', 'testing requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'Validation practices 4 — validation on agile projects',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>Agile teams often use acceptance tests instead of detailed functional requirements: the tests flesh out the details of each user story and define when it is done.</p>', vi: '<p>Agile thường dùng test chấp nhận thay cho yêu cầu chức năng chi tiết.</p>' },
  cau: [
    { en: 'On an agile project, the details of a user story are most often captured as…', vi: 'Trong agile, chi tiết của một user story thường được ghi thành…', lc: [['a', 'acceptance tests / acceptance criteria'], ['b', 'a 50-page SRS'], ['c', 'code comments only'], ['d', 'nothing']], dap: 'a', giai: ['Tests as requirements.', 'Test như yêu cầu.'] },
  ],
  goiY: ['Story + acceptance tests.', 'Không phải "không có gì".'],
  loiHayGap: ['Nghĩ agile không thẩm định.', 'Viết SRS dày cho mỗi story.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('userStory', 'acceptanceCriteria'),
  khaiNiem: ['validation on agile projects'],
});

export default moDun({
  slug: 'swr302-3g-5-ch3-validation',
  ten: '2.10 Good practices: validation',
  moTaModule: 'Bốn thực hành thẩm định (review, test yêu cầu, tiêu chí chấp nhận, mô phỏng), bốn thành phần của tiêu chí chấp nhận, review đa góc nhìn, thẩm định trong agile.',
  de: [E1, E2, E3, E4],
});
