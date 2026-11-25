/**
 * 9.8 — Lab: một ticket theo quy trình outsourcing, từ DD tới báo cáo ngày (agl-9-8-lab). Soạn 24/11/2026.
 * Màn hình MỚI (SCR-APT-ADD-01 đặt lịch khám) để không lặp ví dụ đã giải ở 9.3–9.4. Lời giải mẫu chạy thật:
 * scratchpad/agl/lab/dat-lich (Node 22.22.2, `npm test` 16/16 Pass, ngày hệ thống giả lập 2026-11-24 thứ Ba).
 */
import { bang, cl, note, giai, js, out, bash, ag, cs, vo } from '../_chung.mjs';

const MA_GIAI = js(`
// AT-140 — SCR-APT-ADD-01 "Đặt lịch khám" (DD AT-DD-APT-ADD-01 v1.0, lab 9.8). Lời giải mẫu.
// Giả định đang chờ Q&A được đánh dấu "QA-1xx".
export const THONG_BAO = {
  'MSG-E001': '{0} là bắt buộc.',
  'MSG-E002': '{0} tối đa {1} ký tự.',
  'MSG-E020': 'Ngày khám phải từ ngày mai đến 30 ngày tới, trừ Chủ nhật.',
  'MSG-E021': 'Giờ này bác sĩ đã có lịch. Vui lòng chọn giờ khác.',
  'MSG-E022': 'Khung giờ không hợp lệ.',
  'MSG-E023': 'Bác sĩ không tồn tại hoặc đã ngừng nhận lịch.',
  'MSG-E024': 'Bạn đã có lịch khám trong ngày này.',
};
const dien = (ma, ...p) => THONG_BAO[ma].replace(/\\{(\\d)\\}/g, (_, i) => p[i]);

// 08:00 … 16:30, mỗi 30 phút (ITM-03)
export const KHUNG_GIO = Array.from({ length: 18 }, (_, i) => \`\${String(8 + Math.floor(i / 2)).padStart(2, '0')}:\${i % 2 ? '30' : '00'}\`);

const congNgay = (ngay, n) => { const d = new Date(ngay + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const ngayHopLe = (s) => /^\\d{4}-\\d{2}-\\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z')) && new Date(s + 'T00:00:00Z').toISOString().slice(0, 10) === s;

export function datLich(db, benhNhanId, input, homNay) {
  const loi = {};
  const doctorId = input.doctorId, date = String(input.date ?? '').trim(), time = String(input.time ?? '').trim();
  const reason = String(input.reason ?? '').trim();
  // Bước 1 — kiểm đơn mục
  if (doctorId == null || doctorId === '') loi.doctorId = ['MSG-E001', 'Bác sĩ'];
  if (!date) loi.date = ['MSG-E001', 'Ngày khám'];
  else if (!ngayHopLe(date) || date <= homNay || date > congNgay(homNay, 30)
    || new Date(date + 'T00:00:00Z').getUTCDay() === 0) loi.date = ['MSG-E020'];
  if (!time) loi.time = ['MSG-E001', 'Giờ khám'];
  else if (!KHUNG_GIO.includes(time)) loi.time = ['MSG-E022'];
  if ([...reason.normalize('NFC')].length > 200) loi.reason = ['MSG-E002', 'Lý do khám', 200];   // ITM-04 không bắt buộc
  if (Object.keys(loi).length) return tra(400, loi);
  // Bước 2 — bác sĩ còn hoạt động
  const bs = db.doctors.find((d) => d.id === Number(doctorId));
  if (!bs || bs.status !== 1) return tra(400, { doctorId: ['MSG-E023'] });
  // Bước 3 — trùng giờ của bác sĩ (lịch đã huỷ không tính — QA-101)
  if (db.appointments.some((a) => a.doctorId === bs.id && a.date === date && a.time === time && a.status !== 'CANCELLED'))
    return tra(409, { time: ['MSG-E021'] });
  // Bước 4 — một bệnh nhân tối đa 1 lịch còn hiệu lực mỗi ngày (QA-102: đề xuất, đang chờ)
  if (db.appointments.some((a) => a.patientId === benhNhanId && a.date === date && a.status !== 'CANCELLED'))
    return tra(409, { date: ['MSG-E024'] });
  const id = db.appointments.length + 1;
  db.appointments.push({ id, patientId: benhNhanId, doctorId: bs.id, date, time, reason, status: 'BOOKED' });
  return { status: 201, body: { id, ma: 'MSG-I010', chuyenToi: 'SCR-APT-DTL-01' } };
}
function tra(status, loi) {
  return { status, body: { loi: Object.fromEntries(Object.entries(loi).map(([k, [ma, ...p]]) => [k, { ma, noiDung: dien(ma, ...p) }])) } };
}`);

