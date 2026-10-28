/**
 * SWR302 · 6.1 — Validating requirements: validation vs verification, techniques (Wiegers Ch.17 intro).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Validation 1 — validation or verification?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p><b>Verification</b>: are we building the product <i>right</i>? (does a work product meet its specification and standards?) <b>Validation</b>: are we building the <i>right</i> product? (does it satisfy the customer’s real needs?) Requirements validation checks that the requirements describe the right system.</p>', vi: '<p><b>Verification</b>: làm sản phẩm có <i>đúng cách</i> không (khớp đặc tả, chuẩn)? <b>Validation</b>: làm có <i>đúng sản phẩm</i> không (thoả nhu cầu thật của khách)? Thẩm định yêu cầu kiểm rằng yêu cầu mô tả đúng hệ thống cần làm.</p>' },
  cot: 'Activity', luaChon: ['Validation', 'Verification'],
  hang: [
    ['Nurses try a clickable prototype and say whether it fits their real shift work.', 'Validation'],
    ['A reviewer checks that every requirement follows the SRS template and labeling rules.', 'Verification'],
    ['The sponsor confirms that the requirements will reach the business objective "cut waiting time by 30%".', 'Validation'],
    ['A tester checks that the code implements FR-12 as written.', 'Verification'],
    ['Users write acceptance criteria describing how they will decide the release is good enough.', 'Validation'],
    ['A tool checks that every functional requirement traces to a test case.', 'Verification'],
  ],
  giaiThich: '<p>Validation looks outward to real needs and objectives; verification looks at conformance with a specification, template or standard.</p>',
  goiY: ['Nhìn ra nhu cầu thật/mục tiêu nghiệp vụ ⇒ validation.', 'So với đặc tả/chuẩn/mẫu ⇒ verification.'],
  loiHayGap: ['Coi mọi review là verification.', 'Đảo nghĩa "right product" và "product right".'],
  thuatNgu: tn('validation', 'verification'),
  khaiNiem: ['validation vs verification'],
});

const E2 = tracNghiem({
  tieuDe: 'Validation 2 — choose the validation technique',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers’ validation techniques: <b>reviewing requirements</b> (informal reviews, inspections), <b>prototyping</b>, <b>testing the requirements</b> (deriving conceptual tests), <b>defining acceptance criteria</b>, and <b>simulating</b> requirements.</p>', vi: '<p>Các kỹ thuật thẩm định của Wiegers: <b>review yêu cầu</b> (không chính thức, inspection), <b>prototype</b>, <b>test các yêu cầu</b> (suy ra test khái niệm), <b>định nghĩa tiêu chí chấp nhận</b>, <b>mô phỏng</b>.</p>' },
  cau: [
    { en: 'Users cannot imagine how the new triage screen will work.', vi: 'Người dùng không hình dung được màn hình phân loại bệnh mới.', lc: [['a', 'Prototyping'], ['b', 'Formal inspection only'], ['c', 'Simulation of the network'], ['d', 'Nothing']], dap: 'a', giai: ['Let them see and try it.', 'Cho họ xem và thử.'] },
    { en: 'A high-risk SRS for a medical device must be checked rigorously by a team.', vi: 'SRS rủi ro cao cho thiết bị y tế cần kiểm tra chặt chẽ bởi một nhóm.', lc: [['a', 'Peer desk-check'], ['b', 'Inspection'], ['c', 'Simulation'], ['d', 'A survey']], dap: 'b', giai: ['Inspection is the most formal review.', 'Inspection là review chính thức nhất.'] },
    { en: 'Writing test cases from the requirements before any code exists mainly reveals…', vi: 'Viết test từ yêu cầu trước khi có code chủ yếu phát hiện…', lc: [['a', 'ambiguities, missing requirements and errors in the requirements'], ['b', 'code bugs'], ['c', 'server problems'], ['d', 'nothing until coding']], dap: 'a', giai: ['If you cannot write a test, the requirement is not clear.', 'Không viết được test ⇒ yêu cầu chưa rõ.'] },
    { en: 'The customer asks: "How will we know the release is good enough to accept?"', vi: 'Khách hỏi: "Làm sao biết bản phát hành đủ tốt để nghiệm thu?"', lc: [['a', 'Define acceptance criteria'], ['b', 'Write more code'], ['c', 'Skip testing'], ['d', 'Use a context diagram']], dap: 'a', giai: ['Agree the criteria up front.', 'Thống nhất tiêu chí từ đầu.'] },
  ],
  goiY: ['Người dùng không hình dung được ⇒ prototype.', 'Rủi ro cao ⇒ inspection.'],
  loiHayGap: ['Chờ có code mới viết test.', 'Dùng prototype thay cho mọi review.'],
  giaiThich: '<p>Answers: a · b · a · a.</p>',
  thuatNgu: tn('validation', 'inspection', 'prototype', 'acceptanceCriteria'),
  khaiNiem: ['validation techniques'],
});

const E3 = phanLoai({
  tieuDe: 'Validation 3 — which level validates which requirement?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Each requirement level is checked by a matching test or evaluation (the V-model view used in the course): business requirements ↔ measuring business objectives after release; user requirements ↔ acceptance testing; functional requirements ↔ system testing; architecture/design ↔ integration testing; detailed design ↔ unit testing. Choose the activity that checks each item.</p>', vi: '<p>Mỗi cấp yêu cầu được kiểm bằng hoạt động tương ứng (góc nhìn mô hình V). Chọn hoạt động kiểm từng mục.</p>' },
  cot: 'Checked by', luaChon: ['Measuring business objectives', 'Acceptance testing', 'System testing', 'Integration testing', 'Unit testing'],
  hang: [
    ['Reduce the average waiting time at reception by 30% within 6 months.', 'Measuring business objectives'],
    ['UC-03 "Book appointment": the patient books a slot with a chosen doctor.', 'Acceptance testing'],
    ['FR-21: The system shall reject a booking that overlaps an existing one for the same doctor.', 'System testing'],
    ['The booking service and the SMS gateway exchange confirmation messages.', 'Integration testing'],
    ['The function calcEndTime(start, duration) returns the slot end time.', 'Unit testing'],
  ],
  giaiThich: '<p>Business requirements are validated by measuring the objectives; user requirements by acceptance tests; functional requirements by system tests; architecture by integration tests; component design by unit tests.</p>',
  goiY: ['Mục tiêu nghiệp vụ chỉ đo được sau khi đưa vào dùng.', 'Use case của người dùng ⇒ acceptance testing.'],
  loiHayGap: ['Gán use case cho unit test.', 'Gán mục tiêu nghiệp vụ cho system test.'],
  thuatNgu: tn('businessReq', 'userReq', 'functionalReq', 'validation'),
  khaiNiem: ['requirements and test levels'],
});

const E4 = tracNghiem({
  tieuDe: 'Validation 4 — why validate early?',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Requirement defects found late cost far more to fix than defects found while the requirements are written. Validation reduces rework, but it is never "finished": requirements keep changing and must be revalidated.</p>', vi: '<p>Lỗi yêu cầu phát hiện muộn tốn kém hơn nhiều so với khi đang viết yêu cầu. Thẩm định giảm làm lại, nhưng không bao giờ "xong hẳn": yêu cầu đổi thì phải thẩm định lại.</p>' },
  cau: [
    { en: 'When should requirements validation start?', vi: 'Khi nào bắt đầu thẩm định yêu cầu?', lc: [['a', 'As soon as the first requirements are written, incrementally'], ['b', 'After coding'], ['c', 'Only at the end of analysis'], ['d', 'During acceptance testing']], dap: 'a', giai: ['Small, early, frequent reviews.', 'Review nhỏ, sớm, thường xuyên.'] },
    { en: 'A requirement changes after it was validated. What now?', vi: 'Một yêu cầu đã thẩm định bị thay đổi. Làm gì?', lc: [['a', 'Validate the change and its impact again'], ['b', 'Nothing — it was validated'], ['c', 'Delete it'], ['d', 'Ask developers to decide']], dap: 'a', giai: ['Validation follows every change.', 'Thẩm định đi theo mỗi thay đổi.'] },
    { en: 'Does validation guarantee the requirements are perfect?', vi: 'Thẩm định có đảm bảo yêu cầu hoàn hảo không?', lc: [['a', 'No — it reduces risk; some defects will still be found later'], ['b', 'Yes, always'], ['c', 'Only if the SRS is short'], ['d', 'Only with tools']], dap: 'a', giai: ['It reduces, not removes, risk.', 'Nó giảm, không xoá rủi ro.'] },
  ],
  goiY: ['Sửa lỗi yêu cầu sớm rẻ hơn nhiều.', 'Thay đổi ⇒ thẩm định lại.'],
  loiHayGap: ['Chỉ review SRS một lần lúc cuối.', 'Cho rằng đã thẩm định thì không cần xem lại.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('validation'),
  khaiNiem: ['why validate'],
});

export default moDun({
  slug: 'swr302-6-1-tham-dinh',
  ten: '6.1 Validation vs verification and validation techniques',
  moTaModule: 'Phân biệt validation và verification, chọn kỹ thuật thẩm định (review, inspection, prototype, test yêu cầu, tiêu chí chấp nhận, mô phỏng), cấp yêu cầu ↔ cấp kiểm thử, vì sao thẩm định sớm.',
  de: [E1, E4, E2, E3],
});
