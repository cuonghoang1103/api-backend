/**
 * SWT301 · 3.3 — Review types, review techniques, success factors (SWT3 slide 54–93, LO-3.2.3–3.2.5) + review mã theo checklist.
 */
import { doiDau, KHOA, hai, giai, lc, kiemReview, preSo, bangHtml } from './_chung.mjs';
import { tinhDe, jsDe } from './_de.mjs';

const LOAI = ['Informal review', 'Walkthrough', 'Technical review', 'Inspection'];
const E1 = tinhDe({
  tieuDe: 'Review types 1 — Informal review, walkthrough, technical review or inspection?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>The four review types differ in purpose, leader, formality, preparation, scribe, checklists and documentation (the table examiners test, lesson 3.3). Match each characteristic to the type it describes best.</p>', vi: '<p>Bốn loại review khác nhau ở mục đích, người dẫn, mức chính quy, chuẩn bị, thư ký, checklist và tài liệu (bảng đề thi hay hỏi, bài 3.3). Ghép mỗi đặc điểm với loại phù hợp nhất.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Review type of each characteristic', 'Loại review của từng đặc điểm'),
    cot: [{ ma: 'c', ten: 'Characteristic' }, { ma: 't', ten: 'Review type', luaChon: LOAI }],
    hang: [
      'A colleague glances at your code before you push (“buddy check”); nothing is documented',
      'Led by the author; may range from quite informal to very formal',
      'Main purposes include training participants and exchanging ideas; dry runs and simulations are typical',
      'Ideally led by a trained facilitator; aims to gain consensus and evaluate technical alternatives',
      'Reviewers are technical peers of the author and experts in the same or other disciplines',
      'Led by a trained moderator who is NOT the author; checklists are mandatory',
      'Defined entry and exit criteria; metrics are collected to improve the development process',
      'Pair programming in an Agile team',
    ].map((c, i) => ({ ma: `r${i}`, o: { c } })),
    dapAn: { 'r0.t': LOAI[0], 'r1.t': LOAI[1], 'r2.t': LOAI[1], 'r3.t': LOAI[2], 'r4.t': LOAI[2], 'r5.t': LOAI[3], 'r6.t': LOAI[3], 'r7.t': LOAI[0] },
    giaiThich: giai('Informal: no process (buddy check, pairing). Walkthrough: led by the author, knowledge transfer, dry runs. Technical review: technical peers, consensus, alternatives, ideally a trained facilitator. Inspection: most formal — trained moderator (not the author), mandatory checklists, entry/exit criteria, metrics.', 'Informal: không quy trình (buddy check, pair). Walkthrough: tác giả dẫn, chuyển giao kiến thức, chạy thử. Technical review: đồng nghiệp kỹ thuật, đồng thuận, phương án, lý tưởng có facilitator được đào tạo. Inspection: chính quy nhất — moderator được đào tạo (không phải tác giả), checklist bắt buộc, tiêu chí vào/ra, số liệu.'),
  }],
  goiY: ['“Tác giả dẫn” chỉ có ở walkthrough.', '“Checklist bắt buộc, số liệu, không phải tác giả dẫn” ⇒ inspection.'],
  loiHayGap: ['Cho rằng technical review luôn do tác giả dẫn.', 'Xếp pair programming vào walkthrough.'],
  giaiThich: '<p>Informal · Walkthrough · Walkthrough · Technical review · Technical review · Inspection · Inspection · Informal.</p>',
  thuatNgu: [{ en: 'walkthrough', vi: 'buổi tác giả dẫn mọi người đi qua tài liệu' }, { en: 'technical review', vi: 'review kỹ thuật giữa các chuyên gia' }, { en: 'inspection', vi: 'thanh tra — review chính quy nhất' }, { en: 'buddy check', vi: 'nhờ một đồng nghiệp xem nhanh' }],
  khaiNiem: ['review types'],
});

