/**
 * Observability & Monitoring — Progress Test 2 (chương s05–s08).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi. Đề GIỮA KỲ,
 * dễ hơn FE một bậc.
 *
 * ┌── MÁY ĐO ────────────────────────────────────────────────────────────────┐
 * │ Node v22.21.0 · darwin-arm64 (macOS 25.6, Apple silicon)                 │
 * │ prom-client                        15.1.3                               │
 * │ @opentelemetry/api                  1.9.1                               │
 * │ @opentelemetry/sdk-trace-node       2.11.0                              │
 * │ @opentelemetry/core                 2.11.0                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 * Thư mục đo nằm NGOÀI kho (`scratchpad/obs-pt/lab`); KHÔNG gói nào được thêm
 * vào `package.json` của dự án.
 *
 * ═══ NHỮNG CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY ═══
 *
 *  1. **Công thức `labels:` của chính bài 5.5 GIẾT `nodejs_version_info`.**
 *     Bài 5.5 dạy hai thứ trong cùng một bài: gắn nhãn chung cho mọi chỉ số
 *     mặc định bằng `labels: { service: 'backend', version: APP_VERSION }`, và
 *     dùng `nodejs_version_info` như một "info metric" mà DỮ LIỆU nằm ở nhãn.
 *     Hai thứ ấy va nhau. Đo thật, ba lượt giống nhau từng byte:
 *
 *       không có labels:
 *         nodejs_version_info{version="v22.21.0",major="22",minor="21",patch="0"} 1
 *       với labels: { service: 'backend', version: 'v1.4.0' }:
 *         nodejs_version_info{version="v1.4.0",major="22",minor="21",patch="0",service="backend"} 1
 *
 *     Nhãn `version` của người dùng ĐÈ lên nhãn `version` của chỉ số. Bản Node
 *     biến mất khỏi đúng cái chỉ số sinh ra để báo bản Node, và manh mối duy
 *     nhất còn lại là `version` mâu thuẫn với `major`/`minor`/`patch`. Câu 1
 *     dùng nguyên văn hai dòng trên.
 *
 *  2. **`nodejs_eventloop_lag_seconds` LUÔN TRỄ ĐÚNG MỘT LƯỢT LẤY MẪU, và
 *     biến mất hẳn ở lượt đầu khi có nhãn.** Đo thật, ba lượt, giống nhau:
 *
 *       không nhãn:  scrape1 = 0 · scrape2 = 0,00256875 · scrape3 = 0,004889042
 *       có nhãn:     scrape1 = VẮNG MẶT · scrape2 = 0,002798042 · scrape3 = 0,007941334
 *
 *     Đọc mã của prom-client thì rõ cơ chế: `collect()` chỉ gọi
 *     `setImmediate(reportEventloopLag, ...)` rồi trả về, nên giá trị được GHI
 *     một tick SAU khi phản hồi đã tuần tự hoá xong. Không nhãn thì Gauge có
 *     sẵn một ô mặc định giá trị 0 nên lượt đầu phục vụ số 0 đó; có nhãn thì
 *     chưa có ô nào nên chuỗi ấy KHÔNG XUẤT HIỆN. Giáo trình không nói chỗ
 *     này; đề FE có ghi nhận rằng chuỗi ấy đọc ra 0 trong khi p99 là 15,2 ms,
 *     còn đây là CƠ CHẾ đằng sau. Câu 2 ra đề theo phép đo trên.
 *
 *  3. **Bộ truyền ngữ cảnh W3C NHẬN version `01`, còn regex của giáo trình thì
 *     KHÔNG.** Bài 3.4 đưa `/^00-.../`. Đo thật với `W3CTraceContextPropagator`
 *     của `@opentelemetry/core` 2.11.0:
 *         00-...-01   NHẬN     (traceFlags 1)
 *         01-...-01   NHẬN     (version chưa biết vẫn phân giải — tương thích tiến)
 *         ...-ff      NHẬN     (traceFlags 255)
 *         chữ HOA     TỪ CHỐI
 *         trace-id toàn 0   TỪ CHỐI
 *         parent-id toàn 0  TỪ CHỐI
 *         31 ký tự hex      TỪ CHỐI
 *     Câu 9 ra đề theo chỗ lệch giữa `01` (nhận) và `ff` (đề FE đã dùng, bị
 *     từ chối vì `ff` là version DÀNH RIÊNG). Đây là điểm MỚI, không lặp lại
 *     phát hiện của đề FE.
 *
 * ═══ NHỮNG CHỖ CHỈ SUY THEO TÀI LIỆU, KHÔNG ĐO ĐƯỢC ═══
 *   • **Sentry (chương 7): KHÔNG đụng tới dịch vụ thật.** Không DSN, không đọc
 *     `.env`, không gửi sự kiện nào đi đâu, không đụng cơ sở dữ liệu. Bảy câu
 *     chương 7 hỏi CƠ CHẾ có tài liệu công khai (cách dựng vân tay từ khung
 *     in-app, `Error.cause`, `beforeSend` trả `null`, source map và release)
 *     cộng với mã CÓ THẬT trong kho này (`src/services/sentry.service.ts`,
 *     `src/middleware/errorHandler.ts`). Không câu nào bịa output của dịch vụ.
 *   • **Alertmanager, Grafana, GlitchTip**: mức tài liệu, không dựng.
 *   • **Chương 8**: số học của `interval × retries` và `stop_grace_period` là
 *     tính tay theo tài liệu Docker Compose, không phải một phép đo trên một
 *     cụm thật. Câu 32 mô phỏng đúng cái số học ấy bằng mã chạy được.
 *   • **Mọi con số nano giây và mọi con số độ trễ tuyệt đối**: KHÔNG đo lại,
 *     và không câu nào trong đề hỏi chúng. Máy đang có agent khác chạy.
 *
 * ═══ PHÂN BỐ CÂU THEO CHƯƠNG (30 câu trắc nghiệm) ═══
 *   Ch. 5  · vòng lặp, bộ nhớ, GC, bể kết nối, bật hết lên ....  8  (q1–q8)
 *   Ch. 6  · span, khởi tạo, lấy mẫu, waterfall, khi nào đáng ..  7  (q9–q15)
 *   Ch. 7  · gom nhóm, PII, release, nối bốn trụ cột ...........  7  (q16–q22)
 *   Ch. 8  · bốn lượt thăm dò, cửa sổ deploy, độ sâu, bên ngoài   8  (q23–q30)
 *   + 2 câu lập trình (5 điểm mỗi câu): q31 chương 6, q32 chương 8.
 *
 * Điểm thô 30 + 10 = 40, khai `totalPoints: 10`.
 *
 * Ba câu ghi "chọn HAI": q7, q15 và q27.
 * Phân bố vị trí đáp án (đếm mọi phần tử của correctIndexes, 33 đáp án trên 30
 * câu vì có ba câu "chọn HAI"): A 8 · B 8 · C 8 · D 9.
 *   node -e "import('./content/exams/OBSERVABILITY-MONITORING-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/OBSERVABILITY-MONITORING-PT2.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBSERVABILITY-MONITORING-PT2.mjs --apply
 */
import { B, EX, code, c, sim, ptInstructions, mcq, codeQ } from './_lib/observability-exam-kit.mjs';

