/**
 * Testing — Progress Test 3: Chương 8 → Chương 11 (độ phủ/đột biến/chập chờn, CI, TDD và code cũ, Postman &
 * Newman, dự án cuối khoá). 24 câu trắc nghiệm + 2 câu VIẾT TEST chấm bằng đột biến.
 *
 * Đề tự soạn, bám `content/courses/testing/s08…s11` (kể cả s10b); dữ kiện đo lấy nguyên từ bài. Hai câu
 * lập trình: `decideMerge` — cổng ci-ok của Ch9 (`_labflow-lite/src/ci/gate.js`, chép nguyên) và một test
 * đặc tả ("golden master") cho bản báo cáo tháng kiểu code cũ của Ch10 (rút gọn từ
 * `src/legacy/monthlyReport.js`: các nhánh cuối tuần, chờ duyệt, lượt lớn, huỷ, tháng rỗng; giờ in kiểu
 * Math.round(x·10)/10 nên 7 giờ in "7", không phải "7.0"). Đọc thứ trong tuần bằng getUTCDay trên chuỗi ngày
 * ⇒ kết quả không phụ thuộc múi giờ máy chạy.
 * `node scripts/exam-check.mjs content/exams/TESTING-PT3.mjs` chạy thật lời giải mẫu.
 *
 * Phân bố: C8 ×5 · C9 ×5 · C10 ×5 · C10B ×5 · C11 ×4. Đáp án rải: A ×6 · B ×6 · C ×6 · D ×6.
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TESTING-PT3.mjs --apply
 */
import { B, EX, c, mcq, codeQ, starter, allKilled, ptInstructions } from './_lib/testing-exam-kit.mjs';

const Q = (pe, pv, opts, correct, ee, ev) =>
  mcq({ prompt: B(pe, pv), options: opts.map(([e, v]) => B(e, v)), correct, explanation: EX(ee, ev) });

const M6 = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

/* ─────────── Câu lập trình 1 — cổng ci-ok (Ch9) ─────────── */

const C1_GIVEN = `
// LabFlow Lite — src/ci/gate.js (CommonJS). Job ci-ok chạy với if: always(), đọc needs.<job>.result rồi gọi:
//   decideMerge(needs, required) → { ok, problems }
// Chỉ 'success' mới được merge. 'failure' / 'cancelled' / 'skipped' đều chặn — nhớ: GitHub coi check bắt buộc
// bị SKIPPED là QUA, nên cổng phải tự đọc kết quả. Job bắt buộc mà vắng mặt trong needs cũng chặn.
// Job KHÔNG bắt buộc (vd quarantine, continue-on-error) không bao giờ chặn. Mọi vấn đề đều được liệt kê, theo thứ tự required.
function build(mutant) {
  function decideMerge(needs, required) {
    const problems = [];
    const list = mutant === 'M5' ? Object.keys(needs) : required;
    for (const job of list) {
      const result = needs[job] && needs[job].result;
      if (result === undefined) { if (mutant !== 'M2') problems.push(job + ': not in needs'); }
      else if (mutant === 'M1' ? result !== 'success' && result !== 'skipped'
             : mutant === 'M4' ? result === 'failure'
             : result !== 'success') problems.push(job + ': ' + result);
      if (mutant === 'M3' && problems.length) break;
    }
    return { ok: mutant === 'M6' ? problems.length <= 1 : problems.length === 0, problems };
  }
  return { decideMerge };
}
`;

const C1_SOLUTION = `function suite(test, expect, { decideMerge }) {
  const REQUIRED = ['unit', 'integration', 'e2e'];
  const all = (result) => ({ unit: { result }, integration: { result }, e2e: { result } });

  test('every required job succeeded → may merge', () => {
    expect(decideMerge(all('success'), REQUIRED)).toEqual({ ok: true, problems: [] });
  });

  test.each([['failure'], ['cancelled'], ['skipped']])('a required job that is %s blocks the merge', (result) => {
    const needs = { ...all('success'), integration: { result } };
    expect(decideMerge(needs, REQUIRED)).toEqual({ ok: false, problems: ['integration: ' + result] });
  });

  test('a required job missing from needs blocks (someone deleted it from the workflow)', () => {
    const { e2e, ...rest } = all('success');
    expect(decideMerge(rest, REQUIRED)).toEqual({ ok: false, problems: ['e2e: not in needs'] });
  });

  test('every problem is listed, not only the first — and two problems still block', () => {
    expect(decideMerge({ unit: { result: 'failure' }, integration: { result: 'success' } }, REQUIRED))
      .toEqual({ ok: false, problems: ['unit: failure', 'e2e: not in needs'] });
  });

  test('a job that is not required never blocks (report-only quarantine)', () => {
    expect(decideMerge({ ...all('success'), quarantine: { result: 'failure' } }, REQUIRED)).toEqual({ ok: true, problems: [] });
  });
}`;

/* ─────────── Câu lập trình 2 — golden master cho báo cáo tháng (Ch10) ─────────── */

const C2_GIVEN = `
// LabFlow Lite — báo cáo tháng kiểu CODE CŨ (rút gọn từ src/legacy/monthlyReport.js), phòng quản lý dán NGUYÊN VĂN
// vào Excel ⇒ chữ in ra CHÍNH LÀ hành vi. Bạn sắp refactor nó: viết test đặc tả (golden master) ghim mọi nhánh trước.
// build(null) là v0 đang chạy; M1…M6 là những "sơ suất" một lần refactor hay gây ra.
function build(mutant) {
  function monthlyReport(bookings, month) {
    const inMonth = (b) => (mutant === 'M6' ? b.date.slice(0, 4) === month.slice(0, 4) : b.date.slice(0, 7) === month);
    const rows = bookings.filter((b) => inMonth(b) && (mutant === 'M3' || b.status !== 'CANCELLED'));
    if (rows.length === 0) return 'No bookings in ' + month;
    let minutes = 0, large = 0, weekend = 0, pending = 0;
    for (const b of rows) {
      minutes += b.minutes;
      if (mutant === 'M2' ? b.seats >= 30 : b.seats > 30) large++;
      const day = new Date(b.date + 'T00:00:00Z').getUTCDay();
      if (mutant === 'M4' ? day === 6 : day === 0 || day === 6) weekend++;
      if (b.status === 'PENDING') pending++;
    }
    const hours = mutant === 'M1' ? (minutes / 60).toFixed(1) : String(Math.round((minutes / 60) * 10) / 10);
    return [
      'Month: ' + month,
      'Bookings: ' + rows.length + (pending && mutant !== 'M5' ? ' (' + pending + ' pending)' : ''),
      'Hours: ' + hours,
      'Large (>30 seats): ' + large,
      'Weekend: ' + weekend,
    ].join('\\n');
  }
  return { monthlyReport };
}
`;

