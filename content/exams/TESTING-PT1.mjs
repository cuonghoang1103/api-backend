/**
 * Testing — Progress Test 1: Mục 0 → Chương 3 (vì sao test, unit test đầu tiên, bất đồng bộ/thời gian/lỗi,
 * đồ đóng thế). 24 câu trắc nghiệm + 2 câu VIẾT TEST chấm bằng đột biến.
 *
 * Đề tự soạn, bám `content/courses/testing/s00…s03`; dữ kiện đo (ms, số lần đỏ, thông báo lỗi) lấy nguyên
 * từ bài — không bịa số. Hai câu lập trình dùng code THẬT của LabFlow Lite (`src/rules/time.js`,
 * `src/rules/booking.js › usageRate`, `src/notify/notify.js`) chép sang CommonJS, và bộ chạy test thu gọn
 * trong `_lib/testing-exam-kit.mjs`; `node scripts/exam-check.mjs content/exams/TESTING-PT1.mjs` chạy thật
 * lời giải mẫu (xanh với code thật, mọi đột biến bị diệt).
 *
 * Phân bố: M0 ×4 · C1 ×7 · C2 ×7 · C3 ×6. Đáp án rải: A ×6 · B ×6 · C ×6 · D ×6.
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TESTING-PT1.mjs --apply
 */
import { B, EX, c, code, mcq, codeQ, starter, allKilled, ptInstructions } from './_lib/testing-exam-kit.mjs';

const Q = (pe, pv, opts, correct, ee, ev) =>
  mcq({ prompt: B(pe, pv), options: opts.map(([e, v]) => B(e, v)), correct, explanation: EX(ee, ev) });

const M6 = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

/* ─────────── Câu lập trình 1 — matcher đúng cho time.js + usageRate (Ch1.2) ─────────── */

const C1_GIVEN = `
// LabFlow Lite — src/rules/time.js + usageRate (src/rules/booking.js), CommonJS. Code THẬT: build(null).
const OPEN = 7 * 60, CLOSE = 21 * 60;
function build(mutant) {
  function parseTime(text) {
    const pattern = mutant === 'M1' ? /([0-9]{2}):([0-9]{2})$/ : /^([0-9]{2}):([0-9]{2})$/;
    const m = pattern.exec(text);
    if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (mutant === 'M2' ? h > 24 || min > 59 : h > 23 || min > 59) {
      if (mutant === 'M3') throw new TypeError('Time out of range: ' + text);
      throw new RangeError('Time out of range: ' + text);
    }
    return h * 60 + min;
  }
  function formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hh = mutant === 'M4' ? String(h) : String(h).padStart(2, '0');
    const mm = mutant === 'M5' ? String(m) : String(m).padStart(2, '0');
    return hh + ':' + mm;
  }
  // Tỉ lệ giờ mở cửa đã được đặt, cộng dồn từng lượt (0..1).
  function usageRate(bookings) {
    let rate = 0;
    const day = mutant === 'M6' ? CLOSE - OPEN + 60 : CLOSE - OPEN;
    for (const b of bookings) rate += b.minutes / day;
    return rate;
  }
  return { parseTime, formatTime, usageRate };
}
`;

const C1_SOLUTION = `function suite(test, expect, { parseTime, formatTime, usageRate }) {
  test.each([['00:00', 0], ['07:30', 450], ['23:59', 1439]])('parseTime(%s) is minutes since midnight', (text, minutes) => {
    expect(parseTime(text)).toBe(minutes);
  });

  test.each([['7:00'], ['108:00'], ['07:00x'], ['']])('parseTime(%s) refuses a malformed time with a TypeError', (text) => {
    expect(() => parseTime(text)).toThrow(TypeError);
    expect(() => parseTime(text)).toThrow('expected HH:MM');   // lỗi CỦA TA, không phải cú sập vì null
  });

  test.each([['24:00'], ['12:60']])('parseTime(%s) is well-formed but out of range: RangeError', (text) => {
    expect(() => parseTime(text)).toThrow(RangeError);
  });

  test.each([[0, '00:00'], [425, '07:05'], [1260, '21:00']])('formatTime(%s) pads hours and minutes', (minutes, text) => {
    expect(formatTime(minutes)).toBe(text);
  });

  test('usageRate: 30 + 120 + 60 minutes is a quarter of the 840-minute day (a decimal: toBeCloseTo)', () => {
    expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60 }])).toBeCloseTo(0.25, 10);
    expect(usageRate([])).toBe(0);
  });
}`;

/* ─────────── Câu lập trình 2 — bookAndNotify với đồ đóng thế trung thực (Ch3) ─────────── */

const C2_GIVEN = `
// LabFlow Lite — src/notify/notify.js (CommonJS), bookLab rút gọn. Code THẬT: build(null).
const APPROVER = 'approvals@labflow.example';
function build(mutant) {
  async function bookLab(repo, input) {
    const status = input.seats > 30 && input.role === 'STUDENT' ? 'PENDING' : 'CONFIRMED';
    return repo.insert({ ...input, status });
  }
  // Thuần: lượt đặt cần thư gì. Không I/O.
  function buildMail(booking, studentEmail) {
    const when = booking.lab + ' on ' + booking.date + ' at ' + booking.start;
    if (booking.status === 'CONFIRMED') return { to: mutant === 'M1' ? APPROVER : studentEmail, subject: 'Booking confirmed: ' + when };
    return { to: APPROVER, subject: mutant === 'M2' ? 'Approval needed: ' + when : 'Approval needed: ' + booking.seats + ' seats, ' + when };
  }
  // Thư hỏng không được làm mất lượt đặt đã lưu: ghi cảnh báo rồi đi tiếp.
  async function bookAndNotify({ repo, mailer, log }, input) {
    const booking = await bookLab(repo, input);
    try {
      await mailer.send(buildMail(booking, input.email));
      if (mutant === 'M6') await mailer.send(buildMail(booking, input.email));
      return { ...booking, notified: true };
    } catch (err) {
      if (mutant === 'M3') throw err;
      if (mutant !== 'M5') log.warn('mail failed for booking ' + booking.id + ': ' + err.message);
      return { ...booking, notified: mutant === 'M4' };
    }
  }
  return { bookAndNotify, APPROVER };
}
// Đồ đóng thế cho sẵn: repo trong bộ nhớ (fake) và mailer có hộp thư (fake).
function memoryRepo() {
  const rows = [];
  return { rows, insert: async (b) => { const row = { id: rows.length + 1, ...b }; rows.push(row); return row; } };
}
function fakeMailer() {
  const outbox = [];
  return { outbox, send: async (mail) => { outbox.push(mail); return 'msg-' + outbox.length; } };
}
`;