const KQ = out(`$ npm test
> agl-dat-lich@1.0.0 test
> node --test --test-reporter=spec test/*.test.mjs

✔ TC-APT-001 Hợp lệ ⇒ 201, MSG-I010 (3.216187ms)
✔ TC-APT-002 Bỏ trống bác sĩ, ngày, giờ ⇒ 3 × MSG-E001 (2.308213ms)
✔ TC-APT-003 Ngày = hôm nay ⇒ MSG-E020 (0.345891ms)
✔ TC-APT-004 Ngày = hôm nay + 30 (biên) ⇒ 201 (0.203242ms)
✔ TC-APT-005 Ngày = hôm nay + 31 ⇒ MSG-E020 (0.138753ms)
✔ TC-APT-006 Chủ nhật 29/11 ⇒ MSG-E020 (0.123143ms)
✔ TC-APT-007 Giờ 16:30 (khung cuối) ⇒ 201 (0.160995ms)
✔ TC-APT-008 Giờ 17:00 ⇒ MSG-E022 (0.152563ms)
✔ TC-APT-009 Giờ 09:15 (lệch khung) ⇒ MSG-E022 (0.64074ms)
✔ TC-APT-010 Lý do 200 ký tự ⇒ 201; 201 ký tự ⇒ MSG-E002 (0.940441ms)
✔ TC-APT-011 Bác sĩ đã ngừng (status 0) ⇒ MSG-E023 (0.334143ms)
✔ TC-APT-012 Bác sĩ không tồn tại ⇒ MSG-E023 (0.161751ms)
✔ TC-APT-013 Trùng giờ bác sĩ (bệnh nhân khác) ⇒ 409 MSG-E021 (0.201465ms)
✔ TC-APT-014 Trùng giờ nhưng lịch cũ đã huỷ (QA-101) ⇒ 201 (0.139439ms)
✔ TC-APT-015 Bệnh nhân đã có lịch cùng ngày (QA-102) ⇒ 409 MSG-E024 (0.128059ms)
✔ TC-APT-016 Có đúng 18 khung giờ 08:00…16:30 (0.088129ms)
ℹ tests 16
ℹ suites 0
ℹ pass 16
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 205.496821`);

const TEST_MAU = js(`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { datLich, KHUNG_GIO } from '../src/dat-lich.mjs';

const HOM_NAY = '2026-11-24';          // thứ Ba — cố định để test tất định
const moi = () => ({ doctors: [{ id: 1, status: 1 }, { id: 2, status: 0 }], appointments: [] });
const OK = { doctorId: 1, date: '2026-11-25', time: '09:00', reason: 'Đau đầu' };
const ma = (kq, k) => kq.body.loi?.[k]?.ma;

test('TC-APT-005 Ngày = hôm nay + 31 ⇒ MSG-E020', () =>
  assert.equal(ma(datLich(moi(), 7, { ...OK, date: '2026-12-25' }, HOM_NAY), 'date'), 'MSG-E020'));
test('TC-APT-013 Trùng giờ bác sĩ (bệnh nhân khác) ⇒ 409 MSG-E021', () => {
  const db = moi(); datLich(db, 7, OK, HOM_NAY);
  const kq = datLich(db, 8, OK, HOM_NAY);
  assert.equal(kq.status, 409); assert.equal(ma(kq, 'time'), 'MSG-E021');
});
// … 14 test còn lại cùng dạng: mỗi test mang đúng mã TC của test spec`);

