/**
 * SWT301 · DỰ ÁN LabBook — mốc chương 3: review một pull request thật (cancelBooking) theo hợp đồng API, rồi sửa PR
 * (bản JS chạy với repository/mail giả) + góc phỏng vấn về code review.
 */
import { doiDau, KHOA, hai, giai, lc, kiemReview, preSo, LOAI_LOI, LOAI_LOI_HTML, NOP_BAI, tn } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const PR = `@DeleteMapping("/api/bookings/{code}")
public ResponseEntity<?> cancel(@PathVariable String code, Principal user) {
    Booking b = repo.findByCode(code);
    if (b.getStatus() == "CANCELLED") {
        return ResponseEntity.status(409).body("ALREADY_CANCELLED");
    }
    if (Duration.between(LocalDateTime.now(), b.getStart()).toHours() < 2) {
        return ResponseEntity.status(409).body("TOO_LATE");
    }
    b.setStatus("CANCELLED");
    repo.save(b);
    Booking next = repo.findFirstPending(b.getLab(), b.getDate());
    next.setStatus("CONFIRMED");
    repo.save(next);
    mail.send(next.getEmail(), "Booking confirmed");
    return ResponseEntity.ok(b);
}`;
const KHOA_PR = [
  { ma: 'K1', dong: [3, 4], loai: ['EXCEPTION', 'VALIDATION'], ten: 'unknown code → NullPointerException instead of 404 BOOKING_NOT_FOUND', tenVi: 'mã không tồn tại → NullPointerException thay vì 404', nang: true },
  { ma: 'K2', dong: [2, 3, 4], loai: ['SECURITY', 'VALIDATION', 'LOGIC'], ten: 'the owner is never checked — anyone can cancel anyone’s booking (403 NOT_OWNER missing)', tenVi: 'không kiểm chủ booking — ai cũng huỷ được booking của người khác', nang: true },
  { ma: 'K3', dong: [4], loai: ['LOGIC'], ten: 'String compared with == instead of equals', tenVi: 'so chuỗi bằng == thay vì equals', nang: true },
  { ma: 'K4', dong: [12, 13], loai: ['EXCEPTION', 'LOGIC'], ten: 'no pending booking → next is null → NullPointerException', tenVi: 'không có booking chờ → next null → NullPointerException', nang: true },
  { ma: 'K5', dong: [12], loai: ['LOGIC'], ten: 'promotes even when the cancelled booking was PENDING (no seat was freed)' },
  { ma: 'K6', dong: [10, 11, 14, 15], loai: ['LOGIC', 'EXCEPTION', 'RESOURCE'], ten: 'no transaction: a failure after the first save leaves inconsistent data' },
  { ma: 'K7', dong: [7], loai: ['CONVENTION'], ten: 'LocalDateTime.now() is hard-wired — inject a Clock to make the rule testable' },
  { ma: 'K8', dong: [5, 8], loai: ['LOGIC', 'CONVENTION'], ten: 'error bodies are plain strings, the contract requires { "error": "…" } JSON' },
];
const SAI_PR = [{ dong: [7], loai: ['BOUNDARY'], ten: 'line 7 is correct: toHours() truncates, so 1 h 59 min is too late and 2 h is allowed' }];