const C2_SOLUTION = `function suite(test, expect, { bookAndNotify, APPROVER }) {
  const input = { lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, role: 'STUDENT', email: 'an@labflow.example' };
  const deps = (mailer) => ({ repo: memoryRepo(), mailer, log: { warn: spy() } });

  test('a confirmed booking e-mails the student, exactly once (state: the outbox)', async () => {
    const mailer = fakeMailer();
    await expect(bookAndNotify(deps(mailer), input)).resolves.toMatchObject({ status: 'CONFIRMED', notified: true });
    expect(mailer.outbox).toEqual([{ to: 'an@labflow.example', subject: 'Booking confirmed: BE-201 on 2026-11-16 at 08:00' }]);
  });

  test('a PENDING booking (31 seats) asks the approver, with the seat count in the subject', async () => {
    const mailer = fakeMailer();
    await bookAndNotify(deps(mailer), { ...input, seats: 31 });
    expect(mailer.outbox).toEqual([{ to: APPROVER, subject: 'Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00' }]);
  });

  test('a failing mailer (stub) does not lose the booking: notified false, one warning', async () => {
    const d = deps({ send: async () => { throw new Error('SMTP down'); } });
    await expect(bookAndNotify(d, input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED', notified: false });
    expect(d.repo.rows).toHaveLength(1);
    expect(d.log.warn).toHaveBeenCalledWith('mail failed for booking 1: SMTP down');   // tác dụng phụ đi RA ngoài — chỗ hợp lệ để kiểm tương tác
  });
}`;