const KT = ['Ad hoc', 'Checklist-based', 'Scenarios and dry runs', 'Role-based', 'Perspective-based'];
const E2 = tinhDe({
  tieuDe: 'Review types 2 — Which review technique is the reviewer using?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>During individual review, a reviewer can use one of five techniques. Identify the technique in each situation from the LabBook requirements review.</p>', vi: '<p>Trong review cá nhân, reviewer có thể dùng một trong năm kỹ thuật. Xác định kỹ thuật trong mỗi tình huống của buổi review yêu cầu LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Review technique', 'Kỹ thuật review'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'k', ten: 'Technique', luaChon: KT }],
    hang: [
      'Reviewers get no guidance; each reads the document sequentially and notes what they find',
      'Each reviewer answers the team’s list of 25 questions derived from past defects',
      'Reviewers follow the use case “cancel a booking” step by step as if executing it',
      'One reviewer reads as a first-year student, another as an experienced lab manager',
      'One reviewer reads as the tester who must design tests, another as the developer who must implement it',
      'While reading, the reviewer tries to draft the acceptance tests the requirement will need',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': KT[0], 'r1.k': KT[1], 'r2.k': KT[2], 'r3.k': KT[3], 'r4.k': KT[4], 'r5.k': KT[4] },
    giaiThich: giai('Role-based = types of end users / roles in the organisation (personas); perspective-based = stakeholder viewpoints (tester, developer, marketing…) and using the work product to produce what they would derive from it.', 'Role-based = loại người dùng / vai trò trong tổ chức (persona); perspective-based = góc nhìn các bên liên quan (tester, developer…) và dùng sản phẩm để tạo ra thứ họ sẽ suy ra từ nó.'),
  }],
  goiY: ['Persona người dùng ⇒ role-based; góc nhìn bên liên quan (tester/dev/BA) ⇒ perspective-based.', 'Đi từng bước một kịch bản ⇒ scenarios and dry runs.'],
  loiHayGap: ['Nhầm role-based với perspective-based.', 'Cho rằng ad hoc là "không review".'],
  giaiThich: '<p>Ad hoc · Checklist-based · Scenarios and dry runs · Role-based · Perspective-based · Perspective-based.</p>',
  thuatNgu: [{ en: 'perspective-based reading', vi: 'đọc theo góc nhìn của từng bên liên quan' }, { en: 'dry run', vi: 'chạy thử trên giấy' }],
  khaiNiem: ['review techniques'],
});

