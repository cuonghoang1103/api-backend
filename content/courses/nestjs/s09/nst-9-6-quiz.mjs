/**
 * 9.6 — Kiểm tra Chương 9 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c9/o):
 * câu 1 91-khong-thu-lai, câu 2 91-bam-sau_JOB_ID=1_RM=1, câu 3 91-giet9, câu 4 91-sigterm-hooks, câu 5 92-ba-ban, câu 6 92-chong-cheo,
 * câu 7 92-tz, câu 8 93-co-ban-cho, câu 9 93-loi-nosuppress, câu 10 93-som. Phân bố đáp án: A2 B3 C2 D3.
 */
export default {
  title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
  slug: 'nst-9-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 9: thử lại mặc định, jobId với removeOnComplete, job chạy lại sau kill -9, tắt êm và pha onModuleDestroy, cron trên ba bản, lượt chồng nhau, múi giờ trong container, emitAsync với listener async, suppressErrors: false với emit(), và phát sự kiện trong onModuleInit.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter (Nest 12.6, @nestjs/bullmq 12.0 + BullMQ 6.7, @nestjs/schedule 12.0, @nestjs/event-emitter 12.0, Redis 7.4, PostgreSQL 16). Work outside the request fails quietly — later, in another process, or only when something is killed — so every question asks what really happens, not what the code seems to say.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can wire a queue, a processor and a separate worker process in Nest.</li>
<li>I can name four sources of duplicate jobs and the protection for each.</li>
<li>I can make a scheduled job run once across replicas.</li>
<li>I know when an in-process event is enough and when it must be a job.</li>
<li>I know the order of Nest's shutdown hooks and why it matters for workers.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương (Nest 12.6, @nestjs/bullmq 12.0 + BullMQ 6.7, @nestjs/schedule 12.0, @nestjs/event-emitter 12.0, Redis 7.4, PostgreSQL 16). Việc ngoài request hỏng một cách im lặng — chậm hơn, ở tiến trình khác, hoặc chỉ khi có thứ bị giết — nên câu nào cũng hỏi chuyện gì thật sự xảy ra, không phải mã trông có vẻ nói gì.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nối được hàng đợi, processor và tiến trình worker riêng trong Nest.</li>
<li>Tôi kể được bốn nguồn sinh job trùng và cách chặn từng nguồn.</li>
<li>Tôi làm được việc hẹn giờ chỉ chạy một lần dù có nhiều bản.</li>
<li>Tôi biết khi nào sự kiện trong tiến trình là đủ, khi nào phải là job.</li>
<li>Tôi biết thứ tự các hook tắt máy của Nest và vì sao nó quan trọng với worker.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'registerQueue({ name: \'email\' }) with no defaultJobOptions. The processor throws "421 SMTP temporarily refused" once. What happens to the job?|||registerQueue({ name: \'email\' }) không có defaultJobOptions. Processor ném "421 SMTP tạm thời từ chối" một lần. Job ra sao?',
        options: [
          'Retried 3 times with exponential backoff — the Nest default|||Thử lại 3 lần với backoff lũy thừa — mặc định của Nest',
          'Retried until it succeeds|||Thử lại tới khi thành công',
          'Moved back to wait after lockDuration|||Về hàng chờ sau lockDuration',
          'Failed permanently after one attempt|||Hỏng vĩnh viễn sau một lần chạy',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 9.1, section 3: ZCARD bull:email:failed = 1, ats = atm = 1, no email. Neither BullMQ nor Nest sets attempts; put attempts + backoff in defaultJobOptions.|||VI: Bài 9.1, mục 3: ZCARD bull:email:failed = 1, ats = atm = 1, không có email. Cả BullMQ lẫn Nest đều không đặt attempts; đặt attempts + backoff trong defaultJobOptions.',
      },
      {
        question: 'The controller adds jobs with { jobId: `approved-${id}` } and the queue has removeOnComplete: true. The lecturer approves booking 7; the job completes; the lecturer reloads and approves again. How many emails?|||Controller thêm job với { jobId: `approved-${id}` } và hàng đợi có removeOnComplete: true. Giảng viên duyệt lịch 7; job xong; giảng viên tải lại trang và duyệt lần nữa. Bao nhiêu email?',
        options: [
          '1 — the jobId blocks the second add|||1 — jobId chặn lần thêm thứ hai',
          '2 — the completed job was deleted, so the id was free again|||2 — job xong đã bị xoá nên id được giải phóng',
          '0 — the second add throws a duplicate-id error|||0 — lần thêm thứ hai ném lỗi trùng id',
          '1 — BullMQ remembers ids for 24 hours|||1 — BullMQ nhớ id trong 24 giờ',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 9.1, section 4c: two lines in the mailbox, both from job "approved-7". A jobId only deduplicates while the job exists; keep completed jobs (removeOnComplete: { age }) or deduplicate in the database.|||VI: Bài 9.1, mục 4c: hai dòng trong hộp thư, cả hai từ job "approved-7". jobId chỉ chặn trùng khi job còn tồn tại; giữ job đã xong (removeOnComplete: { age }) hoặc chặn trùng trong DB.',
      },
      {
        question: 'A worker sends the email, then is killed with kill -9 before the job finishes. A new worker picks the job up after the lock expires. The processor logs `lần ${job.attemptsMade + 1}`. What do the logs and the Redis hash show?|||Worker gửi email xong thì bị kill -9 trước khi job kết thúc. Worker mới lấy lại job sau khi khoá hết hạn. Processor ghi log `lần ${job.attemptsMade + 1}`. Log và hash Redis cho thấy gì?',
        options: [
          'Both logs say "lần 1"; ats = 2, atm = 1, stc = 1; two emails|||Cả hai log ghi "lần 1"; ats = 2, atm = 1, stc = 1; hai email',
          'Logs say "lần 1" then "lần 2"; one email|||Log ghi "lần 1" rồi "lần 2"; một email',
          'The job is failed with "job stalled more than allowable limit"|||Job hỏng với "job stalled more than allowable limit"',
          'The job stays active forever until someone removes it|||Job nằm active mãi tới khi có người gỡ',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 9.1, section 4d (91-giet9): attemptsMade does not count stalled re-runs; attemptsStarted (ats) does. Delivery is at-least-once — the handler must be idempotent.|||VI: Bài 9.1, mục 4d (91-giet9): attemptsMade không đếm lần chạy lại do treo; attemptsStarted (ats) thì có. Giao nhận là ít nhất một lần — hàm xử lý phải idempotent.',
      },
      {
        question: 'enableShutdownHooks() is on. A provider used by the processor closes its Redis connection in onModuleDestroy. SIGTERM arrives 0.5 s into a 3 s job. What happens?|||Đã bật enableShutdownHooks(). Một provider mà processor dùng đóng kết nối Redis ở onModuleDestroy. SIGTERM tới khi job 3 giây mới chạy 0,5 giây. Chuyện gì xảy ra?',
        options: [
          'The process exits immediately; the job is stalled|||Tiến trình thoát ngay; job bị treo',
          'The process waits ~2.5 s and the job completes|||Tiến trình chờ ~2,5 giây và job xong',
          'The process waits ~2.5 s, then the job fails with "Connection is closed."|||Tiến trình chờ ~2,5 giây, rồi job hỏng với "Connection is closed."',
          'Nest refuses to shut down until the job is removed|||Nest không chịu tắt cho tới khi job bị gỡ',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 9.1, section 5: @nestjs/bullmq closes workers in onModuleDestroy; hooks of one phase run concurrently, so the connection closed under the running job. Close shared resources in onApplicationShutdown.|||VI: Bài 9.1, mục 5: @nestjs/bullmq đóng worker ở onModuleDestroy; các hook cùng pha chạy đồng thời nên kết nối bị đóng ngay dưới chân job đang chạy. Đóng tài nguyên dùng chung ở onApplicationShutdown.',
      },
      {
        question: 'Three replicas of the app each have @Cron(\'*/2 * * * * *\') that increments a counter keyed by the tick. After a few seconds, what is each counter?|||Ba bản của ứng dụng, mỗi bản có @Cron(\'*/2 * * * * *\') tăng một bộ đếm có khoá là mốc lượt. Sau vài giây, mỗi bộ đếm bằng bao nhiêu?',
        options: [
          '1 — @nestjs/schedule elects a leader through the database|||1 — @nestjs/schedule bầu chọn một bản chủ qua DB',
          '3|||3',
          'Between 1 and 3, depending on the load balancer|||Từ 1 tới 3, tuỳ bộ cân bằng tải',
          '0 — crons are disabled when more than one replica is detected|||0 — cron bị tắt khi phát hiện có hơn một bản',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 9.2, section 2: every tick → 3. A Redis lock per tick or a BullMQ job scheduler gives 1 (sections 3–4).|||VI: Bài 9.2, mục 2: lượt nào cũng → 3. Khoá Redis theo lượt hoặc job scheduler của BullMQ cho 1 (mục 3–4).',
      },
      {
        question: 'A @Cron fires every 2 s; its work takes 4.5 s; no options are set. In one process, what is the most runs at the same time?|||Một @Cron chạy mỗi 2 giây; việc của nó mất 4,5 giây; không đặt tuỳ chọn nào. Trong một tiến trình, tối đa bao nhiêu lượt chạy cùng lúc?',
        options: [
          '1 — ticks are skipped while a run is active|||1 — các lượt bị bỏ qua khi có lượt đang chạy',
          '1 — ticks queue up and run one after another|||1 — các lượt xếp hàng và chạy lần lượt',
          '2 — the library allows one overlap|||2 — thư viện cho phép chồng một lượt',
          '3 — runs overlap|||3 — các lượt chồng lên nhau',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 9.2, section 5: "đang chạy cùng lúc: 3". waitForCompletion: true skips ticks instead.|||VI: Bài 9.2, mục 5: "đang chạy cùng lúc: 3". waitForCompletion: true thì bỏ qua lượt.',
      },
      {
        question: '@Cron(\'0 0 7 * * *\') with no timeZone, deployed in a node:22-alpine container (UTC). At what Vietnam time does it run?|||@Cron(\'0 0 7 * * *\') không đặt timeZone, chạy trong container node:22-alpine (UTC). Nó chạy lúc mấy giờ theo giờ Việt Nam?',
        options: [
          '14:00|||14:00',
          '07:00|||07:00',
          '00:00|||00:00',
          'It does not start: timeZone is required|||Không khởi động được: timeZone là bắt buộc',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 9.2, section 7: with TZ=UTC the next run is 07:00Z = 14:00 in Vietnam. Set timeZone: \'Asia/Ho_Chi_Minh\'.|||VI: Bài 9.2, mục 7: với TZ=UTC lần chạy tới là 07:00Z = 14:00 giờ Việt Nam. Đặt timeZone: \'Asia/Ho_Chi_Minh\'.',
      },
      {
        question: 'The service calls await this.events.emitAsync(...); the email listener is @OnEvent(name, { async: true }) and takes 300 ms. How long does the request take?|||Service gọi await this.events.emitAsync(...); listener email là @OnEvent(tên, { async: true }) và mất 300 ms. Request mất bao lâu?',
        options: [
          '~325 ms — emitAsync waits for every listener|||~325 ms — emitAsync chờ mọi listener',
          '~19 ms — the async listener is not awaited|||~19 ms — listener async không được chờ',
          'It throws: async listeners cannot be used with emitAsync|||Ném lỗi: không dùng listener async với emitAsync được',
          '~600 ms — the listener runs twice|||~600 ms — listener chạy hai lần',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 9.3, section 2: 19 ms with { async: true }; 325 ms only when the listener is not async.|||VI: Bài 9.3, mục 2: 19 ms với { async: true }; 325 ms chỉ khi listener không async.',
      },
      {
        question: 'A listener has { suppressErrors: false } and throws; the service uses this.events.emit(...) (not emitAsync). What does the client see?|||Một listener có { suppressErrors: false } và ném lỗi; service dùng this.events.emit(...) (không phải emitAsync). Client thấy gì?',
        options: [
          '200 — the error is logged|||200 — lỗi được ghi log',
          '500 Internal server error|||500 Internal server error',
          '200, and the error is retried later|||200, và lỗi được thử lại sau',
          'No response — the process crashed on an unhandled rejection|||Không có phản hồi — tiến trình chết vì unhandled rejection',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 9.3, section 3: curl code 000, Node 22 printed the error and exited. The wrapper is async and emit() never awaits it. Use emitAsync if errors must reach the caller.|||VI: Bài 9.3, mục 3: curl mã 000, Node 22 in lỗi rồi thoát. Lớp bọc là hàm async mà emit() không chờ. Dùng emitAsync nếu lỗi phải về tới bên gọi.',
      },
      {
        question: 'A service emits an event inside onModuleInit. The listener is a normal @OnEvent provider in the same app. What happens?|||Một service phát sự kiện trong onModuleInit. Listener là provider @OnEvent bình thường trong cùng ứng dụng. Chuyện gì xảy ra?',
        options: [
          'The listener runs after bootstrap — events are buffered|||Listener chạy sau bootstrap — sự kiện được giữ lại',
          'Nest throws "listener not ready" at startup|||Nest ném "listener not ready" lúc khởi động',
          'emit returns false and the event is lost silently|||emit trả false và sự kiện mất không một tiếng động',
          'The listener runs twice|||Listener chạy hai lần',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 9.3, section 5: "emit trong onModuleInit trả về false", empty mailbox; from onApplicationBootstrap it returns true. Listeners are attached in the event module\'s onApplicationBootstrap.|||VI: Bài 9.3, mục 5: "emit trong onModuleInit trả về false", hộp thư trống; từ onApplicationBootstrap thì trả true. Listener được gắn ở onApplicationBootstrap của module sự kiện.',
      },
    ],
  },
};