export const L98 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 9 · Lab', 'Chương 9 · Lab', `
<h2>${t('9.8 — Lab: one ticket the outsourcing way, from DD to daily report', '9.8 — Lab: một ticket theo quy trình outsourcing, từ DD tới báo cáo ngày')}</h2>
<p class="lead">${t(
    'Everything in this chapter, in one ticket, on a screen you have not seen solved. You will produce six deliverables exactly as on a real project: a work list, a Q&amp;A list, a three-point estimate, working code with automated tests, a test specification with evidence, and two daily reports. Plan for 6–10 hours over two or three days — the point is to live the rhythm, not to rush.',
    'Toàn bộ chương này, gói trong một ticket, trên một màn hình bạn chưa thấy lời giải. Bạn sẽ làm ra sáu sản phẩm đúng như ở dự án thật: danh sách việc, Q&amp;A list, ước lượng ba điểm, code chạy được kèm test tự động, test spec có evidence, và hai báo cáo ngày. Dành 6–10 giờ trong hai ba ngày — mục đích là sống đúng nhịp, không phải làm vội.')}</p>

<h3>${t('Setup', 'Chuẩn bị')}</h3>
<ol>
<li>${t('In CT Work (', 'Trên CT Work (')}<a href="/work">/work</a>${t('), create project "Phòng khám An Tâm" (or reuse the one from chapter 2) and a ticket <strong>AT-140 "Đặt lịch khám — SCR-APT-ADD-01"</strong>. Every deliverable below is attached to or linked from this ticket. ', '), tạo dự án "Phòng khám An Tâm" (hoặc dùng lại dự án ở chương 2) và ticket <strong>AT-140 "Đặt lịch khám — SCR-APT-ADD-01"</strong>. Mọi sản phẩm dưới đây đính kèm hoặc dẫn link từ ticket này. ')}${ag('agl-2-4-ct-work', t('(How to use CT Work: lesson 2.4.)', '(Cách dùng CT Work: bài 2.4.)'))}</li>
<li>${t('Node.js 22+ and an empty folder <code>dat-lich/</code> with <code>package.json</code>:', 'Node.js 22+ và một thư mục trống <code>dat-lich/</code> có <code>package.json</code>:')}</li>
</ol>
${bash(`
mkdir dat-lich && cd dat-lich && mkdir src test
cat > package.json <<'EOF'
{ "name": "agl-dat-lich", "version": "1.0.0", "type": "module", "private": true,
  "scripts": { "test": "node --test --test-reporter=spec test/*.test.mjs" } }
EOF`)}
<p>${t('Keep the business logic as a pure function <code>datLich(db, patientId, input, today)</code> — passing <code>today</code> in makes date tests repeatable. A web server is optional (copy the pattern from the registration server in lesson 9.4).', 'Giữ logic nghiệp vụ là một hàm thuần <code>datLich(db, benhNhanId, input, homNay)</code> — truyền <code>homNay</code> vào để test ngày lặp lại được. Máy chủ web là tuỳ chọn (theo mẫu máy chủ đăng ký ở bài 9.4).')}</p>

<h3>${t('The design document you receive', 'Tài liệu thiết kế bạn nhận')}</h3>
<p><strong>AT-DD-APT-ADD-01 v1.0 — SCR-APT-ADD-01 "${t('Book an appointment', 'Đặt lịch khám')}"</strong> ${t('(patient is logged in)', '(bệnh nhân đã đăng nhập)')}</p>
${bang(['No', t('ID', 'Mã'), t('Name', 'Tên'), t('Control', 'Loại'), t('Req.', 'Bắt buộc'), t('Rule', 'Quy tắc')], [
    ['1', 'ITM-01', t('Doctor', 'Bác sĩ'), 'Select', '○', t('List of doctors with status = 1', 'Danh sách bác sĩ status = 1')],
    ['2', 'ITM-02', t('Date', 'Ngày khám'), 'DatePicker', '○', t('From tomorrow to 30 days from today; clinic closed on Sunday', 'Từ ngày mai đến 30 ngày tới; phòng khám nghỉ Chủ nhật')],
    ['3', 'ITM-03', t('Time', 'Giờ khám'), 'Select', '○', t('08:00–16:30, every 30 minutes', '08:00–16:30, mỗi 30 phút')],
    ['4', 'ITM-04', t('Reason', 'Lý do khám'), 'TextArea', '—', t('Max 200 characters', 'Tối đa 200 ký tự')],
    ['5', 'BTN-01', t('Book', 'Đặt lịch'), 'Button', '—', t('See events', 'Xem xử lý sự kiện')],
  ])}