const E3 = tinhDe({
  tieuDe: 'Review types 3 — What makes a review succeed? (K2)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Organisational and people-related success factors of reviews, and the checking rate. Five questions.</p>', vi: '<p>Các yếu tố thành công của review về tổ chức và con người, và tốc độ kiểm tra. Năm câu.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is an ORGANISATIONAL success factor for reviews?', 'Đâu là yếu tố thành công về TỔ CHỨC của review?'), luaChon: lc(['a', 'Defects found are acknowledged and handled objectively'], ['b', 'Each review has clear objectives, defined during planning, used as measurable exit criteria'], ['c', 'Participants avoid body language that signals boredom'], ['d', 'Testers are valued reviewers']), dapAn: ['b'], giaiThich: giai('Clear objectives, suitable review type, adequate time, management support and limited-size work products are organisational; the other options are people-related.', 'Mục tiêu rõ, loại review phù hợp, đủ thời gian, quản lý ủng hộ, sản phẩm vừa cỡ là yếu tố tổ chức; các phương án còn lại là yếu tố con người.') },
    { ma: 'q2', de: hai('Which is a PEOPLE-related success factor?', 'Đâu là yếu tố thành công về CON NGƯỜI?'), luaChon: lc(['a', 'Management supports the review process'], ['b', 'The review is conducted in an atmosphere of trust; the outcome is not used to evaluate the participants'], ['c', 'Large documents are reviewed in one sitting'], ['d', 'Reviews are scheduled with adequate notice']), dapAn: ['b'], giaiThich: giai('Trust, the right people, objectivity and well-managed meetings are people factors.', 'Tin tưởng, đúng người, khách quan và họp được điều phối tốt là yếu tố con người.') },
    { ma: 'q3', de: hai('Why do inspections use a slow checking rate (around one page per hour on the slides)?', 'Vì sao inspection dùng tốc độ kiểm tra chậm (khoảng một trang một giờ trên slide)?'), luaChon: lc(['a', 'To make reviews last longer'], ['b', 'Because defect detection drops sharply when reviewers read too fast'], ['c', 'Because the rules forbid more than one page'], ['d', 'Because scribes write slowly']), dapAn: ['b'], giaiThich: giai('Above the optimum checking rate, reviewers miss most defects; small work products reviewed carefully find more.', 'Đọc nhanh hơn tốc độ tối ưu thì bỏ sót phần lớn lỗi; sản phẩm nhỏ đọc kỹ tìm được nhiều hơn.') },
    { ma: 'q4', de: hai('A team uses reviews to measure individual developer performance. What is the most likely effect?', 'Nhóm dùng kết quả review để chấm điểm từng developer. Hệ quả có khả năng nhất?'), luaChon: lc(['a', 'More defects reported'], ['b', 'Authors become defensive and reviewers hold back findings — reviews lose effectiveness'], ['c', 'No effect'], ['d', 'Reviews become shorter but better']), dapAn: ['b'], giaiThich: giai('The syllabus warns: review outcomes must not be used to evaluate participants.', 'Syllabus cảnh báo: không dùng kết quả review để đánh giá người tham gia.') },
    { ma: 'q5', de: hai('Which review type would you choose for a safety-critical module where metrics are needed to improve the process?', 'Chọn loại review nào cho mô-đun an toàn-tới-hạn cần số liệu để cải tiến quy trình?'), luaChon: lc(['a', 'Informal review'], ['b', 'Walkthrough'], ['c', 'Technical review'], ['d', 'Inspection']), dapAn: ['d'], giaiThich: giai('Inspection: the most formal, metrics gathered, used for high-risk work products and process improvement.', 'Inspection: chính quy nhất, có số liệu, dùng cho sản phẩm rủi ro cao và cải tiến quy trình.') },
  ],
  goiY: ['Tổ chức = mục tiêu, thời gian, quản lý, loại review; con người = tin tưởng, đúng người, khách quan.', 'Đọc quá nhanh ⇒ bỏ sót lỗi.'],
  loiHayGap: ['Nhầm yếu tố tổ chức với con người.', 'Cho rằng review dài hơn luôn tốt hơn.'],
  giaiThich: '<p>Answers: b · b · b · b · d.</p>',
  thuatNgu: [{ en: 'checking rate', vi: 'tốc độ kiểm tra (trang/giờ)' }],
  khaiNiem: ['review success factors'],
});

