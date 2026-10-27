/**
 * SWT301 · LAB CHƯƠNG 3 — Review + phân tích tĩnh BookingService (giống Lab 1 của trường: review theo checklist, phân tích tĩnh,
 * câu 1 của PE). A. danh sách lỗi · B. bất thường luồng dữ liệu · C. V(G) từng phương thức · D. tổ chức buổi review.
 */
import { doiDau, KHOA, kiemReview, kiemKhoa, preSo, LOAI_LOI, LOAI_LOI_HTML, NOP_BAI, tn } from './_chung.mjs';

const MA = `public class BookingService {
    private BookingRepository repo;
    private int maxHours = 6;

    public String book(String studentId, String lab, int start, int hours) {
        String code;
        int used = repo.hoursThisWeek(studentId);
        if (studentId == null) {
            return "ERROR";
        }
        if (start < 7 || start > 20) {
            return "INVALID_START";
        }
        if (hours < 1 && hours > 3) {
            return "INVALID_HOURS";
        }
        if (used + hours >= maxHours) {
            return "WEEKLY_LIMIT";
        }
        code = "BK-" + lab + "-" + start;
        code = "BK-" + lab + "-" + start + "00";
        repo.save(new Booking(code, studentId, lab, start, hours));
        return code;
        System.out.println("saved " + code);
    }

    public int refund(int price, int hoursBefore) {
        int percent;
        if (hoursBefore >= 24) {
            percent = 100;
        } else if (hoursBefore >= 2) {
            percent = 50;
        }
        return price * percent / 100;
    }

    public boolean isPeak(int hour) {
        boolean peak = false;
        if (hour >= 9 && hour <= 11) peak = true;
        if (hour >= 14 && hour <= 16) peak = true;
        return peak;
    }
}`;
const KHOA_LOI = [
  { ma: 'K1', dong: [14], loai: ['LOGIC'], ten: 'hours < 1 && hours > 3 is always false — invalid durations are never rejected', tenVi: 'hours < 1 && hours > 3 luôn sai — thời lượng sai không bao giờ bị từ chối', nang: true },
  { ma: 'K2', dong: [24], loai: ['COMPILE'], ten: 'statement after return is unreachable — compile error', tenVi: 'lệnh sau return không tới được — lỗi biên dịch', nang: true },
  { ma: 'K3', dong: [28, 34], loai: ['COMPILE', 'DATA_TYPE', 'LOGIC'], ten: 'percent may be uninitialised when hoursBefore < 2 — compile error; the spec says 0%', tenVi: 'percent có thể chưa khởi tạo khi hoursBefore < 2 — lỗi biên dịch; đặc tả nói 0%', nang: true },
  { ma: 'K4', dong: [17], loai: ['BOUNDARY'], ten: '>= maxHours refuses a weekly total of exactly 6 hours', tenVi: '>= maxHours từ chối tổng đúng 6 giờ', nang: true },
  { ma: 'K5', dong: [7, 8], loai: ['LOGIC', 'EXCEPTION', 'VALIDATION'], ten: 'the repository is queried before studentId is validated' },
  { ma: 'K6', dong: [20, 21], loai: ['LOGIC', 'CONVENTION'], ten: 'code is assigned twice (dd anomaly) — line 20 is dead' },
  { ma: 'K7', dong: [11, 12, 13, 14, 15, 16, 17], loai: ['VALIDATION'], ten: 'no check that the booking ends by 21:00 (start + hours > 21)' },
  { ma: 'K8', dong: [5, 20], loai: ['VALIDATION'], ten: 'lab is never validated (null / unknown lab code)' },
  { ma: 'K9', dong: [2], loai: ['EXCEPTION'], ten: 'repo is never initialised or injected — NullPointerException' },
  { ma: 'K10', dong: [3], loai: ['CONVENTION'], ten: 'maxHours should be a constant (static final)' },
  { ma: 'K11', dong: [39, 40], loai: ['CONVENTION'], ten: 'magic numbers 9, 11, 14, 16 for peak hours' },
  { ma: 'K12', dong: [9, 12, 15, 18], loai: ['CONVENTION'], ten: 'errors returned as magic strings instead of exceptions or an enum' },
  { ma: 'K13', dong: [8], loai: ['VALIDATION'], ten: 'an empty or blank studentId is accepted' },
];
const SAI = [
  { dong: [11], loai: ['BOUNDARY', 'LOGIC'], ten: 'line 11 is correct: 7 and 20 are valid start hours' },
  { dong: [39, 40], loai: ['LOGIC', 'BOUNDARY'], ten: 'the peak ranges are inclusive as specified' },
];

