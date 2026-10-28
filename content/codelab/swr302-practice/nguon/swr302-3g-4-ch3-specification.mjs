/**
 * SWR302 · 3G.4 — Specification good practices (Wiegers Ch.3 slides 30–35).
 */
import { tn } from './_chung.mjs';
import { phanLoai, tracNghiem, moDun } from './_bai.mjs';
import { NHOM_TH } from './_thuchanh.mjs';

const E1 = phanLoai({
  tieuDe: 'Specification practices 1 — which practice?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Five specification practices: adopt templates, identify requirement origins, uniquely label each requirement, record business rules, specify nonfunctional requirements. Which one does each action apply?</p>', vi: '<p>Năm thực hành đặc tả. Mỗi hành động áp dụng thực hành nào?</p>' },
  cot: 'Practice', luaChon: NHOM_TH.Specification,
  hang: [
    ['Every requirement gets an ID such as Booking.Cancel.Deadline.', 'Uniquely label each requirement'],
    ['FR-12 records that it comes from UC-04 and BR-07.', 'Identify requirement origins'],
    ['The team starts the SRS from the Wiegers template.', 'Adopt requirement document templates'],
    ['"Refunds over 5 million VND need a manager’s approval" is kept in the enterprise rules catalogue.', 'Record business rules'],
    ['The analyst asks how fast, how available and how secure the system must be.', 'Specify nonfunctional requirements'],
  ],
  giaiThich: '<p>Templates remind you what to explore; origins tell why; labels enable tracing; rules outlive projects; nonfunctional requirements prevent "it works but nobody likes it".</p>',
  goiY: ['Ghi nguồn gốc ⇒ identify origins.', 'Danh mục luật ở cấp doanh nghiệp ⇒ record business rules.'],
  loiHayGap: ['Nhầm đánh nhãn với ghi nguồn gốc.', 'Ghi luật nghiệp vụ như một yêu cầu của dự án.'],
  thuatNgu: tn('specification', 'businessRule', 'nfr'),
  khaiNiem: ['specification practices'],
});

const E2 = tracNghiem({
  tieuDe: 'Specification practices 2 — why each practice matters',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Business rules are an enterprise-level asset: they outlive any one project, so document them separately and link the requirements that enforce them. Unique labels must be robust to additions, deletions and changes — they are a prerequisite for traceability and change management.</p>', vi: '<p>Luật nghiệp vụ là tài sản cấp doanh nghiệp; nhãn duy nhất là tiền đề cho truy vết và quản lý thay đổi.</p>' },
  cau: [
    { en: 'Why keep business rules separate from a project’s requirements?', vi: 'Vì sao tách luật nghiệp vụ khỏi yêu cầu của dự án?', lc: [['a', 'They outlive the project and are shared by many systems; requirements that enforce them link back to them'], ['b', 'To make the SRS shorter'], ['c', 'Rules are not important'], ['d', 'Only lawyers read them']], dap: 'a', giai: ['Enterprise asset.', 'Tài sản doanh nghiệp.'] },
    { en: 'Without unique, stable labels, which practices become impossible?', vi: 'Không có nhãn duy nhất, ổn định thì thực hành nào không làm được?', lc: [['a', 'Traceability and change tracking'], ['b', 'Interviews'], ['c', 'Prototyping'], ['d', 'Workshops']], dap: 'a', giai: ['You cannot trace what you cannot name.', 'Không gọi tên được thì không truy vết được.'] },
    { en: 'A product does exactly what was asked but is slow and confusing. Which practice was neglected?', vi: 'Sản phẩm làm đúng điều được yêu cầu nhưng chậm và khó dùng. Thực hành nào bị bỏ?', lc: [['a', 'Specify nonfunctional requirements'], ['b', 'Record business rules'], ['c', 'Uniquely label requirements'], ['d', 'Adopt templates']], dap: 'a', giai: ['Quality expectations were never captured.', 'Kỳ vọng chất lượng chưa từng được ghi.'] },
  ],
  goiY: ['Luật sống lâu hơn dự án.', 'Nhãn ⇒ truy vết.'],
  loiHayGap: ['Lặp lại cùng một luật trong nhiều SRS.', 'Bỏ qua yêu cầu phi chức năng.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('businessRule', 'nfr', 'rtm'),
  khaiNiem: ['specification practices'],
});

const E3 = phanLoai({
  tieuDe: 'Specification practices 3 — what kind of nonfunctional requirement?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>"Specify nonfunctional requirements" covers <b>quality attributes</b>, <b>external interfaces</b>, <b>constraints</b> and <b>internationalization</b>. Classify each.</p>', vi: '<p>Phân loại yêu cầu phi chức năng: thuộc tính chất lượng, giao diện ngoài, ràng buộc, quốc tế hoá.</p>' },
  cot: 'Kind', luaChon: ['Quality attribute', 'External interface', 'Constraint', 'Internationalization'],
  hang: [
    ['Search results appear within 2 seconds for 95% of searches.', 'Quality attribute'],
    ['Orders are sent to the courier’s API in JSON.', 'External interface'],
    ['The system must run on the hospital’s existing Oracle database.', 'Constraint'],
    ['Dates are shown as dd/mm/yyyy in Vietnamese and mm/dd/yyyy in English.', 'Internationalization'],
    ['The app keeps working offline for up to 8 hours.', 'Quality attribute'],
  ],
  giaiThich: '<p>All four are "nonfunctional" in the broad sense and belong in sections 5–7 of the SRS template.</p>',
  goiY: ['Định dạng ngày theo ngôn ngữ ⇒ i18n.', 'Bắt dùng CSDL có sẵn ⇒ ràng buộc.'],
  loiHayGap: ['Xếp định dạng ngày vào quality attribute.', 'Xếp API của hãng vận chuyển vào ràng buộc.'],
  thuatNgu: tn('nfr', 'qualityAttr', 'externalInterface', 'constraint'),
  khaiNiem: ['nonfunctional requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'Specification practices 4 — templates without big documents',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>Standard templates — Vision &amp; Scope, use case, SRS — give a consistent structure. Even on projects that do not write traditional documents, a template reminds you which kinds of requirements information to explore.</p>', vi: '<p>Template hữu ích kể cả khi không viết tài liệu truyền thống.</p>' },
  cau: [
    { en: 'An agile team writes no SRS. Is the SRS template still useful?', vi: 'Một đội agile không viết SRS. Template SRS còn hữu ích không?', lc: [['a', 'Yes — as a checklist of information to explore (quality, interfaces, constraints…)'], ['b', 'No, never'], ['c', 'Only for the testers'], ['d', 'Only to print']], dap: 'a', giai: ['A template is also a checklist.', 'Template cũng là checklist.'] },
  ],
  goiY: ['Template = danh sách nhắc việc.', 'Không cần tài liệu dày vẫn dùng được.'],
  loiHayGap: ['Bỏ template là bỏ luôn các mục cần khai thác.', 'Nghĩ template chỉ để in.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: tn('srs'),
  khaiNiem: ['templates'],
});

export default moDun({
  slug: 'swr302-3g-4-ch3-specification',
  ten: '2.9 Good practices: specification',
  moTaModule: 'Năm thực hành đặc tả: template, nguồn gốc, nhãn duy nhất, luật nghiệp vụ, yêu cầu phi chức năng; vì sao mỗi thực hành quan trọng; bốn loại yêu cầu phi chức năng.',
  de: [E1, E2, E3, E4],
});
