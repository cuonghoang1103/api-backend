/**
 * Testing — Progress Test 2: Chương 4 → Chương 7 (CSDL thật, API HTTP, component React, Playwright).
 * 24 câu trắc nghiệm + 2 câu VIẾT TEST chấm bằng đột biến.
 *
 * Đề tự soạn, bám `content/courses/testing/s04…s07`; dữ kiện đo lấy nguyên từ bài, không bịa số. Hai câu
 * lập trình dựng trên code thật của LabFlow Lite: điều kiện chồng giờ của `createMemoryRepo().findOverlap`
 * (`src/booking/service.js`, khoảng nửa mở như ràng buộc EXCLUDE … '[)' của Ch4) và luật truy cập của
 * `GET /api/bookings/:id` + `/api/admin/bookings` (Ch5: 401 · 403 · 404, không lộ trường nội bộ) viết thành
 * hàm thuần `(req) → { status, body }` để chạy bằng node trần.
 * `node scripts/exam-check.mjs content/exams/TESTING-PT2.mjs` chạy thật lời giải mẫu.
 *
 * Phân bố: C4 ×6 · C5 ×6 · C6 ×6 · C7 ×6. Đáp án rải: A ×6 · B ×6 · C ×6 · D ×6.
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TESTING-PT2.mjs --apply
 */
import { B, EX, c, mcq, codeQ, starter, allKilled, ptInstructions } from './_lib/testing-exam-kit.mjs';

const Q = (pe, pv, opts, correct, ee, ev) =>
  mcq({ prompt: B(pe, pv), options: opts.map(([e, v]) => B(e, v)), correct, explanation: EX(ee, ev) });

const M6 = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

/* ─────────── Câu lập trình 1 — điều kiện chồng giờ, khoảng nửa mở (Ch4) ─────────── */

const C1_GIVEN = `
// LabFlow Lite — điều kiện của findOverlap (src/booking/service.js), cùng nghĩa với ràng buộc PostgreSQL
//   EXCLUDE USING gist (lab WITH =, tsrange(date + start_time, date + end_time, '[)') WITH &&)
// Khoảng NỬA MỞ [start, end): lượt kết thúc 10:00 và lượt bắt đầu 10:00 KHÔNG chồng nhau. Lượt CANCELLED trả chỗ.
function build(mutant) {
  function findOverlap(rows, { lab, date, start, end }) {
    return rows.find((b) => {
      if (b.status === 'CANCELLED' && mutant !== 'M5') return false;
      const sameLab = mutant === 'M3' ? true : b.lab === lab;
      const sameDay = mutant === 'M4' ? true : b.date === date;
      const overlaps =
        mutant === 'M1' ? b.start <= end && start < b.end
        : mutant === 'M2' ? b.start < end && start <= b.end
        : mutant === 'M6' ? b.start >= start && b.start < end
        : b.start < end && start < b.end;
      return sameLab && sameDay && overlaps;
    }) || null;
  }
  return { findOverlap };
}
`;

const C1_SOLUTION = `function suite(test, expect, { findOverlap }) {
  // Một lượt có sẵn: BE-201, 16/11, 09:00–11:00. Bảng "hàng xóm" quanh nó (bài 4.5): chạm biên, lệch một nửa, bao trùm, lab khác, ngày khác.
  const rows = [{ id: 1, lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00', status: 'CONFIRMED' }];
  const ask = (start, end, lab = 'BE-201', date = '2026-11-16') => findOverlap(rows, { lab, date, start, end });

  test.each([
    ['07:00', '09:00', null],   // kết thúc đúng lúc lượt kia bắt đầu — nối tiếp, được phép (M1)
    ['11:00', '12:00', null],   // bắt đầu đúng lúc lượt kia kết thúc — được phép (M2)
    ['08:00', '10:00', 1],      // bắt đầu TRƯỚC, kết thúc bên trong — vẫn là chồng (M6)
    ['10:00', '12:00', 1],      // bắt đầu bên trong
    ['08:00', '12:00', 1],      // bao trùm
    ['09:30', '10:30', 1],      // nằm gọn bên trong
  ])('BE-201 %s–%s against 09:00–11:00', (start, end, id) => {
    const clash = ask(start, end);
    expect(clash === null ? null : clash.id).toBe(id);
  });

  test('another lab or another day never blocks the slot', () => {
    expect(ask('09:00', '11:00', 'BE-305')).toBeNull();                 // M3: lab bị bỏ khỏi điều kiện
    expect(ask('09:00', '11:00', 'BE-201', '2026-11-17')).toBeNull();   // M4: ngày bị bỏ
  });

  test('a CANCELLED booking frees its slot', () => {
    const cancelled = [{ ...rows[0], status: 'CANCELLED' }];
    expect(findOverlap(cancelled, { lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00' })).toBeNull();
  });
}`;

/* ─────────── Câu lập trình 2 — luật truy cập của API (Ch5) ─────────── */

const C2_GIVEN = `
// LabFlow Lite — luật của GET /api/bookings/:id và GET /api/admin/bookings (Ch5), viết thành hàm thuần
// (req) → { status, body } để chạy bằng node. req.user là danh tính lấy từ TOKEN (null = chưa đăng nhập);
// req.params.id là CHUỖI như Express đưa. Phản hồi chỉ gồm các trường công khai — không bao giờ lộ userId.
function build(mutant) {
  const rows = [
    { id: 1, userId: 'an', lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', status: 'CONFIRMED' },
    { id: 2, userId: 'binh', lab: 'BE-305', date: '2026-11-17', start: '13:00', end: '15:00', status: 'PENDING' },
  ];
  const publicView = (b) => mutant === 'M3' ? { ...b } : { id: b.id, lab: b.lab, date: b.date, start: b.start, end: b.end, status: b.status };
  const unauth = () => ({ status: mutant === 'M5' ? 404 : 401, body: { code: 'UNAUTHENTICATED' } });
  function getBooking(req) {
    if (!req.user) return unauth();
    const id = mutant === 'M6' ? req.params.id : Number(req.params.id);
    const b = rows.find((r) => r.id === id);
    const mine = b && (b.userId === req.user.id || (mutant !== 'M4' && req.user.role === 'ADMIN'));
    if (!b) return { status: 404, body: { code: 'NOT_FOUND' } };
    if (!mine) return mutant === 'M1' ? { status: 403, body: { code: 'FORBIDDEN' } } : { status: 404, body: { code: 'NOT_FOUND' } };
    return { status: 200, body: publicView(b) };
  }
  function listAllBookings(req) {
    if (!req.user) return unauth();
    if (req.user.role !== 'ADMIN') return mutant === 'M2' ? { status: 401, body: { code: 'UNAUTHENTICATED' } } : { status: 403, body: { code: 'FORBIDDEN' } };
    return { status: 200, body: rows.map(publicView) };
  }
  return { getBooking, listAllBookings };
}
`;