const FAKE = `const NOW = Date.UTC(2026, 10, 2, 8);
const H = 3600000;
function fake(rows) {
  const db = rows.map((x) => Object.assign({}, x));
  return {
    db,
    findByCode: (c) => db.find((x) => x.code === c) || null,
    findFirstPending: (lab, date) => db.filter((x) => x.lab === lab && x.date === date && x.status === 'PENDING').sort((a, b) => a.seq - b.seq)[0] || null,
    save: (b) => { const i = db.findIndex((x) => x.code === b.code); if (i >= 0) db[i] = Object.assign({}, b); },
  };
}
function mk() { const m = { sent: [] }; m.send = (to, s) => { m.sent.push(to + '|' + s); }; return m; }
const B = (code, email, status, seq, hoursAhead, lab) => ({ code, email, lab: lab || 'LAB02', date: '2026-11-04', start: NOW + hoursAhead * H, status, seq });`;
const chay = (rows, code, user, tra) => `(() => { const r = fake(${rows}); const m = mk(); const res = cancelBooking('${code}', '${user}', r, m, NOW); return ${tra}; })()`;
const k = (moTa, goi, mongDoi, an) => ({ moTa, chuanBi: FAKE, goi, mongDoi, nhom: 'f2', ...(an ? { an: true } : {}) });
const KIEM_FIX = [
  k({ en: 'Unknown code → 404 BOOKING_NOT_FOUND', vi: 'Mã không tồn tại → 404 BOOKING_NOT_FOUND' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CONFIRMED', 1, 50)]", 'BK9', 'an@fpt.edu.vn', 'res'), { status: 404, body: { error: 'BOOKING_NOT_FOUND' } }),
  k({ en: 'Another student’s booking → 403 NOT_OWNER and nothing changes', vi: 'Booking của người khác → 403 NOT_OWNER và không gì thay đổi' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CONFIRMED', 1, 50)]", 'BK1', 'binh@fpt.edu.vn', '[res, r.db[0].status]'), [{ status: 403, body: { error: 'NOT_OWNER' } }, 'CONFIRMED']),
  k({ en: 'Already cancelled → 409 with a JSON error body', vi: 'Đã huỷ → 409 với body lỗi dạng JSON' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CANCELLED', 1, 50)]", 'BK1', 'an@fpt.edu.vn', 'res'), { status: 409, body: { error: 'ALREADY_CANCELLED' } }),
  k({ en: 'Less than 2 hours before the start → 409 TOO_LATE', vi: 'Còn chưa tới 2 giờ → 409 TOO_LATE' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CONFIRMED', 1, 1.5)]", 'BK1', 'an@fpt.edu.vn', 'res'), { status: 409, body: { error: 'TOO_LATE' } }, true),
  k({ en: 'Exactly 2 hours before → allowed', vi: 'Đúng 2 giờ trước → được phép' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CONFIRMED', 1, 2)]", 'BK1', 'an@fpt.edu.vn', 'res.status'), 200, true),
  k({ en: 'Cancelling a CONFIRMED booking promotes the FIRST pending one and e-mails it', vi: 'Huỷ booking CONFIRMED thì nâng người chờ ĐẦU TIÊN và gửi thư' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CONFIRMED', 1, 50), B('BK2', 'binh@fpt.edu.vn', 'PENDING', 2, 50), B('BK3', 'chi@fpt.edu.vn', 'PENDING', 3, 50)]", 'BK1', 'an@fpt.edu.vn', '[res.status, r.db.map((x) => x.status), m.sent]'), [200, ['CANCELLED', 'CONFIRMED', 'PENDING'], ['binh@fpt.edu.vn|Booking confirmed']]),
  k({ en: 'No pending booking → no crash, no e-mail', vi: 'Không có booking chờ → không lỗi, không thư' }, chay("[B('BK1', 'an@fpt.edu.vn', 'CONFIRMED', 1, 50)]", 'BK1', 'an@fpt.edu.vn', '[res.status, r.db[0].status, m.sent.length]'), [200, 'CANCELLED', 0]),
  k({ en: 'Cancelling a PENDING booking promotes nobody', vi: 'Huỷ booking PENDING thì không nâng ai' }, chay("[B('BK1', 'an@fpt.edu.vn', 'PENDING', 1, 50), B('BK2', 'binh@fpt.edu.vn', 'PENDING', 2, 50)]", 'BK1', 'an@fpt.edu.vn', '[res.status, r.db.map((x) => x.status), m.sent.length]'), [200, ['CANCELLED', 'PENDING'], 0], true),
];

const DAU_FIX = `// The PR as JavaScript (same defects; == on strings has no JS equivalent, it is fixed here).
// Fix it so it follows the API contract. now = current time in ms; booking.start is in ms too.
function cancelBooking(code, userEmail, repo, mail, now) {
  const b = repo.findByCode(code);
  if (b.status === 'CANCELLED') {
    return { status: 409, body: 'ALREADY_CANCELLED' };
  }
  if (Math.trunc((b.start - now) / 3600000) < 2) {
    return { status: 409, body: 'TOO_LATE' };
  }
  b.status = 'CANCELLED';
  repo.save(b);
  const next = repo.findFirstPending(b.lab, b.date);
  next.status = 'CONFIRMED';
  repo.save(next);
  mail.send(next.email, 'Booking confirmed');
  return { status: 200, body: b };
}
`;
const GIAI_FIX = `// Fixed cancelBooking — every rule of the contract, in the order the API checks them.
const HOUR = 3600000;
const err = (status, error) => ({ status, body: { error } });

function cancelBooking(code, userEmail, repo, mail, now) {
  const b = repo.findByCode(code);
  if (!b) return err(404, 'BOOKING_NOT_FOUND');                    // K1: no NullPointerException
  if (b.email !== userEmail) return err(403, 'NOT_OWNER');          // K2: only the owner
  if (b.status === 'CANCELLED') return err(409, 'ALREADY_CANCELLED');
  if (Math.trunc((b.start - now) / HOUR) < 2) return err(409, 'TOO_LATE');
  const wasConfirmed = b.status === 'CONFIRMED';
  b.status = 'CANCELLED';
  repo.save(b);
  if (wasConfirmed) {                                               // K5: only a CONFIRMED booking frees a seat
    const next = repo.findFirstPending(b.lab, b.date);
    if (next) {                                                     // K4: the waitlist may be empty
      next.status = 'CONFIRMED';
      repo.save(next);
      mail.send(next.email, 'Booking confirmed');
    }
  }
  return { status: 200, body: b };
}
`;
const GIAI_ISSUES = `// Review of PR #42 "Implement cancelBooking" — request changes.
const ISSUES = [
  { line: 3, type: 'EXCEPTION', severity: 'High', description: 'findByCode returns null for an unknown code; line 4 throws NullPointerException (500) instead of 404 BOOKING_NOT_FOUND.', fix: 'if (b == null) return 404 { error: BOOKING_NOT_FOUND }.' },
  { line: 2, type: 'SECURITY', severity: 'High', description: 'The owner is never compared with the logged-in user: any student can cancel another student’s booking.', fix: 'if (!b.getEmail().equals(user.getName())) return 403 { error: NOT_OWNER }.' },
  { line: 4, type: 'LOGIC', severity: 'High', description: 'Strings compared with == (reference), so the check can fail for a status read from the database.', fix: '"CANCELLED".equals(b.getStatus()) — better: an enum.' },
  { line: 13, type: 'EXCEPTION', severity: 'High', description: 'When nobody is waiting, findFirstPending returns null and next.setStatus throws.', fix: 'if (next != null) { … }' },
  { line: 12, type: 'LOGIC', severity: 'Medium', description: 'A waitlisted (PENDING) booking frees no seat, yet the next student is promoted.', fix: 'Promote only when the cancelled booking was CONFIRMED.' },
  { line: 14, type: 'LOGIC', severity: 'Medium', description: 'Two saves and an e-mail without a transaction: a failure in between leaves inconsistent data.', fix: 'Annotate the service method with @Transactional and send the e-mail after commit.' },
  { line: 7, type: 'CONVENTION', severity: 'Low', description: 'LocalDateTime.now() is hard-wired, so the 2-hour rule cannot be tested at a fixed time.', fix: 'Inject a java.time.Clock.' },
  { line: 5, type: 'LOGIC', severity: 'Medium', description: 'The body is a plain string; the API contract returns { "error": "ALREADY_CANCELLED" }.', fix: 'Return a JSON error object (same for TOO_LATE).' },
];
`;

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 3 — Review a Pull Request, then Fix It',
  phu: { en: 'Running project · chapter 3 · code review against the API contract · executable fix · 10 marks', vi: 'Dự án xuyên suốt · chương 3 · review mã theo hợp đồng API · sửa chạy thật · 10 điểm' },
  moTa: {
    en: `<p>A teammate opened <b>PR #42 “Implement cancelBooking”</b> for LabBook. You are the reviewer. The contract says: unknown code → 404 <code>BOOKING_NOT_FOUND</code>; not the owner → 403 <code>NOT_OWNER</code>; already cancelled → 409 <code>ALREADY_CANCELLED</code>; less than 2 hours before the start → 409 <code>TOO_LATE</code>; error bodies are JSON <code>{ "error": "…" }</code>. Cancelling a <b>CONFIRMED</b> booking promotes the <b>first</b> pending booking of the same lab and date (if there is one) and e-mails that student “Booking confirmed”.</p>${preSo(PR)}<p>Issue types: ${LOAI_LOI_HTML.en}</p>`,
    vi: `<p>Đồng đội mở <b>PR #42 “Implement cancelBooking”</b> cho LabBook. Bạn là người review. Hợp đồng: mã không tồn tại → 404 <code>BOOKING_NOT_FOUND</code>; không phải chủ → 403 <code>NOT_OWNER</code>; đã huỷ → 409 <code>ALREADY_CANCELLED</code>; còn chưa tới 2 giờ → 409 <code>TOO_LATE</code>; body lỗi là JSON <code>{ "error": "…" }</code>. Huỷ booking <b>CONFIRMED</b> thì nâng booking chờ <b>đầu tiên</b> cùng phòng, cùng ngày (nếu có) và gửi thư “Booking confirmed”.</p>${preSo(PR)}<p>Loại lỗi: ${LOAI_LOI_HTML.vi}</p>`,
  },
  chucNangChinh: [
    { en: 'A. Review comments on the PR (line, type, severity, description, fix).', vi: 'A. Nhận xét review trên PR (dòng, loại, mức độ, mô tả, cách sửa).' },
    { en: 'B. The corrected method (JavaScript twin), run against a fake repository and mail service.', vi: 'B. Phương thức đã sửa (bản JavaScript), chạy với repository và dịch vụ thư giả.' },
  ],
  yeuCauChung: [{ en: 'Review against the contract, not against your own taste: every comment must point at a rule it breaks.', vi: 'Review theo hợp đồng, không theo sở thích: mỗi nhận xét phải chỉ ra luật nó vi phạm.' }],
  cayThuMuc: `answers/
├── review.js          ← const ISSUES = [ { line, type, severity, description, fix } ]
└── cancel-booking.js  ← function cancelBooking(code, userEmail, repo, mail, now)`,
  moHinh: {
    ten: 'Fakes given to cancelBooking',
    truong: [
      ['repo.findByCode(code)', 'Booking | null', { en: 'booking { code, email, lab, date, start (ms), status, seq }', vi: 'booking { code, email, lab, date, start (ms), status, seq }' }],
      ['repo.findFirstPending(lab, date)', 'Booking | null', { en: 'the earliest PENDING booking (lowest seq)', vi: 'booking PENDING sớm nhất (seq nhỏ nhất)' }],
      ['repo.save(b) · mail.send(to, subject)', 'void', { en: 'persist a booking · send an e-mail', vi: 'lưu booking · gửi thư' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Review comments', vi: 'A. Nhận xét review' }, diem: 6, yeuCau: [{ en: 'At least 6 real issues including the four critical ones; no false claim; each with a fix.', vi: 'Ít nhất 6 lỗi thật gồm bốn lỗi nghiêm trọng; không khẳng định sai; mỗi lỗi có cách sửa.' }], hook: ['code review'] },
    { ten: { en: 'B. Fix the PR', vi: 'B. Sửa PR' }, diem: 4, yeuCau: [{ en: 'Return <code>{ status, body }</code>; error bodies <code>{ error }</code>; the checks in the contract order; promotion only after a CONFIRMED booking and only if someone waits.', vi: 'Trả <code>{ status, body }</code>; body lỗi <code>{ error }</code>; các bước kiểm theo thứ tự hợp đồng; chỉ nâng hạng sau khi huỷ booking CONFIRMED và chỉ khi có người chờ.' }], hook: ['confirmation testing'] },
  ],
  idBatBuoc: [['ISSUES', 'answers/review.js'], ['cancelBooking(code, userEmail, repo, mail, now)', 'answers/cancel-booking.js']],
  truDiem: [{ en: 'Calling line 7 a boundary bug — truncation gives exactly the contract’s behaviour.', vi: 'Gọi dòng 7 là lỗi biên — việc cắt phần lẻ cho đúng hành vi của hợp đồng.' }],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 3 — Talking about reviews and static analysis',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> Questions about code reviews and static analysis that come up in QA and developer interviews — and in your first week in a team.</p>', vi: '<p><b>Góc phỏng vấn.</b> Câu hỏi về review mã và phân tích tĩnh hay gặp khi phỏng vấn QA lẫn developer — và ngay tuần đầu vào nhóm.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“How do you give review feedback on a teammate’s pull request?”', '“Bạn góp ý review cho pull request của đồng đội thế nào?”'), luaChon: lc(['a', '“This code is bad, rewrite it.”'], ['b', 'Point at the rule or requirement the code breaks, explain the impact, suggest a fix, and separate blocking issues from nice-to-haves'], ['c', 'Approve everything to keep the team happy'], ['d', 'Fix it myself without telling them']), dapAn: ['b'], giaiThich: giai('Objective, specific, actionable feedback — the people factors of review success.', 'Góp ý khách quan, cụ thể, làm theo được — chính là yếu tố con người của review thành công.') },
    { ma: 'q2', de: hai('“What is the difference between a review and static analysis?”', '“Review và phân tích tĩnh khác nhau thế nào?”'), luaChon: lc(['a', 'There is none'], ['b', 'Both examine work products without executing them; reviews use people (who can judge intent, requirements, design), static analysis uses tools (fast, consistent, but only rule-based)'], ['c', 'Static analysis runs the code'], ['d', 'Reviews are only for documents']), dapAn: ['b'], giaiThich: giai('They complement each other: tools catch the mechanical issues so humans can focus on logic and requirements.', 'Chúng bổ sung nhau: công cụ bắt lỗi máy móc để người tập trung vào logic và yêu cầu.') },
    { ma: 'q3', de: hai('“SonarQube shows 120 code smells. What do you do?”', '“SonarQube báo 120 code smell. Bạn làm gì?”'), luaChon: lc(['a', 'Ignore them'], ['b', 'Prioritise by severity (bugs, vulnerabilities first), fix new code first with a quality gate, and plan the technical debt'], ['c', 'Fix all of them before any new feature'], ['d', 'Delete the rules']), dapAn: ['b'], giaiThich: giai('“Clean as you code”: gate new code, triage the legacy findings.', '“Sạch khi viết”: chặn mã mới bằng quality gate, phân loại phát hiện cũ.') },
    { ma: 'q4', de: hai('“Why review requirements if we will test the software anyway?”', '“Vì sao phải review yêu cầu khi đằng nào cũng test phần mềm?”'), luaChon: lc(['a', 'We should not'], ['b', 'A defect in a requirement is cheapest to fix before design and code exist, and some defects (contradictions, missing rules) are hard to reach with dynamic tests'], ['c', 'Because tests cannot run without requirements'], ['d', 'Only for documentation']), dapAn: ['b'], giaiThich: giai('Early defect detection and different defect types — the value of static testing (LO-3.1.2).', 'Phát hiện sớm và loại lỗi khác — giá trị của kiểm thử tĩnh (LO-3.1.2).') },
    { ma: 'q5', de: hai('“In your project, what did a review find that testing would have missed?”', '“Trong dự án của bạn, review tìm được gì mà test sẽ bỏ sót?”'), luaChon: lc(['a', '“Nothing, reviews never find anything.”'], ['b', 'A concrete example: “In LabBook’s cancel PR, the owner check was missing — every happy-path test passed because each student cancelled their own booking.”'], ['c', '“I do not remember.”'], ['d', '“Reviews are the developer’s job.”']), dapAn: ['b'], giaiThich: giai('Interviewers want a specific story with impact.', 'Người phỏng vấn muốn một câu chuyện cụ thể có tác động.') },
  ],
  goiY: ['Câu trả lời mạnh: cụ thể, có tác động, có ví dụ từ dự án.', 'Review (người) + phân tích tĩnh (công cụ) bổ sung nhau.'],
  loiHayGap: ['Trả lời chung chung không có ví dụ.', 'Cho rằng review là việc của riêng developer.'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: [{ en: 'pull request (PR)', vi: 'yêu cầu gộp mã — nơi diễn ra review' }, { en: 'code smell', vi: 'dấu hiệu mã kém (khó bảo trì)' }, { en: 'technical debt', vi: 'nợ kỹ thuật' }],
  khaiNiem: ['interview', 'code review'],
});

export default doiDau({
  slug: 'swt301-3-project-labbook-pr-review',
  ten: 'LabBook Project 3 — Review a Pull Request, then Fix It',
  moTaModule: 'Dự án LabBook — mốc chương 3: review PR #42 cancelBooking theo hợp đồng API (NPE thay 404, thiếu kiểm chủ booking, == so chuỗi, nâng hạng sai…), rồi sửa PR bằng bản JS chạy với repository/mail giả; kèm góc phỏng vấn về review.',
  khoa: KHOA,
  baiHoc: 'swt301-review-types-techniques',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 3 — Review PR #42 cancelBooking and Fix It',
      doKho: 'HARD', phut: 75, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: 'cancelBooking("BK1", "binh@fpt.edu.vn", …) where BK1 belongs to an@fpt.edu.vn', output: '{ status: 403, body: { error: "NOT_OWNER" } } — the PR cancels it', explanation: 'The missing owner check: a security defect no happy-path test reveals.|||Thiếu kiểm chủ: lỗi bảo mật mà test đường thành công không lộ ra.' }],
      khaiNiem: ['code review', 'API contract', 'confirmation testing'],
      tienQuyet: ['SWT301 chapter 3', 'LabBook API'],
      the: ['swt301', 'project', 'labbook', 'code-review'],
      banIn: BAN_IN,
      thuatNgu: [...tn('confirmation'), { en: 'pull request', vi: 'yêu cầu gộp mã' }, { en: 'API contract', vi: 'hợp đồng API — status và body phải trả' }, { en: 'transaction', vi: 'giao dịch — nhóm thao tác cùng thành công hoặc cùng huỷ' }],
      goiY: [
        'A: đọc hợp đồng thành danh sách kiểm (404, 403, 409×2, JSON, nâng hạng có điều kiện) rồi soi từng dòng PR.',
        'B: thêm kiểm null và chủ booking trước mọi thứ; nhớ trạng thái cũ trước khi đổi; nâng hạng chỉ khi trước đó là CONFIRMED và next khác null.',
      ],
      loiHayGap: ['Chỉ nhận xét đặt tên/định dạng mà bỏ sót kiểm chủ booking.', 'Sửa nhưng vẫn nâng hạng khi huỷ booking PENDING.', 'Trả body lỗi dạng chuỗi.'],
      moTaNgan: 'Mốc 3 dự án LabBook: review PR cancelBooking và sửa nó.',
      giaiThich: {
        en: '<p>Critical comments: null booking (404), missing owner check (security), == on strings, null waitlist. Medium: promotion after a PENDING cancellation, missing transaction, plain-string error bodies; low: hard-wired clock. The fix applies the contract in order and guards the promotion with “was CONFIRMED” and “someone waits”.</p>',
        vi: '<p>Nhận xét nghiêm trọng: booking null (404), thiếu kiểm chủ (bảo mật), == so chuỗi, danh sách chờ rỗng. Trung bình: nâng hạng sau khi huỷ PENDING, thiếu transaction, body lỗi dạng chuỗi; thấp: đồng hồ cứng. Bản sửa áp hợp đồng theo thứ tự và chặn nâng hạng bằng “trước đó CONFIRMED” và “có người chờ”.</p>',
      },
      loaiKiem: 'js',
      tests: {
        loai: 'js', phienBan: 1, tepNap: ['answers/review.js', 'answers/cancel-booking.js'],
        kiem: [...kiemReview({ bien: 'ISSUES', khoa: KHOA_PR, sai: SAI_PR, toiThieu: 6, nhom: 'f1', loaiHopLe: LOAI_LOI }), ...KIEM_FIX],
      },
      khoiDau: { 'answers/review.js': `// type: ${LOAI_LOI.join(' | ')}\nconst ISSUES = [\n  { line: 3, type: 'EXCEPTION', severity: 'High', description: 'Unknown code gives a NullPointerException.', fix: 'Return 404 BOOKING_NOT_FOUND.' },\n];\n`, 'answers/cancel-booking.js': DAU_FIX },
      loiGiai: { 'answers/review.js': GIAI_ISSUES, 'answers/cancel-booking.js': GIAI_FIX },
      thamKhao: 'https://google.github.io/eng-practices/review/reviewer/',
      boYeu: [{ ten: 'sửa thiếu kiểm chủ booking', tep: { 'answers/cancel-booking.js': GIAI_FIX.replace("  if (b.email !== userEmail) return err(403, 'NOT_OWNER');          // K2: only the owner\n", '') }, phaiTruot: ['403 NOT_OWNER'] }],
    },
    PHONG_VAN,
  ],
});