${bang([t('Step', 'Bước'), t('BTN-01 processing', 'Xử lý BTN-01'), t('On error', 'Khi lỗi')], [
    ['1', t('Check ITM-01…04', 'Kiểm ITM-01…04'), 'MSG-E001 / E002 / E020 / E022'],
    ['2', t('Doctor exists and status = 1', 'Bác sĩ tồn tại và status = 1'), 'MSG-E023'],
    ['3', t('No appointment of that doctor at that date and time', 'Bác sĩ chưa có lịch ở ngày giờ đó'), 'MSG-E021'],
    ['4', t('INSERT appointment (status BOOKED); go to SCR-APT-DTL-01 with MSG-I010', 'INSERT appointment (status BOOKED); chuyển SCR-APT-DTL-01 kèm MSG-I010'), '—'],
  ])}
${bang([t('ID', 'Mã'), t('Text', 'Nội dung')], [
    ['MSG-E001', '{0} là bắt buộc.'], ['MSG-E002', '{0} tối đa {1} ký tự.'],
    ['MSG-E020', 'Ngày khám phải từ ngày mai đến 30 ngày tới, trừ Chủ nhật.'],
    ['MSG-E021', 'Giờ này bác sĩ đã có lịch. Vui lòng chọn giờ khác.'], ['MSG-E022', 'Khung giờ không hợp lệ.'],
    ['MSG-E023', 'Bác sĩ không tồn tại hoặc đã ngừng nhận lịch.'], ['MSG-I010', 'Đặt lịch thành công.'],
  ])}
${note(t('The document is deliberately imperfect, like real ones. Part of the grade is finding where.', 'Tài liệu cố ý chưa hoàn hảo, giống tài liệu thật. Một phần điểm là tìm ra chỗ đó.'))}

<h3>${t('The six deliverables', 'Sáu sản phẩm phải nộp')}</h3>
${bang(['#', t('Deliverable', 'Sản phẩm'), t('Lesson', 'Bài'), t('Minimum', 'Tối thiểu')], [
    ['1', t('Work list from the DD', 'Danh sách việc từ DD'), '9.3', t('≥ 8 lines, each with IDs', '≥ 8 dòng, dòng nào cũng có mã')],
    ['2', t('Q&amp;A list', 'Q&amp;A list'), '9.5', t('≥ 5 rows, location + closed question + proposal + due date', '≥ 5 dòng, vị trí + câu đóng + đề xuất + hạn')],
    ['3', t('Three-point estimate', 'Ước lượng ba điểm'), '9.6', t('WBS ≥ 8 lines incl. test/evidence/review; ΣE, σ, MD; written <strong>before</strong> coding', 'WBS ≥ 8 dòng có test/evidence/review; ΣE, σ, MD; viết <strong>trước</strong> khi code')],
    ['4', t('Code + automated tests', 'Code + test tự động'), '9.3–9.4', t('<code>npm test</code> green; each test named with its TC ID; open Q&amp;A marked in code', '<code>npm test</code> xanh; mỗi test mang mã TC; Q&amp;A còn mở được đánh dấu trong code')],
    ['5', t('Test spec + evidence + mini report', 'Test spec + evidence + báo cáo ngắn'), '9.4', t('≥ 15 cases, statuses, evidence files named per case, summary counts', '≥ 15 case, trạng thái, evidence đặt tên theo case, số tổng hợp')],
    ['6', t('Two daily reports + actual vs estimate', 'Hai báo cáo ngày + thực tế so ước lượng'), '9.7', t('Template fields filled with numbers; final note explaining the difference', 'Điền đủ mục mẫu bằng số liệu; ghi chú cuối giải thích chênh lệch')],
  ])}
${cl('info', t('<strong>Honesty rule:</strong> record your real time per WBS line while you work (a stopwatch or the timesheet in CT Work). The estimate is graded on how you explain the difference, not on being lucky.', '<strong>Luật trung thực:</strong> ghi thời gian thật cho từng dòng WBS trong lúc làm (đồng hồ bấm giờ hoặc timesheet trên CT Work). Ước lượng được chấm theo cách bạn giải thích chênh lệch, không phải nhờ may.'))}