const questions = [
  /* ══════════════ Mục 0 ══════════════ */
  Q(`Which statement about testing and debugging is right?`,
    `Câu nào đúng về kiểm thử và gỡ lỗi?`,
    [['Testing removes defects; debugging finds them.', 'Kiểm thử loại bỏ khiếm khuyết; gỡ lỗi tìm ra chúng.'],
     ['Testing shows that defects are present; debugging finds and removes their cause.', 'Kiểm thử cho thấy có khiếm khuyết; gỡ lỗi tìm và loại bỏ nguyên nhân.'],
     ['They are two names for the same activity.', 'Đó là hai tên gọi của cùng một việc.'],
     ['Debugging is done only by testers, testing only by developers.', 'Gỡ lỗi chỉ do tester làm, kiểm thử chỉ do lập trình viên làm.']],
    1,
    `Lesson 0.8: testing shows defects, debugging removes them, and QA is the whole prevention process around both. Testing can show the presence of defects, never their absence.`,
    `Bài 0.8: kiểm thử cho thấy khiếm khuyết, gỡ lỗi loại bỏ chúng, còn QA là cả quá trình phòng ngừa bao quanh cả hai. Kiểm thử chứng minh được có lỗi, không bao giờ chứng minh được không có lỗi.`),

  Q(`Lesson 0.1 measured about 0.015 ms per unit check and 0.75–1 ms per HTTP check for the same rule. What does the test pyramid conclude from this?`,
    `Bài 0.1 đo khoảng 0,015 ms cho mỗi phép kiểm unit và 0,75–1 ms cho mỗi phép kiểm HTTP trên cùng một luật. Kim tự tháp test rút ra điều gì?`,
    [['Delete HTTP tests; unit tests are enough.', 'Xoá test HTTP; unit test là đủ.'],
     ['Write the same check at every level to be safe.', 'Viết cùng phép kiểm ở mọi tầng cho chắc.'],
     ['Proportion: many unit tests, some integration, few end-to-end.', 'Tỉ lệ: nhiều unit test, một ít tích hợp, rất ít end-to-end.'],
     ['Prefer HTTP tests because they are more realistic.', 'Ưu tiên test HTTP vì chúng sát thực tế hơn.']],
    2,
    `The pyramid is about proportion, not elimination: higher levels give more realistic confidence but are slower, flakier and harder to diagnose. HTTP tests still prove things unit tests cannot (routes, JSON, status codes).`,
    `Kim tự tháp nói về tỉ lệ, không phải loại bỏ: tầng cao cho niềm tin sát thực tế hơn nhưng chậm hơn, dễ chập chờn và khó chẩn đoán hơn. Test HTTP vẫn chứng minh được những thứ unit test không làm được (tuyến, JSON, mã trạng thái).`),

  Q(`The CrowdStrike 2024 outage involved an input field that tests only ever matched with a wildcard. Which testing habit does it illustrate?`,
    `Sự cố CrowdStrike 2024 liên quan tới một trường đầu vào mà test chỉ khớp bằng ký tự đại diện. Nó minh hoạ thói quen test nào?`,
    [['Vary every input: a test that matches "anything" never reads the risky value.', 'Đổi mọi đầu vào: test khớp "bất cứ gì" không bao giờ đọc giá trị nguy hiểm.'],
     ['Run the tests on the same operating system as the customers.', 'Chạy test trên đúng hệ điều hành của khách hàng.'],
     ['Never use wildcards in production code, only in tests.', 'Không bao giờ dùng ký tự đại diện trong code thật, chỉ trong test.'],
     ['Automated tests cannot help with kernel drivers; review them by hand.', 'Test tự động không giúp được driver nhân; hãy review bằng tay.']],
    0,
    `Lesson 0.9: the famous disasters came from missing tests, not missing testers — the risky line never ran with the risky value. Tests existed; they just never exercised field 21's real value.`,
    `Bài 0.9: các thảm hoạ nổi tiếng đến từ thiếu test, không phải thiếu tester — dòng nguy hiểm chưa từng chạy với giá trị nguy hiểm. Test có tồn tại; chỉ là chúng chưa từng chạm vào giá trị thật của trường 21.`),

  Q(`You run ${c('node src/rules/time.test.js')} and get a TypeError from inside node_modules/vitest. What should you do?`,
    `Bạn chạy ${c('node src/rules/time.test.js')} và nhận TypeError từ bên trong node_modules/vitest. Nên làm gì?`,
    [['Add a vitest.config.js file — Vitest needs one.', 'Thêm file vitest.config.js — Vitest bắt buộc phải có.'],
     ['Reinstall node_modules.', 'Cài lại node_modules.'],
     ['Downgrade to Node 20.', 'Hạ xuống Node 20.'],
     ['Run it with the Vitest runner: npm test or npx vitest run.', 'Chạy bằng bộ chạy Vitest: npm test hoặc npx vitest run.']],
    3,
    `describe/it need the runner to prepare them; called directly by plain node, Vitest's internals are undefined (lesson 0.2). Vitest works without a config file, and Vitest 5 needs Node 22.12 or newer — Node 20 would make things worse.`,
    `describe/it cần bộ chạy chuẩn bị trước; gọi thẳng bằng node trần thì phần ruột của Vitest là undefined (bài 0.2). Vitest chạy được không cần file cấu hình, còn Vitest 5 cần Node 22.12 trở lên — Node 20 chỉ làm tệ hơn.`),

  /* ══════════════ Chương 1 ══════════════ */
  Q(`In Arrange · Act · Assert, what belongs in the Act part of a unit test?`,
    `Trong Arrange · Act · Assert, phần Act của một unit test chứa gì?`,
    [['Building the input objects.', 'Dựng các object đầu vào.'],
     ['Exactly one call to the behaviour under test.', 'Đúng một lời gọi tới hành vi đang được test.'],
     ['The expect statements.', 'Các câu expect.'],
     ['Resetting mocks for the next test.', 'Đặt lại mock cho test sau.']],
    1,
    `Arrange builds the input, Act calls one behaviour, Assert checks the result (lesson 1.1). One behaviour per test keeps one reason to fail — the first failing expect hides the rest.`,
    `Arrange dựng đầu vào, Act gọi một hành vi, Assert kiểm kết quả (bài 1.1). Mỗi test một hành vi thì chỉ có một lý do để đỏ — expect đỏ đầu tiên che mất những cái sau.`),

  Q(`JUnit writes ${c('assertEquals(expected, actual)')}. A Vitest test is written ${c("expect('CONFIRMED').toBe(booking.status)")}. What goes wrong when it fails?`,
    `JUnit viết ${c('assertEquals(expected, actual)')}. Một test Vitest được viết ${c("expect('CONFIRMED').toBe(booking.status)")}. Khi nó đỏ thì có gì sai?`,
    [['Nothing — toBe is symmetric, so the message is the same.', 'Không gì — toBe đối xứng nên thông báo y như nhau.'],
     ['The test can never fail, whatever the status is.', 'Test không bao giờ đỏ được, status là gì cũng vậy.'],
     ['The failure message swaps "expected" and "received".', 'Thông báo lỗi đảo ngược "expected" với "received".'],
     ['Vitest refuses a string literal inside expect.', 'Vitest từ chối chuỗi hằng bên trong expect.']],
    2,
    `Vitest puts the ACTUAL value in expect() (lesson 1.1). The pass/fail result is the same, but swapped arguments produce a diagnosis that points the reader the wrong way — painful at 2 a.m. on a red CI.`,
    `Vitest đặt giá trị THỰC TẾ trong expect() (bài 1.1). Đỏ/xanh không đổi, nhưng đảo tham số thì lời chẩn đoán chỉ người đọc đi sai hướng — rất khổ lúc CI đỏ giữa đêm.`),

  Q(`Which matcher passes for ${c("{ lab: 'BE-201', status: 'CONFIRMED', note: undefined }")} against ${c("{ lab: 'BE-201', status: 'CONFIRMED' }")} but would FAIL with the stricter choice?`,
    `Matcher nào qua khi so ${c("{ lab: 'BE-201', status: 'CONFIRMED', note: undefined }")} với ${c("{ lab: 'BE-201', status: 'CONFIRMED' }")} nhưng sẽ ĐỎ với lựa chọn chặt hơn?`,
    [[`${c('toEqual')} passes; ${c('toStrictEqual')} fails on the undefined key.`, `${c('toEqual')} qua; ${c('toStrictEqual')} đỏ vì khoá undefined.`],
     [`${c('toBe')} passes; ${c('toEqual')} fails.`, `${c('toBe')} qua; ${c('toEqual')} đỏ.`],
     [`${c('toStrictEqual')} passes; ${c('toEqual')} fails.`, `${c('toStrictEqual')} qua; ${c('toEqual')} đỏ.`],
     [`All of them fail because of the extra key.`, `Tất cả đều đỏ vì khoá thừa.`]],
    0,
    `Lesson 1.2: toEqual ignores undefined properties; toStrictEqual also catches undefined keys and class types. toBe compares identity and fails for any two distinct objects.`,
    `Bài 1.2: toEqual bỏ qua thuộc tính undefined; toStrictEqual bắt cả khoá undefined và kiểu lớp. toBe so danh tính nên đỏ với hai object khác nhau bất kỳ.`),

  Q(`${c("expect(parseTime('7h')).toThrow(TypeError)")} crashes the test with "TypeError: Invalid time" instead of passing. What is the fix?`,
    `${c("expect(parseTime('7h')).toThrow(TypeError)")} làm test sập với "TypeError: Invalid time" thay vì qua. Sửa thế nào?`,
    [[`Use ${c('toThrow()')} without an argument.`, `Dùng ${c('toThrow()')} không tham số.`],
     [`Catch the error with try/catch around expect.`, `Bắt lỗi bằng try/catch bao quanh expect.`],
     [`Use ${c('toThrowError(TypeError)')}.`, `Dùng ${c('toThrowError(TypeError)')}.`],
     [`Wrap the call in an arrow: ${c("expect(() => parseTime('7h'))")}.`, `Bọc lời gọi trong hàm mũi tên: ${c("expect(() => parseTime('7h'))")}.`]],
    3,
    `Arguments are evaluated first: parseTime throws before expect even exists, so the error escapes. toThrow needs a function it can call itself. The error class in the crash shows TypeError was right all along.`,
    `Tham số được tính trước: parseTime ném lỗi trước khi expect kịp tồn tại, nên lỗi thoát ra ngoài. toThrow cần một hàm để tự nó gọi. Lớp lỗi trong cú sập cho thấy TypeError vốn đã đúng.`),

  Q(`A good unit-test name for BR-05 is…`,
    `Một tên unit test tốt cho BR-05 là…`,
    [[`${c("'test isWithinBookingWindow 2'")}`, `${c("'test isWithinBookingWindow 2'")}`],
     [`${c("'isWithinBookingWindow › 15 days ahead › false (BR-05: at most 14)'")}`, `${c("'isWithinBookingWindow › 15 days ahead › false (BR-05: at most 14)'")}`],
     [`${c("'should work correctly'")}`, `${c("'should work correctly'")}`],
     [`${c("'returns the correct value for the input'")}`, `${c("'returns the correct value for the input'")}`]],
    1,
    `Lesson 1.3: the name is the first thing read when CI is red — make it the diagnosis: unit › situation › expected result, with the boundary value and the rule. "should work correctly" tells nobody what broke.`,
    `Bài 1.3: tên test là thứ được đọc đầu tiên khi CI đỏ — hãy biến nó thành lời chẩn đoán: đơn vị › tình huống › kết quả mong đợi, kèm giá trị biên và luật. "should work correctly" không cho ai biết cái gì hỏng.`),

  Q(`fast-check reports "Property failed after 8 tests … Counterexample: [390] … seed: 981865028" for a rounding property. What is this NOT?`,
    `fast-check báo "Property failed after 8 tests … Counterexample: [390] … seed: 981865028" cho một tính chất làm tròn. Đây KHÔNG phải là gì?`,
    [['A reproducible counterexample you can replay with the seed.', 'Một phản ví dụ lặp lại được bằng seed.'],
     ['A shrunk input that points at the bug.', 'Một đầu vào đã được thu nhỏ chỉ thẳng vào bug.'],
     ['A flaky test that should be retried until green.', 'Một test chập chờn nên chạy lại tới khi xanh.'],
     ['A reason to keep an example test for 390.', 'Một lý do để giữ một test ví dụ cho 390.']],
    2,
    `A counterexample is a real bug (390/60 = 6.5 rounds to 7), and the seed makes it reproducible — so it is not flakiness (lesson 1.4). Fix the code, then keep 390 as a plain example test so it never comes back.`,
    `Phản ví dụ là bug thật (390/60 = 6,5 làm tròn thành 7), và seed khiến nó lặp lại được — nên không phải chập chờn (bài 1.4). Sửa code, rồi giữ 390 làm một test ví dụ thường để nó không quay lại.`),

  Q(`Lab 1's first, weak attempt was green and killed 1 of 8 mutants. What does that number measure?`,
    `Lần làm đầu (yếu) của Lab 1 xanh và diệt 1/8 đột biến. Con số đó đo cái gì?`,
    [['How many lines of the rules the suite executed.', 'Bộ test đã chạy bao nhiêu dòng của các luật.'],
     ['How fast the suite is compared with the reference.', 'Bộ test nhanh tới mức nào so với bản tham khảo.'],
     ['How many tests were written for each rule.', 'Đã viết bao nhiêu test cho mỗi luật.'],
     ['Whether the tests notice wrong code: 7 planted bugs went unnoticed.', 'Test có nhận ra code sai không: 7 bug cài vào không bị phát hiện.']],
    3,
    `Mutation testing measures whether tests notice wrong code, not just whether lines ran (lesson 1.5). Survivors point exactly at missing boundaries, roles and invalid inputs; rule-first boundary tables reached 8/8 with 40 fast tests.`,
    `Mutation testing đo test có nhận ra code sai hay không, không chỉ đo dòng nào đã chạy (bài 1.5). Đột biến sống chỉ thẳng vào biên, vai và đầu vào sai còn thiếu; bảng biên theo luật đạt 8/8 với 40 test nhanh.`),

  /* ══════════════ Chương 2 ══════════════ */
  Q(`${c("it('stores a booking', () => { bookLab(repo, input).then((b) => expect(b.status).toBe('PENDING')); })")} is green with a loose config although the real status is CONFIRMED. Why?`,
    `${c("it('stores a booking', () => { bookLab(repo, input).then((b) => expect(b.status).toBe('PENDING')); })")} xanh với cấu hình lỏng dù status thật là CONFIRMED. Vì sao?`,
    [['The test function returned before the promise settled; the failing expect ran later.', 'Hàm test trả về trước khi promise xong; expect đỏ chạy sau đó.'],
     ['then() swallows assertion errors by design.', 'then() được thiết kế để nuốt lỗi khẳng định.'],
     ['Vitest compares statuses case-insensitively.', 'Vitest so status không phân biệt hoa thường.'],
     ['The repository returned PENDING the first time.', 'Repository trả PENDING ở lần đầu.']],
    0,
    `Without await (or return), Vitest counts the test as passed the moment the function returns; the expect throws about 5 ms later, at most as an unhandled rejection (lesson 2.1). Make the test async and await the booking; requireAssertions catches it too.`,
    `Không await (hay return), Vitest coi test là qua ngay lúc hàm trả về; expect ném lỗi khoảng 5 ms sau, cùng lắm thành một unhandled rejection (bài 2.1). Hãy cho test async và await lượt đặt; requireAssertions cũng bắt được.`),

  Q(`A test keeps hitting the 5000 ms timeout. What does lesson 2.1 say to do first?`,
    `Một test cứ chạm timeout 5000 ms. Bài 2.1 khuyên làm gì trước?`,
    [['Raise testTimeout to 30 seconds in vitest.config.js.', 'Nâng testTimeout lên 30 giây trong vitest.config.js.'],
     ['Find what never settles — a promise nobody resolves or a timer nobody advances.', 'Tìm thứ không bao giờ kết thúc — một promise không ai resolve hay một timer không ai cho chạy.'],
     ['Mark the test it.skip until someone has time.', 'Đánh dấu it.skip tới khi có người rảnh.'],
     ['Run it on a faster machine or with more workers.', 'Chạy trên máy nhanh hơn hoặc với nhiều worker hơn.']],
    1,
    `A timeout means something never settled; raising the limit only makes the wait longer. Typical causes in the course: awaiting retry() while fake timers are on and nobody advances them, or a stub that never resolves.`,
    `Timeout nghĩa là có thứ không bao giờ kết thúc; nâng giới hạn chỉ làm chờ lâu hơn. Nguyên nhân hay gặp trong khoá: await retry() khi đang bật fake timers mà không ai cho timer chạy, hoặc một stub không bao giờ resolve.`),

  Q(`${c('retry(fn)')} waits 1 s, then 2 s between three attempts. With ${c('vi.useFakeTimers()')}, how do you check that the second attempt happens at exactly 1000 ms?`,
    `${c('retry(fn)')} chờ 1 s rồi 2 s giữa ba lần thử. Với ${c('vi.useFakeTimers()')}, kiểm lần thử thứ hai xảy ra đúng lúc 1000 ms bằng cách nào?`,
    [['await retry(fn) first, then count the calls.', 'await retry(fn) trước rồi đếm số lần gọi.'],
     ['Wait 1 real second with setTimeout in the test.', 'Chờ 1 giây thật bằng setTimeout trong test.'],
     ['Start retry without awaiting, then advance 999 ms and 1 ms.', 'Chạy retry mà không await, rồi cho timer chạy 999 ms và 1 ms.'],
     ['Pass delayMs: 0 so the test needs no timers.', 'Truyền delayMs: 0 để test khỏi cần timer.']],
    2,
    `Fake timers only move when you move them: awaiting retry first waits for a timer that never fires. Stepping 999 then 1 checks the exact boundary, and the Async variant lets retry's own awaits settle between steps. delayMs: 0 would leave the real delays untested.`,
    `Fake timers chỉ chạy khi bạn cho chạy: await retry trước là chờ một timer không bao giờ nổ. Bước 999 rồi 1 kiểm đúng biên, và bản Async cho các await bên trong retry kịp xong giữa các bước. delayMs: 0 thì độ trễ thật không bao giờ được test.`),

  Q(`Why should a rule like "cancel until 60 minutes before" take ${c('now')} as a parameter instead of calling ${c('new Date()')} inside?`,
    `Vì sao một luật như "được huỷ tới 60 phút trước giờ bắt đầu" nên nhận ${c('now')} làm tham số thay vì gọi ${c('new Date()')} bên trong?`,
    [['Because new Date() is slow.', 'Vì new Date() chậm.'],
     ['Because Vitest forbids new Date() in source code.', 'Vì Vitest cấm new Date() trong code nguồn.'],
     ['Because the result would otherwise be wrong in production.', 'Vì nếu không thì kết quả sai trên production.'],
     ['Time is an input: an injected clock makes the boundary testable in milliseconds.', 'Thời gian là đầu vào: đồng hồ tiêm vào giúp test biên trong vài mili giây.']],
    3,
    `Lesson 2.2: a unit test must never depend on the real clock. Inject a clock into rules; use fake timers only for code that really waits. Then 07:59, 08:00 and 08:01 for a 09:00 booking are three plain test rows.`,
    `Bài 2.2: unit test không bao giờ được phụ thuộc đồng hồ thật. Tiêm đồng hồ vào luật; chỉ dùng fake timers cho code thật sự phải chờ. Khi đó 07:59, 08:00 và 08:01 cho lượt 09:00 chỉ là ba hàng test bình thường.`),

  Q(`bookLab wraps a driver failure as ${c("new BookingError('STORAGE_DOWN', { cause: err })")}. What should the test assert?`,
    `bookLab bọc lỗi driver thành ${c("new BookingError('STORAGE_DOWN', { cause: err })")}. Test nên khẳng định gì?`,
    [['The code STORAGE_DOWN and the driver message on cause.', 'Mã STORAGE_DOWN và thông báo của driver nằm ở cause.'],
     ['That the BookingError message contains ECONNREFUSED.', 'Thông báo của BookingError chứa ECONNREFUSED.'],
     ['Only that something was thrown: toThrow().', 'Chỉ cần có gì đó bị ném: toThrow().'],
     ['That insert was called once to retry the write.', 'insert được gọi một lần để thử ghi lại.']],
    0,
    `Users and the API see the stable code; logs keep the original in cause (lesson 2.3). The message is the code, not the driver text; a bare toThrow() would also pass for a TypeError crash; and after a failed read, insert must not be called.`,
    `Người dùng và API thấy mã ổn định; log giữ bản gốc ở cause (bài 2.3). Thông báo là mã, không phải chữ của driver; toThrow() trống cũng qua với cú sập TypeError; và đọc đã hỏng thì không được gọi insert.`),

  Q(`A test checks that 20 two-letter booking codes from ${c('makeBookingCode(Math.random, 2)')} are all different. It failed 14 times in 100 runs. Best fix?`,
    `Một test kiểm 20 mã đặt lịch hai chữ từ ${c('makeBookingCode(Math.random, 2)')} đều khác nhau. Nó đỏ 14 lần trong 100 lần chạy. Cách sửa tốt nhất?`,
    [['Retry the test up to three times.', 'Cho test chạy lại tối đa ba lần.'],
     ['Generate 100 codes instead of 20.', 'Sinh 100 mã thay vì 20.'],
     ['Mark it it.fails.', 'Đánh dấu it.fails.'],
     ['Pass a seeded generator such as seededRandom(7).', 'Truyền một bộ sinh có seed như seededRandom(7).']],
    3,
    `The failures are chance (a birthday-problem collision), not a bug, so control the chance (lesson 2.4). Retries hide flakiness; more codes make collisions more likely; it.fails is for a bug that fails every time — here it would itself be flaky.`,
    `Các lần đỏ là do may rủi (va chạm kiểu bài toán ngày sinh), không phải bug, nên hãy kiểm soát may rủi (bài 2.4). Retry giấu chập chờn; nhiều mã hơn thì va chạm dễ hơn; it.fails dành cho bug đỏ mọi lần — ở đây chính nó sẽ chập chờn.`),

  Q(`Lab 2's weak attempt had five green tests "near" the risky lines and killed 0 of 8 mutants. Where do time and async bugs actually live?`,
    `Lần làm yếu của Lab 2 có năm test xanh "gần" các dòng nguy hiểm và diệt 0/8 đột biến. Bug thời gian và bất đồng bộ thật ra nằm ở đâu?`,
    [['In the happy path, with typical values from the requirement.', 'Ở đường đi suôn sẻ, với giá trị điển hình lấy từ yêu cầu.'],
     ['Time bugs on limits and near midnight; async bugs in waits and catch branches.', 'Bug thời gian ở các giới hạn và quanh nửa đêm; bug bất đồng bộ ở chỗ chờ và nhánh catch.'],
     ['In the test framework and its fake timers.', 'Ở chính framework test và fake timers của nó.'],
     ['Only in code that uses setInterval or setTimeout.', 'Chỉ ở code có dùng setInterval hoặc setTimeout.']],
    1,
    `Lesson 2.5: injected clocks, fake timers and fake repositories make every one of those places testable in milliseconds; the reference reached 8/8 with 22 fast, repeatable tests. "Near but not on" the risky lines kills nothing.`,
    `Bài 2.5: đồng hồ tiêm vào, fake timers và repository giả khiến mọi chỗ đó test được trong vài mili giây; bản tham khảo đạt 8/8 với 22 test nhanh, lặp lại được. Ở "gần mà không trúng" dòng nguy hiểm thì không diệt được gì.`),

  /* ══════════════ Chương 3 ══════════════ */
  Q(`Match the double: "fills a parameter and is never used".`,
    `Ghép đúng loại đồ đóng thế: "lấp chỗ một tham số và không bao giờ được dùng".`,
    [['Stub', 'Stub'],
     ['Spy', 'Spy'],
     ['Dummy', 'Dummy'],
     ['Fake', 'Fake']],
    2,
    `Lesson 3.1: dummy fills, stub answers, spy records, mock expects, fake works. A dummy satisfies a signature for a path that never touches it.`,
    `Bài 3.1: dummy lấp chỗ, stub trả lời, spy ghi lại, mock kỳ vọng, fake chạy được thật. Dummy chỉ để thoả chữ ký hàm cho một nhánh không bao giờ đụng tới nó.`),

  Q(`A test has ${c('const send = vi.fn();')} and then ${c("vi.mock('../src/lib/mailer.js', () => ({ createHttpMailer: () => ({ send }) }))")}. It fails with "Cannot access 'send' before initialization". Why?`,
    `Một test có ${c('const send = vi.fn();')} rồi ${c("vi.mock('../src/lib/mailer.js', () => ({ createHttpMailer: () => ({ send }) }))")}. Nó đỏ với "Cannot access 'send' before initialization". Vì sao?`,
    [['vi.mock is hoisted, so its factory runs before send exists.', 'vi.mock được kéo lên đầu, nên factory chạy trước khi send tồn tại.'],
     ['vi.fn cannot be referenced inside a mock factory.', 'vi.fn không được tham chiếu bên trong factory của mock.'],
     ['The module path must be absolute, not relative.', 'Đường dẫn module phải tuyệt đối, không được tương đối.'],
     ['A mock variable must be declared with let, not const.', 'Biến dùng cho mock phải khai bằng let, không phải const.']],
    0,
    `vi.mock is hoisted wherever you write it, so moving the line does nothing; vi.hoisted is hoisted too, so the value exists in time (lesson 3.2). let has the same temporal dead zone as const.`,
    `vi.mock được kéo lên dù bạn viết nó ở đâu, nên dời dòng không có tác dụng; vi.hoisted cũng được kéo lên, nên giá trị có kịp (bài 3.2). let cũng có "vùng chết tạm thời" như const.`),

  Q(`A team uses MSW 3 and writes ${c("server.listen({ onUnhandledRequest: 'error' })")}. A URL with a typo is called in a test. What did lesson 3.2 observe?`,
    `Một đội dùng MSW 3 và viết ${c("server.listen({ onUnhandledRequest: 'error' })")}. Một URL gõ sai được gọi trong test. Bài 3.2 quan sát thấy gì?`,
    [['The request failed with a clear MSW error.', 'Request đỏ với lỗi MSW rõ ràng.'],
     ['MSW threw at startup because the option is invalid.', 'MSW ném lỗi ngay lúc khởi động vì tuỳ chọn sai.'],
     ['The option was ignored: MSW warned and the request went out to the real network.', 'Tuỳ chọn bị bỏ qua: MSW chỉ cảnh báo và request đi ra mạng thật.'],
     ['The test hung until the timeout.', 'Test treo tới khi hết giờ.']],
    2,
    `onUnhandledRequest is the MSW 2 name; MSW 3 uses onUnhandledFrame and silently ignores the old key, so the default (warn and pass through) applied and the request reached DNS (ENOTFOUND). Lesson: use the option name of the version you really run — and see it fail once.`,
    `onUnhandledRequest là tên ở MSW 2; MSW 3 dùng onUnhandledFrame và lặng lẽ bỏ qua khoá cũ, nên mặc định (cảnh báo rồi cho đi) được áp dụng và request chạm tới DNS (ENOTFOUND). Bài học: dùng đúng tên tuỳ chọn của phiên bản bạn đang chạy — và nhìn nó đỏ một lần.`),

  Q(`A test asserts ${c('repo.insert')} ${c('toHaveBeenCalledWith')} an exact object. Storing one extra harmless column turns it red. What is the best change?`,
    `Một test khẳng định ${c('repo.insert')} ${c('toHaveBeenCalledWith')} một object chính xác. Lưu thêm một cột vô hại làm nó đỏ. Đổi thế nào là tốt nhất?`,
    [['Update the expected object every time a column is added.', 'Mỗi lần thêm cột thì cập nhật object mong đợi.'],
     ['Use the memory repository and assert the stored booking and the fields that matter.', 'Dùng repository trong bộ nhớ và khẳng định lượt đặt đã lưu cùng các trường quan trọng.'],
     ['Replace it with toHaveBeenCalled().', 'Thay bằng toHaveBeenCalled().'],
     ['Delete the test; it is brittle.', 'Xoá test; nó mong manh.']],
    1,
    `Assert what the requirement cares about through public behaviour (lesson 3.3). Updating forever keeps it brittle; toHaveBeenCalled() would no longer catch a wrong status; deleting loses the rule's coverage.`,
    `Khẳng định điều yêu cầu quan tâm qua hành vi công khai (bài 3.3). Cập nhật mãi thì vẫn mong manh; toHaveBeenCalled() không còn bắt được status sai; xoá thì mất phần phủ của luật.`),

  Q(`In "functional core, imperative shell", which LabFlow Lite piece is tested with a plain table and no doubles at all?`,
    `Trong "lõi thuần, vỏ mệnh lệnh", phần nào của LabFlow Lite được test bằng một bảng đơn giản mà không cần đồ đóng thế nào?`,
    [['bookAndNotify', 'bookAndNotify'],
     ['createHttpMailer', 'createHttpMailer'],
     ['createMemoryRepo', 'createMemoryRepo'],
     ['buildMail', 'buildMail']],
    3,
    `buildMail is pure — same booking in, same e-mail out, no I/O (lesson 3.4). bookAndNotify is the shell doing I/O; createHttpMailer and createMemoryRepo are adapters behind ports.`,
    `buildMail là hàm thuần — cùng lượt đặt vào, cùng bức thư ra, không I/O (bài 3.4). bookAndNotify là phần vỏ làm I/O; createHttpMailer và createMemoryRepo là adapter phía sau các cổng.`),

  Q(`A bug makes every booking CONFIRMED. A test that ${c('vi.mock')}s bookLab to return CONFIRMED stays green. What does that prove?`,
    `Một bug làm mọi lượt đặt thành CONFIRMED. Một test ${c('vi.mock')} bookLab để trả CONFIRMED vẫn xanh. Điều đó chứng minh gì?`,
    [['The test replaced the code it claims to test; the rule never ran.', 'Test đã thay chính code nó định test; luật không hề chạy.'],
     ['The bug is not reachable from the UI.', 'Bug không với tới được từ giao diện.'],
     ['Mocks are faster than fakes.', 'Mock nhanh hơn fake.'],
     ['The status rule is correct.', 'Luật trạng thái là đúng.']],
    0,
    `Lesson 3.3 planted exactly this bug: the mock returned the answer the test then checked, so no business logic ran. The fake-based version — real bookLab, memory repo, fake mailer — failed with "expected PENDING, received CONFIRMED".`,
    `Bài 3.3 cài đúng bug này: mock trả ra đáp án mà test sau đó kiểm, nên không chút logic nghiệp vụ nào chạy. Bản dùng fake — bookLab thật, repo trong bộ nhớ, mailer giả — đỏ với "expected PENDING, received CONFIRMED".`),
];