const C2_SOLUTION = `function suite(test, expect, { getBooking, listAllBookings }) {
  const an = { id: 'an', role: 'STUDENT' };
  const binh = { id: 'binh', role: 'STUDENT' };
  const lecturer = { id: 'gv', role: 'LECTURER' };
  const admin = { id: 'root', role: 'ADMIN' };
  const one = { id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', status: 'CONFIRMED' };

  // Bảng phân quyền (bài 5.2): mỗi vai × dữ liệu của mình / của người khác — kiểm ĐÚNG mã, không phải khoảng.
  test('the owner gets 200 with exactly the public fields (no userId leak)', () => {
    expect(getBooking({ user: an, params: { id: '1' } })).toEqual({ status: 200, body: one });
  });
  test("another student gets 404, exactly like a missing booking (IDOR)", () => {
    expect(getBooking({ user: binh, params: { id: '1' } })).toEqual({ status: 404, body: { code: 'NOT_FOUND' } });
    expect(getBooking({ user: binh, params: { id: '99' } })).toEqual({ status: 404, body: { code: 'NOT_FOUND' } });
  });
  test('an admin may read any booking', () => {
    expect(getBooking({ user: admin, params: { id: '2' } }).status).toBe(200);
  });
  test('no token is 401 on both routes', () => {
    expect(getBooking({ user: null, params: { id: '1' } }).status).toBe(401);
    expect(listAllBookings({ user: null }).status).toBe(401);
  });
  test('a lecturer on the admin route is 403 — known identity, action not allowed', () => {
    expect(listAllBookings({ user: lecturer })).toEqual({ status: 403, body: { code: 'FORBIDDEN' } });
    expect(listAllBookings({ user: admin }).body).toHaveLength(2);
  });
}`;

