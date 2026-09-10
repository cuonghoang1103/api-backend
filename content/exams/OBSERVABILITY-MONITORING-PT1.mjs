/**
 * Observability & Monitoring — Progress Test 1 (chương s00–s04).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi. Đề GIỮA KỲ,
 * dễ hơn FE một bậc: mỗi câu hỏi đúng MỘT cơ chế, không câu nào bắt ghép ba
 * chương lại với nhau.
 *
 * ┌── MÁY ĐO ────────────────────────────────────────────────────────────────┐
 * │ Node v22.21.0 · darwin-arm64 (macOS 25.6, Apple silicon)                 │
 * │ prom-client                        15.1.3                               │
 * │ pino                               10.3.1                               │
 * │ @opentelemetry/api                  1.9.1                               │
 * │ @opentelemetry/sdk-trace-node       2.11.0                              │
 * │ Prometheus                          v3.5.0 (container)                  │
 * │ Docker Engine                       29.5.3                              │
 * └──────────────────────────────────────────────────────────────────────────┘
 * Thư mục đo nằm NGOÀI kho (`scratchpad/obs-pt/lab`); KHÔNG gói nào được thêm
 * vào `package.json` của dự án. Container Prometheus và container Alpine dùng
 * để đọc file `-json.log` thật đều đã `docker rm -f` sau khi đo xong.
 *
 * ═══ NHỮNG CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY ═══
 *
 *  1. **Hệ số phình của phong bì json-file KHÔNG phải một hằng số.** Giáo
 *     trình (2.1) đưa đúng một con số, 1,62×, và mọi phép ước lượng đĩa trong
 *     chương đó dựa vào nó. Đo lại bằng chính khuôn phong bì mà Docker 29.5.3
 *     ghi ra (đọc file `-json.log` thật, không suy từ tài liệu):
 *         28 byte  → 106 byte   3,79×
 *        102 byte  → 190 byte   1,86×
 *        157 byte  → 255 byte   1,62×   ← đúng bằng con số của giáo trình
 *         73 byte  → 143 byte   1,96×   ← dòng chữ THUẦN, KHÔNG dấu ngoặc nào
 *     Phần bọc có ~70 byte cố định (`"log":`, `"stream":"stdout"`, `"time":`
 *     với 9 chữ số nano giây) cộng 1 byte cho mỗi dấu ngoặc kép bị thoát. Nên
 *     dòng CÀNG NGẮN hệ số CÀNG LỚN, và một dòng không có dấu ngoặc kép nào
 *     vẫn phình gần gấp đôi. 1,62× chỉ đúng cho đúng dòng 157 byte ấy. Câu 10
 *     ra đề theo bảng đo trên.
 *
 *  2. **pino phát ra JSON có KHOÁ TRÙNG, và không hề báo gì.** Một `child()`
 *     mang `requestId` rồi chỗ gọi truyền thêm `requestId` khác thì dòng ra là
 *     `{"level":30,"service":"notes","requestId":"req_A","requestId":"req_B",...}`
 *     — hai khoá cùng tên trong một object. Đo 3 lượt, giống nhau từng byte.
 *     `JSON.parse` giữ cái CUỐI (`req_B`) và `Object.keys` chỉ còn một khoá.
 *     Giáo trình chương 1 không nói tới trường hợp này. Câu 4 dùng nguyên văn.
 *
 *  3. **Đoạn regex kiểm `traceparent` của giáo trình (3.4) NHẬN cả hai giá trị
 *     mà W3C gọi là "invalid".** `/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/`
 *     khớp cả `trace-id` toàn số 0 lẫn `parent-id` toàn số 0. Đo thật: đưa hai
 *     chuỗi ấy cho bộ truyền ngữ cảnh W3C của OpenTelemetry thì nó TỪ CHỐI cả
 *     hai (`trace.getSpanContext()` trả `undefined`), còn regex trên thì nhận.
 *     Câu 22 ra đề theo chỗ lệch này.
 *
 * ═══ NHỮNG CHỖ CHỈ SUY THEO TÀI LIỆU, KHÔNG ĐO ĐƯỢC ═══
 *   • **LogQL / Loki (chương 2): KHÔNG dựng được Loki.** Câu 15 hỏi NGỮ NGHĨA
 *     chi phí truy vấn (nhãn được đánh chỉ mục, nội dung dòng thì không) theo
 *     tài liệu Grafana. **Suy luận theo tài liệu, chưa chạy được.**
 *   • **Vector / trình thu gom log, hợp đồng giao nhận (chương 2.3)**: mức tài
 *     liệu. Không dựng.
 *   • **Mọi con số nano giây của chương 1.4 và 1.5** (571 ns, 1.310 ns,
 *     4.985 ns) và **677 ns của AsyncLocalStorage**: **KHÔNG đo lại**, và
 *     KHÔNG câu nào trong đề này hỏi chúng. Máy đang chạy nhiều agent khác nên
 *     số đo độ trễ lấy lúc có tải là số vô nghĩa. Các câu liên quan chỉ hỏi CƠ
 *     CHẾ và TỈ LỆ.
 *   • Bảng lực lượng nhãn của câu 27 là PHÉP NHÂN thuần tuý (tự tính), không
 *     phải phép đo trên một Prometheus có dữ liệu thật.
 *
 * ═══ NHỮNG PHÉP ĐO CÓ CHẠY THẬT VÀ ĐƯỢC DÙNG TRONG ĐỀ ═══
 *   • Phong bì `-json.log` thật, đọc từ trong máy ảo Docker 29.5.3 (câu 10).
 *   • pino 10.3.1: khoá trùng, mức mặc định `info` (câu 4).
 *   • Nén 200.000 dòng log của chính tôi: thô 29,52 MB · gzip -6 2,42 MB
 *     (12,20×) · zstd 2,13 MB (13,88×). Ba lượt giống nhau từng byte (câu 13).
 *   • AsyncLocalStorage so với một biến ở phạm vi module, trên một lịch đan
 *     xen ba request. Ba lượt giống nhau từng byte (câu 17).
 *   • prom-client 15.1.3 + Prometheus v3.5.0 thật: mọi giá trị `histogram_quantile`
 *     trong câu 24, câu 25 và trong đáp án mẫu của câu 32 đều lấy từ
 *     `/api/v1/query` của một Prometheus đang chạy, không phải từ trí nhớ.
 *
 * ═══ PHÂN BỐ CÂU THEO CHƯƠNG (30 câu trắc nghiệm) ═══
 *   Mục 0  · đồng hồ, trụ cột thứ tư, cách đọc số đo ......  3  (q1–q3)
 *   Ch. 1  · log có cấu trúc, mức, trường, stdout .........  6  (q4–q9)
 *   Ch. 2  · phong bì, xoay vòng, nén, giao nhận, LogQL ...  6  (q10–q15)
 *   Ch. 3  · ngữ cảnh, ranh giới, traceparent .............  7  (q16–q22)
 *   Ch. 4  · loại chỉ số, histogram, lực lượng nhãn .......  8  (q23–q30)
 *   + 2 câu lập trình (5 điểm mỗi câu): q31 chương 1+2, q32 chương 4.
 *
 * Điểm thô 30 + 10 = 40, khai `totalPoints: 10`.
 *
 * Ba câu ghi "chọn HAI": q9, q21 và q30.
 * Phân bố vị trí đáp án (đếm mọi phần tử của correctIndexes, 33 đáp án trên 30 câu
 * vì có ba câu "chọn HAI"): A 8 · B 9 · C 8 · D 8.
 *   node -e "import('./content/exams/OBSERVABILITY-MONITORING-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Kiểm: node scripts/exam-check.mjs content/exams/OBSERVABILITY-MONITORING-PT1.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBSERVABILITY-MONITORING-PT1.mjs --apply
 */
import { B, EX, code, c, sim, ptInstructions, mcq, codeQ } from './_lib/observability-exam-kit.mjs';

