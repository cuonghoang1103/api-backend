/**
 * SWR302 · 1.3 — The requirements process: development and management (Wiegers Ch.1 slides 17–20).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, sapXep, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'RE process 1 — development vs management',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Requirements engineering has two halves. <b>Requirements development</b> discovers and writes the requirements: elicitation, analysis, specification, validation. <b>Requirements management</b> controls them once they are baselined: versions, changes, status, traceability.</p>', vi: '<p>Kỹ nghệ yêu cầu có hai nửa. <b>Phát triển yêu cầu</b> khám phá và viết yêu cầu: khai thác, phân tích, đặc tả, thẩm định. <b>Quản lý yêu cầu</b> kiểm soát chúng sau khi baseline: phiên bản, thay đổi, trạng thái, truy vết.</p>' },
  cau: [
    { en: 'Which activity belongs to requirements MANAGEMENT?', vi: 'Hoạt động nào thuộc QUẢN LÝ yêu cầu?', lc: [['a', 'Interviewing users'], ['b', 'Drawing a context diagram'], ['c', 'Evaluating a change request against the baseline'], ['d', 'Writing the SRS']], dap: 'c', giai: ['Change control starts after a baseline exists.', 'Kiểm soát thay đổi bắt đầu khi đã có baseline.'] },
    { en: 'The four activities of requirements DEVELOPMENT are…', vi: 'Bốn hoạt động của PHÁT TRIỂN yêu cầu là…', lc: [['a', 'elicitation, analysis, specification, validation'], ['b', 'planning, coding, testing, deployment'], ['c', 'baseline, change control, tracing, status'], ['d', 'interview, workshop, prototype, survey']], dap: 'a', giai: ['These four are the backbone of the course.', 'Bốn hoạt động này là xương sống của môn.'] },
    { en: 'Are the development activities done once, in strict order?', vi: 'Các hoạt động phát triển có làm một lần, đúng thứ tự cứng không?', lc: [['a', 'Yes — elicit everything, then analyse, then write, then validate'], ['b', 'No — they are iterative and incremental; you go back and forth as understanding grows'], ['c', 'Only on agile projects'], ['d', 'Only validation is repeated']], dap: 'b', giai: ['Wiegers stresses iteration: analysis raises new questions for elicitation, validation finds gaps, and so on.', 'Wiegers nhấn mạnh tính lặp: phân tích sinh câu hỏi mới cho khai thác, thẩm định tìm ra chỗ thiếu…'] },
    { en: '"Confirm that you have the correct set of requirements before development accepts them" describes…', vi: '"Xác nhận bộ yêu cầu là đúng trước khi đội phát triển nhận" mô tả…', lc: [['a', 'specification'], ['b', 'validation'], ['c', 'elicitation'], ['d', 'management']], dap: 'b', giai: ['Validation: reviews, prototypes, acceptance criteria.', 'Thẩm định: review, prototype, tiêu chí chấp nhận.'] },
  ],
  goiY: ['Phát triển TẠO ra yêu cầu; quản lý KIỂM SOÁT chúng theo thời gian.', 'Bốn hoạt động phát triển lặp đi lặp lại, không phải thác nước.'],
  loiHayGap: ['Coi vẽ mô hình là "quản lý yêu cầu" — đó là phân tích.', 'Cho rằng phải khai thác xong 100% rồi mới phân tích.'],
  giaiThich: '<p>Answers: c · a · b · b.</p>',
  thuatNgu: tn('elicitation', 'analysis', 'specification', 'validation', 'baseline'),
  khaiNiem: ['requirements development', 'requirements management'],
});

const HD = ['Elicitation', 'Analysis', 'Specification', 'Validation', 'Management'];
const E2 = phanLoai({
  tieuDe: 'RE process 2 — which activity is this?',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Tasks from the plan of a team building an e-learning portal. Name the requirements activity of each (Wiegers slides 18–20 list the typical tasks of each activity).</p>', vi: '<p>Các việc trong kế hoạch của một đội xây cổng e-learning. Gọi tên hoạt động yêu cầu của từng việc (slide 18–20 liệt kê việc điển hình của mỗi hoạt động).</p>' },
  cot: 'Activity', luaChon: HD,
  hang: [
    ['Identify the user classes and the other stakeholders.', 'Elicitation', 'Xác định lớp người dùng và các bên liên quan khác.'],
    ['Learn about the environment in which the product will be used.', 'Elicitation', 'Tìm hiểu môi trường sản phẩm sẽ được dùng.'],
    ['Decompose high-level requirements into an appropriate level of detail.', 'Analysis', 'Phân rã yêu cầu cấp cao xuống mức chi tiết phù hợp.'],
    ['Negotiate implementation priorities between stakeholders.', 'Analysis', 'Thương lượng ưu tiên hiện thực giữa các bên.'],
    ['Translate the collected needs into written requirements and diagrams for each audience.', 'Specification', 'Chuyển nhu cầu thu được thành yêu cầu viết và sơ đồ cho từng đối tượng đọc.'],
    ['Review the documented requirements to fix problems before the developers accept them.', 'Validation', 'Review yêu cầu đã viết để sửa lỗi trước khi dev nhận.'],
    ['Develop acceptance tests from the requirements.', 'Validation', 'Xây test chấp nhận từ yêu cầu.'],
    ['Record the status of each requirement and its history of changes.', 'Management', 'Ghi trạng thái từng yêu cầu và lịch sử thay đổi.'],
    ['Identify gaps and unnecessary requirements by comparing them with the scope.', 'Analysis', 'Tìm chỗ thiếu và yêu cầu thừa bằng cách so với phạm vi.'],
  ],
  giaiThich: '<p>Elicitation finds the sources and needs; analysis refines, decomposes, models, negotiates and finds gaps; specification writes; validation confirms (reviews, acceptance tests); management tracks status and change.</p>',
  goiY: ['Tìm hiểu ai/ở đâu/cần gì ⇒ elicitation. Làm rõ, phân rã, thương lượng, tìm chỗ thiếu ⇒ analysis.', 'Test chấp nhận được xây trong VALIDATION để xác nhận yêu cầu đúng.'],
  loiHayGap: ['Xếp "thương lượng ưu tiên" vào management — trong Wiegers nó thuộc analysis.', 'Xếp "phát triển test chấp nhận" vào testing — ở đây nó là validation.'],
  thuatNgu: tn('elicitation', 'analysis', 'specification', 'validation'),
  khaiNiem: ['RE activities'],
});

const E3 = sapXep({
  tieuDe: 'RE process 3 — one pass through the activities',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Even though the activities iterate, one pass for a single feature goes in a natural order. Order the steps for the feature "quiz reminders".</p>', vi: '<p>Dù các hoạt động lặp lại, một lượt cho một tính năng vẫn có thứ tự tự nhiên. Sắp các bước cho tính năng "nhắc làm quiz".</p>' },
  cau: [{ en: 'Order the steps', vi: 'Sắp thứ tự', dung: ['Ask students and lecturers how they keep track of quizzes (elicitation)', 'Model when a reminder is needed and resolve conflicts (analysis)', 'Write the reminder requirements in the SRS (specification)', 'Review them with lecturers and write acceptance criteria (validation)', 'Baseline them and handle later change requests (management)'], hien: [3, 0, 4, 2, 1], giai: ['Elicit → analyse → specify → validate → manage.', 'Khai thác → phân tích → đặc tả → thẩm định → quản lý.'] }],
  goiY: ['Bắt đầu từ việc HỎI người dùng.', 'Quản lý bắt đầu khi đã có baseline.'],
  loiHayGap: ['Viết SRS trước khi hỏi người dùng.', 'Đặt validation sau baseline.'],
  giaiThich: '<p>Elicitation → analysis → specification → validation → management.</p>',
  thuatNgu: tn('baseline'),
  khaiNiem: ['RE process'],
});

const E4 = phanLoai({
  tieuDe: 'RE process 4 — development or management?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Decide for each task of the e-learning team whether it is requirements <b>development</b> (creating the requirements) or requirements <b>management</b> (controlling them after the baseline).</p>', vi: '<p>Với mỗi việc của đội e-learning, xác định là <b>phát triển</b> yêu cầu (tạo ra yêu cầu) hay <b>quản lý</b> yêu cầu (kiểm soát sau baseline).</p>' },
  cot: 'Half', luaChon: ['Development', 'Management'],
  hang: [
    ['Run a focus group with first-year students.', 'Development'],
    ['Define the version numbering scheme of the SRS.', 'Management'],
    ['Draw a data flow diagram of the grading process.', 'Development'],
    ['Decide with the CCB whether to accept a requested change.', 'Management'],
    ['Write acceptance criteria for the quiz feature.', 'Development'],
    ['Report how many requirements are implemented and verified.', 'Management'],
    ['Trace each requirement to its design elements and tests.', 'Management'],
    ['Write the external interface requirements in the SRS.', 'Development'],
  ],
  giaiThich: '<p>Eliciting, modelling, writing and validating create requirements (development); versioning, change decisions, status tracking and traceability control them (management).</p>',
  goiY: ['Tạo ra / làm rõ yêu cầu ⇒ development.', 'Phiên bản, thay đổi, trạng thái, truy vết ⇒ management.'],
  loiHayGap: ['Coi viết tiêu chí chấp nhận là management.', 'Coi truy vết là việc của tester, không phải quản lý yêu cầu.'],
  thuatNgu: tn('baseline', 'ccb', 'rtm'),
  khaiNiem: ['requirements development vs management'],
});

export default moDun({
  slug: 'swr302-1-5-ch1-process',
  ten: '1.5 The requirements process: development and management',
  moTaModule: 'Hai nửa của kỹ nghệ yêu cầu: phát triển (khai thác, phân tích, đặc tả, thẩm định) và quản lý; gọi tên hoạt động của các việc điển hình; một lượt qua các hoạt động.',
  de: [E1, E3, E4, E2],
});
