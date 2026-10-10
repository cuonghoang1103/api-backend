/**
 * CT Work đợt 6 — RV: REVIEW / INSPECTION (IEEE 1028-2008 · Wiegers "Software Requirements" Ch17 · SWT301 Ch3 static
 * testing · Lab 1 Java checklist · T13 checklist tự kiểm báo cáo UT). Hàm thuần: mẫu checklist, vai trò, chuyển trạng thái,
 * số đo hiệu suất review, biên bản review (markdown ⇒ docx qua docExport).
 */

export const REVIEW_KINDS = ['DOC', 'CODE'] as const;
export const REVIEW_METHODS = ['INFORMAL', 'WALKTHROUGH', 'TECHNICAL', 'INSPECTION'] as const;
export const REVIEW_ROLES = ['MODERATOR', 'AUTHOR', 'REVIEWER', 'SCRIBE', 'READER'] as const;
export const REVIEW_STATUSES = ['PLANNING', 'PREPARATION', 'MEETING', 'REWORK', 'FOLLOW_UP', 'CLOSED'] as const;
export const REVIEW_DECISIONS = ['ACCEPT', 'ACCEPT_WITH_CHANGES', 'REINSPECT'] as const;
export const ITEM_RESULTS = ['OK', 'NG', 'NA'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export type ReviewRole = (typeof REVIEW_ROLES)[number];

/** Chuyển trạng thái hợp lệ (đi tới từng bước; REWORK ⇒ quay lại MEETING khi tái kiểm; CLOSED là cuối). */
export const REVIEW_FLOW: Record<ReviewStatus, ReviewStatus[]> = {
  PLANNING: ['PREPARATION'],
  PREPARATION: ['MEETING', 'PLANNING'],
  MEETING: ['REWORK', 'CLOSED'],
  REWORK: ['FOLLOW_UP', 'MEETING'],
  FOLLOW_UP: ['CLOSED', 'REWORK'],
  CLOSED: [],
};

type Q = [en: string, vi: string];
interface Section { name: Q; items: Q[] }
export interface ChecklistTemplate { key: string; kind: 'DOC' | 'CODE'; name: Q; source: string; sizeUnit: 'PAGE' | 'LOC'; sections: Section[] }

/** Mẫu checklist theo loại sản phẩm. Câu hỏi viết dạng "Có … không?" — OK = đạt, NG = lỗi (sinh defect), NA = không áp dụng. */
export const CHECKLISTS: ChecklistTemplate[] = [
  {
    key: 'WIEGERS_SRS', kind: 'DOC', sizeUnit: 'PAGE', source: 'Wiegers & Beatty, Software Requirements 3e — Requirements review checklist (Ch17)',
    name: ['SRS review checklist (Wiegers)', 'Checklist rà soát SRS (Wiegers)'],
    sections: [
      { name: ['Completeness', 'Tính đầy đủ'], items: [
        ['Are all known requirements included, with no TBD left unresolved (or each TBD logged with owner and due date)?', 'Đã có đủ các yêu cầu đã biết, không còn TBD treo (hoặc mỗi TBD đều được ghi sổ, có người phụ trách và hạn)?'],
        ['Is every functional requirement traceable to a business requirement or user requirement?', 'Mỗi yêu cầu chức năng có truy về được một yêu cầu nghiệp vụ hoặc yêu cầu người dùng?'],
        ['Are all external interfaces (UI, hardware, software, communications) specified?', 'Đã đặc tả mọi giao tiếp ngoài (UI, phần cứng, phần mềm, truyền thông)?'],
        ['Are expected behaviours documented for all anticipated error conditions?', 'Đã ghi hành vi mong đợi cho mọi tình huống lỗi lường trước?'],
        ['Are quality attributes (performance, security, usability…) stated with measurable targets?', 'Các thuộc tính chất lượng (hiệu năng, bảo mật, khả dụng…) có chỉ tiêu đo được?'],
      ] },
      { name: ['Correctness', 'Tính đúng đắn'], items: [
        ['Do the requirements conflict with or duplicate other requirements?', 'Các yêu cầu có mâu thuẫn hay trùng lặp nhau không (OK = không)?'],
        ['Is each requirement written in clear, concise, unambiguous language (one interpretation only)?', 'Mỗi yêu cầu viết rõ, gọn, không mơ hồ (chỉ một cách hiểu)?'],
        ['Is each requirement verifiable by test, demonstration, review or analysis?', 'Mỗi yêu cầu kiểm chứng được bằng test, trình diễn, rà soát hoặc phân tích?'],
        ['Is each requirement within the project scope?', 'Mỗi yêu cầu nằm trong phạm vi dự án?'],
        ['Are all requirements free of content and grammatical errors?', 'Các yêu cầu không có lỗi nội dung và ngữ pháp?'],
        ['Can all requirements be implemented within known constraints (feasible)?', 'Mọi yêu cầu khả thi trong các ràng buộc đã biết?'],
      ] },
      { name: ['Quality attributes', 'Thuộc tính chất lượng'], items: [
        ['Are all performance objectives properly specified?', 'Mục tiêu hiệu năng được đặc tả đúng mức?'],
        ['Are security and privacy considerations properly specified?', 'Yêu cầu bảo mật và quyền riêng tư được đặc tả đầy đủ?'],
        ['Are other quality attribute goals explicitly documented and quantified, with acceptable trade-offs?', 'Các mục tiêu chất lượng khác được ghi rõ, định lượng, kèm đánh đổi chấp nhận được?'],
      ] },
      { name: ['Organization & traceability', 'Tổ chức & truy vết'], items: [
        ['Are requirements organized logically and uniquely identified (REQ-n, UC-n, BR-n)?', 'Yêu cầu được tổ chức hợp lý và có định danh duy nhất (REQ-n, UC-n, BR-n)?'],
        ['Are all cross-references to other requirements correct?', 'Mọi tham chiếu chéo tới yêu cầu khác đều đúng?'],
        ['Is each requirement atomic — no "and/or" joining two needs?', 'Mỗi yêu cầu là nguyên tử — không dùng "và/hoặc" ghép hai nhu cầu?'],
        ['Is the priority of each requirement stated?', 'Mỗi yêu cầu đã có mức ưu tiên?'],
      ] },
      { name: ['Other issues', 'Vấn đề khác'], items: [
        ['Are all requirements actually requirements, not design or implementation solutions?', 'Mọi yêu cầu thật sự là yêu cầu, không phải giải pháp thiết kế/cài đặt?'],
        ['Are time-critical functions identified and timing criteria specified?', 'Đã nêu các chức năng phụ thuộc thời gian và tiêu chí thời gian?'],
        ['Have internationalization / localization issues been addressed?', 'Đã xét yếu tố đa ngôn ngữ / bản địa hoá?'],
      ] },
    ],
  },
  {
    key: 'USE_CASE', kind: 'DOC', sizeUnit: 'PAGE', source: 'Wiegers — Use case review checklist',
    name: ['Use case checklist', 'Checklist rà soát use case'],
    sections: [
      { name: ['Structure', 'Cấu trúc'], items: [
        ['Is the use case a stand-alone, discrete task with a clear goal of value to an actor?', 'Use case là một nhiệm vụ độc lập, có mục tiêu mang lại giá trị cho tác nhân?'],
        ['Is the primary actor and its trigger identified?', 'Đã xác định tác nhân chính và sự kiện kích hoạt?'],
        ['Are preconditions and postconditions stated?', 'Đã nêu tiền điều kiện và hậu điều kiện?'],
        ['Is the normal flow a reasonable number of steps (≈3–9) written as actor/system dialogue?', 'Luồng chính có số bước hợp lý (≈3–9), viết dạng đối thoại tác nhân/hệ thống?'],
      ] },
      { name: ['Flows', 'Các luồng'], items: [
        ['Are alternative flows and exceptions documented with their branch points?', 'Đã ghi luồng thay thế và ngoại lệ kèm điểm rẽ nhánh?'],
        ['Are business rules referenced (BR-n) rather than restated?', 'Quy tắc nghiệp vụ được tham chiếu (BR-n) thay vì chép lại?'],
        ['Is the use case free of user-interface design detail?', 'Use case không chứa chi tiết thiết kế giao diện?'],
        ['Can each flow be tested (expected result observable)?', 'Mỗi luồng kiểm thử được (kết quả mong đợi quan sát được)?'],
      ] },
    ],
  },
  {
    key: 'IEEE1028_SDD', kind: 'DOC', sizeUnit: 'PAGE', source: 'IEEE 1016 / IEEE 1028 technical review — design checklist',
    name: ['Design (SDD) review checklist', 'Checklist rà soát thiết kế (SDD)'],
    sections: [
      { name: ['Architecture', 'Kiến trúc'], items: [
        ['Does the architecture satisfy every functional and quality requirement allocated to it?', 'Kiến trúc đáp ứng mọi yêu cầu chức năng và chất lượng được phân bổ?'],
        ['Are components, responsibilities and interfaces clearly defined?', 'Thành phần, trách nhiệm và giao diện được xác định rõ?'],
        ['Are design decisions and rejected alternatives recorded with rationale?', 'Quyết định thiết kế và phương án bị loại có ghi lý do?'],
      ] },
      { name: ['Detailed design', 'Thiết kế chi tiết'], items: [
        ['Do class / sequence diagrams match the use cases they realize?', 'Sơ đồ lớp / tuần tự khớp với use case chúng hiện thực?'],
        ['Is the database design normalized and consistent with the data dictionary?', 'Thiết kế CSDL chuẩn hoá và khớp từ điển dữ liệu?'],
        ['Are error handling, logging and security controls designed?', 'Đã thiết kế xử lý lỗi, ghi log và kiểm soát bảo mật?'],
        ['Is every design element traceable to a requirement (and vice versa)?', 'Mỗi phần thiết kế truy về được yêu cầu (và ngược lại)?'],
      ] },
    ],
  },
  {
    key: 'TEST_PLAN', kind: 'DOC', sizeUnit: 'PAGE', source: 'IEEE 829-2008 Master/Level Test Plan',
    name: ['Test plan review checklist (IEEE 829)', 'Checklist rà soát kế hoạch kiểm thử (IEEE 829)'],
    sections: [
      { name: ['Scope & approach', 'Phạm vi & cách tiếp cận'], items: [
        ['Are features to be tested and not to be tested listed?', 'Đã liệt kê tính năng sẽ kiểm thử và không kiểm thử?'],
        ['Is the approach defined per test level and test type?', 'Cách tiếp cận được xác định theo từng cấp và loại kiểm thử?'],
        ['Are test design techniques chosen per risk level?', 'Kỹ thuật thiết kế test được chọn theo mức rủi ro?'],
      ] },
      { name: ['Criteria & resources', 'Tiêu chí & nguồn lực'], items: [
        ['Are entry and exit criteria measurable?', 'Tiêu chí vào/ra đo được?'],
        ['Are suspension and resumption criteria defined?', 'Đã xác định tiêu chí tạm dừng và tiếp tục?'],
        ['Are environment, tools, data and responsibilities specified?', 'Đã nêu môi trường, công cụ, dữ liệu và trách nhiệm?'],
        ['Are schedule, estimates and deliverables stated?', 'Đã có lịch, ước lượng và sản phẩm bàn giao?'],
        ['Are product and project risks with mitigations listed?', 'Đã liệt kê rủi ro sản phẩm/dự án kèm biện pháp?'],
      ] },
    ],
  },
  {
    key: 'JAVA_BASIC', kind: 'CODE', sizeUnit: 'LOC', source: 'FPT SWT301 Lab 1 — Java_Simple_Checklist (Basic + Advance)',
    name: ['Java code review checklist', 'Checklist rà soát mã Java'],
    sections: [
      { name: ['Basic — naming & formatting', 'Cơ bản — đặt tên & định dạng'], items: [
        ['Do class, method and variable names follow Java conventions (PascalCase / camelCase / UPPER_CASE constants)?', 'Tên lớp, phương thức, biến theo quy ước Java (PascalCase / camelCase / HẰNG_SỐ)?'],
        ['Is the code consistently indented and free of commented-out dead code?', 'Mã thụt lề nhất quán và không còn mã chết bị comment?'],
        ['Are magic numbers replaced by named constants?', 'Số "ma thuật" đã được thay bằng hằng có tên?'],
        ['Does each method do one thing and stay short (≈ ≤ 30 lines)?', 'Mỗi phương thức làm một việc và ngắn (≈ ≤ 30 dòng)?'],
      ] },
      { name: ['Basic — correctness', 'Cơ bản — tính đúng'], items: [
        ['Are all variables initialized before use and loop bounds correct (no off-by-one)?', 'Mọi biến được khởi tạo trước khi dùng, biên vòng lặp đúng (không lệch một)?'],
        ['Are strings compared with equals() rather than ==?', 'Chuỗi được so bằng equals() thay vì ==?'],
        ['Is user input validated (null, empty, range, format) before use?', 'Dữ liệu nhập được kiểm (null, rỗng, khoảng, định dạng) trước khi dùng?'],
        ['Are Scanner / streams / connections closed (try-with-resources)?', 'Scanner / stream / kết nối được đóng (try-with-resources)?'],
      ] },
      { name: ['Advance — design & robustness', 'Nâng cao — thiết kế & độ bền'], items: [
        ['Are exceptions caught specifically and never swallowed silently?', 'Ngoại lệ được bắt cụ thể và không bị nuốt im lặng?'],
        ['Are fields private with access through methods (encapsulation)?', 'Thuộc tính private, truy cập qua phương thức (đóng gói)?'],
        ['Is duplicated logic extracted into reusable methods / classes?', 'Logic lặp lại đã được tách thành phương thức / lớp dùng lại?'],
        ['Are collections chosen appropriately and generics used (no raw types)?', 'Collection chọn hợp lý và dùng generics (không raw type)?'],
        ['Is there no hard-coded file path, password or environment value?', 'Không có đường dẫn tệp, mật khẩu hay giá trị môi trường viết cứng?'],
      ] },
    ],
  },
  {
    key: 'CODE_PR', kind: 'CODE', sizeUnit: 'LOC', source: 'Pull request / technical review checklist',
    name: ['Pull request review checklist', 'Checklist rà soát pull request'],
    sections: [
      { name: ['Change', 'Thay đổi'], items: [
        ['Does the change do what the linked issue asks, and nothing unrelated?', 'Thay đổi làm đúng việc thẻ liên kết yêu cầu, không kèm việc không liên quan?'],
        ['Are new and changed paths covered by tests that pass in CI?', 'Đường mã mới/đổi có test phủ và CI xanh?'],
        ['Are error cases, empty states and permissions handled?', 'Đã xử lý trường hợp lỗi, rỗng và phân quyền?'],
      ] },
      { name: ['Security & maintainability', 'Bảo mật & bảo trì'], items: [
        ['Is input validated and output encoded (no injection, no XSS)?', 'Đầu vào được kiểm và đầu ra được mã hoá (không injection, không XSS)?'],
        ['Are secrets kept out of the code and logs?', 'Không để lộ khoá bí mật trong mã và log?'],
        ['Is the code readable, with names and comments that explain why?', 'Mã dễ đọc, tên và chú thích giải thích được "vì sao"?'],
        ['Are database migrations reversible / safe for existing data?', 'Migration CSDL an toàn với dữ liệu đang có?'],
      ] },
    ],
  },
  {
    key: 'UT_WHITEBOX', kind: 'DOC', sizeUnit: 'PAGE', source: 'FPT CheckList_UT_Whitebox — self-check of the Unit Test report (5.1)',
    name: ['Unit test report self-check (white-box)', 'Tự kiểm báo cáo Unit Test (hộp trắng)'],
    sections: [
      { name: ['Coverage', 'Độ phủ'], items: [
        ['Is every function under test listed on the Functions sheet with its class/method?', 'Mọi hàm được kiểm đã có trong sheet Functions kèm lớp/phương thức?'],
        ['Do the cases cover every statement and branch (decision coverage) of the function?', 'Các case phủ mọi câu lệnh và nhánh (phủ quyết định) của hàm?'],
        ['Are loop boundaries (0, 1, many iterations) tested?', 'Đã kiểm biên vòng lặp (0, 1, nhiều lần lặp)?'],
        ['Are exception paths tested and marked as Abnormal (A)?', 'Đã kiểm đường ngoại lệ và đánh dấu Abnormal (A)?'],
      ] },
      { name: ['Report quality', 'Chất lượng báo cáo'], items: [
        ['Does each UTCID have Condition and Confirmation marks (O)?', 'Mỗi UTCID có dấu O ở Condition và Confirmation?'],
        ['Are results (P/F), dates and defect IDs filled for executed cases?', 'Đã điền kết quả (P/F), ngày và mã lỗi cho case đã chạy?'],
        ['Do the Statistics totals match the per-function matrices?', 'Số tổng ở Statistics khớp ma trận từng hàm?'],
      ] },
    ],
  },
  {
    key: 'UT_BLACKBOX', kind: 'DOC', sizeUnit: 'PAGE', source: 'FPT CheckList_UT_Blackbox — self-check of the Unit Test report (5.1)',
    name: ['Unit test report self-check (black-box)', 'Tự kiểm báo cáo Unit Test (hộp đen)'],
    sections: [
      { name: ['Design techniques', 'Kỹ thuật thiết kế'], items: [
        ['Are equivalence partitions identified for every input (valid and invalid)?', 'Đã xác định lớp tương đương cho mọi đầu vào (hợp lệ và không hợp lệ)?'],
        ['Are boundary values (min−1, min, max, max+1) tested and marked as Boundary (B)?', 'Đã kiểm giá trị biên (min−1, min, max, max+1) và đánh dấu Boundary (B)?'],
        ['Does each case contain only one invalid input so failures are not masked?', 'Mỗi case chỉ có một đầu vào không hợp lệ để lỗi không che nhau?'],
        ['Is the expected output (return / exception / log message) stated for every case?', 'Mỗi case đều ghi kết quả mong đợi (giá trị trả / ngoại lệ / thông điệp)?'],
      ] },
      { name: ['Report quality', 'Chất lượng báo cáo'], items: [
        ['Are Normal / Abnormal / Boundary counts reasonable (abnormal ≥ normal)?', 'Số case Normal / Abnormal / Boundary hợp lý (abnormal ≥ normal)?'],
        ['Is the Cover / Record of change sheet complete?', 'Sheet Cover / Record of change đã đầy đủ?'],
      ] },
    ],
  },
];

export const CHECKLIST_KEYS = CHECKLISTS.map((c) => c.key) as [string, ...string[]];
export const checklistByKey = (k: string) => CHECKLISTS.find((c) => c.key === k) ?? null;

/** Câu hỏi của một mẫu theo ngôn ngữ — dùng khi mở phiên (chép vào work_review_items). */
export function checklistItems(key: string, language: 'vi' | 'en'): Array<{ section: string; question: string }> {
  const c = checklistByKey(key);
  if (!c) return [];
  const i = language === 'vi' ? 1 : 0;
  return c.sections.flatMap((s) => s.items.map((q) => ({ section: s.name[i], question: q[i] })));
}

// ─── Số đo ───────────────────────────────────────────────────────

/** Tốc độ khuyến nghị (Wiegers / Gilb & Graham): tài liệu ≤ 4 trang/giờ họp; mã ≤ 200 LOC/giờ. */
export const RATE_LIMIT = { PAGE: 4, LOC: 200 } as const;

export interface ReviewMetricInput {
  size: number | null; sizeUnit: 'PAGE' | 'LOC'; meetingMinutes: number | null; reworkMinutes: number | null;
  participants: Array<{ userId?: number; role: string; prepMinutes: number | null }>;
  items: Array<{ result: string | null; severity: string | null }>;
}

export function reviewMetrics(m: ReviewMetricInput) {
  const r1 = (n: number) => Math.round(n * 100) / 100;
  const people = new Set(m.participants.map((p, i) => p.userId ?? -i - 1)).size;
  const prepMin = m.participants.reduce((a, p) => a + (p.prepMinutes ?? 0), 0);
  const meetingEffortMin = (m.meetingMinutes ?? 0) * Math.max(1, people);
  const effortMin = prepMin + meetingEffortMin + (m.reworkMinutes ?? 0);
  const defects = m.items.filter((i) => i.result === 'NG').length;
  const answered = m.items.filter((i) => i.result).length;
  const major = m.items.filter((i) => i.result === 'NG' && (i.severity === 'CRITICAL' || i.severity === 'MAJOR')).length;
  const size = m.size && m.size > 0 ? m.size : null;
  const unitSize = size ? (m.sizeUnit === 'LOC' ? size / 1000 : size) : null; // mật độ lỗi: /trang hoặc /KLOC
  const rate = size && m.meetingMinutes ? size / (m.meetingMinutes / 60) : null;
  return {
    size, sizeUnit: m.sizeUnit, participants: people,
    prepHours: r1(prepMin / 60), meetingHours: r1((m.meetingMinutes ?? 0) / 60), effortHours: r1(effortMin / 60), reworkHours: r1((m.reworkMinutes ?? 0) / 60),
    defects, majorDefects: major, checklistProgress: m.items.length ? Math.round((answered / m.items.length) * 100) : 0,
    /** trang/giờ hoặc LOC/giờ trong buổi họp (inspection rate) */
    rate: rate == null ? null : r1(rate),
    rateTooFast: rate != null && rate > RATE_LIMIT[m.sizeUnit],
    /** lỗi / trang hoặc lỗi / KLOC */
    density: unitSize ? r1(defects / unitSize) : null,
    /** hiệu suất review: lỗi tìm được / người-giờ (chuẩn bị + họp) */
    efficiency: prepMin + meetingEffortMin > 0 ? r1(defects / ((prepMin + meetingEffortMin) / 60)) : null,
  };
}

/** Điều kiện đóng phiên: checklist đã trả lời hết + có quyết định; REINSPECT ⇒ chỉ đóng sau khi tái kiểm. */
export function closeBlockers(s: { decision: string | null; items: Array<{ result: string | null }>; participants: Array<{ role: string }> }): string[] {
  const out: string[] = [];
  if (!s.participants.some((p) => p.role === 'MODERATOR')) out.push('NO_MODERATOR');
  if (s.items.some((i) => !i.result)) out.push('CHECKLIST_INCOMPLETE');
  if (!s.decision) out.push('NO_DECISION');
  return out;
}

// ─── Biên bản ────────────────────────────────────────────────────

export interface MinutesInput {
  language: 'vi' | 'en';
  project: { name: string; key: string };
  session: { key: string; title: string; kind: string; method: string; checklistName: string; workProduct: string | null; prUrl: string | null; status: string; decision: string | null; meetingAt: Date | null; entryCriteria: string | null; exitCriteria: string | null; notes: string | null };
  participants: Array<{ name: string; role: string; prepMinutes: number | null }>;
  items: Array<{ section: string; question: string; result: string | null; line: string | null; note: string | null; severity: string | null; defectKey: string | null }>;
  metrics: ReturnType<typeof reviewMetrics>;
}

const e = (s: string | null | undefined) => (s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ');

export function reviewMinutesMarkdown(d: MinutesInput): string {
  const vi = d.language === 'vi';
  const T = (en: string, v: string) => (vi ? v : en);
  const DEC: Record<string, [string, string]> = { ACCEPT: ['Accept as is', 'Chấp nhận'], ACCEPT_WITH_CHANGES: ['Accept with minor changes (verify by moderator)', 'Chấp nhận kèm sửa nhỏ (người điều phối xác nhận)'], REINSPECT: ['Re-inspect after rework', 'Rà soát lại sau khi sửa'] };
  const ROLE: Record<string, [string, string]> = { MODERATOR: ['Moderator', 'Người điều phối'], AUTHOR: ['Author', 'Tác giả'], REVIEWER: ['Reviewer / Inspector', 'Người rà soát'], SCRIBE: ['Scribe (recorder)', 'Thư ký'], READER: ['Reader', 'Người đọc'] };
  const u = d.metrics.sizeUnit === 'LOC' ? 'LOC' : T('pages', 'trang');
  const L: string[] = [];
  L.push(`# ${T('Review record', 'Biên bản rà soát')} ${d.session.key} — ${d.session.title}`, '');
  L.push(`| ${T('Field', 'Mục')} | ${T('Value', 'Giá trị')} |`, '|---|---|');
  L.push(`| ${T('Project', 'Dự án')} | ${e(d.project.name)} (${d.project.key}) |`);
  L.push(`| ${T('Work product', 'Sản phẩm được rà soát')} | ${e(d.session.workProduct) || '—'}${d.session.prUrl ? ` · ${e(d.session.prUrl)}` : ''} |`);
  L.push(`| ${T('Review type', 'Loại rà soát')} | ${d.session.method} (IEEE 1028) · ${d.session.kind === 'CODE' ? T('code', 'mã nguồn') : T('document', 'tài liệu')} |`);
  L.push(`| ${T('Checklist', 'Checklist')} | ${e(d.session.checklistName)} |`);
  L.push(`| ${T('Meeting', 'Buổi họp')} | ${d.session.meetingAt ? d.session.meetingAt.toISOString().replace('T', ' ').slice(0, 16) + ' UTC' : '—'} |`);
  L.push(`| ${T('Status', 'Trạng thái')} | ${d.session.status} |`);
  L.push('');
  L.push(`## 1. ${T('Participants & roles', 'Thành phần & vai trò')}`);
  L.push(`| ${T('Name', 'Họ tên')} | ${T('Role', 'Vai trò')} | ${T('Preparation (min)', 'Chuẩn bị (phút)')} |`, '|---|---|---|');
  for (const p of d.participants) L.push(`| ${e(p.name)} | ${T(...(ROLE[p.role] ?? [p.role, p.role]))} | ${p.prepMinutes ?? '—'} |`);
  L.push('');
  if (d.session.entryCriteria || d.session.exitCriteria) {
    L.push(`## 2. ${T('Entry & exit criteria', 'Tiêu chí bắt đầu & kết thúc')}`);
    if (d.session.entryCriteria) L.push(`**${T('Entry', 'Bắt đầu')}:** ${d.session.entryCriteria}`, '');
    if (d.session.exitCriteria) L.push(`**${T('Exit', 'Kết thúc')}:** ${d.session.exitCriteria}`, '');
  }
  L.push(`## 3. ${T('Checklist results', 'Kết quả checklist')}`);
  L.push(`| # | ${T('Section', 'Nhóm')} | ${T('Item', 'Câu hỏi')} | ${T('Result', 'Kết quả')} | ${T('Defect', 'Lỗi')} | ${T('Line / location', 'Dòng / vị trí')} | ${T('Note', 'Ghi chú')} |`, '|---|---|---|---|---|---|---|');
  d.items.forEach((i, k) => L.push(`| ${k + 1} | ${e(i.section)} | ${e(i.question)} | ${i.result ?? '—'} | ${i.defectKey ?? ''}${i.severity ? ` (${i.severity})` : ''} | ${e(i.line)} | ${e(i.note)} |`));
  L.push('');
  L.push(`## 4. ${T('Metrics', 'Số đo')}`);
  L.push(`| ${T('Metric', 'Số đo')} | ${T('Value', 'Giá trị')} |`, '|---|---|');
  L.push(`| ${T('Size reviewed', 'Khối lượng rà soát')} | ${d.metrics.size ?? '—'} ${u} |`);
  L.push(`| ${T('Preparation effort', 'Công chuẩn bị')} | ${d.metrics.prepHours} h |`);
  L.push(`| ${T('Meeting duration', 'Thời lượng họp')} | ${d.metrics.meetingHours} h |`);
  L.push(`| ${T('Total effort (prep + meeting + rework)', 'Tổng công (chuẩn bị + họp + sửa)')} | ${d.metrics.effortHours} h |`);
  L.push(`| ${T('Defects found (major+)', 'Số lỗi tìm được (major+)')} | ${d.metrics.defects} (${d.metrics.majorDefects}) |`);
  L.push(`| ${T(`Inspection rate (${u}/hour)`, `Tốc độ rà soát (${u}/giờ)`)} | ${d.metrics.rate ?? '—'}${d.metrics.rateTooFast ? ` ⚠ ${T(`above the recommended ${RATE_LIMIT[d.metrics.sizeUnit]}`, `vượt mức khuyến nghị ${RATE_LIMIT[d.metrics.sizeUnit]}`)}` : ''} |`);
  L.push(`| ${T(`Defect density (per ${d.metrics.sizeUnit === 'LOC' ? 'KLOC' : 'page'})`, `Mật độ lỗi (mỗi ${d.metrics.sizeUnit === 'LOC' ? 'KLOC' : 'trang'})`)} | ${d.metrics.density ?? '—'} |`);
  L.push(`| ${T('Review efficiency (defects / person-hour)', 'Hiệu suất rà soát (lỗi / người-giờ)')} | ${d.metrics.efficiency ?? '—'} |`);
  L.push('');
  L.push(`## 5. ${T('Decision', 'Quyết định')}`);
  L.push(d.session.decision ? T(...(DEC[d.session.decision] ?? [d.session.decision, d.session.decision])) : T('Not decided yet.', 'Chưa có quyết định.'));
  if (d.session.notes) L.push('', d.session.notes);
  L.push('');
  L.push(`## 6. ${T('Sign-off', 'Ký xác nhận')}`);
  L.push(`| ${T('Role', 'Vai trò')} | ${T('Name', 'Họ tên')} | ${T('Signature', 'Chữ ký')} | ${T('Date', 'Ngày')} |`, '|---|---|---|---|');
  for (const role of ['MODERATOR', 'AUTHOR', 'SCRIBE'] as const) {
    const p = d.participants.find((x) => x.role === role);
    L.push(`| ${T(...ROLE[role])} | ${e(p?.name)} | | |`);
  }
  return L.join('\n');
}