const questions = [
  /* ══════════════ Chương 4 — CSDL thật ══════════════ */
  Q(`Without any constraint, two concurrent bookLab calls for BE-201 at 08:00 on real PostgreSQL both succeed. What is the root cause?`,
    `Khi chưa có ràng buộc nào, hai lời gọi bookLab đồng thời cho BE-201 lúc 08:00 trên PostgreSQL thật đều thành công. Nguyên nhân gốc là gì?`,
    [['PostgreSQL cannot handle concurrent writes safely.', 'PostgreSQL không xử lý an toàn được các lần ghi đồng thời.'],
     ['The connection pool is too small.', 'Pool kết nối quá nhỏ.'],
     ['Check-then-insert is not atomic: both checks ran before either insert.', 'Kiểm-rồi-chèn không nguyên tử: cả hai lần kiểm chạy trước khi bên nào chèn.'],
     ['The test forgot to await one of the calls.', 'Test quên await một trong hai lời gọi.']],
    2,
    `Each request asks "is it free?" on its own connection, both see an empty slot, both insert — chapter 2's race reproduced on PostgreSQL (lesson 4.1). The database handles concurrency fine; it was never told the rule. An exclusion constraint makes the database itself refuse the second.`,
    `Mỗi request hỏi "còn trống không?" trên kết nối riêng, cả hai thấy trống, cả hai chèn — tranh chấp của chương 2 tái hiện trên PostgreSQL (bài 4.1). CSDL xử lý đồng thời ổn; chỉ là chưa ai nói luật cho nó. Ràng buộc exclusion khiến chính CSDL từ chối lượt thứ hai.`),

  Q(`After adding the exclusion constraint, the losing booking of the race test is STORAGE_DOWN instead of OVERLAP, although the adapter maps 23P01 correctly. Where is the bug?`,
    `Sau khi thêm ràng buộc exclusion, lượt thua trong test tranh chấp là STORAGE_DOWN thay vì OVERLAP, dù adapter đã ánh xạ 23P01 đúng. Bug nằm ở đâu?`,
    [["bookLab's catch around insert rewraps the adapter's BookingError('OVERLAP') as STORAGE_DOWN.", "Khối catch quanh insert của bookLab bọc lại BookingError('OVERLAP') của adapter thành STORAGE_DOWN."],
     ['The constraint is missing on the test database.', 'Test database thiếu ràng buộc.'],
     ['PostgreSQL returns 23505 for exclusion violations.', 'PostgreSQL trả 23505 cho vi phạm exclusion.'],
     ['The test should expect STORAGE_DOWN.', 'Test nên mong STORAGE_DOWN.']],
    0,
    `Lesson 2.3 turned every insert failure into STORAGE_DOWN; chapter 4 adds one line before it: <code>if (err instanceof BookingError) throw err;</code> — exactly Lab 4 mutant #8. If the constraint were missing, both bookings would succeed instead; 23P01 is the exclusion-violation code.`,
    `Bài 2.3 biến mọi lỗi insert thành STORAGE_DOWN; chương 4 thêm một dòng ngay trước: <code>if (err instanceof BookingError) throw err;</code> — đúng đột biến #8 của Lab 4. Nếu thiếu ràng buộc thì cả hai lượt đều thành công; 23P01 mới là mã vi phạm exclusion.`),

  Q(`Why start the test database with ${c('docker compose up -d --wait')} and a pg_isready healthcheck rather than ${c('up -d && sleep 5')}?`,
    `Vì sao bật test database bằng ${c('docker compose up -d --wait')} kèm healthcheck pg_isready thay vì ${c('up -d && sleep 5')}?`,
    [['--wait also applies the schema.', '--wait còn áp luôn schema.'],
     ['It returns exactly when PostgreSQL accepts connections.', 'Nó trả về đúng lúc PostgreSQL bắt đầu nhận kết nối.'],
     ['sleep is not available on CI runners.', 'CI runner không có lệnh sleep.'],
     ['--wait makes the container use tmpfs.', '--wait khiến container dùng tmpfs.']],
    1,
    `A fixed sleep is either too long (startup measured 2.1 s) or too short on a slow runner, which gives flaky "connection refused" (lesson 4.2). The schema is applied by the global setup, not by Compose; tmpfs is a separate setting.`,
    `Ngủ cố định thì hoặc quá dài (đo khởi động 2,1 s), hoặc quá ngắn trên runner chậm, sinh lỗi chập chờn "connection refused" (bài 4.2). Schema do global setup áp, không phải Compose; tmpfs là một thiết lập riêng.`),

  Q(`Test B passes alone but fails with OVERLAP when it runs after test A in the same file; both book BE-201 at 08:00 on the real database. Best fix?`,
    `Test B qua khi chạy riêng nhưng đỏ với OVERLAP khi chạy sau test A trong cùng file; cả hai đặt BE-201 lúc 08:00 trên CSDL thật. Cách sửa tốt nhất?`,
    [['Reorder the tests so B runs first.', 'Đổi thứ tự để B chạy trước.'],
     ['Mark B it.fails with a comment.', 'Đánh dấu B là it.fails kèm chú thích.'],
     ['Run the file with --retry=1.', 'Chạy file với --retry=1.'],
     ['TRUNCATE the bookings table in beforeEach.', 'TRUNCATE bảng bookings trong beforeEach.']],
    3,
    `Both tests are correct; the leftover row is the problem — rows leak between tests exactly like mocks do (lesson 4.4). Reordering hides the dependency until someone adds a test; it.fails would document a bug that does not exist.`,
    `Cả hai test đều đúng; dòng còn sót mới là vấn đề — dữ liệu rò giữa các test y như mock rò (bài 4.4). Đổi thứ tự chỉ giấu sự phụ thuộc tới khi có người thêm test; it.fails sẽ ghi nhận một bug không tồn tại.`),

  Q(`What does putting PostgreSQL's data directory on tmpfs give a disposable test database?`,
    `Đặt thư mục dữ liệu của PostgreSQL lên tmpfs mang lại gì cho một test database dùng một lần?`,
    [['Data that survives container restarts.', 'Dữ liệu sống sót qua các lần khởi động lại container.'],
     ['Automatic schema migrations.', 'Tự động chạy migration schema.'],
     ['Faster writes, and nothing left behind when it stops.', 'Ghi nhanh hơn, và không để lại gì khi container dừng.'],
     ['Isolation between parallel test files.', 'Cô lập giữa các file test chạy song song.']],
    2,
    `2000 single-row inserts took about 0.67 s on tmpfs and 0.85 s on a Docker volume in the course's measurement (lesson 4.2). The gap depends on the disk. Surviving restarts is the opposite of tmpfs — and exactly what test data does not need.`,
    `2000 lần chèn một dòng mất khoảng 0,67 s trên tmpfs và 0,85 s trên volume Docker theo phép đo của khoá (bài 4.2). Chênh lệch tuỳ ổ đĩa. Sống qua khởi động lại là điều ngược với tmpfs — và đúng là thứ dữ liệu test không cần.`),

  Q(`For Lab 4, why is "replace ${c("'lab = $1 AND'")} by ${c("'$1::text IS NOT NULL AND'")}" a better mutant than deleting ${c("'lab = $1 AND'")}?`,
    `Ở Lab 4, vì sao "thay ${c("'lab = $1 AND'")} bằng ${c("'$1::text IS NOT NULL AND'")}" là đột biến tốt hơn việc xoá ${c("'lab = $1 AND'")}?`,
    [['The query stays valid; only the lab filter disappears.', 'Câu truy vấn vẫn hợp lệ; chỉ có bộ lọc lab biến mất.'],
     ['It runs faster on PostgreSQL.', 'Nó chạy nhanh hơn trên PostgreSQL.'],
     ['Deleting text is not allowed by Stryker.', 'Stryker không cho phép xoá chữ.'],
     ['It changes the SQLSTATE code returned.', 'Nó đổi mã SQLSTATE trả về.']],
    0,
    `With the deletion, $1 is no longer used and the query fails as a whole, so any test "kills" it — for a syntax reason. Measured: even the weak three-test suite killed the deletion, and let the replacement survive. A mutant should change behaviour, not break syntax (lesson 4.5).`,
    `Khi xoá, $1 không còn được dùng và cả câu truy vấn hỏng, nên test nào cũng "diệt" được — vì lý do cú pháp. Đo được: ngay bộ ba test yếu cũng diệt bản xoá, nhưng để bản thay thế sống. Đột biến nên đổi hành vi, không phá cú pháp (bài 4.5).`),

  /* ══════════════ Chương 5 — API HTTP ══════════════ */
  Q(`Why does LabFlow Lite export ${c('createApp()')} and call ${c('app.listen()')} only in main.js?`,
    `Vì sao LabFlow Lite export ${c('createApp()')} và chỉ gọi ${c('app.listen()')} trong main.js?`,
    [['Express 5 forbids listen inside a factory.', 'Express 5 cấm gọi listen bên trong factory.'],
     ['So each test can build a fresh, fully controlled app.', 'Để mỗi test dựng được một app mới, kiểm soát hoàn toàn.'],
     ['To make the production bundle smaller.', 'Để gói production nhỏ hơn.'],
     ['Because Supertest only accepts URLs.', 'Vì Supertest chỉ nhận URL.']],
    1,
    `A factory lets every test start from a clean, fully controlled app (memory repository, test secret, fixed clock); request(app) opens and closes a temporary port by itself (lesson 5.1). Express still supports listen anywhere, and Supertest also accepts an app.`,
    `Factory cho mỗi test bắt đầu từ một app sạch, kiểm soát được hoàn toàn (repository trong bộ nhớ, secret của test, đồng hồ cố định); request(app) tự mở và đóng một cổng tạm (bài 5.1). Express vẫn cho listen ở đâu cũng được, và Supertest nhận cả app.`),

  Q(`A test signs a token "now" with a 1-second lifetime and waits 1.5 s to check expiry. It is slow and sometimes fails on CI. Best fix?`,
    `Một test ký token "ngay bây giờ" với thời hạn 1 giây rồi chờ 1,5 s để kiểm hết hạn. Nó chậm và thỉnh thoảng đỏ trên CI. Cách sửa tốt nhất?`,
    [['Wait 3 seconds instead of 1.5 to be safe.', 'Chờ 3 giây thay vì 1,5 cho chắc.'],
     ['Mock the jose library so verify always fails.', 'Mock thư viện jose để verify luôn thất bại.'],
     ['Retry the test twice on CI.', 'Cho test chạy lại hai lần trên CI.'],
     ['Inject a fixed clock and move it past the expiry.', 'Tiêm một đồng hồ cố định rồi đẩy nó qua mốc hết hạn.']],
    3,
    `Time is an input (lesson 2.2 again). With a controlled clock the test is instant and can check the boundary: 09:59:59 valid, 10:00:00 refused (lesson 5.2). Mocking jose tests the mock, not the expiry check; longer waits and retries only hide the problem.`,
    `Thời gian là đầu vào (lại bài 2.2). Với đồng hồ kiểm soát được, test chạy tức thì và kiểm được biên: 09:59:59 còn hạn, 10:00:00 bị từ chối (bài 5.2). Mock jose là test cái mock, không phải phép kiểm hạn; chờ lâu hơn hay retry chỉ giấu vấn đề.`),

  Q(`A client sends ${c('"role": "ADMIN"')} in the body of POST /api/bookings. The schema is ${c('z.object')}, not ${c('z.strictObject')}. What happens, and what should happen?`,
    `Một client gửi ${c('"role": "ADMIN"')} trong body của POST /api/bookings. Schema là ${c('z.object')}, không phải ${c('z.strictObject')}. Chuyện gì xảy ra, và lẽ ra phải ra sao?`,
    [['The booking is made as ADMIN; it should be 403.', 'Lượt đặt được tạo với vai ADMIN; lẽ ra phải 403.'],
     ['The request fails with 500; it should be 422.', 'Request đỏ với 500; lẽ ra phải 422.'],
     ['The key is silently dropped and it succeeds; it should be refused with 400.', 'Khoá bị lặng lẽ bỏ đi và request thành công; lẽ ra phải bị từ chối với 400.'],
     ['Zod throws at startup; it should log a warning.', 'Zod ném lỗi lúc khởi động; lẽ ra chỉ cần ghi cảnh báo.']],
    2,
    `z.object strips unknown keys — safe today, but silent; a later change that spreads the body into the row would turn it into privilege escalation (lesson 5.3). strictObject refuses with 400 "Unrecognized key", which a test can pin down. The role always comes from the token.`,
    `z.object bỏ khoá lạ — hôm nay an toàn nhưng im lặng; một thay đổi sau này trải body vào dòng dữ liệu sẽ biến nó thành leo thang đặc quyền (bài 5.3). strictObject từ chối với 400 "Unrecognized key", điều một test ghim lại được. Vai luôn lấy từ token.`),

  Q(`Which status code fits each case in LabFlow Lite's error format: (1) seats is the string "thirty", (2) the slot is already taken, (3) PostgreSQL is down?`,
    `Mã trạng thái nào hợp với từng ca trong định dạng lỗi của LabFlow Lite: (1) seats là chuỗi "thirty", (2) khung giờ đã có người đặt, (3) PostgreSQL sập?`,
    [['400 · 409 · 503', '400 · 409 · 503'],
     ['422 · 400 · 500', '422 · 400 · 500'],
     ['400 · 422 · 500', '400 · 422 · 500'],
     ['422 · 409 · 502', '422 · 409 · 502']],
    0,
    `Lesson 5.3: 400 malformed · 422 against a rule · 409 conflict with existing data · 503 a dependency is down · 500 our own bug. Each is a different instruction to the client: fix the form, pick another slot, try again later.`,
    `Bài 5.3: 400 sai dạng · 422 phạm luật · 409 xung đột với dữ liệu đang có · 503 một phụ thuộc đang sập · 500 bug của chính ta. Mỗi mã là một chỉ dẫn khác cho client: sửa form, chọn khung khác, thử lại sau.`),

  Q(`A handler sends ${c('res.json(booking)')} — the stored row, including userId and role. The test asserts ${c("expect(res.body).toMatchObject({ lab: 'BE-201', seats: 30 })")}. What is true?`,
    `Một handler gửi ${c('res.json(booking)')} — nguyên dòng đã lưu, kèm userId và role. Test khẳng định ${c("expect(res.body).toMatchObject({ lab: 'BE-201', seats: 30 })")}. Câu nào đúng?`,
    [['The test fails because of the extra keys.', 'Test đỏ vì có khoá thừa.'],
     ['It stays green: toMatchObject ignores the extra keys.', 'Nó vẫn xanh: toMatchObject bỏ qua các khoá thừa.'],
     ['Supertest strips unknown fields automatically.', 'Supertest tự bỏ các trường lạ.'],
     ['The leak is harmless because the frontend ignores it.', 'Chỗ lộ vô hại vì frontend bỏ qua.']],
    1,
    `toMatchObject only checks the listed keys, by design. A leak is extra data, so only an assertion that forbids extra data can see it (lesson 5.4). Whatever the frontend shows, the data is in every response anyone can read with DevTools.`,
    `toMatchObject chỉ kiểm các khoá được liệt kê, theo thiết kế. Lộ dữ liệu là có dữ liệu THỪA, nên chỉ khẳng định cấm dữ liệu thừa mới thấy (bài 5.4). Frontend hiện gì cũng vậy, dữ liệu vẫn nằm trong mọi phản hồi mà ai mở DevTools cũng đọc được.`),

  Q(`When is a consumer-driven contract tool such as Pact worth its cost over a checked OpenAPI file?`,
    `Khi nào một công cụ hợp đồng hướng người dùng như Pact đáng chi phí hơn một file OpenAPI được kiểm?`,
    [['Always — OpenAPI cannot be tested.', 'Luôn luôn — OpenAPI không test được.'],
     ['When one team has one web client.', 'Khi một đội có một client web.'],
     ['Never — Supertest covers the same ground.', 'Không bao giờ — Supertest phủ y như vậy.'],
     ['When several teams or clients depend on one API.', 'Khi nhiều đội hoặc nhiều client cùng phụ thuộc một API.']],
    3,
    `Pact records what each client really sends and reads, and the provider replays it — powerful across teams, at the cost of a broker and a workflow (lesson 5.4). For one team with one client, a checked OpenAPI file is the cheap first step; both complement the chapter's API tests.`,
    `Pact ghi lại thứ mỗi client thật sự gửi và đọc, rồi phía cung cấp chạy lại — mạnh khi có nhiều đội, đổi lại cần broker và một quy trình (bài 5.4). Với một đội một client, file OpenAPI được kiểm là bước đầu rẻ; cả hai bổ sung cho các test API của chương.`),

  /* ══════════════ Chương 6 — React ══════════════ */
  Q(`Which Testing Library query should a test try first to find the Book button?`,
    `Truy vấn Testing Library nào test nên thử đầu tiên để tìm nút Book?`,
    [[`${c("getByRole('button', { name: 'Book' })")}`, `${c("getByRole('button', { name: 'Book' })")}`],
     [`${c("getByTestId('book-button')")}`, `${c("getByTestId('book-button')")}`],
     [`${c("container.querySelector('.btn-primary')")}`, `${c("container.querySelector('.btn-primary')")}`],
     [`${c("getByText('Book')")}`, `${c("getByText('Book')")}`]],
    0,
    `Role plus accessible name is how assistive technology identifies a button, so it is first in Testing Library's priority (lesson 6.1). getByText would also match any element with that text; test ids and CSS classes are invisible to users and keep passing when the button loses its name.`,
    `Vai cộng tên truy cập được là cách công nghệ hỗ trợ nhận ra một nút, nên nó đứng đầu thứ tự ưu tiên của Testing Library (bài 6.1). getByText khớp cả phần tử nào có chữ đó; test id và lớp CSS vô hình với người dùng và vẫn qua khi nút mất tên.`),

  Q(`Two tests in one file render the booking form; the second fails with "Found multiple elements with the role button and name Book". The project runs Vitest without globals. Fix?`,
    `Hai test trong một file cùng render form đặt lịch; test thứ hai đỏ với "Found multiple elements with the role button and name Book". Dự án chạy Vitest không bật globals. Sửa thế nào?`,
    [['Use getAllByRole(...)[1] in the second test.', 'Dùng getAllByRole(...)[1] trong test thứ hai.'],
     ['Register afterEach(cleanup) once in the web setup file.', 'Đăng ký afterEach(cleanup) một lần trong file setup của web.'],
     ['Switch from jsdom to happy-dom.', 'Đổi từ jsdom sang happy-dom.'],
     ['Run the two tests in separate files.', 'Tách hai test ra hai file.']],
    1,
    `Testing Library auto-cleans only through a global afterEach; without globals nothing unmounts the first form (lesson 6.1). getAllByRole(...)[1] makes the line pass while the leftover keeps contaminating later tests; separate files only move the problem.`,
    `Testing Library chỉ tự dọn qua một afterEach toàn cục; không bật globals thì không gì gỡ form thứ nhất (bài 6.1). getAllByRole(...)[1] làm dòng đó qua nhưng phần còn sót tiếp tục làm bẩn các test sau; tách file chỉ dời vấn đề đi chỗ khác.`),

  Q(`getBy, queryBy and findBy differ in one thing. Which pairing is right?`,
    `getBy, queryBy và findBy khác nhau ở một điểm. Cặp ghép nào đúng?`,
    [['getBy waits, queryBy throws, findBy returns null.', 'getBy chờ, queryBy ném lỗi, findBy trả null.'],
     ['All three wait up to one second.', 'Cả ba đều chờ tối đa một giây.'],
     ['getBy must be there, queryBy may be absent, findBy will appear.', 'getBy phải có mặt, queryBy có thể vắng, findBy sẽ xuất hiện.'],
     ['queryBy is the async one; the other two are synchronous.', 'queryBy là cái bất đồng bộ; hai cái kia đồng bộ.']],
    2,
    `Lesson 6.1: getBy throws when the element is missing, queryBy returns null so you can assert absence, findBy returns a promise that waits for the element — and must be awaited, or a truthy promise makes the test green.`,
    `Bài 6.1: getBy ném lỗi khi thiếu phần tử, queryBy trả null để bạn khẳng định sự vắng mặt, findBy trả một promise chờ phần tử — và phải được await, nếu không một promise truthy làm test xanh.`),

  Q(`In a jsdom test the client calls ${c("fetch('/api/admin/bookings')")} with no base URL, and the screen shows "Could not load the bookings." What is wrong?`,
    `Trong một test jsdom, client gọi ${c("fetch('/api/admin/bookings')")} không có base URL, và màn hình hiện "Could not load the bookings." Sai ở đâu?`,
    [['MSW has no handler for the route.', 'MSW không có handler cho tuyến đó.'],
     ['The admin API returned 403.', 'API admin trả 403.'],
     ['jsdom blocks fetch by default.', 'jsdom chặn fetch theo mặc định.'],
     ["Node's fetch cannot resolve a relative URL.", 'fetch của Node không phân giải được URL tương đối.']],
    3,
    `Measured in lesson 6.3: "Failed to parse URL" — the request never left, so neither MSW nor the API saw it. In a browser the same path is resolved against the page address. Pass fetch and the base URL into the client so tests can control both.`,
    `Đo ở bài 6.3: "Failed to parse URL" — request chưa hề đi, nên cả MSW lẫn API đều không thấy. Trong trình duyệt, cùng đường dẫn đó được phân giải theo địa chỉ trang. Truyền fetch và base URL vào client để test kiểm soát được cả hai.`),

  Q(`The MSW tests pass in jsdom but fail in happy-dom: "intercepted a request without a matching request handler: OPTIONS http://api.test/…". Why?`,
    `Các test MSW qua trong jsdom nhưng đỏ trong happy-dom: "intercepted a request without a matching request handler: OPTIONS http://api.test/…". Vì sao?`,
    [['happy-dom applies CORS and sends a preflight OPTIONS.', 'happy-dom áp CORS và gửi một preflight OPTIONS.'],
     ['happy-dom does not support fetch.', 'happy-dom không hỗ trợ fetch.'],
     ['The client code sends OPTIONS instead of GET.', 'Code client gửi OPTIONS thay vì GET.'],
     ['MSW is incompatible with Vitest workers.', 'MSW không tương thích với worker của Vitest.']],
    0,
    `The test page is http://localhost:3000 and the API is http://api.test — another origin. jsdom tests use Node's fetch, which has no CORS (lesson 6.3). Fix: call the same origin, or answer OPTIONS in MSW — both verified in the lesson.`,
    `Trang test là http://localhost:3000 còn API là http://api.test — khác origin. Test jsdom dùng fetch của Node, vốn không có CORS (bài 6.3). Sửa: gọi cùng origin, hoặc trả lời OPTIONS trong MSW — bài đã kiểm cả hai cách.`),

  Q(`How should a unit test check the Next.js route handler ${c('app/api/slots/route.js')}?`,
    `Unit test nên kiểm route handler Next.js ${c('app/api/slots/route.js')} thế nào?`,
    [['Start next dev and call it with Supertest.', 'Bật next dev rồi gọi bằng Supertest.'],
     ['Call GET(new Request(…)) in the node environment and check the Response.', 'Gọi GET(new Request(…)) trong môi trường node và kiểm Response.'],
     ['Mock Response and check that json() was called.', 'Mock Response và kiểm json() đã được gọi.'],
     ['Render it with Testing Library.', 'Render nó bằng Testing Library.']],
    1,
    `A route handler is a function from Request to Response, so a unit test can call it directly — milliseconds, no server (lesson 6.4); let MSW play the upstream API. Starting next dev belongs to end-to-end tests; mocking Response tests the mock instead of the real status and body.`,
    `Route handler là một hàm từ Request sang Response, nên unit test gọi thẳng được — vài mili giây, không cần server (bài 6.4); để MSW đóng vai API phía sau. Bật next dev là việc của test end-to-end; mock Response là test cái mock thay vì status và body thật.`),

  /* ══════════════ Chương 7 — Playwright ══════════════ */
  Q(`${c("page.getByLabel('Lab').fill('BE-305')")} fails with a strict mode violation: 2 elements. The page has one input labelled Lab and a form named "Book a lab". Fix?`,
    `${c("page.getByLabel('Lab').fill('BE-305')")} đỏ vì vi phạm strict mode: 2 phần tử. Trang có một ô nhãn Lab và một form tên "Book a lab". Sửa thế nào?`,
    [['Use .first() so the input is picked.', 'Dùng .first() để chọn ô nhập.'],
     ['Wait longer before filling.', 'Chờ lâu hơn trước khi điền.'],
     [`Add ${c('{ exact: true }')} to the locator.`, `Thêm ${c('{ exact: true }')} vào locator.`],
     ['Disable strict mode in the config.', 'Tắt strict mode trong cấu hình.']],
    2,
    `getByLabel matches part of a name, ignoring case, so "Book a lab" matches too (lesson 7.1). Strict mode refuses to guess; .first() guesses an order and breaks silently the day the form moves. Both elements already exist, so waiting cannot help.`,
    `getByLabel khớp một phần tên, không phân biệt hoa thường, nên "Book a lab" cũng khớp (bài 7.1). Strict mode từ chối đoán; .first() là đoán thứ tự và sẽ hỏng âm thầm vào ngày form đổi chỗ. Cả hai phần tử đã có sẵn, nên chờ không giúp gì.`),

  Q(`A change breaks every login. The suite has a setup project (auth.setup.js) and chromium has ${c("dependencies: ['setup']")}. What does ${c('npm run test:e2e')} report?`,
    `Một thay đổi làm hỏng mọi lần đăng nhập. Bộ test có setup project (auth.setup.js) và chromium có ${c("dependencies: ['setup']")}. ${c('npm run test:e2e')} báo gì?`,
    [['Nine failed tests, all with the same timeout.', 'Chín test đỏ, cùng một lỗi hết giờ.'],
     ['All green, because yesterday\'s session file is reused.', 'Xanh hết, vì file phiên của hôm qua được dùng lại.'],
     ['Only the first dependent test fails.', 'Chỉ test phụ thuộc đầu tiên đỏ.'],
     ['Two failed (the setup sign-ins) and "7 did not run".', 'Hai test đỏ (đăng nhập ở setup) và "7 did not run".']],
    3,
    `Measured in lesson 7.2: both setup tests failed on the line waiting for "Signed in as", and the seven dependent tests did not run — one cause, one clear place. Setup writes the session fresh on every run, so nothing from yesterday is reused.`,
    `Đo ở bài 7.2: cả hai test setup đỏ ở dòng chờ "Signed in as", và bảy test phụ thuộc không chạy — một nguyên nhân, một chỗ rõ ràng. Setup ghi phiên mới mỗi lần chạy, nên không có gì của hôm qua được dùng lại.`),

  Q(`Lesson 7.2 measured signing in through the form at 247–314 ms per test and reusing a saved session at 289–324 ms. What is the right conclusion?`,
    `Bài 7.2 đo đăng nhập qua form mất 247–314 ms mỗi test và dùng lại phiên đã lưu mất 289–324 ms. Kết luận đúng là gì?`,
    [['storageState is always slower and should be removed.', 'storageState luôn chậm hơn và nên bỏ.'],
     ['Here it saves no time; keep it for slow, external or rate-limited logins and for one clear failure.', 'Ở đây nó không tiết kiệm thời gian; giữ nó cho đăng nhập chậm, bên ngoài hay bị giới hạn tần suất, và cho một lỗi rõ ràng.'],
     ['Logging in through the form is the recommended way for every test.', 'Đăng nhập qua form là cách được khuyên cho mọi test.'],
     ['The measurement proves Playwright caches logins.', 'Phép đo chứng minh Playwright có cache đăng nhập.']],
    1,
    `A measurement answers a question about this project: the demo login is almost free, so reuse wins nothing. The reasons for storageState are bcrypt-style hashing, SSO, a second factor, lock-outs like BR-02, and failures that point at the login only.`,
    `Phép đo trả lời câu hỏi về chính dự án này: đăng nhập demo gần như miễn phí, nên dùng lại chẳng được gì. Lý do để dùng storageState là băm kiểu bcrypt, SSO, xác thực hai lớp, khoá tài khoản kiểu BR-02, và lỗi chỉ thẳng vào đăng nhập.`),

  Q(`The CI summary shows "1 flaky" for a booking test: it failed, then passed on retry #1. What should the team do?`,
    `Tóm tắt CI ghi "1 flaky" cho một test đặt lịch: nó đỏ, rồi qua ở lần chạy lại #1. Đội nên làm gì?`,
    [['Treat it as a bug: read the failed attempt and fix the cause.', 'Coi nó là bug: đọc lần chạy đỏ rồi sửa nguyên nhân.'],
     ['Nothing — it passed, so CI is green.', 'Không làm gì — nó đã qua, CI xanh.'],
     ['Raise retries to 5 so it never shows up again.', 'Tăng retries lên 5 cho nó không hiện ra nữa.'],
     ['Delete the test; flaky tests are worthless.', 'Xoá test; test chập chờn là vô giá trị.']],
    0,
    `Playwright reports a pass-on-retry as flaky precisely so it is not mistaken for green (lesson 7.3). The cause is data, waits, order, environment or a real race — the double booking of 7.3 would pass on retry and ship. --fail-on-flaky-tests can make such runs fail.`,
    `Playwright báo "qua khi chạy lại" là flaky chính để nó không bị nhầm là xanh (bài 7.3). Nguyên nhân là dữ liệu, chờ đợi, thứ tự, môi trường hoặc một tranh chấp thật — lỗi đặt trùng ở 7.3 sẽ qua khi chạy lại và lọt lên production. --fail-on-flaky-tests có thể đánh đỏ những lượt như vậy.`),

  Q(`A test expects "Booked. See you in TR-701." and fails. Its error-context.md shows the status "Sent. A lecturer must approve this booking." The test books 31 seats as student An. What is the fix?`,
    `Một test mong "Booked. See you in TR-701." và đỏ. error-context.md của nó cho thấy status "Sent. A lecturer must approve this booking." Test đặt 31 chỗ với vai sinh viên An. Sửa thế nào?`,
    [['Add a longer timeout to the assertion.', 'Thêm timeout dài hơn cho khẳng định.'],
     ['Retry the test until the confirmed message appears.', 'Chạy lại test tới khi thông báo xác nhận xuất hiện.'],
     ['Fix the expectation: 31 student seats need approval (BR-06).', 'Sửa kỳ vọng: 31 chỗ của sinh viên thì cần duyệt (BR-06).'],
     ['Reset the database before the test.', 'Đặt lại CSDL trước test.']],
    2,
    `The snapshot shows the page answered — with a different message chosen by the business rule (lesson 7.3). Waiting or retrying cannot change a deterministic answer. Read the evidence before guessing: here it names the cause in one line.`,
    `Ảnh chụp cho thấy trang đã trả lời — bằng một thông báo khác do luật nghiệp vụ chọn (bài 7.3). Chờ hay chạy lại không đổi được một câu trả lời tất định. Đọc bằng chứng trước khi đoán: ở đây nó nêu nguyên nhân trong một dòng.`),

  Q(`Why does the course say "keep e2e tests few: journeys and wiring, not rules"?`,
    `Vì sao khoá nói "giữ test e2e ít thôi: hành trình và mối nối, không phải luật"?`,
    [['Because Playwright cannot check business rules.', 'Vì Playwright không kiểm được luật nghiệp vụ.'],
     ['Because e2e tests cannot run in CI.', 'Vì test e2e không chạy được trên CI.'],
     ['Because browsers are not deterministic at all.', 'Vì trình duyệt hoàn toàn không tất định.'],
     ['They are slow; a unit test checks a rule faster and more precisely.', 'Chúng chậm; unit test kiểm một luật nhanh và chính xác hơn.']],
    3,
    `Lessons 7.1 and 7.4: e2e tests prove that the assembled app works for a user, at the cost of seconds and more ways to fail. Spend them on whole journeys; put the 31-seat boundary in a unit table where it runs in microseconds and names the rule when red.`,
    `Bài 7.1 và 7.4: test e2e chứng minh ứng dụng đã ráp chạy được cho người dùng, đổi lại tốn vài giây và có nhiều cách để hỏng. Hãy tiêu chúng cho hành trình trọn vẹn; đặt biên 31 chỗ vào bảng unit, nơi nó chạy trong vài micro giây và nêu đúng tên luật khi đỏ.`),
];