<h3>${t('Hints (open one at a time)', 'Gợi ý (mở từng cái một)')}</h3>
${giai(t('Hint 1 — where the document is imperfect', 'Gợi ý 1 — tài liệu chưa hoàn hảo ở đâu'), `<p>${t('Look at: cancelled appointments in step 3; a patient booking two slots on the same day; "30 days" inclusive or not; public holidays; the doctor\'s own days off; time zone of "today"; what the Select shows when a doctor is deactivated while the patient is on the screen; the MSG-E002 text for ITM-04.', 'Nhìn vào: lịch đã huỷ ở bước 3; một bệnh nhân đặt hai khung cùng ngày; "30 ngày" có tính ngày cuối không; ngày lễ; ngày nghỉ riêng của bác sĩ; múi giờ của "hôm nay"; Select hiện gì khi bác sĩ bị ngừng trong lúc bệnh nhân đang ở màn hình; câu MSG-E002 cho ITM-04.')}</p>`)}
${giai(t('Hint 2 — how to structure the code', 'Gợi ý 2 — cách tổ chức code'), `<p>${t('Same shape as <code>kiemTra</code> in lesson 9.3: collect single-item errors first and return them all; then run the DB-dependent checks in the DD\'s order and stop at the first. Return message IDs; keep texts in one table.', 'Cùng dạng <code>kiemTra</code> ở bài 9.3: gom lỗi kiểm đơn mục trước và trả hết một lần; rồi chạy các kiểm cần DB theo đúng thứ tự trong DD, dừng ở lỗi đầu tiên. Trả mã thông báo; giữ câu chữ trong một bảng.')}</p>`)}
${giai(t('Hint 3 — date tests without flakiness', 'Gợi ý 3 — test ngày không chập chờn'), `<p>${t('Never call <code>new Date()</code> inside the logic. Pass <code>today</code> as a parameter and fix it in tests (e.g. 2026-11-24, a Tuesday). Then "today + 30", "Sunday" and "today" are exact.', 'Đừng gọi <code>new Date()</code> bên trong logic. Truyền <code>homNay</code> vào làm tham số và cố định nó trong test (ví dụ 2026-11-24, thứ Ba). Khi đó "hôm nay + 30", "Chủ nhật" và "hôm nay" đều chính xác.')}</p>`)}

<h3>${t('Rubric (100 points) — pass ≥ 70, and estimate within 30 % with an explanation', 'Rubric (100 điểm) — đạt khi ≥ 70, và ước lượng lệch dưới 30 % có giải thích')}</h3>
${bang([t('Deliverable', 'Sản phẩm'), t('Criteria', 'Tiêu chí'), t('Points', 'Điểm')], [
    ['1', t('All screen items, events, messages and the DB insert covered; IDs used', 'Phủ đủ mục, sự kiện, thông báo và INSERT DB; dùng mã'), '10'],
    ['2', t('≥ 5 real gaps (incl. cancelled appointments and same-day double booking), each closed + proposal + due', '≥ 5 chỗ hổng thật (có lịch đã huỷ và đặt trùng ngày), mỗi câu đóng + đề xuất + hạn'), '20'],
    ['3', t('Complete WBS (test/evidence/review present), correct PERT maths, range + assumptions', 'WBS đủ (có test/evidence/review), tính PERT đúng, có khoảng + giả định'), '15'],
    ['4', t('Tests green, deterministic dates, TC IDs, open Q&amp;A marked', 'Test xanh, ngày tất định, có mã TC, Q&amp;A mở được đánh dấu'), '20'],
    ['5', t('≥ 15 cases with exact expected results, boundaries (today, +30, +31, 16:30, 17:00), statuses, named evidence, summary', '≥ 15 case có kết quả mong đợi chính xác, biên (hôm nay, +30, +31, 16:30, 17:00), trạng thái, evidence có tên, tổng hợp'), '20'],
    ['6', t('Two daily reports with numbers vs plan, issues with IDs; actual vs estimate explained per line', 'Hai báo cáo ngày có số so kế hoạch, vấn đề có mã; giải thích thực tế so ước lượng theo từng dòng'), '15'],
  ])}