/* E4 — review mã theo checklist */
const MA = `public class BookingDao {
    private static final String PASSWORD = "Adm@1234";

    public List<Booking> findByStudent(String email) throws SQLException {
        Connection c = DriverManager.getConnection(URL, "admin", PASSWORD);
        Statement st = c.createStatement();
        ResultSet rs = st.executeQuery("SELECT * FROM bookings WHERE email = '" + email + "'");
        List<Booking> list = new ArrayList<>();
        while (rs.next()) {
            list.add(map(rs));
        }
        return list;
    }

    public int countHours(List<Booking> bs) {
        int h = 0;
        for (int i = 0; i <= bs.size() - 1; i++) {
            h = h + bs.get(i).getDuration();
        }
        return h;
    }

    public boolean overLimit(List<Booking> bs, int x) {
        try {
            return countHours(bs) + x > 6;
        } catch (Exception e) {
        }
        return false;
    }

    private Booking map(ResultSet rs) throws SQLException {
        Booking b = new Booking();
        b.setCode(rs.getString("code"));
        b.setDuration(rs.getInt("duration"));
        int unused = rs.getInt("id");
        return b;
    }
}`;
const CL = [['C1', 'Input validation: null, empty, range'], ['C2', 'Boundaries and loop bounds'], ['C3', 'Error and exception handling'], ['C4', 'Resource management (connections, streams)'], ['C5', 'Naming, constants, readability'], ['C6', 'Dead or duplicated code'], ['C7', 'Security (injection, secrets)'], ['C8', 'Performance']];
const E4 = jsDe({
  tieuDe: 'Review types 4 — Checklist-based code review of BookingDao',
  doKho: 'HARD', phut: 20,
  moTa: { en: `<p>Apply a <b>checklist-based</b> review (LO-3.2.4, K3) to the LabBook data-access class below. For each issue give the line, the checklist item it violates, a description and a fix. One line looks suspicious but is correct.</p>${preSo(MA)}${bangHtml(['Item', 'Checklist question'], CL)}`, vi: `<p>Áp dụng review <b>theo checklist</b> (LO-3.2.4, K3) cho lớp truy cập dữ liệu LabBook dưới đây. Mỗi lỗi ghi dòng, mục checklist bị vi phạm, mô tả và cách sửa. Có một dòng trông đáng ngờ nhưng thực ra đúng.</p>${preSo(MA)}${bangHtml(['Mục', 'Câu hỏi checklist'], CL)}` },
  yeuCau: [
    { en: '<code>ISSUES = [{ line, type: "C7", description, fix }]</code> — <code>type</code> is the checklist item.', vi: '<code>ISSUES = [{ line, type: "C7", description, fix }]</code> — <code>type</code> là mục checklist.' },
    { en: 'At least 8 real issues, including the three critical ones; no false positive.', vi: 'Ít nhất 8 lỗi thật, gồm ba lỗi nghiêm trọng; không báo nhầm.' },
  ],
  viDu: [{ input: '{ line: 7, type: "C7", description: "SQL built by concatenating the e-mail" }', output: 'the SQL-injection issue', explanation: 'Fix: PreparedStatement with a ? parameter.|||Sửa: PreparedStatement với tham số ?.' }],
  goiY: ['Đi qua checklist từng mục cho cả lớp: C7 (mật khẩu trong mã, nối chuỗi SQL), C4 (Connection/Statement/ResultSet không đóng), C3 (catch rỗng).', 'Dòng 17: i <= size − 1 tương đương i < size — không phải lỗi biên.'],
  loiHayGap: ['Báo dòng 17 là off-by-one.', 'Chỉ ghi "code xấu" mà không chỉ mục checklist và cách sửa.', 'Bỏ sót biến không dùng ở dòng 35.'],
  giaiThich: '<p>Critical: SQL injection (7, C7), resources never closed (5–7, C4 — use try-with-resources), empty catch (24–27, C3). Others: hard-coded password (2, C7), no null/format check of email (4, C1) and of the list (15, C1), cryptic names h/x/bs (15–23, C5), magic number 6 (25, C5), unused variable (35, C6), SELECT * (7, C8).</p>',
  thuatNgu: [{ en: 'checklist-based review', vi: 'review theo checklist' }, { en: 'try-with-resources', vi: 'cú pháp Java tự đóng tài nguyên' }, { en: 'PreparedStatement', vi: 'câu lệnh SQL có tham số (chống injection)' }],
  khaiNiem: ['checklist-based review', 'code review'],
  tep: {
    'answer.js': [
      "// type = checklist item C1…C8\nconst ISSUES = [\n  { line: 7, type: 'C7', description: 'The e-mail is concatenated into the SQL string (SQL injection).', fix: 'Use a PreparedStatement with a ? parameter.' },\n];\n",
      `// Checklist-based review log of BookingDao — 11 issues; line 17 is correct (i <= size - 1 is i < size).
const ISSUES = [
  { line: 7, type: 'C7', description: 'SQL built by concatenating user input: SQL injection.', fix: 'PreparedStatement "SELECT code, duration FROM bookings WHERE email = ?" and setString(1, email).' },
  { line: 5, type: 'C4', description: 'Connection, Statement and ResultSet are never closed: connection leak.', fix: 'Open them in try-with-resources.' },
  { line: 26, type: 'C3', description: 'Empty catch of Exception swallows every error and returns false silently.', fix: 'Remove the try/catch or log and rethrow a meaningful exception.' },
  { line: 2, type: 'C7', description: 'Database password hard-coded in the source.', fix: 'Read credentials from configuration / environment (e.g. Spring properties, a vault).' },
  { line: 4, type: 'C1', description: 'email is not checked for null/empty/format.', fix: 'Validate the e-mail and throw IllegalArgumentException when invalid.' },
  { line: 15, type: 'C1', description: 'countHours does not handle a null list (NullPointerException).', fix: 'Return 0 or reject a null list explicitly.' },
  { line: 23, type: 'C5', description: 'Cryptic names: bs, x, h.', fix: 'bookings, extraHours, totalHours.' },
  { line: 25, type: 'C5', description: 'Magic number 6 (weekly limit).', fix: 'private static final int WEEKLY_LIMIT_HOURS = 6;' },
  { line: 35, type: 'C6', description: 'Variable unused is read and never used (dead code).', fix: 'Remove the line or map the id into the Booking.' },
  { line: 7, type: 'C8', description: 'SELECT * fetches every column although two are used.', fix: 'Select only code and duration.' },
  { line: 28, type: 'C3', description: 'Returning false after an error hides the failure from the caller.', fix: 'Let the exception propagate instead of returning a misleading value.' },
];
`,
    ],
  },
  kiem: kiemReview({
    bien: 'ISSUES', toiThieu: 8, loaiHopLe: CL.map(([m]) => m),
    khoa: [
      { ma: 'K1', dong: [7], loai: ['C7'], ten: 'SQL injection on line 7', tenVi: 'SQL injection ở dòng 7', nang: true },
      { ma: 'K2', dong: [5, 6, 7, 12], loai: ['C4'], ten: 'connection/statement/result set never closed', tenVi: 'không đóng connection/statement/result set', nang: true },
      { ma: 'K3', dong: [24, 25, 26, 27], loai: ['C3'], ten: 'empty catch swallows exceptions', tenVi: 'catch rỗng nuốt lỗi', nang: true },
      { ma: 'K4', dong: [2], loai: ['C7'], ten: 'hard-coded password' },
      { ma: 'K5', dong: [4, 7], loai: ['C1'], ten: 'email not validated' },
      { ma: 'K6', dong: [15, 17, 18], loai: ['C1'], ten: 'null list not handled' },
      { ma: 'K7', dong: [15, 16, 23, 25], loai: ['C5'], ten: 'cryptic names' },
      { ma: 'K8', dong: [25], loai: ['C5'], ten: 'magic number 6' },
      { ma: 'K9', dong: [35], loai: ['C6'], ten: 'unused variable' },
      { ma: 'K10', dong: [7], loai: ['C8'], ten: 'SELECT *' },
      { ma: 'K11', dong: [28, 26], loai: ['C3'], ten: 'misleading false after an error' },
    ],
    sai: [{ dong: [17], loai: ['C2'], ten: 'line 17 is correct: i <= size − 1 is the same as i < size' }],
  }),
});

export default doiDau({
  slug: 'swt301-review-types-techniques',
  ten: '3.3 Review types, techniques & success factors',
  moTaModule: 'Bốn loại review (informal, walkthrough, technical review, inspection), năm kỹ thuật review cá nhân, yếu tố thành công và tốc độ kiểm tra; review mã BookingDao theo checklist (SQL injection, rò kết nối, catch rỗng… và một bẫy báo nhầm).',
  khoa: KHOA,
  baiHoc: 'swt301-review-types-techniques',
  de: [E1, E2, E3, E4],
});