export default {
  course: { slug: 'testing' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4–7 (a real database, HTTP APIs, React components, Playwright)',
        'Kiểm tra tiến độ 2 — Chương 4–7 (CSDL thật, API HTTP, component React, Playwright)',
      ),
      description: B(
        'The middle of the Testing course: races and exclusion constraints on real PostgreSQL, Compose and Testcontainers, isolation; Supertest, 401/403/404, validation and contracts; Testing Library queries, async UI and MSW; Playwright locators, setup projects and flaky tests. 24 multiple-choice questions plus 2 questions where you write a test suite that must kill planted mutants.',
        'Phần giữa của khoá Testing: tranh chấp và ràng buộc exclusion trên PostgreSQL thật, Compose và Testcontainers, cô lập; Supertest, 401/403/404, kiểm dữ liệu vào và hợp đồng; truy vấn Testing Library, UI bất đồng bộ và MSW; locator của Playwright, setup project và test chập chờn. 24 câu trắc nghiệm cùng 2 câu viết bộ test phải diệt được các đột biến cài sẵn.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, 'Chapters 4–7', 'Chương 4–7'),
      questions: [
        ...questions,
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q25 — A table of neighbours for the overlap rule (chapter 4).</b> ' + c('findOverlap(rows, { lab, date, start, end })') + ' returns the first booking that clashes with the requested slot, or <code>null</code>. It has the same meaning as the PostgreSQL exclusion constraint of chapter 4: same lab, same day, and the half-open ranges ' + c('[start, end)') + ' overlap. Back-to-back bookings (one ends at 09:00, the next starts at 09:00) do <b>not</b> clash, and a <code>CANCELLED</code> booking frees its slot.</p>' +
            '<p>One existing booking is enough: BE-201, 16 November, 09:00–11:00. Test its neighbours — touching on either side, starting before and ending inside, starting inside, containing, contained, another lab, another day. Six mutants are planted.</p>',
            '<p><b>Câu 25 — Một bảng "hàng xóm" cho luật chồng giờ (chương 4).</b> ' + c('findOverlap(rows, { lab, date, start, end })') + ' trả về lượt đặt đầu tiên xung đột với khung được hỏi, hoặc <code>null</code>. Nó cùng nghĩa với ràng buộc exclusion của PostgreSQL ở chương 4: cùng lab, cùng ngày, và hai khoảng nửa mở ' + c('[start, end)') + ' chồng nhau. Các lượt nối tiếp (một lượt kết thúc 09:00, lượt sau bắt đầu 09:00) <b>không</b> xung đột, và lượt <code>CANCELLED</code> trả lại chỗ.</p>' +
            '<p>Chỉ cần một lượt có sẵn: BE-201, 16/11, 09:00–11:00. Hãy test các "hàng xóm" của nó — chạm biên ở hai phía, bắt đầu trước và kết thúc bên trong, bắt đầu bên trong, bao trùm, nằm gọn, lab khác, ngày khác. Có sáu đột biến.</p>',
          ),
          starterCode: starter({ given: C1_GIVEN, params: '{ findOverlap }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: C1_SOLUTION,
        }),
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q26 — Access control as a table (chapter 5).</b> Two routes of LabFlow Lite, written as pure functions ' + c('(req) → { status, body }') + ':</p>' +
            '<ul>' +
            '<li>' + c('getBooking(req)') + ' — no user ⇒ <code>401</code>; a missing booking, or one that belongs to someone else, ⇒ <code>404 { code: "NOT_FOUND" }</code> (never 403 — that would confirm the id exists); the owner or an <code>ADMIN</code> ⇒ <code>200</code> with exactly the public fields <code>id, lab, date, start, end, status</code> — no <code>userId</code>. <code>req.params.id</code> is a string, as Express gives it.</li>' +
            '<li>' + c('listAllBookings(req)') + ' — no user ⇒ <code>401</code>; any role but <code>ADMIN</code> ⇒ <code>403 { code: "FORBIDDEN" }</code>; an admin ⇒ <code>200</code> with every booking.</li>' +
            '</ul>' +
            '<p>Assert exact statuses and whole bodies — a range such as "below 300" killed 0 of 8 mutants in Lab 5. Six mutants are planted.</p>',
            '<p><b>Câu 26 — Phân quyền viết thành bảng (chương 5).</b> Hai tuyến của LabFlow Lite, viết thành hàm thuần ' + c('(req) → { status, body }') + ':</p>' +
            '<ul>' +
            '<li>' + c('getBooking(req)') + ' — không có user ⇒ <code>401</code>; lượt không tồn tại, hoặc của người khác, ⇒ <code>404 { code: "NOT_FOUND" }</code> (không bao giờ 403 — như thế là xác nhận id đó có thật); chủ lượt hoặc <code>ADMIN</code> ⇒ <code>200</code> với đúng các trường công khai <code>id, lab, date, start, end, status</code> — không có <code>userId</code>. <code>req.params.id</code> là chuỗi, như Express đưa vào.</li>' +
            '<li>' + c('listAllBookings(req)') + ' — không có user ⇒ <code>401</code>; vai nào khác <code>ADMIN</code> ⇒ <code>403 { code: "FORBIDDEN" }</code>; admin ⇒ <code>200</code> với mọi lượt đặt.</li>' +
            '</ul>' +
            '<p>Khẳng định đúng mã trạng thái và toàn bộ body — một khoảng như "dưới 300" chỉ diệt 0/8 đột biến ở Lab 5. Có sáu đột biến.</p>',
          ),
          starterCode: starter({ given: C2_GIVEN, params: '{ getBooking, listAllBookings }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: C2_SOLUTION,
        }),
      ],
    },
  ],
};