export default {
  course: { slug: 'testing' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Section 0 to Chapter 3 (why test, unit tests, async and time, test doubles)',
        'Kiểm tra tiến độ 1 — Mục 0 tới Chương 3 (vì sao test, unit test, bất đồng bộ và thời gian, đồ đóng thế)',
      ),
      description: B(
        'The first third of the Testing course on LabFlow Lite: error, defect and failure, the pyramid, matchers and boundaries, async tests, injected clocks and fake timers, errors with codes and causes, randomness, and stubs, spies, fakes and MSW. 24 multiple-choice questions plus 2 questions where you write a test suite that must kill planted mutants.',
        'Một phần ba đầu của khoá Testing trên LabFlow Lite: error, defect và failure, kim tự tháp, matcher và giá trị biên, test bất đồng bộ, đồng hồ tiêm vào và fake timers, lỗi có mã và cause, tính ngẫu nhiên, và stub, spy, fake, MSW. 24 câu trắc nghiệm cùng 2 câu viết bộ test phải diệt được các đột biến cài sẵn.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, 'Section 0 to Chapter 3', 'Mục 0 tới Chương 3'),
      questions: [
        ...questions,
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q25 — Matchers that say what you mean (chapter 1).</b> Write tests for three functions of LabFlow Lite:</p>' +
            '<ul>' +
            '<li>' + c('parseTime(text)') + ' turns <code>HH:MM</code> into minutes since midnight. A malformed time (<code>7:00</code>, <code>108:00</code>, <code>07:00x</code>, an empty string) throws a <code>TypeError</code> whose message contains <code>expected HH:MM</code>; a well-formed but impossible time (<code>24:00</code>, <code>12:60</code>) throws a <code>RangeError</code>.</li>' +
            '<li>' + c('formatTime(minutes)') + ' is the reverse and always pads both parts: 425 → <code>07:05</code>.</li>' +
            '<li>' + c('usageRate(bookings)') + ' adds up each booking\'s share of the 840-minute opening day. Careful: 30 + 120 + 60 minutes is 0.25 on paper but <code>0.24999999999999997</code> in floating point — choose the matcher that states what you mean.</li>' +
            '</ul>' +
            '<p>Six mutants are planted in <code>build(mutant)</code>. Kill them all.</p>',
            '<p><b>Câu 25 — Matcher nói đúng điều bạn muốn (chương 1).</b> Viết test cho ba hàm của LabFlow Lite:</p>' +
            '<ul>' +
            '<li>' + c('parseTime(text)') + ' đổi <code>HH:MM</code> thành số phút từ nửa đêm. Giờ sai định dạng (<code>7:00</code>, <code>108:00</code>, <code>07:00x</code>, chuỗi rỗng) ném <code>TypeError</code> có thông báo chứa <code>expected HH:MM</code>; giờ đúng dạng nhưng không thể có (<code>24:00</code>, <code>12:60</code>) ném <code>RangeError</code>.</li>' +
            '<li>' + c('formatTime(minutes)') + ' làm ngược lại và luôn thêm số 0 cho cả hai phần: 425 → <code>07:05</code>.</li>' +
            '<li>' + c('usageRate(bookings)') + ' cộng phần của từng lượt trên ngày mở cửa 840 phút. Cẩn thận: 30 + 120 + 60 phút trên giấy là 0,25 nhưng trong số thực dấu phẩy động là <code>0.24999999999999997</code> — chọn matcher nói đúng điều bạn muốn.</li>' +
            '</ul>' +
            '<p>Có sáu đột biến trong <code>build(mutant)</code>. Diệt hết.</p>',
          ),
          starterCode: starter({ given: C1_GIVEN, params: '{ parseTime, formatTime, usageRate }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: C1_SOLUTION,
        }),
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q26 — Honest doubles for glue code (chapter 3).</b> ' + c('bookAndNotify({ repo, mailer, log }, input)') + ' stores a booking, then e-mails: the student when it is <code>CONFIRMED</code> (subject <code>Booking confirmed: BE-201 on 2026-11-16 at 08:00</code>), the approver <code>approvals@labflow.example</code> when it is <code>PENDING</code> (subject <code>Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00</code>). A failing mailer must NOT lose the saved booking: the result has <code>notified: false</code> and one warning is logged — <code>mail failed for booking 1: SMTP down</code>.</p>' +
            '<p>A fake repository and a fake mailer with an <code>outbox</code> are given. Assert <b>who, what and what-if-it-fails</b> — "the mailer was called" kills almost nothing. Six mutants are planted.</p>',
            '<p><b>Câu 26 — Đồ đóng thế trung thực cho code "keo dán" (chương 3).</b> ' + c('bookAndNotify({ repo, mailer, log }, input)') + ' lưu lượt đặt rồi gửi thư: cho sinh viên khi lượt là <code>CONFIRMED</code> (tiêu đề <code>Booking confirmed: BE-201 on 2026-11-16 at 08:00</code>), cho người duyệt <code>approvals@labflow.example</code> khi là <code>PENDING</code> (tiêu đề <code>Approval needed: 31 seats, BE-201 on 2026-11-16 at 08:00</code>). Mailer hỏng KHÔNG được làm mất lượt đã lưu: kết quả có <code>notified: false</code> và ghi đúng một cảnh báo — <code>mail failed for booking 1: SMTP down</code>.</p>' +
            '<p>Đề cho sẵn một repository giả và một mailer giả có <code>outbox</code>. Hãy khẳng định <b>gửi cho ai, gửi gì, và hỏng thì sao</b> — "mailer đã được gọi" gần như không diệt được gì. Có sáu đột biến.</p>',
          ),
          starterCode: starter({ given: C2_GIVEN, params: '{ bookAndNotify, APPROVER }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: C2_SOLUTION,
        }),
      ],
    },
  ],
};