const KIEM = [
  ...kiemReview({ bien: 'ISSUES', khoa: KHOA_LOI, sai: SAI, toiThieu: 10, nhom: 'f1', loaiHopLe: LOAI_LOI }),
  ...kiemKhoa([
    ['code', 'dd'], ['percent', 'ur'], ['used', 'none'], ['peak', 'dd'],
  ].map(([v, a]) => ({ moTa: { en: `B — data-flow anomaly of ${v}`, vi: `B — bất thường luồng dữ liệu của ${v}` }, bieuThuc: `DATA_FLOW.${v}`, chap: [a], nhom: 'f2' }))),
  ...kiemKhoa([
    ['book', 5], ['refund', 3], ['isPeak', 3],
  ].map(([m, v]) => ({ moTa: { en: `C — V(G) of ${m}`, vi: `C — V(G) của ${m}` }, bieuThuc: `COMPLEXITY.${m}`, chap: [v], kieu: 'so', nhom: 'f3' }))),
  ...kiemKhoa([
    { moTa: { en: 'D — review type', vi: 'D — loại review' }, bieuThuc: 'REVIEW_PLAN.type', chap: ['Inspection'], nhom: 'f4' },
    { moTa: { en: 'D — who must not lead it', vi: 'D — ai không được dẫn' }, bieuThuc: 'REVIEW_PLAN.notFacilitator', chap: ['Author'], nhom: 'f4' },
    { moTa: { en: 'D — activity in which reviewers note potential defects', vi: 'D — hoạt động reviewer ghi lỗi tiềm năng' }, bieuThuc: 'REVIEW_PLAN.noteDefectsIn', chap: ['Individual review'], nhom: 'f4' },
    { moTa: { en: 'D — activity in which the product is accepted', vi: 'D — hoạt động chấp nhận sản phẩm' }, bieuThuc: 'REVIEW_PLAN.acceptIn', chap: ['Fixing and reporting'], nhom: 'f4' },
    { moTa: { en: 'D — who fixes the defects', vi: 'D — ai sửa lỗi' }, bieuThuc: 'REVIEW_PLAN.fixedBy', chap: ['Author'], nhom: 'f4' },
  ]),
];

