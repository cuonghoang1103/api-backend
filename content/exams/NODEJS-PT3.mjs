/**
 * Node.js — Progress Test 3 (chương 13–18).
 *
 * Đề tự soạn, bám sát `content/courses/nodejs/s13…s18`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ Hai lời giải mẫu đều đã CHẠY THẬT bằng `node` để lấy `expectedOutput`.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-PT3.mjs --apply
 */
import { B, EX, code, ptInstructions, mcq, codeQ } from './_lib/nodejs-exam-kit.mjs';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 13–18 (queues, testing, observability, performance, Docker, architecture)',
        'Kiểm tra tiến độ 3 — Chương 13–18 (hàng đợi, kiểm thử, quan sát hệ thống, hiệu năng, Docker, kiến trúc)',
      ),
      description: B(
        'The last third of the course — everything that decides whether the system survives contact with production: background jobs, tests, logs and metrics, performance, containers and deployment, and the architecture decisions you cannot take back. 30 multiple-choice questions plus 2 coding questions.',
        'Một phần ba cuối của khoá — tất cả những gì quyết định hệ thống có sống nổi trên production hay không: tác vụ nền, kiểm thử, log và metric, hiệu năng, container và triển khai, cùng những quyết định kiến trúc không rút lại được. 30 câu trắc nghiệm và 2 câu lập trình.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '13–18'),
      questions: [
        // ── Chương 13 — Tác vụ nền ──────────────────────────────────────
        mcq({
          prompt: B(
            '100 users sign up at once. The SMTP server accepts 5 concurrent connections and rejects the rest with 421. Doing the send INLINE: 5 emails delivered, 95 HTTP 500. Doing it through a QUEUE with worker concurrency 5: 100 emails delivered, 0 errors, peak SMTP connections still 5. What does that prove?',
            '100 người đăng ký cùng lúc. Máy chủ SMTP chỉ nhận 5 kết nối đồng thời và từ chối phần còn lại bằng mã 421. Gửi NGAY trong request: 5 email đi được, 95 lần HTTP 500. Đẩy vào HÀNG ĐỢI với worker concurrency 5: 100 email đi được, 0 lỗi, đỉnh kết nối SMTP vẫn là 5. Điều đó chứng minh gì?',
          ),
          options: [
            B('The queue made SMTP faster', 'Hàng đợi làm SMTP chạy nhanh hơn'),
            B('This is correctness, not performance: the queue remembered the work instead of dropping it', 'Đây là chuyện ĐÚNG/SAI chứ không phải nhanh/chậm: hàng đợi nhớ lấy công việc thay vì đánh rơi nó'),
            B('The inline version would be fine with a bigger connection pool', 'Bản làm ngay sẽ ổn nếu tăng số kết nối trong pool'),
            B('The queue is only worth it above 1000 users per second', 'Hàng đợi chỉ đáng dùng khi vượt 1000 người mỗi giây'),
          ],
          correct: 1,
          explanation: EX(
            'Peak SMTP concurrency was 5 in BOTH runs — the queue did not make the downstream faster, it stopped your system asking for more than the downstream can give and kept the rest. Inline, 95 pieces of work were destroyed permanently and each user got a 500. Note the bill you sign when you move work out of the request: the user got 202 and now needs an answer to "did it work?" — say nothing (a welcome email), expose a status endpoint, or push over the socket. Choose deliberately: the failure mode of async work is a user who never finds out.',
            'Đỉnh kết nối SMTP là 5 ở CẢ HAI lần chạy — hàng đợi không làm bên kia nhanh hơn, nó khiến hệ thống của bạn thôi đòi hỏi nhiều hơn mức bên kia cho được, và giữ lại phần còn lại. Làm ngay trong request thì 95 công việc bị huỷ vĩnh viễn và mỗi người dùng nhận một mã 500. Nhớ cái hoá đơn bạn ký khi đẩy việc ra khỏi request: người dùng nhận 202 và giờ cần lời đáp cho câu "nó có chạy không?" — im lặng (email chào mừng), mở endpoint tra trạng thái, hoặc đẩy qua socket. Hãy chọn có chủ đích: kiểu hỏng của việc bất đồng bộ là một người dùng không bao giờ biết kết quả.',
          ),
        }),

        mcq({
          prompt: B(
            'Raising a BullMQ worker\'s <code>concurrency</code> from 1 to 100 took 200 I/O-bound jobs from 5 to 405 jobs/second. The same change on 100 CPU-bound jobs (60ms of hashing each) moved throughput from 16 to 17 jobs/second. Why?',
            'Nâng <code>concurrency</code> của worker BullMQ từ 1 lên 100 đưa 200 job chờ I/O từ 5 lên 405 job/giây. Cũng thay đổi đó với 100 job tốn CPU (băm 60ms mỗi job) chỉ đưa thông lượng từ 16 lên 17 job/giây. Vì sao?',
          ),
          options: [
            B('BullMQ caps CPU jobs at 16 per second internally', 'BullMQ tự chặn job CPU ở mức 16 job mỗi giây'),
            B('concurrency means "jobs in flight", and in-flight is not parallel — it is still one event loop', 'concurrency nghĩa là "số job đang dở", mà đang dở không phải là song song — vẫn chỉ một event loop'),
            B('The CPU jobs were too short for concurrency to help', 'Các job CPU quá ngắn nên concurrency không giúp được'),
            B('Redis became the bottleneck for the CPU jobs', 'Redis trở thành nút thắt của các job CPU'),
          ],
          correct: 1,
          explanation: EX(
            'This is chapter 2 arriving with the bill. The first question about any job is not "how fast is it" but "does it wait, or does it compute?" — the two get opposite treatment. For CPU-bound work the real answers are more worker processes, a BullMQ sandboxed processor (point the worker at a file path and it forks a child per job), or worker_threads. And run workers in their own process regardless: a worker sharing the web process shares its event loop, so a heavy job adds latency to every HTTP request.',
            'Đây là chương 2 tới đòi nợ. Câu hỏi đầu tiên về một job không phải "nó nhanh cỡ nào" mà là "nó CHỜ hay nó TÍNH?" — hai loại được đối xử ngược nhau. Với việc nặng CPU thì cách thật sự là thêm tiến trình worker, dùng sandboxed processor của BullMQ (trỏ worker vào một file, nó fork tiến trình con cho từng job), hoặc worker_threads. Và dù thế nào cũng hãy cho worker chạy ở tiến trình riêng: worker dùng chung tiến trình web là dùng chung event loop, nên một job nặng làm mọi request HTTP chậm theo.',
          ),
        }),

        mcq({
          prompt: B(
            'A payment job with <code>attempts: 3</code> and exponential backoff ended up charging the customer 300.000đ instead of 100.000đ. What is the actual defect?',
            'Một job thanh toán đặt <code>attempts: 3</code> kèm backoff luỹ thừa cuối cùng trừ của khách 300.000đ thay vì 100.000đ. Khiếm khuyết THẬT SỰ nằm ở đâu?',
          ),
          options: [
            B('The retry configuration — it should have been <code>attempts: 1</code>', 'Cấu hình thử lại — đáng lẽ phải để <code>attempts: 1</code>'),
            B('The handler is not idempotent; a queue guarantees at-least-once, never exactly-once', 'Handler không idempotent; hàng đợi bảo đảm ÍT NHẤT MỘT LẦN, không bao giờ là ĐÚNG MỘT LẦN'),
            B('BullMQ has a bug in exponential backoff', 'BullMQ có lỗi ở phần backoff luỹ thừa'),
            B('The backoff delay was too short for the payment provider', 'Khoảng chờ backoff quá ngắn so với cổng thanh toán'),
          ],
          correct: 1,
          explanation: EX(
            'Any of these runs your handler twice: a retry, a stalled job reclaimed after a crash, a duplicate enqueue from a double-click. Exactly-once does not exist in distributed systems; idempotent handlers are what make at-least-once indistinguishable from it. The strongest fix is a unique key in your database — insert the payment row first and treat P2002 as "already charged" (chapter 7) — or an idempotency key handed to the provider. A deterministic <code>jobId</code> also helps, but only while the old job still exists in Redis: <code>removeOnComplete</code> cleans it up and the same id can be added again.',
            'Bất kỳ tình huống nào sau đây đều làm handler chạy hai lần: một lần thử lại, một job treo được nhặt lại sau khi worker chết, một lần đẩy trùng do bấm nút hai lần. "Đúng một lần" không tồn tại trong hệ phân tán; handler idempotent mới là thứ làm cho "ít nhất một lần" không phân biệt được với nó. Cách chắc nhất là một khoá duy nhất trong cơ sở dữ liệu — chèn dòng thanh toán trước và coi P2002 là "đã trừ tiền rồi" (chương 7) — hoặc đưa idempotency key cho bên cổng thanh toán. Đặt <code>jobId</code> cố định cũng giúp, nhưng chỉ còn tác dụng chừng nào job cũ vẫn nằm trong Redis: <code>removeOnComplete</code> dọn nó đi là id đó thêm lại được.',
          ),
        }),

        mcq({
          prompt: B(
            'Your Redis is configured with <code>maxmemory-policy allkeys-lru</code> because chapter 12 called that the right setting for a cache. You now point BullMQ at the same Redis. What is wrong?',
            'Redis của bạn đang đặt <code>maxmemory-policy allkeys-lru</code> vì chương 12 bảo đó là cấu hình đúng cho một cái cache. Giờ bạn cho BullMQ dùng chung Redis đó. Sai ở đâu?',
          ),
          options: [
            B('Nothing — BullMQ re-creates evicted jobs automatically', 'Không sao — BullMQ tự tạo lại các job bị loại bỏ'),
            B('Under memory pressure Redis evicts keys — and some of those keys ARE your jobs, silently', 'Khi thiếu bộ nhớ, Redis loại bỏ khoá — và vài khoá trong đó CHÍNH LÀ job của bạn, âm thầm'),
            B('BullMQ requires <code>volatile-lru</code> instead', 'BullMQ đòi phải dùng <code>volatile-lru</code>'),
            B('The jobs survive but lose their retry counters', 'Job vẫn còn nhưng mất số lần đã thử'),
          ],
          correct: 1,
          explanation: EX(
            'A job is a Redis hash plus an id in a list — BullMQ is a library, not a broker, and the queue lives entirely in Redis, so the whole chapter-12 rulebook applies. Chapter 12 measured 162.616 keys evicted under pressure; if some are jobs, the work is gone and nothing tells you. A queue needs <code>noeviction</code> — the setting that lesson called dangerous for a cache is the required setting for a queue. Size it too: a waiting job is ~250 bytes, so a million-job backlog is 250MB.',
            'Một job là một hash Redis cộng với một id nằm trong list — BullMQ là thư viện chứ không phải một máy chủ môi giới, và hàng đợi nằm hoàn toàn trong Redis, nên toàn bộ luật của chương 12 đều áp dụng. Chương 12 đo được 162.616 khoá bị loại bỏ khi thiếu bộ nhớ; nếu vài khoá trong đó là job thì công việc biến mất và không ai báo bạn. Hàng đợi cần <code>noeviction</code> — cấu hình mà bài học kia gọi là nguy hiểm với một cache lại chính là cấu hình bắt buộc với một hàng đợi. Cũng nhớ tính dung lượng: một job đang chờ tốn ~250 byte, nên tồn đọng một triệu job là 250MB.',
          ),
        }),

        mcq({
          prompt: B(
            'Three processes all register the same recurring job at startup. With BullMQ\'s <code>upsertJobScheduler</code> the job fired 5 times in 1,3 seconds — not 15. With in-process <code>node-cron</code> or <code>setInterval</code>, what happens instead?',
            'Ba tiến trình cùng đăng ký một job định kỳ lúc khởi động. Với <code>upsertJobScheduler</code> của BullMQ, job chạy 5 lần trong 1,3 giây — không phải 15. Với <code>node-cron</code> hay <code>setInterval</code> chạy trong tiến trình thì sao?',
          ),
          options: [
            B('The same — the schedule is deduplicated by job name', 'Cũng vậy — lịch được khử trùng theo tên job'),
            B('Three independent timers: the nightly cleanup runs three times, the report is sent three times', 'Ba bộ hẹn giờ độc lập: việc dọn dẹp ban đêm chạy ba lần, báo cáo gửi ba lần'),
            B('Only the first process to boot wins the timer', 'Chỉ tiến trình khởi động đầu tiên giành được bộ hẹn giờ'),
            B('Node refuses to register a duplicate cron pattern', 'Node từ chối đăng ký một mẫu cron bị trùng'),
          ],
          correct: 1,
          explanation: EX(
            'The BullMQ schedule is state in Redis; a <code>node-cron</code> schedule is a timer inside a process. An in-process guard like <code>let _started = false</code> correctly prevents double-scheduling within one process and does absolutely nothing across three — which is why this bug is silent and arrives on the day someone adds a second container. Two more traps from the same lesson: cron patterns need an explicit <code>tz</code> (servers run UTC, so <code>&#x27;0 3 * * *&#x27;</code> fires at 10am in Vietnam), and a scheduled job should FAN OUT work (<code>addBulk</code>, one job per user) rather than do all 50.000 users itself.',
            'Lịch của BullMQ là trạng thái nằm trong Redis; lịch của <code>node-cron</code> là một bộ hẹn giờ nằm trong tiến trình. Một lá chắn kiểu <code>let _started = false</code> chặn đúng việc đăng ký trùng TRONG một tiến trình và hoàn toàn vô dụng khi có ba — nên lỗi này im lặng và bùng ra đúng ngày ai đó thêm container thứ hai. Thêm hai cái bẫy trong cùng bài: mẫu cron phải ghi rõ <code>tz</code> (máy chủ chạy giờ UTC, nên <code>&#x27;0 3 * * *&#x27;</code> nổ vào 10 giờ sáng giờ Việt Nam), và job định kỳ nên RẢI việc ra (<code>addBulk</code>, mỗi người dùng một job) chứ đừng tự ôm hết 50.000 người.',
          ),
        }),

        // ── Chương 14 — Kiểm thử ────────────────────────────────────────
        mcq({
          prompt: B(
            'The same assertion measured three ways: unit with a fake repo 0,0006ms, integration through the app + a real database 5,5ms, e2e over real HTTP 3,3ms. How should you read that?',
            'Cùng một khẳng định đo theo ba cách: unit với repo giả 0,0006ms, tích hợp qua app + cơ sở dữ liệu thật 5,5ms, e2e qua HTTP thật 3,3ms. Nên đọc con số đó thế nào?',
          ),
          options: [
            B('As a budget: the same 10 seconds buys very different coverage', 'Như một ngân sách: cùng 10 giây mua được những thứ rất khác nhau'),
            B('As proof that only unit tests are worth the time', 'Như bằng chứng chỉ có test đơn vị mới đáng bỏ thời gian'),
            B('As proof the test pyramid is wrong, since e2e beat integration', 'Như bằng chứng kim tự tháp test là sai, vì e2e nhanh hơn tích hợp'),
            B('As noise — the differences disappear once CI runs it', 'Như nhiễu — khác biệt sẽ biến mất khi CI chạy bộ test'),
          ],
          correct: 0,
          explanation: EX(
            'None of the twelve unit tests would have noticed a missing <code>express.json()</code>, an error handler registered before the routes, or a route mounted at <code>/note</code> — that is what the integration level buys. The e2e-beats-integration inversion is a tool detail, not a law: supertest boots an ephemeral server per request while the e2e loop called <code>listen()</code> once. Measure your own suite instead of trusting the diagram.',
            'Không một bài nào trong mười hai test đơn vị nhận ra được việc thiếu <code>express.json()</code>, error handler đăng ký trước các route, hay route bị gắn nhầm thành <code>/note</code> — đó là thứ tầng tích hợp mua được. Chuyện e2e nhanh hơn tích hợp là chi tiết của công cụ chứ không phải quy luật: supertest dựng một server tạm cho MỖI request, còn vòng lặp e2e chỉ gọi <code>listen()</code> một lần. Hãy đo bộ test của chính bạn thay vì tin vào cái hình kim tự tháp.',
          ),
        }),

        mcq({
          prompt: B(
            'Which of these "tests" turns the suite green while checking nothing — and is caught by NEITHER vitest nor node:test?' + code(
              "it('A', () => { expect(chuyenTien()).rejects.toThrow('SAI'); });     // thiếu await\n" +
              "it('B', () => { [].forEach(() => { expect(1).toBe(2); }); });         // callback không chạy\n" +
              "it('C', async () => { try { expect(await tinhTong()).toBe(999); } catch {} });",
            ),
            'Bài "test" nào dưới đây làm bộ test xanh mà chẳng kiểm gì — và KHÔNG bộ chạy nào (vitest lẫn node:test) bắt được?' + code(
              "it('A', () => { expect(chuyenTien()).rejects.toThrow('SAI'); });     // thiếu await\n" +
              "it('B', () => { [].forEach(() => { expect(1).toBe(2); }); });         // callback không chạy\n" +
              "it('C', async () => { try { expect(await tinhTong()).toBe(999); } catch {} });",
            ),
          ),
          options: [
            B('A — a missing await is invisible to every runner', 'A — thiếu await thì bộ chạy nào cũng chịu'),
            B('B — an assertion inside a callback that never runs', 'B — khẳng định nằm trong callback không bao giờ chạy'),
            B('C — the try/catch swallows the failure, so the assertion counter is still satisfied', 'C — try/catch nuốt mất lỗi, nên bộ đếm khẳng định vẫn thoả mãn'),
            B('None of them — all three fail correctly', 'Không cái nào — cả ba đều đỏ đúng như phải thế'),
          ],
          correct: 2,
          explanation: EX(
            'A is caught by vitest (and slips past node:test). B is caught by <code>t.plan(1)</code> in node:test and by <code>expect.assertions(1)</code> in vitest. C defeats both guards, because the assertion really did run — it ran, it failed, and the catch ate the failure, so the counter reads 1. There is no runner flag that saves you from writing <code>catch {}</code> around your own assertion. The only reliable proof that a test tests something: break the production code on purpose and watch it go red.',
            'A bị vitest bắt (và lọt qua node:test). B bị bắt bởi <code>t.plan(1)</code> trong node:test và <code>expect.assertions(1)</code> trong vitest. C vượt qua cả hai lá chắn, vì khẳng định THẬT SỰ đã chạy — chạy, hỏng, rồi bị catch nuốt mất, nên bộ đếm vẫn ghi 1. Không có cờ nào của bộ chạy cứu bạn khỏi việc tự tay bọc <code>catch {}</code> quanh khẳng định của mình. Bằng chứng đáng tin duy nhất rằng một bài test có kiểm cái gì đó: cố tình phá mã sản phẩm rồi xem nó có đỏ lên không.',
          ),
        }),

        mcq({
          prompt: B(
            'Five concurrent "create note" calls with the same title: against the FAKE repo all five returned 201; against the REAL table one succeeded and four raised PostgreSQL error 23505 which the app answered with 500. What is the lesson?',
            'Năm lời gọi "tạo ghi chú" đồng thời với cùng tiêu đề: với repo GIẢ cả năm trả 201; với BẢNG THẬT một cái thành công, bốn cái ném lỗi PostgreSQL 23505 và ứng dụng trả 500. Bài học là gì?',
          ),
          options: [
            B('The check-then-insert must be wrapped in a transaction to be correct', 'Phải bọc check-rồi-insert trong transaction thì mới đúng'),
            B('The constraint is the rule — map 23505 to 409 in the repository', 'Ràng buộc mới là luật — hãy ánh xạ 23505 thành 409 ngay trong repository'),
            B('The fake repo is broken and needs to be rewritten', 'Repo giả bị lỗi và cần được viết lại cho đúng'),
            B('The connection pool was too small for five callers', 'Pool kết nối quá nhỏ so với năm người gọi'),
          ],
          correct: 1,
          explanation: EX(
            'A fake answers whatever you told it to; a real table has opinions — unique constraints, column widths, foreign keys. Two details worth carrying: the first attempts to reproduce this race FAILED because <code>pg.Pool</code> opens connections lazily and the handshake serialised the requests by accident — a concurrency bug you cannot reproduce may be hiding behind a warm-up cost. And the sibling bug a fake can never show you is 22001 <em>value too long</em>: the day someone widens a zod max from 200 to 500 and forgets the migration.',
            'Hàng giả trả về đúng cái bạn dặn nó; bảng thật thì có ý kiến riêng — ràng buộc duy nhất, độ rộng cột, khoá ngoại. Hai chi tiết đáng mang theo: những lần đầu tái hiện cuộc đua này đều THẤT BẠI vì <code>pg.Pool</code> mở kết nối theo kiểu lười, và cái bắt tay đã vô tình khiến các request xếp hàng — một lỗi tương tranh không tái hiện được có thể đang nấp sau một chi phí khởi động. Còn lỗi anh em mà hàng giả không bao giờ cho bạn thấy là 22001 <em>value too long</em>: đúng vào ngày ai đó nới zod từ 200 lên 500 mà quên migration.',
          ),
        }),

        mcq({
          prompt: B(
            'A coverage report shows 100% of statements, branches, functions and lines — and <code>canEdit</code> still lets any EDITOR edit every note on the site. How is that possible?',
            'Báo cáo độ phủ đạt 100% cả bốn cột — statement, branch, function, line — mà <code>canEdit</code> vẫn cho phép bất kỳ EDITOR nào sửa mọi ghi chú trên trang. Sao lại thế được?',
          ),
          options: [
            B('The coverage tool has a bug with logical operators', 'Công cụ đo độ phủ bị lỗi với toán tử logic'),
            B('Branch coverage records that each side was EVALUATED, not that each outcome OCCURRED', 'Độ phủ nhánh chỉ ghi nhận mỗi vế đã ĐƯỢC TÍNH, không ghi nhận mỗi KẾT CỤC đã xảy ra'),
            B('The tests ran against a stale build', 'Bộ test chạy trên bản build cũ'),
            B('100% line coverage always implies correctness for pure functions', 'Với hàm thuần thì phủ 100% dòng luôn đồng nghĩa với đúng'),
          ],
          correct: 1,
          explanation: EX(
            'A test passed a USER whose id did not match, so JavaScript evaluated <code>note.authorId === user.id</code> (false) and then <code>user.role === &#x27;EDITOR&#x27;</code> (also false). Both operands ran; the counter is satisfied. The case where that second operand is TRUE — the escalation — was never produced. Coverage answers "was this executed?", never "would a test go red if this line were wrong?" A suite with no assertions at all can reach 100% in all four columns. The technique that does answer the real question is mutation testing — or, by hand, breaking the ten most dangerous lines and checking something goes red.',
            'Một bài test truyền vào USER có id không khớp, nên JavaScript tính <code>note.authorId === user.id</code> (sai) rồi tính tiếp <code>user.role === &#x27;EDITOR&#x27;</code> (cũng sai). Cả hai vế đều đã chạy; bộ đếm thoả mãn. Trường hợp vế thứ hai ĐÚNG — tức là leo thang quyền — chưa từng được tạo ra. Độ phủ trả lời câu "dòng này có chạy không?", không bao giờ trả lời "có bài test nào sẽ đỏ lên nếu dòng này sai không?". Một bộ test không có lấy một khẳng định vẫn đạt 100% cả bốn cột. Kỹ thuật trả lời đúng câu hỏi thật là mutation testing — hoặc làm tay: phá mười dòng nguy hiểm nhất rồi xem có gì đỏ lên không.',
          ),
        }),

        mcq({
          prompt: B(
            'Four test files each start with <code>TRUNCATE notes RESTART IDENTITY</code>, insert 20 rows and assert they see 20. Run in parallel: 0 passes out of 10 runs ("expected 76 to be 20"). Which fix keeps both correctness and speed?',
            'Bốn file test đều bắt đầu bằng <code>TRUNCATE notes RESTART IDENTITY</code>, chèn 20 dòng rồi khẳng định thấy đúng 20. Chạy song song: đậu 0/10 lần ("expected 76 to be 20"). Cách sửa nào giữ được CẢ đúng đắn LẪN tốc độ?',
          ),
          options: [
            B('Turn off file parallelism — correct, and it costs 2,8× the test time', 'Tắt chạy song song — đúng, và tốn gấp 2,8 lần thời gian test'),
            B('One schema per test file — correct, and costs nothing (258ms against 260ms)', 'Mỗi file test một schema riêng — đúng, và gần như không tốn gì (258ms so với 260ms)'),
            B('Add <code>retry: 3</code> to the config', 'Thêm <code>retry: 3</code> vào cấu hình'),
            B('Give each file its own table name inside the same schema', 'Cho mỗi file một tên bảng riêng trong cùng schema'),
          ],
          correct: 1,
          explanation: EX(
            'Sequential runs convert your test time from O(max) to O(sum) forever — four files took 731ms sequentially against 260ms in parallel, and the gap widens with every file. <code>retry: 3</code> is not a fix at all: it turns a test that fails 30% of the time into one that fails 2,7% of the time and hides the shared state until it causes a production incident. For a single file, transaction + ROLLBACK is the fastest correct isolation — as long as the app is built around the same client that holds the transaction, not around the pool.',
            'Chạy tuần tự biến thời gian test từ O(max) thành O(tổng) vĩnh viễn — bốn file mất 731ms khi tuần tự so với 260ms khi song song, và khoảng cách nới ra theo từng file thêm vào. <code>retry: 3</code> hoàn toàn không phải cách sửa: nó biến một bài đỏ 30% số lần thành đỏ 2,7% số lần và giấu luôn cái trạng thái dùng chung cho tới khi nó gây sự cố trên production. Với một file riêng lẻ thì transaction + ROLLBACK là cách cô lập đúng và nhanh nhất — miễn là app được dựng quanh CHÍNH client đang giữ transaction, chứ không phải quanh cái pool.',
          ),
        }),

        // ── Chương 15 — Quan sát hệ thống ───────────────────────────────
        mcq({
          prompt: B(
            'Writing 100.000 log lines: <code>console.log</code> 408ms (245.102 lines/s) and a 20ms heartbeat late by up to 349ms; pino to a buffered file 190ms (525.407 lines/s) with the heartbeat late by 135ms. But pino with <code>sync: true</code> was 407,8ms. What is the real variable?',
            'Ghi 100.000 dòng log: <code>console.log</code> mất 408ms (245.102 dòng/giây) và nhịp tim 20ms trễ tới 349ms; pino ghi file có đệm mất 190ms (525.407 dòng/giây), nhịp tim trễ 135ms. Nhưng pino đặt <code>sync: true</code> lại mất 407,8ms. Biến số THẬT là gì?',
          ),
          options: [
            B('Buffering — not the library. A synchronous write blocks the event loop until the kernel takes the bytes', 'Việc đệm — không phải thư viện. Một lần ghi đồng bộ chặn event loop cho tới khi nhân hệ điều hành nhận byte'),
            B('JSON serialisation, which is what makes structured logging slower', 'Việc tuần tự hoá JSON, thứ khiến log có cấu trúc chậm hơn'),
            B('Disk speed, which both libraries hit equally', 'Tốc độ đĩa, thứ mà cả hai thư viện đều đụng như nhau'),
            B('The number of bytes written, which pino reduced', 'Số byte ghi ra, thứ mà pino đã giảm bớt'),
          ],
          correct: 0,
          explanation: EX(
            'Structured logging is not slower — pino wrote MORE bytes (17,8MB against 10,9MB) in half the time. For 349ms nothing else ran: no request parsed, no promise resolved, no timer fired, and the thing that would log that spike is the thing being blocked. One container caveat that flips the sign: under Docker stdout is a pipe, so Node writes asynchronously and the blocking does not reproduce — instead bytes queue in memory and a stalled log consumer becomes a memory leak. Buffered-with-a-bound is the only answer that is neither.',
            'Log có cấu trúc không hề chậm hơn — pino ghi NHIỀU byte hơn (17,8MB so với 10,9MB) trong nửa thời gian. Suốt 349ms đó không gì khác chạy: không request nào được phân tích, không promise nào giải quyết, không timer nào nổ, và thứ đáng lẽ ghi log về cú vọt đó chính là thứ đang bị chặn. Một lưu ý về container làm đảo dấu: trong Docker, stdout là ống nên Node ghi bất đồng bộ và hiện tượng chặn không tái hiện — bù lại byte dồn trong bộ nhớ, và một bên tiêu thụ log bị nghẹn sẽ thành rò rỉ bộ nhớ. Đệm CÓ GIỚI HẠN mới là câu trả lời không rơi vào cả hai.',
          ),
        }),

        mcq({
          prompt: B(
            'Reading what <code>pino-http</code> writes by default for one request reveals <code>authorization: "Bearer eyJhbGci…"</code> and <code>cookie: "backend_token=abc123"</code>. Why is this worse than it looks, and what fixes it properly?',
            'Đọc kỹ những gì <code>pino-http</code> ghi mặc định cho một request, ta thấy <code>authorization: "Bearer eyJhbGci…"</code> và <code>cookie: "backend_token=abc123"</code>. Vì sao chuyện này tệ hơn vẻ ngoài, và cách sửa đúng là gì?',
          ),
          options: [
            B('It is a bug in pino-http; upgrading fixes it', 'Đó là lỗi của pino-http; nâng phiên bản là xong'),
            B('Those logs are shipped and kept 90 days — configure <code>redact</code>', 'Log đó được chuyển đi và giữ 90 ngày — hãy cấu hình <code>redact</code>'),
            B('It is fine as long as the log file stays on the server', 'Không sao miễn là file log vẫn nằm trên máy chủ'),
            B('Raise the log level to <code>warn</code> so request logs stop', 'Nâng mức log lên <code>warn</code> để thôi ghi log request'),
          ],
          correct: 1,
          explanation: EX(
            'It is not a bug — it is the honest default: it logs the request, and headers are part of the request. Every session token of every user then sits in a system never designed to hold secrets, readable by everyone with dashboard access. The wildcard is the part that earns its keep: <code>*.password</code> matches the field wherever it appears, including in code nobody has written yet — redaction that depends on everyone remembering is not redaction. Raising the level throws away the context you need when something breaks; sample instead (keep 100% of 5xx and slow requests, 1% of the rest).',
            'Đó không phải lỗi — đó là mặc định trung thực: nó ghi lại request, mà header là một phần của request. Thế là token phiên của mọi người dùng nằm trong một hệ thống chưa bao giờ được thiết kế để giữ bí mật, ai có quyền vào bảng điều khiển cũng đọc được. Ký tự đại diện mới là thứ đáng giá: <code>*.password</code> khớp trường đó ở bất cứ đâu nó xuất hiện, kể cả trong đoạn mã chưa ai viết — cách che dựa vào việc mọi người phải nhớ thì không phải là che. Nâng mức log lên sẽ vứt mất đúng phần ngữ cảnh bạn cần khi có sự cố; hãy lấy mẫu thay vì thế (giữ 100% lỗi 5xx và request chậm, 1% phần còn lại).',
          ),
        }),

        mcq({
          prompt: B(
            'To put a request id on every log line without threading a parameter through 200 functions, the course uses <code>AsyncLocalStorage</code>. Why not simply <code>global.currentReqId = id</code>?',
            'Để gắn mã request vào mọi dòng log mà không phải luồn tham số qua 200 hàm, giáo trình dùng <code>AsyncLocalStorage</code>. Sao không đơn giản là <code>global.currentReqId = id</code>?',
          ),
          options: [
            B('Globals are slower than AsyncLocalStorage', 'Biến toàn cục chậm hơn AsyncLocalStorage'),
            B('A sets it, awaits, B overwrites it, A resumes and logs B\'s id', 'A gán nó, gặp await, B ghi đè, A chạy tiếp và log ra id của B'),
            B('Node forbids writing to <code>global</code> in ESM', 'Node cấm ghi vào <code>global</code> trong ESM'),
            B('Because the id must be a UUID and a global cannot hold one', 'Vì mã request phải là UUID mà biến toàn cục không giữ được'),
          ],
          correct: 1,
          explanation: EX(
            'The runtime is the only thing that knows which async chain you are currently on. And the cost objection is out of date: measured at 13.687 req/s baseline, AsyncLocalStorage with a child logger ran at 12.910 — the entire 6% was the extra middleware and the extra field, with the async-context machinery adding nothing measurable. Two operational details: honour an inbound <code>X-Request-ID</code> (with a length cap — an unbounded header is attacker-controlled) and echo it back, listing it in <code>Access-Control-Expose-Headers</code> so the front end can actually read it.',
            'Chỉ có bản thân runtime mới biết bạn đang ở nhánh bất đồng bộ nào. Còn lời chê về chi phí thì đã lạc hậu: đo được mốc 13.687 req/giây, dùng AsyncLocalStorage kèm child logger vẫn 12.910 — toàn bộ 6% chênh lệch là do thêm middleware và thêm một trường trong dòng log, phần máy móc giữ ngữ cảnh bất đồng bộ gần như không tốn gì. Hai chi tiết vận hành: hãy tôn trọng <code>X-Request-ID</code> gửi tới (kèm chặn độ dài — header không giới hạn là thứ kẻ tấn công điều khiển được) và dội ngược nó lại, đồng thời liệt kê trong <code>Access-Control-Expose-Headers</code> để front-end thật sự đọc được.',
          ),
        }),

        mcq({
          prompt: B(
            'The same counter and histogram labelled by <code>user_id</code>, at 100.000 distinct users: process RSS 178 → 939MB, <code>/metrics</code> 74,52MB, 1.381ms to generate, 1.400.000 series. What rule prevents this?',
            'Cùng bộ counter và histogram nhưng gắn nhãn <code>user_id</code>, với 100.000 người dùng khác nhau: RSS tiến trình 178 → 939MB, <code>/metrics</code> nặng 74,52MB, mất 1.381ms để sinh, 1.400.000 chuỗi. Quy tắc nào ngăn được chuyện đó?',
          ),
          options: [
            B('Scrape less often than every 15 seconds', 'Thu thập thưa hơn mức 15 giây một lần'),
            B('A label value must come from a set you could write down on paper', 'Giá trị của một nhãn phải đến từ một tập hợp bạn có thể viết hết ra giấy'),
            B('Use a Summary instead of a Histogram', 'Dùng Summary thay cho Histogram'),
            B('Restart the process nightly so series are garbage-collected', 'Khởi động lại tiến trình mỗi đêm để các chuỗi được thu dọn'),
          ],
          correct: 1,
          explanation: EX(
            'Method, route template, status code, environment, region — all writable. User id, request id, email, raw URL, error message — all unbounded, all forbidden. The histogram is the amplifier: each new label value creates twelve bucket series plus a sum and a count, so one careless id multiplies by fourteen. And note the incident shape: each scrape blocks the event loop for 1,4 seconds, then times out, then Prometheus marks the target down and pages you for an outage your monitoring caused. The genuinely dangerous version is not <code>user_id</code> (caught in review) but <code>error_message</code>, which looks bounded until one interpolates "note 8412 not found".',
            'Phương thức, mẫu route, mã trạng thái, môi trường, vùng — đều viết ra giấy được. Id người dùng, mã request, email, URL thô, thông điệp lỗi — đều vô hạn, đều bị cấm. Histogram là bộ khuếch đại: mỗi giá trị nhãn mới đẻ ra mười hai chuỗi khoảng cộng với một sum và một count, nên một cái id vô ý được nhân lên mười bốn lần. Và để ý hình dạng sự cố: mỗi lần thu thập chặn event loop 1,4 giây, rồi quá hạn, rồi Prometheus đánh dấu mục tiêu là chết và gọi bạn dậy vì một sự cố do chính hệ giám sát gây ra. Phiên bản thật sự nguy hiểm không phải <code>user_id</code> (cái đó bị bắt lúc review) mà là <code>error_message</code>, nhìn tưởng hữu hạn cho tới khi một cái nội suy ra "note 8412 not found".',
          ),
        }),

        mcq({
          prompt: B(
            'A log sampler keeps 100% of 5xx and of anything slower than 1000ms, plus 1% of the rest — cutting 229,3MB to 2,3MB with no loss of incident data. Why must the 1% be chosen by a stable HASH of the request id rather than by <code>Math.random()</code>?',
            'Một bộ lấy mẫu log giữ 100% lỗi 5xx và mọi request chậm hơn 1000ms, cộng 1% phần còn lại — cắt 229,3MB xuống 2,3MB mà không mất dữ liệu sự cố. Vì sao 1% đó phải chọn bằng HÀM BĂM ổn định trên mã request chứ không phải <code>Math.random()</code>?',
          ),
          options: [
            B('Math.random() is too slow at this volume', 'Math.random() quá chậm ở khối lượng này'),
            B('Per-line randomness keeps orphaned fragments; hashing keeps whole requests', 'Ngẫu nhiên theo dòng chỉ giữ những mẩu rời rạc; băm thì giữ trọn cả request'),
            B('Hashing compresses better in the log store', 'Băm giúp kho log nén tốt hơn'),
            B('Because Math.random() is not available inside a container', 'Vì bên trong container thì không dùng được Math.random()'),
          ],
          correct: 1,
          explanation: EX(
            'A sampled request must still be a complete story. The hash must also be over a value identical on every line and stable across processes: hash the request id, not the timestamp, not a per-line counter. If two containers hash the same request differently, a request that crossed both is half-kept — which looks exactly like a request that vanished mid-flight, and you will spend an afternoon chasing it.',
            'Một request đã được lấy mẫu vẫn phải là một câu chuyện trọn vẹn. Hàm băm cũng phải chạy trên một giá trị giống hệt nhau ở mọi dòng và ổn định giữa các tiến trình: hãy băm mã request, đừng băm mốc thời gian, đừng băm bộ đếm theo dòng. Nếu hai container băm cùng một request ra kết quả khác nhau thì request đi qua cả hai sẽ bị giữ nửa vời — nhìn y hệt một request biến mất giữa chừng, và bạn sẽ mất cả buổi chiều đi tìm.',
          ),
        }),

        // ── Chương 16 — Hiệu năng ───────────────────────────────────────
        mcq({
          prompt: B(
            'A CPU profile of a slow listing route reports: stringify 16,9%, renderNote 15,9%, crypto hash 14,5%, garbage collector 3,7%, and <code>RegExp: [^a-z0-9]+</code> 0,5%. Most developers would have rewritten the regex. What does the profile say to do?',
            'Ảnh chụp CPU của một route liệt kê chậm cho thấy: stringify 16,9%, renderNote 15,9%, băm crypto 14,5%, bộ dọn rác 3,7%, và <code>RegExp: [^a-z0-9]+</code> 0,5%. Phần lớn lập trình viên sẽ đi viết lại regex. Ảnh chụp bảo phải làm gì?',
          ),
          options: [
            B('Rewrite the regex — 0,5% compounds across requests', 'Viết lại regex — 0,5% sẽ cộng dồn qua các request'),
            B('Stop redoing work that never changes: precompute, pre-serialise, and send fewer fields (285 → 3.550 req/s)', 'Thôi làm đi làm lại phần không hề đổi: tính sẵn, tuần tự hoá sẵn, và gửi ít trường hơn (285 → 3.550 req/giây)'),
            B('Add more CPU cores; the route is compute-bound', 'Thêm nhân CPU; route này nghẽn tính toán'),
            B('Reduce garbage collection by switching to object pools', 'Giảm dọn rác bằng cách dùng bể object'),
          ],
          correct: 1,
          explanation: EX(
            'The four steps measured, one at a time: precompute (2,2×), pre-serialise (1,9× more), send only the fields the client renders — 365KB down to 86KB (2,8× more). 11,6× total, zero libraries changed. The GC line is a consequence, not a cause: 500 garbage objects per request means somebody has to clean them. Two profiling traps: profile UNDER LOAD (an idle profile is all "(idle)"), and let the process exit normally — <code>--cpu-prof</code> writes nothing on SIGKILL, which looks exactly like "profiling did not work".',
            'Bốn bước đã đo, từng bước một: tính sẵn (2,2×), tuần tự hoá sẵn (thêm 1,9×), chỉ gửi những trường client thật sự hiển thị — 365KB còn 86KB (thêm 2,8×). Tổng 11,6 lần, không đổi một thư viện nào. Dòng bộ dọn rác là hệ quả chứ không phải nguyên nhân: mỗi request đẻ 500 object rác thì phải có ai đó đi dọn. Hai cái bẫy khi chụp profile: phải chụp DƯỚI TẢI (chụp lúc rảnh thì toàn "(idle)"), và phải để tiến trình thoát bình thường — <code>--cpu-prof</code> không ghi gì khi bị SIGKILL, nhìn y hệt "chụp profile không chạy".',
          ),
        }),

        mcq({
          prompt: B(
            'A route spends 97,8% of its time in the database call. <code>EXPLAIN ANALYZE</code> says the query itself takes 0,030ms, while the application measures 5,107ms. Raising the pool from 10 to 50 dropped throughput from 2.935 to 2.747 req/s. What is going on?',
            'Một route tiêu 97,8% thời gian trong lời gọi cơ sở dữ liệu. <code>EXPLAIN ANALYZE</code> nói bản thân câu truy vấn mất 0,030ms, còn ứng dụng đo được 5,107ms. Nâng pool từ 10 lên 50 làm thông lượng tụt từ 2.935 xuống 2.747 req/giây. Chuyện gì đang xảy ra?',
          ),
          options: [
            B('EXPLAIN is unreliable under concurrency', 'EXPLAIN không đáng tin khi có tương tranh'),
            B('Most of "database time" is queueing; a bigger pool only MOVES the queue', 'Phần lớn "thời gian cơ sở dữ liệu" là xếp hàng; pool to hơn chỉ DỜI hàng đợi'),
            B('The query is missing an index on the sort column', 'Câu truy vấn thiếu chỉ mục trên cột dùng để sắp xếp'),
            B('The pg driver parses the result rows far too slowly', 'Trình điều khiển pg phân tích các dòng kết quả quá chậm'),
          ],
          correct: 1,
          explanation: EX(
            'With a pool of 1, the split was 16,125ms waiting for a connection against 0,741ms querying — the database was never busy; twenty requests were standing in line for one door. As the pool grows the wait collapses (16,1 → 0,07ms) and the query time rises (0,74 → 3,66ms): Little\'s Law, concurrency = throughput × latency. So EXPLAIN being fast means the PLAN is good, not that the query is fast. Instrument <code>pool.connect()</code> separately or export <code>pool.waitingCount</code> — a rising waitingCount says "raise the pool"; a flat one with rising query time says "the database is the limit, stop".',
            'Với pool bằng 1, tỉ lệ là 16,125ms chờ kết nối so với 0,741ms thật sự truy vấn — cơ sở dữ liệu chưa bao giờ bận; hai mươi request đang xếp hàng trước một cánh cửa. Pool càng to thì phần chờ càng sụp (16,1 → 0,07ms) và thời gian truy vấn càng tăng (0,74 → 3,66ms): định luật Little, đồng thời = thông lượng × độ trễ. Vậy EXPLAIN nhanh nghĩa là KẾ HOẠCH tốt, chứ không có nghĩa câu truy vấn nhanh. Hãy đo riêng <code>pool.connect()</code> hoặc phát ra <code>pool.waitingCount</code> — waitingCount tăng nghĩa là "nâng pool"; waitingCount phẳng mà thời gian truy vấn tăng nghĩa là "cơ sở dữ liệu đã tới giới hạn, dừng lại".',
          ),
        }),

        mcq({
          prompt: B(
            'Compressing an 87KB JSON response: brotli quality 4 gives 1.691 bytes in 0,31ms; brotli quality 11 gives 1.918 bytes in 151,99ms and drops a live server to 22 req/s. What is the correct reading?',
            'Nén một phản hồi JSON 87KB: brotli quality 4 cho 1.691 byte trong 0,31ms; brotli quality 11 cho 1.918 byte trong 151,99ms và kéo một máy chủ thật xuống còn 22 req/giây. Đọc thế nào cho đúng?',
          ),
          options: [
            B('Maximum quality is a regression in BOTH dimensions here — 490× slower for a 13% larger file', 'Ở đây mức nén tối đa là bước LÙI ở CẢ HAI chiều — chậm hơn 490 lần mà file lại to hơn 13%'),
            B('Quality 11 is correct; the server just needs more CPU', 'Quality 11 là đúng; chỉ là máy chủ cần thêm CPU'),
            B('Brotli is always the wrong choice for an API', 'Brotli luôn là lựa chọn sai cho một API'),
            B('Decompression cost on the client is what makes q11 bad', 'Chi phí giải nén phía client mới là thứ làm q11 tệ'),
          ],
          correct: 0,
          explanation: EX(
            'At quality 11 brotli switches to a much larger window and a far more aggressive search, and on small repetitive data that search settles on a worse partition than the cheap heuristic finds. "Higher is better" is an assumption, not a property. Decompression is free and identical for both algorithms (0,08ms), which is why the client side of this decision does not matter and the server side does. And if you have nginx or a CDN in front, compress there: it uses different CPU, in optimised C, and can cache the compressed result.',
            'Ở quality 11, brotli chuyển sang cửa sổ lớn hơn nhiều và một phép tìm kiếm hung hăng hơn hẳn, và với dữ liệu nhỏ lặp lại thì phép tìm ấy dừng ở một cách chia tệ hơn cả cách rẻ tiền. "Càng cao càng tốt" là một giả định, không phải một tính chất. Giải nén thì miễn phí và như nhau ở cả hai thuật toán (0,08ms), nên phía client của quyết định này không quan trọng còn phía máy chủ thì có. Và nếu đã có nginx hay CDN đứng trước thì hãy nén ở đó: nó dùng CPU khác, viết bằng C tối ưu, và cache được kết quả đã nén.',
          ),
        }),

        mcq({
          prompt: B(
            'Forking one Node process per core took a CPU-bound route from 8.708 to 29.542 req/s (3,4×) and an I/O-bound route from 1.253 to 1.325 (5,7%). Before reaching for <code>cluster</code>, what should you check — and what breaks when you fork?',
            'Fork mỗi nhân CPU một tiến trình Node đưa route nặng CPU từ 8.708 lên 29.542 req/giây (3,4 lần) và route nghẽn I/O từ 1.253 lên 1.325 (5,7%). Trước khi với tay tới <code>cluster</code>, cần kiểm tra gì — và fork thì hỏng cái gì?',
          ),
          options: [
            B('Check the %(idle) in a CPU profile; forking breaks in-memory caches, in-memory rate limits, cron schedules and Socket.IO rooms', 'Xem tỉ lệ %(idle) trong ảnh chụp CPU; fork làm hỏng cache trong bộ nhớ, giới hạn tần suất đếm trong RAM, lịch cron và các phòng Socket.IO'),
            B('Check RAM; forking breaks nothing as long as the code is stateless', 'Xem RAM; fork chẳng làm hỏng gì miễn là mã không giữ trạng thái'),
            B('Check the disk; forking only affects logging', 'Xem đĩa; fork chỉ ảnh hưởng tới việc ghi log'),
            B('Always fork <code>os.cpus().length</code> workers — the measurement above proves it', 'Cứ fork đúng <code>os.cpus().length</code> worker — phép đo trên đã chứng minh điều đó'),
          ],
          correct: 0,
          explanation: EX(
            'High idle (&gt;60%) means you are I/O-bound and cluster will not help; low idle (&lt;30%) means it will, roughly up to the core count. And even for CPU work more is not better: on a ten-core machine throughput peaked at FOUR workers (29.542) and fell to 25.112 at ten, because the load generator, nginx, the log shipper and context switching all want cores too. The silent breakage is cron: a nightly billing job written for one process starts sending four invoices the day someone sets WORKERS=4, and nothing errors.',
            'Idle cao (&gt;60%) nghĩa là bạn nghẽn I/O và cluster sẽ không giúp gì; idle thấp (&lt;30%) nghĩa là có giúp, gần như tuyến tính tới khoảng số nhân. Mà ngay cả với việc nặng CPU thì nhiều hơn cũng không tốt hơn: trên máy mười nhân, thông lượng đạt đỉnh ở BỐN worker (29.542) rồi tụt còn 25.112 ở mười, vì bộ tạo tải, nginx, bộ gom log và việc chuyển ngữ cảnh cũng đều đòi nhân. Chỗ hỏng âm thầm nhất là cron: một job tính tiền ban đêm viết cho một tiến trình sẽ gửi bốn hoá đơn đúng ngày ai đó đặt WORKERS=4, và không có lỗi nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'A healthy Node app went from 56,6MB to 122,5MB RSS and then stopped (123,3 → 123,4MB). A leaking one went 57 → 162 → 232 → 351,5MB. What distinguishes them, and what is the fix for the leaking <code>Map</code> cache?',
            'Một app Node khoẻ mạnh đi từ 56,6MB lên 122,5MB RSS rồi dừng (123,3 → 123,4MB). Một app rò rỉ đi 57 → 162 → 232 → 351,5MB. Phân biệt bằng gì, và sửa cái cache <code>Map</code> rò rỉ thế nào?',
          ),
          options: [
            B('Rise-then-plateau is normal; rising with traffic is a leak — bound the cache', 'Tăng rồi đi ngang là bình thường; tăng theo lưu lượng mới là rò rỉ — hãy chặn cache lại'),
            B('Any growth beyond the starting RSS counts as a leak', 'Cứ tăng vượt mức RSS ban đầu thì coi là rò rỉ'),
            B('Call <code>global.gc()</code> on a timer to keep RSS flat', 'Gọi <code>global.gc()</code> định kỳ để RSS đi ngang'),
            B('Raise <code>--max-old-space-size</code> so the heap has room', 'Nâng <code>--max-old-space-size</code> cho heap có chỗ'),
          ],
          correct: 0,
          explanation: EX(
            'The first doubling is V8 growing its heap to a working size — which is why "RSS is 120MB, is that bad?" is unanswerable and "RSS rose 90MB over 100.000 requests and has not stopped" is a diagnosis. A five-word LRU (<code>if (cache.size &gt;= 1000) cache.delete(cache.keys().next().value)</code>) kept the whole benefit at 2,3MB instead of 295MB and unbounded. Two related traps: the <code>MaxListenersExceededWarning</code> suggests raising the limit — do not, that silences the alarm and keeps the leak; and Buffers live OUTSIDE the V8 heap, so a process at 200MB heap and 1,5GB RSS dies by container limit with exit 137 and no stack trace.',
            'Cú tăng gấp đôi đầu tiên là V8 mở heap tới kích thước làm việc — vì thế câu "RSS 120MB, có tệ không?" là câu không trả lời được, còn "RSS tăng 90MB qua 100.000 request và chưa dừng" mới là một chẩn đoán. Một cái LRU dài đúng một dòng (<code>if (cache.size &gt;= 1000) cache.delete(cache.keys().next().value)</code>) giữ nguyên toàn bộ lợi ích của cache mà chỉ tốn 2,3MB thay vì 295MB và không giới hạn. Hai cái bẫy liên quan: cảnh báo <code>MaxListenersExceededWarning</code> khuyên nâng giới hạn — đừng, làm thế là tắt chuông báo mà vẫn giữ nguyên chỗ rò; và Buffer nằm NGOÀI heap của V8, nên một tiến trình heap 200MB mà RSS 1,5GB sẽ chết vì giới hạn container với mã thoát 137 và không có stack trace nào.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>fast-json-stringify</code> really is 1,39× faster than <code>JSON.stringify</code> on a 112KB payload. On the route from chapter 16.2, where serialisation is 0,8% of request time, what does adopting it buy?',
            '<code>fast-json-stringify</code> đúng là nhanh hơn <code>JSON.stringify</code> 1,39 lần với payload 112KB. Trên route ở bài 16.2, nơi tuần tự hoá chiếm 0,8% thời gian mỗi request, việc áp dụng nó mua được gì?',
          ),
          options: [
            B('About 0,23% — a day of work, a schema to maintain and a new dependency', 'Khoảng 0,23% — một ngày công, một lược đồ phải nuôi và một phụ thuộc mới'),
            B('About 39%, since the library is 1,39× faster', 'Khoảng 39%, vì thư viện nhanh hơn 1,39 lần'),
            B('Nothing measurable, because it is slower on small objects', 'Không đo được gì, vì nó chậm hơn với object nhỏ'),
            B('It doubles throughput once the schema is compiled', 'Nó gấp đôi thông lượng khi lược đồ đã được biên dịch'),
          ],
          correct: 0,
          explanation: EX(
            'A speed-up in isolation means nothing until you know what fraction of the total it touches. Compare: pre-serialising made the same work 22.000× faster by NOT DOING it. The chapter\'s ranking is the takeaway — (1) do less work: cache 120×, index 222×, fewer fields 2,8×, keep-alive 9,4×; (2) do it once: precompute, batch; (3) do it elsewhere: queue, CDN, nginx; (4) add hardware: cluster 3,4×; (5) make it faster: 1,0–1,4×, LAST. Every large win removes work; every small win makes the same work faster.',
            'Một con số nhanh hơn khi đứng riêng chẳng có nghĩa gì cho tới khi bạn biết nó chạm vào bao nhiêu phần trăm tổng thể. So sánh xem: tuần tự hoá sẵn làm đúng công việc đó nhanh hơn 22.000 lần bằng cách KHÔNG LÀM nó. Bảng xếp hạng của chương mới là thứ đáng mang theo — (1) bớt việc: cache 120×, chỉ mục 222×, ít trường hơn 2,8×, keep-alive 9,4×; (2) làm một lần: tính sẵn, gom lô; (3) làm chỗ khác: hàng đợi, CDN, nginx; (4) thêm phần cứng: cluster 3,4×; (5) làm nhanh hơn: 1,0–1,4×, LÀM SAU CÙNG. Mọi thắng lợi lớn đều đến từ bỏ bớt việc; mọi thắng lợi nhỏ đều đến từ làm cùng công việc ấy nhanh hơn.',
          ),
        }),

        // ── Chương 17 — Docker & triển khai ─────────────────────────────
        mcq({
          prompt: B(
            'The same app: <code>FROM node:22</code> + <code>COPY . .</code> + <code>npm install</code> gives 440MB; <code>node:22-alpine</code> + <code>npm ci --omit=dev</code> gives 58,8MB. Your app uses <code>sharp</code>. Which base do you pick?',
            'Cùng một ứng dụng: <code>FROM node:22</code> + <code>COPY . .</code> + <code>npm install</code> ra 440MB; <code>node:22-alpine</code> + <code>npm ci --omit=dev</code> ra 58,8MB. Ứng dụng của bạn có dùng <code>sharp</code>. Chọn ảnh nền nào?',
          ),
          options: [
            B('alpine — 20MB smaller and native modules work the same', 'alpine — nhỏ hơn 20MB và module native vẫn chạy y hệt'),
            B('slim — alpine uses musl instead of glibc, and native modules are where that hurts', 'slim — alpine dùng musl thay vì glibc, và module native chính là chỗ đau'),
            B('node:22 — native modules need the full toolchain at runtime', 'node:22 — module native cần đủ bộ công cụ biên dịch lúc chạy'),
            B('distroless — it is the only base that supports sharp', 'distroless — chỉ ảnh nền này mới hỗ trợ sharp'),
          ],
          correct: 1,
          explanation: EX(
            'Pure-JavaScript packages do not care; anything with a <code>.node</code> binary does — sharp, bcrypt, canvas. They either fail to install, silently fall back to a slower pure-JS path, or crash at runtime on a code path you did not test. Multi-stage is what recovers most of the size anyway: build with the toolchain and devDependencies in a stage you throw away, copy only <code>node_modules</code> (production) and <code>dist</code> into the runner — 77,5MB, and the compiler never ships. Three runner lines earn their place regardless of size: <code>ENV NODE_ENV=production</code>, <code>USER node</code> (containers default to ROOT), and <code>npm ci</code> rather than <code>npm install</code>.',
            'Gói thuần JavaScript thì không quan tâm; thứ gì có nhị phân <code>.node</code> mới quan tâm — sharp, bcrypt, canvas. Chúng hoặc cài không nổi, hoặc âm thầm rơi về nhánh JS thuần chậm hơn, hoặc cài xong rồi sập lúc chạy ở một nhánh mã bạn chưa test. Dù sao thì multi-stage mới là thứ lấy lại phần lớn dung lượng: build kèm bộ công cụ và devDependencies trong một giai đoạn rồi vứt đi, chỉ chép <code>node_modules</code> (bản production) và <code>dist</code> sang giai đoạn chạy — 77,5MB, và trình biên dịch không bao giờ lên máy chủ. Ba dòng trong giai đoạn chạy đáng giá bất kể dung lượng: <code>ENV NODE_ENV=production</code>, <code>USER node</code> (container mặc định chạy bằng ROOT), và <code>npm ci</code> chứ không phải <code>npm install</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Swapping two lines made every rebuild 5,6× slower (0,54s → 3,00s) after a one-line source change:' + code(
              '# A\n' +
              'COPY package*.json ./\n' +
              'RUN npm ci --omit=dev\n' +
              'COPY src ./src\n\n' +
              '# B\n' +
              'COPY . .\n' +
              'RUN npm ci --omit=dev',
            ) + 'Why?',
            'Đảo hai dòng làm mọi lần build lại chậm gấp 5,6 lần (0,54s → 3,00s) sau khi sửa một dòng mã nguồn:' + code(
              '# A\n' +
              'COPY package*.json ./\n' +
              'RUN npm ci --omit=dev\n' +
              'COPY src ./src\n\n' +
              '# B\n' +
              'COPY . .\n' +
              'RUN npm ci --omit=dev',
            ) + 'Vì sao?',
          ),
          options: [
            B('A changed layer rebuilds EVERY layer after it, so B re-runs npm ci', 'Một tầng đổi thì MỌI tầng sau nó phải build lại, nên B chạy lại npm ci'),
            B('<code>COPY . .</code> is slower than <code>COPY src ./src</code> by itself', 'Bản thân <code>COPY . .</code> chậm hơn <code>COPY src ./src</code>'),
            B('npm ci is non-deterministic and cannot be cached', 'npm ci không xác định nên không cache được'),
            B('Docker only caches the first three instructions of a Dockerfile', 'Docker chỉ cache ba chỉ thị đầu tiên của một Dockerfile'),
          ],
          correct: 0,
          explanation: EX(
            'Put what rarely changes at the top and what changes every commit at the bottom. The 5,6× here is on a three-package project; on a real backend with native modules and a sharp binary download, that reinstall is minutes on every deploy, forever, purely because of line order. Pair it with a four-line <code>.dockerignore</code> (<code>node_modules</code>, <code>.git</code>, <code>.env</code>, <code>dist</code>): it took the build context from 64,27MB to 235 bytes, the build from 6,33s to 3,06s, and removed 17,6MB of the HOST\'s node_modules — compiled for the wrong architecture — from the image.',
            'Hãy đặt thứ ít đổi lên trên và thứ đổi mỗi commit xuống dưới. Con số 5,6 lần ở đây là trên dự án ba gói; với một backend thật có module native và một lần tải nhị phân sharp thì lần cài lại ấy tính bằng phút, ở mọi lần deploy, mãi mãi, chỉ vì thứ tự dòng. Đi kèm là một file <code>.dockerignore</code> bốn dòng (<code>node_modules</code>, <code>.git</code>, <code>.env</code>, <code>dist</code>): nó đưa ngữ cảnh build từ 64,27MB xuống 235 byte, build từ 6,33s còn 3,06s, và gỡ 17,6MB node_modules của MÁY BẠN — biên dịch cho sai kiến trúc — ra khỏi ảnh.',
          ),
        }),

        mcq({
          prompt: B(
            'Three containers, same application, same graceful-shutdown handler. Only one printed "SIGTERM received" when stopped:' + code(
              'CMD ["npm", "start"]           → PID 1 = npm start\n' +
              'CMD node src/index.js          → PID 1 = sh\n' +
              'CMD ["node", "src/index.js"]   → PID 1 = node',
            ) + 'What happened to the other two?',
            'Ba container, cùng một ứng dụng, cùng một hàm tắt êm. Chỉ MỘT cái in ra "đã nhận SIGTERM" khi bị dừng:' + code(
              'CMD ["npm", "start"]           → PID 1 = npm start\n' +
              'CMD node src/index.js          → PID 1 = sh\n' +
              'CMD ["node", "src/index.js"]   → PID 1 = node',
            ) + 'Hai cái kia bị gì?',
          ),
          options: [
            B('SIGTERM goes to PID 1: npm killed its child and <code>sh</code> forwards nothing', 'SIGTERM đi tới PID 1: npm giết tiến trình con, còn <code>sh</code> không chuyển tiếp gì'),
            B('They did run the handler, but their log output was lost', 'Chúng có chạy hàm xử lý, chỉ là phần log bị mất'),
            B('They need a longer <code>stop_grace_period</code>', 'Chúng cần <code>stop_grace_period</code> dài hơn'),
            B('Only the exec form of CMD supports HEALTHCHECK', 'Chỉ dạng exec của CMD mới hỗ trợ HEALTHCHECK'),
          ],
          correct: 0,
          explanation: EX(
            'The shutdown handler exists in the source, is correct, and has never once executed in production — the client of a 3-second request simply gets a dropped connection on every deploy. Getting the signal is necessary and not sufficient: on Docker 29.5.3 a bare <code>docker stop</code> killed the container after ~1,26s (exit 137 = 128+9 = SIGKILL) while the request needed 3 seconds, so set <code>stop_grace_period</code> explicitly. If the entrypoint must run a script (migrations), end it with <code>exec node dist/index.js</code> — <code>exec</code> replaces the shell so node becomes PID 1.',
            'Hàm tắt êm có trong mã nguồn, viết đúng, và chưa từng chạy lấy một lần trên production — người dùng có request kéo dài 3 giây chỉ đơn giản là bị cắt kết nối ở mọi lần deploy. Nhận được tín hiệu là điều kiện cần chứ chưa đủ: trên Docker 29.5.3, lệnh <code>docker stop</code> trần giết container sau ~1,26 giây (mã thoát 137 = 128+9 = SIGKILL) trong khi request cần 3 giây, nên phải đặt rõ <code>stop_grace_period</code>. Nếu entrypoint bắt buộc phải chạy script (chạy migration) thì hãy kết thúc bằng <code>exec node dist/index.js</code> — <code>exec</code> thay thế shell nên node trở thành PID 1.',
          ),
        }),

        mcq({
          prompt: B(
            'A Dockerfile writes a token to <code>.npmrc</code> and deletes it in the SAME <code>RUN</code>, and sets <code>ENV DATABASE_URL=$DATABASE_URL</code> from a build ARG. Both secrets were found in the built image. Where?',
            'Một Dockerfile ghi token vào <code>.npmrc</code> rồi xoá ngay trong CÙNG một lệnh <code>RUN</code>, và đặt <code>ENV DATABASE_URL=$DATABASE_URL</code> từ một build ARG. Cả hai bí mật đều bị tìm thấy trong ảnh đã build. Ở đâu?',
          ),
          options: [
            B('In <code>docker history</code> (the command text, with ARGs substituted) and in <code>Config.Env</code>', 'Trong <code>docker history</code> (nguyên văn lệnh, đã thay ARG) và trong <code>Config.Env</code>'),
            B('In the deleted file, which is still in the layer below', 'Trong file đã xoá, nó vẫn còn ở tầng bên dưới'),
            B('Nowhere — the image is clean, the scanner was wrong', 'Không đâu cả — ảnh sạch, công cụ quét báo nhầm'),
            B('Only in the build cache on the machine that built it', 'Chỉ trong cache build trên máy đã build ảnh'),
          ],
          correct: 0,
          explanation: EX(
            'The <code>rm -f</code> was genuinely correct — the file is in no layer. But <code>docker history</code> stores the command that created each layer with build arguments already substituted, so the token is plain text in the metadata; and <code>ENV</code> wrote the production database password into <code>Config.Env</code>, where it is automatically present in every container started from that image. The mistake looks like the fix. The right mechanism is a BuildKit secret mount (<code>RUN --mount=type=secret,…</code>) — the file exists for one command, in tmpfs, never in a layer or in history. And once a secret has shipped, ROTATE it: deleting a layer does not un-pull the image.',
            'Lệnh <code>rm -f</code> thật ra làm đúng — file không nằm trong tầng nào cả. Nhưng <code>docker history</code> lưu lại nguyên văn lệnh tạo ra từng tầng kèm giá trị ARG đã thay, nên token nằm đó dưới dạng chữ thường; còn <code>ENV</code> đã ghi mật khẩu cơ sở dữ liệu production vào <code>Config.Env</code>, nơi nó tự động có mặt trong môi trường của MỌI container chạy từ ảnh đó. Cái sai trông y hệt cách sửa. Cơ chế đúng là secret mount của BuildKit (<code>RUN --mount=type=secret,…</code>) — file chỉ tồn tại trong đúng một lệnh, nằm trên tmpfs, không vào tầng nào cũng không vào history. Và một khi bí mật đã lọt ra thì phải XOAY khoá: xoá một tầng không lấy lại được cái ảnh mà người ta đã tải về.',
          ),
        }),

        mcq({
          prompt: B(
            'A feature stopped working after a deploy. The container is up, the health check passes, and the route file exists inside the image. Two commands settle it:' + code(
              'curl -s -o /dev/null -w "%{http_code}" https://site/api/v1/gifs             → 404\n' +
              'curl -s -o /dev/null -w "%{http_code}" https://site/api/v1/messages/threads → 401',
            ) + 'What do they prove?',
            'Một tính năng ngừng chạy sau khi deploy. Container vẫn sống, health check vẫn xanh, và file route vẫn nằm trong ảnh. Hai lệnh sau kết luận vấn đề:' + code(
              'curl -s -o /dev/null -w "%{http_code}" https://site/api/v1/gifs             → 404\n' +
              'curl -s -o /dev/null -w "%{http_code}" https://site/api/v1/messages/threads → 401',
            ) + 'Chúng chứng minh điều gì?',
          ),
          options: [
            B('401 = route MOUNTED, wants credentials; 404 = not in this process → stale build', '401 = route ĐÃ GẮN, chỉ đòi xác thực; 404 = không có trong tiến trình này → build cũ'),
            B('Both are authentication problems; the token expired', 'Cả hai đều là vấn đề xác thực; token đã hết hạn'),
            B('404 means the nginx config lost that location block', 'Mã 404 nghĩa là cấu hình nginx mất khối location đó'),
            B('Nothing yet — you have to reproduce it in the browser first', 'Chưa chứng minh gì — phải tái hiện trong trình duyệt trước đã'),
          ],
          correct: 0,
          explanation: EX(
            'The file was in the image; the running process had never mounted it — a partial deploy had shipped a stale <code>dist/index.js</code>, and the health check passed because it hits exactly one route. Diagnose with curl, not a browser: a browser sends cookies, follows redirects, caches, and renders a generic error page for all four cases. The guard is a smoke test at the end of every deploy that curls one param-less unauthenticated GET per feature module and FAILS the deploy on any 404 — and only such routes, or every deploy false-fails and the check gets deleted within a week.',
            'File có trong ảnh; nhưng tiến trình đang chạy chưa bao giờ gắn nó — một lần deploy dở dang đã đẩy lên bản <code>dist/index.js</code> cũ, và health check vẫn xanh vì nó chỉ chạm đúng một route. Hãy chẩn đoán bằng curl chứ không phải trình duyệt: trình duyệt gửi cookie, đi theo chuyển hướng, cache lung tung, và vẽ ra cùng một trang lỗi chung cho cả bốn trường hợp. Lá chắn là một bài smoke test ở cuối mỗi lần deploy: curl một route GET không tham số, không cần xác thực cho mỗi mô-đun tính năng, và LÀM HỎNG lần deploy nếu có cái nào trả 404 — và chỉ được đưa vào loại route như thế, nếu không mọi lần deploy đều báo động giả và bài kiểm ấy bị xoá trong vòng một tuần.',
          ),
        }),

        // ── Chương 18 — Kiến trúc ───────────────────────────────────────
        mcq({
          prompt: B(
            'A measurement of the production backend: 28 of 62 route files (45%) import Prisma directly, skipping the service layer. What exactly does that cost?',
            'Một phép đo trên backend production: 28 trong 62 file route (45%) import thẳng Prisma, bỏ qua tầng service. Cái giá cụ thể là gì?',
          ),
          options: [
            B('The day a rule must apply everywhere, it is 28 edits instead of 1', 'Đúng ngày một quy tắc phải áp cho tất cả, phải sửa 28 chỗ thay vì 1'),
            B('Slower queries, because the route layer cannot use the connection pool', 'Truy vấn chậm hơn, vì tầng route không dùng được pool kết nối'),
            B('Nothing — a layer that only forwards a call is pure ceremony', 'Không mất gì — một tầng chỉ chuyển tiếp lời gọi thì chỉ là hình thức'),
            B('TypeScript can no longer infer the handler return types', 'TypeScript không còn suy ra được kiểu trả về của handler'),
          ],
          correct: 0,
          explanation: EX(
            'Nobody decided this; it happened one endpoint at a time, each time for a good local reason. The honest test is not "is there business logic today" but "if a rule had to apply to every note, would this endpoint get it automatically?" — if the answer is no, the layer is load-bearing even when it looks empty. Note which boundary this project WAS strict about, and rightly: authentication, request id, rate limiting and error handling all live in middleware mounted once, so no route can opt out. A route that skips the service writes an awkward query; a route that skips <code>requireAuth</code> is an incident.',
            'Không ai quyết định chuyện này cả; nó xảy ra từng endpoint một, lần nào cũng có một lý do cục bộ hợp lý. Phép thử trung thực không phải "hôm nay ở đây có quy tắc nghiệp vụ nào không" mà là "nếu một quy tắc phải áp cho MỌI ghi chú thì endpoint này có tự động nhận được nó không?" — nếu không thì cái tầng ấy vẫn đang chịu lực, dù nhìn có vẻ rỗng. Để ý ranh giới mà dự án này ĐÃ nghiêm khắc, và nghiêm khắc đúng: xác thực, mã request, giới hạn tần suất và xử lý lỗi đều nằm trong middleware gắn một lần, nên không route nào tự ý ra ngoài được. Route bỏ qua service thì viết ra một câu truy vấn hơi vụng; route bỏ qua <code>requireAuth</code> thì thành một sự cố.',
          ),
        }),

        mcq({
          prompt: B(
            'The import graph shows which service depends on which. Which kind of coupling does it NOT show — and which is measured by "248 models in one schema, 76 route groups"?',
            'Đồ thị import cho thấy service nào phụ thuộc service nào. Loại ghép nối nào nó KHÔNG thấy được — và loại nào được đo bằng "248 model trong một lược đồ, 76 nhóm route"?',
          ),
          options: [
            B('Hidden coupling: two modules that never import each other but share the same tables', 'Ghép nối ẩn: hai mô-đun không hề import nhau nhưng dùng chung bảng'),
            B('Circular coupling, which no tool can detect', 'Ghép nối vòng tròn, thứ mà không công cụ nào phát hiện được'),
            B('Coupling to external services like R2 and Redis', 'Ghép nối với dịch vụ bên ngoài như R2 và Redis'),
            B('Coupling introduced by TypeScript type imports', 'Ghép nối sinh ra từ việc import kiểu trong TypeScript'),
          ],
          correct: 0,
          explanation: EX(
            'Two features that never import each other are still coupled if one adds a column the other\'s <code>SELECT *</code> now returns, renames a table the other queries, or holds a lock the other waits on. The database is the largest shared mutable object in most systems and it is invisible to every dependency analysis you will run — two "independent" modules sharing a table are one module with two names. This is not an argument for splitting the database; it is an argument for knowing that your module boundary is only as real as the schema underneath allows. A folder is not a boundary; a separate package is a weak-to-real one; a separate process is hard; a separate database is final.',
            'Hai tính năng chẳng bao giờ import nhau vẫn ghép chặt với nhau nếu một bên thêm cột mà <code>SELECT *</code> của bên kia giờ trả về, đổi tên một bảng bên kia đang truy vấn, hoặc giữ một khoá bên kia đang chờ. Cơ sở dữ liệu là đối tượng dùng chung có thể thay đổi lớn nhất trong hầu hết hệ thống, và nó vô hình trước mọi phép phân tích phụ thuộc bạn chạy — hai mô-đun "độc lập" dùng chung một bảng thực chất là một mô-đun mang hai cái tên. Đây không phải lời kêu gọi tách cơ sở dữ liệu; đây là lời nhắc rằng ranh giới mô-đun của bạn chỉ thật đến mức mà lược đồ bên dưới cho phép. Thư mục không phải ranh giới; gói riêng là ranh giới yếu-đến-thật; tiến trình riêng là ranh giới cứng; cơ sở dữ liệu riêng là ranh giới cuối cùng.',
          ),
        }),

        mcq({
          prompt: B(
            'Which is the strongest genuine reason to split a monolith into services?',
            'Lý do CHÍNH ĐÁNG mạnh nhất để tách một khối nguyên thành các dịch vụ là gì?',
          ),
          options: [
            B('The codebase has grown past 80.000 lines of TypeScript', 'Mã nguồn đã vượt quá 80.000 dòng TypeScript'),
            B('Teams are stepping on each other: conflicts, deploy queues, fear of the file', 'Các đội đang giẫm chân nhau: xung đột, xếp hàng chờ deploy, ngại đụng vào file'),
            B('Microservices scale better once the load gets real', 'Microservice mở rộng tốt hơn khi tải thật sự lớn'),
            B('It makes the system easier to test', 'Nó làm hệ thống dễ kiểm thử hơn'),
          ],
          correct: 1,
          explanation: EX(
            'A service boundary that does not match a team boundary is pure cost — one person maintaining six services has all the failure modes and none of the benefit. The scaling argument is already refuted by measurement: chapter 16 got 3,4× from clustering a CPU-bound route and 5,7% from an I/O-bound one, and 97,8% of this system\'s request time is inside a database call. What splitting definitely costs: every function call can now fail (timeout, retry, partial success), JOINs become three network calls plus an in-memory merge, and transactions disappear — payment succeeded, inventory failed, and now you need idempotency keys, compensating actions and a reconciliation job. The default that is right more often than it is chosen: a modular monolith, split later when a specific measured pain arrives.',
            'Một ranh giới dịch vụ không trùng với ranh giới đội ngũ thì thuần tuý là chi phí — một người nuôi sáu dịch vụ thì hứng đủ mọi kiểu hỏng mà chẳng được lợi ích nào. Lý lẽ về mở rộng đã bị chính phép đo bác bỏ: chương 16 lời 3,4 lần khi cluster một route nặng CPU và chỉ 5,7% với route nghẽn I/O, mà 97,8% thời gian mỗi request của hệ thống này nằm trong một lời gọi cơ sở dữ liệu. Còn tách ra thì chắc chắn phải trả: mọi lời gọi hàm giờ đều hỏng được (quá hạn, thử lại, thành công một phần), JOIN biến thành ba lời gọi mạng cộng một phép gộp trong bộ nhớ, và transaction biến mất — trừ tiền xong, trừ kho hỏng, và giờ bạn cần idempotency key, hành động bù trừ, cùng một job đối soát. Lựa chọn mặc định đúng nhiều hơn số lần được chọn: một khối nguyên có mô-đun rõ ràng, tách sau khi một nỗi đau cụ thể đã đo được thật sự xuất hiện.',
          ),
        }),

        mcq({
          prompt: B(
            'Which of these is a ONE-WAY door — a decision whose reversal costs months rather than an afternoon?',
            'Cái nào dưới đây là CỬA MỘT CHIỀU — quyết định mà đảo ngược tốn hàng tháng chứ không phải một buổi chiều?',
          ),
          options: [
            B('The logging library', 'Thư viện ghi log'),
            B('Exposing sequential integer ids in public URLs', 'Đưa id số nguyên tuần tự ra URL công khai'),
            B('The compression level', 'Mức nén'),
            B('The database connection pool size', 'Kích thước pool kết nối cơ sở dữ liệu'),
          ],
          correct: 1,
          explanation: EX(
            'Sequential ids leak how many records exist and invite IDOR (chapter 8), and switching to UUIDs later kills every existing link. The other three are two-way doors: change them in an afternoon. The failure mode is treating them the same — weeks spent on the eternal ORM debate while a one-way door is walked through casually. The other one-way doors named in the course: the database schema (data outlives code; a failed migration gave P3018 then P3009 blocking every later deploy), a public API contract, the authentication model (changing token generation logs everyone out), and timestamp vs timestamptz. The habit that helps: write down WHY, including the alternative you rejected and the condition under which the decision should be revisited — without that last line, a deliberate trade-off is indistinguishable from an oversight.',
            'Id tuần tự để lộ số lượng bản ghi và mời gọi IDOR (chương 8), còn đổi sang UUID về sau thì mọi đường link cũ chết sạch. Ba thứ còn lại là cửa hai chiều: đổi trong một buổi chiều là xong. Kiểu sai lầm là đối xử với chúng như nhau — mất hàng tuần tranh cãi về ORM trong khi bước qua một cửa một chiều nhẹ tênh. Những cửa một chiều khác mà khoá học nêu tên: lược đồ cơ sở dữ liệu (dữ liệu sống lâu hơn mã; một migration hỏng cho ra P3018 rồi P3009 chặn mọi lần deploy sau), hợp đồng API công khai, mô hình xác thực (đổi cách sinh token là đăng xuất toàn bộ người dùng), và chuyện timestamp hay timestamptz. Thói quen giúp ích: ghi lại LÝ DO, kèm phương án đã loại và điều kiện để xem xét lại quyết định — thiếu dòng cuối đó thì một sự đánh đổi có chủ đích không phân biệt được với một sơ suất.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Retries that do not charge the customer twice (chapter 13).</b> Implement <code>createRunner({ attempts, baseDelayMs, sleep })</code> returning an async <code>run(job, handler)</code>.</p>' +
            '<ul>' +
            '<li><b>Idempotency:</b> if this <code>job.id</code> already completed successfully, return <code>{ status: "skipped", attemptsMade: 0, delays: [] }</code> without calling the handler.</li>' +
            '<li><b>Success:</b> return <code>{ status: "ok", attemptsMade, delays, value }</code> — <code>attemptsMade</code> counts the attempt that succeeded.</li>' +
            '<li><b>Retry:</b> on a normal error, wait via the injected <code>sleep(ms)</code> and try again, up to <code>attempts</code> times. The delay before retry number <i>k</i> (1-based) is <code>baseDelayMs * 2 ** (k - 1)</code> — exponential backoff. Collect each delay you actually waited into <code>delays</code>.</li>' +
            '<li><b>Unrecoverable:</b> if the thrown error has <code>err.unrecoverable === true</code>, stop IMMEDIATELY — no retry, no delay.</li>' +
            '<li><b>Give up:</b> after the last attempt return <code>{ status: "failed", attemptsMade, delays, reason }</code>, where <code>reason</code> is the error <b>message</b>. Note there is no delay AFTER the final attempt.</li>' +
            '</ul>' +
            '<p><code>sleep</code> is injected so the test is instant and deterministic — do not call <code>setTimeout</code> yourself. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 31 — Thử lại mà không trừ tiền khách hai lần (chương 13).</b> Cài đặt <code>createRunner({ attempts, baseDelayMs, sleep })</code> trả về một hàm async <code>run(job, handler)</code>.</p>' +
            '<ul>' +
            '<li><b>Idempotent:</b> nếu <code>job.id</code> này đã từng chạy xong thành công thì trả <code>{ status: "skipped", attemptsMade: 0, delays: [] }</code> mà không gọi handler.</li>' +
            '<li><b>Thành công:</b> trả <code>{ status: "ok", attemptsMade, delays, value }</code> — <code>attemptsMade</code> tính cả lần thử thành công.</li>' +
            '<li><b>Thử lại:</b> gặp lỗi thường thì chờ bằng hàm <code>sleep(ms)</code> được truyền vào rồi thử tiếp, tối đa <code>attempts</code> lần. Khoảng chờ trước lần thử lại thứ <i>k</i> (đếm từ 1) là <code>baseDelayMs * 2 ** (k - 1)</code> — backoff luỹ thừa. Gom mọi khoảng chờ đã THẬT SỰ chờ vào <code>delays</code>.</li>' +
            '<li><b>Không cứu được:</b> nếu lỗi ném ra có <code>err.unrecoverable === true</code> thì dừng NGAY — không thử lại, không chờ.</li>' +
            '<li><b>Bỏ cuộc:</b> sau lần thử cuối cùng thì trả <code>{ status: "failed", attemptsMade, delays, reason }</code>, với <code>reason</code> là <b>message</b> của lỗi. Lưu ý không có khoảng chờ SAU lần thử cuối.</li>' +
            '</ul>' +
            '<p><code>sleep</code> được truyền từ ngoài vào để bài chạy tức thì và cho kết quả xác định — đừng tự gọi <code>setTimeout</code>. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const charges = [];                       // "đã trừ tiền" — mỗi phần tử là một lần gọi cổng thanh toán\n' +
            'function makeHandler(failTimes, { unrecoverable = false } = {}) {\n' +
            '  let n = 0;\n' +
            '  return async (job) => {\n' +
            '    n++;\n' +
            '    if (n <= failTimes) {\n' +
            "      const err = new Error(unrecoverable ? 'người dùng không tồn tại' : 'SMTP 421');\n" +
            '      err.unrecoverable = unrecoverable;\n' +
            '      throw err;\n' +
            '    }\n' +
            '    charges.push(job.id);\n' +
            "    return 'ok:' + job.id;\n" +
            '  };\n' +
            '}\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function createRunner({ attempts, baseDelayMs, sleep }) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '(async () => {\n' +
            '  const slept = [];\n' +
            '  const run = createRunner({ attempts: 5, baseDelayMs: 200, sleep: async (ms) => { slept.push(ms); } });\n\n' +
            "  console.log('1', JSON.stringify(await run({ id: 'ORD-1' }, makeHandler(0))));\n" +
            "  console.log('2', JSON.stringify(await run({ id: 'ORD-2' }, makeHandler(2))));\n" +
            "  console.log('3', JSON.stringify(await run({ id: 'ORD-3' }, makeHandler(99))));\n" +
            "  console.log('4', JSON.stringify(await run({ id: 'ORD-4' }, makeHandler(99, { unrecoverable: true }))));\n" +
            "  console.log('5', JSON.stringify(await run({ id: 'ORD-2' }, makeHandler(0))));\n" +
            "  console.log('charges=' + JSON.stringify(charges));\n" +
            "  console.log('slept=' + JSON.stringify(slept));\n" +
            '})();\n',
          expectedOutput:
            '1 {"status":"ok","attemptsMade":1,"delays":[],"value":"ok:ORD-1"}\n' +
            '2 {"status":"ok","attemptsMade":3,"delays":[200,400],"value":"ok:ORD-2"}\n' +
            '3 {"status":"failed","attemptsMade":5,"delays":[200,400,800,1600],"reason":"SMTP 421"}\n' +
            '4 {"status":"failed","attemptsMade":1,"delays":[],"reason":"người dùng không tồn tại"}\n' +
            '5 {"status":"skipped","attemptsMade":0,"delays":[]}\n' +
            'charges=["ORD-1","ORD-2"]\n' +
            'slept=[200,400,200,400,800,1600]',
          sampleSolution:
            'function createRunner({ attempts, baseDelayMs, sleep }) {\n' +
            '  const done = new Set();   // job.id đã chạy xong — đây là phần idempotency\n\n' +
            '  return async function run(job, handler) {\n' +
            "    if (done.has(job.id)) return { status: 'skipped', attemptsMade: 0, delays: [] };\n\n" +
            '    const delays = [];\n' +
            '    for (let attemptsMade = 1; attemptsMade <= attempts; attemptsMade++) {\n' +
            '      try {\n' +
            '        const value = await handler(job);\n' +
            '        done.add(job.id);\n' +
            "        return { status: 'ok', attemptsMade, delays, value };\n" +
            '      } catch (err) {\n' +
            '        // Lỗi logic (không cứu được) thì hỏng NGAY, đừng phí 4 lần thử.\n' +
            '        if (err.unrecoverable || attemptsMade === attempts) {\n' +
            "          return { status: 'failed', attemptsMade, delays, reason: err.message };\n" +
            '        }\n' +
            '        const delay = baseDelayMs * 2 ** (attemptsMade - 1);\n' +
            '        delays.push(delay);\n' +
            '        await sleep(delay);\n' +
            '      }\n' +
            '    }\n' +
            '  };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Redact and sample the log stream (chapter 15).</b> Implement <code>processLogs(records, { rate })</code>, the two things a log pipeline must do before shipping anything.</p>' +
            '<p><b>1. Redact.</b> Anywhere in the record — at any depth, inside objects and arrays — a key named <code>password</code>, <code>token</code>, <code>authorization</code> or <code>cookie</code> (case-insensitive) must have its value replaced with the string <code>[DA CHE]</code>. Do not modify the input records; build new objects. Every other field is kept as-is.</p>' +
            '<p><b>2. Sample.</b> Keep a record when ANY of these holds:</p>' +
            '<ul>' +
            '<li><code>status &gt;= 500</code> — always keep errors</li>' +
            '<li><code>durationMs &gt; 1000</code> — always keep slow requests</li>' +
            '<li><code>stableHash(record.requestId) % 10000 &lt; rate * 10000</code> — the sampled fraction</li>' +
            '</ul>' +
            '<p>Sampling must use the given <code>stableHash</code> of the <b>requestId</b>, never <code>Math.random()</code>: every line of one request has to be kept or dropped together, or the log holds orphaned fragments.</p>' +
            '<p>Return <code>{ kept, keptCount, droppedCount }</code> with <code>kept</code> in the original order. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Che bí mật và lấy mẫu dòng log (chương 15).</b> Cài đặt <code>processLogs(records, { rate })</code> — hai việc mà một đường ống log phải làm trước khi gửi bất cứ thứ gì đi.</p>' +
            '<p><b>1. Che.</b> Ở bất kỳ đâu trong bản ghi — mọi độ sâu, trong object lẫn trong mảng — khoá tên <code>password</code>, <code>token</code>, <code>authorization</code> hay <code>cookie</code> (không phân biệt hoa thường) đều phải bị thay giá trị bằng chuỗi <code>[DA CHE]</code>. Không được sửa bản ghi gốc; hãy dựng object mới. Mọi trường khác giữ nguyên.</p>' +
            '<p><b>2. Lấy mẫu.</b> Giữ lại một bản ghi khi thoả BẤT KỲ điều nào sau đây:</p>' +
            '<ul>' +
            '<li><code>status &gt;= 500</code> — luôn giữ lỗi</li>' +
            '<li><code>durationMs &gt; 1000</code> — luôn giữ request chậm</li>' +
            '<li><code>stableHash(record.requestId) % 10000 &lt; rate * 10000</code> — phần được lấy mẫu</li>' +
            '</ul>' +
            '<p>Việc lấy mẫu phải dùng hàm <code>stableHash</code> cho sẵn trên <b>requestId</b>, tuyệt đối không dùng <code>Math.random()</code>: mọi dòng của cùng một request phải cùng được giữ hoặc cùng bị bỏ, nếu không log chỉ còn những mẩu rời rạc.</p>' +
            '<p>Trả về <code>{ kept, keptCount, droppedCount }</code> với <code>kept</code> giữ nguyên thứ tự ban đầu. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Hàm băm ổn định (giống bài 15.3) — dùng nguyên, đừng đổi.\n' +
            'function stableHash(s) {\n' +
            '  let h = 0;\n' +
            '  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;\n' +
            '  return h;\n' +
            '}\n\n' +
            'const RECORDS = [\n' +
            "  { requestId: 'r-1', status: 200, durationMs: 12,   body: { email: 'a@b.com', password: 'MatKhauThat' } },\n" +
            "  { requestId: 'r-2', status: 500, durationMs: 40,   headers: { authorization: 'Bearer eyJ', accept: '*/*' } },\n" +
            "  { requestId: 'r-3', status: 200, durationMs: 8241, user: { id: 7, token: 'rt_xyz' } },\n" +
            "  { requestId: 'r-4', status: 200, durationMs: 30,   headers: { cookie: 'backend_token=abc123' } },\n" +
            "  { requestId: 'r-5', status: 404, durationMs: 5,    body: { q: 'node' } },\n" +
            "  { requestId: 'r-6', status: 200, durationMs: 11,   body: { nested: { password: 'lai-lo-nua' } } },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function processLogs(records, { rate }) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const out = processLogs(RECORDS, { rate: 0 });\n' +
            "console.log('kept=' + out.keptCount, 'dropped=' + out.droppedCount);\n" +
            "for (const r of out.kept) console.log(r.requestId, JSON.stringify(r));\n" +
            'const sampled = processLogs(RECORDS, { rate: 0.1 });\n' +
            "console.log('rate=0.1 kept=' + sampled.kept.map((r) => r.requestId).join(','));\n" +
            'const all = processLogs(RECORDS, { rate: 1 });\n' +
            "console.log('rate=1 kept=' + all.keptCount);\n" +
            "console.log('lo bi mat? ' + JSON.stringify(all.kept).includes('MatKhauThat'));\n",
          expectedOutput:
            'kept=2 dropped=4\n' +
            'r-2 {"requestId":"r-2","status":500,"durationMs":40,"headers":{"authorization":"[DA CHE]","accept":"*/*"}}\n' +
            'r-3 {"requestId":"r-3","status":200,"durationMs":8241,"user":{"id":7,"token":"[DA CHE]"}}\n' +
            'rate=0.1 kept=r-1,r-2,r-3\n' +
            'rate=1 kept=6\n' +
            'lo bi mat? false',
          sampleSolution:
            "const SECRET_KEYS = new Set(['password', 'token', 'authorization', 'cookie']);\n\n" +
            'function redact(value) {\n' +
            '  if (Array.isArray(value)) return value.map(redact);\n' +
            "  if (value && typeof value === 'object') {\n" +
            '    const out = {};\n' +
            '    for (const [k, v] of Object.entries(value)) {\n' +
            "      out[k] = SECRET_KEYS.has(k.toLowerCase()) ? '[DA CHE]' : redact(v);\n" +
            '    }\n' +
            '    return out;\n' +
            '  }\n' +
            '  return value;\n' +
            '}\n\n' +
            'function shouldKeep(record, rate) {\n' +
            '  if (record.status >= 500) return true;\n' +
            '  if (record.durationMs > 1000) return true;\n' +
            '  // Băm requestId, KHÔNG dùng Math.random: cả request phải cùng giữ hoặc cùng bỏ.\n' +
            '  return stableHash(record.requestId) % 10000 < rate * 10000;\n' +
            '}\n\n' +
            'function processLogs(records, { rate }) {\n' +
            '  const kept = [];\n' +
            '  for (const r of records) {\n' +
            '    if (!shouldKeep(r, rate)) continue;\n' +
            '    kept.push(redact(r));\n' +
            '  }\n' +
            '  return { kept, keptCount: kept.length, droppedCount: records.length - kept.length };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
