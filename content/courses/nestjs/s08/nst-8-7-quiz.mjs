/**
 * 8.7 — Kiểm tra Chương 8 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c8/o):
 * câu 1 81-bay ④, câu 2 81-bay ①, câu 3 81-noidoi, câu 4 82-override, câu 5 82-override-sua, câu 6 83-main-tran/83-main-that,
 * câu 7 83-song-song-loi, câu 8 84-quen-close, câu 9 84-done, câu 10 85-truoc + 86-phu-moc7. Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '8.7 — Chapter 8 quiz|||8.7 — Kiểm tra Chương 8',
  slug: 'nst-8-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 8: compile() và onModuleInit, đọc lỗi thiếu provider trong test, mock đồng ý với lỗi truy vấn, overrideGuard với guard toàn cục, main.ts và ứng dụng trong test, chạy song song trên một DB, Jest không thoát, test kiểu done() trên Vitest, và độ phủ cao mà không bắt được lỗi cài sẵn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter (Nest 12.6 and 11.1, Vitest 4.1, Jest 30.5, PostgreSQL 16). Testing mistakes rarely make tests red; they make them green for the wrong reason — so most questions ask what a slightly wrong test setup really reports.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can build a service with <code>Test.createTestingModule</code> and replace its dependencies.</li>
<li>I can unit-test a guard, a pipe, an interceptor and a filter with fake contexts.</li>
<li>I can make the e2e app identical to the production app and isolate database tests.</li>
<li>I know the traps of Jest on an older Nest project and of moving to Vitest.</li>
<li>I can measure test quality with planted bugs instead of coverage alone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương (Nest 12.6 và 11.1, Vitest 4.1, Jest 30.5, PostgreSQL 16). Lỗi khi viết test hiếm khi làm test đỏ; chúng làm test xanh vì lý do sai — nên phần lớn câu hỏi hỏi một cách dựng test hơi lệch thật sự báo gì.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dựng được service bằng <code>Test.createTestingModule</code> và thay được phụ thuộc của nó.</li>
<li>Tôi test đơn vị được guard, pipe, interceptor và filter bằng ngữ cảnh giả.</li>
<li>Tôi làm được ứng dụng e2e giống hệt ứng dụng production và cô lập được test có DB.</li>
<li>Tôi biết các bẫy của Jest trên dự án Nest cũ và của việc chuyển sang Vitest.</li>
<li>Tôi đo được chất lượng test bằng lỗi cài sẵn chứ không chỉ bằng độ phủ.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A provider logs in onModuleInit and onModuleDestroy. The test calls Test.createTestingModule({ providers: [it] }).compile() and then module.get(). What has been logged at that point?|||Một provider ghi log trong onModuleInit và onModuleDestroy. Test gọi Test.createTestingModule({ providers: [nó] }).compile() rồi module.get(). Lúc đó đã có log nào?',
        options: [
          'Nothing — onModuleInit runs only on module.init(), onModuleDestroy on module.close()|||Chưa có gì — onModuleInit chỉ chạy ở module.init(), onModuleDestroy ở module.close()',
          'onModuleInit — compile() runs all lifecycle hooks|||onModuleInit — compile() chạy mọi hook vòng đời',
          'onModuleInit and onModuleDestroy — testing modules are short-lived|||onModuleInit và onModuleDestroy — testing module sống rất ngắn',
          'It depends on whether the provider is request-scoped|||Tuỳ provider có scope request hay không',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 8.1, trap ④: "— sau compile() | onModuleInit | — sau init() | onModuleDestroy | — sau close()". A PrismaService that connects in onModuleInit connects only after init().|||VI: Bài 8.1, bẫy ④: "— sau compile() | onModuleInit | — sau init() | onModuleDestroy | — sau close()". PrismaService kết nối trong onModuleInit chỉ kết nối sau init().',
      },
      {
        question: 'A test fails with: "Nest can\'t resolve dependencies of the BookingsService (?, Clock)… the argument PrismaService at index [0] is available in the RootTestModule module". What is the fix?|||Một test đỏ với: "Nest can\'t resolve dependencies of the BookingsService (?, Clock)… the argument PrismaService at index [0] is available in the RootTestModule module". Sửa thế nào?',
        options: [
          'Provide Clock — the "?" is before Clock|||Khai Clock — dấu "?" đứng trước Clock',
          'Rename RootTestModule to AppModule|||Đổi tên RootTestModule thành AppModule',
          'Give the testing module a PrismaService (useValue fake, useMocker, or import its module)|||Cho testing module một PrismaService (useValue giả, useMocker, hoặc import module của nó)',
          'Call compile() twice — the first call registers the providers|||Gọi compile() hai lần — lần đầu để đăng ký provider',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 8.1, trap ①: the "?" marks the missing argument, index 0 = PrismaService. RootTestModule is the module the builder creates.|||VI: Bài 8.1, bẫy ①: dấu "?" đánh dấu tham số thiếu, vị trí 0 = PrismaService. RootTestModule là module builder tự tạo.',
      },
      {
        question: 'findByRoom filters status notIn [\'CANCELED\', \'REJECTED\'] while the column stores \'CANCELLED\'. One test fakes db.booking.findMany with a fixed result; another runs against PostgreSQL. Results?|||findByRoom lọc status notIn [\'CANCELED\', \'REJECTED\'] trong khi cột lưu \'CANCELLED\'. Một test làm giả db.booking.findMany trả kết quả cố định; một test chạy với PostgreSQL. Kết quả?',
        options: [
          'Both red — TypeScript rejects the string|||Cả hai đỏ — TypeScript từ chối chuỗi đó',
          'Fake: green; PostgreSQL: red, the cancelled booking is returned|||Giả: xanh; PostgreSQL: đỏ, lịch đã huỷ vẫn được trả',
          'Fake: red; PostgreSQL: green|||Giả: đỏ; PostgreSQL: xanh',
          'Both green — Prisma normalises enum spellings|||Cả hai xanh — Prisma chuẩn hoá cách viết',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 8.1, section 3: "expected [ \'CANCELLED\', \'PENDING\' ] to deeply equal [ \'PENDING\' ]" against PostgreSQL; the fake never evaluates the where.|||VI: Bài 8.1, mục 3: "expected [ \'CANCELLED\', \'PENDING\' ] to deeply equal [ \'PENDING\' ]" với PostgreSQL; đồ giả không bao giờ tính cái where.',
      },
      {
        question: 'AppModule registers { provide: APP_GUARD, useClass: JwtAuthGuard }. An e2e test does .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true }) and calls GET /bookings/mine without a token. Status?|||AppModule khai { provide: APP_GUARD, useClass: JwtAuthGuard }. Test e2e dùng .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true }) rồi gọi GET /bookings/mine không token. Mã trạng thái?',
        options: [
          '200 — the fake guard replaces the real one|||200 — guard giả thay guard thật',
          '500 — two guards conflict|||500 — hai guard xung đột',
          '403 — the fake guard sets no user, PermGuard rejects|||403 — guard giả không đặt user, PermGuard từ chối',
          '401 — the real JwtAuthGuard still runs; overrideProvider would not help either|||401 — JwtAuthGuard thật vẫn chạy; overrideProvider cũng không giúp được',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 8.2, section 5: "overrideGuard → 401 Thiếu Bearer token", "overrideProvider → 401". With useClass under APP_GUARD there is no provider named JwtAuthGuard to replace.|||VI: Bài 8.2, mục 5: "overrideGuard → 401 Thiếu Bearer token", "overrideProvider → 401". Với useClass dưới APP_GUARD không có provider nào tên JwtAuthGuard để thay.',
      },
      {
        question: 'The module now has { provide: APP_GUARD, useExisting: JwtAuthGuard }, JwtAuthGuard. Which override replaces the guard in the e2e app?|||Module giờ có { provide: APP_GUARD, useExisting: JwtAuthGuard }, JwtAuthGuard. Cách override nào thay được guard trong ứng dụng e2e?',
        options: [
          'overrideProvider(JwtAuthGuard) — overrideGuard still has no effect|||overrideProvider(JwtAuthGuard) — overrideGuard vẫn không có tác dụng',
          'overrideGuard(JwtAuthGuard) — overrideProvider has no effect|||overrideGuard(JwtAuthGuard) — overrideProvider không có tác dụng',
          'Both work the same|||Cả hai như nhau',
          'Neither — global guards cannot be replaced in tests|||Không cách nào — guard toàn cục không thay được trong test',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 8.2: "overrideProvider → 200 []", "useExisting + overrideGuard → 401". overrideGuard only replaces injectables attached with @UseGuards.|||VI: Bài 8.2: "overrideProvider → 200 []", "useExisting + overrideGuard → 401". overrideGuard chỉ thay injectable gắn bằng @UseGuards.',
      },
      {
        question: 'main.ts sets app.useBodyParser(\'json\', { limit: \'16kb\' }). The e2e test builds the app with createNestApplication() only and posts a 50 KB login body. What do the test and the real server return?|||main.ts đặt app.useBodyParser(\'json\', { limit: \'16kb\' }). Test e2e chỉ dựng ứng dụng bằng createNestApplication() và gửi body đăng nhập 50 KB. Test và máy chủ thật trả gì?',
        options: [
          'Both 413|||Cả hai 413',
          'Both 400|||Cả hai 400',
          'Test 400 (validation ran), real server 413|||Test 400 (validation đã chạy), máy chủ thật 413',
          'Test 413, real server 400|||Test 413, máy chủ thật 400',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 8.3: test "400 [ \'password must be shorter than or equal to 128 characters\' ]", curl to node dist/main.js "413 request entity too large". Fixed by cauHinhApp() shared by both.|||VI: Bài 8.3: test "400 [ \'password must be shorter than or equal to 128 characters\' ]", curl vào node dist/main.js "413 request entity too large". Sửa bằng cauHinhApp() dùng chung.',
      },
      {
        question: 'All e2e files share one test database; a setup file TRUNCATEs and inserts five users before each file. Someone runs npx vitest run --fileParallelism. What happens?|||Mọi tệp e2e dùng chung một DB test; một setup file TRUNCATE rồi chèn năm người dùng trước mỗi tệp. Ai đó chạy npx vitest run --fileParallelism. Chuyện gì xảy ra?',
        options: [
          'All green and twice as fast|||Xanh hết và nhanh gấp đôi',
          'Vitest refuses: parallel files need --no-isolate|||Vitest từ chối: tệp song song cần --no-isolate',
          'Only the slowest file fails with a timeout|||Chỉ tệp chậm nhất đỏ vì quá giờ',
          'Most files fail before any test runs: unique constraint users_email_key in the setup file|||Phần lớn tệp hỏng trước khi chạy test nào: ràng buộc unique users_email_key trong setup file',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 8.3: "Test Files 5 failed | 2 passed (7)", "Unique constraint failed on the constraint: users_email_key". One DB per worker (VITEST_POOL_ID + TEMPLATE) fixed it: 7/7, 4.62 s.|||VI: Bài 8.3: "Test Files 5 failed | 2 passed (7)", "Unique constraint failed on the constraint: users_email_key". Mỗi worker một DB (VITEST_POOL_ID + TEMPLATE) sửa được: 7/7, 4,62 s.',
      },
      {
        question: 'Nest 11 + Jest 30. The e2e file has no afterAll(() => app.close()), and a service starts setInterval in onModuleInit. What does npx jest do?|||Nest 11 + Jest 30. Tệp e2e không có afterAll(() => app.close()), và một service bật setInterval trong onModuleInit. npx jest làm gì?',
        options: [
          'Fails the suite with "open handle detected"|||Đánh trượt bộ test với "open handle detected"',
          'Reports the tests as passed, prints "Jest did not exit one second after the test run has completed" and keeps running|||Báo test đã qua, in "Jest did not exit one second after the test run has completed" rồi chạy mãi',
          'Exits normally — Jest kills timers after each file|||Thoát bình thường — Jest giết timer sau mỗi tệp',
          'Runs the tests twice|||Chạy test hai lần',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 8.4: tests passed, the warning appeared, timeout killed it after 15 s (exit 124). --detectOpenHandles printed nothing in 40 s; --forceExit only hides it.|||VI: Bài 8.4: test qua, cảnh báo hiện ra, timeout giết sau 15 s (mã 124). --detectOpenHandles không in gì trong 40 s; --forceExit chỉ che đi.',
      },
      {
        question: 'After migrating to Vitest, this test remains: it(\'…\', (done) => { setTimeout(() => { expect(1).toBe(2); done(); }, 10); }). What does Vitest 4 report?|||Sau khi chuyển sang Vitest, còn sót test này: it(\'…\', (done) => { setTimeout(() => { expect(1).toBe(2); done(); }, 10); }). Vitest 4 báo gì?',
        options: [
          'Passed in a few ms — "done" is the test context, the wrong assertion runs after the test ended|||Qua trong vài ms — "done" là test context, khẳng định sai chạy sau khi test đã kết thúc',
          'Failed: expected 1 to be 2|||Đỏ: expected 1 to be 2',
          'Failed: done is not a function|||Đỏ: done is not a function',
          'Timed out after 5 s|||Quá giờ sau 5 s',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 8.4, section 7: Vitest "Tests 1 passed (1)", tests 2 ms; Jest failed the same test correctly. Rewrite done-style tests before migrating.|||VI: Bài 8.4, mục 7: Vitest "Tests 1 passed (1)", tests 2 ms; Jest đánh trượt đúng cùng test đó. Viết lại test kiểu done trước khi chuyển.',
      },
      {
        question: 'The mốc 7 suite: 31 green tests, 89.47% line coverage, 100% lines in booking.policy.ts and perm.guard.ts. Eight small bugs are planted one at a time. How many make the suite red?|||Bộ test mốc 7: 31 test xanh, 89,47% độ phủ dòng, 100% dòng ở booking.policy.ts và perm.guard.ts. Cài lần lượt tám lỗi nhỏ. Bao nhiêu lỗi làm bộ test đỏ?',
        options: [
          '8 — every line is covered|||8 — dòng nào cũng được phủ',
          '7 — only the optimistic-lock bug survives|||7 — chỉ lỗi khoá lạc quan sống sót',
          '4 — the e2e ones|||4 — các lỗi ở mức e2e',
          '0|||0',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lab 8.5: "— bắt 0/8 đột biến". Covered lines ran, but no test sat on the boundaries or the default-deny path. 14 targeted tests caught 8/8.|||VI: Lab 8.5: "— bắt 0/8 đột biến". Dòng được phủ có chạy, nhưng không test nào đứng trên biên hay nhánh mặc định từ chối. 14 test nhắm đúng chỗ bắt 8/8.',
      },
    ],
  },
};
