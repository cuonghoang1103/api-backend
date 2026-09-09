/**
 * Observability & Monitoring — Final Exam (FE): 50 câu trắc nghiệm phủ cả 13
 * chương (s00–s12).
 *
 * Đề tự soạn, bám sát `content/courses/observability-monitoring/s00…s12`. Có cả
 * câu lý thuyết lẫn câu đọc output; **mọi khối output trong đề đều CHẠY THẬT**
 * trên máy đo dưới đây — không có dòng nào chép từ trí nhớ hay từ tài liệu.
 *
 * ┌── MÁY ĐO ────────────────────────────────────────────────────────────────┐
 * │ Node v22.21.0 · darwin-arm64 (macOS 25.6, Apple silicon, 4 nhân hiệu năng)│
 * │ prom-client                        15.1.3                                │
 * │ pino                               10.3.1                                │
 * │ pino-http                          11.0.0                                │
 * │ express                             5.2.1                                │
 * │ @opentelemetry/api                  1.9.1                                │
 * │ @opentelemetry/sdk-node             0.222.0                              │
 * │ @opentelemetry/sdk-trace-node       2.11.0                               │
 * │ @opentelemetry/auto-instrumentations-node 0.80.0                         │
 * │ Prometheus                          v3.5.0 (container, Docker Engine 29.5.3)│
 * └──────────────────────────────────────────────────────────────────────────┘
 * Thư mục đo nằm NGOÀI kho (`scratchpad/obs-lab`), không có gói nào được thêm
 * vào `package.json` của dự án. Container Prometheus đã `docker rm -f` sau khi
 * đo xong.
 *
 * ═══ NĂM CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY ═══
 *
 *  1. Giáo trình (5.5) nói `nodejs_eventloop_lag_seconds` mặc định "là một
 *     TRUNG BÌNH". Trên prom-client 15.1.3 nó KHÔNG phải: `collectDefaultMetrics`
 *     phơi ra tám chuỗi riêng biệt — `nodejs_eventloop_lag_seconds` (một mẫu
 *     TỨC THỜI, đo được **0** trong đúng lượt chạy mà p99 là 0,015163391), cộng
 *     `_min_`, `_max_`, `_mean_`, `_stddev_`, `_p50_`, `_p90_`, `_p99_`. Nên đề
 *     hỏi theo HỌ CHỈ SỐ THẬT, và câu 22 dùng nguyên văn tám dòng ấy.
 *
 *  2. Giáo trình (5.5) nói `collectDefaultMetrics` cho "khoảng sáu mươi chỉ số"
 *     và "~21 trong ~60 chuỗi" là heap-space. Đo thật: **27 họ chỉ số · 55 dòng
 *     chuỗi**, trong đó **33** dòng là `nodejs_heap_space_size_*`. Đề không dùng
 *     con số 60 lẫn 21.
 *
 *  3. Giáo trình (6.1) vẽ một span với khoá `parentSpanId` — đúng với KHUÔN
 *     OTLP TRÊN DÂY, nhưng `ConsoleSpanExporter` của `@opentelemetry/sdk-trace-node`
 *     2.11.0 in ra khoá `id` và `parentSpanContext`, KHÔNG có `spanId` lẫn
 *     `parentSpanId`. Câu 27 dùng đúng khoá máy in ra.
 *
 *  4. Giáo trình (4.3, bước 4) nói vượt ô lớn nhất thì `"+Inf"` "chẳng nói cho
 *     bạn biết gì ngoài 'tệ hơn 5 giây'". Đo thật trên Prometheus v3.5.0 thì
 *     TỆ HƠN THẾ: `histogram_quantile` trả về **đúng ranh giới hữu hạn lớn
 *     nhất** — mọi mẫu đều 42 s và 55 s mà p99 đọc ra **10**, tức một con số
 *     trông hoàn toàn hợp lý. Câu 18 ra đề theo máy.
 *
 *  5. `ConsoleSpanExporter` in `duration` bằng **micro giây** (span ngủ 250 ms
 *     đo được `duration: 251001.792`), không phải mili giây. Giáo trình không
 *     nói sai chỗ này, nhưng nó cũng không nói — và đọc nhầm đơn vị là cách
 *     nhanh nhất để kết luận sai về một waterfall.
 *
 * ═══ NHỮNG CHỖ KHÔNG ĐO ĐƯỢC, CHỈ SUY THEO TÀI LIỆU ═══
 *   • **Sentry (chương 7): KHÔNG đụng tới dịch vụ thật.** Không DSN, không đọc
 *     `.env`, không gửi sự kiện nào đi đâu. Bốn câu chương 7 hỏi CƠ CHẾ có tài
 *     liệu công khai (vân tay dựng từ kiểu ngoại lệ + các khung in-app, phạm vi
 *     `beforeSend` so với `beforeBreadcrumb`, `sendDefaultPii`, release và
 *     source map) và mã CÓ THẬT trong kho này (`src/services/sentry.service.ts`,
 *     `src/middleware/errorHandler.ts`). Không câu nào bịa output của dịch vụ.
 *   • **Loki / LogQL (chương 2): chưa dựng được Loki.** Câu 9 hỏi NGỮ NGHĨA
 *     truy vấn (nhãn được đánh chỉ mục, nội dung thì không) theo tài liệu
 *     Grafana cộng chính các con số mà giáo trình đã đếm trên kho này
 *     (325 giá trị `msg`, 28 → 9.100 luồng). **Suy luận theo tài liệu, chưa
 *     chạy được.**
 *   • **Phong bì json-file 1,62×, xoay vòng log, đĩa VPS (chương 2)**: lấy
 *     nguyên phép đo của giáo trình, KHÔNG đo lại.
 *   • **Alertmanager (chương 9)**: chỉ mức tài liệu, không dựng.
 *   • **Mọi con số nano giây** (571 ns / 1.310 ns một dòng log, 4.985 ns qua
 *     pipe, 677 ns của AsyncLocalStorage): **KHÔNG đo lại**. Máy này đang có
 *     agent khác chạy, nên số đo độ trễ lấy lúc có tải là số vô nghĩa
 *     (`feedback_bay_chi_phi_va_do_luong_llm`). Các câu dùng chúng chỉ hỏi TỈ LỆ
 *     và CƠ CHẾ, đúng như bài 12.1 dặn: tỉ lệ mới là phần bền, con số tuyệt đối
 *     thì không.
 *
 * ═══ PHÂN BỐ CÂU THEO CHƯƠNG (50 câu) ═══
 *   Mục 0  · giới thiệu, ba trụ cột, hình dạng chi phí ........  2  (q1–q2)
 *   Ch. 1  · log có cấu trúc, mức log, nghẽn ngược stdout .....  4  (q3–q6)
 *   Ch. 2  · đường ống log, xoay vòng, LogQL, lưu trữ .........  4  (q7–q10)
 *   Ch. 3  · request id, AsyncLocalStorage, traceparent .......  4  (q11–q14)
 *   Ch. 4  · bốn loại chỉ số, phân vị, ô, lực lượng nhãn ......  6  (q15–q20)
 *   Ch. 5  · trễ vòng lặp, bộ nhớ, GC, bể kết nối .............  5  (q21–q25)
 *   Ch. 6  · span, thứ tự khởi tạo, lấy mẫu, waterfall ........  5  (q26–q30)
 *   Ch. 7  · lỗi, gom nhóm, PII, release ......................  4  (q31–q34)
 *   Ch. 8  · liveness/readiness, cửa sổ deploy, độ sâu ........  5  (q35–q39)
 *   Ch. 9  · ngưỡng, SLO, ngân sách lỗi, mệt mỏi ..............  4  (q40–q43)
 *   Ch. 10 · khán giả của bảng, đồ thị nói dối, nối trụ cột ...  3  (q44–q46)
 *   Ch. 11 · bảy hình dạng hỏng hóc, sự cố thật ...............  3  (q47–q49)
 *   Ch. 12 · tổng kết, dựng cái gì trước ......................  1  (q50)
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/OBSERVABILITY-MONITORING-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/OBSERVABILITY-MONITORING-FE.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBSERVABILITY-MONITORING-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/observability-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all thirteen chapters, from "a log line has two audiences" to "a green check that measures nothing is worse than no check". Many questions show a real transcript — a <code>/metrics</code> body, a JSON log line, a span dumped by the console exporter, a PromQL result — and every one of those came from actually running it, so read the transcript rather than the intuition.</p>' +
  '<p>Four habits pay off here. First, read a number together with its <em>conditions</em>: 39.5 ms means nothing without knowing whether it is a mean, a p50 or a p99. Second, separate <em>missing</em> from <em>wrong</em> — an empty PromQL result and a plausible-looking one are two different failures, and the second is far more expensive. Third, when a question shows an action, ask what the opposite action would have been: restart and drain-traffic are opposite responses to the same probe failing. Fourth, remember that every label is multiplied, never added.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười ba chương, từ "một dòng log có hai khán giả" tới "một phép kiểm xanh mà chẳng đo gì thì tệ hơn là không có phép kiểm nào". Nhiều câu cho sẵn một đoạn output thật — phần thân <code>/metrics</code>, một dòng log JSON, một span do trình xuất console in ra, một kết quả PromQL — và mọi đoạn loại đó đều lấy từ việc CHẠY THẬT, nên hãy đọc đoạn output thay vì đoán theo cảm tính.</p>' +
  '<p>Bốn thói quen giúp ích ở đây. Một, đọc một con số cùng với ĐIỀU KIỆN của nó: 39,5 ms chẳng nghĩa gì nếu không biết đó là trung bình, p50 hay p99. Hai, tách bạch THIẾU với SAI — một kết quả PromQL rỗng và một kết quả trông hợp lý là hai cú hỏng khác nhau, mà cái thứ hai đắt hơn nhiều. Ba, khi một câu nói tới một hành động, hãy hỏi hành động ngược lại là gì: khởi động lại và ngắt lưu lượng là hai phản ứng NGƯỢC NHAU trước cùng một lượt thăm dò trượt. Bốn, nhớ rằng mỗi cái nhãn đều NHÂN vào, không bao giờ cộng vào.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'observability-monitoring' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Observability & Monitoring course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Quan trắc & Giám sát (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all thirteen chapters: what makes a log line queryable and what a log line costs, the pipeline from stdout to a store you can query, making one request traceable across four boundaries, the four metric types and the arithmetic of cardinality, the metrics only Node can report, spans and sampling and waterfalls, error grouping and PII, probes that mean something, alerts derived rather than copied, dashboards people read, and a method for diagnosing what broke.',
        'Năm mươi câu trắc nghiệm phủ cả mười ba chương: cái gì làm một dòng log truy vấn được và một dòng log tốn bao nhiêu, đường ống từ stdout tới một kho hỏi được, làm một request lần theo được qua bốn ranh giới, bốn loại chỉ số và phép tính lực lượng nhãn, những chỉ số chỉ Node nói cho bạn biết, span với lấy mẫu và biểu đồ thác, gom nhóm lỗi và dữ liệu cá nhân, những lượt thăm dò nói được điều gì đó, cảnh báo suy ra được thay vì chép lại, bảng theo dõi người ta thật sự đọc, và một phương pháp chẩn đoán khi có thứ hỏng.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — trước khi đo bất cứ thứ gì (2 câu) ──────────────────── */

        // q1 · đáp án 0
        mcq({
          prompt: B(
            'What separates <b>monitoring</b> from <b>observability</b>?',
            '<b>Giám sát</b> khác <b>quan sát được</b> ở chỗ nào?',
          ),
          options: [
            B(
              'Monitoring answers questions you wrote down in advance, so it catches the failure you predicted; observability is having enough recorded detail to answer questions you did not think to ask, after the fact',
              'Giám sát trả lời những câu hỏi bạn đã viết ra từ trước, nên nó bắt được cú hỏng bạn đã tiên đoán; quan sát được là có đủ chi tiết đã ghi lại để trả lời những câu bạn chưa nghĩ tới việc hỏi, sau khi chuyện đã xảy ra',
            ),
            B(
              'Monitoring is the collection of data and observability is the visualisation of it, so a system with dashboards is observable while one with only raw metrics is merely monitored',
              'Giám sát là việc thu thập dữ liệu còn quan sát được là việc hiển thị nó, nên một hệ thống có bảng theo dõi thì quan sát được còn hệ thống chỉ có chỉ số thô thì mới chỉ được giám sát',
            ),
            B(
              'Monitoring is what an operations team does to a system from outside and observability is what a development team builds into it from inside; the two words describe who owns the work',
              'Giám sát là thứ đội vận hành làm với hệ thống từ bên ngoài còn quan sát được là thứ đội phát triển dựng vào bên trong nó; hai chữ đó mô tả việc thuộc về ai',
            ),
            B(
              'Monitoring covers infrastructure signals such as CPU and disk while observability covers application signals such as request latency; the split is by which layer the number comes from',
              'Giám sát lo các tín hiệu hạ tầng như CPU và đĩa còn quan sát được lo các tín hiệu ứng dụng như độ trễ request; ranh giới là ở chỗ con số đến từ tầng nào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The distinction is about <em>which questions are possible</em>, not about tooling, teams or layers. A check for "is CPU above 80%?" is monitoring: someone knew to ask, so they built it, and it catches exactly that. "Why is this <em>one</em> user&#39;s upload timing out, only on Tuesdays, only above 4 MB?" is a question nobody writes a check for in advance — answering it requires that enough detail was recorded at the time. That is why this course spends four chapters on log fields, request ids and span attributes: they are what makes the unasked question answerable later. Option 2 confuses a rendering with a capability — a dashboard of eight numbers is monitoring no matter how pretty. Options 3 and 4 are real organisational and layering distinctions that exist in the industry, but neither changes what you can ask after an incident, which is the property that matters.',
            'Khác biệt nằm ở chỗ <em>những câu hỏi nào là khả thi</em>, không phải ở công cụ, ở đội ngũ hay ở tầng. Một phép kiểm "CPU có vượt 80% không?" là GIÁM SÁT: có người biết phải hỏi, nên họ dựng nó, và nó bắt đúng cái đó. "Vì sao upload của ĐÚNG MỘT người dùng này hết giờ, chỉ vào thứ Ba, chỉ khi file trên 4 MB?" là câu chẳng ai viết sẵn phép kiểm — trả lời được nó đòi hỏi lúc ấy đã có đủ chi tiết được ghi lại. Đó là lý do khoá này dành bốn chương cho các trường của dòng log, cho request id và cho thuộc tính của span: chính chúng làm cho câu hỏi CHƯA ĐƯỢC HỎI trả lời được về sau. Phương án 2 lẫn cách hiển thị với năng lực — một cái bảng tám con số vẫn là giám sát dù nó đẹp tới đâu. Phương án 3 và 4 là những phân chia về tổ chức và về tầng có thật trong ngành, nhưng không cái nào thay đổi được thứ bạn hỏi được SAU một sự cố, mà đó mới là tính chất đáng kể.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'Metrics, traces and logs have three different <b>cost shapes</b>. Which description is right?',
            'Chỉ số, trace và log có ba <b>hình dạng chi phí</b> khác nhau. Mô tả nào đúng?',
          ),
          options: [
            B(
              'All three grow linearly with traffic, so the only lever available for any of them is to reduce how much traffic reaches the instrumented code path',
              'Cả ba đều lớn lên tuyến tính theo lưu lượng, nên cần gạt duy nhất cho cả ba là giảm lượng lưu lượng đi qua đoạn mã có đo đạc',
            ),
            B(
              'Metrics grow with traffic while logs and traces are capped by their retention window, which is why retention is the first setting to tighten when a bill arrives',
              'Chỉ số lớn theo lưu lượng còn log với trace bị chặn bởi cửa sổ lưu trữ của chúng, và đó là lý do lưu trữ là thiết lập đầu tiên cần siết khi hoá đơn tới',
            ),
            B(
              'Metrics cost per series per scrape and are independent of traffic; traces cost per sampled request, so linear in traffic divided by the sample rate; logs cost per event with no cap, linear in both traffic and verbosity, and those two multiply',
              'Chỉ số tốn theo mỗi chuỗi thời gian theo mỗi chu kỳ thu thập và ĐỘC LẬP với lưu lượng; trace tốn theo mỗi request được lấy mẫu, tức tuyến tính theo lưu lượng chia cho tỉ lệ lấy mẫu; log tốn theo mỗi sự kiện và không có trần, tuyến tính theo cả lưu lượng lẫn độ chi tiết, mà hai thứ đó NHÂN với nhau',
            ),
            B(
              'Traces are the cheapest because they are sampled, logs are next because they compress well, and metrics are the most expensive because a time-series database must keep every sample forever',
              'Trace rẻ nhất vì được lấy mẫu, log đứng kế vì nén tốt, còn chỉ số đắt nhất vì một cơ sở dữ liệu chuỗi thời gian phải giữ mọi mẫu mãi mãi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the single most useful thing to know before choosing where a number should live. A counter costs the same whether you serve ten requests a second or ten thousand — its cost is per <em>series</em>, per scrape interval — which is exactly why metrics carry the alerting. Traces are linear in traffic but you control the divisor, which is what makes sampling mandatory rather than optional. Logs are the dangerous one: cost is per event, uncapped, and the two multipliers compound — adding one debug line per request to a service doing 500 rps adds 43 million lines a day. Option 4 inverts reality: metrics are the cheap pillar precisely because aggregation happens <em>before</em> storage. Option 2 is the mistake that costs teams money, because tightening retention on a store billed per GB <em>ingested</em> changes nothing at all — volume is the lever, not retention.',
            'Đây là thứ hữu ích nhất cần biết trước khi quyết một con số nên nằm ở đâu. Một bộ đếm tốn như nhau dù bạn phục vụ mười request một giây hay mười nghìn — chi phí của nó tính theo mỗi CHUỖI THỜI GIAN, theo mỗi chu kỳ thu thập — và chính vì thế chỉ số gánh phần cảnh báo. Trace tuyến tính theo lưu lượng nhưng bạn nắm cái số chia, và đó là điều làm việc lấy mẫu thành bắt buộc chứ không phải tuỳ chọn. Log mới là thứ nguy hiểm: giá theo mỗi sự kiện, không trần, và hai hệ số nhân chồng lên nhau — thêm một dòng debug mỗi request vào một dịch vụ chạy 500 rps là thêm 43 triệu dòng mỗi ngày. Phương án 4 lộn ngược thực tế: chỉ số là trụ cột RẺ đúng bởi vì việc gộp xảy ra TRƯỚC khi lưu. Phương án 2 là sai lầm làm các đội tốn tiền, vì siết lưu trữ trên một kho tính tiền theo mỗi GB NẠP VÀO thì chẳng đổi được gì — cần gạt là KHỐI LƯỢNG, không phải thời gian lưu.',
          ),
        }),

        /* ── Chương 1 — log có cấu trúc và cái giá của nó (4 câu) ────────── */

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'This runs on <b>pino 10.3.1</b>, Node v22.21.0. Which line does the third call actually print?' +
            code(
              "const pino = require('pino');\n" +
              "const logger = pino({ base: null });\n" +
              "logger.info({ userId:'u_8f3a', route:'/api/v1/notes', ms:42 }, 'request completed');\n" +
              "logger.debug({ x: 1 }, 'entering handler');\n" +
              "const child = logger.child({ requestId:'V1StGXR8_Z5j' });\n" +
              "child.warn({ retries: 2 }, 'fallback used');"),
            'Đoạn này chạy trên <b>pino 10.3.1</b>, Node v22.21.0. Lời gọi thứ ba thật sự in ra dòng nào?' +
            code(
              "const pino = require('pino');\n" +
              "const logger = pino({ base: null });\n" +
              "logger.info({ userId:'u_8f3a', route:'/api/v1/notes', ms:42 }, 'request completed');\n" +
              "logger.debug({ x: 1 }, 'entering handler');\n" +
              "const child = logger.child({ requestId:'V1StGXR8_Z5j' });\n" +
              "child.warn({ retries: 2 }, 'fallback used');"),
          ),
          options: [
            B(
              '<code>{"level":"warn","time":"2026-09-09T20:45:51.168Z","msg":"fallback used","requestId":"V1StGXR8_Z5j","retries":2}</code> — the level is the word, the time is ISO 8601, and the message leads because it is what a human reads first',
              '<code>{"level":"warn","time":"2026-09-09T20:45:51.168Z","msg":"fallback used","requestId":"V1StGXR8_Z5j","retries":2}</code> — mức log là chữ, thời gian là ISO 8601, và thông điệp đứng đầu vì đó là thứ người đọc nhìn trước nhất',
            ),
            B(
              '<code>{"level":40,"time":1788986751168,"requestId":"V1StGXR8_Z5j","retries":2,"msg":"fallback used"}</code> — a numeric level, epoch milliseconds, the child binding ahead of the per-call fields, and <code>msg</code> last',
              '<code>{"level":40,"time":1788986751168,"requestId":"V1StGXR8_Z5j","retries":2,"msg":"fallback used"}</code> — mức log dạng SỐ, thời gian là mili giây epoch, phần gắn của logger con đứng trước các trường của lời gọi, và <code>msg</code> đứng cuối',
            ),
            B(
              '<code>{"level":40,"time":1788986751168,"pid":17643,"hostname":"Cuong-Hoang.local","requestId":"V1StGXR8_Z5j","retries":2,"msg":"fallback used"}</code> — pino always stamps the process id and hostname onto every line',
              '<code>{"level":40,"time":1788986751168,"pid":17643,"hostname":"Cuong-Hoang.local","requestId":"V1StGXR8_Z5j","retries":2,"msg":"fallback used"}</code> — pino luôn đóng dấu id tiến trình và tên máy lên mọi dòng',
            ),
            B(
              '<code>{"level":40,"time":1788986751168,"retries":2,"msg":"fallback used"}</code> — a child logger scopes its bindings to calls made through the child factory, so <code>requestId</code> is not attached to an ordinary <code>warn</code>',
              '<code>{"level":40,"time":1788986751168,"retries":2,"msg":"fallback used"}</code> — một logger con giới hạn phần gắn của nó trong các lời gọi qua hàm tạo con, nên <code>requestId</code> không được đính vào một lời gọi <code>warn</code> thường',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Copied verbatim from the run. Four details are load-bearing. <b>The level is a number</b> — 30 info, 40 warn, 50 error, from <code>pino.levels.values</code> — because an integer comparison is what a filter does, and any human-facing word is a rendering job for <code>pino-pretty</code>. <b>The time is epoch milliseconds</b>, not ISO, for the reason lesson 1.4 measured: <code>new Date().toISOString()</code> is the most expensive part of a structured log line, so pino defers formatting to whoever reads it (<code>pino.stdTimeFunctions.isoTime</code> opts back in). <b><code>msg</code> comes last</b>, after every field, because pino serialises the merge object before the message. And <b>child bindings precede per-call fields</b>, which is exactly what makes <code>logger.child({ requestId })</code> the pino-native answer to chapter 3. Option 3 is what you get <em>without</em> <code>base: null</code> — verified in the same run: <code>{"level":30,"time":...,"pid":17643,"hostname":"Cuong-Hoang.local",...}</code>. The <code>debug</code> call prints nothing at all: the default level is <code>info</code>.',
            'Chép nguyên văn từ lượt chạy. Bốn chi tiết chịu lực. <b>Mức log là một con SỐ</b> — 30 info, 40 warn, 50 error, theo <code>pino.levels.values</code> — vì thứ một bộ lọc làm là so sánh số nguyên, còn cái chữ dành cho người đọc là việc hiển thị của <code>pino-pretty</code>. <b>Thời gian là mili giây epoch</b>, không phải ISO, vì đúng lý do bài 1.4 đã đo: <code>new Date().toISOString()</code> là phần đắt nhất của một dòng log có cấu trúc, nên pino hoãn việc định dạng cho bên đọc (<code>pino.stdTimeFunctions.isoTime</code> bật lại được). <b><code>msg</code> đứng CUỐI</b>, sau mọi trường, vì pino tuần tự hoá object gộp trước rồi mới tới thông điệp. Và <b>phần gắn của logger con đứng trước các trường của lời gọi</b>, đó chính là điều làm <code>logger.child({ requestId })</code> thành lời đáp thuần-pino cho chương 3. Phương án 3 là thứ bạn nhận được khi KHÔNG có <code>base: null</code> — đã kiểm trong cùng lượt chạy: <code>{"level":30,"time":...,"pid":17643,"hostname":"Cuong-Hoang.local",...}</code>. Còn lời gọi <code>debug</code> thì không in gì cả: mức mặc định là <code>info</code>.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'A developer writes ' + c("logger.info(`upload failed for ${user.id}`)") + ' instead of ' + c("logger.info('upload failed', { userId: user.id })") + '. What breaks?',
            'Một lập trình viên viết ' + c("logger.info(`upload failed for ${user.id}`)") + ' thay vì ' + c("logger.info('upload failed', { userId: user.id })") + '. Cái gì hỏng?',
          ),
          options: [
            B(
              'Nothing operationally — the information content is identical, and a log store that indexes full text can recover the user id from the sentence whenever it is needed',
              'Chẳng hỏng gì về mặt vận hành — lượng thông tin là như nhau, và một kho log có đánh chỉ mục toàn văn vẫn lấy lại được id người dùng từ câu văn bất cứ khi nào cần',
            ),
            B(
              'Only the cost: interpolation allocates a new string on every call, so the log line is measurably more expensive to build than passing an object that the serialiser walks once',
              'Chỉ tốn kém hơn: phép nội suy cấp phát một chuỗi mới ở mỗi lời gọi, nên dựng dòng log đắt hơn đo được so với việc truyền một object mà bộ tuần tự hoá duyệt qua một lần',
            ),
            B(
              'The line stops being valid JSON, because an interpolated value containing a quote or a newline is written into the message unescaped and corrupts the record for every downstream parser',
              'Dòng log thôi là JSON hợp lệ, vì một giá trị nội suy có chứa dấu ngoặc kép hay ký tự xuống dòng sẽ được ghi vào thông điệp mà không thoát và làm hỏng bản ghi với mọi bộ phân giải phía sau',
            ),
            B(
              '<code>msg</code> becomes a different string for every user, so the field meant to <em>group</em> events instead splits them into thousands of one-off values: you cannot count occurrences of the event type, an alert on "more than 10 upload failures per minute" has nothing to match, and Sentry opens one issue per user',
              '<code>msg</code> thành một chuỗi khác nhau với mỗi người dùng, nên cái trường lẽ ra để GOM NHÓM sự kiện lại đi xé chúng thành hàng nghìn giá trị dùng một lần: bạn không đếm nổi số lần xảy ra của loại sự kiện đó, một cảnh báo "quá 10 lần upload hỏng mỗi phút" chẳng có gì để khớp, và Sentry mở một issue riêng cho mỗi người dùng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The message field is an <em>event name</em>, and an event name has to be stable per call site or it stops naming a class of events. Once <code>msg</code> carries the id, counting is impossible, the alert has no stable string to count, and — chapter 7 — the error tracker&#39;s fingerprint splits one bug into thousands of single-event issues, none of which ever crosses a threshold. The variable part belongs in a field, where it stays searchable without being part of the identity. This is the same discipline that makes metric labels work in chapter 4 and error grouping work in chapter 7: <b>the name says <em>what</em> happened; the fields say <em>which one</em></b>. Option 3 is wrong because pino and this repo&#39;s logger both serialise the message through <code>JSON.stringify</code>, which escapes quotes and newlines correctly — the record stays valid, which is precisely why the damage is silent. Option 2 names a real but trivial cost and misses the operational failure entirely.',
            'Trường thông điệp là một TÊN SỰ KIỆN, mà một tên sự kiện phải ổn định theo từng chỗ gọi, nếu không nó thôi đặt tên cho một LỚP sự kiện. Một khi <code>msg</code> mang cái id, việc đếm là bất khả, cảnh báo chẳng còn chuỗi ổn định nào để đếm, và — chương 7 — vân tay của bộ theo dõi lỗi xé một cái bug thành hàng nghìn issue chỉ có một sự kiện, chẳng cái nào vượt nổi một ngưỡng. Phần biến thiên thuộc về một TRƯỜNG, ở đó nó vẫn tìm được mà không thành một phần của danh tính. Đây vẫn là kỷ luật làm cho nhãn của chỉ số chạy được ở chương 4 và cho việc gom nhóm lỗi chạy được ở chương 7: <b>cái tên nói CHUYỆN GÌ xảy ra; các trường nói CÁI NÀO</b>. Phương án 3 sai vì cả pino lẫn logger của kho này đều tuần tự hoá thông điệp qua <code>JSON.stringify</code>, thứ thoát dấu ngoặc kép và ký tự xuống dòng đúng cách — bản ghi vẫn hợp lệ, và chính vì thế thiệt hại mới lặng lẽ. Phương án 2 nêu một chi phí có thật nhưng vụn vặt, và bỏ sót hoàn toàn cú hỏng về vận hành.',
          ),
        }),

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'Three log calls that all look careful:' +
            code(
              "logger.info('login attempt', { body: req.body });\n" +
              "logger.error('upstream failed', { config: err.config });\n" +
              "logger.debug('user loaded', { user });"),
            'Ba lời gọi log mà cái nào trông cũng cẩn thận:' +
            code(
              "logger.info('login attempt', { body: req.body });\n" +
              "logger.error('upstream failed', { config: err.config });\n" +
              "logger.debug('user loaded', { user });"),
          ),
          options: [
            B(
              'Each spreads an object whose contents the author never enumerated, so they write a password, an <code>Authorization</code> header and every column the ORM knows about a person into a store that is read by more people and kept longer than the system that produced it',
              'Mỗi dòng đều trải một object mà tác giả chưa từng liệt kê nội dung, nên chúng ghi một mật khẩu, một header <code>Authorization</code> và mọi cột mà ORM biết về một con người vào một kho được nhiều người đọc hơn và giữ lâu hơn chính hệ thống sinh ra nó',
            ),
            B(
              'They are acceptable as written, provided the log store is private to the team and its retention is short; the risk only appears when logs are exported to a third-party vendor',
              'Viết vậy là chấp nhận được, miễn là kho log chỉ riêng đội biết và thời gian lưu ngắn; rủi ro chỉ xuất hiện khi log được xuất sang một nhà cung cấp bên thứ ba',
            ),
            B(
              'The only real problem is the third one, because <code>debug</code> is disabled in production while the other two run on every request and therefore dominate the log bill',
              'Vấn đề thật sự duy nhất là dòng thứ ba, vì <code>debug</code> bị tắt trên production còn hai dòng kia chạy ở mọi request nên chiếm phần lớn hoá đơn log',
            ),
            B(
              'The problem is the level, not the content: a login attempt is a security event and belongs at <code>warn</code>, an upstream failure at <code>error</code>, and a loaded user should not be logged at all',
              'Vấn đề nằm ở mức log chứ không ở nội dung: một lượt thử đăng nhập là sự kiện an ninh nên thuộc mức <code>warn</code>, một lỗi phía trên thuộc mức <code>error</code>, còn một người dùng vừa nạp thì không nên log gì cả',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Nobody writes <code>logger.info(&#39;password&#39;, pw)</code>. Leaks come from spreading an object you did not build: a request body carries the password, an Axios error <code>config</code> carries the <code>Authorization</code> header verbatim, and an ORM model carries the email, the phone number and whatever else the table has. The rule that prevents all three is one sentence — <b>list the fields you want; never spread an object you did not build</b>. The reason it is absolute rather than a preference is the security gradient: a log store is read by more people, retained longer, replicated to more places and exported to more vendors than the database it came from, which is why the correct response to "we logged a token by accident" is to <em>rotate the token</em>, not to delete the log line. Option 2 gets the gradient backwards. Option 3 misreads the cost question for a safety one — and in this repo the debug guard runs <em>inside</em> <code>emit()</code>, so the cost of building that context is paid in production anyway.',
            'Chẳng ai viết <code>logger.info(&#39;password&#39;, pw)</code> cả. Rò rỉ đến từ việc TRẢI một object mà bạn không tự dựng: một thân request mang theo mật khẩu, một object <code>config</code> lỗi của Axios mang nguyên văn header <code>Authorization</code>, và một model của ORM mang theo email, số điện thoại và bất cứ thứ gì khác mà cái bảng ấy có. Luật ngăn được cả ba chỉ là một câu — <b>hãy liệt kê những trường bạn muốn; đừng bao giờ trải một object mà bạn không tự tay dựng</b>. Lý do nó là tuyệt đối chứ không phải một sở thích nằm ở độ dốc an toàn: một kho log được nhiều người đọc hơn, giữ lâu hơn, nhân bản ra nhiều nơi hơn và xuất cho nhiều nhà cung cấp hơn cái cơ sở dữ liệu sinh ra nó, và đó là lý do phản ứng đúng với câu "bọn mình lỡ log một cái token" là XOAY token đó, chứ không phải đi xoá dòng log. Phương án 2 hiểu ngược độ dốc ấy. Phương án 3 đọc nhầm một câu hỏi về chi phí thành câu hỏi về an toàn — và trong kho này phép chặn debug chạy BÊN TRONG <code>emit()</code>, nên chi phí dựng ngữ cảnh đó vẫn bị trả trên production.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'A log shipper stalls. Your Node process keeps calling <code>console.log</code>. Measured on 400,000 lines: RSS 43 → 122 MB, <code>process.stdout.writableLength</code> 47,874,720 bytes, <code>writableNeedDrain</code> true, no error thrown and the loop finished normally. <b>Who runs out of memory, and why is this the production case rather than an edge case?</b>',
            'Một trình thu log bị nghẽn. Tiến trình Node của bạn vẫn gọi <code>console.log</code>. Đo trên 400.000 dòng: RSS 43 → 122 MB, <code>process.stdout.writableLength</code> 47.874.720 byte, <code>writableNeedDrain</code> true, không ném lỗi nào và vòng lặp kết thúc bình thường. <b>Ai là người hết bộ nhớ, và vì sao đây là ca PRODUCTION chứ không phải một ca biên?</b>',
          ),
          options: [
            B(
              'The shipper, since it is the process falling behind; your application is only a producer and the kernel pipe buffer absorbs the difference until the reader catches up',
              'Trình thu log, vì nó là tiến trình đang tụt lại; ứng dụng của bạn chỉ là bên sản xuất và bộ đệm pipe của nhân hứng phần chênh lệch cho tới khi bên đọc bắt kịp',
            ),
            B(
              'Neither: once the pipe is full <code>console.log</code> starts blocking, so requests get slower but memory is bounded — which is why a stalled shipper shows up as latency rather than as an out-of-memory kill',
              'Chẳng ai cả: khi pipe đầy thì <code>console.log</code> bắt đầu chặn, nên request chậm đi nhưng bộ nhớ có chặn — và đó là lý do một trình thu log nghẽn hiện ra dưới dạng độ trễ chứ không phải một cú giết vì hết bộ nhớ',
            ),
            B(
              'Your application. Writes to a pipe are asynchronous, so the unwritten text queues in your process heap and counts against your container memory limit, with no error and no blocking; and in a container file descriptor 1 is <em>always</em> a pipe held by the daemon, so there is no configuration that makes this the file case',
              'Chính ứng dụng của bạn. Ghi vào một pipe là bất đồng bộ, nên phần chữ chưa ghi được xếp hàng trong heap của tiến trình bạn và bị tính vào hạn mức bộ nhớ của container, không lỗi và không chặn; và trong một container thì file descriptor 1 LUÔN LUÔN là một pipe do tiến trình nền giữ, nên không có cấu hình nào biến nó thành ca ghi ra file',
            ),
            B(
              'Node itself, in native memory outside the JavaScript heap, which is why <code>heapUsed</code> stays flat while RSS climbs — the fix is to raise <code>--max-old-space-size</code> so V8 has room to absorb the backlog',
              'Chính Node, trong bộ nhớ gốc nằm ngoài heap JavaScript, và đó là lý do <code>heapUsed</code> đứng yên trong khi RSS trèo lên — cách chữa là nâng <code>--max-old-space-size</code> để V8 có chỗ hứng phần tồn đọng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Restate the finding plainly, because it is the whole reason the lesson exists: <b>a slow log shipper is a memory leak in your application</b> — not in the shipper. Node writes synchronously to a file and to a TTY, and <em>asynchronously</em> to a pipe; the 47.8 MB is queued inside <code>process.stdout</code>, held by your heap, counted by the OOM killer. Nothing failed: the loop called <code>console.log</code> 400,000 times and returned, no exception, no warning, and <code>writableNeedDrain === true</code> is Node politely saying "please stop" to an application that has never read that flag. And the pipe row is not an edge case — every containerised process writes into a pipe held open by the Docker daemon, which is normally a fast reader and stops being one the moment the disk under <code>/var/lib/docker</code> fills. Option 4 misdiagnoses the location: the queued chunks are Buffers in <code>external</code>/<code>arrayBuffers</code>, and raising the heap limit only delays the kill while making every major GC walk more.',
            'Hãy phát biểu lại phát hiện này cho thẳng, vì nó là toàn bộ lý do bài học tồn tại: <b>một trình thu log chậm là một chỗ rò rỉ bộ nhớ TRONG ỨNG DỤNG CỦA BẠN</b> — không phải trong trình thu log. Node ghi ĐỒNG BỘ ra file và ra TTY, nhưng ghi BẤT ĐỒNG BỘ vào một pipe; 47,8 MB kia đang xếp hàng bên trong <code>process.stdout</code>, do heap của bạn giữ, và bị bộ giết-vì-hết-bộ-nhớ tính vào. Không gì hỏng cả: vòng lặp gọi <code>console.log</code> 400.000 lần rồi trả về, không ngoại lệ, không cảnh báo, và <code>writableNeedDrain === true</code> là Node lịch sự nói "làm ơn dừng lại" với một ứng dụng chưa từng đọc cái cờ ấy. Và hàng "pipe" không phải ca biên — mọi tiến trình chạy trong container đều ghi vào một pipe do tiến trình nền Docker giữ mở, mà bình thường nó là một bên đọc nhanh và thôi nhanh ngay khi cái đĩa dưới <code>/var/lib/docker</code> đầy. Phương án 4 chẩn sai vị trí: các mẩu đang xếp hàng là Buffer nằm ở <code>external</code>/<code>arrayBuffers</code>, và nâng hạn mức heap chỉ làm chậm cú giết trong khi bắt mỗi lượt major GC phải duyệt nhiều hơn.',
          ),
        }),

        /* ── Chương 2 — đường ống log (4 câu) ────────────────────────────── */

        // q7 · đáp án 1
        mcq({
          prompt: B(
            'Your logger emits a 157-byte JSON line. Docker\'s <code>json-file</code> driver writes 255 bytes for it. <b>Where do the extra 98 bytes come from, and what does that change?</b>',
            'Logger của bạn phát ra một dòng JSON 157 byte. Trình <code>json-file</code> của Docker ghi 255 byte cho nó. <b>98 byte thừa đến từ đâu, và nó thay đổi điều gì?</b>',
          ),
          options: [
            B(
              'From the block alignment of the filesystem, which pads every write to a multiple of the block size; the expansion is therefore an artefact of measurement rather than of storage and disappears once the file is large',
              'Từ việc căn khối của hệ thống file, thứ đệm mọi lượt ghi lên bội số của cỡ khối; nên phần phình ra là sản phẩm của phép đo chứ không phải của việc lưu, và nó biến mất khi file đã lớn',
            ),
            B(
              'Docker wraps your line in a second JSON object — <code>{"log":"…","stream":"stdout","time":"…"}</code> — so every quote in your object becomes <code>\\"</code>, one extra byte each, plus the envelope\'s own fields; the 1.62× factor means every disk estimate made from your own line size is 62% low before anything else happens',
              'Docker bọc dòng của bạn trong một object JSON thứ hai — <code>{"log":"…","stream":"stdout","time":"…"}</code> — nên mỗi dấu ngoặc kép trong object của bạn thành <code>\\"</code>, thừa một byte mỗi cái, cộng với các trường của chính cái phong bì; hệ số 1,62× nghĩa là mọi ước lượng đĩa tính từ cỡ dòng của chính bạn đều thiếu 62% trước khi có bất cứ chuyện gì khác xảy ra',
            ),
            B(
              'From the nanosecond timestamp that containerd stamps onto each chunk, which is 30 characters rather than the 24 of an ISO millisecond timestamp, plus the stream name',
              'Từ dấu thời gian nano giây mà containerd đóng lên mỗi mẩu, dài 30 ký tự thay vì 24 của một dấu thời gian ISO mili giây, cộng với tên luồng',
            ),
            B(
              'From the driver adding the container id and the image name to each record so that <code>docker logs</code> can filter by them without reading the container metadata',
              'Từ việc trình ghi thêm id container và tên ảnh vào mỗi bản ghi để <code>docker logs</code> lọc được theo chúng mà không phải đọc siêu dữ liệu của container',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Your one JSON object becomes a <em>string field</em> inside a different JSON object, so every one of its quotes is escaped — measured at 28 escapes on a realistic eight-field line, one extra byte each — and the envelope contributes <code>stream</code> and a nanosecond <code>time</code> of its own. The result is 1.62×, and the reason it matters is arithmetic you will do wrong otherwise: fifty requests per second with five log lines each is 21.6 million lines a day, which is 3.16 GB by your own measurement and <b>5.13 GB on disk</b> — on a VPS whose disk also holds the Postgres data directory. Option 3 names two real fields but they are a small part of the difference; the escaping is the bulk, because a structured log line is mostly quotes. Option 4 invents fields the driver does not write — the container id is the <em>filename</em>, not a field, which is also why recreating a container starts an empty file and loses the history you were about to read.',
            'Một object JSON của bạn trở thành một TRƯỜNG CHUỖI bên trong một object JSON khác, nên mọi dấu ngoặc kép của nó đều bị thoát — đo được 28 lần thoát trên một dòng tám trường thực tế, mỗi lần thừa một byte — và cái phong bì đóng góp thêm <code>stream</code> cùng một <code>time</code> nano giây của riêng nó. Kết quả là 1,62×, và lý do nó đáng kể là phép tính mà không có nó bạn sẽ làm sai: năm mươi request mỗi giây với năm dòng log mỗi cái là 21,6 triệu dòng mỗi ngày, tức 3,16 GB theo phép đo của chính bạn và <b>5,13 GB trên đĩa</b> — trên một VPS mà cái đĩa ấy còn chứa cả thư mục dữ liệu Postgres. Phương án 3 nêu hai trường có thật nhưng chúng chỉ là phần nhỏ của chênh lệch; phần thoát ký tự mới là phần lớn, vì một dòng log có cấu trúc phần lớn là dấu ngoặc kép. Phương án 4 bịa ra những trường mà trình ghi không hề ghi — id container là TÊN FILE chứ không phải một trường, và đó cũng là lý do dựng lại một container là bắt đầu một file rỗng và mất đúng phần lịch sử bạn sắp đọc.',
          ),
        }),

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'Seven containers, no <code>logging:</code> block anywhere, and a weekly cron that runs <code>truncate -s 0</code> on any container log over 200 MB. <b>What is the strongest objection?</b>',
            'Bảy container, không có khối <code>logging:</code> nào ở đâu cả, và một cron hằng tuần chạy <code>truncate -s 0</code> lên bất kỳ log container nào vượt 200 MB. <b>Phản đối mạnh nhất là gì?</b>',
          ),
          options: [
            B(
              'It should use <code>rm</code> rather than <code>truncate</code>, which frees the blocks immediately instead of leaving a sparse file that <code>du</code> still counts against the filesystem',
              'Nó nên dùng <code>rm</code> thay vì <code>truncate</code>, thứ giải phóng các khối ngay lập tức thay vì để lại một file thưa mà <code>du</code> vẫn tính vào hệ thống file',
            ),
            B(
              'Nothing serious: truncation is the standard way to bound Docker logs because it keeps the daemon\'s open descriptor valid, a weekly cadence matches how fast a service of this size actually writes, and a 200 MB threshold is deliberately conservative for a VPS with this much free space',
              'Chẳng có gì nghiêm trọng: cắt cụt là cách chuẩn để chặn log của Docker vì nó giữ cho descriptor đang mở của tiến trình nền còn hiệu lực, nhịp hằng tuần khớp với tốc độ ghi thật của một dịch vụ cỡ này, và ngưỡng 200 MB là cố ý dè dặt với một VPS còn chừng ấy chỗ trống',
            ),
            B(
              'The threshold is too low — at 200 MB the job fires far more often than the disk pressure warrants, and each firing destroys history that would otherwise still be inside the <code>docker logs</code> window, so the cheapest correct fix is to raise it to 1 GB and leave the cadence alone',
              'Ngưỡng quá thấp — ở mức 200 MB thì cái job nổ thường xuyên hơn nhiều so với mức áp lực đĩa đáng có, và mỗi lượt nổ huỷ đi phần lịch sử lẽ ra vẫn còn nằm trong cửa sổ của <code>docker logs</code>, nên cách chữa đúng và rẻ nhất là nâng nó lên 1 GB và giữ nguyên nhịp chạy',
            ),
            B(
              'Three things at once: a weekly job cannot catch a disk that fills in a day, the 200 MB threshold is <em>per container</em> so seven of them reserve 1.4 GB before it acts at all, and <code>truncate</code> destroys the whole history — including the log that would explain why it grew. <code>max-size</code> plus <code>max-file</code> is a continuous hard ceiling enforced at write time and it keeps the last N files',
              'Ba thứ cùng lúc: một job hằng tuần không bắt kịp một cái đĩa đầy trong một ngày, ngưỡng 200 MB là THEO TỪNG CONTAINER nên bảy cái giữ trước 1,4 GB rồi nó mới động đậy, và <code>truncate</code> huỷ trọn phần lịch sử — kể cả cái log lẽ ra giải thích được vì sao nó phình. <code>max-size</code> cộng <code>max-file</code> là một cái TRẦN CỨNG liên tục do tiến trình nền áp lúc ghi, và nó giữ lại N file gần nhất',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The job is not wrong — it has kept the disk alive — it is the wrong <em>shape</em> of fix, in three independent ways. Timing: cron is weekly and at 5.13 GB/day the disk is gone by Tuesday. Arithmetic: the threshold is per container, so seven containers can each sit at 199 MB and the job does nothing on a disk where 1.4 GB is a large fraction of what is free. And evidence: the log that grew to 200 MB is the log most likely to explain why, and truncation keeps nothing. Rotation is not a cleanup job at all — it is a ceiling the daemon enforces at write time, so the disk cost of logging becomes a number you <em>choose</em> rather than one you discover. Option 1 is actively dangerous and inverts the real hazard: <code>rm</code> on a file the daemon still holds open leaves the inode allocated, so <code>df</code> shows the disk full while <code>du</code> shows the file gone — the single most confusing state to debug under pressure. <code>truncate -s 0</code> is correct precisely because it keeps the descriptor valid.',
            'Cái job không sai — nó đã giữ cho đĩa sống — nó chỉ SAI HÌNH DẠNG, theo ba cách độc lập nhau. Về thời điểm: cron chạy hằng tuần, mà ở mức 5,13 GB/ngày thì đĩa đã hết từ thứ Ba. Về số học: ngưỡng tính theo từng container, nên bảy container có thể mỗi cái nằm ở 199 MB và cái job chẳng làm gì, trên một cái đĩa mà 1,4 GB là một phần lớn chỗ trống. Và về bằng chứng: cái log phình lên 200 MB chính là cái log dễ giải thích được vì sao nhất, mà cắt cụt thì chẳng giữ lại gì. Xoay vòng hoàn toàn không phải một job dọn dẹp — nó là một cái TRẦN mà tiến trình nền áp ngay lúc ghi, nên chi phí đĩa của việc log thành một con số bạn CHỌN chứ không phải một con số bạn phát hiện ra. Phương án 1 thì nguy hiểm thật sự và lộn ngược mối nguy: <code>rm</code> lên một file mà tiến trình nền vẫn đang giữ mở sẽ để inode còn được cấp phát, nên <code>df</code> báo đĩa đầy trong khi <code>du</code> báo file đã mất — đúng cái trạng thái khó gỡ nhất khi đang chịu áp lực. <code>truncate -s 0</code> đúng chính vì nó giữ cho descriptor còn hiệu lực.',
          ),
        }),

        // q9 · đáp án 0
        mcq({
          prompt: B(
            'A Promtail pipeline ends with a <code>labels:</code> stage promoting both <code>level</code> and <code>msg</code>. <code>src/</code> emits 325 distinct <code>msg</code> values across 28 container-and-level streams. <b>What does promoting <code>msg</code> cost, and where should it go instead?</b>',
            'Một đường ống Promtail kết thúc bằng một bước <code>labels:</code> đẩy cả <code>level</code> lẫn <code>msg</code> lên thành nhãn. <code>src/</code> phát ra 325 giá trị <code>msg</code> khác nhau trên 28 luồng container-và-mức. <b>Việc đẩy <code>msg</code> lên tốn cái gì, và đáng lẽ nó nên nằm ở đâu?</b>',
          ),
          options: [
            B(
              '28 streams become 9,100 — a 325× increase that lands within 10% of the default active-stream limit before a single new log statement is written; <code>msg</code> and <code>route</code> belong in the line and are extracted at query time with ' + c('| json | route="/api/v1/notes"') + ', which is slower per query but free at ingest and has no ceiling',
              '28 luồng thành 9.100 — tăng 325 lần và rơi vào trong khoảng 10% của hạn mức luồng hoạt động mặc định trước khi có thêm một câu lệnh log mới nào; <code>msg</code> và <code>route</code> thuộc về NỘI DUNG DÒNG và được bóc ra lúc truy vấn bằng ' + c('| json | route="/api/v1/notes"') + ', chậm hơn mỗi lượt truy vấn nhưng miễn phí lúc nạp vào và không có trần',
            ),
            B(
              'Nothing measurable. Loki indexes labels cheaply by design, which is the entire point of its architecture, so adding a label is a query-speed improvement paid for with a negligible amount of index space',
              'Chẳng tốn gì đo được. Loki vốn được thiết kế để đánh chỉ mục nhãn một cách rẻ, đó là toàn bộ điểm mấu chốt của kiến trúc nó, nên thêm một nhãn là một cải thiện tốc độ truy vấn đổi lấy một lượng chỗ chỉ mục không đáng kể',
            ),
            B(
              'Only query latency: each label value has to be resolved before the line filter runs, so a query that selects across many values of <code>msg</code> spends longer in planning, while storage and the active-stream limit are unaffected',
              'Chỉ tốn độ trễ truy vấn: mỗi giá trị nhãn phải được phân giải trước khi bộ lọc dòng chạy, nên một truy vấn chọn trên nhiều giá trị <code>msg</code> tốn thêm thời gian ở khâu lập kế hoạch, còn dung lượng lưu và hạn mức luồng hoạt động thì không bị ảnh hưởng',
            ),
            B(
              'It duplicates each log line once per label value, so a line whose <code>msg</code> matches several catalog entries is stored several times and the ingest volume rises proportionally to the number of promoted labels',
              'Nó nhân đôi mỗi dòng log một lần cho mỗi giá trị nhãn, nên một dòng có <code>msg</code> khớp nhiều mục trong danh mục sẽ bị lưu nhiều lần và khối lượng nạp vào tăng tỉ lệ với số nhãn được đẩy lên',
            ),
          ],
          explanation: EX(
            'Loki does not index your log text; it indexes <em>labels</em>, and a stream is one exact combination of label values. So a label multiplies rather than adds, exactly as a Prometheus label does in chapter 4 — and the multiplier here is the number of distinct messages your codebase can emit, which grows every time somebody writes a new <code>logger.info</code>. Promote <code>route</code> as well and the 945 route declarations take it past eight million. The right home for a high-cardinality field is <em>inside the line</em>, extracted while scanning: a query pays for it once, at query time, over data the labels have already narrowed down. The rule for a good label is that you can <b>write down every value it will ever take</b> — container, level, env, job, usually fewer than twenty. Two things worth noting about this configuration in particular: the documented catalog lists 124 event names while <code>src/</code> emits 325, so the documentation had already drifted; and a label you add today applies only from today, because labels are attached at ingest and changing the config does not relabel stored chunks.' +
            '<p><em>Note: this question is reasoned from the Grafana documentation and from the counts the course measured on this repository. No Loki instance was stood up to verify it.</em></p>',
            'Loki không đánh chỉ mục phần chữ trong log của bạn; nó đánh chỉ mục các NHÃN, và một luồng là một tổ hợp chính xác các giá trị nhãn. Nên một cái nhãn NHÂN vào chứ không cộng vào, đúng y như một nhãn Prometheus ở chương 4 — và cái số nhân ở đây là số thông điệp khác nhau mà kho mã của bạn phát ra được, thứ lớn lên mỗi lần có người viết thêm một <code>logger.info</code>. Đẩy luôn <code>route</code> lên nữa thì 945 khai báo route đưa nó vượt tám triệu. Chỗ đúng cho một trường có lực lượng lớn là NẰM TRONG DÒNG, được bóc ra trong lúc quét: một truy vấn trả giá cho nó một lần, lúc truy vấn, trên phần dữ liệu mà các nhãn đã thu hẹp lại rồi. Luật cho một cái nhãn tốt là bạn <b>viết ra được mọi giá trị mà nó sẽ từng nhận</b> — container, level, env, job, thường dưới hai mươi. Hai điều đáng để ý riêng ở cấu hình này: cái danh mục được ghi lại liệt kê 124 tên sự kiện trong khi <code>src/</code> phát ra 325, tức tài liệu đã trôi dạt từ trước; và một cái nhãn bạn thêm hôm nay chỉ có hiệu lực TỪ HÔM NAY, vì nhãn được đính lúc nạp vào và đổi cấu hình không dán lại nhãn cho các mẩu đã lưu.' +
            '<p><em>Lưu ý: câu này suy luận theo tài liệu Grafana và theo các con số mà giáo trình đã đếm trên chính kho này. KHÔNG dựng Loki để kiểm chứng.</em></p>',
          ),
          correct: 0,
        }),

        // q10 · đáp án 2
        mcq({
          prompt: B(
            'Two ways to get logs off the VPS: <b>A</b> — a shipper tails the <code>json-file</code> on disk; <b>B</b> — an HTTP transport inside your logger POSTs them to the store. <b>Why is A the right default?</b>',
            'Hai cách đưa log ra khỏi VPS: <b>A</b> — một trình thu log đọc đuôi file <code>json-file</code> trên đĩa; <b>B</b> — một transport HTTP bên trong logger của bạn POST chúng lên kho. <b>Vì sao A là mặc định đúng?</b>',
          ),
          options: [
            B(
              'Because tailing is faster: reading a file sequentially adds less latency between the line being written and the line being searchable than an HTTP round trip does',
              'Vì đọc đuôi file nhanh hơn: đọc một file tuần tự thêm ít độ trễ giữa lúc dòng được ghi và lúc dòng tìm được hơn là một lượt đi-về HTTP',
            ),
            B(
              'Because an in-app HTTP transport cannot batch or retry, so any network hiccup loses the lines outright, whereas a file-tailing shipper always delivers exactly once',
              'Vì một transport HTTP trong ứng dụng không gom lô hay thử lại được, nên bất kỳ trục trặc mạng nào cũng làm mất luôn các dòng, trong khi một trình thu log đọc đuôi file thì luôn giao đúng một lần',
            ),
            B(
              'Because it decides <em>where the buffer lives</em>. Tailing puts backpressure on the disk, which the operating system manages with tens of gigabytes of room; an in-app transport puts the queue in your heap — the exact failure measured in chapter 1, now with a network at the far end — so an outage of the log store becomes an outage of the application',
              'Vì nó quyết định <em>cái đệm nằm ở đâu</em>. Đọc đuôi file đặt phần nghẽn ngược lên ĐĨA, thứ mà hệ điều hành quản lý với hàng chục gigabyte chỗ trống; một transport trong ứng dụng đặt hàng đợi vào HEAP của bạn — đúng cú hỏng đã đo ở chương 1, giờ có thêm một cái mạng ở đầu kia — nên một cú chết của kho log thành một cú chết của ứng dụng',
            ),
            B(
              'Because Docker containers cannot make outbound HTTP connections without an explicit network configuration, so option B requires infrastructure changes that option A avoids entirely',
              'Vì container Docker không mở được kết nối HTTP ra ngoài nếu không cấu hình mạng tường minh, nên phương án B đòi thay đổi hạ tầng mà phương án A tránh được hoàn toàn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Chapter 1 measured what happens when a queue lives in your heap and the reader stalls: 47.8 MB buffered, RSS 43 → 122 MB, and no ceiling. Architecture B reproduces that failure with a network on the far end instead of a pipe, which makes it strictly more likely — networks are slower and fail more often than local readers. Architecture A moves the buffer to the disk, where the operating system manages tens of gigabytes and where a shipper crash simply means the lines wait. It also has two properties worth naming: the application needs no code change and no new dependency at all, and <code>docker logs</code> stays available as a fallback for when the shipper itself is the thing that broke. The cost is one extra hop of latency, measured in seconds, which for logs is irrelevant. Option 2 is wrong in both halves: real HTTP transports do batch and retry, and no shipper delivers exactly once — <b>at-least-once is what every real shipper offers</b>, which is why a count of log lines is an estimate and an exact count belongs in a metric.',
            'Chương 1 đã đo chuyện gì xảy ra khi một hàng đợi nằm trong heap của bạn và bên đọc bị nghẽn: 47,8 MB tồn trong đệm, RSS 43 → 122 MB, và không có trần. Kiến trúc B tái hiện đúng cú hỏng đó với một cái mạng ở đầu kia thay vì một cái pipe, tức là còn dễ xảy ra hơn — mạng chậm hơn và hỏng thường xuyên hơn một bên đọc cục bộ. Kiến trúc A dời cái đệm sang ĐĨA, nơi hệ điều hành quản lý hàng chục gigabyte và nơi trình thu log chết thì các dòng chỉ đơn giản là NẰM CHỜ. Nó còn có hai tính chất đáng nêu tên: ứng dụng không cần đổi một dòng mã nào và không thêm phụ thuộc nào, và <code>docker logs</code> vẫn còn đó làm đường lùi cho lúc chính trình thu log là thứ bị hỏng. Cái giá là thêm một chặng độ trễ, tính bằng giây, thứ với log thì chẳng quan trọng. Phương án 2 sai ở cả hai nửa: các transport HTTP thật đều có gom lô và thử lại, còn không trình thu log nào giao ĐÚNG MỘT LẦN — <b>giao-ít-nhất-một-lần mới là thứ mọi trình thu log thật cung cấp</b>, và đó là lý do một phép đếm số dòng log là một ƯỚC LƯỢNG, còn một phép đếm chính xác thì thuộc về một chỉ số.',
          ),
        }),

        /* ── Chương 3 — correlation (4 câu) ──────────────────────────────── */

        // q11 · đáp án 1
        mcq({
          prompt: B(
            'To attach a request id to every log line without threading <code>req</code> through 101 service files, someone adds ' + c('let currentId = null') + ' at module scope and sets it in middleware. <b>Why is this worse than having no correlation at all?</b>',
            'Để gắn một request id vào mọi dòng log mà không phải luồn <code>req</code> qua 101 file service, có người thêm ' + c('let currentId = null') + ' ở phạm vi module rồi gán nó trong middleware. <b>Vì sao cách này TỆ HƠN cả việc không có correlation nào?</b>',
          ),
          options: [
            B(
              'Because a module-level variable is slower than <code>AsyncLocalStorage</code>: every read crosses a module boundary that V8 cannot inline, which is measurable once you are logging several lines per request',
              'Vì một biến ở phạm vi module chậm hơn <code>AsyncLocalStorage</code>: mỗi lượt đọc phải vượt một ranh giới module mà V8 không nội tuyến được, và điều đó đo được khi bạn log vài dòng mỗi request',
            ),
            B(
              'Because Node serves requests concurrently: request B overwrites the variable while A is awaiting the database, so A\'s next log line carries B\'s id. It appears to work in development, where requests never overlap, and in production it produces lines that look perfectly normal and point at the wrong request — confidently wrong evidence is worse than none',
              'Vì Node phục vụ các request ĐỒNG THỜI: request B ghi đè lên cái biến trong lúc A đang chờ cơ sở dữ liệu, nên dòng log kế tiếp của A mang id của B. Nó có vẻ chạy được ở môi trường phát triển, nơi các request chẳng bao giờ chồng nhau, còn trên production nó sinh ra những dòng trông hoàn toàn bình thường mà chỉ vào SAI request — một bằng chứng sai một cách tự tin thì tệ hơn là không có bằng chứng',
            ),
            B(
              'Because TypeScript cannot express the type of a mutable module-level variable that is sometimes null, so every read site needs a non-null assertion and one of them will eventually be wrong',
              'Vì TypeScript không diễn đạt được kiểu của một biến module thay đổi được mà đôi khi là null, nên mọi chỗ đọc đều cần một khẳng định không-null và rốt cuộc sẽ có một chỗ sai',
            ),
            B(
              'It is not worse — for a single-process application with one event loop this is the standard pattern, and it is what <code>AsyncLocalStorage</code> compiles down to internally anyway',
              'Nó không tệ hơn — với một ứng dụng một tiến trình có một vòng lặp sự kiện thì đây là khuôn mẫu chuẩn, và dù sao thì <code>AsyncLocalStorage</code> cũng biên dịch xuống thành đúng thứ đó ở bên trong',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the option people actually ship, because it passes every test they run. In development you are the only user, requests never interleave, and the ids are correct. In production they always interleave — that is what an event loop is for — and the corruption is invisible: the line has an id, the id has the right shape, and it belongs to somebody else&#39;s request. Every downstream query then joins the wrong lines together, and you cannot tell, because there is no signal that distinguishes a borrowed id from a correct one. That is why "worse than none": a missing id makes you fall back to timestamps and you know you are guessing, whereas a wrong id makes you confident. The primitive that actually satisfies the three requirements — ambient, per-request, applied by the logger — is <code>AsyncLocalStorage</code>, which attaches the store to the <em>async chain</em> rather than to a variable, so two concurrent requests each see their own and neither can reach the other&#39;s.',
            'Đây là phương án người ta THẬT SỰ ĐEM SHIP, vì nó qua mọi phép thử họ chạy. Ở môi trường phát triển bạn là người dùng duy nhất, các request chẳng bao giờ đan xen, và các id đều đúng. Trên production chúng LUÔN đan xen — đó chính là công dụng của một vòng lặp sự kiện — và sự hỏng hóc thì vô hình: dòng log CÓ id, id ĐÚNG hình dạng, và nó thuộc về request của người khác. Mọi truy vấn phía sau khi đó ghép nhầm các dòng lại với nhau, mà bạn không nhận ra được, vì chẳng có tín hiệu nào phân biệt một id đi mượn với một id đúng. Đó là lý do "tệ hơn là không có": một id THIẾU buộc bạn lùi về dấu thời gian và bạn BIẾT là mình đang đoán, còn một id SAI làm bạn tự tin. Thứ nguyên thuỷ thật sự thoả cả ba yêu cầu — bao quanh, theo từng request, do chính logger đính vào — là <code>AsyncLocalStorage</code>, thứ gắn kho ngữ cảnh vào CHUỖI BẤT ĐỒNG BỘ chứ không vào một biến, nên hai request đồng thời mỗi cái thấy kho của riêng nó và không cái nào với tới cái kia được.',
          ),
        }),

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'Measured on Node 22: <code>AsyncLocalStorage</code> adds <b>677 ns per request</b> for one <code>run()</code>, and ten <code>getStore()</code> calls measured 2 ns <em>faster</em> than one (i.e. unmeasurable). <b>What does that imply for the design?</b>',
            'Đo trên Node 22: <code>AsyncLocalStorage</code> thêm <b>677 ns mỗi request</b> cho một lần <code>run()</code>, và mười lời gọi <code>getStore()</code> đo được NHANH HƠN một lời gọi 2 ns (tức là không đo nổi). <b>Điều đó hàm ý gì cho thiết kế?</b>',
          ),
          options: [
            B(
              'That <code>getStore()</code> should be called once at the top of each request and the value passed down as a parameter, so the store is read while it is still warm in cache rather than repeatedly off the async resource',
              'Rằng <code>getStore()</code> nên được gọi một lần ở đầu mỗi request rồi truyền giá trị xuống dưới dạng tham số, để kho ngữ cảnh được đọc lúc còn nóng trong cache thay vì đọc lặp lại từ tài nguyên bất đồng bộ',
            ),
            B(
              'That it is too expensive for a request path and belongs only in background jobs, where 677 ns per job is negligible against the work the job is doing anyway',
              'Rằng nó quá đắt cho đường đi của request và chỉ thuộc về các việc chạy nền, nơi 677 ns mỗi việc là không đáng kể so với công việc mà nó vốn đang làm',
            ),
            B(
              'That <code>run()</code> should be called inside each service, so the context is re-established close to where it is read and cannot be lost by an intervening library',
              'Rằng <code>run()</code> nên được gọi bên trong mỗi service, để ngữ cảnh được tái lập gần chỗ nó được đọc và không bị một thư viện xen giữa làm mất',
            ),
            B(
              'That the whole cost is in <code>run()</code>, so call it <b>once per request in middleware</b> and call <code>getStore()</code> freely wherever the id is needed — including inside <code>emit()</code>, so all 370 existing <code>logger.*</code> calls gain a <code>requestId</code> without being touched. At 500 rps the total is 0.034% of one core',
              'Rằng toàn bộ chi phí nằm ở <code>run()</code>, nên hãy gọi nó <b>một lần mỗi request trong middleware</b> và gọi <code>getStore()</code> thoải mái ở bất cứ đâu cần cái id — kể cả bên trong <code>emit()</code>, để cả 370 lời gọi <code>logger.*</code> đang có đều được thêm <code>requestId</code> mà không phải đụng vào cái nào. Ở 500 rps thì tổng cộng là 0,034% của một nhân',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The measurement has a shape, and the shape is the actionable part: the cost is entering the scope, not reading from it. So one <code>als.run(store, next)</code> in middleware costs 677 ns for the whole request, while nesting a <code>run()</code> per service call would cost 677 ns each — the design that reads better is also the fast one. And because <code>getStore()</code> is free, the right place to read it is <em>inside the logger</em>, once, in <code>emit()</code>: every call site in the codebase gains the field without a single edit, including services that know nothing about HTTP. Option 1 is the instinct this measurement exists to kill — passing the value down as a parameter is exactly the signature-threading the primitive was adopted to avoid, and it buys nothing because the read was already free. The reputation for slowness in option 2 is real history from before Node 16, repeated ever since; on Node 22, in the shape you would actually use, it costs about half of the single log line it exists to improve.',
            'Phép đo có một HÌNH DẠNG, và hình dạng ấy mới là phần hành động được: chi phí nằm ở việc VÀO phạm vi, không nằm ở việc đọc từ nó. Nên một lời gọi <code>als.run(store, next)</code> trong middleware tốn 677 ns cho cả request, còn lồng một <code>run()</code> cho mỗi lời gọi service thì tốn 677 ns MỖI CÁI — thiết kế đọc dễ hơn cũng chính là thiết kế nhanh hơn. Và vì <code>getStore()</code> miễn phí, chỗ đúng để đọc nó là BÊN TRONG LOGGER, đúng một lần, trong <code>emit()</code>: mọi chỗ gọi trong kho mã đều được thêm cái trường ấy mà không phải sửa một dòng nào, kể cả các service chẳng biết gì về HTTP. Phương án 1 chính là cái phản xạ mà phép đo này sinh ra để dập tắt — truyền giá trị xuống dưới dạng tham số đúng là kiểu luồn-chữ-ký mà người ta chọn dùng thứ nguyên thuỷ này để TRÁNH, và nó chẳng mua được gì vì phép đọc vốn đã miễn phí. Cái tiếng chậm chạp ở phương án 2 là lịch sử có thật từ trước Node 16, được lặp lại mãi từ đó; trên Node 22, ở đúng hình dạng bạn sẽ dùng, nó tốn khoảng một nửa cái dòng log mà nó sinh ra để cải thiện.',
          ),
        }),

        // q13 · đáp án 0
        mcq({
          prompt: B(
            'Inside a request handler you register ' + c("emitter.on('done', () => logger.info('finished'))") + '. Later firings come from other requests entirely. <b>What ends up in the logs?</b>',
            'Bên trong một handler request bạn đăng ký ' + c("emitter.on('done', () => logger.info('finished'))") + '. Những lần nổ về sau đến từ những request hoàn toàn khác. <b>Cái gì rơi vào log?</b>',
          ),
          options: [
            B(
              'The listener captured request A\'s context at <em>registration</em> time and keeps it for as long as it is registered, so every later firing logs A\'s id regardless of which request actually triggered it. Missing context is visible in your logs; <b>borrowed context is not</b> — the line looks perfectly normal and points at the wrong request',
              'Listener đã chộp ngữ cảnh của request A vào lúc ĐĂNG KÝ và giữ nó suốt thời gian nó còn được đăng ký, nên mọi lần nổ về sau đều log id của A bất kể request nào thật sự kích hoạt. Ngữ cảnh THIẾU thì nhìn thấy được trong log; <b>ngữ cảnh ĐI MƯỢN thì không</b> — dòng log trông hoàn toàn bình thường và chỉ vào sai request',
            ),
            B(
              'The listener loses the context entirely and logs with no <code>requestId</code>, because the store is torn down when the request that created it completes and the callback then reads an empty scope',
              'Listener mất hẳn ngữ cảnh và log ra không có <code>requestId</code>, vì kho ngữ cảnh bị dỡ xuống khi request tạo ra nó kết thúc và callback lúc ấy đọc vào một phạm vi rỗng',
            ),
            B(
              'Node throws at registration time, because <code>AsyncLocalStorage</code> refuses to let a store escape into a callback whose lifetime it cannot bound — this is the guard that makes the primitive safe by construction',
              'Node ném lỗi ngay lúc đăng ký, vì <code>AsyncLocalStorage</code> từ chối để một kho ngữ cảnh thoát vào một callback mà nó không chặn được vòng đời — đây là chốt an toàn làm cho thứ nguyên thuỷ này an toàn theo cấu trúc',
            ),
            B(
              'Nothing goes wrong: event listeners are invoked from the emitter\'s own async resource, so <code>getStore()</code> resolves to whichever request is currently on the stack when the event fires',
              'Chẳng có gì hỏng: các listener sự kiện được gọi từ chính tài nguyên bất đồng bộ của emitter, nên <code>getStore()</code> phân giải ra đúng request nào đang nằm trên stack lúc sự kiện nổ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The context follows the async chain, and a callback joins that chain <em>where it was created</em>, not where it runs. So a listener registered inside request A is permanently a descendant of A. The same applies to a callback pushed into a module-level array, a debounce timer stored outside the request, and a promise you cache and reuse — that last one is the rare and genuinely confusing case, where a second request awaits a cached promise and logs the first request&#39;s id. What makes this failure mode much worse than the others in this chapter is the direction of the error: everywhere else the context is <em>missing</em>, which shows up as a line with no id and prompts you to go fix it. Here the line has an id, the id is well-formed, and it is somebody else&#39;s. The rule is short: <b>anything whose lifetime outlives the request must not close over the context</b> — read the id out into a plain string at registration time if you will need it later.',
            'Ngữ cảnh đi theo chuỗi bất đồng bộ, và một callback nhập vào chuỗi ấy Ở CHỖ NÓ ĐƯỢC TẠO RA, không phải ở chỗ nó chạy. Nên một listener đăng ký bên trong request A vĩnh viễn là con cháu của A. Điều tương tự áp cho một callback được đẩy vào một mảng ở phạm vi module, một bộ đếm giờ khử dội lưu ngoài request, và một promise bạn đệm lại rồi dùng lại — cái cuối là ca hiếm và thật sự khó hiểu, khi một request thứ hai chờ một promise đã đệm rồi log ra id của request thứ nhất. Thứ làm kiểu hỏng này tệ hơn hẳn những cái khác trong chương chính là CHIỀU của sai sót: ở mọi chỗ khác ngữ cảnh bị THIẾU, và nó hiện ra thành một dòng không có id rồi thúc bạn đi sửa. Ở đây dòng log CÓ id, id ĐÚNG khuôn, và nó là của người khác. Luật thì ngắn: <b>bất cứ thứ gì có vòng đời dài hơn request thì không được bao lấy ngữ cảnh</b> — hãy đọc cái id ra thành một chuỗi thường ngay lúc đăng ký nếu về sau bạn cần tới nó.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'Measured with the OpenTelemetry Node SDK 0.222.0: a manual span <code>embed.generate</code> (id <code>f8cf4f879c94d21d</code>) makes an outbound HTTP call, which the auto-instrumentation wraps in a CLIENT span (id <code>376983db05a70e95</code>). The receiving service printed the header it got:' +
            code('traceparent: 00-034c32ce73a6b5d8a2a331a47870eb52-376983db05a70e95-01') +
            '<b>Which value sits in the <em>parent-id</em> position, and what do the four fields mean?</b>',
            'Đo bằng OpenTelemetry Node SDK 0.222.0: một span viết tay <code>embed.generate</code> (id <code>f8cf4f879c94d21d</code>) gọi ra ngoài bằng HTTP, và bộ tự-đo-đạc bọc lời gọi ấy trong một span CLIENT (id <code>376983db05a70e95</code>). Dịch vụ nhận in ra header nó nhận được:' +
            code('traceparent: 00-034c32ce73a6b5d8a2a331a47870eb52-376983db05a70e95-01') +
            '<b>Giá trị nào nằm ở vị trí <em>parent-id</em>, và bốn trường ấy nghĩa là gì?</b>',
          ),
          options: [
            B(
              'The id of the <em>root</em> span of the trace, so that the receiver can attach directly to the top of the tree; the four fields are version, trace-id, root-id and a reserved byte that is always <code>01</code>',
              'Id của span GỐC của trace, để bên nhận gắn thẳng vào đỉnh cây; bốn trường là phiên bản, trace-id, id-gốc và một byte dự trữ luôn bằng <code>01</code>',
            ),
            B(
              'The id the <em>receiver</em> should use for its own server span, assigned by the caller so that both sides agree on it without a round trip; the last byte is the number of hops so far, here the first',
              'Id mà BÊN NHẬN nên dùng cho span máy chủ của chính nó, do bên gọi cấp phát để hai phía thống nhất mà không cần một lượt đi-về; byte cuối là số chặng đã đi qua, ở đây là chặng đầu tiên',
            ),
            B(
              'The id of the <b>CLIENT span that made the call</b> — <code>376983db05a70e95</code>, not the manual span above it — so the receiver\'s SERVER span becomes its child. The fields are version <code>00</code>, a 32-hex trace-id that never changes across the whole operation, a 16-hex parent-id that changes at every hop, and a flags byte whose lowest bit carries the sampling decision made at the edge',
              'Id của <b>span CLIENT đã thực hiện lời gọi</b> — <code>376983db05a70e95</code>, không phải cái span viết tay nằm trên nó — nên span SERVER của bên nhận trở thành CON của nó. Bốn trường là phiên bản <code>00</code>, một trace-id 32 ký tự hex không bao giờ đổi suốt cả thao tác, một parent-id 16 ký tự hex đổi ở MỖI chặng, và một byte cờ mà bit thấp nhất mang quyết định lấy mẫu đã ra ở biên',
            ),
            B(
              'The id of the manual <code>embed.generate</code> span — <code>f8cf4f879c94d21d</code> — because the propagator injects the innermost span that your own code created, so that vendor spans do not appear in the caller\'s tree',
              'Id của span viết tay <code>embed.generate</code> — <code>f8cf4f879c94d21d</code> — vì bộ truyền ngữ cảnh chèn vào span trong cùng mà chính mã của bạn tạo ra, để các span của nhà cung cấp không hiện lên trong cây của bên gọi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the measurement rather than the intuition: the header carries <code>376983db05a70e95</code>, and the console exporter shows that is the CLIENT span (<code>kind: 2</code>), whose own parent is <code>f8cf4f879c94d21d</code>, the manual span. The propagator always injects <em>the currently active span at the moment of injection</em>, and at that moment the active span is the one the HTTP instrumentation just created for this call — which is what makes the tree correct: <code>embed.generate</code> → CLIENT → (over the wire) → the receiver&#39;s SERVER span. Three further facts came out of the same run and are worth carrying. The receiver&#39;s SERVER span records <code>parentSpanContext.isRemote: true</code>, which is how a tool knows the parent arrived over the network. With <code>AlwaysOffSampler</code> the header is <em>still sent</em>, with a valid trace-id and a flags byte of <code>00</code> — propagation and sampling are separate decisions. And a call made with <b>no active span at all</b> still gets a <code>traceparent</code>, because the instrumentation creates a context for it regardless.',
            'Hãy đọc phép đo thay vì đoán theo cảm tính: header mang <code>376983db05a70e95</code>, và trình xuất console cho thấy đó là span CLIENT (<code>kind: 2</code>), mà cha của chính nó lại là <code>f8cf4f879c94d21d</code>, cái span viết tay. Bộ truyền ngữ cảnh LUÔN chèn vào SPAN ĐANG HOẠT ĐỘNG TẠI THỜI ĐIỂM CHÈN, và tại thời điểm ấy span đang hoạt động là cái mà bộ đo đạc HTTP vừa tạo ra cho chính lời gọi này — và đó chính là điều làm cái cây đúng: <code>embed.generate</code> → CLIENT → (qua dây) → span SERVER của bên nhận. Ba dữ kiện nữa cũng ra từ cùng lượt chạy và đáng mang theo. Span SERVER của bên nhận ghi <code>parentSpanContext.isRemote: true</code>, đó là cách một công cụ biết được cha của nó đến qua mạng. Với <code>AlwaysOffSampler</code> thì header VẪN ĐƯỢC GỬI, với một trace-id hợp lệ và byte cờ bằng <code>00</code> — truyền ngữ cảnh và lấy mẫu là hai quyết định riêng. Và một lời gọi thực hiện khi KHÔNG CÓ SPAN NÀO đang hoạt động vẫn nhận được một <code>traceparent</code>, vì bộ đo đạc dựng một ngữ cảnh cho nó bất kể thế nào.',
          ),
        }),

        /* ── Chương 4 — chỉ số: đếm cái mà log không đếm nổi (6 câu) ─────── */

        // q15 · đáp án 1
        mcq({
          prompt: B(
            'A developer tracks logged-in users with ' + c('activeUsers.inc()') + ' on login and ' + c('activeUsers.dec()') + ' on logout, and declares <code>activeUsers</code> as a <b>Counter</b>. What happens on the request-rate graph?',
            'Một lập trình viên theo dõi số người đang đăng nhập bằng ' + c('activeUsers.inc()') + ' lúc đăng nhập và ' + c('activeUsers.dec()') + ' lúc đăng xuất, rồi khai <code>activeUsers</code> là một <b>Counter</b>. Chuyện gì xảy ra trên biểu đồ tốc độ request?',
          ),
          options: [
            B(
              'Nothing — <code>rate()</code> takes the derivative of the series, so a decrement simply produces a negative slope for that interval and the graph is correct as long as you allow the axis to go below zero',
              'Chẳng sao — <code>rate()</code> lấy đạo hàm của chuỗi, nên một lần giảm chỉ đơn giản tạo một đoạn dốc âm cho khoảng đó và biểu đồ vẫn đúng miễn là bạn cho phép trục xuống dưới không',
            ),
            B(
              'Every logout looks like a <em>process restart</em> to <code>rate()</code>, which is defined to treat any decrease as a counter reset and add the pre-reset value back. So the graph grows spikes that never happened. The type exists to encode a promise — a Counter only goes up — and a gauge is the kind that is allowed to go down',
              'Mỗi lần đăng xuất trông y như một cú KHỞI ĐỘNG LẠI TIẾN TRÌNH dưới mắt <code>rate()</code>, thứ được định nghĩa là coi mọi lần giảm là một lần counter bị reset rồi cộng bù giá trị trước đó vào. Nên biểu đồ mọc lên những cú vọt chưa từng xảy ra. Cái LOẠI tồn tại để mã hoá một lời hứa — một Counter chỉ đi lên — còn gauge mới là loại được phép giảm',
            ),
            B(
              'prom-client rejects the declaration at startup, because a Counter has no <code>dec()</code> method at all and the call fails with a TypeError before any data is recorded',
              'prom-client từ chối phần khai báo ngay lúc khởi động, vì một Counter hoàn toàn không có phương thức <code>dec()</code> và lời gọi ấy chết bằng một TypeError trước khi có dữ liệu nào được ghi',
            ),
            B(
              'The value is correct but the metric cannot be aggregated across instances, because summing two counters that both decrease double-counts the overlap; a gauge would aggregate correctly with <code>avg()</code>',
              'Giá trị thì đúng nhưng chỉ số không gộp được qua nhiều thực thể, vì cộng hai counter cùng giảm sẽ đếm trùng phần chồng lấn; một gauge sẽ gộp đúng bằng <code>avg()</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The four metric types are not a taxonomy, they are four different contracts, and <code>rate()</code> is built on one of them. Because a counter is only ever supposed to rise, <code>rate()</code> is defined to interpret any decrease as the process having restarted, and to add the pre-reset value back so the rate stays continuous across a deploy. Break that promise and every decrement is read as a restart, so your request-rate graph acquires spikes with no event behind them. Measured on prom-client 15.1.3, option 3 is nearly right and still wrong in a way worth knowing: a <code>Counter</code> has no <code>dec()</code>, but <code>inc(-1)</code> is what people actually write, and it throws <code>It is not possible to decrease a counter</code> <em>at the call</em>, not at declaration — so the failure lands at runtime, on the logout path, in production. Declare it a <b>Gauge</b>: gauges are allowed to go down, and they are the only kind whose raw value is meaningful on its own.',
            'Bốn loại chỉ số không phải một cách phân loại, chúng là bốn GIAO KÈO khác nhau, và <code>rate()</code> được dựng trên một trong số đó. Vì một counter được cho là chỉ đi lên, <code>rate()</code> được định nghĩa để hiểu mọi lần giảm là tiến trình đã khởi động lại, rồi cộng bù giá trị trước đó vào để tốc độ vẫn liên tục qua một lần deploy. Phá lời hứa ấy thì mỗi lần giảm bị đọc thành một lần khởi động lại, nên biểu đồ tốc độ request của bạn mọc thêm những cú vọt chẳng có sự kiện nào đằng sau. Đo trên prom-client 15.1.3 thì phương án 3 gần đúng mà vẫn sai theo một cách đáng biết: một <code>Counter</code> KHÔNG có <code>dec()</code>, nhưng thứ người ta thật sự viết là <code>inc(-1)</code>, và nó ném <code>It is not possible to decrease a counter</code> NGAY TẠI LỜI GỌI chứ không phải lúc khai báo — nên cú hỏng rơi vào lúc chạy, trên đường đăng xuất, trên production. Hãy khai nó là <b>Gauge</b>: gauge được phép đi xuống, và đó là loại duy nhất mà giá trị thô của nó tự thân có nghĩa.',
          ),
        }),

        // q16 · đáp án 3
        mcq({
          prompt: B(
            'A Histogram named <code>http_request_duration_seconds</code> with labels <code>method</code> and <code>route</code> and eleven buckets is scraped after five observations. <b>Which description of the exposition text is correct?</b> (prom-client 15.1.3, verbatim from a real <code>register.metrics()</code>)',
            'Một Histogram tên <code>http_request_duration_seconds</code> với nhãn <code>method</code> và <code>route</code> cùng mười một ô, được thu thập sau năm lượt quan sát. <b>Mô tả nào về phần văn bản phơi ra là đúng?</b> (prom-client 15.1.3, nguyên văn từ một lượt <code>register.metrics()</code> thật)',
          ),
          options: [
            B(
              'Eleven <code>_bucket</code> lines, one per boundary, with <code>le</code> written as the <em>last</em> label after <code>method</code> and <code>route</code>, plus a <code>_total</code> line giving the observation count',
              'Mười một dòng <code>_bucket</code>, mỗi ranh giới một dòng, với <code>le</code> viết ở vị trí nhãn CUỐI CÙNG sau <code>method</code> và <code>route</code>, cộng một dòng <code>_total</code> cho số lượt quan sát',
            ),
            B(
              'Eleven <code>_bucket</code> lines whose values are the count that fell <em>into</em> each bucket, so they sum to five, plus <code>_sum</code> and <code>_count</code>; a <code>+Inf</code> bucket is only emitted when an observation exceeds the largest boundary',
              'Mười một dòng <code>_bucket</code> mà giá trị là số mẫu rơi VÀO từng ô, nên chúng cộng lại bằng năm, cộng thêm <code>_sum</code> và <code>_count</code>; ô <code>+Inf</code> chỉ được phát ra khi có một mẫu vượt quá ranh giới lớn nhất',
            ),
            B(
              'Twelve <code>_bucket</code> lines plus a single <code>_summary</code> line carrying <code>sum</code> and <code>count</code> as two labels, because the Prometheus text format collapses the two aggregates into one series to save bytes',
              'Mười hai dòng <code>_bucket</code> cộng một dòng <code>_summary</code> duy nhất mang <code>sum</code> và <code>count</code> làm hai nhãn, vì định dạng văn bản của Prometheus gộp hai giá trị tổng hợp vào một chuỗi để tiết kiệm byte',
            ),
            B(
              '<b>Twelve</b> <code>_bucket</code> lines — the eleven boundaries plus <code>le="+Inf"</code> — with <code>le</code> written <em>first</em>, before <code>method</code> and <code>route</code>; the values are <b>cumulative</b> (<code>le</code> means less-or-equal, so the last one equals the total); and two further series, <code>_sum</code> and <code>_count</code>, which carry <code>method</code> and <code>route</code> but no <code>le</code>',
              '<b>Mười hai</b> dòng <code>_bucket</code> — mười một ranh giới cộng <code>le="+Inf"</code> — với <code>le</code> viết ĐẦU TIÊN, trước <code>method</code> và <code>route</code>; các giá trị là <b>luỹ tích</b> (<code>le</code> nghĩa là nhỏ-hơn-hoặc-bằng, nên cái cuối bằng đúng tổng số); và hai chuỗi nữa, <code>_sum</code> và <code>_count</code>, mang <code>method</code> và <code>route</code> nhưng KHÔNG có <code>le</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Copied from the run — five observations of 0.012, 0.018, 0.031, 0.240 and 1.4 seconds:' +
            code(
              'http_request_duration_seconds_bucket{le="0.005",method="GET",route="/api/v1/notes"} 0\n' +
              'http_request_duration_seconds_bucket{le="0.025",method="GET",route="/api/v1/notes"} 2\n' +
              'http_request_duration_seconds_bucket{le="0.25",method="GET",route="/api/v1/notes"} 4\n' +
              'http_request_duration_seconds_bucket{le="+Inf",method="GET",route="/api/v1/notes"} 5\n' +
              'http_request_duration_seconds_sum{method="GET",route="/api/v1/notes"} 1.7009999999999998\n' +
              'http_request_duration_seconds_count{method="GET",route="/api/v1/notes"} 5') +
            'Three details decide every histogram question you will ever be asked. <b>Buckets are cumulative</b>, so <code>le="0.025"</code> is 2 because two observations were ≤ 25 ms, and the <code>+Inf</code> row is always present and always equals <code>_count</code>. That is exactly why buckets <em>add across instances</em> — they are counters — and why the quantile must be computed <em>after</em> summing, which is the whole reason a Histogram aggregates and a Summary does not. <b><code>le</code> comes first</b> in prom-client&#39;s output, which matters the moment you write a query by hand or grep the exposition. And <b>the series count is what you are buying</b>: one histogram with eleven boundaries is thirteen series <em>per label combination</em>, which is why the cardinality arithmetic in the next questions multiplies so fast.',
            'Chép từ lượt chạy — năm lượt quan sát 0,012; 0,018; 0,031; 0,240 và 1,4 giây:' +
            code(
              'http_request_duration_seconds_bucket{le="0.005",method="GET",route="/api/v1/notes"} 0\n' +
              'http_request_duration_seconds_bucket{le="0.025",method="GET",route="/api/v1/notes"} 2\n' +
              'http_request_duration_seconds_bucket{le="0.25",method="GET",route="/api/v1/notes"} 4\n' +
              'http_request_duration_seconds_bucket{le="+Inf",method="GET",route="/api/v1/notes"} 5\n' +
              'http_request_duration_seconds_sum{method="GET",route="/api/v1/notes"} 1.7009999999999998\n' +
              'http_request_duration_seconds_count{method="GET",route="/api/v1/notes"} 5') +
            'Ba chi tiết quyết định mọi câu hỏi về histogram bạn sẽ từng gặp. <b>Các ô là LUỸ TÍCH</b>, nên <code>le="0.025"</code> bằng 2 vì có hai mẫu ≤ 25 ms, và hàng <code>+Inf</code> luôn có mặt và luôn bằng <code>_count</code>. Đó chính là lý do các ô CỘNG ĐƯỢC qua nhiều thực thể — chúng là bộ đếm — và là lý do phân vị phải được tính SAU khi cộng, tức toàn bộ lý do một Histogram gộp được còn một Summary thì không. <b><code>le</code> đứng ĐẦU</b> trong output của prom-client, điều đó đáng kể ngay khi bạn viết tay một truy vấn hay grep phần phơi ra. Và <b>số CHUỖI mới là thứ bạn đang mua</b>: một histogram mười một ranh giới là mười ba chuỗi CHO MỖI TỔ HỢP NHÃN, và đó là lý do phép tính lực lượng ở các câu tiếp theo nhân lên nhanh đến thế.',
          ),
        }),

        // q17 · đáp án 0
        mcq({
          prompt: B(
            'A real Prometheus v3.5.0 scraped a service where <b>90% of requests take exactly 20 ms and 10% take exactly 800 ms</b>. Measured results:' +
            code(
              'sum(rate(http_request_duration_seconds_sum[1m]))\n' +
              '  / sum(rate(http_request_duration_seconds_count[1m]))   →  0.098\n' +
              'histogram_quantile(0.50, sum by (le) (rate(..._bucket[1m])))  →  0.0183\n' +
              'histogram_quantile(0.95, sum by (le) (rate(..._bucket[1m])))  →  0.75\n' +
              'histogram_quantile(0.99, sum by (le) (rate(..._bucket[1m])))  →  0.95') +
            '<b>What does the 98 ms mean describe?</b>',
            'Một Prometheus v3.5.0 thật thu thập từ một dịch vụ mà <b>90% request mất đúng 20 ms và 10% mất đúng 800 ms</b>. Kết quả đo được:' +
            code(
              'sum(rate(http_request_duration_seconds_sum[1m]))\n' +
              '  / sum(rate(http_request_duration_seconds_count[1m]))   →  0.098\n' +
              'histogram_quantile(0.50, sum by (le) (rate(..._bucket[1m])))  →  0.0183\n' +
              'histogram_quantile(0.95, sum by (le) (rate(..._bucket[1m])))  →  0.75\n' +
              'histogram_quantile(0.99, sum by (le) (rate(..._bucket[1m])))  →  0.95') +
            '<b>Con số trung bình 98 ms mô tả cái gì?</b>',
          ),
          options: [
            B(
              'Nobody. Not one request took 98 ms — the fast group is at 20 ms and the slow group at 800 ms, and the mean lands in the empty gap between them. It simultaneously overstates the typical experience by 5× and understates the bad one by 8×, and more traffic makes it worse: the more fast requests you serve, the more thoroughly they dilute the slow ones',
              'Chẳng ai cả. Không một request nào mất 98 ms — nhóm nhanh nằm ở 20 ms và nhóm chậm ở 800 ms, còn trung bình rơi vào đúng cái khe trống giữa hai nhóm. Nó vừa thổi phồng trải nghiệm điển hình lên 5 lần vừa hạ thấp trải nghiệm tệ đi 8 lần, và lưu lượng càng lớn thì càng tệ: bạn phục vụ càng nhiều request nhanh thì chúng càng pha loãng các request chậm triệt để hơn',
            ),
            B(
              'The typical request, since 98 ms sits close to the p50 of 18 ms once latency is read on the logarithmic scale a user actually perceives, and the arithmetic mean is the correct summary whenever the distribution has a single dominant mode as this one does',
              'Một request điển hình, vì 98 ms nằm gần p50 18 ms một khi đọc độ trễ trên thang lô-ga-rít mà người dùng thật sự cảm nhận, và trung bình cộng là bản tóm tắt đúng bất cứ khi nào phân bố có một đỉnh trội duy nhất như ở đây',
            ),
            B(
              'The worst case that a user is likely to encounter, because a mean computed from <code>_sum</code> and <code>_count</code> is weighted towards the slow tail by construction',
              'Trường hợp tệ nhất mà một người dùng có khả năng gặp, vì một trung bình tính từ <code>_sum</code> và <code>_count</code> vốn đã bị kéo lệch về phía đuôi chậm theo cấu trúc',
            ),
            B(
              'The true 90th percentile, since 90% of the mass sits in the fast mode and the mean of a bimodal distribution converges on the boundary between the two modes, which is why <code>_sum</code> divided by <code>_count</code> is the cheapest way to obtain a p90 without any bucket at all',
              'Đúng phân vị thứ 90, vì 90% khối lượng nằm ở đỉnh nhanh và trung bình của một phân bố hai đỉnh hội tụ về ranh giới giữa hai đỉnh, và đó là lý do <code>_sum</code> chia cho <code>_count</code> là cách rẻ nhất để có p90 mà không cần một cái ô nào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the most misleading number in operations, and the reason is arithmetic rather than subtle statistics: an average divides the total by the count, so every slow request is diluted by all the fast ones that ran alongside it. Make the tail ten times worse and the mean barely moves; grow the traffic and the metric degrades <em>as the system succeeds</em>. Put p50 and p99 side by side instead, and watch the <em>gap</em> — a rising p99 with a flat p50 means a subset of work is slow, while a rising p50 means everyone is affected. Two further things the measurement shows. The histogram&#39;s p50 of 18.3 ms is an interpolation inside the <code>(0.01, 0.025]</code> bucket for a true value of 20 ms — close, because the bucket is narrow there. Its p99 of 0.95 s for a true 0.8 s is 19% high, because the entire slow cluster sits inside one wide <code>(0.5, 1]</code> bucket. And there is one number none of these describe: a request that timed out and returned 502 often never reaches the histogram at all, so <b>latency percentiles can <em>improve</em> during an outage</b> — always put the error rate on the same panel.',
            'Đây là con số dễ gây hiểu lầm nhất trong vận hành, và lý do là số học chứ không phải thống kê tinh vi: một phép trung bình chia tổng cho số lượng, nên mỗi request chậm bị pha loãng bởi tất cả những request nhanh chạy cùng nó. Làm cái đuôi tệ đi mười lần thì trung bình gần như không nhúc nhích; lưu lượng lớn lên thì cái chỉ số xuống cấp NGAY KHI hệ thống thành công. Hãy đặt p50 và p99 cạnh nhau thay vì thế, và nhìn cái KHE giữa chúng — p99 tăng mà p50 phẳng nghĩa là một nhóm con công việc đang chậm, còn p50 tăng nghĩa là mọi người đều bị. Hai điều nữa mà phép đo cho thấy. p50 của histogram là 18,3 ms, một phép nội suy bên trong ô <code>(0.01, 0.025]</code> cho giá trị thật 20 ms — sát, vì ở đó ô hẹp. Còn p99 của nó là 0,95 s cho giá trị thật 0,8 s, tức cao hơn 19%, vì cả cụm chậm nằm gọn trong một ô rộng <code>(0.5, 1]</code>. Và có một con số mà chẳng cái nào trong số này mô tả: một request hết giờ rồi trả 502 thường không hề tới được histogram, nên <b>các phân vị độ trễ có thể TỐT LÊN trong lúc đang có sự cố</b> — hãy luôn đặt tỉ lệ lỗi lên cùng một ô.',
          ),
        }),

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'Real measurement, Prometheus v3.5.0. A Histogram with the prom-client default buckets (largest boundary <code>10</code>) receives <b>only</b> observations of 42 s and 55 s. The dashboard reads:' +
            code(
              'histogram_quantile(0.99, sum by (le) (rate(slow_seconds_bucket[1m])))  →  10\n' +
              'sum(rate(slow_seconds_sum[1m])) / sum(rate(slow_seconds_count[1m]))   →  48.5') +
            '<b>Why does p99 say 10, and what is the practical danger?</b>',
            'Đo thật, Prometheus v3.5.0. Một Histogram dùng bộ ô mặc định của prom-client (ranh giới lớn nhất là <code>10</code>) chỉ nhận về CÁC MẪU 42 s và 55 s. Bảng theo dõi hiện ra:' +
            code(
              'histogram_quantile(0.99, sum by (le) (rate(slow_seconds_bucket[1m])))  →  10\n' +
              'sum(rate(slow_seconds_sum[1m])) / sum(rate(slow_seconds_count[1m]))   →  48.5') +
            '<b>Vì sao p99 báo 10, và mối nguy thực tế là gì?</b>',
          ),
          options: [
            B(
              'Because <code>histogram_quantile</code> returns <code>NaN</code> whenever the target quantile falls inside the <code>+Inf</code> bucket, and Grafana then renders that <code>NaN</code> using the last valid boundary it saw rather than leaving a hole in the series; the danger is therefore a panel that goes flat instead of blank, and the fix is a Grafana null-handling setting rather than anything about the buckets themselves',
              'Vì <code>histogram_quantile</code> trả về <code>NaN</code> mỗi khi phân vị đích rơi vào bên trong ô <code>+Inf</code>, và Grafana khi đó vẽ cái <code>NaN</code> ấy bằng ranh giới hợp lệ cuối cùng nó thấy thay vì để một lỗ hổng trong chuỗi; nên mối nguy là một cái ô đồ thị nằm phẳng thay vì trống, và cách chữa là một thiết lập xử lý giá trị rỗng trong Grafana chứ không liên quan gì tới bản thân các ô',
            ),
            B(
              'Because the client library clamps any observation above the largest boundary down to that boundary before recording it, so the histogram genuinely never saw 42 s and neither did <code>_sum</code>; the danger is silent data loss at instrumentation time, and the fix is to raise the top boundary and redeploy, after which the recorded values become accurate again',
              'Vì thư viện phía client kẹp mọi mẫu vượt ranh giới lớn nhất xuống đúng ranh giới đó trước khi ghi lại, nên histogram thật sự chưa từng thấy 42 s và <code>_sum</code> cũng thế; mối nguy là mất dữ liệu âm thầm ngay lúc đo đạc, và cách chữa là nâng ranh giới trên cùng rồi deploy lại, sau đó các giá trị ghi được lại chính xác',
            ),
            B(
              'Because every observation lands in the <code>+Inf</code> bucket, so the quantile has no upper information and is <b>clamped to the largest finite boundary</b>. The danger is that <code>10</code> is a perfectly plausible number — nothing on the dashboard says "off the top of the scale", so a service where every request takes three quarters of a minute reports a ten-second p99 and looks merely slow. The fix is headroom: place boundaries well above the worst latency you expect, because an incident pushes latency somewhere your normal buckets never reach',
              'Vì mọi mẫu đều rơi vào ô <code>+Inf</code>, nên phân vị không có thông tin nào ở phía trên và bị <b>kẹp về ranh giới hữu hạn lớn nhất</b>. Mối nguy là <code>10</code> là một con số hoàn toàn HỢP LÝ — chẳng có gì trên bảng theo dõi nói "đã vượt khỏi thang", nên một dịch vụ mà mọi request mất ba phần tư phút lại báo p99 mười giây và trông chỉ như hơi chậm. Cách chữa là để dư khoảng: đặt ranh giới cao hơn hẳn độ trễ tệ nhất bạn dự kiến, vì một sự cố đẩy độ trễ tới nơi mà các ô bình thường của bạn không bao giờ với tới',
            ),
            B(
              'Because <code>rate()</code> over a 1-minute window cannot represent observations longer than the window itself, so anything above 60 s is folded back into the largest bucket that still fits inside the range; widening the window to <code>[5m]</code> would let the 42 s and 55 s samples through and the p99 would then report their real magnitude',
              'Vì <code>rate()</code> trên cửa sổ 1 phút không biểu diễn nổi những mẫu dài hơn chính cửa sổ đó, nên mọi thứ trên 60 s bị gấp ngược lại vào cái ô lớn nhất còn lọt trong khoảng; nới cửa sổ ra <code>[5m]</code> sẽ cho các mẫu 42 s và 55 s đi qua và khi ấy p99 báo đúng độ lớn thật của chúng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The bucket rows from the same run make it unambiguous: every boundary from <code>0.005</code> to <code>10</code> has a rate of <b>0</b>, and only <code>le="+Inf"</code> is non-zero. A histogram knows how many observations exceeded ten seconds and knows nothing whatsoever about how far they exceeded it — that information was discarded at observation time and no query can recover it. Prometheus then returns the largest finite boundary rather than <code>+Inf</code>, which is a defensible choice and a dangerous one, because the result is indistinguishable from a genuine ten-second p99. Note which number <em>did</em> tell the truth: <code>_sum / _count</code> gave 48.5 s, because <code>_sum</code> accumulates the real observed values regardless of bucketing. That is the practical cross-check — <b>when a percentile sits suspiciously exactly on your top boundary, compare it against <code>_sum/_count</code></b>, and if the mean is far above the p99 you have found an overflow rather than a service that is behaving. This is also why bucket choice is a measurement task, not a default to accept: buckets must be dense where your data actually is, and open enough at the top that an incident stays visible.',
            'Các hàng ô từ chính lượt chạy ấy làm mọi thứ rõ ràng: mọi ranh giới từ <code>0.005</code> tới <code>10</code> đều có tốc độ bằng <b>0</b>, và chỉ mỗi <code>le="+Inf"</code> khác không. Một histogram BIẾT có bao nhiêu mẫu vượt quá mười giây và HOÀN TOÀN KHÔNG BIẾT chúng vượt xa tới đâu — thông tin đó đã bị vứt ngay lúc quan sát và không truy vấn nào lấy lại được. Prometheus khi ấy trả về ranh giới hữu hạn lớn nhất thay vì <code>+Inf</code>, một lựa chọn bảo vệ được và cũng nguy hiểm, vì kết quả không phân biệt nổi với một p99 mười giây có thật. Hãy để ý con số nào ĐÃ nói thật: <code>_sum / _count</code> cho 48,5 s, vì <code>_sum</code> tích luỹ đúng các giá trị quan sát thật bất kể chia ô thế nào. Đó chính là phép đối chiếu thực dụng — <b>khi một phân vị nằm chính xác một cách đáng ngờ ngay trên ranh giới cao nhất của bạn, hãy so nó với <code>_sum/_count</code></b>, và nếu trung bình cao hơn hẳn p99 thì bạn đã tìm ra một cú tràn chứ không phải một dịch vụ đang ngoan. Đây cũng là lý do chọn ô là một việc ĐO ĐẠC chứ không phải một cái mặc định để chấp nhận: ô phải dày ở đúng chỗ dữ liệu của bạn nằm, và hở đủ ở phía trên để một sự cố còn nhìn thấy được.',
          ),
        }),

        // q19 · đáp án 1
        mcq({
          prompt: B(
            'A metrics middleware uses ' + c('const route = req.path') + ' as the <code>route</code> label instead of ' + c("const route = req.route?.path ?? 'unmatched'") + '. The service has 945 route declarations and 200,000 notes. <b>What is the result?</b>',
            'Một middleware chỉ số dùng ' + c('const route = req.path') + ' làm nhãn <code>route</code> thay vì ' + c("const route = req.route?.path ?? 'unmatched'") + '. Dịch vụ có 945 khai báo route và 200.000 ghi chú. <b>Kết quả là gì?</b>',
          ),
          options: [
            B(
              'They behave identically for every route that matched a handler, because Express normalises the path against the router before the response finishes; the only difference appears on 404s, where <code>req.route</code> is undefined and the <code>unmatched</code> fallback merely keeps the label from being an empty string that Prometheus would otherwise reject',
              'Chúng hành xử y hệt nhau với mọi route khớp được một handler, vì Express chuẩn hoá đường dẫn theo router trước khi phản hồi kết thúc; khác biệt duy nhất xuất hiện ở các cú 404, nơi <code>req.route</code> là undefined và cái lùi <code>unmatched</code> chỉ giữ cho nhãn khỏi thành một chuỗi rỗng mà Prometheus vốn sẽ từ chối',
            ),
            B(
              '<code>req.path</code> is the <em>actual URL</em>, so every note id becomes its own series — and so does every 404 from a scanner probing <code>/wp-admin</code> or <code>/.env</code>, which means <b>anyone on the internet can add permanent series to your Prometheus</b>. The series count is a PRODUCT: 224 series becomes 2,240,000 with one unbounded label, about 6.4 GB, and Prometheus then OOM-loops through WAL replay while <em>every other metric</em> loses data too',
              '<code>req.path</code> là URL THẬT, nên mỗi id ghi chú thành một chuỗi riêng — và mọi cú 404 từ một con bot dò <code>/wp-admin</code> hay <code>/.env</code> cũng thế, nghĩa là <b>bất cứ ai trên Internet cũng thêm được chuỗi VĨNH VIỄN vào Prometheus của bạn</b>. Số chuỗi là một PHÉP NHÂN: 224 chuỗi thành 2.240.000 chỉ với một nhãn không chặn, khoảng 6,4 GB, và rồi Prometheus lặp vô tận giữa OOM và replay WAL trong khi MỌI CHỈ SỐ KHÁC cũng mất dữ liệu theo',
            ),
            B(
              'Prometheus caps a metric at its configured <code>sample_limit</code> and drops the excess at scrape time, so the damage is confined to that metric: its data becomes incomplete while every other metric continues normally',
              'Prometheus chặn một chỉ số ở mức <code>sample_limit</code> đã cấu hình rồi vứt phần thừa ngay lúc thu thập, nên thiệt hại bị giới hạn trong chính chỉ số đó: dữ liệu của nó thành khuyết còn mọi chỉ số khác vẫn chạy bình thường',
            ),
            B(
              'Query performance degrades but storage does not, because Prometheus stores the label value once in a dictionary and each series then references it by an integer id rather than repeating the string',
              'Hiệu năng truy vấn xuống cấp nhưng dung lượng lưu thì không, vì Prometheus lưu giá trị nhãn một lần trong một từ điển rồi mỗi chuỗi tham chiếu tới nó bằng một id số nguyên thay vì lặp lại chuỗi ký tự',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A time series is one metric name plus one exact combination of label <em>values</em>, so adding a label multiplies and never adds — 8 methods × 28 routes × 10 codes is 2,240, and one histogram with 16 buckets adds 35,840 more. The template <code>/notes/:id</code> keeps the label bounded at the number of things you wrote; the actual URL makes it unbounded in a way you do not control, and the <code>unmatched</code> fallback is not tidiness but the thing that stops the public internet from writing to your monitoring system. What makes cardinality the single most common way a monitoring system is destroyed is that Prometheus does not fail gracefully: memory climbs, the <code>/metrics</code> response grows until scrapes time out, <b>and a scrape timeout puts a gap in every metric from that target, including the ones that were fine</b>, and then it is OOM-killed and killed again while replaying the WAL. So the monitoring is down during exactly the incident the high-cardinality label was added to diagnose. If what you wanted was per-user latency, that is a log field; if it was "which user is slowest", that is a trace.',
            'Một chuỗi thời gian là một tên chỉ số cộng MỘT tổ hợp chính xác các GIÁ TRỊ nhãn, nên thêm một nhãn là NHÂN chứ không bao giờ là cộng — 8 method × 28 route × 10 mã là 2.240, và một histogram 16 ô thêm 35.840 nữa. Cái khuôn <code>/notes/:id</code> giữ nhãn có chặn ở đúng số thứ bạn tự viết ra; còn URL thật làm nó không chặn theo một cách bạn không kiểm soát, và cái lùi <code>unmatched</code> không phải sự gọn gàng mà là thứ ngăn Internet công cộng ghi vào hệ thống giám sát của bạn. Điều làm lực lượng nhãn thành cách phổ biến nhất để phá huỷ một hệ giám sát là Prometheus KHÔNG hỏng một cách êm ái: bộ nhớ trèo lên, phần trả lời <code>/metrics</code> phình ra tới khi các lượt thu thập hết giờ, <b>và một lượt thu thập hết giờ tạo một khoảng trống trong MỌI chỉ số của cái đích đó, kể cả những cái vốn đang ổn</b>, rồi nó bị giết vì hết bộ nhớ và bị giết lại trong lúc replay WAL. Thế là hệ giám sát chết đúng vào lúc có cái sự cố mà cái nhãn lực-lượng-lớn kia được thêm vào để chẩn đoán. Nếu thứ bạn muốn là độ trễ theo từng người dùng thì đó là một TRƯỜNG LOG; nếu là "người dùng nào chậm nhất" thì đó là một TRACE.',
          ),
        }),

        // q20 · đáp án 3
        mcq({
          prompt: B(
            'You run two backend containers behind nginx and want p99 request latency. <b>Why is a Summary the wrong metric type here?</b>',
            'Bạn chạy hai container backend sau nginx và muốn có p99 độ trễ request. <b>Vì sao Summary là loại chỉ số SAI ở đây?</b>',
          ),
          options: [
            B(
              'Because a Summary keeps a sliding window of raw observations in process memory in order to compute its quantiles, so its footprint grows with traffic and with the width of the window, while a histogram stays constant at thirteen numbers no matter how many requests it has seen — the difference is a memory problem inside the container rather than a query problem in Prometheus',
              'Vì một Summary giữ một cửa sổ trượt các mẫu thô trong bộ nhớ tiến trình để tính các phân vị của nó, nên dung lượng của nó lớn theo lưu lượng và theo bề rộng cửa sổ, trong khi một histogram đứng yên ở mười ba con số bất kể nó đã thấy bao nhiêu request — khác biệt là một vấn đề bộ nhớ bên trong container chứ không phải một vấn đề truy vấn trong Prometheus',
            ),
            B(
              'Because prom-client\'s Summary implementation exposes no <code>_bucket</code> series at all, so Grafana cannot draw a heatmap from it and you lose the one visualisation that makes a bimodal distribution obvious at a glance; percentiles alone show two numbers moving and never reveal that the traffic is actually two separate populations',
              'Vì phần cài đặt Summary của prom-client hoàn toàn không phơi ra chuỗi <code>_bucket</code> nào, nên Grafana không vẽ được biểu đồ nhiệt từ nó và bạn mất đi cách hiển thị duy nhất làm một phân bố hai đỉnh hiện ra ngay trong một cái liếc; riêng các phân vị thì chỉ cho thấy hai con số nhúc nhích và không bao giờ để lộ rằng lưu lượng thật ra là hai quần thể tách biệt',
            ),
            B(
              'Because a Summary\'s quantiles are computed over the whole process lifetime unless you configure <code>maxAgeSeconds</code> and an age-bucket count, so a single bad minute keeps p99 elevated for days and the metric stops responding to the present; a histogram avoids this because <code>rate()</code> already scopes it to a window at query time',
              'Vì các phân vị của một Summary được tính trên toàn bộ vòng đời tiến trình trừ khi bạn cấu hình <code>maxAgeSeconds</code> cùng số ô tuổi, nên một phút tồi tệ duy nhất giữ p99 ở mức cao suốt nhiều ngày và cái chỉ số thôi phản ứng với hiện tại; một histogram tránh được chuyện đó vì <code>rate()</code> vốn đã giới hạn nó vào một cửa sổ ngay lúc truy vấn',
            ),
            B(
              'Because a Summary computes its quantiles <em>inside each process</em>, so two containers give you two p99 values and <b>no arithmetic combines them into the p99 of the combined traffic</b> — averaging two 99th percentiles is not the 99th percentile of anything, and taking the max is a different wrong answer. The graph still shows a number that moves with load, and it is wrong in a way no dashboard can reveal. Histogram buckets are counters, counters add, so the quantile is computed after summing',
              'Vì một Summary tính các phân vị của nó BÊN TRONG TỪNG TIẾN TRÌNH, nên hai container cho bạn hai giá trị p99 và <b>không phép tính nào gộp chúng thành p99 của lưu lượng hợp nhất</b> — trung bình của hai phân vị thứ 99 không phải phân vị thứ 99 của bất cứ thứ gì, còn lấy giá trị lớn nhất là một câu trả lời sai kiểu khác. Biểu đồ vẫn hiện ra một con số nhúc nhích theo tải, và nó sai theo cách không bảng theo dõi nào lộ ra được. Các ô của histogram là bộ đếm, mà bộ đếm thì cộng được, nên phân vị được tính SAU khi cộng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the one metric mistake that survives code review, because the resulting graph looks entirely plausible. The exposition makes the problem visible: a Summary emits <code>demo_summary_seconds{quantile="0.5"}</code>, <code>{quantile="0.9"}</code> and so on — <em>already-computed answers</em>, one set per process — alongside <code>_sum</code> and <code>_count</code>. Those two aggregates do add, which is why the <em>mean</em> across instances is computable and the percentile is not. A Histogram emits counts instead of answers, so <code>sum by (le)</code> merges both containers into one distribution and <code>histogram_quantile</code> runs once, at the end, over the merged buckets. That ordering — <b>aggregate first, quantile last</b> — is the same rule that fixes the zoom-out problem on a Grafana panel, and it is the reason a histogram is the default choice unless you can state out loud why aggregation will never be needed. Option 3 describes a real Summary pitfall (unbounded max age) but it is a second-order one, and it does not explain why two instances cannot be combined even when both are configured perfectly.',
            'Đây là sai lầm về chỉ số duy nhất sống sót qua khâu rà mã, vì cái biểu đồ sinh ra trông hoàn toàn hợp lý. Phần phơi ra làm vấn đề hiện rõ: một Summary phát ra <code>demo_summary_seconds{quantile="0.5"}</code>, <code>{quantile="0.9"}</code> và cứ thế — những CÂU TRẢ LỜI ĐÃ TÍNH SẴN, mỗi tiến trình một bộ — cùng với <code>_sum</code> và <code>_count</code>. Hai giá trị tổng hợp đó thì CỘNG ĐƯỢC, và đó là lý do TRUNG BÌNH qua các thực thể tính được còn phân vị thì không. Một Histogram phát ra SỐ ĐẾM thay vì câu trả lời, nên <code>sum by (le)</code> trộn cả hai container thành một phân bố duy nhất rồi <code>histogram_quantile</code> chạy đúng một lần, ở cuối, trên các ô đã trộn. Đúng cái thứ tự ấy — <b>gộp trước, phân vị sau</b> — cũng là luật chữa được chuyện thu nhỏ cửa sổ thời gian trên một ô Grafana, và là lý do histogram là lựa chọn mặc định trừ khi bạn nói thành lời được vì sao sẽ không bao giờ cần gộp. Phương án 3 mô tả một cái bẫy Summary có thật (tuổi tối đa không chặn) nhưng nó là bậc hai, và nó không giải thích được vì sao hai thực thể không gộp được ngay cả khi cả hai đều cấu hình hoàn hảo.',
          ),
        }),

        /* ── Chương 5 — chỉ số chỉ Node nói cho bạn biết (5 câu) ─────────── */

        // q21 · đáp án 0
        mcq({
          prompt: B(
            'Measured on a 4-core machine while deliberately blocking the event loop:' +
            code(
              'workload             CPU (1 core)   CPU (machine)   lag p99\n' +
              'idle                       4%            1.0%          1 ms\n' +
              'blocking  50 ms/turn      91%           22.7%         51 ms\n' +
              'blocking 200 ms/turn      95%           23.8%        201 ms') +
            '<b>Why is machine CPU% the wrong saturation signal for Node?</b>',
            'Đo trên một máy 4 nhân trong lúc cố ý chặn vòng lặp sự kiện:' +
            code(
              'tải                  CPU (1 nhân)   CPU (cả máy)   trễ p99\n' +
              'nhàn rỗi                   4%            1,0%          1 ms\n' +
              'chặn  50 ms mỗi vòng      91%           22,7%         51 ms\n' +
              'chặn 200 ms mỗi vòng      95%           23,8%        201 ms') +
            '<b>Vì sao CPU% cả máy là tín hiệu bão hoà SAI cho Node?</b>',
          ),
          options: [
            B(
              'Because your JavaScript runs on one thread, so a completely wedged process — accepting no work, answering nothing — displays as a quarter busy on a four-core box, which is the number <code>docker stats</code> and every cloud console report by default. Worse, CPU% has already <em>saturated</em> at the resolution you need: 91% versus 95% for a workload that is four times worse. Event-loop lag tracks the stall exactly (1 → 51 → 201 ms) and <em>is</em> the delay added to every request queued behind it',
              'Vì JavaScript của bạn chạy trên MỘT luồng, nên một tiến trình kẹt cứng hoàn toàn — không nhận việc, không trả lời gì — lại hiện ra là một phần tư bận trên một máy bốn nhân, và đó chính là con số mà <code>docker stats</code> cùng mọi bảng điều khiển đám mây báo mặc định. Tệ hơn, CPU% đã BÃO HOÀ ở đúng độ phân giải bạn cần: 91% so với 95% cho một tải tệ gấp bốn lần. Độ trễ vòng lặp bám sát cú đơ chính xác (1 → 51 → 201 ms) và nó CHÍNH LÀ phần trễ cộng thêm vào mọi request đang xếp hàng phía sau',
            ),
            B(
              'Because CPU accounting in a container is sampled from cgroup counters at a coarse interval, so any stall shorter than the sampling period is averaged away before the number ever reaches your dashboard; shortening <code>scrape_interval</code> to a second or two restores the resolution and makes CPU% a usable saturation signal again, which is why lag is a workaround rather than a replacement',
              'Vì việc tính CPU trong một container được lấy mẫu từ các bộ đếm cgroup ở một chu kỳ thô, nên mọi cú đơ ngắn hơn chu kỳ lấy mẫu đều bị san phẳng trước khi con số kịp tới bảng theo dõi của bạn; rút <code>scrape_interval</code> xuống một hai giây là khôi phục được độ phân giải và CPU% lại thành một tín hiệu bão hoà dùng được, nên độ trễ chỉ là cách chữa cháy chứ không phải cách thay thế',
            ),
            B(
              'Because blocking work does not consume CPU at all — the thread is parked waiting, which is why the machine reads 23.8% — so CPU% correctly reports that the machine has spare capacity while the process is idle-blocked',
              'Vì việc chặn hoàn toàn không tiêu CPU — luồng đang đỗ lại chờ, và đó là lý do cả máy đọc ra 23,8% — nên CPU% báo đúng rằng máy còn dư công suất trong khi tiến trình bị chặn ở trạng thái rảnh',
            ),
            B(
              'Because Node offloads CPU-bound work to the libuv thread pool, so the four cores are genuinely shared and the per-core figure is the misleading one; the machine-wide number is the honest one and lag merely restates it',
              'Vì Node đẩy việc nặng CPU sang bể luồng của libuv, nên bốn nhân thật sự được chia sẻ và con số theo từng nhân mới là con số gây hiểu lầm; con số cả máy mới trung thực còn độ trễ chỉ phát biểu lại nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two separate failures, and the second is the one people miss. The first is the denominator: one saturated thread out of four cores reads as 25%, so the dashboard your host provides shows a number that cannot see a total outage. The second is <em>resolution</em> — per-process CPU has already pinned near 100% at 50 ms of blocking, so it has stopped carrying information exactly where you need to distinguish "slightly bad" from "four times worse", while lag stays linear all the way up. Lag is also the only one of these numbers with a direct user meaning: 201 ms of lag is 201 ms added to every request that arrived while the thread was busy. Alert on <b>p99</b> lag, not on the mean — the same run showed p50 sitting at 1.1 ms in <em>every</em> case including a 120 ms block, because a block is by definition occasional and most turns of the loop are fine. And note what does <em>not</em> block the loop: waiting on Postgres, R2 or the LLM gateway. That is what <code>async</code> is for, and it is why a slow database shows up as latency with no lag at all.',
            'Hai cú hỏng riêng biệt, và cái thứ hai mới là cái người ta bỏ sót. Cái thứ nhất là MẪU SỐ: một luồng bão hoà trên bốn nhân đọc ra 25%, nên cái bảng mà nhà cung cấp máy chủ đưa cho bạn hiện một con số không nhìn thấy nổi một cú sập toàn phần. Cái thứ hai là ĐỘ PHÂN GIẢI — CPU theo tiến trình đã ghim gần 100% ngay ở mức chặn 50 ms, nên nó thôi mang thông tin đúng ở chỗ bạn cần phân biệt "hơi tệ" với "tệ gấp bốn lần", trong khi độ trễ vẫn tuyến tính suốt lên trên. Độ trễ cũng là con số duy nhất trong đám này có nghĩa trực tiếp với người dùng: 201 ms trễ là 201 ms cộng thêm vào mọi request tới trong lúc luồng đang bận. Hãy cảnh báo trên <b>p99</b> của độ trễ, đừng trên trung bình — cùng lượt chạy ấy cho thấy p50 nằm ở 1,1 ms trong MỌI trường hợp, kể cả cú chặn 120 ms, vì một cú chặn theo định nghĩa là thi thoảng và phần lớn các vòng của vòng lặp đều ổn. Và hãy để ý thứ KHÔNG chặn vòng lặp: chờ Postgres, R2 hay cổng LLM. Đó là mục đích của <code>async</code>, và đó là lý do một cơ sở dữ liệu chậm hiện ra dưới dạng độ trễ mà không kèm chút trễ vòng lặp nào.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'Real output from <code>collectDefaultMetrics()</code> on prom-client 15.1.3, in a run where the loop was busy:' +
            code(
              'nodejs_eventloop_lag_seconds 0\n' +
              'nodejs_eventloop_lag_min_seconds 0.010739712\n' +
              'nodejs_eventloop_lag_max_seconds 0.015163391\n' +
              'nodejs_eventloop_lag_mean_seconds 0.01129582276923077\n' +
              'nodejs_eventloop_lag_stddev_seconds 0.0008286422443378412\n' +
              'nodejs_eventloop_lag_p50_seconds 0.011059199\n' +
              'nodejs_eventloop_lag_p90_seconds 0.011386879\n' +
              'nodejs_eventloop_lag_p99_seconds 0.015163391') +
            '<b>Which series do you alert on, and why not the first one?</b>',
            'Output thật từ <code>collectDefaultMetrics()</code> trên prom-client 15.1.3, trong một lượt chạy mà vòng lặp đang bận:' +
            code(
              'nodejs_eventloop_lag_seconds 0\n' +
              'nodejs_eventloop_lag_min_seconds 0.010739712\n' +
              'nodejs_eventloop_lag_max_seconds 0.015163391\n' +
              'nodejs_eventloop_lag_mean_seconds 0.01129582276923077\n' +
              'nodejs_eventloop_lag_stddev_seconds 0.0008286422443378412\n' +
              'nodejs_eventloop_lag_p50_seconds 0.011059199\n' +
              'nodejs_eventloop_lag_p90_seconds 0.011386879\n' +
              'nodejs_eventloop_lag_p99_seconds 0.015163391') +
            '<b>Bạn cảnh báo trên chuỗi nào, và vì sao không phải cái đầu tiên?</b>',
          ),
          options: [
            B(
              '<code>nodejs_eventloop_lag_max_seconds</code>, because the worst case is what a user experiences and the percentiles smooth away exactly the outlier you are looking for',
              '<code>nodejs_eventloop_lag_max_seconds</code>, vì trường hợp tệ nhất là thứ người dùng cảm nhận và các phân vị san phẳng đi đúng cái giá trị ngoại lai bạn đang tìm',
            ),
            B(
              '<code>nodejs_eventloop_lag_stddev_seconds</code>, because a stalled loop shows up as variance long before any percentile crosses a threshold, which makes it the leading indicator among these eight',
              '<code>nodejs_eventloop_lag_stddev_seconds</code>, vì một vòng lặp bị đơ hiện ra dưới dạng phương sai từ rất lâu trước khi bất kỳ phân vị nào vượt ngưỡng, và điều đó khiến nó là chỉ báo sớm trong tám cái này',
            ),
            B(
              '<code>nodejs_eventloop_lag_p99_seconds</code>. The first series is a single <em>instantaneous</em> sample — it read <b>0</b> in the same scrape where p99 read 15.2 ms — so it can be zero while the process is stalling. And the separate <code>_mean_</code> series is no better as an alert: a block is by definition occasional, so p50 and the mean stay flat through a long stall while p99 tracks it',
              '<code>nodejs_eventloop_lag_p99_seconds</code>. Chuỗi đầu tiên là MỘT mẫu TỨC THỜI — nó đọc ra <b>0</b> trong đúng lượt thu thập mà p99 đọc ra 15,2 ms — nên nó có thể bằng không trong khi tiến trình đang đơ. Và cái chuỗi <code>_mean_</code> riêng cũng chẳng khá hơn khi làm cảnh báo: một cú chặn theo định nghĩa là thi thoảng, nên p50 và trung bình đứng phẳng suốt một cú đơ dài trong khi p99 thì bám theo',
            ),
            B(
              '<code>nodejs_eventloop_lag_seconds</code>, the unsuffixed one, because it is the canonical series and the suffixed variants are computed from a histogram that is never reset and therefore drifts upward over the process lifetime',
              '<code>nodejs_eventloop_lag_seconds</code>, cái không hậu tố, vì nó là chuỗi chính danh còn các biến thể có hậu tố được tính từ một histogram không bao giờ được reset nên trôi dần lên trong suốt vòng đời tiến trình',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the transcript, because it settles two things a description would not. First, <code>nodejs_eventloop_lag_seconds</code> and <code>nodejs_eventloop_lag_mean_seconds</code> are <em>different series</em> on prom-client 15.1.3 — the course describes the unsuffixed one as "a mean", and the measurement disagrees: it read 0 in the same scrape where <code>_mean_</code> read 11.3 ms and <code>_p99_</code> read 15.2 ms, because it is one instantaneous sample taken with <code>setImmediate</code> rather than a summary of the interval. A single sample that happens to land in a quiet moment reports zero while the process is stalling, which is the worst possible property for an alert. Second, even the honest mean is the wrong statistic here for the reason chapter 5 measured: p50 lag sat at 1.1 ms through a deliberate 120 ms block, because most turns of the loop are fine and a block is occasional by definition. Alert on p99, and set the threshold where a human would say "that process is not coming back on its own" — 5 seconds, not 50 milliseconds, because a GC pause or a large <code>JSON.parse</code> at a tighter threshold restarts a working container.',
            'Hãy đọc đoạn output, vì nó dập tắt hai chuyện mà một lời mô tả không làm được. Một, <code>nodejs_eventloop_lag_seconds</code> và <code>nodejs_eventloop_lag_mean_seconds</code> là HAI CHUỖI KHÁC NHAU trên prom-client 15.1.3 — giáo trình mô tả cái không hậu tố là "một trung bình", còn phép đo thì không đồng ý: nó đọc ra 0 trong đúng lượt thu thập mà <code>_mean_</code> đọc 11,3 ms và <code>_p99_</code> đọc 15,2 ms, vì nó là MỘT mẫu tức thời lấy bằng <code>setImmediate</code> chứ không phải một bản tóm tắt của cả khoảng. Một mẫu đơn lẻ tình cờ rơi vào lúc yên ắng sẽ báo về không trong khi tiến trình đang đơ, đó là tính chất tệ nhất có thể với một cảnh báo. Hai, ngay cả cái trung bình trung thực cũng là thống kê sai ở đây vì đúng lý do chương 5 đã đo: p50 của độ trễ nằm ở 1,1 ms suốt một cú chặn 120 ms có chủ ý, vì phần lớn các vòng đều ổn và một cú chặn theo định nghĩa là thi thoảng. Hãy cảnh báo trên p99, và đặt ngưỡng ở chỗ một con người sẽ nói "tiến trình đó không tự quay lại được đâu" — 5 giây, không phải 50 mili giây, vì ở một ngưỡng chặt hơn thì một cú dừng GC hay một lượt <code>JSON.parse</code> lớn sẽ khởi động lại một container đang chạy tốt.',
          ),
        }),

        // q23 · đáp án 1
        mcq({
          prompt: B(
            'Measured with <code>--expose-gc</code>, all five numbers in MB:' +
            code(
              'at startup                    rss  43   heapTotal   5   heapUsed  4   external   1\n' +
              'after 400k objects            rss 150   heapTotal 101   heapUsed 75   external   1\n' +
              'after dropping refs + gc()    rss 140   heapTotal  38   heapUsed  4   external   1\n' +
              'after 200 MB of Buffers       rss 143   heapTotal  37   heapUsed  4   external 202\n' +
              'after WRITING to those        rss 343   heapTotal  37   heapUsed  4   external 202') +
            '<b>Which reading of this is right?</b>',
            'Đo với <code>--expose-gc</code>, cả năm con số tính bằng MB:' +
            code(
              'lúc khởi động                 rss  43   heapTotal   5   heapUsed  4   external   1\n' +
              'sau 400k object               rss 150   heapTotal 101   heapUsed 75   external   1\n' +
              'sau khi bỏ tham chiếu + gc()  rss 140   heapTotal  38   heapUsed  4   external   1\n' +
              'sau 200 MB Buffer             rss 143   heapTotal  37   heapUsed  4   external 202\n' +
              'sau khi GHI vào chúng         rss 343   heapTotal  37   heapUsed  4   external 202') +
            '<b>Cách đọc nào đúng?</b>',
          ),
          options: [
            B(
              'Row 3 shows a 136 MB leak, since RSS did not return to 43 MB after a forced collection; and row 4 shows that <code>external</code> memory is not counted in RSS at all, which is why allocating 200 MB moved RSS by only 3',
              'Hàng 3 cho thấy một chỗ rò 136 MB, vì RSS không quay về 43 MB sau một lượt thu gom cưỡng bức; và hàng 4 cho thấy bộ nhớ <code>external</code> hoàn toàn không được tính vào RSS, nên cấp phát 200 MB chỉ làm RSS nhích 3 MB',
            ),
            B(
              'No leak. V8 does not return freed pages to the operating system, so <b>RSS is a high-water mark and a graph that rises and never falls is the normal healthy shape</b>. And <code>allocUnsafe</code> only reserves address space — pages become resident when they are <em>touched</em>, which is why <code>fill(1)</code> moved RSS by 200 MB with no allocation at all. <code>external</code> reports what you asked for; RSS reports what you are actually using, and the OOM killer counts the second',
              'Không rò rỉ gì. V8 không trả các trang đã giải phóng về cho hệ điều hành, nên <b>RSS là một mốc nước cao nhất và một biểu đồ trèo lên rồi không bao giờ tụt xuống chính là hình dạng KHOẺ MẠNH bình thường</b>. Còn <code>allocUnsafe</code> chỉ đặt trước không gian địa chỉ — các trang trở thành thường trú khi bị CHẠM VÀO, và đó là lý do <code>fill(1)</code> làm RSS nhích 200 MB mà chẳng cấp phát thêm gì. <code>external</code> báo cái bạn ĐÃ XIN; RSS báo cái bạn ĐANG THẬT SỰ DÙNG, và bộ giết-vì-hết-bộ-nhớ đếm cái thứ hai',
            ),
            B(
              'It is a leak only if <code>heapTotal</code> also stayed elevated, and here it dropped from 101 to 38 MB, so V8 released the reservation and the residual RSS is the process\'s own code and stacks rather than data',
              'Chỉ là rò rỉ nếu <code>heapTotal</code> cũng ở nguyên mức cao, mà ở đây nó đã tụt từ 101 xuống 38 MB, nên V8 đã trả lại phần đặt trước và phần RSS còn lại là mã và stack của chính tiến trình chứ không phải dữ liệu',
            ),
            B(
              'The numbers are inconsistent and cannot be read at all: <code>heapUsed</code> of 4 MB with an RSS of 343 MB means the process is reporting from two different memory accountings, which happens when <code>--expose-gc</code> perturbs the allocator',
              'Các con số mâu thuẫn nhau và hoàn toàn không đọc được: <code>heapUsed</code> 4 MB đi cùng RSS 343 MB nghĩa là tiến trình đang báo cáo từ hai hệ kế toán bộ nhớ khác nhau, chuyện xảy ra khi <code>--expose-gc</code> làm nhiễu bộ cấp phát',
            ),
          ],
          correct: 1,
          explanation: EX(
            '"Memory is climbing" is the vaguest possible incident report because Node reports five numbers that mean genuinely different things, and two of the counter-intuitive results are in this table. The heap recovered <em>perfectly</em> — 4 → 75 → 4 MB — while RSS went 43 → 150 → 140, which is not a leak but V8 keeping pages it may want again. That is why "RSS increased since yesterday" is a useless alert: it is always true. The real leak signature is the rising <b>bottom</b> of the <code>heapUsed</code> sawtooth over hours, which is what an unbounded module-level <code>Map</code> used as a cache produces — the most common Node leak in a codebase this size, and one that survives review because nobody forgot to free anything. The Buffer rows separate two more things that get conflated: <code>external</code> jumped to 202 MB immediately while RSS moved 3, and then writing to already-allocated memory moved RSS by 200 MB. The alert that maps to a consequence is <code>rss / container_memory_limit &gt; 0.85</code>, because crossing 1.0 is an OOM kill.',
            '"Bộ nhớ đang trèo lên" là bản báo sự cố mơ hồ nhất có thể, vì Node báo NĂM con số mang nghĩa thật sự khác nhau, và hai trong số các kết quả phản trực giác nằm ngay trong bảng này. Heap đã hồi phục HOÀN HẢO — 4 → 75 → 4 MB — trong khi RSS đi 43 → 150 → 140, đó không phải rò rỉ mà là V8 giữ lại các trang mà nó có thể còn cần. Đó là lý do "RSS hôm nay cao hơn hôm qua" là một cảnh báo vô dụng: nó luôn đúng. Chữ ký rò rỉ thật là cái ĐÁY của hình răng cưa <code>heapUsed</code> dâng lên qua nhiều giờ, thứ mà một <code>Map</code> không chặn ở phạm vi module dùng làm bộ đệm sinh ra — cú rò rỉ Node phổ biến nhất trong một kho cỡ này, và là cú sống sót qua khâu rà mã vì chẳng ai quên giải phóng cái gì cả. Hai hàng Buffer tách thêm hai thứ hay bị lẫn: <code>external</code> vọt lên 202 MB ngay lập tức trong khi RSS chỉ nhích 3, rồi việc GHI vào phần bộ nhớ đã cấp phát làm RSS nhích 200 MB. Cảnh báo ứng với một hệ quả thật là <code>rss / hạn_mức_bộ_nhớ_container &gt; 0,85</code>, vì vượt 1,0 là một cú giết vì hết bộ nhớ.',
          ),
        }),

        // q24 · đáp án 3
        mcq({
          prompt: B(
            'Major GC time on your service has been rising steadily for a week: 16 pauses averaging 7.96 ms, worst 16.3 ms, and climbing. <b>What is the right response?</b>',
            'Thời gian major GC trên dịch vụ của bạn tăng đều suốt một tuần: 16 lần dừng trung bình 7,96 ms, tệ nhất 16,3 ms, và đang trèo lên. <b>Phản ứng đúng là gì?</b>',
          ),
          options: [
            B(
              'Raise <code>--max-old-space-size</code> so V8 has more headroom before it must collect, which spaces the major collections further apart and trades a larger resident footprint for fewer pauses on the request path; this is also the documented fix for a container whose limit is smaller than the heap V8 sized itself from the host\'s memory',
              'Nâng <code>--max-old-space-size</code> để V8 có nhiều chỗ dư hơn trước khi buộc phải thu gom, việc đó giãn các lượt major GC ra xa nhau hơn và đánh đổi dung lượng thường trú lớn hơn lấy ít lần dừng hơn trên đường đi của request; đây cũng là cách chữa có tài liệu cho một container mà hạn mức nhỏ hơn cái heap mà V8 tự tính theo bộ nhớ của máy chủ',
            ),
            B(
              'Call <code>global.gc()</code> on a timer during off-peak minutes so the cost is paid at a moment you choose rather than in the middle of a user\'s request, which flattens the p99 by moving the pause out of the request path; combine it with a short traffic drain and the collection becomes invisible to callers entirely',
              'Gọi <code>global.gc()</code> theo bộ đếm giờ vào những phút vắng khách để cái giá được trả vào lúc bạn chọn thay vì giữa request của một người dùng, việc đó làm phẳng p99 bằng cách dời lần dừng ra khỏi đường đi của request; kết hợp với một lượt rút lưu lượng ngắn thì lần thu gom trở nên hoàn toàn vô hình với bên gọi',
            ),
            B(
              'Reduce allocation, since garbage-collection cost scales with the number of objects created and a service that allocates less therefore collects less; the highest-yield changes are object pooling in hot paths and reusing parsed request bodies instead of building a fresh object graph on every call',
              'Giảm cấp phát, vì chi phí thu gom rác tỉ lệ với số object được tạo ra nên một dịch vụ cấp phát ít hơn sẽ thu gom ít hơn; những thay đổi hiệu quả nhất là dùng bể object ở các đường nóng và tái sử dụng thân request đã phân giải thay vì dựng một đồ thị object mới ở mỗi lời gọi',
            ),
            B(
              'Go and find what is being <b>retained</b>. Collection cost scales with <em>survivors</em>, not with garbage — a service that allocates a million short-lived objects is nearly free, while keeping a million alive means every major GC must walk all of them. So rising major-GC time almost always means the live set is growing, which is the heap leak wearing a different costume. Raising the heap limit is specifically harmful: it delays the OOM kill while making each pause longer',
              'Đi tìm xem cái gì đang bị <b>GIỮ LẠI</b>. Chi phí thu gom tỉ lệ với SỐ SỐNG SÓT, không phải với lượng rác — một dịch vụ cấp phát một triệu object sống ngắn thì gần như miễn phí, còn GIỮ một triệu object sống nghĩa là mỗi lượt major GC phải duyệt hết chúng. Nên thời gian major GC tăng gần như luôn nghĩa là tập sống đang lớn lên, tức chính cú rò rỉ heap khoác bộ đồ khác. Nâng hạn mức heap thì có hại cụ thể: nó làm chậm cú giết vì hết bộ nhớ trong khi kéo dài mỗi lần dừng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'V8 splits the heap by age because most objects die young. New space is collected by <em>scavenge</em>, whose cost is proportional to the survivors rather than to the garbage — so allocating heavily and letting it all die is cheap, and it is the reason "reduce allocation" (option 3) is the wrong lever. Old space is collected by mark-sweep, which walks every reachable object, so its cost is proportional to the size of the <em>live</em> heap. That single fact makes rising major-GC time a pointer rather than a problem: it is telling you the live set is growing, and the thing to fix is whatever is holding references. Option 1 is the harmful one, because it does not just fail to help — a larger heap makes every subsequent major GC walk more, so pauses lengthen and the eventual failure arrives later and hurts more. And there is a free cross-check available: a GC pause <em>is</em> event-loop lag, because the loop is frozen. If p99 lag spikes at the same timestamps as your GC duration metric, you have found the cause without opening a profiler.',
            'V8 chia heap theo TUỔI vì phần lớn object chết trẻ. Vùng mới được thu bằng SCAVENGE, mà chi phí tỉ lệ với số SỐNG SÓT chứ không phải với lượng rác — nên cấp phát ào ạt rồi để chúng chết hết thì rẻ, và đó là lý do "giảm cấp phát" (phương án 3) là cần gạt sai. Vùng cũ được thu bằng mark-sweep, thứ duyệt qua mọi object còn với tới được, nên chi phí của nó tỉ lệ với KÍCH THƯỚC TẬP SỐNG. Riêng dữ kiện đó biến thời gian major GC tăng lên thành một MŨI CHỈ chứ không phải một vấn đề: nó đang nói cho bạn biết tập sống đang lớn, và thứ cần sửa là cái gì đang giữ tham chiếu. Phương án 1 mới là cái có hại, vì nó không chỉ vô ích — một heap lớn hơn bắt mọi lượt major GC sau đó phải duyệt nhiều hơn, nên các lần dừng dài ra và cú hỏng cuối cùng tới muộn hơn và đau hơn. Và có sẵn một phép đối chiếu miễn phí: một lần dừng GC CHÍNH LÀ độ trễ vòng lặp, vì vòng lặp đang đóng băng. Nếu p99 độ trễ vọt lên đúng những mốc thời gian mà chỉ số thời lượng GC vọt lên, bạn đã tìm ra nguyên nhân mà không cần mở profiler.',
          ),
        }),

        // q25 · đáp án 0
        mcq({
          prompt: B(
            'Request latency is 4 seconds. Event-loop lag is normal. Process CPU is low. Postgres CPU is low and <code>pg_stat_activity</code> is nearly empty. <b>What is happening, and which metric proves it?</b>',
            'Độ trễ request là 4 giây. Độ trễ vòng lặp sự kiện bình thường. CPU tiến trình thấp. CPU Postgres thấp và <code>pg_stat_activity</code> gần như trống. <b>Chuyện gì đang xảy ra, và chỉ số nào chứng minh được?</b>',
          ),
          options: [
            B(
              'Requests are queueing for a free connection. Every visible symptom says "the database is slow", but the database is idle — because the queue is in <em>your</em> pool, before any query has started. Prisma\'s default is <code>num_cpus × 2 + 1</code>, so nine connections on a 4-core box while Postgres allows a hundred. The <b>waiting</b> gauge is the only metric that distinguishes this from a slow database; <code>busy</code> alone cannot tell "perfectly utilised" from "everyone is queueing"',
              'Các request đang xếp hàng chờ một kết nối rảnh. Mọi triệu chứng nhìn thấy được đều nói "cơ sở dữ liệu chậm", nhưng cơ sở dữ liệu đang rảnh — vì hàng đợi nằm trong BỂ CỦA BẠN, trước khi có truy vấn nào bắt đầu. Mặc định của Prisma là <code>num_cpus × 2 + 1</code>, tức chín kết nối trên một máy 4 nhân trong khi Postgres cho phép một trăm. Cái gauge <b>waiting</b> là chỉ số DUY NHẤT phân biệt được chuyện này với một cơ sở dữ liệu chậm; riêng <code>busy</code> thì không tách nổi "dùng hết công suất hoàn hảo" khỏi "tất cả đang xếp hàng"',
            ),
            B(
              'A query is missing an index. The database CPU is low precisely because a sequential scan is I/O-bound rather than CPU-bound, and <code>pg_stat_activity</code> looks nearly empty because a scan waiting on storage is reported under a different wait event that the default view does not surface; confirm with <code>EXPLAIN ANALYZE</code> on the slowest route and add the index it names',
              'Một truy vấn thiếu chỉ mục. CPU của cơ sở dữ liệu thấp chính vì một lượt quét tuần tự bị chặn bởi I/O chứ không phải CPU, và <code>pg_stat_activity</code> trông gần như trống vì một lượt quét đang chờ ổ đĩa được báo dưới một sự kiện chờ khác mà khung nhìn mặc định không hiện ra; hãy xác nhận bằng <code>EXPLAIN ANALYZE</code> trên route chậm nhất rồi thêm đúng cái chỉ mục nó nêu tên',
            ),
            B(
              'A garbage-collection pause is blocking every request, which is why CPU looks low — the thread is frozen rather than working — and the database is idle because nothing is being sent to it during the pause',
              'Một lần dừng thu gom rác đang chặn mọi request, và đó là lý do CPU trông thấp — luồng đang đóng băng chứ không làm việc — còn cơ sở dữ liệu rảnh vì trong lúc dừng chẳng có gì được gửi tới nó',
            ),
            B(
              'The network between the backend and the Postgres container has degraded, so each round trip takes seconds; both processes are idle because both are blocked waiting on sockets that are slow rather than busy',
              'Mạng giữa backend và container Postgres đã xuống cấp, nên mỗi lượt đi-về mất vài giây; cả hai tiến trình đều rảnh vì cả hai đều bị chặn chờ trên những socket chậm chứ không phải bận',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Pool exhaustion is the most confusing incident shape in this course because its signature points exactly the wrong way. Latency high, event loop idle, CPU low — three symptoms that all match "slow database", so the natural response is to optimise queries or add an index, which changes nothing because the queries were never the problem. The two symptoms that <em>do not</em> match are Postgres being idle and <code>pg_stat_activity</code> being nearly empty, and you only look at those if you already suspect the pool. Worse, the feedback is inverted: a genuinely slow query holds its connection longer, so <b>one slow route makes the pool wait spike for every <em>other</em> route</b>, and the dashboard shows a whole service degrading at once with no single cause. Option 3 is eliminated by the transcript itself — a GC pause <em>is</em> event-loop lag, and the lag is normal. The reason to raise <code>connection_limit</code> is burstiness rather than throughput, and it comes with arithmetic you must write down: the per-instance limit, times instances, plus workers, has to stay well under <code>max_connections</code>.',
            'Cạn bể kết nối là hình dạng sự cố gây rối nhất trong khoá này vì chữ ký của nó chỉ đúng vào hướng ngược lại. Độ trễ cao, vòng lặp rảnh, CPU thấp — ba triệu chứng đều khớp với "cơ sở dữ liệu chậm", nên phản ứng tự nhiên là đi tối ưu truy vấn hoặc thêm chỉ mục, và điều đó chẳng đổi được gì vì truy vấn chưa từng là vấn đề. Hai triệu chứng KHÔNG khớp là Postgres đang rảnh và <code>pg_stat_activity</code> gần như trống, mà bạn chỉ nhìn tới chúng nếu đã sẵn nghi cái bể. Tệ hơn, phản hồi bị đảo ngược: một truy vấn chậm thật sự giữ kết nối của nó lâu hơn, nên <b>MỘT route chậm làm thời gian chờ bể vọt lên cho MỌI route KHÁC</b>, và bảng theo dõi hiện ra cả một dịch vụ cùng lúc xuống cấp mà không thấy nguyên nhân đơn lẻ nào. Phương án 3 bị chính đoạn mô tả loại bỏ — một lần dừng GC CHÍNH LÀ độ trễ vòng lặp, mà độ trễ thì bình thường. Lý do để nâng <code>connection_limit</code> là ĐỘ DỒN CỤC chứ không phải thông lượng, và nó đi kèm một phép tính bạn phải viết ra: hạn mức mỗi thực thể, nhân số thực thể, cộng các worker, phải nằm thoải mái dưới <code>max_connections</code>.',
          ),
        }),

        /* ── Chương 6 — trace (5 câu) ────────────────────────────────────── */

        // q26 · đáp án 2
        mcq({
          prompt: B(
            'A waterfall shows the root span at 3,912 ms and a child <code>embed.generate</code> at 3,890 ms containing one grandchild <code>POST modelapi.vn</code> at 3,889 ms. <b>Sorting by duration puts the root first every time. What should you sort by, and what does the nesting tell you that a list of timestamps could not?</b>',
            'Một biểu đồ thác cho thấy span gốc 3.912 ms và một span con <code>embed.generate</code> 3.890 ms chứa một span cháu <code>POST modelapi.vn</code> 3.889 ms. <b>Sắp theo thời lượng thì span gốc luôn đứng đầu. Bạn nên sắp theo cái gì, và cấu trúc lồng nhau nói cho bạn điều gì mà một danh sách dấu thời gian không nói được?</b>',
          ),
          options: [
            B(
              'Sort by start time, because the first span to begin is by construction the one that caused everything after it, and a waterfall drawn in start order already encodes causality; the nesting is then only a visual convenience and adds nothing that the ordering has not already given you',
              'Sắp theo thời điểm bắt đầu, vì span khởi động đầu tiên theo cấu trúc chính là cái gây ra mọi thứ sau nó, và một biểu đồ thác vẽ theo thứ tự bắt đầu vốn đã mã hoá sẵn quan hệ nhân quả; cấu trúc lồng nhau khi đó chỉ là tiện lợi về mặt nhìn và không thêm gì mà thứ tự chưa cho bạn',
            ),
            B(
              'Sort by span count per name, because a slow trace is nearly always a repeated call rather than a single long one — the N+1 staircase is the commonest performance bug there is — so frequency is the signal and duration is the distraction; here that would put <code>POST modelapi.vn</code> and <code>embed.generate</code> level with each other at one occurrence apiece',
              'Sắp theo số span cho mỗi tên, vì một trace chậm gần như luôn là một lời gọi LẶP LẠI chứ không phải một lời gọi dài đơn lẻ — cầu thang N+1 là lỗi hiệu năng phổ biến nhất — nên tần suất mới là tín hiệu còn thời lượng là thứ gây phân tâm; ở đây làm vậy sẽ đặt <code>POST modelapi.vn</code> và <code>embed.generate</code> ngang nhau với mỗi cái một lần xuất hiện',
            ),
            B(
              'Sort by <b>self time</b> — duration minus the time covered by children — because a parent\'s duration is by definition at least the critical path beneath it, so the root is always the longest bar and is never the answer. The nesting says the gateway call is a <em>child</em> of <code>embed.generate</code>, which means that span is not slow, it is <em>waiting</em>: fixing it means changing when embedding runs, not making the function faster',
              'Sắp theo <b>thời gian riêng</b> — thời lượng trừ đi phần thời gian các span con đã chiếm — vì thời lượng của một span cha theo định nghĩa ít nhất bằng đường tới hạn nằm dưới nó, nên span gốc luôn là thanh dài nhất và không bao giờ là đáp án. Cấu trúc lồng nhau nói rằng lời gọi cổng là CON của <code>embed.generate</code>, nghĩa là span đó không CHẬM, nó đang ĐỢI: sửa nó nghĩa là đổi thời điểm chạy embedding, chứ không phải làm cho hàm ấy nhanh hơn',
            ),
            B(
              'Sort by the number of attributes, since a well-instrumented span carries far more context than an auto-generated stub and the informative spans are the ones worth reading first during an incident; a span with <code>db.statement</code> and a row count tells you more in one line than a bare HTTP span ever will, regardless of how long either one ran',
              'Sắp theo số lượng thuộc tính, vì một span được đo đạc tốt mang nhiều ngữ cảnh hơn hẳn một span sinh tự động sơ sài và những span giàu thông tin mới là những cái đáng đọc trước trong một sự cố; một span có <code>db.statement</code> kèm số dòng nói cho bạn nhiều hơn trong một dòng so với một span HTTP trơ, bất kể cái nào chạy lâu hơn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Correlated logs give you a list ordered by time; a trace adds the one field that turns a list into a tree — <code>parentSpanId</code> — and the tree is where the answer lives. From a list you can see <em>when</em> things happened but not whether the notes query ran before the gateway call or alongside it, nor whether a four-second gap belongs to the query, the gateway or something with no log line at all. Reading a waterfall naively is what produces the classic wasted hour: the root is 3,912 ms, so the HTTP handler looks like the problem, and someone starts reading the request handler. Self time answers it in one glance. The same trap has a sharper edge with parallel children — five 1-second queries under a 1.1-second parent sum to five seconds of child time inside 1.1 seconds of wall clock, so a naive "sum the children" check reports a negative self time and some tools display that as zero rather than as the parallelism it is. And here the nesting also dictates the remedy: a leaf with no siblings running alongside it is a candidate for a queue, because moving it off the request path recovers the entire 3.9 seconds.',
            'Log đã nối được cho bạn một DANH SÁCH sắp theo thời gian; một trace thêm vào đúng cái trường biến danh sách thành CÂY — <code>parentSpanId</code> — và cái cây mới là nơi câu trả lời nằm. Từ một danh sách bạn thấy được KHI NÀO mọi thứ xảy ra nhưng không thấy được truy vấn ghi chú chạy TRƯỚC lời gọi cổng hay chạy SONG SONG với nó, cũng không thấy được một khoảng trống bốn giây thuộc về truy vấn, thuộc về cổng, hay thuộc về một thứ chẳng có dòng log nào. Đọc một biểu đồ thác một cách ngây thơ chính là thứ sinh ra cái giờ đồng hồ phí phạm kinh điển: span gốc 3.912 ms, nên cái handler HTTP trông như thủ phạm, và có người bắt đầu đọc handler ấy. Thời gian riêng trả lời trong một cái liếc. Cái bẫy đó còn sắc hơn với các span con SONG SONG — năm truy vấn mỗi cái 1 giây nằm dưới một span cha 1,1 giây cộng lại thành năm giây thời gian con bên trong 1,1 giây đồng hồ tường, nên một phép kiểm ngây thơ "cộng các con lại" báo ra thời gian riêng ÂM và vài công cụ hiển thị nó thành không thay vì thành tính song song. Và ở đây cấu trúc lồng nhau còn quy định luôn cách chữa: một lá không có anh em nào chạy cùng là ứng viên cho một hàng đợi, vì đẩy nó ra khỏi đường request là lấy lại được trọn 3,9 giây.',
          ),
        }),

        // q27 · đáp án 1
        mcq({
          prompt: B(
            'A team adds ' + c("import './tracing.js';") + ' as the <em>first</em> line of <code>index.ts</code>, above ' + c("import express from 'express';") + '. The SDK starts, no error appears, and Express spans never show up. <b>Why, and what fixes it?</b>',
            'Một đội thêm ' + c("import './tracing.js';") + ' làm dòng ĐẦU TIÊN của <code>index.ts</code>, phía trên ' + c("import express from 'express';") + '. SDK khởi động, không lỗi nào hiện ra, và các span của Express không bao giờ xuất hiện. <b>Vì sao, và cái gì chữa được?</b>',
          ),
          options: [
            B(
              'Because the SDK needs a collector endpoint before it can register instrumentations, and without <code>OTEL_EXPORTER_OTLP_ENDPOINT</code> it silently starts in a no-op mode; setting the variable makes the spans appear',
              'Vì SDK cần một endpoint collector trước khi đăng ký được các bộ đo đạc, và khi không có <code>OTEL_EXPORTER_OTLP_ENDPOINT</code> thì nó âm thầm khởi động ở chế độ không-làm-gì; đặt biến đó vào là các span xuất hiện',
            ),
            B(
              'Because auto-instrumentation works by patching modules <em>as they load</em>, and ESM hoists every <code>import</code> before executing any module body — so <code>express</code> is resolved and cached before <code>tracing.js</code> ever runs, and a module already in the cache is never re-wrapped. Start it in an earlier phase with ' + c('node --import ./dist/tracing.js dist/index.js') + ', which is the entire reason that flag exists',
              'Vì tự-đo-đạc hoạt động bằng cách VÁ CÁC MODULE NGAY LÚC CHÚNG ĐƯỢC NẠP, mà ESM CẨU mọi lệnh <code>import</code> lên trước khi thực thi thân của bất kỳ module nào — nên <code>express</code> được phân giải và đưa vào bộ đệm TRƯỚC khi <code>tracing.js</code> kịp chạy, và một module đã nằm trong bộ đệm thì không bao giờ được bọc lại. Hãy khởi động nó ở một pha sớm hơn bằng ' + c('node --import ./dist/tracing.js dist/index.js') + ', đó là toàn bộ lý do cái cờ ấy tồn tại',
            ),
            B(
              'Because Express is not in the <code>auto-instrumentations-node</code> metapackage and needs <code>@opentelemetry/instrumentation-express</code> installed separately; the import order is a red herring',
              'Vì Express không nằm trong gói tổng hợp <code>auto-instrumentations-node</code> và cần cài riêng <code>@opentelemetry/instrumentation-express</code>; thứ tự import chỉ là cá trích đỏ đánh lạc hướng',
            ),
            B(
              'Because <code>sdk.start()</code> is asynchronous and the module body returns before registration completes, so the fix is to await it — <code>await sdk.start()</code> at the top level of <code>tracing.js</code>',
              'Vì <code>sdk.start()</code> là bất đồng bộ và thân module trả về trước khi việc đăng ký hoàn tất, nên cách chữa là chờ nó — <code>await sdk.start()</code> ở cấp cao nhất của <code>tracing.js</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The selling point of OpenTelemetry is a full trace without writing spans, and understanding <em>how</em> it does that explains every way the setup goes wrong. It registers a hook in Node&#39;s module loader, intercepts each module before your code receives it, wraps the functions it knows about, and hands you the wrapped version — so <code>http.request</code> becomes a traced <code>http.request</code> with no change to your code. The consequence is that <b>initialisation order is not a style preference</b>: only modules loaded <em>after</em> the hook is installed can be patched, and one already in the require cache is never revisited. ESM defeats the obvious fix because hoisting is a language rule, not an ordering convention — both imports are resolved before either module body executes, and <code>tracing.js</code> appearing first in the file changes nothing. What makes this so expensive is the failure mode: nothing errors, the SDK reports itself as started, some spans do appear (the ones from modules loaded later), and the trace looks merely sparse rather than broken. If you cannot use the flag, the CommonJS equivalent is <code>node --require</code>, which is what the measurements for this exam used.',
            'Điểm bán hàng của OpenTelemetry là có trace đầy đủ mà không phải viết span nào, và hiểu được nó làm thế NÀO giải thích mọi cách bộ thiết lập hỏng. Nó đăng ký một cái móc vào bộ nạp module của Node, chộp lấy từng module trước khi mã của bạn nhận được, bọc những hàm nó biết, rồi trao cho bạn bản đã bọc — nên <code>http.request</code> thành một <code>http.request</code> có trace mà mã của bạn không đổi gì. Hệ quả là <b>thứ tự khởi tạo không phải một sở thích về phong cách</b>: chỉ những module được nạp SAU khi cái móc được cài mới vá được, còn một module đã nằm trong bộ đệm require thì không bao giờ được ghé lại. ESM vô hiệu hoá cách chữa hiển nhiên vì việc CẨU là một luật của ngôn ngữ, không phải một quy ước về thứ tự — cả hai lệnh import đều được phân giải trước khi thân của module nào kịp chạy, và việc <code>tracing.js</code> đứng trước trong file chẳng thay đổi gì. Thứ làm chuyện này đắt đỏ là kiểu hỏng: không lỗi nào cả, SDK tự báo là đã khởi động, một số span VẪN xuất hiện (những cái từ module nạp sau), và cái trace trông chỉ THƯA chứ không trông như hỏng. Nếu không dùng được cái cờ đó, bản tương đương cho CommonJS là <code>node --require</code>, đúng thứ mà các phép đo của đề này đã dùng.',
          ),
        }),

        // q28 · đáp án 3
        mcq({
          prompt: B(
            'Real extraction test against the OpenTelemetry propagator (API 1.9.1). Four inbound <code>traceparent</code> headers, each differing from a valid one in exactly one way. <b>Which set is <em>accepted</em>?</b>' +
            code(
              'A  00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n' +
              'B  ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n' +
              'C  00-00000000000000000000000000000000-00f067aa0ba902b7-01\n' +
              'D  00-4BF92F3577B34DA6A3CE929D0E0E4736-00f067aa0ba902b7-01'),
            'Phép thử bóc tách thật đối với bộ truyền ngữ cảnh của OpenTelemetry (API 1.9.1). Bốn header <code>traceparent</code> đến, mỗi cái khác một header hợp lệ đúng một điểm. <b>Bộ nào được CHẤP NHẬN?</b>' +
            code(
              'A  00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n' +
              'B  ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n' +
              'C  00-00000000000000000000000000000000-00f067aa0ba902b7-01\n' +
              'D  00-4BF92F3577B34DA6A3CE929D0E0E4736-00f067aa0ba902b7-01'),
          ),
          options: [
            B(
              'A and D. Hexadecimal is case-insensitive by definition, so the propagator lower-cases the trace-id before comparing; B and C are rejected because <code>ff</code> is reserved and an all-zero trace-id is the "invalid" sentinel',
              'A và D. Hệ mười sáu vốn không phân biệt hoa thường, nên bộ truyền ngữ cảnh hạ chữ trace-id trước khi so; B và C bị từ chối vì <code>ff</code> là giá trị dành riêng và một trace-id toàn số không là giá trị canh gác cho "không hợp lệ"',
            ),
            B(
              'A, C and D. Only <code>ff</code> is rejected, because it is the one value the specification reserves; an all-zero trace-id is unusual but legal, and case is normalised on extraction',
              'A, C và D. Chỉ mỗi <code>ff</code> bị từ chối, vì đó là giá trị duy nhất mà đặc tả dành riêng; một trace-id toàn số không thì bất thường nhưng hợp lệ, còn chữ hoa thường được chuẩn hoá lúc bóc tách',
            ),
            B(
              'All four. A malformed <code>traceparent</code> is repaired where it can be and passed through otherwise, because dropping a trace loses more than accepting a slightly odd one, and the receiving service has no way to know which is which',
              'Cả bốn. Một <code>traceparent</code> hỏng khuôn được sửa ở chỗ sửa được và cho đi qua ở những chỗ khác, vì vứt một trace đi thì mất nhiều hơn là chấp nhận một cái hơi lạ, và dịch vụ nhận cũng chẳng có cách nào biết cái nào ra cái nào',
            ),
            B(
              '<b>Only A.</b> All three of the others were rejected outright in the measurement — <code>trace.getSpanContext()</code> returned undefined — so the receiver starts a fresh trace, which is what the specification requires. The rules are strict on purpose: version <code>ff</code> is forbidden, an all-zero trace-id is invalid, and the hex must be <b>lowercase</b>. Accepting a partially-valid header would produce ids that look right and join nothing',
              '<b>Chỉ mỗi A.</b> Cả ba cái còn lại đều bị từ chối thẳng trong phép đo — <code>trace.getSpanContext()</code> trả về undefined — nên bên nhận khởi tạo một trace mới, đúng như đặc tả yêu cầu. Các luật nghiêm ngặt là có chủ ý: phiên bản <code>ff</code> bị cấm, một trace-id toàn số không là không hợp lệ, và phần hex phải là <b>CHỮ THƯỜNG</b>. Chấp nhận một header hợp lệ một nửa sẽ sinh ra những id trông thì đúng mà chẳng nối được với gì',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, not remembered — which is the point of the question, because "hex is case-insensitive" is a reasonable belief that happens to be wrong here. The W3C grammar specifies lowercase hex, and the OpenTelemetry propagator implements the grammar literally: <code>4BF92F...</code> does not match, so the header is treated as absent and a fresh trace begins. The same happened to version <code>ff</code> (reserved and forbidden) and to the all-zero trace-id (the invalid sentinel). That rigidity is exactly what makes the header useful across a proxy written in Go, a Java service and Cloudflare&#39;s edge without configuration or negotiation. And the specified recovery is the right one: a malformed value must be treated as absent, because generating a fresh trace loses the link to the caller <em>visibly</em>, while accepting a half-valid one produces a trace-id that looks like a join key and joins nothing — the same "confidently wrong evidence" failure as the module-level request id in chapter 3. The practical rule when you parse it yourself: validate the shape with a strict regex, and on any mismatch generate rather than repair.',
            'Đo được chứ không nhớ ra — và đó chính là điểm của câu hỏi, vì "hệ mười sáu không phân biệt hoa thường" là một niềm tin hợp lý mà tình cờ lại sai ở đây. Ngữ pháp của W3C quy định hex CHỮ THƯỜNG, và bộ truyền ngữ cảnh của OpenTelemetry cài đặt ngữ pháp ấy theo đúng nghĩa đen: <code>4BF92F...</code> không khớp, nên header bị coi như VẮNG MẶT và một trace mới bắt đầu. Điều tương tự xảy ra với phiên bản <code>ff</code> (dành riêng và bị cấm) và với trace-id toàn số không (giá trị canh gác cho "không hợp lệ"). Chính sự cứng nhắc ấy làm cái header này dùng được xuyên qua một proxy viết bằng Go, một dịch vụ Java và biên của Cloudflare mà không cần cấu hình hay thương lượng gì. Và cách phục hồi được quy định là cách đúng: một giá trị hỏng khuôn PHẢI bị coi như vắng mặt, vì sinh một trace mới làm mất liên kết tới bên gọi một cách NHÌN THẤY ĐƯỢC, còn chấp nhận một cái hợp lệ một nửa thì sinh ra một trace-id trông như khoá nối mà chẳng nối được gì — đúng kiểu hỏng "bằng chứng sai một cách tự tin" của cái request id ở phạm vi module trong chương 3. Luật thực dụng khi bạn tự phân giải nó: kiểm hình dạng bằng một regex nghiêm, và hễ không khớp thì SINH MỚI chứ đừng sửa chữa.',
          ),
        }),

        // q29 · đáp án 0
        mcq({
          prompt: B(
            'At 1% head sampling, how many times must a bug occur before you are 95% likely to hold a trace of it — and why does that number matter more than the storage saving?',
            'Ở mức lấy mẫu đầu 1%, một cái lỗi phải xảy ra bao nhiêu lần trước khi bạn có 95% khả năng giữ được một trace của nó — và vì sao con số đó quan trọng hơn phần dung lượng tiết kiệm được?',
          ),
          options: [
            B(
              '<b>299</b> — from <code>log(0.05) / log(0.99)</code>. So a bug hitting ten users a day is invisible in your traces for a month, and the one user who reports theirs had a 1% chance of being kept, which means "can you look up my request?" is answered <em>no</em> ninety-nine times out of a hundred. Head sampling discards precisely the rare failures tracing was adopted to find; a 5% error rate survives any rate, and you never needed a trace to notice a 5% error rate',
              '<b>299</b> — theo <code>log(0,05) / log(0,99)</code>. Nên một cái lỗi đánh trúng mười người dùng mỗi ngày sẽ vô hình trong trace của bạn suốt một tháng, và cái người dùng duy nhất báo lại có 1% cơ hội được giữ, nghĩa là câu "tra giúp tôi cái request đó được không?" bị trả lời KHÔNG chín mươi chín lần trên một trăm. Lấy mẫu đầu vứt đi đúng những cú hỏng hiếm mà người ta chọn dùng trace để tìm; một tỉ lệ lỗi 5% thì sống sót ở mọi tỉ lệ lấy mẫu, mà bạn có bao giờ cần một trace để nhận ra tỉ lệ lỗi 5% đâu',
            ),
            B(
              'About <b>10</b>, because sampling is applied per <em>trace</em> and a bug that recurs within the same user session reuses the trace-id, so the effective rate for a repeating bug is far higher than the nominal one',
              'Khoảng <b>10</b>, vì việc lấy mẫu được áp theo từng TRACE và một cái lỗi tái diễn trong cùng một phiên người dùng thì dùng lại trace-id, nên tỉ lệ hiệu dụng cho một lỗi lặp lại cao hơn nhiều so với tỉ lệ danh nghĩa',
            ),
            B(
              'Exactly <b>100</b>, since 1/0.01 = 100 and the expected number of trials before the first success in a Bernoulli process is the reciprocal of the probability; at that point you hold one trace on average, which is all a single investigation needs, so 1% is a sound default for any service under a thousand requests per second',
              'Đúng <b>100</b>, vì 1/0,01 = 100 và số phép thử kỳ vọng trước lần thành công đầu tiên trong một quá trình Bernoulli là nghịch đảo của xác suất; tới lúc đó bạn giữ được trung bình một trace, đúng bằng thứ một cuộc điều tra đơn lẻ cần, nên 1% là một mặc định lành mạnh cho mọi dịch vụ dưới một nghìn request mỗi giây',
            ),
            B(
              '<b>Once</b> — sampling decisions are made per user rather than per request, so a user whose first request was sampled has all of their subsequent requests sampled too, which is why per-user debugging still works at 1%',
              '<b>Một lần</b> — quyết định lấy mẫu được ra theo từng NGƯỜI DÙNG chứ không theo từng request, nên một người dùng có request đầu tiên được lấy mẫu thì mọi request sau của họ cũng được lấy mẫu, và đó là lý do việc gỡ lỗi theo người dùng vẫn chạy được ở mức 1%',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Option 3 is the intuitive answer and it answers a different question: 100 is the <em>expected</em> number of occurrences before the first hit, which means you have roughly a 63% chance by then. Getting to 95% confidence takes three times as many. The arithmetic matters because it converts a rate chosen from a blog post into a statement about what you can and cannot investigate — and the answer is that head sampling is systematically biased against exactly the failures worth finding, since it decides <em>before</em> it knows whether anything interesting happened. Tail sampling inverts that: buffer the spans, decide when the trace is complete, keep 100% of errors and 100% of slow requests plus a 1% baseline. At 50 rps with a 1% error rate that is about 91,000 traces a day against 4.32 million, so you keep everything that matters for roughly 2% of the volume. The cost is real and bounded — the collector holds <code>decision_wait × throughput</code> worth of spans in memory — and it comes with one hard requirement: every span of a trace must reach the <em>same</em> collector instance, or each one sees a fragment, decides independently, and stores a "trace" of one span with no parent.',
            'Phương án 3 là câu trả lời theo trực giác và nó trả lời một câu hỏi khác: 100 là số lần xảy ra KỲ VỌNG trước cú trúng đầu tiên, nghĩa là tới lúc đó bạn mới có khoảng 63% cơ hội. Để đạt độ tin cậy 95% thì cần gấp ba lần thế. Phép tính ấy đáng kể vì nó biến một tỉ lệ chép từ một bài blog thành một phát biểu về việc bạn điều tra được cái gì và không điều tra được cái gì — và câu trả lời là lấy mẫu đầu thiên lệch một cách có hệ thống chống lại đúng những cú hỏng đáng tìm, vì nó quyết định TRƯỚC khi biết có chuyện gì đáng chú ý xảy ra hay không. Lấy mẫu đuôi lật ngược điều đó: đệm các span lại, quyết định khi trace đã hoàn tất, giữ 100% số lỗi và 100% số request chậm cộng một nền 1%. Ở 50 rps với tỉ lệ lỗi 1% thì đó là khoảng 91.000 trace mỗi ngày trên tổng 4,32 triệu, tức bạn giữ được mọi thứ đáng giá với chừng 2% khối lượng. Cái giá là có thật và có chặn — collector giữ trong bộ nhớ lượng span tương ứng <code>decision_wait × thông lượng</code> — và nó đi kèm một yêu cầu cứng: MỌI span của một trace phải tới CÙNG MỘT thực thể collector, nếu không mỗi cái chỉ thấy một mảnh, quyết định độc lập, và lưu lại một "trace" chỉ có một span không cha.',
          ),
        }),

        // q30 · đáp án 2
        mcq({
          prompt: B(
            'A waterfall for <code>GET /api/v1/feed</code> totals 2,100 ms:' +
            code(
              'GET /api/v1/feed ─────────────────────────── 2100ms\n' +
              '  ├─ auth.verifyJwt ─ 4ms\n' +
              '  ├─ prisma:query Post.findMany ── 30ms\n' +
              '  │        ← 1900ms with no span and no log line\n' +
              '  └─ response.serialise ─ 8ms') +
            '<b>What is the most likely cause, and what confirms it in one look?</b>',
            'Một biểu đồ thác cho <code>GET /api/v1/feed</code> tổng cộng 2.100 ms:' +
            code(
              'GET /api/v1/feed ─────────────────────────── 2100ms\n' +
              '  ├─ auth.verifyJwt ─ 4ms\n' +
              '  ├─ prisma:query Post.findMany ── 30ms\n' +
              '  │        ← 1900ms không có span nào và không có dòng log nào\n' +
              '  └─ response.serialise ─ 8ms') +
            '<b>Nguyên nhân khả dĩ nhất là gì, và cái gì xác nhận nó chỉ trong một cái nhìn?</b>',
          ),
          options: [
            B(
              'A dropped span. The exporter\'s queue overflowed and discarded it silently, so the work did happen and was instrumented; confirm with the exporter\'s failed-span counter, and the gap disappears once the queue is enlarged',
              'Một span bị vứt. Hàng đợi của trình xuất bị tràn và âm thầm bỏ nó đi, nên công việc CÓ xảy ra và CÓ được đo đạc; xác nhận bằng bộ đếm span-thất-bại của trình xuất, và khoảng trống biến mất khi hàng đợi được nới rộng',
            ),
            B(
              'Clock skew between the two containers, which makes an interval appear where none exists; confirm by comparing the span timestamps against the host clock, since a trace assembled from two unsynchronised clocks always shows phantom gaps',
              'Lệch đồng hồ giữa hai container, thứ làm hiện ra một khoảng thời gian vốn không tồn tại; xác nhận bằng cách so dấu thời gian của các span với đồng hồ máy chủ, vì một trace ghép từ hai đồng hồ không đồng bộ luôn hiện ra những khoảng trống ma',
            ),
            B(
              'CPU work in JavaScript, because auto-instrumentation only sees I/O and therefore cannot see a sort over 50,000 rows or a <code>JSON.stringify</code> of a huge payload. Confirm by checking whether <b>event-loop lag p99 spiked at the same timestamp</b>. The other two candidates are a connection-pool wait — no query has started, so there is no span to draw — and an uninstrumented native library such as sharp or ffmpeg',
              'Việc nặng CPU trong JavaScript, vì tự-đo-đạc chỉ nhìn thấy I/O nên không thể thấy một lượt sắp xếp trên 50.000 dòng hay một lượt <code>JSON.stringify</code> trên một payload khổng lồ. Xác nhận bằng cách kiểm xem <b>p99 độ trễ vòng lặp có vọt lên đúng mốc thời gian đó không</b>. Hai ứng viên còn lại là một lượt chờ bể kết nối — chưa truy vấn nào bắt đầu nên chẳng có span nào để vẽ — và một thư viện gốc chưa được đo đạc như sharp hay ffmpeg',
            ),
            B(
              'Network latency to the database. The Prisma span records only the server-side execution time, so the round trip is excluded from it and lands in the parent instead; confirm from the outbound span duration on the same trace',
              'Độ trễ mạng tới cơ sở dữ liệu. Span của Prisma chỉ ghi lại thời gian thực thi phía máy chủ, nên lượt đi-về bị loại khỏi nó và rơi vào span cha; xác nhận từ thời lượng của span gửi đi trên chính trace đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A gap is the most <em>valuable</em> shape in a waterfall, because it is the one that tells you your instrumentation has a hole and that the hole is where your time is going. It also has a short candidate list, ordered by likelihood, and the top candidate has a free cross-check sitting on another dashboard: auto-instrumentation patches I/O, so anything that is pure JavaScript computation is invisible to it — and a chapter-5 measurement makes the confirmation a glance, because CPU work in the loop <em>is</em> event-loop lag. The second candidate is subtle and worth remembering: a connection-pool wait produces exactly this shape, with no span at all, because the span is created when the query starts and the query has not started. The third is an uninstrumented library, which is fixed with one manual span. Option 1 is worth taking seriously in general — <code>maxQueueSize</code> is a silent drop threshold, not a backpressure signal — but a dropped span would remove a bar and shift nothing else, whereas here the parent&#39;s duration genuinely covers the missing time. This is also the argument for the "poor man&#39;s trace": an array of <code>{name, ms}</code> summed against the total makes every gap visible by construction.',
            'Một KHOẢNG TRỐNG là hình dạng ĐÁNG GIÁ NHẤT trong một biểu đồ thác, vì nó là cái nói cho bạn biết phần đo đạc của bạn có một cái lỗ và cái lỗ ấy chính là nơi thời gian của bạn đang chảy đi. Nó cũng có một danh sách ứng viên ngắn, xếp theo khả năng, và ứng viên đứng đầu có sẵn một phép đối chiếu miễn phí nằm trên một bảng theo dõi khác: tự-đo-đạc vá vào I/O, nên bất cứ thứ gì là tính toán JavaScript thuần đều vô hình với nó — và một phép đo ở chương 5 biến việc xác nhận thành một cái liếc, vì việc CPU trong vòng lặp CHÍNH LÀ độ trễ vòng lặp. Ứng viên thứ hai tinh tế và đáng nhớ: một lượt chờ bể kết nối sinh ra đúng hình dạng này, không có span nào cả, vì span được tạo ra khi truy vấn BẮT ĐẦU mà truy vấn thì chưa bắt đầu. Ứng viên thứ ba là một thư viện chưa đo đạc, chữa bằng một span viết tay. Phương án 1 nói chung là đáng coi trọng — <code>maxQueueSize</code> là một ngưỡng VỨT ÂM THẦM chứ không phải một tín hiệu nghẽn ngược — nhưng một span bị vứt thì làm mất một thanh và không dịch chuyển gì khác, trong khi ở đây thời lượng của span cha thật sự bao trùm cả phần thời gian bị thiếu. Đây cũng là lý lẽ cho "bản trace của người nghèo": một mảng <code>{name, ms}</code> đem cộng lại rồi so với tổng làm cho mọi khoảng trống hiện ra THEO CẤU TRÚC.',
          ),
        }),

        /* ── Chương 7 — lỗi: trụ cột có tên người gắn kèm (4 câu) ────────── */

        // q31 · đáp án 1
        mcq({
          prompt: B(
            'This repository reports to Sentry only when ' + c('statusCode >= 500') + ', with the comment "Client errors (4xx) are not bugs and would just spam the dashboard". <b>What would reporting 4xx actually cost?</b>',
            'Kho này chỉ báo cáo lên Sentry khi ' + c('statusCode >= 500') + ', kèm dòng chú thích "Lỗi phía client (4xx) không phải bug và chỉ làm rác bảng theo dõi". <b>Báo cáo cả 4xx sẽ thật sự tốn cái gì?</b>',
          ),
          options: [
            B(
              'Only quota. Sentry bills per event and 4xx are the majority of traffic on a public API, so the plan is exhausted in an afternoon — but the signal quality is unchanged, because the issue list can still be filtered by status code whenever you need to look at real bugs',
              'Chỉ tốn hạn mức. Sentry tính tiền theo mỗi sự kiện và 4xx chiếm phần lớn lưu lượng của một API công khai, nên gói dịch vụ cạn trong một buổi chiều — nhưng chất lượng tín hiệu không đổi, vì danh sách vấn đề vẫn lọc được theo mã trạng thái mỗi khi bạn cần nhìn vào các bug thật',
            ),
            B(
              'A dashboard with thousands of daily "errors", none actionable — a malformed request, an expired token, a deleted note are the system <em>working correctly</em>. That trains everyone to ignore it, and at that point the tool is <b>worse than absent</b>, because there is now a place people believe is being watched. The same classification decision runs the other way too: mapping Prisma <code>P2002</code> to a 409 turns a unique-constraint violation from a 500 (and therefore an event) into a normal response Sentry never hears about',
              'Một bảng theo dõi với hàng nghìn "lỗi" mỗi ngày mà không cái nào hành động được — một request sai khuôn, một token hết hạn, một ghi chú đã xoá đều là hệ thống ĐANG CHẠY ĐÚNG. Điều đó huấn luyện mọi người lờ nó đi, và tới lúc ấy cái công cụ còn <b>tệ hơn là không có</b>, vì giờ có một chỗ mà người ta TIN là đang được canh chừng. Quyết định phân loại ấy cũng chạy theo chiều ngược lại: ánh xạ <code>P2002</code> của Prisma thành 409 biến một vi phạm ràng buộc duy nhất từ một cú 500 (và do đó một sự kiện) thành một phản hồi bình thường mà Sentry không bao giờ nghe thấy',
            ),
            B(
              'Nothing — a 4xx is an error by definition, the HTTP specification says so, and an error tracker is the right home for every error the application returns; excluding them is how you end up unable to answer "how many users hit a validation failure last week", which is a genuine product question',
              'Chẳng tốn gì — một cú 4xx theo định nghĩa là một lỗi, đặc tả HTTP nói vậy, và một bộ theo dõi lỗi là chỗ đúng cho mọi lỗi mà ứng dụng trả về; loại chúng ra là cách bạn rơi vào chỗ không trả lời nổi câu "tuần trước có bao nhiêu người dùng gặp lỗi kiểm tra dữ liệu", một câu hỏi sản phẩm có thật',
            ),
            B(
              'Slower ingestion of the events that matter. Sentry processes an organisation\'s events in order, so a flood of 4xx pushes real 5xx events behind them in the queue and the alert for a genuine outage arrives minutes late — which is why the volume, not the noise, is the real argument for filtering',
              'Nạp chậm hơn với những sự kiện đáng kể. Sentry xử lý sự kiện của một tổ chức theo thứ tự, nên một cơn lũ 4xx đẩy các sự kiện 5xx thật ra sau chúng trong hàng đợi và cảnh báo cho một cú sập thật tới muộn vài phút — và đó là lý do KHỐI LƯỢNG, chứ không phải sự ồn ào, mới là lý lẽ thật cho việc lọc',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The comment in <code>errorHandler.ts</code> contains the whole rule in four words: <em>client errors are not bugs</em>. A 400 from a malformed request, a 401 from an expired token, a 404 for a note somebody deleted — every one of those is the system behaving exactly as designed, and an error tracker exists to hold things that need <em>fixing</em>. Fill it with things that do not and you get a list nobody opens, which is strictly worse than having no tracker at all, because the untracked case is a known gap while this one produces a false belief that something is being watched. The same sentence applies to log levels, and this is why chapter 1 and chapter 7 agree: a 400 belongs at <code>info</code> or nowhere. Option 3 asks a real question with the wrong tool — "how many validation failures last week" is a <em>counter</em>, costing a few bytes, answered instantly, and it is exactly the sort of question chapter 4 exists to route away from the per-event pillars. Note also what the Prisma mapping buys beyond safety: turning a raw <code>P2002</code> into a 409 stops it being a 500, and therefore stops it being an event, which is a signal-quality decision disguised as an error-handling one.',
            'Dòng chú thích trong <code>errorHandler.ts</code> chứa trọn cái luật trong bốn chữ: LỖI PHÍA CLIENT KHÔNG PHẢI BUG. Một cú 400 từ một request sai khuôn, một cú 401 từ một token hết hạn, một cú 404 cho một ghi chú ai đó vừa xoá — mỗi cái trong số đó đều là hệ thống hành xử đúng như thiết kế, còn một bộ theo dõi lỗi tồn tại để chứa những thứ cần SỬA. Nhét đầy nó bằng những thứ không cần sửa thì bạn được một danh sách chẳng ai mở, và như thế TỆ HƠN HẲN việc không có bộ theo dõi nào, vì ca không-theo-dõi là một khoảng trống ĐÃ BIẾT còn ca này sinh ra một NIỀM TIN SAI rằng có thứ gì đó đang được canh chừng. Đúng câu ấy áp cho mức log, và đó là lý do chương 1 với chương 7 đồng ý với nhau: một cú 400 thuộc mức <code>info</code> hoặc chẳng thuộc về đâu. Phương án 3 hỏi một câu hỏi có thật bằng công cụ sai — "tuần trước có bao nhiêu lỗi kiểm tra dữ liệu" là một BỘ ĐẾM, tốn vài byte, trả lời tức thì, và đó đúng là loại câu hỏi mà chương 4 tồn tại để lái ra khỏi các trụ cột tính-theo-sự-kiện. Cũng hãy để ý phép ánh xạ Prisma mua được gì ngoài sự an toàn: biến một <code>P2002</code> thô thành 409 làm nó thôi là một cú 500, và do đó thôi là một sự kiện, tức một quyết định về CHẤT LƯỢNG TÍN HIỆU nguỵ trang thành một quyết định xử lỗi.',
          ),
        }),

        // q32 · đáp án 3
        mcq({
          prompt: B(
            'Two error-handling habits, and each breaks grouping in the opposite direction:' +
            code(
              "// A\nthrow new Error(`Note ${noteId} not found for user ${userId}`);\n\n" +
              "// B\nasync function handleRequest(fn) {\n" +
              "  try { return await fn(); }\n" +
              "  catch (e) { throw new Error('Request failed'); }\n" +
              "}") +
            '<b>What does each produce, and what fixes each?</b>',
            'Hai thói quen xử lỗi, và mỗi cái phá việc gom nhóm theo một chiều ngược nhau:' +
            code(
              "// A\nthrow new Error(`Note ${noteId} not found for user ${userId}`);\n\n" +
              "// B\nasync function handleRequest(fn) {\n" +
              "  try { return await fn(); }\n" +
              "  catch (e) { throw new Error('Request failed'); }\n" +
              "}") +
            '<b>Mỗi cái sinh ra cái gì, và cái gì chữa được từng cái?</b>',
          ),
          options: [
            B(
              'Both over-merge. A collapses every not-found into one issue because the exception type is the same, and B collapses everything into one issue because the message is; the fix for both is <code>scope.setFingerprint()</code> with a value derived from the failing module, which restores one issue per subsystem and lets each team own its own row without touching the code that throws',
              'Cả hai đều GỘP QUÁ TO. A gộp mọi lỗi không-tìm-thấy vào một issue vì kiểu ngoại lệ giống nhau, còn B gộp mọi thứ vào một issue vì thông điệp giống nhau; cách chữa cho cả hai là <code>scope.setFingerprint()</code> với một giá trị suy từ module đang hỏng, việc đó khôi phục một issue cho mỗi phân hệ',
            ),
            B(
              'Both over-split. A splits by id pair and B splits by call site, because the wrapper appears at a different stack depth for every caller; the fix for both is to raise the number of frames Sentry considers when hashing, which is a project-level grouping setting rather than a code change and therefore applies retroactively to every issue already open',
              'Cả hai đều XÉ QUÁ NHỎ. A xé theo cặp id còn B xé theo chỗ gọi, vì cái hàm bọc xuất hiện ở một độ sâu stack khác nhau với mỗi bên gọi; cách chữa cho cả hai là nâng số khung mà Sentry xét khi băm, một thiết lập dự án chứ không phải một thay đổi mã',
            ),
            B(
              'Neither breaks grouping. Sentry fingerprints on the exception type plus the stack trace, and neither habit changes either of those — A throws the same <code>Error</code> from the same line every time, and B preserves the original stack because rethrowing inside a <code>catch</code> does not reset <code>Error.captureStackTrace</code>, so the innermost frames survive intact',
              'Không cái nào phá việc gom nhóm. Sentry lấy vân tay theo kiểu ngoại lệ cộng vệt stack, và không thói quen nào đổi hai thứ đó — A ném cùng một <code>Error</code> từ cùng một dòng mỗi lần, còn B giữ nguyên stack gốc vì ném lại không reset nó',
            ),
            B(
              '<b>A over-splits, B over-merges.</b> A gives every id pair a distinct message and therefore a distinct fingerprint, so a bug affecting 4,120 users becomes 4,120 issues with one event each — no issue ever crosses an alert threshold and "resolve" cannot work, because the next occurrence creates a new issue rather than reopening one. B gives every failure in the application the same message and the same top frame, so a database outage, a null dereference and an expired key land in one issue with 90,000 events. Fix A with a stable message and the ids as structured context; fix B with ' + c("new Error('Request failed', { cause: e })") + ', which Sentry reads and fingerprints on the innermost error',
              '<b>A XÉ QUÁ NHỎ, B GỘP QUÁ TO.</b> A cho mỗi cặp id một thông điệp riêng và do đó một vân tay riêng, nên một lỗi ảnh hưởng 4.120 người dùng thành 4.120 issue mỗi cái một sự kiện — chẳng issue nào vượt nổi một ngưỡng cảnh báo và "đã giải quyết" không hoạt động được, vì lần xảy ra kế tiếp tạo ra một issue MỚI chứ không mở lại cái cũ. B cho mọi cú hỏng trong ứng dụng cùng một thông điệp và cùng một khung stack đỉnh, nên một cú chết cơ sở dữ liệu, một lần truy cập null và một khoá hết hạn đều rơi vào MỘT issue với 90.000 sự kiện. Chữa A bằng một thông điệp ổn định với các id làm ngữ cảnh có cấu trúc; chữa B bằng ' + c("new Error('Request failed', { cause: e })") + ', thứ mà Sentry đọc được và lấy vân tay theo lỗi TRONG CÙNG',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Grouping is the whole product — it is what turns ten thousand events into one row you can assign, silence and mark fixed — so the two ways an error tracker fails are the two ways grouping fails, and they are opposites. The fingerprint is computed from the exception type plus the in-app stack frames, with the <em>message</em> used as a fallback when there is no usable stack, which is where habit A does its damage. Its symptoms are all quiet: no alert ever fires, the issue list is unreadable, and the event quota is gone by the afternoon. Habit B has the mirror-image symptoms — one issue with an implausibly large count whose stack traces all top out in the same helper, and which is never really fixed because some component of it is always failing. The <code>cause</code> option has been standard since ES2022 and Sentry reads it, producing a chain of exceptions rather than a wrapper. Both fixes are the same rule as chapter 1&#39;s stable log message: <b>the message identifies <em>what</em> happened; the fields say <em>which one</em></b>. And overriding the fingerprint by hand is rarer than it feels — "the grouping looks wrong" usually means the message has interpolated data, so fix the message and the grouping follows.',
            'Gom nhóm là toàn bộ sản phẩm — nó là thứ biến mười nghìn sự kiện thành MỘT hàng mà bạn giao được cho ai đó, tắt tiếng được và đánh dấu đã sửa được — nên hai cách một bộ theo dõi lỗi hỏng chính là hai cách việc gom nhóm hỏng, và chúng ngược nhau. Vân tay được tính từ kiểu ngoại lệ cộng các khung stack in-app, với THÔNG ĐIỆP làm phương án lùi khi không có stack dùng được, và đó là chỗ thói quen A gây hại. Triệu chứng của nó đều lặng lẽ: không cảnh báo nào nổ, danh sách issue không đọc nổi, và hạn mức sự kiện bay hết trong một buổi chiều. Thói quen B có triệu chứng phản chiếu — một issue với số đếm lớn tới mức khó tin mà mọi vệt stack đều kết thúc ở cùng một hàm trợ giúp, và nó không bao giờ được sửa thật vì luôn có một thành phần nào đó của nó đang hỏng. Tuỳ chọn <code>cause</code> đã là chuẩn từ ES2022 và Sentry đọc được nó, sinh ra một CHUỖI ngoại lệ thay vì một cái bọc. Cả hai cách chữa đều là cùng cái luật của thông điệp log ổn định ở chương 1: <b>thông điệp nói CHUYỆN GÌ xảy ra; các trường nói CÁI NÀO</b>. Và việc tự đè vân tay bằng tay hiếm hơn cảm giác — "trông gom nhóm sai sai" thường có nghĩa là thông điệp có dữ liệu nội suy vào, nên hãy sửa thông điệp rồi việc gom nhóm sẽ theo sau.',
          ),
        }),

        // q33 · đáp án 0
        mcq({
          prompt: B(
            'A service sets <code>sendDefaultPii: false</code> and deletes <code>cookies</code> and the <code>authorization</code> header in <code>beforeSend</code>. <b>What can still leave the building?</b>',
            'Một dịch vụ đặt <code>sendDefaultPii: false</code> và xoá <code>cookies</code> cùng header <code>authorization</code> trong <code>beforeSend</code>. <b>Cái gì vẫn có thể rời khỏi nhà?</b>',
          ),
          options: [
            B(
              'Four things. The exception <b>message</b>, which no redaction touches because it is the thing being reported — and which is the field people most naturally interpolate an email into. The <b>URL path</b>, since <code>sendDefaultPii</code> strips query and headers but not a route that takes an email as a parameter. Any <b>custom context</b> a caller passes to <code>captureException</code>, which is sent verbatim because the hook above operates on <code>event.request</code>. And <b>breadcrumbs</b> — a separate array of the last ~100 things that happened, carrying the URLs of earlier authenticated calls and, from the console integration, <code>console.log</code> output verbatim',
              'Bốn thứ. <b>THÔNG ĐIỆP</b> ngoại lệ, thứ không phép che nào đụng tới vì nó chính là cái đang được báo cáo — và là trường mà người ta hay nội suy một địa chỉ email vào nhất một cách tự nhiên. <b>ĐƯỜNG DẪN URL</b>, vì <code>sendDefaultPii</code> cắt chuỗi truy vấn và header nhưng không cắt một route nhận email làm tham số. Mọi <b>NGỮ CẢNH TỰ ĐẶT</b> mà bên gọi truyền vào <code>captureException</code>, thứ được gửi nguyên văn vì cái móc ở trên chỉ thao tác trên <code>event.request</code>. Và <b>BREADCRUMB</b> — một mảng riêng chứa khoảng 100 việc gần nhất đã xảy ra, mang theo URL của những lời gọi đã xác thực trước đó và, từ bộ tích hợp console, cả đầu ra <code>console.log</code> nguyên văn',
            ),
            B(
              'Nothing of consequence. <code>sendDefaultPii: false</code> is documented as covering every field the SDK collects automatically — IP, cookies, headers and user identifiers — and the two explicit deletions are belt-and-braces on top of it in case a future SDK release changes that default, so the only remaining payload is a stack trace plus whatever the application deliberately attached and therefore already reviewed',
              'Chẳng có gì đáng kể. <code>sendDefaultPii: false</code> được ghi trong tài liệu là phủ mọi trường mà SDK tự động thu thập — IP, cookie, header và định danh người dùng — và hai lệnh xoá tường minh là thắt lưng cộng dây đeo quần chồng lên nó phòng khi một bản SDK tương lai đổi cái mặc định ấy, nên phần dữ liệu còn lại chỉ là một vệt stack cộng bất cứ thứ gì ứng dụng cố ý đính vào và do đó đã được rà soát',
            ),
            B(
              'Only the client IP address, which Sentry derives server-side from the connection rather than from the event payload, so no client-side setting can remove it; the fix is an organisation-level server-side scrubbing rule applied at ingest, and everything else in the event — message, URL, custom context and breadcrumbs — is already covered by the two client-side mechanisms above',
              'Chỉ mỗi địa chỉ IP của client, thứ Sentry suy ra ở phía máy chủ từ chính kết nối chứ không phải từ phần dữ liệu sự kiện, nên không thiết lập nào phía client gỡ được; cách chữa là luật cọ rửa phía máy chủ ở cấp tổ chức, còn mọi thứ khác trong sự kiện thì đã được phủ',
            ),
            B(
              'The stack trace, because Node attaches the local variables of each frame to the exception object and the SDK serialises them into the event; those locals frequently contain the whole request body, the decoded JWT payload and any credential the function happened to have in scope at the moment it threw, and no <code>beforeSend</code> hook can enumerate them',
              'Vệt stack, vì Node đính các biến cục bộ của từng khung vào object ngoại lệ và SDK tuần tự hoá chúng vào sự kiện; các biến cục bộ đó thường chứa nguyên thân request, phần payload JWT đã giải mã và bất cứ chứng chỉ nào hàm tình cờ đang có trong tầm vào đúng lúc nó ném lỗi, và không móc <code>beforeSend</code> nào liệt kê hết chúng được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'An error report is the richest payload your application ever sends to a third party, and the SDK&#39;s defaults are chosen for debugging convenience rather than for you. The configuration here is genuinely good — one boolean removes IP, cookies, headers and user identifiers, and the explicit deletions mean a future SDK upgrade that changes the default cannot silently start leaking. But every one of the four remaining paths is outside what those two mechanisms cover, and the breadcrumb one is the least obvious and the worst: the redaction operates on <code>event.request</code>, which is the request that <em>failed</em>, while the breadcrumb trail is a separate array describing everything <em>leading up to</em> it — so an error on a harmless endpoint can ship the query string of an authenticated call three steps earlier, including a token that <code>event.request</code> would have had stripped. Filter with <code>beforeBreadcrumb</code>, or disable the console and HTTP breadcrumb integrations. Option 4 is a real hazard on some platforms and not on this one — Node does not attach frame locals — which is exactly why the only reliable check is the one the course insists on: <b>trigger a real error in staging and read the actual event</b>, field by field. Configuration says what should happen; only the event says what did.',
            'Một bản báo lỗi là gói dữ liệu giàu nhất mà ứng dụng của bạn từng gửi cho một bên thứ ba, và mặc định của SDK được chọn cho sự tiện lợi khi gỡ lỗi chứ không phải vì bạn. Cấu hình ở đây thật sự tốt — một giá trị luận lý gỡ bỏ IP, cookie, header và định danh người dùng, còn hai lệnh xoá tường minh nghĩa là một lần nâng cấp SDK tương lai làm đổi mặc định cũng không thể âm thầm bắt đầu rò rỉ. Nhưng cả bốn đường còn lại đều nằm ngoài phạm vi hai cơ chế ấy, và cái breadcrumb là ít hiển nhiên nhất và tệ nhất: phép che thao tác trên <code>event.request</code>, tức cái request ĐÃ HỎNG, còn vệt breadcrumb là một mảng RIÊNG mô tả mọi thứ DẪN TỚI nó — nên một lỗi trên một endpoint vô hại vẫn có thể chuyển đi chuỗi truy vấn của một lời gọi đã xác thực ba bước trước đó, kể cả một token mà <code>event.request</code> lẽ ra đã cắt bỏ. Hãy lọc bằng <code>beforeBreadcrumb</code>, hoặc tắt hẳn bộ tích hợp breadcrumb cho console và HTTP. Phương án 4 là mối nguy có thật trên vài nền tảng và không phải trên nền tảng này — Node không đính biến cục bộ của khung — và chính vì thế phép kiểm đáng tin duy nhất là cái mà giáo trình nằng nặc đòi: <b>gây một lỗi thật ở môi trường thử rồi ĐỌC chính cái sự kiện ấy</b>, từng trường một. Cấu hình nói cái gì LẼ RA xảy ra; chỉ sự kiện mới nói cái gì ĐÃ xảy ra.',
          ),
        }),

        // q34 · đáp án 2
        mcq({
          prompt: B(
            'A team sets Sentry\'s <code>release</code> to <code>package.json</code>\'s version, which changes every few weeks. <b>What goes wrong, and which failure is the worst?</b>',
            'Một đội đặt <code>release</code> của Sentry bằng phiên bản trong <code>package.json</code>, thứ vài tuần mới đổi một lần. <b>Cái gì hỏng, và cú hỏng nào tệ nhất?</b>',
          ),
          options: [
            B(
              'Nothing important, as long as the string changes sometimes. Sentry only needs an ordering between releases to compute regressions, and a semantic version provides a stronger ordering than a git SHA does, because SHAs are not comparable and Sentry would have to fall back to upload timestamps to tell an older build from a newer one',
              'Chẳng có gì quan trọng, miễn là cái chuỗi thi thoảng có đổi. Sentry chỉ cần một thứ tự giữa các bản phát hành để tính chuyện tái phát, và một phiên bản ngữ nghĩa cho một thứ tự MẠNH HƠN một mã SHA, vì SHA không so sánh được với nhau',
            ),
            B(
              'Sentry rejects the value at ingest, because a release identifier must be unique per artifact and the SDK detects the collision when a second build reports the same string from a different environment; the events themselves are accepted but the release association is silently dropped, so the issue page shows them as belonging to no release at all',
              'Sentry từ chối giá trị đó ngay lúc nạp vào, vì một định danh bản phát hành phải là duy nhất cho mỗi hiện vật và SDK phát hiện ra va chạm khi một bản dựng thứ hai báo cùng một chuỗi từ một môi trường khác; các sự kiện vẫn được nhận nhưng phần gắn với bản phát hành bị bỏ đi',
            ),
            B(
              'Three things degrade and one actively lies. "First seen in v1.4.0" now covers a fortnight of deploys rather than a commit range, so it no longer converts into a diff. Regression detection cannot fire, because the version never changed between the fix and the reappearance. Suspect commits stop working. And the dangerous one: <b>source maps are uploaded per release, so a later build overwrites the earlier ones</b> — old stack traces then resolve to file-and-line numbers that look perfectly plausible and point somewhere unrelated, and you will read that code carefully before doubting it',
              'Ba thứ xuống cấp và một thứ NÓI DỐI thẳng. "Thấy lần đầu ở v1.4.0" giờ phủ trọn hai tuần deploy thay vì một khoảng commit, nên nó thôi quy đổi được thành một cái diff. Việc phát hiện tái phát không nổ được, vì phiên bản chẳng hề đổi giữa lúc sửa và lúc nó quay lại. Phần đoán commit khả nghi thôi hoạt động. Và cái nguy hiểm: <b>source map được tải lên theo từng bản phát hành, nên một bản dựng sau GHI ĐÈ lên các bản trước</b> — các vệt stack cũ khi ấy giải mã ra những số hiệu file-và-dòng trông hoàn toàn hợp lý mà chỉ vào chỗ chẳng liên quan, và bạn sẽ đọc kỹ đoạn mã đó trước khi kịp nghi ngờ nó',
            ),
            B(
              'Only the frontend is affected, since the backend runs compiled TypeScript with inline source maps and readable stacks; for the backend a coarse release string costs nothing at all, and the fix can be scoped to the frontend build without touching the server configuration',
              'Chỉ phần frontend bị ảnh hưởng, vì backend chạy TypeScript đã biên dịch với source map nội tuyến và các vệt stack đọc được; với backend thì một chuỗi bản phát hành thô chẳng tốn gì cả, và cách chữa gói gọn được trong bản dựng frontend mà không phải đụng tới cấu hình máy chủ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A release string is a join key between an event and a build, and a join key that is not unique produces answers rather than errors — which is what makes this expensive. Three of the four failures are merely degradations: you lose the commit range, you lose regression detection, you lose suspect commits. The fourth is different in kind, because it does not fail: a source map uploaded for a later build replaces the one for an earlier build under the same release name, so an old stack trace still resolves, still shows a filename and a line number, and the line it shows is wrong. There is nothing in the interface that distinguishes that from a correct resolution, so the wasted hour is spent reading code that has nothing to do with the bug. Use the git SHA: it is unique by construction, it maps directly to a diff, and <code>git rev-parse --short HEAD</code> is already available at build time — it reaches the container as a <code>--build-arg</code> and an <code>ENV</code>, which is three lines across the Dockerfile and the deploy script. And when you upload maps, <b>delete them from the image afterwards</b>: a public <code>.map</code> file lets anyone reconstruct your entire frontend source.',
            'Một chuỗi bản phát hành là một KHOÁ NỐI giữa một sự kiện và một bản dựng, và một khoá nối không duy nhất thì sinh ra CÂU TRẢ LỜI chứ không sinh ra LỖI — và chính điều đó làm nó đắt. Ba trong bốn cú hỏng chỉ là xuống cấp: bạn mất khoảng commit, mất việc phát hiện tái phát, mất phần đoán commit khả nghi. Cái thứ tư khác về BẢN CHẤT, vì nó KHÔNG hỏng: một source map tải lên cho một bản dựng sau thay thế cái của bản dựng trước dưới cùng một tên bản phát hành, nên một vệt stack cũ vẫn giải mã được, vẫn hiện ra một tên file và một số dòng, và cái dòng nó hiện ra là SAI. Chẳng có gì trong giao diện phân biệt được cái đó với một lần giải mã đúng, nên cái giờ đồng hồ bị phí được tiêu vào việc đọc một đoạn mã chẳng liên quan gì tới cái bug. Hãy dùng mã SHA của git: nó duy nhất theo cấu trúc, nó ánh xạ thẳng sang một cái diff, và <code>git rev-parse --short HEAD</code> vốn đã có sẵn lúc dựng — nó tới container qua một <code>--build-arg</code> và một <code>ENV</code>, tức ba dòng trải trên Dockerfile và script deploy. Và khi tải map lên rồi thì <b>hãy xoá chúng khỏi ảnh</b>: một file <code>.map</code> công khai cho bất cứ ai dựng lại toàn bộ mã nguồn frontend của bạn.',
          ),
        }),

        /* ── Chương 8 — phép kiểm sức khoẻ nói được điều gì đó (5 câu) ───── */

        // q35 · đáp án 1
        mcq({
          prompt: B(
            'Postgres becomes unreachable for twenty seconds. Your <b>liveness</b> probe runs ' + c('SELECT 1') + '. <b>What does the next minute look like?</b>',
            'Postgres không với tới được trong hai mươi giây. Lượt thăm dò <b>liveness</b> của bạn chạy ' + c('SELECT 1') + '. <b>Một phút sau trông như thế nào?</b>',
          ),
          options: [
            B(
              'The orchestrator marks the container unhealthy but waits for the dependency to recover before acting, because a liveness failure caused by an external check is treated as a soft failure; the outcome is a twenty-second blip and a warning in the event log',
              'Bộ điều phối đánh dấu container là không khoẻ nhưng CHỜ phụ thuộc hồi phục rồi mới hành động, vì một cú trượt liveness do một phép kiểm bên ngoài gây ra được coi là một cú hỏng mềm; kết cục là một cú chớp hai mươi giây và một dòng cảnh báo trong nhật ký sự kiện',
            ),
            B(
              'Every backend container fails its probe, all of them are killed and restarted, and each restart immediately opens a fresh pool of nine connections into a database that is already struggling — a thundering herd that keeps the restarts failing. A twenty-second hiccup becomes a ten-minute outage <em>caused entirely by the health check</em>, and the container logs explaining the original stall are discarded with the containers. Liveness must depend on nothing external; the dependency check belongs in <b>readiness</b>, whose consequence is "stop sending traffic", not "restart"',
              'Mọi container backend đều trượt lượt thăm dò, tất cả bị giết và khởi động lại, và mỗi lần khởi động lại lập tức mở một bể mới chín kết nối vào một cơ sở dữ liệu vốn đã đang chật vật — một đàn bò dồn cục giữ cho các lần khởi động lại tiếp tục trượt. Một cú nấc hai mươi giây thành một cú sập mười phút mà NGUYÊN NHÂN HOÀN TOÀN LÀ CÁI PHÉP KIỂM SỨC KHOẺ, và các log container giải thích cú đơ ban đầu bị vứt đi cùng với các container. Liveness không được phụ thuộc vào bất cứ thứ gì bên ngoài; phép kiểm phụ thuộc thuộc về <b>readiness</b>, thứ có hệ quả là "ngừng gửi lưu lượng" chứ không phải "khởi động lại"',
            ),
            B(
              'Nothing visible. A liveness probe only reports status to the orchestrator, and restarts are triggered by the restart policy rather than by the probe, so a container with <code>restart: unless-stopped</code> is restarted only when its main process exits with a non-zero code',
              'Chẳng có gì nhìn thấy được. Một lượt thăm dò liveness chỉ báo trạng thái cho bộ điều phối, còn việc khởi động lại là do chính sách khởi động lại kích hoạt chứ không phải do lượt thăm dò, nên một container với <code>restart: unless-stopped</code> chỉ được khởi động lại khi tiến trình chính của nó thoát với mã khác không',
            ),
            B(
              'Traffic is routed away from the affected containers while they stay running, which is the correct behaviour: a liveness failure removes an instance from the load balancer and a readiness failure restarts it, so this configuration produces exactly the outcome you want',
              'Lưu lượng được lái đi khỏi các container bị ảnh hưởng trong khi chúng vẫn chạy, và đó là hành vi ĐÚNG: một cú trượt liveness gỡ một thực thể ra khỏi bộ cân bằng tải còn một cú trượt readiness thì khởi động lại nó, nên cấu hình này cho ra đúng kết cục bạn muốn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The two probes exist separately because their failing actions are <em>opposite</em>: liveness failing means "kill this container and start a new one", readiness failing means "stop sending traffic, leave it running". Option 4 has them backwards, which is the single most common confusion in this area. A restart is the right response to exactly one thing — a process that is wedged and will not recover on its own — and it is the wrong response to a dependency being briefly unavailable, because a fresh Node process has no more ability to reach Postgres than the old one did. Worse, it actively harms: every restart drops the existing pool and opens nine new connections, so the recovering database receives a connection storm from every restarting instance, and in-flight requests that were succeeding on cached data become 502s. The evidence disappears too, because recreating a container starts a new, empty <code>-json.log</code>. The signature in your metrics is unmistakable once you know it: <code>time() - process_start_time_seconds</code> sawtoothing every 30 to 45 seconds while the error rate sits flat at 100% — and it is invisible if you are only watching request latency, because there are no successful requests to have latency.',
            'Hai lượt thăm dò tồn tại tách biệt vì hành động khi trượt của chúng NGƯỢC NHAU: liveness trượt nghĩa là "giết container này và khởi một cái mới", readiness trượt nghĩa là "ngừng gửi lưu lượng, cứ để nó chạy". Phương án 4 đảo ngược hai thứ đó, và đó là nhầm lẫn phổ biến nhất trong mảng này. Khởi động lại là phản ứng đúng cho đúng MỘT thứ — một tiến trình kẹt cứng và sẽ không tự hồi phục — và là phản ứng sai với việc một phụ thuộc tạm thời không với tới được, vì một tiến trình Node mới cũng chẳng với tới Postgres giỏi hơn tiến trình cũ. Tệ hơn, nó gây hại thật sự: mỗi lần khởi động lại vứt bỏ cái bể đang có rồi mở chín kết nối mới, nên cơ sở dữ liệu đang hồi phục nhận một cơn bão kết nối từ mọi thực thể đang khởi động lại, còn các request đang bay vốn đang thành công nhờ dữ liệu đệm thì thành 502. Bằng chứng cũng biến mất, vì dựng lại một container là bắt đầu một file <code>-json.log</code> mới và rỗng. Chữ ký trong chỉ số của bạn thì không lẫn được một khi đã biết: <code>time() - process_start_time_seconds</code> răng cưa mỗi 30 tới 45 giây trong khi tỉ lệ lỗi nằm phẳng ở 100% — và nó vô hình nếu bạn chỉ nhìn độ trễ request, vì làm gì có request thành công nào để mà có độ trễ.',
          ),
        }),

        // q36 · đáp án 3
        mcq({
          prompt: B(
            'A graceful shutdown handler calls <code>server.close()</code> the instant <code>SIGTERM</code> arrives, then disconnects Prisma in the callback. Users still see 502s during every deploy. <b>Why, and what is the fix?</b>',
            'Một bộ xử lý tắt máy tử tế gọi <code>server.close()</code> ngay khi <code>SIGTERM</code> tới, rồi ngắt kết nối Prisma trong callback. Người dùng vẫn thấy 502 ở mọi lần deploy. <b>Vì sao, và cách chữa là gì?</b>',
          ),
          options: [
            B(
              'Because <code>server.close()</code> severs in-flight requests rather than letting them finish; the fix is to track open connections yourself and call <code>closeIdleConnections()</code> once the count reaches zero, after which no request can be interrupted mid-response',
              'Vì <code>server.close()</code> cắt đứt các request đang bay thay vì để chúng chạy xong; cách chữa là tự theo dõi số kết nối đang mở rồi gọi <code>closeIdleConnections()</code> khi số đó về không, sau đó không request nào bị ngắt giữa chừng phản hồi được nữa',
            ),
            B(
              'Because Prisma is disconnected before the HTTP server has finished draining, so late queries fail; the fix is to move <code>prisma.$disconnect()</code> out of the callback and into a <code>process.on(\'exit\')</code> handler that runs strictly last',
              'Vì Prisma bị ngắt kết nối trước khi máy chủ HTTP rút hết, nên các truy vấn muộn bị hỏng; cách chữa là dời <code>prisma.$disconnect()</code> ra khỏi callback và đưa vào một handler <code>process.on(\'exit\')</code> chạy sau cùng',
            ),
            B(
              'Because <code>SIGTERM</code> is delivered to the container\'s PID 1 rather than to your process when the image has no init system, so the handler never runs at all; the fix is <code>init: true</code> in the compose service so that a real init forwards the signal, and no application code change is needed at all',
              'Vì <code>SIGTERM</code> được giao cho PID 1 của container chứ không phải cho tiến trình của bạn khi ảnh không có hệ thống init, nên handler hoàn toàn không chạy; cách chữa là <code>init: true</code> trong khối dịch vụ compose, và không cần đổi mã',
            ),
            B(
              'Because the load balancer learns you are unready by <b>polling</b>, not by being told — so between <code>SIGTERM</code> and its next few failed checks it keeps routing to a socket that has stopped accepting, and every one of those is a 502. Fail readiness <em>first</em>, sleep for at least the readiness interval times the failure threshold plus a margin, and only then call <code>server.close()</code>. And set <code>stop_grace_period</code> above drain plus your slowest request, because Docker\'s default is 10 seconds and <code>SIGKILL</code> does not negotiate',
              'Vì bộ cân bằng tải biết bạn chưa sẵn sàng bằng cách HỎI THĂM ĐỊNH KỲ, chứ không phải được báo — nên giữa lúc <code>SIGTERM</code> tới và vài lượt kiểm trượt kế tiếp của nó, nó vẫn lái lưu lượng vào một socket đã ngừng nhận, và mỗi cái trong số đó là một cú 502. Hãy cho readiness TRƯỢT TRƯỚC, ngủ ít nhất bằng chu kỳ readiness nhân ngưỡng số lần trượt cộng một khoảng dư, rồi mới gọi <code>server.close()</code>. Và đặt <code>stop_grace_period</code> lớn hơn thời gian rút cộng request chậm nhất của bạn, vì mặc định của Docker là 10 giây và <code>SIGKILL</code> thì không thương lượng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The handler described is <em>mostly right</em>, and that is what makes the remaining gap so easy to miss: using <code>server.close()</code> rather than <code>process.exit()</code> is the part most codebases get wrong, and letting the loop drain naturally is also what lets buffered stdout actually reach disk before the process ends. What it misses is that readiness is a <em>polled</em> signal. There is no push, so the minimum honest wait is the readiness interval plus the failure threshold times the interval plus a margin — with a Docker healthcheck at 15 s and 3 retries that is up to 45 seconds before anything stops routing to you. Choosing a shorter drain is choosing to drop requests; choosing a longer one costs deploy time and nothing else. The arithmetic then collides with <code>stop_grace_period</code>, whose default of 10 seconds is smaller than a sensible drain plus a slow request, so the very mechanism meant to make deploys clean is what runs you into the hard kill — set it explicitly (40 s is honest for a service with a 25-second LLM timeout) and add a <code>setTimeout(process.exit).unref()</code> backstop so a hung shutdown ends on your terms. The mirror image applies at startup: bind the port <em>last</em>, after dependencies and routes, and set <code>start_period</code> to your worst observed boot time doubled.',
            'Cái handler được mô tả PHẦN LỚN LÀ ĐÚNG, và chính điều đó làm khoảng trống còn lại dễ bị bỏ sót: dùng <code>server.close()</code> thay vì <code>process.exit()</code> là phần mà phần lớn kho mã làm sai, còn để vòng lặp tự rút cạn cũng chính là thứ cho phép phần stdout còn tồn trong đệm thật sự tới được đĩa trước khi tiến trình kết thúc. Thứ nó bỏ sót là readiness là một tín hiệu ĐƯỢC HỎI THĂM. Không có cơ chế đẩy, nên thời gian chờ trung thực tối thiểu là chu kỳ readiness cộng ngưỡng số lần trượt nhân chu kỳ cộng một khoảng dư — với một healthcheck Docker ở 15 s và 3 lần thử lại thì đó là tới 45 giây trước khi có thứ gì ngừng lái lưu lượng vào bạn. Chọn thời gian rút ngắn hơn là chọn làm rơi request; chọn dài hơn thì tốn thời gian deploy và không tốn gì khác. Phép tính ấy rồi va vào <code>stop_grace_period</code>, mà mặc định 10 giây của nó nhỏ hơn một khoảng rút hợp lý cộng một request chậm, nên chính cái cơ chế sinh ra để làm các lần deploy sạch sẽ lại là thứ đâm bạn vào cú giết cứng — hãy đặt nó tường minh (40 s là con số trung thực với một dịch vụ có trần chờ LLM 25 giây) và thêm một chốt lùi <code>setTimeout(process.exit).unref()</code> để một lần tắt bị treo kết thúc theo điều kiện của bạn. Ảnh phản chiếu của nó áp cho lúc khởi động: hãy gắn cổng SAU CÙNG, sau các phụ thuộc và các route, rồi đặt <code>start_period</code> bằng thời gian khởi động tệ nhất bạn từng quan sát, nhân đôi.',
          ),
        }),

        // q37 · đáp án 0
        mcq({
          prompt: B(
            'A deploy script smoke-tests <b>52 routes out of 942 declarations</b> and asserts only that each returns something other than 404. <b>Why is 5.5% the right coverage, and why not assert 200?</b>',
            'Một script deploy kiểm khói <b>52 route trên 942 khai báo</b> và chỉ khẳng định rằng mỗi cái trả về một thứ khác 404. <b>Vì sao 5,5% là mức phủ ĐÚNG, và vì sao không khẳng định 200?</b>',
          ),
          options: [
            B(
              'Because it is not testing routes at all — it is testing that each router <em>module</em> got mounted, and one route per module proves that. And asserting non-404 rather than 200 is what lets it cover authenticated routes with no credentials, since a <b>401 proves the router exists just as well as a 200 does</b>. Adding the other 890 would multiply the runtime by eighteen and catch nothing new; the discipline that keeps 5.5% meaningful is adding exactly one route here whenever a new router is added',
              'Vì nó hoàn toàn không kiểm các route — nó kiểm rằng mỗi MODULE router đã được gắn vào, và một route cho mỗi module chứng minh được điều đó. Còn việc khẳng định khác-404 thay vì 200 chính là thứ cho phép nó phủ được cả các route cần xác thực mà không có chứng chỉ nào, vì <b>một cú 401 chứng minh router tồn tại y hệt như một cú 200</b>. Thêm 890 cái còn lại sẽ nhân thời gian chạy lên mười tám lần mà chẳng bắt thêm được gì; kỷ luật giữ cho 5,5% còn ý nghĩa là thêm ĐÚNG MỘT route vào đây mỗi khi có một router mới',
            ),
            B(
              'Because testing more routes would push the deploy past its own timeout, and a smoke test that makes deploys fail on duration is worse than one with thin coverage; 52 was chosen as the largest set that fits inside the remaining budget after the image swap',
              'Vì kiểm nhiều route hơn sẽ đẩy lần deploy vượt quá trần thời gian của chính nó, và một phép kiểm khói làm các lần deploy trượt vì thời lượng thì tệ hơn một phép kiểm phủ mỏng; 52 được chọn vì đó là tập lớn nhất còn lọt trong phần ngân sách thời gian còn lại sau khi tráo ảnh',
            ),
            B(
              'Because the other 890 routes are POST-only or take a required parameter, so a bare unauthenticated GET against them would return 404 anyway and the assertion could not distinguish that from a genuinely unmounted router; 52 is simply every route that qualifies',
              'Vì 890 route còn lại đều chỉ nhận POST hoặc đòi một tham số bắt buộc, nên một lượt GET trần không xác thực vào chúng dù sao cũng trả 404 và phép khẳng định không phân biệt được nó với một router thật sự chưa được gắn; 52 đơn giản là tất cả các route đủ điều kiện',
            ),
            B(
              'It is not the right coverage. Every route should be checked, because a partial build can mount a router while leaving individual handlers unregistered; the reason it is not done is effort rather than principle, and the honest description is that 5.5% is a compromise nobody has had time to improve',
              'Đó KHÔNG phải mức phủ đúng. Mọi route đều nên được kiểm, vì một bản dựng dở dang có thể gắn được một router mà vẫn để vài handler riêng lẻ chưa đăng ký; lý do người ta không làm là do công sức chứ không phải nguyên tắc, và mô tả trung thực là 5,5% chỉ là một sự thoả hiệp mà chưa ai có thời gian cải thiện',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is a level-2 check in the depth ladder, and it catches a class of failure that levels 0 and 1 miss entirely. During the stale-build incident, <code>/health/live</code> returned 200, <code>/health</code> returned 200 because <code>SELECT 1</code> worked, <code>/health/ready</code> returned 200 for the same reason — and <code>GET /api/v1/gifs</code> returned 404 because the route was never mounted. Three probes green, the application broken, and the difference is that levels 0 and 1 ask about the process and its dependencies while level 2 asks about <em>the build</em>. The non-404 assertion is the design decision that makes the check cheap: it needs no credentials, no fixtures and no cleanup, because the question is "does this router exist" and 401 answers it. The project&#39;s own documentation is explicit about the corresponding constraint — do <em>not</em> add POST-only or parameter-required routes, "or every deploy will false-fail" — because a smoke test that cries wolf is removed within a month. What the check cannot see is the argument for the next lesson: it runs via <code>docker exec</code> against <code>localhost</code>, so it bypasses DNS, TLS, nginx and Cloudflare entirely, and <b>all 52 routes being mounted is perfectly compatible with the certificate having expired an hour ago</b>.',
            'Đây là một phép kiểm mức 2 trong thang độ sâu, và nó bắt được một lớp cú hỏng mà mức 0 và mức 1 bỏ sót hoàn toàn. Trong sự cố ảnh cũ, <code>/health/live</code> trả 200, <code>/health</code> trả 200 vì <code>SELECT 1</code> chạy được, <code>/health/ready</code> trả 200 vì cùng lý do — còn <code>GET /api/v1/gifs</code> trả 404 vì route đó chưa từng được gắn. Ba lượt thăm dò xanh, ứng dụng thì hỏng, và khác biệt nằm ở chỗ mức 0 và mức 1 hỏi về TIẾN TRÌNH và các phụ thuộc của nó còn mức 2 hỏi về BẢN DỰNG. Phép khẳng định khác-404 là quyết định thiết kế làm cho phép kiểm rẻ: nó không cần chứng chỉ, không cần dữ liệu mồi và không cần dọn dẹp, vì câu hỏi là "cái router này có tồn tại không" và 401 trả lời được. Tài liệu của chính dự án nói rõ ràng buộc kèm theo — ĐỪNG thêm các route chỉ nhận POST hay đòi tham số, "không thì mọi lần deploy sẽ trượt oan" — vì một phép kiểm khói hay báo động giả sẽ bị gỡ trong vòng một tháng. Thứ mà phép kiểm này KHÔNG thấy được chính là lý lẽ cho bài kế tiếp: nó chạy qua <code>docker exec</code> nhắm vào <code>localhost</code>, nên nó vượt qua DNS, TLS, nginx và Cloudflare hoàn toàn, và <b>chuyện cả 52 route đều đã được gắn hoàn toàn tương thích với chuyện chứng chỉ đã hết hạn từ một tiếng trước</b>.',
          ),
        }),

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'A probe returns <b>HTTP 200</b> with the body ' + c('{"status":"error","database":"disconnected"}') + '. <b>What happens next?</b>',
            'Một lượt thăm dò trả về <b>HTTP 200</b> với phần thân ' + c('{"status":"error","database":"disconnected"}') + '. <b>Chuyện gì xảy ra tiếp?</b>',
          ),
          options: [
            B(
              'The orchestrator parses the JSON body, finds a status field that does not say ok, and marks the container unhealthy — which is why returning a structured body is the recommended pattern and the status code is only a transport concern',
              'Bộ điều phối phân giải phần thân JSON, thấy một trường trạng thái không nói ok, rồi đánh dấu container là không khoẻ — và đó là lý do trả về một phần thân có cấu trúc là khuôn mẫu được khuyến nghị còn mã trạng thái chỉ là chuyện của tầng vận chuyển',
            ),
            B(
              'Docker treats any response body containing the string "error" as a failure, which is why the <code>CMD-SHELL</code> form of a healthcheck pipes the output through <code>grep -v error</code> in most published examples and why this configuration is usually written that way',
              'Docker coi mọi phần thân phản hồi có chứa chuỗi "error" là một cú trượt, và đó là lý do dạng <code>CMD-SHELL</code> của một healthcheck thường dẫn đầu ra qua <code>grep -v error</code> trong phần lớn ví dụ công bố, và là lý do cấu hình này thường được viết theo kiểu đó',
            ),
            B(
              'Nothing. Traffic keeps arriving at an instance that cannot serve it, because orchestrators, load balancers and uptime monitors all branch on the <b>status code</b> and almost none of them parse the JSON. So the probe is telling a human something true and telling the machine that everything is fine. <b>The status code is the interface; the body is documentation.</b> Verify with ' + c('curl -o /dev/null -w "%{http_code}"') + ', never by reading the body',
              'Chẳng có gì. Lưu lượng vẫn tiếp tục tới một thực thể không phục vụ nổi nó, vì các bộ điều phối, bộ cân bằng tải và bộ giám sát thời gian sống đều rẽ nhánh theo <b>MÃ TRẠNG THÁI</b> và gần như không cái nào phân giải phần JSON. Nên lượt thăm dò đang nói với một CON NGƯỜI một điều đúng và nói với cái MÁY rằng mọi thứ đều ổn. <b>Mã trạng thái là giao diện; phần thân là tài liệu.</b> Hãy kiểm bằng ' + c('curl -o /dev/null -w "%{http_code}"') + ', đừng bao giờ kiểm bằng cách đọc phần thân',
            ),
            B(
              'The load balancer retries the probe on a shortened interval until it either returns 503 or the retry budget is exhausted, since a 200 whose body reports an error is treated as an indeterminate result rather than a pass or a fail',
              'Bộ cân bằng tải thử lại lượt thăm dò với chu kỳ rút ngắn cho tới khi nó hoặc trả về 503 hoặc cạn ngân sách thử lại, vì một cú 200 mà phần thân báo lỗi được coi là một kết quả BẤT ĐỊNH chứ không phải đạt hay trượt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is a mistake that produces no error anywhere, which is why it survives refactors. The handler is carefully written, the JSON is accurate, a human reading it learns something true — and every machine in the path reads only the first line of the response. The consequence is the worst one available: traffic continues to an instance that has already told you it cannot serve. It is worth checking rather than assuming on any codebase you inherit, because the two halves are written in different places (the <code>res.status()</code> call and the object literal) and it is easy to change one during a refactor without the other. The general habit here recurs throughout the course: <b>verify a check with the tool the machine uses, not the one a human finds readable</b>. That is the same reason route health is diagnosed with an unauthenticated <code>curl</code> rather than a browser — a browser sends cookies, follows redirects and renders an error page for a 404 that looks identical to a permissions problem — and the same reason chapter 7 insists you read a real Sentry event rather than the config that was supposed to shape it.',
            'Đây là một sai lầm chẳng sinh ra lỗi ở đâu cả, và vì thế nó sống sót qua các lần tái cấu trúc. Cái handler được viết cẩn thận, phần JSON thì chính xác, một con người đọc nó học được một điều đúng — và mọi cái máy trên đường đi chỉ đọc mỗi dòng đầu tiên của phản hồi. Hệ quả là cái tệ nhất có thể: lưu lượng tiếp tục chảy tới một thực thể vốn đã tự nói với bạn rằng nó không phục vụ nổi. Chuyện này đáng đi KIỂM chứ đừng giả định trên bất cứ kho mã nào bạn thừa kế, vì hai nửa của nó được viết ở hai chỗ khác nhau (lời gọi <code>res.status()</code> và cái object literal) và rất dễ đổi một nửa trong lúc tái cấu trúc mà quên nửa kia. Thói quen tổng quát ở đây lặp lại xuyên suốt khoá: <b>hãy kiểm một phép kiểm bằng đúng công cụ mà CÁI MÁY dùng, đừng bằng công cụ mà một con người thấy dễ đọc</b>. Đó vẫn là lý do sức khoẻ của một route được chẩn bằng một lệnh <code>curl</code> không xác thực chứ không bằng trình duyệt — trình duyệt gửi cookie, đi theo chuyển hướng và vẽ ra một trang lỗi cho cú 404 trông y hệt một vấn đề về quyền — và vẫn là lý do chương 7 nằng nặc đòi bạn ĐỌC một sự kiện Sentry thật thay vì đọc cái cấu hình lẽ ra định hình nó.',
          ),
        }),

        // q39 · đáp án 1
        mcq({
          prompt: B(
            'Every check you own — the Docker healthcheck, all three <code>/health*</code> endpoints, and the deploy smoke test — is green. The site is down for every user. <b>What could be true?</b>',
            'Mọi phép kiểm bạn có — healthcheck của Docker, cả ba endpoint <code>/health*</code>, và phép kiểm khói lúc deploy — đều xanh. Trang web thì chết với mọi người dùng. <b>Điều gì có thể đang đúng?</b>',
          ),
          options: [
            B(
              'Nothing consistent with the evidence. If the routes are mounted and the database answers, the application is serving; the only remaining explanation is that the reports are stale and the checks should be re-run before anything else is investigated',
              'Chẳng có gì nhất quán với bằng chứng cả. Nếu các route đã được gắn và cơ sở dữ liệu trả lời được thì ứng dụng đang phục vụ; lời giải thích duy nhất còn lại là các bản báo cáo đã cũ và nên chạy lại các phép kiểm trước khi điều tra bất cứ thứ gì khác',
            ),
            B(
              'Any of five layers your checks never touch: an expired TLS certificate, a wrong nginx <code>location</code> block, a DNS record still pointing at the old VPS, a firewall dropping 443, or Cloudflare having marked the origin down. Every internal check — <em>including</em> the smoke test, which runs via <code>docker exec</code> against <code>localhost</code> — starts at the application layer and bypasses all of them. The fix is at least one check that hits the <b>public hostname over TLS from somewhere that is not your VPS</b>',
              'Bất kỳ cái nào trong năm tầng mà các phép kiểm của bạn không bao giờ chạm tới: một chứng chỉ TLS hết hạn, một khối <code>location</code> sai trong nginx, một bản ghi DNS còn trỏ vào VPS cũ, một luật tường lửa chặn cổng 443, hay Cloudflare đã đánh dấu máy gốc là chết. Mọi phép kiểm bên trong — KỂ CẢ phép kiểm khói, thứ chạy qua <code>docker exec</code> nhắm vào <code>localhost</code> — đều bắt đầu từ tầng ứng dụng và vượt qua tất cả chúng. Cách chữa là ít nhất một phép kiểm đánh vào <b>tên miền công khai qua TLS, từ một nơi KHÔNG PHẢI VPS của bạn</b>',
            ),
            B(
              'The database must be down. The smoke test asserts only non-404, so a route that is mounted but fails on its first query still passes, and <code>/health</code> can return a cached result from the previous successful probe within its check interval',
              'Cơ sở dữ liệu chắc chắn đang chết. Phép kiểm khói chỉ khẳng định khác-404, nên một route đã gắn nhưng hỏng ngay ở truy vấn đầu tiên vẫn qua được, còn <code>/health</code> có thể trả về một kết quả đã đệm từ lượt thăm dò thành công trước đó trong chu kỳ kiểm của nó',
            ),
            B(
              'The frontend container is down while the backend is up. All four checks target the backend, so a broken frontend build is invisible to them; adding the frontend\'s own healthcheck to the same list closes the gap completely and no external check is needed',
              'Container frontend đang chết trong khi backend vẫn sống. Cả bốn phép kiểm đều nhắm vào backend, nên một bản dựng frontend hỏng là vô hình với chúng; thêm healthcheck của chính frontend vào cùng danh sách là bịt kín khoảng trống và không cần phép kiểm bên ngoài nào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Count the layers between a user and your code: DNS resolution, the CDN, TCP to the VPS, the TLS handshake, nginx, the Docker network, and finally your process. Every check in the list starts at the last one. That is not an argument against internal checks — they correctly isolate "is the app built right" from "is the network right", which is a distinction you want during an incident — it is the argument for having at least one check that is not internal. Each of the five failures has the same signature and each is a total outage: an expired certificate means every browser refuses to connect while you see 200 on everything; a wrong <code>location</code> block means requests never reach a container that is perfect; DNS pointing at the old VPS means your flawless new deploy is talking to nobody; and Cloudflare marking the origin down means your VPS sees <em>zero</em> requests, so every metric is green in the "quiet Sunday" way chapter 4 warned about. Two cheap things cover most of it: a scheduled job on infrastructure that is not yours (GitHub Actions works, and the point is only that it is elsewhere) hitting the public hostname, plus a certificate-expiry check. And one layered <code>curl</code> — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code> — tells you in one second <em>which</em> layer, which is why it is step two of the first five minutes.',
            'Hãy đếm các tầng giữa một người dùng và mã của bạn: phân giải DNS, CDN, TCP tới VPS, bắt tay TLS, nginx, mạng Docker, và cuối cùng là tiến trình của bạn. Mọi phép kiểm trong danh sách đều bắt đầu ở cái cuối cùng. Đó không phải lý lẽ chống lại các phép kiểm bên trong — chúng tách bạch đúng "ứng dụng có được dựng đúng không" khỏi "mạng có đúng không", một sự phân biệt bạn cần trong lúc có sự cố — mà là lý lẽ cho việc phải có ÍT NHẤT MỘT phép kiểm không nằm bên trong. Cả năm cú hỏng đều cùng một chữ ký và mỗi cái đều là một cú sập toàn phần: một chứng chỉ hết hạn nghĩa là mọi trình duyệt từ chối kết nối trong khi bạn thấy 200 ở mọi chỗ; một khối <code>location</code> sai nghĩa là request không bao giờ tới được một container hoàn hảo; DNS trỏ vào VPS cũ nghĩa là bản deploy mới không tì vết của bạn chẳng nói chuyện với ai; còn Cloudflare đánh dấu máy gốc là chết nghĩa là VPS của bạn thấy KHÔNG request nào, nên mọi chỉ số đều xanh theo đúng kiểu "chủ nhật vắng khách" mà chương 4 đã cảnh báo. Hai thứ rẻ tiền phủ được phần lớn: một job theo lịch chạy trên hạ tầng KHÔNG phải của bạn (GitHub Actions dùng được, và điểm mấu chốt chỉ là nó ở nơi khác) đánh vào tên miền công khai, cộng một phép kiểm hạn chứng chỉ. Và một lệnh <code>curl</code> phân tầng — <code>time_namelookup</code>, <code>time_connect</code>, <code>time_appconnect</code>, <code>time_starttransfer</code> — nói cho bạn biết trong một giây là TẦNG NÀO, và đó là lý do nó là bước hai của năm phút đầu tiên.',
          ),
        }),

        /* ── Chương 9 — cảnh báo: một lời hứa sẽ đánh thức ai đó (4 câu) ── */

        // q40 · đáp án 3
        mcq({
          prompt: B(
            'You copy <b>"alert when p99 &gt; 500 ms"</b> from a blog post onto a service whose normal p99 is <b>989 ms</b>. <b>What happens over the following weeks?</b>',
            'Bạn chép <b>"cảnh báo khi p99 &gt; 500 ms"</b> từ một bài blog vào một dịch vụ có p99 bình thường là <b>989 ms</b>. <b>Chuyện gì xảy ra trong những tuần sau đó?</b>',
          ),
          options: [
            B(
              'It correctly catches the service being slow. 989 ms is genuinely bad for an API, so an alert that fires continuously is telling you something true, and the right response is to fix the latency rather than to change the threshold — a noisy alert about a real problem is not a false positive',
              'Nó bắt đúng việc dịch vụ đang chậm. 989 ms thật sự là tệ với một API, nên một cảnh báo nổ liên tục đang nói cho bạn một điều đúng, và phản ứng đúng là đi sửa độ trễ chứ không phải đổi ngưỡng — một cảnh báo ồn ào về một vấn đề CÓ THẬT không phải một báo động giả',
            ),
            B(
              'Nothing problematic. 500 ms is a widely accepted industry standard for interactive APIs, and adopting a shared threshold is what makes it possible to compare your service against others and to onboard someone who has worked elsewhere without re-explaining every number',
              'Chẳng có gì trục trặc. 500 ms là một chuẩn ngành được chấp nhận rộng rãi cho các API tương tác, và dùng một ngưỡng chung là thứ cho phép bạn so dịch vụ của mình với các dịch vụ khác và cho phép một người từng làm nơi khác vào việc mà không phải giải thích lại từng con số',
            ),
            B(
              'It fires only during traffic spikes, since p99 rises with load, so it behaves as a de-facto capacity alarm; the threshold is arbitrary but the behaviour is useful, and this is why copied thresholds survive in practice even though they cannot be justified from first principles',
              'Nó chỉ nổ trong các cơn dồn lưu lượng, vì p99 tăng theo tải, nên nó hành xử như một cái chuông báo công suất trên thực tế; ngưỡng thì tuỳ tiện nhưng hành vi thì hữu ích, và đó là lý do các ngưỡng chép lại vẫn sống sót trong thực tế dù không biện minh được từ nguyên tắc đầu tiên',
            ),
            B(
              'It fires from the day it is created and never stops, because 989 &gt; 500 is this service\'s <em>normal</em>. Two outcomes follow, both bad: it gets muted permanently, or it gets raised to 1,200 ms — <b>a number now chosen to make the noise stop rather than by anything about users</b>. A threshold with no derivation cannot be defended, cannot be tuned and cannot be explained to the next person; derive it instead from the worst normal hour over a fortnight times 1.5, or from a requirement you can state out loud',
              'Nó nổ từ ngày được tạo ra và không bao giờ ngừng, vì 989 &gt; 500 chính là mức BÌNH THƯỜNG của dịch vụ này. Hai kết cục theo sau, cả hai đều tệ: nó bị tắt tiếng vĩnh viễn, hoặc nó bị nâng lên 1.200 ms — <b>một con số giờ được chọn để làm cho tiếng ồn im đi chứ không phải chọn theo bất cứ điều gì về người dùng</b>. Một ngưỡng không có phép suy ra thì không bảo vệ được, không chỉnh được và không giải thích được cho người sau; hãy suy nó ra từ giờ bình thường tệ nhất trong hai tuần nhân 1,5, hoặc từ một yêu cầu mà bạn phát biểu thành lời được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Almost every alert threshold in existence was copied from somewhere: round numbers, no provenance. The failure is not that the number is too low, it is that it has no <em>derivation</em>, so nobody can decide six months later whether it is still right. Both escape routes make things worse. Muting is a two-second action with no expiry and no owner, and the condition that made it noisy never gets fixed because the noise stopped — six months later the same alert has genuine cause to fire and does not, and the postmortem records "we had no alerting for this" when in fact you had excellent alerting that someone reasonable turned off at 2am. Raising it to 1,200 ms is worse in a quieter way: it looks like tuning and it is not, because 1,200 was chosen by the alert rather than by you. Two honest sources exist. From data: take the worst <em>normal</em> hour over two weeks and multiply by about 1.5, then write the derivation into the annotation — "1.5× the worst hour observed in the fortnight before 2026-08-25, when p99 peaked at 1.31 s" is the sentence that lets the next person decide. But note the trap in that method: <b>a threshold derived from a fortnight encodes whatever was broken during that fortnight</b>, and the worse your service was, the more permissive the alert you derive. Where you can state the requirement — "a note must save in under a second" — the second source is better, because a number from a requirement does not inherit yesterday&#39;s bugs.',
            'Gần như mọi ngưỡng cảnh báo đang tồn tại đều được chép từ đâu đó: số tròn, không nguồn gốc. Cú hỏng không nằm ở chỗ con số quá thấp, mà ở chỗ nó không có PHÉP SUY RA, nên sáu tháng sau chẳng ai quyết được nó còn đúng hay không. Cả hai lối thoát đều làm mọi thứ tệ hơn. Tắt tiếng là một hành động hai giây, không hạn dùng và không chủ sở hữu, còn cái điều kiện làm nó ồn thì không bao giờ được sửa vì tiếng ồn đã im — sáu tháng sau đúng cảnh báo ấy có lý do thật để nổ mà không nổ, và biên bản ghi "chúng ta không có cảnh báo cho chuyện này" trong khi thật ra bạn ĐÃ CÓ một hệ cảnh báo xuất sắc bị một người hợp lý tắt đi lúc 2 giờ sáng. Nâng lên 1.200 ms thì tệ hơn theo một cách lặng lẽ hơn: nó TRÔNG như đang chỉnh mà không phải, vì 1.200 do chính cái cảnh báo chọn chứ không phải do bạn. Có hai nguồn trung thực. Từ DỮ LIỆU: lấy giờ BÌNH THƯỜNG tệ nhất trong hai tuần rồi nhân khoảng 1,5, rồi viết phép suy ra vào phần chú thích — "1,5 lần giờ tệ nhất quan sát được trong hai tuần trước 25/08/2026, khi p99 đạt đỉnh 1,31 s" chính là cái câu cho phép người sau ra quyết định. Nhưng hãy để ý cái bẫy trong phương pháp ấy: <b>một ngưỡng suy ra từ hai tuần sẽ mã hoá luôn mọi thứ đang hỏng trong hai tuần đó</b>, và dịch vụ của bạn càng tệ thì cảnh báo bạn suy ra càng dễ dãi. Ở đâu bạn phát biểu được yêu cầu — "một ghi chú phải lưu xong dưới một giây" — thì nguồn thứ hai tốt hơn, vì một con số đến từ yêu cầu thì không thừa kế các bug của hôm qua.',
          ),
        }),

        // q41 · đáp án 0
        mcq({
          prompt: B(
            'You choose a <b>99.9% SLO</b> over a 30-day window. <b>How much downtime does that permit, and how fast does a total outage spend it?</b>',
            'Bạn chọn <b>SLO 99,9%</b> trên cửa sổ 30 ngày. <b>Nó cho phép bao nhiêu thời gian chết, và một cú sập toàn phần tiêu hết nó nhanh thế nào?</b>',
          ),
          options: [
            B(
              '<b>43 minutes per month</b> — and a total outage burns at <b>1000×</b>, so it exhausts the entire budget in exactly those 43 minutes, which is the same number arriving from the other direction. That is why one bad deploy needing a ten-minute rollback spends a quarter of the month, and why 99.99% (4 minutes, total, including every deploy and every Postgres restart) is not achievable on one VPS with manual deploys — choosing it anyway makes the SLO decoration',
              '<b>43 phút mỗi tháng</b> — và một cú sập toàn phần đốt ở tốc độ <b>1000×</b>, nên nó tiêu sạch cả ngân sách trong đúng 43 phút ấy, tức cùng một con số đi tới từ hướng ngược lại. Đó là lý do MỘT lần deploy hỏng cần mười phút để lùi lại đã tiêu một phần tư của tháng, và là lý do 99,99% (4 phút, tổng cộng, tính cả mọi lần deploy và mọi lần khởi động lại Postgres) là bất khả thi trên một VPS với deploy thủ công — chọn nó bất chấp là biến SLO thành đồ trang trí',
            ),
            B(
              '43 minutes per month, and a total outage would take about a week to exhaust it, because the budget is expressed as a fraction of <em>requests</em> rather than of time and a service that is down serves no requests to count against it',
              '43 phút mỗi tháng, và một cú sập toàn phần sẽ mất khoảng một tuần mới tiêu hết, vì ngân sách được diễn đạt theo tỉ lệ SỐ REQUEST chứ không theo thời gian và một dịch vụ đang chết thì chẳng phục vụ request nào để mà tính vào',
            ),
            B(
              '7.2 hours per month, the same as a 99% SLO, because the extra nine only tightens the target for the latency SLI while the availability budget is defined by the coarser tier; the two numbers are commonly confused for exactly this reason',
              '7,2 giờ mỗi tháng, y như SLO 99%, vì con số chín thêm vào chỉ siết mục tiêu cho SLI độ trễ còn ngân sách sẵn-sàng thì được định nghĩa theo bậc thô hơn; hai con số này hay bị lẫn với nhau chính vì lý do đó',
            ),
            B(
              'It cannot be stated in minutes at all — an SLO is a ratio, so the permitted downtime depends entirely on traffic volume, and the same 99.9% allows far more absolute downtime on a busy service than on a quiet one',
              'Hoàn toàn không phát biểu được thành phút — một SLO là một TỈ LỆ, nên thời gian chết được phép phụ thuộc hoàn toàn vào khối lượng lưu lượng, và cùng mức 99,9% cho phép nhiều thời gian chết tuyệt đối hơn hẳn trên một dịch vụ đông khách so với một dịch vụ vắng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The arithmetic is the point: 30 days is 43,200 minutes, and 0.1% of that is 43.2. Read it against how this repository is actually operated — deploys run from a laptop, a container restart is seconds, but a bad deploy needing a rollback is easily ten minutes, which is a quarter of the month for <em>one</em> bad deploy. Then read the 99.99% row: four minutes per month, total, including every deploy, every Postgres restart and every VPS reboot. That target is not reachable here, and an SLO you routinely miss tells you nothing when you miss it. The burn-rate framing is what turns this single number into every threshold you need: burn rate is how fast you are spending relative to spending evenly, so 1× exhausts the budget in 30 days, 10× in 3 days, and 1000× — a total outage — in 43 minutes. Two alert rules then replace a dozen: a fast one requiring both a 1-hour and a 5-minute window over 14.4× (the short window detects in about five minutes instead of twenty; the long one filters transients without a <code>for:</code> delay), and a slow one on a 3-day window over 1× that opens a ticket. Every threshold in both traces back to the <code>0.001</code>, so changing the SLO moves all of them consistently and no individual number ever has to be defended again.',
            'Phép tính chính là điểm mấu chốt: 30 ngày là 43.200 phút, và 0,1% của nó là 43,2. Hãy đọc nó đối chiếu với cách kho này thật sự được vận hành — deploy chạy từ một cái laptop, khởi động lại một container mất vài giây, nhưng một lần deploy hỏng cần lùi lại thì dễ dàng mất mười phút, tức một phần tư của tháng cho MỘT lần deploy hỏng. Rồi hãy đọc hàng 99,99%: bốn phút mỗi tháng, tổng cộng, tính cả mọi lần deploy, mọi lần khởi động lại Postgres và mọi lần khởi động lại VPS. Mục tiêu đó không với tới được ở đây, và một SLO mà bạn thường xuyên trượt thì chẳng nói cho bạn điều gì lúc bạn trượt nó. Cách nhìn theo TỐC ĐỘ ĐỐT là thứ biến một con số duy nhất này thành mọi ngưỡng bạn cần: tốc độ đốt là tốc độ tiêu so với tiêu đều, nên 1× tiêu hết ngân sách trong 30 ngày, 10× trong 3 ngày, và 1000× — một cú sập toàn phần — trong 43 phút. Hai luật cảnh báo khi ấy thay được cả tá: một luật nhanh đòi CẢ cửa sổ 1 giờ LẪN cửa sổ 5 phút cùng vượt 14,4× (cửa sổ ngắn phát hiện trong khoảng năm phút thay vì hai mươi; cửa sổ dài lọc các cú thoáng qua mà không cần độ trễ <code>for:</code>), và một luật chậm trên cửa sổ 3 ngày vượt 1× thì mở một phiếu việc. Mọi ngưỡng trong cả hai đều truy về được cái <code>0,001</code>, nên đổi SLO là mọi con số dịch chuyển nhất quán và không con số riêng lẻ nào phải đem ra bảo vệ lại lần nữa.',
          ),
        }),

        // q42 · đáp án 2
        mcq({
          prompt: B(
            'A frontend deploy breaks the login form URL. Backend request rate drops 90%, error rate is zero, p99 latency is excellent, the event loop is idle and memory is low. <b>Which metric notices, and what does that tell you about your metric set?</b>',
            'Một lần deploy frontend làm hỏng URL của form đăng nhập. Tốc độ request của backend tụt 90%, tỉ lệ lỗi bằng không, p99 độ trễ tuyệt vời, vòng lặp sự kiện nhàn rỗi và bộ nhớ thấp. <b>Chỉ số nào nhận ra, và điều đó nói gì về bộ chỉ số của bạn?</b>',
          ),
          options: [
            B(
              'The error rate, which spikes from the failed posts hitting a route that no longer exists; a 404 is still recorded by the metrics middleware under the <code>unmatched</code> label, so the drop in successful traffic is exactly matched by a rise in unmatched requests and the two curves cross at the moment of the deploy',
              'Tỉ lệ lỗi, thứ vọt lên từ các lượt post hỏng đánh vào một route không còn tồn tại; một cú 404 vẫn được middleware chỉ số ghi lại dưới nhãn <code>unmatched</code>, nên phần lưu lượng thành công tụt xuống được bù bởi phần request không khớp tăng lên',
            ),
            B(
              'p99 latency, which rises whenever fewer requests are served because the fixed per-scrape overhead is amortised over a smaller denominator and the slow tail becomes a larger fraction of what remains',
              'p99 độ trễ, thứ tăng lên mỗi khi ít request được phục vụ hơn, vì phần chi phí cố định mỗi lượt thu thập được chia trên một mẫu số nhỏ hơn và cái đuôi chậm trở thành một phần lớn hơn trong số còn lại',
            ),
            B(
              '<code>logins_total</code>, flat at zero. Every <em>system</em> metric is green — several are the greenest they have ever been — because a traffic drop is indistinguishable from a quiet Sunday unless you are counting something that is <b>supposed to happen</b>. Metrics 1–10 measure the system; two or three business counters measure whether it does its job, and they are the only ones that fire when the failure is "nobody can reach us". The alert that catches this is the one that fires when a number goes to <em>zero</em>',
              '<code>logins_total</code>, nằm phẳng ở không. Mọi chỉ số HỆ THỐNG đều xanh — vài cái còn xanh nhất từ trước tới nay — vì một cú tụt lưu lượng không phân biệt nổi với một ngày chủ nhật vắng khách trừ khi bạn đang ĐẾM một thứ LẼ RA PHẢI XẢY RA. Chỉ số 1–10 đo hệ thống; hai ba bộ đếm nghiệp vụ đo xem nó có làm được việc của nó không, và chúng là những cái duy nhất nổ khi cú hỏng là "chẳng ai với tới được mình". Cảnh báo bắt được chuyện này là cảnh báo nổ khi một con số về KHÔNG',
            ),
            B(
              'Event-loop lag, which detects the reduced load as an anomaly against its own baseline; a process that suddenly has nothing to do shows a lag distribution far below its normal range, and that shift is what an anomaly-detection rule is for',
              'Độ trễ vòng lặp sự kiện, thứ phát hiện tải giảm như một dị thường so với chính đường nền của nó; một tiến trình đột nhiên chẳng có việc gì làm sẽ có phân bố độ trễ thấp hơn hẳn khoảng bình thường, và chính sự dịch chuyển đó là thứ một luật phát hiện dị thường sinh ra để bắt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Every other alert in this course fires when a number goes <em>up</em>. This one fires when a number goes to zero — and zero is exactly what a broken frontend, a DNS misconfiguration, an expired certificate and a Cloudflare origin failure all look like from inside your backend. That is the shape chapter 11 calls <em>silence</em>, and its defining property is that no system metric can see it: request rate down and error rate at zero is also what a genuinely quiet night looks like. Option 1 is the tempting one, and it is wrong for a specific reason worth knowing: the requests never arrive at all, because the frontend is posting somewhere else entirely, so there is nothing for the metrics middleware to record. Pick two or three numbers that represent your product <em>working</em> — logins, notes created, one AI-feature completion — and put them on the same dashboard as the system metrics. The alert wants care in one respect: <code>sum(rate(http_requests_total[5m])) &lt; 0.1</code> is the one most likely to false-fire at 4am on a low-traffic service, which is why the business version is better. Fifteen minutes with zero successful logins is a real signal at any hour, and a window that long is what stops a genuine quiet period from tripping it.',
            'Mọi cảnh báo khác trong khoá này đều nổ khi một con số ĐI LÊN. Cái này nổ khi một con số về KHÔNG — và số không đúng là thứ mà một frontend hỏng, một cấu hình DNS sai, một chứng chỉ hết hạn và một cú Cloudflare đánh dấu máy gốc chết đều trông giống nhau khi nhìn từ bên trong backend của bạn. Đó là hình dạng mà chương 11 gọi là SỰ IM LẶNG, và tính chất định danh của nó là không chỉ số hệ thống nào nhìn thấy được: tốc độ request tụt và tỉ lệ lỗi bằng không cũng chính là bộ mặt của một đêm vắng khách thật sự. Phương án 1 là cái hấp dẫn, và nó sai vì một lý do cụ thể đáng biết: các request KHÔNG HỀ TỚI, vì frontend đang post đi một nơi hoàn toàn khác, nên chẳng có gì để middleware chỉ số ghi lại. Hãy chọn hai hoặc ba con số đại diện cho việc sản phẩm của bạn ĐANG CHẠY — số lượt đăng nhập, số ghi chú được tạo, một phép đếm hoàn tất của một tính năng AI — rồi đặt chúng lên cùng bảng theo dõi với các chỉ số hệ thống. Cái cảnh báo này cần cẩn thận ở một điểm: <code>sum(rate(http_requests_total[5m])) &lt; 0.1</code> là cái dễ báo động giả nhất lúc 4 giờ sáng trên một dịch vụ ít lưu lượng, và đó là lý do bản nghiệp vụ tốt hơn. Mười lăm phút không một lượt đăng nhập thành công là một tín hiệu thật ở bất kỳ giờ nào, và một cửa sổ dài như thế chính là thứ ngăn một quãng vắng khách thật sự làm nó nổ oan.',
          ),
        }),

        // q43 · đáp án 1
        mcq({
          prompt: B(
            'An alert has fired eleven times in three months and never once led to a human doing anything. Separately, all three of your page-level alerts route to a Slack channel. <b>What should change?</b>',
            'Một cảnh báo đã nổ mười một lần trong ba tháng và chưa một lần nào dẫn tới việc một con người làm gì đó. Riêng chuyện khác: cả ba cảnh báo mức gọi-dậy của bạn đều được định tuyến vào một kênh Slack. <b>Cái gì cần đổi?</b>',
          ),
          options: [
            B(
              'Raise the threshold on the noisy alert until it stops firing, and add a Slack integration that pings the on-call user by name so the notification is not lost in channel traffic; both changes preserve the existing coverage while removing the noise, and neither requires you to give up a rule that might yet catch something real',
              'Nâng ngưỡng của cảnh báo ồn ào lên tới khi nó ngừng nổ, và thêm một tích hợp Slack gọi tên người đang trực để thông báo không bị chìm trong dòng tin của kênh; cả hai thay đổi đều giữ nguyên phần phủ hiện có trong khi loại bỏ tiếng ồn',
            ),
            B(
              '<b>Delete the alert</b>, or demote it to a morning digest — not "tune it". Every non-actionable alert lowers your actionable rate, and below about 30% you are skimming and will miss the real one; a deleted alert is honest while a muted one is a lie that survives into the next incident. And Slack is <b>not paging</b>: it is read when someone opens the app, which at 3am is nobody. The review then records "we were alerted at 02:14" when a message was written at 02:14 and read at 09:30 — either route to something that rings against Do Not Disturb, or state the response time honestly and set the SLO to match',
              '<b>XOÁ cái cảnh báo đó đi</b>, hoặc hạ nó xuống một bản tóm tắt buổi sáng — chứ không phải "chỉnh nó". Mọi cảnh báo không-hành-động-được đều hạ tỉ lệ hành-động-được của bạn xuống, và dưới khoảng 30% thì bạn đang đọc lướt và sẽ bỏ lỡ cái thật; một cảnh báo đã XOÁ thì trung thực, còn một cái bị TẮT TIẾNG là một lời nói dối sống sót sang tận sự cố kế tiếp. Và Slack KHÔNG PHẢI là hệ gọi dậy: nó được đọc khi có người mở ứng dụng, mà lúc 3 giờ sáng thì chẳng có ai. Biên bản khi ấy ghi "chúng ta được cảnh báo lúc 02:14" trong khi một thông điệp được VIẾT lúc 02:14 và được ĐỌC lúc 09:30 — hoặc định tuyến sang một thứ reo được bất chấp chế độ Không làm phiền, hoặc nói thẳng thời gian phản hồi và đặt SLO cho khớp',
            ),
            B(
              'Mute the alert for a quarter and revisit it then, and move the Slack notifications into a dedicated incident channel with no other traffic; muting with a review date is the standard practice, because deleting the rule loses the history of why it was written in the first place and the next person will only have to rediscover it',
              'Tắt tiếng cảnh báo đó một quý rồi xem lại, và dời các thông báo Slack sang một kênh sự cố riêng không có lưu lượng nào khác; tắt tiếng kèm một ngày rà lại là thực hành chuẩn vì xoá đi thì mất luôn lịch sử về việc vì sao cái luật đó tồn tại',
            ),
            B(
              'Keep the alert — one that never causes work is free, and it may yet catch something — and keep Slack, since Slack notifications are push notifications delivered by the operating system exactly like an SMS, so the delivery guarantee is identical and only the presentation differs; a phone that is unlocked will surface either one the same way',
              'Giữ cái cảnh báo — một cái chẳng gây ra việc gì thì miễn phí, và biết đâu nó vẫn bắt được cái gì đó — và giữ Slack, vì thông báo Slack là thông báo đẩy do hệ điều hành giao y hệt một tin nhắn SMS, nên bảo đảm giao nhận là như nhau và chỉ khác cách trình bày',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Alerting systems do not fail by missing something; they fail by being right too often about things that did not matter, until the recipient stops reading. The decay has five steps and every one of them is the rational response to the previous one, which is what makes fatigue dangerous — it is not laziness, it is correct behaviour applied to a badly calibrated system. The number to watch is the <em>actionable rate</em>: above 70% you trust the pager, below 30% the alerts are decoration. Eleven firings and zero actions is a rule that should not exist, and "delete" rather than "tune" is the right verb because you can always add it back when you have a reason, whereas a muted rule sits there looking like coverage. On the routing half, the gap between "notified" and "noticed" is invisible in every tool and is the entire difference between having paging and thinking you do — and it interacts directly with chapter 9&#39;s arithmetic, because 99.9% is 43 minutes a month and an eight-hour response time cannot meet it. For a team of one there is a further constraint worth stating out loud: you are not on-call, you are <em>reachable, sometimes</em>, so the honest design is at most three page-level rules and a quiet default that batches everything else into a morning digest. Most of the rest have better answers than waking someone — retry, degrade, shed, queue — and each of those removes an alert permanently, which is a far better use of an hour than tuning one that should not exist.',
            'Các hệ cảnh báo không hỏng vì bỏ sót thứ gì; chúng hỏng vì ĐÚNG QUÁ THƯỜNG XUYÊN về những thứ chẳng đáng kể, cho tới khi người nhận thôi đọc. Sự suy tàn có năm bước và mỗi bước đều là phản ứng hợp lý với bước trước, và chính điều đó làm sự mệt mỏi trở nên nguy hiểm — nó không phải lười biếng, nó là hành vi ĐÚNG áp lên một hệ thống hiệu chỉnh tồi. Con số cần theo dõi là TỈ LỆ HÀNH-ĐỘNG-ĐƯỢC: trên 70% thì bạn tin cái máy gọi, dưới 30% thì các cảnh báo chỉ là đồ trang trí. Mười một lần nổ và không lần nào hành động là một luật lẽ ra không nên tồn tại, và "xoá" chứ không phải "chỉnh" mới là động từ đúng, vì bạn luôn thêm lại được khi có lý do, trong khi một luật bị tắt tiếng thì cứ nằm đó trông như đang phủ. Về nửa định tuyến, cái khoảng cách giữa "đã được báo" và "đã nhận ra" là vô hình trong mọi công cụ và là toàn bộ khác biệt giữa việc CÓ hệ gọi dậy và việc NGHĨ rằng mình có — và nó tương tác thẳng với phép tính ở chương 9, vì 99,9% là 43 phút một tháng mà thời gian phản hồi tám tiếng thì không đáp ứng nổi. Với một đội một người còn một ràng buộc nữa đáng nói thành lời: bạn KHÔNG trực ca, bạn chỉ LIÊN LẠC ĐƯỢC, ĐÔI KHI, nên thiết kế trung thực là nhiều nhất ba luật mức gọi-dậy và một mặc định IM LẶNG gom mọi thứ còn lại vào một bản tóm tắt buổi sáng. Phần lớn số còn lại có những lời đáp tốt hơn việc đánh thức ai đó — thử lại, hạ cấp, xả bớt, xếp hàng — và mỗi cái trong số đó gỡ bỏ một cảnh báo VĨNH VIỄN, một cách dùng một giờ đồng hồ tốt hơn nhiều so với việc đi chỉnh một cảnh báo lẽ ra không nên tồn tại.',
          ),
        }),

        /* ── Chương 10 — bảng theo dõi người ta thật sự đọc (3 câu) ──────── */

        // q44 · đáp án 3
        mcq({
          prompt: B(
            'A p99 latency panel shows a <b>4-second spike at a 1-hour zoom</b> and <b>400 ms at a 7-day zoom</b>, for the same incident. <b>What is happening?</b>',
            'Một ô đồ thị p99 độ trễ hiện ra <b>một cú vọt 4 giây khi thu phóng ở 1 giờ</b> và <b>400 ms khi thu phóng ở 7 ngày</b>, cho cùng một sự cố. <b>Chuyện gì đang xảy ra?</b>',
          ),
          options: [
            B(
              'The 7-day view is the correct one and the 1-hour view is noise: a percentile computed over a short window has very few samples per bucket, so it is dominated by outliers, and widening the window is exactly how you get a statistically sound estimate',
              'Khung 7 ngày mới đúng còn khung 1 giờ là nhiễu: một phân vị tính trên cửa sổ ngắn có rất ít mẫu trong mỗi ô, nên nó bị các giá trị ngoại lai chi phối, và nới cửa sổ ra chính là cách bạn có được một ước lượng vững về mặt thống kê',
            ),
            B(
              'Prometheus downsamples any data older than 24 hours into 5-minute aggregates to bound its storage, so the original resolution genuinely no longer exists at the wider range; the fix is to raise the retention resolution or to use a remote-write store that keeps raw samples',
              'Prometheus hạ mẫu mọi dữ liệu cũ hơn 24 giờ xuống thành các bản gộp 5 phút để chặn dung lượng lưu, nên độ phân giải gốc thật sự không còn tồn tại ở khung rộng hơn; cách chữa là nâng độ phân giải lưu trữ hoặc dùng một kho remote-write giữ lại mẫu thô',
            ),
            B(
              'The spike was a scrape failure rather than real latency: the target timed out, the histogram had no new observations, and <code>histogram_quantile</code> extrapolated from stale buckets; at the wider zoom the gap is averaged away and the honest value returns',
              'Cú vọt đó là một lượt thu thập hỏng chứ không phải độ trễ thật: cái đích hết giờ, histogram không có mẫu mới nào, và <code>histogram_quantile</code> ngoại suy từ các ô cũ; ở khung rộng hơn thì khoảng trống bị san phẳng đi và giá trị trung thực quay lại',
            ),
            B(
              'The panel is <b>averaging p99 values</b> to fit more points into each pixel — the "you cannot average percentiles" trap, arriving as a UI behaviour — so an incident visibly <em>shrinks</em> as you widen the range and a week-long view of a bad week looks calm. Fix it mechanically: aggregate the <em>buckets</em> over the wider window and compute the quantile <b>last</b>, with ' + c('histogram_quantile(0.99, sum by (le) (rate(..._bucket[$__rate_interval])))') + ', where the variable scales the window with the zoom level',
              'Cái ô đang <b>lấy TRUNG BÌNH của các giá trị p99</b> để nhét nhiều điểm hơn vào mỗi điểm ảnh — cái bẫy "không được lấy trung bình các phân vị", xuất hiện dưới dạng một hành vi giao diện — nên một sự cố CO LẠI thấy rõ khi bạn nới khung ra và một khung nhìn bảy ngày của một tuần tồi tệ trông lại yên ả. Hãy chữa nó một cách máy móc: gộp CÁC Ô trên cửa sổ rộng hơn rồi tính phân vị SAU CÙNG, bằng ' + c('histogram_quantile(0.99, sum by (le) (rate(..._bucket[$__rate_interval])))') + ', trong đó cái biến ấy co giãn cửa sổ theo mức thu phóng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Every chart in this class of problem is drawn from correct data by correctly-written software, which is what makes it dangerous: there is no bug to find, and the wrong conclusion feels like a discovery. Grafana renders one point per pixel, so widening the range forces it to combine buckets, and the naive combination is a mean of p99 values — which is not the p99 of the week, it is the average of hourly p99s, and it gets systematically lower the further you zoom out. The practical symptom is precise and awkward: an incident shrinks as you widen the view, so a retrospective a week later reads as if nothing much happened. The fix is the same ordering rule that makes histograms aggregate at all — <b>sum the buckets, then take the quantile</b> — and <code>$__rate_interval</code> is what makes the window follow the zoom automatically. Five other lies live on the same dashboard and are worth naming together: an auto-scaled y-axis that turns a 0.04-point wiggle into a spike, a counter plotted raw so it only ever rises, an error count with no denominator, a gap that means "we stopped receiving data" rather than "traffic stopped", and a legend showing Mean while the line shows p99 — the line is honest and the number under it is not, and people read the number.',
            'Mọi biểu đồ thuộc lớp vấn đề này đều được vẽ từ dữ liệu ĐÚNG bởi phần mềm viết ĐÚNG, và chính điều đó làm nó nguy hiểm: chẳng có cái bug nào để tìm, còn kết luận sai thì có cảm giác như một phát hiện. Grafana vẽ một điểm cho mỗi điểm ảnh, nên nới khung ra là buộc nó phải gộp các ô lại, và phép gộp ngây thơ là lấy TRUNG BÌNH của các giá trị p99 — thứ không phải p99 của cả tuần, mà là trung bình của các p99 theo giờ, và nó thấp đi một cách có hệ thống càng nới ra càng thấp. Triệu chứng thực tế thì chính xác và khó chịu: một sự cố CO LẠI khi bạn nới khung nhìn, nên một bản nhìn lại sau một tuần đọc lên như thể chẳng có chuyện gì đáng kể. Cách chữa vẫn là cái luật thứ tự làm cho histogram gộp được — <b>cộng các ô lại, RỒI mới lấy phân vị</b> — và <code>$__rate_interval</code> là thứ làm cửa sổ tự đi theo mức thu phóng. Năm lời nói dối khác sống trên cùng cái bảng ấy và đáng gọi tên cùng nhau: một trục y tự co giãn biến một dao động 0,04 điểm thành một cú vọt, một counter vẽ thô nên chỉ có đi lên, một số đếm lỗi không có mẫu số, một khoảng trống thật ra nghĩa là "chúng ta ngừng NHẬN dữ liệu" chứ không phải "lưu lượng dừng", và một chú giải hiện Mean trong khi đường thì vẽ p99 — cái đường thì trung thực còn con số dưới nó thì không, mà người ta đọc con số.',
          ),
        }),

        // q45 · đáp án 0
        mcq({
          prompt: B(
            'Measured on Prometheus v3.5.0, against a histogram that is definitely receiving data:' +
            code(
              'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[1m])))\n' +
              '  →  status "success",  1 series,  value 0.95\n' +
              '\n' +
              'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])))\n' +
              '  →  status "success",  0 series') +
            '<b>What did dropping <code>by (le)</code> do, and why is this dangerous?</b>',
            'Đo trên Prometheus v3.5.0, trên một histogram chắc chắn đang nhận dữ liệu:' +
            code(
              'histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[1m])))\n' +
              '  →  trạng thái "success",  1 chuỗi,  giá trị 0,95\n' +
              '\n' +
              'histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[1m])))\n' +
              '  →  trạng thái "success",  0 chuỗi') +
            '<b>Việc bỏ <code>by (le)</code> đã làm gì, và vì sao chuyện này nguy hiểm?</b>',
          ),
          options: [
            B(
              '<code>sum()</code> without <code>by (le)</code> discards the <code>le</code> label, and <code>histogram_quantile</code> needs it to know which boundary each count belongs to — with no <code>le</code> there is no histogram left, only one number. The danger is that this is <b>not an error</b>: the query reports <code>success</code> and returns an empty result, so a Grafana panel built on it renders a blank graph that is indistinguishable from "no traffic", and an alert rule built on it <b>never fires</b>, silently, forever',
              '<code>sum()</code> không kèm <code>by (le)</code> đã VỨT BỎ nhãn <code>le</code>, mà <code>histogram_quantile</code> cần nó để biết mỗi số đếm thuộc về ranh giới nào — không có <code>le</code> thì chẳng còn histogram nào nữa, chỉ còn MỘT con số. Mối nguy là chuyện này <b>KHÔNG PHẢI MỘT LỖI</b>: truy vấn báo <code>success</code> và trả về kết quả rỗng, nên một ô Grafana dựng trên nó vẽ ra một đồ thị trống không phân biệt nổi với "không có lưu lượng", còn một luật cảnh báo dựng trên nó thì <b>KHÔNG BAO GIỜ NỔ</b>, một cách âm thầm, mãi mãi',
            ),
            B(
              'Prometheus returned a parse error, which the HTTP API reports with <code>status: "error"</code> and an empty data block; the panel would show a red banner naming the missing grouping label, so the mistake is caught the first time anybody opens the dashboard',
              'Prometheus trả về một lỗi phân giải, thứ mà HTTP API báo bằng <code>status: "error"</code> kèm một khối dữ liệu rỗng; cái ô đồ thị sẽ hiện một dải đỏ nêu tên cái nhãn gộp bị thiếu, nên sai lầm bị bắt ngay lần đầu có người mở bảng theo dõi',
            ),
            B(
              'It computed the quantile over the total observation count instead of over the buckets, which returns a number that is always equal to the largest boundary; the zero series here is a separate problem caused by the 1-minute window being shorter than the scrape interval',
              'Nó tính phân vị trên tổng số lượt quan sát thay vì trên các ô, thứ luôn trả về một con số bằng ranh giới lớn nhất; còn chuyện không có chuỗi nào ở đây là một vấn đề riêng do cửa sổ 1 phút ngắn hơn chu kỳ thu thập',
            ),
            B(
              'Nothing meaningful — the two forms are equivalent and Prometheus optimises them into the same query plan; the empty result comes from the histogram having no observations inside that particular minute, and re-running it a moment later returns the same 0.95',
              'Chẳng có gì đáng kể — hai dạng đó tương đương và Prometheus tối ưu chúng thành cùng một kế hoạch truy vấn; kết quả rỗng đến từ việc histogram không có lượt quan sát nào trong đúng cái phút ấy, và chạy lại một lát sau sẽ trả về đúng 0,95',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The two queries were run back to back against the same live data, and the difference is one clause. <code>histogram_quantile</code> reads the <code>le</code> label off each input series to reconstruct the distribution; <code>sum()</code> with no <code>by</code> collapses every bucket into a single total and throws the label away, so the function is handed something that is not a histogram and returns nothing. The measurement also confirms it is not a syntax error — the API reports <code>success</code>, because the query is perfectly well-formed and simply matched nothing. That is what makes this belong in a chapter about charts that lie: <b>an empty result and a "no traffic" result are rendered identically</b>, and an alert whose expression returns no series is an alert that will never fire, with nothing anywhere to tell you. Two habits catch it. First, before trusting any new histogram query, run it once and check the series count rather than the picture. Second, put <code>up{job="…"}</code> on the investigation dashboard — it is the panel that tells you whether to trust the other fourteen, because a scrape timeout puts a gap in every metric from that target while <code>up=0</code> says the gap is yours rather than the traffic&#39;s.',
            'Hai truy vấn được chạy liền nhau trên cùng một tập dữ liệu đang sống, và khác biệt là một mệnh đề. <code>histogram_quantile</code> đọc nhãn <code>le</code> trên từng chuỗi đầu vào để dựng lại phân bố; <code>sum()</code> không kèm <code>by</code> thì gộp mọi ô thành một tổng duy nhất và VỨT cái nhãn đi, nên cái hàm được trao cho một thứ không phải histogram và trả về không gì cả. Phép đo cũng xác nhận đây KHÔNG phải lỗi cú pháp — API báo <code>success</code>, vì truy vấn hoàn toàn đúng khuôn và đơn giản là không khớp gì. Chính điều đó khiến nó thuộc về một chương nói về những đồ thị nói dối: <b>một kết quả RỖNG và một kết quả "không có lưu lượng" được vẽ ra y hệt nhau</b>, và một cảnh báo mà biểu thức của nó không trả về chuỗi nào là một cảnh báo sẽ không bao giờ nổ, chẳng có gì ở đâu báo cho bạn biết. Hai thói quen bắt được nó. Một, trước khi tin bất kỳ truy vấn histogram mới nào, hãy chạy nó một lần và KIỂM SỐ CHUỖI chứ đừng nhìn cái hình. Hai, hãy đặt <code>up{job="…"}</code> lên bảng theo dõi điều tra — nó là cái ô nói cho bạn biết có nên tin mười bốn ô còn lại hay không, vì một lượt thu thập hết giờ tạo khoảng trống trong MỌI chỉ số của cái đích đó còn <code>up=0</code> nói rằng khoảng trống ấy là của BẠN chứ không phải của lưu lượng.',
          ),
        }),

        // q46 · đáp án 2
        mcq({
          prompt: B(
            'A dashboard panel reads <b>"Errors: 47/min"</b> and nothing else. <b>Why is that a bad panel?</b>',
            'Một ô trên bảng theo dõi ghi <b>"Lỗi: 47/phút"</b> và không gì khác. <b>Vì sao đó là một cái ô tồi?</b>',
          ),
          options: [
            B(
              'Because per-minute is the wrong unit for Prometheus, whose <code>rate()</code> always returns a per-second figure; converting it for display introduces a rounding step that makes small error counts disappear entirely once they fall below one per minute',
              'Vì "mỗi phút" là đơn vị sai với Prometheus, nơi <code>rate()</code> luôn trả về con số theo GIÂY; quy đổi để hiển thị đưa vào một bước làm tròn khiến các số đếm lỗi nhỏ biến mất hoàn toàn khi dưới một lỗi mỗi phút',
            ),
            B(
              'Because error counts should always be shown cumulatively rather than as a rate, so that a burst which has already ended remains visible on the panel instead of decaying back to zero the moment it stops',
              'Vì số đếm lỗi luôn nên được hiện dạng LUỸ TÍCH thay vì dạng tốc độ, để một cơn bùng phát đã kết thúc vẫn còn nhìn thấy được trên cái ô thay vì tụt về không ngay khi nó dừng',
            ),
            B(
              'Because it has <b>no denominator</b>. At 5,000 req/min that is 0.94% and a normal Tuesday; at 60 req/min it is 78% and the site is on fire. The same number supports two opposite conclusions, and a panel that requires the reader to remember <em>another</em> panel will be misread under pressure. Show the ratio directly, or put the request rate in the same panel — and note the mirror-image trap: a percentage alone is just as bad, because 1% of 0.5 rps is one failed request and will page you at 4am',
              'Vì nó <b>KHÔNG CÓ MẪU SỐ</b>. Ở mức 5.000 req/phút thì đó là 0,94% và một ngày thứ Ba bình thường; ở mức 60 req/phút thì đó là 78% và cả trang đang cháy. Cùng một con số đỡ được hai kết luận ngược nhau, và một cái ô đòi người đọc phải NHỚ một cái ô KHÁC thì sẽ bị đọc sai khi đang chịu áp lực. Hãy hiện thẳng tỉ lệ, hoặc đặt tốc độ request vào cùng một ô — và hãy để ý cái bẫy phản chiếu: chỉ mỗi phần trăm thôi cũng tệ y như vậy, vì 1% của 0,5 rps là MỘT request hỏng và nó sẽ gọi bạn dậy lúc 4 giờ sáng',
            ),
            B(
              'Because 47 is too small a number to render usefully at dashboard scale: a single-stat panel needs enough digits for a colour threshold to be meaningful, and two-digit values make the threshold colours flicker between states on every refresh',
              'Vì 47 là con số quá nhỏ để vẽ cho có ích ở cỡ của một bảng theo dõi: một ô một-con-số cần đủ chữ số thì ngưỡng màu mới có ý nghĩa, và các giá trị hai chữ số làm màu ngưỡng nhấp nháy giữa các trạng thái ở mỗi lần làm mới',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A number without its denominator is not a measurement, it is a fact waiting for context, and a dashboard is read in the ten seconds when context is scarcest. The two readings are not close: 0.94% is inside normal variation and 78% is a total outage, and the panel gives no way to tell which one you are looking at. The same trap is what makes a percentage-only alert threshold wrong in the opposite direction — 1% of 500 rps is five failures a second and serious, while 1% of 0.5 rps is one request and nothing, and the low-traffic case fires constantly at exactly the hour nobody should be woken for one request. The robust form requires <em>both</em>: a ratio above the threshold <b>and</b> an absolute rate above a floor, so "at least six failures per minute" filters out the noise regardless of how large the percentage looks. The general habit behind this is the panel test: before adding anything, write the sentence "I am adding X so that when Y happens, I can tell A apart from B". A panel you cannot write that sentence for is decoration, and decoration is not free — it costs a slot in the reader&#39;s attention during the ten seconds when attention is scarcest.',
            'Một con số không có mẫu số thì không phải một phép đo, nó là một dữ kiện đang chờ ngữ cảnh, mà một bảng theo dõi lại được đọc trong đúng mười giây mà ngữ cảnh khan hiếm nhất. Hai cách đọc không hề gần nhau: 0,94% nằm trong dao động bình thường còn 78% là một cú sập toàn phần, và cái ô ấy chẳng cho cách nào biết bạn đang nhìn cái nào. Cùng cái bẫy đó làm cho một ngưỡng cảnh báo chỉ-theo-phần-trăm sai theo chiều ngược lại — 1% của 500 rps là năm cú hỏng mỗi giây và là chuyện nghiêm trọng, còn 1% của 0,5 rps là một request và chẳng là gì, mà ca ít lưu lượng thì nổ liên tục vào đúng cái giờ chẳng ai nên bị đánh thức vì một request. Dạng vững chắc đòi CẢ HAI: một tỉ lệ vượt ngưỡng VÀ một tốc độ tuyệt đối vượt một cái sàn, để "ít nhất sáu cú hỏng mỗi phút" lọc bỏ tiếng ồn bất kể cái phần trăm trông lớn tới đâu. Thói quen tổng quát đằng sau chuyện này là phép thử cho từng ô: trước khi thêm bất cứ thứ gì, hãy viết ra câu "tôi thêm X để khi Y xảy ra thì tôi phân biệt được A với B". Một cái ô mà bạn không viết nổi câu đó cho nó là đồ trang trí, và đồ trang trí không miễn phí — nó chiếm mất một chỗ trong sự chú ý của người đọc vào đúng mười giây mà sự chú ý khan hiếm nhất.',
          ),
        }),

        /* ── Chương 11 — chẩn đoán: từ cảnh báo tới nguyên nhân (3 câu) ─── */

        // q47 · đáp án 1
        mcq({
          prompt: B(
            'Uptime resets every <b>30–45 seconds</b>, on a regular rhythm, while the error rate sits flat at <b>100%</b>. <b>Which failure shape is this, and what does the period tell you?</b>',
            'Thời gian sống reset lại mỗi <b>30–45 giây</b>, theo một nhịp đều đặn, trong khi tỉ lệ lỗi nằm phẳng ở <b>100%</b>. <b>Đây là hình dạng hỏng hóc nào, và cái chu kỳ nói cho bạn điều gì?</b>',
          ),
          options: [
            B(
              'A ramp, meaning something is accumulating: memory, connections that are never released, or a queue growing faster than it drains. The regularity comes from the accumulation hitting a hard limit at a steady rate, and the confirmation is to extend the time range until the ramp begins',
              'Một cái DỐC, nghĩa là có thứ gì đó đang tích tụ: bộ nhớ, các kết nối không bao giờ được trả lại, hay một hàng đợi lớn nhanh hơn tốc độ rút. Sự đều đặn đến từ việc phần tích tụ chạm một giới hạn cứng ở một tốc độ ổn định, và cách xác nhận là nới khung thời gian ra tới khi cái dốc bắt đầu',
            ),
            B(
              'A <b>sawtooth</b>, and the regular period identifies the machine driving it. A period is machine-driven when it is regular at all, and 30–45 s matches a healthcheck at <code>interval: 15s</code> with <code>retries: 3</code> — so this is the liveness-probe restart loop, not a database outage. Read that before assuming the database is at fault, because <b>the restarts may be causing the database problem</b>. Other periods name other mechanisms: about 10 s is <code>stop_grace_period</code>, and minutes is usually memory filling at a steady rate',
              'Một hình RĂNG CƯA, và cái chu kỳ đều đặn ấy chỉ đích danh cái máy móc đang điều khiển nó. Một chu kỳ là do máy móc điều khiển khi nó ĐỀU, và 30–45 s khớp với một healthcheck ở <code>interval: 15s</code> với <code>retries: 3</code> — nên đây là vòng lặp khởi-động-lại của lượt thăm dò liveness, không phải một cú chết cơ sở dữ liệu. Hãy đọc điều đó TRƯỚC khi cho rằng cơ sở dữ liệu có lỗi, vì <b>chính các lần khởi động lại có thể đang GÂY RA vấn đề cho cơ sở dữ liệu</b>. Các chu kỳ khác chỉ tên các cơ chế khác: khoảng 10 s là <code>stop_grace_period</code>, còn vài phút thì thường là bộ nhớ đầy dần với tốc độ đều',
            ),
            B(
              'A spike train from a scheduled job. Cron entries and Prometheus scrapes both produce regular intervals, and a job that crashes the process on every run would restart it on exactly the job\'s own schedule; match the period against the crontab and the scrape interval before looking anywhere else',
              'Một CHUỖI GAI từ một việc chạy theo lịch. Các mục cron và các lượt thu thập của Prometheus đều tạo ra khoảng đều nhau, và một việc làm sập tiến trình ở mỗi lần chạy sẽ khởi động lại nó theo đúng lịch của chính cái việc ấy; hãy đối chiếu chu kỳ với crontab và chu kỳ thu thập trước khi nhìn đi đâu khác',
            ),
            B(
              'A cliff, since the failure started instantly and the error rate went straight to 100% with no ramp; the repeating uptime resets are a consequence of the cliff rather than a shape in their own right, and the investigation should focus on what changed at the first reset',
              'Một VÁCH ĐỨNG, vì cú hỏng bắt đầu tức thì và tỉ lệ lỗi lên thẳng 100% mà không có đoạn dốc nào; các lần reset thời gian sống lặp lại là HỆ QUẢ của cái vách chứ không phải một hình dạng riêng, và cuộc điều tra nên tập trung vào chuyện gì đã đổi ở lần reset đầu tiên',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The value of a shape library is that recognising the shape skips half the investigation, and a sawtooth has a property none of the other six do: <b>its period is a fingerprint</b>. Anything with a regular period is machine-driven, so the number identifies the machine — 30 to 45 seconds is 15-second interval times three retries, ~10 seconds is <code>stop_grace_period</code>, and minutes is usually memory filling at a steady rate until an OOM kill. An <em>irregular</em> period means it is load-driven rather than a loop, which is a different shape and a different chapter. What makes this particular one worth memorising is that it points the wrong way by default: every symptom says the database is unreachable, and the correct order of investigation is to read the probe configuration <em>first</em>, because a liveness probe that checks a dependency converts a twenty-second blip into a self-inflicted outage and the connection storm from restarting instances then keeps the database unhappy. Option 4 is not wrong so much as incomplete, and it names the real subtlety in this chapter: two shapes at once reads as one confusing shape. A deploy at 14:03 (cliff) that ships a bad image (sawtooth) is exactly the compound case, and the move is to separate them by time — identify the shape of the <em>first</em> five minutes and treat everything after as possibly a consequence, because the automatic reaction is almost always the more visible half and it steals the investigation.',
            'Giá trị của một thư viện hình dạng là nhận ra hình dạng thì bỏ qua được nửa cuộc điều tra, và hình răng cưa có một tính chất mà sáu cái kia không có: <b>chu kỳ của nó là một dấu vân tay</b>. Bất cứ thứ gì có chu kỳ ĐỀU đều là do máy móc điều khiển, nên con số ấy chỉ đích danh cái máy móc — 30 tới 45 giây là chu kỳ 15 giây nhân ba lần thử lại, khoảng 10 giây là <code>stop_grace_period</code>, còn vài phút thì thường là bộ nhớ đầy dần đều tới một cú giết vì hết bộ nhớ. Một chu kỳ KHÔNG ĐỀU nghĩa là nó do TẢI điều khiển chứ không phải một vòng lặp, tức một hình dạng khác và một chương khác. Thứ làm cái này đáng thuộc lòng là nó mặc định chỉ SAI HƯỚNG: mọi triệu chứng đều nói cơ sở dữ liệu không với tới được, còn thứ tự điều tra đúng là đọc CẤU HÌNH LƯỢT THĂM DÒ TRƯỚC, vì một lượt thăm dò liveness có kiểm phụ thuộc sẽ biến một cú chớp hai mươi giây thành một cú sập tự gây ra, rồi cơn bão kết nối từ các thực thể đang khởi động lại giữ cho cơ sở dữ liệu tiếp tục khổ sở. Phương án 4 không hẳn là sai mà là THIẾU, và nó gọi tên đúng cái tinh tế của chương này: hai hình dạng cùng lúc thì đọc lên thành MỘT hình dạng khó hiểu. Một lần deploy lúc 14:03 (vách đứng) đưa lên một cái ảnh hỏng (răng cưa) chính là ca ghép ấy, và nước đi là TÁCH CHÚNG THEO THỜI GIAN — nhận diện hình dạng của NĂM PHÚT ĐẦU rồi coi mọi thứ sau đó là có thể chỉ là hệ quả, vì phần phản ứng tự động gần như luôn là nửa dễ thấy hơn và nó cướp mất cuộc điều tra.',
          ),
        }),

        // q48 · đáp án 3
        mcq({
          prompt: B(
            'Errors track request rate exactly: busy periods have errors, quiet periods are clean. <b>How do you tell a capacity limit from a fixed percentage of requests hitting a bad code path — and why does the answer matter?</b>',
            'Số lỗi bám sát tốc độ request chính xác: lúc đông thì có lỗi, lúc vắng thì sạch. <b>Làm sao phân biệt một giới hạn công suất với việc một tỉ lệ CỐ ĐỊNH các request rơi vào một nhánh mã hỏng — và vì sao câu trả lời lại quan trọng?</b>',
          ),
          options: [
            B(
              'Check whether the errors are 4xx or 5xx. A capacity limit produces 5xx because the server gives up, while a bad code path usually produces 4xx because the request itself is what is wrong; the split tells you which side of the boundary to investigate and is available on the existing code label',
              'Kiểm xem các lỗi là 4xx hay 5xx. Một giới hạn công suất sinh ra 5xx vì máy chủ bỏ cuộc, còn một nhánh mã hỏng thường sinh ra 4xx vì chính cái request mới là thứ sai; sự phân tách đó nói cho bạn biết nên điều tra phía nào của ranh giới và vốn đã có sẵn trên cái nhãn mã trạng thái',
            ),
            B(
              'Look at whether p99 latency rises with the errors. Capacity limits queue work before failing it, so latency and errors rise together, while a bad code path fails immediately and leaves latency untouched; the two panels side by side settle it without any new instrumentation',
              'Xem p99 độ trễ có tăng cùng với số lỗi không. Các giới hạn công suất xếp hàng công việc trước khi làm hỏng nó, nên độ trễ và số lỗi cùng tăng, còn một nhánh mã hỏng thì hỏng ngay lập tức và để độ trễ nguyên vẹn; đặt hai cái ô cạnh nhau là dứt điểm mà không cần đo đạc gì mới',
            ),
            B(
              'They cannot be told apart from metrics alone, because both produce the same correlation and the difference lives inside individual requests; the only way through is to sample traces during a busy period and read what the failing ones have in common',
              'Không phân biệt được nếu chỉ dựa vào chỉ số, vì cả hai đều tạo ra cùng một sự tương quan và khác biệt nằm bên trong từng request riêng lẻ; lối thoát duy nhất là lấy mẫu trace trong một quãng đông rồi đọc xem các request hỏng có điểm gì chung',
            ),
            B(
              'Plot the <b>ratio</b> of errors to requests rather than the two counts. <b>If the ratio is constant, it is a fixed percentage of requests hitting a bad code path; if the ratio rises with load, it is capacity</b> — pool exhaustion, event-loop saturation, an upstream rate limit or lock contention. The check takes ten seconds and sends you to two completely different places, which is exactly why it is worth doing before forming any hypothesis at all',
              'Hãy vẽ <b>TỈ LỆ</b> giữa số lỗi và số request thay vì vẽ hai con số đếm. <b>Nếu tỉ lệ KHÔNG ĐỔI thì đó là một phần trăm cố định các request rơi vào một nhánh mã hỏng; nếu tỉ lệ TĂNG theo tải thì đó là công suất</b> — cạn bể kết nối, bão hoà vòng lặp sự kiện, một giới hạn tốc độ ở phía trên, hay tranh chấp khoá. Phép kiểm mất mười giây và đưa bạn tới hai nơi hoàn toàn khác nhau, và đó chính là lý do nó đáng làm TRƯỚC khi hình thành bất kỳ giả thuyết nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both counts rise and fall together in either case, so the correlation itself carries no information — the derivative does. A fixed fraction of requests taking a broken branch produces a flat ratio no matter how much traffic there is; a resource that runs out produces a ratio that climbs as you approach the limit, because more requests are contending for the same fixed thing. Ten seconds of arithmetic, and the two answers send you to entirely different chapters: a constant ratio is a code question (which branch, which input shape), while a rising ratio is chapter 5&#39;s saturation metrics, and the pool <code>waiting</code> gauge in particular because it is the one signal that separates "perfectly utilised" from "everyone is queueing". The broader discipline is what makes the first five minutes work at all: your reasoning is measurably worse during them, so the defence is a fixed procedure written when you were calm, and every step of it <em>eliminates a category</em> rather than proposing a cause. Change nothing in the first five minutes, either — a rollback started before you understand the failure makes the current state impossible to attribute, and the precise start time you were about to get is worth more than any hypothesis, because a failure that began at 14:03 against a deploy that landed at 09:12 eliminates the diff in one second instead of twenty minutes of reading it.',
            'Cả hai con số đếm đều cùng lên cùng xuống trong cả hai trường hợp, nên bản thân sự tương quan chẳng mang thông tin gì — ĐẠO HÀM mới mang. Một tỉ lệ cố định các request đi vào một nhánh hỏng tạo ra một tỉ lệ PHẲNG bất kể có bao nhiêu lưu lượng; một tài nguyên cạn dần tạo ra một tỉ lệ TRÈO LÊN khi bạn tiến gần giới hạn, vì càng nhiều request tranh nhau cùng một thứ có hạn. Mười giây làm phép tính, và hai câu trả lời đưa bạn tới hai chương hoàn toàn khác nhau: tỉ lệ không đổi là một câu hỏi về MÃ (nhánh nào, đầu vào hình dạng gì), còn tỉ lệ tăng dần là các chỉ số bão hoà của chương 5, và riêng cái gauge <code>waiting</code> của bể kết nối, vì nó là tín hiệu duy nhất tách "dùng hết công suất hoàn hảo" khỏi "tất cả đang xếp hàng". Kỷ luật rộng hơn chính là thứ làm cho năm phút đầu tiên hoạt động được: khả năng suy luận của bạn tệ đi một cách đo được trong khoảng đó, nên hàng phòng thủ là một quy trình cố định viết ra lúc bạn còn bình tĩnh, và mỗi bước của nó LOẠI BỎ MỘT NHÓM chứ không đề xuất một nguyên nhân. Và cũng đừng đổi gì trong năm phút đầu — một lần lùi bản bắt đầu trước khi bạn hiểu cú hỏng làm cho trạng thái hiện tại không quy trách nhiệm được nữa, còn cái mốc bắt đầu chính xác mà bạn sắp có được thì đáng giá hơn mọi giả thuyết, vì một cú hỏng bắt đầu lúc 14:03 đối chiếu với một lần deploy đáp xuống lúc 09:12 loại bỏ cái diff trong một giây thay vì hai mươi phút đọc nó.',
          ),
        }),

        // q49 · đáp án 1
        mcq({
          prompt: B(
            'A user reports two things in one message: the GIF picker is dead, and chats are "disappearing". Both survived a re-login. <b>What was the mistake that made this take hours?</b>',
            'Một người dùng báo hai chuyện trong một tin nhắn: bộ chọn GIF chết, và các cuộc trò chuyện đang "biến mất". Cả hai đều còn nguyên sau khi đăng nhập lại. <b>Sai lầm nào làm chuyện này mất hàng giờ?</b>',
          ),
          options: [
            B(
              'Trusting the user\'s description. "Disappearing" is a user-interface impression rather than a technical statement, and the first move should have been to reproduce both symptoms yourself before spending any time on either of the reported behaviours',
              'Tin vào mô tả của người dùng. "Biến mất" là một ấn tượng về giao diện chứ không phải một phát biểu kỹ thuật, và nước đi đầu tiên lẽ ra phải là tự mình tái hiện cả hai triệu chứng trước khi tiêu thời gian vào bất kỳ hành vi nào được báo',
            ),
            B(
              '<b>Treating two symptoms as one bug.</b> They shared no cause: a stale <code>dist/index.js</code> never mounted <code>/api/v1/gifs</code>, while "chats disappearing" was a per-viewer <code>deletedAt</code> flag — a delete-for-me feature working as designed. A single explanation feels more elegant, and users genuinely do report everything they noticed at once, so the discipline is to <b>write the symptoms as a numbered list and diagnose them independently</b>, looking for a shared cause only once each has a start time that matches',
              '<b>Coi hai triệu chứng là MỘT cái bug.</b> Chúng chẳng chung nguyên nhân nào: một file <code>dist/index.js</code> cũ chưa từng gắn <code>/api/v1/gifs</code>, còn chuyện "trò chuyện biến mất" là một cái cờ <code>deletedAt</code> theo từng người xem — một tính năng xoá-với-riêng-tôi đang chạy đúng thiết kế. Một lời giải thích duy nhất thì có vẻ thanh lịch hơn, và người dùng thì thật sự báo mọi thứ họ để ý cùng một lúc, nên kỷ luật là <b>viết các triệu chứng ra thành một danh sách đánh số rồi chẩn đoán chúng ĐỘC LẬP</b>, và chỉ đi tìm một nguyên nhân chung sau khi mỗi cái đã có một mốc bắt đầu khớp nhau',
            ),
            B(
              'Not checking the database first. Two apparently unrelated features breaking together is the classic signature of a shared dependency, and the shared dependency in almost every application is the data layer; a single <code>SELECT 1</code> would have ruled it in or out in one second',
              'Không kiểm cơ sở dữ liệu trước. Hai tính năng dường như không liên quan cùng hỏng là chữ ký kinh điển của một phụ thuộc dùng chung, và phụ thuộc dùng chung trong gần như mọi ứng dụng là tầng dữ liệu; một câu <code>SELECT 1</code> lẽ ra đã loại nó vào hoặc ra trong một giây',
            ),
            B(
              'Failing to roll back the deploy immediately. Both symptoms appeared after a release, so the fastest path to a working system was to revert first and diagnose afterwards; mitigation always precedes diagnosis, and the hours were spent because that order was reversed',
              'Không lùi bản deploy lại ngay lập tức. Cả hai triệu chứng xuất hiện sau một lần phát hành, nên con đường nhanh nhất tới một hệ thống chạy được là lùi lại trước rồi chẩn đoán sau; giảm nhẹ luôn đi trước chẩn đoán, và hàng giờ bị tiêu vì thứ tự ấy bị đảo ngược',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The bias is strong for two reasons, and both are reasonable: a single explanation genuinely is more elegant, and users report everything they noticed in one message because that is how noticing works. But the search for one deep cause that explains both is unbounded, because there was none. The one check that would have ended half of it in under a minute was an unauthenticated <code>curl</code>: <code>GET /api/v1/gifs</code> returned 404, which means the route was not mounted, which means the build is stale — 401 or 200 would have proved the route live and sent the investigation elsewhere immediately. That is the shape of all four incidents in this chapter: none was diagnosed by reading code, three had a one-command check that would have ended them, and every one produced a permanent new check afterwards (the smoke test, the restart-Next-by-port rule, the libc guard, <code>typecheck:seed</code>) — which is what makes them worth writing down at all. Option 4 gets the general principle right and applies it too early: mitigation does come before diagnosis, but only once you have a specific reason, and a reflexive rollback in minute one changes the system underneath you so that you can no longer tell whether the current state is the original failure or something the rollback caused.',
            'Thiên lệch này mạnh vì hai lý do, và cả hai đều hợp lý: một lời giải thích duy nhất THẬT SỰ thanh lịch hơn, và người dùng báo mọi thứ họ để ý trong một tin nhắn vì việc để ý vốn diễn ra như thế. Nhưng cuộc tìm kiếm MỘT nguyên nhân sâu giải thích được cả hai là vô hạn, vì chẳng có nguyên nhân nào như thế. Phép kiểm duy nhất lẽ ra đã kết thúc một nửa chuyện đó trong chưa tới một phút là một lệnh <code>curl</code> không xác thực: <code>GET /api/v1/gifs</code> trả về 404, nghĩa là route chưa được gắn, nghĩa là bản dựng đã cũ — còn 401 hay 200 thì lẽ ra đã chứng minh route đang sống và đẩy cuộc điều tra sang chỗ khác ngay lập tức. Đó là hình dạng của cả bốn sự cố trong chương này: không cái nào được chẩn ra bằng cách ĐỌC MÃ, ba cái có một phép kiểm một-câu-lệnh lẽ ra đã kết thúc chúng, và mỗi cái đều sinh ra một phép kiểm mới VĨNH VIỄN về sau (phép kiểm khói, luật khởi động lại Next theo CỔNG, chốt kiểm libc, <code>typecheck:seed</code>) — và chính điều đó mới làm chúng đáng ghi lại. Phương án 4 nắm đúng nguyên tắc chung mà áp dụng quá sớm: giảm nhẹ ĐÚNG là đi trước chẩn đoán, nhưng chỉ khi bạn đã có một lý do cụ thể, còn một cú lùi bản theo phản xạ ở phút thứ nhất sẽ đổi cái hệ thống ngay dưới chân bạn, tới mức bạn không còn phân biệt được trạng thái hiện tại là cú hỏng gốc hay là thứ do chính cú lùi bản gây ra.',
          ),
        }),

        /* ── Chương 12 — những gì sống sót qua phép đo (1 câu) ───────────── */

        // q50 · đáp án 2
        mcq({
          prompt: B(
            'You have finished the course and have two hours. The first four items on the recommended plan are: point the compose healthcheck at <code>/health/live</code>, forward and log nginx\'s <code>$request_id</code>, read the request context inside <code>emit()</code>, and set <code>max-size</code>/<code>max-file</code> on all seven services. <b>What do these four have in common, and how should the work be framed?</b>',
            'Bạn học xong khoá và có hai tiếng. Bốn việc đầu tiên trong kế hoạch được đề xuất là: trỏ healthcheck của compose vào <code>/health/live</code>, chuyển tiếp và log <code>$request_id</code> của nginx, đọc ngữ cảnh request bên trong <code>emit()</code>, và đặt <code>max-size</code>/<code>max-file</code> cho cả bảy dịch vụ. <b>Bốn việc này có điểm gì chung, và nên đóng khung công việc này thế nào?</b>',
          ),
          options: [
            B(
              'They are the four cheapest new capabilities, chosen because each can be finished in under half an hour; the framing is that observability work should always start with whatever is quickest, so that something ships before attention moves elsewhere',
              'Đó là bốn năng lực MỚI rẻ nhất, được chọn vì mỗi cái làm xong dưới nửa tiếng; cách đóng khung là công việc quan trắc luôn nên bắt đầu từ thứ nhanh nhất, để có cái gì đó ship được trước khi sự chú ý chuyển đi chỗ khác',
            ),
            B(
              'They are the four items that unlock the rest of the plan, since none of the later stages — metrics, shipping, alerting, tracing — can be built until these are in place; the framing is dependency ordering, and the sequence would be identical for any codebase',
              'Đó là bốn việc MỞ KHOÁ phần còn lại của kế hoạch, vì không giai đoạn sau nào — chỉ số, chuyển log, cảnh báo, trace — dựng được cho tới khi chúng xong; cách đóng khung là thứ tự phụ thuộc, và trình tự này sẽ giống hệt nhau với bất kỳ kho mã nào',
            ),
            B(
              'They are not features at all — they are <b>four defects with names and line numbers</b>, each fixable in minutes, and repair comes before new capability. The framing is not "quality versus speed": each one removes a failure that has already happened here or is one Postgres hiccup away, and the honest number is that correlation turned one incident from six steps and twenty-five minutes into one query and forty seconds. Two hours pays back on the third incident, and there will be a third incident',
              'Chúng hoàn toàn không phải tính năng — chúng là <b>bốn KHIẾM KHUYẾT có tên và có số dòng</b>, mỗi cái sửa được trong vài phút, và SỬA CHỮA đi trước NĂNG LỰC MỚI. Cách đóng khung không phải "chất lượng so với tốc độ": mỗi cái gỡ bỏ một cú hỏng đã từng xảy ra ở đây hoặc chỉ cách một cú nấc của Postgres; và con số trung thực là việc nối được ngữ cảnh đã biến một sự cố từ sáu bước và hai mươi lăm phút thành một truy vấn và bốn mươi giây. Hai tiếng đó hoàn vốn ở sự cố thứ ba, và sẽ có một sự cố thứ ba',
            ),
            B(
              'They are the four changes that require no new dependency, which is what makes them safe to ship without a review cycle; the framing is risk, and everything that adds a package or a container belongs in a later stage where it can be tested properly',
              'Đó là bốn thay đổi không cần thêm phụ thuộc nào, và chính điều đó làm chúng an toàn để ship mà không cần một vòng rà soát; cách đóng khung là RỦI RO, còn mọi thứ thêm một gói hay một container thì thuộc về một giai đoạn sau, nơi nó được kiểm thử tử tế',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Eleven chapters of capability is a menu, not a plan, and the ordering matters more than the contents. These four are the line above which everything is <em>repair</em>: today a twenty-second Postgres stall restarts every healthy container, nginx computes an id and logs neither it nor Express&#39;s so a 502 and the backend error that caused it cannot be joined, <code>req.id</code> is written once and read zero times, and seven containers write unbounded logs onto the disk that holds Postgres. Framing that as an investment in quality invites it to lose to the next feature permanently — and it loses in a specific way, because the work only gets prioritised <em>after</em> an incident, when it is done under pressure, badly, and only for the thing that just broke. Two properties of the rest of the plan are worth carrying away. Each stage is <b>useful alone</b>: an observability project abandoned at week two should still leave you better off, which is why the order is repair → one request end to end → metrics with buckets from your own data → ship the logs and pick an SLO → errors with a git-SHA release → dashboards, and tracing only if a second service you wrote enters the request path. And the numbers you take with you should be <b>ratios, not absolutes</b> — the timestamp dominating a log line, RSS never returning, CPU% failing to see a blocked loop, sampling arithmetic — because the absolutes came from one sandbox on hardware that is not yours, and a number quoted without its conditions is how a measurement turns into folklore.',
            'Mười một chương năng lực là một cái THỰC ĐƠN chứ không phải một kế hoạch, và THỨ TỰ quan trọng hơn nội dung. Bốn việc này nằm trên cái vạch mà phía trên đó mọi thứ đều là SỬA CHỮA: hôm nay một cú đơ Postgres hai mươi giây khởi động lại mọi container đang khoẻ mạnh, nginx tính ra một cái id rồi không log cả nó lẫn id của Express nên một cú 502 và cái lỗi backend gây ra nó không ghép được với nhau, <code>req.id</code> được ghi đúng một lần và được đọc không lần nào, và bảy container ghi log không giới hạn lên chính cái đĩa chứa Postgres. Đóng khung việc đó thành một khoản "đầu tư cho chất lượng" là mời nó thua cuộc trước tính năng kế tiếp một cách vĩnh viễn — và nó thua theo một cách rất cụ thể, vì công việc chỉ được ưu tiên SAU một sự cố, khi nó được làm dưới áp lực, làm ẩu, và chỉ làm cho đúng cái vừa hỏng. Hai tính chất của phần còn lại trong kế hoạch đáng mang theo. Mỗi giai đoạn đều <b>tự nó đã hữu ích</b>: một dự án quan trắc bị bỏ dở ở tuần thứ hai vẫn phải để lại cho bạn một trạng thái tốt hơn lúc chưa bắt đầu, và đó là lý do thứ tự là sửa chữa → một request từ đầu tới cuối → chỉ số với các ô suy từ dữ liệu của chính bạn → chuyển log đi và chọn một SLO → lỗi kèm bản phát hành theo mã SHA → bảng theo dõi, còn trace chỉ khi một dịch vụ thứ hai do bạn viết bước vào đường đi của request. Và những con số bạn mang theo nên là <b>TỈ LỆ, không phải giá trị tuyệt đối</b> — cái dấu thời gian lấn át một dòng log, RSS không bao giờ trả về, CPU% không nhìn thấy một vòng lặp bị chặn, phép tính lấy mẫu — vì các giá trị tuyệt đối đến từ MỘT cái sandbox trên phần cứng không phải của bạn, và một con số trích dẫn mà tách khỏi điều kiện của nó chính là cách một phép đo biến thành một lời đồn.',
          ),
        }),
      ],
    },
  ],
};