const C2_SOLUTION = `function suite(test, expect, { monthlyReport }) {
  // Đầu vào CHỌN THEO NHÁNH (bài 10.2): thứ Bảy 03/10 và Chủ nhật 04/10, một lượt chờ duyệt, 30 và 31 chỗ,
  // một lượt đã huỷ, một lượt tháng khác cùng năm — để mọi nhánh của v0 đều chạy và đều được ghim.
  const october = [
    { date: '2026-10-03', minutes: 120, seats: 31, status: 'CONFIRMED' },   // thứ Bảy, lượt lớn
    { date: '2026-10-04', minutes: 60, seats: 30, status: 'PENDING' },      // Chủ nhật, đúng 30 chỗ — KHÔNG lớn
    { date: '2026-10-06', minutes: 240, seats: 12, status: 'CONFIRMED' },   // thứ Ba
    { date: '2026-10-07', minutes: 90, seats: 40, status: 'CANCELLED' },    // đã huỷ — không tính
    { date: '2026-11-03', minutes: 60, seats: 10, status: 'CONFIRMED' },    // tháng khác
  ];

  test('October report, pinned exactly as v0 prints it (the office pastes it into Excel)', () => {
    expect(monthlyReport(october, '2026-10')).toBe([
      'Month: 2026-10',
      'Bookings: 3 (1 pending)',
      'Hours: 7',
      'Large (>30 seats): 1',
      'Weekend: 2',
    ].join('\\n'));
  });

  test('a month with only cancelled bookings is an empty month', () => {
    expect(monthlyReport([october[3]], '2026-10')).toBe('No bookings in 2026-10');
  });
}`;