const BAN_IN = {
  tieuDe: 'Lab 3 — Review and Static Analysis of BookingService',
  phu: { en: 'Chapter 3 lab · school Lab 1 format (review checklist, static analysis, PE Question 1) · 10 marks', vi: 'Lab chương 3 · dạng Lab 1 của trường (checklist review, phân tích tĩnh, câu 1 PE) · 10 điểm' },
  moTa: {
    en: `<p>School Lab 1 asks you to review code with a checklist and to run a static-analysis tool; PE Question 1 asks for “at least 8 issues with line and fix”. This lab trains both on the LabBook <code>BookingService</code> — written by a new team member — before it is merged.</p>
<p><b>Specification.</b> <code>book</code>: studentId required (not blank); lab is LAB01, LAB02 or LAB03; start hour 7–20; 1–3 hours; the booking must end by 21:00; at most 6 hours per week in total; returns the code <code>BK-&lt;lab&gt;-&lt;HH&gt;00</code>. <code>refund</code>: cancelled ≥ 24 h before the start → 100%; 2–24 h → 50%; less than 2 h → 0%. <code>isPeak</code>: 09–11 and 14–16 inclusive are peak hours.</p>${preSo(MA)}<p>Issue types: ${LOAI_LOI_HTML.en}</p>`,
    vi: `<p>Lab 1 của trường yêu cầu review mã theo checklist và chạy công cụ phân tích tĩnh; câu 1 của PE yêu cầu “ít nhất 8 lỗi kèm dòng và cách sửa”. Lab này luyện cả hai trên <code>BookingService</code> của LabBook — do một thành viên mới viết — trước khi merge.</p>
<p><b>Đặc tả.</b> <code>book</code>: bắt buộc studentId (không rỗng); lab là LAB01, LAB02 hoặc LAB03; giờ bắt đầu 7–20; 1–3 giờ; phải kết thúc trước 21:00; tổng tối đa 6 giờ/tuần; trả mã <code>BK-&lt;lab&gt;-&lt;HH&gt;00</code>. <code>refund</code>: huỷ ≥ 24 giờ trước → 100%; 2–24 giờ → 50%; dưới 2 giờ → 0%. <code>isPeak</code>: 09–11 và 14–16 (tính cả hai đầu) là giờ cao điểm.</p>${preSo(MA)}<p>Loại lỗi: ${LOAI_LOI_HTML.vi}</p>`,
  },
  chucNangChinh: [
    { en: 'A. Review log: at least 10 issues with line, type, description and fix.', vi: 'A. Nhật ký review: ít nhất 10 lỗi kèm dòng, loại, mô tả, cách sửa.' },
    { en: 'B. Data-flow anomalies of four variables.', vi: 'B. Bất thường luồng dữ liệu của bốn biến.' },
    { en: 'C. V(G) of the three methods.', vi: 'C. V(G) của ba phương thức.' },
    { en: 'D. Organise the formal review.', vi: 'D. Tổ chức buổi review chính thức.' },
  ],
  yeuCauChung: [{ en: 'Compare the code with the SPECIFICATION, not with what it seems to intend.', vi: 'So mã với ĐẶC TẢ, không so với điều mã có vẻ muốn làm.' }],
  cayThuMuc: `answers/
├── a-issues.js     ← const ISSUES = [ { line, type, severity, description, fix } ]
├── b-dataflow.js   ← const DATA_FLOW = { code, percent, used, peak }   ('ur' | 'dd' | 'du' | 'dd and du' | 'none')
├── c-complexity.js ← const COMPLEXITY = { book, refund, isPeak }
└── d-review.js     ← const REVIEW_PLAN = { type, notFacilitator, noteDefectsIn, acceptIn, fixedBy }`,
  moHinh: {
    ten: 'REVIEW_PLAN (Part D) — allowed values',
    truong: [
      ['type', 'string', { en: 'Informal review · Walkthrough · Technical review · Inspection', vi: 'Informal review · Walkthrough · Technical review · Inspection' }],
      ['notFacilitator · fixedBy', 'string', { en: 'Author · Management · Facilitator · Review leader · Reviewer · Scribe', vi: 'Author · Management · Facilitator · Review leader · Reviewer · Scribe' }],
      ['noteDefectsIn · acceptIn', 'string', { en: 'Planning · Initiate review · Individual review · Issue communication and analysis · Fixing and reporting', vi: 'Planning · Initiate review · Individual review · Issue communication and analysis · Fixing and reporting' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Review log', vi: 'A. Nhật ký review' }, diem: 4, yeuCau: [{ en: 'At least 10 distinct issues; the four critical ones (always-false condition, unreachable statement, uninitialised variable, weekly-limit boundary); no false claim; every issue with a fix.', vi: 'Ít nhất 10 lỗi khác nhau; bốn lỗi nghiêm trọng (điều kiện luôn sai, lệnh không tới được, biến chưa khởi tạo, biên giới hạn tuần); không khẳng định sai; mỗi lỗi có cách sửa.' }], hook: ['checklist-based review'] },
    { ten: { en: 'B. Data-flow anomalies', vi: 'B. Bất thường luồng dữ liệu' }, diem: 2, yeuCau: [{ en: 'For <code>code</code>, <code>percent</code>, <code>used</code>, <code>peak</code>: ur, dd, du, “dd and du” or none (static analysis is path-insensitive: consider every path of the graph).', vi: 'Với <code>code</code>, <code>percent</code>, <code>used</code>, <code>peak</code>: ur, dd, du, “dd and du” hoặc none (phân tích tĩnh không phân biệt đường khả thi: xét mọi đường của đồ thị).' }], hook: ['data-flow analysis'] },
    { ten: { en: 'C. Cyclomatic complexity', vi: 'C. Độ phức tạp chu trình' }, diem: 2, yeuCau: [{ en: 'V(G) of book, refund and isPeak (count each IF once, even with && / ||).', vi: 'V(G) của book, refund và isPeak (mỗi IF đếm một lần, kể cả có && / ||).' }], hook: ['V(G)'] },
    { ten: { en: 'D. Organise the review', vi: 'D. Tổ chức review' }, diem: 2, moTa: { en: 'The team wants the most formal review before release: entry and exit criteria, a mandatory checklist, metrics for process improvement and a trained moderator.', vi: 'Nhóm muốn buổi review chính quy nhất trước khi phát hành: tiêu chí vào/ra, checklist bắt buộc, số liệu để cải tiến quy trình và một moderator được đào tạo.' }, yeuCau: [{ en: 'Review type; the role that must not lead it; the activity in which reviewers note potential defects; the activity in which the product is accepted; who fixes the defects.', vi: 'Loại review; vai trò không được dẫn; hoạt động reviewer ghi lỗi tiềm năng; hoạt động chấp nhận sản phẩm; ai sửa lỗi.' }], hook: ['review process'] },
  ],
  idBatBuoc: [['ISSUES', 'answers/a-issues.js'], ['DATA_FLOW', 'answers/b-dataflow.js'], ['COMPLEXITY', 'answers/c-complexity.js'], ['REVIEW_PLAN', 'answers/d-review.js']],
  truDiem: [
    { en: 'Reporting line 11 as a boundary defect (7 and 20 are valid).', vi: 'Báo dòng 11 là lỗi biên (7 và 20 hợp lệ).' },
    { en: 'Calling the unreachable println “just a warning” — in Java it does not compile.', vi: 'Gọi println không tới được là “chỉ cảnh báo” — trong Java nó không biên dịch được.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI_A = `// Review log of BookingService — 13 issues (any 10 correct earn the list marks).
const ISSUES = [
  { line: 14, type: 'LOGIC', severity: 'High', description: 'hours < 1 && hours > 3 can never be true, so 0 or 5 hours are accepted.', fix: 'if (hours < 1 || hours > 3)' },
  { line: 24, type: 'COMPILE', severity: 'High', description: 'println after return is unreachable: javac reports an error.', fix: 'Log before the return, or remove the line.' },
  { line: 34, type: 'COMPILE', severity: 'High', description: 'percent is not assigned when hoursBefore < 2: “variable might not have been initialized”; the spec wants 0%.', fix: 'else { percent = 0; } (or initialise int percent = 0).' },
  { line: 17, type: 'BOUNDARY', severity: 'High', description: '>= maxHours refuses a total of exactly 6 hours, which the spec allows.', fix: 'if (used + hours > maxHours)' },
  { line: 7, type: 'LOGIC', severity: 'Medium', description: 'The repository is called before studentId is checked (null passed to the query).', fix: 'Validate all inputs first, then query the repository.' },
  { line: 20, type: 'LOGIC', severity: 'Low', description: 'code is assigned on line 20 and immediately overwritten on line 21 (dd anomaly).', fix: 'Delete line 20.' },
  { line: 11, type: 'VALIDATION', severity: 'Medium', description: 'No check that start + hours <= 21 (booking must end by 21:00).', fix: 'if (start + hours > 21) return/throw AFTER_CLOSING.' },
  { line: 5, type: 'VALIDATION', severity: 'Medium', description: 'lab is never validated: null or unknown codes are saved.', fix: 'Reject a lab that is not LAB01, LAB02 or LAB03.' },
  { line: 2, type: 'EXCEPTION', severity: 'High', description: 'repo is never initialised or injected: NullPointerException on line 7.', fix: 'Inject it through the constructor (final field).' },
  { line: 3, type: 'CONVENTION', severity: 'Low', description: 'maxHours is a mutable field for a business constant.', fix: 'private static final int MAX_WEEKLY_HOURS = 6;' },
  { line: 39, type: 'CONVENTION', severity: 'Low', description: 'Magic numbers for the peak hours.', fix: 'Named constants or a configurable list of peak windows.' },
  { line: 9, type: 'CONVENTION', severity: 'Low', description: 'Errors are returned as magic strings mixed with valid codes.', fix: 'Throw specific exceptions (or return a result type / enum).' },
  { line: 8, type: 'VALIDATION', severity: 'Medium', description: 'An empty or blank studentId passes the check.', fix: 'if (studentId == null || studentId.isBlank())' },
];
`;

export default doiDau({
  slug: 'swt301-3-lab-review-static-booking-service',
  ten: 'Lab 3 — Review & Static Analysis (BookingService)',
  moTaModule: 'Lab chương 3 (dạng Lab 1 trường + câu 1 PE): review BookingService theo đặc tả (≥ 10 lỗi, có bẫy), bất thường luồng dữ liệu, V(G) từng phương thức, tổ chức buổi inspection.',
  khoa: KHOA,
  baiHoc: 'swt301-static-analysis',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 3 — Review and Static Analysis of BookingService',
    doKho: 'HARD', phut: 90, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'line 14: if (hours < 1 && hours > 3)', output: 'LOGIC — always false; fix with ||', explanation: 'A value cannot be below 1 and above 3 at the same time.|||Một giá trị không thể vừa dưới 1 vừa trên 3.' }],
    khaiNiem: ['code review', 'static analysis', 'data flow analysis', 'cyclomatic complexity', 'review process'],
    tienQuyet: ['SWT301 chapter 3'],
    the: ['swt301', 'lab', 'static-testing'],
    banIn: BAN_IN,
    thuatNgu: [...tn('cyclomatic', 'offByOne'), { en: 'data-flow anomaly', vi: 'bất thường luồng dữ liệu (ur/dd/du)' }, { en: 'unreachable code', vi: 'mã không tới được' }, { en: 'inspection', vi: 'thanh tra — review chính quy nhất' }],
    goiY: [
      'A: so từng dòng với đặc tả — có kiểm đủ chưa (lab, kết thúc 21:00, chuỗi rỗng)? toán tử &&/|| đúng chưa? biên >= hay >? có lệnh nào sau return?',
      'B: code gán hai lần liền (dd); percent có đường không gán mà vẫn đọc (ur); peak = false rồi peak = true trên cùng một đường (dd).',
      'C: book có 4 IF ⇒ 5; refund có 2 quyết định (if, else if) ⇒ 3; isPeak 2 IF ⇒ 3.',
    ],
    loiHayGap: ['Đếm điều kiện ghép thành nhiều quyết định khi tính V(G) ở phần C.', 'Báo dòng 11 sai biên.', 'Coi biến used là lỗi luồng dữ liệu — nó được gán rồi dùng ở dòng 17.'],
    moTaNgan: 'Lab chương 3: review + phân tích tĩnh BookingService.',
    giaiThich: {
      en: '<p><b>A.</b> Critical: line 14 (&& → ||), line 24 (unreachable), lines 28/34 (uninitialised percent), line 17 (>= → >). <b>B.</b> code dd · percent ur · used none · peak dd. <b>C.</b> book 5 · refund 3 · isPeak 3. <b>D.</b> Inspection, not led by the author; defects noted in individual review; accepted in fixing and reporting; fixed by the author.</p>',
      vi: '<p><b>A.</b> Nghiêm trọng: dòng 14, 24, 28/34, 17. <b>B.</b> code dd · percent ur · used none · peak dd. <b>C.</b> 5 · 3 · 3. <b>D.</b> Inspection, tác giả không dẫn; ghi lỗi ở review cá nhân; chấp nhận ở sửa & báo cáo; tác giả sửa.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['answers/a-issues.js', 'answers/b-dataflow.js', 'answers/c-complexity.js', 'answers/d-review.js'], kiem: KIEM },
    khoiDau: {
      'answers/a-issues.js': `// type: ${LOAI_LOI.join(' | ')}\nconst ISSUES = [\n  { line: 14, type: 'LOGIC', severity: 'High', description: 'hours < 1 && hours > 3 is always false.', fix: 'Use ||.' },\n];\n`,
      'answers/b-dataflow.js': "const DATA_FLOW = { code: '', percent: '', used: '', peak: '' };\n",
      'answers/c-complexity.js': 'const COMPLEXITY = { book: 0, refund: 0, isPeak: 0 };\n',
      'answers/d-review.js': "const REVIEW_PLAN = { type: '', notFacilitator: '', noteDefectsIn: '', acceptIn: '', fixedBy: '' };\n",
    },
    loiGiai: {
      'answers/a-issues.js': GIAI_A,
      'answers/b-dataflow.js': "// code: d(20) d(21) → dd · percent: on the path hoursBefore < 2 it is read (34) without a definition → ur\n// used: d(7) u(17) → none · peak: d(38) d(39) on the same path → dd\nconst DATA_FLOW = { code: 'dd', percent: 'ur', used: 'none', peak: 'dd' };\n",
      'answers/c-complexity.js': '// book: IFs at 8, 11, 14, 17 → 5 · refund: if + else-if → 3 · isPeak: two IFs → 3\nconst COMPLEXITY = { book: 5, refund: 3, isPeak: 3 };\n',
      'answers/d-review.js': "const REVIEW_PLAN = {\n  type: 'Inspection',\n  notFacilitator: 'Author',\n  noteDefectsIn: 'Individual review',\n  acceptIn: 'Fixing and reporting',\n  fixedBy: 'Author',\n};\n",
    },
    thamKhao: 'https://www.sonarsource.com/products/sonarlint/',
    boYeu: [
      { ten: 'báo nhầm dòng 11', tep: { 'answers/a-issues.js': GIAI_A.replace("{ line: 11, type: 'VALIDATION'", "{ line: 11, type: 'BOUNDARY'") }, phaiTruot: ['No false claims'] },
      { ten: 'V(G) đếm điều kiện con', tep: { 'answers/c-complexity.js': 'const COMPLEXITY = { book: 7, refund: 3, isPeak: 5 };\n' }, phaiTruot: ['C — V(G) of book'] },
    ],
  }],
});