export default {
  course: { slug: 'observability-monitoring' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5–8 (Node internals, tracing, errors, health checks)',
        'Kiểm tra tiến độ 2 — Chương 5–8 (bên trong Node, trace, lỗi, kiểm tra sức khoẻ)',
      ),
      description: B(
        'The middle third of the Observability course: the metrics only a Node process can tell you, what a span adds that a log line cannot, the pillar with a name attached, and probes that mean something. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Quan trắc: những chỉ số mà chỉ một tiến trình Node mới nói được, thứ mà một span thêm vào so với một dòng log, cái trụ cột có tên người gắn kèm, và những lượt thăm dò có ý nghĩa. 30 câu trắc nghiệm cộng 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–8'),
      questions: [
        // ── Chương 5 — chỉ số của riêng Node ─────────────────────────────
        mcq({
          prompt: B(
            'Lesson 5.5 gives two recipes. One attaches a common label set to every default metric; the other reads <code>nodejs_version_info</code> as an "info metric" whose DATA lives in its labels. Real output from prom-client 15.1.3, three runs, byte-identical:' + code(
              '// collectDefaultMetrics({ register })\n' +
              'nodejs_version_info{version="v22.21.0",major="22",minor="21",patch="0"} 1\n' +
              '\n' +
              "// collectDefaultMetrics({ register, labels: { service: 'backend', version: 'v1.4.0' } })\n" +
              'nodejs_version_info{version="v1.4.0",major="22",minor="21",patch="0",service="backend"} 1',
            ) + 'What has the second recipe done?',
            'Bài 5.5 đưa ra hai công thức. Một cái gắn một tập nhãn chung lên mọi chỉ số mặc định; cái kia đọc <code>nodejs_version_info</code> như một "info metric" mà DỮ LIỆU nằm ở các nhãn của nó. Output thật của prom-client 15.1.3, ba lượt giống nhau từng byte:' + code(
              '// collectDefaultMetrics({ register })\n' +
              'nodejs_version_info{version="v22.21.0",major="22",minor="21",patch="0"} 1\n' +
              '\n' +
              "// collectDefaultMetrics({ register, labels: { service: 'backend', version: 'v1.4.0' } })\n" +
              'nodejs_version_info{version="v1.4.0",major="22",minor="21",patch="0",service="backend"} 1',
            ) + 'Công thức thứ hai đã làm gì?',
          ),
          options: [
            B(
              'It added the two common labels correctly and left the metric intact; <code>version</code> now means the APPLICATION version on every series, which is the whole point of a common label set, and the Node version remains available from <code>major</code>, <code>minor</code> and <code>patch</code>',
              'Nó thêm hai cái nhãn chung một cách đúng đắn và giữ nguyên chỉ số; <code>version</code> giờ có nghĩa là phiên bản ỨNG DỤNG trên mọi chuỗi, đúng mục đích của một tập nhãn chung, và bản Node vẫn tra được từ <code>major</code>, <code>minor</code> và <code>patch</code>',
            ),
            B(
              'It created a SECOND series for the same metric, because a different label set is a different series; both are exported and Prometheus reports a duplicate-sample error at scrape time, which is visible in the target\'s health page',
              'Nó tạo ra một chuỗi THỨ HAI cho cùng một chỉ số, vì một tập nhãn khác là một chuỗi khác; cả hai đều được xuất ra và Prometheus báo lỗi mẫu-trùng lúc lấy mẫu, thứ nhìn thấy được ở trang tình trạng của mục tiêu',
            ),
            B(
              'The user label <code>version</code> has OVERWRITTEN the metric\'s own <code>version</code> label. The one metric whose entire job is to report which Node is running now says <code>v1.4.0</code>, and the only clue left is that it contradicts <code>major="22" minor="21" patch="0"</code>. Any query joining on that label to break a graph down by Node version silently returns the app version instead',
              'Cái nhãn <code>version</code> của người dùng đã ĐÈ LÊN nhãn <code>version</code> của chính chỉ số. Cái chỉ số mà toàn bộ nhiệm vụ là báo Node nào đang chạy giờ nói là <code>v1.4.0</code>, và manh mối duy nhất còn lại là nó mâu thuẫn với <code>major="22" minor="21" patch="0"</code>. Mọi truy vấn nối theo cái nhãn ấy để tách một đồ thị theo bản Node sẽ âm thầm trả về phiên bản ứng dụng',
            ),
            B(
              'It silently dropped <code>nodejs_version_info</code> and replaced it with a generic build-info series, because prom-client refuses to export a default metric whose label names collide with the user-supplied set; the line shown is the replacement',
              'Nó âm thầm bỏ <code>nodejs_version_info</code> và thay bằng một chuỗi build-info chung, vì prom-client từ chối xuất một chỉ số mặc định có tên nhãn va với tập nhãn người dùng cung cấp; dòng hiện ra là bản thay thế',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The info-metric pattern is genuinely useful — a gauge whose value is always 1 and whose data is in the labels lets you join a deployment fact onto a performance graph. It is also fragile in exactly this way, because a label name is a global namespace shared between the library and you. The general habit: after adding any common label set, scrape once and READ the exposition rather than assuming. Prefix your own labels (<code>app_version</code>, <code>service_name</code>) so they cannot collide with a library\'s.',
            'Khuôn "info metric" thật sự hữu ích — một gauge mà giá trị luôn là 1 và dữ liệu nằm ở các nhãn cho phép bạn nối một dữ kiện triển khai vào một đồ thị hiệu năng. Nó cũng mong manh đúng theo kiểu này, vì tên nhãn là một không gian tên TOÀN CỤC dùng chung giữa thư viện và bạn. Thói quen chung: sau khi thêm bất kỳ tập nhãn chung nào, hãy lấy mẫu một lần và ĐỌC phần phơi chỉ số chứ đừng suy đoán. Hãy đặt tiền tố cho nhãn của mình (<code>app_version</code>, <code>service_name</code>) để chúng không thể va với nhãn của một thư viện.',
          ),
        }),

        mcq({
          prompt: B(
            'Real measurement on prom-client 15.1.3, three runs, byte-identical. Three consecutive scrapes of the same registry, looking only at <code>nodejs_eventloop_lag_seconds</code>:' + code(
              'no labels:                  scrape1  0\n' +
              '                            scrape2  0.00256875\n' +
              '                            scrape3  0.004889042\n' +
              '\n' +
              "labels: { service: 'backend' }   scrape1  ABSENT\n" +
              '                                scrape2  0.002798042\n' +
              '                                scrape3  0.007941334',
            ) + 'Reading prom-client\'s source, <code>collect()</code> schedules <code>setImmediate(reportEventloopLag, ...)</code> and returns. What does that mean for the series?',
            'Đo thật trên prom-client 15.1.3, ba lượt giống nhau từng byte. Ba lượt lấy mẫu liên tiếp trên cùng một registry, chỉ nhìn <code>nodejs_eventloop_lag_seconds</code>:' + code(
              'không nhãn:                 scrape1  0\n' +
              '                            scrape2  0.00256875\n' +
              '                            scrape3  0.004889042\n' +
              '\n' +
              "labels: { service: 'backend' }   scrape1  VẮNG MẶT\n" +
              '                                scrape2  0.002798042\n' +
              '                                scrape3  0.007941334',
            ) + 'Đọc mã nguồn prom-client thì <code>collect()</code> chỉ xếp lịch <code>setImmediate(reportEventloopLag, ...)</code> rồi trả về. Điều đó có nghĩa gì với cái chuỗi này?',
          ),
          options: [
            B(
              'The value is written one tick AFTER the scrape response has already been serialised, so this series is always one scrape STALE — the first scrape serves the Gauge\'s initial value (0) or, once a label set exists and no entry has been created yet, nothing at all. A 15-second scrape interval means the number you read describes the loop fifteen seconds ago',
              'Giá trị được GHI một tick SAU khi phản hồi lấy mẫu đã tuần tự hoá xong, nên chuỗi này LUÔN TRỄ đúng một lượt lấy mẫu — lượt đầu phục vụ giá trị khởi tạo của Gauge (0), hoặc, khi đã có một tập nhãn mà chưa ô nào được tạo, thì chẳng phục vụ gì cả. Khoảng lấy mẫu 15 giây nghĩa là con số bạn đọc mô tả vòng lặp của mười lăm giây trước',
            ),
            B(
              'The value is sampled asynchronously so that measuring the loop does not itself block the loop; the first scrape is empty because <code>setImmediate</code> has not run yet, but from the second scrape onward the reading is exactly current and no staleness remains',
              'Giá trị được lấy mẫu bất đồng bộ để việc đo vòng lặp không tự chặn vòng lặp; lượt lấy mẫu đầu rỗng vì <code>setImmediate</code> chưa chạy, nhưng từ lượt thứ hai trở đi thì số đọc được đúng là hiện thời và không còn độ trễ nào',
            ),
            B(
              'The absent first scrape is a bug in prom-client 15.1.3 that only affects labelled registries; the workaround is to call <code>register.metrics()</code> once at start-up and discard the result, after which both variants behave identically',
              'Lượt lấy mẫu đầu bị vắng là một lỗi của prom-client 15.1.3 chỉ ảnh hưởng tới các registry có nhãn; cách né là gọi <code>register.metrics()</code> một lần lúc khởi động rồi vứt kết quả đi, sau đó cả hai biến thể hành xử y hệt nhau',
            ),
            B(
              'The series is measuring the delay of the <code>setImmediate</code> itself rather than the event loop, so its unit is not seconds of lag but seconds of scheduling latency; the seven suffixed series are the real lag measurements and this one should be renamed',
              'Chuỗi ấy đang đo độ trễ của chính cái <code>setImmediate</code> chứ không phải của vòng lặp sự kiện, nên đơn vị của nó không phải giây trễ mà là giây độ trễ xếp lịch; bảy chuỗi có hậu tố mới là các phép đo trễ thật và cái này nên được đổi tên',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two practical consequences. First, the unsuffixed series is the one to leave alone: the seven suffixed variants (<code>_min_</code>, <code>_max_</code>, <code>_mean_</code>, <code>_stddev_</code>, <code>_p50_</code>, <code>_p90_</code>, <code>_p99_</code>) are read from a <code>monitorEventLoopDelay</code> histogram synchronously inside the same <code>collect()</code>, so they are current. Second, a series that is absent on the first scrape and present afterwards is a shape worth recognising in general — it is not a gap in the data, it is a metric that had not been written yet when the response was built.',
            'Hai hệ quả thực dụng. Một, cái chuỗi không hậu tố là cái nên để yên: bảy biến thể có hậu tố (<code>_min_</code>, <code>_max_</code>, <code>_mean_</code>, <code>_stddev_</code>, <code>_p50_</code>, <code>_p90_</code>, <code>_p99_</code>) được đọc từ một histogram <code>monitorEventLoopDelay</code> một cách ĐỒNG BỘ ngay trong cùng lời gọi <code>collect()</code>, nên chúng là số hiện thời. Hai, một chuỗi vắng ở lượt lấy mẫu đầu rồi có mặt sau đó là một hình dạng đáng nhận ra nói chung — nó không phải một lỗ hổng dữ liệu, nó là một chỉ số chưa kịp được ghi lúc phản hồi được dựng.',
          ),
        }),

        mcq({
          prompt: B(
            'Which of these adds to event-loop lag, and which does not?' + code(
              'A  JSON.parse of a 5 MB AI response body\n' +
              'B  await prisma.note.findMany() against a slow Postgres\n' +
              'C  bcrypt.hashSync on the login path\n' +
              'D  await fetch() to the LLM gateway that takes 30 seconds',
            ),
            'Cái nào trong số này làm tăng độ trễ vòng lặp sự kiện, và cái nào không?' + code(
              'A  JSON.parse một thân phản hồi AI 5 MB\n' +
              'B  await prisma.note.findMany() trên một Postgres chậm\n' +
              'C  bcrypt.hashSync trên đường đăng nhập\n' +
              'D  await fetch() tới cổng LLM mất 30 giây',
            ),
          ),
          options: [
            B(
              'A and C add lag; B and D do not. Everything that blocks the loop is CPU work in JavaScript on the one thread — parsing, synchronous crypto, catastrophic regex backtracking, big array sorts, <code>readFileSync</code>. Waiting on Postgres, R2 or the gateway does NOT block it: that is what async is for, and it is why a slow database shows up as high request latency with no lag at all',
              'A và C làm tăng độ trễ; B và D thì không. Mọi thứ chặn vòng lặp đều là VIỆC CPU trong JavaScript trên đúng một luồng — phân giải, mã hoá đồng bộ, regex quay lui thảm hoạ, sắp xếp mảng lớn, <code>readFileSync</code>. Chờ Postgres, R2 hay cổng LLM thì KHÔNG chặn: đó chính là điều async sinh ra để làm, và đó là lý do một cơ sở dữ liệu chậm hiện ra thành độ trễ request cao mà độ trễ vòng lặp không hề nhúc nhích',
            ),
            B(
              'All four add lag, because every one of them holds a request open and the loop cannot advance past a pending continuation; the difference is only in magnitude, with the 30-second fetch contributing the most by a wide margin',
              'Cả bốn đều làm tăng độ trễ, vì cái nào cũng giữ một request mở và vòng lặp không tiến qua được một phần tiếp nối đang chờ; khác biệt chỉ ở độ lớn, với lời gọi fetch 30 giây đóng góp nhiều nhất một cách áp đảo',
            ),
            B(
              'Only C adds lag. <code>JSON.parse</code> is implemented in C++ inside V8 and therefore runs off the main thread through the libuv thread pool, which is why the parse of a large body is safe while a synchronous hash on the same thread is not',
              'Chỉ C làm tăng độ trễ. <code>JSON.parse</code> được cài bằng C++ bên trong V8 nên chạy ngoài luồng chính thông qua bể luồng của libuv, và đó là lý do phân giải một thân lớn thì an toàn còn một phép băm đồng bộ trên cùng luồng thì không',
            ),
            B(
              'B and D add lag; A and C do not. Lag measures how late a scheduled callback runs, so the operations that add to it are the ones with a pending I/O completion waiting in the queue, while pure CPU work finishes before the next timer is due',
              'B và D làm tăng độ trễ; A và C thì không. Độ trễ đo việc một callback đã xếp lịch chạy muộn tới đâu, nên những thao tác làm nó tăng là những cái có một lượt I/O chờ hoàn tất trong hàng đợi, còn việc CPU thuần thì xong trước khi tới hạn của timer kế tiếp',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This distinction is what makes lag such a good saturation signal: it moves for exactly the class of problem that a restart or a code change can fix, and it stays flat for the class that lives in another process. Option D describes a real and serious problem — a 30-second outbound call — but the right metric for it is the outbound duration histogram, not lag, and confusing the two sends you to read your own code when the time was spent somewhere else entirely.',
            'Chính sự phân biệt này làm cho độ trễ vòng lặp trở thành một tín hiệu bão hoà tốt đến thế: nó động đậy đúng với cái lớp vấn đề mà một lần khởi động lại hay một thay đổi mã có thể sửa, và nó nằm yên với cái lớp vấn đề sống ở một tiến trình khác. Lựa chọn D mô tả một vấn đề có thật và nghiêm trọng — một lời gọi ra ngoài mất 30 giây — nhưng chỉ số đúng cho nó là histogram thời lượng gọi ra ngoài chứ không phải độ trễ vòng lặp, và lẫn lộn hai thứ sẽ đẩy bạn đi đọc mã của chính mình trong khi thời gian bị tiêu ở một nơi hoàn toàn khác.',
          ),
        }),

        mcq({
          prompt: B(
            'You expose event-loop lag yourself with a Gauge whose <code>collect()</code> reads a <code>monitorEventLoopDelay</code> histogram. A colleague removes the <code>h.reset()</code> at the end of the callback, calling it "one less side effect". What happens to the metric over the next week?',
            'Bạn tự phơi độ trễ vòng lặp bằng một Gauge mà <code>collect()</code> của nó đọc một histogram <code>monitorEventLoopDelay</code>. Một đồng nghiệp bỏ dòng <code>h.reset()</code> ở cuối callback, gọi đó là "bớt được một tác dụng phụ". Chỉ số ấy sẽ ra sao trong tuần tới?',
          ),
          options: [
            B(
              'Nothing changes in the values, but memory grows: the histogram keeps every sample it has ever taken, so a week of samples at the default resolution is tens of megabytes and eventually the process is OOM-killed by its own instrumentation',
              'Các giá trị không đổi, nhưng bộ nhớ phình: histogram giữ lại mọi mẫu nó từng lấy, nên một tuần mẫu ở độ phân giải mặc định là hàng chục megabyte và cuối cùng tiến trình bị giết vì hết bộ nhớ bởi chính bộ đo của nó',
            ),
            B(
              'The histogram now accumulates from process start, so one bad minute keeps p99 elevated for days and the metric stops responding to the present. It becomes a high-water mark rather than a measurement, which is the opposite of what a saturation signal is for — and it fails in the safe-looking direction, because the number is high rather than missing',
              'Histogram giờ tích luỹ từ lúc tiến trình khởi động, nên một phút tồi giữ p99 ở mức cao suốt nhiều ngày và chỉ số ấy thôi phản ứng với hiện tại. Nó thành một cái vạch-mức-cao-nhất chứ không còn là một phép đo, tức là ngược hẳn với công dụng của một tín hiệu bão hoà — và nó hỏng theo hướng trông có vẻ an toàn, vì con số CAO chứ không phải thiếu',
            ),
            B(
              'The gauge starts reporting zero, because <code>percentile()</code> consumes the samples it reads and the histogram must be refilled between scrapes; <code>reset()</code> was what re-armed it, so removing it disables the instrument entirely after the first scrape',
              'Cái gauge bắt đầu báo về 0, vì <code>percentile()</code> tiêu thụ luôn các mẫu nó đọc và histogram phải được nạp lại giữa các lượt lấy mẫu; <code>reset()</code> chính là thứ lên đạn lại cho nó, nên bỏ nó đi là vô hiệu hoá hẳn cái dụng cụ sau lượt lấy mẫu đầu tiên',
            ),
            B(
              'Nothing at all, as long as the scrape interval is shorter than the histogram\'s internal window: <code>monitorEventLoopDelay</code> keeps a rolling window sized from the <code>resolution</code> option, and <code>reset()</code> merely clears it early',
              'Chẳng sao cả, miễn là khoảng lấy mẫu ngắn hơn cửa sổ nội bộ của histogram: <code>monitorEventLoopDelay</code> giữ một cửa sổ trượt có kích thước lấy từ tuỳ chọn <code>resolution</code>, và <code>reset()</code> chỉ xoá nó sớm hơn mà thôi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A percentile is only meaningful together with the window it was computed over. Without the reset the window is "since the process started", which means the metric answers a question nobody asked and, worse, answers it in a way that looks like an ongoing problem. The same reasoning applies to any instrument you read at scrape time: state what window the number describes, and make sure the code enforces it.',
            'Một phân vị chỉ có nghĩa khi đi kèm cái cửa sổ mà nó được tính trên đó. Không có phép reset thì cửa sổ ấy là "từ lúc tiến trình khởi động", nghĩa là chỉ số trả lời một câu hỏi chẳng ai hỏi và, tệ hơn, trả lời theo kiểu trông như một vấn đề đang diễn ra. Cùng lý lẽ ấy áp cho mọi dụng cụ bạn đọc lúc lấy mẫu: hãy nói rõ con số mô tả cửa sổ nào, và bảo đảm mã thi hành đúng điều đó.',
          ),
        }),

        mcq({
          prompt: B(
            'A container is limited to 512 MB. The process is OOM-killed regularly, and every time it dies <code>nodejs_heap_size_used_bytes</code> reads around 300 MB — comfortably under the limit. What is going on?',
            'Một container bị giới hạn 512 MB. Tiến trình bị giết vì hết bộ nhớ đều đặn, và mỗi lần nó chết thì <code>nodejs_heap_size_used_bytes</code> đọc ra khoảng 300 MB — thoải mái dưới giới hạn. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'The heap figure excludes the code and stack segments, which on a container this size are the larger half of RSS; the fix is to alert on the sum of <code>nodejs_heap_size_total_bytes</code> and <code>nodejs_external_memory_bytes</code> instead of on either alone',
              'Con số heap không tính phần mã và phần ngăn xếp, mà trên một container cỡ này thì đó mới là nửa lớn hơn của RSS; cách sửa là cảnh báo trên TỔNG của <code>nodejs_heap_size_total_bytes</code> và <code>nodejs_external_memory_bytes</code> thay vì trên từng cái',
            ),
            B(
              'The container limit is enforced against virtual memory rather than resident memory, so a process that reserves address space without touching it is killed even though nothing is actually resident; disabling overcommit on the host removes the effect',
              'Giới hạn container được thi hành trên bộ nhớ ẢO chứ không phải bộ nhớ thường trú, nên một tiến trình đặt chỗ trước không gian địa chỉ mà không đụng vào vẫn bị giết dù thật ra chẳng có gì thường trú; tắt overcommit ở máy chủ là hết hiệu ứng',
            ),
            B(
              'Node does not know about the cgroup limit. V8 picks its heap limit from the HOST\'s total memory, so on a 6 GB VPS it happily plans for a heap of a couple of gigabytes and is killed at 512 MB with no warning, while <code>heapUsed</code> looks entirely healthy. Tell it: <code>NODE_OPTIONS=--max-old-space-size=384</code>, roughly 75% of the limit, so V8 collects aggressively as it approaches rather than being killed',
              'Node không biết gì về giới hạn cgroup. V8 chọn giới hạn heap của nó theo tổng bộ nhớ của MÁY CHỦ, nên trên một VPS 6 GB nó vui vẻ dự trù một cái heap cỡ vài gigabyte rồi bị giết ở 512 MB mà không hề báo trước, trong khi <code>heapUsed</code> nhìn hoàn toàn khoẻ mạnh. Hãy nói cho nó biết: <code>NODE_OPTIONS=--max-old-space-size=384</code>, cỡ 75% của giới hạn, để V8 thu gom quyết liệt khi tiến gần thay vì bị giết',
            ),
            B(
              'The heap gauge is sampled at scrape time, so a spike between two scrapes is invisible and the 300 MB reading is simply the last quiet moment before the kill; shortening the scrape interval to one second captures the real peak',
              'Cái gauge heap được lấy mẫu lúc scrape, nên một cú vọt giữa hai lượt lấy mẫu là vô hình và số đọc 300 MB chỉ là khoảnh khắc yên ắng cuối cùng trước lúc bị giết; rút khoảng lấy mẫu xuống một giây là bắt được đỉnh thật',
            ),
          ],
          correct: 2,
          explanation: EX(
            'RSS is the number the OOM killer and the container limit both use, and it includes the heap, buffers, code and stacks — which is why the only memory alert that maps to an actual consequence is <code>rss / container_memory_limit &gt; 0.85</code>. Crossing 1.0 is a kill. Two alerts that look sensible and are not: "RSS increased since yesterday", which is always true because V8 never returns freed pages to the OS, and "heapUsed above some fixed MB", which is meaningless without knowing the heap limit.',
            'RSS là con số mà cả bộ giết-khi-hết-bộ-nhớ lẫn giới hạn container đều dùng, và nó bao gồm heap, các buffer, phần mã và các ngăn xếp — nên phép cảnh báo bộ nhớ duy nhất ánh xạ vào một hệ quả có thật là <code>rss / giới_hạn_bộ_nhớ_container &gt; 0,85</code>. Vượt 1,0 là bị giết. Hai cảnh báo nhìn có vẻ hợp lý mà không phải: "RSS tăng so với hôm qua", thứ luôn luôn đúng vì V8 không bao giờ trả các trang đã giải phóng lại cho hệ điều hành, và "heapUsed vượt một số MB cố định", thứ vô nghĩa khi chưa biết giới hạn heap.',
          ),
        }),

        mcq({
          prompt: B(
            'You are shown four <code>heapUsed</code> graphs over six hours. Which one is the JavaScript leak signature, and what is the most common cause in a codebase this size?',
            'Bạn được xem bốn đồ thị <code>heapUsed</code> trong sáu tiếng. Cái nào là dấu hiệu của một rò rỉ JavaScript, và nguyên nhân phổ biến nhất trong một kho mã cỡ này là gì?',
          ),
          options: [
            B(
              'A line that rises and never falls. Garbage collection reclaims memory, so a healthy heap graph must come back down; a monotonic rise means nothing is being collected, and the usual cause is a listener registered per request and never removed',
              'Một đường đi lên và không bao giờ xuống. Thu gom rác thu hồi bộ nhớ, nên một đồ thị heap khoẻ mạnh phải quay xuống được; một đường tăng đơn điệu nghĩa là chẳng có gì được thu gom, và nguyên nhân thường gặp là một listener đăng ký theo từng request và không bao giờ được gỡ',
            ),
            B(
              'A sawtooth whose PEAKS keep rising while the troughs stay flat. The peaks are what the OOM killer sees, so a rising peak with a stable trough is the shape that ends in a kill, and it usually means one request occasionally allocates far more than the rest',
              'Một hình răng cưa mà các ĐỈNH cứ cao dần trong khi các đáy đứng yên. Các đỉnh mới là thứ bộ giết-khi-hết-bộ-nhớ nhìn thấy, nên đỉnh dâng mà đáy ổn định là hình dạng kết thúc bằng một cú bị giết, và nó thường nghĩa là thỉnh thoảng có một request cấp phát nhiều hơn hẳn phần còn lại',
            ),
            B(
              'A flat line at a high value. A heap that does not move is a heap where every allocation is being retained, so the absence of a sawtooth is itself the signal; a real workload always produces visible collection activity',
              'Một đường phẳng ở mức cao. Một cái heap không nhúc nhích là một cái heap mà mọi phép cấp phát đều bị giữ lại, nên chính việc VẮNG hình răng cưa mới là tín hiệu; một khối lượng công việc thật luôn tạo ra hoạt động thu gom nhìn thấy được',
            ),
            B(
              'A sawtooth whose BOTTOM rises over hours. The sawtooth itself is garbage collection working correctly; what matters is whether the trough — the live set after each collection — is climbing, because that is what survives every collection. In a codebase this size the usual cause is an unbounded module-level <code>Map</code> used as a cache: no eviction, so it grows with distinct users forever, and it grows fastest under load',
              'Một hình răng cưa mà cái ĐÁY dâng lên qua nhiều giờ. Bản thân hình răng cưa chính là thu gom rác đang làm việc đúng; thứ đáng kể là cái đáy — tập đối tượng còn sống sau mỗi lượt thu gom — có leo lên không, vì đó mới là phần sống sót qua MỌI lượt thu gom. Trong một kho cỡ này thì nguyên nhân thường gặp là một <code>Map</code> ở phạm vi module dùng làm bộ đệm mà không có chặn: không có cơ chế đuổi, nên nó phình theo số người dùng riêng biệt mãi mãi, và phình nhanh nhất khi có tải',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The reason the unbounded cache survives review is that it looks nothing like a leak: nobody forgot to free anything, and the code does exactly what it says. Every module-level <code>Map</code>, <code>Set</code> or array that a request writes to needs a stated eviction policy at the point of declaration — an LRU with a size cap, a TTL, or a comment explaining why the key space is bounded. And note what the option A shape actually is: a rising RSS that never falls is NORMAL, because V8 does not return freed pages to the operating system.',
            'Lý do một bộ đệm không có chặn qua được vòng rà soát là vì nó chẳng giống một chỗ rò tí nào: không ai quên giải phóng cái gì, và đoạn mã làm đúng thứ nó nói. Mọi <code>Map</code>, <code>Set</code> hay mảng ở phạm vi module mà một request ghi vào đều cần một chính sách đuổi được nêu rõ NGAY TẠI CHỖ KHAI BÁO — một LRU có chặn kích thước, một TTL, hoặc một dòng chú thích giải thích vì sao không gian khoá có chặn. Và để ý hình dạng ở lựa chọn A thật ra là gì: một RSS dâng lên không bao giờ xuống là chuyện BÌNH THƯỜNG, vì V8 không trả các trang đã giải phóng lại cho hệ điều hành.',
          ),
        }),

        mcq({
          prompt: B(
            'Your pool gauge reports three numbers: <code>busy</code>, <code>idle</code> and <code>waiting</code>. Choose the TWO correct readings. (choose TWO)',
            'Cái gauge bể kết nối của bạn báo ba con số: <code>busy</code>, <code>idle</code> và <code>waiting</code>. Chọn HAI cách đọc ĐÚNG. (chọn HAI)',
          ),
          options: [
            B(
              '<code>busy</code> at the pool size with <code>waiting</code> at zero means you are exactly at capacity: fine right now, no headroom for a spike',
              '<code>busy</code> bằng kích thước bể và <code>waiting</code> bằng 0 nghĩa là bạn đang ở đúng giới hạn công suất: bây giờ thì ổn, nhưng không còn chỗ trống cho một cú vọt',
            ),
            B(
              '<code>busy</code> at the pool size with <code>waiting</code> above zero means the POOL is the bottleneck, not the database — and no query optimisation will change it',
              '<code>busy</code> bằng kích thước bể và <code>waiting</code> lớn hơn 0 nghĩa là CÁI BỂ mới là nút thắt chứ không phải cơ sở dữ liệu — và không phép tối ưu truy vấn nào làm đổi được điều đó',
            ),
            B(
              '<code>busy</code> at the pool size is by itself enough to diagnose pool exhaustion, since a full pool and a queue are the same condition observed at two moments',
              'Riêng <code>busy</code> bằng kích thước bể đã đủ để chẩn đoán bể bị vắt kiệt, vì một cái bể đầy và một cái hàng đợi là cùng một trạng thái quan sát ở hai thời điểm',
            ),
            B(
              '<code>waiting</code> above zero with <code>busy</code> low means the pool is fragmented and should be drained and rebuilt, which the client does automatically on the next reconnect',
              '<code>waiting</code> lớn hơn 0 trong khi <code>busy</code> thấp nghĩa là bể bị phân mảnh và nên xả rồi dựng lại, việc mà client tự làm ở lần kết nối lại kế tiếp',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>waiting</code> is the metric, and it is the one nothing else can substitute for: <code>busy</code> alone cannot distinguish "perfectly utilised" from "everyone is queueing", which is exactly the distinction that separates a two-hour investigation from a glance. The third reading in the set is the one that decides where to look next — <code>busy</code> low, <code>waiting</code> zero and query duration high means the DATABASE is slow, so <code>pg_stat_statements</code> is the right next stop. And note the sizing trap: Prisma\'s default pool is <code>num_cpus × 2 + 1</code> computed from the HOST\'s core count, not the container\'s allocation, so it changes silently when you move to a bigger VPS.',
            '<code>waiting</code> mới là cái chỉ số, và nó là cái không gì thay thế được: riêng <code>busy</code> không phân biệt nổi "được tận dụng hoàn hảo" với "ai cũng đang xếp hàng", mà đúng cái phân biệt ấy là ranh giới giữa một cuộc điều tra hai tiếng và một cái liếc mắt. Cách đọc thứ ba trong bộ ba là cái quyết định đi tìm ở đâu tiếp — <code>busy</code> thấp, <code>waiting</code> bằng 0 và thời lượng truy vấn cao thì CƠ SỞ DỮ LIỆU mới chậm, nên <code>pg_stat_statements</code> là điểm dừng đúng tiếp theo. Và để ý cái bẫy về kích thước: bể mặc định của Prisma là <code>num_cpus × 2 + 1</code> tính theo số nhân của MÁY CHỦ chứ không theo phần CPU cấp cho container, nên nó đổi âm thầm khi bạn chuyển sang một VPS lớn hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'Calling <code>collectDefaultMetrics()</code> a second time on the same registry throws — measured: ' + c('Error: A metric with the name process_cpu_user_seconds_total has already been registered.') + ' It happens easily: a module imported by both the app and a test, or a hot-reloader re-evaluating a file. Someone fixes it with <code>register.clear()</code> before the call. What did they just build?',
            'Gọi <code>collectDefaultMetrics()</code> lần thứ hai trên cùng một registry thì ném lỗi — đo thật: ' + c('Error: A metric with the name process_cpu_user_seconds_total has already been registered.') + ' Chuyện này xảy ra rất dễ: một module bị import bởi cả ứng dụng lẫn một bài kiểm thử, hoặc một bộ nạp nóng đánh giá lại một file. Có người "sửa" bằng cách gọi <code>register.clear()</code> trước lời gọi. Họ vừa dựng ra cái gì?',
          ),
          options: [
            B(
              'A correct fix with one caveat: <code>clear()</code> removes the metric definitions but preserves their accumulated values in the registry\'s sample store, so the counters continue from where they were and only the label metadata is rebuilt',
              'Một cách sửa đúng kèm một lưu ý: <code>clear()</code> gỡ các định nghĩa chỉ số nhưng giữ lại giá trị đã tích trong kho mẫu của registry, nên các counter tiếp tục từ chỗ chúng đang đứng và chỉ phần siêu dữ liệu nhãn được dựng lại',
            ),
            B(
              'A silent reset of every counter in the process to zero. It compiles and it runs, and because <code>rate()</code> reads a decrease as a counter restart, your request-rate graph now has a gap and your error-rate alert has a blind spot — at a moment when nothing else looks wrong. Guard the call instead of clearing the registry: import it from exactly one place, or check <code>register.getSingleMetric(...)</code> and SKIP rather than clear',
              'Một cú đặt lại âm thầm MỌI counter trong tiến trình về 0. Nó biên dịch được và chạy được, và vì <code>rate()</code> đọc một lần giảm là một lần counter khởi động lại, đồ thị tốc độ request của bạn giờ có một lỗ và cảnh báo tỉ lệ lỗi của bạn có một điểm mù — vào đúng lúc chẳng có gì khác trông có vẻ sai. Hãy CHẶN lời gọi thay vì xoá registry: import nó từ đúng một chỗ, hoặc kiểm <code>register.getSingleMetric(...)</code> rồi BỎ QUA chứ đừng xoá',
            ),
            B(
              'A memory leak: <code>clear()</code> detaches the metrics from the registry but the <code>collect()</code> callbacks stay registered on the underlying timers, so every reload adds another set of callbacks that keep running and keep allocating',
              'Một chỗ rò bộ nhớ: <code>clear()</code> tách các chỉ số khỏi registry nhưng các callback <code>collect()</code> vẫn nằm đăng ký trên các timer bên dưới, nên mỗi lần nạp lại là thêm một bộ callback nữa cứ chạy tiếp và cứ cấp phát tiếp',
            ),
            B(
              'A duplicate-scrape problem: after <code>clear()</code> the same metric name is exported twice within one response, so Prometheus rejects the whole scrape and every metric goes stale at once, which is at least loud enough to notice',
              'Một vấn đề lấy-mẫu-trùng: sau <code>clear()</code> thì cùng một tên chỉ số bị xuất ra hai lần trong một phản hồi, nên Prometheus từ chối cả lượt lấy mẫu và mọi chỉ số cùng lúc trở nên cũ, thứ ít ra cũng đủ ồn ào để nhận ra',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The pattern is worth recognising in general: an error that is easy to make and easy to silence, where the silencing is more expensive than the error. A throw at start-up is loud and costs you a minute; a registry reset is quiet and costs you a hole in your evidence at exactly the moment nobody knows to look for one. The same shape appears again in chapter 9 with the alert that gets muted "just for tonight".',
            'Khuôn mẫu này đáng nhận ra nói chung: một lỗi dễ mắc và dễ dập, mà cái việc dập nó lại đắt hơn chính cái lỗi. Một cú ném lỗi lúc khởi động thì ồn ào và tốn của bạn một phút; một cú đặt lại registry thì im lặng và tốn của bạn một lỗ hổng trong bằng chứng, đúng vào lúc chẳng ai nghĩ tới việc đi tìm một cái lỗ. Đúng hình dạng ấy xuất hiện lại ở chương 9 với cái cảnh báo bị tắt tiếng "chỉ đêm nay thôi".',
          ),
        }),
        // ── Chương 6 — trace ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'Real extraction test against <code>W3CTraceContextPropagator</code> (@opentelemetry/core 2.11.0). Two inbound headers that differ only in the VERSION field:' + code(
              'A  01-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01   -> ACCEPTED\n' +
              'B  ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01   -> REJECTED',
            ) + 'Lesson 3.4 validates the header with <code>/^00-.../</code>, which rejects both. Why does the library treat them differently?',
            'Phép kiểm rút ngữ cảnh thật với <code>W3CTraceContextPropagator</code> (@opentelemetry/core 2.11.0). Hai header gửi tới chỉ khác nhau ở trường VERSION:' + code(
              'A  01-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01   -> NHẬN\n' +
              'B  ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01   -> TỪ CHỐI',
            ) + 'Bài 3.4 kiểm header bằng <code>/^00-.../</code>, tức là từ chối cả hai. Vì sao thư viện lại xử hai cái khác nhau?',
          ),
          options: [
            B(
              'Because <code>01</code> is the version currently in use and <code>00</code> is the deprecated one, so the library accepts the newer format and the lesson\'s regex is simply out of date; updating it to <code>/^0[01]-/</code> matches the library exactly, and the two are otherwise byte-identical',
              'Vì <code>01</code> là phiên bản đang được dùng còn <code>00</code> là phiên bản đã lỗi thời, nên thư viện nhận cái khuôn mới hơn và đoạn regex của bài học chỉ là đã cũ; cập nhật nó thành <code>/^0[01]-/</code> là khớp đúng với thư viện, còn hai cái thì giống hệt nhau từng byte',
            ),
            B(
              'Because the library validates the version by parsing it as a number and checking that it is even; <code>01</code> passes that check while <code>ff</code> does not, which is an implementation detail rather than anything the specification requires, which is why the check lives in the parser rather than in a regular expression',
              'Vì thư viện kiểm phần version bằng cách phân giải nó thành số rồi kiểm xem có chẵn không; <code>01</code> qua được phép kiểm đó còn <code>ff</code> thì không, và đó là một chi tiết cài đặt chứ không phải điều gì đặc tả đòi hỏi, và đó là lý do phép kiểm nằm trong bộ phân giải chứ không nằm trong một biểu thức chính quy',
            ),
            B(
              'Because <code>ff</code> contains only letters while <code>01</code> contains a digit, and the propagator applies a stricter character class to the version field than to the id fields, which is why case also matters there, and the same rule is applied to both id fields for consistency',
              'Vì <code>ff</code> chỉ toàn chữ cái còn <code>01</code> có một chữ số, và bộ truyền ngữ cảnh áp một lớp ký tự nghiêm ngặt hơn cho trường version so với các trường id, và đó cũng là lý do chữ hoa chữ thường có ý nghĩa ở đó, và cùng luật ấy được áp cho cả hai trường id cho nhất quán',
            ),
            B(
              'Because an UNKNOWN version must still be parsed — the specification requires forward compatibility, so a future <code>01</code> is read using the fields it does understand — while <code>ff</code> is RESERVED and can never be a valid version, so it is rejected outright. The practical lesson is that hand-written validation of a standard is validation of your reading of the standard: it will be stricter than the real thing in some places and looser in others, which is why the same regex also accepts an all-zero trace-id that the propagator refuses',
              'Vì một version CHƯA BIẾT thì vẫn phải phân giải được — đặc tả đòi hỏi tương thích tiến, nên một bản <code>01</code> tương lai vẫn được đọc bằng những trường mà nó hiểu — còn <code>ff</code> là giá trị DÀNH RIÊNG và không bao giờ có thể là một version hợp lệ, nên nó bị từ chối thẳng. Bài học thực dụng là: tự tay viết phép kiểm cho một chuẩn thì thứ bạn kiểm là CÁCH BẠN ĐỌC cái chuẩn ấy — nó sẽ nghiêm hơn bản thật ở vài chỗ và lỏng hơn ở vài chỗ khác, và đó cũng là lý do đúng đoạn regex ấy lại NHẬN một trace-id toàn số 0 mà bộ truyền ngữ cảnh từ chối',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The rigidity of the format is what makes it work across a Go proxy, a Java service and Cloudflare\'s edge without configuration — but "rigid" is not the same as "everything unfamiliar is invalid". Forward compatibility is an explicit requirement, and one reserved sentinel is the exception. Note what the two divergences have in common: in both directions the hand-written check produced a wrong answer quietly, either dropping a trace that should have been continued or accepting a join key the specification calls invalid.',
            'Chính sự cứng nhắc của khuôn dạng làm cho nó chạy được xuyên qua một proxy viết bằng Go, một dịch vụ Java và biên của Cloudflare mà không cần cấu hình gì — nhưng "cứng nhắc" không đồng nghĩa với "thứ gì lạ cũng là không hợp lệ". Tương thích tiến là một yêu cầu tường minh, và một giá trị dành riêng là ngoại lệ. Để ý điểm chung của hai chỗ lệch: ở cả hai chiều, phép kiểm tự viết đều cho ra một đáp án sai một cách lặng lẽ, hoặc là vứt mất một trace lẽ ra phải nối tiếp, hoặc là nhận vào một khoá nối mà đặc tả gọi là không hợp lệ.',
          ),
        }),

        mcq({
          prompt: B(
            'Your <code>BatchSpanProcessor</code> is at its defaults: <code>maxQueueSize</code> 2048, flush every 5 seconds, batch 512. During a traffic spike, or while the collector is down, what happens to spans that do not fit?',
            'Bộ <code>BatchSpanProcessor</code> của bạn đang để mặc định: <code>maxQueueSize</code> 2048, xả mỗi 5 giây, mỗi lô 512. Trong một cú vọt lưu lượng, hoặc lúc bộ thu gom đang chết, thì các span không lọt vào hàng đợi bị làm sao?',
          ),
          options: [
            B(
              'They block the request that created them until the queue drains, which is what makes tracing safe by construction: you can never lose a span, you can only make requests slower, and the 5-second flush bounds how long that can last',
              'Chúng chặn cái request đã tạo ra chúng lại cho tới khi hàng đợi thoát bớt, và chính điều đó làm cho tracing an toàn về mặt cấu tạo: bạn không bao giờ mất một span, bạn chỉ có thể làm request chậm đi, và chu kỳ xả 5 giây chặn được việc đó kéo dài bao lâu',
            ),
            B(
              'They are written to a local spill file and re-sent when the collector returns, which is why the exporter has a timeout setting; the only real risk is disk usage on a small VPS',
              'Chúng được ghi ra một file tràn ở máy rồi gửi lại khi bộ thu gom sống lại, và đó là lý do bộ xuất có một tuỳ chọn thời gian chờ; rủi ro thật sự duy nhất là dung lượng đĩa trên một VPS nhỏ',
            ),
            B(
              'They are SILENTLY DISCARDED. <code>maxQueueSize</code> is a drop threshold, not a back-pressure signal — nothing throws, nothing warns, and your request path is unaffected. The consequence is that your sampling rate is not the number you configured: you believe you are keeping 10% and you are keeping "10% minus whatever got dropped", with no record of the difference unless you watch the collector\'s failed-span counter',
              'Chúng bị VỨT TRONG IM LẶNG. <code>maxQueueSize</code> là một NGƯỠNG RƠI chứ không phải một tín hiệu nghẽn ngược — không có gì ném lỗi, không có gì cảnh báo, và đường request của bạn không bị ảnh hưởng. Hệ quả là tỉ lệ lấy mẫu của bạn không phải con số bạn đã cấu hình: bạn tin mình đang giữ 10% còn thực tế bạn đang giữ "10% trừ đi phần nào đó bị rơi", mà không có bản ghi nào về phần chênh trừ khi bạn theo dõi bộ đếm span-gửi-hỏng của bộ thu gom',
            ),
            B(
              'They are exported immediately in an out-of-band batch that bypasses the timer, which is why a spike produces a burst of network traffic rather than data loss; the queue size only controls how large that burst can be',
              'Chúng được xuất đi ngay lập tức trong một lô ngoài luồng, bỏ qua bộ đếm giờ, và đó là lý do một cú vọt tạo ra một chùm lưu lượng mạng chứ không phải mất dữ liệu; kích thước hàng đợi chỉ điều khiển chùm đó lớn tới đâu',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The batching itself is exactly right: the cost on your request path is creating an object, setting some fields and pushing to an array, while the network call happens later on a timer in the background. That is what keeps tracing off the hot path. But "off the hot path" and "lossless" are different properties, and the default configuration chooses the first. Any statement you make about your sampling rate is a statement about the sampler PLUS the queue, and only the sampler is written down.',
            'Bản thân việc gom lô là hoàn toàn đúng: chi phí trên đường request của bạn là tạo một object, gán vài trường và đẩy vào một mảng, còn lời gọi mạng thì xảy ra sau, theo một bộ đếm giờ, ở nền. Chính điều đó giữ cho tracing nằm ngoài đường nóng. Nhưng "nằm ngoài đường nóng" và "không mất mát" là hai thuộc tính khác nhau, và cấu hình mặc định chọn cái thứ nhất. Mọi phát biểu của bạn về tỉ lệ lấy mẫu thật ra là phát biểu về bộ lấy mẫu CỘNG cái hàng đợi, mà chỉ có bộ lấy mẫu là được ghi ra thành chữ.',
          ),
        }),

        mcq({
          prompt: B(
            'You move to tail sampling — buffer every span of a trace, then keep the ones that errored or were slow — and you run two collector instances behind a round-robin load balancer for redundancy. What do you get?',
            'Bạn chuyển sang lấy mẫu ở đuôi — đệm lại mọi span của một trace rồi giữ những cái có lỗi hoặc chậm — và bạn chạy HAI bản thu gom sau một bộ cân bằng tải quay vòng cho có dự phòng. Bạn nhận được gì?',
          ),
          options: [
            B(
              'Exactly what you wanted, with the buffering cost halved: each collector holds half the in-flight traces, so <code>num_traces</code> can be halved too and the memory footprint per instance drops accordingly, and the decision window shortens accordingly, which is the second saving',
              'Đúng thứ bạn muốn, với chi phí đệm giảm một nửa: mỗi bộ thu gom giữ một nửa số trace đang bay, nên <code>num_traces</code> cũng có thể giảm một nửa và lượng bộ nhớ mỗi bản chạy giảm theo, và cửa sổ ra quyết định cũng ngắn lại theo, đó là khoản tiết kiệm thứ hai',
            ),
            B(
              'Duplicated traces, because both collectors see the root span and each makes its own keep decision; the store deduplicates on trace id at ingest, so the only cost is bandwidth and a doubled decision latency, and the duplicate is charged once because ingest counts unique trace ids',
              'Các trace bị nhân đôi, vì cả hai bộ thu gom đều thấy span gốc và mỗi cái tự quyết giữ hay không; cái kho khử trùng lặp theo trace id lúc nạp, nên cái giá duy nhất là băng thông và độ trễ quyết định tăng gấp đôi, và bản trùng chỉ bị tính tiền một lần vì lúc nạp người ta đếm theo trace id duy nhất',
            ),
            B(
              'Nothing different, because the sampling decision is carried in the <code>traceparent</code> flags byte, so whichever collector sees a span already knows whether the trace is being kept and the two instances cannot disagree, so redundancy is free and the load balancer needs no special configuration',
              'Chẳng khác gì, vì quyết định lấy mẫu được mang trong byte cờ của <code>traceparent</code>, nên bộ thu gom nào thấy một span cũng đã biết trace ấy có đang được giữ hay không, và hai bản chạy không thể bất đồng, nên phần dự phòng là miễn phí và bộ cân bằng tải không cần cấu hình gì đặc biệt',
            ),
            B(
              'FRAGMENTS. Tail sampling requires every span of a trace to reach the SAME collector instance, and round-robin guarantees they do not: collector A sees the root and two db spans, decides "not slow" and drops; collector B sees the gateway span, decides "slow" and keeps. The result is a "trace" with one span in it, no parent and no context — worse than nothing, because it looks like data. The fix is a load-balancing exporter that routes by trace id; the simpler fix on a repo this size is to run ONE collector',
              'CÁC MẢNH VỤN. Lấy mẫu ở đuôi đòi hỏi MỌI span của một trace phải tới CÙNG một bản thu gom, mà quay vòng thì bảo đảm điều đó không xảy ra: bộ A thấy span gốc và hai span cơ sở dữ liệu, quyết "không chậm" rồi vứt; bộ B thấy span gọi cổng LLM, quyết "chậm" rồi giữ. Kết quả là một "trace" chỉ có một span, không cha, không ngữ cảnh — tệ hơn cả không có gì, vì nó TRÔNG như dữ liệu. Cách sửa là một bộ xuất cân bằng tải định tuyến theo trace id; cách sửa đơn giản hơn với một kho cỡ này là chạy MỘT bộ thu gom',
            ),
          ],
          correct: 3,
          explanation: EX(
            'What tail sampling buys is real and large — 100% of errors kept, so the "a bug must occur hundreds of times before you hold a trace of it" problem disappears entirely, plus 100% of slow requests and a small probabilistic baseline to compare against. What it costs is a collector holding every in-flight trace in memory for the decision window, and a hard requirement about routing that head sampling does not have. On this repository the honest answer is simpler still: below about a hundred requests a second, keep everything and skip the decision.',
            'Thứ mà lấy mẫu ở đuôi mua cho bạn là có thật và lớn — giữ 100% số lỗi, nên cái vấn đề "một lỗi phải xảy ra hàng trăm lần thì bạn mới cầm được một trace của nó" biến mất hoàn toàn, cộng thêm 100% số request chậm và một nền xác suất nhỏ để đối chiếu. Cái nó đòi là một bộ thu gom giữ mọi trace đang bay trong bộ nhớ suốt cửa sổ ra quyết định, cộng một yêu cầu cứng về định tuyến mà lấy mẫu ở đầu không có. Với kho này thì câu trả lời trung thực còn đơn giản hơn: dưới cỡ một trăm request mỗi giây, cứ giữ hết và bỏ hẳn việc ra quyết định.',
          ),
        }),

        mcq({
          prompt: B(
            'Traces are already collected, so a colleague builds the error-rate graph by counting error spans and multiplying by 100 to undo the 1% sampling. Why is that graph wrong in a way that matters?',
            'Trace thì đã thu sẵn rồi, nên một đồng nghiệp dựng đồ thị tỉ lệ lỗi bằng cách đếm số span có lỗi rồi nhân 100 để bù lại việc lấy mẫu 1%. Vì sao đồ thị ấy sai theo một kiểu đáng kể?',
          ),
          options: [
            B(
              'Because the multiplication assumes uniform sampling and the sampler is parent-based, so a trace whose root was sampled contributes all of its spans while an unsampled one contributes none; dividing by the average span count per trace corrects it',
              'Vì phép nhân giả định lấy mẫu đều, mà bộ lấy mẫu lại dựa theo cha, nên một trace có gốc được lấy mẫu thì đóng góp toàn bộ span của nó còn một trace không được lấy mẫu thì chẳng đóng góp gì; chia cho số span trung bình mỗi trace là chỉnh lại được',
            ),
            B(
              'Because error spans are kept preferentially by the exporter\'s retry logic, so the sample of errors is biased upward and the ×100 exaggerates it further; the correct scaling factor has to be measured rather than assumed',
              'Vì các span có lỗi được logic thử-lại của bộ xuất ưu tiên giữ, nên mẫu lỗi bị lệch lên trên và phép ×100 phóng đại nó thêm; hệ số nhân đúng phải được ĐO chứ không phải giả định',
            ),
            B(
              'Because the arithmetic quantises the answer into jumps of 100: one error trace becomes "100 errors" and ZERO error traces becomes "0 errors" for a bug that is failing every minute. The graph reads zero most of the time and spikes to a round number the rest, which is exactly the wrong behaviour for a signal you alert on. Metrics are counted on EVERY request, before sampling — that is why chapter 4 exists as a separate pillar. Use spans to explain a number, never to produce one',
              'Vì phép tính ấy LƯỢNG TỬ HOÁ đáp số thành những bước nhảy 100: một trace lỗi thành "100 lỗi" và KHÔNG có trace lỗi nào thành "0 lỗi" cho một cái bug đang hỏng mỗi phút. Đồ thị đọc ra 0 gần như suốt thời gian rồi vọt lên một con số tròn ở phần còn lại, đúng là hành vi sai nhất cho một tín hiệu bạn đem đi cảnh báo. Chỉ số được ĐẾM trên MỌI request, TRƯỚC khi lấy mẫu — đó là lý do chương 4 tồn tại như một trụ cột riêng. Hãy dùng span để GIẢI THÍCH một con số, đừng bao giờ dùng nó để SINH RA một con số',
            ),
            B(
              'Because span counts include the internal spans your manual instrumentation creates, so the same failure is counted once per span rather than once per request; filtering to <code>kind=SERVER</code> before multiplying gives the right number',
              'Vì số đếm span bao gồm cả các span nội bộ do phần đo thủ công của bạn tạo ra, nên cùng một cú hỏng bị đếm một lần cho mỗi span thay vì một lần cho mỗi request; lọc về <code>kind=SERVER</code> trước khi nhân là ra con số đúng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The tempting part is that the data is right there, and the scaling works fine for high-volume totals — which is what makes the failure so specific: it breaks precisely where it matters, on the rare failure you needed to see. The three pillars are not three views of the same data; they have different cost models and therefore different capabilities. A metric costs a few bytes per series regardless of traffic and is therefore counted on everything; a trace costs roughly eighteen log lines per request and is therefore sampled.',
            'Chỗ hấp dẫn là dữ liệu thì đã có sẵn ở đó, và phép nhân bù chạy tốt với các con số tổng lượng lớn — và chính điều đó làm cú hỏng này rất riêng: nó vỡ đúng ở chỗ đáng kể, ở cái lỗi hiếm mà bạn cần nhìn thấy. Ba trụ cột không phải ba góc nhìn của cùng một dữ liệu; chúng có mô hình chi phí khác nhau nên có năng lực khác nhau. Một chỉ số tốn vài byte cho mỗi chuỗi bất kể lưu lượng nên nó được đếm trên mọi thứ; một trace tốn cỡ mười tám dòng log cho mỗi request nên nó phải được lấy mẫu.',
          ),
        }),

        mcq({
          prompt: B(
            'A waterfall for a dashboard endpoint:' + code(
              'GET /api/v1/dashboard ─────────────────────────── 1180ms\n' +
              '  ├─ prisma:query Note.count ──── 18ms\n' +
              '  ├─ prisma:query Post.count ──── 22ms\n' +
              '  ├─ prisma:query Course.count ── 19ms\n' +
              '  ├─ prisma:query Message.count ─────────────────── 1170ms\n' +
              '  └─ prisma:query Media.count ─── 21ms',
            ) + 'All five children start at the same x-position. What is the shape, and why did the database duration metric not point at it?',
            'Một biểu đồ thác của một endpoint bảng điều khiển:' + code(
              'GET /api/v1/dashboard ─────────────────────────── 1180ms\n' +
              '  ├─ prisma:query Note.count ──── 18ms\n' +
              '  ├─ prisma:query Post.count ──── 22ms\n' +
              '  ├─ prisma:query Course.count ── 19ms\n' +
              '  ├─ prisma:query Message.count ─────────────────── 1170ms\n' +
              '  └─ prisma:query Media.count ─── 21ms',
            ) + 'Cả năm span con đều bắt đầu ở cùng một vị trí ngang. Đây là hình dạng gì, và vì sao chỉ số thời lượng truy vấn không chỉ ra được nó?',
          ),
          options: [
            B(
              'A staircase — five queries where one would do. The metric missed it because each individual query is fast and the only symptom is that there are five of them, which is a count rather than a duration, after which the counts line up with the metric again',
              'Một cái cầu thang — năm truy vấn ở chỗ lẽ ra một cái là đủ. Chỉ số bỏ sót vì mỗi truy vấn riêng lẻ đều nhanh và triệu chứng duy nhất là CÓ NĂM CÁI, tức là một con số đếm chứ không phải một thời lượng, sau đó các con số lại khớp với chỉ số như cũ',
            ),
            B(
              'A ladder — each query waits for the previous one, so the total is their sum; the metric missed it because it records per-query duration and has no way to express that the five were sequential rather than concurrent, so the correct factor is usually well below the nominal one',
              'Một cái thang — mỗi truy vấn chờ cái trước, nên tổng là tổng của chúng; chỉ số bỏ sót vì nó ghi thời lượng theo từng truy vấn và không có cách nào diễn đạt rằng năm cái ấy chạy tuần tự chứ không đồng thời, nên hệ số đúng thường thấp hơn hẳn hệ số danh nghĩa',
            ),
            B(
              'A gap — 1170 ms with nothing instrumented inside it; the metric missed it because auto-instrumentation only sees I/O and this is CPU work being attributed to the nearest enclosing span, and the same filter fixes the latency percentile computed from spans',
              'Một khoảng trống — 1170 ms mà bên trong chẳng có gì được đo; chỉ số bỏ sót vì đo tự động chỉ nhìn thấy I/O và đây là việc CPU bị quy về cái span bao gần nhất, và cũng bộ lọc ấy sửa luôn phân vị độ trễ tính từ các span',
            ),
            B(
              'A fan-out that hides a straggler. The children run in PARALLEL — same left edge — so total time is the SLOWEST child, not the sum. Adding more parallel work is free until ONE of them is slow, and then that one work item costs you everything. The metric missed it because <code>db_query_duration</code> aggregates all five queries into one distribution: the p99 is high, but WHICH query is exactly what a percentile cannot tell you. The trace gives the straggler a name and a statement',
              'Một cú toả ra che giấu một kẻ lê chân. Các span con chạy SONG SONG — cùng mép trái — nên tổng thời gian là con CHẬM NHẤT chứ không phải tổng. Thêm việc song song thì miễn phí cho tới khi MỘT trong số chúng chậm, và khi đó đúng một hạng mục ấy tốn của bạn tất cả. Chỉ số bỏ sót vì <code>db_query_duration</code> gộp cả năm truy vấn vào một phân bố: p99 thì cao, nhưng TRUY VẤN NÀO lại đúng là thứ một phân vị không nói được. Cái trace cho kẻ lê chân ấy một cái tên và một câu lệnh',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Checking the left edges is the one glance that distinguishes two completely different fixes: all children starting together means parallel, staggered means sequential. And notice that the fix here is usually not "make Message.count faster" — it is "why is a dashboard doing a COUNT(*) on the largest table", which is a question the trace put in front of you rather than one you had to think of.',
            'Kiểm các mép TRÁI là cái liếc mắt duy nhất phân biệt được hai cách sửa hoàn toàn khác nhau: các span con cùng bắt đầu nghĩa là song song, lệch nhau nghĩa là tuần tự. Và để ý rằng cách sửa ở đây thường không phải "làm cho Message.count nhanh hơn" — mà là "vì sao một bảng điều khiển lại đi COUNT(*) trên cái bảng lớn nhất", một câu hỏi mà cái trace đặt sẵn trước mặt bạn chứ không phải câu bạn phải tự nghĩ ra.',
          ),
        }),

        mcq({
          prompt: B(
            'Your logger has a careful redaction step. Your trace backend has looser access controls than your log store. A colleague enables enhanced database reporting so spans carry <code>db.statement</code>. What is the risk, and how do you settle it?',
            'Bộ log của bạn có một bước che dữ liệu cẩn thận. Kho trace của bạn thì kiểm soát truy cập lỏng hơn kho log. Một đồng nghiệp bật chế độ báo cáo cơ sở dữ liệu mở rộng để các span mang theo <code>db.statement</code>. Rủi ro là gì, và giải quyết bằng cách nào?',
          ),
          options: [
            B(
              'There is no new risk: <code>db.statement</code> is the parameterised form by specification, so the values are always <code>$1</code>, <code>$2</code> placeholders; the semantic conventions forbid recording bound parameters and every instrumentation follows them, which is the standard reading for a staircase of identical short bars',
              'Không có rủi ro mới nào: theo đặc tả thì <code>db.statement</code> là dạng đã tham số hoá, nên các giá trị luôn là các chỗ giữ <code>$1</code>, <code>$2</code>; các quy ước ngữ nghĩa cấm ghi lại tham số đã gắn và mọi bộ đo tự động đều tuân theo, đó là cách đọc tiêu chuẩn cho một cầu thang gồm các thanh ngắn giống hệt nhau',
            ),
            B(
              'The attribute may carry the literal VALUES — an email in a <code>WHERE</code> clause, a note\'s full text in an <code>INSERT</code> — depending on the driver, the instrumentation version and whether any code path interpolates into SQL. The span is not a log line, so it never passes through your logger\'s redaction, and it lands in a store with looser access. VERIFY rather than assume: send one request, open the trace and READ the actual value; set <code>enhancedDatabaseReporting: false</code> and add a span processor that strips the attribute if there is any doubt',
              'Cái thuộc tính ấy CÓ THỂ mang theo GIÁ TRỊ nguyên văn — một địa chỉ email trong mệnh đề <code>WHERE</code>, toàn văn một ghi chú trong một câu <code>INSERT</code> — tuỳ trình điều khiển, tuỳ phiên bản bộ đo và tuỳ có đường mã nào nội suy thẳng vào SQL hay không. Một span không phải một dòng log, nên nó không bao giờ đi qua bước che dữ liệu của bộ log, và nó rơi vào một cái kho có kiểm soát lỏng hơn. Hãy KIỂM CHỨNG chứ đừng giả định: gửi một request, mở cái trace ra và ĐỌC giá trị thật; đặt <code>enhancedDatabaseReporting: false</code> và thêm một bộ xử lý span để gỡ thuộc tính ấy nếu còn chút nghi ngờ',
            ),
            B(
              'The risk is only performance: a long SQL statement makes each span several kilobytes, so at 466 bytes per ordinary span the trace volume multiplies and the exporter\'s queue overflows sooner, which is a cost question rather than a privacy one, and the confirmation is a spike in event-loop lag at the same timestamp',
              'Rủi ro chỉ là hiệu năng: một câu SQL dài làm mỗi span nặng vài kilobyte, nên với 466 byte cho một span thường thì lượng trace nhân lên và hàng đợi của bộ xuất tràn sớm hơn, tức là một câu chuyện chi phí chứ không phải quyền riêng tư, và bằng chứng xác nhận là một cú vọt độ trễ vòng lặp ở đúng dấu thời gian ấy',
            ),
            B(
              'The risk is real but already handled: the trace backend applies the same server-side scrubbing rules as your error tracker, so as long as the field names match a known-sensitive pattern the values are removed at ingest before anyone can read them, so the parent absorbs the time and the child names the query',
              'Rủi ro là có thật nhưng đã được xử lý sẵn: kho trace áp đúng các luật che dữ liệu phía máy chủ như bộ theo dõi lỗi của bạn, nên miễn là tên trường khớp một khuôn được coi là nhạy cảm thì giá trị bị gỡ ngay lúc nạp, trước khi ai đó đọc được, nên span cha hút hết thời gian còn span con thì gọi tên truy vấn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the same discipline as chapter 1.2 applied at a different layer: decide by what the field CAN contain, not by what today\'s code happens to put in it. And it is the same verification habit as the Sentry check in chapter 7 and the deploy smoke test in chapter 8 — configuration says what SHOULD happen, and only reading the actual artefact says what DID. A span store is a second place personal data can leak, and it is the one nobody has audited.',
            'Đây vẫn là kỷ luật của bài 1.2 áp ở một tầng khác: quyết định theo việc cái trường ấy CÓ THỂ chứa gì, chứ không theo việc mã hôm nay tình cờ nhét gì vào đó. Và nó cũng là thói quen kiểm chứng của phép kiểm Sentry ở chương 7 và của phép kiểm khói lúc deploy ở chương 8 — cấu hình nói điều LẼ RA xảy ra, và chỉ có việc đọc hiện vật thật mới nói được điều ĐÃ xảy ra. Kho span là nơi THỨ HAI dữ liệu cá nhân có thể rò ra, và nó là nơi chưa ai từng rà soát.',
          ),
        }),

        mcq({
          prompt: B(
            'This repository has one backend, one frontend, one database, one cache and calls to two external APIs. Choose the TWO statements that are correct about adopting OpenTelemetry here. (choose TWO)',
            'Kho này có một backend, một frontend, một cơ sở dữ liệu, một bộ đệm và các lời gọi tới hai API bên ngoài. Chọn HAI phát biểu ĐÚNG về việc áp dụng OpenTelemetry ở đây. (chọn HAI)',
          ),
          options: [
            B(
              'The "poor man\'s trace" — an array of <code>{ name, ms }</code> accumulated in the request context and emitted as one field on the completion log line — costs about 80 extra bytes against 2,796 for a real trace, and finds the long pole, the sequential ladder and the unaccounted gap',
              '"Trace nhà nghèo" — một mảng <code>{ name, ms }</code> tích trong ngữ cảnh request rồi phát ra thành một trường trên dòng log hoàn tất — tốn thêm cỡ 80 byte so với 2.796 byte của một trace thật, và tìm ra được cái cột dài, cái thang tuần tự và cái khoảng trống chưa lý giải',
            ),
            B(
              'The poor man\'s version scales to a second service as long as both write to the same log store, because the request id already crosses that boundary and the timings array can simply be concatenated at query time',
              'Bản nhà nghèo mở rộng được sang dịch vụ thứ hai miễn là cả hai cùng ghi vào một kho log, vì cái request id vốn đã đi qua được ranh giới đó và mảng thời lượng chỉ việc nối lại lúc truy vấn',
            ),
            B(
              'The real trigger for adopting the full SDK is a SECOND service you wrote entering the request path — the value of a trace scales with the number of hops, and the poor man\'s version cannot express nesting or parallelism at all',
              'Cái ngưỡng thật sự để chuyển sang bộ SDK đầy đủ là một dịch vụ THỨ HAI do chính bạn viết bước vào đường request — giá trị của một trace tỉ lệ với số chặng, và bản nhà nghèo hoàn toàn không diễn đạt được sự lồng nhau hay tính song song',
            ),
            B(
              'Adopting it early is cheap insurance, because the instrumentation is passive: if no collector is configured the SDK runs in a no-op mode with no queue, no batching and no measurable cost, so there is no downside to turning it on before you need it',
              'Áp dụng sớm là một khoản bảo hiểm rẻ, vì phần đo là thụ động: nếu chưa cấu hình bộ thu gom nào thì SDK chạy ở chế độ không-làm-gì, không hàng đợi, không gom lô và không có chi phí đo được nào, nên bật nó lên trước khi cần cũng chẳng thiệt gì',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'Option B is the trap that sounds most reasonable: the moment there are two services, a flat array of durations stops working entirely, because you can no longer tell which timings caused which — that is precisely the nesting the poor man\'s version cannot express, and it is the signal to adopt the real thing. The honest bill for OpenTelemetry on one service is half a day of setup, a collector to keep running, gigabytes a day at full sampling, a second place PII can leak, and the risk that a dependency upgrade silently breaks an instrumentation patch so spans just stop appearing with nothing alerting on their absence.',
            'Lựa chọn B là cái bẫy nghe hợp lý nhất: ngay khi có hai dịch vụ thì một mảng thời lượng phẳng thôi hoạt động hoàn toàn, vì bạn không còn nói được cái thời lượng nào GÂY RA cái nào — đó chính là sự lồng nhau mà bản nhà nghèo không diễn đạt nổi, và đó là tín hiệu để chuyển sang bản thật. Hoá đơn trung thực của OpenTelemetry trên một dịch vụ là nửa ngày dựng, một bộ thu gom phải nuôi cho sống, hàng gigabyte mỗi ngày ở mức lấy mẫu đầy đủ, một nơi THỨ HAI dữ liệu cá nhân có thể rò, và rủi ro một lần nâng cấp phụ thuộc âm thầm làm hỏng một bản vá đo tự động khiến các span đơn giản là ngừng xuất hiện mà chẳng có gì cảnh báo về sự vắng mặt ấy.',
          ),
        }),
        // ── Chương 7 — lỗi ───────────────────────────────────────────────
        mcq({
          prompt: B(
            'Two days after a refactor that extracted a helper and moved a function down forty lines, an error you triaged and ignored eight months ago reappears at the top of the issue list, marked "first seen today", with a new-issue alert attached just after the deploy. What happened, and what does it tell you about how the fingerprint is computed?',
            'Hai ngày sau một lần tái cấu trúc rút ra một hàm phụ và dời một hàm xuống bốn mươi dòng, một lỗi bạn đã phân loại rồi bỏ qua từ tám tháng trước bỗng hiện lên đầu danh sách issue, gắn nhãn "thấy lần đầu hôm nay", kèm một cảnh báo issue-mới đến ngay sau lần deploy. Chuyện gì đã xảy ra, và nó nói gì về cách cái vân tay được tính?',
          ),
          options: [
            B(
              'The refactor changed the exception TYPE — an extracted helper wraps the original error — so a different type produces a different fingerprint; preserving the type through the wrapper restores the grouping and reopens the original issue, and the alert then stops firing on the next occurrence of the original bug',
              'Lần tái cấu trúc đã đổi KIỂU ngoại lệ — cái hàm phụ được rút ra bọc lại lỗi gốc — nên một kiểu khác sinh ra một vân tay khác; giữ nguyên kiểu qua lớp bọc sẽ khôi phục việc gom nhóm và mở lại issue cũ, và cảnh báo sẽ thôi kêu ở lần xảy ra kế tiếp của cái bug ban đầu',
            ),
            B(
              'The eight-month-old issue was auto-archived after six months of inactivity, so the next occurrence created a fresh row; the "first seen" date is the date of the new row and the original is still searchable under archived issues, so the count on the new row starts from one and the history is preserved elsewhere',
              'Cái issue tám tháng tuổi đã bị tự lưu trữ sau sáu tháng không hoạt động, nên lần xảy ra kế tiếp tạo ra một dòng mới; ngày "thấy lần đầu" là ngày của dòng mới còn bản gốc vẫn tìm được trong mục issue đã lưu trữ, nên số đếm trên dòng mới bắt đầu lại từ một và phần lịch sử vẫn được giữ ở chỗ khác',
            ),
            B(
              'The deploy changed the release string, and Sentry treats an issue seen under a new release as a regression rather than a recurrence; marking the old issue as "won\'t fix" rather than "resolved" prevents the alert next time, and the release comparison is what the regression banner on the issue page is drawn from',
              'Lần deploy đổi chuỗi release, và Sentry coi một issue thấy dưới một release mới là một cú thoái lui chứ không phải một lần tái diễn; đánh dấu issue cũ là "sẽ không sửa" thay vì "đã giải quyết" sẽ chặn được cảnh báo lần sau, và phép so sánh release chính là thứ dựng nên dải báo thoái lui trên trang issue',
            ),
            B(
              'The fingerprint is computed from the exception type plus the IN-APP stack frames, so moving code changes it and an old bug reappears as first-seen-today. The specific harm is misdirected effort: the alert arrives just after a deploy, so it looks like the deploy caused it and the natural response is to investigate a diff that has nothing to do with the bug. Before treating any post-deploy "new" issue as a regression, search the resolved and ignored issues for the same message and file — and pin the fingerprint explicitly for errors you intend to track across refactors',
              'Vân tay được tính từ KIỂU ngoại lệ cộng các khung ngăn xếp THUỘC ỨNG DỤNG, nên dời mã là đổi nó, và một lỗi cũ hiện lại thành thấy-lần-đầu-hôm-nay. Cái hại cụ thể là công sức đi sai hướng: cảnh báo tới ngay sau một lần deploy nên nó trông như do lần deploy gây ra, và phản ứng tự nhiên là đi soi một cái diff chẳng liên quan gì tới cái bug. Trước khi coi bất kỳ issue "mới" nào sau deploy là một cú thoái lui, hãy tìm trong các issue đã giải quyết và đã bỏ qua theo cùng thông điệp và cùng file — và ghim vân tay một cách tường minh cho những lỗi bạn định theo dõi xuyên qua các lần tái cấu trúc',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The in-app filter is the part that usually works FOR you: frames from <code>node_modules</code> are marked not-in-app and excluded, so the same bug reached through two different library paths still groups into one issue. The cost of that design is exactly this case — the frames it does keep are yours, and yours move. When there is no usable stack at all the fingerprint falls back to the MESSAGE, which is where interpolated ids split one bug into thousands of single-event issues.',
            'Bộ lọc in-app thường là phần làm việc CHO bạn: các khung từ <code>node_modules</code> được đánh dấu là không-thuộc-ứng-dụng và bị loại ra, nên cùng một cái bug đi tới qua hai đường thư viện khác nhau vẫn gom về một issue. Cái giá của thiết kế ấy đúng là trường hợp này — những khung mà nó GIỮ LẠI là của bạn, mà của bạn thì hay dời chỗ. Khi không có ngăn xếp nào dùng được thì vân tay quay về lấy THÔNG ĐIỆP, và đó là chỗ các id nội suy chẻ một cái bug thành hàng nghìn issue chỉ có một sự kiện.',
          ),
        }),

        mcq({
          prompt: B(
            'A thumbnail step is allowed to fail, so the code does this and moves on:' + code(
              'try {\n' +
              '  await generateThumbnail(file);\n' +
              '} catch (err) {\n' +
              "  logger.error('thumbnail failed', { error: err.message });\n" +
              '}',
            ) + 'It looks responsible: nothing crashes, something is written down. What is the objection, and what does a correct version add?',
            'Bước tạo ảnh thu nhỏ được phép hỏng, nên mã viết thế này rồi đi tiếp:' + code(
              'try {\n' +
              '  await generateThumbnail(file);\n' +
              '} catch (err) {\n' +
              "  logger.error('thumbnail failed', { error: err.message });\n" +
              '}',
            ) + 'Nhìn thì có trách nhiệm: không sập gì, và có ghi lại. Phản đối ở đây là gì, và một bản đúng thì thêm cái gì?',
          ),
          options: [
            B(
              'The objection is the level: a failure the system recovers from belongs at <code>warn</code>, not <code>error</code>, and the correct version changes one word so the error rate on the dashboard stops being dominated by handled cases, and the dashboard then reflects only failures a user actually experienced',
              'Phản đối nằm ở cái MỨC: một cú hỏng mà hệ thống tự phục hồi được thì thuộc về <code>warn</code> chứ không phải <code>error</code>, và bản đúng chỉ đổi một chữ để tỉ lệ lỗi trên bảng theo dõi thôi bị các trường hợp đã xử lý lấn át, và khi đó bảng theo dõi chỉ còn phản ánh những cú hỏng mà người dùng thật sự gặp',
            ),
            B(
              'The objection is that <code>err.message</code> may contain interpolated data such as a filename or a path, so the field is unbounded; the correct version logs a bounded error class instead and keeps the message out of the structured payload entirely, which keeps the metric bounded no matter what the driver puts in the message',
              'Phản đối là <code>err.message</code> có thể chứa dữ liệu nội suy như một tên file hay một đường dẫn, nên cái trường ấy không có chặn; bản đúng ghi một LỚP lỗi có chặn thay vào đó và giữ thông điệp hoàn toàn ra ngoài phần dữ liệu có cấu trúc, giữ cho chỉ số có chặn bất kể trình điều khiển nhét gì vào thông điệp',
            ),
            B(
              'The error never reaches your error tracker, so it has no first-seen date, no distinct-user count and no owner — and the one log line it produces is one of thousands nobody greps for. The bug now has no way of ever being NOTICED: the system looks healthy, the 5xx metric shows nothing because you swallowed it, and the only evidence expires in fourteen days. A correct version counts it — ' + c("metrics.recoverableErrors.inc({ kind: 'thumbnail_failed' })") + ' — logs it, and carries a comment saying why proceeding is safe. If you cannot articulate why continuing is safe, you are not recovering, you are hiding',
              'Cái lỗi ấy không bao giờ tới được bộ theo dõi lỗi của bạn, nên nó không có ngày thấy-lần-đầu, không có số người dùng bị ảnh hưởng và không có ai đứng tên — còn một dòng log nó sinh ra thì là một trong hàng nghìn dòng chẳng ai grep tới. Cái bug ấy giờ không còn cách nào để được PHÁT HIỆN: hệ thống nhìn khoẻ mạnh, chỉ số 5xx chẳng thấy gì vì bạn đã nuốt nó, và bằng chứng duy nhất thì hết hạn sau mười bốn ngày. Một bản đúng thì ĐẾM nó — ' + c("metrics.recoverableErrors.inc({ kind: 'thumbnail_failed' })") + ' — ghi log nó, và kèm một dòng chú thích nói vì sao đi tiếp là an toàn. Nếu bạn không nói rõ được vì sao đi tiếp là an toàn thì bạn không đang phục hồi, bạn đang giấu',
            ),
            B(
              'The objection is that <code>await</code> inside a <code>try</code> swallows rejections from anything the thumbnail step itself started but did not await, so a background failure inside <code>generateThumbnail</code> escapes as an unhandled rejection later and Node 22 terminates the process, and the process then exits with a non-zero code that the orchestrator counts',
              'Phản đối là <code>await</code> bên trong một khối <code>try</code> nuốt mất các lời từ chối đến từ những thứ mà chính bước tạo ảnh thu nhỏ khởi động nhưng không await, nên một cú hỏng ở nền bên trong <code>generateThumbnail</code> thoát ra thành một unhandled rejection về sau và Node 22 sẽ kết thúc tiến trình, và tiến trình sau đó thoát với một mã khác 0 mà bộ điều phối có đếm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Grouping is the whole product of an error tracker: ten thousand occurrences become one row with a first-seen date, a user count and an owner — a work item with state, which also gives you regression detection that no log stream can. A swallowed error opts out of all of that. Option A is a reasonable style point and does not address the objection; the level is a secondary question once the event has been prevented from reaching the system whose job is to group it.',
            'Gom nhóm chính là toàn bộ sản phẩm của một bộ theo dõi lỗi: mười nghìn lần xảy ra thành một dòng có ngày thấy-lần-đầu, số người dùng bị ảnh hưởng và người đứng tên — một hạng mục công việc có trạng thái, thứ còn cho bạn khả năng phát hiện thoái lui mà không luồng log nào có. Một cái lỗi bị nuốt là tự loại mình khỏi tất cả những thứ đó. Lựa chọn A là một ý kiến về phong cách hợp lý và nó không chạm tới phản đối chính; cái mức log là câu hỏi thứ yếu một khi sự kiện đã bị chặn không cho tới được cái hệ thống có nhiệm vụ gom nhóm nó.',
          ),
        }),

        mcq({
          prompt: B(
            'This repository maps well-known Prisma error codes before the response is built:' + code(
              "if (!err.statusCode && typeof err.code === 'string' && /^P\\d{4}$/.test(err.code)) {\n" +
              "  if (err.code === 'P2002')      { statusCode = 409; message = 'Giá trị đã tồn tại'; }\n" +
              "  else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }\n" +
              "  else                           { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }\n" +
              '}',
            ) + 'It does two jobs at once. What is the second one?',
            'Kho này ánh xạ các mã lỗi Prisma quen thuộc trước khi dựng phản hồi:' + code(
              "if (!err.statusCode && typeof err.code === 'string' && /^P\\d{4}$/.test(err.code)) {\n" +
              "  if (err.code === 'P2002')      { statusCode = 409; message = 'Giá trị đã tồn tại'; }\n" +
              "  else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }\n" +
              "  else                           { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }\n" +
              '}',
            ) + 'Nó làm hai việc cùng lúc. Việc thứ hai là gì?',
          ),
          options: [
            B(
              'It decides what your ERROR TRACKER will contain. Because this repo reports to Sentry only when <code>statusCode &gt;= 500</code>, a unique-constraint violation was a 500 before this mapping existed — therefore a Sentry event, therefore noise — and after it, a 409 that Sentry never hears about. Every classification decision in an error handler is also a decision about signal quality',
              'Nó quyết định BỘ THEO DÕI LỖI của bạn sẽ chứa những gì. Vì kho này chỉ báo lên Sentry khi <code>statusCode &gt;= 500</code>, một lỗi vi phạm ràng buộc duy nhất trước khi có phép ánh xạ này là một lỗi 500 — do đó là một sự kiện Sentry, do đó là nhiễu — còn sau khi có nó thì là một mã 409 mà Sentry không bao giờ nghe thấy. Mọi quyết định phân loại trong một bộ xử lý lỗi cũng đồng thời là một quyết định về CHẤT LƯỢNG TÍN HIỆU',
            ),
            B(
              'It normalises the error into a shape the frontend can branch on, which is the difference between a form that can highlight the duplicate field and one that can only show a generic banner; the security benefit is a side effect of that normalisation',
              'Nó chuẩn hoá lỗi về một hình dạng mà frontend rẽ nhánh được, tức là khác biệt giữa một biểu mẫu có thể tô sáng đúng cái trường bị trùng và một biểu mẫu chỉ hiện được một dải thông báo chung chung; lợi ích an ninh chỉ là tác dụng phụ của phép chuẩn hoá ấy',
            ),
            B(
              'It gives the error a stable message per code, which keeps the Sentry fingerprint from splitting: without it every Prisma failure carries the driver\'s own message with the table and column interpolated in, so one bug becomes thousands of single-event issues',
              'Nó cho lỗi một thông điệp ổn định theo từng mã, giữ cho vân tay Sentry khỏi bị chẻ ra: không có nó thì mỗi cú hỏng Prisma mang theo thông điệp của chính trình điều khiển với tên bảng và tên cột nội suy vào, nên một cái bug thành hàng nghìn issue chỉ có một sự kiện',
            ),
            B(
              'It caps the blast radius of an unmapped code, since the final <code>else</code> turns anything matching <code>Pxxxx</code> into a 400 rather than letting it reach the generic 500 branch, which means a new Prisma version cannot introduce a new class of alert without a code change',
              'Nó chặn phạm vi ảnh hưởng của một mã chưa được ánh xạ, vì nhánh <code>else</code> cuối biến mọi thứ khớp <code>Pxxxx</code> thành 400 thay vì để nó rơi xuống nhánh 500 chung, nghĩa là một bản Prisma mới không thể tạo ra một lớp cảnh báo mới nếu chưa sửa mã',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The first job is security: a raw Prisma error message names your tables and columns, and returning it to a client is free reconnaissance. The second is the one people miss, and it generalises: what your error tracker contains is decided entirely by where you draw the 4xx/5xx line, and a tracker full of unactionable rows trains everyone to ignore it — at which point the tool is worse than absent, because there is now a place people BELIEVE is being watched.',
            'Việc thứ nhất là an ninh: một thông điệp lỗi Prisma nguyên bản gọi tên các bảng và các cột của bạn, và trả nó về cho client là biếu không phần do thám. Việc thứ hai là cái người ta hay bỏ sót, và nó tổng quát được: bộ theo dõi lỗi của bạn chứa những gì hoàn toàn do chỗ bạn kẻ ranh giới 4xx/5xx quyết định, và một bộ theo dõi đầy những dòng chẳng làm gì được sẽ huấn luyện cả nhóm bỏ qua nó — tới lúc đó thì công cụ ấy còn tệ hơn là không có, vì giờ đã có một chỗ mà người ta TIN là đang được canh chừng.',
          ),
        }),

        mcq({
          prompt: B(
            'A bug inside a retry loop starts firing on a busy service: one bug × 3 retries × 500 requests per second. Error trackers bill per EVENT, not per issue. Which mechanism bounds this, and what is its default?',
            'Một cái bug nằm trong một vòng thử lại bắt đầu nổ trên một dịch vụ đang bận: một bug × 3 lần thử lại × 500 request mỗi giây. Các bộ theo dõi lỗi tính tiền theo SỰ KIỆN chứ không theo issue. Cơ chế nào chặn được chuyện này, và mặc định của nó là gì?',
          ),
          options: [
            B(
              'Server-side rate limiting on the project, which is on by default at a level derived from your plan; events beyond it are rejected with a 429 that the SDK retries with backoff, so nothing is lost and only the delivery is delayed',
              'Giới hạn tần suất phía máy chủ trên dự án, thứ bật sẵn ở một mức suy ra từ gói bạn mua; các sự kiện vượt quá bị từ chối bằng mã 429 mà SDK sẽ thử lại có giãn cách, nên không mất gì và chỉ là chậm giao',
            ),
            B(
              'The <code>tracesSampleRate</code> option, which applies to error events as well as transactions; this repo sets it to 10% deliberately against a default of 1.0, so the retry storm is already reduced tenfold before it leaves the process',
              'Tuỳ chọn <code>tracesSampleRate</code>, thứ áp cho cả sự kiện lỗi lẫn các giao dịch; kho này cố ý đặt nó ở 10% so với mặc định 1,0, nên trận bão thử-lại đã giảm mười lần trước khi rời khỏi tiến trình',
            ),
            B(
              'The issue-level "ignore until it happens N more times" setting, which suppresses delivery for a specific fingerprint once it crosses a threshold you choose; it is the only control that understands which events belong to the same bug',
              'Thiết lập ở cấp issue "bỏ qua tới khi nó xảy ra thêm N lần nữa", thứ chặn việc gửi cho một vân tay cụ thể khi nó vượt một ngưỡng bạn chọn; nó là điều khiển duy nhất hiểu được các sự kiện nào thuộc cùng một cái bug',
            ),
            B(
              'Client-side rate limiting in <code>beforeSend</code>, where returning <code>null</code> DROPS the event before it costs anything — and it is OFF by default. Two companions are worth setting at the same time: <code>maxValueLength</code>, which truncates giant strings, and <code>normalizeDepth</code>, which stops a deep object graph becoming a megabyte of JSON per event',
              'Giới hạn tần suất phía client trong <code>beforeSend</code>, nơi trả về <code>null</code> là VỨT sự kiện đó đi trước khi nó tốn đồng nào — và nó TẮT theo mặc định. Có hai người bạn đáng đặt cùng lúc: <code>maxValueLength</code>, thứ cắt bớt các chuỗi khổng lồ, và <code>normalizeDepth</code>, thứ ngăn một đồ thị object sâu biến thành một megabyte JSON cho mỗi sự kiện',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A bug in a retry loop is a billing incident as well as an outage, and the arithmetic is brutal: 90,000 events per minute from one fault. The retry point matters on its own too — report the FINAL outcome, not each attempt, otherwise a flaky dependency with three retries triples your error count and the numbers on your dashboard stop meaning "how many users were affected".',
            'Một cái bug nằm trong vòng thử lại vừa là một sự cố vừa là một hoá đơn, và số học thì tàn nhẫn: 90.000 sự kiện mỗi phút từ đúng một cái lỗi. Riêng chuyện thử lại cũng đáng nói — hãy báo cáo KẾT CỤC CUỐI CÙNG chứ không phải từng lần thử, nếu không thì một phụ thuộc chập chờn với ba lần thử lại sẽ nhân ba số lỗi của bạn và các con số trên bảng theo dõi thôi mang nghĩa "bao nhiêu người dùng bị ảnh hưởng".',
          ),
        }),

        mcq({
          prompt: B(
            'Your frontend stack traces are unreadable: ' + c('at t (main-4f3a2b1c.js:1:48291)') + '. You add a build step that injects and uploads source maps per release. What must the step also do, and why?',
            'Vết ngăn xếp của frontend không đọc nổi: ' + c('at t (main-4f3a2b1c.js:1:48291)') + '. Bạn thêm một bước dựng để nhúng và tải source map lên theo từng release. Bước ấy còn PHẢI làm gì nữa, và vì sao?',
          ),
          options: [
            B(
              'It must upload the maps for the backend as well, because compiled TypeScript stacks point at the emitted JavaScript; without them the file and line in every backend event refer to <code>dist/</code> rather than to <code>src/</code>',
              'Nó phải tải cả source map của backend lên nữa, vì vết ngăn xếp của TypeScript đã biên dịch trỏ vào JavaScript sinh ra; không có chúng thì tên file và số dòng trong mọi sự kiện backend đều trỏ vào <code>dist/</code> chứ không phải <code>src/</code>',
            ),
            B(
              'It must DELETE the <code>.map</code> files from the shipped image after uploading them. A public map file lets anyone reconstruct your entire frontend source, so upload-then-delete is the whole flow — and the maps have to be tied to a release that is unique per build, or a later upload overwrites an earlier one and old stacks resolve to plausible-looking but wrong lines',
              'Nó phải XOÁ các file <code>.map</code> khỏi ảnh đem đi chạy sau khi đã tải chúng lên. Một file map công khai cho phép bất kỳ ai dựng lại toàn bộ mã nguồn frontend của bạn, nên tải-rồi-xoá mới là trọn quy trình — và các map phải gắn với một release DUY NHẤT theo từng lần dựng, nếu không thì một lần tải sau sẽ đè lên lần trước và các vết ngăn xếp cũ sẽ giải ra những dòng trông hợp lý nhưng SAI',
            ),
            B(
              'It must run after minification but before compression, because a gzipped bundle changes the byte offsets the map refers to; running it in the wrong order produces maps that resolve every frame to the first line of the file',
              'Nó phải chạy sau khi rút gọn nhưng trước khi nén, vì một gói đã gzip làm đổi các độ dời byte mà map trỏ tới; chạy sai thứ tự sẽ tạo ra những map giải mọi khung về dòng đầu tiên của file',
            ),
            B(
              'It must disable the content hash in the bundle filename, because the map is looked up by filename and a hash that changes every build means the uploaded map can never be matched to the stack trace that needs it',
              'Nó phải tắt phần băm nội dung trong tên file gói, vì map được tra theo tên file và một mã băm đổi ở mọi lần dựng nghĩa là map đã tải lên không bao giờ khớp được với vết ngăn xếp cần nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The unreadable stack is not "hard to debug" — there is no information in it at all, which is why maps are worth the build step. And note how the release string ties the two halves together: it is what maps are uploaded against, and using something that is not unique per build (a <code>package.json</code> version, a branch name, <code>latest</code>) breaks source-map association in the worst possible way. It does not fail; it produces a file and line number that look perfectly plausible and point somewhere unrelated, and you will read that code carefully before doubting it.',
            'Một vết ngăn xếp không đọc nổi thì không phải là "khó gỡ" — trong đó không có thông tin nào cả, và đó là lý do các source map đáng để thêm một bước dựng. Và để ý chuỗi release nối hai nửa lại thế nào: nó là thứ mà các map được tải lên gắn vào, và dùng một thứ không duy nhất theo từng lần dựng (một số phiên bản trong <code>package.json</code>, một tên nhánh, <code>latest</code>) sẽ phá vỡ liên kết source map theo cách tệ nhất có thể. Nó không báo hỏng; nó cho ra một tên file và một số dòng trông hoàn toàn hợp lý mà lại trỏ vào chỗ chẳng liên quan, và bạn sẽ đọc kỹ đoạn mã đó rất lâu trước khi nghi ngờ nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Four lines are added inside the Express error handler:' + code(
              'const ctx = currentContext();\n' +
              'Sentry.withScope((scope) => {\n' +
              "  scope.setTag('request_id', ctx?.requestId ?? 'unknown');\n" +
              "  scope.setTag('trace_id',   ctx?.traceId   ?? 'unknown');\n" +
              '  const eventId = Sentry.captureException(err);\n' +
              "  logger.error('Express error handler', {\n" +
              '    error: err.message, path: req.path, method: req.method,\n' +
              '    requestId: ctx?.requestId, sentryEventId: eventId,\n' +
              '  });\n' +
              '});',
            ) + 'What do those four lines buy?',
            'Bốn dòng được thêm vào bên trong bộ xử lý lỗi của Express:' + code(
              'const ctx = currentContext();\n' +
              'Sentry.withScope((scope) => {\n' +
              "  scope.setTag('request_id', ctx?.requestId ?? 'unknown');\n" +
              "  scope.setTag('trace_id',   ctx?.traceId   ?? 'unknown');\n" +
              '  const eventId = Sentry.captureException(err);\n' +
              "  logger.error('Express error handler', {\n" +
              '    error: err.message, path: req.path, method: req.method,\n' +
              '    requestId: ctx?.requestId, sentryEventId: eventId,\n' +
              '  });\n' +
              '});',
            ) + 'Bốn dòng ấy mua được gì?',
          ),
          options: [
            B(
              'Deduplication: with a request id on the event, Sentry can collapse the several exceptions one request may throw into a single occurrence rather than counting each one, which is what makes the per-user affected count meaningful, so the affected-user figure stops being inflated by retries',
              'Khử trùng lặp: có request id trên sự kiện thì Sentry gộp được nhiều ngoại lệ mà một request có thể ném ra thành một lần xảy ra duy nhất thay vì đếm từng cái, và chính điều đó làm cho con số "bao nhiêu người dùng bị ảnh hưởng" có ý nghĩa, nên con số người dùng bị ảnh hưởng thôi bị các lần thử lại thổi phồng',
            ),
            B(
              'Ordering: the tags let Sentry sort events within an issue by the request that produced them, so the issue page shows the sequence of a single user\'s attempts instead of an undifferentiated stream of occurrences, which is what makes an issue page readable during a live incident',
              'Thứ tự: các nhãn cho phép Sentry sắp các sự kiện trong một issue theo request đã sinh ra chúng, nên trang issue hiện ra chuỗi các lần thử của MỘT người dùng thay vì một dòng chảy các lần xảy ra không phân biệt, và đó là thứ làm cho một trang issue đọc được trong lúc sự cố đang diễn ra',
            ),
            B(
              'Retention alignment: tagging the event with the trace id lets the trace backend and the error tracker expire the same request together, which is what makes a deletion request answerable across both systems at once, and the two retention windows can then be configured from one place',
              'Đồng bộ thời gian giữ: gắn nhãn trace id lên sự kiện cho phép kho trace và bộ theo dõi lỗi cùng hết hạn một request một lượt, và chính điều đó làm cho một yêu cầu xoá dữ liệu trả lời được trên cả hai hệ thống cùng lúc, và khi đó hai cửa sổ giữ dữ liệu cấu hình được từ một chỗ duy nhất',
            ),
            B(
              'Movement in BOTH directions between all four pillars. From a Sentry issue you copy the <code>request_id</code> tag into your log store and get every line of that request, including the ones written BEFORE the error that explain it; from a log line the <code>sentryEventId</code> opens the grouped issue with its stack, breadcrumbs and user count; the <code>trace_id</code> tag opens the waterfall. And a user\'s screenshot of <code>X-Request-ID</code> is the entry point to all three',
              'Khả năng đi CẢ HAI CHIỀU giữa cả bốn trụ cột. Từ một issue Sentry, bạn chép cái nhãn <code>request_id</code> sang kho log và lấy được mọi dòng của request đó, kể cả những dòng ghi TRƯỚC cái lỗi và giải thích nó; từ một dòng log thì <code>sentryEventId</code> mở thẳng ra cái issue đã gom nhóm kèm ngăn xếp, breadcrumb và số người dùng; cái nhãn <code>trace_id</code> mở ra biểu đồ thác. Và ảnh chụp màn hình <code>X-Request-ID</code> của một người dùng là cửa vào cả ba',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the whole system, closed: four pillars, one key. The ordering in which to build the cross-tool links matters too — ids in the log lines FIRST, because every other jump becomes possible after that even if you do it by copy-paste, and nothing else works without it. Most projects build the impressive link first (clicking a point on a latency graph to open a trace) and never do the ids, which is why theirs open traces whose logs cannot be found.',
            'Đây là toàn bộ hệ thống, khép kín: bốn trụ cột, một cái khoá. Thứ tự dựng các đường nối giữa các công cụ cũng quan trọng — id trong các dòng log TRƯỚC ĐÃ, vì sau đó mọi bước nhảy khác đều KHẢ THI kể cả khi bạn làm bằng cách chép-dán, và không có nó thì chẳng thứ nào chạy. Phần lớn dự án dựng cái đường nối gây ấn tượng trước (bấm một điểm trên đồ thị độ trễ để mở một trace) rồi không bao giờ làm phần id, và đó là lý do trace của họ mở ra mà không tìm được log nào.',
          ),
        }),

        mcq({
          prompt: B(
            'Two projects. Project A has no Sentry DSN configured at all. Project B has Sentry running, 40,000 unresolved issues, an inbox nobody has opened since March and alerts routed to a Slack channel that was archived. Which is in the worse state, and why?',
            'Hai dự án. Dự án A không hề cấu hình DSN Sentry nào. Dự án B có Sentry đang chạy, 40.000 issue chưa xử lý, một hộp thư chẳng ai mở từ tháng Ba và các cảnh báo được định tuyến vào một kênh Slack đã lưu trữ. Cái nào ở trạng thái tệ hơn, và vì sao?',
          ),
          options: [
            B(
              'B is worse. A project with no DSN is a KNOWN gap: everyone understands errors are not being tracked. B produces a false belief — people stop adding logging because "Sentry will catch it", incident reviews record "we should have seen this in Sentry" without asking whether anyone would have, and the tool\'s existence actively displaces the habits that would have covered for it. An error tracker with a triage habit is worth more than one with better configuration',
              'B tệ hơn. Một dự án không có DSN là một lỗ hổng ĐÃ BIẾT: ai cũng hiểu là lỗi không được theo dõi. B thì sinh ra một NIỀM TIN SAI — người ta thôi thêm log vì "Sentry sẽ bắt được", các buổi rà soát sự cố ghi lại "lẽ ra chúng ta phải thấy cái này trong Sentry" mà không hỏi xem liệu có ai thấy được không, và chính sự tồn tại của công cụ ấy đẩy lùi những thói quen lẽ ra đã bù đắp cho nó. Một bộ theo dõi lỗi có THÓI QUEN PHÂN LOẠI đáng giá hơn một bộ có cấu hình tốt hơn',
            ),
            B(
              'A is worse, because B at least retains the events: the data exists and can be triaged whenever someone finds the time, whereas A has permanently lost every error that occurred while the DSN was absent and no later effort can recover it',
              'A tệ hơn, vì B ít ra vẫn giữ được các sự kiện: dữ liệu tồn tại và có thể đem ra phân loại bất cứ khi nào có người rảnh, trong khi A đã mất vĩnh viễn mọi lỗi xảy ra trong lúc thiếu DSN và không nỗ lực nào về sau khôi phục lại được',
            ),
            B(
              'They are equivalent: neither produces an action, so the observable outcome is identical and the only difference is that B costs money; the honest comparison is between B and a project that triages, not between B and A',
              'Hai cái tương đương: chẳng cái nào sinh ra một hành động, nên kết cục quan sát được là y hệt và khác biệt duy nhất là B tốn tiền; phép so sánh trung thực là giữa B và một dự án CÓ phân loại, chứ không phải giữa B và A',
            ),
            B(
              'B is worse, but for a quota reason: 40,000 unresolved issues means the project is permanently at its event limit, so new errors are rejected at ingest and the one that matters next will not be recorded at all — resolving the backlog restores capacity',
              'B tệ hơn, nhưng vì lý do hạn ngạch: 40.000 issue chưa xử lý nghĩa là dự án ấy vĩnh viễn chạm trần số sự kiện, nên các lỗi mới bị từ chối ngay lúc nạp và cái lỗi đáng kể tiếp theo sẽ không được ghi lại chút nào — giải quyết hết tồn đọng là khôi phục được sức chứa',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Every observability system decays toward this state by default, because muting is easy and un-muting requires someone to notice. The defence is a habit rather than a setting: when you turn something off, write down what you gave up. This repository has a worked example — a CI check that is deliberately dormant, with the reason, the cost stated plainly, the manual fallback and the exact re-arming steps all recorded. That is a documented gap, which is a decision; an undocumented one is indistinguishable from working.',
            'Mọi hệ thống quan trắc đều mục ruỗng dần về phía trạng thái này theo mặc định, vì tắt tiếng thì dễ còn bật lại thì phải có người để ý. Cái chống đỡ là một THÓI QUEN chứ không phải một thiết lập: khi bạn tắt thứ gì đi, hãy ghi lại bạn đã đánh đổi mất cái gì. Kho này có một ví dụ mẫu — một phép kiểm CI cố ý để ngủ, kèm lý do, kèm cái giá nêu thẳng, kèm cách chạy tay thay thế và kèm đúng các bước bật lại. Đó là một lỗ hổng ĐƯỢC GHI LẠI, tức là một quyết định; còn một lỗ hổng không ghi lại thì không phân biệt được với việc nó đang chạy tốt.',
          ),
        }),
        // ── Chương 8 — kiểm tra sức khoẻ ─────────────────────────────────
        mcq({
          prompt: B(
            'Four probes can be asked four different questions. Which pairing of question to consequence is right?',
            'Bốn lượt thăm dò có thể hỏi bốn câu khác nhau. Cách ghép CÂU HỎI với HỆ QUẢ nào là đúng?',
          ),
          options: [
            B(
              'Liveness asks "should I get traffic?" and readiness asks "am I wedged?", so a failing liveness probe removes the instance from the load balancer while a failing readiness probe restarts it; the startup probe simply delays both by a fixed period',
              'Liveness hỏi "tôi có nên nhận lưu lượng không?" còn readiness hỏi "tôi có bị treo không?", nên một lượt liveness trượt thì gỡ bản chạy khỏi bộ cân bằng tải còn một lượt readiness trượt thì khởi động lại nó; lượt startup chỉ hoãn cả hai lại một khoảng cố định',
            ),
            B(
              'Liveness asks "is this process wedged?" and failing it means RESTART ME, so it must depend on nothing external. Readiness asks "should I get traffic right now?" and failing it means TAKE ME OUT OF THE LOAD BALANCER, DO NOT RESTART — which is where dependency checks belong. Startup suppresses the other two until booting is finished. Deep or diagnostic checks are for humans and must never be wired to an automatic action',
              'Liveness hỏi "tiến trình này có bị treo không?" và trượt nó nghĩa là HÃY KHỞI ĐỘNG LẠI TÔI, nên nó không được phụ thuộc vào bất cứ thứ gì bên ngoài. Readiness hỏi "ngay lúc này tôi có nên nhận lưu lượng không?" và trượt nó nghĩa là HÃY GỠ TÔI KHỎI BỘ CÂN BẰNG TẢI, ĐỪNG KHỞI ĐỘNG LẠI — và đó là chỗ của các phép kiểm phụ thuộc. Startup dập hai cái kia lại cho tới khi khởi động xong. Các phép kiểm SÂU hay chẩn đoán là dành cho con người và tuyệt đối không được nối vào một hành động tự động',
            ),
            B(
              'All four ask the same question at increasing depth, and the consequence is decided by the orchestrator rather than by the probe: whichever endpoint you point the healthcheck at, a failure marks the container unhealthy and the restart policy decides what happens next',
              'Cả bốn đều hỏi cùng một câu ở các độ sâu tăng dần, và hệ quả là do bộ điều phối quyết chứ không phải do lượt thăm dò: bạn trỏ healthcheck vào endpoint nào thì một lần trượt cũng đánh dấu container là không khoẻ và chính sách khởi động lại quyết phần còn lại',
            ),
            B(
              'Liveness and readiness differ only in what they check, not in what failing them does; the real distinction is the deep check, which is the only one allowed to touch a dependency, and the startup probe, which is the only one allowed to be slow',
              'Liveness và readiness chỉ khác nhau ở chỗ chúng KIỂM gì, chứ không khác ở chỗ trượt chúng thì XẢY RA gì; phân biệt thật sự nằm ở phép kiểm sâu, cái duy nhất được phép đụng tới một phụ thuộc, và ở lượt startup, cái duy nhất được phép chậm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The two failing actions are OPPOSITE, and that is the entire reason the probes exist separately. Consider Postgres being briefly unreachable: with a liveness probe that checks the database, every container fails, every one is killed and restarted, they all reconnect at once, and the database that was already struggling now takes a connection storm from every restarting instance. A twenty-second hiccup becomes a ten-minute outage caused entirely by the health check. With liveness independent of the database, the containers stay up, readiness fails, traffic stops, Postgres recovers, and a twenty-second hiccup is a twenty-second hiccup.' +
              sim('observability-health', 'obs-8-2-tu-ban-vao-chan', 'Watch a probe restart a healthy service'),
            'Hai hành động khi trượt là NGƯỢC NHAU, và đó là toàn bộ lý do hai lượt thăm dò này tồn tại riêng. Hãy hình dung Postgres tạm thời không với tới được: với một lượt liveness có kiểm cơ sở dữ liệu thì mọi container đều trượt, mọi cái đều bị giết rồi khởi động lại, tất cả cùng lúc kết nối lại, và cái cơ sở dữ liệu vốn đã chật vật giờ hứng một cơn bão kết nối từ mọi bản chạy đang khởi động. Một cú nấc hai mươi giây thành một cú sập mười phút, do chính phép kiểm sức khoẻ gây ra. Với liveness độc lập khỏi cơ sở dữ liệu thì các container vẫn sống, readiness trượt, lưu lượng dừng, Postgres hồi lại, và một cú nấc hai mươi giây vẫn chỉ là một cú nấc hai mươi giây.' +
              sim('observability-health', 'obs-8-2-tu-ban-vao-chan', 'Xem một lượt thăm dò khởi động lại một dịch vụ khoẻ mạnh'),
          ),
        }),

        mcq({
          prompt: B(
            'Your liveness probe is an unconditional' + code("app.get('/health/live', (_req, res) => res.json({ status: 'ok' }));") + 'The event loop is wedged by a runaway regex. What does the probe do, and how do you make liveness mean something?',
            'Lượt thăm dò liveness của bạn là một câu vô điều kiện' + code("app.get('/health/live', (_req, res) => res.json({ status: 'ok' }));") + 'Vòng lặp sự kiện đang bị treo bởi một biểu thức chính quy chạy loạn. Lượt thăm dò làm gì, và làm sao để liveness có ý nghĩa?',
          ),
          options: [
            B(
              'It fails immediately, because the handler cannot run while the loop is blocked and the HTTP server rejects the connection with ECONNREFUSED; the probe therefore already means "wedged" and no change is needed, and the two probes then differ only in the depth of what they touch, which is a configuration detail rather than a design one',
              'Nó trượt ngay lập tức, vì handler không chạy được trong lúc vòng lặp bị chặn và máy chủ HTTP từ chối kết nối bằng ECONNREFUSED; vậy lượt thăm dò đã mang nghĩa "bị treo" rồi và không cần đổi gì, và khi đó hai lượt thăm dò chỉ khác nhau ở độ sâu của thứ chúng chạm tới, một chi tiết cấu hình chứ không phải một quyết định thiết kế',
            ),
            B(
              'It returns 200 from a cached response, because Express serves the last body for an idempotent GET while the loop is blocked; disabling the response cache for the health routes makes the probe honest, so the container is replaced rather than drained and the in-flight requests are severed along with it, which is visible as a burst of 502s',
              'Nó trả 200 từ một phản hồi đã đệm, vì Express phục vụ lại phần thân gần nhất cho một lời gọi GET bất biến trong lúc vòng lặp bị chặn; tắt bộ đệm phản hồi cho các route sức khoẻ là lượt thăm dò trở nên trung thực, nên container bị thay thế chứ không được rút nước, và các request đang bay bị cắt theo, thứ nhìn thấy được thành một chùm lỗi 502',
            ),
            B(
              'It fails, but for the wrong reason: the TCP connection is accepted by the kernel and then times out, so the orchestrator records a timeout rather than a 503 and the retry budget is consumed twice as fast as configured, and the retry budget is consumed at the configured rate regardless of which endpoint the check points at, which is why the endpoint choice looks harmless',
              'Nó trượt, nhưng vì lý do sai: kết nối TCP được nhân hệ điều hành chấp nhận rồi hết giờ, nên bộ điều phối ghi nhận một lần hết giờ chứ không phải một mã 503, và ngân sách thử lại bị tiêu nhanh gấp đôi mức cấu hình, và ngân sách thử lại bị tiêu đúng theo mức đã cấu hình bất kể phép kiểm trỏ vào endpoint nào, và đó là lý do việc chọn endpoint trông có vẻ vô hại',
            ),
            B(
              'It may still PASS. The HTTP server accepts the connection at the kernel level and the handler runs as soon as the loop frees up — so if the orchestrator\'s timeout is longer than the stall, the probe eventually succeeds and reports the container healthy. Make liveness read the number that knows: fail with 503 when event-loop lag p99 exceeds a threshold far above anything a healthy service produces, such as 5000 ms. Set it too low and a GC pause or a big <code>JSON.parse</code> restarts a working container, which rebuilds the original bug with a different dependency',
              'Nó vẫn có thể ĐẬU. Máy chủ HTTP chấp nhận kết nối ở tầng nhân hệ điều hành và handler chạy ngay khi vòng lặp rảnh ra — nên nếu thời gian chờ của bộ điều phối dài hơn cú treo thì lượt thăm dò rốt cuộc vẫn thành công và báo container khoẻ mạnh. Hãy để liveness đọc con số biết chuyện: trả 503 khi độ trễ vòng lặp p99 vượt một ngưỡng cao hơn hẳn mọi thứ mà một dịch vụ khoẻ mạnh sinh ra, chẳng hạn 5000 ms. Đặt thấp quá thì một lượt thu gom rác hay một <code>JSON.parse</code> lớn sẽ khởi động lại một container đang chạy tốt, tức là dựng lại đúng cái bug ban đầu với một phụ thuộc khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Either outcome is bad and for the same underlying reason: an unconditional probe is describing the TCP layer, not your application, so a fully wedged process can pass a check that was written to detect exactly this. Choosing the threshold honestly means putting it where a human would say "that process is not coming back on its own", and nowhere tighter — normal p99 lag is around a millisecond and a deliberate 200 ms block measures 201 ms, so five seconds is far above anything healthy and far below "nobody noticed".',
            'Kết cục nào cũng tệ và cùng vì một lý do gốc: một lượt thăm dò vô điều kiện đang mô tả tầng TCP chứ không phải ứng dụng của bạn, nên một tiến trình treo hoàn toàn vẫn đậu được một phép kiểm viết ra để phát hiện đúng chuyện đó. Chọn ngưỡng một cách trung thực nghĩa là đặt nó ở chỗ mà một con người sẽ nói "cái tiến trình đó không tự sống lại được đâu", và không siết hơn — độ trễ p99 bình thường là cỡ một mili-giây và một cú chặn cố ý 200 ms đo được 201 ms, nên năm giây là cao hơn hẳn mọi thứ khoẻ mạnh và thấp hơn hẳn mức "chẳng ai nhận ra".',
          ),
        }),

        mcq({
          prompt: B(
            'Your graceful shutdown fails readiness, waits 10 seconds for the load balancer to notice, then closes the server. Your slowest request is a 25-second LLM call. Deploys still cut requests off, and the last few seconds of log are missing every time. Why?',
            'Phần tắt máy êm của bạn cho readiness trượt, chờ 10 giây để bộ cân bằng tải nhận ra, rồi đóng máy chủ. Request chậm nhất của bạn là một lời gọi LLM 25 giây. Các lần deploy vẫn cắt ngang request, và mấy giây log cuối cùng lần nào cũng mất. Vì sao?',
          ),
          options: [
            B(
              'Because <code>server.close()</code> does not wait for keep-alive connections, which stay open with no in-flight request and hold the shutdown until the client disconnects; calling <code>closeIdleConnections()</code> alongside it removes the delay and the truncation, and the truncation then stops on the next deploy',
              'Vì <code>server.close()</code> không chờ các kết nối keep-alive, thứ vẫn mở mà không có request nào đang bay và giữ quá trình tắt lại cho tới khi client ngắt; gọi thêm <code>closeIdleConnections()</code> là hết trễ và hết cụt log, và phần log bị cụt sẽ hết ở lần deploy kế tiếp',
            ),
            B(
              'Because the drain sleep runs before readiness has actually been observed as failing, so the load balancer is still routing when the sleep starts; moving the sleep after the first failed probe rather than after the flag is set fixes the ordering, which also explains why the first deploy of the day is the worst',
              'Vì lệnh ngủ để rút nước chạy TRƯỚC khi readiness thật sự được quan sát thấy là trượt, nên bộ cân bằng tải vẫn còn định tuyến lúc lệnh ngủ bắt đầu; dời lệnh ngủ ra sau lượt thăm dò trượt đầu tiên thay vì ngay sau khi bật cờ là sửa được thứ tự, điều này cũng giải thích vì sao lần deploy đầu tiên trong ngày là tệ nhất',
            ),
            B(
              'Because Docker sends SIGKILL ten seconds after SIGTERM by default, and your graceful shutdown does not get a vote. The arithmetic is unforgiving: the 10-second drain comes out of the SAME budget as any request still finishing, so the mechanism meant to make deploys clean is what runs you into the hard kill — and the kill discards buffered stdout, which is the missing log. Set <code>stop_grace_period</code> to comfortably exceed drain plus your slowest request, and add a <code>setTimeout(process.exit)</code> backstop so a hung shutdown ends on your terms',
              'Vì Docker gửi SIGKILL mười giây sau SIGTERM theo mặc định, và phần tắt máy êm của bạn không có quyền biểu quyết. Số học thì không khoan nhượng: mười giây rút nước ăn vào CÙNG một ngân sách với bất kỳ request nào còn đang chạy nốt, nên chính cái cơ chế sinh ra để làm cho các lần deploy sạch sẽ lại là thứ đẩy bạn vào cú giết cứng — và cú giết ấy vứt bỏ phần stdout còn trong đệm, tức là chỗ log bị mất. Hãy đặt <code>stop_grace_period</code> vượt thoải mái tổng của thời gian rút nước cộng request chậm nhất, và thêm một chốt <code>setTimeout(process.exit)</code> để một lần tắt bị treo kết thúc theo điều kiện của bạn',
            ),
            B(
              'Because the LLM call has no timeout of its own, so a request that arrives just before SIGTERM can outlive any grace period you configure; giving the outbound call a 25-second timeout below nginx\'s 30 seconds is the only fix that bounds the shutdown, and the grace period then never has to be raised at all',
              'Vì lời gọi LLM không có thời gian chờ của riêng nó, nên một request tới ngay trước SIGTERM có thể sống lâu hơn bất kỳ khoảng ân hạn nào bạn cấu hình; đặt cho lời gọi ra ngoài một thời gian chờ 25 giây, thấp hơn 30 giây của nginx, mới là cách duy nhất chặn được thời gian tắt, và khi đó khoảng ân hạn chẳng bao giờ cần phải nâng lên',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Options A and D both describe real problems worth fixing, and neither explains the missing log. The grace period is the outer bound on everything else, so it has to be set first: for this repository, with a 25-second LLM timeout and a drain of several seconds, forty seconds is the honest number. And the drain itself is not a hack — the load balancer learns you are unready by POLLING, so the minimum honest wait is the readiness interval times the failure threshold plus a margin. Choosing it shorter is choosing to drop requests; choosing it longer costs deploy time and nothing else.',
            'Lựa chọn A và D đều mô tả những vấn đề có thật đáng sửa, và không cái nào giải thích được chỗ log bị mất. Khoảng ân hạn là cận ngoài của mọi thứ khác, nên nó phải được đặt trước tiên: với kho này, có một thời gian chờ LLM 25 giây và vài giây rút nước, thì bốn mươi giây là con số trung thực. Và bản thân việc rút nước không phải một mẹo vá víu — bộ cân bằng tải biết bạn chưa sẵn sàng bằng cách HỎI ĐỀU, nên khoảng chờ trung thực tối thiểu là chu kỳ readiness nhân với ngưỡng số lần trượt, cộng một biên. Chọn ngắn hơn là chọn làm rơi request; chọn dài hơn thì chỉ tốn thời gian deploy chứ không mất gì.',
          ),
        }),

        mcq({
          prompt: B(
            'A container takes 35 seconds to boot on a busy VPS with a cold image. The compose healthcheck is <code>interval: 15s</code>, <code>retries: 3</code>, <code>start_period: 20s</code>. What happens, and what are the two things to change?',
            'Một container mất 35 giây để khởi động trên một VPS đang bận với một ảnh nguội. Healthcheck trong compose là <code>interval: 15s</code>, <code>retries: 3</code>, <code>start_period: 20s</code>. Chuyện gì xảy ra, và hai thứ cần đổi là gì?',
          ),
          options: [
            B(
              'A boot loop caused entirely by a probe that started asking too early: failures after 20 seconds count toward the retry budget, so three of them kill the container before it has ever finished starting, and it then takes 35 seconds again and is killed again. Set <code>start_period</code> to your worst observed boot time, doubled — and bind the port LAST, after the database is connected, the config is loaded and the routes are registered, so the server never accepts a connection it cannot serve',
              'Một vòng lặp khởi động do đúng một lượt thăm dò bắt đầu hỏi quá sớm gây ra: các lần trượt sau giây thứ 20 được tính vào ngân sách thử lại, nên ba lần là giết container trước khi nó kịp khởi động xong, rồi nó lại mất 35 giây và lại bị giết. Hãy đặt <code>start_period</code> bằng thời gian khởi động tệ nhất từng quan sát được, nhân đôi — và mở cổng SAU CÙNG, sau khi đã kết nối cơ sở dữ liệu, nạp cấu hình và đăng ký các route, để máy chủ không bao giờ nhận một kết nối mà nó không phục vụ nổi',
            ),
            B(
              'Nothing bad: <code>start_period</code> suppresses the health status entirely until the first success, so a container that has never been healthy is never marked unhealthy; the two things to change are cosmetic, namely a longer interval and fewer retries to reduce log noise',
              'Chẳng có gì xấu: <code>start_period</code> dập hẳn trạng thái sức khoẻ cho tới lần thành công đầu tiên, nên một container chưa từng khoẻ thì không bao giờ bị đánh dấu là không khoẻ; hai thứ cần đổi chỉ mang tính hình thức, tức là nới chu kỳ và giảm số lần thử lại để bớt nhiễu log',
            ),
            B(
              'The container is marked unhealthy but not restarted, because <code>restart: unless-stopped</code> does not act on health status; the two things to change are to switch the restart policy to <code>on-failure</code> and to raise <code>retries</code> so the boot has room',
              'Container bị đánh dấu là không khoẻ nhưng không bị khởi động lại, vì <code>restart: unless-stopped</code> không hành động theo trạng thái sức khoẻ; hai thứ cần đổi là chuyển chính sách khởi động lại sang <code>on-failure</code> và nâng <code>retries</code> để lần khởi động có chỗ thở',
            ),
            B(
              'The probe times out rather than failing, and a timeout is not counted against <code>retries</code> during the start period; the container eventually boots, and the two things to change are to raise <code>timeout</code> above the slowest probe and to add a startup-specific endpoint',
              'Lượt thăm dò hết giờ chứ không phải trượt, và một lần hết giờ thì không bị tính vào <code>retries</code> trong khoảng khởi động; container rốt cuộc vẫn lên được, và hai thứ cần đổi là nâng <code>timeout</code> lên trên lượt thăm dò chậm nhất và thêm một endpoint riêng cho lúc khởi động',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The two windows where requests die are start-up and shutdown, and they fail for mirror-image reasons. On start-up, Express binds the port in under half a second while Prisma has not connected, the config has not loaded and the routes are still being registered — so requests arriving in that window hit a server that is listening but not working. Binding last closes that window; <code>start_period</code> closes the one where the probe is asking a question the process has not had time to answer.',
            'Hai cửa sổ mà request chết là lúc khởi động và lúc tắt, và chúng hỏng vì hai lý do soi gương nhau. Lúc khởi động, Express mở cổng trong chưa tới nửa giây trong khi Prisma chưa kết nối, cấu hình chưa nạp và các route còn đang được đăng ký — nên các request tới trong cửa sổ đó gặp một máy chủ đang LẮNG NGHE mà chưa LÀM VIỆC. Mở cổng sau cùng là đóng được cửa sổ đó; còn <code>start_period</code> đóng cái cửa sổ mà lượt thăm dò đang hỏi một câu mà tiến trình chưa kịp có thời gian trả lời.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose the TWO things a health probe must NOT do. (choose TWO)',
            'Chọn HAI thứ mà một lượt thăm dò sức khoẻ KHÔNG được làm. (chọn HAI)',
          ),
          options: [
            B(
              'Return a status code that differs from the body it renders, since a machine reads the code and a human reads the body',
              'Trả về một mã trạng thái khác với phần thân nó dựng ra, vì máy đọc mã còn người đọc thân',
            ),
            B(
              'Require authentication — a token that expires at 3am for reasons unrelated to health takes the probe down with it',
              'Đòi xác thực — một cái token hết hạn lúc 3 giờ sáng vì những lý do chẳng liên quan gì tới sức khoẻ sẽ kéo lượt thăm dò chết theo',
            ),
            B(
              'Read a gauge that another part of the process maintains, because the value may be stale relative to the moment the probe runs',
              'Đọc một cái gauge do một phần khác của tiến trình duy trì, vì giá trị ấy có thể đã cũ so với thời điểm lượt thăm dò chạy',
            ),
            B(
              'WRITE — a probe that INSERTs to prove the database works writes once every fifteen seconds forever, from every instance',
              'GHI — một lượt thăm dò chèn một bản ghi để chứng minh cơ sở dữ liệu chạy được sẽ ghi mười lăm giây một lần, mãi mãi, từ mọi bản chạy',
            ),
          ],
          correct: [1, 3],
          explanation: EX(
            'The full list of things a probe must not do is short: no authentication, no writes, nothing slow (a 15-second interval with a 5-second timeout leaves no margin for a 4-second check, and a 6-second one marks a healthy service unhealthy), and no cascading — if your readiness calls a downstream service\'s readiness, which calls another, one slow leaf marks the whole tree unready. Check what YOU need, not what your dependencies need. Option A describes a real and serious bug — 200 with <code>{"status":"error"}</code> is invisible to every tool that reads it — but it is a bug in what the probe RETURNS rather than something the probe must not DO, and option C is exactly what a good liveness probe should do.',
            'Danh sách những thứ một lượt thăm dò không được làm thì ngắn: không xác thực, không ghi, không có gì chậm (chu kỳ 15 giây với thời gian chờ 5 giây thì một phép kiểm 4 giây chẳng còn biên nào, còn một phép kiểm 6 giây thì đánh dấu một dịch vụ khoẻ mạnh là không khoẻ), và không dây chuyền — nếu readiness của bạn gọi readiness của một dịch vụ phía dưới, cái đó lại gọi một cái nữa, thì một cái lá chậm sẽ đánh dấu cả cái cây là chưa sẵn sàng. Hãy kiểm thứ BẠN cần, không phải thứ các phụ thuộc của bạn cần. Lựa chọn A mô tả một lỗi có thật và nghiêm trọng — mã 200 kèm <code>{"status":"error"}</code> là vô hình với mọi công cụ đọc nó — nhưng đó là lỗi ở thứ lượt thăm dò TRẢ VỀ chứ không phải một việc nó không được LÀM, còn lựa chọn C đúng là thứ một lượt liveness tốt nên làm.',
          ),
        }),

        mcq({
          prompt: B(
            'One command, run during an incident before touching anything:' + code(
              "curl -sS -o /dev/null -w \\\n" +
              "  'dns:%{time_namelookup}s tcp:%{time_connect}s tls:%{time_appconnect}s ttfb:%{time_starttransfer}s code:%{http_code}\\n' \\\n" +
              '  https://cuongthai.com/api/v1/courses\n' +
              '\n' +
              'dns:0.021s tcp:0.089s tls:0.198s ttfb:0.412s code:200',
            ) + 'Which single number would isolate an expired or slow TLS certificate, and which part of the line is the only piece your internal checks can see?',
            'Một câu lệnh, chạy trong lúc có sự cố trước khi đụng vào bất cứ thứ gì:' + code(
              "curl -sS -o /dev/null -w \\\n" +
              "  'dns:%{time_namelookup}s tcp:%{time_connect}s tls:%{time_appconnect}s ttfb:%{time_starttransfer}s code:%{http_code}\\n' \\\n" +
              '  https://cuongthai.com/api/v1/courses\n' +
              '\n' +
              'dns:0.021s tcp:0.089s tls:0.198s ttfb:0.412s code:200',
            ) + 'Con số duy nhất nào cô lập được một chứng chỉ TLS hết hạn hay chậm, và phần nào của dòng ấy là phần DUY NHẤT mà các phép kiểm nội bộ của bạn nhìn thấy được?',
          ),
          options: [
            B(
              '<code>time_connect</code> isolates TLS, because the handshake is part of establishing the connection; the internal checks can see everything from <code>time_connect</code> onward, since they also open a socket',
              '<code>time_connect</code> cô lập TLS, vì phần bắt tay là một phần của việc thiết lập kết nối; các phép kiểm nội bộ nhìn thấy được mọi thứ từ <code>time_connect</code> trở đi, vì chúng cũng mở một socket',
            ),
            B(
              '<code>http_code</code> isolates TLS, because a certificate problem surfaces as a 495 or 526 depending on the proxy; the internal checks can see the code and nothing else, which is why they report success on an expired certificate',
              '<code>http_code</code> cô lập TLS, vì vấn đề chứng chỉ lộ ra thành mã 495 hoặc 526 tuỳ proxy; các phép kiểm nội bộ chỉ nhìn thấy mã trạng thái và không gì khác, và đó là lý do chúng báo thành công trên một chứng chỉ đã hết hạn',
            ),
            B(
              '<code>time_appconnect</code> isolates the TLS handshake; and the only part your internal checks can see is <code>ttfb</code> MINUS <code>time_appconnect</code> — nginx plus your app. Both the Docker healthcheck and the deploy smoke test reach the app by bypassing nginx, TLS and DNS entirely, so all four layers above are invisible from inside. A smoke test proving all 52 routes are mounted and a certificate that expired an hour ago are perfectly compatible states',
              '<code>time_appconnect</code> cô lập phần bắt tay TLS; còn phần duy nhất mà các phép kiểm nội bộ nhìn thấy được là <code>ttfb</code> TRỪ <code>time_appconnect</code> — tức nginx cộng ứng dụng của bạn. Cả healthcheck của Docker lẫn phép kiểm khói lúc deploy đều tới được ứng dụng bằng cách đi vòng hẳn qua nginx, TLS và DNS, nên cả bốn tầng phía trên đều vô hình từ bên trong. Một phép kiểm khói chứng minh cả 52 route đều đã gắn và một chứng chỉ hết hạn từ một tiếng trước là hai trạng thái hoàn toàn tương thích với nhau',
            ),
            B(
              '<code>time_namelookup</code> isolates TLS, because certificate validation resolves the issuer\'s OCSP responder by name before the handshake completes; the internal checks see the whole line except DNS, since containers resolve by service name',
              '<code>time_namelookup</code> cô lập TLS, vì phần xác thực chứng chỉ phải phân giải tên máy chủ OCSP của bên phát hành trước khi bắt tay xong; các phép kiểm nội bộ nhìn thấy cả dòng trừ phần DNS, vì các container phân giải theo tên dịch vụ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Seven layers sit between a user and your code — DNS, the CDN, TCP to the VPS, the TLS handshake, nginx, the Docker network, and finally Node — and every internal check starts at the last one. That is not an argument against the internal checks, which correctly isolate "is the app built right" from "is the network right". It is the argument for at least one check that hits the public hostname over TLS from somewhere else entirely, and for a certificate-expiry check, because that failure is cheap to prevent and total when it happens.',
            'Có bảy tầng nằm giữa một người dùng và mã của bạn — DNS, CDN, TCP tới VPS, phần bắt tay TLS, nginx, mạng Docker, và cuối cùng là Node — và mọi phép kiểm nội bộ đều bắt đầu ở tầng cuối cùng. Đó không phải lý lẽ chống lại các phép kiểm nội bộ, vốn tách bạch rất đúng giữa "ứng dụng có được dựng đúng không" và "mạng có đúng không". Đó là lý lẽ cho việc phải có ÍT NHẤT một phép kiểm gõ vào tên miền công khai qua TLS từ một nơi hoàn toàn khác, và cho một phép kiểm hạn chứng chỉ, vì cú hỏng đó thì rẻ để phòng và toàn diện khi nó xảy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'Your only external uptime check runs from one GitHub Actions runner. It goes red. What should the alert say, and what is the quieter failure of a single-location checker?',
            'Phép kiểm sống-chết từ bên ngoài duy nhất của bạn chạy trên một máy chạy GitHub Actions. Nó đỏ. Cảnh báo nên nói gì, và cú hỏng LẶNG LẼ hơn của một bộ kiểm chỉ đặt ở một nơi là gì?',
          ),
          options: [
            B(
              'It should say "GitHub\'s runner cannot reach us", which is a different claim from "we are down" — a single checker tells you about that location, not about your service, and repeated false alarms are exactly how a team learns to ignore uptime alerts. The quieter failure runs the other way: a check from one region stays GREEN through a routing problem that makes you unreachable from an entire country, and nothing tells you. Alert on AGREEMENT — two or more locations failing — rather than on any single failure',
              'Nó nên nói "máy chạy của GitHub không tới được chúng ta", một khẳng định KHÁC với "chúng ta đang sập" — một bộ kiểm duy nhất nói cho bạn về CÁI NƠI ĐÓ chứ không phải về dịch vụ của bạn, và những lần báo động giả lặp đi lặp lại chính là cách một nhóm học được thói quen phớt lờ cảnh báo sống-chết. Cú hỏng lặng lẽ hơn thì chạy theo chiều ngược lại: một phép kiểm từ một vùng vẫn XANH suốt một sự cố định tuyến làm bạn không với tới được từ cả một quốc gia, và chẳng có gì báo cho bạn. Hãy cảnh báo khi CÓ SỰ ĐỒNG THUẬN — từ hai nơi trở lên cùng trượt — chứ đừng cảnh báo theo một lần trượt đơn lẻ',
            ),
            B(
              'It should say "the site is down", because from the user\'s point of view an unreachable service is an outage regardless of which network path failed; the quieter failure is that a scheduled workflow can be delayed by several minutes under load, so the alert arrives late rather than never',
              'Nó nên nói "trang đang sập", vì từ góc nhìn người dùng thì một dịch vụ không với tới được là một cú sập bất kể đường mạng nào hỏng; cú hỏng lặng lẽ hơn là một workflow theo lịch có thể bị hoãn vài phút khi hệ thống bận, nên cảnh báo tới MUỘN chứ không phải không tới',
            ),
            B(
              'It should say nothing at all and instead open a ticket, because an external check can never distinguish its own network from yours and therefore never meets the bar for a page; the quieter failure is that GitHub disables scheduled workflows on inactive repositories',
              'Nó nên không nói gì cả mà chỉ mở một phiếu công việc, vì một phép kiểm bên ngoài không bao giờ phân biệt nổi mạng của chính nó với mạng của bạn nên không bao giờ đủ tiêu chuẩn để gọi người dậy; cú hỏng lặng lẽ hơn là GitHub tự tắt các workflow theo lịch trên những kho không hoạt động',
            ),
            B(
              'It should say "certificate or DNS", because those are the only two layers a single external check can isolate; the quieter failure is that the check runs from a data centre whose resolver caches aggressively, so a DNS change takes far longer to be noticed than it would from a user\'s network',
              'Nó nên nói "chứng chỉ hoặc DNS", vì đó là hai tầng duy nhất mà một phép kiểm bên ngoài đơn lẻ cô lập được; cú hỏng lặng lẽ hơn là phép kiểm ấy chạy từ một trung tâm dữ liệu có bộ phân giải đệm rất mạnh, nên một thay đổi DNS bị nhận ra chậm hơn nhiều so với từ mạng của một người dùng thật',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both halves of option B and both halves of option D are real caveats worth knowing — scheduled workflows do get delayed, GitHub does disable them on inactive repositories, resolvers do cache — but none of them is the failure mode that matters most. Confusing "one checker cannot reach us" with "we are down" costs more trust than the outage would, and it costs it in the direction that makes the next real alert less likely to be read.',
            'Cả hai nửa của lựa chọn B lẫn cả hai nửa của lựa chọn D đều là những lưu ý có thật đáng biết — các workflow theo lịch có bị hoãn, GitHub có tự tắt chúng trên các kho không hoạt động, các bộ phân giải có đệm — nhưng không cái nào là kiểu hỏng đáng kể nhất. Lẫn lộn giữa "một bộ kiểm không tới được chúng ta" với "chúng ta đang sập" làm mất nhiều lòng tin hơn cả bản thân cú sập, và nó làm mất theo hướng khiến cảnh báo THẬT tiếp theo ít có khả năng được đọc hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'You add a synthetic check that logs in with a real account, creates a note, reads it back and deletes it. Which set of rules keeps it from becoming its own incident?',
            'Bạn thêm một phép kiểm tổng hợp: đăng nhập bằng một tài khoản thật, tạo một ghi chú, đọc lại rồi xoá đi. Bộ quy tắc nào giữ cho nó khỏi trở thành một sự cố của chính nó?',
          ),
          options: [
            B(
              'Run it every 30 seconds so a failure is caught quickly, reuse an ordinary user account so the path is identical to a real one, and route its failures to the same channel as the other probes so there is one place to look, and the shared credentials keep the rotation story simple',
              'Chạy nó mỗi 30 giây để bắt lỗi nhanh, dùng lại một tài khoản người dùng bình thường để đường đi giống hệt đường thật, và định tuyến các lần trượt của nó vào cùng kênh với các lượt thăm dò khác để chỉ có một chỗ phải nhìn, và dùng chung thông tin đăng nhập giữ cho câu chuyện xoay khoá đơn giản',
            ),
            B(
              'A DEDICATED account, marked as such and excluded from analytics and from business metrics — otherwise it inflates <code>notes_created_total</code>, which is one of the two numbers that tell you the app works. It CLEANS UP, because a synthetic check that leaves rows behind is a slow-motion disk-fill. Every 5 minutes rather than every 30 seconds, because it WRITES to production. And its own alert channel, because a synthetic failure means a whole user journey is broken, which is more serious than a single probe and deserves different routing',
              'Một tài khoản RIÊNG, được đánh dấu rõ và loại khỏi phần phân tích lẫn các chỉ số nghiệp vụ — nếu không nó sẽ thổi phồng <code>notes_created_total</code>, một trong hai con số cho biết ứng dụng có chạy hay không. Nó phải DỌN SẠCH sau khi chạy, vì một phép kiểm tổng hợp để lại bản ghi là một cú làm đầy đĩa quay chậm. Chạy 5 phút một lần chứ không phải 30 giây một lần, vì nó GHI vào production. Và có kênh cảnh báo riêng, vì một lần trượt tổng hợp nghĩa là cả một hành trình người dùng đã hỏng, nghiêm trọng hơn một lượt thăm dò đơn lẻ và xứng đáng được định tuyến khác',
            ),
            B(
              'Run it inside the container so it does not depend on the public network, use the same account as the deploy smoke test so credentials are managed in one place, and skip the delete step so the created rows serve as a record of when the check last passed, and the internal path removes any dependency on DNS or TLS being correct',
              'Chạy nó BÊN TRONG container để nó không phụ thuộc mạng công cộng, dùng chung tài khoản với phép kiểm khói lúc deploy để thông tin đăng nhập quản lý ở một chỗ, và bỏ bước xoá đi để các bản ghi tạo ra làm bằng chứng cho lần cuối phép kiểm chạy đạt, và đường đi nội bộ bỏ được mọi phụ thuộc vào việc DNS hay TLS có đúng hay không',
            ),
            B(
              'Make it part of the readiness probe so the orchestrator stops routing traffic the moment a user journey breaks, which is the strongest possible response and removes the need for a separate alert channel entirely, and the orchestrator already knows how to drain traffic without dropping requests',
              'Đưa nó vào lượt thăm dò readiness để bộ điều phối ngừng định tuyến lưu lượng ngay khi một hành trình người dùng hỏng, phản ứng mạnh nhất có thể và bỏ hẳn nhu cầu có một kênh cảnh báo riêng, và bộ điều phối vốn đã biết cách rút lưu lượng mà không làm rơi request',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the level-3 check — "a real operation succeeds" — which catches almost everything and is ruled out of health probes for three reasons: it writes, it needs credentials that expire at 3am unrelated to health, and it is slow enough that a five-second timeout cannot contain a login plus a write plus a read. So it belongs outside, on a schedule, with the rules above. Option D is the same mistake as a dependency-checking liveness probe, scaled up: it converts one broken journey into an automatic traffic stop.',
            'Đây là phép kiểm mức 3 — "một thao tác thật chạy thành công" — thứ bắt được gần như mọi thứ và bị loại khỏi các lượt thăm dò sức khoẻ vì ba lý do: nó GHI, nó cần thông tin đăng nhập sẽ hết hạn lúc 3 giờ sáng vì lý do chẳng liên quan tới sức khoẻ, và nó chậm tới mức một thời gian chờ năm giây không chứa nổi một lần đăng nhập cộng một lần ghi cộng một lần đọc. Nên nó thuộc về BÊN NGOÀI, chạy theo lịch, với bộ quy tắc ở trên. Lựa chọn D là đúng cái sai lầm của một lượt liveness có kiểm phụ thuộc, phóng to lên: nó biến một hành trình hỏng thành một lệnh ngắt lưu lượng tự động.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Turn a list of spans into a tree, and find the time nobody accounted for (chapter 6).</b> <code>SPANS</code> is a flat array in the shape <code>ConsoleSpanExporter</code> actually prints on @opentelemetry/sdk-trace-node 2.11.0: the span\'s own id is <code>id</code> (there is no <code>spanId</code> field), its parent lives in <code>parentSpanContext.spanId</code> (there is no <code>parentSpanId</code>), and <code>timestamp</code> and <code>duration</code> are both in MICROSECONDS. Implement <code>phanTichTrace(spans)</code>.</p>' +
            '<ul>' +
            '<li>The root is the span with no <code>parentSpanContext</code>. Order children by <code>timestamp</code>, breaking ties by <code>id</code>.</li>' +
            '<li>A span whose parent id is not present in the array is an ORPHAN. Report it in <code>moCoi</code> — do not attach it to the root and do not drop it.</li>' +
            '<li><b>Self time</b> is the duration minus the time covered by the UNION of its children\'s intervals. The union is the whole point: five one-second queries running concurrently under a 1.1-second parent sum to five seconds of child time inside 1.1 seconds of wall clock, so a naive "sum the children" gives a negative self time and hides the parallelism.</li>' +
            '<li>Return the tree flattened in start order with a depth, plus every span\'s self time, plus the ROOT\'s self time as <code>gocRiengMs</code> — the unaccounted gap.</li>' +
            '</ul>' +
            '<p>Sorting by duration always puts the root first and is never the answer; sorting by self time is. Keep the given data and the printing block exactly as they are, and do not require anything outside Node\'s built-in modules.</p>',

            '<p><b>Câu 31 — Biến một danh sách span thành một cái cây, và tìm ra khoảng thời gian chẳng ai lý giải được (chương 6).</b> <code>SPANS</code> là một mảng phẳng theo đúng hình dạng mà <code>ConsoleSpanExporter</code> in ra thật trên @opentelemetry/sdk-trace-node 2.11.0: id của chính span nằm ở <code>id</code> (không có trường <code>spanId</code>), cha của nó nằm ở <code>parentSpanContext.spanId</code> (không có <code>parentSpanId</code>), còn <code>timestamp</code> và <code>duration</code> đều tính bằng MICRO GIÂY. Hãy cài đặt <code>phanTichTrace(spans)</code>.</p>' +
            '<ul>' +
            '<li>Gốc là span không có <code>parentSpanContext</code>. Sắp các span con theo <code>timestamp</code>, trùng thì sắp theo <code>id</code>.</li>' +
            '<li>Một span có id cha không hề xuất hiện trong mảng là một span MỒ CÔI. Hãy báo nó trong <code>moCoi</code> — đừng gắn nó vào gốc và đừng vứt nó đi.</li>' +
            '<li><b>Thời gian riêng</b> là thời lượng trừ đi phần thời gian được HỢP của các khoảng của các span con phủ lên. Phép hợp mới là điểm mấu chốt: năm truy vấn một giây chạy đồng thời dưới một span cha 1,1 giây cộng lại thành năm giây thời gian con nằm trong 1,1 giây đồng hồ tường, nên một phép "cộng các con" ngây thơ sẽ cho thời gian riêng ÂM và giấu mất tính song song.</li>' +
            '<li>Trả về cây đã làm phẳng theo thứ tự bắt đầu kèm độ sâu, cộng thời gian riêng của từng span, cộng thời gian riêng của GỐC dưới tên <code>gocRiengMs</code> — chính là cái khoảng trống chưa lý giải.</li>' +
            '</ul>' +
            '<p>Sắp theo thời lượng thì lúc nào cũng đẩy span gốc lên đầu và không bao giờ là đáp án; sắp theo thời gian riêng mới là. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không dùng gì ngoài các module có sẵn của Node.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const TRACE = \'9c42276d11a43860da6d10affcaea46e\';\n' +
            'const cha = (spanId) => ({ traceId: TRACE, spanId, traceFlags: 1, traceState: undefined });\n' +
            'const SPANS = [\n' +
            '  { traceId: TRACE, name: \'auth.verifyJwt\',             id: \'aa01\', parentSpanContext: cha(\'r000\'), timestamp: 1002000, duration: 4000 },\n' +
            '  { traceId: TRACE, name: \'POST modelapi.vn (b)\',       id: \'cc02\', parentSpanContext: cha(\'bb00\'), timestamp: 1060000, duration: 80000 },\n' +
            '  { traceId: TRACE, name: \'GET /api/v1/feed\',           id: \'r000\', parentSpanContext: undefined,   timestamp: 1000000, duration: 2100000 },\n' +
            '  { traceId: TRACE, name: \'prisma:query Post.findMany\', id: \'aa02\', parentSpanContext: cha(\'r000\'), timestamp: 1010000, duration: 30000 },\n' +
            '  { traceId: TRACE, name: \'embed.batch\',                id: \'bb00\', parentSpanContext: cha(\'r000\'), timestamp: 1050000, duration: 100000 },\n' +
            '  { traceId: TRACE, name: \'POST modelapi.vn (a)\',       id: \'cc01\', parentSpanContext: cha(\'bb00\'), timestamp: 1055000, duration: 90000 },\n' +
            '  { traceId: TRACE, name: \'response.serialise\',         id: \'aa03\', parentSpanContext: cha(\'r000\'), timestamp: 3092000, duration: 8000 },\n' +
            '  { traceId: TRACE, name: \'cache.warm\',                 id: \'zz99\', parentSpanContext: cha(\'ffff\'), timestamp: 1500000, duration: 12000 },\n' +
            '];\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '  // TODO\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const r = phanTichTrace(SPANS);\n' +
            'console.log(\'CÂY (theo thứ tự bắt đầu)\');\n' +
            'for (const h of r.hang) {\n' +
            '  console.log(\'  \' + \'  \'.repeat(h.sau) + h.name.padEnd(30 - h.sau * 2) +\n' +
            '    \' dur=\' + h.ms.toFixed(1) + \'ms self=\' + h.riengMs.toFixed(1) + \'ms\');\n' +
            '}\n' +
            'console.log(\'THEO SELF TIME\');\n' +
            'for (const h of [...r.hang].sort((a, b) => b.riengMs - a.riengMs || (a.id < b.id ? -1 : 1))) {\n' +
            '  console.log(\'  \' + h.riengMs.toFixed(1).padStart(8) + \'ms  \' + h.name);\n' +
            '}\n' +
            'console.log(\'khoang trong cua goc = \' + r.gocRiengMs.toFixed(1) + \'ms\');\n' +
            'console.log(\'mo coi = \' + JSON.stringify(r.moCoi.map((s) => s.name)));\n',
          expectedOutput:
            'CÂY (theo thứ tự bắt đầu)\n' +
            '  GET /api/v1/feed               dur=2100.0ms self=1958.0ms\n' +
            '    auth.verifyJwt               dur=4.0ms self=4.0ms\n' +
            '    prisma:query Post.findMany   dur=30.0ms self=30.0ms\n' +
            '    embed.batch                  dur=100.0ms self=10.0ms\n' +
            '      POST modelapi.vn (a)       dur=90.0ms self=90.0ms\n' +
            '      POST modelapi.vn (b)       dur=80.0ms self=80.0ms\n' +
            '    response.serialise           dur=8.0ms self=8.0ms\n' +
            'THEO SELF TIME\n' +
            '    1958.0ms  GET /api/v1/feed\n' +
            '      90.0ms  POST modelapi.vn (a)\n' +
            '      80.0ms  POST modelapi.vn (b)\n' +
            '      30.0ms  prisma:query Post.findMany\n' +
            '      10.0ms  embed.batch\n' +
            '       8.0ms  response.serialise\n' +
            '       4.0ms  auth.verifyJwt\n' +
            'khoang trong cua goc = 1958.0ms\n' +
            'mo coi = ["cache.warm"]\n',
          sampleSolution:
            'function phanTichTrace(spans) {\n' +
            '  const theoId = new Map(spans.map((s) => [s.id, s]));\n' +
            '  const con = new Map();\n' +
            '  const goc = [];\n' +
            '  const moCoi = [];\n' +
            '  for (const s of spans) {\n' +
            '    const pid = s.parentSpanContext ? s.parentSpanContext.spanId : null;\n' +
            '    if (pid === null) { goc.push(s); continue; }\n' +
            '    if (!theoId.has(pid)) { moCoi.push(s); continue; }\n' +
            '    if (!con.has(pid)) con.set(pid, []);\n' +
            '    con.get(pid).push(s);\n' +
            '  }\n' +
            '  for (const ds of con.values()) ds.sort((a, b) => a.timestamp - b.timestamp || (a.id < b.id ? -1 : 1));\n' +
            '\n' +
            '  const gop = (khoang) => {\n' +
            '    const ds = [...khoang].sort((a, b) => a[0] - b[0]);\n' +
            '    let tong = 0, dau = null, cuoi = null;\n' +
            '    for (const [s, e] of ds) {\n' +
            '      if (dau === null) { dau = s; cuoi = e; continue; }\n' +
            '      if (s > cuoi) { tong += cuoi - dau; dau = s; cuoi = e; }\n' +
            '      else if (e > cuoi) cuoi = e;\n' +
            '    }\n' +
            '    if (dau !== null) tong += cuoi - dau;\n' +
            '    return tong;\n' +
            '  };\n' +
            '\n' +
            '  const rieng = (s) => {\n' +
            '    const ds = con.get(s.id) ?? [];\n' +
            '    return s.duration - gop(ds.map((c) => [c.timestamp, c.timestamp + c.duration]));\n' +
            '  };\n' +
            '\n' +
            '  const hang = [];\n' +
            '  const di = (s, sau) => {\n' +
            '    hang.push({ sau, name: s.name, id: s.id, ms: s.duration / 1000, riengMs: rieng(s) / 1000 });\n' +
            '    for (const c of con.get(s.id) ?? []) di(c, sau + 1);\n' +
            '  };\n' +
            '  goc.sort((a, b) => a.timestamp - b.timestamp);\n' +
            '  for (const g of goc) di(g, 0);\n' +
            '\n' +
            '  return { hang, moCoi, gocRiengMs: goc.length ? rieng(goc[0]) / 1000 : 0 };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Simulate the orchestrator, not the probe (chapter 8).</b> The scaffold gives you a world timeline, two probe implementations and a Docker-style healthcheck config. Implement <code>moPhong(endpoint, cfg)</code>, which plays the healthcheck forward and reports what Docker would actually do.</p>' +
            '<ul>' +
            '<li>The first check runs at <code>interval</code> seconds after the current container started, and every <code>interval</code> after that, up to <code>horizon</code>.</li>' +
            '<li>A check that is still inside <code>start_period</code> — <code>t &lt; containerStart + startPeriod</code> — does NOT count toward the retry budget, and resets the consecutive-failure counter to zero. A success also resets it.</li>' +
            '<li>Outside the start period, each failure increments the counter. On reaching <code>retries</code> the container is UNHEALTHY and the restart policy replaces it: a new container starts <code>restartDelay</code> seconds later, its own start period begins then, the counter resets, and checks resume one <code>interval</code> after the new start.</li>' +
            '<li>Return the log and the number of restarts.</li>' +
            '</ul>' +
            '<p>Run it for both endpoints and read the two restart counts against each other. One of them is what happens when the liveness probe checks a dependency, and one is what happens when it checks the process. That difference is the answer to the whole chapter.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Mô phỏng bộ điều phối, không phải lượt thăm dò (chương 8).</b> Phần khung cho bạn một dòng thời gian của thế giới, hai bản cài đặt lượt thăm dò và một cấu hình healthcheck kiểu Docker. Hãy cài đặt <code>moPhong(endpoint, cfg)</code>, thứ chạy tới phép kiểm sức khoẻ và báo lại điều Docker sẽ thật sự làm.</p>' +
            '<ul>' +
            '<li>Lượt kiểm đầu tiên chạy sau <code>interval</code> giây kể từ lúc container hiện tại khởi động, rồi cứ mỗi <code>interval</code> một lần, cho tới <code>horizon</code>.</li>' +
            '<li>Một lượt kiểm còn nằm trong <code>start_period</code> — <code>t &lt; lúcContainerKhởiĐộng + startPeriod</code> — thì KHÔNG tính vào ngân sách thử lại, và đặt lại bộ đếm trượt-liên-tiếp về 0. Một lượt thành công cũng đặt lại nó.</li>' +
            '<li>Ngoài khoảng khởi động, mỗi lần trượt là một lần tăng bộ đếm. Chạm tới <code>retries</code> thì container bị coi là UNHEALTHY và chính sách khởi động lại thay nó: một container mới khởi động sau <code>restartDelay</code> giây, khoảng khởi động của riêng nó bắt đầu từ đó, bộ đếm đặt lại, và các lượt kiểm tiếp tục sau một <code>interval</code> kể từ lần khởi động mới.</li>' +
            '<li>Trả về nhật ký và số lần khởi động lại.</li>' +
            '</ul>' +
            '<p>Hãy chạy nó cho cả hai endpoint rồi đọc hai con số khởi động lại đối chiếu nhau. Một cái là điều xảy ra khi lượt liveness đi kiểm một phụ thuộc, cái kia là điều xảy ra khi nó kiểm chính tiến trình. Đúng cái chênh lệch ấy là đáp án của cả chương.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const THE_GIOI = [\n' +
            '  { t: 0,   db: \'up\',   loop: \'ok\' },\n' +
            '  { t: 40,  db: \'down\', loop: \'ok\' },\n' +
            '  { t: 200, db: \'up\',   loop: \'ok\' },\n' +
            '  { t: 240, db: \'up\',   loop: \'wedged\' },\n' +
            '];\n' +
            'const trangThai = (t) => THE_GIOI.filter((e) => e.t <= t).pop();\n' +
            '\n' +
            'const PROBE = {\n' +
            '  \'/health\':      (w) => (w.loop === \'ok\' && w.db === \'up\') ? 200 : 503,\n' +
            '  \'/health/live\': (w) => (w.loop === \'ok\') ? 200 : 503,\n' +
            '};\n' +
            '\n' +
            'const CAU_HINH = { interval: 15, timeout: 5, retries: 3, startPeriod: 30, restartDelay: 2, horizon: 300 };\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '  // TODO\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const ep of [\'/health\', \'/health/live\']) {\n' +
            '  const r = moPhong(ep, CAU_HINH);\n' +
            '  console.log(\'=== \' + ep + \' ===\');\n' +
            '  for (const d of r.nhatKy) console.log(\'  \' + d);\n' +
            '  console.log(\'  SO LAN KHOI DONG LAI = \' + r.soLanTraiLai);\n' +
            '}\n',
          expectedOutput:
            '=== /health ===\n' +
            '  t=15s /health -> 200 truot=0\n' +
            '  t=30s /health -> 200 truot=0\n' +
            '  t=45s /health -> 503 truot=1/3\n' +
            '  t=60s /health -> 503 truot=2/3\n' +
            '  t=75s /health -> 503 truot=3/3\n' +
            '  t=75s UNHEALTHY -> khoi dong lai (lan 1)\n' +
            '  t=92s /health -> 503 (trong start_period, KHONG tinh) truot=0\n' +
            '  t=107s /health -> 503 truot=1/3\n' +
            '  t=122s /health -> 503 truot=2/3\n' +
            '  t=137s /health -> 503 truot=3/3\n' +
            '  t=137s UNHEALTHY -> khoi dong lai (lan 2)\n' +
            '  t=154s /health -> 503 (trong start_period, KHONG tinh) truot=0\n' +
            '  t=169s /health -> 503 truot=1/3\n' +
            '  t=184s /health -> 503 truot=2/3\n' +
            '  t=199s /health -> 503 truot=3/3\n' +
            '  t=199s UNHEALTHY -> khoi dong lai (lan 3)\n' +
            '  t=216s /health -> 200 truot=0\n' +
            '  t=231s /health -> 200 truot=0\n' +
            '  t=246s /health -> 503 truot=1/3\n' +
            '  t=261s /health -> 503 truot=2/3\n' +
            '  t=276s /health -> 503 truot=3/3\n' +
            '  t=276s UNHEALTHY -> khoi dong lai (lan 4)\n' +
            '  t=293s /health -> 503 (trong start_period, KHONG tinh) truot=0\n' +
            '  SO LAN KHOI DONG LAI = 4\n' +
            '=== /health/live ===\n' +
            '  t=15s /health/live -> 200 truot=0\n' +
            '  t=30s /health/live -> 200 truot=0\n' +
            '  t=45s /health/live -> 200 truot=0\n' +
            '  t=60s /health/live -> 200 truot=0\n' +
            '  t=75s /health/live -> 200 truot=0\n' +
            '  t=90s /health/live -> 200 truot=0\n' +
            '  t=105s /health/live -> 200 truot=0\n' +
            '  t=120s /health/live -> 200 truot=0\n' +
            '  t=135s /health/live -> 200 truot=0\n' +
            '  t=150s /health/live -> 200 truot=0\n' +
            '  t=165s /health/live -> 200 truot=0\n' +
            '  t=180s /health/live -> 200 truot=0\n' +
            '  t=195s /health/live -> 200 truot=0\n' +
            '  t=210s /health/live -> 200 truot=0\n' +
            '  t=225s /health/live -> 200 truot=0\n' +
            '  t=240s /health/live -> 503 truot=1/3\n' +
            '  t=255s /health/live -> 503 truot=2/3\n' +
            '  t=270s /health/live -> 503 truot=3/3\n' +
            '  t=270s UNHEALTHY -> khoi dong lai (lan 1)\n' +
            '  t=287s /health/live -> 503 (trong start_period, KHONG tinh) truot=0\n' +
            '  SO LAN KHOI DONG LAI = 1\n',
          sampleSolution:
            'function moPhong(endpoint, cfg) {\n' +
            '  const probe = PROBE[endpoint];\n' +
            '  const nhatKy = [];\n' +
            '  let batDau = 0;          // thời điểm container hiện tại khởi động\n' +
            '  let truot = 0;           // số lượt trượt LIÊN TIẾP đã tính\n' +
            '  let soLanTraiLai = 0;\n' +
            '  let t = batDau + cfg.interval;\n' +
            '\n' +
            '  while (t <= cfg.horizon) {\n' +
            '    const ma = probe(trangThai(t));\n' +
            '    const trongKhoiDong = t < batDau + cfg.startPeriod;\n' +
            '    if (ma === 200) {\n' +
            '      truot = 0;\n' +
            '      nhatKy.push(`t=${t}s ${endpoint} -> 200 truot=0`);\n' +
            '    } else if (trongKhoiDong) {\n' +
            '      truot = 0;\n' +
            '      nhatKy.push(`t=${t}s ${endpoint} -> ${ma} (trong start_period, KHONG tinh) truot=0`);\n' +
            '    } else {\n' +
            '      truot++;\n' +
            '      nhatKy.push(`t=${t}s ${endpoint} -> ${ma} truot=${truot}/${cfg.retries}`);\n' +
            '      if (truot >= cfg.retries) {\n' +
            '        soLanTraiLai++;\n' +
            '        nhatKy.push(`t=${t}s UNHEALTHY -> khoi dong lai (lan ${soLanTraiLai})`);\n' +
            '        batDau = t + cfg.restartDelay;\n' +
            '        truot = 0;\n' +
            '        t = batDau + cfg.interval;\n' +
            '        continue;\n' +
            '      }\n' +
            '    }\n' +
            '    t += cfg.interval;\n' +
            '  }\n' +
            '  return { nhatKy, soLanTraiLai };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