const questions = [
  /* ══════════════ Chương 8 ══════════════ */
  Q(`A suite for booking.js reaches 100% statements, branches, functions and lines, and every assertion is ${c('toBeDefined()')}. What does lesson 8.1 conclude?`,
    `Bộ test của booking.js đạt 100% câu lệnh, nhánh, hàm và dòng, và mọi khẳng định đều là ${c('toBeDefined()')}. Bài 8.1 kết luận gì?`,
    [['The rules are fully tested.', 'Các luật đã được test đầy đủ.'],
     ['Coverage counts what ran, not what was checked.', 'Độ phủ đếm cái đã chạy, không phải cái đã được kiểm.'],
     ['Branch coverage is broken in v8.', 'Độ phủ nhánh của v8 bị lỗi.'],
     ['The threshold should be raised to 100%.', 'Nên nâng ngưỡng lên 100%.']],
    1,
    `toBeDefined() is true for false, 'PENDING' and 'CONFIRMED' alike, so two planted bugs stayed green (lesson 8.1). The real booking.test.js, with exact assertions, covers only 87.5% of lines and still kills them. The suite is already at 100%, so a threshold changes nothing.`,
    `toBeDefined() đúng với false, 'PENDING' lẫn 'CONFIRMED', nên hai bug cài vào vẫn xanh (bài 8.1). booking.test.js thật, với khẳng định chính xác, chỉ phủ 87,5% dòng mà vẫn diệt được chúng. Bộ test đã ở 100% nên ngưỡng không đổi được gì.`),

  Q(`Stryker runs that same suite: 39 of 94 mutants killed, score 41.49%, exit code 1. Where does the exit code come from?`,
    `Stryker chạy chính bộ test đó: diệt 39/94 đột biến, điểm 41,49%, mã thoát 1. Mã thoát đến từ đâu?`,
    [['A crash inside Stryker.', 'Một cú sập bên trong Stryker.'],
     ['A failing unit test.', 'Một unit test bị đỏ.'],
     ['thresholds.break: 60 in the Stryker config.', 'thresholds.break: 60 trong cấu hình Stryker.'],
     ['Coverage below the Vitest threshold.', 'Độ phủ dưới ngưỡng của Vitest.']],
    2,
    `Stryker's break threshold turns a low mutation score into a failed command, like a coverage threshold does (lesson 8.2). The tests reach every mutant (coverage 100%) but notice fewer than half of them.`,
    `Ngưỡng break của Stryker biến điểm đột biến thấp thành một lệnh thất bại, giống ngưỡng độ phủ (bài 8.2). Test chạm tới mọi đột biến (độ phủ 100%) nhưng nhận ra chưa tới một nửa.`),

  Q(`Two mutants survive in days.js: ${c("'T00:00:00Z'")} replaced by ${c('""')} in ${c("Date.parse(dateText + 'T00:00:00Z')")}. Both strings parse to the same millisecond value. What do you do?`,
    `Hai đột biến sống ở days.js: ${c("'T00:00:00Z'")} bị thay bằng ${c('""')} trong ${c("Date.parse(dateText + 'T00:00:00Z')")}. Cả hai chuỗi đều parse ra cùng số mili giây. Bạn làm gì?`,
    [['Record it as an equivalent mutant, with the measurement as the reason.', 'Ghi nhận là đột biến tương đương, kèm phép đo làm lý do.'],
     ['Write a test with a time-zone string the API never sends.', 'Viết test với một chuỗi múi giờ mà API không bao giờ gửi.'],
     ['Lower the break threshold.', 'Hạ ngưỡng break.'],
     ['Delete days.js from mutation testing.', 'Bỏ days.js khỏi mutation testing.']],
    0,
    `A date-only ISO string is already parsed as UTC midnight, so the program behaves the same — an equivalent mutant no test can kill (lesson 8.2). Forcing one would test JavaScript's date parser with an input the API schema never allows.`,
    `Chuỗi ISO chỉ có ngày vốn đã được parse là nửa đêm UTC, nên chương trình chạy y hệt — đột biến tương đương, không test nào diệt được (bài 8.2). Cố diệt là đi test bộ parse ngày của JavaScript với một đầu vào mà schema API không bao giờ cho.`),

  Q(`Yesterday ${c('npm run test:unit')} printed 85 tests; today, with no code change, it prints 170 and a line ${c('✓ .stryker-tmp/sandbox-…/src/api/server.test.js')}. What happened?`,
    `Hôm qua ${c('npm run test:unit')} in 85 test; hôm nay, không đổi code, nó in 170 test và một dòng ${c('✓ .stryker-tmp/sandbox-…/src/api/server.test.js')}. Chuyện gì đã xảy ra?`,
    [['Vitest now runs every test twice.', 'Vitest giờ chạy mỗi test hai lần.'],
     ['Someone copied the tests by mistake.', 'Ai đó chép nhầm bộ test.'],
     ['Stryker always keeps its sandbox.', 'Stryker luôn giữ lại sandbox của nó.'],
     ['A crashed Stryker run left a sandbox copy matching the src/ filter.', 'Một lượt Stryker bị sập để lại bản sao sandbox khớp bộ lọc src/.']],
    3,
    `A Vitest path filter is a substring match, so src/ also matches .stryker-tmp/sandbox-…/src/. Stryker removes the sandbox after a normal run; a crash can leave it. Exclude .stryker-tmp/** — and read the test count, not only the colour (lesson 8.2).`,
    `Bộ lọc đường dẫn của Vitest là khớp chuỗi con, nên src/ cũng khớp .stryker-tmp/sandbox-…/src/. Stryker xoá sandbox sau một lượt bình thường; lượt bị sập có thể để lại. Hãy loại .stryker-tmp/** — và đọc số test, đừng chỉ nhìn màu (bài 8.2).`),

  Q(`thu-tu.test.js was red 0/20 in file order and 13/20 with ${c('--sequence.shuffle')}. How do you get a run that fails the same way every time?`,
    `thu-tu.test.js đỏ 0/20 theo thứ tự file và 13/20 với ${c('--sequence.shuffle')}. Làm sao có một lượt chạy đỏ y hệt mọi lần?`,
    [['Run it with --repeats=20 in file order.', 'Chạy với --repeats=20 theo thứ tự file.'],
     ['Re-run with --sequence.seed set to a seed of a red run.', 'Chạy lại với --sequence.seed bằng seed của một lượt đỏ.'],
     ['Disable shuffling in CI so it stays green.', 'Tắt xáo trộn trên CI cho nó giữ xanh.'],
     ['Add retry: 2 to the file.', 'Thêm retry: 2 vào file.']],
    1,
    `The shuffle is pseudo-random: a seed fixes it. With the seed of a red run the chapter got "1 failed | 2 passed" both times, which exposed a test that locked an account another test then expected to be unlocked (lesson 8.3). --repeats repeats each test, not the order.`,
    `Xáo trộn là giả ngẫu nhiên: seed cố định nó. Với seed của một lượt đỏ, chương nhận "1 failed | 2 passed" cả hai lần, lộ ra một test khoá tài khoản mà test khác lại mong là chưa khoá (bài 8.3). --repeats lặp từng test, không đổi thứ tự.`),

  /* ══════════════ Chương 9 ══════════════ */
  Q(`An integration job runs directly on ubuntu-latest with a postgres:17 service and ${c('ports: 5432:5432')}. Which host should TEST_DATABASE_URL use?`,
    `Một job tích hợp chạy thẳng trên ubuntu-latest với service postgres:17 và ${c('ports: 5432:5432')}. TEST_DATABASE_URL nên dùng host nào?`,
    [['postgres — the service label.', 'postgres — tên nhãn của service.'],
     ['The container IP from docker inspect.', 'IP container lấy từ docker inspect.'],
     ['localhost on the mapped port.', 'localhost trên cổng đã map.'],
     ['host.docker.internal', 'host.docker.internal']],
    2,
    `On the runner machine, services are reached at localhost:&lt;port&gt; through a port mapping; the service label works as a hostname only when the job itself runs in a container (lesson 9.1). Changing to "postgres" without a container job gives ENOTFOUND.`,
    `Trên máy runner, service được gọi qua localhost:&lt;cổng&gt; nhờ map cổng; nhãn service chỉ dùng làm tên máy khi chính job chạy trong container (bài 9.1). Đổi sang "postgres" mà job không chạy trong container sẽ ra ENOTFOUND.`),

  Q(`The e2e job fails in 2.8 s: "chrome-headless-shell: error while loading shared libraries: libnspr4.so". The tests pass on laptops. Fix?`,
    `Job e2e đỏ sau 2,8 s: "chrome-headless-shell: error while loading shared libraries: libnspr4.so". Trên laptop test qua. Sửa thế nào?`,
    [['Cache the browser binaries between runs.', 'Cache file trình duyệt giữa các lượt chạy.'],
     ['Switch the job to webkit.', 'Đổi job sang webkit.'],
     ['Add retries: 2 in CI.', 'Thêm retries: 2 trên CI.'],
     ['npx playwright install --with-deps chromium', 'npx playwright install --with-deps chromium']],
    3,
    `A fresh Ubuntu machine lacks the Linux packages Chromium needs; --with-deps installs them with apt (64 packages in the course's run) and then 9 tests passed (lesson 9.1). The binary was there — a system library was missing.`,
    `Máy Ubuntu mới thiếu các gói Linux mà Chromium cần; --with-deps cài chúng bằng apt (64 gói ở lượt chạy của khoá) và sau đó 9 test qua (bài 9.1). File trình duyệt có sẵn — cái thiếu là thư viện hệ thống.`),

  Q(`On a red pull request (a web test failed), the job summary written by the project's own script said "✅ 174 of 174 tests passed". What is the right fix?`,
    `Trên một pull request đỏ (một test web hỏng), bản tóm tắt do script của dự án viết lại ghi "✅ 174 of 174 tests passed". Sửa thế nào là đúng?`,
    [['Feed the script the web report too, and test the script.', 'Đưa cả báo cáo web cho script, và viết test cho script.'],
     ['Add if: failure() to the summary step.', 'Thêm if: failure() cho bước tóm tắt.'],
     ['Remove the summary; nobody reads it.', 'Bỏ bản tóm tắt; không ai đọc.'],
     ['Run the unit tests twice.', 'Chạy unit test hai lần.']],
    0,
    `The summary only knew reports/unit.json; after merging unit + web reports the same PR showed "❌ 1 of 191 tests failed" with the test listed (lesson 9.2). A summary is a claim about the run, so it gets tests. The step did run — its input was wrong.`,
    `Bản tóm tắt chỉ biết reports/unit.json; gộp báo cáo unit + web xong thì cùng PR đó hiện "❌ 1 of 191 tests failed" kèm tên test (bài 9.2). Bản tóm tắt là một lời khẳng định về lượt chạy, nên nó cũng cần test. Bước đó có chạy — chỉ là đầu vào sai.`),

  Q(`Two matrix legs (Node 22 and 24) both upload an artifact named "reports" with actions/upload-artifact@v4. In act both succeed. What will GitHub do?`,
    `Hai nhánh ma trận (Node 22 và 24) cùng tải artifact tên "reports" bằng actions/upload-artifact@v4. Trong act cả hai thành công. GitHub sẽ làm gì?`,
    [['Merge both uploads into one zip.', 'Gộp hai lần tải vào một file zip.'],
     ['Refuse the second upload — put the matrix value in the name.', 'Từ chối lần tải thứ hai — hãy đưa giá trị ma trận vào tên.'],
     ['Keep the newest upload, like act.', 'Giữ lần tải mới nhất, như act.'],
     ['Rename the second one automatically.', 'Tự đổi tên lần tải thứ hai.']],
    1,
    `The upload-artifact v4 README: uploading to the same artifact from several jobs is not supported; names must be unique (lesson 9.2). act's local server accepted both and silently kept one — a rehearsal more forgiving than the real thing.`,
    `README của upload-artifact v4: không hỗ trợ nhiều job cùng tải lên một artifact; tên phải duy nhất (bài 9.2). Máy chủ cục bộ của act nhận cả hai rồi lặng lẽ giữ một — buổi tổng duyệt dễ tính hơn buổi diễn thật.`),

  Q(`The race test of lesson 8.3 (a real double-booking bug, issue LAB-142, owner An) is red in 13 of 30 runs. Where should it run in CI until the bug is fixed?`,
    `Test tranh chấp của bài 8.3 (bug đặt trùng thật, issue LAB-142, người phụ trách An) đỏ 13/30 lần. Tới khi sửa xong, nó nên chạy ở đâu trên CI?`,
    [['Inside the required unit job, with retries.', 'Trong job unit bắt buộc, kèm retry.'],
     ['Nowhere — delete it until the fix.', 'Không ở đâu — xoá nó tới khi sửa xong.'],
     ['In its own job with continue-on-error, not in the gate.', 'Trong một job riêng có continue-on-error, không nằm trong cổng.'],
     ['Only on the main branch, after merge.', 'Chỉ trên nhánh main, sau khi merge.']],
    2,
    `Quarantine keeps the evidence without punishing innocent pull requests — otherwise one in three PRs would be blocked by a bug none of them caused (lesson 9.3). It returns to the gate after the fix shows 0 red in 100 shuffled runs. Retries turned 17/50 red into 0/50 while the bug stayed.`,
    `Cách ly giữ bằng chứng mà không phạt các pull request vô can — nếu không, cứ ba PR thì một bị chặn bởi một bug không phải do nó (bài 9.3). Nó quay lại cổng khi bản sửa cho 0 lần đỏ trong 100 lượt xáo trộn. Retry đã biến 17/50 đỏ thành 0/50 trong khi bug vẫn còn.`),

  /* ══════════════ Chương 10 ══════════════ */
  Q(`Step 1 of TDD went green with ${c('return { ok: true, position: 1, queue: [{ userId }] }')} — position hard-coded. Is that cheating?`,
    `Bước 1 của TDD xanh với ${c('return { ok: true, position: 1, queue: [{ userId }] }')} — position ghi cứng. Như vậy có gian lận không?`,
    [['Yes — always write the full implementation at once.', 'Có — luôn viết trọn bản cài đặt ngay một lần.'],
     ['Yes — constants are forbidden in TDD.', 'Có — TDD cấm dùng hằng số.'],
     ['No, because the test is green.', 'Không, vì test đã xanh.'],
     ['No: it is "fake it"; the next test triangulates.', 'Không: đó là "fake it"; test kế tiếp sẽ tam giác hoá.']],
    3,
    `Fake it (Kent Beck) gets to green in seconds; the next test — a second student at position 2 — went red ("1 failed | 1 passed") and forced the general code [...queue, { userId }] (lesson 10.1). Writing everything at once leaves branches no test forced.`,
    `Fake it (Kent Beck) đưa tới xanh trong vài giây; test kế tiếp — sinh viên thứ hai ở vị trí 2 — đỏ ("1 failed | 1 passed") và buộc ra code tổng quát [...queue, { userId }] (bài 10.1). Viết hết một lần thì còn những nhánh không test nào buộc phải có.`),

  Q(`Your first characterization test of the legacy monthly report covers 96.42% of lines and catches 3 of 10 planted changes. What makes it strong enough to refactor under?`,
    `Test đặc tả đầu tiên cho báo cáo tháng của code cũ phủ 96,42% dòng và bắt được 3/10 thay đổi cài sẵn. Cái gì làm nó đủ mạnh để refactor dựa vào?`,
    [['Inputs chosen to reach every branch, then the planted changes as proof.', 'Chọn đầu vào chạm mọi nhánh, rồi dùng các thay đổi cài sẵn làm bằng chứng.'],
     ['Raising coverage to 100% lines.', 'Nâng độ phủ lên 100% dòng.'],
     ['Running it in watch mode.', 'Chạy nó ở chế độ watch.'],
     ['Snapshotting the output with -u after each change.', 'Chụp snapshot kết quả bằng -u sau mỗi thay đổi.']],
    0,
    `A characterization test is only as strong as its inputs (lesson 10.2): weekend, holiday, pending, cancelled, 30/31 seats, another lab, another month, an empty month. The golden master over nine chosen rows reached 100% branches and caught 10/10. Lines were already at 96%.`,
    `Test đặc tả chỉ mạnh bằng đầu vào của nó (bài 10.2): cuối tuần, ngày lễ, chờ duyệt, đã huỷ, 30/31 chỗ, lab khác, tháng khác, tháng rỗng. Golden master trên chín dòng được chọn đạt 100% nhánh và bắt 10/10. Dòng thì vốn đã 96%.`),

  Q(`Refactoring the report, a teammate writes hours as ${c('(minutes / 60).toFixed(1)')}. The golden master goes red: "- Hours: 7 / + Hours: 7.0". What is the right reaction?`,
    `Khi refactor báo cáo, đồng đội viết số giờ thành ${c('(minutes / 60).toFixed(1)')}. Golden master đỏ: "- Hours: 7 / + Hours: 7.0". Phản ứng đúng là gì?`,
    [['Run -u — 7.0 is nicer.', 'Chạy -u — 7.0 đẹp hơn.'],
     ['Keep v0\'s format: the text is the behaviour.', 'Giữ định dạng của v0: chữ in ra chính là hành vi.'],
     ['Delete the golden master; it is too strict.', 'Xoá golden master; nó quá chặt.'],
     ['Compare with toBeCloseTo instead.', 'So bằng toBeCloseTo thay vào đó.']],
    1,
    `The office pastes this text into Excel, so "7" versus "7.0" is a change its import would see (lesson 10.2). A golden master's job during a refactor is to go red at any difference; -u would turn it into a rubber stamp. A format change is a separate, agreed change.`,
    `Phòng quản lý dán đoạn chữ này vào Excel, nên "7" khác "7.0" là thay đổi mà bước nhập dữ liệu của họ sẽ thấy (bài 10.2). Trong lúc refactor, việc của golden master là đỏ trước mọi khác biệt; -u biến nó thành con dấu đóng bừa. Đổi định dạng là một thay đổi riêng, phải thống nhất.`),

  Q(`A bug sends a freed slot to the LAST student in line. The broad snapshot test turns red; the author runs ${c('vitest -u')} and pushes. What should the reviewer do?`,
    `Một bug đưa chỗ vừa trống cho sinh viên CUỐI hàng. Test snapshot "rộng" đỏ; tác giả chạy ${c('vitest -u')} rồi push. Người review nên làm gì?`,
    [['Approve — CI is green after the update.', 'Duyệt — CI đã xanh sau khi cập nhật.'],
     ['Ask for more snapshots of the waitlist.', 'Yêu cầu thêm snapshot cho hàng chờ.'],
     ['Read the .snap diff, block, and ask for explicit assertions.', 'Đọc diff của .snap, chặn, và yêu cầu khẳng định tường minh.'],
     ['Ask the author to re-run CI.', 'Yêu cầu tác giả chạy lại CI.']],
    2,
    `-u accepts whatever the code does now, bug included; the defence left is a human reading the diff, where offeredTo an → chi hides among dozens of unchanged lines (lesson 10.3). Reviewed tests name who is offered the slot and assert it exactly.`,
    `-u chấp nhận mọi thứ code đang làm, kể cả bug; hàng phòng thủ còn lại là người đọc diff, nơi offeredTo an → chi lẫn giữa hàng chục dòng không đổi (bài 10.3). Test đã review gọi tên ai được mời nhận chỗ và khẳng định chính xác điều đó.`),

  Q(`A test builds three random student ids. Without retry it is red 10/30; with ${c('{ retry: 3 }')} it is red 0/30. Your review comment?`,
    `Một test tạo ba id sinh viên ngẫu nhiên. Không retry thì đỏ 10/30; với ${c('{ retry: 3 }')} thì đỏ 0/30. Bình luận review của bạn?`,
    [['Approve — 0/30 proves it is fixed.', 'Duyệt — 0/30 chứng minh đã sửa xong.'],
     ['Suggest retry: 5 to be safe.', 'Đề xuất retry: 5 cho chắc.'],
     ['Nitpick the test name only.', 'Chỉ góp ý tên test.'],
     ['Blocking: use fixed ids and remove the retry.', 'Chặn: dùng id cố định và bỏ retry.']],
    3,
    `The randomness is in the test itself — random ids collide, so a student is ALREADY_WAITING. Retry hides it, and would hide a real intermittent bug too (lesson 10.3). "(retry x1)" in the reporter is the signal a reviewer should notice.`,
    `Tính ngẫu nhiên nằm trong chính test — id ngẫu nhiên trùng nhau nên một sinh viên bị ALREADY_WAITING. Retry giấu nó, và cũng sẽ giấu một bug chập chờn thật (bài 10.3). "(retry x1)" trong báo cáo là tín hiệu người review cần để ý.`),

  /* ══════════════ Chương 10B ══════════════ */
  Q(`The request "Another student cannot read it" uses ${c('{{bookingID}}')} while the variable saved earlier is ${c('bookingId')}. It expects 404 and is green. Best reaction?`,
    `Request "Another student cannot read it" dùng ${c('{{bookingID}}')} trong khi biến đã lưu trước đó là ${c('bookingId')}. Nó mong 404 và xanh. Phản ứng tốt nhất?`,
    [['Treat the test as broken: fix the name and guard against "{{" in the URL.', 'Coi test là hỏng: sửa tên và chặn "{{" còn sót trong URL.'],
     ['Accept it — 404 is the expected answer.', 'Chấp nhận — 404 đúng là câu trả lời mong đợi.'],
     ['Switch to 403 to be stricter.', 'Đổi sang 403 cho chặt hơn.'],
     ['Check request.url.toString() for braces.', 'Kiểm request.url.toString() có dấu ngoặc không.']],
    0,
    `The literal {{bookingID}} was sent, and any API answers 404 to that (lesson 10B.2). The guard must decode first: toString() already encodes the braces as %7B%7B, which is why the first version of the practice solution stayed green on the broken URL.`,
    `Chuỗi {{bookingID}} nguyên văn đã được gửi đi, và API nào cũng trả 404 cho thứ đó (bài 10B.2). Phép chặn phải giải mã trước: toString() đã mã hoá dấu ngoặc thành %7B%7B, nên bản lời giải luyện tập đầu tiên vẫn xanh trên URL hỏng.`),

  Q(`Inside ${c('pm.test("admin list", () => { pm.sendRequest(url, (err, res) => pm.expect(res.code).to.eql(200)); })')} the second request answers 401. What does the run report?`,
    `Bên trong ${c('pm.test("admin list", () => { pm.sendRequest(url, (err, res) => pm.expect(res.code).to.eql(200)); })')} request thứ hai trả 401. Lượt chạy báo gì?`,
    [['A red test with 401.', 'Một test đỏ với 401.'],
     ['A green test: it returned before the callback ran.', 'Một test xanh: nó trả về trước khi callback chạy.'],
     ['A timeout.', 'Hết giờ.'],
     ['A script error that stops the collection.', 'Lỗi script làm dừng cả collection.']],
    1,
    `Trap T7: "callback assertion, no done" was ✓ while the log printed code 401; the same check with a done parameter, calling done() or done(err), was red (lesson 10B.2). The run also showed pm.sendRequest does not inherit the collection's auth.`,
    `Bẫy T7: "khẳng định trong callback, không có done" ra ✓ trong khi log in mã 401; cùng phép kiểm đó có tham số done, gọi done() hoặc done(err), thì đỏ (bài 10B.2). Lượt chạy còn cho thấy pm.sendRequest không thừa hưởng auth của collection.`),

  Q(`A nightly collection logs in once, then makes 300 requests over 20 minutes. Tokens live 15 minutes; from request 230 on everything is 401. Best fix?`,
    `Một collection chạy đêm đăng nhập một lần rồi gửi 300 request trong 20 phút. Token sống 15 phút; từ request 230 trở đi mọi thứ là 401. Cách sửa tốt nhất?`,
    [['Make tokens live 24 hours on the server.', 'Cho token sống 24 giờ trên máy chủ.'],
     ['Add a delay between requests.', 'Thêm độ trễ giữa các request.'],
     ['A collection pre-request that refreshes the token near expiry.', 'Một pre-request ở mức collection làm mới token khi sắp hết hạn.'],
     ['Run Newman with --suppress-exit-code.', 'Chạy Newman với --suppress-exit-code.']],
    2,
    `Measured with a 2-second token: logging in once gave 2 of 3 requests 401; refreshing in the collection pre-request made 3 of 3 green (lesson 10B.3). Longer tokens weaken security to fit a test; delays make it worse; suppressing the exit code hides every failure.`,
    `Đo với token 2 giây: đăng nhập một lần thì 2/3 request bị 401; làm mới trong pre-request của collection thì 3/3 xanh (bài 10B.3). Token dài hơn là làm yếu bảo mật cho vừa test; thêm trễ còn tệ hơn; giấu mã thoát là giấu mọi lỗi.`),

  Q(`With body ${c('"seats": "{{seats}}"')} and a CSV of 15 boundary cases, 12 cases are red and 3 green ("0 seats", "201 seats", "hour 24", all expecting 400). What do the 3 green cases prove?`,
    `Với body ${c('"seats": "{{seats}}"')} và một CSV 15 ca biên, 12 ca đỏ và 3 ca xanh ("0 seats", "201 seats", "hour 24", đều mong 400). Ba ca xanh chứng minh gì?`,
    [['That those three boundaries are correct.', 'Ba biên đó đúng.'],
     ['That the CSV must be replaced by JSON.', 'Phải thay CSV bằng JSON.'],
     ['That the API validates seats correctly.', 'API kiểm seats đúng.'],
     ['Nothing: seats was a string, so every request was refused.', 'Không gì: seats là chuỗi nên mọi request đều bị từ chối.']],
    3,
    `The API said "expected number, received string" for every row; the three rows that happened to expect 400 passed for the wrong field (lesson 10B.4). Remove the quotes, and assert details[0].path so a test can only pass for its own field.`,
    `API trả "expected number, received string" cho mọi dòng; ba dòng tình cờ mong 400 thì qua vì sai trường (bài 10B.4). Bỏ dấu ngoặc kép, và khẳng định details[0].path để test chỉ có thể qua vì đúng trường của nó.`),

  Q(`A CI run of the collection shows 12 failed assertions: three "200 and a token" in 1 Auth, then 401s everywhere. What do you look at first?`,
    `Một lượt CI chạy collection báo 12 khẳng định đỏ: ba cái "200 and a token" ở 1 Auth, rồi 401 khắp nơi. Bạn nhìn vào đâu trước?`,
    [['The first failure: the password secret given to --env-var.', 'Lỗi đầu tiên: secret mật khẩu truyền qua --env-var.'],
     ['The last failure, since it is the most recent.', 'Lỗi cuối cùng, vì nó mới nhất.'],
     ['Re-run the job — it is probably flaky.', 'Chạy lại job — chắc là chập chờn.'],
     ['The Newman version.', 'Phiên bản Newman.']],
    0,
    `Exactly the red run measured in lesson 10B.5 (a wrong PW): 3 refused logins, 9 consequences, exit 1. Read top-down and stop at the first failure not explained by an earlier one. The cause is deterministic — the same 12 come back every time; --bail makes it the only red line.`,
    `Đúng lượt đỏ đo ở bài 10B.5 (PW sai): 3 lần đăng nhập bị từ chối, 9 hệ quả, mã thoát 1. Đọc từ trên xuống và dừng ở lỗi đầu tiên không được lỗi trước giải thích. Nguyên nhân tất định — 12 lỗi đó lặp lại mọi lần; --bail khiến nó thành dòng đỏ duy nhất.`),

  /* ══════════════ Chương 11 ══════════════ */
  Q(`The server runs in UTC. At 00:30 on 16 November in Ha Noi, a student books 30 November — exactly 14 days ahead in Viet Nam — and is refused. Why?`,
    `Máy chủ chạy UTC. Lúc 00:30 ngày 16/11 ở Hà Nội, một sinh viên đặt ngày 30/11 — đúng 14 ngày theo giờ Việt Nam — và bị từ chối. Vì sao?`,
    [['BR-05 counts 14 days exclusive.', 'BR-05 đếm 14 ngày không tính biên.'],
     ['"Today" was still 15 November in UTC, so it counted 15 days.', '"Hôm nay" theo UTC vẫn là 15/11, nên đếm ra 15 ngày.'],
     ['The student\'s browser sent the wrong date.', 'Trình duyệt của sinh viên gửi sai ngày.'],
     ['Fake timers leaked into production.', 'Fake timers rò sang production.']],
    1,
    `Between 00:00 and 07:00 in Viet Nam, UTC is still on the previous day, so the count comes out one higher (lesson 2.2's bug, met again in the capstone). Count the calendar in Viet Nam time and prove it with an injected clock on both sides of midnight.`,
    `Từ 00:00 tới 07:00 ở Việt Nam, UTC vẫn đang ở ngày hôm trước, nên phép đếm ra lớn hơn một (bug của bài 2.2, gặp lại ở dự án cuối khoá). Đếm theo lịch Việt Nam và chứng minh bằng đồng hồ tiêm vào ở hai phía nửa đêm.`),

  Q(`A mutant makes the PostgreSQL adapter read ${c('date')} straight from the column instead of ${c("to_char(date, 'YYYY-MM-DD')")}. Every unit and API test stays green. Which layer turns red?`,
    `Một đột biến khiến adapter PostgreSQL đọc ${c('date')} thẳng từ cột thay vì ${c("to_char(date, 'YYYY-MM-DD')")}. Mọi unit test và test API vẫn xanh. Tầng nào đỏ?`,
    [['The end-to-end tests.', 'Test end-to-end.'],
     ['The unit tests, after a re-run.', 'Unit test, sau khi chạy lại.'],
     ['Only the DB integration tests.', 'Chỉ test tích hợp với CSDL.'],
     ['None — the change is harmless.', 'Không tầng nào — thay đổi vô hại.']],
    2,
    `Unit and API tests use the in-memory repository, which stores strings; the e2e server also uses it. Only test/integration ran the real adapter: node-postgres turns a date into a JS Date at local midnight, so My bookings breaks the contract and cancels answer TOO_LATE (lesson 11.2).`,
    `Unit test và test API dùng repository trong bộ nhớ vốn lưu chuỗi; server e2e cũng dùng nó. Chỉ test/integration chạy adapter thật: node-postgres đổi date thành Date của JS ở nửa đêm giờ máy, nên My bookings vỡ hợp đồng và lệnh huỷ trả TOO_LATE (bài 11.2).`),

  Q(`Stryker on cancel.js scores 97.73% on a laptop in Ha Noi (one survivor: ${c("':00+07:00'")} → ${c('""')}) and 100% in UTC. What did LabFlow change?`,
    `Stryker trên cancel.js được 97,73% ở laptop Hà Nội (một đột biến sống: ${c("':00+07:00'")} → ${c('""')}) và 100% ở UTC. LabFlow đã đổi gì?`,
    [['Marked the mutant as equivalent.', 'Đánh dấu đột biến là tương đương.'],
     ['Lowered the break threshold to 95.', 'Hạ ngưỡng break xuống 95.'],
     ['Removed the offset from the code.', 'Bỏ phần độ lệch múi giờ khỏi code.'],
     ['Run mutation testing in UTC (TZ set in the Stryker config).', 'Chạy mutation testing ở UTC (đặt TZ trong cấu hình Stryker).']],
    3,
    `Without the offset the string is read in the machine's zone — which in Ha Noi IS +07:00, so tests there cannot see the bug; on a UTC server it shifts the start by 7 hours (lesson 11.2). The mutant is only "equivalent" in one zone, so run mutants in UTC and units also in Viet Nam time.`,
    `Không có độ lệch thì chuỗi được đọc theo múi giờ của máy — mà ở Hà Nội đó CHÍNH LÀ +07:00, nên test ở đó không thấy bug; trên máy chủ UTC nó lệch giờ bắt đầu 7 tiếng (bài 11.2). Đột biến chỉ "tương đương" ở một múi giờ, nên chạy đột biến ở UTC và unit test ở cả giờ Việt Nam.`),

  Q(`An old e2e test became flaky in Firefox after another test was renamed: two rows matched ${c('/QA-912/')}. freshLab derives the lab code from a hash of the testId and had 900 codes for 25 tests. What is the fix?`,
    `Một test e2e cũ bắt đầu chập chờn trên Firefox sau khi một test khác được đổi tên: hai dòng khớp ${c('/QA-912/')}. freshLab sinh mã lab từ hash của testId và có 900 mã cho 25 test. Sửa thế nào?`,
    [['Widen the code space and make collisions visible.', 'Nới không gian mã và làm va chạm hiện ra.'],
     ['Never rename tests.', 'Không bao giờ đổi tên test.'],
     ['Add retries to Firefox only.', 'Chỉ thêm retry cho Firefox.'],
     ['Run Firefox tests one at a time.', 'Chạy test Firefox lần lượt từng cái.']],
    0,
    `Birthday problem: 1 − e^(−25·24/(2·900)) ≈ 28% — a renamed testId hit a shared code (lesson 11.3). Renaming for traceability was harmless; the hidden collision was the bug. A 608,400-code space plus a visible collision check fixes it; retries would hide it until the next new test.`,
    `Bài toán ngày sinh: 1 − e^(−25·24/(2·900)) ≈ 28% — một testId đổi tên trúng mã dùng chung (bài 11.3). Đổi tên để truy vết là vô hại; va chạm bị giấu mới là bug. Không gian 608.400 mã cùng phép kiểm va chạm hiện rõ sẽ sửa được; retry chỉ giấu nó tới test mới tiếp theo.`),
];