<h3>${t('Model answer', 'Đáp án mẫu')}</h3>
${giai(t('Q&amp;A list (model)', 'Q&amp;A list (mẫu)'), bang([t('ID', 'Mã'), t('Location', 'Vị trí'), t('Question', 'Câu hỏi'), t('Proposal', 'Đề xuất')], [
    ['QA-101', 'BTN-01 ' + t('step 3', 'bước 3'), t('Do cancelled appointments block the slot?', 'Lịch đã huỷ có chiếm khung giờ không?'), t('No — only status ≠ CANCELLED counts', 'Không — chỉ tính lịch có status ≠ CANCELLED')],
    ['QA-102', 'BTN-01', t('May one patient book two slots on the same day (same or different doctors)?', 'Một bệnh nhân được đặt hai khung trong cùng ngày (cùng hoặc khác bác sĩ) không?'), t('No — max one active appointment per day; new MSG-E024 "Bạn đã có lịch khám trong ngày này." (adds a message ⇒ check whether this is a CR)', 'Không — tối đa một lịch còn hiệu lực mỗi ngày; thêm MSG-E024 "Bạn đã có lịch khám trong ngày này." (thêm thông báo ⇒ kiểm xem có phải CR không)')],
    ['QA-103', 'ITM-02', t('Is "30 days" inclusive (today + 30 allowed)?', '"30 ngày" có tính ngày thứ 30 (hôm nay + 30 được đặt) không?'), t('Yes, inclusive', 'Có, tính cả ngày thứ 30')],
    ['QA-104', 'ITM-02', t('Public holidays and doctors\' days off: closed? Where is the calendar?', 'Ngày lễ và ngày nghỉ riêng của bác sĩ: có nghỉ không? Lịch lấy ở đâu?'), t('Out of scope for v1.0 (only Sunday); holiday calendar as a future CR', 'Ngoài phạm vi v1.0 (chỉ Chủ nhật); lịch nghỉ làm CR sau')],
    ['QA-105', 'ITM-02', t('"Today" in which time zone — server or clinic (Asia/Ho_Chi_Minh)?', '"Hôm nay" theo múi giờ nào — máy chủ hay phòng khám (Asia/Ho_Chi_Minh)?'), t('Clinic time zone', 'Múi giờ phòng khám')],
    ['QA-106', 'BTN-01 ' + t('step 2–3', 'bước 2–3'), t('Two patients press BTN-01 for the same slot at the same moment: who wins?', 'Hai bệnh nhân bấm BTN-01 cùng khung, cùng lúc: ai được?'), t('First committed INSERT; enforce with a UNIQUE index (doctor_id, date, time) on active rows; the other gets MSG-E021', 'INSERT ghi trước thắng; đảm bảo bằng chỉ mục UNIQUE (doctor_id, date, time) trên lịch còn hiệu lực; người kia nhận MSG-E021')],
  ]))}
${giai(t('Estimate (model, before coding)', 'Ước lượng (mẫu, làm trước khi code)'), bang(['WBS', t('Item', 'Hạng mục'), 'O', 'M', 'P', 'E'], [
    ['1', t('Read DD, Q&amp;A', 'Đọc DD, Q&amp;A'), '0.5', '1', '2', '1.1'],
    ['2', t('Single-item checks + messages', 'Kiểm đơn mục + thông báo'), '1', '1.5', '3', '1.7'],
    ['3', t('Doctor, slot, same-day checks', 'Kiểm bác sĩ, khung giờ, trùng ngày'), '0.5', '1', '2', '1.1'],
    ['4', t('Write 16 automated tests', 'Viết 16 test tự động'), '1', '1.5', '3', '1.7'],
    ['5', t('Test spec + evidence + summary', 'Test spec + evidence + tổng hợp'), '1', '1.5', '2.5', '1.6'],
    ['6', t('Fix + rerun', 'Sửa + chạy lại'), '0.25', '0.5', '1.5', '0.6'],
    ['7', t('Self-review + daily reports', 'Tự review + báo cáo ngày'), '0.5', '0.75', '1.5', '0.8'],
    ['8', t('Buffer for QA-102/106 answers', 'Dự phòng cho câu trả lời QA-102/106'), '0', '0.5', '1.5', '0.6'],
    ['', 'Σ', '', '8.25', '', '<strong>9.2 h ≈ 1.25 MD</strong>'],
  ]) + `<p>${t('Values in hours, for a learner doing it the first time. Your numbers will differ — what matters is that tests/evidence/review are present and that you explain the gap afterwards.', 'Đơn vị giờ, cho người làm lần đầu. Số của bạn sẽ khác — điều quan trọng là có test/evidence/review và bạn giải thích được chênh lệch sau đó.')}</p>`)}
