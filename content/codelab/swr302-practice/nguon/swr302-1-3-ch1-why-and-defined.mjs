/**
 * SWR302 · 1.3 — Why requirements engineering, and what a requirement is (Wiegers Ch.1 slides 1–5).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Defined 1 — the two classic definitions',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Lawrence (1997): a requirement is "<i>anything that drives design choices</i>". Sommerville &amp; Sawyer (1997): requirements are "<i>a specification of what should be implemented — descriptions of how the system should behave, or of a system property or attribute, or a constraint on the development process</i>". About half of all defects originate in requirements (Martin &amp; Leffingwell).</p>', vi: '<p>Hai định nghĩa kinh điển của Lawrence và Sommerville &amp; Sawyer; khoảng một nửa số lỗi bắt nguồn từ yêu cầu.</p>' },
  cau: [
    { en: 'Which definition says a requirement is "anything that drives design choices"?', vi: 'Định nghĩa nào nói yêu cầu là "bất cứ thứ gì dẫn dắt lựa chọn thiết kế"?', lc: [['a', 'Lawrence'], ['b', 'Sommerville & Sawyer'], ['c', 'IEEE 830'], ['d', 'Boehm']], dap: 'a', giai: ['Lawrence 1997.', 'Lawrence 1997.'] },
    { en: 'According to Sommerville & Sawyer, which of these counts as a requirement?', vi: 'Theo Sommerville & Sawyer, cái nào là yêu cầu?', lc: [['a', 'Behaviour, a system property or attribute, and a constraint on the development process'], ['b', 'Only behaviour'], ['c', 'Only what the user sees'], ['d', 'Only the database design']], dap: 'a', giai: ['Note the breadth of the definition.', 'Chú ý định nghĩa rất rộng.'] },
    { en: 'Roughly what share of defects originates in requirements?', vi: 'Khoảng bao nhiêu phần lỗi bắt nguồn từ yêu cầu?', lc: [['a', 'About 50%'], ['b', 'About 5%'], ['c', 'Almost none'], ['d', '100%']], dap: 'a', giai: ['Martin & Leffingwell.', 'Martin & Leffingwell.'] },
  ],
  goiY: ['Lawrence: "drives design choices".', 'Sommerville & Sawyer: hành vi + thuộc tính + ràng buộc quy trình.'],
  loiHayGap: ['Cho rằng yêu cầu chỉ là chức năng.', 'Nhầm tác giả hai định nghĩa.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('requirement'),
  khaiNiem: ['definition of a requirement'],
});

const E2 = phanLoai({
  tieuDe: 'Defined 2 — behaviour, property or constraint?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Classify each statement with Sommerville &amp; Sawyer’s definition: a description of how the system should <b>behave</b>, a system <b>property or attribute</b>, or a <b>constraint on the development process</b>.</p>', vi: '<p>Phân loại theo định nghĩa Sommerville &amp; Sawyer: <b>hành vi</b>, <b>thuộc tính hệ thống</b>, hay <b>ràng buộc lên quy trình phát triển</b>.</p>' },
  cot: 'Kind', luaChon: ['Behaviour', 'Property or attribute', 'Development constraint'],
  hang: [
    ['The system shall e-mail a receipt after every payment.', 'Behaviour'],
    ['The system shall be available 99.5% of the time during opening hours.', 'Property or attribute'],
    ['The system must be developed following the bank’s secure-coding standard.', 'Development constraint'],
    ['The system shall lock an account after 5 failed logins.', 'Behaviour'],
    ['Pages shall load within 2 seconds for 95% of requests.', 'Property or attribute'],
    ['Every release must pass an external security audit before go-live.', 'Development constraint'],
  ],
  giaiThich: '<p>Behaviour: what it does. Property: how well or what quality. Development constraint: rules on how it is built and delivered.</p>',
  goiY: ['Hệ thống LÀM gì ⇒ hành vi.', 'Quy định cách LÀM RA hệ thống ⇒ ràng buộc quy trình.'],
  loiHayGap: ['Xếp "khoá tài khoản sau 5 lần sai" vào thuộc tính — đó là hành vi cụ thể.', 'Bỏ qua ràng buộc quy trình khỏi khái niệm yêu cầu.'],
  thuatNgu: tn('functionalReq', 'qualityAttr', 'constraint'),
  khaiNiem: ['definition of a requirement'],
});

const E3 = phanLoai({
  tieuDe: 'Defined 3 — product requirement or project requirement?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers distinguishes <b>product requirements</b> (what the software must do or be) from <b>project requirements</b> (what the project needs: staffing, budget, schedule, training, infrastructure, documentation to deliver). Classify.</p>', vi: '<p>Wiegers phân biệt <b>yêu cầu sản phẩm</b> (phần mềm phải làm/có gì) và <b>yêu cầu dự án</b> (dự án cần gì: nhân sự, ngân sách, lịch, đào tạo, hạ tầng, tài liệu bàn giao).</p>' },
  cot: 'Kind', luaChon: ['Product requirement', 'Project requirement'],
  hang: [
    ['The system shall show the patient’s next appointment on the home screen.', 'Product requirement'],
    ['Two testers must join the team by March.', 'Project requirement'],
    ['Receptionists must be trained before go-live.', 'Project requirement'],
    ['The system shall export monthly revenue to CSV.', 'Product requirement'],
    ['A staging server must be available from week 3.', 'Project requirement'],
    ['The system shall respond within 2 seconds for 95% of searches.', 'Product requirement'],
  ],
  giaiThich: '<p>Project requirements belong in the project plan; product requirements belong in the SRS.</p>',
  goiY: ['Nói về phần mềm ⇒ sản phẩm.', 'Nói về người, tiền, lịch, đào tạo, máy chủ cho dự án ⇒ dự án.'],
  loiHayGap: ['Đưa lịch đào tạo vào SRS.', 'Coi yêu cầu hiệu năng là yêu cầu dự án.'],
  thuatNgu: tn('srs'),
  khaiNiem: ['product vs project requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'Defined 4 — the four framings of Chapter 1',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Chapter 1’s objectives: understand the key terms; distinguish product from project requirements; distinguish requirements <b>development</b> (elicitation, analysis, specification, validation) from requirements <b>management</b> (baselines, change control, status, tracing); and recognise common requirements problems.</p>', vi: '<p>Bốn mục tiêu của chương 1.</p>' },
  cau: [
    { en: 'Which activity belongs to requirements management?', vi: 'Hoạt động nào thuộc quản lý yêu cầu?', lc: [['a', 'Controlling changes to the baseline'], ['b', 'Interviewing users'], ['c', 'Writing use cases'], ['d', 'Drawing a context diagram']], dap: 'a', giai: ['Management keeps agreed requirements under control.', 'Quản lý giữ yêu cầu đã thống nhất trong kiểm soát.'] },
    { en: 'Which activity belongs to requirements development?', vi: 'Hoạt động nào thuộc phát triển yêu cầu?', lc: [['a', 'Validating requirements with users'], ['b', 'Tracking requirement status'], ['c', 'Versioning the SRS'], ['d', 'Impact analysis of a change']], dap: 'a', giai: ['Elicitation, analysis, specification, validation.', 'Khai thác, phân tích, đặc tả, thẩm định.'] },
  ],
  goiY: ['Phát triển = tạo ra yêu cầu; quản lý = giữ yêu cầu.', 'Baseline, thay đổi, trạng thái, truy vết ⇒ quản lý.'],
  loiHayGap: ['Xếp thẩm định vào quản lý.', 'Xếp phân tích ảnh hưởng vào phát triển.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('elicitation', 'validation', 'baseline'),
  khaiNiem: ['requirements development vs management'],
});

export default moDun({
  slug: 'swr302-1-3-ch1-why-and-defined',
  ten: '1.3 What a requirement is',
  moTaModule: 'Hai định nghĩa kinh điển (Lawrence; Sommerville & Sawyer), phân loại hành vi / thuộc tính / ràng buộc quy trình, yêu cầu sản phẩm vs yêu cầu dự án, phát triển vs quản lý yêu cầu.',
  de: [E1, E2, E3, E4],
});