export default {
  course: { slug: 'testing' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8–11 (quality and flakiness, CI, TDD and legacy code, Postman/Newman, capstone)',
        'Kiểm tra tiến độ 3 — Chương 8–11 (chất lượng và chập chờn, CI, TDD và code cũ, Postman/Newman, dự án cuối khoá)',
      ),
      description: B(
        'The last third of the Testing course: coverage versus mutation score, equivalent mutants, flaky tests and seeds; services, reports, required checks and pipefail in GitHub Actions; TDD, characterization tests and review; Postman scopes, test scripts, data-driven runs and Newman in CI; and what the capstone measured. 24 multiple-choice questions plus 2 questions where you write a test suite that must kill planted mutants.',
        'Một phần ba cuối của khoá Testing: độ phủ so với điểm đột biến, đột biến tương đương, test chập chờn và seed; service, báo cáo, check bắt buộc và pipefail trong GitHub Actions; TDD, test đặc tả và review; phạm vi biến Postman, test script, chạy theo dữ liệu và Newman trên CI; và những gì dự án cuối khoá đã đo. 24 câu trắc nghiệm cùng 2 câu viết bộ test phải diệt được các đột biến cài sẵn.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, 'Chapters 8–11 (including 10B)', 'Chương 8–11 (kể cả 10B)'),
      questions: [
        ...questions,
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q25 — Test the gate that guards main (chapter 9).</b> ' + c('decideMerge(needs, required)') + ' is the brain of the <code>ci-ok</code> job. <code>needs</code> is what GitHub gives a job with <code>if: always()</code> — ' + c("{ unit: { result: 'success' }, … }") + '; <code>required</code> is the list of job names that must pass. It returns ' + c('{ ok, problems }') + ':</p>' +
            '<ul>' +
            '<li>only <code>success</code> may merge — <code>failure</code>, <code>cancelled</code> and <code>skipped</code> all block (GitHub counts a skipped required check as passed, so the gate must read results itself);</li>' +
            '<li>a required job missing from <code>needs</code> blocks with <code>"&lt;job&gt;: not in needs"</code>;</li>' +
            '<li>every problem is listed, in the order of <code>required</code>, as <code>"&lt;job&gt;: &lt;result&gt;"</code>;</li>' +
            '<li>a job that is not required (a quarantine job) never blocks.</li>' +
            '</ul>' +
            '<p>Six mutants are planted. This function decides what reaches main — a surviving mutant is a broken branch protection.</p>',
            '<p><b>Câu 25 — Test cái cổng canh nhánh main (chương 9).</b> ' + c('decideMerge(needs, required)') + ' là bộ não của job <code>ci-ok</code>. <code>needs</code> là thứ GitHub đưa cho một job có <code>if: always()</code> — ' + c("{ unit: { result: 'success' }, … }") + '; <code>required</code> là danh sách tên job bắt buộc phải qua. Hàm trả về ' + c('{ ok, problems }') + ':</p>' +
            '<ul>' +
            '<li>chỉ <code>success</code> mới được merge — <code>failure</code>, <code>cancelled</code> và <code>skipped</code> đều chặn (GitHub tính check bắt buộc bị bỏ qua là qua, nên cổng phải tự đọc kết quả);</li>' +
            '<li>job bắt buộc mà vắng mặt trong <code>needs</code> thì chặn với <code>"&lt;job&gt;: not in needs"</code>;</li>' +
            '<li>mọi vấn đề đều được liệt kê, theo thứ tự của <code>required</code>, dạng <code>"&lt;job&gt;: &lt;result&gt;"</code>;</li>' +
            '<li>job không bắt buộc (job cách ly) không bao giờ chặn.</li>' +
            '</ul>' +
            '<p>Có sáu đột biến. Hàm này quyết định cái gì vào được main — một đột biến sống là một luật bảo vệ nhánh bị thủng.</p>',
          ),
          starterCode: starter({ given: C1_GIVEN, params: '{ decideMerge }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: C1_SOLUTION,
        }),
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q26 — Pin legacy behaviour before you refactor it (chapter 10).</b> ' + c('monthlyReport(bookings, month)') + ' is old code with no tests. The office pastes its text into Excel, so the exact text <b>is</b> the behaviour. You are about to refactor it; write a characterization test (golden master) that pins what v0 prints today.</p>' +
            '<p>Choose your input rows by branch, not by habit: a Saturday and a Sunday, a <code>PENDING</code> booking, exactly 30 and 31 seats (only <b>more than</b> 30 is "large"), a <code>CANCELLED</code> booking (not counted), a booking in another month of the same year, and a month with nothing in it (<code>No bookings in 2026-10</code>). Hours are printed v0\'s way: 420 minutes is <code>7</code>, not <code>7.0</code>. Lesson 10.2: three ordinary weekday bookings covered 96% of lines and caught 3 of 10 changes; rows chosen by branch caught 10 of 10.</p>' +
            '<p>Six "refactoring slips" are planted. Pin them all.</p>',
            '<p><b>Câu 26 — Ghim hành vi của code cũ trước khi refactor (chương 10).</b> ' + c('monthlyReport(bookings, month)') + ' là code cũ chưa có test. Phòng quản lý dán đoạn chữ nó in ra vào Excel, nên từng chữ chính <b>là</b> hành vi. Bạn sắp refactor nó; hãy viết một test đặc tả (golden master) ghim điều v0 đang in ra hôm nay.</p>' +
            '<p>Chọn dòng dữ liệu theo nhánh, đừng theo thói quen: một ngày thứ Bảy và một ngày Chủ nhật, một lượt <code>PENDING</code>, đúng 30 và 31 chỗ (chỉ <b>hơn</b> 30 mới là "lớn"), một lượt <code>CANCELLED</code> (không tính), một lượt ở tháng khác cùng năm, và một tháng không có gì (<code>No bookings in 2026-10</code>). Số giờ in theo kiểu của v0: 420 phút là <code>7</code>, không phải <code>7.0</code>. Bài 10.2: ba lượt ngày thường bình thường phủ 96% dòng nhưng chỉ bắt 3/10 thay đổi; dòng chọn theo nhánh bắt được 10/10.</p>' +
            '<p>Có sáu "sơ suất khi refactor" được cài sẵn. Ghim hết.</p>',
          ),
          starterCode: starter({ given: C2_GIVEN, params: '{ monthlyReport }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: C2_SOLUTION,
        }),
      ],
    },
  ],
};