${giai(t('Code + tests (model) — run for real, 16/16 Pass', 'Code + test (mẫu) — chạy thật, 16/16 Pass'), `<p><code>src/dat-lich.mjs</code></p>${MA_GIAI}<p><code>test/dat-lich.test.mjs</code> ${t('(excerpt)', '(trích)')}</p>${TEST_MAU}${KQ}
<p>${t('Note TC-APT-014 and TC-APT-015: they encode the proposals of QA-101 and QA-102. If the customer answers differently, the test changes first, then the code — and the test spec row records why.', 'Để ý TC-APT-014 và TC-APT-015: chúng mã hoá đề xuất của QA-101 và QA-102. Nếu khách trả lời khác, sửa test trước, rồi sửa code — và dòng test spec ghi lại lý do.')}</p>
<p>${t('Not covered by the model on purpose (your challenge): QA-106 concurrency — two simultaneous requests both pass the in-memory check. With a real database, add the UNIQUE index and translate the constraint violation into MSG-E021; write an integration test that fires two requests in parallel. ', 'Cố ý không làm trong bài mẫu (thử thách của bạn): QA-106 đồng thời — hai request cùng lúc đều qua được phép kiểm trong bộ nhớ. Với database thật, thêm chỉ mục UNIQUE và đổi lỗi vi phạm ràng buộc thành MSG-E021; viết test tích hợp bắn hai request song song. ')}${cs('testing', 'tst-4-1-vi-sao', t('(Integration tests with a real DB: Testing course ch4.)', '(Test tích hợp với DB thật: khoá Testing ch4.)'))}</p>`)}
${giai(t('Daily report day 2 (model)', 'Báo cáo ngày 2 (mẫu)'), `<pre><code>${t(
`Done today : AT-140 checks steps 2–4 + 16 automated tests (16/16 Pass);
             test spec 18 cases (16 Pass, 1 Blocked: QA-106 concurrency, 1 N/A: UI)
Progress   : AT-140 90 % (plan 100 %) — remaining: PR + review
Effort     : estimate 9.2 h · actual so far 10.5 h (+14 %)
             – line 5 evidence +1 h (named/organised 18 files), line 2 +0.5 h (date helper)
Issues     : QA-102 (same-day rule) open, due 27/11 — implemented per proposal (TC-APT-015)
Need help  : review PR tomorrow morning
Tomorrow   : PR, fix review comments, close AT-140`,
`Đã làm     : AT-140 kiểm bước 2–4 + 16 test tự động (16/16 Pass);
             test spec 18 case (16 Pass, 1 Blocked: QA-106 đồng thời, 1 N/A: giao diện)
Tiến độ    : AT-140 90 % (kế hoạch 100 %) — còn: PR + review
Thời gian  : ước 9,2 h · thực tế tới giờ 10,5 h (+14 %)
             – dòng 5 evidence +1 h (đặt tên/sắp xếp 18 tệp), dòng 2 +0,5 h (hàm xử lý ngày)
Vấn đề     : QA-102 (quy tắc trùng ngày) còn mở, hạn 27/11 — đã làm theo đề xuất (TC-APT-015)
Cần hỗ trợ : review PR sáng mai
Ngày mai   : PR, sửa theo review, đóng AT-140`)}</code></pre>`)}

<h3>${t('Extra challenges', 'Thử thách thêm')}</h3>
<ul>
<li>${t('Add the HTTP endpoint <code>POST /api/appointments</code> and capture curl evidence for 5 key cases.', 'Thêm endpoint HTTP <code>POST /api/appointments</code> và lấy evidence curl cho 5 case quan trọng.')}</li>
<li>${t('Turn QA-104 into a CR record (lesson 9.5): impact on BD/DD/DB/tests, effort, schedule.', 'Biến QA-104 thành bản ghi CR (bài 9.5): ảnh hưởng BD/DD/DB/test, công, tiến độ.')}</li>
<li>${t('Write the "I will be late" message (lesson 9.7) assuming QA-106 turns out to need a DB migration you had not planned.', 'Viết tin nhắn "em sẽ trễ" (bài 9.7) giả sử QA-106 hoá ra cần một migration DB bạn chưa tính.')}</li>
</ul>
<p>${t('Done? Check yourself with the ', 'Xong rồi? Tự kiểm bằng ')}${ag('agl-9-9-quiz', t('chapter 9 quiz', 'bài kiểm tra chương 9'))}.</p>
`);
};