export default {
  course: { slug: 'observability-monitoring' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–4 (structured logs, the pipeline, correlation, metrics)',
        'Kiểm tra tiến độ 1 — Chương 0–4 (log có cấu trúc, đường ống log, nối ngữ cảnh, chỉ số)',
      ),
      description: B(
        'The first third of the Observability course: how a log line is built and what it costs, where it goes after it leaves the process, how one request becomes traceable, and the four kinds of metric. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Quan trắc: một dòng log được dựng ra sao và tốn những gì, nó đi đâu sau khi rời tiến trình, làm sao để một request theo dõi được, và bốn loại chỉ số. 30 câu trắc nghiệm cộng 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        // ── Mục 0 ────────────────────────────────────────────────────────
        mcq({
          prompt: B(
            'A duration in your request log occasionally comes out NEGATIVE, and the code that computes it looks correct. It uses ' + c('Date.now()') + ' at both ends. What is happening, and what should it use instead?',
            'Một khoảng thời gian trong log request thỉnh thoảng ra số ÂM, mà đoạn mã tính nó nhìn thì đúng. Nó dùng ' + c('Date.now()') + ' ở cả hai đầu. Chuyện gì đang xảy ra, và nên dùng gì thay thế?',
          ),
          options: [
            B(
              'The two calls happened in different event-loop turns, so the second one was scheduled before the first completed; the fix is to read both timestamps inside the same synchronous block rather than across an <code>await</code>',
              'Hai lời gọi rơi vào hai vòng lặp sự kiện khác nhau nên cái thứ hai được xếp lịch trước khi cái thứ nhất xong; cách sửa là đọc cả hai dấu thời gian trong cùng một khối đồng bộ chứ đừng đặt hai bên một <code>await</code>',
            ),
            B(
              '<code>Date.now()</code> reads the WALL clock, and the wall clock gets adjusted — NTP steps it, a VM resumes from a snapshot, a container starts before time sync finishes. A subtraction across an adjustment returns a negative number, and clamping it to zero silently discards exactly the samples taken during the jump. Use <code>process.hrtime.bigint()</code>, which is monotonic, for anything you subtract',
              '<code>Date.now()</code> đọc đồng hồ TƯỜNG, và đồng hồ tường thì bị chỉnh — NTP nhảy nó, một máy ảo khôi phục từ ảnh chụp, một container khởi động trước khi đồng bộ giờ xong. Phép trừ vắt qua một lần chỉnh sẽ ra số âm, và kẹp nó về 0 chính là âm thầm vứt đúng những mẫu lấy trong lúc nhảy. Hãy dùng <code>process.hrtime.bigint()</code>, thứ đơn điệu, cho mọi thứ bạn đem đi trừ',
            ),
            B(
              '<code>Date.now()</code> has only millisecond resolution, so two calls inside the same millisecond can return values in either order depending on rounding; switching to <code>performance.now()</code> gives sub-millisecond precision and removes the tie',
              '<code>Date.now()</code> chỉ có độ phân giải mili-giây nên hai lời gọi trong cùng một mili-giây có thể trả về theo thứ tự bất kỳ tuỳ cách làm tròn; chuyển sang <code>performance.now()</code> cho độ chính xác dưới mili-giây và hết hoà',
            ),
            B(
              'The number is being serialised through JSON and JavaScript loses precision on large integers, so the difference of two epoch values overflows the safe integer range; storing it as a BigInt string fixes it',
              'Con số đi qua JSON và JavaScript mất độ chính xác với số nguyên lớn nên hiệu của hai giá trị epoch tràn khỏi tầm số nguyên an toàn; lưu nó dưới dạng chuỗi BigInt là hết',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is why every duration in this course uses <code>process.hrtime.bigint()</code> and every <em>timestamp</em> uses <code>Date.now()</code>. The two clocks answer different questions: one says "how long", the other says "when". A monotonic clock cannot go backwards by construction, so a subtraction on it is always meaningful; a wall clock can, and the moment it does, your data is wrong in a way that looks like a glitch and gets clamped away.',
            'Đây chính là lý do mọi khoảng thời gian trong khoá này dùng <code>process.hrtime.bigint()</code> còn mọi <em>dấu thời gian</em> dùng <code>Date.now()</code>. Hai cái đồng hồ trả lời hai câu khác nhau: một cái nói "bao lâu", cái kia nói "lúc nào". Đồng hồ đơn điệu về bản chất không lùi được nên phép trừ trên nó luôn có nghĩa; đồng hồ tường thì lùi được, và ngay khi nó lùi thì dữ liệu của bạn sai theo kiểu trông như một trục trặc vặt rồi bị kẹp mất.',
          ),
        }),

        mcq({
          prompt: B(
            'Error rate starts rising at 14:02 and your dashboard shows only the error-rate line. Which of the four pillars is missing, and why does it end most investigations before they start?',
            'Tỉ lệ lỗi bắt đầu tăng lúc 14:02 và bảng theo dõi của bạn chỉ hiện mỗi đường tỉ lệ lỗi. Trụ cột nào đang thiếu, và vì sao nó kết thúc phần lớn cuộc điều tra trước khi chúng bắt đầu?',
          ),
          options: [
            B(
              'Traces. Without a waterfall you cannot see which service was slow, and a service map is the only thing that turns a rising error rate into a location — which is why tracing is the pillar to build immediately after logging',
              'Trace. Không có biểu đồ thác thì không thấy dịch vụ nào chậm, và bản đồ dịch vụ là thứ duy nhất biến một tỉ lệ lỗi đang tăng thành một VỊ TRÍ — nên trace là trụ cột phải dựng ngay sau log',
            ),
            B(
              'Profiling data. A CPU profile taken at 14:02 names the exact function that started consuming time, which no other pillar can do, and the V8 profiler is cheap enough to sample continuously in production',
              'Dữ liệu hồ sơ hiệu năng. Một bản hồ sơ CPU chụp lúc 14:02 gọi tên đúng cái hàm bắt đầu ngốn thời gian, thứ mà không trụ cột nào khác làm được, và bộ hồ sơ của V8 rẻ tới mức lấy mẫu liên tục trên production cũng được',
            ),
            B(
              'Change events — deploys, config edits, feature flags, migrations. Most incidents are caused by a change, so a vertical line at 14:01 labelled with a commit hash usually ends the investigation before it starts. It is not in the canonical list of three and it is the cheapest of the four to build: one line emitted by the deploy script into the same log stream',
              'Sự kiện thay đổi — deploy, sửa cấu hình, cờ tính năng, migration. Phần lớn sự cố là do một thay đổi gây ra, nên một vạch dọc lúc 14:01 dán nhãn mã commit thường kết thúc cuộc điều tra trước khi nó bắt đầu. Nó không nằm trong danh sách ba trụ cột kinh điển và nó là cái RẺ NHẤT trong bốn cái: một dòng do script deploy phát ra vào cùng luồng log',
            ),
            B(
              'Uptime checks from an external service. Without one you cannot tell whether the errors are yours at all, and an external checker is the only signal that survives a total outage of your own metrics stack',
              'Phép kiểm sống-chết từ một dịch vụ bên ngoài. Không có nó thì không biết được lỗi ấy có phải của mình không, và bộ kiểm bên ngoài là tín hiệu duy nhất sống sót qua một cú sập toàn bộ hệ thống chỉ số của chính bạn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Logs, metrics and traces are the canonical three; change events are the fourth that everybody forgets. This repository already knows all three facts a change event needs — a timestamp, a commit hash and who ran it — inside <code>deploy-nha.sh</code>, and records none of them anywhere a graph can read. The other three options are all genuinely useful and all much more expensive than one line of output.',
            'Log, chỉ số và trace là ba trụ cột kinh điển; sự kiện thay đổi là cái thứ tư ai cũng quên. Kho này đã biết sẵn cả ba dữ kiện mà một sự kiện thay đổi cần — dấu thời gian, mã commit và ai chạy — ngay trong <code>deploy-nha.sh</code>, và không ghi cái nào vào chỗ mà một đồ thị đọc được. Ba lựa chọn còn lại đều hữu ích thật và đều đắt hơn một dòng output rất nhiều.',
          ),
        }),

        mcq({
          prompt: B(
            'You re-run one of the course benchmarks on your own laptop and every ns/op figure comes out about 30% lower than the printed one. What should you conclude?',
            'Bạn chạy lại một phép đo của giáo trình trên máy mình và mọi con số ns/thao tác đều thấp hơn bản in khoảng 30%. Bạn nên kết luận gì?',
          ),
          options: [
            B(
              'Nothing is wrong. Absolute timings are a property of the CPU; what must reproduce is the RATIOS between the measurements. If a timestamp call still more than doubles the cost of a log line on your machine, the lesson holds — and when you later quote one of these figures, quote the sentence that says which machine, which Node version and which date it came from, because a number without its conditions is how a measurement turns into folklore',
              'Không có gì sai cả. Con số tuyệt đối là thuộc tính của CPU; thứ BẮT BUỘC phải lặp lại được là các TỈ LỆ giữa các phép đo. Nếu trên máy bạn một lời gọi lấy dấu thời gian vẫn làm hơn gấp đôi chi phí một dòng log thì bài học vẫn đứng — và khi sau này trích một con số như thế, hãy trích kèm câu nói rõ nó đến từ máy nào, Node bản nào, ngày nào, vì một con số không có điều kiện đi kèm chính là cách một phép đo biến thành lời đồn',
            ),
            B(
              'The benchmark is broken and should be re-run with a much larger N, because a 30% gap is far outside the variance a warm-up loop can explain and points at the JIT not having compiled the function under test; raise N until two consecutive runs agree to within a few per cent, then compare against the printed figure again',
              'Phép đo hỏng và phải chạy lại với N lớn hơn nhiều, vì chênh 30% là vượt xa khoảng dao động mà một vòng làm nóng giải thích được và cho thấy JIT chưa biên dịch cái hàm đang đo; hãy nâng N tới khi hai lượt chạy liên tiếp khớp nhau trong vài phần trăm, rồi mới so lại với con số đã in',
            ),
            B(
              'Your Node version is newer than the one in the lesson, so the numbers are not comparable at all and the whole chapter has to be re-measured before any of its conclusions can be used; pin the exact version from the lesson header in a container and re-run every script there first',
              'Bản Node của bạn mới hơn bản trong bài nên các con số hoàn toàn không so được, và cả chương phải đo lại trước khi dùng được bất kỳ kết luận nào của nó; hãy ghim đúng phiên bản ghi ở đầu bài vào một container rồi chạy lại mọi script ở đó trước đã',
            ),
            B(
              'The course numbers were taken with the process under load from other work, so they are inflated; yours are the honest ones and should replace them in any note you write, and the lesson text should be corrected to whichever pair of numbers was measured on the quieter machine',
              'Số của giáo trình lấy lúc tiến trình đang chịu tải từ việc khác nên bị thổi lên; số của bạn mới là số trung thực và nên thay vào mọi ghi chú bạn viết, và phần chữ trong bài nên sửa lại theo cặp số nào được đo trên cái máy yên tĩnh hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The course states this explicitly: ±30% on any ns/op figure is expected because it is different silicon. What is NOT expected — and is a finding worth chasing — is a ratio changing: an event-loop p50 above 5 ms while idle, or <code>JSON.stringify</code> coming out faster than 400 ns, which usually means you are measuring a cached string rather than the serialisation. This exam follows the same rule, which is why not one question in it turns on an absolute nanosecond figure.',
            'Giáo trình nói thẳng điều này: chênh ±30% ở bất kỳ con số ns/thao tác nào là bình thường vì đó là con chip khác. Thứ KHÔNG bình thường — và đáng đi truy — là một TỈ LỆ đổi: p50 vòng lặp sự kiện trên 5 ms lúc nhàn rỗi, hay <code>JSON.stringify</code> ra nhanh hơn 400 ns, thứ thường nghĩa là bạn đang đo một chuỗi đã được lưu sẵn chứ không phải phép tuần tự hoá. Đề này theo đúng luật đó, nên không câu nào trong đề ăn thua ở một con số nano giây tuyệt đối.',
          ),
        }),
        // ── Chương 1 — log có cấu trúc ───────────────────────────────────
        mcq({
          prompt: B(
            'Real output from pino 10.3.1 on Node v22.21.0, three runs, byte-identical. A child logger carries a request id and the call site passes another one:' + code(
              "const log = pino({ base: null, timestamp: false });\n" +
              "const child = log.child({ service: 'notes', requestId: 'req_A' });\n" +
              "child.info({ requestId: 'req_B', ms: 7 }, 'note created');\n" +
              '\n' +
              '// what it actually printed:\n' +
              '{"level":30,"service":"notes","requestId":"req_A","requestId":"req_B","ms":7,"msg":"note created"}',
            ) + 'What has happened, and what does a consumer of this line see?',
            'Output thật của pino 10.3.1 trên Node v22.21.0, ba lượt giống nhau từng byte. Một bộ log con mang sẵn một request id và chỗ gọi truyền thêm một cái nữa:' + code(
              "const log = pino({ base: null, timestamp: false });\n" +
              "const child = log.child({ service: 'notes', requestId: 'req_A' });\n" +
              "child.info({ requestId: 'req_B', ms: 7 }, 'note created');\n" +
              '\n' +
              '// và đây là thứ nó in ra thật:\n' +
              '{"level":30,"service":"notes","requestId":"req_A","requestId":"req_B","ms":7,"msg":"note created"}',
            ) + 'Chuyện gì đã xảy ra, và một bên đọc dòng này sẽ thấy gì?',
          ),
          options: [
            B(
              'The line carries the same key TWICE — pino writes the child bindings and the call-site fields in order and does not deduplicate. It is still parseable: <code>JSON.parse</code> keeps the LAST occurrence, so the object has one <code>requestId</code> and its value is <code>req_B</code>. Nothing errors, nothing warns, and the shadowing is visible only in the raw bytes',
              'Dòng log mang CÙNG MỘT KHOÁ HAI LẦN — pino ghi các trường của bộ log con rồi tới các trường của chỗ gọi theo thứ tự và không khử trùng lặp. Nó vẫn phân giải được: <code>JSON.parse</code> giữ cái CUỐI, nên object thu được có đúng một <code>requestId</code> và giá trị là <code>req_B</code>. Không lỗi, không cảnh báo, và cái che nhau chỉ nhìn thấy được trong byte thô',
            ),
            B(
              'pino merges the two objects before serialising, so only one key is written and the child binding wins because bindings are applied last; the printed line above must therefore come from an older version in which merging was not yet implemented',
              'pino gộp hai object trước khi tuần tự hoá nên chỉ một khoá được ghi ra, và trường của bộ log con thắng vì bindings được áp sau cùng; vậy dòng in ở trên phải đến từ một bản cũ chưa cài phần gộp',
            ),
            B(
              'The line is invalid JSON: the specification forbids duplicate names inside one object, so every parser rejects it and the shipper drops the line at ingest with a parse error you can see in the shipper log',
              'Dòng ấy là JSON không hợp lệ: đặc tả cấm tên trùng trong một object nên mọi bộ phân giải đều từ chối, và trình thu gom vứt dòng đó lúc nạp kèm một lỗi phân giải bạn nhìn thấy được trong log của nó',
            ),
            B(
              'pino renames the second occurrence to <code>requestId_1</code> to keep the object well-formed, which is why the field looks duplicated when read as text but is two distinct fields once parsed',
              'pino đổi tên cái thứ hai thành <code>requestId_1</code> để object còn đúng khuôn, nên trường ấy trông như trùng khi đọc dạng chữ nhưng thành hai trường riêng sau khi phân giải',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, three runs, identical: <code>JSON.parse(line).requestId</code> is <code>"req_B"</code> and <code>Object.keys()</code> returns five names, not six. Duplicate names are legal in the JSON grammar and every mainstream parser resolves them last-wins — but that is a convention, not a guarantee, and a log store, a <code>jq</code> filter and a Go parser are three separate implementations of it. The practical rule is the same one lesson 1.2 gives for choosing fields: decide the field names in one place. A child binding and a call-site field with the same name is not an override, it is a collision that happens to resolve.',
            'Đo thật, ba lượt, giống hệt: <code>JSON.parse(line).requestId</code> ra <code>"req_B"</code> và <code>Object.keys()</code> trả về năm tên chứ không phải sáu. Tên trùng là hợp lệ trong văn phạm JSON và mọi bộ phân giải phổ biến đều xử theo luật "cái cuối thắng" — nhưng đó là một quy ước, không phải một bảo đảm, và kho log, một bộ lọc <code>jq</code> và một bộ phân giải viết bằng Go là ba lần cài đặt riêng của quy ước ấy. Luật thực dụng vẫn là luật của bài 1.2 khi chọn trường: quyết tên trường ở MỘT chỗ. Một trường của bộ log con trùng tên với một trường ở chỗ gọi không phải là "ghi đè", nó là một va chạm tình cờ giải quyết được.',
          ),
        }),

        mcq({
          prompt: B(
            'Your service logs every 404 at <code>error</code>. Someone points out that the error rate on the dashboard is dominated by people typing bad URLs. Why is that worth fixing, in terms of what a level actually promises?',
            'Dịch vụ của bạn ghi mọi lỗi 404 ở mức <code>error</code>. Có người chỉ ra rằng tỉ lệ lỗi trên bảng theo dõi bị lấn át bởi những người gõ sai URL. Vì sao chuyện đó đáng sửa, xét theo cái mà một MỨC LOG thật sự hứa hẹn?',
          ),
          options: [
            B(
              'Because <code>error</code> is reserved by convention for exceptions that carry a stack trace, and a 404 produced by the router never throws, so the level is factually wrong even before you consider the dashboard',
              'Vì <code>error</code> theo quy ước dành cho các ngoại lệ có kèm vết ngăn xếp, mà một lỗi 404 do bộ định tuyến sinh ra thì không hề ném lỗi, nên mức ấy sai về mặt sự kiện ngay cả trước khi bàn tới bảng theo dõi',
            ),
            B(
              'Because error-level lines are written to file descriptor 2 while everything else goes to descriptor 1, so a flood of 404s at error level fills the stderr pipe and starves the stdout pipe that carries your real request lines',
              'Vì các dòng mức error được ghi vào bộ mô tả file số 2 còn mọi thứ khác vào số 1, nên một trận lụt 404 ở mức error làm đầy ống stderr và bỏ đói ống stdout đang mang các dòng request thật của bạn',
            ),
            B(
              'Because a level is a promise about what the reader should DO. <code>error</code> means a request failed and a human may need to act; a 404 is the system working correctly, so it belongs at <code>info</code> or nowhere. Once handled cases are logged at error, a real spike is invisible inside the noise and any alert built on error count is either permanently firing or set so high it catches nothing',
              'Vì một MỨC là một lời hứa về việc người đọc phải LÀM GÌ. <code>error</code> nghĩa là một request đã hỏng và có thể cần người can thiệp; một lỗi 404 là hệ thống đang chạy đúng, nên nó thuộc về <code>info</code> hoặc chẳng thuộc về đâu cả. Khi các trường hợp ĐÃ XỬ LÝ bị ghi ở mức error thì một cú vọt thật sẽ chìm nghỉm trong nhiễu, và mọi cảnh báo dựng trên số đếm error hoặc là kêu vĩnh viễn, hoặc là đặt cao tới mức chẳng bắt được gì',
            ),
            B(
              'Because each level has a different cost: this repo drops <code>debug</code> in production but keeps everything else, so an <code>error</code> line is roughly twice the bytes of an <code>info</code> line once the stack field is attached, which doubles the log bill for a case you do not act on',
              'Vì mỗi mức có chi phí khác nhau: kho này bỏ <code>debug</code> trên production nhưng giữ mọi thứ còn lại, nên một dòng <code>error</code> tốn khoảng gấp đôi số byte của một dòng <code>info</code> sau khi đính thêm trường ngăn xếp, tức là gấp đôi hoá đơn log cho một trường hợp bạn chẳng làm gì với nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This repository already applies the rule on the Sentry side, and the comment in <code>src/middleware/errorHandler.ts</code> states it in one sentence: "Client errors (4xx) are not bugs and would just spam the dashboard." The same sentence is the whole level scheme. The test that settles every argument is "would you page someone at 3am for this?" — yes is <code>error</code>, "no but I would want to know" is <code>warn</code>, and if you cannot classify it, delete the line.' +
              sim('observability-levels', 'obs-1-3-muc-log', 'Watch the level scheme decay'),
            'Kho này đã áp dụng đúng luật ấy ở phía Sentry, và dòng chú thích trong <code>src/middleware/errorHandler.ts</code> nói gọn trong một câu: "Client errors (4xx) are not bugs and would just spam the dashboard." Chính câu đó là toàn bộ cái thang mức log. Phép thử dứt điểm mọi tranh cãi là "có gọi người dậy lúc 3 giờ sáng vì cái này không?" — có thì <code>error</code>, "không, nhưng tôi muốn biết" thì <code>warn</code>, còn nếu không phân loại nổi thì xoá dòng đó đi.' +
              sim('observability-levels', 'obs-1-3-muc-log', 'Xem mô phỏng thang mức log mục ruỗng'),
          ),
        }),

        mcq({
          prompt: B(
            'A list endpoint logs' + code("logger.info('notes listed', { items })") + 'where <code>items</code> is the array it just returned. In development the array has three entries and nobody notices. What does this line do in production, and what is the fix?',
            'Một endpoint danh sách ghi log' + code("logger.info('notes listed', { items })") + 'với <code>items</code> là chính cái mảng nó vừa trả về. Ở môi trường phát triển mảng ấy có ba phần tử nên chẳng ai để ý. Dòng này làm gì trên production, và sửa thế nào?',
          ),
          options: [
            B(
              'Nothing harmful. The serialiser writes the array once per line and log storage compresses repeated structures extremely well — measured at over twelve times on realistic log text — so the extra bytes largely disappear before they are billed',
              'Chẳng hại gì. Bộ tuần tự hoá ghi cái mảng đúng một lần trên mỗi dòng và kho log nén các cấu trúc lặp lại rất tốt — đo được hơn mười hai lần trên văn bản log thực tế — nên phần byte thừa gần như biến mất trước khi bị tính tiền',
            ),
            B(
              'It writes a hundred objects onto one line on every request, so the log-volume graph grows FASTER than traffic and the search gets slower every week. It is not an error — there is nothing to catch — which is why it survives review. Log <code>{ itemCount: items.length }</code>, and if you genuinely need the contents, log the ids: bounded, joinable, three orders of magnitude smaller',
              'Nó ghi cả trăm object lên một dòng, trên MỖI request, nên đồ thị lượng log phình NHANH HƠN lưu lượng và phép tìm kiếm chậm dần mỗi tuần. Nó không phải một lỗi — chẳng có gì để bắt — nên nó qua được vòng rà soát. Hãy ghi <code>{ itemCount: items.length }</code>, còn nếu thật sự cần nội dung thì ghi danh sách id: có chặn, nối được, và nhỏ hơn ba bậc độ lớn',
            ),
            B(
              'It throws once the array exceeds the serialiser depth limit, so the request fails with a 500 and the line never appears — a failure that only shows up under production data volumes and is easy to misread as a database problem',
              'Nó ném lỗi khi mảng vượt quá giới hạn độ sâu của bộ tuần tự hoá, nên request hỏng với mã 500 và dòng log không bao giờ xuất hiện — một cú hỏng chỉ lộ ra dưới khối lượng dữ liệu production và rất dễ bị đọc nhầm thành sự cố cơ sở dữ liệu',
            ),
            B(
              'It leaks nothing and costs nothing as long as the level stays at <code>info</code>, because the production logger evaluates its context lazily and only serialises the object if a consumer actually reads the line',
              'Nó không rò gì và không tốn gì miễn là mức vẫn là <code>info</code>, vì bộ log production dựng ngữ cảnh theo kiểu lười và chỉ tuần tự hoá cái object khi có bên đọc thật sự đọc tới dòng đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every field is paid for on every occurrence of the event, forever. An unbounded field is the version of that rule that hurts most, because its cost is invisible in the environment where you wrote it. The three questions that decide any field are: will you filter on it (then it is a field), will you aggregate on it (then it is a field and it is numeric), and is it the same on every line (then it belongs on the stream, added once by the shipper, not multiplied by every line you write).',
            'Mỗi cái trường đều bị trả tiền trên MỖI lần sự kiện ấy xảy ra, mãi mãi. Một trường không có chặn là phiên bản đau nhất của luật đó, vì chi phí của nó vô hình ở đúng cái môi trường bạn viết ra nó. Ba câu hỏi quyết định mọi trường là: có lọc theo nó không (thì nó là trường), có tính gộp theo nó không (thì nó là trường và phải là SỐ), và nó có giống nhau trên mọi dòng không (thì nó thuộc về LUỒNG, do trình thu gom thêm một lần, chứ không nhân lên theo từng dòng bạn ghi).',
          ),
        }),

        mcq({
          prompt: B(
            'This repo\'s logger drops debug lines in production with' + code("if (level === 'debug' && config.nodeEnv === 'production') return;") + 'A service contains' + code("logger.debug('state', { snapshot: structuredClone(bigObject) })") + 'What does that call cost in production?',
            'Bộ log của kho này bỏ các dòng debug trên production bằng' + code("if (level === 'debug' && config.nodeEnv === 'production') return;") + 'Một service có dòng' + code("logger.debug('state', { snapshot: structuredClone(bigObject) })") + 'Lời gọi đó tốn gì trên production?',
          ),
          options: [
            B(
              'Nothing. The guard is the first statement in <code>emit()</code>, so the function returns before the context object is ever touched — which is precisely why an early return is the right shape for a level filter',
              'Chẳng tốn gì. Phép kiểm là câu lệnh đầu tiên trong <code>emit()</code> nên hàm trả về trước khi cái object ngữ cảnh bị đụng tới — và đó chính là lý do một phép trả về sớm là hình dạng đúng cho một bộ lọc mức log',
            ),
            B(
              'Only the allocation of the outer object literal, roughly one small heap object per call, because <code>structuredClone</code> defers its work until the result is first read and nothing in the dropped path ever reads it',
              'Chỉ tốn phần cấp phát cho object bao ngoài, cỡ một object nhỏ trên heap mỗi lần gọi, vì <code>structuredClone</code> hoãn phần việc của nó lại tới khi kết quả được đọc lần đầu, mà đường bị bỏ thì chẳng đọc bao giờ',
            ),
            B(
              'The full deep clone, on every request, in production — because the guard runs INSIDE <code>emit()</code>, after the caller has already evaluated its arguments. The line is invisible and the cost is not. Guard at the CALL SITE when the context is expensive, or keep debug context cheap enough that building it does not matter',
              'Toàn bộ phép chép sâu, trên mỗi request, trên production — vì phép kiểm nằm BÊN TRONG <code>emit()</code>, tức là sau khi bên gọi đã tính xong các đối số của nó. Dòng log thì vô hình còn chi phí thì không. Hãy chặn ở CHỖ GỌI khi ngữ cảnh đắt, hoặc giữ ngữ cảnh debug rẻ tới mức dựng nó cũng chẳng sao',
            ),
            B(
              'The clone plus the serialisation, because the guard only suppresses the WRITE and the record is still built and handed to <code>JSON.stringify</code> before the level is examined — moving the check above the record construction removes both costs',
              'Phép chép cộng phép tuần tự hoá, vì cái chặn chỉ chặn phần GHI còn bản ghi vẫn được dựng và đưa cho <code>JSON.stringify</code> trước khi mức log được xét — chuyển phép kiểm lên trên chỗ dựng bản ghi là bỏ được cả hai chi phí',
            ),
          ],
          correct: 2,
          explanation: EX(
            'JavaScript evaluates arguments before it calls the function. By the time <code>emit()</code> can look at the level, <code>structuredClone(bigObject)</code> has already run and the result is sitting on the stack waiting to be thrown away. This is the one case where the early-return guard is genuinely not enough, and it is easy to spot once you know the shape: any <code>logger.debug</code> whose context does WORK rather than just naming existing values.',
            'JavaScript tính các đối số trước khi gọi hàm. Tới lúc <code>emit()</code> nhìn được cái mức thì <code>structuredClone(bigObject)</code> đã chạy xong rồi và kết quả đang nằm trên ngăn xếp chờ bị vứt. Đây đúng là trường hợp mà phép trả về sớm KHÔNG đủ, và nó dễ nhận ra khi đã biết hình dạng: bất kỳ <code>logger.debug</code> nào mà phần ngữ cảnh LÀM VIỆC chứ không chỉ gọi tên các giá trị đã có sẵn.',
          ),
        }),

        mcq({
          prompt: B(
            'Why does the log-backpressure failure in lesson 1.5 never appear while you are developing, and always describe production?',
            'Vì sao cú hỏng nghẽn-ngược của log ở bài 1.5 không bao giờ xuất hiện lúc bạn đang phát triển, mà lại luôn mô tả đúng production?',
          ),
          options: [
            B(
              'Because development runs with a smaller log level filter, so the volume never reaches the threshold at which Node starts buffering; running with <code>LOG_LEVEL=debug</code> locally reproduces the failure exactly',
              'Vì môi trường phát triển chạy với bộ lọc mức log hẹp hơn nên lượng log không bao giờ chạm ngưỡng mà Node bắt đầu đệm; chạy với <code>LOG_LEVEL=debug</code> ở máy là tái hiện được y hệt',
            ),
            B(
              'Because Node writes SYNCHRONOUSLY to a file and to a TTY — the two destinations you have locally — and ASYNCHRONOUSLY to a pipe, buffering in the process heap. In a container, file descriptor 1 is always a pipe held by the Docker daemon, and there is no configuration that makes it a file. So the one destination that can grow without bound is the only one production ever uses',
              'Vì Node ghi ĐỒNG BỘ vào một file và vào một TTY — đúng hai cái đích bạn có ở máy — và ghi KHÔNG ĐỒNG BỘ vào một ống, đệm lại trong heap của tiến trình. Trong một container thì bộ mô tả file số 1 LUÔN là một cái ống do daemon Docker giữ, và không có cấu hình nào biến nó thành file được. Nên cái đích duy nhất có thể phình vô hạn lại đúng là cái duy nhất production dùng',
            ),
            B(
              'Because the failure needs a slow reader, and locally your terminal reads instantly; the destination type is irrelevant — attaching a deliberately slow reader to a file redirect reproduces the same unbounded growth',
              'Vì cú hỏng cần một bên đọc chậm, mà ở máy thì terminal đọc tức thì; loại đích không liên quan — gắn một bên đọc cố tình chậm vào một phép chuyển hướng ra file cũng tái hiện đúng cái phình vô hạn ấy',
            ),
            B(
              'Because the Docker daemon applies its own back-pressure to the container, pausing the process when the log driver falls behind, and no such mechanism exists when you run the process directly on your machine',
              'Vì daemon Docker tự áp nghẽn ngược lên container, tạm dừng tiến trình khi trình ghi log tụt lại, và ở máy bạn chạy trực tiếp thì không có cơ chế nào như thế',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The asymmetry is the whole lesson: three destinations, two of them synchronous and both of them local-only. <code>console.log</code> knows nothing except "write to fd 1"; whether that is a terminal, a file or a pipe was decided outside your program by whoever started it. A slow reader on a pipe means the unwritten text accumulates in YOUR heap — measured at 47.8 MB queued for 400,000 lines, with RSS going 43 → 122 MB, no error, no blocking, and <code>process.stdout.writableNeedDrain</code> sitting at <code>true</code> where almost no application ever reads it.',
            'Chính sự bất đối xứng đó là toàn bộ bài học: ba cái đích, hai trong số đó đồng bộ và cả hai chỉ có ở máy bạn. <code>console.log</code> không biết gì ngoài "ghi vào fd 1"; còn fd 1 là terminal, là file hay là ống thì đã do người khởi động tiến trình quyết định, ở ngoài chương trình của bạn. Một bên đọc chậm trên một cái ống nghĩa là phần chữ chưa ghi được dồn trong heap CỦA BẠN — đo được 47,8 MB xếp hàng cho 400.000 dòng, RSS đi từ 43 lên 122 MB, không lỗi, không chặn, và <code>process.stdout.writableNeedDrain</code> nằm đó ở giá trị <code>true</code> mà gần như không ứng dụng nào đọc tới.',
          ),
        }),

        mcq({
          prompt: B(
            'An incident\'s log stops several seconds BEFORE the timestamp on the crash. Which TWO of the following discard buffered stdout without waiting for it to drain? (choose TWO)',
            'Log của một sự cố dừng lại mấy giây TRƯỚC dấu thời gian của cú sập. HAI thứ nào dưới đây vứt bỏ phần stdout còn trong đệm mà không chờ nó thoát hết? (chọn HAI)',
          ),
          options: [
            B(
              'A call to <code>process.exit()</code> in your own shutdown handler',
              'Một lời gọi <code>process.exit()</code> trong chính bộ xử lý tắt máy của bạn',
            ),
            B(
              '<code>server.close()</code> followed by letting the event loop empty on its own',
              '<code>server.close()</code> rồi để vòng lặp sự kiện tự cạn',
            ),
            B(
              'A SIGKILL from the OOM killer, or <code>docker kill</code>',
              'Một tín hiệu SIGKILL từ bộ diệt-khi-hết-bộ-nhớ, hoặc <code>docker kill</code>',
            ),
            B(
              'A SIGTERM handler that stops accepting new connections and then returns',
              'Một bộ xử lý SIGTERM ngừng nhận kết nối mới rồi trả về',
            ),
          ],
          correct: [0, 2],
          explanation: EX(
            'Pipe writes are asynchronous, so anything still in <code>process.stdout</code>\'s buffer is gone if the process ends before it drains — and <code>process.exit()</code>, an uncaught exception\'s default handler, SIGKILL and <code>docker kill</code> all end it without waiting. The nasty part is the timing: logging spikes during an incident, so the buffer is deepest exactly when the evidence matters most. The habit that fixes it is in the other two options — stop accepting requests, then let an empty event loop exit on its own, because only then are the buffers actually flushed.',
            'Ghi vào ống là bất đồng bộ, nên bất cứ thứ gì còn nằm trong đệm của <code>process.stdout</code> sẽ mất nếu tiến trình kết thúc trước khi đệm thoát hết — và <code>process.exit()</code>, bộ xử lý mặc định của một ngoại lệ không bắt, SIGKILL và <code>docker kill</code> đều kết thúc nó mà không chờ. Chỗ ác là ở thời điểm: lượng log vọt lên trong lúc có sự cố, nên đệm sâu nhất đúng vào lúc bằng chứng quý nhất. Thói quen sửa được nó nằm ở hai lựa chọn còn lại — ngừng nhận request, rồi để một vòng lặp sự kiện rỗng tự thoát, vì chỉ khi đó đệm mới thật sự được xả.',
          ),
        }),
        // ── Chương 2 — đường ống log ─────────────────────────────────────
        mcq({
          prompt: B(
            'Measured on Docker Engine 29.5.3 by reading a real <code>-json.log</code> file. Four application lines of different lengths, each wrapped by the json-file driver:' + code(
              'app line   on disk   ratio   escaped quotes\n' +
              '  28 B  →   106 B    3.79x    8\n' +
              ' 102 B  →   190 B    1.86x   18\n' +
              ' 157 B  →   255 B    1.62x   28\n' +
              '  73 B  →   143 B    1.96x    0   (plain text, no JSON at all)',
            ) + 'The course quotes 1.62× as <em>the</em> expansion factor. What do these four rows actually say?',
            'Đo thật trên Docker Engine 29.5.3 bằng cách đọc một file <code>-json.log</code> thật. Bốn dòng ứng dụng dài ngắn khác nhau, mỗi cái bị trình ghi json-file bọc lại:' + code(
              'dòng app   trên đĩa   hệ số   dấu ngoặc kép bị thoát\n' +
              '  28 B  →   106 B    3.79x    8\n' +
              ' 102 B  →   190 B    1.86x   18\n' +
              ' 157 B  →   255 B    1.62x   28\n' +
              '  73 B  →   143 B    1.96x    0   (chữ thuần, không hề có JSON)',
            ) + 'Giáo trình trích 1,62× như thể đó LÀ hệ số phình. Bốn hàng trên thật ra nói gì?',
          ),
          options: [
            B(
              'That the driver compresses short lines less effectively than long ones, which is why the ratio falls as the line grows; setting <code>compress: "true"</code> on the logging options flattens the curve and makes 1.62× hold at every length',
              'Rằng trình ghi nén dòng ngắn kém hiệu quả hơn dòng dài, nên hệ số giảm khi dòng dài ra; đặt <code>compress: "true"</code> trong tuỳ chọn logging sẽ làm phẳng đường cong và giữ 1,62× ở mọi độ dài',
            ),
            B(
              'That 1.62× is a measurement error: three of the four rows disagree with it, so the true constant is the average of the four ratios, about 2.3×, and every disk estimate in the chapter should be multiplied by that instead',
              'Rằng 1,62× là một phép đo sai: ba trong bốn hàng không khớp với nó, nên hằng số đúng là trung bình của bốn hệ số, khoảng 2,3×, và mọi ước lượng đĩa trong chương phải nhân bằng con số đó',
            ),
            B(
              'That the ratio is dominated by the number of escaped quotes, so it is a property of how many FIELDS your logger emits rather than of how long the line is; a line with no quotes at all should therefore expand by almost nothing',
              'Rằng hệ số bị chi phối bởi số dấu ngoặc kép bị thoát, nên nó là thuộc tính của việc bộ log phát ra bao nhiêu TRƯỜNG chứ không phải dòng dài bao nhiêu; vậy một dòng không có dấu ngoặc kép nào lẽ ra phải phình gần như không đáng kể',
            ),
            B(
              'That the expansion is not a constant at all: the envelope adds ~70 fixed bytes (<code>"log":</code>, <code>"stream":"stdout"</code> and a nanosecond <code>"time"</code>) plus one byte per escaped quote, so the SHORTER the line the LARGER the factor — and a plain-text line with zero quotes still nearly doubles. 1.62× is true only for that one 157-byte line, and any disk estimate that assumes it is off by whatever your real line length is',
              'Rằng phần phình hoàn toàn không phải một hằng số: cái phong bì thêm khoảng 70 byte CỐ ĐỊNH (<code>"log":</code>, <code>"stream":"stdout"</code> và một trường <code>"time"</code> tới nano giây) cộng một byte cho mỗi dấu ngoặc kép bị thoát, nên dòng CÀNG NGẮN hệ số CÀNG LỚN — và một dòng chữ thuần không có dấu ngoặc kép nào vẫn phình gần gấp đôi. 1,62× chỉ đúng cho đúng cái dòng 157 byte ấy, và mọi ước lượng đĩa dựa vào nó sẽ lệch đúng bằng độ dài dòng thật của bạn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The envelope is <code>{"log":"…\\n","stream":"stdout","time":"2026-09-10T14:01:24.765172754Z"}</code> — verbatim from a container on Docker 29.5.3. Two things follow. First, the fixed part is charged even to a line that is not JSON, which is why the 73-byte plain-text row still expands 1.96×. Second, the per-quote byte is charged in proportion to how structured your line is, so a well-fielded log line pays more of it. Neither effect is wrong; the mistake is treating one measured ratio as a constant. Measure your own line, or estimate from the envelope\'s parts.',
            'Cái phong bì là <code>{"log":"…\\n","stream":"stdout","time":"2026-09-10T14:01:24.765172754Z"}</code> — nguyên văn từ một container trên Docker 29.5.3. Hai điều rút ra. Một, phần cố định bị tính cả cho một dòng không phải JSON, nên hàng chữ thuần 73 byte vẫn phình 1,96×. Hai, cái byte cho mỗi dấu ngoặc kép bị tính tỉ lệ với việc dòng của bạn có cấu trúc tới đâu, nên một dòng log có nhiều trường thì trả phần đó nhiều hơn. Cả hai hiệu ứng đều không sai; cái sai là coi MỘT hệ số đo được như một hằng số. Hãy đo dòng của chính bạn, hoặc ước lượng từ các thành phần của phong bì.',
          ),
        }),

        mcq({
          prompt: B(
            'You are debugging a failure that started at 09:40. At 09:55 you redeploy to try a fix. At 10:05 you run <code>docker logs</code> looking for the original error and find nothing before 09:56. What happened?',
            'Bạn đang gỡ một cú hỏng bắt đầu lúc 09:40. Tới 09:55 bạn deploy lại để thử một cách sửa. Tới 10:05 bạn chạy <code>docker logs</code> để tìm lỗi ban đầu và không thấy gì trước 09:56. Chuyện gì đã xảy ra?',
          ),
          options: [
            B(
              'The log driver rotated the file when the deploy pushed it past its size limit, and <code>docker logs</code> reads only the current file, so the earlier history is in a rotated sibling that has to be read directly from <code>/var/lib/docker</code>',
              'Trình ghi log đã xoay vòng file khi lần deploy đẩy nó vượt giới hạn kích thước, mà <code>docker logs</code> chỉ đọc file hiện hành, nên phần lịch sử trước đó nằm trong một file anh em đã xoay và phải đọc thẳng từ <code>/var/lib/docker</code>',
            ),
            B(
              'The deploy changed the image, so the container\'s log format changed with it and <code>docker logs</code> silently skips lines it cannot decode with the current driver; passing <code>--details</code> makes them visible again',
              'Lần deploy đổi ảnh, nên khuôn log của container đổi theo và <code>docker logs</code> âm thầm bỏ qua những dòng nó không giải mã được bằng trình ghi hiện tại; thêm <code>--details</code> là chúng hiện lại',
            ),
            B(
              'The deploy RECREATED the container. <code>docker logs</code> is not a live tap on your process — it opens <code>/var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log</code> and prints it. A new container id is a new, empty file, so the log explaining the original failure is now attached to a container that no longer exists. Restarting a container keeps the file; recreating it does not — and that difference is exactly the argument for a shipper',
              'Lần deploy đã TẠO LẠI container. <code>docker logs</code> không phải một cái vòi cắm sống vào tiến trình của bạn — nó mở <code>/var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log</code> rồi in ra. Một container id mới là một file MỚI, RỖNG, nên phần log giải thích cú hỏng ban đầu giờ gắn với một container không còn tồn tại. Khởi động lại (restart) thì giữ file; tạo lại (recreate) thì không — và đúng cái khác biệt đó là lý lẽ cho việc dùng một trình thu gom log',
            ),
            B(
              'The <code>--since</code> default is one hour and it filters on Docker\'s own <code>time</code> field rather than your <code>ts</code>, and under a backlog those differ by minutes, so the earlier lines are present but excluded by the default window',
              'Mặc định của <code>--since</code> là một giờ và nó lọc theo trường <code>time</code> của chính Docker chứ không theo <code>ts</code> của bạn, mà khi có tồn đọng thì hai cái lệch nhau vài phút, nên các dòng trước đó vẫn có mặt nhưng bị cửa sổ mặc định loại ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the failure that catches people in the middle of an incident: you deploy to try a fix and delete the evidence in the same motion. The <code>--since</code> point in option D is real and worth knowing (Docker\'s <code>time</code> is when the daemon read the line, your <code>ts</code> is when you wrote it, and under a backlog they differ), but it is not what empties the file. Neither is rotation, which renames rather than discards. Only a recreate gives you a brand-new inode with nothing in it.',
            'Đây là cú hỏng bắt người ta ngay giữa một sự cố: bạn deploy để thử sửa và xoá luôn bằng chứng trong cùng một động tác. Ý ở lựa chọn D là có thật và đáng biết (trường <code>time</code> của Docker là lúc daemon ĐỌC được dòng, còn <code>ts</code> của bạn là lúc bạn GHI, và khi có tồn đọng thì hai cái lệch nhau), nhưng nó không phải thứ làm rỗng file. Xoay vòng cũng không, vì xoay vòng là đổi tên chứ không vứt. Chỉ có tạo lại container mới cho bạn một inode mới tinh, rỗng không.',
          ),
        }),

        mcq({
          prompt: B(
            'You add a machine-wide default to <code>/etc/docker/daemon.json</code>:' + code('{ "log-driver": "json-file",\n  "log-opts": { "max-size": "50m", "max-file": "3", "compress": "true" } }') + 'then restart the Docker daemon. An hour later this still prints an empty map:' + code("docker inspect -f '{{.HostConfig.LogConfig}}' cuonghoangdev_backend\n{json-file map[]}") + 'Why, and what does the setting buy you once it does apply?',
            'Bạn thêm một mặc định cho cả máy vào <code>/etc/docker/daemon.json</code>:' + code('{ "log-driver": "json-file",\n  "log-opts": { "max-size": "50m", "max-file": "3", "compress": "true" } }') + 'rồi khởi động lại daemon Docker. Một tiếng sau lệnh này vẫn in ra một map rỗng:' + code("docker inspect -f '{{.HostConfig.LogConfig}}' cuonghoangdev_backend\n{json-file map[]}") + 'Vì sao, và khi nó có hiệu lực thì cấu hình đó mua cho bạn cái gì?',
          ),
          options: [
            B(
              'Because the default is not retroactive: an existing container keeps the driver options it was CREATED with, and only a recreate picks up the new default — a restart is not enough. Once it applies you get a CEILING rather than a cleanup job: the daemon enforces the limit at write time, so three files of 50 MB is a hard 150 MB per container, known in advance instead of discovered',
              'Vì mặc định ấy không có hiệu lực hồi tố: một container đang tồn tại giữ nguyên các tuỳ chọn trình ghi mà nó được TẠO RA cùng, và chỉ khi TẠO LẠI nó mới nhận mặc định mới — khởi động lại là không đủ. Khi đã có hiệu lực thì bạn nhận được một cái TRẦN chứ không phải một việc dọn dẹp: daemon áp giới hạn ngay lúc ghi, nên ba file 50 MB là một trần cứng 150 MB cho mỗi container, biết trước chứ không phải phát hiện ra',
            ),
            B(
              'Because <code>compress: "true"</code> is not a valid option for the json-file driver, so the daemon rejected the whole <code>log-opts</code> block and fell back to no options at all; removing that key makes the other two take effect on the next restart of any container',
              'Vì <code>compress: "true"</code> không phải tuỳ chọn hợp lệ của trình ghi json-file, nên daemon từ chối cả khối <code>log-opts</code> và quay về không có tuỳ chọn nào; bỏ khoá đó đi thì hai tuỳ chọn còn lại có hiệu lực ở lần khởi động lại kế tiếp của bất kỳ container nào',
            ),
            B(
              'Because <code>docker inspect</code> reports the options that were written in the compose file, not the ones in force; the daemon default IS applied and the empty map simply means "nothing overrode the default", which is the state you wanted',
              'Vì <code>docker inspect</code> báo lại các tuỳ chọn được ghi trong file compose chứ không phải các tuỳ chọn đang có hiệu lực; mặc định của daemon CÓ được áp và cái map rỗng chỉ có nghĩa là "không có gì đè lên mặc định", tức đúng trạng thái bạn muốn',
            ),
            B(
              'Because the daemon-wide setting applies only to containers started outside compose; anything compose creates inherits the compose project defaults instead, so the options have to be repeated in a <code>logging:</code> block on every service',
              'Vì cấu hình cấp daemon chỉ áp cho các container khởi động ngoài compose; thứ gì do compose tạo ra thì thừa kế mặc định của dự án compose, nên các tuỳ chọn phải được lặp lại trong một khối <code>logging:</code> ở từng service',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two things that look similar and are not. Rotation is a ceiling the daemon enforces continuously at write time; a weekly cron that truncates anything over 200 MB is a cleanup job that runs long after the disk is gone, and it destroys the very log most likely to explain why the file grew. And note the second non-retroactive fact: the setting does not shrink a file that is already 4 GB, because rotation triggers on the next write crossing the threshold and renames rather than shrinks.',
            'Hai thứ nhìn giống nhau mà không phải một. Xoay vòng là một cái TRẦN do daemon áp liên tục ngay lúc ghi; còn một cron hàng tuần cắt trắng mọi file trên 200 MB là một việc dọn dẹp chạy sau khi đĩa đã mất từ lâu, và nó phá huỷ đúng cái log nhiều khả năng giải thích được vì sao file phình. Và để ý dữ kiện không-hồi-tố thứ hai: cấu hình ấy không làm nhỏ lại một file đã 4 GB, vì xoay vòng chỉ kích hoạt ở lần ghi kế tiếp vượt ngưỡng, và nó ĐỔI TÊN chứ không thu nhỏ.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on 200,000 realistic log lines, three runs, byte-identical:' + code(
              'raw       29.52 MB   (154.8 bytes/line)\n' +
              'gzip -6    2.42 MB   12.20x smaller\n' +
              'zstd       2.13 MB   13.88x smaller',
            ) + 'Which decision does that ratio change?',
            'Đo trên 200.000 dòng log thực tế, ba lượt giống nhau từng byte:' + code(
              'thô       29,52 MB   (154,8 byte/dòng)\n' +
              'gzip -6    2,42 MB   nhỏ hơn 12,20 lần\n' +
              'zstd       2,13 MB   nhỏ hơn 13,88 lần',
            ) + 'Hệ số đó làm đổi quyết định nào?',
          ),
          options: [
            B(
              'It means retention can be set to forever at negligible cost, since a year of history compresses to roughly the size a month of raw logs takes today and storage is the cheapest part of the stack; the only remaining limit is the index, which grows with distinct label values rather than with bytes',
              'Nó có nghĩa là có thể đặt thời gian giữ log thành vĩnh viễn với chi phí không đáng kể, vì một năm lịch sử nén lại chỉ cỡ một tháng log thô hôm nay, mà lưu trữ là phần rẻ nhất của cả hệ; giới hạn duy nhất còn lại là cái chỉ mục, thứ phình theo số giá trị nhãn riêng biệt chứ không theo số byte',
            ),
            B(
              'It means compression should be turned OFF, because the CPU spent achieving 12× costs more per month than the disk it saves on a VPS this size, and the shipper is the process least able to spare a core; measure the shipper\'s CPU before and after and keep whichever setting leaves more headroom',
              'Nó có nghĩa là nên TẮT nén, vì phần CPU bỏ ra để đạt 12× tốn tiền hơn phần đĩa tiết kiệm được trên một VPS cỡ này, mà trình thu gom lại là tiến trình ít dư một nhân nhất; hãy đo CPU của trình thu gom trước và sau rồi giữ lấy cấu hình nào để lại nhiều chỗ trống hơn',
            ),
            B(
              'It changes WHERE the logs live, not how long you keep them: the same thirty days is tens of gigabytes uncompressed on the local disk, because Docker\'s json-file writes uncompressed, and a few gigabytes in a store that compresses chunks. And since a managed log store bills per GB INGESTED rather than stored, the lever that actually moves the bill is VOLUME — dropping debug, one completion line instead of one per layer, and not logging successful health probes',
              'Nó làm đổi chỗ log SỐNG Ở ĐÂU, chứ không phải giữ bao lâu: cùng ba mươi ngày ấy là hàng chục gigabyte chưa nén trên đĩa cục bộ, vì json-file của Docker ghi KHÔNG nén, và chỉ vài gigabyte trong một kho biết nén từng khối. Và vì một kho log có người vận hành tính tiền theo GB NẠP VÀO chứ không phải GB lưu, cái cần gạt thật sự làm đổi hoá đơn là LƯỢNG — bỏ debug, một dòng hoàn tất thay vì một dòng mỗi tầng, và không ghi log những lượt thăm dò sức khoẻ thành công',
            ),
            B(
              'It means the local rotation limits can be relaxed, because <code>compress: "true"</code> applies the same 12× to the current file as well as the rotated ones, so a 50 MB limit is really 600 MB of history and <code>docker logs</code> can serve a whole day from disk without a shipper',
              'Nó có nghĩa là có thể nới các giới hạn xoay vòng cục bộ, vì <code>compress: "true"</code> áp đúng hệ số 12× ấy cho cả file hiện hành lẫn các file đã xoay, nên một giới hạn 50 MB thật ra là 600 MB lịch sử và <code>docker logs</code> phục vụ được nguyên một ngày từ đĩa mà không cần trình thu gom',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Structured logs are the most compressible data you will ever store — the same twenty field names repeat on every line and the values come from small sets — which is exactly why the ratio is so high and exactly why it does NOT settle the retention question. Two numbers matter for two different decisions: the uncompressed figure is what your local disk needs, the compressed figure is what the store needs. Option D is wrong on a detail worth knowing: <code>compress</code> gzips the files that have already been ROTATED, never the one currently being written.',
            'Log có cấu trúc là loại dữ liệu dễ nén nhất bạn từng lưu — vẫn hai mươi cái tên trường ấy lặp trên mọi dòng và các giá trị đến từ những tập nhỏ — nên hệ số mới cao đến thế, và cũng chính vì thế nó KHÔNG giải quyết câu hỏi giữ bao lâu. Hai con số phục vụ hai quyết định khác nhau: con số chưa nén là thứ đĩa cục bộ của bạn cần, con số đã nén là thứ cái kho cần. Lựa chọn D sai ở một chi tiết đáng biết: <code>compress</code> gzip các file ĐÃ XOAY VÒNG, không bao giờ đụng tới file đang được ghi.',
          ),
        }),

        mcq({
          prompt: B(
            'Your shipper gives you at-least-once delivery, which is what every real shipper offers. A colleague builds an alert on ' + c('count of lines matching level="error" in the last 5 minutes') + '. What is the objection?',
            'Trình thu gom log của bạn cho hợp đồng giao ÍT NHẤT MỘT LẦN, đúng thứ mà mọi trình thu gom thật đều cho. Một đồng nghiệp dựng cảnh báo trên ' + c('số dòng khớp level="error" trong 5 phút vừa rồi') + '. Phản đối ở đây là gì?',
          ),
          options: [
            B(
              'At-least-once means a line can arrive TWICE when an acknowledgement is lost, so a count of log lines is an estimate rather than a measurement. If you need an exact count of something, that is a metric — a counter incremented in the request path, before any shipping happens — not a log query. It is also the wrong pillar for a second reason: the query scans, so it gets slower exactly as traffic grows, and a flaky alert gets muted',
              'Giao ít-nhất-một-lần nghĩa là một dòng có thể tới HAI LẦN khi một lời xác nhận bị mất, nên một phép ĐẾM dòng log là một ước lượng chứ không phải một phép đo. Cần một con số ĐẾM chính xác thì đó là một chỉ số — một counter tăng ngay trong đường request, trước khi có bất kỳ chuyện thu gom nào — chứ không phải một truy vấn log. Nó còn sai trụ cột vì một lý do thứ hai: truy vấn phải QUÉT, nên nó chậm dần đúng theo đà lưu lượng tăng, và một cảnh báo chập chờn thì bị tắt tiếng',
            ),
            B(
              'At-least-once means lines can be REORDERED relative to each other, so a five-minute window can contain lines written six minutes ago and miss lines written four minutes ago; widening the window to fifteen minutes removes the effect and makes the count exact',
              'Giao ít-nhất-một-lần nghĩa là các dòng có thể bị ĐẢO THỨ TỰ so với nhau, nên một cửa sổ năm phút có thể chứa những dòng ghi từ sáu phút trước và bỏ sót những dòng ghi bốn phút trước; nới cửa sổ lên mười lăm phút là hết hiệu ứng đó và phép đếm thành chính xác',
            ),
            B(
              'There is no objection: duplicates are rare enough in practice to be within the noise of any threshold you would set, and counting log lines is the standard way to build an error-rate alert when you do not yet run Prometheus',
              'Không có gì để phản đối: trong thực tế bản trùng hiếm tới mức nằm trong khoảng nhiễu của bất kỳ ngưỡng nào bạn đặt, và đếm dòng log là cách tiêu chuẩn để dựng một cảnh báo tỉ lệ lỗi khi bạn chưa chạy Prometheus',
            ),
            B(
              'At-least-once applies only to the transport between the shipper and the store; the store itself deduplicates on ingest using the line hash and the timestamp, so the count is exact and the real objection is only about query cost',
              'Giao ít-nhất-một-lần chỉ áp cho đoạn vận chuyển giữa trình thu gom và kho; bản thân cái kho khử trùng lặp ngay lúc nạp bằng băm của dòng cộng dấu thời gian, nên phép đếm là chính xác và phản đối thật sự chỉ nằm ở chi phí truy vấn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Exactly-once is not on offer for logs, at any price, from anyone — anyone claiming it is describing at-least-once plus deduplication somewhere. So your queries must tolerate duplicates, and the practical consequence is precise: a count of log lines is an estimate. This is one of the clearest cases where knowing which pillar answers which question saves you from building the wrong thing, and it is the same trap as using logs as a metrics store: it works at first, then the search that took two seconds takes ninety, then the alert times out, then it gets muted.',
            'Giao ĐÚNG-MỘT-LẦN không có bán cho log, ở bất kỳ giá nào, từ bất kỳ ai — ai nói có là đang mô tả giao ít-nhất-một-lần cộng thêm khử trùng lặp ở đâu đó. Nên mọi truy vấn của bạn phải chịu được bản trùng, và hệ quả thực dụng rất rõ: một phép đếm dòng log là một ước lượng. Đây là một trong những ca rõ nhất cho thấy biết trụ cột nào trả lời câu hỏi nào sẽ cứu bạn khỏi dựng nhầm thứ, và nó cũng chính là cái bẫy dùng log làm kho chỉ số: lúc đầu chạy được, rồi phép tìm kiếm hai giây thành chín mươi giây, rồi cảnh báo hết giờ, rồi nó bị tắt tiếng.',
          ),
        }),

        mcq({
          prompt: B(
            'Two LogQL queries against a Loki that holds every container on the VPS:' + code(
              'A   {container="cuonghoangdev_backend"} |= "notes"\n' +
              'B   {level="error"} |= "notes"',
            ) + 'Both are short and both return results. Why is B the dangerous one?',
            'Hai truy vấn LogQL trên một Loki đang chứa mọi container của VPS:' + code(
              'A   {container="cuonghoangdev_backend"} |= "notes"\n' +
              'B   {level="error"} |= "notes"',
            ) + 'Cả hai đều ngắn và cả hai đều trả về kết quả. Vì sao B mới là cái nguy hiểm?',
          ),
          options: [
            B(
              'Because <code>level</code> is a high-cardinality label while <code>container</code> is bounded, so B selects far more distinct streams; keeping <code>level</code> out of the label set and extracting it with <code>| json</code> at query time makes B as cheap as A',
              'Vì <code>level</code> là một nhãn có lực lượng lớn còn <code>container</code> thì có chặn, nên B chọn nhiều luồng riêng biệt hơn hẳn; bỏ <code>level</code> khỏi tập nhãn và rút nó ra bằng <code>| json</code> lúc truy vấn sẽ làm B rẻ ngang A',
            ),
            B(
              'Because the first selector in B pins nothing but the level, so it selects that label across ALL containers and ALL jobs. Labels are indexed and line content is not, so the line filter after it has to scan every byte of every selected stream — on a shared store that can be thousands of streams and hundreds of gigabytes. The query is short; the bill is not. The rule of thumb is that the FIRST selector should always pin the container or the job, and everything else narrows from there',
              'Vì bộ chọn đầu tiên của B không ghim gì ngoài cái mức log, nên nó chọn cái nhãn ấy trên TOÀN BỘ container và TOÀN BỘ job. Nhãn thì được đánh chỉ mục còn nội dung dòng thì không, nên bộ lọc dòng đứng sau phải QUÉT từng byte của từng luồng đã chọn — trên một kho dùng chung thì đó có thể là hàng nghìn luồng và hàng trăm gigabyte. Truy vấn thì ngắn, hoá đơn thì không. Luật ngón tay cái là bộ chọn ĐẦU TIÊN phải luôn ghim container hoặc job, rồi mọi thứ khác thu hẹp dần từ đó',
            ),
            B(
              'Because <code>|=</code> is a substring match rather than a regular expression, so B matches the word "notes" inside JSON field NAMES as well as values and returns a far larger result set than the author intended; using <code>| json | msg=~"notes"</code> narrows it correctly',
              'Vì <code>|=</code> là phép khớp chuỗi con chứ không phải biểu thức chính quy, nên B khớp cả chữ "notes" nằm trong TÊN trường JSON lẫn trong giá trị và trả về tập kết quả lớn hơn nhiều so với ý tác giả; dùng <code>| json | msg=~"notes"</code> mới thu hẹp đúng',
            ),
            B(
              'Because B has no time range, so Loki applies its maximum retention window by default; adding an explicit range selector such as <code>[1h]</code> bounds the scan and makes the two queries equivalent in cost',
              'Vì B không có khoảng thời gian, nên Loki áp cửa sổ giữ log tối đa của nó theo mặc định; thêm một bộ chọn khoảng như <code>[1h]</code> sẽ chặn phần quét lại và làm hai truy vấn tốn ngang nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every LogQL query is: pick streams by label, then grep inside them — and the labels decide how much data the grep has to touch. This is a deliberate design: Loki is cheap because it does NOT build a full-text index, and you pay for that by choosing labels that partition your data usefully. <strong>Suy luận theo tài liệu Grafana, chưa chạy được</strong> — no Loki instance was stood up for this exam, so this question asks about query semantics rather than about a measured timing.',
            'Mọi truy vấn LogQL đều là: chọn luồng theo nhãn, rồi grep bên trong chúng — và chính các nhãn quyết định phép grep phải sờ tới bao nhiêu dữ liệu. Đây là một thiết kế có chủ ý: Loki rẻ vì nó KHÔNG dựng chỉ mục toàn văn, và cái giá bạn trả là phải chọn được những cái nhãn chia dữ liệu ra một cách hữu ích. <strong>Suy luận theo tài liệu Grafana, chưa chạy được</strong> — không có bản Loki nào được dựng cho đề này, nên câu này hỏi NGỮ NGHĨA truy vấn chứ không hỏi một con số đo được.',
          ),
        }),
        // ── Chương 3 — nối ngữ cảnh ──────────────────────────────────────
        mcq({
          prompt: B(
            'Two middlewares that both compile and both look reasonable. Only one puts the whole request inside the store:' + code(
              '// A\n' +
              'requestContext.run({ requestId: id }, next);\n' +
              '\n' +
              '// B\n' +
              'requestContext.run({ requestId: id }, () => {});\n' +
              'next();',
            ) + 'What does B produce, and why?',
            'Hai middleware, cả hai đều biên dịch được và cả hai đều nhìn hợp lý. Chỉ một cái đặt được cả cái request vào trong ngữ cảnh:' + code(
              '// A\n' +
              'requestContext.run({ requestId: id }, next);\n' +
              '\n' +
              '// B\n' +
              'requestContext.run({ requestId: id }, () => {});\n' +
              'next();',
            ) + 'B sinh ra cái gì, và vì sao?',
          ),
          options: [
            B(
              'B works identically to A. <code>run()</code> registers the store against the current async resource, and every continuation created afterwards inherits it, so calling <code>next()</code> on the following line is inside the same async chain',
              'B chạy y hệt A. <code>run()</code> đăng ký cái store lên tài nguyên bất đồng bộ hiện hành, và mọi phần tiếp nối tạo ra sau đó đều thừa kế nó, nên gọi <code>next()</code> ở dòng kế tiếp vẫn nằm trong cùng chuỗi bất đồng bộ',
            ),
            B(
              'B throws at runtime, because <code>run()</code> requires the callback to be the continuation of the request and an empty arrow function returns immediately, leaving the store attached to a resource that has already been destroyed',
              'B ném lỗi lúc chạy, vì <code>run()</code> đòi callback phải chính là phần tiếp nối của request, mà một hàm mũi tên rỗng thì trả về ngay, để cái store gắn vào một tài nguyên đã bị huỷ',
            ),
            B(
              'B attaches the store to the response instead of the request, so every log line written after <code>res.on(&quot;finish&quot;)</code> has the id and everything before it does not — which is why the request-completion line looks correct while the lines that would explain a failure do not',
              'B gắn cái store vào response thay vì vào request, nên mọi dòng log ghi sau <code>res.on(&quot;finish&quot;)</code> đều có id còn mọi dòng trước đó thì không — và đó là lý do dòng "request completed" trông có vẻ đúng trong khi những dòng lẽ ra giải thích được cú hỏng thì không',
            ),
            B(
              'B opens the store\'s scope and closes it on the same line, so <code>next()</code> — and therefore every later middleware, the router, the handler, every service it awaits and the error handler — runs OUTSIDE it and <code>getStore()</code> returns <code>undefined</code> everywhere. Passing <code>next</code> INTO <code>run()</code> is the whole trick: the rest of the request is called from inside the store\'s scope',
              'B mở phạm vi của cái store rồi đóng luôn nó ngay trên cùng một dòng, nên <code>next()</code> — và do đó mọi middleware sau, bộ định tuyến, handler, mọi service nó await và cả bộ xử lý lỗi — chạy BÊN NGOÀI nó và <code>getStore()</code> trả về <code>undefined</code> ở khắp nơi. Truyền <code>next</code> VÀO TRONG <code>run()</code> chính là toàn bộ cái mẹo: phần còn lại của request được gọi từ bên trong phạm vi của cái store',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The store follows the async CHAIN, and a chain has to start somewhere. <code>run(store, cb)</code> means "everything <code>cb</code> calls, and everything THOSE call, synchronously or not, sees this store". If <code>cb</code> is an empty function then the chain contains nothing. The failure mode is the friendly one — a missing field rather than a wrong one — but it is also completely silent, because a logger that adds <code>requestId</code> only when the context exists will happily write lines without it forever.',
            'Cái store đi theo CHUỖI bất đồng bộ, và một cái chuỗi thì phải bắt đầu ở đâu đó. <code>run(store, cb)</code> nghĩa là "mọi thứ mà <code>cb</code> gọi, và mọi thứ mà NHỮNG CÁI ĐÓ gọi, đồng bộ hay không, đều thấy cái store này". Nếu <code>cb</code> là một hàm rỗng thì cái chuỗi ấy chẳng chứa gì. Kiểu hỏng này còn là kiểu tử tế — thiếu một trường chứ không phải sai một trường — nhưng nó cũng hoàn toàn im lặng, vì một bộ log chỉ thêm <code>requestId</code> khi có ngữ cảnh sẽ vui vẻ ghi ra những dòng thiếu nó mãi mãi.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Node v22.21.0, three runs, byte-identical. Three concurrent requests A, B and C, each setting a module-level <code>currentId</code> and also entering an <code>AsyncLocalStorage</code> store, then awaiting for a different delay:' + code(
              'A.start        als=A module=A\n' +
              'B.start        als=B module=B\n' +
              'C.start        als=C module=C\n' +
              'B.afterAwait   als=B module=C\n' +
              'C.afterAwait   als=C module=C\n' +
              'A.afterAwait   als=A module=C',
            ) + 'Read the <code>module</code> column. What exactly is wrong with it, and why is that worse than having no id at all?',
            'Đo trên Node v22.21.0, ba lượt giống nhau từng byte. Ba request A, B, C chạy đồng thời, mỗi cái vừa gán một biến <code>currentId</code> ở phạm vi module vừa vào một store <code>AsyncLocalStorage</code>, rồi await với độ trễ khác nhau:' + code(
              'A.start        als=A module=A\n' +
              'B.start        als=B module=B\n' +
              'C.start        als=C module=C\n' +
              'B.afterAwait   als=B module=C\n' +
              'C.afterAwait   als=C module=C\n' +
              'A.afterAwait   als=A module=C',
            ) + 'Hãy đọc cột <code>module</code>. Nó sai chính xác ở chỗ nào, và vì sao thế còn tệ hơn là không có id nào?',
          ),
          options: [
            B(
              'All three <code>afterAwait</code> lines are wrong, because a module-level variable is never restored after an await; the correct reading is that the module column carries no information at all and any line produced from it should be discarded',
              'Cả ba dòng <code>afterAwait</code> đều sai, vì một biến ở phạm vi module không bao giờ được khôi phục sau một await; cách đọc đúng là cột module chẳng mang thông tin gì và mọi dòng sinh ra từ nó nên bị vứt',
            ),
            B(
              'The module column is wrong only for A, because A has the longest delay and therefore resumes last; requests that finish in the order they started are unaffected, which is why the pattern survives in codebases with short handlers',
              'Cột module chỉ sai với A, vì A có độ trễ dài nhất nên hồi lại sau cùng; những request kết thúc đúng thứ tự đã bắt đầu thì không bị ảnh hưởng, và đó là lý do khuôn mẫu này sống sót trong các kho có handler ngắn',
            ),
            B(
              'Nothing is wrong: the module column reports the request that was most recently STARTED, which is a valid and useful piece of context; it simply answers a different question from the one the ALS column answers',
              'Không có gì sai: cột module báo lại cái request được BẮT ĐẦU gần nhất, một mẩu ngữ cảnh hợp lệ và hữu ích; nó chỉ trả lời một câu hỏi khác với câu mà cột ALS trả lời',
            ),
            B(
              'Two of the three <code>afterAwait</code> lines carry the WRONG id — B\'s says C and A\'s says C — while C\'s is right by accident, because C happened to be the last request to set the variable. The lines look perfectly normal; nothing is missing and nothing errors. Missing context is visible in your logs, borrowed context is not, so this produces evidence that is confidently wrong rather than absent',
              'Hai trong ba dòng <code>afterAwait</code> mang id SAI — dòng của B ghi C và dòng của A cũng ghi C — còn dòng của C thì đúng do TÌNH CỜ, vì C ngẫu nhiên là request cuối cùng gán cái biến. Các dòng ấy nhìn hoàn toàn bình thường; không thiếu gì và không lỗi gì. Ngữ cảnh THIẾU thì nhìn thấy được trong log, ngữ cảnh MƯỢN thì không, nên cái này sinh ra bằng chứng SAI MỘT CÁCH TỰ TIN chứ không phải bằng chứng vắng mặt',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The measurement is the argument. The module-level variable appears to work in development, where you are the only user and requests never overlap; it corrupts data in production, where they always do. And note the specific cruelty of the transcript: one of the three lines is right, so a spot check has a one-in-three chance of confirming the pattern. The ALS column is correct on every line for the reason lesson 3.2 gives — the store is attached to the async chain rather than to a variable, so two concurrent requests each get their own and neither can see the other\'s.' +
              sim('observability-context', 'obs-3-2-asynclocalstorage', 'Watch two requests share one variable'),
            'Chính phép đo là lý lẽ. Cái biến ở phạm vi module có vẻ chạy được ở môi trường phát triển, nơi bạn là người dùng duy nhất và các request không bao giờ chồng lên nhau; nó làm hỏng dữ liệu trên production, nơi chúng luôn chồng lên nhau. Và để ý cái ác riêng của đoạn output này: một trong ba dòng lại ĐÚNG, nên một phép kiểm ngẫu nhiên có một phần ba cơ hội xác nhận nhầm cho cái khuôn mẫu hỏng. Cột ALS đúng ở mọi dòng vì đúng lý do bài 3.2 nêu — cái store gắn vào chuỗi bất đồng bộ chứ không gắn vào một biến, nên hai request đồng thời mỗi cái có một store riêng và không cái nào thấy được của cái kia.' +
              sim('observability-context', 'obs-3-2-asynclocalstorage', 'Xem hai request dùng chung một biến'),
          ),
        }),

        mcq({
          prompt: B(
            'Two facts about this repository, both checkable with grep:' + code(
              '$ grep -n "proxy_set_header" nginx/nginx.conf\n' +
              '171:  proxy_set_header Host $host;\n' +
              '172:  proxy_set_header X-Real-IP $remote_addr;\n' +
              '173:  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n' +
              '174:  proxy_set_header X-Forwarded-Proto $scheme;\n' +
              '\n' +
              '$ grep -c "X-Request-ID\\|request_id" nginx/nginx.conf\n' +
              '0',
            ) + 'The Express middleware honours an inbound <code>X-Request-ID</code>. What is the consequence of these two facts together?',
            'Hai dữ kiện về kho này, cả hai đều kiểm được bằng grep:' + code(
              '$ grep -n "proxy_set_header" nginx/nginx.conf\n' +
              '171:  proxy_set_header Host $host;\n' +
              '172:  proxy_set_header X-Real-IP $remote_addr;\n' +
              '173:  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n' +
              '174:  proxy_set_header X-Forwarded-Proto $scheme;\n' +
              '\n' +
              '$ grep -c "X-Request-ID\\|request_id" nginx/nginx.conf\n' +
              '0',
            ) + 'Middleware của Express có tôn trọng một <code>X-Request-ID</code> gửi tới. Hai dữ kiện đó cộng lại dẫn tới hệ quả gì?',
          ),
          options: [
            B(
              'None that matters. nginx does not need to forward an id because <code>proxy_pass</code> copies every inbound header through to the upstream by default, so a client-supplied <code>X-Request-ID</code> reaches Express unchanged and the branch fires normally',
              'Chẳng hệ quả gì đáng kể. nginx không cần chuyển tiếp một cái id, vì mặc định <code>proxy_pass</code> chép mọi header gửi tới sang phía sau, nên một <code>X-Request-ID</code> do client gửi vẫn tới Express nguyên vẹn và nhánh ấy chạy bình thường',
            ),
            B(
              'The middleware\'s "honour an inbound id" branch is DEAD CODE in production — Express mints a fresh id on every request. Meanwhile nginx already computes its own <code>$request_id</code> for every request and this config logs neither it nor Express\'s, so an nginx 502 and the backend error that caused it share no field but a timestamp and cannot be joined. The fix is two lines: log <code>$request_id</code> in the access format, and forward it as <code>X-Request-ID</code>',
              'Cái nhánh "tôn trọng id gửi tới" của middleware là MÃ CHẾT trên production — Express tự đúc một id mới ở mọi request. Trong khi đó nginx đã tự tính sẵn một <code>$request_id</code> cho mọi request và cấu hình này không ghi log cái nào cả, không của nginx cũng không của Express, nên một lỗi 502 của nginx và lỗi backend gây ra nó không chung trường nào ngoài dấu thời gian, và không nối lại được. Cách sửa là hai dòng: ghi <code>$request_id</code> vào khuôn access log, và chuyển tiếp nó dưới dạng <code>X-Request-ID</code>',
            ),
            B(
              'nginx will reject any request that arrives carrying an <code>X-Request-ID</code> header, because a header not named in a <code>proxy_set_header</code> directive is treated as unexpected and stripped with a 400; that is why the branch never fires',
              'nginx sẽ từ chối mọi request mang theo header <code>X-Request-ID</code>, vì một header không được nêu tên trong chỉ thị <code>proxy_set_header</code> nào bị coi là bất thường và bị gạt đi kèm mã 400; đó là lý do cái nhánh ấy không bao giờ chạy',
            ),
            B(
              'Express and nginx will disagree about the id, so each log line carries two different values for the same request and the join produces a cross product; the correct fix is to remove the inbound branch entirely and let Express be the single source of the id',
              'Express và nginx sẽ bất đồng về cái id, nên mỗi dòng log mang hai giá trị khác nhau cho cùng một request và phép nối sinh ra tích chéo; cách sửa đúng là bỏ hẳn cái nhánh "id gửi tới" và để Express là nguồn duy nhất của id',
            ),
          ],
          correct: 1,
          explanation: EX(
            'nginx does not pass arbitrary headers through by default in the way option A claims, and it certainly does not reject them as in option C. What it does do is compute <code>$request_id</code> — a value it creates for every single request — and this config throws it away. So two ids exist per request and neither is written next to the other. The whole fix is one variable added to <code>log_format</code> and one <code>proxy_set_header</code> line, which is why lesson 12.2 puts it in the first two hours of work.',
            'nginx không tự chuyển tiếp header tuỳ ý theo kiểu lựa chọn A nói, và chắc chắn cũng không từ chối chúng như lựa chọn C. Cái nó có làm là tính ra <code>$request_id</code> — một giá trị nó tạo cho từng request một — và cấu hình này thì vứt nó đi. Vậy là mỗi request có hai cái id và không cái nào được ghi cạnh cái nào. Toàn bộ cách sửa là thêm một biến vào <code>log_format</code> và một dòng <code>proxy_set_header</code>, nên bài 12.2 xếp nó vào hai giờ làm việc đầu tiên.',
          ),
        }),

        mcq({
          prompt: B(
            'Postgres logs a slow query, and the line contains only SQL:' + code('duration: 4821.332 ms  execute: SELECT ... FROM "Note" WHERE ...') + 'Express cannot send a header to Postgres. How do you make that line joinable to the request that caused it?',
            'Postgres ghi lại một truy vấn chậm, và dòng ấy chỉ có SQL:' + code('duration: 4821.332 ms  execute: SELECT ... FROM "Note" WHERE ...') + 'Express không gửi được header sang Postgres. Làm sao để nối dòng ấy về đúng cái request đã gây ra nó?',
          ),
          options: [
            B(
              'Set a session variable at the start of each request with <code>SET LOCAL app.request_id = ...</code>; Postgres includes every session variable in the slow-query log entry, so the id appears automatically on any statement that crosses the threshold',
              'Đặt một biến phiên ở đầu mỗi request bằng <code>SET LOCAL app.request_id = ...</code>; Postgres đưa mọi biến phiên vào bản ghi slow-query, nên cái id tự xuất hiện trên bất kỳ câu lệnh nào vượt ngưỡng',
            ),
            B(
              'Give the pool one connection per request so the backend PID in the Postgres log identifies the request; the pool already records which request holds which connection, so the join is a lookup on PID and timestamp',
              'Cho bể kết nối một kết nối riêng cho mỗi request để PID phía sau trong log Postgres nhận diện được request; bể vốn đã ghi request nào đang giữ kết nối nào, nên phép nối chỉ là tra theo PID và dấu thời gian',
            ),
            B(
              'You cannot, and you should not try: the database is a separate system with its own clock, so the correct approach is to log the query duration on the application side as well and join on duration and timestamp',
              'Không nối được, và cũng không nên cố: cơ sở dữ liệu là một hệ thống riêng với đồng hồ riêng, nên cách đúng là ghi luôn thời lượng truy vấn ở phía ứng dụng rồi nối theo thời lượng và dấu thời gian',
            ),
            B(
              'Smuggle the context into an SQL COMMENT — the sqlcommenter convention — so the statement becomes <code>/*requestId=&quot;V1StGXR8_Z5j&quot;,route=&quot;/api/v1/notes&quot;*/ SELECT ...</code>. Comments survive into <code>pg_stat_statements</code> and the slow-query log, so the id is searchable in the same store as every application line for that request. "The API was slow" and "this query took 4.8 seconds" are nearly useless apart and conclusive together',
              'Nhét ngữ cảnh vào một CHÚ THÍCH SQL — quy ước sqlcommenter — để câu lệnh thành <code>/*requestId=&quot;V1StGXR8_Z5j&quot;,route=&quot;/api/v1/notes&quot;*/ SELECT ...</code>. Chú thích sống sót vào tận <code>pg_stat_statements</code> và slow-query log, nên cái id tìm kiếm được trong cùng cái kho chứa mọi dòng log ứng dụng của request đó. "API chậm" và "truy vấn này mất 4,8 giây" là hai dữ kiện gần như vô dụng khi rời nhau và có tính kết luận khi đứng cạnh nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the boundary people give up on, and it is the one that pays best. Of the four boundaries a request crosses in this repo — nginx to Express (a header), Express to Postgres (a protocol with no header), Express to a queued worker (the job outlives the request, so the id must be stored in the payload), and Express to an external API (you control the outbound header and not their logs) — the database one is the only one where the trick is not obvious, and it is the one that turns "the API was slow" into a specific statement with a duration attached.',
            'Đây là cái ranh giới người ta hay bỏ cuộc, và nó lại là cái đáng giá nhất. Trong bốn ranh giới mà một request trong kho này đi qua — nginx sang Express (một header), Express sang Postgres (một giao thức không có header), Express sang một worker trong hàng đợi (việc sống lâu hơn request nên id phải nằm trong payload), và Express sang một API bên ngoài (bạn kiểm soát header đi ra chứ không kiểm soát log của họ) — thì cái ranh giới cơ sở dữ liệu là cái duy nhất mà mẹo không hiển nhiên, và nó là cái biến "API chậm" thành một câu lệnh cụ thể có kèm thời lượng.',
          ),
        }),

        mcq({
          prompt: B(
            'Your service sits behind Cloudflare and then nginx, so <code>X-Forwarded-For</code> arrives as ' + c('<client>, <cloudflare>, <nginx>') + '. A colleague reads the leftmost value into the log line and into the rate limiter. What is wrong, and what is the correct configuration?',
            'Dịch vụ của bạn nằm sau Cloudflare rồi tới nginx, nên <code>X-Forwarded-For</code> tới nơi ở dạng ' + c('<client>, <cloudflare>, <nginx>') + '. Một đồng nghiệp lấy giá trị ngoài cùng bên trái đưa vào dòng log và vào bộ giới hạn tần suất. Sai ở đâu, và cấu hình đúng là gì?',
          ),
          options: [
            B(
              'The header is APPENDED to at every hop and any client can pre-populate it, so the leftmost value is attacker-controlled rather than the true client — a spoofable string in your logs and, worse, in your rate limiter. Express has the correct machinery: set <code>app.set(&quot;trust proxy&quot;, &lt;number of proxies you actually run&gt;)</code> and read <code>req.ip</code>, which then counts from the RIGHT and skips exactly that many hops',
              'Cái header ấy được NỐI THÊM ở mỗi chặng và client nào cũng có thể điền sẵn vào, nên giá trị ngoài cùng bên trái là do kẻ tấn công kiểm soát chứ không phải client thật — một chuỗi giả mạo được nằm trong log của bạn và, tệ hơn, nằm trong bộ giới hạn tần suất. Express có sẵn bộ máy đúng: đặt <code>app.set(&quot;trust proxy&quot;, &lt;số proxy bạn thật sự chạy&gt;)</code> rồi đọc <code>req.ip</code>, khi ấy nó đếm TỪ PHẢI SANG và bỏ qua đúng chừng ấy chặng',
            ),
            B(
              'The leftmost value is correct by specification — every proxy prepends rather than appends — so the log line is right and only the rate limiter is wrong, because it should key on the authenticated user id rather than on any address at all',
              'Giá trị ngoài cùng bên trái là đúng theo đặc tả — mọi proxy đều CHÈN VÀO ĐẦU chứ không nối vào cuối — nên dòng log là đúng và chỉ có bộ giới hạn tần suất là sai, vì nó nên khoá theo id người dùng đã xác thực chứ không theo địa chỉ nào cả',
            ),
            B(
              'Nothing is wrong with the reading, but the value should not be logged at all: an IP address is personal data under most regimes, so the correct configuration is to drop the header before it reaches the logger and to rate-limit on a hash of it instead',
              'Cách đọc thì không sai, nhưng giá trị ấy lẽ ra không nên được ghi log chút nào: địa chỉ IP là dữ liệu cá nhân theo hầu hết các chế định, nên cấu hình đúng là bỏ header đó trước khi nó tới bộ log và giới hạn tần suất theo một băm của nó',
            ),
            B(
              'The mistake is only that <code>trust proxy</code> was left unset; setting it to <code>true</code> is the correct fix, because that tells Express the whole chain is trustworthy and it will then return the leftmost address, which is the one you want',
              'Sai duy nhất là chưa đặt <code>trust proxy</code>; đặt nó thành <code>true</code> là cách sửa đúng, vì như thế là bảo Express rằng cả chuỗi đều đáng tin và nó sẽ trả về địa chỉ ngoài cùng bên trái, đúng cái bạn muốn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Option D is the same bug with extra steps, and it is the one people actually ship: <code>trust proxy: true</code> trusts the WHOLE chain, including whatever the client injected, so it hands you back the attacker-controlled value with a configuration flag making it look deliberate. The number matters because it is what tells Express how many entries to skip from the right — the only end of the list your own infrastructure wrote.',
            'Lựa chọn D là đúng cái lỗi ấy với thêm vài bước, và nó là cái người ta thật sự đem lên production: <code>trust proxy: true</code> tin CẢ chuỗi, kể cả phần client nhét vào, nên nó trả lại cho bạn đúng cái giá trị do kẻ tấn công kiểm soát, kèm một cờ cấu hình khiến chuyện đó trông như có chủ ý. Con SỐ mới quan trọng, vì nó là thứ bảo Express phải bỏ qua bao nhiêu phần tử tính TỪ PHẢI — đầu duy nhất của cái danh sách do chính hạ tầng của bạn ghi ra.',
          ),
        }),

        mcq({
          prompt: B(
            'You receive ' + c('traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01') + ' and then make an outbound call to the LLM gateway. Choose the TWO statements that describe the header you must send. (choose TWO)',
            'Bạn nhận được ' + c('traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01') + ' rồi gọi ra ngoài tới cổng LLM. Chọn HAI phát biểu mô tả đúng cái header bạn phải gửi đi. (chọn HAI)',
          ),
          options: [
            B(
              'The trace-id stays byte-for-byte identical, because it names the logical operation and never changes for its whole life',
              'Phần trace-id giữ nguyên từng byte, vì nó gọi tên cái thao tác logic và không bao giờ đổi trong suốt vòng đời của nó',
            ),
            B(
              'The parent-id must be a NEW 16-hex value — your own span\'s id — because that field means "who called me" and changes at every hop',
              'Phần parent-id phải là một giá trị 16 chữ số hex MỚI — id span của chính bạn — vì trường ấy có nghĩa là "ai đã gọi tôi" và đổi ở mỗi chặng',
            ),
            B(
              'The parent-id must be copied through unchanged, because the far end needs to know which span originally started the trace',
              'Phần parent-id phải được chép nguyên xi, vì đầu bên kia cần biết span nào đã khởi đầu cái trace này',
            ),
            B(
              'The flags byte should be recomputed from your own sampling decision, so that each service decides independently whether the call it makes is worth keeping',
              'Byte cờ nên được tính lại theo quyết định lấy mẫu của chính bạn, để mỗi dịch vụ tự quyết một cách độc lập xem lời gọi mình thực hiện có đáng giữ hay không',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Four fields, fixed widths, dash-separated: version, trace-id (16 bytes / 32 hex, one per logical operation), parent-id (8 bytes / 16 hex, THIS span, changes at every hop) and flags. Option C inverts the meaning of parent-id — it is not the root, it is your immediate caller, which is exactly what lets a tool draw a tree rather than a list. Option D is the mistake the flags byte exists to prevent: whoever decides "keep this trace" decides ONCE, at the edge, and every downstream service honours it. Sampling independently at each hop is how you get traces with holes in them.',
            'Bốn trường, độ rộng cố định, ngăn bằng dấu gạch: version, trace-id (16 byte / 32 hex, một cái cho mỗi thao tác logic), parent-id (8 byte / 16 hex, chính là SPAN NÀY, đổi ở mỗi chặng) và flags. Lựa chọn C hiểu ngược nghĩa của parent-id — nó không phải cái gốc, nó là bên gọi TRỰC TIẾP của bạn, và đúng điều đó mới cho phép một công cụ vẽ ra một cái cây thay vì một danh sách. Lựa chọn D là đúng cái sai lầm mà byte cờ sinh ra để ngăn: ai quyết "giữ trace này" thì quyết MỘT LẦN, ở biên, và mọi dịch vụ phía sau tôn trọng quyết định đó. Mỗi chặng tự lấy mẫu riêng chính là cách bạn thu được những cái trace thủng lỗ chỗ.',
          ),
        }),

        mcq({
          prompt: B(
            'The middleware accepts an inbound id when it is at most 64 characters. Measured against the OpenTelemetry W3C propagator (API 1.9.1), the validation regex the course gives for <code>traceparent</code> — ' + c('/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/') + ' — ACCEPTS an all-zero trace-id and an all-zero parent-id, while the propagator REJECTS both. What is the general lesson for an id that arrives from the internet?',
            'Middleware nhận một id gửi tới khi nó dài không quá 64 ký tự. Đo thật với bộ truyền ngữ cảnh W3C của OpenTelemetry (API 1.9.1): đoạn regex kiểm <code>traceparent</code> mà giáo trình đưa ra — ' + c('/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/') + ' — NHẬN cả trace-id toàn số 0 lẫn parent-id toàn số 0, trong khi bộ truyền ngữ cảnh TỪ CHỐI cả hai. Bài học chung cho một cái id đến từ internet là gì?',
          ),
          options: [
            B(
              'That an inbound id should never be honoured at all, because any value a client can influence is a value an attacker can choose; the only safe design is to generate the id yourself at the edge and treat the header as decoration',
              'Rằng một id gửi tới thì đừng bao giờ tôn trọng, vì bất kỳ giá trị nào client tác động được cũng là giá trị kẻ tấn công chọn được; thiết kế an toàn duy nhất là tự sinh id ở biên và coi cái header kia như đồ trang trí',
            ),
            B(
              'That the regex should be replaced by the propagator, since a library that already implements the specification is always the right answer and hand-written validation of a standard format is never justified',
              'Rằng nên thay đoạn regex bằng bộ truyền ngữ cảnh, vì một thư viện đã cài sẵn đặc tả thì luôn là câu trả lời đúng và tự tay viết phép kiểm cho một khuôn dạng chuẩn thì không bao giờ chính đáng',
            ),
            B(
              'That a LENGTH cap is necessary and not sufficient: you must validate the SHAPE. Without a shape check a newline in the id forges a whole log entry, control characters break the tools that read the file, and a value the specification calls "invalid" is quietly accepted as a join key. Validate against something like <code>/^[A-Za-z0-9_-]{8,64}$/</code>, else generate your own — and accept an inbound id only when the request arrived through a proxy you control',
              'Rằng chặn ĐỘ DÀI là cần chứ không đủ: phải kiểm cả HÌNH DẠNG. Không kiểm hình dạng thì một ký tự xuống dòng trong id giả mạo được nguyên một bản ghi log, các ký tự điều khiển làm hỏng những công cụ đọc file ấy, và một giá trị mà đặc tả gọi thẳng là "invalid" thì được nhận vào âm thầm làm khoá nối. Hãy kiểm bằng một thứ đại loại <code>/^[A-Za-z0-9_-]{8,64}$/</code>, không khớp thì tự sinh — và chỉ nhận id gửi tới khi request đi qua một proxy do bạn kiểm soát',
            ),
            B(
              'That the 64-character cap is the wrong bound: trace ids are exactly 32 hex characters and request ids are 12, so the cap should be tightened to 32 and the shape then follows automatically from the length',
              'Rằng cái chặn 64 ký tự là chặn sai chỗ: trace id đúng 32 ký tự hex còn request id là 12, nên chặn nên siết về 32 và khi ấy hình dạng tự suy ra được từ độ dài',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two consequences, both quiet. First, an id is a JOIN KEY: a client that sends the same id on every request merges its traffic with someone else\'s in your queries, and one that copies an id out of another user\'s response header can pollute that user\'s timeline. Second, the id lands in log storage, so its character set matters as much as its length. The measured divergence above is the same idea at a different layer — the specification calls an all-zero trace-id "invalid" and the propagator enforces that, while a regex that only checks "32 hex characters" cannot.',
            'Hai hệ quả, cả hai đều lặng lẽ. Một, một cái id là một KHOÁ NỐI: một client gửi cùng một id ở mọi request sẽ trộn lưu lượng của nó với của người khác trong các truy vấn của bạn, còn một client chép id ra từ header phản hồi của người dùng khác thì làm bẩn được dòng thời gian của người đó. Hai, cái id ấy rơi vào kho log, nên tập ký tự của nó quan trọng ngang độ dài. Chỗ lệch đo được ở trên là cùng một ý ở một tầng khác — đặc tả gọi thẳng một trace-id toàn số 0 là "invalid" và bộ truyền ngữ cảnh thi hành điều đó, còn một regex chỉ kiểm "32 ký tự hex" thì không thể.',
          ),
        }),
        // ── Chương 4 — chỉ số ────────────────────────────────────────────
        mcq({
          prompt: B(
            'A queue occasionally backs up to 4,000 jobs for about 200 milliseconds and then drains. You expose <code>queue_depth</code> as a Gauge and Prometheus scrapes it every 15 seconds. What does the dashboard show, and what should you do about it?',
            'Một hàng đợi thỉnh thoảng dồn lên tới 4.000 việc trong khoảng 200 mili-giây rồi rút hết. Bạn phơi <code>queue_depth</code> dưới dạng Gauge và Prometheus lấy mẫu mỗi 15 giây. Bảng theo dõi hiện ra cái gì, và bạn nên làm gì?',
          ),
          options: [
            B(
              'It shows the burst as a spike whose height is correct but whose width is wrong: Prometheus records the value it read plus the time until the next scrape, so a 200 ms burst is drawn as a 15-second plateau and looks fifteen times worse than it was',
              'Nó hiện cú dồn thành một đỉnh nhọn cao đúng nhưng rộng sai: Prometheus ghi lại giá trị nó đọc được cộng khoảng thời gian tới lần lấy mẫu sau, nên một cú dồn 200 ms được vẽ thành một cao nguyên 15 giây và trông tệ hơn thực tế mười lăm lần',
            ),
            B(
              'It shows the burst correctly, because prom-client keeps the maximum value seen since the previous scrape and reports that rather than the instantaneous one — which is exactly what makes a Gauge safe to sample slowly',
              'Nó hiện đúng cú dồn, vì prom-client giữ lại giá trị LỚN NHẤT thấy được từ lần lấy mẫu trước và báo cáo con số đó thay vì con số tức thời — và chính điều đó làm một Gauge an toàn khi lấy mẫu thưa',
            ),
            B(
              'It shows a sawtooth whose period is the scrape interval, because a Gauge is reset to zero after every successful scrape; reading it as a rate over the interval recovers the true peak',
              'Nó hiện một hình răng cưa có chu kỳ đúng bằng khoảng lấy mẫu, vì một Gauge bị đặt lại về 0 sau mỗi lần lấy mẫu thành công; đọc nó dưới dạng tốc độ trên khoảng ấy là khôi phục được đỉnh thật',
            ),
            B(
              'It shows nothing at all. A Gauge is SAMPLED, not accumulated, so a spike that lives entirely between two scrapes is invisible — 200 ms of burst has roughly a one-in-seventy-five chance of being caught. If the spike matters, count it with a Counter (every burst increments, nothing can be missed) or bucket it with a Histogram; the Gauge stays for "how full is it right now"',
              'Nó chẳng hiện gì cả. Một Gauge là con số được LẤY MẪU chứ không phải tích luỹ, nên một cú vọt sống trọn vẹn giữa hai lần lấy mẫu là vô hình — 200 ms dồn có cỡ một phần bảy mươi lăm cơ hội bị bắt được. Nếu cú vọt ấy quan trọng thì hãy ĐẾM nó bằng một Counter (mỗi lần dồn là một lần tăng, không bỏ sót được cái nào) hoặc chia ô bằng một Histogram; còn Gauge thì để dành cho câu "ngay lúc này nó đầy tới đâu"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A Gauge is the only kind where the raw value is meaningful on its own, and it is also the only kind that can miss an event entirely. That is the trade: a Counter never misses anything but tells you nothing about "now", a Gauge tells you about "now" and sees only the instants it was asked. The four kinds map to four questions — how many (Counter), how much right now (Gauge), how long (Histogram), and how long on ONE instance you will never aggregate (Summary, and almost always the wrong answer).',
            'Gauge là loại duy nhất mà giá trị thô tự nó có nghĩa, và nó cũng là loại duy nhất có thể bỏ sót hẳn một sự kiện. Đó là cái đánh đổi: một Counter không bỏ sót gì nhưng chẳng nói được gì về "bây giờ", còn một Gauge nói được về "bây giờ" nhưng chỉ nhìn thấy đúng những khoảnh khắc nó được hỏi. Bốn loại ứng với bốn câu hỏi — bao nhiêu cái (Counter), ngay lúc này bao nhiêu (Gauge), mất bao lâu (Histogram), và mất bao lâu TRÊN MỘT bản chạy mà bạn sẽ không bao giờ gộp lại (Summary, và gần như luôn là đáp án sai).',
          ),
        }),

        mcq({
          prompt: B(
            'Verbatim from a real <code>register.metrics()</code> on prom-client 15.1.3, after six observations on one route:' + code(
              'http_request_duration_seconds_bucket{le="0.01",method="GET",route="/notes/:id"} 0\n' +
              'http_request_duration_seconds_bucket{le="0.025",method="GET",route="/notes/:id"} 2\n' +
              'http_request_duration_seconds_bucket{le="0.05",method="GET",route="/notes/:id"} 4\n' +
              'http_request_duration_seconds_bucket{le="0.1",method="GET",route="/notes/:id"} 4\n' +
              'http_request_duration_seconds_bucket{le="0.5",method="GET",route="/notes/:id"} 5\n' +
              'http_request_duration_seconds_bucket{le="1",method="GET",route="/notes/:id"} 5\n' +
              'http_request_duration_seconds_bucket{le="+Inf",method="GET",route="/notes/:id"} 6\n' +
              'http_request_duration_seconds_sum{method="GET",route="/notes/:id"} 2.825\n' +
              'http_request_duration_seconds_count{method="GET",route="/notes/:id"} 6',
            ) + 'How many requests took MORE than 25 ms but no more than 50 ms, and how many exceeded the largest finite boundary?',
            'Nguyên văn từ một lời gọi <code>register.metrics()</code> thật trên prom-client 15.1.3, sau sáu phép quan sát trên một route:' + code(
              'http_request_duration_seconds_bucket{le="0.01",method="GET",route="/notes/:id"} 0\n' +
              'http_request_duration_seconds_bucket{le="0.025",method="GET",route="/notes/:id"} 2\n' +
              'http_request_duration_seconds_bucket{le="0.05",method="GET",route="/notes/:id"} 4\n' +
              'http_request_duration_seconds_bucket{le="0.1",method="GET",route="/notes/:id"} 4\n' +
              'http_request_duration_seconds_bucket{le="0.5",method="GET",route="/notes/:id"} 5\n' +
              'http_request_duration_seconds_bucket{le="1",method="GET",route="/notes/:id"} 5\n' +
              'http_request_duration_seconds_bucket{le="+Inf",method="GET",route="/notes/:id"} 6\n' +
              'http_request_duration_seconds_sum{method="GET",route="/notes/:id"} 2.825\n' +
              'http_request_duration_seconds_count{method="GET",route="/notes/:id"} 6',
            ) + 'Có bao nhiêu request mất HƠN 25 ms nhưng không quá 50 ms, và bao nhiêu cái vượt ranh giới hữu hạn lớn nhất?',
          ),
          options: [
            B(
              'Four in that range and six above the top boundary, reading each <code>_bucket</code> value as the count that fell into that individual bucket and <code>+Inf</code> as the total number of observations recorded',
              'Bốn cái trong khoảng đó và sáu cái vượt ranh giới trên cùng, đọc mỗi giá trị <code>_bucket</code> là số quan sát rơi vào riêng cái ô đó và <code>+Inf</code> là tổng số quan sát đã ghi',
            ),
            B(
              'Two in that range and one above the top boundary. The values are CUMULATIVE — <code>le</code> means less-or-equal — so the count inside a bucket is the difference between it and the one below: 4 − 2 = 2. And 6 − 5 = 1 observation is greater than 1 second, which is the only thing the <code>+Inf</code> bucket can tell you about it',
              'Hai cái trong khoảng đó và một cái vượt ranh giới trên cùng. Các giá trị là CỘNG DỒN — <code>le</code> nghĩa là nhỏ-hơn-hoặc-bằng — nên số nằm trong một ô là hiệu giữa nó và ô ngay dưới: 4 − 2 = 2. Và 6 − 5 = 1 quan sát lớn hơn 1 giây, đó là điều duy nhất cái ô <code>+Inf</code> nói được về nó',
            ),
            B(
              'Two in that range and none above the top boundary, because a <code>+Inf</code> bucket is emitted unconditionally as a formatting convention and its value always equals <code>_count</code> whether or not anything exceeded the largest boundary',
              'Hai cái trong khoảng đó và không cái nào vượt ranh giới trên cùng, vì ô <code>+Inf</code> luôn được phát ra như một quy ước định dạng và giá trị của nó luôn bằng <code>_count</code>, bất kể có cái nào vượt ranh giới lớn nhất hay không',
            ),
            B(
              'It cannot be determined from this block: bucket counts tell you the distribution but the exposition format does not preserve which side of a boundary an observation fell on, which is why <code>_sum</code> is emitted alongside them',
              'Không xác định được từ khối này: số đếm trong các ô cho biết phân bố nhưng khuôn phơi chỉ số không giữ lại thông tin quan sát rơi về phía nào của một ranh giới, và đó là lý do <code>_sum</code> được phát ra kèm theo',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Observing a request increments EVERY bucket it fits in, which is what makes the values cumulative and what makes histograms addable across instances — buckets are counters, counters add, and the percentile is computed after summing. The six real observations behind this block were 12, 18, 31, 44, 220 and 2500 ms, which is exactly 2 in the 25–50 ms band and exactly 1 above 1 second. Nothing is stored per request, and the size never grows with traffic.',
            'Ghi nhận một request là tăng MỌI cái ô mà nó lọt vào, và chính điều đó làm các giá trị mang tính cộng dồn, đồng thời làm cho histogram cộng được giữa nhiều bản chạy — các ô là counter, counter thì cộng được, và phân vị được tính SAU khi cộng. Sáu quan sát thật đằng sau khối này là 12, 18, 31, 44, 220 và 2500 ms, tức đúng 2 cái trong dải 25–50 ms và đúng 1 cái vượt 1 giây. Không có gì được lưu theo từng request, và kích thước không bao giờ phình theo lưu lượng.',
          ),
        }),

        mcq({
          prompt: B(
            'Real query against Prometheus v3.5.0, on the histogram in the previous question (observations 12, 18, 31, 44, 220, 2500 ms):' + code(
              'histogram_quantile(0.50, sum by (le) (http_request_duration_seconds_bucket{route="/notes/:id"}))\n' +
              '  -> 0.0375\n' +
              '\n' +
              'http_request_duration_seconds_sum / http_request_duration_seconds_count\n' +
              '  -> 0.4708333333333334',
            ) + 'The third-smallest of the six samples is 31 ms. Why does the histogram report 37.5 ms?',
            'Truy vấn thật trên Prometheus v3.5.0, trên đúng cái histogram ở câu trước (các quan sát 12, 18, 31, 44, 220, 2500 ms):' + code(
              'histogram_quantile(0.50, sum by (le) (http_request_duration_seconds_bucket{route="/notes/:id"}))\n' +
              '  -> 0.0375\n' +
              '\n' +
              'http_request_duration_seconds_sum / http_request_duration_seconds_count\n' +
              '  -> 0.4708333333333334',
            ) + 'Mẫu nhỏ thứ ba trong sáu mẫu là 31 ms. Vì sao histogram lại báo 37,5 ms?',
          ),
          options: [
            B(
              'Because <code>histogram_quantile</code> uses the <code>_sum</code> to correct for skew inside the selected bucket, so the answer is pulled toward the mean of 470.8 ms; with only six observations that correction is large and it disappears as the sample count grows',
              'Vì <code>histogram_quantile</code> dùng <code>_sum</code> để hiệu chỉnh độ lệch bên trong cái ô được chọn, nên đáp số bị kéo về phía trung bình 470,8 ms; với chỉ sáu quan sát thì phần hiệu chỉnh ấy lớn, và nó biến mất khi số mẫu tăng lên',
            ),
            B(
              'Because Prometheus computes the median as the midpoint between the third and fourth samples, 31 and 44 ms, and 37.5 ms is exactly that midpoint — an interpolation between the two middle observations rather than a bucket effect',
              'Vì Prometheus tính trung vị bằng điểm giữa của mẫu thứ ba và thứ tư, tức 31 và 44 ms, và 37,5 ms đúng bằng điểm giữa đó — một phép nội suy giữa hai quan sát ở giữa chứ không phải hiệu ứng của các ô',
            ),
            B(
              'Because the sample at 2500 ms fell into the <code>+Inf</code> bucket and therefore contributes no upper bound, so every quantile below p99 is shifted upward by the missing mass; excluding it from the count would return 31 ms exactly',
              'Vì mẫu 2500 ms rơi vào ô <code>+Inf</code> nên nó không đóng góp một cận trên nào, do đó mọi phân vị dưới p99 đều bị đẩy lên bởi phần khối lượng thiếu ấy; loại nó khỏi phép đếm sẽ trả về đúng 31 ms',
            ),
            B(
              'Because the histogram does not know where inside a bucket its observations sit — it INTERPOLATES LINEARLY across the bucket that contains the target rank. Rank 3 of 6 falls in the bucket ' + c('(0.025, 0.05]') + ', which holds 2 observations, so the answer is 0.025 + 0.025 × (3 − 2) / 2 = 0.0375. It is not a bug and it is not a rounding error: the wider the bucket relative to where the data actually sits, the more wrong the answer, and the error is SILENT',
              'Vì histogram không biết các quan sát của nó nằm ở đâu BÊN TRONG một cái ô — nó NỘI SUY TUYẾN TÍNH qua cái ô chứa thứ hạng cần tìm. Hạng 3 trên 6 rơi vào ô ' + c('(0.025, 0.05]') + ', ô đó chứa 2 quan sát, nên đáp số là 0,025 + 0,025 × (3 − 2) / 2 = 0,0375. Đây không phải lỗi và cũng không phải sai số làm tròn: ô càng rộng so với chỗ dữ liệu thật sự nằm thì đáp số càng sai, và sai số đó IM LẶNG',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The interpolation assumes samples are spread evenly inside a bucket. Real latency is not spread evenly — it is clumped, usually at one end — so the error scales with how coarse your boundaries are relative to your distribution. The remedy is to measure first and choose buckets second: log the duration for a day, compute the real percentiles once with one expensive query, then place a narrow bucket AROUND each of them rather than a wide one containing it. Note also the mean in the same block: 470.8 ms, a number no request came anywhere near.',
            'Phép nội suy giả định các mẫu trải đều bên trong một cái ô. Độ trễ thật thì không trải đều — nó vón cục, thường vón về một đầu — nên sai số tỉ lệ với chuyện các ranh giới của bạn thô tới đâu so với phân bố của bạn. Cách chữa là ĐO trước rồi mới CHỌN ô: ghi log thời lượng trong một ngày, tính các phân vị thật đúng một lần bằng một truy vấn đắt, rồi đặt một cái ô HẸP QUANH từng cái thay vì một cái ô rộng CHỨA nó. Cũng để ý con số trung bình trong cùng khối ấy: 470,8 ms, một con số mà không request nào đến gần.',
          ),
        }),

        mcq({
          prompt: B(
            'You replace your latency histogram\'s buckets with a set derived from a day of real request logs, and deploy. The p99 graph does not break — it BENDS at the deploy, and the bend looks exactly like a latency regression caused by whatever else shipped that day. What happened?',
            'Bạn thay bộ ô của histogram độ trễ bằng một bộ suy ra từ một ngày log request thật, rồi deploy. Đồ thị p99 không vỡ — nó BẺ CONG ngay tại lần deploy, và chỗ bẻ ấy trông y hệt một cú thoái lui hiệu năng do bất cứ thứ gì khác lên cùng ngày hôm đó gây ra. Chuyện gì đã xảy ra?',
          ),
          options: [
            B(
              'The new buckets are denser, so each one holds fewer observations and the quantile estimate becomes noisier; the bend is sampling noise and it settles once enough data accumulates in the new boundaries, which on this traffic takes roughly a scrape interval times the number of new boundaries',
              'Bộ ô mới dày hơn nên mỗi ô chứa ít quan sát hơn và ước lượng phân vị nhiễu hơn; chỗ bẻ đó là nhiễu lấy mẫu và nó ổn định lại khi đủ dữ liệu tích trong các ranh giới mới, mà với lưu lượng này thì mất cỡ một khoảng lấy mẫu nhân với số ranh giới mới',
            ),
            B(
              'Prometheus rejected the new series because a histogram\'s bucket set is part of its type declaration and cannot change; the graph is drawing the last known good values forward, which is why it bends rather than breaking, and the rejection is visible in the target\'s scrape error counter',
              'Prometheus từ chối các chuỗi mới vì bộ ô của một histogram là một phần khai báo kiểu của nó và không đổi được; đồ thị đang kéo dài các giá trị tốt cuối cùng biết được, nên nó bẻ cong chứ không vỡ, và phần bị từ chối nhìn thấy được ở bộ đếm lỗi lấy mẫu của mục tiêu',
            ),
            B(
              'The bucket boundaries are part of the metric\'s IDENTITY: <code>le="0.025"</code> is a different time series from <code>le="0.03"</code>. On deploy the old series stop receiving data and the new ones start from zero, so a query spanning the deploy computes from whichever boundaries exist in each part of the window and returns a number for both halves. Change buckets deliberately, write the date next to wherever your alert thresholds are defined, and do not trust a percentile graph across that boundary',
              'Các ranh giới ô là một phần DANH TÍNH của chỉ số: <code>le="0.025"</code> là một chuỗi thời gian KHÁC với <code>le="0.03"</code>. Khi deploy, các chuỗi cũ ngừng nhận dữ liệu còn các chuỗi mới bắt đầu từ 0, nên một truy vấn vắt qua lần deploy sẽ tính theo bộ ranh giới nào tồn tại ở từng nửa cửa sổ, và trả về một con số cho cả hai nửa. Hãy đổi ô một cách có chủ ý, ghi ngày tháng ngay cạnh chỗ định nghĩa các ngưỡng cảnh báo, và đừng tin một đồ thị phân vị vắt qua cái ranh giới đó',
            ),
            B(
              'The derived buckets have a lower top boundary than the defaults, so observations that used to land in a finite bucket now land in <code>+Inf</code> and the quantile is clamped; raising the top boundary back to 10 removes the bend entirely, and the tell is that the bend is flat rather than sloped',
              'Bộ ô suy ra có ranh giới trên thấp hơn bộ mặc định, nên những quan sát trước kia rơi vào một ô hữu hạn giờ rơi vào <code>+Inf</code> và phân vị bị kẹp lại; nâng ranh giới trên về lại 10 là hết bẻ, và dấu hiệu nhận ra là chỗ bẻ ấy PHẲNG chứ không dốc',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is how a deliberate improvement gets misdiagnosed as a regression. Changing buckets is usually the right thing to do — the default set can be 69% wrong on an ordinary bimodal latency distribution — but it is a change to the metric\'s identity and therefore to every historical comparison built on it. The graph does not error, it just quietly answers a slightly different question on each side of the line.',
            'Đây là cách một cải tiến có chủ ý bị chẩn nhầm thành một cú thoái lui. Đổi ô thường là việc nên làm — bộ mặc định có thể sai tới 69% trên một phân bố độ trễ hai đỉnh bình thường — nhưng nó là một thay đổi ở DANH TÍNH của chỉ số, và do đó thay đổi mọi phép so sánh lịch sử dựng trên nó. Đồ thị không báo lỗi, nó chỉ lặng lẽ trả lời một câu hỏi hơi khác nhau ở hai bên cái vạch.',
          ),
        }),

        mcq({
          prompt: B(
            'You have <code>http_request_duration_seconds{method,route}</code> with 16 bucket boundaries, and the label values are bounded at 8 methods × 28 routes. Someone asks to add a <code>code</code> label with about 10 values so the dashboard can split latency by status. How many series does the histogram go from, and to?',
            'Bạn có <code>http_request_duration_seconds{method,route}</code> với 16 ranh giới ô, và các giá trị nhãn có chặn ở 8 method × 28 route. Có người xin thêm một nhãn <code>code</code> khoảng 10 giá trị để bảng theo dõi tách được độ trễ theo mã trạng thái. Histogram đi từ bao nhiêu chuỗi lên bao nhiêu chuỗi?',
          ),
          options: [
            B(
              'From 224 to 234. A label ADDS one series per distinct value it takes, so ten values means ten more series and the bucket boundaries are shared across every label combination rather than repeated',
              'Từ 224 lên 234. Một cái nhãn THÊM một chuỗi cho mỗi giá trị riêng biệt nó nhận, nên mười giá trị nghĩa là thêm mười chuỗi, và các ranh giới ô được dùng chung cho mọi tổ hợp nhãn chứ không lặp lại',
            ),
            B(
              'From 224 to 2,240. The histogram\'s buckets are stored once per metric name, so only the label combinations multiply and the sixteen boundaries do not enter the arithmetic at all',
              'Từ 224 lên 2.240. Các ô của histogram được lưu một lần cho mỗi tên chỉ số, nên chỉ có tổ hợp nhãn nhân lên và mười sáu cái ranh giới không tham gia vào phép tính',
            ),
            B(
              'From 3,584 to 35,840. Only the bucket series multiply, since <code>_sum</code> and <code>_count</code> are aggregates computed at query time rather than separate series stored per label combination',
              'Từ 3.584 lên 35.840. Chỉ các chuỗi ô nhân lên, vì <code>_sum</code> và <code>_count</code> là các giá trị gộp được tính lúc truy vấn chứ không phải chuỗi riêng lưu theo từng tổ hợp nhãn',
            ),
            B(
              'From 4,256 to 42,560. A histogram emits 16 boundaries plus <code>+Inf</code> plus <code>_sum</code> plus <code>_count</code> = 19 series per label combination, and 8 × 28 = 224 combinations gives 4,256. Adding a third label MULTIPLIES: 224 × 10 = 2,240 combinations × 19 = 42,560. The count is a PRODUCT — a label never adds, it always multiplies, which is why this fails so spectacularly',
              'Từ 4.256 lên 42.560. Một histogram phát ra 16 ranh giới cộng <code>+Inf</code> cộng <code>_sum</code> cộng <code>_count</code> = 19 chuỗi cho mỗi tổ hợp nhãn, và 8 × 28 = 224 tổ hợp cho ra 4.256. Thêm một nhãn thứ ba là NHÂN LÊN: 224 × 10 = 2.240 tổ hợp × 19 = 42.560. Số chuỗi là một TÍCH — một cái nhãn không bao giờ cộng vào, nó luôn nhân vào, và đó là lý do chuyện này hỏng ngoạn mục đến thế',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Ten times more series for one extra label, and this is the well-behaved case where every label is genuinely bounded. Before adding any label, answer out loud: "what is the maximum number of distinct values this can EVER have, and what makes that a maximum?" Method is 8 by the HTTP spec, code is about 40 by the HTTP spec, route is bounded by the number of route declarations. If the answer contains "it depends" or "however many users we have", it is not a label — it is a log field.',
            'Gấp mười lần số chuỗi cho đúng một cái nhãn thêm vào, và đây còn là trường hợp NGOAN, nơi mọi nhãn đều thật sự có chặn. Trước khi thêm bất kỳ cái nhãn nào, hãy nói thành lời: "cái này có thể nhận TỐI ĐA bao nhiêu giá trị riêng biệt, và cái gì làm cho đó là tối đa?" Method là 8 theo đặc tả HTTP, code là khoảng 40 theo đặc tả HTTP, route bị chặn bởi số khai báo route. Nếu câu trả lời có chữ "còn tuỳ" hay "bao nhiêu người dùng thì bấy nhiêu" thì nó không phải một cái nhãn — nó là một trường log.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague adds <code>errors_total{message}</code> so the dashboard can show which errors are most common. It looks like the single most useful label anyone has added. Why does it detonate?',
            'Một đồng nghiệp thêm <code>errors_total{message}</code> để bảng theo dõi hiện được lỗi nào hay gặp nhất. Nó trông như cái nhãn hữu ích nhất từ trước tới nay. Vì sao nó nổ tung?',
          ),
          options: [
            B(
              'Because error messages are long, and Prometheus stores the full label value in every chunk; the memory cost is proportional to string length rather than to the number of distinct values, so a few hundred verbose messages already exceed the VPS',
              'Vì thông điệp lỗi dài, mà Prometheus lưu nguyên giá trị nhãn trong từng khối; chi phí bộ nhớ tỉ lệ với ĐỘ DÀI chuỗi chứ không phải số giá trị riêng biệt, nên chỉ vài trăm thông điệp dài dòng là đã vượt quá VPS',
            ),
            B(
              'Because real error messages carry INTERPOLATED data — ' + c('connect ETIMEDOUT 10.0.0.5:5432') + ', ' + c("Cannot read property 'x' of undefined at line 42") + ', ' + c('Invalid note id abc123') + ' — so every distinct id, IP, port and filename becomes a permanent series. The metric grows fastest exactly when the system is failing most, which means the moment you most need Prometheus alive is the moment your error metric is killing it. Label with a bounded error CLASS you assign yourself and keep the message in the log line',
              'Vì thông điệp lỗi thật mang dữ liệu NỘI SUY — ' + c('connect ETIMEDOUT 10.0.0.5:5432') + ', ' + c("Cannot read property 'x' of undefined at line 42") + ', ' + c('Invalid note id abc123') + ' — nên mỗi id, mỗi IP, mỗi cổng, mỗi tên file riêng biệt đều thành một chuỗi vĩnh viễn. Chỉ số ấy phình NHANH NHẤT đúng vào lúc hệ thống hỏng NẶNG NHẤT, tức là khoảnh khắc bạn cần Prometheus sống nhất lại chính là khoảnh khắc cái chỉ số lỗi của bạn đang giết nó. Hãy gắn nhãn bằng một LỚP lỗi có chặn do chính bạn đặt tên, và giữ thông điệp ở trong dòng log',
            ),
            B(
              'Because a counter labelled by message cannot be summed: two series with different messages describe different events, so <code>sum(rate(errors_total[5m]))</code> silently double-counts every error that was retried and reported under two messages',
              'Vì một counter gắn nhãn theo thông điệp thì không cộng được: hai chuỗi có thông điệp khác nhau mô tả hai sự kiện khác nhau, nên <code>sum(rate(errors_total[5m]))</code> âm thầm đếm gấp đôi mọi lỗi đã được thử lại và báo cáo dưới hai thông điệp',
            ),
            B(
              'Because the message often contains characters that are invalid in a Prometheus label value, so prom-client escapes them and the escaped forms collide — two different messages can produce the same label and the counts merge in a way nothing reports',
              'Vì thông điệp thường chứa các ký tự không hợp lệ trong một giá trị nhãn của Prometheus, nên prom-client thoát chúng và các dạng đã thoát va vào nhau — hai thông điệp khác nhau có thể ra cùng một nhãn và các số đếm gộp lại theo cách chẳng có gì báo cho bạn biết',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the highest-cardinality label there is and it looks like the most useful one, which is why it survives review. The failure is not graceful either: memory climbs, the <code>/metrics</code> response grows to millions of lines, scrapes slow, then scrapes TIME OUT — and now every other metric has gaps too, including the ones that were fine. Then Prometheus is OOM-killed, restarts, replays the WAL and is killed again, for hours. Bounded classes — <code>kind="db_timeout"</code>, <code>kind="validation"</code>, <code>kind="upstream_5xx"</code> — give you the same dashboard for a handful of series.',
            'Đây là cái nhãn có lực lượng lớn nhất có thể có và nó trông như cái hữu ích nhất, nên nó qua được vòng rà soát. Cú hỏng cũng chẳng nhẹ nhàng: bộ nhớ leo lên, phản hồi <code>/metrics</code> phình tới hàng triệu dòng, các lượt lấy mẫu chậm dần, rồi các lượt lấy mẫu HẾT GIỜ — và bây giờ mọi chỉ số khác cũng thủng lỗ, kể cả những cái vốn vẫn ổn. Sau đó Prometheus bị giết vì hết bộ nhớ, khởi động lại, phát lại WAL rồi lại bị giết, hàng giờ liền. Những lớp có chặn — <code>kind="db_timeout"</code>, <code>kind="validation"</code>, <code>kind="upstream_5xx"</code> — cho bạn đúng cái bảng theo dõi ấy với vỏn vẹn vài chuỗi.',
          ),
        }),

        mcq({
          prompt: B(
            'You expose <code>/metrics</code> and it is reachable from the public internet with no authentication. Name the two costs, and how you verify the fix.',
            'Bạn phơi <code>/metrics</code> và nó truy cập được từ internet công cộng, không cần xác thực. Hãy nêu hai cái giá phải trả, và cách bạn kiểm chứng rằng đã sửa xong.',
          ),
          options: [
            B(
              'The only cost is a small amount of bandwidth, and the fix is verified by checking the nginx configuration file for the <code>deny all</code> directive in the <code>location = /metrics</code> block; the series themselves carry no secrets, since every value is a count or a byte figure rather than a user-supplied string',
              'Cái giá duy nhất là một chút băng thông, và cách kiểm chứng là xem trong file cấu hình nginx có chỉ thị <code>deny all</code> trong khối <code>location = /metrics</code> hay chưa; bản thân các chuỗi không mang bí mật nào, vì mọi giá trị đều là một con số đếm hay một số byte chứ không phải chuỗi do người dùng nhập vào',
            ),
            B(
              'The costs are that Prometheus itself can be scraped by a competitor and that the scrape interval becomes unpredictable; the fix is verified by watching <code>up{job=&quot;backend&quot;}</code> stay at 1 for an hour, which proves your own scraper still reaches the target while nobody else does',
              'Cái giá là Prometheus của bạn có thể bị đối thủ lấy mẫu và khoảng lấy mẫu trở nên khó đoán; cách kiểm chứng là theo dõi <code>up{job=&quot;backend&quot;}</code> giữ nguyên giá trị 1 trong một giờ, thứ chứng minh bộ lấy mẫu của chính bạn vẫn tới được mục tiêu trong khi không ai khác tới được',
            ),
            B(
              'The costs are that custom business counters are commercially sensitive and that the endpoint bypasses your rate limiter; the fix is to move the endpoint to a random path that scanners will not guess and to add it to the morgan skip list so the access log stops recording the scrape every fifteen seconds',
              'Cái giá là các counter nghiệp vụ tự đặt mang tính nhạy cảm thương mại và endpoint ấy đi vòng qua bộ giới hạn tần suất; cách sửa là chuyển endpoint sang một đường dẫn ngẫu nhiên mà máy quét không đoán ra, và thêm nó vào danh sách bỏ qua của morgan để access log thôi ghi lại lượt lấy mẫu mười lăm giây một lần',
            ),
            B(
              'It is an INVENTORY of your system — every route name, every dependency host you call, your process memory, uptime, app version and Node version, plus growth figures like <code>notes_created_total</code> and <code>logins_total</code>, refreshed every fifteen seconds — and it is a cheap denial-of-service target, because one request serialises thousands of series. Bind it to the internal network or require auth, then verify from OUTSIDE: ' + c('curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/metrics') + ' must not return 200',
              'Nó là một BẢN KIỂM KÊ hệ thống của bạn — mọi tên route, mọi máy chủ phụ thuộc bạn gọi tới, bộ nhớ tiến trình, thời gian chạy, phiên bản ứng dụng và phiên bản Node, cộng thêm các con số tăng trưởng như <code>notes_created_total</code> và <code>logins_total</code>, làm mới mỗi mười lăm giây — và nó là một mục tiêu từ-chối-dịch-vụ rẻ tiền, vì một request thôi cũng phải tuần tự hoá hàng nghìn chuỗi. Hãy buộc nó vào mạng nội bộ hoặc bắt xác thực, rồi kiểm chứng TỪ BÊN NGOÀI: ' + c('curl -s -o /dev/null -w "%{http_code}" https://cuongthai.com/metrics') + ' không được trả về 200',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A single unauthenticated GET saves an attacker the entire enumeration step, and custom business metrics make it worse rather than better. Note the verification habit, which is the same one the deploy smoke test uses: configuration says what SHOULD happen, and only a request from outside says what DOES. Option C is half right about the sensitivity and completely wrong about the fix — an obscure path is not access control, and a scanner enumerating <code>/metrics</code> is one of the first things it tries.',
            'Một lời gọi GET không cần xác thực là đã tiết cho kẻ tấn công toàn bộ bước liệt kê, và các chỉ số nghiệp vụ tự đặt làm chuyện đó tệ hơn chứ không đỡ hơn. Hãy để ý thói quen kiểm chứng, cũng đúng là thói quen mà phép kiểm khói lúc deploy dùng: cấu hình nói điều LẼ RA xảy ra, và chỉ một request từ bên ngoài mới nói điều ĐANG xảy ra. Lựa chọn C đúng một nửa về mức nhạy cảm và sai hoàn toàn về cách sửa — một đường dẫn khó đoán không phải là kiểm soát truy cập, và một máy quét dò <code>/metrics</code> thì đó là một trong những thứ đầu tiên nó thử.',
          ),
        }),

        mcq({
          prompt: B(
            'A queue is 100% utilised. Choose the TWO statements that are correct about what that does and does not tell you. (choose TWO)',
            'Một hàng đợi đang được dùng ở mức 100%. Chọn HAI phát biểu đúng về điều đó nói lên gì và KHÔNG nói lên gì. (chọn HAI)',
          ),
          options: [
            B(
              'A resource that is 100% utilised may be working perfectly — utilisation alone cannot distinguish "fully used" from "everyone is queueing", which is why the USE method carries a separate SATURATION term for how much work is waiting',
              'Một tài nguyên dùng tới 100% vẫn có thể đang chạy hoàn hảo — riêng mức sử dụng không phân biệt được "dùng hết công suất" với "ai cũng đang xếp hàng", và đó là lý do phương pháp USE mang một số hạng BÃO HOÀ riêng cho lượng việc đang chờ',
            ),
            B(
              'Saturation is the only one of the four golden signals that PREDICTS rather than reports: latency, traffic and errors all tell you something is already wrong, while saturation tells you the system is running out of room',
              'Bão hoà là cái duy nhất trong bốn tín hiệu vàng có tính DỰ BÁO chứ không phải tường thuật: độ trễ, lưu lượng và lỗi đều nói với bạn rằng có thứ đã hỏng rồi, còn bão hoà nói rằng hệ thống sắp hết chỗ',
            ),
            B(
              'Utilisation at 100% is by definition a saturation event, so the two terms measure the same thing at different scales and a dashboard needs only one of them',
              'Mức sử dụng 100% theo định nghĩa chính là một sự kiện bão hoà, nên hai số hạng ấy đo cùng một thứ ở hai thang khác nhau và một bảng theo dõi chỉ cần một trong hai',
            ),
            B(
              'For a Node process the right utilisation number is CPU percentage, and the right saturation number is memory, because those are the two resources a single-threaded runtime can exhaust',
              'Với một tiến trình Node thì con số sử dụng đúng là phần trăm CPU, còn con số bão hoà đúng là bộ nhớ, vì đó là hai tài nguyên mà một runtime đơn luồng có thể làm cạn kiệt',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'RED is for anything that SERVES requests — rate, errors, duration. USE is for anything that is a RESOURCE — utilisation, saturation, errors — and the separate saturation term exists precisely because of the queue case in the prompt. Option D gets the Node answer backwards: CPU percentage is exactly the wrong saturation signal for a single-threaded runtime, because one fully blocked thread out of four cores reads as a quarter busy. Event-loop lag is the metric that means what CPU% is supposed to mean.',
            'RED dành cho bất cứ thứ gì PHỤC VỤ request — tốc độ, lỗi, thời lượng. USE dành cho bất cứ thứ gì là một TÀI NGUYÊN — mức sử dụng, bão hoà, lỗi — và cái số hạng bão hoà riêng ra đời chính vì trường hợp hàng đợi trong đề bài. Lựa chọn D nói ngược về Node: phần trăm CPU đúng là tín hiệu bão hoà SAI cho một runtime đơn luồng, vì một luồng bị chặn hoàn toàn trên bốn nhân đọc ra chỉ là một phần tư bận. Độ trễ vòng lặp sự kiện mới là chỉ số mang đúng cái nghĩa mà phần trăm CPU lẽ ra phải mang.',
          ),
        }),
        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Read the pipeline back (chapters 1 and 2).</b> <code>RAW</code> holds eight lines exactly as Docker\'s json-file driver writes them into ' + c('<id>-json.log') + ': one JSON envelope per line with the fields <code>log</code>, <code>stream</code> and <code>time</code>, where <code>log</code> is your application\'s own line with a trailing newline. Implement <code>phanTich(raw)</code>.</p>' +
            '<ul>' +
            '<li>Unwrap each envelope, strip the trailing newline from <code>log</code>, and try to parse the result as JSON.</li>' +
            '<li>A line counts under a level only when it parses AND its <code>level</code> is one of <code>info</code>, <code>warn</code>, <code>error</code>. Everything else — a startup banner, a blank line, a JSON object with no level — goes into <code>chuaDoc</code> as <code>{ stream, line }</code>, in order. <b>Do not drop it.</b> A pipeline that discards what it cannot parse is the ' + c('parse_json!') + ' trap from lesson 2.3, and the lines it eats are the stack traces.</li>' +
            '<li><code>rawBytes</code> is the total size of the application lines <b>including one byte for the newline</b>; <code>envelopeBytes</code> is the total size of the envelope lines, also plus one byte each. <code>heSoPhinh</code> is <code>envelopeBytes / rawBytes</code> rounded to two decimals.</li>' +
            '<li><code>errorRequestIds</code> lists the <code>requestId</code> of every error line, in order; use <code>null</code> when the field is absent.</li>' +
            '</ul>' +
            '<p>One trap is deliberate. Docker\'s <code>stream</code> field records which file descriptor a line came from, not how bad it is — plenty of well-behaved programs write ordinary progress to stderr. <b>Classify by your own <code>level</code> field, never by <code>stream</code>.</b></p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not require anything outside Node\'s built-in modules.</p>',

            '<p><b>Câu 31 — Đọc ngược đường ống log (chương 1 và 2).</b> <code>RAW</code> chứa tám dòng đúng như trình ghi json-file của Docker viết vào ' + c('<id>-json.log') + ': mỗi dòng một phong bì JSON với các trường <code>log</code>, <code>stream</code> và <code>time</code>, trong đó <code>log</code> là dòng của chính ứng dụng bạn kèm một ký tự xuống dòng ở cuối. Hãy cài đặt <code>phanTich(raw)</code>.</p>' +
            '<ul>' +
            '<li>Bóc từng phong bì, cắt ký tự xuống dòng ở cuối <code>log</code>, rồi thử phân giải phần còn lại thành JSON.</li>' +
            '<li>Một dòng chỉ được tính vào một mức khi nó phân giải được VÀ <code>level</code> của nó là một trong <code>info</code>, <code>warn</code>, <code>error</code>. Mọi thứ khác — một dòng chào của thư viện, một dòng trắng, một object JSON không có level — đi vào <code>chuaDoc</code> dưới dạng <code>{ stream, line }</code>, đúng thứ tự. <b>Không được vứt.</b> Một đường ống vứt đi thứ nó không phân giải nổi chính là cái bẫy ' + c('parse_json!') + ' của bài 2.3, và những dòng nó nuốt là các vết ngăn xếp.</li>' +
            '<li><code>rawBytes</code> là tổng kích thước các dòng ứng dụng <b>tính cả một byte cho ký tự xuống dòng</b>; <code>envelopeBytes</code> là tổng kích thước các dòng phong bì, cũng cộng một byte mỗi dòng. <code>heSoPhinh</code> là <code>envelopeBytes / rawBytes</code> làm tròn hai chữ số thập phân.</li>' +
            '<li><code>errorRequestIds</code> liệt kê <code>requestId</code> của mọi dòng mức error, đúng thứ tự; dùng <code>null</code> khi thiếu trường đó.</li>' +
            '</ul>' +
            '<p>Có một cái bẫy cố ý. Trường <code>stream</code> của Docker ghi lại dòng ấy đến từ bộ mô tả file nào, chứ không phải nó nghiêm trọng tới đâu — rất nhiều chương trình đàng hoàng vẫn ghi tiến độ bình thường ra stderr. <b>Hãy phân loại theo trường <code>level</code> của chính bạn, đừng bao giờ theo <code>stream</code>.</b></p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không dùng gì ngoài các module có sẵn của Node.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const boc = (app, stream, time) =>\n' +
            '  JSON.stringify({ log: app + \'\\n\', stream, time });\n' +
            '\n' +
            'const RAW = [\n' +
            '  boc(\'{"ts":"2026-09-10T02:00:00.000Z","level":"info","msg":"request completed","route":"/api/v1/notes","ms":42,"requestId":"r_aaa"}\', \'stdout\', \'2026-09-10T02:00:00.100000000Z\'),\n' +
            '  boc(\'{"ts":"2026-09-10T02:00:00.500Z","level":"error","msg":"upstream failed","route":"/api/v1/notes","ms":30002,"requestId":"r_bbb"}\', \'stderr\', \'2026-09-10T02:00:00.600000000Z\'),\n' +
            '  boc(\'Prisma schema loaded from prisma/schema.prisma\', \'stderr\', \'2026-09-10T02:00:01.000000000Z\'),\n' +
            '  boc(\'{"ts":"2026-09-10T02:00:01.200Z","level":"warn","msg":"gateway fell back","model":"claude-sonnet-5","requestId":"r_ccc"}\', \'stdout\', \'2026-09-10T02:00:01.300000000Z\'),\n' +
            '  boc(\'{"level":"info","msg":"ok"}\', \'stdout\', \'2026-09-10T02:00:01.400000000Z\'),\n' +
            '  boc(\'{"ts":"2026-09-10T02:00:02.000Z","level":"error","msg":"Express error handler","requestId":"r_ddd"}\', \'stdout\', \'2026-09-10T02:00:02.100000000Z\'),\n' +
            '  boc(\'  \', \'stdout\', \'2026-09-10T02:00:02.200000000Z\'),\n' +
            '  boc(\'{"ts":"2026-09-10T02:00:03.000Z","msg":"no level here","requestId":"r_eee"}\', \'stdout\', \'2026-09-10T02:00:03.100000000Z\'),\n' +
            '];\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '  // TODO\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const r = phanTich(RAW);\n' +
            'console.log(\'total=\' + r.total);\n' +
            'console.log(\'info=\' + r.byLevel.info + \' warn=\' + r.byLevel.warn + \' error=\' + r.byLevel.error);\n' +
            'console.log(\'chuaDoc=\' + r.chuaDoc.length);\n' +
            'for (const u of r.chuaDoc) console.log(\'  [\' + u.stream + \'] \' + JSON.stringify(u.line));\n' +
            'console.log(\'rawBytes=\' + r.rawBytes + \' envelopeBytes=\' + r.envelopeBytes + \' heSoPhinh=\' + r.heSoPhinh);\n' +
            'console.log(\'errorRequestIds=\' + JSON.stringify(r.errorRequestIds));\n',
          expectedOutput:
            'total=8\n' +
            'info=2 warn=1 error=2\n' +
            'chuaDoc=3\n' +
            '  [stderr] "Prisma schema loaded from prisma/schema.prisma"\n' +
            '  [stdout] "  "\n' +
            '  [stdout] "{\\"ts\\":\\"2026-09-10T02:00:03.000Z\\",\\"msg\\":\\"no level here\\",\\"requestId\\":\\"r_eee\\"}"\n' +
            'rawBytes=631 envelopeBytes=1291 heSoPhinh=2.05\n' +
            'errorRequestIds=["r_bbb","r_ddd"]\n',
          sampleSolution:
            'function phanTich(raw) {\n' +
            '  const byLevel = { info: 0, warn: 0, error: 0 };\n' +
            '  const chuaDoc = [];\n' +
            '  const errorRequestIds = [];\n' +
            '  let rawBytes = 0, envelopeBytes = 0;\n' +
            '\n' +
            '  for (const line of raw) {\n' +
            '    envelopeBytes += Buffer.byteLength(line) + 1;\n' +
            '    const env = JSON.parse(line);\n' +
            '    const app = env.log.endsWith(\'\\n\') ? env.log.slice(0, -1) : env.log;\n' +
            '    rawBytes += Buffer.byteLength(app) + 1;\n' +
            '\n' +
            '    let obj = null;\n' +
            '    try { obj = JSON.parse(app); } catch { obj = null; }\n' +
            '    const level = obj && typeof obj === \'object\' && typeof obj.level === \'string\' ? obj.level : null;\n' +
            '    if (level && Object.prototype.hasOwnProperty.call(byLevel, level)) {\n' +
            '      byLevel[level]++;\n' +
            '      if (level === \'error\') errorRequestIds.push(obj.requestId ?? null);\n' +
            '    } else {\n' +
            '      chuaDoc.push({ stream: env.stream, line: app });\n' +
            '    }\n' +
            '  }\n' +
            '  return {\n' +
            '    total: raw.length,\n' +
            '    byLevel,\n' +
            '    chuaDoc,\n' +
            '    rawBytes,\n' +
            '    envelopeBytes,\n' +
            '    heSoPhinh: Math.round((envelopeBytes / rawBytes) * 100) / 100,\n' +
            '    errorRequestIds,\n' +
            '  };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — A percentile out of a text block (chapter 4).</b> <code>METRICS</code> is a real Prometheus exposition body. Implement two functions.</p>' +
            '<p><code>docHistogram(text, ten)</code> — parse every ' + c('<ten>_bucket') + ', ' + c('<ten>_sum') + ' and ' + c('<ten>_count') + ' line, ignore comments and any other metric, and group the series by their label set <b>excluding <code>le</code></b>. Sort each bucket list by boundary, with <code>le="+Inf"</code> becoming <code>Infinity</code>.</p>' +
            '<p><code>phanVi(h, q)</code> — compute the quantile the way Prometheus does. The bucket values are CUMULATIVE.</p>' +
            '<ul>' +
            '<li>Let <code>rank = q × (the +Inf count)</code>, and find the first bucket whose cumulative count reaches it.</li>' +
            '<li>If that bucket is <code>+Inf</code>, <b>return the largest FINITE boundary</b>. This is the case that matters: every observation was above your top bucket, and the answer that comes back is a perfectly plausible number with nothing on the dashboard to say it is a floor rather than a measurement.</li>' +
            '<li>Otherwise interpolate linearly between the previous boundary and this one — and when the selected bucket is the FIRST one, the lower edge is <b>0</b>, not the first boundary.</li>' +
            '<li>Return <code>NaN</code> when there is nothing to interpolate: no observations at all, or an empty selected bucket.</li>' +
            '</ul>' +
            '<p>Every expected value below was produced by querying a real Prometheus v3.5.0 over the same numbers, so your output has to match a running Prometheus rather than a description of one. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Rút một phân vị ra từ một khối văn bản (chương 4).</b> <code>METRICS</code> là phần thân phơi chỉ số thật của Prometheus. Hãy cài đặt hai hàm.</p>' +
            '<p><code>docHistogram(text, ten)</code> — phân giải mọi dòng ' + c('<ten>_bucket') + ', ' + c('<ten>_sum') + ' và ' + c('<ten>_count') + ', bỏ qua các dòng chú thích và mọi chỉ số khác, rồi gom các chuỗi theo tập nhãn của chúng <b>trừ nhãn <code>le</code></b>. Sắp mỗi danh sách ô theo ranh giới, với <code>le="+Inf"</code> thành <code>Infinity</code>.</p>' +
            '<p><code>phanVi(h, q)</code> — tính phân vị đúng theo cách Prometheus làm. Giá trị các ô là CỘNG DỒN.</p>' +
            '<ul>' +
            '<li>Đặt <code>rank = q × (số đếm ở ô +Inf)</code>, rồi tìm cái ô ĐẦU TIÊN có số cộng dồn chạm tới nó.</li>' +
            '<li>Nếu cái ô đó là <code>+Inf</code> thì <b>trả về ranh giới HỮU HẠN lớn nhất</b>. Đây mới là ca đáng nói: mọi quan sát đều nằm trên cái ô trên cùng của bạn, và con số trả về là một con số hoàn toàn hợp lý mà chẳng có gì trên bảng theo dõi nói cho bạn biết đó là một cái SÀN chứ không phải một phép đo.</li>' +
            '<li>Ngược lại thì nội suy tuyến tính giữa ranh giới trước đó và ranh giới này — và khi cái ô được chọn là ô ĐẦU TIÊN thì mép dưới là <b>0</b>, không phải cái ranh giới đầu tiên.</li>' +
            '<li>Trả về <code>NaN</code> khi không có gì để nội suy: không có quan sát nào, hoặc cái ô được chọn rỗng.</li>' +
            '</ul>' +
            '<p>Mọi giá trị mong đợi dưới đây đều được tạo ra bằng cách hỏi một Prometheus v3.5.0 thật trên đúng những con số ấy, nên output của bạn phải khớp với một Prometheus ĐANG CHẠY chứ không phải với một lời mô tả về nó. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const METRICS = [\n' +
            '  \'# HELP http_request_duration_seconds HTTP request duration\',\n' +
            '  \'# TYPE http_request_duration_seconds histogram\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.01",route="/a"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.025",route="/a"} 2\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.05",route="/a"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.1",route="/a"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.5",route="/a"} 5\',\n' +
            '  \'http_request_duration_seconds_bucket{le="1",route="/a"} 5\',\n' +
            '  \'http_request_duration_seconds_bucket{le="+Inf",route="/a"} 6\',\n' +
            '  \'http_request_duration_seconds_sum{route="/a"} 2.825\',\n' +
            '  \'http_request_duration_seconds_count{route="/a"} 6\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.01",route="/b"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.025",route="/b"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.05",route="/b"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.1",route="/b"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.5",route="/b"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="1",route="/b"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="+Inf",route="/b"} 5\',\n' +
            '  \'http_request_duration_seconds_sum{route="/b"} 254\',\n' +
            '  \'http_request_duration_seconds_count{route="/b"} 5\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.01",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.025",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.05",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.1",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.5",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="1",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="+Inf",route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_sum{route="/c"} 0.01\',\n' +
            '  \'http_request_duration_seconds_count{route="/c"} 4\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.01",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.025",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.05",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.1",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="0.5",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="1",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_bucket{le="+Inf",route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_sum{route="/d"} 0\',\n' +
            '  \'http_request_duration_seconds_count{route="/d"} 0\',\n' +
            '  \'# HELP http_requests_total HTTP requests handled\',\n' +
            '  \'# TYPE http_requests_total counter\',\n' +
            '  \'http_requests_total{route="/a",code="200"} 6\',\n' +
            '].join(\'\\n\');\n' +
            '\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            '\n' +
            '  // TODO\n' +
            '\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ms = (v) => (Number.isNaN(v) ? \'NaN\' : (v * 1000).toFixed(1) + \'ms\');\n' +
            'const hs = docHistogram(METRICS, \'http_request_duration_seconds\');\n' +
            'console.log(\'series=\' + hs.size);\n' +
            'for (const [key, h] of [...hs.entries()].sort()) {\n' +
            '  const tb = h.count > 0 ? ms(h.sum / h.count) : \'NaN\';\n' +
            '  console.log(key + \'  n=\' + h.count +\n' +
            '    \'  p50=\' + ms(phanVi(h, 0.5)) +\n' +
            '    \'  p90=\' + ms(phanVi(h, 0.9)) +\n' +
            '    \'  p99=\' + ms(phanVi(h, 0.99)) +\n' +
            '    \'  mean=\' + tb);\n' +
            '}\n',
          expectedOutput:
            'series=4\n' +
            'route=/a  n=6  p50=37.5ms  p90=1000.0ms  p99=1000.0ms  mean=470.8ms\n' +
            'route=/b  n=5  p50=1000.0ms  p90=1000.0ms  p99=1000.0ms  mean=50800.0ms\n' +
            'route=/c  n=4  p50=5.0ms  p90=9.0ms  p99=9.9ms  mean=2.5ms\n' +
            'route=/d  n=0  p50=NaN  p90=NaN  p99=NaN  mean=NaN\n',
          sampleSolution:
            'function docHistogram(text, ten) {\n' +
            '  const out = new Map();\n' +
            '  const re = new RegExp(\'^\' + ten + \'_(bucket|sum|count)\\\\{([^}]*)\\\\}\\\\s+(\\\\S+)$\');\n' +
            '  for (const line of text.split(\'\\n\')) {\n' +
            '    if (!line || line.startsWith(\'#\')) continue;\n' +
            '    const m = re.exec(line.trim());\n' +
            '    if (!m) continue;\n' +
            '    const [, kind, labelText, rawValue] = m;\n' +
            '    const labels = {};\n' +
            '    for (const p of labelText.split(\',\')) {\n' +
            '      const i = p.indexOf(\'=\');\n' +
            '      labels[p.slice(0, i)] = p.slice(i + 1).replace(/^"|"$/g, \'\');\n' +
            '    }\n' +
            '    const le = labels.le;\n' +
            '    delete labels.le;\n' +
            '    const key = Object.keys(labels).sort().map((k) => k + \'=\' + labels[k]).join(\',\');\n' +
            '    if (!out.has(key)) out.set(key, { labels, buckets: [], sum: 0, count: 0 });\n' +
            '    const h = out.get(key);\n' +
            '    const value = Number(rawValue);\n' +
            '    if (kind === \'bucket\') h.buckets.push({ le: le === \'+Inf\' ? Infinity : Number(le), cum: value });\n' +
            '    else if (kind === \'sum\') h.sum = value;\n' +
            '    else h.count = value;\n' +
            '  }\n' +
            '  for (const h of out.values()) h.buckets.sort((a, b) => a.le - b.le);\n' +
            '  return out;\n' +
            '}\n' +
            '\n' +
            'function phanVi(h, q) {\n' +
            '  if (!(q >= 0 && q <= 1)) return NaN;\n' +
            '  const b = h.buckets;\n' +
            '  if (b.length < 2) return NaN;\n' +
            '  const total = b[b.length - 1].cum;\n' +
            '  if (!(total > 0)) return NaN;\n' +
            '  const rank = q * total;\n' +
            '  let i = 0;\n' +
            '  while (i < b.length && b[i].cum < rank) i++;\n' +
            '  if (i === b.length - 1) return b[b.length - 2].le;   // rơi vào +Inf\n' +
            '  const tren = b[i].le;\n' +
            '  const duoi = i === 0 ? 0 : b[i - 1].le;\n' +
            '  const truoc = i === 0 ? 0 : b[i - 1].cum;\n' +
            '  const trong = b[i].cum - truoc;\n' +
            '  if (trong <= 0) return NaN;\n' +
            '  return duoi + (tren - duoi) * ((rank - truoc) / trong);\n' +
            '}\n',
        }),
      ],
    },
  ],
};
